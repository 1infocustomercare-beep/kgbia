import { Search, Plus, Anchor } from "lucide-react";
import { useState } from "react";
import { BATEY } from "./theme";
import { BateyBottomNav } from "./BateyBottomNav";

export interface BateyMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  is_popular?: boolean;
  es_label?: string;     // microcopy spagnolo "Pesca del día", "Especialidad"
}

interface Props {
  brandName: string;
  subtitle?: string;
  heroImage: string;
  heroTagline?: string;
  categories: string[];
  items: BateyMenuItem[];
  onAdd: (item: BateyMenuItem) => void;
  onItemClick?: (item: BateyMenuItem) => void;
  onNavigate: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
}

export function BateyHome({
  brandName,
  subtitle = "PESCA DEL DÍA · MARE",
  heroImage,
  heroTagline = "PESCA FRESCA OGNI GIORNO",
  categories,
  items,
  onAdd,
  onItemClick,
  onNavigate,
}: Props) {
  const [activeCat, setActiveCat] = useState<string>(categories[0] || "Tutte");
  const [search, setSearch] = useState("");
  const filtered = items.filter(i => {
    const matchCat = activeCat === "Tutte" || i.category === activeCat;
    const matchSearch = !search || i.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });
  const recommended = filtered.slice(0, 6);

  return (
    <div className="batey-theme min-h-screen pb-24" style={{ background: BATEY.bg }}>
      {/* Top brand */}
      <div
        className="px-4 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3"
        style={{ background: BATEY.bg }}
      >
        <div className="flex flex-col items-center gap-1 mb-3">
          <p
            className="text-[11px] tracking-[0.42em]"
            style={{ color: BATEY.primary, fontFamily: BATEY.fontEs, fontStyle: "italic" }}
          >
            {subtitle}
          </p>
          <h1
            className="text-2xl font-serif-bt"
            style={{
              color: BATEY.text,
              fontFamily: BATEY.fontHead,
              letterSpacing: "0.22em",
            }}
          >
            {brandName.toUpperCase()}
          </h1>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-6 h-px" style={{ background: BATEY.primary }} />
            <Anchor className="w-3 h-3" style={{ color: BATEY.primary }} strokeWidth={1.6} />
            <div className="w-6 h-px" style={{ background: BATEY.primary }} />
          </div>
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-3"
          style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: BATEY.primary }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca branzino, ostriche, crudo…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-50"
            style={{ color: BATEY.text, fontFamily: BATEY.fontBody }}
          />
        </div>
      </div>

      {/* Hero card */}
      <div className="px-4 mt-2">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-xl" style={{ border: `1px solid ${BATEY.divider}` }}>
          <img src={heroImage} alt={heroTagline} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(8,19,31,0.1) 0%, rgba(8,19,31,0.88) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-center">
            <p className="text-[11px] tracking-[0.4em] mb-1" style={{ color: BATEY.primary, fontFamily: BATEY.fontEs, fontStyle: "italic" }}>
              especialidad de la casa
            </p>
            <h2
              className="text-xl font-serif-bt text-white drop-shadow-lg"
              style={{ fontFamily: BATEY.fontHead, letterSpacing: "0.18em" }}
            >
              {heroTagline}
            </h2>
          </div>
        </div>
      </div>

      {/* Category pills */}
      <div className="px-4 mt-4 -mx-4">
        <div className="flex gap-2 overflow-x-auto px-4 pb-2 scrollbar-none">
          {categories.map(cat => {
            const isActive = activeCat === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCat(cat)}
                className="px-5 py-2 rounded-full text-[0.7rem] font-medium uppercase tracking-[0.18em] whitespace-nowrap transition-all shrink-0"
                style={{
                  background: isActive ? BATEY.primary : "transparent",
                  color: isActive ? BATEY.bg : BATEY.textMuted,
                  border: `1px solid ${isActive ? BATEY.primary : BATEY.divider}`,
                  fontFamily: BATEY.fontBody,
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chef's Recommendation */}
      <section className="mt-4 px-4 py-6" style={{ background: BATEY.bgDeep }}>
        <div className="text-center mb-4">
          <p className="text-[11px] tracking-[0.4em] mb-1" style={{ color: BATEY.primary, fontFamily: BATEY.fontEs, fontStyle: "italic" }}>
            recomendación del chef
          </p>
          <h3
            className="text-xl font-serif-bt"
            style={{ color: BATEY.text, fontFamily: BATEY.fontHead, letterSpacing: "0.18em" }}
          >
            CHEF'S SELECTION
          </h3>
          <div className="w-8 h-px mx-auto mt-2" style={{ background: BATEY.primary }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommended.map(item => (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="text-left rounded-2xl overflow-hidden flex flex-col"
              style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
            >
              <div className="aspect-square overflow-hidden relative">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                {item.is_popular && (
                  <span
                    className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-[10px] tracking-[0.18em] uppercase font-medium"
                    style={{ background: BATEY.coral, color: BATEY.bg }}
                  >
                    Popular
                  </span>
                )}
              </div>
              <div className="p-3 flex-1 flex flex-col">
                {item.es_label && (
                  <p className="text-[10px] tracking-[0.32em] mb-1 italic" style={{ color: BATEY.primary, fontFamily: BATEY.fontEs }}>
                    {item.es_label}
                  </p>
                )}
                <h4
                  className="font-serif-bt text-sm leading-tight uppercase mb-1"
                  style={{ color: BATEY.text, fontFamily: BATEY.fontHead, letterSpacing: "0.06em" }}
                >
                  {item.name}
                </h4>
                <p
                  className="text-[11px] leading-snug mb-2 line-clamp-2 flex-1"
                  style={{ color: BATEY.textMuted }}
                >
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="text-sm font-serif-bt"
                    style={{ color: BATEY.sand, fontFamily: BATEY.fontHead }}
                  >
                    € {item.price.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onAdd(item);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: BATEY.primary, color: BATEY.bg }}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <BateyBottomNav active="home" onChange={onNavigate} />
    </div>
  );
}
