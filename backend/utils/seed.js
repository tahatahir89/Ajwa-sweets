// Run with: npm run seed
// Creates an initial admin user, starter categories, and starter delivery
// zones. Does NOT create any sample/demo products — add your real products
// through the admin dashboard (/admin/products) after seeding.
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Category from "../models/Category.js";
import DeliveryZone from "../models/DeliveryZone.js";

dotenv.config();
await connectDB();

const run = async () => {
  const adminExists = await User.findOne({ email: process.env.ADMIN_EMAIL });
  if (!adminExists) {
    await User.create({
      name: "Ajwa Sweets Admin",
      email: process.env.ADMIN_EMAIL,
      phone: "0000000000",
      password: process.env.ADMIN_PASSWORD,
      role: "admin",
    });
    console.log("Admin user created:", process.env.ADMIN_EMAIL);
  }

  const categories = [
    { name: "Cakes", slug: "cakes" },
    { name: "Pastries", slug: "pastries" },
    { name: "Traditional Sweets", slug: "traditional-sweets" },
    { name: "Donuts", slug: "donuts" },
    { name: "Cupcakes", slug: "cupcakes" },
    { name: "Cookies", slug: "cookies" },
    { name: "Gift Boxes", slug: "gift-boxes" },
  ];

  for (const cat of categories) {
    await Category.updateOne({ slug: cat.slug }, { $setOnInsert: cat }, { upsert: true });
  }
  console.log("Categories seeded");

  const zones = [
    { name: "Within Local Area", areas: ["Local"], charge: 150, estimatedTime: "30-60 minutes" },
    { name: "Nearby Areas", areas: ["Nearby"], charge: 200, estimatedTime: "45-75 minutes" },
    { name: "Outside Main Area", areas: ["Outside"], charge: 300, estimatedTime: "60-120 minutes" },
  ];
  for (const z of zones) {
    await DeliveryZone.updateOne({ name: z.name }, { $setOnInsert: z }, { upsert: true });
  }
  console.log("Delivery zones seeded");

  console.log("Seeding complete.");
  process.exit();
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
