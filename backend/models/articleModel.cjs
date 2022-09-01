const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    title: { type: String, required: true },
    leader: { type: String, required: true, maxlength: 150 },
    body: { type: String, required: true },
    category: { type: String, required: true },
    image: { type: String },
    carouselImages: { type: Array },
    author: { type: String, required: true },
    authorId: { type: mongoose.Schema.Types.ObjectId, ref: "Member" },
    authorImg: {
      type: String,
      required: true,
      default: "/img/default-profile.jpg",
    },
    dateCreated: { type: Date, default: Date.now },
  },
  {
    timestamp: true,
  }
);

const Article = (module.exports = mongoose.model("Article", articleSchema));
