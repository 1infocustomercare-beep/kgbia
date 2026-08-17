/**
 * Empire — CORE Wave 2: espansione dei settori restanti a 20+ identità.
 * Ogni riga dichiara solo ciò che DEVE essere unico (brand, palette, firma di
 * superficie, tipografia/geometria); i percorsi funzionali arrivano da set di
 * schermate curati per settore (4 varianti per settore, cicliche) così che ogni
 * identità mostri funzioni realmente utili al proprio sotto-settore.
 */
import { X, type ExpansionRow } from "./mockup-identity-expansion-core";
import type { SectorKey } from "./mockup-identity-matrix";

/** 4 percorsi funzionali per settore — ogni identità ne usa uno (indice ciclico). */
const SCREEN_SETS: Partial<Record<SectorKey, string[][]>> = {
  legal: [
    ["home:Studio e materie", "team:Professionisti", "quote:Valuta il caso", "booking:Consulenza", "D:crm:Pratiche e scadenze"],
    ["home:Aree di assistenza", "docs:Pratiche e atti", "chat:Assistente legale", "booking:Primo incontro", "D:admin:Parcelle e udienze"],
    ["home:Tutela immediata", "quote:Preventivo trasparente", "docs:Documenti da caricare", "tracking:Stato pratica", "review:Recensioni verificate"],
    ["home:Consulenza d'impresa", "report:Report compliance", "docs:Contratti in firma", "booking:Agenda studio", "D:ops:Scadenzario team"],
  ],
  retail: [
    ["home:Vetrina", "catalog:Collezione", "detail:Scheda prodotto", "order:Carrello", "loyalty:Carta cliente"],
    ["home:Nuovi arrivi", "catalog:Reparti", "detail:Taglie e disponibilità", "map:Ritiro in negozio", "order:Checkout rapido"],
    ["home:Offerte del giorno", "catalog:Listino", "order:Ordine e consegna", "tracking:Spedizione", "D:admin:Scorte e vendite"],
    ["home:Boutique", "gallery:Lookbook", "detail:Dettaglio pezzo", "booking:Appuntamento in store", "wallet:Credito e resi"],
  ],
  events: [
    ["home:Prossimo evento", "schedule:Programma", "detail:Line-up", "order:Biglietti", "map:Come arrivare"],
    ["home:Locale e serate", "schedule:Calendario serate", "booking:Tavolo e lista", "wallet:Prevendita", "review:Recensioni"],
    ["home:Matrimoni e cerimonie", "gallery:Portfolio eventi", "quote:Preventivo evento", "booking:Sopralluogo", "D:crm:Clienti e preventivi"],
    ["home:Festival", "schedule:Palchi e orari", "map:Mappa area", "order:Pass e abbonamenti", "chat:Info live"],
  ],
  education: [
    ["home:Corsi attivi", "catalog:Catalogo corsi", "schedule:Orario lezioni", "detail:Programma corso", "wallet:Retta e rate"],
    ["home:Iscrizioni aperte", "quote:Percorso su misura", "team:Docenti", "booking:Open day", "D:admin:Classi e presenze"],
    ["home:Formazione aziendale", "report:Progressi allievo", "docs:Attestati", "chat:Tutor dedicato", "schedule:Sessioni live"],
    ["home:Doposcuola", "schedule:Settimana attività", "profile:Scheda studente", "wallet:Abbonamento mensile", "review:Feedback famiglie"],
  ],
  petcare: [
    ["home:Servizi per il tuo animale", "booking:Appuntamento", "profile:Libretto sanitario", "catalog:Toelettatura e cure", "chat:Consulto rapido"],
    ["home:Clinica veterinaria", "team:Veterinari", "booking:Visita e urgenze", "docs:Referti e vaccini", "D:admin:Agenda ambulatori"],
    ["home:Pensione e day care", "schedule:Calendario soggiorni", "detail:Suite e servizi", "order:Preventivo soggiorno", "gallery:Foto della giornata"],
    ["home:Shop e nutrizione", "catalog:Prodotti per specie", "order:Abbonamento cibo", "tracking:Consegna", "loyalty:Punti zampa"],
  ],
  childcare: [
    ["home:Il nido", "schedule:Giornata tipo", "profile:Scheda bambino", "gallery:Diario fotografico", "wallet:Retta mensile"],
    ["home:Iscrizioni", "quote:Sezioni e orari", "team:Educatrici", "booking:Visita alla struttura", "D:admin:Presenze e menu"],
    ["home:Centro estivo", "schedule:Settimane e turni", "order:Iscrizione turno", "chat:Comunicazioni famiglie", "review:Recensioni genitori"],
    ["home:Ludoteca", "catalog:Laboratori", "booking:Prenota laboratorio", "loyalty:Carta ingressi", "profile:Allergie e deleghe"],
  ],
  homeservices: [
    ["home:Interventi", "quote:Preventivo immediato", "booking:Fascia di intervento", "tracking:Tecnico in arrivo", "review:Valuta l'intervento"],
    ["home:Pronto intervento", "map:Tecnici in zona", "chat:Diagnosi rapida", "order:Conferma intervento", "D:ops:Squadre e chiamate"],
    ["home:Ristrutturazioni", "gallery:Prima e dopo", "quote:Capitolato e stima", "docs:Contratto e SAL", "D:crm:Cantieri e clienti"],
    ["home:Manutenzione programmata", "schedule:Piano annuale", "wallet:Abbonamento casa", "docs:Certificazioni impianti", "report:Storico interventi"],
  ],
  watersports: [
    ["home:Flotta", "catalog:Barche disponibili", "detail:Scheda imbarcazione", "booking:Data e skipper", "map:Rotte suggerite"],
    ["home:Scuola vela", "schedule:Corsi e uscite", "team:Istruttori", "order:Iscrizione corso", "docs:Brevetti e liberatorie"],
    ["home:Noleggio rapido", "map:Punti noleggio", "booking:Slot orario", "order:Pagamento e cauzione", "review:Recensioni"],
    ["home:Diving e escursioni", "catalog:Esperienze", "detail:Immersione", "booking:Prenota uscita", "gallery:Galleria subacquea"],
  ],
  golf: [
    ["home:Circolo", "booking:Prenota tee time", "schedule:Gare e calendario", "report:Handicap e statistiche", "wallet:Quota socio"],
    ["home:Campo pratica", "map:Percorso 18 buche", "booking:Lezione con maestro", "catalog:Pro shop", "review:Recensioni"],
    ["home:Academy", "team:Maestri", "schedule:Programma lezioni", "report:Analisi swing", "wallet:Pacchetto lezioni"],
    ["home:Resort e golf", "detail:Green fee e pacchetti", "booking:Stay & play", "gallery:Il percorso", "D:admin:Tee sheet e soci"],
  ],
  condo: [
    ["home:Il condominio", "docs:Documenti e verbali", "report:Spese e rendiconto", "chat:Segnalazioni", "wallet:Rate condominiali"],
    ["home:Residenza", "booking:Spazi comuni", "schedule:Interventi programmati", "docs:Regolamento", "profile:Unità immobiliare"],
    ["home:Amministrazione", "report:Bilancio consuntivo", "docs:Assemblee e deleghe", "tracking:Stato segnalazione", "D:admin:Fornitori e scadenze"],
    ["home:Servizi al residente", "catalog:Servizi convenzionati", "chat:Portineria digitale", "booking:Prenota servizio", "wallet:Addebiti"],
  ],
  equestrian: [
    ["home:Il centro ippico", "schedule:Lezioni e monte", "team:Istruttori", "profile:Scheda cavallo", "wallet:Abbonamento monte"],
    ["home:Pensione cavalli", "detail:Box e servizi", "docs:Libretto e vaccini", "booking:Visita al centro", "D:admin:Box e scuderia"],
    ["home:Concorsi", "schedule:Calendario gare", "order:Iscrizione categoria", "report:Piazzamenti", "gallery:Foto di gara"],
    ["home:Passeggiate a cavallo", "catalog:Itinerari", "booking:Prenota uscita", "review:Recensioni", "map:Percorsi nel parco"],
  ],
  aiservices: [
    ["home:Agenti attivi", "report:Performance agenti", "chat:Conversazioni", "wallet:Consumi e piano", "D:ops:Console operativa"],
    ["home:Automazioni", "catalog:Libreria agenti", "detail:Configurazione agente", "report:ROI automazioni", "D:admin:Log e integrazioni"],
    ["home:Assistente vocale", "chat:Trascrizioni chiamate", "schedule:Turni di risposta", "report:Chiamate gestite", "wallet:Minuti e crediti"],
    ["home:Consulenza IA", "quote:Valuta il tuo caso", "docs:Proposta e SLA", "booking:Call tecnica", "report:Roadmap adozione"],
  ],
};

export type Wave2Row = {
  sector: SectorKey;
  id: string;
  /** DNA visivo, deve essere unico in tutto il registro */
  family: string;
  label: string;
  brand: string;
  tagline: string;
  /** "bg,surface,text,muted,accent,accent2" */
  palette: string;
  /** "display|body|trattamento" */
  typography: string;
  /** "radius|border|grid|density" */
  geometry: string;
  /** "nav|light|signature" */
  chrome: string;
  photography: string;
  composition: string;
  /** "materia|luce|fondale|staging|motivo" */
  surface: string;
  /** indice del percorso funzionale (0-3) */
  path: number;
};

export function buildWave2(rows: Wave2Row[]): ExpansionRow[] {
  return rows.map((r) => {
    const sets = SCREEN_SETS[r.sector];
    if (!sets) throw new Error(`Nessun percorso funzionale per il settore ${r.sector}`);
    const screens = sets[r.path % sets.length];
    return X(r.sector, r.id, r.family, r.label, r.brand, r.tagline, r.palette, r.typography,
      r.geometry, r.chrome, r.photography, r.composition, r.surface, screens);
  });
}

/**
 * Forma compatta: campi separati da "¦" nell'ordine
 * sector¦id¦family¦label¦brand¦tagline¦palette¦typography¦geometry¦chrome¦photography¦composition¦surface¦path
 */
export function W(line: string): Wave2Row {
  const f = line.split("¦").map((s) => s.trim());
  if (f.length !== 14) throw new Error(`Riga wave2 malformata (${f.length} campi): ${f[1] ?? line}`);
  return {
    sector: f[0] as SectorKey, id: f[1], family: f[2], label: f[3], brand: f[4], tagline: f[5],
    palette: f[6], typography: f[7], geometry: f[8], chrome: f[9],
    photography: f[10], composition: f[11], surface: f[12], path: Number(f[13]),
  };
}
