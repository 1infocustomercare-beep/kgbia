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
  | "notebook-dotgrid" | "cyber-academy"
  /* --- estensione: stili ispirati ai migliori portfolio internazionali --- */
  | "napoletana-doc" | "fuoco-moderno" | "street-graffiti-slab" | "stone-hearth-craft"
  | "sakura-nikkei-mist" | "ice-marble-crudo" | "aegean-whitewash" | "saigon-noir-silk"
  | "tiki-tropical-lagoon" | "espresso-sand-dessert"
  | "frosted-vision-glass" | "spa-aura-silk" | "blush-rose-editorial"
  | "midnight-emerald-drive" | "neon-velocity-grid" | "crimson-sport-rental"
  | "blush-pilates-aesthetic" | "sage-editorial-move" | "burgundy-bold-strength"
  | "ice-turquoise-resort" | "champagne-blush-suite"
  | "milanese-eleganza" | "nero-lusso-tower" | "rosa-cipria-living"
  | "ethereal-glass-medtech" | "ice-crystal-luxury-care"
  | "fresh-minimal-blanc" | "furniture-showroom-warm"
  | "playful-paw-color" | "pastel-pet-minimal" | "pet-resort-luxury" | "vet-clinical-trust"
  | "sunbeam-nursery-joy" | "autumn-maple-care" | "crayon-craft-paper" | "montessori-wood-calm"
  | "clean-white-green-service" | "dark-amber-technician" | "blueprint-plumbing-tech" | "van-fleet-orange"
  | "riviera-sunset-vibrant" | "ocean-deep-blue-boats" | "azure-coast-charter" | "jetski-adrenaline-spray"
  | "fairway-turf-scoreboard" | "clubhouse-heritage-wood" | "night-range-floodlight"
  | "ocean-azure-resident" | "rose-gold-editorial-hoa" | "ice-blue-ethereal-tower"
  | "velvet-saddle-heritage" | "midnight-stable-arena" | "ivory-equestrian-classic"
  | "voice-agent-waveform" | "ai-dark-terminal-node" | "saas-gradient-mesh";

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
  | "realestate" | "healthcare" | "legal" | "retail" | "events" | "education"
  | "petcare" | "childcare" | "homeservices" | "watersports" | "golf"
  | "condo" | "equestrian" | "aiservices";

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

/* ================================================================== */
/* ESTENSIONE — identità ispirate ai migliori lavori di portfolio      */
/* internazionali, RIELABORATE: brand rinominati, difetti corretti     */
/* (contrasto, gerarchia, densità), nessuna famiglia riusata.          */
/* ================================================================== */

type Q = Omit<MockupIdentity, "screens"> & { screens: ScreenSpec[] };
const q = (
  id: string, sector: SectorKey, family: IdentityFamily, label: string, brand: string, tagline: string,
  palette: MockupIdentity["palette"], typography: MockupIdentity["typography"],
  geometry: MockupIdentity["geometry"], chrome: MockupIdentity["chrome"],
  photography: string, composition: string, screens: ScreenSpec[],
): Q => ({ id, sector, family, label, brand, tagline, palette, typography, geometry, chrome, photography, composition, screens });

/* ---------------- FOOD (estensione) ---------------- */
const FOOD_X: MockupIdentity[] = [
  q("food-napoletana-doc", "food", "napoletana-doc", "Napoletana DOC", "Antica Ruota", "Pizza verace dal 1954.",
    { bg: "#FFF9F0", surface: "#FFFFFF", text: "#1A1410", muted: "#7C6A58", accent: "#C1121F", accent2: "#137547" },
    { display: "Serif napoletano inciso 38px", body: "Sans 15px", treatment: "insegne dipinte a mano, nastri" },
    { radius: "10px", border: "doppio filetto 3px", grid: "8pt · sezioni a fascia", density: "balanced" },
    { nav: "tab bar avorio con icone piene", statusBar: "dark", signature: "stemma tricolore con ruota di carro" },
    "pizza in teglia su marmo, vapore visibile, luce di forno a legna",
    "insegna → forno in evidenza → listino a fascia → CTA rossa",
    [m("home", "Insegna e forno", "Identità storica e pizza del giorno", ["insegna dipinta", "foto forno", "badge DOC"]),
     m("menu", "Listino pizze", "Classiche, speciali, fritti", ["righe listino", "chip impasto", "prezzi"]),
     m("order", "Ordine e asporto", "Carrello e ritiro in pizzeria", ["riepilogo", "orario ritiro", "CTA rossa"]),
     d("admin", "Forno & ordini", "Coda cottura e tempi", ["coda cottura", "timer", "incassi giorno"])]),

  q("food-fuoco-moderno", "food", "fuoco-moderno", "Fuoco Moderno", "Fuocolento", "Impasti lenti, fuoco vivo.",
    { bg: "#120D0B", surface: "#1D1512", text: "#F7EFE7", muted: "#A08C7D", accent: "#FF7A1A", accent2: "#3B2A22" },
    { display: "Sans nero condensato 32px", body: "Sans 15px", treatment: "gradienti brace sui titoli" },
    { radius: "18px", border: "glow arancio 1px", grid: "8pt · card verticali", density: "balanced" },
    { nav: "tab bar scura con pillola attiva incandescente", statusBar: "light", signature: "scintille sul bordo superiore" },
    "brace, fiamma e crosta bruciacchiata in macro, controluce arancio",
    "hero fiammeggiante → carosello impasti → tracking ordine",
    [m("home", "Fuoco vivo", "Hero brace e specialità", ["hero fiamma", "chip impasto", "CTA incandescente"]),
     m("track", "Tracking ordine", "Stato cottura e consegna", ["timeline stati", "mappa", "tempo stimato"]),
     m("cart", "Carrello", "Riepilogo e pagamento", ["righe prodotto", "totale", "metodi pagamento"]),
     d("admin", "Dashboard ordini", "Flusso cucina in tempo reale", ["colonne stati", "ticket", "tempi medi"])]),

  q("food-street-teglia", "food", "street-graffiti-slab", "Street Graffiti", "Teglia Urbana", "Pizza al taglio, città viva.",
    { bg: "#161616", surface: "#232323", text: "#FFFFFF", muted: "#9A9A9A", accent: "#00E5A0", accent2: "#FF2E93" },
    { display: "Slab graffiti all-caps", body: "Mono 13px", treatment: "spray stencil e tag" },
    { radius: "4px", border: "3px nero pieno", grid: "griglia sfalsata da muro", density: "dense" },
    { nav: "barra inferiore a nastro adesivo", statusBar: "light", signature: "tag spray verde acido sull'header" },
    "trance di pizza su carta paglia, muro di mattoni, flash notturno",
    "muro tag → griglia tranci → totale a nastro",
    [m("home", "Muro tranci", "Selezione al taglio", ["griglia tranci", "prezzo al peso", "tag spray"]),
     m("build", "Componi vassoio", "Scelta multipla e grammatura", ["stepper grammi", "lista vassoio", "totale live"]),
     m("pickup", "Ritiro rapido", "Slot e codice ritiro", ["codice grande", "slot", "QR"]),
     d("admin", "Turni e sprechi", "Controllo produzione", ["tabella teglie", "grafico sprechi", "alert"])]),

  q("food-pietra-forno", "food", "stone-hearth-craft", "Pietra & Forno", "Pietra Viva", "Grani antichi, pietra viva.",
    { bg: "#EFE9E1", surface: "#FBF8F4", text: "#231D17", muted: "#7E7266", accent: "#8C6239", accent2: "#4F5D45" },
    { display: "Serif rustico 34px", body: "Sans 15px", treatment: "texture pietra sotto i titoli" },
    { radius: "24px", border: "ombra incisa interna", grid: "8pt · blocchi larghi", density: "airy" },
    { nav: "tab bar sabbia con icone incise", statusBar: "dark", signature: "sigillo in pietra con iniziale" },
    "farine, semi e pietra molare, luce laterale calda polverosa",
    "sigillo → storia grani → schede prodotto → ordine",
    [m("home", "Grani e pietra", "Racconto del prodotto", ["sigillo", "card grani", "CTA calda"]),
     m("product", "Scheda pane", "Lievitazione e disponibilità", ["foto macro", "timeline lievito", "disponibilità"]),
     m("subscribe", "Abbonamento pane", "Consegna settimanale", ["calendario", "piano", "prezzo mensile"]),
     d("admin", "Produzione", "Pianificazione infornate", ["piano infornate", "scorte farine", "resa"])]),

  q("food-hanami-nikkei", "food", "sakura-nikkei-mist", "Sakura Nikkei", "Hanami Nikkei", "Giappone e Perù, un solo banco.",
    { bg: "#FBF2F4", surface: "#FFFFFF", text: "#2A1F26", muted: "#8C7A83", accent: "#E08AA0", accent2: "#2F6E63" },
    { display: "Serif sottile 32px con petali", body: "Sans leggero 15px", treatment: "petali sfumati dietro i titoli" },
    { radius: "28px", border: "nessuno, veli rosati", grid: "8pt · card morbide", density: "airy" },
    { nav: "tab bar bianca traslucida", statusBar: "dark", signature: "pioggia di petali animata sul bordo" },
    "sashimi su ghiaccio con petali, luce fredda rosata",
    "velo di petali → carosello nigiri → dettaglio → prenotazione",
    [m("home", "Fioritura", "Selezione stagionale", ["velo petali", "carosello nigiri", "badge stagione"]),
     m("dish", "Dettaglio pesce", "Provenienza e taglio", ["foto macro", "mappa provenienza", "chip crudo"]),
     m("booking", "Prenotazione banco", "Posti e orari", ["mappa banco", "slot", "CTA rosata"]),
     d("admin", "Freschezza", "Rotazione pesce e lotti", ["tabella lotti", "scadenze", "alert freschezza"])]),

  q("food-ghiaccio-sale", "food", "ice-marble-crudo", "Ghiaccio & Marmo", "Ghiaccio e Sale", "Crudo di mare, servito freddo.",
    { bg: "#F2F6F8", surface: "#FFFFFF", text: "#0E1A20", muted: "#6E8290", accent: "#0FA3C4", accent2: "#C9D6DE" },
    { display: "Sans geometrico 30px", body: "Sans 14px", treatment: "riflessi ghiaccio sui bordi" },
    { radius: "12px", border: "1px azzurro ghiaccio", grid: "8pt · griglia a due colonne", density: "balanced" },
    { nav: "tab bar bianca con separatore ghiaccio", statusBar: "dark", signature: "cristalli di ghiaccio agli angoli" },
    "crudi su marmo con ghiaccio tritato, luce fredda cristallina",
    "banner ghiaccio → griglia crudi → box pescato del giorno",
    [m("home", "Banco del crudo", "Pescato del giorno", ["banner ghiaccio", "griglia crudi", "badge oggi"]),
     m("menu", "Selezione", "Ostriche, tartare, carpacci", ["righe listino", "chip origine", "prezzi"]),
     m("cart", "Ordine", "Asporto refrigerato", ["riepilogo", "nota trasporto", "CTA azzurra"]),
     d("admin", "Pescato e costi", "Margini per lotto", ["tabella lotti", "margine", "grafico costi"])]),

  q("food-meltemi", "food", "aegean-whitewash", "Egeo Calce", "Meltemi Bistrò", "Isole, erbe e brace.",
    { bg: "#FFFFFF", surface: "#F3F8FC", text: "#0B2E4F", muted: "#6E869B", accent: "#1E6FB8", accent2: "#E9C46A" },
    { display: "Serif classico greco 34px", body: "Sans 15px", treatment: "meandro greco come separatore" },
    { radius: "16px", border: "1px blu egeo", grid: "8pt · fasce orizzontali", density: "balanced" },
    { nav: "tab bar bianca con bordo blu", statusBar: "dark", signature: "greca decorativa sotto l'header" },
    "mezè su ceramica bianca e blu, sole mediterraneo, mare sfocato",
    "fascia mare → mezè in griglia → tavolo in terrazza",
    [m("home", "Terrazza", "Atmosfera e piatti simbolo", ["fascia mare", "greca", "card mezè"]),
     m("menu", "Mezè e brace", "Condivisione al centro", ["listino a fasce", "chip vegetariano", "prezzi"]),
     m("booking", "Tavolo in terrazza", "Vista e orario", ["mappa terrazza", "slot", "CTA blu"]),
     d("admin", "Sala e magazzino", "Coperti e scorte", ["planimetria", "scorte", "incassi"])]),

  q("food-lanterna", "food", "saigon-noir-silk", "Saigon Noir", "Lanterna d'Oriente", "Brodi lenti, sete scure.",
    { bg: "#0E0B0C", surface: "#191315", text: "#F5EDE6", muted: "#9C8B84", accent: "#C6462F", accent2: "#C9A227" },
    { display: "Serif alto contrasto 30px", body: "Sans 15px", treatment: "seta damascata dietro i titoli" },
    { radius: "8px", border: "filetto oro 1px", grid: "8pt · liste eleganti", density: "balanced" },
    { nav: "tab bar nera con icone oro filiformi", statusBar: "light", signature: "lanterne rosse sfocate nel fondo" },
    "pho fumante in ciotola scura, vapore, luce di lanterna",
    "lanterne → piatti signature → dettaglio brodo → prenota",
    [m("home", "Lanterne", "Signature del giorno", ["hero lanterne", "card piatti", "rating"]),
     m("dish", "Brodo e spezie", "Composizione e piccantezza", ["foto vapore", "scala piccante", "ingredienti"]),
     m("booking", "Prenotazione", "Sala privata e orari", ["sale", "slot", "CTA oro"]),
     d("admin", "Cucina", "Preparazioni e tempi", ["board preparazioni", "tempi", "coperti"])]),

  q("food-onda-poke", "food", "tiki-tropical-lagoon", "Tiki Laguna", "Onda Poke", "Bowl fresche, gusto isola.",
    { bg: "#062B2B", surface: "#0B3A38", text: "#EFFFFB", muted: "#8FBDB6", accent: "#FFB703", accent2: "#2EC4B6" },
    { display: "Sans rotondo bold 30px", body: "Sans 15px", treatment: "foglie tropicali ritagliate" },
    { radius: "26px", border: "nessuno, ombre verdi", grid: "8pt · bolle e card tonde", density: "balanced" },
    { nav: "tab bar tonda flottante verde scuro", statusBar: "light", signature: "foglie di monstera agli angoli" },
    "poke bowl dall'alto su legno scuro, colori saturi, gocce d'acqua",
    "hero laguna → builder bowl → ingredienti → checkout",
    [m("home", "Laguna", "Bowl del momento", ["hero tropicale", "card bowl", "badge kcal"]),
     m("builder", "Componi bowl", "Base, proteina, topping", ["step builder", "chip ingredienti", "prezzo live"]),
     m("rewards", "Raccolta punti", "Fedeltà e premi", ["barra punti", "card premi", "QR"]),
     d("admin", "Ingredienti", "Consumi e riordino", ["tabella consumi", "soglie", "riordino"])]),

  q("food-cucchiaio", "food", "espresso-sand-dessert", "Sabbia & Espresso", "Cucchiaio d'Oro", "Tiramisù e caffè, tutto il giorno.",
    { bg: "#F5EFE6", surface: "#FFFFFF", text: "#2C211A", muted: "#8A7A6C", accent: "#6F4E37", accent2: "#E4CFA9" },
    { display: "Serif morbido 32px", body: "Sans 15px", treatment: "spolverata di cacao come texture" },
    { radius: "20px", border: "1px sabbia", grid: "8pt · card orizzontali", density: "airy" },
    { nav: "tab bar crema con icone soft", statusBar: "dark", signature: "cucchiaino dorato come indicatore attivo" },
    "tiramisù in coppa di vetro, cacao spolverato, luce calda da bar",
    "hero dolce → gusti in carosello → dettaglio → carrello",
    [m("home", "Vetrina dolci", "Gusti del giorno", ["hero coppa", "carosello gusti", "prezzo"]),
     m("detail", "Dettaglio gusto", "Ingredienti e formato", ["foto macro", "formati", "allergeni"]),
     m("cart", "Carrello", "Asporto e consegna", ["righe", "totale", "CTA caffè"]),
     d("admin", "Vendite", "Gusti più venduti", ["classifica gusti", "grafico orari", "scorte"])]),
];

/* ---------------- BEAUTY (estensione) ---------------- */
const BEAUTY_X: MockupIdentity[] = [
  q("beauty-frosted-vision", "beauty", "frosted-vision-glass", "Frosted Vision Glass", "Unghia d'Autore", "Nail atelier, luce e vetro.",
    { bg: "#EFE9F7", surface: "#FFFFFFCC", text: "#221B2E", muted: "#7C7390", accent: "#A78BFA", accent2: "#FFC2A1" },
    { display: "Sans leggero 30px", body: "Sans 15px", treatment: "testi su pannelli traslucidi" },
    { radius: "30px", border: "1px bianco 40%", grid: "8pt · pannelli sovrapposti", density: "airy" },
    { nav: "tab bar in vetro smerigliato flottante", statusBar: "dark", signature: "pannelli lavanda-pesca in profondità" },
    "mani curate su fondo sfocato lavanda, luce soffusa a specchio",
    "pannello vetro → servizi → calendario → conferma",
    [m("home", "Vetro e colore", "Servizi in evidenza", ["pannelli glass", "card servizi", "CTA lilla"]),
     m("booking", "Prenota", "Operatrice, servizio, orario", ["scelta operatrice", "slot", "durata"]),
     m("gallery", "Galleria nail art", "Ispirazioni salvabili", ["griglia masonry", "salva", "filtri"]),
     d("admin", "Agenda salone", "Occupazione poltrone", ["timeline poltrone", "incassi", "no-show"])]),

  q("beauty-aura-silk", "beauty", "spa-aura-silk", "Aura Silk", "Aura Terme", "Silenzio, acqua, respiro.",
    { bg: "#F1EFEA", surface: "#FFFFFF", text: "#26251F", muted: "#8B8880", accent: "#9CA986", accent2: "#D8C3A5" },
    { display: "Serif ampio 34px", body: "Sans 15px", treatment: "interlinea larga, tutto sussurrato" },
    { radius: "22px", border: "nessuno, sfumature seta", grid: "8pt · verticale lento", density: "airy" },
    { nav: "tab bar avorio quasi invisibile", statusBar: "dark", signature: "onde di seta che attraversano lo sfondo" },
    "acqua in movimento lento, pietre, vapore, luce naturale morbida",
    "respiro → percorsi spa → rituale → prenotazione",
    [m("home", "Rituali", "Percorsi benessere", ["hero acqua", "card percorsi", "durata"]),
     m("ritual", "Dettaglio rituale", "Fasi e benefici", ["timeline fasi", "benefici", "prezzo"]),
     m("booking", "Prenota cabina", "Cabina e terapista", ["cabine", "slot", "note"]),
     d("admin", "Cabine e staff", "Saturazione giornaliera", ["griglia cabine", "staff", "ricavi"])]),

  q("beauty-cipria-editorial", "beauty", "blush-rose-editorial", "Blush Editorial", "Cipria Studio", "Make-up e sguardo editoriale.",
    { bg: "#FFF6F6", surface: "#FFFFFF", text: "#2B1C22", muted: "#8E7078", accent: "#D46A7E", accent2: "#B08D57" },
    { display: "Serif didone 40px", body: "Sans micro-caps 11px", treatment: "impaginato da rivista beauty" },
    { radius: "0px", border: "hairline rosa", grid: "colonne editoriali asimmetriche", density: "balanced" },
    { nav: "tab bar bianca con etichette testuali", statusBar: "dark", signature: "numero di uscita e crediti foto" },
    "beauty shot ravvicinato, pelle luminosa, fondo cipria",
    "cover → editoriale look → listino → prenota",
    [m("home", "Cover", "Look del mese", ["cover foto", "titolo didone", "crediti"]),
     m("look", "Scheda look", "Prodotti e passaggi", ["step numerati", "prodotti", "durata"]),
     m("booking", "Appuntamento", "Servizio e make-up artist", ["artist", "slot", "CTA rosa"]),
     d("admin", "Clienti", "Storico e preferenze", ["tabella clienti", "preferenze", "ricavi"])]),
];

/* ---------------- NCC (estensione) ---------------- */
const NCC_X: MockupIdentity[] = [
  q("ncc-midnight-emerald", "ncc", "midnight-emerald-drive", "Midnight Emerald", "Verdenotte Noleggio", "Flotta premium, notte inclusa.",
    { bg: "#08120F", surface: "#0F1D18", text: "#EAF5F0", muted: "#8AA79C", accent: "#10B981", accent2: "#0F766E" },
    { display: "Sans tecnico 30px", body: "Sans 15px", treatment: "numeri grandi per prezzi giornalieri" },
    { radius: "16px", border: "1px verde 20%", grid: "8pt · card flotta", density: "balanced" },
    { nav: "tab bar scura con indicatore smeraldo", statusBar: "light", signature: "alone smeraldo sotto l'auto" },
    "auto premium in garage buio, riflessi verdi sulla carrozzeria",
    "hero auto → filtri flotta → dettaglio → checkout",
    [m("fleet", "Flotta", "Auto disponibili oggi", ["filtri", "card auto", "prezzo/giorno"]),
     m("car", "Dettaglio auto", "Specifiche e disponibilità", ["gallery", "specifiche", "calendario"]),
     m("checkout", "Prenotazione", "Date, extra, pagamento", ["date range", "extra", "totale"]),
     d("admin", "Gestione flotta", "Utilizzo e manutenzioni", ["tabella veicoli", "utilizzo", "scadenze"])]),

  q("ncc-neon-velocity", "ncc", "neon-velocity-grid", "Neon Velocity", "Velocittà", "Muoviti alla velocità della città.",
    { bg: "#0A0A14", surface: "#141428", text: "#F0F0FF", muted: "#8C8CB4", accent: "#7C3AED", accent2: "#22D3EE" },
    { display: "Sans wide 32px", body: "Mono 13px", treatment: "scie luminose sui bordi attivi" },
    { radius: "10px", border: "1px viola/ciano", grid: "griglia in fuga prospettica", density: "dense" },
    { nav: "tab bar con barra energia sotto", statusBar: "light", signature: "scie neon che seguono lo scroll" },
    "auto in movimento con motion blur notturno, riflessi neon",
    "griglia in fuga → tracker corsa → prezzi dinamici",
    [m("home", "Corsa ora", "Prenotazione immediata", ["mappa neon", "stima prezzo", "CTA viola"]),
     m("track", "Tracking autista", "Posizione e ETA", ["mappa live", "card autista", "ETA"]),
     m("history", "Corse", "Storico e ricevute", ["lista corse", "importi", "ricevuta"]),
     d("admin", "Centrale", "Assegnazione corse", ["mappa flotta", "coda richieste", "SLA"])]),

  q("ncc-rosso-corsa", "ncc", "crimson-sport-rental", "Crimson Sport", "Rosso Corsa Noleggio", "Sportive per giornate memorabili.",
    { bg: "#140708", surface: "#200C0E", text: "#FFF3F3", muted: "#B48A8C", accent: "#E11D48", accent2: "#F5C518" },
    { display: "Sans italic sportivo 34px", body: "Sans 15px", treatment: "diagonali da livrea da gara" },
    { radius: "6px", border: "taglio diagonale rosso", grid: "blocchi inclinati coerenti", density: "balanced" },
    { nav: "tab bar nera con numero di gara", statusBar: "light", signature: "numero di gara e bandiera a scacchi" },
    "supercar rossa in pit, luci calde, asfalto bagnato",
    "livrea → schede sportive → esperienza in pista",
    [m("home", "Livrea", "Modelli di punta", ["hero supercar", "numeri gara", "prezzi"]),
     m("experience", "Esperienza in pista", "Pacchetti e istruttori", ["card pacchetti", "istruttore", "durata"]),
     m("booking", "Prenota", "Data e assicurazione", ["date", "opzioni assicurazione", "totale"]),
     d("admin", "Prenotazioni", "Calendario vetture", ["calendario", "manutenzioni", "ricavi"])]),
];

/* ---------------- FITNESS (estensione) ---------------- */
const FITNESS_X: MockupIdentity[] = [
  q("fitness-blush-pilates", "fitness", "blush-pilates-aesthetic", "Blush Pilates", "Reforma Studio", "Reformer, respiro, postura.",
    { bg: "#FBF1EF", surface: "#FFFFFF", text: "#2A1F1E", muted: "#9A8380", accent: "#E1A6A0", accent2: "#6B7F6E" },
    { display: "Serif leggero 32px", body: "Sans 15px", treatment: "titoli centrati, molta aria" },
    { radius: "24px", border: "nessuno, ombre rosate", grid: "8pt · card larghe", density: "airy" },
    { nav: "tab bar bianca con icone linea sottile", statusBar: "dark", signature: "cerchio del respiro sopra il titolo" },
    "reformer in studio luminoso, corpi in posa, luce rosata",
    "respiro → calendario classi → dettaglio → abbonamento",
    [m("home", "Studio", "Classi di oggi", ["hero reformer", "card classi", "posti liberi"]),
     m("schedule", "Calendario", "Settimana e livelli", ["griglia settimana", "chip livello", "prenota"]),
     m("class", "Dettaglio classe", "Istruttrice e focus", ["foto", "focus", "durata"]),
     d("admin", "Occupazione", "Riempimento classi", ["heatmap classi", "abbonamenti", "ricavi"])]),

  q("fitness-sage-editorial", "fitness", "sage-editorial-move", "Sage Editorial", "Salvia Movimento", "Movimento consapevole.",
    { bg: "#F3F5F1", surface: "#FFFFFF", text: "#1F2620", muted: "#7C877C", accent: "#7C9473", accent2: "#2F3A31" },
    { display: "Serif editoriale 36px", body: "Sans 15px", treatment: "griglia editoriale con filetti verdi" },
    { radius: "2px", border: "hairline salvia", grid: "due colonne testuali", density: "balanced" },
    { nav: "tab bar piatta con etichette", statusBar: "dark", signature: "indice numerato delle sezioni" },
    "corpi in movimento in bianco e nero con virato verde",
    "indice → programma → schede esercizi → progressi",
    [m("home", "Indice programma", "Percorso settimanale", ["indice numerato", "card sessioni", "durata"]),
     m("session", "Sessione", "Esercizi e tempi", ["lista esercizi", "timer", "note"]),
     m("progress", "Progressi", "Costanza e mobilità", ["grafico costanza", "badge", "storico"]),
     d("admin", "Atleti", "Programmi assegnati", ["tabella atleti", "programmi", "aderenza"])]),

  q("fitness-bordo-strength", "fitness", "burgundy-bold-strength", "Burgundy Bold", "Bordò Strength", "Ferro, tecnica, risultati.",
    { bg: "#1A0A10", surface: "#2A121A", text: "#FFF2F4", muted: "#B08A93", accent: "#8E1B3A", accent2: "#E8C547" },
    { display: "Sans extrabold all-caps 36px", body: "Sans condensato 14px", treatment: "numeri di carico giganti" },
    { radius: "8px", border: "2px bordeaux", grid: "blocchi pesanti", density: "dense" },
    { nav: "tab bar bordeaux con icone piene", statusBar: "light", signature: "barra di carico con dischi stilizzati" },
    "bilanciere e magnesite, luce dura, palestra industriale",
    "carico → scheda allenamento → serie → PR",
    [m("home", "Allenamento oggi", "Scheda del giorno", ["carico giornaliero", "lista esercizi", "CTA start"]),
     m("set", "Esecuzione serie", "Serie, ripetizioni, recupero", ["contatore serie", "timer recupero", "RPE"]),
     m("pr", "Record personali", "Massimali e curve", ["tabella PR", "grafico", "badge"]),
     d("admin", "Coach", "Schede e aderenza", ["tabella clienti", "schede", "aderenza"])]),
];

/* ---------------- HOSPITALITY (estensione) ---------------- */
const HOSPITALITY_X: MockupIdentity[] = [
  q("hosp-ice-turquoise", "hospitality", "ice-turquoise-resort", "Ice Turquoise", "Laguna Bianca Resort", "Acqua chiara, tempo lento.",
    { bg: "#F4FBFC", surface: "#FFFFFF", text: "#0C2A31", muted: "#6E9099", accent: "#4CC9D6", accent2: "#BFE8EC" },
    { display: "Sans leggero wide 30px", body: "Sans 15px", treatment: "sfumature acqua sui titoli" },
    { radius: "20px", border: "1px turchese 20%", grid: "8pt · card panoramiche", density: "airy" },
    { nav: "tab bar bianca con onda attiva", statusBar: "dark", signature: "riflesso d'acqua sul bordo delle card" },
    "piscina a sfioro, acqua turchese, luce alta di mezzogiorno",
    "panorama → camere → servizi → prenotazione",
    [m("home", "Panorama", "Resort e disponibilità", ["hero piscina", "card camere", "prezzo/notte"]),
     m("room", "Camera", "Foto, servizi, policy", ["gallery", "servizi", "policy"]),
     m("booking", "Prenota", "Date e ospiti", ["date range", "ospiti", "totale"]),
     d("admin", "Occupazione", "Camere e revenue", ["calendario camere", "RevPAR", "arrivi"])]),

  q("hosp-suite-cipria", "hospitality", "champagne-blush-suite", "Champagne Blush", "Suite Cipria", "Piccolo hotel, grande cura.",
    { bg: "#FBF4F0", surface: "#FFFFFF", text: "#2A2320", muted: "#95837C", accent: "#C9A15C", accent2: "#E6C3B4" },
    { display: "Serif alto 34px", body: "Sans 15px", treatment: "capolettera dorata nelle sezioni" },
    { radius: "14px", border: "filetto oro sottile", grid: "8pt · liste eleganti", density: "balanced" },
    { nav: "tab bar crema con separatori oro", statusBar: "dark", signature: "monogramma cipria e oro" },
    "suite con tessuti chiari, luce di fine pomeriggio, dettagli dorati",
    "monogramma → suite → servizi concierge → prenota",
    [m("home", "Suite", "Camere e atmosfera", ["monogramma", "card suite", "prezzo"]),
     m("concierge", "Concierge", "Richieste e servizi", ["lista richieste", "chat", "orari"]),
     m("booking", "Prenotazione", "Notti e colazione", ["date", "opzioni", "totale"]),
     d("admin", "Front office", "Check-in e note ospiti", ["arrivi", "note", "housekeeping"])]),
];

/* ---------------- REAL ESTATE (estensione) ---------------- */
const REALESTATE_X: MockupIdentity[] = [
  q("re-eleganza-milanese", "realestate", "milanese-eleganza", "Eleganza Milanese", "Dimora Sant'Ambrogio", "Case d'epoca, sguardo attuale.",
    { bg: "#F7F5F1", surface: "#FFFFFF", text: "#1C1A17", muted: "#847F76", accent: "#2F4F4F", accent2: "#B99A63" },
    { display: "Serif milanese 36px", body: "Sans 15px", treatment: "filetti e capolettera sobri" },
    { radius: "4px", border: "hairline grafite", grid: "8pt · due colonne", density: "balanced" },
    { nav: "tab bar avorio con etichette", statusBar: "dark", signature: "stemma cittadino inciso" },
    "interni d'epoca con parquet e stucchi, luce naturale laterale",
    "stemma → immobili → planimetria → appuntamento",
    [m("home", "Selezione", "Immobili di pregio", ["card immobili", "prezzo", "zona"]),
     m("detail", "Scheda immobile", "Metratura e planimetria", ["gallery", "planimetria", "dati catastali"]),
     m("visit", "Prenota visita", "Agente e orario", ["agente", "slot", "note"]),
     d("admin", "Portafoglio", "Trattative e provvigioni", ["pipeline", "provvigioni", "scadenze"])]),

  q("re-nero-lusso", "realestate", "nero-lusso-tower", "Nero Lusso", "Nero Portico", "Attici e vedute esclusive.",
    { bg: "#0C0C0D", surface: "#161618", text: "#F4F4F5", muted: "#8E8E96", accent: "#D4AF37", accent2: "#3F3F46" },
    { display: "Serif oro small-caps 30px", body: "Sans 15px", treatment: "titoli distanziati, oro su nero" },
    { radius: "2px", border: "1px oro 25%", grid: "8pt · full-bleed", density: "airy" },
    { nav: "tab bar nera con filetto oro", statusBar: "light", signature: "cornice oro sottile sull'intera schermata" },
    "attico notturno con skyline, vetrate, luci calde interne",
    "cornice oro → attici → tour → contatto privato",
    [m("home", "Attici", "Selezione riservata", ["hero notturno", "card attici", "prezzo su richiesta"]),
     m("tour", "Tour virtuale", "Stanze e vedute", ["hotspot stanze", "video", "planimetria"]),
     m("contact", "Contatto riservato", "Richiesta privata", ["form", "agente dedicato", "CTA oro"]),
     d("admin", "Clienti VIP", "Trattative riservate", ["tabella clienti", "stato", "valore"])]),

  q("re-casa-cipria", "realestate", "rosa-cipria-living", "Rosa Cipria Living", "Casa Cipria", "La prima casa, senza ansia.",
    { bg: "#FDF6F5", surface: "#FFFFFF", text: "#2A2226", muted: "#95848A", accent: "#E2A0A8", accent2: "#587B7F" },
    { display: "Sans rotondo 30px", body: "Sans 15px", treatment: "tono rassicurante, icone morbide" },
    { radius: "22px", border: "nessuno, ombre morbide", grid: "8pt · card singole", density: "airy" },
    { nav: "tab bar bianca con pillola rosa", statusBar: "dark", signature: "illustrazioni lineari di case" },
    "interni luminosi arredati, luce diffusa, tinte pastello",
    "guida → ricerca → mutuo simulato → visita",
    [m("home", "Trova casa", "Ricerca guidata", ["barra ricerca", "filtri semplici", "card case"]),
     m("mortgage", "Simulatore mutuo", "Rata e durata", ["slider importo", "rata", "confronto"]),
     m("visit", "Visita", "Prenotazione e checklist", ["slot", "checklist", "promemoria"]),
     d("admin", "Richieste", "Lead e stato pratica", ["tabella lead", "stato", "conversioni"])]),
];

/* ---------------- HEALTHCARE (estensione) ---------------- */
const HEALTHCARE_X: MockupIdentity[] = [
  q("hc-ethereal-glass", "healthcare", "ethereal-glass-medtech", "Ethereal Glass MedTech", "Medisfera Dispositivi", "Dispositivi medici, regola e ricerca.",
    { bg: "#F5F9FF", surface: "#FFFFFFB3", text: "#0F1B2D", muted: "#6C7F99", accent: "#3B82F6", accent2: "#A5D8FF" },
    { display: "Sans tecnico leggero 30px", body: "Sans 14px", treatment: "pannelli vetro con dati tecnici" },
    { radius: "18px", border: "1px bianco 60%", grid: "8pt · pannelli sovrapposti", density: "balanced" },
    { nav: "tab bar vetro chiaro flottante", statusBar: "dark", signature: "sfere di vetro azzurre in profondità" },
    "camera bianca, strumenti sterili, luce fredda ad alta chiarezza",
    "pannelli vetro → servizi MDR → dossier → contatto",
    [m("home", "Servizi", "Consulenza regolatoria e R&D", ["pannelli glass", "card servizi", "certificazioni"]),
     m("dossier", "Dossier tecnico", "Stato pratiche MDR", ["timeline pratica", "documenti", "stato"]),
     m("contact", "Richiesta", "Brief progetto", ["form", "allegati", "CTA blu"]),
     d("admin", "Conformità", "Scadenze e audit", ["tabella pratiche", "audit", "alert scadenze"])]),

  q("hc-cristallo", "healthcare", "ice-crystal-luxury-care", "Ice Crystal Care", "Cristallo Clinica", "Diagnostica precisa, ambiente sereno.",
    { bg: "#FAFDFE", surface: "#FFFFFF", text: "#12222A", muted: "#6F8B94", accent: "#67C7D8", accent2: "#DCEFF3" },
    { display: "Serif clinico leggero 30px", body: "Sans 15px", treatment: "sfaccettature cristallo negli angoli" },
    { radius: "12px", border: "1px cristallo", grid: "8pt · schede referto", density: "balanced" },
    { nav: "tab bar bianca con icone geometriche", statusBar: "dark", signature: "riflessi sfaccettati sui bordi" },
    "ambulatorio luminoso, strumenti puliti, riflessi cristallini",
    "cristallo → prenotazione esami → referti → promemoria",
    [m("home", "Esami", "Prenotazione rapida", ["card esami", "tempi attesa", "sedi"]),
     m("report", "Referti", "Download e storico", ["lista referti", "PDF", "confronto valori"]),
     m("booking", "Prenota", "Medico e orario", ["medico", "slot", "preparazione"]),
     d("admin", "Agenda clinica", "Sale e personale", ["griglia sale", "personale", "incassi"])]),
];

/* ---------------- RETAIL (estensione) ---------------- */
const RETAIL_X: MockupIdentity[] = [
  q("retail-fresh-blanc", "retail", "fresh-minimal-blanc", "Fresh Minimal Blanc", "Chioma Profumi", "Profumo per capelli, gesto quotidiano.",
    { bg: "#FFFFFF", surface: "#FDF7F7", text: "#1E1A1B", muted: "#8B7E80", accent: "#E8B4B8", accent2: "#B76E79" },
    { display: "Sans sottile wide 28px", body: "Sans 14px", treatment: "molto bianco, packshot protagonista" },
    { radius: "8px", border: "hairline rosa cipria", grid: "8pt · griglia prodotto", density: "airy" },
    { nav: "tab bar bianca minimale", statusBar: "dark", signature: "filetto rose gold sotto il logo" },
    "packshot flacone su fondo bianco, ombra netta, riflesso rose gold",
    "packshot → benefici → recensioni → acquisto",
    [m("pdp", "Scheda prodotto", "Benefici e formato", ["packshot", "benefici", "prezzo"]),
     m("routine", "Routine", "Come si usa", ["step", "durata", "consigli"]),
     m("cart", "Carrello", "Spedizione e codice sconto", ["righe", "sconto", "totale"]),
     d("admin", "E-commerce", "Ordini e magazzino", ["tabella ordini", "stock", "resi"])]),

  q("retail-showroom-arredo", "retail", "furniture-showroom-warm", "Showroom Warm", "Casa Arredi Nord", "Arredo su misura, consegna curata.",
    { bg: "#F6F3EE", surface: "#FFFFFF", text: "#221F1B", muted: "#867F74", accent: "#A0522D", accent2: "#3F4A3C" },
    { display: "Serif contemporaneo 32px", body: "Sans 15px", treatment: "schede prodotto con quote reali" },
    { radius: "10px", border: "1px legno chiaro", grid: "8pt · griglia showroom", density: "balanced" },
    { nav: "tab bar sabbia con icone arredo", statusBar: "dark", signature: "quote dimensionali accanto ai prodotti" },
    "ambienti arredati con luce naturale, materiali legno e tessuto",
    "ambienti → prodotto con quote → configuratore → preventivo",
    [m("home", "Ambienti", "Ispirazione per stanza", ["card ambienti", "filtri stanza", "prezzi"]),
     m("configurator", "Configuratore", "Misure, finiture, tessuti", ["selettori finitura", "anteprima", "prezzo live"]),
     m("quote", "Preventivo", "Riepilogo e consegna", ["righe", "consegna", "CTA"]),
     d("admin", "Ordini e consegne", "Logistica showroom", ["tabella ordini", "calendario consegne", "margini"])]),
];

/* ---------------- PET CARE (nuovo) ---------------- */
const PETCARE: MockupIdentity[] = [
  q("pet-playful-paw", "petcare", "playful-paw-color", "Playful Paw", "Zampe Felici", "Toelettatura e coccole.",
    { bg: "#FFF9F2", surface: "#FFFFFF", text: "#26201C", muted: "#8E8178", accent: "#FF8A5B", accent2: "#4CB8C4" },
    { display: "Sans rotondo bold 30px", body: "Sans 15px", treatment: "icone zampa e bolle colorate" },
    { radius: "26px", border: "nessuno, ombre allegre", grid: "8pt · card tonde", density: "balanced" },
    { nav: "tab bar bianca con pillola arancio", statusBar: "dark", signature: "impronte di zampa come separatori" },
    "cani e gatti in toelettatura, colori vivaci, luce allegra",
    "hero animale → servizi → prenotazione → profilo pet",
    [m("home", "Servizi", "Toelettatura e daycare", ["hero pet", "card servizi", "prezzi"]),
     m("pet", "Profilo animale", "Scheda e vaccinazioni", ["foto pet", "dati", "vaccini"]),
     m("booking", "Prenota", "Servizio e orario", ["slot", "operatore", "note"]),
     d("admin", "Agenda toelettatura", "Occupazione e incassi", ["timeline postazioni", "incassi", "clienti"])]),

  q("pet-pastel-clean", "petcare", "pastel-pet-minimal", "Pastel Pet Minimal", "Coda Morbida", "Cura semplice, tutto tracciato.",
    { bg: "#F7F9FB", surface: "#FFFFFF", text: "#1F262B", muted: "#7C8B95", accent: "#9BC1BC", accent2: "#F4D6CC" },
    { display: "Sans leggero 28px", body: "Sans 14px", treatment: "molto respiro, icone sottili" },
    { radius: "16px", border: "1px azzurro chiarissimo", grid: "8pt · liste pulite", density: "airy" },
    { nav: "tab bar bianca con icone linea", statusBar: "dark", signature: "badge stato pet colorati" },
    "gatti e cani su fondo pastello, luce morbida, still pulito",
    "stato pet → agenda → promemoria → storico",
    [m("home", "Stato pet", "Check-in e attività", ["stato", "timeline attività", "foto giorno"]),
     m("schedule", "Agenda", "Prossimi appuntamenti", ["lista date", "tipo servizio", "promemoria"]),
     m("health", "Salute", "Peso, vaccini, note", ["grafico peso", "vaccini", "note vet"]),
     d("admin", "Clienti e pet", "Anagrafiche e ricavi", ["tabella pet", "ricavi", "richiami vaccinali"])]),

  q("pet-resort-luxury", "petcare", "pet-resort-luxury", "Pet Resort Luxury", "Villa Zampe Resort", "Vacanze a cinque zampe.",
    { bg: "#14100E", surface: "#201A17", text: "#F6EFE9", muted: "#A2938A", accent: "#C9A227", accent2: "#6B8E6B" },
    { display: "Serif hotel 32px", body: "Sans 15px", treatment: "tono hotel di lusso applicato al pet" },
    { radius: "12px", border: "filetto oro 1px", grid: "8pt · card suite", density: "balanced" },
    { nav: "tab bar scura con icone oro", statusBar: "light", signature: "targhetta suite con nome dell'animale" },
    "suite per animali con tessuti pregiati, luce calda serale",
    "suite → live cam → servizi extra → prenotazione",
    [m("home", "Suite", "Sistemazioni disponibili", ["card suite", "prezzo/notte", "servizi"]),
     m("cam", "Telecamera live", "Vedi il tuo animale", ["player video", "orari", "snapshot"]),
     m("booking", "Prenota soggiorno", "Date e pasti", ["date range", "piano pasti", "totale"]),
     d("admin", "Occupazione", "Suite e staff", ["griglia suite", "staff", "ricavi"])]),

  q("pet-vet-trust", "petcare", "vet-clinical-trust", "Vet Clinical Trust", "Ambulatorio Amico", "Veterinaria chiara e vicina.",
    { bg: "#FFFFFF", surface: "#F2F7F5", text: "#12211C", muted: "#6C8079", accent: "#1F8A70", accent2: "#CDE7DE" },
    { display: "Sans medico 28px", body: "Sans 14px", treatment: "dati clinici leggibili, zero fronzoli" },
    { radius: "10px", border: "1px verde chiaro", grid: "8pt · schede cliniche", density: "dense" },
    { nav: "tab bar bianca con icone mediche", statusBar: "dark", signature: "croce veterinaria con impronta" },
    "visita veterinaria, strumenti puliti, luce ambulatoriale",
    "urgenze → cartella clinica → terapie → prenotazione",
    [m("home", "Ambulatorio", "Urgenze e prenotazioni", ["banner urgenze", "card servizi", "orari"]),
     m("chart", "Cartella clinica", "Storico visite ed esami", ["timeline visite", "esami", "allegati"]),
     m("therapy", "Terapia", "Farmaci e promemoria", ["lista farmaci", "orari", "notifiche"]),
     d("admin", "Studio", "Agenda medici e magazzino", ["agenda medici", "farmaci", "incassi"])]),
];

/* ---------------- CHILDCARE (nuovo) ---------------- */
const CHILDCARE: MockupIdentity[] = [
  q("child-sunbeam", "childcare", "sunbeam-nursery-joy", "Sunbeam Nursery", "Piccole Stelle Asilo", "Giornate serene, genitori informati.",
    { bg: "#FFFDF5", surface: "#FFFFFF", text: "#241F16", muted: "#8D8474", accent: "#FFC53D", accent2: "#4FB3E8" },
    { display: "Sans rotondo 30px", body: "Sans 15px", treatment: "forme a sole e nuvole" },
    { radius: "28px", border: "nessuno, ombre gialle", grid: "8pt · card grandi", density: "balanced" },
    { nav: "tab bar bianca con sole attivo", statusBar: "dark", signature: "raggi di sole dietro l'header" },
    "bambini che giocano in aula luminosa, colori caldi",
    "sole → diario giornata → presenze → messaggi",
    [m("home", "Diario di oggi", "Attività e umore", ["timeline attività", "foto", "umore"]),
     m("checkin", "Presenze", "Entrata e uscita", ["stato presenza", "orari", "delegati"]),
     m("chat", "Messaggi", "Educatrici e famiglia", ["thread", "allegati", "avvisi"]),
     d("admin", "Sezioni", "Presenze e rette", ["tabella sezioni", "presenze", "rette"])]),

  q("child-autumn-maple", "childcare", "autumn-maple-care", "Autumn Maple", "Foglia d'Acero Nido", "Ritmo lento, cura calda.",
    { bg: "#FFF7F0", surface: "#FFFFFF", text: "#2A211A", muted: "#96866F", accent: "#D97706", accent2: "#7C4A2D" },
    { display: "Serif caldo 30px", body: "Sans 15px", treatment: "foglie ritagliate come decori" },
    { radius: "18px", border: "1px ambra", grid: "8pt · liste morbide", density: "balanced" },
    { nav: "tab bar crema con foglia attiva", statusBar: "dark", signature: "bordo a foglie d'acero" },
    "aula con legno e tessuti autunnali, luce dorata",
    "foglie → programma → nanna e pasti → report",
    [m("home", "Giornata", "Programma e ritmi", ["fasce orarie", "attività", "note"]),
     m("meals", "Pasti e nanna", "Registro cura", ["registro pasti", "nanna", "pannolini"]),
     m("report", "Report famiglia", "Riepilogo settimanale", ["riepilogo", "foto", "commento"]),
     d("admin", "Nido", "Educatrici e rapporti", ["turni", "rapporto bimbi/educatrici", "rette"])]),

  q("child-crayon-craft", "childcare", "crayon-craft-paper", "Crayon Craft", "Matite Colorate", "Creatività prima di tutto.",
    { bg: "#FFFDF8", surface: "#FFFFFF", text: "#1E1E1E", muted: "#7A7A7A", accent: "#EF476F", accent2: "#118AB2" },
    { display: "Sans disegnato a mano 32px", body: "Sans 15px", treatment: "tratti di pastello e scotch di carta" },
    { radius: "14px", border: "tratto irregolare 2px", grid: "collage di riquadri", density: "balanced" },
    { nav: "tab bar carta con icone disegnate", statusBar: "dark", signature: "scarabocchi e washi tape colorati" },
    "disegni dei bambini fotografati, colori a pastello",
    "collage → laboratori → galleria disegni → iscrizione",
    [m("home", "Laboratori", "Attività creative", ["collage", "card laboratori", "età"]),
     m("gallery", "Galleria", "Opere dei bambini", ["griglia disegni", "like famiglia", "download"]),
     m("signup", "Iscrizione", "Scelta laboratorio", ["form", "calendario", "costo"]),
     d("admin", "Laboratori", "Iscritti e materiali", ["tabella iscritti", "materiali", "costi"])]),

  q("child-montessori", "childcare", "montessori-wood-calm", "Montessori Wood", "Casa Montessori", "Ambiente preparato, autonomia.",
    { bg: "#F7F4EF", surface: "#FFFFFF", text: "#232019", muted: "#8A8175", accent: "#9C7A54", accent2: "#6E8B74" },
    { display: "Serif sobrio 30px", body: "Sans 15px", treatment: "niente colori accesi, materiali naturali" },
    { radius: "8px", border: "1px legno", grid: "8pt · griglia ordinata", density: "airy" },
    { nav: "tab bar legno chiaro con icone essenziali", statusBar: "dark", signature: "materiali montessoriani illustrati" },
    "materiali in legno su tappeto, luce naturale, ordine visivo",
    "ambiente → osservazioni → sviluppo → colloqui",
    [m("home", "Ambiente", "Attività proposte", ["card materiali", "aree", "durata"]),
     m("observation", "Osservazioni", "Note dell'educatrice", ["timeline note", "aree sviluppo", "foto"]),
     m("meeting", "Colloqui", "Prenotazione con famiglia", ["slot", "educatrice", "argomenti"]),
     d("admin", "Sviluppo", "Traguardi per bambino", ["matrice traguardi", "note", "presenze"])]),
];

/* ---------------- HOME SERVICES (nuovo) ---------------- */
const HOMESERVICES: MockupIdentity[] = [
  q("home-clean-green", "homeservices", "clean-white-green-service", "Clean White Green", "Idraulica Verde", "Interventi rapidi, prezzi chiari.",
    { bg: "#FFFFFF", surface: "#F3F8F4", text: "#14201A", muted: "#6E8377", accent: "#16A34A", accent2: "#D1FAE5" },
    { display: "Sans solido 30px", body: "Sans 15px", treatment: "prezzi trasparenti in evidenza" },
    { radius: "12px", border: "1px verde chiaro", grid: "8pt · card servizio", density: "balanced" },
    { nav: "tab bar bianca con badge urgenza", statusBar: "dark", signature: "badge 'intervento in 60 min'" },
    "tecnico al lavoro, attrezzi puliti, luce chiara domestica",
    "urgenza → servizi con prezzo → prenotazione → tracking tecnico",
    [m("home", "Interventi", "Servizi e tempi", ["badge urgenza", "card servizi", "prezzo da"]),
     m("booking", "Prenota tecnico", "Fascia oraria e indirizzo", ["fasce", "indirizzo", "note guasto"]),
     m("track", "Tecnico in arrivo", "Stato e ETA", ["mappa", "card tecnico", "ETA"]),
     d("admin", "Dispatch", "Assegnazione squadre", ["mappa squadre", "coda interventi", "SLA"])]),

  q("home-dark-amber", "homeservices", "dark-amber-technician", "Dark Amber Technician", "Termo Ambra", "Climatizzazione e caldaie.",
    { bg: "#121212", surface: "#1D1B18", text: "#F5F1EA", muted: "#A0968A", accent: "#F59E0B", accent2: "#78350F" },
    { display: "Sans condensato 30px", body: "Mono 13px", treatment: "letture tecniche e codici errore" },
    { radius: "8px", border: "1px ambra 30%", grid: "8pt · pannelli strumento", density: "dense" },
    { nav: "tab bar scura con led ambra", statusBar: "light", signature: "led di stato impianto" },
    "caldaia e manometri in primo piano, luce ambrata da officina",
    "stato impianto → diagnosi → intervento → manutenzione",
    [m("home", "Stato impianto", "Letture e allarmi", ["gauge", "codici errore", "alert"]),
     m("diagnosis", "Diagnosi", "Guasto e ricambi", ["checklist", "ricambi", "costo stimato"]),
     m("plan", "Manutenzione", "Contratto e scadenze", ["piano", "scadenze", "prezzo annuo"]),
     d("admin", "Impianti", "Parco clienti e scadenze", ["tabella impianti", "scadenze", "ricavi"])]),

  q("home-blueprint-tech", "homeservices", "blueprint-plumbing-tech", "Blueprint Tech", "Impianti Nord", "Progettazione e messa a norma.",
    { bg: "#0E1A2B", surface: "#14263D", text: "#E8F1FA", muted: "#8AA3BD", accent: "#38BDF8", accent2: "#1E3A5F" },
    { display: "Sans tecnico 28px", body: "Mono 13px", treatment: "schemi impianto come sfondo" },
    { radius: "4px", border: "1px linea tecnica", grid: "griglia tecnica visibile", density: "dense" },
    { nav: "tab bar blu tecnica con tab quadrate", statusBar: "light", signature: "quote e simboli impiantistici" },
    "schemi tecnici e tubazioni, luce fredda da cantiere",
    "schema → preventivo per voci → cantiere → collaudo",
    [m("home", "Progetti", "Cantieri attivi", ["schema", "card cantieri", "avanzamento"]),
     m("quote", "Preventivo", "Voci e importi", ["righe voci", "totale", "IVA"]),
     m("site", "Cantiere", "Avanzamento e foto", ["stato lavori", "foto", "note"]),
     d("admin", "Commesse", "Margini e collaudi", ["tabella commesse", "margini", "collaudi"])]),

  q("home-pronto-arancio", "homeservices", "van-fleet-orange", "Van Fleet Orange", "Pronto Casa", "Una squadra per ogni riparazione.",
    { bg: "#FFF8F2", surface: "#FFFFFF", text: "#211A14", muted: "#8A7A6B", accent: "#EA580C", accent2: "#1F2937" },
    { display: "Sans bold 32px", body: "Sans 15px", treatment: "grandi bottoni e icone mestiere" },
    { radius: "16px", border: "2px arancio", grid: "8pt · griglia mestieri", density: "balanced" },
    { nav: "tab bar arancio con icone bianche", statusBar: "dark", signature: "furgone stilizzato come indicatore" },
    "furgoni attrezzati e artigiani, luce di giornata piena",
    "mestieri → preventivo rapido → appuntamento → recensioni",
    [m("home", "Mestieri", "Elettricista, idraulico, fabbro", ["griglia mestieri", "tempi", "prezzo da"]),
     m("quote", "Preventivo rapido", "Foto guasto e stima", ["upload foto", "descrizione", "stima"]),
     m("reviews", "Recensioni", "Feedback verificati", ["rating", "recensioni", "tecnico"]),
     d("admin", "Squadre", "Turni e interventi", ["planning squadre", "interventi", "incassi"])]),
];

/* ---------------- WATERSPORTS / CHARTER (nuovo) ---------------- */
const WATERSPORTS: MockupIdentity[] = [
  q("water-sunset-vibrant", "watersports", "riviera-sunset-vibrant", "Riviera Sunset", "Onda Sunset Charter", "Tramonti in barca, ogni sera.",
    { bg: "#1A0B22", surface: "#2A1233", text: "#FFF0F7", muted: "#C79FC0", accent: "#FF5E7E", accent2: "#FFB86B" },
    { display: "Sans wide 32px", body: "Sans 15px", treatment: "gradienti tramonto sui titoli" },
    { radius: "20px", border: "nessuno, aloni caldi", grid: "8pt · card panoramiche", density: "balanced" },
    { nav: "tab bar scura con gradiente attivo", statusBar: "light", signature: "sole che tramonta dietro l'header" },
    "barca al tramonto, cielo rosa-arancio, riflessi sull'acqua",
    "tramonto → tour serali → barca → prenota",
    [m("home", "Tour al tramonto", "Uscite serali", ["hero tramonto", "card tour", "durata"]),
     m("boat", "Scheda barca", "Capienza e comfort", ["gallery", "specifiche", "skipper"]),
     m("booking", "Prenota uscita", "Data, persone, extra", ["date", "persone", "totale"]),
     d("admin", "Uscite", "Calendario e skipper", ["calendario", "skipper", "ricavi"])]),

  q("water-deep-blue", "watersports", "ocean-deep-blue-boats", "Ocean Deep Blue", "Blu Profondo Boats", "Noleggio barche, mare aperto.",
    { bg: "#04121F", surface: "#0A1F33", text: "#EAF4FB", muted: "#7FA0B8", accent: "#0EA5E9", accent2: "#94A3B8" },
    { display: "Sans nautico 30px", body: "Sans 15px", treatment: "strumenti di bordo come dettagli" },
    { radius: "10px", border: "1px blu profondo", grid: "8pt · liste flotta", density: "dense" },
    { nav: "tab bar blu scura con bussola attiva", statusBar: "light", signature: "rosa dei venti sull'header" },
    "yacht in mare aperto dall'alto, blu profondo, scia bianca",
    "bussola → flotta → rotta → contratto",
    [m("fleet", "Flotta", "Barche disponibili", ["filtri lunghezza", "card barche", "prezzo/giorno"]),
     m("route", "Rotta", "Tappe e tempi", ["mappa rotta", "tappe", "carburante"]),
     m("contract", "Contratto", "Patente, cauzione, firme", ["checklist documenti", "cauzione", "firma"]),
     d("admin", "Noleggi", "Disponibilità e manutenzioni", ["calendario barche", "manutenzioni", "ricavi"])]),

  q("water-azure-coast", "watersports", "azure-coast-charter", "Azure Coast", "Costa Azzurra Charter", "Charter di giornata, servizio curato.",
    { bg: "#F5FBFF", surface: "#FFFFFF", text: "#0C2231", muted: "#6C8DA3", accent: "#1D7FA8", accent2: "#E3B778" },
    { display: "Serif nautico 32px", body: "Sans 15px", treatment: "filetti oro e blu, tono yacht club" },
    { radius: "14px", border: "1px oro chiaro", grid: "8pt · card eleganti", density: "airy" },
    { nav: "tab bar bianca con ancora dorata", statusBar: "dark", signature: "bandierine nautiche come separatori" },
    "gozzo elegante su acqua turchese, marmo bianco, luce mediterranea",
    "club → itinerari → equipaggio → prenotazione",
    [m("home", "Itinerari", "Giornate in mare", ["card itinerari", "durata", "prezzo"]),
     m("crew", "Equipaggio", "Skipper e servizi", ["profilo skipper", "servizi", "catering"]),
     m("booking", "Prenota", "Data e ospiti", ["date", "ospiti", "acconto"]),
     d("admin", "Prenotazioni", "Barche e catering", ["calendario", "catering", "incassi"])]),

  q("water-adrenalina", "watersports", "jetski-adrenaline-spray", "Jetski Adrenaline", "Adrenalina Acqua", "Jet ski, flyboard, pura energia.",
    { bg: "#06231F", surface: "#0B322B", text: "#EFFFF9", muted: "#86B6AA", accent: "#00E0B8", accent2: "#FFE45E" },
    { display: "Sans italic sportivo 34px", body: "Sans condensato 14px", treatment: "spruzzi d'acqua congelati sui bordi" },
    { radius: "12px", border: "2px turchese", grid: "blocchi dinamici inclinati", density: "dense" },
    { nav: "tab bar scura con onda energetica", statusBar: "light", signature: "getti d'acqua che tagliano le card" },
    "jet ski in accelerazione, spruzzi congelati, sole a picco",
    "energia → attività → slot → liberatoria",
    [m("home", "Attività", "Jet ski, flyboard, parasailing", ["card attività", "durata", "prezzo"]),
     m("slot", "Slot orari", "Disponibilità in tempo reale", ["griglia slot", "istruttore", "meteo"]),
     m("waiver", "Liberatoria", "Firma e sicurezza", ["testo sicurezza", "firma", "documento"]),
     d("admin", "Turni e mezzi", "Uso mezzi e sicurezza", ["tabella mezzi", "turni", "incidenti/near miss"])]),
];

/* ---------------- GOLF & LEISURE (nuovo) ---------------- */
const GOLF: MockupIdentity[] = [
  q("golf-fairway-turf", "golf", "fairway-turf-scoreboard", "Fairway Turf", "Fairway Club", "Prenota la piazzola, gioca subito.",
    { bg: "#0B1F14", surface: "#12301F", text: "#EDFBF1", muted: "#8AB49A", accent: "#4ADE80", accent2: "#FDE68A" },
    { display: "Sans sportivo 32px", body: "Sans numerali tabulari 15px", treatment: "punteggi grandi e leggibili" },
    { radius: "12px", border: "1px verde prato", grid: "8pt · griglia piazzole", density: "balanced" },
    { nav: "tab bar verde scuro con pallina attiva", statusBar: "light", signature: "texture erba rasata sul fondo" },
    "driving range al tramonto, palline in volo, erba rasata",
    "piazzole → coda → punteggio → dashboard",
    [m("home", "Piazzole", "Disponibilità in tempo reale", ["griglia piazzole", "attesa stimata", "CTA"]),
     m("queue", "Coda", "Posizione e notifiche", ["numero coda", "tempo", "notifica"]),
     m("score", "Punteggio", "Sessione e statistiche", ["tabella colpi", "media", "grafico"]),
     d("admin", "Bay management", "Occupazione e ricavi", ["mappa piazzole", "turnover", "ricavi"])]),

  q("golf-clubhouse", "golf", "clubhouse-heritage-wood", "Clubhouse Heritage", "Circolo del Faggio", "Tradizione, verde, silenzio.",
    { bg: "#F6F2E9", surface: "#FFFFFF", text: "#22201A", muted: "#867F70", accent: "#2F5D3A", accent2: "#8B6B3D" },
    { display: "Serif inglese 32px", body: "Sans 15px", treatment: "albo d'oro e tono da circolo" },
    { radius: "6px", border: "1px legno scuro", grid: "8pt · tabelle classifiche", density: "balanced" },
    { nav: "tab bar avorio con crest", statusBar: "dark", signature: "crest del circolo con anno di fondazione" },
    "clubhouse in legno, trofei, luce calda da finestre alte",
    "crest → gare → classifica → prenotazione tee time",
    [m("home", "Circolo", "Gare e comunicazioni", ["crest", "card gare", "avvisi"]),
     m("leaderboard", "Classifica", "Handicap e risultati", ["tabella", "handicap", "storico"]),
     m("teetime", "Tee time", "Prenotazione partenza", ["slot partenza", "flight", "conferma"]),
     d("admin", "Segreteria", "Soci e quote", ["tabella soci", "quote", "gare"])]),

  q("golf-night-range", "golf", "night-range-floodlight", "Night Range", "Range Notturno", "Si gioca anche dopo il tramonto.",
    { bg: "#0A0D14", surface: "#131824", text: "#F0F4FF", muted: "#8994AD", accent: "#60A5FA", accent2: "#F97316" },
    { display: "Sans wide 30px", body: "Mono 13px", treatment: "traiettorie luminose sui grafici" },
    { radius: "10px", border: "1px blu freddo", grid: "8pt · pannelli dati", density: "dense" },
    { nav: "tab bar scura con faro attivo", statusBar: "light", signature: "coni di luce dei fari sul fondo" },
    "range illuminato di notte, fari, traiettorie luminose",
    "fari → sessione notturna → tracciamento colpi → abbonamento",
    [m("home", "Sessione notturna", "Fasce e prezzi", ["fasce orarie", "prezzi", "meteo"]),
     m("tracking", "Tracciamento", "Distanza e dispersione", ["grafico traiettorie", "distanza media", "dispersione"]),
     m("pass", "Abbonamento", "Ingressi e vantaggi", ["piani", "ingressi", "prezzo"]),
     d("admin", "Illuminazione e turni", "Costi e utilizzo", ["consumi", "turni", "ricavi"])]),
];

/* ---------------- CONDO / RESIDENZE (nuovo) ---------------- */
const CONDO: MockupIdentity[] = [
  q("condo-ocean-azure", "condo", "ocean-azure-resident", "Ocean Azure Resident", "Residenza Marina", "Il tuo condominio, in tasca.",
    { bg: "#F6FBFD", surface: "#FFFFFF", text: "#0F2430", muted: "#6D8B99", accent: "#2196C4", accent2: "#CDE9F2" },
    { display: "Sans leggero 30px", body: "Sans 15px", treatment: "schede servizio con icone chiare" },
    { radius: "18px", border: "1px azzurro tenue", grid: "8pt · dashboard residente", density: "balanced" },
    { nav: "tab bar bianca con onda attiva", statusBar: "dark", signature: "silhouette della torre sull'header" },
    "torre residenziale sul mare, hall luminosa, luce diurna",
    "dashboard → prenotazione amenity → segnalazioni → pagamenti",
    [m("home", "Dashboard residente", "Avvisi e scadenze", ["card avvisi", "prossime spese", "accessi"]),
     m("amenity", "Prenota amenity", "Piscina, palestra, sala", ["griglia spazi", "slot", "regole"]),
     m("ticket", "Segnalazione", "Manutenzione e stato", ["form", "foto", "stato"]),
     d("admin", "Amministrazione", "Spese e delibere", ["bilancio", "morosità", "delibere"])]),

  q("condo-rose-gold", "condo", "rose-gold-editorial-hoa", "Rose Gold Editorial", "Palazzo Aurora", "Servizi residenziali con stile.",
    { bg: "#FFF9F7", surface: "#FFFFFF", text: "#241C1E", muted: "#8E7A7C", accent: "#B76E79", accent2: "#3B3B3B" },
    { display: "Serif editoriale 34px", body: "Sans micro-caps 11px", treatment: "impaginato da rivista di condominio" },
    { radius: "0px", border: "hairline rose gold", grid: "colonne editoriali", density: "airy" },
    { nav: "tab bar bianca con etichette testuali", statusBar: "dark", signature: "testata con numero di edizione mensile" },
    "hall di design, marmo chiaro, dettagli rose gold",
    "testata → comunicazioni → servizi → assemblea",
    [m("home", "Comunicazioni", "Notizie della residenza", ["testata", "articoli", "data"]),
     m("services", "Servizi", "Concierge e prenotazioni", ["lista servizi", "orari", "richiesta"]),
     m("meeting", "Assemblea", "Ordine del giorno e voto", ["odg", "voto", "documenti"]),
     d("admin", "Consiglio", "Voti e rendiconti", ["esiti voto", "rendiconto", "fornitori"])]),

  q("condo-ice-blue", "condo", "ice-blue-ethereal-tower", "Ice Blue Ethereal", "Torre Cristallo", "Accessi, pagamenti, sicurezza.",
    { bg: "#F7FAFF", surface: "#FFFFFFCC", text: "#131C2B", muted: "#74849C", accent: "#7DA9F5", accent2: "#DCE7FA" },
    { display: "Sans sottile 28px", body: "Sans 14px", treatment: "vetri chiari sovrapposti, ombre lunghissime" },
    { radius: "24px", border: "1px bianco 70%", grid: "8pt · pannelli traslucidi", density: "airy" },
    { nav: "tab bar in vetro chiaro con indicatore blu", statusBar: "dark", signature: "riflesso verticale sui pannelli" },
    "grattacielo di vetro all'alba, riflessi freddi, hall vuota",
    "vetro → accessi → pagamenti → sicurezza",
    [m("home", "Accessi", "Apertura e ospiti", ["QR accesso", "ospiti", "storico"]),
     m("payments", "Pagamenti", "Rate e ricevute", ["rate", "metodi", "ricevute"]),
     m("security", "Sicurezza", "Telecamere e allarmi", ["feed", "eventi", "contatti"]),
     d("admin", "Portineria", "Accessi e incidenze", ["log accessi", "incidenze", "fornitori"])]),
];

/* ---------------- EQUESTRIAN (nuovo) ---------------- */
const EQUESTRIAN: MockupIdentity[] = [
  q("eq-velvet-saddle", "equestrian", "velvet-saddle-heritage", "Velvet Saddle", "Scuderia Velluto", "Cavalli, cura e tradizione.",
    { bg: "#1B1210", surface: "#271A16", text: "#F6EDE6", muted: "#A5907F", accent: "#8B3A2F", accent2: "#C9A227" },
    { display: "Serif inciso 32px", body: "Sans 15px", treatment: "cuoio e cuciture come cornice" },
    { radius: "10px", border: "cucitura a punto sellaio", grid: "8pt · schede cavallo", density: "balanced" },
    { nav: "tab bar cuoio con ferro di cavallo attivo", statusBar: "light", signature: "targhetta in ottone con nome cavallo" },
    "cavallo in scuderia, cuoio, luce calda da lucernario",
    "targhetta → cavalli → lezioni → prenotazione box",
    [m("home", "Scuderia", "Cavalli e discipline", ["card cavalli", "disciplina", "livello"]),
     m("horse", "Scheda cavallo", "Salute e ferratura", ["anagrafica", "veterinario", "ferratura"]),
     m("lesson", "Lezioni", "Istruttore e livello", ["slot", "istruttore", "livello"]),
     d("admin", "Box e costi", "Pensione e spese", ["tabella box", "spese", "fatturazione"])]),

  q("eq-midnight-stable", "equestrian", "midnight-stable-arena", "Midnight Stable", "Maneggio Notturno", "Allenamenti serali in campo coperto.",
    { bg: "#0B0F14", surface: "#141B23", text: "#EAF0F6", muted: "#8593A2", accent: "#5EEAD4", accent2: "#94A3B8" },
    { display: "Sans tecnico 30px", body: "Mono 13px", treatment: "dati di allenamento in evidenza" },
    { radius: "8px", border: "1px acciaio", grid: "8pt · pannelli dati", density: "dense" },
    { nav: "tab bar scura con indicatore acqua", statusBar: "light", signature: "tracciato del percorso in campo" },
    "campo coperto illuminato di notte, sabbia, polvere sospesa",
    "tracciato → sessioni → performance → calendario campo",
    [m("home", "Campi", "Disponibilità serale", ["mappa campi", "slot", "illuminazione"]),
     m("session", "Sessione", "Percorso e tempi", ["tracciato", "tempi", "penalità"]),
     m("stats", "Performance", "Andamento cavallo-cavaliere", ["grafico", "confronto", "note"]),
     d("admin", "Utilizzo campi", "Turni e costi", ["calendario campi", "consumi", "ricavi"])]),

  q("eq-ivory", "equestrian", "ivory-equestrian-classic", "Ivory Equestrian", "Cavalli d'Avorio", "Concorsi, eleganza, rigore.",
    { bg: "#FBF9F4", surface: "#FFFFFF", text: "#211F1B", muted: "#8A8478", accent: "#4B5D52", accent2: "#B08D57" },
    { display: "Serif classico 34px", body: "Sans 15px", treatment: "impaginato da concorso ippico" },
    { radius: "4px", border: "hairline verde scuro", grid: "8pt · tabelle risultati", density: "balanced" },
    { nav: "tab bar avorio con coccarda attiva", statusBar: "dark", signature: "coccarda di premiazione" },
    "salto ostacoli in campo erboso, divise, luce di mattina",
    "coccarda → concorsi → iscrizioni → risultati",
    [m("home", "Concorsi", "Calendario gare", ["card gare", "categoria", "sede"]),
     m("entry", "Iscrizione", "Binomio e categoria", ["form binomio", "categoria", "quota"]),
     m("results", "Risultati", "Classifica e penalità", ["tabella", "tempi", "penalità"]),
     d("admin", "Organizzazione", "Iscritti e ordini di partenza", ["tabella iscritti", "ordine partenza", "incassi"])]),
];

/* ---------------- AI SERVICES (nuovo) ---------------- */
const AISERVICES: MockupIdentity[] = [
  q("ai-voice-waveform", "aiservices", "voice-agent-waveform", "Voice Agent Waveform", "Voce Impresa", "Risponde al telefono, sempre.",
    { bg: "#0B0F1A", surface: "#131A29", text: "#EEF2FF", muted: "#8792AC", accent: "#22D3EE", accent2: "#A78BFA" },
    { display: "Sans tecnico 30px", body: "Sans 15px", treatment: "onda vocale come elemento portante" },
    { radius: "16px", border: "1px ciano 25%", grid: "8pt · card conversazione", density: "balanced" },
    { nav: "tab bar scura con onda attiva", statusBar: "light", signature: "forma d'onda animata sotto l'header" },
    "microfono e onde sonore, ambiente scuro tecnologico",
    "onda → chiamate → trascrizioni → analytics",
    [m("home", "Chiamate", "Risposte automatiche oggi", ["onda", "contatore chiamate", "stato agente"]),
     m("call", "Trascrizione", "Testo e azioni eseguite", ["trascrizione", "azioni", "sentiment"]),
     m("settings", "Configurazione", "Voce, orari, regole", ["selettore voce", "orari", "regole"]),
     d("admin", "Analytics", "Conversioni e costi", ["grafico chiamate", "conversioni", "costo/chiamata"])]),

  q("ai-dark-terminal", "aiservices", "ai-dark-terminal-node", "AI Dark Terminal", "Nodo Neurale", "Automazioni che lavorano da sole.",
    { bg: "#08090B", surface: "#101216", text: "#E6EDF3", muted: "#7D8590", accent: "#3FB950", accent2: "#58A6FF" },
    { display: "Mono bold 26px", body: "Mono 13px", treatment: "output di terminale e log reali" },
    { radius: "6px", border: "1px grigio scuro", grid: "griglia a colonne di log", density: "dense" },
    { nav: "tab bar terminale con prompt attivo", statusBar: "light", signature: "cursore lampeggiante e prompt $" },
    "server e nodi luminosi, ambiente scuro, verde terminale",
    "prompt → workflow → esecuzioni → log",
    [m("home", "Workflow", "Automazioni attive", ["lista workflow", "stato", "ultima esecuzione"]),
     m("run", "Esecuzione", "Passi e output", ["step", "log", "durata"]),
     m("logs", "Log", "Errori e retry", ["stream log", "filtri", "retry"]),
     d("admin", "Orchestrazione", "Nodi e consumi", ["grafo nodi", "consumi", "errori"])]),

  q("ai-gradient-mesh", "aiservices", "saas-gradient-mesh", "SaaS Gradient Mesh", "Automazione Chiara", "IA spiegata semplice, per PMI.",
    { bg: "#FBFCFF", surface: "#FFFFFF", text: "#0F172A", muted: "#64748B", accent: "#6366F1", accent2: "#F472B6" },
    { display: "Sans moderno 32px", body: "Sans 15px", treatment: "mesh gradient morbido dietro le sezioni" },
    { radius: "20px", border: "1px indaco chiaro", grid: "8pt · sezioni marketing", density: "airy" },
    { nav: "tab bar bianca con indicatore sfumato", statusBar: "dark", signature: "mesh gradient viola-rosa in sottofondo" },
    "team al lavoro con schermi, luce chiara, tono ottimista",
    "mesh → casi d'uso → prezzi → demo",
    [m("home", "Casi d'uso", "Cosa automatizzi davvero", ["card casi", "risparmio ore", "CTA"]),
     m("pricing", "Prezzi", "Piani e limiti", ["tabella piani", "confronto", "CTA"]),
     m("demo", "Prenota demo", "Contatto e calendario", ["form", "calendario", "conferma"]),
     d("admin", "Console cliente", "Uso e risparmio", ["KPI", "grafico uso", "fatturazione"])]),
];

export const IDENTITY_MATRIX: Record<SectorKey, MockupIdentity[]> = {

  food: [...FOOD, ...FOOD_X],
  beauty: [...BEAUTY, ...BEAUTY_X],
  ncc: [...NCC, ...NCC_X],
  fitness: [...FITNESS, ...FITNESS_X],
  hospitality: [...HOSPITALITY, ...HOSPITALITY_X],
  realestate: [...REALESTATE, ...REALESTATE_X],
  healthcare: [...HEALTHCARE, ...HEALTHCARE_X],
  legal: LEGAL,
  retail: [...RETAIL, ...RETAIL_X],
  events: EVENTS,
  education: EDUCATION,
  petcare: PETCARE,
  childcare: CHILDCARE,
  homeservices: HOMESERVICES,
  watersports: WATERSPORTS,
  golf: GOLF,
  condo: CONDO,
  equestrian: EQUESTRIAN,
  aiservices: AISERVICES,
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
  petcare: "Pet Care & Veterinaria",
  childcare: "Nidi & Infanzia",
  homeservices: "Servizi per la Casa",
  watersports: "Charter & Sport Acquatici",
  golf: "Golf & Leisure",
  condo: "Residenze & Condomini",
  equestrian: "Equestre & Scuderie",
  aiservices: "Servizi IA & Automazioni",
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
 * FIRMA MATERICA — UNA PER OGNI FAMIGLIA, MAI RIUSATA.
 * material = come vive la superficie, light = luce dell'interfaccia,
 * backdrop = fondale del device, staging = messa in scena/camera,
 * motif = effetto-firma esclusivo di quello stile.
 * Nessun default: la mappa è completa (Record esaustivo) così due mockup
 * non possono mai condividere la stessa firma.
 */
export type SurfaceSignature = {
  material: string;
  light: string;
  backdrop: string;
  staging: string;
  motif: string;
};

export const SURFACE_SIGNATURES: Record<IdentityFamily, SurfaceSignature> = {
  // ---------- FOOD ----------
  "neo-editorial-magazine": { material: "carta avorio con grana 3%, filetti stampati, zero ombre", light: "luce di finestra radente da sinistra", backdrop: "avorio caldo a gradiente morbido", staging: "device centrato, ombra corta a terra, respiro ampio", motif: "gabbia editoriale con numeri di pagina e capolettera serif" },
  "midnight-lacquer": { material: "lacca nera profonda semi-riflettente, bordo luminoso 1px", light: "rim light caldo singolo, ombre profonde", backdrop: "carbone con sweep morbido", staging: "device isolato in penombra, riflesso verticale sul vetro", motif: "riflesso speculare che scivola sui pannelli come su un pianoforte" },
  "neo-brutalist-industrial": { material: "cemento e carta riso, tratti 2px pieni, zero morbidezze", light: "flash diretto duro", backdrop: "cemento grigio piatto", staging: "device appoggiato frontalmente con ombra dura a 45°", motif: "blocchi spostati fuori griglia e timbri inchiostrati" },
  "mediterranean-sunlit": { material: "marmo bianco e ceramica smaltata", light: "sole a picco con ombre nette di foglie", backdrop: "calce luminoso", staging: "device in luce naturale, ombra fogliare proiettata sul fondale", motif: "ombre botaniche che tagliano le card" },
  "swiss-clinical-grid": { material: "carta bianca ad alta grammatura, inchiostro nero secco", light: "luce piatta senza direzione", backdrop: "bianco puro senza gradiente", staging: "device perfettamente ortogonale, ombra minima 2px", motif: "griglia svizzera visibile e allineamenti a filo millimetrico" },

  // ---------- BEAUTY ----------
  "porcelain-couture": { material: "porcellana satinata, hairline rosati, ombre pastose", light: "beauty dish morbidissimo", backdrop: "cipria a gradiente", staging: "device su piano lucido con riflesso morbido", motif: "bordi perlati che catturano un unico bagliore" },
  "chrome-y2k-gloss": { material: "cromo liquido specchiante, pillole 3D iridescenti", light: "gel lighting magenta/ciano", backdrop: "nero lucido con riflesso", staging: "device sospeso con riflesso a specchio sotto", motif: "blob cromati che deformano lo sfondo come mercurio" },
  "botanical-apothecary": { material: "vetro ambrato, etichette gommate, legno grezzo", light: "luce calda da serra, pulviscolo visibile", backdrop: "verde salvia profondo", staging: "device tra ombre di foglie fuori fuoco", motif: "etichette apothecary con cornici incise e sigilli botanici" },
  "graphite-atelier": { material: "grafite spazzolata e carta nera, tratti a matita", light: "luce laterale bassa a contrasto alto", backdrop: "antracite uniforme", staging: "device in taglio di luce netto, resto in ombra", motif: "tratteggi a matita e misure d'atelier annotate a mano" },
  "pastel-riso-print": { material: "stampa risograph con mis-registro 1px e overprint", light: "luce piatta da scanner", backdrop: "pesca pastello granuloso", staging: "device fotografato come oggetto di stampa, ombra finta serigrafata", motif: "sovrastampa a due inchiostri sfalsati" },

  // ---------- NCC ----------
  "obsidian-chauffeur": { material: "pelle nera trapuntata e metallo brunito", light: "luce notturna urbana radente", backdrop: "nero con scie di fari sfocate", staging: "device in interno auto, riflessi lunghi orizzontali", motif: "cuciture di pelle e badge metallico inciso" },
  "aviation-instrument": { material: "vetro strumento antiriflesso, reticoli incisi, tacche graduate", light: "retroilluminazione fredda da cockpit", backdrop: "blu notte vignettato", staging: "device come strumento di bordo, luce interna prevalente", motif: "quadranti, gradazioni e rotte vettoriali sovrapposte" },
  "ivory-concierge": { material: "avorio spesso goffrato e ottone spazzolato", light: "luce alberghiera calda diffusa", backdrop: "sabbia chiara setosa", staging: "device su marmo chiaro con riflesso tenue", motif: "monogramma inciso e filetti in ottone" },
  "carbon-motorsport": { material: "carbonio a trama visibile, alluminio anodizzato", light: "luce da pit lane con hotspot mobili", backdrop: "nero tecnico con bagliore rosso", staging: "device con ombra stretta, contrasto altissimo", motif: "telemetria a barre e trama carbon che segue la curvatura" },
  "art-deco-transit": { material: "ottone lucido, onice e intarsi geometrici", light: "luce a ventaglio anni '30", backdrop: "verde bottiglia profondo", staging: "device incorniciato da raggi decò sfumati", motif: "ventagli, archi e cornici simmetriche in oro" },

  // ---------- FITNESS ----------
  "acid-performance": { material: "gomma tecnica opaca e blocchi pieni, spigoli netti", light: "neon duro da palestra", backdrop: "antracite con alone acido", staging: "device frontale con controluce acido dietro", motif: "barre di carico e cronometri sovradimensionati" },
  "monastic-recovery": { material: "lino e legno chiaro, superfici latte opaline", light: "luce naturale nebbiosa", backdrop: "sabbia opaco", staging: "device su tessuto, ombra lunghissima e morbida", motif: "cerchi di respirazione concentrici quasi impercettibili" },
  "tactical-hud": { material: "vetro corazzato scuro con reticolo HUD e stencil", light: "backlight verde tattico", backdrop: "verde militare desaturato", staging: "device come visore, vignettatura marcata", motif: "crosshair, coordinate e marker di target" },
  "sunrise-gradient-flow": { material: "vetro caldo con gradienti fluidi corallo-oro", light: "alba morbida da destra", backdrop: "gradiente pesca-lavanda", staging: "device immerso in bagliore d'alba, bordi luminosi", motif: "onde di gradiente che attraversano le card" },
  "typographic-scoreboard": { material: "LED e plastica opaca, cifre condensate enormi", light: "emissione luminosa dallo schermo stesso", backdrop: "nero pece", staging: "device come tabellone, luce solo dallo schermo", motif: "punteggi giganti con puntinatura LED" },

  // ---------- HOSPITALITY ----------
  "coastal-linen": { material: "lino grezzo e legno sbiancato dal sale", light: "luce marina alta e limpida", backdrop: "azzurro pallido lavato", staging: "device su lino, ombra irregolare del tessuto", motif: "trame di tessuto e onde disegnate a filetto" },
  "alpine-timber": { material: "legno di larice e feltro grigio", light: "luce fredda di neve riflessa", backdrop: "grigio pietra con nebbia", staging: "device su tavola in legno, ombra fredda", motif: "profili di vetta e giunzioni in legno" },
  "grand-hotel-classic": { material: "marmo venato, oro brunito e boiserie", light: "lampadario caldo, riflessi puntiformi", backdrop: "bordeaux profondo", staging: "device su marmo con riflesso nitido", motif: "cornici classiche e stemma dorato" },
  "desert-adobe": { material: "argilla adobe e intonaco ruvido", light: "sole del deserto al tramonto", backdrop: "terracotta calda", staging: "device con ombra netta color ruggine", motif: "archi in terra cruda e bordi smussati a mano" },
  "nocturne-jazz-lounge": { material: "VETRO LIQUIDO: pannelli traslucidi, blur pesante, bordo bianco 12%, highlight speculare superiore", light: "bokeh blu notturno dietro il vetro, riflessi champagne", backdrop: "midnight con bokeh sfocato", staging: "device sospeso su fondale bokeh, glow interno visibile", motif: "lastre di vetro che si sovrappongono come luci di scena" },

  // ---------- REAL ESTATE ----------
  "blueprint-architectural": { material: "carta da lucido blu e tratti tecnici bianchi", light: "luce da tavolo luminoso", backdrop: "blu blueprint uniforme", staging: "device su tavolo tecnico, ombra piatta", motif: "quote, sezioni e retini architettonici" },
  "gallery-white-cube": { material: "gesso bianco opaco, cornici a filo muro", light: "faretti da galleria dall'alto", backdrop: "bianco galleria con ombra a terra", staging: "device come opera esposta, luce dall'alto", motif: "didascalie di galleria e vuoti generosi" },
  "terracotta-tuscan": { material: "cotto toscano, gesso e ferro battuto", light: "luce dorata di collina al tardo pomeriggio", backdrop: "ocra caldo", staging: "device su cotto, ombra calda allungata", motif: "archi toscani e bordi consumati" },
  "glass-tower-metropolitan": { material: "VETRO ARCHITETTONICO: lastre trasparenti sovrapposte, riflesso diagonale, profondità a strati", light: "blue hour con riflessi a specchio", backdrop: "grafite con skyline sfocato", staging: "device con riflesso di grattacieli sul vetro", motif: "riflessi diagonali che tagliano l'intera interfaccia" },
  "cadastral-map-mono": { material: "carta catastale beige con inchiostro seppia", light: "luce d'archivio fredda e piatta", backdrop: "beige archivio", staging: "device come documento su tavolo d'archivio", motif: "particelle catastali, retini e timbri di protocollo" },

  // ---------- HEALTHCARE ----------
  "sterile-mint-clinic": { material: "superfici cliniche opache, bordi menta chiarissimi", light: "luce clinica diffusa senza ombre", backdrop: "menta pallidissimo", staging: "device igienico e neutro, ombra quasi assente", motif: "icone mediche a linea sottile e spazi ariosi" },
  "soft-neumorphic-care": { material: "neumorfismo latteo: doppia ombra dentro/fuori, rilievi morbidi", light: "luce omnidirezionale morbida", backdrop: "grigio-latte uniforme", staging: "device su superficie identica al fondo, rilievo per sola ombra", motif: "pulsanti estrusi e incavi soffici" },
  "deep-navy-diagnostic": { material: "vetro blu notte con tracciati luminosi", light: "backlight ciano diagnostico", backdrop: "navy profondo", staging: "device come monitor clinico in stanza buia", motif: "tracciati vitali e soglie evidenziate" },
  "paper-chart-analog": { material: "cartella clinica in carta, moduli prestampati, graffette", light: "luce da scrivania calda", backdrop: "carta crema", staging: "device come cartella appoggiata, ombra di graffetta", motif: "moduli barrati a penna e caselle spuntate" },
  "human-warm-gradient": { material: "gradienti caldi pesca-ambra su vetro morbido", light: "luce avvolgente frontale", backdrop: "ambra tenue", staging: "device con alone caldo attorno, bordi che sfumano", motif: "forme organiche arrotondate e ritratti in tondo" },

  // ---------- LEGAL ----------
  "chancery-oxblood": { material: "pelle e noce, sigillo in ceralacca in rilievo, filetti oro incisi", light: "lampada da studio calda laterale", backdrop: "marrone scuro profondo", staging: "device su scrivania in pelle, luce da lampada", motif: "sigilli, ceralacca e capolettera dorati" },
  "marble-classical": { material: "marmo statuario levigato e bronzo", light: "luce da lucernario, ombre scultoree", backdrop: "bianco marmo venato", staging: "device su base scultorea, ombra netta e nobile", motif: "colonne, timpani e maiuscolette incise" },
  "raw-legal-mono": { material: "carta uso mano e monospace battuto a macchina", light: "luce da ufficio neutra", backdrop: "grigio carta riciclata", staging: "device come documento, nessun effetto", motif: "numerazione di comma e righe di tabulazione" },
  "navy-pinstripe-corporate": { material: "tessuto gessato blu e acciaio satinato", light: "luce corporate fredda e ordinata", backdrop: "navy con trama gessata", staging: "device su tessuto gessato, ombra pulita", motif: "righine verticali che ritmano le sezioni" },
  "quiet-luxury-parchment": { material: "pergamena spessa, goffratura a secco, nessun colore acceso", light: "luce museale bassissima", backdrop: "sabbia pergamena", staging: "device quasi immerso nel fondale, ombra impercettibile", motif: "goffrature a secco visibili solo di taglio" },

  // ---------- RETAIL ----------
  "hyper-color-pop": { material: "plastica lucida saturissima e adesivi die-cut", light: "flash pop diretto", backdrop: "fucsia elettrico piatto", staging: "device con ombra colorata dura, energia da vetrina", motif: "sticker, badge sconto e forme pop ritagliate" },
  "monochrome-boutique": { material: "carta nera opaca e bianco secco, zero accenti", light: "luce boutique puntuale", backdrop: "grigio fumo neutro", staging: "device isolato, contrasto estremo bianco/nero", motif: "solo tipografia e filetti, nessun colore" },
  "warehouse-utility": { material: "metallo zincato, nastro adesivo e stencil industriali", light: "luce a soffitto industriale", backdrop: "grigio zinco", staging: "device su superficie metallica, riflesso graffiato", motif: "codici a barre, stencil e nastri di segnalazione" },
  "vitrine-jewel-box": { material: "velluto nero e filetti oro, scintillio puntiforme", light: "luce puntiforme singola da vetrina", backdrop: "nero velluto", staging: "device come gioiello in teca, alone stretto", motif: "scintille puntiformi sui bordi dorati" },
  "zine-collage": { material: "fotocopie, ritagli incollati e nastro carta", light: "luce da fotocopiatrice contrastata", backdrop: "carta grigia fotocopiata", staging: "device come pagina di zine, bordi irregolari", motif: "ritagli sovrapposti e testo ritagliato a mano" },

  // ---------- EVENTS ----------
  "neon-club-poster": { material: "tubi neon su muro scuro umido, inchiostro fluo", light: "neon magenta e ciano con bagliore diffuso", backdrop: "nero con aloni neon", staging: "device immerso nel bagliore neon, riflessi sul vetro", motif: "scritte neon e liste line-up sovrapposte" },
  "champagne-gala": { material: "seta champagne, oro chiaro e cristallo", light: "luci scintillanti da gala", backdrop: "champagne a gradiente", staging: "device con bokeh dorato, riflessi cristallini", motif: "bollicine e filetti oro sottilissimi" },
  "festival-ticket-stub": { material: "cartoncino biglietto con bordi perforati e strappo", light: "luce da festival calda a fine giornata", backdrop: "kraft caldo", staging: "device come biglietto strappato, ombra irregolare", motif: "perforazioni, matrici e timbri di ingresso" },
  "kinetic-typography": { material: "lettere estruse in movimento con motion blur direzionale", light: "luce che segue il moto delle lettere", backdrop: "nero con scie tipografiche", staging: "device con testo che fuoriesce virtualmente dai bordi", motif: "parole ripetute in scala crescente" },
  "velvet-curtain": { material: "velluto bordeaux con drappeggio e cordoni oro", light: "luci di scena calde radenti", backdrop: "sipario in penombra", staging: "device incorniciato dal drappeggio, luce da palco", motif: "pieghe di sipario e cordoni dorati" },

  // ---------- EDUCATION ----------
  "chalkboard-scholastic": { material: "lavagna verde con gesso e polvere", light: "luce d'aula da finestre alte", backdrop: "verde lavagna", staging: "device appoggiato al canaletto del gesso", motif: "tratti di gesso, frecce e schemi scritti a mano" },
  "playful-block-primary": { material: "plastica atossica a blocchi primari, angoli morbidissimi", light: "luce allegra piatta", backdrop: "giallo primario", staging: "device tra blocchi colorati fuori fuoco", motif: "forme geometriche giocose e badge tondi" },
  "campus-modernist": { material: "cemento a vista e vetro verde bottiglia modernista", light: "luce architettonica laterale", backdrop: "beige cemento", staging: "device su cemento, ombra architettonica netta", motif: "moduli quadrati e segnaletica da campus" },
  "notebook-dotgrid": { material: "carta dot-grid con inchiostro blu e washi tape", light: "luce da scrivania naturale", backdrop: "bianco carta puntinata", staging: "device come quaderno aperto, ombra di pagina", motif: "puntinatura visibile, note a margine e washi tape" },
  "cyber-academy": { material: "vetro scuro con reticolo neon viola e scanline", light: "backlight viola con leggero glitch", backdrop: "viola notte con griglia in fuga", staging: "device in ambiente cyber, griglia prospettica dietro", motif: "barre XP, scanline e badge di livello" },
};

export function getSurface(identity: MockupIdentity): SurfaceSignature {
  return SURFACE_SIGNATURES[identity.family];
}


/**
 * Costruisce il prompt per una singola schermata.
 * Mobile → render fotorealistico DENTRO iPhone 16 Pro Max perfettamente frontale.
 * Desktop → screenshot flat full-bleed senza cornice (massima visibilità contenuto).
 */
export function buildScreenPrompt(identity: MockupIdentity, screen: ScreenSpec): string {
  const isDesktop = screen.surface === "desktop";
  const s = getSurface(identity);

  const canvas = isDesktop
    ? [
        "Ultra-realistic full-bleed DESKTOP web app screenshot, 16:10, NO browser chrome, NO device frame — puro canvas UI a tutta immagine, nitidezza retina.",
      ].join("\n")
    : [
        "Render fotorealistico 8K di UN SOLO iPhone 16 Pro Max in titanio naturale, vista perfettamente FRONTALE, ZERO rotazione e ZERO inclinazione, dispositivo verticale e centrato, ombra morbida realistica sotto.",
        "Micro-highlight sul bevel in titanio, Dynamic Island centrata, home indicator iOS.",
        `MESSA IN SCENA (esclusiva di questo stile): ${s.staging}.`,
        `Fondale: ${s.backdrop}. Nessun secondo telefono, nessun oggetto, nessun testo fuori dallo schermo.`,
        "LO SCHERMO deve mostrare la UI a tutta superficie, nitidissima e leggibile in ogni dettaglio.",
      ].join("\n");

  return [
    canvas,
    ``,
    `BRAND: "${identity.brand}" — ${identity.tagline}`,
    `IDENTITÀ VISIVA: ${identity.label} (famiglia ${identity.family}) — deve risultare inconfondibile e diversa al 360% da qualsiasi altro stile: nessuna base condivisa, nessun layout ripetuto.`,
    ``,
    `PALETTE (usare esattamente): bg ${identity.palette.bg}, surface ${identity.palette.surface}, testo ${identity.palette.text}, muted ${identity.palette.muted}, accento ${identity.palette.accent}, secondario ${identity.palette.accent2}.`,
    `TIPOGRAFIA: display ${identity.typography.display}; body ${identity.typography.body}; trattamento ${identity.typography.treatment}.`,
    `GEOMETRIA: raggio ${identity.geometry.radius}; bordi ${identity.geometry.border}; griglia ${identity.geometry.grid}; densità ${identity.geometry.density}.`,
    `MATERIA DELLE SUPERFICI: ${s.material}.`,
    `LUCE DELL'INTERFACCIA: ${s.light}.`,
    `EFFETTO-FIRMA UNICO (deve essere visibile e non comparire in nessun altro stile): ${s.motif}.`,
    `CHROME: ${identity.chrome.nav}; status bar ${identity.chrome.statusBar === "light" ? "chiara su fondo scuro" : "scura su fondo chiaro"} con 9:41; segno distintivo: ${identity.chrome.signature}.`,
    `FOTOGRAFIA INTERNA: ${identity.photography}.`,
    `RITMO COMPOSITIVO: ${identity.composition}.`,
    ``,
    `SCHERMATA: ${screen.title} — ${screen.purpose}.`,
    `ELEMENTI OBBLIGATORI: ${screen.elements.join(", ")}.`,
    ``,
    `CRAFT: griglia 8pt rigorosa, allineamenti ottici perfetti, gerarchia tipografica da studio premiato, testo nitido retina, numeri credibili e coerenti, tutte le stringhe in italiano professionale reale (nessun lorem ipsum, nessun testo inglese, nessuna scritta illeggibile), target touch realistici.`,
    isDesktop
      ? `VIETATI: cornici di dispositivo, MacBook, finestre browser, watermark, loghi Apple/Google/Meta, wireframe, template generico, ombre attorno al canvas, riuso di layout visti in altri stili.`
      : `VIETATI: iPhone dentro iPhone, screenshot dentro screenshot, secondo dispositivo, watermark, loghi Apple/Google/Meta, wireframe, template generico, prospettiva inclinata, riuso di layout/effetti visti in altri stili.`,
  ].join("\n");
}

/** Prompt completo di una identità (tutte le sue schermate: mobile in cornice + desktop flat). */
export function buildIdentityPrompts(identity: MockupIdentity): { screen: ScreenSpec; prompt: string }[] {
  return identity.screens.map((screen) => ({ screen, prompt: buildScreenPrompt(identity, screen) }));
}


/** Verifica che nessuna famiglia, materia, luce, fondale, staging o motivo sia riusato. */
export function assertMatrixIntegrity(): {
  ok: boolean;
  duplicates: string[];
  surfaceDuplicates: string[];
  totals: Record<string, number>;
} {
  const seen = new Map<string, number>();
  ALL_IDENTITIES.forEach((i) => seen.set(i.family, (seen.get(i.family) ?? 0) + 1));
  const duplicates = Array.from(seen.entries()).filter(([, n]) => n > 1).map(([f]) => f);

  const surfaceDuplicates: string[] = [];
  (["material", "light", "backdrop", "staging", "motif"] as const).forEach((k) => {
    const bag = new Map<string, string[]>();
    (Object.keys(SURFACE_SIGNATURES) as IdentityFamily[]).forEach((f) => {
      const v = SURFACE_SIGNATURES[f][k];
      bag.set(v, [...(bag.get(v) ?? []), f]);
    });
    bag.forEach((fams, v) => {
      if (fams.length > 1) surfaceDuplicates.push(`${k}="${v}" → ${fams.join(", ")}`);
    });
  });

  const totals = Object.fromEntries(
    (Object.keys(IDENTITY_MATRIX) as SectorKey[]).map((s) => [s, IDENTITY_MATRIX[s].length]),
  );
  return {
    ok: duplicates.length === 0 && surfaceDuplicates.length === 0,
    duplicates,
    surfaceDuplicates,
    totals,
  };
}
