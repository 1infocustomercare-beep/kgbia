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

/* ───────── Template messaggi A/B per lingua ───────── */

interface TemplateInput {
  name: string;
  sector: string;
  ctaUrl: string;
  ctaLabel: string;
  emoji: string;
}

type Builder = (i: TemplateInput) => string;

const TEMPLATES_A: Record<WALang, Builder> = {
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
};

const TEMPLATES_B: Record<WALang, Builder> = {
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
};

const SECTOR_FALLBACK: Record<WALang, string> = {
  it: "la tua attività",
  en: "your business",
  es: "tu negocio",
  fr: "votre activité",
  de: "dein Unternehmen",
};

export function buildTemplateA(lang: WALang, i: Omit<TemplateInput, "sector"> & { sector?: string | null }): string {
  return TEMPLATES_A[lang]({ ...i, sector: i.sector || SECTOR_FALLBACK[lang] });
}
export function buildTemplateB(lang: WALang, i: Omit<TemplateInput, "sector"> & { sector?: string | null }): string {
  return TEMPLATES_B[lang]({ ...i, sector: i.sector || SECTOR_FALLBACK[lang] });
}

/* Etichette UI tradotte minime — per il banner detect */
export const UI_LABELS: Record<WALang, { detected: string; from: Record<DetectResult["source"], string> }> = {
  it: { detected: "Lingua rilevata",  from: { lead: "preferenza lead", city: "città", browser: "browser", fallback: "default" } },
  en: { detected: "Detected language", from: { lead: "lead preference", city: "city", browser: "browser", fallback: "default" } },
  es: { detected: "Idioma detectado",  from: { lead: "preferencia del lead", city: "ciudad", browser: "navegador", fallback: "predeterminado" } },
  fr: { detected: "Langue détectée",   from: { lead: "préférence du lead", city: "ville", browser: "navigateur", fallback: "par défaut" } },
  de: { detected: "Erkannte Sprache",  from: { lead: "Lead-Präferenz", city: "Stadt", browser: "Browser", fallback: "Standard" } },
};
