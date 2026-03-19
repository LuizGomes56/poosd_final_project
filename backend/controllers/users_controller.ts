import { NextFunction, Request, Response } from "express";
import { PrismaClient } from "../generated/prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

export const UsersController = {
    login: async (req: Request, res: Response, _: NextFunction) => {
        const { email, password } = req.body;

        const password_hash = bcrypt.hashSync(password, 10);

        const user = await prisma.users.findFirst({
            where: {
                email,
                password_hash,
            }
        });
    },

    logout: async (req: Request, res: Response, _: NextFunction) => {

    }
};