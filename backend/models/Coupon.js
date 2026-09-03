import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true, uppercase: true, trim: true },
    type: { type: String, enum: ["percentage", "flat"], required: true },
    value: { type: Number, required: true },
    minOrderAmount: { type: Number, default: 0 },
    maxDiscount: { type: Number, default: null },
    expiresAt: { type: Date },
    isActive: { type: Boolean, default: true },
    usageLimit: { type: Number, default: null },
    timesUsed: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.model("Coupon", couponSchema);
