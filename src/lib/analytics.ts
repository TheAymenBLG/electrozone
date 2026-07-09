import type { Product, Offer } from "../types";
import { priceProduct } from "./offers";

export function unitsSold(p: Product): number {
  let h = 7;
  for (let i = 0; i < p.id.length; i++) h = (h * 33 + p.id.charCodeAt(i)) >>> 0;
  return 15 + (h % 45);
}

export interface Stats { orders: number; revenue: number; income: number; expenses: number; balance: number; }

export function dashboardStats(products: Product[], offers: Offer[]): Stats {
  const active = products.filter((p) => p.isActive);
  let orders = 0, revenue = 0;
  for (const p of active) {
    const u = unitsSold(p);
    orders += u;
    revenue += priceProduct(p, offers).finalPrice * u;
  }
  const expenses = Math.round(revenue * 0.42);
  return { orders, revenue, income: revenue, expenses, balance: revenue - expenses };
}

export function salesSeries(products: Product[], offers: Offer[], days = 8) {
  const total = dashboardStats(products, offers).revenue;
  const weights: number[] = [];
  for (let i = 0; i < days; i++) {
    weights.push(Math.max(0.25, 0.6 + 0.4 * Math.sin(i * 1.3 + 1) + 0.2 * Math.sin(i * 0.7)));
  }
  const sum = weights.reduce((a, b) => a + b, 0);
  const labels: string[] = [];
  const data: number[] = [];
  const today = new Date();
  const scale = days / 8; // keep daily magnitude comparable across ranges
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today.getTime() - i * 86400000);
    labels.push(d.toLocaleDateString("fr-FR", { day: "numeric", month: "short" }));
    data.push(Math.round((total * weights[days - 1 - i]) / sum / scale));
  }
  return { labels, data };
}

export function topSelling(products: Product[], n = 4) {
  return products.filter((p) => p.isActive).map((p) => ({ p, units: unitsSold(p) }))
    .sort((a, b) => b.units - a.units).slice(0, n);
}

const NAMES = [
  "Yacine Benali", "Amina Cherif", "Karim Haddad", "Sara Bouzid", "Mohamed Larbi",
  "Nour Belkacem", "Riad Meziane", "Lina Saadi", "Bilal Ferhat", "Imene Ould",
  "Sofiane Brahimi", "Yasmine Kaci",
];
const WILAYAS = ["Constantine", "Alger", "Oran", "Sétif", "Annaba", "Batna", "Blida"];
const STATUS = ["Livré", "En cours", "Confirmé", "Nouveau"];

export interface DemoOrder { id: string; customer: string; wilaya: string; product: string; qty: number; total: number; status: string; date: string; }

export function demoOrders(products: Product[], offers: Offer[], n = 14): DemoOrder[] {
  const active = products.filter((p) => p.isActive);
  const out: DemoOrder[] = [];
  for (let i = 0; i < n; i++) {
    const p = active[(i * 7 + 3) % active.length];
    const qty = 1 + ((i * 5) % 3);
    const total = priceProduct(p, offers).finalPrice * qty;
    out.push({
      id: "CMD-" + (1000 + i),
      customer: NAMES[i % NAMES.length],
      wilaya: WILAYAS[i % WILAYAS.length],
      product: p.name,
      qty,
      total,
      status: STATUS[i % STATUS.length],
      date: new Date(Date.now() - i * 20 * 3600000).toLocaleDateString("fr-FR"),
    });
  }
  return out;
}

export interface DemoCustomer { name: string; email: string; wilaya: string; orders: number; spent: number; }

export function demoCustomers(products: Product[], offers: Offer[]): DemoCustomer[] {
  const orders = demoOrders(products, offers, 40);
  const map = new Map<string, DemoCustomer>();
  orders.forEach((o) => {
    const c = map.get(o.customer) || { name: o.customer, email: o.customer.toLowerCase().replace(/\s/g, ".") + "@mail.dz", wilaya: o.wilaya, orders: 0, spent: 0 };
    c.orders += 1;
    c.spent += o.total;
    map.set(o.customer, c);
  });
  return [...map.values()].sort((a, b) => b.spent - a.spent);
}

export function categoryBreakdown(products: Product[], offers: Offer[]) {
  const map = new Map<string, number>();
  products.filter((p) => p.isActive).forEach((p) => {
    const rev = priceProduct(p, offers).finalPrice * unitsSold(p);
    map.set(p.categorySlug, (map.get(p.categorySlug) || 0) + rev);
  });
  return [...map.entries()].map(([slug, revenue]) => ({ slug, revenue })).sort((a, b) => b.revenue - a.revenue);
}
