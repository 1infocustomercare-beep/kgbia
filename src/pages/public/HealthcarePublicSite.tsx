import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, NeonDivider, PremiumStatsBarLight, PremiumFAQ, ScrollIndicator } from "@/components/public/PremiumSiteKit";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
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
  Shield, Heart, CheckCircle, Send, Stethoscope, Users,
  Award, Video, FileText, MessageCircle, Activity, ChevronDown, Quote, Menu, X, ChevronLeft, ChevronRight, Sparkles
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";

/* ─── ARCTIC SAGE + WARM IVORY AESTHETIC ─── */
const SAGE = "#5B8C6F";
const NAVY = "#1A2F3A";
const IVORY = "#FAF8F3";
const WARM = "#D4A574";

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

const HERO_VIDEO = "https://videos.pexels.com/video-files/7579341/7579341-uhd_2560_1440_25fps.mp4";
const GALLERY = [
  "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3259629/pexels-photo-3259629.jpeg?auto=compress&cs=tinysrgb&w=800",
];

const FALLBACK_REVIEWS = [
  { name: "Marco R.", text: "Competenza e professionalità eccezionali. Il Dottore è sempre disponibile e attento.", rating: 5, city: "Milano", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Laura B.", text: "Teleconsulto rapido e preciso. Mi ha risparmiato tempo prezioso.", rating: 5, city: "Roma", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Giovanni V.", text: "Diagnostica all'avanguardia e risultati in 24h. Studio medico moderno.", rating: 5, city: "Napoli", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Anna F.", text: "Check-up preventivo completo e dettagliato. Staff gentile e professionale.", rating: 5, city: "Firenze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

export default function HealthcarePublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const name = company.name || "Studio Medico";
  const tagline = company.tagline || "La tua salute, la nostra missione";
  const phone = company.phone;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const t = setInterval(() => setReviewIndex(p => (p + 1) % FALLBACK_REVIEWS.length), 5000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const t = setInterval(() => { if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollBy({ left: 340, behavior: "smooth" }); }, 4500);
    return () => clearInterval(t);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const { data: faqs = [] } = useQuery({
    queryKey: ["hc-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", specialization: "", date: "", notes: "", gdpr: false });
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.date || !form.gdpr) { toast.error("Compila i campi obbligatori e accetta la privacy"); return; }
    setSubmitting(true);
    try {
      await supabase.from("appointments").insert({ company_id: companyId, client_name: form.name, client_phone: form.phone, scheduled_at: form.date, service_name: form.specialization, notes: form.notes, status: "confirmed" });
      toast.success("Visita prenotata!");
      setForm({ name: "", phone: "", email: "", specialization: "", date: "", notes: "", gdpr: false });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#chi-siamo", label: "Chi Siamo" }, { href: "#recensioni", label: "Recensioni" }, { href: "#prenota", label: "Prenota" }];

  const services = [
    { icon: Stethoscope, title: "Visite Specialistiche", desc: "Cardiologia, dermatologia, ortopedia", img: GALLERY[0] },
    { icon: Activity, title: "Diagnostica Avanzata", desc: "Ecografie, ECG, analisi complete", img: GALLERY[1] },
    { icon: Video, title: "Teleconsulto", desc: "Visite online sicure da casa", img: GALLERY[2] },
    { icon: FileText, title: "Referti Online", desc: "Accesso immediato ai referti", img: GALLERY[3] },
    { icon: Heart, title: "Prevenzione", desc: "Check-up e programmi personalizzati", img: GALLERY[4] },
    { icon: Users, title: "Medicina Famiglia", desc: "Assistenza per tutta la famiglia", img: GALLERY[5] },
  ];

  const tickerItems = ["Cardiologia", "Dermatologia", "Ortopedia", "Ginecologia", "Oculistica", "Teleconsulto", "Ecografia", "Fisioterapia", "Nutrizione", "Psicologia"];

  const processSteps = [
    { step: "01", title: "Prenota Online", desc: "Scegli specializzazione, data e orario in pochi click", icon: Calendar },
    { step: "02", title: "Conferma Rapida", desc: "Ricevi conferma via SMS e email in tempo reale", icon: CheckCircle },
    { step: "03", title: "Visita", desc: "Vieni in studio o collegati in teleconsulto", icon: Stethoscope },
    { step: "04", title: "Referti Digitali", desc: "Ricevi referti e prescrizioni direttamente online", icon: FileText },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'DM Serif Display', serif", background: IVORY, color: NAVY }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=Work+Sans:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR — warm, organic */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500`} style={{ background: navScrolled ? `${IVORY}F5` : `${IVORY}CC`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${SAGE}15` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url ? <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" /> :
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${SAGE}12` }}><Stethoscope className="w-5 h-5" style={{ color: SAGE }} /></div>}
            <div className="min-w-0">
              <span className="text-lg truncate block" style={{ color: NAVY }}>{name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-medium" style={{ color: SAGE, fontFamily: "'Work Sans', sans-serif" }}>HEALTHCARE PREMIUM</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-[12px] font-medium tracking-wide" style={{ color: `${NAVY}60`, fontFamily: "'Work Sans', sans-serif" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:opacity-100 transition-opacity">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-medium text-xs h-10 px-6 text-white" style={{ background: SAGE, fontFamily: "'Work Sans', sans-serif" }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> Chiama</a>
            </Button>}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: IVORY, borderTop: `1px solid ${SAGE}10` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${SAGE}10`, fontFamily: "'Work Sans', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — warm, trustworthy split layout */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden" style={{ background: NAVY }}>
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.6) saturate(0.9)", opacity: 0.5 }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${NAVY}DD 0%, ${NAVY}99 100%)` }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 px-5">
          <motion.div style={{ y: heroY }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="flex gap-2 mb-6 flex-wrap">
                {["Specialista", "SSN", "Teleconsulto"].map(b => (
                  <span key={b} className="text-[10px] px-4 py-1.5 rounded-full font-medium tracking-wider uppercase" style={{ background: `${SAGE}20`, color: `${SAGE}`, border: `1px solid ${SAGE}30`, fontFamily: "'Work Sans', sans-serif" }}>{b}</span>
                ))}
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-5xl lg:text-6xl text-white leading-tight mb-5">
                {tagline}
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-base text-white/50 mb-8 max-w-lg" style={{ fontFamily: "'Work Sans', sans-serif" }}>Professionalità, tecnologia e cura del paziente al centro di ogni visita.</motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <Button className="px-8 py-5 text-base font-medium text-white rounded-full shadow-2xl" style={{ background: SAGE, boxShadow: `0 20px 60px -15px ${SAGE}55`, fontFamily: "'Work Sans', sans-serif" }} onClick={() => scrollTo("prenota")}>Prenota Visita <ArrowRight className="w-4 h-4 ml-2" /></Button>
                {phone && <Button variant="outline" className="px-8 py-5 text-base text-white rounded-full" style={{ borderColor: "#fff2", fontFamily: "'Work Sans', sans-serif" }} asChild><a href={`tel:${phone}`}>Chiama Ora</a></Button>}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${SAGE}25` }}>
              <img src={GALLERY[0]} alt="Studio medico" className="w-full h-96 object-cover" />
            </div>
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
              className="absolute -bottom-4 right-4 flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-4 py-0.5"
              style={{ background: `${IVORY}F0`, border: `1px solid ${SAGE}20`, boxShadow: "0 8px 32px rgba(0,0,0,0.1)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${SAGE}12` }}>
                <Shield className="w-4 h-4" style={{ color: SAGE }} />
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: SAGE }}>Certificato</p>
                <p className="text-[8px] leading-tight mt-0.5" style={{ color: `${NAVY}60` }}>GDPR Compliant</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
        <ScrollIndicator />
      </section>

      {afterHero}

      {/* TICKER */}
      <div className="overflow-hidden py-5" style={{ background: SAGE }}>
        <MarqueeCarousel speed={40} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium mx-6 whitespace-nowrap text-white/40" style={{ fontFamily: "'Work Sans', sans-serif" }}>
              <Stethoscope className="w-3 h-3 text-white/25" /> {item}
            </span>
          ))
        } />
      </div>

      {/* STATS */}
      <Section className="py-16 px-4" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto">
          <PremiumStatsBarLight accentColor={SAGE} textColor={NAVY} stats={[
            { value: 10000, suffix: "+", label: "Pazienti Assistiti" },
            { value: 20, suffix: "+", label: "Anni di Esperienza" },
            { value: 15, suffix: "+", label: "Specializzazioni" },
            { value: 99, suffix: "%", label: "Soddisfazione" },
          ]} />
        </div>
      </Section>

      {/* PROCESS — unique healthcare section */}
      <Section className="py-20 px-4" style={{ background: `${SAGE}08` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-2" style={{ color: WARM, fontFamily: "'Work Sans', sans-serif" }}>COME FUNZIONA</p>
            <h2 className="text-3xl sm:text-4xl" style={{ color: NAVY }}>Il Tuo Percorso di Salute</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="relative text-center p-6 rounded-2xl bg-white shadow-sm" style={{ border: `1px solid ${SAGE}10` }}>
                <span className="text-4xl font-bold block mb-3" style={{ color: `${SAGE}20` }}>{s.step}</span>
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${SAGE}10` }}>
                  <s.icon className="w-6 h-6" style={{ color: SAGE }} />
                </div>
                <h3 className="text-lg mb-1" style={{ color: NAVY }}>{s.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: `${NAVY}60`, fontFamily: "'Work Sans', sans-serif" }}>{s.desc}</p>
                {i < processSteps.length - 1 && <div className="hidden lg:block absolute top-1/2 -right-3 w-6 h-[1px]" style={{ background: `${SAGE}30` }} />}
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="servizi" className="py-20 sm:py-28">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-2" style={{ color: WARM, fontFamily: "'Work Sans', sans-serif" }}>I NOSTRI SERVIZI</p>
            <h2 className="text-3xl sm:text-4xl" style={{ color: NAVY }}>Assistenza Medica Completa</h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {services.map((s, i) => (
                <motion.div key={i} className="group flex-shrink-0 w-[300px] sm:w-[340px] snap-start" whileHover={{ y: -5 }}>
                  <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow border-0 shadow-md rounded-2xl">
                    <div className="h-44 overflow-hidden relative">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
                    </div>
                    <CardContent className="p-5" style={{ background: "#fff" }}>
                      <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3" style={{ background: `${SAGE}10` }}>
                        <s.icon className="w-5 h-5" style={{ color: SAGE }} />
                      </div>
                      <h3 className="text-lg mb-1" style={{ color: NAVY }}>{s.title}</h3>
                      <p className="text-sm" style={{ color: `${NAVY}60`, fontFamily: "'Work Sans', sans-serif" }}>{s.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10"><ChevronLeft className="w-5 h-5" style={{ color: SAGE }} /></button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10"><ChevronRight className="w-5 h-5" style={{ color: SAGE }} /></button>
          </div>
        </div>
      </Section>

      {/* WHY US */}
      <Section id="chi-siamo" className="py-20 sm:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-3" style={{ color: WARM, fontFamily: "'Work Sans', sans-serif" }}>PERCHÉ SCEGLIERCI</p>
            <h2 className="text-3xl sm:text-4xl mb-8" style={{ color: NAVY }}>La Tua Salute in <span style={{ color: SAGE }}>Buone Mani</span></h2>
            <div className="space-y-5">
              {[
                { icon: Shield, title: "GDPR Compliant", desc: "Dati protetti e cifrati secondo normativa europea" },
                { icon: Award, title: "20+ Anni Esperienza", desc: "Team esperto e continuamente aggiornato" },
                { icon: Clock, title: "Orari Flessibili", desc: "Anche sabato e orario serale" },
                { icon: CheckCircle, title: "Referto in 24h", desc: "Risultati rapidi disponibili online" },
              ].map((item, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                  className="flex gap-4 items-start">
                  <div className="w-11 h-11 rounded-full flex items-center justify-center shrink-0" style={{ background: `${SAGE}10` }}>
                    <item.icon className="w-5 h-5" style={{ color: SAGE }} />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm mb-0.5" style={{ color: NAVY, fontFamily: "'Work Sans', sans-serif" }}>{item.title}</h3>
                    <p className="text-xs" style={{ color: `${NAVY}50`, fontFamily: "'Work Sans', sans-serif" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="rounded-3xl overflow-hidden shadow-lg">
              <img src={GALLERY[2]} alt="Studio" className="w-full aspect-[4/5] object-cover" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-20 sm:py-28" style={{ background: `${SAGE}06` }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] font-medium mb-2" style={{ color: WARM, fontFamily: "'Work Sans', sans-serif" }}>RECENSIONI</p>
            <h2 className="text-3xl sm:text-4xl" style={{ color: NAVY }}>Cosa Dicono i Pazienti</h2>
          </div>
          <div className="rounded-2xl p-8 bg-white shadow-sm relative overflow-hidden" style={{ border: `1px solid ${SAGE}10` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${SAGE}30` }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: NAVY, fontFamily: "'Work Sans', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <p className="text-xs" style={{ color: `${NAVY}40` }}>{FALLBACK_REVIEWS[reviewIndex].city}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-4 h-4" fill={WARM} style={{ color: WARM }} />)}</div>
                </div>
                <p className="text-lg italic leading-relaxed" style={{ color: `${NAVY}70`, fontFamily: "'Work Sans', sans-serif" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? SAGE : "#e0e0e0", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="prenota" className="py-20 sm:py-28 relative" style={{ background: NAVY }}>
        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <div className="text-center mb-8 text-white">
            <Calendar className="w-7 h-7 mx-auto mb-3" style={{ color: SAGE }} />
            <h2 className="text-3xl sm:text-4xl">Prenota la Tua Visita</h2>
          </div>
          <Card className="p-6 shadow-2xl border-0 backdrop-blur-xl rounded-2xl" style={{ background: `${IVORY}F8` }}>
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "'Work Sans', sans-serif" }}>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: SAGE }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mario Rossi" className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: SAGE }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: SAGE }}>Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="rounded-lg" /></div>
              <div><label className="text-xs font-medium uppercase mb-1 block" style={{ color: SAGE }}>Specializzazione</label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Es: Cardiologia" className="rounded-lg" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium uppercase mb-1 block" style={{ color: SAGE }}>Data e Ora *</label><Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-lg" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-medium uppercase mb-1 block" style={{ color: SAGE }}>Motivo Visita</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Descrivi..." className="rounded-lg" /></div>
              <div className="sm:col-span-2 flex items-start gap-2">
                <input type="checkbox" checked={form.gdpr} onChange={e => setForm({ ...form, gdpr: e.target.checked })} className="mt-1" />
                <span className="text-xs" style={{ color: `${NAVY}60` }}>Acconsento al trattamento dei dati personali ai sensi del GDPR.</span>
              </div>
            </div>
            <Button onClick={handleBooking} disabled={submitting || !form.gdpr} className="w-full mt-5 py-5 text-base font-medium text-white rounded-full shadow-2xl" style={{ background: SAGE, fontFamily: "'Work Sans', sans-serif", boxShadow: `0 15px 40px -10px ${SAGE}55` }}>
              {submitting ? "Invio..." : "Conferma Prenotazione"} <Send className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </Section>

      {faqs.length > 0 && (
        <Section className="py-16" style={{ background: `${SAGE}06` }}>
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="text-2xl text-center mb-8" style={{ color: NAVY }}>Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((f: any) => (
                <details key={f.id} className="group bg-white rounded-xl p-4 shadow-sm">
                  <summary className="font-bold text-sm cursor-pointer list-none flex justify-between" style={{ color: NAVY, fontFamily: "'Work Sans', sans-serif" }}>
                    {f.question} <ChevronDown className="w-4 h-4 group-open:rotate-180 transition-transform" style={{ color: `${NAVY}30` }} />
                  </summary>
                  <p className="text-sm mt-3" style={{ color: `${NAVY}60`, fontFamily: "'Work Sans', sans-serif" }}>{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      <Section id="contatti" className="py-12 px-4" style={{ background: "#fff" }}>
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center" style={{ fontFamily: "'Work Sans', sans-serif" }}>
          {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-5 h-5" style={{ color: SAGE }} /><p className="text-sm" style={{ color: `${NAVY}60` }}>{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
          {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-5 h-5" style={{ color: SAGE }} /><a href={`tel:${phone}`} className="text-sm" style={{ color: `${NAVY}60` }}>{phone}</a></div>}
          {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-5 h-5" style={{ color: SAGE }} /><a href={`mailto:${company.email}`} className="text-sm" style={{ color: `${NAVY}60` }}>{company.email}</a></div>}
        </div>
      </Section>

      <AIAgentsShowcase sector="healthcare" />
      <SectorValueProposition sectorKey="healthcare" accentColor={SAGE} darkMode={false} sectorLabel="Studio Medico" />
      <AutomationShowcase accentColor={SAGE} accentBg="bg-emerald-600" sectorName="studi medici e cliniche" darkMode={false} />

      <footer className="py-8 border-t text-center text-xs" style={{ borderColor: `${SAGE}10`, color: `${NAVY}30`, fontFamily: "'Work Sans', sans-serif" }}>
        <p>© {new Date().getFullYear()} {name}. Tutti i diritti riservati. | Powered by Empire.AI</p>
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
