import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey || !webhookSecret) {
    return new Response("Webhook not configured", { status: 500 });
  }

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err: any) {
    return new Response(`Webhook Error: ${err.message}`, { status: 400 });
  }

  // Handle checkout.session.completed — Setup fee paid
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const { restaurantId, partnerId, plan, transferGroup } = session.metadata || {};

    if (restaurantId) {
      // Mark restaurant as paid
      await supabase.from("restaurants").update({ setup_paid: true }).eq("id", restaurantId);

      // Create/update payment record
      const plans: Record<string, { total: number; installment: number; count: number }> = {
        full: { total: 2997, installment: 2997, count: 1 },
        "3x": { total: 3150, installment: 1050, count: 3 },
        "6x": { total: 3300, installment: 550, count: 6 },
      };
      const p = plans[plan || "full"] || plans.full;

      await supabase.from("restaurant_payments").upsert({
        restaurant_id: restaurantId,
        plan_type: plan || "full",
        total_amount: p.total,
        installment_amount: p.installment,
        installments_total: p.count,
        installments_paid: 1,
        amount_paid: p.installment,
        partner_id: partnerId || null,
        partner_commission: 997,
        partner_paid: plan === "full",
        stripe_payment_intent_id: session.payment_intent as string,
        stripe_transfer_group: transferGroup,
        next_due_date: p.count > 1 ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] : null,
      } as any, { onConflict: "restaurant_id" });

      // Transfer €2000 to platform owner
      if (session.payment_intent) {
        try {
          const masterAccount = Deno.env.get("STRIPE_MASTER_ACCOUNT_ID");
          if (masterAccount) {
            await stripe.transfers.create({
              amount: 200000, // €2000
              currency: "eur",
              destination: masterAccount,
              transfer_group: transferGroup,
              metadata: { type: "platform_fee", restaurantId },
            });
          }
        } catch (e) {
          console.error("Transfer to master failed:", e);
        }

        // Transfer €997 commission to partner (only if full payment)
        if (partnerId && plan === "full") {
          try {
            const { data: partnerData } = await supabase
              .from("profiles")
              .select("*")
              .eq("user_id", partnerId)
              .single();

            // Partner would need a Stripe connected account — store partner_stripe_account_id
            // For now, mark as pending
          } catch (e) {
            console.error("Partner commission error:", e);
          }
        }
      }
    }
  }

  // Handle invoice.paid — Installment payments
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const sub = invoice.subscription as string;
    if (sub) {
      const subscription = await stripe.subscriptions.retrieve(sub);
      const { restaurantId, partnerId, installmentsTotal, transferGroup } = subscription.metadata || {};

      if (restaurantId) {
        const { data: payment } = await supabase
          .from("restaurant_payments")
          .select("*")
          .eq("restaurant_id", restaurantId)
          .single();

        if (payment) {
          const newPaid = (payment.installments_paid || 0) + 1;
          const total = parseInt(installmentsTotal || "1");
          const isComplete = newPaid >= total;

          await supabase.from("restaurant_payments").update({
            installments_paid: newPaid,
            amount_paid: (payment.amount_paid || 0) + (payment.installment_amount || 0),
            is_overdue: false,
            next_due_date: isComplete ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            partner_paid: isComplete,
          } as any).eq("restaurant_id", restaurantId);

          // Cancel subscription if all installments paid
          if (isComplete) {
            await stripe.subscriptions.cancel(sub);
          }
        }
      }
    }
  }

  // Handle invoice.payment_failed — Pause partner payout
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const sub = invoice.subscription as string;
    if (sub) {
      const subscription = await stripe.subscriptions.retrieve(sub);
      const { restaurantId } = subscription.metadata || {};

      if (restaurantId) {
        await supabase.from("restaurant_payments").update({
          is_overdue: true,
          partner_paid: false,
        } as any).eq("restaurant_id", restaurantId);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
