import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Dotenv } from "../index.js";
import type { Controller } from "../types.js";
import { USERS } from "../model/users.js";
import { HttpResponse } from "../utils/http.js";

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
    verify: async function (req) {
        return HttpResponse.Ok().body(req.payload);
    }
} as const satisfies Controller["users"];
