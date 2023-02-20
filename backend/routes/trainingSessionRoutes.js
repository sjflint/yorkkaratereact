import express from "express";
const router = express.Router();
import {
  getTrainingSessions,
  getMyTrainingSessions,
  addTrainingSession,
  deleteTrainingSession,
  switchTrainingSession,
  getMemberTrainingSessions,
  createTimetableSession,
  deleteTimetableSession,
  updateTimetableSession,
  getTrainingSessionById,
  trainingSessionCancelled,
  postWaitingList,
} from "../controllers/trainingSessionController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router
  .route("/")
  .get(getTrainingSessions)
  .post(protect, admin, createTimetableSession);
router.route("/myTrainingSessions").get(protect, getMyTrainingSessions);
router.route("/addsession").put(protect, addTrainingSession);
router.route("/deletesession").post(protect, deleteTrainingSession);
router.route("/switchsession").post(protect, switchTrainingSession);
router.route("/waitinglist").post(postWaitingList);
router
  .route("/membertrainingsessions/:id")
  .get(protect, admin, getMemberTrainingSessions);
router
  .route("/:id")
  .get(getTrainingSessionById)
  .delete(protect, admin, deleteTimetableSession)
  .put(protect, admin, updateTimetableSession)
  .post(protect, admin, trainingSessionCancelled);

export default router;
