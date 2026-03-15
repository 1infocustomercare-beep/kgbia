import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowLeft, Sparkles, Zap, Crown, Lock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAgents } from "@/hooks/useAdminAgents";
import AgentKPIRow from "@/components/admin/AgentKPIRow";
import AgentFilters from "@/components/admin/AgentFilters";
import SectorTabs from "@/components/admin/SectorTabs";
import AgentCard from "@/components/admin/AgentCard";
import { CATEGORY_LABELS } from "@/types/agent";
import type { Agent } from "@/types/agent";
import { toast } from "@/hooks/use-toast";
import { getAgentImage } from "@/lib/agent-images";
import agentHubHero from "@/assets/agent-hub-hero-animated.png";
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
  const [heroPhase, setHeroPhase] = useState(0);

  // Animated hero phase cycle
  useEffect(() => {
    const interval = setInterval(() => setHeroPhase((p) => (p + 1) % 3), 4000);
    return () => clearInterval(interval);
  }, []);

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
  const heroTexts = [
    "Controlla ogni agente AI del tuo ecosistema",
    `${allAgents.length} agenti pronti • ${Object.keys(sectorCounts).length - 1} settori coperti`,
    "Attiva, monitora e scala la tua intelligenza artificiale",
  ];

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* ─── Animated Hero Banner ─── */}
      <div className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-violet-500/5 to-background">
        {/* Subtle animated bg glow */}
        <motion.div
          className="absolute inset-0 opacity-30"
          style={{ background: "radial-gradient(ellipse at 30% 50%, hsl(var(--primary) / 0.3), transparent 70%)" }}
          animate={{ opacity: [0.2, 0.4, 0.2] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.5), transparent)" }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />

        <div className="relative px-4 pt-5 pb-6 flex gap-4 items-center">
          {/* Left: Mascot 3D */}
          <motion.div
            className="shrink-0 w-28 h-28 relative"
            animate={{ y: [0, -8, 0], rotate: [0, 2, -2, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          >
            <img
              src={agentHubMascot}
              alt="Agent Hub Mascot"
              className="w-full h-full object-contain drop-shadow-[0_0_20px_hsl(var(--primary)/0.5)]"
            />
            {/* Glow ring underneath */}
            <motion.div
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-20 h-3 rounded-full bg-primary/20 blur-md"
              animate={{ scaleX: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 3, repeat: Infinity }}
            />
          </motion.div>

          {/* Right: Text + pills */}
          <div className="flex-1 min-w-0">
            {/* Back + title */}
            <div className="flex items-center gap-2 mb-2">
              <button
                onClick={() => navigate("/superadmin")}
                className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition-all border border-white/10"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
              </button>
              <motion.h1
                className="text-lg font-bold flex items-center gap-1.5"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                <span className="bg-gradient-to-r from-foreground via-primary to-foreground bg-clip-text text-transparent bg-[length:200%] animate-shimmer">
                  Agent Hub
                </span>
              </motion.h1>
            </div>

            {/* Animated subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={heroPhase}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.4 }}
                className="text-[0.65rem] text-muted-foreground mb-3 leading-relaxed"
              >
                {heroTexts[heroPhase]}
              </motion.p>
            </AnimatePresence>

            {/* Stats pills */}
            <div className="flex gap-1.5 flex-wrap">
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/15 border border-primary/25">
                <Sparkles className="w-2.5 h-2.5 text-primary" />
                <span className="text-[0.6rem] font-bold text-primary">{allAgents.length}</span>
                <span className="text-[0.5rem] text-primary/70">Agenti</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-violet-500/15 border border-violet-500/25">
                <Zap className="w-2.5 h-2.5 text-violet-400" />
                <span className="text-[0.6rem] font-bold text-violet-400">{Object.keys(sectorCounts).length - 1}</span>
                <span className="text-[0.5rem] text-violet-400/70">Settori</span>
              </div>
              <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-amber-500/15 border border-amber-500/25">
                <Crown className="w-2.5 h-2.5 text-amber-400" />
                <span className="text-[0.6rem] font-bold text-amber-400">{universalCount}</span>
                <span className="text-[0.5rem] text-amber-400/70">Universali</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Content ─── */}
      <div className="px-4 space-y-4">
        {/* KPIs */}
        <AgentKPIRow {...kpis} />

        {/* Filters (category, type, status, usage, search) */}
        <AgentFilters
          search={search}
          onSearch={setSearch}
          typeFilter={typeFilter}
          onType={setTypeFilter}
          statusFilter={statusFilter}
          onStatus={setStatusFilter}
          categoryFilter={categoryFilter}
          onCategory={setCategoryFilter}
          categoryCounts={categoryCounts}
          usageFilter={usageFilter}
          onUsage={setUsageFilter}
        />

        {/* Sector tabs */}
        <SectorTabs
          sectors={SECTORS}
          counts={sectorCounts}
          active={sectorFilter}
          onSelect={setSectorFilter}
        />

        {/* Results count */}
        <div className="flex items-center justify-between">
          <p className="text-[0.65rem] text-muted-foreground">
            {agents.length} risultati
          </p>
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <motion.div
              className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            />
          </div>
        ) : agents.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <Bot className="w-12 h-12 text-muted-foreground/30 mx-auto mb-3" />
            <p className="text-muted-foreground text-sm">Nessun agente trovato</p>
            <p className="text-muted-foreground/60 text-xs mt-1">Prova a cambiare i filtri</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5">
            {agents.map((agent, i) => {
              const m = metrics[agent.id];
              const sr = m ? Math.round((m.success / Math.max(m.total, 1)) * 100) : 0;
              return (
                <AgentCard
                  key={agent.id}
                  agent={agent}
                  index={i}
                  installs={installationCounts[agent.id] || 0}
                  successRate={sr}
                  onToggle={handleToggle}
                  onClick={setSelected}
                />
              );
            })}
          </div>
        )}
      </div>

      {/* ─── Detail Modal ─── */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border-white/10">
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
  agent,
  installs,
  metrics: m,
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
      {/* Agent alien image in modal */}
      <div className="relative h-40 -mx-6 -mt-6 mb-4 overflow-hidden rounded-t-lg bg-gradient-to-br from-primary/10 via-violet-500/5 to-background">
        {agentImg && (
          <motion.img
            src={agentImg}
            alt={agent.name}
            className="w-full h-full object-contain p-4 drop-shadow-2xl"
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        {isInactive && (
          <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/20 border border-red-500/30">
              <Lock className="w-4 h-4 text-red-400" />
              <span className="text-sm font-semibold text-red-400">Abbonamento Richiesto</span>
            </div>
          </div>
        )}
      </div>

      <DialogHeader>
        <div className="flex items-center gap-3">
          <div
            className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl border border-white/10"
            style={{ backgroundColor: `${agent.color_hex}20` }}
          >
            {agent.icon_emoji}
          </div>
          <div>
            <DialogTitle className="text-lg">{agent.name}</DialogTitle>
            <div className="flex gap-1.5 mt-1">
              {cat && (
                <Badge variant="outline" className="text-[0.6rem]" style={{ borderColor: cat.color, color: cat.color }}>
                  {cat.icon} {cat.label}
                </Badge>
              )}
              <Badge variant="outline" className="text-[0.6rem] border-white/20 text-muted-foreground">
                {agent.type === "universal" ? "🌐 Universale" : "🎯 Settore"}
              </Badge>
              {isInactive && (
                <Badge className="text-[0.6rem] bg-red-500/20 text-red-400 border-red-500/30">
                  <Lock className="w-3 h-3 mr-1" /> Disattivato
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="info" className="mt-4">
        <TabsList className="bg-white/5">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="metrics">Metriche</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-4 mt-3">
          <p className="text-sm text-muted-foreground">{agent.description_it}</p>

          {(agent.capabilities || []).length > 0 && (
            <div>
              <p className="text-xs font-medium mb-2">Capabilities</p>
              <div className="flex flex-wrap gap-1.5">
                {agent.capabilities.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[0.6rem]">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-medium mb-2">Settori compatibili</p>
            <div className="flex flex-wrap gap-1.5">
              {(agent.sectors || []).map((s) => (
                <Badge key={s} variant="outline" className="text-[0.6rem] border-white/20">{s}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/10">
            <span className="text-sm">Prezzo mensile</span>
            <span className="font-bold text-primary">
              {(pricing?.base || 0) > 0 ? `€${pricing!.base}/mo` : "Incluso nel piano"}
            </span>
          </div>

          {isInactive && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-center">
              <Lock className="w-5 h-5 text-red-400 mx-auto mb-1" />
              <p className="text-xs text-red-400 font-medium">
                Questo agente è disattivato. Richiede un abbonamento attivo per funzionare.
              </p>
            </div>
          )}
        </TabsContent>
        <TabsContent value="metrics" className="space-y-3 mt-3">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-3 rounded-xl bg-white/5 text-center border border-white/5">
              <p className="text-lg font-bold text-blue-400">{installs}</p>
              <p className="text-[0.55rem] text-muted-foreground">Utenti</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center border border-white/5">
              <p className="text-lg font-bold text-emerald-400">{sr}%</p>
              <p className="text-[0.55rem] text-muted-foreground">Success</p>
            </div>
            <div className="p-3 rounded-xl bg-white/5 text-center border border-white/5">
              <p className="text-lg font-bold text-amber-400">{m?.avgMs || 0}ms</p>
              <p className="text-[0.55rem] text-muted-foreground">Latenza</p>
            </div>
          </div>
          <div className="p-3 rounded-xl bg-white/5 border border-white/5 space-y-1">
            <p className="text-xs text-muted-foreground">
              Esecuzioni totali: <strong className="text-foreground">{m?.total || 0}</strong>
            </p>
            <p className="text-xs text-muted-foreground">
              Esecuzioni riuscite: <strong className="text-foreground">{m?.success || 0}</strong>
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
