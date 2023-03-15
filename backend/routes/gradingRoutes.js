import express from "express";
const router = express.Router();
import {
  postGradingApplication,
  getGradingDetails,
  postGradingResult,
  getGradingResults,
} from "../controllers/gradingController.cjs";
import {
  protect,
  instructor,
  adminOrInstructor,
} from "../middleware/authMiddleware.js";

router
  .route("/:id")
  .post(protect, postGradingApplication)
  .get(protect, instructor, getGradingDetails);

router
  .route("/results")
  .post(protect, adminOrInstructor, postGradingResult)
  .get(protect, getGradingResults);

export default router;
