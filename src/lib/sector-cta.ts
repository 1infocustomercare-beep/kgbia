// sector-cta.ts — mappa il settore di un lead all'azione CTA principale della preview.
// Usato dal WhatsApp A/B dialog per generare un link cliccabile diretto alla
// sezione di conversione (prenotazione / ordine / preventivo) della demo.
//
// Restituisce:
//  - anchor: id della sezione HTML nella preview pubblica (#prenota, #menu, ecc.)
//  - label:  testo del CTA da mostrare nel messaggio WhatsApp
//  - verb:   verbo d'azione (es. "Prenota", "Ordina") per messaggi storytelling

export interface SectorCTA {
  anchor: string;
  label: string;
  verb: string;
  emoji: string;
}

const DEFAULT_CTA: SectorCTA = {
  anchor: "contact",
  label: "Vedi la demo e contattaci",
  verb: "Scopri",
  emoji: "👉",
};

const MAP: Record<string, SectorCTA> = {
  // Food / ristorazione
  food:        { anchor: "reservation", label: "Prenota un tavolo dalla demo",  verb: "Prenota",  emoji: "🍽️" },
  ristorante:  { anchor: "reservation", label: "Prenota un tavolo dalla demo",  verb: "Prenota",  emoji: "🍽️" },
  pizzeria:    { anchor: "menu",        label: "Ordina dal menu della demo",    verb: "Ordina",   emoji: "🍕" },
  sushi:       { anchor: "menu",        label: "Ordina dal menu della demo",    verb: "Ordina",   emoji: "🍣" },
  bakery:      { anchor: "menu",        label: "Sfoglia il menu nella demo",    verb: "Sfoglia",  emoji: "🥐" },
  bar:         { anchor: "menu",        label: "Sfoglia il menu nella demo",    verb: "Sfoglia",  emoji: "☕" },

  // Beauty / wellness
  beauty:      { anchor: "prenota",     label: "Prenota un appuntamento",       verb: "Prenota",  emoji: "💅" },
  parrucchiere:{ anchor: "prenota",     label: "Prenota un appuntamento",       verb: "Prenota",  emoji: "💇" },
  estetica:    { anchor: "prenota",     label: "Prenota un trattamento",        verb: "Prenota",  emoji: "✨" },
  spa:         { anchor: "prenota",     label: "Prenota un trattamento",        verb: "Prenota",  emoji: "🧖" },

  // Fitness
  fitness:     { anchor: "prenota",     label: "Prova una lezione gratis",      verb: "Prenota",  emoji: "💪" },
  palestra:    { anchor: "prenota",     label: "Prova una lezione gratis",      verb: "Prenota",  emoji: "💪" },
  yoga:        { anchor: "prenota",     label: "Prenota una lezione",           verb: "Prenota",  emoji: "🧘" },

  // Healthcare
  healthcare:  { anchor: "prenota",     label: "Prenota una visita",            verb: "Prenota",  emoji: "🩺" },
  dentista:    { anchor: "prenota",     label: "Prenota una visita",            verb: "Prenota",  emoji: "🦷" },
  studio:      { anchor: "prenota",     label: "Prenota un appuntamento",       verb: "Prenota",  emoji: "🩺" },

  // Hotel / hospitality
  hotel:       { anchor: "prenota",     label: "Prenota una camera",            verb: "Prenota",  emoji: "🛏️" },
  bnb:         { anchor: "prenota",     label: "Verifica disponibilità",        verb: "Prenota",  emoji: "🏨" },

  // Beach / lidi
  beach:       { anchor: "prenota",     label: "Prenota l'ombrellone",          verb: "Prenota",  emoji: "🏖️" },
  lido:        { anchor: "prenota",     label: "Prenota l'ombrellone",          verb: "Prenota",  emoji: "🏖️" },

  // Retail
  retail:      { anchor: "collezioni",  label: "Sfoglia la collezione",         verb: "Scopri",   emoji: "🛍️" },
  negozio:     { anchor: "collezioni",  label: "Sfoglia la collezione",         verb: "Scopri",   emoji: "🛍️" },
  boutique:    { anchor: "collezioni",  label: "Sfoglia la collezione",         verb: "Scopri",   emoji: "👗" },

  // Luxury / yacht
  luxury:      { anchor: "contact",     label: "Richiedi un preventivo riservato", verb: "Richiedi", emoji: "💎" },
  yacht:       { anchor: "contact",     label: "Richiedi un preventivo riservato", verb: "Richiedi", emoji: "🛥️" },

  // NCC / trasporti
  ncc:         { anchor: "prenota",     label: "Prenota una corsa",             verb: "Prenota",  emoji: "🚘" },
  taxi:        { anchor: "prenota",     label: "Prenota una corsa",             verb: "Prenota",  emoji: "🚖" },
  trasporti:   { anchor: "prenota",     label: "Richiedi un preventivo",        verb: "Richiedi", emoji: "🚐" },

  // Trades / artigiani
  trades:      { anchor: "preventivo",  label: "Richiedi un preventivo",        verb: "Richiedi", emoji: "🛠️" },
  edile:       { anchor: "preventivo",  label: "Richiedi un preventivo",        verb: "Richiedi", emoji: "🏗️" },
  idraulico:   { anchor: "preventivo",  label: "Richiedi un intervento",        verb: "Richiedi", emoji: "🔧" },
  elettricista:{ anchor: "preventivo",  label: "Richiedi un intervento",        verb: "Richiedi", emoji: "💡" },
};

/**
 * Risolve la CTA principale per un settore. Match case-insensitive su
 * tutte le chiavi (anche substring) — fallback "Scopri la demo".
 */
export function getSectorCTA(sector?: string | null): SectorCTA {
  if (!sector) return DEFAULT_CTA;
  const key = sector.toLowerCase().trim();
  if (MAP[key]) return MAP[key];
  // substring match (es. "ristorante pizzeria napoletana" → pizzeria)
  for (const k of Object.keys(MAP)) {
    if (key.includes(k)) return MAP[k];
  }
  return DEFAULT_CTA;
}

/**
 * Costruisce l'URL completo verso la sezione CTA della preview.
 * Aggiunge un parametro ?cta=... per evidenziare la sezione lato preview se serve.
 */
export function buildCTADemoUrl(baseDemoUrl: string, sector?: string | null): string {
  const cta = getSectorCTA(sector);
  if (!baseDemoUrl) return baseDemoUrl;
  // Rimuovi eventuali frammenti pre-esistenti
  const [pathPart, queryFragment = ""] = baseDemoUrl.split("?");
  const [queryOnly] = queryFragment.split("#");
  const params = new URLSearchParams(queryOnly || "");
  params.set("cta", cta.anchor);
  const query = params.toString();
  return `${pathPart}${query ? `?${query}` : ""}#${cta.anchor}`;
}
