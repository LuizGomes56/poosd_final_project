import { UsersController } from "../controllers/users_controller";
import type { InputSchema } from "../utils/schema";

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

type RoutesInPrefix<P extends string> =
    Extract<Route, `${P}/${string}`>;

export type GetSchema<
    M extends Record<PrefixName<Route>, Record<string, (...args: any[]) => any>>
> = {
    [P in keyof M & PrefixName<Route>]: {
        [K in RoutesInPrefix<P> as K extends `${P}/${infer F}` ? F : never]:
        RouteName<K> extends keyof M[P]
        ? {
            output: Awaited<ReturnType<M[P][RouteName<K>]>>;
            input: InputSchema[K];
        }
        : never;
    };
};

export type Controllers = {
    users: typeof UsersController
};

export type RouteSchemas = GetSchema<Controllers>;