import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, ArrowLeft, Search, Lock, Zap, Crown, DollarSign, Users, BarChart3, Shield, TrendingUp, AlertTriangle, Coins } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAdminAgents, type TenantUsage } from "@/hooks/useAdminAgents";
import { CATEGORY_LABELS } from "@/types/agent";
import type { Agent } from "@/types/agent";
import { toast } from "@/hooks/use-toast";

const SECTOR_LABELS: Record<string, string> = {
  food: "Food", ncc: "NCC", beauty: "Beauty", healthcare: "Health",
  construction: "Edilizia", retail: "Retail", fitness: "Fitness",
  hospitality: "Hotel", beach: "Spiaggia", plumber: "Idraulico",
  agriturismo: "Agriturismo", cleaning: "Pulizie", legal: "Legale",
  accounting: "Contabilità", garage: "Officina", photography: "Foto",
  gardening: "Giardinaggio", veterinary: "Vet", tattoo: "Tattoo",
  childcare: "Asilo", education: "Formazione", events: "Eventi",
  logistics: "Logistica",
};

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
    tenantUsage, empireAgents, costByCategory,
  } = useAdminAgents();

  const [selected, setSelected] = useState<Agent | null>(null);
  const [mainTab, setMainTab] = useState("overview");

  const handleToggle = (id: string, newStatus: string) => {
    toggleStatus.mutate(
      { id, newStatus },
      {
        onSuccess: () => toast({ title: `Stato aggiornato` }),
        onError: () => toast({ title: "Errore", variant: "destructive" }),
      }
    );
  };

  const pill = (active: boolean) =>
    active
      ? "bg-primary text-primary-foreground shadow-sm"
      : "bg-white/5 text-muted-foreground hover:bg-white/10";

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* ─── Compact Header ─── */}
      <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-xl border-b border-white/5">
        <div className="px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => navigate("/superadmin")}
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold flex items-center gap-1.5">
              <Bot className="w-4 h-4 text-primary" />
              Agent Hub
            </h1>
            <p className="text-[0.6rem] text-muted-foreground truncate">
              {allAgents.length} agenti • {kpis.totalInstalls} installazioni • €{kpis.monthlyRevenue}/mo
            </p>
          </div>
        </div>

        {/* Main navigation tabs */}
        <div className="px-4 pb-2 flex gap-1 overflow-x-auto scrollbar-hide">
          {([
            { id: "overview", label: "Panoramica", icon: BarChart3 },
            { id: "agents", label: "Agenti", icon: Bot },
            { id: "accounts", label: "Account", icon: Users },
            { id: "costs", label: "Costi", icon: DollarSign },
          ] as const).map((tab) => (
            <button
              key={tab.id}
              onClick={() => setMainTab(tab.id)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                mainTab === tab.id
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-white/5"
              }`}
            >
              <tab.icon className="w-3.5 h-3.5" />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Tab Content ─── */}
      <div className="px-4 pt-3">
        {mainTab === "overview" && (
          <OverviewTab
            kpis={kpis}
            allAgents={allAgents}
            categoryCounts={categoryCounts}
            sectorCounts={sectorCounts}
            empireAgents={empireAgents}
            installationCounts={installationCounts}
            tenantUsage={tenantUsage}
          />
        )}
        {mainTab === "agents" && (
          <AgentsTab
            agents={agents}
            isLoading={isLoading}
            search={search}
            setSearch={setSearch}
            typeFilter={typeFilter}
            setTypeFilter={setTypeFilter}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            sectorFilter={sectorFilter}
            setSectorFilter={setSectorFilter}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            usageFilter={usageFilter}
            setUsageFilter={setUsageFilter}
            categoryCounts={categoryCounts}
            sectorCounts={sectorCounts}
            installationCounts={installationCounts}
            metrics={metrics}
            SECTORS={SECTORS}
            onToggle={handleToggle}
            onSelect={setSelected}
          />
        )}
        {mainTab === "accounts" && (
          <AccountsTab tenantUsage={tenantUsage} />
        )}
        {mainTab === "costs" && (
          <CostsTab
            kpis={kpis}
            costByCategory={costByCategory}
            allAgents={allAgents}
            installationCounts={installationCounts}
            tenantUsage={tenantUsage}
          />
        )}
      </div>

      {/* Detail Modal */}
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

/* ═══════════════════════════════════════════
   TAB: PANORAMICA
   ═══════════════════════════════════════════ */
function OverviewTab({
  kpis, allAgents, categoryCounts, sectorCounts, empireAgents, installationCounts, tenantUsage,
}: {
  kpis: any;
  allAgents: Agent[];
  categoryCounts: Record<string, number>;
  sectorCounts: Record<string, number>;
  empireAgents: Agent[];
  installationCounts: Record<string, number>;
  tenantUsage: TenantUsage[];
}) {
  const overLimitCount = tenantUsage.filter((t) => t.overLimit).length;

  return (
    <div className="space-y-3">
      {/* KPIs - 2x2 compact */}
      <div className="grid grid-cols-4 gap-2">
        {([
          { label: "Attivi", value: kpis.activeCount, color: "text-emerald-400", bg: "border-t-emerald-500" },
          { label: "Install.", value: kpis.totalInstalls, color: "text-blue-400", bg: "border-t-blue-500" },
          { label: "Success", value: `${kpis.successRate}%`, color: "text-violet-400", bg: "border-t-violet-500" },
          { label: "€/mese", value: `€${kpis.monthlyRevenue}`, color: "text-amber-400", bg: "border-t-amber-500" },
        ]).map((k) => (
          <div key={k.label} className={`bg-white/5 border border-white/10 ${k.bg} border-t-2 rounded-xl p-2.5 text-center`}>
            <p className={`text-lg font-bold ${k.color}`}>{k.value}</p>
            <p className="text-[0.55rem] text-muted-foreground">{k.label}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      {overLimitCount > 0 && (
        <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
          <p className="text-xs text-amber-400">
            <strong>{overLimitCount}</strong> account hanno superato il limite token — ricarica automatica attivata
          </p>
        </div>
      )}

      {/* Empire Agents */}
      <div>
        <h3 className="text-xs font-semibold mb-2 flex items-center gap-1.5">
          <Crown className="w-3.5 h-3.5 text-amber-400" />
          Agenti Empire (Piattaforma)
        </h3>
        <div className="grid grid-cols-2 gap-1.5">
          {empireAgents.slice(0, 6).map((a) => (
            <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/5">
              <span className="text-sm">{a.icon_emoji}</span>
              <div className="flex-1 min-w-0">
                <p className="text-[0.65rem] font-medium truncate">{a.name}</p>
                <p className="text-[0.5rem] text-muted-foreground">{(installationCounts[a.id] || 0)} utenti</p>
              </div>
            </div>
          ))}
        </div>
        {empireAgents.length > 6 && (
          <p className="text-[0.55rem] text-muted-foreground mt-1 text-center">
            +{empireAgents.length - 6} altri agenti universali
          </p>
        )}
      </div>

      {/* Categories breakdown */}
      <div>
        <h3 className="text-xs font-semibold mb-2">Per Categoria</h3>
        <div className="space-y-1">
          {Object.entries(CATEGORY_LABELS).map(([key, cat]) => {
            const count = categoryCounts[key] || 0;
            const pct = allAgents.length > 0 ? Math.round((count / allAgents.length) * 100) : 0;
            return (
              <div key={key} className="flex items-center gap-2 text-xs">
                <span className="w-14 text-[0.6rem] text-muted-foreground">{cat.icon} {cat.label}</span>
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
                </div>
                <span className="text-[0.6rem] text-muted-foreground w-8 text-right">{count}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top sectors */}
      <div>
        <h3 className="text-xs font-semibold mb-2">Top Settori</h3>
        <div className="flex flex-wrap gap-1">
          {Object.entries(sectorCounts)
            .filter(([k]) => k !== "all")
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .map(([s, c]) => (
              <span key={s} className="text-[0.55rem] px-2 py-1 rounded-full bg-white/5 text-muted-foreground border border-white/5">
                {SECTOR_LABELS[s] || s} <strong>{c}</strong>
              </span>
            ))}
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB: AGENTI (compact list)
   ═══════════════════════════════════════════ */
function AgentsTab({
  agents, isLoading, search, setSearch,
  typeFilter, setTypeFilter,
  statusFilter, setStatusFilter,
  sectorFilter, setSectorFilter,
  categoryFilter, setCategoryFilter,
  usageFilter, setUsageFilter,
  categoryCounts, sectorCounts,
  installationCounts, metrics, SECTORS,
  onToggle, onSelect,
}: any) {
  const pill = (active: boolean) =>
    active ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10";

  return (
    <div className="space-y-2.5">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
        <Input
          placeholder="Cerca agente..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-8 h-8 text-xs bg-white/5 border-white/10 rounded-lg"
        />
      </div>

      {/* Quick filters - single scrollable row */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {/* Category */}
        {(["all", "concierge", "analytics", "content", "sales", "operations", "compliance"] as const).map((c) => {
          const cat = c === "all" ? null : CATEGORY_LABELS[c];
          return (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-2 py-1 rounded-lg text-[0.6rem] font-medium whitespace-nowrap transition-colors ${pill(categoryFilter === c)}`}
            >
              {cat ? `${cat.icon} ${categoryCounts[c] || 0}` : `Tutti ${categoryCounts.all || 0}`}
            </button>
          );
        })}
      </div>

      {/* Type + Status in one row */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {(["all", "universal", "sector-specific"] as const).map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)}
            className={`px-2 py-1 rounded-lg text-[0.55rem] font-medium whitespace-nowrap ${pill(typeFilter === t)}`}>
            {t === "all" ? "Tutti" : t === "universal" ? "🌐 Univ." : "🎯 Sett."}
          </button>
        ))}
        <div className="w-px bg-white/10 shrink-0" />
        {(["all", "active", "beta", "inactive"] as const).map((s) => (
          <button key={s} onClick={() => setStatusFilter(s)}
            className={`px-2 py-1 rounded-lg text-[0.55rem] font-medium whitespace-nowrap flex items-center gap-1 ${pill(statusFilter === s)}`}>
            {s === "active" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />}
            {s === "beta" && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
            {s === "inactive" && <span className="w-1.5 h-1.5 rounded-full bg-red-400" />}
            {s === "all" ? "Tutti" : s === "active" ? "On" : s === "beta" ? "Beta" : "Off"}
          </button>
        ))}
        <div className="w-px bg-white/10 shrink-0" />
        {(["all", "installed", "not-installed"] as const).map((u) => (
          <button key={u} onClick={() => setUsageFilter(u)}
            className={`px-2 py-1 rounded-lg text-[0.55rem] font-medium whitespace-nowrap ${pill(usageFilter === u)}`}>
            {u === "all" ? "Tutti" : u === "installed" ? "In uso" : "Liberi"}
          </button>
        ))}
      </div>

      {/* Sector tabs */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {SECTORS.map((s: string) => (
          <button
            key={s}
            onClick={() => setSectorFilter(s)}
            className={`px-2 py-1 rounded-lg text-[0.55rem] font-medium whitespace-nowrap ${pill(sectorFilter === s)}`}
          >
            {SECTOR_LABELS[s] || s} {sectorCounts[s] || 0}
          </button>
        ))}
      </div>

      {/* Results */}
      <p className="text-[0.6rem] text-muted-foreground">{agents.length} risultati</p>

      {/* Agent list - compact rows instead of cards */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12">
          <Bot className="w-10 h-10 text-muted-foreground/20 mx-auto mb-2" />
          <p className="text-xs text-muted-foreground">Nessun agente</p>
        </div>
      ) : (
        <div className="space-y-1">
          {agents.map((agent: Agent) => {
            const cat = CATEGORY_LABELS[agent.category] || { label: agent.category, color: "#888", icon: "🤖" };
            const pricing = agent.pricing as { base: number } | null;
            const price = pricing?.base || 0;
            const installs = installationCounts[agent.id] || 0;
            const m = metrics[agent.id];
            const sr = m ? Math.round((m.success / Math.max(m.total, 1)) * 100) : 0;
            const isActive = agent.status === "active";
            const isInactive = agent.status === "inactive";

            return (
              <motion.div
                key={agent.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onClick={() => onSelect(agent)}
                className={`flex items-center gap-2.5 p-2 rounded-xl cursor-pointer transition-colors ${
                  isInactive ? "opacity-50 bg-white/[0.02]" : "bg-white/[0.03] hover:bg-white/[0.06]"
                } border border-white/5`}
              >
                {/* Icon */}
                <span className="text-lg shrink-0">{agent.icon_emoji}</span>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-[0.7rem] font-semibold truncate">{agent.name}</p>
                    {isInactive && <Lock className="w-3 h-3 text-red-400 shrink-0" />}
                  </div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span className="text-[0.5rem] px-1 py-0.5 rounded" style={{ backgroundColor: `${cat.color}20`, color: cat.color }}>
                      {cat.icon} {cat.label}
                    </span>
                    <span className="text-[0.5rem] text-muted-foreground">
                      {agent.type === "universal" ? "🌐" : "🎯"} • {installs} utenti • {sr}%
                    </span>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right shrink-0">
                  <span className={`text-[0.6rem] font-bold ${price > 0 ? "text-violet-400" : "text-emerald-400"}`}>
                    {price > 0 ? `€${price}` : "Free"}
                  </span>
                </div>

                {/* Toggle */}
                <div onClick={(e) => e.stopPropagation()}>
                  <Switch
                    checked={isActive}
                    onCheckedChange={(c) => onToggle(agent.id, c ? "active" : "inactive")}
                    className="scale-[0.65]"
                  />
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB: ACCOUNT (per-tenant usage + token billing)
   ═══════════════════════════════════════════ */
function AccountsTab({ tenantUsage }: { tenantUsage: TenantUsage[] }) {
  const [searchAcc, setSearchAcc] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");

  const industries = Array.from(new Set(tenantUsage.map((t) => t.industry))).sort();

  const filtered = tenantUsage.filter((t) => {
    if (searchAcc && !t.tenantName.toLowerCase().includes(searchAcc.toLowerCase())) return false;
    if (filterIndustry !== "all" && t.industry !== filterIndustry) return false;
    return true;
  });

  const overLimit = filtered.filter((t) => t.overLimit);
  const withAgents = filtered.filter((t) => t.agentCount > 0);
  const totalSpend = filtered.reduce((s, t) => s + t.totalCost, 0);

  const pill = (active: boolean) =>
    active ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground hover:bg-white/10";

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-2">
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-foreground">{filtered.length}</p>
          <p className="text-[0.5rem] text-muted-foreground">Account</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-blue-400">{withAgents.length}</p>
          <p className="text-[0.5rem] text-muted-foreground">Con Agenti</p>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-xl p-2.5 text-center">
          <p className="text-base font-bold text-amber-400">{overLimit.length}</p>
          <p className="text-[0.5rem] text-muted-foreground">Over Limit</p>
        </div>
      </div>

      {/* Over limit alert */}
      {overLimit.length > 0 && (
        <div className="space-y-1">
          <h4 className="text-[0.65rem] font-semibold text-amber-400 flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" /> Account Over Limit — Ricarica Automatica
          </h4>
          {overLimit.map((t) => (
            <div key={t.tenantId} className="flex items-center gap-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Coins className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-[0.65rem] font-medium truncate">{t.tenantName}</p>
                <p className="text-[0.5rem] text-amber-400">
                  {t.tokenUsed}/{t.tokenLimit} token usati • Ricarica in corso
                </p>
              </div>
              <span className="text-[0.6rem] font-bold text-amber-400">€{t.totalCost}/mo</span>
            </div>
          ))}
        </div>
      )}

      {/* Filters */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            placeholder="Cerca account..."
            value={searchAcc}
            onChange={(e) => setSearchAcc(e.target.value)}
            className="pl-7 h-7 text-[0.65rem] bg-white/5 border-white/10 rounded-lg"
          />
        </div>
      </div>

      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        <button onClick={() => setFilterIndustry("all")}
          className={`px-2 py-1 rounded-lg text-[0.55rem] font-medium whitespace-nowrap ${pill(filterIndustry === "all")}`}>
          Tutti
        </button>
        {industries.map((ind) => (
          <button key={ind} onClick={() => setFilterIndustry(ind)}
            className={`px-2 py-1 rounded-lg text-[0.55rem] font-medium whitespace-nowrap ${pill(filterIndustry === ind)}`}>
            {SECTOR_LABELS[ind] || ind}
          </button>
        ))}
      </div>

      {/* Account list */}
      <div className="space-y-1">
        {filtered.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-8">Nessun account trovato</p>
        ) : (
          filtered.map((t) => (
            <div
              key={t.tenantId}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl border transition-colors ${
                t.overLimit
                  ? "bg-amber-500/5 border-amber-500/20"
                  : "bg-white/[0.03] border-white/5"
              }`}
            >
              {/* Industry badge */}
              <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                <span className="text-[0.6rem] font-bold text-muted-foreground uppercase">
                  {(t.industry || "?").slice(0, 3)}
                </span>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <p className="text-[0.7rem] font-semibold truncate">{t.tenantName}</p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-[0.5rem] text-muted-foreground">
                    {t.agentCount} agenti
                  </span>
                  <span className="text-[0.5rem] text-muted-foreground">
                    {t.totalExecutions} exec
                  </span>
                  {t.tokenBalance > 0 && (
                    <span className="text-[0.5rem] text-emerald-400">
                      {t.tokenBalance} token
                    </span>
                  )}
                </div>
              </div>

              {/* Cost */}
              <div className="text-right shrink-0">
                <p className={`text-[0.65rem] font-bold ${t.totalCost > 0 ? "text-violet-400" : "text-muted-foreground"}`}>
                  {t.totalCost > 0 ? `€${t.totalCost}/mo` : "Free"}
                </p>
                {t.overLimit && (
                  <span className="text-[0.5rem] text-amber-400 font-medium">⚠ Over</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   TAB: COSTI (revenue breakdown)
   ═══════════════════════════════════════════ */
function CostsTab({
  kpis, costByCategory, allAgents, installationCounts, tenantUsage,
}: {
  kpis: any;
  costByCategory: Record<string, { count: number; revenue: number }>;
  allAgents: Agent[];
  installationCounts: Record<string, number>;
  tenantUsage: TenantUsage[];
}) {
  // Top spending accounts
  const topSpenders = [...tenantUsage].filter((t) => t.totalCost > 0).sort((a, b) => b.totalCost - a.totalCost).slice(0, 8);

  // Top revenue agents
  const topAgents = allAgents
    .map((a) => ({
      ...a,
      revenue: ((a.pricing as any)?.base || 0) * (installationCounts[a.id] || 0),
      installs: installationCounts[a.id] || 0,
    }))
    .filter((a) => a.revenue > 0)
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 8);

  const totalRevenue = kpis.monthlyRevenue;
  const totalPaidAgents = allAgents.filter((a) => ((a.pricing as any)?.base || 0) > 0).length;
  const freeAgents = allAgents.length - totalPaidAgents;

  return (
    <div className="space-y-3">
      {/* Revenue headline */}
      <div className="bg-gradient-to-r from-violet-500/10 to-primary/10 border border-violet-500/20 rounded-xl p-4 text-center">
        <p className="text-2xl font-bold text-foreground">€{totalRevenue}</p>
        <p className="text-[0.6rem] text-muted-foreground">Revenue Mensile Totale</p>
        <div className="flex justify-center gap-4 mt-2">
          <span className="text-[0.55rem] text-muted-foreground">{totalPaidAgents} a pagamento</span>
          <span className="text-[0.55rem] text-muted-foreground">{freeAgents} gratuiti</span>
        </div>
      </div>

      {/* By Category */}
      <div>
        <h3 className="text-xs font-semibold mb-2">Revenue per Categoria</h3>
        <div className="space-y-1.5">
          {Object.entries(CATEGORY_LABELS).map(([key, cat]) => {
            const data = costByCategory[key] || { count: 0, revenue: 0 };
            return (
              <div key={key} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-sm">{cat.icon}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.65rem] font-medium">{cat.label}</p>
                  <p className="text-[0.5rem] text-muted-foreground">{data.count} installazioni</p>
                </div>
                <span className="text-[0.65rem] font-bold text-violet-400">
                  €{data.revenue}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Revenue Agents */}
      {topAgents.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold mb-2">🏆 Top Agenti per Revenue</h3>
          <div className="space-y-1">
            {topAgents.map((a, i) => (
              <div key={a.id} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/5">
                <span className="text-[0.6rem] font-bold text-muted-foreground w-4">{i + 1}</span>
                <span className="text-sm">{a.icon_emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.65rem] font-medium truncate">{a.name}</p>
                  <p className="text-[0.5rem] text-muted-foreground">
                    €{(a.pricing as any)?.base || 0}/mo × {a.installs} = €{a.revenue}/mo
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Spenders */}
      {topSpenders.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold mb-2">💰 Chi Spende di Più</h3>
          <div className="space-y-1">
            {topSpenders.map((t, i) => (
              <div key={t.tenantId} className={`flex items-center gap-2 p-2 rounded-lg border ${
                t.overLimit ? "bg-amber-500/5 border-amber-500/20" : "bg-white/[0.03] border-white/5"
              }`}>
                <span className="text-[0.6rem] font-bold text-muted-foreground w-4">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.65rem] font-medium truncate">{t.tenantName}</p>
                  <p className="text-[0.5rem] text-muted-foreground">
                    {SECTOR_LABELS[t.industry] || t.industry} • {t.agentCount} agenti
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[0.65rem] font-bold text-violet-400">€{t.totalCost}/mo</p>
                  {t.overLimit && <p className="text-[0.45rem] text-amber-400">⚠ Over limit</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Token billing logic info */}
      <div className="p-3 rounded-xl bg-white/5 border border-white/10">
        <div className="flex items-center gap-2 mb-2">
          <Shield className="w-4 h-4 text-primary" />
          <h4 className="text-xs font-semibold">Logica Billing Token</h4>
        </div>
        <div className="space-y-1 text-[0.6rem] text-muted-foreground">
          <p>• Ogni account ha un limite token basato sul piano</p>
          <p>• Superamento limite → ricarica automatica dal metodo di pagamento</p>
          <p>• Pacchetti: Starter (50), Pro (150), Business (500) token</p>
          <p>• Alert automatico sotto 10 token residui</p>
          <p>• Crediti non usati <strong>non</strong> si accumulano tra i mesi</p>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════
   AGENT DETAIL MODAL
   ═══════════════════════════════════════════ */
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
  const isInactive = agent.status === "inactive";

  return (
    <>
      <DialogHeader>
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border border-white/10"
            style={{ backgroundColor: `${agent.color_hex}20` }}
          >
            {agent.icon_emoji}
          </div>
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-base">{agent.name}</DialogTitle>
            <div className="flex gap-1 mt-1 flex-wrap">
              {cat && (
                <Badge variant="outline" className="text-[0.55rem]" style={{ borderColor: cat.color, color: cat.color }}>
                  {cat.icon} {cat.label}
                </Badge>
              )}
              <Badge variant="outline" className="text-[0.55rem] border-white/20 text-muted-foreground">
                {agent.type === "universal" ? "🌐 Universale" : "🎯 Settore"}
              </Badge>
              {isInactive && (
                <Badge className="text-[0.55rem] bg-red-500/20 text-red-400 border-red-500/30">
                  <Lock className="w-3 h-3 mr-0.5" /> Off
                </Badge>
              )}
            </div>
          </div>
        </div>
      </DialogHeader>

      <Tabs defaultValue="info" className="mt-3">
        <TabsList className="bg-white/5 h-8">
          <TabsTrigger value="info" className="text-xs">Info</TabsTrigger>
          <TabsTrigger value="metrics" className="text-xs">Metriche</TabsTrigger>
        </TabsList>
        <TabsContent value="info" className="space-y-3 mt-2">
          <p className="text-xs text-muted-foreground leading-relaxed">{agent.description_it}</p>

          {(agent.capabilities || []).length > 0 && (
            <div>
              <p className="text-[0.6rem] font-medium mb-1.5">Capabilities</p>
              <div className="flex flex-wrap gap-1">
                {agent.capabilities.map((c) => (
                  <Badge key={c} variant="secondary" className="text-[0.55rem]">{c}</Badge>
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="text-[0.6rem] font-medium mb-1.5">Settori</p>
            <div className="flex flex-wrap gap-1">
              {(agent.sectors || []).map((s) => (
                <Badge key={s} variant="outline" className="text-[0.55rem] border-white/15">
                  {SECTOR_LABELS[s] || s}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/10">
            <span className="text-xs">Prezzo</span>
            <span className="font-bold text-primary text-sm">
              {(pricing?.base || 0) > 0 ? `€${pricing!.base}/mo` : "Incluso"}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[0.55rem] text-muted-foreground">Modello</p>
              <p className="text-[0.6rem] font-medium">{agent.ai_model}</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[0.55rem] text-muted-foreground">Autonomia</p>
              <p className="text-[0.6rem] font-medium">{agent.autonomy_level}/10</p>
            </div>
            <div className="p-2 rounded-lg bg-white/5">
              <p className="text-[0.55rem] text-muted-foreground">Privacy</p>
              <p className="text-[0.6rem] font-medium">{agent.privacy_level}</p>
            </div>
          </div>
        </TabsContent>
        <TabsContent value="metrics" className="space-y-3 mt-2">
          <div className="grid grid-cols-3 gap-2">
            <div className="p-2.5 rounded-xl bg-white/5 text-center">
              <p className="text-lg font-bold text-blue-400">{installs}</p>
              <p className="text-[0.5rem] text-muted-foreground">Utenti</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-center">
              <p className="text-lg font-bold text-emerald-400">{sr}%</p>
              <p className="text-[0.5rem] text-muted-foreground">Success</p>
            </div>
            <div className="p-2.5 rounded-xl bg-white/5 text-center">
              <p className="text-lg font-bold text-amber-400">{m?.avgMs || 0}ms</p>
              <p className="text-[0.5rem] text-muted-foreground">Latenza</p>
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white/5 space-y-1 text-xs text-muted-foreground">
            <p>Esecuzioni totali: <strong className="text-foreground">{m?.total || 0}</strong></p>
            <p>Esecuzioni riuscite: <strong className="text-foreground">{m?.success || 0}</strong></p>
          </div>
        </TabsContent>
      </Tabs>
    </>
  );
}
