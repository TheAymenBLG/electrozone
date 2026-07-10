import { prisma } from "../lib/prisma.js";
import type { Product } from "@electrozone/shared";

function toShape(p: any): Product {
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

export async function listProducts() {
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toShape);
}

export async function getProduct(id: string) {
  const row = await prisma.product.findUnique({ where: { id } });
  return row ? toShape(row) : null;
}

export async function getProductsByCategory(slug: string) {
  const rows = await prisma.product.findMany({
    where: { categorySlug: slug, isActive: true },
    orderBy: { createdAt: "desc" },
  });
  return rows.map(toShape);
}

export async function createProduct(data: Omit<Product, "id">) {
  const row = await prisma.product.create({ data: { ...data } });
  return toShape(row);
}

export async function updateProduct(id: string, data: Omit<Product, "id">) {
  const row = await prisma.product.update({ where: { id }, data: { ...data } });
  return toShape(row);
}

export async function upsertProduct(input: Omit<Product, "id"> & { id?: string }) {
  if (input.id) {
    const { id, ...rest } = input;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (existing) return updateProduct(id, rest);
  }
  return createProduct(input);
}

export async function deleteProduct(id: string) {
  await prisma.product.delete({ where: { id } });
}