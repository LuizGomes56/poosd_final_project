import { QuestionsController } from "../controllers/questions_controller";
import { Router } from "express";
import { route } from ".";
import { Middleware } from "../utils/middleware";

const router = Router();

router.post("/create", route(QuestionsController.create));

export default router;