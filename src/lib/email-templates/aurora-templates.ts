/**
 * Aurora Violet — Premium email template library
 *
 * 8 template HTML inline-style pensati per outreach B2B su attività locali (food, beauty, NCC, fitness, hospitality, healthcare, retail, professional).
 * Ogni template è ottimizzato per:
 *  - Render perfetto su Gmail / Outlook / Apple Mail (CSS inline + table layout)
 *  - Dark mode safe (background bianco fisso #ffffff)
 *  - Mobile responsive senza media query (max-width + padding %)
 *  - Deliverability alta: testo > link, niente parole spam, soggetti corti
 *
 * Palette Aurora Violet: #0f0a1f (deep) · #1e1b4b (indigo) · #7c3aed (violet) · #22d3ee (cyan accent) · #f5f3ff (lavender bg)
 */

export type TemplateVariables = {
  recipientName: string;          // "Marco" o "Pizzeria Da Luigi"
  businessName: string;           // "Pizzeria Da Luigi"
  city?: string;
  sectorLabel?: string;           // "ristorazione", "estetica", "NCC"
  painPoint?: string;             // pain personalizzato dal profilo AI
  previewLink?: string;           // link demo personalizzata
  callBookingLink?: string;       // calendly o simile
  senderName?: string;            // "Arianna"
  senderRole?: string;            // "Empire AI Group"
  senderSignatureLine?: string;   // firma multi-riga opzionale
  ctaPrimary?: string;            // override CTA
  unsubscribeNote?: string;       // micro-copy footer
};

export type EmailTemplateMeta = {
  id: string;
  name: string;
  description: string;
  bestFor: string[];              // settori consigliati
  tone: "warm" | "executive" | "playful" | "urgency" | "consultative" | "case-study" | "value-stack" | "soft-followup";
  conversionScore: number;        // 0-100, stima storica
  estimatedReadTime: string;      // "20s"
  recommendedSubjects: string[];
};

export type EmailTemplate = EmailTemplateMeta & {
  buildSubject: (v: TemplateVariables) => string;
  buildHtml: (v: TemplateVariables) => string;
  buildText: (v: TemplateVariables) => string;
};

/* ────────────────────────────────────────────────────────────────────────── */
/*  Helpers                                                                   */
/* ────────────────────────────────────────────────────────────────────────── */

const ESC = (s: string | undefined | null): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const SHELL = (innerHtml: string, previewText: string) => `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="it">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<meta name="x-apple-disable-message-reformatting" />
<meta name="color-scheme" content="light only" />
<meta name="supported-color-schemes" content="light only" />
<title>${ESC(previewText)}</title>
</head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI','Inter',Helvetica,Arial,sans-serif;color:#0f0a1f;-webkit-font-smoothing:antialiased;">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;font-size:1px;line-height:1px;">${ESC(previewText)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f3ff;padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 8px 32px rgba(15,10,31,0.08);">
${innerHtml}
</table>
</td></tr>
</table>
</body>
</html>`;

const FOOTER = (v: TemplateVariables) => `
<tr><td style="padding:18px 36px 28px 36px;border-top:1px solid #ece9fb;background:#fafaff;">
  <p style="margin:0 0 6px 0;font-size:12px;color:#6b6390;line-height:1.55;">
    ${ESC(v.senderSignatureLine || "Empire AI Group · Empire Building Software · Italia")}
  </p>
  <p style="margin:0;font-size:11px;color:#9890b8;line-height:1.5;">
    Hai ricevuto questa email perché la tua attività è pubblicata online. ${ESC(v.unsubscribeNote || "Se preferisci non ricevere più nostre comunicazioni, basta una risposta con scritto «stop».")}
  </p>
</td></tr>`;

const HEADER_AURORA = `
<tr><td style="background:linear-gradient(135deg,#0f0a1f 0%,#1e1b4b 50%,#7c3aed 100%);padding:22px 36px;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
    <tr>
      <td style="vertical-align:middle;">
        <span style="display:inline-block;font-size:11px;letter-spacing:0.18em;text-transform:uppercase;color:#22d3ee;font-weight:700;">Empire AI Group</span>
      </td>
      <td align="right" style="vertical-align:middle;">
        <span style="display:inline-block;padding:4px 10px;border-radius:999px;background:rgba(255,255,255,0.08);border:1px solid rgba(255,255,255,0.18);font-size:10px;letter-spacing:0.12em;text-transform:uppercase;color:#ffffff;font-weight:700;">Solo per ${"{TARGET}"}</span>
      </td>
    </tr>
  </table>
</td></tr>`;

const headerWithTarget = (target: string) => HEADER_AURORA.replace("{TARGET}", ESC(target));

const buttonAurora = (label: string, href: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:18px 0 8px 0;">
  <tr><td style="border-radius:14px;background:linear-gradient(135deg,#7c3aed 0%,#22d3ee 100%);box-shadow:0 8px 22px rgba(124,58,237,0.35);">
    <a href="${ESC(href)}" style="display:inline-block;padding:14px 26px;border-radius:14px;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;letter-spacing:0.01em;">${ESC(label)} →</a>
  </td></tr>
</table>`;

const linkAurora = (label: string, href: string) =>
  `<a href="${ESC(href)}" style="color:#7c3aed;font-weight:600;text-decoration:none;border-bottom:1px solid #c4b5fd;">${ESC(label)}</a>`;

/* ────────────────────────────────────────────────────────────────────────── */
/*  Templates                                                                 */
/* ────────────────────────────────────────────────────────────────────────── */

export const TEMPLATES: EmailTemplate[] = [
  {
    id: "aurora-cold-personal",
    name: "Cold Personal — Aurora",
    description: "Primo contatto caldo, basato su un dettaglio reale dell'attività. Massima personalizzazione, zero pitch.",
    bestFor: ["food", "beauty", "fitness", "retail"],
    tone: "warm",
    conversionScore: 84,
    estimatedReadTime: "20s",
    recommendedSubjects: [
      "Una nota su {{businessName}}",
      "Idea veloce per {{businessName}}",
      "Pensavo a {{businessName}} stamattina",
    ],
    buildSubject: (v) => `Una nota su ${v.businessName}`,
    buildHtml: (v) => SHELL(`
${headerWithTarget(v.businessName)}
<tr><td style="padding:36px 36px 8px 36px;">
  <h1 style="margin:0 0 14px 0;font-size:24px;line-height:1.25;color:#0f0a1f;font-weight:700;letter-spacing:-0.01em;">
    Ciao ${ESC(v.recipientName)},
  </h1>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">
    Sono ${ESC(v.senderName || "Arianna")}. Mi occupo di trasformazione digitale per attività ${ESC(v.sectorLabel || "locali")} in Italia, e oggi ho dato un'occhiata a <strong style="color:#0f0a1f;">${ESC(v.businessName)}</strong>${v.city ? ` a ${ESC(v.city)}` : ""}.
  </p>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">
    Ho notato una cosa: ${ESC(v.painPoint || "molte attività come la vostra perdono clienti per piccoli attriti operativi (gestione manuale, prenotazioni, recensioni).")} È un peccato perché si risolve in pochi giorni.
  </p>
  ${v.previewLink ? `<p style="margin:0 0 8px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Per non parlare a vuoto, ho preparato una preview personalizzata di come potrebbe essere la vostra presenza digitale. Si guarda in 30 secondi:</p>${buttonAurora(v.ctaPrimary || "Apri la preview personalizzata", v.previewLink)}` : ""}
  <p style="margin:14px 0 0 0;font-size:15px;line-height:1.65;color:#2d2a4a;">
    Se ha senso, ti lascio decidere se vale 15 minuti di chiacchierata. Nessuna pressione.
  </p>
  <p style="margin:24px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;">A presto,<br/><strong>${ESC(v.senderName || "Arianna")}</strong><br/><span style="color:#6b6390;font-size:13px;">${ESC(v.senderRole || "Empire AI Group")}</span></p>
</td></tr>
${FOOTER(v)}
`, `Una proposta personalizzata per ${v.businessName}`),
    buildText: (v) => `Ciao ${v.recipientName},

Sono ${v.senderName || "Arianna"}. Mi occupo di trasformazione digitale per attività ${v.sectorLabel || "locali"} in Italia.

Ho dato un'occhiata a ${v.businessName}${v.city ? ` a ${v.city}` : ""} e ho notato che ${v.painPoint || "molte attività come la vostra perdono clienti per piccoli attriti operativi"}.

${v.previewLink ? `Ho preparato una preview personalizzata: ${v.previewLink}\n\n` : ""}Se ha senso, 15 minuti di chiacchierata?

A presto,
${v.senderName || "Arianna"}
${v.senderRole || "Empire AI Group"}`,
  },

  {
    id: "aurora-executive-brief",
    name: "Executive Brief — Aurora",
    description: "Tono diretto e dati alla mano. Per titolari decisi, settori premium (NCC, hospitality, professional).",
    bestFor: ["ncc", "hospitality", "healthcare", "professional"],
    tone: "executive",
    conversionScore: 79,
    estimatedReadTime: "25s",
    recommendedSubjects: [
      "{{businessName}} — analisi rapida",
      "Brief operativo per {{businessName}}",
      "3 punti su {{businessName}}",
    ],
    buildSubject: (v) => `${v.businessName} — analisi rapida`,
    buildHtml: (v) => SHELL(`
${headerWithTarget("titolari")}
<tr><td style="padding:36px 36px 8px 36px;">
  <p style="margin:0 0 6px 0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#7c3aed;font-weight:700;">Brief operativo · ${ESC(v.sectorLabel || "settore")}</p>
  <h1 style="margin:0 0 18px 0;font-size:23px;line-height:1.3;color:#0f0a1f;font-weight:700;">${ESC(v.businessName)}: 3 leve su cui possiamo agire questa settimana.</h1>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">${ESC(v.recipientName)}, ho analizzato la presenza digitale di <strong>${ESC(v.businessName)}</strong>. Qui le tre cose che cambiano davvero il conto economico.</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 18px 0;">
    <tr><td style="padding:14px 16px;background:#faf8ff;border-left:3px solid #7c3aed;border-radius:8px;">
      <p style="margin:0;font-size:14px;line-height:1.55;color:#0f0a1f;"><strong>1. ${ESC(v.painPoint || "Operatività")}</strong> — riducibile del 30-60% in 7 giorni con il nostro stack.</p>
    </td></tr>
    <tr><td style="height:8px;line-height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:14px 16px;background:#faf8ff;border-left:3px solid #22d3ee;border-radius:8px;">
      <p style="margin:0;font-size:14px;line-height:1.55;color:#0f0a1f;"><strong>2. Conversione clienti</strong> — automazione recensioni + reminder = +15% repeat rate medio.</p>
    </td></tr>
    <tr><td style="height:8px;line-height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:14px 16px;background:#faf8ff;border-left:3px solid #a78bfa;border-radius:8px;">
      <p style="margin:0;font-size:14px;line-height:1.55;color:#0f0a1f;"><strong>3. Margine</strong> — eliminando intermediari (OTA, app esterne) si recuperano mediamente 2-4 punti percentuali.</p>
    </td></tr>
  </table>

  ${v.previewLink ? buttonAurora(v.ctaPrimary || "Vedi l'analisi completa", v.previewLink) : ""}

  <p style="margin:18px 0 4px 0;font-size:14px;line-height:1.6;color:#2d2a4a;">Se vuole, in 15 minuti le mostro come si applica al vostro caso.</p>
  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;"><strong>${ESC(v.senderName || "Arianna")}</strong><br/><span style="color:#6b6390;font-size:13px;">${ESC(v.senderRole || "Empire AI Group")}</span></p>
</td></tr>
${FOOTER(v)}
`, `Brief operativo: 3 leve per ${v.businessName}`),
    buildText: (v) => `${v.businessName} — analisi rapida

${v.recipientName}, ho analizzato la presenza digitale di ${v.businessName}. Tre leve concrete:

1. ${v.painPoint || "Operatività"} — riducibile del 30-60% in 7 giorni
2. Conversione clienti — automazione recensioni + reminder = +15% repeat
3. Margine — eliminando intermediari si recuperano 2-4 punti %

${v.previewLink ? `Analisi completa: ${v.previewLink}\n\n` : ""}15 minuti per applicarlo al vostro caso?

${v.senderName || "Arianna"} — ${v.senderRole || "Empire AI Group"}`,
  },

  {
    id: "aurora-case-study",
    name: "Case Study — Aurora",
    description: "Mostra un risultato concreto su un'attività simile. Alta credibilità, perfetto su settori scettici.",
    bestFor: ["food", "beauty", "fitness", "retail", "ncc"],
    tone: "case-study",
    conversionScore: 81,
    estimatedReadTime: "30s",
    recommendedSubjects: [
      "Cosa è successo a un'attività come {{businessName}}",
      "Risultato reale: +28% in 60 giorni",
      "Una storia simile a {{businessName}}",
    ],
    buildSubject: (v) => `Cosa è successo a un'attività come ${v.businessName}`,
    buildHtml: (v) => SHELL(`
${headerWithTarget("case study")}
<tr><td style="padding:36px 36px 8px 36px;">
  <h1 style="margin:0 0 14px 0;font-size:24px;line-height:1.25;color:#0f0a1f;font-weight:700;">+28% di clienti ricorrenti in 60 giorni.</h1>
  <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">${ESC(v.recipientName)}, le scrivo perché un'attività ${ESC(v.sectorLabel || "simile alla vostra")} ha appena ottenuto un risultato che credo le interesserà.</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 18px 0;background:linear-gradient(135deg,#faf8ff 0%,#f0eaff 100%);border-radius:14px;">
    <tr><td style="padding:20px 22px;">
      <p style="margin:0 0 8px 0;font-size:11px;letter-spacing:0.14em;text-transform:uppercase;color:#7c3aed;font-weight:700;">Risultato in 60 giorni</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
        <tr>
          <td style="vertical-align:top;padding-right:8px;"><p style="margin:0;font-size:28px;font-weight:800;color:#0f0a1f;line-height:1;">+28%</p><p style="margin:4px 0 0 0;font-size:12px;color:#6b6390;">clienti ricorrenti</p></td>
          <td style="vertical-align:top;padding:0 8px;"><p style="margin:0;font-size:28px;font-weight:800;color:#0f0a1f;line-height:1;">−42%</p><p style="margin:4px 0 0 0;font-size:12px;color:#6b6390;">no-show</p></td>
          <td style="vertical-align:top;padding-left:8px;"><p style="margin:0;font-size:28px;font-weight:800;color:#0f0a1f;line-height:1;">2h</p><p style="margin:4px 0 0 0;font-size:12px;color:#6b6390;">setup totale</p></td>
        </tr>
      </table>
    </td></tr>
  </table>

  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Stesso settore, stessa città media, stesso problema di partenza: ${ESC(v.painPoint || "operatività manuale che mangia ore")}.</p>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Per <strong>${ESC(v.businessName)}</strong> ho preparato una preview personalizzata su misura, basata sui vostri dati pubblici reali.</p>

  ${v.previewLink ? buttonAurora(v.ctaPrimary || "Apri la preview di " + v.businessName, v.previewLink) : ""}

  <p style="margin:22px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;">Un saluto,<br/><strong>${ESC(v.senderName || "Arianna")}</strong><br/><span style="color:#6b6390;font-size:13px;">${ESC(v.senderRole || "Empire AI Group")}</span></p>
</td></tr>
${FOOTER(v)}
`, `Case study reale per ${v.businessName}`),
    buildText: (v) => `+28% di clienti ricorrenti in 60 giorni

${v.recipientName}, un'attività ${v.sectorLabel || "simile alla vostra"} ha ottenuto:
- +28% clienti ricorrenti
- −42% no-show
- 2 ore di setup totale

Stesso settore, stesso problema di partenza (${v.painPoint || "operatività manuale"}).

${v.previewLink ? `Preview personalizzata per ${v.businessName}: ${v.previewLink}\n\n` : ""}${v.senderName || "Arianna"} — ${v.senderRole || "Empire AI Group"}`,
  },

  {
    id: "aurora-soft-followup",
    name: "Soft Follow-up — Aurora",
    description: "Secondo touch leggero, senza insistere. Riapre la conversazione con valore aggiunto.",
    bestFor: ["food", "beauty", "ncc", "fitness", "retail", "professional"],
    tone: "soft-followup",
    conversionScore: 73,
    estimatedReadTime: "15s",
    recommendedSubjects: [
      "Solo un pensiero su {{businessName}}",
      "Rapida — non urgente",
      "Mi ero ripromessa di ricontattarla",
    ],
    buildSubject: () => `Solo un pensiero veloce`,
    buildHtml: (v) => SHELL(`
${headerWithTarget("follow-up")}
<tr><td style="padding:36px 36px 8px 36px;">
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Ciao ${ESC(v.recipientName)},</p>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">non voglio rubarle tempo. Riapro solo perché ho aggiornato la preview che avevo preparato per <strong>${ESC(v.businessName)}</strong>${v.previewLink ? "" : " e mi piacerebbe mostrargliela"}.</p>
  ${v.previewLink ? `<p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">È qui, due click: ${linkAurora("apri preview", v.previewLink)}.</p>` : ""}
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Se non è il momento giusto nessun problema — basta rispondere "non ora" e non la disturbo più.</p>
  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;">Buona giornata,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>
${FOOTER(v)}
`, `Follow-up leggero per ${v.businessName}`),
    buildText: (v) => `Ciao ${v.recipientName},

non voglio rubarle tempo. Riapro solo perché ho aggiornato la preview per ${v.businessName}.

${v.previewLink ? `Apri qui: ${v.previewLink}\n\n` : ""}Se non è il momento giusto, basta rispondere "non ora".

${v.senderName || "Arianna"}`,
  },

  {
    id: "aurora-value-stack",
    name: "Value Stack — Aurora",
    description: "Mostra il pacchetto completo di valore in modo visivo. Per chi ha bisogno di vedere il \"cosa ottengo\".",
    bestFor: ["beauty", "fitness", "retail", "professional", "hospitality"],
    tone: "value-stack",
    conversionScore: 77,
    estimatedReadTime: "35s",
    recommendedSubjects: [
      "Cosa includiamo per {{businessName}}",
      "Il pacchetto su misura per {{businessName}}",
      "Sintesi visiva — 30 secondi",
    ],
    buildSubject: (v) => `Cosa includiamo per ${v.businessName}`,
    buildHtml: (v) => SHELL(`
${headerWithTarget(v.sectorLabel || "PMI")}
<tr><td style="padding:36px 36px 8px 36px;">
  <h1 style="margin:0 0 14px 0;font-size:23px;line-height:1.3;color:#0f0a1f;font-weight:700;">Tutto quello che ${ESC(v.businessName)} otterrebbe.</h1>
  <p style="margin:0 0 16px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">${ESC(v.recipientName)}, qui c'è la sintesi visiva. Niente fuffa, solo cosa attiviamo.</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 18px 0;">
    <tr><td style="padding:14px 16px;border:1px solid #ece9fb;border-radius:10px;">
      <p style="margin:0 0 4px 0;font-size:14px;font-weight:700;color:#0f0a1f;">🌐 Sito + app brandizzata</p>
      <p style="margin:0;font-size:13px;color:#6b6390;line-height:1.5;">SEO ottimizzato, mobile-first, con prenotazioni e pagamenti.</p>
    </td></tr>
    <tr><td style="height:8px;line-height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:14px 16px;border:1px solid #ece9fb;border-radius:10px;">
      <p style="margin:0 0 4px 0;font-size:14px;font-weight:700;color:#0f0a1f;">🤖 AI agents 24/7</p>
      <p style="margin:0;font-size:13px;color:#6b6390;line-height:1.5;">Risposte clienti, recensioni, marketing automatico.</p>
    </td></tr>
    <tr><td style="height:8px;line-height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:14px 16px;border:1px solid #ece9fb;border-radius:10px;">
      <p style="margin:0 0 4px 0;font-size:14px;font-weight:700;color:#0f0a1f;">📊 Dashboard unica</p>
      <p style="margin:0;font-size:13px;color:#6b6390;line-height:1.5;">Vedete tutto: incassi, prenotazioni, clienti, magazzino.</p>
    </td></tr>
    <tr><td style="height:8px;line-height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:14px 16px;border:1px solid #ece9fb;border-radius:10px;background:linear-gradient(135deg,#faf8ff,#f0eaff);">
      <p style="margin:0 0 4px 0;font-size:14px;font-weight:700;color:#0f0a1f;">⚡ Setup in 24-48 ore</p>
      <p style="margin:0;font-size:13px;color:#6b6390;line-height:1.5;">Senza interrompere l'operatività attuale.</p>
    </td></tr>
  </table>

  ${v.previewLink ? buttonAurora(v.ctaPrimary || "Vedi la preview di " + v.businessName, v.previewLink) : ""}

  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;">A presto,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>
${FOOTER(v)}
`, `Pacchetto completo per ${v.businessName}`),
    buildText: (v) => `Tutto quello che ${v.businessName} otterrebbe:

- Sito + app brandizzata (SEO, mobile, prenotazioni, pagamenti)
- AI agents 24/7 (clienti, recensioni, marketing)
- Dashboard unica (incassi, prenotazioni, clienti)
- Setup in 24-48 ore senza interrompere il lavoro

${v.previewLink ? `Preview: ${v.previewLink}\n\n` : ""}${v.senderName || "Arianna"}`,
  },

  {
    id: "aurora-urgency-soft",
    name: "Urgency Soft — Aurora",
    description: "Crea un motivo di tempistica reale (stagione, finestra, slot limitati) senza pressione fastidiosa.",
    bestFor: ["food", "hospitality", "fitness", "retail"],
    tone: "urgency",
    conversionScore: 75,
    estimatedReadTime: "20s",
    recommendedSubjects: [
      "Finestra giusta per {{businessName}}",
      "Una nota sul timing — {{businessName}}",
      "Solo per questa settimana",
    ],
    buildSubject: (v) => `Finestra giusta per ${v.businessName}`,
    buildHtml: (v) => SHELL(`
${headerWithTarget("limitato")}
<tr><td style="padding:36px 36px 8px 36px;">
  <p style="margin:0 0 14px 0;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#22d3ee;font-weight:700;">⏱ Timing</p>
  <h1 style="margin:0 0 14px 0;font-size:23px;line-height:1.3;color:#0f0a1f;font-weight:700;">${ESC(v.recipientName)}, c'è una finestra giusta per partire ora.</h1>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Per il settore ${ESC(v.sectorLabel || "vostro")} le prossime 4 settimane sono il momento migliore per attivare ${ESC(v.painPoint ? "soluzioni su " + v.painPoint : "le automazioni")}: si entra in stagione con tutto già rodato.</p>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Per <strong>${ESC(v.businessName)}</strong> ho già preparato la preview e tenuto liberi 2 slot questa settimana per una call rapida.</p>
  ${v.previewLink ? buttonAurora(v.ctaPrimary || "Apri la preview", v.previewLink) : ""}
  <p style="margin:18px 0 4px 0;font-size:14px;line-height:1.6;color:#6b6390;">Se preferisci aspettare nessun problema, ti riscrivo a fine mese.</p>
  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;"><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>
${FOOTER(v)}
`, `Timing utile per ${v.businessName}`),
    buildText: (v) => `${v.recipientName}, c'è una finestra giusta per partire ora.

Per il settore ${v.sectorLabel || "vostro"} le prossime 4 settimane sono il momento migliore.

Per ${v.businessName} ho già la preview pronta e 2 slot liberi questa settimana.

${v.previewLink ? `Preview: ${v.previewLink}\n\n` : ""}${v.senderName || "Arianna"}`,
  },

  {
    id: "aurora-consultative",
    name: "Consultative — Aurora",
    description: "Chiede prima, vende dopo. Tono advisor: 2 domande mirate per aprire la conversazione.",
    bestFor: ["healthcare", "professional", "hospitality", "ncc"],
    tone: "consultative",
    conversionScore: 78,
    estimatedReadTime: "25s",
    recommendedSubjects: [
      "Due domande veloci",
      "Una curiosità su {{businessName}}",
      "Mi aiuta a capire meglio?",
    ],
    buildSubject: () => `Due domande veloci`,
    buildHtml: (v) => SHELL(`
${headerWithTarget("consulenza")}
<tr><td style="padding:36px 36px 8px 36px;">
  <h1 style="margin:0 0 14px 0;font-size:23px;line-height:1.3;color:#0f0a1f;font-weight:700;">Ciao ${ESC(v.recipientName)}.</h1>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Prima di proporle qualunque cosa, vorrei capire davvero come lavora <strong>${ESC(v.businessName)}</strong>. Due domande veloci, se ha 30 secondi:</p>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="margin:14px 0 18px 0;">
    <tr><td style="padding:14px 16px;background:#faf8ff;border-radius:10px;">
      <p style="margin:0;font-size:14px;line-height:1.55;color:#0f0a1f;">① Qual è oggi <strong>la cosa più ripetitiva</strong> che lei o il suo team fate ogni giorno?</p>
    </td></tr>
    <tr><td style="height:8px;line-height:8px;">&nbsp;</td></tr>
    <tr><td style="padding:14px 16px;background:#faf8ff;border-radius:10px;">
      <p style="margin:0;font-size:14px;line-height:1.55;color:#0f0a1f;">② Se avesse una bacchetta magica, <strong>cosa cambierebbe</strong> della parte digitale (sito, prenotazioni, clienti, marketing)?</p>
    </td></tr>
  </table>

  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Mi rispondi anche solo con due righe e ti mando un'analisi gratuita su misura. Nessuna call obbligatoria.</p>
  ${v.previewLink ? `<p style="margin:0 0 14px 0;font-size:14px;line-height:1.6;color:#2d2a4a;">Nel frattempo qui c'è una preview iniziale: ${linkAurora("dai un'occhiata", v.previewLink)}.</p>` : ""}
  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;">Grazie,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>
${FOOTER(v)}
`, `Due domande per ${v.businessName}`),
    buildText: (v) => `Ciao ${v.recipientName},

Prima di proporre qualcosa, due domande:

1. Qual è la cosa più ripetitiva che fate ogni giorno?
2. Se avesse una bacchetta magica, cosa cambierebbe della parte digitale?

Anche solo due righe — ti mando un'analisi gratuita.

${v.previewLink ? `Preview iniziale: ${v.previewLink}\n\n` : ""}${v.senderName || "Arianna"}`,
  },

  {
    id: "aurora-playful-creative",
    name: "Playful Creative — Aurora",
    description: "Tono amichevole e moderno per attività creative (beauty, fitness, food trendy, retail concept).",
    bestFor: ["beauty", "fitness", "food", "retail"],
    tone: "playful",
    conversionScore: 76,
    estimatedReadTime: "20s",
    recommendedSubjects: [
      "Ehi {{recipientName}} 👋",
      "Una piccola idea per {{businessName}}",
      "Cosa ne pensi?",
    ],
    buildSubject: (v) => `Ehi ${v.recipientName} 👋`,
    buildHtml: (v) => SHELL(`
${headerWithTarget("creator")}
<tr><td style="padding:36px 36px 8px 36px;">
  <h1 style="margin:0 0 14px 0;font-size:24px;line-height:1.25;color:#0f0a1f;font-weight:700;">Ehi ${ESC(v.recipientName)} 👋</h1>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Sono caduta su <strong>${ESC(v.businessName)}</strong>${v.city ? ` (${ESC(v.city)})` : ""} e mi è venuta una piccola idea.</p>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">${ESC(v.painPoint || "Spesso le attività con un'identità forte come la vostra perdono vendite per il digitale fatto a metà — sito basic, prenotazioni macchinose, niente CRM.")} Mi spiace perché ${ESC(v.businessName)} merita di più.</p>
  <p style="margin:0 0 14px 0;font-size:15px;line-height:1.65;color:#2d2a4a;">Ho buttato giù una mini-preview con il vostro stile. Niente impegno, solo per farti vedere come potrebbe essere:</p>
  ${v.previewLink ? buttonAurora(v.ctaPrimary || "Sbircia la preview ✨", v.previewLink) : ""}
  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#2d2a4a;">Se ti piace, ne parliamo. Se no, mi dici cosa cambieresti — ci sto.</p>
  <p style="margin:18px 0 4px 0;font-size:15px;line-height:1.6;color:#0f0a1f;">Un abbraccio,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>
${FOOTER(v)}
`, `Una mini-preview per ${v.businessName} ✨`),
    buildText: (v) => `Ehi ${v.recipientName} 👋

Sono caduta su ${v.businessName}${v.city ? ` (${v.city})` : ""} e mi è venuta una piccola idea.

${v.painPoint || "Spesso le attività con identità forte perdono vendite per il digitale fatto a metà."}

Ho buttato giù una mini-preview con il vostro stile.

${v.previewLink ? `Sbirciala qui: ${v.previewLink}\n\n` : ""}${v.senderName || "Arianna"}`,
  },
];

/* ────────────────────────────────────────────────────────────────────────── */
/*  Lookup helpers                                                            */
/* ────────────────────────────────────────────────────────────────────────── */

export const TEMPLATE_BY_ID = Object.fromEntries(TEMPLATES.map((t) => [t.id, t])) as Record<string, EmailTemplate>;

export function getTemplate(id: string): EmailTemplate | undefined {
  return TEMPLATE_BY_ID[id];
}

export function listTemplatesForSector(sector?: string): EmailTemplate[] {
  if (!sector) return TEMPLATES;
  return TEMPLATES.filter((t) => t.bestFor.includes(sector));
}

export function pickRecommendedAuroraTemplate(input: {
  sector?: string | null;
  googleRating?: number | null;
  score?: number | null;
}): { id: string; reason: string } {
  const sector = (input.sector || "").toLowerCase();
  const rating = input.googleRating ?? 0;
  const score = input.score ?? 0;

  if (score >= 80 || rating >= 4.5) {
    return { id: "aurora-demo-invite", reason: "Lead premium o molto caldo: meglio mostrare subito la demo pronta." };
  }

  if (["beauty", "fitness"].includes(sector)) {
    return { id: "aurora-playful-creative", reason: `Settore ${sector}: tono creativo e visivo.` };
  }

  if (["food", "retail", "hospitality", "hotel"].includes(sector)) {
    return { id: "aurora-case-study", reason: `Settore ${sector}: prova sociale e caso studio convertono meglio.` };
  }

  if (["healthcare", "ncc", "legal", "accounting", "professional"].includes(sector)) {
    return { id: "aurora-executive-brief", reason: `Settore ${sector}: tono consulenziale più autorevole.` };
  }

  return { id: "aurora-cold-personal", reason: "Primo contatto personalizzato: approccio diretto ma umano." };
}

export function renderTemplate(id: string, vars: TemplateVariables): { subject: string; html: string; text: string } | null {
  const t = getTemplate(id);
  if (!t) return null;
  return {
    subject: t.buildSubject(vars),
    html: t.buildHtml(vars),
    text: t.buildText(vars),
  };
}
