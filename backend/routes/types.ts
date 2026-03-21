import { UsersController } from "../controllers/users_controller";

type IsAny<T> = 0 extends (1 & T) ? true : false;

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
