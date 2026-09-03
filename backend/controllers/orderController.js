import asyncHandler from "express-async-handler";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import DeliveryZone from "../models/DeliveryZone.js";
import Coupon from "../models/Coupon.js";
import { generateOrderNumber } from "../utils/generateOrderNumber.js";
import { sendEmail, buildOrderStatusEmail } from "../utils/email.js";

// @route POST /api/orders
// Body: { items:[{productId, variantLabel, quantity}], deliveryAddress, deliveryZoneId, paymentMethod, couponCode, guestInfo }
export const createOrder = asyncHandler(async (req, res) => {
  const { items, deliveryAddress, deliveryZoneId, paymentMethod, couponCode, guestInfo } = req.body;

  if (!items || !items.length) {
    res.status(400);
    throw new Error("No order items provided");
  }

  if (
    !deliveryAddress ||
    !deliveryAddress.houseFlat?.trim() ||
    !deliveryAddress.street?.trim() ||
    !deliveryAddress.area?.trim() ||
    !deliveryAddress.city?.trim()
  ) {
    res.status(400);
    throw new Error("Please fill in all required address fields before continuing.");
  }

  if (!guestInfo && !req.user) {
    res.status(400);
    throw new Error("Customer information is required");
  }
  if (!req.user && (!guestInfo?.name?.trim() || !guestInfo?.email?.trim() || !guestInfo?.phone?.trim())) {
    res.status(400);
    throw new Error("Please provide your name, email, and phone number before continuing.");
  }

  // Rebuild pricing server-side — never trust client-submitted totals
  let subtotal = 0;
  const orderItems = [];
  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || !product.isAvailable) {
      res.status(400);
      throw new Error(`Product unavailable: ${item.productId}`);
    }
    let price = product.basePrice;
    if (item.variantLabel && product.variants.length) {
      const variant = product.variants.find((v) => v.label === item.variantLabel);
      if (!variant) {
        res.status(400);
        throw new Error(`Invalid variant for ${product.name}`);
      }
      price = variant.price;
    }
    subtotal += price * item.quantity;
    orderItems.push({
      product: product._id,
      name: product.name,
      image: product.images?.[0] || "",
      variantLabel: item.variantLabel || "",
      price,
      quantity: item.quantity,
    });
  }

  let deliveryFee = 0;
  let estimatedDeliveryTime;
  let zoneDoc = null;
  if (deliveryZoneId) {
    zoneDoc = await DeliveryZone.findById(deliveryZoneId);
    if (zoneDoc) {
      deliveryFee = zoneDoc.freeDeliveryThreshold && subtotal >= zoneDoc.freeDeliveryThreshold ? 0 : zoneDoc.charge;
      estimatedDeliveryTime = zoneDoc.estimatedTime;
    }
  }

  let discount = 0;
  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
    if (coupon && subtotal >= coupon.minOrderAmount) {
      discount = coupon.type === "percentage" ? (subtotal * coupon.value) / 100 : coupon.value;
      if (coupon.maxDiscount) discount = Math.min(discount, coupon.maxDiscount);
      coupon.timesUsed += 1;
      await coupon.save();
    }
  }

  const total = Math.max(subtotal + deliveryFee - discount, 0);
  const orderNumber = await generateOrderNumber();

  const order = await Order.create({
    orderNumber,
    user: req.user ? req.user._id : undefined,
    guestInfo: req.user ? undefined : guestInfo,
    items: orderItems,
    deliveryAddress,
    deliveryZone: zoneDoc?._id,
    subtotal,
    deliveryFee,
    discount,
    couponCode: couponCode || undefined,
    total,
    paymentMethod,
    paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
    status: "pending",
    statusHistory: [{ status: "pending" }],
    estimatedDeliveryTime,
  });

  res.status(201).json(order);
});

// @route GET /api/orders/mine
export const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(orders);
});

// @route GET /api/orders/:id
export const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (req.user.role !== "admin" && (!order.user || order.user.toString() !== req.user._id.toString())) {
    res.status(403);
    throw new Error("Not authorized to view this order");
  }
  res.json(order);
});

// @route GET /api/orders (admin)
export const getAllOrders = asyncHandler(async (req, res) => {
  const { status } = req.query;
  const query = status ? { status } : {};
  const orders = await Order.find(query).populate("user", "name email phone").sort({ createdAt: -1 });
  res.json(orders);
});

// @route PUT /api/orders/:id/status (admin)
export const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const order = await Order.findById(req.params.id).populate("user", "name email");
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }

  const previousStatus = order.status;
  order.status = status;
  order.statusHistory.push({ status });
  if (status === "delivered") order.paymentStatus = "paid";
  await order.save();

  // Notify the customer by email on every status change (pending → confirmed
  // → preparing → out_for_delivery → delivered, or → cancelled). Skip only if
  // the status didn't actually change, or if we have no email to send to. A
  // failed/skipped email never fails the status-update request itself — the
  // order's status is already saved regardless of whether the email goes out.
  const customerEmail = order.user?.email || order.guestInfo?.email;
  if (status !== previousStatus) {
    if (!customerEmail) {
      console.warn(`[order ${order.orderNumber}] status changed to "${status}" but no customer email found — skipping notification.`);
    } else {
      try {
        const { subject, html } = buildOrderStatusEmail(order, status);
        await sendEmail({ to: customerEmail, toName: order.user?.name || order.guestInfo?.name, subject, html });
      } catch (err) {
        console.error(`[order ${order.orderNumber}] failed to send status-update email:`, err.message);
      }
    }
  }

  res.json(order);
});

// @route PUT /api/orders/:id/payment-status (admin)
export const updatePaymentStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  order.paymentStatus = req.body.paymentStatus;
  await order.save();
  res.json(order);
});

// @route PUT /api/orders/:id/cancel
export const cancelOrder = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) {
    res.status(404);
    throw new Error("Order not found");
  }
  if (["out_for_delivery", "delivered"].includes(order.status)) {
    res.status(400);
    throw new Error("Order can no longer be cancelled");
  }
  order.status = "cancelled";
  order.statusHistory.push({ status: "cancelled" });
  await order.save();
  res.json(order);
});

// @route DELETE /api/orders (admin) — destructive, wipes all order history.
// Protected by protect+admin at the route level; the frontend additionally
// requires a two-step confirmation before ever calling this.
export const clearAllOrders = asyncHandler(async (req, res) => {
  const result = await Order.deleteMany({});
  res.json({ message: "All orders have been cleared successfully.", deletedCount: result.deletedCount });
});
