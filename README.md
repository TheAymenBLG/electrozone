# ElectroZone — React e-commerce + Admin Dashboard + AI Assistant

Hackathon build inspired by [electrozone-dz.com](https://electrozone-dz.com) — an Algerian appliance store. French UI, prices in DA.

**It runs with zero backend setup.** Data is seeded with real ElectroZone products and persisted to your browser's localStorage, so admin CRUD works immediately. Supabase and Gemini are optional upgrades (see below).

## Quick start

```bash
npm install
npm run dev
```

Open the URL Vite prints (usually http://localhost:5173).

- Storefront: `/`
- Admin dashboard: `/admin`
- AI assistant: the blue chat bubble, bottom-right.

## Tech stack

React + Vite + TypeScript · Tailwind CSS · React Router · lucide-react icons · Supabase (optional) · Gemini (optional).

## Features

**Storefront** — home with promos + packs, category pages, product pages, cart with cash-on-delivery checkout, offer badges (strikethrough + % off).

**Admin dashboard** (`/admin`)
- **Dashboard** — KPIs (active products, packs, offers, stock value) + low-stock list.
- **Produits** — searchable table; add/edit products in a dialog with image URL, stock, active toggle, and a key/value **specs editor**.
- **Packs** — the "add packet easily" builder (e.g. **Pack Mariage**): search the catalog, click to add products, set quantities, optionally set a pack price, and see the **customer saving computed live**.
- **Offres & Promos** — create % or fixed-DA discounts scoped to a product, a category, or the whole site, with start/end dates and status (active/scheduled/expired). The storefront applies the best live offer automatically.

**AI assistant** — a simple chat bot that reads the live catalog and guides shoppers by need and **budget**, restricted to ElectroZone data only. Works offline via a rule-based fallback; add a Gemini key for real LLM answers.

## Optional: enable Gemini (real AI)

1. Get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey).
2. `cp .env.example .env.local` and set `VITE_GEMINI_API_KEY=...`
3. Restart `npm run dev`.

The assistant sends the live product catalog as the **only** allowed knowledge source, with a strict system prompt (stay on ElectroZone data, respect budget, never invent products).

> Security note: for the hackathon the key is used client-side for simplicity. For production, move the Gemini call to a Supabase Edge Function so the key isn't exposed. The `askAssistant` function in `src/lib/gemini.ts` is the single place to swap.

## Optional: enable Supabase (real backend)

1. Create a project at [supabase.com](https://supabase.com).
2. Run `supabase/schema.sql` in the SQL editor (creates tables + RLS policies).
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env.local`.
4. Migrate the read/write helpers in `src/data/store.ts` from localStorage to Supabase queries (the client is ready in `src/lib/supabase.ts`).

## Project structure

```
src/
├── lib/          supabase, gemini (assistant), offers pricing, format
├── types/        Product, Bundle, Offer, Category
├── data/         seed (real products) + store (localStorage data layer)
├── context/      CartContext
├── components/   Navbar, Footer, ProductCard, AssistantWidget
└── features/
    ├── storefront/  Home, Category, ProductPage, Cart
    └── admin/       AdminLayout, Dashboard, Products, Bundles, Offers
supabase/schema.sql
```

## Demo script (for judges)

1. Add a product live in ~20s (Admin → Produits → Ajouter).
2. Build a **Pack Mariage** from 4 appliances, set a pack price, show the live saving.
3. Create a "-15% machine à café" offer, then open the storefront to see the badge applied.
4. Open the assistant, type a budget in DA (e.g. "frigo pour 130000 DA"), watch it recommend real in-stock items; then ask something off-topic and see it politely refuse.

## Reset

Admin sidebar → "Réinitialiser la démo" restores the seeded data.
