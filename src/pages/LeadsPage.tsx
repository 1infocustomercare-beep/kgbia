import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Target, MapPin, Filter, ChevronDown, Loader2, Phone, Globe, Mail,
  Instagram, Star, ExternalLink, MessageCircle, Copy, Sparkles, Send, RefreshCw,
  Wand2, Building2, Eye, Map, Zap, ArrowUpDown, X as XIcon, UserPlus, Link2,
  CheckCircle, TrendingUp, AlertTriangle, Crown, Plus, Layers, Facebook
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import empireMonkeyLaptop from "@/assets/empire-monkey-laptop.png";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { SECTOR_PORTFOLIO, SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";

/* ─── Types ─── */
interface Lead {
  name: string;
  full_address: string;
  city: string;
  zone: string;
  phone: string | null;
  website: string | null;
  email: string | null;
  instagram: string | null;
  facebook?: string | null;
  google_rating: number;
  google_reviews: number;
  google_maps_url: string | null;
  search_google?: string | null;
  search_instagram?: string | null;
  search_facebook?: string | null;
  source: string;
  osm_type?: string;
  types?: string[];
  lat?: number;
  lon?: number;
  isManual?: boolean;
  opening_hours?: string | null;
  cuisine?: string | null;
}

/* ─── Helpers ─── */
const getDemoSiteUrl = (sectorId: string) => {
  if (sectorId === "food") return "/r/impero-roma";
  if (sectorId === "ncc") return "/b/amalfi-luxury-transfer";
  const slug = DEMO_SLUGS[sectorId as keyof typeof DEMO_SLUGS] || sectorId;
  return `/demo/${slug}`;
};

const PORTFOLIO_REFS: Record<string, string> = {
  food: "COTE Miami", beauty: "Neo Nails Brickell", ncc: "Amalfi Luxury Transfer",
  fitness: "City Padel Milano", healthcare: "FAR Medical", veterinary: "Aloha Pet Resort",
  hotel: "MMI Resident Hub", tattoo: "Ink Masters Studio", beach: "Miami Watersports",
  retail: "Store Premium", plumber: "Nick's Plumbing", electrician: "Elite Electrical",
  photography: "Vision Photography", events: "Elite Events", construction: "Premium Costruzioni",
  gardening: "Verde & Giardini", agriturismo: "Tuscan Country Estate", cleaning: "Premium Clean",
  legal: "Studio Legale", accounting: "Studio Commercialista Pro", garage: "Speed Auto Service",
};

const detectSector = (lead: Lead, fallback: string): string => {
  const text = [lead.name, lead.osm_type, lead.full_address, ...(lead.types || [])].join(" ").toLowerCase();
  const sectorMap: [string, RegExp][] = [
    ["food", /ristoran|pizz|bar[\s,]|caffè|café|trattori|osteria|pub|bistrot|sushi|hamburger|tavola|gastr|enoteca|kebab|poke|ramen/],
    ["bakery", /panett|panificio|pasticc|forno|bakery|croissant|dolci|torte/],
    ["gelateria", /gelat|yogurt|frozen|ice.?cream/],
    ["wine_bar", /enoteca|wine.?bar|vineria|cantina.?urbana/],
    ["catering", /catering|banquet|banchett/],
    ["beauty", /parrucch|salon[ei]|estet|nail|manicur|trucco|makeup|bellezz|beauty|capelli|acconc|centro.?estetico/],
    ["barber", /barbi|barber|grooming|rasatura/],
    ["spa", /spa[\s,]|terme|benessere|wellness|massagg|sauna|hammam/],
    ["ncc", /ncc|taxi|transfer|limo|chauffeur|noleggio|car.?rental|auto.?con.?autista/],
    ["dentist", /dent|ortodon|implantolog|odontoiatr/],
    ["physiotherapy", /fisio|osteopat|chiropratic|riabilit/],
    ["psychology", /psicol|psicoterap|neuropsic/],
    ["healthcare", /medic|clinic|doctor|hospital|farmac|ambulat|poliamb|oculist|cardiol|dermatolog/],
    ["pharmacy", /farmac|parafarmac/],
    ["optics", /ottic|occhial|lenti|optometr/],
    ["retail", /negoz|shop|boutique|abbigliamento|scarpe|gioiell|profum|supermarket|minimarket/],
    ["jewelry", /gioiell|orefic|orologeri|argenter/],
    ["fitness", /palestr|gym|crossfit|yoga|pilates|fitness|sport|piscina|tennis|padel/],
    ["martial_arts", /arti.?marzial|karate|judo|mma|boxe|pugilato|kick/],
    ["dance", /danza|ballo|salsa|tango|hip.?hop|balletto/],
    ["hospitality", /hotel|albergo|b.?&.?b|hostel|motel|resort|pensione|guest.?house|bed.?and/],
    ["beach", /lido|stabiliment|balne|beach|spiaggia/],
    ["plumber", /idraul|plumb|tubaz|termoidr/],
    ["electrician", /elettric|electric|impiant|fotovolt/],
    ["veterinary", /veterinar|animali|toelet/],
    ["pet_shop", /pet.?shop|animali|acquari|toelettatura/],
    ["tattoo", /tattoo|tatuag|piercing|ink/],
    ["photography", /fotograf|photo|video|wedding.?photo/],
    ["events", /event|wedding|cerimoni|feste|location.?eventi/],
    ["construction", /edil|costruzi|ristruttur|murator/],
    ["gardening", /giardini|vivaio|garden|paesagg|verde/],
    ["legal", /avvocat|legal|notai|tribunale/],
    ["accounting", /commercial|contabil|fiscale|caf|tributar/],
    ["agriturismo", /agriturism|fattoria|cantina|masseria/],
    ["real_estate", /immobiliar|agenzia.?immob|casa.?vendita|real.?estate/],
    ["architect", /architett|interior|design.?interni|progettaz/],
    ["insurance", /assicuraz|broker|polizz|agenzia.?assicur/],
    ["coworking", /coworking|co.?working|uffici.?condivisi/],
    ["laundry", /lavander|tintor|stireria|dry.?clean/],
    ["florist", /fiorist|fioraio|vivaio|floral/],
    ["travel", /agenzia.?viagg|tour.?operator|viaggio/],
    ["music", /scuola.?music|conservator|studio.?registr/],
    ["driving_school", /autoscuol|patente|guida/],
    ["car_wash", /autolavag|car.?wash|lavaggio.?auto/],
    ["tech_repair", /riparaz|phone.?repair|computer|assistenza.?tecn/],
    ["printing", /tipograf|stampa|copisteria|litograf/],
    ["locksmith", /fabbr|serrat|chiav|serrament/],
    ["tailor", /sartor|atelier|alta.?moda|cucito/],
    ["funeral", /onoranz|funer|pompe.?funebr/],
    ["moving", /trasloc|sgomber|facchinag/],
    ["pest_control", /disinfestaz|derattizz|sanificaz/],
    ["cleaning", /pulizi|impresa.?pulizie|clean/],
    ["garage", /officin|carrozzer|meccanico|gommi|autoricamb/],
  ];
  for (const [s, regex] of sectorMap) if (regex.test(text)) return s;
  return fallback;
};

const computeScore = (lead: Lead): number => {
  let score = 50;
  if (!lead.website) score += 25;
  if (!lead.instagram) score += 10;
  if (lead.google_rating > 0 && lead.google_rating < 3.5) score += 15;
  else if (lead.google_rating >= 4.5) score -= 10;
  if (!lead.phone) score += 5;
  if (lead.opening_hours) score -= 3; // well-organized = harder to sell
  return Math.max(15, Math.min(98, score + Math.floor(Math.random() * 6 - 3)));
};

const getPreviewScreens = (sectorId: string): string[] => {
  // 1. Try SECTOR_PORTFOLIO (high-quality multi-brand)
  const portfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === sectorId);
  const brand = portfolio?.brands?.[0];
  const style = brand?.styles?.[0];
  if (style?.screens?.length) return style.screens.slice(0, 4);
  // 2. Fallback to SECTOR_MOCKUP_IMAGES (flat array)
  const mockups = SECTOR_MOCKUP_IMAGES[sectorId as keyof typeof SECTOR_MOCKUP_IMAGES];
  if (mockups?.length) return mockups.slice(0, 4);
  // 3. Last resort: try parent sector mapping
  const SECTOR_PARENT: Record<string, string> = {
    bakery: "food", gelateria: "food", wine_bar: "food", catering: "food",
    barber: "beauty", spa: "beauty",
    dentist: "healthcare", physiotherapy: "healthcare", psychology: "healthcare", pharmacy: "healthcare", optics: "healthcare",
    martial_arts: "fitness", dance: "fitness",
    pet_shop: "veterinary", jewelry: "retail",
    car_wash: "garage", tech_repair: "retail", printing: "retail",
    driving_school: "education", music: "education",
    florist: "gardening", laundry: "cleaning",
    locksmith: "plumber", tailor: "retail",
    travel: "hospitality", coworking: "hospitality",
    real_estate: "construction", architect: "construction",
    insurance: "accounting", funeral: "events", moving: "logistics", pest_control: "cleaning",
  };
  const parent = SECTOR_PARENT[sectorId];
  if (parent) {
    const pPortfolio = SECTOR_PORTFOLIO.find(sp => sp.sectorId === parent);
    const pScreens = pPortfolio?.brands?.[0]?.styles?.[0]?.screens;
    if (pScreens?.length) return pScreens.slice(0, 4);
    const pMockups = SECTOR_MOCKUP_IMAGES[parent as keyof typeof SECTOR_MOCKUP_IMAGES];
    if (pMockups?.length) return pMockups.slice(0, 4);
  }
  return [];
};

/* ─── Sector-specific features to show in preview ─── */
const SECTOR_FEATURES: Record<string, { features: string[]; value: string; cta: string }> = {
  food: { features: ["Menu digitale QR", "Prenotazioni online", "Ordini delivery/asporto", "CRM clienti + loyalty"], value: "Aumenta ordini del 40%", cta: "Vedi demo ristorante" },
  beauty: { features: ["Booking online 24/7", "Promemoria automatici", "Galleria servizi", "Programma fedeltà"], value: "Riduci no-show del 60%", cta: "Vedi demo beauty" },
  ncc: { features: ["Booking con preventivo", "Tracking GPS flotta", "Fatturazione automatica", "Tariffe dinamiche"], value: "Più prenotazioni dirette", cta: "Vedi demo NCC" },
  healthcare: { features: ["Prenotazione visite", "Telemedicina", "Promemoria SMS", "Schede paziente digitali"], value: "Meno telefonate, più visite", cta: "Vedi demo clinica" },
  fitness: { features: ["Iscrizioni online", "Prenotazione corsi", "App membri", "Pagamenti ricorrenti"], value: "+35% retention membri", cta: "Vedi demo palestra" },
  hospitality: { features: ["Booking diretto (no OTA)", "Check-in digitale", "Upselling automatico", "Guest CRM"], value: "Zero commissioni OTA", cta: "Vedi demo hotel" },
  retail: { features: ["Catalogo online", "E-commerce integrato", "Inventario smart", "Programma fedeltà"], value: "Vendite online 24/7", cta: "Vedi demo negozio" },
  plumber: { features: ["Richiesta intervento online", "Preventivi automatici", "Tracking interventi", "Fatturazione digitale"], value: "Più clienti, meno chiamate", cta: "Vedi demo idraulico" },
  electrician: { features: ["Preventivi online", "Calendario interventi", "Portfolio lavori", "Recensioni verificate"], value: "Professionalità digitale", cta: "Vedi demo elettricista" },
  construction: { features: ["Portfolio progetti", "Timeline lavori", "Preventivi interattivi", "Gestione cantieri"], value: "Progetti gestiti al meglio", cta: "Vedi demo edilizia" },
  veterinary: { features: ["Prenotazione visite", "Cartella clinica pet", "Promemoria vaccini", "Shop prodotti"], value: "Fidelizza proprietari", cta: "Vedi demo veterinario" },
  beach: { features: ["Mappa ombrelloni", "Prenotazione online", "Abbonamenti stagionali", "Bar/Ristoro integrato"], value: "Gestione spiaggia smart", cta: "Vedi demo stabilimento" },
  tattoo: { features: ["Portfolio artisti", "Booking appuntamenti", "Galleria lavori", "Consensi digitali"], value: "Più prenotazioni online", cta: "Vedi demo tattoo" },
  photography: { features: ["Portfolio professionale", "Booking sessioni", "Galleria clienti", "Preventivi automatici"], value: "Showcase professionale", cta: "Vedi demo fotografo" },
  events: { features: ["Catalogo eventi", "Booking location", "Preventivi wedding", "Gestione fornitori"], value: "Più eventi prenotati", cta: "Vedi demo eventi" },
  gardening: { features: ["Catalogo servizi", "Preventivi online", "Portfolio giardini", "Manutenzione programmata"], value: "Clienti tutto l'anno", cta: "Vedi demo giardinaggio" },
  legal: { features: ["Consulenze online", "Gestione pratiche", "Appuntamenti digitali", "Area clienti riservata"], value: "Studio più efficiente", cta: "Vedi demo studio legale" },
  accounting: { features: ["Portale clienti", "Scadenzario fiscale", "Documenti digitali", "Consulenze online"], value: "Gestione clienti smart", cta: "Vedi demo commercialista" },
  cleaning: { features: ["Preventivi istantanei", "Booking pulizie", "Abbonamenti", "Tracking interventi"], value: "Più contratti regolari", cta: "Vedi demo pulizie" },
  garage: { features: ["Prenotazione tagliandi", "Storico interventi", "Preventivi digitali", "Promemoria revisioni"], value: "Fidelizza automobilisti", cta: "Vedi demo officina" },
  agriturismo: { features: ["Booking camere", "Menu degustazione", "Esperienze/attività", "Vendita prodotti"], value: "Prenotazioni dirette", cta: "Vedi demo agriturismo" },
  logistics: { features: ["Tracking spedizioni", "Preventivi online", "Dashboard corrieri", "Notifiche consegna"], value: "Logistica ottimizzata", cta: "Vedi demo logistica" },
  education: { features: ["Iscrizioni corsi", "Calendario lezioni", "Area studenti", "Pagamenti online"], value: "Più iscrizioni online", cta: "Vedi demo formazione" },
  childcare: { features: ["Iscrizioni online", "Comunicazioni genitori", "Diario digitale", "Pagamenti ricorrenti"], value: "Genitori sempre informati", cta: "Vedi demo asilo" },
};
const getSectorFeatures = (sectorId: string) => SECTOR_FEATURES[sectorId] || SECTOR_FEATURES.retail || { features: ["Sito professionale", "Booking online", "CRM clienti", "Marketing AI"], value: "Presenza digitale completa", cta: "Vedi demo" };

/* ─── Sector-specific pain points for real analysis ─── */
const SECTOR_PAIN_ANALYSIS: Record<string, string[]> = {
  food: ["Clienti cercano su Google e non trovano il ristorante", "Prenotazioni perse al telefono durante il servizio", "Zero fidelizzazione: i clienti non tornano", "Nessun sistema ordini online per delivery"],
  beauty: ["Appuntamenti persi senza promemoria automatici", "No-show frequenti senza caparra", "Clienti prenotano solo per telefono", "Nessuna visibilità online dei servizi"],
  ncc: ["Prenotazioni solo via WhatsApp/telefono", "Nessun preventivo automatico", "Zero visibilità su Google per transfer", "Fatturazione e gestione flotta manuale"],
  healthcare: ["Pazienti chiamano per prenotare e la linea è occupata", "Nessun promemoria visite automatico", "Referti solo cartacei", "Zero telemedicina post-COVID"],
  fitness: ["Iscrizioni gestite con carta e penna", "Nessuna app per prenotare corsi", "Membri non rinnovano senza engagement", "Zero analisi dei dati membri"],
  hospitality: ["Commissioni OTA fino al 25% per prenotazione", "Check-in lento e cartaceo", "Nessun upselling automatico", "Zero fidelizzazione ospiti"],
  plumber: ["Clienti non trovano il servizio su Google", "Preventivi fatti a voce senza traccia", "Nessun portfolio lavori online", "Zero recensioni gestite"],
  electrician: ["Nessun sito professionale per farsi trovare", "Preventivi non tracciati", "Zero visibilità rispetto ai competitor", "Nessun sistema appuntamenti"],
  retail: ["Nessun e-commerce per vendite online", "Inventario gestito su foglio Excel", "Zero programma fedeltà", "Promozioni solo in vetrina"],
  construction: ["Portfolio lavori non visibile online", "Preventivi cartacei senza follow-up", "Nessuna timeline progetti per clienti", "Zero referenze digitali"],
  veterinary: ["Proprietari dimenticano vaccini e controlli", "Nessuna cartella clinica digitale", "Prenotazioni solo telefoniche", "Zero vendita prodotti online"],
  beach: ["Prenotazione ombrelloni solo di persona", "Nessun sistema abbonamenti stagionali", "Gestione caotica nei weekend", "Zero servizio bar digitale"],
  tattoo: ["Portfolio solo su Instagram senza sito", "Prenotazioni via DM non gestite", "Nessun sistema consensi digitale", "Zero visibilità su Google"],
  gardening: ["Nessun catalogo servizi professionale", "Preventivi fatti a voce", "Zero visibilità online", "Nessun sistema manutenzione programmata"],
  legal: ["Clienti non trovano lo studio online", "Gestione pratiche su carta", "Nessun portale clienti", "Appuntamenti solo telefonici"],
  accounting: ["Clienti portano documenti a mano", "Nessun portale scadenze fiscali", "Zero automazione comunicazioni", "Gestione manuale inefficiente"],
  default: ["Nessuna presenza online strutturata", "Clienti potenziali non trovano l'attività", "Gestione manuale di appuntamenti e ordini", "Zero automazione marketing e CRM"],
};

const SOURCE_LABELS: Record<string, { label: string; color: string }> = {
  google_places: { label: "Google", color: "#4285F4" },
  nominatim: { label: "OSM", color: "#7EBC6F" },
  photon: { label: "Photon", color: "#F59E0B" },
  overpass: { label: "Overpass", color: "#06B6D4" },
  instagram: { label: "Instagram", color: "#E4405F" },
  manual: { label: "Manuale", color: "#A78BFA" },
};

/* ─── POPULAR COUNTRIES ─── */
const COUNTRIES = [
  { code: "", label: "🌍 Ovunque", emoji: "🌍" },
  { code: "IT", label: "🇮🇹 Italia", emoji: "🇮🇹" },
  { code: "US", label: "🇺🇸 USA", emoji: "🇺🇸" },
  { code: "GB", label: "🇬🇧 UK", emoji: "🇬🇧" },
  { code: "FR", label: "🇫🇷 Francia", emoji: "🇫🇷" },
  { code: "DE", label: "🇩🇪 Germania", emoji: "🇩🇪" },
  { code: "ES", label: "🇪🇸 Spagna", emoji: "🇪🇸" },
  { code: "PT", label: "🇵🇹 Portogallo", emoji: "🇵🇹" },
  { code: "CH", label: "🇨🇭 Svizzera", emoji: "🇨🇭" },
  { code: "AE", label: "🇦🇪 Dubai/UAE", emoji: "🇦🇪" },
  { code: "AU", label: "🇦🇺 Australia", emoji: "🇦🇺" },
  { code: "BR", label: "🇧🇷 Brasile", emoji: "🇧🇷" },
  { code: "JP", label: "🇯🇵 Giappone", emoji: "🇯🇵" },
];

const RADIUS_OPTIONS = [
  { value: 5, label: "5 km — Quartiere" },
  { value: 15, label: "15 km — Città" },
  { value: 30, label: "30 km — Area metropolitana" },
  { value: 50, label: "50 km — Provincia" },
  { value: 100, label: "100 km — Regione" },
];

/* ─── COMPONENT ─── */
export default function LeadsPage() {
  // Search
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("food");
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("");
  const [radius, setRadius] = useState(15);
  const [loading, setLoading] = useState(false);
  const [deepLoading, setDeepLoading] = useState(false);
  const [results, setResults] = useState<(Lead & { _score: number; _sector: string })[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [maxRating, setMaxRating] = useState(5);
  const [filterNoWebsite, setFilterNoWebsite] = useState(false);
  const [filterNoSocial, setFilterNoSocial] = useState(false);
  const [filterHasPhone, setFilterHasPhone] = useState(false);
  const [sortBy, setSortBy] = useState<"score" | "rating" | "name">("score");
  const [searchPage, setSearchPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [lastSearchCity, setLastSearchCity] = useState("");
  const [lastSearchSector, setLastSearchSector] = useState("");
  const [showTips, setShowTips] = useState(() => !sessionStorage.getItem("leads_tips_hidden"));
  const cityInputRef = useRef<HTMLInputElement>(null);
  const pendingQuickSearch = useRef<{ city: string; sector: string } | null>(null);
  const pipelineRef = useRef<HTMLDivElement>(null);

  // Pipeline
  const [selected, setSelected] = useState<(Lead & { _score: number; _sector: string }) | null>(null);
  const [activeChannel, setActiveChannel] = useState<"whatsapp" | "instagram" | "email">("whatsapp");
  const [generatingMsg, setGeneratingMsg] = useState(false);
  const [generatedMessage, setGeneratedMessage] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [enrichingIg, setEnrichingIg] = useState(false);
  const [enrichedData, setEnrichedData] = useState<{ instagram?: string; email?: string; phone?: string; facebook?: string; source?: string } | null>(null);

  // Manual lead input
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualWebsite, setManualWebsite] = useState("");
  const [manualIg, setManualIg] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualSector, setManualSector] = useState("food");

  /* ─── Process results from API ─── */
  const processResults = useCallback((apiResults: any[], append: boolean) => {
    const mapped = apiResults.map((r: any) => {
      const lead: Lead = {
        name: r.name, full_address: r.full_address || "", city: r.city || city,
        zone: r.zone || "", phone: r.phone || null, website: r.website || null,
        email: r.email || null, instagram: r.instagram || null, facebook: r.facebook || null,
        google_rating: r.google_rating || 0, google_reviews: r.google_reviews || 0,
        google_maps_url: r.google_maps_url || null, source: r.source || "openstreetmap",
        osm_type: r.osm_type, types: r.types, lat: r.lat, lon: r.lon,
        opening_hours: r.opening_hours || null, cuisine: r.cuisine || null,
        search_google: r.search_google, search_instagram: r.search_instagram, search_facebook: r.search_facebook,
      };
      const detSector = detectSector(lead, sector);
      return { ...lead, _score: computeScore(lead), _sector: detSector };
    });

    let filtered = mapped;
    if (minRating > 0) filtered = filtered.filter(r => (r.google_rating || 0) >= minRating);
    if (maxRating < 5) filtered = filtered.filter(r => (r.google_rating || 0) <= maxRating);
    if (filterNoWebsite) filtered = filtered.filter(r => !r.website);
    if (filterNoSocial) filtered = filtered.filter(r => !r.instagram && !r.facebook);
    if (filterHasPhone) filtered = filtered.filter(r => !!r.phone);

    if (append) {
      setResults(prev => {
        const existingNames = new Set(prev.map(p => p.name.toLowerCase()));
        const newOnly = filtered.filter(r => !existingNames.has(r.name.toLowerCase()));
        return [...prev, ...newOnly];
      });
    } else {
      setResults(filtered);
    }
    return filtered;
  }, [city, sector, minRating, maxRating, filterNoWebsite, filterNoSocial, filterHasPhone]);

  /* ─── Batch enrich Instagram for leads without IG ─── */
  const batchEnrichInstagram = useCallback(async (leads: (Lead & { _score: number; _sector: string })[]) => {
    const needsIg = leads.filter(l => !l.instagram && l.name).slice(0, 15);
    if (needsIg.length === 0) return;

    try {
      const { data, error } = await supabase.functions.invoke("enrich-lead-social", {
        body: {
          batch: true,
          businesses: needsIg.map(l => ({ name: l.name, city: l.city || city, sector: l._sector })),
        },
      });
      if (!error && data?.success && data.results) {
        const igResults = data.results as Record<string, { instagram: string; profile?: any; source: string }>;
        setResults(prev => prev.map(r => {
          const match = igResults[r.name];
          if (match?.instagram) {
            return {
              ...r,
              instagram: match.instagram,
              email: match.profile?.email_from_bio || r.email,
              phone: match.profile?.phone_from_bio || r.phone,
            };
          }
          return r;
        }));
        const found = Object.keys(igResults).length;
        if (found > 0) {
          toast.success(`📸 ${found} profili Instagram trovati automaticamente`, {
            description: "Dati social arricchiti via AI + scraping",
          });
        }
      }
    } catch (e) {
      console.log("Batch IG enrich failed:", e);
    }
  }, [city]);

  /* ─── Search ─── */
  const handleSearch = useCallback(async (page = 0, append = false) => {
    if (!city.trim() && !query.trim()) {
      toast.error("Inserisci una città o parola chiave");
      return;
    }
    if (append) setDeepLoading(true);
    else { setLoading(true); setResults([]); setSelected(null); setGeneratedMessage(null); }

    try {
      const existingNames = append ? results.map(r => r.name) : [];
      const searchCity = country ? `${city.trim()}, ${COUNTRIES.find(c => c.code === country)?.label.replace(/^..\s/, '') || country}` : city.trim();
      const { data, error } = await supabase.functions.invoke("lead-search", {
        body: {
          query: query.trim(), city: searchCity, sector,
          mode: "zone", use_google: true, page,
          existing_names: existingNames,
          radius,
        },
      });
      if (error) throw error;
      if (data?.success && data.results?.length > 0) {
        const processed = processResults(data.results, append);
        setSearchPage(page);
        setHasMore(data.has_more ?? false);
        setLastSearchCity(city.trim());
        setLastSearchSector(sector);
        const sources = data.sources || {};
        toast.success(`${append ? "+" : ""}${processed.length} lead reali trovati`, {
          description: `OSM: ${sources.nominatim || 0} · Overpass: ${sources.overpass || 0} · Photon: ${sources.photon || 0} · Google: ${sources.google || 0}`,
        });
        // Auto-batch enrich Instagram in background
        setTimeout(() => batchEnrichInstagram(processed), 1500);
      } else if (!append) {
        toast.error("Nessun risultato — prova un'altra città o settore");
      } else {
        setHasMore(false);
        toast.info("Nessun nuovo lead trovato in questa zona — prova ad espandere la ricerca");
      }
    } catch (e: any) {
      toast.error(e.message || "Errore ricerca");
    } finally {
      setLoading(false);
      setDeepLoading(false);
    }
  }, [city, query, sector, country, radius, minRating, maxRating, filterNoWebsite, filterNoSocial, filterHasPhone, results, processResults, batchEnrichInstagram]);

  /* ─── Deep search ─── */
  const handleDeepSearch = useCallback(() => {
    handleSearch(searchPage + 1, true);
  }, [handleSearch, searchPage]);

  /* ─── Add manual lead ─── */
  const addManualLead = () => {
    if (!manualName.trim()) { toast.error("Nome attività obbligatorio"); return; }
    const lead: Lead & { _score: number; _sector: string } = {
      name: manualName.trim(), full_address: "", city: manualCity.trim() || "N/A",
      zone: "", phone: manualPhone.trim() || null, website: manualWebsite.trim() || null,
      email: null, instagram: manualIg.trim() || null, google_rating: 0, google_reviews: 0,
      google_maps_url: null, source: "manual", isManual: true,
      _score: computeScore({ name: manualName, full_address: "", city: manualCity, zone: "", phone: manualPhone || null, website: manualWebsite || null, email: null, instagram: manualIg || null, google_rating: 0, google_reviews: 0, google_maps_url: null, source: "manual" }),
      _sector: manualSector,
    };
    setResults(prev => [lead, ...prev]);
    setManualName(""); setManualCity(""); setManualWebsite(""); setManualIg(""); setManualPhone("");
    setShowManual(false);
    toast.success(`${lead.name} aggiunto manualmente`);
  };

  /* ─── Enrich lead social data ─── */
  const enrichLeadSocial = useCallback(async (lead: Lead & { _score: number; _sector: string }) => {
    if (lead.instagram) {
      setEnrichedData({ instagram: lead.instagram, source: "existing" });
      return lead.instagram;
    }
    setEnrichingIg(true);
    setEnrichedData(null);
    try {
      const { data, error } = await supabase.functions.invoke("enrich-lead-social", {
        body: { website: lead.website || "", name: lead.name, city: lead.city },
      });
      if (!error && data?.success) {
        const enriched: any = {};
        if (data.instagram) enriched.instagram = data.instagram;
        if (data.email && !lead.email) enriched.email = data.email;
        if (data.phone && !lead.phone) enriched.phone = data.phone;
        if (data.facebook && !lead.facebook) enriched.facebook = data.facebook;
        enriched.source = data.source || "enriched";
        setEnrichedData(enriched);
        // Update the lead in results
        if (data.instagram || data.email || data.phone) {
          setResults(prev => prev.map(r => 
            r.name === lead.name && r.full_address === lead.full_address
              ? { ...r, instagram: data.instagram || r.instagram, email: data.email || r.email, phone: data.phone || r.phone, facebook: data.facebook || r.facebook }
              : r
          ));
          if (data.instagram) {
            lead.instagram = data.instagram;
            toast.success(`📸 Instagram trovato: @${data.instagram}`, { description: `Fonte: ${data.source === "website_scrape" ? "Sito web" : "AI"}` });
          }
        }
        return data.instagram || null;
      }
    } catch (e) {
      console.log("Enrich failed:", e);
    } finally {
      setEnrichingIg(false);
    }
    return null;
  }, []);

  /* ─── Select + auto-generate ─── */
  const handleSelect = useCallback(async (lead: Lead & { _score: number; _sector: string }, channelOverride?: string) => {
    setSelected(lead);
    setShowPreview(true);
    setTimeout(() => pipelineRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 150);
    const channel = channelOverride || activeChannel;
    setGeneratingMsg(true);
    setGeneratedMessage(null);

    // Enrich social data in parallel with message generation
    const enrichPromise = enrichLeadSocial(lead);

    try {
      const sectorLabel = INDUSTRY_CONFIGS[lead._sector as keyof typeof INDUSTRY_CONFIGS]?.label || lead._sector;
      const demoLink = `${window.location.origin}${getDemoSiteUrl(lead._sector)}`;
      const portfolioRef = PORTFOLIO_REFS[lead._sector] || "il nostro portfolio";
      
      // Wait for enrichment to get IG handle
      const igHandle = await enrichPromise;
      const ig = igHandle || lead.instagram?.replace("@", "") || "";

      const { data, error } = await supabase.functions.invoke("scan-prospect", {
        body: {
          instagram: ig, website: lead.website || "", sector: sectorLabel,
          channel, demoLink, allDemosLink: `${window.location.origin}/demo`,
          contactInfo: "📩 info@empireaigroup.com", leadName: lead.name,
          leadCity: lead.city, leadPhone: lead.phone, portfolioRef,
          country: country || "",
        },
      });
      if (!error && data?.message) {
        const msg = data.message.replace(/\{\{DEMO_LINK\}\}/g, demoLink);
        setGeneratedMessage(msg);
        toast.success(`Messaggio ${channel} generato per ${lead.name}`);
      } else throw new Error("No message");
    } catch {
      const sectorLabel = INDUSTRY_CONFIGS[lead._sector as keyof typeof INDUSTRY_CONFIGS]?.label || "la vostra attività";
      const demoLink = `${window.location.origin}${getDemoSiteUrl(lead._sector)}`;
      const fb = channel === "instagram"
        ? `${lead.name} — che spettacolo! 🔥\n\nAbbiamo creato qualcosa di simile per il vostro settore:\n👉 ${demoLink}\n\nVi interessa?`
        : channel === "email"
        ? `Oggetto: Proposta digitale per ${lead.name}\n\nBuongiorno,\n\nAbbiamo sviluppato una piattaforma completa per ${sectorLabel}.\n\nDemo: ${demoLink}\n\nSarebbe disponibile per una call?\n\n---\nEmpire AI Group\n📩 info@empireaigroup.com`
        : `Buongiorno! 👋\n\nHo notato *${lead.name}* a ${lead.city} — complimenti!\n\nAbbiamo una piattaforma per ${sectorLabel} che automatizza prenotazioni e marketing.\n\n👉 Demo: ${demoLink}\n\nPosso mostrarvi in 2 minuti?`;
      setGeneratedMessage(fb);
    } finally {
      setGeneratingMsg(false);
    }
  }, [activeChannel, enrichLeadSocial, country]);

  const copyMessage = () => {
    if (generatedMessage) {
      navigator.clipboard.writeText(generatedMessage);
      toast.success("Messaggio copiato!");
    }
  };

  const sorted = [...results].sort((a, b) =>
    sortBy === "score" ? b._score - a._score :
    sortBy === "rating" ? (b.google_rating || 0) - (a.google_rating || 0) :
    a.name.localeCompare(b.name)
  );

  const hotLeads = results.filter(l => l._score >= 70).length;
  const sectorConfig = selected ? INDUSTRY_CONFIGS[selected._sector as keyof typeof INDUSTRY_CONFIGS] : null;
  const previewScreens = selected ? getPreviewScreens(selected._sector) : [];

  // Auto-focus city input on mount
  useEffect(() => {
    setTimeout(() => cityInputRef.current?.focus(), 400);
  }, []);

  // Handle pending quick search after state updates
  useEffect(() => {
    if (pendingQuickSearch.current && city === pendingQuickSearch.current.city && sector === pendingQuickSearch.current.sector) {
      pendingQuickSearch.current = null;
      handleSearch();
    }
  }, [city, sector]); // eslint-disable-line react-hooks/exhaustive-deps

  const inputStyle = { background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)" };

  // Source stats
  const sourceStats = results.reduce((acc, r) => {
    acc[r.source] = (acc[r.source] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  /* ─── Interactive Data Sphere ─── */
  const [sphereHover, setSphereHover] = useState(false);
  const sphereNodes = Array.from({ length: 18 }, (_, i) => {
    const angle = (i / 18) * Math.PI * 2;
    const r = 28 + (i % 3) * 8;
    return { x: 50 + Math.cos(angle) * r, y: 50 + Math.sin(angle) * r, delay: i * 0.12, size: 2.5 + (i % 3) };
  });

  return (
    <div className="min-h-screen p-4 space-y-4 pb-24 max-w-2xl mx-auto relative overflow-hidden" style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%)" }}>

      {/* ═══ AMBIENT VIOLET BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 80% 50% at 30% 20%, rgba(139,92,246,0.08), transparent 60%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 60% 60% at 80% 70%, rgba(109,40,217,0.06), transparent 50%)" }} />
        <div className="absolute inset-0" style={{ background: "radial-gradient(circle at 50% 50%, rgba(167,139,250,0.04), transparent 70%)" }} />
        {/* Animated grid dots */}
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={`bg-dot-${i}`}
            className="absolute rounded-full"
            style={{
              width: 2, height: 2,
              left: `${10 + (i % 4) * 25}%`,
              top: `${15 + Math.floor(i / 4) * 30}%`,
              background: "rgba(167,139,250,0.2)",
            }}
            animate={{ opacity: [0.1, 0.4, 0.1], scale: [1, 1.5, 1] }}
            transition={{ repeat: Infinity, duration: 3 + (i % 3), delay: i * 0.3 }}
          />
        ))}
      </div>

      <div className="relative z-10 space-y-4">

      {/* ═══ HERO SECTION ═══ */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center pt-3 pb-2 gap-3"
      >
        {/* Title — centered and prominent */}
        <div className="text-center">
          <motion.h1
            className="text-xl font-extrabold tracking-tight text-white flex items-center justify-center gap-2"
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <Target className="w-5 h-5 shrink-0" style={{ color: "#14b8a6" }} />
            LeadEngine Scout
          </motion.h1>
          <motion.p
            className="text-[11px] font-semibold tracking-widest uppercase mt-1"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            Intelligenza Artificiale · Real-time
          </motion.p>
        </div>

        {/* Orb + Mascot row */}
        <div className="flex items-center justify-center gap-4">
          {/* ═══ INTERACTIVE HOLOGRAPHIC ORB ═══ */}
          <motion.div
            className="relative w-20 h-20 shrink-0 cursor-pointer"
            onHoverStart={() => setSphereHover(true)}
            onHoverEnd={() => setSphereHover(false)}
            onTapStart={() => setSphereHover(true)}
            onTap={() => setTimeout(() => setSphereHover(false), 1200)}
            animate={{
              y: [0, -6, 0, -3, 0],
              rotateY: sphereHover ? [0, 20, -20, 0] : 0,
              rotateX: sphereHover ? [0, -10, 10, 0] : 0,
            }}
            transition={{ y: { repeat: Infinity, duration: 4, ease: "easeInOut" }, rotateY: { duration: 1.2 }, rotateX: { duration: 1.2 } }}
            style={{ perspective: 400 }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px solid rgba(139,92,246,${sphereHover ? 0.35 : 0.1})`,
                  transform: `rotateX(${60 + i * 20}deg) rotateZ(${i * 60}deg)`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ repeat: Infinity, duration: 6 + i * 2, ease: "linear" }}
              />
            ))}
            <motion.div
              className="absolute inset-[-8px] rounded-full"
              animate={{
                scale: sphereHover ? [1, 1.25, 1] : [1, 1.08, 1],
                opacity: sphereHover ? [0.4, 0.1, 0.4] : [0.15, 0.05, 0.15],
              }}
              transition={{ repeat: Infinity, duration: sphereHover ? 0.9 : 2.5 }}
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.3), transparent 70%)" }}
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_12px_rgba(139,92,246,0.3)]">
              <defs>
                <radialGradient id="holoCore" cx="45%" cy="40%">
                  <stop offset="0%" stopColor="rgba(167,139,250,0.25)" />
                  <stop offset="50%" stopColor="rgba(139,92,246,0.08)" />
                  <stop offset="100%" stopColor="transparent" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="1.5" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              <circle cx={50} cy={50} r={40} fill="url(#holoCore)" />
              {[16, 26, 36].map((r, i) => (
                <motion.circle
                  key={`wire-${i}`}
                  cx={50} cy={50} r={r}
                  fill="none"
                  stroke={i === 1 ? "rgba(20,184,166,0.2)" : "rgba(139,92,246,0.18)"}
                  strokeWidth={0.5}
                  strokeDasharray={`${3 + i * 2} ${4 + i}`}
                  animate={{
                    r: sphereHover ? [r, r + 4, r - 2, r] : r,
                    strokeDashoffset: [0, 100],
                    opacity: sphereHover ? [0.7, 0.3, 0.7] : [0.2, 0.35, 0.2],
                  }}
                  transition={{
                    r: { duration: 1, repeat: sphereHover ? Infinity : 0 },
                    strokeDashoffset: { repeat: Infinity, duration: 8 + i * 3, ease: "linear" },
                    opacity: { repeat: Infinity, duration: 2 },
                  }}
                />
              ))}
              {sphereNodes.map((n, i) => {
                const angle = (i * 137.5 * Math.PI) / 180;
                const baseR = 12 + (i % 4) * 8;
                const orbitR = sphereHover ? baseR + 6 : baseR;
                return (
                  <motion.circle
                    key={`particle-${i}`}
                    fill={i % 3 === 0 ? "#8b5cf6" : i % 3 === 1 ? "#14b8a6" : "#a78bfa"}
                    filter="url(#glow)"
                    animate={{
                      cx: [
                        50 + Math.cos(angle) * orbitR,
                        50 + Math.cos(angle + 0.8) * (orbitR + (sphereHover ? 5 : 2)),
                        50 + Math.cos(angle + 1.6) * orbitR,
                        50 + Math.cos(angle) * orbitR,
                      ],
                      cy: [
                        50 + Math.sin(angle) * orbitR,
                        50 + Math.sin(angle + 0.8) * (orbitR + (sphereHover ? 5 : 2)),
                        50 + Math.sin(angle + 1.6) * orbitR,
                        50 + Math.sin(angle) * orbitR,
                      ],
                      r: sphereHover ? [n.size / 2, n.size, n.size / 2] : [n.size / 2.5, n.size / 1.8, n.size / 2.5],
                      opacity: sphereHover ? [1, 0.4, 1] : [0.25, 0.5, 0.25],
                    }}
                    transition={{ repeat: Infinity, duration: 3 + (i % 4), ease: "easeInOut", delay: i * 0.15 }}
                  />
                );
              })}
              <motion.line
                x1={50} y1={50} x2={90} y2={50}
                stroke="rgba(139,92,246,0.25)"
                strokeWidth={sphereHover ? 1 : 0.5}
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: sphereHover ? 1.5 : 4, ease: "linear" }}
                style={{ transformOrigin: "50px 50px" }}
              />
              <motion.circle
                cx={50} cy={50}
                fill="rgba(167,139,250,0.6)"
                filter="url(#glow)"
                animate={{
                  r: sphereHover ? [3, 7, 3] : [2, 4, 2],
                  opacity: sphereHover ? [1, 0.3, 1] : [0.4, 0.7, 0.4],
                }}
                transition={{ repeat: Infinity, duration: sphereHover ? 0.6 : 2 }}
              />
              <motion.circle
                cx={50} cy={50} r={1.5}
                fill="#fff"
                animate={{ opacity: sphereHover ? [1, 0.2, 1] : [0.5, 0.8, 0.5] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </svg>
            <motion.span
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 text-[6px] font-bold uppercase tracking-[0.2em] whitespace-nowrap"
              style={{ color: "#a78bfa" }}
              animate={{ opacity: sphereHover ? 1 : 0.35 }}
            >
              {sphereHover ? "⚡ SCAN" : "◉ AI"}
            </motion.span>
          </motion.div>

          {/* ═══ MASCOT ═══ */}
          <div className="relative w-20 h-20 shrink-0">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute inset-[-6px] rounded-full"
              style={{ border: "1.5px dashed rgba(167,139,250,0.3)" }}
            />
            {loading && (
              <motion.div
                animate={{ scale: [1, 1.6, 1], opacity: [0.5, 0, 0.5] }}
                transition={{ repeat: Infinity, duration: 1.2 }}
                className="absolute inset-[-8px] rounded-full"
                style={{ border: "2px solid rgba(167,139,250,0.4)" }}
              />
            )}
            <motion.div
              animate={{ opacity: loading ? [0.3, 0.6, 0.3] : [0.15, 0.25, 0.15] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-[-10px] rounded-full"
              style={{ background: "radial-gradient(circle, rgba(167,139,250,0.3), transparent 70%)", filter: "blur(12px)" }}
            />
            <motion.img
              src={empireMonkeyLaptop}
              alt="Empire Scout"
              className="w-full h-full object-contain relative z-10 drop-shadow-[0_0_15px_rgba(167,139,250,0.4)]"
              animate={{
                y: loading ? [0, -6, 0] : [0, -3, 0],
                rotate: loading ? [0, -2, 2, 0] : [0, -1, 1, 0],
                scale: loading ? [1, 1.05, 1] : [1, 1.02, 1],
              }}
              transition={{ repeat: Infinity, duration: loading ? 1.5 : 3, ease: "easeInOut" }}
            />
          </div>
        </div>
      </motion.div>

      {/* Lead count badges */}
      <div className="flex justify-center">
        {results.length > 0 && (
          <div className="flex items-center gap-1.5 mt-1.5">
            <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
              🟢 {results.length} lead
            </span>
            <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
              🔥 {hotLeads} caldi
            </span>
          </div>
        )}
      </div>

      {/* ═══ TIPS — dismissable ═══ */}
      <AnimatePresence>
        {showTips && results.length === 0 && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: "rgba(20,184,166,0.04)", border: "1px solid rgba(20,184,166,0.12)" }}>
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#14b8a6" }} />
            <div className="flex-1">
              <p className="text-[10px] font-bold mb-1" style={{ color: "#5eead4" }}>Come funziona in 3 step:</p>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { step: "1", title: "Cerca", desc: "Inserisci città e settore — la ricerca parte in automatico su 4+ fonti" },
                  { step: "2", title: "Analizza", desc: "Ogni lead ha uno score di opportunità, dati social e contatti reali" },
                  { step: "3", title: "Contatta", desc: "Messaggio AI personalizzato per WhatsApp, Instagram o Email" },
                ].map((s, i) => (
                  <div key={i} className="text-center">
                    <span className="inline-flex w-5 h-5 rounded-full items-center justify-center text-[9px] font-bold mb-1" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>{s.step}</span>
                    <p className="text-[9px] font-bold text-white">{s.title}</p>
                    <p className="text-[8px]" style={{ color: "#6b7280" }}>{s.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            <button onClick={() => { setShowTips(false); sessionStorage.setItem("leads_tips_hidden", "1"); }}
              className="p-1 rounded shrink-0" style={{ color: "#6b7280" }}>
              <XIcon className="w-3 h-3" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ SEARCH BAR ═══ */}
      <div className="rounded-2xl p-4 space-y-3" style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.06), rgba(16,185,129,0.03))", border: "1px solid rgba(20,184,166,0.15)" }}>
        
        {/* Row 1: Country + City */}
        <div className="grid grid-cols-2 gap-2">
          <div>
            <label className="text-[8px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>🌍 Paese</label>
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-3 rounded-xl text-[11px] text-white outline-none appearance-none cursor-pointer" style={inputStyle}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code} style={{ background: "#1a1a2e" }}>{c.label}</option>)}
            </select>
          </div>
          <div className="relative">
            <label className="text-[8px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>📍 Città</label>
            <MapPin className="absolute left-3 bottom-3 w-3.5 h-3.5" style={{ color: "#14b8a6" }} />
            <input ref={cityInputRef} value={city} onChange={e => setCity(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Roma, Milano, Dubai..." className="w-full pl-9 pr-3 py-3 rounded-xl text-[11px] text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
          </div>
        </div>

        {/* Row 2: Sector */}
        <div>
          <label className="text-[8px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>🏢 Settore / Categoria</label>
          <select value={sector} onChange={e => setSector(e.target.value)}
            className="w-full px-3 py-3 rounded-xl text-[11px] text-white outline-none appearance-none cursor-pointer" style={inputStyle}>
            {SECTOR_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: "#1a1a2e" }}>{s.label}</option>)}
          </select>
        </div>

        {/* Row 3: Query + Search button */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 relative">
            <label className="text-[8px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>🔎 Zona / Nome (opzionale)</label>
            <Search className="absolute left-3 bottom-3 w-3.5 h-3.5" style={{ color: "#6b7280" }} />
            <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Es: Trastevere, Brera..." className="w-full pl-9 pr-3 py-3 rounded-xl text-[11px] text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
          </div>
          <div className="flex items-end">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSearch()} disabled={loading}
              className="w-full py-3 rounded-xl text-[11px] font-bold flex items-center justify-center gap-1.5"
              style={{ background: loading ? "rgba(20,184,166,0.3)" : "linear-gradient(135deg, #14b8a6, #10b981)", color: "#fff" }}>
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
              {loading ? "..." : "Cerca"}
            </motion.button>
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setShowFilters(!showFilters)} className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ ...inputStyle, color: showFilters ? "#14b8a6" : "#9ca3af" }}>
            <Filter className="w-3 h-3" /> Filtri avanzati <ChevronDown className={`w-3 h-3 transition-transform ${showFilters ? "rotate-180" : ""}`} />
          </button>
          <button onClick={() => setShowManual(!showManual)} className="flex items-center gap-1 text-[10px] font-semibold px-2.5 py-1.5 rounded-lg" style={{ ...inputStyle, color: "#a78bfa" }}>
            <UserPlus className="w-3 h-3" /> Lead esterno
          </button>
          {/* Source badges */}
          {results.length > 0 && Object.entries(sourceStats).map(([src, count]) => {
            const info = SOURCE_LABELS[src] || { label: src, color: "#9ca3af" };
            return (
              <span key={src} className="text-[8px] font-bold px-2 py-1 rounded-lg" style={{ background: `${info.color}12`, color: info.color }}>
                {info.label}: {count}
              </span>
            );
          })}
        </div>

        {/* ═══ ADVANCED FILTERS ═══ */}
        <AnimatePresence>
          {showFilters && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="rounded-xl p-3 space-y-3" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)" }}>
                <p className="text-[9px] font-bold uppercase tracking-widest flex items-center gap-1.5" style={{ color: "#14b8a6" }}>
                  <Filter className="w-3 h-3" /> Filtri per Conversione Mirata
                </p>
                <p className="text-[8px]" style={{ color: "#6b7280" }}>
                  Usa questi filtri per trovare lead con il massimo potenziale di conversione
                </p>
                
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {/* Rating range */}
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Rating min</label>
                    <select value={minRating} onChange={e => setMinRating(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg text-[10px] text-white outline-none" style={inputStyle}>
                      <option value={0} style={{ background: "#1a1a2e" }}>Tutti</option>
                      <option value={1} style={{ background: "#1a1a2e" }}>1+ ⭐</option>
                      <option value={2} style={{ background: "#1a1a2e" }}>2+ ⭐</option>
                      <option value={3} style={{ background: "#1a1a2e" }}>3+ ⭐</option>
                      <option value={4} style={{ background: "#1a1a2e" }}>4+ ⭐</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Rating max</label>
                    <select value={maxRating} onChange={e => setMaxRating(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg text-[10px] text-white outline-none" style={inputStyle}>
                      <option value={5} style={{ background: "#1a1a2e" }}>Tutti</option>
                      <option value={4} style={{ background: "#1a1a2e" }}>≤4 ⭐</option>
                      <option value={3.5} style={{ background: "#1a1a2e" }}>≤3.5 ⭐</option>
                      <option value={3} style={{ background: "#1a1a2e" }}>≤3 ⭐ (problematici)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Raggio ricerca</label>
                    <select value={radius} onChange={e => setRadius(Number(e.target.value))} className="w-full px-2 py-2 rounded-lg text-[10px] text-white outline-none" style={inputStyle}>
                      {RADIUS_OPTIONS.map(r => <option key={r.value} value={r.value} style={{ background: "#1a1a2e" }}>{r.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="text-[8px] font-bold uppercase tracking-wider block mb-1" style={{ color: "#6b7280" }}>Canale default</label>
                    <select value={activeChannel} onChange={e => setActiveChannel(e.target.value as any)} className="w-full px-2 py-2 rounded-lg text-[10px] text-white outline-none" style={inputStyle}>
                      <option value="whatsapp" style={{ background: "#1a1a2e" }}>💬 WhatsApp</option>
                      <option value="instagram" style={{ background: "#1a1a2e" }}>📷 Instagram DM</option>
                      <option value="email" style={{ background: "#1a1a2e" }}>📧 Email Pro</option>
                    </select>
                  </div>
                </div>

                {/* Toggle filters — high conversion targeting */}
                <div className="flex flex-wrap gap-2">
                  {[
                    { active: filterNoWebsite, toggle: () => setFilterNoWebsite(!filterNoWebsite), label: "❌ Senza sito web", desc: "Lead senza presenza online — massimo potenziale", color: "#ef4444" },
                    { active: filterNoSocial, toggle: () => setFilterNoSocial(!filterNoSocial), label: "📵 Senza social", desc: "Nessun Instagram/Facebook — bisogno evidente", color: "#f59e0b" },
                    { active: filterHasPhone, toggle: () => setFilterHasPhone(!filterHasPhone), label: "📞 Con telefono", desc: "Contattabili subito via WA/call", color: "#10b981" },
                  ].map((f, i) => (
                    <button key={i} onClick={f.toggle}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-semibold transition-all"
                      style={{
                        background: f.active ? `${f.color}15` : "rgba(255,255,255,0.02)",
                        border: `1px solid ${f.active ? `${f.color}40` : "rgba(255,255,255,0.06)"}`,
                        color: f.active ? f.color : "#6b7280",
                      }}>
                      {f.active ? <CheckCircle className="w-3 h-3" /> : <Plus className="w-3 h-3" />} {f.label}
                    </button>
                  ))}
                </div>

                {(filterNoWebsite || filterNoSocial || filterHasPhone || minRating > 0 || maxRating < 5) && (
                  <button onClick={() => { setFilterNoWebsite(false); setFilterNoSocial(false); setFilterHasPhone(false); setMinRating(0); setMaxRating(5); }}
                    className="text-[9px] font-semibold flex items-center gap-1" style={{ color: "#ef4444" }}>
                    <XIcon className="w-3 h-3" /> Reset filtri
                  </button>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Manual lead input */}
        <AnimatePresence>
          {showManual && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="rounded-xl p-3 space-y-2" style={{ background: "rgba(167,139,250,0.05)", border: "1px solid rgba(167,139,250,0.15)" }}>
                <p className="text-[10px] font-bold" style={{ color: "#c4b5fd" }}>📥 Aggiungi un lead trovato esternamente</p>
                <p className="text-[8px]" style={{ color: "#6b7280" }}>Hai trovato un lead su Google, social o di persona? Aggiungilo qui per generare il messaggio AI</p>
                <div className="grid grid-cols-2 gap-2">
                  <input value={manualName} onChange={e => setManualName(e.target.value)} placeholder="Nome attività *" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="Città" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualWebsite} onChange={e => setManualWebsite(e.target.value)} placeholder="Sito web" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualIg} onChange={e => setManualIg(e.target.value)} placeholder="@instagram" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualPhone} onChange={e => setManualPhone(e.target.value)} placeholder="Telefono" className="px-3 py-2 rounded-lg text-xs text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <select value={manualSector} onChange={e => setManualSector(e.target.value)} className="px-3 py-2 rounded-lg text-xs text-white outline-none" style={inputStyle}>
                    {SECTOR_OPTIONS.map(s => <option key={s.value} value={s.value} style={{ background: "#1a1a2e" }}>{s.label}</option>)}
                  </select>
                </div>
                <motion.button whileTap={{ scale: 0.97 }} onClick={addManualLead}
                  className="w-full py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff" }}>
                  <UserPlus className="w-3.5 h-3.5" /> Aggiungi e Analizza
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ RESULTS LIST ═══ */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-semibold" style={{ color: "#9ca3af" }}>
                {results.length} lead {city && `a ${city}`} {searchPage > 0 && `(${searchPage + 1} ricerche)`}
              </p>
              <div className="flex items-center gap-0.5">
                <ArrowUpDown className="w-3 h-3 mr-1" style={{ color: "#6b7280" }} />
                {(["score", "rating", "name"] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)} className="px-2 py-1 rounded text-[9px] font-semibold transition-all"
                    style={{ background: sortBy === s ? "rgba(255,255,255,0.08)" : "transparent", color: sortBy === s ? "#e5e7eb" : "#6b7280" }}>
                    {s === "score" ? "Score" : s === "rating" ? "Rating" : "Nome"}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-1.5 max-h-[380px] overflow-y-auto pr-1">
              {sorted.map((lead, i) => {
                const isSelected = selected?.name === lead.name && selected?.full_address === lead.full_address;
                const scoreColor = lead._score >= 70 ? "#ef4444" : lead._score >= 45 ? "#f59e0b" : "#10b981";
                const srcInfo = SOURCE_LABELS[lead.source] || { label: lead.source, color: "#9ca3af" };
                return (
                  <motion.button key={`${lead.name}-${i}`}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.01, 0.5) }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleSelect(lead)}
                    className="w-full text-left p-3 rounded-xl transition-all flex items-start gap-3"
                    style={{
                      background: isSelected ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(20,184,166,0.3)" : "rgba(255,255,255,0.05)"}`,
                    }}>
                    {/* Score circle */}
                    <div className="w-10 h-10 rounded-xl flex flex-col items-center justify-center shrink-0" style={{ background: `${scoreColor}15`, border: `1px solid ${scoreColor}30` }}>
                      <span className="text-xs font-black" style={{ color: scoreColor }}>{lead._score}</span>
                      <span className="text-[6px] font-bold uppercase" style={{ color: scoreColor }}>score</span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-xs font-bold text-white truncate">{lead.name}</p>
                        {lead.isManual && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.12)", color: "#c4b5fd" }}>Esterno</span>
                        )}
                        <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{
                          background: `${srcInfo.color}12`, color: srcInfo.color,
                        }}>
                          {srcInfo.label}
                        </span>
                        {lead.google_rating > 0 && (
                          <span className="text-[8px] px-1.5 py-0.5 rounded-full" style={{ background: "rgba(251,191,36,0.12)", color: "#fbbf24" }}>
                            ⭐ {lead.google_rating}
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] truncate mt-0.5" style={{ color: "#6b7280" }}>{lead.full_address || lead.city}</p>
                      <div className="flex items-center gap-2.5 mt-1 flex-wrap">
                        {lead.phone && <span className="text-[9px] flex items-center gap-1" style={{ color: "#34d399" }}><Phone className="w-2.5 h-2.5" /> {lead.phone}</span>}
                        {lead.website && <span className="text-[9px] flex items-center gap-1" style={{ color: "#60a5fa" }}><Globe className="w-2.5 h-2.5" /> Sito</span>}
                        {lead.instagram && <span className="text-[9px] flex items-center gap-1" style={{ color: "#E4405F" }}><Instagram className="w-2.5 h-2.5" /> IG</span>}
                        {lead.opening_hours && <span className="text-[9px] flex items-center gap-1" style={{ color: "#a78bfa" }}>🕐 Orari</span>}
                        {!lead.website && <span className="text-[9px] flex items-center gap-1" style={{ color: "#ef4444" }}><AlertTriangle className="w-2.5 h-2.5" /> No sito</span>}
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>

            {/* ═══ DEEP SEARCH BUTTON ═══ */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleDeepSearch}
              disabled={deepLoading}
              className="w-full py-3.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 mt-2"
              style={{
                background: deepLoading ? "rgba(124,58,237,0.2)" : "linear-gradient(135deg, rgba(124,58,237,0.12), rgba(20,184,166,0.08))",
                border: "1px solid rgba(124,58,237,0.25)",
                color: deepLoading ? "#a78bfa" : "#c4b5fd",
              }}
            >
              {deepLoading ? (
                <><Loader2 className="w-4 h-4 animate-spin" /> Ricerca approfondita in corso...</>
              ) : (
                <><Layers className="w-4 h-4" /> 🔍 Cerca ancora — trova più lead a {lastSearchCity || city}</>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ PIPELINE: Selected → Analysis + Customized Preview + Message ═══ */}
      <AnimatePresence>
        {selected && (
          <div ref={pipelineRef}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-3">

            {/* Lead Summary + Quick Analysis */}
            <div className="p-4 rounded-2xl" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.06), rgba(59,130,246,0.04))", border: "1px solid rgba(124,58,237,0.15)" }}>
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(59,130,246,0.1))" }}>
                    <Building2 className="w-5 h-5" style={{ color: "#a78bfa" }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-white truncate">{selected.name}</p>
                    <p className="text-[10px]" style={{ color: "#6b7280" }}>{selected.full_address || selected.city}</p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      {sectorConfig && (
                        <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{ background: "rgba(124,58,237,0.12)", color: "#c4b5fd" }}>
                          {sectorConfig.emoji} {sectorConfig.label}
                        </span>
                      )}
                      <span className="text-[9px] px-2 py-0.5 rounded-full font-bold" style={{
                        background: selected._score >= 70 ? "rgba(239,68,68,0.12)" : "rgba(245,158,11,0.12)",
                        color: selected._score >= 70 ? "#f87171" : "#fbbf24",
                      }}>
                        {selected._score >= 70 ? "🔥" : "⚡"} Score: {selected._score}/100
                      </span>
                    </div>
                  </div>
                </div>
                <button onClick={() => { setSelected(null); setGeneratedMessage(null); }}
                  className="p-1.5 rounded-lg shrink-0" style={{ background: "rgba(239,68,68,0.1)" }}>
                  <XIcon className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                </button>
              </div>

              {/* Analysis indicators */}
              <div className="grid grid-cols-4 gap-2 mt-3">
                {(() => {
                  const igHandle = selected.instagram || enrichedData?.instagram;
                  const igLoading = enrichingIg && !igHandle;
                  return [
                    { label: "Sito Web", value: selected.website ? "✅ Attivo" : "❌ Assente", color: selected.website ? "#34d399" : "#ef4444", icon: Globe },
                    { label: "Instagram", value: igLoading ? "🔍 Cerca..." : igHandle ? `@${igHandle}` : "❌ No", color: igHandle ? "#E4405F" : igLoading ? "#f59e0b" : "#6b7280", icon: Instagram },
                    { label: "Telefono", value: selected.phone ? "✅ OK" : "⚠️ N/D", color: selected.phone ? "#34d399" : "#f59e0b", icon: Phone },
                    { label: "Rating", value: selected.google_rating > 0 ? `⭐ ${selected.google_rating}` : "N/D", color: selected.google_rating >= 4 ? "#fbbf24" : "#6b7280", icon: Star },
                  ];
                })().map((ind, idx) => (
                  <div key={idx} className="p-2 rounded-xl text-center" style={{ background: `${ind.color}08`, border: `1px solid ${ind.color}20` }}>
                    <ind.icon className="w-3 h-3 mx-auto mb-0.5" style={{ color: ind.color }} />
                    <p className="text-[7px] font-bold uppercase" style={{ color: "#6b7280" }}>{ind.label}</p>
                    <p className="text-[8px] font-bold truncate" style={{ color: ind.color }}>{ind.value}</p>
                  </div>
                ))}
              </div>

              {/* Contact & research links */}
              <div className="flex gap-1.5 mt-3 flex-wrap">
                {/* Instagram direct link — enriched */}
                {(() => {
                  const igHandle = selected.instagram || enrichedData?.instagram;
                  if (igHandle) return (
                    <a href={`https://instagram.com/direct/t/${igHandle.replace("@", "")}`} target="_blank" rel="noopener noreferrer"
                      className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                      style={{ background: "rgba(228,64,95,0.15)", border: "1px solid rgba(228,64,95,0.3)", color: "#E4405F" }}>
                      <Instagram className="w-3 h-3" /> @{igHandle.replace("@", "")}
                    </a>
                  );
                  if (enrichingIg) return (
                    <span className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.2)", color: "#f59e0b" }}>
                      <Loader2 className="w-3 h-3 animate-spin" /> Cerco IG...
                    </span>
                  );
                  return null;
                })()}
                {selected.phone && (
                  <a href={`https://wa.me/${selected.phone.replace(/\s+/g, "").replace("+", "")}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(37,211,102,0.1)", border: "1px solid rgba(37,211,102,0.2)", color: "#25D366" }}>
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </a>
                )}
                {selected.website && (
                  <a href={selected.website.startsWith("http") ? selected.website : `https://${selected.website}`} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(59,130,246,0.1)", border: "1px solid rgba(59,130,246,0.2)", color: "#60a5fa" }}>
                    <Globe className="w-3 h-3" /> Sito
                  </a>
                )}
                {selected.google_maps_url && (
                  <a href={selected.google_maps_url} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(251,191,36,0.1)", border: "1px solid rgba(251,191,36,0.2)", color: "#fbbf24" }}>
                    <Map className="w-3 h-3" /> Maps
                  </a>
                )}
                {selected.search_google && (
                  <a href={selected.search_google} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(66,133,244,0.1)", border: "1px solid rgba(66,133,244,0.2)", color: "#93bbfc" }}>
                    <Search className="w-3 h-3" /> Google
                  </a>
                )}
                {selected.search_facebook && (
                  <a href={selected.search_facebook} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-semibold"
                    style={{ background: "rgba(24,119,242,0.1)", border: "1px solid rgba(24,119,242,0.2)", color: "#5B9BF5" }}>
                    <Facebook className="w-3 h-3" /> Facebook
                  </a>
                )}
              </div>
            </div>

            {/* ═══ AI ANALYSIS — Sector-Specific Pain Points ═══ */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}>
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} />
                <span className="text-xs font-bold text-white">Analisi Problematiche — {sectorConfig?.label || selected._sector}</span>
              </div>
              <div className="space-y-1.5">
                {(SECTOR_PAIN_ANALYSIS[selected._sector] || SECTOR_PAIN_ANALYSIS.default).map((pain, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}
                    className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
                    <span className="text-[9px] mt-0.5" style={{ color: "#ef4444" }}>⚠️</span>
                    <span className="text-[10px]" style={{ color: "#e5e7eb" }}>{pain}</span>
                  </motion.div>
                ))}
              </div>
              {/* Opportunity summary */}
              <div className="p-2.5 rounded-lg" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                <p className="text-[10px] font-bold" style={{ color: "#34d399" }}>
                  💡 {selected.name} ha {selected._score >= 70 ? "urgente bisogno" : selected._score >= 45 ? "bisogno evidente" : "potenziale"} di digitalizzazione nel settore {sectorConfig?.label || selected._sector}.
                  {!selected.website && " Non ha nemmeno un sito web — opportunità enorme."}
                </p>
              </div>
            </div>

            {/* ═══ CUSTOMIZED DEMO PREVIEW — Sector-Specific ═══ */}
            {(() => {
              const sectorFeats = getSectorFeatures(selected._sector);
              return (
              <div className="p-4 rounded-2xl space-y-2" style={{ background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Eye className="w-3.5 h-3.5" style={{ color: "#a78bfa" }} />
                    <span className="text-xs font-bold text-white">📱 Preview {sectorConfig?.label || "Business"} per {selected.name}</span>
                  </div>
                  <button onClick={() => setShowPreview(!showPreview)} className="text-[9px] font-semibold" style={{ color: "#a78bfa" }}>
                    {showPreview ? "Nascondi" : "Mostra"}
                  </button>
                </div>
                <AnimatePresence>
                  {showPreview && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      {/* Sector-specific features header */}
                      <div className="rounded-xl p-3 mb-2" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(20,184,166,0.06))", border: "1px solid rgba(124,58,237,0.15)" }}>
                        <p className="text-[10px] font-bold mb-2" style={{ color: "#e5e7eb" }}>
                          🎯 Ecco cosa includerebbe il progetto per <span style={{ color: "#a78bfa" }}>{selected.name}</span>:
                        </p>
                        <div className="grid grid-cols-2 gap-1.5">
                          {sectorFeats.features.map((feat, i) => (
                            <span key={i} className="text-[8px] px-2 py-1 rounded-lg font-semibold flex items-center gap-1" style={{ background: "rgba(20,184,166,0.08)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.12)" }}>
                              ✅ {feat}
                            </span>
                          ))}
                        </div>
                        <p className="text-[9px] font-bold mt-2" style={{ color: "#fbbf24" }}>
                          📈 {sectorFeats.value}
                        </p>
                      </div>

                      {previewScreens.length > 0 ? (
                        <>
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                            {previewScreens.map((screen, i) => (
                              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.08 }}
                                className="rounded-xl overflow-hidden aspect-[9/16] relative group" style={{ border: "1px solid rgba(167,139,250,0.15)" }}>
                                <img src={screen} alt={`Preview ${sectorConfig?.label || ""} ${i + 1}`} className="w-full h-full object-cover object-top" loading="lazy" />
                                <div className="absolute bottom-0 left-0 right-0 p-2" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.85))" }}>
                                  <p className="text-[8px] font-bold text-white truncate">{selected.name}</p>
                                  <p className="text-[6px]" style={{ color: "#a78bfa" }}>{sectorConfig?.label || "Business"}</p>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="rounded-xl p-4 text-center" style={{ background: "rgba(124,58,237,0.06)", border: "1px dashed rgba(124,58,237,0.2)" }}>
                          <Eye className="w-6 h-6 mx-auto mb-2" style={{ color: "#a78bfa" }} />
                          <p className="text-[10px] font-bold" style={{ color: "#c4b5fd" }}>Preview settore "{sectorConfig?.label || selected._sector}"</p>
                          <p className="text-[9px] mt-1" style={{ color: "#6b7280" }}>Apri la demo live per vedere il progetto completo</p>
                        </div>
                      )}
                      <div className="flex items-center gap-2 mt-2">
                        <a href={getDemoSiteUrl(selected._sector)} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold"
                          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(16,185,129,0.1))", border: "1px solid rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
                          <ExternalLink className="w-3 h-3" /> {sectorFeats.cta}
                        </a>
                        <button onClick={() => {
                          navigator.clipboard.writeText(`${window.location.origin}${getDemoSiteUrl(selected._sector)}`);
                          toast.success("Link demo copiato!");
                        }} className="px-4 py-2 rounded-xl text-[10px] font-bold" style={{ background: "rgba(16,185,129,0.1)", border: "1px solid rgba(16,185,129,0.2)", color: "#34d399" }}>
                          <Copy className="w-3 h-3" />
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              );
            })()}

            {/* Messaggio AI */}
            <div className="p-4 rounded-2xl space-y-3" style={{ background: "linear-gradient(135deg, rgba(16,185,129,0.05), rgba(59,130,246,0.03))", border: "1px solid rgba(16,185,129,0.12)" }}>
              <div className="flex items-center gap-2">
                <Wand2 className="w-4 h-4" style={{ color: "#34d399" }} />
                <span className="text-xs font-bold text-white">Messaggio Personalizzato AI</span>
                {generatingMsg && <Loader2 className="w-3.5 h-3.5 animate-spin" style={{ color: "#34d399" }} />}
              </div>

              {/* Channel selector */}
              <div className="flex gap-1.5">
                {([
                  { id: "whatsapp" as const, icon: MessageCircle, label: "WhatsApp", color: "#25D366" },
                  { id: "instagram" as const, icon: Instagram, label: "Instagram DM", color: "#E4405F" },
                  { id: "email" as const, icon: Mail, label: "Email Pro", color: "#3B82F6" },
                ] as const).map(ch => (
                  <button key={ch.id} onClick={() => {
                    if (activeChannel !== ch.id) {
                      setActiveChannel(ch.id);
                      if (selected && !generatingMsg) handleSelect(selected, ch.id);
                    }
                  }}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-semibold transition-all"
                    style={{
                      background: activeChannel === ch.id ? `${ch.color}18` : "rgba(255,255,255,0.03)",
                      border: `1px solid ${activeChannel === ch.id ? `${ch.color}40` : "rgba(255,255,255,0.06)"}`,
                      color: activeChannel === ch.id ? ch.color : "#6b7280",
                    }}>
                    <ch.icon className="w-3 h-3" /> {ch.label}
                  </button>
                ))}
              </div>

              {generatedMessage ? (
                <>
                  {/* ── WhatsApp Bubble ── */}
                  {activeChannel === "whatsapp" && (
                    <div className="rounded-2xl overflow-hidden" style={{ background: "#0b141a" }}>
                      <div className="flex items-center gap-2 px-3 py-2" style={{ background: "#1f2c34" }}>
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "#25D366", color: "#fff" }}>EA</div>
                        <div>
                          <p className="text-[11px] font-semibold" style={{ color: "#e9edef" }}>Empire AI Group</p>
                          <p className="text-[8px]" style={{ color: "#8696a0" }}>online</p>
                        </div>
                      </div>
                      <div className="p-3">
                        <div className="max-w-[85%] rounded-xl rounded-tl-sm px-3 py-2" style={{ background: "#005c4b" }}>
                          <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#e9edef" }}>
                            {generatedMessage.replace(/\*([^*]+)\*/g, '𝗯$1𝗯').replace(/𝗯/g, '')}
                          </p>
                          <p className="text-[8px] text-right mt-1" style={{ color: "#8696a0" }}>
                            {new Date().toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })} ✓✓
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ── Instagram DM ── */}
                  {activeChannel === "instagram" && (() => {
                    const igHandle = selected.instagram || enrichedData?.instagram;
                    return (
                    <div className="rounded-2xl overflow-hidden" style={{ background: "#000" }}>
                      <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}>
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-bold" style={{ background: "linear-gradient(135deg, #833AB4, #E4405F, #FCAF45)", color: "#fff" }}>E</div>
                          <div>
                            <p className="text-[11px] font-semibold" style={{ color: "#f5f5f5" }}>empire.ai.group</p>
                            <p className="text-[8px]" style={{ color: "#a8a8a8" }}>Attivo/a ora</p>
                          </div>
                        </div>
                        {igHandle && (
                          <div className="flex items-center gap-1 px-2 py-1 rounded-full" style={{ background: "rgba(228,64,95,0.15)", border: "1px solid rgba(228,64,95,0.25)" }}>
                            <Instagram className="w-2.5 h-2.5" style={{ color: "#E4405F" }} />
                            <span className="text-[8px] font-bold" style={{ color: "#E4405F" }}>@{igHandle.replace("@", "")}</span>
                            <CheckCircle className="w-2.5 h-2.5" style={{ color: "#34d399" }} />
                          </div>
                        )}
                      </div>
                      <div className="p-3 flex justify-end">
                        <div className="max-w-[80%] rounded-2xl rounded-br-sm px-3.5 py-2.5" style={{ background: "#3797f0" }}>
                          <p className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#fff" }}>
                            {generatedMessage}
                          </p>
                        </div>
                      </div>
                      <div className="px-3 pb-2">
                        <p className="text-[8px] text-right" style={{ color: "#666" }}>Visto</p>
                      </div>
                    </div>
                    );
                  })()}

                  {/* ── Email Professional ── */}
                  {activeChannel === "email" && (() => {
                    const lines = generatedMessage.split("\n");
                    const subjectLine = lines.find(l => l.toLowerCase().startsWith("oggetto:"));
                    const subject = subjectLine?.replace(/^oggetto:\s*/i, "").trim() || "Proposta Empire AI";
                    const bodyLines = lines.filter(l => !l.toLowerCase().startsWith("oggetto:")).join("\n").trim();
                    const demoUrl = getDemoSiteUrl(selected._sector);
                    const previewImg = previewScreens[0];

                    return (
                      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff" }}>EA</div>
                            <div>
                              <p className="text-[11px] font-semibold" style={{ color: "#111827" }}>Empire AI Group</p>
                              <p className="text-[8px]" style={{ color: "#6b7280" }}>info@empireaigroup.com</p>
                            </div>
                          </div>
                          <p className="text-xs font-bold" style={{ color: "#111827" }}>{subject}</p>
                          <p className="text-[9px]" style={{ color: "#9ca3af" }}>
                            A: {selected.email || selected.name.toLowerCase().replace(/\s+/g, "") + "@email.com"}
                          </p>
                        </div>
                        <div className="px-4 py-3">
                          <div className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#374151" }}>
                            {bodyLines}
                          </div>
                          {previewImg && (
                            <div className="mt-3 rounded-xl overflow-hidden" style={{ border: "1px solid #e5e7eb" }}>
                              <img src={previewImg} alt="Preview progetto" className="w-full h-32 object-cover object-top" />
                              <div className="p-2.5" style={{ background: "#f9fafb" }}>
                                <p className="text-[10px] font-bold" style={{ color: "#111827" }}>
                                  📱 Demo personalizzata — {selected.name}
                                </p>
                                <p className="text-[8px]" style={{ color: "#6b7280" }}>
                                  {window.location.origin}{demoUrl}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                        <div className="px-4 py-2.5" style={{ background: "#f9fafb", borderTop: "1px solid #e5e7eb" }}>
                          <div className="flex items-center gap-3">
                            <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)" }}>
                              <Zap className="w-3 h-3 text-white" />
                            </div>
                            <div>
                              <p className="text-[9px] font-bold" style={{ color: "#374151" }}>Empire AI Group</p>
                              <p className="text-[7px]" style={{ color: "#9ca3af" }}>Digital Transformation Partner</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {/* Action buttons */}
                  <div className="flex gap-2 flex-wrap mt-2">
                    <motion.button whileTap={{ scale: 0.97 }} onClick={copyMessage}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#7c3aed", color: "#fff" }}>
                      <Copy className="w-4 h-4" /> Copia Messaggio
                    </motion.button>
                    {activeChannel === "whatsapp" && selected.phone && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`https://wa.me/${selected.phone.replace(/\s+/g, "").replace("+", "")}?text=${encodeURIComponent(generatedMessage)}`}
                        target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#25D366", color: "#fff" }}>
                        <Send className="w-4 h-4" /> Invia su WA
                      </motion.a>
                    )}
                    {activeChannel === "instagram" && (() => {
                      const igHandle = selected.instagram || enrichedData?.instagram;
                      if (!igHandle) return null;
                      const cleanHandle = igHandle.replace("@", "");
                      return (
                        <motion.a whileTap={{ scale: 0.97 }}
                          href={`https://instagram.com/direct/t/${cleanHandle}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "linear-gradient(135deg, #833AB4, #E4405F)", color: "#fff" }}>
                          <Send className="w-4 h-4" /> Invia DM @{cleanHandle}
                        </motion.a>
                      );
                    })()}
                    {activeChannel === "email" && (
                      <motion.a whileTap={{ scale: 0.97 }}
                        href={`mailto:${selected.email || ""}?subject=${encodeURIComponent(generatedMessage.split("\n").find(l => l.toLowerCase().startsWith("oggetto:"))?.replace(/^oggetto:\s*/i, "") || "Proposta Empire AI")}&body=${encodeURIComponent(generatedMessage)}`}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold" style={{ background: "#3B82F6", color: "#fff" }}>
                        <Mail className="w-4 h-4" /> Invia Email
                      </motion.a>
                    )}
                    <motion.button whileTap={{ scale: 0.97 }} onClick={() => handleSelect(selected)}
                      className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-[10px] font-semibold"
                      style={{ background: "rgba(245,158,11,0.1)", border: "1px solid rgba(245,158,11,0.15)", color: "#fbbf24" }}>
                      <RefreshCw className="w-3 h-3" /> Rigenera
                    </motion.button>
                  </div>
                </>
              ) : generatingMsg ? (
                <div className="flex items-center justify-center gap-3 py-6">
                  <Loader2 className="w-5 h-5 animate-spin" style={{ color: "#34d399" }} />
                  <span className="text-xs" style={{ color: "#9ca3af" }}>Generazione messaggio per {selected.name}...</span>
                </div>
              ) : null}
            </div>
          </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Loading state — Ultra Agent Network */}
      <AnimatePresence>
        {loading && results.length === 0 && (() => {
          const SCAN_AGENTS = [
            { emoji: "🗺️", name: "Maps Scout", color: "#4285F4", delay: 0.2, task: "Scansione POI geolocalizzati", dataLabel: "Google Maps API v3" },
            { emoji: "🌐", name: "OSM Crawler", color: "#7EBC6F", delay: 0.5, task: "Estrazione nodi OpenStreetMap", dataLabel: "Overpass QL" },
            { emoji: "📊", name: "Data Enricher", color: "#F59E0B", delay: 0.8, task: "Arricchimento contatti & score", dataLabel: "Photon Geocoder" },
            { emoji: "📸", name: "Social Intel", color: "#E4405F", delay: 1.1, task: "Analisi profili social & engagement", dataLabel: "Instagram Graph" },
            { emoji: "🔗", name: "Web Scraper", color: "#8B5CF6", delay: 1.4, task: "Verifica siti web & tecnologie", dataLabel: "DOM Parser" },
          ];
          const DATA_STREAMS = [
            "Geocoding coordinate GPS...", "Matching POI nel raggio...", "Parsing risposta API...",
            "Calcolo opportunity score...", "Verifica numeri telefono...", "Estrazione email da siti...",
            "Analisi rating Google...", "Cross-referencing social...", "Dedup & merge risultati...",
            "Classificazione settoriale AI...", "Normalizzazione indirizzi...", "Enrichment contatti...",
          ];
          return (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95, filter: "blur(12px)" }} transition={{ duration: 0.6 }}
            className="relative py-8 overflow-hidden rounded-2xl" style={{ background: "linear-gradient(180deg, rgba(10,10,26,0.95), rgba(15,23,42,0.9))", border: "1px solid rgba(20,184,166,0.12)" }}>
            
            {/* Animated grid overlay */}
            <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: "linear-gradient(rgba(20,184,166,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(20,184,166,0.3) 1px, transparent 1px)", backgroundSize: "24px 24px" }} />

            {/* Neural SVG connections */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 400" fill="none">
              {[
                { x1: 200, y1: 45, x2: 70, y2: 140 }, { x1: 200, y1: 45, x2: 330, y2: 140 },
                { x1: 200, y1: 45, x2: 200, y2: 160 },
                { x1: 70, y1: 140, x2: 140, y2: 240 }, { x1: 330, y1: 140, x2: 260, y2: 240 },
                { x1: 200, y1: 160, x2: 140, y2: 240 }, { x1: 200, y1: 160, x2: 260, y2: 240 },
                { x1: 70, y1: 140, x2: 200, y2: 160 }, { x1: 330, y1: 140, x2: 200, y2: 160 },
                { x1: 140, y1: 240, x2: 260, y2: 240 },
                { x1: 70, y1: 140, x2: 330, y2: 140 },
              ].map((l, i) => (
                <g key={i}>
                  <motion.line x1={l.x1} y1={l.y1} x2={l.x2} y2={l.y2} stroke="url(#nGrad)" strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: [0, 1], opacity: [0, 0.5, 0.2, 0.6] }}
                    transition={{ duration: 2, delay: i * 0.12, repeat: Infinity, repeatType: "reverse" }} />
                  {/* Data particle traveling along line */}
                  <motion.circle r="2" fill="#14b8a6" filter="url(#glow)"
                    animate={{ cx: [l.x1, l.x2], cy: [l.y1, l.y2], opacity: [0, 1, 0] }}
                    transition={{ duration: 1.8, delay: i * 0.2 + 0.5, repeat: Infinity, ease: "easeInOut" }} />
                </g>
              ))}
              <defs>
                <linearGradient id="nGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#14b8a6" stopOpacity="0.7" />
                  <stop offset="50%" stopColor="#a78bfa" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.7" />
                </linearGradient>
                <filter id="glow"><feGaussianBlur stdDeviation="2" result="blur" /><feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge></filter>
              </defs>
            </svg>

            <div className="relative z-10 px-4">
              {/* Header */}
              <motion.div className="text-center mb-5" initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-2" style={{ background: "rgba(20,184,166,0.08)", border: "1px solid rgba(20,184,166,0.2)" }}>
                  <motion.div className="w-2 h-2 rounded-full" style={{ background: "#14b8a6" }}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }} transition={{ duration: 1, repeat: Infinity }} />
                  <span className="text-[9px] font-bold uppercase tracking-[0.15em]" style={{ color: "#14b8a6" }}>Multi-Agent System Active</span>
                </div>
                <p className="text-sm font-black text-white">Scansione Neurale in Corso</p>
                <p className="text-[10px] mt-0.5" style={{ color: "#6b7280" }}>
                  5 agenti AI lavorano in parallelo su {city || "target"} · {SECTOR_OPTIONS.find(s => s.value === sector)?.label || "tutti i settori"}
                </p>
              </motion.div>

              {/* Central Orchestrator */}
              <motion.div className="flex justify-center mb-4" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.1 }}>
                <div className="flex flex-col items-center">
                  <motion.div className="w-16 h-16 rounded-2xl flex items-center justify-center relative"
                    style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.15), rgba(167,139,250,0.1))", border: "1.5px solid rgba(20,184,166,0.35)" }}
                    animate={{ boxShadow: ["0 0 15px rgba(20,184,166,0.1)", "0 0 45px rgba(20,184,166,0.3)", "0 0 15px rgba(20,184,166,0.1)"] }}
                    transition={{ duration: 2.5, repeat: Infinity }}>
                    <span className="text-2xl">🧠</span>
                    <motion.div className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center" style={{ background: "#14b8a6" }}
                      animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                      <Zap className="w-2 h-2 text-white" />
                    </motion.div>
                  </motion.div>
                  <p className="text-[9px] font-bold mt-1" style={{ color: "#14b8a6" }}>Orchestratore Centrale</p>
                  <motion.p className="text-[7px] font-mono" style={{ color: "#4b5563" }}
                    animate={{ opacity: [0.3, 0.8, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}>
                    Distributing tasks...
                  </motion.p>
                </div>
              </motion.div>

              {/* Agent cards grid */}
              <div className="grid grid-cols-5 gap-1.5 mb-4">
                {SCAN_AGENTS.map((agent) => (
                  <motion.div key={agent.name}
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: "spring", delay: agent.delay }}
                    className="flex flex-col items-center p-2 rounded-xl relative"
                    style={{ background: `${agent.color}08`, border: `1px solid ${agent.color}20` }}>
                    <motion.div className="w-9 h-9 rounded-lg flex items-center justify-center mb-1"
                      style={{ background: `${agent.color}12`, border: `1px solid ${agent.color}30` }}
                      animate={{ y: [0, -3, 0], boxShadow: [`0 0 0px ${agent.color}00`, `0 0 20px ${agent.color}25`, `0 0 0px ${agent.color}00`] }}
                      transition={{ duration: 2.5, delay: agent.delay * 0.5, repeat: Infinity }}>
                      <span className="text-sm">{agent.emoji}</span>
                    </motion.div>
                    <p className="text-[7px] font-bold text-center leading-tight" style={{ color: agent.color }}>{agent.name}</p>
                    <motion.p className="text-[6px] text-center mt-0.5 font-mono leading-tight" style={{ color: "#4b5563" }}
                      animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 2, delay: agent.delay, repeat: Infinity }}>
                      {agent.dataLabel}
                    </motion.p>
                    {/* Status indicator */}
                    <motion.div className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full" style={{ background: agent.color }}
                      animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                      transition={{ duration: 1, delay: agent.delay * 0.3, repeat: Infinity }} />
                  </motion.div>
                ))}
              </div>

              {/* Live data stream terminal */}
              <motion.div className="rounded-xl p-3 mb-3" style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(20,184,166,0.1)" }}
                initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5 }}>
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ef4444" }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#f59e0b" }} />
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#22c55e" }} />
                  </div>
                  <span className="text-[7px] font-mono font-bold" style={{ color: "#14b8a6" }}>LIVE DATA STREAM</span>
                  <motion.span className="text-[7px] font-mono ml-auto" style={{ color: "#4b5563" }}
                    animate={{ opacity: [0.3, 1, 0.3] }} transition={{ duration: 0.8, repeat: Infinity }}>
                    ●  ACTIVE
                  </motion.span>
                </div>
                <div className="space-y-0.5 h-14 overflow-hidden relative">
                  <div className="absolute bottom-0 left-0 right-0 h-6 z-10" style={{ background: "linear-gradient(transparent, rgba(0,0,0,0.8))" }} />
                  {DATA_STREAMS.map((line, i) => (
                    <motion.div key={i} className="flex items-center gap-1.5"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: [0, 1, 0.7], x: 0 }}
                      transition={{ delay: 1.8 + i * 0.6, duration: 0.4 }}>
                      <motion.span className="text-[6px]" style={{ color: "#14b8a6" }}
                        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 0.5, repeat: Infinity }}>▸</motion.span>
                      <span className="text-[7px] font-mono" style={{ color: "#6ee7b7" }}>{line}</span>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Bottom metrics bar */}
              <motion.div className="flex items-center justify-between px-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
                <div className="flex items-center gap-3">
                  {[
                    { label: "Agenti", value: "5/5", color: "#14b8a6" },
                    { label: "API Calls", value: "12+", color: "#a78bfa" },
                    { label: "DB Scanned", value: "4", color: "#3b82f6" },
                  ].map((m, i) => (
                    <div key={i} className="text-center">
                      <motion.p className="text-[10px] font-black font-mono" style={{ color: m.color }}
                        animate={{ opacity: [0.7, 1, 0.7] }} transition={{ duration: 1.5, delay: i * 0.3, repeat: Infinity }}>
                        {m.value}
                      </motion.p>
                      <p className="text-[6px] font-bold uppercase tracking-wider" style={{ color: "#4b5563" }}>{m.label}</p>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-1">
                  {[0, 0.12, 0.24, 0.36, 0.48].map((d, i) => (
                    <motion.div key={i} className="w-1 h-3 rounded-full"
                      style={{ background: "#14b8a6" }}
                      animate={{ scaleY: [0.3, 1, 0.3], opacity: [0.3, 1, 0.3] }}
                      transition={{ repeat: Infinity, duration: 0.6, delay: d }} />
                  ))}
                </div>
              </motion.div>
            </div>
          </motion.div>
          );
        })()}
      </AnimatePresence>

      {/* Empty state */}
      {results.length === 0 && !loading && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="text-center py-10">
          
          {/* Animated scanning icon */}
          <div className="relative w-16 h-16 mx-auto mb-4">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 6, ease: "linear" }}
              className="absolute inset-0 rounded-full" style={{ border: "2px dashed rgba(20,184,166,0.2)" }} />
            <div className="absolute inset-1 rounded-full flex items-center justify-center" style={{ background: "rgba(20,184,166,0.06)" }}>
              <Target className="w-7 h-7" style={{ color: "#14b8a6" }} />
            </div>
            <motion.div className="absolute -right-1 -top-1 w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "#14b8a6" }}
              animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}>
              <Zap className="w-2.5 h-2.5 text-white" />
            </motion.div>
          </div>

          <p className="text-base font-bold text-white mb-1">Ricerca Lead Automatica</p>
          <p className="text-[11px] max-w-xs mx-auto mb-5" style={{ color: "#6b7280" }}>
            Inserisci la città e premi <span className="font-semibold text-white">Invio</span> — lo scanner multi-fonte analizza automaticamente 5 database in parallelo.
          </p>

          {/* Source engines */}
          <div className="flex flex-wrap justify-center gap-1.5 mb-5">
            {[
              { icon: "🗺️", label: "Google Maps", color: "#4285F4" },
              { icon: "🌍", label: "OpenStreetMap", color: "#7EBC6F" },
              { icon: "📍", label: "Photon", color: "#F59E0B" },
              { icon: "🔎", label: "Overpass", color: "#06B6D4" },
              { icon: "📸", label: "Instagram AI", color: "#E4405F" },
            ].map(src => (
              <span key={src.label} className="text-[9px] px-2.5 py-1.5 rounded-lg font-bold flex items-center gap-1"
                style={{ background: `${src.color}10`, border: `1px solid ${src.color}20`, color: src.color }}>
                {src.icon} {src.label}
              </span>
            ))}
          </div>

          {/* Quick start — one-tap search */}
          <p className="text-[9px] font-bold uppercase tracking-widest mb-2.5" style={{ color: "#4b5563" }}>⚡ Ricerca rapida — un tap per iniziare</p>
          <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
            {[
              { city: "Roma", sector: "food", label: "Ristoranti a Roma", emoji: "🍕", color: "#ef4444" },
              { city: "Milano", sector: "beauty", label: "Beauty a Milano", emoji: "💇", color: "#ec4899" },
              { city: "London", sector: "fitness", label: "Gym a Londra", emoji: "🏋️", color: "#3b82f6" },
              { city: "Dubai", sector: "hospitality", label: "Hotel a Dubai", emoji: "🏨", color: "#f59e0b" },
              { city: "Napoli", sector: "food", label: "Pizzerie a Napoli", emoji: "🍕", color: "#22c55e" },
              { city: "Miami", sector: "beauty", label: "Beauty a Miami", emoji: "💅", color: "#a855f7" },
            ].map((s, i) => (
              <motion.button key={i} whileTap={{ scale: 0.95 }} whileHover={{ scale: 1.02 }}
                onClick={() => { pendingQuickSearch.current = { city: s.city, sector: s.sector }; setCity(s.city); setSector(s.sector); }}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all"
                style={{ background: `${s.color}08`, border: `1px solid ${s.color}18` }}>
                <span className="text-base">{s.emoji}</span>
                <div>
                  <p className="text-[10px] font-bold text-white">{s.label}</p>
                  <p className="text-[8px]" style={{ color: "#6b7280" }}>Tap per avviare</p>
                </div>
              </motion.button>
            ))}
          </div>
        </motion.div>
      )}
    </div>{/* close z-10 */}
    </div>
  );
}
