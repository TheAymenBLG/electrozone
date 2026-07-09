import { Link } from "react-router-dom";
import { Zap, Play, ShieldCheck, Truck, Headphones, ArrowRight } from "lucide-react";
import { useProducts, useOffers, useCategories } from "../../data/store";
import ProductCard from "../../components/ProductCard";
import { priceProduct } from "../../lib/offers";
import { BRANDS, BANNER_FOURS } from "../../data/brand";

const VALUE_PROPS = [
  { icon: ShieldCheck, t: "Produit de qualité", s: "Garantis jusqu'à 48 mois" },
  { icon: Truck, t: "Livraison rapide", s: "Toute l'Algérie" },
  { icon: Headphones, t: "Service client", s: "Réactif et à l'écoute" },
];

const BENTO = [
  { slug: "refrigerateur", span: "" },
  { slug: "machine-a-cafe", span: "" },
  { slug: "tv", span: "md:col-span-2" },
  { slug: "aspirateur", span: "md:col-span-2" },
  { slug: "cuisiniere", span: "" },
  { slug: "machine-a-laver", span: "" },
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
    <div>
      {/* HERO V2 */}
      <section className="relative overflow-hidden">
        <div className="max-w-[1440px] mx-auto px-5 md:px-10 grid md:grid-cols-2 gap-8 items-center py-14 md:py-20">
          <div>
            <span className="inline-flex items-center gap-2 bg-gold/15 text-gold border border-gold/30 font-mono text-xs rounded-full px-4 py-1.5 mb-6">
              <Zap size={14} /> NOUVELLE COLLECTION 2024
            </span>
            <h1 className="font-head font-extrabold text-5xl md:text-6xl leading-[1.05]">
              L'Ingénierie du <br />
              <span className="text-gold">Confort Moderne</span>
            </h1>
            <p className="mt-6 text-cloud-muted text-lg max-w-md">
              Découvrez une sélection exclusive d'appareils haut de gamme alliant performance
              technologique et design minimaliste pour votre foyer.
            </p>
            <div className="mt-8 flex items-center gap-5 flex-wrap">
              <Link to="/c/refrigerateur" className="bg-gold text-navy font-bold px-7 py-3.5 rounded font-mono text-sm hover:bg-gold-bright transition-colors">
                Explorer la Collection
              </Link>
              <button className="flex items-center gap-3 text-cloud hover:text-gold transition-colors">
                <span className="w-11 h-11 rounded-full border border-edge flex items-center justify-center">
                  <Play size={16} className="ml-0.5" />
                </span>
                <span className="text-sm">Voir la vidéo</span>
              </button>
            </div>
          </div>
          <div className="relative flex items-center justify-center min-h-[340px]">
            <div className="absolute w-80 h-80 bg-gold/10 blur-3xl rounded-full" />
            <img src="/img/fridge.png" alt="Réfrigérateur premium" className="relative h-[380px] object-contain drop-shadow-2xl" />
          </div>
        </div>
      </section>

      {/* VALUE PROPS */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 -mt-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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

      {/* CATEGORIES */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 mt-20">
        <div className="flex items-end justify-between mb-8 border-b border-edge pb-4">
          <h2 className="font-head font-bold text-2xl md:text-4xl">
            Découvrez nos <span className="text-gold">Catégories</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {BENTO.map((b) => (
            <Link key={b.slug} to={`/c/${b.slug}`} className={`group relative bg-navy-card border border-edge rounded-xl overflow-hidden h-60 hover:border-gold transition-all ${b.span}`}>
              {catImg(b.slug) && (
                <img src={catImg(b.slug)} alt="" className="absolute inset-0 w-full h-full object-contain p-6 opacity-90 group-hover:scale-105 transition-transform duration-500" />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-transparent to-navy/40" />
              <div className="relative z-10 h-full p-6 flex flex-col justify-between">
                <h3 className="font-head font-bold text-xl text-cloud group-hover:text-gold transition-colors drop-shadow">{catName(b.slug)}</h3>
                <div className="inline-flex w-10 h-10 rounded-full bg-gold/10 border border-gold/30 items-center justify-center text-gold group-hover:bg-gold group-hover:text-navy transition-all">
                  <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* PROMOTIONS */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 mt-20">
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

      {/* PROMO BANNER */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 mt-20">
        <Link to="/c/cuisiniere" className="block rounded-xl overflow-hidden border border-edge hover:border-gold transition-all">
          <img src={BANNER_FOURS} alt="Équipez votre cuisine avec nos meilleurs fours" className="w-full object-cover" />
        </Link>
      </section>

      {/* BRANDS */}
      <section className="max-w-[1440px] mx-auto px-5 md:px-10 mt-20">
        <h2 className="font-head font-bold text-2xl md:text-4xl mb-2">
          Nos <span className="text-gold">marques</span> populaires
        </h2>
        <div className="w-24 h-1 bg-gold mb-8" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {BRANDS.slice(0, 6).map((b) => (
            <div key={b} className="bg-navy-card border border-edge rounded-lg h-24 flex items-center justify-center text-center px-3 glow-hover transition-all">
              <span className="font-head font-bold text-cloud/70 hover:text-gold transition-colors">{b}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
