import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

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

// Always normalize the slug into a safe form — whatever an admin types in
// (spaces, capitals, punctuation) never reaches the database or a URL as-is.
// If no slug was provided at all, derive one from the name.
function normalizeSlug(doc) {
  const source = doc.slug || doc.name;
  if (source) doc.slug = slugify(source);
}

productSchema.pre("save", function (next) {
  normalizeSlug(this);
  next();
});

// findByIdAndUpdate/findOneAndUpdate skip document middleware by default, so
// the admin "Edit Product" flow (which uses findByIdAndUpdate) needs its own
// hook to get the same protection.
productSchema.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
  const update = this.getUpdate();
  if (update.slug || update.name) {
    update.slug = slugify(update.slug || update.name);
  }
  next();
});

export default mongoose.model("Product", productSchema);
