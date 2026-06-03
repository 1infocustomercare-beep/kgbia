// Arianna Quality-Filter Auto-Tune
// Analizza le ultime conversioni del venditore + l'apprendimento di Arianna
// e ricalibra i filtri "lead caldo" (rating, recensioni, settori premium, ecc.)
// per massimizzare la conversione effettiva. Eseguito su richiesta del seller
// o via cron settimanale (process-arianna-tuning).
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface QualityFilters {
  require_no_website: boolean;
  require_no_social: boolean;
  min_rating: number;
  min_reviews: number;
  premium_sectors_only: boolean;
}

const DEFAULTS: QualityFilters = {
  require_no_website: true,
  require_no_social: true,
  min_rating: 4.0,
  min_reviews: 20,
  premium_sectors_only: true,
};

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

async function tuneForUser(supa: ReturnType<typeof createClient>, userId: string) {
  // 1) Stato corrente
  const { data: state } = await supa
    .from("arianna_autopilot_state")
    .select("*")
    .eq("user_id", userId)
    .maybeSingle();
  if (!state) return { skipped: "no_state" };
  if (state.auto_tune_enabled === false) return { skipped: "manual_override" };

  const current: QualityFilters = { ...DEFAULTS, ...(state.quality_filters || {}) };

  // 2) Leads recenti (60g) di proprietà del seller
  const since = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
  const { data: leads } = await supa
    .from("leads")
    .select("rating, reviews_count, has_website, social_links, sector, status, outcome, ai_score")
    .eq("owner_id", userId)
    .gte("created_at", since);

  if (!leads || leads.length < 10) {
    // Pochi dati: tieni i defaults
    return { skipped: "not_enough_data", count: leads?.length ?? 0 };
  }

  const won = leads.filter((l: any) => l.outcome === "won" || l.status === "won");
  const lost = leads.filter((l: any) => l.outcome === "lost" || l.status === "lost");

  // 3) Calcolo soglie ottimali dai won
  const tuned: QualityFilters = { ...current };

  if (won.length >= 5) {
    const ratings = won.map((l: any) => Number(l.rating ?? 0)).filter((r) => r > 0);
    const reviews = won.map((l: any) => Number(l.reviews_count ?? 0)).filter((r) => r > 0);
    const sectors = won.map((l: any) => l.sector).filter(Boolean);
    const woWebsite = won.filter((l: any) => !l.has_website).length / won.length;
    const woSocial = won.filter((l: any) => !l.social_links || Object.keys(l.social_links || {}).length === 0).length / won.length;

    if (ratings.length) {
      const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
      // Soglia = media won - 0.3, in [3.5, 4.7]
      tuned.min_rating = clamp(Number((avg - 0.3).toFixed(1)), 3.5, 4.7);
    }
    if (reviews.length) {
      reviews.sort((a, b) => a - b);
      const median = reviews[Math.floor(reviews.length / 2)];
      // Soglia = mediana won × 0.7, in [10, 80]
      tuned.min_reviews = clamp(Math.round(median * 0.7), 10, 80);
    }
    // Se >70% dei won non avevano sito → tieni il filtro, altrimenti rilassa
    tuned.require_no_website = woWebsite >= 0.6;
    tuned.require_no_social = woSocial >= 0.6;

    // Premium sectors: top 4 settori vincenti
    if (sectors.length) {
      const counts = new Map<string, number>();
      sectors.forEach((s) => counts.set(s, (counts.get(s) || 0) + 1));
      const top = [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 4).map(([s]) => s);
      tuned.premium_sectors = top as any;
      tuned.premium_sectors_only = top.length >= 2;
    }
  } else if (lost.length > won.length * 3 && lost.length >= 10) {
    // Molti lost, pochi won → stringi i criteri
    tuned.min_rating = clamp(current.min_rating + 0.2, 3.5, 4.7);
    tuned.min_reviews = clamp(current.min_reviews + 10, 10, 80);
  }

  // 4) Append history
  const history = Array.isArray(state.tuning_history) ? state.tuning_history : [];
  history.push({
    at: new Date().toISOString(),
    before: current,
    after: tuned,
    sample: { won: won.length, lost: lost.length, total: leads.length },
  });
  // Tieni solo ultime 20
  const trimmed = history.slice(-20);

  await supa
    .from("arianna_autopilot_state")
    .update({
      quality_filters: tuned,
      last_tuned_at: new Date().toISOString(),
      tuning_history: trimmed,
    })
    .eq("user_id", userId);

  return { tuned, before: current, sample: { won: won.length, lost: lost.length, total: leads.length } };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const supa = createClient(SUPABASE_URL, SERVICE_ROLE);
    const body = await req.json().catch(() => ({}));

    // ─── AUTH GUARD ───
    const authHeader = req.headers.get("Authorization") || "";
    const isServiceCall = !!SERVICE_ROLE && authHeader.includes(SERVICE_ROLE);

    if (!isServiceCall) {
      // Per-user path: require JWT and enforce user.id === body.user_id
      if (!authHeader) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
        global: { headers: { Authorization: authHeader } },
      });
      const { data: userData } = await userClient.auth.getUser();
      const callerId = userData?.user?.id;
      if (!callerId) {
        return new Response(JSON.stringify({ error: "Unauthorized" }), {
          status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      // Batch mode only allowed for service-role
      if (!body.user_id) {
        return new Response(JSON.stringify({ error: "Forbidden: batch mode requires service role" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (body.user_id !== callerId) {
        return new Response(JSON.stringify({ error: "Forbidden: user_id mismatch" }), {
          status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    if (body.user_id) {
      const result = await tuneForUser(supa, body.user_id);
      return new Response(JSON.stringify({ success: true, ...result }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }


    // Batch: tutti gli auto_tune attivi
    const { data: rows } = await supa
      .from("arianna_autopilot_state")
      .select("user_id")
      .eq("auto_tune_enabled", true);

    const results: any[] = [];
    for (const r of rows || []) {
      try {
        results.push({ user_id: r.user_id, ...(await tuneForUser(supa, r.user_id)) });
      } catch (e) {
        results.push({ user_id: r.user_id, error: e instanceof Error ? e.message : "unknown" });
      }
    }
    return new Response(JSON.stringify({ success: true, processed: results.length, results }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("arianna-tune-quality-filters error", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "unknown" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
