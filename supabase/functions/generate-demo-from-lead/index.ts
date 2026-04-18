// generate-demo-from-lead — DEMO FACTORY PRO
// Pipeline:
// 1. Auto-detect settore dal sito (se presente) e mappa a template iPhone
// 2. Firecrawl deep scrape (markdown + branding + links + immagini)
// 3. Estrazione foto reali multi-source: sito → IG/FB → Google Places
// 4. Fallback Gemini Image quando mancano foto chiave (hero/menu/gallery)
// 5. AI brand kit (palette + tagline + menu/listino + clienti + reviews)
// 6. Seed coerente col settore (food → restaurants, altri → companies)
// 7. Magic link email per il lead

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FOOD_SECTORS = new Set([
  "food", "bakery", "gelateria", "wine_bar", "catering", "pizzeria", "ristoration",
]);

/* ─── UNIVERSAL SUB-SECTOR DETECTION → preview/template auto-match ───
 * Per ogni macro-settore identifichiamo il sotto-settore esatto
 * (es. food → pizzeria/sushi/braceria/pesce/bakery, beauty → nails/hair,
 *  ncc → yacht/limo/transfer, fitness → padel/gym/watersports)
 * e mappiamo direttamente alla preview iPhone più adatta del catalog mockup.
 */
type SubSectorKey =
  // Food
  | "pizzeria" | "sushi" | "braceria" | "pesce" | "bakery"
  | "vietnamese" | "kosher" | "ceviche" | "gelateria" | "ristorante"
  // Beauty
  | "nails" | "hair" | "spa"
  // NCC / Mobility
  | "yacht" | "boat" | "limo" | "transfer"
  // Fitness
  | "padel" | "gym" | "watersports"
  // Hospitality
  | "luxury_hotel" | "agriturismo" | "bnb"
  // Generic fallback
  | "generic";

type TemplateVariant =
  | "strapizzami"      // pizzeria napoletana cream/terracotta
  | "cote-obsidian"    // dark+gold premium (braceria, gourmet)
  | "cote-marble"      // marble warm (ristorante upscale)
  | "cote-ivory"       // ivory beige editorial (ristorante classic)
  | "paperfish-sakura" // cream/red giapponese tradizionale
  | "paperfish-dark"   // luxury-dark sushi gourmet
  | "lavang-noir"      // noir saigon vietnamese
  | "midtown-kosher"   // kosher minimal
  | "batey-pacifico"   // ceviche/pesce caraibico
  | "neo-nails-lavender" // nails lavender luxe
  | "neo-nails-blush"    // nails blush rosegold
  | "tatush-hair"        // hair fragrance
  | "asinara-azure"      // yacht charter sardinia
  | "miami-boats"        // boat rental miami
  | "city-padel-sage"    // padel sage luxe
  | "miami-watersports"  // watersports
  | "default";

interface SubSectorMatch {
  sub: SubSectorKey;
  variant: TemplateVariant;
  heroTagline?: string;
  themeHint: "light-cream" | "dark-gold" | "marble" | "sakura" | "noir" | "azure" | "sage" | "lavender" | "blush" | "default";
}

function detectSubSector(lead: LeadInput, scrapedText?: string): SubSectorMatch {
  const haystack = [
    lead.businessName,
    lead.sectorLabel,
    lead.sector,
    scrapedText?.slice(0, 4000) || "",
  ].join(" ").toLowerCase();

  const name = (lead.businessName || "").toLowerCase();
  const isLuxury = /\b(gourmet|luxury|prive|exclusive|noir|black|gold|royal|prestige|premium|fine dining)\b/.test(name + " " + haystack);
  const sector = (lead.sector || "").toLowerCase();

  /* ── FOOD ── */
  if (FOOD_SECTORS.has(sector) || /\b(menu|piatto|chef|ristorante|trattoria|osteria)\b/.test(haystack)) {
    if (/\b(pizz(a|eria|aiolo)|napolet|forno a legna|margherita|marinara|trapizz)\b/.test(haystack)) {
      return {
        sub: "pizzeria",
        variant: isLuxury ? "cote-obsidian" : "strapizzami",
        heroTagline: "LA VERA PIZZA NAPOLETANA",
        themeHint: isLuxury ? "dark-gold" : "light-cream",
      };
    }
    if (/\b(sushi|sashimi|ramen|nigiri|maki|temaki|giappones|japanese|izakaya|wagyu|omakase)\b/.test(haystack)) {
      return {
        sub: "sushi",
        variant: isLuxury ? "paperfish-dark" : "paperfish-sakura",
        heroTagline: "L'ARTE GIAPPONESE DEL GUSTO",
        themeHint: isLuxury ? "noir" : "sakura",
      };
    }
    if (/\b(braceri|steak|grill|fiorentin|bistecc|carne alla brace|smokehouse|barbecue|bbq|churrasc|asado)\b/.test(haystack)) {
      return {
        sub: "braceria",
        variant: "cote-obsidian",
        heroTagline: "FUOCO, CARNE, TRADIZIONE",
        themeHint: "dark-gold",
      };
    }
    if (/\b(pesce|fish|frutti di mare|crostacei|seafood|raw bar|ostriche|cevich|tartare di pesce)\b/.test(haystack)) {
      return {
        sub: "pesce",
        variant: "batey-pacifico",
        heroTagline: "DAL MARE ALLA TAVOLA",
        themeHint: "azure",
      };
    }
    if (/\b(panett|fornai|panificio|bakery|pasticceria|cornett|brioche|lievit|forno|bread|croissant)\b/.test(haystack) || sector === "bakery") {
      return {
        sub: "bakery",
        variant: "cote-ivory",
        heroTagline: "L'ARTE DEL FORNO",
        themeHint: "marble",
      };
    }
    if (/\b(vietnam|pho|banh|saigon|hanoi)\b/.test(haystack)) {
      return { sub: "vietnamese", variant: "lavang-noir", heroTagline: "ESSENCE OF VIETNAM", themeHint: "noir" };
    }
    if (/\b(kosher|jewish|kasher)\b/.test(haystack)) {
      return { sub: "kosher", variant: "midtown-kosher", heroTagline: "TRADITION & TASTE", themeHint: "marble" };
    }
    if (/\b(gelater|gelato|ice cream|sorbet)\b/.test(haystack) || sector === "gelateria") {
      return { sub: "gelateria", variant: "cote-ivory", heroTagline: "GELATO ARTIGIANALE", themeHint: "marble" };
    }
    // Ristorante generico — scegli stile in base a luxury vs classic
    return {
      sub: "ristorante",
      variant: isLuxury ? "cote-marble" : "cote-ivory",
      heroTagline: "BENVENUTI A TAVOLA",
      themeHint: isLuxury ? "marble" : "marble",
    };
  }

  /* ── BEAUTY ── */
  if (/beauty|estetica|salon|nail|hair|barber|spa/.test(sector + haystack)) {
    if (/\b(nail|unghie|manicure|pedicure)\b/.test(haystack)) {
      return {
        sub: "nails",
        variant: isLuxury ? "neo-nails-blush" : "neo-nails-lavender",
        heroTagline: "BELLEZZA SU MISURA",
        themeHint: isLuxury ? "blush" : "lavender",
      };
    }
    if (/\b(hair|capelli|parrucchier|barber|salon)\b/.test(haystack)) {
      return { sub: "hair", variant: "tatush-hair", heroTagline: "LO STILE È UN'ARTE", themeHint: "marble" };
    }
    if (/\b(spa|massagg|wellness|terme)\b/.test(haystack)) {
      return { sub: "spa", variant: "neo-nails-lavender", heroTagline: "RILASSO PROFONDO", themeHint: "lavender" };
    }
    return { sub: "nails", variant: "neo-nails-lavender", heroTagline: "BELLEZZA SU MISURA", themeHint: "lavender" };
  }

  /* ── NCC / MOBILITY ── */
  if (/ncc|noleggio|chauffeur|transfer|limo|yacht|boat|charter/.test(sector + haystack)) {
    if (/\b(yacht|charter|barca a vela|sailing)\b/.test(haystack)) {
      return { sub: "yacht", variant: "asinara-azure", heroTagline: "LUSSO IN MARE APERTO", themeHint: "azure" };
    }
    if (/\b(boat|gommone|tender|motoscaf)\b/.test(haystack)) {
      return { sub: "boat", variant: "miami-boats", heroTagline: "EXCLUSIVE BOAT EXPERIENCE", themeHint: "azure" };
    }
    if (/\b(limo|berlina|mercedes|chauffeur|executive)\b/.test(haystack) || isLuxury) {
      return { sub: "limo", variant: "cote-obsidian", heroTagline: "TRANSFER DI ALTA GAMMA", themeHint: "dark-gold" };
    }
    return { sub: "transfer", variant: "asinara-azure", heroTagline: "VIAGGIA CON STILE", themeHint: "azure" };
  }

  /* ── FITNESS ── */
  if (/fitness|gym|palestra|crossfit|padel|tennis|sport/.test(sector + haystack)) {
    if (/\b(padel|tennis)\b/.test(haystack)) {
      return { sub: "padel", variant: "city-padel-sage", heroTagline: "GIOCA AL TUO MEGLIO", themeHint: "sage" };
    }
    if (/\b(watersport|surf|kite|windsurf|sup|paddle)\b/.test(haystack)) {
      return { sub: "watersports", variant: "miami-watersports", heroTagline: "ADRENALINA SUL MARE", themeHint: "azure" };
    }
    return { sub: "gym", variant: "city-padel-sage", heroTagline: "ALLENATI AL TUO MEGLIO", themeHint: "sage" };
  }

  /* ── HOSPITALITY ── */
  if (/hotel|hospitality|bnb|b&b|resort|agriturismo/.test(sector + haystack)) {
    if (/\b(agriturismo|farm|country)\b/.test(haystack)) {
      return { sub: "agriturismo", variant: "cote-ivory", heroTagline: "L'OSPITALITÀ DI CAMPAGNA", themeHint: "marble" };
    }
    if (isLuxury || /\b(luxury|5 stars|cinque stelle|resort)\b/.test(haystack)) {
      return { sub: "luxury_hotel", variant: "cote-marble", heroTagline: "OSPITALITÀ ESCLUSIVA", themeHint: "marble" };
    }
    return { sub: "bnb", variant: "cote-ivory", heroTagline: "CASA LONTANO DA CASA", themeHint: "marble" };
  }

  return { sub: "generic", variant: "default", themeHint: "default" };
}

/** Backward-compat helper (in caso qualcosa lo usi ancora) */
function pickTemplateVariant(_sub: any, _name: string): TemplateVariant {
  return "default";
}

/* Default pizzeria menu (used as seed when AI brand kit is generic) */
const DEFAULT_PIZZERIA_MENU = [
  { name: "Margherita DOC", description: "Pomodoro San Marzano DOP, mozzarella di bufala campana, basilico fresco, olio EVO", price: 9.5, category: "Classiche", popular: true },
  { name: "Marinara", description: "Pomodoro San Marzano, aglio, origano, olio EVO", price: 7.5, category: "Classiche" },
  { name: "Diavola", description: "Pomodoro, mozzarella fior di latte, salame piccante calabrese", price: 11, category: "Classiche", popular: true },
  { name: "Capricciosa", description: "Pomodoro, mozzarella, prosciutto cotto, funghi, carciofi, olive nere", price: 12.5, category: "Classiche" },
  { name: "Quattro Formaggi", description: "Mozzarella, gorgonzola DOP, fontina, parmigiano reggiano 24 mesi", price: 13, category: "Speciali" },
  { name: "Salsiccia e Friarielli", description: "Salsiccia napoletana, friarielli saltati, provola affumicata", price: 13.5, category: "Speciali", popular: true },
  { name: "Bufala e Crudo", description: "Mozzarella di bufala, prosciutto crudo di Parma 24 mesi, rucola, scaglie di grana", price: 14, category: "Speciali" },
  { name: "Tartufata", description: "Crema di tartufo nero, mozzarella, funghi porcini, scaglie di tartufo", price: 16, category: "Speciali" },
  { name: "Calzone Classico", description: "Ricotta, prosciutto cotto, mozzarella, pepe nero", price: 11, category: "Calzoni" },
  { name: "Calzone Vegetariano", description: "Ricotta, spinaci, mozzarella, pomodorini confit", price: 11, category: "Calzoni" },
  { name: "Bruschetta Pomodoro", description: "Pane casereccio, pomodorini freschi, basilico, aglio, olio EVO", price: 6, category: "Antipasti" },
  { name: "Tagliere Misto", description: "Selezione di salumi e formaggi del territorio con mostarde", price: 14, category: "Antipasti" },
  { name: "Tiramisù della Casa", description: "Ricetta classica con mascarpone, savoiardi e caffè espresso", price: 6, category: "Dolci", popular: true },
  { name: "Coca Cola 33cl", description: "Lattina ghiacciata", price: 3, category: "Bevande" },
  { name: "Birra Peroni Nastro Azzurro 33cl", description: "Bottiglia", price: 4, category: "Bevande" },
  { name: "Acqua Naturale 75cl", description: "Bottiglia in vetro", price: 2.5, category: "Bevande" },
];

/* Default sushi/japanese menu (used as seed when AI brand kit is generic) */
const DEFAULT_SUSHI_MENU = [
  { name: "Salmon Nigiri", description: "Riso shari, salmone fresco norvegese, pennellata di nikiri", price: 8, category: "Nigiri", popular: true, jp_label: "鮭にぎり" },
  { name: "Tuna Nigiri", description: "Riso shari, tonno rosso del Mediterraneo", price: 9, category: "Nigiri", jp_label: "鮪にぎり" },
  { name: "Ebi Nigiri", description: "Gambero cotto, riso shari, salsa unagi", price: 7, category: "Nigiri", jp_label: "海老にぎり" },
  { name: "Salmon Sashimi (5pz)", description: "Salmone tagliato a fette spesse, daikon, wasabi", price: 14, category: "Sashimi", popular: true, jp_label: "鮭刺身" },
  { name: "Tuna Sashimi (5pz)", description: "Tonno rosso premium, taglio spesso", price: 18, category: "Sashimi", jp_label: "鮪刺身" },
  { name: "Hosomaki Salmone", description: "Mini roll: riso, alga nori, salmone fresco (6pz)", price: 7, category: "Hosomaki", jp_label: "細巻" },
  { name: "Hosomaki Tonno", description: "Mini roll: riso, alga nori, tonno (6pz)", price: 7.5, category: "Hosomaki", jp_label: "細巻" },
  { name: "California Roll", description: "Granchio, avocado, cetriolo, sesamo, maionese giapponese (8pz)", price: 12, category: "Uramaki", popular: true, jp_label: "カリフォルニアロール" },
  { name: "Spicy Tuna Roll", description: "Tonno piccante, cipollotto, peperoncino, salsa sriracha (8pz)", price: 13, category: "Uramaki", jp_label: "スパイシーマグロ" },
  { name: "Dragon Roll", description: "Gambero tempura, avocado, anguilla, salsa unagi (8pz)", price: 18, category: "Special Roll", popular: true, jp_label: "ドラゴンロール" },
  { name: "Rainbow Roll", description: "California roll ricoperto da 5 tipi di pesce e avocado (8pz)", price: 19, category: "Special Roll", jp_label: "レインボーロール" },
  { name: "Tonkotsu Ramen", description: "Brodo di maiale 12h, chashu, ajitama, scalogno, nori", price: 16, category: "Ramen", popular: true, jp_label: "豚骨ラーメン" },
  { name: "Shoyu Ramen", description: "Brodo di pollo, salsa di soia, naruto, bambù, uovo", price: 14, category: "Ramen", jp_label: "醤油ラーメン" },
  { name: "Edamame", description: "Fagioli di soia al sale marino dell'Himalaya", price: 6, category: "Antipasti", jp_label: "枝豆" },
  { name: "Gyoza (5pz)", description: "Ravioli giapponesi al maiale e cavolo, salsa ponzu", price: 8, category: "Antipasti", popular: true, jp_label: "餃子" },
  { name: "Mochi Trio", description: "Tre dolcetti di riso glutinoso: matcha, fragola, cocco", price: 8, category: "Dolci", jp_label: "餅" },
];
const SECTOR_IMAGE_KEYWORDS: Record<string, string[]> = {
  food: ["pasta", "pizza", "piatto", "dish", "menu", "tavolo", "ristorante", "chef"],
  bakery: ["pane", "torta", "dolce", "pasticceria", "bread", "cake"],
  beauty: ["beauty", "salon", "trattamento", "estetica", "viso", "manicure"],
  ncc: ["auto", "car", "mercedes", "limousine", "transfer", "berlina"],
  hotel: ["camera", "room", "suite", "hotel", "lobby"],
  hospitality: ["camera", "room", "suite", "hotel", "lobby"],
  fitness: ["palestra", "gym", "workout", "training"],
  healthcare: ["studio", "clinic", "medical", "dentist"],
  retail: ["shop", "store", "negozio", "vetrina", "prodotto"],
  beach: ["spiaggia", "ombrellone", "beach", "mare"],
  plumber: ["idraulico", "tubo", "bagno"],
  electrician: ["elettricista", "impianto"],
  garage: ["officina", "auto", "garage"],
  veterinary: ["pet", "cane", "gatto", "veterinario"],
  tattoo: ["tattoo", "studio", "tatuaggio"],
  photography: ["foto", "studio", "photography"],
  events: ["wedding", "evento", "matrimonio"],
};

interface LeadInput {
  businessName: string;
  sector: string;
  sectorLabel?: string;
  city?: string;
  zone?: string;
  fullAddress?: string;
  phone?: string;
  email?: string;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  googleRating?: number;
  googleReviews?: number;
  googleMapsUrl?: string | null;
  googlePlaceId?: string | null;
}

interface PreviewSelection {
  brandName?: string;
  styleName?: string;
  imageUrl?: string;
  sectorId?: string;
}

interface BrandPalette {
  primary: string;
  secondary: string;
  bg: string;
  accent: string;
}

interface ScrapedAssets {
  markdown?: string;
  branding?: any;
  metadata?: any;
  links?: string[];
  images: string[]; // raw image URLs found
  logo?: string | null;
  detectedSectorHint?: string | null;
}

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

const isHttpUrl = (u: string) => /^https?:\/\//i.test(u);
const uniq = <T,>(arr: T[]) => Array.from(new Set(arr));

/* ─── 1. FIRECRAWL DEEP SCRAPE (markdown + branding + images) ─── */
async function deepScrape(url: string): Promise<ScrapedAssets | null> {
  const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
  if (!FIRECRAWL_API_KEY || !url) return null;

  try {
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        url,
        formats: ["markdown", "html", "branding", "links", "summary"],
        onlyMainContent: false,
      }),
    });
    if (!res.ok) {
      console.warn("[Firecrawl] non-OK", res.status);
      return null;
    }
    const data = await res.json();
    const md = data.markdown ?? data.data?.markdown ?? "";
    const html = data.html ?? data.data?.html ?? "";
    const branding = data.branding ?? data.data?.branding;
    const metadata = data.metadata ?? data.data?.metadata;
    const links: string[] = data.links ?? data.data?.links ?? [];

    // Extract image URLs from markdown ![](url) and html <img src="">
    const imgFromMd: string[] = Array.from(md.matchAll(/!\[[^\]]*\]\(([^)\s]+)/g)).map((m: any) => m[1]);
    const imgFromHtml: string[] = Array.from(html.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)).map((m: any) => m[1]);
    const imgFromBranding: string[] = [];
    if (branding?.images) {
      Object.values(branding.images).forEach((v: any) => {
        if (typeof v === "string" && isHttpUrl(v)) imgFromBranding.push(v);
      });
    }

    const allImages = uniq([...imgFromBranding, ...imgFromMd, ...imgFromHtml])
      .filter(isHttpUrl)
      .filter((u) => !/svg|icon|favicon|logo-?small|sprite|placeholder|pixel|tracking|gtag|gif/i.test(u))
      .slice(0, 30);

    const logo = branding?.images?.logo
      || branding?.logo
      || metadata?.["og:logo"]
      || allImages.find((u) => /logo/i.test(u))
      || null;

    return {
      markdown: md,
      branding,
      metadata,
      links: links.slice(0, 50),
      images: allImages,
      logo,
      detectedSectorHint: detectSectorFromText(md),
    };
  } catch (e) {
    console.warn("[Firecrawl] error", e);
    return null;
  }
}

/* ─── DETECT SECTOR FROM SCRAPED TEXT ─── */
function detectSectorFromText(text: string): string | null {
  if (!text) return null;
  const t = text.toLowerCase();
  const checks: Array<[string, RegExp]> = [
    ["food", /\b(menu|antipasto|primo|secondo|pizza|pasta|ristorante|trattoria|osteria|chef|prenota un tavolo)\b/],
    ["bakery", /\b(pasticceria|forno|panetteria|torta|biscotti|lievito|brioche)\b/],
    ["beauty", /\b(estetica|manicure|pedicure|trattamento viso|epilazione|massaggio|salone di bellezza)\b/],
    ["ncc", /\b(noleggio con conducente|ncc|transfer|chauffeur|berlina)\b/],
    ["hospitality", /\b(camera|suite|prenota la camera|hotel|b&b|bed and breakfast|check-in)\b/],
    ["fitness", /\b(palestra|personal trainer|crossfit|workout|abbonamento mensile)\b/],
    ["healthcare", /\b(visita|ambulatorio|dottore|medico|dentista|clinica)\b/],
    ["beach", /\b(stabilimento balneare|ombrellone|lettino|cabina|spiaggia)\b/],
    ["plumber", /\b(idraulico|caldaia|impianto idrico|riparazione)\b/],
    ["electrician", /\b(elettricista|impianto elettrico|cablaggio)\b/],
    ["garage", /\b(officina|carrozzeria|tagliando|revisione auto)\b/],
    ["veterinary", /\b(veterinario|clinica veterinaria|pet|animali domestici)\b/],
    ["tattoo", /\b(tattoo|tatuaggio|piercing)\b/],
    ["photography", /\b(fotografo|fotografia|servizio fotografico|matrimonio fotografo)\b/],
    ["events", /\b(matrimonio|wedding planner|eventi|catering)\b/],
    ["retail", /\b(shop online|carrello|prodotti|acquista|vendita)\b/],
  ];
  for (const [sector, re] of checks) {
    if (re.test(t)) return sector;
  }
  return null;
}

/* ─── 2. GOOGLE PLACES PHOTOS (free, no API key required via Maps URL fallback) ─── */
// Skip if no Place ID available — too unreliable without paid API
async function googlePlacesPhotos(placeId?: string | null): Promise<string[]> {
  if (!placeId) return [];
  // Google Places photos require API key; we skip and rely on scraping/AI
  return [];
}

/* ─── 3. SCRAPE INSTAGRAM (light: og:image only) ─── */
async function instagramOgImage(url: string): Promise<string[]> {
  if (!url) return [];
  try {
    const handle = url.match(/instagram\.com\/([^\/?#]+)/)?.[1];
    if (!handle) return [];
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");
    if (!FIRECRAWL_API_KEY) return [];
    const res = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${FIRECRAWL_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({ url: `https://www.instagram.com/${handle}/`, formats: ["html"], onlyMainContent: false }),
    });
    if (!res.ok) return [];
    const data = await res.json();
    const html = data.html ?? data.data?.html ?? "";
    const imgs: string[] = Array.from(html.matchAll(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)/gi)).map((m: any) => m[1]);
    return imgs.filter(isHttpUrl).slice(0, 5);
  } catch { return []; }
}

/* ─── 4. AI BRAND KIT (tool-call) ─── */
async function aiEnrichBrand(lead: LeadInput, scraped: ScrapedAssets | null): Promise<{
  tagline: string;
  description: string;
  palette: BrandPalette;
  menu: Array<{ name: string; description: string; price: number; category: string; popular?: boolean }>;
  clients: Array<{ name: string; phone: string; email: string }>;
  reviews: Array<{ rating: number; customer_name: string; comment: string }>;
}> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
  const sectorLabel = lead.sectorLabel || lead.sector;
  const scrapedSummary = scraped?.markdown ? String(scraped.markdown).slice(0, 4000) : "";
  const scrapedBranding = scraped?.branding ? JSON.stringify(scraped.branding).slice(0, 1500) : "";

  const sysPrompt = `Sei un brand strategist senior. Riceverai dati REALI su un'attività italiana e devi produrre un brand kit COMPLETO e PROFESSIONALE per generare la sua demo digitale Empire AI.
RISPONDI SOLO con la chiamata della tool function "generate_brand_kit". Tutti i campi devono essere realistici, coerenti con il settore "${sectorLabel}" e con i dati forniti. Nessun campo placeholder.
PALETTE: se nei dati sito vedi colori reali, usali. Altrimenti scegli palette luxury coerente.
MENU/LISTINO: 14-18 voci specifiche del settore (food=piatti reali, beauty=trattamenti con prezzi, ncc=tratte con città, hotel=tipologie camera, fitness=corsi, healthcare=visite, retail=prodotti).`;

  const userPrompt = `ATTIVITÀ:
Nome: ${lead.businessName}
Settore: ${sectorLabel}
Città/Zona: ${lead.city ?? ""} ${lead.zone ?? ""}
Indirizzo: ${lead.fullAddress ?? ""}
Telefono: ${lead.phone ?? "—"} · Email: ${lead.email ?? "—"}
Sito: ${lead.website ?? "—"} · IG: ${lead.instagram ?? "—"}
Google rating: ${lead.googleRating ?? "—"} (${lead.googleReviews ?? 0} recensioni)

CONTENUTO SITO REALE:
${scrapedSummary || "(nessun sito disponibile, inferisci dal nome e settore — sii creativo ma realistico)"}

BRAND IDENTITY ESTRATTA DAL SITO:
${scrapedBranding || "(non disponibile)"}

Genera tutto in italiano, tono professionale ma caldo.`;

  const tool = {
    type: "function",
    function: {
      name: "generate_brand_kit",
      description: "Brand kit completo per demo",
      parameters: {
        type: "object",
        properties: {
          tagline: { type: "string", description: "Frase incisiva 6-10 parole" },
          description: { type: "string", description: "2 frasi presentazione" },
          palette: {
            type: "object",
            properties: {
              primary: { type: "string" },
              secondary: { type: "string" },
              bg: { type: "string" },
              accent: { type: "string" },
            },
            required: ["primary", "secondary", "bg", "accent"],
          },
          menu: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                description: { type: "string" },
                price: { type: "number" },
                category: { type: "string" },
                popular: { type: "boolean" },
              },
              required: ["name", "description", "price", "category"],
            },
          },
          clients: {
            type: "array",
            items: {
              type: "object",
              properties: {
                name: { type: "string" },
                phone: { type: "string" },
                email: { type: "string" },
              },
              required: ["name", "phone", "email"],
            },
          },
          reviews: {
            type: "array",
            items: {
              type: "object",
              properties: {
                rating: { type: "number" },
                customer_name: { type: "string" },
                comment: { type: "string" },
              },
              required: ["rating", "customer_name", "comment"],
            },
          },
        },
        required: ["tagline", "description", "palette", "menu", "clients", "reviews"],
      },
    },
  };

  const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
    method: "POST",
    headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: sysPrompt },
        { role: "user", content: userPrompt },
      ],
      tools: [tool],
      tool_choice: { type: "function", function: { name: "generate_brand_kit" } },
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI gateway error ${res.status}: ${t}`);
  }
  const data = await res.json();
  const args = data.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) throw new Error("AI brand kit: no tool_call returned");
  return JSON.parse(args);
}

/* ─── 5. AI IMAGE GENERATION FALLBACK (Nano Banana) ─── */
async function generateImageAI(prompt: string): Promise<string | null> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
  try {
    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [{ role: "user", content: prompt }],
        modalities: ["image", "text"],
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    const img = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return img || null;
  } catch (e) {
    console.warn("[ai-image] error", e);
    return null;
  }
}

/* ─── 6. UPLOAD DATA URL TO STORAGE → public URL ─── */
async function uploadDataUrl(supabase: any, bucket: string, path: string, dataUrl: string): Promise<string | null> {
  try {
    const m = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
    if (!m) return null;
    const mime = m[1];
    const b64 = m[2];
    const bytes = Uint8Array.from(atob(b64), (c) => c.charCodeAt(0));
    const ext = mime.split("/")[1].replace("+xml", "");
    const fullPath = `${path}.${ext}`;
    const { error } = await supabase.storage.from(bucket).upload(fullPath, bytes, {
      contentType: mime,
      upsert: true,
    });
    if (error) {
      console.warn("[upload] error", error.message);
      return null;
    }
    const { data: pub } = supabase.storage.from(bucket).getPublicUrl(fullPath);
    return pub.publicUrl;
  } catch (e) {
    console.warn("[upload] exception", e);
    return null;
  }
}

/* ─── 7. RESOLVE IMAGES: real first, AI fallback ─── */
async function resolveSectorImages(
  supabase: any,
  lead: LeadInput,
  scraped: ScrapedAssets | null,
  ig: string[],
  needHeroAndN: number,
  tenantId: string,
): Promise<{ hero: string | null; gallery: string[]; logo: string | null }> {
  const sector = lead.sector;
  const keywords = SECTOR_IMAGE_KEYWORDS[sector] || [];

  // Score scraped images by keyword relevance and size hint
  const scoreImage = (url: string): number => {
    let score = 0;
    const lower = url.toLowerCase();
    keywords.forEach((kw) => { if (lower.includes(kw)) score += 10; });
    if (/hero|cover|main|banner|header/i.test(lower)) score += 5;
    if (/large|full|original|2000|1920|1600|1200/i.test(lower)) score += 3;
    if (/thumb|small|150|200|icon/i.test(lower)) score -= 5;
    return score;
  };

  const scoredScrape = (scraped?.images || [])
    .map((u) => ({ url: u, score: scoreImage(u) }))
    .sort((a, b) => b.score - a.score)
    .map((x) => x.url);

  const allReal = uniq([...scoredScrape, ...ig]).slice(0, needHeroAndN + 2);

  let hero: string | null = allReal[0] || null;
  let gallery: string[] = allReal.slice(1, needHeroAndN + 1);

  // Need AI fallback?
  const need = needHeroAndN - gallery.length;
  if (!hero || need > 0) {
    const heroPrompt = `Photograph for ${lead.sectorLabel || sector} business "${lead.businessName}" in ${lead.city || "Italy"}. Editorial premium quality, natural light, no text or watermarks, 16:9. Hero shot.`;

    if (!hero) {
      const aiHero = await generateImageAI(heroPrompt);
      if (aiHero) {
        const uploaded = await uploadDataUrl(supabase, "business-assets", `demo/${tenantId}/hero`, aiHero);
        hero = uploaded || aiHero;
      }
    }
    // Generate up to 3 fallback gallery shots only
    const fallbacks = Math.min(need, 3);
    for (let i = 0; i < fallbacks; i++) {
      const p = `Premium photo for ${lead.sectorLabel || sector} business in ${lead.city || "Italy"}. Detail shot ${i + 1}, no text, editorial natural light.`;
      const img = await generateImageAI(p);
      if (img) {
        const uploaded = await uploadDataUrl(supabase, "business-assets", `demo/${tenantId}/gallery-${i}`, img);
        gallery.push(uploaded || img);
      }
    }
  }

  return { hero, gallery, logo: scraped?.logo || null };
}

/* ─── 8. PALETTE ENRICHMENT ─── */
function paletteFromStyleName(styleName: string, fallback: BrandPalette): BrandPalette {
  const n = (styleName || "").toLowerCase();
  if (n.includes("obsidian") || n.includes("noir") || n.includes("luxury-dark") || n.includes("dark"))
    return { primary: "#C8963E", secondary: "#1a1a1a", bg: "#0a0a0a", accent: "#d4af37" };
  if (n.includes("ivory") || n.includes("marble") || n.includes("blush"))
    return { primary: "#8b6f47", secondary: "#f5f0e6", bg: "#fffaf2", accent: "#c9a876" };
  if (n.includes("sage") || n.includes("verde") || n.includes("luxe"))
    return { primary: "#7d9b76", secondary: "#dce5d4", bg: "#f5f0e8", accent: "#a8c0a0" };
  if (n.includes("azzurro") || n.includes("azure") || n.includes("ocean"))
    return { primary: "#2d8a9e", secondary: "#5cbdb9", bg: "#f8fbfd", accent: "#0c2340" };
  if (n.includes("sakura") || n.includes("rose") || n.includes("rosegold"))
    return { primary: "#e88aab", secondary: "#fef0f5", bg: "#fffafd", accent: "#c45c7c" };
  return fallback;
}

/* ─── 9. CREATE FOOD TENANT ─── */
async function createFoodTenant(
  supabase: any,
  ownerId: string,
  lead: LeadInput,
  brand: any,
  palette: BrandPalette,
  images: { hero: string | null; gallery: string[]; logo: string | null },
  themeConfig: Record<string, any> = {},
): Promise<{ id: string; slug: string }> {
  const baseSlug = slugify(lead.businessName) || `demo-${Date.now()}`;
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  const { data: r, error } = await supabase
    .from("restaurants")
    .insert({
      name: lead.businessName,
      slug,
      owner_id: ownerId,
      tagline: brand.tagline,
      primary_color: palette.primary,
      logo_url: images.logo,
      phone: lead.phone || "+39 06 0000000",
      address: lead.fullAddress || lead.zone || "—",
      city: lead.city || "Roma",
      email: lead.email || `demo-${Date.now()}@empireaigroup.com`,
      is_active: true,
      policy_accepted: true,
      policy_accepted_at: new Date().toISOString(),
      setup_paid: true,
      business_type: "restaurant",
      theme_config: themeConfig,
    })
    .select("id, slug")
    .single();

  if (error) throw new Error(`restaurants insert: ${error.message}`);
  const restId = r.id;

  // Menu items con immagini distribuite
  if (Array.isArray(brand.menu) && brand.menu.length) {
    const items = brand.menu.slice(0, 18).map((m: any, i: number) => ({
      restaurant_id: restId,
      name: String(m.name).slice(0, 120),
      description: String(m.description || "").slice(0, 500),
      price: Number(m.price) || 0,
      category: String(m.category || "Altro").slice(0, 60),
      is_popular: !!m.popular,
      is_active: true,
      sort_order: i,
      image_url: images.gallery[i % Math.max(images.gallery.length, 1)] || null,
    }));
    await supabase.from("menu_items").insert(items);
  }

  // Tables
  const positions = [[15, 20], [38, 20], [62, 20], [85, 20], [15, 60], [38, 60], [62, 60], [85, 60]];
  await supabase.from("restaurant_tables").insert(
    positions.map(([x, y], i) => ({
      restaurant_id: restId,
      table_number: i + 1,
      seats: [2, 4, 4, 6, 2, 4, 8, 4][i],
      status: i === 2 || i === 4 ? "occupied" : "free",
      label: `Tavolo ${i + 1}`,
      pos_x: x,
      pos_y: y,
    })),
  );

  // Reviews
  if (Array.isArray(brand.reviews)) {
    await supabase.from("reviews").insert(
      brand.reviews.slice(0, 6).map((rv: any) => ({
        restaurant_id: restId,
        rating: Math.max(1, Math.min(5, Math.round(Number(rv.rating) || 5))),
        customer_name: String(rv.customer_name).slice(0, 80),
        comment: String(rv.comment).slice(0, 500),
        is_public: (Number(rv.rating) || 5) >= 4,
      })),
    );
  }

  // Sample orders
  const sampleItems = (brand.menu || []).slice(0, 3);
  if (sampleItems.length) {
    const orders = [
      { status: "preparing", table_number: 3, type: "table" },
      { status: "pending", table_number: null, type: "delivery" },
      { status: "ready", table_number: null, type: "takeaway" },
    ].map((o, i) => ({
      restaurant_id: restId,
      customer_name: brand.clients?.[i]?.name || "Cliente Demo",
      customer_phone: brand.clients?.[i]?.phone || "+39 333 0000000",
      order_type: o.type,
      table_number: o.table_number,
      status: o.status,
      total: sampleItems.reduce((s: number, it: any) => s + Number(it.price || 0), 0),
      items: sampleItems.map((it: any) => ({ name: it.name, qty: 1, price: it.price })),
    }));
    await supabase.from("orders").insert(orders);
  }

  // Reservations
  const today = new Date().toISOString().slice(0, 10);
  await supabase.from("reservations").insert([
    {
      restaurant_id: restId,
      customer_name: brand.clients?.[0]?.name || "Marco Rossi",
      customer_phone: brand.clients?.[0]?.phone || "+39 333 1234567",
      reservation_date: today,
      reservation_time: "20:30",
      guests: 4,
      status: "confirmed",
    },
    {
      restaurant_id: restId,
      customer_name: brand.clients?.[1]?.name || "Laura Bianchi",
      customer_phone: brand.clients?.[1]?.phone || "+39 334 9876543",
      reservation_date: today,
      reservation_time: "21:00",
      guests: 2,
      status: "pending",
    },
  ]);

  return { id: restId, slug: r.slug };
}

/* ─── 10. CREATE GENERIC TENANT (companies) ─── */
async function createCompanyTenant(
  supabase: any,
  ownerId: string,
  lead: LeadInput,
  brand: any,
  palette: BrandPalette,
  images: { hero: string | null; gallery: string[]; logo: string | null },
  themeConfig: Record<string, any> = {},
): Promise<{ id: string; slug: string }> {
  const baseSlug = slugify(lead.businessName);
  const slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  const allModules = [
    "dashboard", "clients", "appointments", "agents", "whatsapp",
    "reviews", "billing", "social", "automations", "settings",
  ];

  const { data: c, error } = await supabase
    .from("companies")
    .insert({
      name: lead.businessName,
      slug,
      industry: lead.sector,
      owner_id: ownerId,
      tagline: brand.tagline,
      primary_color: palette.primary,
      secondary_color: palette.secondary,
      logo_url: images.logo,
      address: lead.fullAddress,
      city: lead.city,
      phone: lead.phone,
      email: lead.email || `demo-${Date.now()}@empireaigroup.com`,
      modules_enabled: allModules,
      is_active: true,
      theme_config: themeConfig,
      social_links: {
        instagram: lead.instagram,
        facebook: lead.facebook,
        website: lead.website,
        gallery: images.gallery,
        hero: images.hero,
      },
    })
    .select("id, slug")
    .single();

  if (error) throw new Error(`companies insert: ${error.message}`);
  const cid = c.id;

  if (Array.isArray(brand.clients)) {
    await supabase.from("crm_clients").insert(
      brand.clients.slice(0, 8).map((cl: any) => ({
        company_id: cid,
        first_name: String(cl.name).split(" ")[0],
        last_name: String(cl.name).split(" ").slice(1).join(" ") || "",
        phone: cl.phone,
        email: cl.email,
        city: lead.city,
      })),
    );
  }

  const today = new Date();
  await supabase.from("appointments").insert(
    (brand.clients || []).slice(0, 4).map((cl: any, i: number) => {
      const dt = new Date(today.getTime() + i * 24 * 3600 * 1000);
      dt.setHours(10 + i * 2, 0, 0, 0);
      return {
        company_id: cid,
        client_name: cl.name,
        client_phone: cl.phone,
        scheduled_at: dt.toISOString(),
        service_name: brand.menu?.[i]?.name || "Servizio Demo",
        price: brand.menu?.[i]?.price || 50,
        status: i === 0 ? "confirmed" : "pending",
      };
    }),
  );

  await supabase.from("faq_items").insert([
    { company_id: cid, question: `Quali sono gli orari di ${lead.businessName}?`, answer: "Aperto Lunedì-Sabato dalle 9:00 alle 19:00.", sort_order: 1, is_active: true },
    { company_id: cid, question: "Come posso prenotare?", answer: "Dal sito o via WhatsApp 24/7.", sort_order: 2, is_active: true },
  ]);

  return { id: cid, slug: c.slug };
}

/* ─── 11. COPYWRITER AGENT — messaggio WhatsApp + script chiamata + obiezioni ─── */
async function generateOutreachKit(
  lead: LeadInput,
  brand: any,
  match: SubSectorMatch,
  previewUrl: string,
): Promise<{
  whatsappMessage: string;
  whatsappLink: string | null;
  callScript: { hook: string; pitch: string; close: string }[];
  objections: { objection: string; reply: string }[];
}> {
  const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
  const sectorLabel = lead.sectorLabel || lead.sector;
  const ownerHint = lead.businessName.split(" ")[0];

  // Default fallback content (always returned if AI fails)
  const fallbackWhatsApp = `Ciao ${ownerHint}! 👋

Ho preparato per ${lead.businessName} una demo gratuita del nuovo sistema gestionale + sito ordini online che usano già 200+ ${sectorLabel} in Italia.

✨ Guarda la tua versione personalizzata (foto del tuo locale, menu, colori): ${previewUrl}

Ti va se ne parliamo 5 minuti questa settimana? Risparmi 8h/settimana e raddoppi gli ordini.`;

  const fallbackScript = [
    { hook: `Buongiorno ${ownerHint}, sono in zona ${lead.city || "la sua città"} per ${lead.businessName} — ha 90 secondi?`, pitch: "Ho preparato gratis una demo del vostro sito ordini con menu e foto reali. Volevo mostrarvela.", close: "Le mando il link su WhatsApp così la vede dal telefono — qual è il numero migliore?" },
    { hook: `${ownerHint}, ho visto le recensioni di ${lead.businessName}: complimenti! Ho una proposta veloce.`, pitch: "I vostri concorrenti stanno passando agli ordini diretti senza commissioni. Vi ho preparato un esempio.", close: "5 minuti di video-call domani alle 15:00 le va bene?" },
    { hook: `Salve, chiamo perché ho una demo pronta per ${lead.businessName}.`, pitch: "Sito + cassa + WhatsApp + ordini, tutto in uno. Demo già caricata coi vostri dati.", close: "Le invio il link ora, può aprirlo mentre parliamo." },
  ];

  const fallbackObjections = [
    { objection: "Ho già un sito", reply: `Perfetto, ma il vostro sito non prende ordini diretti. Il nostro sì, e senza commissioni: a differenza di JustEat/Glovo che vi prendono il 30%, qui tenete tutto. Guardate la demo che vi ho preparato.` },
    { objection: "Non ho tempo", reply: `Capisco, è proprio per questo: il sistema gestisce ordini/prenotazioni/recensioni in automatico. Vi fa risparmiare 8h a settimana. La demo dura 5 minuti.` },
    { objection: "Costa troppo", reply: `90 giorni gratis, poi 79€/mese. Con 2 ordini in più al giorno è già rientrato. Glovo costa 30% di ogni ordine, qui paghi un canone fisso.` },
    { objection: "Devo pensarci", reply: `Certo. Le lascio aperta la demo personalizzata — la apre quando vuole, nessun impegno. Le chiamo venerdì per sapere com'è andata?` },
    { objection: "Non sono interessato", reply: `Capito ${ownerHint}. Posso farle una domanda? Quante ore al giorno passa al telefono per prenotazioni? Se più di 1, vale 5 minuti di confronto.` },
  ];

  if (!LOVABLE_API_KEY) {
    return {
      whatsappMessage: fallbackWhatsApp,
      whatsappLink: lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(fallbackWhatsApp)}` : null,
      callScript: fallbackScript,
      objections: fallbackObjections,
    };
  }

  try {
    const sys = `Sei un senior sales copywriter italiano per Empire AI Group (SaaS gestionale per ${sectorLabel}). Tono: caldo, diretto, professionale, mai venditoriale. Usa "tu", emoji con misura.`;
    const userPrompt = `Lead: ${lead.businessName} (${sectorLabel}) a ${lead.city || "Italia"}.
Tagline brand: "${brand.tagline}"
Demo personalizzata pronta: ${previewUrl}
Sub-settore: ${match.sub}

Genera un kit outreach professionale.`;

    const resp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: sys },
          { role: "user", content: userPrompt },
        ],
        tools: [{
          type: "function",
          function: {
            name: "outreach_kit",
            description: "Kit completo outreach: WhatsApp + script chiamata + obiezioni",
            parameters: {
              type: "object",
              properties: {
                whatsapp_message: { type: "string", description: "Messaggio WhatsApp personalizzato (max 600 caratteri, include il link demo)" },
                call_script: {
                  type: "array",
                  description: "3 varianti di apertura chiamata",
                  items: {
                    type: "object",
                    properties: {
                      hook: { type: "string", description: "Frase di apertura (max 25 parole)" },
                      pitch: { type: "string", description: "Pitch breve (max 30 parole)" },
                      close: { type: "string", description: "CTA finale (max 20 parole)" },
                    },
                    required: ["hook", "pitch", "close"],
                  },
                },
                objections: {
                  type: "array",
                  description: "5 obiezioni tipiche del settore con risposte",
                  items: {
                    type: "object",
                    properties: {
                      objection: { type: "string", description: "Obiezione tipica del titolare" },
                      reply: { type: "string", description: "Risposta convincente (max 50 parole)" },
                    },
                    required: ["objection", "reply"],
                  },
                },
              },
              required: ["whatsapp_message", "call_script", "objections"],
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "outreach_kit" } },
      }),
    });

    if (!resp.ok) {
      console.warn("[copywriter] AI gateway error", resp.status);
      throw new Error(`gateway ${resp.status}`);
    }

    const data = await resp.json();
    const args = data?.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
    if (!args) throw new Error("no tool call");
    const parsed = JSON.parse(args);

    const whatsappMessage = parsed.whatsapp_message || fallbackWhatsApp;
    return {
      whatsappMessage,
      whatsappLink: lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(whatsappMessage)}` : null,
      callScript: Array.isArray(parsed.call_script) && parsed.call_script.length ? parsed.call_script.slice(0, 3) : fallbackScript,
      objections: Array.isArray(parsed.objections) && parsed.objections.length ? parsed.objections.slice(0, 5) : fallbackObjections,
    };
  } catch (e) {
    console.warn("[copywriter] fallback used:", e);
    return {
      whatsappMessage: fallbackWhatsApp,
      whatsappLink: lead.phone ? `https://wa.me/${lead.phone.replace(/\D/g, "")}?text=${encodeURIComponent(fallbackWhatsApp)}` : null,
      callScript: fallbackScript,
      objections: fallbackObjections,
    };
  }
}

/* ─── 12. CLOSER AGENT — credenziali admin demo provvisorie ─── */
function generateAdminCredentials(lead: LeadInput): { email: string; password: string } {
  const slugBase = slugify(lead.businessName).replace(/-/g, "").slice(0, 12) || "demo";
  const stamp = Date.now().toString(36).slice(-4);
  const email = lead.email || `demo-${slugBase}-${stamp}@empireaigroup.com`;
  // Password leggibile ma sicura, da consegnare al lead
  const password = `Empire${slugBase.charAt(0).toUpperCase()}${slugBase.slice(1, 6)}!${stamp}`;
  return { email, password };
}

/* ─── MAIN HANDLER ─── */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const body = await req.json();
    const { lead: rawLead, preview, partnerId, originUrl } = body as {
      lead: LeadInput;
      preview?: PreviewSelection;
      partnerId: string;
      originUrl?: string;
    };

    if (!rawLead?.businessName || !rawLead?.sector) {
      return new Response(JSON.stringify({ error: "lead.businessName and lead.sector required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!partnerId) {
      return new Response(JSON.stringify({ error: "partnerId required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const lead = { ...rawLead };
    const startedAt = Date.now();

    // Track this pipeline run
    const { leadId } = body as { leadId?: string };
    let runId: string | null = null;
    const updateRun = async (patch: Record<string, any>) => {
      if (!runId) return;
      try {
        await supabase.from("demo_factory_runs").update(patch).eq("id", runId);
      } catch (e) {
        console.warn("[run-update] error", e);
      }
    };
    try {
      const { data: runRow } = await supabase
        .from("demo_factory_runs")
        .insert({
          lead_id: leadId || null,
          owner_id: partnerId,
          status: "running",
          agents_status: { scout: "running", analyst: "pending", curator: "pending", copywriter: "pending", builder: "pending", closer: "pending" },
        })
        .select("id")
        .single();
      runId = runRow?.id || null;
    } catch (e) {
      console.warn("[run-create] error", e);
    }

    // ─── AGENT 1: SCOUT — scrape sito + Instagram ───
    const [scraped, igImages] = await Promise.all([
      lead.website ? deepScrape(lead.website) : Promise.resolve(null),
      lead.instagram ? instagramOgImage(lead.instagram) : Promise.resolve([]),
    ]);
    if (scraped?.detectedSectorHint && lead.sector === "custom") {
      lead.sector = scraped.detectedSectorHint;
    }
    await updateRun({ agents_status: { scout: "done", analyst: "running", curator: "pending", copywriter: "pending", builder: "pending", closer: "pending" } });

    // ─── AGENT 2: ANALYST — AI brand kit + sub-settore detection ───
    const brand = await aiEnrichBrand(lead, scraped);
    const isFood = FOOD_SECTORS.has(lead.sector);
    const match = detectSubSector(lead, scraped?.markdown);
    await updateRun({
      agents_status: { scout: "done", analyst: "done", curator: "running", copywriter: "pending", builder: "pending", closer: "pending" },
      sub_sector: match.sub,
      template_variant: match.variant,
    });

    // ─── AGENT 3: CURATOR — palette + immagini + theme ───
    const aiPalette: BrandPalette = brand.palette;
    const scrapedColors = scraped?.branding?.colors;
    let palette: BrandPalette = aiPalette;
    if (scrapedColors?.primary) {
      palette = {
        primary: scrapedColors.primary,
        secondary: scrapedColors.secondary || aiPalette.secondary,
        bg: scrapedColors.background || aiPalette.bg,
        accent: scrapedColors.accent || aiPalette.accent,
      };
    } else if (preview?.styleName) {
      palette = paletteFromStyleName(preview.styleName, aiPalette);
    }
    const tenantUuid = crypto.randomUUID();
    const images = await resolveSectorImages(supabase, lead, scraped, igImages, 6, tenantUuid);
    const themeConfig: Record<string, any> = {
      template_variant: match.variant,
      sub_sector: match.sub,
      theme_hint: match.themeHint,
      hero_image: images.hero,
      hero_tagline: match.heroTagline || brand.tagline,
      auto_matched: true,
    };
    console.log(`[demo-factory] sector=${lead.sector} sub=${match.sub} variant=${match.variant} theme=${match.themeHint} brand=${lead.businessName}`);
    await updateRun({
      agents_status: { scout: "done", analyst: "done", curator: "done", copywriter: "pending", builder: "running", closer: "pending" },
      brand_kit: { tagline: brand.tagline, palette, hero: images.hero, logo: images.logo },
    });

    // Menu enrichment per template specifici
    if (isFood && match.sub === "pizzeria" && match.variant === "strapizzami") {
      const aiMenu: any[] = Array.isArray(brand.menu) ? brand.menu : [];
      const pizzaCount = aiMenu.filter(m => /pizz|margh|marinar|diavol|capric|calzon/i.test(`${m.name} ${m.category}`)).length;
      if (pizzaCount < 6) {
        brand.menu = [...DEFAULT_PIZZERIA_MENU];
        console.log("[demo-factory] pizzeria menu enriched with default preset");
      }
    }
    if (isFood && match.sub === "sushi" && (match.variant === "paperfish-sakura" || match.variant === "paperfish-dark")) {
      const aiMenu: any[] = Array.isArray(brand.menu) ? brand.menu : [];
      const sushiCount = aiMenu.filter(m => /sushi|sashimi|nigiri|maki|roll|ramen|gyoza|temaki|uramaki/i.test(`${m.name} ${m.category}`)).length;
      if (sushiCount < 6) {
        brand.menu = [...DEFAULT_SUSHI_MENU];
        console.log("[demo-factory] sushi menu enriched with default Paperfish preset");
      }
    }

    // ─── AGENT 4: BUILDER — crea tenant Supabase ───
    const tenant = isFood
      ? await createFoodTenant(supabase, partnerId, lead, brand, palette, images, themeConfig)
      : await createCompanyTenant(supabase, partnerId, lead, brand, palette, images, themeConfig);

    const origin = originUrl || "";
    const previewUrl = isFood ? `${origin}/r/${tenant.slug}` : `${origin}/b/${tenant.slug}`;
    const adminUrl = `${origin}/admin`;

    await updateRun({
      agents_status: { scout: "done", analyst: "done", curator: "done", copywriter: "running", builder: "done", closer: "running" },
      preview_url: previewUrl,
      admin_url: adminUrl,
    });

    // ─── AGENT 5: COPYWRITER — messaggio WhatsApp + script + obiezioni (parallel) ───
    // ─── AGENT 6: CLOSER — magic link + credenziali admin ───
    const [outreachKit, magicLinkResult] = await Promise.all([
      generateOutreachKit(lead, brand, match, previewUrl),
      (async () => {
        if (!lead.email) return null;
        try {
          const { data: linkData } = await supabase.auth.admin.generateLink({
            type: "magiclink",
            email: lead.email,
            options: { redirectTo: `${origin}/admin?demo=${tenant.id}` },
          });
          return linkData?.properties?.action_link || null;
        } catch (e) {
          console.warn("[magic-link] error", e);
          return null;
        }
      })(),
    ]);

    const credentials = generateAdminCredentials(lead);
    const durationMs = Date.now() - startedAt;

    await updateRun({
      status: "completed",
      agents_status: { scout: "done", analyst: "done", curator: "done", copywriter: "done", builder: "done", closer: "done" },
      whatsapp_message: outreachKit.whatsappMessage,
      whatsapp_link: outreachKit.whatsappLink,
      call_script: outreachKit.callScript,
      objections: outreachKit.objections,
      admin_email: credentials.email,
      admin_password: credentials.password,
      completed_at: new Date().toISOString(),
      duration_ms: durationMs,
    });

    return new Response(
      JSON.stringify({
        success: true,
        runId,
        tenant,
        previewUrl,
        adminUrl,
        magicLink: magicLinkResult,
        credentials,
        outreach: {
          whatsappMessage: outreachKit.whatsappMessage,
          whatsappLink: outreachKit.whatsappLink,
          callScript: outreachKit.callScript,
          objections: outreachKit.objections,
        },
        brand: {
          tagline: brand.tagline,
          description: brand.description,
          palette,
          menuCount: brand.menu?.length || 0,
          clientsCount: brand.clients?.length || 0,
        },
        autoMatch: {
          subSector: match.sub,
          templateVariant: match.variant,
          themeHint: match.themeHint,
          heroTagline: match.heroTagline,
        },
        scraped: {
          ok: !!scraped,
          hasBranding: !!scraped?.branding,
          imagesFound: scraped?.images?.length || 0,
          logoFound: !!scraped?.logo,
          detectedSector: scraped?.detectedSectorHint || null,
        },
        images: {
          hero: images.hero,
          gallery: images.gallery,
          logo: images.logo,
          totalReal: (scraped?.images?.length || 0) + (igImages?.length || 0),
        },
        durationMs,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("[generate-demo-from-lead] error", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
