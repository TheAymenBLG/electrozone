-- ElectroZone — Supabase schema (upgrade path from the localStorage demo)
-- Run in Supabase SQL editor. Then migrate src/data/store.ts to query these tables.

create extension if not exists "pgcrypto";

create table if not exists categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text unique not null
);

create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  brand text,
  category_slug text references categories(slug),
  price numeric not null,
  stock int not null default 0,
  description text,
  image_url text,
  specs jsonb not null default '{}',
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists bundles (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  image_url text,
  bundle_price numeric,           -- null = sum of components
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists bundle_items (
  bundle_id uuid references bundles(id) on delete cascade,
  product_id uuid references products(id) on delete cascade,
  quantity int not null default 1,
  primary key (bundle_id, product_id)
);

create table if not exists offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  type text not null check (type in ('percentage','fixed')),
  value numeric not null,
  scope text not null check (scope in ('product','category','sitewide')),
  target_id text,                 -- product id or category slug
  starts_at date not null,
  ends_at date not null,
  is_active boolean not null default true
);

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text,
  phone text,
  wilaya text,
  address text,
  status text not null default 'nouveau',
  total numeric,
  created_at timestamptz not null default now()
);

create table if not exists order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid references orders(id) on delete cascade,
  product_id uuid references products(id),
  bundle_id uuid references bundles(id),
  quantity int not null default 1,
  unit_price numeric not null
);

-- Row Level Security: public can read catalog, only admins write.
alter table products enable row level security;
alter table bundles enable row level security;
alter table offers enable row level security;
alter table categories enable row level security;

create policy "public read products" on products for select using (true);
create policy "public read bundles" on bundles for select using (true);
create policy "public read offers" on offers for select using (true);
create policy "public read categories" on categories for select using (true);

-- For the demo, an authenticated admin user can write. Tighten with a profiles.role
-- check in production.
create policy "auth write products" on products for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write bundles" on bundles for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "auth write offers" on offers for all
  using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
