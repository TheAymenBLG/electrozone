import { useProducts, useOffers, useCategories } from "../../data/store";
import { dashboardStats, salesSeries, categoryBreakdown, topSelling } from "../../lib/analytics";
import AreaChart from "../../components/AreaChart";
import { formatDA } from "../../lib/format";

export default function Analytics() {
  const products = useProducts();
  const offers = useOffers();
  const categories = useCategories();

  const stats = dashboardStats(products, offers);
  const series = salesSeries(products, offers, 14);
  const byCat = categoryBreakdown(products, offers);
  const top = topSelling(products, 6);
  const maxCat = Math.max(...byCat.map((c) => c.revenue), 1);
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug;

  return (
    <div className="max-w-6xl">
      <h1 className="font-head text-3xl font-bold text-cloud mb-8">Analytiques</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { t: "Chiffre d'affaires", v: formatDA(stats.revenue) },
          { t: "Commandes", v: String(stats.orders) },
          { t: "Panier moyen", v: formatDA(Math.round(stats.revenue / Math.max(1, stats.orders))) },
          { t: "Bénéfice", v: formatDA(stats.balance) },
        ].map((k) => (
          <div key={k.t} className="bg-navy-card border border-edge rounded-2xl p-5">
            <p className="font-mono text-xs text-cloud-muted uppercase tracking-wider">{k.t}</p>
            <p className="text-2xl font-extrabold text-cloud mt-2">{k.v}</p>
          </div>
        ))}
      </div>

      <div className="bg-navy-card border border-edge rounded-2xl p-6 mb-8">
        <h3 className="font-head text-xl font-bold text-cloud mb-6">Tendance des ventes (14 jours)</h3>
        <AreaChart labels={series.labels} data={series.data} />
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-navy-card border border-edge rounded-2xl p-6">
          <h3 className="font-head text-xl font-bold text-cloud mb-6">Revenu par catégorie</h3>
          <div className="space-y-4">
            {byCat.map((c) => (
              <div key={c.slug}>
                <div className="flex justify-between text-sm mb-1">
                  <span className="text-cloud">{catName(c.slug)}</span>
                  <span className="font-mono font-semibold text-gold">{formatDA(c.revenue)}</span>
                </div>
                <div className="h-2 bg-navy-tile rounded-full overflow-hidden">
                  <div className="h-full bg-gold rounded-full" style={{ width: `${(c.revenue / maxCat) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-navy-card border border-edge rounded-2xl p-6">
          <h3 className="font-head text-xl font-bold text-cloud mb-6">Meilleures ventes</h3>
          <ul className="divide-y divide-edge">
            {top.map(({ p, units }, i) => (
              <li key={p.id} className="flex items-center gap-3 py-3">
                <span className="w-6 text-cloud-muted font-mono text-sm">{i + 1}</span>
                <img src={p.imageUrl} alt="" className="w-10 h-10 object-contain rounded bg-navy-tile p-1" />
                <span className="flex-1 text-sm text-cloud line-clamp-1">{p.name}</span>
                <span className="text-sm font-mono text-gold">{units} pcs</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
