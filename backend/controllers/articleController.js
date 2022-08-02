import asyncHandler from "express-async-handler";
import Article from "../models/articleModel.js";
import Member from "../models/memberModel.cjs";

// @desc Fetch all articles
// @route GET /api/articles
// @access Public
const getArticles = asyncHandler(async (req, res) => {
  const pageSize = 4;
  const page = Number(req.query.pageNumber) || 1;

  const count = await Article.countDocuments();
  const articles = await Article.find({})
    .sort({ dateCreated: -1 })
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ articles, page, pages: Math.ceil(count / pageSize) });
});

// @desc Fetch single article
// @route GET /api/article
// @access Public
const getArticleById = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);

  if (article) {
    const member = await Member.findById(article.authorId);
    if (member) {
      article.authorImg = member.profileImg;
    }

    res.json(article);
  } else {
    res.status(404);
    throw Error("Article not found");
  }
});

// @desc Delete article
// @route DELETE /api/article/:id
// @access Private/Author
const deleteArticle = asyncHandler(async (req, res) => {
  console.log(req.params.id);
  const article = await Article.findById(req.params.id);

  if (article) {
    await article.remove();
    res.json({ message: "Article removed" });
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

// @desc Create article
// @route POST /api/articles
// @access Private/Author
const createArticle = asyncHandler(async (req, res) => {
  const article = new Article({
    image: req.body.image,
    title: req.body.title,
    leader: req.body.leader,
    author: req.body.author,
    authorId: req.body.authorId,
    category: req.body.category,
    body: req.body.body,
    carouselImages: req.body.carouselImages,
  });

  const createdArticle = await article.save();
  res.status(201).json(createdArticle);
});

// @desc Update article
// @route PUT /api/articles/:id
// @access Private/Author
const updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.body.id);

  if (article) {
    (article.title = req.body.title),
      (article.leader = req.body.leader),
      (article.author = req.body.author),
      (article.category = req.body.category),
      (article.body = req.body.body);
    article.carouselImages = req.body.carouselImages;

    const updatedArticle = await article.save();
    res.status(201).json(updatedArticle);
  } else {
    res.status(404);
    throw new Error("Article not found");
  }
});

export {
  getArticles,
  getArticleById,
  updateArticle,
  deleteArticle,
  createArticle,
};
