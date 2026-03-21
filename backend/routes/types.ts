import { UsersController } from "../controllers/users_controller";

type IsAny<T> = 0 extends (1 & T) ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnknown<T> = unknown extends T
    ? IsAny<T> extends true
    ? false
    : [T] extends [unknown]
    ? true
    : false
    : false;

/**
 * Return and input type definitions of our routes, given a controller
 */
export type GetSchema<C extends Record<string, (...args: any[]) => any>> = {
    [K in keyof C]: {
        output: Awaited<ReturnType<C[K]>>,
        input: ThisParameterType<C[K]> extends infer T
        ? IsAny<T> extends true ? never : T
        : never
    }
}

export type RouteSchemas = {
    users: GetSchema<typeof UsersController>
}
