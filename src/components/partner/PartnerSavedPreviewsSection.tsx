import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Bookmark, Star, ExternalLink, MessageCircle, Trash2, Search,
  Wand2, Sparkles, Eye, Pencil, Save, X as XIcon, ChevronDown,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";

/* ───────────────── Types ───────────────── */
interface SavedPreview {
  id: string;
  sector_label: string | null;
  template_style: string | null;
  primary_color: string | null;
  hero_title: string | null;
  hero_image_url: string | null;
  logo_url: string | null;
  preview_url: string | null;
  public_slug: string | null;
  lead_name: string | null;
  lead_city: string | null;
  whatsapp_message: string | null;
  view_count: number | null;
  is_favorite: boolean | null;
  saved_to_portfolio: boolean | null;
  saved_to_portfolio_at: string | null;
  portfolio_label: string | null;
  portfolio_notes: string | null;
  created_at: string;
}

type SortKey = "recent" | "az" | "favorites" | "views";

/* ─────────────────────────────────────────────────────────────────────────
 * Sezione "Le tue Preview salvate" — integra le custom preview taggate
 * come "saved_to_portfolio" all'interno del Portfolio Partner con la stessa
 * estetica delle altre card del vault.
 * ─────────────────────────────────────────────────────────────────────── */
export default function PartnerSavedPreviewsSection() {
  const { user } = useAuth();
  const [previews, setPreviews] = useState<SavedPreview[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<SortKey>(
    () => (localStorage.getItem("partner_saved_previews_sort") as SortKey) || "recent"
  );
  const [editing, setEditing] = useState<SavedPreview | null>(null);
  const [editLabel, setEditLabel] = useState("");
  const [editNotes, setEditNotes] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  useEffect(() => {
    localStorage.setItem("partner_saved_previews_sort", sort);
  }, [sort]);

  /* ── Fetch ── */
  useEffect(() => {
    if (!user?.id) return;
    let alive = true;
    (async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("seller_custom_previews" as any)
        .select("*")
        .eq("owner_id", user.id)
        .eq("saved_to_portfolio", true)
        .order("saved_to_portfolio_at", { ascending: false });
      if (!alive) return;
      if (error) {
        console.error("[saved-previews]", error);
        toast.error("Impossibile caricare le preview salvate");
      } else {
        setPreviews((data as any) || []);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [user?.id]);

  /* ── Realtime ── */
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`saved-previews-${user.id}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "seller_custom_previews", filter: `owner_id=eq.${user.id}` },
        (payload: any) => {
          const newRow = payload.new as SavedPreview | null;
          const oldRow = payload.old as SavedPreview | null;
          setPreviews((prev) => {
            // Aggiunta o aggiornamento
            if (newRow && newRow.saved_to_portfolio) {
              const exists = prev.find((p) => p.id === newRow.id);
              if (exists) return prev.map((p) => (p.id === newRow.id ? { ...p, ...newRow } : p));
              return [newRow, ...prev];
            }
            // Rimozione (saved_to_portfolio = false oppure delete)
            const idToRemove = newRow?.id || oldRow?.id;
            if (idToRemove) return prev.filter((p) => p.id !== idToRemove);
            return prev;
          });
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [user?.id]);

  /* ── Lista filtrata + ordinata ── */
  const filtered = useMemo(() => {
    const list = previews.filter((p) => {
      if (!search.trim()) return true;
      const q = search.toLowerCase();
      const hay = [
        p.portfolio_label, p.lead_name, p.lead_city,
        p.sector_label, p.template_style, p.hero_title,
      ].filter(Boolean).join(" ").toLowerCase();
      return hay.includes(q);
    });

    return [...list].sort((a, b) => {
      switch (sort) {
        case "az":
          return (a.portfolio_label || a.lead_name || "").localeCompare(b.portfolio_label || b.lead_name || "");
        case "favorites":
          if (!!a.is_favorite !== !!b.is_favorite) return a.is_favorite ? -1 : 1;
          return new Date(b.saved_to_portfolio_at || b.created_at).getTime() - new Date(a.saved_to_portfolio_at || a.created_at).getTime();
        case "views":
          return (b.view_count || 0) - (a.view_count || 0);
        case "recent":
        default:
          return new Date(b.saved_to_portfolio_at || b.created_at).getTime() - new Date(a.saved_to_portfolio_at || a.created_at).getTime();
      }
    });
  }, [previews, search, sort]);

  const stats = {
    total: previews.length,
    favorites: previews.filter((p) => p.is_favorite).length,
    views: previews.reduce((acc, p) => acc + (p.view_count || 0), 0),
  };

  /* ── Azioni ── */
  const toggleFavorite = async (p: SavedPreview) => {
    const next = !p.is_favorite;
    setPreviews((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_favorite: next } : x)));
    const { error } = await supabase
      .from("seller_custom_previews" as any)
      .update({ is_favorite: next })
      .eq("id", p.id);
    if (error) {
      setPreviews((prev) => prev.map((x) => (x.id === p.id ? { ...x, is_favorite: !next } : x)));
      toast.error("Impossibile aggiornare il preferito");
    }
  };

  const removeFromPortfolio = async (p: SavedPreview) => {
    if (!confirm(`Rimuovere "${p.portfolio_label || p.lead_name}" dal Portfolio?\n(La preview resta disponibile in Custom Preview)`)) return;
    const prev = previews;
    setPreviews((prevList) => prevList.filter((x) => x.id !== p.id));
    const { error } = await supabase
      .from("seller_custom_previews" as any)
      .update({ saved_to_portfolio: false, saved_to_portfolio_at: null })
      .eq("id", p.id);
    if (error) {
      setPreviews(prev);
      toast.error("Impossibile rimuovere dal Portfolio");
    } else {
      toast.success("Rimossa dal Portfolio");
    }
  };

  const openEdit = (p: SavedPreview) => {
    setEditing(p);
    setEditLabel(p.portfolio_label || p.lead_name || "");
    setEditNotes(p.portfolio_notes || "");
  };

  const saveEdit = async () => {
    if (!editing) return;
    setSavingEdit(true);
    const { error } = await supabase
      .from("seller_custom_previews" as any)
      .update({
        portfolio_label: editLabel.trim() || editing.lead_name || "Preview",
        portfolio_notes: editNotes.trim() || null,
      })
      .eq("id", editing.id);
    if (error) {
      toast.error("Salvataggio fallito");
    } else {
      setPreviews((prev) =>
        prev.map((x) =>
          x.id === editing.id
            ? { ...x, portfolio_label: editLabel.trim() || editing.lead_name, portfolio_notes: editNotes.trim() || null }
            : x
        )
      );
      toast.success("Etichetta aggiornata");
      setEditing(null);
    }
    setSavingEdit(false);
  };

  return (
    <section
      className="partner-vault-panel rounded-2xl p-4 md:p-5 space-y-4"
      style={{ background: "rgba(244,114,182,0.04)", border: "1px solid rgba(244,114,182,0.14)" }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 flex-wrap">
        <button
          onClick={() => setCollapsed((v) => !v)}
          className="flex-1 min-w-0 text-left space-y-1 group"
        >
          <p className="partner-eyebrow flex items-center gap-1.5">
            <Bookmark className="w-3 h-3 text-pink-300" /> Catalogo Preview
          </p>
          <h3 className="text-base md:text-lg font-display font-bold text-foreground flex items-center gap-2">
            Le mie Preview salvate
            <motion.span animate={{ rotate: collapsed ? -90 : 0 }} className="opacity-60 group-hover:opacity-100">
              <ChevronDown className="w-4 h-4" />
            </motion.span>
          </h3>
          <p className="text-[11px] text-muted-foreground">
            Le custom preview che hai marcato come 🔖 Portfolio in{" "}
            <Link to="/partner/custom-preview" className="text-pink-300 underline" onClick={(e) => e.stopPropagation()}>
              Custom Preview
            </Link>.
          </p>
        </button>
        <Link
          to="/partner/custom-preview"
          className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-pink-500/20 hover:from-pink-400 hover:to-fuchsia-400 transition-colors shrink-0"
        >
          <Wand2 className="w-3.5 h-3.5" /> Nuova preview
        </Link>
      </div>

      <AnimatePresence initial={false}>
        {!collapsed && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden space-y-4"
          >
            {/* Stats */}
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Salvate", value: stats.total, color: "text-pink-300", icon: Bookmark },
                { label: "Preferite", value: stats.favorites, color: "text-amber-300", icon: Star },
                { label: "Visualizzazioni", value: stats.views, color: "text-emerald-300", icon: Eye },
              ].map((s) => {
                const Icon = s.icon;
                return (
                  <div key={s.label} className="partner-soft-tile p-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase text-muted-foreground tracking-wider truncate">{s.label}</span>
                      <Icon className={`w-3 h-3 ${s.color} shrink-0`} />
                    </div>
                    <div className={`text-xl font-display font-bold mt-1 ${s.color}`}>{s.value}</div>
                  </div>
                );
              })}
            </div>

            {/* Search + Sort */}
            {previews.length > 0 && (
              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative flex-1 min-w-[180px]">
                  <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cerca etichetta, lead, città, settore…"
                    className="w-full pl-8 pr-3 h-10 rounded-lg text-xs text-foreground placeholder:text-muted-foreground"
                    style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                  />
                </div>
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortKey)}
                  className="h-10 px-2.5 rounded-lg text-xs text-foreground appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-pink-400/30"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
                >
                  <option value="recent" className="bg-[#0f0f1a]">Più recenti</option>
                  <option value="az" className="bg-[#0f0f1a]">A → Z</option>
                  <option value="favorites" className="bg-[#0f0f1a]">Preferite prima</option>
                  <option value="views" className="bg-[#0f0f1a]">Più viste</option>
                </select>
              </div>
            )}

            {/* Lista */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[0, 1].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl h-[220px] animate-pulse"
                    style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.05)" }}
                  />
                ))}
              </div>
            ) : previews.length === 0 ? (
              <div
                className="p-6 rounded-xl text-center"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(244,114,182,0.25)" }}
              >
                <Bookmark className="w-8 h-8 mx-auto mb-2 text-pink-300/60" />
                <p className="text-xs text-foreground font-semibold mb-1">Nessuna preview salvata ancora</p>
                <p className="text-[10px] text-muted-foreground mb-3">
                  Vai in <span className="text-pink-300">Custom Preview</span>, genera la tua preview e premi 🔖 per salvarla qui.
                </p>
                <Link
                  to="/partner/custom-preview"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-pink-500/15 border border-pink-500/30 text-pink-200 text-[11px] font-semibold hover:bg-pink-500/25 transition-colors"
                >
                  <Sparkles className="w-3 h-3" /> Crea la prima
                </Link>
              </div>
            ) : filtered.length === 0 ? (
              <div className="p-5 rounded-xl text-center text-[11px] text-muted-foreground"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                Nessun risultato per "{search}".
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {filtered.map((p, i) => (
                  <SavedPreviewCard
                    key={p.id}
                    preview={p}
                    delay={i * 0.04}
                    onToggleFavorite={() => toggleFavorite(p)}
                    onEdit={() => openEdit(p)}
                    onRemove={() => removeFromPortfolio(p)}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Edit Dialog ── */}
      <AnimatePresence>
        {editing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center p-3"
            onClick={() => !savingEdit && setEditing(null)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              className="w-full max-w-md rounded-2xl p-4 space-y-3"
              style={{ background: "#0f0f1a", border: "1px solid rgba(244,114,182,0.3)" }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-foreground flex items-center gap-1.5">
                  <Pencil className="w-3.5 h-3.5 text-pink-300" /> Modifica etichetta
                </h4>
                <button
                  onClick={() => setEditing(null)}
                  className="p-1.5 rounded-full hover:bg-white/5 text-muted-foreground"
                  disabled={savingEdit}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Etichetta Portfolio</label>
                <input
                  value={editLabel}
                  onChange={(e) => setEditLabel(e.target.value)}
                  placeholder="Es. Pizzeria Da Mario — variante notturna"
                  className="w-full h-11 px-3 rounded-lg text-sm bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase tracking-wider text-muted-foreground">Note interne</label>
                <textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  placeholder="Promemoria, contesto trattativa, prezzo proposto…"
                  className="w-full px-3 py-2 rounded-lg text-sm bg-white !text-black placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-pink-400/40 resize-none"
                />
              </div>
              <button
                onClick={saveEdit}
                disabled={savingEdit}
                className="w-full h-11 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 bg-gradient-to-r from-pink-500 to-fuchsia-500 text-white disabled:opacity-50"
              >
                <Save className={`w-4 h-4 ${savingEdit ? "animate-pulse" : ""}`} />
                {savingEdit ? "Salvataggio…" : "Salva modifiche"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────
 * Card singola preview salvata — stessa estetica delle altre card del vault
 * ─────────────────────────────────────────────────────────────────────── */
function SavedPreviewCard({
  preview, delay, onToggleFavorite, onEdit, onRemove,
}: {
  preview: SavedPreview;
  delay: number;
  onToggleFavorite: () => void;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const accent = preview.primary_color || "#f472b6";
  const label = preview.portfolio_label || preview.lead_name || "Preview senza nome";
  const subtitle = [preview.sector_label, preview.template_style, preview.lead_city].filter(Boolean).join(" · ");

  const previewUrl = preview.preview_url
    || (preview.public_slug ? `/preview/${preview.public_slug}` : null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="rounded-2xl overflow-hidden group transition-all"
      style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${accent}40` }}
    >
      {/* Hero image */}
      <div
        className="relative h-[120px] overflow-hidden"
        style={{ background: `linear-gradient(135deg, ${accent}25, rgba(10,10,20,0.92))` }}
      >
        {preview.hero_image_url ? (
          <img
            src={preview.hero_image_url}
            alt={label}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Sparkles className="w-8 h-8" style={{ color: accent }} />
          </div>
        )}
        {/* Logo overlay */}
        {preview.logo_url && (
          <div
            className="absolute top-2 left-2 w-8 h-8 rounded-lg overflow-hidden bg-white/90 p-0.5 shadow-lg"
            style={{ border: `1px solid ${accent}55` }}
          >
            <img src={preview.logo_url} alt="" className="w-full h-full object-contain" />
          </div>
        )}
        {/* Badge preferito */}
        <button
          onClick={onToggleFavorite}
          className="absolute top-2 right-2 p-1.5 rounded-full bg-black/40 backdrop-blur-sm hover:bg-black/60 transition-colors"
          aria-label={preview.is_favorite ? "Rimuovi preferito" : "Marca preferito"}
        >
          <Star className={`w-3.5 h-3.5 ${preview.is_favorite ? "text-amber-300 fill-amber-300" : "text-white/80"}`} />
        </button>
      </div>

      {/* Content */}
      <div className="p-3 space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-foreground truncate">{label}</h4>
            {subtitle && <p className="text-[10px] text-muted-foreground truncate mt-0.5">{subtitle}</p>}
          </div>
          <span
            className="shrink-0 px-1.5 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-wide"
            style={{ background: `${accent}25`, color: accent, border: `1px solid ${accent}40` }}
          >
            <Bookmark className="w-2.5 h-2.5 inline -mt-0.5 mr-0.5" /> Saved
          </span>
        </div>

        {preview.portfolio_notes && (
          <p
            className="text-[10px] text-muted-foreground line-clamp-2 px-2 py-1.5 rounded-md"
            style={{ background: "rgba(255,255,255,0.03)", borderLeft: `2px solid ${accent}80` }}
          >
            {preview.portfolio_notes}
          </p>
        )}

        {/* Meta */}
        <div className="flex items-center justify-between text-[9px] text-muted-foreground">
          <span className="flex items-center gap-1">
            <Eye className="w-2.5 h-2.5" /> {preview.view_count || 0}
          </span>
          <span>
            {new Date(preview.saved_to_portfolio_at || preview.created_at).toLocaleDateString("it-IT", {
              day: "2-digit", month: "short",
            })}
          </span>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {previewUrl && (
            <a
              href={previewUrl}
              target="_blank"
              rel="noopener"
              className="flex-1 min-w-[80px] px-2 py-1.5 rounded-md bg-blue-500/10 border border-blue-500/25 text-blue-200 text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-blue-500/20 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Apri
            </a>
          )}
          {preview.whatsapp_message && previewUrl && (
            <a
              href={`https://wa.me/?text=${encodeURIComponent(preview.whatsapp_message)}`}
              target="_blank"
              rel="noopener"
              className="px-2 py-1.5 rounded-md bg-emerald-500/10 border border-emerald-500/25 text-emerald-200 text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-emerald-500/20 transition-colors"
              aria-label="Condividi su WhatsApp"
            >
              <MessageCircle className="w-3 h-3" />
            </a>
          )}
          <button
            onClick={onEdit}
            className="px-2 py-1.5 rounded-md bg-violet-500/10 border border-violet-500/25 text-violet-200 text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-violet-500/20 transition-colors"
            aria-label="Modifica etichetta"
          >
            <Pencil className="w-3 h-3" />
          </button>
          <button
            onClick={onRemove}
            className="px-2 py-1.5 rounded-md bg-red-500/10 border border-red-500/25 text-red-200 text-[10px] font-semibold flex items-center justify-center gap-1 hover:bg-red-500/20 transition-colors"
            aria-label="Rimuovi dal Portfolio"
          >
            <Trash2 className="w-3 h-3" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
