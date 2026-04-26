import { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Smartphone, Wand2, Crown, Zap, Copy, ExternalLink, User, Pencil, Palette, Eye, Sliders, Droplets, RefreshCw, Type, Lock, Unlock, Cloud, CloudOff, BookmarkCheck, FolderOpen, CheckCircle2, Circle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MockupSuiteViewer, type SuiteScreen } from "./MockupSuiteViewer";
import { MockupReactScreen, type ColorStyle } from "./MockupReactScreen";
import { MockupLookPresets, type MockupLookPreset } from "./MockupLookPresets";
import { MockupPresetSelector } from "./MockupPresetSelector";
import { PresetThemeScope } from "./PresetThemeScope";
import { getStylePreset } from "@/lib/mockup-style-presets";
import { useBrandingKitSettings } from "@/hooks/useBrandingKitSettings";
import { BrandContrastCheck } from "./BrandContrastCheck";
import { buildPublicMockupUrl } from "@/lib/public-share-url";

export type MockupEngine = "react" | "nano_banana" | "nano_banana_pro";
export type ScreenType =
  | "home" | "menu" | "booking" | "profile" | "gallery" | "checkout"
  | "catalog" | "listing" | "dashboard" | "chat" | "map" | "stats";

interface Props {
  businessName?: string;
  businessSector?: string;
  businessCity?: string;
  primaryColor?: string;
  templateVariant?: string;
  leadId?: string;
  previewId?: string;
  /** Logo brand del lead (URL pubblico) — usato come reference image dall'AI */
  brandLogoUrl?: string;
  /** Foto reali del lead (URL pubblici) — usate come reference per AI mockup */
  brandPhotos?: string[];
  /** Report deep-analysis con weak points / pitch / settore — usato per personalizzare i contenuti */
  deepReportSummary?: any;
  /** Quando true e businessName è valorizzato, lancia automaticamente handleGenerate al mount. */
  autoStart?: boolean;
  /** Quando true, dopo che i 4 mockup AI sono completati lancia automaticamente
   *  handleBuildFullSite per generare il sito webapp 1:1 col mockup scelto. */
  autoBuildSite?: boolean;
  /** Dati estesi del lead per generazione sito completo (generate-demo-from-lead) */
  leadFullData?: {
    phone?: string;
    email?: string;
    website?: string;
    fullAddress?: string;
    instagram?: string;
    facebook?: string;
    googleRating?: number | null;
    googleReviews?: number | null;
    googleMapsUrl?: string;
    openingHours?: any;
    cuisine?: string | null;
    types?: string[];
    specializationLabel?: string | null;
    specializationQuery?: string | null;
    zone?: string;
    sectorId?: string; // es. "food", "ncc", "beauty"
  };
  onGenerated?: (suiteId: string, shareSlug: string) => void;
  /** Callback al termine completo del flusso (mockup + sito 1:1) */
  onSiteBuilt?: (siteData: { previewUrl: string; adminUrl: string; credentials: any }) => void;
}

const ENGINE_OPTIONS: { key: MockupEngine; label: string; cost: number; icon: React.ElementType; desc: string; color: string }[] = [
  { key: "react",           label: "React Render",     cost: 0,  icon: Zap,    desc: "Gratis · template fedeli · veloce",          color: "from-emerald-500 to-teal-600" },
  { key: "nano_banana",     label: "Nano Banana 2",    cost: 20, icon: Wand2,  desc: "AI fotorealistico · qualità premium",        color: "from-amber-500 to-orange-600" },
  { key: "nano_banana_pro", label: "Nano Banana Pro",  cost: 40, icon: Crown,  desc: "AI cinematografico 8K · qualità massima",    color: "from-fuchsia-500 to-purple-700" },
];

const TEMPLATE_VARIANTS = [
  { key: "auto",              label: "Auto (rilevato dal settore)", group: "Smart" },
  // Premium nuovi
  { key: "neon_vibrant",      label: "Neon Vibrant — energia, gaming, eventi", group: "Premium 2026" },
  { key: "editorial_clean",   label: "Editorial Clean — magazine, fashion, lifestyle", group: "Premium 2026" },
  { key: "boutique_pastel",   label: "Boutique Pastel — beauty, kids, wellness", group: "Premium 2026" },
  { key: "monochrome_bold",   label: "Monochrome Bold — agenzie, design, tech", group: "Premium 2026" },
  { key: "glass_aurora",      label: "Glass Aurora — fintech, AI, SaaS", group: "Premium 2026" },
  { key: "real_estate_trust", label: "Real Estate Trust — immobiliare, legale, finanza", group: "Premium 2026" },
  { key: "fitness_energy",    label: "Fitness Energy — palestre, sport, supplements", group: "Premium 2026" },
  // Esistenti
  { key: "paperfish",         label: "Paperfish Sakura — sushi/giapponese", group: "Food" },
  { key: "strapizzami",       label: "Strapizzami — pizzeria/italiano", group: "Food" },
  { key: "casual_warm",       label: "Casual Warm — trattoria/bistrot", group: "Food" },
  { key: "luxury_gold",       label: "Luxury Gold — alta cucina/Michelin", group: "Hospitality" },
  { key: "batey",             label: "Batey Pacifico — mare/lido/yacht", group: "Hospitality" },
  { key: "minimal_zen",       label: "Minimal Zen — spa/wellness", group: "Wellness" },
];

// Palette rapide per swap veloce del colore brand prima della generazione
const QUICK_PALETTES: { label: string; color: string }[] = [
  { label: "Oro Imperiale",  color: "#C8963E" },
  { label: "Oro Champagne",  color: "#D4AF37" },
  { label: "Sakura Pink",    color: "#E89BAE" },
  { label: "Coral Vibrant",  color: "#FF6B5C" },
  { label: "Terracotta",     color: "#C84A2A" },
  { label: "Ocean Azure",    color: "#5CC8D9" },
  { label: "Navy Trust",     color: "#1B2A3A" },
  { label: "Emerald",        color: "#10B981" },
  { label: "Lime Energy",    color: "#C8FF00" },
  { label: "Royal Indigo",   color: "#6366F1" },
  { label: "Magenta Neon",   color: "#FF2E9A" },
  { label: "Bordeaux",       color: "#6B1F2C" },
  { label: "Mono Black",     color: "#0A0A0A" },
  { label: "Pure White",     color: "#FAFAFA" },
];

// ─────────────────────────────────────────────────────────────────────────────
// BRANDING KIT — coppie font heading/body curate (Google Fonts)
// Quando l'utente seleziona un preset, viene applicato live alla preview React
// (override di theme.fontHead/fontBody) e iniettato il <link> Google Fonts.
// ─────────────────────────────────────────────────────────────────────────────
export interface BrandFontPair {
  key: string;
  label: string;
  description: string;
  fontHead: string;          // CSS font-family stack
  fontBody: string;
  googleFontsHref: string;   // URL stylesheet Google Fonts
}
export const BRAND_FONT_PAIRS: BrandFontPair[] = [
  {
    key: "template", label: "Default template", description: "Usa i font del template selezionato",
    fontHead: "", fontBody: "", googleFontsHref: "",
  },
  {
    key: "playfair-inter", label: "Playfair × Inter", description: "Editoriale luxury — magazine, fashion, ristoranti",
    fontHead: "'Playfair Display', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Inter:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "cormorant-inter", label: "Cormorant × Inter", description: "Boutique elegante — sushi, beauty, hotel",
    fontHead: "'Cormorant Garamond', Georgia, serif",
    fontBody: "'Inter', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "space-dm", label: "Space Grotesk × DM Sans", description: "Tech moderno — startup, SaaS, fintech",
    fontHead: "'Space Grotesk', sans-serif",
    fontBody: "'DM Sans', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=DM+Sans:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "syne-jakarta", label: "Syne × Jakarta", description: "Creativo audace — design studio, agenzie",
    fontHead: "'Syne', sans-serif",
    fontBody: "'Plus Jakarta Sans', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Syne:wght@500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "outfit-figtree", label: "Outfit × Figtree", description: "Lifestyle friendly — wellness, food casual",
    fontHead: "'Outfit', sans-serif",
    fontBody: "'Figtree', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Figtree:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "dmserif-worksans", label: "DM Serif × Work Sans", description: "Brand storytelling — premium service",
    fontHead: "'DM Serif Display', serif",
    fontBody: "'Work Sans', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=Work+Sans:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "bebas-barlow", label: "Bebas Neue × Barlow", description: "Sport energy — palestre, eventi",
    fontHead: "'Bebas Neue', Impact, sans-serif",
    fontBody: "'Barlow', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "archivo-hind", label: "Archivo Black × Hind", description: "Bold statement — news, attivismo, monochrome",
    fontHead: "'Archivo Black', Impact, sans-serif",
    fontBody: "'Hind', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Archivo+Black&family=Hind:wght@300;400;500;600;700&display=swap",
  },
  {
    key: "abril-cabin", label: "Abril Fatface × Cabin", description: "Portfolio creativo — fotografi, illustratori",
    fontHead: "'Abril Fatface', serif",
    fontBody: "'Cabin', system-ui, sans-serif",
    googleFontsHref: "https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Cabin:wght@400;500;600;700&display=swap",
  },
];


const SCREEN_TYPES: { key: ScreenType; label: string }[] = [
  { key: "home",      label: "Home" },
  { key: "menu",      label: "Menu / Servizi" },
  { key: "catalog",   label: "Catalogo prodotti" },
  { key: "listing",   label: "Schede / Annunci" },
  { key: "booking",   label: "Prenotazione" },
  { key: "checkout",  label: "Checkout / Pagamento" },
  { key: "profile",   label: "Profilo / Recensioni" },
  { key: "gallery",   label: "Galleria foto" },
  { key: "dashboard", label: "Dashboard utente" },
  { key: "chat",      label: "Chat assistente AI" },
  { key: "map",       label: "Mappa / Punti vendita" },
  { key: "stats",     label: "Statistiche / Loyalty" },
];

// Settori suggeriti (suggerimenti rapidi modalità standalone)
const QUICK_SECTORS = [
  "Ristorante", "Pizzeria", "Sushi Bar", "Caffetteria", "Wine Bar",
  "Spa & Wellness", "Salone Beauty", "Barbershop", "Nail Studio",
  "Hotel Boutique", "B&B", "Lido / Beach Club", "Yacht Charter",
  "Palestra / Fitness", "Studio Yoga", "Crossfit Box",
  "Studio Medico", "Studio Dentistico", "Fisioterapia",
  "Agenzia Immobiliare", "Studio Legale", "Studio Commercialista",
  "Boutique Moda", "E-commerce Fashion", "Concept Store",
  "Tour Operator", "Wedding Planner", "Eventi & Catering",
  "NCC / Transfer", "Autofficina", "Concessionaria",
  "Impresa Edile", "Impianti Termoidraulici", "Falegnameria",
  "Academy / Scuola", "Corsi Online", "Coaching",
];

// Screen pack adattivo per settore (suggerimento intelligente)
function suggestScreensForSector(sector: string): { type: ScreenType; title: string }[] {
  const s = (sector || "").toLowerCase();
  if (/immobil|real ?estate|agenzi/.test(s)) {
    return [
      { type: "home",     title: "Home" },
      { type: "listing",  title: "Annunci" },
      { type: "map",      title: "Mappa zone" },
      { type: "profile",  title: "Agente" },
    ];
  }
  if (/ecommerce|shop|store|fashion|moda|boutique/.test(s)) {
    return [
      { type: "home",     title: "Vetrina" },
      { type: "catalog",  title: "Catalogo" },
      { type: "checkout", title: "Checkout" },
      { type: "profile",  title: "Account" },
    ];
  }
  if (/fitness|palestra|gym|crossfit|yoga/.test(s)) {
    return [
      { type: "home",     title: "Home" },
      { type: "booking",  title: "Prenota lezione" },
      { type: "stats",    title: "Progressi" },
      { type: "profile",  title: "Profilo" },
    ];
  }
  if (/medic|dent|cliniche|fisio/.test(s)) {
    return [
      { type: "home",     title: "Home" },
      { type: "booking",  title: "Appuntamento" },
      { type: "chat",     title: "Chat con clinica" },
      { type: "profile",  title: "Cartella clinica" },
    ];
  }
  if (/avvocat|legal|notai|commercia/.test(s)) {
    return [
      { type: "home",     title: "Home studio" },
      { type: "menu",     title: "Servizi legali" },
      { type: "booking",  title: "Consulenza" },
      { type: "chat",     title: "Pratica AI" },
    ];
  }
  if (/ncc|taxi|transfer|noleggi/.test(s)) {
    return [
      { type: "home",     title: "Prenota corsa" },
      { type: "map",      title: "Tracking auto" },
      { type: "booking",  title: "Tratta + orario" },
      { type: "profile",  title: "Storico viaggi" },
    ];
  }
  if (/hotel|albergh|lido|beach|yacht|b&b|bnb/.test(s)) {
    return [
      { type: "home",     title: "Home" },
      { type: "gallery",  title: "Galleria" },
      { type: "booking",  title: "Prenota" },
      { type: "profile",  title: "Loyalty" },
    ];
  }
  if (/turism|tour|viagg|escursion|event|wedding|cerimoni/.test(s)) {
    return [
      { type: "home",     title: "Esperienze" },
      { type: "catalog",  title: "Tour & pacchetti" },
      { type: "booking",  title: "Prenota data" },
      { type: "profile",  title: "Le tue prenotazioni" },
    ];
  }
  if (/edili|costruz|impresa|impiant|ristruttur|auto|moto|conces/.test(s)) {
    return [
      { type: "home",     title: "Home" },
      { type: "menu",     title: "Servizi" },
      { type: "booking",  title: "Sopralluogo" },
      { type: "gallery",  title: "Lavori fatti" },
    ];
  }
  if (/scuola|academy|corso|format|coach/.test(s)) {
    return [
      { type: "home",      title: "Home" },
      { type: "catalog",   title: "Corsi" },
      { type: "dashboard", title: "Dashboard studente" },
      { type: "profile",   title: "Certificati" },
    ];
  }
  // Default food / generic
  return [
    { type: "home",    title: "Home" },
    { type: "menu",    title: "Menu" },
    { type: "booking", title: "Prenotazione" },
    { type: "profile", title: "Profilo" },
  ];
}

// Auto-detect template per settore
function suggestTemplateForSector(sector: string): string {
  const s = (sector || "").toLowerCase();
  if (/sushi|giappon|nikkei|asiatic/.test(s)) return "paperfish";
  if (/pizz/.test(s)) return "strapizzami";
  if (/spiagg|beach|bagn|stabilim|lido|yacht|charter/.test(s)) return "batey";
  if (/lusso|luxury|gourmet|stellato|michelin|hotel/.test(s)) return "luxury_gold";
  if (/casual|trattor|osteri|bistr/.test(s)) return "casual_warm";
  if (/zen|mindful|yoga|spa|wellness|benesser/.test(s)) return "minimal_zen";
  if (/beauty|estetic|parruc|hair|nail|kids|baby/.test(s)) return "boutique_pastel";
  if (/fitness|palestra|gym|crossfit|sport|supplem/.test(s)) return "fitness_energy";
  if (/immobil|real ?estate|legal|avvocat|notai|commercia|finanz/.test(s)) return "real_estate_trust";
  if (/fintech|saas|ai|tech|startup|software|app/.test(s)) return "glass_aurora";
  if (/fashion|moda|magazine|editor|lifestyle|design|agenzi/.test(s)) return "editorial_clean";
  if (/event|wedding|gaming|nightlife|disco|club/.test(s)) return "neon_vibrant";
  if (/architett|studio|brand/.test(s)) return "monochrome_bold";
  return "modern_dark";
}

export function MockupSuiteGenerator({
  businessName: businessNameProp,
  businessSector: businessSectorProp = "",
  businessCity: businessCityProp = "",
  primaryColor: primaryColorProp = "#C8963E",
  templateVariant: initialTemplate,
  leadId,
  previewId,
  brandLogoUrl,
  brandPhotos,
  deepReportSummary,
  autoStart = false,
  autoBuildSite = false,
  leadFullData,
  onGenerated,
  onSiteBuilt,
}: Props) {
  // Modalità: lead (usa props del lead) | standalone (form libero)
  const isLeadMode = Boolean((businessNameProp || "").trim());
  const [mode, setMode] = useState<"lead" | "standalone">(isLeadMode ? "lead" : "standalone");

  // Override manuale dei dati lead (sblocca i campi per modificarli senza cambiare modalità)
  const [leadOverride, setLeadOverride] = useState(false);

  // Form standalone / override
  const [standalone, setStandalone] = useState({
    name: "",
    sector: "",
    city: "",
    primaryColor: "#C8963E",
  });

  // Sync con props lead
  useEffect(() => {
    if (isLeadMode) setMode("lead");
  }, [isLeadMode, businessNameProp]);

  // Quando attivo l'override in lead mode, pre-compilo lo standalone con i dati del lead
  useEffect(() => {
    if (leadOverride && mode === "lead") {
      setStandalone({
        name: businessNameProp || "",
        sector: businessSectorProp || "",
        city: businessCityProp || "",
        primaryColor: primaryColorProp || "#C8963E",
      });
    }
  }, [leadOverride, mode, businessNameProp, businessSectorProp, businessCityProp, primaryColorProp]);

  // Valori effettivi: standalone se modalità standalone OPPURE se override attivo in lead mode
  const useStandaloneValues = mode === "standalone" || (mode === "lead" && leadOverride);
  const businessName = useStandaloneValues ? standalone.name : (businessNameProp || "");
  const businessSector = useStandaloneValues ? standalone.sector : businessSectorProp;
  const businessCity = useStandaloneValues ? standalone.city : businessCityProp;
  const primaryColor = useStandaloneValues ? standalone.primaryColor : primaryColorProp;

  const [engine, setEngine] = useState<MockupEngine>("react");
  const [templateVariant, setTemplateVariant] = useState<string>(initialTemplate || "auto");
  // Risincronizza il template quando arriva da deep-link / cambio prop esterno
  // (es. il venditore cambia stile dal form della pagina contenitore).
  useEffect(() => {
    if (initialTemplate && initialTemplate !== templateVariant) {
      setTemplateVariant(initialTemplate);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialTemplate]);
  // Personalizzazione avanzata
  const [glassIntensity, setGlassIntensity] = useState<number>(60);
  const [colorStyle, setColorStyle] = useState<ColorStyle>("vivid");
  // Safe Area & Leggibilità — padding interno, scala tipografica, contrasto AA
  const [safeAreaPx, setSafeAreaPx] = useState<number>(8);
  const [typeScale, setTypeScale] = useState<number>(1);
  const [boostContrast, setBoostContrast] = useState<boolean>(true);
  const [autoScreens, setAutoScreens] = useState(true);
  const [screens, setScreens] = useState<{ type: ScreenType; title: string }[]>(
    suggestScreensForSector(businessSector)
  );

  // Branding Kit — coppia font heading/body (override del template) + persistenza cloud+locale
  const branding = useBrandingKitSettings();
  const [brandFontKey, setBrandFontKey] = useState<string>("template");
  const brandFont = useMemo(
    () => BRAND_FONT_PAIRS.find(p => p.key === brandFontKey) || BRAND_FONT_PAIRS[0],
    [brandFontKey]
  );

  // Idratazione iniziale dalle impostazioni salvate (cloud o cache locale)
  // — quando brand_locked=true, sia primaryColor sia font pair hanno priorità sui prop:
  //   il "Branding Kit lock" diventa così l'unica fonte di verità per l'identità visiva
  //   (palette + tipografia restano allineate tra sessioni senza override manuali).
  const hydratedRef = useRef(false);
  useEffect(() => {
    if (branding.loading || hydratedRef.current) return;
    hydratedRef.current = true;
    if (branding.settings.fontPairKey && branding.settings.fontPairKey !== brandFontKey) {
      setBrandFontKey(branding.settings.fontPairKey);
    }
    if (branding.settings.brandLocked && branding.settings.primaryColor) {
      setStandalone(s => ({ ...s, primaryColor: branding.settings.primaryColor! }));
    }
  }, [branding.loading, branding.settings, brandFontKey]);

  // Inietta dinamicamente il <link> Google Fonts del brand selezionato
  useEffect(() => {
    if (!brandFont.googleFontsHref) return;
    const id = `brand-font-${brandFont.key}`;
    if (document.getElementById(id)) return;
    const link = document.createElement("link");
    link.id = id;
    link.rel = "stylesheet";
    link.href = brandFont.googleFontsHref;
    document.head.appendChild(link);
    // Nessun cleanup: i font restano caricati per le preview successive
  }, [brandFont]);

  // ─────────────────────────────────────────────────────────────────────────
  // Sync Branding Kit ↔ stato live — gated dal lock per palette E tipografia
  // ─────────────────────────────────────────────────────────────────────────
  // Quando il brand è BLOCCATO, qualsiasi cambio di colore o di font pair viene
  // persistito (cloud + cache locale): il lock dichiara "questa è la mia brand
  // identity, mantienila tra sessioni e dispositivi". Palette e tipografia
  // restano sempre allineate al template scelto senza richiedere override manuali.
  // Quando è SBLOCCATO, le scelte restano effimere (template-driven) e non
  // sovrascrivono l'identità salvata, così l'utente può sperimentare senza
  // perdere il preset bloccato.
  useEffect(() => {
    if (branding.loading || !hydratedRef.current) return;
    if (!branding.settings.brandLocked) return;

    const currentColor = mode === "standalone" ? standalone.primaryColor : primaryColor;
    const colorChanged = !!currentColor && currentColor !== branding.settings.primaryColor;
    const fontChanged = brandFontKey !== branding.settings.fontPairKey;

    if (!colorChanged && !fontChanged) return;

    branding.update({
      ...(colorChanged ? { primaryColor: currentColor } : {}),
      ...(fontChanged
        ? {
            fontPairKey: brandFontKey,
            fontHead: brandFont.fontHead || null,
            fontBody: brandFont.fontBody || null,
            googleFontsHref: brandFont.googleFontsHref || null,
          }
        : {}),
    });
  }, [
    standalone.primaryColor,
    primaryColor,
    mode,
    brandFontKey,
    brandFont,
    branding,
  ]);


  // Quando cambia il settore e autoScreens=on, aggiorna screens automaticamente
  useEffect(() => {
    if (autoScreens) {
      setScreens(suggestScreensForSector(businessSector));
    }
  }, [businessSector, autoScreens]);

  const detectedTemplateLabel = useMemo(() => {
    if (templateVariant !== "auto") return null;
    const detected = suggestTemplateForSector(businessSector);
    return TEMPLATE_VARIANTS.find(t => t.key === detected)?.label || detected;
  }, [templateVariant, businessSector]);

  const [generating, setGenerating] = useState(false);
  // Stato per preview progressiva: "preview" = mostra subito React render, "upgrading" = AI in arrivo, "complete" = finita
  const [previewPhase, setPreviewPhase] = useState<"idle" | "preview" | "upgrading" | "complete">("idle");
  const [result, setResult] = useState<{
    suite_id: string;
    share_slug: string;
    template_variant: string;
    engine: MockupEngine;
    screens: SuiteScreen[];
  } | null>(null);

  // ─── Generazione SITO COMPLETO 1:1 ─── (chiama generate-demo-from-lead con
  // tutti i dati lead + template scelto → restituisce previewUrl, adminUrl, credenziali)
  const [siteBuilding, setSiteBuilding] = useState(false);
  const [siteResult, setSiteResult] = useState<any>(null);

  const handleBuildFullSite = async () => {
    if (!businessName?.trim() || !businessSector?.trim()) {
      toast.error("Servono nome attività e settore per generare il sito completo");
      return;
    }
    if (siteBuilding) return;
    setSiteBuilding(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        toast.error("Devi essere loggato");
        setSiteBuilding(false);
        return;
      }
      const resolvedTemplate = result?.template_variant
        || (templateVariant === "auto" ? suggestTemplateForSector(businessSector) : templateVariant);

      const sectorId = leadFullData?.sectorId
        || (businessSector || "").toLowerCase().trim();

      toast.loading("🏗️ Costruisco sito + admin completo (30-60s)…", { id: "build-site" });

      const { data, error } = await supabase.functions.invoke("generate-demo-from-lead", {
        body: {
          lead: {
            businessName,
            sector: sectorId,
            sectorLabel: businessSector,
            city: businessCity || "",
            zone: leadFullData?.zone || "",
            fullAddress: leadFullData?.fullAddress || "",
            phone: leadFullData?.phone || "",
            email: leadFullData?.email || "",
            website: leadFullData?.website || "",
            instagram: leadFullData?.instagram || "",
            facebook: leadFullData?.facebook || "",
            googleRating: leadFullData?.googleRating || null,
            googleReviews: leadFullData?.googleReviews || null,
            googleMapsUrl: leadFullData?.googleMapsUrl || "",
            openingHours: leadFullData?.openingHours || null,
            cuisine: leadFullData?.cuisine || null,
            types: leadFullData?.types || [],
            specializationLabel: leadFullData?.specializationLabel || null,
            specializationQuery: leadFullData?.specializationQuery || null,
          },
          preview: {
            brandName: businessName,
            styleName: resolvedTemplate,
            imageUrl: result?.screens?.[0]?.image_url || brandLogoUrl || null,
            sectorId,
            templateVariant: resolvedTemplate,
            screens: result?.screens?.map(s => s.image_url).filter(Boolean) || [],
          },
          partnerId: user.id,
          leadId: leadId || null,
          originUrl: window.location.origin,
          // Asset reali estratti dal lead per personalizzazione 1:1
          intelligence: {
            logo: brandLogoUrl || null,
            photos: brandPhotos || [],
            deepReport: deepReportSummary || null,
          },
        },
      });

      toast.dismiss("build-site");

      const errBody: any = (error as any)?.context?.body || data;
      if (errBody?.error === "lead_data_insufficient") {
        toast.error("⚠️ Lead con dati insufficienti", {
          description: (errBody.issues || []).join(" · ") || "Arricchisci il lead prima di generare il sito",
        });
        return;
      }

      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || "Generazione sito fallita");
      }

      setSiteResult(data);
      toast.success("✅ Sito + admin generati!", {
        description: `${data.previewUrl} · login: ${data.credentials?.email || "—"}`,
        duration: 10000,
      });
      onSiteBuilt?.({
        previewUrl: data.previewUrl,
        adminUrl: data.adminUrl,
        credentials: data.credentials,
      });
    } catch (e: any) {
      toast.dismiss("build-site");
      toast.error(e?.message || "Errore generazione sito");
    } finally {
      setSiteBuilding(false);
    }
  };

  // Guard sincrono contro doppi click ravvicinati (setGenerating è async, non protegge il primo frame)
  const inFlightRef = useRef(false);
  // Lock cross-reload: se la stessa combo lead+template è già in generazione in un'altra tab/reload,
  // blocchiamo per ~2 minuti (TTL). Usiamo sessionStorage così il lock muore con la sessione del browser.
  const buildLockKey = () => `mockup_gen_lock::${leadId || "no-lead"}::${previewId || "no-preview"}::${businessName?.trim().toLowerCase() || ""}::${templateVariant}::${engine}`;
  const LOCK_TTL_MS = 2 * 60 * 1000;

  const handleGenerate = async () => {
    if (!businessName?.trim()) {
      toast.error("Inserisci il nome dell'attività");
      return;
    }
    if (!businessSector?.trim()) {
      toast.error("Inserisci il settore o argomento");
      return;
    }
    // 1) Guard in-memory: blocca click multipli nella stessa istanza
    if (inFlightRef.current || generating) {
      toast.info("⏳ Generazione in corso…", { description: "Attendi il completamento prima di rilanciare." });
      return;
    }
    // 2) Guard cross-reload via sessionStorage
    try {
      const key = buildLockKey();
      const raw = sessionStorage.getItem(key);
      if (raw) {
        const ts = parseInt(raw, 10);
        if (!Number.isNaN(ts) && Date.now() - ts < LOCK_TTL_MS) {
          toast.info("⏳ Generazione già in corso", {
            description: "Una generazione per questo lead è partita pochi secondi fa. Attendi il completamento.",
          });
          return;
        }
      }
      sessionStorage.setItem(key, String(Date.now()));
    } catch { /* sessionStorage non disponibile, ignoriamo */ }

    inFlightRef.current = true;
    setGenerating(true);
    setResult(null);
    setPreviewPhase("idle");
    try {
      // Nuovo seed ad ogni click → garantisce che le 4 schermate siano sempre diverse
      // tra loro e che run successivi sullo stesso lead/template producano varianti nuove.
      const variationSeed = Math.floor(Math.random() * 1_000_000);
      const resolvedTemplate = templateVariant === "auto" ? suggestTemplateForSector(businessSector) : templateVariant;

      // ═══════════════════════════════════════════════════════════════════════
      // FASE 1 — PREVIEW PROGRESSIVA ISTANTANEA
      // Per gli engine AI (che richiedono 10-30s), mostriamo SUBITO le 4 schermate
      // renderizzate via React (centrate, fedeli al template, gratis lato client).
      // L'utente vede l'anteprima entro 200ms invece di aspettare 30 secondi.
      // ═══════════════════════════════════════════════════════════════════════
      const isAIEngine = engine === "nano_banana" || engine === "nano_banana_pro";
      if (isAIEngine) {
        const previewScreens: SuiteScreen[] = screens.map((s, i) => ({
          type: s.type,
          title: s.title,
          image_url: null,
          render_mode: "react" as const,
          template_variant: resolvedTemplate,
          variation_seed: variationSeed,
          variant_index: i,
          // Flag per il viewer: preview temporanea, in attesa di upgrade AI
          is_preview: true,
        } as any));
        setResult({
          suite_id: "preview-pending",
          share_slug: "",
          template_variant: resolvedTemplate,
          engine,
          screens: previewScreens,
        });
        setPreviewPhase("preview");
        toast.info("Anteprima istantanea pronta · upgrade AI in arrivo…", { duration: 3000 });
      }

      const payload = {
        business_name: businessName,
        business_sector: businessSector,
        business_city: businessCity,
        primary_color: primaryColor,
        engine,
        template_variant: templateVariant === "auto" ? undefined : templateVariant,
        lead_id: leadId,
        preview_id: previewId,
        screens,
        variation_seed: variationSeed,
        // Personalizzazione UI propagata anche all'edge (per AI prompt) e persistita nei screens
        glass_intensity: glassIntensity,
        color_style: colorStyle,
        // Safe-area & leggibilità (vengono letti dall'edge per costruire il prompt AI)
        safe_area_px: safeAreaPx,
        type_scale: typeScale,
        boost_contrast: boostContrast,
        // Brand asset reali del lead (logo + foto) — usati come reference image per AI
        brand_logo_url: brandLogoUrl || undefined,
        brand_photos: Array.isArray(brandPhotos) && brandPhotos.length > 0 ? brandPhotos.slice(0, 4) : undefined,
        // Deep analysis del lead (weak points, settore, pitch) per personalizzare i contenuti
        deep_report: deepReportSummary || undefined,
      };

      if (isAIEngine) setPreviewPhase("upgrading");

      const { data, error } = await supabase.functions.invoke("lead-mockup-suite", { body: payload });
      if (error) throw error;
      let d = data as any;
      if (!d?.success) {
        if (d?.error === "insufficient_credits") {
          toast.error(`Crediti insufficienti per ${ENGINE_OPTIONS.find(e => e.key === engine)?.label}`);
        } else if (d?.error === "ai_rate_limited") {
          toast.error("AI temporaneamente sovraccarica. Riprova tra qualche secondo o usa modalità React (gratis).");
        } else {
          toast.error(`Errore: ${d?.error || "sconosciuto"}`);
        }
        if (isAIEngine) {
          toast.warning("Mostro l'anteprima React come fallback. Riprova per generare la versione AI 4K/8K.");
        } else {
          setResult(null);
          setPreviewPhase("idle");
        }
        return;
      }

      // ═══════════════════════════════════════════════════════════════════════
      // ASYNC POLLING — quando l'engine è AI, l'edge function ritorna subito
      // (async:true) e processa in background. Polliamo seller_mockup_suites
      // finché status diventa "complete"/"error".
      // ═══════════════════════════════════════════════════════════════════════
      if (d?.async && d?.suite_id && isAIEngine) {
        toast.info("Generazione AI avviata · attendi 1-3 minuti…", { duration: 4000 });
        const suiteId = d.suite_id as string;
        const maxPollMs = 5 * 60 * 1000;
        const intervalMs = 4000;
        const startedAt = Date.now();
        let polled: any = null;
        while (Date.now() - startedAt < maxPollMs) {
          await new Promise(r => setTimeout(r, intervalMs));
          const { data: row } = await supabase
            .from("seller_mockup_suites")
            .select("id, status, screens, share_slug, engine, template_variant, error_message")
            .eq("id", suiteId)
            .maybeSingle();
          if (!row) continue;
          if (row.status === "complete" || row.status === "complete_with_warnings") {
            polled = row;
            break;
          }
          if (row.status === "error") {
            toast.error(`Errore generazione AI: ${row.error_message || "sconosciuto"}`);
            toast.warning("Anteprima React mantenuta come fallback.");
            setPreviewPhase("complete");
            return;
          }
        }
        if (!polled) {
          toast.error("Generazione AI in timeout. Riprova o usa modalità React.");
          setPreviewPhase("complete");
          return;
        }
        const polledScreens = (polled.screens as any[]) || [];
        d = {
          success: true,
          suite_id: polled.id,
          share_slug: polled.share_slug,
          engine: polled.engine,
          template_variant: polled.template_variant,
          screens: polledScreens,
          credits_spent: d.credits_spent,
          variation_seed: variationSeed,
          validation_summary: polled.status === "complete_with_warnings"
            ? {
                all_validated: false,
                per_screen: polledScreens.map((s: any) => ({
                  type: s.type,
                  validated: s.validation?.validated,
                  attempts: s.validation?.attempts,
                  issues: s.validation?.issues,
                })),
                total_attempts: polledScreens.reduce((acc: number, s: any) => acc + (s.validation?.attempts || 0), 0),
              }
            : { all_validated: true, per_screen: [], total_attempts: 0 },
        };
      }

      // ═══════════════════════════════════════════════════════════════════════
      // FASE 2 — UPGRADE PROGRESSIVO 4K/8K
      // Sostituisco screen-by-screen con un piccolo delay di stagger (250ms)
      // per ottenere un effetto fade-in "a cascata" più premium.
      // ═══════════════════════════════════════════════════════════════════════
      const enrichedScreens: SuiteScreen[] = (d.screens || []).map((s: any, i: number) => ({
        ...s,
        variation_seed: s.variation_seed ?? d.variation_seed ?? variationSeed,
        variant_index: s.variant_index ?? i,
        is_preview: false,
      }));

      if (isAIEngine && enrichedScreens.some(s => s.render_mode === "ai" && s.image_url)) {
        // Swap progressivo screen-by-screen
        for (let i = 0; i < enrichedScreens.length; i++) {
          await new Promise(r => setTimeout(r, 250));
          setResult(prev => {
            if (!prev) return prev;
            const updated = [...prev.screens];
            updated[i] = enrichedScreens[i];
            return {
              ...prev,
              suite_id: d.suite_id,
              share_slug: d.share_slug,
              template_variant: d.template_variant,
              engine: d.engine,
              screens: updated,
            };
          });
        }
      } else {
        setResult({
          suite_id: d.suite_id,
          share_slug: d.share_slug,
          template_variant: d.template_variant,
          engine: d.engine,
          screens: enrichedScreens,
        });
      }
      setPreviewPhase("complete");

      // Validation feedback (engine AI)
      const vs = d.validation_summary;
      if (vs && vs.all_validated === false) {
        const failed = (vs.per_screen || []).filter((p: any) => !p.validated);
        toast.warning(
          `Suite generata, ma ${failed.length}/${vs.per_screen.length} schermate non superano la validazione automatica (branding/inglese/centratura). Tentativi totali: ${vs.total_attempts}. Puoi rigenerare per tentare di nuovo.`,
          { duration: 8000 }
        );
      } else if (vs?.all_validated) {
        toast.success(`Suite generata e validata! ${d.credits_spent} crediti usati · ${vs.total_attempts} tentativi totali.`);
      } else {
        toast.success(`Suite generata! ${d.credits_spent} crediti usati.`);
      }
      onGenerated?.(d.suite_id, d.share_slug);

      // ─── AUTO-BUILD SITO 1:1 ─── se richiesto, dopo i 4 mockup AI completati
      // lancio automaticamente la generazione del sito webapp con quegli stessi mockup
      // come reference visiva (template + screens). Così "Genera nuova preview"
      // produce in un colpo solo: 4 mockup iPhone + sito + admin + credenziali.
      if (autoBuildSite && d.suite_id && d.suite_id !== "preview-pending") {
        setTimeout(() => {
          handleBuildFullSite();
        }, 600);
      }
    } catch (e: any) {
      toast.error(e.message || "Errore generazione");
      setPreviewPhase("idle");
    } finally {
      setGenerating(false);
      inFlightRef.current = false;
      try { sessionStorage.removeItem(buildLockKey()); } catch { /* noop */ }
    }
  };

  // ─── AUTO-START ─── quando arrivo dalla pagina Leads con ?autostart=1
  // e il MockupSuiteGenerator riceve businessName/sector valorizzati,
  // lancio automaticamente handleGenerate una volta sola.
  const autoStartFiredRef = useRef(false);
  useEffect(() => {
    if (!autoStart) return;
    if (autoStartFiredRef.current) return;
    if (!businessName?.trim() || !businessSector?.trim()) return;
    if (generating) return;
    autoStartFiredRef.current = true;
    const t = setTimeout(() => {
      handleGenerate();
    }, 400);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoStart, businessName, businessSector]);

  const copyShareLink = () => {
    if (!result?.share_slug) return;
    const url = buildPublicMockupUrl(result.share_slug);
    navigator.clipboard.writeText(url);
    toast.success("Link copiato negli appunti");
  };

  const selectedEngineCfg = ENGINE_OPTIONS.find(e => e.key === engine)!;

  // ──────────────────────────────────────────────────────────────────────────
  // CONTROLS LOCK — durante la generazione e l'upgrade 4K/8K blocchiamo tutti
  // i parametri (engine, template, palette, glass/color style, safe-area,
  // type-scale, contrast, screens, presets, CTA) per evitare che l'utente
  // cambi qualcosa a metà pipeline e ottenga risultati incoerenti tra
  // preview React e immagine AI finale.
  // ──────────────────────────────────────────────────────────────────────────
  const controlsLocked = generating || previewPhase === "upgrading";
  const lockTitle = controlsLocked
    ? "Impostazioni bloccate durante la generazione/upgrade 4K — attendi il completamento"
    : undefined;

  // Raggruppa template per categoria
  const groupedTemplates = TEMPLATE_VARIANTS.reduce((acc, t) => {
    (acc[t.group] ||= []).push(t);
    return acc;
  }, {} as Record<string, typeof TEMPLATE_VARIANTS>);

  return (
    <Card className="border-primary/30">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-start gap-2.5 text-base sm:text-lg leading-tight">
          <Smartphone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
          <span>
            Mockup iPhone Suite
            <span className="block text-xs sm:text-sm font-normal text-muted-foreground mt-0.5">
              4 schermate app del business
            </span>
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 sm:space-y-7">
        {/* Toggle modalità lead/standalone */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 p-1.5 rounded-xl bg-muted">
          <button
            type="button"
            onClick={() => setMode("lead")}
            disabled={!isLeadMode}
            className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
              mode === "lead" ? "bg-background shadow-sm" : "opacity-60 hover:opacity-100"
            } ${!isLeadMode ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <User className="h-4 w-4 shrink-0" />
            <span className="truncate">Da lead {isLeadMode ? "" : "(seleziona prima un lead)"}</span>
          </button>
          <button
            type="button"
            onClick={() => setMode("standalone")}
            className={`px-3 py-2.5 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 min-h-[44px] ${
              mode === "standalone" ? "bg-background shadow-sm" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Pencil className="h-4 w-4 shrink-0" />
            <span className="truncate">Mockup libero</span>
          </button>
        </div>

        {/* Form standalone (mostrato anche in lead-mode quando override è attivo) */}
        {(mode === "standalone" || (mode === "lead" && leadOverride)) && (
          <div className={`space-y-3 p-4 rounded-xl border ${
            mode === "lead" && leadOverride
              ? "bg-amber-500/[0.04] border-amber-500/30"
              : "bg-muted/20"
          }`}>
            {mode === "lead" && leadOverride && (
              <div className="flex items-center gap-2 text-[11px] text-amber-700 dark:text-amber-300 font-semibold">
                <Pencil className="h-3 w-3" />
                Override manuale attivo · stai modificando i dati precompilati dal lead
              </div>
            )}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="sa-name" className="text-xs">Nome attività / brand *</Label>
                <Input
                  id="sa-name"
                  value={standalone.name}
                  onChange={e => setStandalone(p => ({ ...p, name: e.target.value }))}
                  placeholder="Es. Sakura Sushi Milano"
                />
              </div>
              <div>
                <Label htmlFor="sa-city" className="text-xs">Città</Label>
                <Input
                  id="sa-city"
                  value={standalone.city}
                  onChange={e => setStandalone(p => ({ ...p, city: e.target.value }))}
                  placeholder="Es. Milano"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="sa-sector" className="text-xs">Settore / argomento *</Label>
              <Input
                id="sa-sector"
                value={standalone.sector}
                onChange={e => setStandalone(p => ({ ...p, sector: e.target.value }))}
                placeholder="Es. Sushi Bar, Studio Legale, Fitness Club, E-commerce moda…"
              />
              <div className="flex flex-wrap gap-1 mt-2">
                {QUICK_SECTORS.slice(0, 18).map(s => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setStandalone(p => ({ ...p, sector: s }))}
                    className="text-[10px] px-2 py-0.5 rounded-full border border-border/60 hover:border-primary hover:bg-primary/10 transition-colors"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <Label htmlFor="sa-color" className="text-xs">Colore brand</Label>
              <div className="flex gap-2 items-center">
                <input
                  id="sa-color"
                  type="color"
                  value={standalone.primaryColor}
                  onChange={e => setStandalone(p => ({ ...p, primaryColor: e.target.value }))}
                  className="w-12 h-9 rounded cursor-pointer border"
                />
                <Input
                  value={standalone.primaryColor}
                  onChange={e => setStandalone(p => ({ ...p, primaryColor: e.target.value }))}
                  className="flex-1 font-mono text-xs"
                />
              </div>
            </div>
          </div>
        )}

        {/* Riepilogo target — con indicatori sorgente (lead vs override vs standalone) */}
        {businessName && businessSector && (
          <div className={`flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg border ${
            mode === "lead" && !leadOverride
              ? "bg-primary/5 border-primary/20"
              : mode === "lead" && leadOverride
              ? "bg-amber-500/[0.06] border-amber-500/30"
              : "bg-muted/40 border-border"
          }`}>
            {mode === "lead" && !leadOverride && (
              <Badge variant="secondary" className="text-[10px] gap-1">
                <User className="h-2.5 w-2.5" /> Precompilato dal lead
              </Badge>
            )}
            {mode === "lead" && leadOverride && (
              <Badge variant="default" className="text-[10px] gap-1 bg-amber-500/90 hover:bg-amber-500">
                <Pencil className="h-2.5 w-2.5" /> Override manuale
              </Badge>
            )}
            {mode === "standalone" && (
              <Badge variant="outline" className="text-[10px] gap-1">
                <Wand2 className="h-2.5 w-2.5" /> Mockup libero
              </Badge>
            )}
            <Badge variant="default" className="text-xs">{businessName}</Badge>
            <Badge variant="outline" className="text-xs">{businessSector}</Badge>
            {businessCity && <Badge variant="outline" className="text-xs">{businessCity}</Badge>}
            <span
              className="inline-block w-4 h-4 rounded-full border"
              style={{ background: primaryColor }}
              title={primaryColor}
            />

            {/* Toggle override (solo in lead mode) */}
            {mode === "lead" && (
              <button
                type="button"
                onClick={() => setLeadOverride(v => !v)}
                className={`ml-auto text-[10px] px-2 py-1 rounded-full border font-semibold transition-all flex items-center gap-1 ${
                  leadOverride
                    ? "border-amber-500/60 bg-amber-500/10 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20"
                    : "border-border hover:border-primary hover:bg-primary/5"
                }`}
                title={leadOverride
                  ? "Disattiva override e ripristina i dati del lead"
                  : "Sblocca i campi per modificare manualmente i dati del lead"}
              >
                <Pencil className="h-2.5 w-2.5" />
                {leadOverride ? "Annulla override · usa lead" : "Sovrascrivi manualmente"}
              </button>
            )}
          </div>
        )}

        {/* Selettore motore */}
        <div className="space-y-3">
          <div>
            <Label className="text-sm font-semibold">Motore di generazione</Label>
            <p className="text-xs text-muted-foreground mt-0.5">Scegli velocità vs. qualità fotorealistica</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ENGINE_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const selected = engine === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setEngine(opt.key)}
                  disabled={controlsLocked}
                  title={lockTitle}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden group disabled:opacity-50 disabled:cursor-not-allowed min-h-[110px] ${
                    selected ? "border-primary shadow-lg sm:scale-[1.02]" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} ${selected ? "opacity-20" : "opacity-5"} transition-opacity`} />
                  <div className="relative space-y-2">
                    <div className="flex items-center justify-between gap-2">
                      <Icon className="h-5 w-5 text-foreground shrink-0" />
                      <Badge variant={opt.cost === 0 ? "secondary" : "default"} className="text-[11px] whitespace-nowrap">
                        {opt.cost === 0 ? "GRATIS" : `${opt.cost} crediti`}
                      </Badge>
                    </div>
                    <p className="font-semibold text-sm leading-tight">{opt.label}</p>
                    <p className="text-xs text-muted-foreground leading-snug">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template variante (raggruppato) + ANTEPRIMA LIVE */}
        <div className="space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <Label htmlFor="template-variant" className="flex items-center gap-1.5 text-sm font-semibold">
                <Palette className="h-4 w-4 text-primary" /> Stile grafico
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Template + palette + anteprima live</p>
            </div>
            <Badge variant="outline" className="text-[11px] gap-1"><Eye className="h-3 w-3" /> Live</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_180px] gap-5 items-start">
            <div className="space-y-4 min-w-0">
              <Select value={templateVariant} onValueChange={setTemplateVariant} disabled={controlsLocked}>
                <SelectTrigger id="template-variant" title={lockTitle} className="h-11">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="max-h-[360px]">
                  {Object.entries(groupedTemplates).map(([group, items]) => (
                    <div key={group}>
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">{group}</div>
                      {items.map(t => (
                        <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
                      ))}
                    </div>
                  ))}
                </SelectContent>
              </Select>
              {detectedTemplateLabel && (
                <p className="text-xs text-muted-foreground leading-snug">
                  ✨ Auto-rilevato dal settore: <span className="font-semibold text-foreground">{detectedTemplateLabel}</span>
                </p>
              )}

              {/* Palette swap rapido */}
              <div className="space-y-2">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <Label className="text-xs font-semibold m-0">Palette colore brand</Label>
                  <span className="text-[11px] text-muted-foreground">
                    Attuale: <span className="font-mono font-semibold text-foreground">
                      {(mode === "standalone" ? standalone.primaryColor : primaryColor).toUpperCase()}
                    </span>
                  </span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {QUICK_PALETTES.map(p => {
                    const active = (mode === "standalone" ? standalone.primaryColor : primaryColor).toLowerCase() === p.color.toLowerCase();
                    return (
                      <button
                        key={p.color}
                        type="button"
                        disabled={controlsLocked}
                        onClick={() => {
                          if (mode === "standalone") {
                            setStandalone(prev => ({ ...prev, primaryColor: p.color }));
                          } else {
                            setStandalone(prev => ({ ...prev, primaryColor: p.color }));
                          }
                        }}
                        title={lockTitle ?? p.label}
                        className={`relative w-9 h-9 rounded-full border-2 transition-all hover:scale-110 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                          active ? "border-foreground shadow-md scale-110" : "border-border"
                        }`}
                        style={{ background: p.color }}
                      >
                        {active && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-black drop-shadow">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* WCAG contrast check + auto-suggest */}
              <BrandContrastCheck
                brandHex={mode === "standalone" ? standalone.primaryColor : primaryColor}
                onApplySuggestion={(hex) => {
                  if (controlsLocked) return;
                  setStandalone(prev => ({ ...prev, primaryColor: hex }));
                }}
              />
            </div>

            {/* Anteprima live mini iPhone */}
            <div className="flex flex-col items-center gap-2 p-4 rounded-xl bg-muted/40 border mx-auto lg:mx-0">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Anteprima tema</p>
              <div className="relative" style={{ width: 130, height: Math.round(130 * 19.5 / 9) }}>
                <div
                  className="absolute -inset-2 rounded-[32px] opacity-30 blur-xl"
                  style={{ background: mode === "standalone" ? standalone.primaryColor : primaryColor }}
                />
                <div
                  className="relative rounded-[26px] border-[2px] overflow-hidden shadow-xl"
                  style={{
                    width: 130,
                    height: Math.round(130 * 19.5 / 9),
                    borderColor: "hsl(var(--foreground) / 0.2)",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[40px] h-[9px] bg-black rounded-full z-30" />
                  <div className="absolute inset-[2px] overflow-hidden rounded-[24px]">
                    <MockupReactScreen
                      type="home"
                      templateVariant={templateVariant === "auto" ? suggestTemplateForSector(businessSector) : templateVariant}
                      businessName={businessName || "Brand Demo"}
                      businessSector={businessSector || "Servizi"}
                      businessCity={businessCity || ""}
                      primaryColor={mode === "standalone" ? standalone.primaryColor : primaryColor}
                      width={126}
                      height={Math.round(130 * 19.5 / 9) - 4}
                      glassIntensity={glassIntensity}
                      colorStyle={colorStyle}
                      safeAreaPx={Math.round(safeAreaPx * 0.4)}
                      typeScale={typeScale}
                      boostContrast={boostContrast}
                      fontHeadOverride={brandFont.fontHead || undefined}
                      fontBodyOverride={brandFont.fontBody || undefined}
                    />
                  </div>
                  <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[42px] h-[2.5px] bg-foreground/30 rounded-full z-20" />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground text-center max-w-[140px] leading-snug">
                Preview Home · aggiornata in tempo reale
              </p>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PERSONALIZZAZIONE AVANZATA — glass intensity + color style         */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent p-4 sm:p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <Label className="flex items-center gap-1.5 m-0 text-sm font-semibold">
                <Sliders className="h-4 w-4 text-primary" /> Personalizzazione avanzata
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Glassmorphism · cromia · tipografia</p>
            </div>
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => {
                setGlassIntensity(60); setColorStyle("vivid");
                setSafeAreaPx(8); setTypeScale(1); setBoostContrast(true);
                setBrandFontKey("template");
              }}
              title={lockTitle}
              className="text-xs px-3 py-1.5 rounded-full border border-border/60 hover:border-primary hover:bg-primary/10 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              Reset default
            </button>
          </div>

          {/* Glassmorphism slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="glass-slider" className="text-sm flex items-center gap-1.5 m-0 font-medium">
                <Droplets className="h-3.5 w-3.5" /> Intensità glassmorphism
              </Label>
              <Badge variant="outline" className="text-xs font-mono">{glassIntensity}%</Badge>
            </div>
            <input
              id="glass-slider"
              type="range"
              min={0}
              max={100}
              step={5}
              value={glassIntensity}
              disabled={controlsLocked}
              onChange={(e) => setGlassIntensity(Number(e.target.value))}
              title={lockTitle}
              className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Solido</span>
              <span>Bilanciato</span>
              <span>Vetro intenso</span>
            </div>
          </div>

          {/* Color style segmented */}
          <div className="space-y-2">
            <Label className="text-sm m-0 font-medium">Stile cromatico</Label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {([
                { key: "vivid",  label: "Vivid",  desc: "Originale" },
                { key: "muted",  label: "Muted",  desc: "−25% sat." },
                { key: "pastel", label: "Pastel", desc: "Soft" },
                { key: "mono",   label: "Mono",   desc: "B/N" },
              ] as { key: ColorStyle; label: string; desc: string }[]).map(opt => {
                const active = colorStyle === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    disabled={controlsLocked}
                    onClick={() => setColorStyle(opt.key)}
                    title={lockTitle}
                    className={`px-2 py-2.5 rounded-lg border text-center transition-all disabled:opacity-50 disabled:cursor-not-allowed min-h-[52px] ${
                      active
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="text-sm font-bold leading-tight">{opt.label}</p>
                    <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Branding Kit — coppia font heading/body + lock + sync cloud */}
          <div className="space-y-1.5 pt-2 border-t border-border/50">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <Label className="text-xs flex items-center gap-1.5 m-0">
                <Type className="h-3 w-3 text-primary" /> Branding Kit · Tipografia
                {/* Indicatore sincronizzazione */}
                <span
                  className="inline-flex items-center gap-0.5 text-[9px] font-normal text-muted-foreground"
                  title={
                    branding.syncing
                      ? "Salvataggio in corso…"
                      : branding.lastSyncedAt
                      ? `Sincronizzato ${branding.lastSyncedAt.toLocaleTimeString()}`
                      : "Salvato solo in locale (login per sincronizzare cross-device)"
                  }
                >
                  {branding.syncing ? (
                    <Loader2 className="h-2.5 w-2.5 animate-spin" />
                  ) : branding.lastSyncedAt ? (
                    <Cloud className="h-2.5 w-2.5 text-emerald-500" />
                  ) : (
                    <CloudOff className="h-2.5 w-2.5" />
                  )}
                </span>
              </Label>
              <div className="flex items-center gap-1.5">
                {/* Lock toggle — blocca le modifiche del Branding Kit per evitare cambi accidentali */}
                <button
                  type="button"
                  onClick={() =>
                    branding.update({
                      brandLocked: !branding.settings.brandLocked,
                      primaryColor:
                        mode === "standalone" ? standalone.primaryColor : primaryColor,
                    })
                  }
                  disabled={controlsLocked}
                  title={
                    branding.settings.brandLocked
                      ? "Branding Kit bloccato — clicca per sbloccare"
                      : "Blocca Branding Kit (preserva colore + font tra sessioni)"
                  }
                  className={`text-[9px] px-2 py-0.5 rounded-full border transition-all flex items-center gap-1 disabled:opacity-50 disabled:cursor-not-allowed ${
                    branding.settings.brandLocked
                      ? "border-amber-500/60 bg-amber-500/10 text-amber-600 dark:text-amber-400"
                      : "border-border/60 hover:border-primary hover:bg-primary/10"
                  }`}
                >
                  {branding.settings.brandLocked ? (
                    <Lock className="h-2.5 w-2.5" />
                  ) : (
                    <Unlock className="h-2.5 w-2.5" />
                  )}
                  {branding.settings.brandLocked ? "Bloccato" : "Sblocca"}
                </button>
                <Badge variant="outline" className="text-[9px] font-mono max-w-[140px] truncate">
                  {brandFont.key === "template" ? "Default template" : brandFont.label}
                </Badge>
              </div>
            </div>
            <Select
              value={brandFontKey}
              onValueChange={setBrandFontKey}
              disabled={controlsLocked || branding.settings.brandLocked}
            >
              <SelectTrigger
                className="h-9 text-xs"
                title={
                  branding.settings.brandLocked
                    ? "Branding Kit bloccato — sblocca per cambiare font"
                    : lockTitle
                }
              >
                <SelectValue placeholder="Seleziona coppia font" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {BRAND_FONT_PAIRS.map(p => (
                  <SelectItem key={p.key} value={p.key} className="text-xs">
                    <div className="flex flex-col gap-0.5 py-0.5">
                      <span
                        className="font-semibold leading-tight"
                        style={p.fontHead ? { fontFamily: p.fontHead } : undefined}
                      >
                        {p.label}
                      </span>
                      <span
                        className="text-[10px] text-muted-foreground leading-tight"
                        style={p.fontBody ? { fontFamily: p.fontBody } : undefined}
                      >
                        {p.description}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {brandFont.key !== "template" && (
              <div
                className="rounded-md border border-border/50 bg-background/40 px-2.5 py-1.5 flex items-baseline gap-2 overflow-hidden"
                title="Anteprima coppia font"
              >
                <span
                  className="text-[14px] leading-none truncate"
                  style={{ fontFamily: brandFont.fontHead, fontWeight: 700 }}
                >
                  {businessName || "Brand Demo"}
                </span>
                <span
                  className="text-[10px] text-muted-foreground truncate"
                  style={{ fontFamily: brandFont.fontBody }}
                >
                  body · esperienza moderna
                </span>
              </div>
            )}
            <p className="text-[9px] text-muted-foreground italic">
              {branding.settings.brandLocked
                ? "🔒 Branding Kit bloccato — colore e font vengono ripristinati tra sessioni."
                : "I font del Branding Kit sostituiscono quelli del template e si aggiornano live nella preview React. Salvati su cloud + cache locale."}
            </p>
          </div>


          <p className="text-[10px] text-muted-foreground italic">
            🎨 Clicca <span className="font-semibold not-italic">Genera Suite</span> per applicare queste impostazioni alle 4 schermate. L'anteprima live in alto si aggiorna istantaneamente.
          </p>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PRESET PREMIUM (palette + tipografia + layout architetturale)     */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <PresetThemeScope
          preset={getStylePreset(templateVariant)}
          applyTypography={false}
          className="rounded-xl border border-primary/30 bg-gradient-to-br from-primary/[0.06] to-transparent p-4 sm:p-5 space-y-3"
        >
          <MockupPresetSelector
            value={templateVariant}
            sectorHint={businessSector}
            compact
            onChange={(key, preset) => {
              if (controlsLocked) return;
              setTemplateVariant(key);
              if (mode === "standalone") {
                setStandalone(s => ({ ...s, primaryColor: preset.palette.accent }));
              }
            }}
          />
          <div className="flex flex-wrap gap-2 pt-1 items-center">
            <Button size="sm" className="h-8">CTA brand</Button>
            <Button size="sm" variant="secondary" className="h-8">Secondario</Button>
            <Button size="sm" variant="outline" className="h-8">Outline</Button>
            <Badge>Badge</Badge>
            <span className="text-[10px] text-muted-foreground italic ml-auto">
              UI applicata live al preset selezionato
            </span>
          </div>
        </PresetThemeScope>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PRESET LOOK — salva/carica combinazioni di template+glass+color   */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <MockupLookPresets
          current={{
            templateVariant,
            glassIntensity,
            colorStyle,
            safeAreaPx,
            typeScale,
            boostContrast,
          }}
          onApply={(p: MockupLookPreset) => {
            if (controlsLocked) return;
            setTemplateVariant(p.templateVariant);
            setGlassIntensity(p.glassIntensity);
            setColorStyle(p.colorStyle);
            setSafeAreaPx(p.safeAreaPx);
            setTypeScale(p.typeScale);
            setBoostContrast(p.boostContrast);
          }}
        />

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* SAFE AREA & LEGGIBILITÀ — margini, tipografia, contrasto AA       */}
        {/* Garantiscono che testo e UI restino dentro il frame iPhone        */}
        {/* su qualsiasi template selezionato (auto + manuali).               */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.05] to-transparent p-4 sm:p-5 space-y-5">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <Label className="flex items-center gap-1.5 m-0 text-sm font-semibold">
                <Eye className="h-4 w-4 text-accent-foreground" /> Safe Area & Leggibilità
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Margini, tipografia e contrasto WCAG</p>
            </div>
            <Badge variant="outline" className="text-[10px] uppercase tracking-wider">
              {boostContrast ? "AA on" : "AA off"} · {typeScale.toFixed(2)}× · {safeAreaPx}px
            </Badge>
          </div>

          {/* Safe Area slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="safe-area-slider" className="text-sm flex items-center gap-1.5 m-0 font-medium">
                Margine interno (safe-area)
              </Label>
              <Badge variant="outline" className="text-xs font-mono">{safeAreaPx}px</Badge>
            </div>
            <input
              id="safe-area-slider"
              type="range"
              min={0}
              max={24}
              step={2}
              value={safeAreaPx}
              disabled={controlsLocked}
              onChange={(e) => setSafeAreaPx(Number(e.target.value))}
              title={lockTitle}
              className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Edge-to-edge</span>
              <span>Bilanciato</span>
              <span>Massima sicurezza</span>
            </div>
          </div>

          {/* Type scale slider */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="type-scale-slider" className="text-sm flex items-center gap-1.5 m-0 font-medium">
                Dimensione tipografia
              </Label>
              <Badge variant="outline" className="text-xs font-mono">{typeScale.toFixed(2)}×</Badge>
            </div>
            <input
              id="type-scale-slider"
              type="range"
              min={0.85}
              max={1.20}
              step={0.05}
              value={typeScale}
              disabled={controlsLocked}
              onChange={(e) => setTypeScale(Number(e.target.value))}
              title={lockTitle}
              className="w-full h-2.5 bg-muted rounded-full appearance-none cursor-pointer accent-primary disabled:opacity-50 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>Compatta (0.85×)</span>
              <span>Standard (1.00×)</span>
              <span>Maxi (1.20×)</span>
            </div>
          </div>

          {/* Contrast toggle */}
          <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-muted/40 border border-border/40">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold leading-tight">Boost contrasto AA</p>
              <p className="text-xs text-muted-foreground leading-snug mt-1">
                Forza testo e didascalie a contrasto WCAG AA su qualsiasi sfondo.
              </p>
            </div>
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => setBoostContrast(v => !v)}
              role="switch"
              aria-checked={boostContrast}
              title={lockTitle}
              className={`shrink-0 relative inline-flex h-7 w-12 items-center rounded-full transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                boostContrast ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-5 w-5 transform rounded-full bg-background shadow transition-transform ${
                  boostContrast ? "translate-x-6" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <p className="text-[11px] text-muted-foreground italic leading-snug">
            🛡️ Nessun testo finisce sotto la Dynamic Island o l'Home Indicator. Ottimale per AI-render 4K/8K.
          </p>
        </div>

        {/* 4 schermate configurabili */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Schermate da generare (4 mockup)</Label>
            <button
              type="button"
              disabled={controlsLocked}
              onClick={() => setAutoScreens(v => !v)}
              title={lockTitle}
              className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                autoScreens ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              {autoScreens ? "✓ Auto-pertinente al settore" : "Manuale"}
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {screens.map((s, i) => (
              <div key={i} className="flex gap-2 items-center p-2 rounded-lg border bg-muted/30">
                <Badge variant="outline" className="text-xs shrink-0">#{i + 1}</Badge>
                <Select
                  value={s.type}
                  disabled={controlsLocked}
                  onValueChange={(v) => {
                    setAutoScreens(false);
                    setScreens(prev => prev.map((x, j) => j === i ? { ...x, type: v as ScreenType, title: SCREEN_TYPES.find(t => t.key === v)?.label || x.title } : x));
                  }}
                >
                  <SelectTrigger className="h-8 text-xs flex-1" title={lockTitle}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCREEN_TYPES.map(t => (
                      <SelectItem key={t.key} value={t.key} className="text-xs">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="h-8 text-xs w-32"
                  value={s.title}
                  disabled={controlsLocked}
                  onChange={e => {
                    setAutoScreens(false);
                    setScreens(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x));
                  }}
                  placeholder="Titolo"
                  title={lockTitle}
                />
              </div>
            ))}
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PRE-GEN PREVIEW STRIP — 4 mini iPhone con tutte le opzioni live   */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.03] to-transparent p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <Label className="flex items-center gap-1.5 m-0 text-sm font-semibold">
                <Eye className="h-4 w-4 text-primary" /> Anteprima pre-generazione
              </Label>
              <p className="text-xs text-muted-foreground mt-0.5">Le 4 schermate prima della generazione finale</p>
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <Badge variant="outline" className="text-[10px]">
                {(templateVariant === "auto"
                  ? `Auto → ${TEMPLATE_VARIANTS.find(t => t.key === suggestTemplateForSector(businessSector))?.label?.split("—")[0]?.trim() || "—"}`
                  : TEMPLATE_VARIANTS.find(t => t.key === templateVariant)?.label?.split("—")[0]?.trim() || templateVariant)}
              </Badge>
              <Badge variant="outline" className="text-[10px]">
                <Droplets className="h-2.5 w-2.5 mr-1" />Glass {glassIntensity}%
              </Badge>
              <Badge variant="outline" className="text-[10px] capitalize">
                <Palette className="h-2.5 w-2.5 mr-1" />{colorStyle}
              </Badge>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-3 justify-items-center">
            {screens.map((s, i) => {
              const w = 110;
              const h = Math.round(w * 19.5 / 9);
              const resolved = templateVariant === "auto" ? suggestTemplateForSector(businessSector) : templateVariant;
              return (
                <div key={`${s.type}-${i}`} className="flex flex-col items-center gap-1.5">
                  <div className="relative" style={{ width: w, height: h }}>
                    <div
                      className="absolute -inset-1.5 rounded-[24px] opacity-25 blur-md"
                      style={{ background: mode === "standalone" ? standalone.primaryColor : primaryColor }}
                    />
                    <div
                      className="relative rounded-[20px] border-[1.5px] overflow-hidden shadow-md"
                      style={{
                        width: w,
                        height: h,
                        borderColor: "hsl(var(--foreground) / 0.2)",
                        boxSizing: "border-box",
                      }}
                    >
                      <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[32px] h-[7px] bg-black rounded-full z-30" />
                      <div className="absolute inset-[1.5px] overflow-hidden rounded-[18px]">
                        <MockupReactScreen
                          type={s.type}
                          templateVariant={resolved}
                          businessName={businessName || "Brand Demo"}
                          businessSector={businessSector || "Servizi"}
                          businessCity={businessCity || ""}
                          primaryColor={mode === "standalone" ? standalone.primaryColor : primaryColor}
                          width={w - 3}
                          height={h - 3}
                          glassIntensity={glassIntensity}
                          colorStyle={colorStyle}
                          safeAreaPx={Math.round(safeAreaPx * 0.3)}
                          typeScale={typeScale}
                          boostContrast={boostContrast}
                          fontHeadOverride={brandFont.fontHead || undefined}
                          fontBodyOverride={brandFont.fontBody || undefined}
                        />
                      </div>
                      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[36px] h-[2px] bg-foreground/30 rounded-full z-20" />
                    </div>
                  </div>
                  <p className="text-xs font-semibold text-center leading-tight max-w-[110px] truncate">{s.title}</p>
                  <p className="text-[10px] text-muted-foreground capitalize leading-none">{s.type}</p>
                </div>
              );
            })}
          </div>

          <p className="text-[11px] text-muted-foreground italic text-center leading-snug">
            Anteprima React istantanea · clicca <span className="font-semibold not-italic">Genera Suite</span> per la versione finale 4K/8K.
          </p>
        </div>

        {/* ═══ Barra di avanzamento globale (mockup + sito 1:1) ═══ */}
        {(controlsLocked || siteBuilding) && (() => {
          // Determina la fase corrente e il progresso (0-100)
          // Fasi: 1) caricamento → 2) preview → 3) upgrade AI → 4) sito 1:1 → 5) pronto
          let pct = 5;
          let label = "Caricamento dati…";
          let sub = "Preparazione del brand e del template";
          const steps: { key: string; label: string; done: boolean; active: boolean }[] = [
            { key: "load", label: "Caricamento dati", done: false, active: false },
            { key: "preview", label: "Anteprima istantanea", done: false, active: false },
            { key: "ai", label: "Generazione mockup AI", done: false, active: false },
            ...(autoBuildSite || siteBuilding ? [{ key: "site", label: "Costruzione sito 1:1", done: false, active: false }] : []),
            { key: "done", label: "Pronto", done: false, active: false },
          ];
          const setActive = (key: string) => {
            let reached = false;
            for (const s of steps) {
              if (s.key === key) { s.active = true; reached = true; continue; }
              if (!reached) s.done = true;
            }
          };
          if (siteBuilding) {
            pct = 85; label = "Costruzione sito 1:1…"; sub = "Genero pagine, admin, credenziali e contenuti dal lead";
            setActive("site");
          } else if (previewPhase === "upgrading") {
            pct = 60; label = "Generazione mockup AI…"; sub = "Modello fotorealistico al lavoro · 1-3 minuti";
            setActive("ai");
          } else if (previewPhase === "preview") {
            pct = 30; label = "Anteprima istantanea pronta"; sub = "Sto avviando l'upgrade AI fotorealistico";
            setActive("preview");
          } else if (generating) {
            pct = 10; label = "Caricamento dati…"; sub = "Estraggo logo, foto e brand del lead";
            setActive("load");
          }

          return (
            <div
              role="status"
              aria-live="polite"
              aria-busy="true"
              className="rounded-xl border border-primary/40 bg-primary/[0.06] p-3 space-y-3"
            >
              <div className="flex items-start gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <p className="font-semibold text-xs leading-tight">{label}</p>
                    <span className="text-[10px] font-mono tabular-nums text-primary">{pct}%</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">{sub}</p>
                </div>
              </div>

              <Progress value={pct} className="h-1.5" aria-label={`Avanzamento: ${pct}%`} />

              {/* Step list */}
              <ol className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
                {steps.map((s) => (
                  <li
                    key={s.key}
                    className={`flex items-center gap-1.5 rounded-md border px-1.5 py-1 text-[10px] leading-tight transition-colors ${
                      s.active
                        ? "border-primary/60 bg-primary/10 text-foreground font-medium"
                        : s.done
                        ? "border-emerald-500/40 bg-emerald-500/5 text-emerald-700 dark:text-emerald-300"
                        : "border-border/50 bg-muted/30 text-muted-foreground"
                    }`}
                  >
                    {s.done ? (
                      <CheckCircle2 className="h-3 w-3 shrink-0 text-emerald-500" />
                    ) : s.active ? (
                      <Loader2 className="h-3 w-3 shrink-0 animate-spin text-primary" />
                    ) : (
                      <Circle className="h-3 w-3 shrink-0" />
                    )}
                    <span className="truncate">{s.label}</span>
                  </li>
                ))}
              </ol>

              {controlsLocked && (
                <p className="text-[9px] text-muted-foreground leading-snug pt-0.5 border-t border-border/40">
                  🔒 Engine, template, palette e schermate sono bloccati durante la generazione per garantire risultati coerenti.
                </p>
              )}
            </div>
          );
        })()}

        {/* CTA */}
        <Button
          onClick={handleGenerate}
          disabled={controlsLocked || !businessName?.trim() || !businessSector?.trim()}
          size="lg"
          className="w-full"
        >
          {controlsLocked ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> {previewPhase === "upgrading" ? "Upgrade 4K/8K in corso…" : "Generazione 4 mockup in corso…"}</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Genera Suite ({selectedEngineCfg.cost === 0 ? "GRATIS" : `${selectedEngineCfg.cost} crediti`})</>
          )}
        </Button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-muted-foreground text-center">
          <span>✓ 4 schermate iPhone</span>
          <span>✓ Stile fedele al settore</span>
          <span>✓ Link condivisibile</span>
          <span>✓ Download PNG</span>
        </div>

        {/* Risultato */}
        {result && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  {previewPhase === "upgrading"
                    ? "Anteprima istantanea · upgrade 4K/8K in corso…"
                    : `Suite generata · ${result.template_variant.replace("_", " ")} · ${ENGINE_OPTIONS.find(e => e.key === result.engine)?.label}`}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">
                  {previewPhase === "upgrading"
                    ? "Le 4 schermate si aggiornano una a una appena pronte (fade-in progressivo)"
                    : "4 mockup pronti da mostrare al cliente"}
                </p>
                {previewPhase !== "upgrading" && (
                  <div className="flex flex-wrap items-center gap-2 mt-2">
                    <span className="inline-flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-400/30">
                      <BookmarkCheck className="w-2.5 h-2.5" />
                      Salvata nel Portfolio
                    </span>
                    <Link
                      to="/partner/portfolio"
                      className="inline-flex items-center gap-1 text-[0.6rem] px-2 py-0.5 rounded-full bg-primary/15 text-primary border border-primary/30 hover:bg-primary/25 transition-colors"
                    >
                      <FolderOpen className="w-2.5 h-2.5" />
                      Apri Portfolio
                    </Link>
                  </div>
                )}
              </div>
              {previewPhase === "upgrading" ? (
                <Badge variant="outline" className="gap-1.5 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Upgrade AI…
                </Badge>
              ) : (
                <div className="flex gap-2 flex-wrap">
                  <Button
                    variant="default"
                    size="sm"
                    onClick={handleGenerate}
                    disabled={generating}
                    title="Ri-genera le 4 schermate con le impostazioni attuali (nuovo seed)"
                  >
                    <RefreshCw className={`h-3 w-3 mr-1 ${generating ? "animate-spin" : ""}`} />
                    Rigenera
                  </Button>
                  <Button variant="outline" size="sm" onClick={copyShareLink} disabled={!result.share_slug}>
                    <Copy className="h-3 w-3 mr-1" />Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => result.share_slug && window.open(buildPublicMockupUrl(result.share_slug), "_blank")}
                    disabled={!result.share_slug}
                  >
                    <ExternalLink className="h-3 w-3 mr-1" />Apri
                  </Button>
                </div>
              )}
            </div>

            <MockupSuiteViewer
              screens={result.screens}
              templateVariant={result.template_variant}
              businessName={businessName}
              businessSector={businessSector}
              businessCity={businessCity}
              primaryColor={primaryColor}
              suiteId={result.suite_id}
              glassIntensity={glassIntensity}
              colorStyle={colorStyle}
              safeAreaPx={safeAreaPx}
              typeScale={typeScale}
              boostContrast={boostContrast}
            />

            {/* ═══════════ CTA: GENERA SITO WEBAPP COMPLETO 1:1 ═══════════
              * Trasforma la suite di mockup nel sito reale + admin completo,
              * usando lo stesso template e tutti i dati estratti del lead. */}
            {previewPhase === "complete" && (
              <div className="mt-6 p-4 sm:p-5 rounded-xl border-2 border-primary/40 bg-gradient-to-br from-primary/[0.06] via-transparent to-fuchsia-500/[0.06] space-y-3">
                <div className="flex items-start gap-3">
                  <div className="shrink-0 h-10 w-10 rounded-xl bg-gradient-to-br from-primary to-fuchsia-500 flex items-center justify-center shadow-lg shadow-primary/30">
                    <Sparkles className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-bold leading-tight">
                      Trasforma in Sito Webapp Completo 1:1
                    </h3>
                    <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      Genera il sito pubblico + pannello admin + tutte le pagine + funzioni del settore,
                      con login dedicato e splash screen brand. Stesso stile dei mockup, dati reali del lead.
                    </p>
                  </div>
                </div>

                {!siteResult ? (
                  <Button
                    onClick={handleBuildFullSite}
                    disabled={siteBuilding}
                    className="w-full h-11 font-semibold bg-gradient-to-r from-primary to-fuchsia-600 hover:opacity-90 text-white shadow-lg shadow-primary/30"
                  >
                    {siteBuilding ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Costruisco sito + admin (30-60s)…</>
                    ) : (
                      <><Wand2 className="h-4 w-4 mr-2" /> Genera Sito Webapp 1:1 (15 crediti)</>
                    )}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        size="sm"
                        variant="default"
                        onClick={() => window.open(siteResult.previewUrl, "_blank")}
                        className="h-10"
                      >
                        <ExternalLink className="h-3.5 w-3.5 mr-1.5" /> Apri Sito Pubblico
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => window.open(siteResult.adminUrl, "_blank")}
                        className="h-10"
                      >
                        <Crown className="h-3.5 w-3.5 mr-1.5" /> Apri Admin
                      </Button>
                    </div>
                    {siteResult.credentials && (
                      <div className="p-2.5 rounded-lg bg-muted/50 text-[11px] font-mono space-y-0.5">
                        <div><span className="text-muted-foreground">Email:</span> {siteResult.credentials.email}</div>
                        <div><span className="text-muted-foreground">Password:</span> {siteResult.credentials.password}</div>
                      </div>
                    )}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => { setSiteResult(null); }}
                      className="w-full h-9 text-xs"
                    >
                      <RefreshCw className="h-3 w-3 mr-1" /> Rigenera sito
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
