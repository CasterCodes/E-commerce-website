import express from "express";
const router = express.Router();
import {
  getProducts,
  getProduct,
  deleteProduct,
  createProduct,
  updateProduct,
  getTopProducts,
} from "../controllers/productControllers.js";
import protect, { isAdmin } from "../middlewares/authMiddleware.js";

router.route("/").get(getProducts).post(protect, isAdmin, createProduct);
router.get("/top/four", getTopProducts);
router
  .route("/:id")
  .get(getProduct)
  .delete(protect, isAdmin, deleteProduct)
  .put(protect, isAdmin, updateProduct);

export default router;
