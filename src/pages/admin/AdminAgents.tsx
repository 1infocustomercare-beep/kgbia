import { useState } from "react";
import { motion } from "framer-motion";
import { Bot, ArrowLeft } from "lucide-react";
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

export default function AdminAgents() {
  const navigate = useNavigate();
  const {
    agents, allAgents, isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    sectorFilter, setSectorFilter,
    sectorCounts, installationCounts, metrics, kpis,
    toggleStatus, SECTORS,
  } = useAdminAgents();

  const [selected, setSelected] = useState<Agent | null>(null);

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
    <div className="min-h-screen bg-background p-4 md:p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate("/superadmin")} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="w-6 h-6 text-primary" />
            Gestione Agenti AI
          </h1>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Badge variant="outline" className="bg-primary/10 text-primary border-primary/30">
            {allAgents.length} Agenti
          </Badge>
          <Badge variant="outline" className="bg-violet-500/10 text-violet-400 border-violet-500/30">
            {Object.keys(sectorCounts).length - 1} Settori
          </Badge>
          <Badge variant="outline" className="bg-amber-500/10 text-amber-400 border-amber-500/30">
            {universalCount} Universali
          </Badge>
        </div>
      </div>

      {/* KPIs */}
      <AgentKPIRow {...kpis} />

      {/* Filters */}
      <AgentFilters
        search={search}
        onSearch={setSearch}
        typeFilter={typeFilter}
        onType={setTypeFilter}
        statusFilter={statusFilter}
        onStatus={setStatusFilter}
      />

      {/* Sector tabs */}
      <SectorTabs
        sectors={SECTORS}
        counts={sectorCounts}
        active={sectorFilter}
        onSelect={setSectorFilter}
      />

      {/* Grid */}
      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-20 text-muted-foreground">Nessun agente trovato</div>
      ) : (
        <div className="grid gap-4" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))" }}>
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

      {/* Detail modal */}
      <Dialog open={!!selected} onOpenChange={() => setSelected(null)}>
        <DialogContent className="max-w-lg bg-background/95 backdrop-blur-xl border-white/10">
          {selected && <AgentDetailModal agent={selected} installs={installationCounts[selected.id] || 0} metrics={metrics[selected.id]} />}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function AgentDetailModal({ agent, installs, metrics: m }: { agent: Agent; installs: number; metrics?: { total: number; success: number; avgMs: number } }) {
  const cat = CATEGORY_LABELS[agent.category];
  const pricing = agent.pricing as { base: number; currency: string } | null;
  const sr = m ? Math.round((m.success / Math.max(m.total, 1)) * 100) : 0;

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl" style={{ backgroundColor: `${agent.color_hex}20` }}>
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
                {agent.type === "universal" ? "Universale" : "Settore"}
              </Badge>
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
            <p className="text-xs font-medium mb-2">Settori</p>
            <div className="flex flex-wrap gap-1.5">
              {(agent.sectors || []).map((s) => (
                <Badge key={s} variant="outline" className="text-[0.6rem] border-white/20">{s}</Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
            <span className="text-sm">Prezzo</span>
            <span className="font-bold text-primary">
              {(pricing?.base || 0) > 0 ? `€${pricing!.base}/mo` : "Incluso"}
            </span>
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-3 mt-3">
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-white/5 text-center">
              <p className="text-lg font-bold text-blue-400">{installs}</p>
              <p className="text-[0.6rem] text-muted-foreground">Installazioni</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 text-center">
              <p className="text-lg font-bold text-emerald-400">{sr}%</p>
              <p className="text-[0.6rem] text-muted-foreground">Success Rate</p>
            </div>
            <div className="p-3 rounded-lg bg-white/5 text-center">
              <p className="text-lg font-bold text-amber-400">{m?.avgMs || 0}ms</p>
              <p className="text-[0.6rem] text-muted-foreground">Latenza</p>
            </div>
          </div>
          <div className="p-3 rounded-lg bg-white/5">
            <p className="text-xs text-muted-foreground">Esecuzioni totali: <strong className="text-foreground">{m?.total || 0}</strong></p>
            <p className="text-xs text-muted-foreground">Esecuzioni riuscite: <strong className="text-foreground">{m?.success || 0}</strong></p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
