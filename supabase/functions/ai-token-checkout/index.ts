import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * AI Gold Credits Purchase — Multi-tier pricing
 * 50 credits  → €15   (€0.30/credit)
 * 150 credits → €39   (€0.26/credit — save 13%)
 * 500 credits → €99   (€0.20/credit — save 34%)
 * Revenue goes 100% to the Platform Account (no splits).
 * On successful payment, the webhook adds tokens to the restaurant's balance.
 */

const VALID_PACKS: Record<number, { price: number; label: string }> = {
  50:  { price: 1500,  label: "Starter — 50 Gettoni IA" },
  150: { price: 3900,  label: "Pro — 150 Gettoni IA" },
  500: { price: 9900,  label: "Business — 500 Gettoni IA" },
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const { restaurantId, customerEmail, credits, priceEurCents, successUrl, cancelUrl } = await req.json();

    if (!restaurantId) throw new Error("Missing restaurantId");

    // Determine pack — support legacy (no credits param = 50)
    const requestedCredits = credits || 50;
    const pack = VALID_PACKS[requestedCredits];
    if (!pack) throw new Error(`Invalid credits amount: ${requestedCredits}`);

    // Use server-side price, ignore client priceEurCents for security
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      customer_email: customerEmail || undefined,
      line_items: [{
        price_data: {
          currency: "eur",
          product_data: {
            name: `Empire AI Gold Credits — ${pack.label}`,
            description: "Crediti IA per Menu Creator, Foto AI, Traduzioni automatiche",
          },
          unit_amount: pack.price,
        },
        quantity: 1,
      }],
      metadata: {
        type: "ai_tokens",
        restaurantId,
        credits: String(requestedCredits),
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