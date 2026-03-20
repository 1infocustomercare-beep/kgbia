import React, { useState, useEffect, useRef, forwardRef, useMemo, useCallback, lazy, Suspense } from "react";
import InteractiveParticleSphere from "@/components/public/InteractiveParticleSphere";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import FunnelDNAVisual from "@/components/public/FunnelDNAVisual";

import { PremiumCarousel } from "@/components/public/PremiumCarousel";
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
import { useNavigate } from "react-router-dom";
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

/** Section backgrounds — nearly opaque for a solid premium feel with minimal DNA bleed. */
const mobilifyBg = (style?: React.CSSProperties): React.CSSProperties | undefined => {
  if (!style || !style.background || typeof style.background !== "string") return style;
  const bg = style.background.replace(
    /hsla\(([^,]+,[^,]+,[^,]+),\s*([\d.]+)\)/g,
    (_, inner, alpha) => {
      const a = parseFloat(alpha);
      // High-opacity sections — solid, luxurious, minimal transparency
      const newAlpha = a >= 1 ? 0.99 : Math.min(Math.max(a, 0.97), 0.99);
      return `hsla(${inner},${newAlpha})`;
    }
  );
  return { ...style, background: bg };
};

const Section = forwardRef<HTMLElement, {id?: string;children: React.ReactNode;className?: string;style?: React.CSSProperties;}>(
  ({ id, children, className = "", style }, ref) =>
  <section ref={ref} id={id} className={`relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden ${className}`} style={mobilifyBg(style)}>
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
    
      <div className="relative flex items-center gap-2 px-4 py-2 rounded-full premium-label overflow-hidden" style={{ borderLeft: "1px solid hsla(35,45%,50%,0.15)" }}>
        {/* Scanning beam — gold tint */}
        <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(90deg, transparent 30%, hsla(35,45%,55%,0.12) 50%, transparent 70%)" }}
        animate={{ x: ["-150%", "250%"] }}
        transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }} />
      
        {icon || <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(35,45%,50%)" }} animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />}
        <span className="text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase text-primary/90 relative z-10">{text}</span>
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
          <p className="text-[0.52rem] text-foreground/45 truncate">{item.action}</p>
        </div>
        <span className="text-[0.42rem] text-foreground/25 whitespace-nowrap flex-shrink-0 font-mono">{item.time}</span>
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
            <p className="text-[0.52rem] text-foreground/45 truncate">{item.action}</p>
          </div>
          <span className="text-[0.42rem] text-foreground/25 whitespace-nowrap flex-shrink-0 font-mono">{item.time}</span>
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
      style={{ opacity: 0.7, willChange: "transform", transform: "translateZ(0)" }}
      initial={{ opacity: 0 }}
      animate={born ? { opacity: 0.7 } : { opacity: 0 }}
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
              <path d="M30 0 L60 15 L60 37 L30 52 L0 37 L0 15 Z" fill="none" stroke="hsl(215 45% 55%)" strokeWidth="0.35" />
              <circle cx="30" cy="0" r="1" fill="hsl(215 45% 55%)" opacity="0.5" />
              <circle cx="60" cy="15" r="1" fill="hsl(215 45% 55%)" opacity="0.5" />
              <circle cx="0" cy="15" r="1" fill="hsl(215 45% 55%)" opacity="0.5" />
              <circle cx="30" cy="52" r="1" fill="hsl(215 45% 55%)" opacity="0.5" />
            </pattern>
            <pattern id="bg-micro-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <path d="M 24 0 L 0 0 0 24" fill="none" stroke="hsl(215 35% 50%)" strokeWidth="0.12" opacity="0.35" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#bg-circuit-hex)" />
          <rect width="100%" height="100%" fill="url(#bg-micro-grid)" opacity="0.25" />
        </svg>
      }

      {/* ═══ VERTICAL DATA STREAMS ═══ */}
      {!isMobile && [8, 25, 42, 58, 75, 92].map((x, i) =>
      <div key={`vstream-${i}`} className="absolute top-0 bottom-0 w-px" style={{ left: `${x}%`, background: `hsla(215,35%,50%,0.03)` }}>
          <motion.div className="absolute w-full left-0 rounded-full"
        style={{ height: "100px", background: `linear-gradient(180deg, transparent, hsla(210,55%,62%,0.25), transparent)` }}
        animate={{ top: ["-10%", "110%"] }}
        transition={{ duration: 10 + i * 2.5, repeat: Infinity, ease: "linear", delay: i * 1.8 }} />
        </div>
      )}

      {/* ═══ HORIZONTAL SCAN LINES ═══ */}
      {!isMobile && [0, 1].map((i) =>
      <motion.div key={`hscan-${i}`} className="absolute left-0 right-0 h-px"
      style={{ background: `linear-gradient(90deg, transparent 5%, hsla(210,45%,58%,0.08) 30%, hsla(215,50%,65%,0.14) 50%, hsla(210,45%,58%,0.08) 70%, transparent 95%)` }}
      animate={{ top: ["-3%", "103%"] }}
      transition={{ duration: 18 + i * 7, repeat: Infinity, ease: "linear", delay: i * 5 }} />
      )}

      {/* ═══ PULSING TECH NODES ═══ */}
      {!isMobile && [
      { x: 8, y: 18 }, { x: 25, y: 40 }, { x: 42, y: 12 }, { x: 58, y: 60 },
      { x: 75, y: 30 }, { x: 92, y: 55 }, { x: 35, y: 80 }, { x: 65, y: 90 }].
      map((pos, i) =>
      <motion.div key={`tnode-${i}`} className="absolute w-1 h-1 rounded-full"
      style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: `hsla(210,55%,62%,0.25)`, boxShadow: `0 0 8px hsla(210,55%,62%,0.15)` }}
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
          stroke={i % 6 === 0 ? "hsla(38,50%,55%,0.25)" : "hsla(220,15%,55%,0.12)"}
          strokeWidth="0.2" />

        ) :

        connections.map(({ a, b }, i) =>
        <motion.line
          key={`ln${i}`}
          x1={cells[a].x} y1={cells[a].y}
          x2={cells[b].x} y2={cells[b].y}
          stroke={i % 6 === 0 ? "hsla(38,50%,55%,0.35)" : "hsla(220,15%,55%,0.18)"}
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
          fill="hsla(38,45%,55%,0.3)" />

        ) :

        cells.filter((_, i) => i % 2 === 0).map((cell) =>
        <motion.circle
          key={`node${cell.id}`}
          cx={cell.x} cy={cell.y}
          r="0.25"
          fill="hsla(38,45%,55%,0.35)"
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
    <motion.div className="relative group/icon" whileHover={isMobileDevice ? undefined : { scale: 1.15, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {/* Main container — no animated rings on mobile */}
      <div className={`relative ${sizeClasses} bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg overflow-hidden`}
      style={{ boxShadow: "0 6px 24px hsla(38,50%,50%,0.2), 0 0 0 1px hsla(38,45%,55%,0.1), inset 0 1px 1px rgba(255,255,255,0.2)" }}>
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>);

};

/* ═══ Premium Animated Card ═══ */
const PremiumCard = ({ children, className = "", hover = true, glow = false, scan = false, delay = 0 }: {children: React.ReactNode;className?: string;hover?: boolean;glow?: boolean;scan?: boolean;delay?: number;}) => {
  const isMobileDevice = typeof window !== "undefined" && (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

  return (
    <motion.div
      className={`relative rounded-2xl border overflow-hidden group/card premium-card-glass premium-card-hover ${className}`}
      style={{
        background: "linear-gradient(145deg, hsla(230,12%,11%,0.98), hsla(230,10%,7%,0.99))",
        backdropFilter: isMobileDevice ? undefined : "blur(20px) saturate(1.4)",
        borderColor: "hsla(38,40%,55%,0.18)",
        boxShadow: "0 2px 24px hsla(0,0%,0%,0.4), 0 0 0 1px hsla(38,45%,50%,0.06)"
      }}
      whileHover={hover && !isMobileDevice ? {
        y: -6,
        borderColor: "hsla(38,45%,55%,0.25)",
        boxShadow: "0 20px 60px hsla(38,45%,50%,0.1), 0 0 30px hsla(38,45%,50%,0.05), inset 0 1px 0 hsla(38,50%,70%,0.08)",
        transition: { duration: 0.4, ease: "easeOut" }
      } : undefined}>
      
    {/* Top accent line — static on mobile */}
    <div className="absolute top-0 left-0 right-0 h-px z-10"
      style={{ background: "linear-gradient(90deg, transparent, hsla(35,45%,55%,0.2), hsla(38,50%,60%,0.2), hsla(35,45%,55%,0.15), transparent)" }} />
      
    {/* Corner accents */}
    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l rounded-tl-sm pointer-events-none opacity-20" style={{ borderColor: "hsla(35,45%,55%,0.35)" }} />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r rounded-br-sm pointer-events-none opacity-20" style={{ borderColor: "hsla(35,45%,55%,0.35)" }} />
    {/* Inner glass reflection */}
    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsla(38,30%,70%,0.03) 0%, transparent 40%)" }} />
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
    <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, hsla(35,45%,50%,0.10) 15%, hsla(38,45%,52%,0.18) 35%, hsla(35,45%,50%,0.25) 50%, hsla(38,45%,52%,0.18) 65%, hsla(35,45%,50%,0.10) 85%, transparent 100%)" }} />
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
      background: "linear-gradient(180deg, hsla(0,0%,4%,0.96) 0%, hsla(0,0%,5%,0.94) 30%, hsla(38,22%,10%,0.94) 55%, hsla(0,0%,5%,0.94) 80%, hsla(0,0%,4%,0.96) 100%)"
    }}>
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[5%] left-1/2 -translate-x-1/2 w-[650px] h-[450px] rounded-full opacity-[0.06]"
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[95px] opacity-[0.06]"
        style={{ background: "linear-gradient(180deg, hsla(38,55%,50%,0.4), transparent)" }} />
        <div className="absolute bottom-0 left-0 right-0 h-[70px]"
        style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
        <div className="absolute inset-0 opacity-[0.012]" style={{
          backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
          backgroundRepeat: "repeat", backgroundSize: "128px 128px"
        }} />
      </div>
      <div className="text-center mb-8 sm:mb-12">
        <SectionLabel text="Piani & Prezzi" icon={<Gem className="w-3 h-3 text-accent" />} />
        <motion.h2 className="text-[clamp(1.6rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          Scegli Come <span className="text-shimmer">Dominare</span> il Tuo Mercato
        </motion.h2>
        <motion.p className="text-foreground/40 max-w-[440px] mx-auto leading-[1.7] text-xs sm:text-sm"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
          Pacchetto completo o abbonamento flessibile — in entrambi i casi, il tuo business cambia per sempre.
        </motion.p>

        {/* Mode Toggle: Package vs Monthly */}
        <motion.div className="flex items-center justify-center gap-1 mt-6 p-1 rounded-full border border-border/30 max-w-sm mx-auto"
        style={{ background: "linear-gradient(145deg, hsla(0,0%,4%,0.98), hsla(38,18%,8%,0.94))" }}
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
        <motion.div className="max-w-lg mx-auto mt-4" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.55rem] font-heading text-foreground/30 tracking-[2px] uppercase text-center mb-2">Il tuo settore</p>
          <div className="flex flex-wrap justify-center gap-1.5">
            {PRICING_SECTORS.map((s) => {
              const isActive = selectedSector === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => {setSelectedSector(s.id);setSelectedAddons(new Set());}}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-[0.6rem] font-heading font-semibold transition-all border ${
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
          <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
              {sectorFeatures.slice(0, 3).map((f, i) =>
            <span key={i} className="px-2 py-0.5 rounded-full text-[0.5rem] bg-primary/[0.08] text-primary/70 font-medium">{f}</span>
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
              <p className="text-[0.55rem] text-foreground/40"><strong className="text-foreground/60">127+ attività</strong> hanno già scelto Empire questa settimana</p>
            </div>

            {/* Package Cards — mobile conversion-optimized */}
            <div className="sm:hidden space-y-3 mb-5">
              {PACKAGE_TIERS.map((p, idx) => {
              const isSelected = selectedPackage === p.id;
              const isEmpire = p.id === "empire";
              const isGrowth = p.id === "growth";
              const discountPct = Math.round((p.originalPrice - p.price) / p.originalPrice * 100);
              return (
                <motion.div key={p.id}
                onClick={() => setSelectedPackage(p.id)}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className={`relative w-full rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                isEmpire ?
                "border-2 border-accent/50 shadow-[0_0_50px_hsla(35,45%,50%,0.25),0_8px_32px_hsla(0,0%,0%,0.5)] scale-[1.02]" :
                isSelected ?
                "border-2 border-primary/50 shadow-[0_0_30px_hsla(265,50%,55%,0.12)]" :
                "border border-border/30 shadow-[0_4px_20px_hsla(0,0%,0%,0.25)]"}`
                }
                style={{
                  background: isEmpire ?
                  "linear-gradient(165deg, hsla(35,25%,14%,0.94), hsla(230,12%,8%,0.95))" :
                  "linear-gradient(165deg, hsla(230,12%,13%,0.93), hsla(230,10%,9%,0.95))"
                }}
                whileTap={{ scale: 0.985 }}>

                    {/* Top gradient bar */}
                    <div className={`h-[3px] w-full ${isEmpire ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : isGrowth ? "bg-vibrant-gradient" : "bg-gradient-to-r from-primary/60 to-primary/30"}`} />

                    {/* Badge */}
                    {p.badge &&
                  <div className={`absolute top-0 right-0 px-3 py-1.5 rounded-bl-2xl text-[0.55rem] font-bold tracking-[1.5px] font-heading uppercase ${
                  isEmpire ?
                  "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black" :
                  p.badge === "Più Scelto" ? "bg-vibrant-gradient text-primary-foreground" :
                  "bg-gradient-to-r from-accent to-primary text-primary-foreground"}`
                  }>{p.badge}</div>
                  }

                    <div className="p-4">
                      {/* Header row: Name + Discount */}
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="text-[0.55rem] font-heading font-semibold text-foreground/35 tracking-[3px] uppercase">{p.name}</p>
                          <div className="flex items-baseline gap-2 mt-1">
                            <span className="text-[2rem] font-heading font-extrabold text-foreground leading-none">€{p.price.toLocaleString("it-IT")}</span>
                            <div className="flex flex-col">
                              <span className="text-[0.65rem] text-foreground/20 line-through">€{p.originalPrice.toLocaleString("it-IT")}</span>
                              <span className="text-[0.5rem] text-foreground/25">una tantum</span>
                            </div>
                          </div>
                        </div>
                        <motion.div
                        className={`px-2.5 py-2 rounded-xl text-center ${isEmpire ? "bg-accent/15 border border-accent/20" : "bg-primary/10 border border-primary/15"}`}
                        animate={isEmpire ? { scale: [1, 1.05, 1] } : {}}
                        transition={{ duration: 2, repeat: Infinity }}>
                          <span className={`text-xl font-heading font-black ${isEmpire ? "text-accent" : "text-primary"}`}>-{discountPct}%</span>
                        </motion.div>
                      </div>

                      {/* Installment info */}
                      <p className="text-[0.6rem] text-foreground/30">
                        oppure <strong className="text-foreground/50">€{Math.round(p.price / 3)}/mese ×3</strong> (TAN 0%) · oppure €{Math.round(p.price / 6)}/mese ×6
                      </p>

                      {/* Monthly + Commission pills — KEY conversion element */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`flex-1 text-center py-2 rounded-xl text-[0.65rem] font-bold border ${
                      p.monthlyFee === 0 ?
                      "bg-accent/12 text-accent border-accent/25" :
                      "bg-foreground/[0.03] text-foreground/45 border-border/15"}`
                      }>
                          {p.monthlyFee === 0 ? "€0/mese ✓" : `poi €${p.monthlyFee}/mese`}
                        </span>
                        <span className={`flex-1 text-center py-2 rounded-xl text-[0.65rem] font-bold border ${
                      p.commission === "0%" ?
                      "bg-accent/12 text-accent border-accent/25" :
                      "bg-foreground/[0.03] text-foreground/45 border-border/15"}`
                      }>
                          {p.commission === "0%" ? "0% commissioni ✓" : `${p.commission} transazioni`}
                        </span>
                      </div>

                      {/* Empire daily cost nudge */}
                      {isEmpire &&
                    <motion.div
                      className="mt-3 p-3 rounded-xl bg-accent/[0.08] border border-accent/20 text-center"
                      animate={{ boxShadow: ["0 0 0px hsla(35,45%,50%,0)", "0 0 20px hsla(35,45%,50%,0.1)", "0 0 0px hsla(35,45%,50%,0)"] }}
                      transition={{ duration: 3, repeat: Infinity }}>
                          <p className="text-[0.7rem] text-accent font-bold">
                            💰 Solo €11/giorno per 24 mesi
                          </p>
                          <p className="text-[0.5rem] text-accent/50 mt-0.5">Poi è tutto tuo, per sempre. Meno di un caffè al bar.</p>
                        </motion.div>
                    }

                      {/* Tagline */}
                      <p className="text-[0.6rem] text-foreground/30 mt-2.5 leading-relaxed italic">{p.tagline}</p>

                      {/* Features with expand */}
                      <ul className="mt-3 space-y-1.5">
                        {p.features.slice(0, isSelected ? p.features.length : 4).map((f, fi) =>
                      <li key={fi} className="flex items-start gap-2 text-[0.7rem] text-foreground/50">
                            <div className={`w-4.5 h-4.5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                        f.includes("ZERO") || f.includes("0%") ? "bg-accent/20" : "bg-primary/12"}`
                        }>
                              <Check className={`w-2.5 h-2.5 ${
                          f.includes("ZERO") || f.includes("0%") ? "text-accent" : "text-primary"}`
                          } />
                            </div>
                            <span className={`leading-snug ${f.includes("ZERO") || f.includes("0%") ? "font-bold text-accent" : f.startsWith("Tutto") ? "font-semibold text-foreground/60" : ""}`}>{f}</span>
                          </li>
                      )}
                        {!isSelected && p.features.length > 4 &&
                      <li className="text-[0.6rem] text-primary/70 font-semibold pl-6 pt-1 flex items-center gap-1">
                            <ChevronDown className="w-3 h-3" />
                            Vedi +{p.features.length - 4} funzionalità
                          </li>
                      }
                      </ul>

                      {/* Bonus inclusi */}
                      {isSelected &&
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }}
                    className="mt-3 pt-3 border-t border-border/15 overflow-hidden">
                          <p className="text-[0.5rem] font-heading font-bold text-accent/60 tracking-[2px] uppercase mb-1.5">
                            <Gift className="w-3 h-3 inline mr-1" />Bonus inclusi
                          </p>
                          {p.extras.map((e, ei) =>
                      <p key={ei} className="text-[0.6rem] text-foreground/35 flex items-center gap-1.5 mb-0.5">
                              <Star className="w-2.5 h-2.5 text-accent/40 flex-shrink-0" /> {e}
                            </p>
                      )}
                        </motion.div>
                    }

                      {/* Savings bar */}
                      <div className={`mt-3 p-2.5 rounded-xl text-[0.65rem] font-bold text-center ${
                    isEmpire ? "bg-accent/12 text-accent border border-accent/20" : "bg-primary/[0.06] text-primary/70 border border-primary/10"}`
                    }>
                        💸 {p.savings}
                      </div>

                      {/* CTA button per card */}
                      <motion.button
                      onClick={(e) => {e.stopPropagation();setSelectedPackage(p.id);navigate("/admin");}}
                      className={`w-full mt-3 py-3 rounded-xl text-[0.7rem] font-heading font-bold tracking-wider uppercase relative overflow-hidden ${
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
                          {isEmpire ? "👑 Scelgo Empire — Domina Ora" : isGrowth ? "🚀 Scelgo Growth AI" : "Inizia con Digital Start"}
                        </span>
                      </motion.button>

                      {/* Empire upsell on non-empire cards */}
                      {!isEmpire &&
                    <div className="mt-2 p-2 rounded-lg bg-accent/[0.04] border border-accent/10 cursor-pointer" onClick={(e) => {e.stopPropagation();setSelectedPackage("empire");}}>
                          <p className="text-[0.5rem] text-accent/70 text-center">
                            ⚡ Con Empire risparmi <strong>€{p.commission === "2%" ? "6.403" : "4.200"}</strong> in più e hai <strong>0% commissioni per sempre</strong> →
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
                "border-2 border-accent/50 shadow-[0_0_60px_hsla(35,45%,50%,0.18),0_8px_40px_hsla(0,0%,0%,0.5)]" :
                "border-2 border-primary/50 shadow-[0_0_50px_hsla(265,50%,55%,0.14),0_8px_40px_hsla(0,0%,0%,0.4)]" :
                "border border-border/40 hover:border-primary/25 shadow-[0_4px_24px_hsla(0,0%,0%,0.3)]"}`
                }
                style={{
                  background: isSelected ?
                  p.id === "empire" ?
                  "linear-gradient(165deg, hsla(35,22%,14%,0.94), hsla(230,12%,9%,0.95))" :
                  "linear-gradient(165deg, hsla(265,15%,14%,0.93), hsla(230,10%,9%,0.95))" :
                  "linear-gradient(165deg, hsla(230,12%,13%,0.92), hsla(230,10%,10%,0.94))"
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
              pkg.id === "empire" ? "border-accent/25" : "border-primary/20"}`
              }
              style={{
                background:
                pkg.id === "empire" ?
                "linear-gradient(180deg, hsla(0,0%,4%,0.99) 0%, hsla(38,18%,9%,0.95) 45%, hsla(0,0%,4%,0.99) 100%)" :
                "linear-gradient(180deg, hsla(0,0%,4%,0.99) 0%, hsla(38,14%,8%,0.9) 35%, hsla(0,0%,4%,0.99) 100%)"
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
                      <motion.button onClick={() => navigate("/admin")}
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
                              <p className="text-[0.45rem] text-foreground/20 text-center mt-1.5">
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
                          <p className="text-[0.5rem] text-foreground/25">oppure da €{Math.round(p.price / 6)}/mese ×6</p>
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
                        onClick={(e) => {e.stopPropagation();setSelectedPackage(p.id);navigate("/admin");}}
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
                        <p className="text-[0.45rem] text-foreground/25 mt-0.5">oppure da €{Math.round(p.price / 6)}/mese ×6</p>
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
                      onClick={() => {setSelectedPackage(p.id);navigate("/admin");}}
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
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-6" variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
              {PLAN_TIERS.map((p) => {const isSelected = selectedPlan === p.id;const displayPrice = Math.round(p.price * planDiscount);return (
                  <motion.div key={p.id} variants={fadeScale}
                  onClick={() => {setSelectedPlan(p.id);if (p.includedAgents > 0) setShowAddons(true);}}
                  className={`relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                  isSelected ?
                  "border-2 border-primary/40 shadow-[0_0_40px_hsla(38,50%,55%,0.1)]" :
                  "border border-border/30 hover:border-primary/20"}`}
                  style={{
                    background: isSelected ?
                    "linear-gradient(180deg, hsla(0,0%,4%,0.99) 0%, hsla(38,18%,9%,0.92) 40%, hsla(0,0%,4%,0.99) 100%)" :
                    "linear-gradient(180deg, hsla(0,0%,4%,0.97) 0%, hsla(0,0%,5%,0.95) 100%)"
                  }}>
                    {p.badge &&
                    <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[0.5rem] font-bold tracking-[1.5px] font-heading uppercase ${
                    p.badge === "Max Revenue" ? "bg-gradient-to-r from-accent to-primary text-primary-foreground" : "bg-vibrant-gradient text-primary-foreground"}`
                    }>{p.badge}</div>
                    }
                    {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />}

                    <p className="text-[0.6rem] font-heading font-semibold text-foreground/40 tracking-[3px] uppercase">{p.name}</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl sm:text-4xl font-heading font-bold text-foreground">€{displayPrice}</span>
                      <span className="text-xs text-foreground/30">/mese</span>
                    </div>
                    {billingCycle === "annual" &&
                    <p className="text-[0.55rem] text-accent font-semibold mt-0.5">Risparmi €{Math.round(p.price * 12 * 0.2)}/anno</p>
                    }
                    <p className="text-[0.6rem] text-foreground/35 mt-1.5 leading-relaxed">{p.desc}</p>

                    <ul className="mt-4 space-y-2">
                      {p.features.map((f, fi) =>
                      <li key={fi} className="flex items-start gap-2 text-[0.65rem] sm:text-xs text-foreground/50">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-primary/15" : "bg-foreground/[0.05]"}`}>
                            <Check className={`w-2.5 h-2.5 ${isSelected ? "text-primary" : "text-foreground/30"}`} />
                          </div>
                          <span className={f.startsWith("Tutto") ? "font-semibold text-foreground/60" : ""}>{f}</span>
                        </li>
                      )}
                    </ul>

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
                    <p className="text-[0.55rem] text-foreground/35">
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
                              <p className="text-[0.55rem] text-foreground/30 truncate">{addon.desc}</p>
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
                    <p className="text-[0.55rem] font-heading text-foreground/40 tracking-[3px] uppercase mb-1">Il Tuo Piano</p>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl sm:text-4xl font-heading font-bold text-foreground">€{Math.round(totalMonthly)}</span>
                      <span className="text-sm text-foreground/30">/mese</span>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mt-2">
                      <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-primary/10 text-primary font-semibold">{plan.name}</span>
                      {selectedAddons.size > 0 && <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-accent/10 text-accent font-semibold">+{selectedAddons.size} Agenti IA</span>}
                      {savedPerYear > 0 && <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-accent/20 text-accent font-bold">Risparmi €{Math.round(savedPerYear)}/anno</span>}
                    </div>
                    <p className="text-[0.55rem] text-foreground/25 mt-2">+ 2% sulle transazioni · IVA esclusa · Cancella quando vuoi</p>
                  </div>
                  <div className="flex flex-col gap-2 sm:items-end">
                    <motion.button onClick={() => navigate("/admin")}
                  className="px-8 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase whitespace-nowrap"
                  whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(38,50%,55%,0.2)" }}
                  whileTap={{ scale: 0.97 }}>
                      Attiva Ora — Prova Gratis 14gg
                    </motion.button>
                    <p className="text-[0.5rem] text-foreground/20 text-center sm:text-right">Nessuna carta richiesta · Setup in 24h · Assistenza 7/7</p>
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
            <span className="text-primary/50">{b.icon}</span>
            <span className="text-[0.55rem] text-foreground/30 font-medium">{b.text}</span>
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
  <div className={`flex-shrink-0 cursor-pointer ${compact ? "w-[118px]" : "w-[118px]"}`} onClick={() => navigate(item.nav)}>
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
  { id: "food" as const, icon: <ChefHat className="w-5 h-5" />, title: "Food & Ristorazione", desc: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar", gradient: "from-violet-500 to-purple-400", emoji: "🍽️", modules: "Menu Digitale · Ordini · QR · Cucina Live", image: cartoonFood },
  { id: "ncc" as const, icon: <Car className="w-5 h-5" />, title: "NCC & Trasporto", desc: "Noleggio con conducente, transfer, limousine", gradient: "from-purple-500 to-indigo-400", emoji: "🚘", modules: "Flotta · Tratte · Booking · Autisti", image: cartoonNcc },
  { id: "beauty" as const, icon: <Scissors className="w-5 h-5" />, title: "Beauty & Wellness", desc: "Saloni, centri estetici, SPA, barbieri", gradient: "from-fuchsia-500/80 to-violet-400", emoji: "💅", modules: "Agenda · Clienti · Reminder · Trattamenti", image: cartoonBeauty },
  { id: "healthcare" as const, icon: <Heart className="w-5 h-5" />, title: "Healthcare", desc: "Studi medici, dentisti, fisioterapisti", gradient: "from-indigo-400 to-violet-500", emoji: "🏥", modules: "Schede Paziente · Agenda · Fatturazione", image: cartoonHealthcare },
  { id: "retail" as const, icon: <Store className="w-5 h-5" />, title: "Retail & Negozi", desc: "Negozi, boutique, e-commerce locale", gradient: "from-purple-400 to-fuchsia-400/80", emoji: "🛍️", modules: "Catalogo · Inventario · POS · Promozioni", image: cartoonRetail },
  { id: "fitness" as const, icon: <Dumbbell className="w-5 h-5" />, title: "Fitness & Sport", desc: "Palestre, centri sportivi, personal trainer", gradient: "from-violet-400 to-indigo-500", emoji: "💪", modules: "Abbonamenti · Corsi · Check-in · Pagamenti", image: cartoonFitness },
  { id: "hospitality" as const, icon: <Building className="w-5 h-5" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", gradient: "from-purple-500/80 to-violet-400", emoji: "🏨", modules: "Camere · Booking · Ospiti · Concierge", image: cartoonHotel }];


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
  { icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, title: "AI Business Engine", desc: "L'IA analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni quotidiane.", tag: "IA", color: "from-primary to-accent" },
  { icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />, title: "App White Label", desc: "App professionale installabile con il TUO brand, colori e dominio. Nessun logo di terzi, mai.", tag: "APP", color: "from-violet-500 to-primary" },
  { icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini, prenotazioni corse o camere da un unico pannello centralizzato.", tag: "OPS", color: "from-indigo-400 to-violet-500" },
  { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Review Shield™", desc: "Le recensioni negative restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione online.", tag: "BRAND", color: "from-purple-400 to-violet-500" },
  { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, title: "CRM & Fidelizzazione", desc: "Storico acquisti, preferenze, wallet fedeltà digitale. Trasforma i visitatori in clienti ricorrenti.", tag: "GROWTH", color: "from-fuchsia-500/80 to-purple-500" },
  { icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, performance staff, trend e fatturazione elettronica integrata.", tag: "FINANCE", color: "from-indigo-500 to-violet-400" },
  { icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Inventario & HACCP", desc: "Monitora scorte, ricevi alert automatici, registra controlli igienico-sanitari e conformità.", tag: "OPS", color: "from-purple-500 to-primary" },
  { icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Marketing Automation", desc: "Push notification, campagne email/WhatsApp, promozioni mirate e segmentazione clienti avanzata.", tag: "MARKETING", color: "from-accent to-violet-500" },
  { icon: <Lock className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici, accessi multi-ruolo e audit trail.", tag: "SECURITY", color: "from-violet-400/60 to-indigo-400/60" }];


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
  { href: "#pricing", label: "Prezzi" },
  { href: "#partner", label: "Partner" }];


  const whyUs = [
  { icon: <Cpu className="w-5 h-5" />, title: "Tecnologia Proprietaria", desc: "Stack tecnologico sviluppato internamente. Non rivendiamo software altrui." },
  { icon: <Workflow className="w-5 h-5" />, title: "Automazione Totale", desc: "Ogni processo ripetitivo viene eliminato. Dal primo contatto alla fatturazione." },
  { icon: <Gauge className="w-5 h-5" />, title: "Performance Garantite", desc: "99.9% uptime, <200ms latenza, scaling automatico fino a milioni di utenti." },
  { icon: <ServerCog className="w-5 h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Il tuo sistema non invecchia mai." },
  { icon: <Database className="w-5 h-5" />, title: "I Tuoi Dati, Per Sempre", desc: "Proprietà totale dei dati. Esporta tutto in qualsiasi momento. Zero lock-in." },
  { icon: <Headphones className="w-5 h-5" />, title: "Supporto Dedicato", desc: "Team italiano disponibile 7/7. Non un chatbot, persone vere che risolvono." }];


  return (
    <div
      className="min-h-screen overflow-x-hidden relative landing-noise-off"
      style={{ background: "linear-gradient(180deg, hsl(var(--deep-black)) 0%, hsl(var(--deep-black)) 100%)" }}>
      

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
            className="relative px-5 py-2.5 text-[0.68rem] font-medium text-foreground/40 hover:text-foreground transition-all duration-500 tracking-[0.18em] uppercase group rounded-xl"
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
              className="relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center overflow-hidden"
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
            className="relative px-5 py-2.5 text-[0.68rem] font-medium text-foreground/40 hover:text-foreground transition-all duration-500 tracking-[0.18em] uppercase group rounded-xl"
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

            {/* Premium CTA button — diamond-cut with holographic glow */}
            <motion.button
              onClick={() => scrollTo("contact")}
              className="ml-5 px-8 py-3 rounded-full text-primary-foreground text-[0.65rem] font-bold font-heading tracking-[0.22em] uppercase relative overflow-hidden group"
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
              className="w-full text-center py-3.5 text-xs font-medium text-foreground/45 hover:text-foreground hover:bg-primary/[0.08] rounded-xl transition-all font-heading tracking-[0.2em] uppercase relative group">
                    {link.label}
                    {/* Active indicator — glowing dot */}
                    <motion.div
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100"
                  style={{ background: "hsla(38,55%,55%,0.8)", boxShadow: "0 0 8px hsla(38,55%,55%,0.5)" }}
                  transition={{ duration: 0.3 }} />
                
                  </motion.a>
              )}
                <motion.button onClick={() => {scrollTo("contact");setMobileMenuOpen(false);}}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.35, type: "spring", damping: 18 }}
              className="mt-4 w-full py-3.5 rounded-xl text-primary-foreground text-xs font-bold tracking-[0.2em] uppercase font-heading relative overflow-hidden"
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
                    Inizia Ora
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
       <motion.section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-5 sm:px-6 pt-28 sm:pt-28 pb-20 sm:pb-16"
      style={IS_MOBILE_LP ? undefined : { opacity: heroOpacity }}>

        {/* ═══ LAYER 0: Cinematic video background ═══ */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload={IS_MOBILE_LP ? "none" : "auto"}
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls-start-playback-button]:hidden"
            style={{ filter: "brightness(0.3) saturate(1.15)", WebkitAppearance: "none" } as any}>
            
            <source src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>
          {/* Cinematic vignette overlays */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 30%, hsl(var(--background)) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(230,20%,15%,0.4) 0%, transparent 50%, hsla(35,50%,30%,0.25) 100%)" }} />
        </div>

        {/* ═══ LAYER 1: Aurora boreale CSS ═══ */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 3 }}>
          <div className="aurora-blob-1 absolute w-[400px] h-[400px] sm:w-[600px] sm:h-[600px] rounded-full opacity-[0.07]"
            style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.8), transparent 65%)", filter: "blur(80px)", top: "10%", left: "15%" }} />
          <div className="aurora-blob-2 absolute w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] rounded-full opacity-[0.05]"
            style={{ background: "radial-gradient(circle, hsla(265,60%,55%,0.7), transparent 65%)", filter: "blur(80px)", top: "20%", right: "10%" }} />
          <div className="aurora-blob-3 absolute w-[300px] h-[300px] sm:w-[450px] sm:h-[450px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, hsla(210,55%,55%,0.6), transparent 65%)", filter: "blur(80px)", bottom: "15%", left: "40%" }} />
        </div>

        {/* ═══ LAYER 1b: Central glow orb — skip on mobile for GPU savings ═══ */}
        {!IS_MOBILE_LP && <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 3 }}>
          <motion.div className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full blur-[180px]"
          style={{ background: "radial-gradient(circle, hsla(38,50%,50%,0.06), hsla(35,45%,50%,0.03), transparent 70%)" }}
          animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }} />
          
        </div>}

        <motion.div className="relative z-10 max-w-[1100px] mx-auto w-full" style={IS_MOBILE_LP ? undefined : { y: heroY, scale: heroScale, willChange: "transform" }}>
          <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">

            {/* Clean badge — neon accent */}
            <motion.div className={`inline-flex items-center gap-2.5 px-4 py-2 rounded-full border bg-primary/[0.04] mb-5 sm:mb-7 ${IS_MOBILE_LP ? "" : "backdrop-blur-sm"}`}
            style={{ borderColor: "hsl(var(--neon-emerald) / 0.25)", boxShadow: "0 0 20px hsl(var(--neon-emerald) / 0.06)" }}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <motion.span className="w-2 h-2 rounded-full" style={{ background: "hsl(var(--neon-emerald))" }}
              animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />
              <span className="text-[0.6rem] sm:text-[0.65rem] font-heading font-bold tracking-[2px] uppercase text-neon-emerald">🤖 Piattaforma AI All-in-One per PMI</span>
            </motion.div>

            {/* Gradient glow behind title */}
            <div className="absolute -inset-8 pointer-events-none hero-gradient-glow -z-10"
              style={{ background: "radial-gradient(ellipse 60% 50% at 50% 50%, hsla(265,70%,55%,0.15), hsla(160,60%,45%,0.06), transparent 70%)" }} />

            {/* Headline — larger, clearer, vivid */}
            <motion.h1 className="text-[1.85rem] leading-[1.05] sm:text-[3.4rem] md:text-[4.2rem] lg:text-[5rem] font-heading font-bold tracking-[-0.03em] px-2 sm:px-0 relative"
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}>
              <span className="text-foreground">Gestione, IA e</span>
              <br />
              <span className="text-foreground">Automazione per il</span>
              <br />
              <span className="text-vivid-gradient clip-reveal-text">Tuo Business</span>
            </motion.h1>

            {/* Subtitle — clearer value prop */}
            <motion.p className="mt-4 sm:mt-6 text-[0.85rem] sm:text-lg text-foreground/50 max-w-[540px] leading-[1.75] sm:leading-[1.8] font-light px-2 sm:px-0"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
              App dedicata, 98+ agenti IA, CRM, prenotazioni, pagamenti e marketing —
              <span className="text-foreground/70 font-medium"> tutto integrato per <span className="text-neon-emerald font-semibold">25+ settori</span>. Zero canone mensile, solo risultati.</span>
            </motion.p>

            {/* ═══ Interactive AI Particle Sphere ═══ */}
            <motion.div
              className="relative mt-6 sm:mt-8 w-full overflow-visible flex items-center justify-center mx-auto"
              style={{ transformOrigin: "center center" }}
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
              
              {/* Ambient glow — full width */}
              <motion.div
                className="absolute inset-[-30%] sm:inset-[-40%] rounded-full blur-[120px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse 70% 60% at 50% 50%, hsla(265,65%,55%,0.22), hsla(38,50%,50%,0.12), transparent 70%)" }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} />
              
              <div className="flex items-center justify-center w-full" style={{ transform: typeof window !== "undefined" && window.innerWidth < 640 ? "scaleX(1.9)" : undefined }}>
                {isHeroInView &&
                <InteractiveParticleSphere size={typeof window !== "undefined" && window.innerWidth < 640 ? 200 : typeof window !== "undefined" && window.innerWidth >= 1024 ? 520 : 380} />
                }
              </div>
            </motion.div>

            {/* CTA */}
            <motion.div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0"
            initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <motion.button
                onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-7 sm:px-8 py-4 sm:py-4 rounded-full text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(var(--empire-violet)), hsl(var(--neon-magenta) / 0.85), hsl(38,55%,50%))",
                  boxShadow: "0 6px 30px hsl(var(--empire-violet) / 0.3), 0 0 0 1px hsl(var(--empire-violet) / 0.2)"
                }}
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsl(var(--empire-violet) / 0.4), 0 0 60px hsl(var(--neon-magenta) / 0.15)" }}
                whileTap={{ scale: 0.97 }}>
                
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  🚀 Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/demo")}
                className="w-full sm:w-auto px-7 sm:px-8 py-4 sm:py-4 rounded-full text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:text-foreground transition-all flex items-center justify-center gap-2"
                style={{ border: "1px solid hsl(var(--neon-emerald) / 0.15)" }}
                whileHover={{ scale: 1.01, borderColor: "hsl(var(--neon-emerald) / 0.3)", boxShadow: "0 0 20px hsl(var(--neon-emerald) / 0.08)" }}>
                
                <Play className="w-4 h-4 text-neon-emerald" /> Vedi Demo Live
              </motion.button>
            </motion.div>

            {/* Metrics — premium glassmorphism cards */}
            <motion.div className="mt-14 sm:mt-20 w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
              {metrics.map((m, i) =>
              <motion.div key={i} className={`group relative rounded-2xl p-4 sm:p-6 text-center overflow-hidden neon-card`}
              whileHover={IS_MOBILE_LP ? undefined : { y: -4, scale: 1.02 }}
              transition={{ duration: 0.3, ease: "easeOut" }}>
                  {/* Shimmer sweep — desktop only */}
                  {!IS_MOBILE_LP && <motion.div className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 30%, hsl(var(--neon-emerald) / 0.06) 48%, transparent 70%)" }}
                animate={{ x: ["-200%", "300%"] }}
                transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 + i, ease: "easeInOut" }} />
                }
                
                  {/* Top highlight line */}
                  <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, hsl(var(--empire-violet) / 0.25), transparent)" }} />
                  {/* Number */}
                  <p className="text-2xl sm:text-4xl font-heading font-bold relative z-10 text-neon-gradient">
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  {/* Label */}
                  <p className="text-[0.55rem] sm:text-[0.65rem] mt-2 tracking-[2.5px] uppercase font-heading font-semibold relative z-10 text-foreground/40">{m.label}</p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}
        style={{ filter: "drop-shadow(0 0 8px hsla(260,20%,4%,0.8))" }}>
          <span className="text-[8px] text-foreground/30 tracking-[4px] uppercase font-heading">Scopri</span>
          <motion.div animate={{ y: [0, 6, 0] }} transition={{ duration: 2.5, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-primary/40" />
          </motion.div>
        </motion.div>
      </motion.section>

      {/* ═══════ TRUST MARQUEE ═══════ */}
      <div className="relative py-5 border-y border-primary/[0.08] overflow-hidden" style={{ background: "linear-gradient(180deg, hsla(0,0%,4%,0.99) 0%, hsla(38,16%,8%,0.99) 50%, hsla(0,0%,4%,0.99) 100%)" }}>
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
            <span key={i} className="text-[0.6rem] text-foreground/25 font-heading tracking-[2.5px] uppercase flex items-center gap-2 group/trust">
                  <span className="transition-colors" style={{ color: `hsl(${t.color} / 0.5)` }}>
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
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.97) 0%, hsla(265,18%,8%,0.97) 50%, hsla(230,16%,4%,0.97) 100%)"
      }}>
        <div className="text-center mb-10">
          <SectionLabel text="Tutto in un'unica piattaforma" icon={<Layers className="w-3 h-3 text-neon-cyan" />} />
          <motion.h2 className="text-[clamp(1.5rem,4.5vw,3rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
            Creiamo <span className="text-vivid-gradient">App, Siti e Gestionali</span>
            <br />
            <span className="text-foreground/80">Potenziati dall'IA</span>
          </motion.h2>
          <motion.p className="text-[0.82rem] text-foreground/45 max-w-lg mx-auto leading-[1.75]"
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
          className="relative p-5 rounded-2xl overflow-hidden border transition-all duration-300"
          style={{
            background: `linear-gradient(160deg, ${pillar.gradient.split(" ")[0].replace("from-[", "").replace("]", "")}, hsla(230,12%,7%,0.98))`,
            borderColor: `hsl(${pillar.color} / 0.15)`,
          }}>
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-[1.5px]" style={{ background: `linear-gradient(90deg, transparent, hsl(${pillar.color} / 0.4), transparent)` }} />
            <div className="flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `hsl(${pillar.color} / 0.15)`, color: `hsl(${pillar.color})`, boxShadow: `0 0 20px hsl(${pillar.color} / 0.1)` }}>
                {pillar.icon}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-[0.85rem] font-heading font-bold text-foreground/95 leading-tight mb-1.5">{pillar.title}</h3>
                <p className="text-[0.65rem] text-foreground/40 leading-[1.65] mb-3">{pillar.desc}</p>
                <div className="flex flex-wrap gap-1.5">
                  {pillar.features.map((f, fi) =>
                  <span key={fi} className="px-2 py-0.5 rounded-md text-[0.5rem] font-medium tracking-wide"
                  style={{ background: `hsl(${pillar.color} / 0.1)`, color: `hsl(${pillar.color} / 0.7)`, border: `1px solid hsl(${pillar.color} / 0.1)` }}>
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
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-2"
        variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-40px" }}>
          {[
            { icon: <Globe className="w-3.5 h-3.5" />, title: "Siti Web Premium", color: "var(--empire-violet)" },
            { icon: <QrCode className="w-3.5 h-3.5" />, title: "Menu & Cataloghi QR", color: "var(--neon-emerald)" },
            { icon: <Wallet className="w-3.5 h-3.5" />, title: "Loyalty & Fidelity", color: "var(--neon-cyan)" },
            { icon: <Headphones className="w-3.5 h-3.5" />, title: "Voice Agent IA", color: "var(--neon-magenta)" },
            { icon: <MapPin className="w-3.5 h-3.5" />, title: "Multi-Sede", color: "var(--empire-violet)" },
            { icon: <Lock className="w-3.5 h-3.5" />, title: "GDPR & Sicurezza", color: "var(--neon-emerald)" },
            { icon: <Receipt className="w-3.5 h-3.5" />, title: "Fatturazione Elettronica", color: "var(--neon-cyan)" },
            { icon: <Sparkles className="w-3.5 h-3.5" />, title: "Personalizzazione Totale", color: "var(--neon-magenta)" },
          ].map((f, i) =>
          <motion.div key={i} variants={popIn}
          className="relative p-2.5 rounded-lg overflow-hidden text-center"
          style={{
            background: "linear-gradient(145deg, hsl(var(--deep-black) / 0.95), hsl(265,15%,8% / 0.95))",
            border: `1px solid hsl(${f.color} / 0.1)`,
          }}>
            <div className="w-7 h-7 mx-auto rounded-lg flex items-center justify-center mb-1.5"
            style={{ background: `hsl(${f.color} / 0.12)`, color: `hsl(${f.color})` }}>
              {f.icon}
            </div>
            <h4 className="text-[0.58rem] font-heading font-bold text-foreground/80 leading-tight">{f.title}</h4>
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
                             IL PROBLEMA — Pain Points
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(345,20%,8%,0.96) 20%, hsla(350,16%,10%,0.96) 40%, hsla(265,18%,9%,0.96) 60%, hsla(345,14%,7%,0.96) 80%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        {/* Premium ambient glows — layered danger luxury */}
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Primary crimson vignette — top-left */}
          <div className="absolute top-[5%] left-[10%] w-[600px] h-[600px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(350,65%,40%,0.6), transparent 65%)", filter: "blur(140px)" }} />
          {/* Deep violet anchor — center-right */}
          <div className="absolute top-[30%] right-[10%] w-[500px] h-[500px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(265,55%,45%,0.5), transparent 65%)", filter: "blur(130px)" }} />
          {/* Warm amber warning — bottom center */}
          <div className="absolute bottom-[10%] left-[40%] w-[450px] h-[450px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(30,55%,45%,0.4), transparent 65%)", filter: "blur(120px)" }} />
          {/* Secondary crimson — bottom-left */}
          <div className="absolute bottom-[25%] left-[5%] w-[350px] h-[350px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(0,50%,40%,0.35), transparent 65%)", filter: "blur(100px)" }} />
          {/* Subtle gold highlight — top-right */}
          <div className="absolute top-[8%] right-[20%] w-[300px] h-[300px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,50%,0.3), transparent 60%)", filter: "blur(90px)" }} />
          {/* Top accent border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(350,50%,45%,0.25), hsla(0,60%,50%,0.15), hsla(265,50%,55%,0.1), transparent)" }} />
          {/* Subtle vertical light shaft */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[120px] opacity-[0.08]"
          style={{ background: "linear-gradient(180deg, hsla(350,50%,50%,0.4), transparent)" }} />
          {/* Bottom fade-out gradient */}
          <div className="absolute bottom-0 left-0 right-0 h-[80px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          {/* Noise texture overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Il Problema" icon={<AlertTriangle className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il Tuo Business Sta <span className="text-shimmer">Perdendo Soldi</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[550px] mx-auto text-sm leading-[1.7]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni giorno senza un sistema moderno è un giorno di clienti persi, processi lenti e margini erosi.
          </motion.p>
        </div>

        {/* ═══ Pain Points — DNA helix staggered list ═══ */}
        {(() => {
          const painData = [
          { icon: <Banknote className="w-4 h-4" />, title: "Commissioni", desc: "Piattaforme terze che divorano i margini. Su €10K/mese, €3K vanno in fee.", stat: "-30%", color: "from-red-500/80 to-orange-500/80" },
          { icon: <Users className="w-4 h-4" />, title: "Clienti Persi", desc: "Senza CRM e loyalty il 70% non torna. Li acquisisci e li perdi.", stat: "70%", color: "from-amber-500/80 to-yellow-500/80" },
          { icon: <Smartphone className="w-4 h-4" />, title: "Zero Digitale", desc: "Competitor con app e booking online. Tu ancora con carta e WhatsApp.", stat: "0", color: "from-orange-500/80 to-red-500/80" },
          { icon: <ClipboardCheck className="w-4 h-4" />, title: "Processi Manuali", desc: "Ordini a voce, agenda cartacea, Excel. Ogni errore costa tempo e denaro.", stat: "4h/g", color: "from-rose-500/80 to-pink-500/80" },
          { icon: <Eye className="w-4 h-4" />, title: "Reputazione", desc: "Una recensione negativa costa migliaia in clienti persi.", stat: "-€5K", color: "from-red-600/80 to-rose-500/80" },
          { icon: <Target className="w-4 h-4" />, title: "Marketing Cieco", desc: "Pubblicità senza tracking. Zero segmentazione, zero automazione.", stat: "0%", color: "from-amber-600/80 to-orange-500/80" }];

          return (
            <div className="relative">
              {/* AI Neural Network background */}
              <div className="absolute inset-0 pointer-events-none -z-[1] overflow-hidden">
                <div className="absolute inset-0 opacity-[0.10]">
                  <svg className="w-full h-full" viewBox="0 0 1200 350" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <radialGradient id="pain-node-glow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(350,60%,55%)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="hsl(350,60%,55%)" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                    {/* Connections */}
                    {[
                    [120, 70, 280, 160], [120, 70, 400, 90], [120, 70, 250, 270],
                    [280, 160, 400, 90], [280, 160, 520, 250], [280, 160, 600, 170],
                    [400, 90, 600, 170], [400, 90, 720, 80], [400, 90, 520, 250],
                    [600, 170, 720, 80], [600, 170, 830, 200], [600, 170, 680, 300],
                    [720, 80, 830, 200], [720, 80, 950, 120], [720, 80, 1080, 170],
                    [830, 200, 1080, 170], [830, 200, 680, 300], [830, 200, 980, 290],
                    [1080, 170, 950, 120], [1080, 170, 980, 290],
                    [250, 270, 520, 250], [520, 250, 680, 300], [680, 300, 980, 290]].
                    map(([x1, y1, x2, y2], i) =>
                    <motion.line key={`pl${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
                    stroke="hsl(350,45%,50%)" strokeWidth="1" strokeOpacity="0.35"
                    initial={{ pathLength: 0, opacity: 0 }}
                    whileInView={{ pathLength: 1, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.025, duration: 0.5 }} />

                    )}
                    {/* Nodes */}
                    {[
                    [120, 70], [280, 160], [400, 90], [600, 170], [720, 80],
                    [830, 200], [1080, 170], [250, 270], [520, 250], [680, 300],
                    [950, 120], [980, 290]].
                    map(([cx, cy], i) =>
                    <g key={`pn${i}`}>
                        <circle cx={cx} cy={cy} r="16" fill="url(#pain-node-glow)" />
                        <motion.circle cx={cx} cy={cy} r="5"
                      fill="hsl(350,55%,50%)" fillOpacity="0.45"
                      stroke="hsl(350,55%,55%)" strokeWidth="1.2" strokeOpacity="0.5"
                      initial={{ scale: 0, opacity: 0 }}
                      whileInView={{ scale: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.3 + i * 0.04, type: "spring", stiffness: 200 }} />
                      
                        <motion.circle cx={cx} cy={cy} r="2.5"
                      fill="hsl(38,50%,55%)" fillOpacity="0.6"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: [0, 1.3, 1] }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + i * 0.04, duration: 0.35 }} />
                      
                      </g>
                    )}
                  </svg>
                </div>
              </div>

              <div className="relative rounded-2xl overflow-hidden isolate">
                {/* Opaque mobile backdrop — fully isolates from homepage DNA background */}
                <div
                  className="absolute inset-0 sm:hidden z-0 rounded-2xl"
                  style={{
                    background: "linear-gradient(160deg, hsla(260,18%,6%,0.99), hsla(260,14%,5%,0.995))",
                    border: "1px solid hsl(var(--border) / 0.18)"
                  }} />
                

                {/* ── Mobile Hyper-Tech Circuit Schema ── hub-spoke topology */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] sm:hidden" viewBox="0 0 300 360" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <filter id="painMobileGlow" x="-40%" y="-40%" width="180%" height="180%">
                      <feGaussianBlur stdDeviation="1.2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                    <radialGradient id="painNodeGlowM" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="hsl(var(--primary) / 0.25)" />
                      <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
                    </radialGradient>
                    <linearGradient id="painSpineH" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="hsl(var(--primary) / 0)" />
                      <stop offset="30%" stopColor="hsl(var(--primary) / 0.4)" />
                      <stop offset="70%" stopColor="hsl(var(--primary) / 0.4)" />
                      <stop offset="100%" stopColor="hsl(var(--primary) / 0)" />
                    </linearGradient>
                    <linearGradient id="painSpineV" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--accent) / 0)" />
                      <stop offset="20%" stopColor="hsl(var(--accent) / 0.35)" />
                      <stop offset="80%" stopColor="hsl(var(--accent) / 0.35)" />
                      <stop offset="100%" stopColor="hsl(var(--accent) / 0)" />
                    </linearGradient>
                  </defs>

                  {/* Central hub ring */}
                  <circle cx="150" cy="180" r="28" fill="none" stroke="hsl(var(--primary) / 0.15)" strokeWidth="0.8" strokeDasharray="4,3" />
                  <circle cx="150" cy="180" r="14" fill="none" stroke="hsl(var(--primary) / 0.25)" strokeWidth="0.6" />
                  <circle cx="150" cy="180" r="4" fill="hsl(var(--primary) / 0.5)">
                    <animate attributeName="r" values="3;5;3" dur="3s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur="3s" repeatCount="indefinite" />
                  </circle>

                  {/* Curved paths from center hub to each node position */}
                  <path d="M150,166 Q120,110 72,65" fill="none" stroke="url(#painSpineV)" strokeWidth="0.9" strokeDasharray="3,4" />
                  <path d="M150,166 Q180,110 228,65" fill="none" stroke="url(#painSpineV)" strokeWidth="0.9" strokeDasharray="3,4" />
                  <path d="M136,180 Q100,180 65,180" fill="none" stroke="url(#painSpineH)" strokeWidth="0.9" strokeDasharray="3,4" />
                  <path d="M164,180 Q200,180 235,180" fill="none" stroke="url(#painSpineH)" strokeWidth="0.9" strokeDasharray="3,4" />
                  <path d="M150,194 Q120,250 72,300" fill="none" stroke="url(#painSpineV)" strokeWidth="0.9" strokeDasharray="3,4" />
                  <path d="M150,194 Q180,250 228,300" fill="none" stroke="url(#painSpineV)" strokeWidth="0.9" strokeDasharray="3,4" />

                  {/* Cross-links between adjacent nodes */}
                  <line x1="72" y1="68" x2="228" y2="68" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.6" strokeDasharray="2,5" />
                  <line x1="72" y1="300" x2="228" y2="300" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.6" strokeDasharray="2,5" />
                  <line x1="72" y1="74" x2="72" y2="296" stroke="hsl(var(--accent) / 0.12)" strokeWidth="0.5" strokeDasharray="2,5" />
                  <line x1="228" y1="74" x2="228" y2="296" stroke="hsl(var(--accent) / 0.12)" strokeWidth="0.5" strokeDasharray="2,5" />

                  {/* Diagonal accent curves */}
                  <path d="M72,68 Q150,130 228,180" fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.5" />
                  <path d="M228,68 Q150,130 72,180" fill="none" stroke="hsl(var(--accent) / 0.1)" strokeWidth="0.5" />
                  <path d="M72,180 Q150,240 228,300" fill="none" stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.5" />
                  <path d="M228,180 Q150,240 72,300" fill="none" stroke="hsl(var(--accent) / 0.1)" strokeWidth="0.5" />

                  {/* Junction nodes at each card position */}
                  {[[72, 65], [228, 65], [65, 180], [235, 180], [72, 300], [228, 300]].map(([cx, cy], ni) =>
                  <g key={`pn-m-${ni}`}>
                      <circle cx={cx} cy={cy} r="10" fill="url(#painNodeGlowM)" />
                      <circle cx={cx} cy={cy} r="2.5" fill="hsl(var(--primary) / 0.6)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.5">
                        <animate attributeName="r" values="2;3.5;2" dur={`${2.5 + ni * 0.3}s`} repeatCount="indefinite" />
                        <animate attributeName="opacity" values="0.5;1;0.5" dur={`${2.5 + ni * 0.3}s`} repeatCount="indefinite" />
                      </circle>
                    </g>
                  )}

                  {/* 3 animated data pulses on circuit paths */}
                  <circle r="2" fill="hsl(var(--primary) / 0.95)" filter="url(#painMobileGlow)">
                    <animateMotion dur="4.5s" repeatCount="indefinite" path="M150,180 Q120,110 72,65 L228,65 Q180,110 150,180 Q180,250 228,300 L72,300 Q120,250 150,180" />
                  </circle>
                  <circle r="1.5" fill="hsl(var(--accent) / 0.9)" filter="url(#painMobileGlow)">
                    <animateMotion dur="5.5s" repeatCount="indefinite" path="M150,180 L65,180 Q70,120 72,65 Q150,50 228,65 L235,180 Q230,240 228,300 Q150,310 72,300 L65,180 L150,180" />
                  </circle>
                  <circle r="1.2" fill="hsl(38,55%,55% / 0.8)" filter="url(#painMobileGlow)">
                    <animateMotion dur="6s" repeatCount="indefinite" path="M72,65 Q150,130 228,180 Q150,240 72,300 Q90,180 72,65" />
                  </circle>
                </svg>

                {/* Desktop AI Network Schema */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0 hidden sm:block" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id="pain-line-grad" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor="hsla(265,60%,55%,0)" />
                      <stop offset="50%" stopColor="hsla(265,60%,55%,0.18)" />
                      <stop offset="100%" stopColor="hsla(265,60%,55%,0)" />
                    </linearGradient>
                    <linearGradient id="pain-line-grad-v" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="hsla(265,60%,55%,0)" />
                      <stop offset="50%" stopColor="hsla(265,60%,55%,0.18)" />
                      <stop offset="100%" stopColor="hsla(265,60%,55%,0)" />
                    </linearGradient>
                    <linearGradient id="pain-line-diag" x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor="hsla(0,50%,50%,0)" />
                      <stop offset="50%" stopColor="hsla(0,50%,50%,0.12)" />
                      <stop offset="100%" stopColor="hsla(0,50%,50%,0)" />
                    </linearGradient>
                    <filter id="pain-glow">
                      <feGaussianBlur stdDeviation="2" result="blur" />
                      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                    </filter>
                  </defs>
                  <line x1="25%" y1="33%" x2="75%" y2="33%" stroke="url(#pain-line-grad)" strokeWidth="1" filter="url(#pain-glow)" />
                  <line x1="25%" y1="66%" x2="75%" y2="66%" stroke="url(#pain-line-grad)" strokeWidth="1" filter="url(#pain-glow)" />
                  <line x1="25%" y1="20%" x2="25%" y2="80%" stroke="url(#pain-line-grad-v)" strokeWidth="1" filter="url(#pain-glow)" />
                  <line x1="75%" y1="20%" x2="75%" y2="80%" stroke="url(#pain-line-grad-v)" strokeWidth="1" filter="url(#pain-glow)" />
                  <line x1="25%" y1="33%" x2="75%" y2="66%" stroke="url(#pain-line-diag)" strokeWidth="0.8" strokeDasharray="4 6" filter="url(#pain-glow)" />
                  <line x1="75%" y1="33%" x2="25%" y2="66%" stroke="url(#pain-line-diag)" strokeWidth="0.8" strokeDasharray="4 6" filter="url(#pain-glow)" />
                  {["25%", "75%"].map((x) => ["33%", "66%"].map((y) =>
                  <circle key={`${x}-${y}`} cx={x} cy={y} r="2.5" fill="hsla(265,60%,55%,0.25)" filter="url(#pain-glow)">
                      <animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0.8;0.4" dur="3s" repeatCount="indefinite" />
                    </circle>
                  ))}
                  <circle r="2" fill="hsla(0,60%,55%,0.5)" filter="url(#pain-glow)">
                    <animateMotion dur="4s" repeatCount="indefinite" path="M 80,0 L 280,0" />
                    <animate attributeName="opacity" values="0;0.8;0" dur="4s" repeatCount="indefinite" />
                  </circle>
                </svg>

              <div className="relative z-[2] grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-1.5 sm:gap-3 p-1.5 sm:p-0">
                {painData.map((pain, i) =>
                  <motion.div
                    key={i}
                    className="relative group"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.04 }}>
                    
                    <div className="relative rounded-lg sm:rounded-xl border overflow-hidden h-full" style={{
                      background: "linear-gradient(160deg, hsla(260,18%,10%,0.94), hsla(260,16%,7%,0.94))",
                      borderColor: "hsla(265,50%,55%,0.1)",
                      boxShadow: "0 2px 12px hsla(260,40%,5%,0.35), inset 0 1px 0 hsla(265,60%,65%,0.04)"
                    }}>
                      {/* Top accent line */}
                      <div className="h-[1.5px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,55%,0.5)" : pain.color.includes("amber") || pain.color.includes("yellow") ? "hsla(38,70%,55%,0.5)" : "hsla(25,70%,55%,0.5)"}, transparent)` }} />

                      <div className="p-2 sm:p-4 flex flex-col items-center text-center">
                        {/* Stat badge */}
                        <motion.div className="mb-1 sm:mb-2.5 px-1.5 py-0.5 rounded-full text-[0.4rem] sm:text-[0.5rem] font-heading font-bold tracking-widest border"
                        style={{
                          color: "hsla(0,60%,60%,0.7)",
                          borderColor: "hsla(0,50%,50%,0.15)",
                          background: "hsla(0,50%,50%,0.06)"
                        }}
                        animate={{ borderColor: ["hsla(0,50%,50%,0.1)", "hsla(0,50%,50%,0.25)", "hsla(0,50%,50%,0.1)"] }}
                        transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}>
                          {pain.stat}
                        </motion.div>

                        {/* Icon — circuit node style */}
                        <motion.div
                          className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br ${pain.color} flex items-center justify-center text-white mb-1.5 sm:mb-2.5 relative [&>svg]:w-2.5 [&>svg]:h-2.5 sm:[&>svg]:w-3.5 sm:[&>svg]:h-3.5`}
                          style={{ boxShadow: `0 0 10px ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,50%,0.2)" : "hsla(38,70%,50%,0.2)"}, inset 0 1px 0 hsla(0,0%,100%,0.12)` }}
                          animate={{ boxShadow: [`0 0 6px ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,50%,0.15)" : "hsla(38,70%,50%,0.15)"}`, `0 0 14px ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,50%,0.3)" : "hsla(38,70%,50%,0.3)"}`, `0 0 6px ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,50%,0.15)" : "hsla(38,70%,50%,0.15)"}`] }}
                          transition={{ duration: 2.5, repeat: Infinity, delay: i * 0.3 }}>
                          {pain.icon}
                        </motion.div>

                        <h3 className="font-heading text-[0.52rem] sm:text-xs font-semibold text-foreground mb-0.5 leading-tight">{pain.title}</h3>
                        <p className="text-[0.4rem] sm:text-[0.6rem] text-foreground/30 leading-[1.4]">{pain.desc}</p>
                      </div>

                      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, hsla(265,50%,55%,0.08), transparent)" }} />
                    </div>

                    <motion.div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full hidden lg:block"
                    style={{ background: "hsla(265,70%,60%,0.4)", boxShadow: "0 0 6px hsla(265,70%,60%,0.3)" }}
                    animate={{ boxShadow: ["0 0 4px hsla(265,70%,60%,0.2)", "0 0 10px hsla(265,70%,60%,0.5)", "0 0 4px hsla(265,70%,60%,0.2)"] }}
                    transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }} />
                    
                  </motion.div>
                  )}
              </div>
              </div>
            </div>);

        })()}

        <motion.div className="mt-10 text-center"
        initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/15 bg-primary/[0.04]">
            <ArrowDown className="w-4 h-4 text-primary animate-bounce" />
            <span className="text-xs font-heading font-semibold text-foreground/60">La Soluzione Esiste. <span className="text-primary">Scoprila Ora.</span></span>
          </div>
        </motion.div>
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             VIDEO HERO — Business Transformation
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(260,24%,10%,0.96) 18%, hsla(265,26%,12%,0.96) 35%, hsla(155,16%,9%,0.96) 55%, hsla(265,20%,10%,0.96) 75%, hsla(230,16%,4%,0.96) 100%)"
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
          style={{ background: "linear-gradient(180deg, transparent, hsla(0,0%,4%,1))" }} />
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
              className="group relative px-4 py-2 sm:px-5 sm:py-2.5 rounded-xl border border-primary/15 cursor-default"
              style={{
                background: "linear-gradient(135deg, hsla(265,30%,12%,0.6), hsla(38,20%,8%,0.5))",
                boxShadow: "0 2px 16px hsla(265,50%,40%,0.06), inset 0 1px 0 hsla(0,0%,100%,0.03)",
              }}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 + i * 0.08 }}
              whileHover={{ scale: 1.04, borderColor: "hsla(265,60%,55%,0.3)" }}>
              <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle at center, hsla(265,50%,50%,0.08), transparent 70%)" }} />
              <span className="text-[0.55rem] sm:text-[0.65rem] font-heading font-bold tracking-[0.15em] uppercase text-foreground/80 group-hover:text-primary transition-colors flex items-center gap-1.5">
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
            className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
            whileTap={{ scale: 0.97 }}>
            
            Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}>
            
            <Play className="w-4 h-4 text-primary/60" /> Esplora le Demo
          </motion.button>
        </motion.div>
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             SETTORI
                            ═══════════════════════════════════════════ */}
      <Section id="industries" className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, #08070e 0%, #0c0b14 18%, #110e1a 35%, #0f0d16 55%, #0a0912 78%, #08070e 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Premium violet mesh glow — top-left */}
          <div className="absolute top-[4%] left-[8%] w-[500px] h-[500px] rounded-full opacity-[0.07]"
          style={{ background: "radial-gradient(circle, hsla(265,70%,55%,0.6), transparent 65%)", filter: "blur(150px)" }} />
          {/* Deep emerald — center-right */}
          <div className="absolute top-[30%] right-[5%] w-[450px] h-[450px] rounded-full opacity-[0.06]"
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
          style={{ background: "linear-gradient(180deg, transparent, #08070e)" }} />
        </div>
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel text="Multi-Settore" icon={<Globe className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
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
            className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
            whileTap={{ scale: 0.97 }}>
            
            Inizia Ora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}>
            
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

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             AI AGENTS SHOWCASE
                            ═══════════════════════════════════════════ */}
      <AIAgentsShowcase />

      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(265,24%,10%,0.96) 15%, hsla(220,18%,11%,0.96) 30%, hsla(155,18%,9%,0.96) 50%, hsla(265,20%,10%,0.96) 70%, hsla(220,16%,8%,0.96) 85%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Primary violet — top-left */}
          <div className="absolute top-[6%] left-[18%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          {/* Emerald tech — center-right */}
          <div className="absolute top-[35%] right-[10%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,42%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          {/* Gold accent — bottom-center */}
          <div className="absolute bottom-[12%] left-[30%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.4), transparent 65%)", filter: "blur(110px)" }} />
          {/* Secondary violet — bottom-right */}
          <div className="absolute bottom-[30%] right-[20%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          {/* Soft emerald spark — top-right */}
          <div className="absolute top-[10%] right-[28%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(155,55%,48%,0.3), transparent 60%)", filter: "blur(85px)" }} />
          {/* Top accent border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.2), hsla(155,45%,50%,0.12), hsla(38,50%,50%,0.06), transparent)" }} />
          {/* Vertical light shaft */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[95px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="text-center lg:text-left order-2 lg:order-1">
            <SectionLabel text="Perché Empire" icon={<Crown className="w-3 h-3 text-accent" />} />
            <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              I Più Completi. <span className="text-shimmer">I Più Avanzati.</span>
            </h2>
            <p className="text-foreground/40 text-sm leading-[1.7] max-w-md mx-auto lg:mx-0">
              Non siamo un gestionale generico. Siamo un ecosistema AI che modernizza, digitalizza e automatizza qualsiasi tipo di attività. Sempre in evoluzione, sempre un passo avanti.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }} className="order-1 lg:order-2">
            <div className="relative rounded-2xl overflow-hidden glow-card aspect-video border border-primary/10">
              <FunnelDNAVisual />
              {/* Conversion benefit labels overlaid */}
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 pointer-events-none z-10 px-4">
                {[
                { text: "Zero Costi Fissi", icon: "💰" },
                { text: "Solo 2% Commissioni", icon: "📉" },
                { text: "25+ Settori Pronti", icon: "🏢" },
                { text: "IA che Lavora per Te", icon: "🧠" }].
                map((b, i) =>
                <motion.div key={i}
                className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                style={{
                  background: "linear-gradient(135deg, hsla(265,30%,12%,0.92), hsla(265,20%,8%,0.96))",
                  border: "1px solid hsla(265,50%,50%,0.12)",
                  boxShadow: "0 4px 20px hsla(265,50%,10%,0.3)"
                }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}>
                  
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-[0.6rem] sm:text-xs font-heading font-bold tracking-wider uppercase" style={{ color: "hsla(35,45%,60%,0.9)" }}>{b.text}</span>
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits — Mobile: Professional AI Circuit Funnel Pipeline */}
        <div className="sm:hidden relative py-4 px-1">
          {/* Opaque backdrop */}
          <div className="absolute inset-0 rounded-2xl z-0"
          style={{ background: "linear-gradient(180deg, hsl(var(--deep-black) / 0.98), hsla(38,14%,8%,0.9))", border: "1px solid hsla(38,45%,50%,0.14)" }} />

          {/* Central vertical pipeline spine */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" preserveAspectRatio="none">
            <defs>
              <linearGradient id="whyFunnelSpine" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary) / 0.05)" />
                <stop offset="20%" stopColor="hsl(var(--primary) / 0.35)" />
                <stop offset="80%" stopColor="hsl(var(--primary) / 0.35)" />
                <stop offset="100%" stopColor="hsl(var(--primary) / 0.05)" />
              </linearGradient>
              <filter id="whyPulseGlow" x="-40%" y="-40%" width="180%" height="180%">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Central spine */}
            <line x1="50%" y1="8%" x2="50%" y2="92%" stroke="url(#whyFunnelSpine)" strokeWidth="1.5" strokeDasharray="4,6" />
            {/* Horizontal branch lines from center to cards — left side */}
            {[17, 50, 83].map((y, i) =>
            <line key={`wl${i}`} x1="20%" y1={`${y}%`} x2="48%" y2={`${y}%`} stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.8" strokeDasharray="3,5" />
            )}
            {/* Horizontal branch lines from center to cards — right side */}
            {[17, 50, 83].map((y, i) =>
            <line key={`wr${i}`} x1="52%" y1={`${y}%`} x2="80%" y2={`${y}%`} stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.8" strokeDasharray="3,5" />
            )}
            {/* Junction nodes on spine */}
            {[17, 50, 83].map((y, i) =>
            <g key={`wn${i}`}>
                <circle cx="50%" cy={`${y}%`} r="4" fill="hsl(var(--primary) / 0.15)" />
                <circle cx="50%" cy={`${y}%`} r="2" fill="hsl(var(--primary) / 0.55)">
                  <animate attributeName="r" values="1.5;3;1.5" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.4;1;0.4" dur={`${2.5 + i * 0.4}s`} repeatCount="indefinite" />
                </circle>
              </g>
            )}
            {/* Animated data pulse flowing down the spine */}
            <circle r="3" fill="hsl(var(--primary) / 0.9)" filter="url(#whyPulseGlow)">
              <animate attributeName="cy" values="8%;92%;8%" dur="5s" repeatCount="indefinite" />
              <animate attributeName="cx" values="50%;50%;50%" dur="5s" repeatCount="indefinite" />
            </circle>
            {/* Secondary accent pulse */}
            <circle r="2" fill="hsl(var(--accent) / 0.8)" filter="url(#whyPulseGlow)">
              <animate attributeName="cy" values="92%;8%;92%" dur="6.5s" repeatCount="indefinite" />
              <animate attributeName="cx" values="50%;50%;50%" dur="6.5s" repeatCount="indefinite" />
            </circle>
          </svg>

          {/* Funnel pipeline cards — 2-col staggered layout */}
          <div className="relative z-[2] grid grid-cols-2 gap-x-8 gap-y-4 px-3 py-5">
            {whyUs.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div key={i}
                className={`flex flex-col ${isLeft ? "items-end text-right" : "items-start text-left"}`}
                initial={{ opacity: 0, x: isLeft ? -20 : 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.4 }}>
                  
                  {/* Step number badge */}
                  <div className="flex items-center gap-1.5 mb-1.5" style={{ flexDirection: isLeft ? "row-reverse" : "row" }}>
                    <div className="w-5 h-5 rounded-md flex items-center justify-center relative"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--primary) / 0.2), hsl(var(--primary) / 0.08))",
                      border: "1px solid hsl(var(--primary) / 0.2)",
                      boxShadow: "0 0 12px hsl(var(--primary) / 0.1)"
                    }}>
                      <div className="text-primary/80 [&>svg]:w-2.5 [&>svg]:h-2.5">{item.icon}</div>
                      {/* HUD corners */}
                      <div className="absolute -top-[1.5px] -left-[1.5px] w-[3px] h-[3px] border-t border-l border-primary/30" />
                      <div className="absolute -top-[1.5px] -right-[1.5px] w-[3px] h-[3px] border-t border-r border-primary/30" />
                      <div className="absolute -bottom-[1.5px] -left-[1.5px] w-[3px] h-[3px] border-b border-l border-primary/30" />
                      <div className="absolute -bottom-[1.5px] -right-[1.5px] w-[3px] h-[3px] border-b border-r border-primary/30" />
                    </div>
                    <span className="text-[0.42rem] font-mono text-primary/40 tracking-widest uppercase">0{i + 1}</span>
                  </div>

                  <h4 className="text-[0.55rem] font-heading font-bold text-foreground/80 leading-tight mb-0.5">{item.title}</h4>
                  <p className="text-[0.42rem] text-foreground/35 leading-[1.5]">{item.desc}</p>
                </motion.div>);

            })}
          </div>

          {/* Bottom funnel convergence label */}
          <div className="relative z-[2] flex justify-center pt-1 pb-2">
            <motion.div
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
              style={{
                background: "linear-gradient(135deg, hsl(var(--primary) / 0.12), hsl(var(--primary) / 0.05))",
                border: "1px solid hsl(var(--primary) / 0.18)"
              }}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 }}>
              <Sparkles className="w-3 h-3 text-primary/60" />
              <span className="text-[0.5rem] font-heading font-bold text-primary/70 tracking-widest uppercase">Risultato: Business Automatizzato</span>
            </motion.div>
          </div>
        </div>

        {/* Benefits — Desktop: staggered grid */}
        <motion.div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3"
        variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {whyUs.map((item, i) =>
          <motion.div key={i} variants={popIn}
          whileHover={{ scale: 1.06, y: -6 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}>
              <PremiumCard scan delay={i * 0.3} className="p-4 text-center">
                <motion.div className="text-primary/50 mb-2 flex justify-center"
              animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}>{item.icon}</motion.div>
                <h4 className="text-[0.65rem] font-heading font-bold text-foreground mb-1">{item.title}</h4>
                <p className="text-[0.5rem] text-foreground/30 leading-[1.5]">{item.desc}</p>
              </PremiumCard>
            </motion.div>
          )}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
                             COMPARISON TABLE — Empire vs Others
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(265,24%,10%,0.94) 15%, hsla(38,16%,9%,0.94) 35%, hsla(265,20%,10%,0.94) 55%, hsla(38,14%,8%,0.94) 75%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          {/* Primary violet — top-left */}
          <div className="absolute top-[8%] left-[20%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          {/* Gold accent — center-right */}
          <div className="absolute top-[30%] right-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          {/* Wide violet wash — center */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[350px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(ellipse, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(150px)" }} />
          {/* Secondary gold — bottom-left */}
          <div className="absolute bottom-[15%] left-[15%] w-[400px] h-[400px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          {/* Emerald spark — top-right */}
          <div className="absolute top-[12%] right-[28%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,48%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          {/* Top accent border */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.2), hsla(38,50%,50%,0.12), transparent)" }} />
          {/* Vertical light shaft */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          {/* Bottom fade */}
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          {/* Noise texture */}
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-10">
          <SectionLabel text="Confronto" icon={<Activity className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Empire vs <span className="text-shimmer">Tutto il Resto</span>
          </motion.h2>
        </div>
        <motion.div className="max-w-2xl mx-auto p-3 sm:p-8 rounded-2xl glow-card"
        initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          {/* Header */}
          <div className="grid grid-cols-3 pb-1.5 sm:pb-3 border-b border-border/50 mb-0.5">
            <span className="text-[0.45rem] sm:text-[0.6rem] font-heading text-foreground/30 tracking-wider uppercase">Funzionalità</span>
            <span className="text-center text-[0.45rem] sm:text-[0.6rem] font-heading font-bold text-primary tracking-wider uppercase">Empire.AI</span>
            <span className="text-center text-[0.45rem] sm:text-[0.6rem] font-heading text-foreground/30 tracking-wider uppercase">Altri</span>
          </div>
          <CompRow icon="💳" label="Canone" empire="€0/mese" others="€300-900/mese" />
          <CompRow icon="📊" label="Commissioni" empire="Solo 1.5%" others="15-35%" />
          <CompRow icon="🚀" label="Setup" empire="Gratis" others="€1.500-5.000" />
          <CompRow icon="🏢" label="Settori" empire="25+" others="1-3" />
          <CompRow icon="📱" label="App dedicata" empire="Inclusa" others="€149/mese extra" />
          <CompRow icon="🤖" label="Agenti IA" empire="98+ inclusi" others="Assenti" />
          <CompRow icon="🎙️" label="Voice Agent" empire="Incluso" others="Non disponibile" />
          <CompRow icon="🔗" label="Integrazioni" empire="Stripe · AI · Push" others="Limitate" />
          <CompRow icon="⚡" label="Automazioni" empire="Multi-canale" others="Solo email" />
          <CompRow icon="🌐" label="Sito web" empire="White-label" others="Template generico" />
          <CompRow icon="📋" label="CRM" empire="AI-powered" others="Base / manuale" />
          <CompRow icon="🔒" label="Dati" empire="100% tuoi" others="Del provider" />
          <CompRow icon="🛡️" label="Supporto" empire="7/7 dedicato" others="Ticket 48-72h" />
        </motion.div>
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             TECH DNA — Neural Network Visualization
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(265,26%,10%,0.94) 15%, hsla(230,20%,11%,0.94) 35%, hsla(265,22%,9%,0.94) 55%, hsla(230,18%,8%,0.94) 78%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] left-[18%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[35%] right-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,42%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] left-[35%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.4), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[30%] right-[22%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[12%] right-[30%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(155,55%,48%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.22), hsla(155,45%,50%,0.1), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[95px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="relative z-10 text-center mb-10 sm:mb-14">
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Il DNA Tecnologico di <span className="text-shimmer">Empire</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[550px] mx-auto text-sm leading-[1.7]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Un'architettura neurale che connette ogni modulo in tempo reale. Non software separati — un organismo digitale vivente.
          </motion.p>
        </div>

        {/* Neural Network Visualization */}
        <motion.div className="relative max-w-3xl mx-auto h-[280px] sm:h-[350px] rounded-2xl overflow-hidden holo-panel"
        initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          
          {/* Animated grid background */}
          <div className="absolute inset-0 animated-grid-bg opacity-30" />
          
          {/* Neural nodes */}
          {[
          { x: "50%", y: "50%", label: "AI CORE", size: 16, primary: true },
          { x: "20%", y: "25%", label: "CRM", size: 10, primary: false },
          { x: "80%", y: "25%", label: "ORDINI", size: 10, primary: false },
          { x: "15%", y: "70%", label: "ANALYTICS", size: 10, primary: false },
          { x: "85%", y: "70%", label: "PAGAMENTI", size: 10, primary: false },
          { x: "35%", y: "15%", label: "CATALOGO", size: 8, primary: false },
          { x: "65%", y: "15%", label: "BOOKING", size: 8, primary: false },
          { x: "35%", y: "85%", label: "STAFF", size: 8, primary: false },
          { x: "65%", y: "85%", label: "MARKETING", size: 8, primary: false }].
          map((node, i) =>
          <motion.div key={i} className="absolute flex flex-col items-center z-10"
          style={{ left: node.x, top: node.y, transform: "translate(-50%, -50%)" }}
          initial={{ opacity: 0, scale: 0 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 + i * 0.08, type: "spring", stiffness: 200 }}>
              <div
              className={`rounded-full neural-node ${node.primary ? "bg-gradient-to-br from-primary to-accent" : "bg-gradient-to-br from-primary/40 to-accent/20"}`}
              style={{
                width: node.size * (node.primary ? 1.5 : 1),
                height: node.size * (node.primary ? 1.5 : 1),
                "--node-delay": `${i * 0.3}s`,
                boxShadow: node.primary ?
                "0 0 30px hsla(265,85%,65%,0.6), 0 0 60px hsla(265,85%,65%,0.3)" :
                "0 0 12px hsla(265,85%,65%,0.3)"
              } as React.CSSProperties} />
            
              <span className={`mt-1.5 text-[6px] sm:text-[8px] font-heading font-bold tracking-[2px] uppercase ${node.primary ? "text-primary" : "text-foreground/30"}`}>
                {node.label}
              </span>
            </motion.div>
          )}

          {/* Connection lines (SVG) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none" xmlns="http://www.w3.org/2000/svg">
            {[
            { x1: "50%", y1: "50%", x2: "20%", y2: "25%" },
            { x1: "50%", y1: "50%", x2: "80%", y2: "25%" },
            { x1: "50%", y1: "50%", x2: "15%", y2: "70%" },
            { x1: "50%", y1: "50%", x2: "85%", y2: "70%" },
            { x1: "50%", y1: "50%", x2: "35%", y2: "15%" },
            { x1: "50%", y1: "50%", x2: "65%", y2: "15%" },
            { x1: "50%", y1: "50%", x2: "35%", y2: "85%" },
            { x1: "50%", y1: "50%", x2: "65%", y2: "85%" }].
            map((line, i) =>
            <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
            stroke="url(#neural-gradient)" strokeWidth="1" opacity="0.25"
            strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="8" to="0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
              </line>
            )}
            <defs>
              <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsla(265, 70%, 60%, 0.6)" />
                <stop offset="100%" stopColor="hsla(280, 50%, 65%, 0.4)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating data packets along connections */}
          {Array.from({ length: 6 }).map((_, i) =>
          <motion.div key={`packet-${i}`}
          className="absolute w-1.5 h-1.5 rounded-full bg-primary z-20"
          style={{
            left: "50%", top: "50%",
            boxShadow: "0 0 8px hsla(265,70%,60%,0.8)"
          }}
          animate={{
            x: [0, Math.cos(i * Math.PI / 3) * 150],
            y: [0, Math.sin(i * Math.PI / 3) * 120],
            opacity: [1, 0],
            scale: [1, 0.5]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            delay: i * 0.4,
            ease: "easeOut"
          }} />

          )}

          {/* HUD corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t border-l border-primary/30 rounded-tl" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t border-r border-primary/30 rounded-tr" />
          <div className="absolute bottom-3 left-3 w-6 h-6 border-b border-l border-primary/30 rounded-bl" />
          <div className="absolute bottom-3 right-3 w-6 h-6 border-b border-r border-primary/30 rounded-br" />

          {/* Tech readout overlays */}
          <div className="absolute top-3 left-10 text-[6px] sm:text-[8px] font-heading font-bold text-primary/40 tracking-[3px] uppercase">
            NEURAL MESH v4.2
          </div>
          <div className="absolute bottom-3 right-10 text-[6px] sm:text-[8px] font-heading text-foreground/15 tracking-wider">
            NODES: 9 • LATENCY: &lt;2ms • STATUS: <span className="text-emerald-400/60">OPTIMAL</span>
          </div>
        </motion.div>

        {/* Tech specs row */}
        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 max-w-3xl mx-auto"
        variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
          { label: "Architettura", value: "Edge-First", icon: <Wifi className="w-3.5 h-3.5" /> },
          { label: "Crittografia", value: "AES-256", icon: <Lock className="w-3.5 h-3.5" /> },
          { label: "Deploy", value: "< 24h", icon: <Zap className="w-3.5 h-3.5" /> },
          { label: "Evoluzione", value: "Settimanale", icon: <Radio className="w-3.5 h-3.5" /> }].
          map((spec, i) =>
          <motion.div key={i} variants={popIn}>
              <PremiumCard scan delay={i} className="p-4 text-center">
                <motion.div className="text-primary mb-2 flex justify-center"
              animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
              transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}>
                {spec.icon}</motion.div>
                <p className="text-xs font-heading font-bold text-foreground">{spec.value}</p>
                <p className="text-[0.55rem] text-foreground/30 mt-0.5 tracking-wider uppercase">{spec.label}</p>
              </PremiumCard>
            </motion.div>
          )}
        </motion.div>
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             3 INTERFACCE — Mockup Showcase
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(38,18%,9%,0.96) 18%, hsla(265,20%,10%,0.96) 35%, hsla(38,14%,8%,0.96) 55%, hsla(265,18%,9%,0.96) 75%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] right-[18%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[32%] left-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] right-[30%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[28%] left-[25%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,45%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[14%] left-[35%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(265,55%,55%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(38,55%,50%,0.2), hsla(265,50%,55%,0.12), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(38,50%,50%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Esperienza" icon={<MonitorSmartphone className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            3 Interfacce, <span className="text-shimmer">Un Ecosistema</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[550px] mx-auto text-sm leading-[1.7]"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni attore ha la sua interfaccia dedicata. Cliente, proprietario e staff operano in sinergia perfetta.
          </motion.p>
        </div>

        {/* Auto-scrolling carousel with controls */}
        {(() => {
          const mockups = [
          { img: mockupCliente, title: "App Cliente", desc: "Prenota servizi, gestisci appuntamenti e ricevi aggiornamenti in tempo reale.", tag: "FRONT-END", sector: "Beauty & Wellness", features: ["Prenotazioni online", "Loyalty & Cashback", "Push Notification", "Chat Diretta"] },
          { img: mockupAdmin, title: "Dashboard Admin", desc: "Analytics IA, CRM, gestione team, fatturazione e marketing automation per ogni settore.", tag: "BACK-OFFICE", sector: "Multi-Settore", features: ["Analytics predittivi", "CRM & Segmentazione", "Fatturazione elettronica", "Marketing automatizzato"] },
          { img: mockupCucina, title: "Pannello Operativo", desc: "Vista operativa real-time: interventi, appuntamenti, flotta, staff e postazioni.", tag: "OPERATIONS", sector: "NCC & Trasporti", features: ["Live tracking operativo", "Gestione turni & team", "Compliance & controlli", "Notifiche smart"] },
          { img: mockupCliente, title: "Booking Engine", desc: "Prenotazione ombrelloni, lettini e servizi spiaggia con mappa interattiva.", tag: "FRONT-END", sector: "Beach & Hospitality", features: ["Mappa interattiva", "Pagamento anticipato", "QR Code accesso", "Meteo integrato"] },
          { img: mockupAdmin, title: "Fleet Manager", desc: "Gestione veicoli, autisti, tratte e pricing dinamico con tracking GPS.", tag: "BACK-OFFICE", sector: "NCC Premium", features: ["GPS live tracking", "Pricing dinamico", "Scadenzario docs", "Revenue analytics"] },
          { img: mockupCucina, title: "Agenda Smart", desc: "Calendario appuntamenti, gestione slot e notifiche automatiche per clienti.", tag: "OPERATIONS", sector: "Healthcare & Fitness", features: ["Agenda drag & drop", "Reminder automatici", "Schede paziente", "Report periodici"] }];


          const carouselRef = mockupCarouselRef;
          const carouselPaused = mockupCarouselPaused;
          const setCarouselPaused = setMockupCarouselPaused;

          const scrollCarousel = (direction: 'left' | 'right') => {
            const el = carouselRef.current;
            if (!el) return;
            const cardWidth = 215; // card + gap
            el.scrollBy({ left: direction === 'right' ? cardWidth * 2 : -cardWidth * 2, behavior: 'smooth' });
          };

          return (
            <>
            <AnimatePresence mode="wait">
              {expandMockups ?
                <motion.div key="mockups-grid" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-5 gap-2.5 sm:gap-4 px-0.5">
                  {(() => {
                    const ALL_SECTOR_IMAGES: Record<string, string> = {
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
                    const ALL_SECTOR_COLORS: Record<string, string> = {
                      food: "#e85d04", ncc: "#C9A84C", beauty: "#e91e8c", healthcare: "#0ea5e9",
                      retail: "#8b5cf6", fitness: "#f97316", hospitality: "#10b981",
                      beach: "#06b6d4", plumber: "#3b82f6", electrician: "#eab308",
                      construction: "#f59e0b", events: "#d946ef", garage: "#ef4444",
                      logistics: "#0ea5e9", gardening: "#22c55e", veterinary: "#ec4899",
                      photography: "#a855f7", education: "#0891b2", childcare: "#f472b6",
                      tattoo: "#6d28d9", cleaning: "#14b8a6", agriturismo: "#65a30d",
                      legal: "#64748b", accounting: "#6366f1", custom: "#8b5cf6"
                    };
                    const EXTRA_ID_MAP: Record<string, string> = {
                      "Formazione & Coaching": "education", "Stabilimenti Balneari": "beach",
                      "Veterinari & Pet Care": "veterinary", "Artigiani & Impiantisti": "plumber",
                      "Studi Creativi": "photography", "Studi Legali": "legal",
                      "Edilizia & Costruzioni": "construction", "Eventi & Catering": "events",
                      "Autofficine & Carrozzerie": "garage", "Logistica & Spedizioni": "logistics",
                      "Giardinaggio & Vivaisti": "gardening", "Asili & Doposcuola": "childcare"
                    };
                    /* Build full list: main industries + extra sectors */
                    const allSectors: { id: string; title: string; image: string; color: string; route: string }[] = [];
                    const seenIds = new Set<string>();
                    industries.forEach((ind) => {
                      seenIds.add(ind.id);
                      const slug = DEMO_SLUGS[ind.id];
                      allSectors.push({
                        id: ind.id, title: ind.title,
                        image: ALL_SECTOR_IMAGES[ind.id] || sectorHeroFood,
                        color: ALL_SECTOR_COLORS[ind.id] || "#8b5cf6",
                        route: ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`
                      });
                    });
                    extraSectors.forEach((es) => {
                      const mappedId = EXTRA_ID_MAP[es.title];
                      if (mappedId && !seenIds.has(mappedId)) {
                        seenIds.add(mappedId);
                        const slug = DEMO_SLUGS[mappedId as keyof typeof DEMO_SLUGS];
                        if (slug) {
                          allSectors.push({
                            id: mappedId, title: es.title,
                            image: ALL_SECTOR_IMAGES[mappedId] || sectorHeroFood,
                            color: ALL_SECTOR_COLORS[mappedId] || "#8b5cf6",
                            route: `/demo/${slug}`
                          });
                        }
                      }
                    });
                    /* Add remaining sectors not yet added */
                    Object.keys(ALL_SECTOR_IMAGES).forEach((sId) => {
                      if (!seenIds.has(sId)) {
                        seenIds.add(sId);
                        const slug = DEMO_SLUGS[sId as keyof typeof DEMO_SLUGS];
                        const label = sId.charAt(0).toUpperCase() + sId.slice(1);
                        allSectors.push({
                          id: sId, title: label,
                          image: ALL_SECTOR_IMAGES[sId],
                          color: ALL_SECTOR_COLORS[sId] || "#8b5cf6",
                          route: slug ? `/demo/${slug}` : "#"
                        });
                      }
                    });

                    return allSectors.map((s, i) => (
                      <motion.div key={s.id} className="group cursor-pointer"
                      initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.02 }}
                      onClick={() => navigate(s.route)}>
                        <div className="relative mb-1.5">
                          <div className="relative w-full aspect-[9/17] rounded-[20px] sm:rounded-[26px] border-[2px] overflow-hidden transition-all duration-300 group-hover:shadow-lg"
                          style={{ borderColor: `${s.color}30`, boxShadow: `0 8px 25px hsla(0,0%,0%,0.4), 0 0 15px ${s.color}08` }}>
                            {/* Dynamic Island */}
                            <div className="absolute top-[5px] left-1/2 -translate-x-1/2 w-[36px] sm:w-[46px] h-[10px] sm:h-[14px] bg-black rounded-full z-20" />
                            <div className="absolute inset-[2px] rounded-[18px] sm:rounded-[23px] overflow-hidden bg-black">
                              <img src={s.image} alt={s.title} className="w-full h-full object-cover object-top" loading="lazy" />
                              {/* Bottom gradient */}
                              <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, transparent 50%, hsla(0,0%,0%,0.85) 80%, hsla(0,0%,0%,0.95) 100%)" }} />
                              {/* Title overlay */}
                              <div className="absolute bottom-2 sm:bottom-3 left-1.5 right-1.5 z-10">
                                <h4 className="font-heading text-[0.5rem] sm:text-[0.65rem] font-bold text-white leading-tight truncate">{s.title}</h4>
                              </div>
                            </div>
                            {/* Home indicator */}
                            <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[40px] sm:w-[55px] h-[2.5px] bg-foreground/15 rounded-full z-20" />
                          </div>
                        </div>
                      </motion.div>
                    ));
                  })()}
                </motion.div> :

                <motion.div key="mockups-carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="relative overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6">
                  <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsl(var(--background)), transparent)" }} />
                  <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsl(var(--background)), transparent)" }} />

                  <div className="flex items-center justify-center gap-3 mb-5">
                    <button onClick={() => scrollCarousel('left')} className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300" aria-label="Indietro">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={() => setCarouselPaused((p) => !p)} className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300" aria-label={carouselPaused ? "Play" : "Pausa"}>
                      {carouselPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
                    </button>
                    <button onClick={() => scrollCarousel('right')} className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300" aria-label="Avanti">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div ref={carouselRef} className="flex gap-5 sm:gap-6" style={{
                    animation: `carousel-scroll 22s linear infinite`,
                    animationPlayState: carouselPaused ? 'paused' : 'running',
                    width: "max-content"
                  }}>
                    {[...mockups, ...mockups].map((mock, i) => {
                      const tagColors: Record<string, string> = {
                        "FRONT-END": "hsl(var(--primary))",
                        "BACK-OFFICE": "hsl(var(--accent))",
                        "OPERATIONS": "hsl(160, 60%, 45%)"
                      };
                      const tagColor = tagColors[mock.tag] || "hsl(var(--primary))";
                      return (
                        <div key={i} className="group flex flex-col items-center flex-shrink-0 w-[195px]">
                          <div className="relative mb-4">
                            <div className="absolute -inset-3 rounded-[46px] opacity-10 blur-xl pointer-events-none group-hover:opacity-20 transition-opacity duration-700" style={{ background: tagColor }} />
                            <div className="relative w-[185px] h-[380px] rounded-[34px] border-[2.5px] border-foreground/12 shadow-[0_12px_40px_hsla(0,0%,0%,0.5)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_16px_50px_hsla(265,70%,60%,0.12)]" style={{ background: "hsl(var(--card))" }}>
                              <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[60px] h-[18px] bg-foreground/80 rounded-full z-20" />
                              <div className="absolute inset-[2px] rounded-[31px] overflow-hidden" style={{ background: "hsl(var(--background))" }}>
                                <img src={mock.img} alt={mock.title} className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" />
                                <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsla(0,0%,0%,0.15) 0%, transparent 25%, transparent 40%, hsla(0,0%,0%,0.94) 70%, hsla(0,0%,0%,0.95) 100%)" }} />
                                <div className="absolute top-[30px] left-3 right-3 z-20 flex items-center gap-1.5">
                                  <span className="px-2 py-[2px] rounded-md text-[0.42rem] font-bold tracking-[1.5px] uppercase" style={{ background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}30` }}>{mock.tag}</span>
                                  <span className="text-[0.4rem] text-white/50 tracking-wider">{mock.sector}</span>
                                </div>
                                <div className="absolute bottom-5 left-2.5 right-2.5 z-10">
                                  <h3 className="font-heading text-[0.8rem] font-bold text-white mb-1 drop-shadow-lg">{mock.title}</h3>
                                  <p className="text-[0.5rem] text-white/60 leading-[1.6] mb-2.5 line-clamp-2">{mock.desc}</p>
                                  <div className="flex flex-wrap gap-[3px]">
                                    {mock.features.slice(0, 4).map((f, j) =>
                                    <span key={j} className="px-1.5 py-[2px] rounded-md text-[0.4rem] font-medium text-white/70 backdrop-blur-sm" style={{ background: "hsla(0,0%,100%,0.08)", border: "1px solid hsla(0,0%,100%,0.1)" }}>{f}</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[70px] h-[3px] bg-foreground/15 rounded-full z-20" />
                            </div>
                          </div>
                        </div>);

                    })}
                  </div>
                </motion.div>
                }
            </AnimatePresence>
            <div className="flex justify-center mt-4">
              <button onClick={() => {setExpandMockups((p) => !p);if (!expandMockups) setCarouselPaused(true);}}
                className="text-[0.6rem] font-semibold text-primary/70 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04] hover:bg-primary/[0.08] transition-colors">
                <Layers className="w-3 h-3" /> {expandMockups ? "Chiudi" : "Vedi Tutti"}
              </button>
            </div>
            </>);

        })()}
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             BUILD ANYTHING — Streamlined Conversion Section
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(265,24%,10%,0.96) 15%, hsla(38,18%,9%,0.96) 35%, hsla(265,20%,10%,0.96) 55%, hsla(38,14%,8%,0.96) 75%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] left-[20%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>

        <div className="text-center mb-14">
          <SectionLabel text="Su Misura" icon={<Sparkles className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.05] mb-4"
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Costruiamo <span className="text-shimmer">Qualsiasi Cosa</span>
          </motion.h2>
          <motion.p className="text-foreground/40 max-w-[500px] mx-auto text-sm leading-[1.8]"
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
              background: "linear-gradient(145deg, hsla(265,22%,8%,0.94) 0%, hsla(230,18%,6%,0.95) 50%, hsla(265,20%,9%,0.94) 100%)"
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
                className="relative flex flex-col items-center text-center">
                
                  {/* Compact tech icon */}
                  <div className="w-7 h-7 rounded-md flex items-center justify-center mb-1.5 relative"
                style={{
                  background: "linear-gradient(135deg, hsla(265,28%,16%,0.95), hsla(230,22%,12%,0.95))",
                  border: "1px solid hsla(265,40%,45%,0.18)",
                  boxShadow: "0 0 10px hsla(265,50%,50%,0.06), inset 0 1px 0 hsla(265,40%,60%,0.08)"
                }}>
                    <div className="text-primary/70">{card.icon}</div>
                    {/* Tech corner brackets */}
                    <div className="absolute -top-[1.5px] -left-[1.5px] w-[4px] h-[4px] border-t border-l border-primary/25" />
                    <div className="absolute -top-[1.5px] -right-[1.5px] w-[4px] h-[4px] border-t border-r border-primary/25" />
                    <div className="absolute -bottom-[1.5px] -left-[1.5px] w-[4px] h-[4px] border-b border-l border-primary/25" />
                    <div className="absolute -bottom-[1.5px] -right-[1.5px] w-[4px] h-[4px] border-b border-r border-primary/25" />
                  </div>
                  <h3 className="font-heading text-[0.55rem] font-bold text-foreground/80 leading-tight mb-0.5">{card.title}</h3>
                  <p className="text-[0.45rem] text-foreground/30 leading-[1.4] mb-1">{card.desc}</p>
                  <motion.span className="text-[0.45rem] font-heading font-semibold text-primary/50 tracking-wider inline-flex items-center gap-1"
                animate={{ opacity: [0.4, 0.9, 0.4] }}
                transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.6 }}>
                    <span className="w-1 h-1 rounded-full bg-primary/40" />
                    {card.accent}
                  </motion.span>
                </motion.div>
              )}
            </div>
          </div>
        </div>

        {/* ═══ Scrolling Capabilities Ticker ═══ */}
        <div className="relative mb-14 -mx-5 sm:-mx-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsla(260,18%,8%,1), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsla(260,18%,8%,1), transparent)" }} />
          {[0, 1].map((row) =>
          <div key={row} className="flex whitespace-nowrap mb-2" style={{ animation: `carousel-scroll ${row === 0 ? "40s" : "45s"} linear infinite ${row === 1 ? "reverse" : ""}` }}>
              {[...Array(2)].map((_, rep) =>
            <div key={rep} className="flex gap-2 px-1">
                  {(row === 0 ?
              ["App White-Label", "Dashboard IA", "Menu QR", "Booking Online", "CRM Avanzato", "Push Notification", "Fatturazione", "Analytics", "Chat Clienti", "GPS Tracking", "Mappa Tavoli", "Gestione Staff"] :
              ["Pagamenti", "Email Marketing", "WhatsApp Auto", "Inventario", "HACCP", "Review Shield™", "Agenda Smart", "Pricing Dinamico", "Landing SEO", "Cross-selling IA", "Programma Fedeltà", "Schede Paziente"]).
              map((cap, ci) =>
              <span key={ci} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] font-heading tracking-wider"
              style={{ background: "hsla(265,70%,60%,0.06)", border: "1px solid hsla(265,70%,60%,0.08)", color: "hsla(265,70%,65%,0.5)" }}>
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
                  <p className="text-[0.5rem] text-foreground/30 tracking-[2px] uppercase">{s.label}</p>
                </motion.div>
              )}
            </div>
            <h3 className="text-base sm:text-lg font-heading font-bold text-foreground mb-2">
              "Se puoi immaginarlo, <span className="text-shimmer">noi lo costruiamo.</span>"
            </h3>
            <p className="text-[0.7rem] text-foreground/30 mb-6 max-w-md mx-auto">
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

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             SERVIZI
                            ═══════════════════════════════════════════ */}
      <Section id="services" className="relative overflow-hidden hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.82) 0%, hsla(230,22%,10%,0.78) 15%, hsla(265,22%,11%,0.78) 32%, hsla(38,16%,9%,0.78) 52%, hsla(265,18%,9%,0.78) 72%, hsla(230,16%,4%,0.82) 100%)"
      }}>
        <CircuitPattern />
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] right-[18%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(265,65%,50%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[35%] left-[10%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(38,60%,48%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] right-[28%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[28%] left-[22%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(265,50%,55%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[12%] left-[32%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(265,55%,58%,0.2), hsla(38,50%,50%,0.1), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-10 sm:mb-12">
          <SectionLabel text="Funzionalità" icon={<Layers className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Tutto Ciò Che Serve,<br className="hidden sm:block" />
            <span className="text-shimmer">in un Unico Posto</span>
          </motion.h2>
          <motion.p className="text-foreground/50 max-w-[500px] mx-auto text-sm leading-[1.7] px-2 sm:px-0"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ogni modulo è stato progettato per eliminare un problema specifico. Nessun software esterno, nessun costo aggiuntivo.
          </motion.p>
        </div>

        {/* ═══ Mobile: Auto-scrolling carousel or expanded grid ═══ */}
        <div className="sm:hidden relative">
          {/* Opaque backdrop for circuit visibility */}
          <div className="absolute inset-0 rounded-2xl z-0"
          style={{ background: "linear-gradient(160deg, hsla(230,16%,9%,0.93), hsla(265,14%,7%,0.93))", border: "1px solid hsla(265,35%,40%,0.06)" }} />

          {/* Circuit SVG connections between service cards */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1]" viewBox="0 0 320 600" preserveAspectRatio="xMidYMid meet">
            <defs>
              <filter id="svcCircuitGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="0.6" result="blur" />
                <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
              </filter>
            </defs>
            {/* Vertical spine */}
            <line x1="160" y1="30" x2="160" y2="570" stroke="hsl(var(--primary) / 0.18)" strokeWidth="0.7" strokeDasharray="4,5" strokeLinecap="round" />
            {/* Horizontal connections at each card level */}
            {[80, 160, 240, 320, 400, 480].map((y, i) =>
            <g key={`svc-h-${i}`}>
                <line x1="40" y1={y} x2="280" y2={y} stroke="hsl(var(--accent) / 0.14)" strokeWidth="0.6" strokeDasharray="3,5" strokeLinecap="round" />
                <circle cx="40" cy={y} r="1.5" fill="hsl(var(--primary) / 0.4)" />
                <circle cx="160" cy={y} r="2" fill="hsl(var(--primary) / 0.5)">
                  <animate attributeName="r" values="1.5;2.5;1.5" dur={`${2.5 + i * 0.3}s`} repeatCount="indefinite" />
                </circle>
                <circle cx="280" cy={y} r="1.5" fill="hsl(var(--primary) / 0.4)" />
                {/* Diagonal links */}
                {i < 5 && <line x1="60" y1={y + 10} x2="260" y2={y + 70} stroke="hsl(var(--primary) / 0.1)" strokeWidth="0.4" strokeLinecap="round" />}
              </g>
            )}
            {/* Animated data pulse */}
            <circle r="2.2" fill="hsl(var(--primary) / 0.94)" filter="url(#svcCircuitGlow)">
              <animateMotion dur="5s" repeatCount="indefinite" path="M160,30 L160,570" />
            </circle>
            <circle r="1.8" fill="hsl(var(--accent) / 0.8)" filter="url(#svcCircuitGlow)">
              <animateMotion dur="7s" repeatCount="indefinite" path="M40,80 L280,80 L280,240 L40,240 L40,400 L280,400 L280,480" />
            </circle>
          </svg>

          <div className="relative z-[2] px-2 py-3">
          <AnimatePresence mode="wait">
            {expandServices ?
              <motion.div key="services-grid" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="grid grid-cols-1 gap-2.5">
                {services.map((s, i) =>
                <div key={i}>
                    <PremiumCard glow scan delay={i * 0.05} className="p-3 h-full">
                      <div className="flex items-center gap-2 mb-1.5">
                        <PremiumIcon gradient={s.color} size="sm" delay={0}>{s.icon}</PremiumIcon>
                        <span className="text-[0.4rem] px-1.5 py-0.5 rounded-full border border-primary/15 bg-primary/[0.06] text-primary/70 font-bold tracking-[1.5px] font-heading">{s.tag}</span>
                      </div>
                      <h3 className="font-heading text-[0.7rem] font-semibold text-foreground mb-1 leading-tight">{s.title}</h3>
                      <p className="text-[0.55rem] text-foreground/35 leading-[1.6]">{s.desc}</p>
                    </PremiumCard>
                  </div>
                )}
              </motion.div> :

              <motion.div key="services-carousel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <PremiumCarousel speed="slow" itemWidth={200} showControls={false}>
                  {services.map((s, i) =>
                  <div key={i} className="w-[200px]">
                      <PremiumCard glow scan delay={i} className="p-3 h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <PremiumIcon gradient={s.color} size="sm" delay={i * 0.2}>{s.icon}</PremiumIcon>
                          <span className="text-[0.4rem] px-1.5 py-0.5 rounded-full border border-primary/15 bg-primary/[0.06] text-primary/70 font-bold tracking-[1.5px] font-heading">{s.tag}</span>
                        </div>
                        <h3 className="font-heading text-[0.7rem] font-semibold text-foreground mb-1 leading-tight">{s.title}</h3>
                        <p className="text-[0.55rem] text-foreground/35 leading-[1.6]">{s.desc}</p>
                      </PremiumCard>
                    </div>
                  )}
                </PremiumCarousel>
              </motion.div>
              }
          </AnimatePresence>
          <div className="flex justify-center mt-3">
            <button onClick={() => setExpandServices((p) => !p)}
              className="text-[0.55rem] font-semibold text-primary/70 flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary/15 bg-primary/[0.04] hover:bg-primary/[0.08] transition-colors">
              <Layers className="w-3 h-3" /> {expandServices ? "Chiudi" : "Vedi Tutti"}
            </button>
          </div>
          </div>
        </div>

        {/* ═══ Desktop: Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4"
        variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {services.map((s, i) =>
          <motion.div key={i} variants={fadeUp}
          whileHover={{ scale: 1.03, y: -8 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}>
              <PremiumCard glow scan delay={i} className="p-5 sm:p-6">
                <div className="flex items-center justify-between mb-4">
                  <PremiumIcon gradient={s.color} size="md" delay={i * 0.3}>
                    {s.icon}
                  </PremiumIcon>
                  <motion.span className="text-[0.5rem] px-2.5 py-1 rounded-full border border-primary/15 bg-primary/[0.06] text-primary/70 font-bold tracking-[2px] font-heading relative overflow-hidden"
                animate={{ borderColor: ["hsla(265,70%,60%,0.1)", "hsla(265,70%,60%,0.25)", "hsla(265,70%,60%,0.1)"] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}>
                    <motion.div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.1) 50%, transparent 70%)" }}
                  animate={{ x: ["-150%", "250%"] }} transition={{ duration: 2, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }} />
                    <span className="relative z-10">{s.tag}</span>
                  </motion.span>
                </div>
                <h3 className="font-heading text-sm sm:text-base font-semibold text-foreground mb-2">{s.title}</h3>
                <p className="text-xs sm:text-sm text-foreground/40 leading-[1.7]">{s.desc}</p>
              </PremiumCard>
            </motion.div>
          )}
        </motion.div>
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                            ═══════════════════════════════════════════ */}
      <Section id="process" className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,5%,0.82) 0%, hsla(265,20%,10%,0.78) 35%, hsla(230,18%,9%,0.78) 65%, hsla(230,16%,5%,0.82) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsla(265,55%,50%,0.4), transparent 70%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsla(38,55%,50%,0.3), transparent 70%)", filter: "blur(110px)" }} />
        </div>
        <div className="text-center mb-12">
          <SectionLabel text="Processo" icon={<Zap className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08]"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Attivo in <span className="text-shimmer">4 Step</span>
          </motion.h2>
        </div>

        <div className="relative mb-1 rounded-2xl overflow-hidden isolate">
          {/* Opaque panel so global homepage background doesn't bleed under circuit schema */}
          <div
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              background: "linear-gradient(160deg, hsla(230,16%,6%,0.99), hsla(265,16%,8%,0.98))",
              border: "1px solid hsla(265,40%,45%,0.06)"
            }} />
          

          {/* AI Tech Network Schema — Desktop */}
          <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden hidden sm:block">
            <svg className="w-full h-full" viewBox="0 0 400 220" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="proc-node-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(265,70%,60%)" stopOpacity="0.5" />
                  <stop offset="100%" stopColor="hsl(265,70%,60%)" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="proc-line-g" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(265,55%,55%)" stopOpacity="0.25" />
                  <stop offset="50%" stopColor="hsl(38,45%,52%)" stopOpacity="0.18" />
                  <stop offset="100%" stopColor="hsl(265,55%,55%)" stopOpacity="0.25" />
                </linearGradient>
              </defs>
              {/* Dense network connections — all nodes interconnected */}
              {[
              /* Row 1 ↔ Row 2 */
              [100, 45, 200, 45], [200, 45, 300, 45], [100, 45, 300, 45],
              [100, 45, 60, 110], [100, 45, 160, 110], [100, 45, 260, 110],
              [200, 45, 60, 110], [200, 45, 160, 110], [200, 45, 260, 110], [200, 45, 340, 110],
              [300, 45, 160, 110], [300, 45, 260, 110], [300, 45, 340, 110],
              /* Row 2 ↔ Row 3 */
              [60, 110, 160, 110], [160, 110, 260, 110], [260, 110, 340, 110], [60, 110, 340, 110],
              [60, 110, 100, 180], [60, 110, 200, 180],
              [160, 110, 100, 180], [160, 110, 200, 180], [160, 110, 300, 180],
              [260, 110, 100, 180], [260, 110, 200, 180], [260, 110, 300, 180],
              [340, 110, 200, 180], [340, 110, 300, 180],
              /* Row 3 internal */
              [100, 180, 200, 180], [200, 180, 300, 180], [100, 180, 300, 180],
              /* Cross diagonals */
              [100, 45, 340, 110], [300, 45, 60, 110],
              [60, 110, 300, 180], [340, 110, 100, 180]].
              map(([x1, y1, x2, y2], i) =>
              <motion.line key={`pl${i}`} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#proc-line-g)" strokeWidth="0.6"
              initial={{ pathLength: 0, opacity: 0 }}
              whileInView={{ pathLength: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.02, duration: 0.5 }} />

              )}
              {/* Network nodes — 3 rows like the reference image */}
              {[
              /* Top row */
              [100, 45], [200, 45], [300, 45],
              /* Middle row */
              [60, 110], [160, 110], [260, 110], [340, 110],
              /* Bottom row */
              [100, 180], [200, 180], [300, 180]].
              map(([cx, cy], i) =>
              <g key={`pn${i}`}>
                  <circle cx={cx} cy={cy} r="14" fill="url(#proc-node-glow)" />
                  <motion.circle cx={cx} cy={cy} r="5"
                fill="hsla(265,55%,50%,0.35)" stroke="hsla(265,60%,60%,0.45)" strokeWidth="1"
                initial={{ scale: 0, opacity: 0 }}
                whileInView={{ scale: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.04, type: "spring", stiffness: 200 }} />

                  <motion.circle cx={cx} cy={cy} r="2.5"
                fill="hsla(38,50%,55%,0.5)"
                initial={{ scale: 0 }}
                whileInView={{ scale: [0, 1.3, 1] }}
                viewport={{ once: true }}
                transition={{ delay: 0.35 + i * 0.04, duration: 0.35 }}>

                    <animate attributeName="opacity" values="0.4;0.8;0.4" dur={`${2 + i * 0.2}s`} repeatCount="indefinite" />
                  </motion.circle>
                </g>
              )}
              {/* Animated data pulses traveling along key paths */}
              {[
              "M100,45 L260,110", "M300,45 L60,110", "M160,110 L300,180",
              "M60,110 L300,180", "M200,45 L200,180"].
              map((d, pi) =>
              <circle key={`pp${pi}`} r="1.5" fill="hsla(38,55%,58%,0.5)">
                  <animateMotion dur={`${2.5 + pi * 0.4}s`} begin={`${pi * 0.6}s`} repeatCount="indefinite" path={d} />
                  <animate attributeName="opacity" values="0;0.7;0" dur={`${2.5 + pi * 0.4}s`} begin={`${pi * 0.6}s`} repeatCount="indefinite" />
                </circle>
              )}
            </svg>
          </div>

          {/* AI Tech Network Schema — Mobile (hyper-tech hub-spoke circuit) */}
          <div className="absolute inset-0 pointer-events-none z-[1] overflow-hidden sm:hidden">
            <svg className="w-full h-full" viewBox="0 0 300 240" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="pm-hub-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="pm-circuit-v" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.15" />
                </linearGradient>
                <linearGradient id="pm-circuit-h" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
                </linearGradient>
              </defs>

              {/* Central hub — concentric rings */}
              <circle cx="150" cy="120" r="18" fill="url(#pm-hub-glow)" />
              <circle cx="150" cy="120" r="10" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" strokeDasharray="2,3" />
              <circle cx="150" cy="120" r="5" fill="none" stroke="hsl(var(--primary) / 0.35)" strokeWidth="0.6" />
              <circle cx="150" cy="120" r="2.5" fill="hsl(var(--primary) / 0.6)">
                <animate attributeName="r" values="2;3.5;2" dur="3s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;1;0.5" dur="3s" repeatCount="indefinite" />
              </circle>

              {/* Curved Bézier spokes from hub to 4 corners (icon positions) */}
              {/* Top-left (step 01) */}
              <path d="M150,120 Q110,95 75,60" fill="none" stroke="url(#pm-circuit-v)" strokeWidth="0.7" strokeDasharray="3,4" />
              <path d="M140,115 Q100,80 68,55" fill="none" stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.4" />
              {/* Top-right (step 02) */}
              <path d="M150,120 Q190,95 225,60" fill="none" stroke="url(#pm-circuit-v)" strokeWidth="0.7" strokeDasharray="3,4" />
              <path d="M160,115 Q200,80 232,55" fill="none" stroke="hsl(var(--primary) / 0.12)" strokeWidth="0.4" />
              {/* Bottom-left (step 03) */}
              <path d="M150,120 Q110,145 75,180" fill="none" stroke="url(#pm-circuit-v)" strokeWidth="0.7" strokeDasharray="3,4" />
              <path d="M140,125 Q100,160 68,185" fill="none" stroke="hsl(var(--accent) / 0.12)" strokeWidth="0.4" />
              {/* Bottom-right (step 04) */}
              <path d="M150,120 Q190,145 225,180" fill="none" stroke="url(#pm-circuit-v)" strokeWidth="0.7" strokeDasharray="3,4" />
              <path d="M160,125 Q200,160 232,185" fill="none" stroke="hsl(var(--accent) / 0.12)" strokeWidth="0.4" />

              {/* Cross-connections between adjacent icons (horizontal) */}
              <path d="M75,60 Q150,40 225,60" fill="none" stroke="url(#pm-circuit-h)" strokeWidth="0.5" strokeDasharray="2,5" />
              <path d="M75,180 Q150,200 225,180" fill="none" stroke="url(#pm-circuit-h)" strokeWidth="0.5" strokeDasharray="2,5" />
              {/* Vertical side connections */}
              <path d="M75,60 Q55,120 75,180" fill="none" stroke="hsl(var(--accent) / 0.18)" strokeWidth="0.45" strokeDasharray="2,4" />
              <path d="M225,60 Q245,120 225,180" fill="none" stroke="hsl(var(--accent) / 0.18)" strokeWidth="0.45" strokeDasharray="2,4" />

              {/* Corner junction nodes with glow */}
              {[[75, 60], [225, 60], [75, 180], [225, 180]].map(([cx, cy], i) =>
              <g key={`pm-corner-${i}`}>
                  <circle cx={cx} cy={cy} r="6" fill="url(#pm-hub-glow)" opacity="0.5" />
                  <circle cx={cx} cy={cy} r="2" fill="hsl(var(--primary) / 0.55)" stroke="hsl(var(--primary) / 0.3)" strokeWidth="0.5">
                    <animate attributeName="opacity" values="0.4;0.9;0.4" dur={`${2.2 + i * 0.3}s`} repeatCount="indefinite" />
                  </circle>
                </g>
              )}

              {/* Mid-spoke relay nodes */}
              {[[112, 90], [188, 90], [112, 150], [188, 150]].map(([cx, cy], i) =>
              <circle key={`pm-relay-${i}`} cx={cx} cy={cy} r="1.2" fill="hsl(var(--primary) / 0.4)">
                  <animate attributeName="opacity" values="0.2;0.7;0.2" dur={`${1.8 + i * 0.25}s`} repeatCount="indefinite" />
                </circle>
              )}

              {/* Data pulses along curved spokes */}
              <circle r="1.8" fill="hsl(var(--primary) / 0.9)">
                <animateMotion dur="3.5s" repeatCount="indefinite" path="M75,60 Q110,95 150,120 Q190,145 225,180" />
                <animate attributeName="opacity" values="0;0.9;0" dur="3.5s" repeatCount="indefinite" />
              </circle>
              <circle r="1.5" fill="hsl(var(--accent) / 0.94)">
                <animateMotion dur="4.2s" begin="0.8s" repeatCount="indefinite" path="M225,60 Q190,95 150,120 Q110,145 75,180" />
                <animate attributeName="opacity" values="0;0.8;0" dur="4.2s" begin="0.8s" repeatCount="indefinite" />
              </circle>
              <circle r="1.3" fill="hsl(var(--primary) / 0.7)">
                <animateMotion dur="5s" begin="1.5s" repeatCount="indefinite" path="M75,60 Q150,40 225,60 Q245,120 225,180 Q150,200 75,180 Q55,120 75,60" />
                <animate attributeName="opacity" values="0;0.6;0" dur="5s" begin="1.5s" repeatCount="indefinite" />
              </circle>
            </svg>
          </div>

          <div className="relative z-[2] grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5 p-2 sm:p-0">
            {[
            { step: "01", title: "Scegli il Settore", desc: "Empire configura moduli e flussi dedicati automaticamente.", icon: <Globe className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> },
            { step: "02", title: "Personalizza Brand", desc: "Logo, colori, dominio. L'IA genera il catalogo in 60 secondi.", icon: <Palette className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> },
            { step: "03", title: "Lancia il Sistema", desc: "App attiva, team formato, QR code installati. Operativo in 24h.", icon: <Rocket className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> },
            { step: "04", title: "Cresci con i Dati", desc: "Analytics real-time, suggerimenti IA, campagne automatizzate.", icon: <TrendingUp className="w-2.5 h-2.5 sm:w-4 sm:h-4" /> }].
            map((s, i) => {
              const dnaWave = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className="relative text-center z-10"
                  initial={{ opacity: 0, x: dnaWave ? -18 : 18, y: dnaWave ? -22 : 22, rotateY: dnaWave ? -12 : 12, scale: 0.86 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.12, duration: 0.58, type: "spring", stiffness: 160, damping: 18 }}
                  style={{ perspective: "900px" }}>

                  <motion.div
                    className="absolute top-[34px] sm:top-[42px] left-1/2 -translate-x-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full border border-primary/35 bg-primary/20 shadow-[0_0_10px_hsl(var(--primary)/0.35)] hidden lg:block"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.45, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.3, duration: 0.35 }} />

                  <div className="relative rounded-xl border border-foreground/[0.07] bg-card/95 sm:bg-card/90 backdrop-blur-sm p-2 sm:p-3 overflow-hidden">
                    <motion.div
                      className="relative w-[36px] h-[36px] sm:w-[62px] sm:h-[62px] rounded-lg mx-auto mb-1.5 sm:mb-2.5 overflow-hidden"
                      style={{ background: "hsla(265,20%,8%,0.7)", border: "1px solid hsla(265,70%,60%,0.14)", backdropFilter: "blur(8px)" }}
                      whileHover={{ rotate: 4, scale: 1.06, borderColor: "hsla(265,70%,60%,0.28)" }}>

                      <motion.div className="absolute inset-0 pointer-events-none"
                      style={{ background: "linear-gradient(180deg, transparent 40%, hsla(265,80%,70%,0.08) 50%, transparent 60%)" }}
                      animate={{ y: ["-100%", "200%"] }}
                      transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.6 + i * 0.3, ease: "easeInOut" }} />
                      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.28), transparent)" }} />
                      <div className="flex items-center justify-center w-full h-full text-primary relative z-10">{s.icon}</div>
                      <motion.span className="absolute -top-1.5 -right-1.5 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-vibrant-gradient flex items-center justify-center text-[0.45rem] sm:text-[0.5rem] font-bold text-primary-foreground font-heading z-20"
                      animate={{ boxShadow: ["0 0 8px hsla(265,70%,60%,0.2)", "0 0 20px hsla(265,70%,60%,0.45)", "0 0 8px hsla(265,70%,60%,0.2)"] }}
                      transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}>
                        {s.step}
                      </motion.span>
                    </motion.div>

                    <h3 className="font-heading text-[0.64rem] sm:text-xs font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-[0.54rem] sm:text-[0.62rem] text-foreground/40 leading-[1.45]">{s.desc}</p>
                  </div>
                </motion.div>);

            })}
          </div>
        </div>
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
          background: "linear-gradient(180deg, hsla(230,16%,4%,0.985) 0%, hsla(230,20%,6%,0.99) 30%, hsla(265,18%,7%,0.99) 60%, hsla(230,16%,4%,0.985) 100%)"
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
                  background: "linear-gradient(160deg, hsla(230,18%,11%,0.98), hsla(230,22%,7%,0.98))",
                  border: "1px solid hsla(265,40%,40%,0.1)"
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
                      background: "linear-gradient(160deg, hsla(230,18%,10%,0.97), hsla(230,22%,6%,0.97))",
                      border: `1px solid hsla(${t.color},35%,40%,0.15)`,
                      boxShadow: `0 0 20px hsla(${t.color},50%,40%,0.04)`
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
                          style={{ background: "hsla(0,35%,15%,0.3)", border: "1px solid hsla(0,35%,35%,0.08)" }}>
                            <div className="text-[0.35rem] uppercase tracking-widest text-foreground/20 mb-0.5">Prima</div>
                            <div className="text-[0.65rem] font-bold text-red-400/75 leading-tight">{t.before}</div>
                          </div>
                          <ArrowRight className="w-2.5 h-2.5 flex-shrink-0" style={{ color: `hsla(${t.color},55%,55%,0.45)` }} />
                          <div className="flex-1 rounded-lg py-1.5 px-1.5 text-center"
                          style={{ background: `hsla(${t.color},35%,15%,0.2)`, border: `1px solid hsla(${t.color},35%,35%,0.1)` }}>
                            <div className="text-[0.35rem] uppercase tracking-widest text-foreground/20 mb-0.5">Dopo</div>
                            <div className="text-[0.65rem] font-bold leading-tight" style={{ color: `hsla(${t.color},65%,65%,0.9)` }}>{t.after}</div>
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
                      background: "linear-gradient(160deg, hsla(230,18%,10%,0.98), hsla(230,22%,6%,0.98))",
                      border: `1px solid hsla(${t.color},30%,35%,0.12)`,
                      boxShadow: `0 0 30px hsla(${t.color},50%,40%,0.04)`
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
                          style={{ background: "hsla(0,40%,15%,0.25)", border: "1px solid hsla(0,40%,40%,0.1)" }}>
                            <div className="text-[0.5rem] uppercase tracking-wider text-foreground/25 mb-1">Prima</div>
                            <div className="text-sm font-bold text-red-400/80">{t.before}</div>
                          </div>
                          <motion.div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{ background: `hsla(${t.color},50%,50%,0.15)` }}
                          animate={{ scale: [1, 1.15, 1] }}
                          transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}>
                            <ArrowRight className="w-3.5 h-3.5" style={{ color: `hsla(${t.color},65%,60%,1)` }} />
                          </motion.div>
                          <div className="flex-1 rounded-xl p-3 text-center"
                          style={{ background: `hsla(${t.color},40%,15%,0.2)`, border: `1px solid hsla(${t.color},40%,40%,0.15)` }}>
                            <div className="text-[0.5rem] uppercase tracking-wider text-foreground/25 mb-1">Dopo</div>
                            <div className="text-sm font-bold" style={{ color: `hsla(${t.color},65%,65%,0.95)` }}>{t.after}</div>
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
              background: "linear-gradient(160deg, hsla(230,18%,10%,0.98), hsla(265,18%,8%,0.98))",
              border: "1px solid hsla(38,40%,40%,0.12)"
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
                      style={{ background: "hsla(230,18%,14%,0.9)", border: "1px solid hsla(265,30%,35%,0.12)", color: "hsla(38,60%,60%,0.7)" }}>
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
                             ROI CALCULATOR
                            ═══════════════════════════════════════════ */}
      <Section id="calculator" className="relative overflow-hidden hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.82) 0%, hsla(38,20%,9%,0.78) 15%, hsla(265,22%,10%,0.78) 35%, hsla(38,16%,8%,0.78) 55%, hsla(265,18%,9%,0.78) 75%, hsla(230,16%,4%,0.82) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] left-[18%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(38,65%,48%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[32%] right-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] right-[30%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[28%] left-[22%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,45%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[12%] right-[30%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(265,55%,55%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(38,55%,50%,0.2), hsla(265,50%,55%,0.12), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(38,50%,50%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-12">
          <SectionLabel text="ROI Calculator" icon={<TrendingUp className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Calcola Quanto <span className="text-shimmer">Stai Perdendo</span>
          </motion.h2>
          <motion.p className="text-foreground/35 max-w-md mx-auto text-xs sm:text-sm leading-relaxed"
          initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Ore spese in attività manuali = soldi bruciati. Vedi quanto risparmieresti automatizzando con l'IA.
          </motion.p>
        </div>

        <motion.div className="max-w-xl mx-auto p-7 sm:p-9 rounded-2xl glow-card space-y-6"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          {[
          { label: "Ore manuali / settimana", value: weeklyHours, min: 5, max: 60, step: 5, display: `${weeklyHours}h`, onChange: setWeeklyHours },
          { label: "Costo orario medio", value: hourlyCost, min: 10, max: 50, step: 5, display: `€${hourlyCost}/h`, onChange: setHourlyCost }].
          map((sl, i) =>
          <div key={i}>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-foreground/40 font-heading text-xs tracking-wider uppercase">{sl.label}</span>
                <span className="text-foreground font-bold font-heading text-sm">{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
            onChange={(e) => sl.onChange(Number(e.target.value))} className="w-full" />
            </div>
          )}

          <div className="space-y-3.5 pt-6 border-t border-border/30">
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-foreground/35">Costo attuale (manuale)</span>
                <span className="text-accent font-heading font-bold">€{Math.round(manualMonthlyCost).toLocaleString("it-IT")}/mese</span>
              </div>
              <div className="h-3 rounded-full bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-accent/50 to-accent/80"
                initial={{ width: 0 }} whileInView={{ width: "100%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.3 }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs mb-2">
                <span className="text-foreground/35">Con Empire AI (80% automatizzato)</span>
                <span className="text-primary font-heading font-bold">€{Math.round(automatedCost).toLocaleString("it-IT")}/mese</span>
              </div>
              <div className="h-3 rounded-full bg-foreground/[0.04] overflow-hidden">
                <motion.div className="h-full rounded-full bg-gradient-to-r from-primary/50 to-primary/80"
                initial={{ width: 0 }} whileInView={{ width: "20%" }} viewport={{ once: true }} transition={{ duration: 1, delay: 0.5 }} />
              </div>
            </div>
          </div>

          <div className="p-6 rounded-xl bg-gradient-to-br from-primary/[0.06] to-accent/[0.03] border border-primary/10 space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/50 font-heading">Risparmi netti / mese</span>
              <span className="text-2xl font-heading font-bold text-primary">€{Math.round(netMonthlySaving).toLocaleString("it-IT")}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-foreground/50 font-heading">Risparmi / anno</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€{Math.round(netMonthlySaving * 12).toLocaleString("it-IT")}</span>
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-primary/10">
              <span className="text-[0.65rem] text-foreground/35">Ore liberate / mese</span>
              <span className="text-foreground font-heading font-bold text-base">{hoursSavedMonth}h</span>
            </div>
          </div>
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
                             TESTIMONIALS — Auto-scroll carousel
                            ═══════════════════════════════════════════ */}
      <Section id="testimonials" className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.82) 0%, hsla(265,24%,10%,0.78) 15%, hsla(38,18%,9%,0.78) 35%, hsla(265,20%,10%,0.78) 55%, hsla(38,14%,8%,0.78) 75%, hsla(230,16%,4%,0.82) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] right-[18%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
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
              background: "linear-gradient(165deg, hsla(265,25%,8%,0.98), hsla(265,20%,5%,0.99))",
              border: "1px solid hsla(265,40%,50%,0.12)",
              backdropFilter: "blur(24px)"
            }}>
                  <div className="flex items-center gap-3 mb-3">
                    <img src={t.photo} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0"
                style={{ border: "2px solid hsla(265,50%,55%,0.25)" }} />
                    <div>
                      <h4 className="font-heading text-[0.7rem] font-semibold" style={{ color: "hsla(0,0%,100%,0.94)" }}>{t.name}</h4>
                      <p className="text-[0.5rem]" style={{ color: "hsla(38,50%,55%,0.5)" }}>{t.role}</p>
                    </div>
                    <span className="ml-auto text-base">{t.emoji}</span>
                  </div>
                  <p className="text-[0.65rem] leading-[1.7] mb-2" style={{ color: "hsla(0,0%,100%,0.5)" }}>"{t.quote}"</p>
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[0.55rem] font-semibold font-heading"
              style={{ background: "hsla(265,40%,25%,0.5)", border: "1px solid hsla(265,60%,55%,0.2)", color: "hsl(var(--primary))" }}>
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
                  background: "linear-gradient(165deg, hsla(265,25%,8%,0.98), hsla(265,20%,5%,0.99))",
                  border: "1px solid hsla(265,40%,50%,0.12)",
                  boxShadow: "0 16px 48px -12px hsla(265,50%,8%,0.5), inset 0 1px 0 hsla(265,60%,70%,0.06)",
                  backdropFilter: "blur(24px)"
                }}>
                      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, hsla(38,50%,55%,0.06) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 2s ease-in-out infinite" }} />
                      <div className="absolute top-0 left-0 w-5 h-5 border-t border-l rounded-tl-2xl pointer-events-none" style={{ borderColor: "hsla(38,50%,55%,0.2)" }} />
                      <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r rounded-br-2xl pointer-events-none" style={{ borderColor: "hsla(265,70%,60%,0.15)" }} />
                      <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.25), hsla(265,70%,60%,0.2), transparent)" }} />
                      <div className="relative mb-4 mt-1">
                        <img src={t.photo} alt={t.name} className="w-14 h-14 rounded-full object-cover mx-auto"
                    style={{ border: "2px solid hsla(265,50%,55%,0.25)", boxShadow: "0 0 20px -4px hsla(265,70%,60%,0.25)" }} />
                        <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: "hsla(265,30%,15%,0.9)", border: "1px solid hsla(265,40%,50%,0.2)", boxShadow: "0 4px 12px hsla(0,0%,0%,0.3)" }}>
                          {t.emoji}
                        </div>
                        <motion.div className="absolute -inset-2 rounded-full pointer-events-none"
                    style={{ border: "1px dashed hsla(265,50%,55%,0.12)" }}
                    animate={{ rotate: [0, 360] }} transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                      </div>
                      <h4 className="font-heading text-xs font-semibold mb-0.5" style={{ color: "hsla(0,0%,100%,0.94)" }}>{t.name}</h4>
                      <p className="text-[0.58rem] mb-4" style={{ color: "hsla(38,50%,55%,0.5)" }}>{t.role}</p>
                      <blockquote className="text-[0.75rem] sm:text-[0.8rem] leading-[1.8] mb-5 flex-1 px-1" style={{ color: "hsla(0,0%,100%,0.5)" }}>
                        <Quote className="w-3.5 h-3.5 mx-auto mb-2" style={{ color: "hsla(38,50%,55%,0.3)" }} />
                        "{t.quote}"
                      </blockquote>
                      <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.62rem] font-semibold font-heading tracking-wider"
                  style={{ background: "linear-gradient(135deg, hsla(265,40%,25%,0.5), hsla(265,30%,18%,0.4))", border: "1px solid hsla(265,60%,55%,0.2)", color: "hsl(var(--primary))" }}>
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

      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════════════════════════════════════════
                             PARTNER PROGRAM
                            ═══════════════════════════════════════════ */}
      <Section id="partner" className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.82) 0%, hsla(38,22%,9%,0.78) 15%, hsla(265,22%,10%,0.78) 32%, hsla(38,18%,9%,0.78) 50%, hsla(265,18%,9%,0.78) 72%, hsla(230,16%,4%,0.82) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[6%] left-[20%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
          style={{ background: "radial-gradient(circle, hsla(38,65%,48%,0.55), transparent 65%)", filter: "blur(140px)" }} />
          <div className="absolute top-[30%] right-[12%] w-[480px] h-[480px] rounded-full opacity-[0.05]"
          style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.45), transparent 65%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-[15%] left-[30%] w-[420px] h-[420px] rounded-full opacity-[0.04]"
          style={{ background: "radial-gradient(circle, hsla(155,50%,45%,0.35), transparent 65%)", filter: "blur(110px)" }} />
          <div className="absolute bottom-[28%] right-[25%] w-[350px] h-[350px] rounded-full opacity-[0.035]"
          style={{ background: "radial-gradient(circle, hsla(38,55%,45%,0.3), transparent 65%)", filter: "blur(100px)" }} />
          <div className="absolute top-[12%] right-[30%] w-[280px] h-[280px] rounded-full opacity-[0.03]"
          style={{ background: "radial-gradient(circle, hsla(265,55%,55%,0.25), transparent 60%)", filter: "blur(85px)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[65%] h-[1px]"
          style={{ background: "linear-gradient(90deg, transparent, hsla(38,55%,50%,0.22), hsla(265,50%,55%,0.12), transparent)" }} />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[95px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(38,55%,50%,0.4), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
          <div className="absolute inset-0 opacity-[0.012]" style={{
            backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E\")",
            backgroundRepeat: "repeat", backgroundSize: "128px 128px"
          }} />
        </div>
        <div className="text-center mb-12">
          <SectionLabel text="Partner Program" icon={<Handshake className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Guadagna Vendendo <span className="text-shimmer">Empire</span>
          </motion.h2>
        </div>

        <div className="relative mb-10 rounded-2xl overflow-hidden isolate">
          {/* Opaque mobile panel to prevent homepage background bleeding under circuit schema */}
          <div
            className="absolute inset-0 sm:hidden z-0"
            style={{
              background: "linear-gradient(155deg, hsla(230,14%,5%,0.99), hsla(230,12%,4%,0.99))",
              border: "1px solid hsla(38,40%,45%,0.08)"
            }} />
          

          {/* Mobile hyper-tech communication schema between KPI icons */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none z-[1] sm:hidden" viewBox="0 0 300 190" preserveAspectRatio="xMidYMid meet">
            <defs>
              <radialGradient id="partnerKpiHubGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.4" />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              </radialGradient>
              <linearGradient id="partnerKpiLink" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.35" />
                <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0.2" />
              </linearGradient>
            </defs>

            {/* Central hub */}
            <circle cx="150" cy="95" r="17" fill="url(#partnerKpiHubGlow)" />
            <circle cx="150" cy="95" r="8" fill="none" stroke="hsl(var(--primary) / 0.32)" strokeWidth="0.6" strokeDasharray="2,3" />
            <circle cx="150" cy="95" r="3" fill="hsl(var(--primary) / 0.55)">
              <animate attributeName="r" values="2.4;3.8;2.4" dur="2.8s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.5;1;0.5" dur="2.8s" repeatCount="indefinite" />
            </circle>

            {/* Curved spokes to each KPI */}
            <path d="M150,95 Q115,74 78,52" fill="none" stroke="url(#partnerKpiLink)" strokeWidth="0.75" strokeDasharray="3,4" />
            <path d="M150,95 Q185,74 222,52" fill="none" stroke="url(#partnerKpiLink)" strokeWidth="0.75" strokeDasharray="3,4" />
            <path d="M150,95 Q115,116 78,138" fill="none" stroke="url(#partnerKpiLink)" strokeWidth="0.75" strokeDasharray="3,4" />
            <path d="M150,95 Q185,116 222,138" fill="none" stroke="url(#partnerKpiLink)" strokeWidth="0.75" strokeDasharray="3,4" />

            {/* Secondary communication loops between KPI nodes */}
            <path d="M78,52 Q150,30 222,52" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" strokeDasharray="2,5" />
            <path d="M78,138 Q150,160 222,138" fill="none" stroke="hsl(var(--primary) / 0.2)" strokeWidth="0.5" strokeDasharray="2,5" />
            <path d="M78,52 Q56,95 78,138" fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth="0.45" strokeDasharray="2,4" />
            <path d="M222,52 Q244,95 222,138" fill="none" stroke="hsl(var(--accent) / 0.2)" strokeWidth="0.45" strokeDasharray="2,4" />

            {/* Corner + relay nodes */}
            {[[78, 52], [222, 52], [78, 138], [222, 138], [114, 75], [186, 75], [114, 115], [186, 115]].map(([cx, cy], i) =>
            <circle key={`partner-kpi-node-${i}`} cx={cx} cy={cy} r={i < 4 ? "1.9" : "1.2"} fill="hsl(var(--primary) / 0.5)">
                <animate attributeName="opacity" values="0.3;0.85;0.3" dur={`${2 + i * 0.28}s`} repeatCount="indefinite" />
              </circle>
            )}

            {/* Data pulses on communication routes */}
            <circle r="1.7" fill="hsl(var(--primary) / 0.9)">
              <animateMotion dur="3.8s" repeatCount="indefinite" path="M78,52 Q115,74 150,95 Q185,116 222,138" />
              <animate attributeName="opacity" values="0;0.85;0" dur="3.8s" repeatCount="indefinite" />
            </circle>
            <circle r="1.5" fill="hsl(var(--accent) / 0.94)">
              <animateMotion dur="4.6s" begin="0.9s" repeatCount="indefinite" path="M222,52 Q185,74 150,95 Q115,116 78,138" />
              <animate attributeName="opacity" values="0;0.8;0" dur="4.6s" begin="0.9s" repeatCount="indefinite" />
            </circle>
          </svg>

          <motion.div className="relative z-[2] grid grid-cols-2 sm:grid-cols-4 gap-3 p-2 sm:p-0"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
            {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-2.5 h-2.5 sm:w-5 sm:h-5" /> },
            { value: "€50", label: "Override TL", icon: <Award className="w-2.5 h-2.5 sm:w-5 sm:h-5" /> },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-2.5 h-2.5 sm:w-5 sm:h-5" /> },
            { value: "€1.500", label: "Bonus Elite", icon: <Rocket className="w-2.5 h-2.5 sm:w-5 sm:h-5" /> }].
            map((s, i) =>
            <motion.div key={i} variants={popIn}>
                <PremiumCard glow scan delay={i} className="p-3.5 sm:p-6 text-center">
                  <div className="flex justify-center mb-2.5 sm:mb-3">
                    <PremiumIcon gradient="from-primary/20 to-accent/15" size={IS_MOBILE_LP ? "sm" : "md"} delay={i * 0.4}>
                      <span className="text-primary">{s.icon}</span>
                    </PremiumIcon>
                  </div>
                  <motion.p className="text-lg sm:text-2xl font-heading font-bold text-vibrant-gradient"
                animate={{ textShadow: ["0 0 10px hsla(265,70%,60%,0)", "0 0 20px hsla(265,70%,60%,0.3)", "0 0 10px hsla(265,70%,60%,0)"] }}
                transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>{s.value}</motion.p>
                  <p className="text-[0.52rem] sm:text-[0.6rem] text-foreground/40 mt-1 tracking-wider uppercase font-heading">{s.label}</p>
                </PremiumCard>
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Career path */}
        <motion.div className="p-6 rounded-2xl glow-card mb-10"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-6 tracking-[3px] uppercase">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0">
            {[
            { title: "Partner", desc: "€997 per ogni vendita chiusa", icon: <Handshake className="w-5 h-5" /> },
            { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
            { title: "Team Leader", desc: "+€50 override per vendita team", icon: <Crown className="w-5 h-5" /> }].
            map((s, i) =>
            <div key={i} className="flex sm:flex-col items-center gap-3.5 text-center w-full sm:w-auto">
                <motion.div
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"
                whileHover={{ scale: 1.1, rotate: 5 }}>
                
                  {s.icon}
                </motion.div>
                <div className="text-left sm:text-center">
                  <p className="text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-[0.6rem] text-foreground/35">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/15 mx-6 flex-shrink-0" />}
              </div>
            )}
          </div>
        </motion.div>

        {/* Scenario */}
        <motion.div className="p-6 rounded-2xl glow-card max-w-sm mx-auto"
        variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-4 tracking-[3px] uppercase">Scenario: 5 vendite/mese</h3>
          <div className="space-y-3 text-sm">
            <div className="flex justify-between"><span className="text-foreground/35 text-xs">5× Commissioni</span><span className="font-bold text-foreground text-sm">€4.985</span></div>
            <div className="flex justify-between"><span className="text-foreground/35 text-xs">Bonus Elite (5+)</span><span className="font-bold text-foreground text-sm">€1.500</span></div>
            <div className="flex justify-between pt-3 border-t border-border/30">
              <span className="font-semibold text-foreground text-sm">Totale mensile</span>
              <span className="text-2xl font-heading font-bold text-vibrant-gradient">€6.485</span>
            </div>
          </div>
        </motion.div>

        <div className="text-center mt-8">
          <motion.button
            onClick={() => navigate("/partner/register")}
            className="px-8 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.2)" }}
            whileTap={{ scale: 0.97 }}>
            
            Diventa Partner <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
                             FAQ
                            ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(265,24%,10%,0.96) 15%, hsla(38,18%,9%,0.96) 35%, hsla(265,20%,10%,0.96) 55%, hsla(38,14%,8%,0.96) 75%, hsla(230,16%,4%,0.96) 100%)"
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-[8%] left-[15%] w-[550px] h-[550px] rounded-full opacity-[0.06]"
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]"
          style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.35), transparent)" }} />
          <div className="absolute bottom-0 left-0 right-0 h-[70px]"
          style={{ background: "linear-gradient(180deg, transparent, hsla(230,16%,4%,0.8))" }} />
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
            <p className="text-sm text-foreground/35 leading-[1.7] max-w-xs mx-auto lg:mx-0">
              Tutto su Empire: settori, costi, sicurezza, capacità e partnership.
            </p>
          </motion.div>

          <motion.div className="space-y-3 w-full"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {faqs.map((faq, i) =>
            <motion.div key={i} className="rounded-xl glow-card overflow-hidden" variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
              className="relative z-10 w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-xs sm:text-sm font-semibold text-foreground pr-3 font-heading">{faq.q}</span>
                  <motion.div
                  animate={{ rotate: openFaq === i ? 45 : 0 }}
                  className="w-7 h-7 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0 text-primary text-sm font-heading font-bold">
                  
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i &&
                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-xs sm:text-sm text-foreground/40 leading-[1.7]">{faq.a}</p>
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
      <Section>
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
            <p className="text-sm text-foreground/40 max-w-md mx-auto leading-[1.8] mb-6">
               Prova Empire per 90 giorni senza impegno. Se non vedi risultati concreti, ti rimborsiamo. Zero rischi. Il tuo successo è la nostra priorità.
             </p>
             <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
               {[
               { icon: <Check className="w-4 h-4" />, text: "90 giorni senza impegno" },
               { icon: <Check className="w-4 h-4" />, text: "Assistenza dedicata inclusa" },
               { icon: <Check className="w-4 h-4" />, text: "Cancella quando vuoi" }].
              map((g, i) =>
              <div key={i} className="flex items-center gap-2 text-xs text-foreground/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">{g.icon}</div>
                  <span className="font-heading font-semibold">{g.text}</span>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </Section>

      {/* <SectionDivider /> — hidden redesign */}

      {/* EMPIRE STORY & TEAM — hidden redesign */}
      {/* <SectionDivider /> — hidden redesign */}

      {/* ═══════ FINAL CTA ═══════ */}
      <Section>
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
            <p className="text-sm text-foreground/35 max-w-md mx-auto mb-8">
              25+ settori, automazione totale, IA integrata, aggiornamenti settimanali. I tuoi competitor si stanno digitalizzando. Non restare indietro.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <motion.button onClick={() => navigate("/admin")}
              className="w-full sm:w-auto px-9 py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase flex items-center justify-center gap-2"
              whileHover={{ scale: 1.03, boxShadow: "0 20px 60px hsla(265,70%,60%,0.25)" }}
              whileTap={{ scale: 0.97 }}>
                
                Sono un Imprenditore <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button onClick={() => navigate("/partner/register")}
              className="w-full sm:w-auto px-9 py-4 rounded-full border border-foreground/10 text-foreground/70 font-bold text-sm font-heading tracking-wide hover:border-primary/30 hover:text-foreground transition-all backdrop-blur-sm"
              whileHover={{ scale: 1.02 }}>
                
                Diventa Partner
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" className="relative py-20 pb-10 px-5 sm:px-6 overflow-hidden"
      style={mobilifyBg({ background: "linear-gradient(180deg, hsla(230,16%,4%,0.96) 0%, hsla(265,22%,7%,0.96) 12%, hsla(38,14%,6%,0.96) 28%, hsla(265,20%,8%,0.96) 45%, hsla(155,12%,6%,0.96) 62%, hsla(265,18%,5%,0.96) 80%, hsla(230,16%,3%,0.96) 100%)" })}>
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
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1px] h-[90px] opacity-[0.06]" style={{ background: "linear-gradient(180deg, hsla(265,50%,55%,0.4), transparent)" }} />
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
            <motion.p className="text-[0.7rem] text-white/25 max-w-[340px] leading-[1.8] font-light"
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
                <p key={i} className="text-white/25 hover:text-white/60 transition-colors cursor-default flex items-center gap-2">
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
                { label: "Partner Program", href: "#partner" },
                { label: "Demo Live", href: "/demo" }].
                map((link, i) =>
                <a key={i} href={link.href} className="block text-white/25 hover:text-white/60 transition-colors flex items-center gap-2">
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
                <p key={i} className="text-white/25 hover:text-white/60 transition-colors cursor-default flex items-center gap-2">
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
                <p className="text-white/25 flex items-center gap-2.5"><Mail className="w-3.5 h-3.5" style={{ color: "hsla(265,70%,60%,0.5)" }} /> info@empire-suite.it</p>
                <p className="text-white/25 flex items-center gap-2.5"><MapPin className="w-3.5 h-3.5" style={{ color: "hsla(265,70%,60%,0.5)" }} /> Roma, Italia</p>
                <div className="pt-3">
                  <a href="/privacy" className="block text-white/20 hover:text-white/50 transition-colors mb-2">Privacy Policy</a>
                  <a href="/cookie-policy" className="block text-white/20 hover:text-white/50 transition-colors">Cookie Policy</a>
                </div>
              </div>
              {/* Social icons */}
              <div className="flex gap-2.5 mt-5">
                {["In", "𝕏", "IG"].map((s, i) =>
                <motion.div key={i}
                className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.6rem] text-white/20 cursor-pointer transition-all duration-300"
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
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-[0.6rem] text-white/15">
              <p className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsla(130,60%,50%,0.5)", boxShadow: "0 0 6px hsla(130,60%,50%,0.3)" }} />
                <span className="text-white/25">Tutti i sistemi operativi</span>
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
        style={{ background: IS_MOBILE_LP ? "hsla(0,0%,4%,0.98)" : "linear-gradient(180deg, hsla(0,0%,4%,0.98), hsla(38,12%,7%,0.92))" }}
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
    </div>);

};

export default LandingPage;