import express from "express";
const router = express.Router();
import {
  addAttendeeRecord,
  addExtraAttendeeRecord,
  getAttendanceRecord,
  removeAttendeeRecord,
} from "../controllers/attendanceController.js";
import { protect, instructor } from "../middleware/authMiddleware.js";

router.route("/").post(protect, instructor, getAttendanceRecord);
router.route("/add").post(protect, instructor, addAttendeeRecord);
router.route("/addextra").post(protect, instructor, addExtraAttendeeRecord);
router.route("/remove").post(protect, instructor, removeAttendeeRecord);

export default router;
