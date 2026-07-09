import type { Product, Bundle, Offer } from "../types";
import { priceProduct, bundleFinalPrice } from "./offers";
import { formatDA } from "./format";

/**
 * Simple AI shopping assistant.
 *
 * - If VITE_GEMINI_API_KEY is set, it calls Gemini with the live catalog as the
 *   ONLY allowed knowledge source + strict guardrails (stay on ElectroZone data,
 *   respect budget, never invent products).
 * - If no key, it falls back to a rule-based reply so the demo always works.
 *
 * NOTE (production): move the Gemini call into a Supabase Edge Function so the
 * API key is never shipped to the browser. See README.
 */

const KEY = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;
const MODEL = "gemini-1.5-flash";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

function buildCatalog(products: Product[], bundles: Bundle[], offers: Offer[]): string {
  const lines: string[] = [];
  lines.push("PRODUITS:");
  for (const p of products.filter((x) => x.isActive)) {
    const pr = priceProduct(p, offers);
    const price =
      pr.discountPct > 0
        ? `${formatDA(pr.finalPrice)} (au lieu de ${formatDA(pr.originalPrice)}, -${pr.discountPct}%)`
        : formatDA(p.price);
    const specs = Object.entries(p.specs)
      .map(([k, v]) => `${k}: ${v}`)
      .join(", ");
    lines.push(
      `- ${p.name} | marque ${p.brand} | catégorie ${p.categorySlug} | prix ${price} | stock ${p.stock} | ${specs}`,
    );
  }
  lines.push("\nPACKS:");
  for (const b of bundles.filter((x) => x.isActive)) {
    lines.push(`- ${b.name} | prix ${formatDA(bundleFinalPrice(b, products))} | ${b.description}`);
  }
  return lines.join("\n");
}

const SYSTEM = `Tu es l'assistant d'achat d'ElectroZone, un magasin d'électroménager en Algérie (prix en DA).
Règles strictes:
1. Réponds UNIQUEMENT à partir de la liste PRODUITS/PACKS fournie ci-dessous. C'est ta seule source.
2. Si l'info n'est pas dans ces données, dis poliment que tu peux seulement aider avec les produits ElectroZone.
3. N'invente jamais de produit, de prix ou de caractéristique. Cite toujours les prix en DA depuis les données.
4. Si l'utilisateur donne un budget, ne recommande que des produits à ce prix ou en dessous, du plus adapté au moins adapté. Si rien ne rentre, dis-le et propose l'option la plus proche ou un pack.
5. Sois concis, chaleureux, et guide vers un choix concret. Réponds dans la langue de l'utilisateur (français/arabe/anglais).`;

export async function askAssistant(
  history: ChatMessage[],
  userMessage: string,
  catalog: { products: Product[]; bundles: Bundle[]; offers: Offer[] },
): Promise<string> {
  const catalogText = buildCatalog(catalog.products, catalog.bundles, catalog.offers);

  if (!KEY) {
    return ruleBasedReply(userMessage, catalog);
  }

  try {
    const contents = [
      ...history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      })),
      { role: "user", parts: [{ text: userMessage }] },
    ];

    const res = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: `${SYSTEM}\n\n=== DONNÉES ELECTROZONE ===\n${catalogText}` }],
          },
          contents,
          generationConfig: { temperature: 0.4, maxOutputTokens: 600 },
        }),
      },
    );
    if (!res.ok) throw new Error(`Gemini ${res.status}`);
    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
    return text || ruleBasedReply(userMessage, catalog);
  } catch (e) {
    console.warn("Gemini call failed, using fallback:", e);
    return ruleBasedReply(userMessage, catalog);
  }
}

// ---- Offline fallback: budget filter + keyword match ----
function ruleBasedReply(
  msg: string,
  catalog: { products: Product[]; bundles: Bundle[]; offers: Offer[] },
): string {
  const text = msg.toLowerCase();
  const budgetMatch = text.replace(/\s/g, "").match(/(\d{4,7})/);
  const budget = budgetMatch ? parseInt(budgetMatch[1], 10) : null;

  const active = catalog.products.filter((p) => p.isActive);
  const scored = active
    .map((p) => {
      const pr = priceProduct(p, catalog.offers);
      let score = 0;
      if (text.includes(p.categorySlug.replace(/-/g, " "))) score += 3;
      if (text.includes(p.brand.toLowerCase())) score += 2;
      for (const w of ["café", "cafe", "frigo", "réfrigérateur", "laver", "tv", "télé", "aspirateur", "micro"]) {
        if (text.includes(w) && (p.name.toLowerCase().includes(w) || p.categorySlug.includes(w.slice(0, 4)))) score += 2;
      }
      return { p, price: pr.finalPrice, score };
    })
    .filter((x) => (budget ? x.price <= budget : true))
    .sort((a, b) => b.score - a.score || a.price - b.price);

  if (scored.length === 0) {
    if (budget) {
      const cheapest = active
        .map((p) => ({ p, price: priceProduct(p, catalog.offers).finalPrice }))
        .sort((a, b) => a.price - b.price)[0];
      return `Aucun produit ne rentre dans ${formatDA(budget)}. Le moins cher est ${cheapest.p.name} à ${formatDA(cheapest.price)}. Souhaitez-vous augmenter un peu le budget ?`;
    }
    return "Je peux vous aider à choisir parmi les produits ElectroZone (électroménager). Dites-moi ce que vous cherchez et votre budget en DA.";
  }

  const top = scored.slice(0, 3);
  const intro = budget
    ? `Voici ce que je recommande pour un budget de ${formatDA(budget)} :`
    : "Voici quelques suggestions :";
  const list = top.map((x) => `• ${x.p.name} — ${formatDA(x.price)}`).join("\n");
  return `${intro}\n${list}\n\nVoulez-vous plus de détails sur l'un d'eux ?`;
}
