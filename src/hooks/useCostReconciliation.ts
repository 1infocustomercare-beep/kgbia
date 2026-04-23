import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface ReconciliationData {
  period_days: number;
  period_start: string;
  period_end: string;
  eur_per_usd: number;
  stripe: {
    volume_eur: number;
    processor_fee_eur: number;
    application_fee_eur: number;
    events_count: number;
  };
  ai_gateway: {
    real_usd: number;
    real_eur: number;
    estimated_eur: number;
    tokens: number;
    calls: number;
    credits: number;
    delta_eur: number;
  };
  byok_invoices: { total_eur: number; count: number };
  token_purchases: { revenue_eur: number; count: number };
  totals: {
    real_costs_eur: number;
    estimated_costs_eur: number;
    revenue_eur: number;
  };
}

/**
 * Riconciliazione costi reali (Stripe fees + AI Gateway reale + BYOK + token purchases)
 * vs costi stimati (listino seller_action_costs × consumi).
 *
 * Backed by RPC `compute_cost_reconciliation` (real-time) and
 * `snapshot_cost_reconciliation` (append-only audit ledger).
 */
export function useCostReconciliation(periodDays = 30) {
  const qc = useQueryClient();

  const live = useQuery({
    queryKey: ["cost-reconciliation", periodDays],
    queryFn: async () => {
      const { data, error } = await supabase.rpc("compute_cost_reconciliation" as any, {
        p_period_days: periodDays,
      });
      if (error) throw error;
      return data as unknown as ReconciliationData;
    },
    refetchInterval: 60_000,
  });

  const history = useQuery({
    queryKey: ["cost-reconciliation-history"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cost_reconciliation_snapshots" as any)
        .select("*")
        .order("created_at", { ascending: false })
        .limit(60);
      if (error) throw error;
      return (data || []) as any[];
    },
  });

  const snapshot = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.rpc("snapshot_cost_reconciliation" as any, {
        p_period_days: periodDays,
      });
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({ title: "Snapshot salvato ✓", description: "Riconciliazione registrata nel ledger storico" });
      qc.invalidateQueries({ queryKey: ["cost-reconciliation-history"] });
    },
    onError: (err: any) => {
      toast({ title: "Errore snapshot", description: err.message, variant: "destructive" });
    },
  });

  return {
    data: live.data,
    loading: live.isLoading,
    history: history.data || [],
    snapshot: snapshot.mutate,
    snapshotting: snapshot.isPending,
    refetch: () => {
      live.refetch();
      history.refetch();
    },
  };
}
