import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// This function applies the 2% platform fee on restaurant PWA orders
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    const { orderId, restaurantId, orderTotal, customerEmail, successUrl, cancelUrl } = await req.json();

    if (!orderId || !restaurantId || !orderTotal) {
      throw new Error("Missing required fields");
    }

    // Get restaurant's Stripe Connect account
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("stripe_connect_account_id, name")
      .eq("id", restaurantId)
      .single();

    const totalCents = Math.round(orderTotal * 100);
    const feeCents = Math.round(totalCents * 0.02); // 2% fee

    // Create checkout with application_fee
    const sessionParams: any = {
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: { name: `Ordine — ${restaurant?.name || "Ristorante"}` },
          unit_amount: totalCents,
        },
        quantity: 1,
      }],
      payment_intent_data: {
        application_fee_amount: feeCents,
        metadata: { orderId, restaurantId, feePercent: "2" },
      },
      success_url: successUrl || `https://empire.app/r/checkout?success=true`,
      cancel_url: cancelUrl || `https://empire.app/r/checkout?cancelled=true`,
      metadata: { orderId, restaurantId },
    };

    // If restaurant has Stripe Connect, route payment to them
    if (restaurant?.stripe_connect_account_id) {
      sessionParams.payment_intent_data.transfer_data = {
        destination: restaurant.stripe_connect_account_id,
      };
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    // Log the platform fee
    await supabase.from("platform_fees" as any).insert({
      restaurant_id: restaurantId,
      order_id: orderId,
      order_total: orderTotal,
      fee_percent: 2,
      fee_amount: feeCents / 100,
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
