import { useSyncExternalStore } from "react";
import type { Product, Bundle, Offer, Category } from "../types";
import { seedProducts, seedBundles, seedOffers, seedCategories } from "./seed";

/**
 * Lightweight data layer for the hackathon.
 *
 * It persists to localStorage so the whole app (including admin CRUD) works with
 * zero backend setup. When you're ready for Supabase, replace the read/write
 * helpers below with Supabase queries (see supabase/schema.sql and lib/supabase.ts).
 */

const KEY = "electrozone_state_v3";

interface State {
  categories: Category[];
  products: Product[];
  bundles: Bundle[];
  offers: Offer[];
}

function load(): State {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as State;
  } catch {
    /* ignore */
  }
  return {
    categories: seedCategories,
    products: seedProducts,
    bundles: seedBundles,
    offers: seedOffers,
  };
}

let state: State = load();
const listeners = new Set<() => void>();

function persist() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore quota errors */
  }
  listeners.forEach((l) => l());
}

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => listeners.delete(cb);
}

// ---- Selectors (hooks) ----
export function useProducts() {
  return useSyncExternalStore(subscribe, () => state.products);
}
export function useBundles() {
  return useSyncExternalStore(subscribe, () => state.bundles);
}
export function useOffers() {
  return useSyncExternalStore(subscribe, () => state.offers);
}
export function useCategories() {
  return useSyncExternalStore(subscribe, () => state.categories);
}

// ---- Plain getters (for non-react code like the assistant) ----
export const getProducts = () => state.products;
export const getBundles = () => state.bundles;
export const getOffers = () => state.offers;
export const getCategories = () => state.categories;

const uid = () => Math.random().toString(36).slice(2, 9);

// ---- Product mutations ----
export function saveProduct(p: Omit<Product, "id"> & { id?: string }) {
  if (p.id) {
    state.products = state.products.map((x) => (x.id === p.id ? (p as Product) : x));
  } else {
    state.products = [{ ...p, id: uid() } as Product, ...state.products];
  }
  persist();
}
export function deleteProduct(id: string) {
  state.products = state.products.filter((p) => p.id !== id);
  persist();
}

// ---- Bundle mutations ----
export function saveBundle(b: Omit<Bundle, "id"> & { id?: string }) {
  if (b.id) {
    state.bundles = state.bundles.map((x) => (x.id === b.id ? (b as Bundle) : x));
  } else {
    state.bundles = [{ ...b, id: uid() } as Bundle, ...state.bundles];
  }
  persist();
}
export function deleteBundle(id: string) {
  state.bundles = state.bundles.filter((b) => b.id !== id);
  persist();
}

// ---- Offer mutations ----
export function saveOffer(o: Omit<Offer, "id"> & { id?: string }) {
  if (o.id) {
    state.offers = state.offers.map((x) => (x.id === o.id ? (o as Offer) : x));
  } else {
    state.offers = [{ ...o, id: uid() } as Offer, ...state.offers];
  }
  persist();
}
export function deleteOffer(id: string) {
  state.offers = state.offers.filter((o) => o.id !== id);
  persist();
}

export function resetStore() {
  state = {
    categories: seedCategories,
    products: seedProducts,
    bundles: seedBundles,
    offers: seedOffers,
  };
  persist();
}
