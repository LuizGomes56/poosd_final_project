import type { User } from "../model/users.js";

export type UserPayload = Omit<User, "password_hash"> & { user_id: string };

declare module "jsonwebtoken" {
    interface JwtPayload extends UserPayload { }
}