import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import type { Agent } from "@/types/agent";

const SECTORS = [
  "all", "food", "ncc", "beauty", "healthcare", "construction", "retail",
  "fitness", "hospitality", "beach", "plumber", "agriturismo", "cleaning",
  "legal", "accounting", "garage", "photography", "gardening", "veterinary",
  "tattoo", "childcare", "education", "events", "logistics"
] as const;

const CATEGORIES = [
  "all", "concierge", "analytics", "content", "sales", "operations", "compliance"
] as const;

export type AgentType = "all" | "universal" | "sector-specific";
export type AgentStatus = "all" | "active" | "beta" | "inactive";
export type AgentCategory = typeof CATEGORIES[number];
export type UsageFilter = "all" | "installed" | "not-installed";

export interface TenantUsage {
  tenantId: string;
  tenantName: string;
  industry: string;
  agentCount: number;
  totalExecutions: number;
  totalCost: number;
  tokenBalance: number;
  tokenUsed: number;
  tokenLimit: number;
  overLimit: boolean;
}

export function useAdminAgents() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AgentType>("all");
  const [statusFilter, setStatusFilter] = useState<AgentStatus>("all");
  const [sectorFilter, setSectorFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState<AgentCategory>("all");
  const [usageFilter, setUsageFilter] = useState<UsageFilter>("all");

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["admin-agents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents")
        .select("*")
        .order("name");
      if (error) throw error;
      return data as unknown as Agent[];
    },
  });

  const { data: installationCounts = {} } = useQuery({
    queryKey: ["admin-agent-installations-count"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_installations")
        .select("agent_id, status");
      if (error) throw error;
      const counts: Record<string, number> = {};
      (data || []).forEach((i: any) => {
        counts[i.agent_id] = (counts[i.agent_id] || 0) + 1;
      });
      return counts;
    },
  });

  // Per-tenant installation details
  const { data: installationDetails = [] } = useQuery({
    queryKey: ["admin-agent-installations-detail"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_installations")
        .select("agent_id, tenant_id, status");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: metrics = {} } = useQuery({
    queryKey: ["admin-agent-metrics"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agent_metrics")
        .select("*");
      if (error) throw error;
      const map: Record<string, { total: number; success: number; avgMs: number }> = {};
      (data || []).forEach((m: any) => {
        const prev = map[m.agent_id] || { total: 0, success: 0, avgMs: 0 };
        map[m.agent_id] = {
          total: prev.total + (m.executions_total || 0),
          success: prev.success + (m.executions_success || 0),
          avgMs: m.avg_duration_ms || prev.avgMs,
        };
      });
      return map;
    },
  });

  // Companies for tenant display
  const { data: companies = [] } = useQuery({
    queryKey: ["admin-all-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, industry, subscription_plan");
      if (error) throw error;
      return data || [];
    },
  });

  // AI usage logs aggregated by company
  const { data: aiUsageLogs = [] } = useQuery({
    queryKey: ["admin-ai-usage-logs"],
    queryFn: async () => {
      const now = new Date();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const year = now.getFullYear();
      const { data, error } = await supabase
        .from("ai_usage_logs")
        .select("company_id, input_tokens, output_tokens, cost_usd")
        .gte("created_at", `${year}-${month}-01`);
      if (error) throw error;
      return data || [];
    },
  });

  // AI token balances (restaurant-based)
  const { data: tokenBalances = [] } = useQuery({
    queryKey: ["admin-ai-token-balances"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_tokens")
        .select("restaurant_id, balance");
      if (error) throw error;
      return data || [];
    },
  });

  // Restaurants for names
  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants-list"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, slug, owner_id");
      if (error) throw error;
      return data || [];
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, newStatus }: { id: string; newStatus: string }) => {
      const { error } = await supabase
        .from("agents")
        .update({ status: newStatus, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["admin-agents"] }),
  });

  const filtered = useMemo(() => {
    let result = agents;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) => a.name.toLowerCase().includes(q) || a.description_it.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") result = result.filter((a) => a.type === typeFilter);
    if (statusFilter !== "all") result = result.filter((a) => a.status === statusFilter);
    if (sectorFilter !== "all") result = result.filter((a) => a.sectors?.includes(sectorFilter));
    if (categoryFilter !== "all") result = result.filter((a) => a.category === categoryFilter);
    if (usageFilter === "installed") result = result.filter((a) => (installationCounts[a.id] || 0) > 0);
    if (usageFilter === "not-installed") result = result.filter((a) => (installationCounts[a.id] || 0) === 0);
    return result;
  }, [agents, search, typeFilter, statusFilter, sectorFilter, categoryFilter, usageFilter, installationCounts]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = { all: agents.length };
    agents.forEach((a) =>
      (a.sectors || []).forEach((s: string) => {
        counts[s] = (counts[s] || 0) + 1;
      })
    );
    return counts;
  }, [agents]);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: agents.length };
    agents.forEach((a) => {
      counts[a.category] = (counts[a.category] || 0) + 1;
    });
    return counts;
  }, [agents]);

  const kpis = useMemo(() => {
    const activeCount = agents.filter((a) => a.status === "active").length;
    const totalInstalls = Object.values(installationCounts).reduce((s, c) => s + c, 0);
    const allMetrics = Object.values(metrics);
    const successRate =
      allMetrics.length > 0
        ? Math.round(
            (allMetrics.reduce((s, m) => s + m.success, 0) /
              Math.max(allMetrics.reduce((s, m) => s + m.total, 0), 1)) *
              100
          )
        : 0;
    const monthlyRevenue = Object.entries(installationCounts).reduce((sum, [agentId, count]) => {
      const agent = agents.find((a) => a.id === agentId);
      const price = (agent?.pricing as any)?.base || 0;
      return sum + price * count;
    }, 0);
    return { activeCount, totalInstalls, successRate, monthlyRevenue };
  }, [agents, installationCounts, metrics]);

  // Per-tenant usage summary
  const tenantUsage = useMemo<TenantUsage[]>(() => {
    // Aggregate installations by tenant
    const tenantMap: Record<string, { agents: Set<string>; execs: number }> = {};
    installationDetails.forEach((inst: any) => {
      if (!tenantMap[inst.tenant_id]) tenantMap[inst.tenant_id] = { agents: new Set(), execs: 0 };
      tenantMap[inst.tenant_id].agents.add(inst.agent_id);
    });

    // Aggregate AI usage by company
    const usageMap: Record<string, { tokens: number; cost: number }> = {};
    aiUsageLogs.forEach((log: any) => {
      if (!log.company_id) return;
      if (!usageMap[log.company_id]) usageMap[log.company_id] = { tokens: 0, cost: 0 };
      usageMap[log.company_id].tokens += (log.input_tokens || 0) + (log.output_tokens || 0);
      usageMap[log.company_id].cost += log.cost_usd || 0;
    });

    // Token balances by restaurant
    const tokenMap: Record<string, number> = {};
    tokenBalances.forEach((t: any) => {
      tokenMap[t.restaurant_id] = t.balance || 0;
    });

    // Merge companies + restaurants
    const allTenants: TenantUsage[] = [];

    companies.forEach((c: any) => {
      const t = tenantMap[c.id];
      const u = usageMap[c.id];
      const agentCount = t?.agents.size || 0;
      const totalExecs = Object.entries(metrics).reduce((sum, [agentId, m]) => {
        if (t?.agents.has(agentId)) return sum + m.total;
        return sum;
      }, 0);
      // Calculate monthly cost based on installed agents
      const totalCost = Array.from(t?.agents || []).reduce((sum, agentId) => {
        const agent = agents.find((a) => a.id === agentId);
        return sum + ((agent?.pricing as any)?.base || 0);
      }, 0);

      allTenants.push({
        tenantId: c.id,
        tenantName: c.name,
        industry: c.industry,
        agentCount,
        totalExecutions: totalExecs,
        totalCost,
        tokenBalance: 0,
        tokenUsed: u?.tokens || 0,
        tokenLimit: 50, // Default, could be plan-based
        overLimit: (u?.tokens || 0) > 50,
      });
    });

    restaurants.forEach((r: any) => {
      const t = tenantMap[r.id];
      const balance = tokenMap[r.id] || 0;
      const agentCount = t?.agents.size || 0;
      if (agentCount === 0 && balance <= 0) return; // Skip empty restaurants
      const totalCost = Array.from(t?.agents || []).reduce((sum, agentId) => {
        const agent = agents.find((a) => a.id === agentId);
        return sum + ((agent?.pricing as any)?.base || 0);
      }, 0);

      allTenants.push({
        tenantId: r.id,
        tenantName: r.name,
        industry: "food",
        agentCount,
        totalExecutions: 0,
        totalCost,
        tokenBalance: balance,
        tokenUsed: 0,
        tokenLimit: balance > 0 ? balance : 5, // Their purchased tokens
        overLimit: false,
      });
    });

    // Sort by cost desc
    return allTenants.sort((a, b) => b.totalCost - a.totalCost);
  }, [installationDetails, companies, restaurants, agents, metrics, aiUsageLogs, tokenBalances]);

  // Empire's own agents (used by platform itself)
  const empireAgents = useMemo(() => {
    return agents.filter((a) => a.type === "universal" && a.status === "active");
  }, [agents]);

  // Cost breakdown by category
  const costByCategory = useMemo(() => {
    const map: Record<string, { count: number; revenue: number }> = {};
    agents.forEach((a) => {
      const price = (a.pricing as any)?.base || 0;
      const installs = installationCounts[a.id] || 0;
      if (!map[a.category]) map[a.category] = { count: 0, revenue: 0 };
      map[a.category].count += installs;
      map[a.category].revenue += price * installs;
    });
    return map;
  }, [agents, installationCounts]);

  return {
    agents: filtered,
    allAgents: agents,
    isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    sectorFilter, setSectorFilter,
    categoryFilter, setCategoryFilter,
    usageFilter, setUsageFilter,
    sectorCounts,
    categoryCounts,
    installationCounts,
    metrics,
    kpis,
    toggleStatus,
    SECTORS,
    CATEGORIES,
    tenantUsage,
    empireAgents,
    costByCategory,
  };
}
