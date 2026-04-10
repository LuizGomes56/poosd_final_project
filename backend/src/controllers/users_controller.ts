import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Dotenv } from "../utils/env.js";
import type { Controller } from "../types.js";
import { USERS } from "../model/users.js";
import { HttpResponse } from "../utils/http.js";
import transporter from "../utils/mailer.js";
import { AUTH } from "../model/auth.js";

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

        if (!user) {
            return HttpResponse.NotFound().message("User does not exist");
        }

        const code = String(Math.floor(Math.random() * 1000000)).padStart(6, '0');

        await transporter.sendMail({
            from: Dotenv.email_sender,
            to: email,
            subject: 'EduCMS Account Email Verification',
            html: `
            <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
                <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: #ffffff; border-radius: 8px; overflow: hidden;">
                    <tr>
                    <td style="padding: 30px; text-align: center;">
                        <h2 style="margin: 0; color: #333;">Welcome to EduCMS</h2>
                        <p style="color: #555; font-size: 14px; margin-top: 10px;">
                        We're glad to have you! Please verify your account using the code below or by clicking the button.
                        </p>

                        <div style="margin: 20px 0; font-size: 22px; font-weight: bold; color: #222;">
                        ${code}
                        </div>

                        <a href="${Dotenv.domain}/reset_password/${code}"
                        style="display: inline-block; padding: 12px 20px; background-color: #4f46e5; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 14px; font-weight: bold;">
                        Verify Your Account
                        </a>

                        <p style="margin-top: 20px; font-size: 12px; color: #888;">
                        If you didn't request this, you can safely ignore this email.
                        </p>
                    </td>
                    </tr>
                </table>
            </div>
            `
        });

        // project.cop4331.cc:3000/api/users/forgot_password *Backend*
        // project.cop4331.cc/reset_password *Frontend*

        const auth = await AUTH.create({
            email,
            code,
            expires_in: Date.now() + 15 * 60 * 1000
        });

        if (!auth) {
            return HttpResponse.InternalServerError().message("Could not create verification code");
        }

        return HttpResponse.Ok();
    },
    reset_password: async function (req) {
        const { code, password } = req.body;

        const auth = await AUTH.findOne({ code }).lean();

        if (!auth) {
            return HttpResponse.BadRequest().message("Invalid verification code");
        }

        if (Date.now() > auth.expires_in) {
            return HttpResponse.NotFound().message("Verification code has expired");
        }

        const users = await USERS.findOneAndUpdate(
            { email: auth.email },
            { password_hash: bcrypt.hashSync(password, 10) }
        ).lean();

        // #[cold_path]
        if (!users) {
            return HttpResponse.NotFound().message("Email verification code was correct but could not find user");
        }

        return HttpResponse.Ok();
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
        const { email, user_id } = req.payload;

        const user = await USERS.findOne({ email, user_id }).lean();

        // User is authenticated, this should always fail (cold path)
        if (!user) {
            return HttpResponse.NotFound().message("[unlikely] User does not exist");
        }

        // If user is have already verified its email, there's no reason to keep going
        if (user.email_verified) {
            return HttpResponse.Unauthorized().message("Your email is already verified");
        }

        function newCode() {
            return String(Math.floor(Math.random() * 1000000)).padStart(6, '0');
        }

        let code = newCode();

        while (true) {
            try {
                await AUTH.create({
                    code,
                    email,
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

        await transporter.sendMail({
            from: Dotenv.email_sender,
            to: email,
            subject: 'EduCMS Account Email Verification',
            html: `
                <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 40px 0;">
                    <table align="center" width="100%" cellpadding="0" cellspacing="0" style="max-width: 500px; background: #ffffff; border-radius: 8px; overflow: hidden;">
                        <tr>
                        <td style="padding: 30px; text-align: center;">
                            <h2 style="margin: 0; color: #333;">Welcome to EduCMS</h2>
                            <p style="color: #555; font-size: 14px; margin-top: 10px;">
                            We're glad to have you. Use the verification code below to confirm your account.
                            </p>

                            <div style="margin: 24px 0; padding: 14px 20px; display: inline-block; background-color: #f8fafc; border: 1px solid #e5e7eb; border-radius: 6px; font-size: 24px; font-weight: bold; color: #222; letter-spacing: 2px;">
                            ${code}
                            </div>

                            <p style="margin-top: 20px; font-size: 12px; color: #888;">
                            If you did not request this, you can safely ignore this email.
                            </p>
                        </td>
                        </tr>
                    </table>
                </div>
            `
        });

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
