import { Plus, Minus, ShoppingCart } from "lucide-react";
import { useState } from "react";
import { STRAPIZZAMI } from "./theme";
import { StrapizzamiHeader } from "./StrapizzamiHeader";
import type { StrapizzamiMenuItem } from "./StrapizzamiHome";

export interface StrapizzamiExtra {
  id: string;
  label: string;
  price: number;
}

interface Props {
  brandName: string;
  item: StrapizzamiMenuItem & { ingredients?: string; extras?: StrapizzamiExtra[]; sizes?: { id: string; label: string; multiplier: number }[] };
  onBack: () => void;
  onAdd: (qty: number, sizeId: string, extras: string[]) => void;
}

const DEFAULT_SIZES = [
  { id: "small", label: "Piccola", multiplier: 0.85 },
  { id: "medium", label: "Media", multiplier: 1 },
  { id: "large", label: "Grande", multiplier: 1.25 },
];

export function StrapizzamiDetail({ brandName, item, onBack, onAdd }: Props) {
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
    <div className="strapizzami-theme min-h-screen pb-28" style={{ background: STRAPIZZAMI.bg }}>
      <StrapizzamiHeader brandName={brandName} onBack={onBack} />

      {/* Hero photo */}
      <div className="px-4 mt-3">
        <div className="rounded-2xl overflow-hidden aspect-square shadow-md">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Title + Price */}
      <div className="px-4 mt-4 flex items-start justify-between gap-3">
        <h1
          className="text-3xl font-serif-strap leading-tight flex-1"
          style={{ color: STRAPIZZAMI.primary, fontFamily: STRAPIZZAMI.fontHead }}
        >
          {item.name}
        </h1>
        <span
          className="text-2xl font-serif-strap shrink-0"
          style={{ color: STRAPIZZAMI.primary, fontFamily: STRAPIZZAMI.fontHead }}
        >
          € {(item.price * size.multiplier).toFixed(2).replace(".", ",")}
        </span>
      </div>

      {/* Ingredients */}
      <div className="px-4 mt-2">
        <p className="text-sm leading-relaxed" style={{ color: STRAPIZZAMI.text, fontFamily: STRAPIZZAMI.fontBody }}>
          <span className="font-bold">Ingredienti:</span>{" "}
          {item.ingredients || item.description}
        </p>
      </div>

      {/* Size selector */}
      <div className="px-4 mt-5">
        <h3 className="text-sm font-bold mb-2" style={{ color: STRAPIZZAMI.text }}>Seleziona Dimensione</h3>
        <div
          className="flex rounded-full p-1"
          style={{ background: "transparent", border: `1.5px solid ${STRAPIZZAMI.primary}` }}
        >
          {sizes.map(s => {
            const isActive = sizeId === s.id;
            return (
              <button
                key={s.id}
                onClick={() => setSizeId(s.id)}
                className="flex-1 py-2 rounded-full text-sm font-bold transition-all"
                style={{
                  background: isActive ? STRAPIZZAMI.primary : "transparent",
                  color: isActive ? STRAPIZZAMI.card : STRAPIZZAMI.primary,
                  fontFamily: STRAPIZZAMI.fontBody,
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
        <h3 className="text-base font-bold" style={{ color: STRAPIZZAMI.text }}>Quantità</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setQty(Math.max(1, qty - 1))}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: STRAPIZZAMI.cardSoft, color: STRAPIZZAMI.primary, border: `1.5px solid ${STRAPIZZAMI.divider}` }}
          >
            <Minus className="w-4 h-4" strokeWidth={3} />
          </button>
          <span className="text-lg font-bold w-6 text-center" style={{ color: STRAPIZZAMI.text }}>{qty}</span>
          <button
            onClick={() => setQty(qty + 1)}
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: STRAPIZZAMI.cardSoft, color: STRAPIZZAMI.primary, border: `1.5px solid ${STRAPIZZAMI.divider}` }}
          >
            <Plus className="w-4 h-4" strokeWidth={3} />
          </button>
        </div>
      </div>

      {/* Extras */}
      {extras.length > 0 && (
        <div className="px-4 mt-5">
          <h3 className="text-base font-bold mb-2" style={{ color: STRAPIZZAMI.text }}>Aggiungi Extra</h3>
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
                        background: checked ? STRAPIZZAMI.primary : "transparent",
                        color: STRAPIZZAMI.card,
                        border: `1.5px solid ${STRAPIZZAMI.primary}`,
                      }}
                    >
                      {checked ? "✕" : ""}
                    </span>
                    <span className="text-sm" style={{ color: STRAPIZZAMI.text }}>{extra.label}</span>
                  </button>
                  <span className="text-sm font-bold" style={{ color: STRAPIZZAMI.text }}>
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
        style={{ background: `${STRAPIZZAMI.bg}f5`, borderTop: `1px solid ${STRAPIZZAMI.divider}`, backdropFilter: "blur(16px)" }}
      >
        <button
          onClick={() => onAdd(qty, sizeId, selectedExtras)}
          className="w-full py-4 rounded-full text-base font-bold flex items-center justify-center gap-2 shadow-lg"
          style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card, fontFamily: STRAPIZZAMI.fontBody }}
        >
          Aggiungi al Carrello <ShoppingCart className="w-5 h-5" />
          <span className="ml-2 opacity-80">€{finalPrice.toFixed(2).replace(".", ",")}</span>
        </button>
      </div>
    </div>
  );
}
