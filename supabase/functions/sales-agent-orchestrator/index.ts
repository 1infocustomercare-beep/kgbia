// Sales Agent "Arianna" Orchestrator
// Plan → Hunt → Enrich → Score → Draft → Approve → Send → Learn
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

interface Action {
  type: string;
  channel?: string;
  title: string;
  description?: string;
  payload?: Record<string, unknown>;
}

async function callAI(messages: any[], model = "google/gemini-2.5-flash"): Promise<string> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });
  if (!r.ok) throw new Error(`AI gateway ${r.status}: ${await r.text()}`);
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

async function logAction(supabase: any, owner_id: string, job_id: string, lead_id: string | null, a: Action, status = "success", result: any = null, durationMs = 0) {
  const { data } = await supabase.from("sales_agent_actions").insert({
    owner_id, job_id, lead_id,
    action_type: a.type,
    channel: a.channel ?? "system",
    status,
    title: a.title,
    description: a.description ?? null,
    payload: a.payload ?? {},
    result,
    duration_ms: durationMs,
  }).select("id").single();
  return data?.id;
}

async function huntLeads(supabase: any, owner_id: string, job_id: string, config: any): Promise<any[]> {
  const t0 = Date.now();
  await logAction(supabase, owner_id, job_id, null, {
    type: "search", title: "🔍 Caccia nuovi lead",
    description: `Settori: ${(config.target_sectors || []).join(", ") || "tutti"} · Città: ${(config.target_cities || []).join(", ") || "Italia"}`,
  }, "running");

  // Pesca lead esistenti non ancora contattati dall'agente
  const { data: leads } = await supabase
    .from("leads")
    .select("id, business_name, sector, city, phone, email, website, ai_score, status")
    .eq("owner_id", owner_id)
    .in("status", ["new", "contacted"])
    .order("ai_score", { ascending: false, nullsFirst: false })
    .limit(config.daily_limits?.new_leads ?? 10);

  await logAction(supabase, owner_id, job_id, null, {
    type: "search", title: `✅ Trovati ${leads?.length ?? 0} lead pronti per outreach`,
    payload: { count: leads?.length ?? 0 },
  }, "success", { leads_found: leads?.length ?? 0 }, Date.now() - t0);

  return leads ?? [];
}

async function enrichAndScore(supabase: any, owner_id: string, job_id: string, lead: any) {
  const t0 = Date.now();
  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "enrich", title: `🧠 Analisi profonda: ${lead.business_name}`,
    description: "Cerco contesto, pain points, opportunità di vendita",
  }, "running");

  // Recupera knowledge esistente
  const { data: knowledge } = await supabase
    .from("sales_agent_knowledge")
    .select("title, content")
    .eq("owner_id", owner_id)
    .eq("lead_id", lead.id)
    .limit(10);

  const profile = await callAI([
    {
      role: "system",
      content: "Sei un Senior Sales Consultant. Analizza un lead e ritorna JSON con: pain_points (array), value_props (array), best_hook (string), risk_objections (array), recommended_channel (email|whatsapp|linkedin), urgency (low|medium|high), best_time_to_contact (string).",
    },
    {
      role: "user",
      content: `Lead:\n${JSON.stringify(lead, null, 2)}\n\nKnowledge precedente:\n${JSON.stringify(knowledge ?? [], null, 2)}`,
    },
  ]);

  let parsed: any = {};
  try {
    const m = profile.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {};
  } catch { /* ignore */ }

  await supabase.from("sales_agent_knowledge").insert({
    owner_id, lead_id: lead.id,
    knowledge_type: "lead_profile",
    title: `Profilo aggiornato ${new Date().toISOString().slice(0,10)}`,
    content: parsed,
    confidence: 0.8,
  });

  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "score", title: `📊 Profilo completato · canale: ${parsed.recommended_channel ?? "email"}`,
    payload: parsed,
  }, "success", parsed, Date.now() - t0);

  return parsed;
}

async function draftMessage(supabase: any, owner_id: string, job_id: string, lead: any, profile: any, config: any) {
  const t0 = Date.now();
  const channel = profile.recommended_channel ?? "email";
  if (!config.channels_enabled?.[channel]) {
    return null; // canale disabilitato
  }

  const tone = config.voice_tone ?? "professional_friendly";
  const draft = await callAI([
    {
      role: "system",
      content: `Sei Arianna, sales agent professionale di Empire AI Group. Scrivi un messaggio di outreach ${channel} in italiano, tono ${tone}, MAI spam, MAX 6 righe per email / 3 per whatsapp. Aggancio personalizzato sul pain point. CTA chiara: proporre call 15min. Firma: ${config.signature ?? "Arianna · Empire AI Group"}. Ritorna JSON {"subject":"...", "body":"..."}.`,
    },
    {
      role: "user",
      content: `Lead: ${JSON.stringify(lead)}\nProfilo: ${JSON.stringify(profile)}`,
    },
  ]);

  let parsed: { subject?: string; body?: string } = {};
  try {
    const m = draft.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : { body: draft };
  } catch { parsed = { body: draft }; }

  const actionId = await logAction(supabase, owner_id, job_id, lead.id, {
    type: "draft", channel, title: `✍️ Bozza ${channel}: ${lead.business_name}`,
    payload: parsed,
  }, config.autonomy_mode === "full_auto" ? "success" : "needs_approval", parsed, Date.now() - t0);

  // Crea approval se non full_auto
  if (config.autonomy_mode !== "full_auto") {
    await supabase.from("sales_agent_approvals").insert({
      owner_id, action_id: actionId, lead_id: lead.id, channel,
      draft_subject: parsed.subject ?? null,
      draft_body: parsed.body ?? "",
      reasoning: `Hook: ${profile.best_hook ?? ""} · Pain: ${(profile.pain_points ?? []).join(", ")}`,
      recipient: channel === "email" ? lead.email : lead.phone,
    });
  }

  return { actionId, draft: parsed, channel };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const { owner_id, job_type = "hunt_and_outreach", trigger_source = "manual" } = body;

    if (!owner_id) {
      return new Response(JSON.stringify({ error: "owner_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Carica config
    const { data: config } = await supabase
      .from("sales_agent_config").select("*").eq("user_id", owner_id).maybeSingle();

    if (!config?.is_active) {
      return new Response(JSON.stringify({ error: "agent_inactive" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Crea job
    const { data: job } = await supabase.from("sales_agent_jobs").insert({
      owner_id, job_type, trigger_source, status: "running", started_at: new Date().toISOString(),
    }).select("*").single();

    // 1. HUNT
    const leads = await huntLeads(supabase, owner_id, job.id, config);

    let processed = 0;
    let drafts = 0;
    for (const lead of leads.slice(0, 5)) { // max 5 per run per non saturare
      const profile = await enrichAndScore(supabase, owner_id, job.id, lead);
      const draft = await draftMessage(supabase, owner_id, job.id, lead, profile, config);
      if (draft) drafts++;
      processed++;
    }

    await supabase.from("sales_agent_jobs").update({
      status: "completed",
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - new Date(job.started_at).getTime(),
      output_payload: { leads_processed: processed, drafts_created: drafts },
    }).eq("id", job.id);

    await supabase.from("sales_agent_config").update({
      total_jobs_run: (config.total_jobs_run ?? 0) + 1,
    }).eq("user_id", owner_id);

    return new Response(JSON.stringify({
      success: true, job_id: job.id, leads_processed: processed, drafts_created: drafts,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("orchestrator error:", e);
    return new Response(JSON.stringify({ error: e.message ?? "unknown" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
