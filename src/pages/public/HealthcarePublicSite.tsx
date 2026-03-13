import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
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

const TEAL = "#00B4A0";
const BLUE = "#0D3159";

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

const HERO_VIDEO = "https://videos.pexels.com/video-files/4491640/4491640-uhd_2560_1440_25fps.mp4";
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
  { name: "Laura B.", text: "Teleconsulto rapido e preciso. Mi ha risparmiato tempo prezioso senza rinunciare alla qualità.", rating: 5, city: "Roma", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Giovanni V.", text: "Diagnostica all'avanguardia e risultati in 24h. Finalmente uno studio medico moderno.", rating: 5, city: "Napoli", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { name: "Anna F.", text: "Check-up preventivo completo e dettagliato. Staff gentile e molto professionale.", rating: 5, city: "Firenze", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

export default function HealthcarePublicSite({ company }: Props) {
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
    { icon: Stethoscope, title: "Visite Specialistiche", desc: "Cardiologia, dermatologia, ortopedia e oltre", img: GALLERY[0] },
    { icon: Activity, title: "Diagnostica Avanzata", desc: "Ecografie, ECG, analisi del sangue complete", img: GALLERY[1] },
    { icon: Video, title: "Teleconsulto", desc: "Visite online sicure, comodamente da casa", img: GALLERY[2] },
    { icon: FileText, title: "Referti Online", desc: "Accesso immediato ai tuoi referti digitali", img: GALLERY[3] },
    { icon: Heart, title: "Prevenzione", desc: "Check-up completi e programmi personalizzati", img: GALLERY[4] },
    { icon: Users, title: "Medicina di Famiglia", desc: "Assistenza continuativa per tutta la famiglia", img: GALLERY[5] },
  ];

  const tickerItems = ["Cardiologia", "Dermatologia", "Ortopedia", "Ginecologia", "Oculistica", "Teleconsulto", "Ecografia", "Fisioterapia", "Nutrizione", "Psicologia"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Nunito', sans-serif", background: "#FAFBFC", color: "#1a1a2e" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500`} style={{ background: navScrolled ? "rgba(255,255,255,0.95)" : "rgba(255,255,255,0.8)", backdropFilter: "blur(20px)", borderBottom: `1px solid ${TEAL}20` }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url ? <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" /> :
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: `${TEAL}15` }}><Stethoscope className="w-5 h-5" style={{ color: TEAL }} /></div>}
            <div className="min-w-0">
              <span className="font-bold text-base truncate block" style={{ color: BLUE }}>{name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold" style={{ color: TEAL }}>HEALTHCARE PREMIUM</span>
            </div>
          </div>
          <div className="hidden md:flex gap-8 text-[13px] font-medium" style={{ color: "#888" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-[#1a1a2e] transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            {phone && <Button size="sm" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-5 text-white" style={{ background: TEAL }} asChild>
              <a href={`tel:${phone}`}><Phone className="w-3.5 h-3.5" /> CHIAMA ORA</a>
            </Button>}
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white border-t" style={{ borderColor: `${TEAL}15` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b border-gray-100">{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden" style={{ background: `linear-gradient(135deg, ${BLUE} 0%, #0a2847 100%)` }}>
        <HeroVideoBackground
          primarySrc={HERO_VIDEO}
          fallbackSrc={fallbackHeroVideo}
          poster={GALLERY[0]}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.7) saturate(1.03)", opacity: 0.52 }}
        />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${BLUE}88 0%, ${BLUE}66 100%)` }} />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: `radial-gradient(circle, ${TEAL}80 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center relative z-10 px-5">
          <motion.div style={{ y: heroY }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} className="flex gap-2 mb-6 flex-wrap">
                {["Specialista", "Convenzione SSN", "Teleconsulto"].map(b => (
                  <span key={b} className="text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider" style={{ background: `${TEAL}25`, color: "#fff", border: `1px solid ${TEAL}40` }}>{b}</span>
                ))}
              </motion.div>
              <motion.h1 variants={fadeUp} custom={1} className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">
                {tagline.split("").map((char, i) => (
                  <motion.span key={i} initial={{ opacity: 0, y: 20, rotateX: -60 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                    transition={{ delay: 0.5 + i * 0.025, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                    style={{ display: "inline-block", color: i % 6 === 0 ? TEAL : "white" }}>
                    {char === " " ? "\u00A0" : char}
                  </motion.span>
                ))}
              </motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-base text-white/60 mb-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>Professionalità, tecnologia e cura del paziente al centro di ogni visita.</motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <Button className="px-8 py-5 text-base font-semibold text-white rounded-xl shadow-2xl" style={{ background: TEAL, boxShadow: `0 20px 60px -15px ${TEAL}55` }} onClick={() => scrollTo("prenota")}>Prenota Visita <ArrowRight className="w-4 h-4 ml-2" /></Button>
                {phone && <Button variant="outline" className="px-8 py-5 text-base text-white rounded-xl" style={{ borderColor: "#fff3" }} asChild><a href={`tel:${phone}`}>Chiama Ora</a></Button>}
              </motion.div>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl" style={{ border: `1px solid ${TEAL}20` }}>
              <img src={GALLERY[0]} alt="Studio medico" className="w-full h-96 object-cover" />
            </div>
            {/* Premium Badge */}
            <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.4 }}
              className="absolute -bottom-4 right-4 flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5"
              style={{ background: "rgba(255,255,255,0.9)", border: `1px solid ${TEAL}30`, boxShadow: "0 8px 32px rgba(0,0,0,0.15)" }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${TEAL}15` }}>
                <Shield className="w-4 h-4" style={{ color: TEAL }} />
              </div>
              <div>
                <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: TEAL }}>Certificato</p>
                <p className="text-[8px] text-gray-500 leading-tight mt-0.5">GDPR Compliant</p>
              </div>
            </motion.div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden py-4" style={{ background: BLUE }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1200] }} transition={{ repeat: Infinity, duration: 20, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium text-white/30">
              <Stethoscope className="w-3 h-3" style={{ color: `${TEAL}60` }} /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* STATS */}
      <Section className="py-16 px-4" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: 10000, suffix: "+", label: "Pazienti Assistiti" },
            { value: 20, suffix: "+", label: "Anni di Esperienza" },
            { value: 15, suffix: "+", label: "Specializzazioni" },
            { value: 99, suffix: "%", label: "Soddisfazione" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl font-extrabold" style={{ color: BLUE }}><AnimatedNum value={s.value} suffix={s.suffix} /></p>
              <p className="text-[11px] uppercase tracking-[0.15em] mt-2" style={{ color: TEAL }}>{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* SERVICES — auto-carousel */}
      <Section id="servizi" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: TEAL }}>I NOSTRI SERVIZI</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: BLUE }}>Assistenza Medica Completa</h2>
          </div>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {services.map((s, i) => (
                <motion.div key={i} className="group flex-shrink-0 w-[300px] sm:w-[340px] snap-start" whileHover={{ y: -5 }}>
                  <Card className="overflow-hidden h-full hover:shadow-xl transition-shadow border-0 shadow-md">
                    <div className="h-44 overflow-hidden relative">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                      <Badge className="absolute top-3 right-3 text-[9px]" style={{ background: `${TEAL}`, color: "#fff" }}>Premium</Badge>
                    </div>
                    <CardContent className="p-5">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${TEAL}12` }}>
                        <s.icon className="w-5 h-5" style={{ color: TEAL }} />
                      </div>
                      <h3 className="text-base font-bold mb-1" style={{ color: BLUE }}>{s.title}</h3>
                      <p className="text-sm opacity-60" style={{ fontFamily: "'Open Sans', sans-serif" }}>{s.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronLeft className="w-5 h-5" style={{ color: BLUE }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronRight className="w-5 h-5" style={{ color: BLUE }} />
            </button>
          </div>
        </div>
      </Section>

      {/* WHY US */}
      <Section id="chi-siamo" className="py-16 sm:py-24" style={{ background: `${TEAL}06` }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10" style={{ color: BLUE }}>Perché Sceglierci</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: "GDPR Compliant", desc: "Dati protetti e cifrati" },
              { icon: Award, title: "20+ Anni", desc: "Team esperto e certificato" },
              { icon: Clock, title: "Orari Flessibili", desc: "Anche sabato e sera" },
              { icon: CheckCircle, title: "Referto in 24h", desc: "Risultati rapidi e precisi" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="text-center p-5 rounded-2xl bg-white shadow-md hover:shadow-lg transition-shadow" whileHover={{ y: -3 }}>
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${BLUE}10` }}>
                  <item.icon className="w-7 h-7" style={{ color: BLUE }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: BLUE }}>{item.title}</h3>
                <p className="text-xs opacity-60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS — auto-carousel */}
      <Section id="recensioni" className="py-16 sm:py-24">
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: TEAL }}>RECENSIONI</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: BLUE }}>Cosa Dicono i Pazienti</h2>
          </div>
          <div className="rounded-2xl p-8 bg-white shadow-lg mb-8 relative overflow-hidden" style={{ border: `1px solid ${TEAL}15` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${TEAL}40` }} />
                  <div>
                    <p className="font-bold text-base" style={{ color: BLUE }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <p className="text-xs opacity-50">{FALLBACK_REVIEWS[reviewIndex].city}</p>
                  </div>
                  <div className="ml-auto flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-4 h-4" fill={TEAL} style={{ color: TEAL }} />)}</div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${TEAL}20` }} />
                <p className="text-lg italic leading-relaxed opacity-70">"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? TEAL : "#e0e0e0", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="prenota" className="py-16 sm:py-24 relative" style={{ background: BLUE }}>
        <div className="max-w-2xl mx-auto px-5 relative z-10">
          <div className="text-center mb-8 text-white">
            <Calendar className="w-7 h-7 mx-auto mb-3" style={{ color: TEAL }} />
            <h2 className="text-3xl sm:text-4xl font-bold">Prenota la Tua Visita</h2>
          </div>
          <Card className="p-6 shadow-2xl border-0 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.95)" }}>
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: TEAL }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mario Rossi" /></div>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: TEAL }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." /></div>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: TEAL }}>Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: TEAL }}>Specializzazione</label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Es: Cardiologia" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-bold uppercase mb-1 block" style={{ color: TEAL }}>Data e Ora *</label><Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="text-xs font-bold uppercase mb-1 block" style={{ color: TEAL }}>Motivo Visita</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Descrivi..." /></div>
              <div className="sm:col-span-2 flex items-start gap-2">
                <input type="checkbox" checked={form.gdpr} onChange={e => setForm({ ...form, gdpr: e.target.checked })} className="mt-1" />
                <span className="text-xs opacity-60">Acconsento al trattamento dei dati personali ai sensi del GDPR.</span>
              </div>
            </div>
            <Button onClick={handleBooking} disabled={submitting || !form.gdpr} className="w-full mt-5 py-5 text-base font-semibold text-white rounded-xl shadow-2xl" style={{ background: TEAL, boxShadow: `0 15px 40px -10px ${TEAL}55` }}>
              {submitting ? "Invio..." : "Conferma Prenotazione"} <Send className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section className="py-16" style={{ background: "#f5f7fa" }}>
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="text-2xl font-bold text-center mb-8" style={{ color: BLUE }}>Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((f: any) => (
                <details key={f.id} className="group bg-white rounded-xl p-4 shadow-sm">
                  <summary className="font-bold text-sm cursor-pointer list-none flex justify-between" style={{ color: BLUE }}>
                    {f.question} <ChevronDown className="w-4 h-4 text-gray-400 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-sm mt-3 opacity-60">{f.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CONTACT + FOOTER */}
      <Section id="contatti" className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center">
          {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-5 h-5" style={{ color: TEAL }} /><p className="text-sm opacity-60">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
          {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-5 h-5" style={{ color: TEAL }} /><a href={`tel:${phone}`} className="text-sm opacity-60">{phone}</a></div>}
          {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-5 h-5" style={{ color: TEAL }} /><a href={`mailto:${company.email}`} className="text-sm opacity-60">{company.email}</a></div>}
        </div>
      </Section>

      <AutomationShowcase accentColor={TEAL} accentBg="bg-teal-500" sectorName="studi medici e cliniche" darkMode={false} />

      <footer className="py-8 border-t border-gray-100 text-center text-xs text-gray-400">
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
