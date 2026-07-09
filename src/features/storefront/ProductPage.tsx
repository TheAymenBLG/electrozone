import { useParams, Link } from "react-router-dom";
import { ShoppingCart, ShieldCheck, Truck, Wallet } from "lucide-react";
import { useProducts, useOffers } from "../../data/store";
import { priceProduct } from "../../lib/offers";
import { formatDA } from "../../lib/format";
import { useCart } from "../../context/CartContext";

export default function ProductPage() {
  const { id } = useParams();
  const products = useProducts();
  const offers = useOffers();
  const { add } = useCart();
  const product = products.find((p) => p.id === id);

  if (!product)
    return (
      <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-16">
        Produit introuvable. <Link to="/" className="text-gold underline">Retour</Link>
      </div>
    );

  const pr = priceProduct(product, offers);

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-10 py-10">
      <nav className="font-mono text-xs text-cloud-muted mb-6">
        <Link to="/" className="hover:text-gold">ACCUEIL</Link>
        <span className="mx-2">/</span>
        <Link to={`/c/${product.categorySlug}`} className="hover:text-gold uppercase">{product.categorySlug}</Link>
      </nav>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="relative bg-navy-tile rounded-xl border border-edge overflow-hidden">
          {pr.discountPct > 0 && (
            <span className="absolute top-4 left-4 z-10 bg-red-500/20 text-red-300 border border-red-400/30 font-mono text-xs px-2 py-1 rounded">
              -{pr.discountPct}%
            </span>
          )}
          <img src={product.imageUrl} alt={product.name} className="w-full aspect-square object-cover" />
        </div>
        <div>
          <p className="font-mono text-xs text-cloud-muted uppercase tracking-wider">{product.brand}</p>
          <h1 className="font-head font-bold text-3xl mt-2">{product.name}</h1>
          <div className="mt-4 flex items-baseline gap-3">
            <span className="font-mono text-gold text-3xl">{formatDA(pr.finalPrice)}</span>
            {pr.discountPct > 0 && (
              <span className="font-mono text-lg text-cloud-muted line-through">{formatDA(pr.originalPrice)}</span>
            )}
          </div>
          <p className="mt-4 text-cloud-muted leading-relaxed">{product.description}</p>

          <table className="mt-6 text-sm w-full font-mono">
            <tbody>
              {Object.entries(product.specs).map(([k, v]) => (
                <tr key={k} className="border-b border-edge">
                  <td className="py-2.5 text-cloud-muted capitalize">{k.replace(/_/g, " ")}</td>
                  <td className="py-2.5 text-cloud text-right">{v}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <p className="mt-4 font-mono text-sm">
            {product.stock > 0 ? (
              <span className="text-gold">EN STOCK ({product.stock})</span>
            ) : (
              <span className="text-red-400">RUPTURE DE STOCK</span>
            )}
          </p>

          <button
            onClick={() => add("product", product.id)}
            disabled={product.stock === 0}
            className="mt-6 w-full sm:w-auto bg-gold text-navy font-mono font-bold px-8 py-4 rounded hover:bg-gold-bright disabled:opacity-50 flex items-center justify-center gap-2 transition-colors"
          >
            <ShoppingCart size={18} /> AJOUTER AU PANIER
          </button>

          <div className="mt-8 grid grid-cols-3 gap-3 font-mono text-[11px] text-cloud-muted">
            <div className="flex flex-col items-center gap-1.5 text-center"><ShieldCheck className="text-gold" size={20} /> PRODUITS ORIGINAUX</div>
            <div className="flex flex-col items-center gap-1.5 text-center"><Truck className="text-gold" size={20} /> LIVRAISON 58 WILAYAS</div>
            <div className="flex flex-col items-center gap-1.5 text-center"><Wallet className="text-gold" size={20} /> PAIEMENT À LA LIVRAISON</div>
          </div>
        </div>
      </div>
    </div>
  );
}
