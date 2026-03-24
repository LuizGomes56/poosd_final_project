import e from "express";
import { UsersController } from "../controllers/users_controller";
import type { InputSchema } from "../utils/schema";
import type { Routes } from "./methods";

type IsAny<T> = 0 extends (1 & T) ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnknown<T> = unknown extends T
    ? IsAny<T> extends true
    ? false
    : [T] extends [unknown]
    ? true
    : false
    : false;

export type Route = Extract<keyof InputSchema, string>;

type PrefixName<K extends string> =
    K extends `${infer R}/${string}` ? R : never;

type RouteName<K extends string> =
    K extends `${string}/${infer F}` ? F : never;

export type GetSchema<
    M extends Record<PrefixName<Route>, Record<string, (...args: any[]) => any>>
> = {
        [K in Route]:
        K extends `${infer P}/${infer F}`
        ? P extends keyof M
        ? F extends keyof M[P]
        ? M[P][F] extends (...args: any[]) => any ? {
            method: typeof Routes[K];
            output: Awaited<ReturnType<M[P][F]>>;
            input: InputSchema[K];
        }
        : never
        : never
        : never
        : never
    };

export type Controllers = {
    users: typeof UsersController
};

/**
 * Export this to frontend. It has all the relevant information about our API
 */
export type SwaggerDocs = GetSchema<{
    users: typeof UsersController;
}>;