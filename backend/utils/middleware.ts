import type { NextFunction, Request, Response } from "express";
import { BACKEND_ROUTES } from "../routes/methods";
import { SCHEMA } from "../schema";
import { type HttpResponse, HttpStatus } from "./http";

/**
 * Helper functions to use on `req` object as method
 */
export interface ReqHelpers { }

/**
 * Helper functions to use on `res` object as method
 */
export interface ResHelpers {
    unimplemented: () => HttpResponse
}

export const Middleware = {
    helpers: async (req: Request, res: Response, next: NextFunction) => {
        res.unimplemented = () => {
            return {
                ok: false,
                status: HttpStatus.NotImplemented,
                message: "This route was not yet implemented"
            }
        };
        next()
    },
    /**
     * Dynamically checks which route was called and verifies if `req.body` is valid
     * and if it is, yields control to the next middleware, which is usually the controller
     * itself, or an authentication verifier
     */
    schema: async (req: Request, res: Response, next: NextFunction) => {
        function getPath(path: string, routes: string[]) {
            const cleanPath = path.replace(/^\/api\//, "").split("?")[0];
            let bestMatch: string | null = null;
            for (const route of routes) {
                if (cleanPath.startsWith(route)) {
                    if (!bestMatch || route.length > bestMatch.length) {
                        bestMatch = route;
                    }
                }
            }
            return bestMatch || null;
        };

        const path = getPath(req.originalUrl, Object.keys(BACKEND_ROUTES));
        // console.log("Validating input schema for route: ", path);
        if (!path) {
            console.error(`Path does not exist: ${path}`);
            return res.status(HttpStatus.NotFound).json({
                ok: false,
                status: HttpStatus.NotFound,
                message: `Parsing route path failed: ${req.originalUrl}`,
                body: {}
            } satisfies HttpResponse);
        }

        try {
            const validator = SCHEMA[path!];
            if (validator === undefined) {
                res.status(HttpStatus.InternalServerError).json({
                    ok: true,
                    status: HttpStatus.InternalServerError,
                    message: `Route: ${path} input schema not implemented`,
                    body: {}
                } satisfies HttpResponse);
                return;
            }
            if (validator !== null) {
                const result = validator.safeParse(req.body);
                if (!result.success) {
                    let msg = `Unknown error on req.body`;
                    if (result.error.issues?.[0]) {
                        msg = `${result.error.issues?.[0]?.path?.join(", ")} - ${result.error.issues[0].message}`;
                    }
                    console.log(result.error.issues?.[0]);
                    throw new Error(`Error on: ${msg}, body: ${JSON.stringify(req.body)}`);
                }
                req.body = result.data;
            }
            next();
        } catch (e: any) {
            console.log(e.message);
            res.status(HttpStatus.BadRequest).json({
                ok: false,
                status: HttpStatus.BadRequest,
                message: e?.message,
                body: {}
            } satisfies HttpResponse);
        }
    }
}