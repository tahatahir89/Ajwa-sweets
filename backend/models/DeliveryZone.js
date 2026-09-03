import mongoose from "mongoose";

const deliveryZoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true }, // e.g. "Within Local Area"
    areas: [{ type: String }], // area names covered by this zone
    charge: { type: Number, required: true },
    freeDeliveryThreshold: { type: Number, default: null },
    estimatedTime: { type: String, default: "30-60 minutes" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("DeliveryZone", deliveryZoneSchema);
