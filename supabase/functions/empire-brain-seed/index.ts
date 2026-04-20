// Empire Brain — Seeder: carica/aggiorna i 140 agenti meta nel DB.
// Solo super_admin può invocarlo.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import seedData from "../_seed/empire-brain-agents.json" with { type: "json" };

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const ORCHESTRATORS = new Set([
  "multi-agent-coordinator",
  "workflow-orchestrator",
  "agent-organizer",
  "task-distributor",
  "context-manager",
]);

const PRO_AGENTS = new Set([
  ...ORCHESTRATORS,
  "security-auditor", "architect-reviewer", "code-reviewer", "cloud-architect",
  "data-scientist", "ml-engineer", "postgres-pro", "performance-engineer", "penetration-tester",
]);

interface AgentSeed {
  slug: string;
  name: string;
  category_code: string;
  category_label: string;
  description: string;
  system_prompt: string;
  tools: string;
  model_preference: string;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Verify super_admin
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const { data: roleRow } = await admin.from("user_roles").select("role").eq("user_id", user.id).eq("role", "super_admin").maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "forbidden_super_admin_only" }), { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Load seed JSON shipped with function
    const url = new URL("../_seed/empire-brain-agents.json", import.meta.url);
    const text = await Deno.readTextFile(url);
    const seeds: AgentSeed[] = JSON.parse(text);

    // Upsert in batches of 30
    let inserted = 0;
    const BATCH = 30;
    for (let i = 0; i < seeds.length; i += BATCH) {
      const chunk = seeds.slice(i, i + BATCH).map((a) => ({
        slug: a.slug,
        name: a.name,
        category_code: a.category_code,
        category_label: a.category_label,
        description: a.description,
        system_prompt: a.system_prompt,
        tools: a.tools,
        model_preference: a.model_preference,
        is_orchestrator: ORCHESTRATORS.has(a.slug),
        ai_model: PRO_AGENTS.has(a.slug) ? "google/gemini-2.5-pro" : "google/gemini-2.5-flash",
        is_active: true,
        updated_at: new Date().toISOString(),
      }));
      const { error } = await admin.from("empire_brain_agents").upsert(chunk, { onConflict: "slug" });
      if (error) {
        console.error("Upsert batch failed:", error);
        throw error;
      }
      inserted += chunk.length;
    }

    const { count } = await admin.from("empire_brain_agents").select("*", { count: "exact", head: true });

    return new Response(
      JSON.stringify({ success: true, inserted, total_in_db: count }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("seed error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "unknown" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
