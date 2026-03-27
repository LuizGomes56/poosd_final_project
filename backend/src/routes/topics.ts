import { TopicsController } from "../controllers/topics_controller";
import { Router } from "express";
import { route } from ".";

const router = Router();

router.post("/create", route(TopicsController.create));

export default router;