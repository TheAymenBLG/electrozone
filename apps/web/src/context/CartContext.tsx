import { createContext, useContext, useState, ReactNode } from "react";
import type { CartLine } from "@electrozone/shared";

interface CartCtx {
  lines: CartLine[];
  add: (kind: "product" | "bundle", id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  count: number;
}

const Ctx = createContext<CartCtx | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);

  const add = (kind: "product" | "bundle", id: string) =>
    setLines((prev) => {
      const found = prev.find((l) => l.id === id && l.kind === kind);
      if (found)
        return prev.map((l) =>
          l.id === id && l.kind === kind ? { ...l, quantity: l.quantity + 1 } : l,
        );
      return [...prev, { kind, id, quantity: 1 }];
    });

  const remove = (id: string) => setLines((prev) => prev.filter((l) => l.id !== id));
  const clear = () => setLines([]);
  const count = lines.reduce((s, l) => s + l.quantity, 0);

  return <Ctx.Provider value={{ lines, add, remove, clear, count }}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart must be used within CartProvider");
  return c;
}
