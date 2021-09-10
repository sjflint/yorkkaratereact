import express from "express";
const router = express.Router();
import { getEvents, getEventById } from "../controllers/eventController.js";

router.route("/").get(getEvents);
router.route("/:id").get(getEventById);

export default router;
