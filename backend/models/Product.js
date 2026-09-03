import mongoose from "mongoose";

const variantSchema = new mongoose.Schema(
  {
    label: { type: String, required: true }, // e.g. "1 Pound", "2 Pound"
    price: { type: Number, required: true },
    stock: { type: Number, default: 0 },
  },
  { _id: true }
);

const reviewSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    name: String,
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: String,
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, unique: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    shortDescription: { type: String, default: "" },
    description: { type: String, default: "" },
    ingredients: [{ type: String }],
    images: [{ type: String }],
    basePrice: { type: Number, required: true },
    variants: [variantSchema], // optional size/weight options; if empty, basePrice is used
    stock: { type: Number, default: 0 },
    isFeatured: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
    tags: [{ type: String }],
    reviews: [reviewSchema],
    rating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.index({ name: "text", shortDescription: "text", tags: "text" });

export default mongoose.model("Product", productSchema);
