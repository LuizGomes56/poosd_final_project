import type { NextFunction, Request, Response } from "express";
import { BACKEND_ROUTES } from "../routes/methods";
import { SCHEMA } from "../schema";
import { HttpResponse } from "../utils/http";

/**
 * Helper functions to use on `req` object as method
 */
export interface ReqHelpers { }

/**
 * Helper functions to use on `res` object as method
 */
export interface ResHelpers { }

export const Middleware = {
    helpers: async (req: Request & ReqHelpers, res: Response & ResHelpers, next: NextFunction) => {
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
            return HttpResponse.NotFound()
                .message(`Parsing route path failed: ${req.originalUrl}`)
                .send(res);
        }

        try {
            const validator = SCHEMA[path!];
            if (validator === undefined) {
                return HttpResponse.NotImplemented()
                    .message(`Route: ${path} input schema not implemented`)
                    .send(res);
            }
            if (validator !== null) {
                const result = validator.safeParse(req.body);
                if (!result.success) {
                    let msg = `Unknown error on req.body`;
                    const first = result.error.issues?.[0];

                    if (first) {
                        msg = `Error: ${first?.path?.join(", ")} - ${first.message}`;
                    }

                    console.log(msg);

                    return HttpResponse.BadRequest().message(msg).send(res);
                }

                req.body = result.data;
            }
            next();
        } catch (e: any) {
            console.log(e.message);

            return HttpResponse.BadRequest()
                .message(e.message)
                .send(res);
        }
    }
}