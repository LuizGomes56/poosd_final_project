import { HttpResponse } from "../utils/http";
import { NextFunction, Request, Response } from "express";
declare const router: import("express-serve-static-core").Router;
/**
 * Used to unsafely cast the type of the functions defined within the controller object
 * into something accepted by ExpressJS. Never use the last parameter as all of our
 * controllers will be the last middleware in the chain. They're being used to define
 * the req.body input type, nothing else
 */
export declare function route(f: (req: Request, res: Response) => Promise<HttpResponse>): (req: any, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>>>;
export default router;
