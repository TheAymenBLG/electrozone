import { useState } from "react";
import { Search, DollarSign, ShoppingCart, Wallet, TrendingUp } from "lucide-react";
import { useProducts, useOffers } from "../../data/store";
import { dashboardStats, salesSeries, topSelling } from "../../lib/analytics";
import AreaChart from "../../components/AreaChart";
import { formatDA } from "../../lib/format";

function StatCard({ title, value, icon: Icon, tint, change }: { title: string; value: string; icon: typeof DollarSign; tint: string; change: string }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 flex justify-between items-end">
      <div>
        <p className="text-gray-500 text-sm">{title}</p>
        <p className="text-xs text-gray-400 mb-3">Last 30 days</p>
        <h2 className="text-3xl font-extrabold text-gray-800">{value}</h2>
      </div>
      <div className="flex flex-col items-end gap-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${tint}`}><Icon size={18} /></div>
        <span className="text-green-500 text-sm font-semibold flex items-center gap-1"><TrendingUp size={14} /> {change}</span>
      </div>
    </div>
  );
}

function Metric({ label, value, badge, tone }: { label: string; value: string; badge: string; tone: string }) {
  return (
    <div>
      <p className="text-gray-400 text-sm mb-1">{label}</p>
      <p className="text-xl font-bold flex items-center gap-2 text-gray-800"><span>{value}</span>
        <span className={`text-xs px-2 py-0.5 rounded ${tone}`}>{badge}</span></p>
    </div>
  );
}

const PERIODS: Record<string, number> = { "7 derniers jours": 7, "14 derniers jours": 14, "30 derniers jours": 30 };

export default function Dashboard() {
  const products = useProducts();
  const offers = useOffers();
  const [period, setPeriod] = useState("7 derniers jours");

  const stats = dashboardStats(products, offers);
  const series = salesSeries(products, offers, PERIODS[period]);
  const top = topSelling(products, 4);

  return (
    <div className="max-w-6xl">
      <header className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Overview</h1>
        <div className="relative w-full sm:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-mint" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <StatCard title="Total Revenue" value={formatDA(stats.revenue)} icon={DollarSign} tint="bg-mint/20 text-mint-dark" change="11%" />
        <StatCard title="Total Order" value={String(stats.orders)} icon={ShoppingCart} tint="bg-blue-100 text-blue-500" change="11%" />
        <StatCard title="Balance" value={formatDA(stats.balance)} icon={Wallet} tint="bg-amber-100 text-amber-500" change="8%" />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mb-8">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold text-gray-800">Sales Analytic</h3>
          <select value={period} onChange={(e) => setPeriod(e.target.value)} className="border border-gray-200 rounded-md px-3 py-1 text-sm bg-white outline-none text-gray-600">
            {Object.keys(PERIODS).map((k) => <option key={k}>{k}</option>)}
          </select>
        </div>
        <div className="flex flex-wrap gap-8 mb-6">
          <Metric label="Income" value={formatDA(stats.income)} badge="+0.05% ▲" tone="bg-blue-100 text-blue-600" />
          <Metric label="Expenses" value={formatDA(stats.expenses)} badge="-0.05% ▼" tone="bg-orange-100 text-orange-600" />
          <Metric label="Balance" value={formatDA(stats.balance)} badge="+0.05% ▲" tone="bg-green-100 text-green-600" />
        </div>
        <AreaChart labels={series.labels} data={series.data} />
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6">Top Selling Products</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {top.map(({ p, units }) => (
            <div key={p.id} className="flex flex-col">
              <div className="bg-gray-100 rounded-xl h-44 mb-3 flex items-center justify-center overflow-hidden p-4">
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-contain" />
              </div>
              <h4 className="font-bold text-gray-800 text-sm line-clamp-1">{p.name}</h4>
              <p className="text-gray-400 text-sm">{units} Pcs</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
