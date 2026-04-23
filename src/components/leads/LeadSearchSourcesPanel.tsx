import { useEffect, useMemo, useState } from "react";
import { Lock, Sparkles, ExternalLink, X, Check, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Link } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════════
   LEAD SEARCH SOURCES PANEL
   ───────────────────────────────────────────────────────────────────
   Pannello "ricerca ovunque" con 4 sezioni (Mappe / Web / Social /
   Registri). Ogni fonte ha un badge che indica se è gratuita o se
   richiede una chiave API; quelle bloccate mostrano un CTA "Sblocca"
   che apre la guida (modal) e un deep-link al pannello centralizzato
   /partner/api-connections (memoria: standard-interfaccia-api-keys).

   Default: tutte le fonti DISPONIBILI (gratis + a pagamento se la
   chiave è già configurata) sono selezionate.
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

const CATEGORY_META: Record<SourceCategory, { label: string; icon: string; color: string }> = {
  maps: { label: "Mappe & POI", icon: "🗺️", color: "#14b8a6" },
  web: { label: "Web & Motori di Ricerca", icon: "🌐", color: "#3b82f6" },
  social: { label: "Social Network", icon: "📱", color: "#ec4899" },
  registry: { label: "Registri & Directory", icon: "📋", color: "#f59e0b" },
};

interface Props {
  activeSources: string[];
  onChange: (next: string[]) => void;
}

export function LeadSearchSourcesPanel({ activeSources, onChange }: Props) {
  const [apiStatuses, setApiStatuses] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);
  const [howToSource, setHowToSource] = useState<LeadSource | null>(null);

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

  /** Default: appena conosciamo gli statuses, selezioniamo TUTTE le fonti disponibili
      (mantenendo ciò che l'utente ha già toccato). */
  useEffect(() => {
    if (loading) return;
    const allAvailableIds = ALL_LEAD_SOURCES.filter(isSourceAvailable).map(s => s.id);
    // Se l'utente non ha ancora toccato nulla (fallback ai 4 storici), promuovi a "tutte disponibili"
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

  const totalAvailable = ALL_LEAD_SOURCES.filter(isSourceAvailable).length;
  const totalLocked = ALL_LEAD_SOURCES.length - totalAvailable;

  return (
    <div
      className="rounded-xl p-3 space-y-3"
      style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}
    >
      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div>
          <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest" style={{ color: "#14b8a6" }}>
            📡 Canali di ricerca · Empire AI cerca ovunque
          </p>
          <p className="text-[9px] mt-0.5" style={{ color: "#6b7280" }}>
            {loading
              ? "Verifica chiavi API in corso…"
              : `${activeSources.length} attivi · ${totalAvailable} disponibili · ${totalLocked} da sbloccare`}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          <button
            onClick={refreshStatuses}
            disabled={loading}
            title="Ricontrolla stato API"
            className="p-1.5 rounded-lg opacity-60 hover:opacity-100 transition-opacity"
            style={{ background: "rgba(255,255,255,0.05)" }}
          >
            <RefreshCw className={`w-3 h-3 ${loading ? "animate-spin" : ""}`} style={{ color: "#94a3b8" }} />
          </button>
          <button
            onClick={selectAllAvailable}
            className="text-[9px] font-bold px-2.5 py-1 rounded-lg"
            style={{
              background: "linear-gradient(135deg, rgba(20,184,166,0.2), rgba(16,185,129,0.1))",
              border: "1px solid rgba(20,184,166,0.4)",
              color: "#5eead4",
            }}
          >
            <Check className="w-3 h-3 inline mr-1" />
            Tutte disponibili
          </button>
          <button
            onClick={() => onChange([])}
            className="text-[9px] font-semibold underline opacity-50 hover:opacity-100"
            style={{ color: "#94a3b8" }}
          >
            Nessuno
          </button>
        </div>
      </div>

      {/* SEZIONI PER CATEGORIA */}
      {(Object.keys(CATEGORY_META) as SourceCategory[]).map(cat => {
        const meta = CATEGORY_META[cat];
        const sources = grouped[cat];
        return (
          <div key={cat} className="space-y-1.5">
            <p className="text-[9px] font-bold uppercase tracking-wider opacity-70" style={{ color: meta.color }}>
              {meta.icon} {meta.label}
            </p>
            <div className="flex flex-wrap gap-1.5">
              {sources.map(src => {
                const available = isSourceAvailable(src);
                const active = available && activeSources.includes(src.id);
                const locked = !available;
                return (
                  <button
                    key={src.id}
                    onClick={() => (locked ? setHowToSource(src) : toggle(src.id, available))}
                    title={locked ? `Richiede ${src.requiresApi}` : src.desc}
                    className="text-[10px] md:text-[11px] font-bold px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5"
                    style={{
                      background: locked
                        ? "rgba(255,255,255,0.02)"
                        : active
                        ? `linear-gradient(135deg, ${meta.color}40, ${meta.color}20)`
                        : "rgba(255,255,255,0.03)",
                      border: `1px solid ${locked ? "rgba(255,255,255,0.06)" : active ? `${meta.color}80` : "rgba(255,255,255,0.08)"}`,
                      color: locked ? "#6b7280" : active ? "#fff" : "#9ca3af",
                      opacity: locked ? 0.65 : 1,
                    }}
                  >
                    {locked && <Lock className="w-2.5 h-2.5" />}
                    {src.label}
                    {locked && (
                      <span
                        className="ml-1 text-[8px] font-bold px-1.5 py-0.5 rounded"
                        style={{ background: "rgba(245,158,11,0.15)", color: "#fbbf24" }}
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
                  Torna qui e clicca <strong>"Ricontrolla stato API"</strong> 🔄 — la fonte si attiverà automaticamente.
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
