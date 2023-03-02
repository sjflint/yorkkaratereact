import express from "express";
import {
  getAllTrials,
  getTrial,
  payTrial,
  registerTrial,
} from "../controllers/registerTrialControllers.js";
import { admin, protect } from "../middleware/authMiddleware.js";
const router = express.Router();

router.route("/").post(registerTrial).get(protect, admin, getAllTrials);
router.route("/:id").get(getTrial).put(payTrial);

export default router;
