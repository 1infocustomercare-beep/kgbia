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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Umbrella, Star, Phone, Mail, MapPin, Clock, Calendar,
  Sun, Waves, CheckCircle, Send, ChevronDown,
  Users, CreditCard, Coffee, MessageCircle, Quote, Menu, X, ChevronLeft, ChevronRight, Sparkles, Award
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-ncc-hero.mp4";

const CYAN = "#00BCD4";
const DARK = "#071018";

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
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
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

interface Props { company: any; }

const HERO_VIDEO = "https://videos.pexels.com/video-files/1409899/1409899-uhd_2560_1440_25fps.mp4";
const GALLERY = [
  "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1021073/pexels-photo-1021073.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1456291/pexels-photo-1456291.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const FALLBACK_REVIEWS = [
  { name: "Paolo R.", text: "La spiaggia più bella della costa. Servizio impeccabile e posizione da sogno.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Maria L.", text: "Ombrelloni distanziati, lettini comodi e personale gentilissimo. Paradiso!", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Andrea G.", text: "Servizio bar al posto eccellente. Area bambini perfetta per le famiglie.", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
];

export default function BeachPublicSite({ company }: Props) {
  const companyId = company.id;
  const phone = company.phone;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const t = setInterval(() => setReviewIndex(p => (p + 1) % FALLBACK_REVIEWS.length), 5000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const t = setInterval(() => { if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollBy({ left: 320, behavior: "smooth" }); }, 4000);
    return () => clearInterval(t);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const [form, setForm] = useState({ name: "", phone: "", date: "", period: "full_day", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: spots = [] } = useQuery({
    queryKey: ["beach-pub-spots", companyId],
    queryFn: async () => { const { data } = await supabase.from("beach_spots").select("*").eq("company_id", companyId).eq("is_active", true); return data || []; },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["beach-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const totalSpots = spots.length;
  const rows = new Set(spots.map((s: any) => s.row_letter)).size;
  const minPrice = spots.length > 0 ? Math.min(...spots.filter((s: any) => s.price_daily > 0).map((s: any) => s.price_daily)) : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date) { toast.error("Compila nome, telefono e data"); return; }
    setSubmitting(true);
    await supabase.from("beach_bookings").insert({ company_id: companyId, client_name: form.name, client_phone: form.phone, booking_date: form.date, period: form.period });
    setSubmitting(false);
    toast.success("Prenotazione inviata!");
    setForm({ name: "", phone: "", date: "", period: "full_day", notes: "" });
  };

  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#gallery", label: "Gallery" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];
  const tickerItems = ["Ombrelloni Premium", "Prima Fila Mare", "Bar al Posto", "Piscina", "WiFi Free", "Area Bambini", "Aperitivi al Tramonto", "Ristorante", "Lettini Luxury"];

  const services = [
    { emoji: "🏖️", name: "Ombrelloni Premium", desc: "Prima fila fronte mare con lettini luxury", img: GALLERY[0] },
    { emoji: "🍹", name: "Bar & Ristorante", desc: "Servizio al posto con cucina mediterranea", img: GALLERY[1] },
    { emoji: "🏊", name: "Area Piscina", desc: "Piscina con acqua di mare riscaldata", img: GALLERY[2] },
    { emoji: "👶", name: "Area Bambini", desc: "Parco giochi e animazione", img: GALLERY[3] },
    { emoji: "🚿", name: "Docce & Spogliatoi", desc: "Spogliatoi con docce calde gratuite", img: GALLERY[4] },
    { emoji: "📶", name: "WiFi Gratuito", desc: "Connessione veloce in tutta la spiaggia", img: GALLERY[5] },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: DARK, color: "#fff" }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: `${DARK}DD`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${CYAN}15` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <Umbrella className="w-6 h-6" style={{ color: CYAN }} />}
            <div>
              <span className="font-bold text-sm truncate block">{company.name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold text-white/40">BEACH PREMIUM</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase text-white/40">
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-white transition">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-xl text-xs font-semibold text-white hidden sm:flex" style={{ background: CYAN }} onClick={() => scrollTo("prenota")}>Prenota Posto</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: DARK, borderTop: `1px solid ${CYAN}15` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground
          primarySrc={HERO_VIDEO}
          fallbackSrc={fallbackHeroVideo}
          poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.55) saturate(1.04)" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${DARK}66 0%, ${DARK}88 60%, ${DARK}AA 100%)` }} />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle, ${CYAN}60 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        <motion.div className="relative z-10 max-w-3xl mx-auto px-5 text-center pt-20" style={{ y: heroY }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: `${CYAN}12`, border: `1px solid ${CYAN}25`, color: CYAN }}>
              <Waves className="w-4 h-4" /> Stabilimento Balneare Premium
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
              <span style={{ background: `linear-gradient(135deg, #fff, #b2ebf2, #80deea)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {company.tagline || "Il tuo angolo di paradiso"}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base text-white/45 mb-8 max-w-xl mx-auto">
              Benvenuto a <strong className="text-white/75">{company.name}</strong>. Spiaggia privata, servizio premium e relax totale.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Button size="lg" className="rounded-xl px-10 h-14 text-base font-bold text-white shadow-2xl" style={{ background: CYAN, boxShadow: `0 20px 60px -15px ${CYAN}55` }} onClick={() => scrollTo("prenota")}>
                <Umbrella className="w-5 h-5 mr-2" /> Prenota Ombrellone
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Premium Badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 right-6 flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5 z-20"
          style={{ background: "rgba(10,10,10,0.8)", border: `1px solid ${CYAN}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${CYAN}20` }}>
            <Sun className="w-4 h-4" style={{ color: CYAN }} />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: CYAN }}>Premium</p>
            <p className="text-[8px] text-white/45 leading-tight mt-0.5">Fronte Mare</p>
          </div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden py-4" style={{ background: "#0d1e2d" }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium text-white/25">
              <Waves className="w-3 h-3" style={{ color: `${CYAN}50` }} /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* STATS */}
      <Section className="py-16 px-4" style={{ background: "#0d1e2d" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { value: totalSpots || 120, suffix: "+", label: "Postazioni" },
            { value: rows || 8, suffix: "", label: "File" },
            { value: minPrice || 25, suffix: "€", label: "Da / Giorno" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: CYAN }}><AnimatedNum value={s.value} suffix={s.suffix} /></p>
              <p className="text-[10px] uppercase tracking-widest text-white/25 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES — auto-carousel */}
      <Section id="servizi" className="py-16 sm:py-24 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: CYAN }}>I Nostri Servizi</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Tutto per la Giornata Perfetta</h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {services.map((s, i) => (
                <motion.div key={i} className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-[280px] sm:w-[310px] snap-start"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <div className="h-44 overflow-hidden relative">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />
                    <Badge className="absolute top-3 right-3 text-[9px]" style={{ background: `${CYAN}25`, color: CYAN, border: `1px solid ${CYAN}40` }}>Premium</Badge>
                  </div>
                  <div className="p-5">
                    <span className="text-2xl mb-2 block">{s.emoji}</span>
                    <h3 className="font-bold text-sm mb-1">{s.name}</h3>
                    <p className="text-xs text-white/35">{s.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hover:scale-110 transition" style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${CYAN}30` }}>
              <ChevronLeft className="w-5 h-5" style={{ color: CYAN }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hover:scale-110 transition" style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${CYAN}30` }}>
              <ChevronRight className="w-5 h-5" style={{ color: CYAN }} />
            </button>
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">La Nostra Spiaggia</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-[4/3] group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* WHY US */}
      <Section className="py-16 px-4" style={{ background: `linear-gradient(180deg, ${DARK} 0%, #0d1e2d 100%)` }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Perché Scegliere Noi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Sun, title: "Posizione Privilegiata", desc: "Sabbia fine e acqua cristallina" },
              { icon: Umbrella, title: "Comfort Premium", desc: "Lettini di alta qualità, distanziati" },
              { icon: Coffee, title: "Servizio al Posto", desc: "Ordina cibo e bevande dall'ombrellone" },
              { icon: CreditCard, title: "Abbonamenti", desc: "Tariffe agevolate settimanali e mensili" },
              { icon: Calendar, title: "Prenota Online", desc: "Scegli il posto in pochi click" },
              { icon: CheckCircle, title: "Posto Garantito", desc: "Il tuo ombrellone ti aspetta ogni mattina" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
                whileHover={{ y: -3 }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${CYAN}12` }}>
                  <item.icon className="w-5 h-5" style={{ color: CYAN }} />
                </div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-white/35">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS — auto-carousel */}
      <Section id="recensioni" className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: CYAN }}>Recensioni</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Cosa Dicono i Nostri Ospiti</h2>
          </div>
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: `1px solid ${CYAN}15` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${CYAN}40` }} />
                  <div>
                    <p className="font-bold text-base">{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={CYAN} style={{ color: CYAN }} />)}</div>
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${CYAN}25` }} />
                <p className="text-lg italic leading-relaxed text-white/60">"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? CYAN : "rgba(255,255,255,0.15)", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <details key={faq.id} className="group rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between">
                    {faq.question} <ChevronDown className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-sm mt-3 text-white/40">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* BOOKING */}
      <Section id="prenota" className="py-16 sm:py-24 px-4 relative">
        <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ background: `linear-gradient(to top, ${CYAN}10, transparent)` }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: CYAN }}>Prenotazione</p>
            <h2 className="text-3xl font-bold">Prenota il tuo Posto</h2>
          </div>
          <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${CYAN}18` }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Il tuo nome" /></div>
                <div><Label className="text-white/40 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Data *</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" /></div>
              <div><Label className="text-white/40 text-xs">Periodo</Label>
                <Select value={form.period} onValueChange={v => setForm(p => ({ ...p, period: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">☀️ Mattina (08-13)</SelectItem>
                    <SelectItem value="afternoon">🌅 Pomeriggio (13-19)</SelectItem>
                    <SelectItem value="full_day">🏖️ Giornata Intera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-white/40 text-xs">Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[70px]" placeholder="Prima fila, lettino extra..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-bold rounded-xl text-white shadow-2xl" style={{ background: CYAN, boxShadow: `0 15px 40px -10px ${CYAN}55` }}>
                {submitting ? "Invio..." : "Prenota Posto"} <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      <AutomationShowcase accentColor={CYAN} accentBg="bg-cyan-500" sectorName="stabilimenti balneari" darkMode={true} />

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)", background: "#050a12" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <Umbrella className="w-5 h-5" style={{ color: CYAN }} />}
            <span className="font-semibold text-white/70 text-sm">{company.name}</span>
          </div>
          <div className="flex gap-4 text-xs text-white/25">
            {phone && <a href={`tel:${phone}`}><Phone className="w-3 h-3 inline mr-1" />{phone}</a>}
            {company.email && <a href={`mailto:${company.email}`}><Mail className="w-3 h-3 inline mr-1" />{company.email}</a>}
          </div>
          <p className="text-[10px] text-white/10">Powered by Empire.AI</p>
        </div>
      </footer>

      {phone && (
        <motion.a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ["0 0 0 0 rgba(37,211,102,0.4)", "0 0 0 15px rgba(37,211,102,0)", "0 0 0 0 rgba(37,211,102,0)"] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.a>
      )}
    </div>
  );
}
