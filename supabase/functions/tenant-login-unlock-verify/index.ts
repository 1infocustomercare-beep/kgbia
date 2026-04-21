// Edge Function: tenant-login-unlock-verify
// Validates a one-time unlock token issued by tenant-login-unlock-request.
// On success, marks the token consumed and returns the tenant slug + email
// so the client can clear its local throttle for that (slug,email) pair.
//
// Public, unauthenticated entry point.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

interface RequestBody {
  token?: string;
  slug?: string;
}

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input);
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
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

  const token = (body.token ?? "").trim();
  const slug = (body.slug ?? "").trim().toLowerCase();

  if (!token || token.length < 16) {
    return new Response(
      JSON.stringify({ ok: false, error: "invalid_token" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  const admin = createClient(SUPABASE_URL, SERVICE_ROLE, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  const tokenHash = await sha256(token);

  const { data: rec } = await admin
    .from("tenant_login_unlock_tokens")
    .select("id, slug, email_lower, expires_at, consumed_at, restaurant_id")
    .eq("token_hash", tokenHash)
    .maybeSingle();

  if (!rec) {
    return new Response(
      JSON.stringify({ ok: false, error: "token_not_found" }),
      {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (slug && rec.slug !== slug) {
    return new Response(
      JSON.stringify({ ok: false, error: "tenant_mismatch" }),
      {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (rec.consumed_at) {
    return new Response(
      JSON.stringify({ ok: false, error: "token_already_used" }),
      {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  if (new Date(rec.expires_at).getTime() < Date.now()) {
    return new Response(
      JSON.stringify({ ok: false, error: "token_expired" }),
      {
        status: 410,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      },
    );
  }

  // Consume token (best-effort, idempotent)
  await admin
    .from("tenant_login_unlock_tokens")
    .update({ consumed_at: new Date().toISOString() })
    .eq("id", rec.id)
    .is("consumed_at", null);

  // Resolve tenant display name for the success screen
  const { data: tenant } = await admin
    .from("restaurants")
    .select("slug, name")
    .eq("id", rec.restaurant_id)
    .maybeSingle();

  return new Response(
    JSON.stringify({
      ok: true,
      slug: rec.slug,
      email: rec.email_lower,
      tenant_name: tenant?.name ?? null,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    },
  );
});
