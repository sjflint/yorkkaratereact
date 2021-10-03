import mongoose from "mongoose";

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    leader: { type: String, required: true, maxlength: 150 },
    body: { type: Array, required: true },
    category: { type: String, required: true },
    image: { type: String },
    author: { type: String, required: true },
    dateCreated: { type: Date, default: Date.now },
  },
  {
    timestamp: true,
  }
);

const Article = mongoose.model("Article", articleSchema);

export default Article;
