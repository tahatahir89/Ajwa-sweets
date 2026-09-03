import mongoose from "mongoose";

// Cache the connection so repeated calls (e.g. one per serverless invocation
// on Vercel, where the process may be reused between requests) don't try to
// open a new connection every time.
let cached = global._mongooseConn;
if (!cached) cached = global._mongooseConn = { conn: null, promise: null };

export const connectDB = async () => {
  if (cached.conn) return cached.conn;

  if (!cached.promise) {
    cached.promise = mongoose
      .connect(process.env.MONGO_URI)
      .then((m) => {
        console.log(`MongoDB connected: ${m.connection.host}`);
        return m;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (err) {
    cached.promise = null;
    console.error(`MongoDB connection error: ${err.message}`);
    // In a long-running local/VPS process this should be fatal; in a
    // serverless function, throwing lets the platform return a proper 500
    // instead of killing the whole process.
    if (!process.env.VERCEL) process.exit(1);
    throw err;
  }

  return cached.conn;
};
