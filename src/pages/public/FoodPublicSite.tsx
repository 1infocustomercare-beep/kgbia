import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumStatsBar, PremiumSectionHeader } from "@/components/public/PremiumSiteKit";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar, ArrowRight,
  ChevronDown, Instagram, UtensilsCrossed, Wine, Flame,
  Heart, Send, Users, Award, MessageCircle, Leaf, Sparkles, Menu, X,
  Quote, ChevronLeft, ChevronRight, Grape, CookingPot, Cherry
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";
import foodHeroPoster from "@/assets/dish-pasta.jpg";

/* ─── GASTRONOMIC DESIGN SYSTEM — Bordeaux + Crema ─── */
const F = {
  bg: "#0d0907",
  bgWarm: "#1a120d",
  bgCream: "#faf6f1",
  bgIvory: "#f5ede4",
  bordeaux: "#7B2D3B",
  terracotta: "#C2653A",
  gold: "#C9A84C",
  cream: "#F5EDE4",
  text: "#F5EDE4",
  textMuted: "rgba(245,237,228,0.55)",
};

const HERO_VIDEO = "https://videos.pexels.com/video-files/3196487/3196487-uhd_2560_1440_25fps.mp4";

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
        <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
          {children}
        </motion.div>
      </section>
    );
  }
);
Section.displayName = "Section";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const step = (ts: number) => { if (!start) start = ts; const p = Math.min((ts - start) / 2000, 1); setCount(Math.floor((1 - Math.pow(1 - p, 3)) * value)); if (p < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{count}{suffix}</span>;
}

/* ── Gallery images for food ── */
const galleryImages = [
  { src: "https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Pasta Artigianale" },
  { src: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Ambiente Elegante" },
  { src: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Fine Dining" },
  { src: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Il Nostro Chef" },
  { src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Piatti Freschi" },
  { src: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600", label: "Cantina Pregiata" },
];

interface Props { company: any; afterHero?: React.ReactNode; }

export default function FoodPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;

  const { data: restaurant } = useQuery({
    queryKey: ["food-pub-restaurant", company.slug],
    queryFn: async () => {
      const { data } = await supabase.from("restaurants").select("*").eq("slug", company.slug).eq("is_active", true).maybeSingle();
      return data;
    },
  });

  const restaurantId = restaurant?.id;

  const { data: menuItems = [] } = useQuery({
    queryKey: ["food-pub-menu", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data } = await supabase.from("menu_items").select("*").eq("restaurant_id", restaurantId).eq("is_active", true).order("sort_order");
      return data || [];
    },
    enabled: !!restaurantId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["food-pub-reviews", restaurantId],
    queryFn: async () => {
      if (!restaurantId) return [];
      const { data } = await supabase.from("reviews").select("*").eq("restaurant_id", restaurantId).eq("is_public", true).order("created_at", { ascending: false }).limit(6);
      return data || [];
    },
    enabled: !!restaurantId,
  });

  const categories = [...new Set(menuItems.map((i: any) => i.category))];
  const [activeCategory, setActiveCategory] = useState<string>("");
  const filteredItems = activeCategory ? menuItems.filter((i: any) => i.category === activeCategory) : menuItems;

  const [form, setForm] = useState({ name: "", phone: "", date: "", time: "", guests: "2", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [galleryIdx, setGalleryIdx] = useState(0);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const handleReservation = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) { toast.error("Compila tutti i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      if (restaurantId) {
        await supabase.from("reservations").insert({
          restaurant_id: restaurantId, customer_name: form.name, customer_phone: form.phone,
          reservation_date: form.date, reservation_time: form.time, guests: parseInt(form.guests),
          notes: form.notes, status: "pending",
        });
      }
      toast.success("Prenotazione ricevuta! Ti confermiamo via WhatsApp.");
      setForm({ name: "", phone: "", date: "", time: "", guests: "2", notes: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const name = company.name || "Ristorante";
  const tagline = company.tagline || "Cucina italiana d'eccellenza";
  const phone = company.phone || restaurant?.phone;
  const address = company.address || restaurant?.address;
  const city = company.city || restaurant?.city;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const navItems = ["Menu", "Chi Siamo", "Gallery", "Prenota", "Contatti"];

  const demoMenu = [
    { id: 0, name: "Tartare di Tonno", description: "Con avocado, lime e sesamo nero", price: 18, category: "Antipasti", is_popular: true, image_url: "https://images.pexels.com/photos/8697540/pexels-photo-8697540.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 1, name: "Tagliatelle al Tartufo", description: "Pasta fresca con tartufo nero pregiato", price: 24, category: "Primi", is_popular: true, image_url: "https://images.pexels.com/photos/1438672/pexels-photo-1438672.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 2, name: "Risotto allo Zafferano", description: "Carnaroli mantecato con zafferano di Navelli", price: 20, category: "Primi", is_popular: false, image_url: "https://images.pexels.com/photos/6287499/pexels-photo-6287499.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 3, name: "Filetto alla Griglia", description: "Black Angus con riduzione al Barolo", price: 32, category: "Secondi", is_popular: true, image_url: "https://images.pexels.com/photos/3535383/pexels-photo-3535383.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 4, name: "Branzino al Forno", description: "Con patate viola e salsa al limone", price: 28, category: "Secondi", is_popular: false, image_url: "https://images.pexels.com/photos/3763847/pexels-photo-3763847.jpeg?auto=compress&cs=tinysrgb&w=600" },
    { id: 5, name: "Tiramisù della Casa", description: "Ricetta tradizionale con mascarpone fresco", price: 10, category: "Dolci", is_popular: true, image_url: "https://images.pexels.com/photos/6880219/pexels-photo-6880219.jpeg?auto=compress&cs=tinysrgb&w=600" },
  ];

  const displayMenuItems = filteredItems.length > 0 ? filteredItems : demoMenu;
  const displayCategories = categories.length > 0 ? categories : [...new Set(demoMenu.map(i => i.category))];

  return (
    <div style={{ fontFamily: "'Lora', serif", background: F.bg, color: F.cream }}>
      <link href="https://fonts.googleapis.com/css2?family=Lora:wght@400;500;600;700&family=Josefin+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`}
        style={{ background: navScrolled ? `${F.bg}F0` : "transparent", backdropFilter: navScrolled ? "blur(20px)" : "none", borderBottom: navScrolled ? `1px solid ${F.bordeaux}30` : "none" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url ? <motion.img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" style={{ border: `2px solid ${F.bordeaux}60` }} whileHover={{ scale: 1.1 }} /> :
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${F.bordeaux}, ${F.terracotta})` }}>
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>}
            <div className="min-w-0">
              <span className="font-bold text-base tracking-tight truncate block" style={{ color: F.cream }}>{name}</span>
              <span className="text-[9px] tracking-[0.25em] uppercase block" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>CUCINA D'AUTORE</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`}
                className="text-[12px] tracking-[0.2em] uppercase transition-colors hover:opacity-100 opacity-50"
                style={{ color: F.cream, fontFamily: "'Josefin Sans', sans-serif" }}>{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            <a href="#prenota">
              <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-6 hover:scale-105 transition-transform text-white"
                style={{ background: `linear-gradient(135deg, ${F.bordeaux}, ${F.terracotta})`, fontFamily: "'Josefin Sans', sans-serif" }}>
                <Calendar className="w-3.5 h-3.5" /> PRENOTA
              </Button>
            </a>
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden" style={{ background: F.bg, borderTop: `1px solid ${F.bordeaux}20` }}>
              <div className="px-5 py-5 space-y-1">
                {navItems.map(item => (
                  <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 text-sm hover:text-white transition-colors border-b" style={{ color: F.textMuted, borderColor: `${F.bordeaux}15`, fontFamily: "'Josefin Sans', sans-serif" }}>{item}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO — Cinematic Gastronomic ── */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-end pb-20 pt-16 overflow-hidden">
        <HeroVideoBackground
          primarySrc={HERO_VIDEO}
          fallbackSrc={fallbackHeroVideo}
          poster={foodHeroPoster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.45) saturate(1.2)" }}
          accentColor={`${F.bordeaux}40`}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${F.bg}20 0%, ${F.bg}50 50%, ${F.bg}DD 85%, ${F.bg} 100%)` }} />

        <div className="max-w-6xl mx-auto w-full relative z-10 px-4 sm:px-6">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-6">
                <span className="h-px w-12" style={{ background: F.terracotta }} />
                <span className="text-[11px] tracking-[0.3em] uppercase font-semibold" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>
                  Esperienza Gastronomica
                </span>
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] mb-6">
                <span style={{ color: F.cream }}>{name}</span>
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl mb-10 max-w-lg" style={{ color: F.textMuted, fontFamily: "'Josefin Sans', sans-serif" }}>
                {tagline}
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <a href="#prenota">
                  <Button className="px-10 h-14 text-base font-semibold tracking-wide rounded-none text-white"
                    style={{ background: `linear-gradient(135deg, ${F.bordeaux}, ${F.terracotta})`, fontFamily: "'Josefin Sans', sans-serif" }}>
                    <Calendar className="w-5 h-5 mr-2" /> Prenota un Tavolo
                  </Button>
                </a>
                <a href="#menu">
                  <Button variant="outline" className="px-8 h-14 text-base tracking-wide rounded-none hover:bg-white/5"
                    style={{ borderColor: `${F.cream}20`, color: F.cream, fontFamily: "'Josefin Sans', sans-serif" }}>
                    Scopri il Menu <ArrowRight className="w-4 h-4 ml-2" />
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {afterHero}

      {/* ── TICKER ── */}
      <div className="overflow-hidden py-5 relative" style={{ background: F.bgWarm }}>
        <MarqueeCarousel speed={35} pauseOnHover items={
          ["Antipasti", "Primi Piatti", "Secondi di Pesce", "Pizza Gourmet", "Dolci Artigianali", "Vini Pregiati", "Cucina del Territorio", "Ingredienti Km0", "Pasta Fresca", "Degustazione"].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap" style={{ color: `${F.cream}25`, fontFamily: "'Josefin Sans', sans-serif" }}>
              <span style={{ color: F.bordeaux }}>◆</span> {item}
            </span>
          ))
        } />
      </div>

      {/* ── STATS BAR ── */}
      <Section className="py-16 relative overflow-hidden" style={{ background: F.bgWarm }}>
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: 200, suffix: "+", label: "Clienti Felici" },
              { value: menuItems.length || 35, suffix: "", label: "Piatti in Menu" },
              { value: 15, suffix: "+", label: "Anni di Esperienza" },
              { value: 4.9, suffix: "★", label: "Rating Medio" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: F.terracotta }}>
                  <AnimatedCounter value={typeof s.value === "number" ? Math.floor(s.value) : 0} suffix={s.suffix} />
                </p>
                <p className="text-xs tracking-widest uppercase" style={{ color: F.textMuted, fontFamily: "'Josefin Sans', sans-serif" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── CHI SIAMO — Split Layout ── */}
      <Section id="chi-siamo" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: F.terracotta }} />
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>La Nostra Storia</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight" style={{ color: F.cream }}>
              Tradizione che incontra<br /><span style={{ color: F.terracotta }}>l'Innovazione</span>
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: F.textMuted, fontFamily: "'Josefin Sans', sans-serif" }}>
              Dal cuore dell'Italia, portiamo in tavola sapori autentici rivisitati con creatività contemporanea. Ogni piatto racconta una storia di passione, ingredienti selezionati e maestria culinaria tramandata di generazione in generazione.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, text: "Ingredienti Km0" },
                { icon: Award, text: "Chef Premiati" },
                { icon: Grape, text: "Cantina Selezionata" },
                { icon: Heart, text: "Fatto con Amore" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 p-3 rounded-lg" style={{ background: `${F.bordeaux}12` }}>
                  <Icon className="w-4 h-4" style={{ color: F.terracotta }} />
                  <span className="text-sm" style={{ fontFamily: "'Josefin Sans', sans-serif", color: F.cream }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-3">
                <div className="rounded-2xl overflow-hidden aspect-[3/4]" style={{ border: `1px solid ${F.bordeaux}25` }}>
                  <img src="https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=600" alt="Chef" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-square" style={{ border: `1px solid ${F.bordeaux}25` }}>
                  <img src="https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Vini" className="w-full h-full object-cover" />
                </div>
              </div>
              <div className="space-y-3 pt-8">
                <div className="rounded-2xl overflow-hidden aspect-square" style={{ border: `1px solid ${F.bordeaux}25` }}>
                  <img src="https://images.pexels.com/photos/1279330/pexels-photo-1279330.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Pasta" className="w-full h-full object-cover" />
                </div>
                <div className="rounded-2xl overflow-hidden aspect-[3/4]" style={{ border: `1px solid ${F.bordeaux}25` }}>
                  <img src="https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=400" alt="Ambiente" className="w-full h-full object-cover" />
                </div>
              </div>
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 px-6 py-3 rounded-full backdrop-blur-xl" style={{ background: `${F.bg}DD`, border: `1px solid ${F.bordeaux}40` }}>
              <p className="text-xs font-semibold tracking-widest uppercase" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>EST. 2010</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── MENU ── */}
      <Section id="menu" className="py-20 sm:py-28" style={{ background: F.bgWarm }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <div className="flex items-center justify-center gap-4 mb-4">
              <span className="h-px w-16" style={{ background: F.bordeaux }} />
              <UtensilsCrossed className="w-5 h-5" style={{ color: F.terracotta }} />
              <span className="h-px w-16" style={{ background: F.bordeaux }} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold" style={{ color: F.cream }}>Il Nostro Menu</h2>
            <p className="mt-3 text-sm" style={{ color: F.textMuted, fontFamily: "'Josefin Sans', sans-serif" }}>Ogni piatto è un viaggio nei sapori italiani</p>
          </div>

          {displayCategories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-12">
              <button onClick={() => setActiveCategory("")} className="px-5 py-2.5 text-xs tracking-widest uppercase transition-all"
                style={{ background: !activeCategory ? F.bordeaux : "transparent", color: !activeCategory ? "white" : F.textMuted, border: `1px solid ${F.bordeaux}50`, borderRadius: 0, fontFamily: "'Josefin Sans', sans-serif" }}>
                Tutti
              </button>
              {displayCategories.map(cat => (
                <button key={cat as string} onClick={() => setActiveCategory(cat as string)} className="px-5 py-2.5 text-xs tracking-widest uppercase transition-all"
                  style={{ background: activeCategory === cat ? F.bordeaux : "transparent", color: activeCategory === cat ? "white" : F.textMuted, border: `1px solid ${F.bordeaux}50`, borderRadius: 0, fontFamily: "'Josefin Sans', sans-serif" }}>
                  {cat as string}
                </button>
              ))}
            </div>
          )}

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayMenuItems.slice(0, 9).map((item: any, i: number) => (
              <motion.div key={item.id} variants={fadeUp} custom={i}>
                <Card className="overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-1 border-0"
                  style={{ background: F.bg, border: `1px solid ${F.bordeaux}15` }}>
                  <div className="relative h-52 overflow-hidden">
                    <img src={item.image_url || `https://images.pexels.com/photos/${[1640777, 1279330, 315755, 312418, 769289, 1126359][i % 6]}/pexels-photo-${[1640777, 1279330, 315755, 312418, 769289, 1126359][i % 6]}.jpeg?auto=compress&cs=tinysrgb&w=600`}
                      alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0" style={{ background: `linear-gradient(0deg, ${F.bg} 0%, transparent 60%)` }} />
                    {item.is_popular && (
                      <Badge className="absolute top-3 right-3 text-[10px] tracking-wider uppercase border-0"
                        style={{ background: F.bordeaux, color: "white" }}>
                        <Flame className="w-3 h-3 mr-1" /> Signature
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg" style={{ color: F.cream }}>{item.name}</h3>
                      <span className="text-xl font-bold" style={{ color: F.terracotta }}>€{item.price}</span>
                    </div>
                    <p className="text-sm line-clamp-2" style={{ fontFamily: "'Josefin Sans', sans-serif", color: F.textMuted }}>{item.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── GALLERY — Masonry Style ── */}
      <Section id="gallery" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>Galleria</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ color: F.cream }}>Il Nostro Mondo</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {galleryImages.map((img, i) => (
              <motion.div key={i} className={`relative overflow-hidden group cursor-pointer ${i === 0 || i === 5 ? "row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 || i === 5 ? "3/5" : "1/1", borderRadius: "4px" }}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all duration-500 flex items-end p-4">
                  <span className="text-white text-sm font-semibold opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500"
                    style={{ fontFamily: "'Josefin Sans', sans-serif" }}>{img.label}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── L'ESPERIENZA — Unique value cards ── */}
      <Section className="py-20 sm:py-28" style={{ background: F.bgCream }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: F.bordeaux, fontFamily: "'Josefin Sans', sans-serif" }}>L'Esperienza</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ color: F.bg }}>Più di un Ristorante</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: CookingPot, title: "Cucina a Vista", desc: "Osserva i nostri chef al lavoro, ogni piatto è uno spettacolo di tecnica e creatività." },
              { icon: Wine, title: "Cantina Curata", desc: "Oltre 200 etichette selezionate dalle migliori cantine italiane e internazionali." },
              { icon: Leaf, title: "Ingredienti Locali", desc: "Collaboriamo con produttori del territorio per garantire freschezza e qualità superiore." },
              { icon: Users, title: "Eventi Privati", desc: "Sale riservate per cene aziendali, compleanni e celebrazioni esclusive." },
              { icon: Cherry, title: "Pasticceria Artigianale", desc: "Dolci preparati al momento dal nostro pastry chef con ingredienti di prima scelta." },
              { icon: Award, title: "Chef Premiato", desc: "Riconosciuto dalla critica per l'innovazione e il rispetto della tradizione." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <motion.div key={i} className="p-6 text-center" style={{ background: "white", border: `1px solid ${F.bordeaux}15` }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="w-14 h-14 rounded-full mx-auto mb-4 flex items-center justify-center" style={{ background: `${F.bordeaux}10` }}>
                  <Icon className="w-6 h-6" style={{ color: F.bordeaux }} />
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ color: F.bg }}>{title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: `${F.bg}99`, fontFamily: "'Josefin Sans', sans-serif" }}>{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ── RECENSIONI ── */}
      <Section className="py-20 sm:py-28" style={{ background: F.bg }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>Testimonianze</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ color: F.cream }}>Cosa Dicono di Noi</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(reviews.length > 0 ? reviews : [
              { id: "d1", rating: 5, comment: "Un'esperienza culinaria straordinaria. Ogni piatto era un'opera d'arte.", customer_name: "Marco R." },
              { id: "d2", rating: 5, comment: "Il miglior ristorante della città. Ambiente elegante e servizio impeccabile.", customer_name: "Laura B." },
              { id: "d3", rating: 5, comment: "Ingredienti freschissimi e abbinamenti creativi. Torneremo sicuramente!", customer_name: "Giuseppe M." },
            ]).map((r: any, i: number) => (
              <motion.div key={r.id} variants={fadeUp} custom={i}>
                <Card className="p-6 border-0 h-full" style={{ background: F.bgWarm, border: `1px solid ${F.bordeaux}15` }}>
                  <Quote className="w-8 h-8 mb-3" style={{ color: `${F.terracotta}30` }} />
                  <div className="flex gap-0.5 mb-3">
                    {Array.from({ length: 5 }).map((_, j) => (
                      <Star key={j} className="w-4 h-4" fill={j < r.rating ? F.terracotta : "transparent"} style={{ color: F.terracotta }} />
                    ))}
                  </div>
                  <p className="text-sm mb-4 italic leading-relaxed" style={{ fontFamily: "'Josefin Sans', sans-serif", color: F.textMuted }}>"{r.comment}"</p>
                  <p className="text-sm font-semibold" style={{ color: F.terracotta }}>— {r.customer_name}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── PRENOTA — Cinematic Background ── */}
      <Section id="prenota" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1920)", filter: "brightness(0.12) saturate(0.7)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${F.bordeaux}30 0%, transparent 50%, ${F.bg}80 100%)` }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: F.terracotta }} />
            <h2 className="text-3xl sm:text-5xl font-bold" style={{ color: F.cream }}>Prenota il Tuo Tavolo</h2>
            <p className="mt-3 text-sm" style={{ fontFamily: "'Josefin Sans', sans-serif", color: F.textMuted }}>Riserva il tuo posto per un'esperienza indimenticabile</p>
          </div>
          <Card className="p-6 sm:p-8 backdrop-blur-xl border-0" style={{ background: `${F.bg}DD`, border: `1px solid ${F.bordeaux}30` }}>
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              <div><label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block" style={{ color: F.terracotta }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent border-white/15 text-white h-12 rounded-none" placeholder="Il tuo nome" /></div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block" style={{ color: F.terracotta }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-white/15 text-white h-12 rounded-none" placeholder="+39..." /></div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block" style={{ color: F.terracotta }}>Data *</label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-transparent border-white/15 text-white h-12 rounded-none" /></div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block" style={{ color: F.terracotta }}>Ora *</label><Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-transparent border-white/15 text-white h-12 rounded-none" /></div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block" style={{ color: F.terracotta }}>Persone</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full h-12 px-3 bg-transparent border border-white/15 text-white text-sm" style={{ borderRadius: 0 }}>
                  {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n} className="bg-black">{n} {n === 1 ? "persona" : "persone"}</option>)}
                </select>
              </div>
              <div><label className="text-[10px] uppercase tracking-[0.2em] mb-1.5 block" style={{ color: F.terracotta }}>Note</label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-transparent border-white/15 text-white h-12 rounded-none" placeholder="Allergie, occasioni..." /></div>
            </div>
            <Button onClick={handleReservation} disabled={submitting} className="w-full mt-6 py-6 text-lg font-semibold tracking-wide text-white rounded-none"
              style={{ background: `linear-gradient(135deg, ${F.bordeaux}, ${F.terracotta})`, fontFamily: "'Josefin Sans', sans-serif" }}>
              {submitting ? "Invio..." : "Conferma Prenotazione"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* ── CONTATTI ── */}
      <Section id="contatti" className="py-20 sm:py-28" style={{ background: F.bgWarm }}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: F.terracotta, fontFamily: "'Josefin Sans', sans-serif" }}>Contatti</span>
            <h2 className="text-3xl sm:text-4xl font-bold mt-3 mb-8" style={{ color: F.cream }}>Vieni a Trovarci</h2>
            <div className="space-y-6" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
              {address && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 mt-1 shrink-0" style={{ color: F.terracotta }} /><div><p className="font-medium" style={{ color: F.cream }}>{address}</p>{city && <p className="text-sm" style={{ color: F.textMuted }}>{city}</p>}</div></div>}
              {phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 shrink-0" style={{ color: F.terracotta }} /><a href={`tel:${phone}`} className="hover:underline" style={{ color: F.cream }}>{phone}</a></div>}
              {company.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 shrink-0" style={{ color: F.terracotta }} /><a href={`mailto:${company.email}`} className="hover:underline" style={{ color: F.cream }}>{company.email}</a></div>}
            </div>
          </div>
          <div className="overflow-hidden h-64 md:h-auto" style={{ border: `1px solid ${F.bordeaux}20` }}>
            <iframe title="Mappa" width="100%" height="100%" style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address || ""} ${city || "Roma"}`)}&output=embed`} allowFullScreen />
          </div>
        </div>
      </Section>

      {/* ── SECTOR VALUE + AUTOMATION ── */}
      <AIAgentsShowcase sector="food" />
      <SectorValueProposition sectorKey="food" accentColor={F.bordeaux} darkMode={true} sectorLabel="Ristorante" />
      <AutomationShowcase accentColor={F.bordeaux} accentBg="bg-rose-800" sectorName="la ristorazione" darkMode={true} />

      {/* ── FOOTER ── */}
      <footer className="py-10 border-t" style={{ borderColor: `${F.bordeaux}15`, background: F.bg }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Josefin Sans', sans-serif" }}>
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt="" className="w-8 h-8 rounded-full object-cover" />}
            <span className="font-semibold text-sm" style={{ color: F.cream }}>{name}</span>
          </div>
          <p className="text-xs" style={{ color: F.textMuted }}>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4 text-xs" style={{ color: F.textMuted }}>
            <a href="/privacy" className="hover:underline">Privacy</a>
            <a href="/cookie-policy" className="hover:underline">Cookie</a>
            <span>Powered by Empire</span>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp FAB ── */}
      {phone && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
