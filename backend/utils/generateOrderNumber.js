import Order from "../models/Order.js";

// Produces order numbers like MS-2026-000124
export const generateOrderNumber = async () => {
  const year = new Date().getFullYear();
  const count = await Order.countDocuments({
    orderNumber: { $regex: `^MS-${year}-` },
  });
  const sequence = String(count + 1).padStart(6, "0");
  return `MS-${year}-${sequence}`;
};
