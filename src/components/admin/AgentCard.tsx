import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { CATEGORY_LABELS } from "@/types/agent";
import type { Agent } from "@/types/agent";

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.03 }}
      onClick={() => onClick(agent)}
      className="group bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-4 cursor-pointer hover:-translate-y-0.5 hover:shadow-2xl transition-all duration-200"
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
          style={{ backgroundColor: `${agent.color_hex}20` }}
        >
          {agent.icon_emoji}
        </div>
        <div className="text-right">
          {price > 0 ? (
            <span className="text-sm font-bold text-violet-400">€{price}/mo</span>
          ) : (
            <span className="text-sm font-bold text-emerald-400">Incluso</span>
          )}
        </div>
      </div>

      <h3 className="font-semibold text-foreground text-sm mb-1">{agent.name}</h3>

      <div className="flex items-center gap-1.5 mb-2">
        <Badge variant="outline" className="text-[0.6rem] px-1.5" style={{ borderColor: cat.color, color: cat.color }}>
          {cat.icon} {cat.label}
        </Badge>
        <Badge variant="outline" className="text-[0.6rem] px-1.5 border-white/20 text-muted-foreground">
          {agent.type === "universal" ? "🌐 Universale" : "🎯 Settore"}
        </Badge>
        {isBeta && (
          <Badge className="text-[0.6rem] px-1.5 bg-amber-500/20 text-amber-400 border-amber-500/30">
            Beta
          </Badge>
        )}
      </div>

      <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{agent.description_it}</p>

      {/* Sectors */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(agent.sectors || []).slice(0, 3).map((s) => (
          <span key={s} className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
            {SECTOR_LABELS[s] || s}
          </span>
        ))}
        {(agent.sectors || []).length > 3 && (
          <span className="text-[0.55rem] px-1.5 py-0.5 rounded-full bg-white/5 text-muted-foreground">
            +{agent.sectors.length - 3}
          </span>
        )}
      </div>

      {/* Metrics row */}
      <div className="flex items-center justify-between text-[0.65rem] text-muted-foreground mb-3">
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
    </motion.div>
  );
}
