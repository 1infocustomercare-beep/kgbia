import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { PAPERFISH } from "./theme";
import { PaperfishHeader } from "./PaperfishHeader";
import type { PaperfishMenuItem } from "./PaperfishHome";

export interface PaperfishExtra {
  id: string;
  label: string;
  price: number;
}

interface Props {
  brandName: string;
  item: PaperfishMenuItem & { ingredients?: string; extras?: PaperfishExtra[]; sizes?: { id: string; label: string; multiplier: number }[] };
  onBack: () => void;
  onAdd: (qty: number, sizeId: string, extras: string[]) => void;
}

const DEFAULT_SIZES = [
  { id: "small", label: "6 pz", multiplier: 0.6 },
  { id: "medium", label: "12 pz", multiplier: 1 },
  { id: "large", label: "18 pz", multiplier: 1.4 },
];

export function PaperfishDetail({ brandName, item, onBack, onAdd }: Props) {
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
    <div className="paperfish-theme min-h-screen pb-28" style={{ background: PAPERFISH.bg }}>
      <PaperfishHeader brandName={brandName} onBack={onBack} />

      {/* Hero photo */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl overflow-hidden aspect-square" style={{ border: `1px solid ${PAPERFISH.divider}` }}>
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Title + Price */}
      <div className="px-4 mt-4">
        {item.jp_label && (
          <p className="text-[11px] tracking-[0.42em] mb-1" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
            {item.jp_label}
          </p>
        )}
        <div className="flex items-start justify-between gap-3">
          <h1
            className="text-3xl font-serif-pf leading-tight flex-1"
            style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.06em" }}
          >
            {item.name}
          </h1>
          <span
            className="text-2xl font-serif-pf shrink-0"
            style={{ color: PAPERFISH.gold, fontFamily: PAPERFISH.fontHead }}
          >
            € {(item.price * size.multiplier).toFixed(2).replace(".", ",")}
          </span>
        </div>
        <div className="w-10 h-px mt-2" style={{ background: PAPERFISH.primary }} />
      </div>

      {/* Ingredients */}
      <div className="px-4 mt-3">
        <p className="text-sm leading-relaxed" style={{ color: PAPERFISH.textMuted, fontFamily: PAPERFISH.fontBody }}>
          {item.ingredients || item.description}
        </p>
      </div>

      {/* Size selector */}
      <div className="px-4 mt-5">
        <h3 className="text-[0.7rem] tracking-[0.2em] uppercase mb-2" style={{ color: PAPERFISH.text }}>Formato</h3>
        <div
          className="flex rounded-full p-1"
          style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.divider}` }}
        >
          {sizes.map(s => {
            const isActive = sizeId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSizeId(s.id)}
                className="flex-1 py-2 rounded-full text-sm font-medium transition-all"
                style={{
                  background: isActive ? PAPERFISH.primary : "transparent",
                  color: isActive ? PAPERFISH.bg : PAPERFISH.textMuted,
                  fontFamily: PAPERFISH.fontBody,
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
        <h3 className="text-[0.7rem] tracking-[0.2em] uppercase" style={{ color: PAPERFISH.text }}>Quantità</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: PAPERFISH.bgPanel, color: PAPERFISH.primary, border: `1px solid ${PAPERFISH.divider}` }}
          >
            <Minus className="w-4 h-4" strokeWidth={2.4} />
          </button>
          <span className="text-lg font-serif-pf w-6 text-center" style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead }}>{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: PAPERFISH.bgPanel, color: PAPERFISH.primary, border: `1px solid ${PAPERFISH.divider}` }}
          >
            <Plus className="w-4 h-4" strokeWidth={2.4} />
          </button>
        </div>
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="px-4 mt-5">
          <h3 className="text-[0.7rem] tracking-[0.2em] uppercase mb-2" style={{ color: PAPERFISH.text }}>Aggiungi Extra</h3>
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
                        background: checked ? PAPERFISH.primary : "transparent",
                        color: PAPERFISH.bg,
                        border: `1px solid ${PAPERFISH.primary}`,
                      }}
                    >
                      {checked ? "✓" : ""}
                    </span>
                    <span className="text-sm" style={{ color: PAPERFISH.text }}>{extra.label}</span>
                  </button>
                  <span className="text-sm font-serif-pf" style={{ color: PAPERFISH.gold, fontFamily: PAPERFISH.fontHead }}>
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
        style={{ background: `${PAPERFISH.bg}f0`, borderTop: `1px solid ${PAPERFISH.divider}`, backdropFilter: "blur(20px)" }}
      >
        <button
          onClick={() => onAdd(qty, sizeId, selectedExtras)}
          className="w-full py-4 rounded-full text-sm font-medium uppercase tracking-[0.2em] flex items-center justify-center gap-2"
          style={{ background: PAPERFISH.primary, color: PAPERFISH.bg, fontFamily: PAPERFISH.fontBody }}
        >
          Aggiungi al Carrello <ShoppingCart className="w-4 h-4" />
          <span className="ml-2 opacity-80">€{finalPrice.toFixed(2).replace(".", ",")}</span>
        </button>
      </div>
    </div>
  );
}
