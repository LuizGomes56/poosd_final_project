import { UsersController } from "../controllers/users_controller.js";
import { Router } from "express";
import { route } from "./index.js";
import { Middleware } from "../utils/middleware.js";

const router = Router();

router.get("/logout", route(UsersController.logout));
router.post("/login", route(UsersController.login));
router.post("/register", route(UsersController.register));
router.get(
    "/verify",
    Middleware.authentication,
    route(UsersController.verify)
);
/*
 --> Add these routes to the correct router location. Here 
 --> we should have only things related to the current user
 Missing routes 
 dashboard/questions (get and post or update)
 dashboard/topics (get and post or update)
 dashboard/student (get and maybe create also feature to search)
 dashboard/student/progress (likely just a get method)
*/

export default router;