# Ajwa Sweets & Bakers — Monorepo (Frontend + Backend, One Vercel Deployment)

This repo combines both halves of the project into a single deployable unit:

```
/
├── vercel.json      ← ties both pieces into one Vercel project/deployment
├── frontend/         Next.js storefront + admin dashboard
└── backend/          Node/Express/MongoDB API (unchanged from before)
```

`vercel.json` at the root tells Vercel to build the Next.js app AND the Express API together,
serving both from the **same domain**: your API lives at `/api/*` and everything else is the
Next.js site. No separate backend URL, no CORS to configure between them.

## Local development

Run both halves separately, same as before:

```bash
# Terminal 1 — backend
cd backend
npm install
cp .env.example .env      # fill in MONGO_URI, JWT_SECRET, CLOUDINARY_*, etc.
npm run seed                # creates an admin user + starter categories
npm run dev                  # http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm install
cp .env.example .env.local
# set NEXT_PUBLIC_API_URL=http://localhost:5000/api for local dev
npm run dev                  # http://localhost:3000
```

## Deploying to Vercel — as ONE project

1. **Push this whole folder** (with `vercel.json` at the root, `frontend/` and `backend/` as
   siblings) to a GitHub repo.
2. In Vercel, **Add New Project** → import that repo. Leave **Root Directory** as the repo root
   (do NOT set it to `frontend` or `backend` — the root `vercel.json` needs to be picked up).
3. In **Project Settings → General → Framework Preset**, set it to **Other**. The root
   `vercel.json` explicitly defines both builds, so Vercel shouldn't auto-apply Next.js zero-config
   on top of it.
4. Add environment variables in **Project Settings → Environment Variables**:
   - Backend: `MONGO_URI`, `JWT_SECRET`, `JWT_EXPIRES_IN`, `CLIENT_URL` (set this to your final
     deployed URL, e.g. `https://ajwasweets.vercel.app`), `WHATSAPP_NUMBER`,
     `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.
   - Frontend: `NEXT_PUBLIC_SITE_URL` (same deployed URL — feeds SEO/sitemap). You can leave
     `NEXT_PUBLIC_API_URL` **unset** — the frontend already falls back to the relative path `/api`,
     which resolves to your backend automatically since they're on the same domain.
5. Click **Deploy**. Vercel builds the Express API as a serverless function and the Next.js app
   together, and routes `/api/*` to the backend, everything else to the frontend.
6. Once live, run the seed script once against your production database (locally, pointed at the
   Atlas `MONGO_URI` you're using in production) to create your first admin login — or use
   Mongo Atlas's UI to insert one directly.

That's it — one Vercel project, one URL, one deployment for both frontend and backend.

## If you ever want to split them again

Nothing here prevents deploying `frontend/` and `backend/` as two separate Vercel projects later
(each already has everything it needs to stand alone) — just set `NEXT_PUBLIC_API_URL` on the
frontend to point at the backend's separate URL instead of relying on the relative `/api` default.
