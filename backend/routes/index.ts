import users from "./users";
import { HttpResponse, HttpStatus } from "../utils/http";
import { NextFunction, Request, Response, Router } from "express";

const router = Router();

export function route(f: (req: Request, res: Response, next: NextFunction) => Promise<HttpResponse>) {
    console.log(f.name);
    return async (req: any, res: any, next: NextFunction) => {
        try {
            const data = await f(req, res, next);
            console.log(data);
            return res.status(data.status).json(data);
        } catch (e) {
            console.error(e);
            return res.status(HttpStatus.InternalServerError).json(e);
        }
    }
}

router.use("/users/", users);

export default router;