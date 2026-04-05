// Lead data model + mock generator + real search support

export interface MockLead {
  id: string;
  businessName: string;
  ownerName: string;
  address: string;
  city: string;
  zone: string;
  phone: string;
  email: string;
  website: string | null;
  instagram: string | null;
  sector: string;
  googleRating: number;
  reviewCount: number;
  digitalStatus: "none" | "obsolete" | "basic" | "good";
  opportunityScore: number;
  painPoints: string[];
  competitors: number;
  estimatedBudget: string;
  lastActivity: string;
  googleMapsUrl: string | null;
  source: "mock" | "google" | "manual";
}

export const DIGITAL_STATUS_LABELS: Record<string, string> = {
  none: "Nessun sito",
  obsolete: "Sito obsoleto",
  basic: "Sito basico",
  good: "Già digitalizzato",
};

const ITALIAN_FIRST_NAMES = ["Marco", "Laura", "Giovanni", "Sofia", "Alessandro", "Giulia", "Francesco", "Martina", "Luca", "Elena", "Andrea", "Chiara", "Davide", "Valentina", "Matteo", "Francesca", "Lorenzo", "Alessia", "Riccardo", "Sara"];
const ITALIAN_LAST_NAMES = ["Rossi", "Bianchi", "Esposito", "Romano", "Colombo", "Ricci", "Marino", "Greco", "Bruno", "Gallo", "Conti", "De Luca", "Mancini", "Costa", "Giordano", "Rizzo", "Lombardi", "Moretti", "Barbieri", "Fontana"];

const CITIES: { name: string; zones: string[] }[] = [
  { name: "Roma", zones: ["Trastevere", "Prati", "Testaccio", "EUR", "Parioli", "San Giovanni", "Monti", "Flaminio"] },
  { name: "Milano", zones: ["Brera", "Navigli", "Isola", "Porta Romana", "City Life", "Garibaldi", "Tortona", "Lambrate"] },
  { name: "Napoli", zones: ["Vomero", "Chiaia", "Centro Storico", "Posillipo", "Fuorigrotta", "Mergellina"] },
  { name: "Firenze", zones: ["Santa Croce", "Oltrarno", "San Lorenzo", "Campo di Marte", "Rifredi"] },
  { name: "Torino", zones: ["San Salvario", "Crocetta", "Vanchiglia", "Aurora", "Lingotto", "Centro"] },
  { name: "Bologna", zones: ["Centro", "Santo Stefano", "Bolognina", "Saragozza", "San Donato"] },
  { name: "Bari", zones: ["Murat", "Libertà", "Poggiofranco", "Madonnella", "San Pasquale"] },
  { name: "Catania", zones: ["Centro", "Ognina", "San Berillo", "Cibali", "Borgo"] },
  { name: "Palermo", zones: ["Politeama", "Kalsa", "Mondello", "Libertà", "Brancaccio"] },
  { name: "Verona", zones: ["Centro Storico", "Borgo Trento", "San Zeno", "Veronetta"] },
  { name: "Padova", zones: ["Centro", "Arcella", "Mandria", "Prato della Valle"] },
  { name: "Genova", zones: ["Centro Storico", "Nervi", "Albaro", "Sampierdarena"] },
  { name: "Cagliari", zones: ["Castello", "Marina", "Villanova", "Stampace"] },
  { name: "Lecce", zones: ["Centro Storico", "San Pio", "Santa Rosa", "Leuca"] },
  { name: "Perugia", zones: ["Centro", "Fontivegge", "Elce", "San Sisto"] },
];

const STREETS = ["Via Roma", "Corso Italia", "Via Garibaldi", "Via Mazzini", "Piazza Duomo", "Via Dante", "Corso Vittorio Emanuele", "Via XX Settembre", "Via dei Mille", "Via Nazionale", "Via della Repubblica", "Viale Europa", "Via Cavour", "Via Verdi", "Via Marconi"];

const SECTOR_BUSINESS_NAMES: Record<string, string[]> = {
  food: ["Trattoria Da Nino", "Ristorante Il Pozzo", "Pizzeria Bella Napoli", "Osteria del Borgo", "La Taverna di Mario", "Sushi Zen", "Burger Lab", "Caffè degli Artisti", "Il Giardino Segreto", "Ristorante Da Vittorio", "La Bottega del Gusto", "Pizza & Passione", "Trattoria Nonno Giuseppe", "Ristorante La Pergola", "Pizzeria Vesuvio", "Taverna dei Sapori"],
  beauty: ["Hair Studio Elite", "Salone Bellezza Pura", "Nails & Beauty Lounge", "Centro Estetico Aurora", "Barber Shop Il Maestro", "Beauty Lab", "Glamour Hair Design", "Spa & Nails Paradise", "Atelier della Bellezza", "Centro Benessere Armonia"],
  ncc: ["Luxury Transfer Service", "NCC Executive", "Amalfi Limousine", "Transfer VIP", "Chauffeur Italia", "Elite Car Service", "Premium Drive NCC", "Noleggio Con Conducente Top"],
  healthcare: ["Studio Dentistico Smile", "Fisioterapia Salute", "Centro Medico Vita", "Studio Oculistico Visione", "Poliambulatorio San Marco", "Centro Diagnostico Plus", "Clinica del Sorriso", "Studio Dermatologico"],
  retail: ["Boutique Eleganza", "Fashion Corner", "Concept Store Urban", "Shop & Style", "Il Bazar delle Meraviglie", "Emporio del Design", "Trend Store", "Negozio d'Arte"],
  fitness: ["CrossFit Arena", "Palestra FitLife", "Yoga Studio Zen", "PowerGym Center", "Club Fitness Elite", "Pilates Studio Body", "MMA Fight Club", "Studio Running"],
  hospitality: ["Hotel Bellavista", "B&B Il Nido", "Resort Paradiso", "Albergo Roma Antica", "Boutique Hotel Charm", "Pensione Vista Mare", "Grand Hotel Centro", "Relais & Spa"],
  beach: ["Lido Azzurro", "Bagno Paradiso", "Stabilimento Balneare Sole", "Beach Club Tropicale", "Lido delle Sirene", "Bagno Aurora"],
  plumber: ["Idraulica Express", "Pronto Intervento Tubi", "Idraulico 24H", "Termo Service Plus", "Acqua & Calore"],
  electrician: ["Elettrica Rapida", "Impianti Sicuri", "ElettroService", "Luce & Energia", "Elettricista Pro"],
  construction: ["Edil Costruzioni", "Ristrutturazioni Pro", "Impresa Edile Moderna", "Casa Nuova Progetti", "Edilizia 360"],
  gardening: ["Verde Giardini", "Garden Design Pro", "Il Pollice Verde", "Manutenzione Giardini Plus"],
  veterinary: ["Clinica Veterinaria Zampe Felici", "Ambulatorio Pet Care", "Veterinario Amico", "Centro Veterinario City"],
  tattoo: ["Ink Master Studio", "Tattoo Art Gallery", "Black Rose Tattoo", "Studio Tatuaggi Elite"],
  photography: ["Foto Studio Luce", "Click Photography", "Studio Fotografico Emotion", "Wedding Photo Pro"],
  events: ["Party Planner VIP", "Eventi & Emozioni", "Wedding Boutique", "Organizza Perfetto"],
  logistics: ["SpediFast Express", "Corriere Rapido", "Logistica Italia", "Trasporti Veloci"],
  childcare: ["Asilo Girasole", "Ludoteca Arcobaleno", "Baby World Center", "Nido Famiglia Stelline"],
  education: ["Accademia Lingue", "Centro Studi Eureka", "Scuola di Musica Armonia", "Formazione Pro Academy"],
  legal: ["Studio Legale Associati", "Avvocato Giustizia", "Consulenza Legale Pro", "Studio Diritto & Difesa"],
  accounting: ["Studio Commercialista Fisco", "Contabilità Smart", "Studio Tributario Associati", "Tax Advisor Pro"],
  agriturismo: ["Agriturismo Il Casale", "Fattoria dei Sapori", "Podere del Sole", "Agriturismo Colline Toscane"],
  cleaning: ["Pulizie Express", "Clean Service Pro", "Igiene Totale", "Servizi Pulizia Premium"],
  garage: ["Autofficina Motori", "Carrozzeria Express", "Meccanico Sprint", "Auto Service Pro"],
  custom: ["Studio Creativo", "Consulenza 360", "Servizi Integrati", "Business Solutions Pro"],
};

const PAIN_POINTS: Record<string, string[]> = {
  food: ["Menu cartaceo non aggiornabile", "Prenotazioni solo telefoniche", "Nessun sistema di fidelizzazione", "Ordini persi durante il servizio", "Zero marketing digitale", "Recensioni negative non gestite", "No delivery/takeaway online", "Nessun CRM clienti"],
  beauty: ["Agenda cartacea con errori", "No-show frequenti senza promemoria", "Nessun programma fedeltà", "Prenotazioni solo per telefono", "Nessuna presenza social strutturata", "Nessun listino digitale"],
  ncc: ["Prenotazioni solo via WhatsApp", "Nessun tracking per i clienti", "Gestione flotta su Excel", "Zero cross-selling servizi", "Fatturazione manuale", "Nessun sistema tariffario dinamico"],
  healthcare: ["Appuntamenti gestiti a telefono", "Nessun promemoria automatico", "Referti cartacei", "Lista d'attesa non gestita", "Zero telemedicina", "Nessuna scheda paziente digitale"],
  retail: ["Inventario su foglio Excel", "Nessun e-commerce", "Zero programma fedeltà", "Promozioni solo cartacee", "Nessun CRM clienti", "Nessuna analisi vendite"],
  fitness: ["Abbonamenti gestiti a mano", "Nessuna app per i membri", "Corsi prenotati per telefono", "Zero tracciamento progressi", "Marketing solo volantini"],
  hospitality: ["Prenotazioni solo via Booking", "Commissioni OTA altissime", "Nessun upselling automatico", "Check-in cartaceo", "Zero fidelizzazione"],
  default: ["Nessuna presenza online strutturata", "Gestione manuale inefficiente", "Zero automazione marketing", "Nessun sistema CRM", "Comunicazione non strutturata", "Nessun programma referral"],
};

function randomFromArray<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function generatePhone(): string {
  const prefix = ["333", "347", "338", "320", "349", "366", "392", "351"];
  return `+39 ${randomFromArray(prefix)} ${Math.floor(1000000 + Math.random() * 9000000)}`;
}

function generateEmail(businessName: string): string {
  const clean = businessName.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 15);
  return `info@${clean}.it`;
}

function calculateScore(rating: number, reviews: number, digitalStatus: string): number {
  let score = 50;
  if (digitalStatus === "none") score += 30;
  else if (digitalStatus === "obsolete") score += 20;
  else if (digitalStatus === "basic") score += 10;
  else score -= 15;
  if (rating < 3.5) score += 15;
  else if (rating < 4) score += 8;
  else if (rating > 4.5) score -= 5;
  if (reviews < 20) score += 10;
  else if (reviews < 50) score += 5;
  else if (reviews > 200) score -= 5;
  return Math.max(10, Math.min(98, score + Math.floor(Math.random() * 10 - 5)));
}

export function generateMockLeads(sector: string, city: string, count: number = 20, freeText?: string): MockLead[] {
  const cityData = CITIES.find(c => c.name.toLowerCase() === city.toLowerCase()) || randomFromArray(CITIES);
  const names = SECTOR_BUSINESS_NAMES[sector] || SECTOR_BUSINESS_NAMES.custom;
  const leads: MockLead[] = [];
  const usedNames = new Set<string>();

  for (let i = 0; i < count; i++) {
    let bName = randomFromArray(names);
    if (usedNames.has(bName)) bName = `${bName} ${randomFromArray(["2", "II", "Plus", "& Co.", "Centro", "Lab", "Studio"])}`;
    usedNames.add(bName);

    const rating = +(2.5 + Math.random() * 2.5).toFixed(1);
    const reviewCount = Math.floor(5 + Math.random() * 300);
    const digitalStatusRoll = Math.random();
    const digitalStatus: MockLead["digitalStatus"] = digitalStatusRoll < 0.35 ? "none" : digitalStatusRoll < 0.6 ? "obsolete" : digitalStatusRoll < 0.85 ? "basic" : "good";
    const zone = randomFromArray(cityData.zones);
    const cleanName = bName.toLowerCase().replace(/[^a-z0-9]/g, "");

    leads.push({
      id: `lead-${Date.now()}-${i}-${Math.random().toString(36).slice(2, 6)}`,
      businessName: bName,
      ownerName: `${randomFromArray(ITALIAN_FIRST_NAMES)} ${randomFromArray(ITALIAN_LAST_NAMES)}`,
      address: `${randomFromArray(STREETS)} ${Math.floor(1 + Math.random() * 150)}, ${zone}`,
      city: cityData.name,
      zone,
      phone: generatePhone(),
      email: generateEmail(bName),
      website: digitalStatus === "none" ? null : `www.${cleanName}.it`,
      instagram: Math.random() > 0.3 ? `@${cleanName}` : null,
      sector,
      googleRating: rating,
      reviewCount,
      digitalStatus,
      opportunityScore: calculateScore(rating, reviewCount, digitalStatus),
      painPoints: (PAIN_POINTS[sector] || PAIN_POINTS.default).sort(() => Math.random() - 0.5).slice(0, 3 + Math.floor(Math.random() * 2)),
      competitors: Math.floor(3 + Math.random() * 15),
      estimatedBudget: ["€79-149/mese", "€149-249/mese", "€249-499/mese"][Math.floor(Math.random() * 3)],
      lastActivity: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      googleMapsUrl: `https://maps.google.com/?q=${encodeURIComponent(bName + " " + cityData.name)}`,
      source: "mock",
    });
  }

  // If freeText is provided, filter by relevance
  if (freeText) {
    const query = freeText.toLowerCase();
    return leads
      .map(l => {
        let relevance = 0;
        if (l.businessName.toLowerCase().includes(query)) relevance += 50;
        if (l.zone.toLowerCase().includes(query)) relevance += 20;
        if (l.address.toLowerCase().includes(query)) relevance += 10;
        return { ...l, opportunityScore: Math.min(98, l.opportunityScore + Math.floor(relevance / 5)) };
      })
      .sort((a, b) => b.opportunityScore - a.opportunityScore);
  }

  return leads.sort((a, b) => b.opportunityScore - a.opportunityScore);
}

export const SECTOR_OPTIONS = [
  { value: "food", label: "🍽️ Ristorazione" },
  { value: "beauty", label: "💅 Beauty & Benessere" },
  { value: "ncc", label: "🚗 NCC & Transfer" },
  { value: "healthcare", label: "🏥 Sanità" },
  { value: "retail", label: "🛍️ Retail & Negozi" },
  { value: "fitness", label: "💪 Fitness & Palestre" },
  { value: "hospitality", label: "🏨 Hotel & Ospitalità" },
  { value: "beach", label: "🏖️ Stabilimenti Balneari" },
  { value: "plumber", label: "🔧 Idraulica" },
  { value: "electrician", label: "⚡ Elettricista" },
  { value: "construction", label: "🏗️ Edilizia" },
  { value: "gardening", label: "🌿 Giardinaggio" },
  { value: "veterinary", label: "🐾 Veterinaria" },
  { value: "tattoo", label: "🎨 Tattoo & Piercing" },
  { value: "photography", label: "📷 Fotografia" },
  { value: "events", label: "🎉 Eventi & Wedding" },
  { value: "logistics", label: "📦 Logistica" },
  { value: "childcare", label: "👶 Asili & Infanzia" },
  { value: "education", label: "📚 Formazione" },
  { value: "legal", label: "⚖️ Studi Legali" },
  { value: "accounting", label: "📊 Commercialisti" },
  { value: "agriturismo", label: "🌾 Agriturismo" },
  { value: "cleaning", label: "🧹 Pulizie" },
  { value: "garage", label: "🔩 Autofficine" },
  { value: "custom", label: "📌 Altro" },
];

export const CITY_OPTIONS = CITIES.map(c => c.name);
