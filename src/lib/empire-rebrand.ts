/**
 * Empire Rebrand Map — neutral, proprietary brand names that replace the
 * third-party showcase brands previously referenced in the catalog. All names
 * here are invented for Empire and are not affiliated with any real business.
 *
 * Used by build-time/runtime rebrand helpers and as a single source of truth
 * for label normalization across catalog, portfolio and landing surfaces.
 */

export interface EmpireBrandEntry {
  /** Canonical neutral brand label shown to users. */
  name: string;
  /** Slug-safe identifier. */
  slug: string;
  /** Short marketing one-liner used in cards/portfolios. */
  tagline: string;
}

/**
 * Map of legacy label → proprietary Empire brand. Keys are exact strings used
 * historically in catalog data; values are the new neutral identities.
 */
export const EMPIRE_BRAND_MAP: Record<string, EmpireBrandEntry> = {
  // ── Food & Ristorazione ─────────────────────────────────────────
  "Onyx Brace Steakhouse":                 { name: "Onyx Brace Steakhouse", slug: "onyx-brace", tagline: "Steakhouse premium con menu digitale e ordine al tavolo." },
  "Sakura Atelier":            { name: "Sakura Atelier",         slug: "sakura-atelier", tagline: "Omakase moderno con prenotazione chef e sake pairing." },
  "Sakura Atelier":                  { name: "Sakura Atelier",         slug: "sakura-atelier", tagline: "Omakase moderno con prenotazione chef e sake pairing." },
  "Indocina Noir":         { name: "Indocina Noir",          slug: "indocina-noir", tagline: "Cucina d'autore con sala notturna e cocktail signature." },
  "Indocina Noir":  { name: "Indocina Noir",          slug: "indocina-noir", tagline: "Cucina d'autore con sala notturna e cocktail signature." },
  "Indocina Noir":                    { name: "Indocina Noir",          slug: "indocina-noir", tagline: "Cucina d'autore con sala notturna e cocktail signature." },
  "Pacifico Ceviche":    { name: "Pacifico Ceviche",       slug: "pacifico-ceviche", tagline: "Pesce crudo caraibico, ordine in spiaggia e delivery rapido." },
  "Pacifico Ceviche":           { name: "Pacifico Ceviche",       slug: "pacifico-ceviche", tagline: "Pesce crudo caraibico, ordine in spiaggia e delivery rapido." },
  "Pacifico Ceviche":             { name: "Pacifico Ceviche",       slug: "pacifico-ceviche", tagline: "Pesce crudo caraibico, ordine in spiaggia e delivery rapido." },
  "Pacifico Ceviche":                      { name: "Pacifico Ceviche",       slug: "pacifico-ceviche", tagline: "Pesce crudo caraibico, ordine in spiaggia e delivery rapido." },
  "Levante Deli":             { name: "Levante Deli",           slug: "levante-deli", tagline: "Deli urbano: bowl, pita e ordini express in 5 minuti." },
  "Brace Kebab":                { name: "Brace Kebab",            slug: "brace-kebab", tagline: "Grill mediorientale moderno con combo e tracking consegna." },

  // ── NCC / Charter / Hospitality nautica ─────────────────────────
  "Cala Vento Charter":                                        { name: "Cala Vento Charter",  slug: "cala-vento-charter", tagline: "Charter di lusso con escursioni e prenotazione cabine." },
  "Cala Vento Charter":                { name: "Cala Vento Charter",  slug: "cala-vento-charter", tagline: "Charter di lusso con escursioni e prenotazione cabine." },
  "Marina Riviera":                                     { name: "Marina Riviera",      slug: "marina-riviera", tagline: "Noleggio yacht: flotta filtrabile e booking giornaliero." },
  "Onda Sport Club":                                      { name: "Onda Sport Club",     slug: "onda-sport-club", tagline: "Watersports e attività in mare con istruttori certificati." },

  // ── Beauty ──────────────────────────────────────────────────────
  "Aurora Nail Atelier":         { name: "Aurora Nail Atelier",    slug: "aurora-nail-atelier", tagline: "Salone unghie premium con prenotazione e gallery look." },
  "Velluto Hair Lab":      { name: "Velluto Hair Lab",       slug: "velluto-hair-lab", tagline: "Hair lab con e-shop fragranze e booking trattamenti." },

  // ── Fitness & Sport ─────────────────────────────────────────────
  "Centro Padel Brera":          { name: "Centro Padel Brera",     slug: "centro-padel-brera", tagline: "Prenotazione campi padel, maestri e tornei interni." },

  // ── Healthcare / Pet / Childcare / Trades ───────────────────────
  "Lumen Clinic":      { name: "Lumen Clinic",           slug: "lumen-clinic", tagline: "Cliniche specialistiche con prenotazione e cartella digitale." },
  "Tropico Pet Resort":          { name: "Tropico Pet Resort",     slug: "tropico-pet-resort", tagline: "Pet hotel & day care con booking room e servizi extra." },
  "Stelle Nursery":     { name: "Stelle Nursery",         slug: "stelle-nursery", tagline: "Asilo nido con programmi, team tour e iscrizione online." },
  "Arcobaleno Playhouse":         { name: "Arcobaleno Playhouse",   slug: "arcobaleno-playhouse", tagline: "Centro gioco per bambini con corsi e calendario eventi." },
  "Idro Pronto":       { name: "Idro Pronto",            slug: "idro-pronto", tagline: "Pronto intervento idraulico e climatizzazione con tracking." },
  "Idro Pronto":            { name: "Idro Pronto",            slug: "idro-pronto", tagline: "Pronto intervento idraulico e climatizzazione con tracking." },

  // ── Real Estate / Hospitality / Other ───────────────────────────
  "Domus Living":           { name: "Domus Living",           slug: "domus-living", tagline: "Hub residenziale: dashboard inquilini, manutenzioni e community." },

  // ── Style nicknames carried over from the legacy data ──────────
  // (kept for completeness; safe-default neutral fallback.)
  "Empire Studio":                  { name: "Empire Studio",          slug: "empire-studio", tagline: "Empire Studio." },
  "Empire Studio":           { name: "Empire Studio",          slug: "empire-studio", tagline: "Empire Studio." },
};

/**
 * Returns the neutral Empire label for a legacy brand string, or the input
 * unchanged when it's not a known competitor reference.
 */
export function rebrand(label: string): string {
  return EMPIRE_BRAND_MAP[label]?.name ?? label;
}

/**
 * Full Empire entry for a legacy brand string, or a safe default.
 */
export function rebrandEntry(label: string): EmpireBrandEntry {
  return (
    EMPIRE_BRAND_MAP[label] ?? {
      name: label,
      slug: label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
      tagline: "",
    }
  );
}
