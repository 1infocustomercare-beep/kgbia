import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * 2% Platform Fee on Restaurant PWA Orders
 *
 * - Each call creates a Stripe Checkout session for ONE order_id.
 * - We log the pending purchase in `pwa_orders_log` keyed on stripe_session_id (UNIQUE).
 *   If a session for this order_id already exists in 'pending' state and the URL is still
 *   valid, we return it instead of creating a duplicate.
 * - The webhook (stripe-webhook) flips the row to 'paid' on checkout.session.completed.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const { orderId, restaurantId, orderTotal, customerEmail, successUrl, cancelUrl } = await req.json();

    if (!orderId || !restaurantId || !orderTotal) {
      throw new Error("Missing required fields: orderId, restaurantId, orderTotal");
    }

    // Best-effort: identify the logged-in customer (if any) so the order is linked to them
    let customerUserId: string | null = null;
    const authHeader = req.headers.get("Authorization");
    if (authHeader) {
      try {
        const supabaseAuth = createClient(
          Deno.env.get("SUPABASE_URL")!,
          Deno.env.get("SUPABASE_ANON_KEY")!,
          { global: { headers: { Authorization: authHeader } } },
        );
        const { data: u } = await supabaseAuth.auth.getUser();
        customerUserId = u?.user?.id ?? null;
      } catch {
        // anonymous purchase is allowed
      }
    }

    // Reuse an existing pending session for this order_id (prevent duplicates on double-clicks)
    const { data: existing } = await supabase
      .from("pwa_orders_log")
      .select("id, stripe_session_id, status")
      .eq("order_id", orderId)
      .maybeSingle();

    if (existing?.status === "paid") {
      return new Response(
        JSON.stringify({ error: "order_already_paid", orderId }),
        { status: 409, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    if (existing?.stripe_session_id) {
      try {
        const prior = await stripe.checkout.sessions.retrieve(existing.stripe_session_id);
        if (prior?.url && prior.status === "open") {
          return new Response(JSON.stringify({ url: prior.url, sessionId: prior.id, reused: true }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
      } catch {
        // session expired/invalid → fall through to create a new one
      }
    }

    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("stripe_connect_account_id, name")
      .eq("id", restaurantId)
      .single();

    const totalCents = Math.round(orderTotal * 100);
    const feeCents = Math.round(totalCents * 0.02); // 2% platform fee

    const sessionParams: any = {
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: { name: `Ordine — ${restaurant?.name || "Ristorante"}` },
            unit_amount: totalCents,
          },
          quantity: 1,
        },
      ],
      payment_intent_data: {
        application_fee_amount: feeCents,
        metadata: { orderId, restaurantId, feePercent: "2", type: "pwa_order" },
      },
      success_url: successUrl || `https://empire.app/r/checkout?success=true`,
      cancel_url: cancelUrl || `https://empire.app/r/checkout?cancelled=true`,
      metadata: {
        orderId,
        restaurantId,
        type: "pwa_order",
        userId: customerUserId || "",
      },
    };

    if (restaurant?.stripe_connect_account_id) {
      sessionParams.payment_intent_data.transfer_data = {
        destination: restaurant.stripe_connect_account_id,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Idempotent log of the pending order ↔ session pairing
    await supabase
      .from("pwa_orders_log")
      .upsert(
        {
          order_id: orderId,
          restaurant_id: restaurantId,
          customer_user_id: customerUserId,
          customer_email: customerEmail || null,
          amount_cents: totalCents,
          fee_cents: feeCents,
          currency: "eur",
          stripe_session_id: session.id,
          status: "pending",
          metadata: { reused: false },
        } as any,
        { onConflict: "order_id" },
      );

    // Best-effort legacy log (kept for backward compat with reporting)
    await supabase.from("platform_fees").insert({
      restaurant_id: restaurantId,
      order_id: orderId,
      order_total: orderTotal,
      fee_percent: 2,
      fee_amount: feeCents / 100,
    } as any);

    return new Response(JSON.stringify({ url: session.url, sessionId: session.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Platform fee error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
