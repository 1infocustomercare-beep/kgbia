import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X, Search, Star, Trash2, Archive, Edit3, Copy, ExternalLink,
  RefreshCw, Sparkles, Repeat2, Wand2, Layers, Clock, Zap, CheckCircle2
} from "lucide-react";
import { toast } from "sonner";
import { useDemoVault, type VaultDemo } from "@/hooks/useDemoVault";

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
};

export default function DemoVaultPanel({ open, onClose, targetLead, onReused }: Props) {
  const vault = useDemoVault();
  const [search, setSearch] = useState("");
  const [renameId, setRenameId] = useState<string | null>(null);
  const [renameValue, setRenameValue] = useState("");
  const [reusingId, setReusingId] = useState<string | null>(null);
  const [filterSector, setFilterSector] = useState<string>("all");

  const sectorsAvailable = useMemo(() => {
    const set = new Set<string>();
    vault.demos.forEach(d => set.add(d.sector));
    return Array.from(set).sort();
  }, [vault.demos]);

  // Suggested demos for current target lead (compat-first)
  const suggested = useMemo(() => {
    if (!targetLead) return [];
    return vault.findCompatible(targetLead.sector).slice(0, 3);
  }, [targetLead, vault]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return vault.demos
      .filter(d => filterSector === "all" || d.sector === filterSector)
      .filter(d => !term ||
        d.display_name.toLowerCase().includes(term) ||
        d.original_lead_name.toLowerCase().includes(term) ||
        (d.sub_sector || "").toLowerCase().includes(term) ||
        d.template_variant.toLowerCase().includes(term)
      );
  }, [vault.demos, search, filterSector]);

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
            maxHeight: "90vh",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.25), rgba(124,58,237,0.15))" }}>
                <Layers className="w-5 h-5" style={{ color: "#c4b5fd" }} />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Cassaforte Demo</h2>
                <p className="text-[10px]" style={{ color: "#a78bfa" }}>
                  {vault.demos.length} demo salvate · riutilizza senza spendere crediti
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Suggested for target lead */}
          {targetLead && suggested.length > 0 && (
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

          {/* Search + filter */}
          <div className="p-3 flex gap-2 border-b" style={{ borderColor: "rgba(255,255,255,0.06)" }}>
            <div className="flex-1 relative">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Cerca per nome, lead, settore..."
                className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              />
            </div>
            {sectorsAvailable.length > 1 && (
              <select
                value={filterSector}
                onChange={e => setFilterSector(e.target.value)}
                className="px-2.5 py-2 rounded-lg text-[10px] text-white outline-none cursor-pointer"
                style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
              >
                <option value="all" style={{ background: "#1a1a2e" }}>Tutti i settori</option>
                {sectorsAvailable.map(s => (
                  <option key={s} value={s} style={{ background: "#1a1a2e" }}>{s}</option>
                ))}
              </select>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {vault.loading ? (
              <p className="text-center text-[10px] py-8" style={{ color: "#6b7280" }}>Caricamento...</p>
            ) : filtered.length === 0 ? (
              <div className="text-center py-12">
                <Wand2 className="w-10 h-10 mx-auto mb-2" style={{ color: "#4b5563" }} />
                <p className="text-[12px] font-bold text-white mb-1">Nessuna demo nella cassaforte</p>
                <p className="text-[10px]" style={{ color: "#9ca3af" }}>
                  Genera una demo da un lead — verrà salvata qui automaticamente per essere riutilizzata.
                </p>
              </div>
            ) : (
              filtered.map(demo => (
                <div
                  key={demo.id}
                  className="rounded-xl p-3 space-y-2"
                  style={{
                    background: demo.is_favorite ? "rgba(251,191,36,0.06)" : "rgba(255,255,255,0.03)",
                    border: `1px solid ${demo.is_favorite ? "rgba(251,191,36,0.2)" : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {/* Top row */}
                  <div className="flex items-start gap-2">
                    <button
                      onClick={() => vault.toggleFavorite(demo.id, demo.is_favorite)}
                      className="p-1 rounded shrink-0"
                    >
                      <Star
                        className="w-4 h-4"
                        style={{
                          color: demo.is_favorite ? "#fbbf24" : "#4b5563",
                          fill: demo.is_favorite ? "#fbbf24" : "none",
                        }}
                      />
                    </button>
                    <div className="flex-1 min-w-0">
                      {renameId === demo.id ? (
                        <div className="flex gap-1">
                          <input
                            autoFocus
                            value={renameValue}
                            onChange={e => setRenameValue(e.target.value)}
                            onKeyDown={e => {
                              if (e.key === "Enter") {
                                vault.renameDemo(demo.id, renameValue);
                                setRenameId(null);
                              } else if (e.key === "Escape") {
                                setRenameId(null);
                              }
                            }}
                            className="flex-1 px-2 py-1 rounded text-[11px] text-white outline-none"
                            style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(167,139,250,0.3)" }}
                          />
                          <button
                            onClick={() => { vault.renameDemo(demo.id, renameValue); setRenameId(null); }}
                            className="px-2 py-1 rounded text-[10px]"
                            style={{ background: "rgba(167,139,250,0.2)", color: "#c4b5fd" }}
                          >
                            OK
                          </button>
                        </div>
                      ) : (
                        <p className="text-[12px] font-bold text-white truncate">{demo.display_name}</p>
                      )}
                      <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                        <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd" }}>
                          {VARIANT_LABEL[demo.template_variant] || demo.template_variant}
                        </span>
                        {demo.sub_sector && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded" style={{ background: "rgba(20,184,166,0.15)", color: "#5eead4" }}>
                            {demo.sub_sector}
                          </span>
                        )}
                        {demo.reuse_count > 0 && (
                          <span className="text-[9px] px-1.5 py-0.5 rounded flex items-center gap-0.5" style={{ background: "rgba(16,185,129,0.15)", color: "#34d399" }}>
                            <Repeat2 className="w-2.5 h-2.5" /> {demo.reuse_count}
                          </span>
                        )}
                      </div>
                      <p className="text-[9px] mt-1" style={{ color: "#6b7280" }}>
                        Creata da: <span style={{ color: "#9ca3af" }}>{demo.original_lead_name}</span>
                        {demo.last_reused_for_lead && (
                          <> · ultimo riuso: <span style={{ color: "#9ca3af" }}>{demo.last_reused_for_lead}</span></>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* Quick links */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <a
                      href={demo.preview_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold"
                      style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
                    >
                      <ExternalLink className="w-3 h-3" /> Preview
                    </a>
                    <a
                      href={demo.admin_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold"
                      style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd" }}
                    >
                      <ExternalLink className="w-3 h-3" /> Admin
                    </a>
                    {demo.admin_email && (
                      <button
                        onClick={() => copy(demo.admin_email!, "Email admin")}
                        className="flex items-center gap-1 px-2 py-1 rounded text-[10px] font-semibold"
                        style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}
                      >
                        <Copy className="w-3 h-3" /> Email
                      </button>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 pt-2 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
                    {targetLead && (
                      <button
                        onClick={() => handleReuse(demo)}
                        disabled={reusingId === demo.id}
                        className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-[10px] font-bold"
                        style={{
                          background: "linear-gradient(135deg, #10b981, #059669)",
                          color: "#fff",
                          opacity: reusingId === demo.id ? 0.6 : 1,
                        }}
                      >
                        {reusingId === demo.id ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : (
                          <><Zap className="w-3 h-3" /> Usa per {targetLead.name.slice(0, 14)}{targetLead.name.length > 14 ? "…" : ""}</>
                        )}
                      </button>
                    )}
                    <button
                      onClick={() => { setRenameId(demo.id); setRenameValue(demo.display_name); }}
                      className="p-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af" }}
                      title="Rinomina"
                    >
                      <Edit3 className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => vault.archiveDemo(demo.id)}
                      className="p-1.5 rounded-lg"
                      style={{ background: "rgba(255,255,255,0.04)", color: "#9ca3af" }}
                      title="Archivia"
                    >
                      <Archive className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm(`Eliminare "${demo.display_name}" definitivamente?`)) {
                          vault.deleteDemo(demo.id);
                        }
                      }}
                      className="p-1.5 rounded-lg"
                      style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}
                      title="Elimina"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer info */}
          <div className="p-3 border-t" style={{ borderColor: "rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.3)" }}>
            <p className="text-[9px] text-center" style={{ color: "#6b7280" }}>
              💡 Riutilizzando una demo: il tenant viene aggiornato col nome/contatti del nuovo lead, ma <strong style={{ color: "#9ca3af" }}>brand, palette, immagini e template restano</strong>. Costo: <strong style={{ color: "#34d399" }}>0 crediti</strong>.
            </p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
