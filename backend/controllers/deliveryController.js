import asyncHandler from "express-async-handler";
import DeliveryZone from "../models/DeliveryZone.js";

export const getDeliveryZones = asyncHandler(async (req, res) => {
  const zones = await DeliveryZone.find({ isActive: true });
  res.json(zones);
});

export const createDeliveryZone = asyncHandler(async (req, res) => {
  const zone = await DeliveryZone.create(req.body);
  res.status(201).json(zone);
});

export const updateDeliveryZone = asyncHandler(async (req, res) => {
  const zone = await DeliveryZone.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
  if (!zone) {
    res.status(404);
    throw new Error("Delivery zone not found");
  }
  res.json(zone);
});

export const deleteDeliveryZone = asyncHandler(async (req, res) => {
  const zone = await DeliveryZone.findByIdAndDelete(req.params.id);
  if (!zone) {
    res.status(404);
    throw new Error("Delivery zone not found");
  }
  res.json({ message: "Delivery zone removed" });
});
