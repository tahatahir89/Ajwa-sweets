# Ajwa Sweets & Bakers — Backend API

Node.js + Express + MongoDB (Mongoose) REST API for the Ajwa Sweets & Bakers e-commerce platform.
This is a standalone backend with its own database and environment variables — not connected to
any other project.

## Setup

```bash
npm install
cp .env.example .env   # then fill in real values
npm run seed            # creates an admin user + starter categories/products
npm run dev              # starts on http://localhost:5000 (nodemon)
```

Requires a running MongoDB instance (local or Atlas) — set `MONGO_URI` in `.env`.

## Deploying

See the root `README.md` (one level up) for the recommended setup: this backend and the
`frontend/` folder deploy together as **one Vercel project** via the root `vercel.json`.

It can also run standalone if you ever want to split it out: as a normal long-running server
(`npm start`, using `server.js`) on Render/Railway/a VPS, or as its own separate Vercel project
using the included `api/index.js` serverless entry point.

Product image uploads go straight to Cloudinary (see below) rather than local disk, so this works
identically regardless of which hosting route you pick.

## Image uploads (Cloudinary)

1. Sign up at cloudinary.com — free tier, no card required (25 monthly credits, plenty for product
   photos).
2. Your dashboard homepage shows **Cloud Name**, **API Key**, and **API Secret** right at the top.
3. Put those three values in `.env` as `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`,
   `CLOUDINARY_API_SECRET`.
4. That's it — `routes/uploadRoutes.js` streams uploaded images straight to Cloudinary and stores
   the resulting CDN URL on the product. Nothing is ever written to local disk, so this works
   identically whether you're running locally, on Render/Railway, or on Vercel.

## Order status emails (Brevo SMTP)

Every time an admin changes an order's status in the dashboard, the customer automatically gets
an email reflecting the new status (received, confirmed, preparing, out for delivery, delivered,
or cancelled) — sent via Brevo's SMTP relay using nodemailer.

1. Sign up at brevo.com — free tier includes 300 emails/day, no card required.
2. Go to **SMTP & API → SMTP tab** (not "API Keys" — that's a different, unrelated credential
   type this project doesn't use). You'll see a login that looks like an email address
   (e.g. `91a2b3001@smtp-brevo.com`) — put it in `.env` as `BREVO_SMTP_LOGIN`.
3. Next to it, click **Generate a new SMTP key** (or reuse one you've saved) and put it in `.env`
   as `BREVO_SMTP_PASSWORD`. This is different from your Brevo account password.
4. Go to **Senders, Domains & Dedicated IPs → Senders**, verify an email address, and put it in
   `.env` as `BREVO_SENDER_EMAIL`. Brevo rejects sends from an address that isn't verified there.
5. That's it — `utils/email.js` handles the rest. If any of the SMTP env vars are missing, order
   status updates still work normally; the email is just skipped (logged to the console as
   `[email] SKIPPED...`) rather than breaking anything.
6. If a send fails, check the server logs for `[email] SMTP send FAILED` — it prints the exact
   nodemailer error (wrong login/password, unverified sender, etc.) to make debugging quick.

## Auth

JWT-based. Register/login return a token; send it as `Authorization: Bearer <token>` on protected routes.
Admin-only routes additionally require the logged-in user's `role` to be `admin` (set this directly in the
database, or via `npm run seed` which creates one admin from `ADMIN_EMAIL` / `ADMIN_PASSWORD`).

## Payments

Cash on Delivery only, by design. Every order is created with `paymentMethod: "cod"` and `paymentStatus`
starts as `pending`, moving to `paid` once you mark the order `delivered` in the admin dashboard (or manually
via `updatePaymentStatus`). Online payment gateways (JazzCash/Easypaisa) were deliberately left out to avoid
the merchant-account approval overhead — if you want to add one back later, extend the `paymentMethod` enum
in `models/Order.js`, add a `services/<provider>.js` module that builds the signed/hosted-checkout request
server-side, and a return/webhook route that verifies the callback and calls `updatePaymentStatus`.

## Key endpoints

| Method | Route | Description |
|---|---|---|
| POST | /api/auth/register, /login | Customer auth |
| GET | /api/products | List/search/filter products |
| GET | /api/products/:slug | Product detail |
| POST | /api/orders | Place an order (server recalculates all pricing) |
| GET | /api/orders/mine | Customer's order history |
| PUT | /api/orders/:id/status | Admin: advance order status |
| GET/POST/PUT/DELETE | /api/delivery-zones | Admin-configurable delivery zones + charges |
| GET/POST/PUT/DELETE | /api/coupons | Admin-configurable discount coupons |

See `routes/` for the full list. All admin routes require `protect` + `admin` middleware.

## Models

`User`, `Product` (with size/weight `variants`), `Category`, `Order` (with `statusHistory` for the tracking
timeline), `DeliveryZone`, `Coupon`, `Wishlist` — see `models/`.
