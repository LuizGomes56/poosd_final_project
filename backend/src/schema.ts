import { z } from "zod";
import type { Route } from "./types.js";

const S = z.object({
    UUID: z.uuid({ error: "Invalid UUID" }),
    JWT: z.jwt({ error: "Invalid JWT Token" }),
    NAME: z.string()
        .min(4, { error: "Name must be at least 4 characters long" })
        .max(64, { error: "Name must be at most 64 characters long" }),
    EMAIL: z.email({ error: "Invalid email" }),
    PASSWORD: z.string().min(4).max(32).describe("Password must be a string and be defined."),
    NOTHING: z.object({}),
}).shape;

export const SCHEMA = {
    "users/login": z.object({
        email: S.EMAIL,
        password: S.PASSWORD,
    }),
    "users/logout": S.NOTHING,
    "users/register": z.object({
        full_name: S.NAME,
        email: S.EMAIL,
        password: S.PASSWORD,
    }),
    "users/verify": S.NOTHING,
    "questions/create": S.NOTHING,
    "topics/create": S.NOTHING,
    "topics/all": S.NOTHING
} as const satisfies Record<(string & {}) | Route, Record<string, any>>;

export type InputSchema = {
    [K in keyof typeof SCHEMA]: z.infer<typeof SCHEMA[K]>
};