import asyncHandler from "express-async-handler";
import Message from "../models/Message.js";

// @route POST /api/messages (public — contact form)
export const createMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, message } = req.body;
  if (!name || !email || !message) {
    res.status(400);
    throw new Error("Name, email, and message are required");
  }
  const doc = await Message.create({
    name, email, phone, message,
    user: req.user ? req.user._id : undefined,
  });

  // Optional: hook up an email provider here (e.g. nodemailer/Resend/SendGrid) to
  // notify the bakery owner immediately. The database record above remains the
  // source of truth regardless of whether email notifications are configured.

  res.status(201).json({ message: "Your message has been sent successfully.", id: doc._id });
});

// @route GET /api/messages (admin)
export const getMessages = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const messages = await Message.find(query).sort({ createdAt: -1 });
  res.json(messages);
});

// @route PUT /api/messages/:id/status (admin)
export const updateMessageStatus = asyncHandler(async (req, res) => {
  const message = await Message.findById(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  message.status = req.body.status;
  await message.save();
  res.json(message);
});

// @route DELETE /api/messages/:id (admin)
export const deleteMessage = asyncHandler(async (req, res) => {
  const message = await Message.findByIdAndDelete(req.params.id);
  if (!message) {
    res.status(404);
    throw new Error("Message not found");
  }
  res.json({ message: "Message deleted" });
});
