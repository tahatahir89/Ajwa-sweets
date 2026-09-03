import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    phone: { type: String, default: "" },
    message: { type: String, required: true },
    status: { type: String, enum: ["new", "read", "replied"], default: "new" },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // set if the sender was logged in
  },
  { timestamps: true }
);

export default mongoose.model("Message", messageSchema);
