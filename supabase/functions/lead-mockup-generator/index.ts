// Lead Mockup Generator — genera mockup visivo PRIMA/DOPO usando Nano Banana Pro.
// Carica i PNG su Storage e aggiorna il report intelligence con gli URL.
// Costa 10 crediti. On-demand.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

async function generateImage(
  lovableKey: string,
  prompt: string,
  pro: boolean = true,
  referenceImageUrls: string[] = [],
): Promise<string | null> {
  // Upgrade automatico a Nano Banana Pro per qualità catalogo (default).
  const model = pro ? "google/gemini-3-pro-image-preview" : "google/gemini-3.1-flash-image-preview";
  // Se abbiamo logo/foto reali del lead, usiamo image-to-image (multi-reference)
  // così Nano Banana mantiene il logo splash originale e replica le foto reali.
  const userContent: any[] = referenceImageUrls.length > 0
    ? [
        { type: "text", text: prompt },
        ...referenceImageUrls.slice(0, 4).map(url => ({ type: "image_url", image_url: { url } })),
      ]
    : prompt;
  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model,
      messages: [{ role: "user", content: userContent }],
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

    // Brand assets reali (logo + foto + frame video) estratti durante l'analisi
    const brandLogo: string | null = report.brand_logo_url || null;
    const brandPhotos: string[] = Array.isArray(report.brand_photos) ? report.brand_photos.slice(0, 3) : [];
    const brandVideoFrames: string[] = Array.isArray(report.brand_video_frames) ? report.brand_video_frames.slice(0, 3) : [];
    const brandColors: any = report.brand_colors || {};
    const primaryColor = brandColors.primary || "#C8963E";
    const accentColor = brandColors.accent || brandColors.secondary || "#0F172A";

    // PROMPT CINEMATOGRAFICO PREMIUM — qualità catalogo (luci, texture, ombre, angoli)
    const cinematicSpecs = `
═══ SPECIFICHE FOTOGRAFICHE INDEROGABILI ═══
• Render fotorealistico 8K iperrealistico stile Apple Store keynote
• Illuminazione studio professionale a 3 punti (key + fill + rim light)
• Riflessi vetro display perfetti con micro-highlight sui bordi del titanio
• Ombra naturale soft drop-shadow sotto il dispositivo (penombra realistica)
• Texture vetro Ceramic Shield del display visibile a luce radente
• Cornice titanio naturale con micro-bevel anodizzato uniforme
• Anti-aliasing perfetto su ogni testo, ZERO pixelation, ZERO motion blur
• Color grading cinematografico premium (curve filmiche, contrasto morbido)
• Grana cinematica sottile (5%) per realismo fotografico
• Sfondo: gradiente neutro studio fotografico (Apple-style backdrop sweep)
• Profondità di campo leggera dietro il dispositivo (bokeh sottile)
• Vista frontale ortogonale 0° tilt, iPhone 16 Pro Max centrato perfettamente
• Aspect ratio 9:19.5 reale del dispositivo
• Dynamic Island nera centrata in alto, status bar 9:41 + 5G + WiFi + 100%
• Home indicator iOS sottile in basso`;

    const beforePrompt = `Mockup smartphone iPhone 16 Pro Max con sito web OBSOLETO ANNI 2010 per ${businessDesc} chiamato "${report.lead_name}"${report.lead_city ? ` (${report.lead_city})` : ""}.
${brandLogo ? "USA il logo originale dell'attività mostrato nella reference image (mantienilo identico ma piccolo e mal posizionato come tipico dei siti vecchi)." : ""}
Design obsoleto: ${issues}. Caratteri serif Times New Roman, foto compresse pixelate JPEG basso, layout disordinato a tabella HTML, testi accatastati, palette colori datata (marroni #6B4423, beige sporco #C9B89A, sfondo bianco crudo #FFFFFF), nessun pulsante prenotazione, menu testo piatto, footer kilometrico con link grigi sottolineati.
Lo schermo deve mostrare un BROWSER mobile (Safari iOS) con barra URL visibile in alto che mostra "${report.lead_website || `${report.lead_name.toLowerCase().replace(/\s+/g, '')}.it`}".
${cinematicSpecs}`;

    const afterPrompt = `Mockup smartphone iPhone 16 Pro Max con APP NATIVA PREMIUM 2026 per ${businessDesc} chiamato "${report.lead_name}"${report.lead_city ? ` (${report.lead_city})` : ""}.
${brandLogo ? `🎯 USA IL LOGO ORIGINALE dell'attività (vedi reference image #1) come SPLASH HERO nell'header dell'app — grande, centrato, con glow soft. Mantieni il logo IDENTICO all'originale, non reinventarlo.` : ""}
${brandPhotos.length > 0 ? `📸 USA le foto reali dell'attività (reference images successive) per riempire le card hero/galleria/menu. Mantieni soggetti e mood originali, ricomponile in card moderne.` : ""}
${brandVideoFrames.length > 0 ? `🎬 USA i fotogrammi estratti dai video dell'attività (reference images finali) come BACKGROUND HERO cinematografico, cover sezione "Storia/Chi siamo" e immagini ambient nella galleria. Mantieni atmosfera, luci e soggetti originali — sono frame reali del cliente.` : ""}
Design 2026 ultra-moderno: dark luxury mode, palette brand del cliente (primary: ${primaryColor}, accent: ${accentColor}), tipografia Inter + Playfair Display per heading, hero immagine full-bleed in alto con glow del logo, CTA grande "Prenota Ora" full-width, menu/listino con foto reali e prezzi chiari, badge ★ recensioni, sezione "in evidenza" con 3 card, bottom navigation 5 icone (Home, Menu, Prenota, Chat AI, Profilo), micro-animazioni e gradient overlay sottili.
Microcopy 100% in italiano professionale.
${cinematicSpecs}

⛔ DIVIETI: NO testo "Empire/Lovable/Empireia", NO loghi Apple/Google/Meta, NO testo inglese nei contenuti app, NO wireframe, NO sketch — SOLO render fotografico premium.`;

    let beforeUrl: string | null = null;
    let afterUrl: string | null = null;

    // Reference images per image-to-image: logo + foto reali + frame video del lead.
    // Il "before" non deve usare il logo originale (è il sito vecchio anonimo),
    // mentre l'"after" sì → mantiene splash logo identico + foto reali + frame video del cliente.
    const afterReferences = [brandLogo, ...brandPhotos, ...brandVideoFrames].filter(Boolean) as string[];

    try {
      const [beforeData, afterData] = await Promise.all([
        // BEFORE: Pro per fedeltà render fotografico, no reference (sito anonimo)
        generateImage(LOVABLE_KEY, beforePrompt, true, []),
        // AFTER: Pro + multi-reference (logo + foto reali) per personalizzazione massima
        generateImage(LOVABLE_KEY, afterPrompt, true, afterReferences),
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
