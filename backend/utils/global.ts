import { prisma } from "../index";
import { HttpResponse } from "./http";

export type UserPayload = Omit<NonNullable<Awaited<ReturnType<typeof prisma.users.findFirst>>>, "password_hash">;

declare module "jsonwebtoken" {
    interface JwtPayload extends UserPayload { }
}

declare module "express" {
    interface Request {
        require<T extends Record<string, any>>(...field: string[]): T;
    }
}