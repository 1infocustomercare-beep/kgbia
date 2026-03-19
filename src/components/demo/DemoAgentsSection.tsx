/**
 * DemoAgentsSection — Full AI agent showcase with expandable visual workflows
 */
import { useRef, useState } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAgentsForSector, type AIAgent } from "@/config/sectorFeatures";
import { Bot, CheckCircle, ChevronDown, ChevronRight, Sparkles, Zap, ArrowRight } from "lucide-react";
import PremiumSectionBg from "./PremiumSectionBg";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAgentsForSector, type AIAgent } from "@/config/sectorFeatures";
import { Bot, CheckCircle, ChevronDown, ChevronRight, Sparkles, Zap, ArrowRight } from "lucide-react";

interface Props {
  sector: string;
  accentColor: string;
  sectorName: string;
}

export default function DemoAgentsSection({ sector, accentColor, sectorName }: Props) {
  const agents = getAllAgentsForSector(sector);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  const universalAgents = agents.filter(a => a.isUniversal);
  const sectorAgents = agents.filter(a => !a.isUniversal);

  // Aggregate stats
  const totalHours = agents.reduce((s, a) => s + (a.hoursPerWeek || 8), 0);
  const avgAccuracy = Math.round(agents.reduce((s, a) => s + (a.accuracy || 90), 0) / agents.length);

  return (
    <section ref={ref} className="py-16 px-4" style={{ background: "linear-gradient(180deg, rgba(10,10,20,0.98), rgba(0,0,0,0.95))" }}>
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div
          className="text-center mb-8"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-3 text-[0.6rem] px-3 py-1" style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}>
            <Bot className="w-3 h-3 mr-1 inline" /> {agents.length} AGENTI AI ATTIVI
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Il Tuo Team AI per{" "}
            <span style={{ color: accentColor }}>{sectorName}</span>
          </h2>
          <p className="text-sm text-white/40 max-w-xl mx-auto">
            Agenti AI specializzati che lavorano 24/7 per automatizzare operazioni, acquisire clienti e far crescere il tuo business
          </p>
        </motion.div>

        {/* Aggregate KPIs */}
        <motion.div
          className="grid grid-cols-3 gap-3 mb-10 max-w-md mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.2 }}
        >
          {[
            { label: "Agenti Attivi", value: `${agents.length}`, icon: "🤖" },
            { label: "Ore Risparmiate/Sett", value: `${totalHours}h`, icon: "⏱️" },
            { label: "Accuratezza Media", value: `${avgAccuracy}%`, icon: "🎯" },
          ].map((s, i) => (
            <div key={i} className="text-center p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
              <span className="text-lg">{s.icon}</span>
              <p className="text-base font-bold text-white mt-1">{s.value}</p>
              <p className="text-[0.55rem] text-white/35">{s.label}</p>
            </div>
          ))}
        </motion.div>

        {/* Universal agents */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Agenti Universali — Ogni settore</h3>
            <Badge variant="outline" className="text-[0.5rem] border-white/10 text-white/30 ml-auto">{universalAgents.length}</Badge>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {universalAgents.map((agent, i) => (
              <AgentCardWithWorkflow key={agent.name} agent={agent} accentColor={accentColor} delay={i * 0.04} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* Sector-specific agents */}
        {sectorAgents.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: accentColor }} />
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Specialisti — Solo per {sectorName}</h3>
              <Badge variant="outline" className="text-[0.5rem] border-white/10 text-white/30 ml-auto">{sectorAgents.length}</Badge>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {sectorAgents.map((agent, i) => (
                <AgentCardWithWorkflow key={agent.name} agent={agent} accentColor={accentColor} delay={i * 0.04} isInView={isInView} isSectorSpecific />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AgentCardWithWorkflow({ agent, accentColor, delay, isInView, isSectorSpecific }: {
  agent: AIAgent; accentColor: string; delay: number; isInView: boolean; isSectorSpecific?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);
  const [animatingStep, setAnimatingStep] = useState(-1);

  const handleExpand = () => {
    const next = !expanded;
    setExpanded(next);
    if (next && agent.workflow?.length) {
      // Animate steps sequentially
      agent.workflow.forEach((_, i) => {
        setTimeout(() => setAnimatingStep(i), i * 600);
      });
      setTimeout(() => setAnimatingStep(-1), (agent.workflow.length) * 600 + 1000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
    >
      <Card
        className="bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all h-full"
        style={isSectorSpecific ? { borderColor: `${accentColor}20` } : {}}
      >
        <CardContent className="p-4">
          {/* Header */}
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{agent.emoji}</span>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-white">{agent.name}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[0.5rem] text-emerald-400 font-medium">ATTIVO 24/7</span>
                {isSectorSpecific && <Badge className="text-[0.45rem] px-1 py-0" style={{ background: `${accentColor}20`, color: accentColor }}>Specialista</Badge>}
                {agent.category && <Badge variant="outline" className="text-[0.45rem] px-1 py-0 border-white/10 text-white/30">{agent.category}</Badge>}
              </div>
            </div>
          </div>

          <p className="text-[0.65rem] text-white/50 leading-relaxed mb-3">{agent.desc}</p>

          {/* Capabilities */}
          <div className="flex flex-wrap gap-1 mb-3">
            {agent.capabilities.map((c: string) => (
              <Badge key={c} variant="outline" className="text-[0.5rem] border-white/10 text-white/40 px-1.5">{c}</Badge>
            ))}
          </div>

          {/* Metrics */}
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04] mb-2">
            <div className="text-center">
              <p className="text-xs font-bold text-white">{agent.accuracy || 95}%</p>
              <p className="text-[0.45rem] text-white/30">Precisione</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold text-white">{agent.hoursPerWeek || 10}h</p>
              <p className="text-[0.45rem] text-white/30">Risparmio/sett</p>
            </div>
            <div className="text-center">
              <p className="text-xs font-bold" style={{ color: accentColor }}>
                <CheckCircle className="w-3 h-3 inline mr-0.5" />Attivo
              </p>
              <p className="text-[0.45rem] text-white/30">Stato</p>
            </div>
          </div>

          {/* Expand button */}
          {agent.workflow && agent.workflow.length > 0 && (
            <button
              onClick={handleExpand}
              className="w-full flex items-center justify-center gap-1.5 py-2 mt-1 rounded-lg text-[0.6rem] font-semibold transition-all hover:bg-white/[0.04]"
              style={{ color: accentColor }}
            >
              {expanded ? "Chiudi workflow" : "Vedi come lavora →"}
              {expanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
            </button>
          )}

          {/* Expandable workflow */}
          <AnimatePresence>
            {expanded && agent.workflow && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="pt-3 mt-2 border-t border-white/[0.06]">
                  {/* Workflow steps */}
                  <div className="space-y-2">
                    {agent.workflow.map((step, i) => (
                      <motion.div
                        key={i}
                        className="flex items-start gap-2.5 relative"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.12 }}
                      >
                        {/* Step connector line */}
                        {i < agent.workflow!.length - 1 && (
                          <div className="absolute left-[13px] top-[26px] w-[1px] h-[calc(100%+2px)]" style={{ background: `${accentColor}20` }} />
                        )}
                        {/* Step icon */}
                        <div
                          className="w-[26px] h-[26px] rounded-lg flex items-center justify-center text-sm shrink-0 relative z-10 transition-all duration-500"
                          style={{
                            background: animatingStep === i ? `${accentColor}40` : `${accentColor}15`,
                            border: `1px solid ${animatingStep === i ? accentColor : `${accentColor}30`}`,
                            boxShadow: animatingStep === i ? `0 0 12px ${accentColor}40` : 'none',
                          }}
                        >
                          {step.icon}
                        </div>
                        <div className="min-w-0 pt-0.5">
                          <p className="text-[0.6rem] font-bold text-white/80">{step.label}</p>
                          <p className="text-[0.5rem] text-white/35 leading-relaxed">{step.detail}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* Example */}
                  {agent.example && (
                    <div className="mt-3 p-2.5 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                      <p className="text-[0.5rem] font-bold text-white/50 uppercase tracking-wider mb-1">💡 Esempio Concreto</p>
                      <p className="text-[0.55rem] text-white/60 leading-relaxed italic">{agent.example}</p>
                    </div>
                  )}

                  {/* Result */}
                  {agent.result && (
                    <div className="mt-2 p-2 rounded-lg text-center" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                      <p className="text-[0.55rem] font-bold" style={{ color: accentColor }}>{agent.result}</p>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
