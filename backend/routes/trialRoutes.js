import express from "express";
import {
  getTrial,
  payTrial,
  registerTrial,
} from "../controllers/registerTrialControllers.js";
const router = express.Router();

router.route("/").post(registerTrial);
router.route("/:id").get(getTrial).put(payTrial);

export default router;
