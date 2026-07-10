import type { Product, Offer, Bundle } from "@electrozone/shared";

export interface PricedProduct {
  product: Product;
  finalPrice: number;
  originalPrice: number;
  discountPct: number; // 0 when no offer
  offer: Offer | null;
}

function isLive(o: Offer): boolean {
  if (!o.isActive) return false;
  const now = new Date().toISOString().slice(0, 10);
  return o.startsAt <= now && o.endsAt >= now;
}

/** Returns the best matching live offer for a product, applied to its price. */
export function priceProduct(product: Product, offers: Offer[]): PricedProduct {
  const matching = offers.filter((o) => {
    if (!isLive(o)) return false;
    if (o.scope === "sitewide") return true;
    if (o.scope === "product") return o.targetId === product.id;
    if (o.scope === "category") return o.targetId === product.categorySlug;
    return false;
  });

  let best: PricedProduct = {
    product,
    finalPrice: product.price,
    originalPrice: product.price,
    discountPct: 0,
    offer: null,
  };

  for (const o of matching) {
    const final =
      o.type === "percentage"
        ? product.price * (1 - o.value / 100)
        : Math.max(0, product.price - o.value);
    if (final < best.finalPrice) {
      best = {
        product,
        finalPrice: Math.round(final),
        originalPrice: product.price,
        discountPct: Math.round((1 - final / product.price) * 100),
        offer: o,
      };
    }
  }
  return best;
}

/** Sum of a bundle's component prices (before any bundle override). */
export function bundleComponentTotal(
  bundle: Bundle,
  products: Product[],
): number {
  return bundle.items.reduce((sum, it) => {
    const p = products.find((x) => x.id === it.productId);
    return sum + (p ? p.price * it.quantity : 0);
  }, 0);
}

export function bundleFinalPrice(bundle: Bundle, products: Product[]): number {
  return bundle.bundlePrice ?? bundleComponentTotal(bundle, products);
}
