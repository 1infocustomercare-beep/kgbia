/**
 * Empire — MATRICE DI IDENTITÀ MOCKUP
 * ------------------------------------
 * Obiettivo: generare mockup dove OGNI settore ha 5 identità visive
 * COMPLETAMENTE diverse tra loro e MAI condivise con altri settori.
 *
 * Regola ferrea (validata a runtime da `assertMatrixIntegrity`):
 *  - ogni `family` (DNA visivo) compare UNA SOLA VOLTA in tutta la matrice
 *  - ogni identità ha palette, tipografia, geometria, chrome, fotografia
 *    e ritmo compositivo propri → nessun "modello base" riusato
 *  - le schermate sono funzioni REALI del settore, 4-7 per identità
 *
 * Consumato da: generatori mockup (edge functions), gallerie catalogo,
 * selettori stile Partner.
 */

export type IdentityFamily =
  | "neo-editorial-magazine" | "midnight-lacquer" | "neo-brutalist-industrial"
  | "mediterranean-sunlit" | "swiss-clinical-grid"
  | "porcelain-couture" | "chrome-y2k-gloss" | "botanical-apothecary"
  | "graphite-atelier" | "pastel-riso-print"
  | "obsidian-chauffeur" | "aviation-instrument" | "ivory-concierge"
  | "carbon-motorsport" | "art-deco-transit"
  | "acid-performance" | "monastic-recovery" | "tactical-hud"
  | "sunrise-gradient-flow" | "typographic-scoreboard"
  | "coastal-linen" | "alpine-timber" | "grand-hotel-classic"
  | "desert-adobe" | "nocturne-jazz-lounge"
  | "blueprint-architectural" | "gallery-white-cube" | "terracotta-tuscan"
  | "glass-tower-metropolitan" | "cadastral-map-mono"
  | "sterile-mint-clinic" | "soft-neumorphic-care" | "deep-navy-diagnostic"
  | "paper-chart-analog" | "human-warm-gradient"
  | "chancery-oxblood" | "marble-classical" | "raw-legal-mono"
  | "navy-pinstripe-corporate" | "quiet-luxury-parchment"
  | "hyper-color-pop" | "monochrome-boutique" | "warehouse-utility"
  | "vitrine-jewel-box" | "zine-collage"
  | "neon-club-poster" | "champagne-gala" | "festival-ticket-stub"
  | "kinetic-typography" | "velvet-curtain"
  | "chalkboard-scholastic" | "playful-block-primary" | "campus-modernist"
  | "notebook-dotgrid" | "cyber-academy";

export type ScreenSpec = {
  key: string;
  /** titolo mostrato in UI/catalogo */
  title: string;
  /** funzione reale che la schermata rappresenta */
  purpose: string;
  /** elementi obbligatori nel render */
  elements: string[];
  surface: "mobile" | "desktop";
};

export type MockupIdentity = {
  id: string;
  sector: SectorKey;
  family: IdentityFamily;
  label: string;
  /** nome brand fittizio coerente col settore — MAI copiato da competitor */
  brand: string;
  tagline: string;
  palette: { bg: string; surface: string; text: string; muted: string; accent: string; accent2: string };
  typography: { display: string; body: string; treatment: string };
  geometry: { radius: string; border: string; grid: string; density: "airy" | "balanced" | "dense" };
  chrome: { nav: string; statusBar: "light" | "dark"; signature: string };
  photography: string;
  composition: string;
  screens: ScreenSpec[];
};

export type SectorKey =
  | "food" | "beauty" | "ncc" | "fitness" | "hospitality"
  | "realestate" | "healthcare" | "legal" | "retail" | "events" | "education";

const m = (key: string, title: string, purpose: string, elements: string[]): ScreenSpec =>
  ({ key, title, purpose, elements, surface: "mobile" });
const d = (key: string, title: string, purpose: string, elements: string[]): ScreenSpec =>
  ({ key, title, purpose, elements, surface: "desktop" });

/* ------------------------------------------------------------------ */
/* FOOD                                                                */
/* ------------------------------------------------------------------ */
const FOOD: MockupIdentity[] = [
  {
    id: "food-neo-editorial", sector: "food", family: "neo-editorial-magazine",
    label: "Neo-Editorial Magazine", brand: "Osteria Ventidue", tagline: "Cucina di casa, servita bene.",
    palette: { bg: "#F6F1E7", surface: "#FFFDF8", text: "#14110E", muted: "#7A7266", accent: "#C0562B", accent2: "#DCD3C2" },
    typography: { display: "Serif condensato display 44px", body: "Sans micro-caps 11px tracking 0.14em", treatment: "titoli su due righe con filetto accento" },
    geometry: { radius: "0px", border: "hairline 1px", grid: "8pt · colonna singola editoriale", density: "airy" },
    chrome: { nav: "tab bar piatta con indicatore 2px superiore", statusBar: "dark", signature: "masthead con occhiello città + anno" },
    photography: "food dall'alto su ceramica rustica, luce finestra naturale, grana carta 3%",
    composition: "titolo gigante → foto 4:3 → listino a due colonne con filetti",
    screens: [
      m("home", "Home editoriale", "Vetrina piatto del giorno + identità", ["masthead", "headline serif", "foto 4:3", "pill prezzo"]),
      m("menu", "Menù per portate", "Navigazione antipasti/primi/secondi/dolci", ["link testuali", "righe listino", "prezzi tabulari"]),
      m("dish", "Scheda piatto", "Ingredienti, allergeni, abbinamento vino", ["foto full-bleed", "lista ingredienti", "chip allergeni"]),
      m("booking", "Prenotazione tavolo", "Data, coperti, sala", ["date strip", "stepper coperti", "CTA piena"]),
      d("admin", "Sala & incassi", "Gestione turni e coperti", ["planimetria sala", "KPI coperti", "grafico incassi"]),
    ],
  },
  {
    id: "food-midnight-lacquer", sector: "food", family: "midnight-lacquer",
    label: "Midnight Lacquer", brand: "Kaidō Omakase", tagline: "Banco chef, otto posti.",
    palette: { bg: "#0B0C0E", surface: "#15171A", text: "#F2F4F6", muted: "#8A9099", accent: "#6FE3B4", accent2: "#C8A15A" },
    typography: { display: "Geometrico tight 28px", body: "Sans 15px, numerali tabulari", treatment: "micro-label uppercase tracking 0.18em" },
    geometry: { radius: "14px", border: "1px rgba(255,255,255,.08)", grid: "8pt · card scure", density: "balanced" },
    chrome: { nav: "tab bar frosted flottante", statusBar: "light", signature: "wordmark ottone small-caps centrato" },
    photography: "mani chef, fiamma cannello, controluce caldo, ombre profonde",
    composition: "hero cinematografico → card seduta → griglia slot orari → CTA jade",
    screens: [
      m("hero", "Banco omakase", "Presentazione esperienza", ["foto cinematografica", "rating", "stato aperto"]),
      m("seats", "Tipologia seduta", "Banco chef / privé / sala sake", ["3 card scure", "prezzo da"]),
      m("slots", "Slot orari", "Selezione data e orario", ["date chips", "griglia orari", "slot esauriti"]),
      m("sake", "Carta sake", "Abbinamenti e degustazioni", ["lista bottiglie", "note degustazione"]),
      m("confirm", "Conferma", "Riepilogo e pagamento caparra", ["riepilogo", "CTA jade"]),
    ],
  },
  {
    id: "food-neo-brutalist", sector: "food", family: "neo-brutalist-industrial",
    label: "Neo-Brutalist Industrial", brand: "Cantiere 47", tagline: "Burger e taproom.",
    palette: { bg: "#D9D6D0", surface: "#FFFFFF", text: "#000000", muted: "#4A4A4A", accent: "#E8FF35", accent2: "#FF3B1F" },
    typography: { display: "Grotesque nero all-caps", body: "Mono 13px", treatment: "leading strettissimo, sticker ruotati" },
    geometry: { radius: "0px", border: "2px solid nero", grid: "blocchi rigidi, asimmetria voluta", density: "dense" },
    chrome: { nav: "nessuna tab bar su modali, barra nera piena in testa", statusBar: "dark", signature: "badge riso rosso ruotato -4°" },
    photography: "flash diretto, ombre dure, texture cemento e carta riso 4%",
    composition: "barra nera → blocchi bordati → totale su fondo nero → CTA acida",
    screens: [
      m("menu", "Menù blocchi", "Scelta rapida burger e birre", ["blocchi bordati", "prezzi mono"]),
      m("cart", "Carrello", "Modifica quantità ed extra", ["stepper quadrati", "checkbox brutalist", "totale"]),
      m("tracking", "Stato ordine", "Tracking ritiro/consegna", ["barra step", "timer mono"]),
      m("loyalty", "Tessera punti", "Fidelity e premi", ["griglia bolli", "codice a barre"]),
    ],
  },
  {
    id: "food-mediterranean", sector: "food", family: "mediterranean-sunlit",
    label: "Mediterranean Sunlit", brand: "Sole di Puglia", tagline: "Mare, orto, forno.",
    palette: { bg: "#FBF7F0", surface: "#FFFFFF", text: "#2B2A26", muted: "#8B8577", accent: "#6E7F4E", accent2: "#D98452" },
    typography: { display: "Serif umanista 34px", body: "Sans morbido 15px", treatment: "iniziali maiuscole, testo arioso" },
    geometry: { radius: "20px", border: "nessuno, ombre soffuse", grid: "card larghe, molto whitespace", density: "airy" },
    chrome: { nav: "tab bar bianca con icone line", statusBar: "dark", signature: "ombra lunga da sole meridiano" },
    photography: "tavola all'aperto, marmo bianco, luce diretta di mezzogiorno, ombre nette di foglie",
    composition: "hero orizzontale → carosello portate → sezione produttori",
    screens: [
      m("home", "Home solare", "Menù del giorno e stagionalità", ["hero luminoso", "carosello", "badge stagione"]),
      m("menu", "Carta", "Menù per stagione", ["card grandi", "filtri stagione"]),
      m("producers", "Produttori", "Filiera e fornitori locali", ["mappa", "schede produttore"]),
      m("delivery", "Consegna", "Indirizzo e slot", ["mappa", "slot orari", "CTA oliva"]),
      d("admin", "Magazzino & menu", "Gestione stagionalità e scorte", ["tabella scorte", "alert", "calendario"]),
    ],
  },
  {
    id: "food-swiss-clinical", sector: "food", family: "swiss-clinical-grid",
    label: "Swiss Clinical Grid", brand: "Verde Protocollo", tagline: "Nutrizione calcolata.",
    palette: { bg: "#FFFFFF", surface: "#F4F5F7", text: "#101114", muted: "#6B7280", accent: "#1F5EFF", accent2: "#111111" },
    typography: { display: "Helvetica-like 26px medium", body: "Sans 14px", treatment: "griglia visibile, numeri protagonisti" },
    geometry: { radius: "6px", border: "1px #E5E7EB", grid: "12 colonne visibili", density: "dense" },
    chrome: { nav: "segmented control in testa + tab bar minimale", statusBar: "dark", signature: "etichette numeriche di riferimento (01 / 02 / 03)" },
    photography: "still life su fondo neutro, luce diffusa, packshot da catalogo",
    composition: "griglia rigorosa → tabelle macro → grafici a barre sottili",
    screens: [
      m("plan", "Piano settimanale", "Programmazione pasti", ["griglia 7 giorni", "chip kcal"]),
      m("dish", "Scheda nutrizionale", "Macro e allergeni", ["tabella macro", "barre", "chip allergeni"]),
      m("order", "Ordine ricorrente", "Abbonamento pasti", ["riepilogo", "toggle ricorrenza"]),
      m("progress", "Andamento", "Storico e obiettivi", ["grafico lineare", "KPI"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* BEAUTY                                                              */
/* ------------------------------------------------------------------ */
const BEAUTY: MockupIdentity[] = [
  {
    id: "beauty-porcelain", sector: "beauty", family: "porcelain-couture",
    label: "Porcelain Couture", brand: "Atelier Unghie", tagline: "Manicure sartoriale.",
    palette: { bg: "#FAF6F4", surface: "#FFFFFF", text: "#1E1A19", muted: "#9C8F8B", accent: "#C9A2A6", accent2: "#8A6A4F" },
    typography: { display: "Didone alto contrasto 40px", body: "Sans sottile 14px", treatment: "spaziature couture, corsivi rari" },
    geometry: { radius: "24px", border: "hairline rosata", grid: "colonna centrata", density: "airy" },
    chrome: { nav: "tab bar bianca minimale", statusBar: "dark", signature: "sigillo circolare inciso" },
    photography: "macro mani, pelle luminosa, fondo porcellana, luce beauty dish",
    composition: "hero ritratto verticale → listino servizi → calendario",
    screens: [
      m("home", "Vetrina", "Servizi in evidenza", ["hero ritratto", "listino breve"]),
      m("services", "Listino", "Servizi e durate", ["righe durata/prezzo"]),
      m("artist", "Scelta operatrice", "Team e specializzazioni", ["avatar", "rating", "specialità"]),
      m("booking", "Appuntamento", "Slot e conferma", ["calendario", "slot", "CTA"]),
      m("wallet", "Tessera cliente", "Abbonamenti e punti", ["card membership", "storico"]),
    ],
  },
  {
    id: "beauty-chrome-y2k", sector: "beauty", family: "chrome-y2k-gloss",
    label: "Chrome Y2K Gloss", brand: "Studio Iride", tagline: "Colore, luce, riflesso.",
    palette: { bg: "#0E0E12", surface: "#1A1A22", text: "#FFFFFF", muted: "#A0A0B0", accent: "#B9C6FF", accent2: "#FF9AD5" },
    typography: { display: "Grotesque wide 32px", body: "Sans 14px", treatment: "gradienti cromati sul testo display" },
    geometry: { radius: "999px su tutto", border: "bordi luminosi 1px", grid: "pillole e blob", density: "balanced" },
    chrome: { nav: "dock a pillola con blur", statusBar: "light", signature: "sfera cromata 3D come marker" },
    photography: "beauty editoriale con riflessi metallici e gel lighting",
    composition: "blob cromati → pillole servizi → galleria look",
    screens: [
      m("home", "Home cromata", "Look del mese", ["blob 3D", "pillole servizi"]),
      m("looks", "Galleria look", "Ispirazioni e prima/dopo", ["griglia masonry", "slider prima/dopo"]),
      m("booking", "Prenota", "Slot e operatrice", ["calendario a pillole"]),
      m("shop", "Prodotti", "Vendita retail in salone", ["card prodotto", "carrello"]),
    ],
  },
  {
    id: "beauty-botanical", sector: "beauty", family: "botanical-apothecary",
    label: "Botanical Apothecary", brand: "Erbaviva Spa", tagline: "Rituali botanici.",
    palette: { bg: "#F2F0E9", surface: "#FFFFFF", text: "#25291F", muted: "#7C8270", accent: "#4F6B3E", accent2: "#B58B4C" },
    typography: { display: "Serif inciso 30px", body: "Sans 14px", treatment: "etichette da farmacia, filetti doppi" },
    geometry: { radius: "4px", border: "cornice doppia", grid: "colonne strette da etichetta", density: "balanced" },
    chrome: { nav: "tab bar con icone botaniche", statusBar: "dark", signature: "illustrazione a tratteggio inciso" },
    photography: "erbe, oli, vetro ambrato, luce laterale morbida",
    composition: "etichetta apotecaria → rituali → percorso spa",
    screens: [
      m("rituals", "Rituali", "Trattamenti per esigenza", ["card etichetta", "durata"]),
      m("detail", "Scheda rituale", "Fasi, oli, benefici", ["timeline fasi", "ingredienti"]),
      m("booking", "Prenota rituale", "Cabina e operatore", ["slot", "cabina"]),
      m("membership", "Abbonamento spa", "Formule mensili", ["piani", "CTA"]),
    ],
  },
  {
    id: "beauty-graphite", sector: "beauty", family: "graphite-atelier",
    label: "Graphite Atelier", brand: "Sezione Aurea Hair", tagline: "Taglio come architettura.",
    palette: { bg: "#1C1C1C", surface: "#262626", text: "#EDEDED", muted: "#9A9A9A", accent: "#D7D2C7", accent2: "#7C6A55" },
    typography: { display: "Sans condensato caps 34px", body: "Sans 13px", treatment: "solo maiuscole, numerazione servizi" },
    geometry: { radius: "2px", border: "1px #3A3A3A", grid: "moduli quadrati", density: "dense" },
    chrome: { nav: "barra laterale a scomparsa + tab minimale", statusBar: "light", signature: "linee di costruzione geometriche" },
    photography: "ritratti b/n contrastati, grana pellicola",
    composition: "griglia di ritratti → listino numerato → agenda",
    screens: [
      m("portfolio", "Portfolio", "Lavori del salone", ["griglia b/n"]),
      m("services", "Listino numerato", "Servizi con codice", ["righe numerate"]),
      m("booking", "Agenda", "Prenotazione rapida", ["agenda verticale"]),
      m("profile", "Scheda cliente", "Storico colore e formule", ["timeline", "formule"]),
    ],
  },
  {
    id: "beauty-pastel-riso", sector: "beauty", family: "pastel-riso-print",
    label: "Pastel Riso Print", brand: "Bolla Beauty Bar", tagline: "Bellezza senza pensieri.",
    palette: { bg: "#FFF4EC", surface: "#FFE3D3", text: "#3A2A2A", muted: "#977A73", accent: "#FF7A59", accent2: "#7ED4C9" },
    typography: { display: "Rounded bold 36px", body: "Rounded 15px", treatment: "sovrastampa riso, offset colore 2px" },
    geometry: { radius: "18px", border: "contorno colorato 2px", grid: "card giocose disallineate", density: "balanced" },
    chrome: { nav: "tab bar rounded colorata", statusBar: "dark", signature: "texture retinata riso" },
    photography: "illustrazioni + foto duotone pesca/menta",
    composition: "card offset → offerte → prenotazione express",
    screens: [
      m("home", "Home", "Offerte e servizi express", ["card offset", "badge sconto"]),
      m("express", "Servizi express", "Slot rapidi 15-30 min", ["chip durata"]),
      m("booking", "Prenota", "Selezione slot", ["calendario colorato"]),
      m("referral", "Porta un'amica", "Programma referral", ["codice", "premi"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* NCC / MOBILITY                                                      */
/* ------------------------------------------------------------------ */
const NCC: MockupIdentity[] = [
  {
    id: "ncc-obsidian", sector: "ncc", family: "obsidian-chauffeur",
    label: "Obsidian Chauffeur", brand: "Linea Nera Milano", tagline: "Trasferimenti riservati.",
    palette: { bg: "#08090B", surface: "#121418", text: "#F5F6F7", muted: "#8B9096", accent: "#C9A227", accent2: "#2E3440" },
    typography: { display: "Serif alto 30px", body: "Sans 14px", treatment: "oro sottile su nero, tracking ampio" },
    geometry: { radius: "10px", border: "1px oro 20%", grid: "card larghe", density: "balanced" },
    chrome: { nav: "tab bar nera con separatore oro", statusBar: "light", signature: "monogramma inciso" },
    photography: "berlina nera notturna, riflessi città, pioggia",
    composition: "hero notturno → tratte → configuratore veicolo",
    screens: [
      m("booking", "Nuovo transfer", "Da/A, data, passeggeri", ["campi indirizzo", "mappa scura"]),
      m("fleet", "Flotta", "Scelta veicolo e classe", ["card veicolo", "capienza"]),
      m("quote", "Preventivo", "Prezzo e condizioni", ["riepilogo", "CTA oro"]),
      m("live", "Corsa in corso", "Tracking autista", ["mappa live", "scheda autista"]),
      d("admin", "Centrale operativa", "Dispatch corse e autisti", ["tabella corse", "mappa flotta", "KPI"]),
    ],
  },
  {
    id: "ncc-aviation", sector: "ncc", family: "aviation-instrument",
    label: "Aviation Instrument", brand: "Aurea Jet", tagline: "Volo privato su richiesta.",
    palette: { bg: "#0A0F14", surface: "#111A22", text: "#E8F1F8", muted: "#7E93A3", accent: "#4FD1C5", accent2: "#F0B429" },
    typography: { display: "Mono tecnico 26px", body: "Mono 13px", treatment: "quadranti, tacche, coordinate" },
    geometry: { radius: "8px", border: "1px reticolo", grid: "strumenti di volo", density: "dense" },
    chrome: { nav: "barra strumenti con indicatori", statusBar: "light", signature: "crosshair e scale graduate" },
    photography: "jet in hangar, luci pista, cielo blue hour",
    composition: "HUD strumenti → rotta → cabina",
    screens: [
      m("route", "Rotta", "Partenza, arrivo, orari", ["mappa rotta", "coordinate"]),
      m("aircraft", "Aeromobile", "Scelta velivolo e cabina", ["scheda tecnica", "posti"]),
      m("catering", "Servizi di bordo", "Catering e richieste", ["lista opzioni"]),
      m("manifest", "Manifesto passeggeri", "Dati e documenti", ["form", "upload"]),
      d("ops", "Operations", "Slot, equipaggi, permessi", ["gantt", "tabella slot"]),
    ],
  },
  {
    id: "ncc-ivory", sector: "ncc", family: "ivory-concierge",
    label: "Ivory Concierge", brand: "Cortesia Transfer", tagline: "Servizio su misura.",
    palette: { bg: "#FBFAF7", surface: "#FFFFFF", text: "#1B1B1B", muted: "#8C8A85", accent: "#2F4F4F", accent2: "#B08D57" },
    typography: { display: "Serif chiaro 32px", body: "Sans 15px", treatment: "eleganza chiara, molta aria" },
    geometry: { radius: "16px", border: "ombra tenue", grid: "colonna singola", density: "airy" },
    chrome: { nav: "tab bar avorio", statusBar: "dark", signature: "filetto verticale ottone" },
    photography: "interni auto in pelle chiara, luce giorno morbida",
    composition: "hero chiaro → servizi concierge → assistenza",
    screens: [
      m("home", "Servizi", "Transfer, disposizione, eventi", ["3 card servizio"]),
      m("booking", "Richiesta", "Form guidato", ["step form"]),
      m("concierge", "Concierge", "Chat assistenza dedicata", ["chat", "risposte rapide"]),
      m("history", "Storico corse", "Ricevute e ripeti corsa", ["lista", "PDF"]),
    ],
  },
  {
    id: "ncc-carbon", sector: "ncc", family: "carbon-motorsport",
    label: "Carbon Motorsport", brand: "Apice Rent Performance", tagline: "Noleggio ad alte prestazioni.",
    palette: { bg: "#101012", surface: "#18181B", text: "#FAFAFA", muted: "#8E8E93", accent: "#FF2D2D", accent2: "#C0C0C0" },
    typography: { display: "Italic condensato caps 34px", body: "Sans 13px", treatment: "diagonali, numeri gara" },
    geometry: { radius: "4px con smussi", border: "trama carbonio", grid: "moduli inclinati", density: "dense" },
    chrome: { nav: "tab bar scura con accento rosso", statusBar: "light", signature: "banda diagonale da livrea" },
    photography: "supercar in studio buio, riflessi lunghi, pneumatico dettaglio",
    composition: "scheda tecnica → configuratore → contratto",
    screens: [
      m("fleet", "Flotta", "Modelli disponibili", ["card auto", "0-100", "cv"]),
      m("config", "Configura", "Giorni, km, extra", ["slider km", "toggle extra"]),
      m("contract", "Contratto", "Firma e cauzione", ["riepilogo", "firma"]),
      m("checkin", "Check-in veicolo", "Foto stato e chilometri", ["griglia foto", "campo km"]),
    ],
  },
  {
    id: "ncc-artdeco", sector: "ncc", family: "art-deco-transit",
    label: "Art Déco Transit", brand: "Vettura Regia", tagline: "Auto d'epoca per cerimonie.",
    palette: { bg: "#141B1A", surface: "#1D2726", text: "#F3EAD8", muted: "#9AA6A2", accent: "#D4AF37", accent2: "#7A2E2E" },
    typography: { display: "Display déco caps 30px", body: "Serif 14px", treatment: "cornici geometriche a raggiera" },
    geometry: { radius: "0px con angoli smussati", border: "doppio filetto oro", grid: "simmetria assoluta", density: "balanced" },
    chrome: { nav: "tab bar con cornice déco", statusBar: "light", signature: "ventaglio geometrico" },
    photography: "auto d'epoca, chiesa, luce dorata pomeridiana",
    composition: "cornice → pacchetti cerimonia → galleria",
    screens: [
      m("packages", "Pacchetti cerimonia", "Matrimoni ed eventi", ["card cornice", "prezzo"]),
      m("gallery", "Galleria", "Vetture storiche", ["carosello", "scheda modello"]),
      m("booking", "Richiedi data", "Disponibilità evento", ["calendario", "form"]),
      m("addons", "Allestimenti", "Fiori, nastri, autista in livrea", ["checklist"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* FITNESS                                                             */
/* ------------------------------------------------------------------ */
const FITNESS: MockupIdentity[] = [
  {
    id: "fitness-acid", sector: "fitness", family: "acid-performance",
    label: "Acid Performance", brand: "Reparto Forza", tagline: "Allenamento misurato.",
    palette: { bg: "#0C0D0F", surface: "#16181C", text: "#FFFFFF", muted: "#8A8F98", accent: "#D6FF3F", accent2: "#FF4D00" },
    typography: { display: "Extended bold caps 36px", body: "Sans 14px", treatment: "numeri giganti, unità piccole" },
    geometry: { radius: "12px", border: "nessuno, blocchi pieni", grid: "bento performance", density: "dense" },
    chrome: { nav: "tab bar scura con FAB centrale", statusBar: "light", signature: "barra di carico acida" },
    photography: "palestra industriale, sudore, luce dura al neon",
    composition: "bento KPI → scheda esercizi → timer",
    screens: [
      m("dashboard", "Dashboard", "Volume, PR, streak", ["bento KPI", "grafico"]),
      m("workout", "Scheda del giorno", "Esercizi, serie, carichi", ["lista esercizi", "stepper carico"]),
      m("timer", "Timer set", "Recupero e cronometro", ["cerchio timer", "controlli"]),
      m("progress", "Progressi", "Storico carichi e misure", ["grafici", "tabella PR"]),
      d("coach", "Area coach", "Schede e atleti", ["tabella atleti", "editor scheda"]),
    ],
  },
  {
    id: "fitness-monastic", sector: "fitness", family: "monastic-recovery",
    label: "Monastic Recovery", brand: "Silenzio Studio", tagline: "Mobilità e respiro.",
    palette: { bg: "#EDEAE4", surface: "#FFFFFF", text: "#232320", muted: "#8B887F", accent: "#5B6E5A", accent2: "#C7B9A5" },
    typography: { display: "Serif leggero 30px", body: "Sans 15px", treatment: "molto whitespace, testi brevi" },
    geometry: { radius: "28px", border: "nessuno", grid: "una card per volta", density: "airy" },
    chrome: { nav: "navigazione a punti (dots)", statusBar: "dark", signature: "cerchio del respiro" },
    photography: "corpi in luce naturale, legno, lino, nebbia soffusa",
    composition: "cerchio centrale → sessione → diario",
    screens: [
      m("today", "Oggi", "Sessione consigliata", ["cerchio respiro", "durata"]),
      m("session", "Sessione", "Sequenza guidata", ["step", "timer soft"]),
      m("journal", "Diario", "Sensazioni e recupero", ["slider umore", "note"]),
      m("classes", "Calendario classi", "Prenotazione lezioni", ["lista giorni"]),
    ],
  },
  {
    id: "fitness-tactical", sector: "fitness", family: "tactical-hud",
    label: "Tactical HUD", brand: "Squadra Padel Torino", tagline: "Campi, match, ranking.",
    palette: { bg: "#0B1220", surface: "#121C2E", text: "#E6EEF8", muted: "#7C90A8", accent: "#00E5A0", accent2: "#FFB020" },
    typography: { display: "Mono caps 28px", body: "Mono 13px", treatment: "HUD, reticoli, coordinate campo" },
    geometry: { radius: "6px", border: "1px #22304A", grid: "campi e slot", density: "dense" },
    chrome: { nav: "top tabs + bottom bar", statusBar: "light", signature: "mirino angolare sugli slot" },
    photography: "campo padel dall'alto, luci notturne, vetri riflessi",
    composition: "griglia campi → slot → tabellone ranking",
    screens: [
      m("courts", "Campi", "Disponibilità in tempo reale", ["griglia campi", "stato"]),
      m("slots", "Prenota slot", "Orari e durata", ["timeline oraria"]),
      m("match", "Match", "Punteggio e giocatori", ["scoreboard", "avatar"]),
      m("ranking", "Classifica", "Ranking del club", ["tabella", "delta posizione"]),
      d("club", "Gestione club", "Campi, tornei, abbonamenti", ["calendario campi", "KPI"]),
    ],
  },
  {
    id: "fitness-sunrise", sector: "fitness", family: "sunrise-gradient-flow",
    label: "Sunrise Gradient Flow", brand: "Alba Running Club", tagline: "Corri con la città.",
    palette: { bg: "#FFF6F0", surface: "#FFFFFF", text: "#26201E", muted: "#8E7F79", accent: "#FF7A45", accent2: "#8B5CF6" },
    typography: { display: "Sans rounded bold 34px", body: "Sans 15px", treatment: "gradienti caldi su numeri" },
    geometry: { radius: "22px", border: "nessuno, ombre calde", grid: "card impilate", density: "balanced" },
    chrome: { nav: "tab bar chiara con pill attiva", statusBar: "dark", signature: "arco gradiente all'alba" },
    photography: "runner all'alba, città deserta, lens flare caldo",
    composition: "arco gradiente → allenamento → community",
    screens: [
      m("home", "Home", "Prossima uscita di gruppo", ["card evento", "meteo"]),
      m("run", "Corsa live", "Passo, distanza, mappa", ["mappa", "metriche"]),
      m("plan", "Piano gara", "Tabella settimanale", ["calendario", "obiettivo"]),
      m("community", "Community", "Classifiche e sfide", ["leaderboard", "badge"]),
    ],
  },
  {
    id: "fitness-scoreboard", sector: "fitness", family: "typographic-scoreboard",
    label: "Typographic Scoreboard", brand: "Boxe Popolare", tagline: "Round dopo round.",
    palette: { bg: "#141414", surface: "#1F1F1F", text: "#FFFFFF", muted: "#9B9B9B", accent: "#E63946", accent2: "#F1FAEE" },
    typography: { display: "Numerali display giganti 72px", body: "Condensed caps 13px", treatment: "tipografia come immagine" },
    geometry: { radius: "0px", border: "linee spesse orizzontali", grid: "righe da tabellone", density: "balanced" },
    chrome: { nav: "barra inferiore a righe", statusBar: "light", signature: "conteggio round tipografico" },
    photography: "palestra boxe, corde, b/n ad alto contrasto",
    composition: "numero gigante → round → tesseramento",
    screens: [
      m("rounds", "Round", "Programma allenamento", ["numeri giganti", "durata"]),
      m("schedule", "Corsi", "Orari settimanali", ["griglia orari"]),
      m("card", "Tessera", "Abbonamento e ingressi", ["contatore ingressi"]),
      m("coach", "Maestri", "Team tecnico", ["ritratti b/n"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* HOSPITALITY                                                         */
/* ------------------------------------------------------------------ */
const HOSPITALITY: MockupIdentity[] = [
  {
    id: "hosp-coastal", sector: "hospitality", family: "coastal-linen",
    label: "Coastal Linen", brand: "Casa Salmastra", tagline: "Camere sul mare.",
    palette: { bg: "#F7F5F0", surface: "#FFFFFF", text: "#21282B", muted: "#8A9499", accent: "#3E6C7A", accent2: "#E4D9C6" },
    typography: { display: "Serif chiaro 34px", body: "Sans 15px", treatment: "testi corti, molta aria salina" },
    geometry: { radius: "18px", border: "nessuno", grid: "card orizzontali", density: "airy" },
    chrome: { nav: "tab bar chiara", statusBar: "dark", signature: "linea d'onda sottile" },
    photography: "camere con tende mosse dal vento, mare, lino",
    composition: "hero mare → camere → esperienze",
    screens: [
      m("rooms", "Camere", "Tipologie e disponibilità", ["card camera", "prezzo/notte"]),
      m("detail", "Scheda camera", "Servizi e foto", ["galleria", "lista servizi"]),
      m("booking", "Prenota", "Date e ospiti", ["calendario", "stepper ospiti"]),
      m("experiences", "Esperienze", "Barca, spiaggia, escursioni", ["card esperienza"]),
      d("pms", "Front office", "Arrivi, partenze, tariffe", ["tape chart", "KPI occupazione"]),
    ],
  },
  {
    id: "hosp-alpine", sector: "hospitality", family: "alpine-timber",
    label: "Alpine Timber", brand: "Rifugio Larice", tagline: "Montagna, fuoco, silenzio.",
    palette: { bg: "#1A1614", surface: "#241E1A", text: "#F0E9E2", muted: "#A2958A", accent: "#C46A28", accent2: "#5E7247" },
    typography: { display: "Slab 30px", body: "Sans 14px", treatment: "texture legno, intagli" },
    geometry: { radius: "8px", border: "1px legno scuro", grid: "card verticali", density: "balanced" },
    chrome: { nav: "tab bar legno", statusBar: "light", signature: "venatura incisa" },
    photography: "baita, neve, fuoco acceso, luce calda serale",
    composition: "hero neve → camere → ristorante rifugio",
    screens: [
      m("home", "Rifugio", "Stagione e disponibilità", ["hero neve", "meteo"]),
      m("rooms", "Stanze", "Camere e mezza pensione", ["card", "formula"]),
      m("dining", "Cucina", "Menù di montagna", ["listino"]),
      m("activities", "Attività", "Ciaspole, sci, guide", ["card attività"]),
    ],
  },
  {
    id: "hosp-grand", sector: "hospitality", family: "grand-hotel-classic",
    label: "Grand Hotel Classic", brand: "Palazzo Ottocento", tagline: "Ospitalità storica.",
    palette: { bg: "#0F1418", surface: "#18202A", text: "#F4EFE6", muted: "#9AA3AD", accent: "#B99A5B", accent2: "#8C2F39" },
    typography: { display: "Serif classico 32px", body: "Serif 14px", treatment: "capolettera, filetti oro" },
    geometry: { radius: "6px", border: "cornice oro sottile", grid: "simmetrico", density: "balanced" },
    chrome: { nav: "tab bar scura con emblema", statusBar: "light", signature: "stemma araldico" },
    photography: "hall storica, marmi, lampadari, luce calda",
    composition: "stemma → suite → servizi concierge",
    screens: [
      m("suites", "Suite", "Categorie e tariffe", ["card suite"]),
      m("concierge", "Concierge", "Richieste ospite", ["chat", "servizi"]),
      m("spa", "Spa & benessere", "Trattamenti hotel", ["listino spa"]),
      m("checkin", "Check-in digitale", "Documenti e chiave", ["form", "chiave digitale"]),
      d("admin", "Direzione", "Occupazione e revenue", ["dashboard revenue"]),
    ],
  },
  {
    id: "hosp-desert", sector: "hospitality", family: "desert-adobe",
    label: "Desert Adobe", brand: "Masseria Terra Rossa", tagline: "Terra, calce, ulivi.",
    palette: { bg: "#F3E9DE", surface: "#FFFFFF", text: "#3A2C22", muted: "#96826F", accent: "#B4552D", accent2: "#6F7A4F" },
    typography: { display: "Serif rustico 32px", body: "Sans 15px", treatment: "forme arcuate, archi come cornici" },
    geometry: { radius: "arco superiore 50%", border: "nessuno", grid: "card ad arco", density: "airy" },
    chrome: { nav: "tab bar terracotta", statusBar: "dark", signature: "arco a tutto sesto" },
    photography: "masseria bianca, ulivi, ombre nette del sud",
    composition: "archi → camere → degustazioni",
    screens: [
      m("home", "Masseria", "Presentazione e stagione", ["hero ad arco"]),
      m("rooms", "Camere", "Suite in pietra", ["card arco"]),
      m("tasting", "Degustazioni", "Olio e vino", ["card evento"]),
      m("booking", "Prenota soggiorno", "Date e pacchetti", ["calendario"]),
    ],
  },
  {
    id: "hosp-nocturne", sector: "hospitality", family: "nocturne-jazz-lounge",
    label: "Nocturne Jazz Lounge", brand: "Sala Blu", tagline: "Cocktail e musica dal vivo.",
    palette: { bg: "#0A0A14", surface: "#141428", text: "#F0EEF8", muted: "#8B88A8", accent: "#5B7CFA", accent2: "#E2B979" },
    typography: { display: "Serif italico 34px", body: "Sans 14px", treatment: "insegne al neon, alone luminoso" },
    geometry: { radius: "16px", border: "glow interno", grid: "card sovrapposte", density: "balanced" },
    chrome: { nav: "tab bar notturna con glow", statusBar: "light", signature: "alone neon blu" },
    photography: "locale in penombra, sassofono, bicchieri controluce",
    composition: "neon → programma serate → tavoli",
    screens: [
      m("tonight", "Stasera", "Programma live", ["card artista", "orario"]),
      m("tables", "Tavoli", "Mappa sala e prenotazione", ["mappa tavoli"]),
      m("drinks", "Drink list", "Signature cocktail", ["listino"]),
      m("membership", "Club", "Tessera soci", ["card socio"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* REAL ESTATE                                                         */
/* ------------------------------------------------------------------ */
const REALESTATE: MockupIdentity[] = [
  {
    id: "re-blueprint", sector: "realestate", family: "blueprint-architectural",
    label: "Blueprint Architectural", brand: "Studio Perimetro", tagline: "Progetti e immobili su misura.",
    palette: { bg: "#0E1A2B", surface: "#15263C", text: "#E8F0FA", muted: "#8FA6C0", accent: "#67E8F9", accent2: "#F5F5F5" },
    typography: { display: "Mono tecnico 26px", body: "Mono 13px", treatment: "quote, misure, linee di costruzione" },
    geometry: { radius: "2px", border: "reticolo blueprint", grid: "assi e quote", density: "dense" },
    chrome: { nav: "barra strumenti tecnica", statusBar: "light", signature: "quote dimensionali sui box" },
    photography: "render architettonici, piante, assonometrie",
    composition: "planimetria → schede unità → appuntamento",
    screens: [
      m("plan", "Planimetria", "Esplora unità sul piano", ["pianta interattiva", "quote"]),
      m("unit", "Scheda unità", "Metratura, esposizione, prezzo", ["dati tecnici", "render"]),
      m("compare", "Confronto", "Confronta due unità", ["tabella comparativa"]),
      m("visit", "Prenota visita", "Agenda sopralluogo", ["calendario"]),
      d("crm", "CRM immobiliare", "Lead e trattative", ["pipeline", "tabella lead"]),
    ],
  },
  {
    id: "re-whitecube", sector: "realestate", family: "gallery-white-cube",
    label: "Gallery White Cube", brand: "Dimora Contemporanea", tagline: "Case come opere.",
    palette: { bg: "#FFFFFF", surface: "#F7F7F7", text: "#111111", muted: "#767676", accent: "#111111", accent2: "#C9A227" },
    typography: { display: "Sans neutro 30px", body: "Sans 14px", treatment: "didascalie da museo, numerazione opere" },
    geometry: { radius: "0px", border: "nessuno", grid: "immagini isolate su bianco", density: "airy" },
    chrome: { nav: "menu testuale in alto", statusBar: "dark", signature: "didascalia sotto immagine" },
    photography: "interni minimal, luce naturale, prospettive centrate",
    composition: "immagine isolata → didascalia → dettaglio",
    screens: [
      m("collection", "Collezione", "Immobili selezionati", ["griglia immagini", "didascalie"]),
      m("property", "Scheda immobile", "Foto e dati essenziali", ["foto grande", "dati minimi"]),
      m("tour", "Tour virtuale", "Percorso stanze", ["viewer", "hotspot"]),
      m("contact", "Richiesta info", "Contatto agente", ["form minimale"]),
    ],
  },
  {
    id: "re-tuscan", sector: "realestate", family: "terracotta-tuscan",
    label: "Terracotta Tuscan", brand: "Poderi & Casali", tagline: "Casali e terreni.",
    palette: { bg: "#F5EFE4", surface: "#FFFFFF", text: "#33291F", muted: "#8E7C66", accent: "#A8562E", accent2: "#6B7A4B" },
    typography: { display: "Serif toscano 32px", body: "Serif 14px", treatment: "cornici a mattonella" },
    geometry: { radius: "10px", border: "1px terracotta", grid: "card foto+testo", density: "balanced" },
    chrome: { nav: "tab bar calda", statusBar: "dark", signature: "motivo a mattonella" },
    photography: "colline, casali in pietra, cipressi, luce dorata",
    composition: "paesaggio → proprietà → terreni",
    screens: [
      m("home", "Proprietà", "Casali in evidenza", ["card foto", "ettari"]),
      m("property", "Scheda", "Vani, ettari, annessi", ["dati", "mappa catastale"]),
      m("land", "Terreni", "Superfici e colture", ["tabella", "mappa"]),
      m("visit", "Sopralluogo", "Richiesta visita", ["form", "calendario"]),
    ],
  },
  {
    id: "re-glasstower", sector: "realestate", family: "glass-tower-metropolitan",
    label: "Glass Tower Metropolitan", brand: "Verticale Milano", tagline: "Uffici e residenze in torre.",
    palette: { bg: "#0C0E11", surface: "#151A20", text: "#F2F5F8", muted: "#8A939E", accent: "#8FD3FE", accent2: "#D9E2EC" },
    typography: { display: "Sans wide 30px", body: "Sans 14px", treatment: "vetro, riflessi, trasparenze" },
    geometry: { radius: "12px", border: "glass 1px", grid: "pannelli sovrapposti", density: "balanced" },
    chrome: { nav: "tab bar in vetro", statusBar: "light", signature: "riflesso diagonale" },
    photography: "skyline notturno, facciate a specchio, blue hour",
    composition: "torre → piani → servizi condominiali",
    screens: [
      m("tower", "Torre", "Selezione piano", ["sezione torre interattiva"]),
      m("floor", "Piano", "Unità sul piano", ["pianta", "stato unità"]),
      m("amenities", "Servizi", "Palestra, lounge, coworking", ["card servizi"]),
      m("lease", "Proposta", "Canone e condizioni", ["riepilogo", "CTA"]),
      d("asset", "Asset management", "Occupancy e contratti", ["tabella contratti", "grafici"]),
    ],
  },
  {
    id: "re-cadastral", sector: "realestate", family: "cadastral-map-mono",
    label: "Cadastral Map Mono", brand: "Catasto Vivo", tagline: "Investimenti immobiliari dati alla mano.",
    palette: { bg: "#FBFBF9", surface: "#FFFFFF", text: "#1A1A1A", muted: "#707070", accent: "#0F5132", accent2: "#B23A48" },
    typography: { display: "Mono 24px", body: "Mono 12px", treatment: "mappe, retini, legende" },
    geometry: { radius: "2px", border: "1px nero sottile", grid: "tabelle e mappe", density: "dense" },
    chrome: { nav: "barra filtri persistente", statusBar: "dark", signature: "legenda con retini" },
    photography: "nessuna foto: mappe, retini, diagrammi",
    composition: "mappa → tabella rendimenti → simulatore",
    screens: [
      m("map", "Mappa", "Zone e valori al mq", ["mappa retinata", "legenda"]),
      m("yields", "Rendimenti", "Tabella ROI per zona", ["tabella densa"]),
      m("simulator", "Simulatore", "Mutuo e cash flow", ["slider", "grafico"]),
      m("watchlist", "Watchlist", "Immobili monitorati", ["lista", "alert prezzo"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* HEALTHCARE                                                          */
/* ------------------------------------------------------------------ */
const HEALTHCARE: MockupIdentity[] = [
  {
    id: "hc-mint", sector: "healthcare", family: "sterile-mint-clinic",
    label: "Sterile Mint Clinic", brand: "Poliambulatorio Sereno", tagline: "Visite senza attese.",
    palette: { bg: "#F4FAF8", surface: "#FFFFFF", text: "#0F1F1C", muted: "#6E8B85", accent: "#12A594", accent2: "#0B5D52" },
    typography: { display: "Sans 28px medium", body: "Sans 15px", treatment: "chiarezza assoluta, testi leggibili" },
    geometry: { radius: "14px", border: "1px #DCEDE9", grid: "liste chiare", density: "balanced" },
    chrome: { nav: "tab bar bianca 5 voci", statusBar: "dark", signature: "icona a croce arrotondata" },
    photography: "ambulatori luminosi, personale sorridente, luce diffusa",
    composition: "specialità → medico → prenotazione",
    screens: [
      m("specialties", "Specialità", "Scelta branca medica", ["griglia icone"]),
      m("doctor", "Medico", "Curriculum e disponibilità", ["scheda medico", "slot"]),
      m("booking", "Prenotazione", "Data, sede, impegnativa", ["calendario", "upload"]),
      m("reports", "Referti", "Download esiti", ["lista referti", "PDF"]),
      d("agenda", "Agenda clinica", "Ambulatori e sale", ["calendario multi-risorsa"]),
    ],
  },
  {
    id: "hc-neumorphic", sector: "healthcare", family: "soft-neumorphic-care",
    label: "Soft Neumorphic Care", brand: "Sorriso Studio Dentistico", tagline: "Cure delicate.",
    palette: { bg: "#EEF1F6", surface: "#EEF1F6", text: "#242A35", muted: "#7D8697", accent: "#5B8DEF", accent2: "#FFB4A2" },
    typography: { display: "Rounded 30px", body: "Rounded 15px", treatment: "morbidezza, nessun bordo netto" },
    geometry: { radius: "26px", border: "ombre doppie soft", grid: "card estruse", density: "airy" },
    chrome: { nav: "dock estruso", statusBar: "dark", signature: "rilievo neumorfico" },
    photography: "dettagli sorriso, strumenti puliti, luce alta chiave",
    composition: "card estruse → piano cure → pagamenti",
    screens: [
      m("home", "Home", "Prossimo appuntamento", ["card estrusa", "countdown"]),
      m("plan", "Piano di cura", "Fasi e preventivo", ["timeline", "totale"]),
      m("booking", "Appuntamento", "Slot studio", ["calendario soft"]),
      m("payments", "Pagamenti", "Rate e ricevute", ["lista rate"]),
    ],
  },
  {
    id: "hc-navy", sector: "healthcare", family: "deep-navy-diagnostic",
    label: "Deep Navy Diagnostic", brand: "Centro Imaging Nord", tagline: "Diagnostica avanzata.",
    palette: { bg: "#0A1220", surface: "#121C2E", text: "#E9F0FA", muted: "#8497B0", accent: "#3B82F6", accent2: "#22D3EE" },
    typography: { display: "Sans tecnico 26px", body: "Sans 13px", treatment: "dati clinici, scale, valori" },
    geometry: { radius: "8px", border: "1px #1E2C44", grid: "pannelli dati", density: "dense" },
    chrome: { nav: "tab bar scura + filtri", statusBar: "light", signature: "scala di grigi diagnostica" },
    photography: "risonanza, sala macchine, luci fredde",
    composition: "pannelli dati → esame → risultati",
    screens: [
      m("exams", "Esami", "Catalogo prestazioni", ["lista esami", "tempi"]),
      m("prep", "Preparazione", "Istruzioni pre-esame", ["checklist"]),
      m("results", "Risultati", "Immagini e referto", ["viewer", "referto"]),
      m("history", "Storico", "Confronto esami", ["timeline", "confronto"]),
      d("radiology", "Workstation", "Coda refertazione", ["lista studi", "viewer"]),
    ],
  },
  {
    id: "hc-paperchart", sector: "healthcare", family: "paper-chart-analog",
    label: "Paper Chart Analog", brand: "Medicina di Famiglia Rota", tagline: "Il tuo medico, sempre.",
    palette: { bg: "#FCFBF7", surface: "#FFFFFF", text: "#1F1E1B", muted: "#7E7A70", accent: "#2F6F4E", accent2: "#C2452D" },
    typography: { display: "Serif 28px", body: "Sans 15px", treatment: "cartella clinica, campi e timbri" },
    geometry: { radius: "3px", border: "1px grigio cartella", grid: "moduli e campi", density: "dense" },
    chrome: { nav: "linguette da cartella", statusBar: "dark", signature: "timbro e firma" },
    photography: "poche foto, moduli e schede",
    composition: "linguette → moduli → ricette",
    screens: [
      m("chart", "Cartella", "Anamnesi e terapie", ["campi modulo", "linguette"]),
      m("prescriptions", "Ricette", "Richiesta ripetibile", ["lista farmaci", "CTA"]),
      m("messages", "Messaggi", "Contatto ambulatorio", ["thread"]),
      m("booking", "Visita", "Slot ambulatorio", ["agenda semplice"]),
    ],
  },
  {
    id: "hc-humanwarm", sector: "healthcare", family: "human-warm-gradient",
    label: "Human Warm Gradient", brand: "Nido Psicologia", tagline: "Supporto psicologico online.",
    palette: { bg: "#FFF8F4", surface: "#FFFFFF", text: "#2A2320", muted: "#8B7B74", accent: "#E8785A", accent2: "#7A9E7E" },
    typography: { display: "Serif morbido 30px", body: "Sans 15px", treatment: "tono empatico, testi brevi" },
    geometry: { radius: "24px", border: "nessuno", grid: "flusso conversazionale", density: "airy" },
    chrome: { nav: "tab bar 4 voci calda", statusBar: "dark", signature: "gradiente pesca radiale" },
    photography: "ritratti empatici, luce calda, sfondi sfocati",
    composition: "gradiente → terapeuti → sessione video",
    screens: [
      m("match", "Trova terapeuta", "Questionario di abbinamento", ["domande", "progress"]),
      m("therapist", "Profilo", "Approccio e disponibilità", ["scheda", "video intro"]),
      m("session", "Sessione", "Videochiamata e note", ["video", "note"]),
      m("journal", "Diario", "Umore e obiettivi", ["slider umore", "grafico"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* LEGAL                                                               */
/* ------------------------------------------------------------------ */
const LEGAL: MockupIdentity[] = [
  {
    id: "legal-oxblood", sector: "legal", family: "chancery-oxblood",
    label: "Chancery Oxblood", brand: "Studio Legale Marchesi", tagline: "Diritto civile e d'impresa.",
    palette: { bg: "#14100F", surface: "#1E1817", text: "#F1EBE4", muted: "#A2948B", accent: "#7B2E33", accent2: "#C6A664" },
    typography: { display: "Serif inciso 30px", body: "Serif 14px", treatment: "capolettera, filetti, numerazione romana" },
    geometry: { radius: "4px", border: "doppio filetto", grid: "colonne da atto", density: "balanced" },
    chrome: { nav: "tab bar scura sobria", statusBar: "light", signature: "sigillo in ceralacca" },
    photography: "libreria giuridica, penna, scrivania in noce",
    composition: "sigillo → aree di pratica → pratiche",
    screens: [
      m("areas", "Aree di pratica", "Competenze studio", ["lista numerata"]),
      m("case", "Pratica", "Stato e scadenze", ["timeline", "scadenzario"]),
      m("documents", "Documenti", "Atti e allegati", ["lista file", "upload"]),
      m("appointment", "Appuntamento", "Consulenza in studio o video", ["calendario"]),
      d("dashboard", "Gestionale", "Pratiche, ore, fatturato", ["tabella pratiche", "timesheet"]),
    ],
  },
  {
    id: "legal-marble", sector: "legal", family: "marble-classical",
    label: "Marble Classical", brand: "Notaio Bertani", tagline: "Atti e successioni.",
    palette: { bg: "#F7F6F3", surface: "#FFFFFF", text: "#1C1C1A", muted: "#84827B", accent: "#3C4C3E", accent2: "#A9A296" },
    typography: { display: "Serif classico 32px", body: "Serif 15px", treatment: "simmetria, texture marmo tenue" },
    geometry: { radius: "0px", border: "filetto grigio", grid: "centrato simmetrico", density: "airy" },
    chrome: { nav: "menu testuale centrato", statusBar: "dark", signature: "capitello stilizzato" },
    photography: "marmo, colonne, luce zenitale",
    composition: "colonna centrale → servizi → preventivo",
    screens: [
      m("services", "Servizi", "Atti, compravendite, successioni", ["lista servizi"]),
      m("quote", "Preventivo", "Calcolo costi e imposte", ["form", "totale"]),
      m("checklist", "Documenti richiesti", "Checklist per l'atto", ["checklist"]),
      m("appointment", "Appuntamento", "Firma e stipula", ["calendario"]),
    ],
  },
  {
    id: "legal-rawmono", sector: "legal", family: "raw-legal-mono",
    label: "Raw Legal Mono", brand: "Difesa Digitale", tagline: "Privacy, GDPR, cybercrime.",
    palette: { bg: "#0D0D0D", surface: "#161616", text: "#E7E7E7", muted: "#8E8E8E", accent: "#37FF8B", accent2: "#FF4D4D" },
    typography: { display: "Mono caps 26px", body: "Mono 13px", treatment: "terminale, redazioni nere sul testo" },
    geometry: { radius: "0px", border: "1px #2A2A2A", grid: "blocchi codice", density: "dense" },
    chrome: { nav: "barra comandi", statusBar: "light", signature: "barre di redazione (censura)" },
    photography: "nessuna foto: testo, log, diagrammi",
    composition: "terminale → audit → incidente",
    screens: [
      m("audit", "Audit privacy", "Stato conformità", ["checklist", "score"]),
      m("incident", "Segnala incidente", "Data breach 72h", ["form", "timer"]),
      m("registry", "Registro trattamenti", "Elenco e finalità", ["tabella"]),
      m("advice", "Consulenza", "Richiesta parere", ["form", "allegati"]),
    ],
  },
  {
    id: "legal-pinstripe", sector: "legal", family: "navy-pinstripe-corporate",
    label: "Navy Pinstripe Corporate", brand: "Fiducia Commercialisti", tagline: "Fisco e impresa.",
    palette: { bg: "#0F1626", surface: "#182136", text: "#EAF0FA", muted: "#8B9AB4", accent: "#4C7DF0", accent2: "#D7B26D" },
    typography: { display: "Sans 28px semibold", body: "Sans 14px", treatment: "righe gessate sottili di sfondo" },
    geometry: { radius: "10px", border: "1px #22304A", grid: "dashboard finanziaria", density: "dense" },
    chrome: { nav: "tab bar + segmented", statusBar: "light", signature: "pinstripe verticale 4px" },
    photography: "uffici, grafici stampati, penna e report",
    composition: "KPI fiscali → scadenze → documenti",
    screens: [
      m("dashboard", "Situazione", "Imposte e liquidità", ["KPI", "grafico"]),
      m("deadlines", "Scadenze", "Calendario fiscale", ["lista scadenze", "alert"]),
      m("invoices", "Fatture", "Ciclo attivo e passivo", ["tabella", "stato"]),
      m("chat", "Consulente", "Chat con lo studio", ["thread"]),
      d("firm", "Studio", "Clienti e adempimenti", ["tabella clienti", "stato pratiche"]),
    ],
  },
  {
    id: "legal-parchment", sector: "legal", family: "quiet-luxury-parchment",
    label: "Quiet Luxury Parchment", brand: "Patrimoni & Eredità", tagline: "Passaggi generazionali.",
    palette: { bg: "#F3EEE5", surface: "#FFFDF9", text: "#241F1A", muted: "#8B8073", accent: "#5E4B32", accent2: "#93A08A" },
    typography: { display: "Serif old-style 30px", body: "Serif 15px", treatment: "carta vergata, inchiostro seppia" },
    geometry: { radius: "6px", border: "hairline seppia", grid: "colonna narrativa", density: "airy" },
    chrome: { nav: "navigazione discreta a testo", statusBar: "dark", signature: "filigrana in carta" },
    photography: "documenti antichi, mani, luce di lampada",
    composition: "carta → patrimonio → pianificazione",
    screens: [
      m("overview", "Patrimonio", "Quadro d'insieme", ["schema asset"]),
      m("plan", "Pianificazione", "Scenari successori", ["albero famiglia"]),
      m("documents", "Documenti", "Testamenti e atti", ["archivio"]),
      m("meeting", "Incontro", "Appuntamento riservato", ["calendario"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* RETAIL                                                              */
/* ------------------------------------------------------------------ */
const RETAIL: MockupIdentity[] = [
  {
    id: "retail-hypercolor", sector: "retail", family: "hyper-color-pop",
    label: "Hyper Color Pop", brand: "Sneaker Vertigo", tagline: "Drop settimanali.",
    palette: { bg: "#FFFFFF", surface: "#F2F2F2", text: "#0A0A0A", muted: "#6B6B6B", accent: "#FF3D00", accent2: "#0047FF" },
    typography: { display: "Grotesque bold 40px", body: "Sans 14px", treatment: "titoli a bandiera, colori pieni" },
    geometry: { radius: "8px", border: "nessuno", grid: "griglia prodotti 2 col", density: "balanced" },
    chrome: { nav: "tab bar bianca con badge carrello", statusBar: "dark", signature: "countdown drop" },
    photography: "packshot su fondo colore pieno, ombre nette",
    composition: "countdown → griglia → scheda prodotto",
    screens: [
      m("drop", "Drop", "Lancio a tempo", ["countdown", "hero prodotto"]),
      m("catalog", "Catalogo", "Filtri taglia e modello", ["griglia", "filtri"]),
      m("product", "Prodotto", "Taglie e disponibilità", ["galleria", "selettore taglia"]),
      m("cart", "Carrello", "Riepilogo e spedizione", ["lista", "totale"]),
      d("stock", "Magazzino", "Giacenze e riordini", ["tabella stock", "alert"]),
    ],
  },
  {
    id: "retail-monochrome", sector: "retail", family: "monochrome-boutique",
    label: "Monochrome Boutique", brand: "Filo Nero", tagline: "Capi essenziali.",
    palette: { bg: "#0F0F0F", surface: "#181818", text: "#F5F5F5", muted: "#8C8C8C", accent: "#F5F5F5", accent2: "#8C8C8C" },
    typography: { display: "Sans light 32px tracking ampio", body: "Sans 13px", treatment: "solo bianco/nero, nessun colore" },
    geometry: { radius: "0px", border: "1px #262626", grid: "immagini a tutta larghezza", density: "airy" },
    chrome: { nav: "menu hamburger discreto", statusBar: "light", signature: "linea di sezione sottile" },
    photography: "moda b/n, still life scuro, ombre profonde",
    composition: "editoriale → look → checkout",
    screens: [
      m("editorial", "Editoriale", "Campagna stagione", ["foto full-bleed"]),
      m("collection", "Collezione", "Capi disponibili", ["lista verticale"]),
      m("product", "Capo", "Materiali e vestibilità", ["galleria", "dettagli"]),
      m("checkout", "Checkout", "Pagamento essenziale", ["form minimale"]),
    ],
  },
  {
    id: "retail-warehouse", sector: "retail", family: "warehouse-utility",
    label: "Warehouse Utility", brand: "Ferramenta Nord", tagline: "Tutto per il cantiere.",
    palette: { bg: "#F5F5F3", surface: "#FFFFFF", text: "#1A1A1A", muted: "#6E6E6E", accent: "#F5A623", accent2: "#1F4E79" },
    typography: { display: "Sans condensed caps 26px", body: "Sans 13px", treatment: "codici articolo, etichette scaffale" },
    geometry: { radius: "4px", border: "1px #DDD", grid: "liste dense con codici", density: "dense" },
    chrome: { nav: "barra ricerca persistente + tab", statusBar: "dark", signature: "codice a barre e SKU" },
    photography: "prodotti tecnici su fondo neutro, scaffali",
    composition: "ricerca → categorie → scheda tecnica",
    screens: [
      m("search", "Ricerca", "Codice, marca, categoria", ["barra ricerca", "suggerimenti"]),
      m("category", "Categoria", "Elenco articoli", ["lista densa", "SKU"]),
      m("product", "Articolo", "Scheda tecnica e scorte", ["specifiche", "disponibilità"]),
      m("order", "Ordine", "Quantità e ritiro", ["riepilogo", "ritiro in sede"]),
      d("b2b", "Portale B2B", "Listini e ordini clienti", ["tabella ordini", "listini"]),
    ],
  },
  {
    id: "retail-vitrine", sector: "retail", family: "vitrine-jewel-box",
    label: "Vitrine Jewel Box", brand: "Oreficeria Castaldi", tagline: "Gioielli su misura.",
    palette: { bg: "#0B0A0C", surface: "#151318", text: "#F6F1E9", muted: "#9A9098", accent: "#D8B26E", accent2: "#5E4B7A" },
    typography: { display: "Serif alto contrasto 34px", body: "Sans 13px", treatment: "oro su nero, riflessi puntuali" },
    geometry: { radius: "12px", border: "1px oro 25%", grid: "prodotto isolato al centro", density: "airy" },
    chrome: { nav: "tab bar nera con oro", statusBar: "light", signature: "scintillio puntiforme" },
    photography: "macro gioielli, fondo velluto, luce puntiforme",
    composition: "vetrina → pezzo unico → su misura",
    screens: [
      m("vitrine", "Vetrina", "Pezzi in evidenza", ["carosello", "riflessi"]),
      m("piece", "Pezzo", "Pietre, carati, certificati", ["macro", "specifiche"]),
      m("custom", "Su misura", "Configura anello", ["configuratore", "anteprima"]),
      m("appointment", "Appuntamento", "Consulenza in boutique", ["calendario"]),
    ],
  },
  {
    id: "retail-zine", sector: "retail", family: "zine-collage",
    label: "Zine Collage", brand: "Disco Ostinato", tagline: "Vinili e cassette.",
    palette: { bg: "#EFE9DD", surface: "#FFFFFF", text: "#141414", muted: "#5F5F5F", accent: "#E2003C", accent2: "#1B1B1B" },
    typography: { display: "Mix di caratteri ritagliati", body: "Mono 13px", treatment: "collage, nastro adesivo, fotocopia" },
    geometry: { radius: "0px", border: "bordi strappati", grid: "sovrapposizioni disordinate", density: "dense" },
    chrome: { nav: "tab bar fotocopiata", statusBar: "dark", signature: "nastro adesivo e graffette" },
    photography: "fotocopie ad alto contrasto, copertine ritagliate",
    composition: "collage → catalogo → eventi in negozio",
    screens: [
      m("home", "Novità", "Arrivi della settimana", ["collage", "etichette"]),
      m("catalog", "Catalogo", "Generi e ricerca", ["lista", "filtri"]),
      m("record", "Disco", "Tracklist e condizioni", ["tracklist", "stato vinile"]),
      m("events", "Live in store", "Concerti e dj set", ["locandine"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* EVENTS                                                              */
/* ------------------------------------------------------------------ */
const EVENTS: MockupIdentity[] = [
  {
    id: "events-neonclub", sector: "events", family: "neon-club-poster",
    label: "Neon Club Poster", brand: "Impianto Notturno", tagline: "Club nights.",
    palette: { bg: "#08060F", surface: "#120E1F", text: "#F4F0FF", muted: "#8F86A8", accent: "#B026FF", accent2: "#00F0FF" },
    typography: { display: "Display caps distorto 38px", body: "Mono 13px", treatment: "aberrazione cromatica, glow" },
    geometry: { radius: "6px", border: "glow 2px", grid: "locandine impilate", density: "balanced" },
    chrome: { nav: "tab bar viola con glow", statusBar: "light", signature: "alone neon e scanline" },
    photography: "club, laser, folla in controluce",
    composition: "locandina → lineup → biglietti",
    screens: [
      m("lineup", "Lineup", "Artisti e orari", ["timeline", "avatar"]),
      m("tickets", "Biglietti", "Tipologie e prezzi", ["card ticket", "CTA"]),
      m("map", "Mappa venue", "Sale e servizi", ["mappa", "legenda"]),
      m("wallet", "Il tuo pass", "QR ingresso", ["QR", "dettagli"]),
    ],
  },
  {
    id: "events-champagne", sector: "events", family: "champagne-gala",
    label: "Champagne Gala", brand: "Serata Aurora", tagline: "Gala e charity dinner.",
    palette: { bg: "#100E12", surface: "#1A171D", text: "#F7F2EA", muted: "#A79E97", accent: "#E4C88B", accent2: "#6B2C4F" },
    typography: { display: "Serif elegante 34px", body: "Sans 14px", treatment: "oro sottile, spaziature ampie" },
    geometry: { radius: "10px", border: "filetto oro", grid: "centrato cerimoniale", density: "airy" },
    chrome: { nav: "tab bar scura discreta", statusBar: "light", signature: "monogramma intrecciato" },
    photography: "sala da gala, cristalli, luce a candela",
    composition: "invito → programma → tavoli",
    screens: [
      m("invite", "Invito", "RSVP digitale", ["monogramma", "CTA RSVP"]),
      m("program", "Programma", "Scaletta serata", ["timeline"]),
      m("seating", "Tavoli", "Assegnazione posti", ["mappa tavoli"]),
      m("donations", "Donazioni", "Asta e contributi", ["lista lotti", "importi"]),
    ],
  },
  {
    id: "events-ticketstub", sector: "events", family: "festival-ticket-stub",
    label: "Festival Ticket Stub", brand: "Onda Estate Festival", tagline: "Tre giorni di musica.",
    palette: { bg: "#FFF7E8", surface: "#FFFFFF", text: "#1E1B16", muted: "#7E7466", accent: "#FF6B35", accent2: "#2EC4B6" },
    typography: { display: "Display caps 36px", body: "Mono 13px", treatment: "perforazioni, timbri, seriali" },
    geometry: { radius: "bordo dentellato", border: "tratteggio da biglietto", grid: "strisce orizzontali", density: "balanced" },
    chrome: { nav: "tab bar a striscia", statusBar: "dark", signature: "strappo dentellato" },
    photography: "palco all'aperto, tramonto, coriandoli",
    composition: "biglietto → programma → mappa festival",
    screens: [
      m("ticket", "Biglietto", "Pass e QR", ["biglietto dentellato", "QR"]),
      m("schedule", "Programma", "Palchi e orari", ["griglia palchi"]),
      m("map", "Mappa", "Aree e servizi", ["mappa illustrata"]),
      m("cashless", "Cashless", "Ricarica e consumi", ["saldo", "storico"]),
      d("organizer", "Regia evento", "Vendite e affluenze", ["dashboard", "grafici"]),
    ],
  },
  {
    id: "events-kinetic", sector: "events", family: "kinetic-typography",
    label: "Kinetic Typography", brand: "Forum Idee", tagline: "Conferenze e talk.",
    palette: { bg: "#FFFFFF", surface: "#111111", text: "#111111", muted: "#666666", accent: "#0033FF", accent2: "#FF0055" },
    typography: { display: "Sans variabile 48px in movimento", body: "Sans 14px", treatment: "testo che scorre e cambia peso" },
    geometry: { radius: "0px", border: "linee guida tipografiche", grid: "bande orizzontali", density: "balanced" },
    chrome: { nav: "barra a marquee", statusBar: "dark", signature: "marquee scorrevole" },
    photography: "poche foto, tipografia protagonista",
    composition: "marquee → speaker → agenda",
    screens: [
      m("home", "Programma", "Talk in evidenza", ["marquee", "elenco talk"]),
      m("speaker", "Speaker", "Bio e sessione", ["ritratto", "bio breve"]),
      m("agenda", "Agenda personale", "Talk salvati", ["lista", "promemoria"]),
      m("network", "Networking", "Contatti e badge", ["QR badge", "lista contatti"]),
    ],
  },
  {
    id: "events-velvet", sector: "events", family: "velvet-curtain",
    label: "Velvet Curtain", brand: "Teatro Comunale Vico", tagline: "Stagione teatrale.",
    palette: { bg: "#160F14", surface: "#20161C", text: "#F5EDE7", muted: "#A2929B", accent: "#8E1E3C", accent2: "#D9B96B" },
    typography: { display: "Serif teatrale 32px", body: "Serif 14px", treatment: "locandine, cartigli" },
    geometry: { radius: "8px", border: "cornice bordeaux", grid: "cartelloni verticali", density: "balanced" },
    chrome: { nav: "tab bar bordeaux", statusBar: "light", signature: "drappeggio in testa" },
    photography: "palcoscenico, sipario, luci di scena",
    composition: "sipario → cartellone → posti",
    screens: [
      m("season", "Cartellone", "Spettacoli stagione", ["card locandina"]),
      m("show", "Spettacolo", "Cast e repliche", ["scheda", "date"]),
      m("seats", "Posti", "Piantina sala", ["piantina", "settori"]),
      m("subscription", "Abbonamento", "Formule stagione", ["piani"]),
    ],
  },
];

/* ------------------------------------------------------------------ */
/* EDUCATION                                                           */
/* ------------------------------------------------------------------ */
const EDUCATION: MockupIdentity[] = [
  {
    id: "edu-chalkboard", sector: "education", family: "chalkboard-scholastic",
    label: "Chalkboard Scholastic", brand: "Lezioni Ponte", tagline: "Ripetizioni e recupero.",
    palette: { bg: "#1B2420", surface: "#243029", text: "#F2F1E8", muted: "#9DAA9F", accent: "#F2C14E", accent2: "#E4E1D4" },
    typography: { display: "Handwritten-like 32px", body: "Sans 14px", treatment: "tratti gesso, sottolineature a mano" },
    geometry: { radius: "6px", border: "cornice lavagna", grid: "riquadri appunti", density: "balanced" },
    chrome: { nav: "tab bar lavagna", statusBar: "light", signature: "polvere di gesso" },
    photography: "aule, quaderni, mani che scrivono",
    composition: "lavagna → materie → lezioni",
    screens: [
      m("subjects", "Materie", "Scelta materia e livello", ["griglia materie"]),
      m("tutor", "Tutor", "Profilo e disponibilità", ["scheda", "recensioni"]),
      m("lesson", "Lezione", "Aula virtuale e materiali", ["video", "allegati"]),
      m("progress", "Andamento", "Voti e obiettivi", ["grafico", "tabella"]),
    ],
  },
  {
    id: "edu-playful", sector: "education", family: "playful-block-primary",
    label: "Playful Block Primary", brand: "Isola Bambini", tagline: "Doposcuola e laboratori.",
    palette: { bg: "#FFFDF5", surface: "#FFFFFF", text: "#20242B", muted: "#7C838F", accent: "#FF5C8A", accent2: "#3DD68C" },
    typography: { display: "Rounded extra bold 36px", body: "Rounded 15px", treatment: "forme geometriche primarie" },
    geometry: { radius: "20px", border: "blocchi colorati pieni", grid: "blocchi giocosi", density: "airy" },
    chrome: { nav: "tab bar con icone grandi", statusBar: "dark", signature: "forme primarie (cerchio, quadrato, triangolo)" },
    photography: "illustrazioni piatte + foto bambini in laboratorio",
    composition: "blocchi → attività → genitori",
    screens: [
      m("home", "Attività", "Laboratori della settimana", ["blocchi colorati"]),
      m("activity", "Laboratorio", "Descrizione e materiali", ["card", "lista materiali"]),
      m("parents", "Area genitori", "Presenze e comunicazioni", ["lista", "avvisi"]),
      m("payments", "Rette", "Pagamenti mensili", ["riepilogo", "CTA"]),
    ],
  },
  {
    id: "edu-campus", sector: "education", family: "campus-modernist",
    label: "Campus Modernist", brand: "Accademia Sestante", tagline: "Master e corsi executive.",
    palette: { bg: "#FAFAF8", surface: "#FFFFFF", text: "#16181C", muted: "#6C7178", accent: "#1B4D3E", accent2: "#C6A15B" },
    typography: { display: "Sans geometrico 30px", body: "Sans 14px", treatment: "griglia svizzera, gerarchia netta" },
    geometry: { radius: "8px", border: "1px #E6E6E2", grid: "12 colonne", density: "balanced" },
    chrome: { nav: "top nav + tab bar", statusBar: "dark", signature: "numerazione moduli" },
    photography: "campus, aule moderne, ritratti professionali",
    composition: "programma → moduli → iscrizione",
    screens: [
      m("programs", "Programmi", "Master e corsi", ["card corso", "durata"]),
      m("modules", "Moduli", "Piano didattico", ["lista numerata"]),
      m("faculty", "Docenti", "Corpo docente", ["griglia ritratti"]),
      m("apply", "Iscrizione", "Candidatura e borse", ["form step", "upload"]),
      d("lms", "Aula digitale", "Corsi, presenze, valutazioni", ["tabella studenti", "grafici"]),
    ],
  },
  {
    id: "edu-notebook", sector: "education", family: "notebook-dotgrid",
    label: "Notebook Dotgrid", brand: "Metodo Quaderno", tagline: "Studio organizzato.",
    palette: { bg: "#FCFCFA", surface: "#FFFFFF", text: "#1F2023", muted: "#767980", accent: "#3B5BDB", accent2: "#F08C00" },
    typography: { display: "Sans 28px medium", body: "Sans 14px", treatment: "griglia a puntini di sfondo, annotazioni" },
    geometry: { radius: "10px", border: "1px #E9E9E4", grid: "dot grid visibile", density: "dense" },
    chrome: { nav: "tab bar chiara", statusBar: "dark", signature: "puntinato + evidenziatore" },
    photography: "quaderni, penne, scrivania dall'alto",
    composition: "dot grid → piano di studio → sessioni",
    screens: [
      m("plan", "Piano di studio", "Materie e scadenze", ["calendario", "chip materia"]),
      m("session", "Sessione", "Pomodoro e note", ["timer", "note"]),
      m("flashcards", "Ripasso", "Flashcard e quiz", ["card flip", "progress"]),
      m("stats", "Statistiche", "Ore e resa", ["grafici"]),
    ],
  },
  {
    id: "edu-cyber", sector: "education", family: "cyber-academy",
    label: "Cyber Academy", brand: "Codice Aperto", tagline: "Bootcamp sviluppo software.",
    palette: { bg: "#0A0C10", surface: "#12161D", text: "#E6EDF3", muted: "#8B949E", accent: "#3FB950", accent2: "#A371F7" },
    typography: { display: "Mono 28px", body: "Mono 13px", treatment: "sintassi colorata, prompt terminale" },
    geometry: { radius: "8px", border: "1px #21262D", grid: "pannelli IDE", density: "dense" },
    chrome: { nav: "tab bar stile editor con tab file", statusBar: "light", signature: "cursore lampeggiante" },
    photography: "nessuna foto: codice, terminali, diagrammi",
    composition: "IDE → percorso → challenge",
    screens: [
      m("path", "Percorso", "Moduli e progressi", ["barra avanzamento", "moduli"]),
      m("lesson", "Lezione", "Teoria e codice", ["snippet colorato"]),
      m("challenge", "Challenge", "Esercizio con test", ["editor", "output test"]),
      m("career", "Career", "Portfolio e colloqui", ["checklist", "aziende"]),
      d("cohort", "Coorte", "Studenti e valutazioni", ["tabella", "grafici"]),
    ],
  },
];

export const IDENTITY_MATRIX: Record<SectorKey, MockupIdentity[]> = {
  food: FOOD,
  beauty: BEAUTY,
  ncc: NCC,
  fitness: FITNESS,
  hospitality: HOSPITALITY,
  realestate: REALESTATE,
  healthcare: HEALTHCARE,
  legal: LEGAL,
  retail: RETAIL,
  events: EVENTS,
  education: EDUCATION,
};

export const ALL_IDENTITIES: MockupIdentity[] = Object.values(IDENTITY_MATRIX).flat();

export const SECTOR_LABELS: Record<SectorKey, string> = {
  food: "Ristorazione",
  beauty: "Beauty & Wellness",
  ncc: "NCC & Mobilità",
  fitness: "Fitness & Sport",
  hospitality: "Hospitality",
  realestate: "Immobiliare",
  healthcare: "Sanità",
  legal: "Legale & Fiscale",
  retail: "Retail",
  events: "Eventi & Spettacolo",
  education: "Formazione",
};

export function getIdentities(sector: SectorKey): MockupIdentity[] {
  return IDENTITY_MATRIX[sector] ?? [];
}

export function getIdentity(id: string): MockupIdentity | undefined {
  return ALL_IDENTITIES.find((i) => i.id === id);
}

/** Auto-match: dato un settore libero (testo lead) restituisce le identità candidate. */
export function matchSector(raw: string): SectorKey {
  const s = (raw || "").toLowerCase();
  const table: [SectorKey, string[]][] = [
    ["food", ["ristorante", "pizzer", "sushi", "bar", "trattoria", "osteria", "food", "gastronom", "pasticc", "burger"]],
    ["beauty", ["parrucch", "estetic", "nail", "unghie", "beauty", "spa", "barber", "hair"]],
    ["ncc", ["ncc", "taxi", "limousine", "autonoleggio", "transfer", "jet", "chauffeur", "noleggio"]],
    ["fitness", ["palestra", "fitness", "padel", "cross", "yoga", "pilates", "box", "running", "sport"]],
    ["hospitality", ["hotel", "b&b", "resort", "agriturismo", "masseria", "rifugio", "affittacamere", "lounge"]],
    ["realestate", ["immobil", "agenzia casa", "real estate", "costruzion", "architett"]],
    ["healthcare", ["medic", "dentist", "poliambulator", "clinic", "fisioterap", "psicolog", "veterinar"]],
    ["legal", ["avvocat", "notai", "commercialist", "legale", "consulen fiscal", "tributar"]],
    ["retail", ["negozio", "boutique", "ferramenta", "gioieller", "abbigliament", "shop", "store", "vinil"]],
    ["events", ["event", "wedding", "teatro", "festival", "club", "discotec", "congress"]],
    ["education", ["scuola", "corso", "accademia", "formazion", "ripetizion", "bootcamp", "doposcuola"]],
  ];
  for (const [key, kws] of table) if (kws.some((k) => s.includes(k))) return key;
  return "retail";
}

/**
 * Costruisce il prompt image-to-text per una singola schermata.
 * Il prompt è deliberatamente ricco: palette, tipografia, geometria, chrome,
 * fotografia e composizione arrivano dall'identità → due identità non possono
 * generare la stessa immagine.
 */
export function buildScreenPrompt(identity: MockupIdentity, screen: ScreenSpec): string {
  const isDesktop = screen.surface === "desktop";
  const canvas = isDesktop
    ? "Ultra-realistic full-bleed DESKTOP web app screenshot, 16:10, no browser chrome, no device frame — pure UI canvas."
    : "Ultra-realistic full-bleed MOBILE app screenshot, 9:19.5, no phone frame, no device bezel — pure UI canvas.";

  return [
    canvas,
    ``,
    `BRAND: "${identity.brand}" — ${identity.tagline}`,
    `IDENTITÀ VISIVA: ${identity.label} (famiglia ${identity.family}) — deve risultare inconfondibile e diversa da qualsiasi altro stile.`,
    ``,
    `PALETTE (usare esattamente): bg ${identity.palette.bg}, surface ${identity.palette.surface}, testo ${identity.palette.text}, muted ${identity.palette.muted}, accento ${identity.palette.accent}, secondario ${identity.palette.accent2}.`,
    `TIPOGRAFIA: display ${identity.typography.display}; body ${identity.typography.body}; trattamento ${identity.typography.treatment}.`,
    `GEOMETRIA: raggio ${identity.geometry.radius}; bordi ${identity.geometry.border}; griglia ${identity.geometry.grid}; densità ${identity.geometry.density}.`,
    `CHROME: ${identity.chrome.nav}; status bar ${identity.chrome.statusBar === "light" ? "chiara su fondo scuro" : "scura su fondo chiaro"} con 9:41; segno distintivo: ${identity.chrome.signature}.`,
    `FOTOGRAFIA: ${identity.photography}.`,
    `RITMO COMPOSITIVO: ${identity.composition}.`,
    ``,
    `SCHERMATA: ${screen.title} — ${screen.purpose}.`,
    `ELEMENTI OBBLIGATORI: ${screen.elements.join(", ")}.`,
    ``,
    `CRAFT: griglia 8pt rigorosa, allineamenti ottici perfetti, testo nitido retina, tutte le stringhe in italiano professionale reale (nessun lorem ipsum, nessun testo inglese, nessuna scritta illeggibile), target touch realistici.`,
    `VIETATI: cornici di dispositivo, iPhone dentro iPhone, watermark, loghi Apple/Google/Meta, wireframe, aspetto di template generico, ombre attorno al canvas.`,
  ].join("\n");
}

/** Prompt completo di una identità (tutte le sue schermate). */
export function buildIdentityPrompts(identity: MockupIdentity): { screen: ScreenSpec; prompt: string }[] {
  return identity.screens.map((screen) => ({ screen, prompt: buildScreenPrompt(identity, screen) }));
}

/** Verifica che nessuna famiglia visiva sia riusata tra settori. */
export function assertMatrixIntegrity(): { ok: boolean; duplicates: string[]; totals: Record<string, number> } {
  const seen = new Map<string, number>();
  ALL_IDENTITIES.forEach((i) => seen.set(i.family, (seen.get(i.family) ?? 0) + 1));
  const duplicates = Array.from(seen.entries()).filter(([, n]) => n > 1).map(([f]) => f);
  const totals = Object.fromEntries(
    (Object.keys(IDENTITY_MATRIX) as SectorKey[]).map((s) => [s, IDENTITY_MATRIX[s].length]),
  );
  return { ok: duplicates.length === 0, duplicates, totals };
}
