/**
 * Empire — CORE per l'espansione della matrice mockup.
 * DSL compatta per dichiarare identità visive uniche (20+ per settore)
 * senza duplicare mai famiglia, materia, luce, fondale, staging o motivo.
 */
import type { MockupIdentity, ScreenSpec, SectorKey, SurfaceSignature } from "./mockup-identity-matrix";

/** Presets di schermate funzionali riusabili (la varianza è nel DNA visivo, non nella funzione). */
export const SCREEN_PRESETS: Record<string, { purpose: string; elements: string[] }> = {
  home: { purpose: "Vetrina principale con proposta di valore e azione primaria", elements: ["header brand", "hero visuale", "3 highlight", "CTA primaria"] },
  catalog: { purpose: "Catalogo/listino navigabile per categorie", elements: ["chip categorie", "griglia card", "prezzi", "filtro rapido"] },
  detail: { purpose: "Scheda dettaglio con informazioni complete", elements: ["media full-bleed", "descrizione", "specifiche", "CTA sticky"] },
  booking: { purpose: "Prenotazione con data, orario e conferma", elements: ["date strip", "griglia orari", "riepilogo", "CTA conferma"] },
  order: { purpose: "Carrello/ordine con totale e checkout", elements: ["righe ordine", "stepper quantità", "totale", "CTA paga"] },
  tracking: { purpose: "Stato in tempo reale dell'attività in corso", elements: ["timeline stati", "mappa o progress", "ETA", "contatto rapido"] },
  wallet: { purpose: "Abbonamento, crediti e pagamenti ricorrenti", elements: ["saldo/crediti", "piano attivo", "storico movimenti", "CTA rinnovo"] },
  loyalty: { purpose: "Programma fedeltà con premi e livelli", elements: ["progress punti", "livello", "griglia premi", "codice cliente"] },
  profile: { purpose: "Profilo cliente con storico e preferenze", elements: ["avatar", "dati principali", "storico", "preferenze"] },
  chat: { purpose: "Assistente IA / messaggistica con il cliente", elements: ["bolle conversazione", "quick reply", "input", "badge IA"] },
  schedule: { purpose: "Calendario o palinsesto delle attività", elements: ["settimana scrollabile", "slot", "posti residui", "CTA iscrizione"] },
  team: { purpose: "Team, staff o professionisti selezionabili", elements: ["card persone", "specializzazione", "rating", "CTA scegli"] },
  docs: { purpose: "Documenti, contratti e pratiche", elements: ["lista file", "stato firma", "scadenze", "upload"] },
  report: { purpose: "Report e metriche per il cliente", elements: ["KPI grandi", "grafico", "confronto periodo", "export"] },
  map: { purpose: "Mappa con punti, mezzi o disponibilità", elements: ["mappa", "pin", "card flottante", "filtro raggio"] },
  gallery: { purpose: "Galleria lavori/portfolio con prima-dopo", elements: ["griglia immagini", "slider prima-dopo", "tag", "CTA preventivo"] },
  review: { purpose: "Recensioni e reputazione", elements: ["media stelle", "recensioni", "risposta titolare", "CTA lascia recensione"] },
  quote: { purpose: "Richiesta preventivo guidata", elements: ["step indicator", "campi selezione", "stima prezzo", "CTA invia"] },
  admin: { purpose: "Dashboard gestionale desktop dell'attività", elements: ["sidebar sezioni", "KPI riga", "tabella operativa", "grafico andamento"] },
  crm: { purpose: "CRM desktop con pipeline e clienti", elements: ["sidebar", "pipeline colonne", "scheda cliente", "attività"] },
  ops: { purpose: "Console operativa desktop in tempo reale", elements: ["sidebar", "monitor live", "coda attività", "alert"] },
};

export type ExpansionRow = {
  identity: MockupIdentity;
  surface: SurfaceSignature;
};

/**
 * @param screens formato: "key|Titolo|scopo|el·el·el" — prefisso "D:" per desktop
 * @param surf    formato: "materia|luce|fondale|staging|motivo"
 */
export function X(
  sector: SectorKey,
  id: string,
  family: string,
  label: string,
  brand: string,
  tagline: string,
  /** "bg,surface,text,muted,accent,accent2" */
  palette: string,
  /** "display|body|trattamento" */
  typography: string,
  /** "radius|border|grid|density" */
  geometry: string,
  /** "nav|light|signature" */
  chrome: string,
  photography: string,
  composition: string,
  surf: string,
  screens: string[],
): ExpansionRow {
  const [bg, surface, text, muted, accent, accent2] = palette.split(",").map((s) => s.trim());
  const [display, body, treatment] = typography.split("|").map((s) => s.trim());
  const [radius, border, grid, density] = geometry.split("|").map((s) => s.trim());
  const [nav, statusBar, signature] = chrome.split("|").map((s) => s.trim());
  const [material, light, backdrop, staging, motif] = surf.split("|").map((s) => s.trim());

  const parsed: ScreenSpec[] = screens.map((raw) => {
    const isDesktop = raw.startsWith("D:");
    const bodyRaw = isDesktop ? raw.slice(2) : raw;
    if (!bodyRaw.includes("|")) {
      // formato compatto "preset:Titolo"
      const idx = bodyRaw.indexOf(":");
      const pk = bodyRaw.slice(0, idx).trim();
      const title = bodyRaw.slice(idx + 1).trim();
      const preset = SCREEN_PRESETS[pk];
      if (!preset) throw new Error(`Preset schermata sconosciuto: ${pk}`);
      return { key: pk, title, purpose: preset.purpose, elements: preset.elements, surface: isDesktop ? "desktop" : "mobile" } as ScreenSpec;
    }
    const [key, title, purpose, els] = bodyRaw.split("|").map((s) => s.trim());
    return {
      key,
      title,
      purpose,
      elements: els.split("·").map((s) => s.trim()),
      surface: isDesktop ? "desktop" : "mobile",
    };
  });

  return {
    identity: {
      id, sector, family: family as MockupIdentity["family"], label, brand, tagline,
      palette: { bg, surface, text, muted, accent, accent2 },
      typography: { display, body, treatment },
      geometry: { radius, border, grid, density: density as MockupIdentity["geometry"]["density"] },
      chrome: { nav, statusBar: statusBar as "light" | "dark", signature },
      photography, composition,
      screens: parsed,
    },
    surface: { material, light, backdrop, staging, motif },
  };
}
