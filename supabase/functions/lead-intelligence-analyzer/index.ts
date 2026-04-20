// Lead Intelligence Analyzer — analizza OGNI lead in profondità (anche con sito/social)
// e genera: score 0-100, categoria (hot/warm/tiepido/freddo), punti deboli,
// proposta di miglioramento su misura, script di vendita, strategia di approccio.
// Cache 7 giorni. Costa 3 crediti.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";
const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

function normalizeKey(name: string, city: string | null | undefined): string {
  return `${(name || "").toLowerCase().trim()}|${(city || "").toLowerCase().trim()}`.replace(/\s+/g, "-");
}

async function firecrawlScrape(apiKey: string, url: string): Promise<any | null> {
  try {
    const r = await fetch(`${FIRECRAWL_BASE}/scrape`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, formats: ["markdown", "links"], onlyMainContent: true, waitFor: 2000 }),
    });
    if (!r.ok) return null;
    const data = await r.json();
    return data?.data ?? data;
  } catch { return null; }
}

async function firecrawlSearch(apiKey: string, query: string, limit = 2): Promise<any[]> {
  try {
    const r = await fetch(`${FIRECRAWL_BASE}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit, lang: "it", country: "it" }),
    });
    if (!r.ok) return [];
    const data = await r.json();
    return data?.data?.web ?? data?.data ?? [];
  } catch { return []; }
}

interface AnalysisInput {
  name: string;
  city?: string;
  sector?: string;
  website?: string;
  phone?: string;
  email?: string;
  rating?: number;
  reviews?: number;
  has_instagram?: boolean;
  has_facebook?: boolean;
  website_markdown?: string;
  website_links?: string[];
}

function categorize(score: number): { category: string; label: string } {
  if (score >= 80) return { category: "hot", label: "🔥 HOT — pronto da chiudere subito" };
  if (score >= 60) return { category: "warm", label: "♨️ WARM — bisogno chiaro, alta probabilità" };
  if (score >= 40) return { category: "tiepido", label: "🌡️ TIEPIDO — possibile, serve approccio mirato" };
  return { category: "freddo", label: "❄️ FREDDO — gestione già ottima, difficile vendere" };
}

async function aiAnalyze(input: AnalysisInput, lovableKey: string): Promise<any> {
  const systemPrompt = `Sei un Senior Sales Consultant di Empire (piattaforma SaaS italiana per business: ristoranti, beauty, fitness, healthcare, NCC, retail). 
Devi analizzare un lead e capire:
1. PUNTEGGIO DI VENDIBILITÀ (0-100): quanto è facile vendergli Empire
2. PUNTI DEBOLI CONCRETI: cosa manca o non funziona nel loro business digitale
3. PROPOSTA SU MISURA: cosa Empire può fare PER LORO (specifico, non generico)
4. PACCHETTO CONSIGLIATO: digital_start (€1.997), growth_ai (€4.997), empire_domination (€7.997)
5. SCRIPT VENDITA: 2-3 frasi pronte da dire al telefono/whatsapp che colpiscono il loro pain point
6. STRATEGIA APPROCCIO: cold_call, whatsapp, email, in_persona, instagram_dm

Regole:
- ANCHE chi ha sito + social può essere vendibile se sito è obsoleto, social fantasma, no prenotazione online, no menu QR, no chat, recensioni male gestite, ecc.
- Sii ONESTO sul punteggio: non gonfiare. Chi ha tutto perfetto = score basso (40-).
- Pitch SPECIFICO al business reale: cita il loro nome, settore, città, problemi reali.
- Output SOLO JSON valido, nessun markdown.`;

  const userPrompt = `Analizza questo lead:
NOME: ${input.name}
CITTÀ: ${input.city || "n/d"}
SETTORE: ${input.sector || "n/d"}
TELEFONO: ${input.phone || "n/d"}
SITO: ${input.website || "NESSUN SITO WEB"}
INSTAGRAM: ${input.has_instagram ? "SÌ" : "NO"}
FACEBOOK: ${input.has_facebook ? "SÌ" : "NO"}
GOOGLE RATING: ${input.rating ?? "n/d"} (${input.reviews ?? 0} recensioni)
${input.website_markdown ? `\nCONTENUTO SITO (estratto):\n${input.website_markdown.slice(0, 3000)}` : ""}
${input.website_links?.length ? `\nLINK INTERNI: ${input.website_links.slice(0, 20).join(", ")}` : ""}

Restituisci JSON con questa struttura ESATTA:
{
  "vendibility_score": 0-100,
  "category_reason": "perché questo punteggio (1 frase)",
  "website_quality_score": 0-100 o null,
  "website_issues": ["issue 1", "issue 2"],
  "missing_features": ["funzionalità mancante 1", "..."],
  "social_engagement_score": 0-100 o null,
  "social_issues": ["..."],
  "reputation_score": 0-100 o null,
  "reputation_issues": ["..."],
  "weak_points": ["punto debole concreto 1", "punto debole 2", "..."],
  "improvement_proposal": "Cosa Empire fa per loro (3-5 righe specifiche, mai generiche)",
  "recommended_package": "digital_start" | "growth_ai" | "empire_domination",
  "sales_pitch": "Script di 2-3 frasi pronto da dire (italiano colloquiale, colpisce pain point reale)",
  "approach_strategy": "cold_call" | "whatsapp" | "email" | "in_persona" | "instagram_dm"
}`;

  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
    }),
  });

  if (!r.ok) {
    const txt = await r.text();
    if (r.status === 429) throw new Error("rate_limited");
    if (r.status === 402) throw new Error("payment_required");
    throw new Error(`ai_gateway_error: ${r.status} ${txt}`);
  }

  const data = await r.json();
  const content = data?.choices?.[0]?.message?.content;
  if (!content) throw new Error("ai_empty_response");
  try {
    return JSON.parse(content);
  } catch {
    // fallback: estrai JSON da blocco
    const m = content.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");

    if (!LOVABLE_KEY) {
      return new Response(JSON.stringify({ error: "lovable_ai_not_configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

    // Auth — supporta sia chiamate utente (anon JWT) che service-role con impersonation header
    const authHeader = req.headers.get("Authorization");
    const impersonateUser = req.headers.get("x-impersonate-user");
    let userId: string | null = null;
    let userClient: any = null;
    const isServiceCall = authHeader?.includes(SERVICE_KEY);

    if (isServiceCall && impersonateUser) {
      // Chiamata da autopilot/orchestrator: usa service client e fidati dell'header impersonation
      userId = impersonateUser;
      userClient = adminClient;
    } else if (authHeader) {
      userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await userClient.auth.getUser();
      userId = u?.user?.id ?? null;
    }
    if (!userId) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const { lead, force_refresh = false, skip_credit_check = false } = body;
    if (!lead?.name) {
      return new Response(JSON.stringify({ error: "lead.name required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const cacheKey = normalizeKey(lead.name, lead.city);

    // Cache 7gg
    if (!force_refresh) {
      const { data: cached } = await adminClient
        .from("lead_intelligence_reports")
        .select("*")
        .eq("owner_id", userId)
        .eq("cache_key", cacheKey)
        .gte("expires_at", new Date().toISOString())
        .maybeSingle();
      if (cached) {
        return new Response(JSON.stringify({ success: true, cached: true, report: cached }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Crediti
    if (!skip_credit_check) {
      const { data: creditCheck } = await userClient.rpc("consume_seller_credits", {
        p_action: "lead_intelligence_analysis",
        p_metadata: { lead_name: lead.name, city: lead.city },
      });
      if (!creditCheck?.success) {
        return new Response(JSON.stringify({ success: false, error: "insufficient_credits", details: creditCheck }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // 1. Scrape sito (se presente)
    let websiteMarkdown: string | undefined;
    let websiteLinks: string[] | undefined;
    if (lead.website && FIRECRAWL_KEY) {
      const scrape = await firecrawlScrape(FIRECRAWL_KEY, lead.website);
      websiteMarkdown = scrape?.markdown;
      websiteLinks = scrape?.links;
    }

    // 2. Verifica social (lookup veloce)
    let hasInstagram = !!lead.has_instagram;
    let hasFacebook = !!lead.has_facebook;
    if (FIRECRAWL_KEY && !hasInstagram && !hasFacebook) {
      const [igR, fbR] = await Promise.all([
        firecrawlSearch(FIRECRAWL_KEY, `site:instagram.com "${lead.name}" ${lead.city || ""}`, 1),
        firecrawlSearch(FIRECRAWL_KEY, `site:facebook.com "${lead.name}" ${lead.city || ""}`, 1),
      ]);
      hasInstagram = igR.some((r: any) => r.url?.includes("instagram.com"));
      hasFacebook = fbR.some((r: any) => r.url?.includes("facebook.com"));
    }

    // 3. AI analyze
    const aiInput: AnalysisInput = {
      name: lead.name,
      city: lead.city,
      sector: lead.sector,
      website: lead.website,
      phone: lead.phone,
      email: lead.email,
      rating: lead.rating ?? lead.google_rating,
      reviews: lead.reviews ?? lead.google_reviews ?? lead.reviews_count,
      has_instagram: hasInstagram,
      has_facebook: hasFacebook,
      website_markdown: websiteMarkdown,
      website_links: websiteLinks,
    };

    let analysis: any;
    try {
      analysis = await aiAnalyze(aiInput, LOVABLE_KEY);
    } catch (e: any) {
      if (e.message === "rate_limited") {
        return new Response(JSON.stringify({ success: false, error: "ai_rate_limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (e.message === "payment_required") {
        return new Response(JSON.stringify({ success: false, error: "ai_payment_required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw e;
    }

    if (!analysis) {
      return new Response(JSON.stringify({ success: false, error: "ai_invalid_response" }), { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const score = Math.max(0, Math.min(100, Number(analysis.vendibility_score) || 50));
    const cat = categorize(score);

    const report = {
      owner_id: userId,
      cache_key: cacheKey,
      lead_name: lead.name,
      lead_city: lead.city || null,
      lead_sector: lead.sector || null,
      lead_website: lead.website || null,
      lead_phone: lead.phone || null,
      vendibility_score: score,
      category: cat.category,
      category_reason: analysis.category_reason || cat.label,
      has_website: !!lead.website,
      website_quality_score: analysis.website_quality_score ?? null,
      website_issues: analysis.website_issues ?? [],
      missing_features: analysis.missing_features ?? [],
      has_instagram: hasInstagram,
      has_facebook: hasFacebook,
      social_engagement_score: analysis.social_engagement_score ?? null,
      social_issues: analysis.social_issues ?? [],
      google_rating: aiInput.rating ?? null,
      google_reviews_count: aiInput.reviews ?? null,
      reputation_score: analysis.reputation_score ?? null,
      reputation_issues: analysis.reputation_issues ?? [],
      weak_points: analysis.weak_points ?? [],
      improvement_proposal: analysis.improvement_proposal || "",
      recommended_package: analysis.recommended_package || "growth_ai",
      sales_pitch: analysis.sales_pitch || "",
      approach_strategy: analysis.approach_strategy || "whatsapp",
      raw_analysis: { ai_raw: analysis, website_scraped: !!websiteMarkdown },
      ai_model_used: "google/gemini-2.5-flash",
      credits_spent: skip_credit_check ? 0 : 3,
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const { data: saved, error: saveErr } = await adminClient
      .from("lead_intelligence_reports")
      .upsert(report, { onConflict: "owner_id,cache_key" })
      .select()
      .single();

    if (saveErr) {
      console.error("[intelligence] save error:", saveErr);
    }

    return new Response(JSON.stringify({ success: true, cached: false, report: saved ?? report }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[intelligence] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
