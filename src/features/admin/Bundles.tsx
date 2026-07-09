import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useBundles, useProducts, saveBundle, deleteBundle } from "../../data/store";
import type { Bundle, BundleItem } from "../../types";
import { formatDA } from "../../lib/format";
import { bundleComponentTotal } from "../../lib/offers";

const empty = (): Omit<Bundle, "id"> => ({
  name: "",
  description: "",
  imageUrl:
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&q=60",
  items: [],
  bundlePrice: null,
  isActive: true,
});

export default function AdminBundles() {
  const bundles = useBundles();
  const products = useProducts();
  const [editing, setEditing] = useState<(Omit<Bundle, "id"> & { id?: string }) | null>(null);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold">Packs</h1>
          <p className="text-gray-500 text-sm">Composez un pack (ex: Pack Mariage) en quelques clics</p>
        </div>
        <button
          onClick={() => setEditing(empty())}
          className="flex items-center gap-1 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={18} /> Nouveau pack
        </button>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        {bundles.map((b) => {
          const total = bundleComponentTotal(b, products);
          const price = b.bundlePrice ?? total;
          return (
            <div key={b.id} className="bg-white rounded-lg border p-4">
              <div className="flex justify-between">
                <h3 className="font-bold text-brand">{b.name}</h3>
                <div className="flex gap-2">
                  <button onClick={() => setEditing(b)} className="text-brand-light">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => confirm(`Supprimer ${b.name} ?`) && deleteBundle(b.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">{b.items.length} articles</p>
              <div className="mt-2 flex items-baseline gap-2">
                <span className="font-bold text-lg text-brand">{formatDA(price)}</span>
                {total > price && (
                  <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded font-semibold">
                    -{formatDA(total - price)}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {editing && (
        <BundleDialog
          value={editing}
          onClose={() => setEditing(null)}
          onSave={(b) => {
            saveBundle(b);
            setEditing(null);
          }}
        />
      )}
    </div>
  );
}

function BundleDialog({
  value,
  onClose,
  onSave,
}: {
  value: Omit<Bundle, "id"> & { id?: string };
  onClose: () => void;
  onSave: (b: Omit<Bundle, "id"> & { id?: string }) => void;
}) {
  const products = useProducts();
  const [form, setForm] = useState(value);
  const [search, setSearch] = useState("");

  const items: BundleItem[] = form.items;
  const total = items.reduce((s, it) => {
    const p = products.find((x) => x.id === it.productId);
    return s + (p ? p.price * it.quantity : 0);
  }, 0);
  const finalPrice = form.bundlePrice ?? total;
  const saving = total - finalPrice;

  const addItem = (productId: string) =>
    setForm((f) => {
      if (f.items.find((i) => i.productId === productId)) return f;
      return { ...f, items: [...f.items, { productId, quantity: 1 }] };
    });
  const setQty = (productId: string, qty: number) =>
    setForm((f) => ({
      ...f,
      items: f.items.map((i) => (i.productId === productId ? { ...i, quantity: Math.max(1, qty) } : i)),
    }));
  const removeItem = (productId: string) =>
    setForm((f) => ({ ...f, items: f.items.filter((i) => i.productId !== productId) }));

  const results = products
    .filter((p) => p.isActive && p.name.toLowerCase().includes(search.toLowerCase()))
    .slice(0, 6);

  function submit() {
    if (!form.name.trim()) return alert("Le nom du pack est requis");
    if (form.items.length === 0) return alert("Ajoutez au moins un produit");
    onSave(form);
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold">{value.id ? "Modifier" : "Nouveau"} pack</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <div className="p-4 grid md:grid-cols-2 gap-6">
          {/* Left: infos + picker */}
          <div className="space-y-3">
            <div>
              <label className="text-sm font-medium text-gray-600">Nom du pack</label>
              <input
                className="input mt-1"
                placeholder="Ex: Pack Mariage"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Description</label>
              <textarea
                className="input mt-1"
                rows={2}
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-gray-600">Ajouter des produits</label>
              <input
                className="input mt-1"
                placeholder="Rechercher…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <div className="mt-2 border rounded-lg divide-y max-h-48 overflow-y-auto">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => addItem(p.id)}
                    className="w-full text-left p-2 text-sm hover:bg-gray-50 flex justify-between"
                  >
                    <span>{p.name}</span>
                    <span className="text-gray-400">{formatDA(p.price)}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right: selected items + pricing */}
          <div>
            <label className="text-sm font-medium text-gray-600">Contenu du pack</label>
            <div className="mt-1 border rounded-lg divide-y min-h-[120px]">
              {items.length === 0 && (
                <p className="p-3 text-sm text-gray-400">Aucun produit sélectionné.</p>
              )}
              {items.map((it) => {
                const p = products.find((x) => x.id === it.productId)!;
                return (
                  <div key={it.productId} className="p-2 flex items-center justify-between gap-2 text-sm">
                    <span className="flex-1">{p?.name}</span>
                    <input
                      type="number"
                      min={1}
                      value={it.quantity}
                      onChange={(e) => setQty(it.productId, Number(e.target.value))}
                      className="w-14 border rounded px-2 py-1"
                    />
                    <button onClick={() => removeItem(it.productId)} className="text-red-500">
                      <X size={16} />
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-3 bg-gray-50 rounded-lg p-3 text-sm space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-500">Total des articles</span>
                <span className="font-semibold">{formatDA(total)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-500">Prix du pack (optionnel)</span>
                <input
                  type="number"
                  placeholder="auto"
                  value={form.bundlePrice ?? ""}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      bundlePrice: e.target.value === "" ? null : Number(e.target.value),
                    }))
                  }
                  className="w-28 border rounded px-2 py-1 text-right"
                />
              </div>
              {saving > 0 && (
                <div className="flex justify-between text-green-700 font-semibold">
                  <span>Économie client</span>
                  <span>{formatDA(saving)}</span>
                </div>
              )}
            </div>

            <label className="flex items-center gap-2 text-sm mt-3">
              <input
                type="checkbox"
                checked={form.isActive}
                onChange={(e) => setForm((f) => ({ ...f, isActive: e.target.checked }))}
              />
              Pack actif
            </label>
          </div>
        </div>

        <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
          <button onClick={onClose} className="px-4 py-2 text-sm">
            Annuler
          </button>
          <button onClick={submit} className="bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold">
            Enregistrer le pack
          </button>
        </div>
      </div>
    </div>
  );
}
