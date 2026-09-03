import express from "express";
import {
  createOrder, getMyOrders, getOrderById, getAllOrders, updateOrderStatus, updatePaymentStatus, cancelOrder, clearAllOrders,
} from "../controllers/orderController.js";
import { protect, admin, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", optionalAuth, createOrder);
router.get("/mine", protect, getMyOrders);
router.get("/", protect, admin, getAllOrders);
router.delete("/", protect, admin, clearAllOrders);
router.get("/:id", protect, getOrderById);
router.put("/:id/status", protect, admin, updateOrderStatus);
router.put("/:id/payment-status", protect, admin, updatePaymentStatus);
router.put("/:id/cancel", protect, cancelOrder);

export default router;
