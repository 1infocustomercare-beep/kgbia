import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { enforceCostGuard } from "../_shared/cost-guard.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // ── Optional auth (TTS is allowed for anon visitors on public pages) ──
    // If a real user token is provided, we still validate it; anon/publishable key is OK.
    const authHeader = req.headers.get("Authorization");
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const token = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

    if (token && token !== anonKey) {
      const _authClient = createClient(Deno.env.get("SUPABASE_URL")!, anonKey, {
        global: { headers: { Authorization: `Bearer ${token}` } },
      });
      const { data: { user: _authUser }, error: _authErr } = await _authClient.auth.getUser();
      if (_authErr || !_authUser) {
        // Token provided but invalid/expired — fall through as anon instead of failing,
        // so the splash narration on public pages keeps working.
        console.warn("[empire-tts] Invalid user token, proceeding as anonymous");
      }
    }

    const { text, voiceProfile } = await req.json();
    const ELEVENLABS_API_KEY = Deno.env.get("ELEVENLABS_API_KEY");

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

    // ── Cost guard: quota oraria per chiamante (anti abuso economico) ──
    const guard = await enforceCostGuard(req, "empire-tts", normalizedText.length, {
      maxUnitsAnon: 24000, maxCallsAnon: 80,
      maxUnitsAuth: 600000, maxCallsAuth: 2000,
    });
    if (!guard.ok) {
      // Non bloccare la UI: 200 + fallback flag così il client passa al TTS del browser
      // invece di trattare il 429 come errore runtime (schermata bianca).
      return new Response(
        JSON.stringify({ success: false, fallback: true, error: guard.error }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }


    // Voice profiles optimized for different contexts
    // Custom voice from ElevenLabs Voice Library
    const CUSTOM_VOICE_ID = "RXoaSpLaWTEckJgPUBG3";

    const VOICE_PROFILES = {
      // Arianna — Naturale, umana, professionale, persuasiva
      // Stability più alta = meno artefatti AI, più coerenza
      // Similarity alta = fedeltà alla voce originale
      // Style moderato = espressiva ma non esagerata
      arianna: {
        voiceId: CUSTOM_VOICE_ID,
        settings: {
          stability: 0.52,
          similarity_boost: 0.78,
          style: 0.30,
          use_speaker_boost: true,
          speed: 0.92,
        },
      },
      // Splash intro — Stessa naturalezza, leggermente più enfatica
      splash: {
        voiceId: CUSTOM_VOICE_ID,
        settings: {
          stability: 0.48,
          similarity_boost: 0.80,
          style: 0.35,
          use_speaker_boost: true,
          speed: 0.88,
        },
      },
      // Sales agent — Naturale, coinvolgente senza forzature
      sales: {
        voiceId: CUSTOM_VOICE_ID,
        settings: {
          stability: 0.50,
          similarity_boost: 0.76,
          style: 0.32,
          use_speaker_boost: true,
          speed: 0.94,
        },
      },
    } as const;

    const profile = VOICE_PROFILES[voiceProfile as keyof typeof VOICE_PROFILES] || VOICE_PROFILES.arianna;

    console.log(`[empire-tts] Generating speech: profile=${voiceProfile || "arianna"}, text length=${normalizedText.length}`);

    // Voci Lovable AI (femminili naturali) mappate sui profili Empire.
    const LOVABLE_VOICE: Record<string, string> = {
      arianna: "shimmer",
      splash: "sage",
      sales: "coral",
    };
    const LOVABLE_INSTRUCTIONS: Record<string, string> = {
      arianna: "Parla in italiano, tono professionale, caldo e rassicurante, ritmo naturale.",
      splash: "Parla in italiano con tono cinematografico ed elegante, ritmo lento e sicuro.",
      sales: "Parla in italiano con tono consulenziale e coinvolgente, energia positiva ma mai aggressiva.",
    };
    const key = (voiceProfile as string) in LOVABLE_VOICE ? (voiceProfile as string) : "arianna";

    // ── 1) Primario: Lovable AI (nessuna chiave esterna, nessun piano a pagamento) ──
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (LOVABLE_API_KEY) {
      try {
        const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/audio/speech", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Lovable-API-Key": LOVABLE_API_KEY,
          },
          body: JSON.stringify({
            model: "openai/gpt-4o-mini-tts",
            input: normalizedText,
            voice: LOVABLE_VOICE[key],
            instructions: LOVABLE_INSTRUCTIONS[key],
            response_format: "mp3",
            stream_format: "audio",
          }),
        });

        if (aiResp.ok) {
          const buf = await aiResp.arrayBuffer();
          console.log(`[empire-tts] ✅ Lovable AI audio: ${(buf.byteLength / 1024).toFixed(1)}KB`);
          return new Response(JSON.stringify({ audioContent: base64Encode(buf), provider: "lovable-ai" }), {
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          });
        }
        console.error("[empire-tts] Lovable AI TTS error:", aiResp.status, (await aiResp.text()).slice(0, 300));
      } catch (aiErr) {
        console.error("[empire-tts] Lovable AI TTS exception:", aiErr);
      }
    }

    // ── 2) Secondario: ElevenLabs (solo se la chiave è configurata) ──
    if (ELEVENLABS_API_KEY) {
      try {
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
          },
        );

        if (response.ok) {
          const audioBuffer = await response.arrayBuffer();
          console.log(`[empire-tts] ✅ ElevenLabs audio: ${(audioBuffer.byteLength / 1024).toFixed(1)}KB`);
          return new Response(
            JSON.stringify({ audioContent: base64Encode(audioBuffer), provider: "elevenlabs" }),
            { headers: { ...corsHeaders, "Content-Type": "application/json" } },
          );
        }
        console.error("[empire-tts] ElevenLabs error:", response.status, (await response.text()).slice(0, 300));
      } catch (elErr) {
        console.error("[empire-tts] ElevenLabs exception:", elErr);
      }
    }

    // ── 3) Degrado silenzioso: il client usa il TTS del browser ──
    return new Response(
      JSON.stringify({ success: false, fallback: true, error: "tts_unavailable" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    console.error("empire-tts error:", e);
    // Mai 5xx: qualsiasi errore TTS degrada al fallback browser senza bloccare la UI.
    return new Response(JSON.stringify({ fallback: true, error: "tts_unavailable" }), {
      status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
