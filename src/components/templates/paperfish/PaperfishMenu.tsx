import { Plus } from "lucide-react";
import { useState } from "react";
import { PAPERFISH } from "./theme";
import { PaperfishHeader } from "./PaperfishHeader";
import { PaperfishBottomNav } from "./PaperfishBottomNav";
import type { PaperfishMenuItem } from "./PaperfishHome";

interface Props {
  brandName: string;
  subtitle?: string;
  cartCount: number;
  categories: string[];
  items: PaperfishMenuItem[];
  onBack: () => void;
  onCart: () => void;
  onAdd: (item: PaperfishMenuItem) => void;
  onItemClick?: (item: PaperfishMenuItem) => void;
  onNavigate: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
}

export function PaperfishMenu({
  brandName, subtitle, cartCount, categories, items,
  onBack, onCart, onAdd, onItemClick, onNavigate,
}: Props) {
  const [activeCat, setActiveCat] = useState<string>(categories[0] || "");
  const filtered = activeCat ? items.filter(i => i.category === activeCat) : items;

  return (
    <div className="paperfish-theme min-h-screen pb-28" style={{ background: PAPERFISH.bg }}>
      <PaperfishHeader
        brandName={brandName}
        subtitle={subtitle}
        cartCount={cartCount}
        onBack={onBack}
        onCart={onCart}
      />

      {/* Title MENU */}
      <div className="text-center mt-5 mb-4">
        <p className="text-[11px] tracking-[0.42em] mb-1" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
          メニュー
        </p>
        <h2
          className="text-3xl font-serif-pf"
          style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.22em" }}
        >
          MENU
        </h2>
        <div className="w-12 h-px mx-auto mt-2" style={{ background: PAPERFISH.primary }} />
      </div>

      {/* Category pills */}
      <div className="px-4 -mx-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="px-5 py-2 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.18em] whitespace-nowrap transition-all shrink-0"
                style={{
                  background: isActive ? PAPERFISH.primary : "transparent",
                  color: isActive ? PAPERFISH.bg : PAPERFISH.textMuted,
                  border: `1px solid ${isActive ? PAPERFISH.primary : PAPERFISH.divider}`,
                  fontFamily: PAPERFISH.fontBody,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* List of menu cards */}
      <div className="px-4 space-y-3">
        {filtered.map(item => (
          <article
            key={item.id}
            onClick={() => onItemClick?.(item)}
            className="rounded-2xl overflow-hidden flex gap-3 p-3 cursor-pointer"
            style={{
              background: PAPERFISH.bgPanel,
              border: `1px solid ${PAPERFISH.border}`,
            }}
          >
            <div
              className="w-24 h-24 rounded-xl overflow-hidden shrink-0"
              style={{ border: `1px solid ${PAPERFISH.divider}` }}
            >
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <div className="flex-1 min-w-0">
                  {item.jp_label && (
                    <p className="text-[10px] tracking-[0.32em] mb-0.5" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
                      {item.jp_label}
                    </p>
                  )}
                  <h3
                    className="text-sm font-medium leading-tight font-serif-pf"
                    style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.04em" }}
                  >
                    {item.name}
                  </h3>
                </div>
                <span
                  className="text-sm font-serif-pf shrink-0"
                  style={{ color: PAPERFISH.gold, fontFamily: PAPERFISH.fontHead }}
                >
                  €{item.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p
                className="text-[0.7rem] leading-snug line-clamp-2 mb-2 flex-1"
                style={{ color: PAPERFISH.textMuted }}
              >
                {item.description}
              </p>
              <button
                onClick={e => { e.stopPropagation(); onAdd(item); }}
                className="self-end px-4 py-1.5 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.14em] flex items-center gap-1.5"
                style={{ background: PAPERFISH.primary, color: PAPERFISH.bg }}
              >
                Aggiungi <Plus className="w-3 h-3" strokeWidth={3} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <PaperfishBottomNav active="menu" onChange={onNavigate} showOffers />
    </div>
  );
}
