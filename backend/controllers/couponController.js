import asyncHandler from "express-async-handler";
import Coupon from "../models/Coupon.js";

export const validateCoupon = asyncHandler(async (req, res) => {
  const { code, subtotal } = req.query;
  const coupon = await Coupon.findOne({ code: code?.toUpperCase(), isActive: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Invalid coupon code");
  }
  if (coupon.expiresAt && coupon.expiresAt < new Date()) {
    res.status(400);
    throw new Error("Coupon has expired");
  }
  if (subtotal && Number(subtotal) < coupon.minOrderAmount) {
    res.status(400);
    throw new Error(`Minimum order of Rs. ${coupon.minOrderAmount} required for this coupon`);
  }
  res.json(coupon);
});

// admin
export const getCoupons = asyncHandler(async (req, res) => {
  res.json(await Coupon.find().sort({ createdAt: -1 }));
});

export const createCoupon = asyncHandler(async (req, res) => {
  res.status(201).json(await Coupon.create(req.body));
});

export const updateCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.json(coupon);
});

export const deleteCoupon = asyncHandler(async (req, res) => {
  const coupon = await Coupon.findByIdAndDelete(req.params.id);
  if (!coupon) {
    res.status(404);
    throw new Error("Coupon not found");
  }
  res.json({ message: "Coupon removed" });
});
