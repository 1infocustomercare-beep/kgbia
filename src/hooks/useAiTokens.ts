import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";

export function useAiTokens() {
  const { companyId } = useIndustry();
  const now = new Date();
  const month = now.getMonth() + 1;
  const year = now.getFullYear();

  const { data: usage = 0 } = useQuery({
    queryKey: ["ai-token-usage", companyId, month, year],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("ai_usage_logs")
        .select("input_tokens, output_tokens")
        .eq("company_id", companyId!)
        .gte("created_at", `${year}-${String(month).padStart(2, "0")}-01`);
      return data?.reduce((sum, r) => sum + (r.input_tokens || 0) + (r.output_tokens || 0), 0) || 0;
    },
  });

  const { data: plan } = useQuery({
    queryKey: ["tenant-subscription", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("tenant_subscriptions" as any)
        .select("*, plan:plan_id(name, display_name, ai_tokens, price_monthly)")
        .eq("company_id", companyId!)
        .maybeSingle();
      return data;
    },
  });

  const limit = (plan as any)?.plan?.ai_tokens || 50;

  const consumeTokens = async (feature: string, amount: number) => {
    if (usage + amount > limit) throw new Error("Gettoni IA esauriti per questo mese");
    await supabase.from("ai_usage_logs").insert({
      company_id: companyId!,
      agent_name: feature,
      input_tokens: amount,
      output_tokens: 0,
      status: "success",
    } as any);
  };

  return { usage, limit, plan, consumeTokens };
}
