// Lead Mockup Generator — genera mockup visivo PRIMA/DOPO usando Nano Banana Pro.
// Carica i PNG su Storage e aggiorna il report intelligence con gli URL.
// Costa 10 crediti. On-demand.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function generateImage(lovableKey: string, prompt: string): Promise<string | null> {
  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-3.1-flash-image-preview",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!r.ok) {
    const txt = await r.text();
    if (r.status === 429) throw new Error("rate_limited");
    if (r.status === 402) throw new Error("payment_required");
    throw new Error(`image_gen_error: ${r.status} ${txt}`);
  }
  const data = await r.json();
  const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url;
  return url ?? null;
}

async function uploadDataUrlToStorage(client: any, dataUrl: string, path: string): Promise<string | null> {
  try {
    const m = dataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!m) return null;
    const mime = m[1];
    const base64 = m[2];
    const bytes = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
    const { error } = await client.storage.from("media-vault").upload(path, bytes, { contentType: mime, upsert: true });
    if (error) { console.error("upload err", error); return null; }
    const { data: pub } = client.storage.from("media-vault").getPublicUrl(path);
    return pub?.publicUrl ?? null;
  } catch (e) {
    console.error("uploadDataUrlToStorage", e);
    return null;
  }
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_KEY) {
      return new Response(JSON.stringify({ error: "lovable_ai_not_configured" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let userClient: any = null;
    if (authHeader) {
      userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await userClient.auth.getUser();
      userId = u?.user?.id ?? null;
    }
    if (!userId) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { report_id } = await req.json();
    if (!report_id) return new Response(JSON.stringify({ error: "report_id required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const { data: report } = await adminClient
      .from("lead_intelligence_reports")
      .select("*")
      .eq("id", report_id)
      .eq("owner_id", userId)
      .maybeSingle();

    if (!report) return new Response(JSON.stringify({ error: "report_not_found" }), { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    if (report.mockup_before_url && report.mockup_after_url) {
      return new Response(JSON.stringify({ success: true, cached: true, report }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // Crediti
    const { data: creditCheck } = await userClient.rpc("consume_seller_credits", {
      p_action: "lead_mockup_before_after",
      p_metadata: { report_id, lead_name: report.lead_name },
    });
    if (!creditCheck?.success) {
      return new Response(JSON.stringify({ success: false, error: "insufficient_credits", details: creditCheck }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const sectorMap: Record<string, string> = {
      food: "ristorante italiano elegante",
      beauty: "salone bellezza moderno",
      fitness: "palestra premium",
      healthcare: "studio medico",
      retail: "negozio premium",
      hospitality: "boutique hotel",
    };
    const businessDesc = sectorMap[report.lead_sector || ""] || "attività commerciale";
    const issues = (report.website_issues as string[] || []).slice(0, 3).join(", ") || "design obsoleto, no mobile";

    const beforePrompt = `Mockup smartphone iPhone con sito web vecchio anni 2010 per ${businessDesc} chiamato "${report.lead_name}". Design obsoleto: ${issues}. Caratteri serif, foto compresse pixelate, layout disordinato, testi accatastati, palette colori datata (marroni, beige sporco), nessun pulsante prenotazione. Render fotorealistico, sfondo sfocato neutro grigio, vista frontale leggermente angolata. Stile professionale documentale.`;

    const afterPrompt = `Mockup smartphone iPhone con app premium Empire per ${businessDesc} chiamato "${report.lead_name}". Design 2026 ultra-moderno: dark mode lusso (oro #C8963E + nero), tipografia Inter moderna, foto piatti/servizi alta qualità, bottone grande "Prenota Ora", menu con prezzi chiari, badge recensioni 5 stelle, chat AI, mappa tavoli, push notifiche. Render fotorealistico, sfondo gradiente viola-oro elegante, vista frontale leggermente angolata. Stile cinematografico premium.`;

    let beforeUrl: string | null = null;
    let afterUrl: string | null = null;

    try {
      const [beforeData, afterData] = await Promise.all([
        generateImage(LOVABLE_KEY, beforePrompt),
        generateImage(LOVABLE_KEY, afterPrompt),
      ]);

      if (beforeData) beforeUrl = await uploadDataUrlToStorage(adminClient, beforeData, `intelligence-mockups/${userId}/${report_id}-before.png`);
      if (afterData) afterUrl = await uploadDataUrlToStorage(adminClient, afterData, `intelligence-mockups/${userId}/${report_id}-after.png`);
    } catch (e: any) {
      if (e.message === "rate_limited") return new Response(JSON.stringify({ success: false, error: "ai_rate_limited" }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (e.message === "payment_required") return new Response(JSON.stringify({ success: false, error: "ai_payment_required" }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      throw e;
    }

    const { data: updated } = await adminClient
      .from("lead_intelligence_reports")
      .update({
        mockup_before_url: beforeUrl,
        mockup_after_url: afterUrl,
        mockup_generated_at: new Date().toISOString(),
        credits_spent: (report.credits_spent || 0) + 10,
      })
      .eq("id", report_id)
      .select()
      .single();

    return new Response(JSON.stringify({ success: true, cached: false, report: updated }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[mockup-gen] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
