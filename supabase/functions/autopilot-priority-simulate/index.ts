// ══════════════════════════════════════════════════════════════
// autopilot-priority-simulate — Dry-run del motore di priorità
// Calcola, sui lead disponibili dell'owner autenticato:
//   • candidati totali
//   • selezionati (quanti partirebbero davvero)
//   • scartati con motivo (sotto soglia, settore in pausa/escluso, cap, già attivi, ecc.)
//   • scoring trasparente per ogni lead (pesi pain/roi/sector/recency)
// NESSUNA scrittura: solo lettura + analisi.
// ══════════════════════════════════════════════════════════════
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

type PriorityRules = {
  pain_score_weight?: number;
  roi_potential_weight?: number;
  sector_match_weight?: number;
  recency_weight?: number;
  min_pain_score?: number;
  min_roi_eur_month?: number;
  preferred_sectors?: string[];
  excluded_sectors?: string[];
};

const norm = (s: unknown) => String(s ?? "").trim().toLowerCase();

function buildBlockedSet(
  paused: string[] | null | undefined,
  excluded: string[] | null | undefined,
): Set<string> {
  const set = new Set<string>();
  for (const s of paused || []) set.add(norm(s));
  for (const s of excluded || []) set.add(norm(s));
  set.delete("");
  return set;
}

function recencyBoost(createdAt: string | null): number {
  if (!createdAt) return 0;
  const ageDays = (Date.now() - new Date(createdAt).getTime()) / 86_400_000;
  if (ageDays <= 1) return 100;
  if (ageDays <= 3) return 80;
  if (ageDays <= 7) return 60;
  if (ageDays <= 14) return 40;
  if (ageDays <= 30) return 20;
  return 5;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const auth = req.headers.get("Authorization") || "";
    const token = auth.replace("Bearer ", "");
    if (!token) {
      return new Response(
        JSON.stringify({ success: false, error: "missing_auth" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const supa = createClient(SUPABASE_URL, SERVICE_KEY, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userErr } = await supa.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(
        JSON.stringify({ success: false, error: "unauthorized" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    const owner_id = userData.user.id;

    // Carica config
    const { data: cfg } = await supa
      .from("autopilot_config")
      .select("*")
      .eq("owner_id", owner_id)
      .maybeSingle();

    const rules: PriorityRules = (cfg?.priority_rules as any) || {};
    const wPain = rules.pain_score_weight ?? 40;
    const wRoi = rules.roi_potential_weight ?? 30;
    const wSector = rules.sector_match_weight ?? 20;
    const wRecency = rules.recency_weight ?? 10;
    const wTot = wPain + wRoi + wSector + wRecency || 1;
    const minPain = rules.min_pain_score ?? 0;
    const minRoi = rules.min_roi_eur_month ?? 0;
    const preferred = new Set((rules.preferred_sectors || []).map(norm));
    const blocked = buildBlockedSet(
      (cfg?.paused_sectors as any) || [],
      rules.excluded_sectors || [],
    );
    const maxNew = cfg?.max_new_conversations_per_run ?? 3;
    const maxConcurrent = cfg?.max_concurrent_conversations ?? 10;
    const cap = cfg?.daily_scan_cap ?? 100;
    const used = cfg?.daily_scans_used ?? 0;
    const remaining = Math.max(0, cap - used);

    // Conversazioni attive (per limite concorrenza)
    const { count: activeConvos } = await supa
      .from("autopilot_conversations")
      .select("id", { count: "exact", head: true })
      .eq("owner_id", owner_id)
      .eq("status", "active");

    const concurrencySlots = Math.max(0, maxConcurrent - (activeConvos ?? 0));

    // Carica fino a 200 lead recenti dell'owner
    const { data: leads, error: leadsErr } = await supa
      .from("leads")
      .select(
        "id, name, sector, city, ai_score, estimated_value, value, created_at, status, outcome, contact_stage, channels_available",
      )
      .eq("owner_id", owner_id)
      .in("outcome", ["in_progress", "paused"])
      .order("created_at", { ascending: false })
      .limit(200);

    if (leadsErr) throw leadsErr;

    // Lead già con conversazione attiva (esclusi dalla simulazione "nuovi")
    const { data: existingConvos } = await supa
      .from("autopilot_conversations")
      .select("lead_id")
      .eq("owner_id", owner_id)
      .eq("status", "active");
    const leadsWithConvo = new Set(
      (existingConvos || []).map((c: any) => c.lead_id).filter(Boolean),
    );

    // Pain scans recenti per owner (ultimi 60 gg) — hash per lead via name? non c'è link diretto ai lead
    // Uso il punteggio pain dal lead (ai_score come proxy) + estimated_value come ROI
    type Scored = {
      id: string;
      name: string;
      sector: string;
      city: string;
      pain_score: number;
      roi_eur: number;
      score: number;
      score_breakdown: { pain: number; roi: number; sector: number; recency: number };
      decision: "selected" | "skipped";
      reason?: string;
      reason_label?: string;
      already_in_conversation?: boolean;
    };

    const scored: Scored[] = (leads || []).map((l: any): Scored => {
      const sec = norm(l.sector);
      const pain = Math.max(0, Math.min(100, Number(l.ai_score ?? 0)));
      const roi = Math.max(0, Number(l.estimated_value ?? l.value ?? 0));

      // Componenti normalizzate 0..100
      const cPain = pain;
      const cRoi = Math.min(100, (roi / Math.max(minRoi || 1000, 1000)) * 100);
      const cSector = preferred.size === 0 ? 50 : preferred.has(sec) ? 100 : 20;
      const cRecency = recencyBoost(l.created_at);

      const score =
        (cPain * wPain + cRoi * wRoi + cSector * wSector + cRecency * wRecency) /
        wTot;

      // Decisioni di scarto
      let decision: "selected" | "skipped" = "selected";
      let reason: string | undefined;
      let reason_label: string | undefined;
      const inConvo = leadsWithConvo.has(l.id);

      if (sec && blocked.has(sec)) {
        decision = "skipped";
        reason = "sector_blocked";
        reason_label = `Settore bloccato (${l.sector})`;
      } else if (pain < minPain) {
        decision = "skipped";
        reason = "below_min_pain";
        reason_label = `Pain ${pain} < soglia ${minPain}`;
      } else if (minRoi > 0 && roi < minRoi) {
        decision = "skipped";
        reason = "below_min_roi";
        reason_label = `ROI €${roi.toFixed(0)} < soglia €${minRoi}`;
      } else if (inConvo) {
        decision = "skipped";
        reason = "already_in_conversation";
        reason_label = "Già in conversazione attiva";
      } else if (!l.channels_available || l.channels_available.length === 0) {
        decision = "skipped";
        reason = "no_channel";
        reason_label = "Nessun canale di contatto";
      }

      return {
        id: l.id,
        name: l.name,
        sector: l.sector || "—",
        city: l.city || "—",
        pain_score: pain,
        roi_eur: roi,
        score: Math.round(score * 10) / 10,
        score_breakdown: {
          pain: Math.round(cPain),
          roi: Math.round(cRoi),
          sector: Math.round(cSector),
          recency: Math.round(cRecency),
        },
        decision,
        reason,
        reason_label,
        already_in_conversation: inConvo,
      };
    });

    // Ordina per score desc i candidati selezionabili
    const eligible = scored
      .filter((s) => s.decision === "selected")
      .sort((a, b) => b.score - a.score);

    const skipped = scored.filter((s) => s.decision === "skipped");

    // Applica cap concorrenza + max_new + cap giornaliero
    const hardLimit = Math.min(maxNew, concurrencySlots, remaining);
    const wouldStart = eligible.slice(0, hardLimit).map((s) => ({ ...s }));
    const queuedOverflow = eligible.slice(hardLimit).map((s) => ({
      ...s,
      decision: "skipped" as const,
      reason: "limit_reached",
      reason_label: `Sopra limite (max ${hardLimit} per run)`,
    }));

    // Raggruppa scarti per motivo
    const allSkipped = [...skipped, ...queuedOverflow];
    const skipReasons: Record<string, number> = {};
    for (const s of allSkipped) {
      const k = s.reason || "unknown";
      skipReasons[k] = (skipReasons[k] || 0) + 1;
    }

    return new Response(
      JSON.stringify({
        success: true,
        snapshot_at: new Date().toISOString(),
        config_summary: {
          weights: { pain: wPain, roi: wRoi, sector: wSector, recency: wRecency },
          min_pain: minPain,
          min_roi_eur: minRoi,
          preferred_sectors: Array.from(preferred),
          blocked_sectors: Array.from(blocked),
          max_new_per_run: maxNew,
          max_concurrent: maxConcurrent,
          active_conversations: activeConvos ?? 0,
          concurrency_slots: concurrencySlots,
          daily_cap: cap,
          daily_used: used,
          daily_remaining: remaining,
          hard_limit_this_run: hardLimit,
        },
        totals: {
          candidates: leads?.length ?? 0,
          eligible: eligible.length,
          would_start: wouldStart.length,
          skipped: allSkipped.length,
        },
        skip_reasons: skipReasons,
        would_start: wouldStart,
        skipped: allSkipped
          .sort((a, b) => b.score - a.score)
          .slice(0, 50),
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("[autopilot-priority-simulate] fatal:", err);
    return new Response(
      JSON.stringify({ success: false, error: (err as Error).message }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }
});
