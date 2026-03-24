import { z } from "zod";
import { type Schema } from "../routes/schema";

const R = z.object({
    UUID: z.uuid({ message: "Invalid UUID" }),
    JWT: z.jwt({ message: "Invalid JWT Token" }),
    NAME: z.string()
        .min(4, { message: "Name must be at least 4 characters long" })
        .max(256, { message: "Name must be at most 256 characters long" }),
    EMAIL: z.email({ message: "Invalid email" }),
    PASSWORD: z.string().min(4).max(50).describe("Password must be a string and be defined."),
}).shape;

export const SCHEMA = {
    "users/login": z.object({
        email: R.EMAIL,
        password: R.PASSWORD,
    }),
    "users/logout": z.object({}),
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
 * use `z.object({})` if that route expects nothing
 */
type RouteInputSchemaDefinition = {
    [K in keyof Schema]: K extends keyof InputSchema ? true : false
};

const c: RouteInputSchemaDefinition = {} as any;

type AssertCompiles = {
    [K in keyof RouteInputSchemaDefinition]: RouteInputSchemaDefinition[K] extends true ? true : `Route ${K} not defined in input schema`
}

/**
 * You can't compile the code if you haven't defined the input schema
 * for some of our routes in the API. DO IT!
 */
c satisfies AssertCompiles