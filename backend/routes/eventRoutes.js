import express from "express";
const router = express.Router();
import {
  getEvents,
  getEventById,
  deleteEvent,
  updateEvent,
  createEvent,
  deleteParticipant,
} from "../controllers/eventController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

router.route("/delete").put(protect, admin, deleteParticipant);
router.route("/find/:toPast?").get(getEvents).post(protect, admin, createEvent);
router
  .route("/:id")
  .get(getEventById)
  .delete(protect, admin, deleteEvent)
  .put(protect, admin, updateEvent);

export default router;
