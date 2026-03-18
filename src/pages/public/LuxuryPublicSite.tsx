import { useState, useRef, forwardRef, useEffect } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { motion, useInView, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { getSectorTheme } from "@/config/sector-themes";
import { getIndustryConfig, type IndustryId } from "@/config/industry-config";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar, ArrowRight,
  CheckCircle, Send, ChevronDown, Instagram, MessageCircle,
  Shield, Award, Users, Heart, Sparkles, Globe, Quote, Menu, X,
  Zap, Target, TrendingUp, Gem
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-hero-empire.mp4";

/* ── PREMIUM ADAPTIVE PALETTE SYSTEM ── */
const INDUSTRY_VIDEOS: Record<string, string> = {
  beauty: "https://videos.pexels.com/video-files/3997889/3997889-uhd_2560_1440_25fps.mp4",
  healthcare: "https://videos.pexels.com/video-files/3209211/3209211-uhd_2560_1440_25fps.mp4",
  fitness: "https://videos.pexels.com/video-files/4761434/4761434-uhd_2560_1440_25fps.mp4",
  hotel: "https://videos.pexels.com/video-files/6527282/6527282-uhd_2560_1440_25fps.mp4",
  retail: "https://videos.pexels.com/video-files/5527834/5527834-uhd_2560_1440_25fps.mp4",
  veterinary: "https://videos.pexels.com/video-files/4921969/4921969-uhd_2560_1440_25fps.mp4",
  events: "https://videos.pexels.com/video-files/3400768/3400768-uhd_2560_1440_25fps.mp4",
  photography: "https://videos.pexels.com/video-files/3743009/3743009-uhd_2560_1440_25fps.mp4",
  education: "https://videos.pexels.com/video-files/5198164/5198164-uhd_2560_1440_25fps.mp4",
  legal: "https://videos.pexels.com/video-files/5519894/5519894-uhd_2560_1440_25fps.mp4",
};

const INDUSTRY_POSTERS: Record<string, string> = {
  beauty: "https://images.pexels.com/photos/3985338/pexels-photo-3985338.jpeg?auto=compress&cs=tinysrgb&w=1200",
  healthcare: "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1200",
  fitness: "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1200",
  hotel: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1200",
  retail: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=1200",
  veterinary: "https://images.pexels.com/photos/6234611/pexels-photo-6234611.jpeg?auto=compress&cs=tinysrgb&w=1200",
  events: "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1200",
  photography: "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1200",
  education: "https://images.pexels.com/photos/5428012/pexels-photo-5428012.jpeg?auto=compress&cs=tinysrgb&w=1200",
  legal: "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1200",
  custom: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
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

interface Props { company: any; afterHero?: React.ReactNode; }

export default function LuxuryPublicSite({ company, afterHero }: Props) {
  const industry = (company.industry || "custom") as IndustryId;
  const config = getIndustryConfig(industry);
  const theme = getSectorTheme(industry);
  const p = theme.palette;
  const companyId = company.id;
  const isDark = p.bg.startsWith("#0") || p.bg.startsWith("#1");

  const [form, setForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  const { data: siteConfig } = useQuery({
    queryKey: ["public-site-config", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("public_site_config" as any).select("*").eq("company_id", companyId!).maybeSingle();
      return data as any;
    },
    enabled: !!companyId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["luxury-reviews", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", companyId!).eq("is_public", true).order("created_at", { ascending: false }).limit(6);
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["luxury-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId!).eq("is_active", true).order("sort_order");
      return data || [];
    },
    enabled: !!companyId,
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { toast.error("Inserisci nome e telefono"); return; }
    setSubmitting(true);
    try {
      if (["beauty", "healthcare", "veterinary", "tattoo", "fitness"].includes(industry)) {
        await supabase.from("appointments").insert({
          company_id: companyId, client_name: form.name, client_phone: form.phone,
          scheduled_at: new Date(Date.now() + 86400000).toISOString(), notes: form.message || null,
        });
      } else if (["plumber", "electrician", "cleaning", "gardening", "construction", "garage"].includes(industry)) {
        await supabase.from("interventions").insert({
          company_id: companyId, client_name: form.name, client_phone: form.phone,
          intervention_type: config.terminology.order, notes: form.message || null,
        });
      } else {
        await supabase.from("leads").insert({
          company_id: companyId, name: form.name, phone: form.phone,
          email: form.email, notes: form.message, source: "website",
        });
      }
      toast.success("Richiesta inviata! Ti contatteremo presto.");
      setForm({ name: "", phone: "", email: "", message: "" });
    } catch { toast.error("Errore nell'invio"); }
    finally { setSubmitting(false); }
  };

  const socialLinks = company.social_links as Record<string, string> | null;
  const openingHours = company.opening_hours as { day: string; hours: string }[] | null;
  const displayReviews = reviews.length > 0 ? reviews : theme.testimonials.map((t, i) => ({
    id: `t-${i}`, customer_name: t.name, comment: t.text, rating: t.rating,
  }));

  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  const accentHex = p.accentHex;
  const navItems = ["Chi Siamo", "Servizi", "Perché Noi", "Contatti"];

  const heroVideo = siteConfig?.hero_video_url || INDUSTRY_VIDEOS[industry];
  const heroPoster = siteConfig?.hero_image_url || INDUSTRY_POSTERS[industry] || INDUSTRY_POSTERS.custom;

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: p.bg, color: p.text, fontFamily: "'DM Sans', sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display&display=swap" rel="stylesheet" />

      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`}
        style={{
          background: navScrolled ? (isDark ? "rgba(10,10,10,0.9)" : "rgba(255,255,255,0.9)") : "transparent",
          backdropFilter: navScrolled ? "blur(20px)" : "none",
          borderBottom: navScrolled ? `1px solid ${isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)"}` : "none",
        }}>
        <div className="max-w-6xl mx-auto px-5 flex items-center justify-between h-16 sm:h-20">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="w-10 h-10 rounded-xl object-cover shadow-lg" />
            ) : (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg" style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}CC)` }}>
                <span className="text-white text-sm font-bold">{company.name?.[0]}</span>
              </div>
            )}
            <span className="font-semibold text-sm tracking-wide hidden sm:block" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {company.name}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-[0.15em] uppercase" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
            {navItems.map(label => (
              <button key={label} onClick={() => scrollTo(label.toLowerCase().replace(/\s/g, "-").replace("è", "e").replace("ù", "u"))}
                className="hover:opacity-100 opacity-60 transition-opacity">{label}</button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <Button size="sm" className="rounded-xl text-xs font-semibold text-white shadow-lg"
              style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}CC)` }}
              onClick={() => scrollTo("contatti")}>
              {theme.hero.cta1}
            </Button>
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden" style={{ background: isDark ? "rgba(10,10,10,0.95)" : "rgba(255,255,255,0.95)" }}>
              <div className="px-5 py-5 space-y-1">
                {navItems.map(item => (
                  <button key={item} onClick={() => { scrollTo(item.toLowerCase().replace(/\s/g, "-").replace("è", "e").replace("ù", "u")); setMobileMenuOpen(false); }}
                    className="block w-full text-left py-3 text-sm transition-colors border-b" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)", borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>{item}</button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO — Cinematic with Video ═══ */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-end pb-20 pt-16 overflow-hidden">
        {heroVideo ? (
          <HeroVideoBackground
            primarySrc={heroVideo}
            fallbackSrc={fallbackHeroVideo}
            poster={heroPoster}
            className="absolute inset-0 w-full h-full object-cover"
            style={{ filter: "brightness(0.4) saturate(1.1)" }}
            accentColor={`${accentHex}30`}
          />
        ) : (
          <img src={heroPoster} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.4) saturate(1.1)" }} />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, transparent 0%, ${p.bg}40 40%, ${p.bg}CC 75%, ${p.bg} 100%)` }} />

        <motion.div className="relative z-10 max-w-5xl mx-auto w-full px-5" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="flex items-center gap-3 mb-6">
              <span className="h-px w-12" style={{ background: accentHex }} />
              <span className="text-[11px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>
                {theme.hero.eyebrow}
              </span>
            </motion.div>

            <motion.h1 variants={fadeUp} custom={1}
              className="text-4xl sm:text-6xl lg:text-8xl font-bold leading-[0.95] mb-6"
              style={{ fontFamily: siteConfig?.font_heading || "'DM Serif Display', serif" }}>
              {siteConfig?.headline || company.name}
            </motion.h1>

            <motion.p variants={fadeUp} custom={2}
              className="text-lg sm:text-xl max-w-lg mb-10 leading-relaxed"
              style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>
              {siteConfig?.tagline || company.tagline || theme.hero.subheadline}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-xl px-8 h-14 text-base font-semibold text-white shadow-xl"
                style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}CC)` }}
                onClick={() => scrollTo("contatti")}>
                {theme.hero.cta1} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline"
                className="rounded-xl px-8 h-14 text-base"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.12)" : "rgba(0,0,0,0.12)", color: p.text, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                onClick={() => scrollTo("servizi")}>
                {theme.hero.cta2}
              </Button>
            </motion.div>

            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-6 mt-10">
              {company.city && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                  <MapPin className="w-3.5 h-3.5" /> {company.city}
                </span>
              )}
              {company.phone && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
                  <Phone className="w-3.5 h-3.5" /> {company.phone}
                </span>
              )}
            </motion.div>
          </motion.div>
        </motion.div>
      </section>

      {afterHero}

      {/* ═══ STATS BAR ═══ */}
      <Section className="py-16" style={{ background: p.bgAlt }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-8 text-center">
            {[
              { value: 500, suffix: "+", label: "Clienti Soddisfatti" },
              { value: 15, suffix: "+", label: "Anni di Esperienza" },
              { value: 98, suffix: "%", label: "Tasso di Soddisfazione" },
              { value: 4.9, suffix: "★", label: "Rating Medio" },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <p className="text-3xl sm:text-4xl font-bold mb-1" style={{ color: accentHex, fontFamily: "'DM Serif Display', serif" }}>
                  <AnimatedCounter value={Math.floor(s.value)} suffix={s.suffix} />
                </p>
                <p className="text-xs tracking-widest uppercase" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ CHI SIAMO ═══ */}
      <Section id="chi-siamo" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className="h-px w-10" style={{ background: accentHex }} />
              <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>Chi Siamo</span>
            </div>
            <h2 className="text-3xl sm:text-5xl font-bold mb-6 leading-tight" style={{ fontFamily: "'DM Serif Display', serif" }}>
              {company.name}
            </h2>
            <p className="text-base leading-relaxed mb-8" style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
              {company.tagline || theme.hero.subheadline}. 
              Siamo un team di professionisti dedicati a offrire il miglior servizio possibile,
              con attenzione ai dettagli e passione per ciò che facciamo.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {theme.whyUs.slice(0, 4).map((item, i) => (
                <motion.div key={i} className="flex items-start gap-3 p-3 rounded-xl"
                  style={{ background: isDark ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)" }}
                  initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <CheckCircle className="w-4 h-4 mt-0.5 shrink-0" style={{ color: accentHex }} />
                  <div>
                    <h4 className="text-sm font-semibold">{item.title}</h4>
                    <p className="text-xs mt-0.5" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div className="relative" initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
            <div className="rounded-2xl overflow-hidden aspect-[4/5] shadow-2xl" style={{ border: `1px solid ${isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)"}` }}>
              <img src={heroPoster} alt={company.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 px-6 py-3 rounded-xl backdrop-blur-xl shadow-xl"
              style={{ background: isDark ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)", border: `1px solid ${accentHex}30` }}>
              <p className="text-2xl font-bold" style={{ color: accentHex, fontFamily: "'DM Serif Display', serif" }}>15+</p>
              <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Anni di esperienza</p>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* ═══ SERVIZI ═══ */}
      <Section id="servizi" className="py-20 sm:py-28" style={{ background: p.bgAlt }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>I Nostri Servizi</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Cosa possiamo fare per te</h2>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {theme.services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-0 shadow-none hover:scale-[1.02] transition-all duration-500 h-full overflow-hidden group"
                  style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                  <CardContent className="p-6 text-center relative">
                    <div className="w-16 h-16 rounded-2xl mx-auto mb-5 flex items-center justify-center text-3xl transition-transform duration-500 group-hover:scale-110"
                      style={{ background: `${accentHex}12` }}>
                      {s.emoji}
                    </div>
                    <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{s.name}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══ COME FUNZIONA ═══ */}
      <Section id="come-funziona" className="py-20 sm:py-28">
        <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>Come Funziona</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Semplice e veloce</h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {theme.howItWorks.map((step, i) => (
              <motion.div key={i} className="text-center relative"
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.15 }}>
                <div className="text-7xl font-bold mb-4 opacity-[0.06]" style={{ fontFamily: "'DM Serif Display', serif", color: accentHex }}>
                  {step.step}
                </div>
                <div className="w-14 h-14 rounded-2xl mx-auto mb-4 flex items-center justify-center -mt-12 relative z-10 shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}CC)` }}>
                  {[Calendar, Zap, Sparkles][i % 3] && (() => {
                    const Icon = [Calendar, Zap, Sparkles][i % 3];
                    return <Icon className="w-6 h-6 text-white" />;
                  })()}
                </div>
                <h3 className="font-bold text-lg mb-2" style={{ fontFamily: "'DM Serif Display', serif" }}>{step.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ PERCHÉ NOI ═══ */}
      <Section id="perche-noi" className="py-20 sm:py-28" style={{ background: p.bgAlt }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>Perché Sceglierci</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>La differenza che conta</h2>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {theme.whyUs.map((item, i) => (
              <motion.div key={i} className="flex items-start gap-4 p-6 rounded-2xl"
                style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }} whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="w-12 h-12 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: `${accentHex}12` }}>
                  {[Shield, Award, Target, Heart, TrendingUp, Gem][i % 6] && (() => {
                    const Icon = [Shield, Award, Target, Heart, TrendingUp, Gem][i % 6];
                    return <Icon className="w-5 h-5" style={{ color: accentHex }} />;
                  })()}
                </div>
                <div>
                  <h3 className="font-bold mb-1">{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ RECENSIONI ═══ */}
      <Section className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-14">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>Testimonianze</span>
            <h2 className="text-3xl sm:text-5xl font-bold mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>Cosa dicono di noi</h2>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayReviews.slice(0, 6).map((r: any, i: number) => (
              <motion.div key={r.id} variants={fadeUp} custom={i}>
                <Card className="border-0 shadow-none h-full" style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 mb-3" style={{ color: `${accentHex}25` }} />
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="w-4 h-4" fill={s < (r.rating || 5) ? accentHex : "transparent"}
                          stroke={s < (r.rating || 5) ? accentHex : (isDark ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.2)")} />
                      ))}
                    </div>
                    <p className="text-sm mb-4 leading-relaxed italic" style={{ color: isDark ? "rgba(255,255,255,0.55)" : "rgba(0,0,0,0.55)" }}>
                      "{r.comment}"
                    </p>
                    <p className="text-sm font-semibold" style={{ color: accentHex }}>— {r.customer_name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══ ORARI ═══ */}
      {openingHours && openingHours.length > 0 && (
        <Section className="py-16" style={{ background: p.bgAlt }}>
          <div className="max-w-md mx-auto px-6 text-center">
            <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: accentHex }} />
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: "'DM Serif Display', serif" }}>Orari di Apertura</h3>
            <div className="space-y-2">
              {openingHours.map((h: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b" style={{ borderColor: p.cardBorder }}>
                  <span className="font-medium">{h.day}</span>
                  <span style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ FAQ ═══ */}
      {faqs.length > 0 && (
        <Section className="py-20" style={{ background: p.bgAlt }}>
          <div className="max-w-2xl mx-auto px-6">
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: "'DM Serif Display', serif" }}>Domande Frequenti</h3>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <details key={faq.id} className="group rounded-2xl p-5" style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                  <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }} />
                  </summary>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ CONTACT / CTA ═══ */}
      <Section id="contatti" className="py-20 sm:py-28">
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <span className="h-px w-10" style={{ background: accentHex }} />
                <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>Contattaci</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-8" style={{ fontFamily: "'DM Serif Display', serif" }}>
                {theme.hero.cta1}
              </h2>
              <div className="space-y-4">
                <Input placeholder="Nome *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="h-12 rounded-xl border text-sm" style={{ background: p.cardBg, color: p.text, borderColor: p.cardBorder }} />
                <Input placeholder="Telefono *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="h-12 rounded-xl border text-sm" style={{ background: p.cardBg, color: p.text, borderColor: p.cardBorder }} />
                <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="h-12 rounded-xl border text-sm" style={{ background: p.cardBg, color: p.text, borderColor: p.cardBorder }} />
                <Textarea placeholder="Messaggio o richiesta..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="min-h-[100px] rounded-xl border text-sm resize-none" style={{ background: p.cardBg, color: p.text, borderColor: p.cardBorder }} />
                <Button className="w-full h-12 rounded-xl text-white font-semibold text-sm shadow-lg"
                  style={{ background: `linear-gradient(135deg, ${accentHex}, ${accentHex}CC)` }}
                  onClick={handleSubmit} disabled={submitting}>
                  <Send className="w-4 h-4 mr-2" /> {submitting ? "Invio in corso..." : theme.hero.cta1}
                </Button>
              </div>
            </div>

            <div className="space-y-6 lg:pt-16">
              {company.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accentHex }} />
                  <div>
                    <p className="font-semibold text-sm">Indirizzo</p>
                    <p className="text-sm" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{company.address}{company.city ? `, ${company.city}` : ""}</p>
                  </div>
                </div>
              )}
              {company.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accentHex }} />
                  <div>
                    <p className="font-semibold text-sm">Telefono</p>
                    <a href={`tel:${company.phone}`} className="text-sm hover:underline" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{company.phone}</a>
                  </div>
                </div>
              )}
              {company.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: accentHex }} />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <a href={`mailto:${company.email}`} className="text-sm hover:underline" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>{company.email}</a>
                  </div>
                </div>
              )}
              {socialLinks?.whatsapp && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#25D366" }} />
                  <div>
                    <p className="font-semibold text-sm">WhatsApp</p>
                    <a href={`https://wa.me/${socialLinks.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener"
                      className="text-sm hover:underline" style={{ color: isDark ? "rgba(255,255,255,0.5)" : "rgba(0,0,0,0.5)" }}>Scrivici su WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ SECTOR VALUE + AUTOMATION ═══ */}
      <SectorValueProposition sectorKey={industry} accentColor={accentHex} darkMode={isDark} sectorLabel={config.label} />
      <AutomationShowcase accentColor={p.accent} accentBg="bg-primary" sectorName={config.label.toLowerCase()} darkMode={isDark} />

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-5 border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />}
            <span className="font-semibold text-sm" style={{ fontFamily: "'DM Serif Display', serif" }}>{company.name}</span>
          </div>
          <div className="flex items-center gap-4">
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener" className="opacity-50 hover:opacity-100 transition-opacity">
                <Instagram className="w-5 h-5" />
              </a>
            )}
            {socialLinks?.facebook && (
              <a href={socialLinks.facebook} target="_blank" rel="noopener" className="opacity-50 hover:opacity-100 transition-opacity">
                <Globe className="w-5 h-5" />
              </a>
            )}
          </div>
          <p className="text-xs" style={{ color: isDark ? "rgba(255,255,255,0.4)" : "rgba(0,0,0,0.4)" }}>
            © {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.
          </p>
        </div>
        <p className="text-center mt-4 text-[10px]" style={{ color: isDark ? "rgba(255,255,255,0.3)" : "rgba(0,0,0,0.3)" }}>
          Powered by Empire.AI
        </p>
      </footer>

      {/* ═══ FLOATING WHATSAPP ═══ */}
      {(company.phone || socialLinks?.whatsapp) && (
        <a href={`https://wa.me/${(socialLinks?.whatsapp || company.phone || "").replace(/\D/g, "")}`}
          target="_blank" rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          aria-label="WhatsApp">
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}
