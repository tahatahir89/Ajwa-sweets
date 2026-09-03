import mongoose from "mongoose";

const orderItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },
    image: { type: String },
    variantLabel: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, required: true, unique: true }, // e.g. MS-2026-000124
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    guestInfo: {
      name: String,
      email: String,
      phone: String,
      whatsapp: String,
    },
    items: [orderItemSchema],
    deliveryAddress: {
      houseFlat: String,
      street: String,
      area: String,
      city: String,
      landmark: String,
      instructions: String,
    },
    deliveryZone: { type: mongoose.Schema.Types.ObjectId, ref: "DeliveryZone" },
    subtotal: { type: Number, required: true },
    deliveryFee: { type: Number, required: true, default: 0 },
    discount: { type: Number, default: 0 },
    couponCode: { type: String },
    total: { type: Number, required: true },
    paymentMethod: { type: String, enum: ["cod"], default: "cod", required: true },
    paymentStatus: { type: String, enum: ["pending", "paid", "failed"], default: "pending" },
    status: {
      type: String,
      enum: ["pending", "confirmed", "preparing", "out_for_delivery", "delivered", "cancelled"],
      default: "pending",
    },
    statusHistory: [
      {
        status: String,
        changedAt: { type: Date, default: Date.now },
      },
    ],
    estimatedDeliveryTime: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Order", orderSchema);
