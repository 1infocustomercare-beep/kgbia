import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Bot, Search, Zap, CheckCircle2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAgents } from "@/hooks/useAgents";
import { useAgentInstallation } from "@/hooks/useAgentInstallation";
import { useIndustry } from "@/hooks/useIndustry";
import { CATEGORY_LABELS, type Agent } from "@/types/agent";

const CATEGORIES = [
  { key: null, label: "Tutti" },
  { key: "concierge", label: "Concierge" },
  { key: "analytics", label: "Analytics" },
  { key: "content", label: "Content" },
  { key: "sales", label: "Sales" },
  { key: "operations", label: "Operations" },
  { key: "compliance", label: "Compliance" },
];

function AgentCard({ agent, installed, onInstall, onNavigate }: {
  agent: Agent; installed: boolean; onInstall: () => void; onNavigate: () => void;
}) {
  const cat = CATEGORY_LABELS[agent.category];
  const isFree = agent.pricing.base === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        onClick={onNavigate}
        className="cursor-pointer relative overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl hover:shadow-xl hover:shadow-purple-500/10 transition-all duration-300 group"
      >
        {agent.type === 'universal' && (
          <div className="absolute inset-0 rounded-lg pointer-events-none"
            style={{
              background: 'linear-gradient(135deg, rgba(139,92,246,0.15), rgba(200,150,62,0.1))',
            }}
          />
        )}

        <div className="relative p-5 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                style={{ background: `${agent.color_hex}20` }}
              >
                {agent.icon_emoji}
              </div>
              <div>
                <h3 className="font-bold text-sm text-foreground group-hover:text-primary transition-colors">
                  {agent.name}
                </h3>
                <Badge variant="outline" className="text-[10px] mt-0.5" style={{ borderColor: cat?.color, color: cat?.color }}>
                  {cat?.label}
                </Badge>
              </div>
            </div>
            {agent.status === 'beta' && (
              <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30 text-[10px]">BETA</Badge>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
            {agent.description_it}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1">
            <div>
              {isFree ? (
                <span className="text-xs font-bold text-emerald-400">✓ Incluso</span>
              ) : (
                <span className="text-sm font-bold text-purple-400">€{agent.pricing.base}<span className="text-[10px] text-muted-foreground font-normal">/mese</span></span>
              )}
            </div>

            {installed ? (
              <Button size="sm" variant="outline" className="h-7 text-xs border-emerald-500/30 text-emerald-400 gap-1" onClick={(e) => { e.stopPropagation(); }}>
                <CheckCircle2 className="w-3 h-3" /> Attivo
              </Button>
            ) : (
              <Button
                size="sm"
                className="h-7 text-xs bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white gap-1"
                onClick={(e) => { e.stopPropagation(); onInstall(); }}
              >
                <Zap className="w-3 h-3" /> Attiva
              </Button>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

export default function AgentMarketplace() {
  const navigate = useNavigate();
  const { industry } = useIndustry();
  const { universalAgents, sectorAgents, loading, categoryFilter, setCategoryFilter, setSectorFilter } = useAgents();
  const { installations, install } = useAgentInstallation();
  const [search, setSearch] = React.useState("");

  // Filter sector agents for current tenant's industry
  const mySectorAgents = React.useMemo(() => {
    let agents = sectorAgents.filter(a => a.sectors.includes(industry));
    if (search) {
      const q = search.toLowerCase();
      agents = agents.filter(a => a.name.toLowerCase().includes(q) || a.description_it.toLowerCase().includes(q));
    }
    return agents;
  }, [sectorAgents, industry, search]);

  const filteredUniversal = React.useMemo(() => {
    if (!search) return universalAgents;
    const q = search.toLowerCase();
    return universalAgents.filter(a => a.name.toLowerCase().includes(q) || a.description_it.toLowerCase().includes(q));
  }, [universalAgents, search]);

  const isInstalled = (agentId: string) => installations.some((i: any) => i.agent_id === agentId && i.status === 'active');

  return (
    <div className="space-y-8 pb-20">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-purple-900/30 via-background to-background p-8"
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Bot className="w-32 h-32 text-purple-400" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-3xl font-heading font-bold text-foreground flex items-center gap-3">
            <Bot className="w-8 h-8 text-purple-400" />
            AI Marketplace
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            Potenzia la tua attività con agenti AI specializzati. Attiva, configura e monitora ogni agente direttamente dalla tua dashboard.
          </p>
          <div className="flex items-center gap-3 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400" /> {installations.length} attivi</span>
            <span>•</span>
            <span>{universalAgents.length + sectorAgents.length} disponibili</span>
          </div>
        </div>
      </motion.div>

      {/* Search + Filters */}
      <div className="space-y-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Cerca agenti..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="pl-10 bg-white/5 border-white/10"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(c => (
            <button
              key={c.key ?? "all"}
              onClick={() => setCategoryFilter(c.key)}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-200 ${
                categoryFilter === c.key
                  ? "bg-gradient-to-r from-purple-600 to-purple-500 text-white shadow-lg shadow-purple-500/20"
                  : "bg-white/5 text-muted-foreground hover:bg-white/10 border border-white/10"
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="h-48 bg-white/5 animate-pulse border-white/10" />
          ))}
        </div>
      ) : (
        <>
          {/* Universal Agents */}
          {filteredUniversal.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-purple-500 to-amber-500" />
                <h2 className="text-lg font-heading font-bold text-foreground">Agenti Universali</h2>
                <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">Per tutti i settori</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredUniversal.map((agent, i) => (
                  <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <AgentCard
                      agent={agent}
                      installed={isInstalled(agent.id)}
                      onInstall={() => install(agent.id)}
                      onNavigate={() => navigate(`/app/agents/${agent.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {/* Sector Agents */}
          {mySectorAgents.length > 0 && (
            <section className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="w-1 h-5 rounded-full bg-gradient-to-b from-cyan-500 to-emerald-500" />
                <h2 className="text-lg font-heading font-bold text-foreground">Per il Tuo Settore</h2>
                <Badge variant="outline" className="text-[10px] border-cyan-500/30 text-cyan-400 capitalize">{industry}</Badge>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {mySectorAgents.map((agent, i) => (
                  <motion.div key={agent.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
                    <AgentCard
                      agent={agent}
                      installed={isInstalled(agent.id)}
                      onInstall={() => install(agent.id)}
                      onNavigate={() => navigate(`/app/agents/${agent.id}`)}
                    />
                  </motion.div>
                ))}
              </div>
            </section>
          )}

          {filteredUniversal.length === 0 && mySectorAgents.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Bot className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nessun agente trovato per i filtri selezionati.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}
