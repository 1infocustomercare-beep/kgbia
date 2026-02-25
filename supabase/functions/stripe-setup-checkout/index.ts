import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("Stripe not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
    const { plan, restaurantId, partnerId, customerEmail, successUrl, cancelUrl } = await req.json();

    // Price logic: 2997 full, 1050x3, 550x6
    const plans: Record<string, { amount: number; installments: number }> = {
      full: { amount: 299700, installments: 1 },
      "3x": { amount: 105000, installments: 3 },
      "6x": { amount: 55000, installments: 6 },
    };

    const selectedPlan = plans[plan] || plans.full;
    const transferGroup = `setup_${restaurantId}_${Date.now()}`;

    if (selectedPlan.installments === 1) {
      // One-time payment
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        customer_email: customerEmail,
        line_items: [{
          price_data: {
            currency: "eur",
            product_data: { name: "Empire Setup Fee — Full Payment" },
            unit_amount: selectedPlan.amount,
          },
          quantity: 1,
        }],
        payment_intent_data: {
          transfer_group: transferGroup,
          metadata: { restaurantId, partnerId: partnerId || "", plan },
        },
        success_url: successUrl || "https://empire.app/dashboard?setup=success",
        cancel_url: cancelUrl || "https://empire.app/dashboard?setup=cancelled",
        metadata: { restaurantId, partnerId: partnerId || "", plan, transferGroup },
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
            product_data: { name: `Empire Setup — ${selectedPlan.installments}x Rate` },
            unit_amount: selectedPlan.amount,
            recurring: { interval: "month", interval_count: 1 },
          },
          quantity: 1,
        }],
        subscription_data: {
          metadata: { restaurantId, partnerId: partnerId || "", plan, transferGroup, installmentsTotal: String(selectedPlan.installments) },
        },
        success_url: successUrl || "https://empire.app/dashboard?setup=success",
        cancel_url: cancelUrl || "https://empire.app/dashboard?setup=cancelled",
        metadata: { restaurantId, partnerId: partnerId || "", plan, transferGroup },
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
