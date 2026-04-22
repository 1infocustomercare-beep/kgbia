import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const VALID_PACKS: Record<number, { price: number; label: string }> = {
  50: { price: 1500, label: "Starter — 50 Gettoni IA" },
  150: { price: 3900, label: "Pro — 150 Gettoni IA" },
  500: { price: 9900, label: "Business — 500 Gettoni IA" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // ── Auth guard ──
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const authClient = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });
    const {
      data: { user: authUser },
      error: authErr,
    } = await authClient.auth.getUser();
    if (authErr || !authUser) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const { restaurantId, customerEmail, credits, successUrl, cancelUrl } = await req.json();

    if (!restaurantId) throw new Error("Missing restaurantId");

    // Authorization: caller must own (or be a member of) the restaurant
    const supabase = createClient(Deno.env.get("SUPABASE_URL")!, Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!);

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, owner_id")
      .eq("id", restaurantId)
      .maybeSingle();

    if (!restaurant) {
      return new Response(JSON.stringify({ error: "Restaurant not found" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let allowed = restaurant.owner_id === authUser.id;
    if (!allowed) {
      const { data: membership } = await supabase
        .from("restaurant_memberships")
        .select("id")
        .eq("restaurant_id", restaurantId)
        .eq("user_id", authUser.id)
        .maybeSingle();
      allowed = !!membership;
    }
    if (!allowed) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const requestedCredits = credits || 50;
    const pack = VALID_PACKS[requestedCredits];
    if (!pack) throw new Error(`Invalid credits amount: ${requestedCredits}`);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || authUser.email || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: `Empire AI Gold Credits — ${pack.label}`,
              description: "Crediti IA per Menu Creator, Foto AI, Traduzioni automatiche",
            },
            unit_amount: pack.price,
          },
          quantity: 1,
        },
      ],
      metadata: {
        type: "ai_tokens",
        restaurantId,
        userId: authUser.id,
        credits: String(requestedCredits),
      },
      success_url: successUrl || "https://empire.app/dashboard?tokens=success",
      cancel_url: cancelUrl || "https://empire.app/dashboard?tokens=cancelled",
    });

    // Pre-log the pending purchase so we can render it in dashboards immediately
    await supabase
      .from("ai_token_purchases")
      .upsert(
        {
          restaurant_id: restaurantId,
          buyer_user_id: authUser.id,
          credits: requestedCredits,
          amount_cents: pack.price,
          currency: "eur",
          stripe_session_id: session.id,
          status: "pending",
        } as any,
        { onConflict: "stripe_session_id" },
      );

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("AI token checkout error:", err.message);
    return new Response(JSON.stringify({ error: "An error occurred" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
