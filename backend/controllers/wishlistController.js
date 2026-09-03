import asyncHandler from "express-async-handler";
import Wishlist from "../models/Wishlist.js";

export const getWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id }).populate("products");
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  res.json(wishlist);
});

export const addToWishlist = asyncHandler(async (req, res) => {
  let wishlist = await Wishlist.findOne({ user: req.user._id });
  if (!wishlist) wishlist = await Wishlist.create({ user: req.user._id, products: [] });
  if (!wishlist.products.includes(req.body.productId)) {
    wishlist.products.push(req.body.productId);
    await wishlist.save();
  }
  res.status(201).json(wishlist);
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const wishlist = await Wishlist.findOne({ user: req.user._id });
  if (wishlist) {
    wishlist.products = wishlist.products.filter((p) => p.toString() !== req.params.productId);
    await wishlist.save();
  }
  res.json(wishlist);
});
