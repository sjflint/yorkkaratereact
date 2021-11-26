import express from "express";
const router = express.Router();
import {
  getLessonPlans,
  deleteLessonPlan,
  createLessonPlan,
  updateLessonPlan,
  getLessonPlanById,
} from "../controllers/lessonPlanController.js";
import { protect, instructor } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getLessonPlans)
  .post(protect, instructor, createLessonPlan);
router
  .route("/:id")
  .delete(protect, instructor, deleteLessonPlan)
  .put(protect, instructor, updateLessonPlan)
  .get(protect, instructor, getLessonPlanById);

export default router;
