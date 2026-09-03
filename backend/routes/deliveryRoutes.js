import express from "express";
import {
  getDeliveryZones, createDeliveryZone, updateDeliveryZone, deleteDeliveryZone,
} from "../controllers/deliveryController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", getDeliveryZones);
router.post("/", protect, admin, createDeliveryZone);
router.put("/:id", protect, admin, updateDeliveryZone);
router.delete("/:id", protect, admin, deleteDeliveryZone);

export default router;
