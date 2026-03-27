import { UsersController } from "../controllers/users_controller";
import { Router } from "express";
import { route } from ".";
import { Middleware } from "../utils/middleware";

const router = Router();

router.get("/logout", route(UsersController.logout));
router.post("/login", route(UsersController.login));
router.post("/register", route(UsersController.register));
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