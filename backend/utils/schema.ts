import { z } from "zod";
import type { Controllers } from "../routes/types";

const R = z.object({
    UUID: z.uuid({ error: "Invalid UUID" }),
    JWT: z.jwt({ error: "Invalid JWT Token" }),
    NAME: z.string()
        .min(4, { error: "Name must be at least 4 characters long" })
        .max(256, { error: "Name must be at most 256 characters long" }),
    EMAIL: z.email({ error: "Invalid email" }),
    PASSWORD: z.string().min(4).max(50).describe("Password must be a string and be defined."),
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
    })
};

export type InputSchema = {
    [K in keyof typeof SCHEMA]: z.infer<typeof SCHEMA[K]>
};

/**
 * If any property is `false`, you have not implemented the input schema of that route
 * use `z.object({})` or `R.NOTHING` if that route expects nothing
 */
type CheckSchema = {
    [K in keyof Controllers & string]:
    Controllers[K] extends Record<string, any>
    ? {
        [F in keyof Controllers[K] & string]:
        `${K}/${F}` extends keyof InputSchema ? true : false
    }
    : never
};

const c: CheckSchema = {} as any;

type AssertCompiles = {
    [K in keyof CheckSchema]: {
        [F in keyof CheckSchema[K] & string]: CheckSchema[K][F] extends true
        ? true
        : `
        Route '${K}/${F}' does not have an input schema defined. 
        To fix this issue add a key '${K}/${F}' to 'const SCHEMA'
        and provide its input arguments. Use 'R.NOTHING' if the 
        route is a GET method, or does not need any user input
        `
    }
}

/**
 * You can't compile the code if you haven't defined the input schema
 * for some of our routes in the API. DO IT!
 */
c satisfies AssertCompiles