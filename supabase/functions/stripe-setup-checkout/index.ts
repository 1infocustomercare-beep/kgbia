import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Empire Setup Checkout — Creates Stripe Checkout sessions for the €1,997 setup fee.
 * Supports: full (€1,997), 3x (€699/mo), 6x (€366/mo)
 * Uses transfer_group to link the 800/997/200 split done in the webhook.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const { plan, restaurantId, partnerId, customerEmail, successUrl, cancelUrl } = await req.json();

    if (!restaurantId || !customerEmail) {
      throw new Error("Missing restaurantId or customerEmail");
    }

    const plans: Record<string, { amount: number; installments: number; label: string }> = {
      full: { amount: 199700, installments: 1, label: "Empire Setup — Pagamento Unico €1.997" },
      "3x": { amount: 69900, installments: 3, label: "Empire Setup — 3 Rate da €699/mese" },
      "6x": { amount: 36600, installments: 6, label: "Empire Setup — 6 Rate da €366/mese" },
    };

    const selectedPlan = plans[plan] || plans.full;
    const transferGroup = `setup_${restaurantId}_${Date.now()}`;

    const metadata = {
      restaurantId,
      partnerId: partnerId || "",
      plan: plan || "full",
      transferGroup,
      type: "setup_fee",
    };

    if (selectedPlan.installments === 1) {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: customerEmail,
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: { name: selectedPlan.label },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        }],
        payment_intent_data: {
          transfer_group: transferGroup,
          metadata,
        },
        success_url: successUrl || "https://empire.app/dashboard?setup=success",
        cancel_url: cancelUrl || "https://empire.app/dashboard?setup=cancelled",
        metadata,
      });

      return new Response(JSON.stringify({ url: session.url, transferGroup }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } else {
      // Subscription for installments
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "subscription",
        customer_email: customerEmail,
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: { name: selectedPlan.label },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month", interval_count: 1 },
          },
          quantity: 1,
        }],
        subscription_data: {
          metadata: { ...metadata, installmentsTotal: String(selectedPlan.installments) },
        },
        success_url: successUrl || "https://empire.app/dashboard?setup=success",
        cancel_url: cancelUrl || "https://empire.app/dashboard?setup=cancelled",
        metadata,
      });

      return new Response(JSON.stringify({ url: session.url, transferGroup }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
