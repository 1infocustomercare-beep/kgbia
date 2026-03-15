import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { DollarSign, AlertTriangle, TrendingUp, Zap, Building2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface UsageByCompany {
  company_id: string;
  company_name: string;
  industry: string;
  total_tokens: number;
  total_calls: number;
  cost_usd: number;
}

export default function AgentCostsTab() {
  // Get ai_usage_logs aggregated by company
  const { data: usageLogs = [] } = useQuery({
    queryKey: ["admin-ai-usage-by-company"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ai_usage_logs")
        .select("company_id, input_tokens, output_tokens, cost_usd, agent_name, status")
        .not("company_id", "is", null);
      if (error) throw error;
      return data || [];
    },
  });

  // Get companies for names
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

  // Get restaurant ai_tokens balances
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

  // Get restaurants for names
  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants-list-costs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("restaurants")
        .select("id, name, slug");
      if (error) throw error;
      return data || [];
    },
  });

  // Aggregate usage by company
  const companyMap = new Map(companies.map(c => [c.id, c]));
  const usageByCompany: UsageByCompany[] = (() => {
    const agg: Record<string, { tokens: number; calls: number; cost: number }> = {};
    usageLogs.forEach((log: any) => {
      if (!log.company_id) return;
      if (!agg[log.company_id]) agg[log.company_id] = { tokens: 0, calls: 0, cost: 0 };
      agg[log.company_id].tokens += (log.input_tokens || 0) + (log.output_tokens || 0);
      agg[log.company_id].calls += 1;
      agg[log.company_id].cost += (log.cost_usd || 0);
    });
    return Object.entries(agg)
      .map(([id, v]) => {
        const co = companyMap.get(id);
        return {
          company_id: id,
          company_name: co?.name || "Sconosciuto",
          industry: co?.industry || "—",
          total_tokens: v.tokens,
          total_calls: v.calls,
          cost_usd: v.cost,
        };
      })
      .sort((a, b) => b.total_tokens - a.total_tokens);
  })();

  // Low balance alerts for restaurants
  const lowBalanceAlerts = tokenBalances
    .filter((t: any) => t.balance <= 10)
    .map((t: any) => {
      const rest = restaurants.find((r: any) => r.id === t.restaurant_id);
      return { ...t, name: rest?.name || t.restaurant_id, slug: rest?.slug };
    })
    .sort((a: any, b: any) => a.balance - b.balance);

  const totalCost = usageByCompany.reduce((s, c) => s + c.cost_usd, 0);
  const totalTokens = usageByCompany.reduce((s, c) => s + c.total_tokens, 0);
  const totalCalls = usageByCompany.reduce((s, c) => s + c.total_calls, 0);

  return (
    <div className="space-y-3">
      {/* Summary KPIs */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center">
          <DollarSign className="w-3 h-3 mx-auto mb-0.5 text-amber-400" />
          <p className="text-sm font-bold text-amber-400">${totalCost.toFixed(2)}</p>
          <p className="text-[0.5rem] text-muted-foreground">Costo Totale</p>
        </div>
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center">
          <Zap className="w-3 h-3 mx-auto mb-0.5 text-primary" />
          <p className="text-sm font-bold text-primary">{(totalTokens / 1000).toFixed(1)}K</p>
          <p className="text-[0.5rem] text-muted-foreground">Token Usati</p>
        </div>
        <div className="bg-secondary/40 border border-border/40 rounded-xl p-2 text-center">
          <TrendingUp className="w-3 h-3 mx-auto mb-0.5 text-emerald-400" />
          <p className="text-sm font-bold text-emerald-400">{totalCalls}</p>
          <p className="text-[0.5rem] text-muted-foreground">Chiamate AI</p>
        </div>
      </div>

      {/* Low balance alerts */}
      {lowBalanceAlerts.length > 0 && (
        <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20">
          <div className="flex items-center gap-1.5 mb-2">
            <AlertTriangle className="w-3.5 h-3.5 text-destructive" />
            <span className="text-[0.65rem] font-semibold text-destructive">
              {lowBalanceAlerts.length} account con crediti bassi (≤10)
            </span>
          </div>
          <div className="space-y-1">
            {lowBalanceAlerts.slice(0, 5).map((a: any) => (
              <div key={a.restaurant_id} className="flex items-center justify-between px-2 py-1 rounded-lg bg-background/60">
                <span className="text-[0.6rem] text-foreground truncate max-w-[60%]">{a.name}</span>
                <Badge variant="destructive" className="text-[0.5rem] h-4 px-1.5">
                  {a.balance} crediti
                </Badge>
              </div>
            ))}
            {lowBalanceAlerts.length > 5 && (
              <p className="text-[0.55rem] text-destructive/70 text-center">
                +{lowBalanceAlerts.length - 5} altri
              </p>
            )}
          </div>
        </div>
      )}

      {/* Top spenders by company */}
      <div>
        <p className="text-[0.6rem] uppercase tracking-wider text-muted-foreground mb-1.5 font-semibold flex items-center gap-1">
          <Building2 className="w-3 h-3" /> Utilizzo AI per Account
        </p>
        {usageByCompany.length === 0 ? (
          <p className="text-center text-xs text-muted-foreground py-6">Nessun dato di utilizzo</p>
        ) : (
          <div className="space-y-1">
            {usageByCompany.slice(0, 15).map((c, i) => {
              const maxTokens = usageByCompany[0]?.total_tokens || 1;
              const pct = Math.round((c.total_tokens / maxTokens) * 100);
              return (
                <motion.div
                  key={c.company_id}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.02 }}
                  className="relative p-2 rounded-xl bg-secondary/30 border border-border/30 overflow-hidden"
                >
                  {/* Progress bar bg */}
                  <div
                    className="absolute inset-y-0 left-0 bg-primary/5 rounded-xl"
                    style={{ width: `${pct}%` }}
                  />
                  <div className="relative flex items-center justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[0.55rem] font-bold text-muted-foreground w-4">#{i + 1}</span>
                        <span className="text-[0.65rem] font-semibold text-foreground truncate">{c.company_name}</span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <Badge variant="outline" className="text-[0.45rem] h-3.5 px-1 border-border/50">
                          {c.industry}
                        </Badge>
                        <span className="text-[0.5rem] text-muted-foreground">{c.total_calls} call</span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-[0.65rem] font-bold text-primary">{(c.total_tokens / 1000).toFixed(1)}K</p>
                      <p className="text-[0.45rem] text-muted-foreground">${c.cost_usd.toFixed(2)}</p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
