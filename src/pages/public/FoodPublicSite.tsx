import { useState, useRef, useEffect, forwardRef } from "react";
// @ts-ignore
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumStatsBar, PremiumSectionHeader } from "@/components/public/PremiumSiteKit";
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
  Star, Phone, Mail, MapPin, Clock, Calendar, ArrowRight,
  ChevronDown, Instagram, UtensilsCrossed, Wine, Flame,
  Heart, Send, Users, Award, MessageCircle, Leaf, Sparkles, Menu, X
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";
import foodHeroPoster from "@/assets/dish-pasta.jpg";

const HERO_VIDEO = "https://videos.pexels.com/video-files/8626672/8626672-uhd_2560_1440_25fps.mp4";

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

/* Premium Badge */
const premiumImages = [
  { src: "https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Pasta Fresca" },
  { src: "https://images.pexels.com/photos/262978/pexels-photo-262978.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Atmosfera" },
  { src: "https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Fine Dining" },
  { src: "https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=200", label: "Chef" },
];

function PremiumBadge() {
  const [idx, setIdx] = useState(0);
  useEffect(() => { const t = setInterval(() => setIdx(p => (p + 1) % premiumImages.length), 3500); return () => clearInterval(t); }, []);
  const img = premiumImages[idx];
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4, duration: 0.5 }}
      className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-4 z-20">
      <div className="flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5"
        style={{ background: "rgba(10,10,10,0.8)", border: "1px solid rgba(212,175,55,0.3)", boxShadow: "0 8px 32px rgba(0,0,0,0.5)" }}>
        <div className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0" style={{ border: "1.5px solid rgba(212,175,55,0.4)" }}>
          <AnimatePresence mode="wait">
            <motion.img key={idx} src={img.src} alt={img.label} className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.4 }} />
          </AnimatePresence>
        </div>
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: "#D4AF37" }}>Premium</p>
          <p className="text-[8px] text-white/45 truncate leading-tight mt-0.5">{img.label}</p>
        </div>
      </div>
    </motion.div>
  );
}

interface Props { company: any; afterHero?: React.ReactNode; }

export default function FoodPublicSite({ company, afterHero }: Props) {
  const gold = "#D4AF37";
  const dark = "#0A0A0A";
  const cream = "#F5F0E8";
  const companyId = company.id;

  // Check if this is a restaurant (has restaurant record) or company
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
  const [mobileMenu, setMobileMenu] = useState(false);

  const handleReservation = async () => {
    if (!form.name || !form.phone || !form.date || !form.time) { toast.error("Compila tutti i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      if (restaurantId) {
        await supabase.from("reservations").insert({
          restaurant_id: restaurantId,
          customer_name: form.name,
          customer_phone: form.phone,
          reservation_date: form.date,
          reservation_time: form.time,
          guests: parseInt(form.guests),
          notes: form.notes,
          status: "pending",
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

  const navItems = ["Menu", "Chi Siamo", "Prenota", "Contatti"];

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const tickerItems = ["Antipasti", "Primi Piatti", "Secondi", "Pizza", "Dolci", "Vini Pregiati", "Cucina Tradizionale", "Ingredienti Km0", "Chef Stellato", "Pasta Fresca"];

  return (
    <div style={{ fontFamily: "'Playfair Display', serif", background: dark, color: cream }}>
      {/* Google Font */}
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`} style={{ background: dark, borderBottom: `1px solid ${gold}30` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url ? <motion.img src={company.logo_url} alt={name} className="h-9 w-9 rounded-xl object-cover" whileHover={{ scale: 1.1 }} /> :
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${gold}20` }}><UtensilsCrossed className="w-5 h-5" style={{ color: gold }} /></div>}
            <div className="min-w-0">
              <span className="font-bold text-base tracking-tight truncate block" style={{ color: gold }}>{name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold text-white/50">RISTORANTE PREMIUM</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navItems.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-[13px] tracking-widest uppercase transition-colors hover:opacity-100 opacity-50" style={{ color: cream, fontFamily: "Inter, sans-serif" }}>{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {phone && (
              <Button size="sm" variant="outline" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-5 hover:scale-105 transition-transform" style={{ borderColor: gold, color: gold, background: "transparent", fontFamily: "Inter, sans-serif" }} asChild>
                <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> CHIAMA ORA</a>
              </Button>
            )}
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: dark, borderTop: `1px solid ${gold}20` }}>
              <div className="px-5 py-5 space-y-1">
                {navItems.map(item => (
                  <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 hover:text-white transition-colors border-b" style={{ borderColor: `${gold}10` }}>{item}</a>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ── HERO — video bg + text reveal ── */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden">
        <HeroVideoBackground
          primarySrc={HERO_VIDEO}
          fallbackSrc={fallbackHeroVideo}
          poster={foodHeroPoster}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.52) saturate(1.08)" }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${dark}88 0%, ${dark}66 40%, ${dark}99 100%)` }} />
        <div className="absolute inset-0 opacity-[0.08]" style={{ backgroundImage: `radial-gradient(circle, ${gold}80 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 px-4 sm:px-6">
          <motion.div style={{ y: heroY, opacity: heroOpacity }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium"
                style={{ background: `${gold}15`, border: `1px solid ${gold}30`, color: gold, fontFamily: "Inter, sans-serif" }}>
                <Sparkles className="w-4 h-4" /> Cucina d'Eccellenza
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-bold leading-[1.05] mb-6">
                {name.split("").map((char, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 30, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.5 + i * 0.04, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "inline-block", color: i % 4 === 0 ? gold : cream }}>
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg mb-10 max-w-xl" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "Inter, sans-serif" }}>
                {tagline}
              </motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <a href="#prenota">
                  <Button className="px-10 h-14 text-base font-semibold tracking-wide rounded-xl shadow-2xl" style={{ background: `linear-gradient(135deg, ${gold}, #B8962E)`, color: dark, border: "none", fontFamily: "Inter, sans-serif", boxShadow: `0 20px 60px -15px ${gold}55` }}>
                    <Calendar className="w-5 h-5 mr-2" /> Prenota un Tavolo
                  </Button>
                </a>
                <a href="#menu">
                  <Button variant="outline" className="px-8 h-14 text-base tracking-wide rounded-xl text-white hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", fontFamily: "Inter, sans-serif" }}>
                    Vedi il Menu
                  </Button>
                </a>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Hero image with Premium Badge */}
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]" style={{ border: `1px solid ${gold}20` }}>
              <img src="https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Piatto" className="w-full h-full object-cover" />
            </div>
            <PremiumBadge />
          </motion.div>
        </div>

        <ScrollIndicator />
      </section>

      {afterHero}

      {/* ── TICKER — Premium Marquee ── */}
      <div className="overflow-hidden py-5 relative" style={{ background: "#111" }}>
        <AmbientGlow color={gold} position="top" />
        <MarqueeCarousel speed={40} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap" style={{ color: "rgba(255,255,255,0.25)", fontFamily: "Inter, sans-serif" }}>
              <UtensilsCrossed className="w-3 h-3" style={{ color: `${gold}60` }} /> {item}
            </span>
          ))
        } />
      </div>

      <NeonDivider color={gold} />

      {/* ── STATS BAR — Premium Glass ── */}
      <Section className="py-12 sm:py-16 relative overflow-hidden" style={{ background: "#111" }}>
        <FloatingOrbs color={gold} count={3} />
        <div className="max-w-5xl mx-auto px-6 relative z-10">
          <PremiumStatsBar accentColor={gold} stats={[
            { value: reviews.length * 50 || 200, suffix: "+", label: "Clienti Soddisfatti" },
            { value: menuItems.length || 30, suffix: "+", label: "Piatti in Menu" },
            { value: categories.length || 6, label: "Categorie" },
            { value: 5, suffix: "★", label: "Rating Medio" },
          ]} />
        </div>
      </Section>

      {/* ── CHI SIAMO ── */}
      <Section id="chi-siamo" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <Badge className="mb-4 text-xs tracking-widest" style={{ background: `${gold}20`, color: gold, border: `1px solid ${gold}40` }}>LA NOSTRA STORIA</Badge>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6" style={{ color: gold }}>Tradizione & Innovazione</h2>
            <p className="text-base sm:text-lg leading-relaxed opacity-80 mb-6" style={{ fontFamily: "Inter, sans-serif" }}>
              Dal cuore dell'Italia, portiamo in tavola sapori autentici rivisitati con creatività contemporanea. Ogni piatto racconta una storia di passione, ingredienti selezionati e maestria culinaria tramandata di generazione in generazione.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Leaf, text: "Ingredienti Km0" },
                { icon: Award, text: "Chef Premiati" },
                { icon: Heart, text: "Fatto con Amore" },
                { icon: Wine, text: "Cantina Selezionata" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 opacity-70">
                  <Icon className="w-4 h-4" style={{ color: gold }} />
                  <span className="text-sm" style={{ fontFamily: "Inter, sans-serif" }}>{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }} className="relative">
            <div className="rounded-2xl overflow-hidden aspect-[4/5]" style={{ border: `2px solid ${gold}30` }}>
              <img src="https://images.pexels.com/photos/3338497/pexels-photo-3338497.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Chef" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-6 -left-6 p-4 rounded-xl backdrop-blur-xl" style={{ background: `${dark}CC`, border: `1px solid ${gold}40` }}>
              <p className="text-3xl font-bold" style={{ color: gold }}>Est. 2015</p>
              <p className="text-xs opacity-60" style={{ fontFamily: "Inter, sans-serif" }}>Anni di eccellenza</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ── MENU ── */}
      <Section id="menu" className="py-20 sm:py-28" style={{ background: `${dark}` } as any}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <div className="flex items-center justify-center gap-3 mb-4">
              <span className="h-px w-16" style={{ background: gold }} />
              <UtensilsCrossed className="w-5 h-5" style={{ color: gold }} />
              <span className="h-px w-16" style={{ background: gold }} />
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold" style={{ color: gold }}>Il Nostro Menu</h2>
          </div>

          {categories.length > 0 && (
            <div className="flex flex-wrap justify-center gap-3 mb-10">
              <button onClick={() => setActiveCategory("")} className="px-5 py-2 rounded-full text-sm transition-all" style={{ background: !activeCategory ? gold : "transparent", color: !activeCategory ? dark : cream, border: `1px solid ${gold}40`, fontFamily: "Inter, sans-serif" }}>
                Tutti
              </button>
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat as string)} className="px-5 py-2 rounded-full text-sm transition-all" style={{ background: activeCategory === cat ? gold : "transparent", color: activeCategory === cat ? dark : cream, border: `1px solid ${gold}40`, fontFamily: "Inter, sans-serif" }}>
                  {cat as string}
                </button>
              ))}
            </div>
          )}

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {(filteredItems.length > 0 ? filteredItems : Array.from({ length: 6 }, (_, i) => ({
              id: i, name: ["Bruschetta Classica", "Spaghetti Carbonara", "Pizza Margherita", "Risotto ai Funghi", "Tagliata di Manzo", "Tiramisù"][i],
              description: "Una delizia della tradizione italiana", price: [8, 14, 12, 16, 22, 7][i], category: "Specialità", is_popular: i < 2, image_url: null, allergens: []
            }))).map((item: any, i) => (
              <motion.div key={item.id} variants={fadeUp} custom={i}>
                <Card className="overflow-hidden group cursor-pointer transition-all duration-500 hover:-translate-y-1" style={{ background: "#111", border: `1px solid ${gold}15` }}>
                  <div className="relative h-48 overflow-hidden">
                    <img src={item.image_url || `https://images.pexels.com/photos/${[1640777, 1279330, 315755, 312418, 769289, 1126359][i % 6]}/pexels-photo-${[1640777, 1279330, 315755, 312418, 769289, 1126359][i % 6]}.jpeg?auto=compress&cs=tinysrgb&w=600`} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {item.is_popular && (
                      <Badge className="absolute top-3 right-3 text-xs" style={{ background: gold, color: dark }}>
                        <Flame className="w-3 h-3 mr-1" /> Popolare
                      </Badge>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-lg" style={{ color: cream }}>{item.name}</h3>
                      <span className="text-xl font-bold" style={{ color: gold }}>€{item.price}</span>
                    </div>
                    <p className="text-sm opacity-60 line-clamp-2" style={{ fontFamily: "Inter, sans-serif", color: cream }}>{item.description}</p>
                    {item.allergens?.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {item.allergens.slice(0, 4).map((a: string) => (
                          <span key={a} className="text-xs px-2 py-0.5 rounded-full opacity-60" style={{ background: `${gold}15`, color: gold }}>{a}</span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ── RECENSIONI ── */}
      {reviews.length > 0 && (
        <Section className="py-20 sm:py-28" style={{ background: "#080808" } as any}>
          <div className="max-w-6xl mx-auto px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-5xl font-bold" style={{ color: gold }}>Cosa Dicono di Noi</h2>
            </div>
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.map((r: any, i: number) => (
                <motion.div key={r.id} variants={fadeUp} custom={i}>
                  <Card className="p-6" style={{ background: "#111", border: `1px solid ${gold}15` }}>
                    <div className="flex gap-0.5 mb-3">
                      {Array.from({ length: 5 }).map((_, j) => (
                        <Star key={j} className="w-4 h-4" fill={j < r.rating ? gold : "transparent"} style={{ color: gold }} />
                      ))}
                    </div>
                    <p className="text-sm opacity-80 mb-4 italic" style={{ fontFamily: "Inter, sans-serif", color: cream }}>"{r.comment}"</p>
                    <p className="text-sm font-semibold" style={{ color: gold }}>— {r.customer_name}</p>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </Section>
      )}

      {/* ── PRENOTA ── */}
      <Section id="prenota" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.pexels.com/photos/67468/pexels-photo-67468.jpeg?auto=compress&cs=tinysrgb&w=1920)", filter: "brightness(0.15)" }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: gold }} />
            <h2 className="text-3xl sm:text-5xl font-bold" style={{ color: gold }}>Prenota un Tavolo</h2>
            <p className="mt-3 opacity-60 text-sm" style={{ fontFamily: "Inter, sans-serif" }}>Riserva il tuo posto per un'esperienza indimenticabile</p>
          </div>
          <Card className="p-6 sm:p-8 backdrop-blur-xl" style={{ background: `${dark}DD`, border: `1px solid ${gold}30` }}>
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent border-white/20 text-white" placeholder="Il tuo nome" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-white/20 text-white" placeholder="+39..." /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Data *</label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="bg-transparent border-white/20 text-white" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Ora *</label><Input type="time" value={form.time} onChange={e => setForm({ ...form, time: e.target.value })} className="bg-transparent border-white/20 text-white" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Persone</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full h-10 px-3 rounded-md bg-transparent border border-white/20 text-white text-sm">
                  {[1,2,3,4,5,6,7,8,10,12].map(n => <option key={n} value={n} className="bg-black">{n} {n === 1 ? "persona" : "persone"}</option>)}
                </select>
              </div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Note</label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} className="bg-transparent border-white/20 text-white" placeholder="Allergie, occasioni..." /></div>
            </div>
            <Button onClick={handleReservation} disabled={submitting} className="w-full mt-6 py-6 text-lg font-semibold tracking-wide" style={{ background: `linear-gradient(135deg, ${gold}, #B8962E)`, color: dark }}>
              {submitting ? "Invio..." : "Conferma Prenotazione"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* ── CONTATTI ── */}
      <Section id="contatti" className="py-20 sm:py-28" style={{ background: "#050505" } as any}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ color: gold }}>Vieni a Trovarci</h2>
            <div className="space-y-6" style={{ fontFamily: "Inter, sans-serif" }}>
              {address && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 mt-1 shrink-0" style={{ color: gold }} /><div><p className="font-medium" style={{ color: cream }}>{address}</p>{city && <p className="text-sm opacity-50">{city}</p>}</div></div>}
              {phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 shrink-0" style={{ color: gold }} /><a href={`tel:${phone}`} style={{ color: cream }}>{phone}</a></div>}
              {company.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 shrink-0" style={{ color: gold }} /><a href={`mailto:${company.email}`} style={{ color: cream }}>{company.email}</a></div>}
            </div>
          </div>
          <div className="rounded-xl overflow-hidden h-64 md:h-auto" style={{ border: `1px solid ${gold}20` }}>
            <iframe
              title="Mappa"
              width="100%" height="100%"
              style={{ border: 0, filter: "invert(90%) hue-rotate(180deg)" }}
              src={`https://maps.google.com/maps?q=${encodeURIComponent(`${address || ""} ${city || "Roma"}`)}&output=embed`}
              allowFullScreen
            />
          </div>
        </div>
      </Section>

      {/* ── AUTOMATION SHOWCASE ── */}
      <SectorValueProposition sectorKey="food" accentColor={gold} darkMode={true} sectorLabel="Ristorante" />
      <AutomationShowcase accentColor={gold} accentBg="bg-amber-600" sectorName="la ristorazione" darkMode={true} />

      {/* ── FOOTER ── */}
      <footer className="py-10 border-t" style={{ borderColor: `${gold}15`, background: dark }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ fontFamily: "Inter, sans-serif" }}>
          <p className="text-xs opacity-40" style={{ color: cream }}>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex items-center gap-4 text-xs opacity-40" style={{ color: cream }}>
            <a href="/privacy">Privacy Policy</a>
            <a href="/cookie-policy">Cookie Policy</a>
            <span>Powered by Empire</span>
          </div>
        </div>
      </footer>

      {/* ── WhatsApp FAB ── */}
      {phone && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
