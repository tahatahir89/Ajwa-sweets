// Sends transactional emails via Brevo's SMTP relay, using nodemailer.
//
// This uses SMTP login credentials (from Brevo dashboard → SMTP & API → SMTP
// tab) — NOT the REST API key. These are two separate credential types in
// Brevo; mixing them up (e.g. using an API key as the SMTP password) causes
// authentication failures.
//
// Required env vars (see .env.example):
//   BREVO_SMTP_HOST      — smtp-relay.brevo.com
//   BREVO_SMTP_PORT       — 587
//   BREVO_SMTP_LOGIN      — the long login shown on Brevo's SMTP tab
//                            (looks like an email, e.g. 91a2b3001@smtp-brevo.com)
//   BREVO_SMTP_PASSWORD    — the SMTP key/password shown right next to it on
//                            that same page (click "Generate a new SMTP key"
//                            if you don't have one saved — Brevo only shows
//                            it once)
//   BREVO_SENDER_EMAIL     — the "from" address customers see. Must be a
//                            verified sender in Brevo (Senders, Domains &
//                            Dedicated IPs → Senders) or Brevo will reject it.
//   BREVO_SENDER_NAME      — optional, defaults to "Ajwa Sweets & Bakers"

import nodemailer from "nodemailer";

let cachedTransporter = null;

function getTransporter() {
  if (cachedTransporter) return cachedTransporter;

  const { BREVO_SMTP_HOST, BREVO_SMTP_PORT, BREVO_SMTP_LOGIN, BREVO_SMTP_PASSWORD } = process.env;
  if (!BREVO_SMTP_HOST || !BREVO_SMTP_PORT || !BREVO_SMTP_LOGIN || !BREVO_SMTP_PASSWORD) return null;

  cachedTransporter = nodemailer.createTransport({
    host: BREVO_SMTP_HOST,
    port: Number(BREVO_SMTP_PORT),
    secure: false, // Brevo's port 587 uses STARTTLS, not implicit TLS
    auth: { user: BREVO_SMTP_LOGIN, pass: BREVO_SMTP_PASSWORD },
  });
  return cachedTransporter;
}

export async function sendEmail({ to, toName, subject, html }) {
  const senderEmail = process.env.BREVO_SENDER_EMAIL;
  const transporter = getTransporter();

  if (!transporter || !senderEmail) {
    const missing = [
      !process.env.BREVO_SMTP_HOST && "BREVO_SMTP_HOST",
      !process.env.BREVO_SMTP_PORT && "BREVO_SMTP_PORT",
      !process.env.BREVO_SMTP_LOGIN && "BREVO_SMTP_LOGIN",
      !process.env.BREVO_SMTP_PASSWORD && "BREVO_SMTP_PASSWORD",
      !senderEmail && "BREVO_SENDER_EMAIL",
    ].filter(Boolean);
    // Fail soft: a missing/unconfigured SMTP setup should never break an
    // order status update — just skip the email and log loudly.
    console.warn(`[email] SKIPPED sending "${subject}" to ${to} — missing env var(s): ${missing.join(", ")}`);
    return { skipped: true };
  }

  console.log(`[email] Sending "${subject}" to ${to} via Brevo SMTP (sender: ${senderEmail})...`);

  try {
    const info = await transporter.sendMail({
      from: `"${process.env.BREVO_SENDER_NAME || "Ajwa Sweets & Bakers"}" <${senderEmail}>`,
      to: toName ? `"${toName}" <${to}>` : to,
      subject,
      html,
    });
    console.log(`[email] Sent successfully — messageId: ${info.messageId}`);
    return info;
  } catch (err) {
    // Common causes surface clearly here: EAUTH = wrong SMTP login/password,
    // "sender not valid" = BREVO_SENDER_EMAIL isn't verified in Brevo yet.
    console.error(`[email] SMTP send FAILED:`, err.message);
    throw err;
  }
}

const STATUS_COPY = {
  pending: {
    subject: (o) => `We've received your Ajwa Sweets order ${o.orderNumber}`,
    heading: "Order Received",
    message: "Thanks for your order — we've received it and it's awaiting confirmation.",
  },
  confirmed: {
    subject: (o) => `Your Ajwa Sweets order ${o.orderNumber} is confirmed!`,
    heading: "Order Confirmed",
    message: "Great news — your order has been confirmed and we're getting it ready.",
  },
  preparing: {
    subject: (o) => `Your Ajwa Sweets order ${o.orderNumber} is being prepared`,
    heading: "Preparing Your Order",
    message: "Your order is now being freshly prepared in our kitchen.",
  },
  out_for_delivery: {
    subject: (o) => `Your Ajwa Sweets order ${o.orderNumber} is out for delivery`,
    heading: "Out for Delivery",
    message: "Your order is on its way to you!",
  },
  delivered: {
    subject: (o) => `Your Ajwa Sweets order ${o.orderNumber} has been delivered`,
    heading: "Delivered",
    message: "Your order has been delivered. We hope you enjoy it!",
  },
  cancelled: {
    subject: (o) => `Your Ajwa Sweets order ${o.orderNumber} was cancelled`,
    heading: "Order Cancelled",
    message: "Your order has been cancelled. If this is unexpected, please contact us.",
  },
};

export function buildOrderStatusEmail(order, status) {
  const copy = STATUS_COPY[status] || STATUS_COPY.pending;
  const customerName = order.user?.name || order.guestInfo?.name || "there";

  const itemsRows = order.items
    .map(
      (item) => `
        <tr>
          <td style="padding:8px 0;border-bottom:1px solid #eee;">
            ${item.name}${item.variantLabel ? ` (${item.variantLabel})` : ""} × ${item.quantity}
          </td>
          <td style="padding:8px 0;border-bottom:1px solid #eee;text-align:right;">
            Rs. ${(item.price * item.quantity).toLocaleString()}
          </td>
        </tr>`
    )
    .join("");

  const address = order.deliveryAddress
    ? [order.deliveryAddress.houseFlat, order.deliveryAddress.street, order.deliveryAddress.area, order.deliveryAddress.city]
        .filter(Boolean)
        .join(", ")
    : "";

  const trackingUrl = process.env.CLIENT_URL ? `${process.env.CLIENT_URL}/orders/${order._id}` : null;

  const html = `
    <div style="font-family:Arial,sans-serif;max-width:520px;margin:0 auto;color:#171A26;">
      <h2 style="color:#101E44;">${copy.heading}</h2>
      <p>Hi ${customerName},</p>
      <p>${copy.message}</p>
      <p style="background:#F3ECDD;padding:10px 14px;border-radius:8px;display:inline-block;font-family:monospace;">
        ${order.orderNumber}
      </p>
      <table style="width:100%;border-collapse:collapse;margin:20px 0;">
        ${itemsRows}
        <tr>
          <td style="padding-top:12px;font-weight:bold;">Total</td>
          <td style="padding-top:12px;font-weight:bold;text-align:right;">Rs. ${order.total.toLocaleString()}</td>
        </tr>
      </table>
      ${address ? `<p><strong>Delivery Address:</strong><br/>${address}</p>` : ""}
      <p><strong>Payment:</strong> Cash on Delivery</p>
      ${
        trackingUrl
          ? `<p style="margin-top:24px;">
               <a href="${trackingUrl}" style="background:#101E44;color:#fff;padding:12px 22px;border-radius:999px;text-decoration:none;display:inline-block;">
                 Track Your Order
               </a>
             </p>`
          : ""
      }
      <p style="margin-top:28px;color:#666;font-size:13px;">Thank you for ordering from Ajwa Sweets & Bakers!</p>
    </div>
  `;

  return { subject: copy.subject(order), html };
}
