import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({});
  res.json(products);
});

// // @desc Fetch single article
// // @route GET /api/article
// // @access Public
const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw Error("Article not found");
  }
});

// @desc Delete product
// @route DELETE /api/products/:id
// @access Private/shopadmin
const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    await product.remove();
    res.json({ message: "Product removed" });
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create product
// @route POST /api/products
// @access Private/shopadmin
const createProduct = asyncHandler(async (req, res) => {
  const product = new Product({
    sizes: req.body.sizes,
    name: req.body.name,
    description: req.body.description,
    countInStock: req.body.countInStock,
    price: req.body.price,
    image: req.body.image,
    category: req.body.category,
    createdBy: req.body.createdBy,
  });

  const createdProduct = await product.save();
  res.status(201).json(createdProduct);
});

// @desc Update product
// @route PUT /api/products/:id
// @access Private/shopadmin
const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.body.id);

  if (product) {
    (product.sizes = req.body.sizes),
      (product.name = req.body.name),
      (product.description = req.body.description),
      (product.countInStock = req.body.countInStock),
      (product.price = req.body.price),
      (product.image = req.body.image),
      (product.category = req.body.category),
      (product.createdBy = req.body.createdBy),
      (product.updatedBy = req.body.updatedBy);

    const updatedProduct = await product.save();
    res.status(201).json(updatedProduct);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

export {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
};
