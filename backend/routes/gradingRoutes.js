import express from "express";
const router = express.Router();
import {
  postGradingApplication,
  getGradingDetails,
} from "../controllers/gradingController.cjs";
import { protect, instructor } from "../middleware/authMiddleware.js";

router
  .route("/:id")
  .post(protect, postGradingApplication)
  .get(protect, instructor, getGradingDetails);

export default router;
