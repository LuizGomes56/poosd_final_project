import { TopicsController } from "../controllers/topics_controller.js";
import { Router } from "express";
import { route } from "./index.js";

const router = Router();

router.post("/create", route(TopicsController.create));
router.delete("/delete", route(TopicsController.delete));
router.put("/update", route(TopicsController.update));
router.get("/all", route(TopicsController.all));

export default router;