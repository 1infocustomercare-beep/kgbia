import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useState, useMemo } from "react";
import type { Agent } from "@/types/agent";

export function useAgents() {
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sectorFilter, setSectorFilter] = useState<string | null>(null);

  const { data: agents = [], isLoading } = useQuery({
    queryKey: ["agents-marketplace"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents" as any)
        .select("*")
        .neq("status", "inactive")
        .order("type", { ascending: true })
        .order("name", { ascending: true });
      if (error) throw error;
      return (data || []).map((a: any) => ({
        ...a,
        pricing: typeof a.pricing === 'string' ? JSON.parse(a.pricing) : a.pricing,
      })) as Agent[];
    },
  });

  const filtered = useMemo(() => {
    let result = agents;
    if (categoryFilter) result = result.filter(a => a.category === categoryFilter);
    if (sectorFilter) result = result.filter(a => a.sectors.includes(sectorFilter));
    return result;
  }, [agents, categoryFilter, sectorFilter]);

  const universalAgents = useMemo(() => filtered.filter(a => a.type === 'universal'), [filtered]);
  const sectorAgents = useMemo(() => filtered.filter(a => a.type === 'sector-specific'), [filtered]);

  return {
    agents: filtered,
    universalAgents,
    sectorAgents,
    loading: isLoading,
    categoryFilter,
    setCategoryFilter,
    sectorFilter,
    setSectorFilter,
  };
}
