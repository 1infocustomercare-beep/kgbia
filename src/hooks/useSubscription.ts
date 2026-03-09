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

export function useSubscription(restaurantId: string | undefined) {
  const [state, setState] = useState<SubscriptionState>({
    plan: "essential",
    status: "trialing",
    trialEnd: null,
    loading: true,
  });

  useEffect(() => {
    if (!restaurantId) {
      setState(s => ({ ...s, loading: false }));
      return;
    }

    const fetch = async () => {
      const { data } = await supabase
        .from("restaurant_subscriptions")
        .select("plan, status, trial_end")
        .eq("restaurant_id", restaurantId)
        .maybeSingle();

      if (data) {
        setState({
          plan: normalizePlanId(data.plan),
          status: data.status,
          trialEnd: data.trial_end,
          loading: false,
        });
      } else {
        setState(s => ({ ...s, loading: false }));
      }
    };

    fetch();

    const channel = supabase
      .channel(`sub-${restaurantId}`)
      .on("postgres_changes", {
        event: "*",
        schema: "public",
        table: "restaurant_subscriptions",
        filter: `restaurant_id=eq.${restaurantId}`,
      }, () => fetch())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [restaurantId]);

  const can = (feature: FeatureKey) =>
    hasFeature(state.plan, state.status, feature);

  const requiredPlanFor = (feature: FeatureKey) =>
    PLAN_CONFIGS[getRequiredPlan(feature)];

  return { ...state, can, requiredPlanFor };
}
