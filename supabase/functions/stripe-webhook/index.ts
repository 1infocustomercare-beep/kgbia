import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Master Stripe Webhook (idempotent + tenant-linked)
 *
 * Handles:
 *  1. checkout.session.completed
 *      - type=setup_fee     → mark restaurant/company setup_paid + record partner sale + transfers
 *      - type=ai_tokens     → credit AI tokens once per session
 *      - type=pwa_order     → mark pwa_orders_log + orders.status = 'paid'
 *  2. invoice.paid             → next installment of setup subscription
 *  3. invoice.payment_failed   → mark overdue / pause partner payout
 *
 * IDEMPOTENCY: every event.id is registered in `stripe_webhook_events` via
 * `claim_stripe_event` RPC. If the event was already claimed we exit immediately
 * with 200 OK (Stripe stops retrying).
 *
 * NEVER throw 500 on already-handled events: that would cause Stripe retries
 * and risk doubling work.
 */

function ok(extra: Record<string, unknown> = {}) {
  return new Response(JSON.stringify({ received: true, ...extra }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET");
  if (!stripeKey) return new Response("Stripe not configured", { status: 500 });

  const stripe = new Stripe(stripeKey, { apiVersion: "2023-10-16" });
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const body = await req.text();

  let event: Stripe.Event;

  if (webhookSecret) {
    const sig = req.headers.get("stripe-signature");
    if (!sig) {
      console.error("Missing stripe-signature header");
      return new Response("Missing signature", { status: 400 });
    }
    try {
      event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
    } catch (err: any) {
      console.error("Webhook signature verification failed:", err.message);
      return new Response(`Webhook Error: ${err.message}`, { status: 400 });
    }
  } else {
    // Dev / test path: parse raw. NEVER use this in prod without setting STRIPE_WEBHOOK_SECRET.
    try {
      event = JSON.parse(body) as Stripe.Event;
    } catch {
      return new Response("Invalid JSON body", { status: 400 });
    }
  }

  // ─── IDEMPOTENCY GUARD ───────────────────────────────────────────
  // Stripe retries failed webhook deliveries. We must process each event_id only once.
  const eventId = event.id;
  const { data: claimed, error: claimErr } = await supabase.rpc("claim_stripe_event", {
    p_event_id: eventId,
    p_event_type: event.type,
    p_livemode: !!event.livemode,
    p_summary: { object: (event.data?.object as any)?.object ?? null },
  });

  if (claimErr) {
    console.error("[stripe-webhook] claim_stripe_event failed:", claimErr);
    // Fail-open: continue processing rather than block, but we won't have idempotency.
  } else if (claimed === false) {
    console.log(`[stripe-webhook] Duplicate event ignored: ${eventId} (${event.type})`);
    return ok({ duplicate: true, event_id: eventId });
  }

  console.log(`[stripe-webhook] Processing ${event.type} (${eventId})`);

  try {
    // ─── checkout.session.completed ─────────────────────────────────
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;
      const meta = (session.metadata || {}) as Record<string, string>;
      const sessionType = meta.type;

      // ── PWA Order (restaurant customer payment) ──
      if (sessionType === "pwa_order") {
        const orderId = meta.orderId;
        const restaurantId = meta.restaurantId;
        if (orderId && restaurantId) {
          const paidAt = new Date().toISOString();

          await supabase
            .from("pwa_orders_log")
            .update({
              status: "paid",
              paid_at: paidAt,
              stripe_payment_intent_id: (session.payment_intent as string) || null,
            })
            .eq("stripe_session_id", session.id);

          // Reflect on the actual order row, but only flip pending → paid (no override of finalized states).
          await supabase
            .from("orders")
            .update({
              payment_status: "paid",
              status: "confirmed",
            } as any)
            .eq("id", orderId)
            .in("payment_status" as any, ["pending", null as any]);
        }
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: null });
        return ok({ type: "pwa_order", orderId });
      }

      // ── AI Token Purchase ──
      if (sessionType === "ai_tokens") {
        const restaurantId = meta.restaurantId;
        const buyerUserId = meta.userId || null;
        const creditsToAdd = parseInt(meta.credits || "50", 10);

        if (restaurantId && creditsToAdd > 0) {
          // Idempotent log: if a row for this session already exists in 'paid' state, skip credit grant.
          const { data: existingPurchase } = await supabase
            .from("ai_token_purchases")
            .select("id, status")
            .eq("stripe_session_id", session.id)
            .maybeSingle();

          const alreadyPaid = existingPurchase?.status === "paid";

          if (!alreadyPaid) {
            // Read current balance, increment, log
            const { data: current } = await supabase
              .from("ai_tokens")
              .select("balance")
              .eq("restaurant_id", restaurantId)
              .maybeSingle();

            const newBalance = (current?.balance || 0) + creditsToAdd;

            // Upsert (handles edge-case where ai_tokens row was never created)
            await supabase
              .from("ai_tokens")
              .upsert(
                { restaurant_id: restaurantId, balance: newBalance, updated_at: new Date().toISOString() } as any,
                { onConflict: "restaurant_id" },
              );

            await supabase.from("ai_token_history").insert({
              restaurant_id: restaurantId,
              action: `Acquisto Gold Credits (${creditsToAdd} gettoni)`,
              tokens: creditsToAdd,
            });

            // Upsert purchase log keyed on session
            await supabase
              .from("ai_token_purchases")
              .upsert(
                {
                  restaurant_id: restaurantId,
                  buyer_user_id: buyerUserId,
                  credits: creditsToAdd,
                  amount_cents: (session.amount_total as number) || 0,
                  currency: (session.currency as string) || "eur",
                  stripe_session_id: session.id,
                  stripe_payment_intent_id: (session.payment_intent as string) || null,
                  status: "paid",
                  paid_at: new Date().toISOString(),
                } as any,
                { onConflict: "stripe_session_id" },
              );

            console.log(`[stripe-webhook] AI tokens +${creditsToAdd} → restaurant ${restaurantId} (new balance ${newBalance})`);
          } else {
            console.log(`[stripe-webhook] AI token session ${session.id} already paid, skipping credit grant`);
          }
        }
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: null });
        return ok({ type: "ai_tokens" });
      }

      // ── Setup Fee (must be explicit) ──
      if (sessionType !== "setup_fee") {
        console.log(`[stripe-webhook] checkout.session.completed with no/unknown type=${sessionType}, skipping`);
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "skipped", p_error: null });
        return ok({ skipped: "not handled type", type: sessionType ?? null });
      }

      const { restaurantId, companyId, entity_type, entity_id, partnerId, plan, transferGroup, userId } = meta;

      // ── Branch A: Company-based setup (NCC, beach, beauty, etc.) ──
      if ((entity_type === "company" || (companyId && !restaurantId)) && (companyId || entity_id)) {
        const cid = companyId || entity_id;

        // Only flip setup_paid=true if not already paid (avoids overwriting setup_paid_at on retries)
        const { data: companyRow } = await supabase
          .from("companies")
          .select("id, setup_paid, owner_id")
          .eq("id", cid)
          .maybeSingle();

        if (companyRow && companyRow.setup_paid !== true) {
          await supabase
            .from("companies")
            .update({
              setup_paid: true,
              setup_paid_at: new Date().toISOString(),
            })
            .eq("id", cid);
        }

        if (session.id) {
          await supabase
            .from("setup_payment_log")
            .update({
              status: "paid",
              paid_at: new Date().toISOString(),
              stripe_payment_intent_id: (session.payment_intent as string) || null,
            })
            .eq("stripe_session_id", session.id);
        }

        console.log(`[stripe-webhook] Company ${cid} setup_paid via session ${session.id}`);

        // Record partner sale (only on the first transition, controlled by the setup_payment_log row not yet 'paid' before this update)
        if (partnerId && userId && companyRow && companyRow.setup_paid !== true) {
          await supabase.from("partner_sales").insert({
            partner_id: partnerId,
            sale_amount: ((session.amount_total as number) || 0) / 100,
            partner_commission: 997,
            team_leader_override: 0,
            sale_month: new Date().toISOString().slice(0, 7),
          } as any);

          await supabase.rpc("check_team_leader_promotion" as any, { p_partner_id: partnerId });
          const currentMonth = new Date().toISOString().slice(0, 7);
          await supabase.rpc("calculate_monthly_bonus" as any, { p_partner_id: partnerId, p_month: currentMonth });
        }

        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: null });
        return ok({ type: "setup_fee", entity: "company", id: cid });
      }

      // ── Branch B: Restaurant-based setup ──
      if (!restaurantId) {
        console.log("[stripe-webhook] setup_fee with no restaurantId/companyId — skipping");
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "skipped", p_error: null });
        return ok({ skipped: "no entity id" });
      }

      // Detect "first transition" so partner-sale + transfers don't double-fire on Stripe retries
      const { data: restRow } = await supabase
        .from("restaurants")
        .select("id, setup_paid, owner_id")
        .eq("id", restaurantId)
        .maybeSingle();

      const wasAlreadyPaid = restRow?.setup_paid === true;

      if (!wasAlreadyPaid) {
        await supabase
          .from("restaurants")
          .update({ setup_paid: true, setup_paid_at: new Date().toISOString() })
          .eq("id", restaurantId);
      }

      if (session.id) {
        await supabase
          .from("setup_payment_log")
          .update({
            status: "paid",
            paid_at: new Date().toISOString(),
            stripe_payment_intent_id: (session.payment_intent as string) || null,
          })
          .eq("stripe_session_id", session.id);
      }

      // If we already processed this restaurant fully in a previous webhook delivery,
      // skip partner_sales + transfers (they're not idempotent).
      if (wasAlreadyPaid) {
        console.log(`[stripe-webhook] Restaurant ${restaurantId} was already paid, skipping commission/transfer logic`);
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: "duplicate-but-acked" });
        return ok({ type: "setup_fee", entity: "restaurant", id: restaurantId, duplicate: true });
      }

      // Plan split calculations
      const planConfigs: Record<
        string,
        {
          total: number;
          installment: number;
          count: number;
          platformPerInstallment: number;
          partnerPerInstallment: number;
          overridePerInstallment: number;
        }
      > = {
        full: { total: 2997, installment: 2997, count: 1, platformPerInstallment: 195000, partnerPerInstallment: 99700, overridePerInstallment: 5000 },
        "3x": { total: 3297, installment: 1099, count: 3, platformPerInstallment: 65000, partnerPerInstallment: 33233, overridePerInstallment: 1667 },
        "6x": { total: 3294, installment: 549, count: 6, platformPerInstallment: 32500, partnerPerInstallment: 16616, overridePerInstallment: 833 },
      };
      const p = planConfigs[plan || "full"] || planConfigs.full;

      await supabase.from("restaurant_payments").upsert(
        {
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
          next_due_date:
            p.count > 1
              ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
              : null,
        } as any,
        { onConflict: "restaurant_id" },
      );

      let overrideAmount = 0;

      if (partnerId) {
        const { data: teamData } = await supabase
          .from("partner_teams")
          .select("team_leader_id")
          .eq("partner_id", partnerId)
          .maybeSingle();

        const teamLeaderId = teamData?.team_leader_id || null;

        const { count: priorSalesCount } = await supabase
          .from("partner_sales")
          .select("id", { count: "exact", head: true })
          .eq("partner_id", partnerId);
        const currentSaleNumber = (priorSalesCount || 0) + 1;

        if (teamLeaderId && currentSaleNumber >= 5) {
          const { count: leaderSales } = await supabase
            .from("partner_sales")
            .select("id", { count: "exact", head: true })
            .eq("partner_id", teamLeaderId);
          const { count: leaderRecruits } = await supabase
            .from("partner_teams")
            .select("id", { count: "exact", head: true })
            .eq("team_leader_id", teamLeaderId);

          if ((leaderSales || 0) >= 4 && (leaderRecruits || 0) >= 2) {
            overrideAmount = 50;
          }
        }

        await supabase.from("partner_sales").insert({
          partner_id: partnerId,
          sale_amount: p.total,
          partner_commission: 997,
          team_leader_id: teamLeaderId,
          team_leader_override: overrideAmount,
          sale_month: new Date().toISOString().slice(0, 7),
        } as any);

        await supabase.rpc("check_team_leader_promotion" as any, { p_partner_id: partnerId });
        const currentMonth = new Date().toISOString().slice(0, 7);
        await supabase.rpc("calculate_monthly_bonus" as any, { p_partner_id: partnerId, p_month: currentMonth });
      }

      // ── TRANSFERS ──
      const masterAccountId = Deno.env.get("STRIPE_MASTER_ACCOUNT_ID");

      if (masterAccountId && transferGroup) {
        try {
          await stripe.transfers.create({
            amount: p.platformPerInstallment,
            currency: "eur",
            destination: masterAccountId,
            transfer_group: transferGroup,
            metadata: { type: "platform_revenue", restaurantId, installment: "1", event_id: eventId },
          });
        } catch (e: any) {
          console.error("[stripe-webhook] Transfer to platform failed:", e.message);
        }
      }

      if (partnerId && transferGroup) {
        try {
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
              metadata: { type: "partner_commission", restaurantId, partnerId, installment: "1", event_id: eventId },
            });

            if (plan === "full") {
              await supabase
                .from("restaurant_payments")
                .update({ partner_paid: true } as any)
                .eq("restaurant_id", restaurantId);
            }
          }

          if (overrideAmount > 0) {
            const { data: teamData2 } = await supabase
              .from("partner_teams")
              .select("team_leader_id")
              .eq("partner_id", partnerId)
              .maybeSingle();

            if (teamData2?.team_leader_id) {
              const { data: tlPaymentInfo } = await supabase
                .rpc("get_partner_stripe_account" as any, { partner_user_id: teamData2.team_leader_id })
                .single();

              const tlStripeAccount = (tlPaymentInfo as any)?.stripe_account_id;
              if (tlStripeAccount) {
                await stripe.transfers.create({
                  amount: p.overridePerInstallment,
                  currency: "eur",
                  destination: tlStripeAccount,
                  transfer_group: transferGroup,
                  metadata: { type: "team_leader_override", restaurantId, teamLeaderId: teamData2.team_leader_id, installment: "1", event_id: eventId },
                });
              }
            }
          }
        } catch (e: any) {
          console.error("[stripe-webhook] Partner/TL transfer error:", e.message);
        }
      }

      await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: null });
      return ok({ type: "setup_fee", entity: "restaurant", id: restaurantId });
    }

    // ─── invoice.paid (installment) ─────────────────────────────────
    if (event.type === "invoice.paid") {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = invoice.subscription as string;
      if (!sub) {
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "skipped", p_error: null });
        return ok();
      }

      const subscription = await stripe.subscriptions.retrieve(sub);
      const meta = (subscription.metadata || {}) as Record<string, string>;
      const { restaurantId, partnerId, installmentsTotal, transferGroup } = meta;

      if (!restaurantId) {
        await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "skipped", p_error: null });
        return ok();
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

        await supabase
          .from("restaurant_payments")
          .update({
            installments_paid: newPaid,
            amount_paid: (payment.amount_paid || 0) + (payment.installment_amount || 0),
            is_overdue: false,
            next_due_date: isComplete ? null : new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
            partner_paid: isComplete,
          } as any)
          .eq("restaurant_id", restaurantId);

        const planConfigs: Record<string, { platformPerInstallment: number; partnerPerInstallment: number; overridePerInstallment: number }> = {
          "3x": { platformPerInstallment: 26700, partnerPerInstallment: 33233, overridePerInstallment: 6667 },
          "6x": { platformPerInstallment: 13334, partnerPerInstallment: 16616, overridePerInstallment: 3334 },
        };
        const planType = payment.plan_type || "3x";
        const pc = planConfigs[planType];

        if (pc && transferGroup) {
          const masterAccountId = Deno.env.get("STRIPE_MASTER_ACCOUNT_ID");
          if (masterAccountId) {
            try {
              await stripe.transfers.create({
                amount: pc.platformPerInstallment,
                currency: "eur",
                destination: masterAccountId,
                transfer_group: transferGroup,
                metadata: { type: "platform_revenue", restaurantId, installment: String(newPaid), event_id: eventId },
              });
            } catch (e: any) {
              console.error("[stripe-webhook] Installment transfer to platform failed:", e.message);
            }
          }

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
                  metadata: { type: "partner_commission", restaurantId, partnerId, installment: String(newPaid), event_id: eventId },
                });
              }

              const { data: teamData } = await supabase
                .from("partner_teams")
                .select("team_leader_id")
                .eq("partner_id", partnerId)
                .maybeSingle();

              if (teamData?.team_leader_id) {
                const { data: tlInfo } = await supabase
                  .rpc("get_partner_stripe_account" as any, { partner_user_id: teamData.team_leader_id })
                  .single();
                const tlAccount = (tlInfo as any)?.stripe_account_id;
                if (tlAccount) {
                  await stripe.transfers.create({
                    amount: pc.overridePerInstallment,
                    currency: "eur",
                    destination: tlAccount,
                    transfer_group: transferGroup,
                    metadata: { type: "team_leader_override", restaurantId, installment: String(newPaid), event_id: eventId },
                  });
                }
              }
            } catch (e: any) {
              console.error("[stripe-webhook] Partner/TL installment transfer error:", e.message);
            }
          }
        }

        if (isComplete) {
          try {
            await stripe.subscriptions.cancel(sub);
          } catch (e: any) {
            console.error("[stripe-webhook] Failed to cancel subscription:", e.message);
          }
        }
      }

      await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: null });
      return ok();
    }

    // ─── invoice.payment_failed ─────────────────────────────────────
    if (event.type === "invoice.payment_failed") {
      const invoice = event.data.object as Stripe.Invoice;
      const sub = invoice.subscription as string;
      if (sub) {
        const subscription = await stripe.subscriptions.retrieve(sub);
        const { restaurantId } = subscription.metadata || {};

        if (restaurantId) {
          await supabase
            .from("restaurant_payments")
            .update({
              is_overdue: true,
              partner_paid: false,
            } as any)
            .eq("restaurant_id", restaurantId);

          console.log(`[stripe-webhook] Payment failed for restaurant ${restaurantId} → marked overdue, partner payout paused`);
        }
      }
      await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "processed", p_error: null });
      return ok();
    }

    // Unknown event types: ack them so Stripe stops retrying
    await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "skipped", p_error: null });
    return ok({ skipped: event.type });
  } catch (err: any) {
    console.error("[stripe-webhook] Unhandled error:", err);
    await supabase.rpc("mark_stripe_event_processed", { p_event_id: eventId, p_status: "failed", p_error: err.message ?? String(err) });
    // Return 500 so Stripe retries — but ONLY for unexpected errors
    return new Response(JSON.stringify({ error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
