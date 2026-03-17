import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  hasFeature,
  normalizePlanId,
  getRequiredPlan,
  PLAN_CONFIGS,
  type PlanId,
  type FeatureKey,
} from "@/lib/subscription-plans";

interface SubscriptionState {
  plan: PlanId;
  status: string;
  trialEnd: string | null;
  loading: boolean;
}

/**
 * Universal subscription hook — works for both Food (restaurant_subscriptions)
 * and all other sectors (business_subscriptions).
 * @param entityId - restaurant ID or company ID
 * @param entityType - "restaurant" | "company" (defaults to auto-detect)
 */
export function useSubscription(
  entityId: string | undefined,
  entityType?: "restaurant" | "company",
) {
  const [state, setState] = useState<SubscriptionState>({
    plan: "essential",
    status: "trialing",
    trialEnd: null,
    loading: true,
  });

  useEffect(() => {
    if (!entityId) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    const fetchSub = async () => {
      // Try business_subscriptions first (covers all sectors including food via companies)
      if (entityType !== "restaurant") {
        const { data: bizSub } = await supabase
          .from("business_subscriptions")
          .select("plan, status, trial_end")
          .eq("company_id", entityId)
          .maybeSingle();

        if (bizSub) {
          setState({
            plan: normalizePlanId(bizSub.plan),
            status: bizSub.status,
            trialEnd: bizSub.trial_end,
            loading: false,
          });
          return;
        }
      }

      // Fallback: restaurant_subscriptions (legacy food sector)
      const { data: restSub } = await supabase
        .from("restaurant_subscriptions")
        .select("plan, status, trial_end")
        .eq("restaurant_id", entityId)
        .maybeSingle();

      if (restSub) {
        setState({
          plan: normalizePlanId(restSub.plan),
          status: restSub.status,
          trialEnd: restSub.trial_end,
          loading: false,
        });
        return;
      }

      setState(s => ({ ...s, loading: false }));
    };

    fetchSub();

    // Listen to both tables for realtime updates
    const channels: ReturnType<typeof supabase.channel>[] = [];

    if (entityType !== "restaurant") {
      const bizChannel = supabase
        .channel(`biz-sub-${entityId}`)
        .on("postgres_changes", {
          event: "*",
          schema: "public",
          table: "business_subscriptions",
          filter: `company_id=eq.${entityId}`,
        }, () => fetchSub())
        .subscribe();
      channels.push(bizChannel);
    }

    const restChannel = supabase
      .channel(`rest-sub-${entityId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "restaurant_subscriptions",
        filter: `restaurant_id=eq.${entityId}`,
      }, () => fetchSub())
      .subscribe();
    channels.push(restChannel);

    return () => {
      channels.forEach(ch => supabase.removeChannel(ch));
    };
  }, [entityId, entityType]);

  const can = (feature: FeatureKey) =>
    hasFeature(state.plan, state.status, feature);

  const requiredPlanFor = (feature: FeatureKey) =>
    PLAN_CONFIGS[getRequiredPlan(feature)];

  return { ...state, can, requiredPlanFor };
}
