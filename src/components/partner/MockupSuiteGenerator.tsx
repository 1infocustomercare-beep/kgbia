import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Smartphone, Wand2, Crown, Zap, Copy, ExternalLink, User, Pencil, Palette, Eye, Sliders, Droplets } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MockupSuiteViewer, type SuiteScreen } from "./MockupSuiteViewer";
import { MockupReactScreen, type ColorStyle } from "./MockupReactScreen";
import { getBrandingKit, type TemplateBrandingKit } from "./templateBranding";

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
  onGenerated?: (suiteId: string, shareSlug: string) => void;
}

const ENGINE_OPTIONS: { key: MockupEngine; label: string; cost: number; icon: React.ElementType; desc: string; color: string }[] = [
  { key: "react",           label: "React Render",     cost: 0,  icon: Zap,    desc: "Gratis · template fedeli · veloce",          color: "from-emerald-500 to-teal-600" },
  { key: "nano_banana",     label: "Nano Banana 2",    cost: 20, icon: Wand2,  desc: "AI fotorealistico · qualità premium",        color: "from-amber-500 to-orange-600" },
  { key: "nano_banana_pro", label: "Nano Banana Pro",  cost: 40, icon: Crown,  desc: "AI cinematografico 8K · qualità massima",    color: "from-fuchsia-500 to-purple-700" },
];

const TEMPLATE_VARIANTS = [
  { key: "auto",              label: "Auto (rilevato dal settore)", group: "Smart" },
  // ── MODERN 2026 — Apple Liquid Glass, glacial, spatial, holo ──
  { key: "apple_liquid_glass",label: "Apple Liquid Glass — vetro vivido iOS 26 / visionOS", group: "Modern 2026" },
  { key: "glacial_frost",     label: "Glacial Frost — bianco-azzurro ghiaccio, vetro chiaro", group: "Modern 2026" },
  { key: "spatial_visionos",  label: "Spatial visionOS — depth, halo bianchi, deep space", group: "Modern 2026" },
  { key: "midnight_aurora",   label: "Midnight Aurora — navy + smeraldo / viola", group: "Modern 2026" },
  { key: "cyber_holo",        label: "Cyber Holo — iridescenza viola/ciano, gaming/tech", group: "Modern 2026" },
  { key: "y2k_chrome",        label: "Y2K Chrome — metallo lucido, retro-futuro", group: "Modern 2026" },
  { key: "sunset_gradient",   label: "Sunset Gradient — coral/magenta caldo, social-grade", group: "Modern 2026" },
  { key: "swiss_grid",        label: "Swiss Grid — tipografia editoriale pulita, accenti rossi", group: "Modern 2026" },
  // Premium 2026
  { key: "neon_vibrant",      label: "Neon Vibrant — energia, gaming, eventi", group: "Premium 2026" },
  { key: "editorial_clean",   label: "Editorial Clean — magazine, fashion, lifestyle", group: "Premium 2026" },
  { key: "boutique_pastel",   label: "Boutique Pastel — beauty, kids, wellness", group: "Premium 2026" },
  { key: "monochrome_bold",   label: "Monochrome Bold — agenzie, design, tech", group: "Premium 2026" },
  { key: "glass_aurora",      label: "Glass Aurora — fintech, AI, SaaS", group: "Premium 2026" },
  { key: "real_estate_trust", label: "Real Estate Trust — immobiliare, legale, finanza", group: "Premium 2026" },
  { key: "fitness_energy",    label: "Fitness Energy — palestre, sport, supplements", group: "Premium 2026" },
  // Esistenti (replica 1:1 dei mockup forniti)
  { key: "paperfish",         label: "Paperfish Sakura — sushi/giapponese", group: "Food" },
  { key: "strapizzami",       label: "Strapizzami — pizzeria/italiano", group: "Food" },
  { key: "casual_warm",       label: "Casual Warm — trattoria/bistrot", group: "Food" },
  { key: "luxury_gold",       label: "Luxury Gold — alta cucina/Michelin", group: "Hospitality" },
  { key: "batey",             label: "Batey Pacifico — mare/lido/yacht", group: "Hospitality" },
  { key: "minimal_zen",       label: "Minimal Zen — spa/wellness", group: "Wellness" },
  { key: "modern_dark",       label: "Modern Dark — multi-settore base", group: "Classic" },
];

// Palette rapide per swap veloce del colore brand prima della generazione
const QUICK_PALETTES: { label: string; color: string }[] = [
  { label: "Oro Imperiale",  color: "#C8963E" },
  { label: "Oro Champagne",  color: "#D4AF37" },
  { label: "Sakura Pink",    color: "#E89BAE" },
  { label: "Coral Vibrant",  color: "#FF6B5C" },
  { label: "Terracotta",     color: "#C84A2A" },
  { label: "Ocean Azure",    color: "#5CC8D9" },
  { label: "Glacial Sky",    color: "#5BB8FF" },
  { label: "Aurora Mint",    color: "#5EEAD4" },
  { label: "Liquid Lilac",   color: "#A78BFA" },
  { label: "Holo Cyan",      color: "#22F1D6" },
  { label: "Chrome Silver",  color: "#C0C7D6" },
  { label: "Sunset Pink",    color: "#FF6B9C" },
  { label: "Navy Trust",     color: "#1B2A3A" },
  { label: "Emerald",        color: "#10B981" },
  { label: "Lime Energy",    color: "#C8FF00" },
  { label: "Royal Indigo",   color: "#6366F1" },
  { label: "Magenta Neon",   color: "#FF2E9A" },
  { label: "Bordeaux",       color: "#6B1F2C" },
  { label: "Swiss Red",      color: "#E4002B" },
  { label: "Mono Black",     color: "#0A0A0A" },
  { label: "Pure White",     color: "#FAFAFA" },
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
  onGenerated,
}: Props) {
  // Modalità: lead (usa props del lead) | standalone (form libero)
  const isLeadMode = Boolean((businessNameProp || "").trim());
  const [mode, setMode] = useState<"lead" | "standalone">(isLeadMode ? "lead" : "standalone");

  // Form standalone
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

  // Valori effettivi
  const businessName = mode === "standalone" ? standalone.name : (businessNameProp || "");
  const businessSector = mode === "standalone" ? standalone.sector : businessSectorProp;
  const businessCity = mode === "standalone" ? standalone.city : businessCityProp;
  const primaryColor = mode === "standalone" ? standalone.primaryColor : primaryColorProp;

  const [engine, setEngine] = useState<MockupEngine>("react");
  const [templateVariant, setTemplateVariant] = useState<string>(initialTemplate || "auto");
  // Personalizzazione avanzata
  const [glassIntensity, setGlassIntensity] = useState<number>(60);
  const [colorStyle, setColorStyle] = useState<ColorStyle>("vivid");
  // Safe Area & Leggibilità — padding interno, scala tipografica, contrasto AA
  const [safeAreaPx, setSafeAreaPx] = useState<number>(8);
  const [typeScale, setTypeScale] = useState<number>(1);
  const [boostContrast, setBoostContrast] = useState<boolean>(true);
  // Branding Kit (Mockup Libero) — sincronizza palette e tipografia con il template scelto
  const [lockToTemplate, setLockToTemplate] = useState<boolean>(true);
  const [autoScreens, setAutoScreens] = useState(true);
  const [screens, setScreens] = useState<{ type: ScreenType; title: string }[]>(
    suggestScreensForSector(businessSector)
  );

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

  // Risolvi il template effettivo (anche quando "auto") per derivare il branding kit corretto
  const resolvedTemplateKey = useMemo(() => {
    return templateVariant === "auto" ? suggestTemplateForSector(businessSector) : templateVariant;
  }, [templateVariant, businessSector]);

  const brandingKit: TemplateBrandingKit = useMemo(
    () => getBrandingKit(resolvedTemplateKey),
    [resolvedTemplateKey]
  );

  // Quando il template cambia e il lock è attivo, sincronizza il colore brand standalone
  // sul primary del template scelto. Funziona sia in standalone che lead-mode (preview color).
  useEffect(() => {
    if (!lockToTemplate) return;
    setStandalone(prev =>
      prev.primaryColor.toLowerCase() === brandingKit.primary.toLowerCase()
        ? prev
        : { ...prev, primaryColor: brandingKit.primary }
    );
  }, [brandingKit.primary, lockToTemplate]);

  const [generating, setGenerating] = useState(false);
  // Mockup Libero — preview on-demand: l'utente clicca "Carica anteprima" per renderizzarla
  const [standalonePreviewLoaded, setStandalonePreviewLoaded] = useState(false);
  const [standalonePreviewLoading, setStandalonePreviewLoading] = useState(false);
  // Invalida la preview on-demand quando cambia settore o colore brand
  useEffect(() => {
    setStandalonePreviewLoaded(false);
  }, [standalone.sector, standalone.primaryColor]);
  // Stato per preview progressiva: "preview" = mostra subito React render, "upgrading" = AI in arrivo, "complete" = finita
  const [previewPhase, setPreviewPhase] = useState<"idle" | "preview" | "upgrading" | "complete">("idle");
  const [result, setResult] = useState<{
    suite_id: string;
    share_slug: string;
    template_variant: string;
    engine: MockupEngine;
    screens: SuiteScreen[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!businessName?.trim()) {
      toast.error("Inserisci il nome dell'attività");
      return;
    }
    if (!businessSector?.trim()) {
      toast.error("Inserisci il settore o argomento");
      return;
    }
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
        // Branding kit del template — coerenza palette + tipografia per AI prompt
        branding: {
          template: brandingKit.variant,
          locked: lockToTemplate,
          primary: brandingKit.primary,
          accent: brandingKit.accent,
          palette: brandingKit.palette.map(p => p.hex),
          typography_pair: brandingKit.typography.pairLabel,
          heading_font: brandingKit.typography.headingFont,
          body_font: brandingKit.typography.bodyFont,
          rule: brandingKit.rule,
        },
      };

      if (isAIEngine) setPreviewPhase("upgrading");

      const { data, error } = await supabase.functions.invoke("lead-mockup-suite", { body: payload });
      if (error) throw error;
      const d = data as any;
      if (!d?.success) {
        if (d?.error === "insufficient_credits") {
          toast.error(`Crediti insufficienti per ${ENGINE_OPTIONS.find(e => e.key === engine)?.label}`);
        } else if (d?.error === "ai_rate_limited") {
          toast.error("AI temporaneamente sovraccarica. Riprova tra qualche secondo o usa modalità React (gratis).");
        } else {
          toast.error(`Errore: ${d?.error || "sconosciuto"}`);
        }
        // Mantieni la preview React come fallback se eravamo in upgrade
        if (isAIEngine) {
          toast.warning("Mostro l'anteprima React come fallback. Riprova per generare la versione AI 4K/8K.");
        } else {
          setResult(null);
          setPreviewPhase("idle");
        }
        return;
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
    } catch (e: any) {
      toast.error(e.message || "Errore generazione");
      setPreviewPhase("idle");
    } finally {
      setGenerating(false);
    }
  };

  const copyShareLink = () => {
    if (!result?.share_slug) return;
    const url = `${window.location.origin}/preview/mockup/${result.share_slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato negli appunti");
  };

  const selectedEngineCfg = ENGINE_OPTIONS.find(e => e.key === engine)!;

  // Raggruppa template per categoria
  const groupedTemplates = TEMPLATE_VARIANTS.reduce((acc, t) => {
    (acc[t.group] ||= []).push(t);
    return acc;
  }, {} as Record<string, typeof TEMPLATE_VARIANTS>);

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Mockup iPhone Suite — 4 schermate app del business
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Toggle modalità lead/standalone */}
        <div className="grid grid-cols-2 gap-2 p-1 rounded-xl bg-muted">
          <button
            type="button"
            onClick={() => setMode("lead")}
            disabled={!isLeadMode}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === "lead" ? "bg-background shadow-sm" : "opacity-60 hover:opacity-100"
            } ${!isLeadMode ? "opacity-30 cursor-not-allowed" : ""}`}
          >
            <User className="h-4 w-4" /> Da lead {isLeadMode ? "" : "(seleziona prima un lead)"}
          </button>
          <button
            type="button"
            onClick={() => setMode("standalone")}
            className={`px-3 py-2 rounded-lg text-sm font-semibold transition-all flex items-center justify-center gap-2 ${
              mode === "standalone" ? "bg-background shadow-sm" : "opacity-60 hover:opacity-100"
            }`}
          >
            <Pencil className="h-4 w-4" /> Mockup libero (qualsiasi argomento)
          </button>
        </div>

        {/* Form standalone */}
        {mode === "standalone" && (
          <div className="space-y-3 p-4 rounded-xl border bg-muted/20">
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

            {/* ────────────────────────────────────────────────────────── */}
            {/* BRANDING KIT — coerenza palette + tipografia col template  */}
            {/* Solo in Mockup Libero (standalone): collega il colore brand */}
            {/* e i font alle regole del template selezionato.              */}
            {/* ────────────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-primary/25 bg-gradient-to-br from-primary/[0.05] to-transparent p-3 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <Palette className="h-3.5 w-3.5 text-primary shrink-0" />
                  <Label className="text-xs font-semibold m-0 truncate">
                    Branding Kit · {brandingKit.label}
                  </Label>
                </div>
                <button
                  type="button"
                  onClick={() => setLockToTemplate(v => !v)}
                  role="switch"
                  aria-checked={lockToTemplate}
                  className={`flex items-center gap-1.5 px-2 py-1 rounded-full text-[10px] font-bold transition-colors border ${
                    lockToTemplate
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/40"
                  }`}
                >
                  {lockToTemplate ? "🔒 Sincronizzato" : "🔓 Manuale"}
                </button>
              </div>

              {/* Palette swatches del template */}
              <div className="space-y-1">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Palette consigliata</p>
                <div className="flex gap-1.5 flex-wrap">
                  {brandingKit.palette.map(swatch => {
                    const active = standalone.primaryColor.toLowerCase() === swatch.hex.toLowerCase();
                    return (
                      <button
                        key={swatch.hex}
                        type="button"
                        onClick={() => {
                          setLockToTemplate(false); // override esplicito = unlock
                          setStandalone(prev => ({ ...prev, primaryColor: swatch.hex }));
                        }}
                        title={`${swatch.name} · ${swatch.hex}`}
                        className={`group relative h-9 w-9 rounded-lg border-2 transition-all hover:scale-110 ${
                          active ? "border-foreground shadow-md scale-110" : "border-border"
                        }`}
                        style={{ background: swatch.hex }}
                      >
                        {active && (
                          <span
                            className="absolute inset-0 flex items-center justify-center text-[12px] font-black drop-shadow"
                            style={{ color: brandingKit.primary === swatch.hex ? "#fff" : "#000" }}
                          >
                            ✓
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Typography pair preview */}
              <div className="grid grid-cols-[auto_1fr] gap-3 items-center p-2 rounded-lg bg-muted/40 border border-border/40">
                <div className="text-center px-2">
                  <p
                    className="text-lg leading-none"
                    style={{ fontFamily: brandingKit.typography.headingFont }}
                  >
                    Aa
                  </p>
                  <p className="text-[8px] text-muted-foreground mt-0.5">Heading</p>
                </div>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold leading-tight truncate">
                    {brandingKit.typography.pairLabel}
                  </p>
                  <p
                    className="text-[10px] text-muted-foreground leading-snug truncate"
                    style={{ fontFamily: brandingKit.typography.bodyFont }}
                  >
                    The quick brown fox jumps over the lazy dog
                  </p>
                </div>
              </div>

              <p className="text-[10px] text-muted-foreground italic leading-snug">
                💡 {brandingKit.rule} {lockToTemplate
                  ? "Cambia template → palette e colore brand si aggiornano."
                  : "Sblocca-lock attivo: stai usando un colore custom fuori dalle regole."}
              </p>
            </div>

            {/* ────────────────────────────────────────────────────────── */}
            {/* MOCKUP LIBERO — Template + Preview on-demand               */}
            {/* Selettore template inline + bottone "Carica anteprima"     */}
            {/* per renderizzare la mini-preview solo quando richiesto.    */}
            {/* ────────────────────────────────────────────────────────── */}
            <div className="rounded-xl border border-border/60 bg-background/40 p-3 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <Label htmlFor="sa-template" className="text-xs font-semibold flex items-center gap-1.5 m-0">
                  <Palette className="h-3.5 w-3.5 text-primary" />
                  Template grafico
                </Label>
                {templateVariant === "auto" && businessSector && (
                  <Badge variant="outline" className="text-[9px]">
                    ✨ Auto: {TEMPLATE_VARIANTS.find(t => t.key === suggestTemplateForSector(businessSector))?.label.split(" — ")[0]}
                  </Badge>
                )}
              </div>

              <Select value={templateVariant} onValueChange={(v) => { setTemplateVariant(v); setStandalonePreviewLoaded(false); }}>
                <SelectTrigger id="sa-template" className="h-9 text-sm">
                  <SelectValue placeholder="Scegli un template…" />
                </SelectTrigger>
                <SelectContent className="max-h-[340px]">
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

              {/* Preview on-demand */}
              <div className="flex items-center justify-between gap-3 pt-1">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold">Anteprima al momento</p>
                  <p className="text-[10px] text-muted-foreground leading-snug">
                    {standalonePreviewLoaded
                      ? "Anteprima caricata · cambia template o colore per ricaricare."
                      : "Carica una mini-preview con i parametri scelti prima di generare."}
                  </p>
                </div>
                <Button
                  type="button"
                  size="sm"
                  variant={standalonePreviewLoaded ? "outline" : "default"}
                  className="shrink-0 gap-1.5 h-8"
                  disabled={standalonePreviewLoading || !standalone.sector.trim()}
                  onClick={() => {
                    setStandalonePreviewLoading(true);
                    // micro-delay per dare feedback visivo
                    setTimeout(() => {
                      setStandalonePreviewLoaded(true);
                      setStandalonePreviewLoading(false);
                    }, 350);
                  }}
                >
                  {standalonePreviewLoading ? (
                    <><Loader2 className="h-3 w-3 animate-spin" /> Carico…</>
                  ) : standalonePreviewLoaded ? (
                    <><Eye className="h-3 w-3" /> Ricarica</>
                  ) : (
                    <><Eye className="h-3 w-3" /> Carica anteprima</>
                  )}
                </Button>
              </div>

              {standalonePreviewLoaded && standalone.sector.trim() && (
                <div className="flex justify-center pt-1">
                  <div className="relative" style={{ width: 130, height: Math.round(130 * 19.5 / 9) }}>
                    <div
                      className="absolute -inset-2 rounded-[32px] opacity-30 blur-xl pointer-events-none"
                      style={{ background: standalone.primaryColor }}
                    />
                    <div
                      className="relative rounded-[24px] border-[2px] overflow-hidden shadow-xl bg-background"
                      style={{
                        width: 130,
                        height: Math.round(130 * 19.5 / 9),
                        borderColor: "hsl(var(--foreground) / 0.22)",
                        boxSizing: "border-box",
                      }}
                    >
                      <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[40px] h-[10px] bg-black rounded-full z-30" />
                      <div className="absolute inset-[2px] overflow-hidden rounded-[22px]">
                        <MockupReactScreen
                          type="home"
                          templateVariant={resolvedTemplateKey}
                          businessName={standalone.name || "Brand Demo"}
                          businessSector={standalone.sector || "Servizi"}
                          businessCity={standalone.city || ""}
                          primaryColor={standalone.primaryColor}
                          width={126}
                          height={Math.round(130 * 19.5 / 9) - 4}
                          glassIntensity={glassIntensity}
                          colorStyle={colorStyle}
                          safeAreaPx={Math.round(safeAreaPx * 0.4)}
                          typeScale={typeScale}
                          boostContrast={boostContrast}
                        />
                      </div>
                      <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[42px] h-[2px] bg-foreground/30 rounded-full z-20" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Riepilogo target */}
        {businessName && businessSector && (
          <div className="flex flex-wrap items-center gap-2 px-3 py-2 rounded-lg bg-primary/5 border border-primary/20">
            <Badge variant="default" className="text-xs">{businessName}</Badge>
            <Badge variant="outline" className="text-xs">{businessSector}</Badge>
            {businessCity && <Badge variant="outline" className="text-xs">{businessCity}</Badge>}
            <span
              className="inline-block w-4 h-4 rounded-full border"
              style={{ background: primaryColor }}
              title={primaryColor}
            />
          </div>
        )}

        {/* Selettore motore */}
        <div>
          <Label className="mb-2 block">Motore di generazione</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ENGINE_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const selected = engine === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setEngine(opt.key)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden group ${
                    selected ? "border-primary scale-[1.02] shadow-lg" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-${selected ? "20" : "5"} transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-foreground" />
                      <Badge variant={opt.cost === 0 ? "secondary" : "default"} className="text-xs">
                        {opt.cost === 0 ? "GRATIS" : `${opt.cost} crediti`}
                      </Badge>
                    </div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template variante (raggruppato) + ANTEPRIMA LIVE */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label htmlFor="template-variant" className="flex items-center gap-1.5">
              <Palette className="h-3.5 w-3.5" /> Stile grafico template
            </Label>
            <Badge variant="outline" className="text-[10px] gap-1"><Eye className="h-3 w-3" /> Anteprima live</Badge>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 items-start">
            <div className="space-y-3">
              <Select value={templateVariant} onValueChange={setTemplateVariant}>
                <SelectTrigger id="template-variant">
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
                <p className="text-[11px] text-muted-foreground">
                  ✨ Auto-rilevato dal settore: <span className="font-semibold text-foreground">{detectedTemplateLabel}</span>
                </p>
              )}

              {/* Palette swap rapido */}
              <div>
                <Label className="text-[11px] text-muted-foreground mb-1.5 block">Palette colore brand</Label>
                <div className="flex flex-wrap gap-1.5">
                  {QUICK_PALETTES.map(p => {
                    const active = (mode === "standalone" ? standalone.primaryColor : primaryColor).toLowerCase() === p.color.toLowerCase();
                    return (
                      <button
                        key={p.color}
                        type="button"
                        onClick={() => {
                          if (mode === "standalone") {
                            setStandalone(prev => ({ ...prev, primaryColor: p.color }));
                          } else {
                            // Lead mode: forziamo override locale via standalone state come "preview color"
                            setStandalone(prev => ({ ...prev, primaryColor: p.color }));
                          }
                        }}
                        title={p.label}
                        className={`relative w-7 h-7 rounded-full border-2 transition-all hover:scale-110 ${
                          active ? "border-foreground shadow-md scale-110" : "border-border"
                        }`}
                        style={{ background: p.color }}
                      >
                        {active && (
                          <span className="absolute inset-0 flex items-center justify-center text-white text-[10px] font-black drop-shadow">✓</span>
                        )}
                      </button>
                    );
                  })}
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">
                  Colore attuale:{" "}
                  <span className="font-mono font-semibold">
                    {(mode === "standalone" ? standalone.primaryColor : primaryColor).toUpperCase()}
                  </span>
                </p>
              </div>
            </div>

            {/* Anteprima live mini iPhone */}
            <div className="flex flex-col items-center gap-1.5 p-3 rounded-xl bg-muted/30 border">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Anteprima tema</p>
              <div className="relative" style={{ width: 110, height: Math.round(110 * 19.5 / 9) }}>
                <div
                  className="absolute -inset-2 rounded-[28px] opacity-30 blur-xl"
                  style={{ background: mode === "standalone" ? standalone.primaryColor : primaryColor }}
                />
                <div
                  className="relative rounded-[22px] border-[2px] overflow-hidden shadow-xl"
                  style={{
                    width: 110,
                    height: Math.round(110 * 19.5 / 9),
                    borderColor: "hsl(var(--foreground) / 0.2)",
                    boxSizing: "border-box",
                  }}
                >
                  <div className="absolute top-[3px] left-1/2 -translate-x-1/2 w-[34px] h-[8px] bg-black rounded-full z-30" />
                  <div className="absolute inset-[2px] overflow-hidden rounded-[20px]">
                    <MockupReactScreen
                      type="home"
                      templateVariant={templateVariant === "auto" ? suggestTemplateForSector(businessSector) : templateVariant}
                      businessName={businessName || "Brand Demo"}
                      businessSector={businessSector || "Servizi"}
                      businessCity={businessCity || ""}
                      primaryColor={mode === "standalone" ? standalone.primaryColor : primaryColor}
                      width={106}
                      height={Math.round(110 * 19.5 / 9) - 4}
                      glassIntensity={glassIntensity}
                      colorStyle={colorStyle}
                      safeAreaPx={Math.round(safeAreaPx * 0.4)}
                      typeScale={typeScale}
                      boostContrast={boostContrast}
                    />
                  </div>
                  <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[36px] h-[2px] bg-foreground/30 rounded-full z-20" />
                </div>
              </div>
              <p className="text-[9px] text-muted-foreground text-center mt-1 max-w-[120px]">
                Preview Home · cambia istantaneamente
              </p>
            </div>
          </div>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* PERSONALIZZAZIONE AVANZATA — glass intensity + color style         */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-primary/20 bg-gradient-to-br from-primary/[0.04] to-transparent p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Label className="flex items-center gap-1.5 m-0">
              <Sliders className="h-3.5 w-3.5 text-primary" /> Personalizzazione avanzata
            </Label>
            <button
              type="button"
              onClick={() => {
                setGlassIntensity(60); setColorStyle("vivid");
                setSafeAreaPx(8); setTypeScale(1); setBoostContrast(true);
              }}
              className="text-[10px] px-2 py-0.5 rounded-full border border-border/60 hover:border-primary hover:bg-primary/10 transition-colors"
            >
              Reset default
            </button>
          </div>

          {/* Glassmorphism slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="glass-slider" className="text-xs flex items-center gap-1.5 m-0">
                <Droplets className="h-3 w-3" /> Intensità glassmorphism
              </Label>
              <Badge variant="outline" className="text-[10px] font-mono">{glassIntensity}%</Badge>
            </div>
            <input
              id="glass-slider"
              type="range"
              min={0}
              max={100}
              step={5}
              value={glassIntensity}
              onChange={(e) => setGlassIntensity(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Solido</span>
              <span>Bilanciato</span>
              <span>Vetro intenso</span>
            </div>
          </div>

          {/* Color style segmented */}
          <div className="space-y-1.5">
            <Label className="text-xs m-0">Stile cromatico</Label>
            <div className="grid grid-cols-4 gap-1.5">
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
                    onClick={() => setColorStyle(opt.key)}
                    className={`px-2 py-2 rounded-lg border text-center transition-all ${
                      active
                        ? "border-primary bg-primary/10 shadow-sm scale-[1.02]"
                        : "border-border hover:border-primary/40"
                    }`}
                  >
                    <p className="text-[11px] font-bold leading-tight">{opt.label}</p>
                    <p className="text-[8px] text-muted-foreground leading-tight mt-0.5">{opt.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground italic">
            🎨 Clicca <span className="font-semibold not-italic">Genera Suite</span> per applicare queste impostazioni alle 4 schermate. L'anteprima live in alto si aggiorna istantaneamente.
          </p>
        </div>

        {/* ────────────────────────────────────────────────────────────────── */}
        {/* SAFE AREA & LEGGIBILITÀ — margini, tipografia, contrasto AA       */}
        {/* Garantiscono che testo e UI restino dentro il frame iPhone        */}
        {/* su qualsiasi template selezionato (auto + manuali).               */}
        {/* ────────────────────────────────────────────────────────────────── */}
        <div className="rounded-xl border border-accent/30 bg-gradient-to-br from-accent/[0.05] to-transparent p-4 space-y-4">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <Label className="flex items-center gap-1.5 m-0">
              <Eye className="h-3.5 w-3.5 text-accent-foreground" /> Safe Area & Leggibilità
            </Label>
            <Badge variant="outline" className="text-[9px] uppercase tracking-wider">
              {boostContrast ? "AA on" : "AA off"} · {typeScale.toFixed(2)}× · {safeAreaPx}px
            </Badge>
          </div>

          {/* Safe Area slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="safe-area-slider" className="text-xs flex items-center gap-1.5 m-0">
                Margine interno (safe-area)
              </Label>
              <Badge variant="outline" className="text-[10px] font-mono">{safeAreaPx}px</Badge>
            </div>
            <input
              id="safe-area-slider"
              type="range"
              min={0}
              max={24}
              step={2}
              value={safeAreaPx}
              onChange={(e) => setSafeAreaPx(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Edge-to-edge</span>
              <span>Bilanciato</span>
              <span>Massima sicurezza</span>
            </div>
          </div>

          {/* Type scale slider */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="type-scale-slider" className="text-xs flex items-center gap-1.5 m-0">
                Dimensione tipografia
              </Label>
              <Badge variant="outline" className="text-[10px] font-mono">{typeScale.toFixed(2)}×</Badge>
            </div>
            <input
              id="type-scale-slider"
              type="range"
              min={0.85}
              max={1.20}
              step={0.05}
              value={typeScale}
              onChange={(e) => setTypeScale(Number(e.target.value))}
              className="w-full h-2 bg-muted rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-[9px] text-muted-foreground">
              <span>Compatta (0.85×)</span>
              <span>Standard (1.00×)</span>
              <span>Maxi (1.20×)</span>
            </div>
          </div>

          {/* Contrast toggle */}
          <div className="flex items-start justify-between gap-3 p-2.5 rounded-lg bg-muted/40 border border-border/40">
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold leading-tight">Boost contrasto AA</p>
              <p className="text-[10px] text-muted-foreground leading-snug mt-0.5">
                Forza testo e didascalie a contrasto WCAG AA su qualsiasi sfondo del template.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBoostContrast(v => !v)}
              role="switch"
              aria-checked={boostContrast}
              className={`shrink-0 relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                boostContrast ? "bg-primary" : "bg-muted-foreground/30"
              }`}
            >
              <span
                className={`inline-block h-3.5 w-3.5 transform rounded-full bg-background shadow transition-transform ${
                  boostContrast ? "translate-x-5" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          <p className="text-[10px] text-muted-foreground italic">
            🛡️ Validazione: nessun testo finisce sotto la Dynamic Island o l'Home Indicator. Ottimale per AI-render 4K/8K.
          </p>
        </div>

        {/* 4 schermate configurabili */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <Label>Schermate da generare (4 mockup)</Label>
            <button
              type="button"
              onClick={() => setAutoScreens(v => !v)}
              className={`text-[10px] px-2 py-1 rounded-full font-semibold transition-colors ${
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
                  onValueChange={(v) => {
                    setAutoScreens(false);
                    setScreens(prev => prev.map((x, j) => j === i ? { ...x, type: v as ScreenType, title: SCREEN_TYPES.find(t => t.key === v)?.label || x.title } : x));
                  }}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
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
                  onChange={e => {
                    setAutoScreens(false);
                    setScreens(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x));
                  }}
                  placeholder="Titolo"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleGenerate}
          disabled={generating || !businessName?.trim() || !businessSector?.trim()}
          size="lg"
          className="w-full"
        >
          {generating ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generazione 4 mockup in corso…</>
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
              </div>
              {previewPhase === "upgrading" ? (
                <Badge variant="outline" className="gap-1.5 animate-pulse">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  Upgrade AI…
                </Badge>
              ) : (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={copyShareLink} disabled={!result.share_slug}>
                    <Copy className="h-3 w-3 mr-1" />Link
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.open(`${window.location.origin}/preview/mockup/${result.share_slug}`, "_blank")}
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
