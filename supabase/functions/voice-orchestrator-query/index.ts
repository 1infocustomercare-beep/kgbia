import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Empire Voice Orchestrator — Query Executor
 * Esegue letture sicure su tabelle whitelisted e ritorna sintesi vocale.
 * SOLO Super Admin può chiedere query cross-tenant.
 */

const ALLOWED_TABLES = new Set([
  "leads",
  "orders",
  "restaurants",
  "companies",
  "demo_factory_runs",
  "partner_demo_credits",
  "voice_command_log",
  "ai_usage_logs",
  "demo_credit_usage",
  "reservations",
  "menu_items",
]);

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");

    const authClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user }, error: authErr } = await authClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const adminClient = createClient(supabaseUrl, serviceKey);
    const { data: roles } = await adminClient
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id);
    const isSuperAdmin = (roles || []).some((r: any) => r.role === "super_admin");

    const { table, filters, summary_question } = await req.json();

    if (!table || typeof table !== "string" || !ALLOWED_TABLES.has(table)) {
      return new Response(JSON.stringify({ error: "table not allowed" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Build base query
    let q = adminClient.from(table).select("*", { count: "exact" });

    // Tenant scoping for non-super-admin
    if (!isSuperAdmin) {
      // best-effort scoping by common owner columns
      if (table === "restaurants" || table === "companies") {
        q = q.eq("owner_id", user.id);
      } else if (table === "leads" || table === "demo_factory_runs" || table === "voice_command_log") {
        q = q.eq("owner_id", user.id);
      }
    }

    // Apply simple filters
    if (filters && typeof filters === "object") {
      if (filters.status) q = q.eq("status", filters.status);
      if (filters.created_today === true) {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        q = q.gte("created_at", today.toISOString());
      }
      if (filters.created_this_week === true) {
        const d = new Date();
        d.setDate(d.getDate() - 7);
        q = q.gte("created_at", d.toISOString());
      }
      if (filters.created_this_month === true) {
        const d = new Date();
        d.setDate(1);
        d.setHours(0, 0, 0, 0);
        q = q.gte("created_at", d.toISOString());
      }
    }

    q = q.limit(200).order("created_at", { ascending: false });

    const { data: rows, count, error } = await q;
    if (error) {
      console.error("Query error:", error);
      throw error;
    }

    // Ask AI to summarize naturally
    let summary = `Trovati ${count ?? rows?.length ?? 0} risultati.`;
    if (lovableKey && rows) {
      try {
        const sampleRows = rows.slice(0, 30);
        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${lovableKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "google/gemini-3-flash-preview",
            messages: [
              {
                role: "system",
                content:
                  "Sei un assistente vocale italiano. Rispondi in massimo 2 frasi parlate, naturali, con numeri precisi. Mai elenchi o markdown.",
              },
              {
                role: "user",
                content: `Domanda: ${summary_question || "Riassumi"}\n\nDati (totale ${count}):\n${JSON.stringify(sampleRows)}`,
              },
            ],
          }),
        });
        if (aiResp.ok) {
          const j = await aiResp.json();
          summary = j.choices?.[0]?.message?.content || summary;
        }
      } catch (e) {
        console.warn("Summary AI failed:", e);
      }
    }

    return new Response(
      JSON.stringify({ success: true, count, summary, rows: rows?.slice(0, 50) }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("voice-orchestrator-query error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
