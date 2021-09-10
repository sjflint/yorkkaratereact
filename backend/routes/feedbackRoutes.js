import express from "express";
const router = express.Router();
import { sendFeedback } from "../controllers/sendFeedbackController.js";

router.route("/").post(sendFeedback);

export default router;
