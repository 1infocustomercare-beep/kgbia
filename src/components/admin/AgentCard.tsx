import { motion } from "framer-motion";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Lock } from "lucide-react";
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
  const isInactive = agent.status === "inactive";
  const agentImg = getAgentImage(agent.name, agent.category, agent.sectors || []);
  const isPaid = price > 0;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.015, type: "spring", stiffness: 300, damping: 25 }}
      onClick={() => onClick(agent)}
      className={`group relative bg-white/[0.03] backdrop-blur-xl border rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-1 hover:shadow-2xl transition-all duration-300 ${
        isInactive
          ? "border-red-500/20 opacity-60"
          : isActive
          ? "border-white/10 hover:border-primary/40"
          : "border-amber-500/20"
      }`}
    >
      {/* Inactive lock overlay */}
      {isInactive && (
        <div className="absolute inset-0 z-10 bg-background/60 backdrop-blur-sm flex flex-col items-center justify-center gap-2">
          <Lock className="w-6 h-6 text-red-400" />
          <span className="text-[0.6rem] text-red-400 font-medium">Disattivato</span>
        </div>
      )}

      {/* Agent alien image */}
      <div className="relative h-24 overflow-hidden bg-gradient-to-br from-primary/10 via-violet-500/5 to-transparent">
        {agentImg && (
          <motion.img
            src={agentImg}
            alt={agent.name}
            className="absolute inset-0 w-full h-full object-contain p-2 drop-shadow-2xl"
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 200 }}
          />
        )}
        {/* Glow effect */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />

        {/* Price + beta badges */}
        <div className="absolute top-1.5 right-1.5 flex flex-col gap-1 items-end">
          {isPaid ? (
            <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-violet-500/80 text-white backdrop-blur-sm">
              €{price}/mo
            </span>
          ) : (
            <span className="text-[0.55rem] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/80 text-white backdrop-blur-sm">
              Free
            </span>
          )}
          {isBeta && (
            <span className="text-[0.5rem] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/90 text-white">
              BETA
            </span>
          )}
        </div>

        {/* Category color bar */}
        <div
          className="absolute bottom-0 left-0 right-0 h-0.5"
          style={{ backgroundColor: cat.color }}
        />
      </div>

      {/* Content */}
      <div className="p-2.5 space-y-1.5">
        <div className="flex items-start gap-1.5">
          <span className="text-base leading-none">{agent.icon_emoji}</span>
          <h3 className="font-semibold text-foreground text-[0.75rem] leading-tight flex-1">{agent.name}</h3>
        </div>

        <div className="flex items-center gap-1 flex-wrap">
          <Badge
            variant="outline"
            className="text-[0.5rem] px-1 py-0 h-4 rounded-md"
            style={{ borderColor: cat.color, color: cat.color }}
          >
            {cat.icon} {cat.label}
          </Badge>
          <Badge variant="outline" className="text-[0.5rem] px-1 py-0 h-4 rounded-md border-white/15 text-muted-foreground">
            {agent.type === "universal" ? "🌐" : "🎯"}
          </Badge>
        </div>

        <p className="text-[0.6rem] text-muted-foreground line-clamp-2 leading-relaxed">{agent.description_it}</p>

        {/* Sectors */}
        <div className="flex flex-wrap gap-0.5">
          {(agent.sectors || []).slice(0, 2).map((s) => (
            <span key={s} className="text-[0.45rem] px-1 py-0.5 rounded-md bg-white/5 text-muted-foreground">
              {SECTOR_LABELS[s] || s}
            </span>
          ))}
          {(agent.sectors || []).length > 2 && (
            <span className="text-[0.45rem] px-1 py-0.5 rounded-md bg-white/5 text-muted-foreground">
              +{agent.sectors.length - 2}
            </span>
          )}
        </div>

        {/* Metrics + AI Score */}
        <div className="flex items-center justify-between text-[0.55rem] text-muted-foreground pt-1">
          <span className="flex items-center gap-1">
            <span className={`w-1.5 h-1.5 rounded-full ${installs > 0 ? "bg-blue-400" : "bg-white/20"}`} />
            {installs} utenti
          </span>
          <span className="flex items-center gap-1.5">
            <span>{successRate}%</span>
            <span className="px-1 py-0.5 rounded bg-cyan-500/20 text-cyan-400 font-bold text-[0.5rem]">
              AI {Math.min(100, Math.round((agent.autonomy_level ?? 7) * 8 + Math.min(installs * 5, 20)))}
            </span>
          </span>
        </div>

        {/* Status toggle */}
        <div
          className="flex items-center justify-between pt-1.5 border-t border-white/5"
          onClick={(e) => e.stopPropagation()}
        >
          <span className={`text-[0.6rem] font-semibold ${isActive ? "text-emerald-400" : isBeta ? "text-amber-400" : "text-red-400"}`}>
            {isActive ? "● Attivo" : isBeta ? "◐ Beta" : "○ Off"}
          </span>
          <Switch
            checked={isActive}
            onCheckedChange={(checked) => onToggle(agent.id, checked ? "active" : "inactive")}
            className="scale-75"
          />
        </div>
      </div>
    </motion.div>
  );
}
