// ══════════════════════════════════════════════════════════════
// autopilot-retry-processor — Esegue i retry pendenti
// Invocato dallo scheduler o manualmente dal cockpit.
// Per ogni voce pending con next_retry_at <= now() invoca
// la edge function corrispondente al step_type.
// In caso di successo → mark_autopilot_retry_success
// In caso di errore → enqueue_autopilot_retry (incrementa attempt + backoff)
// ══════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface RetryItem {
  id: string;
  owner_id: string;
  step_type: string;
  target_id: string | null;
  target_table: string | null;
  payload: Record<string, unknown>;
  attempt_count: number;
  max_attempts: number;
}

async function executeRetry(
  supa: ReturnType<typeof createClient>,
  item: RetryItem,
): Promise<{ ok: boolean; error?: string; code?: string }> {
  try {
    let fn = "";
    let body: Record<string, unknown> = {};

    switch (item.step_type) {
      case "pain_scan":
        fn = "autopilot-pain-detector";
        body = { ...item.payload, force_refresh: true };
        break;
      case "roi_calculation":
        fn = "autopilot-roi-calculator";
        body = { ...item.payload };
        break;
      case "conversation_advance":
        fn = "autopilot-conversation-engine";
        body = {
          action: "advance_conversation",
          conversation_id: item.target_id,
          triggered_by: "retry_processor",
          ...item.payload,
        };
        break;
      case "lead_outreach":
        fn = "arianna-multichannel-outreach";
        body = { ...item.payload, lead_id: item.target_id };
        break;
      default:
        return { ok: false, error: `unknown_step_type:${item.step_type}`, code: "unknown_step" };
    }

    const { data, error } = await supa.functions.invoke(fn, { body });
    if (error) {
      return { ok: false, error: error.message, code: "invoke_error" };
    }
    if (data && typeof data === "object" && "success" in data && (data as any).success === false) {
      return {
        ok: false,
        error: (data as any).error || "function_returned_failure",
        code: (data as any).error_code || "fn_failure",
      };
    }
    return { ok: true };
  } catch (e) {
    return { ok: false, error: (e as Error).message, code: "exception" };
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    let body: { owner_id?: string; max_items?: number; retry_id?: string } = {};
    try {
      body = await req.json();
    } catch {
      // empty body OK
    }

    const maxItems = Math.min(Math.max(body.max_items || 10, 1), 50);

    // Pick due retries
    let query = supa
      .from("autopilot_retry_queue")
      .select("id, owner_id, step_type, target_id, target_table, payload, attempt_count, max_attempts")
      .eq("status", "pending")
      .lte("next_retry_at", new Date().toISOString())
      .order("priority", { ascending: false })
      .order("next_retry_at", { ascending: true })
      .limit(maxItems);

    if (body.retry_id) {
      query = supa
        .from("autopilot_retry_queue")
        .select("id, owner_id, step_type, target_id, target_table, payload, attempt_count, max_attempts")
        .eq("id", body.retry_id)
        .limit(1);
    } else if (body.owner_id) {
      query = query.eq("owner_id", body.owner_id);
    }

    const { data: items, error } = await query;
    if (error) throw error;

    const results: any[] = [];

    for (const raw of (items || []) as unknown as RetryItem[]) {
      // Mark in_progress
      await supa
        .from("autopilot_retry_queue")
        .update({
          status: "in_progress",
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", raw.id);

      const res = await executeRetry(supa, raw);

      if (res.ok) {
        await supa.rpc("mark_autopilot_retry_success", { p_id: raw.id });
        results.push({ id: raw.id, status: "succeeded" });
      } else {
        await supa.rpc("enqueue_autopilot_retry", {
          p_owner_id: raw.owner_id,
          p_step_type: raw.step_type,
          p_target_id: raw.target_id,
          p_target_table: raw.target_table,
          p_payload: raw.payload,
          p_error: res.error,
          p_error_code: res.code,
          p_source: "autopilot-retry-processor",
          p_priority: 5,
          p_max_attempts: raw.max_attempts,
        });
        results.push({ id: raw.id, status: "retry_scheduled", error: res.error });
      }
    }

    return new Response(
      JSON.stringify({ success: true, processed: results.length, results }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[autopilot-retry-processor] fatal:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
