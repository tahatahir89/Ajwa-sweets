// Local-dev / traditional-server entry point. Run this with "npm run dev" or
// "npm start" when hosting on a platform that runs a normal long-lived Node
// process (your own machine, a VPS, Render, Railway, etc).
// Deploying to Vercel instead? That uses api/index.js, not this file.
//
// IMPORTANT: "dotenv/config" must be the very first import. ES module imports
// all run before any other code in this file, so if dotenv.config() were
// called after importing app.js (which pulls in config/cloudinary.js, and
// that calls cloudinary.config() immediately), it would run too late — the
// Cloudinary/Mongo env vars wouldn't be loaded yet, causing errors like
// "Must supply api_key" even with a correct .env file.
import "dotenv/config";
import { connectDB } from "./config/db.js";
import app from "./app.js";

connectDB();

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Ajwa Sweets API running on port ${PORT}`));
