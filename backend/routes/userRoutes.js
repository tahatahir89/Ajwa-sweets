import express from "express";
import {
  updateProfile, addAddress, updateAddress, deleteAddress, getUsers, getUserById,
} from "../controllers/userController.js";
import { protect, admin } from "../middleware/authMiddleware.js";

const router = express.Router();
router.put("/profile", protect, updateProfile);
router.post("/addresses", protect, addAddress);
router.put("/addresses/:addressId", protect, updateAddress);
router.delete("/addresses/:addressId", protect, deleteAddress);
router.get("/", protect, admin, getUsers);
router.get("/:id", protect, admin, getUserById);

export default router;
