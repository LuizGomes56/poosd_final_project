import { NextFunction, Response } from "express";
export declare const Middleware: {
    /**
     * Middleware to add the method `require` to the request object.
     * It will be available globally after this middleware is called,
     * and it basically checks if the request body has the specified fields.
     */
    require: (req: any, res: Response, next: NextFunction) => Promise<void>;
    schema: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
    auth: (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
};
