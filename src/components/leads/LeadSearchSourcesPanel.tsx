import { useEffect, useMemo, useState } from "react";
import { Lock, Sparkles, ExternalLink, X, Check, RefreshCw, Info, AlertTriangle, Zap, ShieldCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════
   LEAD SEARCH SOURCES PANEL — v2 con legenda + fallback coerente
   ───────────────────────────────────────────────────────────────────
   - Legenda chiara (Attivo / Disponibile / Da sbloccare)
   - Per categoria: contatore "X attivi su Y" + warning se vuota
   - Banner fallback: se tutta una categoria è bloccata o vuota,
     mostriamo quale fonte gratuita verrà usata al suo posto per
     evitare risultati incompleti.
   ═══════════════════════════════════════════════════════════════════ */

export type SourceCategory = "maps" | "web" | "social" | "registry";

export interface LeadSource {
  id: string;
  label: string;
  category: SourceCategory;
  desc: string;
  /** Nome esatto della env var richiesta (deve combaciare con check-api-status). */
  requiresApi?: string;
  /** Provider name mostrato nella guida (es. "Google Cloud Console"). */
  apiProvider?: string;
  /** Link diretto alla pagina dove ottenere la chiave. */
  apiHowTo?: string;
}

export const ALL_LEAD_SOURCES: LeadSource[] = [
  // 🗺️ MAPPE
  { id: "nominatim", label: "🗺️ OpenStreetMap", category: "maps", desc: "DB pubblico mondiale, gratis" },
  { id: "photon", label: "🔎 Photon", category: "maps", desc: "Geocoder Komoot, gratis" },
  { id: "overpass", label: "🏷️ Overpass", category: "maps", desc: "Tag strutturati OSM, gratis" },
  { id: "google", label: "⭐ Google Places", category: "maps", desc: "Rating + recensioni reali",
    requiresApi: "GOOGLE_PLACES_API", apiProvider: "Google Cloud Console",
    apiHowTo: "https://console.cloud.google.com/apis/library/places-backend.googleapis.com" },
  { id: "google_maps", label: "📍 Google Maps", category: "maps", desc: "Ricerca testuale + dettagli POI",
    requiresApi: "GOOGLE_PLACES_API", apiProvider: "Google Cloud Console",
    apiHowTo: "https://console.cloud.google.com/apis/library/places-backend.googleapis.com" },
  { id: "bing_maps", label: "🅱️ Bing Maps", category: "maps", desc: "Microsoft, copertura globale",
    requiresApi: "BING_MAPS_API_KEY", apiProvider: "Bing Maps Dev Center",
    apiHowTo: "https://www.bingmapsportal.com/" },
  { id: "yelp", label: "🍽️ Yelp", category: "maps", desc: "Recensioni F&B / servizi",
    requiresApi: "YELP_API_KEY", apiProvider: "Yelp Developers",
    apiHowTo: "https://docs.developer.yelp.com/" },
  { id: "tripadvisor", label: "🧳 TripAdvisor", category: "maps", desc: "Hospitality / turismo",
    requiresApi: "TRIPADVISOR_API_KEY", apiProvider: "TripAdvisor Content API",
    apiHowTo: "https://www.tripadvisor.com/developers" },

  // 🌐 WEB
  { id: "google_web", label: "🔍 Google Web", category: "web", desc: "Ricerca testuale con SerpAPI",
    requiresApi: "SERPAPI_KEY", apiProvider: "SerpAPI",
    apiHowTo: "https://serpapi.com/manage-api-key" },
  { id: "bing_web", label: "🅱️ Bing Web", category: "web", desc: "Microsoft Web Search, free tier",
    requiresApi: "BING_SEARCH_API_KEY", apiProvider: "Azure Cognitive Services",
    apiHowTo: "https://portal.azure.com/" },
  { id: "duckduckgo", label: "🦆 DuckDuckGo", category: "web", desc: "Privacy-first, gratis (HTML)" },
  { id: "firecrawl", label: "🔥 Firecrawl", category: "web", desc: "Scraping AI-powered di siti business",
    requiresApi: "FIRECRAWL_API_KEY", apiProvider: "Firecrawl",
    apiHowTo: "https://www.firecrawl.dev/" },

  // 📱 SOCIAL
  { id: "instagram", label: "📸 Instagram", category: "social", desc: "Profili business + bio + contatti",
    requiresApi: "INSTAGRAM_GRAPH_API", apiProvider: "Meta for Developers",
    apiHowTo: "https://developers.facebook.com/docs/instagram-api/" },
  { id: "facebook", label: "👥 Facebook Pages", category: "social", desc: "Pagine attività + reviews",
    requiresApi: "META_GRAPH_API_KEY", apiProvider: "Meta for Developers",
    apiHowTo: "https://developers.facebook.com/" },
  { id: "linkedin", label: "💼 LinkedIn", category: "social", desc: "Aziende + decision maker",
    requiresApi: "LINKEDIN_API_KEY", apiProvider: "LinkedIn Developer Portal",
    apiHowTo: "https://www.linkedin.com/developers/" },
  { id: "tiktok", label: "🎵 TikTok Business", category: "social", desc: "Profili commerciali + engagement",
    requiresApi: "TIKTOK_API_KEY", apiProvider: "TikTok for Developers",
    apiHowTo: "https://developers.tiktok.com/" },

  // 📋 REGISTRI / DIRECTORY
  { id: "registro_imprese", label: "🏛️ Registro Imprese", category: "registry", desc: "Camera di Commercio (P.IVA, REA)",
    requiresApi: "REGISTRO_IMPRESE_API", apiProvider: "InfoCamere",
    apiHowTo: "https://www.registroimprese.it/" },
  { id: "pagine_gialle", label: "📒 Pagine Gialle", category: "registry", desc: "Directory IT + telefoni" },
  { id: "europages", label: "🇪🇺 Europages", category: "registry", desc: "B2B europeo, gratis (scraping)" },
];

const CATEGORY_META: Record<SourceCategory, {
  label: string;
  icon: string;
  color: string;
  /** Cosa Empire AI userà come fallback gratuito se la categoria è vuota o solo bloccata. */
  fallbackHint: string;
  fallbackIds: string[];
}> = {
  maps: {
    label: "Mappe & POI",
    icon: "🗺️",
    color: "#14b8a6",
    fallbackHint: "OpenStreetMap + Photon + Overpass (gratis, copertura globale)",
    fallbackIds: ["nominatim", "photon", "overpass"],
  },
  web: {
    label: "Web & Motori di Ricerca",
    icon: "🌐",
    color: "#3b82f6",
    fallbackHint: "DuckDuckGo HTML (gratis, no API key)",
    fallbackIds: ["duckduckgo"],
  },
  social: {
    label: "Social Network",
    icon: "📱",
    color: "#ec4899",
    fallbackHint: "Nessun fallback gratuito · risultati social omessi finché non sblocchi un'API",
    fallbackIds: [],
  },
  registry: {
    label: "Registri & Directory",
    icon: "📋",
    color: "#f59e0b",
    fallbackHint: "Pagine Gialle + Europages (scraping gratuito)",
    fallbackIds: ["pagine_gialle", "europages"],
  },
};

interface Props {
  activeSources: string[];
  onChange: (next: string[]) => void;
}

export function LeadSearchSourcesPanel({ activeSources, onChange }: Props) {
  const [apiStatuses, setApiStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [howToSource, setHowToSource] = useState<LeadSource | null>(null);
  const [legendOpen, setLegendOpen] = useState(false);

  const refreshStatuses = async () => {
    setLoading(true);
    try {
      const { data } = await supabase.functions.invoke("check-api-status", { body: {} });
      if (data?.statuses) setApiStatuses(data.statuses);
    } catch (e) {
      console.warn("[LeadSearchSourcesPanel] check-api-status fallita:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshStatuses();
  }, []);

  /** Una fonte è "disponibile" se non richiede API o se la sua API è configurata. */
  const isSourceAvailable = (s: LeadSource) =>
    !s.requiresApi || apiStatuses[s.requiresApi] === true;

  const isSourceFree = (s: LeadSource) => !s.requiresApi;

  /** Default: appena conosciamo gli statuses, selezioniamo TUTTE le fonti disponibili
      (mantenendo ciò che l'utente ha già toccato). */
  useEffect(() => {
    if (loading) return;
    const allAvailableIds = ALL_LEAD_SOURCES.filter(isSourceAvailable).map(s => s.id);
    const isStockDefault =
      activeSources.length === 4 &&
      ["photon", "nominatim", "overpass", "google"].every(id => activeSources.includes(id));
    if (isStockDefault) {
      onChange(allAvailableIds);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, apiStatuses]);

  const grouped = useMemo(() => {
    const map: Record<SourceCategory, LeadSource[]> = { maps: [], web: [], social: [], registry: [] };
    for (const s of ALL_LEAD_SOURCES) map[s.category].push(s);
    return map;
  }, []);

  const toggle = (id: string, available: boolean) => {
    if (!available) return;
    onChange(activeSources.includes(id) ? activeSources.filter(s => s !== id) : [...activeSources, id]);
  };

  const selectAllAvailable = () => {
    onChange(ALL_LEAD_SOURCES.filter(isSourceAvailable).map(s => s.id));
  };

  const selectFreeOnly = () => {
    onChange(ALL_LEAD_SOURCES.filter(isSourceFree).map(s => s.id));
  };

  const totalFree = ALL_LEAD_SOURCES.filter(isSourceFree).length;
  const totalAvailable = ALL_LEAD_SOURCES.filter(isSourceAvailable).length;
  const totalLocked = ALL_LEAD_SOURCES.length - totalAvailable;
  const totalActive = activeSources.length;

  /** Categorie che finiranno "vuote" nella prossima ricerca → mostriamo banner di fallback. */
  const fallbackCategories = useMemo(() => {
    return (Object.keys(CATEGORY_META) as SourceCategory[]).filter(cat => {
      const activeInCat = grouped[cat].filter(s => activeSources.includes(s.id) && isSourceAvailable(s));
      return activeInCat.length === 0;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSources, apiStatuses, grouped]);

  const applyFallback = (cat: SourceCategory) => {
    const ids = CATEGORY_META[cat].fallbackIds;
    if (ids.length === 0) return;
    const next = Array.from(new Set([...activeSources, ...ids]));
    onChange(next);
  };

  return (
    <div
      className="rounded-xl p-3 md:p-4 space-y-3 md:space-y-4"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="min-w-0">
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-widest" style={{ color: "#14b8a6" }}>
            📡 Canali di ricerca · Empire AI cerca ovunque
          </p>
          <p className="text-[10px] md:text-[11px] mt-0.5" style={{ color: "#9ca3af" }}>
            {loading
              ? "Verifica chiavi API in corso…"
              : (
                <>
                  <span className="font-bold text-white">{totalActive}</span> attivi ·{" "}
                  <span style={{ color: "#34d399" }}>{totalAvailable} disponibili</span>
                  {totalLocked > 0 && (
                    <> · <span style={{ color: "#fbbf24" }}>{totalLocked} da sbloccare</span></>
                  )}
                </>
              )}
          </p>
        </div>
        <div className="flex items-center gap-1.5 flex-wrap justify-end">
          <button
            onClick={() => setLegendOpen(v => !v)}
            title="Mostra legenda stati"
            className="text-[10px] font-semibold px-2 py-1 rounded-lg flex items-center gap-1"
            style={{
              background: legendOpen ? "rgba(20,184,166,0.15)" : "rgba(255,255,255,0.04)",
              border: `1px solid ${legendOpen ? "rgba(20,184,166,0.4)" : "rgba(255,255,255,0.08)"}`,
              color: legendOpen ? "#5eead4" : "#94a3b8",
            }}
          >
            <Info className="w-3 h-3" /> Legenda
          </button>
          <button
            onClick={refreshStatuses}
            disabled={loading}
            title="Ricontrolla stato API"
            className="p-1.5 rounded-lg opacity-70 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} style={{ color: "#94a3b8" }} />
          </button>
          <button
            onClick={selectFreeOnly}
            title={`Solo le ${totalFree} fonti senza API key`}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.1)",
              color: "#cbd5e1",
            }}
          >
            <ShieldCheck className="w-3 h-3 inline mr-1" />
            Solo gratis ({totalFree})
          </button>
          <button
            onClick={selectAllAvailable}
            className="text-[10px] font-bold px-2.5 py-1 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.25), rgba(16,185,129,0.12))",
              border: "1px solid rgba(20,184,166,0.45)",
              color: "#5eead4",
            }}
          >
            <Check className="w-3 h-3 inline mr-1" />
            Tutte disponibili ({totalAvailable})
          </button>
          <button
            onClick={() => onChange([])}
            className="text-[10px] font-semibold underline opacity-60 hover:opacity-100"
            style={{ color: "#94a3b8" }}
          >
            Nessuno
          </button>
        </div>
      </div>

      {/* LEGENDA */}
      {legendOpen && (
        <div
          className="rounded-lg p-2.5 grid grid-cols-2 md:grid-cols-4 gap-2 text-[10px]"
          style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.06)" }}
        >
          <LegendItem
            color="#14b8a6"
            icon={<Zap className="w-3 h-3" />}
            label="Attivo"
            desc="Selezionato per questa ricerca"
          />
          <LegendItem
            color="#34d399"
            icon={<Check className="w-3 h-3" />}
            label="Disponibile"
            desc="Pronto da attivare (gratis o API ok)"
          />
          <LegendItem
            color="#fbbf24"
            icon={<Lock className="w-3 h-3" />}
            label="Da sbloccare"
            desc="Richiede API key — tap per la guida"
          />
          <LegendItem
            color="#94a3b8"
            icon={<ShieldCheck className="w-3 h-3" />}
            label="Gratis"
            desc="Nessuna chiave necessaria"
          />
        </div>
      )}

      {/* SEZIONI PER CATEGORIA */}
      {(Object.keys(CATEGORY_META) as SourceCategory[]).map(cat => {
        const meta = CATEGORY_META[cat];
        const sources = grouped[cat];
        const availInCat = sources.filter(isSourceAvailable);
        const activeInCat = sources.filter(s => activeSources.includes(s.id) && isSourceAvailable(s));
        const lockedInCat = sources.length - availInCat.length;

        return (
          <div key={cat} className="space-y-1.5">
            <div className="flex items-center justify-between flex-wrap gap-1.5">
              <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider" style={{ color: meta.color }}>
                {meta.icon} {meta.label}
              </p>
              <p className="text-[9px] md:text-[10px] font-semibold" style={{ color: "#6b7280" }}>
                <span style={{ color: activeInCat.length > 0 ? "#34d399" : "#f87171" }}>
                  {activeInCat.length}
                </span>{" "}
                attive · {availInCat.length} disponibili
                {lockedInCat > 0 && (
                  <> · <span style={{ color: "#fbbf24" }}>{lockedInCat} bloccate</span></>
                )}
              </p>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {sources.map(src => {
                const available = isSourceAvailable(src);
                const active = available && activeSources.includes(src.id);
                const locked = !available;
                const free = isSourceFree(src);
                return (
                  <button
                    key={src.id}
                    onClick={() => (locked ? setHowToSource(src) : toggle(src.id, available))}
                    title={locked ? `Richiede ${src.requiresApi}` : `${src.desc}${free ? " · Gratis" : " · API configurata"}`}
                    className="text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    style={{
                      background: locked
                        ? "rgba(255,255,255,0.02)"
                        : active
                        ? `linear-gradient(135deg, ${meta.color}40, ${meta.color}20)`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${locked ? "rgba(251,191,36,0.25)" : active ? `${meta.color}90` : "rgba(255,255,255,0.08)"}`,
                      color: locked ? "#9ca3af" : active ? "#fff" : "#cbd5e1",
                      opacity: locked ? 0.85 : 1,
                    }}
                  >
                    {/* indicatore stato */}
                    {active && <Zap className="w-2.5 h-2.5" style={{ color: meta.color }} />}
                    {!active && available && <Check className="w-2.5 h-2.5" style={{ color: "#34d399" }} />}
                    {locked && <Lock className="w-2.5 h-2.5" style={{ color: "#fbbf24" }} />}

                    {src.label}

                    {/* badge "FREE" sulle gratis non attive (chiarezza) */}
                    {!active && available && free && (
                      <span
                        className="ml-0.5 text-[8px] font-bold px-1 py-0.5 rounded"
                        style={{ background: "rgba(52,211,153,0.12)", color: "#34d399" }}
                      >
                        FREE
                      </span>
                    )}
                    {locked && (
                      <span
                        className="ml-1 text-[8px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(245,158,11,0.18)", color: "#fbbf24" }}
                      >
                        🔑 SBLOCCA
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {/* FALLBACK BANNER — categoria senza fonti attive */}
      {!loading && fallbackCategories.length > 0 && (
        <div
          className="rounded-lg p-3 space-y-2"
          style={{
            background: "linear-gradient(135deg, rgba(245,158,11,0.08), rgba(245,158,11,0.03))",
            border: "1px solid rgba(245,158,11,0.3)",
          }}
        >
          <p className="text-[10px] md:text-[11px] font-bold uppercase tracking-wider flex items-center gap-1.5" style={{ color: "#fbbf24" }}>
            <AlertTriangle className="w-3.5 h-3.5" />
            Per evitare risultati incompleti
          </p>
          <p className="text-[10px] md:text-[11px]" style={{ color: "#cbd5e1" }}>
            Alcune categorie sono vuote. Empire AI userà comunque dei <strong>fallback gratuiti</strong> per
            mantenere i risultati ricchi e coerenti, ma puoi attivarli manualmente con un click:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {fallbackCategories.map(cat => {
              const meta = CATEGORY_META[cat];
              const hasFallback = meta.fallbackIds.length > 0;
              return (
                <div
                  key={cat}
                  className="flex items-center gap-1.5 text-[10px] px-2.5 py-1.5 rounded-lg"
                  style={{
                    background: "rgba(0,0,0,0.25)",
                    border: `1px solid ${hasFallback ? `${meta.color}40` : "rgba(248,113,113,0.3)"}`,
                  }}
                >
                  <span style={{ color: meta.color }}>{meta.icon}</span>
                  <span style={{ color: "#e5e7eb" }}>
                    <strong>{meta.label}:</strong> {meta.fallbackHint}
                  </span>
                  {hasFallback && (
                    <button
                      onClick={() => applyFallback(cat)}
                      className="ml-1 text-[9px] font-bold px-2 py-0.5 rounded"
                      style={{
                        background: `${meta.color}25`,
                        border: `1px solid ${meta.color}60`,
                        color: meta.color,
                      }}
                    >
                      Attiva fallback
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* MODAL "COME SBLOCCARE" */}
      {howToSource && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
          onClick={() => setHowToSource(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            className="max-w-md w-full rounded-2xl p-5 space-y-4"
            style={{
              background: "linear-gradient(135deg, #0f172a, #1e293b)",
              border: "1px solid rgba(20,184,166,0.3)",
              boxShadow: "0 20px 60px rgba(0,0,0,0.5)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: "#14b8a6" }}>
                  🔑 Sblocca canale
                </p>
                <h3 className="text-lg font-black text-white mt-1">{howToSource.label}</h3>
                <p className="text-xs mt-1" style={{ color: "#94a3b8" }}>
                  {howToSource.desc}
                </p>
              </div>
              <button
                onClick={() => setHowToSource(null)}
                className="p-1 rounded-lg opacity-60 hover:opacity-100"
                style={{ background: "rgba(255,255,255,0.08)" }}
              >
                <X className="w-4 h-4 text-white" />
              </button>
            </div>

            {/* Box fallback gratis per la categoria */}
            {CATEGORY_META[howToSource.category].fallbackIds.length > 0 && (
              <div
                className="rounded-xl p-3"
                style={{ background: "rgba(52,211,153,0.06)", border: "1px solid rgba(52,211,153,0.2)" }}
              >
                <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "#34d399" }}>
                  <ShieldCheck className="w-3 h-3 inline mr-1" /> Nel frattempo
                </p>
                <p className="text-[11px]" style={{ color: "#cbd5e1" }}>
                  Empire AI usa già <strong>{CATEGORY_META[howToSource.category].fallbackHint}</strong> come
                  fallback gratuito, così i risultati restano coerenti anche senza questa API.
                </p>
              </div>
            )}

            <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}>
              <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5eead4" }}>
                <Sparkles className="w-3 h-3 inline mr-1" /> Come collegarlo in 3 step
              </p>
              <ol className="text-xs space-y-1.5 list-decimal list-inside" style={{ color: "#cbd5e1" }}>
                <li>
                  Vai su <strong>{howToSource.apiProvider}</strong> e crea/copia la tua chiave API.
                  {howToSource.apiHowTo && (
                    <a
                      href={howToSource.apiHowTo}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 ml-1 underline"
                      style={{ color: "#5eead4" }}
                    >
                      Apri guida <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </li>
                <li>
                  Apri il pannello <strong>API & Connessioni</strong> di Empire AI e incolla la chiave nel campo{" "}
                  <code className="px-1.5 py-0.5 rounded text-[10px]" style={{ background: "rgba(0,0,0,0.4)", color: "#5eead4" }}>
                    {howToSource.requiresApi}
                  </code>
                  .
                </li>
                <li>
                  Torna qui e clicca <strong>"Ricontrolla"</strong> 🔄 — la fonte si attiverà automaticamente.
                </li>
              </ol>
            </div>

            <div className="flex gap-2">
              <Link
                to="/partner/api-connections"
                onClick={() => setHowToSource(null)}
                className="flex-1 text-center text-xs font-bold py-2.5 rounded-xl"
                style={{
                  background: "linear-gradient(135deg, #14b8a6, #0d9488)",
                  color: "#0f172a",
                }}
              >
                🔧 Apri pannello API
              </Link>
              <button
                onClick={() => {
                  setHowToSource(null);
                  refreshStatuses();
                }}
                className="text-xs font-bold py-2.5 px-4 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.06)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  color: "#e5e7eb",
                }}
              >
                <RefreshCw className="w-3 h-3 inline mr-1" /> Ricontrolla
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function LegendItem({
  color,
  icon,
  label,
  desc,
}: {
  color: string;
  icon: React.ReactNode;
  label: string;
  desc: string;
}) {
  return (
    <div className="flex items-start gap-1.5">
      <span
        className="shrink-0 w-5 h-5 rounded-md flex items-center justify-center"
        style={{ background: `${color}20`, border: `1px solid ${color}50`, color }}
      >
        {icon}
      </span>
      <div className="min-w-0 leading-tight">
        <p className="font-bold" style={{ color }}>{label}</p>
        <p style={{ color: "#94a3b8" }}>{desc}</p>
      </div>
    </div>
  );
}
