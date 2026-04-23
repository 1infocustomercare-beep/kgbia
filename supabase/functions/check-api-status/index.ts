// Check API Status — verifica quali variabili d'ambiente API sono configurate
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

Deno.serve((req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const statuses: Record<string, boolean> = {};
  for (const k of KEYS) {
    statuses[k] = !!Deno.env.get(k);
  }

  return new Response(JSON.stringify({ statuses }), {
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
