import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* Extract Instagram handles from HTML content */
function extractInstagramHandles(html: string): string[] {
  const handles = new Set<string>();
  
  // Pattern 1: instagram.com/username links
  const igLinkRegex = /(?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]{1,30})\/?/gi;
  let match;
  while ((match = igLinkRegex.exec(html)) !== null) {
    const handle = match[1].toLowerCase();
    // Filter out non-profile pages
    if (!["p", "reel", "reels", "explore", "stories", "accounts", "about", "legal", "developer", "directory", "tv", "tags"].includes(handle)) {
      handles.add(handle);
    }
  }
  
  // Pattern 2: @username mentions near "instagram" context
  const contextRegex = /instagram[^<]*?@([a-zA-Z0-9_.]{3,30})/gi;
  while ((match = contextRegex.exec(html)) !== null) {
    handles.add(match[1].toLowerCase());
  }
  
  // Pattern 3: href containing instagram
  const hrefRegex = /href=["'](?:https?:\/\/)?(?:www\.)?instagram\.com\/([a-zA-Z0-9_.]{1,30})\/?["']/gi;
  while ((match = hrefRegex.exec(html)) !== null) {
    const handle = match[1].toLowerCase();
    if (!["p", "reel", "reels", "explore", "stories", "accounts", "about", "legal", "developer", "directory", "tv", "tags"].includes(handle)) {
      handles.add(handle);
    }
  }
  
  return [...handles];
}

/* Extract Facebook pages from HTML */
function extractFacebookPages(html: string): string[] {
  const pages = new Set<string>();
  const fbRegex = /(?:https?:\/\/)?(?:www\.)?facebook\.com\/([a-zA-Z0-9_./-]{1,60})\/?/gi;
  let match;
  while ((match = fbRegex.exec(html)) !== null) {
    const page = match[1].toLowerCase().split("/")[0]; // get main page name
    if (!["sharer", "share", "dialog", "login", "help", "groups", "events", "marketplace", "watch", "gaming", "pages", "profile.php"].includes(page)) {
      pages.add(page);
    }
  }
  return [...pages];
}

/* Extract email addresses */
function extractEmails(html: string): string[] {
  const emails = new Set<string>();
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
  let match;
  while ((match = emailRegex.exec(html)) !== null) {
    const email = match[1].toLowerCase();
    if (!email.includes("example.com") && !email.includes("sentry") && !email.includes("wixpress") && !email.includes("wordpress")) {
      emails.add(email);
    }
  }
  return [...emails];
}

/* Extract phone numbers */
function extractPhones(html: string): string[] {
  const phones = new Set<string>();
  // Italian phone patterns: +39, 0X, 3X
  const phoneRegex = /(?:tel:|href=["']tel:)?(\+?39[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/g;
  let match;
  while ((match = phoneRegex.exec(html)) !== null) {
    const phone = match[1].replace(/[\s.-]/g, "");
    if (phone.length >= 9 && phone.length <= 15) {
      phones.add(phone);
    }
  }
  // Also try international format
  const intlRegex = /(\+\d{1,3}[\s.-]?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/g;
  while ((match = intlRegex.exec(html)) !== null) {
    const phone = match[1].replace(/[\s.-]/g, "");
    if (phone.length >= 10 && phone.length <= 15) {
      phones.add(phone);
    }
  }
  return [...phones];
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { website, name, city } = await req.json();
    
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
      source: string;
    } = {
      instagram: null, facebook: null, email: null, phone: null,
      all_instagrams: [], source: "none",
    };

    // Strategy 1: Scrape the business website directly
    if (website) {
      const url = website.startsWith("http") ? website : `https://${website}`;
      try {
        const resp = await fetch(url, {
          headers: {
            "User-Agent": "Mozilla/5.0 (compatible; EmpireAI-Bot/1.0; +https://empireaigroup.com)",
            "Accept": "text/html",
          },
          redirect: "follow",
          signal: AbortSignal.timeout(8000),
        });
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
      } catch (e) {
        console.log("Website scrape failed:", e);
      }
    }

    // Strategy 2: If no Instagram found from website, try Google search via AI
    if (!result.instagram && name) {
      const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
      if (LOVABLE_API_KEY) {
        try {
          const searchName = name.replace(/[^a-zA-Z0-9\s]/g, "").trim();
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
              model: "google/gemini-2.5-flash-lite",
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
        } catch (e) {
          console.log("AI Instagram lookup failed:", e);
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
