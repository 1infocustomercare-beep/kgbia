import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, Power, PowerOff, ChevronDown, ChevronUp, Bot, Filter, Zap, Crown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { CATEGORY_LABELS } from "@/types/agent";
import type { Agent } from "@/types/agent";

interface TenantInstallation {
  id: string;
  agent_id: string;
  tenant_id: string;
  status: string;
  config: any;
  created_at: string;
}

interface TenantInfo {
  id: string;
  name: string;
  industry: string;
  plan: string;
  type: "company" | "restaurant";
}

const INDUSTRY_COLORS: Record<string, string> = {
  food: "#C8963E", ncc: "#1E3A5F", beauty: "#E91E8C", healthcare: "#10B981",
  fitness: "#F97316", retail: "#8B5CF6", hospitality: "#0EA5E9", beach: "#06B6D4",
  plumber: "#6366F1", electrician: "#EAB308", construction: "#78716C",
};

const PLAN_LABELS: Record<string, string> = {
  essential: "Essential", smart_ia: "Smart IA", empire_pro: "Empire Pro",
  digital_start: "Digital Start", growth_ai: "Growth AI", empire_domination: "Empire",
  starter: "Starter", free: "Free",
};

export default function TenantAgentsTab() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);

  // Fetch all agents
  const { data: agents = [] } = useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => {
      const { data, error } = await supabase.from("agents").select("*").order("name");
      if (error) throw error;
      return data as unknown as Agent[];
    },
  });

  // Fetch ALL installations (super admin view)
  const { data: installations = [], isLoading: loadingInstalls } = useQuery({
    queryKey: ["admin-all-installations"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_installations")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data || []) as unknown as TenantInstallation[];
    },
  });

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ["admin-companies-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, industry, subscription_plan");
      if (error) throw error;
      return data || [];
    },
  });

  // Fetch restaurants (legacy food tenants)
  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants-list-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, slug");
      if (error) throw error;
      return data || [];
    },
  });

  // Build tenant map
  const tenantMap = useMemo(() => {
    const map = new Map<string, TenantInfo>();
    companies.forEach((c: any) => map.set(c.id, {
      id: c.id, name: c.name, industry: c.industry || "custom",
      plan: c.subscription_plan || "essential", type: "company",
    }));
    restaurants.forEach((r: any) => {
      if (!map.has(r.id)) {
        map.set(r.id, {
          id: r.id, name: r.name, industry: "food",
          plan: "essential", type: "restaurant",
        });
      }
    });
    return map;
  }, [companies, restaurants]);

  const agentMap = useMemo(() => new Map(agents.map(a => [a.id, a])), [agents]);

  // Group installations by tenant
  const tenantGroups = useMemo(() => {
    const groups = new Map<string, TenantInstallation[]>();
    installations.forEach(inst => {
      const arr = groups.get(inst.tenant_id) || [];
      arr.push(inst);
      groups.set(inst.tenant_id, arr);
    });
    return groups;
  }, [installations]);

  // Get unique industries from tenants with installations
  const industries = useMemo(() => {
    const set = new Set<string>();
    tenantGroups.forEach((_, tid) => {
      const t = tenantMap.get(tid);
      if (t) set.add(t.industry);
    });
    return Array.from(set).sort();
  }, [tenantGroups, tenantMap]);

  // Filtered tenant list
  const filteredTenants = useMemo(() => {
    const entries = Array.from(tenantGroups.entries())
      .map(([tid, installs]) => ({ tid, installs, tenant: tenantMap.get(tid) }))
      .filter(e => {
        if (!e.tenant) return true; // show unknown tenants too
        if (industryFilter !== "all" && e.tenant.industry !== industryFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!e.tenant.name.toLowerCase().includes(q) && !e.tenant.industry.toLowerCase().includes(q)) return false;
        }
        return true;
      })
      .sort((a, b) => b.installs.length - a.installs.length);
    return entries;
  }, [tenantGroups, tenantMap, industryFilter, search]);

  // Toggle single installation
  const toggleInstall = useMutation({
    mutationFn: async ({ installId, newStatus }: { installId: string; newStatus: string }) => {
      if (newStatus === "removed") {
        const { error } = await supabase
          .from("agent_installations")
          .delete()
          .eq("id", installId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("agent_installations")
          .update({ status: newStatus } as any)
          .eq("id", installId);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-all-installations"] });
      toast({ title: "✅ Stato aggiornato" });
    },
    onError: () => toast({ title: "Errore", variant: "destructive" }),
  });

  const totalTenants = filteredTenants.length;
  const totalActiveInstalls = installations.filter(i => i.status === "active").length;

  return (
    <div className="space-y-3">
      {/* Summary */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center">
          <Building2 className="w-3 h-3 mx-auto mb-0.5 text-primary" />
          <p className="text-sm font-bold text-primary">{totalTenants}</p>
          <p className="text-[0.5rem] text-muted-foreground">Account</p>
        </div>
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center">
          <Bot className="w-3 h-3 mx-auto mb-0.5 text-emerald-400" />
          <p className="text-sm font-bold text-emerald-400">{totalActiveInstalls}</p>
          <p className="text-[0.5rem] text-muted-foreground">Agenti Attivi</p>
        </div>
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center">
          <Zap className="w-3 h-3 mx-auto mb-0.5 text-amber-400" />
          <p className="text-sm font-bold text-amber-400">{installations.length}</p>
          <p className="text-[0.5rem] text-muted-foreground">Installazioni</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cerca account..."
            className="pl-7 h-8 text-xs bg-secondary/40 border-border/30"
          />
        </div>
        <select
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
          className="h-8 px-2 rounded-lg bg-secondary/40 border border-border/30 text-[0.6rem] text-foreground"
        >
          <option value="all">Tutti i settori</option>
          {industries.map(ind => (
            <option key={ind} value={ind}>{ind}</option>
          ))}
        </select>
      </div>

      {/* Tenant List */}
      {loadingInstalls ? (
        <div className="flex justify-center py-12">
          <motion.div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full" animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }} />
        </div>
      ) : filteredTenants.length === 0 ? (
        <div className="text-center py-12">
          <Building2 className="w-10 h-10 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-muted-foreground text-xs">Nessun account con agenti installati</p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {filteredTenants.map(({ tid, installs, tenant }, idx) => {
            const isExpanded = expandedTenant === tid;
            const activeCount = installs.filter(i => i.status === "active").length;
            const inactiveCount = installs.length - activeCount;
            const color = tenant ? INDUSTRY_COLORS[tenant.industry] || "hsl(var(--primary))" : "hsl(var(--primary))";

            return (
              <motion.div
                key={tid}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.02 }}
                className="rounded-xl border border-border/30 overflow-hidden bg-secondary/20"
              >
                {/* Tenant Header */}
                <button
                  onClick={() => setExpandedTenant(isExpanded ? null : tid)}
                  className="w-full flex items-center gap-2 p-2.5 hover:bg-secondary/40 transition-colors text-left"
                >
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold shrink-0"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {tenant?.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.7rem] font-semibold text-foreground truncate">
                      {tenant?.name || `ID: ${tid.slice(0, 8)}...`}
                    </p>
                    <div className="flex gap-1 mt-0.5">
                      {tenant && (
                        <Badge variant="outline" className="text-[0.45rem] h-3.5 px-1" style={{ borderColor: color, color }}>
                          {tenant.industry}
                        </Badge>
                      )}
                      {tenant && (
                        <Badge variant="secondary" className="text-[0.45rem] h-3.5 px-1">
                          {PLAN_LABELS[tenant.plan] || tenant.plan}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right shrink-0 mr-1">
                    <div className="flex items-center gap-1">
                      <span className="text-[0.55rem] text-emerald-400 font-bold">{activeCount}</span>
                      {inactiveCount > 0 && (
                        <span className="text-[0.55rem] text-muted-foreground">/ {inactiveCount} off</span>
                      )}
                    </div>
                    <p className="text-[0.45rem] text-muted-foreground">agenti</p>
                  </div>
                  {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />}
                </button>

                {/* Expanded: Agent list for this tenant */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2.5 pb-2.5 space-y-1 border-t border-border/20 pt-2">
                        {installs
                          .sort((a, b) => (a.status === "active" ? -1 : 1))
                          .map(inst => {
                            const agent = agentMap.get(inst.agent_id!);
                            const cat = agent ? CATEGORY_LABELS[agent.category] : null;
                            const isActive = inst.status === "active";

                            return (
                              <div
                                key={inst.id}
                                className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                                  isActive ? "bg-emerald-500/5 border border-emerald-500/20" : "bg-secondary/30 border border-border/20 opacity-60"
                                }`}
                              >
                                <span className="text-sm shrink-0">{agent?.icon_emoji || "🤖"}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-[0.65rem] font-semibold text-foreground truncate">
                                    {agent?.name || inst.agent_id}
                                  </p>
                                  <div className="flex gap-1 mt-0.5">
                                    {cat && (
                                      <span className="text-[0.45rem] px-1 py-0.5 rounded-full" style={{ backgroundColor: `${cat.color}15`, color: cat.color }}>
                                        {cat.label}
                                      </span>
                                    )}
                                    <span className="text-[0.45rem] text-muted-foreground">
                                      {new Date(inst.created_at).toLocaleDateString("it-IT")}
                                    </span>
                                  </div>
                                </div>
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toggleInstall.mutate({
                                      installId: inst.id,
                                      newStatus: isActive ? "inactive" : "active",
                                    });
                                  }}
                                  disabled={toggleInstall.isPending}
                                  className={`p-1.5 rounded-lg transition-all ${
                                    isActive
                                      ? "bg-emerald-500/20 text-emerald-400 hover:bg-destructive/20 hover:text-destructive"
                                      : "bg-secondary/50 text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-400"
                                  }`}
                                  title={isActive ? "Disattiva per questo account" : "Attiva per questo account"}
                                >
                                  {isActive ? <Power className="w-3.5 h-3.5" /> : <PowerOff className="w-3.5 h-3.5" />}
                                </button>
                              </div>
                            );
                          })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
