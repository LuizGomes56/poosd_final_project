import type { UsersController } from "../controllers/users_controller";
import type { InputSchema } from "../schema";
import type { BACKEND_ROUTES } from "./methods";
import type { QuestionsController } from "../controllers/questions_controller";
import type { TopicsController } from "../controllers/topics_controller";
import type { HttpResponse } from "../utils/http";
import type { Response, Request } from "express";
import type { ReqHelpers, ResHelpers } from "../utils/middleware";

type IsAny<T> = 0 extends (1 & T) ? true : false;
type IsNever<T> = [T] extends [never] ? true : false;
type IsUnknown<T> = unknown extends T
    ? IsAny<T> extends true
    ? false
    : [T] extends [unknown]
    ? true
    : false
    : false;

export type Route = keyof typeof BACKEND_ROUTES;

type PrefixName<K extends string> =
    K extends `${infer R}/${string}` ? R : never;

type PostfixName<R extends string> =
    R extends `${string}/${infer F}` ? F : never;

export type GetSchema<
    M extends Record<PrefixName<Route>, Record<string, (...args: any[]) => any>>
> = {
        [K in Route]:
        K extends `${infer P}/${infer F}`
        ? P extends keyof M
        ? F extends keyof M[P]
        ? M[P][F] extends (...args: any[]) => any ? {
            method: typeof BACKEND_ROUTES[K];
            output: Awaited<ReturnType<M[P][F]>>;
            input: InputSchema[K];
        }
        : `Route ${K} does not match type 'Controllers'. Did you forget to add its definition?`
        : `Key ${P} should be a valid subroute as defined in the keys of type 'Controllers' below`
        : `Function ${F} should be a valid method as in the values of type 'Controllers'`
        : `Route ${K} must be a function as it will be used as a method`;
    };

export type Controllers = {
    users: typeof UsersController;
    questions: typeof QuestionsController;
    topics: typeof TopicsController;
};

export type ControllerFn<R extends keyof InputSchema> = (
    req: Omit<Request, "body"> & { body: InputSchema[R] } & ReqHelpers,
    res: Response & ResHelpers
) => Promise<HttpResponse>

type RoutesInPrefix<P extends string> =
    Extract<Route, `${P}/${string}`>;

/**
 * Adds type checking to our controllers. It will prevent you from
 * adding unknown return types to our controllers, unknown arguments
 * or any other extraneous information.
 * For example, if your controller is returning something that doesn't 
 * include a property defined in `HttpResponse`, your code will not compile.
 * 
 * Example:
 * ```ts
 * return {
 *     // It will thrown an error because `ok` is mandatory
 *     // ok: true,
 *     status: HttpStatus.Ok,
 *     message: "User logged out successfully",
 * }
 * ```
 */
export type Controller = {
    [P in PrefixName<Route>]: {
        [R in RoutesInPrefix<P> as PostfixName<R>]: ControllerFn<R>
    }
};

/**
 * Export this to frontend. It has all the relevant information about our API
 */
export type SwaggerDocs = GetSchema<Controllers>;
