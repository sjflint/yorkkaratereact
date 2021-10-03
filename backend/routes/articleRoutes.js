import express from "express";
const router = express.Router();
import {
  getArticles,
  getArticleById,
  createArticle,
  deleteArticle,
  updateArticle,
} from "../controllers/articleController.js";
import { protect, author } from "../middleware/authMiddleware.js";

router.route("/").get(getArticles).post(protect, author, createArticle);
router
  .route("/:id")
  .get(getArticleById)
  .delete(protect, author, deleteArticle)
  .put(protect, author, updateArticle);

export default router;
