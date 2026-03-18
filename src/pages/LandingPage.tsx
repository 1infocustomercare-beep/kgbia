import { useState, useEffect, useRef, forwardRef, useMemo, lazy, Suspense } from "react";
import InteractiveParticleSphere from "@/components/public/InteractiveParticleSphere";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import FunnelDNAVisual from "@/components/public/FunnelDNAVisual";
import IndustryPhoneShowcase, { IPhoneFrame, getSectorStyle } from "@/components/public/IndustryPhoneShowcase";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";
import { DEMO_INDUSTRY_DATA } from "@/data/demo-industries";

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
  ChevronRight, ChevronLeft, Pause, CircleCheck, Minus, Activity, ServerCog, Gauge,
  Workflow, ScanLine, Database, Wifi, Timer, LineChart,
  Network, Atom, Radar, BrainCircuit, CircuitBoard, Waypoints, Binary
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { DEMO_SLUGS } from "@/data/demo-industries";
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
import { useSiteAssets } from "@/hooks/useSiteAssets";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";
import MultiSectorShowcase from "@/components/public/MultiSectorShowcase";
const EmpireTeamStory = lazy(() => import("@/components/public/EmpireTeamStory"));

/* Build a lookup from site_assets — custom URL overrides bundled default */
function useLandingAssets() {
  const { data: assets } = useSiteAssets();
  const map = useMemo(() => {
    const m: Record<string, string> = {};
    (assets || []).forEach(a => { if (a.resolvedUrl) m[a.slot_key] = a.resolvedUrl; });
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
    cartoonHotel: map["landing.sector_hotel"] || cartoonHotelDefault,
  };
}

const SafeEmpireVoiceAgent = () => <EmpireVoiceAgent />;

/* ═══════════════════════════════════════════
   HELPERS
   ═══════════════════════════════════════════ */

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{prefix}{display.toLocaleString("it-IT")}{suffix}</span>;
};

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, ref) => (
    <section ref={ref} id={id} className={`relative py-20 sm:py-28 px-5 sm:px-6 overflow-hidden ${className}`} style={style}>
      <div className="max-w-[1100px] mx-auto relative z-10">{children}</div>
    </section>
  )
);
Section.displayName = "Section";

const SectionLabel = forwardRef<HTMLDivElement, { text: string; icon?: React.ReactNode }>(
  ({ text, icon }, ref) => (
    <motion.div
      ref={ref}
      className="inline-flex items-center gap-2.5 mb-5"
      initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}
    >
      <div className="relative flex items-center gap-2 px-4 py-2 rounded-full premium-label overflow-hidden" style={{ borderLeft: "1px solid hsla(35,45%,50%,0.15)" }}>
        {/* Scanning beam — gold tint */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(90deg, transparent 30%, hsla(35,45%,55%,0.12) 50%, transparent 70%)" }}
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
        />
        {icon || <motion.span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(35,45%,50%)" }} animate={{ scale: [1, 1.4, 1], opacity: [0.7, 1, 0.7] }} transition={{ duration: 2, repeat: Infinity }} />}
        <span className="text-[0.65rem] font-heading font-semibold tracking-[3px] uppercase text-primary/90 relative z-10">{text}</span>
      </div>
    </motion.div>
  )
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
  { agent: "Data Guardian", action: "Audit GDPR completato — 100% OK", icon: <Lock className="w-3.5 h-3.5" />, color: "hsla(220,30%,50%,1)", time: "40s fa" },
];

const LiveFeedSimulator = () => {
  const [offset, setOffset] = useState(0);
  const VISIBLE = 6;

  useEffect(() => {
    const interval = setInterval(() => {
      setOffset((o) => (o + 1) % LIVE_ACTIONS.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  const visible = useMemo(() => {
    const items = [];
    for (let i = 0; i < VISIBLE; i++) {
      items.push(LIVE_ACTIONS[(offset + i) % LIVE_ACTIONS.length]);
    }
    return items;
  }, [offset]);

  return (
    <AnimatePresence mode="popLayout">
      {visible.map((item, i) => (
        <motion.div
          key={`${item.agent}-${(offset + i) % LIVE_ACTIONS.length}`}
          initial={{ opacity: 0, y: -12, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.95 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex items-center gap-2.5 px-3 py-2 rounded-lg"
          style={{
            background: i === 0 ? `linear-gradient(135deg, ${item.color}0D, transparent)` : "transparent",
            borderLeft: i === 0 ? `2px solid ${item.color}60` : "2px solid transparent",
          }}
        >
          <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{ background: `${item.color}15`, color: item.color }}>
            {item.icon}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="text-[0.55rem] font-bold text-foreground/90 truncate">{item.agent}</span>
              {i === 0 && <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse flex-shrink-0" />}
            </div>
            <p className="text-[0.5rem] text-foreground/40 truncate">{item.action}</p>
          </div>
          <span className="text-[0.4rem] text-foreground/25 whitespace-nowrap flex-shrink-0">{item.time}</span>
        </motion.div>
      ))}
    </AnimatePresence>
  );
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
  const CELL_COUNT = isMobile ? 20 : 40;
  const VB_W = isMobile ? 60 : 100;
  const VB_H = isMobile ? 130 : 100;

  const cells = useMemo(() =>
    Array.from({ length: CELL_COUNT }, (_, i) => ({
      id: i,
      x: Math.random() * VB_W,
      y: Math.random() * VB_H,
      delay: Math.random() * 6,
    })), [CELL_COUNT, VB_W, VB_H]
  );

  const connections = useMemo(() => {
    const conns: { a: number; b: number }[] = [];
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

  // On mobile, drastically limit animated pulses to prevent GPU thrashing
  const pulseConns = isMobile ? connections.filter((_, i) => i % 8 === 0) : connections.filter((_, i) => i % 2 === 0);
  const goldConns = isMobile ? connections.filter((_, i) => i % 12 === 0) : connections.filter((_, i) => i % 4 === 0);

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: isMobile ? 0.8 : 0.7, willChange: "opacity, transform", transform: "translateZ(0)" }}
      initial={{ opacity: 0, scale: 1.3 }}
      animate={born ? { opacity: isMobile ? 0.8 : 0.7, scale: 1 } : { opacity: 0, scale: 1.3 }}
      transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* DNA Birth Pulse — expanding ring from center when page loads */}
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ border: "2px solid hsla(38,50%,55%,0.35)" }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={born ? { width: "200vmax", height: "200vmax", opacity: 0 } : {}}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full pointer-events-none"
        style={{ border: "1px solid hsla(38,50%,55%,0.3)" }}
        initial={{ width: 0, height: 0, opacity: 1 }}
        animate={born ? { width: "200vmax", height: "200vmax", opacity: 0 } : {}}
        transition={{ duration: 2.5, ease: "easeOut", delay: 0.3 }}
      />

      {/* ═══ TECH CIRCUIT GRID — hexagonal + micro-grid overlay ═══ */}
      <svg className="absolute inset-0 w-full h-full" style={{ opacity: isMobile ? 0.04 : 0.045 }} xmlns="http://www.w3.org/2000/svg">
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

      {/* ═══ VERTICAL DATA STREAMS — tech flow lines ═══ */}
      {(isMobile ? [15, 50, 85] : [8, 25, 42, 58, 75, 92]).map((x, i) => (
        <div key={`vstream-${i}`} className="absolute top-0 bottom-0 w-px" style={{ left: `${x}%`, background: `hsla(215,35%,50%,0.03)` }}>
          <motion.div className="absolute w-full left-0 rounded-full"
            style={{ height: isMobile ? "60px" : "100px", background: `linear-gradient(180deg, transparent, hsla(210,55%,62%,0.25), transparent)` }}
            animate={{ top: ["-10%", "110%"] }}
            transition={{ duration: 10 + i * 2.5, repeat: Infinity, ease: "linear", delay: i * 1.8 }}
          />
        </div>
      ))}

      {/* ═══ HORIZONTAL SCAN LINES ═══ */}
      {(isMobile ? [0] : [0, 1]).map((i) => (
        <motion.div key={`hscan-${i}`} className="absolute left-0 right-0 h-px"
          style={{ background: `linear-gradient(90deg, transparent 5%, hsla(210,45%,58%,0.08) 30%, hsla(215,50%,65%,0.14) 50%, hsla(210,45%,58%,0.08) 70%, transparent 95%)` }}
          animate={{ top: ["-3%", "103%"] }}
          transition={{ duration: 18 + i * 7, repeat: Infinity, ease: "linear", delay: i * 5 }}
        />
      ))}

      {/* ═══ PULSING TECH NODES — intersection dots ═══ */}
      {(isMobile
        ? [{ x: 15, y: 25 }, { x: 50, y: 50 }, { x: 85, y: 75 }]
        : [
            { x: 8, y: 18 }, { x: 25, y: 40 }, { x: 42, y: 12 }, { x: 58, y: 60 },
            { x: 75, y: 30 }, { x: 92, y: 55 }, { x: 35, y: 80 }, { x: 65, y: 90 },
          ]
      ).map((pos, i) => (
        <motion.div key={`tnode-${i}`} className="absolute w-1 h-1 rounded-full"
          style={{ left: `${pos.x}%`, top: `${pos.y}%`, background: `hsla(210,55%,62%,0.25)`, boxShadow: `0 0 8px hsla(210,55%,62%,0.15)` }}
          animate={{ opacity: [0.15, 0.5, 0.15], scale: [0.7, 1.4, 0.7] }}
          transition={{ duration: 4 + i * 0.6, repeat: Infinity, delay: i * 0.5 }}
        />
      ))}

      {/* ═══ ORIGINAL NEURAL CELLS SVG ═══ */}
      <svg className="w-full h-full" viewBox={`0 0 ${VB_W} ${VB_H}`} preserveAspectRatio="xMidYMid slice">
        {/* Only add SVG filter on desktop — feGaussianBlur is expensive on mobile GPU */}
        {!isMobile && (
          <defs>
            <filter id="pulseGlow">
              <feGaussianBlur stdDeviation="0.3" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
          </defs>
        )}

        {/* Connection lines — STATIC on mobile (no motion.line), animated on desktop */}
        {isMobile ? (
          connections.map(({ a, b }, i) => (
            <line
              key={`ln${i}`}
              x1={cells[a].x} y1={cells[a].y}
              x2={cells[b].x} y2={cells[b].y}
              stroke={i % 6 === 0 ? "hsla(38,50%,55%,0.25)" : "hsla(220,15%,55%,0.12)"}
              strokeWidth="0.2"
            />
          ))
        ) : (
          connections.map(({ a, b }, i) => (
            <motion.line
              key={`ln${i}`}
              x1={cells[a].x} y1={cells[a].y}
              x2={cells[b].x} y2={cells[b].y}
              stroke={i % 6 === 0 ? "hsla(38,50%,55%,0.35)" : "hsla(220,15%,55%,0.18)"}
              strokeWidth="0.15"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.1, 0.4, 0.1] }}
              transition={{ duration: 5 + (i % 4) * 2, repeat: Infinity, delay: i * 0.15, ease: "easeInOut" }}
            />
          ))
        )}

        {/* Warm data pulses — no SVG filter on mobile */}
        {pulseConns.map(({ a, b }, i) => (
          <motion.circle
            key={`vp${i}`}
            r={isMobile ? "0.35" : "0.25"}
            fill="hsla(32,55%,60%,0.85)"
            filter={isMobile ? undefined : "url(#pulseGlow)"}
            initial={{ cx: cells[a].x, cy: cells[a].y, opacity: 0 }}
            animate={{
              cx: [cells[a].x, cells[b].x],
              cy: [cells[a].y, cells[b].y],
              opacity: [0, 0.9, 0],
            }}
            transition={{ duration: 2 + Math.random() * 2, repeat: Infinity, delay: i * 0.4, ease: "easeInOut" }}
          />
        ))}

        {/* Gold data pulses — no SVG filter on mobile */}
        {goldConns.map(({ a, b }, i) => (
          <motion.circle
            key={`gp${i}`}
            r={isMobile ? "0.3" : "0.2"}
            fill="hsla(38,60%,58%,0.9)"
            filter={isMobile ? undefined : "url(#pulseGlow)"}
            initial={{ cx: cells[b].x, cy: cells[b].y, opacity: 0 }}
            animate={{
              cx: [cells[b].x, cells[a].x],
              cy: [cells[b].y, cells[a].y],
              opacity: [0, 0.85, 0],
            }}
            transition={{ duration: 2.5 + Math.random() * 2, repeat: Infinity, delay: 1.5 + i * 0.8, ease: "easeInOut" }}
          />
        ))}

        {/* Junction nodes — static on mobile, animated on desktop */}
        {isMobile ? (
          cells.filter((_, i) => i % 3 === 0).map((cell) => (
            <circle
              key={`node${cell.id}`}
              cx={cell.x} cy={cell.y}
              r="0.3"
              fill="hsla(38,45%,55%,0.3)"
            />
          ))
        ) : (
          cells.filter((_, i) => i % 2 === 0).map((cell) => (
            <motion.circle
              key={`node${cell.id}`}
              cx={cell.x} cy={cell.y}
              r="0.25"
              fill="hsla(38,45%,55%,0.35)"
              animate={{
                r: [0.15, 0.4, 0.15],
                opacity: [0.25, 0.6, 0.25],
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: cell.delay, ease: "easeInOut" }}
            />
          ))
        )}
      </svg>
    </motion.div>
  );
};


const PremiumIcon = ({ children, gradient, size = "md", delay = 0 }: { children: React.ReactNode; gradient: string; size?: "sm" | "md" | "lg"; delay?: number }) => {
  const sizeClasses = size === "sm" ? "w-8 h-8 sm:w-10 sm:h-10 rounded-xl" : size === "lg" ? "w-12 h-12 rounded-2xl" : "w-10 h-10 rounded-xl";
  return (
    <motion.div className="relative group/icon" whileHover={{ scale: 1.15, rotate: -4 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
      {/* Ambient glow */}
      <motion.div
        className={`absolute -inset-2 ${sizeClasses} opacity-0 group-hover/icon:opacity-100 transition-opacity duration-700 blur-xl`}
        style={{ background: `linear-gradient(135deg, hsla(38,50%,55%,0.25), hsla(32,40%,50%,0.15))` }}
      />
      {/* Outer pulse ring */}
      <motion.div
        className={`absolute -inset-1.5 ${sizeClasses} pointer-events-none`}
        style={{ border: "1px solid hsla(38,50%,55%,0.15)" }}
        animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 3, repeat: Infinity, delay: delay * 0.5, ease: "easeInOut" }}
      />
      {/* Rotating ring */}
      <motion.div
        className={`absolute -inset-0.5 ${sizeClasses}`}
        style={{ border: "1.5px solid transparent", borderTopColor: "hsla(38,50%,55%,0.35)", borderRightColor: "hsla(32,40%,50%,0.2)" }}
        animate={{ rotate: [0, 360] }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear", delay }}
      />
      {/* Counter ring */}
      <motion.div
        className={`absolute inset-0 ${sizeClasses}`}
        style={{ border: "1px solid transparent", borderBottomColor: "hsla(32,35%,55%,0.2)" }}
        animate={{ rotate: [360, 0] }}
        transition={{ duration: 14, repeat: Infinity, ease: "linear", delay: delay + 1 }}
      />
      {/* Main container */}
      <div className={`relative ${sizeClasses} bg-gradient-to-br ${gradient} flex items-center justify-center text-white shadow-lg overflow-hidden`}
        style={{ boxShadow: "0 4px 20px hsla(38,50%,50%,0.12), inset 0 1px 1px rgba(255,255,255,0.15)" }}>
        {/* Shimmer sweep */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ background: "linear-gradient(105deg, transparent 35%, rgba(255,255,255,0.35) 50%, transparent 65%)" }}
          animate={{ x: ["-150%", "250%"] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 + delay, ease: "easeInOut" }}
        />
        {/* Inner glow */}
        <div className="absolute inset-px rounded-[inherit] border border-white/10 pointer-events-none" />
        <div className="relative z-10">{children}</div>
      </div>
    </motion.div>
  );
};

/* ═══ Premium Animated Card ═══ */
const PremiumCard = ({ children, className = "", hover = true, glow = false, scan = false, delay = 0 }: { children: React.ReactNode; className?: string; hover?: boolean; glow?: boolean; scan?: boolean; delay?: number }) => (
  <motion.div
    className={`relative rounded-2xl border overflow-hidden group/card premium-card-glass ${className}`}
    style={{
      background: "linear-gradient(145deg, hsla(230,10%,14%,0.95), hsla(230,8%,10%,0.92))",
      backdropFilter: "blur(20px) saturate(1.4)",
      borderColor: "hsla(38,40%,55%,0.1)",
    }}
    whileHover={hover ? {
      y: -6,
      borderColor: "hsla(38,45%,55%,0.25)",
      boxShadow: "0 20px 60px hsla(38,45%,50%,0.1), 0 0 30px hsla(38,45%,50%,0.05), inset 0 1px 0 hsla(38,50%,70%,0.08)",
      transition: { duration: 0.4, ease: "easeOut" },
    } : undefined}
  >
    {/* Top accent line — animated gradient */}
    <motion.div className="absolute top-0 left-0 right-0 h-px z-10"
      style={{ background: "linear-gradient(90deg, transparent, hsla(35,45%,55%,0.2), hsla(38,50%,60%,0.2), hsla(35,45%,55%,0.15), transparent)" }}
      animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
    />
    {/* Corner accents — gold, always slightly visible */}
    <div className="absolute top-2 left-2 w-4 h-4 border-t border-l rounded-tl-sm pointer-events-none opacity-20 group-hover/card:opacity-60 transition-opacity duration-500" style={{ borderColor: "hsla(35,45%,55%,0.35)" }} />
    <div className="absolute bottom-2 right-2 w-4 h-4 border-b border-r rounded-br-sm pointer-events-none opacity-20 group-hover/card:opacity-60 transition-opacity duration-500" style={{ borderColor: "hsla(35,45%,55%,0.35)" }} />
    {/* Scanning beam — more visible */}
    {scan && (
      <motion.div
        className="absolute inset-0 pointer-events-none z-0"
        style={{ background: "linear-gradient(180deg, transparent 35%, hsla(38,50%,60%,0.05) 50%, transparent 65%)" }}
        animate={{ y: ["-100%", "200%"] }}
        transition={{ duration: 3.5, repeat: Infinity, repeatDelay: 1.5 + delay, ease: "easeInOut" }}
      />
    )}
    {/* Ambient glow on hover — stronger */}
    {glow && (
      <motion.div className="absolute -top-8 -right-8 w-32 h-32 rounded-full pointer-events-none opacity-0 group-hover/card:opacity-100 transition-opacity duration-700"
        style={{ background: "radial-gradient(circle, hsla(38,50%,55%,0.1), transparent)" }}
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />
    )}
    {/* Bottom glow line */}
    <div className="absolute bottom-0 left-3 right-3 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500" />
    {/* Inner glass reflection */}
    <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsla(38,30%,70%,0.03) 0%, transparent 40%)" }} />
    <div className="relative z-10">{children}</div>
  </motion.div>
);

const smoothEase = [0.22, 1, 0.36, 1] as const;
/** Shared viewport config — triggers animations 200px before element enters screen on mobile */
const vpOnce = { once: true, margin: "0px 0px -150px 0px" as any } as const;
const fadeUp = { hidden: { opacity: 0, y: 25 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: smoothEase } } };
const fadeScale = { hidden: { opacity: 0, y: 10, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.4, ease: smoothEase } } };
const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.07, delayChildren: 0.05 } } };
const staggerFast = { hidden: {}, visible: { transition: { staggerChildren: 0.04, delayChildren: 0.03 } } };
const slideInLeft = { hidden: { opacity: 0, x: -30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: smoothEase } } };
const slideInRight = { hidden: { opacity: 0, x: 30 }, visible: { opacity: 1, x: 0, transition: { duration: 0.5, ease: smoothEase } } };
const popIn = { hidden: { opacity: 0, scale: 0.9 }, visible: { opacity: 1, scale: 1, transition: { type: "spring" as const, stiffness: 200, damping: 24 } } };

/* ═══ Floating Particle ═══ */
const Particle = ({ delay, size, x, y }: { delay: number; size: number; x: string; y: string }) => (
  <motion.div
    className="absolute rounded-full"
    style={{ width: size, height: size, left: x, top: y, background: delay % 2 === 0 ? "hsl(38, 45%, 52%)" : "hsl(32, 35%, 55%)" }}
    animate={{ y: [0, -25, 0], opacity: [0.1, 0.35, 0.1], scale: [1, 1.3, 1] }}
    transition={{ duration: 5 + delay, repeat: Infinity, delay, ease: "easeInOut" }}
  />
);

/* ═══ Section Divider ═══ */
const SectionDivider = forwardRef<HTMLDivElement>((_, ref) => (
  <div ref={ref} className="section-connector">
    <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent 0%, hsla(35,45%,50%,0.08) 15%, hsla(38,45%,52%,0.15) 35%, hsla(35,45%,50%,0.2) 50%, hsla(38,45%,52%,0.15) 65%, hsla(35,45%,50%,0.08) 85%, transparent 100%)" }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
      <motion.div
        className="w-2 h-2 rounded-full"
        style={{ background: "linear-gradient(135deg, hsl(35,45%,50%), hsl(38,45%,52%))", boxShadow: "0 0 10px hsla(35,45%,50%,0.4), 0 0 24px hsla(38,45%,52%,0.3)" }}
        animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </div>
  </div>
));
SectionDivider.displayName = "SectionDivider";

/* ═══ Comparison Row ═══ */
const CompRow = ({ label, empire, others, icon }: { label: string; empire: string; others: string; icon?: string }) => (
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
  </motion.div>
);

/* ═══════════════════════════════════════════
   PRICING CONFIGURATOR
   ═══════════════════════════════════════════ */

type PlanTier = "starter" | "professional" | "enterprise";
type PricingMode = "monthly" | "package";

/* ── Sector config for pricing ── */
type PricingSector = "food" | "ncc" | "beauty" | "healthcare" | "retail" | "fitness" | "hospitality" | "trades" | "other";

const PRICING_SECTORS: { id: PricingSector; label: string; emoji: string }[] = [
  { id: "food", label: "Food & Ristorazione", emoji: "🍽️" },
  { id: "beauty", label: "Beauty & Wellness", emoji: "💇" },
  { id: "ncc", label: "NCC & Trasporti", emoji: "🚘" },
  { id: "healthcare", label: "Salute & Cliniche", emoji: "🏥" },
  { id: "retail", label: "Retail & Negozi", emoji: "🛍️" },
  { id: "fitness", label: "Fitness & Palestre", emoji: "🏋️" },
  { id: "hospitality", label: "Hotel & Ospitalità", emoji: "🏨" },
  { id: "trades", label: "Artigiani & Servizi", emoji: "🔧" },
  { id: "other", label: "Altro settore", emoji: "🏢" },
];

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
  { id: "ops-trades", name: "Operations — Artigiani", desc: "Interventi, preventivi, dispatch", price: 109, icon: <ClipboardCheck className="w-4 h-4" />, sectors: ["trades"] },
];

/** Get sector-specific included agent IDs per package tier */
const SECTOR_INCLUDED_AGENTS: Record<PricingSector, { growth: string[]; empire: string[] }> = {
  food:        { growth: ["concierge", "ops-food"],  empire: ["concierge", "ops-food", "analytics", "social", "sales"] },
  ncc:         { growth: ["concierge", "ops-ncc"],   empire: ["concierge", "ops-ncc", "analytics", "sales", "document"] },
  beauty:      { growth: ["concierge", "ops-beauty"],empire: ["concierge", "ops-beauty", "analytics", "social", "sales"] },
  healthcare:  { growth: ["concierge", "ops-health"],empire: ["concierge", "ops-health", "analytics", "compliance", "document"] },
  retail:      { growth: ["concierge", "ops-retail"],empire: ["concierge", "ops-retail", "analytics", "social", "sales"] },
  fitness:     { growth: ["concierge", "ops-fitness"],empire: ["concierge", "ops-fitness", "analytics", "social", "sales"] },
  hospitality: { growth: ["concierge", "ops-hotel"], empire: ["concierge", "ops-hotel", "analytics", "social", "sales"] },
  trades:      { growth: ["concierge", "ops-trades"],empire: ["concierge", "ops-trades", "analytics", "document", "sales"] },
  other:       { growth: ["concierge", "analytics"], empire: ["concierge", "analytics", "social", "sales", "document"] },
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
  other: ["Dashboard personalizzata", "CRM Clienti completo", "Automazioni intelligenti", "Reportistica avanzata", "Multi-lingua"],
};

const PLAN_TIERS: { id: PlanTier; name: string; price: number; desc: string; badge?: string; features: string[]; includedAgents: number }[] = [
  {
    id: "starter",
    name: "Starter",
    price: 69,
    desc: "Tutto per iniziare a digitalizzare",
    features: ["App White Label completa", "Menu/Catalogo QR", "Ordini & Prenotazioni", "Dashboard Analytics", "Supporto Email", "Sicurezza AES-256 & GDPR"],
    includedAgents: 0,
  },
  {
    id: "professional",
    name: "Professional",
    price: 149,
    badge: "Più Scelto",
    desc: "IA + automazioni per crescere",
    features: ["Tutto di Starter +", "AI Engine completo", "CRM & Fidelizzazione", "Review Shield™", "Push Notification", "Traduzioni automatiche", "1 Agente IA incluso a scelta"],
    includedAgents: 1,
  },
  {
    id: "enterprise",
    name: "Enterprise",
    price: 299,
    badge: "Max Revenue",
    desc: "Suite completa per dominare il mercato",
    features: ["Tutto di Professional +", "Multi-lingua illimitato", "Loyalty Wallet avanzato", "GhostManager™ clienti persi", "Analytics predittivi", "Supporto prioritario 7/7", "3 Agenti IA inclusi a scelta"],
    includedAgents: 3,
  },
];

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
      "12 mesi di piattaforma inclusi",
    ],
    includedAgents: 0,
    extras: ["Formazione iniziale 1-on-1", "Dominio personalizzato"],
    savings: "Risparmi €883 vs abbonamento mensile",
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
      "18 mesi di piattaforma inclusi",
    ],
    includedAgents: 2,
    extras: ["3 sessioni di strategia IA", "Migrazione dati gratuita", "A/B Test landing pages"],
    savings: "Risparmi €2.203 vs abbonamento mensile",
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
      "🔧 Possibilità di aggiungere funzioni custom su richiesta",
    ],
    includedAgents: 5,
    extras: ["Account Manager dedicato", "6 sessioni strategia trimestrale", "Priorità su nuove funzionalità", "Setup multi-sede incluso", "Funzionalità custom su richiesta"],
    savings: "Risparmi €6.403 vs abbonamento — e le commissioni sono tue per sempre",
  },
];

/** Animated count-up component for savings */
const SavingsCounter = ({ target, delay = 0 }: { target: number; delay?: number }) => {
  const [count, setCount] = useState(0);
  const [hasStarted, setHasStarted] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting && !hasStarted) setHasStarted(true); },
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
        if (current >= target) { setCount(target); clearInterval(interval); }
        else setCount(Math.round(current));
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
        transition={{ duration: 0.3 }}
      >
        €{count.toLocaleString("it-IT")}
      </motion.p>
    </div>
  );
};

const PricingConfigurator = ({ navigate }: { navigate: (path: string) => void }) => {
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

  const plan = PLAN_TIERS.find(p => p.id === selectedPlan)!;
  const pkg = PACKAGE_TIERS.find(p => p.id === selectedPackage)!;
  const addonDiscount = billingCycle === "annual" ? 0.8 : 1;
  const planDiscount = billingCycle === "annual" ? 0.8 : 1;

  // Filter agents by selected sector
  const sectorAddons = AI_ADDONS.filter(a => a.sectors.includes(selectedSector));
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
  const addonTotal = pricingMode === "monthly"
    ? paidAddonIds.reduce((sum, id) => sum + (AI_ADDONS.find(x => x.id === id)?.price || 0), 0) * addonDiscount
    : paidAddonIds.reduce((sum, id) => sum + (AI_ADDONS.find(x => x.id === id)?.price || 0), 0) * 0.7; // 30% sconto pacchetto

  const planPrice = plan.price * planDiscount;
  const totalMonthly = planPrice + addonTotal;
  const savedPerYear = billingCycle === "annual" ? ((plan.price + paidAddonIds.reduce((s, id) => s + (AI_ADDONS.find(x => x.id === id)?.price || 0), 0)) * 12 * 0.2) : 0;

  // Package mode: addon monthly cost on top of setup fee
  const packageAddonMonthly = paidAddonIds.reduce((sum, id) => sum + Math.round((AI_ADDONS.find(x => x.id === id)?.price || 0) * 0.7), 0);
  const packageTotalSetup = pkg.price;
  const packageTotalMonthly = pkg.monthlyFee + packageAddonMonthly;
  const packageInstallment = installments ? Math.round(pkg.price / installments) : null;

  const toggleAddon = (id: string) => {
    setSelectedAddons(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      return next;
    });
  };

  return (
    <Section id="pricing" className="relative overflow-hidden" style={{
      background: "linear-gradient(180deg, hsla(230,15%,6%,1) 0%, hsla(230,12%,8%,1) 30%, hsla(35,8%,8%,1) 60%, hsla(230,15%,6%,1) 100%)",
    }}>
      {/* Premium ambient glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse, hsla(38,50%,50%,0.5), transparent 70%)", filter: "blur(120px)" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsla(265,60%,55%,0.4), transparent 70%)", filter: "blur(100px)" }} />
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
        <motion.div className="flex items-center justify-center gap-1 mt-6 p-1 rounded-full border border-border/30 bg-background/40 max-w-sm mx-auto"
          initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <button onClick={() => setPricingMode("package")}
            className={`relative flex-1 px-4 py-2.5 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all ${
              pricingMode === "package" ? "text-primary-foreground" : "text-foreground/40 hover:text-foreground/60"
            }`}>
            {pricingMode === "package" && (
              <motion.div layoutId="pricingModeIndicator" className="absolute inset-0 rounded-full bg-vibrant-gradient" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <Package className="w-3.5 h-3.5" /> Pacchetto
            </span>
          </button>
          <button onClick={() => setPricingMode("monthly")}
            className={`relative flex-1 px-4 py-2.5 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all ${
              pricingMode === "monthly" ? "text-primary-foreground" : "text-foreground/40 hover:text-foreground/60"
            }`}>
            {pricingMode === "monthly" && (
              <motion.div layoutId="pricingModeIndicator" className="absolute inset-0 rounded-full bg-vibrant-gradient" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
            )}
            <span className="relative z-10 flex items-center justify-center gap-1.5">
              <CreditCard className="w-3.5 h-3.5" /> Mensile
            </span>
          </button>
        </motion.div>

        {/* Sector Selector Dropdown */}
        <motion.div className="max-w-sm mx-auto mt-4" initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <p className="text-[0.55rem] font-heading text-foreground/30 tracking-[2px] uppercase text-center mb-2">Il tuo settore</p>
          <div className="relative">
            <select
              value={selectedSector}
              onChange={(e) => { setSelectedSector(e.target.value as PricingSector); setSelectedAddons(new Set()); }}
              className="w-full appearance-none px-4 py-3 rounded-xl border border-border/30 bg-background/60 backdrop-blur-sm text-foreground text-sm font-heading font-semibold text-center cursor-pointer focus:outline-none focus:border-primary/40 transition-colors"
            >
              {PRICING_SECTORS.map(s => (
                <option key={s.id} value={s.id}>{s.emoji} {s.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-foreground/30 pointer-events-none" />
          </div>
          {sectorFeatures.length > 0 && (
            <div className="flex flex-wrap justify-center gap-1.5 mt-2.5">
              {sectorFeatures.slice(0, 3).map((f, i) => (
                <span key={i} className="px-2 py-0.5 rounded-full text-[0.5rem] bg-primary/[0.08] text-primary/70 font-medium">{f}</span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      <AnimatePresence mode="wait">
        {/* ═══ PACKAGE MODE ═══ */}
        {pricingMode === "package" && (
          <motion.div key="packages" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

            {/* Urgency banner */}
            <motion.div className="max-w-3xl mx-auto mb-5 p-3 rounded-xl border border-accent/20 bg-accent/[0.04] text-center"
              animate={{ borderColor: ["hsla(35,45%,50%,0.2)", "hsla(35,45%,50%,0.4)", "hsla(35,45%,50%,0.2)"] }}
              transition={{ duration: 3, repeat: Infinity }}>
              <p className="text-[0.65rem] sm:text-xs text-accent font-semibold flex items-center justify-center gap-2">
                <Timer className="w-3.5 h-3.5" />
                <span>Prezzo lancio valido ancora per pochi giorni — Risparmia fino a <strong>€6.403</strong></span>
              </p>
            </motion.div>

            {/* Package Cards — stacked on mobile */}
            <div className="sm:hidden space-y-4 mb-6">
              {PACKAGE_TIERS.map((p) => {
                const isSelected = selectedPackage === p.id;
                const isEmpire = p.id === "empire";
                return (
                  <motion.div key={p.id}
                    onClick={() => setSelectedPackage(p.id)}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className={`relative w-full rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                      isEmpire
                        ? "border-2 border-accent/50 shadow-[0_0_60px_hsla(35,45%,50%,0.2),0_8px_32px_hsla(0,0%,0%,0.5)]"
                        : isSelected
                          ? "border-2 border-primary/50 shadow-[0_0_40px_hsla(265,50%,55%,0.12),0_8px_32px_hsla(0,0%,0%,0.4)]"
                          : "border border-border/40 shadow-[0_4px_24px_hsla(0,0%,0%,0.3)]"
                    }`}
                    style={{
                      background: isEmpire
                        ? "linear-gradient(165deg, hsla(35,25%,14%,0.95), hsla(230,12%,9%,0.98))"
                        : "linear-gradient(165deg, hsla(230,12%,14%,0.95), hsla(230,10%,10%,0.98))"
                    }}
                    whileTap={{ scale: 0.99 }}>

                    {/* Top accent line */}
                    <div className={`h-[2px] w-full ${isEmpire ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : "bg-vibrant-gradient"}`} />

                    {/* Badge */}
                    {p.badge && (
                      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[0.5rem] font-bold tracking-[1.5px] font-heading uppercase ${
                        isEmpire
                          ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black"
                          : p.badge === "Più Scelto" ? "bg-vibrant-gradient text-primary-foreground"
                          : "bg-gradient-to-r from-accent to-primary text-primary-foreground"
                      }`}>{p.badge}</div>
                    )}

                    <div className="p-5">
                      {/* Header: Name + Price */}
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[0.6rem] font-heading font-semibold text-foreground/40 tracking-[3px] uppercase">{p.name}</p>
                          <div className="mt-1 flex items-baseline gap-2">
                            <span className="text-3xl font-heading font-bold text-foreground">€{p.price.toLocaleString("it-IT")}</span>
                            <span className="text-xs text-foreground/20 line-through">€{p.originalPrice.toLocaleString("it-IT")}</span>
                          </div>
                          <p className="text-[0.55rem] text-foreground/25 mt-0.5">
                            oppure 6×€{Math.round(p.price / 6)}/mese · <span className="text-accent/60 font-semibold">0% interessi</span>
                          </p>
                        </div>
                        {/* Discount badge */}
                        <div className={`px-2.5 py-1.5 rounded-xl text-center ${isEmpire ? "bg-accent/15" : "bg-primary/10"}`}>
                          <span className={`text-lg font-heading font-bold ${isEmpire ? "text-accent" : "text-primary"}`}>
                            -{Math.round(((p.originalPrice - p.price) / p.originalPrice) * 100)}%
                          </span>
                        </div>
                      </div>

                      {/* Monthly + Commission pills */}
                      <div className="flex items-center gap-2 mt-3">
                        <span className={`flex-1 text-center px-2 py-1.5 rounded-xl text-[0.6rem] font-bold border ${
                          p.monthlyFee === 0
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-foreground/[0.03] text-foreground/50 border-border/20"
                        }`}>
                          {p.monthlyFee === 0 ? "€0/mese ✓" : `poi €${p.monthlyFee}/mese`}
                        </span>
                        <span className={`flex-1 text-center px-2 py-1.5 rounded-xl text-[0.6rem] font-bold border ${
                          p.commission === "0%"
                            ? "bg-accent/10 text-accent border-accent/20"
                            : "bg-foreground/[0.03] text-foreground/50 border-border/20"
                        }`}>
                          {p.commission === "0%" ? "0% commissioni ✓" : `${p.commission} transazioni`}
                        </span>
                      </div>

                      {/* Empire daily nudge */}
                      {isEmpire && (
                        <div className="mt-3 p-2.5 rounded-xl bg-accent/[0.06] border border-accent/15 text-center">
                          <p className="text-[0.65rem] text-accent font-bold">
                            💰 Solo €11/giorno per 24 mesi — poi è tutto tuo, per sempre
                          </p>
                          <p className="text-[0.5rem] text-accent/40 mt-0.5">Meno di un caffè al bar. Zero costi nascosti.</p>
                        </div>
                      )}

                      {/* Features */}
                      <ul className="mt-3 space-y-1.5">
                        {p.features.slice(0, isSelected ? p.features.length : 4).map((f, fi) => (
                          <li key={fi} className="flex items-start gap-2 text-[0.65rem] text-foreground/50">
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                              f.includes("ZERO") || f.includes("0%") ? "bg-accent/20" : "bg-primary/10"
                            }`}>
                              <Check className={`w-2.5 h-2.5 ${
                                f.includes("ZERO") || f.includes("0%") ? "text-accent" : "text-primary"
                              }`} />
                            </div>
                            <span className={`leading-snug ${f.includes("ZERO") || f.includes("0%") ? "font-bold text-accent" : f.startsWith("Tutto") ? "font-semibold text-foreground/60" : ""}`}>{f}</span>
                          </li>
                        ))}
                        {!isSelected && p.features.length > 4 && (
                          <li className="text-[0.55rem] text-primary/60 font-semibold pl-6 pt-0.5">
                            Tocca per vedere +{p.features.length - 4} funzionalità →
                          </li>
                        )}
                      </ul>

                      {/* Savings bar */}
                      <div className={`mt-3 p-2.5 rounded-xl text-[0.6rem] font-bold text-center ${
                        isEmpire ? "bg-accent/10 text-accent border border-accent/15" : "bg-primary/[0.06] text-primary/70 border border-primary/10"
                      }`}>
                        {p.savings}
                      </div>
                    </div>
                  </motion.div>
                );
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
                      isSelected
                        ? p.id === "empire"
                          ? "border-2 border-accent/50 shadow-[0_0_60px_hsla(35,45%,50%,0.18),0_8px_40px_hsla(0,0%,0%,0.5)]"
                          : "border-2 border-primary/50 shadow-[0_0_50px_hsla(265,50%,55%,0.14),0_8px_40px_hsla(0,0%,0%,0.4)]"
                        : "border border-border/40 hover:border-primary/25 shadow-[0_4px_24px_hsla(0,0%,0%,0.3)]"
                    }`}
                    style={{
                      background: isSelected
                        ? p.id === "empire"
                          ? "linear-gradient(165deg, hsla(35,22%,14%,0.97), hsla(230,12%,9%,0.98))"
                          : "linear-gradient(165deg, hsla(265,15%,14%,0.95), hsla(230,10%,9%,0.98))"
                        : "linear-gradient(165deg, hsla(230,12%,13%,0.95), hsla(230,10%,10%,0.97))"
                    }}>
                    {p.badge && (
                      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[0.5rem] font-bold tracking-[1.5px] font-heading uppercase ${
                        p.id === "empire"
                          ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black"
                          : p.badge === "Più Scelto" ? "bg-vibrant-gradient text-primary-foreground"
                          : "bg-gradient-to-r from-accent to-primary text-primary-foreground"
                      }`}>{p.badge}</div>
                    )}
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
                        p.monthlyFee === 0 ? "bg-accent/20 text-accent" : "bg-primary/10 text-primary"
                      }`}>
                        {p.monthlyFee === 0 ? "€0/mese" : `poi €${p.monthlyFee}/mese`}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[0.5rem] font-bold ${
                        p.commission === "0%" ? "bg-accent/20 text-accent" : "bg-foreground/[0.06] text-foreground/40"
                      }`}>
                        {p.commission === "0%" ? "0% commissioni!" : `${p.commission} transazioni`}
                      </span>
                    </div>

                    {p.id === "empire" && (
                      <div className="mt-2 p-2 rounded-lg bg-accent/[0.06] border border-accent/15">
                        <p className="text-[0.55rem] text-accent font-bold text-center">
                          💰 Solo €11/giorno per 24 mesi — poi è tutto tuo, per sempre
                        </p>
                        <p className="text-[0.45rem] text-accent/50 text-center mt-0.5">
                          Meno di un caffè + cornetto al bar. Zero costi nascosti.
                        </p>
                      </div>
                    )}

                    <p className="text-[0.6rem] text-foreground/35 mt-2 leading-relaxed">{p.tagline}</p>

                    <ul className="mt-3 space-y-1.5">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-[0.6rem] sm:text-xs text-foreground/50">
                          <div className={`w-3.5 h-3.5 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            f.includes("ZERO") || f.includes("0%")
                              ? "bg-accent/20"
                              : isSelected ? "bg-primary/15" : "bg-foreground/[0.05]"
                          }`}>
                            <Check className={`w-2.5 h-2.5 ${
                              f.includes("ZERO") || f.includes("0%") ? "text-accent" : isSelected ? "text-primary" : "text-foreground/30"
                            }`} />
                          </div>
                          <span className={`${f.startsWith("Tutto") ? "font-semibold text-foreground/60" : ""} ${f.includes("ZERO") || f.includes("0%") ? "font-bold text-accent" : ""}`}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="mt-3 pt-3 border-t border-border/20">
                      <p className="text-[0.5rem] font-heading font-bold text-accent/60 tracking-[2px] uppercase mb-1.5">
                        <Gift className="w-3 h-3 inline mr-1" />Bonus inclusi
                      </p>
                      {p.extras.map((e, ei) => (
                        <p key={ei} className="text-[0.55rem] text-foreground/30 flex items-center gap-1.5 mb-0.5">
                          <Star className="w-2.5 h-2.5 text-accent/40 flex-shrink-0" /> {e}
                        </p>
                      ))}
                    </div>

                    <div className={`mt-3 p-2 rounded-lg text-[0.55rem] font-semibold text-center ${
                      p.id === "empire" ? "bg-accent/10 text-accent" : "bg-primary/[0.06] text-primary/70"
                    }`}>
                      {p.savings}
                    </div>

                    {p.id !== "empire" && (
                      <div className="mt-2 p-2 rounded-lg bg-accent/[0.03] border border-accent/10 cursor-pointer" onClick={(e) => { e.stopPropagation(); setSelectedPackage("empire"); }}>
                        <p className="text-[0.45rem] text-accent/70 text-center">
                          ⚡ Con Empire risparmi <strong>€{p.commission === "2%" ? "6.403" : "4.200"}</strong> in più e hai <strong>0% commissioni per sempre</strong> →
                        </p>
                      </div>
                    )}

                    {isSelected && (
                      <motion.div className={`absolute bottom-0 left-0 right-0 h-1 ${p.id === "empire" ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : "bg-vibrant-gradient"}`}
                        layoutId="pkgIndicator" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                  </motion.div>
                );
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
                    <p className="text-xs sm:text-sm font-heading font-bold text-foreground">Agenti IA per {PRICING_SECTORS.find(s => s.id === selectedSector)?.label}</p>
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
                {showAddons && (
                  <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="overflow-hidden">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-4">
                      {sectorAddons.map((addon) => {
                        const isAutoIncluded = autoIncludedIds.includes(addon.id);
                        const isActive = selectedAddons.has(addon.id) || isAutoIncluded;
                        const displayPrice = Math.round(addon.price * 0.7);
                        return (
                          <motion.div key={addon.id} onClick={() => !isAutoIncluded && toggleAddon(addon.id)}
                            className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                              isActive ? "border border-primary/30 bg-primary/[0.06]" : "border border-border/20 hover:border-primary/15 bg-background/30"
                            } ${isAutoIncluded ? "opacity-90" : ""}`} whileTap={{ scale: isAutoIncluded ? 1 : 0.98 }}>
                            {isAutoIncluded && (
                              <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-accent/20 text-[0.45rem] font-bold text-accent tracking-wider uppercase">Incluso</div>
                            )}
                            {addon.popular && !isActive && !isAutoIncluded && (
                              <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-accent/20 text-[0.45rem] font-bold text-accent tracking-wider uppercase">Popular</div>
                            )}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-foreground/[0.05] text-foreground/30"}`}>
                              {addon.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isActive ? "text-foreground" : "text-foreground/60"}`}>{addon.name}</p>
                              <p className="text-[0.55rem] text-foreground/30 truncate">{addon.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {isAutoIncluded ? (
                                <span className="text-xs font-bold text-accent">Incluso ✓</span>
                              ) : (
                                <div>
                                  <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-foreground/40"}`}>+€{displayPrice}/m</span>
                                  <p className="text-[0.45rem] text-foreground/20 line-through">€{addon.price}/m</p>
                                </div>
                              )}
                            </div>
                            {!isAutoIncluded && (
                              <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                                isActive ? "border-primary bg-primary" : "border-foreground/15"
                              }`}>
                                {isActive && <Check className="w-3 h-3 text-primary-foreground" />}
                              </div>
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Package Summary & CTA — Dynamic Pricing */}
            <motion.div className="max-w-4xl mx-auto mt-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className={`relative p-5 sm:p-7 rounded-2xl overflow-hidden border ${
                pkg.id === "empire" ? "border-accent/25 bg-gradient-to-b from-accent/[0.06] via-background/60 to-background" : "border-primary/20 bg-gradient-to-b from-primary/[0.06] via-background/60 to-background"
              }`}>
                <div className={`absolute top-0 left-0 right-0 h-[2px] ${pkg.id === "empire" ? "bg-gradient-to-r from-accent via-yellow-500 to-accent" : "bg-vibrant-gradient"}`} />
                {/* Shimmer */}
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, hsla(38,55%,60%,0.04) 48%, transparent 65%)" }}
                  animate={{ x: ["-100%", "250%"] }}
                  transition={{ duration: 4, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                />

                <div className="flex flex-col gap-5 relative z-10">
                  {/* Header: Package name + price */}
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-[0.55rem] font-heading text-foreground/40 tracking-[3px] uppercase">Il Tuo Pacchetto</p>
                        {selectedAddons.size > 0 && (
                          <motion.span initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
                            className="px-2 py-0.5 rounded-full text-[0.4rem] bg-primary/15 text-primary font-bold">
                            PERSONALIZZATO
                          </motion.span>
                        )}
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
                                isActive
                                  ? isEmpireTier
                                    ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black shadow-lg shadow-accent/20"
                                    : "bg-vibrant-gradient text-primary-foreground shadow-lg shadow-primary/20"
                                  : "bg-foreground/[0.05] text-foreground/35 hover:bg-foreground/[0.08] hover:text-foreground/50"
                              }`}
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              layout
                              transition={{ type: "spring", stiffness: 400, damping: 25 }}
                            >
                              {isActive && isEmpireTier && (
                                <motion.div
                                  className="absolute inset-0 pointer-events-none"
                                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.25) 50%, transparent 70%)" }}
                                  animate={{ x: ["-200%", "300%"] }}
                                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                                />
                              )}
                              <span className="relative z-10 flex items-center gap-1">
                                {isEmpireTier && "👑 "}{tier.name.split(" ")[0]}
                                {isActive && (
                                  <motion.span initial={{ width: 0, opacity: 0 }} animate={{ width: "auto", opacity: 1 }} className="overflow-hidden">
                                    ✓
                                  </motion.span>
                                )}
                              </span>
                            </motion.button>
                          );
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
                      {packageTotalMonthly > 0 && (
                        <motion.div key={`monthly-${packageTotalMonthly}`} initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                          className="mt-1.5 flex items-baseline gap-1.5">
                          <span className="text-lg font-heading font-bold text-primary">
                            +€{packageTotalMonthly}/mese
                          </span>
                          {packageAddonMonthly > 0 && (
                            <span className="text-[0.5rem] text-foreground/25">
                              (€{pkg.monthlyFee} canone + €{packageAddonMonthly} agenti)
                            </span>
                          )}
                        </motion.div>
                      )}
                      {packageTotalMonthly === 0 && pkg.monthlyFee === 0 && (
                        <div className="mt-1.5">
                          <p className="text-[0.6rem] text-accent font-bold">€0/mese — Zero costi ricorrenti!</p>
                          <p className="text-[0.45rem] text-accent/50 mt-0.5">🏆 Pacchetto completo: tutto incluso, niente di nascosto</p>
                        </div>
                      )}

                      {/* Tags */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2">
                        <span className={`px-2 py-0.5 rounded-full text-[0.5rem] font-semibold ${pkg.id === "empire" ? "bg-accent/15 text-accent" : "bg-primary/10 text-primary"}`}>{pkg.name}</span>
                        {pkg.commission === "0%" && <span className="px-2 py-0.5 rounded-full text-[0.5rem] bg-accent/20 text-accent font-bold animate-pulse">0% Commissioni</span>}
                        {selectedAddons.size > 0 && (
                          <motion.span initial={{ scale: 0.9 }} animate={{ scale: 1 }}
                            className="px-2 py-0.5 rounded-full text-[0.5rem] bg-primary/10 text-primary font-semibold">
                            +{selectedAddons.size} Agenti IA
                            {paidAddonIds.length > 0 && ` (${sortedAddons.length - paidAddonIds.length} inclus${sortedAddons.length - paidAddonIds.length > 1 ? "i" : "o"})`}
                          </motion.span>
                        )}
                      </div>

                      {/* Commission info */}
                      <p className="text-[0.5rem] text-foreground/25 mt-2">
                        {pkg.commission} sulle transazioni · IVA esclusa
                      </p>

                      {/* Animated cumulative savings counter — Empire only */}
                      {pkg.id === "empire" && (() => {
                        const baseCost24 = 1997 + 49 * 24; // €3173
                        const growthCost24 = 4997 + 29 * 24; // €5693
                        const empireCost24 = 7997;
                        // With €8k/mo revenue: base 2% = €160/mo, growth 1% = €80/mo
                        const revenueMonth = 8000;
                        const baseCommissions24 = revenueMonth * 0.02 * 24;
                        const growthCommissions24 = revenueMonth * 0.01 * 24;
                        const savingsVsBase = (baseCost24 + baseCommissions24) - empireCost24;
                        const savingsVsGrowth = (growthCost24 + growthCommissions24) - empireCost24;
                        return (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="mt-3 p-3 rounded-xl border border-accent/15 bg-gradient-to-br from-accent/[0.05] via-background/40 to-accent/[0.02] overflow-hidden relative"
                          >
                            {/* Shimmer */}
                            <motion.div className="absolute inset-0 pointer-events-none"
                              style={{ background: "linear-gradient(105deg, transparent 35%, hsla(38,55%,60%,0.08) 50%, transparent 65%)" }}
                              animate={{ x: ["-150%", "250%"] }}
                              transition={{ duration: 3, repeat: Infinity, repeatDelay: 4, ease: "easeInOut" }}
                            />
                            <p className="text-[0.5rem] font-heading font-bold text-accent/60 tracking-[2px] uppercase mb-2 relative z-10">💰 Risparmio cumulativo in 24 mesi</p>
                            <div className="grid grid-cols-2 gap-2 relative z-10">
                              <div className="text-center p-2 rounded-lg bg-accent/[0.06] border border-accent/10">
                                <p className="text-[0.45rem] text-foreground/30 mb-0.5">vs Digital Start</p>
                                <SavingsCounter target={savingsVsBase} />
                                <p className="text-[0.4rem] text-foreground/20 mt-0.5">canone + commissioni</p>
                              </div>
                              <div className="text-center p-2 rounded-lg bg-accent/[0.06] border border-accent/10">
                                <p className="text-[0.45rem] text-foreground/30 mb-0.5">vs Growth AI</p>
                                <SavingsCounter target={savingsVsGrowth} delay={0.3} />
                                <p className="text-[0.4rem] text-foreground/20 mt-0.5">canone + commissioni</p>
                              </div>
                            </div>
                            <p className="text-[0.4rem] text-accent/40 text-center mt-2 relative z-10">
                              Basato su €8.000/mese di fatturato · Il risparmio cresce con le vendite
                            </p>
                          </motion.div>
                        );
                      })()}
                    </div>

                    {/* CTA */}
                    <div className="flex flex-col gap-2 sm:items-end">
                      <motion.button onClick={() => navigate("/admin")}
                        className={`px-8 py-3.5 rounded-full font-bold text-sm font-heading tracking-wider uppercase whitespace-nowrap relative overflow-hidden ${
                          pkg.id === "empire"
                            ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black"
                            : "bg-vibrant-gradient text-primary-foreground"
                        }`}
                        whileHover={{ scale: 1.03, boxShadow: pkg.id === "empire" ? "0 15px 50px hsla(35,45%,50%,0.3)" : "0 15px 50px hsla(38,50%,55%,0.2)" }}
                        whileTap={{ scale: 0.97 }}>
                        <motion.div className="absolute inset-0 pointer-events-none"
                          style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                          animate={{ x: ["-200%", "300%"] }}
                          transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3, ease: "easeInOut" }}
                        />
                        <span className="relative z-10">{pkg.id === "empire" ? "Attiva Empire — Domina Ora" : "Attiva Ora — Setup in 24h"}</span>
                      </motion.button>
                      <p className="text-[0.5rem] text-foreground/20 text-center sm:text-right">Pagamento sicuro · Rateizzabile · Fattura deducibile · Assistenza 7/7</p>
                    </div>
                  </div>

                  {/* Addon summary breakdown if addons selected */}
                  <AnimatePresence>
                    {selectedAddons.size > 0 && (
                      <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden">
                        <div className="pt-3 border-t border-border/10">
                          <p className="text-[0.5rem] font-heading font-bold text-foreground/30 tracking-[2px] uppercase mb-2">Riepilogo Agenti IA</p>
                          <div className="space-y-1">
                            {sortedAddons.map((id, idx) => {
                              const addon = AI_ADDONS.find(x => x.id === id);
                              if (!addon) return null;
                              const isFree = idx < pkg.includedAgents;
                              return (
                                <div key={id} className="flex items-center justify-between text-[0.55rem]">
                                  <span className="text-foreground/40">{addon.name}</span>
                                  {isFree ? (
                                    <span className="text-accent font-bold">Incluso ✓</span>
                                  ) : (
                                    <span className="text-primary font-semibold">+€{Math.round(addon.price * 0.7)}/mese</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          {paidAddonIds.length > 0 && (
                            <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/10 text-[0.6rem] font-bold">
                              <span className="text-foreground/50">Totale agenti extra</span>
                              <span className="text-primary">+€{packageAddonMonthly}/mese</span>
                            </div>
                          )}
                        </div>
                      </motion.div>
                    )}
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
                                installments === null
                                  ? pkg.id === "empire" ? "border-2 border-accent/40 bg-accent/[0.06]" : "border-2 border-primary/40 bg-primary/[0.06]"
                                  : "border border-border/20 hover:border-primary/15 bg-background/30"
                              }`}>
                              {installments === null && (
                                <span className="absolute -top-2 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full bg-accent/20 text-[0.4rem] font-bold text-accent tracking-wider uppercase whitespace-nowrap">Più scelto</span>
                              )}
                              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">€{pkg.price.toLocaleString("it-IT")}</p>
                              <p className="text-[0.5rem] text-foreground/30 mt-0.5">Una tantum</p>
                              <p className="text-[0.45rem] text-accent/60 font-semibold mt-1">Miglior prezzo</p>
                            </button>
                            <button onClick={() => setInstallments(3)}
                              className={`relative p-3 rounded-xl text-center transition-all ${
                                installments === 3
                                  ? pkg.id === "empire" ? "border-2 border-accent/40 bg-accent/[0.06]" : "border-2 border-primary/40 bg-primary/[0.06]"
                                  : "border border-border/20 hover:border-primary/15 bg-background/30"
                              }`}>
                              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">€{monthly3.toLocaleString("it-IT")}</p>
                              <p className="text-[0.5rem] text-foreground/30 mt-0.5">×3 mesi</p>
                              <p className="text-[0.45rem] text-green-400 font-bold mt-1">TAN 0%</p>
                            </button>
                            <button onClick={() => setInstallments(6)}
                              className={`relative p-3 rounded-xl text-center transition-all ${
                                installments === 6
                                  ? pkg.id === "empire" ? "border-2 border-accent/40 bg-accent/[0.06]" : "border-2 border-primary/40 bg-primary/[0.06]"
                                  : "border border-border/20 hover:border-primary/15 bg-background/30"
                              }`}>
                              <p className="text-lg sm:text-xl font-heading font-bold text-foreground">€{monthly6.toLocaleString("it-IT")}</p>
                              <p className="text-[0.5rem] text-foreground/30 mt-0.5">×6 mesi</p>
                              <p className="text-[0.45rem] text-amber-400 font-bold mt-1">TAN 5,9%</p>
                            </button>
                          </div>

                          {/* Total cost summary */}
                          {installments && (
                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }}
                              className="mt-3 p-3 rounded-xl bg-foreground/[0.02] border border-border/10">
                              <div className="flex items-center justify-between text-[0.6rem]">
                                <span className="text-foreground/40">Setup ({installments} rate)</span>
                                <span className="text-foreground/70 font-bold">€{(installments === 3 ? monthly3 : monthly6).toLocaleString("it-IT")}/mese</span>
                              </div>
                              {installments === 6 && (
                                <div className="flex items-center justify-between text-[0.6rem] mt-1">
                                  <span className="text-foreground/40">Interessi (TAN 5,9%)</span>
                                  <span className="text-amber-400/80 font-bold">+€{extraCost6.toLocaleString("it-IT")} totali</span>
                                </div>
                              )}
                              {installments === 3 && (
                                <div className="flex items-center justify-between text-[0.6rem] mt-1">
                                  <span className="text-foreground/40">Interessi</span>
                                  <span className="text-green-400/80 font-bold">€0 — Tasso Zero ✓</span>
                                </div>
                              )}
                              {packageTotalMonthly > 0 && (
                                <div className="flex items-center justify-between text-[0.6rem] mt-1">
                                  <span className="text-foreground/40">Canone + agenti</span>
                                  <span className="text-foreground/70 font-bold">€{packageTotalMonthly}/mese</span>
                                </div>
                              )}
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
                                <span className="text-foreground/50 font-bold">€{((installments === 3 ? total3 : total6)).toLocaleString("it-IT")}</span>
                              </div>
                              <p className="text-[0.45rem] text-foreground/20 text-center mt-1.5">
                                Addebito automatico · {installments === 3 ? "Tasso Zero garantito" : "TAEG 6,08%"} · Dopo le {installments} rate solo {packageTotalMonthly > 0 ? `€${packageTotalMonthly}/mese` : "€0/mese"}
                              </p>
                              {installments === 6 && (
                                <p className="text-[0.5rem] text-center mt-2 text-amber-400/70 font-semibold">
                                  💡 Passa a 3 rate per risparmiare €{extraCost6.toLocaleString("it-IT")} di interessi
                                </p>
                              )}
                            </motion.div>
                          )}
                        </>
                      );
                    })()}

                    {/* Empire push if not selected */}
                    {pkg.id !== "empire" && (
                      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
                        className="mt-3 p-3 rounded-xl bg-accent/[0.04] border border-accent/15 cursor-pointer hover:bg-accent/[0.08] transition-colors"
                        onClick={() => setSelectedPackage("empire")}>
                        <p className="text-[0.6rem] text-accent font-bold text-center">
                          💎 Passa a Empire Domination — risparmi €{(7997 - pkg.price + (pkg.monthlyFee * 24)).toLocaleString("it-IT")} in 2 anni
                        </p>
                        <p className="text-[0.45rem] text-accent/50 text-center mt-0.5">
                          0% commissioni + €0/mese per 24 mesi · Tutto incluso · Solo €{Math.round(7997 / 6)}/mese in 6 rate
                        </p>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Comparison Table — Professional */}
            <motion.div className="max-w-4xl mx-auto mt-8" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
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
                    { label: "Costo reale 2 anni", vals: [`€${(1997 + 49*24).toLocaleString("it-IT")}`, `€${(4997 + 29*24).toLocaleString("it-IT")}`, "€7.997"], icon: "🧮" },
                    { label: "Piattaforma inclusa", vals: ["12 mesi", "18 mesi", "24 mesi"], icon: "📅" },
                    { label: "Agenti IA inclusi", vals: ["0", "2", "5"], icon: "🤖" },
                    { label: "CRM & Fidelizzazione", vals: ["Base", "Avanzata", "Enterprise"], icon: "👥" },
                    { label: "Review Shield™", vals: ["—", "✓", "✓"], icon: "🛡️" },
                    { label: "Analytics IA", vals: ["—", "—", "✓"], icon: "📈" },
                    { label: "Account Manager", vals: ["—", "—", "VIP 7/7"], icon: "🎯" },
                    { label: "Multi-sede", vals: ["—", "—", "✓"], icon: "🏢" },
                  ];
                  const isEmpire = p.id === "empire";
                  const isActive = p.id === selectedPackage;
                  const savings = ["€883", "€2.203", "€6.403+"];
                  return (
                    <motion.div key={p.id}
                      onClick={() => setSelectedPackage(p.id)}
                      className={`relative rounded-2xl overflow-hidden cursor-pointer transition-all ${
                        isActive
                          ? isEmpire
                            ? "border-2 border-accent/40 bg-accent/[0.04]"
                            : "border-2 border-primary/30 bg-primary/[0.03]"
                          : "border border-border/15 bg-background/30"
                      }`}
                      whileTap={{ scale: 0.99 }}>
                      {isEmpire && (
                        <div className="bg-gradient-to-r from-accent/20 via-accent/10 to-accent/20 text-center py-1">
                          <span className="text-[0.5rem] font-heading font-bold text-accent tracking-[3px] uppercase">★ Consigliato</span>
                        </div>
                      )}
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
                                "text-foreground/60"
                              }`}>{val}</span>
                            </div>
                          );
                        })}
                      </div>
                      {/* CTA */}
                      <div className="px-4 pb-4">
                        <motion.button
                          onClick={(e) => { e.stopPropagation(); setSelectedPackage(p.id); navigate("/admin"); }}
                          className={`w-full py-2.5 rounded-xl text-[0.6rem] font-heading font-bold tracking-wider uppercase transition-all ${
                            isEmpire
                              ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black"
                              : isActive
                                ? "bg-vibrant-gradient text-primary-foreground"
                                : "bg-foreground/[0.06] text-foreground/40"
                          }`}
                          whileTap={{ scale: 0.97 }}>
                          {isEmpire ? "Scelgo Empire →" : `Scelgo ${p.name}`}
                        </motion.button>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* ── DESKTOP: Table comparison ── */}
              <div className="hidden sm:block overflow-x-auto">
                <div className="min-w-[540px] rounded-2xl border border-border/15 overflow-hidden">
                  {/* Header row */}
                  <div className="grid grid-cols-4 gap-0">
                    <div className="p-4 bg-background/50" />
                    {PACKAGE_TIERS.map(p => (
                      <div key={p.id}
                        onClick={() => setSelectedPackage(p.id)}
                        className={`relative p-4 text-center cursor-pointer transition-all ${
                          p.id === selectedPackage
                            ? p.id === "empire" ? "bg-accent/[0.08]" : "bg-primary/[0.06]"
                            : "bg-background/30 hover:bg-foreground/[0.02]"
                        }`}>
                        {p.id === "empire" && (
                          <span className="absolute -top-0 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-b-lg bg-accent/20 text-[0.4rem] font-bold text-accent tracking-[2px] uppercase">Consigliato</span>
                        )}
                        <p className={`text-[0.55rem] font-heading font-bold tracking-[2px] uppercase mt-1 ${
                          p.id === selectedPackage ? (p.id === "empire" ? "text-accent" : "text-primary") : "text-foreground/30"
                        }`}>{p.name}</p>
                        <p className={`text-xl font-heading font-bold mt-1 ${
                          p.id === selectedPackage ? "text-foreground" : "text-foreground/40"
                        }`}>€{p.price.toLocaleString("it-IT")}</p>
                        <p className="text-[0.45rem] text-foreground/25 mt-0.5">oppure da €{Math.round(p.price / 6)}/mese ×6</p>
                        {p.id === "empire" && <p className="text-[0.4rem] text-accent/70 font-bold mt-0.5">🏆 Tutto Incluso</p>}
                      </div>
                    ))}
                  </div>
                  {/* Data rows */}
                  {[
                    { label: "Canone mensile dopo setup", vals: ["€49/mese", "€29/mese", "€0 per sempre"], icon: "💳", isHighlight: [false, false, true] },
                    { label: "Commissione su ogni vendita", vals: ["2% trattenuto", "1% trattenuto", "0% — tutto tuo"], icon: "📊", isHighlight: [false, false, true] },
                    { label: "Costo reale in 2 anni", vals: [`€${(1997 + 49*24).toLocaleString("it-IT")}`, `€${(4997 + 29*24).toLocaleString("it-IT")}`, "€7.997 totali"], icon: "🧮", isHighlight: [false, false, true] },
                    { label: "Piattaforma inclusa", vals: ["12 mesi", "18 mesi", "24 mesi"], icon: "📅", isHighlight: [false, false, true] },
                    { label: "Agenti IA inclusi", vals: ["Nessuno", "2 a scelta", "5 a scelta"], icon: "🤖", isHighlight: [false, false, true] },
                    { label: "CRM & Fidelizzazione", vals: ["Base", "Avanzata", "Enterprise"], icon: "👥", isHighlight: [false, true, true] },
                    { label: "Review Shield™", vals: ["—", "✓ Incluso", "✓ Incluso"], icon: "🛡️", isHighlight: [false, true, true] },
                    { label: "Analytics predittivi IA", vals: ["—", "—", "✓ Incluso"], icon: "📈", isHighlight: [false, false, true] },
                    { label: "Account Manager dedicato", vals: ["—", "—", "✓ VIP 7/7"], icon: "🎯", isHighlight: [false, false, true] },
                    { label: "Multi-sede", vals: ["—", "—", "✓ Incluso"], icon: "🏢", isHighlight: [false, false, true] },
                  ].map((row, ri) => (
                    <div key={ri} className={`grid grid-cols-4 gap-0 ${ri % 2 === 0 ? "bg-foreground/[0.01]" : "bg-background/20"}`}>
                      <div className="p-3 flex items-center gap-2 border-t border-border/10">
                        <span className="text-xs">{row.icon}</span>
                        <span className="text-[0.6rem] text-foreground/50 font-medium">{row.label}</span>
                      </div>
                      {row.vals.map((v, vi) => (
                        <div key={vi} className={`p-3 text-center border-t border-border/10 transition-all ${
                          vi === PACKAGE_TIERS.findIndex(pp => pp.id === selectedPackage) ? "bg-primary/[0.03]" : ""
                        } ${PACKAGE_TIERS[vi].id === "empire" ? "bg-accent/[0.02]" : ""}`}>
                          <span className={`text-[0.6rem] font-semibold ${
                            row.isHighlight[vi]
                              ? vi === 2 ? "text-accent font-bold" : "text-primary"
                              : v === "—" ? "text-foreground/15" : "text-foreground/45"
                          }`}>{v}</span>
                        </div>
                      ))}
                    </div>
                  ))}
                  {/* Savings footer */}
                  <div className="grid grid-cols-4 gap-0 border-t-2 border-accent/15">
                    <div className="p-4 flex items-center">
                      <span className="text-[0.6rem] font-heading font-bold text-accent/70 tracking-[1px] uppercase">Risparmio totale</span>
                    </div>
                    {[
                      { save: "€883", sub: "vs mensile" },
                      { save: "€2.203", sub: "vs mensile" },
                      { save: "€6.403+", sub: "commissioni incluse" },
                    ].map((s, si) => (
                      <div key={si} className={`p-4 text-center ${si === 2 ? "bg-accent/[0.06]" : ""}`}>
                        <p className={`text-sm font-heading font-bold ${si === 2 ? "text-accent" : "text-foreground/50"}`}>{s.save}</p>
                        <p className="text-[0.4rem] text-foreground/25 mt-0.5">{s.sub}</p>
                      </div>
                    ))}
                  </div>
                  {/* Bottom CTA */}
                  <div className="grid grid-cols-4 gap-0 border-t border-border/10">
                    <div className="p-3" />
                    {PACKAGE_TIERS.map(p => (
                      <div key={p.id} className="p-3 text-center">
                        <motion.button
                          onClick={() => { setSelectedPackage(p.id); navigate("/admin"); }}
                          className={`w-full px-3 py-2 rounded-lg text-[0.55rem] font-heading font-bold tracking-wider uppercase transition-all ${
                            p.id === "empire"
                              ? "bg-gradient-to-r from-accent via-yellow-500 to-accent text-black"
                              : p.id === selectedPackage
                                ? "bg-vibrant-gradient text-primary-foreground"
                                : "bg-foreground/[0.05] text-foreground/40 hover:bg-foreground/[0.08]"
                          }`}
                          whileHover={{ scale: 1.03 }}
                          whileTap={{ scale: 0.97 }}>
                          {p.id === "empire" ? "Scelgo Empire →" : `Scelgo ${p.name}`}
                        </motion.button>
                      </div>
                    ))}
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
                  <p className="text-[0.5rem] text-foreground/20 mt-2">Risposta garantita entro 24h · Preventivo gratuito · Settore: {PRICING_SECTORS.find(s => s.id === selectedSector)?.label}</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* ── Feature Request Modal ── */}
          <AnimatePresence>
            {showFeatureRequest && (
              <motion.div
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowFeatureRequest(false)}>
                <motion.div
                  initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.95, opacity: 0, y: 10 }}
                  className="relative w-full max-w-md p-6 rounded-2xl border border-border/30 bg-background/95 backdrop-blur-xl"
                  onClick={e => e.stopPropagation()}>
                  <button onClick={() => setShowFeatureRequest(false)} className="absolute top-3 right-3 p-1 rounded-full hover:bg-foreground/[0.05] text-foreground/30">
                    <X className="w-4 h-4" />
                  </button>
                  <div className="w-10 h-10 mx-auto rounded-xl bg-vibrant-gradient flex items-center justify-center mb-3">
                    <Sparkles className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <h3 className="text-lg font-heading font-bold text-foreground text-center mb-1">Richiedi Funzionalità</h3>
                  <p className="text-xs text-foreground/40 text-center mb-4">Descrivici la funzione che desideri. Il nostro team la valuterà e ti invierà un preventivo.</p>

                  {featureRequestSent ? (
                    <motion.div initial={{ scale: 0.9 }} animate={{ scale: 1 }} className="text-center py-6">
                      <div className="w-14 h-14 mx-auto rounded-full bg-accent/20 flex items-center justify-center mb-3">
                        <Check className="w-7 h-7 text-accent" />
                      </div>
                      <p className="text-sm font-heading font-bold text-foreground mb-1">Richiesta Inviata!</p>
                      <p className="text-xs text-foreground/40">Ti contatteremo entro 24 ore con un preventivo personalizzato.</p>
                      <button onClick={() => { setShowFeatureRequest(false); setFeatureRequestSent(false); }}
                        className="mt-4 px-5 py-2 rounded-full bg-foreground/[0.05] text-foreground/60 text-xs font-semibold hover:bg-foreground/[0.08] transition-colors">
                        Chiudi
                      </button>
                    </motion.div>
                  ) : (
                    <div className="space-y-3">
                      <div>
                        <label className="text-[0.6rem] font-heading font-bold text-foreground/40 tracking-[1px] uppercase">Settore</label>
                        <div className="mt-1 px-3 py-2 rounded-lg bg-foreground/[0.03] border border-border/20 text-xs text-foreground/60">
                          {PRICING_SECTORS.find(s => s.id === selectedSector)?.emoji} {PRICING_SECTORS.find(s => s.id === selectedSector)?.label}
                          {selectedPackage && <span className="ml-2 text-primary/60">· {PACKAGE_TIERS.find(p => p.id === selectedPackage)?.name}</span>}
                        </div>
                      </div>
                      <div>
                        <label className="text-[0.6rem] font-heading font-bold text-foreground/40 tracking-[1px] uppercase">La tua email</label>
                        <input
                          type="email" value={featureRequestEmail} onChange={e => setFeatureRequestEmail(e.target.value)}
                          placeholder="nome@azienda.it"
                          className="mt-1 w-full px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-border/20 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/30 transition-colors"
                        />
                      </div>
                      <div>
                        <label className="text-[0.6rem] font-heading font-bold text-foreground/40 tracking-[1px] uppercase">Descrivi la funzionalità desiderata</label>
                        <textarea
                          value={featureRequestText} onChange={e => setFeatureRequestText(e.target.value)}
                          placeholder="Es: Vorrei un sistema di prenotazione con caparra automatica..."
                          rows={4}
                          className="mt-1 w-full px-3 py-2.5 rounded-lg bg-foreground/[0.03] border border-border/20 text-sm text-foreground placeholder:text-foreground/20 focus:outline-none focus:border-primary/30 transition-colors resize-none"
                        />
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
                                packageId: selectedPackage,
                              },
                            });
                            setFeatureRequestSent(true);
                          } catch {
                            // silent fail
                          } finally {
                            setFeatureRequestSending(false);
                          }
                        }}
                        disabled={featureRequestSending || !featureRequestText.trim() || !featureRequestEmail.trim()}
                        className="w-full px-5 py-3 rounded-xl bg-vibrant-gradient text-primary-foreground text-sm font-heading font-bold tracking-wider uppercase disabled:opacity-40 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}>
                        {featureRequestSending ? "Invio in corso..." : "Invia Richiesta →"}
                      </motion.button>
                      <p className="text-[0.45rem] text-foreground/15 text-center">I tuoi dati sono protetti e utilizzati solo per rispondere alla tua richiesta.</p>
                    </div>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        {pricingMode === "monthly" && (
          <motion.div key="monthly" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>

            {/* Billing toggle */}
            <motion.div className="flex items-center justify-center gap-3 mb-6"
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <button onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all ${billingCycle === "monthly" ? "bg-primary/15 text-primary" : "text-foreground/30 hover:text-foreground/50"}`}>
                Mensile
              </button>
              <button onClick={() => setBillingCycle("annual")}
                className={`px-4 py-2 rounded-full text-xs font-heading font-semibold tracking-wider uppercase transition-all flex items-center gap-1.5 ${billingCycle === "annual" ? "bg-primary/15 text-primary" : "text-foreground/30 hover:text-foreground/50"}`}>
                Annuale
                <span className="px-1.5 py-0.5 rounded-full text-[0.5rem] bg-accent/20 text-accent font-bold">−20%</span>
              </button>
            </motion.div>

            {/* Upsell nudge toward packages */}
            <motion.div className="max-w-3xl mx-auto mb-5 p-3 rounded-xl border border-accent/15 bg-accent/[0.03] text-center cursor-pointer hover:bg-accent/[0.06] transition-colors"
              onClick={() => setPricingMode("package")}
              whileHover={{ scale: 1.01 }}>
              <p className="text-[0.6rem] text-accent/70 font-medium flex items-center justify-center gap-2">
                <Sparkles className="w-3.5 h-3.5" />
                <span>💡 Con un <strong>pacchetto completo</strong> risparmi fino a €6.403 e azzeri le commissioni → <u>Scopri i pacchetti</u></span>
              </p>
            </motion.div>

            {/* Plan Cards */}
            <motion.div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 max-w-3xl mx-auto mb-6"
              variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
              {PLAN_TIERS.map((p) => {
                const isSelected = selectedPlan === p.id;
                const displayPrice = Math.round(p.price * planDiscount);
                return (
                  <motion.div key={p.id} variants={fadeScale}
                    onClick={() => { setSelectedPlan(p.id); if (p.includedAgents > 0) setShowAddons(true); }}
                    className={`relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 overflow-hidden ${
                      isSelected
                        ? "border-2 border-primary/40 bg-gradient-to-b from-primary/[0.08] via-background/60 to-background shadow-[0_0_40px_hsla(38,50%,55%,0.1)]"
                        : "border border-border/30 hover:border-primary/20 bg-background/40"
                    }`}>
                    {p.badge && (
                      <div className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[0.5rem] font-bold tracking-[1.5px] font-heading uppercase ${
                        p.badge === "Max Revenue" ? "bg-gradient-to-r from-accent to-primary text-primary-foreground" : "bg-vibrant-gradient text-primary-foreground"
                      }`}>{p.badge}</div>
                    )}
                    {isSelected && <div className="absolute top-0 left-0 right-0 h-[2px] bg-vibrant-gradient" />}

                    <p className="text-[0.6rem] font-heading font-semibold text-foreground/40 tracking-[3px] uppercase">{p.name}</p>
                    <div className="flex items-baseline gap-1 mt-2">
                      <span className="text-3xl sm:text-4xl font-heading font-bold text-foreground">€{displayPrice}</span>
                      <span className="text-xs text-foreground/30">/mese</span>
                    </div>
                    {billingCycle === "annual" && (
                      <p className="text-[0.55rem] text-accent font-semibold mt-0.5">Risparmi €{Math.round(p.price * 12 * 0.2)}/anno</p>
                    )}
                    <p className="text-[0.6rem] text-foreground/35 mt-1.5 leading-relaxed">{p.desc}</p>

                    <ul className="mt-4 space-y-2">
                      {p.features.map((f, fi) => (
                        <li key={fi} className="flex items-start gap-2 text-[0.65rem] sm:text-xs text-foreground/50">
                          <div className={`w-4 h-4 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5 ${isSelected ? "bg-primary/15" : "bg-foreground/[0.05]"}`}>
                            <Check className={`w-2.5 h-2.5 ${isSelected ? "text-primary" : "text-foreground/30"}`} />
                          </div>
                          <span className={f.startsWith("Tutto") ? "font-semibold text-foreground/60" : ""}>{f}</span>
                        </li>
                      ))}
                    </ul>

                    {isSelected && (
                      <motion.div className="absolute bottom-0 left-0 right-0 h-1 bg-vibrant-gradient"
                        layoutId="planIndicator" transition={{ type: "spring", stiffness: 400, damping: 30 }} />
                    )}
                  </motion.div>
                );
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
                {showAddons && (
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
                              isActive ? "border border-primary/30 bg-primary/[0.06]" : "border border-border/20 hover:border-primary/15 bg-background/30"
                            }`} whileTap={{ scale: 0.98 }}>
                            {addon.popular && !isActive && (
                              <div className="absolute -top-1.5 right-3 px-2 py-0.5 rounded-full bg-accent/20 text-[0.45rem] font-bold text-accent tracking-wider uppercase">Popular</div>
                            )}
                            <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isActive ? "bg-primary/20 text-primary" : "bg-foreground/[0.05] text-foreground/30"}`}>
                              {addon.icon}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className={`text-xs font-semibold truncate ${isActive ? "text-foreground" : "text-foreground/60"}`}>{addon.name}</p>
                              <p className="text-[0.55rem] text-foreground/30 truncate">{addon.desc}</p>
                            </div>
                            <div className="text-right flex-shrink-0">
                              {isFree ? (
                                <span className="text-xs font-bold text-accent">Incluso</span>
                              ) : (
                                <span className={`text-xs font-bold ${isActive ? "text-primary" : "text-foreground/40"}`}>+€{displayPrice}/m</span>
                              )}
                            </div>
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all ${
                              isActive ? "border-primary bg-primary" : "border-foreground/15"
                            }`}>
                              {isActive && <Check className="w-3 h-3 text-primary-foreground" />}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Monthly Summary & CTA */}
            <motion.div className="max-w-3xl mx-auto mt-4" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <div className="relative p-5 sm:p-7 rounded-2xl overflow-hidden border border-primary/20 bg-gradient-to-b from-primary/[0.06] via-background/60 to-background">
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
        )}
      </AnimatePresence>

      {/* Trust badges */}
      <motion.div className="flex flex-wrap justify-center gap-3 mt-6 max-w-3xl mx-auto"
        initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
        {[
          { icon: <Shield className="w-3.5 h-3.5" />, text: "GDPR Compliant" },
          { icon: <Lock className="w-3.5 h-3.5" />, text: "AES-256" },
          { icon: <Zap className="w-3.5 h-3.5" />, text: "Aggiornamenti settimanali" },
          { icon: <Headphones className="w-3.5 h-3.5" />, text: "Assistenza 7/7" },
          { icon: <CreditCard className="w-3.5 h-3.5" />, text: "Rate 0% interessi" },
        ].map((b, i) => (
          <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-border/20 bg-background/30">
            <span className="text-primary/50">{b.icon}</span>
            <span className="text-[0.55rem] text-foreground/30 font-medium">{b.text}</span>
          </div>
        ))}
      </motion.div>
    </Section>
  );
};

/* ═══════════════════════════════════════════
   MOBILE IPHONE CAROUSEL — 3 at a time, auto-scroll
   ═══════════════════════════════════════════ */
type CarouselItem = { name: string; route: string; color: string; label: string; nav: string; image: string };

const MobileIPhoneCarousel = ({ items, navigate }: { items: CarouselItem[]; navigate: (p: string) => void }) => {
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
    return () => { running = false; cancelAnimationFrame(animRef.current); };
  }, [isPlaying, expanded, totalW]);

  const nudge = (dir: number) => {
    scrollPos.current += dir * itemW;
    if (scrollPos.current < 0) scrollPos.current += totalW;
    if (scrollPos.current >= totalW) scrollPos.current -= totalW;
    if (trackRef.current) trackRef.current.style.transform = `translate3d(-${scrollPos.current}px, 0, 0)`;
  };

  // Render a single iPhone card
  const IPhoneCard = ({ item, compact = false }: { item: CarouselItem; compact?: boolean }) => (
    <div className={`flex-shrink-0 cursor-pointer ${compact ? "w-[118px]" : "w-[118px]"}`} onClick={() => navigate(item.nav)}>
      <div className="relative w-full aspect-[9/18] rounded-[20px] border-[2px] overflow-hidden"
        style={{ borderColor: `${item.color}40`, boxShadow: `0 8px 24px hsla(0,0%,0%,0.4), 0 0 12px ${item.color}10` }}>
        <div className="absolute top-[4px] left-1/2 -translate-x-1/2 w-[36px] h-[10px] bg-black rounded-full z-20" />
        <div className="absolute inset-[2px] rounded-[18px] overflow-hidden bg-black">
          <img src={item.image} alt={item.name} className="w-full h-full object-cover" loading="lazy" />
        </div>
        <div className="absolute bottom-0 left-0 right-0 z-20 p-1.5 pt-8" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.95) 30%, transparent)" }}>
          <div className="flex items-center gap-1 mb-0.5">
            <span className="text-[5px] px-1 py-[1px] rounded-full font-bold tracking-wider uppercase" style={{ background: `${item.color}25`, color: item.color, border: `1px solid ${item.color}35` }}>★ Live</span>
          </div>
          <p className="text-[8px] font-bold text-white leading-tight truncate">{item.name}</p>
          <p className="text-[5px] text-white/40 truncate">{item.label}</p>
        </div>
        <div className="absolute bottom-[3px] left-1/2 -translate-x-1/2 w-[30px] h-[2.5px] bg-white/20 rounded-full z-20" />
      </div>
    </div>
  );

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
      </div>
    );
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
          <button onClick={() => setIsPlaying(p => !p)} className="w-7 h-7 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary/30 transition-colors">
            {isPlaying ? <Pause className="w-3 h-3 text-foreground/50" /> : <Play className="w-3 h-3 text-foreground/50" />}
          </button>
          <button onClick={() => nudge(1)} className="w-7 h-7 rounded-full border border-foreground/10 flex items-center justify-center hover:border-primary/30 transition-colors">
            <ChevronRight className="w-3.5 h-3.5 text-foreground/50" />
          </button>
        </div>
        <button onClick={() => { setIsPlaying(false); setExpanded(true); }} className="text-[10px] font-semibold text-primary/70 flex items-center gap-1">
          <Layers className="w-3 h-3" /> Vedi Tutti
        </button>
      </div>

      {/* Carousel track */}
      <div className="overflow-hidden mx-2">
        <div ref={trackRef} className="flex gap-[4px] will-change-transform" style={{ width: `${loopItems.length * itemW}px` }}>
          {loopItems.map((item, i) => <IPhoneCard key={i} item={item} />)}
        </div>
      </div>
    </div>
  );
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
    cartoonFood, cartoonNcc, cartoonBeauty, cartoonHealthcare, cartoonRetail, cartoonFitness, cartoonHotel,
  } = useLandingAssets();
  const [weeklyHours, setWeeklyHours] = useState(20);
  const [hourlyCost, setHourlyCost] = useState(20);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [ctaVisible, setCtaVisible] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeIndustry, setActiveIndustry] = useState(0);
  const [premiumGrid, setPremiumGrid] = useState(true); // kept for type safety
  const mockupCarouselRef = useRef<HTMLDivElement>(null);
  const [mockupCarouselPaused, setMockupCarouselPaused] = useState(false);

  const heroRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 1, 0]);
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 80]);
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 0.97]);

  /* Mobile viewport-animation safety: force-reveal any elements stuck at opacity 0 */
  useEffect(() => {
    if (window.innerWidth >= 640) return;
    const revealHidden = () => {
      document.querySelectorAll<HTMLElement>('[style*="opacity: 0"]').forEach(el => {
        const rect = el.getBoundingClientRect();
        // If element should be visible (above viewport bottom + 100px buffer)
        if (rect.top < window.innerHeight + 100 && rect.bottom > -100) {
          el.style.opacity = '1';
          el.style.transform = 'none';
        }
      });
    };
    // Run periodically during scroll
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => { revealHidden(); ticking = false; });
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    // Also run after initial render
    const initialTimer = setTimeout(revealHidden, 800);
    const secondTimer = setTimeout(revealHidden, 2000);
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(initialTimer);
      clearTimeout(secondTimer);
    };
  }, []);

  useEffect(() => {
    const h = () => {
      setNavScrolled(window.scrollY > 60);
      setCtaVisible(window.scrollY > 400);
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    const timer = setInterval(() => setActiveIndustry(p => (p + 1) % 7), 3000);
    return () => clearInterval(timer);
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
    { id: "hospitality" as const, icon: <Building className="w-5 h-5" />, title: "Hospitality", desc: "Hotel, B&B, agriturismi, resort", gradient: "from-purple-500/80 to-violet-400", emoji: "🏨", modules: "Camere · Booking · Ospiti · Concierge", image: cartoonHotel },
  ];

  const extraSectors = [
    { icon: "🎓", title: "Formazione & Coaching", desc: "Corsi, tutoring, certificazioni", gradient: "from-violet-500 to-purple-400" },
    { icon: "🏖️", title: "Stabilimenti Balneari", desc: "Ombrelloni, lettini, bar spiaggia", gradient: "from-indigo-400 to-violet-400" },
    { icon: "🐾", title: "Veterinari & Pet Care", desc: "Cliniche, toelettature, pensioni", gradient: "from-purple-400 to-fuchsia-400/80" },
    { icon: "🔧", title: "Artigiani & Impiantisti", desc: "Idraulici, elettricisti, caldaisti", gradient: "from-indigo-500 to-purple-400" },
    { icon: "🎨", title: "Studi Creativi", desc: "Fotografi, designer, architetti", gradient: "from-fuchsia-500/80 to-violet-400" },
    { icon: "🏋️", title: "CrossFit & Functional", desc: "Box, classi, WOD, membership", gradient: "from-purple-500 to-indigo-400" },
    { icon: "🧘", title: "Yoga & Pilates", desc: "Studi, ritiri, classi online", gradient: "from-violet-400 to-purple-300" },
    { icon: "🚿", title: "Lavanderie & Stirerie", desc: "Ritiro, consegna, abbonamenti", gradient: "from-indigo-400 to-violet-300" },
    { icon: "🎵", title: "Scuole di Musica", desc: "Lezioni, sale prove, eventi", gradient: "from-purple-500 to-violet-400" },
    { icon: "🏠", title: "Agenzie Immobiliari", desc: "Annunci, visite, CRM clienti", gradient: "from-indigo-500 to-violet-500" },
    { icon: "⚖️", title: "Studi Legali", desc: "Pratiche, clienti, parcelle", gradient: "from-slate-500 to-violet-400/60" },
    { icon: "🏗️", title: "Edilizia & Costruzioni", desc: "Cantieri, preventivi, SAL", gradient: "from-purple-500/80 to-indigo-400" },
    { icon: "🎭", title: "Eventi & Catering", desc: "Booking, menu, staff, logistica", gradient: "from-violet-500 to-purple-400" },
    { icon: "🚗", title: "Autofficine & Carrozzerie", desc: "Interventi, ricambi, preventivi", gradient: "from-indigo-400/80 to-violet-400/60" },
    { icon: "📦", title: "Logistica & Spedizioni", desc: "Tracking, magazzino, consegne", gradient: "from-purple-400 to-indigo-400" },
    { icon: "🌿", title: "Giardinaggio & Vivaisti", desc: "Interventi, manutenzione, vendita", gradient: "from-violet-400 to-purple-400" },
    { icon: "🎪", title: "Intrattenimento", desc: "Parchi, escape room, bowling", gradient: "from-fuchsia-400/80 to-violet-400" },
    { icon: "🏫", title: "Asili & Doposcuola", desc: "Iscrizioni, presenze, comunicazioni", gradient: "from-indigo-400 to-purple-300" },
  ];

  const services = [
    { icon: <Brain className="w-4 h-4 sm:w-5 sm:h-5" />, title: "AI Business Engine", desc: "L'IA analizza il tuo business, genera cataloghi, ottimizza prezzi e automatizza le operazioni quotidiane.", tag: "IA", color: "from-primary to-accent" },
    { icon: <Smartphone className="w-4 h-4 sm:w-5 sm:h-5" />, title: "App White Label", desc: "App professionale installabile con il TUO brand, colori e dominio. Nessun logo di terzi, mai.", tag: "APP", color: "from-violet-500 to-primary" },
    { icon: <Calendar className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Prenotazioni & Ordini", desc: "Gestisci appuntamenti, ordini, prenotazioni corse o camere da un unico pannello centralizzato.", tag: "OPS", color: "from-indigo-400 to-violet-500" },
    { icon: <Shield className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Review Shield™", desc: "Le recensioni negative restano nel tuo archivio privato. Solo le migliori costruiscono la tua reputazione online.", tag: "BRAND", color: "from-purple-400 to-violet-500" },
    { icon: <Users className="w-4 h-4 sm:w-5 sm:h-5" />, title: "CRM & Fidelizzazione", desc: "Storico acquisti, preferenze, wallet fedeltà digitale. Trasforma i visitatori in clienti ricorrenti.", tag: "GROWTH", color: "from-fuchsia-500/80 to-purple-500" },
    { icon: <BarChart3 className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Analytics & Finance", desc: "Dashboard fatturato, margini, performance staff, trend e fatturazione elettronica integrata.", tag: "FINANCE", color: "from-indigo-500 to-violet-400" },
    { icon: <Package className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Inventario & HACCP", desc: "Monitora scorte, ricevi alert automatici, registra controlli igienico-sanitari e conformità.", tag: "OPS", color: "from-purple-500 to-primary" },
    { icon: <Bell className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Marketing Automation", desc: "Push notification, campagne email/WhatsApp, promozioni mirate e segmentazione clienti avanzata.", tag: "MARKETING", color: "from-accent to-violet-500" },
    { icon: <Lock className="w-4 h-4 sm:w-5 sm:h-5" />, title: "Sicurezza Enterprise", desc: "Crittografia AES-256, GDPR compliant, backup automatici, accessi multi-ruolo e audit trail.", tag: "SECURITY", color: "from-violet-400/60 to-indigo-400/60" },
  ];

  const metrics = [
    { value: 200, suffix: "+", label: "Attività Attive" },
    { value: 25, suffix: "+", label: "Settori Coperti" },
    { value: 45, suffix: "%", prefix: "+", label: "Aumento Fatturato" },
    { value: 98, suffix: "%", label: "Soddisfazione" },
  ];

  const testimonials = [
    { name: "Marco Pellegrini", role: "Trattoria da Marco · Roma", quote: "In 3 mesi ho spostato il 60% degli ordini dalla piattaforma alla mia app. Risparmio €3.200 al mese netti.", metric: "−€3.200/mese", industry: "Food", emoji: "🍽️" },
    { name: "Alessandra Conti", role: "NCC Premium Transfer · Milano", quote: "Prima gestivo le prenotazioni via WhatsApp. Ora ho un sistema automatizzato con flotta, tratte e pagamenti integrati.", metric: "+40% fatturato", industry: "NCC", emoji: "🚘" },
    { name: "Valentina Rossi", role: "Beauty Lab · Firenze", quote: "I clienti prenotano dall'app, ricevono promemoria automatici e il no-show è crollato del 70%.", metric: "−70% no-show", industry: "Beauty", emoji: "💅" },
    { name: "Dr. Luca Bianchi", role: "Studio Dentistico · Torino", quote: "Agenda digitale, schede paziente, fatturazione elettronica. Ho eliminato 2 ore di burocrazia al giorno.", metric: "−2h/giorno", industry: "Healthcare", emoji: "🏥" },
    { name: "Simone Moretti", role: "CrossFit Arena · Bologna", quote: "Gestione corsi, abbonamenti e pagamenti in un'unica piattaforma. Il tasso di rinnovo è salito all'87%.", metric: "87% rinnovi", industry: "Fitness", emoji: "💪" },
    { name: "Giulia De Luca", role: "Boutique Eleganza · Napoli", quote: "Il catalogo digitale ha trasformato il mio negozio. Le vendite online sono il 35% del totale.", metric: "+35% vendite", industry: "Retail", emoji: "🛍️" },
  ];

  const faqs = [
    { q: "Per quali settori funziona Empire?", a: "Empire copre oltre 25 settori: ristoranti, NCC, saloni di bellezza, studi medici, negozi, palestre, hotel, idraulici, elettricisti, agriturismi, lidi, e molti altri. Ogni settore ha moduli, terminologia e flussi dedicati che si attivano automaticamente." },
    { q: "È difficile da usare?", a: "No. Se sai usare Instagram, sai usare Empire. L'interfaccia si adatta al tuo settore. L'IA fa il lavoro pesante: carica una foto e in 60 secondi hai il tuo catalogo digitale completo." },
    { q: "Come funzionano i pagamenti?", a: "I pagamenti arrivano direttamente sul TUO conto via Stripe Connect. Non tocchiamo mai i tuoi soldi. L'unica trattenuta è il 2% automatico — 15× meno delle piattaforme tradizionali." },
    { q: "Quanto costa davvero?", a: "€2.997 una tantum (o 3 rate da €1.099). Dopodiché €0/mese per sempre. Solo il 2% sulle transazioni. Nessun vincolo, nessun costo nascosto." },
    { q: "I miei dati sono al sicuro?", a: "Sì. Crittografia AES-256, conformità GDPR, backup automatici e accessi multi-ruolo. Standard enterprise anche per la piccola attività. I tuoi dati sono di tua proprietà." },
    { q: "Come funziona il Partner Program?", a: "Diventi Partner gratis. Guadagni €997 per ogni vendita + bonus fino a €1.500/mese. Pagamenti istantanei via Stripe Connect. Nessun rischio, nessun investimento iniziale." },
    { q: "Quanto tempo serve per essere operativi?", a: "24 ore. Il nostro team configura tutto: branding, menu/catalogo, integrazioni. Formazione inclusa. Sei operativo dal giorno 1." },
    { q: "Posso personalizzare tutto?", a: "Assolutamente. Logo, colori, dominio, moduli attivi, flussi operativi, notifiche, template email — tutto è personalizzabile senza toccare codice." },
  ];

  const navLinks = [
    { href: "#industries", label: "Settori" },
    { href: "#services", label: "Funzionalità" },
    { href: "#pricing", label: "Prezzi" },
    { href: "#partner", label: "Partner" },
  ];

  const whyUs = [
    { icon: <Cpu className="w-5 h-5" />, title: "Tecnologia Proprietaria", desc: "Stack tecnologico sviluppato internamente. Non rivendiamo software altrui." },
    { icon: <Workflow className="w-5 h-5" />, title: "Automazione Totale", desc: "Ogni processo ripetitivo viene eliminato. Dal primo contatto alla fatturazione." },
    { icon: <Gauge className="w-5 h-5" />, title: "Performance Garantite", desc: "99.9% uptime, <200ms latenza, scaling automatico fino a milioni di utenti." },
    { icon: <ServerCog className="w-5 h-5" />, title: "Aggiornamenti Continui", desc: "Nuove funzionalità ogni settimana. Il tuo sistema non invecchia mai." },
    { icon: <Database className="w-5 h-5" />, title: "I Tuoi Dati, Per Sempre", desc: "Proprietà totale dei dati. Esporta tutto in qualsiasi momento. Zero lock-in." },
    { icon: <Headphones className="w-5 h-5" />, title: "Supporto Dedicato", desc: "Team italiano disponibile 7/7. Non un chatbot, persone vere che risolvono." },
  ];

  return (
    <div className="min-h-screen bg-background overflow-x-hidden relative noise-overlay">

      {/* ═══════ AMBIENT BACKGROUND ═══════ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Subtle violet ambient orbs */}
        <div className="absolute w-[600px] h-[600px] rounded-full blur-[250px] opacity-[0.04] bg-primary -top-[200px] left-1/4" />
        <div className="absolute w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.03] bg-accent top-[50vh] -right-[100px]" />
        {/* Particles - reduced */}
        <Particle delay={0} size={2} x="10%" y="30%" />
        <Particle delay={2} size={2} x="70%" y="60%" />
        <Particle delay={1.5} size={2} x="50%" y="45%" />
      </div>

      {/* ═══════ NEURAL CELLS BACKGROUND ═══════ */}
      <NeuralCellsBackground />

      {/* ═══════ NAVIGATION — Ultra Premium Luxury Futuristic ═══════ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 pt-[env(safe-area-inset-top)] ${navScrolled ? "pb-0" : "pb-1"}`}>
        {/* Glassmorphism backdrop — deep on scroll with chromatic aberration */}
        <motion.div 
          className="absolute inset-0"
          animate={{ 
            backgroundColor: navScrolled ? "hsla(230,12%,6%,0.92)" : "hsla(230,12%,6%,0)",
            backdropFilter: navScrolled ? "blur(40px) saturate(1.8)" : "blur(0px) saturate(1)",
          }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        />

        {/* ── Top accent line — holographic rainbow shimmer ── */}
        <motion.div 
          className="absolute top-0 left-0 right-0 h-[1.5px]"
          style={{ 
            background: "linear-gradient(90deg, transparent 0%, hsla(38,50%,55%,0.5) 15%, hsla(35,45%,60%,0.4) 30%, hsla(40,40%,58%,0.3) 50%, hsla(35,50%,60%,0.4) 70%, hsla(38,50%,55%,0.5) 85%, transparent 100%)",
            backgroundSize: "300% 100%",
          }}
          animate={{ 
            backgroundPosition: ["0% 0%", "300% 0%"],
            opacity: navScrolled ? 1 : 0,
          }}
          transition={{ 
            backgroundPosition: { duration: 5, repeat: Infinity, ease: "linear" },
            opacity: { duration: 0.6 },
          }}
        />

        {/* ── Bottom edge — premium double-line with glow ── */}
        <motion.div 
          className="absolute bottom-0 left-0 right-0 h-px"
          animate={{ opacity: navScrolled ? 1 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            background: "linear-gradient(90deg, transparent 2%, hsla(38,50%,55%,0.35) 25%, hsla(35,45%,55%,0.25) 50%, hsla(38,50%,55%,0.35) 75%, transparent 98%)",
          }}
        />
        {/* Second faint glow line below */}
        <motion.div 
          className="absolute -bottom-px left-0 right-0 h-[3px]"
          animate={{ opacity: navScrolled ? 0.4 : 0 }}
          transition={{ duration: 0.6 }}
          style={{ 
            background: "linear-gradient(90deg, transparent 5%, hsla(38,45%,55%,0.12) 30%, hsla(35,50%,55%,0.08) 50%, hsla(38,45%,55%,0.12) 70%, transparent 95%)",
            filter: "blur(2px)",
          }}
        />

        {/* ── Scanning beam — luxury gold/violet sweep ── */}
        {navScrolled && (
          <motion.div
            className="absolute bottom-0 left-0 h-[2px] w-32 pointer-events-none rounded-full"
            style={{ 
              background: "linear-gradient(90deg, transparent, hsla(35,50%,60%,0.6), hsla(38,55%,58%,0.9), hsla(40,50%,55%,0.6), transparent)",
              boxShadow: "0 0 16px hsla(38,55%,58%,0.5), 0 0 30px hsla(38,55%,58%,0.15)",
            }}
            animate={{ x: ["-15vw", "115vw"] }}
            transition={{ duration: 4.5, repeat: Infinity, ease: "linear", repeatDelay: 0.8 }}
          />
        )}

        {/* ── HUD Corner decorations ── */}
        {navScrolled && (
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
        )}

        {/* ── Ambient particle dots — floating in header ── */}
        {navScrolled && (
          <>
            <motion.div className="absolute w-1 h-1 rounded-full pointer-events-none"
              style={{ background: "hsla(38,50%,55%,0.4)", top: "50%", left: "12%" }}
              animate={{ opacity: [0, 0.7, 0], y: [-3, 3, -3], scale: [0.8, 1.3, 0.8] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            />
            <motion.div className="absolute w-0.5 h-0.5 rounded-full pointer-events-none"
              style={{ background: "hsla(35,50%,60%,0.4)", top: "35%", right: "18%" }}
              animate={{ opacity: [0, 0.5, 0], y: [2, -2, 2] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
            />
            <motion.div className="absolute w-[3px] h-[3px] rounded-full pointer-events-none"
              style={{ background: "hsla(35,45%,55%,0.25)", top: "60%", left: "55%" }}
              animate={{ opacity: [0, 0.4, 0], x: [-2, 2, -2] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 2.5 }}
            />
          </>
        )}

        <div className="relative max-w-[1200px] mx-auto px-3 sm:px-6 flex items-center justify-between h-12 sm:h-16 pt-2 sm:pt-3">
          
          {/* ═══ Left Nav Links (desktop) ═══ */}
          <div className="hidden lg:flex items-center gap-1 flex-1">
            {navLinks.slice(0, Math.ceil(navLinks.length / 2)).map((link, i) => (
              <motion.a key={link.href} href={link.href}
                className="relative px-5 py-2.5 text-[0.68rem] font-medium text-foreground/40 hover:text-foreground transition-all duration-500 tracking-[0.18em] uppercase group rounded-xl"
                whileHover={{ backgroundColor: "hsla(38,45%,55%,0.08)" }}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.3, type: "spring", damping: 20 }}
              >
                <span className="relative z-10">{link.label}</span>
                {/* Hover underline — animated gradient sweep */}
                <motion.span 
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full origin-center"
                  style={{ background: "linear-gradient(90deg, hsla(35,50%,55%,0.7), hsla(38,55%,58%,0.9), hsla(40,50%,60%,0.7), hsla(35,50%,55%,0.7))", backgroundSize: "200% 100%" }}
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ width: "70%", opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
                {/* Hover glow aura */}
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 24px hsla(38,50%,55%,0.06), 0 0 12px hsla(38,50%,55%,0.03)" }}
                />
              </motion.a>
            ))}
          </div>

          {/* ═══ Centered Logo — Ultra Premium Luxury ═══ */}
          <a href="#hero" className="flex items-center gap-4 group relative lg:absolute lg:left-1/2 lg:-translate-x-1/2 z-10">
            {/* Outer breathing halo — soft gold */}
            <motion.div
              className="absolute -inset-14 rounded-full pointer-events-none"
              style={{ background: "radial-gradient(circle, hsla(38,40%,55%,0.12), hsla(38,35%,50%,0.04), transparent 60%)" }}
              animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            />
            {/* Secondary halo ring */}
            <motion.div
              className="absolute -inset-8 rounded-full pointer-events-none"
              style={{ border: "1px solid hsla(38,40%,55%,0.06)" }}
              animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0, 0.2] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeOut" }}
            />

            {/* Logo container — hexagonal feel with premium depth */}
            <motion.div
              className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-[16px] flex items-center justify-center"
              style={{
                background: "linear-gradient(145deg, hsla(38,45%,20%,1), hsla(35,40%,14%,1), hsla(30,35%,10%,1))",
                boxShadow: "0 0 0 1px hsla(38,50%,50%,0.2), 0 0 40px hsla(38,50%,50%,0.15), 0 8px 32px hsla(0,0%,0%,0.4), inset 0 1px 0 hsla(38,50%,60%,0.15)",
              }}
              whileHover={{ scale: 1.12, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Inner gold border — subtle luxury */}
              <div className="absolute inset-[2px] rounded-[14px] border border-[hsla(38,50%,50%,0.12)] pointer-events-none" />
              
              {/* Orbital ring — slow elegant rotation */}
              <motion.div
                className="absolute -inset-1 rounded-[20px] pointer-events-none"
                style={{ border: "1px solid transparent", borderTopColor: "hsla(38,45%,55%,0.35)", borderRightColor: "hsla(38,45%,55%,0.1)" }}
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
              />
              
              {/* Counter-rotating inner ring */}
              <motion.div
                className="absolute inset-0.5 rounded-[14px] pointer-events-none"
                style={{ border: "0.5px solid transparent", borderBottomColor: "hsla(38,40%,55%,0.2)" }}
                animate={{ rotate: [360, 0] }}
                transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
              />

              {/* Single elegant shimmer */}
              <motion.div
                className="absolute inset-0 rounded-[14px] pointer-events-none overflow-hidden"
              >
                <motion.div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(115deg, transparent 30%, hsla(38,50%,70%,0.25) 48%, hsla(38,50%,70%,0.08) 52%, transparent 70%)" }}
                  animate={{ x: ["-150%", "250%"] }}
                  transition={{ duration: 3, repeat: Infinity, repeatDelay: 5, ease: "easeInOut" }}
                />
              </motion.div>

              {/* Crown icon */}
              <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-[hsla(38,50%,65%,0.9)] drop-shadow-[0_0_8px_hsla(38,50%,55%,0.4)]" />
              
              {/* Breathing pulse ring */}
              <motion.div
                className="absolute inset-0 rounded-[16px] pointer-events-none"
                style={{ border: "1px solid hsla(38,50%,55%,0.15)" }}
                animate={{ scale: [1, 1.35], opacity: [0.4, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeOut" }}
              />

              {/* Status indicator */}
              <motion.div 
                className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full z-10"
                style={{ backgroundColor: "hsla(160,50%,50%,0.9)", boxShadow: "0 0 8px hsla(160,50%,50%,0.6)" }}
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </motion.div>

            {/* Brand text — refined luxury typography */}
            <div className="flex flex-col leading-none gap-1">
              <motion.span 
                className="font-heading font-bold text-[0.9rem] sm:text-[1.1rem] tracking-[0.4em] uppercase"
                style={{
                  background: "linear-gradient(135deg, hsla(0,0%,95%,1) 0%, hsla(38,30%,78%,1) 50%, hsla(0,0%,95%,1) 100%)",
                  backgroundSize: "200% 100%",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
                animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              >
                EMPIRE
              </motion.span>
              <div className="flex items-center gap-2">
                {/* Thin elegant line */}
                <motion.div 
                  className="h-px flex-1 max-w-[12px]"
                  style={{ background: "linear-gradient(90deg, transparent, hsla(38,40%,55%,0.4))" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="text-[0.42rem] sm:text-[0.52rem] tracking-[0.45em] uppercase font-medium"
                  style={{ color: "hsla(38,35%,58%,0.7)" }}
                >
                  AUTONOMOUS AI
                </span>
                <motion.div 
                  className="h-px flex-1 max-w-[12px]"
                  style={{ background: "linear-gradient(90deg, hsla(38,40%,55%,0.4), transparent)" }}
                  animate={{ opacity: [0.3, 0.6, 0.3] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
                />
              </div>
            </div>
          </a>

          {/* ═══ Right Nav Links + CTA (desktop) ═══ */}
          <div className="hidden lg:flex items-center gap-1 flex-1 justify-end">
            {navLinks.slice(Math.ceil(navLinks.length / 2)).map((link, i) => (
              <motion.a key={link.href} href={link.href}
                className="relative px-5 py-2.5 text-[0.68rem] font-medium text-foreground/40 hover:text-foreground transition-all duration-500 tracking-[0.18em] uppercase group rounded-xl"
                whileHover={{ backgroundColor: "hsla(38,45%,55%,0.08)" }}
                initial={{ opacity: 0, y: -16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 + 0.5, type: "spring", damping: 20 }}
              >
                <span className="relative z-10">{link.label}</span>
                <motion.span 
                  className="absolute bottom-1 left-1/2 -translate-x-1/2 h-[2px] rounded-full origin-center"
                  style={{ background: "linear-gradient(90deg, hsla(35,50%,55%,0.7), hsla(38,55%,60%,0.9), hsla(40,50%,58%,0.7), hsla(35,50%,55%,0.7))", backgroundSize: "200% 100%" }}
                  initial={{ width: 0, opacity: 0 }}
                  whileHover={{ width: "70%", opacity: 1 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                />
                <motion.div
                  className="absolute inset-0 rounded-xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ boxShadow: "inset 0 0 24px hsla(38,50%,55%,0.06), 0 0 12px hsla(38,50%,55%,0.03)" }}
                />
              </motion.a>
            ))}

            {/* Premium CTA button — diamond-cut with holographic glow */}
            <motion.button
              onClick={() => scrollTo("contact")}
              className="ml-5 px-8 py-3 rounded-full text-primary-foreground text-[0.65rem] font-bold font-heading tracking-[0.22em] uppercase relative overflow-hidden group"
              style={{ 
                background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(34,50%,42%,1), hsla(30,45%,38%,1))",
                boxShadow: "0 4px 28px hsla(38,55%,50%,0.3), 0 0 0 1px hsla(38,55%,60%,0.2), 0 12px 40px hsla(38,55%,50%,0.08)",
              }}
              whileHover={{ scale: 1.06, boxShadow: "0 8px 44px hsla(38,55%,50%,0.45), 0 0 0 1.5px hsla(38,55%,60%,0.3), 0 16px 60px hsla(38,55%,50%,0.12)" }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, type: "spring", damping: 18 }}
            >
              {/* Multi-layer shimmer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.35) 46%, rgba(255,255,255,0.12) 54%, transparent 75%)" }}
                animate={{ x: ["-130%", "230%"] }}
                transition={{ duration: 2, repeat: Infinity, repeatDelay: 2, ease: "easeInOut" }}
              />
              {/* Reverse shimmer layer */}
              <motion.div
                className="absolute inset-0 pointer-events-none"
                style={{ background: "linear-gradient(255deg, transparent 30%, rgba(255,255,255,0.15) 50%, transparent 70%)" }}
                animate={{ x: ["150%", "-150%"] }}
                transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 3.5, ease: "easeInOut", delay: 1 }}
              />
              {/* Pulsing outer glow ring — holographic */}
              <motion.div
                className="absolute -inset-[1.5px] rounded-full pointer-events-none"
                style={{ 
                  background: "linear-gradient(135deg, hsla(38,55%,60%,0.4), hsla(35,50%,55%,0.25), hsla(40,45%,58%,0.3), hsla(38,55%,60%,0.4))",
                  backgroundSize: "300% 300%",
                }}
                animate={{ 
                  opacity: [0.3, 0.7, 0.3],
                  backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
                }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />
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
            style={{ background: mobileMenuOpen ? "hsla(38,45%,55%,0.1)" : "transparent" }}
          >
            {/* Glow ring on open */}
            {mobileMenuOpen && (
              <motion.div className="absolute inset-0 rounded-xl pointer-events-none"
                style={{ boxShadow: "0 0 15px hsla(38,50%,55%,0.15), inset 0 0 10px hsla(38,50%,55%,0.04)" }}
                animate={{ opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            )}
            <AnimatePresence mode="wait">
              {mobileMenuOpen ? (
                <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <X className="w-5 h-5" />
                </motion.div>
              ) : (
                <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.25 }}>
                  <Menu className="w-5 h-5" />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        </div>

        {/* ═══ Mobile menu — premium glassmorphism with HUD styling ═══ */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="lg:hidden overflow-hidden relative"
              style={{ backgroundColor: "hsla(230,12%,5%,0.96)", backdropFilter: "blur(40px) saturate(1.8)" }}>
              {/* Top holographic line */}
              <motion.div className="h-[1.5px] w-full" 
                style={{ 
                  background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.4), hsla(35,50%,55%,0.35), hsla(40,45%,55%,0.3), hsla(38,50%,55%,0.4), transparent)",
                  backgroundSize: "300% 100%",
                }}
                animate={{ backgroundPosition: ["0% 0%", "300% 0%"] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />
              {/* HUD side lines */}
              <motion.div className="absolute left-0 top-2 bottom-2 w-[1px] pointer-events-none"
                style={{ background: "linear-gradient(180deg, hsla(38,50%,55%,0.3), transparent 30%, transparent 70%, hsla(38,50%,55%,0.2))" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
              />
              <motion.div className="absolute right-0 top-2 bottom-2 w-[1px] pointer-events-none"
                style={{ background: "linear-gradient(180deg, hsla(35,50%,60%,0.3), transparent 30%, transparent 70%, hsla(35,50%,60%,0.3))" }}
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }}
              />
              <div className="flex flex-col items-center gap-1 py-6 px-5">
                {navLinks.map((link, i) => (
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
                      transition={{ duration: 0.3 }}
                    />
                  </motion.a>
                ))}
                <motion.button onClick={() => { scrollTo("contact"); setMobileMenuOpen(false); }}
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35, type: "spring", damping: 18 }}
                  className="mt-4 w-full py-3.5 rounded-xl text-primary-foreground text-xs font-bold tracking-[0.2em] uppercase font-heading relative overflow-hidden"
                  style={{ 
                    background: "linear-gradient(135deg, hsla(38,55%,48%,1), hsla(34,50%,42%,1), hsla(30,45%,38%,1))",
                    boxShadow: "0 4px 24px hsla(38,55%,50%,0.3), 0 0 0 1px hsla(38,55%,60%,0.15)",
                  }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 25%, rgba(255,255,255,0.3) 48%, transparent 75%)" }}
                    animate={{ x: ["-130%", "230%"] }}
                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 2.5, ease: "easeInOut" }}
                  />
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
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════════════════════════════════════
          HERO
         ═══════════════════════════════════════════ */}
       <motion.section ref={heroRef} id="hero" className="relative min-h-[100dvh] flex items-center overflow-hidden px-5 sm:px-6 pt-28 sm:pt-28 pb-20 sm:pb-16"
         style={{ opacity: heroOpacity }}>

        {/* ═══ LAYER 0: Cinematic video background ═══ */}
        <div className="absolute inset-0" style={{ zIndex: 2 }}>
          <video
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            controls={false}
            disablePictureInPicture
            disableRemotePlayback
            className="absolute inset-0 w-full h-full object-cover [&::-webkit-media-controls]:hidden [&::-webkit-media-controls-enclosure]:hidden [&::-webkit-media-controls-panel]:hidden [&::-webkit-media-controls-start-playback-button]:hidden"
            style={{ filter: "brightness(0.3) saturate(1.15)", WebkitAppearance: "none" } as any}
          >
            <source src="https://videos.pexels.com/video-files/3129671/3129671-hd_1920_1080_30fps.mp4" type="video/mp4" />
          </video>
          {/* Cinematic vignette overlays */}
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 55% at 50% 45%, transparent 30%, hsl(var(--background)) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, hsl(var(--background)) 0%, transparent 15%, transparent 85%, hsl(var(--background)) 100%)" }} />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, hsla(230,20%,15%,0.4) 0%, transparent 50%, hsla(35,50%,30%,0.25) 100%)" }} />
        </div>

        {/* ═══ LAYER 1: Central glow orb ═══ */}
        <div className="absolute top-[15%] left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" style={{ zIndex: 3 }}>
          <motion.div className="w-[500px] h-[500px] sm:w-[800px] sm:h-[800px] rounded-full blur-[180px]"
            style={{ background: "radial-gradient(circle, hsla(38,50%,50%,0.06), hsla(35,45%,50%,0.03), transparent 70%)" }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        <motion.div className="relative z-10 max-w-[1100px] mx-auto w-full" style={{ y: heroY, scale: heroScale }}>
          <div className="flex flex-col items-center text-center max-w-[900px] mx-auto">

            {/* Clean badge — gold accent */}
            <motion.div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border bg-primary/[0.04] backdrop-blur-sm mb-5 sm:mb-7"
              style={{ borderColor: "hsla(35,45%,50%,0.2)" }}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: "hsl(35,45%,50%)" }} />
              <span className="text-[0.55rem] sm:text-[0.6rem] font-heading font-semibold tracking-[2px] uppercase" style={{ color: "hsla(35,45%,55%,0.85)" }}>Il Sistema Operativo per il Tuo Business</span>
            </motion.div>

            {/* Headline — gold shimmer */}
            <motion.h1 className="text-[1.7rem] leading-[1.08] sm:text-[3.2rem] md:text-[4rem] lg:text-[4.8rem] font-heading font-bold tracking-[-0.03em] px-4 sm:px-0"
              initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3, duration: 0.8, ease: smoothEase }}>
              <span className="text-foreground">Modernizziamo</span>
              <br />
              <span className="text-gold-shimmer">Qualsiasi Business</span>
            </motion.h1>

            {/* Subtitle */}
            <motion.p className="mt-5 sm:mt-6 text-sm sm:text-lg text-foreground/45 max-w-[560px] leading-[1.7] sm:leading-[1.8] font-light px-2 sm:px-0"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.7 }}>
              Un unico ecosistema AI che gestisce, automatizza e scala il tuo business —
              <span className="text-foreground/60 font-normal"> dal primo cliente all'impero multi-sede. Nessun codice, nessuna commissione nascosta, solo risultati misurabili.</span>
            </motion.p>

            {/* ═══ Interactive AI Particle Sphere ═══ */}
            <motion.div
              className="relative mt-6 sm:mt-8 mx-auto overflow-visible"
              initial={{ opacity: 0, scale: 0.5, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Ambient glow behind sphere */}
              <motion.div
                className="absolute inset-[-40%] rounded-full blur-[100px] pointer-events-none"
                style={{ background: "radial-gradient(ellipse 60% 60% at 50% 50%, hsla(265,65%,55%,0.2), hsla(38,50%,50%,0.1), transparent 70%)" }}
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              />
              <InteractiveParticleSphere size={typeof window !== "undefined" && window.innerWidth < 640 ? 200 : 300} />
            </motion.div>

            {/* CTA */}
            <motion.div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto px-2 sm:px-0"
              initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
              <motion.button
                onClick={() => scrollTo("pricing")}
                className="group relative w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase overflow-hidden"
                whileHover={{ scale: 1.02, boxShadow: "0 10px 40px hsla(265,70%,60%,0.25)" }}
                whileTap={{ scale: 0.97 }}
              >
                <span className="absolute inset-0 bg-gradient-to-r from-foreground/0 via-foreground/10 to-foreground/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
                <span className="relative flex items-center justify-center gap-2">
                  Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </span>
              </motion.button>
              <motion.button
                onClick={() => navigate("/demo")}
                className="w-full sm:w-auto px-7 sm:px-8 py-3.5 sm:py-4 rounded-full text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:text-foreground hover:bg-primary/[0.03] transition-all flex items-center justify-center gap-2"
                style={{ border: "1px solid hsla(35,45%,50%,0.12)" }}
                whileHover={{ scale: 1.01, borderColor: "hsla(35,45%,50%,0.25)" }}
              >
                <Play className="w-4 h-4" style={{ color: "hsla(35,45%,55%,0.6)" }} /> Vedi Demo Live
              </motion.button>
            </motion.div>

            {/* Metrics — premium glassmorphism cards */}
            <motion.div className="mt-14 sm:mt-20 w-full grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-4"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.3, duration: 0.8 }}>
              {metrics.map((m, i) => (
                <motion.div key={i} className="group relative rounded-2xl p-5 sm:p-6 text-center overflow-hidden backdrop-blur-xl"
                  style={{
                    background: "linear-gradient(145deg, hsla(230,12%,13%,0.97), hsla(230,10%,10%,0.98))",
                    border: "1px solid hsla(35,30%,45%,0.15)",
                    boxShadow: "inset 0 1px 0 hsla(35,40%,55%,0.08), 0 8px 30px hsla(230,10%,4%,0.5)"
                  }}
                  whileHover={{ y: -4, scale: 1.02, boxShadow: "inset 0 1px 0 hsla(35,40%,55%,0.12), 0 12px 40px hsla(230,10%,4%,0.6)" }}
                  transition={{ duration: 0.3, ease: "easeOut" }}>
                  {/* Shimmer sweep — subtle */}
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 30%, hsla(35,30%,55%,0.06) 48%, transparent 70%)" }}
                    animate={{ x: ["-200%", "300%"] }}
                    transition={{ duration: 4, repeat: Infinity, repeatDelay: 3 + i, ease: "easeInOut" }}
                  />
                  {/* Top highlight line */}
                  <div className="absolute top-0 left-[10%] right-[10%] h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(35,35%,50%,0.2), transparent)" }} />
                  {/* Number */}
                  <p className="text-3xl sm:text-4xl font-heading font-bold relative z-10" style={{ color: "hsla(35,45%,82%,1)", textShadow: "0 0 20px hsla(35,40%,50%,0.15)" }}>
                    <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
                  </p>
                  {/* Label */}
                  <p className="text-[0.6rem] sm:text-[0.65rem] mt-2.5 tracking-[3px] uppercase font-heading font-semibold relative z-10" style={{ color: "hsla(35,20%,65%,0.7)" }}>{m.label}</p>
                </motion.div>
              ))}
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
      <div className="relative py-5 border-y border-primary/[0.08] overflow-hidden bg-card/90 backdrop-blur-sm">
        <div className="flex animate-marquee-scroll whitespace-nowrap">
          {[...Array(2)].map((_, repeat) => (
            <div key={repeat} className="flex items-center gap-12 px-6">
              {[
                { icon: <CreditCard className="w-3 h-3" />, text: "Stripe Connect" },
                { icon: <Lock className="w-3 h-3" />, text: "AES-256" },
                { icon: <Smartphone className="w-3 h-3" />, text: "PWA Certified" },
                { icon: <Shield className="w-3 h-3" />, text: "GDPR Compliant" },
                { icon: <Zap className="w-3 h-3" />, text: "99.9% Uptime" },
                { icon: <Cpu className="w-3 h-3" />, text: "AI-Powered" },
                { icon: <MapPin className="w-3 h-3" />, text: "Made in Italy" },
                { icon: <Fingerprint className="w-3 h-3" />, text: "White Label" },
                { icon: <Globe className="w-3 h-3" />, text: "25+ Settori" },
                { icon: <Timer className="w-3 h-3" />, text: "Attivo in 24h" },
                { icon: <LineChart className="w-3 h-3" />, text: "Updates Settimanali" },
              ].map((t, i) => (
                <span key={i} className="text-[0.6rem] text-foreground/20 font-heading tracking-[3px] uppercase flex items-center gap-2 group/trust">
                  <motion.span
                    className="text-primary/40 group-hover/trust:text-primary/70 transition-colors"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 12, repeat: Infinity, ease: "linear", delay: i * 0.5 }}
                  >
                    {t.icon}
                  </motion.span>
                  {t.text}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          IL PROBLEMA — Pain Points
         ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(230,15%,6%,1) 0%, hsla(0,8%,8%,1) 40%, hsla(230,12%,7%,1) 70%, hsla(230,15%,6%,1) 100%)",
      }}>
        {/* Premium ambient glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/3 w-[500px] h-[500px] rounded-full opacity-[0.06]" style={{ background: "radial-gradient(circle, hsla(0,50%,40%,0.4), transparent 70%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-1/3 right-1/4 w-[350px] h-[350px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(circle, hsla(38,50%,50%,0.35), transparent 70%)", filter: "blur(100px)" }} />
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
            { icon: <Target className="w-4 h-4" />, title: "Marketing Cieco", desc: "Pubblicità senza tracking. Zero segmentazione, zero automazione.", stat: "0%", color: "from-amber-600/80 to-orange-500/80" },
          ];
          return (
            <div className="relative">
              {/* Horizontal connecting line behind cards */}
              <motion.div
                className="absolute top-1/2 left-0 right-0 h-px hidden lg:block"
                style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.2) 10%, hsla(38,50%,55%,0.15) 50%, hsla(265,70%,60%,0.2) 90%, transparent)" }}
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              {/* Data pulse dots on the line */}
              {[0, 1, 2].map(d => (
                <motion.div key={d} className="absolute top-1/2 -translate-y-1/2 w-1 h-1 rounded-full hidden lg:block"
                  style={{ left: `${25 + d * 25}%`, background: "hsla(265,80%,65%,0.6)", boxShadow: "0 0 8px hsla(265,80%,65%,0.4)" }}
                  animate={{ opacity: [0, 1, 0], scale: [0.5, 1.5, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity, delay: d * 0.7 }}
                />
              ))}

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
                {painData.map((pain, i) => (
                  <motion.div
                    key={i}
                    className="relative group"
                    initial={{ opacity: 0, y: 20, scale: 0.9 }}
                    whileInView={{ opacity: 1, y: 0, scale: 1 }}
                    viewport={{ once: true, margin: "-30px" }}
                    transition={{ duration: 0.5, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    whileHover={{ y: -6, scale: 1.04 }}
                  >
                    <div className="relative rounded-xl border overflow-hidden h-full" style={{
                      background: "linear-gradient(160deg, hsla(260,18%,13%,0.95), hsla(260,16%,9%,0.92))",
                      borderColor: "hsla(265,50%,55%,0.1)",
                      boxShadow: "0 4px 24px hsla(260,40%,5%,0.5), inset 0 1px 0 hsla(265,60%,65%,0.06)",
                    }}>
                      {/* Top accent line */}
                      <div className="h-[2px] w-full" style={{ background: `linear-gradient(90deg, transparent, ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,55%,0.5)" : pain.color.includes("amber") || pain.color.includes("yellow") ? "hsla(38,70%,55%,0.5)" : "hsla(25,70%,55%,0.5)"}, transparent)` }} />

                      {/* Scan line */}
                      <motion.div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity"
                        style={{ background: "linear-gradient(180deg, transparent 40%, hsla(265,70%,60%,0.04) 50%, transparent 60%)" }}
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                      />

                      <div className="p-3 sm:p-4 flex flex-col items-center text-center">
                        {/* Stat badge */}
                        <motion.div className="mb-2.5 px-2 py-0.5 rounded-full text-[0.5rem] font-heading font-bold tracking-widest border"
                          style={{
                            color: "hsla(0,60%,60%,0.7)",
                            borderColor: "hsla(0,50%,50%,0.15)",
                            background: "hsla(0,50%,50%,0.06)",
                          }}
                          animate={{ borderColor: ["hsla(0,50%,50%,0.1)", "hsla(0,50%,50%,0.25)", "hsla(0,50%,50%,0.1)"] }}
                          transition={{ duration: 3, repeat: Infinity, delay: i * 0.4 }}
                        >
                          {pain.stat}
                        </motion.div>

                        {/* Icon */}
                        <motion.div
                          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-gradient-to-br ${pain.color} flex items-center justify-center text-white mb-3 relative`}
                          style={{ boxShadow: `0 0 20px ${pain.color.includes("red") || pain.color.includes("rose") ? "hsla(0,70%,50%,0.2)" : "hsla(38,70%,50%,0.2)"}` }}
                        >
                          {pain.icon}
                          {/* Corner HUD marks */}
                          <div className="absolute -top-px -left-px w-1.5 h-1.5 border-t border-l border-white/20 rounded-tl-sm" />
                          <div className="absolute -bottom-px -right-px w-1.5 h-1.5 border-b border-r border-white/20 rounded-br-sm" />
                        </motion.div>

                        {/* Title */}
                        <h3 className="font-heading text-[0.7rem] sm:text-xs font-semibold text-foreground mb-1.5 leading-tight">{pain.title}</h3>

                        {/* Description */}
                        <p className="text-[0.55rem] sm:text-[0.6rem] text-foreground/30 leading-[1.6]">{pain.desc}</p>
                      </div>

                      {/* Bottom circuit trace */}
                      <div className="h-px w-full" style={{ background: "linear-gradient(90deg, transparent, hsla(265,50%,55%,0.08), transparent)" }} />
                    </div>

                    {/* Connector dot to horizontal line (desktop) */}
                    <motion.div className="absolute -bottom-[7px] left-1/2 -translate-x-1/2 w-[5px] h-[5px] rounded-full hidden lg:block"
                      style={{ background: "hsla(265,70%,60%,0.4)", boxShadow: "0 0 6px hsla(265,70%,60%,0.3)" }}
                      animate={{ boxShadow: ["0 0 4px hsla(265,70%,60%,0.2)", "0 0 10px hsla(265,70%,60%,0.5)", "0 0 4px hsla(265,70%,60%,0.2)"] }}
                      transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          );
        })()}

        <motion.div className="mt-10 text-center"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-primary/15 bg-primary/[0.04]">
            <ArrowDown className="w-4 h-4 text-primary animate-bounce" />
            <span className="text-xs font-heading font-semibold text-foreground/60">La Soluzione Esiste. <span className="text-primary">Scoprila Ora.</span></span>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          VIDEO HERO — Business Transformation
         ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: "linear-gradient(180deg, hsla(265,18%,6%,1) 0%, hsla(265,15%,9%,1) 35%, hsla(230,12%,8%,1) 65%, hsla(265,18%,6%,1) 100%)",
      }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 right-1/3 w-[500px] h-[500px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsla(265,60%,50%,0.4), transparent 70%)", filter: "blur(130px)" }} />
          <div className="absolute bottom-1/3 left-1/4 w-[350px] h-[350px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(circle, hsla(38,50%,50%,0.3), transparent 70%)", filter: "blur(100px)" }} />
        </div>
        <div className="text-center mb-8">
          <SectionLabel text="Scopri Empire" icon={<Play className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.6rem,4vw,2.8rem)] font-heading font-bold text-foreground leading-[1.08] mb-3"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Non Siamo un Software. <span className="text-shimmer">Siamo il Futuro.</span>
          </motion.h2>
          <motion.p className="text-foreground/70 max-w-[560px] mx-auto text-[0.9rem] leading-[1.85] tracking-wide font-light"
            initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}>
            Oltre 95 Agenti IA autonomi, dashboard predittive, CRM intelligente, gestione flotta e prenotazioni, cataloghi digitali con OCR, automazioni multi-canale, fatturazione elettronica, analytics in tempo reale, voice agent, generazione foto e contenuti AI — un ecosistema white-label completo che lavora 24/7 per ogni settore, senza intervento umano.
          </motion.p>
        </div>
        <motion.div className="relative max-w-3xl mx-auto rounded-2xl overflow-hidden glow-card"
          initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}
          transition={{ duration: 0.6 }}>
          <div className="absolute -inset-8 bg-primary/[0.05] rounded-[60px] blur-[80px] pointer-events-none" />
          <FunnelDNAVisual />
          <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none rounded-2xl" />
          <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
            <div className="px-3 py-1.5 rounded-full bg-background/80 backdrop-blur-sm border border-primary/10">
              <span className="text-[0.6rem] font-heading font-bold text-primary tracking-wider uppercase">Dashboard IA • CRM • Automazioni • Fatturazione</span>
            </div>
          </div>
        </motion.div>

        {/* CTA buttons under video */}
        <motion.div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10"
          initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
          <motion.button
            onClick={() => scrollTo("pricing")}
            className="group px-7 py-3.5 rounded-full bg-vibrant-gradient text-primary-foreground font-bold text-sm font-heading tracking-wider uppercase inline-flex items-center gap-2"
            whileHover={{ scale: 1.03, boxShadow: "0 15px 50px hsla(265,70%,60%,0.25)" }}
            whileTap={{ scale: 0.97 }}
          >
            Prenota Demo Gratuita <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <Play className="w-4 h-4 text-primary/60" /> Esplora le Demo
          </motion.button>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          SETTORI
         ═══════════════════════════════════════════ */}
      <Section id="industries" className="relative overflow-hidden" style={{ background: "linear-gradient(180deg, hsla(260,16%,6%,1) 0%, hsla(265,18%,10%,1) 35%, hsla(260,14%,8%,1) 65%, hsla(260,16%,6%,1) 100%)" }}>
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-0 left-0 w-[350px] h-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse at left, hsla(265,70%,55%,0.5), transparent 70%)" }} />
          <div className="absolute top-0 right-0 w-[350px] h-full opacity-[0.06]" style={{ background: "radial-gradient(ellipse at right, hsla(265,70%,55%,0.5), transparent 70%)" }} />
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full opacity-[0.05]" style={{ background: "radial-gradient(ellipse, hsla(38,50%,50%,0.35), transparent 70%)", filter: "blur(120px)" }} />
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
          };
          const SECTOR_HERO_IMAGES: Record<string, string> = {
            food: sectorHeroFood, ncc: sectorHeroNcc, beauty: sectorHeroBeauty,
            healthcare: sectorHeroHealthcare, retail: sectorHeroRetail,
            fitness: sectorHeroFitness, hospitality: sectorHeroHotel,
          };
          const allItems: CarouselItem[] = [
            { name: "Impero Roma", route: "/r/impero-roma", color: "#e85d04", label: "Food Premium", nav: "/r/impero-roma", image: sectorHeroFood },
            { name: "Amalfi Luxury", route: "/b/amalfi-luxury-transfer", color: "#C9A84C", label: "NCC Premium", nav: "/b/amalfi-luxury-transfer", image: sectorHeroNcc },
            ...industries.map(ind => {
              const slug = DEMO_SLUGS[ind.id];
              const siteRoute = ind.id === "food" ? `/r/${slug}` : `/b/${slug}`;
              const demoPath = ind.id === "food" ? `/r/${slug}` : `/demo/${slug}`;
              const color = INDUSTRY_COLORS[ind.id] || "#8b5cf6";
              const image = SECTOR_HERO_IMAGES[ind.id] || sectorHeroFood;
              return { name: ind.title, route: siteRoute, color, label: ind.modules, nav: demoPath, image };
            }),
          ];
          return <MobileIPhoneCarousel items={allItems} navigate={navigate} />;
        })()}

        {/* ═══ Desktop: iPhone Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5 sm:gap-6 justify-items-center"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {/* ── Featured: Hero image previews ── */}
          {[
            { name: "Impero Roma", route: "/r/impero-roma", color: "#e85d04", label: "Food Premium", image: sectorHeroFood },
            { name: "Amalfi Luxury", route: "/b/amalfi-luxury-transfer", color: "#C9A84C", label: "NCC Premium", image: sectorHeroNcc },
          ].map((feat, i) => (
            <motion.div key={`feat-${i}`} className="group cursor-pointer" variants={fadeScale}
              onClick={() => navigate(feat.route)} whileHover={{ y: -8, scale: 1.03 }}>
              <div className="relative w-[180px] h-[340px] rounded-[32px] border-[2.5px] overflow-hidden transition-shadow duration-500 group-hover:shadow-[0_20px_60px_hsla(0,0%,0%,0.3)]"
                style={{ borderColor: `${feat.color}40`, boxShadow: `0 16px 50px hsla(0,0%,0%,0.45), 0 0 40px ${feat.color}10` }}>
                <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[54px] h-[16px] bg-black rounded-full z-20" />
                <div className="absolute inset-[3px] rounded-[28px] overflow-hidden bg-black">
                  <img src={feat.image} alt={feat.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 p-3 pt-10" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.92), transparent)" }}>
                  <div className="flex items-center gap-1 mb-1">
                    <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase" style={{ background: `${feat.color}25`, color: feat.color, border: `1px solid ${feat.color}35` }}>★ Live</span>
                  </div>
                  <p className="text-[11px] font-bold text-white">{feat.name}</p>
                  <p className="text-[8px] text-white/40">{feat.label}</p>
                </div>
                <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[44px] h-[4px] bg-white/20 rounded-full z-20" />
              </div>
            </motion.div>
          ))}
          {/* ── Standard industry cards — Hero image previews ── */}
          {(() => {
            const SECTOR_IMAGES_D: Record<string, string> = {
              food: sectorHeroFood, ncc: sectorHeroNcc, beauty: sectorHeroBeauty,
              healthcare: sectorHeroHealthcare, retail: sectorHeroRetail,
              fitness: sectorHeroFitness, hospitality: sectorHeroHotel,
            };
            const INDUSTRY_COLORS_D: Record<string, string> = {
              food: "#e85d04", ncc: "#C9A84C", beauty: "#e91e8c", healthcare: "#0ea5e9",
              retail: "#8b5cf6", fitness: "#f97316", hospitality: "#10b981",
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
                      <img src={heroImg} alt={ind.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="absolute bottom-0 left-0 right-0 z-20 p-3 pt-10" style={{ background: "linear-gradient(to top, hsla(0,0%,0%,0.92), transparent)" }}>
                      <div className="flex items-center gap-1 mb-1">
                        <span className="text-[7px] px-1.5 py-0.5 rounded-full font-bold tracking-wider uppercase" style={{ background: `${color}25`, color, border: `1px solid ${color}35` }}>★ Live</span>
                      </div>
                      <h3 className="text-[11px] font-bold text-white leading-tight">{ind.title}</h3>
                      <p className="text-[7px] text-white/40 mt-0.5">{ind.modules}</p>
                    </div>
                    <div className="absolute bottom-[6px] left-1/2 -translate-x-1/2 w-[44px] h-[4px] bg-white/20 rounded-full z-20" />
                  </div>
                </motion.div>
              );
            });
          })()}
          <motion.div
            className="group cursor-pointer"
            variants={fadeScale}
            onClick={() => setSectorSheetOpen(true)}
            whileHover={{ y: -4 }}
          >
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
            whileTap={{ scale: 0.97 }}
          >
            Inizia Ora <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </motion.button>
          <motion.button
            onClick={() => navigate("/demo")}
            className="px-7 py-3.5 rounded-full border border-foreground/8 text-foreground/60 text-sm font-semibold font-heading tracking-wide hover:border-primary/20 hover:text-foreground hover:bg-primary/[0.03] transition-all inline-flex items-center gap-2"
            whileHover={{ scale: 1.01 }}
          >
            <Play className="w-4 h-4 text-primary/60" /> Prova Tutte le Demo
          </motion.button>
        </motion.div>

        {/* ═══ Sector Selector Sheet (iPhone style) ═══ */}
        <AnimatePresence>
          {sectorSheetOpen && (
            <>
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                onClick={() => setSectorSheetOpen(false)}
              />
              {/* Sheet */}
              <motion.div
                className="fixed z-50 inset-x-0 bottom-0 sm:inset-auto sm:top-1/2 sm:left-1/2 sm:w-[420px] sm:max-h-[85vh]"
                style={{ maxHeight: "85vh" }}
                initial={{ y: "100%", x: 0, opacity: 0 }}
                animate={{ y: 0, x: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 30, stiffness: 300 }}
              >
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
                      whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                    >
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
                      { name: "Food & Ristorazione", desc: "Menu Digitale · Ordini · QR · Cucina Live", route: "/r/impero-roma", color: "#e85d04", emoji: "🍽️" },
                      { name: "NCC & Trasporto Premium", desc: "Flotta · Tratte · Booking · Autisti", route: "/b/amalfi-luxury-transfer", color: "#C9A84C", emoji: "🚗" },
                    ].map((feat, i) => (
                      <motion.div key={`featured-${i}`}
                        className="flex items-center gap-3 p-3 rounded-2xl cursor-pointer transition-all"
                        style={{ background: `${feat.color}08`, border: `1px solid ${feat.color}20` }}
                        whileHover={{ scale: 1.01, borderColor: `${feat.color}40` }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => { setSectorSheetOpen(false); navigate(feat.route); }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                      >
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl shadow-lg flex-shrink-0"
                          style={{ background: `${feat.color}18`, border: `1px solid ${feat.color}25` }}>
                          {feat.emoji}
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
                    ))}
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
                          onClick={() => { setSectorSheetOpen(false); navigate(demoPath); }}
                          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                        >
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
                        </motion.div>
                      );
                    })}
                    {/* Divider */}
                    <div className="py-3">
                      <div className="h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.12), transparent)" }} />
                    </div>
                    {/* Extra sectors */}
                    <p className="text-[0.55rem] font-heading font-bold text-foreground/25 tracking-[3px] uppercase px-2 mb-2">In Arrivo & Su Richiesta</p>
                    {extraSectors.map((sec, i) => (
                      <motion.div key={`extra-${i}`}
                        className="flex items-center gap-3 p-3 rounded-2xl transition-all"
                        style={{ background: "hsla(0,0%,100%,0.01)", border: "1px solid hsla(0,0%,100%,0.03)" }}
                        whileHover={{ background: "hsla(0,0%,100%,0.03)", scale: 1.01 }}
                        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 + i * 0.02 }}
                      >
                        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${sec.gradient} flex items-center justify-center text-lg shadow-lg flex-shrink-0 opacity-70`}>
                          {sec.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-heading font-bold text-foreground/60 truncate">{sec.title}</p>
                          <p className="text-[0.6rem] text-foreground/20 truncate">{sec.desc}</p>
                        </div>
                        <span className="text-[0.5rem] font-heading text-foreground/15 tracking-wider uppercase flex-shrink-0">Presto</span>
                      </motion.div>
                    ))}
                  </div>
                  {/* Bottom CTA */}
                  <div className="px-6 py-4" style={{ borderTop: "1px solid hsla(0,0%,100%,0.05)" }}>
                    <motion.button
                      onClick={() => { setSectorSheetOpen(false); scrollTo("contact"); }}
                      className="w-full py-3 rounded-xl font-heading font-bold text-xs tracking-wider uppercase text-primary-foreground"
                      style={{ background: "linear-gradient(135deg, hsla(265,70%,60%,1), hsla(280,60%,50%,1))", boxShadow: "0 8px 30px hsla(265,70%,60%,0.2)" }}
                      whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                    >
                      Non trovi il tuo? Contattaci →
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          AI AGENTS SHOWCASE
         ═══════════════════════════════════════════ */}
      <AIAgentsShowcase />

      <SectionDivider />

      {/*
          PERCHÉ EMPIRE — Unified Section
         ═══════════════════════════════════════════ */}
      <Section style={{
        background: `linear-gradient(180deg, hsla(150,20%,6%,1) 0%, hsla(155,25%,8%,1) 40%, hsla(150,22%,7%,1) 70%, hsla(150,20%,6%,1) 100%)`,
      }}>
        {/* Green tech ambient glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/4 left-1/3 w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.08]" style={{ background: "hsl(150 60% 40%)" }} />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[180px] opacity-[0.05]" style={{ background: "hsl(160 50% 45%)" }} />
        </div>
        <div className="flex flex-col lg:grid lg:grid-cols-2 gap-10 lg:gap-16 items-center mb-14">
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}
            transition={{ duration: 0.6 }} className="text-center lg:text-left order-2 lg:order-1">
            <SectionLabel text="Perché Empire" icon={<Crown className="w-3 h-3 text-accent" />} />
            <h2 className="text-[clamp(1.6rem,4vw,2.6rem)] font-heading font-bold text-foreground leading-[1.08] mb-5">
              I Più Completi. <span className="text-shimmer">I Più Avanzati.</span>
            </h2>
            <p className="text-foreground/40 text-sm leading-[1.7] mb-6 max-w-md mx-auto lg:mx-0">
              Non siamo un gestionale generico. Siamo un ecosistema AI che modernizza, digitalizza e automatizza qualsiasi tipo di attività. Sempre in evoluzione, sempre un passo avanti.
            </p>
            <div className="space-y-2.5 max-w-md mx-auto lg:mx-0">
              {[
                { title: "25+ Settori Supportati", desc: "Ogni industria ha moduli dedicati che si attivano automaticamente" },
                { title: "Aggiornamenti Settimanali", desc: "Nuove funzionalità ogni settimana senza costi aggiuntivi" },
                { title: "IA Integrata Ovunque", desc: "Generazione catalogo, analytics predittivi, automazioni intelligenti" },
                { title: "100% White Label", desc: "Il tuo brand, i tuoi colori, il tuo dominio. Zero marchi terzi" },
              ].map((f, i) => (
                <motion.div key={i}
                  className="relative group rounded-xl overflow-hidden"
                  initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  {/* Premium animated gradient background */}
                  <div className="absolute inset-0 opacity-90" style={{
                    background: `linear-gradient(135deg, hsla(265,25%,12%,0.95) 0%, hsla(230,20%,10%,0.92) 50%, hsla(265,30%,14%,0.95) 100%)`,
                  }} />
                  {/* Subtle shimmer sweep */}
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{
                      background: `linear-gradient(105deg, transparent 40%, hsla(265,60%,55%,0.06) 50%, transparent 60%)`,
                      backgroundSize: "200% 100%",
                    }}
                    animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: i * 0.8 }}
                  />
                  {/* Top accent line */}
                  <div className="absolute top-0 left-0 right-0 h-px" style={{
                    background: `linear-gradient(90deg, transparent, hsla(265,60%,55%,0.25), transparent)`,
                  }} />
                  {/* Content */}
                  <div className="relative z-10 flex gap-3 items-start px-4 py-3" style={{
                    border: "1px solid hsla(265,40%,40%,0.12)",
                    borderRadius: "0.75rem",
                  }}>
                    <div className="w-5 h-5 min-w-[20px] rounded-full bg-primary/20 flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-primary" />
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm font-semibold text-foreground">{f.title}</p>
                      <p className="text-[0.65rem] text-foreground/50 mt-0.5">{f.desc}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
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
                  { text: "IA che Lavora per Te", icon: "🧠" },
                ].map((b, i) => (
                  <motion.div key={i}
                    className="flex items-center gap-2 px-4 py-2 rounded-full backdrop-blur-md"
                    style={{
                      background: "linear-gradient(135deg, hsla(265,30%,12%,0.92), hsla(265,20%,8%,0.88))",
                      border: "1px solid hsla(265,50%,50%,0.12)",
                      boxShadow: "0 4px 20px hsla(265,50%,10%,0.3)"
                    }}
                    initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.8 + i * 0.15, duration: 0.5 }}
                  >
                    <span className="text-sm">{b.icon}</span>
                    <span className="text-[0.6rem] sm:text-xs font-heading font-bold tracking-wider uppercase" style={{ color: "hsla(35,45%,60%,0.9)" }}>{b.text}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefits — Mobile: auto-scroll carousel */}
        <div className="sm:hidden">
          <PremiumCarousel speed="slow" itemWidth={160} showControls={false}>
            {whyUs.map((item, i) => (
              <div key={i} className="w-[160px]">
                <PremiumCard scan delay={i * 0.3} className="p-4 text-center h-full">
                  <motion.div className="text-primary/50 mb-2 flex justify-center"
                    animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.3, ease: "easeInOut" }}>{item.icon}</motion.div>
                  <h4 className="text-[0.65rem] font-heading font-bold text-foreground mb-1">{item.title}</h4>
                  <p className="text-[0.5rem] text-foreground/30 leading-[1.5]">{item.desc}</p>
                </PremiumCard>
              </div>
            ))}
          </PremiumCarousel>
        </div>

        {/* Benefits — Desktop: staggered grid */}
        <motion.div className="hidden sm:grid sm:grid-cols-3 lg:grid-cols-6 gap-3"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {whyUs.map((item, i) => (
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
          ))}
        </motion.div>
      </Section>

      {/* ═══════════════════════════════════════════
          COMPARISON TABLE — Empire vs Others
         ═══════════════════════════════════════════ */}
      <Section className="relative overflow-hidden" style={{
        background: `linear-gradient(180deg, hsla(150,20%,6%,1) 0%, hsla(155,28%,9%,1) 40%, hsla(150,22%,7%,1) 70%, hsla(150,18%,5%,1) 100%)`,
      }}>
        {/* Green tech AI ambient glows */}
        <div className="absolute inset-0 pointer-events-none z-0">
          <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] rounded-full opacity-[0.10]" style={{ background: "radial-gradient(circle, hsla(150,60%,45%,0.4), transparent 70%)", filter: "blur(120px)" }} />
          <div className="absolute bottom-1/4 right-1/5 w-[350px] h-[350px] rounded-full opacity-[0.07]" style={{ background: "radial-gradient(circle, hsla(160,55%,50%,0.35), transparent 70%)", filter: "blur(100px)" }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full opacity-[0.04]" style={{ background: "radial-gradient(ellipse, hsla(140,50%,55%,0.3), transparent 70%)", filter: "blur(150px)" }} />
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
          <CompRow icon="🤖" label="Agenti IA" empire="20+ inclusi" others="Assenti" />
          <CompRow icon="🎙️" label="Voice Agent" empire="Incluso" others="Non disponibile" />
          <CompRow icon="🔗" label="Integrazioni" empire="Stripe · AI · Push" others="Limitate" />
          <CompRow icon="⚡" label="Automazioni" empire="Multi-canale" others="Solo email" />
          <CompRow icon="🌐" label="Sito web" empire="White-label" others="Template generico" />
          <CompRow icon="📋" label="CRM" empire="AI-powered" others="Base / manuale" />
          <CompRow icon="🔒" label="Dati" empire="100% tuoi" others="Del provider" />
          <CompRow icon="🛡️" label="Supporto" empire="7/7 dedicato" others="Ticket 48-72h" />
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          TECH DNA — Neural Network Visualization
         ═══════════════════════════════════════════ */}
      <Section>
        <div className="text-center mb-10 sm:mb-14">
          <SectionLabel text="Tecnologia" icon={<Cpu className="w-3 h-3 text-primary" />} />
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
            { x: "65%", y: "85%", label: "MARKETING", size: 8, primary: false },
          ].map((node, i) => (
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
                  boxShadow: node.primary
                    ? "0 0 30px hsla(265,85%,65%,0.6), 0 0 60px hsla(265,85%,65%,0.3)"
                    : "0 0 12px hsla(265,85%,65%,0.3)",
                } as React.CSSProperties}
              />
              <span className={`mt-1.5 text-[6px] sm:text-[8px] font-heading font-bold tracking-[2px] uppercase ${node.primary ? "text-primary" : "text-foreground/30"}`}>
                {node.label}
              </span>
            </motion.div>
          ))}

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
              { x1: "50%", y1: "50%", x2: "65%", y2: "85%" },
            ].map((line, i) => (
              <line key={i} x1={line.x1} y1={line.y1} x2={line.x2} y2={line.y2}
                stroke="url(#neural-gradient)" strokeWidth="1" opacity="0.25"
                strokeDasharray="4 4">
                <animate attributeName="stroke-dashoffset" from="8" to="0" dur={`${1.5 + i * 0.2}s`} repeatCount="indefinite" />
              </line>
            ))}
            <defs>
              <linearGradient id="neural-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsla(265, 70%, 60%, 0.6)" />
                <stop offset="100%" stopColor="hsla(280, 50%, 65%, 0.4)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Floating data packets along connections */}
          {Array.from({ length: 6 }).map((_, i) => (
            <motion.div key={`packet-${i}`}
              className="absolute w-1.5 h-1.5 rounded-full bg-primary z-20"
              style={{
                left: "50%", top: "50%",
                boxShadow: "0 0 8px hsla(265,70%,60%,0.8)",
              }}
              animate={{
                x: [0, (Math.cos(i * Math.PI / 3) * 150)],
                y: [0, (Math.sin(i * Math.PI / 3) * 120)],
                opacity: [1, 0],
                scale: [1, 0.5],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.4,
                ease: "easeOut",
              }}
            />
          ))}

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
            { label: "Evoluzione", value: "Settimanale", icon: <Radio className="w-3.5 h-3.5" /> },
          ].map((spec, i) => (
            <motion.div key={i} variants={popIn}>
              <PremiumCard scan delay={i} className="p-4 text-center">
                <motion.div className="text-primary mb-2 flex justify-center"
                  animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5, ease: "easeInOut" }}
                >{spec.icon}</motion.div>
                <p className="text-xs font-heading font-bold text-foreground">{spec.value}</p>
                <p className="text-[0.55rem] text-foreground/30 mt-0.5 tracking-wider uppercase">{spec.label}</p>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          3 INTERFACCE — Mockup Showcase
         ═══════════════════════════════════════════ */}
      <Section>
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
            { img: mockupCucina, title: "Agenda Smart", desc: "Calendario appuntamenti, gestione slot e notifiche automatiche per clienti.", tag: "OPERATIONS", sector: "Healthcare & Fitness", features: ["Agenda drag & drop", "Reminder automatici", "Schede paziente", "Report periodici"] },
          ];

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
            <div className="relative overflow-hidden -mx-5 sm:-mx-6 px-5 sm:px-6">
              {/* Fade edges */}
              <div className="absolute left-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsl(var(--background)), transparent)" }} />
              <div className="absolute right-0 top-0 bottom-0 w-16 sm:w-24 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsl(var(--background)), transparent)" }} />

              {/* Controls */}
              <div className="flex items-center justify-center gap-3 mb-5">
                <button
                  onClick={() => scrollCarousel('left')}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300"
                  aria-label="Indietro"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setCarouselPaused(p => !p)}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300"
                  aria-label={carouselPaused ? "Play" : "Pausa"}
                >
                  {carouselPaused ? <Play className="w-3.5 h-3.5 ml-0.5" /> : <Pause className="w-3.5 h-3.5" />}
                </button>
                <button
                  onClick={() => scrollCarousel('right')}
                  className="w-9 h-9 rounded-full border border-white/10 bg-white/[0.04] backdrop-blur-md flex items-center justify-center text-foreground/60 hover:text-foreground hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300"
                  aria-label="Avanti"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
              
              <div
                ref={carouselRef}
                className="flex gap-5 sm:gap-6"
                style={{
                  animation: `carousel-scroll 22s linear infinite`,
                  animationPlayState: carouselPaused ? 'paused' : 'running',
                  width: "max-content",
                }}>
                {[...mockups, ...mockups].map((mock, i) => {
                  const tagColors: Record<string, string> = {
                    "FRONT-END": "hsl(var(--primary))",
                    "BACK-OFFICE": "hsl(var(--accent))",
                    "OPERATIONS": "hsl(160, 60%, 45%)",
                  };
                  const tagColor = tagColors[mock.tag] || "hsl(var(--primary))";
                  return (
                  <div key={i} className="group flex flex-col items-center flex-shrink-0 w-[195px]">
                    {/* iPhone frame */}
                    <div className="relative mb-4">
                      {/* Ambient glow */}
                      <div className="absolute -inset-3 rounded-[46px] opacity-10 blur-xl pointer-events-none group-hover:opacity-20 transition-opacity duration-700" style={{ background: tagColor }} />
                      
                      {/* Phone body */}
                      <div className="relative w-[185px] h-[380px] rounded-[34px] border-[2.5px] border-foreground/12 shadow-[0_12px_40px_hsla(0,0%,0%,0.5)] overflow-hidden transition-all duration-500 group-hover:shadow-[0_16px_50px_hsla(265,70%,60%,0.12)]" style={{ background: "hsl(var(--card))" }}>
                        {/* Dynamic Island */}
                        <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[60px] h-[18px] bg-foreground/80 rounded-full z-20" />
                        
                        {/* Screen */}
                        <div className="absolute inset-[2px] rounded-[31px] overflow-hidden" style={{ background: "hsl(var(--background))" }}>
                          <img src={mock.img} alt={mock.title} className="w-full h-full object-cover object-top group-hover:scale-[1.04] transition-transform duration-700" loading="lazy" />
                          
                          {/* Content overlay — clean gradient */}
                          <div className="absolute inset-0 pointer-events-none" style={{ background: "linear-gradient(180deg, hsla(0,0%,0%,0.15) 0%, transparent 25%, transparent 40%, hsla(0,0%,0%,0.85) 70%, hsla(0,0%,0%,0.95) 100%)" }} />
                          
                          {/* Tag + Sector — top bar */}
                          <div className="absolute top-[30px] left-3 right-3 z-20 flex items-center gap-1.5">
                            <span className="px-2 py-[2px] rounded-md text-[0.42rem] font-bold tracking-[1.5px] uppercase" style={{ background: `${tagColor}22`, color: tagColor, border: `1px solid ${tagColor}30` }}>
                              {mock.tag}
                            </span>
                            <span className="text-[0.4rem] text-white/50 tracking-wider">{mock.sector}</span>
                          </div>

                          {/* Bottom content card */}
                          <div className="absolute bottom-5 left-2.5 right-2.5 z-10">
                            <h3 className="font-heading text-[0.8rem] font-bold text-white mb-1 drop-shadow-lg">{mock.title}</h3>
                            <p className="text-[0.5rem] text-white/60 leading-[1.6] mb-2.5 line-clamp-2">{mock.desc}</p>
                            {/* Feature pills inside phone */}
                            <div className="flex flex-wrap gap-[3px]">
                              {mock.features.slice(0, 4).map((f, j) => (
                                <span key={j} className="px-1.5 py-[2px] rounded-md text-[0.4rem] font-medium text-white/70 backdrop-blur-sm" style={{ background: "hsla(0,0%,100%,0.08)", border: "1px solid hsla(0,0%,100%,0.1)" }}>
                                  {f}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Home indicator */}
                        <div className="absolute bottom-[5px] left-1/2 -translate-x-1/2 w-[70px] h-[3px] bg-foreground/15 rounded-full z-20" />
                      </div>
                    </div>
                  </div>
                  );
                })}
              </div>
            </div>
          );
        })()}
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          BUILD ANYTHING — Streamlined Conversion Section
         ═══════════════════════════════════════════ */}
      <Section style={{ background: "linear-gradient(180deg, hsla(260,14%,13%,1) 0%, hsla(265,16%,11%,1) 50%, hsla(260,14%,13%,1) 100%)" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse, hsla(265,70%,60%,0.05), transparent 70%)" }} />

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
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <motion.path
                  d="M 0 300 C 200 390, 400 210, 600 300 C 800 390, 1000 210, 1200 300"
                  fill="none"
                  stroke="url(#lp-dna-b)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                />
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
                  transition={{ duration: 1.5, delay: 0.3, ease: "easeOut" }}
                />
                <motion.path
                  d="M 0 400 C 300 480, 600 320, 900 400 C 1000 450, 1100 350, 1200 400"
                  fill="none"
                  stroke="url(#lp-dna-b)"
                  strokeWidth="1"
                  strokeOpacity="0.3"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 0.3 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.5, delay: 0.4, ease: "easeOut" }}
                />
                {/* Cross-links between helixes */}
                {[100, 250, 400, 550, 700, 850, 1000, 1150].map((x, ci) => (
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
                    transition={{ delay: 0.6 + ci * 0.08, duration: 0.4 }}
                  />
                ))}
              </svg>
            </div>
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ background: "linear-gradient(to bottom, transparent, hsl(var(--primary)/0.35), transparent)" }} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
            {[
              { icon: <Palette className="w-4 h-4" />, title: "100% White Label", desc: "Colori, font, logo, layout — ogni pixel è il tuo brand.", accent: "Il TUO brand" },
              { icon: <Workflow className="w-4 h-4" />, title: "Automazione Totale", desc: "Booking, fatture, reminder, marketing — tutto in autopilot.", accent: "Zero lavoro manuale" },
              { icon: <Rocket className="w-4 h-4" />, title: "Sviluppo Custom", desc: "Moduli dedicati, integrazioni, logiche proprietarie su richiesta.", accent: "Nessun limite" },
            ].map((card, i) => {
              const fromLeft = i !== 1;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: fromLeft ? -45 : 45, y: 16, rotateY: fromLeft ? -14 : 14, scale: 0.86 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-40px" }}
                  transition={{ delay: i * 0.12, duration: 0.6, type: "spring", stiffness: 145, damping: 16 }}
                  className="relative"
                  style={{ perspective: "900px" }}
                >
                  <motion.div
                    className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border border-primary/35 bg-primary/20 shadow-[0_0_10px_hsl(var(--primary)/0.35)] z-20 sm:block"
                    style={i === 0 ? { right: "-5px" } : i === 2 ? { left: "-5px" } : { left: "50%", transform: "translate(-50%, -50%)" }}
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.45, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.35, duration: 0.35 }}
                  />

                  <PremiumCard glow scan delay={i} className="p-4 sm:p-4">
                    <PremiumIcon gradient="from-primary/20 to-accent/15" size="md" delay={i * 0.6}>
                      <span className="text-primary">{card.icon}</span>
                    </PremiumIcon>
                    <div className="mt-2.5" />
                    <h3 className="font-heading text-xs font-bold text-foreground mb-1.5">{card.title}</h3>
                    <p className="text-[0.62rem] text-foreground/35 leading-[1.55] mb-2">{card.desc}</p>
                    <motion.span className="text-[0.55rem] font-heading font-semibold text-primary/60 tracking-wider inline-flex items-center gap-1.5"
                      animate={{ opacity: [0.5, 1, 0.5] }}
                      transition={{ duration: 2.8, repeat: Infinity, delay: i * 0.6 }}>
                      <span className="w-1.5 h-1.5 rounded-full bg-primary/50" />
                      {card.accent}
                    </motion.span>
                  </PremiumCard>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ═══ Scrolling Capabilities Ticker ═══ */}
        <div className="relative mb-14 -mx-5 sm:-mx-6 overflow-hidden">
          <div className="absolute left-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(90deg, hsla(260,18%,8%,1), transparent)" }} />
          <div className="absolute right-0 top-0 bottom-0 w-20 z-10 pointer-events-none" style={{ background: "linear-gradient(270deg, hsla(260,18%,8%,1), transparent)" }} />
          {[0, 1].map(row => (
            <div key={row} className="flex whitespace-nowrap mb-2" style={{ animation: `carousel-scroll ${row === 0 ? "40s" : "45s"} linear infinite ${row === 1 ? "reverse" : ""}` }}>
              {[...Array(2)].map((_, rep) => (
                <div key={rep} className="flex gap-2 px-1">
                  {(row === 0
                    ? ["App White-Label", "Dashboard IA", "Menu QR", "Booking Online", "CRM Avanzato", "Push Notification", "Fatturazione", "Analytics", "Chat Clienti", "GPS Tracking", "Mappa Tavoli", "Gestione Staff"]
                    : ["Pagamenti", "Email Marketing", "WhatsApp Auto", "Inventario", "HACCP", "Review Shield™", "Agenda Smart", "Pricing Dinamico", "Landing SEO", "Cross-selling IA", "Programma Fedeltà", "Schede Paziente"]
                  ).map((cap, ci) => (
                    <span key={ci} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[0.6rem] font-heading tracking-wider"
                      style={{ background: "hsla(265,70%,60%,0.06)", border: "1px solid hsla(265,70%,60%,0.08)", color: "hsla(265,70%,65%,0.5)" }}>
                      <CircleCheck className="w-2.5 h-2.5" />
                      {cap}
                    </span>
                  ))}
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* ═══ Bottom Promise ═══ */}
        <motion.div className="max-w-2xl mx-auto text-center p-8 sm:p-10 rounded-2xl border border-primary/10 overflow-hidden relative"
          style={{ background: "hsla(265,20%,10%,0.4)" }}
          initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <div className="absolute inset-0 premium-holo-grid opacity-[0.04] pointer-events-none" />
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[200px] h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.3), transparent)" }} />
          <div className="relative z-10">
            <div className="flex items-center justify-center gap-4 mb-6">
              {[
                { val: "25+", label: "Settori" },
                { val: "100+", label: "Moduli" },
                { val: "∞", label: "Possibilità" },
              ].map((s, i) => (
                <motion.div key={i} className="text-center"
                  initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 + i * 0.1 }}>
                  <p className="text-xl sm:text-2xl font-heading font-bold text-shimmer">{s.val}</p>
                  <p className="text-[0.5rem] text-foreground/30 tracking-[2px] uppercase">{s.label}</p>
                </motion.div>
              ))}
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
              whileTap={{ scale: 0.97 }}
            >
              Inizia Ora <ArrowRight className="w-4 h-4" />
            </motion.button>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          SERVIZI
         ═══════════════════════════════════════════ */}
      <Section id="services">
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

        {/* ═══ Mobile: Auto-scrolling carousel ═══ */}
        <div className="sm:hidden">
          <PremiumCarousel speed="slow" itemWidth={220} showControls={false}>
            {services.map((s, i) => (
              <div key={i} className="w-[220px]">
                <PremiumCard glow scan delay={i} className="p-4 h-full">
                  <div className="flex items-center gap-2 mb-3">
                    <PremiumIcon gradient={s.color} size="sm" delay={i * 0.2}>
                      {s.icon}
                    </PremiumIcon>
                    <span className="text-[0.4rem] px-1.5 py-0.5 rounded-full border border-primary/15 bg-primary/[0.06] text-primary/70 font-bold tracking-[1.5px] font-heading">{s.tag}</span>
                  </div>
                  <h3 className="font-heading text-[0.75rem] font-semibold text-foreground mb-1.5 leading-tight">{s.title}</h3>
                  <p className="text-[0.6rem] text-foreground/35 leading-[1.6]">{s.desc}</p>
                </PremiumCard>
              </div>
            ))}
          </PremiumCarousel>
        </div>

        {/* ═══ Desktop: Grid ═══ */}
        <motion.div className="hidden sm:grid grid-cols-2 lg:grid-cols-3 gap-4"
          variants={staggerContainer} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {services.map((s, i) => (
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
          ))}
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════════════════════════════════════════
         ═══════════════════════════════════════════ */}
      <Section id="process">
        <div className="text-center mb-12">
          <SectionLabel text="Processo" icon={<Zap className="w-3 h-3 text-primary" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08]"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Attivo in <span className="text-shimmer">4 Step</span>
          </motion.h2>
        </div>

        <div className="relative mb-1">
          {/* DNA futuristico informatico — più visibile */}
          <div className="absolute inset-0 pointer-events-none -z-[1] overflow-hidden">
            <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-[240px] opacity-100">
              <svg className="w-full h-full" viewBox="0 0 1200 240" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="process-dna-a" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                  </linearGradient>
                  <linearGradient id="process-dna-b" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                    <stop offset="50%" stopColor="hsl(var(--accent))" stopOpacity="0.38" />
                    <stop offset="100%" stopColor="hsl(var(--accent))" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M 0 78 C 150 18, 300 140, 450 78 C 600 18, 750 140, 900 78 C 1050 18, 1125 96, 1200 78"
                  fill="none"
                  stroke="url(#process-dna-a)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, ease: "easeOut" }}
                />
                <motion.path
                  d="M 0 164 C 150 224, 300 102, 450 164 C 600 224, 750 102, 900 164 C 1050 224, 1125 146, 1200 164"
                  fill="none"
                  stroke="url(#process-dna-b)"
                  strokeWidth="2"
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.1, ease: "easeOut" }}
                />
              </svg>
            </div>
            <div className="hidden lg:block absolute top-[44px] left-[calc(12.5%+28px)] right-[calc(12.5%+28px)] h-px bg-gradient-to-r from-primary/25 via-primary/15 to-primary/25" />
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3.5">
            {[
              { step: "01", title: "Scegli il Settore", desc: "Empire configura moduli e flussi dedicati automaticamente.", icon: <Globe className="w-4 h-4" /> },
              { step: "02", title: "Personalizza Brand", desc: "Logo, colori, dominio. L'IA genera il catalogo in 60 secondi.", icon: <Palette className="w-4 h-4" /> },
              { step: "03", title: "Lancia il Sistema", desc: "App attiva, team formato, QR code installati. Operativo in 24h.", icon: <Rocket className="w-4 h-4" /> },
              { step: "04", title: "Cresci con i Dati", desc: "Analytics real-time, suggerimenti IA, campagne automatizzate.", icon: <TrendingUp className="w-4 h-4" /> },
            ].map((s, i) => {
              const dnaWave = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  className="relative text-center z-10"
                  initial={{ opacity: 0, x: dnaWave ? -18 : 18, y: dnaWave ? -22 : 22, rotateY: dnaWave ? -12 : 12, scale: 0.86 }}
                  whileInView={{ opacity: 1, x: 0, y: 0, rotateY: 0, scale: 1 }}
                  viewport={{ once: true, margin: "-30px" }}
                  transition={{ delay: i * 0.12, duration: 0.58, type: "spring", stiffness: 160, damping: 18 }}
                  style={{ perspective: "900px" }}
                >
                  <motion.div
                    className="absolute top-[42px] left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border border-primary/35 bg-primary/20 shadow-[0_0_10px_hsl(var(--primary)/0.35)] hidden lg:block"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.45, 1] }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.12 + 0.3, duration: 0.35 }}
                  />

                  <div className="relative rounded-xl border border-foreground/[0.07] bg-card/90 backdrop-blur-sm p-2.5 sm:p-3 overflow-hidden">
                    <motion.div
                      className="relative w-[58px] h-[58px] sm:w-[62px] sm:h-[62px] rounded-xl mx-auto mb-2.5 overflow-hidden"
                      style={{ background: "hsla(265,20%,8%,0.6)", border: "1px solid hsla(265,70%,60%,0.14)", backdropFilter: "blur(8px)" }}
                      whileHover={{ rotate: 4, scale: 1.06, borderColor: "hsla(265,70%,60%,0.28)" }}
                    >
                      <motion.div className="absolute inset-0 pointer-events-none"
                        style={{ background: "linear-gradient(180deg, transparent 40%, hsla(265,80%,70%,0.08) 50%, transparent 60%)" }}
                        animate={{ y: ["-100%", "200%"] }}
                        transition={{ duration: 2.8, repeat: Infinity, repeatDelay: 1.6 + i * 0.3, ease: "easeInOut" }} />
                      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,70%,60%,0.28), transparent)" }} />
                      <div className="flex items-center justify-center w-full h-full text-primary relative z-10">{s.icon}</div>
                      <motion.span className="absolute -top-1.5 -right-1.5 w-6 h-6 rounded-full bg-vibrant-gradient flex items-center justify-center text-[0.5rem] font-bold text-primary-foreground font-heading z-20"
                        animate={{ boxShadow: ["0 0 8px hsla(265,70%,60%,0.2)", "0 0 20px hsla(265,70%,60%,0.45)", "0 0 8px hsla(265,70%,60%,0.2)"] }}
                        transition={{ duration: 2.2, repeat: Infinity, delay: i * 0.25 }}>
                        {s.step}
                      </motion.span>
                    </motion.div>

                    <h3 className="font-heading text-[0.68rem] sm:text-xs font-bold text-foreground mb-1">{s.title}</h3>
                    <p className="text-[0.58rem] sm:text-[0.62rem] text-foreground/40 leading-[1.45]">{s.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          EMPIRE AI LIVE — Real-time Automation Feed
         ═══════════════════════════════════════════ */}
      <section className="relative py-16 sm:py-24 px-5 sm:px-6 overflow-hidden"
        style={{
          background: `linear-gradient(180deg, hsla(230,18%,6%,1) 0%, hsla(235,22%,8%,1) 40%, hsla(240,20%,7%,1) 70%, hsla(230,18%,6%,1) 100%)`,
        }}>
        {/* Circuit grid bg */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="live-grid" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(215 50% 60%)" strokeWidth="0.3" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#live-grid)" />
          </svg>
        </div>
        {/* Ambient glows */}
        <div className="absolute top-1/3 left-1/4 w-[400px] h-[400px] rounded-full blur-[200px] opacity-[0.06]" style={{ background: "hsl(var(--primary))" }} />
        <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full blur-[180px] opacity-[0.04]" style={{ background: "hsl(150 60% 45%)" }} />

        <div className="max-w-[1100px] mx-auto relative z-10">
          {/* Header */}
          <div className="text-center mb-8 sm:mb-14">
            <SectionLabel text="Empire AI Live" icon={<Activity className="w-3 h-3 text-accent" />} />
            <motion.h2 className="text-[clamp(1.5rem,4.5vw,2.8rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}>
              I Tuoi Agenti Lavorano <span className="text-shimmer">Mentre Tu Dormi</span>
            </motion.h2>
            <motion.p className="text-foreground/40 text-xs sm:text-sm max-w-lg mx-auto leading-relaxed"
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={vpOnce} transition={{ delay: 0.15 }}>
              Ogni secondo, la rete neurale esegue azioni autonome — ordini, notifiche, analisi, risposte.
              Ecco cosa sta succedendo <strong className="text-foreground/70">adesso</strong>.
            </motion.p>
          </div>

          {/* Live feed + stats */}
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 sm:gap-6">
            {/* Live feed column */}
            <motion.div className="lg:col-span-3 relative rounded-2xl overflow-hidden"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce}
              style={{
                background: "linear-gradient(145deg, hsla(230,20%,10%,0.95), hsla(235,25%,8%,0.98))",
                border: "1px solid hsla(215,40%,35%,0.12)",
              }}>
              {/* Top bar */}
              <div className="flex items-center gap-2 px-4 py-2.5 border-b" style={{ borderColor: "hsla(215,40%,35%,0.1)" }}>
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[0.55rem] font-bold text-emerald-400 tracking-[2px] uppercase">Live — Automazioni in Corso</span>
                <div className="flex-1" />
                <span className="text-[0.5rem] text-foreground/30 font-mono">stream:active</span>
              </div>

              {/* Feed items */}
              <div className="p-3 sm:p-4 space-y-2">
                <LiveFeedSimulator />
              </div>
            </motion.div>

            {/* Stats column */}
            <motion.div className="lg:col-span-2 space-y-3"
              initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: 0.2 }}>
              {[
                { label: "Azioni Oggi", value: 12847, suffix: "", icon: <Zap className="w-4 h-4" />, color: "hsla(265,70%,60%,1)", delta: "+23%" },
                { label: "Clienti Serviti", value: 3429, suffix: "", icon: <Users className="w-4 h-4" />, color: "hsla(150,70%,50%,1)", delta: "+18%" },
                { label: "Revenue Generato", value: 47, suffix: "K", icon: <TrendingUp className="w-4 h-4" />, color: "hsla(38,80%,55%,1)", delta: "+31%" },
                { label: "Tempo Risparmiato", value: 156, suffix: "h", icon: <Timer className="w-4 h-4" />, color: "hsla(200,70%,55%,1)", delta: "questa settimana" },
              ].map((stat, i) => (
                <motion.div key={i} className="relative rounded-xl overflow-hidden group"
                  initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={vpOnce} transition={{ delay: 0.1 * i + 0.3 }}
                  style={{
                    background: "linear-gradient(135deg, hsla(230,20%,10%,0.95), hsla(235,22%,8%,0.98))",
                    border: "1px solid hsla(215,40%,35%,0.1)",
                  }}>
                  {/* Shimmer */}
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: `linear-gradient(105deg, transparent 40%, ${stat.color}08 50%, transparent 60%)`, backgroundSize: "200% 100%" }}
                    animate={{ backgroundPosition: ["-100% 0%", "200% 0%"] }}
                    transition={{ duration: 5, repeat: Infinity, ease: "linear", delay: i * 1.2 }}
                  />
                  <div className="relative z-10 flex items-center gap-3 px-4 py-3.5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: `${stat.color}15`, color: stat.color }}>
                      {stat.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[0.55rem] text-foreground/40 tracking-wider uppercase font-semibold">{stat.label}</p>
                      <div className="flex items-baseline gap-1.5">
                        <span className="text-lg sm:text-xl font-bold text-foreground font-heading">
                          <AnimatedNumber value={stat.value} suffix={stat.suffix} prefix={stat.label === "Revenue Generato" ? "€" : ""} />
                        </span>
                        <span className="text-[0.5rem] font-semibold" style={{ color: stat.color }}>{stat.delta}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>

          {/* Bottom trust bar */}
          <motion.div className="mt-6 sm:mt-10 flex flex-wrap justify-center gap-3 sm:gap-5"
            initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={vpOnce} transition={{ delay: 0.5 }}>
            {[
              { text: "Zero downtime", icon: <Shield className="w-3 h-3" /> },
              { text: "GDPR compliant", icon: <Lock className="w-3 h-3" /> },
              { text: "Enterprise-grade", icon: <ServerCog className="w-3 h-3" /> },
              { text: "99.9% uptime SLA", icon: <Gauge className="w-3 h-3" /> },
            ].map((t, i) => (
              <div key={i} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                style={{ background: "hsla(215,20%,15%,0.6)", border: "1px solid hsla(215,30%,30%,0.12)" }}>
                <span className="text-primary/70">{t.icon}</span>
                <span className="text-[0.5rem] text-foreground/50 font-semibold tracking-wider uppercase">{t.text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ROI CALCULATOR
         ═══════════════════════════════════════════ */}
      <Section id="calculator">
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
            { label: "Costo orario medio", value: hourlyCost, min: 10, max: 50, step: 5, display: `€${hourlyCost}/h`, onChange: setHourlyCost },
          ].map((sl, i) => (
            <div key={i}>
              <div className="flex justify-between text-sm mb-3">
                <span className="text-foreground/40 font-heading text-xs tracking-wider uppercase">{sl.label}</span>
                <span className="text-foreground font-bold font-heading text-sm">{sl.display}</span>
              </div>
              <input type="range" min={sl.min} max={sl.max} step={sl.step} value={sl.value}
                onChange={e => sl.onChange(Number(e.target.value))} className="w-full" />
            </div>
          ))}

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
      <Section id="testimonials" style={{ background: "linear-gradient(180deg, hsla(260,18%,8%,1) 0%, hsla(265,20%,6%,1) 50%, hsla(260,18%,8%,1) 100%)" }}>
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] pointer-events-none" style={{ background: "radial-gradient(ellipse, hsla(265,70%,60%,0.04), transparent 70%)" }} />
        {/* Ambient glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full opacity-[0.04]"
            style={{ background: "radial-gradient(circle, hsl(265,70%,60%), transparent 70%)" }} />
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

        <PremiumCarousel speed="slow" itemWidth={290} fullWidth>
          {testimonials.map((t, i) => (
            <div key={i} className="group relative h-full">
              <div className="relative p-5 sm:p-7 rounded-2xl h-full flex flex-col items-center text-center overflow-hidden transition-all duration-700 group-hover:scale-[1.02]"
                style={{
                  background: "linear-gradient(165deg, hsla(265,25%,16%,0.7), hsla(265,20%,10%,0.6))",
                  border: "1px solid hsla(265,40%,50%,0.12)",
                  boxShadow: "0 16px 48px -12px hsla(265,50%,8%,0.5), inset 0 1px 0 hsla(265,60%,70%,0.06)",
                  backdropFilter: "blur(24px)",
                }}>
                
                {/* Shimmer sweep */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 40%, hsla(38,50%,55%,0.06) 50%, transparent 60%)", backgroundSize: "200% 100%", animation: "shimmer 2s ease-in-out infinite" }} />
                
                {/* HUD corner accents */}
                <div className="absolute top-0 left-0 w-5 h-5 border-t border-l rounded-tl-2xl pointer-events-none" style={{ borderColor: "hsla(38,50%,55%,0.2)" }} />
                <div className="absolute bottom-0 right-0 w-5 h-5 border-b border-r rounded-br-2xl pointer-events-none" style={{ borderColor: "hsla(265,70%,60%,0.15)" }} />
                
                {/* Top gradient line */}
                <div className="absolute top-0 left-6 right-6 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.25), hsla(265,70%,60%,0.2), transparent)" }} />

                {/* Avatar + emoji badge centered */}
                <div className="relative mb-4 mt-1">
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-base font-bold font-heading mx-auto"
                    style={{
                      background: "linear-gradient(135deg, hsla(265,40%,25%,0.6), hsla(265,30%,18%,0.4))",
                      border: "2px solid hsla(265,50%,55%,0.25)",
                      color: "hsl(var(--primary))",
                      boxShadow: "0 0 20px -4px hsla(265,70%,60%,0.25)",
                    }}>
                    {t.name.charAt(0)}
                  </div>
                  {/* Emoji badge positioned on avatar */}
                  <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-lg flex items-center justify-center text-xs"
                    style={{ background: "hsla(265,30%,15%,0.9)", border: "1px solid hsla(265,40%,50%,0.2)", boxShadow: "0 4px 12px hsla(0,0%,0%,0.3)" }}>
                    {t.emoji}
                  </div>
                  {/* Orbital ring */}
                  <motion.div className="absolute -inset-2 rounded-full pointer-events-none"
                    style={{ border: "1px dashed hsla(265,50%,55%,0.12)" }}
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }} />
                </div>

                {/* Author name & role */}
                <h4 className="font-heading text-xs font-semibold mb-0.5" style={{ color: "hsla(0,0%,100%,0.85)" }}>{t.name}</h4>
                <p className="text-[0.58rem] mb-4" style={{ color: "hsla(38,50%,55%,0.5)" }}>{t.role}</p>

                {/* Quote */}
                <blockquote className="text-[0.75rem] sm:text-[0.8rem] leading-[1.8] mb-5 flex-1 px-1"
                  style={{ color: "hsla(0,0%,100%,0.5)" }}>
                  <Quote className="w-3.5 h-3.5 mx-auto mb-2" style={{ color: "hsla(38,50%,55%,0.3)" }} />
                  "{t.quote}"
                </blockquote>

                {/* Metric badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-[0.62rem] font-semibold font-heading tracking-wider transition-all duration-500 group-hover:shadow-[0_0_20px_-4px_hsla(265,70%,60%,0.3)]"
                  style={{
                    background: "linear-gradient(135deg, hsla(265,40%,25%,0.5), hsla(265,30%,18%,0.4))",
                    border: "1px solid hsla(265,60%,55%,0.2)",
                    color: "hsl(var(--primary))",
                  }}>
                  <TrendingUp className="w-3 h-3" /> {t.metric}
                </div>

                {/* Bottom glow */}
                <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-32 h-16 rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700"
                  style={{ background: "radial-gradient(circle, hsla(265,70%,60%,0.08), transparent 70%)" }} />
              </div>
            </div>
          ))}
        </PremiumCarousel>
      </Section>

      {/* ═══════════════════════════════════════════
          PRICING — Interactive Configurator
         ═══════════════════════════════════════════ */}
      <PricingConfigurator navigate={navigate} />

      <SectionDivider />

      {/* ═══════════════════════════════════════════
          PARTNER PROGRAM
         ═══════════════════════════════════════════ */}
      <Section id="partner">
        <div className="text-center mb-12">
          <SectionLabel text="Partner Program" icon={<Handshake className="w-3 h-3 text-accent" />} />
          <motion.h2 className="text-[clamp(1.8rem,4.5vw,3.2rem)] font-heading font-bold text-foreground leading-[1.08] mb-4"
            initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Guadagna Vendendo <span className="text-shimmer">Empire</span>
          </motion.h2>
        </div>

        <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10"
          variants={staggerFast} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}>
          {[
            { value: "€997", label: "Per vendita", icon: <Trophy className="w-5 h-5" /> },
            { value: "€50", label: "Override TL", icon: <Award className="w-5 h-5" /> },
            { value: "€500", label: "Bonus 3 vendite", icon: <Gift className="w-5 h-5" /> },
            { value: "€1.500", label: "Bonus Elite", icon: <Rocket className="w-5 h-5" /> },
          ].map((s, i) => (
            <motion.div key={i} variants={popIn}>
              <PremiumCard glow scan delay={i} className="p-5 sm:p-6 text-center">
                <div className="flex justify-center mb-3">
                  <PremiumIcon gradient="from-primary/20 to-accent/15" size="md" delay={i * 0.4}>
                    <span className="text-primary">{s.icon}</span>
                  </PremiumIcon>
                </div>
                <motion.p className="text-xl sm:text-2xl font-heading font-bold text-vibrant-gradient"
                  animate={{ textShadow: ["0 0 10px hsla(265,70%,60%,0)", "0 0 20px hsla(265,70%,60%,0.3)", "0 0 10px hsla(265,70%,60%,0)"] }}
                  transition={{ duration: 3, repeat: Infinity, delay: i * 0.5 }}>{s.value}</motion.p>
                <p className="text-[0.55rem] sm:text-[0.6rem] text-foreground/40 mt-1 tracking-wider uppercase font-heading">{s.label}</p>
              </PremiumCard>
            </motion.div>
          ))}
        </motion.div>

        {/* Career path */}
        <motion.div className="p-6 rounded-2xl glow-card mb-10"
          variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
          <h3 className="font-heading font-bold text-[0.6rem] text-foreground/50 text-center mb-6 tracking-[3px] uppercase">Percorso di Carriera</h3>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-5 sm:gap-0">
            {[
              { title: "Partner", desc: "€997 per ogni vendita chiusa", icon: <Handshake className="w-5 h-5" /> },
              { title: "3 Vendite", desc: "Promozione automatica", icon: <TrendingUp className="w-5 h-5" /> },
              { title: "Team Leader", desc: "+€50 override per vendita team", icon: <Crown className="w-5 h-5" /> },
            ].map((s, i) => (
              <div key={i} className="flex sm:flex-col items-center gap-3.5 text-center w-full sm:w-auto">
                <motion.div
                  className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary flex-shrink-0"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  {s.icon}
                </motion.div>
                <div className="text-left sm:text-center">
                  <p className="text-sm font-bold text-foreground font-heading">{s.title}</p>
                  <p className="text-[0.6rem] text-foreground/35">{s.desc}</p>
                </div>
                {i < 2 && <ArrowRight className="hidden sm:block w-5 h-5 text-primary/15 mx-6 flex-shrink-0" />}
              </div>
            ))}
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
            whileTap={{ scale: 0.97 }}
          >
            Diventa Partner <ArrowRight className="w-4 h-4" />
          </motion.button>
        </div>
      </Section>

      {/* ═══════════════════════════════════════════
          FAQ
         ═══════════════════════════════════════════ */}
      <Section style={{ background: "linear-gradient(180deg, hsla(260,18%,8%,1) 0%, hsla(265,22%,7%,1) 50%, hsla(260,18%,8%,1) 100%)" }}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 20%, hsla(265,70%,60%,0.03), transparent 60%)" }} />
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
            {faqs.map((faq, i) => (
              <motion.div key={i} className="rounded-xl glow-card overflow-hidden" variants={fadeUp}>
                <button onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between p-5 text-left hover:bg-foreground/[0.02] transition-colors">
                  <span className="text-xs sm:text-sm font-semibold text-foreground pr-3 font-heading">{faq.q}</span>
                  <motion.div
                    animate={{ rotate: openFaq === i ? 45 : 0 }}
                    className="w-7 h-7 rounded-full bg-primary/[0.08] flex items-center justify-center flex-shrink-0 text-primary text-sm font-heading font-bold"
                  >
                    +
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }}>
                      <p className="px-5 pb-5 text-xs sm:text-sm text-foreground/40 leading-[1.7]">{faq.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
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
              Prova Empire per 30 giorni senza impegno. Se non vedi risultati concreti, ti offriamo un mese di assistenza premium gratuita per ottimizzare tutto insieme. Il tuo successo è la nostra priorità.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              {[
                { icon: <Check className="w-4 h-4" />, text: "30 giorni senza impegno" },
                { icon: <Check className="w-4 h-4" />, text: "Assistenza dedicata inclusa" },
                { icon: <Check className="w-4 h-4" />, text: "Cancella quando vuoi" },
              ].map((g, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-foreground/50">
                  <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary">{g.icon}</div>
                  <span className="font-heading font-semibold">{g.text}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </Section>

      <SectionDivider />

      {/* ═══════ EMPIRE STORY & TEAM ═══════ */}
      <Suspense fallback={null}>
        <EmpireTeamStory />
      </Suspense>

      <SectionDivider />

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
              transition={{ type: "spring", stiffness: 200, damping: 20 }}
            >
              <Crown className="w-12 h-12 mx-auto mb-6 text-primary" style={{ filter: "drop-shadow(0 0 40px hsla(265,70%,60%,0.3))" }} />
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
                whileTap={{ scale: 0.97 }}
              >
                Sono un Imprenditore <ArrowRight className="w-4 h-4" />
              </motion.button>
              <motion.button onClick={() => navigate("/partner/register")}
                className="w-full sm:w-auto px-9 py-4 rounded-full border border-foreground/10 text-foreground/70 font-bold text-sm font-heading tracking-wide hover:border-primary/30 hover:text-foreground transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.02 }}
              >
                Diventa Partner
              </motion.button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════ FOOTER ═══════ */}
      <footer id="contact" className="relative py-20 pb-10 px-5 sm:px-6 overflow-hidden"
        style={{ background: "linear-gradient(180deg, hsla(260,25%,6%,1) 0%, hsla(265,30%,3%,1) 60%, hsla(260,20%,2%,1) 100%)" }}>
        {/* Top accent line */}
        <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent 5%, hsla(265,70%,60%,0.3) 30%, hsla(280,45%,68%,0.4) 50%, hsla(265,70%,60%,0.3) 70%, transparent 95%)" }} />
        {/* Subtle ambient glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[120px] blur-[80px] pointer-events-none" style={{ background: "hsla(265,70%,60%,0.06)" }} />
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 premium-holo-grid opacity-[0.03] pointer-events-none" />

        <div className="relative z-10 max-w-[1100px] mx-auto">
          {/* Top row: Logo + Newsletter */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-8 mb-16">
            <motion.div className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="relative">
                <div className="absolute -inset-1 rounded-xl blur-md" style={{ background: "hsla(265,70%,60%,0.15)" }} />
                <div className="relative w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsla(265,70%,60%,1), hsla(280,60%,50%,1))", boxShadow: "0 0 25px hsla(265,70%,60%,0.25)" }}>
                  <Crown className="w-4 h-4 text-white" />
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
                {["Food & Ristorazione", "NCC & Trasporto", "Beauty & Wellness", "Healthcare & Medical", "Retail & E-commerce", "Fitness & Sport"].map((s, i) => (
                  <p key={i} className="text-white/25 hover:text-white/60 transition-colors cursor-default flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {s}
                  </p>
                ))}
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
                  { label: "Demo Live", href: "/demo" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-white/25 hover:text-white/60 transition-colors flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {link.label}
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="font-heading text-[0.55rem] font-bold text-white/50 mb-5 tracking-[4px] uppercase flex items-center gap-2">
                <span className="w-4 h-px" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                Tecnologia
              </h4>
              <div className="space-y-3 text-[0.65rem]">
                {["Engine AI Proprietario", "Automazione End-to-End", "PWA White-Label", "Analytics Predittivi", "GDPR & AES-256", "API & Integrazioni"].map((s, i) => (
                  <p key={i} className="text-white/25 hover:text-white/60 transition-colors cursor-default flex items-center gap-2">
                    <span className="w-1 h-1 rounded-full" style={{ background: "hsla(265,70%,60%,0.4)" }} />
                    {s}
                  </p>
                ))}
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
                {["In", "𝕏", "IG"].map((s, i) => (
                  <motion.div key={i}
                    className="w-9 h-9 rounded-lg flex items-center justify-center text-[0.6rem] text-white/20 cursor-pointer transition-all duration-300"
                    style={{ border: "1px solid hsla(265,70%,60%,0.1)", background: "hsla(265,70%,60%,0.03)" }}
                    whileHover={{ scale: 1.1, borderColor: "hsla(265,70%,60%,0.4)", color: "hsla(265,70%,65%,1)", background: "hsla(265,70%,60%,0.08)" }}
                  >
                    {s}
                  </motion.div>
                ))}
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
        {ctaVisible && (
          <motion.div className="fixed bottom-0 inset-x-0 z-40 p-3 pb-[max(env(safe-area-inset-bottom),0.75rem)] bg-background/80 backdrop-blur-2xl border-t border-border/20"
            initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} transition={{ type: "spring", damping: 25 }}>
            <div className="flex gap-2 max-w-md mx-auto">
              <motion.button onClick={() => scrollTo("pricing")}
                className="flex-1 py-3.5 rounded-xl bg-vibrant-gradient text-primary-foreground font-bold text-sm tracking-wider font-heading uppercase"
                whileTap={{ scale: 0.97 }}
              >
                Inizia Ora
              </motion.button>
              <motion.button onClick={() => navigate("/demo")}
                className="px-4 py-3.5 rounded-xl border border-primary/15 text-primary"
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {/* ATLAS Voice Agent */}
      <SafeEmpireVoiceAgent />
    </div>
  );
};

export default LandingPage;
