/**
 * Empire — COMPLETAMENTO SCHERMATE.
 *
 * Ogni identità del registro deve presentare al cliente un percorso completo:
 * minimo 7 schermate (SCREEN_TARGET) per far vedere vetrina, catalogo,
 * dettaglio, conversione, area cliente, assistente AI e pannello gestionale.
 *
 * Le identità nate con 4/5 schermate vengono completate con schermate
 * SETTORIALI (non generiche): il pool sotto è scritto per settore, così la
 * schermata aggiunta rappresenta una funzione realmente utile a quel business.
 * Nessuna schermata esistente viene modificata o rimossa: si aggiunge solo
 * ciò che manca, in coda, mantenendo l'ordine narrativo originale.
 */
import type { MockupIdentity, ScreenSpec, SectorKey } from "./mockup-identity-matrix";

export const SCREEN_TARGET = 7;

const m = (key: string, title: string, purpose: string, elements: string[]): ScreenSpec =>
  ({ key, title, purpose, elements, surface: "mobile" });
const d = (key: string, title: string, purpose: string, elements: string[]): ScreenSpec =>
  ({ key, title, purpose, elements, surface: "desktop" });

/** Schermate di riserva, ordinate per priorità di vendita, per ogni settore. */
const SECTOR_FILLERS: Record<SectorKey, ScreenSpec[]> = {
  food: [
    m("order", "Ordina e paga", "Carrello, asporto o consegna, pagamento in-app", ["righe carrello", "switch asporto/consegna", "totale in €", "CTA pagamento"]),
    m("loyalty", "Fidelity", "Raccolta punti e premi automatici", ["saldo punti", "premi sbloccati", "barra progresso", "QR tessera"]),
    m("chat", "Assistente AI", "Agente che risponde e prende prenotazioni 24/7", ["bolle conversazione", "risposta agente", "azioni rapide", "campo input"]),
    m("gallery", "Sala e cucina", "Racconto del locale con foto editoriali", ["griglia foto", "didascalie brevi", "indirizzo e orari"]),
    d("kitchen", "Monitor cucina", "Comande in tempo reale per la brigata", ["colonne stato comanda", "timer preparazione", "priorità tavolo"]),
  ],
  beauty: [
    m("calendar", "Agenda live", "Slot multi-operatore con conferma immediata", ["colonne operatore", "slot orari", "badge disponibile", "CTA conferma"]),
    m("treatments", "Trattamenti", "Listino servizi con durata e prezzo", ["righe servizio", "durata in minuti", "prezzi in €", "filtri categoria"]),
    m("chat", "Assistente AI", "Agente che gestisce richieste e ricorda gli appuntamenti", ["bolle conversazione", "proposta slot", "azioni rapide"]),
    m("loyalty", "Card cliente", "Pacchetti, abbonamenti e premi", ["saldo sedute", "pacchetti attivi", "storico visite"]),
    d("admin", "Gestione salone", "Incassi, operatori e occupazione poltrone", ["KPI incassi", "occupazione oraria", "classifica servizi"]),
  ],
  ncc: [
    m("booking", "Richiedi transfer", "Tratta, orario, classe veicolo", ["campi da/a", "selettore classe", "stima prezzo", "CTA conferma"]),
    m("tracking", "Corsa live", "Mappa con autista e tempi reali", ["mappa percorso", "card autista", "ETA", "pulsante contatta"]),
    m("fleet", "Flotta", "Veicoli disponibili con dotazioni", ["schede veicolo", "posti e bagagli", "tariffa oraria"]),
    m("chat", "Concierge AI", "Assistente che organizza viaggi e variazioni", ["bolle conversazione", "riepilogo tratta", "azioni rapide"]),
    d("dispatch", "Centrale operativa", "Assegnazione corse e turni autisti", ["lista corse", "stato autisti", "mappa mezzi", "KPI puntualità"]),
  ],
  fitness: [
    m("classes", "Corsi e slot", "Calendario lezioni con posti residui", ["griglia orari", "posti rimasti", "istruttore", "CTA prenota"]),
    m("plan", "Scheda allenamento", "Programma con serie, ripetizioni e carichi", ["lista esercizi", "serie x ripetizioni", "carico in kg", "check completato"]),
    m("progress", "Progressi", "Andamento peso, forza e presenze", ["grafico andamento", "record personali", "streak presenze"]),
    m("chat", "Coach AI", "Assistente che adatta il programma", ["bolle conversazione", "consiglio del giorno", "azioni rapide"]),
    d("admin", "Gestione club", "Abbonamenti, presenze e rinnovi", ["KPI abbonati", "presenze per fascia", "rinnovi in scadenza"]),
  ],
  hospitality: [
    m("rooms", "Camere e suite", "Catalogo sistemazioni con tariffe", ["schede camera", "tariffa notte in €", "servizi inclusi"]),
    m("booking", "Prenotazione", "Date, ospiti, trattamento", ["calendario notti", "stepper ospiti", "riepilogo totale", "CTA conferma"]),
    m("concierge", "Concierge", "Servizi in struttura e esperienze", ["lista servizi", "orari", "richiesta rapida"]),
    m("chat", "Assistente AI", "Agente che risponde e fa upselling 24/7", ["bolle conversazione", "proposta upgrade", "azioni rapide"]),
    d("frontdesk", "Front desk", "Arrivi, partenze e occupazione", ["timeline camere", "KPI occupazione", "check-in di oggi"]),
  ],
  realestate: [
    m("search", "Ricerca immobili", "Filtri per zona, prezzo e metratura", ["barra filtri", "schede immobile", "prezzo in €", "mappa compatta"]),
    m("listing", "Scheda immobile", "Foto, planimetria e dati catastali", ["gallery foto", "planimetria", "dati tecnici", "CTA visita"]),
    m("visit", "Prenota visita", "Slot con agente e conferma", ["date strip", "card agente", "CTA conferma"]),
    m("chat", "Agente AI", "Qualifica il contatto e propone immobili", ["bolle conversazione", "immobili suggeriti", "azioni rapide"]),
    d("crm", "CRM trattative", "Pipeline contatti e proposte", ["colonne pipeline", "valore trattative", "attività di oggi"]),
  ],
  healthcare: [
    m("booking", "Prenota visita", "Specialista, data e sede", ["lista specialisti", "date strip", "orari", "CTA conferma"]),
    m("records", "Referti", "Documenti clinici e storico", ["lista referti", "date", "download", "badge nuovo"]),
    m("prep", "Preparazione", "Istruzioni pre-esame e consensi", ["passi numerati", "note importanti", "checkbox consenso"]),
    m("chat", "Assistente AI", "Triage informativo e promemoria", ["bolle conversazione", "promemoria terapia", "azioni rapide"]),
    d("admin", "Agenda studio", "Ambulatori, medici e liste d'attesa", ["timeline ambulatori", "KPI visite", "lista d'attesa"]),
  ],
  legal: [
    m("services", "Aree di attività", "Materie trattate e casi seguiti", ["righe materia", "casi risolti", "CTA consulenza"]),
    m("appointment", "Prenota consulenza", "Modalità studio o video call", ["switch studio/video", "date strip", "durata", "CTA conferma"]),
    m("case", "Pratica", "Stato pratica, scadenze e documenti", ["timeline stato", "prossima scadenza", "lista documenti"]),
    m("chat", "Assistente AI", "Raccolta informazioni e primo inquadramento", ["bolle conversazione", "domande guidate", "azioni rapide"]),
    d("admin", "Gestionale studio", "Pratiche, scadenzario e parcelle", ["tabella pratiche", "scadenzario", "KPI fatturato"]),
  ],
  retail: [
    m("catalog", "Catalogo", "Prodotti con filtri e disponibilità", ["griglia prodotti", "filtri", "prezzo in €", "badge disponibilità"]),
    m("product", "Scheda prodotto", "Varianti, taglie e disponibilità in negozio", ["gallery", "selettore variante", "stock negozio", "CTA carrello"]),
    m("checkout", "Checkout", "Riepilogo, spedizione e pagamento", ["righe ordine", "opzioni spedizione", "totale in €", "CTA paga"]),
    m("loyalty", "Carta fedeltà", "Punti, coupon e offerte personali", ["saldo punti", "coupon attivi", "QR carta"]),
    d("admin", "Back office", "Magazzino, vendite e riordini", ["tabella giacenze", "KPI vendite", "avvisi riordino"]),
  ],
  events: [
    m("catalog", "Format evento", "Pacchetti e allestimenti disponibili", ["schede format", "capienza", "prezzo da in €"]),
    m("request", "Richiedi preventivo", "Data, ospiti, location", ["date strip", "stepper ospiti", "selettore location", "CTA invio"]),
    m("timeline", "Programma", "Scaletta oraria della giornata", ["timeline oraria", "responsabili", "note"]),
    m("chat", "Assistente AI", "Configura l'evento e risponde ai dubbi", ["bolle conversazione", "riepilogo evento", "azioni rapide"]),
    d("admin", "Regia eventi", "Fornitori, budget e checklist", ["tabella fornitori", "budget vs speso", "checklist stato"]),
  ],
  education: [
    m("courses", "Corsi", "Catalogo percorsi con livelli", ["schede corso", "livello", "durata", "prezzo in €"]),
    m("lesson", "Lezione", "Contenuti, materiali ed esercizi", ["player o scheda", "materiali", "progresso", "CTA continua"]),
    m("enroll", "Iscrizione", "Piani, rate e conferma", ["opzioni piano", "riepilogo rate", "CTA iscriviti"]),
    m("chat", "Tutor AI", "Assistente che spiega e assegna esercizi", ["bolle conversazione", "esercizio proposto", "azioni rapide"]),
    d("admin", "Segreteria", "Iscritti, frequenze e pagamenti", ["tabella iscritti", "frequenze", "KPI incassi"]),
  ],
  petcare: [
    m("services", "Servizi", "Toelettatura, pensione, veterinario", ["righe servizio", "durata", "prezzo in €"]),
    m("booking", "Prenota", "Animale, data, operatore", ["scheda animale", "date strip", "orari", "CTA conferma"]),
    m("pet", "Scheda animale", "Libretto, vaccini e note", ["dati animale", "vaccini con date", "note comportamento"]),
    m("chat", "Assistente AI", "Consigli e promemoria richiami", ["bolle conversazione", "promemoria vaccino", "azioni rapide"]),
    d("admin", "Gestione struttura", "Box, turni e presenze animali", ["mappa box", "KPI presenze", "turni staff"]),
    m("shop", "Shop e alimenti", "Cibo, accessori e riordino automatico", ["griglia prodotti", "prezzo in €", "abbonamento riordino", "CTA carrello"]),
  ],
  childcare: [
    m("dayplan", "Giornata", "Routine, pasti e riposo", ["timeline giornata", "pasti", "riposo", "note educatrice"]),
    m("enroll", "Iscrizione", "Fasce orarie, retta e documenti", ["opzioni fascia", "retta in €", "lista documenti", "CTA invio"]),
    m("diary", "Diario bambino", "Aggiornamenti e foto per i genitori", ["card aggiornamento", "foto", "orario", "reazione genitore"]),
    m("chat", "Assistente AI", "Comunicazioni e avvisi automatici", ["bolle conversazione", "avviso assenza", "azioni rapide"]),
    d("admin", "Gestione nido", "Sezioni, presenze e rette", ["tabella presenze", "sezioni", "KPI rette"]),
  ],
  homeservices: [
    m("services", "Interventi", "Tipologie di intervento e tariffe", ["righe intervento", "tempo medio", "tariffa in €"]),
    m("request", "Richiedi intervento", "Problema, indirizzo, urgenza", ["selettore problema", "campo indirizzo", "switch urgenza", "CTA invio"]),
    m("tracking", "Tecnico in arrivo", "Stato intervento e tecnico assegnato", ["stato a passi", "card tecnico", "ETA", "contatta"]),
    m("chat", "Assistente AI", "Diagnosi preliminare e preventivo rapido", ["bolle conversazione", "stima costo", "azioni rapide"]),
    d("dispatch", "Centrale interventi", "Squadre, zone e priorità", ["lista interventi", "stato squadre", "mappa zone", "KPI SLA"]),
  ],
  watersports: [
    m("catalog", "Barche e attività", "Mezzi ed esperienze disponibili", ["schede mezzo", "posti", "tariffa in €"]),
    m("booking", "Prenota uscita", "Data, orario, skipper", ["date strip", "fasce orarie", "switch skipper", "CTA conferma"]),
    m("route", "Itinerario", "Tappe, mappa e durata", ["mappa rotta", "tappe numerate", "durata"]),
    m("chat", "Assistente AI", "Meteo, disponibilità e consigli", ["bolle conversazione", "meteo del giorno", "azioni rapide"]),
    d("admin", "Gestione flotta", "Uscite, manutenzioni e incassi", ["calendario uscite", "stato mezzi", "KPI incassi"]),
  ],
  golf: [
    m("teetime", "Tee time", "Prenotazione partenze", ["griglia orari", "buche 9/18", "giocatori", "CTA conferma"]),
    m("course", "Percorso", "Buche, par e distanze", ["mappa buca", "par e handicap", "distanze in metri"]),
    m("scorecard", "Scorecard", "Punteggio per buca e statistiche", ["tabella buche", "totale colpi", "statistiche"]),
    m("chat", "Assistente AI", "Prenotazioni, lezioni e gare", ["bolle conversazione", "proposta lezione", "azioni rapide"]),
    d("admin", "Segreteria club", "Soci, gare e partenze", ["tabella soci", "calendario gare", "KPI partenze"]),
  ],
  condo: [
    m("home", "Bacheca condominio", "Avvisi e comunicazioni", ["card avviso", "data", "priorità", "allegati"]),
    m("tickets", "Segnalazioni", "Guasti e richieste con stato", ["lista segnalazioni", "stato", "foto", "CTA nuova"]),
    m("accounts", "Spese e rate", "Bilancio, quote e scadenze", ["righe spesa", "quota millesimale", "scadenza", "CTA paga"]),
    m("chat", "Assistente AI", "Risposte a regolamento e pratiche", ["bolle conversazione", "riferimento regolamento", "azioni rapide"]),
    d("admin", "Gestione stabili", "Immobili, fornitori e scadenze", ["tabella stabili", "fornitori", "scadenzario"]),
  ],
  equestrian: [
    m("lessons", "Lezioni", "Calendario monta e istruttori", ["griglia orari", "istruttore", "livello", "CTA prenota"]),
    m("horse", "Scheda cavallo", "Salute, ferratura e alimentazione", ["dati cavallo", "prossima ferratura", "piano alimentare"]),
    m("stable", "Box e pensione", "Servizi di scuderia e tariffe", ["righe servizio", "tariffa mensile in €", "disponibilità box"]),
    m("chat", "Assistente AI", "Prenotazioni e promemoria veterinario", ["bolle conversazione", "promemoria visita", "azioni rapide"]),
    d("admin", "Gestione centro", "Cavalli, allievi e incassi", ["tabella cavalli", "allievi", "KPI incassi"]),
  ],
  aiservices: [
    m("solutions", "Soluzioni AI", "Agenti e automazioni disponibili", ["schede soluzione", "tempo attivazione", "risultato atteso"]),
    m("audit", "Check azienda", "Diagnosi processi in pochi passi", ["passi guidati", "selettori", "punteggio", "CTA report"]),
    m("workflow", "Automazione", "Flusso con trigger e azioni", ["nodi flusso", "trigger", "azioni", "stato attivo"]),
    m("chat", "Agente AI", "Assistente che qualifica e prenota la call", ["bolle conversazione", "slot proposto", "azioni rapide"]),
    d("admin", "Console agenti", "Conversazioni, esiti e risparmio ore", ["tabella conversazioni", "KPI ore risparmiate", "grafico esiti"]),
  ],
};

/** Completa un'identità fino a SCREEN_TARGET schermate, senza toccare le esistenti. */
export function completeScreens(identity: MockupIdentity, target = SCREEN_TARGET): MockupIdentity {
  if (identity.screens.length >= target) return identity;
  const used = new Set(identity.screens.map((s) => s.key));
  const pool = SECTOR_FILLERS[identity.sector] ?? [];
  const extra = pool.filter((s) => !used.has(s.key)).slice(0, target - identity.screens.length);
  if (!extra.length) return identity;
  return { ...identity, screens: [...identity.screens, ...extra] };
}

/** Report di copertura: quante identità raggiungono il target. */
export function screenCoverage(identities: MockupIdentity[], target = SCREEN_TARGET) {
  const under = identities.filter((i) => i.screens.length < target).map((i) => `${i.id}:${i.screens.length}`);
  return { ok: under.length === 0, target, under, total: identities.length };
}
