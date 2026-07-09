import { useCart } from "../../context/CartContext";
import { useProducts, useBundles, useOffers } from "../../data/store";
import { priceProduct, bundleFinalPrice } from "../../lib/offers";
import { formatDA } from "../../lib/format";
import { Trash2, CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Cart() {
  const { lines, remove, clear } = useCart();
  const products = useProducts();
  const bundles = useBundles();
  const offers = useOffers();
  const [placed, setPlaced] = useState(false);

  const rows = lines.map((l) => {
    if (l.kind === "product") {
      const p = products.find((x) => x.id === l.id)!;
      return { id: l.id, name: p?.name ?? "?", unit: priceProduct(p, offers).finalPrice, qty: l.quantity };
    }
    const b = bundles.find((x) => x.id === l.id)!;
    return { id: l.id, name: b?.name ?? "?", unit: bundleFinalPrice(b, products), qty: l.quantity };
  });

  const total = rows.reduce((s, r) => s + r.unit * r.qty, 0);

  if (placed)
    return (
      <div className="max-w-3xl mx-auto px-5 md:px-10 py-24 text-center">
        <CheckCircle className="mx-auto text-gold" size={56} />
        <h1 className="font-head font-bold text-2xl text-gold mt-4">Commande enregistrée</h1>
        <p className="mt-2 text-cloud-muted">Nous vous appellerons pour confirmer la livraison (paiement à la livraison).</p>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto px-5 md:px-10 py-10">
      <h1 className="font-head font-bold text-3xl mb-6">Mon Panier</h1>
      {rows.length === 0 ? (
        <div className="bg-navy-card border border-edge rounded-xl p-16 text-center text-cloud-muted">Votre panier est vide.</div>
      ) : (
        <>
          <div className="bg-navy-card border border-edge rounded-xl divide-y divide-edge">
            {rows.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4">
                <div>
                  <p className="text-cloud font-medium">{r.name}</p>
                  <p className="font-mono text-xs text-cloud-muted">{formatDA(r.unit)} x {r.qty}</p>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-gold">{formatDA(r.unit * r.qty)}</span>
                  <button onClick={() => remove(r.id)} className="text-red-400 hover:text-red-300"><Trash2 size={18} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between mt-5">
            <button onClick={clear} className="font-mono text-xs text-cloud-muted underline">VIDER LE PANIER</button>
            <div className="text-right">
              <p className="font-mono text-xs text-cloud-muted">TOTAL</p>
              <p className="font-mono text-2xl text-gold">{formatDA(total)}</p>
            </div>
          </div>
          <button
            onClick={() => { setPlaced(true); clear(); }}
            className="mt-5 w-full bg-gold text-navy font-mono font-bold py-4 rounded hover:bg-gold-bright transition-colors"
          >
            COMMANDER (PAIEMENT À LA LIVRAISON)
          </button>
        </>
      )}
    </div>
  );
}
