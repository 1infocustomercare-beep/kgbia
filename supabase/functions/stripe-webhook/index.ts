import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Master Stripe Webhook
 * Handles:
 * 1. checkout.session.completed — Setup fee paid (one-time or first installment)
 * 2. invoice.paid — Subsequent installment payments
 * 3. invoice.payment_failed — Mark overdue, pause partner payout
 * 
 * Split logic (Kevin Rule):
 * - €2,000 → Platform (STRIPE_MASTER_ACCOUNT_ID)  
 * - €997   → Partner (partner's stripe_connect_account_id from profiles)
 * - For installments: pro-rata split per payment
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) return new Response("Stripe not configured", { status: 500 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  const body = await req.text();

  let event: Stripe.Event;
  
  // If webhook secret is set, verify signature; otherwise parse raw (for testing)
  if (webhookSecret) {
    const sig = req.headers.get("stripe-signature")!;
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  } else {
    event = JSON.parse(body) as Stripe.Event;
  }

  console.log(`Stripe event received: ${event.type}`);

  // ─── SETUP FEE: checkout.session.completed ──────────────────────
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const meta = session.metadata || {};
    
    // Only handle setup_fee type
    if (meta.type !== "setup_fee" && meta.type !== "ai_tokens") {
      // Check if it's a PWA order (handled by stripe-platform-fee)
      return new Response(JSON.stringify({ received: true, skipped: "not setup_fee" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── AI Token Purchase ──
    if (meta.type === "ai_tokens") {
      const restaurantId = meta.restaurantId;
      if (restaurantId) {
        // Add 50 tokens
        const { data: current } = await supabase
          .from("ai_tokens")
          .select("balance")
          .eq("restaurant_id", restaurantId)
          .single();

        const newBalance = (current?.balance || 0) + 50;
        await supabase
          .from("ai_tokens")
          .update({ balance: newBalance })
          .eq("restaurant_id", restaurantId);

        await supabase.from("ai_token_history").insert({
          restaurant_id: restaurantId,
          action: "Acquisto Gold Credits (50 gettoni)",
          tokens: 50,
        });

        console.log(`AI tokens +50 for restaurant ${restaurantId}, new balance: ${newBalance}`);
      }
      return new Response(JSON.stringify({ received: true, type: "ai_tokens" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Setup Fee Processing ──
    const { restaurantId, partnerId, plan, transferGroup } = meta;

    if (!restaurantId) {
      return new Response(JSON.stringify({ received: true, skipped: "no restaurantId" }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Mark restaurant as paid
    await supabase.from("restaurants").update({ setup_paid: true }).eq("id", restaurantId);

    // Plan split calculations
    const planConfigs: Record<string, { total: number; installment: number; count: number; kevinPerInstallment: number; partnerPerInstallment: number }> = {
      full:  { total: 2997, installment: 2997, count: 1, kevinPerInstallment: 200000, partnerPerInstallment: 99700 },
      "3x":  { total: 3150, installment: 1050, count: 3, kevinPerInstallment: 66700,  partnerPerInstallment: 33233 },
      "6x":  { total: 3300, installment: 550,  count: 6, kevinPerInstallment: 33334,  partnerPerInstallment: 16566 },
    };
    const p = planConfigs[plan || "full"] || planConfigs.full;

    // Upsert payment record
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
      stripe_payment_intent_id: (session.payment_intent as string) || null,
      stripe_transfer_group: transferGroup || null,
      next_due_date: p.count > 1 
        ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0] 
        : null,
    } as any, { onConflict: "restaurant_id" });

    // ── TRANSFERS (Kevin Rule) ──
    const masterAccountId = Deno.env.get("STRIPE_MASTER_ACCOUNT_ID");

    // Transfer Kevin's share
    if (masterAccountId && transferGroup) {
      try {
        await stripe.transfers.create({
          amount: p.kevinPerInstallment,
          currency: "eur",
          destination: masterAccountId,
          transfer_group: transferGroup,
          metadata: { type: "platform_revenue", restaurantId, installment: "1" },
        });
        console.log(`Transfer €${(p.kevinPerInstallment / 100).toFixed(2)} to master account`);
      } catch (e: any) {
        console.error("Transfer to master failed:", e.message);
      }
    }

    // Transfer Partner's share (only if full payment or first installment)
    if (partnerId && transferGroup) {
      try {
        // Get partner's Stripe Connect account
        const { data: partnerProfile } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", partnerId)
          .single();

        // Check if partner has a connected account stored in user metadata
        // We store partner_stripe_account_id in the profiles table or a dedicated field
        const { data: partnerRestMembership } = await supabase
          .from("restaurant_memberships")
          .select("*")
          .eq("user_id", partnerId)
          .limit(1);

        // For now we look up the partner's Stripe Connect account from a custom query
        // Partners connect their Stripe account via the partner-connect-onboarding function
        const { data: partnerPaymentInfo } = await supabase
          .rpc("get_partner_stripe_account" as any, { partner_user_id: partnerId })
          .single();

        const partnerStripeAccount = (partnerPaymentInfo as any)?.stripe_account_id;

        if (partnerStripeAccount) {
          await stripe.transfers.create({
            amount: p.partnerPerInstallment,
            currency: "eur",
            destination: partnerStripeAccount,
            transfer_group: transferGroup,
            metadata: { type: "partner_commission", restaurantId, partnerId, installment: "1" },
          });
          console.log(`Transfer €${(p.partnerPerInstallment / 100).toFixed(2)} to partner ${partnerId}`);
          
          // Mark partner as paid if full payment
          if (plan === "full") {
            await supabase.from("restaurant_payments")
              .update({ partner_paid: true } as any)
              .eq("restaurant_id", restaurantId);
          }
        } else {
          console.log(`Partner ${partnerId} has no Stripe Connect account linked. Commission pending.`);
        }
      } catch (e: any) {
        console.error("Partner commission transfer error:", e.message);
      }
    }
  }

  // ─── INSTALLMENT: invoice.paid ──────────────────────
  if (event.type === "invoice.paid") {
    const invoice = event.data.object as Stripe.Invoice;
    const sub = invoice.subscription as string;
    if (!sub) {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const subscription = await stripe.subscriptions.retrieve(sub);
    const meta = subscription.metadata || {};
    const { restaurantId, partnerId, installmentsTotal, transferGroup } = meta;

    if (!restaurantId) {
      return new Response(JSON.stringify({ received: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

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

      // Pro-rata transfer for this installment
      const planConfigs: Record<string, { kevinPerInstallment: number; partnerPerInstallment: number }> = {
        "3x": { kevinPerInstallment: 66700, partnerPerInstallment: 33233 },
        "6x": { kevinPerInstallment: 33334, partnerPerInstallment: 16566 },
      };
      const planType = payment.plan_type || "3x";
      const pc = planConfigs[planType];

      if (pc && transferGroup) {
        const masterAccountId = Deno.env.get("STRIPE_MASTER_ACCOUNT_ID");
        if (masterAccountId) {
          try {
            await stripe.transfers.create({
              amount: pc.kevinPerInstallment,
              currency: "eur",
              destination: masterAccountId,
              transfer_group: transferGroup,
              metadata: { type: "platform_revenue", restaurantId, installment: String(newPaid) },
            });
          } catch (e: any) {
            console.error("Installment transfer to master failed:", e.message);
          }
        }

        // Partner transfer (only if not overdue)
        if (partnerId && !payment.is_overdue) {
          try {
            const { data: partnerPaymentInfo } = await supabase
              .rpc("get_partner_stripe_account" as any, { partner_user_id: partnerId })
              .single();
            const partnerStripeAccount = (partnerPaymentInfo as any)?.stripe_account_id;
            if (partnerStripeAccount) {
              await stripe.transfers.create({
                amount: pc.partnerPerInstallment,
                currency: "eur",
                destination: partnerStripeAccount,
                transfer_group: transferGroup,
                metadata: { type: "partner_commission", restaurantId, partnerId, installment: String(newPaid) },
              });
            }
          } catch (e: any) {
            console.error("Partner installment transfer error:", e.message);
          }
        }
      }

      // Cancel subscription if all installments paid
      if (isComplete) {
        try {
          await stripe.subscriptions.cancel(sub);
          console.log(`Subscription ${sub} cancelled — all ${total} installments paid`);
        } catch (e: any) {
          console.error("Failed to cancel subscription:", e.message);
        }
      }
    }
  }

  // ─── FAILED PAYMENT: invoice.payment_failed ──────────────────────
  if (event.type === "invoice.payment_failed") {
    const invoice = event.data.object as Stripe.Invoice;
    const sub = invoice.subscription as string;
    if (sub) {
      const subscription = await stripe.subscriptions.retrieve(sub);
      const { restaurantId } = subscription.metadata || {};

      if (restaurantId) {
        await supabase.from("restaurant_payments").update({
          is_overdue: true,
          partner_paid: false, // Pause partner payout
        } as any).eq("restaurant_id", restaurantId);

        console.log(`Payment failed for restaurant ${restaurantId} — marked overdue, partner payout paused`);
      }
    }
  }

  return new Response(JSON.stringify({ received: true }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
