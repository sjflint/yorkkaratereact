import express from "express";
const router = express.Router();
import {
  getArticles,
  getArticleById,
} from "../controllers/articleController.js";

router.route("/").get(getArticles);
router.route("/:id").get(getArticleById);

export default router;
