import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumStatsBar, PremiumFAQ } from "@/components/public/PremiumSiteKit";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Phone, Clock, Calendar, Dumbbell, Flame, Heart, Zap, Users,
  Target, Timer, ArrowRight, MessageCircle, Trophy, ChevronDown, Star, MapPin, Mail, Menu, X, ChevronLeft, ChevronRight, Sparkles, Shield, Quote, Award, CheckCircle
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-features.mp4";

/* ─── NEON VOLT + CARBON BLACK AESTHETIC ─── */
const VOLT = "#AAFF00";
const CARBON = "#0a0a0a";
const STEEL = "#1a1a1f";

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

const HERO_VIDEO = "https://videos.pexels.com/video-files/3195530/3195530-uhd_2560_1440_25fps.mp4";
const GALLERY = [
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const FALLBACK_REVIEWS = [
  { name: "Luca P.", text: "Da quando mi alleno qui la mia vita è cambiata. Trainer preparatissimi e attrezzatura top!", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Sofia R.", text: "Le classi di yoga sono fantastiche. Atmosfera rilassante e istruttrice eccezionale.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Andrea M.", text: "CrossFit ad altissimo livello. Programmazione scientifica e community straordinaria.", rating: 5, photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Elena B.", text: "Pulitissima, moderna e con orari flessibili. Il piano PT è stato un investimento incredibile.", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

const FAQ_ITEMS = [
  { q: "Posso provare prima di iscrivermi?", a: "Certamente! Offriamo una sessione di prova gratuita. Compila il modulo e ti contatteremo." },
  { q: "Quali sono gli orari di apertura?", a: "Lun-Ven 6:00-22:00, Sab 8:00-20:00, Dom 9:00-14:00. Il piano Elite include accesso 24/7." },
  { q: "Posso congelare l'abbonamento?", a: "Sì, con i piani Pro ed Elite puoi sospendere fino a 30 giorni all'anno." },
  { q: "Avete personal trainer?", a: "Sì, 15+ personal trainer certificati. Sessioni singole o pacchetti mensili." },
  { q: "C'è un parcheggio?", a: "Sì, parcheggio gratuito riservato ai soci con oltre 50 posti auto." },
];

export default function FitnessPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const name = company.name || "Fitness Club";
  const tagline = company.tagline || "Trasforma il Tuo Corpo";
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

  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleLead = async () => {
    if (!form.name || !form.phone) { toast.error("Nome e telefono obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, email: form.email, source: "website", notes: form.interest });
      toast.success("Richiesta inviata!");
      setForm({ name: "", phone: "", email: "", interest: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const navLinks = [{ href: "#chi-siamo", label: "Chi Siamo" }, { href: "#classi", label: "Classi" }, { href: "#piani", label: "Piani" }, { href: "#recensioni", label: "Recensioni" }, { href: "#iscriviti", label: "Iscriviti" }];
  const tickerItems = ["CROSSFIT", "YOGA", "HIIT", "PILATES", "BOXING", "FUNCTIONAL", "SPINNING", "ZUMBA", "CALISTHENICS", "STRETCHING"];

  const classes = [
    { name: "CrossFit", icon: Flame, time: "07:00", trainer: "Marco R.", spots: 3, color: "#FF4444", img: GALLERY[0] },
    { name: "Yoga Flow", icon: Heart, time: "09:00", trainer: "Sara M.", spots: 8, color: "#9B59B6", img: GALLERY[1] },
    { name: "HIIT Extreme", icon: Zap, time: "12:00", trainer: "Luca P.", spots: 2, color: VOLT, img: GALLERY[2] },
    { name: "Pilates", icon: Target, time: "17:00", trainer: "Giulia B.", spots: 5, color: "#2ECC71", img: GALLERY[3] },
    { name: "Boxing", icon: Trophy, time: "18:30", trainer: "Alex V.", spots: 4, color: "#E74C3C", img: GALLERY[4] },
    { name: "Functional", icon: Dumbbell, time: "19:30", trainer: "Marco R.", spots: 6, color: "#3498DB", img: GALLERY[5] },
  ];

  const transformations = [
    { label: "Forza", before: 40, after: 92 },
    { label: "Resistenza", before: 35, after: 88 },
    { label: "Flessibilità", before: 25, after: 78 },
    { label: "Composizione", before: 50, after: 85 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Bebas Neue', sans-serif", background: CARBON, color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Bebas+Neue&family=Barlow:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR — brutalist industrial */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: `${CARBON}EE`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${VOLT}30` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-lg object-cover" />}
            <div>
              <span className="text-xl tracking-[0.15em]" style={{ color: VOLT }}>{name.toUpperCase()}</span>
              <span className="text-[8px] tracking-[0.3em] uppercase block font-medium text-white/30" style={{ fontFamily: "'Barlow', sans-serif" }}>PERFORMANCE CLUB</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-[11px] tracking-[0.25em] uppercase font-medium text-white/30 hover:text-white transition" style={{ fontFamily: "'Barlow', sans-serif" }}>{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button className="px-6 text-sm tracking-[0.15em] hidden sm:flex border-0 rounded-none" style={{ background: VOLT, color: CARBON, fontFamily: "'Bebas Neue', sans-serif", fontSize: "15px" }} onClick={() => scrollTo("iscriviti")}>ISCRIVITI</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: CARBON, borderTop: `1px solid ${VOLT}15` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/40 border-b border-white/5" style={{ fontFamily: "'Barlow', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — glitch-style brutalist */}
      <section id="hero" className="relative min-h-[100svh] flex items-end pb-16 sm:pb-24 overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={GALLERY[0]} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.35) contrast(1.2) saturate(0.8)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${CARBON}44 0%, ${CARBON}CC 70%, ${CARBON} 100%)` }} />
        {/* Grid overlay */}
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${VOLT}30 1px, transparent 1px), linear-gradient(90deg, ${VOLT}30 1px, transparent 1px)`, backgroundSize: "60px 60px" }} />

        <div className="relative z-10 max-w-7xl mx-auto px-5 pt-20 w-full">
          <motion.div initial={{ opacity: 0, x: -60 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
            <motion.div initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ delay: 0.3, duration: 0.6 }} className="h-[3px] mb-8" style={{ background: VOLT }} />
            <h1 className="text-6xl sm:text-8xl lg:text-[10rem] font-normal leading-[0.85] tracking-[0.02em] mb-6">
              <span className="block text-white/90">TRAIN</span>
              <span className="block" style={{ color: VOLT, textShadow: `0 0 60px ${VOLT}33` }}>HARDER</span>
            </h1>
            <p className="text-sm sm:text-base text-white/40 max-w-md mb-10 leading-relaxed" style={{ fontFamily: "'Barlow', sans-serif" }}>{tagline}</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="px-10 py-6 text-lg tracking-[0.2em] rounded-none border-0 shadow-2xl" style={{ background: VOLT, color: CARBON, fontFamily: "'Bebas Neue', sans-serif", boxShadow: `0 20px 60px -15px ${VOLT}44` }} onClick={() => scrollTo("iscriviti")}>PROVA GRATUITA</Button>
              <Button variant="outline" className="px-10 py-6 text-lg tracking-[0.2em] rounded-none text-white" style={{ borderColor: "#fff2", fontFamily: "'Bebas Neue', sans-serif" }} onClick={() => scrollTo("classi")}>LE CLASSI</Button>
            </div>
          </motion.div>

          {/* Floating stats on hero */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.8, duration: 0.8 }}
            className="mt-16 flex gap-8 flex-wrap">
            {[{ v: "500+", l: "ATLETI" }, { v: "20+", l: "CLASSI/SETT" }, { v: "15", l: "COACH" }, { v: "1500m²", l: "STRUTTURA" }].map((s, i) => (
              <div key={i} className="border-l-2 pl-4" style={{ borderColor: `${VOLT}40` }}>
                <p className="text-2xl sm:text-3xl" style={{ color: VOLT }}>{s.v}</p>
                <p className="text-[9px] tracking-[0.2em] text-white/30 mt-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{s.l}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {afterHero}

      {/* TICKER — Neon Volt */}
      <div className="overflow-hidden py-4 relative" style={{ background: STEEL }}>
        <MarqueeCarousel speed={25} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-xl tracking-[0.3em] mx-8 whitespace-nowrap" style={{ color: `${VOLT}15` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${VOLT}30` }} /> {item}
            </span>
          ))
        } />
      </div>

      {/* TRANSFORMATION PROGRESS */}
      <Section className="py-20 px-4" style={{ background: STEEL }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.3em] text-white/30 mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>RISULTATI MEDI DEI NOSTRI ATLETI</p>
            <h2 className="text-4xl sm:text-5xl tracking-[0.05em]">TRASFORMAZIONE <span style={{ color: VOLT }}>REALE</span></h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {transformations.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-none border" style={{ borderColor: `${VOLT}15`, background: `${VOLT}05` }}>
                <p className="text-[10px] tracking-[0.25em] text-white/30 mb-4" style={{ fontFamily: "'Barlow', sans-serif" }}>{t.label.toUpperCase()}</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-4xl" style={{ color: VOLT }}>{t.after}%</span>
                  <span className="text-sm text-white/20 line-through mb-1" style={{ fontFamily: "'Barlow', sans-serif" }}>{t.before}%</span>
                </div>
                <div className="h-1 rounded-full bg-white/5 overflow-hidden">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: `${t.after}%` }} viewport={{ once: true }} transition={{ delay: 0.5 + i * 0.15, duration: 1.2, ease: "easeOut" }}
                    className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${VOLT}80, ${VOLT})` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CHI SIAMO — asymmetric layout */}
      <Section id="chi-siamo" className="py-20 sm:py-28 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-5 gap-8 items-center">
          <motion.div className="md:col-span-3" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "60px" }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="h-[2px] mb-6" style={{ background: VOLT }} />
            <h2 className="text-4xl sm:text-5xl tracking-[0.03em] mb-6">PIÙ DI UNA <span style={{ color: VOLT }}>PALESTRA</span></h2>
            <p className="text-base text-white/40 mb-8 leading-relaxed max-w-lg" style={{ fontFamily: "'Barlow', sans-serif" }}>
              Non siamo solo una palestra — siamo un laboratorio di trasformazione. Attrezzature Technogym di ultima generazione, coach certificati NSCA e programmi basati sulla scienza dello sport.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: Shield, text: "Technogym® Equipment" },
                { icon: Users, text: "Community 500+" },
                { icon: Award, text: "Coach NSCA Certified" },
                { icon: Target, text: "Programmi Scientifici" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 py-2 border-l-2 pl-4" style={{ borderColor: `${VOLT}30`, fontFamily: "'Barlow', sans-serif" }}>
                  <Icon className="w-4 h-4" style={{ color: VOLT }} />
                  <span className="text-sm text-white/50">{text}</span>
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div className="md:col-span-2" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="relative">
              <div className="rounded-none overflow-hidden aspect-[3/4]" style={{ border: `1px solid ${VOLT}20` }}>
                <img src={GALLERY[0]} alt="Gym" className="w-full h-full object-cover" style={{ filter: "contrast(1.1) saturate(0.9)" }} />
              </div>
              <div className="absolute -bottom-4 -left-4 px-5 py-3" style={{ background: VOLT }}>
                <p className="text-sm font-bold tracking-[0.15em]" style={{ color: CARBON, fontFamily: "'Bebas Neue', sans-serif" }}>EST. 2018</p>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CLASSES — industrial cards */}
      <Section id="classi" className="py-20 sm:py-28" style={{ background: STEEL }}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] tracking-[0.3em] text-white/30 mb-3" style={{ fontFamily: "'Barlow', sans-serif" }}>SCHEDULE</p>
              <h2 className="text-4xl sm:text-5xl tracking-[0.05em]">LE NOSTRE <span style={{ color: VOLT }}>CLASSI</span></h2>
            </div>
            <div className="hidden sm:flex gap-2">
              <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="w-12 h-12 flex items-center justify-center rounded-none border" style={{ borderColor: `${VOLT}30` }}>
                <ChevronLeft className="w-5 h-5" style={{ color: VOLT }} />
              </button>
              <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="w-12 h-12 flex items-center justify-center rounded-none" style={{ background: VOLT }}>
                <ChevronRight className="w-5 h-5" style={{ color: CARBON }} />
              </button>
            </div>
          </div>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
            {classes.map((cls, i) => (
              <motion.div key={i} className="group relative overflow-hidden flex-shrink-0 w-[280px] sm:w-[300px] snap-start rounded-none" style={{ background: CARBON, border: `1px solid ${cls.color}20` }}
                whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                <div className="h-48 overflow-hidden relative">
                  <img src={cls.img} alt={cls.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" style={{ filter: "brightness(0.5) contrast(1.1)" }} loading="lazy" />
                  <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 30%, ${CARBON} 100%)` }} />
                  <div className="absolute top-3 right-3 px-3 py-1 text-[9px] tracking-[0.15em] font-bold" style={{ background: cls.spots <= 3 ? "#FF4444" : `${VOLT}`, color: cls.spots <= 3 ? "#fff" : CARBON, fontFamily: "'Barlow', sans-serif" }}>
                    {cls.spots <= 3 ? "QUASI PIENO" : `${cls.spots} POSTI`}
                  </div>
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 flex items-center justify-center" style={{ background: `${cls.color}15`, border: `1px solid ${cls.color}30` }}>
                      <cls.icon className="w-5 h-5" style={{ color: cls.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg tracking-[0.1em]">{cls.name.toUpperCase()}</h3>
                      <p className="text-[10px] text-white/30 tracking-[0.1em]" style={{ fontFamily: "'Barlow', sans-serif" }}>{cls.trainer}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-white/30" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    <Timer className="w-3.5 h-3.5" /> {cls.time}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* GALLERY — masonry-style */}
      <Section id="gallery" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl tracking-[0.05em] text-center mb-10">LA <span style={{ color: VOLT }}>STRUTTURA</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className={`relative overflow-hidden group cursor-pointer ${i === 0 ? "row-span-2" : ""}`}
                style={{ aspectRatio: i === 0 ? "auto" : "1" }}
                initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" style={{ filter: "brightness(0.7) contrast(1.1)" }} loading="lazy" />
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style={{ background: `${VOLT}15` }} />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRICING — industrial */}
      <Section id="piani" className="py-20 sm:py-28" style={{ background: STEEL }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-4xl sm:text-5xl tracking-[0.05em] text-center mb-12">I NOSTRI <span style={{ color: VOLT }}>PIANI</span></h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { name: "BASE", price: "39", features: ["Sala pesi", "Spogliatoi", "App Empire"] },
              { name: "PRO", price: "59", features: ["Tutto Base +", "Classi illimitate", "Sauna & Spa", "1 PT/mese"], popular: true },
              { name: "ELITE", price: "99", features: ["Tutto Pro +", "PT illimitato", "Nutrizione", "Accesso 24/7"] },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className={`p-6 text-center relative rounded-none border-0 ${plan.popular ? "scale-[1.03]" : ""}`} style={{ background: plan.popular ? CARBON : `${CARBON}CC`, border: plan.popular ? `2px solid ${VOLT}` : "1px solid rgba(255,255,255,0.05)" }}>
                  {plan.popular && <div className="absolute -top-px left-0 right-0 h-[3px]" style={{ background: VOLT }} />}
                  {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-[9px] tracking-[0.15em] px-4 rounded-none" style={{ background: VOLT, color: CARBON }}>PIÙ SCELTO</Badge>}
                  <h3 className="text-2xl tracking-[0.15em] mt-3 mb-1">{plan.name}</h3>
                  <p className="text-5xl mb-6" style={{ color: VOLT }}>€{plan.price}<span className="text-sm text-white/20">/mese</span></p>
                  <ul className="space-y-3 mb-8" style={{ fontFamily: "'Barlow', sans-serif" }}>
                    {plan.features.map(f => <li key={f} className="text-sm text-white/50 flex items-center gap-2 justify-center"><CheckCircle className="w-3.5 h-3.5" style={{ color: VOLT }} />{f}</li>)}
                  </ul>
                  <Button className="w-full py-5 tracking-[0.15em] text-base rounded-none" style={{ background: plan.popular ? VOLT : "transparent", color: plan.popular ? CARBON : "white", border: plan.popular ? "none" : "1px solid rgba(255,255,255,0.1)", fontFamily: "'Bebas Neue', sans-serif" }} onClick={() => scrollTo("iscriviti")}>{plan.name}</Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-20 sm:py-28 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <motion.div initial={{ width: 0 }} whileInView={{ width: "60px" }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="h-[2px] mb-6" style={{ background: VOLT }} />
            <h2 className="text-4xl tracking-[0.05em]">COSA DICONO I <span style={{ color: VOLT }}>NOSTRI ATLETI</span></h2>
          </div>
          <div className="p-8 relative overflow-hidden rounded-none" style={{ background: STEEL, border: `1px solid ${VOLT}10` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-6">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-16 h-16 object-cover" style={{ border: `2px solid ${VOLT}40` }} />
                  <div>
                    <p className="text-xl tracking-[0.1em]">{FALLBACK_REVIEWS[reviewIndex].name.toUpperCase()}</p>
                    <div className="flex gap-0.5 mt-1">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={VOLT} style={{ color: VOLT }} />)}</div>
                  </div>
                </div>
                <p className="text-lg italic leading-relaxed text-white/50" style={{ fontFamily: "'Barlow', sans-serif" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-8">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="h-[3px] transition-all" style={{ width: i === reviewIndex ? "40px" : "16px", background: i === reviewIndex ? VOLT : "#333" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* JOIN FORM */}
      <Section id="iscriviti" className="py-20 sm:py-28 relative" style={{ background: STEEL }}>
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${VOLT}30 1px, transparent 1px), linear-gradient(90deg, ${VOLT}30 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="relative z-10 max-w-lg mx-auto px-5 text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-4" style={{ color: VOLT }} />
          <h2 className="text-4xl sm:text-5xl tracking-[0.05em] mb-3">INIZIA <span style={{ color: VOLT }}>OGGI</span></h2>
          <p className="text-white/30 mb-8 text-sm" style={{ fontFamily: "'Barlow', sans-serif" }}>Compila il form per una prova gratuita</p>
          <Card className="p-6 text-left rounded-none border-0" style={{ background: `${CARBON}`, border: `1px solid ${VOLT}20` }}>
            <div className="space-y-3" style={{ fontFamily: "'Barlow', sans-serif" }}>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome *" className="bg-transparent border-white/10 text-white h-12 rounded-none" />
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefono *" className="bg-transparent border-white/10 text-white h-12 rounded-none" />
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-transparent border-white/10 text-white h-12 rounded-none" />
              <Input value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} placeholder="Cosa ti interessa? (CrossFit, PT...)" className="bg-transparent border-white/10 text-white h-12 rounded-none" />
            </div>
            <Button onClick={handleLead} disabled={submitting} className="w-full mt-5 py-6 text-lg tracking-[0.2em] rounded-none border-0 shadow-2xl" style={{ background: VOLT, color: CARBON, fontFamily: "'Bebas Neue', sans-serif", boxShadow: `0 15px 40px -10px ${VOLT}44` }}>
              {submitting ? "INVIO..." : "RICHIEDI PROVA GRATUITA"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-20 px-4 relative overflow-hidden">
        <FloatingOrbs color={VOLT} count={2} />
        <div className="max-w-3xl mx-auto relative z-10">
          <h2 className="text-4xl tracking-[0.05em] text-center mb-10">FAQ</h2>
          <PremiumFAQ items={FAQ_ITEMS} accentColor={VOLT} />
        </div>
      </Section>

      <AIAgentsShowcase sector="fitness" />
      <SectorValueProposition sectorKey="fitness" accentColor={VOLT} darkMode={true} sectorLabel="Palestra" />
      <AutomationShowcase accentColor={VOLT} accentBg="bg-lime-400" sectorName="palestre e fitness" darkMode={true} />

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: `${VOLT}10` }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Barlow', sans-serif" }}>
          <p className="text-xs text-white/20">© {new Date().getFullYear()} {name}.</p>
          <div className="flex gap-6 text-xs text-white/20">
            {company.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.address}</span>}
            {phone && <a href={`tel:${phone}`} className="flex items-center gap-1"><Phone className="w-3 h-3" />{phone}</a>}
          </div>
          <div className="flex gap-4 text-xs text-white/20"><a href="/privacy">Privacy</a><span>Powered by Empire.AI</span></div>
        </div>
      </footer>

      {phone && (
        <motion.a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-none flex items-center justify-center shadow-2xl" style={{ background: VOLT }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
          <MessageCircle className="w-7 h-7" style={{ color: CARBON }} />
        </motion.a>
      )}
    </div>
  );
}
