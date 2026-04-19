// Sales Agent "Arianna" Orchestrator — usa il vero motore Lead Scout + Demo Factory
// Flusso: Hunt(lead-search) → Save → Enrich → Score → Preview(generate-demo-from-lead) → Draft → Approve
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;

// Città italiane principali per ricerca rotativa autonoma
const ITALIAN_HUNT_CITIES = [
  "Milano", "Roma", "Napoli", "Torino", "Firenze", "Bologna", "Bari",
  "Palermo", "Catania", "Verona", "Padova", "Genova", "Venezia", "Brescia",
  "Modena", "Parma", "Rimini", "Salerno", "Perugia", "Cagliari",
];
const HUNT_SECTORS = ["food", "beauty", "ncc", "fitness", "hospitality", "healthcare"];

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

async function logAction(
  supabase: any,
  owner_id: string,
  job_id: string,
  lead_id: string | null,
  a: Action,
  status = "success",
  result: any = null,
  durationMs = 0,
) {
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

/* ═══════════════════════════════════════════════════════
   HUNT STEP — chiama lead-search (vero motore Scout)
   ═══════════════════════════════════════════════════════ */
async function huntLeadsLive(
  supabase: any,
  owner_id: string,
  job_id: string,
  authBearer: string,
  config: any,
): Promise<any[]> {
  const t0 = Date.now();

  const sectors = (config.target_sectors?.length ? config.target_sectors : HUNT_SECTORS);
  const cities = (config.target_cities?.length ? config.target_cities : ITALIAN_HUNT_CITIES);

  // Scegli 2 città random + 2 settori random per ogni run (rotazione autonoma)
  const pickedCities = cities.sort(() => 0.5 - Math.random()).slice(0, 2);
  const pickedSectors = sectors.sort(() => 0.5 - Math.random()).slice(0, 2);

  await logAction(supabase, owner_id, job_id, null, {
    type: "search",
    title: `🔍 Caccia live: ${pickedSectors.join(", ")} a ${pickedCities.join(" + ")}`,
    description: `Motore Scout reale · 4 fonti (Photon, Nominatim, Overpass, Google) in parallelo`,
    payload: { cities: pickedCities, sectors: pickedSectors },
  }, "running");

  const allFound: any[] = [];

  for (const city of pickedCities) {
    for (const sector of pickedSectors) {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/lead-search`, {
          method: "POST",
          headers: {
            Authorization: authBearer,
            apikey: ANON_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city, sector, page: Math.floor(Math.random() * 3),
            use_google: false,
          }),
        });
        const j = await res.json().catch(() => ({}));
        const found = (j.results ?? []).slice(0, 5).map((r: any) => ({ ...r, _sector: sector, _city: city }));
        allFound.push(...found);

        await logAction(supabase, owner_id, job_id, null, {
          type: "scrape",
          title: `📡 ${city} · ${sector}: ${found.length} attività`,
          description: `Sorgenti: Photon ${j.sources?.photon ?? 0} · Nominatim ${j.sources?.nominatim ?? 0} · Overpass ${j.sources?.overpass ?? 0}`,
          payload: { city, sector, count: found.length, sources: j.sources },
        }, found.length > 0 ? "success" : "warning", { count: found.length });
      } catch (e: any) {
        await logAction(supabase, owner_id, job_id, null, {
          type: "scrape",
          title: `❌ Errore caccia ${city}/${sector}`,
          description: e.message,
        }, "failed");
      }
    }
  }

  // Salva i lead nuovi nel DB
  const saved: any[] = [];
  for (const f of allFound) {
    const { data: existing } = await supabase
      .from("leads")
      .select("id")
      .eq("owner_id", owner_id)
      .eq("business_name", f.name)
      .eq("city", f._city)
      .maybeSingle();
    if (existing) {
      saved.push({ id: existing.id, ...f, business_name: f.name });
      continue;
    }
    const { data: ins } = await supabase.from("leads").insert({
      owner_id,
      business_name: f.name,
      sector: f._sector,
      city: f._city,
      address: f.full_address ?? null,
      phone: f.phone ?? null,
      email: f.email ?? null,
      website: f.website ?? null,
      lat: f.lat ?? null,
      lng: f.lon ?? null,
      status: "new",
      source: "arianna_auto",
      ai_score: null,
      notes: `Trovato da Arianna · ${f.source ?? "scout"}`,
    }).select("id").single();
    if (ins?.id) saved.push({ id: ins.id, ...f, business_name: f.name });
  }

  await logAction(supabase, owner_id, job_id, null, {
    type: "search",
    title: `✅ ${saved.length} lead salvati nel CRM`,
    description: `Pronti per analisi profonda + generazione preview personalizzata`,
    payload: { count: saved.length },
  }, "success", { leads_found: saved.length, sample: saved.slice(0, 3).map(s => s.business_name) }, Date.now() - t0);

  return saved;
}

/* ═══════════════════════════════════════════════════════
   PROFILE — analisi AI deep del lead
   ═══════════════════════════════════════════════════════ */
async function enrichAndScore(supabase: any, owner_id: string, job_id: string, lead: any) {
  const t0 = Date.now();
  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "enrich",
    title: `🧠 Analisi: ${lead.business_name}`,
    description: `Settore ${lead.sector ?? lead._sector} · ${lead.city ?? lead._city}`,
  }, "running");

  const profile = await callAI([
    {
      role: "system",
      content: `Sei un Senior Sales Consultant di Empire AI Group. Analizza un lead e ritorna SOLO JSON valido con: pain_points (array di 3 stringhe), value_props (array 3 stringhe), best_hook (stringa per aprire conversazione), risk_objections (array 2 stringhe), recommended_channel (email|whatsapp|linkedin), urgency (low|medium|high), best_time_to_contact (stringa), score (0-100 di interesse stimato).`,
    },
    { role: "user", content: `Lead: ${JSON.stringify(lead)}` },
  ]);

  let parsed: any = {};
  try {
    const m = profile.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : {};
  } catch { /* ignore */ }

  // Aggiorna lead con score
  if (parsed.score) {
    await supabase.from("leads").update({ ai_score: parsed.score }).eq("id", lead.id);
  }

  await supabase.from("sales_agent_knowledge").insert({
    owner_id, lead_id: lead.id,
    knowledge_type: "lead_profile",
    title: `Profilo ${new Date().toISOString().slice(0,10)}`,
    content: parsed,
    confidence: 0.85,
  });

  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "score",
    title: `📊 Score ${parsed.score ?? "?"}/100 · canale: ${parsed.recommended_channel ?? "email"}`,
    description: `Hook: ${parsed.best_hook ?? "-"}`,
    payload: parsed,
  }, "success", parsed, Date.now() - t0);

  return parsed;
}

/* ═══════════════════════════════════════════════════════
   PREVIEW — invoca generate-demo-from-lead
   ═══════════════════════════════════════════════════════ */
async function generatePreview(
  supabase: any,
  owner_id: string,
  job_id: string,
  authBearer: string,
  lead: any,
) {
  const t0 = Date.now();
  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "scrape",
    title: `🎨 Genero preview personalizzata: ${lead.business_name}`,
    description: `Demo Factory · template auto-match settore`,
  }, "running");

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-demo-from-lead`, {
      method: "POST",
      headers: {
        Authorization: authBearer,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ lead_id: lead.id }),
    });
    const j = await res.json().catch(() => ({}));

    if (j.preview_url || j.admin_url) {
      // Salva i link sul lead per riuso
      await supabase.from("leads").update({
        preview_url: j.preview_url ?? null,
        admin_url: j.admin_url ?? null,
      }).eq("id", lead.id);

      await logAction(supabase, owner_id, job_id, lead.id, {
        type: "scrape",
        title: `✨ Preview pronta: ${lead.business_name}`,
        description: `Sito personalizzato + admin demo generati con AI`,
        payload: { preview_url: j.preview_url, admin_url: j.admin_url, template: j.template_variant },
      }, "success", j, Date.now() - t0);

      return j;
    } else {
      await logAction(supabase, owner_id, job_id, lead.id, {
        type: "scrape",
        title: `⚠️ Preview non generata`,
        description: j.error ?? "Demo Factory ha risposto vuoto",
      }, "warning", j, Date.now() - t0);
      return null;
    }
  } catch (e: any) {
    await logAction(supabase, owner_id, job_id, lead.id, {
      type: "scrape",
      title: `❌ Errore preview ${lead.business_name}`,
      description: e.message,
    }, "failed", { error: e.message }, Date.now() - t0);
    return null;
  }
}

/* ═══════════════════════════════════════════════════════
   DRAFT — messaggio personalizzato con preview link
   ═══════════════════════════════════════════════════════ */
async function draftMessage(
  supabase: any,
  owner_id: string,
  job_id: string,
  lead: any,
  profile: any,
  preview: any,
  config: any,
) {
  const t0 = Date.now();
  const channel = profile.recommended_channel ?? "email";
  if (!config.channels_enabled?.[channel]) return null;

  const tone = config.voice_tone ?? "professional_friendly";
  const previewLink = preview?.preview_url ?? "";

  const draft = await callAI([
    {
      role: "system",
      content: `Sei Arianna, sales agent senior di Empire AI Group. Scrivi un messaggio ${channel} in italiano, tono ${tone}, MAI spam. MAX 6 righe email / 3 whatsapp.
- Aggancio personalizzato sul pain point + nome attività
- Mostra che hai già preparato una preview personalizzata (link incluso se presente)
- CTA: proporre call 15min
- Firma: ${config.signature ?? "Arianna · Empire AI Group"}
Ritorna SOLO JSON: {"subject":"...", "body":"..."}.`,
    },
    {
      role: "user",
      content: `Lead: ${JSON.stringify(lead)}
Profilo: ${JSON.stringify(profile)}
Preview personalizzata già pronta: ${previewLink || "(non disponibile)"}`,
    },
  ]);

  let parsed: { subject?: string; body?: string } = {};
  try {
    const m = draft.match(/\{[\s\S]*\}/);
    parsed = m ? JSON.parse(m[0]) : { body: draft };
  } catch { parsed = { body: draft }; }

  const actionId = await logAction(supabase, owner_id, job_id, lead.id, {
    type: "draft",
    channel,
    title: `✍️ Bozza ${channel}: ${lead.business_name}`,
    description: parsed.subject ?? parsed.body?.slice(0, 80),
    payload: { ...parsed, preview_url: previewLink },
  }, config.autonomy_mode === "full_auto" ? "success" : "needs_approval", parsed, Date.now() - t0);

  if (config.autonomy_mode !== "full_auto") {
    await supabase.from("sales_agent_approvals").insert({
      owner_id, action_id: actionId, lead_id: lead.id, channel,
      draft_subject: parsed.subject ?? null,
      draft_body: parsed.body ?? "",
      reasoning: `Hook: ${profile.best_hook ?? ""} · Pain: ${(profile.pain_points ?? []).join(", ")} · Preview: ${previewLink || "no"}`,
      recipient: channel === "email" ? lead.email : lead.phone,
    });
  }

  return { actionId, draft: parsed, channel };
}

/* ═══════════════════════════════════════════════════════
   MAIN HANDLER
   ═══════════════════════════════════════════════════════ */
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const authHeader = req.headers.get("Authorization") ?? "";
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const { owner_id, job_type = "hunt_and_outreach", trigger_source = "manual" } = body;

    if (!owner_id) {
      return new Response(JSON.stringify({ error: "owner_id required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: config } = await supabase
      .from("sales_agent_config").select("*").eq("user_id", owner_id).maybeSingle();

    if (!config?.is_active) {
      return new Response(JSON.stringify({ error: "agent_inactive" }), {
        status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: job } = await supabase.from("sales_agent_jobs").insert({
      owner_id, job_type, trigger_source, status: "running", started_at: new Date().toISOString(),
    }).select("*").single();

    // 1. HUNT live (Lead Scout reale)
    const leads = await huntLeadsLive(supabase, owner_id, job.id, authHeader, config);

    let processed = 0;
    let drafts = 0;
    let previews = 0;
    const maxLeads = Math.min(leads.length, 4); // max 4 per run per non saturare AI gateway

    for (let i = 0; i < maxLeads; i++) {
      const lead = leads[i];
      try {
        const profile = await enrichAndScore(supabase, owner_id, job.id, lead);

        // Solo lead promettenti (score >= 50) ricevono preview personalizzata
        let preview = null;
        if ((profile.score ?? 70) >= 50) {
          preview = await generatePreview(supabase, owner_id, job.id, authHeader, lead);
          if (preview?.preview_url) previews++;
        }

        const draft = await draftMessage(supabase, owner_id, job.id, lead, profile, preview, config);
        if (draft) drafts++;
        processed++;
      } catch (e: any) {
        console.error(`lead ${lead.id} error:`, e);
        await logAction(supabase, owner_id, job.id, lead.id, {
          type: "score", title: `❌ Errore su ${lead.business_name}`, description: e.message,
        }, "failed");
      }
    }

    await supabase.from("sales_agent_jobs").update({
      status: "completed",
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - new Date(job.started_at).getTime(),
      output_payload: { leads_processed: processed, drafts_created: drafts, previews_generated: previews },
    }).eq("id", job.id);

    await supabase.from("sales_agent_config").update({
      total_jobs_run: (config.total_jobs_run ?? 0) + 1,
    }).eq("user_id", owner_id);

    return new Response(JSON.stringify({
      success: true,
      job_id: job.id,
      leads_found: leads.length,
      leads_processed: processed,
      previews_generated: previews,
      drafts_created: drafts,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e: any) {
    console.error("orchestrator error:", e);
    return new Response(JSON.stringify({ error: e.message ?? "unknown" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
