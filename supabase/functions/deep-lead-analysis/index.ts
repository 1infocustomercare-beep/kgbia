// Deep Lead Analysis — scrapes the prospect's website + uses Lovable AI
// to produce a real, structured intelligence report a salesperson can use to close.
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/* ═══════════════════════════════════════════════
   PORTFOLIO REFERENCES per sector
   ═══════════════════════════════════════════════ */
const PORTFOLIO_REFS: Record<string, string> = {
  food: "COTE Miami (Korean BBQ Michelin), Paperfish Sushi (Omakase), Flame Kebab",
  bakery: "Boutique pastry chains in Miami & Roma",
  beauty: "Neo Nails Brickell, Tatush Hair & Fragrance",
  barber: "Premium barbershops Miami / Milano",
  spa: "Wellness retreats Italia / UAE",
  ncc: "Amalfi Luxury Transfer, Miami Boats Rental, Asinara Charter",
  fitness: "City Padel Milano, CrossFit chains",
  hospitality: "MMI Resident Hub, Boutique hotels Toscana",
  beach: "Miami Watersports, Stabilimenti premium Romagna",
  healthcare: "FAR Medical, Studi dentistici premium",
  dentist: "FAR Medical (clinica dentale full-stack)",
  veterinary: "Aloha Pet Resort",
  retail: "Boutique premium Brickell / Brera",
  plumber: "Nick's Plumbing & AC (Miami)",
  electrician: "Elite Electrical services",
  tattoo: "Ink Masters Studio",
  photography: "Vision Photography Studios",
  events: "Elite Events planner",
  construction: "Premium Costruzioni",
  gardening: "Verde & Giardini",
  agriturismo: "Tuscan Country Estate",
  cleaning: "Premium Clean Services",
  legal: "Studio Legale Premium",
  accounting: "Studio Commercialista Pro",
  garage: "Speed Auto Service",
};

/* ═══════════════════════════════════════════════
   Pain points + sector intel
   ═══════════════════════════════════════════════ */
const SECTOR_INTEL: Record<string, { pains: string[]; kpis: string[]; obj: string[] }> = {
  food: {
    pains: [
      "No-show 15-25% sui tavoli prenotati per telefono",
      "Commissioni delivery (Glovo/JustEat) 25-35% per ordine",
      "Zero CRM clienti — non si sa chi è tornato e quando",
      "Recensioni Google non gestite, una stella media penalizza la SERP locale",
    ],
    kpis: ["+22% prenotazioni dirette", "−30% no-show", "0% commissioni delivery proprietaria", "+1.2 punti Google rating"],
    obj: ["«Costa troppo» → ROI <60 giorni con sole prenotazioni recuperate",
          "«Ho già un sito» → Sì ma non prenota, non vende, non fidelizza",
          "«Non ho tempo» → Setup completo in 7 giorni, zero impegno per voi"],
  },
  beauty: {
    pains: [
      "Appuntamenti gestiti su agenda cartacea o WhatsApp = caos",
      "No-show ~€150/giorno di mancato fatturato",
      "Nessuna scheda cliente con storico trattamenti & allergie",
      "Marketing solo passaparola, zero campagne mirate",
    ],
    kpis: ["+35% prenotazioni online 24/7", "−40% no-show", "+€800/mese in pacchetti & gift card"],
    obj: ["«Le clienti chiamano» → Il 60% prenoterebbe la sera o il weekend se potesse",
          "«Costa» → Recuperate 1 no-show a settimana e pagate il sistema"],
  },
  ncc: {
    pains: [
      "Prenotazioni telefoniche = errori orari, indirizzi sbagliati",
      "Nessun preventivo automatico → si perdono richieste in chat",
      "Zero tracking GPS condiviso con il cliente",
      "Fatturazione manuale = ore di lavoro extra ogni mese",
    ],
    kpis: ["Booking online istantaneo", "Tracking live conducente", "Fatture automatiche conformi"],
    obj: ["«I clienti vogliono parlare» → Sì ma vogliono anche prenotare alle 23 dall'aeroporto"],
  },
  hospitality: {
    pains: [
      "Commissioni Booking/Expedia 15-25% per notte",
      "Check-in cartaceo = 15 min per ospite",
      "Zero upselling post-prenotazione (extra, esperienze)",
      "Recensioni gestite manualmente, risposte lente",
    ],
    kpis: ["+28% booking diretti senza commissioni", "Check-in 2 min", "+€18/notte di upselling automatico"],
    obj: ["«Booking ci porta clienti» → Sì pagando il 18%, voi tenete il 100% dei diretti"],
  },
  fitness: {
    pains: [
      "Iscrizioni su carta o Excel, retention non misurata",
      "Classi semi-vuote, nessuna prenotazione live",
      "Abbandono 40% nei primi 3 mesi senza engagement",
      "Zero community digitale tra membri",
    ],
    kpis: ["+45% riempimento classi", "−35% churn primi 3 mesi", "App proprietaria brandizzata"],
    obj: ["«Abbiamo MindBody» → Ma non è vostra, perdete dati e brand"],
  },
  healthcare: {
    pains: [
      "Slot persi per pazienti che non si presentano (~12%)",
      "Reminder appuntamenti manuali via segretaria",
      "Cartelle cartacee = rischio GDPR + tempo perso",
      "Zero telemedicina post-COVID per follow-up rapidi",
    ],
    kpis: ["−60% no-show con reminder automatici", "Cartelle digitali GDPR-compliant", "Telemedicina integrata"],
    obj: ["«I pazienti anziani non usano app» → Lo facciamo anche via SMS/WhatsApp"],
  },
  dentist: {
    pains: [
      "Pazienti chiamano, segretaria occupata = appuntamenti persi",
      "Recall semestrale fatto a mano = 70% non viene contattato",
      "Preventivi cartacei firmati in studio, lentezza follow-up",
      "Zero remarketing per impianti / ortodonzia",
    ],
    kpis: ["+€2.400/mese da recall automatico", "−50% slot vuoti", "Preventivi digitali con firma"],
    obj: ["«Ho già un gestionale» → Sì interno, qui parliamo del lato cliente"],
  },
  retail: {
    pains: [
      "E-commerce vs negozio locale: zero differenziazione digitale",
      "Inventario gestito manualmente, stock-out frequenti",
      "Nessun programma fedeltà digitale",
      "Zero notifiche push per offerte e nuovi arrivi",
    ],
    kpis: ["+38% scontrino medio con loyalty", "Click & collect attivo 24/7", "Push retention +25%"],
    obj: ["«Vendiamo solo in negozio» → I clienti ricercano online prima di entrare"],
  },
  beach: {
    pains: [
      "Prenotazioni telefoniche caotiche in alta stagione",
      "Servizi extra (lettini, pranzo, escursioni) non tracciati",
      "Zero loyalty per i clienti abituali",
      "Pagamenti contanti = problemi fiscali",
    ],
    kpis: ["Mappa interattiva ombrelloni", "+€15/cliente di upsell extra", "Pass stagionali digitali"],
    obj: ["«Funzioniamo bene così» → In alta stagione perdete 20+ prenotazioni al giorno"],
  },
  plumber: {
    pains: [
      "Preventivi a voce = contestazioni e mancato pagamento",
      "Nessun portfolio lavori online → cliente non si fida",
      "Zero CRM follow-up = clienti persi dopo il primo intervento",
      "Fatturazione e contabilità su carta",
    ],
    kpis: ["Preventivi digitali firmati in 3 min", "+40% richieste con portfolio online", "CRM intervento → fattura"],
    obj: ["«Lavoro sempre col passaparola» → Ma il 73% cerca prima su Google"],
  },
  electrician: {
    pains: [
      "Preventivi verbali, zero tracciabilità",
      "Nessuna prova lavori passati → meno preventivi accettati",
      "Gestione interventi con rubrica e calendario carta",
    ],
    kpis: ["Portfolio fotografico online", "Preventivi digitali", "Tracking interventi GPS"],
    obj: ["«Sono troppo grande per cambiare» → Iniziamo con un solo modulo"],
  },
  veterinary: {
    pains: [
      "Appuntamenti via telefono, nessun reminder automatico",
      "Cartelle animali cartacee, dispersive",
      "Zero remarketing per vaccini / sverminazioni periodiche",
    ],
    kpis: ["Reminder vaccini automatici", "Schede pet digitali", "+25% rivisite annuali"],
    obj: ["«Conosco i clienti uno per uno» → Sì ma loro non ricordano la data del vaccino"],
  },
  default: {
    pains: [
      "Presenza digitale frammentata o assente",
      "Nessuna automazione clienti / lead",
      "Zero strategia di fidelizzazione misurabile",
      "Marketing basato sul caso, non su dati",
    ],
    kpis: ["Presenza digitale completa", "CRM clienti automatizzato", "Marketing data-driven"],
    obj: ["«Ci penso» → Ogni settimana persa = clienti regalati ai concorrenti"],
  },
};

/* ═══════════════════════════════════════════════
   Website analyzer — scrape & extract real signals
   ═══════════════════════════════════════════════ */
type WebsiteAudit = {
  reachable: boolean;
  has_https: boolean;
  has_booking: boolean;
  has_ecommerce: boolean;
  has_chat: boolean;
  has_pixel: boolean;
  mobile_meta: boolean;
  language: string | null;
  title: string | null;
  description: string | null;
  emails_found: string[];
  phones_found: string[];
  social_links: { instagram?: string; facebook?: string; tiktok?: string; linkedin?: string };
  page_size_kb: number | null;
  age_signal: "modern" | "dated" | "obsolete" | "unknown";
  score: number; // 0-100, lower = bigger opportunity
};

async function auditWebsite(url: string | null): Promise<WebsiteAudit | null> {
  if (!url) return null;
  const fullUrl = url.startsWith("http") ? url : `https://${url}`;
  try {
    const resp = await fetch(fullUrl, {
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; EmpireAI-LeadAudit/1.0; +https://empireaigroup.com)",
        "Accept": "text/html,application/xhtml+xml",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(9000),
    });
    if (!resp.ok) {
      return {
        reachable: false, has_https: fullUrl.startsWith("https"), has_booking: false,
        has_ecommerce: false, has_chat: false, has_pixel: false, mobile_meta: false,
        language: null, title: null, description: null, emails_found: [], phones_found: [],
        social_links: {}, page_size_kb: null, age_signal: "obsolete", score: 15,
      };
    }
    const html = await resp.text();
    const lower = html.toLowerCase();
    const sizeKb = Math.round(html.length / 1024);

    // Modern stack signals
    const modernSignals = [
      lower.includes("react"), lower.includes("next.js"), lower.includes("vue"),
      lower.includes("svelte"), lower.includes("tailwind"), lower.includes("vite"),
    ].filter(Boolean).length;
    const datedSignals = [
      lower.includes("jquery-1."), lower.includes("jquery-2."), lower.includes("flash"),
      lower.includes("frameset"), lower.includes("activex"),
    ].filter(Boolean).length;

    let ageSignal: WebsiteAudit["age_signal"] = "unknown";
    if (modernSignals >= 1 && datedSignals === 0) ageSignal = "modern";
    else if (datedSignals >= 1 || sizeKb < 5) ageSignal = "obsolete";
    else ageSignal = "dated";

    // Booking / commerce / chat detection
    const has_booking = /(book|prenot|reserv|appointment|booking\.com|opentable|fork|treatwell|fresha)/i.test(html);
    const has_ecommerce = /(add.?to.?cart|carrello|checkout|woocommerce|shopify|magento|prestashop)/i.test(html);
    const has_chat = /(intercom|drift|tawk\.to|crisp|tidio|zendesk|hubspot.*messages|whatsapp.*api)/i.test(html);
    const has_pixel = /(facebook\.com\/tr|gtag|google-analytics|gtm\.start|fbq\(|analytics\.js)/i.test(html);
    const mobile_meta = /<meta[^>]+name=["']viewport["']/i.test(html);

    const langMatch = html.match(/<html[^>]+lang=["']([a-z-]+)["']/i);
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const descMatch = html.match(/<meta[^>]+name=["']description["'][^>]+content=["']([^"']+)["']/i);

    // Contacts
    const emails = [...new Set([...html.matchAll(/([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g)].map(m => m[1].toLowerCase()))]
      .filter(e => !["sentry", "wixpress", "example.com", "schema.org"].some(b => e.includes(b)))
      .slice(0, 5);
    const phones = [...new Set([...html.matchAll(/(\+?\d{2,4}[\s.-]?\d{3,4}[\s.-]?\d{3,4})/g)].map(m => m[1].replace(/[\s.-]/g, "")))]
      .filter(p => p.length >= 9 && p.length <= 15).slice(0, 3);

    // Socials
    const social: WebsiteAudit["social_links"] = {};
    const ig = html.match(/instagram\.com\/([a-zA-Z0-9_.]{3,30})/i);
    if (ig) social.instagram = ig[1].toLowerCase();
    const fb = html.match(/facebook\.com\/([a-zA-Z0-9_.\-]{3,60})/i);
    if (fb) social.facebook = fb[1].toLowerCase();
    const tt = html.match(/tiktok\.com\/@([a-zA-Z0-9_.]{3,30})/i);
    if (tt) social.tiktok = tt[1].toLowerCase();
    const li = html.match(/linkedin\.com\/(?:company|in)\/([a-zA-Z0-9_.\-]{3,60})/i);
    if (li) social.linkedin = li[1].toLowerCase();

    // Compute opportunity score (lower = bigger gap = bigger opportunity to sell)
    let score = 100;
    if (!has_booking) score -= 20;
    if (!has_ecommerce && /(shop|negozio|store)/i.test(lower)) score -= 10;
    if (!has_chat) score -= 8;
    if (!has_pixel) score -= 12;
    if (!mobile_meta) score -= 18;
    if (ageSignal === "obsolete") score -= 25;
    else if (ageSignal === "dated") score -= 12;
    if (sizeKb < 8) score -= 10;
    score = Math.max(5, Math.min(100, score));

    return {
      reachable: true,
      has_https: fullUrl.startsWith("https"),
      has_booking, has_ecommerce, has_chat, has_pixel, mobile_meta,
      language: langMatch?.[1] || null,
      title: titleMatch?.[1]?.trim().slice(0, 120) || null,
      description: descMatch?.[1]?.trim().slice(0, 220) || null,
      emails_found: emails, phones_found: phones, social_links: social,
      page_size_kb: sizeKb, age_signal: ageSignal, score,
    };
  } catch (e) {
    console.log("Website audit failed:", e);
    return {
      reachable: false, has_https: false, has_booking: false, has_ecommerce: false,
      has_chat: false, has_pixel: false, mobile_meta: false, language: null, title: null,
      description: null, emails_found: [], phones_found: [], social_links: {},
      page_size_kb: null, age_signal: "unknown", score: 20,
    };
  }
}

/* ═══════════════════════════════════════════════
   Web search fallback — discover website when missing
   ═══════════════════════════════════════════════ */
async function discoverWebsite(name: string, city: string): Promise<string | null> {
  try {
    const q = encodeURIComponent(`${name} ${city}`);
    const resp = await fetch(`https://duckduckgo.com/html/?q=${q}`, {
      headers: { "User-Agent": "Mozilla/5.0 (compatible; EmpireAI-LeadAudit/1.0)" },
      signal: AbortSignal.timeout(7000),
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const matches = [...html.matchAll(/<a[^>]+class="result__a"[^>]+href="([^"]+)"/gi)];
    for (const m of matches) {
      let raw = m[1];
      const uddg = raw.match(/uddg=([^&]+)/);
      if (uddg) raw = decodeURIComponent(uddg[1]);
      try {
        const u = new URL(raw);
        const host = u.hostname.replace(/^www\./, "");
        const skip = ["facebook.com", "instagram.com", "tripadvisor.", "yelp.", "thefork.", "google.", "duckduckgo.", "youtube.com", "linkedin.com", "tiktok.com", "twitter.com", "x.com", "wikipedia.", "pagine", "virgilio", "misterimprese", "europages"];
        if (skip.some(s => host.includes(s))) continue;
        return `https://${host}`;
      } catch { /* skip */ }
    }
    return null;
  } catch (e) {
    console.log("discoverWebsite failed:", e);
    return null;
  }
}

/* ═══════════════════════════════════════════════
   Instagram public snapshot (followers + bio + verified)
   ═══════════════════════════════════════════════ */
async function fetchInstagramSnapshot(handle: string): Promise<{ followers: number | null; bio: string | null; verified: boolean } | null> {
  try {
    const clean = handle.replace(/^@/, "").trim();
    if (!clean) return null;
    const resp = await fetch(`https://www.instagram.com/${clean}/`, {
      headers: {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 Chrome/120 Safari/537.36",
        "Accept-Language": "it-IT,it;q=0.9,en;q=0.8",
      },
      redirect: "follow",
      signal: AbortSignal.timeout(7000),
    });
    if (!resp.ok) return null;
    const html = await resp.text();
    const desc = html.match(/<meta\s+(?:property="og:description"|name="description")\s+content="([^"]+)"/i);
    let followers: number | null = null;
    let bio: string | null = null;
    if (desc) {
      bio = desc[1];
      const f = desc[1].match(/([\d,.]+)\s*([KkMm])?\s*Follower/i);
      if (f) {
        const num = parseFloat(f[1].replace(/,/g, ""));
        const mult = f[2]?.toLowerCase() === "m" ? 1_000_000 : f[2]?.toLowerCase() === "k" ? 1_000 : 1;
        followers = Math.round(num * mult);
      }
    }
    const verified = /is_verified["'\s:]+true/i.test(html);
    return { followers, bio, verified };
  } catch {
    return null;
  }
}

/* ═══════════════════════════════════════════════
   AI structured analysis via tool calling
   ═══════════════════════════════════════════════ */
const ANALYSIS_TOOL = {
  type: "function",
  function: {
    name: "deliver_lead_intel",
    description: "Return a structured intelligence report a salesperson can use to close this prospect.",
    parameters: {
      type: "object",
      properties: {
        executive_summary: {
          type: "string",
          description: "2-3 sentences: who they are, where they are, why they're a fit RIGHT NOW.",
        },
        opportunity_score: { type: "number", description: "0-100 — how strong this lead is (data-driven)." },
        urgency_score: { type: "number", description: "0-100 — how urgent the need is." },
        budget_band: { type: "string", enum: ["low", "mid", "high", "premium"], description: "Inferred budget capacity." },
        decision_maker: {
          type: "object",
          properties: {
            likely_role: { type: "string", description: "e.g. 'Titolare', 'Responsabile marketing'." },
            best_contact_time: { type: "string", description: "Realistic time window (sector-aware)." },
            preferred_channel: { type: "string", enum: ["whatsapp", "instagram_dm", "email", "call", "in_person"] },
          },
          required: ["likely_role", "best_contact_time", "preferred_channel"],
        },
        digital_audit: {
          type: "object",
          properties: {
            current_state: { type: "string", description: "Plain-language assessment of their digital presence." },
            critical_gaps: { type: "array", items: { type: "string" }, description: "3-5 concrete gaps." },
            quick_wins: { type: "array", items: { type: "string" }, description: "3-5 things Empire fixes in week 1." },
          },
          required: ["current_state", "critical_gaps", "quick_wins"],
        },
        pain_points: {
          type: "array",
          items: {
            type: "object",
            properties: {
              pain: { type: "string", description: "The pain in their words." },
              evidence: { type: "string", description: "Why we know this — based on real data." },
              cost_to_them: { type: "string", description: "Estimated monthly/annual cost in €." },
            },
            required: ["pain", "evidence", "cost_to_them"],
          },
          description: "4-6 prioritized pain points.",
        },
        sales_hooks: {
          type: "array",
          items: { type: "string" },
          description: "3-5 conversation openers tailored to THIS prospect.",
        },
        objections: {
          type: "array",
          items: {
            type: "object",
            properties: {
              objection: { type: "string" },
              response: { type: "string", description: "Concise rebuttal — 1-2 sentences." },
            },
            required: ["objection", "response"],
          },
          description: "Top 3 objections + crisp responses.",
        },
        recommended_pitch: {
          type: "object",
          properties: {
            opener: { type: "string", description: "Exact opening line (≤25 words)." },
            value_prop: { type: "string", description: "One-sentence value prop." },
            proof: { type: "string", description: "Portfolio proof (cite a real Empire project)." },
            cta: { type: "string", description: "Low-commitment ask (call, demo, link)." },
          },
          required: ["opener", "value_prop", "proof", "cta"],
        },
        recommended_package: {
          type: "object",
          properties: {
            name: { type: "string", enum: ["Digital Start", "Growth AI", "Empire Domination"] },
            why: { type: "string", description: "Why this package fits THIS prospect." },
            estimated_roi_days: { type: "number", description: "Days to break even." },
          },
          required: ["name", "why", "estimated_roi_days"],
        },
        next_actions: {
          type: "array",
          items: { type: "string" },
          description: "3 concrete next moves the salesperson should do TODAY.",
        },
        risk_flags: {
          type: "array",
          items: { type: "string" },
          description: "Things that could kill the deal — 0-3 items, empty if none.",
        },
      },
      required: [
        "executive_summary", "opportunity_score", "urgency_score", "budget_band",
        "decision_maker", "digital_audit", "pain_points", "sales_hooks",
        "objections", "recommended_pitch", "recommended_package", "next_actions", "risk_flags",
      ],
      additionalProperties: false,
    },
  },
};

/* ═══════════════════════════════════════════════
   Edge function
   ═══════════════════════════════════════════════ */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Auth guard
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: { user }, error: authErr } = await authClient.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const {
      name, city, sector, website, instagram, phone, email,
      google_rating = 0, google_reviews = 0, full_address = "",
      country, opening_hours = null, types = [],
    } = body || {};

    if (!name) {
      return new Response(JSON.stringify({ error: "name is required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY missing");

    const sectorKey = (sector || "default").toLowerCase();
    const intel = SECTOR_INTEL[sectorKey] || SECTOR_INTEL.default;
    const portfolio = PORTFOLIO_REFS[sectorKey] || "il portfolio Empire AI Group";

    // 1) Audit website (real signal)
    const audit = await auditWebsite(website);

    // 2) Build prompt
    const factPack = `
ATTIVITÀ: ${name}
SETTORE: ${sector || "non specificato"}
CITTÀ: ${city || "n/d"}${country ? `, ${country}` : ""}
INDIRIZZO: ${full_address || "n/d"}
RATING GOOGLE: ${google_rating || "n/d"} (${google_reviews || 0} recensioni)
SITO: ${website || "ASSENTE"}
INSTAGRAM: ${instagram ? `@${instagram}` : "non noto"}
TELEFONO: ${phone || "non noto"}
EMAIL: ${email || "non nota"}
ORARI: ${opening_hours || "non noti"}
TIPO OSM/Google: ${types?.join?.(", ") || "n/d"}

AUDIT SITO WEB (dati reali estratti):
${audit ? JSON.stringify(audit, null, 2) : "Sito non disponibile o non analizzato"}

INTELLIGENCE DI SETTORE (${sector}):
- Pain points tipici:\n  • ${intel.pains.join("\n  • ")}
- KPI ottenibili:\n  • ${intel.kpis.join("\n  • ")}
- Obiezioni comuni:\n  • ${intel.obj.join("\n  • ")}

PORTFOLIO EMPIRE PIÙ RILEVANTE: ${portfolio}
`.trim();

    const systemPrompt = `Sei un Senior Business Development Consultant di Empire AI Group, specializzato in trasformazione digitale per PMI. Devi analizzare il prospect FORNITO e produrre un report di intelligence operativo che permetta al venditore di chiudere il cliente.

REGOLE:
1. NON inventare dati. Usa SOLO i dati reali forniti (audit sito, rating, social, settore).
2. Quando un dato manca, scrivi esplicitamente "non noto" o deduci con cautela ("probabile", "stimato").
3. I pain points devono essere SPECIFICI per QUESTA attività, non generici di settore.
4. Le evidenze devono citare i dati reali ("nessun viewport mobile rilevato", "rating 3.2 su 47 recensioni", ecc).
5. Le stime di costo devono essere realistiche e in € italiani.
6. Il pacchetto consigliato deve riflettere il budget_band stimato.
7. Cita SEMPRE un progetto del portfolio Empire come prova concreta.
8. Tono: professionale, consulenziale, zero fuffa. Italiano impeccabile.
9. Restituisci ESCLUSIVAMENTE il tool call deliver_lead_intel — niente testo extra.`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: factPack },
        ],
        tools: [ANALYSIS_TOOL],
        tool_choice: { type: "function", function: { name: "deliver_lead_intel" } },
        temperature: 0.4,
      }),
    });

    if (!aiResp.ok) {
      const status = aiResp.status;
      if (status === 429) {
        return new Response(JSON.stringify({ error: "Troppe richieste, riprova tra poco." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (status === 402) {
        return new Response(JSON.stringify({ error: "Crediti AI esauriti." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI error", status, t);
      throw new Error(`AI gateway error: ${status}`);
    }

    const aiData = await aiResp.json();
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall?.function?.arguments) {
      throw new Error("AI returned no structured output");
    }

    let report: any;
    try {
      report = JSON.parse(toolCall.function.arguments);
    } catch (e) {
      console.error("JSON parse failed", toolCall.function.arguments);
      throw new Error("Malformed AI response");
    }

    return new Response(JSON.stringify({
      success: true,
      report,
      audit,
      portfolio_ref: portfolio,
      analyzed_at: new Date().toISOString(),
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("deep-lead-analysis error:", e);
    return new Response(JSON.stringify({
      success: false,
      error: e instanceof Error ? e.message : "Unknown error",
    }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
