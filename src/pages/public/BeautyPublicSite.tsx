import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Scissors, Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Sparkles, CheckCircle, Send, ChevronDown, Instagram,
  Users, Award, Quote, ArrowRight, MessageCircle, Menu, X, ChevronLeft, ChevronRight
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";

const PINK = "#D4618C";
const DARK = "#0f0812";
const PINK_LIGHT = "#f5d5e0";

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

/* Animated Counter */
function AnimatedNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / dur, 1); setDisplay(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* Premium Badge */
const premiumImages = [
  { src: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Hair Styling" },
  { src: "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Colorazione Premium" },
  { src: "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=200", label: "SPA & Wellness" },
  { src: "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Trattamenti Viso" },
];

function PremiumBadge() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % premiumImages.length), 3500); return () => clearInterval(t); }, []);
  const img = premiumImages[idx];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5 }}
      className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-4 z-20">
      <div className="flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5"
        style={{ background: "rgba(10,10,10,0.8)", border: `1px solid ${PINK}40`, boxShadow: `0 8px 32px rgba(0,0,0,0.5)` }}>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: `1.5px solid ${PINK}50` }}>
          <AnimatePresence mode="wait">
            <motion.img key={idx} src={img.src} alt={img.label} className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
          </AnimatePresence>
        </div>
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: PINK }}>Premium</p>
          <p className="text-[8px] text-white/45 truncate leading-tight mt-0.5">{img.label}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface Props { company: any; }

const HERO_VIDEO = "https://videos.pexels.com/video-files/4620536/4620536-uhd_2560_1440_25fps.mp4";
const GALLERY = [
  "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const FALLBACK_REVIEWS = [
  { name: "Giulia R.", text: "Ambiente raffinato e professionalità incredibile. Non cambierei mai!", rating: 5, city: "Milano", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Sara M.", text: "Il balayage più bello che abbia mai fatto. Risultato naturale e luminoso.", rating: 5, city: "Roma", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Valentina P.", text: "Massaggio rilassante fantastico, mi sono sentita in un'altra dimensione.", rating: 5, city: "Napoli", photo: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop&crop=face" },
  { name: "Chiara L.", text: "Manicure perfetta, prodotti top e un ambiente che ti fa sentire una regina.", rating: 5, city: "Firenze", photo: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop&crop=face" },
  { name: "Francesca B.", text: "Trattamento viso anti-age incredibile. La mia pelle non è mai stata così luminosa!", rating: 5, city: "Torino", photo: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face" },
];

export default function BeautyPublicSite({ company }: Props) {
  const companyId = company.id;
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const onScroll = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const t = setInterval(() => setReviewIndex(p => (p + 1) % FALLBACK_REVIEWS.length), 5000); return () => clearInterval(t); }, []);

  // Auto-scroll services carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: 320, behavior: "smooth" });
    }, 4000);
    return () => clearInterval(timer);
  }, []);

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
  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#gallery", label: "Gallery" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];

  const services = [
    { name: "Taglio & Styling", icon: "✂️", desc: "Consulenza personalizzata e styling su misura", img: GALLERY[0] },
    { name: "Colorazione", icon: "🎨", desc: "Balayage, meches, toni naturali e vibranti", img: GALLERY[1] },
    { name: "Trattamenti Viso", icon: "✨", desc: "Pulizia profonda, peeling e anti-age", img: GALLERY[2] },
    { name: "Manicure & Pedicure", icon: "💅", desc: "Gel, semipermanente e nail art", img: GALLERY[3] },
    { name: "Massaggi & SPA", icon: "💆", desc: "Rilassanti, decontratturanti, hot stone", img: GALLERY[4] },
    { name: "Depilazione Laser", icon: "🌸", desc: "Tecnologia avanzata, risultati duraturi", img: GALLERY[5] },
  ];

  const tickerItems = ["Hair Styling", "Colorazione", "Trattamenti Viso", "Manicure", "Pedicure", "Massaggi", "SPA", "Depilazione Laser", "Nail Art", "Extension Ciglia", "Microblading", "Trucco Sposa"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: DARK, color: "#fff", fontFamily: "'Playfair Display', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`}
        style={{ background: DARK, borderBottom: `1px solid ${PINK}30` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url ? <motion.img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" whileHover={{ scale: 1.1 }} /> :
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${PINK}20` }}><Sparkles className="w-5 h-5" style={{ color: PINK }} /></div>}
            <div className="min-w-0">
              <span className="font-bold text-base tracking-tight truncate block" style={{ color: PINK }}>{company.name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold text-white/50">BEAUTY & WELLNESS</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-[13px] text-white/50 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" variant="outline" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-5 hover:scale-105 transition-transform" style={{ borderColor: PINK, color: PINK, background: "transparent", fontFamily: "'Inter', sans-serif" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> CHIAMA ORA</a>
            </Button>}
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: DARK, borderTop: `1px solid ${PINK}20` }}>
              <div className="px-5 py-5 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 hover:text-white border-b" style={{ borderColor: `${PINK}10` }}>{l.label}</a>)}
                {phone && <a href={`tel:${phone}`} className="flex items-center gap-2 py-3 text-sm font-semibold" style={{ color: PINK }}><Phone className="w-4 h-4" /> {phone}</a>}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO — video bg ═══ */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
        <HeroVideoBackground
          primarySrc={HERO_VIDEO}
          fallbackSrc={fallbackHeroVideo}
          poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52) saturate(1.08)" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${DARK}88 0%, ${DARK}66 40%, ${DARK}99 100%)` }} />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle, ${PINK}80 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 px-4">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
                style={{ background: `${PINK}15`, border: `1px solid ${PINK}30`, color: PINK, fontFamily: "'Inter', sans-serif" }}>
                <Sparkles className="w-4 h-4" /> Beauty & Wellness Premium
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-[1.05] mb-6">
                <span style={{ background: `linear-gradient(135deg, #fff, ${PINK_LIGHT}, #e8a5c0)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                  {company.tagline || "La tua bellezza, la nostra arte"}
                </span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
                Scopri <strong style={{ color: "rgba(255,255,255,0.8)" }}>{company.name}</strong>. Trattamenti esclusivi, prodotti premium e uno staff dedicato alla tua bellezza.
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="rounded-xl px-10 h-14 text-base font-semibold text-white shadow-2xl" style={{ background: PINK, boxShadow: `0 20px 60px -15px ${PINK}55`, fontFamily: "'Inter', sans-serif" }} onClick={() => scrollTo("prenota")}>
                  <Calendar className="w-5 h-5 mr-2" /> Prenota Appuntamento
                </Button>
                {phone && <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-white hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", fontFamily: "'Inter', sans-serif" }} asChild>
                  <a href={`tel:${phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama</a>
                </Button>}
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero image with Premium Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]" style={{ border: `1px solid ${PINK}20` }}>
              <img src={GALLERY[0]} alt="" className="w-full h-full object-cover" />
            </div>
            <PremiumBadge />
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ═══ TICKER ═══ */}
      <div className="overflow-hidden py-4" style={{ background: "#111" }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1200] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "'Inter', sans-serif" }}>
              <Sparkles className="w-3 h-3" style={{ color: `${PINK}60` }} /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══ STATS ═══ */}
      <Section className="py-16 sm:py-20 px-4" style={{ background: "#111" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            {[
              { value: 2500, suffix: "+", label: "Clienti Soddisfatte" },
              { value: 15, suffix: "+", label: "Anni di Esperienza" },
              { value: 98, suffix: "%", label: "Tasso di Ritorno" },
              { value: 50, suffix: "+", label: "Trattamenti Premium" },
            ].map((stat, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-3xl sm:text-4xl font-bold" style={{ color: PINK }}><AnimatedNum value={stat.value} suffix={stat.suffix} /></p>
                <p className="text-[11px] uppercase tracking-[0.15em] mt-2 text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ SERVICES — auto-scrolling carousel ═══ */}
      <Section id="servizi" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: PINK, fontFamily: "'Inter', sans-serif" }}>I Nostri Servizi</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Trattamenti Esclusivi</h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {services.map((s, i) => (
                <motion.div key={i} className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-[280px] sm:w-[320px] snap-start cursor-pointer"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f0812] via-transparent to-transparent" />
                    <span className="absolute top-3 left-3 text-2xl">{s.icon}</span>
                    <Badge className="absolute top-3 right-3 text-[9px]" style={{ background: `${PINK}25`, color: PINK, border: `1px solid ${PINK}40` }}>Premium</Badge>
                  </div>
                  <div className="p-5">
                    <h3 className="font-semibold text-base mb-1">{s.name}</h3>
                    <p className="text-sm text-white/40" style={{ fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl z-10 hover:scale-110 transition" style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${PINK}30` }}>
              <ChevronLeft className="w-5 h-5" style={{ color: PINK }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl z-10 hover:scale-110 transition" style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${PINK}30` }}>
              <ChevronRight className="w-5 h-5" style={{ color: PINK }} />
            </button>
          </div>
        </div>
      </Section>

      {/* ═══ GALLERY with hover zoom ═══ */}
      <Section id="gallery" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: PINK, fontFamily: "'Inter', sans-serif" }}>Il Nostro Spazio</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <motion.div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" initial={false}>
                  <Badge className="text-[9px]" style={{ background: `${PINK}90`, color: "#fff" }}>{services[i]?.name || "Premium"}</Badge>
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ WHY US ═══ */}
      <Section className="py-16 sm:py-24 px-4" style={{ background: `linear-gradient(180deg, ${DARK} 0%, #1a1018 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: PINK, fontFamily: "'Inter', sans-serif" }}>Perché Noi</p>
            <h2 className="text-3xl sm:text-4xl font-bold">La Differenza</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Award, title: "Professionisti Certificati", desc: "Team con anni di esperienza e formazione continua" },
              { icon: Sparkles, title: "Prodotti Premium", desc: "Solo brand di alta qualità e cruelty-free" },
              { icon: Heart, title: "Cura Personalizzata", desc: "Ogni trattamento studiato per te" },
              { icon: Calendar, title: "Prenotazione Facile", desc: "Online in pochi click, conferma immediata" },
              { icon: Clock, title: "Orari Flessibili", desc: "Aperti 6 giorni su 7, anche pausa pranzo" },
              { icon: CheckCircle, title: "Soddisfazione Garantita", desc: "Non sei soddisfatta? Ti rifacciamo il trattamento" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl hover:border-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                whileHover={{ y: -3 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${PINK}15` }}>
                  <item.icon className="w-5 h-5" style={{ color: PINK }} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-white/40" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ TESTIMONIALS — auto-carousel ═══ */}
      <Section id="recensioni" className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: PINK, fontFamily: "'Inter', sans-serif" }}>Recensioni</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Cosa Dicono di Noi</h2>
          </div>

          {/* Featured review — auto-cycling */}
          <div className="mb-10 rounded-2xl p-8 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${PINK}15` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${PINK}40` }} />
                  <div>
                    <p className="font-semibold text-base">{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <p className="text-xs text-white/40" style={{ fontFamily: "'Inter', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].city}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-4 h-4" fill={PINK} style={{ color: PINK }} />)}
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${PINK}25` }} />
                <p className="text-lg italic leading-relaxed text-white/60" style={{ fontFamily: "'Inter', sans-serif" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            {/* Progress dots */}
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? PINK : "rgba(255,255,255,0.15)", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>

          {/* Mini review cards */}
          <div className="grid sm:grid-cols-3 gap-4">
            {FALLBACK_REVIEWS.slice(0, 3).map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={PINK} style={{ color: PINK }} />)}</div>
                <p className="text-sm mb-4 leading-relaxed text-white/50" style={{ fontFamily: "'Inter', sans-serif" }}>"{t.text}"</p>
                <div className="flex items-center gap-2">
                  <img src={t.photo} alt="" className="w-7 h-7 rounded-full object-cover" />
                  <p className="text-sm font-semibold">— {t.name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      {faqs.length > 0 && (
        <Section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <details key={faq.id} className="group rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {faq.question} <ChevronDown className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-sm mt-3 leading-relaxed text-white/40" style={{ fontFamily: "'Inter', sans-serif" }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ BOOKING FORM ═══ */}
      <Section id="prenota" className="py-16 sm:py-24 px-4 relative">
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: `linear-gradient(to top, ${PINK}10, transparent)` }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: PINK, fontFamily: "'Inter', sans-serif" }}>Appuntamento</p>
            <h2 className="text-3xl font-bold">Prenota il tuo Trattamento</h2>
          </div>
          <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${PINK}20` }}>
            <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Il tuo nome" /></div>
                <div><Label className="text-white/40 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Servizio desiderato</Label><Input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Es: Taglio e piega, colore..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Data</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" /></div>
                <div><Label className="text-white/40 text-xs">Orario</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[70px]" placeholder="Richieste..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-semibold rounded-xl text-white shadow-2xl" style={{ background: PINK, boxShadow: `0 15px 40px -10px ${PINK}55` }}>
                {submitting ? "Invio..." : "Richiedi Appuntamento"} <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CONTACT ═══ */}
      <Section className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
          {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-5 h-5" style={{ color: PINK }} /><p className="text-sm text-white/50">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
          {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-5 h-5" style={{ color: PINK }} /><a href={`tel:${phone}`} className="text-sm text-white/50 hover:text-white">{phone}</a></div>}
          {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-5 h-5" style={{ color: PINK }} /><a href={`mailto:${company.email}`} className="text-sm text-white/50 hover:text-white">{company.email}</a></div>}
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)", background: "#050505" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <Sparkles className="w-5 h-5" style={{ color: PINK }} />}
            <span className="font-semibold text-white/80 text-sm">{company.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener" className="text-white/30 hover:text-white/70"><Instagram className="w-5 h-5" /></a>}
          </div>
          <p className="text-[10px] text-white/15">Powered by Empire.AI</p>
        </div>
      </footer>

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
    </div>
  );
}
