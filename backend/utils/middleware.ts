import { NextFunction, Response } from "express";
import { Routes } from "../routes/methods";
import { SCHEMA } from "./schema";
import { HttpResponse, HttpStatus } from "./http";
import { z } from "zod";

export const Middleware = {
    /**
     * Middleware to add the method `require` to the request object.
     * It will be available globally after this middleware is called,
     * and it basically checks if the request body has the specified fields.
     */
    require: async (req: any, res: Response, next: NextFunction) => {
        req.require = <T extends Record<string, any>>(...field: string[]) => {
            let result = {};
            for (const f of field) {
                const v = req.body[f];
                if (!v) {
                    throw new Error(`Missing field ${f}`)
                }
                result[f] = v;
            }
            return result as T;
        };
        next()
    },
    schema: async (req: any, res: Response, next: NextFunction) => {
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

        const path = getPath(req.originalUrl, Object.keys(Routes));
        // console.log("Validating input schema for route: ", path);
        if (!path) {
            console.error(`Path does not exist: ${path}`);
            return res.status(HttpStatus.NotFound).json({
                ok: false,
                status: HttpStatus.NotFound,
                message: `Parsing route path failed: ${req.originalUrl}`
            } as HttpResponse);
        }

        try {
            const validator = SCHEMA[path!];
            if (validator === undefined) {
                res.status(500).json({
                    ok: true,
                    message: `Route: ${path} input schema not implemented`
                } as HttpResponse);
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
                message: e?.message
            } as HttpResponse);
        }
    },

    auth: async (req: any, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers["authorization"];

        if (!authHeader) {
            return res.status(HttpStatus.Unauthorized).json({
                ok: false,
                status: HttpStatus.Unauthorized,
                message: "Missing token"
            } as HttpResponse);
        }

        const token = authHeader.split(" ")[1];

        if (!token) {
            return res.status(HttpStatus.Unauthorized).json({
                ok: false,
                status: HttpStatus.Unauthorized,
                message: "Invalid token format"
            } as HttpResponse);
        }

        // TODO: verify JWT (for now just accept it)
        // later you can use jwt.verify(token, SECRET)

        next();
    } catch (e: any) {
        return res.status(HttpStatus.Unauthorized).json({
            ok: false,
            status: HttpStatus.Unauthorized,
            message: "Unauthorized"
        } as HttpResponse);
    }
}
}
