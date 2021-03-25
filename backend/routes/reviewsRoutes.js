import express from "express";

const router = express.Router();
import protect from "../middlewares/authMiddleware.js";
import { createProductReview } from "../controllers/productControllers.js";

router.route("/product/:id").post(protect, createProductReview);

export default router;
