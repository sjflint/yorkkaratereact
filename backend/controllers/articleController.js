import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";

// @desc Fetch all articles
// @route GET /api/articles
// @access Public
const getArticles = asyncHandler(async (req, res) => {
  const articles = await Article.find({}).sort({ dateCreated: -1 });
  res.json(articles);
});

// @desc Fetch single article
// @route GET /api/article
// @access Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    res.json(article);
  } else {
    res.status(404);
    throw Error("Article not found");
  }
});

export { getArticles, getArticleById };
