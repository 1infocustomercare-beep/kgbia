// Lead Enrichment PRO — arricchisce un lead con dati REALI da:
// - Yelp / TripAdvisor / Pagine Gialle (via Firecrawl scrape)
// - Instagram / Facebook lookup (Firecrawl search)
// - P.IVA lookup (registroimprese.it pubblico via Firecrawl)
// Cache 24h per evitare doppie scansioni dello stesso lead.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const FIRECRAWL_BASE = "https://api.firecrawl.dev/v2";

function normalizeKey(name: string, city: string | null | undefined): string {
  return `${name.toLowerCase().trim()}|${(city || "").toLowerCase().trim()}`.replace(/\s+/g, "-");
}

async function firecrawlSearch(apiKey: string, query: string, limit = 3): Promise<any[]> {
  try {
    const r = await fetch(`${FIRECRAWL_BASE}/search`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ query, limit, lang: "it", country: "it" }),
    });
    const data = await r.json();
    if (!r.ok) {
      console.warn("[enrichment] firecrawl search fail:", r.status, data);
      return [];
    }
    return data?.data?.web ?? data?.data ?? [];
  } catch (e) {
    console.warn("[enrichment] firecrawl search exception:", e);
    return [];
  }
}

async function firecrawlScrape(apiKey: string, url: string): Promise<any | null> {
  try {
    const r = await fetch(`${FIRECRAWL_BASE}/scrape`, {
      method: "POST",
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url, formats: ["markdown"], onlyMainContent: true }),
    });
    const data = await r.json();
    if (!r.ok) return null;
    return data?.data ?? data;
  } catch {
    return null;
  }
}

function extractRating(text: string): { rating: number | null; reviews: number | null } {
  if (!text) return { rating: null, reviews: null };
  // Pattern italiano/inglese: "4,5 / 5", "4.5 stars", "(123 recensioni)"
  const ratingMatch = text.match(/(\d[.,]\d)\s*(?:\/|su|stars?|stelle)/i);
  const reviewsMatch = text.match(/(\d{1,5})\s*(?:recensioni|reviews|review)/i);
  return {
    rating: ratingMatch ? parseFloat(ratingMatch[1].replace(",", ".")) : null,
    reviews: reviewsMatch ? parseInt(reviewsMatch[1], 10) : null,
  };
}

// ────────────────────────────────────────────────────────────────────────────
// Profile matching helpers — scartano URL "explore", tag, post, login, ecc.
// e preferiscono profili aziendali con username che assomiglia al brand.
// ────────────────────────────────────────────────────────────────────────────
function slugify(s: string): string {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // rimuove accenti
    .replace(/&/g, "e")
    .replace(/[^a-z0-9]+/g, "")
    .trim();
}

function tokenize(s: string): string[] {
  return (s || "")
    .toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !["the", "ristorante", "pizzeria", "bar", "hotel", "cafe", "caffe", "trattoria", "osteria", "srl", "snc", "spa", "and"].includes(t));
}

// Estrae lo "username" / slug dal path Instagram o Facebook
function extractHandle(url: string, platform: "instagram" | "facebook"): string | null {
  try {
    const u = new URL(url);
    if (platform === "instagram" && !u.hostname.includes("instagram.com")) return null;
    if (platform === "facebook" && !u.hostname.includes("facebook.com")) return null;
    const segments = u.pathname.split("/").filter(Boolean);
    if (!segments.length) return null;
    const first = segments[0].toLowerCase();
    // Facebook: a volte è "pages/Nome/12345" o "profile.php"
    if (platform === "facebook") {
      if (first === "pages" && segments[1]) return segments[1].toLowerCase();
      if (first === "profile.php") return null;
    }
    return first;
  } catch {
    return null;
  }
}

// Path/keyword da scartare (esplorazione, tag, post singoli, login, help, ecc.)
const IG_BLOCKED_PATHS = new Set([
  "explore", "p", "reel", "reels", "tv", "stories", "accounts", "directory",
  "about", "developer", "legal", "press", "api", "tags", "locations", "topics",
  "web", "challenge", "session", "login", "signup",
]);
const FB_BLOCKED_PATHS = new Set([
  "watch", "marketplace", "groups", "events", "gaming", "help", "policies",
  "login", "recover", "reg", "business", "ads", "search", "sharer", "dialog",
  "permalink.php", "story.php", "photo.php", "media", "hashtag",
]);

function scoreProfileMatch(handle: string, brandSlug: string, brandTokens: string[]): number {
  if (!handle) return 0;
  const h = handle.toLowerCase();
  let score = 0;
  if (h === brandSlug) score += 100;
  else if (brandSlug && (h.includes(brandSlug) || brandSlug.includes(h))) score += 60;
  for (const t of brandTokens) {
    if (h.includes(t)) score += 25;
  }
  // Penalità per handle troppo corti/generici
  if (h.length <= 2) score -= 50;
  // Bonus se contiene "official" o suffissi italiani comuni
  if (/official|ufficiale|roma|milano|napoli|torino|firenze|bologna/.test(h)) score += 5;
  return score;
}

function pickBestSocialResult(
  results: any[],
  platform: "instagram" | "facebook",
  brandName: string,
): { url: string; handle: string } | null {
  if (!results?.length) return null;
  const brandSlug = slugify(brandName);
  const brandTokens = tokenize(brandName);

  const candidates = results
    .map((r: any) => {
      const url: string = r?.url || "";
      if (!url) return null;
      let parsed: URL;
      try { parsed = new URL(url); } catch { return null; }
      const segments = parsed.pathname.split("/").filter(Boolean);
      if (!segments.length) return null;
      const first = segments[0].toLowerCase();

      if (platform === "instagram") {
        if (!parsed.hostname.includes("instagram.com")) return null;
        if (IG_BLOCKED_PATHS.has(first)) return null;
        // un profilo IG ha esattamente 1 segmento (username) o 2 con trailing
        if (segments.length > 2) return null;
      } else {
        if (!parsed.hostname.includes("facebook.com")) return null;
        if (FB_BLOCKED_PATHS.has(first)) return null;
        // accetta "/nome", "/nome/", "/pages/Nome/12345"
        if (first !== "pages" && segments.length > 2) return null;
      }

      const handle = extractHandle(url, platform);
      if (!handle) return null;
      const score = scoreProfileMatch(handle, brandSlug, brandTokens)
        + (r?.title?.toLowerCase().includes(brandName.toLowerCase()) ? 15 : 0);
      return { url, handle, score };
    })
    .filter(Boolean) as Array<{ url: string; handle: string; score: number }>;

  if (!candidates.length) return null;
  candidates.sort((a, b) => b.score - a.score);
  // Threshold minimo: handle deve avere QUALCHE attinenza col brand
  if (candidates[0].score < 25) return null;
  return { url: candidates[0].url, handle: candidates[0].handle };
}

// Yelp/TripAdvisor/PagineGialle: deve essere una scheda business, non lista/search/city
function pickBestListingResult(
  results: any[],
  platform: "yelp" | "tripadvisor" | "paginegialle",
  brandName: string,
): string | null {
  if (!results?.length) return null;
  const brandSlug = slugify(brandName);
  const brandTokens = tokenize(brandName);

  const ok = results
    .map((r: any) => {
      const url: string = r?.url || "";
      if (!url) return null;
      let u: URL;
      try { u = new URL(url); } catch { return null; }
      const path = u.pathname.toLowerCase();
      const title = (r?.title || "").toLowerCase();

      if (platform === "yelp") {
        // schede valide: /biz/<slug>; scarta /search, /c/, /collections
        if (!/^\/biz\//.test(path)) return null;
      } else if (platform === "tripadvisor") {
        // schede valide tipiche: /Restaurant_Review-, /Hotel_Review-, /Attraction_Review-
        if (!/_review-|_review_/i.test(path) && !/restaurant_review|hotel_review|attraction_review/i.test(path)) return null;
      } else if (platform === "paginegialle") {
        // schede aziendali: /<citta>/<categoria>/<nome>.html oppure /azienda/
        if (!/\.html?$/.test(path) && !/\/azienda\//.test(path)) return null;
        if (/\/categorie\//.test(path) || /\/cerca\b/.test(path)) return null;
      }

      let score = 0;
      const haystack = `${path} ${title}`;
      if (brandSlug && haystack.includes(brandSlug)) score += 60;
      for (const t of brandTokens) if (haystack.includes(t)) score += 20;
      return { url, score };
    })
    .filter(Boolean) as Array<{ url: string; score: number }>;

  if (!ok.length) return null;
  ok.sort((a, b) => b.score - a.score);
  if (ok[0].score < 20) return null;
  return ok[0].url;
}

function calcHotScore(data: any): number {
  let score = 50;
  // No website = +20 (lead caldo, ne ha bisogno)
  if (!data.has_website) score += 20;
  // No social = +15 (zero marketing digitale)
  if (!data.has_instagram && !data.has_facebook) score += 15;
  else if (!data.has_instagram || !data.has_facebook) score += 7;
  // Rating alto = +10
  if ((data.yelp_rating ?? 0) >= 4 || (data.tripadvisor_rating ?? 0) >= 4) score += 10;
  // Recensioni numerose = clientela attiva = +5
  if ((data.yelp_reviews ?? 0) + (data.tripadvisor_reviews ?? 0) >= 30) score += 5;
  return Math.min(100, Math.max(0, score));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

    const { lead, skip_credit_check = false } = await req.json();
    if (!lead?.name) {
      return new Response(JSON.stringify({ error: "lead.name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const cacheKey = normalizeKey(lead.name, lead.city);

    // 1. Check cache
    const { data: cached } = await supabase
      .from("lead_enrichment_cache")
      .select("*")
      .eq("cache_key", cacheKey)
      .gte("expires_at", new Date().toISOString())
      .maybeSingle();

    if (cached) {
      return new Response(JSON.stringify({ success: true, cached: true, enrichment: cached }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Consuma crediti se richiesto (skip se chiamato da autopilot che già consuma)
    if (!skip_credit_check) {
      const authHeader = req.headers.get("Authorization");
      if (authHeader) {
        const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
          global: { headers: { Authorization: authHeader } },
        });
        const { data: creditCheck } = await userClient.rpc("consume_seller_credits", {
          p_action: "lead_enrichment_pro",
          p_metadata: { lead_name: lead.name, city: lead.city },
        });
        if (!creditCheck?.success) {
          return new Response(JSON.stringify({ success: false, error: "insufficient_credits", details: creditCheck }), {
            status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      }
    }

    // 3. Esegui scraping in parallelo (se Firecrawl configurato)
    const enrichment: any = {
      cache_key: cacheKey,
      lead_name: lead.name,
      city: lead.city || null,
      has_website: !!lead.website,
      has_instagram: false,
      has_facebook: false,
      instagram_url: null,
      facebook_url: null,
      yelp_rating: null,
      yelp_reviews: null,
      tripadvisor_rating: null,
      tripadvisor_reviews: null,
      paginegialle_listing: false,
      piva: lead.piva || null,
      registro_imprese_status: null,
      raw_data: {},
    };

    if (FIRECRAWL_KEY) {
      const queryBase = `${lead.name} ${lead.city || ""}`.trim();
      const [igResults, fbResults, yelpResults, taResults, pgResults] = await Promise.all([
        firecrawlSearch(FIRECRAWL_KEY, `site:instagram.com "${lead.name}" ${lead.city || ""}`, 2),
        firecrawlSearch(FIRECRAWL_KEY, `site:facebook.com "${lead.name}" ${lead.city || ""}`, 2),
        firecrawlSearch(FIRECRAWL_KEY, `site:yelp.it ${queryBase}`, 1),
        firecrawlSearch(FIRECRAWL_KEY, `site:tripadvisor.it ${queryBase}`, 1),
        firecrawlSearch(FIRECRAWL_KEY, `site:paginegialle.it ${queryBase}`, 1),
      ]);

      // Instagram
      const igHit = igResults.find((r: any) => r.url?.includes("instagram.com") && !r.url.includes("/p/"));
      if (igHit) { enrichment.has_instagram = true; enrichment.instagram_url = igHit.url; }

      // Facebook
      const fbHit = fbResults.find((r: any) => r.url?.includes("facebook.com"));
      if (fbHit) { enrichment.has_facebook = true; enrichment.facebook_url = fbHit.url; }

      // Yelp scrape per rating
      if (yelpResults[0]?.url) {
        const yelpData = await firecrawlScrape(FIRECRAWL_KEY, yelpResults[0].url);
        if (yelpData?.markdown) {
          const { rating, reviews } = extractRating(yelpData.markdown.slice(0, 3000));
          enrichment.yelp_rating = rating;
          enrichment.yelp_reviews = reviews;
        }
      }

      // TripAdvisor scrape
      if (taResults[0]?.url) {
        const taData = await firecrawlScrape(FIRECRAWL_KEY, taResults[0].url);
        if (taData?.markdown) {
          const { rating, reviews } = extractRating(taData.markdown.slice(0, 3000));
          enrichment.tripadvisor_rating = rating;
          enrichment.tripadvisor_reviews = reviews;
        }
      }

      // Pagine Gialle = solo presenza
      enrichment.paginegialle_listing = pgResults.length > 0;

      enrichment.raw_data = {
        ig_count: igResults.length, fb_count: fbResults.length,
        yelp_url: yelpResults[0]?.url, ta_url: taResults[0]?.url,
        firecrawl_used: true,
      };
    } else {
      enrichment.raw_data = { firecrawl_used: false, reason: "FIRECRAWL_API_KEY non configurata" };
    }

    enrichment.hot_score = calcHotScore(enrichment);

    // 4. Salva in cache
    await supabase.from("lead_enrichment_cache").upsert(enrichment, { onConflict: "cache_key" });

    return new Response(JSON.stringify({ success: true, cached: false, enrichment }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[enrichment] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
