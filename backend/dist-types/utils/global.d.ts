import { prisma } from "../index";
export type UserPayload = Omit<NonNullable<Awaited<ReturnType<typeof prisma.users.findFirst>>>, "password_hash">;
declare module "jsonwebtoken" {
    interface JwtPayload extends UserPayload {
    }
}
declare module "express" {
    interface Request {
        /**
         * Checks if the request body has the specified fields. If it doesn't,
         * the request is automatically rejected and returned back to the client
         * with a dedicated response. **The order of fields passed as inputs does not
         * matter**
         *
         * ### Follow the example of usage:
         * ```ts
         * const { field1, field2, field3, ... } = req.require("field1", "field2", "field3", ...);
         * ```
         */
        require<T extends Record<string, any>>(...field: (keyof T)[]): T;
    }
}
