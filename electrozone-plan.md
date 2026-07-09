# ElectroZone — React Rebuild + Admin Dashboard + AI Assistant
### Hackathon architecture & build plan

**Reference site:** https://electrozone-dz.com — an Algerian appliance/electronics store (French UI, prices in DA). Categories: réfrigérateur, congélateur, machine à laver, lave-vaisselle, cuisinière, micro-onde, machine à café, TV, aspirateur. Brands: Condor, Bosch, Delonghi, Bomann, Bissell, Cristor, DigiTech.

Decisions locked in: **Supabase** backend · **Gemini API** assistant · this document is the plan (no code yet).

---

## 1. Recommended tech stack

| Layer | Choice | Why (hackathon reasoning) |
|---|---|---|
| Framework | **React + Vite** | Instant dev server, near-zero config, fast builds. Don't use CRA. |
| Language | **TypeScript** | Autocomplete on your data models saves debugging time under pressure. Optional if the team isn't comfortable. |
| Routing | **React Router v6** | Standard, storefront + `/admin` split. |
| Styling | **Tailwind CSS** | Fastest way to a polished UI in a demo. |
| UI kit | **shadcn/ui** | Copy-paste accessible components (tables, dialogs, forms) — huge for the admin dashboard. |
| State/data | **TanStack Query (React Query)** | Handles Supabase fetching, caching, loading states for free. |
| Forms | **React Hook Form + Zod** | "Add item / add packet" forms with validation, minimal boilerplate. |
| Backend | **Supabase** | Postgres + Auth + Storage + auto REST API. One dashboard, free tier. |
| Image upload | **Supabase Storage** | Product photos, drag-and-drop from admin. |
| AI | **Gemini API** (`gemini-1.5-flash`) | Fast, generous free tier, good French support. |
| Charts | **Recharts** | Admin KPI cards + sales chart. |
| Deploy | **Vercel** (frontend) + Supabase (managed) | `git push` → live URL for judges. |

**One-line pitch of the stack:** Vite/React/Tailwind front end, Supabase as the whole backend, Gemini for the shopping assistant, deployed on Vercel.

---

## 2. Project structure

```
electrozone/
├── src/
│   ├── lib/
│   │   ├── supabase.ts          # client init
│   │   └── gemini.ts            # assistant call + system prompt
│   ├── types/                   # Product, Bundle, Offer, Category
│   ├── hooks/                   # useProducts, useBundles, useOffers
│   ├── components/
│   │   ├── ui/                  # shadcn components
│   │   └── shared/              # Navbar, ProductCard, PriceTag
│   ├── features/
│   │   ├── storefront/          # home, category, product, cart
│   │   ├── assistant/           # chat widget
│   │   └── admin/
│   │       ├── AdminLayout.tsx
│   │       ├── Dashboard.tsx    # KPIs
│   │       ├── Products/        # list + Add/Edit item
│   │       ├── Bundles/         # "packets" — Add packet
│   │       ├── Offers/          # discounts & promos
│   │       └── Orders/
│   ├── routes.tsx
│   └── main.tsx
├── .env.local                   # keys (never commit)
└── ...
```

---

## 3. Data model (Supabase / Postgres)

Core tables. `snake_case` columns, `uuid` primary keys, `created_at timestamptz default now()`.

**categories** — `id, name_fr, slug, icon, parent_id (nullable, self-ref for sub-categories)`

**products** — `id, name, description, brand, category_id → categories, price, stock, image_url, specs (jsonb), is_active`
- `specs` as JSONB holds appliance attributes (capacity, power, energy_class) without rigid columns — flexible for the assistant to reason over.

**bundles** ("packets", e.g. *Pack Mariage*) — `id, name, description, image_url, bundle_price (optional override), is_active`

**bundle_items** — join table — `bundle_id → bundles, product_id → products, quantity`
- A packet = a bundle + its rows here. Admin picks products and quantities; the app sums component prices and shows the discount vs. `bundle_price`.

**offers / discounts** — `id, title, type ('percentage' | 'fixed'), value, scope ('product' | 'category' | 'bundle' | 'sitewide'), target_id (nullable), starts_at, ends_at, is_active`
- One flexible table covers "-14% on this product", "-10% on machine à café category", or a sitewide promo.

**orders** — `id, customer_name, phone, wilaya, address, status, total, created_at`
**order_items** — `id, order_id, product_id | bundle_id, quantity, unit_price`

**Security:** enable Row Level Security. Public role → read `products/bundles/offers/categories` only. Admin writes gated behind Supabase Auth (a single admin user is enough for the demo). Keep it simple: one `profiles` table with a `role` column, policy `role = 'admin'` for all writes.

---

## 4. Admin dashboard — the focus area

Route everything under `/admin` behind an auth guard. Layout = sidebar + top bar + content.

**Dashboard home** — KPI cards (total products, active offers, orders today, revenue) + a small Recharts sales line. Pull counts with Supabase `count` queries.

**Products — "Add item easily"**
- Table with search, category filter, stock badge, active toggle, edit/delete (shadcn DataTable).
- "Add item" opens a dialog/side-sheet: name, brand, category (dropdown from `categories`), price, stock, description, image drag-drop → Supabase Storage, and a small key/value editor for `specs`. React Hook Form + Zod validates before insert.
- Inline stock edit and active/inactive toggle so managing the catalog is one click.

**Bundles — "Add packet easily" (e.g. Pack Mariage)**
- This is the standout feature. "New packet" flow:
  1. Name + description + cover image ("Pack Mariage", "Pack Cuisine").
  2. **Product picker**: search the catalog, click to add, set quantity. Selected items list on the right with running subtotal.
  3. App auto-computes the sum of components; admin optionally sets a `bundle_price` below it → UI shows "économisez X DA".
  4. Save → writes `bundles` + `bundle_items` rows.
- Result: building a wedding/kitchen pack takes ~30 seconds and shows a clear saving to shoppers.

**Offers & discounts**
- List of active/scheduled/expired promos.
- "New offer" form: title, type (% or fixed DA), value, scope (product / category / bundle / sitewide) with a target picker, start & end dates, active toggle.
- Storefront applies the best matching active offer to each product's price and shows the strikethrough + "X% Off" badge — matching how the current site already displays promos.

**Orders** — table of incoming orders with status dropdown (nouveau → confirmé → livré). Algeria-style checkout (name, phone, wilaya, cash-on-delivery) rather than online payment — realistic for the market and avoids payment-gateway setup during a hackathon.

---

## 5. AI shopping assistant (Gemini, catalog-restricted)

**Goal:** a chat widget that guides shoppers to products by need and **budget**, and refuses anything outside ElectroZone's own information.

**How it stays restricted to site data — two layers:**

1. **Grounding (RAG-lite).** On each question, fetch the live catalog from Supabase (id, name, brand, category, price, key specs, active offer) and inject it into the prompt as the *only* allowed knowledge source. For a hackathon the catalog is small enough to pass a compact JSON list directly — no vector DB needed. If it grows, add `pgvector` + embeddings later.

2. **System prompt guardrails.** Instruct Gemini:
   - "You are ElectroZone's shopping assistant. Answer **only** using the PRODUCTS list provided below. If the answer isn't in that data, say you can only help with ElectroZone products and offer to connect them to the store."
   - "Never invent products, prices, or specs. Always quote prices in DA from the data."
   - "When the user gives a budget, only recommend items at or under it, sorted by fit; if nothing fits, say so and suggest the closest option or a bundle."
   - Reply in the user's language (French/Arabic/English).

**Budget flow example:** user says *"J'ai 150000 DA pour équiper ma cuisine"* → assistant filters catalog ≤ budget, proposes a combination or an existing *Pack Cuisine*, lists items with prices and the running total, links each to its product page.

**Implementation shape:**
- `POST` to Gemini `generateContent` with `{ systemInstruction, contents: [history + user msg], catalog }`.
- Keep the API key server-side. Easiest secure option: a **Supabase Edge Function** (`/assistant`) that holds the key, fetches the catalog, calls Gemini, returns the reply. The React widget just calls that function — key never ships to the browser.
- Optional polish: ask Gemini to return structured JSON (`{reply, recommended_product_ids[]}`) so the widget can render real product cards under the text instead of plain chat.

**Guardrail test cases to demo:** an in-budget request (should recommend), an out-of-scope question like "what's the weather" (should politely refuse), and an over-budget request (should say nothing fits + suggest closest).

---

## 6. Build order for the hackathon (suggested timeboxing)

1. **Setup (30–45 min):** Vite + Tailwind + shadcn, Supabase project, create tables, seed ~15 real products from the site across a few categories.
2. **Supabase client + types + hooks (30 min).**
3. **Admin: Products CRUD (60–90 min)** — highest-value, do first.
4. **Admin: Bundles/packets (60 min)** — the differentiator.
5. **Admin: Offers (45 min).**
6. **Storefront (60 min)** — home, category grid, product card with offer badges, simple cart. Reuse the site's look (French labels, DA prices, "Ajouter au Panier").
7. **AI assistant (60–90 min)** — Edge Function + chat widget + guardrails.
8. **Polish + deploy to Vercel + rehearse the demo (45 min).**

If time runs short, cut in this order: storefront cart → orders → charts. Never cut: Products, Bundles, Assistant — those three tell your story to judges.

---

## 7. Demo script (what to show judges)

1. Add a new product live in ~20 seconds.
2. Build a **Pack Mariage** from 4 appliances, set a bundle price, show the auto-calculated saving.
3. Create a "-15% on machine à café" offer and switch to the storefront to show the badge applied.
4. Open the assistant, type a budget in DA, watch it recommend real in-stock items + a bundle, then ask it something off-topic and show it politely refusing.

---

## 8. Environment variables

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
# server-side only (Edge Function secret, NOT VITE_):
GEMINI_API_KEY=...
```

Get free keys: Supabase → New Project. Gemini → Google AI Studio → Get API key.
