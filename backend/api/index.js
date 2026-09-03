// Vercel serverless entry point. Vercel treats any file under /api as a
// function — this one wraps the same Express app used locally (app.js) so
// all your existing routes, middleware, and controllers work unchanged.
import { connectDB } from "../config/db.js";
import app from "../app.js";

// Connect on cold start; connectDB() caches the connection so subsequent
// warm invocations reuse it instead of reconnecting every request.
await connectDB();

export default app;
