// ══════════════════════════════════════════════════════════════
// useAutopilotRetryQueue — Hook coda retry
// ══════════════════════════════════════════════════════════════
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

const from = (table: string) => supabase.from(table as any);

export type RetryStatus =
  | "pending"
  | "in_progress"
  | "succeeded"
  | "failed"
  | "abandoned"
  | "cancelled";

export type RetryStep =
  | "pain_scan"
  | "roi_calculation"
  | "conversation_advance"
  | "lead_outreach";

export interface AutopilotRetryItem {
  id: string;
  owner_id: string;
  step_type: RetryStep;
  target_id: string | null;
  target_table: string | null;
  payload: Record<string, unknown>;
  status: RetryStatus;
  attempt_count: number;
  max_attempts: number;
  next_retry_at: string;
  last_attempt_at: string | null;
  last_error: string | null;
  last_error_code: string | null;
  backoff_seconds: number;
  priority: number;
  source_function: string | null;
  metadata: Record<string, unknown>;
  succeeded_at: string | null;
  abandoned_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useAutopilotRetryQueue(filter?: { status?: RetryStatus[] }) {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["autopilot-retry-queue", user?.id, filter?.status?.join(",")],
    enabled: !!user,
    refetchInterval: 15_000,
    queryFn: async () => {
      let q = from("autopilot_retry_queue")
        .select("*")
        .eq("owner_id", user!.id)
        .order("next_retry_at", { ascending: true })
        .limit(200);
      if (filter?.status?.length) {
        q = q.in("status", filter.status);
      }
      const { data, error } = await q;
      if (error) throw error;
      return (data || []) as unknown as AutopilotRetryItem[];
    },
  });
}

export function useRetryQueueStats() {
  const { data } = useAutopilotRetryQueue();
  if (!data) {
    return {
      total: 0,
      pending: 0,
      inProgress: 0,
      abandoned: 0,
      succeeded: 0,
      failed: 0,
    };
  }
  return {
    total: data.length,
    pending: data.filter((x) => x.status === "pending").length,
    inProgress: data.filter((x) => x.status === "in_progress").length,
    abandoned: data.filter((x) => x.status === "abandoned").length,
    succeeded: data.filter((x) => x.status === "succeeded").length,
    failed: data.filter((x) => x.status === "failed").length,
  };
}

export function useTriggerRetryProcessor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input?: { retry_id?: string; max_items?: number }) => {
      const { data, error } = await supabase.functions.invoke(
        "autopilot-retry-processor",
        { body: input || { max_items: 20 } },
      );
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["autopilot-retry-queue"] });
    },
  });
}

export function useCancelRetry() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await from("autopilot_retry_queue")
        .update({
          status: "cancelled",
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["autopilot-retry-queue"] }),
  });
}

export function useRescheduleRetryNow() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await from("autopilot_retry_queue")
        .update({
          status: "pending",
          next_retry_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () =>
      qc.invalidateQueries({ queryKey: ["autopilot-retry-queue"] }),
  });
}
