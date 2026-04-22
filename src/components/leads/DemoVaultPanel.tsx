import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Search, Star, Trash2, Archive, Edit3, Copy, ExternalLink,
  RefreshCw, Sparkles, Repeat2, Wand2, Layers, Zap, Smartphone,
  Globe, Filter, ArrowDownUp, Crown
} from "lucide-react";
import { toast } from "sonner";
import { useDemoVault, type VaultDemo } from "@/hooks/useDemoVault";
import { useMockupSuiteVault, type VaultMockupSuite } from "@/hooks/useMockupSuiteVault";

interface Props {
  open: boolean;
  onClose: () => void;
  /** Se passato, abilita la riusabilità su un lead specifico (mostra "Usa per questo lead") */
  targetLead?: {
    id?: string | null;
    name: string;
    sector: string;
    sectorLabel?: string;
    city?: string;
    zone?: string;
    fullAddress?: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    googleRating?: number;
    googleReviews?: number;
    googleMapsUrl?: string | null;
  } | null;
  /** Callback invocato dopo un riutilizzo riuscito col risultato remap (compatibile DemoFactoryResult) */
  onReused?: (result: any) => void;
}

const VARIANT_LABEL: Record<string, string> = {
  "strapizzami": "Strapizzami",
  "cote-obsidian": "Cote Obsidian",
  "cote-marble": "Cote Marble",
  "cote-ivory": "Cote Ivory",
  "paperfish-sakura": "Paperfish Sakura",
  "paperfish-dark": "Paperfish Dark",
  "lavang-noir": "Lavang Noir",
  "midtown-kosher": "Midtown Kosher",
  "batey-pacifico": "Batey Pacifico",
  "neo-nails-lavender": "Neo Nails Lavender",
  "neo-nails-blush": "Neo Nails Blush",
  "tatush-hair": "Tatush Hair",
  "asinara-azure": "Asinara Azure",
  "miami-boats": "Miami Boats",
  "city-padel-sage": "City Padel Sage",
  "miami-watersports": "Miami Watersports",
  "default": "Standard",
  "paperfish": "Paperfish",
  "batey": "Batey",
  "luxury_gold": "Luxury Gold",
  "modern_dark": "Modern Dark",
  "casual_warm": "Casual Warm",
  "minimal_zen": "Minimal Zen",
};

const ENGINE_LABEL: Record<string, { label: string; color: string; icon: any }> = {
  react:           { label: "React (Gratis)",  color: "#34d399", icon: Zap },
  nano_banana:     { label: "Nano Banana",     color: "#fbbf24", icon: Wand2 },
  nano_banana_pro: { label: "Nano Banana Pro", color: "#c084fc", icon: Crown },
};

type TabKey = "all" | "sites" | "mockups";
type SortKey = "recent" | "favorites" | "most_reused" | "az";

export default function DemoVaultPanel({ open, onClose, targetLead, onReused }: Props) {
  const vault = useDemoVault();
  const mockupVault = useMockupSuiteVault();
  const [tab, setTab] = useState<TabKey>("all");
  const [search, setSearch] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [reusingId, setReusingId] = useState<string | null>(null);
  const [filterSector, setFilterSector] = useState<string>("all");
  const [filterSubSector, setFilterSubSector] = useState<string>("all");
  const [filterCity, setFilterCity] = useState<string>("all");
  const [filterEngine, setFilterEngine] = useState<string>("all");
  const [filterTemplate, setFilterTemplate] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortKey>("recent");
  const [showFilters, setShowFilters] = useState(false);

  // ───── Aggregati per i selettori filtri ─────
  const sectorsAvailable = useMemo(() => {
    const set = new Set<string>();
    vault.demos.forEach(d => d.sector && set.add(d.sector));
    mockupVault.suites.forEach(s => s.business_sector && set.add(s.business_sector));
    return Array.from(set).sort();
  }, [vault.demos, mockupVault.suites]);

  const subSectorsAvailable = useMemo(() => {
    const set = new Set<string>();
    vault.demos.forEach(d => d.sub_sector && set.add(d.sub_sector));
    return Array.from(set).sort();
  }, [vault.demos]);

  const citiesAvailable = useMemo(() => {
    const set = new Set<string>();
    vault.demos.forEach(d => {
      const city = (d.lead_snapshot as any)?.city;
      if (city) set.add(city);
    });
    mockupVault.suites.forEach(s => s.business_city && set.add(s.business_city));
    return Array.from(set).sort();
  }, [vault.demos, mockupVault.suites]);

  const enginesAvailable = useMemo(() => {
    const set = new Set<string>();
    mockupVault.suites.forEach(s => s.engine && set.add(s.engine));
    return Array.from(set).sort();
  }, [mockupVault.suites]);

  const templatesAvailable = useMemo(() => {
    const set = new Set<string>();
    vault.demos.forEach(d => d.template_variant && set.add(d.template_variant));
    mockupVault.suites.forEach(s => s.template_variant && set.add(s.template_variant));
    return Array.from(set).sort();
  }, [vault.demos, mockupVault.suites]);

  // ───── Suggested per lead corrente ─────
  const suggested = useMemo(() => {
    if (!targetLead) return [];
    return vault.findCompatible(targetLead.sector).slice(0, 3);
  }, [targetLead, vault]);

  // ───── Filtri condivisi ─────
  const term = search.trim().toLowerCase();

  const filteredSites = useMemo(() => {
    if (tab === "mockups") return [] as VaultDemo[];
    return vault.demos
      .filter(d => filterSector === "all" || d.sector === filterSector)
      .filter(d => filterSubSector === "all" || d.sub_sector === filterSubSector)
      .filter(d => filterCity === "all" || (d.lead_snapshot as any)?.city === filterCity)
      .filter(d => filterTemplate === "all" || d.template_variant === filterTemplate)
      .filter(d => !term ||
        d.display_name.toLowerCase().includes(term) ||
        d.original_lead_name.toLowerCase().includes(term) ||
        (d.sub_sector || "").toLowerCase().includes(term) ||
        d.template_variant.toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (sortBy === "favorites") {
          if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
        }
        if (sortBy === "most_reused") return (b.reuse_count || 0) - (a.reuse_count || 0);
        if (sortBy === "az") return a.display_name.localeCompare(b.display_name);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [vault.demos, tab, filterSector, filterSubSector, filterCity, filterTemplate, term, sortBy]);

  const filteredMockups = useMemo(() => {
    if (tab === "sites") return [] as VaultMockupSuite[];
    return mockupVault.suites
      .filter(s => s.status === "complete")
      .filter(s => filterSector === "all" || s.business_sector === filterSector)
      .filter(s => filterCity === "all" || s.business_city === filterCity)
      .filter(s => filterEngine === "all" || s.engine === filterEngine)
      .filter(s => filterTemplate === "all" || s.template_variant === filterTemplate)
      .filter(s => !term ||
        s.business_name.toLowerCase().includes(term) ||
        (s.business_sector || "").toLowerCase().includes(term) ||
        (s.template_variant || "").toLowerCase().includes(term) ||
        (s.engine || "").toLowerCase().includes(term)
      )
      .sort((a, b) => {
        if (sortBy === "most_reused") return (b.view_count || 0) - (a.view_count || 0);
        if (sortBy === "az") return a.business_name.localeCompare(b.business_name);
        return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      });
  }, [mockupVault.suites, tab, filterSector, filterCity, filterEngine, filterTemplate, term, sortBy]);

  const totalAfterFilters = filteredSites.length + filteredMockups.length;

  const handleReuse = async (demo: VaultDemo) => {
    if (!targetLead?.name) {
      toast.error("Seleziona prima un lead per riutilizzare la demo");
      return;
    }
    setReusingId(demo.id);
    const result = await vault.reuseDemo({
      vaultId: demo.id,
      newLead: {
        businessName: targetLead.name,
        sector: targetLead.sector,
        sectorLabel: targetLead.sectorLabel,
        city: targetLead.city,
        zone: targetLead.zone,
        fullAddress: targetLead.fullAddress,
        phone: targetLead.phone,
        email: targetLead.email,
        website: targetLead.website,
        instagram: targetLead.instagram,
        facebook: targetLead.facebook,
        googleRating: targetLead.googleRating,
        googleReviews: targetLead.googleReviews,
        googleMapsUrl: targetLead.googleMapsUrl,
      },
      leadId: targetLead.id || null,
    });
    setReusingId(null);
    if (result) {
      onReused?.(result);
      onClose();
    }
  };

  const copy = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast.success(`${label} copiato`);
    } catch {}
  };

  const resetFilters = () => {
    setFilterSector("all"); setFilterSubSector("all"); setFilterCity("all");
    setFilterEngine("all"); setFilterTemplate("all"); setSearch("");
  };

  const activeFilterCount =
    (filterSector !== "all" ? 1 : 0) +
    (filterSubSector !== "all" ? 1 : 0) +
    (filterCity !== "all" ? 1 : 0) +
    (filterEngine !== "all" ? 1 : 0) +
    (filterTemplate !== "all" ? 1 : 0);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] flex items-end sm:items-center justify-center"
        style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 24, stiffness: 240 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full sm:w-[95%] sm:max-w-3xl rounded-t-3xl sm:rounded-3xl overflow-hidden flex flex-col"
          style={{
            background: "linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)",
            border: "1px solid rgba(167,139,250,0.25)",
            maxHeight: "92vh",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(124,58,237,0.15))" }}>
                <Layers className="w-5 h-5" style={{ color: "#c4b5fd" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Cassaforte Demo & Mockup</h2>
                <p className="text-[10px]" style={{ color: "#a78bfa" }}>
                  {vault.demos.length} siti · {mockupVault.suites.length} mockup suite · riutilizza senza spendere crediti
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            {[
              { key: "all" as TabKey, label: "Tutto", count: vault.demos.length + mockupVault.suites.filter(s => s.status === "complete").length, icon: Layers },
              { key: "sites" as TabKey, label: "Siti Demo", count: vault.demos.length, icon: Globe },
              { key: "mockups" as TabKey, label: "Mockup iPhone", count: mockupVault.suites.filter(s => s.status === "complete").length, icon: Smartphone },
            ].map(t => {
              const Icon = t.icon;
              const active = tab === t.key;
              return (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-[11px] font-semibold transition-colors relative"
                  style={{
                    color: active ? "#c4b5fd" : "#9ca3af",
                    background: active ? "rgba(167,139,250,0.06)" : "transparent",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {t.label}
                  <span className="text-[9px] px-1.5 py-0.5 rounded-full" style={{ background: active ? "rgba(167,139,250,0.2)" : "rgba(255,255,255,0.05)" }}>
                    {t.count}
                  </span>
                  {active && <div className="absolute bottom-0 left-0 right-0 h-0.5" style={{ background: "#a78bfa" }} />}
                </button>
              );
            })}
          </div>

          {/* Suggested for target lead */}
          {targetLead && suggested.length > 0 && tab !== "mockups" && (
            <div className="p-3 border-b" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(16,185,129,0.04)" }}>
              <div className="flex items-center gap-1.5 mb-2">
                <Sparkles className="w-3.5 h-3.5" style={{ color: "#34d399" }} />
                <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: "#5eead4" }}>
                  Suggerite per {targetLead.name} · 0 crediti
                </p>
              </div>
              <div className="flex gap-2 overflow-x-auto pb-1">
                {suggested.map(demo => (
                  <button
                    key={demo.id}
                    onClick={() => handleReuse(demo)}
                    disabled={!!reusingId}
                    className="shrink-0 text-left p-2.5 rounded-xl flex items-center gap-2 min-w-[200px]"
                    style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.3)" }}
                  >
                    <Repeat2 className="w-4 h-4 shrink-0" style={{ color: "#34d399" }} />
                    <div className="flex-1 min-w-0">
                      <p className="text-[11px] font-bold text-white truncate">{demo.display_name}</p>
                      <p className="text-[9px] truncate" style={{ color: "#9ca3af" }}>
                        {VARIANT_LABEL[demo.template_variant] || demo.template_variant}
                        {demo.reuse_count > 0 && ` · ${demo.reuse_count} riusi`}
                      </p>
                    </div>
                    {reusingId === demo.id && <RefreshCw className="w-3 h-3 animate-spin" style={{ color: "#34d399" }} />}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Search + filter toggle + sort */}
          <div className="p-3 flex gap-2 border-b items-center" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca per nome, lead, settore, template, città..."
                className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            <button
              onClick={() => setShowFilters(v => !v)}
              className="px-2.5 py-2 rounded-lg text-[10px] flex items-center gap-1 relative"
              style={{
                background: showFilters || activeFilterCount > 0 ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.04)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: showFilters || activeFilterCount > 0 ? "#c4b5fd" : "#9ca3af",
              }}
            >
              <Filter className="w-3 h-3" /> Filtri
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full text-[8px] flex items-center justify-center font-bold" style={{ background: "#a78bfa", color: "#fff" }}>
                  {activeFilterCount}
                </span>
              )}
            </button>
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as SortKey)}
              className="px-2 py-2 rounded-lg text-[10px] text-white outline-none cursor-pointer"
              style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              title="Ordina"
            >
              <option value="recent" style={{ background: "#1a1a2e" }}>Più recenti</option>
              <option value="favorites" style={{ background: "#1a1a2e" }}>Preferiti</option>
              <option value="most_reused" style={{ background: "#1a1a2e" }}>Più riusati</option>
              <option value="az" style={{ background: "#1a1a2e" }}>A-Z</option>
            </select>
          </div>

          {/* Filtri estesi */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden border-b"
                style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}
              >
                <div className="p-3 grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {sectorsAvailable.length > 0 && (
                    <FilterSelect label="Settore" value={filterSector} onChange={setFilterSector} options={sectorsAvailable} />
                  )}
                  {tab !== "mockups" && subSectorsAvailable.length > 0 && (
                    <FilterSelect label="Sotto-settore" value={filterSubSector} onChange={setFilterSubSector} options={subSectorsAvailable} />
                  )}
                  {citiesAvailable.length > 0 && (
                    <FilterSelect label="Città" value={filterCity} onChange={setFilterCity} options={citiesAvailable} />
                  )}
                  {tab !== "sites" && enginesAvailable.length > 0 && (
                    <FilterSelect label="Engine" value={filterEngine} onChange={setFilterEngine} options={enginesAvailable} renderLabel={(v) => ENGINE_LABEL[v]?.label || v} />
                  )}
                  {templatesAvailable.length > 0 && (
                    <FilterSelect label="Template" value={filterTemplate} onChange={setFilterTemplate} options={templatesAvailable} renderLabel={(v) => VARIANT_LABEL[v] || v} />
                  )}
                  {activeFilterCount > 0 && (
                    <button
                      onClick={resetFilters}
                      className="text-[10px] py-2 rounded-lg col-span-2 sm:col-span-1"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#fca5a5", border: "1px solid rgba(239,68,68,0.2)" }}
                    >
                      Pulisci filtri ({activeFilterCount})
                    </button>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Counter risultati */}
          <div className="px-3 py-2 text-[10px] flex items-center gap-2" style={{ color: "#6b7280", background: "rgba(0,0,0,0.15)" }}>
            <ArrowDownUp className="w-3 h-3" />
            {totalAfterFilters} risultati ·
            {tab === "all" && ` ${filteredSites.length} siti + ${filteredMockups.length} mockup`}
            {tab === "sites" && ` ${filteredSites.length} siti demo`}
            {tab === "mockups" && ` ${filteredMockups.length} mockup suite`}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {(vault.loading || mockupVault.loading) ? (
              <p className="text-center text-[10px] py-8" style={{ color: "#6b7280" }}>Caricamento...</p>
            ) : totalAfterFilters === 0 ? (
              <div className="text-center py-12">
                <Wand2 className="w-10 h-10 mx-auto mb-2" style={{ color: "#4b5563" }} />
                <p className="text-[12px] font-bold text-white mb-1">Nessun risultato</p>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                  {activeFilterCount > 0 || term
                    ? "Modifica filtri o ricerca per trovare ciò che cerchi."
                    : "Genera una demo o un mockup — verranno salvati qui automaticamente."}
                </p>
              </div>
            ) : (
              <>
                {/* Siti demo */}
                {filteredSites.map(demo => (
                  <SiteCard
                    key={`site-${demo.id}`}
                    demo={demo}
                    targetLead={targetLead}
                    reusingId={reusingId}
                    renameId={renameId}
                    renameValue={renameValue}
                    setRenameId={setRenameId}
                    setRenameValue={setRenameValue}
                    onToggleFavorite={() => vault.toggleFavorite(demo.id, demo.is_favorite)}
                    onRename={(v) => vault.renameDemo(demo.id, v)}
                    onArchive={() => vault.archiveDemo(demo.id)}
                    onDelete={() => {
                      if (confirm(`Eliminare "${demo.display_name}" definitivamente?`)) vault.deleteDemo(demo.id);
                    }}
                    onReuse={() => handleReuse(demo)}
                    onCopy={copy}
                  />
                ))}

                {/* Mockup suites */}
                {filteredMockups.map(suite => (
                  <MockupCard
                    key={`mockup-${suite.id}`}
                    suite={suite}
                    onDelete={() => {
                      if (confirm(`Eliminare il mockup "${suite.business_name}"?`)) mockupVault.deleteSuite(suite.id);
                    }}
                    onCopy={copy}
                    onToggleFavorite={() => mockupVault.toggleFavorite(suite.id, suite.is_favorite)}
                  />
                ))}
              </>
            )}
          </div>

          {/* Footer info */}
          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
            <p className="text-[9px] text-center" style={{ color: "#6b7280" }}>
              💡 I siti riutilizzabili spendono <strong style={{ color: "#34d399" }}>0 crediti</strong>. I mockup iPhone possono essere ricondivisi tramite link pubblico in qualunque momento.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─────────────────────── Subcomponents ───────────────────────

function FilterSelect({
  label, value, onChange, options, renderLabel,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  renderLabel?: (v: string) => string;
}) {
  return (
    <div>
      <label className="text-[9px] font-semibold uppercase tracking-wider block mb-1" style={{ color: "#a78bfa" }}>{label}</label>
      <select
        value={value}
        onChange={e => onChange(e.target.value)}
        className="w-full px-2 py-1.5 rounded-lg text-[10px] text-white outline-none cursor-pointer"
        style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
      >
        <option value="all" style={{ background: "#1a1a2e" }}>Tutti</option>
        {options.map(o => (
          <option key={o} value={o} style={{ background: "#1a1a2e" }}>
            {renderLabel ? renderLabel(o) : o}
          </option>
        ))}
      </select>
    </div>
  );
}

function SiteCard({
  demo, targetLead, reusingId, renameId, renameValue, setRenameId, setRenameValue,
  onToggleFavorite, onRename, onArchive, onDelete, onReuse, onCopy,
}: any) {
  return (
    <div
      className="rounded-xl p-3 space-y-2 relative"
      style={{
        background: demo.is_favorite ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.03)",
        border: `1px solid ${demo.is_favorite ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.06)"}`,
      }}
    >
      <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider" style={{ background: "rgba(59,130,246,0.15)", color: "#93c5fd" }}>
        <Globe className="w-2.5 h-2.5 inline mr-0.5" /> Sito
      </span>
      <div className="flex items-start gap-2 pr-12">
        <button onClick={onToggleFavorite} className="p-1 rounded shrink-0">
          <Star className="w-4 h-4" style={{ color: demo.is_favorite ? "#fbbf24" : "#4b5563", fill: demo.is_favorite ? "#fbbf24" : "none" }} />
        </button>
        <div className="flex-1 min-w-0">
          {renameId === demo.id ? (
            <div className="flex gap-1">
              <input
                autoFocus value={renameValue}
                onChange={(e: any) => setRenameValue(e.target.value)}
                onKeyDown={(e: any) => {
                  if (e.key === "Enter") { onRename(renameValue); setRenameId(null); }
                  else if (e.key === "Escape") setRenameId(null);
                }}
                className="flex-1 px-2 py-1 rounded text-[11px] text-white outline-none"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.3)" }}
              />
              <button onClick={() => { onRename(renameValue); setRenameId(null); }} className="px-2 py-1 rounded text-[10px]" style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}>OK</button>
            </div>
          ) : (
            <p className="text-[12px] font-bold text-white truncate">{demo.display_name}</p>
          )}
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd" }}>
              {VARIANT_LABEL[demo.template_variant] || demo.template_variant}
            </span>
            <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.15)", color: "#5eead4" }}>
              {demo.sector_label || demo.sector}
            </span>
            {demo.sub_sector && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.1)", color: "#5eead4" }}>{demo.sub_sector}</span>
            )}
            {demo.reuse_count > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                <Repeat2 className="w-2.5 h-2.5" /> {demo.reuse_count}
              </span>
            )}
          </div>
          <p className="text-[9px] mt-1" style={{ color: "#6b7280" }}>
            Da: <span style={{ color: "#9ca3af" }}>{demo.original_lead_name}</span>
            {demo.last_reused_for_lead && <> · ultimo riuso: <span style={{ color: "#9ca3af" }}>{demo.last_reused_for_lead}</span></>}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-1 flex-wrap">
        <a href={demo.preview_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}>
          <ExternalLink className="w-3 h-3" /> Preview
        </a>
        <a href={demo.admin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd" }}>
          <ExternalLink className="w-3 h-3" /> Admin
        </a>
        {demo.admin_email && (
          <button onClick={() => onCopy(demo.admin_email!, "Email admin")} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>
            <Copy className="w-3 h-3" /> Email
          </button>
        )}
      </div>

      <div className="flex items-center gap-1 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {targetLead && (
          <button
            onClick={onReuse}
            disabled={reusingId === demo.id}
            className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold"
            style={{ background: "linear-gradient(135deg, #10b981, #059669)", color: "#fff", opacity: reusingId === demo.id ? 0.6 : 1 }}
          >
            {reusingId === demo.id
              ? <RefreshCw className="w-3 h-3 animate-spin" />
              : <><Zap className="w-3 h-3" /> Usa per {targetLead.name.slice(0, 14)}{targetLead.name.length > 14 ? "…" : ""}</>}
          </button>
        )}
        <button onClick={() => { setRenameId(demo.id); setRenameValue(demo.display_name); }} className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af" }} title="Rinomina">
          <Edit3 className="w-3 h-3" />
        </button>
        <button onClick={onArchive} className="p-1.5 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af" }} title="Archivia">
          <Archive className="w-3 h-3" />
        </button>
        <button onClick={onDelete} className="p-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }} title="Elimina">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}

function MockupCard({ suite, onDelete, onCopy, onToggleFavorite }: { suite: VaultMockupSuite; onDelete: () => void; onCopy: (t: string, l: string) => void; onToggleFavorite: () => void }) {
  const engineCfg = ENGINE_LABEL[suite.engine] || { label: suite.engine, color: "#9ca3af", icon: Smartphone };
  const EngineIcon = engineCfg.icon;
  const screens = Array.isArray(suite.screens) ? suite.screens : [];
  const shareUrl = suite.share_slug ? `${window.location.origin}/preview/mockup/${suite.share_slug}` : null;
  const isFav = !!suite.is_favorite;

  return (
    <div
      className="rounded-xl p-3 space-y-2 relative"
      style={{
        background: isFav ? "rgba(251,191,36,0.06)" : "rgba(192,132,252,0.05)",
        border: `1px solid ${isFav ? "rgba(251,191,36,0.28)" : "rgba(192,132,252,0.18)"}`,
      }}
    >
      <span className="absolute top-2 right-2 text-[8px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider" style={{ background: "rgba(192,132,252,0.18)", color: "#e9d5ff" }}>
        <Smartphone className="w-2.5 h-2.5 inline mr-0.5" /> Mockup
      </span>

      {/* Salva come preferita — top-left, sempre visibile */}
      <button
        onClick={onToggleFavorite}
        title={isFav ? "Rimuovi dai preferiti" : "Salva come preferita"}
        aria-label={isFav ? "Rimuovi dai preferiti" : "Salva come preferita"}
        aria-pressed={isFav}
        className="absolute top-2 left-2 w-7 h-7 rounded-full flex items-center justify-center transition-colors"
        style={{
          background: isFav ? "rgba(251,191,36,0.18)" : "rgba(255,255,255,0.05)",
          border: `1px solid ${isFav ? "rgba(251,191,36,0.45)" : "rgba(255,255,255,0.08)"}`,
        }}
      >
        <Star
          className="w-3.5 h-3.5"
          style={{ color: isFav ? "#fbbf24" : "#9ca3af", fill: isFav ? "#fbbf24" : "none" }}
        />
      </button>

      <div className="flex items-start gap-2 pl-9 pr-14">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(192,132,252,0.15)" }}>
          <Smartphone className="w-4 h-4" style={{ color: "#e9d5ff" }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[12px] font-bold text-white truncate">{suite.business_name}</p>
          <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
            <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: `${engineCfg.color}25`, color: engineCfg.color }}>
              <EngineIcon className="w-2.5 h-2.5" /> {engineCfg.label}
            </span>
            {suite.template_variant && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd" }}>
                {VARIANT_LABEL[suite.template_variant] || suite.template_variant}
              </span>
            )}
            {suite.business_sector && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.15)", color: "#5eead4" }}>
                {suite.business_sector}
              </span>
            )}
            {suite.business_city && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>
                📍 {suite.business_city}
              </span>
            )}
            {(suite.view_count || 0) > 0 && (
              <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                👁 {suite.view_count}
              </span>
            )}
          </div>
          <p className="text-[9px] mt-1" style={{ color: "#6b7280" }}>
            {screens.length} schermate · {suite.credits_spent || 0} crediti spesi · {new Date(suite.created_at).toLocaleDateString("it-IT")}
          </p>
        </div>
      </div>

      {/* Mini preview thumbnails */}
      {screens.length > 0 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {screens.slice(0, 4).map((s: any, i: number) => (
            <div key={i} className="shrink-0 w-12 h-20 rounded-md overflow-hidden border" style={{ borderColor: "rgba(192,132,252,0.25)", background: suite.primary_color || "#1a1a2e" }}>
              {s.image_url ? (
                <img src={s.image_url} alt={s.title || `Screen ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-[8px] text-white/60">{s.title || s.type}</div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center gap-1 pt-2 border-t flex-wrap" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        {shareUrl && (
          <>
            <a href={shareUrl} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ background: "rgba(192,132,252,0.18)", color: "#e9d5ff" }}>
              <ExternalLink className="w-3 h-3" /> Apri
            </a>
            <button onClick={() => onCopy(shareUrl, "Link mockup")} className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold" style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}>
              <Copy className="w-3 h-3" /> Link
            </button>
          </>
        )}
        <div className="flex-1" />
        <button onClick={onDelete} className="p-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }} title="Elimina">
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
}
