import { useParams, Link } from "react-router-dom";
import { useProducts, useOffers, useCategories } from "../../data/store";
import ProductCard from "../../components/ProductCard";

export default function Category() {
  const { slug } = useParams();
  const products = useProducts();
  const offers = useOffers();
  const categories = useCategories();
  const cat = categories.find((c) => c.slug === slug);
  const items = products.filter((p) => p.categorySlug === slug && p.isActive);

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 py-10">
      <nav className="font-mono text-xs text-cloud-muted mb-6">
        <Link to="/" className="hover:text-gold">ACCUEIL</Link>
        <span className="mx-2">/</span>
        <span className="text-gold uppercase">{cat?.name ?? "Catégorie"}</span>
      </nav>
      <div className="flex items-end justify-between mb-8 border-b border-edge pb-4">
        <h1 className="font-head font-bold text-3xl md:text-4xl">{cat?.name ?? "Catégorie"}</h1>
        <span className="font-mono text-xs text-cloud-muted">{items.length} PRODUIT(S)</span>
      </div>
      {items.length === 0 ? (
        <div className="bg-navy-card border border-edge rounded-xl p-16 text-center text-cloud-muted">
          Aucun produit dans cette catégorie pour le moment.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map((p) => (
            <ProductCard key={p.id} product={p} offers={offers} />
          ))}
        </div>
      )}
    </div>
  );
}
