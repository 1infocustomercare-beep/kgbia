/**
 * Dati legali e di contatto dell'agenzia — SINGLE SOURCE OF TRUTH.
 *
 * Obblighi normativi coperti:
 *  - art. 2250 c.c. + D.lgs. 70/2003 (informazioni obbligatorie sul sito)
 *  - Codice del Consumo (prezzi IVA, diritto di recesso consumatori)
 *  - GDPR / Reg. UE 2016/679 (titolare del trattamento, contatti)
 *  - AI Act (Reg. UE 2024/1689) art. 50 — trasparenza sui sistemi AI
 *
 * ⚠️ Compila i campi contrassegnati `null`: finché restano vuoti NON vengono
 * mostrati (meglio omettere un dato che pubblicarne uno errato).
 */
export const LEGAL = {
  /** Nome commerciale usato nel sito. */
  brandName: "Empire AI Group",
  /** Ragione sociale registrata — es. "Empire AI Group S.r.l.". */
  legalName: null as string | null,
  /** Sede legale completa — es. "Via Roma 1, 00100 Roma (RM), Italia". */
  address: null as string | null,
  /** Partita IVA — es. "IT01234567890". */
  vatNumber: null as string | null,
  /** Numero REA / Registro Imprese. */
  rea: null as string | null,
  /** Capitale sociale, se società di capitali. */
  shareCapital: null as string | null,
  /** Email di contatto operativa. */
  email: "info@empireaigroup.com",
  /** PEC. */
  pec: null as string | null,
  /**
   * Numero WhatsApp in formato internazionale senza "+" (es. "393331234567").
   * Finché è `null`, i pulsanti WhatsApp NON vengono mostrati e i lead vengono
   * salvati esclusivamente in database (nessun contatto perso).
   */
  whatsapp: null as string | null,
  /** Sito canonico usato per canonical/og:url. */
  siteUrl: "https://empireia.lovable.app",
} as const;

/** Nota IVA/recesso da mostrare sotto i prezzi. */
export const PRICING_LEGAL_NOTE_IT =
  "Prezzi in euro, IVA 22% esclusa. Fatturazione elettronica. Per i consumatori si applica il diritto di recesso di 14 giorni ai sensi degli artt. 52 e ss. del Codice del Consumo; per i servizi digitali attivati immediatamente il recesso decade su richiesta esplicita del cliente. Nessun rinnovo automatico non comunicato.";

export const PRICING_LEGAL_NOTE_EN =
  "Prices in euro, excluding 22% Italian VAT. Electronic invoicing. Consumers have a 14-day right of withdrawal under Italian Consumer Code; for digital services started immediately, withdrawal lapses upon the customer's explicit request. No undisclosed auto-renewal.";

/** Disclaimer trasparenza AI (AI Act art. 50). */
export const AI_DISCLAIMER_IT =
  "Arianna e gli agenti Empire sono sistemi di intelligenza artificiale: le conversazioni sono generate automaticamente e possono contenere imprecisioni. Nessuna decisione automatizzata con effetti giuridici viene presa senza supervisione umana.";

export const AI_DISCLAIMER_EN =
  "Arianna and the Empire agents are artificial intelligence systems: conversations are generated automatically and may contain inaccuracies. No automated decision with legal effects is taken without human oversight.";

/** Righe legali non vuote, pronte per il footer. */
export function legalIdentityLines(): string[] {
  const rows: string[] = [];
  if (LEGAL.legalName) rows.push(LEGAL.legalName);
  if (LEGAL.address) rows.push(LEGAL.address);
  if (LEGAL.vatNumber) rows.push(`P.IVA ${LEGAL.vatNumber}`);
  if (LEGAL.rea) rows.push(`REA ${LEGAL.rea}`);
  if (LEGAL.shareCapital) rows.push(`Cap. soc. ${LEGAL.shareCapital}`);
  if (LEGAL.email) rows.push(LEGAL.email);
  if (LEGAL.pec) rows.push(`PEC ${LEGAL.pec}`);
  return rows;
}
