import { useState, type ReactNode } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { useProducts, useCategories, saveProduct, deleteProduct } from "../../data/store";
import type { Product } from "@electrozone/shared";
import { formatDA } from "../../lib/format";

const empty = (categorySlug: string): Omit<Product, "id"> => ({
  name: "",
  brand: "",
  categorySlug,
  price: 0,
  stock: 0,
  description: "",
  imageUrl:
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&w=600&q=60",
  specs: {},
  isActive: true,
});

export default function AdminProducts() {
  const products = useProducts();
  const categories = useCategories();
  const [search, setSearch] = useState("");
  const [editing, setEditing] = useState<(Omit<Product, "id"> & { id?: string }) | null>(null);

  const filtered = products.filter((p) =>
    (p.name + p.brand).toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Produits</h1>
        <button
          onClick={() => setEditing(empty(categories[0].slug))}
          className="flex items-center gap-1 bg-brand text-white px-4 py-2 rounded-lg text-sm font-semibold"
        >
          <Plus size={18} /> Ajouter un produit
        </button>
      </div>

      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Rechercher un produit…"
        className="w-full max-w-sm border rounded-lg px-3 py-2 mb-4 text-sm"
      />

      <div className="bg-white rounded-lg border overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-gray-500">
            <tr>
              <th className="p-3">Produit</th>
              <th className="p-3">Catégorie</th>
              <th className="p-3">Prix</th>
              <th className="p-3">Stock</th>
              <th className="p-3">Statut</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {filtered.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="font-medium">{p.name}</div>
                  <div className="text-xs text-gray-400">{p.brand}</div>
                </td>
                <td className="p-3 text-gray-600">{p.categorySlug}</td>
                <td className="p-3 font-semibold">{formatDA(p.price)}</td>
                <td className="p-3">
                  <span className={p.stock <= 4 ? "text-red-500 font-semibold" : ""}>{p.stock}</span>
                </td>
                <td className="p-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded ${
                      p.isActive ? "bg-green-100 text-green-700" : "bg-gray-200 text-gray-500"
                    }`}
                  >
                    {p.isActive ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="p-3 text-right whitespace-nowrap">
                  <button onClick={() => setEditing(p)} className="text-brand-light mr-3">
                    <Pencil size={16} />
                  </button>
                  <button
                    onClick={() => confirm(`Supprimer ${p.name} ?`) && deleteProduct(p.id)}
                    className="text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <ProductDialog
          value={editing}
          categories={categories}
          onClose={() => setEditing(null)}
          onSave={async (p) => {
            try {
              await saveProduct(p);
              setEditing(null);
            } catch {
              alert("Erreur lors de l'enregistrement.");
            }
          }}
        />
      )}
    </div>
  );
}

function ProductDialog({
  value,
  categories,
  onClose,
  onSave,
}: {
  value: Omit<Product, "id"> & { id?: string };
  categories: { slug: string; name: string }[];
  onClose: () => void;
  onSave: (p: Omit<Product, "id"> & { id?: string }) => void;
}) {
  const [form, setForm] = useState(value);
  const [specs, setSpecs] = useState<[string, string][]>(Object.entries(value.specs));

  const set = (k: keyof Product, v: any) => setForm((f) => ({ ...f, [k]: v }));

  function submit() {
    if (!form.name.trim()) return alert("Le nom est requis");
    const specObj = Object.fromEntries(specs.filter(([k]) => k.trim()));
    onSave({ ...form, specs: specObj });
  }

  return (
    <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white">
          <h2 className="font-bold">{value.id ? "Modifier" : "Ajouter"} un produit</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>
        <div className="p-4 space-y-3">
          <Field label="Nom">
            <input className="input" value={form.name} onChange={(e) => set("name", e.target.value)} />
          </Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Marque">
              <input className="input" value={form.brand} onChange={(e) => set("brand", e.target.value)} />
            </Field>
            <Field label="Catégorie">
              <select
                className="input"
                value={form.categorySlug}
                onChange={(e) => set("categorySlug", e.target.value)}
              >
                {categories.map((c) => (
                  <option key={c.slug} value={c.slug}>
                    {c.name}
                  </option>
                ))}
              </select>
            </Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix (DA)">
              <input
                type="number"
                className="input"
                value={form.price}
                onChange={(e) => set("price", Number(e.target.value))}
              />
            </Field>
            <Field label="Stock">
              <input
                type="number"
                className="input"
                value={form.stock}
                onChange={(e) => set("stock", Number(e.target.value))}
              />
            </Field>
          </div>
          <Field label="Image (URL)">
            <input className="input" value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} />
          </Field>
          <Field label="Description">
            <textarea
              className="input"
              rows={2}
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </Field>

          <div>
            <label className="text-sm font-medium text-gray-600">Caractéristiques</label>
            <div className="space-y-2 mt-1">
              {specs.map((s, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    className="input"
                    placeholder="clé (ex: capacité)"
                    value={s[0]}
                    onChange={(e) =>
                      setSpecs((arr) => arr.map((x, j) => (j === i ? [e.target.value, x[1]] : x)))
                    }
                  />
                  <input
                    className="input"
                    placeholder="valeur (ex: 470L)"
                    value={s[1]}
                    onChange={(e) =>
                      setSpecs((arr) => arr.map((x, j) => (j === i ? [x[0], e.target.value] : x)))
                    }
                  />
                  <button
                    onClick={() => setSpecs((arr) => arr.filter((_, j) => j !== i))}
                    className="text-red-500 px-2"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                onClick={() => setSpecs((arr) => [...arr, ["", ""]])}
                className="text-sm text-brand-light"
              >
                + Ajouter une caractéristique
              </button>
            </div>
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) => set("isActive", e.target.checked)}
            />
            Produit actif (visible en boutique)
          </label>
        </div>
        <div className="p-4 border-t flex justify-end gap-2 sticky bottom-0 bg-white">
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

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <div className="mt-1">{children}</div>
    </div>
  );
}
