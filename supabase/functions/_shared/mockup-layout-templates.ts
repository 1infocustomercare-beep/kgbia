// Empire Mockup Layout Templates — Deno (edge functions)
// 6 layout architetturali completamente differenti per il custom-preview-generator.
// Ogni layout ha:
//  - CSS specifico (gridding, hero, sezioni, animazioni)
//  - Markup body unico (ordine sezioni, decorazioni, hero composition)

import type { MockupStylePreset } from "./mockup-style-presets.ts";

export type LayoutBundle = {
  /** CSS aggiuntivo iniettato dopo il CSS base (sovrascrive le classi) */
  css: string;
  /** HTML body completo (esclusa la nav e gli script footer) */
  body: string;
};

type Ctx = {
  preset: MockupStylePreset;
  t: MockupStylePreset["palette"] & { accent: string };
  lead: {
    lead_name: string;
    lead_city?: string;
    lead_sector?: string;
    lead_phone?: string;
    lead_address?: string;
    lead_email?: string;
    lead_rating?: number;
    lead_reviews_count?: number;
  };
  content: any;
  heroUrl: string | null;
  logoUrl: string | null;
  gallery: string[];
  waLink: string;
  waMsg: string;
  esc: (s: string) => string;
  featuresHtml: string;
  servicesHtml: string;
  testimonialsHtml: string;
  faqHtml: string;
  galleryHtml: string;
  navHtml: string;
  footerHtml: string;
  waFabHtml: string;
  contactHtml: string;
};

// ─── helpers riusabili ───
function ratingHtml(c: Ctx) {
  if (!c.lead.lead_rating) return "";
  return `<div class="hero-rating"><span class="stars">${"★".repeat(Math.round(c.lead.lead_rating))}</span><span>${c.lead.lead_rating}/5 su Google · ${c.lead.lead_reviews_count || 0} recensioni</span></div>`;
}

function badgeHtml(c: Ctx) {
  return `<div class="hero-badge">${c.esc(c.lead.lead_sector || "Premium")}${c.lead.lead_city ? ` • ${c.esc(c.lead.lead_city)}` : ""}</div>`;
}

// ════════════════════════════════════════════════════════════
// 1. EDITORIAL MAGAZINE
// Hero asimmetrico (testo gigante a sinistra, immagine a destra),
// numeri di sezione, serif gigante, regole sottili
// ════════════════════════════════════════════════════════════
function editorialMagazine(c: Ctx): LayoutBundle {
  return {
    css: `
      .hero{display:grid;grid-template-columns:1.1fr 0.9fr;gap:60px;align-items:center;padding:140px 0 90px;min-height:auto}
      .hero::before,.hero::after{display:none}
      .hero-content{max-width:none}
      .hero-eyebrow{font-family:'${c.preset.fonts.body}',sans-serif;font-size:11px;letter-spacing:4px;text-transform:uppercase;color:${c.t.muted};margin-bottom:24px;padding-bottom:18px;border-bottom:1px solid ${c.t.text}22}
      .hero h1{font-size:clamp(48px,7vw,96px);line-height:0.95;letter-spacing:-2px;font-weight:500}
      .hero h1 em{font-style:italic;color:${c.t.accent}}
      .hero-image{aspect-ratio:4/5;background:${c.heroUrl ? `url('${c.heroUrl}') center/cover` : `linear-gradient(160deg,${c.t.accent},${c.t.surface})`};border-radius:${c.preset.radius}px}
      @media(max-width:880px){.hero{grid-template-columns:1fr;padding:110px 0 60px}}

      .section-title{text-align:left;font-size:clamp(36px,5vw,64px);font-weight:500}
      .section-subtitle{text-align:left;margin-left:0}
      .section-num{display:block;font-family:'${c.preset.fonts.body}';font-size:11px;letter-spacing:3px;color:${c.t.accent};margin-bottom:14px;text-transform:uppercase}
      .editorial-rule{height:1px;background:${c.t.text}11;margin:0 auto;max-width:1200px}
      .features-grid{grid-template-columns:repeat(2,1fr);gap:48px}
      .feature-card{background:transparent;border:0;padding:0;border-top:1px solid ${c.t.text}22;padding-top:24px}
      .feature-card:hover{transform:none}
      .feature-icon{font-size:24px;margin-bottom:12px}
      .about-grid{grid-template-columns:1fr 1fr;gap:80px}
      .services-grid{grid-template-columns:repeat(3,1fr);gap:0}
      .service-card{background:transparent;border:0;border-right:1px solid ${c.t.text}22;border-radius:0;padding:32px}
      .service-card:last-child{border-right:0}
      @media(max-width:880px){.services-grid{grid-template-columns:1fr}.service-card{border-right:0;border-bottom:1px solid ${c.t.text}22}}
    `,
    body: `
      ${c.navHtml}
      <section class="hero">
        <div class="hero-content">
          <div class="hero-eyebrow">${c.esc(c.lead.lead_sector || "Atelier")} · ${c.esc(c.lead.lead_city || "Italia")} · Est. ${new Date().getFullYear()}</div>
          <h1>${c.esc(c.content.hero_title || c.lead.lead_name)}</h1>
          <p class="sub" style="margin-top:32px">${c.esc(c.content.hero_subtitle || "")}</p>
          <div class="hero-actions" style="margin-top:40px">
            <a href="${c.waLink}" class="btn-primary">${c.esc(c.content.hero_cta || "Prenota")}</a>
            <a href="#services" class="btn-secondary">Esplora</a>
          </div>
          ${ratingHtml(c)}
        </div>
        <div class="hero-image"></div>
      </section>

      <div class="editorial-rule"></div>

      <section class="section">
        <div class="container">
          <span class="section-num">01 — Filosofia</span>
          <h2 class="section-title">Perché sceglierci</h2>
          <p class="section-subtitle">Quattro principi che guidano ogni nostra scelta</p>
          <div class="features-grid">${c.featuresHtml}</div>
        </div>
      </section>

      <section class="section about" id="about">
        <div class="container">
          <span class="section-num">02 — Storia</span>
          <div class="about-grid">
            <div>
              <h2 class="section-title">${c.esc(c.content.about_title || "La nostra storia")}</h2>
              <div class="about-text">${c.esc(c.content.about_text || "").split("\n").map((p) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
            </div>
            <div class="about-image"></div>
          </div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <span class="section-num">03 — Servizi</span>
          <h2 class="section-title">Servizi</h2>
          <div class="services-grid">${c.servicesHtml}</div>
        </div>
      </section>

      ${c.galleryHtml}

      <section class="section testimonials">
        <div class="container">
          <span class="section-num">04 — Voci</span>
          <h2 class="section-title">Cosa dicono i clienti</h2>
          <div class="testimonials-grid">${c.testimonialsHtml}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <span class="section-num">05 — Risposte</span>
          <h2 class="section-title">Domande Frequenti</h2>
          <div class="faq-list">${c.faqHtml}</div>
        </div>
      </section>

      ${c.contactHtml}
      ${c.footerHtml}
      ${c.waFabHtml}
    `,
  };
}

// ════════════════════════════════════════════════════════════
// 2. SPLIT LUXURY
// Hero 50/50 fisso (immagine + contenuto), due colonne dominanti,
// contrasto netto bg/surface
// ════════════════════════════════════════════════════════════
function splitLuxury(c: Ctx): LayoutBundle {
  return {
    css: `
      .hero{display:grid;grid-template-columns:1fr 1fr;gap:0;min-height:100vh;padding:0;align-items:stretch}
      .hero::before,.hero::after{display:none}
      .hero-image-side{background:${c.heroUrl ? `url('${c.heroUrl}') center/cover` : `linear-gradient(135deg,${c.t.accent},${c.t.surface})`};position:relative}
      .hero-image-side::after{content:'';position:absolute;inset:0;background:linear-gradient(45deg,${c.t.bg}33,transparent)}
      .hero-text-side{padding:120px 60px 60px;display:flex;flex-direction:column;justify-content:center;background:${c.t.bg}}
      .hero-content{max-width:520px}
      .hero h1{font-size:clamp(40px,5vw,72px);line-height:1.05}
      @media(max-width:880px){.hero{grid-template-columns:1fr;min-height:auto}.hero-image-side{aspect-ratio:16/10}.hero-text-side{padding:80px 32px 60px}}

      .about-grid{grid-template-columns:1fr 1fr;gap:0;align-items:stretch}
      .about-grid > div:first-child{padding:80px;background:${c.t.bg}}
      .about-image{aspect-ratio:auto;border-radius:0;height:100%;min-height:500px}
      @media(max-width:880px){.about-grid{grid-template-columns:1fr}.about-grid > div:first-child{padding:48px}.about-image{min-height:340px}}

      .services-grid{grid-template-columns:repeat(2,1fr)}
      .service-card{padding:40px;border-radius:${c.preset.radius}px}
      .features-grid{grid-template-columns:repeat(2,1fr);gap:32px}
      .feature-card{padding:48px 36px;border-radius:${c.preset.radius}px}
    `,
    body: `
      ${c.navHtml}
      <section class="hero">
        <div class="hero-image-side"></div>
        <div class="hero-text-side">
          <div class="hero-content">
            ${badgeHtml(c)}
            <h1>${c.esc(c.content.hero_title || c.lead.lead_name)}</h1>
            <p class="sub">${c.esc(c.content.hero_subtitle || "")}</p>
            <div class="hero-actions">
              <a href="${c.waLink}" class="btn-primary">${c.esc(c.content.hero_cta || "Prenota")}</a>
              <a href="#services" class="btn-secondary">Scopri</a>
            </div>
            ${ratingHtml(c)}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Perché sceglierci</h2>
          <p class="section-subtitle">L'esperienza ${c.esc(c.lead.lead_name)}</p>
          <div class="features-grid">${c.featuresHtml}</div>
        </div>
      </section>

      <section class="about" id="about">
        <div class="about-grid">
          <div>
            <h2 class="section-title" style="text-align:left">${c.esc(c.content.about_title || "La nostra storia")}</h2>
            <div class="about-text" style="margin-top:24px">${c.esc(c.content.about_text || "").split("\n").map((p) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
          </div>
          <div class="about-image"></div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <h2 class="section-title">Servizi</h2>
          <div class="services-grid">${c.servicesHtml}</div>
        </div>
      </section>

      ${c.galleryHtml}

      <section class="section testimonials">
        <div class="container">
          <h2 class="section-title">Cosa dicono i clienti</h2>
          <div class="testimonials-grid">${c.testimonialsHtml}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Domande Frequenti</h2>
          <div class="faq-list">${c.faqHtml}</div>
        </div>
      </section>

      ${c.contactHtml}
      ${c.footerHtml}
      ${c.waFabHtml}
    `,
  };
}

// ════════════════════════════════════════════════════════════
// 3. GLASS OVERLAY
// Glassmorphism Apple Vision Pro: blur, panels semi-trasparenti,
// gradient bg statico, depth con ombre soft
// ════════════════════════════════════════════════════════════
function glassOverlay(c: Ctx): LayoutBundle {
  const glass = `background:rgba(255,255,255,0.55);backdrop-filter:blur(40px) saturate(180%);-webkit-backdrop-filter:blur(40px) saturate(180%);border:1px solid rgba(255,255,255,0.7);box-shadow:0 30px 80px -20px rgba(0,0,0,0.18)`;
  return {
    css: `
      body{background:${c.t.bg};background-attachment:fixed}
      body::before{content:'';position:fixed;inset:0;background:radial-gradient(circle at 20% 20%,${c.t.accent}33,transparent 60%),radial-gradient(circle at 80% 80%,${c.t.accent}22,transparent 60%);z-index:-1;pointer-events:none}

      .nav{${glass};border-radius:0 0 24px 24px;border-bottom:0}

      .hero{padding:160px 0 100px;min-height:auto}
      .hero::before,.hero::after{display:none}
      .hero-content{max-width:880px;text-align:center;margin:0 auto;${glass};padding:80px 60px;border-radius:48px}
      .hero h1{font-size:clamp(44px,6vw,84px);font-weight:700;letter-spacing:-2px}
      .hero p.sub{margin-left:auto;margin-right:auto;font-size:20px}
      .hero-actions{justify-content:center}
      .hero-badge{${glass};color:${c.t.text};border:1px solid rgba(255,255,255,0.7)}

      .section-title{font-weight:700}
      .feature-card,.service-card,.testimonial,.faq-item{${glass};border-radius:28px}
      .feature-card:hover{transform:translateY(-6px);box-shadow:0 40px 100px -24px rgba(0,0,0,0.24)}
      .features-grid{grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:24px}
      .about{background:transparent}
      .about-grid > div:first-child{${glass};padding:60px;border-radius:36px}
      .about-image{border-radius:36px;box-shadow:0 40px 100px -20px rgba(0,0,0,0.3)}
      .testimonials{background:transparent}
      .cta-section{background:transparent}
      .cta-section .container > *{position:relative}
      .cta-section{padding:120px 0}
      .cta-section h2,.cta-section p{position:relative;z-index:2}
      footer{${glass};border-top:0;border-radius:24px 24px 0 0;margin-top:40px}
    `,
    body: `
      ${c.navHtml}
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            ${badgeHtml(c)}
            <h1>${c.esc(c.content.hero_title || c.lead.lead_name)}</h1>
            <p class="sub">${c.esc(c.content.hero_subtitle || "")}</p>
            <div class="hero-actions">
              <a href="${c.waLink}" class="btn-primary">${c.esc(c.content.hero_cta || "Prenota")}</a>
              <a href="#services" class="btn-secondary">Esplora</a>
            </div>
            ${ratingHtml(c)}
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Perché sceglierci</h2>
          <p class="section-subtitle">L'esperienza ${c.esc(c.lead.lead_name)} in 4 punti</p>
          <div class="features-grid">${c.featuresHtml}</div>
        </div>
      </section>

      <section class="section about" id="about">
        <div class="container">
          <div class="about-grid">
            <div>
              <h2 class="section-title" style="text-align:left">${c.esc(c.content.about_title || "La nostra storia")}</h2>
              <div class="about-text" style="margin-top:18px">${c.esc(c.content.about_text || "").split("\n").map((p) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
            </div>
            <div class="about-image"></div>
          </div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <h2 class="section-title">Servizi</h2>
          <div class="services-grid">${c.servicesHtml}</div>
        </div>
      </section>

      ${c.galleryHtml}

      <section class="section testimonials">
        <div class="container">
          <h2 class="section-title">Cosa dicono i clienti</h2>
          <div class="testimonials-grid">${c.testimonialsHtml}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Domande Frequenti</h2>
          <div class="faq-list">${c.faqHtml}</div>
        </div>
      </section>

      ${c.contactHtml}
      ${c.footerHtml}
      ${c.waFabHtml}
    `,
  };
}

// ════════════════════════════════════════════════════════════
// 4. CENTERED MINIMAL
// Tutto centrato, molto whitespace, hero verticale,
// tipo pagina prodotto Apple
// ════════════════════════════════════════════════════════════
function centeredMinimal(c: Ctx): LayoutBundle {
  return {
    css: `
      .hero{padding:160px 0 100px;text-align:center;min-height:auto}
      .hero::before,.hero::after{display:none}
      .hero-content{max-width:780px;margin:0 auto;text-align:center}
      .hero h1{font-size:clamp(44px,6vw,84px);font-weight:600;letter-spacing:-2px}
      .hero p.sub{margin:0 auto 40px;font-size:21px}
      .hero-actions{justify-content:center}
      .hero-image-centered{margin-top:60px;aspect-ratio:16/10;background:${c.heroUrl ? `url('${c.heroUrl}') center/cover` : `linear-gradient(135deg,${c.t.accent},${c.t.surface})`};border-radius:${c.preset.radius}px;max-width:1100px;margin-left:auto;margin-right:auto;box-shadow:0 40px 100px -24px rgba(0,0,0,0.24)}

      .section{text-align:center}
      .section-title{margin-left:auto;margin-right:auto}
      .section-subtitle{margin-left:auto;margin-right:auto}
      .features-grid{grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:32px;max-width:1000px;margin:0 auto}
      .feature-card{background:transparent;border:0;padding:24px;text-align:center}
      .feature-card:hover{transform:translateY(-2px)}
      .about-grid{grid-template-columns:1fr;text-align:center;max-width:780px;margin:0 auto}
      .about-grid .about-image{display:none}
      .services-grid{grid-template-columns:repeat(auto-fit,minmax(240px,1fr));max-width:1100px;margin:0 auto}
      .service-card{text-align:center}
      .testimonials-grid{grid-template-columns:repeat(auto-fit,minmax(280px,1fr));max-width:1000px;margin:0 auto}
      .testimonial{text-align:center}
      .faq-list{text-align:left}
    `,
    body: `
      ${c.navHtml}
      <section class="hero">
        <div class="container">
          <div class="hero-content">
            ${badgeHtml(c)}
            <h1>${c.esc(c.content.hero_title || c.lead.lead_name)}</h1>
            <p class="sub">${c.esc(c.content.hero_subtitle || "")}</p>
            <div class="hero-actions">
              <a href="${c.waLink}" class="btn-primary">${c.esc(c.content.hero_cta || "Prenota")}</a>
              <a href="#services" class="btn-secondary">Scopri</a>
            </div>
            ${ratingHtml(c)}
          </div>
          <div class="hero-image-centered"></div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Perché sceglierci</h2>
          <p class="section-subtitle">${c.esc(c.lead.lead_name)} in 4 principi</p>
          <div class="features-grid">${c.featuresHtml}</div>
        </div>
      </section>

      <section class="section about" id="about">
        <div class="container">
          <h2 class="section-title">${c.esc(c.content.about_title || "La nostra storia")}</h2>
          <div class="about-text" style="max-width:680px;margin:0 auto">${c.esc(c.content.about_text || "").split("\n").map((p) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <h2 class="section-title">Servizi</h2>
          <p class="section-subtitle">Tutto quello che possiamo fare per te</p>
          <div class="services-grid">${c.servicesHtml}</div>
        </div>
      </section>

      ${c.galleryHtml}

      <section class="section testimonials">
        <div class="container">
          <h2 class="section-title">Cosa dicono i clienti</h2>
          <div class="testimonials-grid">${c.testimonialsHtml}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Domande Frequenti</h2>
          <div class="faq-list">${c.faqHtml}</div>
        </div>
      </section>

      ${c.contactHtml}
      ${c.footerHtml}
      ${c.waFabHtml}
    `,
  };
}

// ════════════════════════════════════════════════════════════
// 5. BENTO GRID
// Mosaico modulare ispirato Apple/Linear: hero come bento card
// gigante + griglia varia di tile (alti/larghi/quadrati)
// ════════════════════════════════════════════════════════════
function bentoGrid(c: Ctx): LayoutBundle {
  return {
    css: `
      .hero{padding:120px 0 40px;min-height:auto}
      .hero::before,.hero::after{display:none}
      .bento-hero{display:grid;grid-template-columns:repeat(4,1fr);grid-auto-rows:160px;gap:16px;max-width:1200px;margin:0 auto}
      .bento{border-radius:${c.preset.radius}px;padding:32px;display:flex;flex-direction:column;justify-content:flex-end;background:${c.t.cardBg};border:1px solid ${c.t.accent}22;overflow:hidden;position:relative;transition:transform .3s}
      .bento:hover{transform:scale(1.02)}
      .bento-hero-main{grid-column:1 / 3;grid-row:1 / 3;background:${c.heroUrl ? `linear-gradient(180deg,transparent 30%,${c.t.bg}ee),url('${c.heroUrl}') center/cover` : `linear-gradient(135deg,${c.t.accent},${c.t.surface})`};color:${c.t.text}}
      .bento-hero-main h1{font-size:clamp(28px,3.5vw,52px);font-weight:700;line-height:1.05;letter-spacing:-1px;margin-bottom:12px}
      .bento-hero-main .sub{font-size:15px;color:${c.t.muted};margin-bottom:20px;max-width:420px}
      .bento-hero-main .hero-actions{display:flex;gap:10px;flex-wrap:wrap}
      .bento-tile-cta{grid-column:3 / 5;grid-row:1 / 2;background:${c.t.accent};color:${c.t.bg};text-decoration:none;display:flex;flex-direction:column;justify-content:space-between}
      .bento-tile-cta strong{font-size:24px;line-height:1.1;margin-bottom:8px}
      .bento-tile-cta:hover{transform:scale(1.02)}
      .bento-tile-rating{grid-column:3 / 4;grid-row:2 / 3;justify-content:center;text-align:center}
      .bento-tile-rating .big-num{font-size:48px;font-weight:800;color:${c.t.accent};line-height:1}
      .bento-tile-img{grid-column:4 / 5;grid-row:2 / 3;background:${c.heroUrl ? `url('${c.heroUrl}') center/cover` : `linear-gradient(135deg,${c.t.accent}66,${c.t.surface})`}}
      .bento-tile-badge{grid-column:1 / 3;grid-row:3 / 4;justify-content:space-between;flex-direction:row;align-items:center}
      .bento-tile-badge h3{font-size:18px;font-weight:700}
      .bento-tile-info{grid-column:3 / 5;grid-row:3 / 4;justify-content:center}
      .bento-tile-info p{color:${c.t.muted};font-size:14px}
      @media(max-width:880px){
        .bento-hero{grid-template-columns:repeat(2,1fr);grid-auto-rows:140px}
        .bento-hero-main{grid-column:1 / 3;grid-row:1 / 3}
        .bento-tile-cta{grid-column:1 / 3;grid-row:3 / 4}
        .bento-tile-rating{grid-column:1 / 2;grid-row:4 / 5}
        .bento-tile-img{grid-column:2 / 3;grid-row:4 / 5}
        .bento-tile-badge{grid-column:1 / 3;grid-row:5 / 6}
        .bento-tile-info{grid-column:1 / 3;grid-row:6 / 7}
      }

      .features-grid{grid-template-columns:repeat(4,1fr);grid-auto-rows:180px;gap:16px}
      .feature-card{border-radius:${c.preset.radius}px;padding:28px;display:flex;flex-direction:column;justify-content:flex-end}
      .feature-card:nth-child(1){grid-column:span 2}
      .feature-card:nth-child(4){grid-column:span 2}
      @media(max-width:880px){.features-grid{grid-template-columns:repeat(2,1fr)}.feature-card:nth-child(1),.feature-card:nth-child(4){grid-column:span 2}}

      .services-grid{grid-template-columns:repeat(3,1fr);grid-auto-rows:auto;gap:16px}
      .service-card{border-radius:${c.preset.radius}px;padding:32px;min-height:200px}
      @media(max-width:880px){.services-grid{grid-template-columns:1fr}}
    `,
    body: `
      ${c.navHtml}
      <section class="hero">
        <div class="container">
          <div class="bento-hero">
            <div class="bento bento-hero-main">
              ${badgeHtml(c)}
              <h1>${c.esc(c.content.hero_title || c.lead.lead_name)}</h1>
              <p class="sub">${c.esc(c.content.hero_subtitle || "")}</p>
              <div class="hero-actions">
                <a href="${c.waLink}" class="btn-primary">${c.esc(c.content.hero_cta || "Prenota")}</a>
              </div>
            </div>
            <a href="${c.waLink}" class="bento bento-tile-cta">
              <span style="font-size:11px;letter-spacing:2px;text-transform:uppercase;opacity:.8">Contatto rapido</span>
              <div>
                <strong>${c.esc(c.content.hero_cta || "Scrivici")}</strong>
                <p style="font-size:14px;opacity:.9;margin-top:4px">${c.esc(c.lead.lead_phone || "WhatsApp diretto")}</p>
              </div>
            </a>
            <div class="bento bento-tile-rating">
              ${c.lead.lead_rating ? `<div class="big-num">${c.lead.lead_rating.toFixed(1)}</div><div style="color:#FFB800;font-size:18px">${"★".repeat(Math.round(c.lead.lead_rating))}</div><div style="font-size:12px;color:${c.t.muted};margin-top:6px">${c.lead.lead_reviews_count || 0} recensioni Google</div>` : `<div style="font-size:32px;font-weight:800;color:${c.t.accent}">★★★★★</div><div style="font-size:13px;color:${c.t.muted};margin-top:6px">Servizio premium</div>`}
            </div>
            <div class="bento bento-tile-img"></div>
            <div class="bento bento-tile-badge">
              <h3>📍 ${c.esc(c.lead.lead_city || "Italia")}</h3>
              <span style="color:${c.t.muted};font-size:13px">${c.esc(c.lead.lead_address || c.lead.lead_sector || "Premium")}</span>
            </div>
            <div class="bento bento-tile-info">
              <p>${c.esc((c.content.hero_subtitle || "").slice(0, 120))}</p>
            </div>
          </div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Perché sceglierci</h2>
          <p class="section-subtitle">${c.esc(c.lead.lead_name)} in 4 punti</p>
          <div class="features-grid">${c.featuresHtml}</div>
        </div>
      </section>

      <section class="section about" id="about">
        <div class="container">
          <div class="about-grid">
            <div>
              <h2 class="section-title" style="text-align:left">${c.esc(c.content.about_title || "La nostra storia")}</h2>
              <div class="about-text">${c.esc(c.content.about_text || "").split("\n").map((p) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
            </div>
            <div class="about-image"></div>
          </div>
        </div>
      </section>

      <section class="section" id="services">
        <div class="container">
          <h2 class="section-title">Servizi</h2>
          <div class="services-grid">${c.servicesHtml}</div>
        </div>
      </section>

      ${c.galleryHtml}

      <section class="section testimonials">
        <div class="container">
          <h2 class="section-title">Cosa dicono i clienti</h2>
          <div class="testimonials-grid">${c.testimonialsHtml}</div>
        </div>
      </section>

      <section class="section">
        <div class="container">
          <h2 class="section-title">Domande Frequenti</h2>
          <div class="faq-list">${c.faqHtml}</div>
        </div>
      </section>

      ${c.contactHtml}
      ${c.footerHtml}
      ${c.waFabHtml}
    `,
  };
}

// ════════════════════════════════════════════════════════════
// 6. MAGAZINE STACK
// Sezioni full-width alternate, parallax-feel, transizioni cinema
// ════════════════════════════════════════════════════════════
function magazineStack(c: Ctx): LayoutBundle {
  return {
    css: `
      .hero{min-height:100vh;padding:0;display:flex;align-items:center;position:relative}
      .hero::before{content:'';position:absolute;inset:0;background:${c.heroUrl ? `url('${c.heroUrl}') center/cover` : `linear-gradient(135deg,${c.t.accent}66,${c.t.bg})`};z-index:0}
      .hero::after{content:'';position:absolute;inset:0;background:linear-gradient(180deg,${c.t.bg}00 0%,${c.t.bg}cc 70%,${c.t.bg} 100%);z-index:1}
      .hero-content{position:relative;z-index:2;max-width:780px;padding:120px 0 60px}
      .hero h1{font-size:clamp(56px,8vw,120px);line-height:0.92;letter-spacing:-3px;font-weight:800}

      .stack-section{padding:120px 0;position:relative;border-top:1px solid ${c.t.text}11}
      .stack-section.dark{background:${c.t.surface};color:${c.t.text}}
      .stack-section h2.section-title{font-size:clamp(40px,5vw,72px);text-align:left;margin-bottom:24px}
      .stack-section .section-subtitle{text-align:left;margin-left:0;font-size:20px;max-width:680px;margin-bottom:60px}

      .features-grid{grid-template-columns:repeat(2,1fr);gap:48px}
      .feature-card{background:transparent;border:0;padding:32px 0;border-top:2px solid ${c.t.accent};border-radius:0}
      .feature-card:hover{transform:none}
      .feature-icon{font-size:32px}
      .feature-card h3{font-size:22px;margin-top:8px}

      .about-grid{grid-template-columns:0.45fr 0.55fr;gap:80px;align-items:center}
      .about-image{aspect-ratio:3/4;border-radius:${c.preset.radius}px}

      .services-grid{grid-template-columns:1fr;gap:0}
      .service-card{background:transparent;border:0;border-radius:0;border-bottom:1px solid ${c.t.text}22;padding:36px 0;display:grid;grid-template-columns:1fr 2fr 0.5fr;gap:32px;align-items:center}
      .service-card:last-child{border-bottom:0}
      .service-name{font-size:24px}
      .service-desc{font-size:15px}
      @media(max-width:880px){.service-card{grid-template-columns:1fr}}

      .testimonials-grid{grid-template-columns:1fr;gap:0}
      .testimonial{background:transparent;border:0;border-radius:0;padding:48px 0;border-bottom:1px solid ${c.t.text}22}
      .testimonial p{font-size:24px;line-height:1.5;font-style:italic;color:${c.t.text}}
      .testimonial:last-child{border-bottom:0}

      .marquee-tag{display:inline-block;font-family:'${c.preset.fonts.body}';font-size:11px;letter-spacing:6px;text-transform:uppercase;color:${c.t.accent};margin-bottom:16px;padding:6px 14px;border:1px solid ${c.t.accent}66;border-radius:0}
    `,
    body: `
      ${c.navHtml}
      <section class="hero">
        <div class="container hero-content">
          <span class="marquee-tag">${c.esc(c.lead.lead_sector || "Premium")} · ${c.esc(c.lead.lead_city || "Italia")}</span>
          <h1>${c.esc(c.content.hero_title || c.lead.lead_name)}</h1>
          <p class="sub" style="margin-top:24px;font-size:21px">${c.esc(c.content.hero_subtitle || "")}</p>
          <div class="hero-actions" style="margin-top:36px">
            <a href="${c.waLink}" class="btn-primary">${c.esc(c.content.hero_cta || "Prenota")}</a>
            <a href="#services" class="btn-secondary">Scopri il mondo ${c.esc(c.lead.lead_name)}</a>
          </div>
          ${ratingHtml(c)}
        </div>
      </section>

      <section class="stack-section">
        <div class="container">
          <span class="marquee-tag">— Capitolo I</span>
          <h2 class="section-title">Perché sceglierci</h2>
          <p class="section-subtitle">Quattro principi che guidano ${c.esc(c.lead.lead_name)}</p>
          <div class="features-grid">${c.featuresHtml}</div>
        </div>
      </section>

      <section class="stack-section dark about" id="about">
        <div class="container">
          <span class="marquee-tag">— Capitolo II</span>
          <div class="about-grid">
            <div class="about-image"></div>
            <div>
              <h2 class="section-title" style="text-align:left">${c.esc(c.content.about_title || "La nostra storia")}</h2>
              <div class="about-text">${c.esc(c.content.about_text || "").split("\n").map((p) => `<p style="margin-bottom:14px">${p}</p>`).join("")}</div>
            </div>
          </div>
        </div>
      </section>

      <section class="stack-section" id="services">
        <div class="container">
          <span class="marquee-tag">— Capitolo III</span>
          <h2 class="section-title">Servizi</h2>
          <p class="section-subtitle">Tutto quello che possiamo fare per te</p>
          <div class="services-grid">${c.servicesHtml}</div>
        </div>
      </section>

      ${c.galleryHtml}

      <section class="stack-section dark testimonials">
        <div class="container">
          <span class="marquee-tag">— Capitolo IV · Voci</span>
          <h2 class="section-title">Cosa dicono i clienti</h2>
          <div class="testimonials-grid">${c.testimonialsHtml}</div>
        </div>
      </section>

      <section class="stack-section">
        <div class="container">
          <span class="marquee-tag">— Capitolo V · Risposte</span>
          <h2 class="section-title">Domande Frequenti</h2>
          <div class="faq-list">${c.faqHtml}</div>
        </div>
      </section>

      ${c.contactHtml}
      ${c.footerHtml}
      ${c.waFabHtml}
    `,
  };
}

// ─── Dispatcher ───
export function renderLayout(layout: MockupStylePreset["layout"], ctx: Ctx): LayoutBundle {
  switch (layout) {
    case "editorial-magazine": return editorialMagazine(ctx);
    case "split-luxury":       return splitLuxury(ctx);
    case "glass-overlay":      return glassOverlay(ctx);
    case "centered-minimal":   return centeredMinimal(ctx);
    case "bento-grid":         return bentoGrid(ctx);
    case "magazine-stack":     return magazineStack(ctx);
    default:                   return editorialMagazine(ctx);
  }
}
