import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { BATEY } from "./theme";
import { BateyHeader } from "./BateyHeader";
import type { BateyMenuItem } from "./BateyHome";

export interface BateyExtra {
  id: string;
  label: string;
  price: number;
}

interface Props {
  brandName: string;
  item: BateyMenuItem & { ingredients?: string; extras?: BateyExtra[]; sizes?: { id: string; label: string; multiplier: number }[] };
  onBack: () => void;
  onAdd: (qty: number, sizeId: string, extras: string[]) => void;
}

const DEFAULT_SIZES = [
  { id: "small", label: "Piccola", multiplier: 0.7 },
  { id: "medium", label: "Media", multiplier: 1 },
  { id: "large", label: "Grande", multiplier: 1.4 },
];

export function BateyDetail({ brandName, item, onBack, onAdd }: Props) {
  const sizes = item.sizes || DEFAULT_SIZES;
  const extras = item.extras || [];
  const [sizeId, setSizeId] = useState(sizes.find(s => s.multiplier === 1)?.id || sizes[0].id);
  const [qty, setQty] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<string[]>([]);

  const size = sizes.find(s => s.id === sizeId)!;
  const extraTotal = extras.filter(e => selectedExtras.includes(e.id)).reduce((s, e) => s + e.price, 0);
  const finalPrice = (item.price * size.multiplier + extraTotal) * qty;

  const toggleExtra = (id: string) =>
    setSelectedExtras(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);

  return (
    <div className="batey-theme min-h-screen pb-28" style={{ background: BATEY.bg }}>
      <BateyHeader brandName={brandName} onBack={onBack} />

      {/* Hero photo */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl overflow-hidden aspect-square" style={{ border: `1px solid ${BATEY.divider}` }}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Title + Price */}
      <div className="px-4 mt-4">
        {item.es_label && (
          <p className="text-[0.6rem] tracking-[0.42em] mb-1 italic" style={{ color: BATEY.primary, fontFamily: BATEY.fontEs }}>
            {item.es_label}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h1
            className="text-3xl font-serif-bt leading-tight flex-1"
            style={{ color: BATEY.text, fontFamily: BATEY.fontHead, letterSpacing: "0.06em" }}
          >
            {item.name}
          </h1>
          <span
            className="text-2xl font-serif-bt shrink-0"
            style={{ color: BATEY.sand, fontFamily: BATEY.fontHead }}
          >
            € {(item.price * size.multiplier).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="w-10 h-px mt-2" style={{ background: BATEY.primary }} />
      </div>

      {/* Ingredients */}
      <div className="px-4 mt-3">
        <p className="text-sm leading-relaxed" style={{ color: BATEY.textMuted, fontFamily: BATEY.fontBody }}>
          {item.ingredients || item.description}
        </p>
      </div>

      {/* Size selector */}
      <div className="px-4 mt-5">
        <h3 className="text-[0.7rem] tracking-[0.2em] uppercase mb-2" style={{ color: BATEY.text }}>Porzione</h3>
        <div
          className="flex rounded-full p-1"
          style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.divider}` }}
        >
          {sizes.map(s => {
            const isActive = sizeId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSizeId(s.id)}
                className="flex-1 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: isActive ? BATEY.primary : "transparent",
                  color: isActive ? BATEY.bg : BATEY.textMuted,
                  fontFamily: BATEY.fontBody,
                }}
              >
                {s.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Quantity */}
      <div className="px-4 mt-5 flex items-center justify-between">
        <h3 className="text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: BATEY.text }}>Quantità</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: BATEY.bgPanel, color: BATEY.primary, border: `1px solid ${BATEY.divider}` }}
          >
            <Minus className="w-4 h-4" strokeWidth={2.4} />
          </button>
          <span className="text-lg font-serif-bt w-6 text-center" style={{ color: BATEY.text, fontFamily: BATEY.fontHead }}>{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: BATEY.bgPanel, color: BATEY.primary, border: `1px solid ${BATEY.divider}` }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="px-4 mt-5">
          <h3 className="text-[0.7rem] tracking-[0.2em] uppercase mb-2" style={{ color: BATEY.text }}>Aggiungi Extra</h3>
          <ul className="space-y-2">
            {extras.map(extra => {
              const checked = selectedExtras.includes(extra.id);
              return (
                <li key={extra.id} className="flex items-center justify-between">
                  <button
                    onClick={() => toggleExtra(extra.id)}
                    className="flex items-center gap-3 flex-1 text-left"
                  >
                    <span
                      className="w-5 h-5 rounded flex items-center justify-center text-[0.7rem] font-bold"
                      style={{
                        background: checked ? BATEY.primary : "transparent",
                        color: BATEY.bg,
                        border: `1px solid ${BATEY.primary}`,
                      }}
                    >
                      {checked ? "✓" : ""}
                    </span>
                    <span className="text-sm" style={{ color: BATEY.text }}>{extra.label}</span>
                  </button>
                  <span className="text-sm font-serif-bt" style={{ color: BATEY.sand, fontFamily: BATEY.fontHead }}>
                    +€{extra.price.toFixed(2).replace(".", ",")}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Sticky CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]"
        style={{ background: `${BATEY.bg}f0`, borderTop: `1px solid ${BATEY.divider}`, backdropFilter: "blur(20px)" }}
      >
        <button
          onClick={() => onAdd(qty, sizeId, selectedExtras)}
          className="w-full py-4 rounded-full text-sm font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          style={{ background: BATEY.primary, color: BATEY.bg, fontFamily: BATEY.fontBody }}
        >
          Aggiungi al Carrello <ShoppingCart className="w-4 h-4" />
          <span className="ml-2 opacity-80">€{finalPrice.toFixed(2).replace(".", ",")}</span>
        </button>
      </div>
    </div>
  );
}
