import express from "express";
const router = express.Router();
import {
  addAttendeeRecord,
  addExtraAttendeeRecord,
  getAttendanceRecord,
  getmemberAttendanceRecords,
} from "../controllers/attendanceController.js";
import { protect, instructor } from "../middleware/authMiddleware.js";

router.route("/add").post(protect, instructor, addAttendeeRecord);
router.route("/addextra").post(protect, instructor, addExtraAttendeeRecord);
router
  .route("/:id?/:numresults?")
  .post(protect, instructor, getAttendanceRecord)
  .get(getmemberAttendanceRecords);

export default router;
