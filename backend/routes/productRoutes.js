import express from "express";
const router = express.Router();
import {
  getProducts,
  getProductById,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/productController.js";
import { protect, shopAdmin } from "../middleware/authMiddleware.js";

router.route("/").get(getProducts).post(protect, shopAdmin, createProduct);
router
  .route("/:id")
  .get(getProductById)
  .delete(protect, shopAdmin, deleteProduct)
  .put(protect, shopAdmin, updateProduct);

export default router;
