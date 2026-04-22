// Edge Function: demo-site-generator
// Orchestratore Full Power: scrape → blueprint match → seed → deploy demo site
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface GenerateRequest {
  lead_id?: string;
  business_name: string;
  sector: string;
  sub_sector?: string;
  website_url?: string;
  template_variant?: string;
  blueprint_slug?: string;
  branding?: {
    primaryColor?: string | null;
    fontHead?: string | null;
    fontBody?: string | null;
    logoUrl?: string | null;
  };
  reuse_source_id?: string;
}

function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function genShortId(): string {
  return Math.random().toString(36).slice(2, 8);
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const startedAt = Date.now();

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const FIRECRAWL_API_KEY = Deno.env.get("FIRECRAWL_API_KEY");

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ success: false, error: "unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userClient = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: userData, error: userErr } = await userClient.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ success: false, error: "invalid_session" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const userId = userData.user.id;

    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);
    const body: GenerateRequest = await req.json();

    if (!body.business_name || !body.sector) {
      return new Response(
        JSON.stringify({ success: false, error: "missing_required_fields" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 1) Consume credits (25 for full power)
    const { data: creditResult, error: creditErr } = await adminClient.rpc(
      "consume_seller_credits_for",
      {
        p_user_id: userId,
        p_action: "demo_site_generate_full_power",
        p_metadata: { business_name: body.business_name, sector: body.sector },
      }
    );
    if (creditErr || !(creditResult as any)?.success) {
      return new Response(
        JSON.stringify({
          success: false,
          error: (creditResult as any)?.error || "credit_check_failed",
          details: creditResult,
        }),
        { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 2) Resolve blueprint
    const sectorLower = body.sector.toLowerCase();
    const { data: blueprintData } = await adminClient
      .from("demo_site_blueprints")
      .select("*")
      .or(`sector.eq.${sectorLower},sub_sectors.cs.{${sectorLower}}`)
      .eq("is_active", true)
      .limit(1)
      .maybeSingle();

    const blueprint = blueprintData;
    if (!blueprint) {
      return new Response(
        JSON.stringify({ success: false, error: "no_blueprint_for_sector", sector: body.sector }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 3) Build slug + insert "queued" record
    const publicSlug = `${slugify(body.business_name)}-${genShortId()}`;
    const adminEmail = `demo-${publicSlug}@empire.demo`;
    const adminPassword = `Demo${genShortId().toUpperCase()}!2026`;

    const variants = (blueprint.template_variants as any[]) || [];
    const chosenVariant =
      body.template_variant || (variants[0]?.key ?? "default");

    const brandingSnapshot = {
      primaryColor: body.branding?.primaryColor ?? blueprint.default_colors?.primary ?? "#C8963E",
      fontHead: body.branding?.fontHead ?? null,
      fontBody: body.branding?.fontBody ?? null,
      logoUrl: body.branding?.logoUrl ?? null,
      accent: blueprint.default_colors?.accent,
      background: blueprint.default_colors?.background,
    };

    const { data: insertedSite, error: insertErr } = await adminClient
      .from("demo_sites")
      .insert({
        owner_id: userId,
        lead_id: body.lead_id ?? null,
        blueprint_id: blueprint.id,
        template_variant: chosenVariant,
        business_name: body.business_name,
        sector: blueprint.sector,
        sub_sector: body.sub_sector ?? null,
        public_slug: publicSlug,
        status: "generating",
        branding_snapshot: brandingSnapshot,
        agents_activated: blueprint.required_agents,
        modules_enabled: blueprint.functional_modules,
        admin_email: adminEmail,
        admin_password: adminPassword,
        reuse_source_id: body.reuse_source_id ?? null,
      })
      .select()
      .single();

    if (insertErr || !insertedSite) {
      return new Response(
        JSON.stringify({ success: false, error: "insert_failed", details: insertErr }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // 4) Optional scrape via Firecrawl
    let scrapedData: any = {};
    if (body.website_url && FIRECRAWL_API_KEY) {
      try {
        const scrapeRes = await fetch("https://api.firecrawl.dev/v2/scrape", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${FIRECRAWL_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            url: body.website_url,
            formats: ["markdown", "branding"],
            onlyMainContent: true,
          }),
        });
        if (scrapeRes.ok) {
          const scrapeJson = await scrapeRes.json();
          scrapedData = {
            markdown: scrapeJson.markdown ?? scrapeJson.data?.markdown,
            branding: scrapeJson.branding ?? scrapeJson.data?.branding,
            metadata: scrapeJson.metadata ?? scrapeJson.data?.metadata,
          };
        }
      } catch (e) {
        console.warn("[demo-site-generator] scrape failed:", e);
      }
    }

    // 5) Deploy URLs (puntiamo al sistema /demo esistente con slug del demo site)
    const previewUrl = `${SUPABASE_URL.replace("https://", "https://").split(".supabase.co")[0]}/demo/${publicSlug}`;
    const finalPreviewUrl = `/demo/${publicSlug}`;
    const adminUrl = `/demo/${publicSlug}/admin`;

    const whatsappMessage = `Ciao! Ti ho preparato il sito demo della tua attività "${body.business_name}" 🚀\n\nGuardalo qui: ${finalPreviewUrl}\n\nÈ completamente funzionante: prenotazioni, ordini, agenti AI, automazioni. Fammi sapere cosa ne pensi!`;

    // 6) Update record to ready
    const duration = Date.now() - startedAt;
    const { data: finalSite, error: updateErr } = await adminClient
      .from("demo_sites")
      .update({
        status: "ready",
        scraped_data: scrapedData,
        preview_url: finalPreviewUrl,
        admin_url: adminUrl,
        whatsapp_message: whatsappMessage,
        whatsapp_link: `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`,
        generation_duration_ms: duration,
        generated_at: new Date().toISOString(),
      })
      .eq("id", insertedSite.id)
      .select()
      .single();

    if (updateErr) {
      console.error("[demo-site-generator] update failed:", updateErr);
    }

    return new Response(
      JSON.stringify({
        success: true,
        demo_site: finalSite ?? insertedSite,
        credits_used: (creditResult as any).credits_used,
        remaining_balance: (creditResult as any).remaining_balance,
        duration_ms: duration,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("[demo-site-generator] fatal:", err);
    return new Response(
      JSON.stringify({ success: false, error: err?.message ?? "unknown_error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
