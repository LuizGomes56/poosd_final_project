import { QuestionsController } from "../controllers/questions_controller.js";
import { Router } from "express";
import { route } from "./index.js";

const router = Router();

router.post("/create", route(QuestionsController.create));
router.post("/all", route(QuestionsController.all));
router.post("/search", route(QuestionsController.search));
router.patch("/update", route(QuestionsController.update));
router.delete("/delete", route(QuestionsController.delete));
router.post("/check", route(QuestionsController.check));
router.post("/get", route(QuestionsController.get));

export default router;
