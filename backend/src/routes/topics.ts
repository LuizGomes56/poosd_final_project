import { TopicsController } from "../controllers/topics_controller.js";
import { Router } from "express";
import { route } from "./index.js";

const router = Router();

router.post("/create", route(TopicsController.create));

export default router;