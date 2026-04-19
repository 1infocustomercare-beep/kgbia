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
const INTERNAL_FUNCTION_AUTH = `Bearer ${SERVICE_KEY}`;
const APP_ORIGIN = "https://empireia.lovable.app";

const ITALIAN_HUNT_CITIES = [
  "Milano", "Roma", "Napoli", "Torino", "Firenze", "Bologna", "Bari",
  "Palermo", "Catania", "Verona", "Padova", "Genova", "Venezia", "Brescia",
  "Modena", "Parma", "Rimini", "Salerno", "Perugia", "Cagliari",
];
const HUNT_SECTORS = ["food", "beauty", "ncc", "fitness", "hospitality", "healthcare"];
const DEFAULT_CHANNELS = {
  email: true,
  whatsapp: false,
  linkedin: false,
  instagram: false,
  voice: false,
};

interface Action {
  type: string;
  channel?: string;
  title: string;
  description?: string;
  payload?: Record<string, unknown>;
}

interface ScoutedLead {
  id?: string;
  name?: string;
  business_name?: string;
  sector?: string;
  city?: string;
  _sector?: string;
  _city?: string;
  full_address?: string | null;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  lat?: number | null;
  lon?: number | null;
  google_rating?: number | null;
  google_reviews?: number | null;
  google_maps_url?: string | null;
  search_google?: string | null;
  search_instagram?: string | null;
  search_facebook?: string | null;
  source?: string | null;
}

class AIUnavailableError extends Error {
  constructor(public status: number, public detail: string) {
    super(`AI gateway ${status}: ${detail}`);
  }
}

async function callAI(messages: any[], model = "google/gemini-2.5-flash"): Promise<string> {
  const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({ model, messages }),
  });
  if (!r.ok) {
    const detail = await r.text();
    // 402 = no credits, 429 = rate limit → fallback degraded mode
    throw new AIUnavailableError(r.status, detail);
  }
  const j = await r.json();
  return j.choices?.[0]?.message?.content ?? "";
}

// ============= FALLBACK HEURISTICS (when AI gateway unavailable) =============

function heuristicProfile(lead: any): any {
  const sector = getLeadSector(lead);
  const city = getLeadCity(lead);
  const name = getLeadName(lead);
  const hasWebsite = !!lead.website;
  const hasInsta = !!lead.instagram;
  const hasReviews = (lead.google_reviews ?? 0) > 0;
  const lowRating = (lead.google_rating ?? 5) < 4.0;

  // Score euristico: più info pubbliche = più caldo
  let score = 50;
  if (lead.email) score += 15;
  if (lead.phone) score += 10;
  if (hasInsta) score += 8;
  if (hasReviews) score += 7;
  if (lowRating) score += 10; // attività con problemi reputazionali = più bisognose
  if (!hasWebsite) score += 5;
  score = Math.min(95, score);

  const sectorPains: Record<string, string[]> = {
    food: ["Commissioni JustEat/Deliveroo al 30%", "Recensioni negative non gestite", "Menu QR e prenotazioni manuali"],
    beauty: ["Appuntamenti gestiti su WhatsApp/agenda cartacea", "No-show senza acconto", "Zero CRM clienti"],
    ncc: ["Prenotazioni via telefono/WhatsApp", "Niente tracking GPS clienti", "Gestione flotta su Excel"],
    fitness: ["Iscrizioni cartacee", "Niente app prenotazione corsi", "Membership su carta"],
    hospitality: ["OTA prendono il 15-25%", "Check-in manuale", "Niente upselling automatico"],
    healthcare: ["Agenda manuale", "Promemoria appuntamenti via SMS pagati", "GDPR a rischio"],
  };

  const pain_points = sectorPains[sector] ?? sectorPains.food;
  const value_props = [
    "App white-label personalizzata + sito SEO in 24h",
    "Solo 2% commissioni vs 30% delle piattaforme",
    "AI agents 24/7 per prenotazioni, recensioni, marketing",
  ];

  const recommended_channel = lead.email ? "email" : lead.phone ? "whatsapp" : lead.instagram ? "instagram" : "email";

  return {
    pain_points,
    value_props,
    best_hook: `Ho dato un'occhiata a ${name} a ${city}${lowRating ? ` e ho visto che alcune recensioni recenti penalizzano il rating` : ""}. Ho preparato una preview personalizzata gratuita.`,
    risk_objections: ["Già abbiamo un sito", "Costa troppo / non ho tempo"],
    recommended_channel,
    urgency: score >= 75 ? "high" : score >= 60 ? "medium" : "low",
    best_time_to_contact: sector === "food" ? "10:00-11:30 o 15:00-17:00" : "9:30-12:00",
    score,
    _fallback: true,
  };
}

function heuristicDraft(lead: any, profile: any, channel: string, previewLink: string, signature: string): { subject: string; body: string } {
  const name = getLeadName(lead);
  const city = getLeadCity(lead);
  const pain = profile.pain_points?.[0] ?? "gestione manuale di clienti e prenotazioni";
  const linkLine = previewLink ? `\n\nGuarda la preview personalizzata che ho preparato per te:\n${previewLink}` : "";

  if (channel === "whatsapp") {
    return {
      subject: "",
      body: `Ciao ${name}! Sono Arianna di Empire AI Group. Ho notato che probabilmente gestite ancora ${pain} — ho preparato per voi una demo gratuita su misura.${linkLine}\n\nPosso mostrartela in 15 min? — ${signature}`,
    };
  }

  if (channel === "instagram") {
    return {
      subject: "",
      body: `Ciao ${name}! Adoro quello che fate a ${city} ✨ Ho preparato una demo personalizzata di un'app white-label per voi.${linkLine}\n\n15 min per mostrartela? — ${signature}`,
    };
  }

  return {
    subject: `${name} — preview personalizzata Empire (gratis)`,
    body: `Ciao,\n\nSono Arianna di Empire AI Group. Ho analizzato ${name} a ${city} e ho notato che potreste risparmiare tempo su ${pain}.\n\nPer farti vedere concretamente cosa intendo, ho già preparato una preview personalizzata della vostra futura app + sito (white-label, brandizzata sul vostro nome).${linkLine}\n\nTi va una call di 15 minuti questa settimana per fartela vedere dal vivo?\n\n— ${signature}`,
  };
}

function getLeadName(lead: Partial<ScoutedLead> & Record<string, any>) {
  return lead.business_name ?? lead.name ?? "Lead";
}

function getLeadSector(lead: Partial<ScoutedLead> & Record<string, any>) {
  return lead.sector ?? lead._sector ?? "food";
}

function getLeadCity(lead: Partial<ScoutedLead> & Record<string, any>) {
  return lead.city ?? lead._city ?? "";
}

function getEnabledChannels(config: any) {
  return { ...DEFAULT_CHANNELS, ...(config?.channels_enabled ?? {}) };
}

function getRecipientForChannel(channel: string, lead: any): string | null {
  switch (channel) {
    case "email":
      return lead.email ?? null;
    case "whatsapp":
    case "voice":
      return lead.phone ?? null;
    case "instagram":
      return lead.instagram ?? null;
    case "linkedin":
      return lead.linkedin ?? null;
    default:
      return null;
  }
}

function pickOutboundChannel(profile: any, lead: any, config: any): string | null {
  const enabled = getEnabledChannels(config);
  const preferred = profile?.recommended_channel;
  const ordered = [preferred, "email", "whatsapp", "instagram", "linkedin"].filter(Boolean) as string[];

  for (const channel of ordered) {
    if (!enabled[channel as keyof typeof enabled]) continue;
    if (getRecipientForChannel(channel, lead)) return channel;
  }

  return null;
}

function mapLeadToDemoInput(lead: any) {
  return {
    businessName: getLeadName(lead),
    sector: getLeadSector(lead),
    sectorLabel: getLeadSector(lead),
    city: getLeadCity(lead),
    zone: "",
    fullAddress: lead.full_address ?? null,
    phone: lead.phone ?? null,
    email: lead.email ?? null,
    website: lead.website ?? null,
    instagram: lead.instagram ?? null,
    facebook: lead.facebook ?? null,
    googleRating: lead.google_rating ?? null,
    googleReviews: lead.google_reviews ?? null,
    googleMapsUrl: lead.google_maps_url ?? null,
  };
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
    owner_id,
    job_id,
    lead_id,
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

async function huntLeadsLive(
  supabase: any,
  owner_id: string,
  job_id: string,
  config: any,
): Promise<any[]> {
  const t0 = Date.now();

  const sectors = (config.target_sectors?.length ? config.target_sectors : HUNT_SECTORS);
  const cities = (config.target_cities?.length ? config.target_cities : ITALIAN_HUNT_CITIES);

  const pickedCities = [...cities].sort(() => 0.5 - Math.random()).slice(0, 2);
  const pickedSectors = [...sectors].sort(() => 0.5 - Math.random()).slice(0, 2);

  await logAction(supabase, owner_id, job_id, null, {
    type: "search",
    title: `🔍 Caccia live: ${pickedSectors.join(", ")} a ${pickedCities.join(" + ")}`,
    description: "Motore Scout reale · 4 fonti (Photon, Nominatim, Overpass, Google) in parallelo",
    payload: { cities: pickedCities, sectors: pickedSectors },
  }, "running");

  const allFound: any[] = [];

  for (const city of pickedCities) {
    for (const sector of pickedSectors) {
      try {
        const res = await fetch(`${SUPABASE_URL}/functions/v1/lead-search`, {
          method: "POST",
          headers: {
            Authorization: INTERNAL_FUNCTION_AUTH,
            apikey: ANON_KEY,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city,
            sector,
            page: Math.floor(Math.random() * 3),
            use_google: false,
          }),
        });

        const rawBody = await res.text();
        const j = rawBody ? JSON.parse(rawBody) : {};

        if (!res.ok) {
          await logAction(supabase, owner_id, job_id, null, {
            type: "scrape",
            title: `❌ Errore caccia ${city}/${sector}`,
            description: `Lead Scout ${res.status}: ${j.error ?? rawBody.slice(0, 180)}`,
            payload: { city, sector, status: res.status },
          }, "failed", j);
          continue;
        }

        const found = (j.results ?? []).slice(0, 5).map((r: any) => ({ ...r, _sector: sector, _city: city }));
        allFound.push(...found);

        await logAction(supabase, owner_id, job_id, null, {
          type: "scrape",
          title: `📡 ${city} · ${sector}: ${found.length} attività`,
          description: `Sorgenti: Photon ${j.sources?.photon ?? 0} · Nominatim ${j.sources?.nominatim ?? 0} · Overpass ${j.sources?.overpass ?? 0}`,
          payload: { city, sector, count: found.length, sources: j.sources },
        }, found.length > 0 ? "success" : "warning", { count: found.length, has_more: j.has_more ?? false });
      } catch (e: any) {
        await logAction(supabase, owner_id, job_id, null, {
          type: "scrape",
          title: `❌ Errore caccia ${city}/${sector}`,
          description: e.message,
        }, "failed", { error: e.message });
      }
    }
  }

  const saved: any[] = [];
  for (const f of allFound) {
    const leadName = f.name ?? "";
    if (!leadName) continue;

    const { data: existing } = await supabase
      .from("leads")
      .select("id, name, sector, city, phone, email, website, full_address, ai_score, instagram, google_rating, google_reviews")
      .eq("owner_id", owner_id)
      .eq("name", leadName)
      .eq("city", f._city)
      .maybeSingle();

    if (existing) {
      saved.push({
        ...existing,
        ...f,
        id: existing.id,
        name: existing.name ?? leadName,
        business_name: existing.name ?? leadName,
        sector: existing.sector ?? f._sector,
        city: existing.city ?? f._city,
        full_address: existing.full_address ?? f.full_address ?? null,
      });
      continue;
    }

    const channelsAvailable = [
      f.email ? "email" : null,
      f.phone ? "whatsapp" : null,
      f.instagram ? "instagram" : null,
      f.website ? "website" : null,
    ].filter(Boolean);

    const { data: ins } = await supabase.from("leads").insert({
      owner_id,
      name: leadName,
      sector: f._sector,
      city: f._city,
      full_address: f.full_address ?? null,
      phone: f.phone ?? null,
      email: f.email ?? null,
      website: f.website ?? null,
      source: f.source ?? "arianna_auto",
      status: "new",
      ai_score: null,
      channels_available: channelsAvailable,
      notes: `Trovato da Arianna · ${f.source ?? "scout"}`,
      lead_source_data: {
        scout_city: f._city,
        scout_sector: f._sector,
        coordinates: f.lat && f.lon ? { lat: f.lat, lon: f.lon } : null,
        google_maps_url: f.google_maps_url ?? null,
        search_google: f.search_google ?? null,
        search_instagram: f.search_instagram ?? null,
        search_facebook: f.search_facebook ?? null,
        raw: f,
      },
    }).select("id, name, sector, city, phone, email, website, full_address, ai_score, instagram, google_rating, google_reviews").single();

    if (ins?.id) {
      saved.push({
        ...ins,
        ...f,
        id: ins.id,
        name: ins.name ?? leadName,
        business_name: ins.name ?? leadName,
        sector: ins.sector ?? f._sector,
        city: ins.city ?? f._city,
        full_address: ins.full_address ?? f.full_address ?? null,
      });
    }
  }

  await logAction(supabase, owner_id, job_id, null, {
    type: "search",
    title: `✅ ${saved.length} lead salvati nel CRM`,
    description: "Pronti per analisi profonda + generazione preview personalizzata",
    payload: { count: saved.length },
  }, "success", { leads_found: saved.length, sample: saved.slice(0, 3).map((s) => getLeadName(s)) }, Date.now() - t0);

  return saved;
}

async function enrichAndScore(supabase: any, owner_id: string, job_id: string, lead: any) {
  const t0 = Date.now();
  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "enrich",
    title: `🧠 Analisi: ${getLeadName(lead)}`,
    description: `Settore ${getLeadSector(lead)} · ${getLeadCity(lead)}`,
  }, "running");

  let parsed: any = {};
  let usedFallback = false;

  try {
    const profile = await callAI([
      {
        role: "system",
        content: "Sei un Senior Sales Consultant di Empire AI Group. Analizza un lead e ritorna SOLO JSON valido con: pain_points (array di 3 stringhe), value_props (array 3 stringhe), best_hook (stringa per aprire conversazione), risk_objections (array 2 stringhe), recommended_channel (email|whatsapp|linkedin|instagram), urgency (low|medium|high), best_time_to_contact (stringa), score (0-100 di interesse stimato).",
      },
      { role: "user", content: `Lead: ${JSON.stringify(lead)}` },
    ]);
    try {
      const m = profile.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : {};
    } catch {
      parsed = {};
    }
    if (!parsed.score && !parsed.pain_points) {
      parsed = heuristicProfile(lead);
      usedFallback = true;
    }
  } catch (e: any) {
    if (e instanceof AIUnavailableError) {
      console.warn(`[arianna] AI unavailable (${e.status}) → using heuristic profile for lead ${lead.id}`);
      parsed = heuristicProfile(lead);
      usedFallback = true;
    } else {
      throw e;
    }
  }

  if (parsed.score !== undefined && parsed.score !== null) {
    await supabase.from("leads").update({ ai_score: parsed.score }).eq("id", lead.id);
  }

  await supabase.from("sales_agent_knowledge").insert({
    owner_id,
    lead_id: lead.id,
    knowledge_type: "lead_profile",
    title: `Profilo ${new Date().toISOString().slice(0, 10)}${usedFallback ? " (euristica)" : ""}`,
    content: parsed,
    confidence: usedFallback ? 0.55 : 0.85,
  });

  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "score",
    title: `📊 Score ${parsed.score ?? "?"}/100 · canale: ${parsed.recommended_channel ?? "email"}${usedFallback ? " (modalità euristica)" : ""}`,
    description: `Hook: ${parsed.best_hook ?? "-"}`,
    payload: parsed,
  }, "success", parsed, Date.now() - t0);

  return parsed;
}

async function generatePreview(
  supabase: any,
  owner_id: string,
  job_id: string,
  lead: any,
) {
  const t0 = Date.now();
  await logAction(supabase, owner_id, job_id, lead.id, {
    type: "scrape",
    title: `🎨 Genero preview personalizzata: ${getLeadName(lead)}`,
    description: "Demo Factory · template auto-match settore",
  }, "running");

  try {
    const res = await fetch(`${SUPABASE_URL}/functions/v1/generate-demo-from-lead`, {
      method: "POST",
      headers: {
        Authorization: INTERNAL_FUNCTION_AUTH,
        apikey: ANON_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lead: mapLeadToDemoInput(lead),
        leadId: lead.id,
        partnerId: owner_id,
        originUrl: APP_ORIGIN,
      }),
    });

    const rawBody = await res.text();
    const j = rawBody ? JSON.parse(rawBody) : {};

    if (!res.ok) {
      await logAction(supabase, owner_id, job_id, lead.id, {
        type: "scrape",
        title: `⚠️ Preview non generata`,
        description: `Demo Factory ${res.status}: ${j.error ?? rawBody.slice(0, 180)}`,
      }, "warning", j, Date.now() - t0);
      return null;
    }

    if (j.preview_url || j.admin_url) {
      await supabase.from("leads").update({
        demo_preview_url: j.preview_url ?? null,
        demo_admin_url: j.admin_url ?? null,
        demo_template_variant: j.template_variant ?? null,
        demo_sub_sector: j.sub_sector ?? null,
        demo_generated_at: new Date().toISOString(),
        demo_auto_status: "ready",
      }).eq("id", lead.id);

      await logAction(supabase, owner_id, job_id, lead.id, {
        type: "scrape",
        title: `✨ Preview pronta: ${getLeadName(lead)}`,
        description: "Sito personalizzato + admin demo generati con AI",
        payload: { preview_url: j.preview_url, admin_url: j.admin_url, template: j.template_variant },
      }, "success", j, Date.now() - t0);

      return j;
    }

    await logAction(supabase, owner_id, job_id, lead.id, {
      type: "scrape",
      title: "⚠️ Preview non generata",
      description: j.error ?? "Demo Factory ha risposto vuoto",
    }, "warning", j, Date.now() - t0);
    return null;
  } catch (e: any) {
    await logAction(supabase, owner_id, job_id, lead.id, {
      type: "scrape",
      title: `❌ Errore preview ${getLeadName(lead)}`,
      description: e.message,
    }, "failed", { error: e.message }, Date.now() - t0);
    return null;
  }
}

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
  const channel = pickOutboundChannel(profile, lead, config);

  if (!channel) {
    await logAction(supabase, owner_id, job_id, lead.id, {
      type: "draft",
      title: `⚠️ Nessun canale utile per ${getLeadName(lead)}`,
      description: "Lead reale trovato ma senza recapiti compatibili con i canali attivi",
      payload: {
        email: !!lead.email,
        phone: !!lead.phone,
        instagram: !!lead.instagram,
        channels_enabled: getEnabledChannels(config),
      },
    }, "warning", null, Date.now() - t0);
    return null;
  }

  const recipient = getRecipientForChannel(channel, lead);
  if (!recipient) return null;

  const tone = config.voice_tone ?? "professional_friendly";
  const previewLink = preview?.preview_url ?? lead.demo_preview_url ?? "";
  const signature = config.signature ?? "Arianna · Empire AI Group";

  let parsed: { subject?: string; body?: string } = {};
  let usedFallback = false;

  try {
    const draft = await callAI([
      {
        role: "system",
        content: `Sei Arianna, sales agent senior di Empire AI Group. Scrivi un messaggio ${channel} in italiano, tono ${tone}, MAI spam. MAX 6 righe email / 3 whatsapp.
- Aggancio personalizzato sul pain point + nome attività
- Mostra che hai già preparato una preview personalizzata (link incluso se presente)
- CTA: proporre call 15min
- Firma: ${signature}
Ritorna SOLO JSON: {"subject":"...", "body":"..."}.`,
      },
      {
        role: "user",
        content: `Lead: ${JSON.stringify(lead)}
Profilo: ${JSON.stringify(profile)}
Preview personalizzata già pronta: ${previewLink || "(non disponibile)"}`,
      },
    ]);
    try {
      const m = draft.match(/\{[\s\S]*\}/);
      parsed = m ? JSON.parse(m[0]) : { body: draft };
    } catch {
      parsed = { body: draft };
    }
    if (!parsed.body) {
      parsed = heuristicDraft(lead, profile, channel, previewLink, signature);
      usedFallback = true;
    }
  } catch (e: any) {
    if (e instanceof AIUnavailableError) {
      console.warn(`[arianna] AI unavailable (${e.status}) → using template draft for lead ${lead.id}`);
      parsed = heuristicDraft(lead, profile, channel, previewLink, signature);
      usedFallback = true;
    } else {
      throw e;
    }
  }

  const actionId = await logAction(supabase, owner_id, job_id, lead.id, {
    type: "draft",
    channel,
    title: `✍️ Bozza ${channel}: ${getLeadName(lead)}${usedFallback ? " (template)" : ""}`,
    description: parsed.subject ?? parsed.body?.slice(0, 80),
    payload: { ...parsed, preview_url: previewLink, recipient, fallback: usedFallback },
  }, config.autonomy_mode === "full_auto" ? "success" : "needs_approval", parsed, Date.now() - t0);

  if (config.autonomy_mode !== "full_auto") {
    await supabase.from("sales_agent_approvals").insert({
      owner_id,
      action_id: actionId,
      lead_id: lead.id,
      channel,
      draft_subject: parsed.subject ?? null,
      draft_body: parsed.body ?? "",
      reasoning: `Hook: ${profile.best_hook ?? ""} · Pain: ${(profile.pain_points ?? []).join(", ")} · Preview: ${previewLink || "no"}`,
      recipient,
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
      return new Response(JSON.stringify({ error: "owner_id required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: config } = await supabase
      .from("sales_agent_config")
      .select("*")
      .eq("user_id", owner_id)
      .maybeSingle();

    if (!config?.is_active) {
      return new Response(JSON.stringify({ error: "agent_inactive" }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: job } = await supabase.from("sales_agent_jobs").insert({
      owner_id,
      job_type,
      trigger_source,
      status: "running",
      started_at: new Date().toISOString(),
    }).select("*").single();

    const leads = await huntLeadsLive(supabase, owner_id, job.id, config);

    let processed = 0;
    let drafts = 0;
    let previews = 0;
    const maxLeads = Math.min(leads.length, 4);

    for (let i = 0; i < maxLeads; i++) {
      const lead = leads[i];
      try {
        const profile = await enrichAndScore(supabase, owner_id, job.id, lead);

        let preview = null;
        if ((profile.score ?? 70) >= 50) {
          preview = await generatePreview(supabase, owner_id, job.id, lead);
          if (preview?.preview_url) previews++;
        }

        const draft = await draftMessage(supabase, owner_id, job.id, lead, profile, preview, config);
        if (draft) drafts++;
        processed++;
      } catch (e: any) {
        console.error(`lead ${lead.id} error:`, e);
        await logAction(supabase, owner_id, job.id, lead.id, {
          type: "score",
          title: `❌ Errore su ${getLeadName(lead)}`,
          description: e.message,
        }, "failed", { error: e.message });
      }
    }

    await supabase.from("sales_agent_jobs").update({
      status: "completed",
      completed_at: new Date().toISOString(),
      duration_ms: Date.now() - new Date(job.started_at).getTime(),
      output_payload: {
        leads_found: leads.length,
        leads_processed: processed,
        drafts_created: drafts,
        previews_generated: previews,
      },
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
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});