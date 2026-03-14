import { useState, useRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
  Shield, Award, Users, Heart, Sparkles, Globe, Quote
} from "lucide-react";

/* ── Animation ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ── Animated Counter ── */
function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useState(() => {
    if (!isInView) return;
    let start = 0;
    const end = value;
    const dur = 2000;
    const step = end / (dur / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  });

  return <span ref={ref}>{isInView ? count : 0}{suffix}</span>;
}

/* ── Section wrapper ── */
function Section({ id, children, style }: { id?: string; children: React.ReactNode; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} style={style}>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
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

  // Hero parallax
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  /* ── Fetch site config ── */
  const { data: siteConfig } = useQuery({
    queryKey: ["public-site-config", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("public_site_config" as any).select("*").eq("company_id", companyId!).maybeSingle();
      return data as any;
    },
    enabled: !!companyId,
  });

  /* ── Fetch reviews ── */
  const { data: reviews = [] } = useQuery({
    queryKey: ["luxury-reviews", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", companyId!).eq("is_public", true).order("created_at", { ascending: false }).limit(6);
      return data || [];
    },
    enabled: !!companyId,
  });

  /* ── Fetch FAQ ── */
  const { data: faqs = [] } = useQuery({
    queryKey: ["luxury-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId!).eq("is_active", true).order("sort_order");
      return data || [];
    },
    enabled: !!companyId,
  });

  /* ── Submit ── */
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

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: p.bg, color: p.text, fontFamily: theme.fonts.body }}>

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl border-b" style={{
        background: isDark ? "rgba(10,10,10,0.85)" : "rgba(255,255,255,0.85)",
        borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)",
      }}>
        <div className="max-w-6xl mx-auto px-5 py-3 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="w-9 h-9 rounded-xl object-cover" />
            ) : (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: p.accentHex }}>
                <span className="text-white text-sm font-bold">{company.name?.[0]}</span>
              </div>
            )}
            <span className="font-semibold text-sm tracking-wide hidden sm:block" style={{ fontFamily: theme.fonts.heading }}>
              {company.name}
            </span>
          </button>

          <div className="hidden md:flex items-center gap-8 text-xs font-medium tracking-widest uppercase" style={{ color: p.textMuted }}>
            {["Chi Siamo", "Servizi", "Perché Noi", "Contatti"].map(label => (
              <button key={label} onClick={() => scrollTo(label.toLowerCase().replace(/\s/g, "-").replace("è", "e").replace("ù", "u"))}
                className="hover:opacity-100 opacity-70 transition-opacity">{label}</button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {company.phone && (
              <a href={`tel:${company.phone}`} className="hidden md:flex items-center gap-1.5 text-xs opacity-60 hover:opacity-100 transition-opacity">
                <Phone className="w-3.5 h-3.5" /> {company.phone}
              </a>
            )}
            <Button size="sm" className="rounded-xl text-xs font-semibold text-white" style={{ background: p.accentHex }}
              onClick={() => scrollTo("contatti")}>
              {theme.hero.cta1}
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative min-h-[90vh] flex items-center justify-center pt-20 px-5">
        {/* Hero background image (from site config or fallback) */}
        {(siteConfig?.hero_image_url || siteConfig?.hero_video_url) ? (
          siteConfig?.hero_video_url ? (
            <video src={siteConfig.hero_video_url} autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" />
          ) : (
            <img src={siteConfig.hero_image_url} alt="" className="absolute inset-0 w-full h-full object-cover" />
          )
        ) : (
          <img
            src={`https://source.unsplash.com/1920x1080/?${encodeURIComponent(config.label + " professional business")}`}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        )}
        {/* Overlay — max 50% opacity for visibility */}
        <div className="absolute inset-0 opacity-50" style={{ background: p.heroBg }} />
        <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 30% 30%, hsl(${p.accent} / 0.15), transparent 60%)` }} />
        {/* Grid texture */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `linear-gradient(hsl(${p.accent} / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(${p.accent} / 0.5) 1px, transparent 1px)`,
          backgroundSize: "80px 80px",
        }} />

        <motion.div className="relative z-10 text-center max-w-3xl mx-auto" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            {/* Eyebrow */}
            <motion.p variants={fadeUp} custom={0}
              className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-6"
              style={{ color: `hsl(${p.accent})` }}>
              {theme.hero.eyebrow}
            </motion.p>

            {/* Logo / Icon */}
            <motion.div variants={fadeUp} custom={1} className="mb-8">
              {company.logo_url ? (
                <img src={company.logo_url} alt="" className="w-20 h-20 rounded-2xl object-cover mx-auto shadow-2xl" />
              ) : (
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto shadow-2xl"
                  style={{ background: `linear-gradient(135deg, hsl(${p.accent}), hsl(${p.accent} / 0.7))` }}>
                  <span className="text-white text-2xl font-bold">{config.emoji}</span>
                </div>
              )}
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} custom={2}
              className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight leading-[1.1] mb-6"
              style={{ fontFamily: siteConfig?.font_heading || theme.fonts.heading }}>
              {siteConfig?.headline || company.name}
            </motion.h1>

            {/* Tagline */}
            <motion.p variants={fadeUp} custom={3}
              className="text-lg sm:text-xl max-w-xl mx-auto mb-10 leading-relaxed"
              style={{ color: p.textMuted }}>
              {siteConfig?.tagline || company.tagline || theme.hero.subheadline}
            </motion.p>

            {/* CTAs */}
            <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-4">
              <Button size="lg" className="rounded-xl px-8 h-13 text-base font-semibold text-white shadow-xl"
                style={{ background: `linear-gradient(135deg, hsl(${p.accent}), hsl(${p.accent} / 0.8))` }}
                onClick={() => scrollTo("contatti")}>
                {theme.hero.cta1} <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
              <Button size="lg" variant="outline"
                className="rounded-xl px-8 h-13 text-base"
                style={{ borderColor: isDark ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.1)", color: p.text, background: isDark ? "rgba(255,255,255,0.05)" : "rgba(0,0,0,0.03)" }}
                onClick={() => scrollTo("servizi")}>
                {theme.hero.cta2}
              </Button>
            </motion.div>

            {/* Info chips */}
            <motion.div variants={fadeUp} custom={5} className="flex flex-wrap justify-center gap-4 mt-10">
              {company.city && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: p.textMuted }}>
                  <MapPin className="w-3.5 h-3.5" /> {company.city}
                </span>
              )}
              {company.phone && (
                <span className="flex items-center gap-1.5 text-sm" style={{ color: p.textMuted }}>
                  <Phone className="w-3.5 h-3.5" /> {company.phone}
                </span>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5" style={{ color: p.textMuted }} />
        </motion.div>
      </section>

      {/* ═══ CHI SIAMO ═══ */}
      <Section id="chi-siamo" style={{ padding: "5rem 1.25rem", background: p.bgAlt }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: `hsl(${p.accent})` }}>
            Chi Siamo
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-6" style={{ fontFamily: theme.fonts.heading }}>
            {company.name}
          </h2>
          <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: p.textMuted }}>
            {company.tagline || theme.hero.subheadline}. 
            Siamo un team di professionisti dedicati a offrire il miglior servizio possibile,
            con attenzione ai dettagli e passione per ciò che facciamo.
          </p>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 mt-12">
            {theme.whyUs.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="p-4 rounded-2xl" style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                <div className="w-10 h-10 rounded-xl mx-auto mb-3 flex items-center justify-center"
                  style={{ background: `hsl(${p.accent} / 0.12)` }}>
                  {[Shield, Award, Users, Heart][i % 4] && (() => {
                    const Icon = [Shield, Award, Users, Heart][i % 4];
                    return <Icon className="w-5 h-5" style={{ color: `hsl(${p.accent})` }} />;
                  })()}
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs" style={{ color: p.textMuted }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ SERVIZI ═══ */}
      <Section id="servizi" style={{ padding: "5rem 1.25rem" }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: `hsl(${p.accent})` }}>
              I Nostri Servizi
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: theme.fonts.heading }}>
              Cosa possiamo fare per te
            </h2>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {theme.services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-0 shadow-none hover:scale-[1.02] transition-all duration-500 h-full"
                  style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                  <CardContent className="p-6 text-center">
                    <span className="text-3xl block mb-4">{s.emoji}</span>
                    <h3 className="font-semibold text-lg mb-2" style={{ fontFamily: theme.fonts.heading }}>{s.name}</h3>
                    <p className="text-sm" style={{ color: p.textMuted }}>{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══ COME FUNZIONA ═══ */}
      <Section id="come-funziona" style={{ padding: "5rem 1.25rem", background: p.bgAlt }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: `hsl(${p.accent})` }}>
              Come Funziona
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: theme.fonts.heading }}>
              Semplice e veloce
            </h2>
          </div>

          <div className="grid sm:grid-cols-3 gap-8">
            {theme.howItWorks.map((step, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.15, duration: 0.6 }}
                className="text-center relative">
                {/* Step number */}
                <div className="text-6xl font-bold mb-4 opacity-[0.08]" style={{ fontFamily: theme.fonts.heading, color: `hsl(${p.accent})` }}>
                  {step.step}
                </div>
                <div className="w-12 h-12 rounded-full mx-auto mb-4 flex items-center justify-center -mt-10 relative z-10"
                  style={{ background: `linear-gradient(135deg, hsl(${p.accent}), hsl(${p.accent} / 0.7))` }}>
                  {[Calendar, CheckCircle, Sparkles][i % 3] && (() => {
                    const Icon = [Calendar, CheckCircle, Sparkles][i % 3];
                    return <Icon className="w-5 h-5 text-white" />;
                  })()}
                </div>
                <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                <p className="text-sm" style={{ color: p.textMuted }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ PERCHÉ NOI ═══ */}
      <Section id="perche-noi" style={{ padding: "5rem 1.25rem" }}>
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: `hsl(${p.accent})` }}>
            Perché Sceglierci
          </p>
          <h2 className="text-3xl sm:text-4xl font-bold mb-12" style={{ fontFamily: theme.fonts.heading }}>
            La differenza che conta
          </h2>

          <div className="grid sm:grid-cols-2 gap-6">
            {theme.whyUs.map((item, i) => (
              <motion.div key={i}
                initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.1, duration: 0.6 }}
                className="flex items-start gap-4 p-5 rounded-2xl text-left"
                style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                <div className="w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center"
                  style={{ background: `hsl(${p.accent} / 0.12)` }}>
                  <CheckCircle className="w-5 h-5" style={{ color: `hsl(${p.accent})` }} />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{item.title}</h3>
                  <p className="text-sm" style={{ color: p.textMuted }}>{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ RECENSIONI ═══ */}
      <Section style={{ padding: "5rem 1.25rem", background: p.bgAlt }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: `hsl(${p.accent})` }}>
              Testimonianze
            </p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ fontFamily: theme.fonts.heading }}>
              Cosa dicono di noi
            </h2>
          </div>

          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger}
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayReviews.slice(0, 6).map((r: any, i: number) => (
              <motion.div key={r.id} variants={fadeUp} custom={i}>
                <Card className="border-0 shadow-none h-full" style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                  <CardContent className="p-6">
                    <Quote className="w-8 h-8 mb-3 opacity-20" style={{ color: `hsl(${p.accent})` }} />
                    <div className="flex gap-1 mb-3">
                      {Array.from({ length: 5 }).map((_, s) => (
                        <Star key={s} className="w-4 h-4" fill={s < (r.rating || 5) ? `hsl(${p.accent})` : "transparent"}
                          stroke={s < (r.rating || 5) ? `hsl(${p.accent})` : p.textMuted} />
                      ))}
                    </div>
                    <p className="text-sm mb-4 leading-relaxed" style={{ color: p.textMuted }}>
                      "{r.comment}"
                    </p>
                    <p className="text-sm font-semibold">— {r.customer_name}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══ ORARI ═══ */}
      {openingHours && openingHours.length > 0 && (
        <Section style={{ padding: "4rem 1.25rem" }}>
          <div className="max-w-md mx-auto text-center">
            <Clock className="w-8 h-8 mx-auto mb-4" style={{ color: `hsl(${p.accent})` }} />
            <h3 className="text-xl font-bold mb-6" style={{ fontFamily: theme.fonts.heading }}>Orari di Apertura</h3>
            <div className="space-y-2">
              {openingHours.map((h: any, i: number) => (
                <div key={i} className="flex justify-between text-sm py-2 border-b" style={{ borderColor: p.cardBorder }}>
                  <span className="font-medium">{h.day}</span>
                  <span style={{ color: p.textMuted }}>{h.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ FAQ ═══ */}
      {faqs.length > 0 && (
        <Section style={{ padding: "4rem 1.25rem", background: p.bgAlt }}>
          <div className="max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-8 text-center" style={{ fontFamily: theme.fonts.heading }}>
              Domande Frequenti
            </h3>
            <div className="space-y-4">
              {faqs.map((faq: any) => (
                <details key={faq.id} className="group rounded-2xl p-5" style={{ background: p.cardBg, border: `1px solid ${p.cardBorder}` }}>
                  <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center">
                    {faq.question}
                    <ChevronDown className="w-4 h-4 transition-transform group-open:rotate-180" style={{ color: p.textMuted }} />
                  </summary>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: p.textMuted }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ CONTACT / CTA ═══ */}
      <Section id="contatti" style={{ padding: "5rem 1.25rem" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            {/* Form */}
            <div>
              <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: `hsl(${p.accent})` }}>
                Contattaci
              </p>
              <h2 className="text-3xl font-bold mb-6" style={{ fontFamily: theme.fonts.heading }}>
                {theme.hero.cta1}
              </h2>
              <div className="space-y-4">
                <Input placeholder="Nome *" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  className="h-12 rounded-xl border-0 text-sm" style={{ background: p.cardBg, color: p.text, borderColor: p.cardBorder, border: `1px solid ${p.cardBorder}` }} />
                <Input placeholder="Telefono *" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  className="h-12 rounded-xl border-0 text-sm" style={{ background: p.cardBg, color: p.text, border: `1px solid ${p.cardBorder}` }} />
                <Input placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                  className="h-12 rounded-xl border-0 text-sm" style={{ background: p.cardBg, color: p.text, border: `1px solid ${p.cardBorder}` }} />
                <Textarea placeholder="Messaggio o richiesta..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                  className="min-h-[100px] rounded-xl border-0 text-sm resize-none" style={{ background: p.cardBg, color: p.text, border: `1px solid ${p.cardBorder}` }} />
                <Button className="w-full h-12 rounded-xl text-white font-semibold text-sm"
                  style={{ background: `linear-gradient(135deg, hsl(${p.accent}), hsl(${p.accent} / 0.8))` }}
                  onClick={handleSubmit} disabled={submitting}>
                  <Send className="w-4 h-4 mr-2" /> {submitting ? "Invio in corso..." : theme.hero.cta1}
                </Button>
              </div>
            </div>

            {/* Info */}
            <div className="space-y-6 lg:pt-16">
              {company.address && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `hsl(${p.accent})` }} />
                  <div>
                    <p className="font-semibold text-sm">Indirizzo</p>
                    <p className="text-sm" style={{ color: p.textMuted }}>{company.address}{company.city ? `, ${company.city}` : ""}</p>
                  </div>
                </div>
              )}
              {company.phone && (
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `hsl(${p.accent})` }} />
                  <div>
                    <p className="font-semibold text-sm">Telefono</p>
                    <a href={`tel:${company.phone}`} className="text-sm hover:underline" style={{ color: p.textMuted }}>{company.phone}</a>
                  </div>
                </div>
              )}
              {company.email && (
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: `hsl(${p.accent})` }} />
                  <div>
                    <p className="font-semibold text-sm">Email</p>
                    <a href={`mailto:${company.email}`} className="text-sm hover:underline" style={{ color: p.textMuted }}>{company.email}</a>
                  </div>
                </div>
              )}
              {socialLinks?.whatsapp && (
                <div className="flex items-start gap-3">
                  <MessageCircle className="w-5 h-5 mt-0.5 flex-shrink-0" style={{ color: "#25D366" }} />
                  <div>
                    <p className="font-semibold text-sm">WhatsApp</p>
                    <a href={`https://wa.me/${socialLinks.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener"
                      className="text-sm hover:underline" style={{ color: p.textMuted }}>Scrivici su WhatsApp</a>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-5 border-t" style={{ borderColor: isDark ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.06)" }}>
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt="" className="w-8 h-8 rounded-lg object-cover" />}
            <span className="font-semibold text-sm">{company.name}</span>
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
          <p className="text-xs" style={{ color: p.textMuted }}>
            © {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.
          </p>
        </div>
        <p className="text-center mt-4 text-[10px]" style={{ color: p.textMuted }}>
          Powered by Empire.AI
        </p>
      </footer>

      <AutomationShowcase accentColor={p.accent} accentBg="bg-primary" sectorName={config.label.toLowerCase()} darkMode={isDark} />

      {/* ═══ FLOATING WHATSAPP ═══ */}
      {(company.phone || socialLinks?.whatsapp) && (
        <a
          href={`https://wa.me/${(socialLinks?.whatsapp || company.phone || "").replace(/\D/g, "")}`}
          target="_blank" rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center shadow-xl hover:scale-110 transition-transform"
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6" />
        </a>
      )}
    </div>
  );
}
