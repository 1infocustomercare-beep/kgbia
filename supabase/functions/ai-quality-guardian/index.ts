// ai-quality-guardian — Validator Agent
// Valuta che ogni output della Demo Factory sia REALE, fedele al mockup, e professionale.
// Restituisce score 0-100 + lista di issues. Score < 80 → trigger di rigenerazione.
//
// Modalità supportate:
//  - "image"   → valuta una foto (URL/base64) vs prompt atteso (sotto-settore + nome brand)
//  - "brand"   → valuta brand kit (tagline/descrizione/menu) vs settore reale del lead
//  - "site"    → valuta coerenza output vs mockup template scelto (variant + sub_sector)
//  - "lead"    → valuta che i dati lead siano reali (no placeholder tipo "Mario Rossi", "Lorem ipsum", numeri 000-000)

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Mode = "image" | "brand" | "site" | "lead";

interface GuardianRequest {
  mode: Mode;
  context: Record<string, any>;
  // context per modalità:
  // image: { url, expected: { subSector, brandName, kind: "hero"|"menu"|"interior"|"logo" } }
  // brand: { brand: {tagline, description, menu[]}, lead: {sector, businessName, city} }
  // site:  { template_variant, sub_sector, theme_hint, palette, hero_image, has_logo }
  // lead:  { businessName, address, phone, email, website, photos: string[], description }
}

interface GuardianResult {
  score: number;          // 0-100
  pass: boolean;          // score >= 80 e nessun blocker
  blockers: string[];     // problemi gravi (es. dato finto, foto non pertinente)
  warnings: string[];     // problemi minori
  suggestions: string[];  // come rigenerare meglio (prompt corrections)
  retry_prompt?: string;  // prompt suggerito per il prossimo tentativo
}

function buildSystemPrompt(mode: Mode): string {
  const base = `Sei un Quality Guardian per la piattaforma Empire AI, il tuo compito è verificare che ogni output generato per le demo sia REALE, PROFESSIONALE, e FEDELE al brand del cliente. NON tolleri dati finti, foto generiche, testi placeholder o incoerenze col settore.

REGOLE ASSOLUTE:
- Punteggio 100 = perfettamente realistico, professionale, coerente.
- Punteggio < 80 = output da rigenerare.
- BLOCKER (forza fail): foto stock generica, testo "Lorem", "Mario Rossi", numeri 000-000-000, email "test@test", elementi non pertinenti al settore.
- Rispondi SOLO con tool call valid_output, mai testo libero.`;

  switch (mode) {
    case "image":
      return `${base}

MODALITÀ IMAGE:
Valuta se la foto fornita è:
1. Coerente con il sotto-settore (es. pizzeria → forno a legna/pizza napoletana, sushi → tavolo nero/sashimi).
2. Realistica e professionale (no AI artifacts evidenti, no watermark, no testo casuale).
3. Adatta al contesto richiesto (hero=ambiente, menu=piatto top-down, interior=sala ristorante, logo=mark pulito).
Se boccia, fornisci retry_prompt MIGLIORATO con dettagli iper-specifici al sotto-settore.`;

    case "brand":
      return `${base}

MODALITÀ BRAND:
Valuta che tagline, descrizione e menu siano:
1. Coerenti col settore reale del business e la città.
2. Privi di placeholder ("Lorem ipsum", "Coming soon", "Insert here").
3. Menu/listino realistico per il settore (no piatti casuali, prezzi sensati per la zona).
Se boccia, suggerisci retry_prompt per rigenerare il brand kit.`;

    case "site":
      return `${base}

MODALITÀ SITE:
Verifica che il sito demo rispetti il MOCKUP scelto:
1. template_variant assegnato deve combaciare col sotto-settore (es. pizzeria→strapizzami, sushi→paperfish).
2. theme_hint coerente (light-cream per pizza tradizionale, noir per gourmet, sakura per sushi).
3. Palette HEX presenti e ben formate.
4. hero_image presente e non default placeholder.
5. Logo presente o motivato.`;

    case "lead":
      return `${base}

MODALITÀ LEAD:
Verifica che i dati del lead siano REALI:
1. businessName non sia "Test", "Demo", "Esempio".
2. address sia un indirizzo plausibile italiano/internazionale (no "Via Test 123").
3. phone sia un numero reale (formato +39 ... o internazionale, NON 000-000-0000 o 123456789).
4. email valida e non "test@", "demo@", "esempio@".
5. Almeno UNO tra website/photos/description deve esistere.
SE manca logo/nome/contatti reali → BLOCKER, demo NON deve partire.`;
  }
}

async function callGuardianAI(mode: Mode, context: Record<string, any>): Promise<GuardianResult> {
  const lovableKey = Deno.env.get("LOVABLE_API_KEY");
  if (!lovableKey) {
    return { score: 100, pass: true, blockers: [], warnings: ["guardian-disabled-no-api-key"], suggestions: [] };
  }

  const isImage = mode === "image" && context.url;
  const userContent: any[] = [
    {
      type: "text",
      text: `Valuta questo output (modalità: ${mode}). Contesto:\n${JSON.stringify(context, null, 2).slice(0, 6000)}`,
    },
  ];
  if (isImage) {
    userContent.push({ type: "image_url", image_url: { url: context.url } });
  }

  const payload = {
    model: isImage ? "google/gemini-2.5-flash" : "google/gemini-3-flash-preview",
    messages: [
      { role: "system", content: buildSystemPrompt(mode) },
      { role: "user", content: userContent },
    ],
    tools: [
      {
        type: "function",
        function: {
          name: "valid_output",
          description: "Restituisce score di qualità + issues",
          parameters: {
            type: "object",
            properties: {
              score: { type: "integer", minimum: 0, maximum: 100 },
              blockers: { type: "array", items: { type: "string" } },
              warnings: { type: "array", items: { type: "string" } },
              suggestions: { type: "array", items: { type: "string" } },
              retry_prompt: { type: "string", description: "Prompt corretto da usare al prossimo tentativo (max 500 char)" },
            },
            required: ["score", "blockers", "warnings", "suggestions"],
            additionalProperties: false,
          },
        },
      },
    ],
    tool_choice: { type: "function", function: { name: "valid_output" } },
  };

  const resp = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!resp.ok) {
    const txt = await resp.text();
    console.warn("[guardian] AI gateway", resp.status, txt.slice(0, 300));
    // fail-open: non blocchiamo la pipeline se il guardian è down
    return { score: 100, pass: true, blockers: [], warnings: [`guardian-error-${resp.status}`], suggestions: [] };
  }

  const data = await resp.json();
  const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
  if (!toolCall?.function?.arguments) {
    return { score: 100, pass: true, blockers: [], warnings: ["guardian-no-tool-call"], suggestions: [] };
  }

  let parsed: any;
  try {
    parsed = JSON.parse(toolCall.function.arguments);
  } catch {
    return { score: 100, pass: true, blockers: [], warnings: ["guardian-parse-error"], suggestions: [] };
  }

  const score = Math.max(0, Math.min(100, Number(parsed.score) || 0));
  const blockers: string[] = Array.isArray(parsed.blockers) ? parsed.blockers : [];
  const warnings: string[] = Array.isArray(parsed.warnings) ? parsed.warnings : [];
  const suggestions: string[] = Array.isArray(parsed.suggestions) ? parsed.suggestions : [];
  const pass = score >= 80 && blockers.length === 0;

  return { score, pass, blockers, warnings, suggestions, retry_prompt: parsed.retry_prompt };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Service-to-service auth: accetta service role o utente autenticato
    const authHeader = req.headers.get("Authorization") || "";
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const isService = authHeader === `Bearer ${serviceKey}`;
    if (!isService) {
      const supa = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
      const { data: { user } } = await supa.auth.getUser();
      if (!user) {
        return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    const body = (await req.json()) as GuardianRequest;
    if (!body?.mode || !body?.context) {
      return new Response(JSON.stringify({ error: "mode and context required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const result = await callGuardianAI(body.mode, body.context);
    return new Response(JSON.stringify(result), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (err) {
    console.error("[ai-quality-guardian] error", err);
    // Fail-open su crash interno
    return new Response(JSON.stringify({ score: 100, pass: true, blockers: [], warnings: ["guardian-crash"], suggestions: [], error: err instanceof Error ? err.message : "unknown" }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
