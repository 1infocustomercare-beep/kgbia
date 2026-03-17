import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

// Intent detection patterns — multi-sector
const INTENTS: Record<string, RegExp> = {
  ADD_ITEM: /aggiung(i|ere|iamo)\s+(piatt|prodott|servizi|voce|item|camera|veicol|cors|trattament)/i,
  UPDATE_PRICE: /(aggiorn|cambia|modifica|aumenta|diminuisci|abbassa|alza|metti|imposta)\s*(il\s+)?(prezz|cost|tariff|prezzo)/i,
  GENERATE_IMAGE: /(genera|crea|fai)\s+(foto|immagine|image)/i,
  MANAGE_BOOKING: /(prenota|riserva|booking|appuntament|conferma|annulla)\s/i,
  PANIC_MODE: /panic\s*mode|emergenz|chiudi\s*tutto/i,
  VIEW_STATS: /(stat|analisi|report|incass|fatturato|guadagn|revenue)/i,
  MENU_UPDATE: /(menu|carta|listino|catalogo|togli|rimuovi|disattiva|attiva)/i,
  MANAGE_STAFF: /(staff|dipendent|autista|driver|tecnico|operatore)/i,
  MANAGE_INTERVENTION: /(intervent|lavoro|riparazion|manutenzione|sopralluogo)/i,
  MANAGE_FLEET: /(veicol|auto|flotta|macchina|furgone|bus)/i,
  MANAGE_CLIENT: /(client|pazient|ospite|contatt)/i,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { tenant_id, message_text, conversation_id } = await req.json();

    if (!tenant_id || !message_text) {
      return new Response(
        JSON.stringify({ error: "tenant_id and message_text required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const lovableKey = Deno.env.get("LOVABLE_API_KEY");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // 1. Get tenant industry type
    let industry = "generic";
    const { data: company } = await supabase
      .from("companies")
      .select("industry, name")
      .eq("owner_id", tenant_id)
      .maybeSingle();

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("name")
      .eq("owner_id", tenant_id)
      .maybeSingle();

    if (company?.industry) {
      industry = company.industry;
    } else if (restaurant) {
      industry = "ristorazione";
    }

    const tenantName = company?.name || restaurant?.name || "Utente";

    // 2. Load sector prompt
    const { data: sectorPrompt } = await supabase
      .from("sector_system_prompts")
      .select("*")
      .eq("sector", industry)
      .eq("is_active", true)
      .maybeSingle();

    // 3. Load custom agent prompt if exists
    const { data: customPrompt } = await supabase
      .from("ai_agent_prompts")
      .select("*")
      .eq("tenant_id", tenant_id)
      .eq("industry_type", industry)
      .eq("is_active", true)
      .maybeSingle();

    // 4. Detect intent
    let detectedIntent = "GENERAL";
    for (const [intent, pattern] of Object.entries(INTENTS)) {
      if (pattern.test(message_text)) {
        detectedIntent = intent;
        break;
      }
    }

    // 5. Check capabilities
    const capabilities = customPrompt?.capabilities as string[] || 
      (sectorPrompt?.allowed_actions as string[]) || [];
    const blockedCaps = customPrompt?.blocked_capabilities as string[] || 
      (sectorPrompt?.blocked_actions as string[]) || [];

    if (blockedCaps.includes(detectedIntent)) {
      return new Response(
        JSON.stringify({
          reply: `⚠️ Questa funzionalità (${detectedIntent}) non è abilitata per il tuo account. Contatta il supporto Empire per attivarla.`,
          intent: detectedIntent,
          blocked: true,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 5b. Route actionable intents to Command Agent for direct DB execution
    const ACTIONABLE_INTENTS = ["ADD_ITEM", "UPDATE_PRICE", "MENU_UPDATE", "MANAGE_BOOKING", "PANIC_MODE", "MANAGE_STAFF", "MANAGE_INTERVENTION", "MANAGE_FLEET", "MANAGE_CLIENT"];
    if (ACTIONABLE_INTENTS.includes(detectedIntent)) {
      try {
        const cmdResp = await fetch(`${supabaseUrl}/functions/v1/ai-command-agent`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${supabaseKey}`,
          },
          body: JSON.stringify({
            tenant_id,
            command: message_text,
            source: conversation_id ? "whatsapp" : "chat",
          }),
        });

        const cmdData = await cmdResp.json();
        if (cmdResp.ok && cmdData.message_it) {
          return new Response(
            JSON.stringify({
              reply: cmdData.message_it,
              intent: detectedIntent,
              industry,
              tenant_name: tenantName,
              command_executed: true,
              actions: cmdData.actions_executed || [],
            }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
        // If command agent fails, fall through to AI chat
      } catch (cmdErr) {
        console.error("Command agent routing error:", cmdErr);
      }
    }

    // 6. Special handling for food items — ask allergens
    if (detectedIntent === "ADD_ITEM" && industry === "ristorazione") {
      const hasAllergenInfo = /allergen|glutin|lattosi|noce|crostac|uov|soia|pesce|arachid/i.test(message_text);
      if (!hasAllergenInfo) {
        return new Response(
          JSON.stringify({
            reply: "🍽️ Prima di pubblicare il nuovo piatto, indicami gli **allergeni** presenti (glutine, lattosio, frutta a guscio, crostacei, uova, soia, pesce, arachidi) oppure scrivi \"nessuno\" se il piatto è allergen-free.",
            intent: detectedIntent,
            awaiting_info: "allergens",
          }),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // 7. Build AI prompt
    const systemPrompt = customPrompt?.prompt_text || sectorPrompt?.system_prompt || 
      `Sei l'AI Manager di Empire per il settore ${industry}. Rispondi in italiano, sii conciso e professionale.`;

    const autonomyLevel = customPrompt?.autonomy_level || 8;

    const fullSystemPrompt = `${systemPrompt}

CONTESTO:
- Tenant: ${tenantName}
- Settore: ${industry}
- Intent rilevato: ${detectedIntent}
- Livello autonomia: ${autonomyLevel}/10
- Capabilities attive: ${capabilities.join(", ") || "tutte"}

ISTRUZIONI:
- Se autonomia >= 7, esegui le azioni direttamente e conferma.
- Se autonomia < 7, chiedi conferma prima di modificare dati.
- Rispondi sempre in italiano.
- Usa emoji appropriati per il settore.
- Sii conciso ma completo.`;

    // 8. Call AI
    if (!lovableKey) {
      return new Response(
        JSON.stringify({
          reply: `✅ Intent rilevato: **${detectedIntent}**\n\n📋 Il tuo messaggio è stato analizzato. Configurazione AI in corso...`,
          intent: detectedIntent,
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const aiResponse = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${lovableKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: fullSystemPrompt },
          { role: "user", content: message_text },
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit. Riprova tra qualche secondo." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (aiResponse.status === 402) {
        return new Response(
          JSON.stringify({ error: "Crediti AI esauriti. Ricarica il tuo workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errText = await aiResponse.text();
      console.error("AI Gateway error:", aiResponse.status, errText);
      throw new Error(`AI gateway error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const reply = aiData.choices?.[0]?.message?.content || "Non ho capito. Riformula la richiesta.";

    // 9. Log execution
    await supabase.from("ai_usage_logs").insert({
      agent_name: "whatsapp-orchestrator",
      company_id: company?.id || null,
      model_used: "gemini-3-flash-preview",
      status: "success",
      input_tokens: aiData.usage?.prompt_tokens || 0,
      output_tokens: aiData.usage?.completion_tokens || 0,
    }).then(() => {});

    return new Response(
      JSON.stringify({
        reply,
        intent: detectedIntent,
        industry,
        tenant_name: tenantName,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("ai-orchestrator error:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
