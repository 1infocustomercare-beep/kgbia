// Arianna Multi-Channel Outreach Engine
// - Adaptive AI sequencing across Email + WhatsApp + Instagram DM + Facebook DM
// - Anti-spam: suppression list, max touches, min hours between, business hours
// - Persuasive copywriting via Lovable AI
// - Mockup preview link injection on every touch
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TWILIO_API_KEY = Deno.env.get("TWILIO_API_KEY");
const DEPLOY_VERSION = Deno.env.get("DEPLOY_VERSION") || Deno.env.get("SUPABASE_FUNCTION_VERSION") || "unknown";

// ─────────── CENTRALIZED FAILURE LOG ───────────
async function logOutreachFailure(supabase: any, params: {
  channel: string;
  error_message: string;
  owner_id?: string | null;
  lead_id?: string | null;
  sequence_id?: string | null;
  touch_id?: string | null;
  recipient?: string | null;
  provider?: string | null;
  error_code?: string | null;
  http_status?: number | null;
  payload?: Record<string, unknown>;
  severity?: "warning" | "error" | "critical";
}) {
  try {
    await supabase.rpc("log_outreach_failure", {
      p_source_function: "arianna-multichannel-outreach",
      p_channel: params.channel,
      p_error_message: (params.error_message || "unknown_error").slice(0, 2000),
      p_owner_id: params.owner_id ?? null,
      p_lead_id: params.lead_id ?? null,
      p_sequence_id: params.sequence_id ?? null,
      p_touch_id: params.touch_id ?? null,
      p_recipient: params.recipient ?? null,
      p_provider: params.provider ?? null,
      p_error_code: params.error_code ?? null,
      p_http_status: params.http_status ?? null,
      p_deploy_version: DEPLOY_VERSION,
      p_payload: params.payload ?? {},
      p_severity: params.severity ?? "error",
    });
  } catch (logErr) {
    console.error("[outreach-failure-log] failed to record failure:", logErr);
  }
}

type Channel = "email" | "whatsapp" | "instagram" | "facebook";

interface Lead {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  instagram?: string;
  city?: string;
  sector?: string;
  website?: string;
  google_rating?: number;
  ai_score?: number;
  demo_preview_url?: string;
  demo_whatsapp_message?: string;
}

interface Sequence {
  id: string;
  owner_id: string;
  lead_id: string;
  current_touch_number: number;
  max_touches: number;
  channels_priority: Channel[];
  last_touch_at: string | null;
  next_touch_channel: Channel | null;
  strategy: string;
}

// ─────────── ANTI-SPAM CHECKS ───────────
function isBusinessHours(): boolean {
  const now = new Date();
  const rome = new Date(now.toLocaleString("en-US", { timeZone: "Europe/Rome" }));
  const day = rome.getDay(); // 0=Sun
  const hour = rome.getHours();
  return day >= 1 && day <= 5 && hour >= 9 && hour <= 19;
}

async function checkSuppression(supabase: any, ownerId: string, identifier: string, channel: Channel): Promise<boolean> {
  const { data } = await supabase.rpc("is_outreach_suppressed", {
    p_owner_id: ownerId, p_identifier: identifier, p_channel: channel,
  });
  return !!data;
}

// ─────────── ADAPTIVE AI: pick next channel ───────────
async function pickNextChannelAI(lead: Lead, history: any[], priorityList: Channel[]): Promise<{ channel: Channel; reasoning: string; hours_delay: number }> {
  // Channels already tried
  const tried = new Set(history.map((h) => h.channel));

  // Available channels (lead must have contact data)
  const available: Channel[] = [];
  for (const ch of priorityList) {
    if (tried.has(ch)) continue;
    if (ch === "email" && lead.email) available.push(ch);
    if (ch === "whatsapp" && lead.phone) available.push(ch);
    if (ch === "instagram" && lead.instagram) available.push(ch);
    if (ch === "facebook" && (lead.instagram || lead.website)) available.push(ch);
  }

  // Fallback heuristic if no AI key
  if (!LOVABLE_API_KEY || available.length === 0) {
    const channel = available[0] || ("email" as Channel);
    const delay = history.length === 0 ? 0 : history.length === 1 ? 48 : 96;
    return { channel, reasoning: `Heuristic: no AI, picked ${channel} after ${delay}h`, hours_delay: delay };
  }

  try {
    const prompt = `Sei Arianna, un'agente AI esperta di outreach B2B per agenzie digitali italiane. Devi scegliere il CANALE OTTIMALE e la TEMPISTICA per il prossimo contatto.

LEAD:
- Nome: ${lead.name}
- Settore: ${lead.sector || "n/d"}
- Città: ${lead.city || "n/d"}
- Rating Google: ${lead.google_rating ?? "n/d"}
- AI Score: ${lead.ai_score ?? 50}/100
- Ha sito: ${lead.website ? "sì" : "no"}

CANALI DISPONIBILI: ${available.join(", ")}
CANALI GIÀ USATI: ${[...tried].join(", ") || "nessuno"}
TOUCH PRECEDENTI: ${history.length}

Rispondi SOLO con JSON valido (no markdown):
{"channel": "<uno dei canali disponibili>", "hours_delay": <int tra 0 e 168>, "reasoning": "<frase breve in italiano>"}

Regole:
- Touch #1: subito (delay 0), email se disponibile altrimenti whatsapp
- Touch #2: 48-72h dopo, canale DIVERSO dal precedente
- Touch #3: 96-120h, social DM se disponibile, altrimenti whatsapp
- Touch #4-5: 168h, ultimo tentativo
- Mai touch fuori orario lavorativo (gestito a valle)`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) throw new Error(`AI gateway ${r.status}`);
    const json = await r.json();
    const content = JSON.parse(json.choices[0].message.content);
    const ch = available.includes(content.channel) ? content.channel : available[0];
    return {
      channel: ch as Channel,
      reasoning: content.reasoning || "AI choice",
      hours_delay: Math.max(0, Math.min(168, parseInt(content.hours_delay) || 48)),
    };
  } catch (e) {
    console.warn("AI channel pick failed, fallback:", e);
    return { channel: available[0], reasoning: "Fallback dopo errore AI", hours_delay: history.length === 0 ? 0 : 48 };
  }
}

// ─────────── ADAPTIVE AI: persuasive copy per channel ───────────
async function generateCopy(lead: Lead, channel: Channel, touchNumber: number, previewUrl: string): Promise<{ subject: string; body: string; html?: string; persuasion_score: number }> {
  const businessName = lead.name;
  const sector = lead.sector || "la tua attività";
  const city = lead.city ? ` di ${lead.city}` : "";

  // Static fallback (always works, no AI needed)
  const fallback = {
    email: {
      subject: touchNumber === 1
        ? `${businessName}: ho creato qualcosa per voi 🎁`
        : touchNumber === 2
          ? `${businessName} – avete dato un'occhiata?`
          : `Ultima proposta per ${businessName}`,
      body: `Ciao ${businessName},\n\nSono Arianna di Empire AI Group. Ho preparato una preview gratuita di come potrebbe essere il vostro nuovo sito + sistema di prenotazioni online${city}.\n\nGuarda qui (30 secondi):\n${previewUrl}\n\nSe vi piace, possiamo attivarlo in 48h con prova gratuita di 90 giorni.\n\nUn saluto,\nArianna · Empire AI Group`,
    },
    whatsapp: {
      subject: "",
      body: touchNumber === 1
        ? `Ciao ${businessName} 👋\n\nSono Arianna di Empire AI Group. Ho fatto una preview del vostro nuovo sito + prenotazioni online (gratis):\n\n${previewUrl}\n\nDateci un'occhiata, dura 30 secondi 🙏`
        : `Ciao ${businessName}, vi avevo mandato la preview qualche giorno fa 👇\n${previewUrl}\n\nFatemi sapere se vi piace, posso attivarvi 90 giorni di prova gratuita 😊`,
    },
    instagram: {
      subject: "",
      body: `Ciao! Adoro il vostro profilo 🔥 Sono Arianna di Empire AI Group. Vi ho preparato una preview gratuita di un nuovo sito + sistema prenotazioni dedicato a ${sector}: ${previewUrl}\n\nFatemi sapere cosa ne pensate 💜`,
    },
    facebook: {
      subject: "",
      body: `Salve ${businessName}, sono Arianna di Empire AI Group. Ho creato una demo gratuita del vostro nuovo sito ${sector}${city}: ${previewUrl}\n\nDurata: 30 secondi. Se vi piace, attiviamo 90 giorni gratis 🎁`,
    },
  };

  if (!LOVABLE_API_KEY) {
    return { ...fallback[channel], persuasion_score: 70 };
  }

  try {
    const prompt = `Sei Arianna, copywriter B2B esperta in conversione per agenzie digitali italiane. Genera un messaggio PERSUASIVO ma NON SPAM per il canale ${channel.toUpperCase()}.

LEAD: ${businessName} (${sector}${city}), rating Google ${lead.google_rating ?? "n/d"}, ha sito: ${lead.website ? "sì" : "no"}
TOUCH NUMBER: ${touchNumber} di max 5
PREVIEW MOCKUP URL: ${previewUrl}

Regole canale:
${channel === "email" ? "- Email: max 80 parole. Subject < 50 caratteri, intrigante, NO emoji clickbait nel subject. CTA chiara: 'Guarda la preview'. Tono professionale-amichevole." : ""}
${channel === "whatsapp" ? "- WhatsApp: max 50 parole, tono casual italiano, 1-2 emoji max, link mockup obbligatorio. NO formattazione Markdown." : ""}
${channel === "instagram" ? "- IG DM: max 40 parole, tono giovane e diretto, complimento sincero al loro profilo, link al mockup. 1 emoji max." : ""}
${channel === "facebook" ? "- FB DM: max 50 parole, professionale ma calorosa, link mockup, accenno a prova gratuita." : ""}

ANTI-SPAM:
- Mai 'GRATIS' tutto maiuscolo, mai '!!!', mai 'OFFERTA LIMITATA'
- Se touch >= 3, riconosci il silenzio precedente con eleganza
- Mai promesse irrealistiche
- Sempre menziona il link mockup come valore concreto

Rispondi SOLO con JSON: {"subject": "...", "body": "...", "persuasion_score": <0-100>}
Per WhatsApp/IG/FB metti subject="".`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) throw new Error(`AI ${r.status}`);
    const json = await r.json();
    const content = JSON.parse(json.choices[0].message.content);

    let html: string | undefined;
    if (channel === "email") {
      html = `<!DOCTYPE html><html><body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;background:#f5f3ee;padding:20px;margin:0;">
<div style="max-width:560px;margin:0 auto;background:#ffffff;border-radius:16px;padding:32px;box-shadow:0 2px 8px rgba(0,0,0,0.04);">
<div style="font-size:15px;color:#0f0a1f;line-height:1.7;white-space:pre-wrap;">${content.body.replace(/</g, "&lt;").replace(new RegExp(previewUrl.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "g"), `<a href="${previewUrl}" style="color:#7c3aed;font-weight:600;text-decoration:none;border-bottom:2px solid #7c3aed;">${previewUrl}</a>`)}</div>
<div style="margin-top:32px;padding-top:20px;border-top:1px solid #e8e4dd;font-size:12px;color:#999;">Empire AI Group · <a href="mailto:unsubscribe@empireaigroup.com?subject=unsub" style="color:#999;">Annulla iscrizione</a></div>
</div></body></html>`;
    }

    return { subject: content.subject || "", body: content.body, html, persuasion_score: content.persuasion_score || 75 };
  } catch (e) {
    console.warn("AI copy failed, fallback:", e);
    return { ...fallback[channel], persuasion_score: 65 };
  }
}

// ─────────── DELIVERY ───────────
async function sendEmail(to: string, subject: string, text: string, html: string): Promise<{ ok: boolean; error?: string }> {
  if (!RESEND_API_KEY || !LOVABLE_API_KEY) return { ok: false, error: "missing_keys" };
  const r = await fetch("https://connector-gateway.lovable.dev/resend/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": RESEND_API_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: "Arianna <arianna@empireaigroup.com>",
      to: [to], subject, html, text,
      headers: {
        "List-Unsubscribe": `<mailto:unsubscribe@empireaigroup.com?subject=unsub-${encodeURIComponent(to)}>`,
        "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
      },
    }),
  });
  if (!r.ok) return { ok: false, error: await r.text() };
  return { ok: true };
}

async function sendWhatsApp(toPhone: string, body: string): Promise<{ ok: boolean; error?: string; manual_url?: string }> {
  // Always provide wa.me fallback for manual sending
  const cleaned = toPhone.replace(/[^0-9+]/g, "");
  const manual_url = `https://wa.me/${cleaned.replace(/^\+/, "")}?text=${encodeURIComponent(body)}`;

  if (!TWILIO_API_KEY || !LOVABLE_API_KEY) return { ok: true, manual_url };

  try {
    const r = await fetch("https://connector-gateway.lovable.dev/twilio/Messages.json", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "X-Connection-Api-Key": TWILIO_API_KEY, "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ To: `whatsapp:${cleaned}`, From: "whatsapp:+14155238886", Body: body }),
    });
    if (!r.ok) return { ok: true, manual_url, error: `twilio_failed_use_manual` };
    return { ok: true };
  } catch {
    return { ok: true, manual_url };
  }
}

function buildSocialDmLink(channel: "instagram" | "facebook", lead: Lead, body: string): string {
  if (channel === "instagram" && lead.instagram) {
    const handle = lead.instagram.replace(/^@/, "").replace(/^https?:\/\/(www\.)?instagram\.com\//, "").replace(/\/$/, "");
    return `https://ig.me/m/${handle}`;
  }
  // FB Messenger: requires page id; use generic search fallback
  if (channel === "facebook") {
    const q = encodeURIComponent(`${lead.name} ${lead.city || ""}`.trim());
    return `https://www.facebook.com/search/pages/?q=${q}`;
  }
  return "";
}

// ─────────── MAIN ───────────
Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);
    const body = await req.json().catch(() => ({}));
    const { action, lead_id, owner_id, dry_run } = body;

    // ─── ACTION: start sequence for a lead ───
    if (action === "start_sequence") {
      if (!lead_id || !owner_id) {
        return new Response(JSON.stringify({ error: "lead_id and owner_id required" }), {
          status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const { data: lead } = await supabase.from("leads").select("*").eq("id", lead_id).single();
      if (!lead) {
        return new Response(JSON.stringify({ error: "lead_not_found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      const { data: cfg } = await supabase.from("sales_agent_config").select("*").eq("user_id", owner_id).maybeSingle();
      const channels: Channel[] = [];
      if (cfg?.auto_send_email !== false) channels.push("email");
      if (cfg?.auto_send_whatsapp !== false) channels.push("whatsapp");
      if (cfg?.auto_send_instagram === true) channels.push("instagram");
      if (cfg?.auto_send_facebook === true) channels.push("facebook");

      const { data: seq, error: seqErr } = await supabase
        .from("lead_outreach_sequences")
        .upsert({
          owner_id, lead_id,
          status: "active",
          strategy: cfg?.outreach_strategy || "adaptive_ai",
          channels_priority: channels.length ? channels : ["email", "whatsapp"],
          max_touches: cfg?.max_touches_per_lead || 5,
          next_touch_at: new Date().toISOString(),
        }, { onConflict: "owner_id,lead_id" })
        .select()
        .single();

      if (seqErr) throw seqErr;

      // Immediately process first touch
      return await processSequenceTouch(supabase, seq, lead, dry_run);
    }

    // ─── ACTION: process due sequences (cron) ───
    if (action === "tick" || action === "process_due") {
      const { data: dueSeqs } = await supabase
        .from("lead_outreach_sequences")
        .select("*, leads(*)")
        .eq("status", "active")
        .lte("next_touch_at", new Date().toISOString())
        .limit(20);

      if (!dueSeqs?.length) {
        return new Response(JSON.stringify({ processed: 0 }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }

      let processed = 0;
      for (const s of dueSeqs) {
        if (!s.leads) continue;
        try {
          await processSequenceTouch(supabase, s as any, s.leads as Lead, false);
          processed++;
        } catch (e: any) {
          console.error(`Touch failed for seq ${s.id}:`, e);
          await logOutreachFailure(supabase, {
            channel: (s as any).next_touch_channel || "unknown",
            error_message: e?.message || String(e),
            owner_id: (s as any).owner_id,
            lead_id: (s as any).lead_id,
            sequence_id: (s as any).id,
            severity: "error",
            payload: { context: "tick_loop" },
          });
        }
      }
      return new Response(JSON.stringify({ processed }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ─── ACTION: unsubscribe ───
    if (action === "suppress") {
      const { identifier, channel = "all", reason = "manual" } = body;
      await supabase.from("outreach_suppression").upsert({
        owner_id, identifier, channel, reason,
      }, { onConflict: "owner_id,identifier,channel" });
      return new Response(JSON.stringify({ success: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    return new Response(JSON.stringify({ error: "unknown_action" }), {
      status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("multichannel-outreach error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

async function processSequenceTouch(supabase: any, seq: Sequence, lead: Lead, dryRun: boolean) {
  // Stop if maxed out
  if (seq.current_touch_number >= seq.max_touches) {
    await supabase.from("lead_outreach_sequences").update({
      status: "exhausted", next_touch_at: null,
    }).eq("id", seq.id);
    return new Response(JSON.stringify({ ok: false, reason: "exhausted" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Anti-spam: business hours
  if (!isBusinessHours()) {
    const next = new Date();
    next.setHours(next.getHours() + 12);
    await supabase.from("lead_outreach_sequences").update({
      next_touch_at: next.toISOString(),
      ai_reasoning: "Posticipato: fuori orario lavorativo",
    }).eq("id", seq.id);
    return new Response(JSON.stringify({ ok: false, reason: "outside_business_hours", rescheduled: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // History for adaptive AI
  const { data: history } = await supabase
    .from("lead_outreach_touches")
    .select("channel, status, persuasion_score, created_at")
    .eq("sequence_id", seq.id)
    .order("created_at", { ascending: true });

  // AI picks channel
  const pick = await pickNextChannelAI(lead, history || [], seq.channels_priority);

  // Recipient + suppression
  let recipient = "";
  if (pick.channel === "email") recipient = lead.email || "";
  else if (pick.channel === "whatsapp") recipient = lead.phone || "";
  else if (pick.channel === "instagram") recipient = lead.instagram || "";
  else if (pick.channel === "facebook") recipient = lead.name;

  if (!recipient) {
    await supabase.from("lead_outreach_sequences").update({
      status: "exhausted", ai_reasoning: `No contact for ${pick.channel}`,
    }).eq("id", seq.id);
    return new Response(JSON.stringify({ ok: false, reason: "no_contact" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (await checkSuppression(supabase, seq.owner_id, recipient, pick.channel)) {
    await supabase.from("lead_outreach_sequences").update({
      status: "unsubscribed", next_touch_at: null,
    }).eq("id", seq.id);
    return new Response(JSON.stringify({ ok: false, reason: "suppressed" }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // Generate copy
  const previewUrl = lead.demo_preview_url || `https://empireia.lovable.app/preview/${lead.id}`;
  const copy = await generateCopy(lead, pick.channel, seq.current_touch_number + 1, previewUrl);

  // DRY RUN
  if (dryRun) {
    return new Response(JSON.stringify({
      ok: true, dry_run: true, channel: pick.channel, subject: copy.subject, body: copy.body,
      preview_url: previewUrl, reasoning: pick.reasoning,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  // Send
  let result: { ok: boolean; error?: string; manual_url?: string; provider?: string; http_status?: number } = { ok: false };
  if (pick.channel === "email") {
    const r = await sendEmail(recipient, copy.subject, copy.body, copy.html || copy.body);
    result = { ...r, provider: "resend" };
  } else if (pick.channel === "whatsapp") {
    const r = await sendWhatsApp(recipient, copy.body);
    result = { ...r, provider: r.error?.includes("manual") ? "manual_link" : "twilio" };
  } else {
    // Social DM: produce manual link (no public API for DMs)
    const dmLink = buildSocialDmLink(pick.channel, lead, copy.body);
    result = { ok: true, manual_url: dmLink, provider: "manual_link" };
  }

  // Log touch
  const newTouchNumber = seq.current_touch_number + 1;
  const touchStatus = result.ok ? (result.manual_url ? "manual_link" : "sent") : "failed";
  const { data: touchRow } = await supabase.from("lead_outreach_touches").insert({
    sequence_id: seq.id,
    owner_id: seq.owner_id,
    lead_id: seq.lead_id,
    touch_number: newTouchNumber,
    channel: pick.channel,
    recipient,
    subject: copy.subject || null,
    body_text: copy.body,
    body_html: copy.html || null,
    preview_url: previewUrl,
    status: touchStatus,
    provider: result.provider,
    manual_dm_url: result.manual_url || null,
    ai_persuasion_score: copy.persuasion_score,
    sent_at: result.ok && !result.manual_url ? new Date().toISOString() : null,
    error_message: result.error || null,
    metadata: { reasoning: pick.reasoning, deploy_version: DEPLOY_VERSION },
  }).select("id").maybeSingle();

  // Centralized failure log (errors AND degraded "manual_link" fallback for twilio)
  if (!result.ok || (result.provider === "manual_link" && pick.channel === "whatsapp" && result.error)) {
    await logOutreachFailure(supabase, {
      channel: pick.channel,
      error_message: result.error || "send_failed",
      owner_id: seq.owner_id,
      lead_id: seq.lead_id,
      sequence_id: seq.id,
      touch_id: touchRow?.id ?? null,
      recipient,
      provider: result.provider,
      http_status: result.http_status ?? null,
      severity: result.ok ? "warning" : "error",
      payload: { touch_number: newTouchNumber, reasoning: pick.reasoning },
    });
  }

  // Update sequence + schedule next
  const nextDelay = pick.hours_delay > 0 ? pick.hours_delay : 48;
  const nextAt = new Date();
  nextAt.setHours(nextAt.getHours() + nextDelay);

  await supabase.from("lead_outreach_sequences").update({
    current_touch_number: newTouchNumber,
    last_touch_at: new Date().toISOString(),
    next_touch_at: newTouchNumber >= seq.max_touches ? null : nextAt.toISOString(),
    next_touch_channel: null,
    ai_reasoning: pick.reasoning,
    status: newTouchNumber >= seq.max_touches ? "exhausted" : "active",
  }).eq("id", seq.id);

  // Update lead last_contacted
  await supabase.from("leads").update({
    last_contacted_at: new Date().toISOString(),
    contact_stage: newTouchNumber === 1 ? "contattato" : "in_follow_up",
    channel_used: pick.channel,
  }).eq("id", seq.lead_id);

  return new Response(JSON.stringify({
    ok: result.ok,
    touch_number: newTouchNumber,
    channel: pick.channel,
    manual_url: result.manual_url,
    next_touch_at: nextAt.toISOString(),
    reasoning: pick.reasoning,
  }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
}

