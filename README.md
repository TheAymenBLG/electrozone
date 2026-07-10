# ElectroZone — E-commerce + Admin Dashboard + AI Assistant

Hackathon build inspired by [electrozone-dz.com](https://electrozone-dz.com) — an Algerian appliance store. French UI, prices in DA.

## Architecture

Monorepo with npm workspaces:

```
apps/web/          React + Vite frontend (storefront + admin + AI assistant)
apps/api/          Node/Express backend (routes → controllers → services → Prisma)
packages/shared/   TypeScript types + Zod schemas (imported by both apps)
```

- The **frontend** never imports Prisma, never holds DB connection strings, never holds secret API keys. It only calls the backend over HTTP.
- The **backend** is layered: routes wire controllers + validation + auth; controllers call services; services call Prisma. No route file contains raw SQL or business logic.
- Every API endpoint's request shape is validated with `zod.safeParse()` via middleware, against schemas in `packages/shared/src/schemas.ts`.
- Both apps import types from `@electrozone/shared` — no duplicated interfaces.
- CORS on the backend is scoped to the frontend's origin (`WEB_ORIGIN`).
- Admin/protected routes require a JWT (`requireAdmin` middleware) — not just hidden by frontend routing.
- No cross-app imports: `apps/web` and `apps/api` only import from `@electrozone/shared`.

## Quick start

### Prerequisites

- Node 18+
- PostgreSQL (local or Docker):
  ```bash
  docker run --name electrozone-db -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=electrozone -p 5432:5432 -d postgres:16
  ```

### Setup

```bash
# 1. Install all workspace dependencies
npm install

# 2. Configure the backend env
cp .env.example apps/api/.env
# edit apps/api/.env — set DATABASE_URL to your Postgres

# 3. Create the DB schema + seed it with real ElectroZone products
npm run db:push
npm run db:seed

# 4. Start both apps (in two terminals)
npm run dev:api    # backend on http://localhost:4000
npm run dev:web    # frontend on http://localhost:5173 (proxies /api → backend)
```

Open http://localhost:5173:
- Storefront: `/`
- Admin dashboard: `/admin` (login with password `admin` by default)
- AI assistant: the gold chat bubble, bottom-right

## API endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/catalog` | — | Full catalog (categories, products, bundles, offers) |
| GET | `/api/categories` | — | All categories |
| GET | `/api/products` | — | All products |
| GET | `/api/products/:id` | — | Single product |
| GET | `/api/products/by-category/:slug` | — | Products in a category |
| POST | `/api/products` | admin | Create or update a product |
| DELETE | `/api/products/:id` | admin | Delete a product |
| GET | `/api/bundles` | — | All bundles |
| GET | `/api/bundles/:id` | — | Single bundle |
| POST | `/api/bundles` | admin | Create or update a bundle |
| DELETE | `/api/bundles/:id` | admin | Delete a bundle |
| GET | `/api/offers` | — | All offers |
| POST | `/api/offers` | admin | Create or update an offer |
| DELETE | `/api/offers/:id` | admin | Delete an offer |
| POST | `/api/orders` | — | Place an order |
| GET | `/api/orders` | admin | List all orders |
| POST | `/api/assistant` | — | Ask the AI assistant |
| POST | `/api/auth/login` | — | Admin login → JWT |

## Optional: enable Gemini (real AI)

Set `GEMINI_API_KEY` in `apps/api/.env` (get a free key at [Google AI Studio](https://aistudio.google.com/app/apikey)).
The key stays server-side — the frontend calls `/api/assistant`, the backend calls Gemini.
If no key is set, the assistant falls back to a rule-based reply.

## Tech stack

React + Vite + TypeScript · Tailwind CSS · React Router · Express · Prisma · PostgreSQL · Zod · JWT · lucide-react · Gemini (optional)