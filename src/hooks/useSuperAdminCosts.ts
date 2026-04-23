import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Pannello Costi Empire — aggrega:
 *  - Listino azioni venditore (seller_action_costs)
 *  - Listino infrastruttura (infrastructure_costs)
 *  - Consumi reali venditori (demo_credit_usage)
 *  - Consumi AI tenant (ai_usage_logs)
 *  - Audit log delle modifiche prezzo (cost_catalog_audit)
 */
export function useSuperAdminCosts(periodDays = 30) {
  const since = new Date(Date.now() - periodDays * 24 * 3600 * 1000).toISOString();

  const sellerCosts = useQuery({
    queryKey: ["sa-seller-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("seller_action_costs")
        .select("*")
        .order("credit_cost", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });

  const infraCosts = useQuery({
    queryKey: ["sa-infra-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("infrastructure_costs" as any)
        .select("*")
        .order("category", { ascending: true });
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const sellerUsage = useQuery({
    queryKey: ["sa-seller-usage", periodDays],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("demo_credit_usage")
        .select("user_id, action, action_label, credits_used, cost_eur_estimate, created_at, metadata")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(2000);
      if (error) throw error;
      return data || [];
    },
  });

  const aiLogs = useQuery({
    queryKey: ["sa-ai-logs", periodDays],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_usage_logs")
        .select("company_id, agent_name, input_tokens, output_tokens, cost_usd, status, created_at")
        .gte("created_at", since)
        .limit(5000);
      if (error) throw error;
      return data || [];
    },
  });

  const companies = useQuery({
    queryKey: ["sa-companies"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("companies")
        .select("id, name, industry, subscription_plan, owner_id");
      if (error) throw error;
      return data || [];
    },
  });

  const profiles = useQuery({
    queryKey: ["sa-profiles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("profiles").select("user_id, full_name");
      if (error) throw error;
      return data || [];
    },
  });

  const userRoles = useQuery({
    queryKey: ["sa-user-roles"],
    queryFn: async () => {
      const { data, error } = await supabase.from("user_roles").select("user_id, role");
      if (error) throw error;
      return data || [];
    },
  });

  const audit = useQuery({
    queryKey: ["sa-cost-audit"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cost_catalog_audit" as any)
        .select("*")
        .order("changed_at", { ascending: false })
        .limit(100);
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  // ===== Aggregati =====
  const usage = sellerUsage.data || [];
  const logs = aiLogs.data || [];
  const cos = companies.data || [];
  const profs = profiles.data || [];
  const roles = userRoles.data || [];

  const profileMap = new Map(profs.map((p: any) => [p.user_id, p.full_name]));
  const companyMap = new Map(cos.map((c: any) => [c.id, c]));
  const roleMap = new Map<string, string[]>();
  roles.forEach((r: any) => {
    const arr = roleMap.get(r.user_id) || [];
    arr.push(r.role);
    roleMap.set(r.user_id, arr);
  });

  // Costi totali periodo
  const totalSellerEur = usage.reduce((s, u: any) => s + (Number(u.cost_eur_estimate) || 0), 0);
  const totalCreditsSpent = usage.reduce((s, u: any) => s + (u.credits_used > 0 ? u.credits_used : 0), 0);
  const totalAiUsd = logs.reduce((s, l: any) => s + (Number(l.cost_usd) || 0), 0);
  const totalAiTokens = logs.reduce((s, l: any) => s + (l.input_tokens || 0) + (l.output_tokens || 0), 0);
  const totalAiEur = totalAiUsd * 0.92; // EUR/USD approx
  const totalInfraMonthly = (infraCosts.data || []).reduce(
    (s: number, c: any) => s + (Number(c.monthly_estimate_eur) || 0),
    0
  );

  // Per venditore
  const perSellerMap: Record<string, { user_id: string; name: string; credits: number; eur: number; actions: number }> = {};
  usage.forEach((u: any) => {
    if (u.credits_used <= 0) return;
    const k = u.user_id;
    if (!perSellerMap[k]) {
      perSellerMap[k] = { user_id: k, name: profileMap.get(k) || k.slice(0, 8), credits: 0, eur: 0, actions: 0 };
    }
    perSellerMap[k].credits += u.credits_used || 0;
    perSellerMap[k].eur += Number(u.cost_eur_estimate) || 0;
    perSellerMap[k].actions += 1;
  });
  const perSeller = Object.values(perSellerMap).sort((a, b) => b.eur - a.eur);

  // Per settore (companies)
  const perSectorMap: Record<string, { sector: string; tenants: number; tokens: number; eur: number; calls: number }> = {};
  logs.forEach((l: any) => {
    const co = l.company_id ? companyMap.get(l.company_id) : null;
    const sector = co?.industry || "—";
    if (!perSectorMap[sector]) perSectorMap[sector] = { sector, tenants: 0, tokens: 0, eur: 0, calls: 0 };
    perSectorMap[sector].tokens += (l.input_tokens || 0) + (l.output_tokens || 0);
    perSectorMap[sector].eur += (Number(l.cost_usd) || 0) * 0.92;
    perSectorMap[sector].calls += 1;
  });
  // Conta tenant unici per settore
  const sectorTenants: Record<string, Set<string>> = {};
  logs.forEach((l: any) => {
    if (!l.company_id) return;
    const co = companyMap.get(l.company_id);
    const sector = co?.industry || "—";
    if (!sectorTenants[sector]) sectorTenants[sector] = new Set();
    sectorTenants[sector].add(l.company_id);
  });
  Object.keys(perSectorMap).forEach(s => {
    perSectorMap[s].tenants = sectorTenants[s]?.size || 0;
  });
  const perSector = Object.values(perSectorMap).sort((a, b) => b.eur - a.eur);

  // Per azione (catalogo consumi)
  const perActionMap: Record<string, { action: string; label: string; count: number; credits: number; eur: number }> = {};
  usage.forEach((u: any) => {
    if (u.credits_used <= 0) return;
    if (!perActionMap[u.action]) {
      perActionMap[u.action] = { action: u.action, label: u.action_label || u.action, count: 0, credits: 0, eur: 0 };
    }
    perActionMap[u.action].count += 1;
    perActionMap[u.action].credits += u.credits_used;
    perActionMap[u.action].eur += Number(u.cost_eur_estimate) || 0;
  });
  const perAction = Object.values(perActionMap).sort((a, b) => b.eur - a.eur);

  return {
    loading:
      sellerCosts.isLoading ||
      infraCosts.isLoading ||
      sellerUsage.isLoading ||
      aiLogs.isLoading ||
      companies.isLoading,
    sellerCosts: sellerCosts.data || [],
    infraCosts: infraCosts.data || [],
    audit: audit.data || [],
    usage,
    logs,
    companies: cos,
    totals: {
      sellerEur: totalSellerEur,
      credits: totalCreditsSpent,
      aiUsd: totalAiUsd,
      aiTokens: totalAiTokens,
      aiEur: totalAiEur,
      infraMonthly: totalInfraMonthly,
      grandTotal: totalSellerEur + totalAiEur + totalInfraMonthly,
    },
    perSeller,
    perSector,
    perAction,
    refetch: () => {
      sellerCosts.refetch();
      infraCosts.refetch();
      sellerUsage.refetch();
      aiLogs.refetch();
      audit.refetch();
    },
  };
}
