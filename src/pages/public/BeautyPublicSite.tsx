import { useState, useRef, useEffect, forwardRef } from "react";
import DemoAdminAccessButton from "@/components/public/DemoAdminAccessButton";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Scissors, Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Sparkles, CheckCircle, Send, ChevronDown, Instagram,
  Users, Award, Quote, ArrowRight, MessageCircle, Menu, X, ChevronLeft, ChevronRight,
  Eye, Droplets, Gem, Crown, Flower2, Palette, Zap, Shield
} from "lucide-react";

/* ── NEO NAILS / BEAUTY DESIGN SYSTEM — Pastel Lavender + Glass ── */
const B = {
  // Light pastel palette inspired by Neo Nails mockup
  bgGradient: "linear-gradient(165deg, #e8dff5 0%, #f0e6fa 15%, #f5eef8 30%, #fdf0f0 50%, #fce4d6 70%, #f8e8f0 100%)",
  bgSoft: "#f7f0fc",
  bgWhite: "#ffffff",
  bgCard: "rgba(255,255,255,0.72)",
  bgCardHover: "rgba(255,255,255,0.88)",
  purple: "#8b5cf6",
  purpleLight: "#a78bfa",
  purpleSoft: "#c4b5fd",
  lavender: "#ddd6fe",
  rose: "#e879a8",
  peach: "#f9a88e",
  mint: "#86efac",
  sky: "#7dd3fc",
  textDark: "#1e1b2e",
  textMuted: "#6b5f7d",
  textLight: "#9f93b3",
  cardBorder: "rgba(139,92,246,0.12)",
  glassBorder: "rgba(255,255,255,0.5)",
  shadow: "0 4px 24px rgba(139,92,246,0.08), 0 1px 3px rgba(0,0,0,0.04)",
  shadowHover: "0 12px 40px rgba(139,92,246,0.14), 0 4px 12px rgba(0,0,0,0.06)",
};

const fadeUp = {
  hidden: { opacity: 0, y: 24, filter: "blur(4px)" },
  show: (i: number) => ({ opacity: 1, y: 0, filter: "blur(0px)", transition: { delay: i * 0.08, duration: 0.6, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, _ref) => {
    const localRef = useRef(null);
    const isInView = useInView(localRef, { once: true, margin: "-60px" });
    return (
      <section id={id} ref={localRef} className={className} style={style}>
        <motion.div initial={{ opacity: 0, y: 30, filter: "blur(4px)" }} animate={isInView ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}} transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}>
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

interface Props { company: any; afterHero?: React.ReactNode; }

const HERO_IMG = "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1200";

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

/* ── Category Icons (like Neo Nails mockup) ── */
const CATEGORIES = [
  { name: "Nails", emoji: "💅", color: "#c4b5fd" },
  { name: "Massage", emoji: "💆‍♀️", color: "#fda4af" },
  { name: "Wax", emoji: "✨", color: "#fdba74" },
  { name: "Facial", emoji: "🧖‍♀️", color: "#67e8f9" },
  { name: "Lashes", emoji: "👁️", color: "#c084fc" },
  { name: "Hair", emoji: "💇‍♀️", color: "#86efac" },
];

const SERVICES = [
  { name: "Taglio & Styling", icon: Scissors, desc: "Consulenza personalizzata, taglio sartoriale e styling su misura", img: GALLERY[0], price: "€35", duration: "45 min", popular: true },
  { name: "Colorazione Premium", icon: Palette, desc: "Balayage, meches, toni naturali con prodotti eco-luxury", img: GALLERY[1], price: "€55", duration: "90 min", popular: true },
  { name: "Trattamenti Viso", icon: Sparkles, desc: "Pulizia profonda, peeling, radiofrequenza e anti-age", img: GALLERY[4], price: "€45", duration: "60 min", popular: false },
  { name: "Manicure & Nail Art", icon: Gem, desc: "Gel, semipermanente, ricostruzione e nail art d'autore", img: GALLERY[3], price: "€25", duration: "45 min", popular: true },
  { name: "Massaggi & SPA", icon: Flower2, desc: "Rilassanti, decontratturanti, hot stone e percorsi benessere", img: GALLERY[2], price: "€50", duration: "60 min", popular: false },
  { name: "Depilazione Laser", icon: Droplets, desc: "Tecnologia diodo di ultima generazione, risultati permanenti", img: GALLERY[5], price: "€30", duration: "30 min", popular: false },
  { name: "Extension Ciglia", icon: Eye, desc: "One by one, volume russo, effetto naturale o drammatico", img: GALLERY[6], price: "€60", duration: "75 min", popular: false },
  { name: "Trucco Sposa", icon: Crown, desc: "Trucco professionale per eventi, cerimonie e shooting", img: GALLERY[7], price: "€80", duration: "90 min", popular: false },
];

const EXPERIENCES = [
  { title: "Volcano Spa Pedicure", duration: "75 min", price: "€89", desc: "Scrub corpo, massaggio aromaterapico, maschera e manicure premium", img: GALLERY[2], rating: 4.9, reviews: "1.2K", includes: ["Nail grooming", "Cuticle care", "Gel sugar scrub", "Paraffin wax", "Deep massage", "Hot towel wrap"] },
  { title: "Rituale Rose Gold", duration: "2h 30min", price: "€149", desc: "Scrub corpo al sale rosa, massaggio aromaterapico, maschera viso all'oro", img: GALLERY[4], rating: 4.8, reviews: "890", includes: ["Body scrub", "Aromatherapy", "Gold mask", "Manicure"] },
  { title: "Pamper Day Completo", duration: "4h", price: "€239", desc: "Taglio, colore, trattamento viso, massaggio full body", img: GALLERY[1], rating: 5.0, reviews: "2.1K", includes: ["Hair styling", "Full color", "Facial", "Full body massage", "Mani-pedi"] },
];

const EXTRAS = [
  { name: "CBD Oil", emoji: "🌿", price: "+€30" },
  { name: "Dead Sea Salt", emoji: "💎", price: "+€20" },
  { name: "Cupping Therapy", emoji: "🧴", price: "+€20" },
  { name: "Dazzle Dry", emoji: "💅", price: "+€15" },
];

const FAQ_ITEMS = [
  { q: "Come prenoto un appuntamento?", a: "Puoi prenotare online tramite il modulo sul sito, via WhatsApp o telefonicamente. Conferma immediata!" },
  { q: "Utilizzate prodotti cruelty-free?", a: "Assolutamente sì. Lavoriamo esclusivamente con brand eco-luxury certificati vegan e cruelty-free." },
  { q: "Quanto dura un trattamento viso completo?", a: "I trattamenti viso durano da 45 a 90 minuti a seconda del protocollo scelto." },
  { q: "Offrite pacchetti regalo?", a: "Sì! Le nostre Gift Card sono personalizzabili e confezionate in packaging luxury." },
  { q: "C'è il parcheggio?", a: "Sì, disponiamo di parcheggio dedicato e gratuito per i clienti." },
];

export default function BeautyPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [activeCat, setActiveCat] = useState(0);
  const [activeExp, setActiveExp] = useState(0);
  const [serviceScroll, setServiceScroll] = useState(0);
  const serviceRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const onScroll = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", onScroll); return () => window.removeEventListener("scroll", onScroll); }, []);
  useEffect(() => { const t = setInterval(() => setActiveExp(p => (p + 1) % EXPERIENCES.length), 5000); return () => clearInterval(t); }, []);

  // Auto-scroll services carousel
  useEffect(() => {
    const el = serviceRef.current;
    if (!el) return;
    const t = setInterval(() => {
      const maxScroll = el.scrollWidth - el.clientWidth;
      if (el.scrollLeft >= maxScroll - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 280, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(t);
  }, []);

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
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#esperienze", label: "Esperienze" }, { href: "#gallery", label: "Gallery" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];

  const displayFaqs = (faqs.length > 0 ? faqs : FAQ_ITEMS.map((f, i) => ({ id: `fb-${i}`, question: f.q, answer: f.a }))) as any[];
  const popularServices = SERVICES.filter(s => s.popular);

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: B.bgGradient, color: B.textDark }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=Playfair+Display:wght@400;500;600;700&display=swap" rel="stylesheet" />

      {/* ═══ NAVBAR — Frosted Glass ═══ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`}
        style={{ background: navScrolled ? "rgba(255,255,255,0.82)" : "rgba(255,255,255,0.5)", backdropFilter: "blur(24px) saturate(180%)", borderBottom: navScrolled ? "1px solid rgba(139,92,246,0.08)" : "none" }}>
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {company.logo_url ? <motion.img src={company.logo_url} alt="" className="h-8 w-8 rounded-xl object-cover" whileHover={{ scale: 1.1 }} /> :
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: "linear-gradient(135deg, #c4b5fd, #a78bfa)" }}><Flower2 className="w-4 h-4 text-white" /></div>}
            <span className="font-semibold text-base tracking-tight truncate" style={{ fontFamily: "'DM Sans', sans-serif", color: B.textDark }}>{company.name} <span className="text-sm">✨</span></span>
          </div>
          <div className="hidden md:flex gap-6 text-[13px] font-medium" style={{ fontFamily: "'DM Sans', sans-serif", color: B.textMuted }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-purple-600 transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-2">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-semibold text-xs h-9 px-5 hover:scale-105 transition-transform border-0 text-white shadow-lg"
              style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", boxShadow: "0 4px 20px rgba(139,92,246,0.35)" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> Prenota</a>
            </Button>}
            <button className="md:hidden p-2 rounded-xl hover:bg-purple-50 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" style={{ color: B.textDark }} /> : <Menu className="w-5 h-5" style={{ color: B.textDark }} />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: "rgba(255,255,255,0.95)", backdropFilter: "blur(20px)" }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm font-medium hover:text-purple-600 border-b border-purple-50" style={{ color: B.textMuted, fontFamily: "'DM Sans', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO — App-like card layout ═══ */}
      <section id="hero" className="pt-20 pb-8 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            {/* Hero Card with image */}
            <motion.div variants={fadeUp} custom={0} className="relative rounded-[28px] overflow-hidden mb-5" style={{ boxShadow: B.shadow }}>
              <div className="relative aspect-[16/9] sm:aspect-[2.2/1]">
                <img src={HERO_IMG} alt={company.name} className="w-full h-full object-cover" style={{ objectPosition: "center 30%" }} />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(30,27,46,0.55) 100%)" }} />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-8">
                <h1 className="text-2xl sm:text-4xl font-bold text-white leading-tight mb-2" style={{ fontFamily: "'Playfair Display', serif", textShadow: "0 2px 12px rgba(0,0,0,0.3)" }}>
                  {company.tagline || "Your Brickell Retreat"}
                </h1>
                <motion.div variants={fadeUp} custom={1} className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium" style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(8px)", color: B.textDark }}>
                  <Star className="w-3.5 h-3.5 text-yellow-500" fill="#eab308" /> 4.7 · 3K+ reviews
                </motion.div>
              </div>
            </motion.div>

            {/* CTA Buttons — like Neo Nails */}
            <motion.div variants={fadeUp} custom={2} className="flex gap-3 mb-6">
              <Button className="flex-1 rounded-full h-12 text-base font-semibold text-white border-0 shadow-lg active:scale-[0.97] transition-transform"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", boxShadow: "0 8px 30px rgba(139,92,246,0.35)" }}
                onClick={() => scrollTo("prenota")}>
                Book Now
              </Button>
              <Button variant="outline" className="flex-1 rounded-full h-12 text-base font-semibold border-2 active:scale-[0.97] transition-transform"
                style={{ borderColor: "rgba(139,92,246,0.2)", color: B.textDark, background: "rgba(255,255,255,0.6)", backdropFilter: "blur(8px)" }}
                onClick={() => scrollTo("servizi")}>
                Explore
              </Button>
            </motion.div>

            {/* Category Icons Row — like Neo Nails */}
            <motion.div variants={fadeUp} custom={3} className="flex gap-4 overflow-x-auto pb-2 px-1" style={{ scrollbarWidth: "none" }}>
              {CATEGORIES.map((cat, i) => (
                <motion.button key={cat.name} onClick={() => setActiveCat(i)}
                  className="flex flex-col items-center gap-1.5 min-w-[60px] group"
                  whileHover={{ y: -2 }} whileTap={{ scale: 0.95 }}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all ${activeCat === i ? "ring-2 ring-purple-400 ring-offset-2" : ""}`}
                    style={{ background: `${cat.color}30`, boxShadow: activeCat === i ? `0 4px 16px ${cat.color}40` : undefined }}>
                    {cat.emoji}
                  </div>
                  <span className="text-[11px] font-medium" style={{ color: activeCat === i ? B.purple : B.textMuted }}>{cat.name}</span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {afterHero}

      {/* ═══ POPULAR SERVICES — Horizontal scroll cards ═══ */}
      <Section id="servizi" className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif", color: B.textDark }}>Popular</h2>
          <div ref={serviceRef} className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none", scrollSnapType: "x mandatory" }}>
            {SERVICES.map((s, i) => (
              <motion.div key={i} className="min-w-[200px] sm:min-w-[240px] flex-shrink-0 group cursor-pointer" style={{ scrollSnapAlign: "start" }}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ y: -4 }}>
                <div className="rounded-[20px] overflow-hidden transition-all" style={{ background: B.bgCard, border: `1px solid ${B.cardBorder}`, backdropFilter: "blur(12px)", boxShadow: B.shadow }}>
                  <div className="relative h-36 overflow-hidden">
                    <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <div className="p-3.5">
                    <h3 className="font-semibold text-sm mb-0.5" style={{ color: B.purple, fontFamily: "'DM Sans', sans-serif" }}>{s.name}</h3>
                    <p className="text-lg font-bold" style={{ color: B.textDark }}>{s.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ STATS BAR — Glass pills ═══ */}
      <Section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { value: 3200, suffix: "+", label: "Clienti Soddisfatte", icon: "💜" },
              { value: 18, suffix: "+", label: "Anni Esperienza", icon: "⭐" },
              { value: 98, suffix: "%", label: "Tasso di Ritorno", icon: "🔄" },
              { value: 50, suffix: "+", label: "Trattamenti Premium", icon: "✨" },
            ].map((stat, i) => (
              <motion.div key={i} className="rounded-[20px] p-4 text-center transition-all hover:scale-[1.02]"
                style={{ background: B.bgCard, backdropFilter: "blur(12px)", border: `1px solid ${B.cardBorder}`, boxShadow: B.shadow }}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <span className="text-lg mb-1 block">{stat.icon}</span>
                <p className="text-xl font-bold" style={{ color: B.purple }}><AnimatedNum value={stat.value} suffix={stat.suffix} /></p>
                <p className="text-[11px] font-medium mt-0.5" style={{ color: B.textLight }}>{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ ALL SERVICES — Full list ═══ */}
      <Section className="py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Tutti i Servizi</h2>
          <div className="grid sm:grid-cols-2 gap-3">
            {SERVICES.map((s, i) => (
              <motion.div key={i} className="rounded-[20px] p-4 flex gap-4 items-center group cursor-pointer transition-all hover:scale-[1.01]"
                style={{ background: B.bgCard, backdropFilter: "blur(12px)", border: `1px solid ${B.cardBorder}`, boxShadow: B.shadow }}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}
                whileHover={{ boxShadow: B.shadowHover }}>
                <div className="w-16 h-16 rounded-2xl overflow-hidden flex-shrink-0">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" loading="lazy" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-sm" style={{ color: B.textDark }}>{s.name}</h3>
                  <p className="text-xs mt-0.5 line-clamp-1" style={{ color: B.textLight }}>{s.desc}</p>
                  <div className="flex items-center gap-3 mt-1.5">
                    <span className="font-bold text-sm" style={{ color: B.purple }}>{s.price}</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-medium" style={{ background: `${B.purple}12`, color: B.purple }}>{s.duration}</span>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: B.purple }} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ ESPERIENZE — Featured Package (like Volcano Spa Pedicure mockup) ═══ */}
      <Section id="esperienze" className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Esperienze Esclusive</h2>
          
          {/* Featured experience card */}
          <AnimatePresence mode="wait">
            <motion.div key={activeExp} className="rounded-[28px] overflow-hidden" style={{ boxShadow: B.shadowHover }}
              initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
              {/* Full-width image */}
              <div className="relative aspect-[16/10] sm:aspect-[2.5/1]">
                <img src={EXPERIENCES[activeExp].img} alt={EXPERIENCES[activeExp].title} className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(180deg, transparent 30%, rgba(255,255,255,0.95) 100%)" }} />
              </div>
              {/* Content overlay */}
              <div className="relative -mt-20 z-10 px-5 pb-5">
                <div className="rounded-[20px] p-5" style={{ background: B.bgCard, backdropFilter: "blur(16px)", border: `1px solid ${B.glassBorder}` }}>
                  <h3 className="text-xl font-bold mb-1" style={{ fontFamily: "'Playfair Display', serif", color: B.textDark }}>{EXPERIENCES[activeExp].title}</h3>
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-2xl font-bold" style={{ color: B.purple }}>{EXPERIENCES[activeExp].price}</span>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-yellow-500" fill="#eab308" />
                      <span className="text-sm font-medium" style={{ color: B.textDark }}>{EXPERIENCES[activeExp].rating}</span>
                      <span className="text-xs" style={{ color: B.textLight }}>({EXPERIENCES[activeExp].reviews} Reviews)</span>
                    </div>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: "rgba(0,0,0,0.06)", color: B.textDark }}>{EXPERIENCES[activeExp].duration}</span>
                  </div>
                  <p className="text-sm mb-4 leading-relaxed" style={{ color: B.textMuted }}>{EXPERIENCES[activeExp].desc}</p>

                  {/* What's Included */}
                  <div className="rounded-2xl p-4 mb-4" style={{ background: "rgba(255,255,255,0.5)", border: "1px solid rgba(139,92,246,0.06)" }}>
                    <h4 className="font-bold text-sm mb-2" style={{ color: B.textDark }}>What's Included</h4>
                    <div className="grid grid-cols-2 gap-1.5">
                      {EXPERIENCES[activeExp].includes.map((item, j) => (
                        <div key={j} className="flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 flex-shrink-0" style={{ color: B.purple }} />
                          <span className="text-xs" style={{ color: B.textMuted }}>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Enhance Your Experience — Extras */}
                  <p className="font-semibold text-sm mb-2" style={{ color: B.purple, fontStyle: "italic" }}>Enhance Your Experience</p>
                  <div className="flex gap-2 overflow-x-auto pb-2" style={{ scrollbarWidth: "none" }}>
                    {EXTRAS.map((ex, j) => (
                      <div key={j} className="min-w-[90px] rounded-xl p-3 text-center flex-shrink-0 transition-all hover:scale-105 cursor-pointer"
                        style={{ background: "rgba(255,255,255,0.6)", border: `1px solid ${B.cardBorder}` }}>
                        <span className="text-xl block mb-1">{ex.emoji}</span>
                        <p className="text-[10px] font-medium" style={{ color: B.textDark }}>{ex.name}</p>
                        <p className="text-[10px] font-bold" style={{ color: B.purple }}>{ex.price}</p>
                      </div>
                    ))}
                  </div>

                  {/* Book Now CTA */}
                  <Button className="w-full rounded-full h-12 mt-4 text-base font-bold text-white border-0 shadow-lg active:scale-[0.97] transition-transform"
                    style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", boxShadow: "0 8px 30px rgba(139,92,246,0.35)" }}
                    onClick={() => scrollTo("prenota")}>
                    Book Now · {EXPERIENCES[activeExp].price}
                  </Button>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Experience dots */}
          <div className="flex justify-center gap-2 mt-4">
            {EXPERIENCES.map((_, i) => (
              <button key={i} onClick={() => setActiveExp(i)}
                className="w-2.5 h-2.5 rounded-full transition-all"
                style={{ background: i === activeExp ? B.purple : `${B.purple}25`, transform: i === activeExp ? "scale(1.3)" : undefined }} />
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ GALLERY — Masonry grid ═══ */}
      <Section id="gallery" className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-5" style={{ fontFamily: "'Playfair Display', serif" }}>Il Nostro Spazio</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map((img, i) => {
              const isLarge = i === 0 || i === 5;
              return (
                <motion.div key={i}
                  className={`relative overflow-hidden rounded-[20px] group cursor-pointer ${isLarge ? "col-span-2 row-span-2" : ""}`}
                  style={{ aspectRatio: isLarge ? "1" : "3/4" }}
                  initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }} transition={{ delay: i * 0.06, duration: 0.5 }}
                  whileHover={{ scale: 1.02 }}>
                  <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <motion.div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity" initial={false}>
                    <Badge className="text-[10px] border-0 text-white" style={{ background: "rgba(139,92,246,0.8)" }}>{SERVICES[i]?.name || "Premium"}</Badge>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </Section>

      {/* ═══ WHY US ═══ */}
      <Section className="py-10 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-xl font-bold mb-5 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Perché Sceglierci</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {[
              { icon: Award, title: "Professionisti Certificati", desc: "Team con formazione nelle migliori accademie europee" },
              { icon: Heart, title: "Prodotti Eco-Luxury", desc: "Solo brand certificati vegan e cruelty-free" },
              { icon: Sparkles, title: "Cura Personalizzata", desc: "Consulenza gratuita per ogni trattamento" },
              { icon: Calendar, title: "Prenotazione Istantanea", desc: "Online in pochi click con conferma immediata" },
              { icon: Shield, title: "Garanzia Soddisfazione", desc: "Non sei soddisfatta? Rifacciamo il trattamento" },
              { icon: Zap, title: "Tecnologie Avanzate", desc: "Laser diodo, LED therapy, radiofrequenza" },
            ].map((item, i) => (
              <motion.div key={i} className="rounded-[20px] p-5 text-center transition-all hover:scale-[1.02]"
                style={{ background: B.bgCard, backdropFilter: "blur(12px)", border: `1px solid ${B.cardBorder}`, boxShadow: B.shadow }}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                whileHover={{ boxShadow: B.shadowHover }}>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${B.purple}12` }}>
                  <item.icon className="w-5 h-5" style={{ color: B.purple }} />
                </div>
                <h3 className="font-semibold text-sm mb-1" style={{ color: B.textDark }}>{item.title}</h3>
                <p className="text-xs" style={{ color: B.textLight }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ TESTIMONIALS — Glass cards ═══ */}
      <Section id="recensioni" className="py-10 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-xl font-bold mb-5 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Cosa Dicono di Noi</h2>
          <div className="flex gap-3 overflow-x-auto pb-3" style={{ scrollbarWidth: "none" }}>
            {FALLBACK_REVIEWS.map((r, i) => (
              <motion.div key={i} className="min-w-[260px] sm:min-w-[300px] flex-shrink-0 rounded-[20px] p-5 transition-all"
                style={{ background: B.bgCard, backdropFilter: "blur(12px)", border: `1px solid ${B.cardBorder}`, boxShadow: B.shadow }}
                initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                <div className="flex items-center gap-3 mb-3">
                  <img src={r.photo} alt={r.name} className="w-10 h-10 rounded-full object-cover" style={{ border: `2px solid ${B.lavender}` }} />
                  <div>
                    <p className="font-semibold text-sm" style={{ color: B.textDark }}>{r.name}</p>
                    <p className="text-[10px]" style={{ color: B.textLight }}>{r.city}</p>
                  </div>
                </div>
                <div className="flex gap-0.5 mb-2">
                  {Array.from({ length: 5 }).map((_, j) => (
                    <Star key={j} className="w-3.5 h-3.5" style={{ color: j < r.rating ? "#eab308" : "#e5e7eb" }} fill={j < r.rating ? "#eab308" : "none"} />
                  ))}
                </div>
                <p className="text-xs leading-relaxed" style={{ color: B.textMuted }}>"{r.text}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      <Section className="py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-xl font-bold mb-5 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Domande Frequenti</h2>
          <div className="space-y-2">
            {displayFaqs.map((faq: any) => (
              <details key={faq.id} className="group rounded-[16px] p-4 transition-all cursor-pointer" style={{ background: B.bgCard, backdropFilter: "blur(12px)", border: `1px solid ${B.cardBorder}` }}>
                <summary className="font-medium text-sm list-none flex justify-between items-center" style={{ color: B.textDark }}>
                  {faq.question || faq.q} <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" style={{ color: B.textLight }} />
                </summary>
                <p className="text-sm mt-3 leading-relaxed" style={{ color: B.textMuted }}>{faq.answer || faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ BOOKING FORM — Glass card ═══ */}
      <Section id="prenota" className="py-10 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="text-xl font-bold mb-5 text-center" style={{ fontFamily: "'Playfair Display', serif" }}>Prenota il tuo Trattamento</h2>
          <div className="rounded-[24px] p-6" style={{ background: B.bgCard, backdropFilter: "blur(16px)", border: `1px solid ${B.glassBorder}`, boxShadow: B.shadowHover }}>
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs font-medium" style={{ color: B.textMuted }}>Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="mt-1 h-11 rounded-xl border-purple-100 bg-white/60 focus:ring-purple-300" placeholder="Il tuo nome" /></div>
                <div><Label className="text-xs font-medium" style={{ color: B.textMuted }}>Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="mt-1 h-11 rounded-xl border-purple-100 bg-white/60 focus:ring-purple-300" placeholder="+39..." /></div>
              </div>
              <div>
                <Label className="text-xs font-medium" style={{ color: B.textMuted }}>Servizio</Label>
                <select value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className="w-full mt-1 h-11 rounded-xl px-3 text-sm bg-white/60 border border-purple-100 focus:ring-purple-300 outline-none" style={{ color: B.textDark }}>
                  <option value="">Seleziona un servizio</option>
                  {SERVICES.map(s => <option key={s.name} value={s.name}>{s.name} — {s.price}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs font-medium" style={{ color: B.textMuted }}>Data</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="mt-1 h-11 rounded-xl border-purple-100 bg-white/60" /></div>
                <div><Label className="text-xs font-medium" style={{ color: B.textMuted }}>Ora</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="mt-1 h-11 rounded-xl border-purple-100 bg-white/60" /></div>
              </div>
              <Button className="w-full rounded-full h-12 text-base font-bold text-white border-0 shadow-lg active:scale-[0.97] transition-transform"
                style={{ background: "linear-gradient(135deg, #8b5cf6, #a78bfa)", boxShadow: "0 8px 30px rgba(139,92,246,0.35)" }}
                disabled={submitting} onClick={handleSubmit}>
                {submitting ? "Invio..." : "Prenota Appuntamento"}
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-4" style={{ background: "rgba(255,255,255,0.4)", backdropFilter: "blur(12px)", borderTop: `1px solid ${B.cardBorder}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <h3 className="font-bold text-base mb-3" style={{ fontFamily: "'Playfair Display', serif", color: B.textDark }}>{company.name} ✨</h3>
              <p className="text-xs leading-relaxed" style={{ color: B.textMuted }}>Beauty & Wellness Premium. Trattamenti esclusivi, prodotti eco-luxury e staff dedicato alla tua bellezza.</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: B.textDark }}>Contatti</h4>
              <div className="space-y-2">
                {phone && <a href={`tel:${phone}`} className="flex items-center gap-2 text-xs hover:text-purple-600 transition-colors" style={{ color: B.textMuted }}><Phone className="w-3.5 h-3.5" /> {phone}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-2 text-xs hover:text-purple-600 transition-colors" style={{ color: B.textMuted }}><Mail className="w-3.5 h-3.5" /> {company.email}</a>}
                {company.address && <p className="flex items-center gap-2 text-xs" style={{ color: B.textMuted }}><MapPin className="w-3.5 h-3.5" /> {company.address}</p>}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3" style={{ color: B.textDark }}>Orari</h4>
              <div className="space-y-1 text-xs" style={{ color: B.textMuted }}>
                <p>Lun - Ven: 9:00 - 20:00</p>
                <p>Sabato: 9:00 - 18:00</p>
                <p>Domenica: Chiuso</p>
              </div>
            </div>
          </div>
          <div className="border-t pt-6 text-center" style={{ borderColor: B.cardBorder }}>
            <p className="text-[11px]" style={{ color: B.textLight }}>© {new Date().getFullYear()} {company.name}. Powered by Empire AI Platform</p>
          </div>
        </div>
      </footer>

      {/* Admin Access Button */}
      <DemoAdminAccessButton sector="beauty" accentColor="#8b5cf6" />
    </div>
  );
}
