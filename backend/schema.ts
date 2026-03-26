import { z } from "zod";
import type { Route } from "./routes/types";

const R = z.object({
    UUID: z.uuid({ error: "Invalid UUID" }),
    JWT: z.jwt({ error: "Invalid JWT Token" }),
    NAME: z.string()
        .min(4, { error: "Name must be at least 4 characters long" })
        .max(64, { error: "Name must be at most 64 characters long" }),
    EMAIL: z.email({ error: "Invalid email" }),
    PASSWORD: z.string().min(4).max(32).describe("Password must be a string and be defined."),
    NOTHING: z.undefined({ error: "This route does not expect any input" }),
}).shape;

export const SCHEMA = {
    "users/login": z.object({
        email: R.EMAIL,
        password: R.PASSWORD,
    }),
    "users/logout": R.NOTHING,
    "users/register": z.object({
        full_name: R.NAME,
        email: R.EMAIL,
        password: R.PASSWORD,
    }),
    "questions/create": R.NOTHING,
    "topics/create": R.NOTHING
} as const satisfies Record<Route, any>;

export type InputSchema = {
    [K in keyof typeof SCHEMA]: z.infer<typeof SCHEMA[K]>
};