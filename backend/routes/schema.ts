import { Routes } from "./methods";
import { RouteInputTypes, RouteReturnTypes } from "./types";

// Ignore the implementation, just put your mouse over this type
// and see the magic
export type Schema = {
    [K in keyof typeof Routes]: K extends `${infer R}/${infer F}`
    ? R extends keyof RouteReturnTypes
    ? F extends keyof RouteReturnTypes[R]
    ? R extends keyof RouteInputTypes
    ? F extends keyof RouteInputTypes[R]
    ? {
        method: typeof Routes[K],
        output: RouteReturnTypes[R][F],
        input: RouteInputTypes[R][F]
    }
    : never
    : never
    : never
    : never
    : never
}
