import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ChevronDown, Tag, Layers, Sparkles, X as XIcon, CheckCircle2 } from "lucide-react";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";

/**
 * Sub-settori reali per ogni settore principale.
 * Ogni voce è una "keyword chirurgica" che il backend (lead-search / Overpass / Google Places)
 * usa per affinare la query e migliorare il match con la preview iPhone giusta.
 */
const SUB_SECTORS: Record<string, { label: string; query: string; emoji?: string }[]> = {
  food: [
    { label: "Pizzeria tradizionale", query: "pizzeria", emoji: "🍕" },
    { label: "Pizzeria gourmet/luxury", query: "pizzeria gourmet", emoji: "🍕" },
    { label: "Sushi / Giapponese", query: "sushi", emoji: "🍣" },
    { label: "Pesce / Seafood", query: "ristorante pesce", emoji: "🐟" },
    { label: "Steakhouse / Carne", query: "steakhouse", emoji: "🥩" },
    { label: "Trattoria / Osteria", query: "trattoria osteria", emoji: "🍝" },
    { label: "Hamburgeria / Burger", query: "hamburger burger", emoji: "🍔" },
    { label: "Bistrot / Brunch", query: "bistrot brunch", emoji: "🥐" },
    { label: "Poke / Healthy bowl", query: "poke bowl", emoji: "🥗" },
    { label: "Ramen / Asian", query: "ramen asian", emoji: "🍜" },
    { label: "Kebab / Street food", query: "kebab", emoji: "🥙" },
    { label: "Enoteca / Wine bar", query: "enoteca wine bar", emoji: "🍷" },
    { label: "Pasticceria / Bakery", query: "pasticceria", emoji: "🧁" },
    { label: "Gelateria", query: "gelateria", emoji: "🍦" },
    { label: "Caffè / Bar", query: "caffè bar", emoji: "☕" },
  ],
  beauty: [
    { label: "Parrucchiere donna", query: "parrucchiere", emoji: "💇‍♀️" },
    { label: "Barber shop / Uomo", query: "barber shop", emoji: "💈" },
    { label: "Nail salon / Manicure", query: "nail salon", emoji: "💅" },
    { label: "Centro estetico", query: "centro estetico", emoji: "✨" },
    { label: "Make-up artist", query: "make up artist", emoji: "💄" },
    { label: "Sopracciglia / Lash bar", query: "sopracciglia ciglia", emoji: "👁️" },
    { label: "Tatuaggi / Piercing", query: "tatuaggi piercing", emoji: "🎨" },
    { label: "Solarium / Abbronzatura", query: "solarium", emoji: "☀️" },
  ],
  ncc: [
    { label: "Yacht / Luxury boat", query: "yacht charter", emoji: "🛥️" },
    { label: "Limousine / Black car", query: "limousine luxury", emoji: "🚖" },
    { label: "Transfer aeroporto", query: "transfer aeroporto", emoji: "✈️" },
    { label: "Tour privati", query: "tour privato ncc", emoji: "🗺️" },
    { label: "Wedding car", query: "ncc matrimoni wedding", emoji: "💒" },
    { label: "Minibus / Gruppi", query: "ncc minibus", emoji: "🚐" },
  ],
  healthcare: [
    { label: "Studio dentistico", query: "dentista", emoji: "🦷" },
    { label: "Cardiologia", query: "cardiologo", emoji: "❤️" },
    { label: "Dermatologia", query: "dermatologo", emoji: "🧴" },
    { label: "Pediatra", query: "pediatra", emoji: "👶" },
    { label: "Ginecologia", query: "ginecologo", emoji: "🌸" },
    { label: "Oculista", query: "oculista", emoji: "👁️" },
    { label: "Poliambulatorio", query: "poliambulatorio", emoji: "🏥" },
    { label: "Medicina estetica", query: "medicina estetica", emoji: "💉" },
  ],
  fitness: [
    { label: "Palestra / Gym", query: "palestra", emoji: "💪" },
    { label: "Crossfit box", query: "crossfit", emoji: "🏋️" },
    { label: "Yoga studio", query: "yoga studio", emoji: "🧘" },
    { label: "Pilates", query: "pilates", emoji: "🤸" },
    { label: "Padel / Tennis club", query: "padel tennis", emoji: "🎾" },
    { label: "Personal trainer", query: "personal trainer studio", emoji: "🏃" },
    { label: "Piscina / Nuoto", query: "piscina", emoji: "🏊" },
  ],
  hospitality: [
    { label: "Hotel 4-5 stelle", query: "hotel luxury", emoji: "🏨" },
    { label: "B&B / Guest house", query: "bed and breakfast", emoji: "🛏️" },
    { label: "Resort / Spa", query: "resort spa", emoji: "🌴" },
    { label: "Boutique hotel", query: "boutique hotel", emoji: "🏛️" },
    { label: "Agriturismo", query: "agriturismo", emoji: "🌾" },
  ],
  beach: [
    { label: "Stabilimento balneare", query: "stabilimento balneare", emoji: "🏖️" },
    { label: "Beach club / Lounge", query: "beach club", emoji: "🍹" },
    { label: "Noleggio attrezzatura", query: "noleggio sup kayak", emoji: "🏄" },
    { label: "Scuola surf/vela", query: "scuola surf vela", emoji: "🏄‍♂️" },
  ],
  retail: [
    { label: "Abbigliamento", query: "abbigliamento boutique", emoji: "👗" },
    { label: "Calzature / Scarpe", query: "scarpe calzature", emoji: "👟" },
    { label: "Gioielleria", query: "gioielleria", emoji: "💎" },
    { label: "Ottica / Occhiali", query: "ottica", emoji: "👓" },
    { label: "Profumeria", query: "profumeria", emoji: "🌸" },
    { label: "Concept store", query: "concept store", emoji: "🛍️" },
  ],
  veterinary: [
    { label: "Clinica veterinaria", query: "clinica veterinaria", emoji: "🐾" },
    { label: "Toelettatura", query: "toelettatura cani", emoji: "🐶" },
    { label: "Pet shop", query: "pet shop", emoji: "🐱" },
    { label: "Pensione animali", query: "pensione cani gatti", emoji: "🏡" },
  ],
  plumber: [
    { label: "Idraulico residenziale", query: "idraulico", emoji: "🔧" },
    { label: "Caldaie / Climatizzazione", query: "caldaie climatizzatori", emoji: "🔥" },
    { label: "Pronto intervento 24h", query: "idraulico 24h", emoji: "🚨" },
  ],
  electrician: [
    { label: "Elettricista civile", query: "elettricista", emoji: "⚡" },
    { label: "Domotica / Smart home", query: "domotica smart home", emoji: "🏠" },
    { label: "Fotovoltaico", query: "fotovoltaico", emoji: "☀️" },
  ],
  construction: [
    { label: "Ristrutturazioni", query: "ristrutturazioni", emoji: "🔨" },
    { label: "Impresa edile", query: "impresa edile", emoji: "🏗️" },
    { label: "Cartongesso", query: "cartongesso", emoji: "🧱" },
  ],
  gardening: [
    { label: "Giardiniere", query: "giardiniere", emoji: "🌿" },
    { label: "Progettazione verde", query: "architetto paesaggista", emoji: "🌳" },
    { label: "Piscine outdoor", query: "piscine giardino", emoji: "🏊‍♀️" },
  ],
  garage: [
    { label: "Autofficina", query: "autofficina meccanico", emoji: "🔩" },
    { label: "Carrozzeria", query: "carrozzeria", emoji: "🚗" },
    { label: "Gommista", query: "gommista", emoji: "🛞" },
    { label: "Elettrauto", query: "elettrauto", emoji: "🔋" },
  ],
  events: [
    { label: "Wedding planner", query: "wedding planner", emoji: "💒" },
    { label: "Catering eventi", query: "catering eventi", emoji: "🍽️" },
    { label: "Fotografo eventi", query: "fotografo matrimoni", emoji: "📸" },
    { label: "Location matrimoni", query: "location matrimoni", emoji: "🏰" },
  ],
  photography: [
    { label: "Studio fotografico", query: "studio fotografico", emoji: "📸" },
    { label: "Video produzione", query: "video produzione", emoji: "🎥" },
    { label: "Fotografo matrimoni", query: "fotografo matrimoni", emoji: "💐" },
  ],
  legal: [
    { label: "Avvocato civilista", query: "avvocato civile", emoji: "⚖️" },
    { label: "Avvocato penalista", query: "avvocato penale", emoji: "🛡️" },
    { label: "Notaio", query: "notaio", emoji: "📜" },
  ],
  accounting: [
    { label: "Commercialista", query: "commercialista", emoji: "📊" },
    { label: "CAF / Patronato", query: "caf patronato", emoji: "📋" },
    { label: "Consulente del lavoro", query: "consulente del lavoro", emoji: "💼" },
  ],
  cleaning: [
    { label: "Pulizie civili", query: "impresa pulizie", emoji: "🧹" },
    { label: "Sanificazione", query: "sanificazione", emoji: "🧼" },
    { label: "Pulizie industriali", query: "pulizie industriali", emoji: "🏭" },
  ],
  agriturismo: [
    { label: "Agriturismo classico", query: "agriturismo", emoji: "🌾" },
    { label: "Cantina / Wine resort", query: "cantina wine resort", emoji: "🍇" },
    { label: "Fattoria didattica", query: "fattoria didattica", emoji: "🐄" },
  ],
  tattoo: [
    { label: "Studio tatuaggi", query: "tattoo studio", emoji: "🎨" },
    { label: "Piercing studio", query: "piercing studio", emoji: "💎" },
  ],
  childcare: [
    { label: "Asilo nido", query: "asilo nido", emoji: "👶" },
    { label: "Scuola materna", query: "scuola materna", emoji: "🧸" },
    { label: "Doposcuola", query: "doposcuola", emoji: "📚" },
  ],
  education: [
    { label: "Scuola di lingue", query: "scuola lingue", emoji: "🗣️" },
    { label: "Corsi professionali", query: "corsi formazione", emoji: "🎓" },
    { label: "Ripetizioni / Tutor", query: "ripetizioni tutor", emoji: "📖" },
  ],
  logistics: [
    { label: "Corriere / Spedizioni", query: "corriere spedizioni", emoji: "📦" },
    { label: "Traslochi", query: "traslochi", emoji: "🚚" },
  ],
};

interface Suggestion {
  type: "sector" | "sub";
  sectorId: string;
  sectorLabel: string;
  label: string;
  query?: string;
  emoji?: string;
}

interface Props {
  sectorValue: string;
  onSectorChange: (sectorId: string) => void;
  queryValue: string;
  onQueryChange: (q: string) => void;
  inputStyle?: React.CSSProperties;
  onEnter?: () => void;
}

export default function SmartSectorAutocomplete({
  sectorValue,
  onSectorChange,
  queryValue,
  onQueryChange,
  inputStyle,
  onEnter,
}: Props) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [highlightIdx, setHighlightIdx] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);

  // Click-outside
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  // Build suggestion list (sectors + all sub-sectors flat) filtered by search
  const suggestions = useMemo<Suggestion[]>(() => {
    const term = search.trim().toLowerCase();
    const list: Suggestion[] = [];

    // 1. Sectors
    for (const s of SECTOR_OPTIONS) {
      if (s.value === "altro") continue;
      list.push({
        type: "sector",
        sectorId: s.value,
        sectorLabel: s.label,
        label: s.label,
      });
    }

    // 2. Sub-sectors
    for (const [sid, subs] of Object.entries(SUB_SECTORS)) {
      const sectorOpt = SECTOR_OPTIONS.find(o => o.value === sid);
      if (!sectorOpt) continue;
      for (const sub of subs) {
        list.push({
          type: "sub",
          sectorId: sid,
          sectorLabel: sectorOpt.label,
          label: sub.label,
          query: sub.query,
          emoji: sub.emoji,
        });
      }
    }

    if (!term) {
      // Default: show current sector's sub-sectors first, then other sectors
      const currentSubs = list.filter(x => x.sectorId === sectorValue);
      const otherSectors = list.filter(x => x.type === "sector" && x.sectorId !== sectorValue);
      return [...currentSubs, ...otherSectors].slice(0, 40);
    }

    return list
      .filter(x =>
        x.label.toLowerCase().includes(term) ||
        x.sectorLabel.toLowerCase().includes(term) ||
        (x.query || "").toLowerCase().includes(term)
      )
      .slice(0, 30);
  }, [search, sectorValue]);

  const currentSectorLabel = SECTOR_OPTIONS.find(s => s.value === sectorValue)?.label || "Seleziona settore";
  const hasSubQuery = !!queryValue && Object.values(SUB_SECTORS).flat().some(s => s.query === queryValue);

  const handlePick = (s: Suggestion) => {
    onSectorChange(s.sectorId);
    if (s.type === "sub" && s.query) {
      onQueryChange(s.query);
    } else {
      // Picking a sector clears any sub-query
      onQueryChange("");
    }
    setOpen(false);
    setSearch("");
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") { e.preventDefault(); setHighlightIdx(i => Math.min(i + 1, suggestions.length - 1)); }
    else if (e.key === "ArrowUp") { e.preventDefault(); setHighlightIdx(i => Math.max(i - 1, 0)); }
    else if (e.key === "Enter") {
      e.preventDefault();
      if (open && suggestions[highlightIdx]) handlePick(suggestions[highlightIdx]);
      else { setOpen(false); onEnter?.(); }
    }
    else if (e.key === "Escape") setOpen(false);
  };

  return (
    <div ref={wrapRef} className="relative">
      {/* Trigger / display */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        className="w-full px-3 py-3 rounded-xl text-[11px] text-white outline-none flex items-center justify-between gap-2"
        style={inputStyle}
      >
        <span className="flex items-center gap-2 min-w-0 flex-1">
          <Layers className="w-3.5 h-3.5 shrink-0" style={{ color: "#14b8a6" }} />
          <span className="truncate text-left">
            <span className="font-bold">{currentSectorLabel}</span>
            {hasSubQuery && (
              <span className="ml-1.5 text-[10px]" style={{ color: "#5eead4" }}>
                · {queryValue}
              </span>
            )}
          </span>
        </span>
        <div className="flex items-center gap-1 shrink-0">
          {hasSubQuery && (
            <span
              role="button"
              onClick={(e) => { e.stopPropagation(); onQueryChange(""); }}
              className="p-0.5 rounded hover:bg-white/10"
              style={{ color: "#9ca3af" }}
            >
              <XIcon className="w-3 h-3" />
            </span>
          )}
          <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} style={{ color: "#6b7280" }} />
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 rounded-xl overflow-hidden"
            style={{
              background: "rgba(15, 23, 42, 0.98)",
              border: "1px solid rgba(20,184,166,0.25)",
              boxShadow: "0 20px 60px -10px rgba(0,0,0,0.6)",
              backdropFilter: "blur(20px)",
            }}
          >
            {/* Search */}
            <div className="p-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
              <div className="relative">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
                <input
                  autoFocus
                  value={search}
                  onChange={(e) => { setSearch(e.target.value); setHighlightIdx(0); }}
                  onKeyDown={handleKeyDown}
                  placeholder="Cerca settore o specializzazione (es. pizzeria, yacht, dentista)..."
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
              </div>
              <p className="text-[9px] mt-1.5 pl-1 flex items-center gap-1" style={{ color: "#6b7280" }}>
                <Sparkles className="w-2.5 h-2.5" style={{ color: "#14b8a6" }} />
                Scegli una specializzazione per ricerche più precise e demo migliori
              </p>
            </div>

            {/* Suggestions */}
            <div className="max-h-72 overflow-y-auto py-1">
              {suggestions.length === 0 ? (
                <p className="text-[10px] text-center py-4" style={{ color: "#6b7280" }}>
                  Nessun risultato. Prova con un'altra parola chiave.
                </p>
              ) : (
                suggestions.map((s, i) => {
                  const isActive = i === highlightIdx;
                  const isSelected = s.sectorId === sectorValue && (
                    (s.type === "sector" && !hasSubQuery) ||
                    (s.type === "sub" && s.query === queryValue)
                  );
                  return (
                    <button
                      key={`${s.type}-${s.sectorId}-${s.label}`}
                      onClick={() => handlePick(s)}
                      onMouseEnter={() => setHighlightIdx(i)}
                      className="w-full text-left px-3 py-2 flex items-center gap-2 transition-colors"
                      style={{
                        background: isActive ? "rgba(20,184,166,0.1)" : "transparent",
                        borderLeft: isSelected ? "2px solid #14b8a6" : "2px solid transparent",
                      }}
                    >
                      <span className="text-base shrink-0 w-5 text-center">
                        {s.emoji || (s.type === "sector" ? "🏢" : "•")}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-[11px] font-semibold text-white truncate">{s.label}</p>
                        {s.type === "sub" && (
                          <p className="text-[9px] truncate" style={{ color: "#6b7280" }}>
                            {s.sectorLabel} · query: <span style={{ color: "#5eead4" }}>{s.query}</span>
                          </p>
                        )}
                        {s.type === "sector" && (
                          <p className="text-[9px]" style={{ color: "#6b7280" }}>
                            Settore principale · {SUB_SECTORS[s.sectorId]?.length || 0} specializzazioni
                          </p>
                        )}
                      </div>
                      {s.type === "sub" ? (
                        <Tag className="w-3 h-3 shrink-0" style={{ color: "#5eead4" }} />
                      ) : (
                        <Layers className="w-3 h-3 shrink-0" style={{ color: "#94a3b8" }} />
                      )}
                      {isSelected && <CheckCircle2 className="w-3 h-3 shrink-0" style={{ color: "#14b8a6" }} />}
                    </button>
                  );
                })
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
