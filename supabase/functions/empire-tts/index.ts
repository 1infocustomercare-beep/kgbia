import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, voiceProfile } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");
    if (!ELEVENLABS_API_KEY) throw new Error("ELEVENLABS_API_KEY is not configured");

    if (!text || text.trim().length === 0) {
      return new Response(JSON.stringify({ error: "No text provided" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const normalizedText = text
      .replace(/\s+/g, " ")
      .replace(/[*_#`>~]/g, "")
      .trim()
      .slice(0, 2000);

    if (!normalizedText) {
      return new Response(JSON.stringify({ error: "Text content is empty after normalization" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Voice profiles optimized for different contexts
    // Custom voice from ElevenLabs Voice Library
    const CUSTOM_VOICE_ID = "RXoaSpLaWTEckJgPUBG3";

    const VOICE_PROFILES = {
      // Arianna — Allegra, emotiva, professionale e persuasiva
      arianna: {
        voiceId: CUSTOM_VOICE_ID,
        settings: {
          stability: 0.32,
          similarity_boost: 0.88,
          style: 0.55,
          use_speaker_boost: true,
          speed: 0.93,
        },
      },
      // Splash intro — Entusiasta e coinvolgente
      splash: {
        voiceId: CUSTOM_VOICE_ID,
        settings: {
          stability: 0.28,
          similarity_boost: 0.90,
          style: 0.60,
          use_speaker_boost: true,
          speed: 0.90,
        },
      },
      // Sales agent — Energetica, emozionale, convincente
      sales: {
        voiceId: CUSTOM_VOICE_ID,
        settings: {
          stability: 0.30,
          similarity_boost: 0.85,
          style: 0.58,
          use_speaker_boost: true,
          speed: 0.95,
        },
      },
    } as const;

    const profile = VOICE_PROFILES[voiceProfile as keyof typeof VOICE_PROFILES] || VOICE_PROFILES.arianna;

    console.log(`[empire-tts] Generating speech: profile=${voiceProfile || "arianna"}, text length=${normalizedText.length}`);

    const response = await fetch(
      `https://api.elevenlabs.io/v1/text-to-speech/${profile.voiceId}?output_format=mp3_44100_128`,
      {
        method: "POST",
        headers: {
          "xi-api-key": ELEVENLABS_API_KEY,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: normalizedText,
          model_id: "eleven_multilingual_v2",
          voice_settings: profile.settings,
        }),
      }
    );

    if (!response.ok) {
      const errText = await response.text();
      console.error("ElevenLabs TTS error:", response.status, errText);
      if (errText.includes("quota_exceeded") || response.status === 401 || response.status === 403) {
        return new Response(JSON.stringify({ error: "quota_exceeded", fallback: true }), {
          status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      throw new Error(`TTS error: ${response.status}`);
    }

    const audioBuffer = await response.arrayBuffer();
    const base64Audio = base64Encode(audioBuffer);

    console.log(`[empire-tts] ✅ Audio generated successfully: ${(audioBuffer.byteLength / 1024).toFixed(1)}KB`);

    return new Response(JSON.stringify({ audioContent: base64Audio }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("empire-tts error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error", fallback: true }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
