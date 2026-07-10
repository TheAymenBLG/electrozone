import { useProducts, useOffers } from "../../data/store";
import { demoCustomers } from "../../lib/analytics";
import { formatDA } from "../../lib/format";

export default function Customers() {
  const products = useProducts();
  const offers = useOffers();
  const customers = demoCustomers(products, offers);

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
        <span className="text-sm text-gray-500">{customers.length} clients</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((c) => (
          <div key={c.name} className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-11 h-11 rounded-full bg-mint/20 text-mint-dark flex items-center justify-center font-bold">
                {c.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-gray-800 truncate">{c.name}</p>
                <p className="text-xs text-gray-400 truncate">{c.email}</p>
              </div>
            </div>
            <div className="flex justify-between text-sm border-t pt-3">
              <div>
                <p className="text-gray-400 text-xs">Commandes</p>
                <p className="font-semibold text-gray-800">{c.orders}</p>
              </div>
              <div className="text-right">
                <p className="text-gray-400 text-xs">Total dépensé</p>
                <p className="font-semibold text-mint-dark">{formatDA(c.spent)}</p>
              </div>
            </div>
            <p className="text-xs text-gray-400 mt-3">{c.wilaya}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
