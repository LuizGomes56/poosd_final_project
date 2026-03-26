import users from "./users";
import questions from "./questions";
import topics from "./topics";
import { HttpStatus } from "../utils/http";
import { NextFunction, Router } from "express";
import { ControllerFn } from "./types";

const router = Router();

router.use("/users", users);
router.use("/questions", questions);
router.use("/topics", topics);

/**
 * Used to unsafely cast the type of the functions defined within the controller object
 * into something accepted by ExpressJS. Never use the last parameter as all of our
 * controllers will be the last middleware in the chain. They're being used to define
 * the req.body input type, nothing else
 */
export function route(f: ControllerFn<any>) {
    const name = f.name;
    console.log(name);
    return async (req: any, res: any, next: NextFunction) => {
        try {
            let data = await f(req, res);
            console.log(`Controller ${name} returned: `, data);

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

export default router;