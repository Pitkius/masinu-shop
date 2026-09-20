# APEX — automotive one-stop shop

Premium parts and tuning storefront. Select a car, find compatible parts, build a setup, and check out.

## Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Prisma schema ready for PostgreSQL
- Catalog currently served from curated inventory (`src/data`)

## Scripts

```bash
npm run dev
npm run lint
npx tsc --noEmit
npm run build
```

## Admin

Local development password: `apex-admin`

Production requires `ADMIN_PASSWORD` (and ideally `ADMIN_SECRET`) as server environment variables. Never put supplier API keys in the client.

## Persistence

Guest garage, cart, wishlist and builds are stored on the device. Checkout totals are validated on the server from catalog prices, then the customer pays on Stripe Checkout. Set `STRIPE_SECRET_KEY` (and `STRIPE_WEBHOOK_SECRET` for `/api/stripe/webhook`) in Vercel. Connect `DATABASE_URL` to persist users, orders and admin edits.

## Virtual try-on

Upload a photo of the car on `/try-on`. The site generates how **that same car** looks with the part fitted (lowered stance, new grille, wheels, lights) — not a product PNG stuck on top. Parts that live under the hood only change an engine-bay photo; cabin parts need an interior photo. Set `OPENAI_API_KEY` (or `TRYON_API_URL`) on the server.
