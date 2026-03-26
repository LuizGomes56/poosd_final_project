import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Dotenv, prisma } from "../index";
import { HttpStatus } from "../utils/http";
import type { Controller } from "../routes/types";

export const UsersController = {
    login: async function (req, res) {
        const { email, password } = req.body;

        const user = await prisma.users.findFirst({
            where: {
                email,
            }
        });

        if (!user) {
            return {
                ok: false,
                status: HttpStatus.NotFound,
                message: "User does not exist"
            }
        }

        if (!bcrypt.compareSync(password, user.password_hash)) {
            return {
                ok: false,
                status: HttpStatus.Unauthorized,
                message: "Password is incorrect"
            }
        }

        const { password_hash: _, ...payload } = user;
        const token = jwt.sign(payload satisfies jwt.JwtPayload, Dotenv.jwt_secret);

        res.cookie("authorization", `Bearer ${token}`);

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User logged in successfully",
            body: { token }
        }
    },
    logout: async function (req, res) {
        const token = req.headers.authorization?.trim().replace("Bearer ", "");

        if (!token) {
            console.warn("Non-authenticated user is trying to logout");
        }

        res.clearCookie("authorization");

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User logged out successfully",
        }
    },
    register: async function (req) {
        const { full_name, email, password } = req.body;

        const password_hash = bcrypt.hashSync(password, 10);
        const user = await prisma.users.create({
            data: {
                full_name,
                email,
                password_hash,
            }
        });

        if (!user) {
            return {
                ok: false,
                status: HttpStatus.InternalServerError,
                message: "User already exists or there were an error creating a new account",
            }
        }

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User registered successfully",
        }
    }
} as const satisfies Controller["users"];
