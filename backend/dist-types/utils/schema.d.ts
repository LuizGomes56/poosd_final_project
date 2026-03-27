import { z } from "zod";
export declare const SCHEMA: {
    "users/login": z.ZodObject<{
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
    "users/logout": z.ZodUndefined;
    "users/register": z.ZodObject<{
        full_name: z.ZodString;
        email: z.ZodEmail;
        password: z.ZodString;
    }, z.core.$strip>;
};
export type InputSchema = {
    [K in keyof typeof SCHEMA]: z.infer<typeof SCHEMA[K]>;
};
