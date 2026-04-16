import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, AlertTriangle, Target, Zap, TrendingUp, Shield, Phone,
  MessageCircle, Mail, Clock, User, Sparkles, CheckCircle2, XCircle,
  Loader2, Globe, Smartphone, ShoppingCart, MessageSquare, BarChart3,
  Calendar, Award, Flame, ChevronRight, Copy
} from "lucide-react";
import { toast } from "sonner";

export interface DeepReport {
  executive_summary: string;
  opportunity_score: number;
  urgency_score: number;
  budget_band: "low" | "mid" | "high" | "premium";
  decision_maker: {
    likely_role: string;
    best_contact_time: string;
    preferred_channel: "whatsapp" | "instagram_dm" | "email" | "call" | "in_person";
  };
  digital_audit: {
    current_state: string;
    critical_gaps: string[];
    quick_wins: string[];
  };
  pain_points: { pain: string; evidence: string; cost_to_them: string }[];
  sales_hooks: string[];
  objections: { objection: string; response: string }[];
  recommended_pitch: { opener: string; value_prop: string; proof: string; cta: string };
  recommended_package: { name: string; why: string; estimated_roi_days: number };
  next_actions: string[];
  risk_flags: string[];
}

export interface DeepAudit {
  reachable: boolean;
  has_https: boolean;
  has_booking: boolean;
  has_ecommerce: boolean;
  has_chat: boolean;
  has_pixel: boolean;
  mobile_meta: boolean;
  language: string | null;
  title: string | null;
  description: string | null;
  page_size_kb: number | null;
  age_signal: "modern" | "dated" | "obsolete" | "unknown";
  score: number;
}

interface Props {
  loading: boolean;
  report: DeepReport | null;
  audit: DeepAudit | null;
  leadName: string;
  onUseHook?: (hook: string) => void;
}

const channelIcon: Record<string, any> = {
  whatsapp: MessageCircle,
  instagram_dm: MessageSquare,
  email: Mail,
  call: Phone,
  in_person: User,
};

const channelLabel: Record<string, string> = {
  whatsapp: "WhatsApp",
  instagram_dm: "DM Instagram",
  email: "Email",
  call: "Telefonata",
  in_person: "Visita di persona",
};

const budgetLabel: Record<string, { label: string; color: string }> = {
  low: { label: "Budget basso", color: "#9ca3af" },
  mid: { label: "Budget medio", color: "#60a5fa" },
  high: { label: "Budget alto", color: "#a78bfa" },
  premium: { label: "Budget premium", color: "#fbbf24" },
};

const Skeleton = ({ h = "h-3" }: { h?: string }) => (
  <div className={`${h} rounded bg-white/5 animate-pulse`} />
);

const copy = (text: string, label: string) => {
  navigator.clipboard.writeText(text);
  toast.success(`${label} copiato`);
};

export default function DeepLeadIntel({ loading, report, audit, leadName, onUseHook }: Props) {
  if (loading) {
    return (
      <div className="p-4 rounded-2xl space-y-3"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.05), rgba(20,184,166,0.03))",
                 border: "1px solid rgba(124,58,237,0.18)" }}>
        <div className="flex items-center gap-2">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2, ease: "linear" }}>
            <Brain className="w-4 h-4" style={{ color: "#a78bfa" }} />
          </motion.div>
          <span className="text-xs font-bold text-white">
            Analisi profonda in corso su {leadName}…
          </span>
          <Loader2 className="w-3 h-3 animate-spin ml-auto" style={{ color: "#a78bfa" }} />
        </div>
        <div className="space-y-1.5">
          <Skeleton h="h-2.5" />
          <Skeleton h="h-2.5" />
          <Skeleton h="h-2" />
        </div>
        <p className="text-[10px] text-center" style={{ color: "#9ca3af" }}>
          🔍 Scraping sito web · 📊 Audit tecnico · 🧠 Generazione pitch personalizzato
        </p>
      </div>
    );
  }

  if (!report) return null;

  const bb = budgetLabel[report.budget_band] || budgetLabel.mid;
  const ChannelIcon = channelIcon[report.decision_maker.preferred_channel] || MessageCircle;

  return (
    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3">

      {/* ═══ EXECUTIVE SUMMARY ═══ */}
      <div className="p-4 rounded-2xl space-y-3"
        style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(20,184,166,0.04))",
                 border: "1px solid rgba(124,58,237,0.2)" }}>
        <div className="flex items-center gap-2">
          <Brain className="w-4 h-4" style={{ color: "#a78bfa" }} />
          <span className="text-xs font-bold text-white">Intel Report — {leadName}</span>
          <span className="ml-auto text-[8px] px-2 py-0.5 rounded-full font-bold"
            style={{ background: "rgba(167,139,250,0.15)", color: "#c4b5fd" }}>
            AI · DEEP RESEARCH
          </span>
        </div>
        <p className="text-[11px] leading-relaxed" style={{ color: "#e5e7eb" }}>
          {report.executive_summary}
        </p>
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2 rounded-lg text-center"
            style={{ background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.15)" }}>
            <Flame className="w-3 h-3 mx-auto mb-0.5" style={{ color: "#ef4444" }} />
            <p className="text-[7px] font-bold uppercase" style={{ color: "#9ca3af" }}>Opportunity</p>
            <p className="text-sm font-black" style={{ color: "#ef4444" }}>{report.opportunity_score}</p>
          </div>
          <div className="p-2 rounded-lg text-center"
            style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.15)" }}>
            <Zap className="w-3 h-3 mx-auto mb-0.5" style={{ color: "#f59e0b" }} />
            <p className="text-[7px] font-bold uppercase" style={{ color: "#9ca3af" }}>Urgenza</p>
            <p className="text-sm font-black" style={{ color: "#f59e0b" }}>{report.urgency_score}</p>
          </div>
          <div className="p-2 rounded-lg text-center"
            style={{ background: `${bb.color}15`, border: `1px solid ${bb.color}30` }}>
            <TrendingUp className="w-3 h-3 mx-auto mb-0.5" style={{ color: bb.color }} />
            <p className="text-[7px] font-bold uppercase" style={{ color: "#9ca3af" }}>Budget</p>
            <p className="text-[10px] font-black truncate" style={{ color: bb.color }}>{bb.label}</p>
          </div>
        </div>
      </div>

      {/* ═══ DECISION MAKER + BEST APPROACH ═══ */}
      <div className="p-3 rounded-2xl space-y-2"
        style={{ background: "rgba(59,130,246,0.05)", border: "1px solid rgba(59,130,246,0.15)" }}>
        <div className="flex items-center gap-2">
          <User className="w-3.5 h-3.5" style={{ color: "#60a5fa" }} />
          <span className="text-[11px] font-bold text-white">Chi contattare e come</span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div>
            <p className="text-[8px] uppercase font-bold" style={{ color: "#6b7280" }}>Ruolo</p>
            <p className="text-[10px] font-semibold text-white">{report.decision_maker.likely_role}</p>
          </div>
          <div>
            <p className="text-[8px] uppercase font-bold" style={{ color: "#6b7280" }}>Quando</p>
            <p className="text-[10px] font-semibold text-white flex items-center gap-1">
              <Clock className="w-2.5 h-2.5" />{report.decision_maker.best_contact_time}
            </p>
          </div>
          <div>
            <p className="text-[8px] uppercase font-bold" style={{ color: "#6b7280" }}>Canale</p>
            <p className="text-[10px] font-semibold flex items-center gap-1" style={{ color: "#60a5fa" }}>
              <ChannelIcon className="w-2.5 h-2.5" />
              {channelLabel[report.decision_maker.preferred_channel]}
            </p>
          </div>
        </div>
      </div>

      {/* ═══ DIGITAL AUDIT (real signals from scraped website) ═══ */}
      {audit && (
        <div className="p-3 rounded-2xl space-y-2"
          style={{ background: "rgba(20,184,166,0.04)", border: "1px solid rgba(20,184,166,0.12)" }}>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-3.5 h-3.5" style={{ color: "#14b8a6" }} />
            <span className="text-[11px] font-bold text-white">Audit Tecnico Sito (dati reali)</span>
            <span className="ml-auto text-[8px] px-1.5 py-0.5 rounded-full font-bold"
              style={{ background: audit.score < 50 ? "rgba(239,68,68,0.15)" : "rgba(245,158,11,0.15)",
                       color: audit.score < 50 ? "#f87171" : "#fbbf24" }}>
              Score {audit.score}/100
            </span>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            {[
              { label: "HTTPS", ok: audit.has_https, icon: Shield },
              { label: "Mobile", ok: audit.mobile_meta, icon: Smartphone },
              { label: "Booking", ok: audit.has_booking, icon: Calendar },
              { label: "Shop", ok: audit.has_ecommerce, icon: ShoppingCart },
              { label: "Chat", ok: audit.has_chat, icon: MessageSquare },
              { label: "Tracking", ok: audit.has_pixel, icon: BarChart3 },
            ].map((it) => (
              <div key={it.label} className="flex items-center gap-1 p-1.5 rounded-md"
                style={{ background: it.ok ? "rgba(16,185,129,0.06)" : "rgba(239,68,68,0.06)",
                         border: `1px solid ${it.ok ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.15)"}` }}>
                <it.icon className="w-2.5 h-2.5" style={{ color: it.ok ? "#34d399" : "#f87171" }} />
                <span className="text-[8px] font-semibold flex-1" style={{ color: "#d1d5db" }}>{it.label}</span>
                {it.ok ? <CheckCircle2 className="w-2.5 h-2.5" style={{ color: "#34d399" }} />
                       : <XCircle className="w-2.5 h-2.5" style={{ color: "#f87171" }} />}
              </div>
            ))}
          </div>
          <p className="text-[10px] leading-relaxed" style={{ color: "#9ca3af" }}>
            {report.digital_audit.current_state}
          </p>
        </div>
      )}

      {/* ═══ CRITICAL GAPS + QUICK WINS ═══ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        <div className="p-3 rounded-2xl space-y-2"
          style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
          <div className="flex items-center gap-1.5">
            <AlertTriangle className="w-3 h-3" style={{ color: "#ef4444" }} />
            <span className="text-[10px] font-bold text-white">Gap Critici</span>
          </div>
          <ul className="space-y-1">
            {report.digital_audit.critical_gaps.map((g, i) => (
              <li key={i} className="text-[10px] flex gap-1 items-start" style={{ color: "#e5e7eb" }}>
                <span style={{ color: "#ef4444" }}>•</span><span>{g}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="p-3 rounded-2xl space-y-2"
          style={{ background: "rgba(16,185,129,0.04)", border: "1px solid rgba(16,185,129,0.12)" }}>
          <div className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" style={{ color: "#10b981" }} />
            <span className="text-[10px] font-bold text-white">Quick Wins (sett. 1)</span>
          </div>
          <ul className="space-y-1">
            {report.digital_audit.quick_wins.map((w, i) => (
              <li key={i} className="text-[10px] flex gap-1 items-start" style={{ color: "#e5e7eb" }}>
                <span style={{ color: "#10b981" }}>✓</span><span>{w}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* ═══ PAIN POINTS WITH €COST ═══ */}
      <div className="p-3 rounded-2xl space-y-2"
        style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.12)" }}>
        <div className="flex items-center gap-2">
          <Target className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
          <span className="text-[11px] font-bold text-white">Pain Points Quantificati</span>
        </div>
        <div className="space-y-2">
          {report.pain_points.map((p, i) => (
            <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06 }}
              className="p-2 rounded-lg space-y-1"
              style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.1)" }}>
              <p className="text-[11px] font-semibold" style={{ color: "#fca5a5" }}>⚠️ {p.pain}</p>
              <p className="text-[9px] leading-relaxed" style={{ color: "#9ca3af" }}>
                <span className="font-bold" style={{ color: "#d1d5db" }}>Evidenza:</span> {p.evidence}
              </p>
              <p className="text-[9px] font-bold" style={{ color: "#fbbf24" }}>
                💸 Costo per loro: {p.cost_to_them}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* ═══ SALES HOOKS — copy & paste ═══ */}
      <div className="p-3 rounded-2xl space-y-2"
        style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)" }}>
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
          <span className="text-[11px] font-bold text-white">Hook di apertura (toccare per copiare)</span>
        </div>
        <div className="space-y-1.5">
          {report.sales_hooks.map((h, i) => (
            <button key={i} onClick={() => { copy(h, "Hook"); onUseHook?.(h); }}
              className="w-full text-left p-2 rounded-lg flex items-start gap-2 hover:bg-white/5 transition-colors"
              style={{ background: "rgba(167,139,250,0.04)", border: "1px solid rgba(167,139,250,0.1)" }}>
              <ChevronRight className="w-3 h-3 mt-0.5 shrink-0" style={{ color: "#a78bfa" }} />
              <span className="text-[10px] flex-1" style={{ color: "#e5e7eb" }}>{h}</span>
              <Copy className="w-2.5 h-2.5 shrink-0" style={{ color: "#a78bfa" }} />
            </button>
          ))}
        </div>
      </div>

      {/* ═══ RECOMMENDED PITCH (the closer's script) ═══ */}
      <div className="p-3 rounded-2xl space-y-2"
        style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.06), rgba(167,139,250,0.04))",
                 border: "1px solid rgba(20,184,166,0.18)" }}>
        <div className="flex items-center gap-2">
          <Award className="w-3.5 h-3.5" style={{ color: "#14b8a6" }} />
          <span className="text-[11px] font-bold text-white">Pitch Consigliato (closer script)</span>
        </div>
        <div className="space-y-1.5 text-[10px]">
          <div>
            <span className="font-bold uppercase text-[8px]" style={{ color: "#14b8a6" }}>Apertura: </span>
            <span style={{ color: "#e5e7eb" }}>"{report.recommended_pitch.opener}"</span>
          </div>
          <div>
            <span className="font-bold uppercase text-[8px]" style={{ color: "#14b8a6" }}>Value Prop: </span>
            <span style={{ color: "#e5e7eb" }}>{report.recommended_pitch.value_prop}</span>
          </div>
          <div>
            <span className="font-bold uppercase text-[8px]" style={{ color: "#14b8a6" }}>Prova: </span>
            <span style={{ color: "#e5e7eb" }}>{report.recommended_pitch.proof}</span>
          </div>
          <div>
            <span className="font-bold uppercase text-[8px]" style={{ color: "#14b8a6" }}>CTA: </span>
            <span style={{ color: "#e5e7eb" }}>{report.recommended_pitch.cta}</span>
          </div>
          <button onClick={() => copy(
            `${report.recommended_pitch.opener}\n\n${report.recommended_pitch.value_prop}\n\n${report.recommended_pitch.proof}\n\n${report.recommended_pitch.cta}`,
            "Pitch completo"
          )}
            className="w-full mt-1 py-1.5 rounded-lg text-[9px] font-bold flex items-center justify-center gap-1"
            style={{ background: "rgba(20,184,166,0.12)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.25)" }}>
            <Copy className="w-2.5 h-2.5" /> Copia pitch completo
          </button>
        </div>
      </div>

      {/* ═══ OBJECTIONS & RESPONSES ═══ */}
      <div className="p-3 rounded-2xl space-y-2"
        style={{ background: "rgba(245,158,11,0.04)", border: "1px solid rgba(245,158,11,0.12)" }}>
        <div className="flex items-center gap-2">
          <Shield className="w-3.5 h-3.5" style={{ color: "#f59e0b" }} />
          <span className="text-[11px] font-bold text-white">Gestione Obiezioni</span>
        </div>
        {report.objections.map((o, i) => (
          <div key={i} className="p-2 rounded-lg space-y-1"
            style={{ background: "rgba(245,158,11,0.05)", border: "1px solid rgba(245,158,11,0.1)" }}>
            <p className="text-[10px] font-semibold" style={{ color: "#fbbf24" }}>❓ {o.objection}</p>
            <p className="text-[10px] leading-relaxed" style={{ color: "#e5e7eb" }}>
              <span style={{ color: "#34d399" }}>→</span> {o.response}
            </p>
          </div>
        ))}
      </div>

      {/* ═══ RECOMMENDED PACKAGE ═══ */}
      <div className="p-3 rounded-2xl"
        style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(59,130,246,0.04))",
                 border: "1px solid rgba(167,139,250,0.2)" }}>
        <div className="flex items-center gap-2 mb-1.5">
          <Target className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
          <span className="text-[11px] font-bold text-white">Pacchetto consigliato</span>
        </div>
        <p className="text-sm font-black" style={{ color: "#a78bfa" }}>{report.recommended_package.name}</p>
        <p className="text-[10px] mt-1" style={{ color: "#d1d5db" }}>{report.recommended_package.why}</p>
        <p className="text-[10px] font-bold mt-1.5" style={{ color: "#34d399" }}>
          ⚡ ROI stimato in ~{report.recommended_package.estimated_roi_days} giorni
        </p>
      </div>

      {/* ═══ NEXT ACTIONS ═══ */}
      <div className="p-3 rounded-2xl space-y-2"
        style={{ background: "rgba(16,185,129,0.05)", border: "1px solid rgba(16,185,129,0.15)" }}>
        <div className="flex items-center gap-2">
          <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "#10b981" }} />
          <span className="text-[11px] font-bold text-white">Prossime mosse OGGI</span>
        </div>
        {report.next_actions.map((a, i) => (
          <div key={i} className="flex items-start gap-2 text-[10px]" style={{ color: "#e5e7eb" }}>
            <span className="font-bold" style={{ color: "#10b981" }}>{i + 1}.</span>
            <span>{a}</span>
          </div>
        ))}
      </div>

      {/* ═══ RISK FLAGS ═══ */}
      {report.risk_flags?.length > 0 && (
        <div className="p-3 rounded-2xl space-y-1"
          style={{ background: "rgba(239,68,68,0.05)", border: "1px solid rgba(239,68,68,0.15)" }}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
            <span className="text-[11px] font-bold text-white">Bandiere rosse</span>
          </div>
          {report.risk_flags.map((r, i) => (
            <p key={i} className="text-[10px] flex gap-1 items-start" style={{ color: "#fca5a5" }}>
              <span>🚩</span><span>{r}</span>
            </p>
          ))}
        </div>
      )}
    </motion.div>
  );
}
