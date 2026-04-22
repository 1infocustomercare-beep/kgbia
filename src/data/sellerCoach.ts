// Knowledge base centralizzata per il Coach Empire — una entry per ogni pagina seller.
// Aggiungi qui nuovi capitoli quando aggiungi pagine. La chat AI usa questi dati come contesto.

export interface CoachChapter {
  /** route prefix (match con location.pathname.startsWith) */
  routePrefix: string;
  title: string;
  /** breve descrizione 1-frase mostrata sotto il titolo */
  subtitle: string;
  /** cosa fa la pagina, in 2-4 frasi */
  whatItDoes: string;
  /** 3-5 best practice attuabili */
  bestPractices: string[];
  /** 3-5 errori comuni da evitare */
  pitfalls: string[];
  /** automazioni disponibili (Arianna, cron, AI batch...) */
  automations: { label: string; description: string }[];
  /** scorciatoie operative (azioni rapide) */
  shortcuts: { label: string; tip: string }[];
  /** step del tour onboarding la prima volta */
  tourSteps?: { target: string; title: string; content: string }[];
}

export const COACH_CHAPTERS: CoachChapter[] = [
  {
    routePrefix: "/partner/leads",
    title: "Lead Engine",
    subtitle: "Scouting, arricchimento, pipeline e outreach automatico",
    whatItDoes:
      "Qui trovi tutti i lead caldi/tiepidi raccolti da Arianna o aggiunti manualmente. Puoi filtrare per zona, settore, AI score, generare preview demo personalizzate e avviare sequenze multi-canale (Email + WhatsApp + IG + FB) in 1 click.",
    bestPractices: [
      "Lavora prima i lead con AI score ≥ 75 — convertono 4× rispetto agli altri",
      "Genera SEMPRE la preview prima del primo contatto: aumenta la conversione dell'85%",
      "Usa filtro 'Non contattati >3 giorni' la mattina per non perdere il timing",
      "Lascia che Arianna scelga il canale ottimale invece di forzarlo manualmente",
      "Marca subito 'lost' chi rifiuta: l'AI impara e smette di propormi simili",
    ],
    pitfalls: [
      "Non inviare 4+ messaggi nello stesso giorno: rischio ban WhatsApp/IG",
      "Non contattare fuori orario business (9–19 lun-ven) → bassa conversione + spam flag",
      "Evita di copiare messaggi identici a più lead: i provider penalizzano duplicati",
      "Non eliminare lead 'freddi': spostali in 'paused', spesso si riaccendono dopo 30g",
    ],
    automations: [
      { label: "Arianna Autopilot", description: "Scansione continua zone+settori e arricchimento automatico in background" },
      { label: "Sequenza adattiva AI", description: "5 touch su canali diversi, decide l'AI quando e dove" },
      { label: "Intelligence Inbox", description: "Report automatico per ogni lead analizzato (scoring + weak points + sales pitch)" },
    ],
    shortcuts: [
      { label: "⚡ Avvia outreach", tip: "Click sul lead → 'Contatta ora' → sequenza parte in <10 sec" },
      { label: "🎯 Filtro hot", tip: "Header → AI score >75 + Mai contattato → lavora prima questi" },
      { label: "📱 Preview rapida", tip: "Tap lungo sul lead → 'Genera demo' → link WhatsApp pronto" },
    ],
    tourSteps: [
      { target: "[data-tour='leads-search']", title: "Cerca lead", content: "Filtra per città, settore o nome. Combina con AI score per trovare i migliori prospect." },
      { target: "[data-tour='leads-list']", title: "I tuoi lead", content: "Tap per dettaglio, swipe per azioni rapide. I numeri colorati = AI score." },
      { target: "[data-tour='leads-arianna']", title: "Arianna Autopilot", content: "Attivala e Arianna lavora 24/7 trovando + contattando lead per te." },
    ],
  },
  {
    routePrefix: "/partner/api-connections",
    title: "Connessioni API",
    subtitle: "Tutte le fonti dati che alimentano la tua ricerca",
    whatItDoes:
      "Centro di controllo per tutte le API esterne (Firecrawl, Resend, Twilio, Stripe, Meta…). Empire gestisce centralmente le 'managed' (paghi solo crediti). Le 'personali' richiedono setup ma sbloccano funzioni avanzate.",
    bestPractices: [
      "Inizia con le API gestite Empire — zero setup, paghi solo l'uso effettivo",
      "Configura Resend appena fai 50+ lead/giorno: email custom dominio = +30% open rate",
      "Twilio sandbox è gratis ma limitato: per produzione richiedi numero WhatsApp Business",
      "Stripe è obbligatorio se vuoi vendere: anche test mode è ok all'inizio",
    ],
    pitfalls: [
      "Mai incollare chiavi private nei messaggi WhatsApp/email al supporto: usa il flusso sicuro",
      "Non disattivare API gestite Empire: rompi Arianna Autopilot",
      "Non testare con il tuo numero personale: usa numeri sandbox dei provider",
    ],
    automations: [
      { label: "Auto-failover Firecrawl", description: "Se la chiave premium si esaurisce, Empire passa al fallback gratuito" },
      { label: "Health check 5min", description: "Monitoring continuo: ti avvisa se una chiave smette di funzionare" },
    ],
    shortcuts: [
      { label: "🔍 Cerca API", tip: "Nome o categoria nella search bar in alto" },
      { label: "✅ Filtra attive", tip: "Vedi solo quelle pronte all'uso" },
      { label: "🔑 Attiva ora", tip: "Apre il portale + email pre-compilata al team Empire" },
    ],
  },
  {
    routePrefix: "/partner/demo-studio",
    title: "Demo Studio Full Power",
    subtitle: "Mockup iPhone + vetrina siti demo 1:1, tutto in un posto solo",
    whatItDoes:
      "Crea Mockup Suite (4 schermate iPhone) con engine React/Nano Banana/Pro e gestisci la vetrina di tutti i siti demo Full Power generati. Ogni sito demo nasce da un mockup approvato e ne è la replica 1:1 (design, palette, font, layout, copy). Per generare un nuovo sito vai in /partner/leads e collega il mockup al lead.",
    bestPractices: [
      "Crea prima il Mockup Suite, poi genera il sito demo dai Leads: il sito sarà identico al mockup approvato",
      "Personalizza SEMPRE nome attività, settore e città — l'AI calibra il template di conseguenza",
      "Riusa i mockup approvati su lead simili: Vault gratis, niente spreco crediti",
      "Usa la modalità ‘Pronta da mostrare’ per chiudere il cliente in 60 secondi davanti allo schermo",
    ],
    pitfalls: [
      "Non generare siti standard/basic: la regola è 1:1 dal mockup, sempre",
      "Non rigenerare un mockup identico: duplicato = spreco crediti",
    ],
    automations: [
      { label: "Auto-match template", description: "L'AI sceglie il template Premium 2026 più adatto al sotto-settore del lead" },
      { label: "Vault riuso", description: "Mockup e siti demo salvati, riutilizzabili gratis su lead simili" },
      { label: "Pronta da mostrare", description: "Modalità presentazione fullscreen 60s, dati sensibili nascosti" },
    ],
    shortcuts: [
      { label: "📱 Nuovo mockup", tip: "Demo Studio → ‘Nuovo Mockup Suite’ → 4 schermate in 30s" },
      { label: "🚀 Genera sito demo", tip: "Leads → seleziona lead → ‘Genera demo’ → sito 1:1 dal mockup" },
      { label: "🎬 Pronta da mostrare", tip: "Demo Studio → ‘Pronta da mostrare’ (anche da Home Partner)" },
    ],
  },
  {
    routePrefix: "/partner/earnings",
    title: "Guadagni & Commissioni",
    subtitle: "Il tuo storico vendite, bonus performance e payout Stripe",
    whatItDoes:
      "Vedi commissioni maturate, bonus mensili (3 vendite = €500, 5 = €1500) e stato dei payout. Stripe Connect gestisce i bonifici settimanali automatici.",
    bestPractices: [
      "Punta a 3 vendite/mese minimo per il bonus Pro €500",
      "Recluta 2 sub-partner per essere promosso Team Leader (override 10%)",
      "Verifica IBAN su Stripe a inizio mese: payout bloccati = commissioni in sospeso",
    ],
    pitfalls: [
      "Non chiudere con sconti >15% senza approvazione: erodi il margine bonus",
      "Non promettere features non ancora rilasciate: rischio refund",
    ],
    automations: [
      { label: "Bonus auto-calcolati", description: "Il sistema accredita bonus il 1° del mese successivo" },
      { label: "Notifica payout", description: "Email + push quando Stripe trasferisce" },
    ],
    shortcuts: [
      { label: "💰 Filtra mese", tip: "Header dropdown — confronta mese su mese" },
      { label: "📥 Esporta CSV", tip: "Per commercialista o reportistica personale" },
    ],
  },
  {
    routePrefix: "/partner/portfolio",
    title: "Portfolio Showcase",
    subtitle: "I tuoi clienti attivi e case study da mostrare in pitch",
    whatItDoes:
      "Vetrina dei tuoi clienti per usare in modalità presentazione. Aggiungi screenshot, KPI e testimonial per chiudere più vendite.",
    bestPractices: [
      "Mostra SEMPRE 3 case study del settore del prospect",
      "Includi numeri reali: 'da 0 a 120 ordini/sett in 60g' converte più di 'aumento delle vendite'",
      "Aggiorna almeno 1 case ogni 2 settimane",
    ],
    pitfalls: [
      "Non inventare metriche: i prospect verificano",
      "Non mostrare clienti diretti competitor: gli rovini la fiducia",
    ],
    automations: [
      { label: "Auto-import vendite", description: "Le tue vendite chiuse appaiono qui automaticamente" },
    ],
    shortcuts: [
      { label: "🎯 Modalità demo", tip: "Toggle in alto → nasconde dati sensibili per pitch live" },
    ],
  },
  {
    routePrefix: "/partner/profile",
    title: "Profilo & Impostazioni",
    subtitle: "Dati account, preferenze, branding personale",
    whatItDoes:
      "Gestisci la tua identità da partner: avatar, bio, link bio, branding personale (colori/logo) usato nelle preview generate.",
    bestPractices: [
      "Usa avatar professionale (no selfie) — visibile anche al cliente",
      "Aggiungi bio breve persuasiva: appare nelle preview che invii",
      "Configura 2FA: protegge crediti e commissioni",
    ],
    pitfalls: [
      "Non condividere credenziali con sub-partner: ognuno deve avere account proprio",
    ],
    automations: [
      { label: "Sync avatar live", description: "Cambi qui = appare ovunque (header, demo, email)" },
    ],
    shortcuts: [
      { label: "🔐 2FA", tip: "Sicurezza → attiva autenticazione a due fattori" },
    ],
  },
  {
    routePrefix: "/partner",
    title: "Home Partner",
    subtitle: "Dashboard di controllo: KPI, prossime azioni, alert",
    whatItDoes:
      "Vista d'insieme con vendite, lead caldi, suggerimenti del giorno e accesso rapido a tutte le funzioni. Inizia ogni giornata da qui.",
    bestPractices: [
      "Apri prima cosa al mattino: vedi le 3 azioni AI consigliate per oggi",
      "Controlla lead caldi del giorno prima di nuove ricerche",
      "Settimana lavorativa: 5 azioni/giorno = €1500/mese in media",
    ],
    pitfalls: [
      "Non saltare il riepilogo giornaliero: contiene alert che fanno perdere vendite",
    ],
    automations: [
      { label: "Daily AI brief", description: "Ogni mattina l'AI prepara il piano di lavoro ottimale" },
      { label: "Smart alerts", description: "Notifiche solo quando serve (no spam)" },
    ],
    shortcuts: [
      { label: "🚀 Quick action", tip: "Bottoni grandi al centro = funzioni più usate" },
    ],
  },
];

export function getCoachForRoute(pathname: string): CoachChapter {
  // Match più specifico vince (più lungo = più specifico)
  const matches = COACH_CHAPTERS
    .filter((c) => pathname.startsWith(c.routePrefix))
    .sort((a, b) => b.routePrefix.length - a.routePrefix.length);
  return matches[0] || COACH_CHAPTERS[COACH_CHAPTERS.length - 1];
}
