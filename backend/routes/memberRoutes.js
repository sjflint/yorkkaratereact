import express from "express";
const router = express.Router();
import {
  authMember,
  registerMember,
  getMemberProfile,
  getMembers,
  getBlackBelts,
  // postProfileImg,
  updateProfile,
  updatePassword,
  updateDirectDebit,
  resetPassword,
  deleteMember,
  getMemberById,
  updateMemberProfile,
  getPublicMemberById,
} from "../controllers/memberController.js";
import { protect, admin } from "../middleware/authMiddleware.js";
// import multer from "multer";

// const upload = multer();

router.route("/").post(registerMember).get(protect, admin, getMembers);
router.post("/login", authMember);
router.post("/resetpassword", resetPassword);
router.route("/updateProfile").post(protect, updateProfile);
router.route("/updatePassword").post(protect, updatePassword);
router.route("/updatedd").post(updateDirectDebit);
router.route("/profile").get(protect, getMemberProfile);
// router.route("/profileimg").post(upload.single("image"), postProfileImg);
router.route("/blackbelts").get(getBlackBelts);
router.route("/public/:id").get(getPublicMemberById);
router
  .route("/:id")
  .delete(protect, admin, deleteMember)
  .get(protect, admin, getMemberById)
  .put(protect, admin, updateMemberProfile);

export default router;
