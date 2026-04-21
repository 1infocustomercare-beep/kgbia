// Check API Status — verifica quali variabili d'ambiente API sono configurate
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const KEYS = [
  "FIRECRAWL_API_KEY",
  "LOVABLE_API_KEY",
  "GOOGLE_PLACES_API",
  "INSTAGRAM_GRAPH_API",
  "REGISTRO_IMPRESE_API",
  "ELEVENLABS_API_KEY",
  "RESEND_API_KEY",
  "TWILIO_API_KEY",
  "META_GRAPH_API_KEY",
  "STRIPE_SECRET_KEY",
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
