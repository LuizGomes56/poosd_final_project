import type { prisma } from "../index";
import type { ReqHelpers, ResHelpers } from "./middleware";

export type UserPayload = Omit<NonNullable<Awaited<ReturnType<typeof prisma.users.findFirst>>>, "password_hash">;

declare module "jsonwebtoken" {
    interface JwtPayload extends UserPayload { }
}

declare module "express" {
    interface Request extends ReqHelpers { }
    interface Response extends ResHelpers { }
}
