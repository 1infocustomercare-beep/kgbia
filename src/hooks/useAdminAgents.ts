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

export type AgentType = "all" | "universal" | "sector-specific";
export type AgentStatus = "all" | "active" | "beta" | "inactive";

export function useAdminAgents() {
  const qc = useQueryClient();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<AgentType>("all");
  const [statusFilter, setStatusFilter] = useState<AgentStatus>("all");
  const [sectorFilter, setSectorFilter] = useState("all");

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
    return result;
  }, [agents, search, typeFilter, statusFilter, sectorFilter]);

  const sectorCounts = useMemo(() => {
    const counts: Record<string, number> = { all: agents.length };
    agents.forEach((a) =>
      (a.sectors || []).forEach((s: string) => {
        counts[s] = (counts[s] || 0) + 1;
      })
    );
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

  return {
    agents: filtered,
    allAgents: agents,
    isLoading,
    search, setSearch,
    typeFilter, setTypeFilter,
    statusFilter, setStatusFilter,
    sectorFilter, setSectorFilter,
    sectorCounts,
    installationCounts,
    metrics,
    kpis,
    toggleStatus,
    SECTORS,
  };
}
