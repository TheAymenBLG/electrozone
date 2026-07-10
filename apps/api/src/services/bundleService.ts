import { prisma } from "../lib/prisma.js";
import type { Bundle } from "@electrozone/shared";

function toShape(b: any): Bundle {
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

export async function listBundles() {
  const rows = await prisma.bundle.findMany({ include: { items: true }, orderBy: { createdAt: "desc" } });
  return rows.map(toShape);
}

export async function getBundle(id: string) {
  const row = await prisma.bundle.findUnique({ where: { id }, include: { items: true } });
  return row ? toShape(row) : null;
}

export async function createBundle(data: Omit<Bundle, "id">) {
  const { items, ...rest } = data;
  const row = await prisma.bundle.create({
    data: {
      ...rest,
      items: { create: items.map((it) => ({ productId: it.productId, quantity: it.quantity })) },
    },
    include: { items: true },
  });
  return toShape(row);
}

export async function updateBundle(id: string, data: Omit<Bundle, "id">) {
  const { items, ...rest } = data;
  const row = await prisma.bundle.update({
    where: { id },
    data: {
      ...rest,
      items: {
        deleteMany: {},
        create: items.map((it) => ({ productId: it.productId, quantity: it.quantity })),
      },
    },
    include: { items: true },
  });
  return toShape(row);
}

export async function upsertBundle(input: Omit<Bundle, "id"> & { id?: string }) {
  if (input.id) {
    const { id, ...rest } = input;
    const existing = await prisma.bundle.findUnique({ where: { id } });
    if (existing) return updateBundle(id, rest);
  }
  return createBundle(input);
}

export async function deleteBundle(id: string) {
  await prisma.bundle.delete({ where: { id } });
}