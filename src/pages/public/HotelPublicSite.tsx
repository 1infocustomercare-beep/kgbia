import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, NeonDivider, PremiumStatsBarLight, FloatingOrbs, ScrollIndicator, PremiumFAQ } from "@/components/public/PremiumSiteKit";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar,
  Bed, Wifi, Coffee, UtensilsCrossed, Waves, Sparkles,
  Users, Award, Heart, MessageCircle, CheckCircle, Tv, Car, ChevronDown, Quote, Menu, X, ChevronLeft, ChevronRight, Shield,
  Gem, Crown, Sun, Mountain, Wine, Bath, Flower2, Plane, Luggage, Globe
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-ncc-hero.mp4";

/* ── HOTEL DESIGN SYSTEM — Emerald + Gold Classico ── */
const H = {
  bg: "#f8f5ef",
  bgDark: "#0e1a12",
  bgDeep: "#071a0d",
  emerald: "#1B5E3B",
  emeraldLight: "#2D8B57",
  gold: "#C8A24D",
  goldLight: "#E0C97A",
  cream: "#FDF8F0",
  ivory: "#FAF3E6",
  textDark: "#1a2420",
  textMuted: "#6b7c72",
  cardBorder: "rgba(27,94,59,0.12)",
  footer: "#0a1210",
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

interface Props { company: any; afterHero?: React.ReactNode; }

const HERO_VIDEO = "https://videos.pexels.com/video-files/9503163/9503163-uhd_2560_1440_24fps.mp4";

const GALLERY = [
  "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const ROOMS = [
  { name: "Camera Superior", price: 149, img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["32 mq", "Vista Giardino", "Balcone Privato"], guests: 2, desc: "Eleganza classica con tessuti pregiati e arredi in legno massello" },
  { name: "Suite Deluxe", price: 249, img: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["55 mq", "Vista Mare", "Jacuzzi"], guests: 2, popular: true, desc: "Spazio generoso con area living e vasca idromassaggio panoramica" },
  { name: "Suite Presidenziale", price: 449, img: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["90 mq", "Panoramica 360°", "Terrazza"], guests: 4, desc: "Il massimo del lusso con terrazza privata e servizio butler dedicato" },
  { name: "Family Suite", price: 329, img: "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["65 mq", "2 Camere", "Area Gioco"], guests: 4, desc: "Due camere comunicanti con spazi pensati per tutta la famiglia" },
];

const AMENITIES = [
  { icon: Bath, label: "SPA & Wellness", desc: "Piscina riscaldata, sauna, bagno turco e trattamenti esclusivi" },
  { icon: UtensilsCrossed, label: "Ristorante Gourmet", desc: "Cucina stellata con ingredienti del territorio a km zero" },
  { icon: Waves, label: "Piscina Infinity", desc: "Piscina panoramica con vista mozzafiato aperta tutto l'anno" },
  { icon: Wine, label: "Wine Bar & Lounge", desc: "Selezione di 200+ etichette con sommelier dedicato" },
  { icon: Mountain, label: "Escursioni Guidate", desc: "Tour personalizzati con guide certificate del territorio" },
  { icon: Car, label: "Transfer Premium", desc: "Servizio navetta di lusso per aeroporto e stazione" },
];

const FALLBACK_REVIEWS = [
  { name: "Marco R.", text: "Un'esperienza indimenticabile. Camera con vista mozzafiato e servizio impeccabile. Torneremo sicuramente.", rating: 5, city: "Milano", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Laura B.", text: "La SPA è un sogno. Personale attento e colazione da 5 stelle. Il miglior hotel in cui sia mai stata.", rating: 5, city: "Roma", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Giovanni V.", text: "Location perfetta, camere eleganti e ristorante con cucina raffinata. Un gioiello da scoprire.", rating: 5, city: "Napoli", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Elena F.", text: "Soggiorno romantico perfetto. La suite con terrazza al tramonto è un ricordo che porteremo per sempre.", rating: 5, city: "Firenze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

const FAQ_ITEMS = [
  { q: "Qual è l'orario del check-in e check-out?", a: "Check-in dalle 14:00, check-out entro le 11:00. Su richiesta offriamo late check-out fino alle 14:00 (soggetto a disponibilità)." },
  { q: "La colazione è inclusa?", a: "Sì, tutti i nostri soggiorni includono una ricca colazione a buffet con prodotti locali e internazionali, servita dalle 7:00 alle 10:30." },
  { q: "Avete un ristorante interno?", a: "Sì, il nostro ristorante gourmet propone cucina del territorio rivisitata. Aperto a pranzo e cena, prenotazione consigliata." },
  { q: "Accettate animali domestici?", a: "Sì, siamo pet-friendly. Cani e gatti di piccola/media taglia sono i benvenuti con supplemento di €20/notte." },
  { q: "Offrite servizio transfer?", a: "Sì, organizziamo transfer privati da/per aeroporto, stazione e porto con auto di lusso. Prenotabile al momento della conferma." },
];

export default function HotelPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const name = company.name || "Grand Hotel";
  const tagline = company.tagline || "Ospitalità d'eccellenza";
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
    const t = setInterval(() => { if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollBy({ left: 360, behavior: "smooth" }); }, 4500);
    return () => clearInterval(t);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.checkin || !form.checkout) { toast.error("Compila tutti i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, email: form.email, source: "website", notes: `Check-in: ${form.checkin}, Check-out: ${form.checkout}, Ospiti: ${form.guests}, Camera: ${form.room}` });
      toast.success("Richiesta inviata! Vi contatteremo a breve.");
      setForm({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const { data: faqs = [] } = useQuery({
    queryKey: ["hotel-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const navLinks = [{ href: "#camere", label: "Camere" }, { href: "#servizi", label: "Servizi" }, { href: "#gallery", label: "Gallery" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];
  const tickerItems = ["Suite Luxury", "SPA & Wellness", "Ristorante Gourmet", "Room Service 24/7", "Piscina Infinity", "Concierge", "Transfer Premium", "Wine Bar"];

  const displayFaqs = (faqs.length > 0 ? faqs : FAQ_ITEMS.map((f, i) => ({ id: `fb-${i}`, question: f.q, answer: f.a }))) as any[];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Playfair Display', serif", background: H.bg, color: H.textDark }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700;800&family=Raleway:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: navScrolled ? `${H.cream}F5` : `${H.cream}CC`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${H.emerald}15` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" style={{ border: `2px solid ${H.emerald}25` }} />}
            <div>
              <span className="text-lg font-bold" style={{ color: H.emerald }}>{name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-semibold" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>LUXURY HOSPITALITY</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-[11px] tracking-[0.18em] uppercase hover:opacity-100 transition font-medium" style={{ color: H.textMuted, fontFamily: "'Raleway', sans-serif" }}>{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button className="px-6 text-xs font-semibold hidden sm:flex rounded-full h-10 border-0 shadow-lg" style={{ background: H.emerald, color: H.cream, fontFamily: "'Raleway', sans-serif" }} onClick={() => scrollTo("prenota")}>
              Prenota Ora
            </Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: H.cream, borderTop: `1px solid ${H.emerald}10` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${H.emerald}10`, fontFamily: "'Raleway', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.45) saturate(1.1)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${H.bgDeep}55 0%, transparent 40%, ${H.bgDeep}88 100%)` }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 50% 80%, ${H.emerald}20 0%, transparent 60%)` }} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center text-white pt-20">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4" fill={H.gold} style={{ color: H.gold }} />)}
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-[10px] uppercase tracking-[0.4em] mb-4" style={{ fontFamily: "'Raleway', sans-serif", color: H.goldLight }}>Benvenuti a</motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-5">
              {name.split("").map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 25, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block", color: i % 5 === 0 ? H.gold : "white" }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-base sm:text-lg opacity-70 mb-10 max-w-md mx-auto" style={{ fontFamily: "'Raleway', sans-serif" }}>{tagline}</motion.p>
            <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="px-10 py-5 text-base rounded-full shadow-2xl border-0 font-semibold"
                style={{ background: H.emerald, color: H.cream, fontFamily: "'Raleway', sans-serif", boxShadow: `0 20px 60px -15px ${H.emerald}66` }}
                onClick={() => scrollTo("prenota")}>
                <Calendar className="w-5 h-5 mr-2" /> Prenota il Soggiorno
              </Button>
              <Button variant="outline" className="px-8 py-5 text-base rounded-full font-medium" style={{ borderColor: `${H.gold}60`, color: H.gold, fontFamily: "'Raleway', sans-serif" }} onClick={() => scrollTo("camere")}>
                Le Nostre Camere
              </Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 right-6 flex items-center gap-2 rounded-full backdrop-blur-xl pl-1 pr-3 py-1 z-20"
          style={{ background: "rgba(10,26,18,0.85)", border: `1px solid ${H.gold}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${H.gold}20` }}>
            <Crown className="w-4 h-4" style={{ color: H.gold }} />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: H.gold }}>Luxury</p>
            <p className="text-[8px] text-white/45 leading-tight mt-0.5">5 Stelle</p>
          </div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {afterHero}

      {/* ═══ TICKER ═══ */}
      <div className="overflow-hidden py-5" style={{ background: H.emerald }}>
        <MarqueeCarousel speed={40} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "'Raleway', sans-serif" }}>
              <span style={{ color: `${H.gold}60` }}>✦</span> {item}
            </span>
          ))
        } />
      </div>

      {/* ═══ STATS ═══ */}
      <Section className="py-16 px-4" style={{ background: H.cream }}>
        <div className="max-w-5xl mx-auto">
          <PremiumStatsBarLight accentColor={H.emerald} textColor={H.textDark} stats={[
            { value: 5000, suffix: "+", label: "Ospiti Soddisfatti" },
            { value: 50, suffix: "+", label: "Camere & Suite" },
            { value: 25, suffix: "+", label: "Anni di Eccellenza" },
            { value: 98, suffix: "%", label: "Tasso di Ritorno" },
          ]} />
        </div>
      </Section>

      {/* ═══ ROOMS — Premium carousel ═══ */}
      <Section id="camere" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>ACCOMODATION</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: H.emerald }}>Le Nostre <span style={{ fontStyle: "italic" }}>Camere</span></h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {ROOMS.map((room, i) => (
                <motion.div key={i} className="flex-shrink-0 w-[280px] sm:w-[340px] snap-start" whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <Card className="overflow-hidden group shadow-lg border-0 relative rounded-[20px]" style={{ background: "#fff" }}>
                    {room.popular && <Badge className="absolute top-3 right-3 z-10 text-[10px] rounded-full border-0 font-semibold" style={{ background: H.gold, color: "#1a1a1a" }}>✦ Più Richiesta</Badge>}
                    <div className="h-52 overflow-hidden rounded-t-[20px]">
                      <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-1" style={{ color: H.emerald }}>{room.name}</h3>
                      <p className="text-xs mb-3" style={{ color: H.textMuted, fontFamily: "'Raleway', sans-serif" }}>{room.desc}</p>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {room.features.map(f => <Badge key={f} variant="outline" className="text-[10px] rounded-full" style={{ borderColor: `${H.emerald}20`, color: H.textMuted, fontFamily: "'Raleway', sans-serif" }}>{f}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs flex items-center gap-1" style={{ color: H.textMuted, fontFamily: "'Raleway', sans-serif" }}><Users className="w-3.5 h-3.5" />{room.guests} ospiti</p>
                        <p className="text-xl font-bold" style={{ color: H.emerald }}>€{room.price}<span className="text-xs font-normal" style={{ color: H.textMuted }}>/notte</span></p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition" style={{ border: `1px solid ${H.emerald}15` }}>
              <ChevronLeft className="w-5 h-5" style={{ color: H.emerald }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition" style={{ border: `1px solid ${H.emerald}15` }}>
              <ChevronRight className="w-5 h-5" style={{ color: H.emerald }} />
            </button>
          </div>
        </div>
      </Section>

      {/* ═══ AMENITIES — Unique grid ═══ */}
      <Section id="servizi" className="py-16 sm:py-24" style={{ background: H.bgDark, color: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>SERVIZI & ESPERIENZE</p>
            <h2 className="text-3xl sm:text-4xl font-bold text-white">Il Nostro <span style={{ color: H.goldLight, fontStyle: "italic" }}>Mondo</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {AMENITIES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-[20px] p-6 group cursor-pointer transition-all"
                style={{ background: "rgba(255,255,255,0.04)", border: `1px solid rgba(255,255,255,0.06)`, backdropFilter: "blur(8px)" }}
                whileHover={{ y: -4, borderColor: `${H.gold}40` }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mb-4" style={{ background: `${H.emerald}30` }}>
                  <Icon className="w-5 h-5" style={{ color: H.goldLight }} />
                </div>
                <h3 className="font-semibold text-base mb-2 text-white">{label}</h3>
                <p className="text-xs text-white/40 leading-relaxed" style={{ fontFamily: "'Raleway', sans-serif" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ GALLERY — Masonry ═══ */}
      <Section id="gallery" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>LA STRUTTURA</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: H.emerald }}>Gallery <span style={{ fontStyle: "italic" }}>Premium</span></h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map((img, i) => {
              const isLarge = i === 0 || i === 3;
              return (
                <motion.div key={i} className={`relative overflow-hidden rounded-[16px] group cursor-pointer ${isLarge ? "col-span-2 row-span-2" : ""}`}
                  style={{ aspectRatio: isLarge ? "1" : "3/4" }}
                  initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.6 }}
                  whileHover={{ scale: 1.02 }}>
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ REVIEWS ═══ */}
      <Section id="recensioni" className="py-16 sm:py-24" style={{ background: H.ivory }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>RECENSIONI</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: H.emerald }}>Cosa Dicono i Nostri <span style={{ fontStyle: "italic" }}>Ospiti</span></h2>
          </div>
          <div className="rounded-[24px] p-8 bg-white shadow-lg mb-8 relative overflow-hidden" style={{ border: `1px solid ${H.emerald}10` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${H.emerald}30` }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: H.emerald }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex items-center gap-2">
                      <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={H.gold} style={{ color: H.gold }} />)}</div>
                      <span className="text-xs" style={{ color: H.textMuted }}>{FALLBACK_REVIEWS[reviewIndex].city}</span>
                    </div>
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${H.emerald}15` }} />
                <p className="text-lg italic leading-relaxed" style={{ color: "#555" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2.5 h-2.5 rounded-full transition-all" style={{ background: i === reviewIndex ? H.emerald : "#ddd", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      <Section className="py-16 sm:py-24 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.35em] mb-2 font-medium" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>FAQ</p>
            <h2 className="text-2xl sm:text-3xl font-bold" style={{ color: H.emerald }}>Domande Frequenti</h2>
          </div>
          <div className="space-y-3">
            {displayFaqs.map((faq: any) => (
              <details key={faq.id} className="group rounded-[16px] p-4 bg-white shadow-sm transition-all" style={{ border: `1px solid ${H.emerald}08` }}>
                <summary className="font-medium text-sm cursor-pointer list-none flex justify-between items-center" style={{ fontFamily: "'Raleway', sans-serif", color: H.emerald }}>
                  {faq.question || faq.q} <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" style={{ color: H.textMuted }} />
                </summary>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: H.textMuted, fontFamily: "'Raleway', sans-serif" }}>{faq.answer || faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ BOOKING ═══ */}
      <Section id="prenota" className="py-16 sm:py-24 relative overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.15) saturate(0.8)" }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${H.bgDeep}88, ${H.bgDeep}cc)` }} />
        <div className="relative z-10 max-w-2xl mx-auto px-5">
          <div className="text-center mb-8 text-white">
            <Calendar className="w-7 h-7 mx-auto mb-3" style={{ color: H.gold }} />
            <h2 className="text-3xl sm:text-4xl font-bold">Prenota il <span style={{ color: H.goldLight, fontStyle: "italic" }}>Soggiorno</span></h2>
            <p className="text-sm mt-2 opacity-50" style={{ fontFamily: "'Raleway', sans-serif" }}>Compilate il modulo e vi risponderemo entro 2 ore</p>
          </div>
          <Card className="p-6 backdrop-blur-xl border-0 shadow-2xl rounded-[24px]" style={{ background: "rgba(14,26,18,0.9)", border: `1px solid ${H.emerald}30` }}>
            <div className="grid sm:grid-cols-2 gap-3" style={{ fontFamily: "'Raleway', sans-serif" }}>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: H.gold }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent border-white/15 text-white h-10 rounded-xl" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: H.gold }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-white/15 text-white h-10 rounded-xl" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: H.gold }}>Email</label><Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="bg-transparent border-white/15 text-white h-10 rounded-xl" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: H.gold }}>Camera</label><Input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="Es: Suite Deluxe" className="bg-transparent border-white/15 text-white h-10 rounded-xl" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: H.gold }}>Check-in *</label><Input type="date" value={form.checkin} onChange={e => setForm({ ...form, checkin: e.target.value })} className="bg-transparent border-white/15 text-white h-10 rounded-xl" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: H.gold }}>Check-out *</label><Input type="date" value={form.checkout} onChange={e => setForm({ ...form, checkout: e.target.value })} className="bg-transparent border-white/15 text-white h-10 rounded-xl" /></div>
            </div>
            <Button onClick={handleBooking} disabled={submitting} className="w-full mt-5 py-5 text-base font-semibold rounded-full shadow-2xl border-0"
              style={{ background: H.emerald, color: H.cream, boxShadow: `0 15px 40px -10px ${H.emerald}55` }}>
              {submitting ? "Invio..." : "Richiedi Disponibilità"} <Calendar className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </Section>

      <AIAgentsShowcase sector="hotel" />
      <SectorValueProposition sectorKey="hotel" accentColor={H.emerald} darkMode={true} sectorLabel="Hotel" />
      <AutomationShowcase accentColor={H.emerald} accentBg="bg-emerald-700" sectorName="hotel e hospitality" darkMode={true} />

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 border-t" style={{ borderColor: `${H.emerald}15`, background: H.footer }}>
        <div className="max-w-6xl mx-auto px-5">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
            <div className="flex items-center gap-3">
              {company.logo_url && <img src={company.logo_url} alt="" className="h-8 w-8 rounded-full object-cover" />}
              <div>
                <p className="font-bold text-white/80 text-sm">{name}</p>
                <p className="text-[8px] tracking-[0.2em] uppercase" style={{ color: H.gold, fontFamily: "'Raleway', sans-serif" }}>LUXURY HOSPITALITY</p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-4 text-xs text-white/30" style={{ fontFamily: "'Raleway', sans-serif" }}>
              {company.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.address}</span>}
              {phone && <a href={`tel:${phone}`} className="flex items-center gap-1 hover:text-white/60"><Phone className="w-3 h-3" />{phone}</a>}
              {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-1 hover:text-white/60"><Mail className="w-3 h-3" />{company.email}</a>}
            </div>
            <p className="text-[10px] text-white/10" style={{ fontFamily: "'Raleway', sans-serif" }}>© {new Date().getFullYear()} {name} · Powered by Empire.AI</p>
          </div>
        </div>
      </footer>

      {/* WhatsApp */}
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
