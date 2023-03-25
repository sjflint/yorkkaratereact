import express from "express";
const router = express.Router();
import {
  postGradingApplication,
  getGradingDetails,
  postGradingResult,
  getGradingResults,
  updateScore,
} from "../controllers/gradingController.cjs";
import {
  protect,
  instructor,
  adminOrInstructor,
} from "../middleware/authMiddleware.js";

router.route("/score").post(protect, adminOrInstructor, updateScore);

router
  .route("/results")
  .post(protect, adminOrInstructor, postGradingResult)
  .get(protect, getGradingResults);

router
  .route("/:id")
  .post(protect, postGradingApplication)
  .get(protect, instructor, getGradingDetails);

export default router;
