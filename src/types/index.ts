export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  categorySlug: string;
  price: number; // DA
  stock: number;
  description: string;
  imageUrl: string;
  specs: Record<string, string>;
  isActive: boolean;
}

export interface BundleItem {
  productId: string;
  quantity: number;
}

export interface Bundle {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  items: BundleItem[];
  bundlePrice: number | null; // override; null = sum of components
  isActive: boolean;
}

export type OfferType = "percentage" | "fixed";
export type OfferScope = "product" | "category" | "sitewide";

export interface Offer {
  id: string;
  title: string;
  type: OfferType;
  value: number; // percent (0-100) or fixed DA
  scope: OfferScope;
  targetId: string | null; // product id or category slug
  startsAt: string; // ISO date
  endsAt: string; // ISO date
  isActive: boolean;
}

export interface CartLine {
  kind: "product" | "bundle";
  id: string;
  quantity: number;
}
