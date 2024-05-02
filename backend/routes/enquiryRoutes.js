import express from "express";
const router = express.Router();
import {
  getEnquirys,
  postEnquiry,
  deleteEnquiry,
} from "../controllers/enquiryController.js";
import { admin, protect } from "../middleware/authMiddleware.js";

router
  .route("/:id?")
  .delete(deleteEnquiry)
  .post(postEnquiry)
  .get(protect, admin, getEnquirys);

export default router;
