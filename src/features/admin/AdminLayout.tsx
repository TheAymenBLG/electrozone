import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, PieChart, Package, BadgePercent, Boxes,
  ShoppingBag, Users, Settings, Store, RotateCcw,
} from "lucide-react";
import { resetStore } from "../../data/store";

const ROUTES = [
  { to: "/admin", label: "Tableau de bord", icon: LayoutDashboard, end: true },
  { to: "/admin/analytics", label: "Analytiques", icon: PieChart, end: false },
  { to: "/admin/products", label: "Produits", icon: Package, end: false },
  { to: "/admin/bundles", label: "Packs", icon: Boxes, end: false },
  { to: "/admin/offers", label: "Offres & Promos", icon: BadgePercent, end: false },
  { to: "/admin/orders", label: "Commandes", icon: ShoppingBag, end: false },
  { to: "/admin/customers", label: "Clients", icon: Users, end: false },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-navy text-cloud font-sans">
      <aside className="w-64 bg-navy-deep border-r border-edge flex flex-col shrink-0">
        <Link to="/admin" className="px-6 py-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-navy font-extrabold">E</div>
          <div>
            <p className="font-head font-bold leading-none text-cloud">Electrozone</p>
            <p className="font-mono text-[10px] text-cloud-muted tracking-widest mt-1">ADMIN PANEL</p>
          </div>
        </Link>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          {ROUTES.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive ? "bg-gold text-navy font-semibold" : "text-cloud-muted hover:bg-white/5 hover:text-cloud"}`}>
              <l.icon size={18} /> <span>{l.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="p-4 border-t border-edge">
          <div className="bg-navy-card border border-edge rounded-xl p-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-gold text-navy flex items-center justify-center font-bold text-sm">AD</div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-cloud truncate">Admin DZ</p>
              <p className="text-[11px] text-cloud-muted truncate">Chef de projet</p>
            </div>
          </div>
          <div className="mt-2 flex items-center justify-between">
            <button onClick={() => confirm("Réinitialiser les données de démo ?") && resetStore()} className="flex items-center gap-1.5 px-2 py-2 text-xs text-cloud-muted hover:text-gold">
              <RotateCcw size={13} /> Réinitialiser
            </button>
            <Link to="/" className="flex items-center gap-1.5 px-2 py-2 text-xs text-cloud-muted hover:text-gold">
              <Store size={13} /> Boutique
            </Link>
            <button className="flex items-center gap-1.5 px-2 py-2 text-xs text-cloud-muted hover:text-gold cursor-default">
              <Settings size={13} /> Paramètres
            </button>
          </div>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8"><Outlet /></main>
    </div>
  );
}
