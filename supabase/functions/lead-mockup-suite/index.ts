// Lead Mockup Suite — genera mockup mobile screen-only coerenti per portfolio/cliente.
// Engine: 'react' (gratis, lato client) | 'nano_banana' (20 crediti) | 'nano_banana_pro' (40 crediti)
// Ritorna: suite_id + array screens [{type, title, image_url}]
//
// QUALITÀ MOCKUP — strategia "fedeltà al catalogo":
// 1. Per ogni schermata cerchiamo il mockup di catalogo più affine (sector+screen)
//    e lo passiamo all'AI come REFERENCE IMAGE (image-to-image) → fedeltà visiva massima.
// 2. Quando non serve image-to-image usiamo GPT-Image-2 via images/generations,
//    più affidabile per tipografia editoriale e UI screen-only.
// 3. Se l'AI fallisce dopo tutti i retry, NON ritorniamo errore: facciamo
//    fallback automatico al render React, così l'utente vede SEMPRE 4 mockup.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { LOWENGELD_STYLES, findLowengeldStyleForSector, type LowengeldStyle } from "../_shared/lowengeld-styles.ts";

// Trova stile Lowengeld per slug esplicito o per sector-keywords auto-match
function resolveLowengeldStyle(styleSlug: string | null | undefined, sector: string | null | undefined): LowengeldStyle | null {
  if (styleSlug && typeof styleSlug === "string") {
    const explicit = LOWENGELD_STYLES.find(s => s.slug === styleSlug);
    if (explicit) return explicit;
  }
  if (sector) return findLowengeldStyleForSector(sector);
  return null;
}

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";
const IMAGE_GATEWAY = "https://ai.gateway.lovable.dev/v1/images/generations";

// ──────────────────────────────────────────────────────────────────────────────
// CATALOG REFERENCE MAP — i 42 mockup di public/mockup-references/ servono come
// "ground truth" visivo: l'AI riceve l'immagine come reference e la replica
// fedelmente cambiando solo brand/contenuti del lead.
// Hostato come asset pubblico statico, accessibile via HTTPS dal gateway AI.
// ──────────────────────────────────────────────────────────────────────────────
const PUBLIC_BASE_URL = "https://empireia.lovable.app";
const CATALOG_REFERENCES: Record<string, Partial<Record<string, string>>> = {
  // settore → screen-type → file
  legal:        { home: "legal-home.png",         services: "legal-deadlines.png", listing: "legal-case.png",       portfolio: "legal-case.png" },
  accounting:   { home: "accounting-home.png",    services: "accounting-deadlines.png", checkout: "accounting-invoice.png" },
  agriturismo:  { home: "agriturismo-home.png",   gallery: "agriturismo-rooms.png", services: "agriturismo-activities.png" },
  beach:        { home: "beach-home.png",         booking: "beach-booking.png" },
  cleaning:     { home: "cleaning-home.png",      booking: "cleaning-booking.png", services: "cleaning-schedule.png" },
  construction: { home: "construction-home.png",  services: "construction-timeline.png", portfolio: "construction-timeline.png" },
  education:    { home: "education-home.png",     services: "education-course.png", booking: "education-calendar.png" },
  electrician:  { home: "electrician-home.png",   services: "electrician-services.png", portfolio: "electrician-detail.png" },
  events:       { home: "events-home.png",        gallery: "events-detail.png", services: "events-timeline.png" },
  garage:       { home: "garage-home.png",        services: "garage-repairs.png", portfolio: "garage-detail.png" },
  gardening:    { home: "gardening-home.png",     services: "gardening-jobs.png", portfolio: "gardening-project.png" },
  legal_clinic: { home: "legal-home.png",         services: "legal-deadlines.png" },
  logistics:    { home: "logistics-home.png",     map: "logistics-tracking.png", listing: "logistics-fleet.png" },
  photography:  { home: "photography-home.png",   gallery: "photography-gallery.png", booking: "photography-calendar.png" },
  retail:       { home: "retail-home.png",        catalog: "retail-detail.png" },
  tattoo:       { home: "tattoo-home.png",        portfolio: "tattoo-portfolio.png", services: "tattoo-artist.png" },
};

// Mappa sector libero → chiave del catalogo
function resolveCatalogKey(sector: string | null | undefined): string | null {
  if (!sector) return null;
  const s = sector.toLowerCase();
  if (/legal|avvoc|notar|studio.*leg/.test(s)) return "legal";
  if (/contab|commercial|fiscal|account|consulent.*fisc/.test(s)) return "accounting";
  if (/agritur|farm|cascin/.test(s)) return "agriturismo";
  if (/spiagg|beach|bagn|stabilim|lido/.test(s)) return "beach";
  if (/puliz|clean|sanific|impres.*puliz/.test(s)) return "cleaning";
  if (/edil|costruz|impres.*edil|construc/.test(s)) return "construction";
  if (/scuol|corso|formazion|educat|academy/.test(s)) return "education";
  if (/elettric|electric|impiant.*elett/.test(s)) return "electrician";
  if (/event|wedding|matrimoni|catering/.test(s)) return "events";
  if (/officin|garage|carrozz|meccan|auto.*ripar/.test(s)) return "garage";
  if (/giardin|garden|vivaist|paesag/.test(s)) return "gardening";
  if (/logistic|trasport|spedizion|courier/.test(s)) return "logistics";
  if (/fotograf|photograph|wedding.*photo/.test(s)) return "photography";
  if (/negozi|retail|boutique|shop|abbigliam/.test(s)) return "retail";
  if (/tatu|tattoo|piercing/.test(s)) return "tattoo";
  return null;
}

// Trova reference URL ottimale per (sector, screenType)
function findCatalogReference(sector: string | null | undefined, screenType: string): string | null {
  const key = resolveCatalogKey(sector);
  if (!key) return null;
  const sectorRefs = CATALOG_REFERENCES[key];
  if (!sectorRefs) return null;
  // Match esatto sul tipo di schermata
  const exact = sectorRefs[screenType];
  if (exact) return `${PUBLIC_BASE_URL}/mockup-references/${exact}`;
  // Fallback: usa "home" del settore come reference generica
  const home = sectorRefs.home;
  return home ? `${PUBLIC_BASE_URL}/mockup-references/${home}` : null;
}

type Engine = "react" | "nano_banana" | "nano_banana_pro";
type ScreenType =
  | "home" | "menu" | "booking" | "profile" | "gallery" | "checkout"
  | "catalog" | "listing" | "dashboard" | "chat" | "map" | "stats"
  | "services" | "portfolio" | "contact";

interface ScreenConfig {
  type: ScreenType;
  title: string;
  prompt_hint?: string;
}

const DEFAULT_SCREENS: ScreenConfig[] = [
  { type: "home",     title: "Home",       prompt_hint: "prima schermata commerciale: hero fotografico credibile del business, nome brand grande, claim italiano breve, CTA principale, 2 card 'in evidenza' con prezzi reali e una sezione preview sotto" },
  { type: "services", title: "Menu",       prompt_hint: "seconda schermata catalogo: elenco servizi/prodotti con chip categorie in alto, foto piccole quadrate, descrizioni specifiche, prezzi realistici in euro, filtri e CTA contestuale — vista LISTA denza" },
  { type: "catalog",  title: "Dettaglio",  prompt_hint: "terza schermata DETTAGLIO PRODOTTO/SERVIZIO: foto grande fotorealistica in alto, titolo, rating stelle, prezzo grande, descrizione italiana, opzioni/varianti a chip, add-on con checkbox, bottone gigante 'Aggiungi al carrello' o 'Prenota' — completa e realistica come pagina detail e-commerce" },
  { type: "booking",  title: "Prenota",    prompt_hint: "quarta schermata conversione: calendario mese o step-by-step slot orari, selettore persone/opzioni, campo note, riepilogo carrello o card riassuntiva, CTA finale molto chiara con nota su cancellazione libera" },
];

// Mappa settore -> template variante consigliata (esteso 15+ settori)
function suggestTemplate(sector: string | null | undefined): string {
  if (!sector) return "modern_dark";
  const s = sector.toLowerCase();
  // Food
  if (/sushi|giapp|nikkei|asiatic|ramen/.test(s)) return "paperfish";
  if (/pizza|pizzer/.test(s)) return "strapizzami";
  if (/lusso|luxury|gourmet|stellato|michelin/.test(s)) return "luxury_gold";
  if (/casual|trattor|osteri|bistr|tavern/.test(s)) return "casual_warm";
  if (/bar|cocktail|pub|enotec|wine/.test(s)) return "noir_gold";
  // Wellness/Beauty
  if (/spa|wellness|yoga|mindful|medita/.test(s)) return "minimal_zen";
  if (/parruc|hair|barber|salone|estet|nail|beauty/.test(s)) return "blush_lavender";
  if (/palestr|gym|fitness|crossfit|personal/.test(s)) return "fitness_energy";
  // Hospitality / Beach
  if (/spiagg|beach|bagn|stabilim|lido|mare/.test(s)) return "batey";
  if (/hotel|b&b|resort|villa|relais/.test(s)) return "ocean_deep";
  // Real Estate / Trust services
  if (/immobil|real estate|agenz.*immo|agency/.test(s)) return "real_estate_trust";
  if (/legal|avvoc|notar|consulent|commercial/.test(s)) return "navy_trust";
  if (/medic|dentist|clinic|stud.*medic|fisioter/.test(s)) return "clinical_clean";
  // Auto / Mobility
  if (/ncc|noleggio|limous|chauffeur|taxi/.test(s)) return "luxury_chrome";
  if (/yacht|barca|charter|nautic/.test(s)) return "ocean_deep";
  // Retail / E-commerce
  if (/ecommerce|shop|negozio|boutique|fashion|moda/.test(s)) return "editorial_clean";
  if (/gioiel|orolog|jewel|lux.*ret/.test(s)) return "noir_gold";
  // Tech / Pro
  if (/saas|software|tech|fintech|startup|ai/.test(s)) return "glass_aurora";
  if (/agenz|market|comuni|adv|pubbl/.test(s)) return "neon_vibrant";
  return "modern_dark";
}

async function generateAIImage(
  lovableKey: string,
  prompt: string,
  pro: boolean,
  modelOverride?: string,
  referenceImageUrl?: string | null,
): Promise<string | null> {
  if (!referenceImageUrl && (pro || modelOverride === "openai/gpt-image-2")) {
    const r = await fetch(IMAGE_GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai/gpt-image-2",
        prompt,
        quality: "high",
        size: "1024x1792",
        n: 1,
        stream: false,
      }),
    });
    if (r.status === 402) throw new Error("payment_required");
    if (r.status === 429) throw new Error("rate_limited");
    if (!r.ok) throw new Error(`image_gen_error: ${r.status} ${(await r.text()).slice(0, 200)}`);
    const data = await r.json();
    const b64 = data?.data?.[0]?.b64_json;
    return b64 ? `data:image/png;base64,${b64}` : null;
  }

  const model = modelOverride || (pro ? "google/gemini-3-pro-image-preview" : "google/gemini-3.1-flash-image-preview");
  // Costruisce content multimodale: se c'è una reference image, è IMAGE-TO-IMAGE
  // (Nano Banana usa la reference come ground truth visivo e replica il layout)
  const userContent: any[] = referenceImageUrl
    ? [
        { type: "text", text: prompt },
        { type: "image_url", image_url: { url: referenceImageUrl } },
      ]
    : [{ type: "text", text: prompt }];
  // Retry con backoff esponenziale + jitter per superare rate-limit transitori
  const maxNetworkRetries = 3;
  let lastErr: Error | null = null;
  for (let attempt = 1; attempt <= maxNetworkRetries; attempt++) {
    try {
      const r = await fetch(AI_GATEWAY, {
        method: "POST",
        headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          model,
          messages: [{ role: "user", content: referenceImageUrl ? userContent : prompt }],
          modalities: ["image", "text"],
        }),
      });
      if (r.status === 429) {
        const wait = 1500 * attempt + Math.floor(Math.random() * 800);
        console.warn(`[ai-image] 429 attempt ${attempt}/${maxNetworkRetries} model=${model} — retry in ${wait}ms`);
        if (attempt === maxNetworkRetries) throw new Error("rate_limited");
        await new Promise(res => setTimeout(res, wait));
        continue;
      }
      if (r.status === 402) throw new Error("payment_required");
      if (!r.ok) {
        const txt = await r.text();
        // Retry su errori 5xx, fail su 4xx (eccetto 429 sopra)
        if (r.status >= 500 && attempt < maxNetworkRetries) {
          const wait = 1000 * attempt + Math.floor(Math.random() * 500);
          console.warn(`[ai-image] ${r.status} attempt ${attempt} — retry in ${wait}ms`);
          await new Promise(res => setTimeout(res, wait));
          continue;
        }
        throw new Error(`image_gen_error: ${r.status} ${txt.slice(0, 200)}`);
      }
      const data = await r.json();
      const url = data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
      if (!url && attempt < maxNetworkRetries) {
        console.warn(`[ai-image] empty response attempt ${attempt} — retry`);
        await new Promise(res => setTimeout(res, 800));
        continue;
      }
      return url;
    } catch (e: any) {
      lastErr = e;
      if (e.message === "rate_limited" || e.message === "payment_required") throw e;
      if (attempt === maxNetworkRetries) throw e;
      await new Promise(res => setTimeout(res, 1000 * attempt));
    }
  }
  throw lastErr || new Error("image_gen_failed");
}

async function uploadDataUrl(client: any, dataUrl: string, path: string): Promise<string | null> {
  try {
    const m = dataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!m) return null;
    const mime = m[1];
    const bytes = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
    const { error } = await client.storage.from("media-vault").upload(path, bytes, { contentType: mime, upsert: true });
    if (error) { console.error("upload err", error); return null; }
    const { data: pub } = client.storage.from("media-vault").getPublicUrl(path);
    return pub?.publicUrl ?? null;
  } catch (e) {
    console.error("uploadDataUrl", e);
    return null;
  }
}

// ──────────────────────────────────────────────────────────────────────────────
// VALIDAZIONE AUTOMATICA — verifica via vision-AI che il mockup NON contenga:
//   • branding vietato (Empire / Empire AI / Empireia / Lovable)
//   • testo in inglese nei contenuti dell'app (status bar iOS esclusa)
//   • loghi di terze parti (Apple/Google/Meta brand visibili)
//   • iPhone non centrato / tiltato
// In caso di violazioni ritorna issues[] dettagliati per il retry mirato.
// ──────────────────────────────────────────────────────────────────────────────
async function validateMockupImage(
  lovableKey: string,
  dataUrl: string,
): Promise<{ ok: boolean; issues: string[]; raw?: string }> {
  try {
    const r = await fetch(AI_GATEWAY, {
      method: "POST",
      headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Sei un validatore qualità mockup iPhone. Ispeziona TUTTO il testo visibile nel display. Rispondi SOLO con JSON valido nello schema richiesto.",
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: `Ispeziona questo mockup iPhone e rispondi SOLO con JSON in questo formato esatto:
{
  "has_forbidden_branding": boolean,
  "forbidden_branding_found": string[],
  "has_english_content": boolean,
  "english_phrases_found": string[],
  "has_third_party_logos": boolean,
  "third_party_logos_found": string[],
  "iphone_centered_no_tilt": boolean,
  "overall_ok": boolean,
  "notes": string
}

REGOLE:
- "has_forbidden_branding" = true SOLO se vedi chiaramente la parola esatta "Empire", "Empire AI", "Empire AI Group", "Empireia" o "Lovable" come testo del brand. Una "E" stilizzata da sola NON è branding vietato.
- "has_english_content" = true SOLO se vedi 3 o più frasi/parole inglesi distinte nei CONTENUTI dell'app (titoli sezioni, CTA grandi, descrizioni). IGNORA: status bar iOS (orario, %, 5G, WiFi), nomi propri di prodotti/servizi che possono essere internazionali (es. "Spa", "Brunch", "Wellness", "Loyalty"), parole italiane d'uso comune anche se di origine inglese (es. "Bar", "Sport", "App", "Online").
- "has_third_party_logos" = true SOLO se vedi loghi RICONOSCIBILI di Apple (mela), Google (G colorata), Meta, Instagram (camera multicolore), Facebook (f blu), WhatsApp (telefono verde) ecc. Icone generiche stilizzate (cuore, casa, profilo) NON sono loghi terzi.
- "iphone_centered_no_tilt" = true se l'iPhone è sostanzialmente frontale e centrato (tolleranza ±5° di rotazione e ±10% di offset accettata). Solo evidenti prospettive 3D estreme o tilt > 15° sono "false".
- "overall_ok" = true SOLO se has_forbidden_branding=false E has_english_content=false E has_third_party_logos=false E iphone_centered_no_tilt=true.
- Sii TOLLERANTE: in caso di dubbio rispondi sempre con il valore "ok" (false sui flag has_*, true su iphone_centered_no_tilt). Meglio approvare un mockup imperfetto che bocciarne uno valido.
- Rispondi SOLO il JSON, niente altro testo.`,
              },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        response_format: { type: "json_object" },
      }),
    });
    if (!r.ok) {
      console.warn("[validate] http error", r.status);
      return { ok: true, issues: [], raw: `validator_http_${r.status}` }; // fail-open
    }
    const data = await r.json();
    const raw = data?.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const issues: string[] = [];
    if (parsed.has_forbidden_branding) {
      issues.push(`branding_forbidden:${(parsed.forbidden_branding_found || []).join("|")}`);
    }
    if (parsed.has_english_content) {
      issues.push(`english_content:${(parsed.english_phrases_found || []).slice(0, 3).join("|")}`);
    }
    if (parsed.has_third_party_logos) {
      issues.push(`third_party_logos:${(parsed.third_party_logos_found || []).join("|")}`);
    }
    if (parsed.iphone_centered_no_tilt === false) {
      issues.push("iphone_not_centered_or_tilted");
    }
    // ok se nessun issue critico (centratura considerata "soft" — ammessa se è l'unico problema)
    const criticalIssues = issues.filter(i => !i.startsWith("iphone_not_centered"));
    return { ok: criticalIssues.length === 0, issues, raw };
  } catch (e) {
    console.warn("[validate] exception", e);
    return { ok: true, issues: [], raw: `validator_exception` }; // fail-open
  }
}

function buildCorrectionSuffix(issues: string[]): string {
  const lines: string[] = [];
  if (issues.some(i => i.startsWith("branding_forbidden"))) {
    lines.push("⛔ CORREZIONE OBBLIGATORIA: il render PRECEDENTE conteneva il brand 'Empire/Empire AI/Empireia/Lovable'. RIMUOVI COMPLETAMENTE qualsiasi occorrenza di queste parole. Usa SOLO il nome dell'attività del cliente.");
  }
  if (issues.some(i => i.startsWith("english_content"))) {
    lines.push("⛔ CORREZIONE OBBLIGATORIA: il render PRECEDENTE conteneva testo in INGLESE nei contenuti dell'app. Ogni titolo, CTA, descrizione e label DEVE essere in italiano professionale. Niente 'Sign in', 'Book now', 'Add to cart', 'Welcome', ecc.");
  }
  if (issues.some(i => i.startsWith("third_party_logos"))) {
    lines.push("⛔ CORREZIONE OBBLIGATORIA: il render PRECEDENTE conteneva loghi di terze parti (Apple/Google/Meta). RIMUOVI tutti i loghi di brand esterni.");
  }
  if (issues.some(i => i.startsWith("iphone_not_centered"))) {
    lines.push("⛔ CORREZIONE OBBLIGATORIA: l'iPhone DEVE essere perfettamente centrato, frontale ortogonale, ZERO prospettiva 3D, ZERO tilt.");
  }
  return lines.length === 0 ? "" : `\n\n═══ CORREZIONE RICHIESTA (TENTATIVO PRECEDENTE FALLITO) ═══\n${lines.join("\n")}\n`;
}

async function generateValidatedAIImage(
  lovableKey: string,
  basePrompt: string,
  pro: boolean,
  maxAttempts = 5,
  referenceImageUrl?: string | null,
): Promise<{ dataUrl: string | null; attempts: number; lastIssues: string[]; validated: boolean; engine_used: string }> {
  let lastIssues: string[] = [];
  let lastDataUrl: string | null = null;
  // Quando c'è un catalog reference, forziamo SEMPRE Pro (qualità top per replica fedele)
  const forcePro = pro || !!referenceImageUrl;
  let engineUsed = forcePro ? "nano_banana_pro" : "nano_banana_2";
  if (referenceImageUrl) {
    engineUsed = pro ? "nano_banana_pro_catalog_ref" : "nano_banana_pro_catalog_ref_auto";
    console.log(`[validate] catalog reference attiva → ${referenceImageUrl} (engine=${engineUsed})`);
  }
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const prompt = attempt === 1 ? basePrompt : basePrompt + buildCorrectionSuffix(lastIssues);
    // AUTO-UPGRADE: gli ultimi 2 tentativi usano il modello Pro (più affidabile e accurato)
    // per recuperare casi difficili senza richiedere intervento manuale dell'utente.
    const usePro = forcePro || attempt >= maxAttempts - 1;
    const modelOverride = usePro ? "google/gemini-3-pro-image-preview" : undefined;
    if (!forcePro && attempt >= maxAttempts - 1) {
      engineUsed = "nano_banana_pro_fallback";
      console.log(`[validate] attempt ${attempt}: AUTO-UPGRADE a Nano Banana Pro per garantire qualità`);
    }
    let dataUrl: string | null = null;
    try {
      dataUrl = await generateAIImage(lovableKey, prompt, usePro, modelOverride, referenceImageUrl);
    } catch (e: any) {
      console.warn(`[validate] attempt ${attempt} generation error: ${e.message}`);
      lastIssues = [`gen_error:${e.message?.slice(0, 80) || "unknown"}`];
      // su rate_limited aspetta più a lungo
      if (e.message === "rate_limited") {
        await new Promise(r => setTimeout(r, 3000 + Math.random() * 2000));
      }
      continue;
    }
    lastDataUrl = dataUrl;
    if (!dataUrl) {
      lastIssues = ["no_image_returned"];
      continue;
    }
    const v = await validateMockupImage(lovableKey, dataUrl);
    console.log(`[validate] attempt ${attempt}/${maxAttempts} engine=${engineUsed} ok=${v.ok} issues=${JSON.stringify(v.issues)}`);
    if (v.ok) return { dataUrl, attempts: attempt, lastIssues: v.issues, validated: true, engine_used: engineUsed };
    lastIssues = v.issues;
  }
  // Tutti i tentativi falliti: ritorniamo l'ultima immagine generata comunque (meglio mostrare qualcosa che niente)
  console.warn(`[validate] FINAL FAIL after ${maxAttempts} attempts. issues=${JSON.stringify(lastIssues)} hasImage=${!!lastDataUrl}`);
  return { dataUrl: lastDataUrl, attempts: maxAttempts, lastIssues, validated: false, engine_used: engineUsed };
}

// ──────────────────────────────────────────────────────────────────────────────
// VARIATION SYSTEM — fa sì che le 4 schermate siano sempre diverse tra loro
// (layout, densità, ordine sezioni, componenti) anche con stesso lead+template.
// ──────────────────────────────────────────────────────────────────────────────
const LAYOUT_VARIATIONS = [
  { key: "lowengeld-hero", desc: "HOME portfolio app: hero fotografico alto, brand evidente, CTA e 2 card prodotto sotto; composizione da app reale, non poster" },
  { key: "lowengeld-catalog", desc: "CATALOGO/servizi: search, chip categorie, lista/card con prezzi e foto; densità alta ma ordinata" },
  { key: "lowengeld-action", desc: "PRENOTAZIONE/ordine: stepper, calendario o riepilogo, form essenziale, CTA sticky; schermata chiaramente diversa ma stesso brand" },
];

const COMPONENT_VARIATIONS = [
  "segmented control in alto + tab switcher",
  "search bar sticky + filtri chip + ordina-per dropdown",
  "stories carousel circolare + categorie a pill",
  "banner promo sticky + lista verticale + FAB azione primaria",
  "header collassabile + grid bento 2 colonne + bottom sheet preview",
  "hero card singola + CTA grande + lista compatta sotto",
];

function pickByIndex<T>(arr: T[], seed: number, index: number): T {
  return arr[(seed + index * 7) % arr.length];
}

function buildScreenPrompt(
  screen: ScreenConfig,
  business: { name: string; sector: string; city: string },
  templateVariant: string,
  primaryColor: string,
  pro: boolean,
  variationSeed: number,
  variantIndex: number,
  hasCatalogReference: boolean = false,
  brandContext?: {
    hasLogo?: boolean;
    hasBrandPhotos?: boolean;
    brandPhotosCount?: number;
    deepReport?: string;
    glassIntensity?: number;
    colorStyle?: string;
    safeAreaPx?: number;
    typeScale?: number;
    boostContrast?: boolean;
    lowengeld?: { style_name: string; palette: string; vibe: string; screen_labels: [string, string, string, string] } | null;
  },
  device: "mobile" | "desktop" = "mobile",
): string {
  const isDesktop = device === "desktop";
  const styleMap: Record<string, string> = {
    paperfish:        "DARK SAKURA LUXURY giapponese: nero obsidian #0E0B0F, sakura pink #E89BAE, oro caldo #C9A86A. Font Cormorant Garamond serif elegante per heading, Inter per body. Texture carta giapponese sottile, ideogrammi kanji decorativi minimali",
    strapizzami:      "WARM CREAM TERRACOTTA artigianale italiano: crema #F5EBD8, terracotta #C84A2A, oro #B8893E. Font handwritten Caveat per accenti + Manrope sans bold. Texture forno a legna, atmosfera napoletana autentica",
    batey:            "AZURE CARIBBEAN tropical-luxury: deep ocean #08131F, azure #5CC8D9, sand #E8D5A8, coral #FF8966. Font Outfit modern sans. Atmosfera Tulum/Maldive premium",
    luxury_gold:      "LUXURY GOLD Michelin: nero #1A1410, oro #D4AF37, bianco caldo #F5F0E0. Font Playfair Display serif + Cormorant. Stelle Michelin sottili decorative",
    modern_dark:      "MODERN DARK 2026: slate #0F172A, accent oro #C8963E, ghiaccio #F8FAFC. Font Inter + Space Grotesk. Estetica Linear/Vercel premium tech",
    casual_warm:      "CASUAL WARM accogliente: panna #FAF6F0, corallo #E07856, salvia #87A878. Font Nunito rounded + DM Sans. Vibes bistrot familiare",
    minimal_zen:      "MINIMAL ZEN giapponese: bianco #F8F8F8, nero #222, accenti grigio caldo. Font Helvetica Neue Light. Spazi vuoti meditativi, linee sottili",
    noir_gold:        "NOIR GOLD speakeasy: nero assoluto #0D0D0D, oro brillante #C9A84C, bordeaux #6B1F2C. Font DM Serif Display + Inter. Atmosfera bar di lusso anni '20",
    blush_lavender:   "BLUSH LAVENDER beauty: rosa cipria #F8E8EE, lavanda #C9A0DC, oro rosa #E8B4B8. Font Cormorant + Karla. Estetica beauty editorial Vogue",
    fitness_energy:   "FITNESS ENERGY: nero matte #1B1B1B, lime acceso #C7FF3A, grigio antracite. Font Bebas Neue + Barlow. Vibes Nike/Whoop performance",
    ocean_deep:       "OCEAN DEEP hospitality: navy #0C2340, teal #2D8A9E, mint #5CBDB9, sabbia. Font Sora + Manrope. Atmosfera resort 5 stelle",
    real_estate_trust:"REAL ESTATE TRUST: navy fondo #0F1B3D, oro #C9A84C, bianco perla, beige caldo. Font Libre Baskerville + IBM Plex Sans. Stile agenzia immobiliare di prestigio",
    navy_trust:       "NAVY TRUST law/finance: navy profondo #0F1B3D, bianco #E8EDF3, oro #C9A84C. Font Libre Baskerville + Inter. Stile studio legale top tier",
    clinical_clean:   "CLINICAL CLEAN medical: bianco #FAFBFC, blu medico #2563EB, verde menta #5CC8B7. Font Outfit + Inter. Estetica clinica premium",
    luxury_chrome:    "LUXURY CHROME automotive: nero piano #0A0A0A, argento cromato #C0C0C0, accent rosso ferrari opzionale. Font Archivo Black + Inter. Stile Mercedes/Bentley",
    editorial_clean:  "EDITORIAL CLEAN fashion: bianco #FAFBFC, nero #0D0D0D, accent unico (mint o coral). Font Instrument Serif + Work Sans. Stile Aesop/COS minimal magazine",
    glass_aurora:     "GLASS AURORA fintech: dark navy #1A1A2E, glass purple #A78BFA, mint glow #4ADE80, iridescente. Font Space Grotesk + Inter. Glassmorphism premium",
    neon_vibrant:     "NEON VIBRANT agency: nero #0A0A0A, magenta #FF006E, ciano #00F5D4, giallo #FEE440. Font Archivo Black + Space Mono. Energia creativa esplosiva",
  };
  const style = styleMap[templateVariant] || styleMap.modern_dark;

  const navMap: Record<string, string> = {
    real_estate_trust: "Home, Annunci, Mappa, Agenti, Profilo",
    navy_trust: "Home, Servizi, Appuntamenti, Documenti, Profilo",
    clinical_clean: "Home, Visite, Cartella, Chat Dottore, Profilo",
    luxury_chrome: "Home, Flotta, Prenota, Tracking, Profilo",
    editorial_clean: "Shop, Categorie, Carrello, Wishlist, Account",
    glass_aurora: "Dashboard, Analytics, Workflow, Team, Profilo",
    fitness_energy: "Home, Workout, Schedule, Progressi, Profilo",
    blush_lavender: "Home, Servizi, Prenota, Galleria, Profilo",
    paperfish: "Home, Menu, Prenota, Profilo, AI Sushi",
    strapizzami: "Home, Menu, Ordina, Galleria, Profilo",
  };
  const bottomNav = navMap[templateVariant] || "Home, Esplora, Prenota, Profilo, Chat AI";

  const quality = pro
    ? `QUALITÀ UI PORTFOLIO PREMIUM:
       • screen-only verticale 9:19.5, nitido come screenshot finale di app pubblicata
       • tipografia leggibile, gerarchia editoriale, nessun testo fuso o deformato
       • immagini dentro l'interfaccia realistiche e pertinenti al business
       • spacing coerente iOS, componenti rifiniti, contrasti alti
       • risultato simile a una case-study card Lowengeld: app concreta, vendibile, non poster generico`
    : `Qualità UI premium: screen-only verticale, testo leggibile, componenti app reali, spacing iOS coerente`;

  // VARIATION: layout + componenti diversi per ogni screen
  const layout = pickByIndex(LAYOUT_VARIATIONS, variationSeed, variantIndex);
  const components = pickByIndex(COMPONENT_VARIATIONS, variationSeed + 3, variantIndex);
  const accentRotation = ["più caldo", "più freddo", "più saturo", "più desaturato"][variantIndex % 4];

  const catalogDirective = hasCatalogReference
    ? `\n\n═══ 📸 IMMAGINE DI RIFERIMENTO (REGOLA #1 — PRIORITÀ MASSIMA) ═══
🎯 In allegato c'è un'IMMAGINE DI RIFERIMENTO dal nostro catalogo di mockup approvati + (se presenti) il LOGO REALE del cliente "${business.name}" e foto reali del suo brand estratte dal sito ufficiale.
DEVI replicare FEDELMENTE quella reference per:
• Layout strutturale (posizione header, hero, card, bottom-nav)
• Densità e gerarchia delle informazioni
• Tipologia di componenti UI usati (chip, card, lista, griglia)
• Proporzioni e spazi
• Stile fotografico, qualità del render, illuminazione
SOSTITUISCI SOLO:
• Brand/logo → con il LOGO REALE del cliente (se in allegato) oppure il nome "${business.name}" in tipografia coerente
• Contenuti testuali → adattati al settore "${business.sector}" e al brand reale del cliente
• Palette accent → adattata a ${primaryColor} (mantenendo i contrasti)
• Foto dei prodotti/servizi → usare le FOTO REALI del cliente in allegato quando coerenti, altrimenti foto fotorealistiche pertinenti
NON cambiare la STRUTTURA visiva della reference: la qualità di quella reference è
ESATTAMENTE il livello che devi raggiungere.\n`
    : "";

  // ═══ BRAND CONTEXT REALE (Lead) — usato per personalizzare contenuti
  const brand = brandContext || {};
  const brandLines: string[] = [];
  if (brand.hasLogo) {
    brandLines.push(`• 🪪 LOGO REALE ALLEGATO: integralo nell'header dell'app (in alto a sinistra o centrato secondo layout) MANTENENDONE forma, proporzioni e colori originali. NON ridisegnarlo, NON sostituirlo con testo.`);
  }
  if (brand.hasBrandPhotos && (brand.brandPhotosCount || 0) > 0) {
    brandLines.push(`• 📷 FOTO BRAND ALLEGATE (${brand.brandPhotosCount}): usale come immagini reali nei card/hero/galleria della schermata. Sono foto autentiche del cliente: NON sostituirle con stock.`);
  }
  if (brand.deepReport && brand.deepReport.length > 20) {
    const summary = brand.deepReport.slice(0, 600);
    brandLines.push(`• 📊 ANALISI DEL BRAND (sintesi reale): ${summary}\n  → Usa questi dettagli per personalizzare claim, descrizioni servizi, microcopy. NIENTE testo generico.`);
  }
  if (typeof brand.glassIntensity === "number") {
    const lvl = brand.glassIntensity;
    const glassDesc = lvl >= 0.7 ? "vetro intenso (glassmorphism marcato, blur 24px, trasparenze evidenti)"
                    : lvl >= 0.4 ? "vetro bilanciato (glassmorphism moderato, blur 12px)"
                    : "solido (zero glassmorphism, superfici opache)";
    brandLines.push(`• 🪟 Intensità superfici: ${glassDesc}`);
  }
  if (brand.colorStyle && brand.colorStyle !== "vivid") {
    const csMap: Record<string, string> = {
      muted: "palette desaturata −25% (mood elegante e sottotono)",
      pastel: "palette pastello soft (luminosità alta, saturazione bassa)",
      mono: "palette monocromatica B/N con UN SOLO accento colorato",
    };
    brandLines.push(`• 🎨 Stile cromatico: ${csMap[brand.colorStyle] || brand.colorStyle}`);
  }
  if (brand.boostContrast) {
    brandLines.push(`• ♿ Contrasto boost ON: testi sempre WCAG AAA, CTA con contrasto massimo sul bg`);
  }
  if (typeof brand.typeScale === "number" && brand.typeScale !== 1) {
    brandLines.push(`• 🔠 Scala tipografica: ×${brand.typeScale.toFixed(2)} (titoli e body proporzionati)`);
  }
  if (brand.lowengeld) {
    const lw = brand.lowengeld;
    brandLines.push(`• 🎨 DIREZIONE STILISTICA (portfolio Lowengeld-grade): stile "${lw.style_name}" — palette: ${lw.palette}. Vibe: ${lw.vibe}. Applica questa palette e questo mood a TUTTA la UI (background, superfici, tipografia, iconografia), mantenendo però il logo/foto reali del brand del cliente. La reference in allegato ha esattamente questa direzione: replicane la finezza tipografica, la densità e la qualità fotografica.`);
  }
  const brandDirective = brandLines.length
    ? `\n═══ 🏷️ BRAND REALE DEL CLIENTE (REGOLA PRIORITARIA) ═══\n${brandLines.join("\n")}\n`
    : "";

  const formatBlock = isDesktop
    ? `═══ FORMATO OUTPUT (REGOLE INDEROGABILI) ═══
• SOLO UI DEL VIEWPORT BROWSER, SENZA laptop/monitor/cornice fisica, SENZA ombra esterna
• Canvas ORIZZONTALE 16:10 (~1920×1200), riempito al 100% dall'interfaccia web
• In alto: barra Chrome/Safari finta con 3 pallini (rosso/giallo/verde), tab attivo con favicon e titolo del brand, address bar con "https://${business.name.toLowerCase().replace(/[^a-z0-9]+/g, "")}.it"
• Sotto la barra browser: sito web landing/dashboard responsivo desktop full-width
• Deve poter essere inserito dentro un frame browser esterno senza doppia cornice`
    : `═══ FORMATO OUTPUT (REGOLE INDEROGABILI) ═══
• SOLO UI DELLO SCHERMO, SENZA telefono, SENZA cornice, SENZA ombra esterna
• Canvas verticale 9:19.5, riempito al 100% dall'interfaccia
• Safe area iOS interna già inclusa: status bar, dynamic island e home indicator fanno parte della UI
• Nessun testo o decorazione fuori dalla UI
• Deve poter essere inserito dentro un frame iPhone esterno senza doppia cornice`;

  const componentsBlock = isDesktop
    ? `═══ UI COMPONENTS OBBLIGATORI INTERNI ALLO SCREEN (DESKTOP WEB) ═══
• Chrome/Safari browser bar in alto con 3 pallini finestra, tab, address bar https, icone estensioni
• Header sito full-width con logo brand a sinistra, nav orizzontale (5-6 voci), CTA a destra
• Hero section grande con foto/video di sfondo e claim italiano tipografia editoriale
• Layout multi-colonna (2-3 colonne) con card, prezzi, gallery, form
• Footer completo con contatti, orari, social, mappa embed, P.IVA placeholder
• Densità informativa desktop: usa tutto lo spazio orizzontale, no vuoti mobile-like
• Micro-interazioni suggerite: hover states, badge, tooltip, breadcrumb`
    : `═══ UI COMPONENTS OBBLIGATORI INTERNI ALLO SCREEN (MOBILE iOS) ═══
• Status bar iOS in alto: ora 9:41, segnale 5G, WiFi, batteria 100%
• Dynamic Island nera centrata in alto
• Header app con titolo schermata coerente
• Contenuto ben spaziato, gerarchia tipografica chiara
• Card con border-radius 16-20px e ombre soft
• Bottom navigation bar fissa con 5 icone (${bottomNav}), attiva colorata col primary
• Home indicator iOS sottile in basso
• CTA primari grandi (52px altezza), full-width`;

  const forbiddenDevice = isDesktop
    ? "🚫 VIETATO laptop/monitor/tastiera/mouse/mano/desk/mockup device esterno · niente cornice fisica, solo la UI browser piatta"
    : "🚫 VIETATO telefono/cornice iPhone/tilt/prospettive 3D/mockup device esterno";

  return `SCREEN UI ${isDesktop ? "DESKTOP WEB" : "MOBILE"} PREMIUM — schermata "${screen.title}" (${variantIndex + 1}/${isDesktop ? 4 : 3} · seed ${variationSeed}) di ${isDesktop ? "un sito web reale" : "un'app reale"} per "${business.name}" (${business.sector}${business.city ? ` · ${business.city}` : ""}).${catalogDirective}${brandDirective}

${formatBlock}

═══ CONTENUTO SCHERMATA (PERTINENTE AL SETTORE) ═══
${screen.prompt_hint || screen.title}
Il contenuto deve essere AUTENTICO per il settore "${business.sector}":
• Nomi servizi/prodotti realistici tipici del settore italiano
• Prezzi in € credibili e coerenti col mercato italiano
• Indirizzi italiani plausibili, orari formato 24h
• Microcopy 100% in italiano professionale (zero inglese eccetto status bar iOS)
• ZERO testo placeholder/lorem ipsum/finto

═══ COERENZA LOWENGELD-STYLE TRA LE SCHERMATE ═══
🎨 Questa è la schermata #${variantIndex + 1}: deve essere diversa nella FUNZIONE, non un altro stile scollegato.
• Layout di QUESTA schermata: ${layout.desc}
• Componenti UI specifici: ${components}
• Mantieni stessi font, palette, logo, radius e stile iconografico su tutte le schermate
• Cambia solo architettura e contenuti in base alla funzione
• Niente cambi colore casuali: usa ${primaryColor} come accento costante, solo micro-variazione ${accentRotation} sugli stati attivi
• Deve sembrare una suite di screenshot dello stesso prodotto, pronta per portfolio cliente

═══ STILE GRAFICO ═══
${style}
Colore primario brand del cliente (accent CTA principale): ${primaryColor}

${componentsBlock}

═══ QUALITÀ ═══
${quality}

═══ DIVIETI ASSOLUTI ═══
🚫 VIETATO scrivere "Empire", "Empire AI", "Empire AI Group", "Lovable", "Empireia"
🚫 VIETATO loghi Apple, Google, Meta o brand di terze parti
🚫 VIETATO testo in inglese nei contenuti (eccetto url e status bar iOS)
${forbiddenDevice}
🚫 VIETATO testo distorto, lorem ipsum, placeholder generici
🚫 VIETATO mockup wireframe o sketch
🚫 VIETATO che le schermate sembrino template uguali con colori cambiati`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;
    const LOVABLE_KEY = Deno.env.get("LOVABLE_API_KEY");

    const adminClient = createClient(SUPABASE_URL, SERVICE_KEY);

    // Auth
    const authHeader = req.headers.get("Authorization");
    let userId: string | null = null;
    let userClient: any = null;
    if (authHeader) {
      userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
      const { data: u } = await userClient.auth.getUser();
      userId = u?.user?.id ?? null;
    }
    if (!userId || !userClient) {
      return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const body = await req.json();
    const {
      business_name,
      business_sector = "",
      business_city = "",
      engine = "react" as Engine,
      template_variant: templateVariantInput,
      primary_color = "#C8963E",
      lead_id,
      preview_id,
      screens: screensInput,
      variation_seed: variationSeedInput,
      // ── Brand reali del lead (usati per personalizzare prompt + reference image) ──
      brand_logo_url: brandLogoUrlInput,
      brand_photos: brandPhotosInput,
      deep_report: deepReportInput,
      glass_intensity: glassIntensityInput,
      color_style: colorStyleInput,
      safe_area_px: safeAreaInput,
      type_scale: typeScaleInput,
      boost_contrast: boostContrastInput,
      // ── Stile Lowengeld esplicito (portfolio-quality mockups) ──
      style_slug: styleSlugInput,
    } = body;
    const styleSlug: string | null = typeof styleSlugInput === "string" && styleSlugInput.trim() ? styleSlugInput.trim() : null;
    const lowengeldStyle = resolveLowengeldStyle(styleSlug, business_sector);
    const brandLogoUrl: string | null = typeof brandLogoUrlInput === "string" && brandLogoUrlInput.startsWith("http") ? brandLogoUrlInput : null;
    const brandPhotos: string[] = Array.isArray(brandPhotosInput)
      ? brandPhotosInput.filter((u: any) => typeof u === "string" && u.startsWith("http")).slice(0, 4)
      : [];
    const deepReport: string = typeof deepReportInput === "string" ? deepReportInput : "";
    const brandContext = {
      hasLogo: !!brandLogoUrl,
      hasBrandPhotos: brandPhotos.length > 0,
      brandPhotosCount: brandPhotos.length,
      deepReport,
      glassIntensity: typeof glassIntensityInput === "number" ? glassIntensityInput : undefined,
      colorStyle: typeof colorStyleInput === "string" ? colorStyleInput : undefined,
      safeAreaPx: typeof safeAreaInput === "number" ? safeAreaInput : undefined,
      typeScale: typeof typeScaleInput === "number" ? typeScaleInput : undefined,
      boostContrast: !!boostContrastInput,
      lowengeld: lowengeldStyle ? {
        style_name: lowengeldStyle.style_name,
        palette: lowengeldStyle.palette,
        vibe: lowengeldStyle.vibe,
        screen_labels: lowengeldStyle.screen_labels,
      } : null,
    };
    if (lowengeldStyle) {
      console.log(`[mockup-suite] lowengeld style locked → ${lowengeldStyle.slug} (${lowengeldStyle.style_name}) for sector "${business_sector}"`);
    }
    const variationSeed: number = Number.isFinite(Number(variationSeedInput))
      ? Number(variationSeedInput)
      : Math.floor(Math.random() * 1_000_000);

    if (!business_name?.trim()) {
      return new Response(JSON.stringify({ error: "business_name_required" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }
    if (!["react", "nano_banana", "nano_banana_pro"].includes(engine)) {
      return new Response(JSON.stringify({ error: "invalid_engine" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const templateVariant = templateVariantInput || suggestTemplate(business_sector);
    const screens: ScreenConfig[] = (Array.isArray(screensInput) && screensInput.length > 0)
      ? screensInput.slice(0, 3).map((s: any) => ({
          type: s.type || "home",
          title: s.title || "Schermata",
          prompt_hint: s.prompt_hint || DEFAULT_SCREENS.find(d => d.type === s.type)?.prompt_hint,
        }))
      : DEFAULT_SCREENS;

    // Crediti (saltato per react = costo 0, ma logghiamo lo stesso)
    const creditAction = `mockup_suite_${engine}`;
    const { data: creditCheck } = await userClient.rpc("consume_seller_credits", {
      p_action: creditAction,
      p_metadata: { business_name, engine, template_variant: templateVariant, lead_id, preview_id },
    });
    if (!creditCheck?.success) {
      return new Response(JSON.stringify({ success: false, error: creditCheck?.error || "credit_error", details: creditCheck }), {
        status: 402,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const creditsSpent = creditCheck?.credits_used ?? 0;
    const shareSlug = crypto.randomUUID().slice(0, 12);

    // Pre-insert suite con stato generating
    const { data: suite, error: insErr } = await adminClient
      .from("seller_mockup_suites")
      .insert({
        owner_id: userId,
        lead_id: lead_id || null,
        preview_id: preview_id || null,
        business_name,
        business_sector,
        business_city,
        template_variant: templateVariant,
        engine,
        primary_color,
        share_slug: shareSlug,
        screens: [],
        status: "generating",
        credits_spent: creditsSpent,
      })
      .select()
      .single();

    if (insErr || !suite) {
      console.error("insert suite err", insErr);
      return new Response(JSON.stringify({ success: false, error: "db_insert_failed", details: insErr?.message }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // ENGINE = REACT: nessuna AI image, ritorna config — il client renderizza via html2canvas
    if (engine === "react") {
      const reactScreens = screens.map((s, i) => ({
        type: s.type,
        title: s.title,
        image_url: null,
        render_mode: "react" as const,
        template_variant: templateVariant,
        variation_seed: variationSeed,
        variant_index: i,
      }));
      await adminClient
        .from("seller_mockup_suites")
        .update({ screens: reactScreens, status: "complete", generated_at: new Date().toISOString() })
        .eq("id", suite.id);

      return new Response(JSON.stringify({
        success: true,
        suite_id: suite.id,
        share_slug: shareSlug,
        engine,
        template_variant: templateVariant,
        screens: reactScreens,
        credits_spent: creditsSpent,
        variation_seed: variationSeed,
        message: "React render mode — il client genera gli screenshot dei template",
      }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // ENGINE = AI (nano_banana o nano_banana_pro)
    if (!LOVABLE_KEY) {
      await adminClient.from("seller_mockup_suites").update({ status: "error", error_message: "LOVABLE_API_KEY missing" }).eq("id", suite.id);
      return new Response(JSON.stringify({ success: false, error: "lovable_ai_not_configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const pro = engine === "nano_banana_pro";
    const business = { name: business_name, sector: business_sector || "attività commerciale", city: business_city || "Italia" };

    // ═══════════════════════════════════════════════════════════════════════
    // BACKGROUND JOB — il lavoro AI (4 immagini × fino a 5 tentativi + validazione
    // + upload) può richiedere 2-4 minuti. Edge function ha limite 150s, quindi
    // processiamo in background con EdgeRuntime.waitUntil e il client polla
    // la tabella seller_mockup_suites finché status diventa "complete"/"error".
    // ═══════════════════════════════════════════════════════════════════════
    const backgroundJob = (async () => {
      // Reference image priorità:
      //   1) LOGO REALE del lead (sempre, su tutte le schermate per coerenza brand)
      //   2) Brand photo del lead (round-robin per varietà visiva)
      //   3) Stile Lowengeld (auto-match settore o esplicito via style_slug) — portfolio-grade
      //   4) Catalog reference per il settore/tipo schermata (fallback ultimo)
      const catalogRefs: (string | null)[] = screens.map(s => findCatalogReference(business_sector, s.type));
      const lowRef: string | null = lowengeldStyle?.ref_url || null;
      const screenReferences: (string | null)[] = screens.map((s, i) => {
        if (brandLogoUrl) return brandLogoUrl;
        if (brandPhotos.length > 0) return brandPhotos[i % brandPhotos.length];
        if (lowRef) return lowRef;
        return catalogRefs[i];
      });
      const refSource = brandLogoUrl ? "brand_logo" : (brandPhotos.length > 0 ? "brand_photos" : (lowRef ? `lowengeld:${lowengeldStyle!.slug}` : "catalog"));
      const refCount = screenReferences.filter(Boolean).length;
      console.log(`[mockup-suite] reference source=${refSource} → ${refCount}/${screens.length} schermate avranno reference image`);

      try {
        const imageResults: Awaited<ReturnType<typeof generateValidatedAIImage>>[] = [];
        const concurrency = 2;
        for (let i = 0; i < screens.length; i += concurrency) {
          const batch = screens.slice(i, i + concurrency);
          const batchResults = await Promise.all(
            batch.map((s, k) => {
              const screenIdx = i + k;
              const refUrl = screenReferences[screenIdx];
              return generateValidatedAIImage(
                LOVABLE_KEY,
                buildScreenPrompt(s, business, templateVariant, primary_color, pro, variationSeed, screenIdx, !!refUrl, brandContext, device),
                pro,
                5,
                refUrl,
                device,
              );
            })
          );
          imageResults.push(...batchResults);
          if (i + concurrency < screens.length) {
            await new Promise(r => setTimeout(r, 400));
          }
        }

        const uploadPromises = imageResults.map((res, i) =>
          res.dataUrl ? uploadDataUrl(adminClient, res.dataUrl, `mockup-suites/${userId}/${suite.id}/${i}-${screens[i].type}-v${variationSeed}.png`) : Promise.resolve(null)
        );
        const publicUrls = await Promise.all(uploadPromises);

        // ─────────────────────────────────────────────────────────────────
        // FALLBACK: per ogni schermata SENZA immagine AI, attiviamo il
        // render React come fallback fedele al catalogo (gratis, sempre OK)
        // ─────────────────────────────────────────────────────────────────
        const finalScreens = screens.map((s, i) => {
          const hasImage = !!publicUrls[i];
          if (hasImage) {
            return {
              type: s.type,
              title: s.title,
              image_url: publicUrls[i],
              render_mode: "ai" as const,
              engine,
              variation_seed: variationSeed,
              variant_index: i,
              catalog_reference: screenReferences[i] || null,
              validation: {
                validated: imageResults[i].validated,
                attempts: imageResults[i].attempts,
                issues: imageResults[i].lastIssues,
                engine_used: imageResults[i].engine_used,
                has_image: true,
              },
            };
          }
          // Fallback React: il client renderizza il template fedele
          console.log(`[mockup-suite] schermata ${i} (${s.type}) → fallback React (AI fallita)`);
          return {
            type: s.type,
            title: s.title,
            image_url: null,
            render_mode: "react" as const,
            engine: "react_fallback",
            template_variant: templateVariant,
            variation_seed: variationSeed,
            variant_index: i,
            catalog_reference: screenReferences[i] || null,
            validation: {
              validated: false,
              attempts: imageResults[i].attempts,
              issues: imageResults[i].lastIssues,
              engine_used: "react_fallback_after_ai_fail",
              has_image: false,
              fallback_reason: "ai_generation_failed",
            },
          };
        });

        const aiCount = finalScreens.filter(s => s.render_mode === "ai").length;
        const allValidated = finalScreens.every(s => s.validation.validated);

        await adminClient
          .from("seller_mockup_suites")
          .update({
            screens: finalScreens,
            // Sempre "complete" se almeno qualcosa è stato generato (AI o React)
            status: allValidated ? "complete" : (aiCount > 0 ? "complete_with_warnings" : "complete_react_fallback"),
            generated_at: new Date().toISOString(),
          })
          .eq("id", suite.id);
        console.log(`[mockup-suite] background complete suite=${suite.id} ai=${aiCount}/${screens.length} validated=${allValidated}`);
      } catch (e: any) {
        console.error("[mockup-suite] background error", e);
        // FALLBACK TOTALE: AI completamente non disponibile → tutto React
        // Così il vendor riceve sempre 4 mockup, mai un errore vuoto.
        const errMsg = e?.message === "rate_limited"
          ? "AI temporaneamente sovraccarica — passato a render React fedele al catalogo."
          : e?.message === "payment_required"
            ? "Crediti AI esauriti — passato a render React fedele al catalogo."
            : `${e?.message || "errore generazione"} — fallback React attivo.`;

        const reactFallbackScreens = screens.map((s, i) => ({
          type: s.type,
          title: s.title,
          image_url: null,
          render_mode: "react" as const,
          engine: "react_full_fallback",
          template_variant: templateVariant,
          variation_seed: variationSeed,
          variant_index: i,
          catalog_reference: findCatalogReference(business_sector, s.type),
          validation: {
            validated: false,
            attempts: 0,
            issues: [`fatal_ai_error:${e?.message?.slice(0, 80) || "unknown"}`],
            engine_used: "react_full_fallback",
            has_image: false,
            fallback_reason: "ai_fatal_error",
          },
        }));
        await adminClient
          .from("seller_mockup_suites")
          .update({
            screens: reactFallbackScreens,
            status: "complete_react_fallback",
            error_message: errMsg,
            generated_at: new Date().toISOString(),
          })
          .eq("id", suite.id);
      }
    })();

    // @ts-ignore EdgeRuntime è iniettato dal runtime Supabase
    if (typeof EdgeRuntime !== "undefined" && EdgeRuntime.waitUntil) {
      // @ts-ignore
      EdgeRuntime.waitUntil(backgroundJob);
    } else {
      // Fallback (locale): non blocchiamo comunque la response
      backgroundJob.catch(() => {});
    }

    // Risposta IMMEDIATA: il client polla la suite via tabella per gli aggiornamenti
    return new Response(JSON.stringify({
      success: true,
      suite_id: suite.id,
      share_slug: shareSlug,
      engine,
      template_variant: templateVariant,
      screens: [],
      credits_spent: creditsSpent,
      variation_seed: variationSeed,
      status: "generating",
      async: true,
      message: "Generazione AI avviata in background. Polla seller_mockup_suites per aggiornamenti.",
    }), {
      status: 202,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e: any) {
    console.error("[mockup-suite] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
