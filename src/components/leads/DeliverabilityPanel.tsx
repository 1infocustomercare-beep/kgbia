import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck, AlertTriangle, AlertCircle, Info, ChevronDown, ChevronUp, Sparkles, Mail,
} from "lucide-react";
import {
  analyzeEmailDeliverability,
  DELIVERABILITY_BEST_PRACTICES,
  type DeliverabilityResult,
} from "@/lib/email-templates/deliverability";

interface InlineProps {
  subject: string;
  body: string;
  hasUnsubscribe?: boolean;
  hasSignature?: boolean;
  compact?: boolean;
}

/**
 * Hint inline mostrato accanto al composer / preview email.
 * Si aggiorna live al cambio di subject/body.
 */
export function DeliverabilityHints({ subject, body, hasUnsubscribe = true, hasSignature = true, compact }: InlineProps) {
  const [expanded, setExpanded] = useState(!compact);
  const result = useMemo(
    () => analyzeEmailDeliverability({ subject, body, hasUnsubscribe, hasSignature }),
    [subject, body, hasUnsubscribe, hasSignature]
  );

  const ringColor =
    result.rating === "excellent" ? "ring-emerald-400/40 from-emerald-500/15"
    : result.rating === "good" ? "ring-violet-400/40 from-violet-500/15"
    : result.rating === "fair" ? "ring-amber-400/40 from-amber-500/15"
    : "ring-red-400/40 from-red-500/15";

  const badgeColor =
    result.rating === "excellent" ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/30"
    : result.rating === "good" ? "bg-violet-500/20 text-violet-300 border-violet-400/30"
    : result.rating === "fair" ? "bg-amber-500/20 text-amber-300 border-amber-400/30"
    : "bg-red-500/20 text-red-300 border-red-400/30";

  return (
    <div className={`rounded-xl border border-white/10 bg-gradient-to-br ${ringColor} to-transparent ring-1 ${ringColor.replace("from-", "")} p-3`}>
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex items-center justify-between gap-2"
      >
        <div className="flex items-center gap-2 min-w-0">
          <ShieldCheck className="w-4 h-4 text-violet-300 shrink-0" />
          <div className="min-w-0 text-left">
            <p className="text-[11px] uppercase tracking-wider text-violet-300 font-bold">Deliverability score</p>
            <p className="text-xs text-muted-foreground truncate">{result.inboxLikelihood}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className={`px-2 py-0.5 rounded-md border text-[11px] font-black ${badgeColor}`}>{result.score}/100</span>
          {expanded ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
        </div>
      </button>

      {expanded && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-3 space-y-2">
          {result.issues.length === 0 && (
            <div className="flex items-center gap-2 text-emerald-300 text-xs"><Sparkles className="w-3.5 h-3.5" /> Nessun problema rilevato — pronta da inviare.</div>
          )}
          {result.issues.map((iss, i) => {
            const Icon = iss.level === "critical" ? AlertCircle : iss.level === "warning" ? AlertTriangle : Info;
            const color = iss.level === "critical" ? "text-red-300 bg-red-500/10 border-red-400/20"
              : iss.level === "warning" ? "text-amber-300 bg-amber-500/10 border-amber-400/20"
              : "text-violet-300 bg-violet-500/10 border-violet-400/20";
            return (
              <div key={i} className={`flex gap-2 p-2 rounded-lg border ${color}`}>
                <Icon className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                <div className="min-w-0 text-[11px]">
                  <p className="font-bold leading-tight">{iss.message}</p>
                  {iss.fix && <p className="text-muted-foreground mt-0.5 leading-snug">{iss.fix}</p>}
                </div>
              </div>
            );
          })}
          {result.positives.length > 0 && (
            <div className="text-[10px] text-emerald-300/80 flex flex-wrap gap-1 pt-1">
              {result.positives.map((p, i) => (
                <span key={i} className="px-1.5 py-0.5 rounded bg-emerald-500/10 border border-emerald-400/20">✓ {p}</span>
              ))}
            </div>
          )}
        </motion.div>
      )}
    </div>
  );
}

/**
 * Pannello completo "Best practice & deliverability" con tutte le linee guida.
 */
export default function DeliverabilityPanel() {
  const [openId, setOpenId] = useState<string | null>(DELIVERABILITY_BEST_PRACTICES[0].id);

  return (
    <div className="space-y-3">
      <div className="rounded-2xl border border-violet-400/20 bg-gradient-to-br from-violet-950/40 via-zinc-950/60 to-cyan-950/30 p-4">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center shrink-0">
            <Mail className="w-4 h-4 text-white" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] uppercase tracking-[0.16em] text-violet-300 font-black">Guida deliverability</p>
            <h3 className="text-sm sm:text-base font-bold text-white leading-tight">Linee guida per arrivare in inbox e convertire al massimo</h3>
            <p className="text-xs text-muted-foreground mt-1">Le 4 leve che decidono se la tua email finisce in inbox, in promozioni o in spam — e come usarle a tuo favore.</p>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        {DELIVERABILITY_BEST_PRACTICES.map((sec) => {
          const open = openId === sec.id;
          return (
            <div key={sec.id} className="rounded-xl border border-white/10 bg-white/[0.03] overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : sec.id)}
                className="w-full px-3 py-2.5 flex items-center justify-between gap-2 hover:bg-white/5 transition-colors"
              >
                <div className="flex items-start gap-2 min-w-0 text-left">
                  <ShieldCheck className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-zinc-100 leading-tight">{sec.title}</p>
                    <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">{sec.description}</p>
                  </div>
                </div>
                {open ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" /> : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />}
              </button>
              {open && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="px-3 pb-3 pt-1 space-y-2">
                  <p className="text-[11px] text-muted-foreground leading-relaxed">{sec.description}</p>
                  {sec.tips.map((tip, i) => (
                    <div key={i} className="rounded-lg border border-white/5 bg-zinc-950/50 px-3 py-2">
                      <p className="text-[12px] font-bold text-violet-200">{tip.label}</p>
                      <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{tip.detail}</p>
                    </div>
                  ))}
                </motion.div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
