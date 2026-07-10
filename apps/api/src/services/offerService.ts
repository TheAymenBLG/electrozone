import { prisma } from "../lib/prisma.js";
import type { Offer } from "@electrozone/shared";

function toShape(o: any): Offer {
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

export async function listOffers() {
  const rows = await prisma.offer.findMany({ orderBy: { createdAt: "desc" } });
  return rows.map(toShape);
}

export async function createOffer(data: Omit<Offer, "id">) {
  const row = await prisma.offer.create({ data: { ...data } });
  return toShape(row);
}

export async function updateOffer(id: string, data: Omit<Offer, "id">) {
  const row = await prisma.offer.update({ where: { id }, data: { ...data } });
  return toShape(row);
}

export async function upsertOffer(input: Omit<Offer, "id"> & { id?: string }) {
  if (input.id) {
    const { id, ...rest } = input;
    const existing = await prisma.offer.findUnique({ where: { id } });
    if (existing) return updateOffer(id, rest);
  }
  return createOffer(input);
}

export async function deleteOffer(id: string) {
  await prisma.offer.delete({ where: { id } });
}