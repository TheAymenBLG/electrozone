import { useProducts, useOffers } from "../../data/store";
import { demoOrders } from "../../lib/analytics";
import { formatDA } from "../../lib/format";

const STATUS_TONE: Record<string, string> = {
  "Livré": "bg-green-500/15 text-green-300",
  "En cours": "bg-blue-500/15 text-blue-300",
  "Confirmé": "bg-gold/15 text-gold",
  "Nouveau": "bg-white/10 text-cloud-muted",
};

export default function Orders() {
  const products = useProducts();
  const offers = useOffers();
  const orders = demoOrders(products, offers, 14);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="font-head text-3xl font-bold text-cloud">Commandes</h1>
        <span className="text-sm text-cloud-muted">{orders.length} commandes récentes</span>
      </div>

      <div className="bg-navy-card border border-edge rounded-2xl overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-navy-tile text-left text-cloud-muted font-mono text-xs uppercase">
            <tr>
              <th className="p-4">N°</th><th className="p-4">Client</th><th className="p-4">Wilaya</th>
              <th className="p-4">Produit</th><th className="p-4">Qté</th><th className="p-4">Total</th>
              <th className="p-4">Date</th><th className="p-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-edge">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-white/5">
                <td className="p-4 font-mono text-cloud-muted">{o.id}</td>
                <td className="p-4 font-medium text-cloud">{o.customer}</td>
                <td className="p-4 text-cloud-muted">{o.wilaya}</td>
                <td className="p-4 text-cloud-muted max-w-[220px] truncate">{o.product}</td>
                <td className="p-4 text-cloud">{o.qty}</td>
                <td className="p-4 font-mono text-gold">{formatDA(o.total)}</td>
                <td className="p-4 text-cloud-muted">{o.date}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_TONE[o.status]}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
