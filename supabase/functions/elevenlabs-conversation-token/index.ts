import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) {
      return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY not configured" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get agent_id from request body or from ai_agent_configs
    let agentId: string | null = null;

    const body = await req.json().catch(() => ({}));
    agentId = body.agent_id || null;

    // If no agent_id provided, try to fetch from database
    if (!agentId) {
      const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
      const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
      const supabase = createClient(supabaseUrl, supabaseKey);

      const { data } = await supabase
        .from("ai_agent_configs")
        .select("system_prompt_override")
        .eq("agent_name", "elevenlabs-convai")
        .maybeSingle();

      // We store agent_id in system_prompt_override field for simplicity
      if (data?.system_prompt_override) {
        try {
          const config = JSON.parse(data.system_prompt_override);
          agentId = config.agent_id || null;
        } catch {
          agentId = data.system_prompt_override;
        }
      }
    }

    if (!agentId) {
      return new Response(JSON.stringify({ error: "ElevenLabs Agent ID non configurato. Vai su Agenti IA → Configurazione ElevenLabs nel pannello Super Admin." }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const response = await fetch(
      `https://api.elevenlabs.io/v1/convai/conversation/token?agent_id=${agentId}`,
      {
        headers: { "xi-api-key": ELEVENLABS_API_KEY },
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("ElevenLabs token error:", response.status, errorText);
      return new Response(JSON.stringify({ error: `ElevenLabs API error: ${response.status}` }), {
        status: response.status, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { token } = await response.json();

    return new Response(JSON.stringify({ token }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
