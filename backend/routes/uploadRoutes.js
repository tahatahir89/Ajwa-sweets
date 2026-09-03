import express from "express";
import multer from "multer";
import cloudinary from "../config/cloudinary.js";
import { protect, admin } from "../middleware/authMiddleware.js";

// Files are held in memory only (never written to local disk) and streamed
// straight to Cloudinary — this works identically on a normal server, on
// Render/Railway, and on Vercel serverless, where local disk isn't reliable.
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB per image
  fileFilter: (req, file, cb) => {
    const allowed = /^image\/(jpeg|png|webp)$/;
    if (allowed.test(file.mimetype)) return cb(null, true);
    cb(new Error("Only JPG, PNG, or WebP images are allowed"));
  },
});

const uploadBufferToCloudinary = (buffer) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: "ajwa-sweets/products" },
      (err, result) => (err ? reject(err) : resolve(result))
    );
    stream.end(buffer);
  });

const router = express.Router();
router.post("/", protect, admin, upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    const result = await uploadBufferToCloudinary(req.file.buffer);
    res.json({ url: result.secure_url });
  } catch (err) {
    res.status(500).json({ message: err.message || "Image upload failed" });
  }
});

export default router;
