import React, { useState, useEffect, useRef, useMemo, useCallback, lazy, Suspense } from "react";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Sparkles, Lock, Menu, X, ArrowRight, Play,
  ChevronLeft, ChevronDown, Palette, Globe, Zap, MapPin,
  Smartphone, Brain, Bot, Shield, Mail, Star,
  Layers, ShoppingBag, GraduationCap, Plane, Monitor, BookOpen, ShoppingCart
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import empireLogoNew from "@/assets/empire-logo-new.png";
import { useSiteAssets } from "@/hooks/useSiteAssets";
const EmpireVoiceAgent = lazy(() => import("@/components/public/EmpireVoiceAgent"));

/* ═══ Colors ═══ */
const TEAL = "#7eb7be";
const PURPLE = "#5a28bd";
const GOLD = "#d4a855";
const BG = "rgb(6,7,10)";
const GLASS_BORDER = "rgba(255,255,255,0.06)";

/* ═══ Scroll Reveal Hook ═══ */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } },
      { threshold, rootMargin: "0px 0px -40px 0px" }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ═══ Phone Mockup Component ═══ */
const PhoneMockup = ({ src, alt, glowColor, style, className = "" }: {
  src: string; alt: string; glowColor?: string; style?: React.CSSProperties; className?: string;
}) => (
  <div className={`relative aspect-[9/19.5] rounded-[28px] overflow-hidden ${className}`}
    style={{
      border: `2px solid rgba(255,255,255,0.1)`,
      background: "#0a0a12",
      boxShadow: glowColor
        ? `0 0 40px ${glowColor}30, 0 20px 60px rgba(0,0,0,0.5)`
        : "0 20px 60px rgba(0,0,0,0.5)",
      ...style
    }}>
    <div className="absolute top-[6px] left-1/2 -translate-x-1/2 w-[34%] max-w-[44px] h-[12px] bg-black rounded-full z-30" />
    <div className="absolute inset-[3px] rounded-[25px] overflow-hidden">
      <img src={src} alt={alt} className="w-full h-full object-cover object-top" loading="lazy" />
    </div>
    <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[28%] h-[3px] bg-white/15 rounded-full z-20" />
    <div className="absolute inset-0 rounded-[28px] pointer-events-none"
      style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 40%)" }} />
  </div>
);

/* ═══ Floating Badge ═══ */
const FloatingBadge = ({ text, icon, delay, x, y }: {
  text: string; icon: React.ReactNode; delay: number; x: string; y: string;
}) => (
  <motion.div
    className="absolute z-30 px-3 py-1.5 rounded-full flex items-center gap-1.5 text-[0.6rem] font-semibold text-white/80"
    style={{
      left: x, top: y,
      background: "rgba(255,255,255,0.06)",
      backdropFilter: "blur(20px)",
      border: `1px solid ${GLASS_BORDER}`,
      boxShadow: "0 4px 20px rgba(0,0,0,0.3)",
    }}
    initial={{ opacity: 0, scale: 0.8 }}
    animate={{ opacity: 1, scale: 1, y: [0, -6, 0] }}
    transition={{
      opacity: { delay, duration: 0.6 },
      scale: { delay, duration: 0.6 },
      y: { delay: delay + 0.6, duration: 4, repeat: Infinity, ease: "easeInOut" }
    }}
  >
    {icon}
    {text}
  </motion.div>
);

/* ═══ Sector Card ═══ */
const SectorCard = ({ icon, name, description, count, delay }: {
  icon: React.ReactNode; name: string; description: string; count: number; delay: number;
}) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref} className={`group relative p-5 rounded-2xl overflow-hidden transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: "rgba(255,255,255,0.02)",
        backdropFilter: "blur(20px)",
        border: `1px solid ${GLASS_BORDER}`,
      }}>
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `radial-gradient(circle at 50% 0%, ${TEAL}08, transparent 70%)` }} />
      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3 text-white/70"
        style={{ background: `linear-gradient(135deg, ${TEAL}20, ${PURPLE}15)`, border: `1px solid ${TEAL}20` }}>
        {icon}
      </div>
      <h3 className="text-sm font-bold text-white/90 mb-1">{name}</h3>
      <p className="text-[0.7rem] text-white/40 leading-relaxed mb-3">{description}</p>
      <span className="text-[0.6rem] text-white/25 font-medium">{count} Progetti</span>
    </div>
  );
};

/* ═══ Portfolio Item ═══ */
const PortfolioCard = ({ image, title, category, isLandscape = false, delay }: {
  image: string; title: string; category: string; isLandscape?: boolean; delay: number;
}) => {
  const { ref, visible } = useReveal();
  return (
    <div ref={ref}
      className={`group relative rounded-2xl overflow-hidden cursor-pointer transition-all duration-700 ease-[cubic-bezier(.16,1,.3,1)] ${visible ? "opacity-100 translate-y-0 scale-100" : "opacity-0 translate-y-8 scale-[0.97]"}`}
      style={{
        transitionDelay: `${delay}ms`,
        background: "rgba(255,255,255,0.02)",
        border: `1px solid ${GLASS_BORDER}`,
      }}>
      <div className={`relative ${isLandscape ? "aspect-[16/10]" : "aspect-[9/16]"} overflow-hidden`}>
        <img src={image} alt={title} className="w-full h-full object-cover object-top transition-transform duration-700 ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 40%, rgba(6,7,10,0.9) 100%)" }} />
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <span className="inline-block px-2.5 py-1 rounded-full text-[0.55rem] font-semibold text-white/70 mb-2"
            style={{ background: `${TEAL}15`, border: `1px solid ${TEAL}20` }}>
            {category}
          </span>
          <h3 className="text-sm font-bold text-white/90">{title}</h3>
        </div>
      </div>
    </div>
  );
};

/* ═══ MAIN COMPONENT ═══ */
const LandingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isFromPartner = searchParams.get("from") === "partner";
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [phoneIdx, setPhoneIdx] = useState(0);

  /* Build hero phone mockup images from sector data */
  const phoneImages = useMemo(() => {
    const imgs: string[] = [];
    for (const [, screens] of Object.entries(SECTOR_MOCKUP_IMAGES)) {
      if (screens && screens.length > 0) {
        screens.forEach(s => imgs.push(s));
      }
    }
    return imgs.length > 0 ? imgs : ["/placeholder.svg"];
  }, []);

  /* Cycle phone images every 3 seconds */
  useEffect(() => {
    const timer = setInterval(() => setPhoneIdx(p => (p + 1) % Math.max(1, Math.floor(phoneImages.length / 3))), 3000);
    return () => clearInterval(timer);
  }, [phoneImages.length]);

  /* Nav scroll effect */
  useEffect(() => {
    const h = () => {
      requestAnimationFrame(() => setNavScrolled(window.scrollY > 60));
    };
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const getPhoneImg = (offset: number) => {
    const base = phoneIdx * 3;
    return phoneImages[(base + offset) % phoneImages.length] || "/placeholder.svg";
  };

  /* Sectors */
  const sectors = [
    { icon: <ShoppingBag className="w-4 h-4" />, name: "Food & Ristorazione", description: "Ristoranti, bar, pasticcerie, catering e food delivery.", count: 8 },
    { icon: <Sparkles className="w-4 h-4" />, name: "Lifestyle & Wellness", description: "Beauty, fitness, SPA e centri benessere.", count: 5 },
    { icon: <Plane className="w-4 h-4" />, name: "Travel & Mobility", description: "NCC, transfer, noleggio e trasporti premium.", count: 4 },
    { icon: <Monitor className="w-4 h-4" />, name: "App Design", description: "App personalizzate, PWA e soluzioni mobile-first.", count: 6 },
    { icon: <GraduationCap className="w-4 h-4" />, name: "Education", description: "Corsi, scuole, coaching e piattaforme formative.", count: 3 },
    { icon: <Globe className="w-4 h-4" />, name: "Web Design", description: "Siti web, landing page e portali aziendali.", count: 7 },
    { icon: <ShoppingCart className="w-4 h-4" />, name: "E-Commerce", description: "Store online, cataloghi digitali e marketplace.", count: 4 },
  ];

  /* Portfolio projects */
  const portfolioProjects = useMemo(() => {
    const projects: { image: string; title: string; category: string; isLandscape?: boolean }[] = [];
    const entries = Object.entries(SECTOR_MOCKUP_IMAGES);
    const sectorNames: Record<string, string> = {
      food: "Food", ncc: "Travel", beauty: "Lifestyle", healthcare: "Healthcare",
      retail: "E-Commerce", fitness: "Lifestyle", hospitality: "Travel", beach: "Lifestyle",
    };
    entries.slice(0, 8).forEach(([key, imgs]) => {
      if (imgs && imgs.length > 0) {
        const name = key.charAt(0).toUpperCase() + key.slice(1);
        projects.push({
          image: imgs[0],
          title: `${name} Premium App`,
          category: sectorNames[key] || "App Design",
          isLandscape: ["beach", "hospitality", "retail"].includes(key),
        });
      }
    });
    return projects;
  }, []);

  /* Trust bar items */
  const trustItems = [
    { icon: <Palette className="w-3.5 h-3.5" />, text: "Design Premium" },
    { icon: <Bot className="w-3.5 h-3.5" />, text: "Agenti AI Integrati" },
    { icon: <Layers className="w-3.5 h-3.5" />, text: "Sviluppo Su Misura" },
    { icon: <MapPin className="w-3.5 h-3.5" />, text: "Made in Italy" },
    { icon: <Zap className="w-3.5 h-3.5" />, text: "Deploy Rapido" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden relative" style={{ background: BG }}>

      {/* ═══ AMBIENT BACKGROUND ═══ */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* Floating orbs */}
        <motion.div
          className="absolute w-[500px] h-[500px] rounded-full"
          style={{ filter: "blur(120px)", background: TEAL, opacity: 0.03, top: "10%", left: "15%" }}
          animate={{ y: [0, -30, 0], x: [0, 15, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[450px] h-[450px] rounded-full"
          style={{ filter: "blur(120px)", background: PURPLE, opacity: 0.04, top: "40%", right: "10%" }}
          animate={{ y: [0, 25, 0], x: [0, -20, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-[400px] h-[400px] rounded-full"
          style={{ filter: "blur(120px)", background: GOLD, opacity: 0.025, bottom: "15%", left: "40%" }}
          animate={{ y: [0, -20, 0], x: [0, 10, 0] }}
          transition={{ duration: 22, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Grid lines */}
        <div className="absolute inset-0" style={{
          backgroundImage: `linear-gradient(rgba(255,255,255,0.012) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.012) 1px, transparent 1px)`,
          backgroundSize: "80px 80px"
        }} />
      </div>

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 transition-all duration-500 px-4 py-3">
        <div className="max-w-6xl mx-auto relative">
          <div className="relative flex items-center justify-between px-5 py-3 rounded-2xl transition-all duration-500"
            style={{
              background: navScrolled ? "rgba(6,7,10,0.85)" : "rgba(6,7,10,0.4)",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: `1px solid ${navScrolled ? "rgba(255,255,255,0.08)" : GLASS_BORDER}`,
              boxShadow: navScrolled ? "0 8px 32px rgba(0,0,0,0.4)" : "none",
            }}>

            {/* Logo */}
            <a href="/home" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full overflow-hidden"
                style={{ boxShadow: `0 0 20px ${TEAL}30` }}>
                <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
              </div>
              <span className="font-bold text-sm tracking-[0.25em] uppercase text-white/90">EMPIRE.AI</span>
            </a>

            {/* Center links - desktop */}
            <div className="hidden lg:flex items-center gap-1">
              {[
                { label: "Portfolio", href: "#portfolio" },
                { label: "Settori", href: "#sectors" },
                { label: "Contatti", href: "#contact" },
              ].map(link => (
                <a key={link.label} href={link.href}
                  className="px-4 py-2 text-[0.72rem] font-medium text-white/50 hover:text-white/80 transition-colors tracking-wider uppercase rounded-lg hover:bg-white/[0.04]">
                  {link.label}
                </a>
              ))}
            </div>

            {/* Right CTA */}
            <div className="hidden lg:flex items-center gap-2">
              <button onClick={() => navigate("/auth?mode=login")}
                className="px-4 py-2 text-[0.7rem] font-medium text-white/50 hover:text-white/80 transition-colors tracking-wider uppercase">
                Accedi
              </button>
              <button onClick={() => navigate("/partner-register")}
                className="px-5 py-2.5 rounded-xl text-[0.68rem] font-bold text-white tracking-wider uppercase relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})`,
                  boxShadow: `0 4px 20px ${TEAL}30`,
                }}>
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                  animate={{ x: ["-200%", "300%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                <span className="relative z-10">Partner Portal</span>
              </button>
            </div>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-white/60" aria-label="Menu">
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

          {/* Mobile menu */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden mt-2 rounded-2xl"
                style={{ background: "rgba(6,7,10,0.95)", backdropFilter: "blur(20px)", border: `1px solid ${GLASS_BORDER}` }}>
                <div className="flex flex-col items-center gap-1 py-4 px-4">
                  {["Portfolio", "Settori", "Contatti"].map(label => (
                    <a key={label} href={`#${label.toLowerCase()}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="w-full text-center py-3 text-xs text-white/50 hover:text-white/80 tracking-wider uppercase rounded-lg hover:bg-white/[0.04] transition-colors">
                      {label}
                    </a>
                  ))}
                  <button onClick={() => { navigate("/auth?mode=login"); setMobileMenuOpen(false); }}
                    className="w-full py-3 mt-2 rounded-xl text-xs text-white/60 tracking-wider uppercase"
                    style={{ border: `1px solid ${GLASS_BORDER}` }}>
                    Accedi
                  </button>
                  <button onClick={() => { navigate("/partner-register"); setMobileMenuOpen(false); }}
                    className="w-full py-3 rounded-xl text-xs font-bold text-white tracking-wider uppercase"
                    style={{ background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})` }}>
                    Partner Portal
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* ═══ HERO SECTION ═══ */}
      <section className="relative min-h-screen flex items-center pt-28 pb-20 px-5">
        <div className="max-w-6xl mx-auto w-full relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">

            {/* LEFT COLUMN */}
            <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [.16, 1, .3, 1] }}>

              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${GLASS_BORDER}` }}>
                <motion.div className="w-2 h-2 rounded-full bg-emerald-400"
                  animate={{ scale: [1, 1.3, 1], opacity: [0.7, 1, 0.7] }}
                  transition={{ duration: 2, repeat: Infinity }} />
                <span className="text-[0.65rem] font-semibold text-white/60 tracking-wider uppercase">Piattaforma AI Italiana</span>
              </div>

              {/* Headline */}
              <h1 className="text-[clamp(2rem,5vw,3.5rem)] font-bold leading-[1.08] mb-5">
                <span className="text-white">Creiamo App</span>
                <br />
                <span className="hero-gradient-text">Straordinarie</span>
              </h1>

              {/* Description */}
              <p className="text-white/45 text-[0.9rem] leading-[1.8] mb-8 max-w-md">
                Progettiamo e sviluppiamo applicazioni premium, web app e sistemi gestionali con intelligenza artificiale integrata. Ogni progetto è unico, ogni dettaglio conta.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3 mb-10">
                <button onClick={() => scrollTo("portfolio")}
                  className="px-7 py-3.5 rounded-xl text-sm font-bold text-white relative overflow-hidden"
                  style={{
                    background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})`,
                    boxShadow: `0 8px 30px ${TEAL}25`,
                  }}>
                  <motion.div className="absolute inset-0 pointer-events-none"
                    style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                    animate={{ x: ["-200%", "300%"] }}
                    transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                  <span className="relative z-10 flex items-center gap-2">
                    Esplora il Portfolio <ArrowRight className="w-4 h-4" />
                  </span>
                </button>
                <button onClick={() => navigate("/demo")}
                  className="px-6 py-3.5 rounded-xl text-sm font-medium text-white/70 flex items-center gap-2"
                  style={{
                    background: "rgba(255,255,255,0.04)",
                    backdropFilter: "blur(20px)",
                    border: `1px solid ${GLASS_BORDER}`,
                  }}>
                  <Play className="w-3.5 h-3.5" /> Demo Preview
                </button>
              </div>

              {/* Stats Row */}
              <div className="flex items-center gap-0">
                {[
                  { value: "30", label: "Progetti Premium" },
                  { value: "7", label: "Settori Coperti" },
                  { value: "98+", label: "AI Agenti Integrati" },
                ].map((stat, i) => (
                  <React.Fragment key={i}>
                    {i > 0 && <div className="w-px h-10 bg-white/10 mx-5" />}
                    <div>
                      <p className="text-xl font-bold text-white/90">{stat.value}</p>
                      <p className="text-[0.6rem] text-white/30 tracking-wider uppercase">{stat.label}</p>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            </motion.div>

            {/* RIGHT COLUMN - Phone Mockups */}
            <motion.div
              className="relative flex items-center justify-center"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [.16, 1, .3, 1] }}
            >
              {/* Ambient glow behind phones */}
              <div className="absolute inset-[-20%] rounded-full pointer-events-none"
                style={{ background: `radial-gradient(ellipse 60% 50% at 50% 50%, ${TEAL}12, ${PURPLE}08, transparent 70%)` }} />

              <div className="relative flex items-end justify-center gap-0">
                {/* Back phone - left */}
                <motion.div className="relative z-[5]" style={{ marginRight: "-20px", marginBottom: "30px" }}
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}>
                  <PhoneMockup
                    src={getPhoneImg(1)}
                    alt="Project preview"
                    className="w-[110px] sm:w-[140px] lg:w-[160px]"
                    style={{ transform: "rotate(-8deg) scale(0.85)", opacity: 0.8 }}
                  />
                </motion.div>

                {/* Center phone */}
                <motion.div className="relative z-20"
                  animate={{ y: [0, -12, 0] }}
                  transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
                  <PhoneMockup
                    src={getPhoneImg(0)}
                    alt="Main project"
                    glowColor={TEAL}
                    className="w-[140px] sm:w-[180px] lg:w-[210px]"
                  />
                </motion.div>

                {/* Front phone - right */}
                <motion.div className="relative z-[10]" style={{ marginLeft: "-20px", marginBottom: "20px" }}
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1 }}>
                  <PhoneMockup
                    src={getPhoneImg(2)}
                    alt="Detail view"
                    className="w-[110px] sm:w-[140px] lg:w-[160px]"
                    style={{ transform: "rotate(8deg) scale(0.85)", opacity: 0.8 }}
                  />
                </motion.div>
              </div>

              {/* Floating badges */}
              <FloatingBadge text="AI-Powered" icon={<Brain className="w-3 h-3" />} delay={1} x="-5%" y="15%" />
              <FloatingBadge text="Multi-Platform" icon={<Smartphone className="w-3 h-3" />} delay={1.3} x="75%" y="20%" />
              <FloatingBadge text="Premium Design" icon={<Palette className="w-3 h-3" />} delay={1.6} x="10%" y="80%" />
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2 }}>
          <span className="text-[0.5rem] text-white/25 tracking-[3px] uppercase">Scopri</span>
          <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 2, repeat: Infinity }}>
            <ChevronDown className="w-4 h-4 text-white/20" />
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ TRUST BAR ═══ */}
      <section className="relative py-5 border-y overflow-hidden"
        style={{
          background: "rgba(255,255,255,0.01)",
          backdropFilter: "blur(20px)",
          borderColor: GLASS_BORDER,
        }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex items-center justify-between gap-6 overflow-x-auto scrollbar-none">
            {trustItems.map((item, i) => (
              <div key={i} className="flex items-center gap-2 flex-shrink-0">
                <div className="text-white/30">{item.icon}</div>
                <span className="text-[0.65rem] font-medium text-white/40 tracking-wider uppercase whitespace-nowrap">{item.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SECTORS SECTION ═══ */}
      <section id="sectors" className="relative py-24 px-5">
        <div className="max-w-6xl mx-auto">
          {/* Section header */}
          <div className="text-center mb-14">
            <motion.p className="text-[0.6rem] font-bold tracking-[4px] uppercase mb-3"
              style={{ color: `${TEAL}90` }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              SETTORI
            </motion.p>
            <motion.h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white/90 leading-tight mb-4"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              Soluzioni Per Ogni Settore
              <br />
              <span className="text-white/50">di Business</span>
            </motion.h2>
          </div>

          {/* Sector grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {sectors.map((sector, i) => (
              <SectorCard key={i} {...sector} delay={i * 80} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PORTFOLIO SECTION ═══ */}
      <section id="portfolio" className="relative py-24 px-5">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <motion.p className="text-[0.6rem] font-bold tracking-[4px] uppercase mb-3"
              style={{ color: `${GOLD}90` }}
              initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              PORTFOLIO
            </motion.p>
            <motion.h2 className="text-[clamp(1.5rem,4vw,2.5rem)] font-bold text-white/90 leading-tight mb-4"
              initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              I Nostri Progetti
              <br />
              <span className="text-white/50">Premium</span>
            </motion.h2>
          </div>

          {/* Portfolio grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {portfolioProjects.map((project, i) => (
              <PortfolioCard key={i} {...project} delay={i * 100} />
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA SECTION ═══ */}
      <section id="contact" className="relative py-24 px-5">
        <div className="max-w-3xl mx-auto">
          <motion.div
            className="relative p-10 sm:p-14 rounded-3xl text-center overflow-hidden"
            style={{
              background: "rgba(255,255,255,0.02)",
              backdropFilter: "blur(24px)",
              border: `1px solid ${GLASS_BORDER}`,
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            {/* Rotating gradient glow */}
            <motion.div
              className="absolute -inset-[2px] rounded-3xl pointer-events-none"
              style={{
                background: `conic-gradient(from 0deg, ${TEAL}20, ${PURPLE}15, ${GOLD}15, ${TEAL}20)`,
              }}
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            />
            <div className="absolute inset-[1px] rounded-3xl" style={{ background: "rgba(6,7,10,0.95)" }} />

            <div className="relative z-10">
              <h2 className="text-[clamp(1.3rem,3.5vw,2rem)] font-bold text-white/90 mb-4">
                Pronto a Trasformare
                <br />
                il Tuo Business?
              </h2>
              <p className="text-white/40 text-sm mb-8 max-w-md mx-auto leading-relaxed">
                Contattaci per una consulenza gratuita. Analizzeremo le tue esigenze e progetteremo la soluzione perfetta per te.
              </p>
              <button onClick={() => navigate("/auth")}
                className="px-8 py-4 rounded-xl text-sm font-bold text-white relative overflow-hidden"
                style={{
                  background: `linear-gradient(135deg, ${TEAL}, ${PURPLE})`,
                  boxShadow: `0 8px 30px ${TEAL}25`,
                }}>
                <motion.div className="absolute inset-0 pointer-events-none"
                  style={{ background: "linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.2) 50%, transparent 70%)" }}
                  animate={{ x: ["-200%", "300%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }} />
                <span className="relative z-10 flex items-center gap-2">
                  Inizia Ora <ArrowRight className="w-4 h-4" />
                </span>
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="relative pt-16 pb-8 px-5"
        style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full overflow-hidden">
                  <img src={empireLogoNew} alt="Empire AI" className="w-full h-full object-cover" />
                </div>
                <span className="font-bold text-xs tracking-[0.2em] uppercase text-white/80">EMPIRE.AI</span>
              </div>
              <p className="text-[0.65rem] text-white/30 leading-relaxed">
                La piattaforma AI italiana per app, web e gestionali premium.
              </p>
            </div>

            <div>
              <h4 className="text-[0.55rem] font-bold text-white/40 mb-4 tracking-[3px] uppercase">Settori</h4>
              <div className="space-y-2 text-[0.65rem]">
                {["Food & Ristorazione", "NCC & Trasporto", "Beauty & Wellness", "Healthcare", "Retail", "Fitness"].map((s, i) => (
                  <p key={i} className="text-white/25 hover:text-white/50 transition-colors cursor-default">{s}</p>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[0.55rem] font-bold text-white/40 mb-4 tracking-[3px] uppercase">Piattaforma</h4>
              <div className="space-y-2 text-[0.65rem]">
                {[
                  { label: "Portfolio", href: "#portfolio" },
                  { label: "Settori", href: "#sectors" },
                  { label: "Demo Live", href: "/demo" },
                  { label: "Prezzi", href: "/auth" },
                ].map((link, i) => (
                  <a key={i} href={link.href} className="block text-white/25 hover:text-white/50 transition-colors">{link.label}</a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-[0.55rem] font-bold text-white/40 mb-4 tracking-[3px] uppercase">Contatti</h4>
              <div className="space-y-2 text-[0.65rem]">
                <p className="text-white/30 flex items-center gap-2"><Mail className="w-3 h-3 text-white/20" /> info@empire-suite.it</p>
                <p className="text-white/30 flex items-center gap-2"><MapPin className="w-3 h-3 text-white/20" /> Roma, Italia</p>
                <div className="pt-2">
                  <a href="/privacy" className="block text-white/20 hover:text-white/40 transition-colors mb-1">Privacy Policy</a>
                  <a href="/cookie-policy" className="block text-white/20 hover:text-white/40 transition-colors">Cookie Policy</a>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="pt-6" style={{ borderTop: `1px solid ${GLASS_BORDER}` }}>
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-[0.55rem] text-white/20">
              <p>© 2026 Empire AI · Piattaforma Multi-Settore</p>
              <div className="flex gap-4">
                <a href="/privacy" className="hover:text-white/35 transition-colors">Privacy</a>
                <a href="/cookie-policy" className="hover:text-white/35 transition-colors">Cookie</a>
                <span>P.IVA IT12345678901</span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Voice Agent */}
      <Suspense fallback={null}>
        <EmpireVoiceAgent />
      </Suspense>

      {/* Partner: floating back button */}
      {isFromPartner && (
        <motion.button
          onClick={() => navigate("/partner")}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="fixed top-4 left-4 z-[60] flex items-center gap-2 px-4 py-2.5 rounded-full font-bold text-xs shadow-lg text-white"
          style={{
            background: `linear-gradient(135deg, ${PURPLE}, ${TEAL})`,
            boxShadow: `0 4px 20px ${PURPLE}40`,
          }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-4 h-4" />
          Torna al Pannello
        </motion.button>
      )}

      {/* Gradient text animation CSS */}
      <style>{`
        .hero-gradient-text {
          background: linear-gradient(90deg, ${TEAL}, ${PURPLE}, ${GOLD}, ${TEAL});
          background-size: 300% 100%;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          animation: gradientShift 4s ease-in-out infinite;
        }
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .scrollbar-none::-webkit-scrollbar { display: none; }
        .scrollbar-none { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default LandingPage;
