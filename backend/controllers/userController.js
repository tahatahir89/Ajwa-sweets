import asyncHandler from "express-async-handler";
import User from "../models/User.js";

// @route PUT /api/users/profile
export const updateProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  user.name = req.body.name || user.name;
  user.phone = req.body.phone || user.phone;
  user.whatsapp = req.body.whatsapp || user.whatsapp;
  if (req.body.password) user.password = req.body.password;
  const updated = await user.save();
  res.json({ _id: updated._id, name: updated.name, email: updated.email, phone: updated.phone });
});

// @route POST /api/users/addresses
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses.push(req.body);
  await user.save();
  res.status(201).json(user.addresses);
});

// @route PUT /api/users/addresses/:addressId
export const updateAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const address = user.addresses.id(req.params.addressId);
  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }
  Object.assign(address, req.body);
  await user.save();
  res.json(user.addresses);
});

// @route DELETE /api/users/addresses/:addressId
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  user.addresses = user.addresses.filter((a) => a._id.toString() !== req.params.addressId);
  await user.save();
  res.json(user.addresses);
});

// @route GET /api/users (admin)
export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: "customer" }).select("-password").sort({ createdAt: -1 });
  res.json(users);
});

// @route GET /api/users/:id (admin)
export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");
  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }
  res.json(user);
});
