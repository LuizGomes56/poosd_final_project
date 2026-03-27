import type { User } from "../model/users";

export type UserPayload = Omit<User, "password_hash">;

declare module "jsonwebtoken" {
    interface JwtPayload extends UserPayload { }
}