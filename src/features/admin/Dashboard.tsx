import { Package, Boxes, Tag, Wallet, AlertTriangle } from "lucide-react";
import { useProducts, useBundles, useOffers } from "../../data/store";
import { priceProduct } from "../../lib/offers";
import { formatDA } from "../../lib/format";

function Kpi({
  label, value, hint, icon: Icon, color,
}: { label: string; value: string; hint?: string; icon: typeof Package; color: string }) {
  return (
    <div className="bg-white rounded-2xl border p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-2xl font-extrabold text-ink mt-1">{value}</p>
          {hint && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
        </div>
        <div className={`rounded-xl p-2.5 ${color}`}>
          <Icon size={22} />
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const products = useProducts();
  const bundles = useBundles();
  const offers = useOffers();

  const activeProducts = products.filter((p) => p.isActive);
  const stockValue = activeProducts.reduce((s, p) => s + p.price * p.stock, 0);
  const onPromo = activeProducts.filter((p) => priceProduct(p, offers).discountPct > 0).length;
  const lowStock = activeProducts.filter((p) => p.stock <= 4);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-1">Tableau de bord</h1>
      <p className="text-gray-500 mb-6">Vue d'ensemble de votre boutique</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Kpi label="Produits actifs" value={String(activeProducts.length)} icon={Package} color="bg-brand/10 text-brand" />
        <Kpi label="Packs" value={String(bundles.filter((b) => b.isActive).length)} icon={Boxes} color="bg-blue-100 text-blue-600" />
        <Kpi label="Offres actives" value={String(offers.filter((o) => o.isActive).length)} hint={`${onPromo} produits en promo`} icon={Tag} color="bg-green-100 text-green-600" />
        <Kpi label="Valeur du stock" value={formatDA(stockValue)} icon={Wallet} color="bg-amber-100 text-amber-600" />
      </div>

      <div className="mt-6 bg-white rounded-2xl border p-5">
        <h2 className="font-semibold mb-3 flex items-center gap-2">
          <AlertTriangle size={18} className="text-amber-500" /> Stock faible (≤ 4)
        </h2>
        {lowStock.length === 0 ? (
          <p className="text-sm text-gray-500">Tout est bien approvisionné.</p>
        ) : (
          <ul className="text-sm divide-y">
            {lowStock.map((p) => (
              <li key={p.id} className="flex justify-between py-2.5">
                <span>{p.name}</span>
                <span className="text-red-500 font-semibold">{p.stock} restants</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
