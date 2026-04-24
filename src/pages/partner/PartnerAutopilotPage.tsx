// ══════════════════════════════════════════════════════════════
// PartnerAutopilotPage — Empire Autopilot (powered by Arianna)
// Cockpit UNICO che integra l'intero ciclo di vendita autonomo:
//   1. Caccia Lead (Arianna Scout adattivo)
//   2. Analisi Pain (Pain Detector AI)
//   3. Calcolo ROI (Dossier finanziario)
//   4. Conversazioni multi-canale (Conversation Engine)
//   5. Sales Coach (suggerimenti next-best-action)
//   6. Leaderboard & Gamification
// + Configurazione, Pianificazione server-side e Stato live.
// ══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Bot, Sparkles, Rocket, Zap, Search, Brain, Calculator, MessageSquare, Trophy, ArrowRight } from "lucide-react";
import AriannaLeadScoutPanel from "@/components/leads/AriannaLeadScoutPanel";
import PainScanCard from "@/components/autopilot/PainScanCard";
import ROIDossier from "@/components/autopilot/ROIDossier";
import AutopilotConversations from "@/components/autopilot/AutopilotConversations";
import SalesCoachPanel from "@/components/autopilot/SalesCoachPanel";
import AutopilotLeaderboard from "@/components/autopilot/AutopilotLeaderboard";
import AutopilotConfigCard from "@/components/autopilot/AutopilotConfigCard";
import AutopilotScheduleStatus from "@/components/autopilot/AutopilotScheduleStatus";
import AutopilotSectorPausePanel from "@/components/autopilot/AutopilotSectorPausePanel";
import AutopilotPrioritySimulator from "@/components/autopilot/AutopilotPrioritySimulator";

// ── Mini-step indicator del flusso end-to-end ─────────────────
const FLOW_STEPS = [
  { icon: Search, label: "Caccia", color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
  { icon: Brain, label: "Pain", color: "text-rose-500", bg: "bg-rose-500/10", border: "border-rose-500/20" },
  { icon: Calculator, label: "ROI", color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
  { icon: MessageSquare, label: "Conversa", color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
  { icon: Trophy, label: "Chiusura", color: "text-fuchsia-500", bg: "bg-fuchsia-500/10", border: "border-fuchsia-500/20" },
];

function FlowPipeline() {
  return (
    <div className="flex items-center justify-center gap-1 lg:gap-2 flex-wrap">
      {FLOW_STEPS.map((step, i) => (
        <div key={step.label} className="flex items-center gap-1 lg:gap-2">
          <div
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border ${step.bg} ${step.border}`}
            title={`Step ${i + 1}: ${step.label}`}
          >
            <step.icon className={`w-3 h-3 ${step.color}`} />
            <span className={`text-[10px] font-bold uppercase tracking-wider ${step.color}`}>
              {step.label}
            </span>
          </div>
          {i < FLOW_STEPS.length - 1 && (
            <ArrowRight className="w-3 h-3 text-muted-foreground/40" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── Sezione con header numerato per scandire le fasi ──────────
function PhaseSection({
  step,
  title,
  subtitle,
  icon: Icon,
  accent,
  children,
}: {
  step: number;
  title: string;
  subtitle: string;
  icon: any;
  accent: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm ${accent}`}
        >
          {step}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Icon className="w-4 h-4 text-foreground/70" />
            <h2 className="text-sm lg:text-base font-display font-bold text-foreground">{title}</h2>
          </div>
          <p className="text-[11px] lg:text-xs text-muted-foreground">{subtitle}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function PartnerAutopilotPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-8 py-4 lg:py-6 space-y-6">
      {/* ── HERO UNIFICATO ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="partner-card rounded-2xl p-5 lg:p-7 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl bg-primary/30" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl bg-amber-500/20" />
          <div className="absolute top-1/2 left-1/2 w-72 h-72 rounded-full blur-3xl bg-emerald-500/10 -translate-x-1/2 -translate-y-1/2" />
        </div>
        <div className="relative space-y-4">
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                <Bot className="w-6 h-6 text-primary" />
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground">
                    Empire Autopilot
                  </h1>
                  <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground">
                    powered by Arianna
                  </span>
                  <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    OS v1
                  </span>
                </div>
                <p className="text-xs lg:text-sm text-muted-foreground max-w-2xl">
                  Un unico sistema autonomo: Arianna caccia lead caldi, scansiona dolori, calcola ROI,
                  conversa multi-canale e ti coacha verso la chiusura — tutto in un solo cockpit.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <Zap className="w-3 h-3" /> Multi-canale
              </span>
              <span className="text-[10px] font-semibold text-primary flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-primary/10 border border-primary/20">
                <Sparkles className="w-3 h-3" /> Gemini 2.5 Pro
              </span>
              <span className="text-[10px] font-semibold text-amber-500 flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <Rocket className="w-3 h-3" /> Auto-scan 24/7
              </span>
            </div>
          </div>

          {/* Pipeline visiva del flusso end-to-end */}
          <div className="pt-2 border-t border-border/40">
            <FlowPipeline />
          </div>
        </div>
      </motion.div>

      {/* ── CONTROL ROOM: Config + Schedule ── */}
      <PhaseSection
        step={0}
        title="Control Room"
        subtitle="Configurazione, orari operativi, cap giornaliero e canali attivi"
        icon={Sparkles}
        accent="bg-muted/40 text-muted-foreground border border-border/40"
      >
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
          <AutopilotConfigCard />
          <AutopilotScheduleStatus />
        </div>
        <AutopilotSectorPausePanel />
        <AutopilotPrioritySimulator />
      </PhaseSection>

      {/* ── FASE 1: Caccia Lead Arianna (autopilot adattivo) ── */}
      <PhaseSection
        step={1}
        title="Caccia Lead — Arianna Scout"
        subtitle="Arianna sceglie zone × settori, filtra solo lead caldi e li alimenta nel pipeline"
        icon={Search}
        accent="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30"
      >
        <AriannaLeadScoutPanel />
      </PhaseSection>

      {/* ── FASE 2: Pain Detector ── */}
      <PhaseSection
        step={2}
        title="Pain Detector — Analisi dolori AI"
        subtitle="Per ogni lead: scraping sito, identificazione frizioni e perdita di revenue"
        icon={Brain}
        accent="bg-rose-500/15 text-rose-500 border border-rose-500/30"
      >
        <PainScanCard />
      </PhaseSection>

      {/* ── FASE 3 + 4: ROI Dossier + Conversazioni ── */}
      <PhaseSection
        step={3}
        title="ROI & Conversazioni multi-canale"
        subtitle="Dossier finanziario per ogni lead + sequenza autonoma email/chat/WhatsApp"
        icon={Calculator}
        accent="bg-amber-500/15 text-amber-500 border border-amber-500/30"
      >
        <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-4">
          <ROIDossier />
          <AutopilotConversations />
        </div>
      </PhaseSection>

      {/* ── FASE 5: Coach + Leaderboard ── */}
      <PhaseSection
        step={4}
        title="Chiusura — Sales Coach & Leaderboard"
        subtitle="Suggerimenti next-best-action, XP, livelli e classifica venditori"
        icon={Trophy}
        accent="bg-fuchsia-500/15 text-fuchsia-500 border border-fuchsia-500/30"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <SalesCoachPanel />
          <AutopilotLeaderboard />
        </div>
      </PhaseSection>
    </div>
  );
}
