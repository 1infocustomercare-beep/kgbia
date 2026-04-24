import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Clock, Sparkles, Crown, MapPin, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";

/**
 * Quick-search suggestion shape.
 * Every suggestion routes the user into the same real search pipeline
 * (handleSearch) — no fake data, no placeholder routing.
 */
export interface QuickSuggestion {
  city: string;
  sector: string;
  sectorLabel: string;
  specializationLabel?: string;
  specializationQuery?: string;
  emoji: string;
  color: string;
  /** Optional sub-label shown under the title (e.g. "ultima ricerca · 2h fa") */
  subLabel?: string;
  source: "recent" | "smart" | "premium";
}

interface Props {
  /** Currently chosen sector in the search bar — used to bias smart suggestions */
  currentSector: string;
  /** Currently chosen specialization (sub-sector) — used to bias smart suggestions */
  currentSpecialization?: { label: string; query: string } | null;
  /** Fired when user taps a chip. Parent must trigger the actual search. */
  onPick: (s: QuickSuggestion) => void;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Real curated catalogues — only used for SMART + PREMIUM rows.
 * RECENT row is ALWAYS pulled from the DB (zero fake data).
 * ──────────────────────────────────────────────────────────────────────────── */

const SECTOR_VISUAL: Record<string, { emoji: string; color: string }> = {
  food: { emoji: "🍽️", color: "#ef4444" },
  beauty: { emoji: "💇", color: "#ec4899" },
  ncc: { emoji: "🚖", color: "#f59e0b" },
  healthcare: { emoji: "🩺", color: "#06b6d4" },
  fitness: { emoji: "💪", color: "#22c55e" },
  hospitality: { emoji: "🏨", color: "#a855f7" },
  beach: { emoji: "🏖️", color: "#0ea5e9" },
  retail: { emoji: "🛍️", color: "#f43f5e" },
  veterinary: { emoji: "🐾", color: "#84cc16" },
  plumber: { emoji: "🔧", color: "#3b82f6" },
  electrician: { emoji: "⚡", color: "#facc15" },
  construction: { emoji: "🏗️", color: "#f97316" },
  gardening: { emoji: "🌿", color: "#10b981" },
  garage: { emoji: "🚗", color: "#64748b" },
  events: { emoji: "💒", color: "#d946ef" },
  photography: { emoji: "📸", color: "#8b5cf6" },
  legal: { emoji: "⚖️", color: "#475569" },
  accounting: { emoji: "📊", color: "#0891b2" },
  cleaning: { emoji: "🧼", color: "#14b8a6" },
  agriturismo: { emoji: "🌾", color: "#a16207" },
  tattoo: { emoji: "🎨", color: "#7c3aed" },
  childcare: { emoji: "👶", color: "#fb923c" },
  education: { emoji: "🎓", color: "#6366f1" },
  logistics: { emoji: "📦", color: "#94a3b8" },
};

/** Top Italian cities by sector — based on real market density.
 *  Each entry maps to an existing SECTOR_OPTIONS value. */
const TOP_IT_CITIES_BY_SECTOR: Record<string, { city: string; specLabel?: string; specQuery?: string }[]> = {
  food: [
    { city: "Milano", specLabel: "Ristorante gourmet", specQuery: "ristorante gourmet" },
    { city: "Roma", specLabel: "Trattoria romana", specQuery: "trattoria osteria" },
    { city: "Napoli", specLabel: "Pizzeria tradizionale", specQuery: "pizzeria" },
    { city: "Torino", specLabel: "Bistrot", specQuery: "bistrot brunch" },
    { city: "Firenze", specLabel: "Steakhouse", specQuery: "steakhouse" },
    { city: "Bologna", specLabel: "Tagliere & enoteca", specQuery: "enoteca wine bar" },
  ],
  beauty: [
    { city: "Milano", specLabel: "Salone hair luxury", specQuery: "parrucchiere" },
    { city: "Roma", specLabel: "Centro estetico", specQuery: "centro estetico" },
    { city: "Napoli", specLabel: "Nail salon", specQuery: "nail salon" },
    { city: "Torino", specLabel: "Barber shop", specQuery: "barber shop" },
    { city: "Bologna", specLabel: "Lash bar", specQuery: "sopracciglia ciglia" },
  ],
  ncc: [
    { city: "Milano", specLabel: "Transfer aeroporto", specQuery: "transfer aeroporto" },
    { city: "Roma", specLabel: "Tour privati", specQuery: "tour privato ncc" },
    { city: "Amalfi", specLabel: "Wedding car", specQuery: "ncc matrimoni wedding" },
    { city: "Napoli", specLabel: "Limousine luxury", specQuery: "limousine luxury" },
    { city: "Portofino", specLabel: "Yacht charter", specQuery: "yacht charter" },
  ],
  healthcare: [
    { city: "Milano", specLabel: "Studio dentistico", specQuery: "dentista" },
    { city: "Roma", specLabel: "Medicina estetica", specQuery: "medicina estetica" },
    { city: "Torino", specLabel: "Dermatologia", specQuery: "dermatologo" },
    { city: "Bologna", specLabel: "Poliambulatorio", specQuery: "poliambulatorio" },
  ],
  fitness: [
    { city: "Milano", specLabel: "Crossfit box", specQuery: "crossfit" },
    { city: "Roma", specLabel: "Padel club", specQuery: "padel tennis" },
    { city: "Torino", specLabel: "Yoga studio", specQuery: "yoga studio" },
    { city: "Bologna", specLabel: "Palestra premium", specQuery: "palestra" },
  ],
  hospitality: [
    { city: "Milano", specLabel: "Boutique hotel", specQuery: "boutique hotel" },
    { city: "Roma", specLabel: "Hotel 4-5 stelle", specQuery: "hotel luxury" },
    { city: "Firenze", specLabel: "Resort & Spa", specQuery: "resort spa" },
    { city: "Venezia", specLabel: "Hotel storico", specQuery: "hotel luxury" },
    { city: "Costiera Amalfitana", specLabel: "Resort luxury", specQuery: "resort spa" },
  ],
  beach: [
    { city: "Rimini", specLabel: "Stabilimento balneare", specQuery: "stabilimento balneare" },
    { city: "Riccione", specLabel: "Beach club", specQuery: "beach club" },
    { city: "Gallipoli", specLabel: "Lido premium", specQuery: "stabilimento balneare" },
    { city: "Forte dei Marmi", specLabel: "Beach lounge", specQuery: "beach club" },
  ],
  retail: [
    { city: "Milano", specLabel: "Boutique abbigliamento", specQuery: "abbigliamento boutique" },
    { city: "Roma", specLabel: "Gioielleria", specQuery: "gioielleria" },
    { city: "Firenze", specLabel: "Concept store", specQuery: "concept store" },
  ],
};

/** Premium foreign markets — high-ticket, English/EU targets only. */
const PREMIUM_MARKETS: { city: string; sector: string; specLabel?: string; specQuery?: string; emoji: string; color: string }[] = [
  { city: "Dubai",     sector: "hospitality", specLabel: "Hotel 5★",          specQuery: "hotel luxury",     emoji: "🏨", color: "#f59e0b" },
  { city: "Miami",     sector: "beauty",      specLabel: "Med-spa luxury",    specQuery: "centro estetico",  emoji: "💎", color: "#ec4899" },
  { city: "Marbella",  sector: "ncc",         specLabel: "Chauffeur luxury",  specQuery: "limousine luxury", emoji: "🚖", color: "#facc15" },
  { city: "London",    sector: "fitness",     specLabel: "Boutique gym",      specQuery: "crossfit",         emoji: "🏋️", color: "#3b82f6" },
  { city: "Monaco",    sector: "hospitality", specLabel: "Boutique hotel",    specQuery: "boutique hotel",   emoji: "👑", color: "#a855f7" },
  { city: "Saint-Tropez", sector: "beach",    specLabel: "Beach club",        specQuery: "beach club",       emoji: "🏖️", color: "#0ea5e9" },
];

/* ────────────────────────────────────────────────────────────────────────────
 * Helpers
 * ──────────────────────────────────────────────────────────────────────────── */

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "ora";
  if (min < 60) return `${min}m fa`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h fa`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}g fa`;
  const w = Math.floor(d / 7);
  return `${w}sett fa`;
}

function sectorVisual(sectorId: string): { emoji: string; color: string } {
  return SECTOR_VISUAL[sectorId] || { emoji: "🏢", color: "#94a3b8" };
}

function sectorLabel(sectorId: string): string {
  return SECTOR_OPTIONS.find(s => s.value === sectorId)?.label || sectorId;
}

/* ────────────────────────────────────────────────────────────────────────────
 * Component
 * ──────────────────────────────────────────────────────────────────────────── */

export default function QuickSearchSuggestions({ currentSector, currentSpecialization, onPick }: Props) {
  const [recents, setRecents] = useState<QuickSuggestion[]>([]);
  const [loadingRecents, setLoadingRecents] = useState(true);
  const [refreshTick, setRefreshTick] = useState(0);

  /* ── 1. RECENT — real DB-backed user search history (deduped by city+sector) ── */
  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoadingRecents(true);
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) { setRecents([]); setLoadingRecents(false); return; }

        const { data, error } = await supabase
          .from("leads")
          .select("city, sector, created_at")
          .eq("owner_id", user.id)
          .not("city", "is", null)
          .not("sector", "is", null)
          .order("created_at", { ascending: false })
          .limit(60);

        if (cancelled) return;
        if (error || !data) { setRecents([]); setLoadingRecents(false); return; }

        const seen = new Set<string>();
        const out: QuickSuggestion[] = [];
        for (const row of data) {
          const city = (row.city || "").trim();
          const sec = (row.sector || "").trim();
          if (!city || !sec) continue;
          const key = `${city.toLowerCase()}|${sec.toLowerCase()}`;
          if (seen.has(key)) continue;
          seen.add(key);
          const v = sectorVisual(sec);
          out.push({
            city,
            sector: sec,
            sectorLabel: sectorLabel(sec),
            emoji: v.emoji,
            color: v.color,
            subLabel: `Riapri · ${timeAgo(row.created_at)}`,
            source: "recent",
          });
          if (out.length >= 4) break;
        }
        setRecents(out);
      } finally {
        if (!cancelled) setLoadingRecents(false);
      }
    })();
    return () => { cancelled = true; };
  }, [refreshTick]);

  /* ── 2. SMART — top IT cities for current sector + chosen specialization ── */
  const smart = useMemo<QuickSuggestion[]>(() => {
    const sector = currentSector || "food";
    const v = sectorVisual(sector);
    const list = TOP_IT_CITIES_BY_SECTOR[sector] || [];
    const out = list.map<QuickSuggestion>((entry) => ({
      city: entry.city,
      sector,
      sectorLabel: sectorLabel(sector),
      // If user already chose a specialization, propagate it; otherwise use the city's curated one.
      specializationLabel: currentSpecialization?.label || entry.specLabel,
      specializationQuery: currentSpecialization?.query || entry.specQuery,
      emoji: v.emoji,
      color: v.color,
      subLabel: currentSpecialization?.label
        ? `${currentSpecialization.label} · ${entry.city}`
        : entry.specLabel
          ? `${entry.specLabel}`
          : `${sectorLabel(sector)} · top mercato`,
      source: "smart",
    }));
    // De-dup against recents (don't show the same city/sector twice).
    const recentKeys = new Set(recents.map(r => `${r.city.toLowerCase()}|${r.sector}`));
    return out.filter(s => !recentKeys.has(`${s.city.toLowerCase()}|${s.sector}`)).slice(0, 4);
  }, [currentSector, currentSpecialization, recents]);

  /* ── 3. PREMIUM — curated foreign luxury markets ── */
  const premium = useMemo<QuickSuggestion[]>(() => {
    return PREMIUM_MARKETS.map<QuickSuggestion>((m) => ({
      city: m.city,
      sector: m.sector,
      sectorLabel: sectorLabel(m.sector),
      specializationLabel: m.specLabel,
      specializationQuery: m.specQuery,
      emoji: m.emoji,
      color: m.color,
      subLabel: `${m.specLabel} · mercato premium`,
      source: "premium",
    })).slice(0, 4);
  }, []);

  /* ── Render ── */
  return (
    <div className="mt-2 max-w-md mx-auto space-y-4 text-xs font-mono font-normal text-left">
      {/* RECENT */}
      <Section
        title="Le tue ultime ricerche"
        icon={<Clock className="w-3 h-3" />}
        accent="#14b8a6"
        action={
          <button
            type="button"
            onClick={() => setRefreshTick(t => t + 1)}
            className="flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider hover:opacity-80"
            style={{ color: "#6b7280" }}
          >
            <RefreshCw className="w-2.5 h-2.5" /> Aggiorna
          </button>
        }
      >
        {loadingRecents ? (
          <div className="flex items-center gap-2 px-3 py-3 rounded-xl"
               style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
            <Loader2 className="w-3 h-3 animate-spin" style={{ color: "#14b8a6" }} />
            <span className="text-[10px]" style={{ color: "#9ca3af" }}>Carico le tue ricerche reali…</span>
          </div>
        ) : recents.length === 0 ? (
          <p className="text-[10px] italic px-3 py-2" style={{ color: "#6b7280" }}>
            Nessuna ricerca ancora. Fai la prima ricerca: apparirà qui per riaprirla con un tap.
          </p>
        ) : (
          <ChipGrid items={recents} onPick={onPick} />
        )}
      </Section>

      {/* SMART */}
      <Section
        title={
          currentSpecialization?.label
            ? `Suggeriti per "${currentSpecialization.label}"`
            : `Suggeriti per ${sectorLabel(currentSector)}`
        }
        icon={<Sparkles className="w-3 h-3" />}
        accent="#a78bfa"
      >
        {smart.length === 0 ? (
          <p className="text-[10px] italic px-3 py-2" style={{ color: "#6b7280" }}>
            Nessun suggerimento per questo settore. Prova a scegliere un sotto-settore dal selettore.
          </p>
        ) : (
          <ChipGrid items={smart} onPick={onPick} />
        )}
      </Section>

      {/* PREMIUM */}
      <Section
        title="Mercati premium internazionali"
        icon={<Crown className="w-3 h-3" />}
        accent="#f59e0b"
      >
        <ChipGrid items={premium} onPick={onPick} />
      </Section>
    </div>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
 * Sub-components
 * ──────────────────────────────────────────────────────────────────────────── */

function Section({
  title, icon, accent, action, children,
}: { title: string; icon: React.ReactNode; accent: string; action?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-2 px-1">
        <div className="flex items-center gap-1.5">
          <span style={{ color: accent }}>{icon}</span>
          <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: accent }}>
            {title}
          </p>
        </div>
        {action}
      </div>
      {children}
    </div>
  );
}

function ChipGrid({ items, onPick }: { items: QuickSuggestion[]; onPick: (s: QuickSuggestion) => void }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((s, i) => (
        <motion.button
          key={`${s.source}-${s.city}-${s.sector}-${i}`}
          type="button"
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02, y: -1 }}
          onClick={() => onPick(s)}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
          style={{
            background: `linear-gradient(135deg, ${s.color}10, ${s.color}04)`,
            border: `1px solid ${s.color}25`,
          }}
        >
          <span className="text-base shrink-0">{s.emoji}</span>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate flex items-center gap-1">
              <MapPin className="w-2.5 h-2.5 shrink-0" style={{ color: s.color }} />
              {s.city}
            </p>
            <p className="text-[8px] truncate" style={{ color: "#9ca3af" }}>
              {s.subLabel || s.sectorLabel}
            </p>
          </div>
        </motion.button>
      ))}
    </div>
  );
}
