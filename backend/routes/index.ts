import { UsersController } from "../controllers/users_controller";
import { Router } from "express";

const router = Router();

router.get("/logout", /* Controller.logout */);
router.post("/login", UsersController.login);
router.post("/register", /*Controller.register*/)

export default router;