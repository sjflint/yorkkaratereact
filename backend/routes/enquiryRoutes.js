import express from "express";
const router = express.Router();
import { getEnquirys, postEnquiry } from "../controllers/enquiryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router.route("/").post(postEnquiry).get(protect, admin, getEnquirys);

export default router;
