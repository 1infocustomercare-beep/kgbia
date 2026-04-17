import { Plus } from "lucide-react";
import { useState } from "react";
import { STRAPIZZAMI } from "./theme";
import { StrapizzamiHeader } from "./StrapizzamiHeader";
import { StrapizzamiBottomNav } from "./StrapizzamiBottomNav";
import type { StrapizzamiMenuItem } from "./StrapizzamiHome";

interface Props {
  brandName: string;
  subtitle?: string;
  cartCount: number;
  categories: string[];
  items: StrapizzamiMenuItem[];
  onBack: () => void;
  onCart: () => void;
  onAdd: (item: StrapizzamiMenuItem) => void;
  onItemClick?: (item: StrapizzamiMenuItem) => void;
  onNavigate: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
}

export function StrapizzamiMenu({
  brandName, subtitle, cartCount, categories, items,
  onBack, onCart, onAdd, onItemClick, onNavigate,
}: Props) {
  const [activeCat, setActiveCat] = useState<string>(categories[0] || "");
  const filtered = activeCat ? items.filter(i => i.category === activeCat) : items;

  return (
    <div className="strapizzami-theme min-h-screen pb-28" style={{ background: STRAPIZZAMI.bg }}>
      <StrapizzamiHeader
        brandName={brandName}
        subtitle={subtitle}
        cartCount={cartCount}
        onBack={onBack}
        onCart={onCart}
      />

      {/* Title MENU */}
      <h2
        className="text-center text-3xl font-serif-strap mt-5 mb-4"
        style={{ color: STRAPIZZAMI.text, fontFamily: STRAPIZZAMI.fontHead, letterSpacing: "0.08em" }}
      >
        MENU
      </h2>

      {/* Category pills */}
      <div className="px-4 -mx-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-3 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="px-5 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all shrink-0"
                style={{
                  background: isActive ? STRAPIZZAMI.primary : "transparent",
                  color: isActive ? STRAPIZZAMI.card : STRAPIZZAMI.primary,
                  border: `1.5px solid ${STRAPIZZAMI.primary}`,
                  fontFamily: STRAPIZZAMI.fontBody,
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
            className="rounded-2xl overflow-hidden flex gap-3 p-3 shadow-sm cursor-pointer"
            style={{
              background: STRAPIZZAMI.card,
              border: `1.5px solid ${STRAPIZZAMI.primary}30`,
            }}
          >
            <div
              className="w-24 h-24 rounded-xl overflow-hidden shrink-0"
              style={{ border: `1.5px solid ${STRAPIZZAMI.primary}25` }}
            >
              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 flex flex-col min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <h3
                  className="text-sm font-bold leading-tight flex-1"
                  style={{ color: STRAPIZZAMI.text, fontFamily: STRAPIZZAMI.fontBody }}
                >
                  {item.name}
                </h3>
                <span
                  className="text-sm font-bold shrink-0"
                  style={{ color: STRAPIZZAMI.text, fontFamily: STRAPIZZAMI.fontBody }}
                >
                  €{item.price.toFixed(2).replace(".", ",")}
                </span>
              </div>
              <p
                className="text-[0.7rem] leading-snug line-clamp-2 mb-2 flex-1"
                style={{ color: STRAPIZZAMI.textMuted }}
              >
                {item.description}
              </p>
              <button
                onClick={e => { e.stopPropagation(); onAdd(item); }}
                className="self-end px-4 py-1.5 rounded-full text-xs font-bold flex items-center gap-1.5"
                style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card }}
              >
                ADD TO CART <Plus className="w-3.5 h-3.5" strokeWidth={3} />
              </button>
            </div>
          </article>
        ))}
      </div>

      <StrapizzamiBottomNav active="menu" onChange={onNavigate} showOffers />
    </div>
  );
}
