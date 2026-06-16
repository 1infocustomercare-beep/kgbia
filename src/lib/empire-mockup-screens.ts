/**
 * Empire proprietary mockup screen generator.
 * Turns every legacy catalog filename into a deterministic, production-like UI
 * screenshot: sector-aware, style-aware and screen-aware. No external assets.
 */

type ScreenKind = "home" | "menu" | "detail" | "booking" | "cart" | "dashboard" | "fleet" | "services" | "profile" | "map";

type SectorKind =
  | "food" | "sushi" | "ncc" | "boat" | "beauty" | "healthcare" | "fitness" | "hospitality"
  | "realestate" | "retail" | "technical" | "agriturismo" | "cleaning" | "legal" | "accounting"
  | "garage" | "photography" | "construction" | "gardening" | "tattoo" | "education" | "events"
  | "logistics" | "beach" | "veterinary" | "childcare" | "generic";

type LayoutKind = "editorial" | "bento" | "split" | "dashboard" | "market" | "concierge" | "zen" | "neon";

type Tokens = {
  bg: string; panel: string; panel2: string; text: string; muted: string; primary: string; accent: string;
  radius: number; heading: string; body: string; layout: LayoutKind; hero: string; icon: string;
};

const W = 390;
const H = 844;

function hashStr(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h += (h << 1) + (h << 4) + (h << 7) + (h << 8) + (h << 24); }
  return Math.abs(h >>> 0);
}

function esc(s: string): string {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/\"/g, "&quot;").replace(/'/g, "&apos;");
}

function titleCase(raw: string): string {
  return decodeURIComponent(raw)
    .replace(/[-_]+/g, " ")
    .replace(/\.(png|jpg|jpeg|webp)$/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (m) => m.toUpperCase());
}

function brandFromPath(path: string, fallback?: string): string {
  if (fallback) return fallback;
  const first = path.split("/")[0] || path;
  const clean = titleCase(first).replace(/Mobile|Desktop|Home|Menu|Detail|Cart|Booking/gi, "").trim();
  return clean || "Empire Studio";
}

function screenFromPath(path: string): ScreenKind {
  const p = path.toLowerCase();
  if (/dashboard|stats|timeline|deadlines|repairs|tracking|maintenance|community/.test(p)) return "dashboard";
  if (/fleet|drivers|route|escursioni|tour|map/.test(p)) return "fleet";
  if (/booking|prenota|reservation|calendar|schedule|contact|enroll/.test(p)) return "booking";
  if (/cart|checkout|payment|invoice|billing/.test(p)) return "cart";
  if (/detail|product|unit|room|case|artist|course|yacht/.test(p)) return "detail";
  if (/services|servizi|menu|catalog|activities|programs|shop|gallery/.test(p)) return "menu";
  if (/profile|client|patient|member/.test(p)) return "profile";
  return "home";
}

function sectorFromPath(path: string): SectorKind {
  const p = path.toLowerCase();
  if (/sakura|indocina|sushi|ramen|japanese|tsukiji|hinoki/.test(p)) return "sushi";
  if (/pizzeria|pizza|steak|brace|restaurant|ristor|trattoria|osteria|levante|ceviche|deli|food|cote|pacifico/.test(p)) return "food";
  if (/ncc|transfer|limousine|driver|asinara|cala|charter/.test(p)) return "ncc";
  if (/boat|yacht|marina|riviera|batey/.test(p)) return "boat";
  if (/beauty|hair|nail|spa|velluto|aurora|salon/.test(p)) return "beauty";
  if (/clinic|medical|dental|dent|physio|health|lumen/.test(p)) return "healthcare";
  if (/fitness|gym|padel|sport|trainer|onda/.test(p)) return "fitness";
  if (/hotel|hospitality|resort|room|suite|guest/.test(p)) return "hospitality";
  if (/real|estate|domus|resident|immobil|unit/.test(p)) return "realestate";
  if (/retail|shop|store|boutique|cart|product/.test(p)) return "retail";
  if (/plumb|electric|nick|ac\b/.test(p)) return "technical";
  if (/agriturismo|farm|ranch/.test(p)) return "agriturismo";
  if (/clean|pulizie/.test(p)) return "cleaning";
  if (/legal|law|case|avvocato|deadline/.test(p)) return "legal";
  if (/account|invoice|commercialista|fiscal/.test(p)) return "accounting";
  if (/garage|mechanic|officina|repair/.test(p)) return "garage";
  if (/photo|gallery|studio/.test(p)) return "photography";
  if (/construction|edil|cantiere/.test(p)) return "construction";
  if (/garden|giardin/.test(p)) return "gardening";
  if (/tattoo/.test(p)) return "tattoo";
  if (/education|school|academy|course|formazione/.test(p)) return "education";
  if (/event|wedding|timeline/.test(p)) return "events";
  if (/logistic|delivery|tracking|trasporto/.test(p)) return "logistics";
  if (/beach|umbrella|spiaggia/.test(p)) return "beach";
  if (/pet|veterinary|tropico/.test(p)) return "veterinary";
  if (/nursery|child|playhouse|baby|stelle/.test(p)) return "childcare";
  return "generic";
}

const sectorThemes: Record<SectorKind, Tokens[]> = {
  food: [
    { bg: "#090706", panel: "#17110D", panel2: "#241813", text: "#FFF3E4", muted: "#B79A7A", primary: "#D8A441", accent: "#B9462D", radius: 18, heading: "Georgia", body: "Arial", layout: "editorial", hero: "Signature fire table", icon: "◒" },
    { bg: "#FBF2E3", panel: "#FFFDFC", panel2: "#F2D7BA", text: "#342012", muted: "#8A644A", primary: "#C64E2C", accent: "#2D6B46", radius: 24, heading: "Trebuchet MS", body: "Arial", layout: "market", hero: "Forno vivo", icon: "✦" },
    { bg: "#10151A", panel: "#17212A", panel2: "#25313A", text: "#F7EFE4", muted: "#94A3AD", primary: "#F2B84B", accent: "#E86F4D", radius: 8, heading: "Impact", body: "Arial", layout: "bento", hero: "Open kitchen", icon: "◆" },
  ],
  sushi: [
    { bg: "#0B0A0C", panel: "#171216", panel2: "#231A20", text: "#FFF4F7", muted: "#BFA2AA", primary: "#E9A1B7", accent: "#D7B56D", radius: 12, heading: "Georgia", body: "Arial", layout: "zen", hero: "Omakase counter", icon: "◯" },
    { bg: "#F9F6F0", panel: "#FFFFFF", panel2: "#EFE4DA", text: "#16110F", muted: "#776A61", primary: "#D33143", accent: "#0F5D4C", radius: 4, heading: "Times New Roman", body: "Arial", layout: "editorial", hero: "Nigiri selection", icon: "一" },
    { bg: "#071614", panel: "#0F2722", panel2: "#183B32", text: "#EFFFF8", muted: "#8DBCAD", primary: "#79E0B2", accent: "#FF5A5F", radius: 18, heading: "Verdana", body: "Arial", layout: "bento", hero: "Matcha bar", icon: "◇" },
  ],
  ncc: [
    { bg: "#07090D", panel: "#131821", panel2: "#1F2632", text: "#F7F4EA", muted: "#9DA5B2", primary: "#D8C28B", accent: "#7EA7D9", radius: 14, heading: "Georgia", body: "Arial", layout: "concierge", hero: "Executive transfer", icon: "◈" },
    { bg: "#F4F1EA", panel: "#FFFFFF", panel2: "#E5E0D5", text: "#18202A", muted: "#69717E", primary: "#1C334E", accent: "#B9955E", radius: 10, heading: "Times New Roman", body: "Arial", layout: "dashboard", hero: "Fleet control", icon: "▣" },
  ],
  boat: [
    { bg: "#061420", panel: "#0C2435", panel2: "#12344B", text: "#F6EBCF", muted: "#91B2C4", primary: "#59C7D8", accent: "#FF8B68", radius: 22, heading: "Georgia", body: "Arial", layout: "concierge", hero: "Costa itinerary", icon: "≈" },
    { bg: "#F7F2E8", panel: "#FFFFFF", panel2: "#E4D3B2", text: "#0D2A3A", muted: "#5E7582", primary: "#0D5578", accent: "#D8B76E", radius: 18, heading: "Times New Roman", body: "Arial", layout: "split", hero: "Private yacht", icon: "◌" },
  ],
  beauty: [
    { bg: "#FFF4F7", panel: "#FFFFFF", panel2: "#F7DCE7", text: "#3A2330", muted: "#9D6D82", primary: "#E78AAD", accent: "#9B8AD7", radius: 26, heading: "Georgia", body: "Arial", layout: "zen", hero: "Treatment ritual", icon: "✧" },
    { bg: "#100D11", panel: "#1E171D", panel2: "#302330", text: "#FFF1F7", muted: "#BFA1B2", primary: "#F3A0C4", accent: "#D8B56D", radius: 16, heading: "Times New Roman", body: "Arial", layout: "editorial", hero: "Nail atelier", icon: "✺" },
    { bg: "#F5F0EA", panel: "#FFFFFF", panel2: "#E7DDD2", text: "#2E2925", muted: "#80746A", primary: "#A77655", accent: "#6F9184", radius: 8, heading: "Verdana", body: "Arial", layout: "bento", hero: "Hair lab", icon: "✂" },
  ],
  healthcare: [
    { bg: "#F5FBFA", panel: "#FFFFFF", panel2: "#DDEDEA", text: "#102D2A", muted: "#5E7873", primary: "#20A78D", accent: "#5DADEC", radius: 14, heading: "Verdana", body: "Arial", layout: "dashboard", hero: "Patient pathway", icon: "+" },
    { bg: "#0B1820", panel: "#112735", panel2: "#18394B", text: "#ECFAFF", muted: "#9CC2D0", primary: "#6EE7D8", accent: "#8AB4FF", radius: 18, heading: "Trebuchet MS", body: "Arial", layout: "bento", hero: "Clinical flow", icon: "✚" },
  ],
  fitness: [
    { bg: "#080808", panel: "#161616", panel2: "#242424", text: "#F7F7F0", muted: "#A4A49C", primary: "#C8FF00", accent: "#FF3D3D", radius: 12, heading: "Impact", body: "Arial", layout: "neon", hero: "Performance class", icon: "▲" },
    { bg: "#EEF8F1", panel: "#FFFFFF", panel2: "#D7ECD9", text: "#183323", muted: "#65806D", primary: "#2EA966", accent: "#3B8DE3", radius: 20, heading: "Trebuchet MS", body: "Arial", layout: "market", hero: "Padel club", icon: "●" },
  ],
  hospitality: [
    { bg: "#10100D", panel: "#1D1A14", panel2: "#2B261A", text: "#FFF5DE", muted: "#B9AA8D", primary: "#D8B76E", accent: "#6EC6D8", radius: 16, heading: "Georgia", body: "Arial", layout: "concierge", hero: "Suite concierge", icon: "◇" },
    { bg: "#F7F0E6", panel: "#FFFFFF", panel2: "#E8DAC7", text: "#23313A", muted: "#71808A", primary: "#1F5A73", accent: "#C99B66", radius: 22, heading: "Times New Roman", body: "Arial", layout: "split", hero: "Resort booking", icon: "✦" },
  ],
  realestate: [{ bg: "#F5F1EA", panel: "#FFFFFF", panel2: "#E5DDCF", text: "#182737", muted: "#667486", primary: "#1A334D", accent: "#B99762", radius: 10, heading: "Georgia", body: "Arial", layout: "dashboard", hero: "Property portfolio", icon: "□" }],
  retail: [{ bg: "#111114", panel: "#1B1B21", panel2: "#2A2530", text: "#FFF7F0", muted: "#B4A8A0", primary: "#F2A65A", accent: "#E85D75", radius: 18, heading: "Trebuchet MS", body: "Arial", layout: "market", hero: "Curated shop", icon: "◍" }],
  technical: [{ bg: "#08111F", panel: "#101D31", panel2: "#1A2B44", text: "#EDF6FF", muted: "#9DB2C8", primary: "#49A7FF", accent: "#FFC857", radius: 12, heading: "Verdana", body: "Arial", layout: "dashboard", hero: "Urgent dispatch", icon: "⚡" }],
  agriturismo: [{ bg: "#10170E", panel: "#1A2617", panel2: "#26351F", text: "#F2ECD9", muted: "#A8B28C", primary: "#9BC46A", accent: "#D9A15B", radius: 22, heading: "Georgia", body: "Arial", layout: "split", hero: "Country stay", icon: "✿" }],
  cleaning: [{ bg: "#F3FBFF", panel: "#FFFFFF", panel2: "#DDEFF7", text: "#123040", muted: "#648091", primary: "#28A8D8", accent: "#82C66F", radius: 18, heading: "Verdana", body: "Arial", layout: "dashboard", hero: "Clean schedule", icon: "✦" }],
  legal: [{ bg: "#0E0D0B", panel: "#1B1813", panel2: "#292318", text: "#F7EDD8", muted: "#AFA086", primary: "#C4A05E", accent: "#E5D1A1", radius: 6, heading: "Georgia", body: "Arial", layout: "dashboard", hero: "Case desk", icon: "§" }],
  accounting: [{ bg: "#F8F5EF", panel: "#FFFFFF", panel2: "#EDE6D8", text: "#1E2C3C", muted: "#6B7886", primary: "#1E5F74", accent: "#C69B55", radius: 10, heading: "Verdana", body: "Arial", layout: "dashboard", hero: "Fiscal control", icon: "%" }],
  garage: [{ bg: "#111111", panel: "#1D1D1D", panel2: "#2B2B2B", text: "#F4F4F4", muted: "#AAAAAA", primary: "#FFB020", accent: "#D94832", radius: 10, heading: "Impact", body: "Arial", layout: "dashboard", hero: "Workshop queue", icon: "⚙" }],
  photography: [{ bg: "#0C0C0F", panel: "#17171D", panel2: "#27232C", text: "#FAF7F2", muted: "#B1A8B7", primary: "#D8C4A0", accent: "#9DA8FF", radius: 14, heading: "Georgia", body: "Arial", layout: "editorial", hero: "Editorial gallery", icon: "◎" }],
  construction: [{ bg: "#121212", panel: "#1E1E1E", panel2: "#2E2A22", text: "#F8F4EA", muted: "#B3AA99", primary: "#F5B232", accent: "#78838F", radius: 8, heading: "Verdana", body: "Arial", layout: "dashboard", hero: "Site timeline", icon: "▤" }],
  gardening: [{ bg: "#0F1A12", panel: "#1B2A1E", panel2: "#273A2A", text: "#EFF7E9", muted: "#A5B99B", primary: "#80C95B", accent: "#D4A75E", radius: 20, heading: "Georgia", body: "Arial", layout: "market", hero: "Garden plan", icon: "✽" }],
  tattoo: [{ bg: "#090909", panel: "#171717", panel2: "#242024", text: "#F5F1EC", muted: "#B1A6A0", primary: "#F1ECE2", accent: "#C74242", radius: 4, heading: "Impact", body: "Arial", layout: "editorial", hero: "Ink portfolio", icon: "✹" }],
  education: [{ bg: "#F7F3E9", panel: "#FFFFFF", panel2: "#E7E0CA", text: "#233342", muted: "#70808B", primary: "#2F72C4", accent: "#F0B74D", radius: 18, heading: "Trebuchet MS", body: "Arial", layout: "market", hero: "Learning path", icon: "A" }],
  events: [{ bg: "#120B16", panel: "#211427", panel2: "#332038", text: "#FFF1FA", muted: "#BA9CB9", primary: "#F075B6", accent: "#F2C66D", radius: 20, heading: "Georgia", body: "Arial", layout: "split", hero: "Event line-up", icon: "✶" }],
  logistics: [{ bg: "#07111A", panel: "#111E2A", panel2: "#1D2D3C", text: "#ECF7FF", muted: "#93AFC2", primary: "#40B8FF", accent: "#62D38A", radius: 12, heading: "Verdana", body: "Arial", layout: "dashboard", hero: "Live tracking", icon: "▸" }],
  beach: [{ bg: "#062030", panel: "#0C3347", panel2: "#164B60", text: "#FFF2D7", muted: "#9BC8D8", primary: "#61D0E8", accent: "#FFB36B", radius: 24, heading: "Trebuchet MS", body: "Arial", layout: "concierge", hero: "Beach booking", icon: "≈" }],
  veterinary: [{ bg: "#102015", panel: "#1B3021", panel2: "#2A442F", text: "#F2F8EC", muted: "#A7B99F", primary: "#8ECF67", accent: "#F0B35D", radius: 22, heading: "Trebuchet MS", body: "Arial", layout: "market", hero: "Pet care", icon: "●" }],
  childcare: [{ bg: "#FFF8E8", panel: "#FFFFFF", panel2: "#FFE3BF", text: "#3A2B1E", muted: "#8F735E", primary: "#FF8A6A", accent: "#5DB7E8", radius: 26, heading: "Trebuchet MS", body: "Arial", layout: "market", hero: "Play day", icon: "☀" }],
  generic: [{ bg: "#0F1117", panel: "#191D26", panel2: "#252B36", text: "#F3F6FA", muted: "#9DA8B8", primary: "#C8963E", accent: "#5FA8FF", radius: 16, heading: "Verdana", body: "Arial", layout: "bento", hero: "Premium service", icon: "✦" }],
};

const sectorCopy: Record<SectorKind, { label: string; nav: string[]; items: string[]; kpis: string[]; cta: string }> = {
  food: { label: "Ristorante", nav: ["Home", "Menu", "Tavoli", "Ordini"], items: ["Degustazione", "Carta vini", "Prenota tavolo"], kpis: ["Tavoli", "Ordini", "Rating"], cta: "Prenota ora" },
  sushi: { label: "Sushi", nav: ["Omakase", "Menu", "Chef", "Cart"], items: ["Nigiri set", "Sashimi", "Omakase"], kpis: ["Coperti", "Ordini", "Rating"], cta: "Ordina omakase" },
  ncc: { label: "NCC", nav: ["Home", "Flotta", "Route", "Book"], items: ["S-Class", "Airport", "Hourly"], kpis: ["Auto", "Corse", "ETA"], cta: "Calcola tratta" },
  boat: { label: "Yacht", nav: ["Home", "Fleet", "Tour", "Book"], items: ["Sunset tour", "Yacht 42", "Skipper"], kpis: ["Barche", "Miglia", "Meteo"], cta: "Blocca tour" },
  beauty: { label: "Beauty", nav: ["Home", "Servizi", "Agenda", "VIP"], items: ["Nail art", "Hair spa", "Rituale viso"], kpis: ["Slot", "Clienti", "Upsell"], cta: "Prenota trattamento" },
  healthcare: { label: "Clinica", nav: ["Home", "Visite", "Agenda", "Pazienti"], items: ["Check-up", "Igiene", "Teleconsulto"], kpis: ["Pazienti", "Agenda", "Follow-up"], cta: "Prenota visita" },
  fitness: { label: "Fitness", nav: ["Home", "Classi", "Coach", "Pass"], items: ["HIIT", "Padel", "PT 1:1"], kpis: ["Membri", "Classi", "PR"], cta: "Unisciti" },
  hospitality: { label: "Hotel", nav: ["Stay", "Rooms", "Concierge", "Book"], items: ["Suite", "Spa", "Dinner"], kpis: ["Occup.", "RevPAR", "Guest"], cta: "Prenota suite" },
  realestate: { label: "Real Estate", nav: ["Home", "Unità", "Visite", "CRM"], items: ["Attico", "Loft", "Valutazione"], kpis: ["Lead", "Visite", "Mandati"], cta: "Richiedi visita" },
  retail: { label: "Retail", nav: ["Shop", "Drop", "Cart", "VIP"], items: ["New drop", "Bestseller", "Gift card"], kpis: ["Ordini", "Stock", "AOV"], cta: "Aggiungi" },
  technical: { label: "Tecnico", nav: ["Home", "Interventi", "Mappa", "SOS"], items: ["Urgenza", "Manutenzione", "Preventivo"], kpis: ["Ticket", "ETA", "Ricambi"], cta: "Apri ticket" },
  agriturismo: { label: "Agriturismo", nav: ["Home", "Camere", "Attività", "Book"], items: ["Camera", "Degustazione", "Trekking"], kpis: ["Ospiti", "Notti", "Exp"], cta: "Prenota stay" },
  cleaning: { label: "Cleaning", nav: ["Home", "Servizi", "Agenda", "Team"], items: ["Ufficio", "Post-cantiere", "Casa"], kpis: ["Team", "Turni", "NPS"], cta: "Pianifica" },
  legal: { label: "Studio Legale", nav: ["Desk", "Pratiche", "Scadenze", "Clienti"], items: ["Consulenza", "Contratto", "Udienza"], kpis: ["Case", "Deadline", "Ore"], cta: "Apri pratica" },
  accounting: { label: "Fiscal", nav: ["Home", "Fatture", "Scadenze", "Clienti"], items: ["Fattura", "F24", "Bilancio"], kpis: ["Doc", "IVA", "Deadl."], cta: "Carica doc" },
  garage: { label: "Garage", nav: ["Home", "Coda", "Ricambi", "Check"], items: ["Tagliando", "Gomme", "Diagnosi"], kpis: ["Auto", "Ore", "Parts"], cta: "Prenota box" },
  photography: { label: "Studio Foto", nav: ["Home", "Gallery", "Date", "Print"], items: ["Wedding", "Portrait", "Album"], kpis: ["Shoot", "Proof", "Sales"], cta: "Blocca data" },
  construction: { label: "Cantiere", nav: ["Home", "Cantieri", "Gantt", "Report"], items: ["SAL", "Materiali", "Squadra"], kpis: ["Task", "Budget", "Rischi"], cta: "Aggiorna SAL" },
  gardening: { label: "Garden", nav: ["Home", "Progetti", "Agenda", "Crew"], items: ["Prato", "Irrigazione", "Design"], kpis: ["Job", "Stagione", "Team"], cta: "Crea piano" },
  tattoo: { label: "Tattoo", nav: ["Home", "Flash", "Artist", "Book"], items: ["Fine line", "Blackwork", "Cover"], kpis: ["Slot", "Flash", "Wait"], cta: "Blocca slot" },
  education: { label: "Academy", nav: ["Home", "Corsi", "Calendario", "Area"], items: ["Master", "Workshop", "1:1"], kpis: ["Studenti", "Lezioni", "Score"], cta: "Iscriviti" },
  events: { label: "Events", nav: ["Home", "Line-up", "Ticket", "CRM"], items: ["VIP", "Catering", "Stage"], kpis: ["Ticket", "Check-in", "ROI"], cta: "Compra ticket" },
  logistics: { label: "Logistica", nav: ["Home", "Tracking", "Fleet", "Proof"], items: ["Express", "Route", "POD"], kpis: ["Mezzi", "On-time", "KM"], cta: "Traccia" },
  beach: { label: "Beach", nav: ["Home", "Ombrelloni", "Attività", "Book"], items: ["Cabana", "SUP", "Sunset"], kpis: ["Posti", "Meteo", "Extra"], cta: "Prenota posto" },
  veterinary: { label: "Pet Care", nav: ["Home", "Servizi", "Pets", "Book"], items: ["Visita", "Toeletta", "Resort"], kpis: ["Pets", "Slot", "Follow"], cta: "Prenota pet" },
  childcare: { label: "Nursery", nav: ["Home", "Programmi", "Pasti", "Iscrivi"], items: ["Open day", "Atelier", "Mensa"], kpis: ["Bimbi", "Classi", "Report"], cta: "Iscrivi" },
  generic: { label: "Business", nav: ["Home", "Servizi", "Booking", "CRM"], items: ["Premium", "Consulenza", "Pacchetto"], kpis: ["Lead", "Sales", "NPS"], cta: "Richiedi" },
};

function themeFor(path: string, sector: SectorKind): Tokens {
  const list = sectorThemes[sector] || sectorThemes.generic;
  return list[hashStr(path) % list.length];
}

function layoutFor(path: string, base: LayoutKind): LayoutKind {
  const p = path.toLowerCase();
  if (/dashboard|tracking|fleet|timeline|deadline/.test(p)) return "dashboard";
  if (/cart|shop|menu|catalog/.test(p)) return "market";
  if (/booking|prenota|tour/.test(p)) return "concierge";
  return base;
}

function shapePattern(t: Tokens, seed: number): string {
  const a = 28 + (seed % 18);
  const b = 65 + (seed % 20);
  if (t.layout === "neon") return `<path d="M0 ${b} C90 ${a} 180 ${b + 30} 390 ${a}" fill="none" stroke="${t.primary}" stroke-width="5" opacity=".6"/><path d="M0 ${b + 70} C120 ${a + 70} 230 ${b + 92} 390 ${a + 80}" fill="none" stroke="${t.accent}" stroke-width="3" opacity=".7"/>`;
  if (t.layout === "zen") return `<circle cx="310" cy="85" r="74" fill="${t.primary}" opacity=".18"/><circle cx="340" cy="55" r="34" fill="none" stroke="${t.accent}" stroke-width="2" opacity=".55"/>`;
  if (t.layout === "editorial") return `<rect x="248" y="36" width="112" height="152" rx="${t.radius}" fill="${t.primary}" opacity=".28"/><path d="M28 178 L350 44" stroke="${t.accent}" stroke-width="1.5" opacity=".55"/>`;
  if (t.layout === "dashboard") return `<path d="M0 152 C80 116 150 184 238 132 S340 88 390 116 V0 H0 Z" fill="${t.primary}" opacity=".18"/>`;
  return `<circle cx="72" cy="58" r="54" fill="${t.primary}" opacity=".18"/><circle cx="326" cy="132" r="84" fill="${t.accent}" opacity=".12"/>`;
}

function statusBar(t: Tokens): string {
  return `<g font-family="${t.body}" font-weight="700" font-size="12" fill="${t.text}"><text x="30" y="29">9:41</text><rect x="174" y="14" width="42" height="14" rx="7" fill="#000" opacity=".88"/><text x="306" y="29">▰▰ 100</text></g>`;
}

function navBar(t: Tokens, labels: string[], active = 0): string {
  const xs = [42, 132, 225, 318];
  return `<g font-family="${t.body}" font-size="10" font-weight="700">${labels.slice(0, 4).map((l, i) => `<g transform="translate(${xs[i]} 792)"><circle cx="0" cy="-14" r="15" fill="${i === active ? t.primary : t.panel2}"/><text x="0" y="18" text-anchor="middle" fill="${i === active ? t.primary : t.muted}">${esc(l.slice(0, 9))}</text><text x="0" y="-10" text-anchor="middle" fill="${i === active ? t.bg : t.text}" font-size="13">${["⌂", "▦", "◷", "◉"][i]}</text></g>`).join("")}</g>`;
}

function card(x: number, y: number, w: number, h: number, t: Tokens, extra = "", opacity = 1): string {
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${Math.min(t.radius, 24)}" fill="${t.panel}" opacity="${opacity}"/>${extra}`;
}

function bars(x: number, y: number, t: Tokens, seed: number): string {
  return Array.from({ length: 7 }).map((_, i) => {
    const h = 24 + ((seed + i * 17) % 72);
    return `<rect x="${x + i * 18}" y="${y + 96 - h}" width="10" height="${h}" rx="5" fill="${i === 5 ? t.primary : t.primary}" opacity="${i === 5 ? .95 : .35}"/>`;
  }).join("");
}

function lineRows(x: number, y: number, t: Tokens, rows: string[], iconStart = 0): string {
  return rows.map((r, i) => `<g transform="translate(${x} ${y + i * 58})"><rect width="320" height="46" rx="${Math.min(t.radius, 18)}" fill="${i % 2 ? t.panel2 : t.panel}"/><rect x="10" y="8" width="31" height="31" rx="${Math.min(t.radius, 12)}" fill="${i % 2 ? t.accent : t.primary}" opacity=".9"/><text x="25.5" y="29" text-anchor="middle" fill="${t.bg}" font-size="14" font-family="${t.heading}">${["✦","◆","◌","+","▣","◎"][((i + iconStart) % 6)]}</text><text x="53" y="20" fill="${t.text}" font-family="${t.body}" font-size="13" font-weight="800">${esc(r)}</text><text x="53" y="34" fill="${t.muted}" font-family="${t.body}" font-size="10">${esc(["Disponibile ora", "Gestione smart", "Personalizzabile", "Alta conversione"][i % 4])}</text><text x="296" y="28" text-anchor="end" fill="${t.primary}" font-family="${t.heading}" font-size="15" font-weight="900">${["€45", "4.9", "24h", "+18%"][i % 4]}</text></g>`).join("");
}

function homeScreen(t: Tokens, copy: typeof sectorCopy[SectorKind], brand: string, city: string, seed: number): string {
  const heroH = t.layout === "editorial" ? 230 : t.layout === "bento" ? 178 : 205;
  return `${statusBar(t)}${shapePattern(t, seed)}
  <g font-family="${t.body}"><text x="28" y="72" fill="${t.muted}" font-size="11" font-weight="800" letter-spacing="2">${esc(copy.label.toUpperCase())} · ${esc(city || "ITALIA")}</text><text x="28" y="105" fill="${t.text}" font-family="${t.heading}" font-size="31" font-weight="900">${esc(brand.slice(0, 19))}</text></g>
  <rect x="302" y="55" width="48" height="48" rx="${t.radius}" fill="${t.primary}"/><text x="326" y="88" text-anchor="middle" fill="${t.bg}" font-size="25" font-family="${t.heading}" font-weight="900">${t.icon}</text>
  ${card(28, 132, 334, heroH, t, `<rect x="44" y="150" width="302" height="${heroH - 34}" rx="${Math.max(8, t.radius - 3)}" fill="url(#hero)"/><text x="58" y="${132 + heroH - 64}" fill="#fff" font-family="${t.heading}" font-size="25" font-weight="900">${esc(t.hero)}</text><text x="58" y="${132 + heroH - 38}" fill="#fff" opacity=".84" font-family="${t.body}" font-size="12">AI booking · CRM · pagamenti · WhatsApp</text>`)}
  ${t.layout === "bento" || t.layout === "dashboard" ? `<g>${card(28, 340, 156, 96, t, `<text x="45" y="376" fill="${t.text}" font-family="${t.heading}" font-size="24" font-weight="900">${copy.kpis[0]}</text><text x="45" y="402" fill="${t.primary}" font-size="28" font-weight="900">${80 + seed % 18}%</text>`)}${card(198, 340, 164, 96, t, bars(216, 354, t, seed))}</g>` : `<g>${lineRows(35, 372, t, copy.items, seed)}</g>`}
  <g transform="translate(28 642)"><rect width="334" height="68" rx="${t.radius}" fill="${t.primary}"/><text x="22" y="31" fill="${t.bg}" font-family="${t.heading}" font-size="21" font-weight="900">${esc(copy.cta)}</text><text x="22" y="50" fill="${t.bg}" opacity=".76" font-family="${t.body}" font-size="11">Conferma immediata e follow-up automatico</text><text x="304" y="43" text-anchor="middle" fill="${t.bg}" font-size="28">→</text></g>${navBar(t, copy.nav, 0)}`;
}

function menuScreen(t: Tokens, copy: typeof sectorCopy[SectorKind], seed: number): string {
  return `${statusBar(t)}<text x="28" y="77" fill="${t.text}" font-family="${t.heading}" font-size="32" font-weight="900">${esc(copy.nav[1] || "Catalogo")}</text><text x="28" y="101" fill="${t.muted}" font-family="${t.body}" font-size="12">Filtri, prezzi, stock e upsell live</text>
  <g font-family="${t.body}" font-size="11" font-weight="800">${["Tutti", "Top", "Promo", "VIP"].map((l, i) => `<rect x="${28 + i * 78}" y="124" width="68" height="32" rx="16" fill="${i === 0 ? t.primary : t.panel}"/><text x="${62 + i * 78}" y="145" text-anchor="middle" fill="${i === 0 ? t.bg : t.text}">${l}</text>`).join("")}</g>
  ${lineRows(35, 188, t, [...copy.items, "Gift card", "Pacchetto VIP", "Add-on AI"], seed)}
  <g transform="translate(35 616)"><rect width="320" height="82" rx="${t.radius}" fill="${t.panel2}"/><text x="18" y="29" fill="${t.text}" font-family="${t.heading}" font-size="20" font-weight="900">Bundle consigliato</text><text x="18" y="51" fill="${t.muted}" font-family="${t.body}" font-size="11">Aumenta lo scontrino medio con 2 click</text><rect x="230" y="22" width="70" height="38" rx="19" fill="${t.primary}"/><text x="265" y="46" text-anchor="middle" fill="${t.bg}" font-family="${t.body}" font-size="12" font-weight="900">+ €29</text></g>${navBar(t, copy.nav, 1)}`;
}

function bookingScreen(t: Tokens, copy: typeof sectorCopy[SectorKind], seed: number): string {
  const days = ["L", "M", "M", "G", "V", "S", "D"];
  return `${statusBar(t)}<text x="28" y="78" fill="${t.text}" font-family="${t.heading}" font-size="30" font-weight="900">Booking</text><text x="28" y="102" fill="${t.muted}" font-family="${t.body}" font-size="12">Agenda, disponibilità e conferma WhatsApp</text>
  ${card(28, 128, 334, 206, t, `<text x="48" y="162" fill="${t.text}" font-family="${t.body}" font-size="14" font-weight="900">Giugno 2026</text>${days.map((d, i) => `<text x="${57 + i * 43}" y="198" text-anchor="middle" fill="${t.muted}" font-size="10" font-family="${t.body}" font-weight="800">${d}</text>`).join("")}${Array.from({ length: 21 }).map((_, i) => `<rect x="${42 + (i % 7) * 43}" y="${212 + Math.floor(i / 7) * 34}" width="28" height="28" rx="9" fill="${i === (seed % 12) + 5 ? t.primary : t.panel2}"/><text x="${56 + (i % 7) * 43}" y="${231 + Math.floor(i / 7) * 34}" text-anchor="middle" fill="${i === (seed % 12) + 5 ? t.bg : t.text}" font-family="${t.body}" font-size="11" font-weight="900">${i + 8}</text>`).join("")}`)}
  <g>${["09:30", "11:00", "14:30", "17:00", "19:30", "21:00"].map((h, i) => `<rect x="${34 + (i % 3) * 111}" y="${365 + Math.floor(i / 3) * 50}" width="96" height="38" rx="19" fill="${i === 4 ? t.primary : t.panel}"/><text x="${82 + (i % 3) * 111}" y="${389 + Math.floor(i / 3) * 50}" text-anchor="middle" fill="${i === 4 ? t.bg : t.text}" font-family="${t.body}" font-size="13" font-weight="900">${h}</text>`).join("")}</g>
  ${card(28, 498, 334, 112, t, `<text x="50" y="532" fill="${t.text}" font-family="${t.heading}" font-size="23" font-weight="900">${esc(copy.items[0])}</text><text x="50" y="555" fill="${t.muted}" font-family="${t.body}" font-size="12">Cliente VIP · acconto automatico · reminder</text><text x="312" y="555" text-anchor="end" fill="${t.primary}" font-family="${t.heading}" font-size="26" font-weight="900">€${70 + seed % 90}</text>`)}
  <rect x="28" y="642" width="334" height="58" rx="${t.radius}" fill="${t.primary}"/><text x="195" y="678" text-anchor="middle" fill="${t.bg}" font-family="${t.body}" font-size="15" font-weight="900">Conferma prenotazione</text>${navBar(t, copy.nav, 3)}`;
}

function dashboardScreen(t: Tokens, copy: typeof sectorCopy[SectorKind], seed: number): string {
  return `${statusBar(t)}<text x="28" y="78" fill="${t.text}" font-family="${t.heading}" font-size="30" font-weight="900">Control room</text><text x="28" y="102" fill="${t.muted}" font-family="${t.body}" font-size="12">KPI, automazioni e attività live</text>
  <g>${copy.kpis.map((k, i) => `${card(28 + i * 112, 132, 102, 92, t, `<text x="${44 + i * 112}" y="166" fill="${t.primary}" font-family="${t.heading}" font-size="25" font-weight="900">${["€12k", "+18%", "4.9"][i] || "92"}</text><text x="${44 + i * 112}" y="192" fill="${t.text}" font-family="${t.body}" font-size="11" font-weight="800">${esc(k)}</text>`)} `).join("")}</g>
  ${card(28, 254, 334, 184, t, `<text x="48" y="292" fill="${t.text}" font-family="${t.body}" font-size="14" font-weight="900">Performance 7 giorni</text>${bars(58, 316, t, seed)}<path d="M58 384 C92 340 124 378 158 322 S232 350 272 294 326 320 342 286" fill="none" stroke="${t.accent}" stroke-width="4" stroke-linecap="round"/>`)}
  <text x="28" y="480" fill="${t.muted}" font-family="${t.body}" font-size="11" font-weight="900" letter-spacing="1.4">ATTIVITÀ RECENTE</text>${lineRows(35, 502, t, ["Nuovo lead caldo", "Pagamento ricevuto", "AI follow-up inviato"], seed)}${navBar(t, copy.nav, 2)}`;
}

function detailScreen(t: Tokens, copy: typeof sectorCopy[SectorKind], seed: number): string {
  return `${statusBar(t)}<rect x="28" y="58" width="334" height="286" rx="${t.radius}" fill="url(#hero)"/><text x="50" y="288" fill="#fff" font-family="${t.heading}" font-size="34" font-weight="900">${esc(copy.items[seed % copy.items.length])}</text><text x="50" y="316" fill="#fff" opacity=".85" font-family="${t.body}" font-size="13">Scheda completa · foto · recensioni · disponibilità</text>
  ${card(28, 370, 334, 96, t, `<text x="50" y="405" fill="${t.text}" font-family="${t.heading}" font-size="24" font-weight="900">Dettaglio operativo</text><text x="50" y="430" fill="${t.muted}" font-family="${t.body}" font-size="12">Descrizione, varianti, allergeni/documenti, policy e note cliente.</text>`)}
  ${lineRows(35, 498, t, ["Recensioni certificate", "Opzioni personalizzate", "Disponibilità immediata"], seed)}<rect x="28" y="696" width="334" height="58" rx="${t.radius}" fill="${t.primary}"/><text x="195" y="732" text-anchor="middle" fill="${t.bg}" font-family="${t.body}" font-size="15" font-weight="900">${esc(copy.cta)}</text>${navBar(t, copy.nav, 1)}`;
}

function cartScreen(t: Tokens, copy: typeof sectorCopy[SectorKind], seed: number): string {
  return `${statusBar(t)}<text x="28" y="78" fill="${t.text}" font-family="${t.heading}" font-size="31" font-weight="900">Checkout</text><text x="28" y="102" fill="${t.muted}" font-family="${t.body}" font-size="12">Pagamento, acconto, ricevuta e consenso privacy</text>${lineRows(35, 132, t, copy.items, seed)}
  ${card(28, 360, 334, 164, t, `<text x="50" y="397" fill="${t.text}" font-family="${t.heading}" font-size="22" font-weight="900">Riepilogo ordine</text>${[["Subtotale", "€148"], ["Sconto VIP", "-€18"], ["Servizio", "€4"]].map((r, i) => `<text x="50" y="${430 + i * 28}" fill="${t.muted}" font-family="${t.body}" font-size="12">${r[0]}</text><text x="316" y="${430 + i * 28}" text-anchor="end" fill="${t.text}" font-family="${t.body}" font-size="12" font-weight="900">${r[1]}</text>`).join("")}<text x="50" y="510" fill="${t.text}" font-size="16" font-weight="900">Totale</text><text x="316" y="510" text-anchor="end" fill="${t.primary}" font-family="${t.heading}" font-size="25" font-weight="900">€134</text>`)}
  ${card(28, 552, 334, 74, t, `<rect x="48" y="574" width="54" height="31" rx="8" fill="#1A1F71"/><text x="75" y="595" text-anchor="middle" fill="#fff" font-size="11" font-weight="900">VISA</text><text x="118" y="584" fill="${t.text}" font-size="13" font-weight="900">•••• 4242</text><text x="118" y="603" fill="${t.muted}" font-size="10">Apple Pay · ricevuta automatica</text>`)}<rect x="28" y="660" width="334" height="58" rx="${t.radius}" fill="${t.primary}"/><text x="195" y="696" text-anchor="middle" fill="${t.bg}" font-family="${t.body}" font-size="15" font-weight="900">Paga in sicurezza</text>${navBar(t, copy.nav, 2)}`;
}

function renderScreen(t: Tokens, sector: SectorKind, screen: ScreenKind, brand: string, city: string, seed: number): string {
  const copy = sectorCopy[sector] || sectorCopy.generic;
  if (screen === "menu" || screen === "services") return menuScreen(t, copy, seed);
  if (screen === "booking" || screen === "map") return bookingScreen(t, copy, seed);
  if (screen === "dashboard" || screen === "fleet" || screen === "profile") return dashboardScreen(t, copy, seed);
  if (screen === "detail") return detailScreen(t, copy, seed);
  if (screen === "cart") return cartScreen(t, copy, seed);
  return homeScreen(t, copy, brand, city, seed);
}

export function empireMockupFromPath(path: string, opts?: { label?: string; sublabel?: string; city?: string }): string {
  const sector = sectorFromPath(path);
  const base = themeFor(path, sector);
  const theme: Tokens = { ...base, layout: layoutFor(path, base.layout) };
  const screen = screenFromPath(path);
  const brand = brandFromPath(path, opts?.label);
  const city = opts?.sublabel || opts?.city || "Italia";
  const seed = hashStr(path);
  const content = renderScreen(theme, sector, screen, brand, city, seed);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs>
      <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.bg}"/><stop offset="1" stop-color="${theme.panel2}"/></linearGradient>
      <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${theme.primary}"/><stop offset=".52" stop-color="${theme.accent}"/><stop offset="1" stop-color="${theme.panel2}"/></linearGradient>
      <filter id="soft"><feDropShadow dx="0" dy="18" stdDeviation="18" flood-color="#000000" flood-opacity="0.24"/></filter>
    </defs>
    <rect width="${W}" height="${H}" fill="url(#bg)"/>
    <rect x="14" y="10" width="362" height="824" rx="42" fill="${theme.bg}" opacity=".72" filter="url(#soft)"/>
    ${content}
    <rect x="118" y="823" width="154" height="5" rx="3" fill="${theme.text}" opacity=".28"/>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
