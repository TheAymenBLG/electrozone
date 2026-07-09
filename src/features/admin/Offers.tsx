import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useOffers, useProducts, useCategories, saveOffer, deleteOffer } from "../../data/store";
import type { Offer } from "../../types";

const todayISO = () => new Date().toISOString().slice(0, 10);
const plus = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString().slice(0, 10);

const empty = (): Omit<Offer, "id"> => ({
  title: "",
  type: "percentage",
  value: 10,
  scope: "product",
  targetId: null,
  startsAt: todayISO(),
  endsAt: plus(14),
  isActive: true,
});

function status(o: Offer): { label: string; cls: string } {
  const now = todayISO();
  if (!o.isActive) return { label: "Désactivée", cls: "bg-gray-200 text-gray-500" };
  if (o.startsAt > now) return { label: "Programmée", cls: "bg-blue-100 text-blue-700" };
  if (o.endsAt < now) return { label: "Expirée", cls: "bg-gray-200 text-gray-500" };
  return { label: "Active", cls: "bg-green-100 text-green-700" };
}

export default function AdminOffers() {
  const offers = useOffers();
  const products = useProducts();
  const categories = useCategories();
  const [editing, setEditing] = useState<(Omit<Offer, "id"> & { id?: string }) | null>(null);

  const targetLabel = (o: Offer) => {
    if (o.scope === "sitewide") return "Tout le site";
    if (o.scope === "category") return categories.find((c) => c.slug === o.targetId)?.name ?? o.targetId;
    return products.find((p) => p.id === o.targetId)?.name ?? o.targetId;
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Offres & Promos</h1>
        <button
          onClick={() => setEditing(empty())}
          className="flex items-center gap-1 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={18} /> Nouvelle offre
        </button>
      </div>

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Titre</th>
              <th className="p-3">Réduction</th>
              <th className="p-3">Cible</th>
              <th className="p-3">Période</th>
              <th className="p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {offers.map((o) => {
              const st = status(o);
              return (
                <tr key={o.id}>
                  <td className="p-3 font-medium">{o.title}</td>
                  <td className="p-3">{o.type === "percentage" ? `-${o.value}%` : `-${o.value} DA`}</td>
                  <td className="p-3 text-gray-600">{targetLabel(o)}</td>
                  <td className="p-3 text-gray-500 text-xs">
                    {o.startsAt} → {o.endsAt}
                  </td>
                  <td className="p-3">
                    <span className={`text-xs px-2 py-0.5 rounded ${st.cls}`}>{st.label}</span>
                  </td>
                  <td className="p-3 text-right">
                    <button onClick={() => setEditing(o)} className="text-brand-light mr-3 text-xs underline">
                      Modifier
                    </button>
                    <button
                      onClick={() => confirm(`Supprimer "${o.title}" ?`) && deleteOffer(o.id)}
                      className="text-red-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {editing && (
        <OfferDialog
          value={editing}
          products={products}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={(o) => {
            saveOffer(o);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function OfferDialog({
  value,
  products,
  categories,
  onClose,
  onSave,
}: {
  value: Omit<Offer, "id"> & { id?: string };
  products: { id: string; name: string }[];
  categories: { slug: string; name: string }[];
  onClose: () => void;
  onSave: (o: Omit<Offer, "id"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState(value);
  const set = (k: keyof Offer, v: any) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    if (!form.title.trim()) return alert("Le titre est requis");
    if (form.scope !== "sitewide" && !form.targetId) return alert("Choisissez une cible");
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold">{value.id ? "Modifier" : "Nouvelle"} offre</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <div>
            <label className="text-sm font-medium text-gray-600">Titre</label>
            <input className="input mt-1" value={form.title} onChange={(e) => set("title", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Type</label>
              <select className="input mt-1" value={form.type} onChange={(e) => set("type", e.target.value)}>
                <option value="percentage">Pourcentage (%)</option>
                <option value="fixed">Montant fixe (DA)</option>
              </select>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Valeur</label>
              <input
                type="number"
                className="input mt-1"
                value={form.value}
                onChange={(e) => set("value", Number(e.target.value))}
              />
            </div>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600">Portée</label>
            <select
              className="input mt-1"
              value={form.scope}
              onChange={(e) =>
                setForm((f) => ({ ...f, scope: e.target.value as Offer["scope"], targetId: null }))
              }
            >
              <option value="product">Un produit</option>
              <option value="category">Une catégorie</option>
              <option value="sitewide">Tout le site</option>
            </select>
          </div>
          {form.scope === "product" && (
            <div>
              <label className="text-sm font-medium text-gray-600">Produit</label>
              <select
                className="input mt-1"
                value={form.targetId ?? ""}
                onChange={(e) => set("targetId", e.target.value)}
              >
                <option value="">— choisir —</option>
                {products.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          {form.scope === "category" && (
            <div>
              <label className="text-sm font-medium text-gray-600">Catégorie</label>
              <select
                className="input mt-1"
                value={form.targetId ?? ""}
                onChange={(e) => set("targetId", e.target.value)}
              >
                <option value="">— choisir —</option>
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Début</label>
              <input
                type="date"
                className="input mt-1"
                value={form.startsAt}
                onChange={(e) => set("startsAt", e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Fin</label>
              <input
                type="date"
                className="input mt-1"
                value={form.endsAt}
                onChange={(e) => set("endsAt", e.target.value)}
              />
            </div>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} />
            Offre active
          </label>
        </div>
        <div className="p-4 border-t flex justify-end gap-2">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Annuler
          </button>
          <button onClick={submit} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Enregistrer
          </button>
        </div>
      </div>
    </div>
  );
}
