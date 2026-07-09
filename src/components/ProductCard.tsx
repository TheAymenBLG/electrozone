import { Link } from "react-router-dom";
import { ShoppingCart } from "lucide-react";
import type { Product, Offer } from "../types";
import { priceProduct } from "../lib/offers";
import { formatDA } from "../lib/format";
import { useCart } from "../context/CartContext";

export default function ProductCard({ product, offers }: { product: Product; offers: Offer[] }) {
  const { add } = useCart();
  const pr = priceProduct(product, offers);

  return (
    <div className="group relative bg-navy-card border border-edge rounded-xl p-4 flex flex-col glow-hover transition-all">
      {pr.discountPct > 0 && (
        <div className="absolute top-4 left-4 z-10 bg-red-500/20 text-red-300 border border-red-400/30 font-mono text-xs px-2 py-1 rounded">
          -{pr.discountPct}%
        </div>
      )}
      <Link to={`/p/${product.id}`} className="aspect-square bg-navy-tile mb-5 rounded-lg overflow-hidden flex items-center justify-center p-4">
        <img src={product.imageUrl} alt={product.name} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300" />
      </Link>
      <div className="flex-grow">
        <p className="font-mono text-[11px] text-cloud-muted mb-1 uppercase tracking-wider">{product.brand}</p>
        <Link to={`/p/${product.id}`} className="block text-cloud font-semibold mb-2 line-clamp-2 hover:text-gold transition-colors min-h-[2.75rem]">
          {product.name}
        </Link>
        <div className="flex items-baseline gap-2 mb-5">
          <span className="font-mono text-gold text-lg">{formatDA(pr.finalPrice)}</span>
          {pr.discountPct > 0 && (
            <span className="font-mono text-xs text-cloud-muted line-through">{formatDA(pr.originalPrice)}</span>
          )}
        </div>
      </div>
      <button onClick={() => add("product", product.id)} className="w-full py-3 border border-edge rounded font-mono text-sm text-cloud hover:border-gold hover:text-gold transition-colors flex items-center justify-center gap-2 mt-auto">
        <ShoppingCart size={15} /> AJOUTER AU PANIER
      </button>
    </div>
  );
}
