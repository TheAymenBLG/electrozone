import { NavLink, Outlet, Link } from "react-router-dom";
import {
  LayoutDashboard, PieChart, Package, BadgePercent, Boxes,
  Archive, ShoppingBag, BarChart3, Users, Mail, Settings, Store, RotateCcw, ChevronRight,
} from "lucide-react";
import { resetStore } from "../../data/store";

const ROUTES = [
  { to: "/admin", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/admin/analytics", label: "Analytics", icon: PieChart, end: false },
  { to: "/admin/products", label: "Produits", icon: Package, end: false },
  { to: "/admin/offers", label: "Offres", icon: BadgePercent, end: false },
  { to: "/admin/bundles", label: "Packs", icon: Boxes, end: false },
  { to: "/admin/orders", label: "Orders", icon: ShoppingBag, end: false },
  { to: "/admin/customers", label: "Customer", icon: Users, end: false },
];
const EXTRA = [
  { label: "Inventory", icon: Archive },
  { label: "Sales", icon: BarChart3 },
  { label: "Newsletter", icon: Mail },
  { label: "Settings", icon: Settings },
];

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex bg-mint-bg text-gray-800 font-sans">
      <aside className="w-64 bg-white border-r border-gray-100 flex flex-col shrink-0">
        <Link to="/admin" className="p-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-mint flex items-center justify-center text-white font-extrabold">E</div>
          <span className="font-bold text-lg leading-tight">Electro<br />Zone</span>
        </Link>
        <nav className="flex-1 px-4 space-y-1 overflow-y-auto pb-6">
          {ROUTES.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end}
              className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-lg text-sm transition-colors ${isActive ? "bg-mint text-gray-900 font-semibold shadow-sm" : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"}`}>
              {({ isActive }) => (<><l.icon size={18} /> <span>{l.label}</span>{isActive && <ChevronRight size={16} className="ml-auto" />}</>)}
            </NavLink>
          ))}
          {EXTRA.map((l) => (
            <div key={l.label} className="flex items-center gap-3 px-4 py-3 rounded-lg text-sm text-gray-400 hover:bg-gray-50 cursor-default">
              <l.icon size={18} /> <span>{l.label}</span>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-gray-100 space-y-1">
          <button onClick={() => confirm("Réinitialiser les données de démo ?") && resetStore()} className="w-full flex items-center gap-2 px-4 py-2 text-xs text-gray-400 hover:text-gray-700">
            <RotateCcw size={14} /> Réinitialiser la démo
          </button>
          <Link to="/" className="flex items-center gap-2 px-4 py-2 text-sm text-gray-500 hover:text-gray-900">
            <Store size={16} /> Voir la boutique
          </Link>
        </div>
      </aside>
      <main className="flex-1 overflow-y-auto p-8"><Outlet /></main>
    </div>
  );
}
