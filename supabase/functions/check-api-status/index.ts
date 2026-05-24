// Check API Status — verifica quali variabili d'ambiente API sono configurate
// Restricted: only authenticated super_admin / partner users can enumerate.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KEYS = [
  // Core
  "FIRECRAWL_API_KEY",
  "LOVABLE_API_KEY",
  "ELEVENLABS_API_KEY",
  "RESEND_API_KEY",
  "TWILIO_API_KEY",
  "STRIPE_SECRET_KEY",
  // Maps & POI
  "GOOGLE_PLACES_API",
  "BING_MAPS_API_KEY",
  "YELP_API_KEY",
  "TRIPADVISOR_API_KEY",
  // Web search
  "SERPAPI_KEY",
  "BING_SEARCH_API_KEY",
  // Social
  "INSTAGRAM_GRAPH_API",
  "META_GRAPH_API_KEY",
  "LINKEDIN_API_KEY",
  "TIKTOK_API_KEY",
  // Registries
  "REGISTRO_IMPRESE_API",
];

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const authClient = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_ANON_KEY")!,
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: authData, error: authErr } = await authClient.auth.getUser();
  if (authErr || !authData?.user) {
    return new Response(JSON.stringify({ error: "Unauthorized" }), {
      status: 401,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const admin = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );
  const { data: roles } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", authData.user.id);
  const allowed = (roles || []).some((r: any) =>
    ["super_admin", "partner", "admin"].includes(r.role),
  );
  if (!allowed) {
    return new Response(JSON.stringify({ error: "Forbidden" }), {
      status: 403,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const statuses: Record<string, boolean> = {};
  for (const k of KEYS) {
    statuses[k] = !!Deno.env.get(k);
  }

  return new Response(JSON.stringify({ statuses }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
