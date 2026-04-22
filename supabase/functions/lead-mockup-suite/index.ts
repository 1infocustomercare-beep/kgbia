// Lead Mockup Suite — genera 4 mockup iPhone (Home/Menu/Booking/Profile) con 3 motori
// Engine: 'react' (gratis, lato client) | 'nano_banana' (20 crediti) | 'nano_banana_pro' (40 crediti)
// Ritorna: suite_id + array screens [{type, title, image_url}]
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

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
  { type: "home",    title: "Home",         prompt_hint: "hero immagine luxury full-bleed, logo brand in alto, claim italiano breve, CTA primario evidenziato, social proof (★ 4.9 - 247 recensioni), sezione 'in evidenza' con 2-3 card" },
  { type: "menu",    title: "Menu",         prompt_hint: "lista categorie scrollabile orizzontale in alto, lista item con foto a destra, nome+descrizione+prezzo, badge 'popolare'/'novità', filtro veloce (vegan/gluten-free)" },
  { type: "booking", title: "Prenota",      prompt_hint: "calendario mensile con giorni disponibili evidenziati, fascia oraria a chip, stepper numero persone, campo note, CTA 'Conferma Prenotazione' grande in basso" },
  { type: "profile", title: "Profilo",      prompt_hint: "avatar utente cerchio, nome+livello fedeltà (Gold), barra punti, lista ordini recenti con stato, sezione preferiti, impostazioni" },
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
): Promise<string | null> {
  const model = modelOverride || (pro ? "google/gemini-3-pro-image-preview" : "google/gemini-3.1-flash-image-preview");
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
          messages: [{ role: "user", content: prompt }],
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
): Promise<{ dataUrl: string | null; attempts: number; lastIssues: string[]; validated: boolean; engine_used: string }> {
  let lastIssues: string[] = [];
  let lastDataUrl: string | null = null;
  let engineUsed = pro ? "nano_banana_pro" : "nano_banana_2";
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const prompt = attempt === 1 ? basePrompt : basePrompt + buildCorrectionSuffix(lastIssues);
    // AUTO-UPGRADE: gli ultimi 2 tentativi usano il modello Pro (più affidabile e accurato)
    // per recuperare casi difficili senza richiedere intervento manuale dell'utente.
    const usePro = pro || attempt >= maxAttempts - 1;
    const modelOverride = usePro ? "google/gemini-3-pro-image-preview" : undefined;
    if (!pro && attempt >= maxAttempts - 1) {
      engineUsed = "nano_banana_pro_fallback";
      console.log(`[validate] attempt ${attempt}: AUTO-UPGRADE a Nano Banana Pro per garantire qualità`);
    }
    let dataUrl: string | null = null;
    try {
      dataUrl = await generateAIImage(lovableKey, prompt, usePro, modelOverride);
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
  { key: "airy-editorial", desc: "layout AERATO stile editorial: hero molto grande full-bleed in alto, abbondante white-space, tipografia generosa, max 2-3 card visibili, focus su una sola call-to-action centrale" },
  { key: "dense-discovery", desc: "layout DENSO stile discovery feed: header compatto, search bar prominente, chip categorie scrollabili orizzontalmente, griglia 2 colonne di card piccole, molti elementi visibili" },
  { key: "story-stacked", desc: "layout NARRATIVO stacked: sezioni verticali separate da titoli grandi maiuscoli, stories circolari in alto, card large rectangulari con immagine sopra e testo sotto, ritmo a blocchi" },
  { key: "card-spotlight", desc: "layout SPOTLIGHT a card singola: una card grande protagonista al centro con immagine, titolo, descrizione e CTA inline, sotto lista compatta a 1 colonna di alternative" },
  { key: "split-grid", desc: "layout SPLIT GRID: parte alta hero immagine 60% altezza, parte bassa griglia bento 2x2 con card asimmetriche di dimensioni diverse, badge e prezzi prominenti" },
  { key: "minimal-list", desc: "layout LIST minimal: header con saluto personalizzato, niente hero immagine, lista verticale pulita di 4-5 elementi con divider sottili, prezzo a destra grande, immagini piccole quadrate a sinistra" },
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
): string {
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
    ? "ULTRA-CINEMATOGRAFICO 8K, qualità Apple Store keynote, illuminazione studio professionale a 3 punti, riflessi vetro perfetti del display, anti-aliasing perfetto, grana sottile cinematica, color grading premium"
    : "fotorealistico premium 4K, illuminazione studio soft, dettagli UI nitidi e leggibili, color grading professionale";

  // VARIATION: layout + componenti diversi per ogni screen
  const layout = pickByIndex(LAYOUT_VARIATIONS, variationSeed, variantIndex);
  const components = pickByIndex(COMPONENT_VARIATIONS, variationSeed + 3, variantIndex);
  const accentRotation = ["più caldo", "più freddo", "più saturo", "più desaturato"][variantIndex % 4];

  return `MOCKUP iPhone 16 Pro Max ULTRA-PROFESSIONALE — schermata "${screen.title}" (variante #${variantIndex + 1}/4 · seed ${variationSeed}) di un'app mobile reale per "${business.name}" (${business.sector}${business.city ? ` · ${business.city}` : ""}).

═══ COMPOSIZIONE FOTOGRAFICA (REGOLE INDEROGABILI) ═══
• iPhone PERFETTAMENTE CENTRATO sia orizzontalmente che verticalmente nel frame
• Vista ESCLUSIVAMENTE FRONTALE ortogonale: ZERO prospettiva, ZERO inclinazione, ZERO 3D, ZERO tilt
• Aspect ratio dispositivo REALE 9:19.5, proporzioni iPhone 16 Pro Max accurate
• Cornice in titanio naturale visibile sottile e uniforme su tutti i lati
• Display interamente visibile, NESSUN cropping, NESSUNA distorsione ottica
• Sfondo: gradiente neutro morbido in tinta col tema (studio fotografico Apple)
• Ombra naturale soft sotto il dispositivo
• NESSUN testo o decorazione FUORI dallo schermo iPhone

═══ CONTENUTO SCHERMATA (PERTINENTE AL SETTORE) ═══
${screen.prompt_hint || screen.title}
Il contenuto deve essere AUTENTICO per il settore "${business.sector}":
• Nomi servizi/prodotti realistici tipici del settore italiano
• Prezzi in € credibili e coerenti col mercato italiano
• Indirizzi italiani plausibili, orari formato 24h
• Microcopy 100% in italiano professionale (zero inglese eccetto status bar iOS)
• ZERO testo placeholder/lorem ipsum/finto

═══ VARIAZIONE OBBLIGATORIA TRA LE 4 SCHERMATE ═══
🎨 Questa è la schermata #${variantIndex + 1} di 4 — DEVE essere visivamente DIVERSA dalle altre 3 in layout, densità, ordine sezioni e componenti.
• Layout di QUESTA schermata: ${layout.desc}
• Componenti UI specifici: ${components}
• Variazione palette: usa una sfumatura ${accentRotation} del primario per gli elementi attivi
• Cambia ordine, dimensioni e tipologia delle sezioni rispetto alle altre 3 schermate
• Card layout, immagini, CTA e ritmo visivo distintivi di questa singola schermata
• Anche titoli, sottotitoli, prodotti in evidenza diversi dagli altri screen

═══ STILE GRAFICO ═══
${style}
Colore primario brand del cliente (accent CTA principale): ${primaryColor}

═══ UI COMPONENTS OBBLIGATORI ═══
• Status bar iOS in alto: ora 9:41, segnale 5G, WiFi, batteria 100%
• Dynamic Island nera centrata in alto
• Header app con titolo schermata coerente
• Contenuto ben spaziato, gerarchia tipografica chiara
• Card con border-radius 16-20px e ombre soft
• Bottom navigation bar fissa con 5 icone (${bottomNav}), attiva colorata col primary
• Home indicator iOS sottile in basso
• CTA primari grandi (52px altezza), full-width

═══ QUALITÀ ═══
${quality}

═══ DIVIETI ASSOLUTI ═══
🚫 VIETATO scrivere "Empire", "Empire AI", "Empire AI Group", "Lovable", "Empireia"
🚫 VIETATO loghi Apple, Google, Meta o brand di terze parti
🚫 VIETATO testo in inglese nei contenuti dell'app
🚫 VIETATO prospettive 3D, tilt, dispositivo inclinato
🚫 VIETATO testo distorto, lorem ipsum, placeholder generici
🚫 VIETATO mockup wireframe o sketch — SOLO render fotografici premium
🚫 VIETATO che le 4 schermate sembrino la stessa: DEVONO avere layout strutturalmente DIVERSI`;
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
    } = body;
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
      ? screensInput.slice(0, 4).map((s: any) => ({
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
      try {
        const imageResults: Awaited<ReturnType<typeof generateValidatedAIImage>>[] = [];
        const concurrency = 2;
        for (let i = 0; i < screens.length; i += concurrency) {
          const batch = screens.slice(i, i + concurrency);
          const batchResults = await Promise.all(
            batch.map((s, k) =>
              generateValidatedAIImage(
                LOVABLE_KEY,
                buildScreenPrompt(s, business, templateVariant, primary_color, pro, variationSeed, i + k),
                pro,
                5,
              )
            )
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

        const finalScreens = screens.map((s, i) => ({
          type: s.type,
          title: s.title,
          image_url: publicUrls[i],
          render_mode: "ai" as const,
          engine,
          variation_seed: variationSeed,
          variant_index: i,
          validation: {
            validated: imageResults[i].validated,
            attempts: imageResults[i].attempts,
            issues: imageResults[i].lastIssues,
            engine_used: imageResults[i].engine_used,
            has_image: !!publicUrls[i],
          },
        }));

        const allValidated = finalScreens.every(s => s.validation.validated);

        await adminClient
          .from("seller_mockup_suites")
          .update({
            screens: finalScreens,
            status: allValidated ? "complete" : "complete_with_warnings",
            generated_at: new Date().toISOString(),
          })
          .eq("id", suite.id);
        console.log(`[mockup-suite] background complete suite=${suite.id} validated=${allValidated}`);
      } catch (e: any) {
        console.error("[mockup-suite] background error", e);
        const errMsg = e?.message === "rate_limited"
          ? "AI temporaneamente sovraccarica. Riprova."
          : e?.message === "payment_required"
            ? "Crediti AI gateway esauriti."
            : e?.message || "errore generazione";
        await adminClient
          .from("seller_mockup_suites")
          .update({ status: "error", error_message: errMsg })
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
