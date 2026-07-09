import { Link } from "react-router-dom";
import { ShieldCheck, Truck, Headphones, ArrowRight } from "lucide-react";
import { useProducts, useOffers, useCategories } from "../../data/store";
import ProductCard from "../../components/ProductCard";
import { priceProduct } from "../../lib/offers";

const VALUE_PROPS = [
  { icon: ShieldCheck, t: "Qualité Garantie", s: "Jusqu'à 48 mois de garantie" },
  { icon: Truck, t: "Livraison Rapide", s: "Toute l'Algérie" },
  { icon: Headphones, t: "Service Client", s: "Réactif et à l'écoute" },
];

const BENTO = [
  { slug: "refrigerateur", label: "Gros Électro", span: "" },
  { slug: "machine-a-laver", label: "Machine à laver", span: "" },
  { slug: "machine-a-cafe", label: "Petit Électroménager", span: "md:col-span-2" },
  { slug: "tv", label: "Télévision & Audio", span: "md:col-span-2" },
];

export default function Home() {
  const products = useProducts();
  const offers = useOffers();
  const categories = useCategories();

  const promos = products.filter((p) => p.isActive && priceProduct(p, offers).discountPct > 0);
  const featured = products.filter((p) => p.isActive).slice(0, 8);
  const grid = (promos.length ? promos : featured).slice(0, 8);
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;
  const catImg = (slug: string) => products.find((p) => p.categorySlug === slug)?.imageUrl;

  return (
    <div className="max-w-[1440px] mx-auto px-5 md:px-10 pt-8 pb-20">
      {/* HERO */}
      <section className="mb-16">
        <div className="relative rounded-xl overflow-hidden h-[400px] md:h-[460px] flex items-center border border-edge">
          <img
            src="https://images.unsplash.com/photo-1616137466211-f939a420be84?auto=format&fit=crop&w=1400&q=70"
            alt=""
            className="absolute inset-0 w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-navy via-navy/85 to-transparent z-10" />
          <div className="relative z-20 px-8 md:px-16 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-gold/15 text-gold font-mono text-xs rounded border border-gold/30 mb-4">
              NOUVEAU
            </span>
            <h1 className="font-head font-extrabold text-4xl md:text-6xl leading-tight mb-5">
              L'Excellence <br />
              <span className="text-gold">Électroménager</span>
            </h1>
            <p className="text-cloud-muted text-lg mb-8 max-w-lg">
              Découvrez notre gamme premium avec garantie jusqu'à 48 mois et livraison express sur
              tout le territoire national.
            </p>
            <Link
              to="/c/machine-a-cafe"
              className="inline-flex items-center gap-2 bg-gold text-navy px-8 py-4 font-mono text-sm font-bold rounded hover:bg-gold-bright transition-colors"
            >
              DÉCOUVRIR LES OFFRES <ArrowRight size={18} />
            </Link>
          </div>
        </div>

        {/* Value props */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
          {VALUE_PROPS.map((v) => (
            <div key={v.t} className="bg-navy-card border border-edge rounded-lg p-6 flex items-center gap-4 glow-hover transition-all">
              <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold shrink-0">
                <v.icon size={24} />
              </div>
              <div>
                <h3 className="font-mono text-sm text-cloud mb-1">{v.t}</h3>
                <p className="font-mono text-xs text-cloud-muted">{v.s}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES BENTO */}
      <section className="mb-20">
        <div className="flex items-end justify-between mb-8 border-b border-edge pb-4">
          <h2 className="font-head font-bold text-2xl md:text-4xl">
            Découvrez nos <span className="text-gold">Catégories</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENTO.map((b) => (
            <Link
              key={b.slug}
              to={`/c/${b.slug}`}
              className={`group relative bg-navy-card border border-edge rounded-xl overflow-hidden h-60 glow-hover transition-all ${b.span}`}
            >
              <div className="absolute inset-0 p-6 flex flex-col justify-between z-20">
                <h3 className="font-head font-semibold text-xl text-cloud group-hover:text-gold transition-colors">
                  {catName(b.slug)}
                </h3>
                <div className="w-9 h-9 rounded-full border border-edge flex items-center justify-center text-cloud-muted group-hover:border-gold group-hover:text-gold transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
              {catImg(b.slug) && (
                <img
                  src={catImg(b.slug)}
                  alt=""
                  className="absolute -bottom-6 -right-6 w-44 h-44 object-cover rounded-xl opacity-70 group-hover:scale-105 transition-transform duration-500"
                />
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* PROMOTIONS */}
      <section>
        <div className="flex items-end justify-between mb-8 border-b border-edge pb-4">
          <h2 className="font-head font-bold text-2xl md:text-4xl">
            Découvrez nos <span className="text-gold">Promotions</span>
          </h2>
          <Link to="/c/machine-a-cafe" className="hidden md:flex font-mono text-sm text-gold hover:text-gold-bright items-center gap-2 transition-colors">
            VOIR TOUT <ArrowRight size={15} />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {grid.map((p) => (
            <ProductCard key={p.id} product={p} offers={offers} />
          ))}
        </div>
      </section>
    </div>
  );
}
