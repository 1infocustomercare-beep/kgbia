// Outreach Health Monitor
// - Queries the central failure log + recent attempts
// - Computes failure rate over a sliding window
// - Raises an admin alert if outreach is non-operational (e.g. after a deploy)
// - Designed to be called by cron OR manually right after a deploy
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const DEPLOY_VERSION = Deno.env.get("DEPLOY_VERSION") || Deno.env.get("SUPABASE_FUNCTION_VERSION") || "unknown";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const window_minutes = Math.max(5, Math.min(720, parseInt(body.window_minutes ?? "30", 10)));
    const min_attempts = Math.max(1, parseInt(body.min_attempts ?? "5", 10));
    const warn_rate = typeof body.warn_rate === "number" ? body.warn_rate : 0.5;
    const critical_rate = typeof body.critical_rate === "number" ? body.critical_rate : 0.85;

    const { data, error } = await supabase.rpc("check_outreach_health", {
      p_window_minutes: window_minutes,
      p_min_attempts: min_attempts,
      p_warn_rate: warn_rate,
      p_critical_rate: critical_rate,
      p_deploy_version: DEPLOY_VERSION,
    });

    if (error) throw error;

    // Pull a small recent failures sample to surface the dominant error
    const { data: recent } = await supabase
      .from("outreach_failures")
      .select("source_function, channel, provider, error_message, http_status, created_at")
      .gte("created_at", new Date(Date.now() - window_minutes * 60_000).toISOString())
      .order("created_at", { ascending: false })
      .limit(10);

    return new Response(
      JSON.stringify({ ok: true, deploy_version: DEPLOY_VERSION, health: data, recent_failures: recent ?? [] }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e: any) {
    console.error("[outreach-health-monitor] error:", e);
    return new Response(JSON.stringify({ ok: false, error: e?.message ?? String(e) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
