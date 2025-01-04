import express from "express";
const router = express.Router();
import {
  getTrainingVideos,
  getTrainingVideoById,
  createTrainingVideo,
  deleteTrainingVideo,
  updateTrainingVideo,
  getTrainingVideosByGrade,
  getAllTrainingVideos,
} from "../controllers/trainingVideoController.js";
import { protect, instructor } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getTrainingVideos)
  .post(protect, instructor, createTrainingVideo);
router.route("/all").get(getAllTrainingVideos);
router
  .route("/:id")
  .get(getTrainingVideoById)
  .delete(protect, instructor, deleteTrainingVideo)
  .put(protect, instructor, updateTrainingVideo);
router.route("/grade/:grade").get(getTrainingVideosByGrade);

export default router;
