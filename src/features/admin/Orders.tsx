import { useProducts, useOffers } from "../../data/store";
import { demoOrders } from "../../lib/analytics";
import { formatDA } from "../../lib/format";

const STATUS_TONE: Record<string, string> = {
  "Livré": "bg-green-100 text-green-700",
  "En cours": "bg-blue-100 text-blue-700",
  "Confirmé": "bg-amber-100 text-amber-700",
  "Nouveau": "bg-gray-100 text-gray-600",
};

export default function Orders() {
  const products = useProducts();
  const offers = useOffers();
  const orders = demoOrders(products, offers, 14);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Commandes</h1>
        <span className="text-sm text-gray-500">{orders.length} commandes récentes</span>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-4">N°</th>
              <th className="p-4">Client</th>
              <th className="p-4">Wilaya</th>
              <th className="p-4">Produit</th>
              <th className="p-4">Qté</th>
              <th className="p-4">Total</th>
              <th className="p-4">Date</th>
              <th className="p-4">Statut</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {orders.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50">
                <td className="p-4 font-mono text-gray-500">{o.id}</td>
                <td className="p-4 font-medium text-gray-800">{o.customer}</td>
                <td className="p-4 text-gray-600">{o.wilaya}</td>
                <td className="p-4 text-gray-600 max-w-[220px] truncate">{o.product}</td>
                <td className="p-4">{o.qty}</td>
                <td className="p-4 font-semibold text-gray-800">{formatDA(o.total)}</td>
                <td className="p-4 text-gray-500">{o.date}</td>
                <td className="p-4"><span className={`text-xs px-2 py-1 rounded-full ${STATUS_TONE[o.status]}`}>{o.status}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
