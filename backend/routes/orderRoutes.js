import express from "express";
import {
  addOrderItems,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getAllOrders,
  updateOrderToDelivered,
} from "../controllers/orderController.js";
import protect, { isAdmin } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.route("/myorders").get(protect, getMyOrders);

router
  .route("/")
  .post(protect, addOrderItems)
  .get(protect, isAdmin, getAllOrders);

router.route("/:id").get(protect, getOrderById);

router.route("/:id/pay").put(protect, updateOrderToPaid);
router.route("/:id/deliver").put(protect, isAdmin, updateOrderToDelivered);

export default router;
