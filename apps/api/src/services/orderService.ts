import { prisma } from "../lib/prisma.js";
import type { CreateOrderBody } from "@electrozone/shared";

export async function createOrder(data: CreateOrderBody) {
  const row = await prisma.order.create({
    data: {
      customerName: data.customerName,
      phone: data.phone,
      wilaya: data.wilaya,
      address: data.address,
      total: data.total,
      items: {
        create: data.items.map((it) => ({
          kind: it.kind,
          productId: it.kind === "product" ? it.id : null,
          bundleId: it.kind === "bundle" ? it.id : null,
          quantity: it.quantity,
          unitPrice: it.unitPrice,
        })),
      },
    },
    include: { items: true },
  });
  return { id: row.id, status: row.status };
}

export async function listOrders() {
  const rows = await prisma.order.findMany({
    include: { items: true },
    orderBy: { createdAt: "desc" },
  });
  return rows;
}