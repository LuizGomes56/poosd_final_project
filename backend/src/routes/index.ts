import users from "./users.js";
import questions from "./questions.js";
import topics from "./topics.js";
import { NextFunction, Router } from "express";
import { type HttpResponseBuilder, HttpResponse } from "../utils/http.js";
import { Middleware } from "../utils/middleware.js";

const router = Router();

router.use("/users", users);
router.use("/questions", Middleware.authentication, questions);
router.use("/topics", Middleware.authentication, topics);

/**
 * Used to unsafely cast the type of the functions defined within the controller object
 * into something accepted by ExpressJS. Never use the last parameter as all of our
 * controllers will be the last middleware in the chain. They're being used to define
 * the req.body input type, nothing else
 */

export function route(f: (req: any, res: any) => Promise<HttpResponseBuilder<any, any>>) {
    const name = f.name;

    return async (req: any, res: any, next: NextFunction) => {
        try {
            console.log(`Calling controller ${name}`);
            let data = await f(req, res);
            console.log(`Controller ${name} returned: `, data);

            return data.send(res);
        } catch (e: any) {
            console.error(`Controller ${name} threw an error: `, e.message);

            return HttpResponse.InternalServerError()
                .message(e?.message || `Something went wrong: ${String(e)}`)
                .send(res);
        }
    }
}

export default router;