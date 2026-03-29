import { QuestionsController } from "../controllers/questions_controller.js";
import { Router } from "express";
import { route } from "./index.js";

const router = Router();

router.post("/create", route(QuestionsController.create));

export default router;