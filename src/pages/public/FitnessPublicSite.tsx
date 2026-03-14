import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumStatsBar, PremiumFAQ } from "@/components/public/PremiumSiteKit";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
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

const ORANGE = "#FF6B00";
const DARK = "#0a0a0a";

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
  { q: "Posso provare prima di iscrivermi?", a: "Certamente! Offriamo una sessione di prova gratuita. Compila il modulo e ti contatteremo per organizzarla." },
  { q: "Quali sono gli orari di apertura?", a: "Siamo aperti Lun-Ven 6:00-22:00, Sab 8:00-20:00, Dom 9:00-14:00. Il piano Elite include accesso 24/7." },
  { q: "Posso congelare l'abbonamento?", a: "Sì, con i piani Pro ed Elite puoi sospendere l'abbonamento fino a 30 giorni all'anno per motivi di salute o vacanza." },
  { q: "Avete personal trainer?", a: "Sì, abbiamo 15+ personal trainer certificati. Puoi prenotare sessioni singole o pacchetti mensili." },
  { q: "C'è un parcheggio?", a: "Sì, abbiamo un parcheggio gratuito riservato ai soci con oltre 50 posti auto." },
];

export default function FitnessPublicSite({ company }: Props) {
  const companyId = company.id;
  const name = company.name || "Fitness Club";
  const tagline = company.tagline || "Trasforma il Tuo Corpo";
  const phone = company.phone;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
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
  const tickerItems = ["CrossFit", "Yoga", "HIIT", "Pilates", "Boxing", "Functional", "Spinning", "Zumba", "Calisthenics", "Stretching"];

  const classes = [
    { name: "CrossFit", icon: Flame, time: "07:00", trainer: "Marco R.", spots: 3, color: "#FF4444", img: GALLERY[0] },
    { name: "Yoga Flow", icon: Heart, time: "09:00", trainer: "Sara M.", spots: 8, color: "#9B59B6", img: GALLERY[1] },
    { name: "HIIT Extreme", icon: Zap, time: "12:00", trainer: "Luca P.", spots: 2, color: ORANGE, img: GALLERY[2] },
    { name: "Pilates", icon: Target, time: "17:00", trainer: "Giulia B.", spots: 5, color: "#2ECC71", img: GALLERY[3] },
    { name: "Boxing", icon: Trophy, time: "18:30", trainer: "Alex V.", spots: 4, color: "#E74C3C", img: GALLERY[4] },
    { name: "Functional", icon: Dumbbell, time: "19:30", trainer: "Marco R.", spots: 6, color: "#3498DB", img: GALLERY[5] },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Oswald', sans-serif", background: DARK, color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: `${DARK}EE`, backdropFilter: "blur(20px)", borderBottom: `2px solid ${ORANGE}` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <div>
              <span className="text-lg font-bold uppercase tracking-wider" style={{ color: ORANGE }}>{name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold text-white/40" style={{ fontFamily: "'Roboto', sans-serif" }}>FITNESS PREMIUM</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-xs uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition" style={{ fontFamily: "'Roboto', sans-serif" }}>{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button className="px-5 font-bold uppercase tracking-wider text-sm hidden sm:flex" style={{ background: ORANGE, color: "#fff" }} onClick={() => scrollTo("iscriviti")}>Iscriviti</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: DARK, borderTop: `1px solid ${ORANGE}30` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 border-b" style={{ borderColor: "rgba(255,255,255,0.05)" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-[100svh] flex items-center overflow-hidden">
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={GALLERY[0]} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.5) saturate(1.06)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${DARK}88 0%, transparent 50%, ${ORANGE}22 100%)` }} />
        <div className="relative z-10 max-w-7xl mx-auto px-5 pt-20 w-full">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: `${ORANGE}25`, color: ORANGE, border: `1px solid ${ORANGE}50`, fontFamily: "'Roboto', sans-serif" }}>
              <Flame className="w-4 h-4" /> Nuova Stagione
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-none mb-5">
              <span className="block text-white">TRASFORMA</span>
              <span className="block" style={{ color: ORANGE, textShadow: `0 0 40px ${ORANGE}44` }}>IL TUO CORPO</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-lg mb-8" style={{ fontFamily: "'Roboto', sans-serif" }}>{tagline}</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Button className="px-8 py-5 text-base font-bold uppercase tracking-wider rounded-xl shadow-2xl" style={{ background: ORANGE, color: "#fff", boxShadow: `0 20px 60px -15px ${ORANGE}55` }} onClick={() => scrollTo("iscriviti")}>Prova Gratuita</Button>
              <Button variant="outline" className="px-8 py-5 text-base uppercase tracking-wider text-white rounded-xl" style={{ borderColor: "#fff2" }} onClick={() => scrollTo("classi")}>Le Nostre Classi</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* TICKER — Premium Marquee */}
      <div className="overflow-hidden py-5 relative" style={{ background: "#111" }}>
        <AmbientGlow color={ORANGE} position="top" />
        <MarqueeCarousel speed={30} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-bold uppercase mx-6 whitespace-nowrap text-white/20" style={{ fontFamily: "'Roboto', sans-serif" }}>
              <Dumbbell className="w-3 h-3" style={{ color: `${ORANGE}50` }} /> {item}
            </span>
          ))
        } />
      </div>

      <NeonDivider color={ORANGE} />

      {/* STATS — Premium Glass */}
      <Section className="py-16 px-4 relative overflow-hidden" style={{ background: "#111" }}>
        <FloatingOrbs color={ORANGE} count={3} />
        <div className="max-w-5xl mx-auto relative z-10">
          <PremiumStatsBar accentColor={ORANGE} stats={[
            { value: 500, suffix: "+", label: "Iscritti" },
            { value: 20, suffix: "+", label: "Classi / Sett." },
            { value: 15, suffix: "+", label: "Trainer" },
            { value: 1500, suffix: "mq", label: "Di Struttura" },
          ]} />
        </div>
      </Section>

      {/* CHI SIAMO */}
      <Section id="chi-siamo" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-3" style={{ color: ORANGE, fontFamily: "'Roboto', sans-serif" }}>LA NOSTRA FILOSOFIA</p>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-5">Più di una <span style={{ color: ORANGE }}>Palestra</span></h2>
            <p className="text-base text-white/50 mb-6 leading-relaxed" style={{ fontFamily: "'Roboto', sans-serif" }}>
              Non siamo solo una palestra — siamo una community di persone che si spingono oltre i propri limiti ogni giorno. Attrezzature all'avanguardia, trainer certificati e programmi personalizzati per ogni livello.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Shield, text: "Attrezzatura Premium" },
                { icon: Users, text: "Community Attiva" },
                { icon: Award, text: "Trainer Certificati" },
                { icon: Target, text: "Programmi su Misura" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-white/50" style={{ fontFamily: "'Roboto', sans-serif" }}>
                  <Icon className="w-4 h-4" style={{ color: ORANGE }} /> {text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="rounded-2xl overflow-hidden relative aspect-[4/5]">
              <img src={GALLERY[0]} alt="Gym" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <motion.div initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.8 }}
                className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5"
                style={{ background: "rgba(0,0,0,0.7)", border: `1px solid ${ORANGE}40` }}>
                <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: `${ORANGE}20` }}>
                  <Flame className="w-4 h-4" style={{ color: ORANGE }} />
                </div>
                <div>
                  <p className="text-[8px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: ORANGE }}>Premium</p>
                  <p className="text-[8px] text-white/45 leading-tight mt-0.5">Fitness Club</p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* CLASSES — auto-carousel */}
      <Section id="classi" className="py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-3xl sm:text-5xl font-bold uppercase text-center mb-10">Le Nostre <span style={{ color: ORANGE }}>Classi</span></h2>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {classes.map((cls, i) => (
                <motion.div key={i} className="group relative rounded-2xl overflow-hidden flex-shrink-0 w-[280px] sm:w-[320px] snap-start" style={{ background: "#111" }}
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <div className="h-44 overflow-hidden relative">
                    <img src={cls.img} alt={cls.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-50" loading="lazy" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                    <Badge className="absolute top-3 right-3 text-[9px]" style={{ background: `${cls.color}30`, color: cls.color, border: `1px solid ${cls.color}50` }}>
                      {cls.spots <= 3 ? "Quasi pieno" : `${cls.spots} posti`}
                    </Badge>
                  </div>
                  <div className="p-5 relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cls.color}20` }}>
                        <cls.icon className="w-5 h-5" style={{ color: cls.color }} />
                      </div>
                      <div>
                        <h3 className="text-base font-bold uppercase">{cls.name}</h3>
                        <p className="text-xs text-white/40" style={{ fontFamily: "'Roboto', sans-serif" }}>{cls.trainer}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between" style={{ fontFamily: "'Roboto', sans-serif" }}>
                      <div className="flex items-center gap-2 text-sm text-white/50"><Timer className="w-4 h-4" /> {cls.time}</div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hover:scale-110 transition" style={{ background: "rgba(0,0,0,0.8)", border: `1px solid ${ORANGE}30` }}>
              <ChevronLeft className="w-5 h-5" style={{ color: ORANGE }} />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center z-10 hover:scale-110 transition" style={{ background: "rgba(0,0,0,0.8)", border: `1px solid ${ORANGE}30` }}>
              <ChevronRight className="w-5 h-5" style={{ color: ORANGE }} />
            </button>
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold uppercase text-center mb-10">La Nostra <span style={{ color: ORANGE }}>Struttura</span></h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-square group cursor-pointer"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-75" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="piani" className="py-16 sm:py-24" style={{ background: "#050505" }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl sm:text-5xl font-bold uppercase text-center mb-10">I Nostri <span style={{ color: ORANGE }}>Piani</span></h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: "Base", price: "39", features: ["Accesso sala pesi", "Spogliatoi", "App Empire"] },
              { name: "Pro", price: "59", features: ["Tutto Base +", "Classi illimitate", "Sauna & Spa", "1 PT/mese"], popular: true },
              { name: "Elite", price: "99", features: ["Tutto Pro +", "PT illimitato", "Nutrizione", "24/7"] },
            ].map((plan, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className={`p-6 text-center relative border-0 ${plan.popular ? "scale-[1.03]" : ""}`} style={{ background: plan.popular ? "#151515" : "#111", border: plan.popular ? `2px solid ${ORANGE}` : "1px solid #222" }}>
                  {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-4" style={{ background: ORANGE, color: "#fff" }}>PIÙ SCELTO</Badge>}
                  <h3 className="text-lg font-bold uppercase mt-2 mb-1 text-white">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-5" style={{ color: ORANGE }}>€{plan.price}<span className="text-sm text-white/30">/mese</span></p>
                  <ul className="space-y-2 mb-6" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    {plan.features.map(f => <li key={f} className="text-sm text-white/60 flex items-center gap-2"><Zap className="w-3 h-3" style={{ color: ORANGE }} />{f}</li>)}
                  </ul>
                  <Button className="w-full py-4 font-bold uppercase tracking-wider" style={{ background: plan.popular ? ORANGE : "#222", color: "#fff" }} onClick={() => scrollTo("iscriviti")}>Scegli {plan.name}</Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: ORANGE, fontFamily: "'Roboto', sans-serif" }}>TESTIMONIANZE</p>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase">Cosa Dicono i <span style={{ color: ORANGE }}>Nostri Atleti</span></h2>
          </div>
          <div className="rounded-2xl p-8 relative overflow-hidden" style={{ background: "#111", border: `1px solid ${ORANGE}15` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" style={{ border: `2px solid ${ORANGE}40` }} />
                  <div>
                    <p className="font-bold text-base text-white" style={{ fontFamily: "'Roboto', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill="#F59E0B" style={{ color: "#F59E0B" }} />)}</div>
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3" style={{ color: `${ORANGE}30` }} />
                <p className="text-lg italic leading-relaxed text-white/60" style={{ fontFamily: "'Roboto', sans-serif" }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? ORANGE : "#333", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* JOIN FORM */}
      <Section id="iscriviti" className="py-16 sm:py-24 relative">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.12)" }}>
          <source src={HERO_VIDEO} type="video/mp4" />
        </video>
        <div className="relative z-10 max-w-lg mx-auto px-5 text-center">
          <Dumbbell className="w-10 h-10 mx-auto mb-4" style={{ color: ORANGE }} />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-3">Inizia <span style={{ color: ORANGE }}>Oggi</span></h2>
          <p className="text-white/40 mb-6" style={{ fontFamily: "'Roboto', sans-serif" }}>Compila il form per una prova gratuita</p>
          <Card className="p-5 text-left border-0" style={{ background: `${DARK}EE`, border: `1px solid ${ORANGE}25`, backdropFilter: "blur(20px)" }}>
            <div className="space-y-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome *" className="bg-transparent border-white/15 text-white h-11" />
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefono *" className="bg-transparent border-white/15 text-white h-11" />
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-transparent border-white/15 text-white h-11" />
              <Input value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} placeholder="Cosa ti interessa? (CrossFit, PT...)" className="bg-transparent border-white/15 text-white h-11" />
            </div>
            <Button onClick={handleLead} disabled={submitting} className="w-full mt-4 py-5 text-base font-bold uppercase tracking-wider rounded-xl shadow-2xl" style={{ background: ORANGE, color: "#fff", boxShadow: `0 15px 40px -10px ${ORANGE}55` }}>
              {submitting ? "Invio..." : "Richiedi Prova Gratuita"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16 sm:py-24 px-4" style={{ background: "#050505" }}>
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.3em] font-bold mb-2" style={{ color: ORANGE, fontFamily: "'Roboto', sans-serif" }}>DOMANDE FREQUENTI</p>
            <h2 className="text-3xl sm:text-4xl font-bold uppercase">FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden" style={{ background: "#111", border: "1px solid #1a1a1a" }}>
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm text-white" style={{ fontFamily: "'Roboto', sans-serif" }}>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: ORANGE }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-white/50" style={{ fontFamily: "'Roboto', sans-serif" }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      <SectorValueProposition sectorKey="fitness" accentColor={ORANGE} darkMode={true} sectorLabel="Palestra" />
      <AutomationShowcase accentColor={ORANGE} accentBg="bg-orange-500" sectorName="palestre e fitness" darkMode={true} />

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex gap-6 text-xs text-white/25">
            {company.address && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{company.address}</span>}
            {phone && <a href={`tel:${phone}`} className="flex items-center gap-1"><Phone className="w-3 h-3" />{phone}</a>}
          </div>
          <div className="flex gap-4 text-xs text-white/25"><a href="/privacy">Privacy</a><span>Powered by Empire.AI</span></div>
        </div>
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
