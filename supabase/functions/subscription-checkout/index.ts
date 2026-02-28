import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const PLAN_PRICES: Record<string, number> = {
  essential: 2900,   // €29 in cents
  smart_ia: 5900,    // €59 in cents
  empire_pro: 8900,  // €89 in cents
};

const PLAN_NAMES: Record<string, string> = {
  essential: "Empire Essential",
  smart_ia: "Empire Smart IA",
  empire_pro: "Empire Pro",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");

    const authHeader = req.headers.get("Authorization");
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader?.replace("Bearer ", "") || ""
    );
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Non autenticato" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { restaurant_id, plan } = await req.json();

    if (!restaurant_id || !plan || !PLAN_PRICES[plan]) {
      return new Response(JSON.stringify({ error: "Piano non valido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Verify ownership
    const { data: restaurant } = await supabase
      .from("restaurants")
      .select("id, owner_id, name, email")
      .eq("id", restaurant_id)
      .single();

    if (!restaurant || restaurant.owner_id !== user.id) {
      return new Response(JSON.stringify({ error: "Non autorizzato" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // If no Stripe key, just update the plan directly (dev mode)
    if (!stripeKey) {
      await supabase
        .from("restaurant_subscriptions")
        .update({
          plan,
          status: "active",
          current_period_start: new Date().toISOString(),
          current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
        .eq("restaurant_id", restaurant_id);

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Stripe checkout for subscription
    const stripeResponse = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${stripeKey}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        mode: "subscription",
        "line_items[0][price_data][currency]": "eur",
        "line_items[0][price_data][unit_amount]": PLAN_PRICES[plan].toString(),
        "line_items[0][price_data][recurring][interval]": "month",
        "line_items[0][price_data][product_data][name]": PLAN_NAMES[plan],
        "line_items[0][quantity]": "1",
        customer_email: restaurant.email || user.email || "",
        success_url: `${req.headers.get("origin") || "https://empire.app"}/admin?subscription=success`,
        cancel_url: `${req.headers.get("origin") || "https://empire.app"}/admin?subscription=cancel`,
        "metadata[restaurant_id]": restaurant_id,
        "metadata[plan]": plan,
        "metadata[user_id]": user.id,
        "subscription_data[metadata][restaurant_id]": restaurant_id,
        "subscription_data[metadata][plan]": plan,
      }),
    });

    const session = await stripeResponse.json();

    if (session.error) {
      throw new Error(session.error.message);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
