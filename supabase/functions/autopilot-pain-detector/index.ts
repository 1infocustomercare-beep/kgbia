// ═══════════════════════════════════════════════════════════════
// EMPIRE AUTOPILOT — Pain Detector AI v1.0.1
// Scrape sito + Google profile, AI analysis, ROI calc, cache 30gg
// ═══════════════════════════════════════════════════════════════
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

function hashDomain(domain: string): string {
  // Simple deterministic hash
  let hash = 0;
  for (let i = 0; i < domain.length; i++) {
    hash = (hash << 5) - hash + domain.charCodeAt(i);
    hash |= 0;
  }
  return `d_${Math.abs(hash).toString(36)}_${domain.length}`;
}

function extractDomain(url: string): string {
  try {
    const u = new URL(url.startsWith("http") ? url : `https://${url}`);
    return u.hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

async function fetchSiteSnapshot(url: string): Promise<{
  html: string;
  title: string;
  description: string;
  hasWhatsApp: boolean;
  hasBookingForm: boolean;
  hasOnlineMenu: boolean;
  hasMobileViewport: boolean;
  hasSchemaMarkup: boolean;
  loadTimeMs: number;
}> {
  const start = Date.now();
  let html = "";
  try {
    const resp = await fetch(url.startsWith("http") ? url : `https://${url}`, {
      headers: { "User-Agent": "Mozilla/5.0 EmpireAutopilot/1.0" },
      signal: AbortSignal.timeout(12000),
    });
    html = await resp.text();
  } catch (e) {
    console.warn("Site fetch failed:", e);
  }
  const loadTimeMs = Date.now() - start;
  const lower = html.toLowerCase();
  const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
  const descMatch = html.match(
    /<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i,
  );
  return {
    html: html.slice(0, 50000),
    title: titleMatch?.[1]?.trim() ?? "",
    description: descMatch?.[1]?.trim() ?? "",
    hasWhatsApp: lower.includes("wa.me/") || lower.includes("whatsapp"),
    hasBookingForm:
      lower.includes("prenota") || lower.includes("book now") ||
      lower.includes('type="date"'),
    hasOnlineMenu: lower.includes("menu") &&
      (lower.includes("ordina") || lower.includes("order online")),
    hasMobileViewport: lower.includes('name="viewport"'),
    hasSchemaMarkup: lower.includes("application/ld+json"),
    loadTimeMs,
  };
}

async function callGeminiPro(
  systemPrompt: string,
  userPrompt: string,
): Promise<{ text: string; tokens: number }> {
  const resp = await fetch(
    "https://ai.gateway.lovable.dev/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-pro",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "report_pain_analysis",
            description: "Report business pain points and revenue loss estimate",
            parameters: {
              type: "object",
              properties: {
                pain_score: {
                  type: "integer",
                  description: "0-100. Higher = more critical issues",
                },
                pain_points: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      category: { type: "string" },
                      severity: {
                        type: "string",
                        enum: ["low", "medium", "high", "critical"],
                      },
                      title: { type: "string" },
                      description: { type: "string" },
                      monthly_impact_eur: { type: "number" },
                      empire_solution: { type: "string" },
                    },
                    required: [
                      "category",
                      "severity",
                      "title",
                      "description",
                      "monthly_impact_eur",
                      "empire_solution",
                    ],
                  },
                },
                competitive_signals: {
                  type: "object",
                  properties: {
                    estimated_traffic: { type: "string" },
                    online_presence_score: { type: "integer" },
                    differentiation: { type: "string" },
                  },
                },
                executive_summary: { type: "string" },
              },
              required: [
                "pain_score",
                "pain_points",
                "competitive_signals",
                "executive_summary",
              ],
            },
          },
        }],
        tool_choice: {
          type: "function",
          function: { name: "report_pain_analysis" },
        },
      }),
    },
  );

  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Gemini error ${resp.status}: ${txt.slice(0, 300)}`);
  }
  const data = await resp.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  const args = toolCall?.function?.arguments ?? "{}";
  const usage = data.usage?.total_tokens ?? 0;
  return { text: args, tokens: usage };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY non configurata");
    }

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const userClient = createClient(
      SUPABASE_URL,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData } = await userClient.auth.getUser();
    const user = userData?.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { url, lead_id, sector, force_refresh } = body;
    if (!url || typeof url !== "string") {
      return new Response(JSON.stringify({ error: "url required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const domain = extractDomain(url);
    const domain_hash = hashDomain(domain);

    // Cache check (skip if force_refresh)
    if (!force_refresh) {
      const { data: cached } = await supabase
        .rpc("get_pain_scan_cached", {
          _domain_hash: domain_hash,
          _owner_id: user.id,
        });
      if (cached && cached.length > 0) {
        return new Response(
          JSON.stringify({
            scan: cached[0],
            cached: true,
          }),
          {
            status: 200,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          },
        );
      }
    }

    // Daily cap check
    const { data: capOk } = await supabase
      .rpc("check_autopilot_daily_cap", { _owner_id: user.id });
    if (capOk === false) {
      return new Response(
        JSON.stringify({ error: "Cap giornaliero scansioni raggiunto" }),
        {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        },
      );
    }

    const t0 = Date.now();
    const snap = await fetchSiteSnapshot(url);

    const systemPrompt = `Sei Arianna, Senior Business Development Consultant Empire AI Group.
Analizzi siti di PMI italiane (settore: ${sector ?? "generico"}) per identificare PAIN POINTS concreti
che provocano perdite di fatturato mensili. Sei brutalmente onesta ma costruttiva.
Per ogni pain point stima un impatto economico mensile REALISTICO in EUR (non gonfiare).
Empire offre: sito Pro AI, WhatsApp Business AI, prenotazioni online, CRM, Voice Agent Arianna,
gestione recensioni, social automation, dashboard analytics.`;

    const userPrompt = `DOMINIO: ${domain}
TITOLO PAGINA: ${snap.title}
META DESCRIPTION: ${snap.description}
SETTORE: ${sector ?? "non specificato"}

SEGNALI TECNICI RILEVATI:
- WhatsApp click-to-chat: ${snap.hasWhatsApp ? "✅" : "❌"}
- Form prenotazione: ${snap.hasBookingForm ? "✅" : "❌"}
- Menu/ordini online: ${snap.hasOnlineMenu ? "✅" : "❌"}
- Mobile viewport: ${snap.hasMobileViewport ? "✅" : "❌"}
- Schema.org markup (SEO): ${snap.hasSchemaMarkup ? "✅" : "❌"}
- Tempo caricamento: ${snap.loadTimeMs}ms

HTML SAMPLE (primi 8000 char):
${snap.html.slice(0, 8000)}

ISTRUZIONI:
1. Identifica 4-7 pain points concreti
2. Stima monthly_impact_eur per ciascuno (somma plausibile, no fantascienza)
3. Per ogni pain proponi soluzione Empire specifica
4. Scrivi executive_summary di 2-3 righe convincenti per il partner che venderà al cliente.`;

    const { text: aiJson, tokens } = await callGeminiPro(
      systemPrompt,
      userPrompt,
    );
    const parsed = JSON.parse(aiJson);
    const duration_ms = Date.now() - t0;
    const cost_cents = Math.ceil(tokens * 0.0008); // ~$8/1M tokens Pro

    // Insert pain scan
    const { data: scan, error: insertError } = await supabase
      .from("pain_scans")
      .insert({
        owner_id: user.id,
        lead_id: lead_id ?? null,
        source_url: url,
        domain,
        domain_hash,
        sector: sector ?? null,
        pain_score: parsed.pain_score,
        pain_points: parsed.pain_points,
        technical_metrics: {
          hasWhatsApp: snap.hasWhatsApp,
          hasBookingForm: snap.hasBookingForm,
          hasOnlineMenu: snap.hasOnlineMenu,
          hasMobileViewport: snap.hasMobileViewport,
          hasSchemaMarkup: snap.hasSchemaMarkup,
          loadTimeMs: snap.loadTimeMs,
        },
        competitive_signals: parsed.competitive_signals,
        ai_summary: parsed.executive_summary,
        ai_model: "google/gemini-2.5-pro",
        cost_cents,
        duration_ms,
        status: "completed",
      })
      .select()
      .single();

    if (insertError) throw insertError;

    // Auto-build ROI calculation
    const monthly_loss_eur = (parsed.pain_points as any[]).reduce(
      (s, p) => s + (Number(p.monthly_impact_eur) || 0),
      0,
    );
    const empire_monthly_value = 149; // baseline plan
    const yearly_loss_eur = monthly_loss_eur * 12;
    const roi_percentage = empire_monthly_value > 0
      ? Math.round((monthly_loss_eur / empire_monthly_value) * 100)
      : 0;
    const payback_months = monthly_loss_eur > 0
      ? Number((empire_monthly_value / monthly_loss_eur).toFixed(2))
      : null;

    const { data: roi } = await supabase
      .from("roi_calculations")
      .insert({
        owner_id: user.id,
        lead_id: lead_id ?? null,
        pain_scan_id: scan.id,
        monthly_loss_eur,
        yearly_loss_eur,
        empire_monthly_value_eur: empire_monthly_value,
        roi_percentage,
        payback_months,
        scenario: "realistic",
        category_breakdown: (parsed.pain_points as any[]).reduce(
          (acc: Record<string, number>, p: any) => {
            acc[p.category] = (acc[p.category] || 0) +
              Number(p.monthly_impact_eur || 0);
            return acc;
          },
          {},
        ),
        assumptions: { source: "ai_estimate", confidence: 0.7 },
        ai_narrative: parsed.executive_summary,
      })
      .select()
      .single();

    // Increment scan counter
    await supabase.rpc("increment_autopilot_scan", { _owner_id: user.id });

    // Award XP for triggering scan
    await supabase.rpc("award_xp", {
      _user_id: user.id,
      _amount: 10,
      _reason: "pain_scan_run",
    });

    return new Response(
      JSON.stringify({ scan, roi, cached: false }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    console.error("autopilot-pain-detector error:", msg);

    // Enqueue retry on failure (best-effort, non-blocking)
    try {
      const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
      const authHeader = req.headers.get("Authorization");
      let ownerId: string | null = null;
      let payload: Record<string, unknown> = {};
      try {
        const userClient = createClient(
          SUPABASE_URL,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader || "" } } },
        );
        const { data: u } = await userClient.auth.getUser();
        ownerId = u?.user?.id ?? null;
      } catch (_) { /* ignore */ }
      try {
        payload = await req.clone().json();
      } catch (_) { /* ignore */ }

      if (ownerId) {
        await supabaseAdmin.rpc("enqueue_autopilot_retry", {
          p_owner_id: ownerId,
          p_step_type: "pain_scan",
          p_target_id: (payload as any)?.lead_id ?? null,
          p_target_table: "leads",
          p_payload: payload,
          p_error: msg,
          p_error_code: "pain_detector_failure",
          p_source: "autopilot-pain-detector",
          p_priority: 5,
          p_max_attempts: 5,
        });
      }
    } catch (enqueueErr) {
      console.error("[pain-detector] enqueue retry failed:", enqueueErr);
    }

    return new Response(JSON.stringify({ error: msg, retry_scheduled: true }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
