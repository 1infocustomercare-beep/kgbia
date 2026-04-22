// ═══════════════════════════════════════════════════════════════════════
// setup-checkout
// Crea una sessione Stripe Checkout per il pagamento iniziale del setup
// (€1.997 / €2.997 a seconda del piano), con opzione rate 1x / 3x / 6x.
//
// Triggered by: src/pages/SetupCheckoutPage.tsx (post-signup, pre-dashboard)
//
// Flow:
//   1. Verifica utente autenticato
//   2. Trova restaurant_id O company_id dell'utente (non ancora pagato)
//   3. Crea sessione Stripe con metadata { type: "setup_fee", entity_type, entity_id, plan }
//   4. Logga in setup_payment_log come "pending"
//   5. Ritorna checkout_url
//
// Webhook stripe-webhook gestisce il completamento → setup_paid=true.
// ═══════════════════════════════════════════════════════════════════════

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// Plan pricing — must mirror landing pricing cards
const PLAN_CONFIGS: Record<
  string,
  { name: string; total_cents_1x: number; total_cents_3x: number; total_cents_6x: number; description: string }
> = {
  digital_start: {
    name: "Digital Start",
    total_cents_1x: 199700, // €1.997
    total_cents_3x: 199900, // €666 × 3 ≈ €1.998 (TAN 0%)
    total_cents_6x: 199800, // €333 × 6 = €1.998
    description: "App White Label completa + Menu/Catalogo QR + Dashboard Analytics",
  },
  smart_ia: {
    name: "Smart IA",
    total_cents_1x: 299700, // €2.997
    total_cents_3x: 329700, // €1.099 × 3
    total_cents_6x: 329400, // €549 × 6
    description: "Tutto Digital Start + 5 agenti AI + WhatsApp operativo + Onboarding guidato",
  },
  full_empire: {
    name: "Full Empire",
    total_cents_1x: 499700,
    total_cents_3x: 549700,
    total_cents_6x: 549600,
    description: "Suite completa Empire + agenti AI premium + voice + supporto dedicato",
  },
  // Backward compat aliases
  essential: {
    name: "Digital Start",
    total_cents_1x: 199700,
    total_cents_3x: 199900,
    total_cents_6x: 199800,
    description: "App White Label completa + Menu/Catalogo QR + Dashboard Analytics",
  },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) {
      return new Response(
        JSON.stringify({ error: "Stripe non configurato. Contatta l'amministratore." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Authenticate user ────────────────────────────────────────
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Authorization header missing" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAuth = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: userData, error: userErr } = await supabaseAuth.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Utente non autenticato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const user = userData.user;

    // ── Parse body ───────────────────────────────────────────────
    const body = await req.json().catch(() => ({}));
    const planRaw: string = String(body.plan || "digital_start").toLowerCase();
    const installments: number = [1, 3, 6].includes(Number(body.installments))
      ? Number(body.installments)
      : 1;

    const planKey = planRaw in PLAN_CONFIGS ? planRaw : "digital_start";
    const planCfg = PLAN_CONFIGS[planKey];

    const amountCents =
      installments === 1
        ? planCfg.total_cents_1x
        : installments === 3
        ? Math.round(planCfg.total_cents_3x / 3)
        : Math.round(planCfg.total_cents_6x / 6);

    // ── Find user's unpaid entity (restaurant or company) ────────
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    let entityType: "restaurant" | "company" | null = null;
    let entityId: string | null = null;

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, setup_paid")
      .eq("owner_id", user.id)
      .eq("setup_paid", false)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (restaurant) {
      entityType = "restaurant";
      entityId = restaurant.id;
    } else {
      const { data: company } = await supabase
        .from("companies")
        .select("id, setup_paid")
        .eq("owner_id", user.id)
        .eq("setup_paid", false)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (company) {
        entityType = "company";
        entityId = company.id;
      }
    }

    if (!entityType || !entityId) {
      return new Response(
        JSON.stringify({
          error: "no_pending_entity",
          message:
            "Non risulta nessun account in attesa di pagamento. Forse il setup è già stato pagato?",
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── Reuse a recent pending session for the same entity+plan+installments ──
    // Prevents duplicate Stripe sessions on double clicks / page refreshes.
    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const { data: pendingLog } = await supabase
      .from("setup_payment_log")
      .select("stripe_session_id, plan, installments, amount_cents, created_at")
      .eq("user_id", user.id)
      .eq("entity_id", entityId)
      .eq("status", "pending")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (
      pendingLog?.stripe_session_id &&
      pendingLog.plan === planKey &&
      pendingLog.installments === installments &&
      pendingLog.amount_cents === amountCents
    ) {
      try {
        const prior = await stripe.checkout.sessions.retrieve(pendingLog.stripe_session_id);
        if (prior?.url && prior.status === "open") {
          return new Response(
            JSON.stringify({
              checkout_url: prior.url,
              session_id: prior.id,
              amount_cents: amountCents,
              plan: planKey,
              installments,
              reused: true,
            }),
            { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      } catch {
        // expired/invalid → fall through to create a new one
      }
    }

    // ── Find referral partner (if signup_role had referral_id) ───
    let partnerId: string | null = null;
    const referralId = (user.user_metadata?.referral_id as string | undefined) ?? null;
    if (referralId) {
      // referral_id may be a partner user_id
      const { data: partnerRole } = await supabase
        .from("user_roles")
        .select("user_id")
        .in("role", ["partner", "team_leader"])
        .eq("user_id", referralId)
        .maybeSingle();
      if (partnerRole) partnerId = partnerRole.user_id;
    }

    // ── Create Stripe checkout session ───────────────────────────
    // (stripe client already instantiated above for session-reuse check)

    const transferGroup = `setup_${entityId}_${Date.now()}`;
    const planLabel =
      installments === 1
        ? "full"
        : installments === 3
        ? "3x"
        : "6x";

    const origin = req.headers.get("origin") || "https://empireia.lovable.app";

    const session = await stripe.checkout.sessions.create({
      mode: installments === 1 ? "payment" : "subscription",
      payment_method_types: ["card"],
      customer_email: user.email,
      success_url: `${origin}/checkout-setup/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/checkout-setup?cancelled=1`,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `${planCfg.name} — Setup Empire AI`,
              description: planCfg.description,
            },
            unit_amount: amountCents,
            ...(installments > 1
              ? { recurring: { interval: "month" as const } }
              : {}),
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "setup_fee",
        entity_type: entityType,
        entity_id: entityId,
        restaurantId: entityType === "restaurant" ? entityId : "",
        companyId: entityType === "company" ? entityId : "",
        userId: user.id,
        plan: planLabel, // "full" | "3x" | "6x" — matches stripe-webhook PLAN_CONFIGS
        plan_key: planKey, // "digital_start" | "smart_ia" | ...
        installments: String(installments),
        partnerId: partnerId || "",
        transferGroup,
      },
    });

    // ── Log as pending in setup_payment_log ──────────────────────
    await supabase.from("setup_payment_log").insert({
      user_id: user.id,
      entity_type: entityType,
      entity_id: entityId,
      plan: planKey,
      installments,
      amount_cents: amountCents,
      currency: "eur",
      stripe_session_id: session.id,
      status: "pending",
      metadata: {
        plan_label: planLabel,
        partnerId: partnerId,
        referralId,
      },
    });

    // ── Update entity with selected plan info ────────────────────
    if (entityType === "restaurant") {
      await supabase
        .from("restaurants")
        .update({
          selected_plan: planKey,
          selected_installments: installments,
          stripe_setup_session_id: session.id,
        })
        .eq("id", entityId);
    } else {
      await supabase
        .from("companies")
        .update({
          selected_plan: planKey,
          selected_installments: installments,
          stripe_setup_session_id: session.id,
        })
        .eq("id", entityId);
    }

    return new Response(
      JSON.stringify({
        checkout_url: session.url,
        session_id: session.id,
        amount_cents: amountCents,
        plan: planKey,
        installments,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    console.error("setup-checkout error:", err);
    return new Response(
      JSON.stringify({ error: err.message || "Errore interno" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
