import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/types/agent";
import type { Agent } from "@/types/agent";
import { getAgentImage } from "@/lib/agent-images";

interface Props {
  agent: Agent;
  index: number;
  installs: number;
  successRate: number;
  onToggle: (id: string, newStatus: string) => void;
  onClick: (agent: Agent) => void;
}

const SECTOR_LABELS: Record<string, string> = {
  food: "Food", ncc: "NCC", beauty: "Beauty", healthcare: "Health",
  construction: "Edilizia", retail: "Retail", fitness: "Fitness",
  hospitality: "Hotel", beach: "Spiaggia", plumber: "Idraulico",
  agriturismo: "Agriturismo", cleaning: "Pulizie", legal: "Legale",
  accounting: "Contabilità", garage: "Officina", photography: "Foto",
  gardening: "Giardinaggio", veterinary: "Veterinario", tattoo: "Tattoo",
  childcare: "Asilo", education: "Formazione", events: "Eventi",
  logistics: "Logistica",
};

export default function AgentCard({ agent, index, installs, successRate, onToggle, onClick }: Props) {
  const cat = CATEGORY_LABELS[agent.category] || { label: agent.category, color: "#888", icon: "🤖" };
  const pricing = agent.pricing as { base: number; currency: string } | null;
  const price = pricing?.base || 0;
  const isActive = agent.status === "active";
  const isBeta = agent.status === "beta";
  const agentImg = getAgentImage(agent.name, agent.category, agent.sectors || []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.02 }}
      onClick={() => onClick(agent)}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl hover:border-primary/30 transition-all duration-200"
    >
      {/* Agent image banner */}
      <div className="relative h-28 overflow-hidden bg-gradient-to-br from-white/5 to-white/[0.02]">
        {agentImg && (
          <img
            src={agentImg}
            alt={agent.name}
            className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
        )}
        {/* Price badge overlay */}
        <div className="absolute top-2 right-2">
          {price > 0 ? (
            <span className="text-[0.65rem] font-bold px-2 py-1 rounded-full bg-background/80 backdrop-blur text-violet-400 border border-violet-500/30">
              €{price}/mo
            </span>
          ) : (
            <span className="text-[0.65rem] font-bold px-2 py-1 rounded-full bg-background/80 backdrop-blur text-emerald-400 border border-emerald-500/30">
              Incluso
            </span>
          )}
        </div>
        {isBeta && (
          <div className="absolute top-2 left-2">
            <Badge className="text-[0.6rem] px-1.5 bg-amber-500/90 text-white border-0">
              Beta
            </Badge>
          </div>
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        {/* Emoji icon */}
        <div
          className="absolute bottom-2 left-3 w-10 h-10 rounded-xl flex items-center justify-center text-xl border border-white/10 backdrop-blur-md"
          style={{ backgroundColor: `${agent.color_hex}40` }}
        >
          {agent.icon_emoji}
        </div>
      </div>

      {/* Content */}
      <div className="p-3 pt-2 space-y-2">
        <h3 className="font-semibold text-foreground text-sm leading-tight">{agent.name}</h3>

        <div className="flex items-center gap-1 flex-wrap">
          <Badge variant="outline" className="text-[0.55rem] px-1.5 py-0" style={{ borderColor: cat.color, color: cat.color }}>
            {cat.icon} {cat.label}
          </Badge>
          <Badge variant="outline" className="text-[0.55rem] px-1.5 py-0 border-white/20 text-muted-foreground">
            {agent.type === "universal" ? "🌐 Universale" : "🎯 Settore"}
          </Badge>
        </div>

        <p className="text-[0.7rem] text-muted-foreground line-clamp-2 leading-relaxed">{agent.description_it}</p>

        {/* Sectors */}
        <div className="flex flex-wrap gap-1">
          {(agent.sectors || []).slice(0, 3).map((s) => (
            <span key={s} className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
              {SECTOR_LABELS[s] || s}
            </span>
          ))}
          {(agent.sectors || []).length > 3 && (
            <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
              +{agent.sectors.length - 3}
            </span>
          )}
        </div>

        {/* Metrics row */}
        <div className="flex items-center justify-between text-[0.6rem] text-muted-foreground">
          <span>{installs} installazioni</span>
          <span>{successRate}% success</span>
        </div>

        {/* Status toggle */}
        <div
          className="flex items-center justify-between pt-2 border-t border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <span className={`text-xs font-medium ${isActive ? "text-emerald-400" : isBeta ? "text-amber-400" : "text-red-400"}`}>
            {isActive ? "Attivo" : isBeta ? "Beta" : "Inattivo"}
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => onToggle(agent.id, checked ? "active" : "inactive")}
          />
        </div>
      </div>
    </motion.div>
  );
}
