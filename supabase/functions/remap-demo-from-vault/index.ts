// remap-demo-from-vault — RIUTILIZZO DEMO PROFESSIONALE (zero crediti)
//
// Prende una demo già generata (seller_demo_vault) e la "rimappa" su un nuovo lead:
// 1. Aggiorna il tenant (restaurants o companies) con contatti, nome esposto, città, indirizzo,
//    sito, instagram, email del NUOVO lead.
// 2. Ricalcola il messaggio WhatsApp + script + obiezioni con i dati del nuovo lead,
//    mantenendo brand/palette/template/immagini originali.
// 3. Salva il nuovo nome del lead nel theme_config (subtitle/contact) per coerenza.
// 4. Incrementa reuse_count nella vault.
// 5. Persiste i nuovi URL/credenziali sulla riga lead se leadId è fornito.
//
// NON consuma crediti seller_action_costs (azione "reuse_demo_from_vault" = 0).

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

interface NewLead {
  businessName: string;
  sector?: string;
  sectorLabel?: string;
  city?: string;
  zone?: string;
  fullAddress?: string;
  phone?: string | null;
  email?: string | null;
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
  googleRating?: number;
  googleReviews?: number;
  googleMapsUrl?: string | null;
}

interface Body {
  vaultId: string;
  newLead: NewLead;
  leadId?: string | null;
}

function buildOutreach(lead: NewLead, brand: any, previewUrl: string, adminUrl: string) {
  const name = lead.businessName;
  const city = lead.city || "";
  const tagline = brand?.tagline || `${name} digitale, completo, pronto.`;
  const phone = (lead.phone || "").replace(/\D/g, "");

  const whatsappMessage =
    `Ciao ${name} 👋\n\n` +
    `Ho preparato una demo del tuo nuovo sito + gestionale completo:\n` +
    `🌐 ${previewUrl}\n\n` +
    `${tagline}\n\n` +
    `Ti va se ti faccio vedere come funziona in 5 minuti?\n` +
    `— Empire AI Group`;

  const whatsappLink = phone
    ? `https://wa.me/${phone}?text=${encodeURIComponent(whatsappMessage)}`
    : null;

  const callScript = [
    {
      hook: `Ciao, sono di Empire AI Group. Ho preparato una demo gratuita del nuovo sito di ${name}${city ? ` a ${city}` : ""}.`,
      pitch: `Abbiamo già caricato i tuoi colori, le foto, il menu/listino e l'area gestionale. Posso mandartela su WhatsApp adesso?`,
      close: `Se ti piace, possiamo attivarla in 24 ore con 90 giorni di prova gratuita.`,
    },
  ];

  const objections = [
    {
      objection: "Ho già un sito",
      reply: `Lo so, ho visto. Il nostro non è solo un sito: include prenotazioni, ordini, CRM clienti, WhatsApp automatico e analytics. La demo è già pronta, ti rubo 3 minuti?`,
    },
    {
      objection: "Non mi interessa",
      reply: `Capisco. Ti lascio il link: ${previewUrl}. Dacci un'occhiata e se cambi idea ci sono.`,
    },
    {
      objection: "Quanto costa?",
      reply: `Parti da 79€/mese, primi 90 giorni gratis. Senza vincoli. Vuoi vedere la demo prima?`,
    },
  ];

  return { whatsappMessage, whatsappLink, callScript, objections };
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } });

    // Auth: usa il JWT dell'utente per identificare il proprietario
    const authHeader = req.headers.get("Authorization") || "";
    const userClient = createClient(supabaseUrl, anonKey, {
      global: { headers: { Authorization: authHeader } },
      auth: { persistSession: false },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) {
      return new Response(JSON.stringify({ error: "unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = (await req.json()) as Body;
    const { vaultId, newLead, leadId } = body;

    if (!vaultId || !newLead?.businessName) {
      return new Response(JSON.stringify({ error: "vaultId and newLead.businessName required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Recupera demo dalla vault (RLS-safe: filtra per owner)
    const { data: vaultRow, error: vaultErr } = await supabase
      .from("seller_demo_vault")
      .select("*")
      .eq("id", vaultId)
      .eq("owner_id", user.id)
      .maybeSingle();

    if (vaultErr || !vaultRow) {
      return new Response(JSON.stringify({ error: "vault_demo_not_found" }), {
        status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 2. Aggiorna tenant con dati del nuovo lead (mantieni brand/palette/immagini)
    const tenantId = vaultRow.tenant_id;
    const tenantKind = vaultRow.tenant_kind; // "restaurant" | "company"
    const fullAddr = newLead.fullAddress || [newLead.zone, newLead.city].filter(Boolean).join(", ");

    if (tenantId && tenantKind === "restaurant") {
      const { error: rErr } = await supabase
        .from("restaurants")
        .update({
          name: newLead.businessName,
          phone: newLead.phone || null,
          address: fullAddr || null,
          city: newLead.city || null,
          email: newLead.email || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tenantId);
      if (rErr) console.warn("[remap] restaurant update error", rErr);
    } else if (tenantId && tenantKind === "company") {
      const { error: cErr } = await supabase
        .from("companies")
        .update({
          name: newLead.businessName,
          phone: newLead.phone || null,
          address: fullAddr || null,
          city: newLead.city || null,
          email: newLead.email || null,
          updated_at: new Date().toISOString(),
        })
        .eq("id", tenantId);
      if (cErr) console.warn("[remap] company update error", cErr);

      // Aggiorna theme_config preservando brand
      try {
        const { data: existing } = await supabase
          .from("companies")
          .select("theme_config")
          .eq("id", tenantId)
          .maybeSingle();
        const tc = (existing?.theme_config as any) || {};
        const newTheme = {
          ...tc,
          remapped_at: new Date().toISOString(),
          remapped_for_lead: newLead.businessName,
          contact: {
            phone: newLead.phone || tc?.contact?.phone || null,
            email: newLead.email || tc?.contact?.email || null,
            address: fullAddr || tc?.contact?.address || null,
            instagram: newLead.instagram || tc?.contact?.instagram || null,
          },
        };
        await supabase.from("companies").update({ theme_config: newTheme }).eq("id", tenantId);
      } catch (e) {
        console.warn("[remap] theme_config update error", e);
      }
    }

    // 3. Ricostruisci URL preview/admin con lo stesso slug ma origin nuovo (richiesta lato client)
    const origin = req.headers.get("origin") || req.headers.get("referer")?.replace(/\/$/, "") || "";
    const previewUrl = origin && vaultRow.tenant_slug
      ? `${origin}/b/${vaultRow.tenant_slug}`
      : vaultRow.preview_url;
    const adminUrl = origin && vaultRow.tenant_slug
      ? `${origin}/demo-admin/${vaultRow.tenant_slug}?variant=${encodeURIComponent(vaultRow.template_variant)}&sub=${encodeURIComponent(vaultRow.sub_sector || "")}`
      : vaultRow.admin_url;

    // 4. Ricalcola outreach kit con dati del nuovo lead
    const brand = vaultRow.brand_payload || {};
    const outreach = buildOutreach(newLead, brand, previewUrl, adminUrl);

    // 5. Incrementa reuse_count atomico
    try {
      await userClient.rpc("touch_demo_vault_reuse" as any, {
        p_vault_id: vaultId,
        p_lead_name: newLead.businessName,
      });
    } catch (e) {
      console.warn("[remap] touch_demo_vault_reuse error", e);
    }

    // 6. Persisti su lead row se leadId fornito
    if (leadId) {
      try {
        await supabase.from("leads").update({
          demo_run_id: null, // riutilizzo, non un nuovo run
          demo_preview_url: previewUrl,
          demo_admin_url: adminUrl,
          demo_template_variant: vaultRow.template_variant,
          demo_sub_sector: vaultRow.sub_sector,
          demo_generated_at: new Date().toISOString(),
          demo_whatsapp_message: outreach.whatsappMessage,
          // Admin credentials intentionally NOT persisted on leads (security):
          // they live only in demo_sites/seller_demo_vault scoped by owner_id.

          demo_auto_status: "reused",
        }).eq("id", leadId);
      } catch (e) {
        console.warn("[remap] lead persist error", e);
      }
    }

    // 7. Risposta in formato compatibile DemoFactoryResult
    return new Response(JSON.stringify({
      success: true,
      reused: true,
      vaultId,
      tenant: { id: tenantId, slug: vaultRow.tenant_slug },
      previewUrl,
      adminUrl,
      magicLink: vaultRow.magic_link || null,
      credentials: vaultRow.admin_email ? { email: vaultRow.admin_email, password: vaultRow.admin_password } : undefined,
      outreach,
      brand: {
        tagline: brand.tagline || "",
        description: brand.description || "",
        palette: brand.palette || {},
        menuCount: brand.menuCount || 0,
        clientsCount: brand.clientsCount || 0,
      },
      autoMatch: {
        subSector: vaultRow.sub_sector,
        templateVariant: vaultRow.template_variant,
        themeHint: vaultRow.theme_hint,
      },
      images: vaultRow.images_payload || {},
      scraped: { ok: true, hasBranding: true, reused: true },
      reuseCount: (vaultRow.reuse_count || 0) + 1,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("[remap-demo-from-vault] error", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
