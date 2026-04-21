// Lead Mockup Suite — genera 4 mockup iPhone (Home/Menu/Booking/Profile) con 3 motori
// Engine: 'react' (gratis, lato client) | 'nano_banana' (20 crediti) | 'nano_banana_pro' (40 crediti)
// Ritorna: suite_id + array screens [{type, title, image_url}]
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

type Engine = "react" | "nano_banana" | "nano_banana_pro";
type ScreenType = "home" | "menu" | "booking" | "profile" | "gallery" | "checkout";

interface ScreenConfig {
  type: ScreenType;
  title: string;
  prompt_hint?: string;
}

const DEFAULT_SCREENS: ScreenConfig[] = [
  { type: "home",    title: "Home",         prompt_hint: "schermata principale con hero foto, logo, CTA Prenota Ora, recensioni 5 stelle" },
  { type: "menu",    title: "Menu/Servizi", prompt_hint: "lista menù o servizi con foto piatti/prodotti, prezzi chiari, badge popolare" },
  { type: "booking", title: "Prenotazione", prompt_hint: "form prenotazione con calendario, selezione orario, numero persone, conferma" },
  { type: "profile", title: "Profilo",      prompt_hint: "profilo cliente con punti fedeltà, ordini passati, recensioni, badge VIP" },
];

// Mappa settore -> template variante consigliata
function suggestTemplate(sector: string | null | undefined): string {
  if (!sector) return "modern_dark";
  const s = sector.toLowerCase();
  if (/sushi|giapp|nikkei|asiatic/.test(s)) return "paperfish";
  if (/pizza|pizzer/.test(s)) return "strapizzami";
  if (/spiagg|beach|bagn|stabilim|lido/.test(s)) return "batey";
  if (/lusso|luxury|gourmet|stellato/.test(s)) return "luxury_gold";
  if (/casual|trattor|osteri|bistr/.test(s)) return "casual_warm";
  if (/zen|mindful|yoga|spa/.test(s)) return "minimal_zen";
  return "modern_dark";
}

async function generateAIImage(
  lovableKey: string,
  prompt: string,
  pro: boolean,
): Promise<string | null> {
  const model = pro ? "google/gemini-3-pro-image-preview" : "google/gemini-3.1-flash-image-preview";
  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    if (r.status === 429) throw new Error("rate_limited");
    if (r.status === 402) throw new Error("payment_required");
    throw new Error(`image_gen_error: ${r.status} ${txt}`);
  }
  const data = await r.json();
  return data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
}

async function uploadDataUrl(client: any, dataUrl: string, path: string): Promise<string | null> {
  try {
    const m = dataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!m) return null;
    const mime = m[1];
    const bytes = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
    const { error } = await client.storage.from("media-vault").upload(path, bytes, { contentType: mime, upsert: true });
    if (error) { console.error("upload err", error); return null; }
    const { data: pub } = client.storage.from("media-vault").getPublicUrl(path);
    return pub?.publicUrl ?? null;
  } catch (e) {
    console.error("uploadDataUrl", e);
    return null;
  }
}

function buildScreenPrompt(
  screen: ScreenConfig,
  business: { name: string; sector: string; city: string },
  templateVariant: string,
  pro: boolean,
): string {
  const styleMap: Record<string, string> = {
    paperfish: "DARK SAKURA LUXURY: nero obsidian #0E0B0F + sakura pink #E89BAE + oro caldo #C9A86A, font Cormorant Garamond serif elegante, atmosfera giapponese raffinata",
    strapizzami: "WARM CREAM TERRACOTTA: crema #F5EBD8 + terracotta #C84A2A + oro #B8893E, font handwritten + sans bold, atmosfera artigianale italiana calda",
    batey: "AZURE CARIBBEAN: deep ocean #08131F + azure #5CC8D9 + sand #E8D5A8 + coral #FF8966, font modern sans, atmosfera tropicale premium fresca",
    luxury_gold: "LUXURY GOLD: nero #1A1410 + oro #D4AF37 + bianco caldo, font serif premium, atmosfera Michelin star",
    modern_dark: "MODERN DARK 2026: slate #0F172A + accent #C8963E + ghiaccio bianco, font Inter pulito, atmosfera tech premium",
    casual_warm: "CASUAL WARM: panna #FAF6F0 + corallo #E07856 + verde salvia, font friendly rounded, atmosfera accogliente",
    minimal_zen: "MINIMAL ZEN: bianco #F8F8F8 + nero #222 + accenti grigi, font Helvetica essenziale, atmosfera giapponese minimalista",
  };
  const style = styleMap[templateVariant] || styleMap.modern_dark;
  const quality = pro ? "ULTRA-CINEMATOGRAFICO 8K, dettagli ossessivi, illuminazione studio, riflessi vetro perfetti" : "fotorealistico premium 4K, illuminazione naturale";

  return `Mockup smartphone iPhone 16 Pro fotorealistico mostrando schermata "${screen.title}" di app premium per ${business.sector} chiamato "${business.name}" a ${business.city}.

CONTENUTO SCHERMATA: ${screen.prompt_hint || screen.title}

STILE GRAFICO: ${style}

DETTAGLI UI:
- Status bar iPhone realistica (ora 9:41, batteria piena, segnale 5G)
- Dynamic Island visibile
- Bottom nav con 4-5 icone (Home, Menu, Prenota, Profilo, AI Chat)
- Bottone CTA principale grande, ben visibile
- Tipografia gerarchica chiara, leggibile
- Spaziature ariose, padding generoso
- Componenti card con angoli arrotondati 16px
- Ombre soft, depth visibile
- Microcopy in italiano

COMPOSIZIONE: vista frontale leggermente angolata 5° destra, sfondo gradiente neutro morbido in tinta col tema, ombra realistica sotto il telefono. ${quality}.

NESSUN TESTO INVENTATO IN INGLESE — solo italiano. NESSUN logo brand esterni (no Apple/Google).`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");

    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

    // Auth
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let userClient: any = null;
    if (authHeader) {
      userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await userClient.auth.getUser();
      userId = u?.user?.id ?? null;
    }
    if (!userId || !userClient) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const {
      business_name,
      business_sector = "",
      business_city = "",
      engine = "react" as Engine,
      template_variant: templateVariantInput,
      primary_color = "#C8963E",
      lead_id,
      preview_id,
      screens: screensInput,
    } = body;

    if (!business_name?.trim()) {
      return new Response(JSON.stringify({ error: "business_name_required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!["react", "nano_banana", "nano_banana_pro"].includes(engine)) {
      return new Response(JSON.stringify({ error: "invalid_engine" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const templateVariant = templateVariantInput || suggestTemplate(business_sector);
    const screens: ScreenConfig[] = (Array.isArray(screensInput) && screensInput.length > 0)
      ? screensInput.slice(0, 4).map((s: any) => ({
          type: s.type || "home",
          title: s.title || "Schermata",
          prompt_hint: s.prompt_hint || DEFAULT_SCREENS.find(d => d.type === s.type)?.prompt_hint,
        }))
      : DEFAULT_SCREENS;

    // Crediti (saltato per react = costo 0, ma logghiamo lo stesso)
    const creditAction = `mockup_suite_${engine}`;
    const { data: creditCheck } = await userClient.rpc("consume_seller_credits", {
      p_action: creditAction,
      p_metadata: { business_name, engine, template_variant: templateVariant, lead_id, preview_id },
    });
    if (!creditCheck?.success) {
      return new Response(JSON.stringify({ success: false, error: creditCheck?.error || "credit_error", details: creditCheck }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const creditsSpent = creditCheck?.credits_used ?? 0;
    const shareSlug = crypto.randomUUID().slice(0, 12);

    // Pre-insert suite con stato generating
    const { data: suite, error: insErr } = await adminClient
      .from("seller_mockup_suites")
      .insert({
        owner_id: userId,
        lead_id: lead_id || null,
        preview_id: preview_id || null,
        business_name,
        business_sector,
        business_city,
        template_variant: templateVariant,
        engine,
        primary_color,
        share_slug: shareSlug,
        screens: [],
        status: "generating",
        credits_spent: creditsSpent,
      })
      .select()
      .single();

    if (insErr || !suite) {
      console.error("insert suite err", insErr);
      return new Response(JSON.stringify({ success: false, error: "db_insert_failed", details: insErr?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ENGINE = REACT: nessuna AI image, ritorna config — il client renderizza via html2canvas
    if (engine === "react") {
      const reactScreens = screens.map(s => ({
        type: s.type,
        title: s.title,
        image_url: null,
        render_mode: "react" as const,
        template_variant: templateVariant,
      }));
      await adminClient
        .from("seller_mockup_suites")
        .update({ screens: reactScreens, status: "complete", generated_at: new Date().toISOString() })
        .eq("id", suite.id);

      return new Response(JSON.stringify({
        success: true,
        suite_id: suite.id,
        share_slug: shareSlug,
        engine,
        template_variant: templateVariant,
        screens: reactScreens,
        credits_spent: creditsSpent,
        message: "React render mode — il client genera gli screenshot dei template",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ENGINE = AI (nano_banana o nano_banana_pro)
    if (!LOVABLE_KEY) {
      await adminClient.from("seller_mockup_suites").update({ status: "error", error_message: "LOVABLE_API_KEY missing" }).eq("id", suite.id);
      return new Response(JSON.stringify({ success: false, error: "lovable_ai_not_configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pro = engine === "nano_banana_pro";
    const business = { name: business_name, sector: business_sector || "attività commerciale", city: business_city || "Italia" };

    try {
      // Genera 4 immagini in parallelo
      const imagePromises = screens.map(s => generateAIImage(LOVABLE_KEY, buildScreenPrompt(s, business, templateVariant, pro), pro));
      const dataUrls = await Promise.all(imagePromises);

      // Upload su storage
      const uploadPromises = dataUrls.map((du, i) =>
        du ? uploadDataUrl(adminClient, du, `mockup-suites/${userId}/${suite.id}/${i}-${screens[i].type}.png`) : Promise.resolve(null)
      );
      const publicUrls = await Promise.all(uploadPromises);

      const finalScreens = screens.map((s, i) => ({
        type: s.type,
        title: s.title,
        image_url: publicUrls[i],
        render_mode: "ai" as const,
        engine,
      }));

      await adminClient
        .from("seller_mockup_suites")
        .update({ screens: finalScreens, status: "complete", generated_at: new Date().toISOString() })
        .eq("id", suite.id);

      return new Response(JSON.stringify({
        success: true,
        suite_id: suite.id,
        share_slug: shareSlug,
        engine,
        template_variant: templateVariant,
        screens: finalScreens,
        credits_spent: creditsSpent,
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    } catch (e: any) {
      await adminClient.from("seller_mockup_suites").update({ status: "error", error_message: e.message }).eq("id", suite.id);
      if (e.message === "rate_limited") {
        return new Response(JSON.stringify({ success: false, error: "ai_rate_limited", suite_id: suite.id }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      if (e.message === "payment_required") {
        return new Response(JSON.stringify({ success: false, error: "ai_payment_required", suite_id: suite.id }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
      throw e;
    }
  } catch (e: any) {
    console.error("[mockup-suite] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
