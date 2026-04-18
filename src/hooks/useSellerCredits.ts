import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface SellerActionCost {
  action: string;
  label: string;
  credit_cost: number;
  cost_eur_estimate: number;
  description: string | null;
}

export interface CreditUsageRow {
  id: string;
  action: string;
  action_label: string | null;
  credits_used: number;
  cost_eur_estimate: number | null;
  metadata: Record<string, any> | null;
  created_at: string;
}

export interface ConsumeResult {
  success: boolean;
  error?: string;
  required?: number;
  balance?: number;
  credits_used?: number;
  cost_eur?: number;
  remaining_balance?: number;
  action_label?: string;
}

/**
 * Hook centralizzato per gestione crediti del venditore.
 * - Espone saldo realtime, catalogo costi e cronologia.
 * - `consume(action, metadata)` chiama RPC atomica server-side.
 * - `getCost(action)` ritorna il costo per un'azione (per UI di conferma).
 */
export function useSellerCredits() {
  const { user } = useAuth();
  const [balance, setBalance] = useState<number>(0);
  const [costs, setCosts] = useState<Record<string, SellerActionCost>>({});
  const [history, setHistory] = useState<CreditUsageRow[]>([]);
  const [loading, setLoading] = useState(true);

  const refreshBalance = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("partner_demo_credits" as any)
      .select("balance")
      .eq("user_id", user.id)
      .maybeSingle();
    setBalance(((data as any)?.balance as number) ?? 0);
  }, [user?.id]);

  const refreshHistory = useCallback(async () => {
    if (!user?.id) return;
    const { data } = await supabase
      .from("demo_credit_usage" as any)
      .select("id, action, action_label, credits_used, cost_eur_estimate, metadata, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(50);
    setHistory((data as any) || []);
  }, [user?.id]);

  useEffect(() => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    (async () => {
      const [{ data: costsData }] = await Promise.all([
        supabase.from("seller_action_costs" as any).select("action, label, credit_cost, cost_eur_estimate, description").eq("is_active", true),
        refreshBalance(),
        refreshHistory(),
      ]);
      if (cancelled) return;
      const map: Record<string, SellerActionCost> = {};
      ((costsData as any[]) || []).forEach(c => { map[c.action] = c; });
      setCosts(map);
      setLoading(false);
    })();

    const channel = supabase
      .channel(`seller-credits-${user.id}`)
      .on("postgres_changes", {
        event: "*", schema: "public", table: "partner_demo_credits",
        filter: `user_id=eq.${user.id}`,
      }, () => refreshBalance())
      .on("postgres_changes", {
        event: "INSERT", schema: "public", table: "demo_credit_usage",
        filter: `user_id=eq.${user.id}`,
      }, () => refreshHistory())
      .subscribe();

    return () => { cancelled = true; supabase.removeChannel(channel); };
  }, [user?.id, refreshBalance, refreshHistory]);

  const getCost = useCallback((action: string): SellerActionCost | undefined => costs[action], [costs]);

  const consume = useCallback(async (action: string, metadata: Record<string, any> = {}): Promise<ConsumeResult> => {
    if (!user?.id) return { success: false, error: "unauthorized" };
    const { data, error } = await supabase.rpc("consume_seller_credits" as any, {
      p_action: action,
      p_metadata: metadata,
    });
    if (error) return { success: false, error: error.message };
    return (data as ConsumeResult) || { success: false, error: "rpc_failed" };
  }, [user?.id]);

  const totalSpent30d = history
    .filter(h => Date.now() - new Date(h.created_at).getTime() < 30 * 24 * 3600 * 1000)
    .reduce((s, h) => s + (h.cost_eur_estimate || 0), 0);

  return { balance, costs, history, loading, consume, getCost, refreshBalance, refreshHistory, totalSpent30d };
}
