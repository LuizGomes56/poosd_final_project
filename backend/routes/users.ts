import { UsersController } from "../controllers/users_controller";
import { Router } from "express";
import { serve } from ".";

const router = Router();

serve(router, UsersController, [
    ["get", "logout"],
    ["post", "login"],
    ["post", "register"],
])

export default router;