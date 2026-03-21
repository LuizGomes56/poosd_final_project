import { NextFunction, Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Dotenv, prisma } from "../index";
import { HttpStatus } from "../utils/http";
import { LoginBody, RegisterBody } from "../routes/types";

export const UsersController = {
    login: async (req: Request, res: Response, _: NextFunction) => {
        const { email, password } = req.require<LoginBody>("email", "password");

        const password_hash = bcrypt.hashSync(password, 10);
        const user = await prisma.users.findFirst({
            where: {
                email,
                password_hash,
            }
        });

        if (!user) {
            return {
                ok: false,
                status: HttpStatus.NotFound,
                message: "User does not exist. Check your email and password",
                body: {}
            }
        }

        const { password_hash: __, ...payload } = user;
        const token = jwt.sign(payload, Dotenv.jwt_secret);

        res.setHeader("token", token);

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User logged in successfully",
            body: {
                token: 312
            }
        }
    },
    logout: async (req: Request, res: Response, _: NextFunction) => {
        const token = res.getHeader("token");

        if (!token) {
            console.warn("Non-authenticated user is trying to logout");
        }

        res.removeHeader("token");

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User logged out successfully",
            body: {}
        }
    },
    register: async (req: Request, res: Response, _: NextFunction) => {
        const { full_name, email, password } = req.require<RegisterBody>("full_name", "email", "password");

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
                body: {}
            }
        }

        return {
            ok: true,
            status: HttpStatus.Ok,
            message: "User registered successfully",
            body: {}
        }
    }
};