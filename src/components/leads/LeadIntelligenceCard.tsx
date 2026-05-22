// LeadIntelligenceCard — mostra il report Intelligence di un lead:
// score, categoria, punti deboli, proposta, script vendita, mockup PRIMA/DOPO on-demand.
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Flame, Zap, Thermometer, Snowflake, Loader2, Sparkles, Image as ImageIcon,
  Target, MessageSquare, Phone, Mail, Instagram, AlertTriangle, CheckCircle2,
  Package, ArrowRight, Copy, ChevronDown, ChevronUp,
} from "lucide-react";

export interface IntelligenceReport {
  id: string;
  lead_name: string;
  lead_city: string | null;
  lead_sector: string | null;
  lead_website: string | null;
  lead_phone: string | null;
  vendibility_score: number;
  category: "hot" | "warm" | "tiepido" | "freddo";
  category_reason: string | null;
  has_website: boolean;
  website_quality_score: number | null;
  website_issues: string[];
  missing_features: string[];
  has_instagram: boolean;
  has_facebook: boolean;
  social_engagement_score: number | null;
  social_issues: string[];
  google_rating: number | null;
  google_reviews_count: number | null;
  reputation_score: number | null;
  reputation_issues: string[];
  weak_points: string[];
  improvement_proposal: string;
  recommended_package: string;
  sales_pitch: string;
  approach_strategy: string;
  mockup_before_url: string | null;
  mockup_after_url: string | null;
  credits_spent: number;
}

interface Props {
  report: IntelligenceReport;
  onUpdate?: (report: IntelligenceReport) => void;
  defaultExpanded?: boolean;
}

const CATEGORY_META = {
  hot:    { label: "HOT — pronto a chiudere",      icon: Flame,       color: "#ef4444", bg: "rgba(239,68,68,0.12)", border: "rgba(239,68,68,0.35)" },
  warm:   { label: "WARM — bisogno chiaro",        icon: Zap,         color: "#f59e0b", bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)" },
  tiepido:{ label: "TIEPIDO — possibile",          icon: Thermometer, color: "#3b82f6", bg: "rgba(59,130,246,0.12)", border: "rgba(59,130,246,0.35)" },
  freddo: { label: "FREDDO — difficile",           icon: Snowflake,   color: "#9ca3af", bg: "rgba(156,163,175,0.12)", border: "rgba(156,163,175,0.35)" },
};

const PACKAGE_LABEL: Record<string, { label: string; price: string }> = {
  digital_start:     { label: "Digital Start",     price: "€1.997" },
  growth_ai:         { label: "Growth AI",         price: "€4.997" },
  empire_domination: { label: "Empire Domination", price: "€7.997" },
};

const APPROACH_LABEL: Record<string, { label: string; icon: any }> = {
  cold_call:     { label: "Chiamata diretta",      icon: Phone },
  whatsapp:      { label: "WhatsApp",              icon: MessageSquare },
  email:         { label: "Email personalizzata",  icon: Mail },
  in_persona:    { label: "Visita in persona",     icon: Target },
  instagram_dm:  { label: "DM Instagram",          icon: Instagram },
};

export default function LeadIntelligenceCard({ report: initialReport, onUpdate, defaultExpanded = false }: Props) {
  const [report, setReport] = useState(initialReport);
  const [expanded, setExpanded] = useState(defaultExpanded);
  const [generatingMockup, setGeneratingMockup] = useState(false);
  const [showMockup, setShowMockup] = useState(false);

  const meta = CATEGORY_META[report.category] ?? CATEGORY_META.tiepido;
  const Icon = meta.icon;
  const pkg = PACKAGE_LABEL[report.recommended_package] ?? PACKAGE_LABEL.growth_ai;
  const approach = APPROACH_LABEL[report.approach_strategy] ?? APPROACH_LABEL.whatsapp;
  const ApproachIcon = approach.icon;

  const handleCopyPitch = async () => {
    try {
      await navigator.clipboard.writeText(report.sales_pitch);
      toast.success("Script copiato negli appunti");
    } catch {
      toast.error("Impossibile copiare");
    }
  };

  const handleGenerateMockup = async () => {
    if (generatingMockup) return;
    setGeneratingMockup(true);
    try {
      const { data, error } = await supabase.functions.invoke("lead-mockup-generator", {
        body: { report_id: report.id },
      });
      if (error) throw error;
      if (!data?.success) {
        if (data?.error === "insufficient_credits") {
          toast.error("Crediti insufficienti per generare il mockup (10 crediti)");
        } else {
          toast.error(data?.error || "Errore generazione mockup");
        }
        return;
      }
      const updated = data.report as IntelligenceReport;
      setReport(updated);
      setShowMockup(true);
      onUpdate?.(updated);
      toast.success(data.cached ? "Mockup già pronto" : "Mockup PRIMA/DOPO generato");
    } catch (e: any) {
      toast.error(e?.message || "Errore generazione mockup");
    } finally {
      setGeneratingMockup(false);
    }
  };

  return (
    <div
      className="rounded-2xl overflow-hidden"
      style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${meta.border}` }}
    >
      {/* Header con score + categoria */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-center gap-3 p-4 text-left hover:bg-white/[0.02] transition-colors"
      >
        <div
          className="w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-2xl"
          style={{ background: meta.bg, color: meta.color, border: `1px solid ${meta.border}` }}
        >
          {report.vendibility_score}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <Icon className="w-4 h-4" style={{ color: meta.color }} />
            <span className="text-xs font-bold uppercase tracking-wider" style={{ color: meta.color }}>
              {meta.label}
            </span>
          </div>
          <h4 className="text-sm font-semibold text-white truncate mt-0.5">{report.lead_name}</h4>
          {report.category_reason && (
            <p className="text-[11px] text-white/50 mt-0.5 line-clamp-2">{report.category_reason}</p>
          )}
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-white/80" /> : <ChevronDown className="w-4 h-4 text-white/80" />}
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-3 border-t border-white/[0.04]">
              {/* Mini-score grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
                <ScoreMiniCard label="Sito" value={report.website_quality_score} present={report.has_website} />
                <ScoreMiniCard label="Social" value={report.social_engagement_score} present={report.has_instagram || report.has_facebook} />
                <ScoreMiniCard label="Reputazione" value={report.reputation_score} present={!!report.google_rating} />
                <ScoreMiniCard label="Recensioni" value={report.google_reviews_count} present={!!report.google_reviews_count} suffix="" raw />
              </div>

              {/* Punti deboli */}
              {report.weak_points?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                    <span className="text-[11px] font-bold text-amber-300 uppercase tracking-wider">Punti deboli rilevati</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {report.weak_points.slice(0, 6).map((wp, i) => (
                      <span key={i} className="px-2 py-1 rounded-md text-[10px] font-medium bg-amber-500/10 text-amber-200 border border-amber-500/20">
                        {wp}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Funzionalità mancanti */}
              {report.missing_features?.length > 0 && (
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="text-[11px] font-bold text-cyan-300 uppercase tracking-wider">Cosa manca</span>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {report.missing_features.slice(0, 6).map((mf, i) => (
                      <span key={i} className="px-2 py-1 rounded-md text-[10px] font-medium bg-cyan-500/10 text-cyan-200 border border-cyan-500/20">
                        + {mf}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Proposta su misura */}
              {report.improvement_proposal && (
                <div className="rounded-xl p-3" style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.2)" }}>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-violet-300" />
                    <span className="text-[11px] font-bold text-violet-200 uppercase tracking-wider">Cosa Empire fa per loro</span>
                  </div>
                  <p className="text-[12px] text-white/80 leading-relaxed">{report.improvement_proposal}</p>
                </div>
              )}

              {/* Pacchetto + approccio */}
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(200,150,62,0.12)", color: "#fbbf24", border: "1px solid rgba(200,150,62,0.25)" }}>
                  <Package className="w-3 h-3" /> {pkg.label} · {pkg.price}
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold" style={{ background: "rgba(16,185,129,0.1)", color: "#6ee7b7", border: "1px solid rgba(16,185,129,0.25)" }}>
                  <ApproachIcon className="w-3 h-3" /> {approach.label}
                </div>
              </div>

              {/* Script vendita */}
              {report.sales_pitch && (
                <div className="rounded-xl p-3" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.18)" }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-1.5">
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-300" />
                      <span className="text-[11px] font-bold text-emerald-200 uppercase tracking-wider">Script pronto</span>
                    </div>
                    <button onClick={handleCopyPitch} className="flex items-center gap-1 text-[10px] text-emerald-300 hover:text-emerald-200 transition-colors">
                      <Copy className="w-3 h-3" /> Copia
                    </button>
                  </div>
                  <p className="text-[12px] text-white/85 leading-relaxed italic">"{report.sales_pitch}"</p>
                </div>
              )}

              {/* Mockup PRIMA/DOPO */}
              <div>
                {(!report.mockup_before_url || !report.mockup_after_url) ? (
                  <button
                    onClick={handleGenerateMockup}
                    disabled={generatingMockup}
                    className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-[11px] font-bold transition-all disabled:opacity-60"
                    style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(236,72,153,0.15))", border: "1px solid rgba(124,58,237,0.3)", color: "#e9d5ff" }}
                  >
                    {generatingMockup ? <Loader2 className="w-4 h-4 animate-spin" /> : <ImageIcon className="w-4 h-4" />}
                    {generatingMockup ? "Generazione mockup in corso…" : "Genera mockup PRIMA/DOPO (10 crediti)"}
                  </button>
                ) : (
                  <div>
                    <button
                      onClick={() => setShowMockup(v => !v)}
                      className="w-full flex items-center justify-center gap-2 py-2 rounded-xl text-[11px] font-bold transition-all"
                      style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)", color: "#e9d5ff" }}
                    >
                      <ImageIcon className="w-4 h-4" />
                      {showMockup ? "Nascondi mockup" : "Mostra mockup PRIMA/DOPO"}
                    </button>
                    {showMockup && (
                      <div className="grid grid-cols-2 gap-2 mt-2">
                        <div>
                          <div className="text-[9px] text-center font-bold uppercase tracking-wider text-red-300 mb-1">PRIMA</div>
                          <img src={report.mockup_before_url} alt="Prima" className="w-full rounded-lg border border-red-500/20" />
                        </div>
                        <div>
                          <div className="text-[9px] text-center font-bold uppercase tracking-wider text-emerald-300 mb-1">DOPO</div>
                          <img src={report.mockup_after_url} alt="Dopo" className="w-full rounded-lg border border-emerald-500/20" />
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ScoreMiniCard({ label, value, present, suffix = "/100", raw = false }: { label: string; value: number | null | undefined; present: boolean; suffix?: string; raw?: boolean }) {
  const display = value == null ? (present ? "?" : "—") : raw ? `${value}` : `${value}${suffix}`;
  const color = value == null ? "#6b7280" : value >= 70 ? "#10b981" : value >= 40 ? "#f59e0b" : "#ef4444";
  return (
    <div className="rounded-lg p-2" style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.05)" }}>
      <div className="text-[9px] text-white/50 uppercase tracking-wider">{label}</div>
      <div className="text-sm font-bold mt-0.5" style={{ color }}>{display}</div>
    </div>
  );
}
