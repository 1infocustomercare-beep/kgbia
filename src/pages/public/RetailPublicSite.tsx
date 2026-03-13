import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, ShoppingBag,
  Heart, Truck, Shield, ArrowRight, MessageCircle,
  CreditCard, Award, RefreshCw, Package, ChevronDown, Quote, Instagram, Menu, X, ChevronLeft, ChevronRight, Sparkles, Users, CheckCircle
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import fallbackHeroVideo from "@/assets/video-industries.mp4";

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

const HERO_VIDEO = "https://videos.pexels.com/video-files/5585385/5585385-uhd_2560_1440_25fps.mp4";
const COLLECTIONS = [
  { name: "Nuovi Arrivi", img: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800", count: 24 },
  { name: "Best Seller", img: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800", count: 18 },
  { name: "Saldi", img: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800", count: 12, sale: true },
  { name: "Premium", img: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=800", count: 8 },
  { name: "Accessori", img: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800", count: 15 },
  { name: "Esclusivi", img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800", count: 6 },
];

const FALLBACK_REVIEWS = [
  { name: "Sofia L.", text: "Qualità dei prodotti incredibile. Spedizione velocissima e packaging curato nei minimi dettagli.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Marco P.", text: "Ho trovato pezzi unici che non trovi altrove. Assistenza clienti eccezionale.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Elena G.", text: "Il negozio più bello della città. Selezione curatissima e staff super competente.", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

const FAQ_ITEMS = [
  { q: "Quanto costa la spedizione?", a: "Spedizione gratuita per ordini superiori a €50. Per importi inferiori il costo è di €5.90 in tutta Italia." },
  { q: "Posso restituire un prodotto?", a: "Sì, offriamo reso gratuito entro 30 giorni dall'acquisto. Basta contattarci e organizzeremo il ritiro." },
  { q: "Avete un programma fedeltà?", a: "Sì! Ogni acquisto accumula punti Empire. Al raggiungimento delle soglie ricevi sconti esclusivi e anteprime." },
  { q: "Posso pagare a rate?", a: "Certamente. Offriamo pagamento in 3 rate senza interessi tramite Klarna o PayPal Pay Later." },
  { q: "Fate personal shopping?", a: "Sì, offriamo un servizio di personal shopping su appuntamento sia in negozio che online via videochiamata." },
];

export default function RetailPublicSite({ company }: Props) {
  const accent = company.primary_color || "#1a1a1a";
  const companyId = company.id;
  const [email, setEmail] = useState("");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const phone = company.phone;
  const name = company.name || "Store";
  const socialLinks = company.social_links as Record<string, string> | null;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);
  useEffect(() => { const t = setInterval(() => setReviewIndex(p => (p + 1) % FALLBACK_REVIEWS.length), 5000); return () => clearInterval(t); }, []);
  useEffect(() => {
    const el = scrollRef.current; if (!el) return;
    const t = setInterval(() => { if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" }); else el.scrollBy({ left: 320, behavior: "smooth" }); }, 4000);
    return () => clearInterval(t);
  }, []);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 100]);

  const handleNewsletter = async () => {
    if (!email) return;
    await supabase.from("leads").insert({ company_id: companyId, name: email.split("@")[0], email, source: "newsletter" });
    toast.success("Iscritto alla newsletter!");
    setEmail("");
  };

  const navLinks = [{ href: "#chi-siamo", label: "Chi Siamo" }, { href: "#collezioni", label: "Collezioni" }, { href: "#recensioni", label: "Recensioni" }, { href: "#contatti", label: "Contatti" }];
  const tickerItems = ["Nuovi Arrivi", "Spedizione Gratuita", "Reso Facile", "Made in Italy", "Qualità Premium", "Offerte Esclusive", "Pagamento Sicuro", "Consegna Rapida"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Inter', sans-serif", background: "#fff", color: "#111" }}>

      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: navScrolled ? "rgba(255,255,255,0.97)" : "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(0,0,0,0.06)" }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <span className="text-lg font-bold tracking-tight">{name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-xs tracking-widest uppercase font-medium text-gray-400 hover:text-black transition">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="text-white rounded-full px-5" style={{ background: accent }} onClick={() => scrollTo("negozio")}>Shop Now</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-white border-t border-gray-100">
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b border-gray-50">{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden" style={{ background: "#f8f8f8" }}>
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={COLLECTIONS[0].img} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.8) saturate(1.04)", opacity: 0.58 }} />
        <div className="absolute inset-0 bg-gradient-to-r from-white/68 via-white/42 to-transparent" />
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div style={{ y: heroY }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.span variants={fadeUp} custom={0} className="text-[10px] uppercase tracking-[0.25em] font-bold mb-4 block" style={{ color: accent }}>Nuova Collezione</motion.span>
              <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-5">{company.tagline || "Shopping Premium"}</motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-base text-gray-500 mb-8 max-w-lg">Scopri le ultime novità selezionate per te. Qualità premium, stile inconfondibile.</motion.p>
              <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3">
                <Button className="px-8 py-5 text-base text-white rounded-xl shadow-2xl" style={{ background: accent, boxShadow: `0 20px 60px -15px ${accent}44` }} onClick={() => scrollTo("collezioni")}>Esplora <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="rounded-3xl overflow-hidden shadow-2xl aspect-[3/4]">
              <img src={COLLECTIONS[0].img} alt="Fashion" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-gray-300" />
        </motion.div>
      </section>

      {/* TICKER */}
      <div className="overflow-hidden py-4 border-y border-gray-100" style={{ background: accent }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-medium text-white/50">
              <Sparkles className="w-3 h-3 text-white/30" /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* Benefits bar */}
      <Section className="py-6 px-4">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { icon: Truck, text: "Spedizione Gratuita" },
            { icon: RefreshCw, text: "Reso Facile 30gg" },
            { icon: Shield, text: "Pagamento Sicuro" },
            { icon: CreditCard, text: "3 Rate Senza Interessi" },
          ].map(({ icon: Icon, text }, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
              className="flex items-center gap-2.5 text-sm text-gray-500">
              <Icon className="w-4 h-4 shrink-0" style={{ color: accent }} /> {text}
            </motion.div>
          ))}
        </div>
      </Section>

      {/* STATS */}
      <Section className="py-14 px-4" style={{ background: "#fafafa" }}>
        <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-6 text-center">
          {[
            { value: 5000, suffix: "+", label: "Clienti Soddisfatti" },
            { value: 200, suffix: "+", label: "Brand Selezionati" },
            { value: 98, suffix: "%", label: "Recensioni Positive" },
            { value: 24, suffix: "h", label: "Consegna Express" },
          ].map((s, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <p className="text-3xl sm:text-4xl font-bold" style={{ color: accent }}><AnimatedNum value={s.value} suffix={s.suffix} /></p>
              <p className="text-[11px] uppercase tracking-[0.15em] mt-2 text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </Section>

      {/* CHI SIAMO */}
      <Section id="chi-siamo" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8 }}>
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-3" style={{ color: accent }}>LA NOSTRA STORIA</p>
            <h2 className="text-3xl sm:text-4xl font-bold mb-5">Curatela e <span style={{ color: accent }}>Passione</span></h2>
            <p className="text-base text-gray-500 mb-6 leading-relaxed">
              Selezioniamo con cura ogni singolo prodotto che entra nel nostro negozio. La nostra missione è offrire un'esperienza di shopping unica, dove qualità, stile e attenzione al dettaglio si fondono in un ambiente accogliente e raffinato.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Heart, text: "Selezione Curata" },
                { icon: Award, text: "Brand Premium" },
                { icon: Users, text: "Consulenza Dedicata" },
                { icon: Package, text: "Made in Italy" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-gray-500">
                  <Icon className="w-4 h-4" style={{ color: accent }} /> {text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, delay: 0.2 }}>
            <div className="rounded-2xl overflow-hidden shadow-lg aspect-[4/5]">
              <img src={COLLECTIONS[3].img} alt="Store" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* COLLECTIONS — auto-carousel */}
      <Section id="collezioni" className="py-16 sm:py-24" style={{ background: "#fafafa" }}>
        <div className="max-w-7xl mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10">Le Nostre Collezioni</h2>
          <div className="relative">
            <div ref={scrollRef} className="flex gap-5 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
              {COLLECTIONS.map((cat, i) => (
                <motion.div key={i} className="relative rounded-2xl overflow-hidden group cursor-pointer aspect-[3/4] flex-shrink-0 w-[260px] sm:w-[300px] snap-start"
                  whileHover={{ y: -5, transition: { duration: 0.3 } }}>
                  <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/55 transition-colors flex items-end p-5">
                    <div>
                      <h3 className="text-xl font-bold text-white">{cat.name}</h3>
                      <p className="text-white/70 text-sm">{cat.count} prodotti</p>
                      {cat.sale && <Badge className="mt-2" style={{ background: "#E74C3C", color: "#fff" }}>Fino al -50%</Badge>}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
            <button onClick={() => scrollRef.current?.scrollBy({ left: -320, behavior: "smooth" })} className="absolute left-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollRef.current?.scrollBy({ left: 320, behavior: "smooth" })} className="absolute right-0 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center bg-white shadow-lg z-10 hover:scale-110 transition">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="negozio" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-10">Il Nostro Negozio</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {COLLECTIONS.map((c, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-square group"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}
                whileHover={{ scale: 1.02 }}>
                <img src={c.img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <Badge className="text-sm" style={{ background: "rgba(255,255,255,0.9)", color: "#111" }}>{c.name}</Badge>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-16 sm:py-24" style={{ background: "#fafafa" }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: accent }}>TESTIMONIANZE</p>
            <h2 className="text-3xl font-bold">Cosa Dicono i Clienti</h2>
          </div>
          <div className="rounded-2xl p-8 bg-white shadow-sm mb-8 relative overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }} transition={{ duration: 0.5 }}>
                <div className="flex items-center gap-4 mb-4">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="font-bold text-base">{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill="#F59E0B" style={{ color: "#F59E0B" }} />)}</div>
                  </div>
                </div>
                <Quote className="w-8 h-8 mb-3 text-gray-200" />
                <p className="text-lg italic leading-relaxed text-gray-600">"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 justify-center mt-6">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="w-2 h-2 rounded-full transition-all" style={{ background: i === reviewIndex ? accent : "#e0e0e0", transform: i === reviewIndex ? "scale(1.3)" : "scale(1)" }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-16 sm:py-24">
        <div className="max-w-3xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: accent }}>DOMANDE FREQUENTI</p>
            <h2 className="text-3xl font-bold">FAQ</h2>
          </div>
          <div className="space-y-3">
            {FAQ_ITEMS.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="rounded-xl overflow-hidden bg-gray-50 border border-gray-100">
                <button className="w-full text-left px-5 py-4 flex items-center justify-between gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="font-semibold text-sm">{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: accent }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="px-5 pb-4 text-sm leading-relaxed text-gray-500">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT + NEWSLETTER */}
      <Section id="contatti" className="py-16 sm:py-24" style={{ background: "#fafafa" }}>
        <div className="max-w-5xl mx-auto px-5 grid md:grid-cols-2 gap-10">
          <div>
            <h2 className="text-3xl font-bold mb-5">Vieni a Trovarci</h2>
            <div className="space-y-4 text-gray-500">
              {company.address && <div className="flex items-start gap-3"><MapPin className="w-5 h-5 mt-0.5 shrink-0" style={{ color: accent }} /><span>{company.address}{company.city ? `, ${company.city}` : ""}</span></div>}
              {phone && <div className="flex items-center gap-3"><Phone className="w-5 h-5 shrink-0" style={{ color: accent }} /><a href={`tel:${phone}`}>{phone}</a></div>}
              {company.email && <div className="flex items-center gap-3"><Mail className="w-5 h-5 shrink-0" style={{ color: accent }} /><a href={`mailto:${company.email}`}>{company.email}</a></div>}
              <div className="flex items-center gap-3"><Clock className="w-5 h-5 shrink-0" style={{ color: accent }} /><span>Lun-Sab 10:00-20:00</span></div>
            </div>
            {socialLinks?.instagram && (
              <a href={socialLinks.instagram} target="_blank" rel="noopener" className="inline-flex items-center gap-2 mt-4 text-sm font-medium" style={{ color: accent }}>
                <Instagram className="w-4 h-4" /> Seguici su Instagram
              </a>
            )}
          </div>
          <div className="rounded-2xl p-6" style={{ background: "#fff" }}>
            <h3 className="text-xl font-bold mb-3">Newsletter</h3>
            <p className="text-gray-400 mb-4 text-sm">Ricevi offerte esclusive e anticipazioni.</p>
            <div className="flex gap-2">
              <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="La tua email" className="flex-1" />
              <Button style={{ background: accent, color: "#fff" }} onClick={handleNewsletter}>Iscriviti</Button>
            </div>
          </div>
        </div>
      </Section>

      <AutomationShowcase accentColor={accent} accentBg="bg-gray-800" sectorName="negozi e retail" darkMode={false} />

      {/* FOOTER */}
      <footer className="py-8 border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-300">© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex gap-4 text-xs text-gray-300"><a href="/privacy">Privacy</a><span>Powered by Empire.AI</span></div>
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
