// One-time cleanup: run with "node utils/removeSampleProducts.js" to delete
// the two demo products ("Chocolate Fudge Cake" / "Gulab Jamun") that older
// versions of seed.js used to insert. Safe to run even if they're already
// gone — it just won't find/delete anything. Your own real products (added
// via the admin dashboard) are never touched, since this only matches those
// two exact slugs.
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Product from "../models/Product.js";

dotenv.config();
await connectDB();

const SAMPLE_SLUGS = ["chocolate-fudge-cake", "gulab-jamun"];

const run = async () => {
  const result = await Product.deleteMany({ slug: { $in: SAMPLE_SLUGS } });
  console.log(`Removed ${result.deletedCount} demo product(s).`);
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
