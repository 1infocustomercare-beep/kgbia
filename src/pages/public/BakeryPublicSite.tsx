import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
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

const FALLBACK_REVIEWS = [
  { name: "Giulia M.", text: "Il pane più buono che abbia mai assaggiato. Fragranza incredibile e crosta perfetta.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Marco R.", text: "I croissant sono una poesia. Burro francese e sfoglia perfetta. Vado ogni mattina!", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Anna L.", text: "Torta della Nonna prenotata per il compleanno: un capolavoro. Complimenti al maestro!", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { name: "Roberto P.", text: "Focaccia genovese spettacolare. Ingredienti bio e lievitazione naturale fanno la differenza.", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
];

const FAQ_ITEMS = [
  { q: "A che ora aprite?", a: "Apriamo alle 6:30 del mattino per garantirvi prodotti appena sfornati. Chiudiamo alle 19:30." },
  { q: "Posso pre-ordinare torte e dolci personalizzati?", a: "Assolutamente sì! Compilate il modulo pre-ordini sul sito o chiamateci. Consigliamo almeno 48h di anticipo per le torte personalizzate." },
  { q: "Utilizzate farine biologiche?", a: "Sì, utilizziamo farine biologiche macinate a pietra da mulini selezionati e lievito madre centenario." },
  { q: "Avete opzioni senza glutine?", a: "Offriamo una selezione di prodotti senza glutine preparati in un'area dedicata per evitare contaminazioni." },
  { q: "Fate consegne a domicilio?", a: "Sì, effettuiamo consegne nella zona. Per ordini superiori a €30 la consegna è gratuita." },
];

export default function BakeryPublicSite({ company }: Props) {
  const brown = "#6B3A2A";
  const creamBg = "#F5E6CC";
  const pink = "#E8B4B8";
  const companyId = company.id;

  const { data: contentBlocks = [] } = useQuery({
    queryKey: ["bakery-pub-content", companyId],
    queryFn: async () => { const { data } = await supabase.from("content_blocks").select("*").eq("company_id", companyId); return data || []; },
  });

  const [form, setForm] = useState({ name: "", phone: "", product: "", date: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleOrder = async () => {
    if (!form.name || !form.phone || !form.product) { toast.error("Compila i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, source: "website", notes: `Pre-ordine: ${form.product}, Ritiro: ${form.date}, Note: ${form.notes}` });
      toast.success("Pre-ordine ricevuto! Ti contatteremo per conferma.");
      setForm({ name: "", phone: "", product: "", date: "", notes: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const name = company.name || "Panificio Artigianale";
  const tagline = company.tagline || "Fatto con Amore Ogni Giorno";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const products = [
    { name: "Croissant al Burro", price: "1.80", img: "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=600", tag: "Classico" },
    { name: "Pane di Campagna", price: "4.50", img: "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Lievito Madre" },
    { name: "Torta della Nonna", price: "22.00", img: "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Su ordinazione", preorder: true },
    { name: "Focaccia Genovese", price: "3.50", img: "https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Tradizionale" },
    { name: "Cannoli Siciliani", price: "3.00", img: "https://images.pexels.com/photos/6163263/pexels-photo-6163263.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Dolce" },
    { name: "Biscotti Artigianali", price: "8.00/kg", img: "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=600", tag: "Assortiti" },
  ];

  const allergenIcons = ["🌾 Glutine", "🥚 Uova", "🥛 Latte", "🥜 Frutta a guscio", "🫘 Soia"];

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
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

  const HERO_VIDEO = "https://videos.pexels.com/video-files/7964583/7964583-uhd_2560_1440_25fps.mp4";
  const tickerItems = ["Pane Fresco", "Cornetti", "Focaccia", "Torte Artigianali", "Lievito Madre", "Farine Bio", "Biscotti", "Dolci Tipici", "Pizza al Taglio", "Cannoli"];
  const navLinks = ["Vetrina", "Chi Siamo", "Recensioni", "Pre-ordina", "Contatti"];

  return (
    <div style={{ fontFamily: "'Dancing Script', cursive", background: creamBg, color: brown }}>
      <link href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;600;700&family=Nunito:wght@300;400;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${navScrolled ? "shadow-lg" : ""}`} style={{ background: `${creamBg}F5`, backdropFilter: "blur(20px)", borderBottom: `2px solid ${brown}15` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {company.logo_url ? <motion.img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" whileHover={{ scale: 1.1 }} /> :
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${pink}20` }}><Wheat className="w-5 h-5" style={{ color: brown }} /></div>}
            <div className="min-w-0">
              <span className="text-xl font-bold truncate block" style={{ color: brown }}>{name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>PANIFICIO ARTIGIANALE</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm tracking-wider font-medium hover:opacity-100 opacity-60 transition" style={{ color: brown, fontFamily: "'Nunito', sans-serif" }}>{item}</a>
            ))}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-5" style={{ background: brown, color: creamBg, fontFamily: "'Nunito', sans-serif" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> CHIAMA</a>
            </Button>}
            <button className="md:hidden p-2 rounded-xl" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: creamBg, borderTop: `1px solid ${brown}15` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(item => <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${brown}10`, color: brown, fontFamily: "'Nunito', sans-serif" }}>{item}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={bakeryHeroPoster} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.5) saturate(1.04)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${brown}70 0%, ${brown}8A 60%, ${brown}B3 100%)` }} />
        <div className="absolute inset-0 opacity-[0.09]" style={{ backgroundImage: `radial-gradient(circle, ${creamBg}80 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <motion.div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white pt-20" style={{ y: heroY }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-sm font-medium" style={{ background: `${creamBg}15`, border: `1px solid ${creamBg}30`, color: creamBg, fontFamily: "'Nunito', sans-serif" }}>
              <Sparkles className="w-4 h-4" /> Panificio Artigianale
            </motion.div>
            <motion.div variants={fadeUp} custom={1}><Wheat className="w-10 h-10 mx-auto mb-4" style={{ color: creamBg }} /></motion.div>
            <motion.h1 variants={fadeUp} custom={2} className="text-5xl sm:text-7xl lg:text-8xl font-bold mb-5 leading-[1.05]">
              {tagline.split("").map((char, i) => (
                <motion.span key={i} initial={{ opacity: 0, y: 30, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ delay: 0.6 + i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  style={{ display: "inline-block", color: i % 5 === 0 ? pink : creamBg }}>
                  {char === " " ? "\u00A0" : char}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p variants={fadeUp} custom={3} className="text-lg sm:text-xl opacity-70 mb-10" style={{ fontFamily: "'Nunito', sans-serif", color: creamBg }}>Tradizione artigianale dal {company.founded_year || 1985}</motion.p>
            <motion.div variants={fadeUp} custom={4} className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#vetrina"><Button className="px-10 h-14 text-base font-semibold rounded-xl shadow-2xl" style={{ background: creamBg, color: brown, fontFamily: "'Nunito', sans-serif", boxShadow: `0 20px 60px -15px rgba(0,0,0,0.4)` }}>Scopri i Prodotti</Button></a>
              <a href="#pre-ordina"><Button variant="outline" className="px-10 h-14 text-base rounded-xl hover:bg-white/10" style={{ borderColor: `${creamBg}50`, color: creamBg, fontFamily: "'Nunito', sans-serif" }}>Pre-ordina una Torta</Button></a>
            </motion.div>
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5" style={{ color: `${creamBg}50` }} />
        </motion.div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden py-4" style={{ background: brown }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium" style={{ color: `${creamBg}40`, fontFamily: "'Nunito', sans-serif" }}>
              <Wheat className="w-3 h-3" style={{ color: `${pink}60` }} /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* STATS */}
      <Section className="py-16 px-4" style={{ background: "#fff" } as any}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: 38, suffix: "+", label: "Anni di Tradizione" },
            { value: 50, suffix: "+", label: "Prodotti al Giorno" },
            { value: 100, suffix: "%", label: "Ingredienti Naturali" },
            { value: 3000, suffix: "+", label: "Clienti Felici" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: brown }}><AnimatedNum value={s.value} suffix={s.suffix} /></p>
              <p className="text-[11px] uppercase tracking-[0.15em] mt-2" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* VETRINA — auto-carousel */}
      <Section id="vetrina" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <Cake className="w-8 h-8 mx-auto mb-3" style={{ color: pink }} />
            <h2 className="text-4xl sm:text-5xl font-bold" style={{ color: brown }}>La Nostra Vetrina</h2>
            <p className="mt-3 text-sm opacity-60" style={{ fontFamily: "'Nunito', sans-serif" }}>Tutto preparato fresco ogni mattina</p>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {products.map((p, i) => (
                <motion.div key={i} className="flex-shrink-0 w-[280px] sm:w-[320px] snap-start" whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <Card className="overflow-hidden group shadow-md border-0 hover:shadow-xl transition-shadow">
                    <div className="h-48 overflow-hidden relative">
                      <img src={p.img} alt={p.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      <Badge className="absolute top-3 left-3 text-xs" style={{ background: p.preorder ? `${pink}` : `${brown}CC`, color: "#fff", fontFamily: "'Nunito', sans-serif" }}>
                        {p.tag}
                      </Badge>
                    </div>
                    <CardContent className="p-5" style={{ background: "#fff" }}>
                      <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold" style={{ color: brown }}>{p.name}</h3>
                        <span className="text-lg font-bold" style={{ color: brown, fontFamily: "'Nunito', sans-serif" }}>€{p.price}</span>
                      </div>
                      {p.preorder && (
                        <a href="#pre-ordina" className="mt-3 inline-flex items-center gap-1 text-sm" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>
                          <ShoppingBag className="w-4 h-4" /> Pre-ordina
                        </a>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronLeft className="w-5 h-5" style={{ color: brown }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronRight className="w-5 h-5" style={{ color: brown }} />
            </button>
          </div>

          {/* Allergens notice */}
          <div className="mt-10 p-4 rounded-xl text-center" style={{ background: `${brown}08`, border: `1px solid ${brown}15` }}>
            <div className="flex items-center justify-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4" style={{ color: brown }} />
              <p className="text-sm font-semibold" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>Informazioni Allergeni (Reg. UE 1169/2011)</p>
            </div>
            <div className="flex flex-wrap justify-center gap-3">
              {allergenIcons.map(a => <span key={a} className="text-xs px-3 py-1 rounded-full" style={{ background: `${brown}10`, color: brown, fontFamily: "'Nunito', sans-serif" }}>{a}</span>)}
            </div>
            <p className="text-xs mt-2 opacity-50" style={{ fontFamily: "'Nunito', sans-serif" }}>Per la lista completa degli allergeni, chiedi al nostro staff.</p>
          </div>
        </div>
      </Section>

      {/* CHI SIAMO */}
      <Section id="chi-siamo" className="py-20" style={{ background: "#fff" } as any}>
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div variants={fadeUp} custom={0} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <p className="text-[10px] uppercase tracking-[0.25em] mb-3 font-semibold" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>LA NOSTRA STORIA</p>
            <h2 className="text-4xl font-bold mb-6" style={{ color: brown }}>Passione dal {company.founded_year || 1985}</h2>
            <p className="text-base leading-relaxed mb-6 opacity-70" style={{ fontFamily: "'Nunito', sans-serif" }}>
              Da generazioni portiamo sulle tavole il profumo del pane appena sfornato. Ogni impasto è curato con ingredienti selezionati, farine macinate a pietra e lievito madre centenario. La nostra passione è la vostra colazione.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Wheat, text: "Farine Bio" },
                { icon: Heart, text: "Fatto a Mano" },
                { icon: Award, text: "Tradizione dal 1985" },
                { icon: CookingPot, text: "Lievito Madre" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>
                  <Icon className="w-4 h-4" style={{ color: pink }} /> {text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div variants={fadeUp} custom={2} initial="hidden" whileInView="show" viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-square">
              <img src="https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Baker" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section className="py-16 px-4" style={{ background: `${brown}06` } as any}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: brown }}>Il Nostro Laboratorio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {[
              "https://images.pexels.com/photos/1070945/pexels-photo-1070945.jpeg?auto=compress&cs=tinysrgb&w=800",
              "https://images.pexels.com/photos/2135/food-france-morning-breakfast.jpg?auto=compress&cs=tinysrgb&w=800",
              "https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800",
              "https://images.pexels.com/photos/291528/pexels-photo-291528.jpeg?auto=compress&cs=tinysrgb&w=800",
              "https://images.pexels.com/photos/1387070/pexels-photo-1387070.jpeg?auto=compress&cs=tinysrgb&w=800",
              "https://images.pexels.com/photos/230325/pexels-photo-230325.jpeg?auto=compress&cs=tinysrgb&w=800",
            ].map((img, i) => (
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

      {/* REVIEWS */}
      <Section id="recensioni" className="py-16 sm:py-24" style={{ background: "#fff" } as any}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>TESTIMONIANZE</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: brown }}>Cosa Dicono i Clienti</h2>
          </div>
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: `${creamBg}80`, border: `1px solid ${brown}10` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${pink}50` }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: brown, fontFamily: "'Nunito', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill="#F59E0B" style={{ color: "#F59E0B" }} />)}</div>
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${pink}40` }} />
                <p className="text-lg italic leading-relaxed" style={{ color: brown, fontFamily: "'Nunito', sans-serif" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? brown : `${brown}30`, transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* PRE-ORDINA */}
      <Section id="pre-ordina" className="py-20 sm:py-28" style={{ background: `${brown}` } as any}>
        <div className="max-w-lg mx-auto px-6 text-center">
          <Cake className="w-10 h-10 mx-auto mb-4" style={{ color: creamBg }} />
          <h2 className="text-4xl font-bold mb-2" style={{ color: creamBg }}>Pre-ordina</h2>
          <p className="text-sm mb-8 opacity-70" style={{ color: creamBg, fontFamily: "'Nunito', sans-serif" }}>Torte, dolci e prodotti speciali su ordinazione</p>
          <Card className="p-6 text-left" style={{ background: `${creamBg}`, border: "none" }}>
            <div className="space-y-4" style={{ fontFamily: "'Nunito', sans-serif" }}>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome" /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Prodotto *</label><Input value={form.product} onChange={e => setForm({ ...form, product: e.target.value })} placeholder="Es: Torta della Nonna per 8 persone" /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Data Ritiro</label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: brown }}>Note</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={2} placeholder="Allergie, decorazioni..." /></div>
            </div>
            <Button onClick={handleOrder} disabled={submitting} className="w-full mt-6 py-5 text-lg font-semibold" style={{ background: brown, color: creamBg }}>
              {submitting ? "Invio..." : "Invia Pre-ordine"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16 sm:py-24" style={{ background: "#fff" } as any}>
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: pink, fontFamily: "'Nunito', sans-serif" }}>DOMANDE FREQUENTI</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: brown }}>FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden" style={{ background: `${creamBg}60`, border: `1px solid ${brown}10` }}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: pink }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed opacity-70" style={{ fontFamily: "'Nunito', sans-serif", color: brown }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectorValueProposition sectorKey="bakery" accentColor={brown} darkMode={false} sectorLabel="Panificio" />
      <AutomationShowcase accentColor={brown} accentBg="bg-amber-800" sectorName="panifici e pasticcerie" darkMode={false} />

      {/* CONTATTI + FOOTER */}
      <Section id="contatti" className="py-16" style={{ background: "#fff" } as any}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold mb-8" style={{ color: brown }}>Vieni a Trovarci</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-10" style={{ fontFamily: "'Nunito', sans-serif" }}>
            {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-6 h-6" style={{ color: pink }} /><p className="text-sm">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
            {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-6 h-6" style={{ color: pink }} /><a href={`tel:${phone}`} className="text-sm">{phone}</a></div>}
            <div className="flex flex-col items-center gap-2"><Clock className="w-6 h-6" style={{ color: pink }} /><p className="text-sm">Lun-Dom 06:30 – 19:30</p></div>
          </div>
        </div>
      </Section>

      <footer className="py-6 border-t" style={{ borderColor: `${brown}15`, background: brown }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-3" style={{ fontFamily: "'Nunito', sans-serif" }}>
          <p className="text-xs" style={{ color: `${creamBg}40` }}>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex gap-4 text-xs" style={{ color: `${creamBg}40` }}><a href="/privacy">Privacy</a><span>Powered by Empire.AI</span></div>
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
