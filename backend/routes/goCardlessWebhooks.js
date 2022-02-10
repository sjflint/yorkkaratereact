import express from "express";
const router = express.Router();
import { goCardlessWebhook } from "../utils/goCardlessWebhook.cjs";

goCardlessWebhook();

export default goCardlessWebhook;
