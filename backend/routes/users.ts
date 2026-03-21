import { UsersController } from "../controllers/users_controller";
import { Router } from "express";
import { route } from ".";

const router = Router();

router.get("/logout", route(UsersController.logout));
router.post("/login", route(UsersController.login));
router.post("/register", route(UsersController.register));

export default router;