// wa-track — endpoint pubblico (no auth) che traccia il click su una variante A/B
// di un messaggio WhatsApp e redirige il browser a wa.me con il messaggio corretto.
// URL: /functions/v1/wa-track?s=<short_id>
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function normalizePhone(raw: string | null | undefined): string | null {
  if (!raw) return null;
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  if (/^3\d{9}$/.test(digits)) digits = "39" + digits;
  if (digits.length < 7) return null;
  return digits;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const url = new URL(req.url);
    const shortId = url.searchParams.get("s");
    if (!shortId) {
      return new Response("Missing tracking id", { status: 400, headers: corsHeaders });
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(SUPABASE_URL, SERVICE_KEY);

    const { data, error } = await admin.rpc("track_wa_ab_click", { p_short_id: shortId });
    if (error || !data?.success) {
      console.error("[wa-track] rpc error", error, data);
      return new Response("Tracking link non valido o scaduto", {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "text/plain; charset=utf-8" },
      });
    }

    const phone = normalizePhone(data.phone);
    const message = (data.message as string) || "";
    const target = phone
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://wa.me/?text=${encodeURIComponent(message)}`;

    // Redirect 302 al link wa.me
    return new Response(null, {
      status: 302,
      headers: {
        ...corsHeaders,
        Location: target,
        "Cache-Control": "no-store",
      },
    });
  } catch (e: any) {
    console.error("[wa-track] fatal", e);
    return new Response("Errore tracking", { status: 500, headers: corsHeaders });
  }
});
