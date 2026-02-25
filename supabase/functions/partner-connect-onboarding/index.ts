import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@14.21.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Partner Connect Onboarding
 * 
 * Creates a Stripe Express Connect account for a partner so they can receive
 * their €997 commission payouts. Returns an Account Link URL for onboarding.
 * 
 * Actions:
 * - "create" → Creates a new Stripe Connect Express account and returns onboarding URL
 * - "status" → Checks if partner has completed Stripe onboarding
 * - "dashboard" → Returns a login link to Stripe Express Dashboard
 */
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

    const { action, userId, email, returnUrl, refreshUrl } = await req.json();

    if (!userId) throw new Error("Missing userId");

    // ── GET EXISTING CONNECT ACCOUNT ──
    const { data: existingProfile } = await supabase
      .from("profiles")
      .select("*")
      .eq("user_id", userId)
      .single();

    // We store partner_stripe_account_id in a dedicated column or via metadata
    // For now, we'll use a simple approach: store in profiles table or partner_stripe_accounts
    const { data: existingAccount } = await supabase
      .from("partner_stripe_accounts" as any)
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    const existingStripeId = (existingAccount as any)?.stripe_account_id;

    if (action === "status") {
      if (!existingStripeId) {
        return new Response(JSON.stringify({ connected: false, onboarding_complete: false }), {
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      const account = await stripe.accounts.retrieve(existingStripeId);
      return new Response(JSON.stringify({
        connected: true,
        onboarding_complete: account.details_submitted && account.charges_enabled,
        charges_enabled: account.charges_enabled,
        payouts_enabled: account.payouts_enabled,
        stripe_account_id: existingStripeId,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "dashboard") {
      if (!existingStripeId) throw new Error("No Stripe account found");

      const loginLink = await stripe.accounts.createLoginLink(existingStripeId);
      return new Response(JSON.stringify({ url: loginLink.url }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── CREATE OR RECONNECT ──
    let stripeAccountId = existingStripeId;

    if (!stripeAccountId) {
      // Create new Express Connect account
      const account = await stripe.accounts.create({
        type: "express",
        country: "IT",
        email: email || existingProfile?.email || undefined,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true },
        },
        business_type: "individual",
        metadata: { empire_user_id: userId },
      });

      stripeAccountId = account.id;

      // Store in database
      await supabase.from("partner_stripe_accounts" as any).insert({
        user_id: userId,
        stripe_account_id: stripeAccountId,
        email: email || existingProfile?.email,
      });

      console.log(`Created Stripe Connect Express account ${stripeAccountId} for user ${userId}`);
    }

    // Generate Account Link for onboarding
    const accountLink = await stripe.accountLinks.create({
      account: stripeAccountId,
      refresh_url: refreshUrl || "https://empire.app/partner?stripe=refresh",
      return_url: returnUrl || "https://empire.app/partner?stripe=success",
      type: "account_onboarding",
    });

    return new Response(JSON.stringify({ url: accountLink.url, stripeAccountId }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    console.error("Partner connect onboarding error:", err.message);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
