import { useState, useRef, useEffect, forwardRef } from "react";
import DemoAdminAccessButton from "@/components/public/DemoAdminAccessButton";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { MarqueeCarousel, PremiumSectionHeader, PremiumStatsBar, ReviewsMarquee, AmbientGlow, GlassServiceCard } from "@/components/public/PremiumSiteKit";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Scissors, Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Sparkles, CheckCircle, Send, ChevronDown, Instagram,
  Users, Award, Quote, ArrowRight, MessageCircle, Menu, X, ChevronLeft, ChevronRight,
  Eye, Droplets, Gem, Crown, Flower2, Palette
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import { DemoPricingSection } from "@/components/public/DemoPricingSection";
import { DemoRichFooter } from "@/components/public/DemoRichFooter";
import { DemoTestimonialsCarousel } from "@/components/public/DemoTestimonialsCarousel";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";

/* ── BEAUTY DESIGN SYSTEM — Rose Gold + Noir ── */
const B = {
  bg: "#0c0810",
  bgWarm: "#140e16",
  bgCream: "#faf5f0",
  bgBlush: "#fdf0ee",
  rose: "#C27B88",
  roseGold: "#D4A574",
  mauve: "#8E6B7F",
  blush: "#E8C4C4",
  champagne: "#E8D5B5",
  textLight: "#faf5f0",
  textDark: "#2a1f2d",
  cardBg: "rgba(255,255,255,0.025)",
  cardBorder: "rgba(194,123,136,0.15)",
  footer: "#080610",
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, _ref) => {
    const localRef = useRef(null);
    const isInView = useInView(localRef, { once: true, margin: "-60px" });
    return (
      <section id={id} ref={localRef} className={className} style={style}>
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </motion.div>
      </section>
    );
  }
);
Section.displayName = "Section";

function AnimatedNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 2000, 1); setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Premium Badge ── */
const premiumImages = [
  { src: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Hair Styling" },
  { src: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Colorazione" },
  { src: "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=200", label: "SPA" },
  { src: "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Viso" },
];

function PremiumBadge() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % premiumImages.length), 3500); return () => clearInterval(t); }, []);
  const img = premiumImages[idx];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5 }}
      className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-4 z-20">
      <div className="flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5"
        style={{ background: "rgba(10,10,10,0.85)", border: `1px solid ${B.roseGold}40`, boxShadow: `0 8px 32px rgba(0,0,0,0.5)` }}>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1.5px solid ${B.roseGold}50` }}>
          <AnimatePresence mode="wait">
            <motion.img key={idx} src={img.src} alt={img.label} className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
          </AnimatePresence>
        </div>
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: B.roseGold }}>Premium</p>
          <p className="text-[8px] text-white/45 truncate leading-tight mt-0.5">{img.label}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface Props { company: any; afterHero?: React.ReactNode; }

const HERO_VIDEO = "https://videos.pexels.com/video-files/3998269/3998269-uhd_2732_1440_25fps.mp4";

const GALLERY = [
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const FALLBACK_REVIEWS = [
  { name: "Giulia R.", text: "Ambiente raffinato e professionalità incredibile. Non cambierei mai!", rating: 5, city: "Milano", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Sara M.", text: "Il balayage più bello che abbia mai fatto. Risultato naturale e luminoso.", rating: 5, city: "Roma", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Valentina P.", text: "Massaggio rilassante fantastico, mi sono sentita in un'altra dimensione.", rating: 5, city: "Napoli", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  { name: "Chiara L.", text: "Manicure perfetta, prodotti top e un ambiente che ti fa sentire una regina.", rating: 5, city: "Firenze", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  { name: "Francesca B.", text: "Trattamento viso anti-age incredibile. La mia pelle non è mai stata così luminosa!", rating: 5, city: "Torino", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
];

const SERVICES = [
  { name: "Taglio & Styling", icon: Scissors, desc: "Consulenza personalizzata, taglio sartoriale e styling su misura per il tuo viso", img: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €35" },
  { name: "Colorazione Premium", icon: Palette, desc: "Balayage, meches, toni naturali e vibranti con prodotti eco-luxury", img: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €55" },
  { name: "Trattamenti Viso", icon: Sparkles, desc: "Pulizia profonda, peeling chimici, radiofrequenza e anti-age avanzato", img: "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €45" },
  { name: "Manicure & Nail Art", icon: Gem, desc: "Gel, semipermanente, ricostruzione e nail art d'autore", img: "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €25" },
  { name: "Massaggi & SPA", icon: Flower2, desc: "Rilassanti, decontratturanti, hot stone e percorsi benessere", img: "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €50" },
  { name: "Depilazione Laser", icon: Droplets, desc: "Tecnologia diodo di ultima generazione, risultati permanenti", img: "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €30" },
  { name: "Extension Ciglia", icon: Eye, desc: "One by one, volume russo, effetto naturale o drammatico", img: "https://images.pexels.com/photos/3764013/pexels-photo-3764013.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €60" },
  { name: "Trucco Sposa", icon: Crown, desc: "Trucco professionale per eventi, cerimonie e shooting fotografici", img: "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800", price: "da €80" },
];

const EXPERIENCES = [
  { title: "Rituale Rose Gold", duration: "2h 30min", price: "€149", desc: "Scrub corpo al sale rosa, massaggio aromaterapico, maschera viso all'oro e manicure", img: "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "Percorso Luminosità", duration: "1h 45min", price: "€99", desc: "Pulizia viso profonda, peeling enzimatico, siero vitaminico e LED therapy", img: "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=600" },
  { title: "Pamper Day Completo", duration: "4h", price: "€239", desc: "Taglio, colore, trattamento viso, massaggio full body, manicure e pedicure", img: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=600" },
];

const FAQ_ITEMS = [
  { q: "Come prenoto un appuntamento?", a: "Puoi prenotare online tramite il modulo sul sito, via WhatsApp o telefonicamente. Conferma immediata!" },
  { q: "Utilizzate prodotti cruelty-free?", a: "Assolutamente sì. Lavoriamo esclusivamente con brand eco-luxury certificati vegan e cruelty-free." },
  { q: "Quanto dura un trattamento viso completo?", a: "I trattamenti viso durano da 45 a 90 minuti a seconda del protocollo scelto durante la consulenza gratuita." },
  { q: "Offrite pacchetti regalo?", a: "Sì! Le nostre Gift Card sono personalizzabili e confezionate in packaging luxury. Ideali per ogni occasione." },
  { q: "C'è il parcheggio?", a: "Sì, disponiamo di parcheggio dedicato e gratuito per i clienti a 20 metri dall'ingresso." },
];

export default function BeautyPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeExp, setActiveExp] = useState(0);

  useEffect(() => { const onScroll = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const t = setInterval(() => setActiveExp(p => (p + 1) % EXPERIENCES.length), 5000); return () => clearInterval(t); }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: faqs = [] } = useQuery({
    queryKey: ["beauty-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { toast.error("Inserisci nome e telefono"); return; }
    setSubmitting(true);
    await supabase.from("appointments").insert({
      company_id: companyId, client_name: form.name, client_phone: form.phone,
      scheduled_at: form.date && form.time ? `${form.date}T${form.time}:00` : new Date(Date.now() + 86400000).toISOString(),
      service_name: form.service || null, notes: form.notes || null,
    });
    setSubmitting(false);
    toast.success("Appuntamento richiesto! Ti confermeremo a breve.");
    setForm({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  };

  const phone = company.phone;
  const socialLinks = company.social_links as Record<string, string> | null;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#esperienze", label: "Esperienze" }, { href: "#gallery", label: "Gallery" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];

  const tickerItems = ["Hair Styling", "Balayage", "Trattamento Viso", "Manicure", "Pedicure", "Hot Stone", "SPA", "Laser", "Nail Art", "Extension Ciglia", "Microblading", "Trucco Sposa", "Massaggio Lomi Lomi", "Scrub Corpo"];

  const displayFaqs = (faqs.length > 0 ? faqs : FAQ_ITEMS.map((f, i) => ({ id: `fb-${i}`, question: f.q, answer: f.a }))) as any[];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: B.bg, color: B.textLight }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&family=Jost:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`}
        style={{ background: navScrolled ? `${B.bg}F0` : `${B.bg}99`, backdropFilter: "blur(24px)", borderBottom: `1px solid ${B.rose}20` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url ? <motion.img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" whileHover={{ scale: 1.1 }} /> :
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${B.rose}30, ${B.roseGold}30)` }}><Flower2 className="w-5 h-5" style={{ color: B.roseGold }} /></div>}
            <div className="min-w-0">
              <span className="font-semibold text-base tracking-tight truncate block" style={{ color: B.blush, fontFamily: "'Cormorant Garamond', serif" }}>{company.name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-medium" style={{ color: `${B.roseGold}80`, fontFamily: "'Jost', sans-serif" }}>BEAUTY & WELLNESS</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-[12px] tracking-[0.12em] uppercase" style={{ fontFamily: "'Jost', sans-serif", color: "rgba(255,255,255,0.4)" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-white/80 transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-medium text-xs h-10 px-5 hover:scale-105 transition-transform border-0"
              style={{ background: `linear-gradient(135deg, ${B.rose}, ${B.mauve})`, color: "#fff", fontFamily: "'Jost', sans-serif" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> PRENOTA</a>
            </Button>}
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: B.bg, borderTop: `1px solid ${B.rose}15` }}>
              <div className="px-5 py-5 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm hover:text-white border-b" style={{ borderColor: `${B.rose}10`, color: "rgba(255,255,255,0.4)", fontFamily: "'Jost', sans-serif" }}>{l.label}</a>)}
                {phone && <a href={`tel:${phone}`} className="flex items-center gap-2 py-3 text-sm font-semibold" style={{ color: B.roseGold }}><Phone className="w-4 h-4" /> {phone}</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.4) saturate(0.9) contrast(1.1)" }} />
        {/* Multi-layer overlays for depth */}
        <div className="absolute inset-0" style={{ background: `linear-gradient(160deg, ${B.bg}cc 0%, transparent 50%, ${B.bg}ee 100%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 50%, ${B.rose}18 0%, transparent 60%)` }} />
        <div className="absolute bottom-0 left-0 right-0 h-40" style={{ background: `linear-gradient(to top, ${B.bg}, transparent)` }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 px-4">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm"
                style={{ background: `${B.roseGold}12`, border: `1px solid ${B.roseGold}25`, color: B.roseGold, fontFamily: "'Jost', sans-serif" }}>
                <Crown className="w-4 h-4" /> Beauty & Wellness Premium
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-light leading-[1.08] mb-6"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <span style={{ background: `linear-gradient(135deg, ${B.blush}, ${B.roseGold}, ${B.champagne})`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {company.tagline || "La tua bellezza, la nostra arte"}
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg mb-10 max-w-xl leading-relaxed" style={{ color: "rgba(255,255,255,0.45)", fontFamily: "'Jost', sans-serif" }}>
                Scopri <strong style={{ color: B.blush }}>{company.name}</strong>. Trattamenti esclusivi, prodotti eco-luxury e uno staff dedicato alla tua bellezza naturale.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="rounded-full px-10 h-14 text-base font-medium text-white shadow-2xl border-0"
                  style={{ background: `linear-gradient(135deg, ${B.rose}, ${B.mauve})`, boxShadow: `0 20px 60px -15px ${B.rose}55`, fontFamily: "'Jost', sans-serif" }}
                  onClick={() => scrollTo("prenota")}>
                  <Calendar className="w-5 h-5 mr-2" /> Prenota Appuntamento
                </Button>
                {phone && <Button size="lg" variant="outline" className="rounded-full px-8 h-14 text-white/70 hover:text-white hover:bg-white/5 border-white/10" style={{ fontFamily: "'Jost', sans-serif" }} asChild>
                  <a href={`tel:${phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama</a>
                </Button>}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero image with badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="rounded-[32px] overflow-hidden shadow-2xl aspect-[3/4]" style={{ border: `1px solid ${B.roseGold}20` }}>
              <img src={GALLERY[0]} alt="" className="w-full h-full object-cover" />
              <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 50%, ${B.bg}90 100%)` }} />
            </div>
            <PremiumBadge />
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </section>

      {afterHero}

      {/* ═══ TICKER ═══ */}
      <div className="overflow-hidden py-5 relative" style={{ background: B.bgWarm, borderTop: `1px solid ${B.rose}10`, borderBottom: `1px solid ${B.rose}10` }}>
        <MarqueeCarousel speed={40} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm mx-6 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.2)", fontFamily: "'Jost', sans-serif", letterSpacing: "0.05em" }}>
              <span style={{ color: `${B.roseGold}50` }}>✦</span> {item}
            </span>
          ))
        } />
      </div>

      {/* ═══ STATS ═══ */}
      <Section className="py-16 sm:py-20 px-4" style={{ background: B.bgWarm }}>
        <div className="max-w-5xl mx-auto">
          <PremiumStatsBar accentColor={B.roseGold} stats={[
            { value: 3200, suffix: "+", label: "Clienti Soddisfatte" },
            { value: 18, suffix: "+", label: "Anni di Esperienza" },
            { value: 98, suffix: "%", label: "Tasso di Ritorno" },
            { value: 50, suffix: "+", label: "Trattamenti Premium" },
          ]} />
        </div>
      </Section>

      {/* ═══ SERVICES — Premium Carousel ═══ */}
      <Section id="servizi" className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <AmbientGlow color={B.rose} position="both" />
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.roseGold, fontFamily: "'Jost', sans-serif" }}>I Nostri Servizi</p>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Trattamenti <span style={{ color: B.rose, fontStyle: "italic" }}>Esclusivi</span>
            </h2>
          </div>
          <MarqueeCarousel speed={50} pauseOnHover items={
            SERVICES.map((s, i) => (
              <div key={i} className="w-[260px] sm:w-[300px] mx-2 sm:mx-3 flex-shrink-0">
                <motion.div className="group relative rounded-[24px] overflow-hidden cursor-pointer h-full"
                  style={{ background: B.cardBg, border: `1px solid ${B.cardBorder}`, backdropFilter: "blur(12px)" }}
                  whileHover={{ y: -6 }} transition={{ duration: 0.4 }}>
                  <div className="relative h-48 overflow-hidden rounded-t-[24px]">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(to top, ${B.bg} 0%, transparent 60%)` }} />
                    <div className="absolute top-3 left-3 w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${B.roseGold}20`, backdropFilter: "blur(8px)" }}>
                      <s.icon className="w-4 h-4" style={{ color: B.roseGold }} />
                    </div>
                    <Badge className="absolute top-3 right-3 text-[9px] rounded-full px-3 border-0" style={{ background: `${B.rose}30`, color: B.blush, backdropFilter: "blur(8px)" }}>{s.price}</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-medium text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif", color: B.blush }}>{s.name}</h3>
                    <p className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Jost', sans-serif" }}>{s.desc}</p>
                  </div>
                </motion.div>
              </div>
            ))
          } />
        </div>
      </Section>

      {/* ═══ ESPERIENZE — Luxury Packages ═══ */}
      <Section id="esperienze" className="py-16 sm:py-24 px-4" style={{ background: B.bgCream, color: B.textDark }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.rose, fontFamily: "'Jost', sans-serif" }}>Esperienze Esclusive</p>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif", color: B.textDark }}>
              Percorsi <span style={{ color: B.rose, fontStyle: "italic" }}>Benessere</span>
            </h2>
            <p className="text-sm mt-3 max-w-md mx-auto" style={{ color: "rgba(42,31,45,0.5)", fontFamily: "'Jost', sans-serif" }}>
              Rituali esclusivi pensati per rigenerare corpo e mente
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {EXPERIENCES.map((exp, i) => (
              <motion.div key={i}
                className="group relative rounded-[24px] overflow-hidden cursor-pointer"
                style={{ background: "#fff", border: `1px solid ${B.rose}15`, boxShadow: "0 4px 24px rgba(0,0,0,0.06)" }}
                whileHover={{ y: -8, boxShadow: `0 20px 50px -10px ${B.rose}25` }}
                transition={{ duration: 0.4 }}>
                <div className="relative h-52 overflow-hidden">
                  <img src={exp.img} alt={exp.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                  <Badge className="absolute top-3 right-3 text-[10px] rounded-full px-3 font-semibold border-0"
                    style={{ background: `${B.roseGold}`, color: "#fff" }}>{exp.price}</Badge>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-3.5 h-3.5" style={{ color: B.rose }} />
                    <span className="text-[11px] font-medium" style={{ color: B.rose, fontFamily: "'Jost', sans-serif" }}>{exp.duration}</span>
                  </div>
                  <h3 className="text-lg font-medium mb-2" style={{ fontFamily: "'Cormorant Garamond', serif", color: B.textDark }}>{exp.title}</h3>
                  <p className="text-xs leading-relaxed" style={{ color: "rgba(42,31,45,0.5)", fontFamily: "'Jost', sans-serif" }}>{exp.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ GALLERY — Masonry-like ═══ */}
      <Section id="gallery" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.roseGold, fontFamily: "'Jost', sans-serif" }}>Il Nostro Spazio</p>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Gallery <span style={{ color: B.rose, fontStyle: "italic" }}>Premium</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map((img, i) => {
              const isLarge = i === 0 || i === 5;
              return (
                <motion.div key={i}
                  className={`relative overflow-hidden rounded-[20px] group cursor-pointer ${isLarge ? "col-span-2 row-span-2" : ""}`}
                  style={{ aspectRatio: isLarge ? "1" : "3/4" }}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}>
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" initial={false}>
                    <Badge className="text-[9px] border-0" style={{ background: `${B.rose}90`, color: "#fff" }}>{SERVICES[i]?.name || "Premium"}</Badge>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ WHY US — on cream bg ═══ */}
      <Section className="py-16 sm:py-24 px-4" style={{ background: B.bgBlush, color: B.textDark }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.rose, fontFamily: "'Jost', sans-serif" }}>Perché Sceglierci</p>
            <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              La <span style={{ color: B.rose, fontStyle: "italic" }}>Differenza</span>
            </h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Award, title: "Professionisti Certificati", desc: "Team con formazione continua nelle migliori accademie europee" },
              { icon: Heart, title: "Prodotti Eco-Luxury", desc: "Solo brand certificati vegan, cruelty-free e sostenibili" },
              { icon: Sparkles, title: "Cura Personalizzata", desc: "Consulenza gratuita per ogni trattamento su misura" },
              { icon: Calendar, title: "Prenotazione Istantanea", desc: "Online in pochi click con conferma immediata" },
              { icon: Clock, title: "Orari Flessibili", desc: "Aperti 6 giorni su 7, pausa pranzo inclusa" },
              { icon: CheckCircle, title: "Garanzia Soddisfazione", desc: "Non sei soddisfatta? Rifacciamo il trattamento" },
            ].map((item, i) => (
              <motion.div key={i} className="rounded-[20px] p-6 text-center"
                style={{ background: "#fff", border: `1px solid ${B.rose}12`, boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4, boxShadow: `0 12px 30px -8px ${B.rose}20` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${B.rose}10` }}>
                  <item.icon className="w-5 h-5" style={{ color: B.rose }} />
                </div>
                <h3 className="font-medium text-base mb-1" style={{ fontFamily: "'Cormorant Garamond', serif" }}>{item.title}</h3>
                <p className="text-xs" style={{ color: "rgba(42,31,45,0.5)", fontFamily: "'Jost', sans-serif" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Section id="recensioni" className="py-16 sm:py-24 relative overflow-hidden">
        <AmbientGlow color={B.rose} position="both" />
        <div className="relative z-10">
          <div className="px-4 mb-12">
            <div className="text-center">
              <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.roseGold, fontFamily: "'Jost', sans-serif" }}>Recensioni</p>
              <h2 className="text-3xl sm:text-4xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                Cosa Dicono <span style={{ color: B.rose, fontStyle: "italic" }}>di Noi</span>
              </h2>
            </div>
          </div>
          <ReviewsMarquee accentColor={B.rose} speed={45} reviews={FALLBACK_REVIEWS.map(r => ({
            name: r.name, text: r.text, rating: r.rating, photo: r.photo, city: r.city, accentColor: B.rose,
          }))} />
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      <Section className="py-16 sm:py-24 px-4" style={{ background: B.bgWarm }}>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.roseGold, fontFamily: "'Jost', sans-serif" }}>FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>Domande Frequenti</h2>
          </div>
          <div className="space-y-3">
            {displayFaqs.map((faq: any) => (
              <details key={faq.id} className="group rounded-[16px] p-4 transition-all" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${B.rose}10` }}>
                <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center" style={{ fontFamily: "'Jost', sans-serif", color: B.blush }}>
                  {faq.question || faq.q} <ChevronDown className="w-4 h-4 text-white/20 group-open:rotate-180 transition-transform" />
                </summary>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Jost', sans-serif" }}>{faq.answer || faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ BOOKING FORM ═══ */}
      <Section id="prenota" className="py-16 sm:py-24 px-4 relative overflow-hidden">
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at center, ${B.rose}08, transparent 70%)` }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-[10px] uppercase tracking-[0.35em] font-medium mb-3" style={{ color: B.roseGold, fontFamily: "'Jost', sans-serif" }}>Appuntamento</p>
            <h2 className="text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
              Prenota il tuo <span style={{ color: B.rose, fontStyle: "italic" }}>Trattamento</span>
            </h2>
          </div>
          <div className="rounded-[24px] p-6 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${B.rose}15` }}>
            <div className="space-y-4" style={{ fontFamily: "'Jost', sans-serif" }}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/35 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-xl" placeholder="Il tuo nome" /></div>
                <div><Label className="text-white/35 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-xl" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/35 text-xs">Servizio desiderato</Label><Input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-xl" placeholder="Es: Taglio e piega, colore..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/35 text-xs">Data</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-xl" /></div>
                <div><Label className="text-white/35 text-xs">Orario</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-xl" /></div>
              </div>
              <div><Label className="text-white/35 text-xs">Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[70px] rounded-xl" placeholder="Richieste particolari..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-medium rounded-full text-white shadow-2xl border-0"
                style={{ background: `linear-gradient(135deg, ${B.rose}, ${B.mauve})`, boxShadow: `0 15px 40px -10px ${B.rose}55` }}>
                {submitting ? "Invio..." : "Richiedi Appuntamento"} <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CONTACT ═══ */}
      <Section className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center" style={{ fontFamily: "'Jost', sans-serif" }}>
          {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-5 h-5" style={{ color: B.roseGold }} /><p className="text-sm text-white/40">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
          {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-5 h-5" style={{ color: B.roseGold }} /><a href={`tel:${phone}`} className="text-sm text-white/40 hover:text-white">{phone}</a></div>}
          {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-5 h-5" style={{ color: B.roseGold }} /><a href={`mailto:${company.email}`} className="text-sm text-white/40 hover:text-white">{company.email}</a></div>}
        </div>
      </Section>

      <DemoTestimonialsCarousel sector="beauty" accentColor={B.rose} darkMode={true} bgColor={B.bg} fontDisplay="'Cormorant Garamond', serif" fontBody="'Jost', sans-serif" />
      <DemoPricingSection sector="beauty" accentColor={B.rose} darkMode={true} bgColor={B.bgWarm} />
      <AIAgentsShowcase sector="beauty" />
      <SectorValueProposition sectorKey="beauty" accentColor={B.rose} darkMode={true} sectorLabel="Salone" />
      <AutomationShowcase accentColor={B.rose} accentBg="bg-pink-500" sectorName="saloni e centri estetici" darkMode={true} />

      <DemoRichFooter company={company} accentColor={B.roseGold} darkMode={true} bgColor={B.footer} sectorLabel="BEAUTY & WELLNESS" fontFamily="'Jost', sans-serif" />

      {/* WhatsApp */}
      {phone && (
        <motion.a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background: "#25D366" }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ["0 0 0 0 rgba(37,211,102,0.4)", "0 0 0 15px rgba(37,211,102,0)", "0 0 0 0 rgba(37,211,102,0)"] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.a>
      )}
      <DemoAdminAccessButton sector="beauty" accentColor={B.roseGold} />
    </div>
  );
}
