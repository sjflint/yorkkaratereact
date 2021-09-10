import express from "express";
const router = express.Router();
import { postEnquiry } from "../controllers/enquiryController.js";

router.route("/").post(postEnquiry);

export default router;
