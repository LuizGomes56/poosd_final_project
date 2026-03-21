import { NextFunction, Request, Response } from "express";
import { HttpResponse } from "./http";

export const Middleware = {
    require: (req: any, res: Response, next: NextFunction) => {
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
    }
}