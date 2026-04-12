import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken";
import type { Controller } from "../types.js";
import { USERS } from "../model/users.js";
import { HttpResponse } from "../utils/http.js";
import { sendMail } from "../utils/mailer.js";
import { AUTH } from "../model/auth.js";
import { PASSWORD_RESETS } from "../model/password_resets.js";
import { Dotenv } from "../utils/env.js";

function newCode() {
    return crypto.randomInt(0, 1000000).toString().padStart(6, "0");
}

function logDevCode(label: string, email: string, code: string) {
    console.warn(`[mailer disabled] ${label} for ${email}: ${code}`);
}

export const UsersController = {
    login: async function (req, res) {
        const { email, password } = req.body;
        const user = await USERS.findOne({ email }).lean();

        if (!user) {
            return HttpResponse.NotFound()
                .message("User does not exist. Verify the provided email address");
        }

        const { password_hash, ...payload } = user;

        if (!bcrypt.compareSync(password, password_hash)) {
            return HttpResponse.Unauthorized().message("Password is incorrect")
        }

        const token = jwt.sign({
            user_id: payload._id.toString(),
            ...payload
        } satisfies jwt.JwtPayload, Dotenv.jwt_secret);

        res.cookie("authorization", `Bearer ${token}`);
        return HttpResponse.Ok().message("User logged in successfully").body({ token, ...payload });
    },
    logout: async function (req, res) {
        const token = req.jwt();

        if (!token) {
            console.warn("Non-authenticated user is trying to logout");
        }

        res.clearCookie("authorization");

        return HttpResponse.Ok().message("User logged out successfully");
    },
    register: async function (req) {
        const { full_name, email, password } = req.body;

        const password_hash = bcrypt.hashSync(password, 10);

        try {
            const doc = await USERS.create({
                full_name,
                email,
                password_hash,
            });

            const user = doc.toObject();

            if (!user) {
                return HttpResponse
                    .InternalServerError()
                    .message("User already exists or there were an error creating a new account")
            }

            return HttpResponse.Ok().message("User registered successfully");
        } catch (e) {
            // We're using try-catch blocks here just to capture this very specific error
            // that tells us if the email is already registered
            if (e instanceof Error && e.message.startsWith("E11000")) {
                return HttpResponse
                    .InternalServerError()
                    .message("This email is already in use");
            }
            // If it is any other generic error, we don't want to give an specific message
            // about the reason of the error, so just throw it and let the router handler
            // manage this error
            throw e;
        }
    },
    forgot_password: async function (req) {
        const { email } = req.body;

        const user = await USERS.findOne({ email }).lean();

        // Always respond with the same message to avoid account enumeration.
        const response = HttpResponse.Ok().message(
            "If an account exists for that email, a password reset code has been sent."
        );

        if (!user) {
            return response;
        }

        const code = newCode();

        await PASSWORD_RESETS.findOneAndUpdate(
            { email },
            {
                code,
                expires_in: Date.now() + 15 * 60 * 1000
            },
            {
                upsert: true,
                new: true,
                setDefaultsOnInsert: true
            }
        );

        const sent = await sendMail({
            from: Dotenv.email_sender,
            to: email,
            subject: "EduCMS Password Reset Code",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Password reset requested</h2>
                    <p>Enter this code in the app to choose a new password. It expires in 15 minutes.</p>
                    <div
                        style="display: inline-block; padding: 12px 20px; background-color: #111827; color: #ffffff; border-radius: 8px; font-size: 28px; font-weight: bold; letter-spacing: 6px;">
                        ${code}
                    </div>
                    <p style="margin-top: 20px; font-size: 12px; color: #888;">
                        If you did not request this, you can ignore this email.
                    </p>
                </div>
            `
        });

        if (!sent) {
            logDevCode("Password reset code", email, code);
        }

        return response;
    },
    reset_password: async function (req) {
        const { email, code, password } = req.body;

        const passwordReset = await PASSWORD_RESETS.findOne({
            email
        }).lean();

        if (!passwordReset) {
            return HttpResponse.BadRequest().message("Invalid or expired reset code");
        }

        const received = Buffer.from(code);
        const expected = Buffer.from(passwordReset.code);

        if (received.length !== expected.length || !crypto.timingSafeEqual(received, expected)) {
            return HttpResponse.BadRequest().message("Invalid or expired reset code");
        }

        if (Date.now() > passwordReset.expires_in) {
            await PASSWORD_RESETS.deleteOne({ _id: passwordReset._id });
            return HttpResponse.BadRequest().message("Invalid or expired reset code");
        }

        const password_hash = bcrypt.hashSync(password, 10);

        const user = await USERS.findOneAndUpdate(
            { email: passwordReset.email },
            { password_hash }
        ).lean();

        await PASSWORD_RESETS.deleteMany({ email: passwordReset.email });

        if (!user) {
            return HttpResponse.NotFound().message("User does not exist");
        }

        return HttpResponse.Ok().message("Password reset successfully");
    },
    verify: async function (req) {
        return HttpResponse.Ok().body(req.payload);
    },
    /**
     * Frontend has a button to verify your email (optional) and when you click on it, 
     * you're calling this route
     * It is going to send you a verification email, which is going to have a button inside.
     * This button is going to call "/?" route
     * ?verify=true
     * -> We request a token for email verify
     * -> we send token as param
     * -> token expires
     * or
     * -> send jwt token (but this is unsafe or more precisely unsecure)
     * ?verify_email=(email_verify_token)
     */
    // user id, email verify token, blacklisted

    //Basically Authenticator numbers instead of token button
    // We might have to fix the authentication schema 
    //Missing password reset
    //Missing view pages for TF and FRQ
    //Missing dashboard implementation
    // Generating auth codes (prob math.random()) - Code is going to have 6 characters
    send_email_verification: async function (req) {
        const { email, full_name, user_id } = req.payload;

        const user = await USERS.findOne({ email, user_id }).lean();

        // User is authenticated, this should always fail (cold path)
        if (!user) {
            return HttpResponse.NotFound().message("[unlikely] User does not exist");
        }

        // If user is have already verified its email, there's no reason to keep going
        if (user.email_verified) {
            return HttpResponse.Unauthorized().message("Your email is already verified");
        }

        let code = newCode();

        while (true) {
            try {
                await AUTH.create({
                    code,
                    email,
                    full_name,
                    expires_in: new Date(Date.now() + 60 * 10 * 1000).getTime()
                });
                break;
            } catch (e) {
                if (e instanceof Error && e.message.startsWith("E11000")) {
                    code = newCode();
                    continue;
                }
                throw e;
            }
        }

        const sent = await sendMail({
            from: Dotenv.email_sender,
            to: email,
            subject: 'EduCMS Account Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center;">
                    <h2>Welcome to EduCMS!</h2>
                    <p>Click the button below to verify your account:</p>
                    <span>Code</span>
                    <p>${code}</p>
                </div>
            `
        });

        if (!sent) {
            logDevCode("Email verification code", email, code);
        }

        return HttpResponse.Ok().message("Verification email sent successfully");
    },
    verify_email: async function (req) {
        const { code } = req.body;
        const { email, user_id } = req.payload;

        const auth = await AUTH.findOne({ code, email }).lean();

        if (!auth) {
            return HttpResponse.BadRequest().message("Invalid verification code");
        }

        if (Date.now() > auth.expires_in) {
            return HttpResponse.NotFound().message("Verification code has expired");
        }

        const users = await USERS.findOneAndUpdate(
            { email, user_id },
            { email_verified: true }
        ).lean();

        if (!users) {
            return HttpResponse.NotFound().message("Email verification code was correct but could not find user");
        }

        return HttpResponse.Ok();
    }
} as const satisfies Controller["users"];
