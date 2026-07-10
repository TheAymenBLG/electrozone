import { useState } from "react";
import { Search, Bell, Wallet, ShoppingCart, BadgePercent, TrendingUp, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useProducts, useOffers } from "../../data/store";
import { dashboardStats, salesSeries, topSelling } from "../../lib/analytics";
import AreaChart from "../../components/AreaChart";
import { formatDA } from "../../lib/format";

function StatCard({ title, value, icon: Icon, hint, change }: { title: string; value: string; icon: typeof Wallet; hint: string; change: string }) {
  return (
    <div className="bg-navy-card border border-edge rounded-2xl p-6 glow-hover transition-all">
      <div className="flex items-start justify-between">
        <p className="font-mono text-xs text-cloud-muted uppercase tracking-wider">{title}</p>
        <div className="w-9 h-9 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center text-gold"><Icon size={16} /></div>
      </div>
      <div className="mt-4 flex items-end justify-between">
        <h2 className="text-2xl font-extrabold text-cloud">{value}</h2>
        <span className="text-green-400 text-xs font-semibold flex items-center gap-1"><TrendingUp size={13} /> {change}</span>
      </div>
      <p className="text-[11px] text-cloud-muted mt-1">{hint}</p>
    </div>
  );
}

function Metric({ label, value, badge, tone }: { label: string; value: string; badge: string; tone: string }) {
  return (
    <div>
      <p className="text-cloud-muted text-sm mb-1">{label}</p>
      <p className="text-xl font-bold flex items-center gap-2 text-cloud"><span className="font-mono">{value}</span>
        <span className={`text-[11px] px-2 py-0.5 rounded ${tone}`}>{badge}</span></p>
    </div>
  );
}

const PERIODS: Record<string, number> = { "Juillet 2024": 8, "14 derniers jours": 14, "30 derniers jours": 30 };

export default function Dashboard() {
  const products = useProducts();
  const offers = useOffers();
  const [period, setPeriod] = useState("Juillet 2024");

  const stats = dashboardStats(products, offers);
  const activeOffers = offers.filter((o) => o.isActive).length;
  const series = salesSeries(products, offers, PERIODS[period]);
  const top = topSelling(products, 4);

  return (
    <div className="max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <div>
          <h1 className="font-head text-3xl font-bold text-cloud">Aperçu</h1>
          <p className="text-cloud-muted text-sm mt-1">Performances de la boutique en temps réel</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative w-full sm:w-72">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-cloud-muted" />
            <input placeholder="Rechercher..." className="w-full pl-10 pr-4 py-2 rounded-lg bg-navy-tile border border-edge text-cloud placeholder-cloud/40 focus:outline-none focus:border-gold" />
          </div>
          <button className="w-10 h-10 rounded-lg bg-navy-tile border border-edge flex items-center justify-center text-cloud-muted hover:text-gold"><Bell size={18} /></button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <StatCard title="Revenu Total" value={formatDA(stats.revenue)} icon={Wallet} hint="Derniers 30 jours" change="12%" />
        <StatCard title="Commandes Totales" value={String(stats.orders)} icon={ShoppingCart} hint="Derniers 30 jours" change="9%" />
        <StatCard title="Offres Actives" value={String(activeOffers)} icon={BadgePercent} hint="Compteur en cours" change="—" />
      </div>

      <div className="bg-navy-card border border-edge rounded-2xl p-6 mb-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="font-head text-xl font-bold text-cloud">Analyse des Ventes</h3>
            <p className="text-cloud-muted text-sm">Croissance mensuelle du chiffre d'affaires</p>
          </div>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="bg-navy-tile border border-edge rounded-md px-3 py-1.5 text-sm text-cloud outline-none">
            {Object.keys(PERIODS).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <AreaChart labels={series.labels} data={series.data} />
        <div className="flex flex-wrap gap-8 mt-6 border-t border-edge pt-6">
          <Metric label="Revenu" value={formatDA(stats.income)} badge="+4.2%" tone="bg-blue-500/15 text-blue-300" />
          <Metric label="Dépenses" value={formatDA(stats.expenses)} badge="+2.1%" tone="bg-orange-500/15 text-orange-300" />
          <Metric label="Bénéfice" value={formatDA(stats.balance)} badge="+6.3%" tone="bg-green-500/15 text-green-300" />
        </div>
      </div>

      <div className="bg-navy-card border border-edge rounded-2xl p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-head text-xl font-bold text-cloud">Produits les plus vendus</h3>
          <Link to="/admin/products" className="font-mono text-sm text-gold hover:text-gold-bright flex items-center gap-1">Voir tout <ArrowRight size={14} /></Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {top.map(({ p, units }) => (
            <div key={p.id} className="bg-navy-tile border border-edge rounded-xl p-4 flex flex-col hover:border-gold transition-colors">
              <div className="h-36 mb-3 flex items-center justify-center overflow-hidden">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
              </div>
              <h4 className="font-semibold text-cloud text-sm line-clamp-1">{p.name}</h4>
              <div className="flex items-center justify-between mt-1">
                <p className="text-cloud-muted text-xs">{units} Ventes</p>
                <p className="font-mono text-gold text-sm">{formatDA(p.price)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
