import { useState, useRef, useEffect } from "react";
import { MessageCircle, X, Send } from "lucide-react";
import { askAssistant, type ChatMessage } from "../lib/gemini";
import { useProducts, useBundles, useOffers } from "../data/store";

export default function AssistantWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: "assistant", content: "Bonjour ! Je suis l'assistant ElectroZone. Dites-moi ce que vous cherchez et votre budget (en DA), et je vous guide vers le bon produit." },
  ]);
  const products = useProducts();
  const bundles = useBundles();
  const offers = useOffers();
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages, loading]);

  async function send() {
    const text = input.trim();
    if (!text || loading) return;
    setInput("");
    const history = messages;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setLoading(true);
    const reply = await askAssistant(history, text, { products, bundles, offers });
    setMessages((m) => [...m, { role: "assistant", content: reply }]);
    setLoading(false);
  }

  return (
    <>
      <button onClick={() => setOpen((o) => !o)} className="fixed bottom-5 right-5 z-50 bg-gold text-navy rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-gold-bright transition-colors" aria-label="Assistant">
        {open ? <X /> : <MessageCircle />}
      </button>
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[92vw] max-w-sm h-[70vh] max-h-[520px] bg-navy-card rounded-xl shadow-2xl flex flex-col overflow-hidden border border-edge">
          <div className="bg-navy-deep border-b border-edge px-4 py-3">
            <p className="font-head font-bold text-cloud">Assistant ElectroZone</p>
            <p className="font-mono text-[11px] text-cloud-muted">Guidé par vos besoins & votre budget</p>
          </div>
          <div className="flex-1 overflow-y-auto p-3 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`max-w-[85%] rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ${m.role === "user" ? "ml-auto bg-gold text-navy font-medium" : "bg-navy-tile border border-edge text-cloud"}`}>
                {m.content}
              </div>
            ))}
            {loading && <div className="bg-navy-tile border border-edge text-cloud-muted text-sm rounded-lg px-3 py-2 w-16">…</div>}
            <div ref={endRef} />
          </div>
          <div className="p-2 border-t border-edge flex gap-2">
            <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && send()} placeholder="Ex: frigo pour 130000 DA" className="flex-1 bg-navy-tile border border-edge rounded-lg px-3 py-2 text-sm text-cloud placeholder-cloud/40 focus:outline-none focus:border-gold" />
            <button onClick={send} disabled={loading} className="bg-gold text-navy rounded-lg px-3 disabled:opacity-50"><Send size={18} /></button>
          </div>
        </div>
      )}
    </>
  );
}
