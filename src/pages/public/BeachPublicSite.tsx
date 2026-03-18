import { useState, useRef, useEffect, forwardRef } from "react";
import DemoAdminAccessButton from "@/components/public/DemoAdminAccessButton";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumStatsBar, PremiumFAQ } from "@/components/public/PremiumSiteKit";
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

/* ─── SUNSET CORAL + OCEAN DEEP AESTHETIC ─── */
const CORAL = "#E8725C";
const OCEAN = "#1B4965";
const SAND = "#F5E6D3";
const TURQUOISE = "#58C4B6";

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

interface Props { company: any; afterHero?: React.ReactNode; }

const HERO_VIDEO = "https://videos.pexels.com/video-files/20446096/20446096-uhd_2560_1440_25fps.mp4";
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

export default function BeachPublicSite({ company, afterHero }: Props) {
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
  const tickerItems = ["Ombrelloni Premium", "Prima Fila", "Bar al Posto", "Piscina", "WiFi Free", "Area Bambini", "Aperitivi Tramonto", "Ristorante"];

  const services = [
    { emoji: "🏖️", name: "Ombrelloni Premium", desc: "Prima fila fronte mare con lettini luxury", img: GALLERY[0] },
    { emoji: "🍹", name: "Bar & Ristorante", desc: "Servizio al posto con cucina mediterranea", img: GALLERY[1] },
    { emoji: "🏊", name: "Area Piscina", desc: "Piscina con acqua di mare riscaldata", img: GALLERY[2] },
    { emoji: "👶", name: "Area Bambini", desc: "Parco giochi e animazione", img: GALLERY[3] },
    { emoji: "🌅", name: "Aperitivi al Tramonto", desc: "Cocktail bar con vista mare", img: GALLERY[4] },
    { emoji: "📶", name: "WiFi Gratuito", desc: "Connessione veloce ovunque", img: GALLERY[5] },
  ];

  const pricingTiers = [
    { name: "Giornaliero", price: minPrice || 25, unit: "€/giorno", features: ["Ombrellone + 2 lettini", "Doccia calda", "WiFi"], color: TURQUOISE },
    { name: "Settimanale", price: (minPrice || 25) * 6, unit: "€/settimana", features: ["Tutto Giornaliero", "Telo mare incluso", "-15% bar"], popular: true, color: CORAL },
    { name: "Stagionale", price: "Su richiesta", unit: "", features: ["Posto fisso garantito", "Cassetta privata", "Servizio VIP"], color: OCEAN },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Abril Fatface', cursive", background: SAND, color: OCEAN }}>
      <link href="https://fonts.googleapis.com/css2?family=Abril+Fatface&family=Source+Sans+3:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: `${SAND}EE`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${CORAL}15` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <Umbrella className="w-6 h-6" style={{ color: CORAL }} />}
            <div>
              <span className="text-lg" style={{ color: OCEAN }}>{company.name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-medium" style={{ color: CORAL, fontFamily: "'Source Sans 3', sans-serif" }}>BEACH CLUB</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-xs tracking-wide uppercase" style={{ color: `${OCEAN}50`, fontFamily: "'Source Sans 3', sans-serif" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:opacity-100 transition">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-full text-xs font-semibold text-white hidden sm:flex" style={{ background: CORAL, fontFamily: "'Source Sans 3', sans-serif" }} onClick={() => scrollTo("prenota")}>Prenota</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: SAND, borderTop: `1px solid ${CORAL}10` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${OCEAN}08`, fontFamily: "'Source Sans 3', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — sunset gradient */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.6) saturate(1.2)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${OCEAN}55 0%, transparent 40%, ${CORAL}33 80%, ${OCEAN}CC 100%)` }} />

        <motion.div className="relative z-10 max-w-3xl mx-auto px-5 text-center pt-20 text-white" style={{ y: heroY }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-medium mb-8" style={{ background: `${CORAL}25`, border: `1px solid ${CORAL}40`, fontFamily: "'Source Sans 3', sans-serif" }}>
              <Sun className="w-4 h-4" /> Beach Club Premium
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-7xl lg:text-8xl mb-5 leading-[0.95]">
              {company.tagline || "Il tuo angolo di paradiso"}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.6)", fontFamily: "'Source Sans 3', sans-serif" }}>
              Benvenuto a <strong style={{ color: "rgba(255,255,255,0.85)" }}>{company.name}</strong>. Spiaggia privata, servizio premium e relax totale.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Button size="lg" className="rounded-full px-10 h-14 text-base font-bold text-white shadow-2xl" style={{ background: CORAL, fontFamily: "'Source Sans 3', sans-serif", boxShadow: `0 20px 60px -15px ${CORAL}66` }} onClick={() => scrollTo("prenota")}>
                <Umbrella className="w-5 h-5 mr-2" /> Prenota Ombrellone
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
        <ScrollIndicator color={`${SAND}50`} />
      </section>

      {afterHero}

      {/* TICKER */}
      <div className="overflow-hidden py-4" style={{ background: OCEAN }}>
        <MarqueeCarousel speed={35} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap" style={{ color: `rgba(255,255,255,0.25)`, fontFamily: "'Source Sans 3', sans-serif" }}>
              <Waves className="w-3 h-3" style={{ color: `${TURQUOISE}50` }} /> {item}
            </span>
          ))
        } />
      </div>

      {/* STATS */}
      <Section className="py-16 px-4" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-6 text-center">
          {[
            { v: totalSpots || 120, s: "+", l: "Postazioni" },
            { v: rows || 8, s: "", l: "File" },
            { v: minPrice || 25, s: "€", l: "Da / Giorno" },
          ].map((stat, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl" style={{ color: CORAL }}>{stat.v}{stat.s}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] mt-1" style={{ color: `${OCEAN}40`, fontFamily: "'Source Sans 3', sans-serif" }}>{stat.l}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="servizi" className="py-20 sm:py-28 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl" style={{ color: OCEAN }}>I Nostri Servizi</h2>
          </div>
          <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
            {services.map((s, i) => (
              <motion.div key={i} className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-[280px] sm:w-[310px] snap-start" whileHover={{ y: -5 }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                </div>
                <div className="p-5 bg-white">
                  <span className="text-2xl mb-2 block">{s.emoji}</span>
                  <h3 className="font-bold text-sm mb-1" style={{ color: OCEAN, fontFamily: "'Source Sans 3', sans-serif" }}>{s.name}</h3>
                  <p className="text-xs" style={{ color: `${OCEAN}50`, fontFamily: "'Source Sans 3', sans-serif" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" className="py-20 px-4" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl text-center mb-10" style={{ color: OCEAN }}>La Nostra Spiaggia</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-2xl aspect-[4/3] group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section className="py-20 px-4" style={{ background: OCEAN }}>
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl sm:text-4xl text-center mb-12 text-white">I Nostri Piani</h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {pricingTiers.map((tier, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className={`rounded-2xl p-6 text-center relative ${tier.popular ? "scale-[1.03]" : ""}`}
                style={{ background: tier.popular ? "#fff" : "rgba(255,255,255,0.08)", color: tier.popular ? OCEAN : "#fff", border: tier.popular ? `2px solid ${CORAL}` : "1px solid rgba(255,255,255,0.1)" }}>
                {tier.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] px-4 rounded-full text-white" style={{ background: CORAL }}>PIÙ SCELTO</Badge>}
                <h3 className="text-lg font-bold mt-2 mb-1" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{tier.name}</h3>
                <p className="text-4xl mb-1">{typeof tier.price === "number" ? `€${tier.price}` : tier.price}</p>
                <p className="text-xs mb-5 opacity-50" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>{tier.unit}</p>
                <ul className="space-y-2 mb-6 text-sm" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
                  {tier.features.map(f => <li key={f} className="flex items-center gap-2 justify-center"><CheckCircle className="w-3.5 h-3.5" style={{ color: tier.popular ? TURQUOISE : CORAL }} />{f}</li>)}
                </ul>
                <Button className="w-full rounded-full py-4 font-bold" style={{ background: tier.popular ? CORAL : "rgba(255,255,255,0.1)", color: "#fff", fontFamily: "'Source Sans 3', sans-serif" }} onClick={() => scrollTo("prenota")}>Prenota</Button>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl text-center mb-10" style={{ color: OCEAN }}>Cosa Dicono i Nostri Ospiti</h2>
          <div className="rounded-2xl p-8 relative overflow-hidden bg-white shadow-sm" style={{ border: `1px solid ${CORAL}10` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${CORAL}30` }} />
                  <div>
                    <p className="font-bold" style={{ color: OCEAN, fontFamily: "'Source Sans 3', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={CORAL} style={{ color: CORAL }} />)}</div>
                  </div>
                </div>
                <p className="text-lg italic leading-relaxed" style={{ color: `${OCEAN}70` }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? CORAL : `${OCEAN}20`, transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="prenota" className="py-20 sm:py-28 px-4" style={{ background: "#fff" }}>
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <Umbrella className="w-8 h-8 mx-auto mb-3" style={{ color: CORAL }} />
            <h2 className="text-3xl" style={{ color: OCEAN }}>Prenota il tuo Posto</h2>
          </div>
          <Card className="rounded-2xl p-6 shadow-lg" style={{ background: SAND, border: `1px solid ${CORAL}15` }}>
            <div className="space-y-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label style={{ color: `${OCEAN}60` }} className="text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1 h-11 rounded-lg" placeholder="Il tuo nome" /></div>
                <div><Label style={{ color: `${OCEAN}60` }} className="text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1 h-11 rounded-lg" placeholder="+39..." /></div>
              </div>
              <div><Label style={{ color: `${OCEAN}60` }} className="text-xs">Data *</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1 h-11 rounded-lg" /></div>
              <div><Label style={{ color: `${OCEAN}60` }} className="text-xs">Periodo</Label>
                <Select value={form.period} onValueChange={v => setForm(p => ({ ...p, period: v }))}>
                  <SelectTrigger className="mt-1 h-11 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">☀️ Mattina (08-13)</SelectItem>
                    <SelectItem value="afternoon">🌅 Pomeriggio (13-19)</SelectItem>
                    <SelectItem value="full_day">🏖️ Giornata Intera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-bold rounded-full text-white shadow-2xl" style={{ background: CORAL, fontFamily: "'Source Sans 3', sans-serif", boxShadow: `0 15px 40px -10px ${CORAL}55` }}>
                {submitting ? "Invio..." : "Prenota Posto"} <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </Card>
        </div>
      </Section>

      <AIAgentsShowcase sector="beach" />
      <SectorValueProposition sectorKey="beach" accentColor={CORAL} darkMode={false} sectorLabel="Stabilimento Balneare" />
      <AutomationShowcase accentColor={CORAL} accentBg="bg-orange-500" sectorName="stabilimenti balneari" darkMode={false} />

      <footer className="py-8 px-4" style={{ background: OCEAN }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Source Sans 3', sans-serif" }}>
          <span className="font-semibold text-white/70 text-sm">{company.name}</span>
          <div className="flex gap-4 text-xs text-white/25">
            {phone && <a href={`tel:${phone}`}><Phone className="w-3 h-3 inline mr-1" />{phone}</a>}
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
      <DemoAdminAccessButton sector="beach" accentColor="#0891b2" />
    </div>
  );
}
