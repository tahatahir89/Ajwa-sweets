import asyncHandler from "express-async-handler";

// Public, non-secret site configuration only.
export const getPublicSettings = asyncHandler(async (req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    codEnabled: true,
  });
});
