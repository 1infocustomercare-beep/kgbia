/**
 * DemoAgentsSection — Showcases ALL AI agents (universal + sector-specific)
 */
import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getAllAgentsForSector } from "@/config/sectorFeatures";
import { Bot, CheckCircle, Clock, Sparkles, Zap } from "lucide-react";

interface Props {
  sector: string;
  accentColor: string;
  sectorName: string;
}

export default function DemoAgentsSection({ sector, accentColor, sectorName }: Props) {
  const agents = getAllAgentsForSector(sector);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 px-4" style={{ background: "linear-gradient(180deg, rgba(10,10,20,0.98), rgba(0,0,0,0.95))" }}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <Badge className="mb-3 text-[0.6rem] px-3 py-1" style={{ background: `${accentColor}20`, color: accentColor, border: `1px solid ${accentColor}30` }}>
            <Bot className="w-3 h-3 mr-1 inline" /> {agents.length} AGENTI AI
          </Badge>
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3">
            Il Tuo Team AI per{" "}
            <span style={{ color: accentColor }}>{sectorName}</span>
          </h2>
          <p className="text-sm text-white/40 max-w-xl mx-auto">
            Agenti AI specializzati che lavorano 24/7 per automatizzare operazioni, acquisire clienti e far crescere il tuo business
          </p>
        </motion.div>

        {/* Universal agents */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Sparkles className="w-4 h-4" style={{ color: accentColor }} />
            <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Agenti Universali — Ogni settore</h3>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {agents.filter(a => a.isUniversal).map((agent, i) => (
              <AgentCard key={agent.name} agent={agent} accentColor={accentColor} delay={i * 0.05} isInView={isInView} />
            ))}
          </div>
        </div>

        {/* Sector-specific agents */}
        {agents.filter(a => !a.isUniversal).length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Zap className="w-4 h-4" style={{ color: accentColor }} />
              <h3 className="text-xs font-bold text-white/50 uppercase tracking-wider">Specialisti — Solo per {sectorName}</h3>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {agents.filter(a => !a.isUniversal).map((agent, i) => (
                <AgentCard key={agent.name} agent={agent} accentColor={accentColor} delay={i * 0.05} isInView={isInView} isSectorSpecific />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

function AgentCard({ agent, accentColor, delay, isInView, isSectorSpecific }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ delay }}
    >
      <Card className="bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all h-full" style={isSectorSpecific ? { borderColor: `${accentColor}20` } : {}}>
        <CardContent className="p-4">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-2xl">{agent.emoji}</span>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white">{agent.name}</p>
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[0.5rem] text-emerald-400 font-medium">ATTIVO 24/7</span>
                {isSectorSpecific && <Badge className="text-[0.45rem] px-1 py-0" style={{ background: `${accentColor}20`, color: accentColor }}>Specialista</Badge>}
              </div>
            </div>
          </div>
          <p className="text-[0.65rem] text-white/50 leading-relaxed mb-3">{agent.desc}</p>
          <div className="flex flex-wrap gap-1 mb-3">
            {agent.capabilities.map((c: string) => (
              <Badge key={c} variant="outline" className="text-[0.5rem] border-white/10 text-white/40 px-1.5">{c}</Badge>
            ))}
          </div>
          <div className="grid grid-cols-3 gap-2 pt-2 border-t border-white/[0.04]">
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
        </CardContent>
      </Card>
    </motion.div>
  );
}
