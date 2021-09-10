import express from "express";
const router = express.Router();
import {
  getTrainingVideos,
  getTrainingVideoById,
} from "../controllers/trainingVideoController.js";

router.route("/").get(getTrainingVideos);
router.route("/:id").get(getTrainingVideoById);

export default router;
