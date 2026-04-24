// Custom Preview Generator — produce una preview HTML professionale e personalizzata
// per un settore/lead. Usa Lovable AI (Gemini) per copy + Nano Banana per hero image.
// Costo: 15 crediti.
//
// Input:
//   { preview_id?: string, lead_id?: string, lead_intelligence_id?: string,
//     manual_data?: { lead_name, lead_city, lead_sector, lead_website, lead_phone, ... },
//     template_style: 'modern_dark'|'luxury_gold'|'casual_warm'|'minimal_zen',
//     primary_color: '#xxxxxx',
//     logo_url?: string, gallery_images?: string[],
//     skip_credit_check?: boolean }
//
// Output: { success, preview_id, public_url, ai_content, hero_image_url }

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { getStylePreset, shadowCss, type MockupStylePreset } from "../_shared/mockup-style-presets.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const AI_GATEWAY = "https://ai.gateway.lovable.dev/v1/chat/completions";

interface LeadData {
  lead_name: string;
  lead_city?: string;
  lead_sector?: string;
  lead_website?: string;
  lead_phone?: string;
  lead_address?: string;
  lead_email?: string;
  lead_rating?: number;
  lead_reviews_count?: number;
}

// ----- AI helpers -----
async function generateCopy(lovableKey: string, lead: LeadData, scraped: any, style: string): Promise<any> {
  const preset = getStylePreset(style);
  const styleHint = preset.copyTone;
  const prompt = `Sei un copywriter senior specializzato in landing page italiane premium per piccole/medie attività.
Genera contenuti in italiano per la landing page del business "${lead.lead_name}" (settore: ${lead.lead_sector || 'attività'}, città: ${lead.lead_city || 'Italia'}).
Stile: ${styleHint}. Preset visivo: "${preset.label}" (${preset.description}).
Dati extra dal sito attuale (se presenti): ${JSON.stringify(scraped).slice(0, 1500)}.
Contatti reali: tel ${lead.lead_phone || '—'}, sito ${lead.lead_website || '—'}, indirizzo ${lead.lead_address || '—'}.
${lead.lead_rating ? `Rating Google: ${lead.lead_rating}/5 con ${lead.lead_reviews_count} recensioni.` : ''}

Restituisci SOLO un JSON valido con questa struttura ESATTA:
{
  "hero_title": "max 60 caratteri, accattivante, NON ripetere il nome del business",
  "hero_subtitle": "max 140 caratteri, chiaro valore offerto",
  "hero_cta": "max 18 caratteri, es. 'Prenota Ora'",
  "about_title": "max 50 caratteri",
  "about_text": "150-220 parole, racconta il business con passione, usa il vero nome '${lead.lead_name}'",
  "features": [
    {"icon": "emoji", "title": "max 30 char", "desc": "max 90 char"},
    {"icon": "emoji", "title": "max 30 char", "desc": "max 90 char"},
    {"icon": "emoji", "title": "max 30 char", "desc": "max 90 char"},
    {"icon": "emoji", "title": "max 30 char", "desc": "max 90 char"}
  ],
  "services": [
    {"name": "servizio reale del settore", "price_hint": "es. 'da €25'", "desc": "max 100 char"},
    {"name": "...", "price_hint": "...", "desc": "..."},
    {"name": "...", "price_hint": "...", "desc": "..."}
  ],
  "testimonials": [
    {"name": "Nome italiano realistico", "text": "recensione 80-130 char credibile sul business", "rating": 5},
    {"name": "...", "text": "...", "rating": 5},
    {"name": "...", "text": "...", "rating": 4}
  ],
  "faq": [
    {"q": "domanda concreta tipica del settore", "a": "risposta 60-120 char"},
    {"q": "...", "a": "..."},
    {"q": "...", "a": "..."}
  ],
  "footer_tagline": "max 80 char"
}`;

  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: "Copywriter premium italiano. Restituisci SOLO JSON valido senza markdown." },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
    }),
  });
  if (!r.ok) {
    if (r.status === 429) throw new Error("rate_limited");
    if (r.status === 402) throw new Error("payment_required");
    throw new Error(`copy_gen_error: ${r.status} ${await r.text()}`);
  }
  const data = await r.json();
  const txt = data?.choices?.[0]?.message?.content || "{}";
  try {
    return JSON.parse(txt);
  } catch {
    const m = txt.match(/\{[\s\S]*\}/);
    return m ? JSON.parse(m[0]) : {};
  }
}

async function generateHeroImage(lovableKey: string, lead: LeadData, style: string, color: string): Promise<string | null> {
  const preset = getStylePreset(style);
  const sectorScene: Record<string, string> = {
    tatuatore: "studio di tatuaggi professionale con poltrona moderna e attrezzatura sterile",
    fiorista: "negozio di fiori elegante con composizioni floreali eleganti",
    veterinario: "clinica veterinaria moderna pulita e accogliente",
    estetista: "centro estetico premium con dettagli marmo e oro",
    parrucchiere: "salone hair styling moderno con poltrone designer",
    palestra: "palestra premium attrezzature moderne luce naturale",
    ristorante: "interno ristorante elegante apparecchiato",
    bar: "bancone bar premium illuminazione calda bottiglie premium",
    pizzeria: "forno pizza a legna acceso con pizza appena sfornata",
    sushi: "bancone sushi con itamae al lavoro, pesce premium su ghiaccio",
    nails: "salone nail premium con tavoli marmo, dettagli ottone, luce diffusa",
    immobiliare: "interno appartamento di pregio con luce naturale e design d'autore",
    yacht: "yacht luxury ormeggiato in marina mediterranea, golden hour",
    medico: "studio medico premium pulito, luce brillante, fiducia",
    asilo: "ambiente kids accogliente con elementi naturali warm",
  };
  const sector = (lead.lead_sector || "").toLowerCase();
  const matchedKey = Object.keys(sectorScene).find(k => sector.includes(k));
  const scene = matchedKey ? sectorScene[matchedKey] : `attività ${lead.lead_sector || 'commerciale'} interno premium professionale`;

  const prompt = `Hero image fotorealistica per landing page premium di "${lead.lead_name}" a ${lead.lead_city || 'Italia'}. Scena: ${scene}. ${styleDesc[style] || ''}. Accent color ${color}. Composizione orizzontale 16:9, alta qualità editoriale, NO testo nell'immagine, NO loghi, NO watermark. Fotografia professionale.`;

  const r = await fetch(AI_GATEWAY, {
    method: "POST",
    headers: { Authorization: `Bearer ${lovableKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash-image",
      messages: [{ role: "user", content: prompt }],
      modalities: ["image", "text"],
    }),
  });
  if (!r.ok) {
    console.error("hero image error", r.status, await r.text());
    return null;
  }
  const data = await r.json();
  return data?.choices?.[0]?.message?.images?.[0]?.image_url?.url ?? null;
}

async function uploadDataUrl(client: any, dataUrl: string, path: string): Promise<string | null> {
  try {
    const m = dataUrl.match(/^data:(.+?);base64,(.+)$/);
    if (!m) return null;
    const bytes = Uint8Array.from(atob(m[2]), c => c.charCodeAt(0));
    const { error } = await client.storage.from("media-vault").upload(path, bytes, { contentType: m[1], upsert: true });
    if (error) { console.error("upload err", error); return null; }
    const { data: pub } = client.storage.from("media-vault").getPublicUrl(path);
    return pub?.publicUrl ?? null;
  } catch (e) { console.error("upload exception", e); return null; }
}

// ----- Firecrawl scraping (opzionale) -----
async function scrapeWebsite(url: string): Promise<any> {
  const key = Deno.env.get("FIRECRAWL_API_KEY");
  if (!key || !url) return {};
  try {
    const r = await fetch("https://api.firecrawl.dev/v2/scrape", {
      method: "POST",
      headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        url,
        formats: ["markdown", "branding"],
        onlyMainContent: true,
        waitFor: 1500,
      }),
    });
    if (!r.ok) return {};
    const data = await r.json();
    return {
      markdown: (data.markdown || data.data?.markdown || "").slice(0, 3000),
      branding: data.branding || data.data?.branding || null,
      title: data.metadata?.title || data.data?.metadata?.title,
    };
  } catch (e) { console.error("scrape error", e); return {}; }
}

// ----- HTML composer -----
function escapeHtml(s: string): string {
  return String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]!));
}

function buildHtml(lead: LeadData, content: any, style: string, color: string, logoUrl: string | null, heroUrl: string | null, gallery: string[], whatsappMsg: string): string {
  const themes: Record<string, { bg: string; surface: string; text: string; muted: string; accent: string; cardBg: string }> = {
    modern_dark: { bg: "#0F172A", surface: "#1E293B", text: "#F8FAFC", muted: "#94A3B8", accent: color, cardBg: "rgba(255,255,255,0.04)" },
    luxury_gold: { bg: "#0D0A06", surface: "#1A1410", text: "#F5E6C8", muted: "#A89070", accent: color, cardBg: "rgba(212,175,55,0.06)" },
    casual_warm: { bg: "#FAF6F0", surface: "#FFFFFF", text: "#3D2C1E", muted: "#8B7355", accent: color, cardBg: "#FFF8EE" },
    minimal_zen: { bg: "#F8F8F8", surface: "#FFFFFF", text: "#1A1A1A", muted: "#666666", accent: color, cardBg: "#FAFAFA" },
  };
  const t = themes[style] || themes.modern_dark;

  const waNumber = (lead.lead_phone || "").replace(/\D/g, "");
  const waLink = waNumber ? `https://wa.me/${waNumber.startsWith("39") ? waNumber : "39" + waNumber}?text=${encodeURIComponent(whatsappMsg)}` : "#";

  const featuresHtml = (content.features || []).map((f: any) => `
    <div class="feature-card">
      <div class="feature-icon">${escapeHtml(f.icon || "✨")}</div>
      <h3>${escapeHtml(f.title || "")}</h3>
      <p>${escapeHtml(f.desc || "")}</p>
    </div>`).join("");

  const servicesHtml = (content.services || []).map((s: any) => `
    <div class="service-card">
      <div class="service-name">${escapeHtml(s.name || "")}</div>
      <div class="service-price">${escapeHtml(s.price_hint || "")}</div>
      <div class="service-desc">${escapeHtml(s.desc || "")}</div>
    </div>`).join("");

  const testimonialsHtml = (content.testimonials || []).map((tst: any) => `
    <div class="testimonial">
      <div class="stars">${"★".repeat(tst.rating || 5)}${"☆".repeat(5 - (tst.rating || 5))}</div>
      <p>"${escapeHtml(tst.text || "")}"</p>
      <div class="testimonial-author">— ${escapeHtml(tst.name || "")}</div>
    </div>`).join("");

  const faqHtml = (content.faq || []).map((f: any) => `
    <details class="faq-item">
      <summary>${escapeHtml(f.q || "")}</summary>
      <p>${escapeHtml(f.a || "")}</p>
    </details>`).join("");

  const galleryHtml = gallery.length > 0 ? `
    <section class="section gallery-section">
      <h2 class="section-title">Galleria</h2>
      <div class="gallery-grid">
        ${gallery.slice(0, 6).map(g => `<div class="gallery-item" style="background-image:url('${escapeHtml(g)}')"></div>`).join("")}
      </div>
    </section>` : "";

  return `<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${escapeHtml(lead.lead_name)} — ${escapeHtml(lead.lead_sector || "")}</title>
<meta name="description" content="${escapeHtml(content.hero_subtitle || lead.lead_name)}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Playfair+Display:wght@400;700;900&display=swap" rel="stylesheet">
<style>
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:'Inter',sans-serif;background:${t.bg};color:${t.text};line-height:1.6;overflow-x:hidden}
  img{max-width:100%;display:block}
  .container{max-width:1200px;margin:0 auto;padding:0 24px}

  /* Header */
  .nav{position:fixed;top:0;left:0;right:0;z-index:50;background:${t.bg}cc;backdrop-filter:blur(12px);padding:16px 0;border-bottom:1px solid ${t.accent}22}
  .nav-inner{display:flex;align-items:center;justify-content:space-between}
  .nav-brand{display:flex;align-items:center;gap:12px;font-weight:700;font-size:18px}
  .nav-logo{height:36px;width:36px;border-radius:8px;background:${t.accent};display:flex;align-items:center;justify-content:center;color:${t.bg};font-weight:800;font-size:14px;overflow:hidden}
  .nav-logo img{height:100%;width:100%;object-fit:cover}
  .nav-cta{background:${t.accent};color:${t.bg};padding:10px 22px;border-radius:999px;text-decoration:none;font-weight:600;font-size:14px;transition:transform .2s}
  .nav-cta:hover{transform:scale(1.05)}

  /* Hero */
  .hero{min-height:90vh;display:flex;align-items:center;padding:120px 0 80px;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;inset:0;background:${heroUrl ? `url('${heroUrl}') center/cover` : `linear-gradient(135deg,${t.accent}33,${t.bg})`};z-index:0}
  .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${t.bg}99 0%,${t.bg}dd 100%);z-index:1}
  .hero-content{position:relative;z-index:2;max-width:780px}
  .hero-badge{display:inline-flex;align-items:center;gap:8px;background:${t.accent}22;color:${t.accent};padding:8px 16px;border-radius:999px;font-size:13px;font-weight:600;margin-bottom:24px;border:1px solid ${t.accent}44}
  .hero h1{font-family:'Playfair Display',serif;font-size:clamp(36px,6vw,68px);font-weight:900;line-height:1.05;margin-bottom:20px;letter-spacing:-1px}
  .hero h1 span{color:${t.accent}}
  .hero p.sub{font-size:clamp(16px,2vw,21px);color:${t.muted};margin-bottom:36px;max-width:600px}
  .hero-actions{display:flex;gap:14px;flex-wrap:wrap}
  .btn-primary{background:${t.accent};color:${t.bg};padding:16px 32px;border-radius:999px;text-decoration:none;font-weight:700;font-size:16px;transition:transform .2s,box-shadow .2s;box-shadow:0 10px 30px ${t.accent}66}
  .btn-primary:hover{transform:translateY(-2px);box-shadow:0 14px 40px ${t.accent}99}
  .btn-secondary{background:transparent;color:${t.text};padding:16px 32px;border-radius:999px;text-decoration:none;font-weight:600;font-size:16px;border:1.5px solid ${t.text}44;transition:border-color .2s}
  .btn-secondary:hover{border-color:${t.accent}}

  ${lead.lead_rating ? `
  .hero-rating{display:inline-flex;align-items:center;gap:8px;margin-top:32px;color:${t.muted};font-size:14px}
  .hero-rating .stars{color:#FFB800;font-size:18px}
  ` : ""}

  /* Sections */
  .section{padding:90px 0;position:relative}
  .section-title{font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,48px);font-weight:800;text-align:center;margin-bottom:16px;letter-spacing:-.5px}
  .section-subtitle{text-align:center;color:${t.muted};font-size:17px;margin-bottom:56px;max-width:600px;margin-left:auto;margin-right:auto}

  /* Features */
  .features-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:20px}
  .feature-card{background:${t.cardBg};padding:32px 24px;border-radius:20px;border:1px solid ${t.accent}22;transition:transform .25s,border-color .25s}
  .feature-card:hover{transform:translateY(-4px);border-color:${t.accent}66}
  .feature-icon{font-size:36px;margin-bottom:16px}
  .feature-card h3{font-size:18px;font-weight:700;margin-bottom:8px;color:${t.text}}
  .feature-card p{color:${t.muted};font-size:14px}

  /* About */
  .about{background:${t.surface}}
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:60px;align-items:center}
  .about-text{font-size:17px;color:${t.muted};line-height:1.85}
  .about-text strong{color:${t.text}}
  .about-image{aspect-ratio:4/5;border-radius:24px;background:${heroUrl ? `url('${heroUrl}') center/cover` : `linear-gradient(135deg,${t.accent},${t.surface})`};box-shadow:0 30px 60px rgba(0,0,0,.3)}
  @media(max-width:768px){.about-grid{grid-template-columns:1fr}}

  /* Services */
  .services-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
  .service-card{background:${t.cardBg};padding:28px;border-radius:16px;border:1px solid ${t.accent}22;display:flex;flex-direction:column;gap:8px}
  .service-name{font-size:18px;font-weight:700}
  .service-price{color:${t.accent};font-weight:600;font-size:15px}
  .service-desc{color:${t.muted};font-size:14px;margin-top:4px}

  /* Gallery */
  .gallery-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:12px}
  .gallery-item{aspect-ratio:1;background:${t.surface} center/cover;border-radius:12px}

  /* Testimonials */
  .testimonials{background:${t.surface}}
  .testimonials-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:20px}
  .testimonial{background:${t.cardBg};padding:28px;border-radius:16px;border:1px solid ${t.accent}22}
  .testimonial .stars{color:#FFB800;font-size:18px;margin-bottom:12px}
  .testimonial p{color:${t.text};font-size:15px;line-height:1.7;margin-bottom:14px;font-style:italic}
  .testimonial-author{color:${t.muted};font-size:13px;font-weight:600}

  /* FAQ */
  .faq-list{max-width:760px;margin:0 auto;display:flex;flex-direction:column;gap:12px}
  .faq-item{background:${t.cardBg};border:1px solid ${t.accent}22;border-radius:12px;padding:20px 24px;cursor:pointer}
  .faq-item summary{font-weight:600;font-size:16px;list-style:none;display:flex;justify-content:space-between;align-items:center}
  .faq-item summary::after{content:'+';color:${t.accent};font-size:24px;transition:transform .2s}
  .faq-item[open] summary::after{transform:rotate(45deg)}
  .faq-item p{margin-top:14px;color:${t.muted};font-size:15px}

  /* CTA */
  .cta-section{padding:90px 0;text-align:center;background:linear-gradient(135deg,${t.accent}1a,${t.surface})}
  .cta-section h2{font-family:'Playfair Display',serif;font-size:clamp(28px,4vw,42px);margin-bottom:16px}
  .cta-section p{color:${t.muted};margin-bottom:32px;font-size:17px}

  /* Contact */
  .contact-info{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:24px;margin-top:48px}
  .contact-item{text-align:center}
  .contact-item-icon{font-size:28px;margin-bottom:8px}
  .contact-item-label{font-size:13px;color:${t.muted};text-transform:uppercase;letter-spacing:1px;margin-bottom:4px}
  .contact-item-value{font-size:16px;color:${t.text};font-weight:500}
  .contact-item a{color:${t.accent};text-decoration:none}

  /* Footer */
  footer{background:${t.surface};padding:48px 0 32px;text-align:center;border-top:1px solid ${t.accent}22}
  footer p{color:${t.muted};font-size:14px;margin-bottom:8px}
  .footer-tagline{color:${t.text};font-weight:600;margin-bottom:16px}
  .footer-empire{color:${t.muted}66;font-size:11px;margin-top:24px}

  /* WhatsApp FAB */
  .wa-fab{position:fixed;bottom:24px;right:24px;width:60px;height:60px;background:#25D366;border-radius:50%;display:flex;align-items:center;justify-content:center;box-shadow:0 8px 24px rgba(37,211,102,.4);z-index:100;transition:transform .2s;text-decoration:none}
  .wa-fab:hover{transform:scale(1.1)}
  .wa-fab svg{width:32px;height:32px;fill:#fff}

  @media(max-width:640px){
    .hero{padding:100px 0 60px;min-height:auto}
    .section{padding:60px 0}
    .nav-cta{padding:8px 16px;font-size:13px}
  }
</style>
</head>
<body>

<nav class="nav">
  <div class="container nav-inner">
    <div class="nav-brand">
      <div class="nav-logo">${logoUrl ? `<img src="${escapeHtml(logoUrl)}" alt="logo">` : escapeHtml((lead.lead_name || "?").charAt(0).toUpperCase())}</div>
      <span>${escapeHtml(lead.lead_name)}</span>
    </div>
    <a href="${waLink}" class="nav-cta">${escapeHtml(content.hero_cta || "Contattaci")}</a>
  </div>
</nav>

<section class="hero">
  <div class="container hero-content">
    <div class="hero-badge">${escapeHtml(lead.lead_sector || "Premium")} ${lead.lead_city ? `• ${escapeHtml(lead.lead_city)}` : ""}</div>
    <h1>${escapeHtml(content.hero_title || lead.lead_name)}</h1>
    <p class="sub">${escapeHtml(content.hero_subtitle || "")}</p>
    <div class="hero-actions">
      <a href="${waLink}" class="btn-primary">${escapeHtml(content.hero_cta || "Prenota Ora")}</a>
      <a href="#services" class="btn-secondary">Scopri di più</a>
    </div>
    ${lead.lead_rating ? `<div class="hero-rating"><span class="stars">${"★".repeat(Math.round(lead.lead_rating))}</span><span>${lead.lead_rating}/5 su Google · ${lead.lead_reviews_count || 0} recensioni</span></div>` : ""}
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">Perché sceglierci</h2>
    <p class="section-subtitle">Quello che rende ${escapeHtml(lead.lead_name)} la scelta giusta</p>
    <div class="features-grid">${featuresHtml}</div>
  </div>
</section>

<section class="section about" id="about">
  <div class="container">
    <div class="about-grid">
      <div>
        <h2 class="section-title" style="text-align:left">${escapeHtml(content.about_title || "La nostra storia")}</h2>
        <div class="about-text">${escapeHtml(content.about_text || "").split("\n").map((p: string) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
      </div>
      <div class="about-image"></div>
    </div>
  </div>
</section>

<section class="section" id="services">
  <div class="container">
    <h2 class="section-title">Servizi</h2>
    <p class="section-subtitle">Tutto quello che possiamo fare per te</p>
    <div class="services-grid">${servicesHtml}</div>
  </div>
</section>

${galleryHtml}

<section class="section testimonials">
  <div class="container">
    <h2 class="section-title">Cosa dicono i clienti</h2>
    <p class="section-subtitle">Recensioni vere di chi ci ha già scelto</p>
    <div class="testimonials-grid">${testimonialsHtml}</div>
  </div>
</section>

<section class="section">
  <div class="container">
    <h2 class="section-title">Domande Frequenti</h2>
    <div class="faq-list">${faqHtml}</div>
  </div>
</section>

<section class="cta-section" id="contact">
  <div class="container">
    <h2>Pronto a iniziare?</h2>
    <p>${escapeHtml(content.footer_tagline || "Contattaci subito per saperne di più")}</p>
    <a href="${waLink}" class="btn-primary">💬 Scrivici su WhatsApp</a>
    <div class="contact-info">
      ${lead.lead_phone ? `<div class="contact-item"><div class="contact-item-icon">📞</div><div class="contact-item-label">Telefono</div><div class="contact-item-value"><a href="tel:${escapeHtml(lead.lead_phone)}">${escapeHtml(lead.lead_phone)}</a></div></div>` : ""}
      ${lead.lead_address ? `<div class="contact-item"><div class="contact-item-icon">📍</div><div class="contact-item-label">Indirizzo</div><div class="contact-item-value">${escapeHtml(lead.lead_address)}</div></div>` : ""}
      ${lead.lead_email ? `<div class="contact-item"><div class="contact-item-icon">✉️</div><div class="contact-item-label">Email</div><div class="contact-item-value"><a href="mailto:${escapeHtml(lead.lead_email)}">${escapeHtml(lead.lead_email)}</a></div></div>` : ""}
    </div>
  </div>
</section>

<footer>
  <div class="container">
    <p class="footer-tagline">${escapeHtml(lead.lead_name)}</p>
    <p>${escapeHtml(content.footer_tagline || "")}</p>
    <p class="footer-empire">Anteprima generata con Empire AI Group · empireia.lovable.app</p>
  </div>
</footer>

<a href="${waLink}" class="wa-fab" aria-label="WhatsApp">
  <svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
</a>

</body>
</html>`;
}

// ----- MAIN -----
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

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const userClient = createClient(SUPABASE_URL, ANON_KEY, { global: { headers: { Authorization: authHeader } } });
    const { data: u } = await userClient.auth.getUser();
    const userId = u?.user?.id;
    if (!userId) return new Response(JSON.stringify({ error: "unauthorized" }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });

    const body = await req.json();
    const {
      lead_id, lead_intelligence_id, manual_data,
      template_style = "modern_dark", primary_color = "#C8963E",
      logo_url, gallery_images = [],
    } = body;

    // 1. Risolvi dati lead (priorità: intelligence > lead_id > manual)
    let lead: LeadData = { lead_name: "" };
    if (lead_intelligence_id) {
      const { data: intel } = await admin.from("lead_intelligence_reports").select("*").eq("id", lead_intelligence_id).eq("owner_id", userId).maybeSingle();
      if (intel) {
        lead = {
          lead_name: intel.lead_name,
          lead_city: intel.lead_city,
          lead_sector: intel.lead_sector,
          lead_website: intel.lead_website,
          lead_phone: intel.lead_phone,
          lead_rating: intel.google_rating,
          lead_reviews_count: intel.google_reviews_count,
        };
      }
    } else if (lead_id) {
      const { data: ld } = await admin.from("leads").select("*").eq("id", lead_id).maybeSingle();
      if (ld) {
        lead = {
          lead_name: ld.name,
          lead_city: ld.city,
          lead_sector: ld.sector,
          lead_website: ld.website,
          lead_phone: ld.phone,
          lead_email: ld.email,
        };
      }
    }
    if (manual_data) lead = { ...lead, ...manual_data };
    if (!lead.lead_name) {
      return new Response(JSON.stringify({ error: "missing_lead_name" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 2. Crediti (skip per autopilot interno)
    if (!body.skip_credit_check) {
      const { data: cc } = await userClient.rpc("consume_seller_credits", {
        p_action: "custom_preview_generation",
        p_metadata: { lead_name: lead.lead_name, sector: lead.lead_sector },
      });
      if (!(cc as any)?.success) {
        return new Response(JSON.stringify({ success: false, error: "insufficient_credits", details: cc }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      }
    }

    // 3. Crea record iniziale (status: generating)
    const slug = (lead.lead_name).toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32);
    const publicSlug = `${slug}-${Date.now().toString(36)}`;

    const { data: previewRow, error: insertErr } = await admin.from("seller_custom_previews").insert({
      owner_id: userId,
      lead_id: lead_id || null,
      lead_intelligence_id: lead_intelligence_id || null,
      sector_slug: (lead.lead_sector || "custom").toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 32),
      sector_label: lead.lead_sector || "Custom",
      template_style, primary_color,
      lead_name: lead.lead_name, lead_city: lead.lead_city, lead_phone: lead.lead_phone,
      lead_website: lead.lead_website, lead_address: lead.lead_address, lead_email: lead.lead_email,
      lead_rating: lead.lead_rating, lead_reviews_count: lead.lead_reviews_count,
      logo_url, gallery_images,
      generation_status: "generating",
      public_slug: publicSlug,
      preview_url: `/preview/custom/${publicSlug}`,
      is_published: true,
    }).select().single();
    if (insertErr) throw insertErr;

    // 4. Esegui pipeline AI in parallelo (scrape + copy + hero)
    const [scraped, copyResult, heroDataUrl] = await Promise.all([
      lead.lead_website ? scrapeWebsite(lead.lead_website) : Promise.resolve({}),
      generateCopy(LOVABLE_KEY, lead, {}, template_style).catch(e => { console.error("copy err", e); return null; }),
      generateHeroImage(LOVABLE_KEY, lead, template_style, primary_color).catch(e => { console.error("hero err", e); return null; }),
    ]);

    // 5. Re-genera copy con dati scraped se disponibili
    let finalContent = copyResult;
    if (scraped && Object.keys(scraped).length > 0 && copyResult) {
      try {
        finalContent = await generateCopy(LOVABLE_KEY, lead, scraped, template_style);
      } catch { /* keep first */ }
    }
    if (!finalContent) {
      await admin.from("seller_custom_previews").update({ generation_status: "error", generation_error: "ai_copy_failed" }).eq("id", previewRow.id);
      return new Response(JSON.stringify({ success: false, error: "ai_copy_failed" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    // 6. Upload hero image
    let heroPublicUrl: string | null = null;
    if (heroDataUrl) {
      heroPublicUrl = await uploadDataUrl(admin, heroDataUrl, `custom-previews/${userId}/${previewRow.id}-hero.png`);
    }

    // 7. Compose HTML — personalized WhatsApp message
    const baseUrl = SUPABASE_URL.includes("localhost") ? "http://localhost:8080" : "https://empireia.lovable.app";
    const previewUrl = `${baseUrl}/preview/custom/${publicSlug}`;
    const sectorLabel = lead.lead_sector ? lead.lead_sector.charAt(0).toUpperCase() + lead.lead_sector.slice(1) : "la vostra attività";
    const cityLabel = lead.lead_city ? ` a ${lead.lead_city}` : "";
    const sectorCta: Record<string, string> = {
      ristorante: "👉 Provate la prenotazione tavolo dal sito",
      pizzeria: "👉 Provate l'ordine online direttamente dalla preview",
      sushi: "👉 Provate l'ordine online direttamente dalla preview",
      bar: "👉 Provate la prenotazione dal sito",
      hotel: "👉 Provate la prenotazione camere dal sito",
      ncc: "👉 Provate la prenotazione corsa dal sito",
      parrucchiere: "👉 Provate la prenotazione appuntamento dal sito",
      estetista: "👉 Provate la prenotazione appuntamento dal sito",
      palestra: "👉 Provate la prenotazione lezione dal sito",
    };
    const ctaLine = sectorCta[(lead.lead_sector || "").toLowerCase()] || "👉 Provate ad ordinare/prenotare direttamente dalla preview";
    const whatsappMsg = `Ciao ${lead.lead_name}! 👋

Ho creato un'anteprima del *nuovo sito* per ${lead.lead_name}${cityLabel} — pensato su misura per ${sectorLabel}.

✨ Cosa trovate dentro:
• Hero image generata da AI
• Sezioni personalizzate
• ${ctaLine}

🔗 Guardatela qui:
${previewUrl}

Fatemi sapere cosa ne pensate — se vi piace possiamo metterla online entro 48h. 🚀`;
    const html = buildHtml(lead, finalContent, template_style, primary_color, logo_url, heroPublicUrl, gallery_images, whatsappMsg);

    // 8. Update record finale
    const { data: finalRow } = await admin.from("seller_custom_previews").update({
      hero_image_url: heroPublicUrl,
      ai_generated_content: finalContent,
      scraped_data: scraped,
      preview_html: html,
      hero_title: finalContent.hero_title,
      hero_subtitle: finalContent.hero_subtitle,
      features: finalContent.features || [],
      whatsapp_message: whatsappMsg,
      generation_status: "completed",
      generated_at: new Date().toISOString(),
    }).eq("id", previewRow.id).select().single();

    return new Response(JSON.stringify({
      success: true,
      preview_id: previewRow.id,
      public_url: `/preview/custom/${publicSlug}`,
      public_slug: publicSlug,
      ai_content: finalContent,
      hero_image_url: heroPublicUrl,
      preview: finalRow,
    }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });

  } catch (e: any) {
    console.error("[custom-preview-gen] fatal:", e);
    return new Response(JSON.stringify({ success: false, error: e.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
