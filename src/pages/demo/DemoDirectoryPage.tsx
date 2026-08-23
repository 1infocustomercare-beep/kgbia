import { useState, useMemo, useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { SECTOR_MOCKUP_CATALOG, getSectorHeroImages, type MockupImage } from "@/config/demoSiteMockups";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { getSectorGroup } from "@/data/sector-mockups";
import { Input } from "@/components/ui/input";
import { GlassCard, GlassButton, GlassInput } from "@/components/glass";
import {
  ArrowLeft, Search, ArrowRight, ChevronDown, ChevronUp, Crown,
  ChefHat, Car, Scissors, Heart, Store, Dumbbell, Building,
  Umbrella, Wrench, Zap, Wheat, SprayCan, Scale, Calculator,
  Settings, Camera, HardHat, Flower2, Stethoscope, Pen,
  Baby, GraduationCap, PartyPopper, Truck, Puzzle, Sparkles, Eye,
  ChevronLeft, ChevronRight as ChevronRightIcon, Images,
  Trees, Cog, Leaf, Plane
} from "lucide-react";
import { buildPublicSiteUrl } from "@/lib/public-site-path";
import privateJetHangar from "@/assets/hero-cinematic/private-jet-hangar.jpg";
import aureliaCardHero from "@/assets/demo-aurelia/aurelia-card-hero.jpg";
import PrestigeTheme from "@/components/empire-home/prestige/PrestigeTheme";


const ALL_INDUSTRIES = Object.keys(INDUSTRY_CONFIGS) as IndustryId[];

/* ═══ Lucide icon mapping — w-4 h-4 for compact premium nodes ═══ */
const INDUSTRY_ICONS: Record<string, React.ReactNode> = {
  ChefHat: <ChefHat className="w-4 h-4" />,
  Car: <Car className="w-4 h-4" />,
  Scissors: <Scissors className="w-4 h-4" />,
  Heart: <Heart className="w-4 h-4" />,
  Store: <Store className="w-4 h-4" />,
  Dumbbell: <Dumbbell className="w-4 h-4" />,
  Building: <Building className="w-4 h-4" />,
  Umbrella: <Umbrella className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  Zap: <Zap className="w-4 h-4" />,
  Wheat: <Wheat className="w-4 h-4" />,
  SprayCan: <SprayCan className="w-4 h-4" />,
  SprayCanIcon: <SprayCan className="w-4 h-4" />,
  Scale: <Scale className="w-4 h-4" />,
  Calculator: <Calculator className="w-4 h-4" />,
  Settings: <Settings className="w-4 h-4" />,
  Camera: <Camera className="w-4 h-4" />,
  HardHat: <HardHat className="w-4 h-4" />,
  Flower2: <Flower2 className="w-4 h-4" />,
  Stethoscope: <Stethoscope className="w-4 h-4" />,
  Pen: <Pen className="w-4 h-4" />,
  Baby: <Baby className="w-4 h-4" />,
  GraduationCap: <GraduationCap className="w-4 h-4" />,
  PartyPopper: <PartyPopper className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  Puzzle: <Puzzle className="w-4 h-4" />,
  Trees: <Trees className="w-4 h-4" />,
  Cog: <Cog className="w-4 h-4" />,
  Leaf: <Leaf className="w-4 h-4" />,
};

function getIcon(iconName: string) {
  return INDUSTRY_ICONS[iconName] || <Puzzle className="w-4 h-4" />;
}

function uniqueImageSources(sources: Array<string | null | undefined>) {
  return Array.from(new Set(sources.filter((source): source is string => Boolean(source && source.trim()))));
}

/* ═══ Premium portfolio mockups (studio, 4-screen sequences) ═══ */
type PremiumShot = { url: string; label: string; caption: string; brand: string };

function getPremiumSectorShots(sectorId: string): PremiumShot[] {
  const group = getSectorGroup(sectorId);
  if (!group) return [];
  const ordered = [
    ...group.variants.filter((v) => v.tier === "primary"),
    ...group.variants.filter((v) => v.tier !== "primary"),
  ];
  const seen = new Set<string>();
  const shots: PremiumShot[] = [];
  ordered.forEach((variant) => {
    variant.screens.forEach((screen) => {
      if (!screen.image || seen.has(screen.image)) return;
      seen.add(screen.image);
      shots.push({ url: screen.image, label: screen.label, caption: screen.caption, brand: variant.brand });
    });
  });
  return shots;
}


/* ═══ Hero Phone Showcase — rotating sector previews in iPhone frame ═══ */
const HERO_SECTORS: { id: IndustryId; label: string; color: string }[] = [
  { id: "food", label: "Food", color: "25 95% 53%" },
  { id: "beauty", label: "Beauty", color: "300 60% 60%" },
  { id: "ncc", label: "NCC", color: "43 70% 54%" },
  { id: "fitness", label: "Fitness", color: "142 60% 50%" },
  { id: "hospitality", label: "Hotel", color: "220 70% 55%" },
  { id: "healthcare", label: "Healthcare", color: "174 60% 50%" },
];

const HeroPhoneShowcase = ({ navigate }: { navigate: (p: string) => void }) => {
  const [activeIdx, setActiveIdx] = useState(0);
  const [imageIdx, setImageIdx] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setActiveIdx(i => (i + 1) % HERO_SECTORS.length), 3000);
    return () => clearInterval(timer);
  }, []);

  const sector = HERO_SECTORS[activeIdx];
  const heroImageSources = useMemo(
    () => uniqueImageSources([
      ...getPremiumSectorShots(sector.id).map((shot) => shot.url),
      ...(SECTOR_MOCKUP_IMAGES[sector.id] || []),
      ...getSectorHeroImages(sector.id),
      SECTOR_MOCKUP_CATALOG[sector.id]?.heroImage,
    ]),
    [sector.id]
  );
  const currentImage = heroImageSources[imageIdx] || "";

  useEffect(() => {
    setImageIdx(0);
  }, [sector.id]);

  const onHeroImageError = useCallback(() => {
    setImageIdx((prev) => Math.min(prev + 1, heroImageSources.length));
  }, [heroImageSources.length]);

  return (
    <div className="pglass pglass-lift relative z-10 mx-4 mt-5 mb-6 overflow-hidden rounded-[1.75rem]">
      {/* Ambient aura Empire — aqua costante + micro tinta di settore */}
      <div
        className="pointer-events-none absolute top-[-30%] right-[5%] h-[220px] w-[220px] rounded-full"
        style={{
          background: `radial-gradient(circle, hsl(${sector.color} / 0.10), transparent 62%)`,
          filter: "blur(60px)",
          transition: "background 1s ease",
        }}
      />
      <div
        className="pointer-events-none absolute bottom-[-20%] left-[8%] h-[180px] w-[180px] rounded-full"
        style={{ background: "radial-gradient(circle, hsl(var(--pr-aqua) / 0.14), transparent 62%)", filter: "blur(50px)" }}
      />


      <div className="relative flex flex-col sm:flex-row items-center gap-4 px-5 py-8 sm:px-10 sm:py-10" style={{ zIndex: 2 }}>
        {/* Left: Text */}
        <div className="flex-1 text-center sm:text-left">
          <div className="pglass-chip mb-3 inline-flex items-center gap-1.5">
            <Sparkles className="h-3 w-3" />
            <span className="text-[11px] font-bold uppercase tracking-widest">25+ Settori</span>
          </div>

          <h2 className="mb-2 font-heading text-xl font-semibold leading-tight text-foreground sm:text-2xl">
            Il tuo business,<br />
            <span className="pglass-aqua-text">digitalizzato.</span>
          </h2>
          <p className="mb-5 max-w-sm text-xs text-foreground/70 sm:text-sm">
            Dashboard IA, ordini, prenotazioni e CRM — pronto in 5 minuti per ogni settore.
          </p>

          {/* Sector pills — vetro Empire, accento aqua sull'attivo */}
          <div className="mb-5 flex flex-wrap justify-center gap-1.5 sm:justify-start">
            {HERO_SECTORS.map((s, i) => (
              <button key={s.id} onClick={() => setActiveIdx(i)}
                className="rounded-full px-2.5 py-1 text-[11px] font-semibold tracking-wide transition-all duration-300"
                style={{
                  background: i === activeIdx ? "hsl(var(--pr-aqua) / 0.18)" : "hsl(0 0% 100% / 0.05)",
                  border: `1px solid ${i === activeIdx ? "hsl(var(--pr-aqua) / 0.5)" : "hsl(0 0% 100% / 0.12)"}`,
                  color: i === activeIdx ? "hsl(var(--pr-aqua))" : "hsl(var(--foreground) / 0.7)",
                  backdropFilter: "blur(14px)",
                }}>
                {s.label}
              </button>
            ))}
          </div>


          <div className="flex gap-2.5 justify-center sm:justify-start">
            <GlassButton size="sm" onClick={() => navigate("/auth")}>
              Inizia Omaggio <ArrowRight className="w-3.5 h-3.5" />
            </GlassButton>
            <GlassButton
              size="sm"
              variant="ghost"
              onClick={() => { const el = document.getElementById("demo-list"); el?.scrollIntoView({ behavior: "smooth" }); }}
            >
              <Eye className="w-3.5 h-3.5" /> Vedi Demo
            </GlassButton>
          </div>

        </div>

        {/* Right: iPhone with rotating preview */}
        <div className="relative flex-shrink-0 w-[180px] sm:w-[200px]">
          {/* Glow behind phone */}
          <div className="absolute inset-0 rounded-[2rem]" style={{
            background: `radial-gradient(ellipse at center, hsl(var(--pr-aqua) / 0.18), hsl(${sector.color} / 0.10) 45%, transparent 72%)`,
            filter: "blur(30px)", transform: "scale(1.3)", transition: "background 1s ease"
          }} />
          {/* iPhone frame */}
          <div className="relative rounded-[2rem] overflow-hidden border-[3px]"
            style={{
              borderColor: "hsl(var(--pr-aqua) / 0.28)",
              boxShadow: "0 24px 60px -24px hsl(196 60% 3% / 0.75), 0 0 32px hsl(var(--pr-aqua) / 0.18)",
              aspectRatio: "9/19.5",
              background: "hsl(200 24% 5%)",
              transition: "box-shadow 1s ease",
            }}>
            {/* Notch */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[35%] h-[3.5%] rounded-b-xl z-20" style={{ background: "hsl(200 24% 5%)" }} />

            {/* Screen */}
            <AnimatePresence mode="wait">
              {currentImage ? (
                <motion.img
                  key={`${sector.id}-${imageIdx}`}
                  src={currentImage}
                  alt={sector.label}
                  className="absolute inset-0 w-full h-full object-cover object-top"
                  initial={{ opacity: 0, scale: 1.05 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  onError={onHeroImageError}
                />
              ) : (
                <motion.div
                  key={`${sector.id}-fallback`}
                  className="absolute inset-0 flex items-center justify-center text-white/70"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  {getIcon(INDUSTRY_CONFIGS[sector.id].icon)}
                </motion.div>
              )}
            </AnimatePresence>
            {/* Screen overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-black/10" />
            {/* Home indicator */}
            <div className="absolute bottom-[2%] left-1/2 -translate-x-1/2 w-[30%] h-[3px] rounded-full bg-white/20" />
          </div>
          {/* Sector label floating */}
          <motion.div
            key={sector.id + "-label"}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase whitespace-nowrap"
            style={{
              background: `hsla(${sector.color} / 0.2)`,
              border: `1px solid hsla(${sector.color} / 0.4)`,
              color: `hsl(${sector.color})`,
              backdropFilter: "blur(10px)",
            }}>
            {sector.label}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

/* ═══ FEATURED DEMOS ═══ */
const FEATURED_DEMOS = [
  { id: "food" as IndustryId, name: "Food & Ristorazione", tagline: "Menu Digitale · Ordini · QR · Cucina Live", route: "/r/impero-roma", color: "#e85d04" },
  { id: "ncc" as IndustryId, name: "NCC & Trasporto Premium", tagline: "Flotta · Tratte · Booking · Autisti", route: "/b/amalfi-luxury-transfer", color: "#C9A84C" },
];

function PrivateJetDemoCard({ onOpen }: { onOpen: () => void }) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      className="group relative mb-6 overflow-hidden rounded-[1.75rem]"
      style={{
        border: "1px solid hsla(43,60%,60%,0.24)",
        boxShadow: "0 30px 70px -35px hsla(196,70%,10%,0.75), inset 0 1px 0 hsla(43,60%,70%,0.12)",
      }}
    >
      <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
        <img
          src={privateJetHangar}
          alt="Aurea Jet, demo charter privato"
          width={1920}
          height={1088}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-out will-change-transform group-hover:scale-[1.06]"
        />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(120% 90% at 78% 26%, hsla(43,70%,60%,0.18), transparent 60%)" }} />
        <div className="pointer-events-none absolute inset-0"
          style={{ background: "linear-gradient(to top, hsl(196 24% 5%) 4%, hsla(196,24%,6%,0.88) 38%, hsla(196,22%,7%,0.28) 68%, transparent 100%)" }} />
        <div className="pointer-events-none absolute inset-0 opacity-60"
          style={{ background: "linear-gradient(100deg, hsla(196,26%,4%,0.92) 0%, hsla(196,26%,5%,0.35) 45%, transparent 70%)" }} />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, hsla(43,70%,68%,0.5), transparent)" }} />

        <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8">
          <div className="mb-3 flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white"
              style={{ background: "hsla(43,60%,45%,0.24)", border: "1px solid hsla(43,65%,62%,0.4)" }}>
              <Plane className="h-2.5 w-2.5" />
              Cinematic
            </span>
            <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/55">Jet Privato</span>
          </div>
          <h2 className="font-heading text-[1.7rem] font-semibold leading-[1.05] text-white sm:text-[2.75rem]"
            style={{ textShadow: "0 6px 30px hsla(196,40%,2%,0.85)" }}>
            Aurea Jet
          </h2>
          <p className="mt-2 max-w-lg text-[0.78rem] leading-relaxed text-white/78 sm:text-sm">
            Noleggio jet privato · Charter globale · Concierge 24/7 — hero scroll con flyby ultrarealistico.
          </p>
          <div className="mt-4 flex items-center gap-2.5">
            <button
              onClick={onOpen}
              className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform duration-300 group-hover:translate-x-1"
              style={{ background: "linear-gradient(135deg, hsl(43 62% 44%), hsl(35 55% 34%))", boxShadow: "0 10px 30px -12px hsla(43,80%,50%,0.65)" }}
            >
              Apri demo <ArrowRight className="h-3.5 w-3.5" />
            </button>
            <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/45 sm:inline">Webapp completa · desktop &amp; iPhone</span>
          </div>
        </div>
      </div>
    </motion.article>
  );
}


/* ═══ Mockup Gallery Component ═══ */
function MockupGallery({ sectorId, color }: { sectorId: string; color: string }) {
  const [idx, setIdx] = useState(0);
  const [brokenUrls, setBrokenUrls] = useState<Set<string>>(new Set());
  const catalog = SECTOR_MOCKUP_CATALOG[sectorId];
  const curatedImages = SECTOR_MOCKUP_IMAGES[sectorId as IndustryId] || [];

  // Premium portfolio mockups first (studio 4-screen sequences), legacy catalog as fallback
  const allImages = useMemo(() => {
    type GalleryImage = MockupImage & { label?: string; caption?: string; brand?: string };

    const premium: GalleryImage[] = getPremiumSectorShots(sectorId).map((shot) => ({
      url: shot.url,
      type: "home",
      style: shot.brand,
      device: "mobile",
      label: shot.label,
      caption: shot.caption,
      brand: shot.brand,
    }));

    const curated: GalleryImage[] = curatedImages.map((url, index) => ({
      url,
      type: "home",
      style: `priority-${index + 1}`,
      device: "mobile",
    }));

    const homes: GalleryImage[] = [];
    const rest: GalleryImage[] = [];
    catalog?.projects.forEach(p => {
      p.images.forEach(img => {
        if (img.type === "home") homes.push(img);
        else rest.push(img);
      });
    });

    const merged = premium.length > 0
      ? [...premium, ...curated, ...homes, ...rest]
      : [...curated, ...homes, ...rest];
    const unique = new Map<string, GalleryImage>();
    merged.forEach((image) => {
      if (!unique.has(image.url)) unique.set(image.url, image);
    });
    return Array.from(unique.values());
  }, [catalog, curatedImages, sectorId]);

  useEffect(() => {
    setBrokenUrls(new Set());
    setIdx(0);
  }, [sectorId]);

  const markAsBroken = useCallback((url: string | undefined) => {
    if (!url) return;
    setBrokenUrls((prev) => {
      if (prev.has(url)) return prev;
      const next = new Set(prev);
      next.add(url);
      return next;
    });
  }, []);

  const displayImages = useMemo(
    () => allImages.filter((image) => !brokenUrls.has(image.url)),
    [allImages, brokenUrls]
  );
  const count = displayImages.length;

  useEffect(() => {
    if (idx >= count && count > 0) {
      setIdx(count - 1);
    }
  }, [count, idx]);

  if (count === 0) {
    return (
      <div className="text-center py-6 text-foreground/50 text-xs">
        <Images className="w-6 h-6 mx-auto mb-2 opacity-50" />
        Preview in arrivo
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main image */}
      <div className="relative rounded-xl overflow-hidden mx-auto max-w-[280px]"
        style={{ aspectRatio: "9/19.5", boxShadow: `0 8px 40px ${color}15, 0 0 0 1px ${color}20` }}>
        <img
          src={displayImages[idx]?.url}
          alt={`Mockup ${idx + 1}`}
          className="w-full h-full object-cover"
          loading="lazy"
          onError={() => markAsBroken(displayImages[idx]?.url)}
        />
        {/* Nav arrows */}
        {count > 1 && (
          <>
            <button onClick={() => setIdx((idx - 1 + count) % count)}
              className="absolute left-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors"
              aria-label="Precedente">
              <ChevronLeft className="w-3.5 h-3.5 text-white" />
            </button>
            <button onClick={() => setIdx((idx + 1) % count)}
              className="absolute right-1.5 top-1/2 -translate-y-1/2 w-7 h-7 rounded-full flex items-center justify-center bg-black/60 hover:bg-black/80 transition-colors"
              aria-label="Successivo">
              <ChevronRightIcon className="w-3.5 h-3.5 text-white" />
            </button>
          </>
        )}
        {/* Brand + screen label */}
        {(displayImages[idx] as { brand?: string; label?: string })?.brand && (
          <div className="absolute top-2 left-2 right-2 flex flex-wrap gap-1">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold text-white bg-black/55 backdrop-blur-sm">
              {(displayImages[idx] as { brand?: string }).brand}
            </span>
            {(displayImages[idx] as { label?: string }).label && (
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold text-white/90"
                style={{ background: `${color}55`, backdropFilter: "blur(6px)" }}>
                {(displayImages[idx] as { label?: string }).label}
              </span>
            )}
          </div>
        )}
        {/* Counter badge */}
        <div className="absolute bottom-2 right-2 px-2 py-0.5 rounded-full text-[10px] font-bold text-white/90 bg-black/50 backdrop-blur-sm">
          {idx + 1}/{count}
        </div>
      </div>

      {/* Caption */}
      {(displayImages[idx] as { caption?: string })?.caption && (
        <p className="text-[11px] text-foreground/70 text-center max-w-[300px] mx-auto leading-snug">
          {(displayImages[idx] as { caption?: string }).caption}
        </p>
      )}

      {/* Thumbnail strip */}
      {count > 1 && (
        <div className="flex gap-1.5 overflow-x-auto pb-1 px-1 scrollbar-hide justify-center">
          {displayImages.slice(0, 12).map((img, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className="flex-shrink-0 w-[34px] rounded-md overflow-hidden transition-all duration-200"
              style={{
                aspectRatio: "9/19.5",
                border: i === idx ? `2px solid ${color}` : "1px solid hsla(0,0%,100%,0.1)",
                opacity: i === idx ? 1 : 0.55,
              }}>
              <img src={img.url} alt="" className="w-full h-full object-cover object-top" loading="lazy" onError={() => markAsBroken(img.url)} />
            </button>
          ))}
        </div>
      )}


      {/* Mockup count badge */}
      <div className="flex justify-center">
        <span className="text-[11px] px-2.5 py-1 rounded-full font-semibold text-foreground/70"
          style={{ background: `${color}15`, border: `1px solid ${color}25` }}>
          <Images className="w-3 h-3 inline mr-1 -mt-0.5" />
          {`${count} mockup premium`}
        </span>
      </div>
    </div>
  );
}

/* ═══ SECTOR CATEGORIES for grouping ═══ */
const SECTOR_CATEGORIES = [
  { label: "In Evidenza", ids: ["food", "ncc"] as IndustryId[] },
  { label: "Benessere & Salute", ids: ["beauty", "healthcare", "fitness", "veterinary"] as IndustryId[] },
  { label: "Ospitalità", ids: ["hospitality", "beach", "agriturismo"] as IndustryId[] },
  { label: "Commercio", ids: ["retail"] as IndustryId[] },
  { label: "Servizi Professionali", ids: ["legal", "accounting", "photography", "education", "childcare"] as IndustryId[] },
  { label: "Artigianato & Tecnici", ids: ["plumber", "electrician", "construction", "gardening", "cleaning", "garage", "tattoo"] as IndustryId[] },
  { label: "Trasporti & Logistica", ids: ["logistics"] as IndustryId[] },
  { label: "Eventi & Altro", ids: ["events", "custom"] as IndustryId[] },
];

export default function DemoDirectoryPage() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [expandedSector, setExpandedSector] = useState<IndustryId | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) return ALL_INDUSTRIES;
    const q = search.toLowerCase();
    return ALL_INDUSTRIES.filter(id => {
      const cfg = INDUSTRY_CONFIGS[id];
      const demo = DEMO_INDUSTRY_DATA[id];
      return cfg.label.toLowerCase().includes(q) || cfg.description.toLowerCase().includes(q) || demo.companyName.toLowerCase().includes(q);
    });
  }, [search]);

  /**
   * Apre SEMPRE il sito pubblico reale del settore (quello che converte il cliente):
   * food → /r/:slug, tutti gli altri settori → /b/:slug (template per industry).
   */
  const navigateToDemo = (id: IndustryId) => {
    const slug = DEMO_SLUGS[id];
    if (id === "food") navigate(`/r/${slug}`);
    else navigate(`/b/${slug}`);
  };


  const isFeatured = (id: IndustryId) => FEATURED_DEMOS.some(f => f.id === id);
  const getFeatured = (id: IndustryId) => FEATURED_DEMOS.find(f => f.id === id);

  return (
    <div className="pglass-scope prestige-root min-h-screen relative [overflow-x:clip] landing-dark force-dark" style={{ background: "linear-gradient(180deg, hsl(196 20% 5%) 0%, hsl(196 18% 7%) 30%, hsl(196 16% 6%) 60%, hsl(196 20% 5%) 100%)" }}>
      <PrestigeTheme />
      {/* ═══ PREMIUM BACKGROUND — fully opaque, no DNA bleed ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0 pglass-wave">
        {/* Rich gradient base */}
        <div className="absolute inset-0" style={{
          background: "linear-gradient(165deg, hsl(196 20% 6%) 0%, hsl(196 18% 8%) 20%, hsl(196 16% 7%) 40%, hsl(196 20% 9%) 60%, hsl(196 18% 6%) 80%, hsl(196 20% 5%) 100%)"
        }} />

        {/* Ambient orbs — deep, rich, luxurious */}
        <div className="absolute top-[-10%] right-[-5%] w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(190,45%,25%,0.12), transparent 60%)", filter: "blur(180px)" }} />
        <div className="absolute bottom-[-5%] left-[-10%] w-[600px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(178,40%,22%,0.1), transparent 60%)", filter: "blur(160px)" }} />
        <div className="absolute top-[40%] left-[50%] w-[500px] h-[500px] rounded-full"
          style={{ background: "radial-gradient(circle, hsla(200,35%,20%,0.06), transparent 60%)", filter: "blur(140px)" }} />

        {/* Subtle geometric grid */}
        <div className="absolute inset-0 opacity-[0.018]"
          style={{
            backgroundImage: `linear-gradient(hsla(190,40%,60%,0.08) 1px, transparent 1px), linear-gradient(90deg, hsla(190,40%,60%,0.08) 1px, transparent 1px)`,
            backgroundSize: "80px 80px"
          }} />

        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 10%, hsla(190,50%,50%,0.15) 30%, hsla(178,45%,50%,0.12) 50%, hsla(190,50%,50%,0.1) 70%, transparent 90%)" }} />
      </div>

      {/* ═══ HEADER — barra vetro Empire ═══ */}
      <div className="pglass-stickybar sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 py-3.5 flex items-center gap-3">
          <button onClick={() => navigate("/")} aria-label="Torna alla home"
            className="pglass-icon-btn w-11 h-11">
            <ArrowLeft className="w-4 h-4 text-foreground/85" />
          </button>

          <div className="flex-1 min-w-0">
            <h1 className="text-base font-bold text-foreground font-heading tracking-tight">Esplora i Settori</h1>
            <p className="text-[0.72rem] sm:text-xs text-foreground/90 tracking-wide">{ALL_INDUSTRIES.length} demo live · Preview interattive</p>
          </div>
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full border border-primary/45 bg-primary/20 shadow-sm shadow-primary/20">
            <div className="w-1.5 h-1.5 rounded-full animate-pulse bg-primary" />
            <span className="text-[11px] font-bold tracking-wider text-foreground">LIVE</span>
          </div>
        </div>
      </div>

      {/* ═══ HERO CTA — iPhone with rotating sector previews ═══ */}
      <HeroPhoneShowcase navigate={navigate} />

      <div id="demo-list" className="max-w-5xl mx-auto px-4 pt-2 pb-[calc(6rem+env(safe-area-inset-bottom))] relative z-10">
        <PrivateJetDemoCard onOpen={() => navigate("/demo/aurea-jet")} />
        <button
          onClick={() => navigate("/demo/aurelia-motori")}
          className="group relative mb-6 block w-full overflow-hidden rounded-[1.75rem] text-left"
          style={{
            background: "linear-gradient(135deg, hsl(220 30% 5%), hsl(168 30% 8%))",
            border: "1px solid hsla(160,60%,45%,0.22)",
            boxShadow: "0 30px 70px -35px hsla(160,70%,25%,0.55), inset 0 1px 0 hsla(160,60%,70%,0.12)"
          }}
        >
          <div className="relative aspect-[16/10] w-full sm:aspect-[21/9]">
            <img
              src={aureliaCardHero}
              alt="Showroom notturno Aurelia Motori: coupé smeraldo con luci lineari e riflessi sul pavimento"
              loading="lazy"
              width={1600}
              height={912}
              className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-[1400ms] ease-out will-change-transform group-hover:scale-[1.06]"
            />
            {/* grading cinematografico coerente con il sito demo */}
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "radial-gradient(120% 90% at 78% 30%, hsla(160,80%,45%,0.20), transparent 60%)" }} />
            <div className="pointer-events-none absolute inset-0"
              style={{ background: "linear-gradient(to top, hsl(220 32% 4%) 4%, hsla(220,32%,5%,0.88) 38%, hsla(220,30%,6%,0.28) 68%, transparent 100%)" }} />
            <div className="pointer-events-none absolute inset-0 opacity-60"
              style={{ background: "linear-gradient(100deg, hsla(220,32%,4%,0.92) 0%, hsla(220,32%,4%,0.35) 45%, transparent 70%)" }} />
            <div className="pointer-events-none absolute inset-x-0 top-0 h-px"
              style={{ background: "linear-gradient(90deg, transparent, hsla(160,70%,60%,0.5), transparent)" }} />

            <div className="absolute inset-0 z-10 flex flex-col justify-end p-5 sm:p-8">
              <div className="mb-3 flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.22em] text-white"
                  style={{ background: "hsla(160,70%,35%,0.28)", border: "1px solid hsla(160,70%,55%,0.4)" }}>
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: "hsl(158 80% 55%)" }} />
                  Live 360°
                </span>
                <span className="text-[9px] font-semibold uppercase tracking-[0.26em] text-white/55">Automotive</span>
              </div>
              <h2 className="font-heading text-[1.7rem] font-semibold leading-[1.05] text-white sm:text-[2.75rem]"
                style={{ textShadow: "0 6px 30px hsla(220,40%,2%,0.85)" }}>
                Aurelia Motori
              </h2>
              <p className="mt-2 max-w-lg text-[0.78rem] leading-relaxed text-white/78 sm:text-sm">
                Concessionaria &amp; officina · showroom con rotazione 360° reale, test drive, permuta IA e agenda ponti.
              </p>
              <div className="mt-4 flex items-center gap-2.5">
                <span className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-white transition-transform duration-300 group-hover:translate-x-1"
                  style={{ background: "linear-gradient(135deg, hsl(160 70% 32%), hsl(172 60% 26%))", boxShadow: "0 10px 30px -12px hsla(160,80%,40%,0.7)" }}>
                  Apri demo <ArrowRight className="h-3.5 w-3.5" />
                </span>
                <span className="hidden text-[10px] uppercase tracking-[0.2em] text-white/45 sm:inline">Webapp completa · desktop &amp; iPhone</span>
              </div>
            </div>
          </div>
        </button>

        {/* ═══ SEARCH ═══ */}
        <div className="mb-6">
          <GlassInput
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Cerca settore..."
            aria-label="Cerca settore"
            icon={<Search className="w-4 h-4" />}
          />
        </div>


        {/* ═══ CONTENT ═══ */}
        {search.trim() ? (
          /* Flat filtered list */
          <div className="space-y-2">
            {filtered.map((id, i) => (
              <SectorCard key={id} id={id} index={i} isExpanded={expandedSector === id}
                onToggle={() => setExpandedSector(expandedSector === id ? null : id)}
                onNavigate={navigateToDemo} isFeatured={isFeatured(id)} featured={getFeatured(id)} />
            ))}
            {filtered.length === 0 && (
              <GlassCard variant="soft" lift={false} className="px-6 py-14 text-center">
                <p className="text-foreground/70 text-sm">Nessun settore trovato per "{search}"</p>
              </GlassCard>
            )}

          </div>
        ) : (
          /* Categorized view */
          <div className="space-y-8">
            {SECTOR_CATEGORIES.map((cat, ci) => {
              const categoryIndustries = cat.ids.filter(id => ALL_INDUSTRIES.includes(id));
              if (categoryIndustries.length === 0) return null;
              return (
                <div key={cat.label} className="pglass-reveal">
                  {/* Category header — micro-ondeggio decorativo (solo linee, testo fermo) */}
                  <div className="flex items-center gap-2.5 mb-3 px-1">
                    <div className={`h-px flex-1 max-w-[20px] pglass-drift${ci % 2 ? " pglass-drift-alt" : ""}`}
                      style={{ background: "linear-gradient(90deg, hsla(190,40%,50%,0.25), transparent)" }} />
                    <span className="text-[0.64rem] font-bold tracking-[2.5px] uppercase text-foreground/90">{cat.label}</span>
                    <div className={`h-px flex-1 pglass-drift${ci % 2 ? "" : " pglass-drift-alt"}`}
                      style={{ background: "linear-gradient(90deg, transparent, hsla(190,30%,40%,0.08))" }} />
                  </div>


                  <div className="space-y-2">
                    {categoryIndustries.map((id, i) => (
                      <SectorCard key={id} id={id} index={i} isExpanded={expandedSector === id}
                        onToggle={() => setExpandedSector(expandedSector === id ? null : id)}
                        onNavigate={navigateToDemo} isFeatured={isFeatured(id)} featured={getFeatured(id)} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ SECTOR CARD COMPONENT ═══ */
function SectorCard({ id, index, isExpanded, onToggle, onNavigate, isFeatured, featured }: {
  id: IndustryId;
  index: number;
  isExpanded: boolean;
  onToggle: () => void;
  onNavigate: (id: IndustryId) => void;
  isFeatured: boolean;
  featured?: { name: string; tagline: string; route: string; color: string };
}) {
  const navigate = useNavigate();
  const cfg = INDUSTRY_CONFIGS[id];
  const demo = DEMO_INDUSTRY_DATA[id];
  const color = featured?.color || cfg.defaultPrimaryColor;
  const label = featured?.name || cfg.label;
  const subtitle = featured?.tagline || `${demo.companyName} · ${cfg.description}`;
  const route = featured?.route || (id === "food" ? `/r/${DEMO_SLUGS[id]}` : `/b/${DEMO_SLUGS[id]}`);
  const previewSources = useMemo(
    () => uniqueImageSources([
      ...getPremiumSectorShots(id).map((shot) => shot.url),
      ...getSectorHeroImages(id),
      ...(SECTOR_MOCKUP_IMAGES[id] || []),
      SECTOR_MOCKUP_CATALOG[id]?.heroImage,
    ]),
    [id]
  );
  const [previewIdx, setPreviewIdx] = useState(0);
  const previewUrl = previewSources[previewIdx] || "";

  useEffect(() => {
    setPreviewIdx(0);
  }, [id]);

  const onPreviewError = useCallback(() => {
    setPreviewIdx((prev) => Math.min(prev + 1, previewSources.length));
  }, [previewSources.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.025 }}>
      <div
        className={`pglass-lift relative rounded-2xl overflow-hidden group transition-all duration-300 ${isExpanded ? "ring-1" : ""}`}
        style={{
          background: isFeatured
            ? `linear-gradient(155deg, hsla(190,26%,16%,0.62), hsla(198,22%,10%,0.58))`
            : `linear-gradient(155deg, hsla(196,22%,14%,0.55), hsla(198,20%,9%,0.52))`,
          backdropFilter: "blur(22px) saturate(150%)",
          WebkitBackdropFilter: "blur(22px) saturate(150%)",
          border: `1px solid ${isFeatured ? `${color}40` : "hsl(178 74% 48% / 0.22)"}`,
          boxShadow: `0 24px 60px -40px hsl(178 74% 48% / 0.5), inset 0 1px 0 hsl(0 0% 100% / 0.12)`,
          ...(isExpanded ? { boxShadow: `0 30px 70px -38px hsl(178 74% 48% / 0.6), 0 0 0 1px ${color}30, inset 0 1px 0 hsl(0 0% 100% / 0.16)` } : {}),
        }}>


        {/* Top accent — featured only */}
        {isFeatured && (
          <div className="absolute top-0 left-0 right-0 h-[2px]"
            style={{ background: `linear-gradient(90deg, transparent, ${color}50, ${color}20, transparent)` }} />
        )}

        {/* Main row */}
        <div className="flex items-center gap-3 p-3.5 sm:p-4 cursor-pointer" onClick={onToggle}>
          {/* Round mockup preview bubble */}
          <div className="relative flex-shrink-0 transition-transform duration-300 group-hover:scale-105">
            <div
              className="w-[52px] h-[52px] rounded-full overflow-hidden border-2 shadow-lg"
              style={{
                borderColor: `${color}60`,
                boxShadow: `0 0 16px ${color}30`,
                background: `linear-gradient(135deg, ${color}25, ${color}10)`,
              }}
            >
              {previewUrl ? (
                <img src={previewUrl} alt={label} className="w-full h-full object-cover" loading="lazy" onError={onPreviewError} />
              ) : (
                <div className="w-full h-full flex items-center justify-center" style={{ color }}>
                  {getIcon(cfg.icon)}
                </div>
              )}
            </div>
            {/* Always-visible icon badge */}
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 rounded-full flex items-center justify-center shadow-md"
              style={{
                background: `linear-gradient(135deg, ${color}, ${color}cc)`,
                border: "2px solid hsla(192,20%,12%,0.95)",
              }}>
              <span className="text-white [&_svg]:!w-2.5 [&_svg]:!h-2.5">{getIcon(cfg.icon)}</span>
            </div>
            {isFeatured && (
              <motion.div className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: `1px solid ${color}25` }}
                animate={{ scale: [1, 1.3], opacity: [0.5, 0] }}
                transition={{ duration: 2.5, repeat: Infinity }} />
            )}
          </div>

          {/* Text */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-bold text-[0.8rem] sm:text-sm text-foreground font-heading truncate">{label}</h3>
              {isFeatured && (
                <span className="text-[0.56rem] sm:text-[11px] px-2 py-0.5 rounded-full font-bold tracking-[1.4px] uppercase flex items-center gap-0.5 flex-shrink-0 text-foreground"
                  style={{ background: `${color}30`, border: `1px solid ${color}58` }}>
                  <Crown className="w-2 h-2" /> PREMIUM
                </span>
              )}
            </div>
            <p className="text-[0.72rem] sm:text-xs text-foreground/95 truncate">{subtitle}</p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-1.5 flex-shrink-0">
            <motion.button
              onClick={(e) => { e.stopPropagation(); isFeatured ? navigate(route) : onNavigate(id); }}
              className="px-3 py-1.5 rounded-xl text-[10px] sm:text-[11px] font-semibold transition-all hidden sm:flex items-center gap-1 hover:scale-105"
              style={isFeatured ? {
                backgroundColor: color,
                color: "#fff",
                boxShadow: `0 3px 12px ${color}25`
              } : {
                background: "hsl(var(--secondary) / 0.82)",
                border: "1px solid hsl(var(--border) / 0.9)",
                color: "hsl(var(--foreground) / 0.96)"
              }}
              whileTap={{ scale: 0.95 }}>
              {isFeatured ? "Demo Live" : "Apri Demo"} <ArrowRight className="w-2.5 h-2.5" />
            </motion.button>
            <div className="w-6 h-6 rounded-lg flex items-center justify-center"
              style={{ background: "hsl(var(--secondary) / 0.72)" }}>
              {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-foreground/85" /> : <ChevronDown className="w-3.5 h-3.5 text-foreground/85" />}
            </div>
          </div>
        </div>

        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
              <div className="px-4 pb-5 pt-1">
                {/* Separator */}
                <div className="h-px mb-4" style={{ background: `linear-gradient(90deg, transparent, ${color}15, transparent)` }} />

                {/* Mockup Gallery */}
                <MockupGallery sectorId={id} color={color} />

                {/* CTA */}
                <div className="flex justify-center mt-4">
                  <motion.button onClick={() => isFeatured ? navigate(route) : onNavigate(id)}
                    className="px-5 py-2.5 rounded-xl text-xs font-bold text-white flex items-center gap-2 min-h-[40px] transition-all hover:scale-105"
                    style={{ backgroundColor: color, boxShadow: `0 4px 16px ${color}20` }} whileTap={{ scale: 0.95 }}>
                    <Sparkles className="w-3.5 h-3.5" />
                    Apri Demo Live <ArrowRight className="w-3.5 h-3.5" />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
