import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Loader2, Sparkles, TrendingUp, X, Search, Globe2 } from "lucide-react";

/**
 * Suggerimenti città intelligente — usa Nominatim (OpenStreetMap) per dati REALI 100% gratuiti.
 * Features:
 * - Top città per paese (suggerimenti immediati anche senza scrivere)
 * - Ricerca fuzzy live mentre l'utente digita (debounced 300ms)
 * - Mostra: nome città, regione/provincia, paese, popolazione (quando disponibile)
 * - Cache per evitare chiamate ripetute
 * - Gestione errori e stato vuoto
 */

export interface CitySuggestion {
  name: string;          // "Roma"
  display: string;       // "Roma, Lazio, Italia"
  region?: string;       // "Lazio"
  country?: string;      // "Italia"
  countryCode?: string;  // "IT"
  lat?: number;
  lon?: number;
  population?: number;
  type?: string;         // "city" | "town" | "village"
  importance?: number;   // 0..1 da Nominatim
}

interface Props {
  value: string;
  onChange: (city: string, suggestion?: CitySuggestion) => void;
  countryCode?: string;       // filtra per paese (ISO2). Vuoto = ovunque
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
  onEnter?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
}

/* ─── TOP CITIES per paese (mostrati immediatamente) ─── */
const TOP_CITIES: Record<string, CitySuggestion[]> = {
  IT: [
    { name: "Roma", display: "Roma, Lazio", region: "Lazio", country: "Italia", countryCode: "IT", population: 2873000 },
    { name: "Milano", display: "Milano, Lombardia", region: "Lombardia", country: "Italia", countryCode: "IT", population: 1396000 },
    { name: "Napoli", display: "Napoli, Campania", region: "Campania", country: "Italia", countryCode: "IT", population: 967000 },
    { name: "Torino", display: "Torino, Piemonte", region: "Piemonte", country: "Italia", countryCode: "IT", population: 870000 },
    { name: "Palermo", display: "Palermo, Sicilia", region: "Sicilia", country: "Italia", countryCode: "IT", population: 657000 },
    { name: "Genova", display: "Genova, Liguria", region: "Liguria", country: "Italia", countryCode: "IT", population: 580000 },
    { name: "Bologna", display: "Bologna, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 388000 },
    { name: "Firenze", display: "Firenze, Toscana", region: "Toscana", country: "Italia", countryCode: "IT", population: 367000 },
    { name: "Bari", display: "Bari, Puglia", region: "Puglia", country: "Italia", countryCode: "IT", population: 316000 },
    { name: "Catania", display: "Catania, Sicilia", region: "Sicilia", country: "Italia", countryCode: "IT", population: 311000 },
    { name: "Verona", display: "Verona, Veneto", region: "Veneto", country: "Italia", countryCode: "IT", population: 257000 },
    { name: "Venezia", display: "Venezia, Veneto", region: "Veneto", country: "Italia", countryCode: "IT", population: 258000 },
    { name: "Padova", display: "Padova, Veneto", region: "Veneto", country: "Italia", countryCode: "IT", population: 210000 },
    { name: "Trieste", display: "Trieste, Friuli-Venezia Giulia", region: "Friuli-VG", country: "Italia", countryCode: "IT", population: 204000 },
    { name: "Brescia", display: "Brescia, Lombardia", region: "Lombardia", country: "Italia", countryCode: "IT", population: 196000 },
    { name: "Parma", display: "Parma, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 198000 },
    { name: "Modena", display: "Modena, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 184000 },
    { name: "Reggio Calabria", display: "Reggio Calabria, Calabria", region: "Calabria", country: "Italia", countryCode: "IT", population: 180000 },
    { name: "Rimini", display: "Rimini, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 150000 },
    { name: "Salerno", display: "Salerno, Campania", region: "Campania", country: "Italia", countryCode: "IT", population: 132000 },
  ],
  US: [
    { name: "New York", display: "New York, NY", region: "NY", country: "USA", countryCode: "US", population: 8336000 },
    { name: "Los Angeles", display: "Los Angeles, CA", region: "CA", country: "USA", countryCode: "US", population: 3979000 },
    { name: "Chicago", display: "Chicago, IL", region: "IL", country: "USA", countryCode: "US", population: 2693000 },
    { name: "Houston", display: "Houston, TX", region: "TX", country: "USA", countryCode: "US", population: 2320000 },
    { name: "Miami", display: "Miami, FL", region: "FL", country: "USA", countryCode: "US", population: 467000 },
    { name: "San Francisco", display: "San Francisco, CA", region: "CA", country: "USA", countryCode: "US", population: 873000 },
    { name: "Las Vegas", display: "Las Vegas, NV", region: "NV", country: "USA", countryCode: "US", population: 651000 },
    { name: "Boston", display: "Boston, MA", region: "MA", country: "USA", countryCode: "US", population: 692000 },
  ],
  GB: [
    { name: "London", display: "London, England", region: "England", country: "UK", countryCode: "GB", population: 8982000 },
    { name: "Manchester", display: "Manchester, England", region: "England", country: "UK", countryCode: "GB", population: 553000 },
    { name: "Birmingham", display: "Birmingham, England", region: "England", country: "UK", countryCode: "GB", population: 1141000 },
    { name: "Liverpool", display: "Liverpool, England", region: "England", country: "UK", countryCode: "GB", population: 498000 },
    { name: "Edinburgh", display: "Edinburgh, Scotland", region: "Scotland", country: "UK", countryCode: "GB", population: 488000 },
    { name: "Glasgow", display: "Glasgow, Scotland", region: "Scotland", country: "UK", countryCode: "GB", population: 633000 },
  ],
  FR: [
    { name: "Paris", display: "Paris, Île-de-France", region: "Île-de-France", country: "Francia", countryCode: "FR", population: 2161000 },
    { name: "Marseille", display: "Marseille, PACA", region: "PACA", country: "Francia", countryCode: "FR", population: 870000 },
    { name: "Lyon", display: "Lyon, Auvergne-Rhône-Alpes", region: "ARA", country: "Francia", countryCode: "FR", population: 522000 },
    { name: "Nice", display: "Nice, PACA", region: "PACA", country: "Francia", countryCode: "FR", population: 342000 },
    { name: "Toulouse", display: "Toulouse, Occitania", region: "Occitania", country: "Francia", countryCode: "FR", population: 493000 },
    { name: "Bordeaux", display: "Bordeaux, Nouvelle-Aquitaine", region: "Nouvelle-Aquitaine", country: "Francia", countryCode: "FR", population: 257000 },
  ],
  DE: [
    { name: "Berlin", display: "Berlin", region: "Berlin", country: "Germania", countryCode: "DE", population: 3669000 },
    { name: "Monaco", display: "München (Monaco), Bayern", region: "Bayern", country: "Germania", countryCode: "DE", population: 1488000 },
    { name: "Amburgo", display: "Hamburg, Hamburg", region: "Hamburg", country: "Germania", countryCode: "DE", population: 1899000 },
    { name: "Colonia", display: "Köln, NRW", region: "NRW", country: "Germania", countryCode: "DE", population: 1086000 },
    { name: "Francoforte", display: "Frankfurt am Main, Hessen", region: "Hessen", country: "Germania", countryCode: "DE", population: 763000 },
  ],
  ES: [
    { name: "Madrid", display: "Madrid", region: "Madrid", country: "Spagna", countryCode: "ES", population: 3223000 },
    { name: "Barcellona", display: "Barcelona, Catalunya", region: "Catalunya", country: "Spagna", countryCode: "ES", population: 1620000 },
    { name: "Valencia", display: "Valencia, Comunitat Valenciana", region: "Valencia", country: "Spagna", countryCode: "ES", population: 794000 },
    { name: "Siviglia", display: "Sevilla, Andalucía", region: "Andalucía", country: "Spagna", countryCode: "ES", population: 688000 },
    { name: "Malaga", display: "Málaga, Andalucía", region: "Andalucía", country: "Spagna", countryCode: "ES", population: 574000 },
    { name: "Ibiza", display: "Ibiza, Islas Baleares", region: "Baleares", country: "Spagna", countryCode: "ES", population: 50000 },
  ],
  PT: [
    { name: "Lisbona", display: "Lisboa", region: "Lisboa", country: "Portogallo", countryCode: "PT", population: 504000 },
    { name: "Porto", display: "Porto", region: "Norte", country: "Portogallo", countryCode: "PT", population: 237000 },
    { name: "Faro", display: "Faro, Algarve", region: "Algarve", country: "Portogallo", countryCode: "PT", population: 67000 },
  ],
  CH: [
    { name: "Zurigo", display: "Zürich", region: "Zürich", country: "Svizzera", countryCode: "CH", population: 415000 },
    { name: "Ginevra", display: "Genève", region: "Genève", country: "Svizzera", countryCode: "CH", population: 201000 },
    { name: "Lugano", display: "Lugano, Ticino", region: "Ticino", country: "Svizzera", countryCode: "CH", population: 62000 },
    { name: "Berna", display: "Bern", region: "Bern", country: "Svizzera", countryCode: "CH", population: 134000 },
  ],
  AE: [
    { name: "Dubai", display: "Dubai", region: "Dubai", country: "UAE", countryCode: "AE", population: 3331000 },
    { name: "Abu Dhabi", display: "Abu Dhabi", region: "Abu Dhabi", country: "UAE", countryCode: "AE", population: 1483000 },
    { name: "Sharjah", display: "Sharjah", region: "Sharjah", country: "UAE", countryCode: "AE", population: 1684000 },
  ],
  AU: [
    { name: "Sydney", display: "Sydney, NSW", region: "NSW", country: "Australia", countryCode: "AU", population: 5312000 },
    { name: "Melbourne", display: "Melbourne, VIC", region: "VIC", country: "Australia", countryCode: "AU", population: 5078000 },
    { name: "Brisbane", display: "Brisbane, QLD", region: "QLD", country: "Australia", countryCode: "AU", population: 2560000 },
  ],
  BR: [
    { name: "São Paulo", display: "São Paulo, SP", region: "SP", country: "Brasile", countryCode: "BR", population: 12325000 },
    { name: "Rio de Janeiro", display: "Rio de Janeiro, RJ", region: "RJ", country: "Brasile", countryCode: "BR", population: 6748000 },
    { name: "Brasília", display: "Brasília, DF", region: "DF", country: "Brasile", countryCode: "BR", population: 3055000 },
  ],
  JP: [
    { name: "Tokyo", display: "Tōkyō", region: "Tokyo", country: "Giappone", countryCode: "JP", population: 13960000 },
    { name: "Osaka", display: "Ōsaka", region: "Osaka", country: "Giappone", countryCode: "JP", population: 2691000 },
    { name: "Kyoto", display: "Kyōto", region: "Kyoto", country: "Giappone", countryCode: "JP", population: 1464000 },
  ],
};

/* ─── ZONE/QUARTIERI famosi (suggerimenti se l'utente sta già su una città) ─── */
const POPULAR_AREAS: Record<string, string[]> = {
  Roma: ["Trastevere", "Prati", "Parioli", "EUR", "Testaccio", "Monti", "San Giovanni"],
  Milano: ["Brera", "Navigli", "Porta Nuova", "Isola", "Città Studi", "Porta Romana", "Sempione"],
  Napoli: ["Vomero", "Chiaia", "Posillipo", "Centro Storico", "Mergellina"],
  Firenze: ["Centro Storico", "Oltrarno", "Santa Croce", "San Lorenzo"],
  Torino: ["Centro", "San Salvario", "Crocetta", "Vanchiglia"],
  Bologna: ["Centro Storico", "Bolognina", "Murri", "Saragozza"],
  Milan: ["Brera", "Navigli", "Porta Nuova"],
  London: ["Soho", "Camden", "Shoreditch", "Notting Hill", "Mayfair", "Chelsea"],
  Paris: ["Le Marais", "Saint-Germain", "Montmartre", "Champs-Élysées", "Bastille"],
  "New York": ["Manhattan", "Brooklyn", "Queens", "SoHo", "Williamsburg", "Tribeca"],
  Dubai: ["Downtown", "Marina", "Palm Jumeirah", "JBR", "Business Bay", "DIFC"],
};

/* ─── CACHE in-memory ─── */
const cache = new Map<string, CitySuggestion[]>();

export default function SmartCityAutocomplete({
  value,
  onChange,
  countryCode = "",
  placeholder = "Cerca città, paese, zona...",
  inputStyle,
  inputClassName,
  onEnter,
  inputRef,
}: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localInputRef;

  /* Top suggerimenti per paese (mostrati a focus se input vuoto) */
  const topForCountry = countryCode && TOP_CITIES[countryCode] ? TOP_CITIES[countryCode] : [];
  const allTop = countryCode
    ? topForCountry
    : Object.values(TOP_CITIES).flat().sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 12);

  /* Aree/quartieri se la città corrisponde */
  const areasForCity = POPULAR_AREAS[value] || POPULAR_AREAS[value?.split(",")[0]?.trim()] || [];

  /* Chiusura cliccando fuori */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Debounced fetch da Nominatim */
  const fetchSuggestions = useCallback(async (q: string) => {
    const trimmed = q.trim();
    if (trimmed.length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    const cacheKey = `${countryCode}|${trimmed.toLowerCase()}`;
    if (cache.has(cacheKey)) {
      setSuggestions(cache.get(cacheKey)!);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: trimmed,
        format: "json",
        addressdetails: "1",
        limit: "8",
        "accept-language": "it",
        featuretype: "city",
      });
      if (countryCode) params.set("countrycodes", countryCode.toLowerCase());
      const r = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      const data = await r.json();
      const mapped: CitySuggestion[] = (data || [])
        .filter((d: any) => {
          const cls = d.class || "";
          const typ = d.type || "";
          return cls === "place" || cls === "boundary" || ["city", "town", "village", "administrative", "suburb", "neighbourhood", "hamlet"].includes(typ);
        })
        .map((d: any) => {
          const a = d.address || {};
          const cityName = a.city || a.town || a.village || a.municipality || a.suburb || a.neighbourhood || a.hamlet || d.name || "";
          const region = a.state || a.region || a.county || "";
          const country = a.country || "";
          const cc = (a.country_code || "").toUpperCase();
          const display = [cityName, region, country].filter(Boolean).join(", ");
          return {
            name: cityName,
            display,
            region,
            country,
            countryCode: cc,
            lat: parseFloat(d.lat),
            lon: parseFloat(d.lon),
            type: d.type,
            importance: d.importance,
          };
        })
        .filter((s: CitySuggestion) => s.name);

      // Dedupe per nome+regione
      const seen = new Set<string>();
      const unique = mapped.filter((s) => {
        const k = `${s.name}|${s.region}`;
        if (seen.has(k)) return false;
        seen.add(k);
        return true;
      });

      cache.set(cacheKey, unique);
      setSuggestions(unique);
    } catch (e) {
      console.warn("[SmartCityAutocomplete] fetch error", e);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  }, [countryCode]);

  /* Trigger su value change */
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!open) return;
    if (value.trim().length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [value, open, fetchSuggestions]);

  const handlePick = (s: CitySuggestion) => {
    onChange(s.name, s);
    setOpen(false);
    setHighlight(0);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = value.trim().length < 2 ? allTop : suggestions;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setHighlight((h) => Math.min(h + 1, list.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlight((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (open && list[highlight]) {
        e.preventDefault();
        handlePick(list[highlight]);
      } else {
        onEnter?.();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const showTop = open && value.trim().length < 2;
  const showResults = open && value.trim().length >= 2;
  const list = showTop ? allTop : suggestions;

  return (
    <div ref={containerRef} className="relative">
      <MapPin className="absolute left-3 bottom-3 w-3.5 h-3.5 z-10 pointer-events-none" style={{ color: "#14b8a6" }} />
      <input
        ref={ref}
        value={value}
        onChange={(e) => { onChange(e.target.value); setOpen(true); setHighlight(0); }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName ?? "w-full pl-9 pr-9 py-3 rounded-xl text-[11px] text-white placeholder:text-gray-500 outline-none"}
        style={inputStyle}
        autoComplete="off"
      />
      {loading && (
        <Loader2 className="absolute right-3 bottom-3 w-3.5 h-3.5 animate-spin" style={{ color: "#14b8a6" }} />
      )}
      {!loading && value && (
        <button
          type="button"
          onClick={() => { onChange(""); setOpen(true); ref.current?.focus(); }}
          className="absolute right-3 bottom-3 p-0.5 rounded hover:bg-white/10"
          aria-label="Cancella"
        >
          <X className="w-3 h-3" style={{ color: "#6b7280" }} />
        </button>
      )}

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.12 }}
            className="absolute left-0 right-0 mt-1 rounded-xl overflow-hidden z-50 max-h-[60vh] overflow-y-auto"
            style={{
              background: "rgba(10, 14, 24, 0.98)",
              backdropFilter: "blur(20px)",
              border: "1px solid rgba(20,184,166,0.25)",
              boxShadow: "0 12px 40px rgba(0,0,0,0.6)",
            }}
          >
            {/* Header con suggerimento */}
            {showTop && (
              <div className="px-3 py-2 flex items-center gap-1.5 border-b border-white/5">
                <Sparkles className="w-3 h-3" style={{ color: "#14b8a6" }} />
                <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#5eead4" }}>
                  {countryCode ? `Top città ${countryCode}` : "Città più popolari"}
                </span>
                <span className="ml-auto text-[8px]" style={{ color: "#6b7280" }}>
                  inizia a scrivere per cercare ovunque
                </span>
              </div>
            )}

            {showResults && loading && (
              <div className="px-3 py-3 flex items-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#14b8a6" }} />
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>Ricerca su OpenStreetMap...</span>
              </div>
            )}

            {showResults && !loading && suggestions.length === 0 && value.trim().length >= 2 && (
              <div className="px-3 py-3 text-center">
                <Search className="w-4 h-4 mx-auto mb-1" style={{ color: "#6b7280" }} />
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>Nessuna città trovata per "{value}"</p>
                <p className="text-[8px] mt-0.5" style={{ color: "#6b7280" }}>Prova un nome diverso o cambia paese</p>
              </div>
            )}

            {/* Lista risultati */}
            {list.length > 0 && (
              <div>
                {list.map((s, i) => (
                  <button
                    key={`${s.name}-${s.region}-${i}`}
                    type="button"
                    onClick={() => handlePick(s)}
                    onMouseEnter={() => setHighlight(i)}
                    className="w-full text-left px-3 py-2.5 flex items-start gap-2 transition-colors"
                    style={{
                      background: highlight === i ? "rgba(20,184,166,0.10)" : "transparent",
                      borderLeft: `2px solid ${highlight === i ? "#14b8a6" : "transparent"}`,
                    }}
                  >
                    <div className="mt-0.5 shrink-0">
                      {showTop ? (
                        <TrendingUp className="w-3.5 h-3.5" style={{ color: "#14b8a6" }} />
                      ) : (
                        <MapPin className="w-3.5 h-3.5" style={{ color: "#06b6d4" }} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[11px] font-bold text-white truncate">{s.name}</span>
                        {s.countryCode && (
                          <span className="text-[8px] font-bold px-1 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}>
                            {s.countryCode}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] truncate" style={{ color: "#9ca3af" }}>
                        {s.region ? `${s.region}` : ""}{s.region && s.country ? " · " : ""}{s.country || ""}
                      </p>
                    </div>
                    {s.population && s.population > 50000 && (
                      <span className="text-[8px] font-bold shrink-0 px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.12)", color: "#5eead4" }}>
                        {s.population >= 1000000 ? `${(s.population / 1000000).toFixed(1)}M` : `${Math.round(s.population / 1000)}k`}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Quartieri/aree popolari per la città attuale */}
            {areasForCity.length > 0 && showResults && (
              <div className="border-t border-white/5">
                <div className="px-3 py-1.5 flex items-center gap-1.5">
                  <Globe2 className="w-3 h-3" style={{ color: "#a78bfa" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#c4b5fd" }}>
                    Zone popolari di {value}
                  </span>
                </div>
                <div className="px-2 pb-2 flex flex-wrap gap-1">
                  {areasForCity.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => { onChange(`${value}, ${area}`); setOpen(false); }}
                      className="text-[9px] font-bold px-2 py-1 rounded-md transition-all"
                      style={{
                        background: "rgba(167,139,250,0.10)",
                        border: "1px solid rgba(167,139,250,0.25)",
                        color: "#c4b5fd",
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Footer */}
            <div className="px-3 py-1.5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px]" style={{ color: "#6b7280" }}>
                ↑↓ naviga · Enter seleziona
              </span>
              <span className="text-[8px] font-bold" style={{ color: "#14b8a6" }}>
                🌍 OpenStreetMap · Real data
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
