// generate-demo-from-lead — One-shot demo factory
// 1. Scrapes the prospect website (Firecrawl deep)
// 2. Enriches with Google Places + Lovable AI for missing fields
// 3. Creates a tenant (companies/restaurants) with brand identity from the lead
// 4. Seeds menu/items, clients, orders, reviews, agents (full "wow demo")
// 5. Returns preview URL + admin URL + magic link the partner can send

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const FOOD_SECTORS = new Set(["food", "bakery", "gelateria", "wine_bar", "catering", "pizzeria", "ristoration"]);

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
}

interface PreviewSelection {
  brandName: string;
  styleName: string;
  imageUrl: string;
  sectorId: string;
}

interface BrandPalette {
  primary: string;
  secondary: string;
  bg: string;
  accent: string;
}

const slugify = (s: string) =>
  s.toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);

/* ─── 1. FIRECRAWL DEEP SCRAPE ─── */
async function deepScrape(url: string): Promise<{
  markdown?: string;
  branding?: any;
  metadata?: any;
} | null> {
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
        formats: ["markdown", "branding", "summary"],
        onlyMainContent: true,
      }),
    });
    if (!res.ok) {
      console.warn("[Firecrawl] non-OK", res.status);
      return null;
    }
    const data = await res.json();
    return {
      markdown: data.markdown ?? data.data?.markdown,
      branding: data.branding ?? data.data?.branding,
      metadata: data.metadata ?? data.data?.metadata,
    };
  } catch (e) {
    console.warn("[Firecrawl] error", e);
    return null;
  }
}

/* ─── 2. AI BRAND ENRICHMENT ─── */
async function aiEnrichBrand(lead: LeadInput, scraped: any): Promise<{
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

  const sysPrompt = `Sei un brand strategist senior. Riceverai dati reali su un'attività italiana e devi produrre un brand kit COMPLETO e PROFESSIONALE per generare la sua demo digitale Empire AI.
RISPONDI SOLO con la chiamata della tool function "generate_brand_kit". Tutti i campi devono essere realistici, coerenti con il settore "${sectorLabel}" e con i dati forniti. Nessun campo placeholder.`;

  const userPrompt = `ATTIVITÀ:
Nome: ${lead.businessName}
Settore: ${sectorLabel}
Città/Zona: ${lead.city ?? ""} ${lead.zone ?? ""}
Indirizzo: ${lead.fullAddress ?? ""}
Telefono: ${lead.phone ?? "—"} · Email: ${lead.email ?? "—"}
Sito: ${lead.website ?? "—"} · IG: ${lead.instagram ?? "—"}
Google rating: ${lead.googleRating ?? "—"} (${lead.googleReviews ?? 0} recensioni)

CONTENUTO SITO REALE (estratto):
${scrapedSummary || "(nessun sito disponibile, inferisci dal nome e settore)"}

BRAND IDENTITY ESTRATTA:
${scrapedBranding || "(non disponibile, scegli palette luxury coerente con il settore)"}

GENERA un brand kit completo e plausibile, con menu/listino di 12-16 voci coerenti con il settore (per food=piatti, beauty=trattamenti, ncc=tratte, etc.), 6 clienti CRM con nomi italiani, 5 recensioni reali plausibili (4-5 stelle), descrizione di 2 frasi e tagline incisivo.`;

  const tool = {
    type: "function",
    function: {
      name: "generate_brand_kit",
      description: "Brand kit completo per demo",
      parameters: {
        type: "object",
        properties: {
          tagline: { type: "string" },
          description: { type: "string" },
          palette: {
            type: "object",
            properties: {
              primary: { type: "string", description: "hex color principale (es. #C8963E)" },
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
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "Content-Type": "application/json",
    },
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

/* ─── 3. PALETTE FROM PREVIEW STYLE NAME ─── */
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

/* ─── 4. CREATE FOOD TENANT (restaurants table) ─── */
async function createFoodTenant(
  supabase: any,
  ownerId: string,
  lead: LeadInput,
  brand: any,
  palette: BrandPalette,
): Promise<{ id: string; slug: string }> {
  const baseSlug = slugify(lead.businessName) || `demo-${Date.now()}`;
  let slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  const { data: r, error } = await supabase
    .from("restaurants")
    .insert({
      name: lead.businessName,
      slug,
      owner_id: ownerId,
      tagline: brand.tagline,
      primary_color: palette.primary,
      phone: lead.phone || "+39 06 0000000",
      address: lead.fullAddress || lead.zone || "—",
      city: lead.city || "Roma",
      email: lead.email || `demo-${Date.now()}@empireaigroup.com`,
      is_active: true,
      policy_accepted: true,
      policy_accepted_at: new Date().toISOString(),
      setup_paid: true,
      business_type: "restaurant",
    })
    .select("id, slug")
    .single();

  if (error) throw new Error(`restaurants insert: ${error.message}`);

  const restId = r.id;

  // Menu items
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
    }));
    await supabase.from("menu_items").insert(items);
  }

  // Tables (8)
  const positions = [
    [15, 20], [38, 20], [62, 20], [85, 20],
    [15, 60], [38, 60], [62, 60], [85, 60],
  ];
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

  // Sample orders for the "live" feel
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

/* ─── 5. CREATE GENERIC SECTOR TENANT (companies table) ─── */
async function createCompanyTenant(
  supabase: any,
  ownerId: string,
  lead: LeadInput,
  brand: any,
  palette: BrandPalette,
): Promise<{ id: string; slug: string }> {
  const baseSlug = slugify(lead.businessName);
  let slug = `${baseSlug}-${Math.random().toString(36).slice(2, 6)}`;

  // Sector-specific module set (wow demo: enable everything sensible)
  const allModules = [
    "dashboard", "clients", "appointments", "agents", "whatsapp", "reviews",
    "billing", "social", "automations", "settings",
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
      address: lead.fullAddress,
      city: lead.city,
      phone: lead.phone,
      email: lead.email || `demo-${Date.now()}@empireaigroup.com`,
      modules_enabled: allModules,
      is_active: true,
    })
    .select("id, slug")
    .single();

  if (error) throw new Error(`companies insert: ${error.message}`);

  const cid = c.id;

  // CRM clients
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

  // Sample appointments
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

  // FAQ
  await supabase.from("faq_items").insert([
    { company_id: cid, question: `Quali sono gli orari di ${lead.businessName}?`, answer: "Aperto Lunedì-Sabato dalle 9:00 alle 19:00.", sort_order: 1, is_active: true },
    { company_id: cid, question: "Come posso prenotare?", answer: "Dal sito o via WhatsApp 24/7.", sort_order: 2, is_active: true },
  ]);

  return { id: cid, slug: c.slug };
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
    const { lead, preview, partnerId, originUrl } = body as {
      lead: LeadInput;
      preview: PreviewSelection;
      partnerId: string;
      originUrl?: string;
    };

    if (!lead?.businessName || !lead?.sector) {
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

    // 1. Scrape
    const scraped = lead.website ? await deepScrape(lead.website) : null;

    // 2. AI brand kit
    const brand = await aiEnrichBrand(lead, scraped);

    // 3. Palette: prefer scraped → preview style → AI fallback
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

    // 4. Tenant
    const isFood = FOOD_SECTORS.has(lead.sector);
    const tenant = isFood
      ? await createFoodTenant(supabase, partnerId, lead, brand, palette)
      : await createCompanyTenant(supabase, partnerId, lead, brand, palette);

    // 5. Magic link for the lead (if email present)
    let magicLink: string | null = null;
    if (lead.email) {
      const { data: linkData } = await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: lead.email,
        options: {
          redirectTo: `${originUrl || ""}/admin?demo=${tenant.id}`,
        },
      });
      magicLink = linkData?.properties?.action_link || null;
    }

    // 6. URLs
    const origin = originUrl || "";
    const previewUrl = isFood ? `${origin}/r/${tenant.slug}` : `${origin}/b/${tenant.slug}`;
    const adminUrl = `${origin}/admin`;

    return new Response(
      JSON.stringify({
        success: true,
        tenant,
        previewUrl,
        adminUrl,
        magicLink,
        brand: {
          tagline: brand.tagline,
          description: brand.description,
          palette,
          menuCount: brand.menu?.length || 0,
          clientsCount: brand.clients?.length || 0,
        },
        scraped: {
          ok: !!scraped,
          hasBranding: !!scraped?.branding,
        },
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
