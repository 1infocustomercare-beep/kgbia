import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { enforceCostGuard } from "../_shared/cost-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Empire Voice Orchestrator — TTS via ElevenLabs
 * Riceve testo, ritorna mp3 base64 da riprodurre nel browser.
 * Voce default: Sarah (EXAVITQu4vr4xnSDxMaL) — femminile italiana naturale.
 */

const DEFAULT_VOICE = "EXAVITQu4vr4xnSDxMaL"; // Sarah

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const apiKey = Deno.env.get("ELEVENLABS_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "ELEVENLABS_API_KEY missing" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { text, voice_id } = await req.json();
    if (!text || typeof text !== "string") {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const safeText = text.trim().slice(0, 2000);
    if (!safeText) {
      return new Response(JSON.stringify({ error: "text required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ── Cost guard: quota oraria per chiamante (anti abuso economico) ──
    const guard = await enforceCostGuard(req, "voice-orchestrator-tts", safeText.length, {
      maxUnitsAnon: 12000, maxCallsAnon: 40,
      maxUnitsAuth: 120000, maxCallsAuth: 400,
    });
    if (!guard.ok) {
      return new Response(JSON.stringify({ error: guard.error }), {
        status: guard.status,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const voice = (voice_id && typeof voice_id === "string") ? voice_id : DEFAULT_VOICE;


    const resp = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${voice}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": apiKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: safeText,
          model_id: "eleven_multilingual_v2",
          voice_settings: {
            stability: 0.55,
            similarity_boost: 0.8,
            style: 0.35,
            use_speaker_boost: true,
            speed: 1.05,
          },
        }),
      },
    );

    if (!resp.ok) {
      const errTxt = await resp.text();
      console.error("ElevenLabs error:", resp.status, errTxt);
      // Return 200 with fallback flag so the client can switch to browser TTS
      // instead of crashing the voice orchestrator session.
      const isAuth = resp.status === 401 || resp.status === 403;
      return new Response(
        JSON.stringify({
          success: false,
          fallback: true,
          error: isAuth ? "tts_auth_or_quota" : `tts_failed_${resp.status}`,
          detail: errTxt.slice(0, 300),
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const audioBuffer = await resp.arrayBuffer();
    const audioBase64 = base64Encode(new Uint8Array(audioBuffer));

    return new Response(
      JSON.stringify({ success: true, audio_base64: audioBase64 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("voice-orchestrator-tts error:", err);
    return new Response(
      JSON.stringify({ error: err instanceof Error ? err.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
