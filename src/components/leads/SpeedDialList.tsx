import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Phone, MessageCircle, Mail, Copy, Search, Download, X,
  CheckCircle2, Globe, MapPin, Star, ExternalLink, ListChecks, Zap
} from "lucide-react";
import { toast } from "sonner";

export interface SpeedDialLead {
  name: string;
  full_address?: string;
  city?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  google_rating?: number;
  google_reviews?: number;
  google_maps_url?: string | null;
  _score?: number;
  _sector?: string;
}

interface Props {
  leads: SpeedDialLead[];
  open: boolean;
  onClose: () => void;
  onSelectLead?: (lead: SpeedDialLead) => void;
}

const inputStyle = { background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.10)" };

function exportCSV(leads: SpeedDialLead[]) {
  const headers = ["Nome", "Indirizzo", "Città", "Telefono", "Email", "Sito", "Rating", "Recensioni", "Score", "Maps"];
  const rows = leads.map(l => [
    l.name,
    l.full_address || "",
    l.city || "",
    l.phone || "",
    l.email || "",
    l.website || "",
    l.google_rating ?? "",
    l.google_reviews ?? "",
    l._score ?? "",
    l.google_maps_url || "",
  ]);
  const csv = [headers, ...rows]
    .map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `lead-empire-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  toast.success(`${leads.length} lead esportati in CSV`);
}

const sanitizePhone = (p?: string | null) => p?.replace(/[^\d+]/g, "") || "";

export default function SpeedDialList({ leads, open, onClose, onSelectLead }: Props) {
  const [search, setSearch] = useState("");
  const [calledIds, setCalledIds] = useState<Set<string>>(new Set());

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return leads;
    return leads.filter(l =>
      l.name.toLowerCase().includes(q) ||
      l.full_address?.toLowerCase().includes(q) ||
      l.phone?.includes(q) ||
      l.city?.toLowerCase().includes(q)
    );
  }, [leads, search]);

  const stats = useMemo(() => ({
    total: leads.length,
    withPhone: leads.filter(l => l.phone).length,
    withEmail: leads.filter(l => l.email).length,
    withoutSite: leads.filter(l => !l.website).length,
  }), [leads]);

  const copy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copiato`);
  };

  const markCalled = (id: string) => {
    setCalledIds(prev => {
      const n = new Set(prev);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 80, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 80, opacity: 0 }}
          onClick={e => e.stopPropagation()}
          className="w-full sm:max-w-2xl sm:rounded-2xl rounded-t-3xl flex flex-col"
          style={{
            background: "linear-gradient(180deg, #0f172a, #1a1a2e)",
            border: "1px solid rgba(167,139,250,0.25)",
            maxHeight: "92vh",
          }}
        >
          {/* Header */}
          <div className="p-4 border-b border-white/5 flex items-center justify-between sticky top-0" style={{ background: "rgba(15,23,42,0.95)", backdropFilter: "blur(12px)" }}>
            <div className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #14b8a6, #06b6d4)" }}>
                <Zap className="w-4 h-4 text-white" />
              </div>
              <div>
                <h3 className="text-[13px] font-black text-white">Speed Dial — Tutti i lead</h3>
                <p className="text-[9px]" style={{ color: "#6b7280" }}>
                  {stats.total} totali · {stats.withPhone} con tel · {stats.withoutSite} senza sito
                </p>
              </div>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/5">
              <X className="w-4 h-4" style={{ color: "#9ca3af" }} />
            </button>
          </div>

          {/* Toolbar */}
          <div className="p-3 space-y-2 border-b border-white/5">
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
                <input
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Cerca per nome, telefono, città…"
                  className="w-full pl-8 pr-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none"
                  style={inputStyle}
                />
              </div>
              <button
                onClick={() => exportCSV(filtered)}
                className="px-3 py-2 rounded-lg text-[10px] font-bold flex items-center gap-1"
                style={{ background: "rgba(20,184,166,0.15)", color: "#5eead4", border: "1px solid rgba(20,184,166,0.3)" }}
              >
                <Download className="w-3.5 h-3.5" /> CSV
              </button>
            </div>
            {calledIds.size > 0 && (
              <div className="flex items-center justify-between text-[10px] px-1">
                <span style={{ color: "#9ca3af" }}>
                  <CheckCircle2 className="w-3 h-3 inline mr-1" style={{ color: "#10b981" }} />
                  {calledIds.size}/{filtered.length} contattati
                </span>
                <button onClick={() => setCalledIds(new Set())} className="text-[9px] underline" style={{ color: "#6b7280" }}>
                  Reset
                </button>
              </div>
            )}
          </div>

          {/* List */}
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
            {filtered.length === 0 ? (
              <div className="text-center py-12">
                <ListChecks className="w-8 h-8 mx-auto mb-2" style={{ color: "#6b7280" }} />
                <p className="text-[11px]" style={{ color: "#9ca3af" }}>Nessun lead trovato</p>
              </div>
            ) : (
              filtered.map((l, i) => {
                const id = `${l.name}-${l.full_address || i}`;
                const called = calledIds.has(id);
                const phoneClean = sanitizePhone(l.phone);
                return (
                  <motion.div
                    key={id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: Math.min(i * 0.015, 0.3) }}
                    className="rounded-xl p-2.5 flex items-center gap-2"
                    style={{
                      background: called ? "rgba(16,185,129,0.06)" : "rgba(255,255,255,0.025)",
                      border: `1px solid ${called ? "rgba(16,185,129,0.25)" : "rgba(255,255,255,0.06)"}`,
                    }}
                  >
                    {/* Check */}
                    <button
                      onClick={() => markCalled(id)}
                      className="w-6 h-6 rounded-md flex items-center justify-center shrink-0"
                      style={{
                        background: called ? "#10b981" : "rgba(255,255,255,0.05)",
                        border: `1px solid ${called ? "#10b981" : "rgba(255,255,255,0.12)"}`,
                      }}
                    >
                      {called && <CheckCircle2 className="w-3.5 h-3.5 text-white" />}
                    </button>

                    {/* Info */}
                    <div className="flex-1 min-w-0" onClick={() => onSelectLead?.(l)} style={{ cursor: onSelectLead ? "pointer" : "default" }}>
                      <div className="flex items-center gap-1.5">
                        <p className="text-[11px] font-bold text-white truncate">{l.name}</p>
                        {l._score !== undefined && (
                          <span className="text-[8px] font-black px-1 rounded" style={{
                            background: l._score >= 75 ? "rgba(239,68,68,0.2)" : l._score >= 55 ? "rgba(245,158,11,0.2)" : "rgba(107,114,128,0.2)",
                            color: l._score >= 75 ? "#f87171" : l._score >= 55 ? "#fbbf24" : "#9ca3af",
                          }}>
                            {l._score}
                          </span>
                        )}
                        {l.google_rating ? (
                          <span className="text-[8px] flex items-center gap-0.5" style={{ color: "#fbbf24" }}>
                            <Star className="w-2.5 h-2.5 fill-current" />
                            {l.google_rating}
                          </span>
                        ) : null}
                      </div>
                      <div className="flex items-center gap-2 text-[9px] mt-0.5" style={{ color: "#9ca3af" }}>
                        {l.city && <span className="flex items-center gap-0.5"><MapPin className="w-2.5 h-2.5" />{l.city}</span>}
                        {l.phone && <span>{l.phone}</span>}
                        {!l.website && <span style={{ color: "#f87171" }}>● No sito</span>}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 shrink-0">
                      {phoneClean && (
                        <a
                          href={`tel:${phoneClean}`}
                          onClick={() => markCalled(id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(16,185,129,0.15)", color: "#10b981" }}
                          title="Chiama"
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {phoneClean && (
                        <a
                          href={`https://wa.me/${phoneClean.replace("+", "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={() => markCalled(id)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(34,197,94,0.15)", color: "#22c55e" }}
                          title="WhatsApp"
                        >
                          <MessageCircle className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {l.email && (
                        <a
                          href={`mailto:${l.email}`}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(59,130,246,0.15)", color: "#60a5fa" }}
                          title="Email"
                        >
                          <Mail className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {l.website && (
                        <a
                          href={l.website.startsWith("http") ? l.website : `https://${l.website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(167,139,250,0.15)", color: "#a78bfa" }}
                          title="Sito"
                        >
                          <Globe className="w-3.5 h-3.5" />
                        </a>
                      )}
                      {phoneClean && (
                        <button
                          onClick={() => copy(phoneClean, "Telefono")}
                          className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}
                          title="Copia telefono"
                        >
                          <Copy className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          <div className="p-2 text-center text-[8px] border-t border-white/5" style={{ color: "#6b7280" }}>
            💡 Tap sul nome per analizzare il lead · Tap call/WA per contattare e marcare automaticamente
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
