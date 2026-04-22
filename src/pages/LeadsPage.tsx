import { useState, useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Target, MapPin, Filter, ChevronDown, Loader2, Phone, Globe, Mail,
  Instagram, Star, ExternalLink, MessageCircle, Copy, Sparkles, Send, RefreshCw,
  Wand2, Building2, Eye, Map, Zap, ArrowUpDown, X as XIcon, UserPlus, Link2,
  CheckCircle, TrendingUp, AlertTriangle, Crown, Plus, Layers, Facebook, Download
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import empireMonkeyLaptop from "@/assets/empire-monkey-laptop.png";
import { SECTOR_OPTIONS } from "@/data/mock-leads-data";
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { SECTOR_PORTFOLIO, SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { DEMO_SLUGS } from "@/data/demo-industries";
import { getPreviewDetailsForMatch, matchPreviewForLead, matchPreviewFromManualSelection, matchPreviewFromRecommendedProject, type PreviewMatch } from "@/lib/preview-matcher";
import DeepLeadIntel, { DeepReport, DeepAudit } from "@/components/leads/DeepLeadIntel";
import SalesPlaybook from "@/components/leads/SalesPlaybook";
import ManualPreviewPicker, { ManualPreviewSelection } from "@/components/leads/ManualPreviewPicker";
import DemoFactoryOverlay, { DemoFactoryResult } from "@/components/leads/DemoFactoryOverlay";
import SellerCRM from "@/components/leads/SellerCRM";
import LeadIntelligenceLauncher from "@/components/leads/LeadIntelligenceLauncher";
import GpsRadarPanel, { GpsLocation } from "@/components/leads/GpsRadarPanel";
import SpeedDialList from "@/components/leads/SpeedDialList";
import SellerCreditsBadge from "@/components/leads/SellerCreditsBadge";
import CreditConfirmDialog from "@/components/leads/CreditConfirmDialog";
import SmartCityAutocomplete from "@/components/leads/SmartCityAutocomplete";
import SmartSectorAutocomplete from "@/components/leads/SmartSectorAutocomplete";
import DemoVaultPanel from "@/components/leads/DemoVaultPanel";
import QuickSearchSuggestions from "@/components/leads/QuickSearchSuggestions";
import AriannaLeadScoutPanel, { AriannaPilot } from "@/components/leads/AriannaLeadScoutPanel";
import AriannaInsightsDashboard from "@/components/leads/AriannaInsightsDashboard";
import LeadIntelligenceInbox from "@/components/leads/LeadIntelligenceInbox";
import SellerOnboardingWizard from "@/components/leads/SellerOnboardingWizard";
import PartnerFlowStepper from "@/components/partner/PartnerFlowStepper";
import { useDemoVault } from "@/hooks/useDemoVault";
import { useSellerPipeline, getOverdueFollowups } from "@/hooks/useSellerPipeline";
import { useSellerCredits } from "@/hooks/useSellerCredits";
import DeliverabilityPanel from "@/components/leads/DeliverabilityPanel";
import { TEMPLATES, pickRecommendedAuroraTemplate, renderTemplate } from "@/lib/email-templates/aurora-templates";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { ShieldCheck } from "lucide-react";
import { Briefcase, Bookmark, Wand2 as WandIcon, Radar, ListChecks, Crosshair } from "lucide-react";

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
  chosen_specialization_label?: string | null;
  chosen_specialization_query?: string | null;
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

/**
 * DETERMINISTIC opportunity score (0-100). No randomness.
 * Higher = bigger digital gap = bigger opportunity to sell Empire.
 */
const computeScore = (lead: Lead): number => {
  let score = 50;
  // Digital presence gaps (the bigger the gap, the bigger the sale)
  if (!lead.website) score += 25;
  if (!lead.instagram) score += 10;
  if (!lead.facebook) score += 4;
  if (!lead.email) score += 3;
  // Reputation signals
  if (lead.google_rating > 0 && lead.google_rating < 3.5) score += 15; // unhappy customers = motivated
  else if (lead.google_rating >= 4.7 && lead.google_reviews >= 50) score -= 12; // already nailing it
  else if (lead.google_rating >= 4.5) score -= 6;
  // Volume of reviews = active business worth contacting
  if (lead.google_reviews >= 100) score += 4;
  else if (lead.google_reviews >= 30) score += 2;
  // Reachability
  if (!lead.phone) score += 5; // hard to reach = also hard for customers
  // Operations maturity
  if (lead.opening_hours) score -= 3; // well-organized = slightly harder pitch
  return Math.max(15, Math.min(98, score));
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

/* ─── CSV Export (Excel-compatible, UTF-8 BOM, semicolon for IT locale) ─── */
function exportLeadsToCsv(
  leads: (Lead & { _score: number; _sector: string })[],
  city: string,
  sector: string
) {
  if (!leads.length) {
    toast.error("Nessun lead da esportare");
    return;
  }
  const headers = [
    "Nome", "Settore", "Città", "Zona", "Indirizzo",
    "Telefono", "Email", "Sito", "Instagram", "Facebook",
    "Rating Google", "Recensioni Google", "Score AI",
    "Google Maps", "Note"
  ];
  const esc = (val: any): string => {
    if (val === null || val === undefined) return "";
    const s = String(val).replace(/\r?\n/g, " ").replace(/"/g, '""');
    return `"${s}"`;
  };
  const rows = leads.map(l => [
    l.name,
    l._sector || sector || "",
    l.city || "",
    l.zone || "",
    l.full_address || "",
    l.phone || "",
    l.email || "",
    l.website || "",
    l.instagram || "",
    l.facebook || "",
    typeof l.google_rating === "number" ? l.google_rating.toFixed(1).replace(".", ",") : "",
    l.google_reviews ?? "",
    typeof l._score === "number" ? Math.round(l._score) : "",
    l.google_maps_url || "",
    "" // Note vuote (le note vivono sul pipeline salvato)
  ]);
  const csv = [headers, ...rows].map(r => r.map(esc).join(";")).join("\r\n");
  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const ts = new Date().toISOString().slice(0, 10);
  const safeCity = (city || "leads").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "leads";
  const safeSector = (sector || "all").toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const a = document.createElement("a");
  a.href = url;
  a.download = `leads-${safeSector}-${safeCity}-${ts}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast.success(`📥 Esportati ${leads.length} lead in CSV`);
}


export default function LeadsPage() {
  // 💰 Sistema crediti venditore — gating su azioni AI costose
  const { balance: creditBalance, getCost, consume: consumeSellerCredits, totalSpent30d } = useSellerCredits();
  const [pendingDemoFactory, setPendingDemoFactory] = useState<{ lead: Lead & { _sector: string }; preview: ManualPreviewSelection | null } | null>(null);

  // Search
  const [city, setCity] = useState("");
  const [sector, setSector] = useState("food");
  const [query, setQuery] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState<{ label: string; query: string } | null>(null);
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
  const [sortBy, setSortBy] = useState<"score" | "rating" | "name" | "reviews">("score");
  // 🔎 Ricerca testuale interna ai risultati (filtra senza nuove chiamate API)
  const [resultsQuery, setResultsQuery] = useState("");
  // 🎯 Quick filters "più convertibili" (operano sui risultati locali, no API)
  const [qfHot, setQfHot] = useState(false);              // score ≥ 70
  const [qfHasPhone, setQfHasPhone] = useState(false);    // ha telefono → contattabile subito
  const [qfOpenNow, setQfOpenNow] = useState(false);      // aperto adesso (parsing opening_hours)
  const [qfNoWebsite, setQfNoWebsite] = useState(false);  // no sito → bisogno digitale immediato
  const [qfPriorityCat, setQfPriorityCat] = useState(false); // categorie top-conversion
  // 👁 Anteprima rapida inline (id riga espansa)
  const [quickPreviewKey, setQuickPreviewKey] = useState<string | null>(null);
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

  // Deep analysis
  const [analysisLoading, setAnalysisLoading] = useState(false);
  const [deepReport, setDeepReport] = useState<DeepReport | null>(null);
  const [deepAudit, setDeepAudit] = useState<DeepAudit | null>(null);

  // Manual preview picker (galleria mockup)
  const [showPicker, setShowPicker] = useState(false);
  const [customPreview, setCustomPreview] = useState<ManualPreviewSelection | null>(null);

  // Demo Factory — auto-generate complete tenant + admin from selected preview
  const [demoFactoryOpen, setDemoFactoryOpen] = useState(false);
  const [demoFactoryLoading, setDemoFactoryLoading] = useState(false);
  const [demoFactoryProgress, setDemoFactoryProgress] = useState("Inizializzo…");
  const [demoFactoryResult, setDemoFactoryResult] = useState<DemoFactoryResult | null>(null);

  // Manual lead input
  const [showManual, setShowManual] = useState(false);
  const [manualName, setManualName] = useState("");
  const [manualCity, setManualCity] = useState("");
  const [manualWebsite, setManualWebsite] = useState("");
  const [manualIg, setManualIg] = useState("");
  const [manualPhone, setManualPhone] = useState("");
  const [manualSector, setManualSector] = useState("food");
  const [manualSectorTouched, setManualSectorTouched] = useState(false);
  const [manualEmail, setManualEmail] = useState("");
  const [manualEnriching, setManualEnriching] = useState(false);
  const [manualEnrichedHint, setManualEnrichedHint] = useState<string | null>(null);

  // ═══ CRM Venditore (persistent pipeline) ═══
  const [crmOpen, setCrmOpen] = useState(false);
  const pipeline = useSellerPipeline();
  // 💾 Cassaforte Demo (riuso senza crediti)
  const demoVault = useDemoVault();
  const [vaultOpen, setVaultOpen] = useState(false);
  const overdueFollowups = getOverdueFollowups(pipeline.leads);
  const savedLeadKeys = new Set(pipeline.leads.map(l => `${l.name.toLowerCase()}|${(l.city || "").toLowerCase()}`));
  const isLeadSaved = (lead: Lead) => savedLeadKeys.has(`${lead.name.toLowerCase()}|${(lead.city || "").toLowerCase()}`);

  // ═══ GPS Radar + Speed Dial ═══
  const [gpsOpen, setGpsOpen] = useState(false);
  const [speedDialOpen, setSpeedDialOpen] = useState(false);
  // Origine GPS attiva (per calcolo distanza per ogni lead)
  const [gpsOrigin, setGpsOrigin] = useState<{ lat: number; lon: number; label: string } | null>(null);

  /* ─── Auto-detect sector from manual name ─── */
  useEffect(() => {
    if (manualSectorTouched || !manualName.trim()) return;
    const fakeLead: Lead = {
      name: manualName, full_address: "", city: manualCity, zone: "",
      phone: null, website: null, email: null, instagram: null,
      google_rating: 0, google_reviews: 0, google_maps_url: null, source: "manual",
    };
    const detected = detectSector(fakeLead, manualSector);
    if (detected && detected !== manualSector) setManualSector(detected);
  }, [manualName, manualCity, manualSectorTouched]);

  /* ─── Live score preview for manual lead ─── */
  const manualLiveScore = (() => {
    if (!manualName.trim()) return 0;
    return computeScore({
      name: manualName, full_address: "", city: manualCity, zone: "",
      phone: manualPhone || null, website: manualWebsite || null, email: manualEmail || null,
      instagram: manualIg || null, google_rating: 0, google_reviews: 0,
      google_maps_url: null, source: "manual",
    });
  })();

  /* ─── Auto-enrichment: lookup real data via OpenStreetMap when name+city present ─── */
  const enrichManualLead = useCallback(async () => {
    if (!manualName.trim() || !manualCity.trim()) {
      toast.error("Inserisci nome e città per l'arricchimento dati");
      return;
    }
    setManualEnriching(true);
    setManualEnrichedHint(null);
    try {
      // Use Photon (OSM-based) - no API key needed, GDPR friendly
      const q = encodeURIComponent(`${manualName} ${manualCity}`);
      const res = await fetch(`https://photon.komoot.io/api/?q=${q}&limit=3&lang=it`);
      const data = await res.json();
      const hit = data?.features?.[0];
      if (hit?.properties) {
        const p = hit.properties;
        const addr = [p.street, p.housenumber, p.city || p.town || manualCity].filter(Boolean).join(" ");
        if (addr && !manualWebsite) {
          // Try Google search shortcut for website
          const searchQ = encodeURIComponent(`${manualName} ${manualCity} sito ufficiale`);
          setManualEnrichedHint(`📍 ${addr} · 🔍 Verifica su google.com/search?q=${searchQ}`);
        } else {
          setManualEnrichedHint(`📍 Indirizzo trovato: ${addr}`);
        }
        toast.success("✓ Dati arricchiti da OpenStreetMap", { description: addr });
      } else {
        setManualEnrichedHint("⚠️ Nessun match su mappe pubbliche — procedi manualmente");
        toast.info("Nessun match automatico, inserisci i dati manualmente");
      }
    } catch (err) {
      console.error("Enrichment error:", err);
      toast.error("Errore arricchimento dati");
    } finally {
      setManualEnriching(false);
    }
  }, [manualName, manualCity, manualWebsite]);

  /* ─── 🪄 DEMO FACTORY — generate complete tenant + admin from a lead + preview ─── */
  const runDemoFactory = useCallback(async (lead: Lead & { _sector: string }, preview?: ManualPreviewSelection | null) => {
    if (!lead?.name) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      toast.error("Devi essere loggato per generare una demo");
      return;
    }

    // ─── 💰 GATING CREDITI: consuma 5 crediti server-side ───
    const consumeRes = await consumeSellerCredits("generate_demo_from_lead", {
      lead_name: lead.name, sector: lead._sector, city: lead.city,
    });
    if (!consumeRes.success) {
      if (consumeRes.error === "insufficient_credits") {
        toast.error(`Crediti insufficienti. Servono ${consumeRes.required}, hai ${consumeRes.balance}.`, {
          description: "Ricarica dal tuo profilo per continuare.",
          action: { label: "Ricarica", onClick: () => window.location.assign("/partner/profile?tab=credits") },
          duration: 7000,
        });
      } else {
        toast.error("Impossibile avviare la Demo Factory", { description: consumeRes.error });
      }
      return;
    }

    setDemoFactoryOpen(true);
    setDemoFactoryLoading(true);
    setDemoFactoryResult(null);
    setDemoFactoryProgress("Avvio scraping del sito web…");

    try {
      // progress hints
      const hints = [
        "Estraggo brand identity reale dal sito…",
        "Genero menu/listino e palette con AI…",
        "Creo tenant, account admin e moduli…",
        "Seed clienti, ordini e recensioni…",
      ];
      let i = 0;
      const interval = setInterval(() => {
        if (i < hints.length) { setDemoFactoryProgress(hints[i]); i++; }
      }, 4000);

      // ⭐ GROUND TRUTH: pipeline a 3 livelli per scegliere la preview canonica
      //   1) Manual override dal ManualPreviewPicker (massima priorità).
      //   2) Recommended preview dell'AI deep analysis (1:1 con un progetto Empire reale).
      //   3) Matcher heuristico (sub-sector dal nome/filtri).
      // Il templateVariant + subSector finali vengono passati come AUTORITÀ al backend
      // così il sito demo + admin sono identici alla preview iPhone mostrata al venditore.
      const sectorLabel = SECTOR_OPTIONS.find(s => s.value === lead._sector)?.label || lead._sector;
      const heuristic = matchPreviewForLead({
        name: lead.name,
        sector: lead._sector,
        sectorLabel,
        cuisine: (lead as any).cuisine || null,
        extra: [lead.chosen_specialization_label, lead.chosen_specialization_query, lead.full_address, lead.city, lead.zone, lead.website, lead.instagram, (lead as any).osm_type].filter(Boolean).join(" · "),
        website: lead.website,
        openingHours: lead.opening_hours,
        types: lead.types || [],
      });
      const aiRecommended = deepReport?.recommended_preview
        ? matchPreviewFromRecommendedProject({
            projectName: deepReport.recommended_preview.project_name,
            reason: deepReport.recommended_preview.why,
            sector: lead._sector,
            sectorLabel,
          })
        : null;
      // Manual override > AI recommendation > heuristic
      const manualCanonical = preview?.isManualOverride
        ? matchPreviewFromManualSelection({
            sectorId: preview.sectorId,
            brandName: preview.brandName,
            styleName: preview.styleName,
            imageUrl: preview.imageUrl,
          })
        : null;
      const canonical: PreviewMatch = manualCanonical || aiRecommended || heuristic;

      const { data, error } = await supabase.functions.invoke("generate-demo-from-lead", {
        body: {
          lead: {
            businessName: lead.name,
            sector: lead._sector,
            sectorLabel,
            city: lead.city,
            zone: lead.zone,
            fullAddress: lead.full_address,
            phone: lead.phone,
            email: lead.email,
            website: lead.website,
            instagram: lead.instagram,
            facebook: lead.facebook,
            googleRating: lead.google_rating,
            googleReviews: lead.google_reviews,
            googleMapsUrl: lead.google_maps_url,
            openingHours: lead.opening_hours,
            cuisine: lead.cuisine,
            types: lead.types,
            specializationLabel: lead.chosen_specialization_label,
            specializationQuery: lead.chosen_specialization_query,
          },
          preview: {
            brandName: preview?.brandName || canonical.brandName,
            styleName: preview?.styleName || canonical.styleName,
            imageUrl: preview?.imageUrl || canonical.screens?.[0] || null,
            sectorId: preview?.sectorId || canonical.sectorId,
            templateVariant: canonical.templateVariant,
            subSector: canonical.subSector,
            demoSlug: canonical.demoSlug,
            screens: canonical.screens,
          },
          partnerId: user.id,
          originUrl: window.location.origin,
        },
      });

      clearInterval(interval);

      // 422 = lead data insufficient → rimborso crediti
      const errBody: any = (error as any)?.context?.body || data;
      if (errBody?.error === "lead_data_insufficient") {
        toast.error("⚠️ Lead con dati insufficienti", {
          description: (errBody.issues || []).join(" · ") || "Arricchisci il lead prima di generare la demo",
        });
        // Non addebitiamo: log refund in cronologia
        try {
          await supabase.from("demo_credit_usage").insert({
            user_id: user.id,
            action: "refund_demo_factory",
            credits_used: -(consumeRes?.credits_used || 5),
            cost_eur_estimate: 0,
            action_label: "Rimborso: lead insufficiente",
            metadata: { reason: "lead_data_insufficient", issues: errBody.issues },
          });
        } catch {}
        setDemoFactoryOpen(false);
        return;
      }

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || "Generazione fallita");
      }

      setDemoFactoryResult(data);

      // 💾 Auto-save in vault per riutilizzo futuro (zero crediti next time)
      try {
        await demoVault.saveDemo({
          leadName: lead.name,
          sector: lead._sector,
          sectorLabel,
          subSector: data?.autoMatch?.subSector,
          templateVariant: data?.autoMatch?.templateVariant || canonical.templateVariant,
          themeHint: data?.autoMatch?.themeHint,
          tenantId: data?.tenant?.id || null,
          tenantKind: ["food","bakery","gelateria","wine_bar","catering"].includes(lead._sector) ? "restaurant" : "company",
          tenantSlug: data?.tenant?.slug || null,
          previewUrl: data.previewUrl,
          adminUrl: data.adminUrl,
          magicLink: data.magicLink,
          adminEmail: data.credentials?.email,
          adminPassword: data.credentials?.password,
          leadSnapshot: {
            name: lead.name, phone: lead.phone, email: lead.email,
            website: lead.website, instagram: lead.instagram, city: lead.city,
            full_address: lead.full_address,
          },
          brandPayload: data.brand || {},
          imagesPayload: data.images || {},
          outreachPayload: data.outreach || {},
          fullResult: data,
        });
      } catch (e) {
        console.warn("[vault] auto-save failed", e);
      }

      const guardWarn = data?.brand?.guardian_warnings?.length;
      toast.success(`✓ Demo creata · -${consumeRes.credits_used} crediti · 💾 Salvata in Cassaforte`, {
        description: guardWarn ? `${data.previewUrl} · ${guardWarn} note di qualità` : `Saldo: ${consumeRes.remaining_balance} · riutilizzabile gratis`,
      });
    } catch (err: any) {
      console.error("[runDemoFactory] error", err);
      toast.error("Errore creazione demo", { description: err?.message || "Riprova" });
      setDemoFactoryOpen(false);
    } finally {
      setDemoFactoryLoading(false);
    }
  }, [consumeSellerCredits, deepReport]);

  /* Wrapper: apre dialog di conferma crediti prima di lanciare la Demo Factory */
  const requestDemoFactory = useCallback((lead: Lead & { _sector: string }, preview?: ManualPreviewSelection | null) => {
    setPendingDemoFactory({ lead, preview: preview || null });
  }, []);

  /* ─── Validate & launch manual analysis ─── */
  const launchManualAnalysis = useCallback(() => {
    const errors: string[] = [];
    if (!manualName.trim() || manualName.trim().length < 2) errors.push("Nome attività (min 2 caratteri)");
    if (manualWebsite.trim() && !/^https?:\/\/|^www\./i.test(manualWebsite.trim()) && !manualWebsite.includes(".")) {
      errors.push("Sito web non valido (es. www.esempio.it)");
    }
    if (manualEmail.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(manualEmail.trim())) {
      errors.push("Email non valida");
    }
    if (errors.length) {
      toast.error("Correggi i seguenti campi", { description: errors.join(" · ") });
      return;
    }
    let websiteNorm = manualWebsite.trim();
    if (websiteNorm && !/^https?:\/\//i.test(websiteNorm)) websiteNorm = `https://${websiteNorm.replace(/^\/+/, "")}`;
    let igNorm = manualIg.trim().replace(/^@/, "");
    if (igNorm && !igNorm.startsWith("http")) igNorm = `https://instagram.com/${igNorm}`;

    const lead: Lead & { _score: number; _sector: string } = {
      name: manualName.trim(),
      full_address: manualCity.trim() || "",
      city: manualCity.trim() || "N/A",
      zone: "",
      phone: manualPhone.trim() || null,
      website: websiteNorm || null,
      email: manualEmail.trim() || null,
      instagram: igNorm || null,
      facebook: null,
      google_rating: 0,
      google_reviews: 0,
      google_maps_url: manualCity.trim() ? `https://www.google.com/maps/search/${encodeURIComponent(`${manualName} ${manualCity}`)}` : null,
      source: "manual",
      isManual: true,
      _score: manualLiveScore,
      _sector: manualSector,
    };
    setResults(prev => [lead, ...prev.filter(r => r.name !== lead.name)]);
    handleSelect(lead);
    toast.success(`🎯 Analisi profonda avviata per ${lead.name}`, {
      description: `Score ${manualLiveScore}/100 · Settore ${INDUSTRY_CONFIGS[manualSector as keyof typeof INDUSTRY_CONFIGS]?.label || manualSector}`,
    });
  }, [manualName, manualCity, manualPhone, manualWebsite, manualEmail, manualIg, manualSector, manualLiveScore]);

  /* ─── Save selected lead into persistent CRM pipeline ─── */
  const handleSaveToCRM = useCallback(async () => {
    if (!selected) {
      toast.error("Seleziona un lead per salvarlo");
      return;
    }
    await pipeline.saveLead({
      name: selected.name,
      city: selected.city,
      sector: selected._sector,
      phone: selected.phone,
      email: selected.email,
      website: selected.website,
      instagram: selected.instagram || enrichedData?.instagram || null,
      full_address: selected.full_address,
      google_rating: selected.google_rating || null,
      google_reviews: selected.google_reviews || null,
      ai_score: selected._score ?? null,
      ai_summary: deepReport?.executive_summary || null,
      source: selected.source || "leadengine",
      lead_source_data: {
        google_maps_url: selected.google_maps_url,
        facebook: selected.facebook,
        zone: selected.zone,
        opening_hours: selected.opening_hours,
      },
    });
  }, [selected, enrichedData, deepReport, pipeline]);


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
      return {
        ...lead,
        _score: computeScore(lead),
        _sector: detSector,
        chosen_specialization_label: selectedSpecialization?.label || null,
        chosen_specialization_query: selectedSpecialization?.query || null,
      };
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

  /* ─── 🚀 AUTO DEMO PRE-WARM — DISABILITATO ───
   * In passato pre-generava 3 demo in background per ogni ricerca, bruciando 15 crediti AI
   * silenziosamente (€1.35 di costo reale per ogni search). Ora la Demo Factory parte SOLO
   * su click esplicito del venditore, con dialog di conferma e gating crediti server-side. */
  const autoPrewarmDemos = useCallback(async (_leads: (Lead & { _score: number; _sector: string })[]) => {
    // No-op intenzionale — Demo Factory ora è on-demand con gating crediti.
    return;
  }, []);

  /* ─── Search ─── */
  const handleSearch = useCallback(async (page = 0, append = false) => {
    if (!city.trim() && !query.trim()) {
      toast.error("Inserisci una città o parola chiave");
      return;
    }
    if (append) setDeepLoading(true);
    else { setLoading(true); setResults([]); setSelected(null); setGeneratedMessage(null); }

    // 💰 Gating crediti: ricerca lead = 1 credito (server-side)
    const creditRes = await consumeSellerCredits("lead_search", { city: city.trim(), sector, mode: "zone" });
    if (!creditRes.success) {
      setLoading(false); setDeepLoading(false);
      toast.error(creditRes.error === "insufficient_credits"
        ? `Servono ${creditRes.required} crediti (saldo: ${creditRes.balance})`
        : creditRes.error === "monthly_cap_reached"
        ? `Tetto mensile raggiunto (${creditRes.used}/${creditRes.cap})`
        : "Crediti non disponibili");
      return;
    }

    try {
      const existingNames = append ? results.map(r => r.name) : [];
      const searchCity = country ? `${city.trim()}, ${COUNTRIES.find(c => c.code === country)?.label.replace(/^..\s/, '') || country}` : city.trim();
      const { data, error } = await supabase.functions.invoke("lead-search", {
        body: {
          query: query.trim(), city: searchCity, sector,
          specialization_query: selectedSpecialization?.query || null,
          specialization_label: selectedSpecialization?.label || null,
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
        // 🚀 Auto pre-warm demo factory per i top 3 lead (in background, silenzioso)
        if (!append) setTimeout(() => autoPrewarmDemos(processed), 3500);
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
  }, [city, query, sector, country, radius, minRating, maxRating, filterNoWebsite, filterNoSocial, filterHasPhone, results, processResults, batchEnrichInstagram, autoPrewarmDemos, consumeSellerCredits]);

  /* ─── Deep search ─── */
  const handleDeepSearch = useCallback(() => {
    handleSearch(searchPage + 1, true);
  }, [handleSearch, searchPage]);

  /* ─── GPS Radar Search (coords + radius km, real OSM data) ─── */
  const handleGpsSearch = useCallback(async (loc: GpsLocation, radiusKm: number) => {
    setLoading(true); setResults([]); setSelected(null); setGeneratedMessage(null);
    setGpsOrigin({ lat: loc.lat, lon: loc.lon, label: loc.label });
    // 💰 Gating crediti: GPS search = 1 credito (lead_search)
    const creditRes = await consumeSellerCredits("lead_search", { mode: "gps", lat: loc.lat, lon: loc.lon, radius_km: radiusKm });
    if (!creditRes.success) {
      setLoading(false);
      toast.error(creditRes.error === "insufficient_credits"
        ? `Servono ${creditRes.required} crediti (saldo: ${creditRes.balance})`
        : "Crediti non disponibili");
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("lead-search", {
        body: {
          sector,
          specialization_query: selectedSpecialization?.query || null,
          specialization_label: selectedSpecialization?.label || null,
          mode: "gps",
          use_google: true,
          page: 0,
          lat: loc.lat,
          lon: loc.lon,
          radius_km: radiusKm,
          city: loc.label,
        },
      });
      if (error) throw error;
      if (data?.success && data.results?.length > 0) {
        const processed = processResults(data.results, false);
        setSearchPage(0);
        setHasMore(data.has_more ?? false);
        setLastSearchCity(loc.label);
        setLastSearchSector(sector);
        setCity(loc.label);
        const sources = data.sources || {};
        toast.success(`📡 ${processed.length} lead reali nel raggio di ${radiusKm < 1 ? `${radiusKm * 1000}m` : `${radiusKm}km`}`, {
          description: `OSM: ${sources.nominatim || 0} · Overpass: ${sources.overpass || 0} · Google: ${sources.google || 0}`,
        });
        setGpsOpen(false);
        setTimeout(() => batchEnrichInstagram(processed), 1500);
        // 🚀 Auto pre-warm demo factory anche per GPS search
        setTimeout(() => autoPrewarmDemos(processed), 3500);
        // Auto-open speed dial if many results
        if (processed.length >= 5) setTimeout(() => setSpeedDialOpen(true), 800);
      } else {
        toast.error(`Nessun lead trovato nel raggio di ${radiusKm}km — prova ad ampliare`);
      }
    } catch (e: any) {
      toast.error(e.message || "Errore GPS scan");
    } finally {
      setLoading(false);
    }
  }, [sector, processResults, batchEnrichInstagram, autoPrewarmDemos, consumeSellerCredits, selectedSpecialization]);

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

    // Kick off deep analysis in parallel
    setDeepReport(null);
    setDeepAudit(null);
    setAnalysisLoading(true);
    supabase.functions.invoke("deep-lead-analysis", {
      body: {
        name: lead.name, city: lead.city, sector: lead._sector,
        specialization_query: lead.chosen_specialization_query,
        specialization_label: lead.chosen_specialization_label,
        website: lead.website, instagram: lead.instagram, phone: lead.phone, email: lead.email,
        google_rating: lead.google_rating, google_reviews: lead.google_reviews,
        full_address: lead.full_address, country: country || "",
        opening_hours: lead.opening_hours, types: lead.types,
      },
    }).then(({ data, error }) => {
      if (!error && data?.success) {
        setDeepReport(data.report);
        setDeepAudit(data.audit);
      } else if (error) {
        console.warn("Deep analysis failed:", error);
      }
    }).catch((e) => console.warn("Deep analysis exception:", e))
      .finally(() => setAnalysisLoading(false));

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
      } else {
        // Surface the real error — never fabricate a message with invented data
        const errMsg = error?.message || (data as any)?.error || "AI generation failed";
        throw new Error(errMsg);
      }
    } catch (err: any) {
      setGeneratedMessage(null);
      const reason = err?.message?.includes("402")
        ? "Crediti AI esauriti. Ricarica il workspace."
        : err?.message?.includes("429")
        ? "Troppe richieste, attendi qualche secondo e ritenta."
        : `Generazione fallita: ${err?.message || "errore sconosciuto"}. Premi Rigenera per riprovare.`;
      toast.error(reason, { duration: 5000 });
    } finally {
      setGeneratingMsg(false);
    }
  }, [activeChannel, enrichLeadSocial, country]);

  const copyMessage = () => {
    const textToCopy = activeChannel === "email"
      ? (auroraEmailPreview?.text || generatedMessage)
      : generatedMessage;
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      toast.success("Messaggio copiato!");
    }
  };

  // 🎯 Categorie prioritarie con storico conversione alta
  const PRIORITY_SECTORS = new Set(["food", "beauty", "ncc", "fitness", "healthcare", "hotel", "tattoo"]);

  // 🕐 Parser leggero "Mo-Fr 09:00-19:00; Sa 10:00-14:00" (formato OSM/Nominatim)
  const isOpenNow = (oh?: string | null): boolean => {
    if (!oh || typeof oh !== "string") return false;
    if (/24\s*\/\s*7/i.test(oh)) return true;
    const now = new Date();
    const dayMap = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const today = dayMap[now.getDay()];
    const nowMin = now.getHours() * 60 + now.getMinutes();
    const blocks = oh.split(";").map(s => s.trim()).filter(Boolean);
    for (const blk of blocks) {
      const m = blk.match(/^([A-Za-z,\-]+)?\s*(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})/);
      if (!m) continue;
      const dayPart = m[1] || "";
      const dayOk = !dayPart
        || dayPart.split(",").some(seg => {
          const r = seg.trim().split("-");
          if (r.length === 1) return r[0].startsWith(today);
          const i1 = dayMap.findIndex(d => r[0].startsWith(d));
          const i2 = dayMap.findIndex(d => r[1].startsWith(d));
          const ti = dayMap.indexOf(today);
          if (i1 < 0 || i2 < 0 || ti < 0) return false;
          return i1 <= i2 ? (ti >= i1 && ti <= i2) : (ti >= i1 || ti <= i2);
        });
      if (!dayOk) continue;
      const start = parseInt(m[2]) * 60 + parseInt(m[3]);
      const end = parseInt(m[4]) * 60 + parseInt(m[5]);
      if (nowMin >= start && nowMin <= end) return true;
    }
    return false;
  };

  const quickFiltersActive = qfHot || qfHasPhone || qfOpenNow || qfNoWebsite || qfPriorityCat;

  const sorted = [...results]
    .filter((r) => {
      if (!resultsQuery.trim()) return true;
      const q = resultsQuery.toLowerCase();
      return [r.name, r.city, r.zone, r.full_address, r.phone, r.email, r.website]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q));
    })
    .filter((r) => {
      if (qfHot && r._score < 70) return false;
      if (qfHasPhone && !r.phone) return false;
      if (qfNoWebsite && r.website) return false;
      if (qfPriorityCat && !PRIORITY_SECTORS.has(r._sector)) return false;
      if (qfOpenNow && !isOpenNow(r.opening_hours)) return false;
      return true;
    })
    .sort((a, b) =>
      sortBy === "score" ? b._score - a._score :
      sortBy === "rating" ? (b.google_rating || 0) - (a.google_rating || 0) :
      sortBy === "reviews" ? (b.google_reviews || 0) - (a.google_reviews || 0) :
      a.name.localeCompare(b.name)
    );

  const hotLeads = results.filter(l => l._score >= 70).length;
  const sectorConfig = selected ? INDUSTRY_CONFIGS[selected._sector as keyof typeof INDUSTRY_CONFIGS] : null;
  // ⭐ Match preview to the lead's NAME + sub-sector (sushi → Paperfish, pizza → Strapizzami, ecc.)
  const previewMatch: PreviewMatch | null = selected
    ? matchPreviewForLead({
        name: selected.name,
        sector: selected._sector,
        sectorLabel: sectorConfig?.label,
        cuisine: (selected as any).cuisine || null,
        extra: [selected.chosen_specialization_label, selected.chosen_specialization_query, selected.full_address, selected.city, selected.zone, selected.website, selected.instagram, selected.osm_type].filter(Boolean).join(" · "),
        website: selected.website,
        openingHours: selected.opening_hours,
        types: selected.types || [],
      })
    : null;
  const previewScreens = previewMatch?.screens.length
    ? previewMatch.screens
    : (selected ? getPreviewScreens(selected._sector) : []);
  const previewDetails = getPreviewDetailsForMatch(previewMatch);
  const selectedPreviewPath = selected
    ? (previewMatch?.demoSlug ? `/r/${previewMatch.demoSlug}` : getDemoSiteUrl(selected._sector))
    : "";
  const selectedPreviewUrl = selected ? `${window.location.origin}${selectedPreviewPath}` : "";
  const auroraPick = selected
    ? pickRecommendedAuroraTemplate({
        sector: selected._sector,
        googleRating: selected.google_rating ?? null,
        score: (selected as any)._score ?? null,
      })
    : null;
  const auroraTemplateName = auroraPick
    ? TEMPLATES.find((template) => template.id === auroraPick.id)?.name.replace(" — Aurora", "") || "Aurora"
    : "Aurora";
  const auroraEmailPreview = selected && activeChannel === "email"
    ? renderTemplate(auroraPick?.id || "aurora-cold-personal", {
        recipientName: (selected.email || "").split("@")[0] || selected.name.split(" ")[0] || "ciao",
        businessName: selected.name || "la vostra attività",
        city: selected.city,
        sectorLabel: sectorConfig?.label || selected._sector,
        previewLink: demoFactoryResult?.previewUrl || selectedPreviewUrl,
        senderName: "Arianna",
        senderRole: "Empire AI Group",
      })
    : null;

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
    <div className="min-h-screen px-3 sm:px-5 md:px-6 lg:px-8 py-4 md:py-5 lg:py-6 space-y-4 md:space-y-5 lg:space-y-6 pb-24 lg:pb-10 w-full max-w-[680px] md:max-w-[860px] lg:max-w-6xl xl:max-w-7xl mx-auto relative overflow-x-hidden" style={{ background: "linear-gradient(135deg, #0a0a12 0%, #0d1117 50%, #0a0a12 100%)" }}>
      <SalesPlaybook autoOpen />
      <ManualPreviewPicker
        open={showPicker}
        onClose={() => setShowPicker(false)}
        onSelect={(sel) => {
          setCustomPreview(sel);
          if (selected) requestDemoFactory(selected, sel);
        }}
        initialSector={selected?._sector}
      />

      {/* 💰 Dialog conferma consumo crediti prima della Demo Factory */}
      <CreditConfirmDialog
        open={!!pendingDemoFactory}
        cost={getCost("generate_demo_from_lead")}
        balance={creditBalance}
        contextLabel={pendingDemoFactory ? `Demo per ${pendingDemoFactory.lead.name}` : undefined}
        onCancel={() => setPendingDemoFactory(null)}
        onConfirm={() => {
          const p = pendingDemoFactory;
          setPendingDemoFactory(null);
          if (p) runDemoFactory(p.lead, p.preview);
        }}
      />

      <DemoFactoryOverlay
        open={demoFactoryOpen}
        loading={demoFactoryLoading}
        progress={demoFactoryProgress}
        result={demoFactoryResult}
        leadName={selected?.name || ""}
        leadEmail={selected?.email || ""}
        leadCity={selected?.city || ""}
        leadSector={(selected as any)?._sector || ""}
        leadRating={(selected as any)?.google_rating ?? null}
        leadScore={(selected as any)?._score ?? null}
        onClose={() => { setDemoFactoryOpen(false); setDemoFactoryResult(null); }}
        onSendWhatsApp={() => {
          if (!demoFactoryResult || !selected) return;
          const text = encodeURIComponent(
            `Ciao! Ho preparato una demo personalizzata per ${selected.name}: ${demoFactoryResult.previewUrl}\n\nPuoi accedere all'admin con questo link sicuro (valido 7gg): ${demoFactoryResult.magicLink || demoFactoryResult.adminUrl}`
          );
          const phone = (selected.phone || "").replace(/[^0-9]/g, "");
          window.open(phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`, "_blank");
        }}
      />

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

      {/* ═══ TOP-BAR PROFESSIONALE — sticky responsive (mobile/tablet/desktop) ═══ */}
      <div
        className="sticky top-0 z-30 -mx-3 sm:-mx-5 md:-mx-6 lg:-mx-8 px-3 sm:px-5 md:px-6 lg:px-8 py-2.5 md:py-3 backdrop-blur-md"
        style={{
          background: "linear-gradient(180deg, rgba(10,10,18,0.95) 0%, rgba(10,10,18,0.82) 70%, rgba(10,10,18,0) 100%)",
        }}
      >
        <div className="flex items-center gap-2 md:gap-3">
          {/* Brand mini — visibile fino a md (su lg c'è l'hero grande) */}
          <div className="flex items-center gap-2 md:gap-2.5 min-w-0 lg:hidden">
            <motion.div
              animate={{ scale: loading ? [1, 1.08, 1] : [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: loading ? 1 : 2.6 }}
              className="relative w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center shrink-0"
              style={{
                background: "radial-gradient(circle, rgba(167,139,250,0.4), rgba(20,184,166,0.15) 70%)",
                boxShadow: "0 0 14px rgba(167,139,250,0.45)",
              }}
            >
              <Target className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </motion.div>
            <div className="min-w-0">
              <p className="text-[13px] md:text-sm font-extrabold text-white leading-tight truncate">LeadEngine Scout</p>
              <p className="text-[9px] md:text-[10px] font-bold tracking-[0.18em] uppercase text-violet-300/80 leading-tight truncate">
                {loading ? "◉ scansione" : "AI · real-time"}
              </p>
            </div>
          </div>

          {/* Spacer flessibile */}
          <div className="flex-1" />

          {/* Azioni rapide — touch target 36-40px, gap consistente */}
          <button
            onClick={() => setCrmOpen(true)}
            aria-label="Apri CRM pipeline"
            className="relative flex items-center gap-1.5 px-3 py-2 md:px-3.5 md:py-2.5 rounded-xl text-[11px] md:text-xs font-bold transition-all active:scale-95 shrink-0 min-h-[36px] md:min-h-[40px]"
            style={{
              background: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(20,184,166,0.12))",
              border: "1px solid rgba(167,139,250,0.35)",
              color: "#c4b5fd",
            }}
          >
            <Briefcase className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>CRM</span>
            {pipeline.leads.length > 0 && (
              <span className="text-[9px] md:text-[10px] font-black px-1.5 py-0.5 rounded-full" style={{ background: "rgba(167,139,250,0.3)", color: "#fff", minWidth: 16, textAlign: "center" }}>
                {pipeline.leads.length}
              </span>
            )}
            {overdueFollowups.length > 0 && (
              <motion.span
                animate={{ scale: [1, 1.25, 1] }}
                transition={{ repeat: Infinity, duration: 1.4 }}
                className="absolute -top-1 -right-1 text-[9px] font-black px-1 py-0.5 rounded-full"
                style={{ background: "#ef4444", color: "#fff", minWidth: 14, textAlign: "center", boxShadow: "0 0 8px rgba(239,68,68,0.6)" }}
              >
                {overdueFollowups.length}
              </motion.span>
            )}
          </button>

          <SellerCreditsBadge balance={creditBalance} spent30d={totalSpent30d} />

          <Sheet>
            <SheetTrigger asChild>
              <button
                type="button"
                aria-label="Guida best practice e deliverability"
                className="flex items-center justify-center w-9 h-9 md:w-10 md:h-10 rounded-xl border border-violet-400/30 bg-violet-500/10 text-violet-200 active:scale-95 transition-transform shrink-0"
              >
                <ShieldCheck className="w-4 h-4 md:w-[18px] md:h-[18px]" />
              </button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full sm:max-w-md overflow-y-auto bg-zinc-950 border-l border-violet-500/20">
              <SheetHeader>
                <SheetTitle className="text-white">Guida Deliverability & Best practice</SheetTitle>
              </SheetHeader>
              <div className="mt-4">
                <DeliverabilityPanel />
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>


      {/* HERO — UNIFIED LIVING MASCOT (single central organism with embedded data-core) */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col items-center justify-center pt-4 pb-3 gap-3"
        onHoverStart={() => setSphereHover(true)}
        onHoverEnd={() => setSphereHover(false)}
        onTapStart={() => setSphereHover(true)}
        onTap={() => setTimeout(() => setSphereHover(false), 1600)}
      >
        {/* ═══ CENTRAL UNIFIED MASCOT — orb is its data heart ═══ */}
        <motion.div
          className="relative cursor-pointer select-none"
          style={{ width: 140, height: 140 }}
          animate={{
            scale: (sphereHover || loading) ? [1, 1.05, 0.99, 1.03, 1] : [1, 1.02, 1],
            filter: (sphereHover || loading)
              ? "drop-shadow(0 0 28px rgba(167,139,250,0.95))"
              : "drop-shadow(0 0 14px rgba(167,139,250,0.5))",
          }}
          transition={{
            scale: { repeat: Infinity, duration: (sphereHover || loading) ? 1.4 : 3.2, ease: "easeInOut" },
            filter: { duration: 0.5 },
          }}
        >
          {/* Outer rotating orbital ring */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: (sphereHover || loading) ? 5 : 12, ease: "linear" }}
            className="absolute inset-[-10px] rounded-full"
            style={{
              border: `1.5px dashed rgba(167,139,250,${(sphereHover || loading) ? 0.7 : 0.28})`,
            }}
          />
          {/* Counter-rotating inner ring */}
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ repeat: Infinity, duration: (sphereHover || loading) ? 7 : 18, ease: "linear" }}
            className="absolute inset-[-2px] rounded-full"
            style={{
              border: `1px dotted rgba(20,184,166,${(sphereHover || loading) ? 0.55 : 0.18})`,
            }}
          />
          {/* Pulse ring during loading/hover */}
          {(loading || sphereHover) && (
            <motion.div
              animate={{ scale: [1, 1.7, 1], opacity: [0.6, 0, 0.6] }}
              transition={{ repeat: Infinity, duration: 1.4 }}
              className="absolute inset-[-14px] rounded-full"
              style={{ border: "2px solid rgba(167,139,250,0.5)" }}
            />
          )}
          {/* Violet aura — soft glow */}
          <motion.div
            animate={{
              opacity: (sphereHover || loading) ? [0.55, 0.9, 0.55] : [0.22, 0.34, 0.22],
              scale: (sphereHover || loading) ? [1, 1.18, 1] : [1, 1.05, 1],
            }}
            transition={{ repeat: Infinity, duration: (sphereHover || loading) ? 1 : 2.6 }}
            className="absolute inset-[-22px] rounded-full"
            style={{ background: "radial-gradient(circle, rgba(167,139,250,0.6), transparent 70%)", filter: "blur(20px)" }}
          />

          {/* Holographic scan-line during data exchange */}
          {(sphereHover || loading) && (
            <motion.div
              className="absolute inset-0 rounded-full overflow-hidden pointer-events-none z-20"
              style={{
                background: "linear-gradient(180deg, transparent 0%, rgba(20,184,166,0.32) 50%, transparent 100%)",
                mixBlendMode: "screen",
              }}
              animate={{ y: ["-100%", "100%"] }}
              transition={{ repeat: Infinity, duration: 1.4, ease: "linear" }}
            />
          )}

          {/* The violet mascot — centerpiece, always visible */}
          <motion.img
            src={empireMonkeyLaptop}
            alt="Empire Scout"
            className="w-full h-full object-contain relative z-10"
            animate={{
              y: (sphereHover || loading) ? [0, -6, 2, -4, 0] : [0, -4, 0],
              rotate: (sphereHover || loading) ? [0, -3, 3, -2, 0] : [0, -1, 1, 0],
            }}
            transition={{ repeat: Infinity, duration: (sphereHover || loading) ? 1.6 : 3.4, ease: "easeInOut" }}
          />

          {/* ═══ DATA-CORE ORB embedded as floating heart on top-right of mascot ═══ */}
          <motion.div
            className="absolute z-30"
            style={{ width: 52, height: 52, top: -6, right: -6, perspective: 400 }}
            animate={{
              y: [0, -3, 0, -2, 0],
              rotateY: (sphereHover || loading) ? [0, 22, -22, 0] : 0,
              rotateX: (sphereHover || loading) ? [0, -10, 10, 0] : 0,
            }}
            transition={{
              y: { repeat: Infinity, duration: 3.5, ease: "easeInOut" },
              rotateY: { duration: 1.4, repeat: (sphereHover || loading) ? Infinity : 0 },
              rotateX: { duration: 1.4, repeat: (sphereHover || loading) ? Infinity : 0 },
            }}
          >
            {[0, 1, 2].map(i => (
              <motion.div
                key={`orbit-${i}`}
                className="absolute inset-0 rounded-full"
                style={{
                  border: `1px solid rgba(139,92,246,${sphereHover ? 0.4 : 0.12})`,
                  transform: `rotateX(${60 + i * 20}deg) rotateZ(${i * 60}deg)`,
                }}
                animate={{ rotate: i % 2 === 0 ? 360 : -360 }}
                transition={{ repeat: Infinity, duration: 6 + i * 2, ease: "linear" }}
              />
            ))}
            <motion.div
              className="absolute inset-[-6px] rounded-full"
              animate={{
                scale: sphereHover ? [1, 1.25, 1] : [1, 1.08, 1],
                opacity: sphereHover ? [0.45, 0.12, 0.45] : [0.18, 0.06, 0.18],
              }}
              transition={{ repeat: Infinity, duration: sphereHover ? 0.9 : 2.5 }}
              style={{ background: "radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)" }}
            />
            <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full drop-shadow-[0_0_10px_rgba(139,92,246,0.5)]">
              <defs>
                <radialGradient id="holoCore" cx="45%" cy="40%">
                  <stop offset="0%" stopColor="rgba(167,139,250,0.35)" />
                  <stop offset="50%" stopColor="rgba(139,92,246,0.12)" />
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
                  stroke={i === 1 ? "rgba(20,184,166,0.3)" : "rgba(139,92,246,0.25)"}
                  strokeWidth={0.6}
                  strokeDasharray={`${3 + i * 2} ${4 + i}`}
                  animate={{
                    strokeDashoffset: [0, 100],
                    opacity: sphereHover ? [0.7, 0.3, 0.7] : [0.25, 0.45, 0.25],
                  }}
                  transition={{
                    strokeDashoffset: { repeat: Infinity, duration: 8 + i * 3, ease: "linear" },
                    opacity: { repeat: Infinity, duration: 2 },
                  }}
                />
              ))}
              {sphereNodes.slice(0, 10).map((n, i) => {
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
                      opacity: sphereHover ? [1, 0.5, 1] : [0.3, 0.55, 0.3],
                    }}
                    transition={{ repeat: Infinity, duration: 3 + (i % 4), ease: "easeInOut", delay: i * 0.15 }}
                  />
                );
              })}
              <motion.circle
                cx={50} cy={50}
                fill="rgba(167,139,250,0.7)"
                filter="url(#glow)"
                animate={{
                  r: sphereHover ? [3, 7, 3] : [2.5, 4.5, 2.5],
                  opacity: sphereHover ? [1, 0.4, 1] : [0.5, 0.8, 0.5],
                }}
                transition={{ repeat: Infinity, duration: sphereHover ? 0.6 : 2 }}
              />
              <motion.circle
                cx={50} cy={50} r={1.5}
                fill="#fff"
                animate={{ opacity: sphereHover ? [1, 0.2, 1] : [0.6, 0.9, 0.6] }}
                transition={{ repeat: Infinity, duration: 1 }}
              />
            </svg>
          </motion.div>

          {/* Internal data link — short pulse line connecting mascot ⇄ orb-core */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[15]" viewBox="0 0 140 140">
            <defs>
              <linearGradient id="internalLink" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="rgba(167,139,250,0)" />
                <stop offset="50%" stopColor="rgba(20,184,166,0.85)" />
                <stop offset="100%" stopColor="rgba(167,139,250,0)" />
              </linearGradient>
            </defs>
            <motion.path
              d="M 70 60 Q 95 35, 115 18"
              fill="none"
              stroke="url(#internalLink)"
              strokeWidth={(sphereHover || loading) ? 1.6 : 0.8}
              strokeDasharray="2 3"
              animate={{
                strokeDashoffset: [0, -20],
                opacity: (sphereHover || loading) ? [0.85, 1, 0.85] : [0.35, 0.5, 0.35],
              }}
              transition={{
                strokeDashoffset: { repeat: Infinity, duration: (sphereHover || loading) ? 0.6 : 2, ease: "linear" },
                opacity: { repeat: Infinity, duration: 1.6 },
              }}
            />
          </svg>
        </motion.div>

        {/* Title under the unified mascot */}
        <div className="flex flex-col items-center leading-none gap-1">
          <motion.h1
            className="text-lg font-extrabold tracking-tight text-white flex items-center gap-1.5"
            animate={{
              letterSpacing: (sphereHover || loading) ? "0.06em" : "0em",
              textShadow: (sphereHover || loading) ? "0 0 12px rgba(167,139,250,0.6)" : "0 0 0 transparent",
            }}
            transition={{ duration: 0.6 }}
          >
            <Target className="w-4 h-4 shrink-0" style={{ color: (sphereHover || loading) ? "#a78bfa" : "#14b8a6", transition: "color 0.4s" }} />
            <AnimatePresence mode="wait" initial={false}>
              {loading ? (
                <motion.span key="t-scan" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  style={{ background: "linear-gradient(90deg, #a78bfa, #14b8a6, #a78bfa)", backgroundSize: "200% 100%", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  SCANSIONE...
                </motion.span>
              ) : sphereHover ? (
                <motion.span key="t-live" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}
                  style={{ background: "linear-gradient(90deg, #a78bfa, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
                >
                  LeadEngine LIVE
                </motion.span>
              ) : (
                <motion.span key="t-idle" initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -5 }}>
                  LeadEngine Scout
                </motion.span>
              )}
            </AnimatePresence>
          </motion.h1>
          <motion.p
            className="text-[9px] font-bold tracking-[0.22em] uppercase"
            style={{ background: "linear-gradient(90deg, #8b5cf6, #14b8a6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: (sphereHover || loading) ? 1 : 2.5 }}
          >
            {loading ? "◉ Sync neurale in corso" : sphereHover ? "◉ Data link attivo" : "AI · Real-time"}
          </motion.p>
        </div>
      </motion.div>

      {/* Lead count badges — solo se ci sono risultati (CRM è già nella top-bar) */}
      {results.length > 0 && (
        <div className="flex justify-center items-center gap-2 flex-wrap">
          <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(16,185,129,0.1)", color: "#34d399" }}>
            🟢 {results.length} lead
          </span>
          <span className="px-2 py-1 rounded-lg text-[9px] font-bold" style={{ background: "rgba(239,68,68,0.1)", color: "#f87171" }}>
            🔥 {hotLeads} caldi
          </span>
        </div>
      )}

      {/* ═══ ONBOARDING WIZARD (one-time) — leggero, sempre montato ═══ */}
      <SellerOnboardingWizard />


      {/* ═══ SEARCH BAR — responsive: 1-2 col mobile, 4 col desktop ═══ */}
      <div className="rounded-2xl p-4 md:p-5 lg:p-6 space-y-3 md:space-y-4" style={{ background: "linear-gradient(135deg, rgba(20,184,166,0.06), rgba(16,185,129,0.03))", border: "1px solid rgba(20,184,166,0.15)" }}>

        {/* Row principale: Paese · Città · Settore · Cerca (responsive) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
          <div className="md:col-span-1">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>🌍 Paese</label>
            <select value={country} onChange={e => setCountry(e.target.value)}
              className="w-full px-3 py-3 md:py-3.5 rounded-xl text-[12px] md:text-[13px] text-white outline-none appearance-none cursor-pointer min-h-[44px]" style={inputStyle}>
              {COUNTRIES.map(c => <option key={c.code} value={c.code} style={{ background: "#1a1a2e" }}>{c.label}</option>)}
            </select>
          </div>
          <div className="md:col-span-1">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>📍 Città</label>
            <SmartCityAutocomplete
              value={city}
              onChange={(v) => setCity(v)}
              countryCode={country}
              placeholder="Roma, Milano, Dubai..."
              inputStyle={inputStyle}
              onEnter={() => handleSearch()}
              inputRef={cityInputRef}
              selectedArea={query}
              onAreaSelect={(area) => setQuery(area)}
              onCountryDetected={(cc) => setCountry(cc)}
            />
          </div>

          {/* Settore — col-span-2 su mobile, col-span-1 desktop */}
          <div className="col-span-2 md:col-span-1">
            <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>🏢 Settore / Specializzazione</label>
            <SmartSectorAutocomplete
              sectorValue={sector}
              onSectorChange={setSector}
              subQueryValue={selectedSpecialization?.query || ""}
              subLabelValue={selectedSpecialization?.label || ""}
              onSubsectorChange={setSelectedSpecialization}
              inputStyle={inputStyle}
              onEnter={() => handleSearch()}
            />
          </div>

          {/* CTA Cerca — full width mobile, 1 col desktop */}
          <div className="col-span-2 md:col-span-1 flex items-end">
            <motion.button whileTap={{ scale: 0.95 }} onClick={() => handleSearch()} disabled={loading}
              className="w-full py-3 md:py-3.5 rounded-xl text-[13px] md:text-sm font-bold flex items-center justify-center gap-2 min-h-[44px] md:min-h-[48px] shadow-lg"
              style={{ background: loading ? "rgba(20,184,166,0.3)" : "linear-gradient(135deg, #14b8a6, #10b981)", color: "#fff", boxShadow: loading ? "none" : "0 4px 16px rgba(20,184,166,0.3)" }}>
              {loading ? <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" /> : <Search className="w-4 h-4 md:w-5 md:h-5" />}
              {loading ? "Ricerca..." : "Cerca lead"}
            </motion.button>
          </div>
        </div>

        {/* Riga ottimizzazione zona/nome — full width sotto */}
        <div className="relative">
          <label className="text-[9px] md:text-[10px] font-bold uppercase tracking-wider block mb-1 pl-1" style={{ color: "#6b7280" }}>🔎 Zona / Nome (opzionale, affina la ricerca)</label>
          <Search className="absolute left-3 bottom-3 md:bottom-3.5 w-4 h-4" style={{ color: "#6b7280" }} />
          <input value={query} onChange={e => setQuery(e.target.value)} onKeyDown={e => e.key === "Enter" && handleSearch()}
            placeholder="Es: Trastevere, Brera, nome attività..." className="w-full pl-10 pr-3 py-3 md:py-3.5 rounded-xl text-[12px] md:text-[13px] text-white placeholder:text-gray-500 outline-none min-h-[44px]" style={inputStyle} />
        </div>


        {/* Quick actions */}
        <div className="flex items-center gap-2 flex-wrap">
          {/* 📍 PRIMARY CTA: Trova lead vicino a me (posizione attuale venditore) */}
          <motion.button
            whileTap={{ scale: 0.95 }}
            animate={!gpsOpen ? { boxShadow: ["0 0 0 0 rgba(6,182,212,0.4)", "0 0 0 8px rgba(6,182,212,0)", "0 0 0 0 rgba(6,182,212,0)"] } : {}}
            transition={{ repeat: Infinity, duration: 2.2 }}
            onClick={() => setGpsOpen(true)}
            className="flex items-center gap-1.5 text-[10px] font-black px-3 py-1.5 rounded-lg relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #14b8a6, #10b981)",
              border: "1px solid rgba(6,182,212,0.6)",
              color: "#fff",
            }}
            title="Cerca lead reali nel raggio della tua posizione GPS attuale"
          >
            <Crosshair className="w-3 h-3" />
            Trova vicino a me
            <span className="text-[7px] px-1 rounded font-black" style={{ background: "rgba(255,255,255,0.25)", color: "#fff" }}>GPS</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={() => setGpsOpen(!gpsOpen)}
            className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg relative overflow-hidden"
            style={{
              background: gpsOpen
                ? "linear-gradient(135deg, rgba(6,182,212,0.25), rgba(20,184,166,0.15))"
                : "linear-gradient(135deg, rgba(6,182,212,0.12), rgba(20,184,166,0.06))",
              border: `1px solid ${gpsOpen ? "rgba(6,182,212,0.5)" : "rgba(6,182,212,0.3)"}`,
              color: "#22d3ee",
            }}
          >
            <motion.span animate={{ rotate: gpsOpen ? 360 : 0 }} transition={{ duration: 1.5, repeat: gpsOpen ? Infinity : 0, ease: "linear" }}>
              <Radar className="w-3 h-3" />
            </motion.span>
            GPS Radar
            <span className="text-[7px] px-1 rounded font-black" style={{ background: "rgba(34,197,94,0.2)", color: "#86efac" }}>FREE</span>
          </motion.button>
          {results.length > 0 && (
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => setSpeedDialOpen(true)}
              className="flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg"
              style={{
                background: "linear-gradient(135deg, rgba(20,184,166,0.18), rgba(16,185,129,0.10))",
                border: "1px solid rgba(20,184,166,0.4)",
                color: "#5eead4",
              }}
            >
              <ListChecks className="w-3 h-3" />
              Lista nomi
              <span className="text-[8px] font-black px-1 rounded" style={{ background: "rgba(20,184,166,0.3)", color: "#fff" }}>
                {results.length}
              </span>
            </motion.button>
          )}
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

        {/* ═══ GPS RADAR PANEL ═══ */}
        <GpsRadarPanel open={gpsOpen} onClose={() => setGpsOpen(false)} onSearch={handleGpsSearch} loading={loading} />

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

      {/* ═══ STRUMENTI & AUTOMAZIONI AI — collassabile, chiuso di default su mobile ═══
           Contiene: Tips, Arianna Autopilot, Insights, Intelligence Inbox, Voice, Stepper.
           Su desktop tutto è espanso/visibile come prima.
      */}
      <details
        className="lg:hidden rounded-2xl overflow-hidden group"
        style={{
          background: "linear-gradient(135deg, rgba(167,139,250,0.06), rgba(20,184,166,0.04))",
          border: "1px solid rgba(167,139,250,0.18)",
        }}
      >
        <summary className="flex items-center justify-between gap-2 px-4 py-3 cursor-pointer select-none list-none active:opacity-80">
          <div className="flex items-center gap-2 min-w-0">
            <Sparkles className="w-4 h-4 shrink-0" style={{ color: "#a78bfa" }} />
            <div className="min-w-0">
              <p className="text-[12px] font-bold text-white leading-tight">Strumenti & Automazioni AI</p>
              <p className="text-[9px] text-violet-300/70 leading-tight">Autopilot Arianna · Insights · Inbox · Voce</p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-violet-300 transition-transform group-open:rotate-180 shrink-0" />
        </summary>
        <div className="px-3 pb-4 pt-1 space-y-4">
          {/* TIPS */}
          <AnimatePresence>
            {showTips && results.length === 0 && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="rounded-xl p-3 flex items-start gap-2.5" style={{ background: "rgba(20,184,166,0.04)", border: "1px solid rgba(20,184,166,0.12)" }}>
                <Sparkles className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#14b8a6" }} />
                <div className="flex-1">
                  <p className="text-[10px] font-bold mb-1" style={{ color: "#5eead4" }}>Come funziona in 3 step:</p>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { step: "1", title: "Cerca", desc: "Città + settore: parte automatica" },
                      { step: "2", title: "Analizza", desc: "Score, social, contatti reali" },
                      { step: "3", title: "Contatta", desc: "Messaggio AI WhatsApp/Email" },
                    ].map((s, i) => (
                      <div key={i} className="text-center">
                        <span className="inline-flex w-5 h-5 rounded-full items-center justify-center text-[9px] font-bold mb-1" style={{ background: "rgba(20,184,166,0.15)", color: "#14b8a6" }}>{s.step}</span>
                        <p className="text-[9px] font-bold text-white">{s.title}</p>
                        <p className="text-[8px]" style={{ color: "#6b7280" }}>{s.desc}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <button onClick={(e) => { e.preventDefault(); setShowTips(false); sessionStorage.setItem("leads_tips_hidden", "1"); }}
                  className="p-1 rounded shrink-0" style={{ color: "#6b7280" }}>
                  <XIcon className="w-3 h-3" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* AUTOPILOT */}
          <AriannaLeadScoutPanel
            defaultTarget={{ city: city || "Roma", sector: sector || "food" }}
            pilot={{
              setSearchInputs: (c, s) => { setCity(c); setSector(s); },
              triggerSearch: async () => { await handleSearch(); },
              triggerDemoFactoryOnTopLead: async () => {
                const top = sorted[0];
                if (top) await runDemoFactory(top, null);
              },
              getResultsCount: () => results.length,
              getTopLead: () => {
                const top = sorted[0];
                if (!top) return null;
                return { name: top.name, phone: top.phone, email: top.email, sector: top._sector };
              },
            }}
          />

          {/* INSIGHTS */}
          <AriannaInsightsDashboard />

          {/* INTELLIGENCE INBOX */}
          <LeadIntelligenceInbox />

          {/* VOICE */}
          <button
            type="button"
            onClick={() => (window as any).__empireVoiceStart?.()}
            className="w-full rounded-2xl px-4 py-3 flex items-center justify-center gap-2 font-bold text-sm text-white transition-all active:scale-[0.99]"
            style={{
              background: "linear-gradient(135deg, #f59e0b, #f97316)",
              boxShadow: "0 6px 24px rgba(245,158,11,0.35)",
            }}
          >
            🎙 Comanda con la voce
          </button>

          {/* FLUSSO STEPPER */}
          <PartnerFlowStepper currentStep="leads" />
        </div>
      </details>

      {/* ═══ DESKTOP-ONLY: gli stessi moduli espansi (no collasso, esperienza piena su lg+) ═══ */}
      <div className="hidden lg:block space-y-4">
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

        <AriannaLeadScoutPanel
          defaultTarget={{ city: city || "Roma", sector: sector || "food" }}
          pilot={{
            setSearchInputs: (c, s) => { setCity(c); setSector(s); },
            triggerSearch: async () => { await handleSearch(); },
            triggerDemoFactoryOnTopLead: async () => {
              const top = sorted[0];
              if (top) await runDemoFactory(top, null);
            },
            getResultsCount: () => results.length,
            getTopLead: () => {
              const top = sorted[0];
              if (!top) return null;
              return { name: top.name, phone: top.phone, email: top.email, sector: top._sector };
            },
          }}
        />

        <AriannaInsightsDashboard />

        <div className="mt-4">
          <LeadIntelligenceInbox />
        </div>

        <button
          type="button"
          onClick={() => (window as any).__empireVoiceStart?.()}
          className="w-full rounded-2xl px-4 py-3 flex items-center justify-center gap-2 font-bold text-sm text-white transition-all hover:scale-[1.01]"
          style={{
            background: "linear-gradient(135deg, #f59e0b, #f97316)",
            boxShadow: "0 6px 24px rgba(245,158,11,0.35)",
          }}
        >
          🎙 Comanda con la voce — "Trova lead a Milano", "Lancia demo sul primo lead"
        </button>

        <PartnerFlowStepper currentStep="leads" />
      </div>

      {/* ═══ RESULTS LIST ═══ */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-2">
            <div className="flex items-center justify-between px-1">
              <p className="text-[10px] font-semibold" style={{ color: "#9ca3af" }}>
                {sorted.length}{sorted.length !== results.length ? `/${results.length}` : ""} lead{" "}
                {city && `a ${city}`} {searchPage > 0 && `(${searchPage + 1} ricerche)`}
              </p>
              <div className="flex items-center gap-0.5 flex-wrap justify-end">
                <ArrowUpDown className="w-3 h-3 mr-1" style={{ color: "#6b7280" }} />
                {(["score", "rating", "reviews", "name"] as const).map(s => (
                  <button key={s} onClick={() => setSortBy(s)} className="px-2 py-1 rounded text-[9px] font-semibold transition-all min-h-[28px]"
                    style={{ background: sortBy === s ? "rgba(255,255,255,0.08)" : "transparent", color: sortBy === s ? "#e5e7eb" : "#6b7280" }}>
                    {s === "score" ? "Score" : s === "rating" ? "Rating" : s === "reviews" ? "Recensioni" : "Nome"}
                  </button>
                ))}
                <button
                  onClick={() => exportLeadsToCsv(sorted, city, sector)}
                  disabled={sorted.length === 0}
                  title="Esporta i lead filtrati in CSV (apribile in Excel)"
                  className="ml-1 px-2 py-1 rounded text-[9px] font-bold transition-all min-h-[28px] flex items-center gap-1 disabled:opacity-40"
                  style={{
                    background: "linear-gradient(135deg, rgba(124,58,237,0.18), rgba(167,139,250,0.18))",
                    color: "#c4b5fd",
                    border: "1px solid rgba(167,139,250,0.35)"
                  }}
                >
                  <Download className="w-3 h-3" /> Export CSV
                </button>
              </div>
            </div>

            {/* 🎯 Quick filters "più convertibili" — operano sui risultati locali (anche dopo GPS search) */}
            <div className="px-1 flex items-center gap-1.5 flex-wrap">
              <span className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>
                🎯 Più convertibili:
              </span>
              {([
                { key: "hot", label: "🔥 Hot", desc: "Score ≥ 70", state: qfHot, set: setQfHot, color: "#ef4444" },
                { key: "phone", label: "📞 Telefono", desc: "Contattabile subito", state: qfHasPhone, set: setQfHasPhone, color: "#10b981" },
                { key: "open", label: "🟢 Aperto ora", desc: "In orario di apertura", state: qfOpenNow, set: setQfOpenNow, color: "#22c55e" },
                { key: "nosite", label: "🌐 Senza sito", desc: "Bisogno digitale immediato", state: qfNoWebsite, set: setQfNoWebsite, color: "#f59e0b" },
                { key: "prio", label: "⭐ Top categorie", desc: "Settori a conversione alta", state: qfPriorityCat, set: setQfPriorityCat, color: "#a78bfa" },
              ] as const).map(f => (
                <button
                  key={f.key}
                  onClick={() => f.set(!f.state)}
                  title={f.desc}
                  className="text-[9px] font-bold px-2 py-1 rounded-md transition-all"
                  style={{
                    background: f.state ? `${f.color}28` : "rgba(255,255,255,0.03)",
                    color: f.state ? f.color : "#9ca3af",
                    border: `1px solid ${f.state ? `${f.color}80` : "rgba(255,255,255,0.06)"}`,
                  }}
                >
                  {f.label}
                </button>
              ))}
              {quickFiltersActive && (
                <button
                  onClick={() => {
                    setQfHot(false); setQfHasPhone(false); setQfOpenNow(false);
                    setQfNoWebsite(false); setQfPriorityCat(false);
                  }}
                  className="text-[9px] font-bold px-2 py-1 rounded-md ml-1"
                  style={{ background: "rgba(255,255,255,0.05)", color: "#9ca3af" }}
                >
                  ✕ Pulisci
                </button>
              )}
            </div>

            {/* 🔎 Ricerca testuale interna ai risultati (no chiamate API) */}
            {results.length > 4 && (
              <div className="relative px-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#6b7280" }} />
                <input
                  value={resultsQuery}
                  onChange={(e) => setResultsQuery(e.target.value)}
                  placeholder="Filtra per nome, città, zona, telefono…"
                  className="w-full pl-7 pr-8 py-2 rounded-lg text-[11px] text-foreground placeholder:text-muted-foreground"
                  style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.08)" }}
                />
                {resultsQuery && (
                  <button
                    onClick={() => setResultsQuery("")}
                    aria-label="Cancella ricerca"
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors"
                    style={{ color: "#9ca3af" }}
                  >
                    <XIcon className="w-3 h-3" />
                  </button>
                )}
              </div>
            )}

            <div className="space-y-2 max-h-[420px] md:max-h-[560px] lg:max-h-[640px] overflow-y-auto pr-1">
              {sorted.length === 0 && resultsQuery && (
                <div className="text-center text-[11px] text-muted-foreground py-6">
                  Nessun lead corrisponde a “{resultsQuery}”.
                  <button onClick={() => setResultsQuery("")} className="ml-2 underline text-violet-300">Pulisci</button>
                </div>
              )}
              {sorted.map((lead, i) => {
                const isSelected = selected?.name === lead.name && selected?.full_address === lead.full_address;
                const scoreColor = lead._score >= 70 ? "#ef4444" : lead._score >= 45 ? "#f59e0b" : "#10b981";
                const srcInfo = SOURCE_LABELS[lead.source] || { label: lead.source, color: "#9ca3af" };
                const rowKey = `${lead.name}|${lead.full_address}`;
                const isQuickOpen = quickPreviewKey === rowKey;
                // 📏 Distanza dal venditore (Haversine, km) — solo se GPS origin disponibile
                const distanceKm = (() => {
                  if (!gpsOrigin || typeof lead.lat !== "number" || typeof lead.lon !== "number") return null;
                  const R = 6371;
                  const dLat = (lead.lat - gpsOrigin.lat) * Math.PI / 180;
                  const dLon = (lead.lon - gpsOrigin.lon) * Math.PI / 180;
                  const a = Math.sin(dLat / 2) ** 2 +
                    Math.cos(gpsOrigin.lat * Math.PI / 180) * Math.cos(lead.lat * Math.PI / 180) *
                    Math.sin(dLon / 2) ** 2;
                  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                })();
                const distanceLabel = distanceKm == null ? null
                  : distanceKm < 1 ? `${Math.round(distanceKm * 1000)} m`
                  : `${distanceKm.toFixed(distanceKm < 10 ? 1 : 0)} km`;
                // 🎯 Punteggio di conversione (etichetta rapida basata su _score)
                const convLabel = lead._score >= 70 ? "Alta" : lead._score >= 45 ? "Media" : "Bassa";
                const convIcon = lead._score >= 70 ? "🔥" : lead._score >= 45 ? "⚡" : "💤";
                return (
                  <motion.div key={`${lead.name}-${i}`}
                    initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: Math.min(i * 0.01, 0.5) }}
                    className="rounded-xl transition-all overflow-hidden"
                    style={{
                      background: isSelected ? "rgba(20,184,166,0.1)" : "rgba(255,255,255,0.02)",
                      border: `1px solid ${isSelected ? "rgba(20,184,166,0.3)" : "rgba(255,255,255,0.05)"}`,
                    }}>
                    <div className="flex items-start gap-3 p-3">
                      <button
                        onClick={() => handleSelect(lead)}
                        className="flex-1 text-left flex items-start gap-3 min-w-0"
                      >
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
                            {/* 🎯 Punteggio di conversione */}
                            <span
                              className="text-[8px] font-bold px-1.5 py-0.5 rounded-full"
                              style={{ background: `${scoreColor}15`, color: scoreColor, border: `1px solid ${scoreColor}40` }}
                              title={`Score AI: ${lead._score}/100 — Probabilità conversione ${convLabel.toLowerCase()}`}
                            >
                              {convIcon} {convLabel}
                            </span>
                            {/* 📏 Distanza dal venditore */}
                            {distanceLabel && (
                              <span
                                className="text-[8px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5"
                                style={{ background: "rgba(6,182,212,0.12)", color: "#22d3ee", border: "1px solid rgba(6,182,212,0.3)" }}
                                title={`Distanza da ${gpsOrigin?.label || "tua posizione"}`}
                              >
                                📍 {distanceLabel}
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
                      </button>
                      {/* 👁 Anteprima rapida (no consumo crediti) */}
                      <button
                        onClick={(e) => { e.stopPropagation(); setQuickPreviewKey(isQuickOpen ? null : rowKey); }}
                        aria-label="Anteprima rapida"
                        className="shrink-0 w-9 h-9 rounded-lg flex items-center justify-center transition-colors"
                        style={{
                          background: isQuickOpen ? "rgba(167,139,250,0.18)" : "rgba(255,255,255,0.04)",
                          border: `1px solid ${isQuickOpen ? "rgba(167,139,250,0.4)" : "rgba(255,255,255,0.08)"}`,
                          color: isQuickOpen ? "#c4b5fd" : "#9ca3af",
                        }}
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </div>
                    <AnimatePresence>
                      {isQuickOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="overflow-hidden"
                        >
                          <div className="px-3 pb-3 pt-0 grid grid-cols-2 gap-2 text-[10px]">
                            <QuickStat label="Settore" value={lead._sector || "—"} />
                            <QuickStat label="Recensioni Google" value={lead.google_reviews ? `${lead.google_reviews}` : "—"} />
                            <QuickStat label="Email" value={lead.email || "non trovata"} mono />
                            <QuickStat label="Zona" value={lead.zone || lead.city || "—"} />
                            <div className="col-span-2 flex flex-wrap gap-1.5 pt-1">
                              {lead.phone && (
                                <a href={`tel:${lead.phone}`} onClick={(e) => e.stopPropagation()}
                                  className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
                                  style={{ background: "rgba(52,211,153,0.14)", color: "#34d399", border: "1px solid rgba(52,211,153,0.3)" }}>
                                  <Phone className="w-2.5 h-2.5" /> Chiama
                                </a>
                              )}
                              {lead.website && (
                                <a href={lead.website} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                  className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
                                  style={{ background: "rgba(96,165,250,0.14)", color: "#60a5fa", border: "1px solid rgba(96,165,250,0.3)" }}>
                                  <ExternalLink className="w-2.5 h-2.5" /> Sito
                                </a>
                              )}
                              {lead.google_maps_url && (
                                <a href={lead.google_maps_url} target="_blank" rel="noreferrer" onClick={(e) => e.stopPropagation()}
                                  className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1"
                                  style={{ background: "rgba(244,114,182,0.14)", color: "#f472b6", border: "1px solid rgba(244,114,182,0.3)" }}>
                                  <MapPin className="w-2.5 h-2.5" /> Maps
                                </a>
                              )}
                              <button
                                onClick={(e) => { e.stopPropagation(); handleSelect(lead); }}
                                className="px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 ml-auto"
                                style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.25), rgba(20,184,166,0.18))", color: "#fff", border: "1px solid rgba(167,139,250,0.4)" }}>
                                <Sparkles className="w-2.5 h-2.5" /> Analizza
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
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
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* Save to CRM */}
                  <button
                    onClick={handleSaveToCRM}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-[9px] font-bold transition-all hover:scale-[1.03]"
                    style={{
                      background: isLeadSaved(selected) ? "rgba(34,197,94,0.15)" : "linear-gradient(135deg, rgba(167,139,250,0.2), rgba(20,184,166,0.12))",
                      border: `1px solid ${isLeadSaved(selected) ? "rgba(34,197,94,0.4)" : "rgba(167,139,250,0.4)"}`,
                      color: isLeadSaved(selected) ? "#34d399" : "#c4b5fd",
                    }}
                    title={isLeadSaved(selected) ? "Già nel CRM" : "Salva nel CRM"}
                  >
                    {isLeadSaved(selected) ? <CheckCircle className="w-3 h-3" /> : <Bookmark className="w-3 h-3" />}
                    {isLeadSaved(selected) ? "Salvato" : "Salva"}
                  </button>
                  <button onClick={() => { setSelected(null); setGeneratedMessage(null); }}
                    className="p-1.5 rounded-lg" style={{ background: "rgba(239,68,68,0.1)" }}>
                    <XIcon className="w-3.5 h-3.5" style={{ color: "#f87171" }} />
                  </button>
                </div>
              </div>

              {/* ═══ Intelligence Analyzer — analizza profondamente questo lead ═══ */}
              <div className="mt-3">
                <LeadIntelligenceLauncher
                  lead={{
                    name: selected.name,
                    city: selected.city,
                    full_address: selected.full_address,
                    sector: sectorConfig?.label?.toLowerCase() || null,
                    website: selected.website,
                    phone: selected.phone,
                    instagram: selected.instagram || enrichedData?.instagram || null,
                    google_rating: selected.google_rating,
                    google_reviews_count: (selected as any).google_reviews_count ?? null,
                  }}
                  variant="full"
                />
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

            {/* ═══ DEEP AI INTEL — Real Scraping + Sales Playbook ═══ */}
            {(analysisLoading || deepReport) ? (
              <DeepLeadIntel
                loading={analysisLoading}
                report={deepReport}
                audit={deepAudit}
                leadName={selected.name}
                onUseHook={(hook) => setGeneratedMessage(hook)}
              />
            ) : (
              <div className="p-4 rounded-2xl space-y-3" style={{ background: "rgba(239,68,68,0.03)", border: "1px solid rgba(239,68,68,0.1)" }}>
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: "#ef4444" }} />
                  <span className="text-xs font-bold text-white">Analisi Settore — {sectorConfig?.label || selected._sector}</span>
                </div>
                <div className="space-y-1.5">
                  {(SECTOR_PAIN_ANALYSIS[selected._sector] || SECTOR_PAIN_ANALYSIS.default).map((pain, i) => (
                    <motion.div key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.08 }}
                      className="flex items-start gap-2 p-2 rounded-lg" style={{ background: "rgba(239,68,68,0.04)", border: "1px solid rgba(239,68,68,0.08)" }}>
                      <span className="text-[9px] mt-0.5" style={{ color: "#ef4444" }}>⚠️</span>
                      <span className="text-[10px]" style={{ color: "#e5e7eb" }}>{pain}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="p-2.5 rounded-lg" style={{ background: "rgba(16,185,129,0.06)", border: "1px solid rgba(16,185,129,0.12)" }}>
                  <p className="text-[10px] font-bold" style={{ color: "#34d399" }}>
                    💡 {selected.name} ha {selected._score >= 70 ? "urgente bisogno" : selected._score >= 45 ? "bisogno evidente" : "potenziale"} di digitalizzazione.
                    {!selected.website && " Non ha nemmeno un sito web — opportunità enorme."}
                  </p>
                </div>
              </div>
            )}

            {/* ═══ CUSTOMIZED DEMO PREVIEW — Sector-Specific ═══ */}
            {(() => {
              const sectorFeats = previewDetails;
              return (
              <div className="p-4 rounded-2xl space-y-2" style={{ background: "rgba(167,139,250,0.03)", border: "1px solid rgba(167,139,250,0.1)" }}>
                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <div className="flex items-center gap-2 min-w-0">
                    <Eye className="w-3.5 h-3.5 shrink-0" style={{ color: "#a78bfa" }} />
                    <span className="text-xs font-bold text-white truncate">
                      📱 Preview {previewMatch?.brandName || sectorConfig?.label || "Business"}
                      {previewMatch?.styleName ? ` · ${previewMatch.styleName}` : ""} per {selected.name}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={() => requestDemoFactory(selected, customPreview)}
                      disabled={demoFactoryLoading}
                      className="text-[9px] font-black px-2.5 py-1 rounded-lg flex items-center gap-1 disabled:opacity-50"
                      style={{ background: "linear-gradient(135deg, #a78bfa, #14b8a6)", color: "#fff", boxShadow: "0 4px 14px rgba(167,139,250,0.35)" }}
                    >
                      <WandIcon className="w-3 h-3" /> {demoFactoryLoading ? "Genero…" : "🪄 Genera Demo Live"}
                    </button>
                    <button
                      onClick={() => setShowPicker(true)}
                      className="text-[9px] font-bold px-2 py-1 rounded-lg flex items-center gap-1"
                      style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.18), rgba(20,184,166,0.12))", border: "1px solid rgba(167,139,250,0.3)", color: "#c4b5fd" }}
                    >
                      <Layers className="w-3 h-3" /> Galleria
                    </button>
                    <button onClick={() => setShowPreview(!showPreview)} className="text-[9px] font-semibold px-2 py-1" style={{ color: "#a78bfa" }}>
                      {showPreview ? "Nascondi" : "Mostra"}
                    </button>
                  </div>
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
                        <a
                          href={previewMatch?.demoSlug ? `/r/${previewMatch.demoSlug}` : getDemoSiteUrl(selected._sector)}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-[10px] font-bold"
                          style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.15), rgba(16,185,129,0.1))", border: "1px solid rgba(124,58,237,0.2)", color: "#c4b5fd" }}>
                          <ExternalLink className="w-3 h-3" /> {sectorFeats.cta}
                        </a>
                        <button onClick={() => {
                          const url = previewMatch?.demoSlug ? `/r/${previewMatch.demoSlug}` : getDemoSiteUrl(selected._sector);
                          navigator.clipboard.writeText(`${window.location.origin}${url}`);
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

              {/* ═══ CUSTOM PREVIEW ATTACHED (manuale dalla galleria) ═══ */}
              {customPreview && (
                <motion.div
                  initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }}
                  className="p-2.5 rounded-xl flex items-center gap-3"
                  style={{ background: "linear-gradient(135deg, rgba(167,139,250,0.08), rgba(20,184,166,0.05))", border: "1px solid rgba(167,139,250,0.25)" }}
                >
                  <img src={customPreview.imageUrl} alt={customPreview.brandName} className="w-12 h-16 object-cover object-top rounded-lg shrink-0" style={{ border: "1px solid rgba(255,255,255,0.1)" }} />
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold text-white truncate flex items-center gap-1">
                      <Layers className="w-3 h-3" style={{ color: "#a78bfa" }} />
                      Preview allegata: <span style={{ color: "#c4b5fd" }}>{customPreview.brandName}</span>
                    </p>
                    <p className="text-[9px] text-white/50 truncate">
                      {customPreview.sectorLabel} · stile {customPreview.styleName}
                    </p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <button
                        onClick={() => {
                          const append = `\n\n📱 Guarda la preview ${customPreview.brandName} — ${customPreview.styleName}:\n${customPreview.demoLink}\n🖼️ Mockup: ${customPreview.imageUrl}`;
                          setGeneratedMessage((prev) => (prev ? prev + append : `Ciao, ho preparato una preview per te:${append}`));
                          toast.success("Preview aggiunta al messaggio");
                        }}
                        className="text-[8px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                        style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.3)", color: "#34d399" }}
                      >
                        <Send className="w-2.5 h-2.5" /> Allega al messaggio
                      </button>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${customPreview.demoLink}\n${customPreview.imageUrl}`);
                          toast.success("Link + immagine copiati");
                        }}
                        className="text-[8px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1"
                        style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.25)", color: "#c4b5fd" }}
                      >
                        <Copy className="w-2.5 h-2.5" /> Copia
                      </button>
                      <button
                        onClick={() => setCustomPreview(null)}
                        className="text-[8px] font-bold px-2 py-0.5 rounded-md"
                        style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.2)", color: "#f87171" }}
                      >
                        Rimuovi
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

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
                    const fallbackLines = generatedMessage.split("\n");
                    const fallbackSubjectLine = fallbackLines.find(l => l.toLowerCase().startsWith("oggetto:"));
                    const fallbackSubject = fallbackSubjectLine?.replace(/^oggetto:\s*/i, "").trim() || "Proposta Empire AI";
                    const subject = auroraEmailPreview?.subject || fallbackSubject;
                    const templateLabel = auroraEmailPreview ? auroraTemplateName : "Plain Text";

                    return (
                      <div className="rounded-2xl overflow-hidden" style={{ background: "#fff" }}>
                        <div className="px-4 py-3" style={{ borderBottom: "1px solid #e5e7eb" }}>
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-[10px] font-bold" style={{ background: "linear-gradient(135deg, #7c3aed, #3b82f6)", color: "#fff" }}>EA</div>
                            <div className="min-w-0">
                              <p className="text-[11px] font-semibold" style={{ color: "#111827" }}>Empire AI Group</p>
                              <p className="text-[8px]" style={{ color: "#6b7280" }}>info@empireaigroup.com · {templateLabel}</p>
                            </div>
                          </div>
                          <p className="text-xs font-bold" style={{ color: "#111827" }}>{subject}</p>
                          <p className="text-[9px]" style={{ color: "#9ca3af" }}>
                            A: {selected.email || selected.name.toLowerCase().replace(/\s+/g, "") + "@email.com"}
                          </p>
                        </div>
                        {auroraEmailPreview ? (
                          <div className="bg-[#f5f3ff] p-2 flex justify-center">
                            <div className="w-full max-w-[560px] rounded-xl overflow-hidden shadow-sm" style={{ background: "#ffffff", border: "1px solid #e5e7eb" }}>
                              <iframe
                                title="aurora-email-inline-preview"
                                srcDoc={auroraEmailPreview.html}
                                className="w-full"
                                style={{ height: 420, border: "none" }}
                              />
                            </div>
                          </div>
                        ) : (
                          <div className="px-4 py-3">
                            <div className="text-[11px] leading-relaxed whitespace-pre-line" style={{ color: "#374151" }}>
                              {fallbackLines.filter(l => !l.toLowerCase().startsWith("oggetto:")).join("\n").trim()}
                            </div>
                          </div>
                        )}
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
                        href={`mailto:${selected.email || ""}?subject=${encodeURIComponent(auroraEmailPreview?.subject || generatedMessage.split("\n").find(l => l.toLowerCase().startsWith("oggetto:"))?.replace(/^oggetto:\s*/i, "") || "Proposta Empire AI")}&body=${encodeURIComponent(auroraEmailPreview?.text || generatedMessage)}`}
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

          {/* Quick start — real, ordered, professional suggestions */}
          <QuickSearchSuggestions
            currentSector={sector}
            currentSpecialization={selectedSpecialization}
            onPick={(s) => {
              if (s.specializationQuery && s.specializationLabel) {
                setSelectedSpecialization({ label: s.specializationLabel, query: s.specializationQuery });
              } else {
                setSelectedSpecialization(null);
              }
              pendingQuickSearch.current = { city: s.city, sector: s.sector };
              setCity(s.city);
              setSector(s.sector);
            }}
          />

          {/* ═══ MANUAL MODE — Sector-targeted preview & message generation ═══ */}
          <div className="mt-8 max-w-md mx-auto">
            <div className="flex items-center gap-2 mb-3">
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)" }} />
              <p className="text-[9px] font-bold uppercase tracking-widest" style={{ color: "#a78bfa" }}>oppure</p>
              <div className="flex-1 h-px" style={{ background: "linear-gradient(90deg, transparent, rgba(167,139,250,0.3), transparent)" }} />
            </div>

            <div className="rounded-2xl p-4 space-y-3 text-left" style={{ background: "linear-gradient(135deg, rgba(124,58,237,0.08), rgba(20,184,166,0.04))", border: "1px solid rgba(124,58,237,0.2)" }}>
              {/* Header con score live */}
              <div className="flex items-start gap-2.5">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: "rgba(167,139,250,0.15)", border: "1px solid rgba(167,139,250,0.3)" }}>
                  <Wand2 className="w-4 h-4" style={{ color: "#a78bfa" }} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-bold text-white">🎯 Modalità Manuale PRO</p>
                    {manualName.trim() && (
                      <motion.div
                        initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                        className="flex items-center gap-1 px-2 py-0.5 rounded-full"
                        style={{
                          background: manualLiveScore >= 75 ? "rgba(34,197,94,0.15)" : manualLiveScore >= 50 ? "rgba(245,158,11,0.15)" : "rgba(107,114,128,0.15)",
                          border: `1px solid ${manualLiveScore >= 75 ? "rgba(34,197,94,0.4)" : manualLiveScore >= 50 ? "rgba(245,158,11,0.4)" : "rgba(107,114,128,0.3)"}`,
                        }}
                      >
                        <Target className="w-2.5 h-2.5" style={{ color: manualLiveScore >= 75 ? "#22c55e" : manualLiveScore >= 50 ? "#f59e0b" : "#9ca3af" }} />
                        <span className="text-[9px] font-black" style={{ color: manualLiveScore >= 75 ? "#22c55e" : manualLiveScore >= 50 ? "#f59e0b" : "#9ca3af" }}>
                          Score {manualLiveScore}/100
                        </span>
                      </motion.div>
                    )}
                  </div>
                  <p className="text-[10px] mt-0.5" style={{ color: "#9ca3af" }}>
                    Inserisci i dati di un'attività reale → <span className="text-white font-semibold">arricchimento automatico</span>, audit tecnico profondo, preview personalizzata e messaggio AI ad alta conversione.
                  </p>
                </div>
              </div>

              {/* Sector picker — visual chips */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>1️⃣ Settore (auto-rilevato dal nome)</p>
                  {!manualSectorTouched && manualName.trim() && (
                    <span className="text-[8px] font-bold flex items-center gap-1" style={{ color: "#14b8a6" }}>
                      <Zap className="w-2.5 h-2.5" /> Auto-detect attivo
                    </span>
                  )}
                </div>
                <select
                  value={manualSector}
                  onChange={e => { setManualSector(e.target.value); setManualSectorTouched(true); }}
                  className="w-full px-3 py-2.5 rounded-xl text-[11px] text-white outline-none cursor-pointer mb-2"
                  style={inputStyle}
                >
                  {SECTOR_OPTIONS.map(s => (
                    <option key={s.value} value={s.value} style={{ background: "#1a1a2e" }}>{s.label}</option>
                  ))}
                </select>

                {/* Live preview thumbs of sector mockups */}
                {(() => {
                  const screens = getPreviewScreens(manualSector);
                  if (screens.length === 0) {
                    return (
                      <div className="rounded-lg p-2 text-center" style={{ background: "rgba(255,255,255,0.02)", border: "1px dashed rgba(255,255,255,0.08)" }}>
                        <p className="text-[9px]" style={{ color: "#6b7280" }}>Preview generata al momento dell'analisi</p>
                      </div>
                    );
                  }
                  const portfolioName = PORTFOLIO_REFS[manualSector] || "Demo professionale";
                  return (
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "#a78bfa" }}>
                          ✨ Preview per {INDUSTRY_CONFIGS[manualSector as keyof typeof INDUSTRY_CONFIGS]?.label || manualSector}
                        </p>
                        <button
                          onClick={() => setShowPicker(true)}
                          className="text-[8px] font-bold flex items-center gap-1 px-1.5 py-0.5 rounded"
                          style={{ background: "rgba(20,184,166,0.1)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.3)" }}
                        >
                          <Layers className="w-2.5 h-2.5" /> Cambia mockup
                        </button>
                      </div>
                      <div className="grid grid-cols-4 gap-1.5">
                        {screens.slice(0, 4).map((src, i) => (
                          <motion.div
                            key={`${manualSector}-prev-${i}`}
                            initial={{ opacity: 0, y: 4 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            className="relative aspect-[9/16] rounded-md overflow-hidden"
                            style={{ background: "rgba(0,0,0,0.4)", border: "1px solid rgba(167,139,250,0.2)" }}
                          >
                            <img src={src} alt={`Preview ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                            <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 60%, rgba(0,0,0,0.5))" }} />
                            <span className="absolute bottom-0.5 left-0.5 text-[7px] font-bold text-white/90">{i + 1}</span>
                          </motion.div>
                        ))}
                      </div>
                      <p className="text-[8px] mt-1" style={{ color: "#6b7280" }}>Ref portfolio reale: <span className="font-bold" style={{ color: "#a78bfa" }}>{portfolioName}</span></p>
                      {/* Sector value props */}
                      {(() => {
                        const sf = getPreviewDetailsForMatch(matchPreviewFromManualSelection({
                          sectorId: manualSector,
                          brandName: portfolioName,
                        }) || matchPreviewForLead({ sector: manualSector, name: portfolioName }));
                        return (
                          <div className="mt-2 grid grid-cols-2 gap-1">
                            {sf.features.slice(0, 4).map((f, i) => (
                              <div key={i} className="flex items-center gap-1 text-[8px]" style={{ color: "#9ca3af" }}>
                                <CheckCircle className="w-2.5 h-2.5 shrink-0" style={{ color: "#14b8a6" }} />
                                <span className="truncate">{f}</span>
                              </div>
                            ))}
                          </div>
                        );
                      })()}
                    </div>
                  );
                })()}
              </div>

              {/* Inputs */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>2️⃣ Dati attività</p>
                  <button
                    onClick={enrichManualLead}
                    disabled={manualEnriching || !manualName.trim() || !manualCity.trim()}
                    className="text-[9px] font-bold flex items-center gap-1 px-2 py-0.5 rounded transition-all disabled:opacity-40"
                    style={{ background: "rgba(20,184,166,0.12)", color: "#14b8a6", border: "1px solid rgba(20,184,166,0.3)" }}
                  >
                    {manualEnriching ? <><Loader2 className="w-2.5 h-2.5 animate-spin" /> Cerco...</> : <><Zap className="w-2.5 h-2.5" /> Arricchisci dati</>}
                  </button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="col-span-2 relative">
                    <input
                      value={manualName}
                      onChange={e => setManualName(e.target.value)}
                      placeholder="Nome attività * (es. Ristorante Da Mario)"
                      className="w-full px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none"
                      style={inputStyle}
                    />
                    {manualName.trim().length > 0 && manualName.trim().length < 2 && (
                      <span className="absolute right-2 top-1/2 -translate-y-1/2 text-[8px]" style={{ color: "#ef4444" }}>min 2</span>
                    )}
                  </div>
                  <input value={manualCity} onChange={e => setManualCity(e.target.value)} placeholder="Città" className="px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <input value={manualPhone} onChange={e => setManualPhone(e.target.value)} placeholder="Telefono +39..." className="px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                  <div className="relative">
                    <input value={manualWebsite} onChange={e => setManualWebsite(e.target.value)} placeholder="Sito web (opz.)" className="w-full px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                    {manualWebsite.trim() && /\./.test(manualWebsite) && (
                      <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#22c55e" }} />
                    )}
                  </div>
                  <div className="relative">
                    <input value={manualIg} onChange={e => setManualIg(e.target.value)} placeholder="@instagram (opz.)" className="w-full px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none" style={inputStyle} />
                    {manualIg.trim() && (
                      <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3" style={{ color: "#22c55e" }} />
                    )}
                  </div>
                  <input
                    value={manualEmail}
                    onChange={e => setManualEmail(e.target.value)}
                    placeholder="Email (opz.)"
                    className="px-3 py-2 rounded-lg text-[11px] text-white placeholder:text-gray-500 outline-none col-span-2"
                    style={inputStyle}
                  />
                </div>
                {manualEnrichedHint && (
                  <motion.div
                    initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }}
                    className="text-[9px] p-2 rounded-lg"
                    style={{ background: "rgba(20,184,166,0.08)", color: "#5eead4", border: "1px solid rgba(20,184,166,0.2)" }}
                  >
                    {manualEnrichedHint}
                  </motion.div>
                )}
                {/* Quick links — accelera ricerca */}
                {manualName.trim() && manualCity.trim() && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(`${manualName} ${manualCity}`)}`}
                      target="_blank" rel="noreferrer"
                      className="text-[8px] flex items-center gap-1 px-2 py-1 rounded font-bold"
                      style={{ background: "rgba(66,133,244,0.1)", color: "#4285F4", border: "1px solid rgba(66,133,244,0.3)" }}
                    >
                      <MapPin className="w-2.5 h-2.5" /> Google Maps
                    </a>
                    <a
                      href={`https://www.google.com/search?q=${encodeURIComponent(`${manualName} ${manualCity} sito ufficiale`)}`}
                      target="_blank" rel="noreferrer"
                      className="text-[8px] flex items-center gap-1 px-2 py-1 rounded font-bold"
                      style={{ background: "rgba(167,139,250,0.1)", color: "#a78bfa", border: "1px solid rgba(167,139,250,0.3)" }}
                    >
                      <Search className="w-2.5 h-2.5" /> Trova sito
                    </a>
                    <a
                      href={`https://www.instagram.com/explore/tags/${encodeURIComponent(manualName.replace(/\s+/g, "").toLowerCase())}/`}
                      target="_blank" rel="noreferrer"
                      className="text-[8px] flex items-center gap-1 px-2 py-1 rounded font-bold"
                      style={{ background: "rgba(228,64,95,0.1)", color: "#E4405F", border: "1px solid rgba(228,64,95,0.3)" }}
                    >
                      <Instagram className="w-2.5 h-2.5" /> Cerca IG
                    </a>
                  </div>
                )}
              </div>

              {/* Channel + Generate button */}
              <div className="space-y-2">
                <p className="text-[8px] font-bold uppercase tracking-wider" style={{ color: "#6b7280" }}>3️⃣ Canale messaggio AI</p>
                <div className="grid grid-cols-3 gap-1.5">
                  {([
                    { v: "whatsapp", label: "💬 WhatsApp", color: "#25D366", note: "Tasso risposta 45%" },
                    { v: "instagram", label: "📷 Instagram", color: "#E4405F", note: "Best per Beauty/Food" },
                    { v: "email", label: "📧 Email", color: "#3b82f6", note: "Best per B2B" },
                  ] as const).map(c => (
                    <button
                      key={c.v}
                      onClick={() => setActiveChannel(c.v)}
                      className="px-2 py-2 rounded-lg text-[10px] font-bold transition-all flex flex-col items-center gap-0.5"
                      style={{
                        background: activeChannel === c.v ? `${c.color}20` : "rgba(255,255,255,0.03)",
                        border: `1px solid ${activeChannel === c.v ? `${c.color}50` : "rgba(255,255,255,0.06)"}`,
                        color: activeChannel === c.v ? c.color : "#9ca3af",
                      }}
                    >
                      <span>{c.label}</span>
                      <span className="text-[7px] font-normal opacity-80">{c.note}</span>
                    </button>
                  ))}
                </div>

                <motion.button
                  whileTap={{ scale: 0.97 }}
                  whileHover={{ scale: 1.01 }}
                  onClick={launchManualAnalysis}
                  disabled={!manualName.trim()}
                  className="w-full py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #7c3aed, #a78bfa)", color: "#fff", boxShadow: "0 4px 20px rgba(124,58,237,0.3)" }}
                >
                  <Sparkles className="w-4 h-4" />
                  Avvia Analisi Profonda + Demo + Messaggio AI
                </motion.button>

                {/* Pro tips */}
                <div className="rounded-lg p-2 mt-1" style={{ background: "rgba(245,158,11,0.06)", border: "1px solid rgba(245,158,11,0.2)" }}>
                  <p className="text-[8px] font-bold uppercase tracking-wider mb-1" style={{ color: "#f59e0b" }}>💡 Tips PRO per chiudere</p>
                  <ul className="space-y-0.5 text-[8px]" style={{ color: "#d1d5db" }}>
                    <li>• Score &gt; 75 = lead caldo, contatta subito (entro 1h)</li>
                    <li>• Manda preview + audit tecnico SEMPRE col messaggio</li>
                    <li>• Follow-up dopo 48h se non rispondono — tasso chiusura 3x</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>{/* close z-10 */}

    {/* ═══ CRM Venditore — persistent pipeline overlay ═══ */}
    <SellerCRM
      open={crmOpen}
      onClose={() => setCrmOpen(false)}
      leads={pipeline.leads}
      loading={pipeline.loading}
      onUpdateStage={pipeline.updateStage}
      onAddInteraction={pipeline.addInteraction}
      onScheduleFollowup={pipeline.scheduleFollowup}
      onUpdateNotes={pipeline.updateNotes}
      onUpdateValue={pipeline.updateValue}
      onDeleteLead={pipeline.deleteLead}
    />

    {/* ═══ Speed Dial List — tutti i nomi con call/wa/email diretti ═══ */}
    <SpeedDialList
      open={speedDialOpen}
      onClose={() => setSpeedDialOpen(false)}
      leads={results}
      onSelectLead={(l) => { setSpeedDialOpen(false); handleSelect(l as any); }}
    />
    </div>
  );
}

/* ─── Stat compatta usata nelle anteprime rapide della lista lead ─── */
function QuickStat({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className="rounded-md px-2 py-1.5" style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)" }}>
      <div className="text-[8px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-[10px] text-foreground truncate ${mono ? "font-mono" : "font-semibold"}`}>{value}</div>
    </div>
  );
}
