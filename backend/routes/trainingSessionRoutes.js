import express from "express";
const router = express.Router();
import {
  getTrainingSessions,
  getMyTrainingSessions,
  addTrainingSession,
  deleteTrainingSession,
  switchTrainingSession,
  getMemberTrainingSessions,
} from "../controllers/trainingSessionController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").get(getTrainingSessions);
router.route("/myTrainingSessions").get(protect, getMyTrainingSessions);
router.route("/addsession").put(protect, addTrainingSession);
router.route("/deletesession").post(protect, deleteTrainingSession);
router.route("/switchsession").post(protect, switchTrainingSession);
router
  .route("/membertrainingsessions/:id")
  .get(protect, admin, getMemberTrainingSessions);

export default router;
