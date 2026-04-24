// ══════════════════════════════════════════════════════════════
// PartnerAutopilotPage — Empire Autopilot OS Cockpit
// Hub centrale che integra Pain Detector + ROI + Conversations
// + Sales Coach + Leaderboard, tutto sopra il sistema Arianna esistente.
// ══════════════════════════════════════════════════════════════
import { motion } from "framer-motion";
import { Bot, Sparkles, Rocket, Zap } from "lucide-react";
import PainScanCard from "@/components/autopilot/PainScanCard";
import ROIDossier from "@/components/autopilot/ROIDossier";
import AutopilotConversations from "@/components/autopilot/AutopilotConversations";
import SalesCoachPanel from "@/components/autopilot/SalesCoachPanel";
import AutopilotLeaderboard from "@/components/autopilot/AutopilotLeaderboard";
import AutopilotConfigCard from "@/components/autopilot/AutopilotConfigCard";
import AutopilotScheduleStatus from "@/components/autopilot/AutopilotScheduleStatus";

export default function PartnerAutopilotPage() {
  return (
    <div className="max-w-[1600px] mx-auto px-3 lg:px-8 py-4 lg:py-6 space-y-5">
      {/* ── HERO ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="partner-card rounded-2xl p-5 lg:p-7 relative overflow-hidden"
      >
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl bg-primary/30" />
          <div className="absolute bottom-0 left-0 w-48 h-48 rounded-full blur-3xl bg-amber-500/20" />
        </div>
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-xl lg:text-2xl font-display font-bold text-foreground">
                  Empire Autopilot OS
                </h1>
                <span className="text-[9px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                  Phase 1
                </span>
              </div>
              <p className="text-xs lg:text-sm text-muted-foreground max-w-2xl">
                Arianna scansiona dolori, calcola ROI, conversa con i lead in multi-canale e ti coacha verso
                la chiusura. Tutto sopra il tuo sistema Lead/Preview esistente.
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
              <Rocket className="w-3 h-3" /> Auto-scan
            </span>
          </div>
        </div>
      </motion.div>

      {/* ── ROW 1: Config + Pain Detector ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-4">
        <AutopilotConfigCard />
        <PainScanCard />
      </div>

      {/* ── ROW 1.5: Pianificazione server-side ── */}
      <AutopilotScheduleStatus />

      {/* ── ROW 2: ROI + Conversations ── */}
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.5fr] gap-4">
        <ROIDossier />
        <AutopilotConversations />
      </div>

      {/* ── ROW 3: Coach + Leaderboard ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <SalesCoachPanel />
        <AutopilotLeaderboard />
      </div>
    </div>
  );
}
