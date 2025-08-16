import express from "express";
const router = express.Router();
import { authUser, checkAuth, logOut } from "../controllers/userController.js";
import { protectMessages } from "../middleware/authMiddleware.js";

router.post("/login", authUser);
router.post("/logout", logOut);
router.get("/check", protectMessages, checkAuth);

export default router;
