import { Search, Plus } from "lucide-react";
import { useState } from "react";
import { PAPERFISH } from "./theme";
import { PaperfishBottomNav } from "./PaperfishBottomNav";

export interface PaperfishMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  is_popular?: boolean;
  jp_label?: string;
}

interface Props {
  brandName: string;
  subtitle?: string;
  heroImage: string;
  heroTagline?: string;
  categories: string[];
  items: PaperfishMenuItem[];
  onAdd: (item: PaperfishMenuItem) => void;
  onItemClick?: (item: PaperfishMenuItem) => void;
  onNavigate: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
}

export function PaperfishHome({
  brandName,
  subtitle = "寿司 · 刺身",
  heroImage,
  heroTagline = "OMAKASE EXPERIENCE",
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
    <div className="paperfish-theme min-h-screen pb-24" style={{ background: PAPERFISH.bg }}>
      {/* Top brand */}
      <div
        className="px-4 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3"
        style={{ background: PAPERFISH.bg }}
      >
        <div className="flex flex-col items-center gap-1 mb-3">
          <p
            className="text-[0.6rem] tracking-[0.42em]"
            style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}
          >
            {subtitle}
          </p>
          <h1
            className="text-2xl font-serif-pf"
            style={{
              color: PAPERFISH.text,
              fontFamily: PAPERFISH.fontHead,
              letterSpacing: "0.22em",
            }}
          >
            {brandName.toUpperCase()}
          </h1>
          <div className="w-10 h-px mt-1" style={{ background: PAPERFISH.primary }} />
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-3"
          style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
        >
          <Search className="w-4 h-4 shrink-0" style={{ color: PAPERFISH.primary }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca sushi, sashimi, ramen…"
            className="flex-1 bg-transparent outline-none text-sm placeholder:opacity-50"
            style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontBody }}
          />
        </div>
      </div>

      {/* Hero card */}
      <div className="px-4 mt-2">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-xl" style={{ border: `1px solid ${PAPERFISH.divider}` }}>
          <img src={heroImage} alt={heroTagline} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(0,0,0,0.1) 0%, rgba(14,11,15,0.85) 100%)" }} />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-center">
            <p className="text-[0.6rem] tracking-[0.4em] mb-1" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
              料理長おすすめ
            </p>
            <h2
              className="text-xl font-serif-pf text-white drop-shadow-lg"
              style={{ fontFamily: PAPERFISH.fontHead, letterSpacing: "0.18em" }}
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

      {/* Chef's Recommendation */}
      <section className="mt-4 px-4 py-6" style={{ background: PAPERFISH.bgDeep }}>
        <div className="text-center mb-4">
          <p className="text-[0.6rem] tracking-[0.4em] mb-1" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
            シェフのおすすめ
          </p>
          <h3
            className="text-xl font-serif-pf"
            style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.18em" }}
          >
            CHEF'S SELECTION
          </h3>
          <div className="w-8 h-px mx-auto mt-2" style={{ background: PAPERFISH.primary }} />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {recommended.map(item => (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="text-left rounded-2xl overflow-hidden flex flex-col"
              style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
            >
              <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                {item.jp_label && (
                  <p className="text-[0.55rem] tracking-[0.32em] mb-1" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
                    {item.jp_label}
                  </p>
                )}
                <h4
                  className="font-serif-pf text-sm leading-tight uppercase mb-1"
                  style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.06em" }}
                >
                  {item.name}
                </h4>
                <p
                  className="text-[0.65rem] leading-snug mb-2 line-clamp-2 flex-1"
                  style={{ color: PAPERFISH.textMuted }}
                >
                  {item.description}
                </p>
                <div className="flex items-center justify-between mt-1">
                  <span
                    className="text-sm font-serif-pf"
                    style={{ color: PAPERFISH.gold, fontFamily: PAPERFISH.fontHead }}
                  >
                    € {item.price.toFixed(2).replace(".", ",")}
                  </span>
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onAdd(item);
                    }}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: PAPERFISH.primary, color: PAPERFISH.bg }}
                  >
                    <Plus className="w-3.5 h-3.5" strokeWidth={3} />
                  </button>
                </div>
              </div>
            </button>
          ))}
        </div>
      </section>

      <PaperfishBottomNav active="home" onChange={onNavigate} />
    </div>
  );
}
