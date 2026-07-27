import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { safeFetch } from "../_shared/ssrf-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══ Extract Instagram handles from HTML ═══ */
function extractInstagramHandles(html: string): string[] {
  const handles = new Set<string>();
  const blocked = ["p", "reel", "reels", "explore", "stories", "accounts", "about", "legal", "developer", "directory", "tv", "tags"];
  
  const igLinkRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]{1,30})\/?/gi;
  let match;
  while ((match = igLinkRegex.exec(html)) !== null) {
    const handle = match[1].toLowerCase();
    if (!blocked.includes(handle)) handles.add(handle);
  }
  
  const contextRegex = /instagram[^<]*?@([a-zA-Z0-9_.]{3,30})/gi;
  while ((match = contextRegex.exec(html)) !== null) handles.add(match[1].toLowerCase());

  const hrefRegex = /href=["'](?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]{1,30})\/?["']/gi;
  while ((match = hrefRegex.exec(html)) !== null) {
    const handle = match[1].toLowerCase();
    if (!blocked.includes(handle)) handles.add(handle);
  }
  
  return [...handles];
}

/* ═══ Extract Facebook pages ═══ */
function extractFacebookPages(html: string): string[] {
  const pages = new Set<string>();
  const blocked = ["sharer", "share", "dialog", "login", "help", "groups", "events", "marketplace", "watch", "gaming", "pages", "profile.php"];
  const fbRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_./-]{1,60})\/?/gi;
  let match;
  while ((match = fbRegex.exec(html)) !== null) {
    const page = match[1].toLowerCase().split("/")[0];
    if (!blocked.includes(page)) pages.add(page);
  }
  return [...pages];
}

/* ═══ Extract emails ═══ */
function extractEmails(html: string): string[] {
  const emails = new Set<string>();
  const blocked = ["example.com", "sentry", "wixpress", "wordpress", "schema.org", "json-ld"];
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  let match;
  while ((match = emailRegex.exec(html)) !== null) {
    const email = match[1].toLowerCase();
    if (!blocked.some(b => email.includes(b))) emails.add(email);
  }
  return [...emails];
}

/* ═══ Extract phones ═══ */
function extractPhones(html: string): string[] {
  const phones = new Set<string>();
  const phoneRegex = /(?:tel:|href=["']tel:)?(\+?39[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/g;
  let match;
  while ((match = phoneRegex.exec(html)) !== null) {
    const phone = match[1].replace(/[\s.-]/g, "");
    if (phone.length >= 9 && phone.length <= 15) phones.add(phone);
  }
  const intlRegex = /(\+\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/g;
  while ((match = intlRegex.exec(html)) !== null) {
    const phone = match[1].replace(/[\s.-]/g, "");
    if (phone.length >= 10 && phone.length <= 15) phones.add(phone);
  }
  return [...phones];
}

/* ═══ Scrape Instagram public profile for bio data ═══ */
async function scrapeInstagramProfile(handle: string): Promise<{
  bio: string | null;
  website: string | null;
  followers: number | null;
  full_name: string | null;
  is_business: boolean;
  phone_from_bio: string | null;
  email_from_bio: string | null;
} | null> {
  try {
    // Try fetching the public profile page
    const resp = await fetch(`https://www.instagram.com/${handle}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(8000),
    });
    if (!resp.ok) return null;
    const html = await resp.text();

    // Extract from meta tags and JSON-LD
    const result: any = {
      bio: null, website: null, followers: null,
      full_name: null, is_business: false,
      phone_from_bio: null, email_from_bio: null,
    };

    // Meta description often contains follower count and bio
    const metaDesc = html.match(/<meta\s+(?:property="og:description"|name="description")\s+content="([^"]+)"/i);
    if (metaDesc) {
      const desc = metaDesc[1];
      result.bio = desc;
      // Extract follower count from "123K Followers"
      const followerMatch = desc.match(/([\d,.]+[KkMm]?)\s*Follower/i);
      if (followerMatch) {
        let num = followerMatch[1].replace(",", "");
        if (num.match(/[Kk]$/)) result.followers = Math.round(parseFloat(num) * 1000);
        else if (num.match(/[Mm]$/)) result.followers = Math.round(parseFloat(num) * 1000000);
        else result.followers = parseInt(num);
      }
    }

    // Meta title often has full name
    const metaTitle = html.match(/<meta\s+property="og:title"\s+content="([^"]+)"/i);
    if (metaTitle) {
      const title = metaTitle[1];
      const nameMatch = title.match(/^(.+?)\s*[\(•@]/);
      if (nameMatch) result.full_name = nameMatch[1].trim();
    }

    // Try to find shared_data JSON for richer info
    const sharedData = html.match(/window\._sharedData\s*=\s*(\{.+?\});<\/script>/);
    if (sharedData) {
      try {
        const parsed = JSON.parse(sharedData[1]);
        const user = parsed?.entry_data?.ProfilePage?.[0]?.graphql?.user;
        if (user) {
          result.bio = user.biography || result.bio;
          result.full_name = user.full_name || result.full_name;
          result.website = user.external_url || null;
          result.followers = user.edge_followed_by?.count || result.followers;
          result.is_business = user.is_business_account || false;
        }
      } catch { /* ignore parse errors */ }
    }

    // Extract phone/email from bio text
    if (result.bio) {
      const bioEmails = extractEmails(result.bio);
      if (bioEmails.length > 0) result.email_from_bio = bioEmails[0];
      const bioPhones = extractPhones(result.bio);
      if (bioPhones.length > 0) result.phone_from_bio = bioPhones[0];
    }

    // Check for business indicators in page source
    if (html.includes("is_business_account") || html.includes("business_category") || html.includes("contact_phone_number")) {
      result.is_business = true;
    }

    return result;
  } catch (e) {
    console.log("Instagram scrape failed for", handle, e);
    return null;
  }
}

/* ═══ BATCH: AI-powered Instagram discovery for multiple businesses ═══ */
async function batchDiscoverInstagram(businesses: { name: string; city: string; sector: string }[]): Promise<Record<string, string>> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  if (!LOVABLE_API_KEY || businesses.length === 0) return {};

  const list = businesses.slice(0, 15).map((b, i) => `${i + 1}. "${b.name}" — ${b.city} (${b.sector})`).join("\n");

  const prompt = `Trova gli username Instagram REALI e VERIFICATI per queste attività commerciali italiane:

${list}

REGOLE CRITICHE:
- Rispondi SOLO in formato JSON: {"1":"username","2":"username",...}
- Se NON sei SICURO al 100% di un username, usa "UNKNOWN"
- NON inventare MAI username — solo quelli che conosci con certezza assoluta
- Gli username devono essere profili business REALI e ATTIVI
- Senza @ davanti, tutto lowercase
- Esempio: {"1":"pizzeriadamario","2":"UNKNOWN","3":"salonebellezza_roma"}`;

  try {
    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        max_tokens: 500,
      }),
    });

    if (!resp.ok) return {};
    const data = await resp.json();
    const content = (data.choices?.[0]?.message?.content || "").trim();
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[^}]+\}/);
    if (!jsonMatch) return {};
    
    const parsed = JSON.parse(jsonMatch[0]);
    const result: Record<string, string> = {};
    
    for (const [idx, handle] of Object.entries(parsed)) {
      const h = (handle as string).toLowerCase().replace("@", "").trim();
      if (h && h !== "unknown" && h.length >= 3 && h.length <= 30 && /^[a-z0-9_.]+$/.test(h)) {
        const biz = businesses[parseInt(idx) - 1];
        if (biz) result[biz.name] = h;
      }
    }
    return result;
  } catch (e) {
    console.log("Batch IG discovery failed:", e);
    return {};
  }
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ── Auth guard ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    const _authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, { global: { headers: { Authorization: authHeader } } });
    const { data: { user: _authUser }, error: _authErr } = await _authClient.auth.getUser();
    if (_authErr || !_authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    
    // ═══ MODE 1: Batch discovery for multiple leads ═══
    if (body.batch && Array.isArray(body.businesses)) {
      const igMap = await batchDiscoverInstagram(body.businesses);
      
      // For each discovered handle, try to scrape profile data
      const enriched: Record<string, any> = {};
      const scrapePromises = Object.entries(igMap).map(async ([name, handle]) => {
        const profile = await scrapeInstagramProfile(handle);
        enriched[name] = {
          instagram: handle,
          profile: profile || {},
          source: "ai_batch_discovery",
        };
      });
      await Promise.all(scrapePromises);
      
      return new Response(JSON.stringify({ success: true, results: enriched, discovered: Object.keys(igMap).length }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ═══ MODE 2: Single lead enrichment ═══
    const { website, name, city } = body;
    
    if (!website && !name) {
      return new Response(JSON.stringify({ success: false, error: "Website or name required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const result: {
      instagram: string | null;
      facebook: string | null;
      email: string | null;
      phone: string | null;
      all_instagrams: string[];
      ig_profile: any | null;
      source: string;
    } = {
      instagram: null, facebook: null, email: null, phone: null,
      all_instagrams: [], ig_profile: null, source: "none",
    };

    // Strategy 1: Scrape the business website
    if (website) {
      const url = website.startsWith("http") ? website : `https://${website}`;
      try {
        const resp = await safeFetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; EmpireAI-Bot/1.0; +https://empireaigroup.com)",
            "Accept": "text/html",
          },
        }, { timeoutMs: 8000, maxBytes: 2_000_000 });
        if (resp.ok) {
          const html = await resp.text();
          const igHandles = extractInstagramHandles(html);
          if (igHandles.length > 0) {
            result.instagram = igHandles[0];
            result.all_instagrams = igHandles;
            result.source = "website_scrape";
          }
          const fbPages = extractFacebookPages(html);
          if (fbPages.length > 0) result.facebook = fbPages[0];
          const emails = extractEmails(html);
          if (emails.length > 0) result.email = emails[0];
          const phones = extractPhones(html);
          if (phones.length > 0) result.phone = phones[0];
        }
      } catch (e) { console.log("Website scrape failed:", e); }
    }

    // Strategy 2: AI inference for Instagram handle
    if (!result.instagram && name) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (LOVABLE_API_KEY) {
        try {
          const prompt = `Trova l'username Instagram ESATTO e REALE dell'attività "${name}"${city ? ` a ${city}` : ""}.

REGOLE CRITICHE:
- Rispondi SOLO con l'username Instagram (senza @), niente altro
- Se non sei SICURO al 100% dell'username, rispondi con "UNKNOWN"
- NON inventare username — solo quelli che conosci con certezza
- L'username deve essere un profilo business reale e attivo
- Esempio di risposta corretta: "pizzeriadamario" o "UNKNOWN"

Username Instagram:`;

          const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${LOVABLE_API_KEY}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: "google/gemini-2.5-flash",
              messages: [{ role: "user", content: prompt }],
              temperature: 0.1,
              max_tokens: 50,
            }),
          });

          if (aiResp.ok) {
            const aiData = await aiResp.json();
            const answer = (aiData.choices?.[0]?.message?.content || "").trim().replace("@", "").toLowerCase();
            if (answer && answer !== "unknown" && answer.length >= 3 && answer.length <= 30 && /^[a-z0-9_.]+$/.test(answer)) {
              result.instagram = answer;
              result.all_instagrams = [answer, ...result.all_instagrams];
              result.source = result.source === "website_scrape" ? "website_scrape" : "ai_inference";
            }
          }
        } catch (e) { console.log("AI Instagram lookup failed:", e); }
      }
    }

    // Strategy 3: Scrape Instagram profile for additional data
    if (result.instagram) {
      const profile = await scrapeInstagramProfile(result.instagram);
      if (profile) {
        result.ig_profile = profile;
        if (profile.email_from_bio && !result.email) result.email = profile.email_from_bio;
        if (profile.phone_from_bio && !result.phone) result.phone = profile.phone_from_bio;
        if (profile.website && !result.email) {
          // If we got a website from IG bio but haven't scraped it yet
          try {
            const siteResp = await fetch(profile.website, {
              headers: { "User-Agent": "Mozilla/5.0", "Accept": "text/html" },
              redirect: "follow", signal: AbortSignal.timeout(5000),
            });
            if (siteResp.ok) {
              const siteHtml = await siteResp.text();
              const siteEmails = extractEmails(siteHtml);
              if (siteEmails.length > 0 && !result.email) result.email = siteEmails[0];
              const sitePhones = extractPhones(siteHtml);
              if (sitePhones.length > 0 && !result.phone) result.phone = sitePhones[0];
            }
          } catch { /* ignore */ }
        }
      }
    }

    return new Response(JSON.stringify({ success: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("enrich-lead-social error:", e);
    return new Response(JSON.stringify({ success: false, error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
