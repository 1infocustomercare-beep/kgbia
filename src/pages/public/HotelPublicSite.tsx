import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { MarqueeCarousel, NeonDivider, PremiumStatsBarLight, FloatingOrbs, ScrollIndicator } from "@/components/public/PremiumSiteKit";
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
  Users, Award, Heart, MessageCircle, CheckCircle, Tv, Car, ChevronDown, Quote, Menu, X, ChevronLeft, ChevronRight, Shield
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-ncc-hero.mp4";

const BORDEAUX = "#6B2D3E";
const GOLD = "#C8A951";
const CREAM = "#FDF8F0";

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

const HERO_VIDEO = "https://videos.pexels.com/video-files/9503163/9503163-uhd_2560_1440_24fps.mp4";
const GALLERY = [
  "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const FALLBACK_REVIEWS = [
  { name: "Marco R.", text: "Un'esperienza indimenticabile. Camera con vista mozzafiato e servizio impeccabile.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Laura B.", text: "La SPA è un sogno. Personale attento e colazione da 5 stelle. Torneremo sicuramente!", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Giovanni V.", text: "Location perfetta, camere eleganti e ristorante con cucina raffinata. Top!", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
];

export default function HotelPublicSite({ company }: Props) {
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
      toast.success("Richiesta inviata!");
      setForm({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const navLinks = [{ href: "#camere", label: "Camere" }, { href: "#servizi", label: "Servizi" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];
  const tickerItems = ["Suite Luxury", "SPA & Wellness", "Ristorante Gourmet", "Room Service 24/7", "Piscina", "Concierge", "Transfer", "Wi-Fi Premium"];

  const rooms = [
    { name: "Camera Superior", price: 149, img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["32 mq", "Vista Giardino", "Balcone"], guests: 2 },
    { name: "Suite Deluxe", price: 249, img: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["55 mq", "Vista Mare", "Jacuzzi"], guests: 2, popular: true },
    { name: "Suite Presidenziale", price: 449, img: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["90 mq", "Panoramica", "Terrazza"], guests: 4 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Libre Baskerville', serif", background: CREAM, color: "#2a1f2d" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: navScrolled ? `${CREAM}F5` : `${CREAM}CC`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${GOLD}25` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <div>
              <span className="text-lg font-bold" style={{ color: BORDEAUX }}>{name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold" style={{ color: GOLD, fontFamily: "'Lato', sans-serif" }}>LUXURY HOSPITALITY</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-xs tracking-[0.15em] uppercase hover:opacity-100 transition" style={{ color: "#888", fontFamily: "'Lato', sans-serif" }}>{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button className="px-5 text-sm font-semibold hidden sm:flex rounded-full" style={{ background: BORDEAUX, color: CREAM, fontFamily: "'Lato', sans-serif" }} onClick={() => scrollTo("prenota")}>Prenota</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: CREAM, borderTop: `1px solid ${GOLD}15` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${GOLD}15` }}>{l.label}</a>)}
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
          style={{ filter: "brightness(0.52) saturate(1.04)" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${BORDEAUX}33 0%, #00000066 100%)` }} />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle, ${GOLD}60 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center text-white pt-20">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4" fill={GOLD} style={{ color: GOLD }} />)}
            </motion.div>
            <motion.p variants={fadeUp} custom={1} className="text-[10px] uppercase tracking-[0.35em] mb-3 opacity-60" style={{ fontFamily: "'Lato', sans-serif", color: GOLD }}>Benvenuti a</motion.p>
            <motion.h1 variants={fadeUp} custom={2} className="text-4xl sm:text-6xl lg:text-7xl font-bold italic mb-5">
              {name.split("").map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 25, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.6 + i * 0.04, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block", color: i % 4 === 0 ? GOLD : "white" }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-base sm:text-lg opacity-70 mb-8" style={{ fontFamily: "'Lato', sans-serif" }}>{tagline}</motion.p>
            <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="px-8 py-5 text-base rounded-xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${GOLD}, #A88B30)`, color: "#1a1a1a", fontFamily: "'Lato', sans-serif", boxShadow: `0 20px 60px -15px ${GOLD}55` }} onClick={() => scrollTo("prenota")}>Prenota il Soggiorno</Button>
              <Button variant="outline" className="px-8 py-5 text-base rounded-xl" style={{ borderColor: GOLD, color: GOLD, fontFamily: "'Lato', sans-serif" }} onClick={() => scrollTo("camere")}>Le Nostre Camere</Button>
            </motion.div>
          </motion.div>
        </div>

        {/* Premium Badge */}
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
          className="absolute bottom-8 right-6 flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5 z-20"
          style={{ background: "rgba(10,10,10,0.8)", border: `1px solid ${GOLD}40`, boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
          <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${GOLD}20` }}>
            <Award className="w-4 h-4" style={{ color: GOLD }} />
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: GOLD }}>Luxury</p>
            <p className="text-[8px] text-white/45 leading-tight mt-0.5">5 Stelle</p>
          </div>
        </motion.div>

        <ScrollIndicator />
      </section>

      {/* TICKER — Premium Marquee */}
      <div className="overflow-hidden py-5" style={{ background: BORDEAUX }}>
        <MarqueeCarousel speed={40} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap text-white/30" style={{ fontFamily: "'Lato', sans-serif" }}>
              <Sparkles className="w-3 h-3" style={{ color: `${GOLD}60` }} /> {item}
            </span>
          ))
        } />
      </div>

      <NeonDivider color={GOLD} />

      {/* STATS — Premium */}
      <Section className="py-16 px-4" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <PremiumStatsBarLight accentColor={BORDEAUX} textColor="#2a1f2d" stats={[
            { value: 5000, suffix: "+", label: "Ospiti Soddisfatti" },
            { value: 50, suffix: "+", label: "Camere & Suite" },
            { value: 25, suffix: "+", label: "Anni di Eccellenza" },
            { value: 98, suffix: "%", label: "Tasso di Ritorno" },
          ]} />
        </div>
      </Section>

      {/* ROOMS — auto-carousel */}
      <Section id="camere" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: GOLD, fontFamily: "'Lato', sans-serif" }}>ACCOMODATION</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: BORDEAUX }}>Le Nostre Camere</h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-6 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {rooms.map((room, i) => (
                <motion.div key={i} className="flex-shrink-0 w-[300px] sm:w-[360px] snap-start" whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <Card className="overflow-hidden group shadow-lg border-0 relative">
                    {room.popular && <Badge className="absolute top-3 right-3 z-10 text-[10px]" style={{ background: GOLD, color: "#1a1a1a" }}>Più Richiesta</Badge>}
                    <div className="h-56 overflow-hidden">
                      <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                    </div>
                    <CardContent className="p-5">
                      <h3 className="text-lg font-bold mb-2" style={{ color: BORDEAUX }}>{room.name}</h3>
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {room.features.map(f => <Badge key={f} variant="outline" className="text-[10px]" style={{ borderColor: `${GOLD}35`, color: "#666", fontFamily: "'Lato', sans-serif" }}>{f}</Badge>)}
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}><Users className="w-3.5 h-3.5 inline mr-1" />{room.guests} ospiti</p>
                        <p className="text-xl font-bold" style={{ color: BORDEAUX }}>€{room.price}<span className="text-xs font-normal text-gray-400">/notte</span></p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -360, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronLeft className="w-5 h-5" style={{ color: BORDEAUX }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 360, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronRight className="w-5 h-5" style={{ color: BORDEAUX }} />
            </button>
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: BORDEAUX }}>La Struttura</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="servizi" className="py-16" style={{ background: `${BORDEAUX}06` }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: BORDEAUX }}>I Nostri Servizi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { icon: Wifi, label: "Wi-Fi" },
              { icon: UtensilsCrossed, label: "Ristorante" },
              { icon: Waves, label: "Spa" },
              { icon: Car, label: "Parcheggio" },
              { icon: Coffee, label: "Colazione" },
              { icon: Tv, label: "Room Service" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="text-center p-4 rounded-2xl bg-white shadow-sm hover:shadow-md transition-shadow" whileHover={{ y: -3 }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `${GOLD}18` }}>
                  <Icon className="w-5 h-5" style={{ color: BORDEAUX }} />
                </div>
                <p className="text-sm font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS — auto-carousel */}
      <Section id="recensioni" className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: GOLD, fontFamily: "'Lato', sans-serif" }}>RECENSIONI</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: BORDEAUX }}>Cosa Dicono i Nostri Ospiti</h2>
          </div>
          <div className="rounded-2xl p-8 bg-white shadow-lg mb-8 relative overflow-hidden" style={{ border: `1px solid ${GOLD}15` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${GOLD}40` }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: BORDEAUX }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={GOLD} style={{ color: GOLD }} />)}</div>
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${GOLD}25` }} />
                <p className="text-lg italic leading-relaxed" style={{ color: "#666" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? GOLD : "#e0e0e0", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="prenota" className="py-16 sm:py-24 relative">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.15)" }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="relative z-10 max-w-2xl mx-auto px-5">
          <div className="text-center mb-8 text-white">
            <Calendar className="w-7 h-7 mx-auto mb-3" style={{ color: GOLD }} />
            <h2 className="text-3xl sm:text-4xl font-bold">Prenota il Soggiorno</h2>
          </div>
          <Card className="p-6 backdrop-blur-xl border-0 shadow-2xl" style={{ background: "rgba(10,10,10,0.85)", border: `1px solid ${GOLD}25` }}>
            <div className="grid sm:grid-cols-2 gap-3" style={{ fontFamily: "'Lato', sans-serif" }}>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>Check-in *</label><Input type="date" value={form.checkin} onChange={e => setForm({ ...form, checkin: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>Check-out *</label><Input type="date" value={form.checkout} onChange={e => setForm({ ...form, checkout: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>Ospiti</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full h-10 px-3 rounded-md bg-transparent border border-white/15 text-white text-sm">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
                </select>
              </div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: GOLD }}>Camera</label><Input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="Es: Suite Deluxe" className="bg-transparent border-white/15 text-white h-10" /></div>
            </div>
            <Button onClick={handleBooking} disabled={submitting} className="w-full mt-5 py-5 text-base font-semibold rounded-xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${GOLD}, #A88B30)`, color: "#1a1a1a", boxShadow: `0 15px 40px -10px ${GOLD}55` }}>
              {submitting ? "Invio..." : "Richiedi Disponibilità"}
            </Button>
          </Card>
        </div>
      </Section>

      <SectorValueProposition sectorKey="hotel" accentColor={GOLD} darkMode={true} sectorLabel="Hotel" />
      <AutomationShowcase accentColor={GOLD} accentBg="bg-amber-600" sectorName="hotel e hospitality" darkMode={true} />

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: `${GOLD}15`, background: BORDEAUX }}>
        <div className="max-w-6xl mx-auto px-5 text-center text-white/60 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
            <div className="flex gap-4"><a href="/privacy" className="hover:text-white">Privacy</a><span>Powered by Empire.AI</span></div>
          </div>
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
