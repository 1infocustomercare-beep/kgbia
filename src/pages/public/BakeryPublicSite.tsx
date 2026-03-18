import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, NeonDivider, PremiumStatsBarLight, ScrollIndicator } from "@/components/public/PremiumSiteKit";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Cake, CookingPot, Wheat, Award,
  MessageCircle, AlertTriangle, ShoppingBag, Sparkles,
  ChevronDown, Menu, X, Quote, Users, CheckCircle, ChevronRight, ChevronLeft
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";
import bakeryHeroPoster from "@/assets/bakery-croissant.jpg";

/* ─── WARM TERRACOTTA + VANILLA ARTISANAL ─── */
const TERRA = "#B8654A";
const VANILLA = "#FFF8EE";
const ESPRESSO = "#3C2415";
const ROSE = "#D4918F";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
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

const FALLBACK_REVIEWS = [
  { name: "Giulia M.", text: "Il pane più buono che abbia mai assaggiato. Fragranza incredibile e crosta perfetta.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Marco R.", text: "I croissant sono una poesia. Burro francese e sfoglia perfetta. Vado ogni mattina!", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Anna L.", text: "Torta della Nonna prenotata per il compleanno: un capolavoro.", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Roberto P.", text: "Focaccia genovese spettacolare. Ingredienti bio fanno la differenza.", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
];

const FAQ_ITEMS = [
  { q: "A che ora aprite?", a: "Apriamo alle 6:30 del mattino. Chiudiamo alle 19:30." },
  { q: "Posso pre-ordinare torte personalizzate?", a: "Assolutamente sì! Consigliamo almeno 48h di anticipo per torte personalizzate." },
  { q: "Utilizzate farine biologiche?", a: "Sì, farine biologiche macinate a pietra e lievito madre centenario." },
  { q: "Avete opzioni senza glutine?", a: "Offriamo una selezione gluten-free preparata in area dedicata." },
  { q: "Fate consegne a domicilio?", a: "Sì, consegna gratuita per ordini superiori a €30." },
];

export default function BakeryPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const name = company.name || "Panificio Artigianale";
  const tagline = company.tagline || "Fatto con Amore Ogni Giorno";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const [form, setForm] = useState({ name: "", phone: "", product: "", date: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const t = setInterval(() => setReviewIndex(p => (p + 1) % FALLBACK_REVIEWS.length), 5000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const t = setInterval(() => { if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollBy({ left: 320, behavior: "smooth" }); }, 4000);
    return () => clearInterval(t);
  }, []);

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.product) { toast.error("Compila i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, source: "website", notes: `Pre-ordine: ${form.product}, Ritiro: ${form.date}, Note: ${form.notes}` });
      toast.success("Pre-ordine ricevuto!");
      setForm({ name: "", phone: "", product: "", date: "", notes: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const products = [
    { name: "Croissant al Burro", price: "1.80", img: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", tag: "Classico" },
    { name: "Pane di Campagna", price: "4.50", img: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Lievito Madre" },
    { name: "Torta della Nonna", price: "22.00", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Su ordinazione", preorder: true },
    { name: "Focaccia Genovese", price: "3.50", img: "https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Tradizionale" },
    { name: "Cannoli Siciliani", price: "3.00", img: "https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Dolce" },
    { name: "Biscotti Artigianali", price: "8.00/kg", img: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Assortiti" },
  ];

  const HERO_VIDEO = "https://videos.pexels.com/video-files/7964583/7964583-uhd_2560_1440_25fps.mp4";
  const tickerItems = ["Pane Fresco", "Cornetti", "Focaccia", "Torte", "Lievito Madre", "Farine Bio", "Biscotti", "Pizza al Taglio"];
  const navLinks = [{ href: "#vetrina", label: "Vetrina" }, { href: "#chi-siamo", label: "Chi Siamo" }, { href: "#recensioni", label: "Recensioni" }, { href: "#pre-ordina", label: "Pre-ordina" }];

  const dailySchedule = [
    { time: "06:30", item: "Prima sfornata — Pane & Focaccia", emoji: "🍞" },
    { time: "07:00", item: "Cornetti caldi dal forno", emoji: "🥐" },
    { time: "08:30", item: "Dolci freschi & Pasticcini", emoji: "🧁" },
    { time: "11:00", item: "Pizza al taglio artigianale", emoji: "🍕" },
    { time: "15:00", item: "Merenda: sfogliatelle & cannoli", emoji: "🥮" },
    { time: "17:00", item: "Ultima sfornata serale", emoji: "🫓" },
  ];

  return (
    <div style={{ fontFamily: "'Libre Baskerville', serif", background: VANILLA, color: ESPRESSO }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? "shadow-md" : ""}`} style={{ background: `${VANILLA}F0`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${TERRA}12` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" /> :
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${TERRA}10` }}><Wheat className="w-5 h-5" style={{ color: TERRA }} /></div>}
            <div>
              <span className="text-lg font-bold" style={{ color: ESPRESSO }}>{name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-medium" style={{ color: ROSE, fontFamily: "'Lato', sans-serif" }}>PANIFICIO ARTIGIANALE</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-[12px] tracking-wider font-medium hover:opacity-100 opacity-50 transition" style={{ color: ESPRESSO, fontFamily: "'Lato', sans-serif" }}>{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full text-xs h-10 px-5 text-white" style={{ background: TERRA, fontFamily: "'Lato', sans-serif" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> Chiama</a>
            </Button>}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: VANILLA, borderTop: `1px solid ${TERRA}10` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${TERRA}08`, fontFamily: "'Lato', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={bakeryHeroPoster} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.45) saturate(1.1)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${ESPRESSO}88 0%, ${ESPRESSO}AA 100%)` }} />
        <motion.div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white pt-20" style={{ y: heroY }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-5 py-2 rounded-full mb-6 text-sm" style={{ background: `${TERRA}30`, border: `1px solid ${TERRA}50`, color: VANILLA, fontFamily: "'Lato', sans-serif" }}>
              <Sparkles className="w-4 h-4" /> Dal {company.founded_year || 1985}
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-bold mb-5 leading-[1.1] italic" style={{ color: VANILLA }}>
              {tagline}
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg mb-10 max-w-xl mx-auto" style={{ fontFamily: "'Lato', sans-serif", color: `${VANILLA}80` }}>Tradizione artigianale, ingredienti selezionati, passione infinita</motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#vetrina"><Button className="px-10 h-14 text-base rounded-full shadow-2xl" style={{ background: TERRA, color: VANILLA, fontFamily: "'Lato', sans-serif", boxShadow: `0 20px 60px -15px ${TERRA}66` }}>Scopri i Prodotti</Button></a>
              <a href="#pre-ordina"><Button variant="outline" className="px-10 h-14 text-base rounded-full" style={{ borderColor: `${VANILLA}40`, color: VANILLA, fontFamily: "'Lato', sans-serif" }}>Pre-ordina una Torta</Button></a>
            </motion.div>
          </motion.div>
        </motion.div>
        <ScrollIndicator color={`${VANILLA}40`} />
      </section>

      {afterHero}

      {/* TICKER */}
      <div className="overflow-hidden py-4" style={{ background: TERRA }}>
        <MarqueeCarousel speed={35} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap" style={{ color: `${VANILLA}35`, fontFamily: "'Lato', sans-serif" }}>
              <Wheat className="w-3 h-3" style={{ color: `${VANILLA}25` }} /> {item}
            </span>
          ))
        } />
      </div>

      {/* STATS */}
      <Section className="py-16 px-4" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <PremiumStatsBarLight accentColor={TERRA} textColor={ESPRESSO} stats={[
            { value: 38, suffix: "+", label: "Anni di Tradizione" },
            { value: 50, suffix: "+", label: "Prodotti al Giorno" },
            { value: 100, suffix: "%", label: "Ingredienti Naturali" },
            { value: 3000, suffix: "+", label: "Clienti Felici" },
          ]} />
        </div>
      </Section>

      {/* DAILY SCHEDULE — unique bakery section */}
      <Section className="py-20 px-4" style={{ background: `${TERRA}06` }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-2" style={{ color: ROSE, fontFamily: "'Lato', sans-serif" }}>LA NOSTRA GIORNATA</p>
            <h2 className="text-3xl sm:text-4xl italic" style={{ color: ESPRESSO }}>Dal Forno alla Tua Tavola</h2>
          </div>
          <div className="space-y-4">
            {dailySchedule.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex items-center gap-5 p-4 rounded-xl bg-white shadow-sm" style={{ border: `1px solid ${TERRA}08` }}>
                <span className="text-2xl">{s.emoji}</span>
                <div className="flex-1">
                  <p className="font-bold text-sm" style={{ color: ESPRESSO }}>{s.item}</p>
                </div>
                <span className="text-sm font-bold shrink-0 px-3 py-1 rounded-full" style={{ background: `${TERRA}10`, color: TERRA, fontFamily: "'Lato', sans-serif" }}>{s.time}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* VETRINA */}
      <Section id="vetrina" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Cake className="w-8 h-8 mx-auto mb-3" style={{ color: ROSE }} />
            <h2 className="text-3xl sm:text-4xl italic" style={{ color: ESPRESSO }}>La Nostra Vetrina</h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {products.map((p, i) => (
                <motion.div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start" whileHover={{ y: -5 }}>
                  <Card className="overflow-hidden group shadow-sm border-0 hover:shadow-xl transition-shadow rounded-2xl">
                    <div className="h-52 overflow-hidden relative">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <Badge className="absolute top-3 left-3 text-xs rounded-full" style={{ background: p.preorder ? ROSE : `${TERRA}`, color: "#fff", fontFamily: "'Lato', sans-serif" }}>{p.tag}</Badge>
                    </div>
                    <CardContent className="p-5" style={{ background: "#fff" }}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-lg" style={{ color: ESPRESSO }}>{p.name}</h3>
                        <span className="text-lg font-bold" style={{ color: TERRA, fontFamily: "'Lato', sans-serif" }}>€{p.price}</span>
                      </div>
                      {p.preorder && <a href="#pre-ordina" className="mt-2 inline-flex items-center gap-1 text-sm" style={{ color: ROSE, fontFamily: "'Lato', sans-serif" }}><ShoppingBag className="w-4 h-4" /> Pre-ordina</a>}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10"><ChevronLeft className="w-5 h-5" style={{ color: TERRA }} /></button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10"><ChevronRight className="w-5 h-5" style={{ color: TERRA }} /></button>
          </div>
        </div>
      </Section>

      {/* CHI SIAMO */}
      <Section id="chi-siamo" className="py-20" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] mb-3 font-medium" style={{ color: ROSE, fontFamily: "'Lato', sans-serif" }}>LA NOSTRA STORIA</p>
            <h2 className="text-3xl sm:text-4xl italic mb-6" style={{ color: ESPRESSO }}>Passione dal {company.founded_year || 1985}</h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: `${ESPRESSO}80`, fontFamily: "'Lato', sans-serif" }}>
              Da generazioni portiamo sulle tavole il profumo del pane appena sfornato. Ogni impasto è curato con ingredienti selezionati, farine macinate a pietra e lievito madre centenario.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wheat, text: "Farine Bio" },
                { icon: Heart, text: "Fatto a Mano" },
                { icon: Award, text: "Tradizione dal 1985" },
                { icon: CookingPot, text: "Lievito Madre" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Lato', sans-serif", color: ESPRESSO }}>
                  <Icon className="w-4 h-4" style={{ color: TERRA }} /> {text}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-3xl overflow-hidden shadow-lg aspect-square">
            <img src="https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baker" className="w-full h-full object-cover" />
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-20 sm:py-28" style={{ background: `${TERRA}06` }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-2 font-medium" style={{ color: ROSE, fontFamily: "'Lato', sans-serif" }}>TESTIMONIANZE</p>
            <h2 className="text-3xl sm:text-4xl italic" style={{ color: ESPRESSO }}>Cosa Dicono i Clienti</h2>
          </div>
          <div className="rounded-2xl p-8 relative overflow-hidden bg-white shadow-sm" style={{ border: `1px solid ${TERRA}10` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${ROSE}40` }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: ESPRESSO, fontFamily: "'Lato', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={TERRA} style={{ color: TERRA }} />)}</div>
                  </div>
                </div>
                <p className="text-lg italic leading-relaxed" style={{ color: `${ESPRESSO}80` }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? TERRA : `${TERRA}25`, transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PRE-ORDINA */}
      <Section id="pre-ordina" className="py-20 sm:py-28" style={{ background: ESPRESSO }}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <Cake className="w-10 h-10 mx-auto mb-4" style={{ color: TERRA }} />
          <h2 className="text-3xl sm:text-4xl italic mb-2" style={{ color: VANILLA }}>Pre-ordina</h2>
          <p className="text-sm mb-8" style={{ color: `${VANILLA}60`, fontFamily: "'Lato', sans-serif" }}>Torte, dolci e prodotti speciali su ordinazione</p>
          <Card className="p-6 text-left rounded-2xl" style={{ background: VANILLA, border: "none" }}>
            <div className="space-y-4" style={{ fontFamily: "'Lato', sans-serif" }}>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: TERRA }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome" className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: TERRA }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: TERRA }}>Prodotto *</label><Input value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} placeholder="Es: Torta della Nonna per 8 persone" className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: TERRA }}>Data Ritiro</label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: TERRA }}>Note</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Allergie, decorazioni..." className="rounded-lg" /></div>
            </div>
            <Button onClick={handleOrder} disabled={submitting} className="w-full mt-6 py-5 text-lg font-medium rounded-full" style={{ background: TERRA, color: VANILLA, fontFamily: "'Lato', sans-serif" }}>
              {submitting ? "Invio..." : "Invia Pre-ordine"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-20" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl italic" style={{ color: ESPRESSO }}>Domande Frequenti</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden bg-white shadow-sm" style={{ border: `1px solid ${TERRA}08` }}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-medium text-sm" style={{ fontFamily: "'Lato', sans-serif", color: ESPRESSO }}>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: ROSE }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed" style={{ fontFamily: "'Lato', sans-serif", color: `${ESPRESSO}70` }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <AIAgentsShowcase sector="bakery" />
      <SectorValueProposition sectorKey="bakery" accentColor={TERRA} darkMode={false} sectorLabel="Panificio" />
      <AutomationShowcase accentColor={TERRA} accentBg="bg-amber-700" sectorName="panifici e pasticcerie" darkMode={false} />

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: `${TERRA}10`, background: ESPRESSO }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ fontFamily: "'Lato', sans-serif" }}>
          <p className="text-xs" style={{ color: `${VANILLA}30` }}>© {new Date().getFullYear()} {name}.</p>
          <div className="flex gap-4 text-xs" style={{ color: `${VANILLA}30` }}><a href="/privacy">Privacy</a><span>Powered by Empire.AI</span></div>
        </div>
      </footer>

      {phone && (
        <motion.a href={whatsapp} target="_blank" rel="noopener"
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
