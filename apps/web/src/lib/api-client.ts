import type {
  Category, Product, Bundle, Offer, ChatMessage,
} from "@electrozone/shared";

const BASE = import.meta.env.VITE_API_URL ?? "/api";

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...(init?.headers ?? {}) },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<T>;
}

function authHeaders(): Record<string, string> {
  const token = localStorage.getItem("electrozone_admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export interface Catalog {
  categories: Category[];
  products: Product[];
  bundles: Bundle[];
  offers: Offer[];
}

export const api = {
  getCatalog: () => request<Catalog>("/catalog"),

  getProducts: () => request<Product[]>("/products"),
  getProduct: (id: string) => request<Product>(`/products/${id}`),
  saveProduct: (p: Omit<Product, "id"> & { id?: string }) =>
    request<Product>("/products", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(p),
    }),
  deleteProduct: (id: string) =>
    request<{ ok: boolean }>(`/products/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),

  getBundles: () => request<Bundle[]>("/bundles"),
  saveBundle: (b: Omit<Bundle, "id"> & { id?: string }) =>
    request<Bundle>("/bundles", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(b),
    }),
  deleteBundle: (id: string) =>
    request<{ ok: boolean }>(`/bundles/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),

  getOffers: () => request<Offer[]>("/offers"),
  saveOffer: (o: Omit<Offer, "id"> & { id?: string }) =>
    request<Offer>("/offers", {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(o),
    }),
  deleteOffer: (id: string) =>
    request<{ ok: boolean }>(`/offers/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }),

  createOrder: (data: {
    customerName: string; phone: string; wilaya: string; address: string;
    items: { kind: "product" | "bundle"; id: string; quantity: number; unitPrice: number }[];
    total: number;
  }) =>
    request<{ id: string; status: string }>("/orders", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  askAssistant: (history: ChatMessage[], message: string) =>
    request<{ reply: string }>("/assistant", {
      method: "POST",
      body: JSON.stringify({ history, message }),
    }),

  login: (password: string) =>
    request<{ token: string }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
};