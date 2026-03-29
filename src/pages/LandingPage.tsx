import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import {
  Smartphone, Globe, ShoppingCart, Megaphone, Palette, Cpu,
  Star, Check, ChevronRight, ArrowRight, Menu, X,
  Instagram, Linkedin, Twitter, Mail, Phone, MapPin,
  Bot, Brain, Users, Rocket, Sparkles, BarChart3, Zap,
  ChefHat, Building, Scissors, Heart, Dumbbell, GraduationCap,
  Car, Store, Waves, Calendar, Package, Headphones,
  Eye, Target, Shield, Crown, Quote, Play,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import empireLogoNew from "@/assets/empire-logo-new.png";
import EmpireVoiceAgent from "@/components/public/EmpireVoiceAgent";

/* ═══════════════════════════════════════════
   CONSTANTS
   ═══════════════════════════════════════════ */

const MOCKUP_BASE = "https://vdzbezmzmznfxebxaaus.supabase.co/storage/v1/object/public/mockups/";

const PROJECTS: { name: string; category: string; path: string; landscape?: boolean }[] = [
  { name: "Flame Kebab", category: "food", path: "flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png" },
  { name: "Aloha Pet Resorts", category: "lifestyle", path: "Aloha%20Pet%20Resorts/mobile-a-home.png" },
  { name: "Otomaki Sushi", category: "food", path: "migrated-1773167901906-otomaki-mobile-home.png" },
  { name: "La Patrona", category: "food", path: "migrated-1773167903321-la-patrona-mobile-home.png" },
  { name: "Papagua", category: "food", path: "migrated-1773167904818-papagua-home.png", landscape: true },
  { name: "Meridia Rental", category: "travel", path: "migrated-1773167906872-meridia-mobile-home.png" },
  { name: "Neo Nails Brickell", category: "app", path: "Neo%20Nails%20Brickell/frosted-glass-home.png" },
  { name: "Little Diamond Nursery", category: "education", path: "Little%20Diamond%20Nursery%20-%20Playful%20Colorful/home.png" },
  { name: "Midtown Kosher", category: "web", path: "Midtown%20Kosher/style-a-home.png", landscape: true },
  { name: "Asinara Charter", category: "app", path: "Asinara%20Charter%20-%20Sardinia%20Azure%20Luxury/home.png" },
  { name: "City Padel Milano", category: "app", path: "City%20Padel%20Milano/mobile-fresh-azzurro-home.png" },
  { name: "Miami Boats Rental", category: "app", path: "Miami%20Boats%20Rental/A-mobile-home.png" },
  { name: "COTE Miami", category: "app", path: "COTE%20Miami/a-obsidian-mobile-home.png" },
  { name: "MMI Resident Hub", category: "app", path: "MMI%20Resident%20Hub/01-ocean-azure-desktop-dashboard.png", landscape: true },
  { name: "FAR Medical", category: "web", path: "FAR%20Medical%20Solutions/a-ethereal-glass-mobile-home.png" },
  { name: "Tatush Hair", category: "ecommerce", path: "Tatush%20Hair%20Fragrance/mobile-home.png" },
  { name: "Miami Watersports", category: "app", path: "Miami%20Watersports/style-a-mobile-home.png" },
  { name: "STRAPIZZAMI", category: "app", path: "STRAPIZZAMI/stile-a-home.png" },
  { name: "Paperfish Sushi", category: "app", path: "Paperfish%20Sushi/a-sakura-home.png" },
  { name: "Nick's Plumbing", category: "app", path: "Nick's%20Plumbing%20&%20AC/stile-a-home.png" },
  { name: "La Vang Vietnamese", category: "app", path: "La%20Vang%20Vietnamese%20Luxury/a-noir-saigon-home.png" },
  { name: "Ashley's Playhouse", category: "app", path: "Ashley's%20Playhouse/stile-a-home.png" },
  { name: "Batey Cevicheria", category: "app", path: "Batey%20Cevicheria%20Urbana/costa-pacifico-mobile-home.png" },
  { name: "Little Stars Daycare", category: "app", path: "Little%20Stars%20Daycare/style-a-home.png" },
  { name: "PawParadise", category: "app", path: "PawParadise/style-a-home.png" },
  { name: "Top Golf Bay", category: "app", path: "Top%20Golf%20Bay%20App/a-official-home.png" },
  { name: "LuxDrive", category: "app", path: "LuxDrive/style-a-home.png" },
  { name: "Texas Horse Ranch", category: "app", path: "Texas%20Horse%20Ranch%20-%205%20Style%20Proposals/a1-velvet-saddle-home.png" },
  { name: "Aura Milano Spa", category: "app", path: "Aura%20Milano%20Spa/mobile-luce-pura-home.png" },
  { name: "DIMORA Milano", category: "app", path: "DIMORA%20Milano/eleganza-milanese-home-mobile.png" },
];

const CATEGORIES = [
  { key: "all", label: "Tutti" },
  { key: "food", label: "Food" },
  { key: "lifestyle", label: "Lifestyle" },
  { key: "travel", label: "Travel" },
  { key: "app", label: "App Design" },
  { key: "education", label: "Education" },
  { key: "web", label: "Web Design" },
  { key: "ecommerce", label: "E-Commerce" },
];

const SERVICES = [
  { icon: Smartphone, title: "App Mobile", desc: "App native iOS/Android con IA integrata, notifiche push, pagamenti e prenotazioni. Design premium su misura per ogni settore." },
  { icon: Globe, title: "Web Design", desc: "Siti web ad alta conversione con SEO avanzato, analytics IA e landing page ottimizzate per generare lead qualificati." },
  { icon: ShoppingCart, title: "E-Commerce", desc: "Piattaforme di vendita online con checkout ottimizzato, upselling IA, gestione inventario e integrazioni pagamento." },
  { icon: Megaphone, title: "Marketing IA", desc: "Campagne automatizzate su WhatsApp, email e social. Copywriting IA, A/B testing e targeting predittivo." },
  { icon: Palette, title: "Brand Identity", desc: "Logo, palette colori, tipografia e guidelines complete. Identità visiva premium che distingue il tuo brand." },
  { icon: Cpu, title: "Automazione", desc: "98+ agenti IA specializzati: gestione ordini, CRM, fatturazione, recensioni, customer care 24/7 e molto altro." },
];

const PRICING_PLANS = [
  {
    name: "Starter", price: 97, annual: 77,
    features: ["App Mobile Custom", "Sito Web Responsive", "3 Agenti IA", "Dashboard Analytics", "Supporto Email", "1 Revisione Design/mese"],
    cta: "Inizia Ora",
  },
  {
    name: "Professional", price: 197, annual: 157, popular: true,
    features: ["Tutto in Starter +", "E-Commerce Integrato", "15 Agenti IA", "WhatsApp Business IA", "CRM Avanzato", "Marketing Automation", "Supporto Prioritario", "Revisioni Illimitate"],
    cta: "Inizia Ora",
  },
  {
    name: "Enterprise", price: 497, annual: 397,
    features: ["Tutto in Professional +", "98+ Agenti IA", "API Custom", "Account Manager Dedicato", "SLA 99.9%", "Formazione Team", "Multi-Sede", "White Label"],
    cta: "Contattaci",
  },
];

const TESTIMONIALS = [
  { name: "Marco Rossi", company: "Flame Kebab", text: "Empire ha trasformato il nostro ristorante. Gli ordini online sono aumentati del 340% in 3 mesi.", rating: 5, avatar: "MR" },
  { name: "Sophia Chen", company: "Neo Nails Brickell", text: "L'app di prenotazione ha eliminato le no-show e il nostro fatturato è cresciuto del 60%.", rating: 5, avatar: "SC" },
  { name: "Alessandro Ferro", company: "LuxDrive NCC", text: "Gestire 15 autisti era un caos. Ora l'IA ottimizza tutto: percorsi, prenotazioni, fatturazione.", rating: 5, avatar: "AF" },
  { name: "Laura Bianchi", company: "Aura Milano Spa", text: "Design premium e automazioni incredibili. I clienti ci fanno i complimenti ogni giorno.", rating: 5, avatar: "LB" },
];

const AI_SECTORS = [
  { icon: ChefHat, label: "Ristorazione", desc: "Ordini, menu IA, gestione cucina, prenotazioni, recensioni automatiche" },
  { icon: Building, label: "Immobiliare", desc: "Valutazioni IA, tour virtuali, matching acquirenti, CRM integrato" },
  { icon: Store, label: "E-Commerce", desc: "Upselling predittivo, gestione inventario, checkout ottimizzato" },
  { icon: Scissors, label: "Beauty & Wellness", desc: "Prenotazioni smart, reminder, programmi fedeltà, portfolio clienti" },
  { icon: Dumbbell, label: "Fitness", desc: "Schede allenamento IA, prenotazione classi, tracking progressi" },
  { icon: GraduationCap, label: "Education", desc: "Iscrizioni online, comunicazione genitori, gestione presenze" },
  { icon: Car, label: "NCC & Trasporti", desc: "Dispatch IA, ottimizzazione percorsi, fleet management, fatturazione" },
  { icon: Heart, label: "Healthcare", desc: "Telemedicina, prenotazioni, cartelle digitali, reminder pazienti" },
  { icon: Waves, label: "Tourism & Hospitality", desc: "Booking engine, concierge IA, gestione camere, revenue management" },
];

/* ═══════════════════════════════════════════
   SCROLL REVEAL HOOK
   ═══════════════════════════════════════════ */
function useReveal(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); obs.unobserve(el); } }, { threshold, rootMargin: "0px 0px -40px 0px" });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* Animated counter */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState(0);
  const { ref: wrapRef, visible } = useReveal(0.3);
  const started = useRef(false);

  useEffect(() => {
    if (!visible || started.current) return;
    started.current = true;
    const start = performance.now();
    const dur = 2000;
    const tick = (now: number) => {
      const p = Math.min((now - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.round(eased * value));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [visible, value]);

  return <span ref={(el) => { (ref as any).current = el; (wrapRef as any).current = el; }}>{display}{suffix}</span>;
}

/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function LandingPage() {
  const navigate = useNavigate();
  const [mobileMenu, setMobileMenu] = useState(false);
  const [annual, setAnnual] = useState(false);
  const [portfolioFilter, setPortfolioFilter] = useState("all");
  const [testimonialIdx, setTestimonialIdx] = useState(0);
  const [ctaEmail, setCtaEmail] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Scroll progress bar
  const { scrollYProgress } = useScroll();

  // Navbar scroll effect
  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  // Testimonial auto-rotate
  useEffect(() => {
    const t = setInterval(() => setTestimonialIdx(p => (p + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const filteredProjects = useMemo(() =>
    portfolioFilter === "all" ? PROJECTS : PROJECTS.filter(p => p.category === portfolioFilter),
    [portfolioFilter]
  );

  const heroMockups = [
    MOCKUP_BASE + "flame-kebab/bd5def39-e58c-46db-92f9-19d48e0da2ea.png",
    MOCKUP_BASE + "Aloha%20Pet%20Resorts/mobile-a-home.png",
    MOCKUP_BASE + "COTE%20Miami/a-obsidian-mobile-home.png",
  ];

  // Section reveal refs
  const heroR = useReveal(0.1);
  const servicesR = useReveal();
  const portfolioR = useReveal();
  const aiR = useReveal();
  const pricingR = useReveal();
  const testimonialsR = useReveal();
  const ctaR = useReveal();

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMobileMenu(false);
  };

  return (
    <div className="min-h-screen font-sans antialiased" style={{ fontFamily: "'Inter', system-ui, sans-serif" }}>
      {/* ── Scroll Progress Bar ── */}
      <motion.div className="fixed top-0 left-0 right-0 h-[3px] z-[100] origin-left" style={{ scaleX: scrollYProgress, background: "linear-gradient(90deg, #7eb7be, #6c3ce0)" }} />

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "py-2" : "py-4"}`}
        style={{
          background: scrolled ? "rgba(255,255,255,0.85)" : "transparent",
          backdropFilter: scrolled ? "blur(20px) saturate(1.8)" : "none",
          borderBottom: scrolled ? "1px solid rgba(0,0,0,0.06)" : "none",
        }}>
        <div className="max-w-7xl mx-auto px-5 flex items-center justify-between">
          <img src={empireLogoNew} alt="Empire" className="h-8 sm:h-9 object-contain cursor-pointer" onClick={() => scrollTo("hero")} />
          <div className="hidden md:flex items-center gap-8">
            {["Servizi", "Portfolio", "AI", "Pricing"].map(s => (
              <button key={s} onClick={() => scrollTo(s.toLowerCase())} className="text-sm font-medium transition-colors hover:text-[#7eb7be]"
                style={{ color: scrolled ? "#111" : "#fff" }}>{s}</button>
            ))}
          </div>
          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate("/auth")} className="text-sm font-medium px-4 py-2 rounded-lg transition-colors hover:bg-black/5"
              style={{ color: scrolled ? "#111" : "#fff" }}>Accedi</button>
            <button onClick={() => scrollTo("pricing")} className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}>Inizia Ora</button>
          </div>
          <button className="md:hidden p-2" onClick={() => setMobileMenu(!mobileMenu)}>
            {mobileMenu ? <X size={22} style={{ color: scrolled ? "#111" : "#fff" }} /> : <Menu size={22} style={{ color: scrolled ? "#111" : "#fff" }} />}
          </button>
        </div>
        {/* Mobile menu */}
        <AnimatePresence>
          {mobileMenu && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
              className="md:hidden absolute top-full left-0 right-0 p-5 space-y-3"
              style={{ background: "rgba(255,255,255,0.97)", backdropFilter: "blur(20px)" }}>
              {["Servizi", "Portfolio", "AI", "Pricing"].map(s => (
                <button key={s} onClick={() => scrollTo(s.toLowerCase())} className="block w-full text-left text-sm font-medium py-2 text-gray-800">{s}</button>
              ))}
              <button onClick={() => { navigate("/auth"); setMobileMenu(false); }} className="block w-full text-left text-sm font-medium py-2 text-gray-800">Accedi</button>
              <button onClick={() => scrollTo("pricing")} className="w-full text-sm font-semibold px-5 py-2.5 rounded-xl text-white mt-2"
                style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)" }}>Inizia Ora</button>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ══════════════════════════════════════════
          HERO SECTION — Light gradient
          ══════════════════════════════════════════ */}
      <section id="hero" className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20 pb-16"
        style={{ background: "linear-gradient(180deg, #0c0c18 0%, #111128 40%, #0e0d16 100%)" }}>
        {/* Ambient orbs */}
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full blur-[150px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(126,183,190,0.15), transparent 70%)" }} />
        <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] pointer-events-none" style={{ background: "radial-gradient(circle, rgba(108,60,224,0.12), transparent 70%)" }} />

        <div ref={heroR.ref} className={`relative z-10 max-w-5xl mx-auto px-5 text-center transition-all duration-1000 ${heroR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2, duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-8"
            style={{ background: "rgba(126,183,190,0.1)", border: "1px solid rgba(126,183,190,0.2)", color: "#7eb7be" }}>
            <Sparkles size={13} /> AI-Powered Digital Agency
          </motion.div>

          {/* Title */}
          <motion.h1 initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35, duration: 0.8 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.08] tracking-tight mb-6"
            style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
            Trasformiamo le Imprese{" "}
            <br className="hidden sm:block" />
            Italiane con l'
            <span style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
              Intelligenza Artificiale
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5, duration: 0.7 }}
            className="text-base sm:text-lg max-w-2xl mx-auto mb-10 leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            App, Siti Web ed E-Commerce premium con 98+ agenti IA integrati.
            <br className="hidden sm:block" />
            Automatizziamo ogni aspetto del tuo business per farti crescere.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65, duration: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <button onClick={() => scrollTo("pricing")}
              className="px-8 py-3.5 rounded-xl text-white font-semibold text-sm transition-all hover:scale-105 hover:shadow-lg"
              style={{ background: "linear-gradient(135deg, #7eb7be, #5a9ba2)", boxShadow: "0 8px 30px rgba(126,183,190,0.3)" }}>
              Scopri i Piani <ArrowRight size={16} className="inline ml-1" />
            </button>
            <button onClick={() => scrollTo("portfolio")}
              className="px-8 py-3.5 rounded-xl font-semibold text-sm transition-all hover:scale-105"
              style={{ border: "1.5px solid rgba(255,255,255,0.2)", color: "#fff", background: "rgba(255,255,255,0.03)" }}>
              Vedi Portfolio
            </button>
          </motion.div>

          {/* 3 Phone Mockups */}
          <motion.div initial={{ opacity: 0, y: 50, scale: 0.9 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ delay: 0.85, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex items-end justify-center gap-0">
            {/* Glow under phones */}
            <div className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 w-[80%] h-[60px] rounded-full blur-[40px]"
              style={{ background: "linear-gradient(90deg, rgba(126,183,190,0.25), rgba(108,60,224,0.2))" }} />

            {heroMockups.map((src, i) => {
              const isCenter = i === 1;
              const rotate = i === 0 ? -8 : i === 2 ? 8 : 0;
              const scale = isCenter ? 1 : 0.88;
              const z = isCenter ? 20 : 10;
              const mb = isCenter ? 0 : 20;
              return (
                <motion.div key={i} className="relative" style={{ zIndex: z, marginBottom: mb, transform: `rotate(${rotate}deg) scale(${scale})` }}
                  animate={{ y: [0, isCenter ? -10 : -6, 0] }} transition={{ duration: isCenter ? 5 : 5.5, repeat: Infinity, ease: "easeInOut", delay: i * 0.5 }}>
                  <div className="relative overflow-hidden"
                    style={{
                      width: isCenter ? "180px" : "150px",
                      aspectRatio: "9/19.5",
                      borderRadius: isCenter ? "28px" : "24px",
                      border: `2.5px solid rgba(255,255,255,${isCenter ? 0.15 : 0.08})`,
                      background: "#0a0a12",
                      boxShadow: `0 30px 60px rgba(0,0,0,0.4), 0 8px 24px rgba(108,60,224,0.1)`,
                    }}>
                    {/* Dynamic Island */}
                    <div className="absolute top-[7px] left-1/2 -translate-x-1/2 w-[34%] max-w-[48px] h-[12px] bg-black rounded-full z-30" style={{ boxShadow: "0 0 0 1px rgba(255,255,255,0.06)" }} />
                    <div className="absolute inset-[3px] overflow-hidden" style={{ borderRadius: isCenter ? "25px" : "21px" }}>
                      <img src={src} alt={`Progetto ${i + 1}`} className="w-full h-full object-cover object-top" loading="eager" />
                      <div className="absolute inset-x-0 top-0 h-8" style={{ background: "linear-gradient(to bottom, rgba(0,0,0,0.3), transparent)" }} />
                    </div>
                    <div className="absolute bottom-[4px] left-1/2 -translate-x-1/2 w-[30%] h-[3px] bg-white/20 rounded-full z-20" />
                    <div className="absolute inset-0 pointer-events-none" style={{ borderRadius: isCenter ? "28px" : "24px", background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 40%)" }} />
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Trust logos strip */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-14 flex flex-wrap items-center justify-center gap-6 text-xs font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>
            <span className="flex items-center gap-1.5"><Shield size={14} /> GDPR Compliant</span>
            <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="flex items-center gap-1.5"><Zap size={14} /> 500+ Progetti</span>
            <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="flex items-center gap-1.5"><Star size={14} /> 4.9/5 Rating</span>
            <span className="w-px h-4" style={{ background: "rgba(255,255,255,0.1)" }} />
            <span className="flex items-center gap-1.5"><Bot size={14} /> 98+ Agenti IA</span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          SERVIZI SECTION — Dark
          ══════════════════════════════════════════ */}
      <section id="servizi" className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "#0e0d16" }}>
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full blur-[160px] pointer-events-none" style={{ background: "radial-gradient(ellipse, rgba(126,183,190,0.06), transparent 70%)" }} />

        <div ref={servicesR.ref} className={`relative z-10 max-w-6xl mx-auto px-5 transition-all duration-1000 ${servicesR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-16">
            <p className="text-xs font-semibold tracking-[3px] uppercase mb-3" style={{ color: "#7eb7be" }}>Cosa Facciamo</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
              Soluzioni Digitali{" "}
              <span style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Complete</span>
            </h2>
            <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              Ogni servizio è potenziato dall'intelligenza artificiale per massimizzare i risultati del tuo business.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {SERVICES.map((s, i) => (
              <div key={i} className="group relative p-6 rounded-2xl transition-all duration-500 hover:-translate-y-1 cursor-default"
                style={{
                  background: "linear-gradient(160deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01))",
                  border: "1px solid rgba(255,255,255,0.06)",
                  backdropFilter: "blur(12px)",
                  transitionDelay: `${i * 80}ms`,
                  opacity: servicesR.visible ? 1 : 0,
                  transform: servicesR.visible ? "translateY(0)" : "translateY(20px)",
                }}>
                {/* Hover glow */}
                <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(126,183,190,0.08), transparent 60%)" }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(126,183,190,0.1)", border: "1px solid rgba(126,183,190,0.15)" }}>
                  <s.icon size={20} style={{ color: "#7eb7be" }} />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{s.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PORTFOLIO SECTION — Cream
          ══════════════════════════════════════════ */}
      <section id="portfolio" className="relative py-24 sm:py-32" style={{ background: "#f8f7f3" }}>
        <div ref={portfolioR.ref} className={`max-w-7xl mx-auto px-5 transition-all duration-1000 ${portfolioR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[3px] uppercase mb-3" style={{ color: "#6c3ce0" }}>Portfolio</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#111" }}>
              I Nostri{" "}
              <span style={{ background: "linear-gradient(135deg, #6c3ce0, #7eb7be)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Progetti</span>
            </h2>
            <p className="text-sm sm:text-base max-w-lg mx-auto" style={{ color: "rgba(0,0,0,0.45)" }}>
              Oltre 500 progetti realizzati per aziende in 25+ settori diversi.
            </p>
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap justify-center gap-2 mb-10">
            {CATEGORIES.map(c => (
              <button key={c.key} onClick={() => setPortfolioFilter(c.key)}
                className="px-4 py-2 rounded-full text-xs font-semibold transition-all duration-300"
                style={{
                  background: portfolioFilter === c.key ? "linear-gradient(135deg, #6c3ce0, #7eb7be)" : "rgba(0,0,0,0.04)",
                  color: portfolioFilter === c.key ? "#fff" : "rgba(0,0,0,0.5)",
                  border: portfolioFilter === c.key ? "none" : "1px solid rgba(0,0,0,0.08)",
                }}>
                {c.label}
              </button>
            ))}
          </div>

          {/* Projects grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            <AnimatePresence mode="popLayout">
              {filteredProjects.map((p, i) => (
                <motion.div key={p.name} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  className={`group relative overflow-hidden rounded-2xl cursor-pointer ${p.landscape ? "col-span-2" : ""}`}
                  style={{ aspectRatio: p.landscape ? "16/9" : "9/16", background: "#e8e7e3" }}>
                  <img src={MOCKUP_BASE + p.path} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                  {/* Hover overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.2) 50%, transparent 100%)" }}>
                    <p className="text-white text-sm font-bold text-center">{p.name}</p>
                    <span className="text-[10px] uppercase tracking-widest mt-1 font-semibold" style={{ color: "#7eb7be" }}>{p.category}</span>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* CTA under portfolio */}
          <div className="text-center mt-12">
            <button onClick={() => navigate("/demo")} className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition-all hover:scale-105"
              style={{ background: "linear-gradient(135deg, #6c3ce0, #5a28bd)", boxShadow: "0 8px 30px rgba(108,60,224,0.25)" }}>
              Vedi Tutte le Demo <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          EMPIRE NEXUS AI — Black
          ══════════════════════════════════════════ */}
      <section id="ai" className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "#08080c" }}>
        {/* Glow effects */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[200px] pointer-events-none"
          style={{ background: "radial-gradient(circle, rgba(108,60,224,0.08), rgba(126,183,190,0.04), transparent 70%)" }} />

        <div ref={aiR.ref} className={`relative z-10 max-w-6xl mx-auto px-5 transition-all duration-1000 ${aiR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold tracking-wide uppercase mb-4"
              style={{ background: "rgba(108,60,224,0.1)", border: "1px solid rgba(108,60,224,0.2)", color: "#a78bfa" }}>
              <Brain size={13} /> Intelligenza Artificiale
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#fff" }}>
              Empire Nexus{" "}
              <span style={{ background: "linear-gradient(135deg, #6c3ce0, #7eb7be)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>AI</span>
            </h2>
            <p className="text-sm sm:text-base max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.4)" }}>
              98+ agenti IA specializzati che lavorano 24/7 per automatizzare ogni aspetto del tuo business, dal customer care alla fatturazione.
            </p>
          </div>

          {/* AI Counters */}
          <div className="grid grid-cols-3 gap-6 max-w-xl mx-auto mb-16">
            {[{ val: 98, suf: "+", label: "Agenti IA" }, { val: 25, suf: "+", label: "Settori" }, { val: 500, suf: "+", label: "Progetti" }].map((c, i) => (
              <div key={i} className="text-center">
                <p className="text-3xl sm:text-4xl md:text-5xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  <AnimatedCounter value={c.val} suffix={c.suf} />
                </p>
                <p className="text-xs mt-1 font-medium" style={{ color: "rgba(255,255,255,0.3)" }}>{c.label}</p>
              </div>
            ))}
          </div>

          {/* AI Sectors grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AI_SECTORS.map((s, i) => (
              <div key={i} className="group flex items-start gap-4 p-5 rounded-xl transition-all duration-500"
                style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.05)",
                  opacity: aiR.visible ? 1 : 0,
                  transform: aiR.visible ? "translateY(0)" : "translateY(16px)",
                  transitionDelay: `${i * 60}ms`,
                }}>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform"
                  style={{ background: "rgba(126,183,190,0.08)", border: "1px solid rgba(126,183,190,0.12)" }}>
                  <s.icon size={18} style={{ color: "#7eb7be" }} />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white mb-1">{s.label}</h4>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)" }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          PRICING — White
          ══════════════════════════════════════════ */}
      <section id="pricing" className="relative py-24 sm:py-32" style={{ background: "#fff" }}>
        <div ref={pricingR.ref} className={`max-w-6xl mx-auto px-5 transition-all duration-1000 ${pricingR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-14">
            <p className="text-xs font-semibold tracking-[3px] uppercase mb-3" style={{ color: "#7eb7be" }}>Pricing</p>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif", color: "#111" }}>
              Piani{" "}
              <span style={{ background: "linear-gradient(135deg, #7eb7be, #6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Trasparenti</span>
            </h2>
            <p className="text-sm max-w-lg mx-auto mb-8" style={{ color: "rgba(0,0,0,0.45)" }}>
              Nessun costo nascosto. Scegli il piano perfetto per la tua attività.
            </p>
            {/* Toggle */}
            <div className="inline-flex items-center gap-3 p-1 rounded-full" style={{ background: "rgba(0,0,0,0.04)" }}>
              <button onClick={() => setAnnual(false)} className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{ background: !annual ? "#111" : "transparent", color: !annual ? "#fff" : "rgba(0,0,0,0.5)" }}>Mensile</button>
              <button onClick={() => setAnnual(true)} className="px-4 py-2 rounded-full text-xs font-semibold transition-all"
                style={{ background: annual ? "#111" : "transparent", color: annual ? "#fff" : "rgba(0,0,0,0.5)" }}>
                Annuale <span className="text-[10px] ml-1" style={{ color: annual ? "#7eb7be" : "rgba(0,0,0,0.3)" }}>-20%</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {PRICING_PLANS.map((plan, i) => (
              <div key={i} className={`relative rounded-2xl p-7 transition-all duration-500 hover:-translate-y-1 ${plan.popular ? "ring-2" : ""}`}
                style={{
                  background: plan.popular ? "linear-gradient(160deg, #0e0d16, #18173a)" : "#fff",
                  border: plan.popular ? "none" : "1px solid rgba(0,0,0,0.08)",
                  ringColor: plan.popular ? "#6c3ce0" : undefined,
                  boxShadow: plan.popular ? "0 20px 60px rgba(108,60,224,0.15)" : "0 4px 20px rgba(0,0,0,0.04)",
                }}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-white"
                    style={{ background: "linear-gradient(135deg, #6c3ce0, #7eb7be)" }}>Più Popolare</div>
                )}
                <h3 className="text-lg font-bold mb-1" style={{ color: plan.popular ? "#fff" : "#111" }}>{plan.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-4xl font-bold" style={{ fontFamily: "'Space Grotesk', sans-serif", color: plan.popular ? "#fff" : "#111" }}>
                    €{annual ? plan.annual : plan.price}
                  </span>
                  <span className="text-sm mb-1" style={{ color: plan.popular ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>/mese</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f, fi) => (
                    <li key={fi} className="flex items-start gap-2 text-sm" style={{ color: plan.popular ? "rgba(255,255,255,0.7)" : "rgba(0,0,0,0.6)" }}>
                      <Check size={15} className="mt-0.5 shrink-0" style={{ color: "#7eb7be" }} />
                      {f}
                    </li>
                  ))}
                </ul>
                <button onClick={() => navigate("/auth")}
                  className="w-full py-3 rounded-xl text-sm font-semibold transition-all hover:scale-[1.02]"
                  style={{
                    background: plan.popular ? "linear-gradient(135deg, #7eb7be, #6c3ce0)" : "rgba(0,0,0,0.04)",
                    color: plan.popular ? "#fff" : "#111",
                    border: plan.popular ? "none" : "1px solid rgba(0,0,0,0.08)",
                  }}>
                  {plan.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          TESTIMONIALS — Dark
          ══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden" style={{ background: "#0e0d16" }}>
        <div ref={testimonialsR.ref} className={`relative z-10 max-w-4xl mx-auto px-5 transition-all duration-1000 ${testimonialsR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="text-center mb-12">
            <p className="text-xs font-semibold tracking-[3px] uppercase mb-3" style={{ color: "#d4a855" }}>Testimonianze</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
              Cosa Dicono i{" "}
              <span style={{ background: "linear-gradient(135deg, #d4a855, #e8c77b)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Nostri Clienti</span>
            </h2>
          </div>

          <div className="relative">
            <AnimatePresence mode="wait">
              {TESTIMONIALS.map((t, i) => i === testimonialIdx && (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.5 }}
                  className="text-center">
                  <Quote size={32} className="mx-auto mb-6" style={{ color: "rgba(212,168,85,0.3)" }} />
                  <p className="text-lg sm:text-xl leading-relaxed mb-8 max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.75)" }}>
                    "{t.text}"
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-12 h-12 rounded-full flex items-center justify-center text-sm font-bold"
                      style={{ background: "linear-gradient(135deg, #d4a855, #e8c77b)", color: "#111" }}>{t.avatar}</div>
                    <div className="text-left">
                      <p className="text-sm font-bold text-white">{t.name}</p>
                      <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>{t.company}</p>
                    </div>
                    <div className="flex gap-0.5 ml-4">
                      {Array.from({ length: t.rating }).map((_, si) => <Star key={si} size={14} fill="#d4a855" style={{ color: "#d4a855" }} />)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-8">
              {TESTIMONIALS.map((_, i) => (
                <button key={i} onClick={() => setTestimonialIdx(i)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${i === testimonialIdx ? "w-6 bg-[#d4a855]" : "bg-white/15"}`} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          CTA FINALE — Gradient
          ══════════════════════════════════════════ */}
      <section className="relative py-24 sm:py-32 overflow-hidden"
        style={{ background: "linear-gradient(135deg, #7eb7be 0%, #6c3ce0 100%)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: "radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1), transparent 60%)" }} />

        <div ref={ctaR.ref} className={`relative z-10 max-w-3xl mx-auto px-5 text-center transition-all duration-1000 ${ctaR.visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Space Grotesk', sans-serif" }}>
            Pronto a Rivoluzionare<br />il Tuo Business?
          </h2>
          <p className="text-base mb-10" style={{ color: "rgba(255,255,255,0.75)" }}>
            Unisciti a 500+ aziende che hanno già trasformato il loro business con Empire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto">
            <input type="email" value={ctaEmail} onChange={e => setCtaEmail(e.target.value)}
              placeholder="La tua email"
              className="w-full sm:flex-1 px-5 py-3.5 rounded-xl text-sm outline-none"
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)", color: "#fff" }} />
            <button onClick={() => navigate("/auth")}
              className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold transition-all hover:scale-105"
              style={{ background: "#fff", color: "#111" }}>
              Inizia Gratis <ArrowRight size={15} className="inline ml-1" />
            </button>
          </div>
          <p className="text-xs mt-4" style={{ color: "rgba(255,255,255,0.4)" }}>
            90 giorni di prova gratuita • Nessuna carta richiesta
          </p>
        </div>
      </section>

      {/* ══════════════════════════════════════════
          FOOTER
          ══════════════════════════════════════════ */}
      <footer style={{ background: "#08080c", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-5 py-16">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-10">
            {/* Brand */}
            <div className="col-span-2">
              <img src={empireLogoNew} alt="Empire" className="h-8 mb-4" />
              <p className="text-xs leading-relaxed max-w-xs mb-6" style={{ color: "rgba(255,255,255,0.3)" }}>
                AI-Powered Digital Agency. Trasformiamo le imprese italiane con soluzioni digitali premium e intelligenza artificiale.
              </p>
              <div className="flex gap-3">
                {[Instagram, Linkedin, Twitter].map((Icon, i) => (
                  <a key={i} href="#" className="w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:opacity-80"
                    style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.06)" }}>
                    <Icon size={15} style={{ color: "rgba(255,255,255,0.4)" }} />
                  </a>
                ))}
              </div>
            </div>
            {/* Links */}
            {[
              { title: "Servizi", links: [{ l: "App Mobile", h: "#servizi" }, { l: "Web Design", h: "#servizi" }, { l: "E-Commerce", h: "#servizi" }, { l: "Marketing IA", h: "#servizi" }] },
              { title: "Azienda", links: [{ l: "Portfolio", h: "#portfolio" }, { l: "Pricing", h: "#pricing" }, { l: "Testimonianze", h: "#" }, { l: "Partner", h: "/partner" }] },
              { title: "Legale", links: [{ l: "Privacy Policy", h: "/privacy" }, { l: "Cookie Policy", h: "/cookie-policy" }, { l: "Termini", h: "#" }] },
            ].map((col, ci) => (
              <div key={ci}>
                <h4 className="text-xs font-bold uppercase tracking-[2px] mb-4" style={{ color: "rgba(255,255,255,0.4)" }}>{col.title}</h4>
                <ul className="space-y-2.5">
                  {col.links.map((lnk, li) => (
                    <li key={li}>
                      <a href={lnk.h} className="text-xs transition-colors hover:text-[#7eb7be]" style={{ color: "rgba(255,255,255,0.25)" }}>{lnk.l}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        {/* Bottom bar */}
        <div style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
          <div className="max-w-6xl mx-auto px-5 py-5 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
              © {new Date().getFullYear()} Empire AI. Tutti i diritti riservati.
            </p>
            <p className="text-[10px]" style={{ color: "rgba(255,255,255,0.15)" }}>
              Made with ❤️ in Italy
            </p>
          </div>
        </div>
      </footer>

      {/* Voice Agent */}
      <EmpireVoiceAgent />

      {/* Animation Safety — force visibility after 5s */}
      <script dangerouslySetInnerHTML={{ __html: `setTimeout(function(){document.querySelectorAll('section').forEach(function(s){s.style.opacity='1';s.style.transform='none';})},5000)` }} />
    </div>
  );
}
