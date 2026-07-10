import { useSyncExternalStore, useEffect, useState } from "react";
import type { Product, Bundle, Offer, Category } from "@electrozone/shared";
import { api } from "../lib/api-client";

interface State {
  categories: Category[];
  products: Product[];
  bundles: Bundle[];
  offers: Offer[];
}

const empty: State = { categories: [], products: [], bundles: [], offers: [] };

let state: State = empty;
let loading = true;
let error: string | null = null;
const listeners = new Set<() => void>();

function emit() {
  listeners.forEach((l) => l());
}

export async function refreshStore() {
  loading = true;
  emit();
  try {
    state = await api.getCatalog();
    error = null;
  } catch (e) {
    error = e instanceof Error ? e.message : "Failed to load";
  } finally {
    loading = false;
    emit();
  }
}

let initialized = false;
function ensureInit() {
  if (initialized) return;
  initialized = true;
  void refreshStore();
}

function subscribe(cb: () => void) {
  ensureInit();
  listeners.add(cb);
  return () => listeners.delete(cb);
}

export function useStore() {
  return useSyncExternalStore(subscribe, () => state);
}

export function useStoreLoading() {
  return useSyncExternalStore(subscribe, () => loading);
}

export function useStoreError() {
  return useSyncExternalStore(subscribe, () => error);
}

export function useProducts() {
  return useStore().products;
}
export function useBundles() {
  return useStore().bundles;
}
export function useOffers() {
  return useStore().offers;
}
export function useCategories() {
  return useStore().categories;
}

export async function saveProduct(p: Omit<Product, "id"> & { id?: string }) {
  await api.saveProduct(p);
  await refreshStore();
}
export async function deleteProduct(id: string) {
  await api.deleteProduct(id);
  await refreshStore();
}

export async function saveBundle(b: Omit<Bundle, "id"> & { id?: string }) {
  await api.saveBundle(b);
  await refreshStore();
}
export async function deleteBundle(id: string) {
  await api.deleteBundle(id);
  await refreshStore();
}

export async function saveOffer(o: Omit<Offer, "id"> & { id?: string }) {
  await api.saveOffer(o);
  await refreshStore();
}
export async function deleteOffer(id: string) {
  await api.deleteOffer(id);
  await refreshStore();
}

export function resetStore() {
  void refreshStore();
}