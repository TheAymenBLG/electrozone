import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { Search, Heart, User, ShoppingCart } from "lucide-react";
import { useCart } from "../context/CartContext";
import { useCategories, useProducts } from "../data/store";
import { LOGO_URL } from "../data/brand";

export default function Navbar() {
  const { count } = useCart();
  const categories = useCategories();
  const products = useProducts();
  const [q, setQ] = useState("");
  const navigate = useNavigate();

  function search() {
    const term = q.trim().toLowerCase();
    if (!term) return;
    const hit = products.find((p) => p.name.toLowerCase().includes(term));
    if (hit) navigate(`/p/${hit.id}`);
  }

  return (
    <header className="sticky top-0 z-50 bg-navy/80 backdrop-blur-xl border-b border-edge">
      <div className="max-w-[1440px] mx-auto px-5 md:px-10">
        <div className="flex items-center gap-6 h-20">
          <Link to="/" className="shrink-0">
            <img src={LOGO_URL} alt="ElectroZone" className="h-9 object-contain" />
          </Link>

          <nav className="hidden md:flex gap-6 text-sm">
            <Link to="/" className="text-gold border-b-2 border-gold pb-1 font-medium">Accueil</Link>
            {categories.slice(0, 4).map((c) => (
              <Link key={c.id} to={`/c/${c.slug}`} className="text-cloud/80 hover:text-gold transition-colors">
                {c.name}
              </Link>
            ))}
          </nav>

          <div className="flex-1 max-w-xl mx-2 hidden lg:block">
            <div className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && search()}
                placeholder="Rechercher par nom de produit..."
                className="w-full bg-navy-tile border border-edge rounded py-2 pl-4 pr-12 text-cloud placeholder-cloud/40 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition"
              />
              <button onClick={search} className="absolute right-0 top-0 h-full px-4 bg-gold text-navy rounded-r hover:bg-gold-bright transition-colors">
                <Search size={18} />
              </button>
            </div>
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <button className="p-2 rounded-full text-cloud/80 hover:text-gold hover:bg-white/5 transition"><Heart size={20} /></button>
            <Link to="/admin" className="p-2 rounded-full text-cloud/80 hover:text-gold hover:bg-white/5 transition"><User size={20} /></Link>
            <Link to="/cart" className="flex items-center gap-2 px-4 py-2 rounded-full bg-navy-tile border border-edge text-gold hover:border-gold transition">
              <ShoppingCart size={18} />
              <span className="font-mono text-sm">{count}</span>
            </Link>
          </div>
        </div>

        <nav className="md:hidden flex gap-4 overflow-x-auto pb-2 text-xs text-cloud/70">
          {categories.map((c) => (
            <Link key={c.id} to={`/c/${c.slug}`} className="whitespace-nowrap hover:text-gold">{c.name}</Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
