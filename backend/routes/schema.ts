import { Routes } from "./methods";
import { RouteSchemas } from "./types";

/**
 * Makes the representation on-hover simpler for some objects
 */
type Simplify<T> = { [K in keyof T]: T[K] } & {};

/**
 * All of our available routes in this app
 */
type RouteKey = keyof typeof Routes & string;

/**
 * Finds the method, input and output types of our controllers
 */
type SchemaEntry<K extends RouteKey> =
    K extends `${infer R}/${infer F}`
    ? R extends keyof RouteSchemas
    ? F extends keyof RouteSchemas[R]
    ? Simplify<{
        method: (typeof Routes)[K];
    } & RouteSchemas[R][F]>
    : never
    : never
    : never;

/**
 * All of our implemented controllers, their methods, inputs and outputs
 */
export type Schema = {
    [K in RouteKey]: SchemaEntry<K>;
};