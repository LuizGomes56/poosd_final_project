import { NextFunction, Response } from "express";

export const Middleware = {
    /**
     * Middleware to add the method `require` to the request object.
     * It will be available globally after this middleware is called,
     * and it basically checks if the request body has the specified fields.
     */
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