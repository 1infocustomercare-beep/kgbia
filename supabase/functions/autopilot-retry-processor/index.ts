// ══════════════════════════════════════════════════════════════
// autopilot-retry-processor
// Drena la coda autopilot_retry_queue: per ogni task pending con
// next_retry_at <= now() invoca la funzione corrispondente al
// step_type passando i payload originali, poi marca succeeded
// o re-enqueue (con backoff esponenziale via enqueue_autopilot_retry).
// ══════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const STEP_TO_FUNCTION: Record<string, string> = {
  pain_scan: "autopilot-pain-detector",
  start_conversation: "autopilot-conversation-engine",
  generate_followup: "autopilot-conversation-engine",
  conversation: "autopilot-conversation-engine",
  roi: "autopilot-pain-detector", // ROI viene calcolato insieme al pain scan
};

function buildBody(stepType: string, payload: any, targetId: string) {
  switch (stepType) {
    case "pain_scan":
    case "roi":
      return {
        url: payload?.url,
        lead_id: targetId,
        sector: payload?.sector,
        force_refresh: payload?.force_refresh ?? false,
      };
    case "start_conversation":
      return {
        action: "start_conversation",
        lead_id: targetId,
        pain_scan_id: payload?.pain_scan_id,
        roi_calculation_id: payload?.roi_calculation_id,
        channel: payload?.channel ?? "chat",
        contact_name: payload?.contact_name,
        contact_phone: payload?.contact_phone,
        contact_email: payload?.contact_email,
        sector: payload?.sector,
      };
    case "generate_followup":
    case "conversation":
      return {
        action: "generate_followup",
        conversation_id: targetId,
        triggered_by: "retry-processor",
      };
    default:
      return payload;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }
  // ── Auth guard: require shared cron secret ──
  const CRON_SECRET = Deno.env.get("CRON_SECRET");
  const authHeader = req.headers.get("Authorization") || "";
  const cronHeader = req.headers.get("x-cron-secret") || "";
  const isService = !!SERVICE_KEY && authHeader.includes(SERVICE_KEY);
  const isCron = !!CRON_SECRET && cronHeader === CRON_SECRET;
  if (!isService && !isCron) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
  try {
    const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const { data: tasks, error } = await supa
      .from("autopilot_retry_queue")
      .select("*")
      .eq("status", "pending")
      .lte("next_retry_at", new Date().toISOString())
      .order("priority", { ascending: true })
      .order("next_retry_at", { ascending: true })
      .limit(20);
    if (error) throw error;

    const results: any[] = [];

    for (const task of tasks || []) {
      const fnName = STEP_TO_FUNCTION[task.step_type];
      if (!fnName) {
        await supa
          .from("autopilot_retry_queue")
          .update({
            status: "abandoned",
            abandoned_at: new Date().toISOString(),
            last_error: `unknown_step_type:${task.step_type}`,
          })
          .eq("id", task.id);
        results.push({ id: task.id, status: "abandoned", reason: "unknown_step" });
        continue;
      }

      // Mark in_progress
      await supa
        .from("autopilot_retry_queue")
        .update({
          status: "in_progress",
          last_attempt_at: new Date().toISOString(),
        })
        .eq("id", task.id);

      try {
        const body = buildBody(task.step_type, task.payload || {}, task.target_id);
        const resp = await fetch(`${SUPABASE_URL}/functions/v1/${fnName}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${SERVICE_KEY}`,
            "x-autopilot-impersonate": task.owner_id,
          },
          body: JSON.stringify(body),
        });
        if (!resp.ok) {
          const txt = await resp.text();
          // Re-enqueue con backoff
          await supa.rpc("enqueue_autopilot_retry", {
            p_owner_id: task.owner_id,
            p_step_type: task.step_type,
            p_target_id: task.target_id,
            p_target_table: task.target_table,
            p_payload: task.payload,
            p_error: `${resp.status} ${txt.slice(0, 240)}`,
            p_error_code: String(resp.status),
            p_source: "autopilot-retry-processor",
          });
          results.push({ id: task.id, status: "retry_failed", code: resp.status });
        } else {
          await resp.json().catch(() => null);
          await supa.rpc("mark_autopilot_retry_success", { p_id: task.id });
          results.push({ id: task.id, status: "succeeded" });
        }
      } catch (e) {
        await supa.rpc("enqueue_autopilot_retry", {
          p_owner_id: task.owner_id,
          p_step_type: task.step_type,
          p_target_id: task.target_id,
          p_target_table: task.target_table,
          p_payload: task.payload,
          p_error: (e as Error).message,
          p_error_code: "exception",
          p_source: "autopilot-retry-processor",
        });
        results.push({ id: task.id, status: "exception", error: (e as Error).message });
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
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
