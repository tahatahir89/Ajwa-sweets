import mongoose from "mongoose";
import { slugify } from "../utils/slugify.js";

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true },
    description: { type: String, default: "" },
    image: { type: String, default: "" },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Same slug safety net as Product — see models/Product.js for why both hooks
// (save + findOneAndUpdate) are needed.
categorySchema.pre("save", function (next) {
  this.slug = slugify(this.slug || this.name);
  next();
});

categorySchema.pre(["findOneAndUpdate", "findByIdAndUpdate"], function (next) {
  const update = this.getUpdate();
  if (update.slug || update.name) {
    update.slug = slugify(update.slug || update.name);
  }
  next();
});

export default mongoose.model("Category", categorySchema);
