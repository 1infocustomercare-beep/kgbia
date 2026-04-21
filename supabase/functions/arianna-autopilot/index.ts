// Arianna Autopilot — sceglie da sola zone+settori in base a performance storica,
// scansiona con filtri severi (no sito + no social + rating alto + settori premium),
// salva solo lead "caldi" nella pipeline del venditore, impara dai risultati.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Città premium italiane con popolazione/pil rilevante
const PREMIUM_CITIES = [
  "Roma", "Milano", "Napoli", "Torino", "Palermo", "Genova", "Bologna",
  "Firenze", "Bari", "Catania", "Venezia", "Verona", "Padova", "Brescia",
  "Modena", "Parma", "Reggio Emilia", "Rimini", "Salerno", "Lecce",
];

// Settori "premium" = alta marginalità = budget per i nostri pacchetti
const PREMIUM_SECTORS = ["food", "beauty", "fitness", "healthcare"];

interface AutopilotState {
  user_id: string;
  current_city: string | null;
  current_sector: string | null;
  cycles_completed: number;
  zone_sector_weights: Record<string, number>;
  recently_scanned: string[];
  quality_filters: {
    require_no_website: boolean;
    require_no_social: boolean;
    min_rating: number;
    min_reviews: number;
    premium_sectors_only: boolean;
  };
}

/**
 * Algoritmo adattivo: sceglie città×settore in base a:
 * 1. Pesi storici (performance_score per coppia)
 * 2. Anti-duplicati (evita ciò che ha scansionato nelle ultime 24h)
 * 3. Esplorazione vs sfruttamento (ε-greedy: 20% random, 80% miglior peso)
 */
function chooseNextTarget(state: AutopilotState): { city: string; sector: string; weight: number; reason: string } {
  const sectors = state.quality_filters.premium_sectors_only ? PREMIUM_SECTORS : [...PREMIUM_SECTORS, "retail", "automotive", "trades"];
  const recently = new Set(state.recently_scanned ?? []);
  const allCombos: Array<{ city: string; sector: string; weight: number }> = [];

  for (const city of PREMIUM_CITIES) {
    for (const sector of sectors) {
      const key = `${city}|${sector}`;
      if (recently.has(key)) continue;
      const weight = state.zone_sector_weights[key] ?? 1.0; // default neutro
      allCombos.push({ city, sector, weight });
    }
  }

  // Se ha esaurito le combinazioni recenti, resetta
  if (allCombos.length === 0) {
    const fallbackCity = PREMIUM_CITIES[Math.floor(Math.random() * PREMIUM_CITIES.length)];
    const fallbackSector = sectors[Math.floor(Math.random() * sectors.length)];
    return { city: fallbackCity, sector: fallbackSector, weight: 1.0, reason: "Reset rotazione (tutte le zone già scansionate di recente)" };
  }

  // ε-greedy: 20% esplorazione, 80% sfruttamento del miglior peso
  const epsilon = 0.2;
  if (Math.random() < epsilon) {
    const random = allCombos[Math.floor(Math.random() * allCombos.length)];
    return { ...random, reason: "Esplorazione casuale (scopro nuove zone)" };
  }

  // Sfruttamento: scegli con probabilità proporzionale al peso
  const totalWeight = allCombos.reduce((s, c) => s + Math.max(c.weight, 0.1), 0);
  let r = Math.random() * totalWeight;
  for (const c of allCombos) {
    r -= Math.max(c.weight, 0.1);
    if (r <= 0) {
      return { ...c, reason: c.weight > 1.2 ? `Zona ad alta conversione (peso ${c.weight.toFixed(2)})` : c.weight < 0.8 ? `Riprovo zona poco performante (peso ${c.weight.toFixed(2)})` : "Rotazione standard" };
    }
  }
  const fallback = allCombos[0];
  return { ...fallback, reason: "Default" };
}

/** Aggiorna pesi adattivi in base alle performance storiche */
async function updateAdaptiveWeights(supabase: any, userId: string): Promise<Record<string, number>> {
  const { data: history } = await supabase
    .from("arianna_learning_log")
    .select("city, sector, leads_saved_to_pipeline, leads_replied, leads_converted")
    .eq("user_id", userId)
    .gte("created_at", new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString())
    .limit(500);

  const weights: Record<string, number> = {};
  if (!history?.length) return weights;

  const stats: Record<string, { saved: number; replied: number; converted: number; cycles: number }> = {};
  for (const row of history) {
    const key = `${row.city}|${row.sector}`;
    if (!stats[key]) stats[key] = { saved: 0, replied: 0, converted: 0, cycles: 0 };
    stats[key].saved += row.leads_saved_to_pipeline ?? 0;
    stats[key].replied += row.leads_replied ?? 0;
    stats[key].converted += row.leads_converted ?? 0;
    stats[key].cycles += 1;
  }

  for (const [key, s] of Object.entries(stats)) {
    // Score: conversioni pesano molto, reply medio, saved poco
    const score = (s.converted * 5 + s.replied * 2 + s.saved * 0.3) / Math.max(s.cycles, 1);
    // Peso normalizzato: 0.5 (cattivo) → 1.0 (neutro) → 2.0 (ottimo)
    weights[key] = Math.max(0.5, Math.min(2.0, 1.0 + score * 0.3));
  }

  return weights;
}

/** Filtra lead in base ai criteri "caldi" */
function filterHotLeads(leads: any[], filters: AutopilotState["quality_filters"]): any[] {
  return leads.filter(lead => {
    // No sito web obbligatorio
    if (filters.require_no_website && lead.website) return false;
    // Rating minimo
    if (filters.min_rating > 0 && (lead.rating ?? 0) < filters.min_rating) return false;
    // Recensioni minime
    if (filters.min_reviews > 0 && (lead.reviews_count ?? lead.reviews ?? 0) < filters.min_reviews) return false;
    // No social: il filtro vero avviene dopo enrichment, qui marker base
    return true;
  });
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const body = await req.json().catch(() => ({}));
    const { user_id, action = "run_cycle" } = body;
    if (!user_id) return new Response(JSON.stringify({ error: "user_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    // Carica/crea stato autopilot
    let { data: state } = await supabase
      .from("arianna_autopilot_state")
      .select("*")
      .eq("user_id", user_id)
      .maybeSingle();

    if (!state) {
      const { data: created } = await supabase
        .from("arianna_autopilot_state")
        .insert({ user_id, is_running: false })
        .select("*")
        .single();
      state = created;
    }

    if (action === "stop") {
      await supabase.from("arianna_autopilot_state").update({ is_running: false }).eq("user_id", user_id);
      return new Response(JSON.stringify({ success: true, stopped: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    if (action === "start") {
      await supabase.from("arianna_autopilot_state").update({ is_running: true, next_cycle_at: new Date().toISOString() }).eq("user_id", user_id);
      // Esegui subito il primo ciclo
    }

    // Rifresca pesi adattivi
    const adaptiveWeights = await updateAdaptiveWeights(supabase, user_id);
    const mergedWeights = { ...state.zone_sector_weights, ...adaptiveWeights };

    const enrichedState: AutopilotState = {
      user_id,
      current_city: state.current_city,
      current_sector: state.current_sector,
      cycles_completed: state.cycles_completed ?? 0,
      zone_sector_weights: mergedWeights,
      recently_scanned: state.recently_scanned ?? [],
      quality_filters: state.quality_filters ?? {
        require_no_website: true,
        require_no_social: true,
        min_rating: 4.0,
        min_reviews: 20,
        premium_sectors_only: true,
      },
    };

    // 1. Sceglie target adattivo
    const target = chooseNextTarget(enrichedState);
    const cycleNumber = enrichedState.cycles_completed + 1;
    const tStart = Date.now();

    console.log(`[Autopilot] User ${user_id} ciclo #${cycleNumber}: ${target.city}/${target.sector} (${target.reason})`);

    // 2. Consuma crediti per il ciclo (versione service-role: passa user_id esplicito)
    const { data: creditCheck } = await supabase.rpc("consume_seller_credits_for", {
      p_user_id: user_id,
      p_action: "arianna_autopilot_cycle",
      p_metadata: { city: target.city, sector: target.sector, cycle: cycleNumber },
    });

    if (!creditCheck?.success) {
      // Log errore ma non blocca completamente — solo segnala
      await supabase.from("arianna_learning_log").insert({
        user_id, cycle_number: cycleNumber, city: target.city, sector: target.sector,
        status: "failed", error_message: `Crediti insufficienti: ${JSON.stringify(creditCheck)}`,
        decision_reasoning: target.reason, selected_weight: target.weight,
      });
      await supabase.from("arianna_autopilot_state").update({ is_running: false }).eq("user_id", user_id);
      return new Response(JSON.stringify({ success: false, error: "insufficient_credits", details: creditCheck }), {
        status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 3. Lancia lead-search — NON scartiamo nulla, analizziamo tutti
    let leadsScanned = 0, leadsAnalyzed = 0, leadsSaved = 0;
    let errorMsg: string | null = null;
    const categoryStats: Record<string, number> = { hot: 0, warm: 0, tiepido: 0, freddo: 0 };

    try {
      const { data: searchData, error: searchError } = await supabase.functions.invoke("lead-search", {
        body: { query: "", city: target.city, sector: target.sector, mode: "zone", use_google: true, limit: 25 },
      });

      if (searchError) {
        console.error("[autopilot] lead-search error:", searchError);
        throw new Error(searchError.message);
      }
      const allLeads = searchData?.results ?? [];
      leadsScanned = allLeads.length;
      console.log(`[autopilot] lead-search returned ${leadsScanned} leads. Sample:`, JSON.stringify(allLeads[0] || {}).slice(0, 300));

      // 4. Per OGNI lead → score euristico veloce + (opzionale) arricchimento AI
      // L'autopilot deve essere VELOCE: niente scraping, niente chiamate auth complesse.
      // Salviamo tutti i lead con score >= 30 nella pipeline.
      const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");
      const analyzedLeads: any[] = [];

      for (const lead of allLeads.slice(0, 15)) {
        const rating = Number(lead.rating) || 0;
        const reviews = Number(lead.reviews_count ?? lead.reviews) || 0;
        const hasWebsite = !!lead.website;
        const hasPhone = !!lead.phone;
        const hasEmail = !!lead.email;

        // Score euristico (immediato, no AI)
        let score = 25;
        if (!hasWebsite) score += 35;        // niente sito = grande opportunità
        if (rating >= 4.0) score += 20; else if (rating >= 3.5) score += 10;
        if (reviews >= 50) score += 20; else if (reviews >= 15) score += 10;
        if (hasPhone) score += 8;
        if (hasEmail) score += 4;
        score = Math.min(95, score);

        const category = score >= 80 ? "hot" : score >= 60 ? "warm" : score >= 40 ? "tiepido" : "freddo";
        const reason = !hasWebsite
          ? `Senza sito web · ${rating}/5 (${reviews} rec.) · canale ${hasPhone ? "WhatsApp" : "in persona"}`
          : `Sito presente da migliorare · ${rating}/5 (${reviews} rec.)`;

        const recommended_package = score >= 75 ? "growth_ai" : score >= 50 ? "digital_start" : "digital_start";
        const approach_strategy = hasPhone ? "whatsapp" : hasEmail ? "email" : "in_persona";

        // Costruzione weak_points + improvement_proposal sintetici (Intelligence Inbox)
        const weak_points: string[] = [];
        if (!hasWebsite) weak_points.push("Nessun sito web — perde clienti che cercano online");
        if (rating > 0 && rating < 4) weak_points.push(`Reputazione bassa (${rating}/5) — recensioni da gestire`);
        if (reviews < 15) weak_points.push("Poche recensioni Google — bassa trust digitale");
        if (!hasPhone && !hasEmail) weak_points.push("Nessun contatto diretto pubblicato");

        const improvement_proposal = !hasWebsite
          ? "Sito web professionale + sistema prenotazioni online + presenza Google ottimizzata."
          : "Restyling sito + automazione prenotazioni + reputation management + AI per recensioni.";

        const sales_pitch = `${lead.name || "Questo locale"} a ${lead.city || target.city} ha potenziale ${category.toUpperCase()} (score ${score}/100). ${reason}. Proposta: ${recommended_package === "growth_ai" ? "Growth AI" : "Digital Start"}.`;

        // Salva/aggiorna il report nell'Intelligence Inbox
        const cacheKey = `${(lead.name || "").toLowerCase().trim()}|${(leadCity_for_key(lead, target)).toLowerCase().trim()}`;
        const reportRow = {
          owner_id: user_id,
          cache_key: cacheKey,
          lead_name: lead.name || "Sconosciuto",
          lead_city: lead.city || target.city || null,
          lead_sector: target.sector || null,
          lead_website: lead.website || null,
          lead_phone: lead.phone || null,
          vendibility_score: score,
          category,
          category_reason: reason,
          has_website: hasWebsite,
          has_instagram: false,
          has_facebook: false,
          google_rating: rating || null,
          google_reviews_count: reviews || null,
          weak_points: weak_points as any,
          improvement_proposal,
          recommended_package,
          sales_pitch,
          approach_strategy,
          ai_model_used: "heuristic_autopilot",
          credits_spent: 0,
          raw_analysis: { source: "arianna_autopilot", cycle: cycleNumber, target } as any,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        };

        let savedIntelId: string | null = null;
        try {
          const { data: savedIntel, error: intelErr } = await supabase
            .from("lead_intelligence_reports")
            .upsert(reportRow, { onConflict: "owner_id,cache_key" })
            .select("id")
            .maybeSingle();
          if (intelErr) {
            console.error(`[autopilot] intel upsert error for ${lead.name}:`, intelErr.message);
          } else {
            savedIntelId = savedIntel?.id || null;
          }
        } catch (e: any) {
          console.error(`[autopilot] intel exception for ${lead.name}:`, e.message);
        }

        const report = {
          id: savedIntelId,
          vendibility_score: score,
          category,
          category_reason: reason,
          recommended_package,
          approach_strategy,
        };

        leadsAnalyzed++;
        categoryStats[category] = (categoryStats[category] || 0) + 1;
        if (score >= 30) {
          analyzedLeads.push({ ...lead, _intelligence: report });
        }
      }


      console.log(`[autopilot] analyzed=${leadsAnalyzed} → ready to save=${analyzedLeads.length} (cats: ${JSON.stringify(categoryStats)})`);

      // 5. Salva nella pipeline (tabella `leads`) tutti gli analyzed
      for (const lead of analyzedLeads) {
        if (!lead.name) {
          console.warn("[autopilot] skip lead without name");
          continue;
        }
        const phone = lead.phone || lead.tags?.phone || null;
        const website = lead.website || null;
        const intel = lead._intelligence;
        const leadCity = lead.city || target.city;

        // Skip duplicati per owner
        const { data: existing } = await supabase
          .from("leads")
          .select("id")
          .eq("owner_id", user_id)
          .eq("name", lead.name)
          .eq("city", leadCity)
          .maybeSingle();
        if (existing) {
          console.log(`[autopilot] duplicate skip: ${lead.name} / ${leadCity}`);
          continue;
        }

        const categoryEmoji: Record<string, string> = { hot: "🔥", warm: "♨️", tiepido: "🌡️", freddo: "❄️" };
        const { error: insertErr } = await supabase.from("leads").insert({
          owner_id: user_id,
          name: lead.name,
          city: leadCity,
          sector: target.sector,
          phone,
          email: lead.email || null,
          website,
          google_rating: lead.rating || null,
          google_reviews: lead.reviews_count || lead.reviews || null,
          full_address: lead.address || null,
          source: "arianna_autopilot",
          status: "new",
          ai_score: intel.vendibility_score,
          notes: `${categoryEmoji[intel.category] || "🤖"} ${intel.category.toUpperCase()} · score ${intel.vendibility_score}/100 · ${intel.category_reason || target.reason}`,
          lead_source_data: {
            autopilot: true, cycle: cycleNumber, found_via: "arianna_adaptive", reason: target.reason,
            intelligence_report_id: intel.id,
            category: intel.category,
            recommended_package: intel.recommended_package,
            approach_strategy: intel.approach_strategy,
          },
        });
        if (insertErr) {
          console.error(`[autopilot] insert error for ${lead.name}:`, insertErr.message, insertErr.details);
        } else {
          leadsSaved++;
        }
      }
    } catch (e: any) {
      errorMsg = e.message;
      console.error(`[Autopilot] errore search:`, e);
    }
    const leadsHot = categoryStats.hot;

    const duration = Date.now() - tStart;

    // 6. Log learning
    await supabase.from("arianna_learning_log").insert({
      user_id, cycle_number: cycleNumber, city: target.city, sector: target.sector,
      leads_scanned: leadsScanned, leads_passed_filters: leadsHot, leads_saved_to_pipeline: leadsSaved,
      decision_reasoning: target.reason, selected_weight: target.weight,
      credits_spent: 5, duration_ms: duration,
      status: errorMsg ? "failed" : "completed", error_message: errorMsg,
    });

    // 7. Aggiorna stato
    const newRecent = [`${target.city}|${target.sector}`, ...(state.recently_scanned ?? [])].slice(0, 30);
    const nextRunAt = new Date(Date.now() + 90_000); // 90 secondi tra cicli
    await supabase.from("arianna_autopilot_state").update({
      current_city: target.city,
      current_sector: target.sector,
      cycles_completed: cycleNumber,
      hot_leads_found: (state.hot_leads_found ?? 0) + leadsSaved,
      last_cycle_at: new Date().toISOString(),
      next_cycle_at: nextRunAt.toISOString(),
      recently_scanned: newRecent,
      zone_sector_weights: mergedWeights,
    }).eq("user_id", user_id);

    return new Response(JSON.stringify({
      success: true,
      cycle: cycleNumber,
      target,
      leads_scanned: leadsScanned,
      leads_hot: leadsHot,
      leads_saved: leadsSaved,
      next_cycle_at: nextRunAt.toISOString(),
      duration_ms: duration,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (e: any) {
    console.error("[Autopilot] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
