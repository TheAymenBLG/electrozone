import { NavLink, Outlet, Link } from "react-router-dom";
import { LayoutDashboard, Package, Boxes, Tag, Store, RotateCcw } from "lucide-react";
import { resetStore } from "../../data/store";
import { LOGO_URL } from "../../data/brand";

const links = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/products", label: "Produits", icon: Package, end: false },
  { to: "/admin/bundles", label: "Packs", icon: Boxes, end: false },
  { to: "/admin/offers", label: "Offres & Promos", icon: Tag, end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-gray-100">
      <aside className="w-60 bg-ink text-white flex flex-col p-4 shrink-0">
        <Link to="/" className="mb-6">
          <img src={LOGO_URL} alt="ElectroZone" className="h-10 w-auto bg-white/90 rounded p-1" />
        </Link>
        <nav className="flex flex-col gap-1 flex-1">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3 py-2 rounded text-sm ${
                  isActive ? "bg-brand font-semibold" : "text-white/80 hover:bg-white/10"
                }`
              }
            >
              <l.icon size={18} /> {l.label}
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => confirm("Réinitialiser les données de démo ?") && resetStore()}
          className="flex items-center gap-2 text-xs text-white/60 hover:text-white mt-4"
        >
          <RotateCcw size={14} /> Réinitialiser la démo
        </button>
        <Link to="/" className="flex items-center gap-2 text-sm text-white/80 hover:text-white mt-2">
          <Store size={16} /> Voir la boutique
        </Link>
      </aside>
      <main className="flex-1 p-6 overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
