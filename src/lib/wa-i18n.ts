// wa-i18n.ts — gestione lingua per i messaggi WhatsApp di outreach.
// Auto-detect: lead.language (se presente) → city → browser → fallback IT.
// Fornisce template tradotti per i due varianti A/B + label CTA settoriali.

import type { SectorCTA } from "@/lib/sector-cta";

export type WALang = "it" | "en" | "es" | "fr" | "de";

export const WA_LANGS: { code: WALang; label: string; flag: string }[] = [
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "en", label: "English",  flag: "🇬🇧" },
  { code: "es", label: "Español",  flag: "🇪🇸" },
  { code: "fr", label: "Français", flag: "🇫🇷" },
  { code: "de", label: "Deutsch",  flag: "🇩🇪" },
];

/* ───────── Auto-detect ───────── */

const CITY_LANG_HINTS: Record<string, WALang> = {
  // EN
  london: "en", manchester: "en", dublin: "en", "new york": "en", miami: "en", "los angeles": "en",
  // ES
  madrid: "es", barcelona: "es", valencia: "es", sevilla: "es", "ciudad de méxico": "es", buenos: "es",
  // FR
  paris: "fr", lyon: "fr", marseille: "fr", nice: "fr", bordeaux: "fr",
  // DE
  berlin: "de", münchen: "de", munich: "de", hamburg: "de", wien: "de", vienna: "de", zürich: "de",
};

/** Normalizza un valore arbitrario (it_IT, IT, italian, italiano) → WALang. */
function normalizeLang(raw?: string | null): WALang | null {
  if (!raw) return null;
  const v = raw.toLowerCase().trim().replace(/[_-].*/, "");
  if (v.startsWith("it") || v.includes("italian")) return "it";
  if (v.startsWith("en") || v.includes("english")) return "en";
  if (v.startsWith("es") || v.includes("span")) return "es";
  if (v.startsWith("fr") || v.includes("french") || v.includes("franc")) return "fr";
  if (v.startsWith("de") || v.includes("german") || v.includes("deutsch")) return "de";
  return null;
}

export interface DetectInput {
  preferredLang?: string | null;
  city?: string | null;
}

export interface DetectResult {
  lang: WALang;
  source: "lead" | "city" | "browser" | "fallback";
}

export function detectWALang(input: DetectInput): DetectResult {
  // 1. preferenza esplicita del lead
  const fromLead = normalizeLang(input.preferredLang);
  if (fromLead) return { lang: fromLead, source: "lead" };

  // 2. città → euristica
  if (input.city) {
    const c = input.city.toLowerCase();
    for (const [hint, lang] of Object.entries(CITY_LANG_HINTS)) {
      if (c.includes(hint)) return { lang, source: "city" };
    }
  }

  // 3. browser
  if (typeof navigator !== "undefined") {
    const browser = normalizeLang(navigator.language);
    if (browser) return { lang: browser, source: "browser" };
  }

  // 4. fallback
  return { lang: "it", source: "fallback" };
}

/* ───────── CTA tradotto ───────── */

/**
 * Le label CTA settoriali sono in italiano (vedi sector-cta.ts).
 * Qui forniamo una traduzione fluida usando il "verb" inglese-style come pivot.
 * Per semplicità mappiamo i verbi più comuni; se non match, manteniamo IT.
 */
const VERB_TRANSLATIONS: Record<string, Record<WALang, string>> = {
  prenota: { it: "Prenota",   en: "Book",     es: "Reserva",  fr: "Réserve",  de: "Buche" },
  ordina:  { it: "Ordina",    en: "Order",    es: "Pide",     fr: "Commande", de: "Bestelle" },
  sfoglia: { it: "Sfoglia",   en: "Browse",   es: "Explora",  fr: "Parcours", de: "Stöbere" },
  scopri:  { it: "Scopri",    en: "Discover", es: "Descubre", fr: "Découvre", de: "Entdecke" },
  richiedi:{ it: "Richiedi",  en: "Request",  es: "Solicita", fr: "Demande",  de: "Anfordere" },
};

const CTA_OBJECTS: Record<string, Record<WALang, string>> = {
  reservation: { it: "un tavolo dalla demo", en: "a table from the demo",  es: "una mesa desde la demo", fr: "une table depuis la démo", de: "einen Tisch aus der Demo" },
  menu:        { it: "dal menu della demo",  en: "from the demo menu",     es: "del menú de la demo",    fr: "depuis le menu de la démo", de: "aus dem Demo-Menü" },
  prenota:     { it: "un appuntamento",      en: "an appointment",         es: "una cita",               fr: "un rendez-vous",            de: "einen Termin" },
  collezioni:  { it: "la collezione",        en: "the collection",         es: "la colección",           fr: "la collection",             de: "die Kollektion" },
  preventivo:  { it: "un preventivo",        en: "a quote",                es: "un presupuesto",         fr: "un devis",                  de: "ein Angebot" },
  contact:     { it: "un contatto",          en: "to get in touch",        es: "un contacto",            fr: "un contact",                de: "Kontakt" },
};

export function localizeCTA(cta: SectorCTA, lang: WALang): { label: string; verb: string } {
  const verbKey = cta.verb.toLowerCase();
  const verb = VERB_TRANSLATIONS[verbKey]?.[lang] ?? cta.verb;
  const obj = CTA_OBJECTS[cta.anchor]?.[lang];
  // Se non abbiamo una traduzione strutturata, fallback alla label originale (IT)
  const label = obj ? `${verb} ${obj}` : (lang === "it" ? cta.label : `${verb} →`);
  return { label, verb };
}

/* ───────── Tono del messaggio ───────── */

export type WATone = "premium" | "direct" | "friendly";

export const WA_TONES: { code: WATone; label: string; emoji: string; description: string }[] = [
  { code: "premium",  label: "Premium",   emoji: "💎", description: "Elegante, esclusivo, su misura" },
  { code: "direct",   label: "Diretto",   emoji: "🎯", description: "Chiaro, conciso, action-first" },
  { code: "friendly", label: "Amichevole", emoji: "😊", description: "Caldo, informale, vicino" },
];

export const TONE_UI_LABELS: Record<WALang, { title: string; hint: string }> = {
  it: { title: "Tono del messaggio", hint: "Cambia stile e rigenera entrambe le varianti" },
  en: { title: "Message tone",       hint: "Switch style and regenerate both variants" },
  es: { title: "Tono del mensaje",   hint: "Cambia el estilo y regenera ambas variantes" },
  fr: { title: "Ton du message",     hint: "Changez de style et régénérez les deux variantes" },
  de: { title: "Tonfall der Nachricht", hint: "Stil wechseln und beide Varianten neu generieren" },
};

/* ───────── Template messaggi A/B per lingua + tono ───────── */

interface TemplateInput {
  name: string;
  sector: string;
  ctaUrl: string;
  ctaLabel: string;
  emoji: string;
}

type Builder = (i: TemplateInput) => string;

/* Tabella template: per ciascuna variante (A/B), tono e lingua. */
type ToneTemplates = Record<WATone, Record<WALang, Builder>>;

const TEMPLATES_A: ToneTemplates = {
  /* === A · DIRECT === concise, action-first */
  direct: {
    it: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Ciao ${name} 👋`, ``,
      `Sono di Empire AI Group. Vi ho preparato una preview personalizzata di come potrebbe diventare ${sector}.`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `2 minuti per dare un'occhiata?`,
    ].join("\n"),
    en: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hi ${name} 👋`, ``,
      `I'm with Empire AI Group. I built you a personalized preview of how ${sector} could look.`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Got 2 minutes to take a look?`,
    ].join("\n"),
    es: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hola ${name} 👋`, ``,
      `Soy de Empire AI Group. Te he preparado una vista previa personalizada de cómo podría verse ${sector}.`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `¿Tienes 2 minutos para echar un vistazo?`,
    ].join("\n"),
    fr: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Bonjour ${name} 👋`, ``,
      `Je travaille chez Empire AI Group. J'ai préparé un aperçu personnalisé de ce à quoi ${sector} pourrait ressembler.`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Avez-vous 2 minutes pour y jeter un œil ?`,
    ].join("\n"),
    de: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hallo ${name} 👋`, ``,
      `Ich bin von Empire AI Group. Ich habe eine personalisierte Vorschau erstellt, wie ${sector} aussehen könnte.`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Hast du 2 Minuten Zeit, einen Blick darauf zu werfen?`,
    ].join("\n"),
  },
  /* === A · PREMIUM === elegante, esclusivo */
  premium: {
    it: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Gentile ${name},`, ``,
      `Mi presento: sono di Empire AI Group. Abbiamo dedicato del tempo a immaginare ${sector} in una versione su misura, pensata nei dettagli.`,
      ``, `${emoji} ${ctaLabel} — accesso riservato:`, `${ctaUrl}`,
      ``, `Sarebbe possibile dedicarle 2 minuti per condividere insieme l'anteprima?`,
    ].join("\n"),
    en: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Dear ${name},`, ``,
      `I'm reaching out from Empire AI Group. We've crafted a tailored vision of how ${sector} could elevate, designed with care for every detail.`,
      ``, `${emoji} ${ctaLabel} — private access:`, `${ctaUrl}`,
      ``, `Would you be able to spare 2 minutes to walk through it together?`,
    ].join("\n"),
    es: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Estimado/a ${name},`, ``,
      `Me presento: soy de Empire AI Group. Hemos imaginado ${sector} en una versión a medida, cuidada en cada detalle.`,
      ``, `${emoji} ${ctaLabel} — acceso reservado:`, `${ctaUrl}`,
      ``, `¿Podría dedicarme 2 minutos para revisarla juntos?`,
    ].join("\n"),
    fr: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Cher/Chère ${name},`, ``,
      `Je me permets de vous écrire de la part d'Empire AI Group. Nous avons imaginé ${sector} dans une version sur mesure, soignée dans chaque détail.`,
      ``, `${emoji} ${ctaLabel} — accès privé :`, `${ctaUrl}`,
      ``, `Auriez-vous 2 minutes à m'accorder pour la découvrir ensemble ?`,
    ].join("\n"),
    de: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Sehr geehrte/r ${name},`, ``,
      `Ich melde mich von Empire AI Group. Wir haben ${sector} in einer maßgeschneiderten Version entworfen — mit Liebe zum Detail.`,
      ``, `${emoji} ${ctaLabel} — exklusiver Zugang:`, `${ctaUrl}`,
      ``, `Hätten Sie 2 Minuten, um die Vorschau gemeinsam anzusehen?`,
    ].join("\n"),
  },
  /* === A · FRIENDLY === caldo, informale */
  friendly: {
    it: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Ehi ${name}! 👋`, ``,
      `Sono di Empire AI Group e mi sono divertito a immaginare ${sector} in versione "smart". Ti ho preparato un'anteprima tutta tua 🎁`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Dimmi se ti piace, basta un occhio veloce 😊`,
    ].join("\n"),
    en: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hey ${name}! 👋`, ``,
      `I'm from Empire AI Group and I had fun imagining ${sector} in a smarter version. Made you a little preview 🎁`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Tell me what you think — quick peek is enough 😊`,
    ].join("\n"),
    es: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `¡Hey ${name}! 👋`, ``,
      `Soy de Empire AI Group y me he divertido imaginando ${sector} en versión "smart". Te he preparado una vista previa solo para ti 🎁`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Dime qué te parece, basta un vistazo 😊`,
    ].join("\n"),
    fr: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hé ${name} ! 👋`, ``,
      `Je suis d'Empire AI Group et je me suis amusé à imaginer ${sector} en mode "smart". Petit aperçu rien que pour toi 🎁`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Dis-moi ce que tu en penses, un coup d'œil suffit 😊`,
    ].join("\n"),
    de: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hey ${name}! 👋`, ``,
      `Ich bin von Empire AI Group und hatte Spaß daran, ${sector} in einer "smarten" Version zu entwerfen. Kleine Vorschau nur für dich 🎁`,
      ``, `${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Sag mir, was du denkst — ein kurzer Blick reicht 😊`,
    ].join("\n"),
  },
};

const TEMPLATES_B: ToneTemplates = {
  /* === B · DIRECT === storytelling conciso */
  direct: {
    it: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Ciao ${name},`, ``,
      `Ho visto ${sector} e mi è venuta un'idea: con un sistema di prenotazioni + CRM + AI potreste recuperare ore di lavoro a settimana.`,
      ``, `Ho preparato una demo su misura — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Quando hai 2 minuti per vederla insieme?`,
    ].join("\n"),
    en: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hi ${name},`, ``,
      `I checked out ${sector} and had an idea: with a bookings + CRM + AI system you could save hours every week.`,
      ``, `I built you a custom demo — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `When do you have 2 minutes to walk through it together?`,
    ].join("\n"),
    es: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hola ${name},`, ``,
      `Vi ${sector} y se me ocurrió una idea: con un sistema de reservas + CRM + IA podrías ahorrar horas a la semana.`,
      ``, `Te he preparado una demo a medida — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `¿Cuándo tienes 2 minutos para verla juntos?`,
    ].join("\n"),
    fr: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Bonjour ${name},`, ``,
      `J'ai vu ${sector} et j'ai eu une idée : avec un système de réservations + CRM + IA, vous pourriez gagner des heures chaque semaine.`,
      ``, `J'ai préparé une démo sur mesure — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Quand avez-vous 2 minutes pour la voir ensemble ?`,
    ].join("\n"),
    de: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hallo ${name},`, ``,
      `Ich habe ${sector} gesehen und hatte eine Idee: mit einem Buchungs- + CRM- + KI-System könntet ihr jede Woche Stunden sparen.`,
      ``, `Ich habe eine maßgeschneiderte Demo vorbereitet — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Wann hast du 2 Minuten, um sie zusammen anzusehen?`,
    ].join("\n"),
  },
  /* === B · PREMIUM === narrazione raffinata */
  premium: {
    it: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Gentile ${name},`, ``,
      `Osservando ${sector} mi è apparsa chiara una possibilità: un'esperienza digitale all'altezza del vostro standard, con prenotazioni, CRM e intelligenza artificiale orchestrati con discrezione.`,
      ``, `Le ho riservato un'anteprima curata — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Quando preferirebbe condividerla insieme, anche solo per qualche minuto?`,
    ].join("\n"),
    en: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Dear ${name},`, ``,
      `Looking at ${sector}, one possibility stood out: a digital experience worthy of your standard — bookings, CRM and AI orchestrated with discretion.`,
      ``, `I've reserved a curated preview for you — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `When would you prefer to review it together, even briefly?`,
    ].join("\n"),
    es: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Estimado/a ${name},`, ``,
      `Observando ${sector} se me hizo evidente una posibilidad: una experiencia digital a la altura de su estándar — reservas, CRM e IA orquestadas con discreción.`,
      ``, `Le he reservado una vista previa cuidada — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `¿Cuándo preferiría revisarla juntos, aunque sean unos minutos?`,
    ].join("\n"),
    fr: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Cher/Chère ${name},`, ``,
      `En regardant ${sector}, une évidence est apparue : une expérience digitale à la hauteur de votre standard — réservations, CRM et IA orchestrés avec discrétion.`,
      ``, `Je vous ai réservé un aperçu soigné — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Quand préféreriez-vous le découvrir ensemble, même brièvement ?`,
    ].join("\n"),
    de: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Sehr geehrte/r ${name},`, ``,
      `Beim Blick auf ${sector} wurde eine Möglichkeit klar: ein digitales Erlebnis auf Ihrem Niveau — Buchungen, CRM und KI mit Diskretion orchestriert.`,
      ``, `Ich habe eine kuratierte Vorschau für Sie reserviert — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Wann würden Sie sie gerne gemeinsam ansehen, auch nur kurz?`,
    ].join("\n"),
  },
  /* === B · FRIENDLY === storytelling caldo */
  friendly: {
    it: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Ciao ${name}!`, ``,
      `Stavo guardando ${sector} e mi è venuto in mente: con prenotazioni + CRM + AI ti tolgo un mucchio di rotture dalle giornate 😅`,
      ``, `Ti ho buttato giù una demo veloce — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Quando hai 2 minuti la vediamo insieme? Prometto: niente noia 🚀`,
    ].join("\n"),
    en: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hey ${name}!`, ``,
      `I was looking at ${sector} and thought: with bookings + CRM + AI I could save you a ton of daily hassle 😅`,
      ``, `Threw together a quick demo for you — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `When you have 2 mins, let's check it together? Promise it's not boring 🚀`,
    ].join("\n"),
    es: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `¡Hola ${name}!`, ``,
      `Estaba mirando ${sector} y pensé: con reservas + CRM + IA te quito un montón de rollos del día 😅`,
      ``, `Te he montado una demo rápida — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `¿Cuándo tienes 2 minutos para verla juntos? Prometo que no aburre 🚀`,
    ].join("\n"),
    fr: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Salut ${name} !`, ``,
      `Je regardais ${sector} et je me suis dit : avec réservations + CRM + IA je te retire pas mal de galères du quotidien 😅`,
      ``, `Je t'ai bricolé une petite démo — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Quand tu as 2 min, on la regarde ensemble ? Promis, c'est pas chiant 🚀`,
    ].join("\n"),
    de: ({ name, sector, ctaUrl, ctaLabel, emoji }) => [
      `Hey ${name}!`, ``,
      `Ich hab' mir ${sector} angeschaut und gedacht: mit Buchungen + CRM + KI nehme ich dir jede Menge Alltagsstress ab 😅`,
      ``, `Hab' dir eine kleine Demo gebastelt — ${emoji} ${ctaLabel}:`, `${ctaUrl}`,
      ``, `Wenn du 2 Min hast, schauen wir's zusammen? Versprochen: nicht langweilig 🚀`,
    ].join("\n"),
  },
};

const SECTOR_FALLBACK: Record<WALang, string> = {
  it: "la tua attività",
  en: "your business",
  es: "tu negocio",
  fr: "votre activité",
  de: "dein Unternehmen",
};

export function buildTemplateA(
  lang: WALang,
  i: Omit<TemplateInput, "sector"> & { sector?: string | null },
  tone: WATone = "direct",
): string {
  return TEMPLATES_A[tone][lang]({ ...i, sector: i.sector || SECTOR_FALLBACK[lang] });
}
export function buildTemplateB(
  lang: WALang,
  i: Omit<TemplateInput, "sector"> & { sector?: string | null },
  tone: WATone = "direct",
): string {
  return TEMPLATES_B[tone][lang]({ ...i, sector: i.sector || SECTOR_FALLBACK[lang] });
}

/* Etichette UI tradotte minime — per il banner detect */
export const UI_LABELS: Record<WALang, { detected: string; from: Record<DetectResult["source"], string> }> = {
  it: { detected: "Lingua rilevata",  from: { lead: "preferenza lead", city: "città", browser: "browser", fallback: "default" } },
  en: { detected: "Detected language", from: { lead: "lead preference", city: "city", browser: "browser", fallback: "default" } },
  es: { detected: "Idioma detectado",  from: { lead: "preferencia del lead", city: "ciudad", browser: "navegador", fallback: "predeterminado" } },
  fr: { detected: "Langue détectée",   from: { lead: "préférence du lead", city: "ville", browser: "navigateur", fallback: "par défaut" } },
  de: { detected: "Erkannte Sprache",  from: { lead: "Lead-Präferenz", city: "Stadt", browser: "Browser", fallback: "Standard" } },
};
