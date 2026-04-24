// ══════════════════════════════════════════════════════════════
// Empire Autopilot OS — React Hooks
// ══════════════════════════════════════════════════════════════
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const from = (table: string) => supabase.from(table as any);

// ── Pain scan ──
export function useRunPainScan() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      url: string;
      lead_id?: string;
      sector?: string;
      force_refresh?: boolean;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-pain-detector",
        { body: input },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["pain-scans"] });
      qc.invalidateQueries({ queryKey: ["roi-calculations"] });
    },
  });
}

export function usePainScans() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["pain-scans", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await from("pain_scans")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });
}

// ── ROI ──
export function useROICalculations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["roi-calculations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await from("roi_calculations")
        .select("*")
        .eq("owner_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });
}

// ── Conversations ──
export function useAutopilotConversations() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["autopilot-conversations", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await from("autopilot_conversations")
        .select("*")
        .eq("owner_id", user!.id)
        .order("updated_at", { ascending: false });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useAutopilotMessages(conversationId: string | null) {
  return useQuery({
    queryKey: ["autopilot-messages", conversationId],
    enabled: !!conversationId,
    queryFn: async () => {
      const { data, error } = await from("autopilot_messages")
        .select("*")
        .eq("conversation_id", conversationId!)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data || [];
    },
  });
}

export function useStartAutopilotConversation() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      lead_id?: string;
      pain_scan_id?: string;
      roi_calculation_id?: string;
      channel?: "chat" | "email" | "whatsapp_link";
      contact_name?: string;
      contact_phone?: string;
      contact_email?: string;
      sector?: string;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-conversation-engine",
        { body: { action: "start_conversation", ...input } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["autopilot-conversations"] }),
  });
}

export function useSendAutopilotMessage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: {
      conversation_id: string;
      lead_message: string;
    }) => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-conversation-engine",
        { body: { action: "send_user_message", ...input } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: (_d, vars) => {
      qc.invalidateQueries({
        queryKey: ["autopilot-messages", vars.conversation_id],
      });
      qc.invalidateQueries({ queryKey: ["autopilot-conversations"] });
    },
  });
}

// ── Coach + Leaderboard ──
export function useSalesCoachInsights() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["sales-coach-insights", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await from("sales_coach_insights")
        .select("*")
        .eq("user_id", user!.id)
        .eq("is_dismissed", false)
        .order("created_at", { ascending: false })
        .limit(20);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useMyLeaderboardRow() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["my-leaderboard", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await from("sales_leaderboard")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export function useGlobalLeaderboard() {
  return useQuery({
    queryKey: ["global-leaderboard"],
    queryFn: async () => {
      const { data, error } = await from("sales_leaderboard")
        .select(
          "user_id, display_name, avatar_url, total_xp, level, badges, deals_closed_month, revenue_month_eur, streak_days, global_rank",
        )
        .order("total_xp", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data || [];
    },
  });
}

export function useRefreshSalesStats() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-sales-coach",
        { body: { action: "refresh_stats" } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-leaderboard"] });
      qc.invalidateQueries({ queryKey: ["global-leaderboard"] });
      qc.invalidateQueries({ queryKey: ["sales-coach-insights"] });
    },
  });
}

export function useGenerateCoachInsight() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-sales-coach",
        { body: { action: "generate_insight" } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["sales-coach-insights"] }),
  });
}

// ── Config ──
export function useAutopilotConfig() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["autopilot-config", user?.id],
    enabled: !!user,
    queryFn: async () => {
      const { data, error } = await from("autopilot_config")
        .select("*")
        .eq("owner_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
  });
}

export type LeadPriorityRules = {
  pain_score_weight: number;
  roi_potential_weight: number;
  sector_match_weight: number;
  recency_weight: number;
  min_pain_score: number;
  min_roi_eur_month: number;
  preferred_sectors: string[];
  excluded_sectors: string[];
};

export type AutopilotConfigPatch = {
  is_enabled?: boolean;
  ai_model?: string;
  autonomy_level?: "conservative" | "balanced" | "aggressive" | "full_auto";
  daily_scan_cap?: number;
  enabled_channels?: string[];
  paused_channels?: string[];
  target_sectors?: string[];
  custom_instructions?: string | null;
  operating_hours?: { start: string; end: string; timezone?: string };
  run_interval_minutes?: number;
  priority_rules?: LeadPriorityRules;
  max_concurrent_conversations?: number;
  max_new_conversations_per_run?: number;
};

export function useUpdateAutopilotConfig() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (patch: AutopilotConfigPatch) => {
      if (!user) throw new Error("not_authenticated");
      // Upsert: garantisce la riga anche al primo salvataggio
      const { data, error } = await from("autopilot_config")
        .upsert(
          { owner_id: user.id, ...patch, updated_at: new Date().toISOString() },
          { onConflict: "owner_id" },
        )
        .select()
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["autopilot-config"] });
    },
  });
}

export function useResetDailyScanCounter() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("not_authenticated");
      const { error } = await from("autopilot_config")
        .update({
          daily_scans_used: 0,
          scans_reset_at: new Date(
            new Date().setHours(24, 0, 0, 0),
          ).toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("owner_id", user.id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["autopilot-config"] }),
  });
}

// ── Scheduler runs (storico esecuzioni) ──
export function useAutopilotSchedulerRuns(limit = 10) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["autopilot-scheduler-runs", user?.id, limit],
    enabled: !!user,
    refetchInterval: 30_000, // refresh ogni 30s
    queryFn: async () => {
      const { data, error } = await from("autopilot_scheduler_runs")
        .select("*")
        .eq("owner_id", user!.id)
        .order("triggered_at", { ascending: false })
        .limit(limit);
      if (error) throw error;
      return data || [];
    },
  });
}

// ── Trigger manuale dello scheduler (forza una run) ──
export function useTriggerScheduler() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-scheduler",
        { body: { triggered_at: new Date().toISOString(), manual: true } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["autopilot-config"] });
      qc.invalidateQueries({ queryKey: ["autopilot-scheduler-runs"] });
    },
  });
}

// ── Toggle pausa di un singolo canale ──
export function useToggleChannelPause() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (channel: string) => {
      if (!user) throw new Error("not_authenticated");
      const { data: cfg } = await from("autopilot_config")
        .select("paused_channels")
        .eq("owner_id", user.id)
        .maybeSingle();
      const current: string[] = Array.isArray((cfg as any)?.paused_channels)
        ? (cfg as any).paused_channels
        : [];
      const next = current.includes(channel)
        ? current.filter((c) => c !== channel)
        : [...current, channel];
      const { error } = await from("autopilot_config")
        .update({ paused_channels: next, updated_at: new Date().toISOString() })
        .eq("owner_id", user.id);
      if (error) throw error;
      return next;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["autopilot-config"] }),
  });
}
