import { prisma } from "../lib/prisma.js";
import type { Category, Product, Bundle, Offer } from "@electrozone/shared";

function toProductShape(p: any): Product {
  return {
    id: p.id,
    name: p.name,
    brand: p.brand,
    categorySlug: p.categorySlug,
    price: p.price,
    stock: p.stock,
    description: p.description,
    imageUrl: p.imageUrl,
    specs: p.specs as Record<string, string>,
    isActive: p.isActive,
  };
}

function toBundleShape(b: any): Bundle {
  return {
    id: b.id,
    name: b.name,
    description: b.description,
    imageUrl: b.imageUrl,
    items: (b.items ?? []).map((it: any) => ({ productId: it.productId, quantity: it.quantity })),
    bundlePrice: b.bundlePrice,
    isActive: b.isActive,
  };
}

function toOfferShape(o: any): Offer {
  return {
    id: o.id,
    title: o.title,
    type: o.type,
    value: o.value,
    scope: o.scope,
    targetId: o.targetId,
    startsAt: o.startsAt,
    endsAt: o.endsAt,
    isActive: o.isActive,
  };
}

function toCategoryShape(c: any): Category {
  return { id: c.id, name: c.name, slug: c.slug };
}

export async function getCatalog() {
  const [categories, products, bundles, offers] = await Promise.all([
    prisma.category.findMany({ orderBy: { slug: "asc" } }),
    prisma.product.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.bundle.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } }),
    prisma.offer.findMany({ orderBy: { createdAt: "desc" } }),
  ]);
  return {
    categories: categories.map(toCategoryShape),
    products: products.map(toProductShape),
    bundles: bundles.map(toBundleShape),
    offers: offers.map(toOfferShape),
  };
}

export async function getCategories() {
  const rows = await prisma.category.findMany({ orderBy: { slug: "asc" } });
  return rows.map(toCategoryShape);
}

export async function getProducts() {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toProductShape);
}

export async function getBundles() {
  const rows = await prisma.bundle.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  return rows.map(toBundleShape);
}

export async function getOffers() {
  const rows = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toOfferShape);
}