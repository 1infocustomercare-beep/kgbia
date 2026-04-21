// Edge Function: tenant-login-unlock-request
// Issues a one-time unlock token for a tenant admin who got throttled
// after too many failed login attempts. The token is delivered via the
// existing transactional email pipeline if a verified domain exists,
// otherwise the link is returned only to authorized internal callers.
//
// Public, unauthenticated entry point — uses anti-enumeration responses.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  slug?: string;
  email?: string;
  redirect_origin?: string; // optional client-supplied origin for the unlock link
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// Generic anti-enumeration response — always 200 so attackers can't
// distinguish "user exists" vs "doesn't exist".
const GENERIC_OK = {
  ok: true,
  message:
    "Se l'email è associata a questo ristorante, riceverai un link di sblocco entro pochi minuti.",
};

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

function randomToken(bytes = 32): string {
  const buf = new Uint8Array(bytes);
  crypto.getRandomValues(buf);
  // URL-safe base64
  return btoa(String.fromCharCode(...buf))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ ok: false, error: "method_not_allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: "invalid_json" }), {
      status: 400,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const slug = (body.slug ?? "").trim().toLowerCase();
  const email = (body.email ?? "").trim().toLowerCase();
  const redirectOrigin = (body.redirect_origin ?? "").trim();

  if (!slug || !email || !email.includes("@")) {
    return new Response(JSON.stringify(GENERIC_OK), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  // 1) Resolve restaurant by slug
  const { data: restaurant } = await admin
    .from("restaurants")
    .select("id, slug, name, owner_id, is_blocked")
    .eq("slug", slug)
    .maybeSingle();

  if (!restaurant || restaurant.is_blocked) {
    // Generic response — don't leak existence
    return new Response(JSON.stringify(GENERIC_OK), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 2) Find a user with this email that has access to this tenant
  //    (owner OR member). We must look up auth.users by email.
  const { data: usersList } = await admin.auth.admin.listUsers({
    page: 1,
    perPage: 200,
  });
  const target = usersList?.users?.find(
    (u) => (u.email ?? "").trim().toLowerCase() === email,
  );

  let authorized = false;
  if (target) {
    if (restaurant.owner_id === target.id) {
      authorized = true;
    } else {
      const { data: member } = await admin
        .from("restaurant_memberships")
        .select("restaurant_id")
        .eq("restaurant_id", restaurant.id)
        .eq("user_id", target.id)
        .maybeSingle();
      authorized = !!member;
    }
  }

  if (!authorized) {
    // Same generic response for security; sleep a tiny bit to flatten timing
    await new Promise((r) => setTimeout(r, 120));
    return new Response(JSON.stringify(GENERIC_OK), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 3) Throttle: at most 3 active (non-consumed, non-expired) tokens per
  //    (slug, email) per hour. This protects the email channel itself.
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
  const { count: recentCount } = await admin
    .from("tenant_login_unlock_tokens")
    .select("id", { count: "exact", head: true })
    .eq("slug", slug)
    .eq("email_lower", email)
    .gte("created_at", oneHourAgo);

  if ((recentCount ?? 0) >= 3) {
    return new Response(
      JSON.stringify({
        ok: true,
        throttled: true,
        message:
          "Hai già richiesto più sblocchi di recente. Controlla la tua email o contatta il supporto Empire.",
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // 4) Generate token + persist hash
  const token = randomToken(32);
  const tokenHash = await sha256(token);
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "";
  const ua = req.headers.get("user-agent") ?? "";
  const ipHash = ip ? await sha256(ip) : null;
  const uaHash = ua ? await sha256(ua) : null;

  const { error: insertError } = await admin
    .from("tenant_login_unlock_tokens")
    .insert({
      restaurant_id: restaurant.id,
      slug,
      email_lower: email,
      token_hash: tokenHash,
      ip_hash: ipHash,
      user_agent_hash: uaHash,
    });

  if (insertError) {
    console.error("[tenant-login-unlock-request] insert failed", insertError);
    return new Response(JSON.stringify({ ok: false, error: "internal_error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  // 5) Build unlock link
  const origin =
    redirectOrigin && /^https?:\/\//i.test(redirectOrigin)
      ? redirectOrigin.replace(/\/+$/, "")
      : "https://empireia.lovable.app";
  const unlockUrl = `${origin}/t/${encodeURIComponent(slug)}/unlock?token=${encodeURIComponent(token)}`;

  // 6) Try to deliver via the platform's transactional email pipeline.
  //    If it isn't configured, we fall back to logging — the GENERIC_OK
  //    response is identical either way to prevent enumeration.
  let emailSent = false;
  try {
    const sendResp = await admin.functions.invoke("send-transactional-email", {
      body: {
        templateName: "tenant-login-unlock",
        recipientEmail: email,
        idempotencyKey: `tenant-unlock-${tokenHash.slice(0, 24)}`,
        templateData: {
          tenantName: restaurant.name,
          unlockUrl,
          expiresInMinutes: 15,
        },
      },
    });
    emailSent = !sendResp.error;
    if (sendResp.error) {
      console.warn(
        "[tenant-login-unlock-request] send-transactional-email error",
        sendResp.error,
      );
    }
  } catch (err) {
    console.warn(
      "[tenant-login-unlock-request] transactional email pipeline unavailable",
      err,
    );
  }

  // For ops visibility (only logged server-side, never returned to client)
  console.log(
    `[tenant-login-unlock-request] issued slug=${slug} email_sent=${emailSent}`,
  );

  return new Response(JSON.stringify(GENERIC_OK), {
    status: 200,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
