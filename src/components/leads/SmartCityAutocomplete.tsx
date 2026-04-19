import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Loader2,
  Sparkles,
  TrendingUp,
  X,
  Search,
  Globe2,
  Check,
  Building2,
  Home,
  Landmark,
  AlertCircle,
} from "lucide-react";

/**
 * SmartCityAutocomplete v2 — selezione intelligente, atomica e validata.
 * - Top città per paese (suggerimenti immediati)
 * - Ricerca live OpenStreetMap (Nominatim) con dati REALI
 * - Selezione ATOMICA: cliccare una città SOSTITUISCE il valore (no concatenazione)
 * - Quartiere/zona opzionale come chip secondario (NON appiccicato al testo)
 * - Conferma visiva con check verde quando città è validata con coordinate reali
 * - Sanitizzazione automatica (rimuove emoji, virgole multiple, spazi extra)
 * - Auto-detect del paese dalla scelta
 */

export interface CitySuggestion {
  name: string;
  display: string;
  region?: string;
  country?: string;
  countryCode?: string;
  lat?: number;
  lon?: number;
  population?: number;
  type?: string;
  importance?: number;
  /** "city" | "town" | "village" | "suburb" | "hamlet" | "neighbourhood" */
  kind?: "city" | "town" | "village" | "suburb" | "hamlet" | "neighbourhood" | "other";
}

interface Props {
  value: string;
  onChange: (city: string, suggestion?: CitySuggestion) => void;
  /** Chiamato quando viene selezionato un quartiere/zona (separato dal nome città) */
  onAreaSelect?: (area: string) => void;
  /** Quartiere attualmente selezionato (mostrato come chip rimovibile) */
  selectedArea?: string;
  countryCode?: string;
  placeholder?: string;
  inputStyle?: React.CSSProperties;
  inputClassName?: string;
  onEnter?: () => void;
  inputRef?: React.RefObject<HTMLInputElement>;
  /** Notifica quando il paese viene auto-rilevato dalla città scelta */
  onCountryDetected?: (countryCode: string) => void;
}

/* ─── Sanitize input: rimuove emoji, virgole multiple, spazi extra ─── */
const sanitize = (s: string): string =>
  s
    // rimuovi tutte le emoji (range Unicode)
    .replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, "")
    // collassa virgole multiple
    .replace(/,+/g, ",")
    // rimuovi spazi prima della virgola
    .replace(/\s+,/g, ",")
    // collassa spazi multipli
    .replace(/\s{2,}/g, " ")
    .trim()
    // rimuovi virgola finale
    .replace(/,\s*$/, "");

/* ─── TOP CITIES per paese ─── */
const TOP_CITIES: Record<string, CitySuggestion[]> = {
  IT: [
    { name: "Roma", display: "Roma, Lazio", region: "Lazio", country: "Italia", countryCode: "IT", population: 2873000, kind: "city" },
    { name: "Milano", display: "Milano, Lombardia", region: "Lombardia", country: "Italia", countryCode: "IT", population: 1396000, kind: "city" },
    { name: "Napoli", display: "Napoli, Campania", region: "Campania", country: "Italia", countryCode: "IT", population: 967000, kind: "city" },
    { name: "Torino", display: "Torino, Piemonte", region: "Piemonte", country: "Italia", countryCode: "IT", population: 870000, kind: "city" },
    { name: "Palermo", display: "Palermo, Sicilia", region: "Sicilia", country: "Italia", countryCode: "IT", population: 657000, kind: "city" },
    { name: "Genova", display: "Genova, Liguria", region: "Liguria", country: "Italia", countryCode: "IT", population: 580000, kind: "city" },
    { name: "Bologna", display: "Bologna, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 388000, kind: "city" },
    { name: "Firenze", display: "Firenze, Toscana", region: "Toscana", country: "Italia", countryCode: "IT", population: 367000, kind: "city" },
    { name: "Bari", display: "Bari, Puglia", region: "Puglia", country: "Italia", countryCode: "IT", population: 316000, kind: "city" },
    { name: "Catania", display: "Catania, Sicilia", region: "Sicilia", country: "Italia", countryCode: "IT", population: 311000, kind: "city" },
    { name: "Verona", display: "Verona, Veneto", region: "Veneto", country: "Italia", countryCode: "IT", population: 257000, kind: "city" },
    { name: "Venezia", display: "Venezia, Veneto", region: "Veneto", country: "Italia", countryCode: "IT", population: 258000, kind: "city" },
    { name: "Padova", display: "Padova, Veneto", region: "Veneto", country: "Italia", countryCode: "IT", population: 210000, kind: "city" },
    { name: "Trieste", display: "Trieste, Friuli-VG", region: "Friuli-VG", country: "Italia", countryCode: "IT", population: 204000, kind: "city" },
    { name: "Brescia", display: "Brescia, Lombardia", region: "Lombardia", country: "Italia", countryCode: "IT", population: 196000, kind: "city" },
    { name: "Parma", display: "Parma, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 198000, kind: "city" },
    { name: "Modena", display: "Modena, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 184000, kind: "city" },
    { name: "Reggio Calabria", display: "Reggio Calabria, Calabria", region: "Calabria", country: "Italia", countryCode: "IT", population: 180000, kind: "city" },
    { name: "Rimini", display: "Rimini, Emilia-Romagna", region: "Emilia-Romagna", country: "Italia", countryCode: "IT", population: 150000, kind: "city" },
    { name: "Salerno", display: "Salerno, Campania", region: "Campania", country: "Italia", countryCode: "IT", population: 132000, kind: "city" },
  ],
  US: [
    { name: "New York", display: "New York, NY", region: "NY", country: "USA", countryCode: "US", population: 8336000, kind: "city" },
    { name: "Los Angeles", display: "Los Angeles, CA", region: "CA", country: "USA", countryCode: "US", population: 3979000, kind: "city" },
    { name: "Chicago", display: "Chicago, IL", region: "IL", country: "USA", countryCode: "US", population: 2693000, kind: "city" },
    { name: "Houston", display: "Houston, TX", region: "TX", country: "USA", countryCode: "US", population: 2320000, kind: "city" },
    { name: "Miami", display: "Miami, FL", region: "FL", country: "USA", countryCode: "US", population: 467000, kind: "city" },
    { name: "San Francisco", display: "San Francisco, CA", region: "CA", country: "USA", countryCode: "US", population: 873000, kind: "city" },
    { name: "Las Vegas", display: "Las Vegas, NV", region: "NV", country: "USA", countryCode: "US", population: 651000, kind: "city" },
    { name: "Boston", display: "Boston, MA", region: "MA", country: "USA", countryCode: "US", population: 692000, kind: "city" },
  ],
  GB: [
    { name: "London", display: "London, England", region: "England", country: "UK", countryCode: "GB", population: 8982000, kind: "city" },
    { name: "Manchester", display: "Manchester, England", region: "England", country: "UK", countryCode: "GB", population: 553000, kind: "city" },
    { name: "Birmingham", display: "Birmingham, England", region: "England", country: "UK", countryCode: "GB", population: 1141000, kind: "city" },
    { name: "Liverpool", display: "Liverpool, England", region: "England", country: "UK", countryCode: "GB", population: 498000, kind: "city" },
    { name: "Edinburgh", display: "Edinburgh, Scotland", region: "Scotland", country: "UK", countryCode: "GB", population: 488000, kind: "city" },
    { name: "Glasgow", display: "Glasgow, Scotland", region: "Scotland", country: "UK", countryCode: "GB", population: 633000, kind: "city" },
  ],
  FR: [
    { name: "Paris", display: "Paris, Île-de-France", region: "Île-de-France", country: "Francia", countryCode: "FR", population: 2161000, kind: "city" },
    { name: "Marseille", display: "Marseille, PACA", region: "PACA", country: "Francia", countryCode: "FR", population: 870000, kind: "city" },
    { name: "Lyon", display: "Lyon, ARA", region: "ARA", country: "Francia", countryCode: "FR", population: 522000, kind: "city" },
    { name: "Nice", display: "Nice, PACA", region: "PACA", country: "Francia", countryCode: "FR", population: 342000, kind: "city" },
    { name: "Toulouse", display: "Toulouse, Occitania", region: "Occitania", country: "Francia", countryCode: "FR", population: 493000, kind: "city" },
    { name: "Bordeaux", display: "Bordeaux, Nouvelle-Aquitaine", region: "Nouvelle-Aquitaine", country: "Francia", countryCode: "FR", population: 257000, kind: "city" },
  ],
  DE: [
    { name: "Berlin", display: "Berlin", region: "Berlin", country: "Germania", countryCode: "DE", population: 3669000, kind: "city" },
    { name: "München", display: "München (Monaco), Bayern", region: "Bayern", country: "Germania", countryCode: "DE", population: 1488000, kind: "city" },
    { name: "Hamburg", display: "Hamburg", region: "Hamburg", country: "Germania", countryCode: "DE", population: 1899000, kind: "city" },
    { name: "Köln", display: "Köln, NRW", region: "NRW", country: "Germania", countryCode: "DE", population: 1086000, kind: "city" },
    { name: "Frankfurt", display: "Frankfurt am Main, Hessen", region: "Hessen", country: "Germania", countryCode: "DE", population: 763000, kind: "city" },
  ],
  ES: [
    { name: "Madrid", display: "Madrid", region: "Madrid", country: "Spagna", countryCode: "ES", population: 3223000, kind: "city" },
    { name: "Barcelona", display: "Barcelona, Catalunya", region: "Catalunya", country: "Spagna", countryCode: "ES", population: 1620000, kind: "city" },
    { name: "Valencia", display: "Valencia", region: "Valencia", country: "Spagna", countryCode: "ES", population: 794000, kind: "city" },
    { name: "Sevilla", display: "Sevilla, Andalucía", region: "Andalucía", country: "Spagna", countryCode: "ES", population: 688000, kind: "city" },
    { name: "Málaga", display: "Málaga, Andalucía", region: "Andalucía", country: "Spagna", countryCode: "ES", population: 574000, kind: "city" },
    { name: "Ibiza", display: "Ibiza, Baleares", region: "Baleares", country: "Spagna", countryCode: "ES", population: 50000, kind: "town" },
  ],
  PT: [
    { name: "Lisboa", display: "Lisboa", region: "Lisboa", country: "Portogallo", countryCode: "PT", population: 504000, kind: "city" },
    { name: "Porto", display: "Porto", region: "Norte", country: "Portogallo", countryCode: "PT", population: 237000, kind: "city" },
    { name: "Faro", display: "Faro, Algarve", region: "Algarve", country: "Portogallo", countryCode: "PT", population: 67000, kind: "city" },
  ],
  CH: [
    { name: "Zürich", display: "Zürich", region: "Zürich", country: "Svizzera", countryCode: "CH", population: 415000, kind: "city" },
    { name: "Genève", display: "Genève", region: "Genève", country: "Svizzera", countryCode: "CH", population: 201000, kind: "city" },
    { name: "Lugano", display: "Lugano, Ticino", region: "Ticino", country: "Svizzera", countryCode: "CH", population: 62000, kind: "city" },
    { name: "Bern", display: "Bern", region: "Bern", country: "Svizzera", countryCode: "CH", population: 134000, kind: "city" },
  ],
  AE: [
    { name: "Dubai", display: "Dubai", region: "Dubai", country: "UAE", countryCode: "AE", population: 3331000, kind: "city" },
    { name: "Abu Dhabi", display: "Abu Dhabi", region: "Abu Dhabi", country: "UAE", countryCode: "AE", population: 1483000, kind: "city" },
    { name: "Sharjah", display: "Sharjah", region: "Sharjah", country: "UAE", countryCode: "AE", population: 1684000, kind: "city" },
  ],
  AU: [
    { name: "Sydney", display: "Sydney, NSW", region: "NSW", country: "Australia", countryCode: "AU", population: 5312000, kind: "city" },
    { name: "Melbourne", display: "Melbourne, VIC", region: "VIC", country: "Australia", countryCode: "AU", population: 5078000, kind: "city" },
    { name: "Brisbane", display: "Brisbane, QLD", region: "QLD", country: "Australia", countryCode: "AU", population: 2560000, kind: "city" },
  ],
  BR: [
    { name: "São Paulo", display: "São Paulo, SP", region: "SP", country: "Brasile", countryCode: "BR", population: 12325000, kind: "city" },
    { name: "Rio de Janeiro", display: "Rio de Janeiro, RJ", region: "RJ", country: "Brasile", countryCode: "BR", population: 6748000, kind: "city" },
    { name: "Brasília", display: "Brasília, DF", region: "DF", country: "Brasile", countryCode: "BR", population: 3055000, kind: "city" },
  ],
  JP: [
    { name: "Tokyo", display: "Tōkyō", region: "Tokyo", country: "Giappone", countryCode: "JP", population: 13960000, kind: "city" },
    { name: "Osaka", display: "Ōsaka", region: "Osaka", country: "Giappone", countryCode: "JP", population: 2691000, kind: "city" },
    { name: "Kyoto", display: "Kyōto", region: "Kyoto", country: "Giappone", countryCode: "JP", population: 1464000, kind: "city" },
  ],
};

/* ─── ZONE/QUARTIERI famosi ─── */
const POPULAR_AREAS: Record<string, string[]> = {
  Roma: ["Trastevere", "Prati", "Parioli", "EUR", "Testaccio", "Monti", "San Giovanni", "Pigneto", "Garbatella"],
  Milano: ["Brera", "Navigli", "Porta Nuova", "Isola", "Città Studi", "Porta Romana", "Sempione", "Lambrate"],
  Napoli: ["Vomero", "Chiaia", "Posillipo", "Centro Storico", "Mergellina", "Spaccanapoli"],
  Firenze: ["Centro Storico", "Oltrarno", "Santa Croce", "San Lorenzo", "San Frediano"],
  Torino: ["Centro", "San Salvario", "Crocetta", "Vanchiglia", "Quadrilatero", "Lingotto"],
  Bologna: ["Centro Storico", "Bolognina", "Murri", "Saragozza", "Santo Stefano"],
  Genova: ["Centro Storico", "Boccadasse", "Nervi", "Albaro", "Quarto"],
  Bari: ["Bari Vecchia", "Murat", "Poggiofranco", "Carrassi"],
  Palermo: ["Centro Storico", "Mondello", "Vucciria", "Kalsa"],
  Verona: ["Centro Storico", "Borgo Trento", "Veronetta"],
  Venezia: ["San Marco", "Cannaregio", "Dorsoduro", "Castello", "Mestre"],
  London: ["Soho", "Camden", "Shoreditch", "Notting Hill", "Mayfair", "Chelsea", "Kensington"],
  Paris: ["Le Marais", "Saint-Germain", "Montmartre", "Champs-Élysées", "Bastille", "Belleville"],
  "New York": ["Manhattan", "Brooklyn", "Queens", "SoHo", "Williamsburg", "Tribeca", "Chelsea"],
  Dubai: ["Downtown", "Marina", "Palm Jumeirah", "JBR", "Business Bay", "DIFC", "Jumeirah"],
  Madrid: ["Salamanca", "Chamberí", "Malasaña", "La Latina", "Chueca"],
  Barcelona: ["Eixample", "Gòtic", "Born", "Gràcia", "Barceloneta"],
  Berlin: ["Mitte", "Kreuzberg", "Prenzlauer Berg", "Friedrichshain", "Charlottenburg"],
};

/* ─── Cache ─── */
const cache = new Map<string, CitySuggestion[]>();

const getKindIcon = (kind?: string) => {
  switch (kind) {
    case "city":
      return Building2;
    case "town":
      return Landmark;
    case "village":
    case "hamlet":
      return Home;
    case "suburb":
    case "neighbourhood":
      return Globe2;
    default:
      return MapPin;
  }
};

const getKindLabel = (kind?: string): string => {
  switch (kind) {
    case "city": return "Città";
    case "town": return "Comune";
    case "village": return "Paese";
    case "hamlet": return "Frazione";
    case "suburb": return "Quartiere";
    case "neighbourhood": return "Zona";
    default: return "Località";
  }
};

const mapNominatimKind = (cls?: string, type?: string): CitySuggestion["kind"] => {
  if (type === "city" || type === "administrative") return "city";
  if (type === "town") return "town";
  if (type === "village") return "village";
  if (type === "suburb") return "suburb";
  if (type === "neighbourhood") return "neighbourhood";
  if (type === "hamlet") return "hamlet";
  return "other";
};

export default function SmartCityAutocomplete({
  value,
  onChange,
  onAreaSelect,
  selectedArea,
  countryCode = "",
  placeholder = "Cerca città, paese, zona...",
  inputStyle,
  inputClassName,
  onEnter,
  inputRef,
  onCountryDetected,
}: Props) {
  const [open, setOpen] = useState(false);
  const [suggestions, setSuggestions] = useState<CitySuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [highlight, setHighlight] = useState(0);
  const [validated, setValidated] = useState<CitySuggestion | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const localInputRef = useRef<HTMLInputElement>(null);
  const ref = inputRef ?? localInputRef;

  const topForCountry = countryCode && TOP_CITIES[countryCode] ? TOP_CITIES[countryCode] : [];
  const allTop = useMemo(
    () =>
      countryCode
        ? topForCountry
        : Object.values(TOP_CITIES).flat().sort((a, b) => (b.population || 0) - (a.population || 0)).slice(0, 12),
    [countryCode, topForCountry]
  );

  /* Quartieri per la città confermata */
  const areasForCity = useMemo(() => {
    const key = validated?.name || value?.split(",")[0]?.trim() || "";
    return POPULAR_AREAS[key] || [];
  }, [validated, value]);

  /* Reset validazione quando l'utente modifica il testo manualmente */
  useEffect(() => {
    if (validated && value !== validated.name) {
      setValidated(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  /* Click outside */
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* Fetch debounced */
  const fetchSuggestions = useCallback(
    async (q: string) => {
      const trimmed = sanitize(q);
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
          limit: "10",
          "accept-language": "it",
        });
        if (countryCode) params.set("countrycodes", countryCode.toLowerCase());
        const r = await fetch(`https://nominatim.openstreetmap.org/search?${params}`, {
          headers: { "Accept-Language": "it" },
        });
        const data = await r.json();
        const mapped: CitySuggestion[] = (data || [])
          .filter((d: any) => {
            const cls = d.class || "";
            const typ = d.type || "";
            return (
              cls === "place" ||
              cls === "boundary" ||
              ["city", "town", "village", "administrative", "suburb", "neighbourhood", "hamlet", "municipality"].includes(typ)
            );
          })
          .map((d: any) => {
            const a = d.address || {};
            const cityName =
              a.city || a.town || a.village || a.municipality || a.suburb || a.neighbourhood || a.hamlet || d.name || "";
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
              kind: mapNominatimKind(d.class, d.type),
            } as CitySuggestion;
          })
          .filter((s: CitySuggestion) => s.name);

        // Dedupe per nome+regione+kind, mantieni il più "importante"
        const map = new Map<string, CitySuggestion>();
        for (const s of mapped) {
          const k = `${s.name.toLowerCase()}|${(s.region || "").toLowerCase()}|${s.kind}`;
          const existing = map.get(k);
          if (!existing || (s.importance || 0) > (existing.importance || 0)) {
            map.set(k, s);
          }
        }
        const unique = Array.from(map.values()).sort((a, b) => {
          // Cities prima, poi per importanza
          const order = { city: 0, town: 1, village: 2, suburb: 3, neighbourhood: 4, hamlet: 5, other: 6 };
          const oa = order[a.kind ?? "other"];
          const ob = order[b.kind ?? "other"];
          if (oa !== ob) return oa - ob;
          return (b.importance || 0) - (a.importance || 0);
        });

        cache.set(cacheKey, unique);
        setSuggestions(unique);
      } catch (e) {
        console.warn("[SmartCityAutocomplete] fetch error", e);
        setSuggestions([]);
      } finally {
        setLoading(false);
      }
    },
    [countryCode]
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!open) return;
    if (sanitize(value).length < 2) {
      setSuggestions([]);
      setLoading(false);
      return;
    }
    debounceRef.current = setTimeout(() => fetchSuggestions(value), 280);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [value, open, fetchSuggestions]);

  /* SELEZIONE ATOMICA: sostituisce il valore, non concatena */
  const handlePick = (s: CitySuggestion) => {
    const cleanName = sanitize(s.name);
    onChange(cleanName, s);
    setValidated(s);
    setOpen(false);
    setHighlight(0);
    if (s.countryCode && s.countryCode !== countryCode) {
      onCountryDetected?.(s.countryCode);
    }
  };

  const handleAreaPick = (area: string) => {
    onAreaSelect?.(area);
    setOpen(false);
  };

  const handleClearArea = () => {
    onAreaSelect?.("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const list = sanitize(value).length < 2 ? allTop : suggestions;
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

  const handleInputChange = (raw: string) => {
    // Sanitize live: no emoji, no virgole multiple
    const clean = raw.replace(/[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{1F1E6}-\u{1F1FF}]/gu, "");
    onChange(clean);
    setOpen(true);
    setHighlight(0);
  };

  const showTop = open && sanitize(value).length < 2;
  const showResults = open && sanitize(value).length >= 2;
  const list = showTop ? allTop : suggestions;
  const isValidated = !!validated && validated.name === value;

  return (
    <div ref={containerRef} className="relative">
      {/* Icona stato (verde se validata) */}
      {isValidated ? (
        <Check
          className="absolute left-3 bottom-3 w-3.5 h-3.5 z-10 pointer-events-none"
          style={{ color: "#10b981" }}
        />
      ) : (
        <MapPin
          className="absolute left-3 bottom-3 w-3.5 h-3.5 z-10 pointer-events-none"
          style={{ color: value && !isValidated ? "#f59e0b" : "#14b8a6" }}
        />
      )}
      <input
        ref={ref}
        value={value}
        onChange={(e) => handleInputChange(e.target.value)}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        className={inputClassName ?? "w-full pl-9 pr-9 py-3 rounded-xl text-[11px] text-white placeholder:text-gray-500 outline-none"}
        style={{
          ...inputStyle,
          ...(isValidated ? { borderColor: "rgba(16,185,129,0.4)" } : {}),
        }}
        autoComplete="off"
        spellCheck={false}
      />
      {loading && (
        <Loader2 className="absolute right-3 bottom-3 w-3.5 h-3.5 animate-spin" style={{ color: "#14b8a6" }} />
      )}
      {!loading && value && (
        <button
          type="button"
          onClick={() => {
            onChange("");
            setValidated(null);
            onAreaSelect?.("");
            setOpen(true);
            ref.current?.focus();
          }}
          className="absolute right-3 bottom-3 p-0.5 rounded hover:bg-white/10"
          aria-label="Cancella"
        >
          <X className="w-3 h-3" style={{ color: "#6b7280" }} />
        </button>
      )}

      {/* Chip quartiere selezionato sotto l'input */}
      {selectedArea && (
        <div className="mt-1.5 flex items-center gap-1.5 flex-wrap">
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-[9px] font-bold"
            style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd" }}
          >
            <Globe2 className="w-2.5 h-2.5" />
            <span>Zona: {selectedArea}</span>
            <button onClick={handleClearArea} className="ml-1 hover:text-white" aria-label="Rimuovi zona">
              <X className="w-2.5 h-2.5" />
            </button>
          </div>
        </div>
      )}

      {/* Hint validazione */}
      {value && !isValidated && !open && (
        <div className="mt-1 flex items-center gap-1 px-1">
          <AlertCircle className="w-2.5 h-2.5" style={{ color: "#f59e0b" }} />
          <span className="text-[8px]" style={{ color: "#f59e0b" }}>
            Seleziona dalla lista per confermare la località
          </span>
        </div>
      )}
      {isValidated && validated && !open && (
        <div className="mt-1 flex items-center gap-1 px-1">
          <Check className="w-2.5 h-2.5" style={{ color: "#10b981" }} />
          <span className="text-[8px]" style={{ color: "#10b981" }}>
            ✓ {getKindLabel(validated.kind)} confermata · {validated.region || validated.country}
            {validated.lat && validated.lon && (
              <span className="ml-1 opacity-60">
                ({validated.lat.toFixed(3)}, {validated.lon.toFixed(3)})
              </span>
            )}
          </span>
        </div>
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
                <span className="text-[10px]" style={{ color: "#9ca3af" }}>
                  Ricerca live su OpenStreetMap…
                </span>
              </div>
            )}

            {showResults && !loading && suggestions.length === 0 && sanitize(value).length >= 2 && (
              <div className="px-3 py-4 text-center">
                <Search className="w-4 h-4 mx-auto mb-1" style={{ color: "#6b7280" }} />
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                  Nessuna località trovata per "{sanitize(value)}"
                </p>
                <p className="text-[8px] mt-1" style={{ color: "#6b7280" }}>
                  Prova un nome diverso, rimuovi accenti o cambia paese
                </p>
                {countryCode && (
                  <button
                    onClick={() => {
                      // Re-trigger search senza countryCode
                      cache.clear();
                      fetchSuggestions(value);
                    }}
                    className="mt-2 text-[9px] font-bold px-2 py-1 rounded-md"
                    style={{ background: "rgba(20,184,166,0.15)", color: "#5eead4" }}
                  >
                    🌍 Cerca in tutto il mondo
                  </button>
                )}
              </div>
            )}

            {list.length > 0 && (
              <div>
                {list.map((s, i) => {
                  const KindIcon = getKindIcon(s.kind);
                  return (
                    <button
                      key={`${s.name}-${s.region}-${s.kind}-${i}`}
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
                          <KindIcon className="w-3.5 h-3.5" style={{ color: "#06b6d4" }} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[11px] font-bold text-white truncate">{s.name}</span>
                          <span
                            className="text-[7px] font-bold px-1 py-0.5 rounded uppercase tracking-wider"
                            style={{
                              background: "rgba(6,182,212,0.10)",
                              color: "#67e8f9",
                            }}
                          >
                            {getKindLabel(s.kind)}
                          </span>
                          {s.countryCode && (
                            <span
                              className="text-[8px] font-bold px-1 py-0.5 rounded"
                              style={{ background: "rgba(255,255,255,0.06)", color: "#9ca3af" }}
                            >
                              {s.countryCode}
                            </span>
                          )}
                        </div>
                        <p className="text-[9px] truncate" style={{ color: "#9ca3af" }}>
                          {s.region ? `${s.region}` : ""}
                          {s.region && s.country ? " · " : ""}
                          {s.country || ""}
                        </p>
                      </div>
                      {s.population && s.population > 50000 && (
                        <span
                          className="text-[8px] font-bold shrink-0 px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(20,184,166,0.12)", color: "#5eead4" }}
                        >
                          {s.population >= 1000000 ? `${(s.population / 1000000).toFixed(1)}M` : `${Math.round(s.population / 1000)}k`}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}

            {/* Quartieri popolari per la città validata */}
            {areasForCity.length > 0 && (showResults || isValidated) && (
              <div className="border-t border-white/5">
                <div className="px-3 py-1.5 flex items-center gap-1.5">
                  <Globe2 className="w-3 h-3" style={{ color: "#a78bfa" }} />
                  <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: "#c4b5fd" }}>
                    Zone popolari di {validated?.name || value.split(",")[0].trim()}
                  </span>
                  <span className="ml-auto text-[8px]" style={{ color: "#6b7280" }}>
                    facoltativo
                  </span>
                </div>
                <div className="px-2 pb-2 flex flex-wrap gap-1">
                  {areasForCity.map((area) => (
                    <button
                      key={area}
                      type="button"
                      onClick={() => handleAreaPick(area)}
                      className="text-[9px] font-bold px-2 py-1 rounded-md transition-all"
                      style={{
                        background: selectedArea === area ? "rgba(167,139,250,0.30)" : "rgba(167,139,250,0.10)",
                        border: `1px solid ${selectedArea === area ? "rgba(167,139,250,0.6)" : "rgba(167,139,250,0.25)"}`,
                        color: "#c4b5fd",
                      }}
                    >
                      {area}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="px-3 py-1.5 border-t border-white/5 flex items-center justify-between">
              <span className="text-[8px]" style={{ color: "#6b7280" }}>
                ↑↓ naviga · Enter seleziona · Esc chiudi
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
