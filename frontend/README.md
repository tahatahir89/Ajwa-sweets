# Ajwa Sweets & Bakers — Next.js Frontend

A full redesign of the storefront for **Ajwa Sweets & Bakers**, built with Next.js (App Router)
and connected to your existing Node/Express/MongoDB backend — no backend changes required.

## Quick start

```bash
npm install
cp .env.example .env.local     # set NEXT_PUBLIC_API_URL to your backend, e.g. http://localhost:5000/api
npm run dev                     # http://localhost:3000
```

Run your existing backend (`cd backend && npm run dev`) alongside it — this frontend calls the
exact same REST endpoints your React app used (auth, products, categories, orders, delivery
zones, coupons, wishlist, messages, uploads).

## What changed vs. the old React/Vite app

- **Framework**: React + Vite + react-router → **Next.js App Router** (file-based routing,
  server components for metadata/SEO, `next/image` for optimized images).
- **Branding**: New navy + gold + cream theme derived from the Ajwa Sweets logo (`public/logo.jpg`),
  Playfair Display + Inter fonts, redesigned Home/Product/Category/Cart/Checkout UI.
- **Real business content**: `lib/business.js` centralizes the real address, hours, categories,
  and Facebook link for Ajwa Sweets & Bakers (sourced from their Google Maps listing) — no
  placeholder business info anywhere on the site. Their phone/email weren't publicly listed, so
  those fields are left blank and simply don't render (rather than a fake number) — add them to
  `lib/business.js` as soon as you have them.
- **SEO**: per-page metadata, Open Graph/Twitter tags, canonical URLs, `sitemap.xml` and
  `robots.txt` (Next.js metadata routes), and JSON-LD structured data — `Bakery`/`LocalBusiness`
  schema site-wide plus per-product `Product` schema with price/availability/reviews.
- **Everything else** (cart, 3-step checkout, order tracking with live polling, wishlist, saved
  addresses, product reviews, admin dashboard) was ported page-for-page from the old app, just
  restyled and adapted to Next.js conventions (`next/navigation`, `next/image`, App Router
  file structure).

## Pages

Storefront: `/`, `/products`, `/products/[category]`, `/product/[slug]`, `/cart`, `/checkout`,
`/checkout/confirmation/[orderNumber]`, `/about`, `/contact`, `/login`, `/register`.

Account (requires login): `/account`, `/account/addresses`, `/wishlist`, `/orders`,
`/orders/[orderNumber]`.

Admin (requires an admin account): `/admin`, `/admin/products`, `/admin/orders`,
`/admin/categories`, `/admin/delivery-zones`, `/admin/messages`.

## Notes for deployment

- Deploy to Vercel like the old frontend — same `NEXT_PUBLIC_API_URL` pattern, just pointed at
  wherever your backend is hosted.
- Set `NEXT_PUBLIC_SITE_URL` to the real production domain before launch — it feeds the sitemap,
  canonical URLs, and Open Graph tags.
- `next.config.js` already allows images from Cloudinary (`res.cloudinary.com`) since that's
  where your backend's `/api/upload` route stores product photos.
- I used JavaScript (not TypeScript) to keep this a direct, low-risk port of your existing
  component logic — happy to convert to TS incrementally later if you'd like.

## Still open

- Confirm phone number / email for Ajwa Sweets so they can be added to `lib/business.js` and the
  Contact page / footer.
- This frontend is paired with its own standalone Ajwa Sweets backend (see `../backend`) — see the
  root `README.md` for the combined single-deployment setup.
