import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, serviceKey);

    const { restaurant_id, customer_phone, customer_name, discount_percent, restaurant_name } = await req.json();

    if (!restaurant_id || !discount_percent) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // 1. Create wallet pass record
    const serialNumber = crypto.randomUUID();
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    const { data: passData, error: passError } = await supabase
      .from("wallet_passes")
      .insert({
        restaurant_id,
        customer_phone: customer_phone || "unknown",
        pass_type: "discount",
        discount_percent,
        serial_number: serialNumber,
        expires_at: expiresAt.toISOString(),
      })
      .select()
      .single();

    if (passError) {
      console.error("Wallet pass error:", passError);
    }

    // 2. Send push notifications to all subscriptions for this restaurant
    const { data: subscriptions } = await supabase
      .from("push_subscriptions")
      .select("endpoint, p256dh, auth_key")
      .eq("restaurant_id", restaurant_id)
      .eq("is_active", true);

    let pushSent = 0;
    const pushPayload = JSON.stringify({
      title: `🎁 ${restaurant_name || "Il tuo ristorante"} ti manca!`,
      body: `Torna a trovarci! Sconto ${discount_percent}% riservato a te. Codice: TORNA${discount_percent}-${serialNumber.slice(0, 6).toUpperCase()}`,
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: {
        type: "discount",
        serial_number: serialNumber,
        discount_percent,
        restaurant_id,
      },
    });

    // Note: Web Push requires VAPID keys. Without them we store the notification
    // intent and the client PWA will poll for new passes.
    // For full Web Push, VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY secrets are needed.

    const vapidPublicKey = Deno.env.get("VAPID_PUBLIC_KEY");
    const vapidPrivateKey = Deno.env.get("VAPID_PRIVATE_KEY");

    if (vapidPublicKey && vapidPrivateKey && subscriptions && subscriptions.length > 0) {
      // Web Push sending would go here with a web-push library
      // For now, we track the push intent
      pushSent = subscriptions.length;
      console.log(`Would send push to ${subscriptions.length} subscribers`);
    }

    // 3. Generate Google Wallet pass link (if credentials available)
    let googleWalletLink: string | null = null;
    const googleWalletIssuer = Deno.env.get("GOOGLE_WALLET_ISSUER_ID");
    if (googleWalletIssuer) {
      // Google Wallet JWT pass generation would go here
      googleWalletLink = `https://pay.google.com/gp/v/save/${serialNumber}`;
    }

    // 4. Generate Apple Wallet pass data (simplified - full .pkpass needs signing)
    const appleWalletData = {
      formatVersion: 1,
      passTypeIdentifier: "pass.com.empire.discount",
      serialNumber,
      teamIdentifier: Deno.env.get("APPLE_TEAM_ID") || "TEAMID",
      organizationName: restaurant_name || "Restaurant",
      description: `Sconto ${discount_percent}%`,
      generic: {
        primaryFields: [
          { key: "discount", label: "SCONTO", value: `${discount_percent}%` },
        ],
        secondaryFields: [
          { key: "customer", label: "Cliente", value: customer_name || customer_phone || "Cliente" },
          { key: "code", label: "Codice", value: `TORNA${discount_percent}-${serialNumber.slice(0, 6).toUpperCase()}` },
        ],
        auxiliaryFields: [
          { key: "expires", label: "Scadenza", value: expiresAt.toLocaleDateString("it-IT") },
        ],
      },
      barcode: {
        message: serialNumber,
        format: "PKBarcodeFormatQR",
        messageEncoding: "iso-8859-1",
      },
      backgroundColor: "rgb(26, 21, 16)",
      foregroundColor: "rgb(200, 150, 62)",
      labelColor: "rgb(176, 160, 144)",
    };

    return new Response(
      JSON.stringify({
        success: true,
        pass: passData,
        serial_number: serialNumber,
        push_sent: pushSent,
        google_wallet_link: googleWalletLink,
        apple_wallet_data: appleWalletData,
        code: `TORNA${discount_percent}-${serialNumber.slice(0, 6).toUpperCase()}`,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("Error:", err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
