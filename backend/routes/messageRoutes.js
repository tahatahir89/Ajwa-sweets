import express from "express";
import { createMessage, getMessages, updateMessageStatus, deleteMessage } from "../controllers/messageController.js";
import { protect, admin, optionalAuth } from "../middleware/authMiddleware.js";

const router = express.Router();
router.post("/", optionalAuth, createMessage);
router.get("/", protect, admin, getMessages);
router.put("/:id/status", protect, admin, updateMessageStatus);
router.delete("/:id", protect, admin, deleteMessage);

export default router;
