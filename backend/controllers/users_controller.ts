import { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Dotenv, prisma } from "../index";
import { HttpStatus } from "../utils/http";
import type { InputSchema } from "../utils/schema";

export const UsersController = {
    login: async function (
        req: Request,
        res: Response
    ) {
        const { email, password } = req.require<InputSchema["users/login"]>("email", "password");

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
        const token = jwt.sign(payload, Dotenv.jwt_secret);

        res.cookie("authorization", `Bearer ${token}`);

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User logged in successfully",
            body: { token }
        }
    },
    logout: async function (req: Request, res: Response) {
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
    register: async function (req: Request) {
        const { full_name, email, password } = req.require<InputSchema["users/register"]>("full_name", "email", "password");

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
};