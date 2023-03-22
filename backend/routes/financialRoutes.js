import express from "express";
const router = express.Router();
import {
  deleteMonthlyCost,
  getFinancialDetails,
  getMonthlyCosts,
  updateBelts,
  updateFinancialDetails,
  updateMonthlyCost,
} from "../controllers/financialController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router
  .route("/")
  .post(protect, admin, updateFinancialDetails)
  .get(getFinancialDetails)
  .put(protect, admin, updateBelts);

router
  .route("/monthlycosts")
  .get(protect, admin, getMonthlyCosts)
  .post(protect, admin, updateMonthlyCost);

router.route("/monthlycosts/:id").delete(protect, admin, deleteMonthlyCost);

export default router;
