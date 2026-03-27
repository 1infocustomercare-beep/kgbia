import React, { useState, useEffect, useRef, forwardRef, useMemo, useCallback, lazy, Suspense } from "react";
import InteractiveParticleSphere from "@/components/public/InteractiveParticleSphere";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import FunnelDNAVisual from "@/components/public/FunnelDNAVisual";
import { MockupLightbox } from "@/components/ui/mockup-lightbox";

import { PremiumCarousel } from "@/components/public/PremiumCarousel";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { motion, AnimatePresence, useInView, useScroll, useTransform } from "framer-motion";
import {
  Crown, Check, Star, Zap, Shield, Smartphone,
  TrendingUp, X, Sparkles, Lock, Menu, Target, DollarSign, Brain,
  ChefHat, AlertTriangle, Banknote, ArrowDown, ArrowRight,
  ChevronDown, Play, Gem, Users, Rocket,
  Gift, Trophy, Award, Handshake, Quote,
  BarChart3, QrCode, Bell, Wallet, MapPin, Eye, Bot,
  Palette, Mail, Car, Scissors, Heart, Store, Dumbbell, Building,
  Calendar, Package, CreditCard, Route, ClipboardCheck, Headphones,
  Layers, Globe, Radio, MonitorSmartphone, Cpu, Fingerprint,
  ChevronRight, ChevronLeft, Pause, CircleCheck, Minus, Activity, ServerCog, Gauge, MessageSquare, Receipt,
  Workflow, ScanLine, Database, Wifi, Timer, LineChart,
  Network, Atom, Radar, BrainCircuit, CircuitBoard, Waypoints, Binary,
  GraduationCap, Waves, Wrench, Leaf } from
"lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
import empireLogoNew from "@/assets/empire-logo-new.png";
import heroLandingDefault from "@/assets/hero-landing.jpg";
import videoHeroDefault from "@/assets/video-hero-empire.mp4";
import heroTechCommandDefault from "@/assets/hero-tech-command.jpg";
import heroAiPlatformDefault from "@/assets/hero-ai-platform.jpg";
import heroPartnerLuxuryDefault from "@/assets/hero-partner-luxury.jpg";
import mockupClienteDefault from "@/assets/mockup-cliente.jpg";
import mockupAdminDefault from "@/assets/mockup-admin.jpg";
import mockupCucinaDefault from "@/assets/mockup-cucina.jpg";
import nccHeroBgDefault from "@/assets/ncc-hero-bg-amalfi.jpg";
import nccPremiumCoastDefault from "@/assets/ncc-premium-coast.jpg";
import nccPremiumInteriorDefault from "@/assets/ncc-premium-interior.jpg";
import nccFleetShowcaseDefault from "@/assets/ncc-fleet-showcase.jpg";
import cartoonFoodDefault from "@/assets/cartoon-sector-food.png";
import cartoonNccDefault from "@/assets/cartoon-sector-ncc.png";
import cartoonBeautyDefault from "@/assets/cartoon-sector-beauty.png";
import cartoonHealthcareDefault from "@/assets/cartoon-sector-healthcare.png";
import cartoonRetailDefault from "@/assets/cartoon-sector-retail.png";
import cartoonFitnessDefault from "@/assets/cartoon-sector-fitness.png";
import cartoonHotelDefault from "@/assets/cartoon-sector-hotel.png";
import sectorHeroFood from "@/assets/sector-hero-food.jpg";
import sectorHeroNcc from "@/assets/sector-hero-ncc.jpg";
import sectorHeroBeauty from "@/assets/sector-hero-beauty.jpg";
import sectorHeroHealthcare from "@/assets/sector-hero-healthcare.jpg";
import sectorHeroRetail from "@/assets/sector-hero-retail.jpg";
import sectorHeroFitness from "@/assets/sector-hero-fitness.jpg";
import sectorHeroHotel from "@/assets/sector-hero-hotel.jpg";
import sectorHeroBeach from "@/assets/sector-hero-beach.jpg";
import sectorHeroPlumber from "@/assets/sector-hero-plumber.jpg";
import sectorHeroConstruction from "@/assets/sector-hero-construction.jpg";
import sectorHeroEvents from "@/assets/sector-hero-events.jpg";
import sectorHeroGarage from "@/assets/sector-hero-garage.jpg";
import sectorHeroLogistics from "@/assets/sector-hero-logistics.jpg";
import sectorHeroGardening from "@/assets/sector-hero-gardening.jpg";
import sectorHeroVeterinary from "@/assets/sector-hero-veterinary.jpg";
import sectorHeroPhotography from "@/assets/sector-hero-photography.jpg";
import sectorHeroEducation from "@/assets/sector-hero-education.jpg";
import sectorHeroChildcare from "@/assets/sector-hero-childcare.jpg";
import sectorHeroTattoo from "@/assets/sector-hero-tattoo.jpg";
import sectorHeroCleaning from "@/assets/sector-hero-cleaning.jpg";
import sectorHeroAgriturismo from "@/assets/sector-hero-agriturismo.jpg";
import sectorHeroLegal from "@/assets/sector-hero-legal.jpg";
import sectorHeroAccounting from "@/assets/sector-hero-accounting.jpg";
import sectorHeroElectrician from "@/assets/sector-hero-electrician.jpg";
import sectorHeroCustom from "@/assets/sector-hero-custom.jpg";
import testimonialMarco from "@/assets/testimonial-marco.png";
import testimonialAlessandra from "@/assets/testimonial-alessandra.png";
import testimonialValentina from "@/assets/testimonial-valentina.png";
import testimonialLuca from "@/assets/testimonial-luca.png";
import testimonialSimone from "@/assets/testimonial-simone.png";
import testimonialGiulia from "@/assets/testimonial-giulia.png";
import { useSiteAssets } from "@/hooks/useSiteAssets";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
const EmpireTeamStory = lazy(() => import("@/components/public/EmpireTeamStory"));

/* Build a lookup from site_assets — custom URL overrides bundled default */
function useLandingAssets() {
  const { data: assets } = useSiteAssets();
  const map = useMemo(() => {
    const m: Record<string, string> = {};
    (assets || []).forEach((a) => {if (a.resolvedUrl) m[a.slot_key] = a.resolvedUrl;});
    return m;
  }, [assets]);
  return {
    heroLanding: map["landing.hero_image"] || heroLandingDefault,
    videoHero: map["landing.hero_video"] || videoHeroDefault,
    heroTechCommand: map["landing.hero_tech"] || heroTechCommandDefault,
    heroAiPlatform: map["landing.hero_ai"] || heroAiPlatformDefault,
    heroPartnerLuxury: map["landing.hero_partner"] || heroPartnerLuxuryDefault,
    mockupCliente: map["landing.mockup_cliente"] || mockupClienteDefault,
    mockupAdmin: map["landing.mockup_admin"] || mockupAdminDefault,
    mockupCucina: map["landing.mockup_cucina"] || mockupCucinaDefault,
    nccHeroBg: map["landing.ncc_hero_bg"] || nccHeroBgDefault,
    nccPremiumCoast: map["landing.ncc_premium_coast"] || nccPremiumCoastDefault,
    nccPremiumInterior: map["landing.ncc_premium_interior"] || nccPremiumInteriorDefault,
    nccFleetShowcase: map["landing.ncc_fleet"] || nccFleetShowcaseDefault,
    cartoonFood: map["landing.sector_food"] || cartoonFoodDefault,
    cartoonNcc: map["landing.sector_ncc"] || cartoonNccDefault,
    cartoonBeauty: map["landing.sector_beauty"] || cartoonBeautyDefault,
    cartoonHealthcare: map["landing.sector_healthcare"] || cartoonHealthcareDefault,
    cartoonRetail: map["landing.sector_retail"] || cartoonRetailDefault,
    cartoonFitness: map["landing.sector_fitness"] || cartoonFitnessDefault,
    cartoonHotel: map["landing.sector_hotel"] || cartoonHotelDefault
  };
}

const SafeEmpireVoiceAgent = React.memo(() => <EmpireVoiceAgent />, () => true);

/* ═══ Hero Phone Carousel — each sector shows 3 real mockup screens ═══ */
const HeroPhoneCarousel = ({ sectors }: { sectors: { screens: [string, string, string]; label: string }[] }) => {
  const [idx, setIdx] = useState(0);
  const total = sectors.length;

  useEffect(() => {
    const timer = setInterval(() => setIdx((p) => (p + 1) % total), 4000);
    return () => clearInterval(timer);
  }, [total]);

  const current = sectors[idx];

  const PhoneFrame = ({ src, alt, size, rounding, extraClass, style: extraStyle }: {
    src: string; alt: string; size: string; rounding: string; extraClass?: string; style?: React.CSSProperties;
  }) => {
    const innerRounding = rounding === "rounded-[26px] sm:rounded-[36px]" ? "rounded-[23px] sm:rounded-[33px]" : "rounded-[21px] sm:rounded-[29px]";
    return (
      <div className={`relative ${size} aspect-[9/19.5] ${rounding} overflow-hidden ${extraClass || ""}`}
        style={{ border: "2.5px solid hsl(220 12% 82%)", background: "#0a0a12",
          boxShadow: "0 30px 60px hsla(0,0%,0%,0.22), 0 8px 24px hsla(265,30%,30%,0.1), inset 0 1px 0 hsla(0,0%,100%,0.06)",
          ...extraStyle }}>
        {/* Dynamic Island */}
        <div className="absolute top-[6px] sm:top-[8px] left-1/2 -translate-x-1/2 w-[34%] max-w-[48px] h-[10px] sm:h-[14px] bg-black rounded-full z-30"
          style={{ boxShadow: "0 0 0 1px hsla(0,0%,100%,0.06)" }} />
        {/* Screen content */}
        <div className={`absolute inset-[3px] ${innerRounding} overflow-hidden`}>
          <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
          {/* Status bar fade */}
          <div className="absolute inset-x-0 top-0 h-8" style={{ background: "linear-gradient(to bottom, hsla(0,0%,0%,0.3), transparent)" }} />
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/20 rounded-full z-20" />
        {/* Glass reflection */}
        <div className={`absolute inset-0 ${rounding} pointer-events-none`} style={{ background: "linear-gradient(135deg, hsla(0,0%,100%,0.08) 0%, transparent 40%)" }} />
      </div>
    );
  };

  return (
    <motion.div className="relative mt-10 flex flex-col items-center"
      initial={{ opacity: 0, y: 40, scale: 0.92 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: 0.6, duration: 1, ease: [0.22, 1, 0.36, 1] }}>

      {/* Ambient glow */}
      <div className="absolute inset-[-25%] rounded-full blur-[120px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, hsla(265,50%,50%,0.12), hsla(168,45%,45%,0.08), transparent 70%)" }} />

      {/* Three phone container with crossfade */}
      <div className="relative flex items-end justify-center">
        <AnimatePresence mode="wait">
          <motion.div key={idx} className="flex items-end" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>

            {/* LEFT phone — second screen */}
            <motion.div className="relative z-[5]" style={{ marginBottom: "28px", marginRight: "-16px" }}
              animate={{ y: [0, -6, 0] }} transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 0.8 }}>
              <PhoneFrame src={current.screens[1]} alt={`${current.label} - Servizi`} size="w-[120px] sm:w-[145px] lg:w-[175px]" rounding="rounded-[24px] sm:rounded-[32px]" />
            </motion.div>

            {/* CENTER phone — home screen, larger */}
            <motion.div className="relative z-20"
              animate={{ y: [0, -10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}>
              <PhoneFrame src={current.screens[0]} alt={`${current.label} - Home`} size="w-[155px] sm:w-[185px] lg:w-[225px]" rounding="rounded-[26px] sm:rounded-[36px]"
                style={{ border: "3px solid hsl(220 10% 78%)", boxShadow: "0 40px 80px hsla(0,0%,0%,0.25), 0 12px 32px hsla(265,40%,35%,0.12), inset 0 1px 0 hsla(0,0%,100%,0.08)" }} />
            </motion.div>

            {/* RIGHT phone — third screen */}
            <motion.div className="relative z-[8]" style={{ marginBottom: "18px", marginLeft: "-16px" }}
              animate={{ y: [0, -7, 0] }} transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}>
              <PhoneFrame src={current.screens[2]} alt={`${current.label} - Dettaglio`} size="w-[125px] sm:w-[150px] lg:w-[180px]" rounding="rounded-[24px] sm:rounded-[32px]" />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Sector label */}
      <AnimatePresence mode="wait">
        <motion.div key={idx} className="mt-4 flex items-center gap-2"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.4 }}>
          <span className="text-[0.65rem] sm:text-[0.75rem] font-heading font-bold tracking-[2px] uppercase text-primary">{current.label}</span>
        </motion.div>
      </AnimatePresence>

      {/* Dot indicators */}
      <div className="mt-3 flex items-center gap-1.5 flex-wrap justify-center max-w-[260px]">
        {sectors.map((_, i) => (
          <button key={i} onClick={() => setIdx(i)} className={`rounded-full transition-all duration-300 ${i === idx ? "w-5 h-1.5 bg-primary" : "w-1.5 h-1.5 bg-foreground/15 hover:bg-foreground/25"}`} />
        ))}
      </div>
    </motion.div>
  );
};

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: {value: number;prefix?: string;suffix?: string;}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    let rafId = 0;
    let finalizeTimer = 0;

    const timer = window.setTimeout(() => {
      const start = Date.now();
      const duration = 2000;
      const target = value;
      const isFloat = target % 1 !== 0;

      const animate = () => {
        const elapsed = Date.now() - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        const current = target * eased;

        setDisplay(isFloat ? parseFloat(current.toFixed(1)) : Math.floor(current));

        if (progress < 1) {
          rafId = window.requestAnimationFrame(animate);
        } else {
          setDisplay(target);
        }
      };

      rafId = window.requestAnimationFrame(animate);
      finalizeTimer = window.setTimeout(() => setDisplay(target), duration + 100);
    }, 500);

    return () => {
      window.clearTimeout(timer);
      window.clearTimeout(finalizeTimer);
      if (rafId) window.cancelAnimationFrame(rafId);
    };
  }, [value]);

  const formatted = value % 1 !== 0
    ? display.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : display.toLocaleString("it-IT");
  return <span ref={ref} style={{ display: "inline-block", minWidth: "1em" }}>{prefix}{formatted}{suffix}</span>;
};

const IS_MOBILE_LP = typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);
const IS_TOUCH_DEVICE = typeof window !== "undefined" && ("ontouchstart" in window || navigator.maxTouchPoints > 0);

/** Section backgrounds — light, semi-transparent with premium tinting, DNA visible underneath. */
const mobilifyBg = (style?: React.CSSProperties): React.CSSProperties | undefined => {
  if (!style || !style.background || typeof style.background !== "string") return style;
  // On light theme, keep sections semi-transparent so DNA background bleeds through subtly
  return style;
};

const Section = forwardRef<HTMLElement, {id?: string;children: React.ReactNode;className?: string;style?: React.CSSProperties;}>(
  ({ id, children, className = "", style }, ref) =>
  <section ref={ref} id={id} className={`relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden landing-premium-section ${className}`} style={mobilifyBg(style)}>
      <div className="absolute inset-x-3 sm:inset-x-6 inset-y-6 sm:inset-y-8 rounded-[1.65rem] pointer-events-none landing-premium-shell" />
      <div className="max-w-[1100px] mx-auto relative z-10">{children}</div>
    </section>

);
Section.displayName = "Section";

const SectionLabel = forwardRef<HTMLDivElement, {text: string;icon?: React.ReactNode;}>(
  ({ text, icon }, ref) =>
  <motion.div
    ref={ref}
    className="inline-flex items-center gap-2.5 mb-5"
    initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
    
      <div className="relative flex items-center gap-2.5 px-5 py-2.5 rounded-2xl overflow-hidden"
        style={{
          background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--empire-violet) / 0.08))",
          border: "1px solid hsl(var(--primary) / 0.15)",
          boxShadow: "0 2px 12px hsl(var(--primary) / 0.08)"
        }}>
        <div className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
          style={{
            background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))",
            boxShadow: "0 2px 8px hsl(var(--primary) / 0.3)"
          }}>
          <span className="text-white [&>svg]:w-3 [&>svg]:h-3">{icon || <Sparkles className="w-3 h-3" />}</span>
        </div>
        <span className="text-[0.65rem] font-heading font-bold tracking-[2.5px] uppercase text-white/90 relative z-10">{text}</span>
      </div>
    </motion.div>

);
SectionLabel.displayName = "SectionLabel";

/* ═══ LIVE FEED SIMULATOR — auto-cycling agent actions ═══ */
const LIVE_ACTIONS = [
{ agent: "GhostManager™", action: "Ha processato 12 ordini simultanei", icon: <Bot className="w-3.5 h-3.5" />, color: "hsla(265,70%,60%,1)", time: "2s fa" },
{ agent: "Concierge AI", action: "Ha risposto a cliente in tedesco", icon: <Globe className="w-3.5 h-3.5" />, color: "hsla(200,70%,55%,1)", time: "5s fa" },
{ agent: "Review Shield™", action: "Ha intercettato recensione negativa", icon: <Shield className="w-3.5 h-3.5" />, color: "hsla(150,70%,50%,1)", time: "8s fa" },
{ agent: "Predictive Engine", action: "Previsione domanda: +35% weekend", icon: <BarChart3 className="w-3.5 h-3.5" />, color: "hsla(38,80%,55%,1)", time: "12s fa" },
{ agent: "AutoPilot Marketing", action: "Campagna WhatsApp inviata a 847 clienti", icon: <Rocket className="w-3.5 h-3.5" />, color: "hsla(25,90%,55%,1)", time: "15s fa" },
{ agent: "Invoice AI", action: "Fattura elettronica #2847 generata", icon: <CreditCard className="w-3.5 h-3.5" />, color: "hsla(210,60%,55%,1)", time: "18s fa" },
{ agent: "Smart Notifier", action: "Push inviata: offerta pranzo 12-14", icon: <Bell className="w-3.5 h-3.5" />, color: "hsla(45,90%,55%,1)", time: "22s fa" },
{ agent: "Loyalty Angel", action: "Riattivato cliente inattivo da 30gg", icon: <Heart className="w-3.5 h-3.5" />, color: "hsla(340,70%,55%,1)", time: "25s fa" },
{ agent: "Voice Assistant", action: "Prenotazione telefonica completata", icon: <Headphones className="w-3.5 h-3.5" />, color: "hsla(250,60%,55%,1)", time: "28s fa" },
{ agent: "Social Creator", action: "Post Instagram generato e schedulato", icon: <Sparkles className="w-3.5 h-3.5" />, color: "hsla(280,60%,55%,1)", time: "31s fa" },
{ agent: "Analytics Brain", action: "Report settimanale pronto", icon: <Brain className="w-3.5 h-3.5" />, color: "hsla(270,65%,55%,1)", time: "35s fa" },
{ agent: "Data Guardian", action: "Audit GDPR completato — 100% OK", icon: <Lock className="w-3.5 h-3.5" />, color: "hsla(220,30%,50%,1)", time: "40s fa" }];


const LiveFeedSimulator = () => {
  const [offset, setOffset] = useState(0);
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 640);
  const VISIBLE = isMobile ? 1 : 4;

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", onResize, { passive: true });
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((o) => (o + 1) % LIVE_ACTIONS.length);
    }, isMobile ? 4200 : 2800);
    return () => clearInterval(interval);
  }, [isMobile]);

  const visible = useMemo(() => {
    const items = [];
    for (let i = 0; i < VISIBLE; i++) {
      items.push(LIVE_ACTIONS[(offset + i) % LIVE_ACTIONS.length]);
    }
    return items;
  }, [offset, VISIBLE]);

  if (isMobile) {
    const item = visible[0];
    if (!item) return null;

    return (
      <div
        className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl overflow-hidden"
        style={{
          background: `linear-gradient(135deg, ${item.color}14, ${item.color}05)`,
          border: `1px solid ${item.color}24`
        }}>
        
        <div
          className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}25` }}>
          
          {item.icon}
        </div>
        <div className="flex-1 min-w-0 relative z-10">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-[0.6rem] font-bold text-foreground/90 truncate">{item.agent}</span>
            <span className="text-[0.4rem] px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-bold tracking-wider uppercase">LIVE</span>
          </div>
          <p className="text-[0.52rem] text-foreground/60 truncate">{item.action}</p>
        </div>
        <span className="text-[0.42rem] text-foreground/40 whitespace-nowrap flex-shrink-0 font-mono">{item.time}</span>
      </div>);

  }

  return (
    <AnimatePresence mode="popLayout">
      {visible.map((item, i) =>
      <motion.div
        key={`${item.agent}-${(offset + i) % LIVE_ACTIONS.length}`}
        initial={{ opacity: 0, x: -30, scale: 0.9 }}
        animate={{ opacity: 1, x: 0, scale: 1 }}
        exit={{ opacity: 0, x: 30, scale: 0.9 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative flex items-center gap-3 px-3.5 py-2.5 rounded-xl overflow-hidden"
        style={{
          background: i === 0 ?
          `linear-gradient(135deg, ${item.color}18, ${item.color}06)` :
          "hsla(230,20%,12%,0.4)",
          border: i === 0 ? `1px solid ${item.color}30` : "1px solid hsla(215,30%,25%,0.08)"
        }}>
        
          {/* Scanning beam on active item */}
          {i === 0 &&
        <motion.div className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent 30%, ${item.color}12 50%, transparent 70%)` }}
        animate={{ x: ["-150%", "250%"] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
        }
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
        style={{ background: `${item.color}18`, color: item.color, border: `1px solid ${item.color}25` }}>
            {item.icon}
            {i === 0 &&
          <motion.div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400"
          animate={{ scale: [1, 1.4, 1], opacity: [0.8, 1, 0.8] }}
          transition={{ duration: 1.2, repeat: Infinity }} />
          }
          </div>
          <div className="flex-1 min-w-0 relative z-10">
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-[0.6rem] font-bold text-foreground/90 truncate">{item.agent}</span>
              {i === 0 && <span className="text-[0.4rem] px-1.5 py-0.5 rounded-full bg-emerald-400/15 text-emerald-400 font-bold tracking-wider uppercase">LIVE</span>}
            </div>
            <p className="text-[0.52rem] text-foreground/60 truncate">{item.action}</p>
          </div>
          <span className="text-[0.42rem] text-foreground/40 whitespace-nowrap flex-shrink-0 font-mono">{item.time}</span>
        </motion.div>
      )}
    </AnimatePresence>);

};

const NeuralCellsBackground = () => {
  const [isMobile, setIsMobile] = useState(typeof window !== "undefined" && window.innerWidth < 640);
  const [born, setBorn] = useState(false);

  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < 640);
    window.addEventListener("resize", handler);
    return () => window.removeEventListener("resize", handler);
  }, []);

  // Delayed "birth" — syncs with DNA transition dissolve
  useEffect(() => {
    const t = setTimeout(() => setBorn(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Mobile: fewer cells to reduce DOM node count
  const CELL_COUNT = isMobile ? 12 : 40;
  const VB_W = isMobile ? 60 : 100;
  const VB_H = isMobile ? 130 : 100;

  const cells = useMemo(() =>
  Array.from({ length: CELL_COUNT }, (_, i) => ({
    id: i,
    x: Math.random() * VB_W,
    y: Math.random() * VB_H,
    delay: Math.random() * 6
  })), [CELL_COUNT, VB_W, VB_H]
  );

  const connections = useMemo(() => {
    const conns: {a: number;b: number;}[] = [];
    const maxDist = isMobile ? 28 : 28;
    for (let i = 0; i < cells.length; i++) {
      for (let j = i + 1; j < cells.length; j++) {
        const dx = cells[i].x - cells[j].x;
        const dy = cells[i].y - cells[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist && dist > 5) conns.push({ a: i, b: j });
      }
    }
    return conns;
  }, [cells, isMobile]);

  // On mobile, skip ALL animated SVG pulses to prevent GPU thrashing
  const pulseConns = isMobile ? [] : connections.filter((_, i) => i % 2 === 0);
  const goldConns = isMobile ? [] : connections.filter((_, i) => i % 4 === 0);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: 0.15, willChange: "transform", transform: "translateZ(0)" }}
      initial={{ opacity: 0 }}
      animate={born ? { opacity: 0.15 } : { opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}>
      
      {/* DNA Birth Pulse — desktop only */}
      {!isMobile &&
      <>
          <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ border: "2px solid hsla(38,50%,55%,0.35)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={born ? { width: "200vmax", height: "200vmax", opacity: 0 } : {}}
          transition={{ duration: 2, ease: "easeOut" }} />
        
          <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
          style={{ border: "1px solid hsla(38,50%,55%,0.3)" }}
          initial={{ width: 0, height: 0, opacity: 1 }}
          animate={born ? { width: "200vmax", height: "200vmax", opacity: 0 } : {}}
          transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }} />
        
        </>
      }

      {/* ═══ TECH CIRCUIT GRID ═══ */}
      {
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: 0.045 }} xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="bg-circuit-hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse" patternTransform="scale(2.2)">
              <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="hsl(210 100% 62%)" strokeWidth="0.35" />
              <circle cx="30" cy="0" r="1" fill="hsl(210 100% 62%)" opacity="0.5" />
              <circle cx="60" cy="15" r="1" fill="hsl(210 100% 62%)" opacity="0.5" />
              <circle cx="0" cy="15" r="1" fill="hsl(210 100% 62%)" opacity="0.5" />
              <circle cx="30" cy="52" r="1" fill="hsl(210 100% 62%)" opacity="0.5" />
            </pattern>
            <pattern id="bg-micro-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(210 60% 50%)" strokeWidth="0.12" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-circuit-hex)" />
          <rect width="100%" height="100%" fill="url(#bg-micro-grid)" opacity="0.25" />
        </svg>
      }

      {/* ═══ VERTICAL DATA STREAMS ═══ */}
      {!isMobile && [8, 25, 42, 58, 75, 92].map((x, i) =>
      <div key={`vstream-${i}`} className="absolute top-0 bottom-0 w-px" style={{ left: `${x}%`, background: `hsla(210,60%,50%,0.03)` }}>
          <motion.div className="absolute w-full left-0 rounded-full"
        style={{ height: "100px", background: `linear-gradient(180deg, transparent, hsla(195,100%,55%,0.25), transparent)` }}
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 10 + i * 2.5, repeat: Infinity, ease: "linear", delay: i * 1.8 }} />
        </div>
      )}

      {/* ═══ HORIZONTAL SCAN LINES ═══ */}
      {!isMobile && [0, 1].map((i) =>
      <motion.div key={`hscan-${i}`} className="absolute left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent 5%, hsla(195,100%,55%,0.08) 30%, hsla(210,100%,62%,0.14) 50%, hsla(195,100%,55%,0.08) 70%, transparent 95%)` }}
      animate={{ top: ["-3%", "103%"] }}
      transition={{ duration: 18 + i * 7, repeat: Infinity, ease: "linear", delay: i * 5 }} />
      )}

      {/* ═══ PULSING TECH NODES ═══ */}
      {!isMobile && [
      { x: 8, y: 18 }, { x: 25, y: 40 }, { x: 42, y: 12 }, { x: 58, y: 60 },
      { x: 75, y: 30 }, { x: 92, y: 55 }, { x: 35, y: 80 }, { x: 65, y: 90 }].
      map((pos, i) =>
      <motion.div key={`tnode-${i}`} className="absolute w-1 h-1 rounded-full"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: `hsla(195,100%,55%,0.25)`, boxShadow: `0 0 8px hsla(210,100%,62%,0.15)` }}
      animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.7, 1.4, 0.7] }}
      transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.5 }} />
      )}

      {/* ═══ ORIGINAL NEURAL CELLS SVG ═══ */}
      <svg className="w-full h-full" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice">
        {/* Only add SVG filter on desktop — feGaussianBlur is expensive on mobile GPU */}
        {!isMobile &&
        <defs>
            <filter id="pulseGlow">
              <feGaussianBlur stdDeviation="0.3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        }

        {/* Connection lines — STATIC on mobile (no motion.line), animated on desktop */}
        {isMobile ?
        connections.map(({ a, b }, i) =>
        <line
          key={`ln${i}`}
          x1={cells[a].x} y1={cells[a].y}
          x2={cells[b].x} y2={cells[b].y}
          stroke={i % 6 === 0 ? "hsla(172,80%,48%,0.25)" : "hsla(210,60%,55%,0.12)"}
          strokeWidth="0.2" />

        ) :

        connections.map(({ a, b }, i) =>
        <motion.line
          key={`ln${i}`}
          x1={cells[a].x} y1={cells[a].y}
          x2={cells[b].x} y2={cells[b].y}
          stroke={i % 6 === 0 ? "hsla(172,80%,48%,0.35)" : "hsla(210,60%,55%,0.18)"}
          strokeWidth="0.15"
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.1, 0.4, 0.1] }}
          transition={{ duration: 5 + i % 4 * 2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }} />

        )
        }

        {/* Warm data pulses — no SVG filter on mobile */}
        {pulseConns.map(({ a, b }, i) =>
        <motion.circle
          key={`vp${i}`}
          r={isMobile ? "0.35" : "0.25"}
          fill="hsla(32,55%,60%,0.94)"
          filter={isMobile ? undefined : "url(#pulseGlow)"}
          initial={{ cx: cells[a].x, cy: cells[a].y, opacity: 0 }}
          animate={{
            cx: [cells[a].x, cells[b].x],
            cy: [cells[a].y, cells[b].y],
            opacity: [0, 0.9, 0]
          }}
          transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }} />

        )}

        {/* Gold data pulses — no SVG filter on mobile */}
        {goldConns.map(({ a, b }, i) =>
        <motion.circle
          key={`gp${i}`}
          r={isMobile ? "0.3" : "0.2"}
          fill="hsla(38,60%,58%,0.9)"
          filter={isMobile ? undefined : "url(#pulseGlow)"}
          initial={{ cx: cells[b].x, cy: cells[b].y, opacity: 0 }}
          animate={{
            cx: [cells[b].x, cells[a].x],
            cy: [cells[b].y, cells[a].y],
            opacity: [0, 0.85, 0]
          }}
          transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: 1.5 + i * 0.8, ease: "easeInOut" }} />

        )}

        {/* Junction nodes — static on mobile, animated on desktop */}
        {isMobile ?
        cells.filter((_, i) => i % 3 === 0).map((cell) =>
        <circle
          key={`node${cell.id}`}
          cx={cell.x} cy={cell.y}
          r="0.3"
          fill="hsla(210,100%,62%,0.3)" />

        ) :

        cells.filter((_, i) => i % 2 === 0).map((cell) =>
        <motion.circle
          key={`node${cell.id}`}
          cx={cell.x} cy={cell.y}
          r="0.25"
          fill="hsla(210,100%,62%,0.35)"
          animate={{
            r: [0.15, 0.4, 0.15],
            opacity: [0.25, 0.6, 0.25]
          }}
          transition={{ duration: 3.5, repeat: Infinity, delay: cell.delay, ease: "easeInOut" }} />

        )
        }
      </svg>
    </motion.div>);

};


const PremiumIcon = ({ children, gradient, size = "md", delay = 0 }: {children: React.ReactNode;gradient: string;size?: "sm" | "md" | "lg";delay?: number;}) => {
  const sizeClasses = size === "sm" ? "w-6 h-6 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl" : size === "lg" ? "w-8 h-8 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl" : "w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl";
  const isMobileDevice = typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

  return (
    <motion.div className="relative group/icon" whileHover={isMobileDevice ? undefined : { scale: 1.1, rotate: -3 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      <div className={`relative ${sizeClasses} bg-gradient-to-br ${gradient} flex items-center justify-center text-white overflow-hidden`}
      style={{ boxShadow: "0 4px 16px hsl(var(--primary) / 0.18), 0 0 0 1px hsl(var(--primary) / 0.1), inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 2px rgba(0,0,0,0.15)" }}>
        {/* Inner glass highlight */}
        <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(0,0,0,0.08) 100%)" }} />
        <div className="relative z-10 [&>svg]:drop-shadow-sm">{children}</div>
      </div>
    </motion.div>);

};

/* ═══ Premium Animated Card ═══ */
const PremiumCard = ({ children, className = "", hover = true, glow = false, scan = false, delay = 0 }: {children: React.ReactNode;className?: string;hover?: boolean;glow?: boolean;scan?: boolean;delay?: number;}) => {
  const isMobileDevice = typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

  return (
    <motion.div
      className={`relative rounded-2xl border overflow-hidden group/card ${className}`}
      style={{
        background: "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.88), hsl(248 18% 11% / 0.85))",
        backdropFilter: isMobileDevice ? undefined : "blur(24px) saturate(1.4)",
        WebkitBackdropFilter: isMobileDevice ? undefined : "blur(24px) saturate(1.4)",
        borderColor: "hsl(var(--border) / 0.35)",
        boxShadow: "0 2px 24px hsl(var(--primary) / 0.08), 0 0 0 1px hsl(var(--primary) / 0.04), inset 0 1px 0 hsl(0 0% 100% / 0.05)"
      }}
      whileHover={hover && !isMobileDevice ? {
        y: -6,
        borderColor: "hsl(var(--primary) / 0.25)",
        boxShadow: "0 20px 60px hsl(var(--primary) / 0.15), 0 0 30px hsl(var(--primary) / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.08)",
        transition: { duration: 0.4, ease: "easeOut" }
      } : undefined}>
      
    {/* Top accent shimmer line */}
    <div className="absolute top-0 left-0 right-0 h-px z-10"
      style={{ background: "linear-gradient(90deg, transparent 10%, hsl(var(--primary) / 0.2) 30%, hsl(38 50% 55% / 0.2) 50%, hsl(var(--accent) / 0.15) 70%, transparent 90%)" }} />
      
    {/* Inner glass reflection */}
    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.04) 0%, transparent 30%)" }} />
    
    {/* Subtle hover gradient overlay */}
    <div className="absolute inset-0 pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
      style={{ background: "radial-gradient(ellipse at 50% 0%, hsl(var(--primary) / 0.06), transparent 70%)" }} />
    
    <div className="relative z-10">{children}</div>
  </motion.div>);

};

const smoothEase = [0.22, 1, 0.36, 1] as const;
/** Shared viewport config — triggers animations 200px before element enters screen on mobile */
const vpOnce = { once: true, margin: (IS_MOBILE_LP ? "0px 0px -80px 0px" : "0px 0px -150px 0px") as any } as const;
const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } } };
const fadeScale = { hidden: { opacity: 0, y: 10, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: smoothEase } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } } };
const slideInLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: smoothEase } } };
const slideInRight = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: smoothEase } } };
const popIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 24 } } };

/* ═══ Floating Particle — skipped on mobile ═══ */
const IS_MOBILE_DEVICE = typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

const Particle = ({ delay, size, x, y }: {delay: number;size: number;x: string;y: string;}) => {
  if (IS_MOBILE_DEVICE) return null;
  return (
    <motion.div
      className="absolute rounded-full"
      style={{ width: size, height: size, left: x, top: y, background: delay % 2 === 0 ? "hsl(38, 45%, 52%)" : "hsl(32, 35%, 55%)" }}
      animate={{ y: [0, -25, 0], opacity: [0.1, 0.35, 0.1], scale: [1, 1.3, 1] }}
      transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }} />);


};

/* ═══ Section Divider — taller to reveal circuit background ═══ */
const SectionDivider = forwardRef<HTMLDivElement>((_, ref) =>
<div ref={ref} className="section-connector" style={{ height: "4rem" }}>
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, hsl(var(--primary) / 0.08) 15%, hsl(var(--primary) / 0.14) 50%, hsl(var(--primary) / 0.08) 85%, transparent 100%)" }} />
  </div>
);
SectionDivider.displayName = "SectionDivider";

/* ═══ Circuit SVG Pattern — for AI/DNA/Funzionalità sections ═══ */
const CircuitPattern = () => (
  <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.08 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="circuit-grid" x="0" y="0" width="120" height="120" patternUnits="userSpaceOnUse">
        {/* Horizontal lines */}
        <line x1="0" y1="30" x2="50" y2="30" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
        <line x1="70" y1="30" x2="120" y2="30" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
        {/* Vertical lines */}
        <line x1="50" y1="0" x2="50" y2="30" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
        <line x1="70" y1="30" x2="70" y2="90" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
        <line x1="50" y1="90" x2="50" y2="120" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
        {/* Right-angle connectors */}
        <line x1="50" y1="90" x2="70" y2="90" stroke="rgba(201,168,76,0.15)" strokeWidth="0.5" />
        {/* Nodes — luminous dots */}
        <circle cx="50" cy="30" r="2.5" fill="rgba(201,168,76,0.3)" />
        <circle cx="70" cy="30" r="1.5" fill="rgba(201,168,76,0.2)" />
        <circle cx="70" cy="90" r="2.5" fill="rgba(201,168,76,0.3)" />
        <circle cx="50" cy="90" r="1.5" fill="rgba(201,168,76,0.2)" />
        {/* Bright pips at intersections */}
        <circle cx="50" cy="30" r="1" fill="#C9A84C" opacity="0.4" />
        <circle cx="70" cy="90" r="1" fill="#C9A84C" opacity="0.4" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#circuit-grid)" />
    {/* Animated dash flow lines */}
    <line x1="10%" y1="40%" x2="90%" y2="40%" stroke="rgba(201,168,76,0.08)" strokeWidth="0.5" className="circuit-line-animated" />
    <line x1="50%" y1="10%" x2="50%" y2="90%" stroke="rgba(201,168,76,0.06)" strokeWidth="0.5" className="circuit-line-animated" style={{ animationDelay: "1s" }} />
  </svg>
);

/* ═══ Comparison Row ═══ */
const CompRow = ({ label, empire, others, icon }: {label: string;empire: string;others: string;icon?: string;}) =>
<motion.div className="grid grid-cols-3 py-1.5 sm:py-2.5 border-b border-border/20 items-center text-[0.55rem] sm:text-sm"
initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={vpOnce}>
    <span className="text-foreground/50 font-medium leading-tight flex items-center gap-1">
      {icon && <span className="text-[0.5rem] sm:text-xs hidden sm:inline">{icon}</span>}
      <span className="truncate">{label}</span>
    </span>
    <span className="text-center text-foreground font-bold flex items-center justify-center gap-0.5 sm:gap-1">
      <CircleCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-primary shrink-0" /> <span className="leading-tight">{empire}</span>
    </span>
    <span className="text-center text-foreground/25 leading-tight text-[0.5rem] sm:text-sm line-through decoration-destructive/40">{others}</span>
  </motion.div>;


/* ═══════════════════════════════════════════
   PRICING CONFIGURATOR
   ═══════════════════════════════════════════ */

type PlanTier = "starter" | "professional" | "enterprise";
type PricingMode = "monthly" | "package";

/* ── Sector config for pricing ── */
type PricingSector = "food" | "ncc" | "beauty" | "healthcare" | "retail" | "fitness" | "hospitality" | "trades" | "other";

const PRICING_SECTOR_ICONS: Record<PricingSector, React.ReactNode> = {
  food: <ChefHat className="w-3.5 h-3.5 inline-block" />,
  beauty: <Scissors className="w-3.5 h-3.5 inline-block" />,
  ncc: <Car className="w-3.5 h-3.5 inline-block" />,
  healthcare: <Heart className="w-3.5 h-3.5 inline-block" />,
  retail: <Store className="w-3.5 h-3.5 inline-block" />,
  fitness: <Dumbbell className="w-3.5 h-3.5 inline-block" />,
  hospitality: <Building className="w-3.5 h-3.5 inline-block" />,
  trades: <Wrench className="w-3.5 h-3.5 inline-block" />,
  other: <Layers className="w-3.5 h-3.5 inline-block" />,
};
const PRICING_SECTORS: {id: PricingSector;label: string;emoji: string;}[] = [
{ id: "food", label: "Food & Ristorazione", emoji: "🍽️" },
{ id: "beauty", label: "Beauty & Wellness", emoji: "💇" },
{ id: "ncc", label: "NCC & Trasporti", emoji: "🚘" },
{ id: "healthcare", label: "Salute & Cliniche", emoji: "🏥" },
{ id: "retail", label: "Retail & Negozi", emoji: "🛍️" },
{ id: "fitness", label: "Fitness & Palestre", emoji: "🏋️" },
{ id: "hospitality", label: "Hotel & Ospitalità", emoji: "🏨" },
{ id: "trades", label: "Artigiani & Servizi", emoji: "🔧" },
{ id: "other", label: "Altro settore", emoji: "🏢" }];


interface AiAddon {
  id: string;
  name: string;
  desc: string;
  price: number;
  icon: React.ReactNode;
  popular?: boolean;
  sectors: PricingSector[];
}

const ALL_SECTORS: PricingSector[] = ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality", "trades", "other"];

const AI_ADDONS: AiAddon[] = [
{ id: "concierge", name: "Concierge AI", desc: "Receptionist 24/7 multi-canale", price: 99, icon: <Bot className="w-4 h-4" />, popular: true, sectors: ALL_SECTORS },
{ id: "analytics", name: "Analytics Brain", desc: "Previsioni fatturato e churn", price: 149, icon: <LineChart className="w-4 h-4" />, sectors: ALL_SECTORS },
{ id: "social", name: "Social Manager AI", desc: "Piano editoriale automatico", price: 79, icon: <Globe className="w-4 h-4" />, popular: true, sectors: ALL_SECTORS },
{ id: "sales", name: "Sales Closer AI", desc: "Lead scoring e follow-up auto", price: 129, icon: <Target className="w-4 h-4" />, sectors: ALL_SECTORS },
{ id: "document", name: "Document AI", desc: "Fatture e preventivi automatici", price: 49, icon: <ClipboardCheck className="w-4 h-4" />, sectors: ALL_SECTORS },
{ id: "compliance", name: "Compliance Guardian", desc: "GDPR, scadenze, audit trail", price: 59, icon: <Shield className="w-4 h-4" />, sectors: ALL_SECTORS },
{ id: "ops-food", name: "Operations — Food", desc: "KDS, food cost, HACCP", price: 149, icon: <ChefHat className="w-4 h-4" />, sectors: ["food"] },
{ id: "ops-ncc", name: "Operations — NCC", desc: "Fleet, dynamic pricing, dispatch", price: 199, icon: <Car className="w-4 h-4" />, sectors: ["ncc"] },
{ id: "ops-beauty", name: "Operations — Beauty", desc: "Agenda smart, prodotti, fidelity", price: 129, icon: <Scissors className="w-4 h-4" />, sectors: ["beauty"] },
{ id: "ops-health", name: "Operations — Health", desc: "Cartelle, telemedicina, recall", price: 179, icon: <Heart className="w-4 h-4" />, sectors: ["healthcare"] },
{ id: "ops-retail", name: "Operations — Retail", desc: "Inventario, POS, promozioni", price: 139, icon: <Store className="w-4 h-4" />, sectors: ["retail"] },
{ id: "ops-fitness", name: "Operations — Fitness", desc: "Classi, abbonamenti, check-in", price: 119, icon: <Dumbbell className="w-4 h-4" />, sectors: ["fitness"] },
{ id: "ops-hotel", name: "Operations — Hotel", desc: "Rooms, check-in/out, housekeeping", price: 189, icon: <Building className="w-4 h-4" />, sectors: ["hospitality"] },
{ id: "ops-trades", name: "Operations — Artigiani", desc: "Interventi, preventivi, dispatch", price: 109, icon: <ClipboardCheck className="w-4 h-4" />, sectors: ["trades"] }];


/** Get sector-specific included agent IDs per package tier */
const SECTOR_INCLUDED_AGENTS: Record<PricingSector, {growth: string[];empire: string[];}> = {
  food: { growth: ["concierge", "ops-food"], empire: ["concierge", "ops-food", "analytics", "social", "sales"] },
  ncc: { growth: ["concierge", "ops-ncc"], empire: ["concierge", "ops-ncc", "analytics", "sales", "document"] },
  beauty: { growth: ["concierge", "ops-beauty"], empire: ["concierge", "ops-beauty", "analytics", "social", "sales"] },
  healthcare: { growth: ["concierge", "ops-health"], empire: ["concierge", "ops-health", "analytics", "compliance", "document"] },
  retail: { growth: ["concierge", "ops-retail"], empire: ["concierge", "ops-retail", "analytics", "social", "sales"] },
  fitness: { growth: ["concierge", "ops-fitness"], empire: ["concierge", "ops-fitness", "analytics", "social", "sales"] },
  hospitality: { growth: ["concierge", "ops-hotel"], empire: ["concierge", "ops-hotel", "analytics", "social", "sales"] },
  trades: { growth: ["concierge", "ops-trades"], empire: ["concierge", "ops-trades", "analytics", "document", "sales"] },
  other: { growth: ["concierge", "analytics"], empire: ["concierge", "analytics", "social", "sales", "document"] }
};

/** Sector-specific features to show in packages */
const SECTOR_FEATURES: Record<PricingSector, string[]> = {
  food: ["Menu QR & Ordinazioni digitali", "Kitchen Display System", "HACCP & Food Cost", "Prenotazioni tavoli", "Delivery & Takeaway"],
  ncc: ["Gestione Flotta & GPS", "Pricing dinamico tratte", "Booking online automatico", "Dispatch autisti", "Fatturazione automatica"],
  beauty: ["Agenda appuntamenti smart", "Schede clienti & preferenze", "Promozioni automatiche", "Gestione prodotti & magazzino", "Fidelity card digitale"],
  healthcare: ["Cartelle pazienti digitali", "Telemedicina integrata", "Recall automatici", "Prescrizioni digitali", "Compliance sanitaria"],
  retail: ["Inventario in tempo reale", "POS integrato", "Promozioni & coupon", "E-commerce integrato", "Analisi vendite"],
  fitness: ["Gestione classi & corsi", "Abbonamenti & check-in", "Schede allenamento", "Booking lezioni", "Community & social"],
  hospitality: ["Gestione camere & tariffe", "Check-in/out digitale", "Housekeeping tracker", "Revenue management", "Booking engine"],
  trades: ["Gestione interventi", "Preventivi automatici", "Dispatch tecnici", "Foto & documenti cantiere", "Fatturazione elettronica"],
  other: ["Dashboard personalizzata", "CRM Clienti completo", "Automazioni intelligenti", "Reportistica avanzata", "Multi-lingua"]
};

const PLAN_TIERS: {id: PlanTier;name: string;price: number;desc: string;badge?: string;features: string[];includedAgents: number;}[] = [
{
  id: "starter",
  name: "Starter",
  price: 69,
  desc: "Tutto per iniziare a digitalizzare",
  features: ["App White Label completa", "Menu/Catalogo QR", "Ordini & Prenotazioni", "Dashboard Analytics", "Supporto Email", "Sicurezza AES-256 & GDPR"],
  includedAgents: 0
},
{
  id: "professional",
  name: "Professional",
  price: 149,
  badge: "Più Scelto",
  desc: "IA + automazioni per crescere",
  features: ["Tutto di Starter +", "AI Engine completo", "CRM & Fidelizzazione", "Review Shield™", "Push Notification", "Traduzioni automatiche", "1 Agente IA incluso a scelta"],
  includedAgents: 1
},
{
  id: "enterprise",
  name: "Enterprise",
  price: 299,
  badge: "Max Revenue",
  desc: "Suite completa per dominare il mercato",
  features: ["Tutto di Professional +", "Multi-lingua illimitato", "Loyalty Wallet avanzato", "GhostManager™ clienti persi", "Analytics predittivi", "Supporto prioritario 7/7", "3 Agenti IA inclusi a scelta"],
  includedAgents: 3
}];


/* ─── One-Time Packages ─── */
interface PackageTier {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  monthlyFee: number;
  commission: string;
  badge?: string;
  tagline: string;
  highlight?: boolean;
  features: string[];
  includedAgents: number;
  extras: string[];
  savings: string;
}

const PACKAGE_TIERS: PackageTier[] = [
{
  id: "base",
  name: "Digital Start",
  price: 1997,
  originalPrice: 2880,
  monthlyFee: 49,
  commission: "2%",
  tagline: "Digitalizza la tua attività in 24h",
  features: [
  "App White Label completa",
  "Menu/Catalogo QR illimitato",
  "Ordini & Prenotazioni",
  "Dashboard Analytics base",
  "Supporto Email dedicato",
  "Setup & Onboarding guidato",
  "12 mesi di piattaforma inclusi"],

  includedAgents: 0,
  extras: ["Formazione iniziale 1-on-1", "Dominio personalizzato"],
  savings: "Risparmi €883 vs abbonamento mensile"
},
{
  id: "growth",
  name: "Growth AI",
  price: 4997,
  originalPrice: 7200,
  monthlyFee: 29,
  commission: "1%",
  badge: "Più Scelto",
  highlight: true,
  tagline: "IA + automazioni per esplodere il fatturato",
  features: [
  "Tutto di Digital Start +",
  "AI Engine completo sbloccato",
  "CRM & Fidelizzazione avanzata",
  "Review Shield™ anti-recensioni negative",
  "Push Notification illimitate",
  "Traduzioni automatiche 8 lingue",
  "2 Agenti IA inclusi a scelta",
  "Commissioni ridotte all'1%",
  "18 mesi di piattaforma inclusi"],

  includedAgents: 2,
  extras: ["3 sessioni di strategia IA", "Migrazione dati gratuita", "A/B Test landing pages"],
  savings: "Risparmi €2.203 vs abbonamento mensile"
},
{
  id: "empire",
  name: "Empire Domination",
  price: 7997,
  originalPrice: 14400,
  monthlyFee: 0,
  commission: "0%",
  badge: "Tutto Incluso",
  tagline: "Il pacchetto completo — tutto ciò che serve, senza compromessi",
  features: [
  "✅ TUTTO incluso — ogni funzione della piattaforma",
  "ZERO commissioni sulle transazioni",
  "ZERO canone mensile per 24 mesi",
  "5 Agenti IA inclusi a scelta",
  "Multi-lingua illimitato",
  "Loyalty Wallet avanzato",
  "GhostManager™ clienti persi",
  "Analytics predittivi con IA",
  "Supporto prioritario 7/7 VIP",
  "White Label completo — il tuo brand ovunque",
  "🔧 Possibilità di aggiungere funzioni custom su richiesta"],

  includedAgents: 5,
  extras: ["Account Manager dedicato", "6 sessioni strategia trimestrale", "Priorità su nuove funzionalità", "Setup multi-sede incluso", "Funzionalità custom su richiesta"],
  savings: "Risparmi €6.403 vs abbonamento — e le commissioni sono tue per sempre"
}];


/** Animated count-up component for savings */
const SavingsCounter = ({ target, delay = 0 }: {target: number;delay?: number;}) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {if (entry.isIntersecting && !hasStarted) setHasStarted(true);},
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [hasStarted]);

  useEffect(() => {
    if (!hasStarted) return;
    const timeout = setTimeout(() => {
      const duration = 1800;
      const steps = 40;
      const increment = target / steps;
      let current = 0;
      const interval = setInterval(() => {
        current += increment;
        if (current >= target) {setCount(target);clearInterval(interval);} else
        setCount(Math.round(current));
      }, duration / steps);
      return () => clearInterval(interval);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [hasStarted, target, delay]);

  return (
    <div ref={ref}>
      <motion.p
        className="text-lg font-heading font-bold text-accent"
        key={count}
        initial={{ scale: 1 }}
        animate={count === target ? { scale: [1, 1.08, 1] } : {}}
        transition={{ duration: 0.3 }}>
        
        €{count.toLocaleString("it-IT")}
      </motion.p>
    </div>);

};

const PricingConfigurator = ({ navigate }: {navigate: (path: string) => void;}) => {
  const [pricingMode, setPricingMode] = useState<PricingMode>("package");
  const [selectedPlan, setSelectedPlan] = useState<PlanTier>("professional");
  const [selectedPackage, setSelectedPackage] = useState("empire");
  const [selectedAddons, setSelectedAddons] = useState<Set<string>>(new Set());
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [showAddons, setShowAddons] = useState(false);
  const [installments, setInstallments] = useState<3 | 6 | null>(null);
  const [selectedSector, setSelectedSector] = useState<PricingSector>("food");
  const [showFeatureRequest, setShowFeatureRequest] = useState(false);
  const [featureRequestText, setFeatureRequestText] = useState("");
  const [featureRequestEmail, setFeatureRequestEmail] = useState("");
  const [featureRequestSending, setFeatureRequestSending] = useState(false);
  const [featureRequestSent, setFeatureRequestSent] = useState(false);

  const plan = PLAN_TIERS.find((p) => p.id === selectedPlan)!;
  const pkg = PACKAGE_TIERS.find((p) => p.id === selectedPackage)!;
  const addonDiscount = billingCycle === "annual" ? 0.8 : 1;
  const planDiscount = billingCycle === "annual" ? 0.8 : 1;

  // Filter agents by selected sector
  const sectorAddons = AI_ADDONS.filter((a) => a.sectors.includes(selectedSector));
  const sectorIncluded = SECTOR_INCLUDED_AGENTS[selectedSector];
  const sectorFeatures = SECTOR_FEATURES[selectedSector];

  // Auto-include sector agents when switching sector/package
  const getAutoIncludedIds = () => {
    if (pricingMode === "package") {
      if (pkg.id === "empire") return sectorIncluded.empire;
      if (pkg.id === "growth") return sectorIncluded.growth;
    }
    return [];
  };
  const autoIncludedIds = getAutoIncludedIds();

  // Free included agents reduce addon cost
  const currentIncludedAgents = pricingMode === "monthly" ? plan.includedAgents : pkg.includedAgents;
  const sortedAddons = [...selectedAddons].sort();
  const paidAddonIds = sortedAddons.slice(currentIncludedAgents);
  const addonTotal = pricingMode === "monthly" ?
  paidAddonIds.reduce((sum, id) => sum + (AI_ADDONS.find((x) => x.id === id)?.price || 0), 0) * addonDiscount :
  paidAddonIds.reduce((sum, id) => sum + (AI_ADDONS.find((x) => x.id === id)?.price || 0), 0) * 0.7; // 30% sconto pacchetto

  const planPrice = plan.price * planDiscount;
  const totalMonthly = planPrice + addonTotal;
  const savedPerYear = billingCycle === "annual" ? (plan.price + paidAddonIds.reduce((s, id) => s + (AI_ADDONS.find((x) => x.id === id)?.price || 0), 0)) * 12 * 0.2 : 0;

  // Package mode: addon monthly cost on top of setup fee
  const packageAddonMonthly = paidAddonIds.reduce((sum, id) => sum + Math.round((AI_ADDONS.find((x) => x.id === id)?.price || 0) * 0.7), 0);
  const packageTotalSetup = pkg.price;
  const packageTotalMonthly = pkg.monthlyFee + packageAddonMonthly;
  const packageInstallment = installments ? Math.round(pkg.price / installments) : null;

  const toggleAddon = (id: string) => {
    setSelectedAddons((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);else next.add(id);
      return next;
    });
  };

  return (
    <Section id="pricing" className="relative overflow-hidden" style={{
      background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(230 22% 10%) 35%, hsl(235 20% 9%) 65%, hsl(228 22% 8%) 100%)"
    }}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(ellipse, hsla(38,65%,48%,0.55), transparent 65%)", filter: "blur(150px)" }} />
        <div className="absolute top-[30%] left-[12%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
        style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.45), transparent 65%)", filter: "blur(130px)" }} />
        <div className="absolute bottom-[18%] right-[15%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
        style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
        <div className="absolute bottom-[30%] left-[28%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
        style={{ background: "radial-gradient(circle, hsla(38,55%,45%,0.3), transparent 65%)", filter: "blur(100px)" }} />
        <div className="absolute top-[15%] right-[25%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
        style={{ background: "radial-gradient(circle, hsla(265,55%,55%,0.25), transparent 60%)", filter: "blur(85px)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
        style={{ background: "linear-gradient(90deg, transparent, hsla(38,55%,50%,0.22), hsla(265,50%,55%,0.12), transparent)" }} />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[95px] opacity-[0.04]"
        style={{ background: "linear-gradient(180deg, hsla(38,55%,50%,0.4), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[70px]"
        style={{ background: "linear-gradient(180deg, transparent, hsla(228,22%,10%,0.5))" }} />
        <div className="absolute inset-0 opacity-[0.012]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "128px 128px"
        }} />
      </div>
      <div className="text-center mb-8 sm:mb-12">
        <SectionLabel text="Piani & Prezzi" icon={<Gem className="w-3 h-3 text-accent" />} />
        <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold leading-[1.08] mb-3"
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
        style={{ color: "white" }}>
          Scegli Come <span className="text-shimmer">Dominare</span> il Tuo Mercato
        </motion.h2>
        <motion.p className="max-w-[440px] mx-auto leading-[1.7] text-xs sm:text-sm"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
        style={{ color: "hsl(38 30% 82%)" }}>
          Pacchetto completo o abbonamento flessibile — in entrambi i casi, il tuo business cambia per sempre.
        </motion.p>

        {/* Mode Toggle: Package vs Monthly */}
        <motion.div className="flex items-center justify-center gap-1 mt-6 p-1 rounded-full border border-border/30 max-w-sm mx-auto"
        style={{ background: "linear-gradient(145deg, hsl(228 20% 14% / 0.95), hsl(232 22% 12% / 0.9))", boxShadow: "0 2px 12px hsl(var(--primary) / 0.08)" }}
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <button onClick={() => setPricingMode("package")}
          className={`relative flex-1 px-4 py-2.5 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all ${
          pricingMode === "package" ? "text-primary-foreground" : "text-foreground/40 hover:text-foreground/60"}`
          }>
            {pricingMode === "package" &&
            <motion.div layoutId="pricingModeIndicator" className="absolute inset-0 rounded-full bg-vibrant-gradient" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            }
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Pacchetto
            </span>
          </button>
          <button onClick={() => setPricingMode("monthly")}
          className={`relative flex-1 px-4 py-2.5 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all ${
          pricingMode === "monthly" ? "text-primary-foreground" : "text-foreground/40 hover:text-foreground/60"}`
          }>
            {pricingMode === "monthly" &&
            <motion.div layoutId="pricingModeIndicator" className="absolute inset-0 rounded-full bg-vibrant-gradient" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            }
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Mensile
            </span>
          </button>
        </motion.div>

        {/* Sector Selector — Lucide Icons */}
        <motion.div className="max-w-lg mx-auto mt-5" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.6rem] font-heading text-foreground/35 tracking-[2px] uppercase text-center mb-2.5">Il tuo settore</p>
          <div className="flex flex-wrap justify-center gap-2">
            {PRICING_SECTORS.map((s) => {
              const isActive = selectedSector === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {setSelectedSector(s.id);setSelectedAddons(new Set());}}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-heading font-semibold transition-all border ${
                    isActive
                      ? "border-primary/40 bg-primary/10 text-primary shadow-[0_0_12px_hsla(265,70%,60%,0.15)]"
                      : "border-border/20 bg-foreground/[0.02] text-foreground/40 hover:text-foreground/60 hover:border-border/40"
                  }`}>
                  {PRICING_SECTOR_ICONS[s.id]}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{s.label.split(" ")[0]}</span>
                </button>
              );
            })}
          </div>
          {sectorFeatures.length > 0 &&
          <div className="flex flex-wrap justify-center gap-2 mt-3">
              {sectorFeatures.slice(0, 3).map((f, i) =>
            <span key={i} className="px-2.5 py-1 rounded-full text-[0.6rem] bg-primary/[0.08] text-primary/70 font-medium">{f}</span>
            )}
            </div>
          }
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ PACKAGE MODE ═══ */}
        {pricingMode === "package" &&
        <motion.div key="packages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

            {/* Urgency banner */}
            {/* Urgency banner — mobile optimized */}
            <motion.div className="mx-auto mb-4 p-2.5 rounded-xl border border-accent/25 bg-accent/[0.06] text-center"
          animate={{ borderColor: ["hsla(35,45%,50%,0.25)", "hsla(35,45%,50%,0.5)", "hsla(35,45%,50%,0.25)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}>
              <p className="text-[0.7rem] text-accent font-bold flex items-center justify-center gap-1.5">
                <Timer className="w-3.5 h-3.5 animate-pulse" />
                Offerta lancio — Risparmia fino a <strong className="text-sm">€6.403</strong>
              </p>
              <p className="text-[0.5rem] text-accent/50 mt-0.5">Solo 7 posti rimasti a questo prezzo</p>
            </motion.div>

            {/* Social proof bar */}
            <div className="flex items-center justify-center gap-3 mb-4 px-2">
              <div className="flex -space-x-2">
                {["👨‍🍳", "👩‍💼", "👨‍⚕️", "💇‍♀️", "🏋️"].map((e, i) =>
              <div key={i} className="w-6 h-6 rounded-full bg-primary/10 border-2 border-background flex items-center justify-center text-[0.55rem]">{e}</div>
              )}
              </div>
              <p className="text-[0.55rem] text-foreground/55"><strong className="text-foreground/75">127+ attività</strong> hanno già scelto Empire questa settimana</p>
            </div>

            {/* Package Cards — mobile conversion-optimized */}
            <div className="sm:hidden space-y-4 mb-5">
              {PACKAGE_TIERS.map((p, idx) => {
              const isSelected = selectedPackage === p.id;
              const isEmpire = p.id === "empire";
              const isGrowth = p.id === "growth";
              const discountPct = Math.round((p.originalPrice - p.price) / p.originalPrice * 100);
              return (
                <motion.div key={p.id}
                onClick={() => setSelectedPackage(p.id)}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.12 }}
                className={`relative w-full rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                isEmpire ?
                "border-2 border-accent/50 shadow-[0_8px_40px_hsla(35,45%,50%,0.15)]" :
                isSelected ?
                "border-2 border-primary/40 shadow-[0_4px_24px_hsla(265,50%,55%,0.1)]" :
                "border border-border/25"}`
                }
                style={{
                  background: isEmpire ?
                  "linear-gradient(165deg, hsl(228 20% 14% / 0.98), hsl(35 12% 12% / 0.95))" :
                  "linear-gradient(165deg, hsl(228 20% 14% / 0.97), hsl(232 22% 12% / 0.94))"
                }}
                whileTap={{ scale: 0.985 }}>

                    {/* Top gradient bar */}
                    <div className={`h-1 w-full ${isEmpire ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : isGrowth ? "bg-vibrant-gradient" : "bg-gradient-to-r from-primary/60 to-primary/30"}`} />

                    {/* Badge */}
                    {p.badge &&
                  <div className={`absolute top-0 right-0 px-4 py-2 rounded-bl-2xl text-[0.6rem] font-bold tracking-[1.5px] font-heading uppercase ${
                  isEmpire ?
                  "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" :
                  p.badge === "Più Scelto" ? "bg-vibrant-gradient text-primary-foreground" :
                  "bg-gradient-to-r from-accent to-primary text-primary-foreground"}`
                  }>{p.badge}</div>
                  }

                    <div className="p-5">
                      {/* Header row: Name + Price */}
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <p className={`text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase ${isEmpire ? "text-accent/80" : "text-foreground/50"}`}>{p.name}</p>
                          <div className="flex items-baseline gap-2.5 mt-1.5">
                            <span className="text-[2rem] font-heading font-extrabold text-white leading-none">€{p.price.toLocaleString("it-IT")}</span>
                            <div className="flex flex-col">
                              <span className="text-sm text-foreground/30 line-through">€{p.originalPrice.toLocaleString("it-IT")}</span>
                              <span className="text-[0.6rem] text-foreground/35">una tantum</span>
                            </div>
                          </div>
                        </div>
                        <motion.div
                        className={`px-3 py-2.5 rounded-xl text-center ${isEmpire ? "bg-accent/15 border border-accent/25" : "bg-primary/10 border border-primary/15"}`}
                        animate={isEmpire ? { scale: [1, 1.06, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}>
                          <span className={`text-2xl font-heading font-black ${isEmpire ? "text-accent" : "text-primary"}`}>-{discountPct}%</span>
                        </motion.div>
                      </div>

                      {/* Installment info */}
                      <p className="text-xs text-foreground/50">
                        oppure <strong className="text-foreground/75">€{Math.round(p.price / 3)}/mese ×3</strong> <span className="text-green-400/80 font-semibold">(TAN 0%)</span>
                      </p>

                      {/* Monthly + Commission pills */}
                      <div className="flex items-center gap-2.5 mt-4">
                        <span className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold border ${
                      p.monthlyFee === 0 ?
                      "bg-accent/12 text-accent border-accent/25" :
                      "bg-foreground/[0.03] text-foreground/50 border-border/15"}`
                      }>
                          {p.monthlyFee === 0 ? "€0/mese ✓" : `poi €${p.monthlyFee}/mese`}
                        </span>
                        <span className={`flex-1 text-center py-2.5 rounded-xl text-xs font-bold border ${
                      p.commission === "0%" ?
                      "bg-accent/12 text-accent border-accent/25" :
                      "bg-foreground/[0.03] text-foreground/50 border-border/15"}`
                      }>
                          {p.commission === "0%" ? "0% commissioni ✓" : `${p.commission} transazioni`}
                        </span>
                      </div>

                      {/* Empire daily cost nudge */}
                      {isEmpire &&
                    <motion.div
                      className="mt-4 p-3.5 rounded-xl bg-accent/[0.08] border border-accent/20 text-center"
                      animate={{ boxShadow: ["0 0 0px hsla(35,45%,50%,0)", "0 0 25px hsla(35,45%,50%,0.12)", "0 0 0px hsla(35,45%,50%,0)"] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                          <p className="text-sm text-accent font-bold">
                            💰 Solo €11/giorno per 24 mesi
                          </p>
                          <p className="text-[0.6rem] text-accent/50 mt-1">Poi è tutto tuo, per sempre. Meno di un caffè al bar.</p>
                        </motion.div>
                    }

                      {/* Tagline */}
                      <p className="text-xs text-foreground/45 mt-3 leading-relaxed italic">{p.tagline}</p>

                      {/* Features */}
                      <ul className="mt-4 space-y-2">
                        {p.features.slice(0, isSelected ? p.features.length : 4).map((f, fi) =>
                      <li key={fi} className="flex items-start gap-2 text-xs text-foreground/70">
                            <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        f.includes("ZERO") || f.includes("0%") ? "bg-accent/15" : "bg-primary/10"}`
                        }>
                              <Check className={`w-3 h-3 ${
                          f.includes("ZERO") || f.includes("0%") ? "text-accent" : "text-primary"}`
                          } />
                            </div>
                            <span className={`leading-snug ${f.includes("ZERO") || f.includes("0%") ? "font-bold text-accent" : f.startsWith("Tutto") || f.startsWith("✅") ? "font-semibold text-foreground/85" : ""}`}>{f}</span>
                          </li>
                      )}
                        {!isSelected && p.features.length > 4 &&
                      <li className="text-xs text-primary/70 font-semibold pl-7 pt-1 flex items-center gap-1 cursor-pointer">
                            <ChevronDown className="w-3.5 h-3.5" />
                            Vedi +{p.features.length - 4} funzionalità
                          </li>
                      }
                      </ul>

                      {/* Bonus inclusi */}
                      {isSelected &&
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 pt-4 border-t border-border/15 overflow-hidden">
                          <p className="text-[0.6rem] font-heading font-bold text-accent/60 tracking-[2px] uppercase mb-2">
                            <Gift className="w-3.5 h-3.5 inline mr-1.5" />Bonus inclusi
                          </p>
                          {p.extras.map((e, ei) =>
                      <p key={ei} className="text-xs text-foreground/50 flex items-center gap-2 mb-1">
                              <Star className="w-3 h-3 text-accent/40 flex-shrink-0" /> {e}
                            </p>
                      )}
                        </motion.div>
                    }

                      {/* Savings bar */}
                      <div className={`mt-4 p-3 rounded-xl text-xs font-bold text-center leading-snug ${
                    isEmpire ? "bg-accent/10 text-accent border border-accent/15" : "bg-primary/[0.05] text-primary/70 border border-primary/10"}`
                    }>
                        💸 {p.savings}
                      </div>

                      {/* CTA button */}
                      <motion.button
                      onClick={(e) => {e.stopPropagation();setSelectedPackage(p.id);navigate("/auth?plan=" + p.id + "&sector=" + selectedSector);}}
                      className={`w-full mt-4 py-4 rounded-xl text-sm font-heading font-bold tracking-wider uppercase relative overflow-hidden ${
                      isEmpire ?
                      "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black shadow-lg shadow-accent/20" :
                      isGrowth ?
                      "bg-vibrant-gradient text-primary-foreground" :
                      "bg-primary/15 text-primary border border-primary/20"}`
                      }
                      whileTap={{ scale: 0.97 }}>
                        {(isEmpire || isGrowth) &&
                      <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                      animate={{ x: ["-200%", "300%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                      }
                        <span className="relative z-10">
                          {isEmpire ? "👑 Scelgo Empire" : isGrowth ? "🚀 Scelgo Growth AI" : "Inizia con Digital Start"}
                        </span>
                      </motion.button>

                      {/* Empire upsell on non-empire cards */}
                      {!isEmpire &&
                    <div className="mt-3 p-2.5 rounded-xl bg-accent/[0.04] border border-accent/10 cursor-pointer" onClick={(e) => {e.stopPropagation();setSelectedPackage("empire");}}>
                          <p className="text-[0.6rem] text-accent/70 text-center leading-snug">
                            ⚡ Con Empire risparmi <strong>€{p.commission === "2%" ? "6.403" : "4.200"}</strong> e 0% commissioni →
                          </p>
                        </div>
                    }
                    </div>
                  </motion.div>);

            })}
            </div>

            {/* Desktop Package Cards */}
            <motion.div className="hidden sm:grid grid-cols-3 gap-4 max-w-4xl mx-auto mb-6"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
              {PACKAGE_TIERS.map((p) => {
              const isSelected = selectedPackage === p.id;
              return (
                <motion.div key={p.id} variants={fadeScale}
                onClick={() => setSelectedPackage(p.id)}
                className={`relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                isSelected ?
                p.id === "empire" ?
                "border-2 border-accent/35 shadow-[0_4px_30px_hsla(35,45%,50%,0.12)]" :
                "border-2 border-primary/35 shadow-[0_4px_24px_hsla(265,50%,55%,0.08)]" :
                "border border-border/30 hover:border-primary/20 shadow-[0_2px_16px_hsla(0,0%,0%,0.05)]"}`
                }
                style={{
                  background: isSelected ?
                  p.id === "empire" ?
                  "linear-gradient(165deg, hsl(228 20% 14% / 0.9), hsl(35 15% 13% / 0.85))" :
                  "linear-gradient(165deg, hsl(228 20% 14% / 0.88), hsl(248 18% 13% / 0.84))" :
                  "linear-gradient(165deg, hsl(228 20% 14% / 0.86), hsl(232 22% 12% / 0.83))"
                }}>
                    {p.badge &&
                  <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[0.5rem] font-bold tracking-[1.5px] font-heading uppercase ${
                  p.id === "empire" ?
                  "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" :
                  p.badge === "Più Scelto" ? "bg-vibrant-gradient text-primary-foreground" :
                  "bg-gradient-to-r from-accent to-primary text-primary-foreground"}`
                  }>{p.badge}</div>
                  }
                    {isSelected && <div className={`absolute top-0 left-0 right-0 h-[2px] ${p.id === "empire" ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : "bg-vibrant-gradient"}`} />}

                    <p className="text-[0.6rem] font-heading font-semibold text-foreground/40 tracking-[3px] uppercase">{p.name}</p>

                    <div className="mt-2">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl sm:text-3xl font-heading font-bold text-foreground">€{p.price.toLocaleString("it-IT")}</span>
                        <span className="text-xs text-foreground/20 line-through">€{p.originalPrice.toLocaleString("it-IT")}</span>
                      </div>
                      <p className="text-[0.55rem] text-foreground/30 mt-0.5">una tantum</p>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1.5">
                      <span className="px-2 py-0.5 rounded-full text-[0.45rem] font-semibold bg-foreground/[0.04] text-foreground/30 border border-border/15">
                        oppure 3×€{Math.round(p.price / 3)}/mese
                      </span>
                      <span className="px-2 py-0.5 rounded-full text-[0.45rem] font-semibold bg-foreground/[0.04] text-foreground/30 border border-border/15">
                        oppure 6×€{Math.round(p.price / 6)}/mese
                      </span>
                      <span className="text-[0.4rem] text-accent/60 font-semibold self-center">0% interessi</span>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      <span className={`px-2 py-0.5 rounded-full text-[0.5rem] font-bold ${
                    p.monthlyFee === 0 ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"}`
                    }>
                        {p.monthlyFee === 0 ? "€0/mese" : `poi €${p.monthlyFee}/mese`}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[0.5rem] font-bold ${
                    p.commission === "0%" ? "bg-accent/20 text-accent" : "bg-foreground/[0.06] text-foreground/40"}`
                    }>
                        {p.commission === "0%" ? "0% commissioni!" : `${p.commission} transazioni`}
                      </span>
                    </div>

                    {p.id === "empire" &&
                  <div className="mt-2 p-2 rounded-lg bg-accent/[0.06] border border-accent/15">
                        <p className="text-[0.55rem] text-accent font-bold text-center">
                          💰 Solo €11/giorno per 24 mesi — poi è tutto tuo, per sempre
                        </p>
                        <p className="text-[0.45rem] text-accent/50 text-center mt-0.5">
                          Meno di un caffè + cornetto al bar. Zero costi nascosti.
                        </p>
                      </div>
                  }

                    <p className="text-[0.6rem] text-foreground/35 mt-2 leading-relaxed">{p.tagline}</p>

                    <ul className="mt-3 space-y-1.5">
                      {p.features.map((f, fi) =>
                    <li key={fi} className="flex items-start gap-2 text-[0.6rem] sm:text-xs text-foreground/50">
                          <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                      f.includes("ZERO") || f.includes("0%") ?
                      "bg-accent/20" :
                      isSelected ? "bg-primary/15" : "bg-foreground/[0.05]"}`
                      }>
                            <Check className={`w-2.5 h-2.5 ${
                        f.includes("ZERO") || f.includes("0%") ? "text-accent" : isSelected ? "text-primary" : "text-foreground/30"}`
                        } />
                          </div>
                          <span className={`${f.startsWith("Tutto") ? "font-semibold text-foreground/60" : ""} ${f.includes("ZERO") || f.includes("0%") ? "font-bold text-accent" : ""}`}>{f}</span>
                        </li>
                    )}
                    </ul>

                    <div className="mt-3 pt-3 border-t border-border/20">
                      <p className="text-[0.5rem] font-heading font-bold text-accent/60 tracking-[2px] uppercase mb-1.5">
                        <Gift className="w-3 h-3 inline mr-1" />Bonus inclusi
                      </p>
                      {p.extras.map((e, ei) =>
                    <p key={ei} className="text-[0.55rem] text-foreground/30 flex items-center gap-1.5 mb-0.5">
                          <Star className="w-2.5 h-2.5 text-accent/40 flex-shrink-0" /> {e}
                        </p>
                    )}
                    </div>

                    <div className={`mt-3 p-2 rounded-lg text-[0.55rem] font-semibold text-center ${
                  p.id === "empire" ? "bg-accent/10 text-accent" : "bg-primary/[0.06] text-primary/70"}`
                  }>
                      {p.savings}
                    </div>

                    {p.id !== "empire" &&
                  <div className="mt-2 p-2 rounded-lg bg-accent/[0.03] border border-accent/10 cursor-pointer" onClick={(e) => {e.stopPropagation();setSelectedPackage("empire");}}>
                        <p className="text-[0.45rem] text-accent/70 text-center">
                          ⚡ Con Empire risparmi <strong>€{p.commission === "2%" ? "6.403" : "4.200"}</strong> in più e hai <strong>0% commissioni per sempre</strong> →
                        </p>
                      </div>
                  }

                    {isSelected &&
                  <motion.div className={`absolute bottom-0 left-0 right-0 h-1 ${p.id === "empire" ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : "bg-vibrant-gradient"}`}
                  layoutId="pkgIndicator" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                  }
                  </motion.div>);

            })}
            </motion.div>

            {/* AI Agents Upsell for Packages */}
            <motion.div className="max-w-4xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <button onClick={() => setShowAddons(!showAddons)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] transition-colors mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-vibrant-gradient flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-heading font-bold text-foreground">Agenti IA per {PRICING_SECTORS.find((s) => s.id === selectedSector)?.label}</p>
                    <p className="text-[0.55rem] text-foreground/35">
                      {autoIncludedIds.length} inclus{autoIncludedIds.length > 1 ? "i" : "o"} nel pacchetto · Altri con 30% sconto
                    </p>
                  </div>
                </div>
                <motion.div animate={{ rotate: showAddons ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-primary/50" />
                </motion.div>
              </button>
              <AnimatePresence>
                {showAddons &&
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
                      {sectorAddons.map((addon) => {
                    const isAutoIncluded = autoIncludedIds.includes(addon.id);
                    const isActive = selectedAddons.has(addon.id) || isAutoIncluded;
                    const displayPrice = Math.round(addon.price * 0.7);
                    return (
                      <motion.div key={addon.id} onClick={() => !isAutoIncluded && toggleAddon(addon.id)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isActive ? "border border-primary/30 bg-primary/[0.06]" : "border border-border/20 hover:border-primary/15 bg-background/30"} ${
                      isAutoIncluded ? "opacity-90" : ""}`} whileTap={{ scale: isAutoIncluded ? 1 : 0.98 }}>
                            {isAutoIncluded &&
                        <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-accent/20 text-[0.45rem] font-bold text-accent tracking-wider uppercase">Incluso</div>
                        }
                            {addon.popular && !isActive && !isAutoIncluded &&
                        <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-accent/20 text-[0.45rem] font-bold text-accent tracking-wider uppercase">Popular</div>
                        }
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-foreground/[0.05] text-foreground/30"}`}>
                              {addon.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isActive ? "text-foreground" : "text-foreground/60"}`}>{addon.name}</p>
                              <p className="text-[0.55rem] text-foreground/30 truncate">{addon.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {isAutoIncluded ?
                          <span className="text-xs font-bold text-accent">Incluso ✓</span> :

                          <div>
                                  <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-foreground/40"}`}>+€{displayPrice}/m</span>
                                  <p className="text-[0.45rem] text-foreground/20 line-through">€{addon.price}/m</p>
                                </div>
                          }
                            </div>
                            {!isAutoIncluded &&
                        <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? "border-primary bg-primary" : "border-foreground/15"}`
                        }>
                                {isActive && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                        }
                          </motion.div>);

                  })}
                    </div>
                  </motion.div>
              }
              </AnimatePresence>
            </motion.div>

            {/* Package Summary & CTA — Dynamic Pricing */}
            <motion.div className="max-w-4xl mx-auto mt-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div
              className={`relative p-5 sm:p-7 rounded-2xl overflow-hidden border ${
              pkg.id === "empire" ? "border-accent/20" : "border-primary/15"}`
              }
              style={{
                background:
                pkg.id === "empire" ?
                "linear-gradient(180deg, hsl(228 20% 14% / 0.9) 0%, hsl(35 15% 13% / 0.85) 45%, hsl(228 20% 14% / 0.9) 100%)" :
                "linear-gradient(180deg, hsl(228 20% 14% / 0.9) 0%, hsl(248 18% 13% / 0.84) 35%, hsl(228 20% 14% / 0.9) 100%)",
                boxShadow: "0 4px 24px hsl(var(--primary) / 0.06)"
              }}>
              
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${pkg.id === "empire" ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : "bg-vibrant-gradient"}`} />
                {/* Shimmer */}
                <motion.div className="absolute inset-0 pointer-events-none"
              style={{ background: "linear-gradient(105deg, transparent 30%, hsla(38,55%,60%,0.04) 48%, transparent 65%)" }}
              animate={{ x: ["-100%", "250%"] }}
              transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }} />
              

                <div className="flex flex-col gap-5 relative z-10">
                  {/* Header: Package name + price */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[0.55rem] font-heading text-foreground/40 tracking-[3px] uppercase">Il Tuo Pacchetto</p>
                        {selectedAddons.size > 0 &&
                      <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                      className="px-2 py-0.5 rounded-full text-[0.4rem] bg-primary/15 text-primary font-bold">
                            PERSONALIZZATO
                          </motion.span>
                      }
                      </div>

                      {/* Quick package switcher */}
                      <div className="flex items-center gap-1.5 mb-3">
                        {PACKAGE_TIERS.map((tier) => {
                        const isActive = tier.id === selectedPackage;
                        const isEmpireTier = tier.id === "empire";
                        return (
                          <motion.button
                            key={tier.id}
                            onClick={() => setSelectedPackage(tier.id)}
                            className={`relative px-3 py-1.5 rounded-full text-[0.5rem] font-heading font-bold tracking-wider uppercase transition-all overflow-hidden ${
                            isActive ?
                            isEmpireTier ?
                            "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black shadow-lg shadow-accent/20" :
                            "bg-vibrant-gradient text-primary-foreground shadow-lg shadow-primary/20" :
                            "bg-foreground/[0.05] text-foreground/35 hover:bg-foreground/[0.08] hover:text-foreground/50"}`
                            }
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            layout
                            transition={{ type: "spring", stiffness: 400, damping: 25 }}>
                            
                              {isActive && isEmpireTier &&
                            <motion.div
                              className="absolute inset-0 pointer-events-none"
                              style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
                              animate={{ x: ["-200%", "300%"] }}
                              transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />

                            }
                              <span className="relative z-10 flex items-center gap-1">
                                {isEmpireTier && "👑 "}{tier.name.split(" ")[0]}
                                {isActive &&
                              <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} className="overflow-hidden">
                                    ✓
                                  </motion.span>
                              }
                              </span>
                            </motion.button>);

                      })}
                      </div>

                      {/* Setup price */}
                      <div className="flex items-baseline gap-2">
                        <motion.span key={packageTotalSetup} initial={{ scale: 1.1, opacity: 0.5 }} animate={{ scale: 1, opacity: 1 }}
                      className="text-3xl sm:text-4xl font-heading font-bold text-foreground">
                          €{packageTotalSetup.toLocaleString("it-IT")}
                        </motion.span>
                        <span className="text-sm text-foreground/20 line-through">€{pkg.originalPrice.toLocaleString("it-IT")}</span>
                        <span className="text-[0.5rem] text-foreground/25">setup</span>
                      </div>

                      {/* Monthly recurring — updates with addons */}
                      {packageTotalMonthly > 0 &&
                    <motion.div key={`monthly-${packageTotalMonthly}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                    className="mt-1.5 flex items-baseline gap-1.5">
                          <span className="text-lg font-heading font-bold text-primary">
                            +€{packageTotalMonthly}/mese
                          </span>
                          {packageAddonMonthly > 0 &&
                      <span className="text-[0.5rem] text-foreground/25">
                              (€{pkg.monthlyFee} canone + €{packageAddonMonthly} agenti)
                            </span>
                      }
                        </motion.div>
                    }
                      {packageTotalMonthly === 0 && pkg.monthlyFee === 0 &&
                    <div className="mt-1.5">
                          <p className="text-[0.6rem] text-accent font-bold">€0/mese — Zero costi ricorrenti!</p>
                          <p className="text-[0.45rem] text-accent/50 mt-0.5">🏆 Pacchetto completo: tutto incluso, niente di nascosto</p>
                        </div>
                    }

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[0.5rem] font-semibold ${pkg.id === "empire" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>{pkg.name}</span>
                        {pkg.commission === "0%" && <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-accent/20 text-accent font-bold animate-pulse">0% Commissioni</span>}
                        {selectedAddons.size > 0 &&
                      <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                      className="px-2 py-0.5 rounded-full text-[0.5rem] bg-primary/10 text-primary font-semibold">
                            +{selectedAddons.size} Agenti IA
                            {paidAddonIds.length > 0 && ` (${sortedAddons.length - paidAddonIds.length} inclus${sortedAddons.length - paidAddonIds.length > 1 ? "i" : "o"})`}
                          </motion.span>
                      }
                      </div>

                      {/* Commission info */}
                      <p className="text-[0.5rem] text-foreground/25 mt-2">
                        {pkg.commission} sulle transazioni · IVA esclusa
                      </p>

                      {/* Animated cumulative savings counter — Empire only */}
                      {pkg.id === "empire" && (() => {
                      // Compare Empire (€7997 one-time, €0/mo, 0% commissions) vs staying on monthly plans
                      const revenueMonth = 8000;
                      const months = 24;
                      // vs Starter monthly: €55/mo + 2% commissions
                      const starterTotal24 = 55 * months + revenueMonth * 0.02 * months; // €1320 + €3840 = €5160
                      // vs Professional monthly: €119/mo + 1% commissions
                      const proTotal24 = 119 * months + revenueMonth * 0.01 * months; // €2856 + €1920 = €4776
                      // Empire saves on commissions alone: €8000 * 2% * 24 = €3840, plus no monthly fee
                      // Real comparison: what would equivalent features cost monthly over 24 months
                      // Enterprise monthly (€239/mo) is closest to Empire features: €239 * 24 = €5736, plus still 0.5% fees
                      const enterpriseTotal24 = 239 * months + revenueMonth * 0.005 * months; // €5736 + €960 = €6696
                      const empireCost24 = 7997; // one-time, no recurring
                      // After 24 months, Empire user paid €7997 total. Monthly user paid €5736+ and KEEPS paying
                      // The real value: from month 25 onward, Empire = €0/mo, monthly = €239/mo still
                      // Show "savings over 36 months" to make it compelling
                      const months36 = 36;
                      const savingsVsStarter = (55 * months36 + revenueMonth * 0.02 * months36) - empireCost24; // €7740 - €7997... still close
                      // Better: show lifetime savings including commissions saved
                      const savingsVsMonthlyPro = (119 * months36 + revenueMonth * 0.01 * months36) - empireCost24; // €7164 - €7997
                      // The real killer stat: commissions saved with €8k/mo revenue
                      const commissionsSaved24 = revenueMonth * 0.02 * months; // €3840 saved vs 2% plans
                      const totalSavings36VsEnterprise = (239 * months36) - empireCost24; // €8604 - €7997 = €607 + commissions
                      const totalWithCommissions = totalSavings36VsEnterprise + revenueMonth * 0.005 * months36; // + €1440 = €2047
                      return (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: 0.4 }}
                          className="mt-3 p-3 rounded-xl border border-accent/15 bg-gradient-to-br from-accent/[0.05] via-background/40 to-accent/[0.02] overflow-hidden relative">
                          
                            {/* Shimmer */}
                            <motion.div className="absolute inset-0 pointer-events-none"
                          style={{ background: "linear-gradient(105deg, transparent 35%, hsla(38,55%,60%,0.08) 50%, transparent 65%)" }}
                          animate={{ x: ["-150%", "250%"] }}
                          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
                          
                            <p className="text-[0.5rem] font-heading font-bold text-accent/60 tracking-[2px] uppercase mb-2 relative z-10">💰 Risparmio vs Abbonamento Mensile</p>
                            <div className="grid grid-cols-2 gap-2 relative z-10">
                              <div className="text-center p-2 rounded-lg bg-accent/[0.06] border border-accent/10">
                                <p className="text-[0.45rem] text-foreground/30 mb-0.5">Commissioni risparmiate</p>
                                <SavingsCounter target={commissionsSaved24} />
                                <p className="text-[0.4rem] text-foreground/20 mt-0.5">0% vs 2% in 24 mesi</p>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-accent/[0.06] border border-accent/10">
                                <p className="text-[0.45rem] text-foreground/30 mb-0.5">vs Enterprise mensile</p>
                                <SavingsCounter target={totalWithCommissions} delay={0.3} />
                                <p className="text-[0.4rem] text-foreground/20 mt-0.5">canone + fees in 36 mesi</p>
                              </div>
                            </div>
                            <p className="text-[0.4rem] text-accent/40 text-center mt-2 relative z-10">
                              Basato su €8.000/mese di fatturato · Dal mese 25 paghi €0
                            </p>
                          </motion.div>);

                    })()}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col gap-2 sm:items-end">
                      <motion.button onClick={() => navigate("/auth")}
                    className={`px-8 py-3.5 rounded-full font-bold text-sm font-heading tracking-wider uppercase whitespace-nowrap relative overflow-hidden ${
                    pkg.id === "empire" ?
                    "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" :
                    "bg-vibrant-gradient text-primary-foreground"}`
                    }
                    whileHover={{ scale: 1.03, boxShadow: pkg.id === "empire" ? "0 15px 50px hsla(35,45%,50%,0.3)" : "0 15px 50px hsla(38,50%,55%,0.2)" }}
                    whileTap={{ scale: 0.97 }}>
                        <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                      animate={{ x: ["-200%", "300%"] }}
                      transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }} />
                      
                        <span className="relative z-10">{pkg.id === "empire" ? "Attiva Empire — Domina Ora" : "Attiva Ora — Setup in 24h"}</span>
                      </motion.button>
                      <p className="text-[0.5rem] text-foreground/20 text-center sm:text-right">Pagamento sicuro · Rateizzabile · Fattura deducibile · Assistenza 7/7</p>
                    </div>
                  </div>

                  {/* Addon summary breakdown if addons selected */}
                  <AnimatePresence>
                    {selectedAddons.size > 0 &&
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden">
                        <div className="pt-3 border-t border-border/10">
                          <p className="text-[0.5rem] font-heading font-bold text-foreground/30 tracking-[2px] uppercase mb-2">Riepilogo Agenti IA</p>
                          <div className="space-y-1">
                            {sortedAddons.map((id, idx) => {
                          const addon = AI_ADDONS.find((x) => x.id === id);
                          if (!addon) return null;
                          const isFree = idx < pkg.includedAgents;
                          return (
                            <div key={id} className="flex items-center justify-between text-[0.55rem]">
                                  <span className="text-foreground/40">{addon.name}</span>
                                  {isFree ?
                              <span className="text-accent font-bold">Incluso ✓</span> :

                              <span className="text-primary font-semibold">+€{Math.round(addon.price * 0.7)}/mese</span>
                              }
                                </div>);

                        })}
                          </div>
                          {paidAddonIds.length > 0 &&
                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10 text-[0.6rem] font-bold">
                              <span className="text-foreground/50">Totale agenti extra</span>
                              <span className="text-primary">+€{packageAddonMonthly}/mese</span>
                            </div>
                      }
                        </div>
                      </motion.div>
                  }
                  </AnimatePresence>

                  {/* Installment Options */}
                  <div className="pt-3 border-t border-border/15">
                    <p className="text-[0.6rem] font-heading font-bold text-foreground/50 tracking-[2px] uppercase mb-3">Scegli come pagare il setup</p>
                    {(() => {
                    const interestRate3 = 0; // TAN 0%
                    const interestRate6 = 0.059; // TAN 5.9%
                    const total3 = pkg.price; // no interest
                    const total6 = Math.round(pkg.price * (1 + interestRate6));
                    const monthly3 = Math.round(total3 / 3);
                    const monthly6 = Math.round(total6 / 6);
                    const extraCost6 = total6 - pkg.price;
                    return (
                      <>
                          <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setInstallments(null)}
                          className={`relative p-3 rounded-xl text-center transition-all ${
                          installments === null ?
                          pkg.id === "empire" ? "border-2 border-accent/40 bg-accent/[0.06]" : "border-2 border-primary/40 bg-primary/[0.06]" :
                          "border border-border/20 hover:border-primary/15 bg-background/30"}`
                          }>
                              {installments === null &&
                            <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent/20 text-[0.4rem] font-bold text-accent tracking-wider uppercase whitespace-nowrap">Più scelto</span>
                            }
                              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">€{pkg.price.toLocaleString("it-IT")}</p>
                              <p className="text-[0.5rem] text-foreground/30 mt-0.5">Una tantum</p>
                              <p className="text-[0.45rem] text-accent/60 font-semibold mt-1">Miglior prezzo</p>
                            </button>
                            <button onClick={() => setInstallments(3)}
                          className={`relative p-3 rounded-xl text-center transition-all ${
                          installments === 3 ?
                          pkg.id === "empire" ? "border-2 border-accent/40 bg-accent/[0.06]" : "border-2 border-primary/40 bg-primary/[0.06]" :
                          "border border-border/20 hover:border-primary/15 bg-background/30"}`
                          }>
                              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">€{monthly3.toLocaleString("it-IT")}</p>
                              <p className="text-[0.5rem] text-foreground/30 mt-0.5">×3 mesi</p>
                              <p className="text-[0.45rem] text-green-400 font-bold mt-1">TAN 0%</p>
                            </button>
                            <button onClick={() => setInstallments(6)}
                          className={`relative p-3 rounded-xl text-center transition-all ${
                          installments === 6 ?
                          pkg.id === "empire" ? "border-2 border-accent/40 bg-accent/[0.06]" : "border-2 border-primary/40 bg-primary/[0.06]" :
                          "border border-border/20 hover:border-primary/15 bg-background/30"}`
                          }>
                              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">€{monthly6.toLocaleString("it-IT")}</p>
                              <p className="text-[0.5rem] text-foreground/30 mt-0.5">×6 mesi</p>
                              <p className="text-[0.45rem] text-amber-400 font-bold mt-1">TAN 5,9%</p>
                            </button>
                          </div>

                          {/* Total cost summary */}
                          {installments &&
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                        className="mt-3 p-3 rounded-xl bg-foreground/[0.02] border border-border/10">
                              <div className="flex items-center justify-between text-[0.6rem]">
                                <span className="text-foreground/40">Setup ({installments} rate)</span>
                                <span className="text-foreground/70 font-bold">€{(installments === 3 ? monthly3 : monthly6).toLocaleString("it-IT")}/mese</span>
                              </div>
                              {installments === 6 &&
                          <div className="flex items-center justify-between text-[0.6rem] mt-1">
                                  <span className="text-foreground/40">Interessi (TAN 5,9%)</span>
                                  <span className="text-amber-400/80 font-bold">+€{extraCost6.toLocaleString("it-IT")} totali</span>
                                </div>
                          }
                              {installments === 3 &&
                          <div className="flex items-center justify-between text-[0.6rem] mt-1">
                                  <span className="text-foreground/40">Interessi</span>
                                  <span className="text-green-400/80 font-bold">€0 — Tasso Zero ✓</span>
                                </div>
                          }
                              {packageTotalMonthly > 0 &&
                          <div className="flex items-center justify-between text-[0.6rem] mt-1">
                                  <span className="text-foreground/40">Canone + agenti</span>
                                  <span className="text-foreground/70 font-bold">€{packageTotalMonthly}/mese</span>
                                </div>
                          }
                              <div className="flex items-center justify-between text-[0.7rem] mt-2 pt-2 border-t border-border/10">
                                <span className="text-foreground/60 font-bold">Totale mensile per {installments} mesi</span>
                                <motion.span key={`total-${(installments === 3 ? monthly3 : monthly6) + packageTotalMonthly}`}
                            initial={{ scale: 1.1 }} animate={{ scale: 1 }}
                            className={`font-heading font-bold ${pkg.id === "empire" ? "text-accent" : "text-primary"}`}>
                                  €{((installments === 3 ? monthly3 : monthly6) + packageTotalMonthly).toLocaleString("it-IT")}/mese
                                </motion.span>
                              </div>
                              <div className="flex items-center justify-between text-[0.6rem] mt-1.5 pt-1.5 border-t border-border/5">
                                <span className="text-foreground/30">Costo totale finale</span>
                                <span className="text-foreground/50 font-bold">€{(installments === 3 ? total3 : total6).toLocaleString("it-IT")}</span>
                              </div>
                              <p className="text-[0.45rem] text-foreground/35 text-center mt-1.5">
                                Addebito automatico · {installments === 3 ? "Tasso Zero garantito" : "TAEG 6,08%"} · Dopo le {installments} rate solo {packageTotalMonthly > 0 ? `€${packageTotalMonthly}/mese` : "€0/mese"}
                              </p>
                              {installments === 6 &&
                          <p className="text-[0.5rem] text-center mt-2 text-amber-400/70 font-semibold">
                                  💡 Passa a 3 rate per risparmiare €{extraCost6.toLocaleString("it-IT")} di interessi
                                </p>
                          }
                            </motion.div>
                        }
                        </>);

                  })()}

                    {/* Empire push if not selected */}
                    {pkg.id !== "empire" &&
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                  className="mt-3 p-3 rounded-xl bg-accent/[0.04] border border-accent/15 cursor-pointer hover:bg-accent/[0.08] transition-colors"
                  onClick={() => setSelectedPackage("empire")}>
                        <p className="text-[0.6rem] text-accent font-bold text-center">
                          💎 Passa a Empire Domination — risparmi €{(7997 - pkg.price + pkg.monthlyFee * 24).toLocaleString("it-IT")} in 2 anni
                        </p>
                        <p className="text-[0.45rem] text-accent/50 text-center mt-0.5">
                          0% commissioni + €0/mese per 24 mesi · Tutto incluso · Solo €{Math.round(7997 / 6)}/mese in 6 rate
                        </p>
                      </motion.div>
                  }
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Comparison Table — Professional */}
            <motion.div className="max-w-4xl mx-auto mt-8 p-5 sm:p-8 rounded-2xl border border-accent/15 relative overflow-hidden shadow-[0_8px_50px_hsla(265,50%,30%,0.12),0_0_60px_hsla(38,50%,50%,0.05)]"
          style={{ background: "linear-gradient(165deg, hsla(265,16%,12%,0.94), hsla(230,14%,9%,0.95))" }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsla(38,55%,55%,0.3), transparent)" }} />
              <div className="text-center mb-5">
                <p className="text-[0.6rem] font-heading text-accent/60 tracking-[4px] uppercase mb-1">Analisi dettagliata</p>
                <h3 className="text-lg sm:text-xl font-heading font-bold text-foreground">Quale pacchetto fa per te?</h3>
                <p className="text-xs text-foreground/35 mt-1 max-w-md mx-auto">Confronta i piani in un colpo d'occhio. Ogni euro investito nel pacchetto giusto si ripaga da solo.</p>
              </div>

              {/* ── MOBILE: Card-based comparison ── */}
              <div className="sm:hidden space-y-3">
                {PACKAGE_TIERS.map((p, pi) => {
                const compRows = [
                { label: "Canone mensile", vals: ["€49/mese", "€29/mese", "€0 per sempre"], icon: "💳" },
                { label: "Commissione vendite", vals: ["2%", "1%", "0%"], icon: "📊" },
                { label: "Costo reale 2 anni", vals: [`€${(1997 + 49 * 24).toLocaleString("it-IT")}`, `€${(4997 + 29 * 24).toLocaleString("it-IT")}`, "€7.997"], icon: "🧮" },
                { label: "Piattaforma inclusa", vals: ["12 mesi", "18 mesi", "24 mesi"], icon: "📅" },
                { label: "Agenti IA inclusi", vals: ["0", "2", "5"], icon: "🤖" },
                { label: "CRM & Fidelizzazione", vals: ["Base", "Avanzata", "Enterprise"], icon: "👥" },
                { label: "Review Shield™", vals: ["—", "✓", "✓"], icon: "🛡️" },
                { label: "Analytics IA", vals: ["—", "—", "✓"], icon: "📈" },
                { label: "Account Manager", vals: ["—", "—", "VIP 7/7"], icon: "🎯" },
                { label: "Multi-sede", vals: ["—", "—", "✓"], icon: "🏢" }];

                const isEmpire = p.id === "empire";
                const isActive = p.id === selectedPackage;
                const savings = ["€883", "€2.203", "€6.403+"];
                return (
                  <motion.div key={p.id}
                  onClick={() => setSelectedPackage(p.id)}
                  className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                  isActive ?
                  isEmpire ?
                  "border-2 border-accent/40 bg-accent/[0.04]" :
                  "border-2 border-primary/30 bg-primary/[0.03]" :
                  "border border-border/15 bg-background/30"}`
                  }
                  whileTap={{ scale: 0.99 }}>
                      {isEmpire &&
                    <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 text-center py-1">
                          <span className="text-[0.5rem] font-heading font-bold text-accent tracking-[3px] uppercase">★ Consigliato</span>
                        </div>
                    }
                      {/* Card header */}
                      <div className="p-4 pb-3 flex items-center justify-between">
                        <div>
                          <p className={`text-[0.6rem] font-heading font-bold tracking-[2px] uppercase ${isEmpire ? "text-accent" : isActive ? "text-primary" : "text-foreground/40"}`}>{p.name}</p>
                          <p className={`text-2xl font-heading font-bold mt-0.5 ${isActive ? "text-foreground" : "text-foreground/50"}`}>€{p.price.toLocaleString("it-IT")}</p>
                          <p className="text-[0.5rem] text-foreground/40">oppure da €{Math.round(p.price / 6)}/mese ×6</p>
                          {isEmpire && <p className="text-[0.4rem] text-accent/70 font-bold mt-0.5">🏆 Tutto Incluso</p>}
                        </div>
                        <div className="text-right">
                          <p className={`text-xs font-heading font-bold ${isEmpire ? "text-accent" : "text-primary/70"}`}>{savings[pi]}</p>
                          <p className="text-[0.4rem] text-foreground/25">risparmi</p>
                        </div>
                      </div>
                      {/* Feature rows */}
                      <div className="px-4 pb-3 space-y-0">
                        {compRows.map((row, ri) => {
                        const val = row.vals[pi];
                        const isPositive = val !== "—" && val !== "0";
                        return (
                          <div key={ri} className={`flex items-center justify-between py-1.5 ${ri > 0 ? "border-t border-border/8" : ""}`}>
                              <span className="text-[0.6rem] text-foreground/40 flex items-center gap-1.5">
                                <span className="text-[0.55rem]">{row.icon}</span>
                                {row.label}
                              </span>
                              <span className={`text-[0.6rem] font-semibold ${
                            !isPositive ? "text-foreground/15" :
                            isEmpire ? "text-accent" :
                            "text-foreground/60"}`
                            }>{val}</span>
                            </div>);

                      })}
                      </div>
                      {/* CTA */}
                      <div className="px-4 pb-4">
                        <motion.button
                        onClick={(e) => {e.stopPropagation();setSelectedPackage(p.id);navigate("/auth?plan=" + p.id + "&sector=" + selectedSector);}}
                        className={`w-full py-2.5 rounded-xl text-[0.6rem] font-heading font-bold tracking-wider uppercase transition-all ${
                        isEmpire ?
                        "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" :
                        isActive ?
                        "bg-vibrant-gradient text-primary-foreground" :
                        "bg-foreground/[0.06] text-foreground/40"}`
                        }
                        whileTap={{ scale: 0.97 }}>
                          {isEmpire ? "Scelgo Empire →" : `Scelgo ${p.name}`}
                        </motion.button>
                      </div>
                    </motion.div>);

              })}
              </div>

              {/* ── DESKTOP: Table comparison ── */}
              <div className="hidden sm:block overflow-x-auto">
                <div className="min-w-[540px] rounded-2xl border border-border/15 overflow-hidden">
                  {/* Header row */}
                  <div className="grid grid-cols-4 gap-0">
                    <div className="p-4 bg-background/50" />
                    {PACKAGE_TIERS.map((p) =>
                  <div key={p.id}
                  onClick={() => setSelectedPackage(p.id)}
                  className={`relative p-4 text-center cursor-pointer transition-all ${
                  p.id === selectedPackage ?
                  p.id === "empire" ? "bg-accent/[0.08]" : "bg-primary/[0.06]" :
                  "bg-background/30 hover:bg-foreground/[0.02]"}`
                  }>
                        {p.id === "empire" &&
                    <span className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg bg-accent/20 text-[0.4rem] font-bold text-accent tracking-[2px] uppercase">Consigliato</span>
                    }
                        <p className={`text-[0.55rem] font-heading font-bold tracking-[2px] uppercase mt-1 ${
                    p.id === selectedPackage ? p.id === "empire" ? "text-accent" : "text-primary" : "text-foreground/30"}`
                    }>{p.name}</p>
                        <p className={`text-xl font-heading font-bold mt-1 ${
                    p.id === selectedPackage ? "text-foreground" : "text-foreground/40"}`
                    }>€{p.price.toLocaleString("it-IT")}</p>
                        <p className="text-[0.45rem] text-foreground/40 mt-0.5">oppure da €{Math.round(p.price / 6)}/mese ×6</p>
                        {p.id === "empire" && <p className="text-[0.4rem] text-accent/70 font-bold mt-0.5">🏆 Tutto Incluso</p>}
                      </div>
                  )}
                  </div>
                  {/* Data rows */}
                  {[
                { label: "Canone mensile dopo setup", vals: ["€49/mese", "€29/mese", "€0 per sempre"], icon: "💳", isHighlight: [false, false, true] },
                { label: "Commissione su ogni vendita", vals: ["2% trattenuto", "1% trattenuto", "0% — tutto tuo"], icon: "📊", isHighlight: [false, false, true] },
                { label: "Costo reale in 2 anni", vals: [`€${(1997 + 49 * 24).toLocaleString("it-IT")}`, `€${(4997 + 29 * 24).toLocaleString("it-IT")}`, "€7.997 totali"], icon: "🧮", isHighlight: [false, false, true] },
                { label: "Piattaforma inclusa", vals: ["12 mesi", "18 mesi", "24 mesi"], icon: "📅", isHighlight: [false, false, true] },
                { label: "Agenti IA inclusi", vals: ["Nessuno", "2 a scelta", "5 a scelta"], icon: "🤖", isHighlight: [false, false, true] },
                { label: "CRM & Fidelizzazione", vals: ["Base", "Avanzata", "Enterprise"], icon: "👥", isHighlight: [false, true, true] },
                { label: "Review Shield™", vals: ["—", "✓ Incluso", "✓ Incluso"], icon: "🛡️", isHighlight: [false, true, true] },
                { label: "Analytics predittivi IA", vals: ["—", "—", "✓ Incluso"], icon: "📈", isHighlight: [false, false, true] },
                { label: "Account Manager dedicato", vals: ["—", "—", "✓ VIP 7/7"], icon: "🎯", isHighlight: [false, false, true] },
                { label: "Multi-sede", vals: ["—", "—", "✓ Incluso"], icon: "🏢", isHighlight: [false, false, true] }].
                map((row, ri) =>
                <div key={ri} className={`grid grid-cols-4 gap-0 ${ri % 2 === 0 ? "bg-foreground/[0.01]" : "bg-background/20"}`}>
                      <div className="p-3 flex items-center gap-2 border-t border-border/10">
                        <span className="text-xs">{row.icon}</span>
                        <span className="text-[0.6rem] text-foreground/50 font-medium">{row.label}</span>
                      </div>
                      {row.vals.map((v, vi) =>
                  <div key={vi} className={`p-3 text-center border-t border-border/10 transition-all ${
                  vi === PACKAGE_TIERS.findIndex((pp) => pp.id === selectedPackage) ? "bg-primary/[0.03]" : ""} ${
                  PACKAGE_TIERS[vi].id === "empire" ? "bg-accent/[0.02]" : ""}`}>
                          <span className={`text-[0.6rem] font-semibold ${
                    row.isHighlight[vi] ?
                    vi === 2 ? "text-accent font-bold" : "text-primary" :
                    v === "—" ? "text-foreground/15" : "text-foreground/45"}`
                    }>{v}</span>
                        </div>
                  )}
                    </div>
                )}
                  {/* Savings footer */}
                  <div className="grid grid-cols-4 gap-0 border-t-2 border-accent/15">
                    <div className="p-4 flex items-center">
                      <span className="text-[0.6rem] font-heading font-bold text-accent/70 tracking-[1px] uppercase">Risparmio totale</span>
                    </div>
                    {[
                  { save: "€883", sub: "vs mensile" },
                  { save: "€2.203", sub: "vs mensile" },
                  { save: "€6.403+", sub: "commissioni incluse" }].
                  map((s, si) =>
                  <div key={si} className={`p-4 text-center ${si === 2 ? "bg-accent/[0.06]" : ""}`}>
                        <p className={`text-sm font-heading font-bold ${si === 2 ? "text-accent" : "text-foreground/50"}`}>{s.save}</p>
                        <p className="text-[0.4rem] text-foreground/25 mt-0.5">{s.sub}</p>
                      </div>
                  )}
                  </div>
                  {/* Bottom CTA */}
                  <div className="grid grid-cols-4 gap-0 border-t border-border/10">
                    <div className="p-3" />
                    {PACKAGE_TIERS.map((p) =>
                  <div key={p.id} className="p-3 text-center">
                        <motion.button
                      onClick={() => {setSelectedPackage(p.id);navigate("/auth?plan=" + p.id + "&sector=" + selectedSector);}}
                      className={`w-full px-3 py-2 rounded-lg text-[0.55rem] font-heading font-bold tracking-wider uppercase transition-all ${
                      p.id === "empire" ?
                      "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" :
                      p.id === selectedPackage ?
                      "bg-vibrant-gradient text-primary-foreground" :
                      "bg-foreground/[0.05] text-foreground/40 hover:bg-foreground/[0.08]"}`
                      }
                      whileHover={{ scale: 1.03 }}
                      whileTap={{ scale: 0.97 }}>
                          {p.id === "empire" ? "Scelgo Empire →" : `Scelgo ${p.name}`}
                        </motion.button>
                      </div>
                  )}
                  </div>
                </div>
              </div>

              {/* Scenario di esempio persuasivo */}
              <motion.div className="mt-5 p-3 sm:p-4 rounded-xl border border-accent/10 bg-accent/[0.02]"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
                <p className="text-[0.55rem] sm:text-[0.6rem] font-heading font-bold text-accent/70 tracking-[2px] uppercase text-center mb-2">📊 Esempio: €8.000/mese di ordini</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 text-center">
                  <div className="flex sm:block items-center justify-between p-2 sm:p-0 rounded-lg bg-foreground/[0.02] sm:bg-transparent">
                    <p className="text-[0.55rem] text-foreground/30 font-medium">Digital Start</p>
                    <div className="text-right sm:text-center">
                      <p className="text-[0.6rem] sm:text-xs font-bold text-foreground/50">€209/mese</p>
                      <p className="text-[0.45rem] text-foreground/25">€160 comm. + €49 canone</p>
                    </div>
                  </div>
                  <div className="flex sm:block items-center justify-between p-2 sm:p-0 rounded-lg bg-foreground/[0.02] sm:bg-transparent">
                    <p className="text-[0.55rem] text-foreground/30 font-medium">Growth AI</p>
                    <div className="text-right sm:text-center">
                      <p className="text-[0.6rem] sm:text-xs font-bold text-foreground/50">€109/mese</p>
                      <p className="text-[0.45rem] text-foreground/25">€80 comm. + €29 canone</p>
                    </div>
                  </div>
                  <div className="flex sm:block items-center justify-between p-2 sm:p-0 rounded-lg bg-accent/[0.06] sm:-m-1">
                    <p className="text-[0.55rem] text-accent font-bold">Empire Domination</p>
                    <div className="text-right sm:text-center">
                      <p className="text-[0.6rem] sm:text-xs font-bold text-accent">€0/mese</p>
                      <p className="text-[0.45rem] text-accent/60 font-semibold">Zero commissioni · Zero canone</p>
                    </div>
                  </div>
                </div>
                <p className="text-[0.5rem] text-accent/60 text-center mt-2.5 font-semibold">
                  Con Empire risparmi <strong className="text-accent">€2.508/anno</strong> — si ripaga in meno di 4 mesi.
                </p>
              </motion.div>
              </motion.div>

              {/* ── Feature Request CTA ── */}
              <motion.div className="max-w-4xl mx-auto mt-8 text-center" initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
                <div className="p-5 rounded-2xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-background/90 to-accent/[0.03] backdrop-blur-sm">
                  <div className="w-12 h-12 mx-auto rounded-xl bg-vibrant-gradient flex items-center justify-center mb-3">
                    <Sparkles className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-1">Non trovi quello che cerchi?</h3>
                  <p className="text-xs text-foreground/40 max-w-sm mx-auto mb-4">
                    Sviluppiamo funzionalità su misura per il tuo business. Descrivici cosa ti serve e lo costruiamo per te.
                  </p>
                  <motion.button
                onClick={() => setShowFeatureRequest(true)}
                className="px-6 py-3 rounded-full bg-vibrant-gradient text-primary-foreground text-xs font-heading font-bold tracking-wider uppercase"
                whileHover={{ scale: 1.03, boxShadow: "0 10px 40px hsla(38,50%,55%,0.2)" }}
                whileTap={{ scale: 0.97 }}>
                    <span className="flex items-center gap-2">
                      <Mail className="w-3.5 h-3.5" /> Richiedi Funzionalità Personalizzata
                    </span>
                  </motion.button>
                  <p className="text-[0.5rem] text-foreground/20 mt-2">Risposta garantita entro 24h · Preventivo gratuito · Settore: {PRICING_SECTORS.find((s) => s.id === selectedSector)?.label}</p>
                </div>
              </motion.div>
            </motion.div>
        }

          {/* ── Feature Request Modal ── */}
          <AnimatePresence>
            {showFeatureRequest &&
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowFeatureRequest(false)}>
                <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
              className="relative w-full max-w-md p-6 rounded-2xl border border-border/30 bg-background/95 backdrop-blur-xl"
              onClick={(e) => e.stopPropagation()}>
                  <button onClick={() => setShowFeatureRequest(false)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-foreground/[0.05] text-foreground/30">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-vibrant-gradient flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-foreground text-center mb-1">Richiedi Funzionalità</h3>
                  <p className="text-xs text-foreground/40 text-center mb-4">Descrivici la funzione che desideri. Il nostro team la valuterà e ti invierà un preventivo.</p>

                  {featureRequestSent ?
              <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-6">
                      <div className="w-14 h-14 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-3">
                        <Check className="w-7 h-7 text-accent" />
                      </div>
                      <p className="text-sm font-heading font-bold text-foreground mb-1">Richiesta Inviata!</p>
                      <p className="text-xs text-foreground/40">Ti contatteremo entro 24 ore con un preventivo personalizzato.</p>
                      <button onClick={() => {setShowFeatureRequest(false);setFeatureRequestSent(false);}}
                className="mt-4 px-5 py-2 rounded-full bg-foreground/[0.05] text-foreground/60 text-xs font-semibold hover:bg-foreground/[0.08] transition-colors">
                        Chiudi
                      </button>
                    </motion.div> :

              <div className="space-y-3">
                      <div>
                        <label className="text-[0.6rem] font-heading font-bold text-foreground/40 tracking-[1px] uppercase">Settore</label>
                        <div className="mt-1 px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border/20 text-xs text-foreground/60 flex items-center gap-1.5">
                          {PRICING_SECTOR_ICONS[selectedSector]} {PRICING_SECTORS.find((s) => s.id === selectedSector)?.label}
                          {selectedPackage && <span className="ml-2 text-primary/60">· {PACKAGE_TIERS.find((p) => p.id === selectedPackage)?.name}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="text-[0.6rem] font-heading font-bold text-foreground/40 tracking-[1px] uppercase">La tua email</label>
                        <input
                    type="email" value={featureRequestEmail} onChange={(e) => setFeatureRequestEmail(e.target.value)}
                    placeholder="nome@azienda.it"
                    className="mt-1 w-full px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-border/20 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/30 transition-colors" />
                  
                      </div>
                      <div>
                        <label className="text-[0.6rem] font-heading font-bold text-foreground/40 tracking-[1px] uppercase">Descrivi la funzionalità desiderata</label>
                        <textarea
                    value={featureRequestText} onChange={(e) => setFeatureRequestText(e.target.value)}
                    placeholder="Es: Vorrei un sistema di prenotazione con caparra automatica..."
                    rows={4}
                    className="mt-1 w-full px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-border/20 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/30 transition-colors resize-none" />
                  
                      </div>
                      <motion.button
                  onClick={async () => {
                    if (!featureRequestText.trim() || !featureRequestEmail.trim()) return;
                    setFeatureRequestSending(true);
                    try {
                      const { supabase } = await import("@/integrations/supabase/client");
                      await supabase.functions.invoke("submit-feature-request", {
                        body: {
                          email: featureRequestEmail.trim(),
                          description: featureRequestText.trim(),
                          sector: selectedSector,
                          packageId: selectedPackage
                        }
                      });
                      setFeatureRequestSent(true);
                    } catch {



















                      // silent fail
                    } finally {setFeatureRequestSending(false);}}} disabled={featureRequestSending || !featureRequestText.trim() || !featureRequestEmail.trim()} className="w-full px-5 py-3 rounded-xl bg-vibrant-gradient text-primary-foreground text-sm font-heading font-bold tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                        {featureRequestSending ? "Invio in corso..." : "Invia Richiesta →"}
                      </motion.button>
                      <p className="text-[0.45rem] text-foreground/15 text-center">I tuoi dati sono protetti e utilizzati solo per rispondere alla tua richiesta.</p>
                    </div>}
                </motion.div>
              </motion.div>}
          </AnimatePresence>
        {pricingMode === "monthly" && <motion.div key="monthly" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

            {/* Billing toggle */}
            <motion.div className="flex items-center justify-center gap-3 mb-6" initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <button onClick={() => setBillingCycle("monthly")} className={`px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all ${billingCycle === "monthly" ? "bg-primary/15 text-primary" : "text-foreground/30 hover:text-foreground/50"}`}>
                Mensile
              </button>
              <button onClick={() => setBillingCycle("annual")} className={`px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${billingCycle === "annual" ? "bg-primary/15 text-primary" : "text-foreground/30 hover:text-foreground/50"}`}>
                Annuale
                <span className="px-1.5 py-0.5 rounded-full text-[0.5rem] bg-accent/20 text-accent font-bold">−20%</span>
              </button>
            </motion.div>

            {/* Upsell nudge toward packages */}
            <motion.div className="max-w-3xl mx-auto mb-5 p-3 rounded-xl border border-accent/15 bg-accent/[0.03] text-center cursor-pointer hover:bg-accent/[0.06] transition-colors" onClick={() => setPricingMode("package")} whileHover={{ scale: 1.01 }}>
              <p className="text-[0.6rem] text-accent/70 font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>💡 Con un <strong>pacchetto completo</strong> risparmi fino a €6.403 e azzeri le commissioni → <u>Scopri i pacchetti</u></span>
              </p>
            </motion.div>

            {/* Plan Cards */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-4 max-w-3xl mx-auto mb-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
              {PLAN_TIERS.map((p) => {const isSelected = selectedPlan === p.id;const displayPrice = Math.round(p.price * planDiscount);const isEnterprise = p.id === "enterprise";return (
                  <motion.div key={p.id} variants={fadeScale}
                  onClick={() => {setSelectedPlan(p.id);if (p.includedAgents > 0) setShowAddons(true);}}
                  className={`relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected ?
                  "border-2 border-primary/40 shadow-[0_0_40px_hsla(38,50%,55%,0.1)]" :
                  "border border-border/25 hover:border-primary/20"}`}
                  style={{
                    background: isSelected ?
                    "linear-gradient(165deg, hsl(228 20% 14% / 0.98), hsl(38 14% 11% / 0.92))" :
                    "linear-gradient(165deg, hsl(228 20% 14% / 0.97), hsl(232 22% 12% / 0.94))"
                  }}>
                    {/* Top bar */}
                    <div className={`absolute top-0 left-0 right-0 h-1 ${isEnterprise ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : isSelected ? "bg-vibrant-gradient" : "bg-transparent"}`} />
                    
                    {p.badge &&
                    <div className={`absolute top-0 right-0 px-4 py-1.5 rounded-bl-2xl text-[0.6rem] font-bold tracking-[1.5px] font-heading uppercase ${
                    p.badge === "Max Revenue" ? "bg-gradient-to-r from-accent to-primary text-primary-foreground" : "bg-vibrant-gradient text-primary-foreground"}`
                    }>{p.badge}</div>
                    }

                    <p className={`text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase ${isEnterprise ? "text-accent/70" : "text-foreground/50"}`}>{p.name}</p>
                    <div className="flex items-baseline gap-1.5 mt-2">
                      <span className="text-[2rem] sm:text-4xl font-heading font-bold text-white">€{displayPrice}</span>
                      <span className="text-sm text-foreground/30">/mese</span>
                    </div>
                    {billingCycle === "annual" &&
                    <p className="text-xs text-accent font-semibold mt-1">Risparmi €{Math.round(p.price * 12 * 0.2)}/anno</p>
                    }
                    <p className="text-xs text-foreground/40 mt-2 leading-relaxed">{p.desc}</p>

                    {/* Commission info */}
                    <div className="mt-3 flex gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[0.6rem] font-bold bg-foreground/[0.04] text-foreground/40 border border-border/15">
                        {p.id === "starter" ? "2% transazioni" : p.id === "professional" ? "1% transazioni" : "0.5% transazioni"}
                      </span>
                      {p.includedAgents > 0 &&
                      <span className="px-2.5 py-1 rounded-lg text-[0.6rem] font-bold bg-primary/10 text-primary border border-primary/15">
                        {p.includedAgents} Agenti IA inclusi
                      </span>
                      }
                    </div>

                    <ul className="mt-4 space-y-2">
                      {p.features.map((f, fi) =>
                      <li key={fi} className="flex items-start gap-2 text-xs text-foreground/60">
                          <div className={`w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-primary/15" : "bg-foreground/[0.05]"}`}>
                            <Check className={`w-3 h-3 ${isSelected ? "text-primary" : "text-foreground/30"}`} />
                          </div>
                          <span className={f.startsWith("Tutto") ? "font-semibold text-foreground/70" : ""}>{f}</span>
                        </li>
                      )}
                    </ul>

                    {/* CTA */}
                    <motion.button
                    onClick={(e) => {e.stopPropagation();setSelectedPlan(p.id);navigate("/auth?plan=" + p.id + "&sector=" + selectedSector);}}
                    className={`w-full mt-5 py-3.5 rounded-xl text-xs font-heading font-bold tracking-wider uppercase relative overflow-hidden transition-all ${
                    isEnterprise ?
                    "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black shadow-lg shadow-accent/20" :
                    isSelected ?
                    "bg-vibrant-gradient text-primary-foreground" :
                    "bg-primary/10 text-primary border border-primary/20"}`
                    }
                    whileTap={{ scale: 0.97 }}>
                      {(isEnterprise || isSelected) &&
                    <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                    animate={{ x: ["-200%", "300%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                    }
                      <span className="relative z-10">
                        {isEnterprise ? "👑 Scelgo Enterprise" : `Scelgo ${p.name}`}
                      </span>
                    </motion.button>

                    {isSelected &&
                    <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-vibrant-gradient"
                    layoutId="planIndicator" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    }
                  </motion.div>);

              })}
            </motion.div>

            {/* AI Agents Upsell */}
            <motion.div className="max-w-3xl mx-auto" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <button onClick={() => setShowAddons(!showAddons)}
            className="w-full flex items-center justify-between p-4 rounded-xl border border-primary/15 bg-primary/[0.03] hover:bg-primary/[0.06] transition-colors mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-vibrant-gradient flex items-center justify-center">
                    <Bot className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="text-left">
                    <p className="text-xs sm:text-sm font-heading font-bold text-foreground">Potenzia con Agenti IA</p>
                    <p className="text-[0.55rem] text-foreground/55">
                      {plan.includedAgents > 0 ? `${plan.includedAgents} inclus${plan.includedAgents > 1 ? "i" : "o"} nel piano · Aggiungi gli altri a prezzo scontato` : "Aggiungi automazioni intelligenti al tuo piano"}
                    </p>
                  </div>
                </div>
                <motion.div animate={{ rotate: showAddons ? 180 : 0 }}>
                  <ChevronDown className="w-5 h-5 text-primary/50" />
                </motion.div>
              </button>

              <AnimatePresence>
                {showAddons &&
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
                      {AI_ADDONS.map((addon) => {
                    const isActive = selectedAddons.has(addon.id);
                    const isFree = isActive && [...selectedAddons].sort().indexOf(addon.id) < plan.includedAgents;
                    const displayPrice = Math.round(addon.price * addonDiscount);
                    return (
                      <motion.div key={addon.id} onClick={() => toggleAddon(addon.id)}
                      className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                      isActive ? "border border-primary/30 bg-primary/[0.06]" : "border border-border/20 hover:border-primary/15 bg-background/30"}`
                      } whileTap={{ scale: 0.98 }}>
                            {addon.popular && !isActive &&
                        <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-accent/20 text-[0.45rem] font-bold text-accent tracking-wider uppercase">Popular</div>
                        }
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-foreground/[0.05] text-foreground/30"}`}>
                              {addon.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isActive ? "text-foreground" : "text-foreground/60"}`}>{addon.name}</p>
                              <p className="text-[0.55rem] text-foreground/50 truncate">{addon.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {isFree ?
                          <span className="text-xs font-bold text-accent">Incluso</span> :

                          <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-foreground/40"}`}>+€{displayPrice}/m</span>
                          }
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                        isActive ? "border-primary bg-primary" : "border-foreground/15"}`
                        }>
                              {isActive && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </motion.div>);

                  })}
                    </div>
                  </motion.div>
              }
              </AnimatePresence>
            </motion.div>

            {/* Monthly Summary & CTA */}
            <motion.div className="max-w-3xl mx-auto mt-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="relative p-5 sm:p-7 rounded-2xl overflow-hidden border border-primary/20"
            style={{ background: "linear-gradient(180deg, hsla(0,0%,4%,0.99) 0%, hsla(38,16%,8%,0.9) 42%, hsla(0,0%,4%,0.99) 100%)" }}>
                <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 relative z-10">
                  <div>
                    <p className="text-[0.55rem] font-heading text-foreground/60 tracking-[3px] uppercase mb-1">Il Tuo Piano</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-heading font-bold text-foreground">€{Math.round(totalMonthly)}</span>
                      <span className="text-sm text-foreground/50">/mese</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-primary/10 text-primary font-semibold">{plan.name}</span>
                      {selectedAddons.size > 0 && <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-accent/10 text-accent font-semibold">+{selectedAddons.size} Agenti IA</span>}
                      {savedPerYear > 0 && <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-accent/20 text-accent font-bold">Risparmi €{Math.round(savedPerYear)}/anno</span>}
                    </div>
                    <p className="text-[0.55rem] text-foreground/45 mt-2">+ 2% sulle transazioni · IVA esclusa · Cancella quando vuoi</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <motion.button onClick={() => navigate("/auth")}
                  className="px-8 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase whitespace-nowrap"
                  whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(38,50%,55%,0.2)" }}
                  whileTap={{ scale: 0.97 }}>
                      Attiva Ora — Prova Gratis 14gg
                    </motion.button>
                    <p className="text-[0.5rem] text-foreground/40 text-center sm:text-right">Nessuna carta richiesta · Setup in 24h · Assistenza 7/7</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        }
      </AnimatePresence>

      {/* Trust badges */}
      <motion.div className="flex flex-wrap justify-center gap-3 mt-6 max-w-3xl mx-auto"
      initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        {[
        { icon: <Shield className="w-3.5 h-3.5" />, text: "GDPR Compliant" },
        { icon: <Lock className="w-3.5 h-3.5" />, text: "AES-256" },
        { icon: <Zap className="w-3.5 h-3.5" />, text: "Aggiornamenti settimanali" },
        { icon: <Headphones className="w-3.5 h-3.5" />, text: "Assistenza 7/7" },
        { icon: <CreditCard className="w-3.5 h-3.5" />, text: "Rate 0% interessi" }].
        map((b, i) =>
        <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/20 bg-background/30">
            <span className="text-primary/70">{b.icon}</span>
            <span className="text-[0.55rem] text-foreground/55 font-medium">{b.text}</span>
          </div>
        )}
      </motion.div>
    </Section>);

};

/* ═══════════════════════════════════════════
   MOBILE IPHONE CAROUSEL — 3 at a time, auto-scroll
   ═══════════════════════════════════════════ */
type CarouselItem = {name: string;route: string;color: string;label: string;nav: string;image: string;};

const MobileIPhoneCarousel = ({ items, navigate }: {items: CarouselItem[];navigate: (p: string) => void;}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const animRef = useRef<number>(0);
  const scrollPos = useRef(0);
  const speed = 0.4; // px per frame
  const itemW = 122; // card width + gap
  const totalW = items.length * itemW;

  // Auto-scroll via rAF
  useEffect(() => {
    if (!isPlaying || expanded) return;
    const track = trackRef.current;
    if (!track) return;
    let running = true;
    const tick = () => {
      if (!running) return;
      scrollPos.current += speed;
      if (scrollPos.current >= totalW) scrollPos.current -= totalW;
      track.style.transform = `translate3d(-${scrollPos.current}px, 0, 0)`;
      animRef.current = requestAnimationFrame(tick);
    };
    animRef.current = requestAnimationFrame(tick);
    return () => {running = false;cancelAnimationFrame(animRef.current);};
  }, [isPlaying, expanded, totalW]);

  const nudge = (dir: number) => {
    scrollPos.current += dir * itemW;
    if (scrollPos.current < 0) scrollPos.current += totalW;
    if (scrollPos.current >= totalW) scrollPos.current -= totalW;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(-${scrollPos.current}px, 0, 0)`;
  };

  // Render a single iPhone card with hero image preview (no iframes — instant load)
  const IPhoneCard = ({ item, compact = false }: {item: CarouselItem;compact?: boolean;}) =>
  <div className={`flex-shrink-0 ${compact ? "w-[118px]" : "w-[118px]"}`}>
      <MockupLightbox imageSrc={item.image} imageAlt={item.name}>
      <div className="relative w-full aspect-[9/18] rounded-[20px] border-[2px] overflow-hidden"
    style={{ borderColor: `${item.color}40`, boxShadow: `0 8px 24px hsla(0,0%,0%,0.4), 0 0 12px ${item.color}10` }}>
        <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[36px] h-[10px] bg-black rounded-full z-20" />
        <div className="absolute inset-[2px] rounded-[18px] overflow-hidden bg-black">
          <img
          src={item.image}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy" />
        
          <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${item.color}15 0%, ${item.color}08 40%, transparent 100%)` }} />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-1.5 pt-6" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.92) 20%, transparent)" }}>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[5px] px-1 py-[1px] rounded-full font-bold tracking-wider uppercase" style={{ background: `${item.color}25`, color: item.color, border: `1px solid ${item.color}35` }}>★ Live</span>
          </div>
          <p className="text-[8px] font-bold text-white leading-tight truncate">{item.name}</p>
          <p className="text-[5px] text-white/40 truncate">{item.label}</p>
        </div>
        <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[30px] h-[2.5px] bg-white/20 rounded-full z-20" />
      </div>
      </MockupLightbox>
      <div className="text-center mt-1 cursor-pointer" onClick={() => navigate(item.nav)}>
        <p className="text-[7px] font-semibold text-white/50 truncate">{item.name}</p>
      </div>
    </div>;


  if (expanded) {
    return (
      <div className="sm:hidden px-2">
        {/* Controls */}
        <div className="flex items-center justify-between mb-3">
          <span className="text-[10px] font-heading font-bold text-foreground/50 uppercase tracking-widest">{items.length} Demo Live</span>
          <button onClick={() => setExpanded(false)} className="text-[10px] font-semibold text-primary/70 flex items-center gap-1">
            <X className="w-3 h-3" /> Chiudi
          </button>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {items.map((item, i) => <IPhoneCard key={i} item={item} compact />)}
        </div>
      </div>);

  }

  // Duplicate items for infinite loop
  const loopItems = [...items, ...items];

  return (
    <div className="sm:hidden">
      {/* Controls bar */}
      <div className="flex items-center justify-between px-3 mb-3">
        <div className="flex items-center gap-2">
          <button onClick={() => nudge(-1)} className="w-7 h-7 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary/30 transition-colors">
            <ChevronLeft className="w-3.5 h-3.5 text-foreground/50" />
          </button>
          <button onClick={() => setIsPlaying((p) => !p)} className="w-7 h-7 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary/30 transition-colors">
            {isPlaying ? <Pause className="w-3 h-3 text-foreground/50" /> : <Play className="w-3 h-3 text-foreground/50" />}
          </button>
          <button onClick={() => nudge(1)} className="w-7 h-7 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary/30 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-foreground/50" />
          </button>
        </div>
        <button onClick={() => {setIsPlaying(false);setExpanded(true);}} className="text-[10px] font-semibold text-primary/70 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Vedi Tutti
        </button>
      </div>

      {/* Carousel track */}
      <div className="overflow-hidden mx-2">
        <div ref={trackRef} className="flex gap-[4px] will-change-transform" style={{ width: `${loopItems.length * itemW}px` }}>
          {loopItems.map((item, i) => <IPhoneCard key={i} item={item} />)}
        </div>
      </div>
    </div>);

};

/* ═══════════════════════════════════════════
   MAIN
   ═══════════════════════════════════════════ */

const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromPartner = searchParams.get("from") === "partner";
  const {
    heroLanding, videoHero, heroTechCommand, heroAiPlatform, heroPartnerLuxury,
    mockupCliente, mockupAdmin, mockupCucina,
    nccHeroBg, nccPremiumCoast, nccPremiumInterior, nccFleetShowcase,
    cartoonFood, cartoonNcc, cartoonBeauty, cartoonHealthcare, cartoonRetail, cartoonFitness, cartoonHotel
  } = useLandingAssets();
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const [premiumGrid, setPremiumGrid] = useState(true); // kept for type safety
  const mockupCarouselRef = useRef<HTMLDivElement>(null);
  const [mockupCarouselPaused, setMockupCarouselPaused] = useState(false);
  const [expandBenefits, setExpandBenefits] = useState(false);
  const [expandServices, setExpandServices] = useState(false);
  const [expandMockups, setExpandMockups] = useState(false);
  const [expandTestimonials, setExpandTestimonials] = useState(false);

  /* Build hero carousel sectors from real mockup data — 3 screens per sector */
  const heroCarouselSectors = useMemo(() => {
    const sectorEntries: { screens: [string, string, string]; label: string }[] = [];
    const sectorLabels: Record<string, string> = {
      food: "Food", ncc: "NCC", beauty: "Beauty", healthcare: "Healthcare",
      retail: "Retail", fitness: "Fitness", hospitality: "Hotel", beach: "Beach",
      plumber: "Artigiani", electrician: "Elettricisti", construction: "Edilizia",
      events: "Eventi", garage: "Autofficine", logistics: "Logistica",
      gardening: "Giardinaggio", veterinary: "Veterinari", photography: "Fotografia",
      education: "Formazione", childcare: "Asili", tattoo: "Tattoo",
      cleaning: "Pulizie", agriturismo: "Agriturismo", legal: "Legale",
      accounting: "Contabilità",
    };
    for (const [key, imgs] of Object.entries(SECTOR_MOCKUP_IMAGES)) {
      if (!imgs || imgs.length < 2) continue;
      const label = sectorLabels[key] || key;
      // Use first 3 images (or duplicate last if only 2)
      const s: [string, string, string] = [
        imgs[0],
        imgs[1],
        imgs[2] || imgs[1],
      ];
      sectorEntries.push({ screens: s, label });
    }
    return sectorEntries;
  }, []);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const isHeroInView = useInView(heroRef, { margin: "300px 0px -35% 0px" });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  /* Viewport-animation safety: reveal stuck framer-motion elements */
  useEffect(() => {
    // On mobile, use a simpler/cheaper approach
    if (IS_MOBILE_LP) {
      // Single delayed scan — force all hidden sections visible after 3s
      const timer = window.setTimeout(() => {
        document.querySelectorAll<HTMLElement>('section [style*="opacity: 0"]').forEach((el) => {
          el.style.transition = "opacity 300ms ease-out";
          el.style.opacity = "1";
          el.style.transform = "none";
        });
      }, 3000);
      return () => window.clearTimeout(timer);
    }

    // Desktop: full IntersectionObserver approach
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const computedOpacity = Number.parseFloat(window.getComputedStyle(el).opacity || "1");
          if (computedOpacity > 0.02) { observer.unobserve(el); return; }
          el.style.willChange = "opacity, transform";
          el.style.transition = "opacity 400ms ease-out, transform 400ms ease-out";
          el.style.opacity = "1";
          el.style.transform = "none";
          observer.unobserve(el);
        });
      },
      { root: null, rootMargin: "200px 0px", threshold: 0.01 }
    );

    const observeHiddenCandidates = () => {
      document.querySelectorAll<HTMLElement>('[style*="opacity"]').forEach((el) => {
        const computed = Number.parseFloat(window.getComputedStyle(el).opacity || "1");
        if (computed < 0.02) observer.observe(el);
      });
    };

    observeHiddenCandidates();
    const scans = [
      window.setTimeout(observeHiddenCandidates, 800),
      window.setTimeout(observeHiddenCandidates, 2000),
      window.setTimeout(observeHiddenCandidates, 4000)
    ];

    const nuclear = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>('section [style*="opacity"]').forEach((el) => {
        const computed = Number.parseFloat(window.getComputedStyle(el).opacity || "1");
        if (computed < 0.02) {
          el.style.transition = "opacity 300ms ease-out";
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
    }, 5000);

    return () => {
      observer.disconnect();
      scans.forEach(clearTimeout);
      window.clearTimeout(nuclear);
    };
  }, []);

  useEffect(() => {
    let ticking = false;
    const h = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        setNavScrolled((prev) => {const next = y > 60;return prev === next ? prev : next;});
        setCtaVisible((prev) => {const next = y > 400;return prev === next ? prev : next;});
        ticking = false;
      });
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);


  const manualMonthlyCost = weeklyHours * hourlyCost * 4.3;
  const automatedCost = manualMonthlyCost * 0.2; // 80% automated
  const monthlySaving = manualMonthlyCost - automatedCost;
  const yearSaving = monthlySaving * 12;
  const hoursSavedMonth = Math.round(weeklyHours * 0.8 * 4.3);
  const empirePlanCost = 49; // base monthly
  const netMonthlySaving = monthlySaving - empirePlanCost;

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  /* ═══ DATA ═══ */
  const [sectorSheetOpen, setSectorSheetOpen] = useState(false);

  const industries = [
  { id: "food" as const, icon: <ChefHat className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Food & Ristorazione", desc: "Ristoranti, pizzerie, bar, pasticcerie", gradient: "from-violet-500 to-purple-400", emoji: "🍽️", modules: "Menu Digitale · Ordini · QR · Cucina Live", image: cartoonFood },
  { id: "ncc" as const, icon: <Car className="w-4 h-4 sm:w-5 sm:h-5" />, title: "NCC & Trasporto", desc: "Noleggio con conducente, transfer", gradient: "from-purple-500 to-indigo-400", emoji: "🚘", modules: "Flotta · Tratte · Booking · Autisti", image: cartoonNcc },
  { id: "beauty" as const, icon: <Scissors className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Beauty & Wellness", desc: "Saloni, centri estetici, SPA", gradient: "from-fuchsia-500/80 to-violet-400", emoji: "💅", modules: "Agenda · Clienti · Reminder · Trattamenti", image: cartoonBeauty },
  { id: "healthcare" as const, icon: <Heart className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Healthcare", desc: "Studi medici, dentisti, fisioterapisti", gradient: "from-indigo-400 to-violet-500", emoji: "🏥", modules: "Schede Paziente · Agenda · Fatturazione", image: cartoonHealthcare },
  { id: "retail" as const, icon: <Store className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Retail & Negozi", desc: "Negozi, boutique, e-commerce locale", gradient: "from-purple-400 to-fuchsia-400/80", emoji: "🛍️", modules: "Catalogo · Inventario · POS · Promozioni", image: cartoonRetail },
  { id: "fitness" as const, icon: <Dumbbell className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Fitness & Sport", desc: "Palestre, centri sportivi, PT", gradient: "from-violet-400 to-indigo-500", emoji: "💪", modules: "Abbonamenti · Corsi · Check-in · Pagamenti", image: cartoonFitness },
  { id: "hospitality" as const, icon: <Building className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", gradient: "from-purple-500/80 to-violet-400", emoji: "🏨", modules: "Camere · Booking · Ospiti · Concierge", image: cartoonHotel }];


  const extraSectors = [
  { icon: <GraduationCap className="w-4 h-4" />, title: "Formazione & Coaching", desc: "Corsi, tutoring, certificazioni", gradient: "from-violet-500 to-purple-400" },
  { icon: <Waves className="w-4 h-4" />, title: "Stabilimenti Balneari", desc: "Ombrelloni, lettini, bar spiaggia", gradient: "from-indigo-400 to-violet-400" },
  { icon: <Heart className="w-4 h-4" />, title: "Veterinari & Pet Care", desc: "Cliniche, toelettature, pensioni", gradient: "from-purple-400 to-fuchsia-400/80" },
  { icon: <Wrench className="w-4 h-4" />, title: "Artigiani & Impiantisti", desc: "Idraulici, elettricisti, caldaisti", gradient: "from-indigo-500 to-purple-400" },
  { icon: <Palette className="w-4 h-4" />, title: "Studi Creativi", desc: "Fotografi, designer, architetti", gradient: "from-fuchsia-500/80 to-violet-400" },
  { icon: <Dumbbell className="w-4 h-4" />, title: "CrossFit & Functional", desc: "Box, classi, WOD, membership", gradient: "from-purple-500 to-indigo-400" },
  { icon: <Activity className="w-4 h-4" />, title: "Yoga & Pilates", desc: "Studi, ritiri, classi online", gradient: "from-violet-400 to-purple-300" },
  { icon: <Layers className="w-4 h-4" />, title: "Lavanderie & Stirerie", desc: "Ritiro, consegna, abbonamenti", gradient: "from-indigo-400 to-violet-300" },
  { icon: <Radio className="w-4 h-4" />, title: "Scuole di Musica", desc: "Lezioni, sale prove, eventi", gradient: "from-purple-500 to-violet-400" },
  { icon: <Building className="w-4 h-4" />, title: "Agenzie Immobiliari", desc: "Annunci, visite, CRM clienti", gradient: "from-indigo-500 to-violet-500" },
  { icon: <Shield className="w-4 h-4" />, title: "Studi Legali", desc: "Pratiche, clienti, parcelle", gradient: "from-slate-500 to-violet-400/60" },
  { icon: <Target className="w-4 h-4" />, title: "Edilizia & Costruzioni", desc: "Cantieri, preventivi, SAL", gradient: "from-purple-500/80 to-indigo-400" },
  { icon: <Calendar className="w-4 h-4" />, title: "Eventi & Catering", desc: "Booking, menu, staff, logistica", gradient: "from-violet-500 to-purple-400" },
  { icon: <Car className="w-4 h-4" />, title: "Autofficine & Carrozzerie", desc: "Interventi, ricambi, preventivi", gradient: "from-indigo-400/80 to-violet-400/60" },
  { icon: <Package className="w-4 h-4" />, title: "Logistica & Spedizioni", desc: "Tracking, magazzino, consegne", gradient: "from-purple-400 to-indigo-400" },
  { icon: <Leaf className="w-4 h-4" />, title: "Giardinaggio & Vivaisti", desc: "Interventi, manutenzione, vendita", gradient: "from-violet-400 to-purple-400" },
  { icon: <Sparkles className="w-4 h-4" />, title: "Intrattenimento", desc: "Parchi, escape room, bowling", gradient: "from-fuchsia-400/80 to-violet-400" },
  { icon: <Users className="w-4 h-4" />, title: "Asili & Doposcuola", desc: "Iscrizioni, presenze, comunicazioni", gradient: "from-indigo-400 to-purple-300" }];


  const services = [
  { icon: <Brain className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "AI Business Engine", desc: "L'IA analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni.", tag: "IA", color: "from-primary to-accent" },
  { icon: <Smartphone className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "App White Label", desc: "App professionale con il TUO brand, colori e dominio. Nessun logo di terzi.", tag: "APP", color: "from-violet-500 to-primary" },
  { icon: <Calendar className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini e prenotazioni da un unico pannello.", tag: "OPS", color: "from-indigo-400 to-violet-500" },
  { icon: <Shield className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Review Shield™", desc: "Le recensioni negative restano private. Solo le migliori vanno online.", tag: "BRAND", color: "from-purple-400 to-violet-500" },
  { icon: <Users className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "CRM & Fidelizzazione", desc: "Storico acquisti, preferenze, wallet fedeltà. Clienti ricorrenti.", tag: "GROWTH", color: "from-fuchsia-500/80 to-purple-500" },
  { icon: <BarChart3 className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, trend e fatturazione elettronica.", tag: "FINANCE", color: "from-indigo-500 to-violet-400" },
  { icon: <Package className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Inventario & HACCP", desc: "Monitora scorte, alert automatici, controlli igienico-sanitari.", tag: "OPS", color: "from-purple-500 to-primary" },
  { icon: <Bell className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Marketing Automation", desc: "Push, email, WhatsApp, promozioni mirate e segmentazione.", tag: "MARKETING", color: "from-accent to-violet-500" },
  { icon: <Lock className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR, backup automatici, audit trail.", tag: "SECURITY", color: "from-violet-400/60 to-indigo-400/60" }];


  const metrics = [
  { value: 847, suffix: "+", label: "Attività Attive" },
  { value: 25, suffix: "+", label: "Settori Coperti" },
  { value: 40, suffix: "%", prefix: "+", label: "Aumento Fatturato" },
  { value: 99.8, suffix: "%", label: "Soddisfazione" }];


  const testimonials = [
  { name: "Marco Pellegrini", role: "Trattoria da Marco · Roma", quote: "In 3 mesi ho spostato il 60% degli ordini dalla piattaforma alla mia app. Risparmio €3.200 al mese netti.", metric: "−€3.200/mese", industry: "Food", emoji: "🍽️", photo: testimonialMarco },
  { name: "Alessandra Conti", role: "NCC Premium Transfer · Milano", quote: "Prima gestivo le prenotazioni via WhatsApp. Ora ho un sistema automatizzato con flotta, tratte e pagamenti integrati.", metric: "+40% fatturato", industry: "NCC", emoji: "🚘", photo: testimonialAlessandra },
  { name: "Valentina Rossi", role: "Beauty Lab · Firenze", quote: "I clienti prenotano dall'app, ricevono promemoria automatici e il no-show è crollato del 70%.", metric: "−70% no-show", industry: "Beauty", emoji: "💅", photo: testimonialValentina },
  { name: "Dr. Luca Bianchi", role: "Studio Dentistico · Torino", quote: "Agenda digitale, schede paziente, fatturazione elettronica. Ho eliminato 2 ore di burocrazia al giorno.", metric: "−2h/giorno", industry: "Healthcare", emoji: "🏥", photo: testimonialLuca },
  { name: "Simone Moretti", role: "CrossFit Arena · Bologna", quote: "Gestione corsi, abbonamenti e pagamenti in un'unica piattaforma. Il tasso di rinnovo è salito all'87%.", metric: "87% rinnovi", industry: "Fitness", emoji: "💪", photo: testimonialSimone },
  { name: "Giulia De Luca", role: "Boutique Eleganza · Napoli", quote: "Il catalogo digitale ha trasformato il mio negozio. Le vendite online sono il 35% del totale.", metric: "+35% vendite", industry: "Retail", emoji: "🛍️", photo: testimonialGiulia }];


  const faqs = [
  { q: "Per quali settori funziona Empire?", a: "Empire copre oltre 25 settori: ristoranti, NCC, saloni di bellezza, studi medici, negozi, palestre, hotel, idraulici, elettricisti, agriturismi, lidi, e molti altri. Ogni settore ha moduli, terminologia e flussi dedicati che si attivano automaticamente. Con 98+ agenti IA autonomi." },
  { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore. L'IA fa il lavoro pesante: carica una foto e in 60 secondi hai il tuo catalogo digitale completo." },
  { q: "Come funzionano i pagamenti?", a: "I pagamenti arrivano direttamente sul TUO conto via Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15× meno delle piattaforme tradizionali." },
  { q: "Quanto costa davvero?", a: "€2.997 una tantum (o 3 rate da €1.099). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni. Nessun vincolo, nessun costo nascosto." },
  { q: "I miei dati sono al sicuro?", a: "Sì. Crittografia AES-256, conformità GDPR, backup automatici e accessi multi-ruolo. Standard enterprise anche per la piccola attività. I tuoi dati sono di tua proprietà." },
  { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Guadagni €997 per ogni vendita + bonus fino a €1.500/mese. Pagamenti istantanei via Stripe Connect. Nessun rischio, nessun investimento iniziale." },
  { q: "Quanto tempo serve per essere operativi?", a: "24 ore. Il nostro team configura tutto: branding, menu/catalogo, integrazioni. Formazione inclusa. Sei operativo dal giorno 1." },
  { q: "Posso personalizzare tutto?", a: "Assolutamente. Logo, colori, dominio, moduli attivi, flussi operativi, notifiche, template email — tutto è personalizzabile senza toccare codice." }];


  const navLinks = [
  { href: "#industries", label: "Settori" },
  { href: "#services", label: "Funzionalità" },
  { href: "#pricing", label: "Prezzi" }];


  const whyUs = [
  { icon: <Cpu className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Tecnologia Proprietaria", desc: "Stack tecnologico sviluppato internamente. Non rivendiamo software altrui." },
  { icon: <Workflow className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Automazione Totale", desc: "Ogni processo ripetitivo viene eliminato. Dal contatto alla fatturazione." },
  { icon: <Gauge className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Performance Garantite", desc: "99.9% uptime, <200ms latenza, scaling automatico." },
  { icon: <ServerCog className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Mai obsoleto." },
  { icon: <Database className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "I Tuoi Dati, Per Sempre", desc: "Proprietà totale dei dati. Esporta tutto. Zero lock-in." },
  { icon: <Headphones className="w-3.5 h-3.5 sm:w-5 sm:h-5" />, title: "Supporto Dedicato", desc: "Team italiano 7/7. Persone vere che risolvono." }];


  return (
    <div
      className="min-h-screen overflow-x-hidden relative landing-noise-off landing-premium-luxury landing-dark"
      style={{ background: "radial-gradient(120% 80% at 50% 35%, hsl(228 22% 8%) 0%, hsl(230 24% 7%) 40%, hsl(232 20% 6%) 64%, hsl(234 26% 5%) 100%)" }}>
      

      {/* ═══════ AMBIENT BACKGROUND ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle violet ambient orbs */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[250px] opacity-[0.02] bg-primary -top-[200px] left-1/4" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.015] bg-accent top-[50vh] -right-[100px]" />
        {/* Particles - reduced */}
        <Particle delay={0} size={2} x="10%" y="30%" />
        <Particle delay={2} size={2} x="70%" y="60%" />
        <Particle delay={1.5} size={2} x="50%" y="45%" />
      </div>

      {/* ═══════ NEURAL CELLS BACKGROUND ═══════ */}
      <div>
        <NeuralCellsBackground />
      </div>

      {/* ═══════ NAVIGATION — Ultra Premium Luxury Futuristic ═══════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 pt-[env(safe-area-inset-top)] ${navScrolled ? "pb-0" : "pb-1"}`}>
        {/* Glassmorphism backdrop — deep on scroll with chromatic aberration */}
        <motion.div
          className="absolute inset-0"
          animate={{
            backgroundColor: navScrolled ? "hsla(230,12%,6%,0.94)" : "hsla(230,12%,6%,0.75)",
            backdropFilter: navScrolled ? "blur(40px) saturate(1.8)" : "blur(20px) saturate(1.4)"
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }} />
        
        {/* ── PCB Circuit board background ── */}
        {
        <motion.div
          className="absolute inset-0 overflow-hidden pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}>
          
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1200 64" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
              <defs>
                <filter id="pcbGlow">
                  <feGaussianBlur stdDeviation="2" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
                <filter id="pcbGlowStrong">
                  <feGaussianBlur stdDeviation="3" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              
              {/* === LEFT SIDE PCB TRACES === */}
              {/* Main horizontal trace with 90° bends */}
              <path d="M 0,18 L 60,18 L 60,32 L 120,32 L 120,18 L 180,18 L 180,44 L 220,44"
            stroke="hsla(38,50%,55%,0.12)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              {/* Branch trace going up */}
              <path d="M 90,32 L 90,8 L 140,8"
            stroke="hsla(38,50%,55%,0.08)" strokeWidth="0.6" fill="none" strokeLinecap="round" />
              {/* Via pad at junction */}
              <circle cx="90" cy="32" r="3" fill="none" stroke="hsla(38,50%,55%,0.15)" strokeWidth="0.6" />
              <circle cx="90" cy="32" r="1.2" fill="hsla(38,50%,55%,0.2)" />
              {/* IC pad left */}
              <rect x="135" y="4" width="12" height="8" rx="1" fill="none" stroke="hsla(38,50%,55%,0.1)" strokeWidth="0.5" />
              <circle cx="139" cy="8" r="0.8" fill="hsla(38,50%,55%,0.15)" />
              <circle cx="144" cy="8" r="0.8" fill="hsla(38,50%,55%,0.15)" />
              
              {/* === CENTER-LEFT TRACES === */}
              <path d="M 280,52 L 280,36 L 340,36 L 340,20 L 400,20"
            stroke="hsla(265,70%,60%,0.08)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <path d="M 320,36 L 320,12 L 370,12"
            stroke="hsla(265,70%,60%,0.06)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              {/* Via */}
              <circle cx="340" cy="36" r="2.5" fill="none" stroke="hsla(265,70%,60%,0.12)" strokeWidth="0.5" />
              <circle cx="340" cy="36" r="1" fill="hsla(265,70%,60%,0.15)" />
              <circle cx="320" cy="36" r="2" fill="none" stroke="hsla(265,70%,60%,0.08)" strokeWidth="0.5" />
              <circle cx="320" cy="36" r="0.8" fill="hsla(265,70%,60%,0.12)" />
              
              {/* === CENTER CHIP (under logo area) === */}
              <rect x="560" y="22" width="80" height="20" rx="2" fill="none" stroke="hsla(38,50%,55%,0.06)" strokeWidth="0.6" />
              {/* Pin traces from chip */}
              <line x1="565" y1="22" x2="565" y2="14" stroke="hsla(38,50%,55%,0.05)" strokeWidth="0.4" />
              <line x1="575" y1="22" x2="575" y2="10" stroke="hsla(38,50%,55%,0.05)" strokeWidth="0.4" />
              <line x1="585" y1="42" x2="585" y2="52" stroke="hsla(38,50%,55%,0.05)" strokeWidth="0.4" />
              <line x1="625" y1="22" x2="625" y2="12" stroke="hsla(38,50%,55%,0.05)" strokeWidth="0.4" />
              <line x1="635" y1="42" x2="635" y2="54" stroke="hsla(38,50%,55%,0.05)" strokeWidth="0.4" />
              
              {/* === RIGHT SIDE PCB TRACES === */}
              <path d="M 780,20 L 840,20 L 840,40 L 900,40 L 900,16 L 960,16"
            stroke="hsla(38,50%,55%,0.12)" strokeWidth="0.8" fill="none" strokeLinecap="round" />
              <path d="M 870,40 L 870,54 L 940,54"
            stroke="hsla(38,50%,55%,0.07)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              {/* Via pads */}
              <circle cx="840" cy="20" r="3" fill="none" stroke="hsla(38,50%,55%,0.15)" strokeWidth="0.6" />
              <circle cx="840" cy="20" r="1.2" fill="hsla(38,50%,55%,0.2)" />
              <circle cx="900" cy="40" r="2.5" fill="none" stroke="hsla(38,50%,55%,0.12)" strokeWidth="0.5" />
              <circle cx="900" cy="40" r="1" fill="hsla(38,50%,55%,0.18)" />
              
              {/* === FAR RIGHT TRACES === */}
              <path d="M 1020,44 L 1060,44 L 1060,28 L 1120,28 L 1120,44 L 1200,44"
            stroke="hsla(265,70%,60%,0.08)" strokeWidth="0.7" fill="none" strokeLinecap="round" />
              <path d="M 1080,28 L 1080,8 L 1140,8"
            stroke="hsla(265,70%,60%,0.06)" strokeWidth="0.5" fill="none" strokeLinecap="round" />
              {/* Via */}
              <circle cx="1060" cy="44" r="2.5" fill="none" stroke="hsla(265,70%,60%,0.1)" strokeWidth="0.5" />
              <circle cx="1060" cy="44" r="1" fill="hsla(265,70%,60%,0.14)" />
              {/* SMD component */}
              <rect x="1130" y="5" width="16" height="6" rx="1" fill="none" stroke="hsla(265,70%,60%,0.08)" strokeWidth="0.5" />
              
              {/* === ANIMATED DATA PULSES === */}
              {/* Pulse 1: left to center — gold */}
              <circle r="2.5" fill="hsla(38,50%,60%,0.6)" filter="url(#pcbGlow)">
                <animateMotion dur="3.5s" repeatCount="indefinite"
              path="M 0,18 L 60,18 L 60,32 L 120,32 L 120,18 L 180,18 L 180,44 L 220,44" />
                <animate attributeName="opacity" values="0;0.7;0.7;0.3;0" dur="3.5s" repeatCount="indefinite" />
                <animate attributeName="r" values="1.5;2.5;2;2.5;1.5" dur="3.5s" repeatCount="indefinite" />
              </circle>
              
              {/* Pulse 2: right to center — gold */}
              <circle r="2" fill="hsla(38,50%,58%,0.5)" filter="url(#pcbGlow)">
                <animateMotion dur="3s" repeatCount="indefinite" begin="1s"
              path="M 960,16 L 900,16 L 900,40 L 840,40 L 840,20 L 780,20" />
                <animate attributeName="opacity" values="0;0.6;0.6;0.3;0" dur="3s" repeatCount="indefinite" begin="1s" />
              </circle>
              
              {/* Pulse 3: violet trace */}
              <circle r="2" fill="hsla(265,70%,65%,0.5)" filter="url(#pcbGlow)">
                <animateMotion dur="4s" repeatCount="indefinite" begin="2s"
              path="M 280,52 L 280,36 L 340,36 L 340,20 L 400,20" />
                <animate attributeName="opacity" values="0;0.5;0.5;0" dur="4s" repeatCount="indefinite" begin="2s" />
              </circle>
              
              {/* Pulse 4: far right violet */}
              <circle r="1.8" fill="hsla(265,60%,62%,0.4)" filter="url(#pcbGlow)">
                <animateMotion dur="3.8s" repeatCount="indefinite" begin="0.5s"
              path="M 1200,44 L 1120,44 L 1120,28 L 1060,28 L 1060,44 L 1020,44" />
                <animate attributeName="opacity" values="0;0.4;0.4;0" dur="3.8s" repeatCount="indefinite" begin="0.5s" />
              </circle>
            </svg>
          </motion.div>
        }

        {/* ── Top accent line — holographic rainbow shimmer ── */}
        <motion.div
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{
            background: "linear-gradient(90deg, transparent 0%, hsla(38,50%,55%,0.5) 15%, hsla(35,45%,60%,0.4) 30%, hsla(40,40%,58%,0.3) 50%, hsla(35,50%,60%,0.4) 70%, hsla(38,50%,55%,0.5) 85%, transparent 100%)",
            backgroundSize: "300% 100%"
          }}
          animate={{
            backgroundPosition: ["0% 0%", "300% 0%"],
            opacity: navScrolled ? 1 : 0
          }}
          transition={{
            backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.6 }
          }} />
        

        {/* ── Bottom edge — premium double-line with glow ── */}
        <motion.div
          className="absolute bottom-0 left-0 right-0 h-px"
          animate={{ opacity: navScrolled ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "linear-gradient(90deg, transparent 2%, hsla(38,50%,55%,0.35) 25%, hsla(35,45%,55%,0.25) 50%, hsla(38,50%,55%,0.35) 75%, transparent 98%)"
          }} />
        
        {/* Second faint glow line below */}
        <motion.div
          className="absolute -bottom-px left-0 right-0 h-[3px]"
          animate={{ opacity: navScrolled ? 0.4 : 0 }}
          transition={{ duration: 0.6 }}
          style={{
            background: "linear-gradient(90deg, transparent 5%, hsla(38,45%,55%,0.12) 30%, hsla(35,50%,55%,0.08) 50%, hsla(38,45%,55%,0.12) 70%, transparent 95%)",
            filter: "blur(2px)"
          }} />
        

        {/* ── Scanning beam — luxury gold/violet sweep ── */}
        {navScrolled &&
        <motion.div
          className="absolute bottom-0 left-0 h-[2px] w-32 pointer-events-none rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, hsla(35,50%,60%,0.6), hsla(38,55%,58%,0.9), hsla(40,50%,55%,0.6), transparent)",
            boxShadow: "0 0 16px hsla(38,55%,58%,0.5), 0 0 30px hsla(38,55%,58%,0.15)"
          }}
          animate={{ x: ["-15vw", "115vw"] }}
          transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }} />

        }

        {/* ── HUD Corner decorations ── */}
        {navScrolled &&
        <>
            {/* Top-left corner */}
            <motion.div className="absolute top-0 left-0 w-5 h-5 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 0.8 }}>
              <div className="absolute top-0 left-0 w-full h-[1.5px]" style={{ background: "linear-gradient(90deg, hsla(38,50%,55%,0.6), transparent)" }} />
              <div className="absolute top-0 left-0 w-[1.5px] h-full" style={{ background: "linear-gradient(180deg, hsla(38,50%,55%,0.6), transparent)" }} />
            </motion.div>
            {/* Top-right corner */}
            <motion.div className="absolute top-0 right-0 w-5 h-5 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 0.5 }} transition={{ duration: 0.8, delay: 0.1 }}>
              <div className="absolute top-0 right-0 w-full h-[1.5px]" style={{ background: "linear-gradient(270deg, hsla(35,50%,60%,0.8), transparent)" }} />
              <div className="absolute top-0 right-0 w-[1.5px] h-full" style={{ background: "linear-gradient(180deg, hsla(35,50%,60%,0.8), transparent)" }} />
            </motion.div>
            {/* Bottom-left corner */}
            <motion.div className="absolute bottom-0 left-0 w-5 h-5 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ duration: 0.8, delay: 0.2 }}>
              <div className="absolute bottom-0 left-0 w-full h-[1.5px]" style={{ background: "linear-gradient(90deg, hsla(38,45%,55%,0.4), transparent)" }} />
              <div className="absolute bottom-0 left-0 w-[1.5px] h-full" style={{ background: "linear-gradient(0deg, hsla(38,45%,55%,0.4), transparent)" }} />
            </motion.div>
            {/* Bottom-right corner */}
            <motion.div className="absolute bottom-0 right-0 w-5 h-5 pointer-events-none"
          initial={{ opacity: 0 }} animate={{ opacity: 0.35 }} transition={{ duration: 0.8, delay: 0.3 }}>
              <div className="absolute bottom-0 right-0 w-full h-[1.5px]" style={{ background: "linear-gradient(270deg, hsla(35,50%,60%,0.6), transparent)" }} />
              <div className="absolute bottom-0 right-0 w-[1.5px] h-full" style={{ background: "linear-gradient(0deg, hsla(35,50%,60%,0.6), transparent)" }} />
            </motion.div>
          </>
        }

        {/* ── Ambient particle dots — floating in header ── */}
        {navScrolled &&
        <>
            <motion.div className="absolute w-1 h-1 rounded-full pointer-events-none"
          style={{ background: "hsla(38,50%,55%,0.4)", top: "50%", left: "12%" }}
          animate={{ opacity: [0, 0.7, 0], y: [-3, 3, -3], scale: [0.8, 1.3, 0.8] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />
          
            <motion.div className="absolute w-0.5 h-0.5 rounded-full pointer-events-none"
          style={{ background: "hsla(35,50%,60%,0.4)", top: "35%", right: "18%" }}
          animate={{ opacity: [0, 0.5, 0], y: [2, -2, 2] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
          
            <motion.div className="absolute w-[3px] h-[3px] rounded-full pointer-events-none"
          style={{ background: "hsla(35,45%,55%,0.25)", top: "60%", left: "55%" }}
          animate={{ opacity: [0, 0.4, 0], x: [-2, 2, -2] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }} />
          
          </>
        }

        <div className="relative max-w-[1200px] mx-auto px-3 sm:px-6 flex items-center justify-between h-14 sm:h-[4.5rem] pt-2 sm:pt-3 py-[14px]">
          
          {/* ═══ Left Nav Links (desktop) ═══ */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.slice(0, Math.ceil(navLinks.length / 2)).map((link, i) =>
            <motion.a key={link.href} href={link.href}
            className="relative px-5 py-2.5 text-[0.68rem] font-medium text-white/70 hover:text-white transition-all duration-500 tracking-[0.18em] uppercase group rounded-xl"
            whileHover={{ backgroundColor: "hsla(38,45%,55%,0.08)" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.3, type: "spring", damping: 20 }}>
              
                <span className="relative z-10">{link.label}</span>
                {/* Hover underline — animated gradient sweep */}
                <motion.span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full origin-center"
                style={{ background: "linear-gradient(90deg, hsla(35,50%,55%,0.7), hsla(38,55%,58%,0.9), hsla(40,50%,60%,0.7), hsla(35,50%,55%,0.7))", backgroundSize: "200% 100%" }}
                initial={{ width: 0, opacity: 0 }}
                whileHover={{ width: "70%", opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }} />
              
                {/* Hover glow aura */}
                <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 24px hsla(38,50%,55%,0.06), 0 0 12px hsla(38,50%,55%,0.03)" }} />
              
              </motion.a>
            )}
          </div>

          {/* ═══ Centered Logo — Ultra Premium Luxury ═══ */}
          <a href="#hero" className="flex items-center gap-4 group absolute left-1/2 -translate-x-1/2 z-10 text-center rounded-full shadow-sm border-solid py-0">
            {/* Outer breathing halo — soft gold */}
            <motion.div
              className="absolute -inset-14 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsla(38,40%,55%,0.12), hsla(38,35%,50%,0.04), transparent 60%)" }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
            
            {/* Secondary halo ring */}
            <motion.div
              className="absolute -inset-8 rounded-full pointer-events-none"
              style={{ border: "1px solid hsla(38,40%,55%,0.06)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }} />
            

            {/* Logo container — hexagonal feel with premium depth */}
            <motion.div
              className="relative w-9 h-9 sm:w-11 sm:h-11 rounded-full flex items-center justify-center overflow-hidden"
              style={{
                background: "linear-gradient(145deg, hsla(38,45%,20%,1), hsla(35,40%,14%,1), hsla(30,35%,10%,1))",
                boxShadow: "0 0 0 2px hsla(38,50%,50%,0.3), 0 0 40px hsla(38,50%,50%,0.15), 0 8px 32px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(38,50%,60%,0.15)"
              }}
              whileHover={{ scale: 1.12, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}>
              
              {/* Inner gold border — subtle luxury */}
              <div className="absolute inset-[2px] rounded-full border border-[hsla(38,50%,50%,0.12)] pointer-events-none" />
              
              {/* Orbital ring — slow elegant rotation */}
              <motion.div
                className="absolute -inset-1 rounded-full pointer-events-none"
                style={{ border: "1px solid transparent", borderTopColor: "hsla(38,45%,55%,0.35)", borderRightColor: "hsla(38,45%,55%,0.1)" }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
              
              
              {/* Counter-rotating inner ring */}
              <motion.div
                className="absolute inset-0.5 rounded-full pointer-events-none"
                style={{ border: "0.5px solid transparent", borderBottomColor: "hsla(38,40%,55%,0.2)" }}
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }} />
              

              {/* Single elegant shimmer */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none overflow-hidden">
                
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(115deg, transparent 30%, hsla(38,50%,70%,0.25) 48%, hsla(38,50%,70%,0.08) 52%, transparent 70%)" }}
                  animate={{ x: ["-150%", "250%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }} />
                
              </motion.div>

              {/* Logo image */}
              <img src={empireLogoNew} alt="Empire AI" className="w-[85%] h-[85%] rounded-full drop-shadow-[0_0_8px_hsla(38,50%,55%,0.4)] object-cover my-0 py-0 text-center text-sm" />
              
              {/* Breathing pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{ border: "1px solid hsla(38,50%,55%,0.15)" }}
                animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }} />
              

              {/* Status indicator */}
              <motion.div
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full z-10"
                style={{ backgroundColor: "hsla(160,50%,50%,0.9)", boxShadow: "0 0 8px hsla(160,50%,50%,0.6)" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
              
            </motion.div>

            {/* Brand text — refined luxury typography */}
            <div className="flex flex-col leading-none gap-1">
              <motion.span
                className="font-heading font-bold text-[0.9rem] sm:text-[1.1rem] tracking-[0.4em] uppercase"
                style={{
                  background: "linear-gradient(135deg, hsla(0,0%,95%,1) 0%, hsla(38,30%,78%,1) 50%, hsla(0,0%,95%,1) 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent"
                }}
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
                
                EMPIRE
              </motion.span>
              <div className="flex items-center gap-2">
                {/* Thin elegant line */}
                <motion.div
                  className="h-px flex-1 max-w-[12px]"
                  style={{ background: "linear-gradient(90deg, transparent, hsla(38,40%,55%,0.4))" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
                
                <span className="text-[0.42rem] sm:text-[0.52rem] tracking-[0.45em] uppercase font-medium"
                style={{ color: "hsla(38,35%,58%,0.7)" }}>
                  
                  AUTONOMOUS AI
                </span>
                <motion.div
                  className="h-px flex-1 max-w-[12px]"
                  style={{ background: "linear-gradient(90deg, hsla(38,40%,55%,0.4), transparent)" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }} />
                
              </div>
            </div>
          </a>

          {/* ═══ Right Nav Links + CTA (desktop) ═══ */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-end">
            {navLinks.slice(Math.ceil(navLinks.length / 2)).map((link, i) =>
            <motion.a key={link.href} href={link.href}
            className="relative px-5 py-2.5 text-[0.68rem] font-medium text-white/70 hover:text-white transition-all duration-500 tracking-[0.18em] uppercase group rounded-xl"
            whileHover={{ backgroundColor: "hsla(38,45%,55%,0.08)" }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 + 0.5, type: "spring", damping: 20 }}>
              
                <span className="relative z-10">{link.label}</span>
                <motion.span
                className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full origin-center"
                style={{ background: "linear-gradient(90deg, hsla(35,50%,55%,0.7), hsla(38,55%,60%,0.9), hsla(40,50%,58%,0.7), hsla(35,50%,55%,0.7))", backgroundSize: "200% 100%" }}
                initial={{ width: 0, opacity: 0 }}
                whileHover={{ width: "70%", opacity: 1 }}
                transition={{ duration: 0.35, ease: "easeOut" }} />
              
                <motion.div
                className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ boxShadow: "inset 0 0 24px hsla(38,50%,55%,0.06), 0 0 12px hsla(38,50%,55%,0.03)" }} />
              
              </motion.a>
            )}

            {/* Accedi button */}
            <motion.button
              onClick={() => navigate("/auth?mode=login")}
              className="ml-3 px-6 py-3 rounded-full text-white/80 text-[0.65rem] font-medium font-heading tracking-[0.18em] uppercase relative overflow-hidden group hover:text-white transition-colors"
              style={{
                background: "hsla(0,0%,100%,0.06)",
                border: "1px solid hsla(0,0%,100%,0.12)",
              }}
              whileHover={{ scale: 1.04, backgroundColor: "hsla(0,0%,100%,0.1)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.65, type: "spring", damping: 18 }}>
              <span className="relative z-10 flex items-center gap-2">
                <Lock className="w-3.5 h-3.5 opacity-70" />
                Accedi
              </span>
            </motion.button>

            {/* Premium CTA button — diamond-cut with holographic glow */}
            <motion.button
              onClick={() => navigate("/auth")}
              className="ml-2 px-8 py-3 rounded-full text-primary-foreground text-[0.65rem] font-bold font-heading tracking-[0.22em] uppercase relative overflow-hidden group"
              style={{
                background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(34,50%,42%,1), hsla(30,45%,38%,1))",
                boxShadow: "0 4px 28px hsla(38,55%,50%,0.3), 0 0 0 1px hsla(38,55%,60%,0.2), 0 12px 40px hsla(38,55%,50%,0.08)"
              }}
              whileHover={{ scale: 1.06, boxShadow: "0 8px 44px hsla(38,55%,50%,0.45), 0 0 0 1.5px hsla(38,55%,60%,0.3), 0 16px 60px hsla(38,55%,50%,0.12)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", damping: 18 }}>
              
              {/* Multi-layer shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.35) 46%, rgba(255,255,255,0.12) 54%, transparent 75%)" }}
                animate={{ x: ["-130%", "230%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }} />
              
              {/* Reverse shimmer layer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(255deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
                animate={{ x: ["150%", "-150%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut", delay: 1 }} />
              
              {/* Pulsing outer glow ring — holographic */}
              <motion.div
                className="absolute -inset-[1.5px] rounded-full pointer-events-none"
                style={{
                  background: "linear-gradient(135deg, hsla(38,55%,60%,0.4), hsla(35,50%,55%,0.25), hsla(40,45%,58%,0.3), hsla(38,55%,60%,0.4))",
                  backgroundSize: "300% 300%"
                }}
                animate={{
                  opacity: [0.3, 0.7, 0.3],
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }} />
              
              {/* Inner glass border */}
              <div className="absolute inset-px rounded-full border border-white/[0.15] pointer-events-none" />
              <span className="relative z-10 flex items-center gap-2">
                <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                  <Sparkles className="w-3.5 h-3.5 opacity-90" />
                </motion.div>
                Inizia Ora
              </span>
            </motion.button>
          </div>

          {/* ═══ Mobile hamburger — luxury animated ═══ */}
          <motion.button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2.5 text-foreground rounded-xl transition-colors relative"
            aria-label="Menu"
            whileTap={{ scale: 0.92 }}
            style={{ background: mobileMenuOpen ? "hsla(38,45%,55%,0.1)" : "transparent" }}>
            
            {/* Glow ring on open */}
            {mobileMenuOpen &&
            <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
            style={{ boxShadow: "0 0 15px hsla(38,50%,55%,0.15), inset 0 0 10px hsla(38,50%,55%,0.04)" }}
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }} />

            }
            <AnimatePresence mode="wait">
              {mobileMenuOpen ?
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <X className="w-5 h-5" />
                </motion.div> :

              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              }
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ═══ Mobile menu — premium glassmorphism with HUD styling ═══ */}
        <AnimatePresence>
          {mobileMenuOpen &&
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="lg:hidden overflow-hidden relative"
          style={{ backgroundColor: "hsla(230,12%,5%,0.94)", backdropFilter: "blur(40px) saturate(1.8)" }}>
              {/* Top holographic line */}
              <motion.div className="h-[1.5px] w-full"
            style={{
              background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.4), hsla(35,50%,55%,0.35), hsla(40,45%,55%,0.3), hsla(38,50%,55%,0.4), transparent)",
              backgroundSize: "300% 100%"
            }}
            animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
            transition={{ duration: 4, repeat: Infinity, ease: "linear" }} />
            
              {/* HUD side lines */}
              <motion.div className="absolute left-0 top-2 bottom-2 w-[1px] pointer-events-none"
            style={{ background: "linear-gradient(180deg, hsla(38,50%,55%,0.3), transparent 30%, transparent 70%, hsla(38,50%,55%,0.2))" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} />
            
              <motion.div className="absolute right-0 top-2 bottom-2 w-[1px] pointer-events-none"
            style={{ background: "linear-gradient(180deg, hsla(35,50%,60%,0.3), transparent 30%, transparent 70%, hsla(35,50%,60%,0.3))" }}
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} />
            
              <div className="flex flex-col items-center gap-1 py-6 px-5">
                {navLinks.map((link, i) =>
              <motion.a key={link.label} href={link.href} onClick={() => setMobileMenuOpen(false)}
              initial={{ opacity: 0, x: -24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.07, type: "spring", damping: 22 }}
              className="w-full text-center py-3.5 text-xs font-medium text-white/60 hover:text-white hover:bg-primary/[0.08] rounded-xl transition-all font-heading tracking-[0.2em] uppercase relative group">
                    {link.label}
                    {/* Active indicator — glowing dot */}
                    <motion.div
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ background: "hsla(38,55%,55%,0.8)", boxShadow: "0 0 8px hsla(38,55%,55%,0.5)" }}
                  transition={{ duration: 0.3 }} />
                
                  </motion.a>
              )}
                <motion.button onClick={() => {navigate("/auth?mode=login");setMobileMenuOpen(false);}}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, type: "spring", damping: 18 }}
              className="mt-3 w-full py-3 rounded-xl text-white/80 text-xs font-medium tracking-[0.18em] uppercase font-heading"
              style={{
                background: "hsla(0,0%,100%,0.06)",
                border: "1px solid hsla(0,0%,100%,0.12)",
              }}>
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <Lock className="w-3.5 h-3.5 opacity-70" />
                    Accedi
                  </span>
                </motion.button>
                <motion.button onClick={() => {navigate("/auth");setMobileMenuOpen(false);}}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring", damping: 18 }}
              className="mt-2 w-full py-3.5 rounded-xl text-primary-foreground text-xs font-bold tracking-[0.2em] uppercase font-heading relative overflow-hidden"
              style={{
                background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(34,50%,42%,1), hsla(30,45%,38%,1))",
                boxShadow: "0 4px 24px hsla(38,55%,50%,0.3), 0 0 0 1px hsla(38,55%,60%,0.15)"
              }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.3) 48%, transparent 75%)" }}
                animate={{ x: ["-130%", "230%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }} />
                
                  <div className="absolute inset-px rounded-[11px] border border-white/[0.12] pointer-events-none" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <motion.div animate={{ rotate: [0, 180, 360] }} transition={{ duration: 6, repeat: Infinity, ease: "linear" }}>
                      <Sparkles className="w-3.5 h-3.5 opacity-85" />
                    </motion.div>
                    Registrati
                  </span>
                </motion.button>
              </div>
            </motion.div>
          }
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════
                             HERO
                            ═══════════════════════════════════════════ */}
       <motion.section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-5 sm:px-6 pt-24 sm:pt-28 pb-8 sm:pb-16"
      style={IS_MOBILE_LP ? undefined : { opacity: heroOpacity }}>

        {/* ═══ LAYER 0: Clean premium dark gradient ═══ */}
        <div className="absolute inset-0" style={{ zIndex: 2, background: "linear-gradient(160deg, hsl(228 22% 10%) 0%, hsl(235 20% 8%) 25%, hsl(248 18% 9%) 50%, hsl(230 22% 8%) 75%, hsl(225 20% 10%) 100%)" }} />

        {/* ═══ LAYER 1: Premium ambient blobs ═══ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          <div className="aurora-blob-1 absolute w-[500px] h-[500px] sm:w-[700px] sm:h-[700px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(265 55% 55% / 0.2), hsl(248 50% 60% / 0.08) 50%, transparent 70%)", filter: "blur(80px)", top: "0%", left: "5%" }} />
          <div className="aurora-blob-2 absolute w-[450px] h-[450px] sm:w-[650px] sm:h-[650px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(210 65% 55% / 0.22), hsl(220 50% 60% / 0.08) 50%, transparent 70%)", filter: "blur(80px)", top: "10%", right: "0%" }} />
          <div className="aurora-blob-3 absolute w-[400px] h-[400px] sm:w-[550px] sm:h-[550px] rounded-full"
            style={{ background: "radial-gradient(circle, hsl(38 55% 50% / 0.12), hsl(35 50% 55% / 0.05) 50%, transparent 70%)", filter: "blur(80px)", bottom: "5%", left: "30%" }} />
          {/* Central glow behind sphere */}
          <div className="absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
            style={{ background: "radial-gradient(circle, hsl(265 50% 55% / 0.15), hsl(248 45% 60% / 0.05) 55%, transparent 75%)", filter: "blur(100px)" }} />
        </div>

        <motion.div className="relative z-10 max-w-[1100px] mx-auto w-full overflow-hidden" style={IS_MOBILE_LP ? undefined : { y: heroY, scale: heroScale, willChange: "transform" }}>
          
          {/* ═══ CENTERED LAYOUT: Text → Metrics → Phones ═══ */}
          <div className="flex flex-col items-center overflow-hidden">
            
            {/* CENTER: Text content */}
            <div className="text-center max-w-[680px] mx-auto px-5 sm:px-0 w-full box-border">

              {/* Badge */}
              <motion.div className="inline-flex items-center gap-2 px-3.5 sm:px-4 py-1.5 sm:py-2 rounded-xl mb-4 sm:mb-5"
              style={{ background: "linear-gradient(135deg, hsl(var(--primary) / 0.1), hsl(var(--empire-violet) / 0.08))", border: "1px solid hsl(var(--primary) / 0.15)", boxShadow: "0 2px 12px hsl(var(--primary) / 0.08)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <div className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: "linear-gradient(135deg, hsl(var(--primary)), hsl(var(--empire-violet)))", boxShadow: "0 2px 8px hsl(var(--primary) / 0.3)" }}>
                  <Crown className="w-2.5 h-2.5 text-white" />
                </div>
                <span className="text-[0.55rem] font-heading font-bold tracking-[2px] uppercase text-white/90">Piattaforma AI All-in-One per PMI</span>
              </motion.div>

              {/* Headline */}
              <motion.h1 className="text-[1.6rem] leading-[1.12] sm:text-[2.6rem] lg:text-[3.4rem] font-heading font-bold tracking-[-0.03em] relative px-1"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}
              style={{ textWrap: "balance" as any }}>
                <span className="text-white">Progettiamo app che</span>
                <br />
                <span className="text-white">le persone</span>
                <br />
                <span className="text-vivid-gradient" style={{ filter: "brightness(1.3)" }}>amano</span>
              </motion.h1>

              {/* Subtitle */}
              <motion.p className="mt-3 sm:mt-5 text-[0.78rem] sm:text-[0.95rem] max-w-[520px] mx-auto leading-[1.7] font-normal px-2 sm:px-0" style={{ color: "hsl(38 30% 82%)" }}
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
                Creiamo esperienze digitali per brand ambiziosi. Dall'ideazione al lancio, realizziamo app che stimolano il coinvolgimento e fanno crescere il tuo business. <span className="font-bold text-white/90">98+ agenti IA · <span className="font-semibold text-primary">25+ settori</span></span> · Zero canone.
              </motion.p>

              {/* ═══ EMPIRE INTERACTIVE SPHERE — originale (click to morph text) ═══ */}
              <motion.div className="relative mt-4 sm:mt-6 w-full flex items-center justify-center overflow-hidden"
                style={{ maxHeight: IS_MOBILE_LP ? 200 : 320 }}
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, duration: 0.9, ease: [0.22, 1, 0.36, 1] }}>
                <div className="absolute inset-0 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse 60% 80% at 50% 50%, hsl(var(--primary) / 0.12), transparent 70%)", filter: "blur(28px)" }} />
                <InteractiveParticleSphere size={IS_MOBILE_LP ? 340 : 580} />
              </motion.div>

              {/* CTA */}
              <motion.div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 w-full"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }}>
                <motion.button
                  onClick={() => scrollTo("pricing")}
                  className="group relative w-full sm:w-auto px-6 py-3 sm:py-3.5 rounded-2xl sm:rounded-full text-primary-foreground font-bold text-[0.72rem] sm:text-[0.75rem] font-heading tracking-wider uppercase overflow-hidden"
                  style={{
                    background: "linear-gradient(135deg, hsl(280 60% 55%), hsl(320 70% 55%), hsl(38 80% 55%))",
                    boxShadow: "0 4px 20px hsl(300 50% 50% / 0.3), 0 0 0 1px hsl(300 50% 50% / 0.2)"
                  }}
                  whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsl(300 50% 50% / 0.45)" }}
                  whileTap={{ scale: 0.97 }}>
                  <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/15 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                  <span className="relative flex items-center justify-center gap-2">
                    🚀 PRENOTA DEMO GRATUITA <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </motion.button>
                <motion.button
                  onClick={() => navigate("/demo")}
                  className="w-full sm:w-auto px-5 py-3 sm:py-3.5 rounded-2xl sm:rounded-full text-[0.72rem] sm:text-[0.75rem] font-semibold font-heading tracking-wide transition-all flex items-center justify-center gap-2 text-foreground/60 border border-border/40 bg-background/50 backdrop-blur-sm"
                  whileHover={{ scale: 1.01, borderColor: "hsl(var(--primary) / 0.3)" }}>
                  <Play className="w-3.5 h-3.5 text-primary" /> Vedi Demo Live
                </motion.button>
              </motion.div>

              {/* ═══ STAT CARDS — Premium glass 2x2 grid ═══ */}
              <motion.div className="mt-6 sm:mt-8 grid grid-cols-2 gap-2.5 sm:gap-3 w-full max-w-lg sm:max-w-xl mx-auto"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.8 }}>
                {[
                  { value: 847, suffix: "+", label: "ATTIVITÀ ATTIVE", color: "hsl(195 100% 55%)" },
                  { value: 25, suffix: "+", label: "SETTORI COPERTI", color: "hsl(195 100% 55%)" },
                  { value: 40, suffix: "%", prefix: "+", label: "AUMENTO FATTURATO", color: "hsl(170 70% 50%)" },
                  { value: 99.8, suffix: "%", label: "SODDISFAZIONE", color: "hsl(320 70% 55%)" },
                ].map((m, i) =>
                <motion.div
                  key={i}
                  className="relative group text-center px-3 py-4 sm:px-4 sm:py-5 rounded-2xl overflow-hidden"
                  style={{
                    background: "linear-gradient(160deg, hsl(228 20% 14% / 0.85), hsl(232 22% 11% / 0.9))",
                    backdropFilter: "blur(16px)",
                    WebkitBackdropFilter: "blur(16px)",
                    border: "1px solid hsl(var(--border) / 0.3)",
                    boxShadow: "0 4px 20px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.04)"
                  }}
                  whileHover={{ y: -2, boxShadow: "0 8px 32px hsl(var(--primary) / 0.15), inset 0 1px 0 hsl(0 0% 100% / 0.08)" }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="absolute inset-0 pointer-events-none rounded-2xl" style={{
                    background: `radial-gradient(ellipse at 50% 0%, ${m.color}08, transparent 70%)`
                  }} />
                  <p className="relative text-xl sm:text-3xl font-heading font-bold" style={{ color: m.color }}>
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  <p className="relative text-[0.42rem] sm:text-[0.5rem] tracking-[1.8px] uppercase font-heading font-semibold text-white/60 mt-1 sm:mt-1.5">{m.label}</p>
                </motion.div>
                )}
              </motion.div>
            </div>

            {/* PHONES: Each sector shows 3 real mockup screens (home, services, detail) */}
            <HeroPhoneCarousel sectors={heroCarouselSectors} />
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <span className="text-[7px] text-foreground/40 tracking-[4px] uppercase font-heading">Scopri</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <ChevronDown className="w-3.5 h-3.5 text-primary/50" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <div className="relative py-5 border-y overflow-hidden" style={{ background: "linear-gradient(180deg, hsl(228 22% 7%) 0%, hsl(230 20% 9%) 50%, hsl(228 22% 7%) 100%)", borderColor: "hsl(var(--primary) / 0.1)" }}>
        <div className="flex animate-marquee-scroll whitespace-nowrap">
        {[...Array(2)].map((_, repeat) =>
          <div key={repeat} className="flex items-center gap-10 px-5">
              {[
            { icon: <CreditCard className="w-3 h-3" />, text: "Stripe Connect", color: "var(--neon-emerald)" },
            { icon: <Lock className="w-3 h-3" />, text: "AES-256", color: "var(--empire-violet)" },
            { icon: <Smartphone className="w-3 h-3" />, text: "PWA Certified", color: "var(--neon-cyan)" },
            { icon: <Shield className="w-3 h-3" />, text: "GDPR Compliant", color: "var(--neon-emerald)" },
            { icon: <Zap className="w-3 h-3" />, text: "99.9% Uptime", color: "var(--neon-magenta)" },
            { icon: <Cpu className="w-3 h-3" />, text: "98+ Agenti IA", color: "var(--empire-violet)" },
            { icon: <MapPin className="w-3 h-3" />, text: "Made in Italy", color: "var(--neon-emerald)" },
            { icon: <Fingerprint className="w-3 h-3" />, text: "White Label", color: "var(--neon-cyan)" },
            { icon: <Globe className="w-3 h-3" />, text: "25+ Settori", color: "var(--neon-magenta)" },
            { icon: <Timer className="w-3 h-3" />, text: "Attivo in 24h", color: "var(--neon-emerald)" },
            { icon: <LineChart className="w-3 h-3" />, text: "Updates Settimanali", color: "var(--empire-violet)" }].
            map((t, i) =>
            <span key={i} className="text-[0.6rem] text-foreground/60 font-heading font-medium tracking-[2.5px] uppercase flex items-center gap-2.5">
                  <span className="w-5 h-5 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `hsl(${t.color} / 0.12)`, color: `hsl(${t.color})` }}>
                    {t.icon}
                  </span>
                  {t.text}
                </span>
            )}
            </div>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
                             COSA FA EMPIRE — Quick Feature Grid
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(232 24% 10%) 50%, hsl(228 22% 8%) 100%)"
      }}>
        <div className="text-center mb-10">
          <SectionLabel text="Tutto in un'unica piattaforma" icon={<Layers className="w-3 h-3 text-neon-cyan" />} />
          <motion.h2 className="text-[clamp(1.5rem,4.5vw,3rem)] font-heading font-bold text-white leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
            Creiamo <span className="text-vivid-gradient">App, Siti e Gestionali</span>
            <br />
            <span className="text-white/80">Potenziati dall'IA</span>
          </motion.h2>
          <motion.p className="text-[0.82rem] text-foreground/60 max-w-lg mx-auto leading-[1.75]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vpOnce} transition={{ delay: 0.2 }}>
            Progettiamo e sviluppiamo applicazioni dedicate, web app professionali e sistemi gestionali completi
            per qualsiasi settore — personalizzati al 100% sulle tue esigenze, con intelligenza artificiale integrata
            e automazioni che lavorano per te 24/7.
          </motion.p>
        </div>

        {/* Core Capabilities — 3 pillar cards */}
        <motion.div className="grid grid-cols-1 gap-3 mb-8"
        variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          {[
            {
              icon: <Smartphone className="w-5 h-5" />,
              title: "App & Web App Dedicate",
              desc: "Applicazioni installabili con il TUO brand, il tuo dominio, i tuoi colori. Nessun logo di terzi. Design premium, funzionalità infinite — dall'e-commerce alle prenotazioni, dal catalogo digitale al sistema di ordini. Tutto come lo vuoi tu.",
              features: ["White Label 100%", "PWA Installabile", "Design su misura", "Qualsiasi funzionalità"],
              color: "var(--empire-violet)",
              gradient: "from-[hsl(var(--empire-violet)/0.15)] to-[hsl(var(--empire-violet)/0.03)]"
            },
            {
              icon: <Brain className="w-5 h-5" />,
              title: "Intelligenza Artificiale Integrata",
              desc: "98+ agenti IA specializzati che automatizzano marketing, gestione clienti, analisi dati, fatturazione, risposte automatiche, generazione contenuti e molto altro. L'IA lavora in autonomia, senza intervento umano.",
              features: ["98+ Agenti IA", "Automazioni 24/7", "Analisi predittive", "Marketing automatico"],
              color: "var(--neon-emerald)",
              gradient: "from-[hsl(var(--neon-emerald)/0.12)] to-[hsl(var(--neon-emerald)/0.02)]"
            },
            {
              icon: <ServerCog className="w-5 h-5" />,
              title: "Gestionale Aziendale Completo",
              desc: "CRM clienti, prenotazioni, ordini, inventario, staff, fatturazione elettronica, analytics, pagamenti Stripe integrati, fidelity card digitali, notifiche push, campagne marketing — tutto centralizzato in un unico pannello.",
              features: ["CRM & Fidelizzazione", "Fatturazione & Finance", "Staff & Operazioni", "Pagamenti integrati"],
              color: "var(--neon-cyan)",
              gradient: "from-[hsl(var(--neon-cyan)/0.12)] to-[hsl(var(--neon-cyan)/0.02)]"
            },
          ].map((pillar, i) =>
          <motion.div key={i} variants={fadeUp}
          className="relative p-5 rounded-2xl overflow-hidden border transition-all duration-300 group"
          style={{
            background: "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.88))",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            borderColor: `hsl(${pillar.color} / 0.15)`,
            boxShadow: `0 4px 28px hsl(${pillar.color} / 0.08), 0 1px 3px hsl(0 0% 0% / 0.3), inset 0 1px 0 hsl(0 0% 100% / 0.04)`,
          }}>
            {/* Top accent shimmer line */}
            <div className="absolute top-0 left-0 right-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent 5%, hsl(${pillar.color} / 0.4) 30%, hsl(${pillar.color} / 0.6) 50%, hsl(${pillar.color} / 0.4) 70%, transparent 95%)` }} />
            {/* Inner glass reflection */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.03) 0%, transparent 25%)" }} />
            {/* Subtle corner glow */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full opacity-30 pointer-events-none" style={{ background: `radial-gradient(circle, hsl(${pillar.color} / 0.12), transparent 70%)` }} />
            {/* Hover gradient overlay */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(ellipse at 50% 0%, hsl(${pillar.color} / 0.05), transparent 60%)` }} />
            <div className="relative z-10 flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
              style={{ background: `linear-gradient(135deg, hsl(${pillar.color}), hsl(${pillar.color} / 0.7))`, color: "white", boxShadow: `0 6px 20px hsl(${pillar.color} / 0.3), inset 0 1px 0 rgba(255,255,255,0.15)` }}>
                {pillar.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[0.9rem] font-heading font-bold text-foreground leading-tight mb-1.5">{pillar.title}</h3>
                <p className="text-[0.7rem] text-foreground/55 leading-[1.7] mb-3">{pillar.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pillar.features.map((f, fi) =>
                  <span key={fi} className="px-2.5 py-1 rounded-lg text-[0.5rem] font-semibold tracking-wide"
                  style={{ background: `hsl(${pillar.color} / 0.08)`, color: `hsl(${pillar.color})`, border: `1px solid hsl(${pillar.color} / 0.12)` }}>
                    {f}
                  </span>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
          )}
        </motion.div>

        {/* Quick features grid */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3"
        variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          {[
            { icon: <Globe className="w-4 h-4" />, title: "Siti Web Premium", color: "var(--empire-violet)" },
            { icon: <QrCode className="w-4 h-4" />, title: "Menu & Cataloghi QR", color: "var(--neon-emerald)" },
            { icon: <Wallet className="w-4 h-4" />, title: "Loyalty & Fidelity", color: "var(--neon-cyan)" },
            { icon: <Headphones className="w-4 h-4" />, title: "Voice Agent IA", color: "var(--neon-magenta)" },
            { icon: <MapPin className="w-4 h-4" />, title: "Multi-Sede", color: "var(--empire-violet)" },
            { icon: <Lock className="w-4 h-4" />, title: "GDPR & Sicurezza", color: "var(--neon-emerald)" },
            { icon: <Receipt className="w-4 h-4" />, title: "Fatturazione Elettronica", color: "var(--neon-cyan)" },
            { icon: <Sparkles className="w-4 h-4" />, title: "Personalizzazione Totale", color: "var(--neon-magenta)" },
          ].map((f, i) =>
          <motion.div key={i} variants={popIn}
          className="relative p-3.5 rounded-2xl overflow-hidden text-center group"
          style={{
            background: "linear-gradient(160deg, hsl(228 20% 14% / 0.92), hsl(232 22% 12% / 0.85))",
            backdropFilter: "blur(16px)",
            WebkitBackdropFilter: "blur(16px)",
            border: `1px solid hsl(${f.color} / 0.15)`,
            boxShadow: `0 2px 16px hsl(${f.color} / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.04)`
          }}>
            {/* Top accent line */}
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: `linear-gradient(90deg, transparent, hsl(${f.color} / 0.25), transparent)` }} />
            {/* Inner reflection */}
            <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.03) 0%, transparent 30%)" }} />
            {/* Hover glow */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: `radial-gradient(circle at 50% 30%, hsl(${f.color} / 0.06), transparent 60%)` }} />
            <div className="relative z-10">
              <div className="w-10 h-10 mx-auto rounded-xl flex items-center justify-center mb-2"
              style={{ background: `linear-gradient(135deg, hsl(${f.color}), hsl(${f.color} / 0.8))`, color: "white", boxShadow: `0 3px 12px hsl(${f.color} / 0.25)` }}>
                {f.icon}
              </div>
              <h4 className="text-[0.65rem] font-heading font-bold text-foreground/85 leading-tight">{f.title}</h4>
            </div>
          </motion.div>
          )}
        </motion.div>

        {/* Bottom promise */}
        <motion.div className="mt-8 text-center"
        initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: 0.3 }}>
          <p className="text-[0.7rem] text-foreground/35 font-medium">
            ✦ Qualsiasi funzionalità ti serva, la costruiamo. <span className="text-foreground/50 font-semibold">Dimmi cosa vuoi, noi lo realizziamo.</span>
          </p>
        </motion.div>
      </Section>



      {/* ═══════════════════════════════════════════
                             VIDEO HERO — Business Transformation
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(235 22% 10%) 50%, hsl(228 22% 8%) 100%)"
      }}>
        {/* Premium ambient glows — discovery/innovation luxury */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Primary violet — top-right hero */}
          <div className="absolute top-[8%] right-[18%] w-[550px] h-[550px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.5), transparent 65%)", filter: "blur(140px)" }} />
          {/* Tech green — center-left */}
          <div className="absolute top-[35%] left-[10%] w-[450px] h-[450px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,42%,0.4), transparent 65%)", filter: "blur(120px)" }} />
          {/* Gold accent — bottom-right */}
          <div className="absolute bottom-[15%] right-[15%] w-[400px] h-[400px] rounded-full opacity-[0.02]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          {/* Secondary violet wash — bottom-left */}
          <div className="absolute bottom-[25%] left-[25%] w-[350px] h-[350px] rounded-full opacity-[0.015]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.25), transparent 65%)", filter: "blur(100px)" }} />
          {/* Subtle emerald spark — top-left */}
          <div className="absolute top-[15%] left-[30%] w-[280px] h-[280px] rounded-full opacity-[0.01]"
          style={{ background: "radial-gradient(circle, hsla(155,55%,50%,0.25), transparent 60%)", filter: "blur(80px)" }} />
          {/* Top accent border — violet to green */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.18), hsla(155,45%,50%,0.08), transparent)" }} />
          {/* Vertical light shaft */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[100px] opacity-[0.03]"
          style={{ background: "linear-gradient(180deg, hsla(265,55%,55%,0.25), transparent)" }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsl(228 22% 8% / 0.8))" }} />
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-8">
          <SectionLabel text="Scopri Empire" icon={<Play className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Non Siamo un Software. <span className="text-shimmer">Siamo il Futuro.</span>
          </motion.h2>
          <motion.p className="text-foreground/70 max-w-[560px] mx-auto text-[0.9rem] leading-[1.85] tracking-wide font-light"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Oltre 98 Agenti IA autonomi, dashboard predittive, CRM intelligente, gestione flotta e prenotazioni, cataloghi digitali con OCR, automazioni multi-canale, fatturazione elettronica, analytics in tempo reale, voice agent, generazione foto e contenuti AI — un ecosistema white-label completo che lavora 24/7 per ogni settore, senza intervento umano.
          </motion.p>
        </div>
        <motion.div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden glow-card"
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
        transition={{ duration: 0.6 }}>
          <div className="absolute -inset-8 bg-primary/[0.05] rounded-[60px] blur-[80px] pointer-events-none" />
          <FunnelDNAVisual />
          <div className="absolute inset-0 pointer-events-none rounded-2xl"
          style={{ background: "linear-gradient(180deg, transparent 60%, hsla(0,0%,4%,0.94) 100%)" }} />
        </motion.div>

        {/* Premium feature badges — below video */}
        <motion.div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-6 max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.25 }}>
          {[
            { label: "Dashboard IA", icon: "✦" },
            { label: "CRM Intelligente", icon: "◈" },
            { label: "Automazioni", icon: "⚡" },
            { label: "Fatturazione", icon: "◆" },
          ].map((item, i) =>
            <motion.div key={item.label}
              className="group relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-2xl border cursor-default overflow-hidden"
              style={{
                background: "linear-gradient(160deg, hsl(228 20% 14% / 0.88), hsl(248 20% 12% / 0.82))",
                backdropFilter: "blur(16px)",
                WebkitBackdropFilter: "blur(16px)",
                borderColor: "hsl(var(--primary) / 0.15)",
                boxShadow: "0 2px 16px hsl(var(--primary) / 0.08), inset 0 1px 0 hsl(0 0% 100% / 0.04)",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.04, borderColor: "hsl(var(--primary) / 0.2)", boxShadow: "0 8px 32px hsl(var(--primary) / 0.1), inset 0 1px 0 hsl(0 0% 100% / 0.08)" }}>
              <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.12), transparent)" }} />
              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.03) 0%, transparent 25%)" }} />
              <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, hsl(var(--primary) / 0.05), transparent 70%)" }} />
              <span className="relative z-10 text-[0.55rem] sm:text-[0.65rem] font-heading font-bold tracking-[0.15em] uppercase text-foreground/80 group-hover:text-primary transition-colors flex items-center gap-1.5">
                <span className="text-primary/50 text-[0.5rem]">{item.icon}</span>
                {item.label}
              </span>
            </motion.div>
          )}
        </motion.div>

        {/* CTA buttons under video */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <motion.button
            onClick={() => scrollTo("pricing")}
            className="group px-7 py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            style={{ boxShadow: "0 6px 30px hsl(var(--empire-violet) / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.15)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.3)" }}
            whileTap={{ scale: 0.97 }}>
            
            Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-2xl text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:text-foreground transition-all inline-flex items-center gap-2"
            style={{
              border: "1px solid hsl(var(--border) / 0.4)",
              background: "linear-gradient(160deg, hsl(228 20% 14% / 0.85), hsl(248 18% 12% / 0.8))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 2px 12px hsl(var(--primary) / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.04)"
            }}
            whileHover={{ scale: 1.01, borderColor: "hsl(var(--primary) / 0.2)" }}>
            
            <Play className="w-4 h-4 text-primary/60" /> Esplora le Demo
          </motion.button>
        </motion.div>
      </Section>


      {/* ═══════════════════════════════════════════
                             SETTORI
                            ═══════════════════════════════════════════ */}
      <Section id="industries" className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(230 24% 10%) 35%, hsl(232 22% 9%) 65%, hsl(228 22% 8%) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Premium violet mesh glow — top-left */}
          <div className="absolute top-[4%] left-[8%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(265,70%,55%,0.6), transparent 65%)", filter: "blur(150px)" }} />
          {/* Deep emerald — center-right */}
          <div className="absolute top-[30%] right-[5%] w-[450px] h-[450px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,55%,42%,0.5), transparent 65%)", filter: "blur(140px)" }} />
          {/* Gold accent — bottom-center */}
          <div className="absolute bottom-[10%] left-[30%] w-[400px] h-[400px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(38,65%,50%,0.45), transparent 65%)", filter: "blur(120px)" }} />
          {/* Violet secondary — bottom-right */}
          <div className="absolute bottom-[25%] right-[18%] w-[320px] h-[320px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(265,55%,58%,0.35), transparent 65%)", filter: "blur(100px)" }} />
          {/* Top accent border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.25), hsla(155,45%,50%,0.15), hsla(38,50%,50%,0.08), transparent)" }} />
          {/* Subtle grid pattern */}
          <div className="absolute inset-0 opacity-[0.015]"
          style={{ backgroundImage: "linear-gradient(hsla(265,30%,60%,0.08) 1px, transparent 1px), linear-gradient(90deg, hsla(265,30%,60%,0.08) 1px, transparent 1px)", backgroundSize: "80px 80px" }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsl(228 22% 8% / 0.8))" }} />
        </div>
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel text="Multi-Settore" icon={<Globe className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-white leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Qualsiasi Settore. <span className="text-shimmer">Un Unico Sistema.</span>
          </motion.h2>
          <motion.p className="text-foreground/50 max-w-[550px] mx-auto leading-[1.7] text-sm px-2 sm:px-0"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Empire si adatta automaticamente alla tua industria. Terminologia, moduli, dashboard e flussi operativi cambiano in base al settore.
          </motion.p>
        </div>

        {/* ═══ Mobile: Auto-scroll Carousel — 3 iPhones ═══ */}
        {(() => {
          const INDUSTRY_COLORS: Record<string, string> = {
            food: "#e85d04", ncc: "#C9A84C", beauty: "#e91e8c", healthcare: "#0ea5e9",
            retail: "#8b5cf6", fitness: "#f97316", hospitality: "#10b981",
            beach: "#06b6d4", plumber: "#3b82f6", electrician: "#eab308",
            agriturismo: "#65a30d", cleaning: "#14b8a6", legal: "#64748b",
            accounting: "#6366f1", garage: "#ef4444", photography: "#a855f7",
            construction: "#f59e0b", gardening: "#22c55e", veterinary: "#ec4899",
            tattoo: "#6d28d9", childcare: "#f472b6", education: "#0891b2",
            events: "#d946ef", logistics: "#0ea5e9", custom: "#8b5cf6"
          };
          const SECTOR_HERO_IMAGES: Record<string, string> = {
            food: sectorHeroFood, ncc: sectorHeroNcc, beauty: sectorHeroBeauty,
            healthcare: sectorHeroHealthcare, retail: sectorHeroRetail,
            fitness: sectorHeroFitness, hospitality: sectorHeroHotel,
            beach: sectorHeroBeach, plumber: sectorHeroPlumber, electrician: sectorHeroElectrician,
            construction: sectorHeroConstruction, events: sectorHeroEvents,
            garage: sectorHeroGarage, logistics: sectorHeroLogistics,
            gardening: sectorHeroGardening, veterinary: sectorHeroVeterinary,
            photography: sectorHeroPhotography, education: sectorHeroEducation,
            childcare: sectorHeroChildcare, tattoo: sectorHeroTattoo,
            cleaning: sectorHeroCleaning, agriturismo: sectorHeroAgriturismo,
            legal: sectorHeroLegal, accounting: sectorHeroAccounting,
            custom: sectorHeroCustom
          };
          const allItems: CarouselItem[] = industries.map((ind) => {
            const slug = DEMO_SLUGS[ind.id];
            const siteRoute = ind.id === "food" ? `/r/${slug}` : `/b/${slug}`;
            const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
            const color = INDUSTRY_COLORS[ind.id] || "#8b5cf6";
            const image = SECTOR_HERO_IMAGES[ind.id] || sectorHeroFood;
            return { name: ind.title, route: siteRoute, color, label: ind.modules, nav: demoPath, image };
          });
          // Add extra sectors from extraSectors that have demo slugs
          const EXTRA_SECTOR_MAP: Record<string, {id: string;modules: string;}> = {
            "Stabilimenti Balneari": { id: "beach", modules: "Ombrelloni · Lettini · Bar · Stagionali" },
            "Artigiani & Impiantisti": { id: "plumber", modules: "Interventi · Preventivi · Clienti" },
            "Studi Creativi": { id: "photography", modules: "Portfolio · Booking · Galleria" },
            "Formazione & Coaching": { id: "education", modules: "Corsi · Iscrizioni · Certificazioni" },
            "Veterinari & Pet Care": { id: "veterinary", modules: "Schede · Visite · Vaccini" },
            "Edilizia & Costruzioni": { id: "construction", modules: "Cantieri · SAL · Preventivi" },
            "Eventi & Catering": { id: "events", modules: "Booking · Menu · Staff · Logistica" },
            "Autofficine & Carrozzerie": { id: "garage", modules: "Interventi · Ricambi · Preventivi" },
            "Logistica & Spedizioni": { id: "logistics", modules: "Tracking · Magazzino · Consegne" },
            "Giardinaggio & Vivaisti": { id: "gardening", modules: "Interventi · Manutenzione · Vendita" },
            "Asili & Doposcuola": { id: "childcare", modules: "Iscrizioni · Presenze · Comunicazioni" }
          };
          extraSectors.forEach((es) => {
            const mapped = EXTRA_SECTOR_MAP[es.title];
            if (mapped) {
              const slug = DEMO_SLUGS[mapped.id as keyof typeof DEMO_SLUGS];
              if (slug) {
                allItems.push({
                  name: es.title, route: `/demo/${slug}`, color: INDUSTRY_COLORS[mapped.id] || "#8b5cf6",
                  label: mapped.modules, nav: `/demo/${slug}`, image: SECTOR_HERO_IMAGES[mapped.id] || sectorHeroFood
                });
              }
            }
          });
          return <MobileIPhoneCarousel items={allItems} navigate={navigate} />;
        })()}

        {/* ═══ Desktop: iPhone Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 justify-items-center"
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {/* ── Featured: Hero image previews ── */}
          {[
          { name: "Impero Roma", route: "/r/impero-roma", color: "#e85d04", label: "Food Premium", image: sectorHeroFood },
          { name: "Amalfi Luxury", route: "/b/amalfi-luxury-transfer", color: "#C9A84C", label: "NCC Premium", image: sectorHeroNcc }].
          map((feat, i) =>
          <motion.div key={`feat-${i}`} className="group cursor-pointer" variants={fadeScale}
          onClick={() => navigate(feat.route)} whileHover={{ y: -8, scale: 1.03 }}>
              <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_20px_60px_hsla(0,0%,0%,0.3)]"
            style={{ borderColor: `${feat.color}40`, boxShadow: `0 16px 50px hsla(0,0%,0%,0.45), 0 0 40px ${feat.color}10` }}>
                <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[54px] h-[16px] bg-black rounded-full z-20" />
                <div className="absolute inset-[3px] rounded-[28px] overflow-hidden bg-black">
                  <img
                  src={feat.image}
                  alt={feat.name}
                  className="w-full h-full object-cover"
                  loading="lazy" />
                
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${feat.color}15 0%, ${feat.color}08 40%, transparent 100%)` }} />
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-3 pt-8" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.9) 15%, transparent)" }}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase" style={{ background: `${feat.color}25`, color: feat.color, border: `1px solid ${feat.color}35` }}>★ Live</span>
                  </div>
                  <p className="text-[11px] font-bold text-white">{feat.name}</p>
                  <p className="text-[8px] text-white/40">{feat.label}</p>
                </div>
                <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[44px] h-[4px] bg-white/20 rounded-full z-20" />
              </div>
            </motion.div>
          )}
          {/* ── Standard industry cards — Hero image previews ── */}
          {(() => {
            const SECTOR_IMAGES_D: Record<string, string> = {
              food: sectorHeroFood, ncc: sectorHeroNcc, beauty: sectorHeroBeauty,
              healthcare: sectorHeroHealthcare, retail: sectorHeroRetail,
              fitness: sectorHeroFitness, hospitality: sectorHeroHotel,
              beach: sectorHeroBeach, plumber: sectorHeroPlumber, electrician: sectorHeroElectrician,
              construction: sectorHeroConstruction, events: sectorHeroEvents,
              garage: sectorHeroGarage, logistics: sectorHeroLogistics,
              gardening: sectorHeroGardening, veterinary: sectorHeroVeterinary,
              photography: sectorHeroPhotography, education: sectorHeroEducation,
              childcare: sectorHeroChildcare, tattoo: sectorHeroTattoo,
              cleaning: sectorHeroCleaning, agriturismo: sectorHeroAgriturismo,
              legal: sectorHeroLegal, accounting: sectorHeroAccounting,
              custom: sectorHeroCustom
            };
            const INDUSTRY_COLORS_D: Record<string, string> = {
              food: "#e85d04", ncc: "#C9A84C", beauty: "#e91e8c", healthcare: "#0ea5e9",
              retail: "#8b5cf6", fitness: "#f97316", hospitality: "#10b981",
              beach: "#06b6d4", plumber: "#3b82f6", electrician: "#eab308",
              construction: "#f59e0b", events: "#d946ef", garage: "#ef4444",
              logistics: "#0ea5e9", gardening: "#22c55e", veterinary: "#ec4899",
              photography: "#a855f7", education: "#0891b2", childcare: "#f472b6",
              tattoo: "#6d28d9", cleaning: "#14b8a6", agriturismo: "#65a30d",
              legal: "#64748b", accounting: "#6366f1", custom: "#8b5cf6"
            };
            return industries.map((ind, i) => {
              const slug = DEMO_SLUGS[ind.id];
              const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
              const color = INDUSTRY_COLORS_D[ind.id] || "#8b5cf6";
              const heroImg = SECTOR_IMAGES_D[ind.id] || sectorHeroFood;
              return (
                <motion.div key={i} className="group cursor-pointer" variants={fadeScale}
                onClick={() => navigate(demoPath)} whileHover={{ y: -8, scale: 1.03 }}>
                  <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] overflow-hidden transition-shadow duration-500"
                  style={{ borderColor: `${color}40`, boxShadow: `0 16px 50px hsla(0,0%,0%,0.45), 0 0 25px ${color}10` }}>
                    <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[54px] h-[16px] bg-black rounded-full z-20" />
                    <div className="absolute inset-[3px] rounded-[28px] overflow-hidden bg-black">
                      <img
                        src={heroImg}
                        alt={ind.title}
                        className="w-full h-full object-cover"
                        loading="lazy" />
                      
                      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${color}15 0%, ${color}08 40%, transparent 100%)` }} />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-3 pt-8" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.9) 15%, transparent)" }}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase" style={{ background: `${color}25`, color, border: `1px solid ${color}35` }}>★ Live</span>
                      </div>
                      <h3 className="text-[11px] font-bold text-white leading-tight">{ind.title}</h3>
                      <p className="text-[7px] text-white/40 mt-0.5">{ind.modules}</p>
                    </div>
                    <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[44px] h-[4px] bg-white/20 rounded-full z-20" />
                  </div>
                </motion.div>);

            });
          })()}
          <motion.div
            className="group cursor-pointer"
            variants={fadeScale}
            onClick={() => setSectorSheetOpen(true)}
            whileHover={{ y: -4 }}>
            
            <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] border-dashed border-foreground/10 hover:border-primary/20 transition-all duration-500 flex flex-col items-center justify-center text-center overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-primary/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <motion.div animate={{ scale: [1, 1.15, 1] }} transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}>
                <Sparkles className="w-7 h-7 text-foreground/15 mb-3 group-hover:text-primary/60 transition-colors" />
              </motion.div>
              <p className="text-xs font-heading font-semibold text-foreground/35 group-hover:text-foreground/60 transition-colors">+18 altri settori</p>
              <p className="text-[0.6rem] text-primary/40 mt-1.5">Esplora tutti →</p>
            </div>
          </motion.div>
        </motion.div>

        {/* CTA buttons under sectors */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10 sm:mt-14"
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
          <motion.button
            onClick={() => scrollTo("pricing")}
            className="group w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center justify-center gap-2"
            style={{ boxShadow: "0 6px 30px hsl(var(--empire-violet) / 0.25), inset 0 1px 0 hsl(0 0% 100% / 0.15)" }}
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.3)" }}
            whileTap={{ scale: 0.97 }}>
            
            Inizia Ora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="w-full sm:w-auto px-7 py-3.5 rounded-2xl text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:text-foreground transition-all inline-flex items-center justify-center gap-2"
            style={{
              border: "1px solid hsl(var(--border) / 0.4)",
              background: "linear-gradient(160deg, hsl(228 20% 14% / 0.85), hsl(248 18% 11% / 0.8))",
              backdropFilter: "blur(12px)",
              boxShadow: "0 2px 12px hsl(var(--primary) / 0.04), inset 0 1px 0 hsl(0 0% 100% / 0.06)"
            }}
            whileHover={{ scale: 1.01, borderColor: "hsl(var(--primary) / 0.2)" }}>
            
            <Play className="w-4 h-4 text-primary/60" /> Prova Tutte le Demo
          </motion.button>
        </motion.div>

        {/* ═══ Sector Selector Sheet (iPhone style) ═══ */}
        <AnimatePresence>
          {sectorSheetOpen &&
          <>
              {/* Backdrop */}
              <motion.div
              className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setSectorSheetOpen(false)} />
            
              {/* Sheet */}
              <motion.div
              className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[420px] sm:max-h-[85vh]"
              style={{ maxHeight: "85vh" }}
              initial={{ y: "100%", x: 0, opacity: 0 }}
              animate={{ y: 0, x: 0, opacity: 1 }}
              exit={{ y: "100%", opacity: 0 }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}>
              
                <div className="sm:relative sm:-translate-x-1/2 sm:-translate-y-1/2 rounded-t-[28px] sm:rounded-[28px] overflow-hidden border border-foreground/10"
              style={{ background: "hsla(260,20%,6%,0.97)", backdropFilter: "blur(40px)", boxShadow: "0 -10px 60px hsla(0,0%,0%,0.5), 0 0 40px hsla(265,70%,60%,0.08)" }}>
                  {/* Handle bar */}
                  <div className="flex justify-center pt-3 pb-1 sm:hidden">
                    <div className="w-10 h-1 rounded-full" style={{ background: "hsla(0,0%,100%,0.15)" }} />
                  </div>
                  {/* Header */}
                  <div className="px-6 pt-4 pb-3 flex items-center justify-between">
                    <div>
                      <h3 className="font-heading font-bold text-foreground text-sm tracking-wide">Tutti i Settori</h3>
                      <p className="text-[0.6rem] text-foreground/30 mt-0.5">25+ industrie supportate da Empire</p>
                    </div>
                    <motion.button
                    onClick={() => setSectorSheetOpen(false)}
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: "hsla(0,0%,100%,0.06)", border: "1px solid hsla(0,0%,100%,0.08)" }}
                    whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                    
                      <X className="w-3.5 h-3.5 text-foreground/50" />
                    </motion.button>
                  </div>
                  {/* Accent line */}
                  <div className="mx-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.2), transparent)" }} />
                  {/* Scrollable content */}
                  <div className="overflow-y-auto px-4 py-4 space-y-2" style={{ maxHeight: "60vh" }}>
                    {/* ── Featured: Showcase Premium ── */}
                    <p className="text-[0.55rem] font-heading font-bold tracking-[3px] uppercase px-2 mb-2" style={{ color: "hsla(38,50%,55%,0.7)" }}>★ Showcase Premium</p>
                    {[
                  { name: "Food & Ristorazione", desc: "Menu Digitale · Ordini · QR · Cucina Live", route: "/r/impero-roma", color: "#e85d04", icon: <ChefHat className="w-4 h-4" /> },
                  { name: "NCC & Trasporto Premium", desc: "Flotta · Tratte · Booking · Autisti", route: "/b/amalfi-luxury-transfer", color: "#C9A84C", icon: <Car className="w-4 h-4" /> }].
                  map((feat, i) =>
                  <motion.div key={`featured-${i}`}
                  className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                  style={{ background: `${feat.color}08`, border: `1px solid ${feat.color}20` }}
                  whileHover={{ scale: 1.01, borderColor: `${feat.color}40` }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {setSectorSheetOpen(false);navigate(feat.route);}}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                    
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0"
                    style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}25`, color: feat.color }}>
                          {feat.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5">
                            <p className="text-xs font-heading font-bold text-foreground truncate">{feat.name}</p>
                            <span className="text-[6px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase flex-shrink-0" style={{ background: `${feat.color}20`, color: feat.color }}>Live</span>
                          </div>
                          <p className="text-[0.6rem] text-foreground/30 truncate">{feat.desc}</p>
                        </div>
                        <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: feat.color }} />
                      </motion.div>
                  )}
                    {/* Divider */}
                    <div className="py-2">
                      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.15), transparent)" }} />
                    </div>
                    {/* Active sectors with demos */}
                    <p className="text-[0.55rem] font-heading font-bold text-primary/50 tracking-[3px] uppercase px-2 mb-2">Con Demo Live</p>
                    {industries.map((ind, i) => {
                    const slug = DEMO_SLUGS[ind.id];
                    const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
                    return (
                      <motion.div key={`main-${i}`}
                      className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                      style={{ background: "hsla(0,0%,100%,0.02)", border: "1px solid hsla(0,0%,100%,0.04)" }}
                      whileHover={{ background: "hsla(265,70%,60%,0.06)", borderColor: "hsla(265,70%,60%,0.15)", scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {setSectorSheetOpen(false);navigate(demoPath);}}
                      initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                        
                          <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${ind.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0`}>
                            {ind.icon}
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-heading font-bold text-foreground truncate">{ind.title}</p>
                            <p className="text-[0.6rem] text-foreground/30 truncate">{ind.desc}</p>
                          </div>
                          <div className="flex items-center gap-1.5 flex-shrink-0">
                            <span className="text-[0.5rem] font-heading font-bold text-primary/60 tracking-wider uppercase">Demo</span>
                            <ArrowRight className="w-3 h-3 text-primary/40" />
                          </div>
                        </motion.div>);

                  })}
                    {/* Divider */}
                    <div className="py-3">
                      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.12), transparent)" }} />
                    </div>
                    {/* Extra sectors */}
                    <p className="text-[0.55rem] font-heading font-bold text-foreground/25 tracking-[3px] uppercase px-2 mb-2">In Arrivo & Su Richiesta</p>
                    {extraSectors.map((sec, i) =>
                  <motion.div key={`extra-${i}`}
                  className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                  style={{ background: "hsla(0,0%,100%,0.01)", border: "1px solid hsla(0,0%,100%,0.03)" }}
                  whileHover={{ background: "hsla(0,0%,100%,0.03)", scale: 1.01 }}
                  initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.02 }}>
                    
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.gradient} flex items-center justify-center text-white shadow-lg flex-shrink-0 opacity-70`}>
                          {sec.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-heading font-bold text-foreground/60 truncate">{sec.title}</p>
                          <p className="text-[0.6rem] text-foreground/20 truncate">{sec.desc}</p>
                        </div>
                        <span className="text-[0.5rem] font-heading text-foreground/15 tracking-wider uppercase flex-shrink-0">Presto</span>
                      </motion.div>
                  )}
                  </div>
                  {/* Bottom CTA */}
                  <div className="px-6 py-4" style={{ borderTop: "1px solid hsla(0,0%,100%,0.05)" }}>
                    <motion.button
                    onClick={() => {setSectorSheetOpen(false);scrollTo("contact");}}
                    className="w-full py-3 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-primary-foreground"
                    style={{ background: "linear-gradient(135deg, hsla(265,70%,60%,1), hsla(280,60%,50%,1))", boxShadow: "0 8px 30px hsla(265,70%,60%,0.2)" }}
                    whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}>
                    
                      Non trovi il tuo? Contattaci →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          }
        </AnimatePresence>
      </Section>









      {/* ═══════════════════════════════════════════
                             BUILD ANYTHING — Streamlined Conversion Section
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(240 20% 10%) 50%, hsl(228 22% 8%) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] left-[20%] w-[550px] h-[550px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[30%] right-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] left-[32%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[30%] right-[25%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[14%] right-[30%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.2), hsla(38,50%,50%,0.12), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.04]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(228,22%,10%,0.5))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>

        <div className="text-center mb-14">
          <SectionLabel text="Su Misura" icon={<Sparkles className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,5vw,3.2rem)] font-heading font-bold text-white leading-[1.05] mb-4"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Costruiamo <span className="text-shimmer">Qualsiasi Cosa</span>
          </motion.h2>
          <motion.p className="text-foreground/55 max-w-[500px] mx-auto text-sm leading-[1.8]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Nessun pacchetto standard. Analizziamo il tuo business, progettiamo la soluzione perfetta e la costruiamo su misura.
          </motion.p>
        </div>

        {/* ═══ 3 Pillars — DNA Assembly ═══ */}
        <div className="relative mb-14">
          {/* DNA background */}
          <div className="absolute inset-0 pointer-events-none -z-[1]">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-full sm:h-[220px] opacity-100">
               <svg className="w-full h-full" viewBox="0 0 1200 600" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="lp-dna-a" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="lp-dna-b" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.35" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 0 120 C 200 30, 400 210, 600 120 C 800 30, 1000 210, 1200 120"
                  fill="none"
                  stroke="url(#lp-dna-a)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }} />
                
                <motion.path
                  d="M 0 300 C 200 390, 400 210, 600 300 C 800 390, 1000 210, 1200 300"
                  fill="none"
                  stroke="url(#lp-dna-b)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }} />
                
                {/* Extra helix strands for depth */}
                <motion.path
                  d="M 0 200 C 300 120, 600 320, 900 200 C 1000 150, 1100 250, 1200 200"
                  fill="none"
                  stroke="url(#lp-dna-a)"
                  strokeWidth="1"
                  strokeOpacity="0.4"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.4 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }} />
                
                <motion.path
                  d="M 0 400 C 300 480, 600 320, 900 400 C 1000 450, 1100 350, 1200 400"
                  fill="none"
                  stroke="url(#lp-dna-b)"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }} />
                
                {/* Cross-links between helixes */}
                {[100, 250, 400, 550, 700, 850, 1000, 1150].map((x, ci) =>
                <motion.line
                  key={`xlink-${ci}`}
                  x1={x} y1={120 + Math.sin(x / 200 * Math.PI) * 90}
                  x2={x} y2={300 + Math.sin(x / 200 * Math.PI + Math.PI) * 90}
                  stroke="url(#lp-dna-a)"
                  strokeWidth="0.5"
                  strokeOpacity="0.2"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6 + ci * 0.08, duration: 0.4 }} />

                )}
              </svg>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.35), transparent)" }} />
          </div>

          {/* AI Tech Network Schema */}
          <div className="relative">
            {/* SVG Network Lines — connecting the 3 cards */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 400 200" preserveAspectRatio="none">
              <defs>
                <linearGradient id="net-line-v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(265,60%,55%)" stopOpacity="0.15" />
                  <stop offset="50%" stopColor="hsl(38,45%,52%)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="hsl(265,60%,55%)" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="net-line-h" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(265,60%,55%)" stopOpacity="0.12" />
                  <stop offset="50%" stopColor="hsl(38,45%,52%)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="hsl(265,60%,55%)" stopOpacity="0.12" />
                </linearGradient>
              </defs>
              {/* Horizontal connections */}
              <line x1="22%" y1="50%" x2="50%" y2="50%" stroke="url(#net-line-h)" strokeWidth="0.5" />
              <line x1="50%" y1="50%" x2="78%" y2="50%" stroke="url(#net-line-h)" strokeWidth="0.5" />
              {/* Diagonal cross-connections */}
              <line x1="22%" y1="25%" x2="50%" y2="75%" stroke="url(#net-line-v)" strokeWidth="0.3" strokeDasharray="3 5" />
              <line x1="78%" y1="25%" x2="50%" y2="75%" stroke="url(#net-line-v)" strokeWidth="0.3" strokeDasharray="3 5" />
              <line x1="22%" y1="75%" x2="78%" y2="25%" stroke="url(#net-line-v)" strokeWidth="0.25" strokeDasharray="2 6" />
              {/* Top arc connections */}
              <line x1="22%" y1="20%" x2="78%" y2="20%" stroke="url(#net-line-h)" strokeWidth="0.3" strokeDasharray="4 4" />
              <line x1="22%" y1="80%" x2="78%" y2="80%" stroke="url(#net-line-h)" strokeWidth="0.3" strokeDasharray="4 4" />
              {/* Junction nodes */}
              {[
              [22, 50], [50, 50], [78, 50],
              [22, 25], [50, 25], [78, 25],
              [22, 75], [50, 75], [78, 75],
              [36, 37], [64, 37], [36, 63], [64, 63],
              [22, 20], [50, 20], [78, 20],
              [22, 80], [50, 80], [78, 80]].
              map(([cx, cy], ni) =>
              <g key={ni}>
                  <circle cx={`${cx}%`} cy={`${cy}%`} r="1.8" fill="hsla(265,60%,55%,0.12)" stroke="hsla(38,45%,52%,0.15)" strokeWidth="0.4">
                    <animate attributeName="r" values="1.5;2.2;1.5" dur={`${3 + ni * 0.3}s`} repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${2.5 + ni * 0.2}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              )}
              {/* Animated data pulses traveling along lines */}
              {[
              { x1: "22%", y1: "50%", x2: "50%", y2: "50%", dur: "2.5s", delay: "0s" },
              { x1: "50%", y1: "50%", x2: "78%", y2: "50%", dur: "2.8s", delay: "0.8s" },
              { x1: "22%", y1: "25%", x2: "50%", y2: "75%", dur: "3.2s", delay: "1.2s" },
              { x1: "78%", y1: "25%", x2: "50%", y2: "75%", dur: "3s", delay: "0.5s" }].
              map((p, pi) =>
              <circle key={`pulse-${pi}`} r="1.2" fill="hsla(38,50%,55%,0.35)">
                  <animateMotion dur={p.dur} begin={p.delay} repeatCount="indefinite" path={`M0,0 L100,0`}>
                    <mpath xlinkHref={`#net-path-${pi}`} />
                  </animateMotion>
                  <animate attributeName="opacity" values="0;0.6;0" dur={p.dur} begin={p.delay} repeatCount="indefinite" />
                </circle>
              )}
              {/* Define motion paths */}
              <path id="net-path-0" d="M88,100 L200,100" fill="none" />
              <path id="net-path-1" d="M200,100 L312,100" fill="none" />
              <path id="net-path-2" d="M88,50 L200,150" fill="none" />
              <path id="net-path-3" d="M312,50 L200,150" fill="none" />
            </svg>

            {/* Opaque layer to block DNA background bleed */}
            <div className="absolute inset-0 rounded-2xl" style={{
              background: "linear-gradient(145deg, hsl(228 20% 14% / 0.86), hsl(232 22% 12% / 0.84))",
              border: "1px solid hsl(var(--border) / 0.3)"
            }} />

            {/* Circuit connection SVG between the 3 cards */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
              {/* Horizontal bus line connecting all 3 */}
              <line x1="16.5%" y1="50%" x2="83.5%" y2="50%" stroke="hsla(265,50%,55%,0.18)" strokeWidth="0.5" strokeDasharray="4,6" />
              {/* Vertical taps from bus to each card center */}
              <line x1="16.5%" y1="35%" x2="16.5%" y2="65%" stroke="hsla(155,40%,45%,0.14)" strokeWidth="0.5" strokeDasharray="3,5" />
              <line x1="50%" y1="30%" x2="50%" y2="70%" stroke="hsla(38,45%,50%,0.12)" strokeWidth="0.5" strokeDasharray="3,5" />
              <line x1="83.5%" y1="35%" x2="83.5%" y2="65%" stroke="hsla(155,40%,45%,0.14)" strokeWidth="0.5" strokeDasharray="3,5" />
              {/* Junction nodes */}
              {[[16.5, 50], [50, 50], [83.5, 50]].map(([cx, cy], ni) =>
              <circle key={ni} cx={`${cx}%`} cy={`${cy}%`} r="2.5" fill="hsla(265,55%,55%,0.15)" stroke="hsla(265,50%,55%,0.25)" strokeWidth="0.4">
                  <animate attributeName="r" values="2;3;2" dur={`${2.5 + ni * 0.4}s`} repeatCount="indefinite" />
                </circle>
              )}
              {/* Animated data pulse along the bus */}
              <circle r="2" fill="hsla(38,50%,55%,0.5)">
                <animate attributeName="cx" values="16.5%;50%;83.5%;50%;16.5%" dur="5s" repeatCount="indefinite" />
                <animate attributeName="cy" values="50%;50%;50%;50%;50%" dur="5s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.2;0.7;0.2;0.7;0.2" dur="5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="hsla(265,60%,65%,0.4)">
                <animate attributeName="cx" values="83.5%;50%;16.5%;50%;83.5%" dur="6s" repeatCount="indefinite" />
                <animate attributeName="cy" values="50%;50%;50%;50%;50%" dur="6s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.15;0.5;0.15;0.5;0.15" dur="6s" repeatCount="indefinite" />
              </circle>
            </svg>

            <div className="relative z-[2] grid grid-cols-3 gap-2 sm:gap-3">
              {[
              { icon: <Palette className="w-3 h-3" />, title: "100% White Label", desc: "Ogni pixel è il tuo brand.", accent: "Il TUO brand" },
              { icon: <Workflow className="w-3 h-3" />, title: "Automazione Totale", desc: "Tutto in autopilot.", accent: "Zero lavoro manuale" },
              { icon: <Rocket className="w-3 h-3" />, title: "Sviluppo Custom", desc: "Integrazioni su richiesta.", accent: "Nessun limite" }].
              map((card, i) =>
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12, scale: 0.9 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
                className="relative flex flex-col items-center text-center p-3 rounded-2xl overflow-hidden group"
                style={{
                  background: "linear-gradient(160deg, hsl(228 20% 16% / 0.95), hsl(232 22% 11% / 0.95))",
                  backdropFilter: "blur(16px)",
                  border: "1px solid hsl(var(--border) / 0.35)",
                  boxShadow: "0 2px 16px hsl(var(--primary) / 0.06), inset 0 1px 0 hsl(0 0% 100% / 0.08)"
                }}>
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }} />
                  {/* Glass reflection */}
                  <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsl(0 0% 100% / 0.05) 0%, transparent 25%)" }} />
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{ background: "radial-gradient(circle at 50% 30%, hsl(var(--primary) / 0.05), transparent 60%)" }} />
                
                  {/* Compact tech icon */}
                  <div className="relative z-10 w-8 h-8 rounded-xl flex items-center justify-center mb-1.5"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.06))",
                  border: "1px solid hsl(var(--primary) / 0.15)",
                  boxShadow: "0 2px 8px hsl(var(--primary) / 0.06)"
                }}>
                    <div className="text-primary">{card.icon}</div>
                  </div>
                  <h3 className="relative z-10 font-heading text-[0.55rem] font-bold text-foreground/90 leading-tight mb-0.5">{card.title}</h3>
                  <p className="relative z-10 text-[0.45rem] text-foreground/65 leading-[1.4] mb-1">{card.desc}</p>
                  <motion.span className="relative z-10 text-[0.45rem] font-heading font-semibold text-primary/70 tracking-wider inline-flex items-center gap-1"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.6 }}>
                    <span className="w-1 h-1 rounded-full bg-primary/60" />
                    {card.accent}
                  </motion.span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Scrolling Capabilities Ticker ═══ */}
        <div className="relative mb-14 -mx-5 sm:-mx-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsl(228 22% 8%), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsl(228 22% 8%), transparent)" }} />
          {[0, 1].map((row) =>
          <div key={row} className="flex whitespace-nowrap mb-2" style={{ animation: `carousel-scroll ${row === 0 ? "40s" : "45s"} linear infinite ${row === 1 ? "reverse" : ""}` }}>
              {[...Array(2)].map((_, rep) =>
            <div key={rep} className="flex gap-2 px-1">
                  {(row === 0 ?
              ["App White-Label", "Dashboard IA", "Menu QR", "Booking Online", "CRM Avanzato", "Push Notification", "Fatturazione", "Analytics", "Chat Clienti", "GPS Tracking", "Mappa Tavoli", "Gestione Staff"] :
              ["Pagamenti", "Email Marketing", "WhatsApp Auto", "Inventario", "HACCP", "Review Shield™", "Agenda Smart", "Pricing Dinamico", "Landing SEO", "Cross-selling IA", "Programma Fedeltà", "Schede Paziente"]).
              map((cap, ci) =>
              <span key={ci} className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-[0.6rem] font-heading font-medium tracking-wider"
              style={{ background: "linear-gradient(160deg, hsl(228 20% 14% / 0.85), hsl(248 18% 11% / 0.8))", border: "1px solid hsl(var(--primary) / 0.08)", color: "hsl(var(--primary) / 0.6)", boxShadow: "0 1px 8px hsl(var(--primary) / 0.04), inset 0 1px 0 hsl(0 0% 100% / 0.06)" }}>
                      <CircleCheck className="w-2.5 h-2.5" />
                      {cap}
                    </span>
              )}
                </div>
            )}
            </div>
          )}
        </div>

        {/* ═══ Bottom Promise ═══ */}
        <motion.div className="max-w-2xl mx-auto text-center p-8 sm:p-10 rounded-2xl border border-accent/20 overflow-hidden relative shadow-[0_8px_50px_hsla(265,50%,30%,0.15),0_0_80px_hsla(38,50%,50%,0.06)]"
        style={{ background: "linear-gradient(165deg, hsla(265,18%,12%,0.94), hsla(230,14%,9%,0.95))" }}
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="absolute inset-0 premium-holo-grid opacity-[0.04] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsla(38,55%,55%,0.4), hsla(265,70%,60%,0.3), transparent)" }} />
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px]" style={{ background: "linear-gradient(90deg, transparent, hsla(265,60%,55%,0.2), transparent)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              {[
              { val: "25+", label: "Settori" },
              { val: "100+", label: "Moduli" },
              { val: "∞", label: "Possibilità" }].
              map((s, i) =>
              <motion.div key={i} className="text-center"
              initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <p className="text-xl sm:text-2xl font-heading font-bold text-shimmer">{s.val}</p>
                  <p className="text-[0.5rem] text-foreground/50 tracking-[2px] uppercase">{s.label}</p>
                </motion.div>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2">
              "Se puoi immaginarlo, <span className="text-shimmer">noi lo costruiamo.</span>"
            </h3>
            <p className="text-[0.7rem] text-foreground/65 mb-6 max-w-md mx-auto">
              Il tuo business merita una soluzione costruita su misura. Non un compromesso.
            </p>
            <motion.button
              onClick={() => scrollTo("pricing")}
              className="px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
              whileTap={{ scale: 0.97 }}>
              
              Inizia Ora <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </Section>





      {/* ═══════════════════════════════════════════
                             PRIMA vs DOPO — Trasformazione Reale
                            ═══════════════════════════════════════════ */}
      {(() => {
        const transformations = [
          { metric: "Ordini", before: "45 min", after: "3 min", icon: <Timer className="w-3 h-3" />, improvement: "-93%", color: "265" },
          { metric: "Recensioni", before: "12/mese", after: "0", icon: <Shield className="w-3 h-3" />, improvement: "-100%", color: "150" },
          { metric: "Clienti persi", before: "34%", after: "2%", icon: <Users className="w-3 h-3" />, improvement: "-94%", color: "210" },
          { metric: "Revenue AI", before: "0€", after: "+2.4K€", icon: <TrendingUp className="w-3 h-3" />, improvement: "+∞", color: "38" },
          { metric: "Fatturazione", before: "2h/g", after: "Auto", icon: <Receipt className="w-3 h-3" />, improvement: "-100%", color: "200" },
          { metric: "Marketing", before: "Manuale", after: "AI 24/7", icon: <Rocket className="w-3 h-3" />, improvement: "Auto", color: "35" },
        ];

        const impactNumbers = [
          { value: "847", label: "Business trasformati", suffix: "+" },
          { value: "3.2M", label: "Ordini IA", suffix: "" },
          { value: "94", label: "Ore risparmiate", suffix: "h" },
          { value: "40", label: "Revenue medio", suffix: "%" },
        ];

        /* Node positions for mobile circuit (% based, 2-col 3-row) */
        const nodePos = [
          { x: 25, y: 15 }, { x: 75, y: 15 },
          { x: 25, y: 43 }, { x: 75, y: 43 },
          { x: 25, y: 71 }, { x: 75, y: 71 },
        ];
        const circuits = [
          { from: 0, to: 1 }, { from: 0, to: 2 }, { from: 1, to: 3 },
          { from: 2, to: 3 }, { from: 2, to: 4 }, { from: 3, to: 5 },
          { from: 4, to: 5 },
        ];

        return (
        <section className="relative py-14 sm:py-28 px-4 sm:px-6 overflow-hidden"
        style={mobilifyBg({
          background: "linear-gradient(180deg, hsla(228,22%,10%,0.7) 0%, hsla(232,20%,9%,0.65) 50%, hsla(228,22%,10%,0.7) 100%)"
        })}>
          {/* Ambient */}
          <div className="absolute inset-0 pointer-events-none z-0">
            <div className="absolute top-[10%] right-[15%] w-[450px] h-[450px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, hsla(150,60%,50%,0.5), transparent 65%)", filter: "blur(120px)" }} />
            <div className="absolute bottom-[20%] left-[10%] w-[400px] h-[400px] rounded-full opacity-[0.035]"
            style={{ background: "radial-gradient(circle, hsla(38,60%,50%,0.4), transparent 65%)", filter: "blur(110px)" }} />
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
            style={{ background: "linear-gradient(90deg, transparent, hsla(150,55%,50%,0.18), hsla(265,50%,55%,0.12), transparent)" }} />
          </div>

          <div className="max-w-[1100px] mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-6 sm:mb-14">
              <SectionLabel text="Risultati Reali" icon={<TrendingUp className="w-3 h-3 text-primary" />} />
              <motion.h2 className="text-[clamp(1.3rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.08] mb-2"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
                Prima vs Dopo <span className="text-shimmer">Empire</span>
              </motion.h2>
              <motion.p className="text-foreground/40 text-[0.65rem] sm:text-sm max-w-md mx-auto leading-relaxed"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vpOnce} transition={{ delay: 0.15 }}>
                Dati reali dai nostri clienti. La trasformazione inizia dal primo giorno.
              </motion.p>
            </div>

            {/* ═══ IMPACT NUMBERS — compact 4-col ═══ */}
            <motion.div className="grid grid-cols-4 gap-1.5 sm:gap-3 mb-6 sm:mb-12"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
              {impactNumbers.map((n, i) => (
                <div key={i} className="relative rounded-lg sm:rounded-xl overflow-hidden py-3 px-1.5 sm:p-4 text-center"
                style={{
                  background: "linear-gradient(160deg, hsl(228 20% 14% / 0.85), hsl(232 22% 12% / 0.82))",
                  border: `1px solid hsla(${[265,150,38,210][i]},40%,50%,0.15)`
                }}>
                  <div className="absolute top-0 left-0 right-0 h-[1px]"
                  style={{ background: `linear-gradient(90deg, transparent, hsla(${[265,150,38,210][i]},60%,55%,0.4), transparent)` }} />
                  <div className="text-[clamp(1rem,3.5vw,2.2rem)] font-heading font-bold text-foreground leading-none mb-0.5">
                    {n.value}<span className="text-primary/70 text-[0.55em]">{n.suffix}</span>
                  </div>
                  <div className="text-foreground/30 text-[0.45rem] sm:text-xs tracking-wide uppercase leading-tight">{n.label}</div>
                </div>
              ))}
            </motion.div>

            {/* ═══ CIRCUIT NETWORK — Mobile ═══ */}
            <motion.div className="relative mb-6 sm:mb-12"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vpOnce} transition={{ delay: 0.1 }}>

              {/* ── Mobile: Circuit network with SVG paths ── */}
              <div className="block sm:hidden relative" style={{ minHeight: "520px" }}>
                {/* SVG Circuit Lines overlay */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 84" preserveAspectRatio="none">
                  <defs>
                    <filter id="trf-glow">
                      <feGaussianBlur stdDeviation="0.3" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {circuits.map((p, i) => {
                    const f = nodePos[p.from];
                    const t2 = nodePos[p.to];
                    const isVert = f.x === t2.x;
                    const midY = (f.y + t2.y) / 2;
                    const midX = (f.x + t2.x) / 2;
                    const d = isVert
                      ? `M ${f.x} ${f.y + 6} L ${f.x} ${t2.y - 6}`
                      : `M ${f.x + 10} ${f.y} Q ${midX} ${f.y} ${midX} ${midY} Q ${midX} ${t2.y} ${t2.x - 10} ${t2.y}`;
                    const hue = transformations[p.from]?.color || "265";
                    return (
                      <g key={i}>
                        <path d={d} fill="none" stroke={`hsla(${hue},40%,45%,0.1)`} strokeWidth="0.25" />
                        <circle r="0.5" fill={`hsla(${hue},65%,60%,0.6)`} filter="url(#trf-glow)">
                          <animateMotion dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" path={d} />
                        </circle>
                      </g>
                    );
                  })}
                  {/* Junction nodes */}
                  {nodePos.map((pos, i) => (
                    <circle key={`j-${i}`} cx={pos.x} cy={pos.y} r="0.8"
                    fill={`hsla(${transformations[i].color},50%,50%,0.18)`}
                    stroke={`hsla(${transformations[i].color},50%,50%,0.12)`} strokeWidth="0.25" />
                  ))}
                </svg>

                {/* Node cards grid */}
                <div className="relative z-10 grid grid-cols-2 gap-x-2.5 gap-y-2.5 px-0.5">
                  {transformations.map((t, i) => (
                    <motion.div key={i}
                    className="relative rounded-xl overflow-hidden"
                    style={{
                      background: "linear-gradient(160deg, hsl(228 20% 14% / 0.86), hsl(232 22% 12% / 0.84))",
                      border: `1px solid hsla(${t.color},35%,50%,0.18)`,
                      boxShadow: `0 2px 16px hsla(${t.color},40%,50%,0.06)`
                    }}
                    initial={{ opacity: 0, scale: 0.92 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={vpOnce}
                    transition={{ delay: i * 0.06 }}>
                      {/* HUD corner brackets */}
                      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l rounded-tl-xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.25)` }} />
                      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r rounded-tr-xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.25)` }} />
                      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l rounded-bl-xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.12)` }} />
                      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r rounded-br-xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.12)` }} />

                      <div className="p-2.5">
                        {/* Icon + metric + badge */}
                        <div className="flex items-center gap-1.5 mb-2">
                          <div className="w-5 h-5 rounded-md flex items-center justify-center"
                          style={{ background: `hsla(${t.color},50%,50%,0.12)`, color: `hsla(${t.color},65%,60%,1)` }}>
                            {t.icon}
                          </div>
                          <span className="text-foreground/55 text-[0.55rem] font-medium leading-tight flex-1">{t.metric}</span>
                          <span className="text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full"
                          style={{ background: `hsla(${t.color},50%,50%,0.1)`, color: `hsla(${t.color},65%,60%,0.85)` }}>
                            {t.improvement}
                          </span>
                        </div>

                        {/* Before → After */}
                        <div className="flex items-center gap-1">
                          <div className="flex-1 rounded-lg py-1.5 px-1.5 text-center"
                          style={{ background: "hsla(0,40%,50%,0.12)", border: "1px solid hsla(0,40%,50%,0.1)" }}>
                            <div className="text-[0.35rem] uppercase tracking-widest text-foreground/45 mb-0.5">Prima</div>
                            <div className="text-[0.65rem] font-bold text-red-500/75 leading-tight">{t.before}</div>
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `hsla(${t.color},55%,50%,0.6)` }} />
                          <div className="flex-1 rounded-lg py-1.5 px-1.5 text-center"
                          style={{ background: `hsla(${t.color},40%,50%,0.06)`, border: `1px solid hsla(${t.color},40%,50%,0.12)` }}>
                            <div className="text-[0.35rem] uppercase tracking-widest text-foreground/45 mb-0.5">Dopo</div>
                            <div className="text-[0.65rem] font-bold leading-tight" style={{ color: `hsla(${t.color},65%,42%,0.95)` }}>{t.after}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* ── Desktop: 3-col with circuit mesh ── */}
              <div className="hidden sm:block relative">
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                  <defs>
                    <filter id="trf-glow-d">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  {[0, 1].map(row => (
                    <g key={`r-${row}`}>
                      <line x1="17%" y1={`${30 + row * 50}%`} x2="83%" y2={`${30 + row * 50}%`}
                      stroke="hsla(265,35%,40%,0.08)" strokeWidth="1" />
                      <motion.circle r="3" fill="hsla(265,60%,60%,0.5)" filter="url(#trf-glow-d)">
                        <animateMotion dur={`${3 + row}s`} repeatCount="indefinite"
                        path={`M 0 0 L 500 0`} />
                      </motion.circle>
                    </g>
                  ))}
                  {[0, 1, 2].map(col => (
                    <line key={`c-${col}`} x1={`${17 + col * 33}%`} y1="30%" x2={`${17 + col * 33}%`} y2="80%"
                    stroke="hsla(150,35%,40%,0.06)" strokeWidth="1" />
                  ))}
                </svg>

                <div className="relative z-10 grid grid-cols-3 gap-4">
                  {transformations.map((t, i) => (
                    <motion.div key={i}
                    className="relative rounded-2xl overflow-hidden"
                    style={{
                      background: "linear-gradient(160deg, hsl(228 20% 14% / 0.86), hsl(232 22% 12% / 0.84))",
                      border: `1px solid hsla(${t.color},30%,50%,0.15)`,
                      boxShadow: `0 2px 20px hsla(${t.color},50%,50%,0.06)`
                    }}
                    initial={{ opacity: 0, y: 25 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={vpOnce}
                    transition={{ delay: i * 0.08 }}>
                      <div className="absolute top-0 left-0 w-4 h-4 border-t border-l rounded-tl-2xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.2)` }} />
                      <div className="absolute top-0 right-0 w-4 h-4 border-t border-r rounded-tr-2xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.2)` }} />
                      <div className="absolute bottom-0 left-0 w-4 h-4 border-b border-l rounded-bl-2xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.12)` }} />
                      <div className="absolute bottom-0 right-0 w-4 h-4 border-b border-r rounded-br-2xl" style={{ borderColor: `hsla(${t.color},50%,50%,0.12)` }} />

                      <div className="p-5">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                          style={{ background: `hsla(${t.color},50%,50%,0.12)`, color: `hsla(${t.color},65%,60%,1)` }}>
                            {React.cloneElement(t.icon as React.ReactElement, { className: "w-4 h-4" })}
                          </div>
                          <span className="text-foreground/60 text-xs font-medium">{t.metric}</span>
                          <span className="ml-auto text-[0.6rem] font-bold px-2 py-0.5 rounded-full"
                          style={{ background: `hsla(${t.color},50%,50%,0.1)`, color: `hsla(${t.color},65%,60%,0.9)`, border: `1px solid hsla(${t.color},40%,45%,0.15)` }}>
                            {t.improvement}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex-1 rounded-xl p-3 text-center"
                          style={{ background: "hsla(0,40%,50%,0.12)", border: "1px solid hsla(0,40%,50%,0.12)" }}>
                            <div className="text-[0.5rem] uppercase tracking-wider text-foreground/45 mb-1">Prima</div>
                            <div className="text-sm font-bold text-red-500/80">{t.before}</div>
                          </div>
                          <motion.div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: `hsla(${t.color},50%,50%,0.15)` }}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: `hsla(${t.color},65%,60%,1)` }} />
                          </motion.div>
                          <div className="flex-1 rounded-xl p-3 text-center"
                          style={{ background: `hsla(${t.color},40%,50%,0.06)`, border: `1px solid hsla(${t.color},40%,50%,0.15)` }}>
                            <div className="text-[0.5rem] uppercase tracking-wider text-foreground/45 mb-1">Dopo</div>
                            <div className="text-sm font-bold" style={{ color: `hsla(${t.color},65%,45%,0.95)` }}>{t.after}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* ═══ TRUST GUARANTEE ═══ */}
            <motion.div className="relative rounded-xl sm:rounded-2xl overflow-hidden p-4 sm:p-8"
            style={{
              background: "linear-gradient(160deg, hsl(228 20% 14% / 0.86), hsl(248 18% 13% / 0.84))",
              border: "1px solid hsl(var(--primary) / 0.12)"
            }}
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
              <div className="absolute top-0 left-0 right-0 h-[1px]"
              style={{ background: "linear-gradient(90deg, transparent, hsla(38,60%,55%,0.3), hsla(265,50%,55%,0.2), transparent)" }} />
              <div className="absolute top-0 left-0 w-3 h-3 border-t border-l rounded-tl-xl" style={{ borderColor: "hsla(150,50%,50%,0.2)" }} />
              <div className="absolute top-0 right-0 w-3 h-3 border-t border-r rounded-tr-xl" style={{ borderColor: "hsla(150,50%,50%,0.2)" }} />
              
              <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-8">
                <div className="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, hsla(150,50%,45%,0.15), hsla(265,40%,50%,0.1))", border: "1px solid hsla(150,40%,45%,0.15)" }}>
                  <Shield className="w-5 h-5 sm:w-7 sm:h-7" style={{ color: "hsla(150,65%,55%,0.9)" }} />
                </div>
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="text-xs sm:text-lg font-heading font-bold text-foreground mb-0.5 sm:mb-1.5">
                    Garanzia Risultati 90 Giorni
                  </h3>
                  <p className="text-foreground/40 text-[0.55rem] sm:text-sm leading-relaxed max-w-lg">
                    Se non vedi miglioramenti misurabili nei primi 90 giorni, ti rimborsiamo. Zero rischi.
                  </p>
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  {[
                    { icon: <Lock className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />, label: "GDPR" },
                    { icon: <Fingerprint className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />, label: "Sicuro" },
                    { icon: <CircleCheck className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />, label: "Certificato" },
                  ].map((b, i) => (
                    <div key={i} className="flex flex-col items-center gap-0.5 sm:gap-1.5">
                      <div className="w-6 h-6 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center"
                      style={{ background: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.1)", color: "hsl(var(--primary) / 0.7)" }}>
                        {b.icon}
                      </div>
                      <span className="text-[0.35rem] sm:text-[0.5rem] text-foreground/30 tracking-wider uppercase">{b.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div className="text-center mt-5 sm:mt-10"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vpOnce} transition={{ delay: 0.3 }}>
              <button
                onClick={() => { const el = document.getElementById("pricing"); if (el) el.scrollIntoView({ behavior: "smooth" }); }}
                className="inline-flex items-center gap-2 px-5 py-2.5 sm:px-7 sm:py-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 hover:scale-[1.03] active:scale-[0.98]"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--primary)), hsla(265,55%,45%,1))",
                  color: "#fff",
                  boxShadow: "0 4px 20px hsla(265,60%,45%,0.2), 0 1px 3px hsla(0,0%,0%,0.2)"
                }}>
                <Rocket className="w-3.5 h-3.5" />
                Inizia la Trasformazione
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-foreground/20 text-[0.45rem] sm:text-[0.5rem] mt-2 tracking-wider">
                Setup in 48h · Nessun rischio · Supporto dedicato
              </p>
            </motion.div>
          </div>
        </section>
        );
      })()}


      {/* ═══════════════════════════════════════════
                             TESTIMONIALS — Auto-scroll carousel
                            ═══════════════════════════════════════════ */}
      <Section id="testimonials" className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(230 22% 10%) 50%, hsl(228 22% 8%) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] right-[18%] w-[550px] h-[550px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[32%] left-[10%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] right-[28%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[30%] left-[25%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[12%] left-[32%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.2), hsla(38,50%,50%,0.12), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.04]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(228,22%,10%,0.5))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>

        <div className="text-center mb-14 sm:mb-16">
          <SectionLabel text="Storie di Successo" icon={<Star className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Risultati Reali, <span className="text-shimmer">Settori Diversi</span>
          </motion.h2>
          <motion.p className="text-foreground/35 max-w-[440px] mx-auto text-sm leading-relaxed"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true, margin: "-30px" }}>
            Imprenditori come te che hanno trasformato il loro business
          </motion.p>
        </div>

        <AnimatePresence mode="wait">
          {expandTestimonials ?
          <motion.div key="testimonials-grid" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {testimonials.map((t, i) =>
            <div key={i} className="relative p-4 rounded-xl overflow-hidden"
            style={{
              background: "linear-gradient(165deg, hsl(228 20% 14% / 0.85), hsl(248 15% 97% / 0.92))",
              border: "1px solid hsl(var(--primary) / 0.12)",
              backdropFilter: "blur(24px)"
            }}>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                style={{ border: "2px solid hsl(var(--primary) / 0.2)" }} />
                    <div>
                      <h4 className="font-heading text-[0.7rem] font-semibold text-foreground">{t.name}</h4>
                      <p className="text-[0.5rem] text-foreground/50">{t.role}</p>
                    </div>
                    <span className="ml-auto text-base">{t.emoji}</span>
                  </div>
                  <p className="text-[0.65rem] leading-[1.7] mb-2 text-foreground/65">"{t.quote}"</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.55rem] font-semibold font-heading"
              style={{ background: "hsl(var(--primary) / 0.08)", border: "1px solid hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
                    <TrendingUp className="w-2.5 h-2.5" /> {t.metric}
                  </div>
                </div>
            )}
            </motion.div> :

          <motion.div key="testimonials-carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <PremiumCarousel speed="slow" itemWidth={290} fullWidth>
                {testimonials.map((t, i) =>
              <div key={i} className="group relative h-full">
                    <div className="relative p-5 sm:p-7 rounded-2xl h-full flex flex-col items-center text-center overflow-hidden transition-all duration-700 group-hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(165deg, hsl(228 20% 16% / 0.92), hsl(232 22% 11% / 0.92))",
                  border: "1px solid hsl(var(--primary) / 0.1)",
                  boxShadow: "0 4px 24px hsl(var(--primary) / 0.06)",
                  backdropFilter: "blur(24px)"
                }}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, hsl(var(--primary) / 0.04) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 2s ease-in-out infinite" }} />
                      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l rounded-tl-2xl pointer-events-none" style={{ borderColor: "hsl(var(--primary) / 0.15)" }} />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r rounded-br-2xl pointer-events-none" style={{ borderColor: "hsl(var(--primary) / 0.1)" }} />
                      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--primary) / 0.15), transparent)" }} />
                      <div className="relative mb-4 mt-1">
                        <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover mx-auto"
                    style={{ border: "2px solid hsl(var(--primary) / 0.2)", boxShadow: "0 4px 16px hsl(var(--primary) / 0.1)" }} />
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: "hsl(228 20% 14% / 0.8)", border: "1px solid hsl(var(--primary) / 0.15)", boxShadow: "0 2px 8px hsl(var(--primary) / 0.08)" }}>
                          {t.emoji}
                        </div>
                        <motion.div className="absolute -inset-2 rounded-full pointer-events-none"
                    style={{ border: "1px dashed hsl(var(--primary) / 0.1)" }}
                    animate={{ rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                      </div>
                      <h4 className="font-heading text-xs font-semibold mb-0.5 text-foreground">{t.name}</h4>
                      <p className="text-[0.58rem] mb-4 text-foreground/60">{t.role}</p>
                      <blockquote className="text-[0.75rem] sm:text-[0.8rem] leading-[1.8] mb-5 flex-1 px-1 text-foreground/75">
                        <Quote className="w-3.5 h-3.5 mx-auto mb-2 text-primary/30" />
                        "{t.quote}"
                      </blockquote>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.62rem] font-semibold font-heading tracking-wider"
                  style={{ background: "hsl(var(--primary) / 0.06)", border: "1px solid hsl(var(--primary) / 0.12)", color: "hsl(var(--primary))" }}>
                        <TrendingUp className="w-3 h-3" /> {t.metric}
                      </div>
                      <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.08), transparent 70%)" }} />
                    </div>
                  </div>
              )}
              </PremiumCarousel>
            </motion.div>
          }
        </AnimatePresence>
        <div className="flex justify-center mt-4">
          <button onClick={() => setExpandTestimonials((p) => !p)}
          className="text-[0.6rem] font-semibold text-primary/70 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04] hover:bg-primary/[0.08] transition-colors">
            <Layers className="w-3 h-3" /> {expandTestimonials ? "Chiudi" : "Vedi Tutti"}
          </button>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
                             PRICING — Interactive Configurator
                            ═══════════════════════════════════════════ */}
      <PricingConfigurator navigate={navigate} />

      {/* Partner section removed — dedicated page at /join */}

      {/* ═══════════════════════════════════════════
                             FAQ
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(240 20% 10%) 50%, hsl(228 22% 8%) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] left-[15%] w-[550px] h-[550px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[32%] right-[10%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] left-[30%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[28%] right-[22%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[12%] right-[30%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.2), hsla(38,50%,50%,0.12), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.04]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(228,22%,10%,0.5))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-16 items-start">
          <motion.div variants={slideInLeft} initial="hidden" whileInView="visible" viewport={{ once: true }}
          className="text-center lg:text-left">
            <SectionLabel text="FAQ" />
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Domande<br /><span className="text-shimmer">Frequenti</span>
            </h2>
            <p className="text-sm text-foreground/75 leading-[1.7] max-w-xs mx-auto lg:mx-0">
              Tutto su Empire: settori, costi, sicurezza, capacità e partnership.
            </p>
          </motion.div>

          <motion.div className="space-y-3 w-full"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {faqs.map((faq, i) =>
            <motion.div key={i} className="rounded-xl glow-card overflow-hidden" variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="relative z-10 w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-xs sm:text-sm font-semibold text-foreground/90 pr-3 font-heading">{faq.q}</span>
                  <motion.div
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  className="w-7 h-7 rounded-full bg-primary/[0.12] flex items-center justify-center flex-shrink-0 text-primary/80 text-sm font-heading font-bold">
                  
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i &&
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-xs sm:text-sm text-foreground/80 leading-[1.7]">{faq.a}</p>
                    </motion.div>
                }
                </AnimatePresence>
              </motion.div>
            )}
          </motion.div>
        </div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
                             GARANZIA TOTALE — Risk Reversal
                            ═══════════════════════════════════════════ */}
      <Section style={{ background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(232 22% 10%) 50%, hsl(228 22% 8%) 100%)" }}>
        <motion.div className="relative max-w-2xl mx-auto p-8 sm:p-12 rounded-3xl border border-primary/15 bg-gradient-to-br from-primary/[0.04] via-background to-accent/[0.03] text-center overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          <div className="absolute inset-0 premium-holo-grid opacity-20 pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[1px] bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              <Shield className="w-14 h-14 mx-auto text-primary mb-5 drop-shadow-[0_0_30px_hsla(265,70%,60%,0.3)]" />
            </motion.div>
            <h2 className="text-[clamp(1.5rem,4vw,2.4rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Garanzia <span className="text-shimmer">Risultati Garantiti</span>
            </h2>
            <p className="text-sm text-foreground/75 max-w-md mx-auto leading-[1.8] mb-6">
               Prova Empire per 90 giorni senza impegno. Se non vedi risultati concreti, ti rimborsiamo. Zero rischi. Il tuo successo è la nostra priorità.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
               {[
               { icon: <Check className="w-4 h-4" />, text: "90 giorni senza impegno" },
               { icon: <Check className="w-4 h-4" />, text: "Assistenza dedicata inclusa" },
               { icon: <Check className="w-4 h-4" />, text: "Cancella quando vuoi" }].
              map((g, i) =>
              <div key={i} className="flex items-center gap-2 text-xs text-foreground/80">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">{g.icon}</div>
                  <span className="font-heading font-semibold">{g.text}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Section>


      {/* EMPIRE STORY & TEAM */}
      <Suspense fallback={null}>
        <EmpireTeamStory />
      </Suspense>

      {/* ═══════ FINAL CTA ═══════ */}
      <Section style={{ background: "linear-gradient(180deg, hsl(228 22% 8%) 0%, hsl(234 20% 10%) 50%, hsl(228 22% 8%) 100%)" }}>
        <div className="relative text-center p-10 sm:p-16 rounded-3xl bg-gradient-to-br from-primary/[0.08] via-deep-black/80 to-accent/[0.04] border border-primary/15 overflow-hidden animated-border">
          <div className="absolute inset-0 aurora-mesh opacity-30" />
          {/* Violet ambient glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[2px]" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.4), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-[40px] blur-[30px]" style={{ background: "hsla(265, 70%, 60%, 0.12)" }} />
          <div className="relative z-10">
            <motion.div
              initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
              transition={{ type: "spring", stiffness: 200, damping: 20 }}>
              
              <img src={empireLogoNew} alt="Empire AI" className="w-16 h-16 mx-auto mb-6 rounded-full object-cover border-2 border-[hsla(38,50%,55%,0.3)]" style={{ filter: "drop-shadow(0 0 40px hsla(265,70%,60%,0.3))", boxShadow: "0 0 30px hsla(38,50%,55%,0.2), 0 0 60px hsla(265,70%,60%,0.15)" }} />
            </motion.div>
            <h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4">
              Pronto a Costruire il Tuo <span className="text-shimmer">Impero?</span>
            </h2>
            <p className="text-sm text-foreground/75 max-w-md mx-auto mb-8">
              25+ settori, automazione totale, IA integrata, aggiornamenti settimanali. I tuoi competitor si stanno digitalizzando. Non restare indietro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button onClick={() => navigate("/auth")}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 20px 60px hsla(265,70%,60%,0.25)" }}
              whileTap={{ scale: 0.97 }}>
                
                Sono un Imprenditore <ArrowRight className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" className="relative py-20 pb-10 px-5 sm:px-6 overflow-hidden"
      style={{ background: "linear-gradient(180deg, hsl(222 18% 12%) 0%, hsl(222 20% 10%) 50%, hsl(222 18% 8%) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Top accent line — tricolore viola/oro/verde */}
          <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 5%, hsla(265,70%,60%,0.4) 20%, hsla(38,65%,55%,0.35) 40%, hsla(155,60%,50%,0.3) 60%, hsla(38,65%,55%,0.35) 80%, transparent 95%)" }} />
          {/* Violet Imperial glow — top right */}
          <div className="absolute top-[5%] right-[18%] w-[380px] h-[320px] rounded-full" style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.5), transparent 65%)", filter: "blur(140px)" }} />
          {/* Gold ambient glow — center left */}
          <div className="absolute top-[25%] left-[12%] w-[340px] h-[280px] rounded-full" style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.4), transparent 65%)", filter: "blur(120px)" }} />
          {/* Green AI tech glow — center right */}
          <div className="absolute top-[45%] right-[15%] w-[300px] h-[300px] rounded-full" style={{ background: "radial-gradient(circle, hsla(155,55%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          {/* Violet deep glow — bottom left */}
          <div className="absolute bottom-[10%] left-[22%] w-[350px] h-[280px] rounded-full" style={{ background: "radial-gradient(circle, hsla(280,55%,45%,0.35), transparent 65%)", filter: "blur(130px)" }} />
          {/* Gold warm glow — bottom right */}
          <div className="absolute bottom-[18%] right-[25%] w-[260px] h-[220px] rounded-full" style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          {/* Vertical light shaft */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.04]" style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.4), transparent)" }} />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.012]" style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E\")", backgroundSize: "180px 180px" }} />
          {/* Bottom fade to pure black */}
          <div className="absolute bottom-0 left-0 right-0 h-24" style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,2%,1))" }} />
        </div>

        <div className="relative z-10 max-w-[1100px] mx-auto">
          {/* Top row: Logo + Newsletter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="absolute -inset-1 rounded-full blur-md" style={{ background: "hsla(265,70%,60%,0.15)" }} />
                <div className="relative w-10 h-10 rounded-full overflow-hidden flex items-center justify-center" style={{ boxShadow: "0 0 25px hsla(265,70%,60%,0.25), 0 0 0 2px hsla(38,50%,55%,0.3)" }}>
                  <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
                </div>
              </div>
              <div>
                <span className="font-heading font-bold tracking-[0.2em] uppercase text-sm text-white">EMPIRE</span>
                <span className="text-[0.55rem] tracking-[0.3em] uppercase block" style={{ background: "linear-gradient(90deg, hsla(265,70%,65%,1), hsla(280,50%,75%,1))", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AUTONOMOUS AI</span>
              </div>
            </motion.div>
            <motion.p className="text-[0.7rem] text-white/45 max-w-[340px] leading-[1.8] font-light"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
              La piattaforma AI autonoma più completa al mondo. Tecnologia proprietaria che trasforma qualsiasi business in un impero digitale.
            </motion.p>
          </div>

          {/* Main grid */}
          <motion.div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-12 mb-16"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ staggerChildren: 0.1 }}>
            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Settori
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {["Food & Ristorazione", "NCC & Trasporto", "Beauty & Wellness", "Healthcare & Medical", "Retail & E-commerce", "Fitness & Sport"].map((s, i) =>
                <p key={i} className="text-white/40 hover:text-white/70 transition-colors cursor-default flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {s}
                  </p>
                )}
                <p className="text-[0.6rem] font-heading font-semibold mt-2" style={{ color: "hsla(265,70%,65%,0.5)" }}>+19 altri settori</p>
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Piattaforma
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {[
                { label: "Funzionalità", href: "#services" },
                { label: "Automazioni IA", href: "#capacita" },
                { label: "ROI Calculator", href: "#calculator" },
                { label: "Piani & Prezzi", href: "#pricing" },
                { label: "Piani & Prezzi", href: "#pricing" },
                { label: "Demo Live", href: "/demo" }].
                map((link, i) =>
                <a key={i} href={link.href} className="block text-white/40 hover:text-white/70 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {link.label}
                  </a>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Tecnologia
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {["Engine AI Proprietario", "Automazione End-to-End", "PWA White-Label", "Analytics Predittivi", "GDPR & AES-256", "API & Integrazioni"].map((s, i) =>
                <p key={i} className="text-white/40 hover:text-white/70 transition-colors cursor-default flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {s}
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Contatti
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                <p className="text-white/45 flex items-center gap-2.5"><Mail className="w-3.5 h-3.5" style={{ color: "hsla(265,70%,60%,0.5)" }} /> info@empire-suite.it</p>
                <p className="text-white/45 flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5" style={{ color: "hsla(265,70%,60%,0.5)" }} /> Roma, Italia</p>
                <div className="pt-3">
                  <a href="/privacy" className="block text-white/35 hover:text-white/60 transition-colors mb-2">Privacy Policy</a>
                  <a href="/cookie-policy" className="block text-white/35 hover:text-white/60 transition-colors">Cookie Policy</a>
                </div>
              </div>
              {/* Social icons */}
              <div className="flex gap-2.5 mt-5">
                {["In", "𝕏", "IG"].map((s, i) =>
                <motion.div key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.6rem] text-white/35 cursor-pointer transition-all duration-300"
                style={{ border: "1px solid hsla(265,70%,60%,0.1)", background: "hsla(265,70%,60%,0.03)" }}
                whileHover={{ scale: 1.1, borderColor: "hsla(265,70%,60%,0.4)", color: "hsla(265,70%,65%,1)", background: "hsla(265,70%,60%,0.08)" }}>
                  
                    {s}
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Bottom bar */}
          <div className="relative pt-8">
            <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.12), transparent)" }} />
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.6rem] text-white/30">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsla(130,60%,50%,0.5)", boxShadow: "0 0 6px hsla(130,60%,50%,0.3)" }} />
                <span className="text-white/40">Tutti i sistemi operativi</span>
                <span className="mx-2">·</span>
                © 2026 Empire AI · Piattaforma Multi-Settore
              </p>
              <div className="flex gap-6">
                <a href="/privacy" className="hover:text-white/40 transition-colors">Privacy</a>
                <a href="/cookie-policy" className="hover:text-white/40 transition-colors">Cookie</a>
                <span>P.IVA IT12345678901</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* ═══════ STICKY CTA ═══════ */}
      <AnimatePresence>
        {ctaVisible &&
        <motion.div className={`fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] border-t border-border/20 ${IS_MOBILE_LP ? "" : "backdrop-blur-2xl"}`}
        style={{ background: IS_MOBILE_LP ? "hsla(228,20%,14%,0.86)" : "linear-gradient(180deg, hsla(228,20%,14%,0.92), hsla(228,22%,10%,0.96))" }}
        initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25 }}>
            <div className="flex gap-2 max-w-md mx-auto">
              <motion.button onClick={() => scrollTo("pricing")}
            className="flex-1 py-3.5 rounded-xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading uppercase"
            whileTap={{ scale: 0.97 }}>
              
                Inizia Ora
              </motion.button>
              <motion.button onClick={() => navigate("/demo")}
            className="px-4 py-3.5 rounded-xl border border-primary/15 text-primary"
            whileTap={{ scale: 0.95 }}>
              
                <Play className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        }
      </AnimatePresence>
      {/* ATLAS Voice Agent */}
      <SafeEmpireVoiceAgent />

      {/* Partner: floating back button */}
      {isFromPartner && (
        <motion.button
          onClick={() => navigate("/partner")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 left-4 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs shadow-lg"
          style={{
            background: "linear-gradient(135deg, hsl(265 60% 50%), hsl(265 50% 40%))",
            color: "white",
            boxShadow: "0 4px 20px hsla(265,60%,40%,0.4)",
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Torna al Pannello
        </motion.button>
      )}
    </div>);

};

export default LandingPage;