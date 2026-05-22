import { Search, Flame, Plus } from "lucide-react";
import { useState } from "react";
import { STRAPIZZAMI } from "./theme";
import { StrapizzamiBottomNav } from "./StrapizzamiBottomNav";

export interface StrapizzamiMenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: string;
  is_popular?: boolean;
}

interface Props {
  brandName: string;
  subtitle?: string;
  heroImage: string;
  heroTagline?: string;
  categories: string[];
  items: StrapizzamiMenuItem[];
  onAdd: (item: StrapizzamiMenuItem) => void;
  onItemClick?: (item: StrapizzamiMenuItem) => void;
  onNavigate: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
}

export function StrapizzamiHome({
  brandName,
  subtitle,
  heroImage,
  heroTagline = "LA VERA PIZZA NAPOLETANA",
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
    <div className="strapizzami-theme min-h-screen pb-24" style={{ background: STRAPIZZAMI.bg }}>
      {/* Top brand */}
      <div
        className="px-4 pt-[max(env(safe-area-inset-top),1.25rem)] pb-3"
        style={{ background: STRAPIZZAMI.bg }}
      >
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="w-9 h-9" />
          <div className="flex flex-col items-center">
            <h1
              className="text-2xl font-serif-strap"
              style={{
                color: STRAPIZZAMI.primary,
                fontFamily: STRAPIZZAMI.fontHead,
                letterSpacing: "0.06em",
              }}
            >
              {brandName.toUpperCase()}
            </h1>
            {subtitle && (
              <p className="text-[11px] mt-0.5" style={{ color: STRAPIZZAMI.textMuted }}>
                {subtitle}
              </p>
            )}
          </div>
          <Flame className="w-7 h-7" style={{ color: STRAPIZZAMI.primary }} />
        </div>

        {/* Search bar */}
        <div
          className="flex items-center gap-2 rounded-full px-4 py-3"
          style={{ background: STRAPIZZAMI.cardSoft, border: `1px solid ${STRAPIZZAMI.divider}` }}
        >
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca la tua pizza preferita…"
            className="flex-1 bg-transparent outline-none text-sm"
            style={{ color: STRAPIZZAMI.text, fontFamily: STRAPIZZAMI.fontBody }}
          />
          <Search className="w-4 h-4 shrink-0" style={{ color: STRAPIZZAMI.primary }} />
        </div>
      </div>

      {/* Hero card */}
      <div className="px-4 mt-2">
        <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md">
          <img src={heroImage} alt={heroTagline} className="absolute inset-0 w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 px-4 pb-4 text-center">
            <h2
              className="text-xl font-serif-strap text-white drop-shadow-lg"
              style={{ fontFamily: STRAPIZZAMI.fontHead, letterSpacing: "0.04em" }}
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
                className="px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all shrink-0"
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

      {/* I Nostri Consigli — sezione su sfondo scuro legno */}
      <section className="mt-4 px-4 py-6" style={{ background: STRAPIZZAMI.bgWood }}>
        <h3
          className="text-center text-xl font-serif-strap mb-4"
          style={{
            color: STRAPIZZAMI.bg,
            fontFamily: STRAPIZZAMI.fontHead,
            letterSpacing: "0.08em",
          }}
        >
          I NOSTRI CONSIGLI
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {recommended.map(item => (
            <button
              key={item.id}
              onClick={() => onItemClick?.(item)}
              className="text-left rounded-2xl overflow-hidden shadow-md flex flex-col"
              style={{ background: STRAPIZZAMI.card }}
            >
              <div className="aspect-square overflow-hidden">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="p-3 flex-1 flex flex-col">
                <h4
                  className="font-serif-strap text-sm leading-tight uppercase mb-1"
                  style={{ color: STRAPIZZAMI.text, fontFamily: STRAPIZZAMI.fontHead }}
                >
                  {item.name}
                </h4>
                <p
                  className="text-[11px] leading-snug mb-2 line-clamp-2 flex-1"
                  style={{ color: STRAPIZZAMI.textMuted }}
                >
                  {item.description}
                </p>
                <div
                  className="inline-flex self-start px-2.5 py-1 rounded-md text-[0.7rem] font-bold mb-2"
                  style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card }}
                >
                  €&nbsp;{item.price.toFixed(2).replace(".", ",")}
                </div>
                <button
                  onClick={e => {
                    e.stopPropagation();
                    onAdd(item);
                  }}
                  className="w-full py-2 rounded-full text-xs font-bold flex items-center justify-center gap-1"
                  style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card }}
                >
                  Aggiungi <Plus className="w-3 h-3" strokeWidth={3} />
                </button>
              </div>
            </button>
          ))}
        </div>
      </section>

      <StrapizzamiBottomNav active="home" onChange={onNavigate} />
    </div>
  );
}
