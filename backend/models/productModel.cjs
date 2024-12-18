const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: Array, required: true },
    countInStock: { type: Object },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    sizes: { type: Array },
    dateCreated: { type: Date, default: Date.now },
  },
  {
    timestamp: true,
  }
);

const Product = (module.exports = mongoose.model("Product", productSchema));
