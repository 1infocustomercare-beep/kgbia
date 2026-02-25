import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * AI Gold Credits Purchase — 50 credits for €15.00
 * Revenue goes 100% to the Platform Account (no splits).
 * On successful payment, the webhook adds 50 tokens to the restaurant's balance.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const { restaurantId, customerEmail, successUrl, cancelUrl } = await req.json();

    if (!restaurantId) throw new Error("Missing restaurantId");

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: "Empire AI Gold Credits — 50 Gettoni",
            description: "Crediti IA per Menu Creator, Foto AI, Traduzioni automatiche",
          },
          unit_amount: 1500, // €15.00
        },
        quantity: 1,
      }],
      metadata: {
        type: "ai_tokens",
        restaurantId,
        credits: "50",
      },
      success_url: successUrl || "https://empire.app/dashboard?tokens=success",
      cancel_url: cancelUrl || "https://empire.app/dashboard?tokens=cancelled",
    });

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("AI token checkout error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
