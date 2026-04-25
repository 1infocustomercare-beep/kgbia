// ──────────────────────────────────────────────────────────────────────────────
// CATALOG REFERENCE MAP — i 42 mockup di public/mockup-references/ servono come
// "ground truth" visivo: l'AI riceve l'immagine come reference image-to-image
// e la replica fedelmente cambiando solo brand/contenuti/palette del lead.
// Hostato come asset pubblico statico, accessibile via HTTPS dal gateway AI.
//
// Usato da: lead-mockup-suite, custom-preview-generator
// ──────────────────────────────────────────────────────────────────────────────
export const PUBLIC_BASE_URL = "https://empireia.lovable.app";

export const CATALOG_REFERENCES: Record<string, Partial<Record<string, string>>> = {
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

export function resolveCatalogKey(sector: string | null | undefined): string | null {
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

export function findCatalogReference(sector: string | null | undefined, screenType: string): string | null {
  const key = resolveCatalogKey(sector);
  if (!key) return null;
  const sectorRefs = CATALOG_REFERENCES[key];
  if (!sectorRefs) return null;
  const exact = sectorRefs[screenType];
  if (exact) return `${PUBLIC_BASE_URL}/mockup-references/${exact}`;
  const home = sectorRefs.home;
  return home ? `${PUBLIC_BASE_URL}/mockup-references/${home}` : null;
}

/** Suggerisce le 2 schermate più rappresentative per un settore (home + secondary).
 * Usato da custom-preview-generator per generare 2 mockup iPhone in cima alla landing.
 */
export function suggestScreensForSector(sector: string | null | undefined): Array<{ type: string; title: string }> {
  const key = resolveCatalogKey(sector);
  const refs = key ? CATALOG_REFERENCES[key] : null;
  if (!refs) {
    return [
      { type: "home",     title: "Home App" },
      { type: "services", title: "Servizi" },
    ];
  }
  const screens: Array<{ type: string; title: string }> = [];
  if (refs.home) screens.push({ type: "home", title: "Home App" });
  // Secondary screen — preferisci booking → services → gallery → portfolio → catalog
  const secondaryOrder = ["booking", "services", "gallery", "portfolio", "catalog", "listing", "map"];
  for (const t of secondaryOrder) {
    if (refs[t]) {
      const titleMap: Record<string, string> = {
        booking: "Prenotazione",
        services: "Servizi",
        gallery: "Galleria",
        portfolio: "Portfolio",
        catalog: "Catalogo",
        listing: "Elenco",
        map: "Mappa",
      };
      screens.push({ type: t, title: titleMap[t] || t });
      break;
    }
  }
  if (screens.length < 2) {
    screens.push({ type: "services", title: "Servizi" });
  }
  return screens.slice(0, 2);
}
