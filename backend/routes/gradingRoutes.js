import express from "express";
const router = express.Router();
import { postGradingApplication } from "../controllers/gradingController.cjs";
import { protect } from "../middleware/authMiddleware.js";

router.route("/:id").post(protect, postGradingApplication);

export default router;
