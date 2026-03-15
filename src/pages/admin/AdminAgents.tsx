import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowLeft, Sparkles, Zap, Crown, Lock, LayoutGrid, Building2, DollarSign, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAgents } from "@/hooks/useAdminAgents";
import AgentKPIRow from "@/components/admin/AgentKPIRow";
import AgentFilters from "@/components/admin/AgentFilters";
import SectorTabs from "@/components/admin/SectorTabs";
import AgentCard from "@/components/admin/AgentCard";
import AgentCostsTab from "@/components/admin/AgentCostsTab";
import TenantAgentsTab from "@/components/admin/TenantAgentsTab";
import { CATEGORY_LABELS } from "@/types/agent";
import type { Agent } from "@/types/agent";
import { toast } from "@/hooks/use-toast";
import { getAgentImage } from "@/lib/agent-images";
import agentHubMascot from "@/assets/agent-hub-mascot-3d.png";

export default function AdminAgents() {
  const navigate = useNavigate();
  const {
    agents, allAgents, isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    sectorFilter, setSectorFilter,
    categoryFilter, setCategoryFilter,
    usageFilter, setUsageFilter,
    sectorCounts, categoryCounts, installationCounts, metrics, kpis,
    toggleStatus, SECTORS,
  } = useAdminAgents();

  const [selected, setSelected] = useState<Agent | null>(null);
  const [mainTab, setMainTab] = useState("catalogo");

  const handleToggle = (id: string, newStatus: string) => {
    toggleStatus.mutate(
      { id, newStatus },
      {
        onSuccess: () => toast({ title: `Stato aggiornato a ${newStatus}` }),
        onError: () => toast({ title: "Errore aggiornamento", variant: "destructive" }),
      }
    );
  };

  const universalCount = allAgents.filter((a) => a.type === "universal").length;

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ─── Compact Header ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/8 via-background to-primary/5 border-b border-border/40">
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />

        <div className="relative px-3 pt-3 pb-3 flex gap-3 items-center">
          {/* Mascot */}
          <motion.div
            className="shrink-0 w-16 h-16 relative"
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <img src={agentHubMascot} alt="Agent Hub" className="w-full h-full object-contain drop-shadow-[0_0_12px_hsl(var(--primary)/0.4)]" />
            <motion.div
              className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-12 h-2 rounded-full bg-primary/15 blur-md"
              animate={{ scaleX: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <button onClick={() => navigate("/superadmin")} className="p-1 rounded-lg bg-secondary/60 hover:bg-secondary transition-all border border-border/40">
                <ArrowLeft className="w-3 h-3" />
              </button>
              <h1 className="text-sm font-bold bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%] animate-shimmer">
                Agent Hub
              </h1>
            </div>
            <div className="flex gap-1.5 flex-wrap">
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-primary/10 border border-primary/20 text-[0.5rem]">
                <Sparkles className="w-2 h-2 text-primary" />
                <span className="font-bold text-primary">{allAgents.length}</span>
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-accent/10 border border-accent/20 text-[0.5rem]">
                <Zap className="w-2 h-2 text-accent-foreground" />
                <span className="font-bold text-accent-foreground">{Object.keys(sectorCounts).length - 1} settori</span>
              </span>
              <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-[0.5rem]">
                <Crown className="w-2 h-2 text-amber-400" />
                <span className="font-bold text-amber-400">{universalCount} univ.</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── KPIs ─── */}
      <div className="px-3 pt-3">
        <AgentKPIRow {...kpis} />
      </div>

      {/* ─── Main Tabs ─── */}
      <div className="px-3 pt-3">
        <div className="flex gap-0.5 bg-secondary/40 rounded-xl p-0.5 border border-border/30">
          {[
            { id: "catalogo", label: "Catalogo", icon: LayoutGrid },
            { id: "settori", label: "Settori", icon: Building2 },
            { id: "costi", label: "Costi & Uso", icon: DollarSign },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`flex-1 flex items-center justify-center gap-1 py-2 rounded-lg text-[0.6rem] font-semibold transition-all ${
                mainTab === tab.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <tab.icon className="w-3 h-3" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="px-3 pt-3">
        {/* CATALOGO TAB */}
        {mainTab === "catalogo" && (
          <div className="space-y-3">
            <AgentFilters
              search={search} onSearch={setSearch}
              typeFilter={typeFilter} onType={setTypeFilter}
              statusFilter={statusFilter} onStatus={setStatusFilter}
              categoryFilter={categoryFilter} onCategory={setCategoryFilter}
              categoryCounts={categoryCounts}
              usageFilter={usageFilter} onUsage={setUsageFilter}
            />

            <div className="flex items-center justify-between">
              <p className="text-[0.6rem] text-muted-foreground">{agents.length} risultati</p>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <motion.div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
              </div>
            ) : agents.length === 0 ? (
              <div className="text-center py-12">
                <Bot className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-xs">Nessun agente trovato</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {agents.map((agent, i) => {
                  const m = metrics[agent.id];
                  const sr = m ? Math.round((m.success / Math.max(m.total, 1)) * 100) : 0;
                  return (
                    <AgentCard key={agent.id} agent={agent} index={i} installs={installationCounts[agent.id] || 0} successRate={sr} onToggle={handleToggle} onClick={setSelected} />
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* SETTORI TAB */}
        {mainTab === "settori" && (
          <div className="space-y-3">
            <SectorTabs sectors={SECTORS} counts={sectorCounts} active={sectorFilter} onSelect={setSectorFilter} />

            {sectorFilter !== "all" && (
              <div className="space-y-2">
                <p className="text-[0.6rem] text-muted-foreground">
                  {agents.filter(a => a.sectors?.includes(sectorFilter)).length} agenti in questo settore
                </p>
                <div className="grid grid-cols-2 gap-2">
                  {allAgents
                    .filter(a => a.sectors?.includes(sectorFilter))
                    .map((agent, i) => {
                      const m = metrics[agent.id];
                      const sr = m ? Math.round((m.success / Math.max(m.total, 1)) * 100) : 0;
                      return (
                        <AgentCard key={agent.id} agent={agent} index={i} installs={installationCounts[agent.id] || 0} successRate={sr} onToggle={handleToggle} onClick={setSelected} />
                      );
                    })}
                </div>
              </div>
            )}

            {sectorFilter === "all" && (
              <div className="space-y-1.5">
                {(SECTORS as readonly string[]).filter(s => s !== "all").map((sector) => {
                  const count = sectorCounts[sector] || 0;
                  const sectorAgents = allAgents.filter(a => a.sectors?.includes(sector));
                  const activeCount = sectorAgents.filter(a => a.status === "active").length;
                  return (
                    <button
                      key={sector}
                      onClick={() => setSectorFilter(sector)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl bg-secondary/30 border border-border/30 hover:bg-secondary/50 transition-colors text-left"
                    >
                      <div>
                        <span className="text-[0.7rem] font-semibold text-foreground capitalize">{sector}</span>
                        <div className="flex gap-1.5 mt-0.5">
                          <span className="text-[0.5rem] text-muted-foreground">{count} agenti</span>
                          <span className="text-[0.5rem] text-emerald-400">{activeCount} attivi</span>
                        </div>
                      </div>
                      <div className="flex -space-x-1">
                        {sectorAgents.slice(0, 3).map(a => (
                          <span key={a.id} className="w-5 h-5 rounded-full bg-primary/10 border border-border/40 flex items-center justify-center text-[0.45rem]">
                            {a.icon_emoji}
                          </span>
                        ))}
                        {count > 3 && <span className="w-5 h-5 rounded-full bg-secondary flex items-center justify-center text-[0.45rem] text-muted-foreground border border-border/40">+{count - 3}</span>}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* COSTI TAB */}
        {mainTab === "costi" && <AgentCostsTab />}
      </div>

      {/* ─── Detail Modal ─── */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-border/40">
          {selected && (
            <AgentDetailModal
              agent={selected}
              installs={installationCounts[selected.id] || 0}
              metrics={metrics[selected.id]}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AgentDetailModal({
  agent, installs, metrics: m,
}: {
  agent: Agent;
  installs: number;
  metrics?: { total: number; success: number; avgMs: number };
}) {
  const cat = CATEGORY_LABELS[agent.category];
  const pricing = agent.pricing as { base: number; currency: string } | null;
  const sr = m ? Math.round((m.success / Math.max(m.total, 1)) * 100) : 0;
  const agentImg = getAgentImage(agent.name, agent.category, agent.sectors || []);
  const isInactive = agent.status === "inactive";

  return (
    <>
      <div className="relative h-32 -mx-6 -mt-6 mb-3 overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/10 via-background to-background">
        {agentImg && (
          <motion.img src={agentImg} alt={agent.name} className="w-full h-full object-contain p-3 drop-shadow-2xl"
            animate={{ y: [0, -4, 0] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        {isInactive && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-destructive/20 border border-destructive/30">
              <Lock className="w-3.5 h-3.5 text-destructive" />
              <span className="text-xs font-semibold text-destructive">Abbonamento Richiesto</span>
            </div>
          </div>
        )}
      </div>

      <DialogHeader>
        <div className="flex items-center gap-2.5">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl border border-border/30"
            style={{ backgroundColor: `${agent.color_hex}15` }}>
            {agent.icon_emoji}
          </div>
          <div>
            <DialogTitle className="text-base">{agent.name}</DialogTitle>
            <div className="flex gap-1 mt-0.5">
              {cat && (
                <Badge variant="outline" className="text-[0.55rem] h-4" style={{ borderColor: cat.color, color: cat.color }}>
                  {cat.icon} {cat.label}
                </Badge>
              )}
              <Badge variant="outline" className="text-[0.55rem] h-4 border-border/40 text-muted-foreground">
                {agent.type === "universal" ? "🌐 Universale" : "🎯 Settore"}
              </Badge>
            </div>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="info" className="mt-3">
        <TabsList className="bg-secondary/40 h-8">
          <TabsTrigger value="info" className="text-xs h-6">Info</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs h-6">Metriche</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-3 mt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{agent.description_it}</p>

          {(agent.capabilities || []).length > 0 && (
            <div>
              <p className="text-[0.6rem] font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Capabilities</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[0.55rem] h-4">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[0.6rem] font-semibold mb-1.5 text-muted-foreground uppercase tracking-wider">Settori</p>
            <div className="flex flex-wrap gap-1">
              {(agent.sectors || []).map((s) => (
                <Badge key={s} variant="outline" className="text-[0.55rem] h-4 border-border/40">{s}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-secondary/40 border border-border/30">
            <span className="text-xs">Prezzo</span>
            <span className="font-bold text-primary text-sm">
              {(pricing?.base || 0) > 0 ? `€${pricing!.base}/mo` : "Incluso"}
            </span>
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-2 mt-2">
          <div className="grid grid-cols-3 gap-1.5">
            <div className="p-2 rounded-xl bg-secondary/40 text-center border border-border/30">
              <p className="text-base font-bold text-blue-400">{installs}</p>
              <p className="text-[0.5rem] text-muted-foreground">Utenti</p>
            </div>
            <div className="p-2 rounded-xl bg-secondary/40 text-center border border-border/30">
              <p className="text-base font-bold text-emerald-400">{sr}%</p>
              <p className="text-[0.5rem] text-muted-foreground">Success</p>
            </div>
            <div className="p-2 rounded-xl bg-secondary/40 text-center border border-border/30">
              <p className="text-base font-bold text-amber-400">{m?.avgMs || 0}ms</p>
              <p className="text-[0.5rem] text-muted-foreground">Latenza</p>
            </div>
          </div>
          <div className="p-2 rounded-xl bg-secondary/40 border border-border/30 text-xs text-muted-foreground space-y-0.5">
            <p>Esecuzioni: <strong className="text-foreground">{m?.total || 0}</strong></p>
            <p>Riuscite: <strong className="text-foreground">{m?.success || 0}</strong></p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
