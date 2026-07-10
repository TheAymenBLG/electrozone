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
  price: number;
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
  bundlePrice: number | null;
  isActive: boolean;
}

export type OfferType = "percentage" | "fixed";
export type OfferScope = "product" | "category" | "sitewide";

export interface Offer {
  id: string;
  title: string;
  type: OfferType;
  value: number;
  scope: OfferScope;
  targetId: string | null;
  startsAt: string;
  endsAt: string;
  isActive: boolean;
}

export interface CartLine {
  kind: "product" | "bundle";
  id: string;
  quantity: number;
}

export interface PricedProduct {
  product: Product;
  finalPrice: number;
  originalPrice: number;
  discountPct: number;
  offer: Offer | null;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface OrderItemInput {
  kind: "product" | "bundle";
  id: string;
  quantity: number;
  unitPrice: number;
}

export interface CreateOrderBody {
  customerName: string;
  phone: string;
  wilaya: string;
  address: string;
  items: OrderItemInput[];
  total: number;
}