/**
 * Renderer Aurora templates + deliverability scoring per Deno Edge Functions.
 * Replica un sottoinsieme leggero della libreria client `src/lib/email-templates/*`
 * così l'orchestrator può costruire HTML inline-style senza dipendere dal bundle React.
 */

export type TemplateVars = {
  recipientName: string;
  businessName: string;
  city?: string;
  sectorLabel?: string;
  painPoint?: string;
  previewLink?: string;
  callBookingLink?: string;
  senderName?: string;
  senderRole?: string;
  ctaPrimary?: string;
};

export type TemplateMeta = {
  id: string;
  name: string;
  bestFor: string[];
  tone: string;
  conversionScore: number;
  description: string;
};

const ESC = (s?: string | null): string =>
  String(s ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const SHELL = (inner: string, preview: string) => `<!DOCTYPE html><html lang="it"><head>
<meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
<title>${ESC(preview)}</title></head>
<body style="margin:0;padding:0;background:#f5f3ff;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#0f0a1f;">
<div style="display:none;max-height:0;overflow:hidden;font-size:1px;line-height:1px;color:#f5f3ff;">${ESC(preview)}</div>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background:#f5f3ff;padding:24px 0;">
<tr><td align="center"><table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;background:#ffffff;border-radius:18px;overflow:hidden;box-shadow:0 12px 40px rgba(15,10,31,0.12);">
${inner}
</table></td></tr></table></body></html>`;

const HEADER = (gradient: string) => `<tr><td style="background:${gradient};padding:18px 28px;">
<table role="presentation" width="100%"><tr>
<td style="font-family:-apple-system,BlinkMacSystemFont,sans-serif;color:#fff;font-weight:700;font-size:14px;letter-spacing:0.5px;">EMPIRE · AI GROUP</td>
<td align="right" style="font-family:-apple-system,sans-serif;color:rgba(255,255,255,0.85);font-size:11px;text-transform:uppercase;letter-spacing:1.2px;">Outreach personalizzato</td>
</tr></table></td></tr>`;

const BUTTON = (label: string, href: string) => `
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:8px 0 18px 0;">
<tr><td bgcolor="#7c3aed" style="border-radius:10px;background:linear-gradient(135deg,#7c3aed 0%,#22d3ee 100%);">
<a href="${ESC(href)}" target="_blank" style="display:inline-block;padding:13px 26px;font-family:-apple-system,sans-serif;font-size:14px;color:#fff;text-decoration:none;font-weight:700;letter-spacing:0.3px;">${ESC(label)}</a>
</td></tr></table>`;

const FOOTER = (v: TemplateVars) => `<tr><td style="padding:20px 28px;background:#f9f7ff;border-top:1px solid #ece7ff;">
<p style="margin:0;font-family:-apple-system,sans-serif;font-size:11px;color:#6c63a8;line-height:1.5;">${ESC(v.senderName || "Arianna")} · ${ESC(v.senderRole || "Empire AI Group")}<br/>
Se non vuoi più sentire da noi rispondi con <strong>STOP</strong> e cancelliamo subito il tuo recapito.</p>
</td></tr>`;

type Builder = {
  meta: TemplateMeta;
  subject: (v: TemplateVars) => string;
  html: (v: TemplateVars) => string;
  text: (v: TemplateVars) => string;
};

const TEMPLATES: Builder[] = [
  // 1 — Cold Personal
  {
    meta: { id: "aurora-cold-personal", name: "Cold Personal", bestFor: ["food","beauty","retail","fitness"], tone: "warm", conversionScore: 78, description: "Primo contatto caldo, personale, no hard-sell." },
    subject: (v) => `Una nota su ${v.businessName}`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#0f0a1f 0%,#1e1b4b 50%,#7c3aed 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:22px;color:#0f0a1f;font-weight:700;line-height:1.3;">Ciao ${ESC(v.recipientName)}, scusa il disturbo</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Sono caduta su <strong>${ESC(v.businessName)}</strong>${v.city ? ` (${ESC(v.city)})` : ""} e ho notato che ${ESC(v.painPoint || "il vostro digitale potrebbe lavorare molto di più per voi")}.</p>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Ho preparato una mini-preview personalizzata per farvi vedere cosa intendo. Niente impegno, solo per capire se ha senso parlarne 15 minuti.</p>
${v.previewLink ? BUTTON(v.ctaPrimary || "Vedi la preview", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">Un saluto,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>${FOOTER(v)}`,
      `Ho preparato qualcosa per ${v.businessName}`,
    ),
    text: (v) => `Ciao ${v.recipientName},\n\nSono caduta su ${v.businessName}${v.city ? ` (${v.city})` : ""} e ho notato che ${v.painPoint || "il vostro digitale potrebbe lavorare di più"}.\n\nHo preparato una mini-preview personalizzata.${v.previewLink ? `\n\nVedila qui: ${v.previewLink}` : ""}\n\n${v.senderName || "Arianna"}`,
  },
  // 2 — Executive Brief
  {
    meta: { id: "aurora-executive-brief", name: "Executive Brief", bestFor: ["healthcare","ncc","professional","hospitality"], tone: "executive", conversionScore: 81, description: "Tono consulenziale per decision-maker." },
    subject: (v) => `${v.businessName} · proposta operativa 15min`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#0f0a1f 0%,#312e81 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<p style="margin:0 0 6px 0;font-size:11px;color:#6d28d9;text-transform:uppercase;letter-spacing:1.5px;font-weight:700;">Brief operativo</p>
<h1 style="margin:0 0 14px 0;font-size:21px;color:#0f0a1f;font-weight:700;line-height:1.35;">Una proposta concreta per ${ESC(v.businessName)}</h1>
<p style="margin:0 0 12px 0;font-size:14.5px;color:#2d2a4a;line-height:1.65;">Buongiorno ${ESC(v.recipientName)},</p>
<p style="margin:0 0 12px 0;font-size:14.5px;color:#2d2a4a;line-height:1.65;">Dopo aver analizzato la presenza digitale di ${ESC(v.businessName)}${v.city ? ` su ${ESC(v.city)}` : ""}, ho identificato 3 leve operative che possono incidere subito su acquisizione e ricavi:</p>
<ol style="margin:0 0 16px 18px;padding:0;font-size:14px;color:#2d2a4a;line-height:1.7;">
<li>${ESC(v.painPoint || "Conversione bassa dei contatti web")}</li>
<li>Automazioni di follow-up oggi assenti</li>
<li>CRM unificato + reportistica decision-grade</li>
</ol>
${v.previewLink ? BUTTON(v.ctaPrimary || "Vedi la simulazione", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">Cordialmente,<br/><strong>${ESC(v.senderName || "Arianna")}</strong> · ${ESC(v.senderRole || "Empire AI Group")}</p>
</td></tr>${FOOTER(v)}`,
      `Brief operativo per ${v.businessName}`,
    ),
    text: (v) => `Buongiorno ${v.recipientName},\n\nDopo aver analizzato ${v.businessName}, ho identificato 3 leve operative:\n1) ${v.painPoint || "Conversione bassa"}\n2) Automazioni di follow-up assenti\n3) CRM unificato\n\n${v.previewLink ? `Simulazione: ${v.previewLink}\n\n` : ""}${v.senderName || "Arianna"} · ${v.senderRole || "Empire AI Group"}`,
  },
  // 3 — Case Study
  {
    meta: { id: "aurora-case-study", name: "Case Study", bestFor: ["food","fitness","beauty","retail"], tone: "case-study", conversionScore: 83, description: "Prova sociale + risultato di altro cliente simile." },
    subject: (v) => `Come una ${v.sectorLabel || "attività"} simile a ${v.businessName} ha fatto +30%`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#1e1b4b 0%,#7c3aed 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:22px;color:#0f0a1f;font-weight:700;line-height:1.3;">Ciao ${ESC(v.recipientName)} 👋</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Volevo condividerti una storia. Una ${ESC(v.sectorLabel || "attività")} simile a <strong>${ESC(v.businessName)}</strong> ha aumentato del 30% le prenotazioni in 60 giorni con il sistema che usiamo in Empire.</p>
<table role="presentation" width="100%" style="margin:0 0 16px 0;background:#f5f3ff;border-radius:12px;border-left:4px solid #7c3aed;"><tr><td style="padding:14px 16px;">
<p style="margin:0;font-size:14px;color:#312e81;line-height:1.55;font-style:italic;">"In 8 settimane abbiamo recuperato i clienti che avevamo perso. Il sito nuovo + il CRM hanno cambiato tutto."</p>
</td></tr></table>
<p style="margin:0 0 14px 0;font-size:14.5px;color:#2d2a4a;line-height:1.65;">Ho preparato una preview con la stessa logica per ${ESC(v.businessName)}:</p>
${v.previewLink ? BUTTON(v.ctaPrimary || "Vedi la tua preview", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">A presto,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>${FOOTER(v)}`,
      `Una storia simile alla tua`,
    ),
    text: (v) => `Ciao ${v.recipientName},\n\nUna ${v.sectorLabel || "attività"} simile a ${v.businessName} ha fatto +30% prenotazioni in 60gg.\n\nHo preparato una preview con la stessa logica.${v.previewLink ? `\n\n${v.previewLink}` : ""}\n\n${v.senderName || "Arianna"}`,
  },
  // 4 — Demo Invite
  {
    meta: { id: "aurora-demo-invite", name: "Demo Invite", bestFor: ["food","beauty","ncc","fitness","hospitality","healthcare","retail"], tone: "consultative", conversionScore: 79, description: "Invito diretto a vedere demo già pronta." },
    subject: (v) => `Demo personalizzata pronta per ${v.businessName}`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#0f0a1f 0%,#22d3ee 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:22px;color:#0f0a1f;font-weight:700;line-height:1.3;">${ESC(v.recipientName)}, è pronta</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Ho passato l'ultima ora a costruire una demo specifica per <strong>${ESC(v.businessName)}</strong>. Logo, colori, sezioni su misura — pensata sul vostro contesto reale.</p>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Dacci un'occhiata, è gratis e ci mette 90 secondi:</p>
${v.previewLink ? BUTTON(v.ctaPrimary || "Apri la demo personalizzata", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#2d2a4a;">Se ha senso, prendiamoci 15 minuti per parlarne. Se no, mi dici cosa cambieresti.</p>
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">${ESC(v.senderName || "Arianna")}</p>
</td></tr>${FOOTER(v)}`,
      `Demo pronta per ${v.businessName}`,
    ),
    text: (v) => `${v.recipientName},\n\nHo costruito una demo specifica per ${v.businessName}. Logo, colori, sezioni su misura.${v.previewLink ? `\n\n${v.previewLink}` : ""}\n\nSe ha senso prendiamoci 15min.\n\n${v.senderName || "Arianna"}`,
  },
  // 5 — Soft Follow-up
  {
    meta: { id: "aurora-soft-followup", name: "Soft Follow-up", bestFor: ["food","beauty","retail","fitness","ncc","hospitality"], tone: "soft-followup", conversionScore: 71, description: "Touch leggero dopo silenzio." },
    subject: (v) => `Ti ho disturbato? — ${v.businessName}`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#1e1b4b 0%,#312e81 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:21px;color:#0f0a1f;font-weight:700;line-height:1.3;">Ehi ${ESC(v.recipientName)} 👋</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Ti avevo scritto per ${ESC(v.businessName)} e non ho ricevuto risposta — capisco benissimo, le giornate sono piene.</p>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Volevo solo lasciarti il link alla preview personalizzata, nel caso ti torni utile più avanti:</p>
${v.previewLink ? BUTTON(v.ctaPrimary || "Apri quando vuoi", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#2d2a4a;">Se non è il momento, nessun problema. Se invece vuoi parlarne, basta una riga.</p>
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">Buon lavoro,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>${FOOTER(v)}`,
      `Lascio qui per ${v.businessName}`,
    ),
    text: (v) => `Ehi ${v.recipientName},\n\nTi avevo scritto per ${v.businessName} e capisco le giornate piene.\n\nLascio qui la preview${v.previewLink ? `: ${v.previewLink}` : ""}.\n\n${v.senderName || "Arianna"}`,
  },
  // 6 — Value Stack
  {
    meta: { id: "aurora-value-stack", name: "Value Stack", bestFor: ["food","retail","fitness","beauty","hospitality"], tone: "value-stack", conversionScore: 80, description: "Mostra concretamente cosa include la proposta." },
    subject: (v) => `${v.businessName}: 3 cose che faremmo subito`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#7c3aed 0%,#22d3ee 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:22px;color:#0f0a1f;font-weight:700;line-height:1.3;">${ESC(v.recipientName)}, ecco cosa faremmo</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Per <strong>${ESC(v.businessName)}</strong> partiremmo da 3 cose concrete:</p>
<table role="presentation" width="100%" style="margin:0 0 16px 0;border-collapse:separate;border-spacing:0 6px;">
<tr><td style="background:#f5f3ff;border-radius:10px;padding:12px 14px;font-size:13.5px;color:#312e81;line-height:1.5;"><strong>1.</strong> Sito + prenotazioni online attive in 14 giorni</td></tr>
<tr><td style="background:#f5f3ff;border-radius:10px;padding:12px 14px;font-size:13.5px;color:#312e81;line-height:1.5;"><strong>2.</strong> CRM con messaggi automatici post-visita</td></tr>
<tr><td style="background:#f5f3ff;border-radius:10px;padding:12px 14px;font-size:13.5px;color:#312e81;line-height:1.5;"><strong>3.</strong> Dashboard mensile su clienti e ricavi</td></tr>
</table>
${v.previewLink ? BUTTON(v.ctaPrimary || "Vedi la simulazione", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">${ESC(v.senderName || "Arianna")}</p>
</td></tr>${FOOTER(v)}`,
      `3 cose concrete per ${v.businessName}`,
    ),
    text: (v) => `${v.recipientName},\n\nPer ${v.businessName} faremmo 3 cose concrete:\n1) Sito + prenotazioni in 14gg\n2) CRM con messaggi automatici\n3) Dashboard ricavi\n${v.previewLink ? `\n${v.previewLink}\n` : ""}\n${v.senderName || "Arianna"}`,
  },
  // 7 — Urgency Smart
  {
    meta: { id: "aurora-urgency-smart", name: "Urgency Smart", bestFor: ["food","retail","beauty"], tone: "urgency", conversionScore: 74, description: "Urgenza intelligente — opportunità stagionale, non sconto." },
    subject: (v) => `Una finestra utile per ${v.businessName}`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#0f0a1f 0%,#7c3aed 50%,#22d3ee 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:22px;color:#0f0a1f;font-weight:700;line-height:1.3;">${ESC(v.recipientName)}, una breve finestra</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Stiamo aprendo questo mese un piccolo gruppo di attività ${ESC(v.sectorLabel || "")}${v.city ? ` su ${ESC(v.city)}` : ""} con cui partire insieme nel ciclo di automazione.</p>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Volevo proporti ${ESC(v.businessName)} prima di chiudere i posti. Ecco la preview che ho preparato:</p>
${v.previewLink ? BUTTON(v.ctaPrimary || "Apri la preview", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#2d2a4a;">Se ha senso, parliamone questa settimana.</p>
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">${ESC(v.senderName || "Arianna")}</p>
</td></tr>${FOOTER(v)}`,
      `Una finestra utile per ${v.businessName}`,
    ),
    text: (v) => `${v.recipientName},\n\nStiamo aprendo un piccolo gruppo per attività ${v.sectorLabel || ""} questo mese.\n\nVolevo proporti ${v.businessName} prima di chiudere.${v.previewLink ? `\n\n${v.previewLink}` : ""}\n\n${v.senderName || "Arianna"}`,
  },
  // 8 — Playful Creative
  {
    meta: { id: "aurora-playful-creative", name: "Playful Creative", bestFor: ["beauty","fitness","food","retail"], tone: "playful", conversionScore: 76, description: "Tono amichevole per brand creativi." },
    subject: (v) => `Ehi ${v.recipientName} 👋`,
    html: (v) => SHELL(
      `${HEADER("linear-gradient(135deg,#7c3aed 0%,#a855f7 100%)")}
<tr><td style="padding:32px 28px 8px 28px;">
<h1 style="margin:0 0 14px 0;font-size:23px;color:#0f0a1f;font-weight:700;line-height:1.3;">Ehi ${ESC(v.recipientName)} 👋</h1>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Sono caduta su <strong>${ESC(v.businessName)}</strong>${v.city ? ` (${ESC(v.city)})` : ""} e mi è venuta una piccola idea.</p>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">${ESC(v.painPoint || "Spesso le attività con identità forte come la vostra perdono vendite per il digitale fatto a metà.")}</p>
<p style="margin:0 0 14px 0;font-size:15px;color:#2d2a4a;line-height:1.65;">Ho buttato giù una mini-preview con il vostro stile. Niente impegno:</p>
${v.previewLink ? BUTTON(v.ctaPrimary || "Sbircia la preview ✨", v.previewLink) : ""}
<p style="margin:14px 0 4px 0;font-size:14px;color:#0f0a1f;">Un abbraccio,<br/><strong>${ESC(v.senderName || "Arianna")}</strong></p>
</td></tr>${FOOTER(v)}`,
      `Una mini-preview per ${v.businessName} ✨`,
    ),
    text: (v) => `Ehi ${v.recipientName} 👋\n\nSono caduta su ${v.businessName}${v.city ? ` (${v.city})` : ""} e mi è venuta una piccola idea.\n\n${v.painPoint || "Il digitale fatto a metà perde vendite."}\n${v.previewLink ? `\n${v.previewLink}\n` : ""}\n${v.senderName || "Arianna"}`,
  },
];

const REGISTRY: Record<string, Builder> = Object.fromEntries(TEMPLATES.map((t) => [t.meta.id, t]));

export function listAuroraTemplates(): TemplateMeta[] {
  return TEMPLATES.map((t) => t.meta);
}

export function pickAuroraTemplateForLead(lead: { sector?: string; google_rating?: number | null; ai_score?: number | null }): { id: string; reason: string } {
  const sector = (lead.sector || "").toLowerCase();
  const score = lead.ai_score ?? 0;
  const rating = lead.google_rating ?? 0;

  // Hot lead → demo invite (più diretto)
  if (score >= 80) return { id: "aurora-demo-invite", reason: "Lead caldo (score ≥80): vai diretto alla demo." };
  // Warm con buona reputazione → executive brief
  if (score >= 60 && rating >= 4) return { id: "aurora-executive-brief", reason: "Lead qualificato con reputazione solida: tono consulenziale." };
  // Settori creativi → playful
  if (["beauty","fitness"].includes(sector)) return { id: "aurora-playful-creative", reason: `Settore ${sector}: tono creativo e amichevole.` };
  // Food/retail/hospitality → case study (prova sociale forte)
  if (["food","retail","hospitality"].includes(sector)) return { id: "aurora-case-study", reason: `Settore ${sector}: la prova sociale converte di più.` };
  // Healthcare/professional/ncc → executive brief
  if (["healthcare","professional","ncc"].includes(sector)) return { id: "aurora-executive-brief", reason: `Settore ${sector}: il decision-maker vuole brief operativi.` };
  // Default cold → cold personal
  return { id: "aurora-cold-personal", reason: "Primo contatto a freddo: tono personale e umano." };
}

export function renderAuroraTemplate(id: string, vars: TemplateVars): { subject: string; html: string; text: string; meta: TemplateMeta } | null {
  const t = REGISTRY[id] || REGISTRY["aurora-cold-personal"];
  if (!t) return null;
  return { subject: t.subject(vars), html: t.html(vars), text: t.text(vars), meta: t.meta };
}

/* ─── Deliverability scoring lite (mirror della libreria client) ─── */

const SPAM_WORDS = [
  "gratis","100%","garantito","guadagna","rimborso","offerta limitata",
  "click qui","cliccare qui","compra ora","vinci","prezzo speciale",
  "occasione unica","soldi facili","senza rischio","promozione esclusiva",
  "atto urgente","non perdere","ultima possibilità","investi subito",
  "free","buy now","click here","limited time","act now","earn money",
  "guarantee","no risk","winner","cash bonus","miracle","discount",
];

export type DeliverabilityWarning = {
  level: "critical"|"warning"|"info";
  code: string;
  message: string;
};

export function scoreDeliverability(input: { subject: string; body: string }): { score: number; rating: "excellent"|"good"|"fair"|"poor"; warnings: DeliverabilityWarning[] } {
  const subject = (input.subject||"").trim();
  const body = (input.body||"").replace(/<[^>]*>/g, " ").trim();
  const lcS = subject.toLowerCase(), lcB = body.toLowerCase();
  const w: DeliverabilityWarning[] = [];
  let score = 100;

  if (!subject) { w.push({ level: "critical", code: "subject_empty", message: "Soggetto vuoto" }); score -= 30; }
  else if (subject.length < 12) { w.push({ level: "warning", code: "subject_short", message: "Soggetto troppo corto" }); score -= 8; }
  else if (subject.length > 70) { w.push({ level: "warning", code: "subject_long", message: "Soggetto troppo lungo" }); score -= 6; }

  const upper = subject.replace(/[^A-Z]/g, "").length;
  const letters = subject.replace(/[^A-Za-zÀ-ÿ]/g, "").length;
  if (letters > 0 && upper/letters > 0.5) { w.push({ level: "critical", code: "subject_caps", message: "Troppe MAIUSCOLE nel soggetto" }); score -= 15; }
  if (/!{2,}|\?{2,}/.test(subject)) { w.push({ level: "warning", code: "subject_punct", message: "Punteggiatura aggressiva" }); score -= 6; }

  const hits = SPAM_WORDS.filter((s) => lcS.includes(s) || lcB.includes(s));
  if (hits.length) { w.push({ level: hits.length >= 3 ? "critical" : "warning", code: "spam_words", message: `Parole spam: ${hits.slice(0,4).join(", ")}` }); score -= Math.min(25, hits.length*5); }

  if (body.length < 80) { w.push({ level: "warning", code: "body_short", message: "Corpo troppo corto" }); score -= 6; }
  if (body.length > 1500) { w.push({ level: "info", code: "body_long", message: "Email molto lunga" }); score -= 3; }

  const linkCount = (body.match(/https?:\/\/[^\s"<]+/g) || []).length;
  if (linkCount > 4) { w.push({ level: "warning", code: "too_many_links", message: `Troppi link (${linkCount})` }); score -= 8; }
  if (/\{\{[a-zA-Z_]+\}\}/.test(subject + body)) { w.push({ level: "critical", code: "unfilled_tokens", message: "Placeholder non sostituiti" }); score -= 20; }

  score = Math.max(0, Math.min(100, score));
  const rating = score >= 85 ? "excellent" : score >= 70 ? "good" : score >= 50 ? "fair" : "poor";
  return { score, rating, warnings: w };
}
