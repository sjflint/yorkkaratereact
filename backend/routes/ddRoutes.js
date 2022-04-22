import express from "express";
const router = express.Router();
import {
  cancelDirectDebit,
  ddSetup,
  updateSubscription,
  updateDirectDebit,
  createPayment,
  cancelPayment,
} from "../controllers/ddController.cjs";
import { protect } from "../middleware/authMiddleware.js";

router.route("/setup").post(ddSetup);
router.route("/cancel").post(protect, cancelDirectDebit);
router.route("/updatesubscription").post(protect, updateSubscription);
router.route("/updatedirectdebit").post(updateDirectDebit);
router.route("/createpayment").post(protect, createPayment);
router.route("/cancelpayment").post(protect, cancelPayment);

export default router;
