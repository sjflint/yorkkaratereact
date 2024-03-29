import asyncHandler from "express-async-handler";
import Product from "../models/productModel.cjs";
import Member from "../models/memberModel.cjs";
import { genericEmail } from "../emailTemplates/genericEmail.cjs";
import dotenv from "dotenv";

dotenv.config();

// @desc Fetch all products
// @route GET /api/products
// @access Public
const getProducts = asyncHandler(async (req, res) => {
  const pageSize = 6;
  const page = Number(req.query.pageNumber) || 1;
  const filterBy = req.query.filterBy;

  if (req.query.pageNumber === "all") {
    const products = await Product.find({});
    res.json({ products });
  } else {
    if (filterBy === "") {
      const count = await Product.find({}).countDocuments();

      const products = await Product.find({})
        .limit(pageSize)
        .skip(pageSize * (page - 1))
        .sort({ name: 1 });

      res.json({ products, page, pages: Math.ceil(count / pageSize) });
    } else {
      const count = await Product.find({ category: filterBy }).countDocuments();

      const products = await Product.find({ category: filterBy }).sort({
        name: 1,
      });

      res.json({ products, page, pages: Math.ceil(count / pageSize) });
    }
  }
});

// // @desc Fetch single product
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

  const members = await Member.find({ ddsuccess: true });

  // combine emails to send
  let recipients = [];
  for (const member of members) {
    recipients.push(member.email, member.secondaryEmail);
  }
  genericEmail({
    recipientEmail: recipients,
    subject: "We have a great new product for sale!",
    message: `<h4>We have a new product in our shop that you might be interested in.</h4>
      <table role="presentation" cellspacing="0" width="100%">
      <tr>
      <td>
        <img
          src=${product.image}
          alt=""
          width=150px
          style="padding: 10px"
        />
      </td>
      <td style="width: 400px">
        <h4>
           ${product.name}
        </h4>
        <small>
          ${product.description}
        </small>
        <p>
          ${product.price.toLocaleString("en-GB", {
            style: "currency",
            currency: "GBP",
          })}
        </p>
              
        <div style="padding-bottom: 20px; margin-top: 20px">
          <a
            href="${process.env.DOMAIN_LINK}/products/${createdProduct._id}"
            target="_blank"
            style="
              box-sizing: border-box;
              color: #ffffff;
              text-decoration: none;
              padding: 12px 18px;
              border-radius: 4px;
              border: solid 1px #0b0b0b;
              font-weight: 700;
              font-size: 14px;
              background-color: #0b0b0b;
              display: block;
              text-align: center;
            "
          >
            View product
          </a>
        </div>
      
      </td>
    </tr>
    </table>
          `,
    link: `${process.env.DOMAIN_LINK}/shop`,
    linkText: "Visit shop",
    attachments: [],
  });

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
      // (product.image = req.body.image),
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
