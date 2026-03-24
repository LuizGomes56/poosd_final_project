import users from "./users";
import { HttpResponse, HttpStatus } from "../utils/http";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

/**
 * Used to unsafely cast the type of the functions defined within the controller object
 * into something accepted by ExpressJS. Never use the last parameter as all of our
 * controllers will be the last middleware in the chain. They're being used to define
 * the req.body input type, nothing else
 */
function route(f: (req: Request, res: Response) => Promise<HttpResponse>) {
    const name = f.name;
    console.log(name);
    return async (req: any, res: Response, next: NextFunction) => {
        try {
            let data = await f(req, res);
            console.log(data);

            if (!data.body) {
                data.body = {};
            }

            return res.status(data.status).json(data);
        } catch (e: any) {
            console.error(`Controller ${name} threw an error: `, e.message);
            return res.status(HttpStatus.InternalServerError).json({
                ok: false,
                status: HttpStatus.InternalServerError,
                message: e?.message || `Something went wrong: ${String(e)}`,
                body: {},
            });
        }
    }
}

/**
 * 
 * @param router use import("express").Router()
 * @param controller import the controller file constant object 
 * @param routes array-tuple of [method, function] where method are the
 * HTTP methods (get, post, put, delete, patch), and the function is one of the
 * keys of the controller provided in the second argument
 * 
 * **Note that all the routes will be assigned as `/${function_name}`**
 */
export function serve<C extends Record<string, any>>(router: Router, controller: C, routes: [method: "get" | "post" | "put" | "delete" | "patch", action: keyof C][]) {
    for (const [method, action] of routes) {
        router[method](`/${String(action)}`, route(controller[action]));
    }
}

router.use("/users", users);

export default router;