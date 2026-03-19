import { useState, useRef, useEffect, forwardRef } from "react";
import DemoAdminAccessButton from "@/components/public/DemoAdminAccessButton";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { MarqueeCarousel, ScrollIndicator } from "@/components/public/PremiumSiteKit";
import { motion, useScroll, useTransform, useInView, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, ShoppingBag,
  Heart, Truck, Shield, ArrowRight, MessageCircle,
  CreditCard, Award, RefreshCw, Package, ChevronDown, Quote, Instagram, Menu, X, ChevronLeft, ChevronRight, Sparkles, Users, CheckCircle
} from "lucide-react";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import { DemoPricingSection } from "@/components/public/DemoPricingSection";
import { DemoRichFooter } from "@/components/public/DemoRichFooter";
import fallbackHeroVideo from "@/assets/video-industries.mp4";

/* ─── ONYX + CHAMPAGNE HIGH-FASHION EDITORIAL ─── */
const ONYX = "#111111";
const CHAMPAGNE = "#C8A96E";
const IVORY = "#FAF7F2";

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

const HERO_VIDEO = "https://videos.pexels.com/video-files/5527834/5527834-uhd_2560_1440_25fps.mp4";
const COLLECTIONS = [
  { name: "Nuovi Arrivi", img: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=800", count: 24 },
  { name: "Best Seller", img: "https://images.pexels.com/photos/1884581/pexels-photo-1884581.jpeg?auto=compress&cs=tinysrgb&w=800", count: 18 },
  { name: "Saldi", img: "https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=800", count: 12, sale: true },
  { name: "Premium", img: "https://images.pexels.com/photos/3965545/pexels-photo-3965545.jpeg?auto=compress&cs=tinysrgb&w=800", count: 8 },
  { name: "Accessori", img: "https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg?auto=compress&cs=tinysrgb&w=800", count: 15 },
  { name: "Esclusivi", img: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=800", count: 6 },
];

const FALLBACK_REVIEWS = [
  { name: "Sofia L.", text: "Qualità dei prodotti incredibile. Spedizione velocissima e packaging curato.", rating: 5, photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { name: "Marco P.", text: "Pezzi unici che non trovi altrove. Assistenza clienti eccezionale.", rating: 5, photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { name: "Elena G.", text: "Il negozio più bello della città. Selezione curatissima.", rating: 5, photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
];

const FAQ_ITEMS = [
  { q: "Quanto costa la spedizione?", a: "Gratuita per ordini superiori a €50. Altrimenti €5.90 in tutta Italia." },
  { q: "Posso restituire un prodotto?", a: "Reso gratuito entro 30 giorni dall'acquisto." },
  { q: "Avete un programma fedeltà?", a: "Sì, ogni acquisto accumula punti per sconti esclusivi." },
  { q: "Posso pagare a rate?", a: "Sì, 3 rate senza interessi tramite Klarna o PayPal." },
  { q: "Fate personal shopping?", a: "Sì, su appuntamento sia in negozio che via videochiamata." },
];

export default function RetailPublicSite({ company, afterHero }: Props) {
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
  const tickerItems = ["NUOVI ARRIVI", "SPEDIZIONE GRATUITA", "RESO FACILE", "MADE IN ITALY", "QUALITÀ PREMIUM", "OFFERTE ESCLUSIVE"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Cormorant Garamond', serif", background: IVORY, color: ONYX }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400&family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />

      {/* NAVBAR — high fashion minimal */}
      <nav className="fixed top-0 w-full z-50 transition-all" style={{ background: navScrolled ? `${IVORY}F8` : `${IVORY}DD`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${ONYX}08` }}>
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <span className="text-xl tracking-[0.1em]">{name.toUpperCase()}</span>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {navLinks.map(l => <a key={l.href} href={l.href} className="text-[10px] tracking-[0.3em] uppercase font-medium hover:opacity-100 opacity-40 transition" style={{ fontFamily: "'Montserrat', sans-serif" }}>{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="text-white rounded-none px-6 text-[10px] tracking-[0.2em] uppercase" style={{ background: ONYX, fontFamily: "'Montserrat', sans-serif" }} onClick={() => scrollTo("collezioni")}>Shop Now</Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>{mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}</button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: IVORY, borderTop: `1px solid ${ONYX}05` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm border-b" style={{ borderColor: `${ONYX}05`, fontFamily: "'Montserrat', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO — editorial split */}
      <section id="hero" ref={heroRef} className="relative min-h-[100svh] flex items-center pt-16 overflow-hidden" style={{ background: ONYX }}>
        <HeroVideoBackground primarySrc={HERO_VIDEO} fallbackSrc={fallbackHeroVideo} poster={COLLECTIONS[0].img} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.5) contrast(1.1) saturate(0.8)", opacity: 0.6 }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${ONYX}CC 0%, ${ONYX}88 50%, transparent 100%)` }} />
        <div className="max-w-7xl mx-auto px-5 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div style={{ y: heroY }}>
            <motion.div initial="hidden" animate="show" variants={stagger}>
              <motion.div variants={fadeUp} custom={0} initial={{ width: 0 }} animate={{ width: "80px" }} transition={{ delay: 0.3, duration: 0.6 }} className="h-[2px] mb-8" style={{ background: CHAMPAGNE }} />
              <motion.span variants={fadeUp} custom={0.5} className="text-[10px] tracking-[0.35em] uppercase block mb-4" style={{ color: CHAMPAGNE, fontFamily: "'Montserrat', sans-serif" }}>Nuova Collezione</motion.span>
              <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl lg:text-7xl text-white leading-[1.05] mb-6 italic">{company.tagline || "Stile Inconfondibile"}</motion.h1>
              <motion.p variants={fadeUp} custom={2} className="text-sm text-white/40 mb-10 max-w-md" style={{ fontFamily: "'Montserrat', sans-serif" }}>Scopri la nostra selezione curata. Qualità premium, pezzi unici.</motion.p>
              <motion.div variants={fadeUp} custom={3}>
                <Button className="px-10 py-6 text-[11px] tracking-[0.25em] uppercase rounded-none text-black shadow-2xl" style={{ background: CHAMPAGNE, fontFamily: "'Montserrat', sans-serif" }} onClick={() => scrollTo("collezioni")}>Esplora <ArrowRight className="ml-2 w-4 h-4" /></Button>
              </motion.div>
            </motion.div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 0.8 }} className="relative hidden lg:block">
            <div className="overflow-hidden aspect-[3/4]" style={{ border: `1px solid ${CHAMPAGNE}25` }}>
              <img src={COLLECTIONS[0].img} alt="Fashion" className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-4 -left-4 px-5 py-3" style={{ background: CHAMPAGNE }}>
              <p className="text-xs font-bold tracking-[0.15em] uppercase" style={{ color: ONYX, fontFamily: "'Montserrat', sans-serif" }}>New Season</p>
            </div>
          </motion.div>
        </div>
        <ScrollIndicator color={`${CHAMPAGNE}40`} />
      </section>

      {afterHero}

      {/* TICKER */}
      <div className="overflow-hidden py-3" style={{ background: ONYX }}>
        <MarqueeCarousel speed={30} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-[11px] tracking-[0.3em] mx-8 whitespace-nowrap" style={{ color: `${CHAMPAGNE}30`, fontFamily: "'Montserrat', sans-serif" }}>
              <span className="w-1 h-1 rounded-full" style={{ background: `${CHAMPAGNE}30` }} /> {item}
            </span>
          ))
        } />
      </div>

      {/* Benefits bar */}
      <Section className="py-8 px-4" style={{ background: IVORY }}>
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          {[
            { icon: Truck, text: "Spedizione Gratuita" },
            { icon: RefreshCw, text: "Reso 30gg" },
            { icon: Shield, text: "Pagamento Sicuro" },
            { icon: CreditCard, text: "3 Rate" },
          ].map(({ icon: Icon, text }, i) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <Icon className="w-5 h-5" style={{ color: CHAMPAGNE }} />
              <span className="text-[10px] tracking-[0.15em] uppercase" style={{ fontFamily: "'Montserrat', sans-serif", color: `${ONYX}50` }}>{text}</span>
            </div>
          ))}
        </div>
      </Section>

      {/* CHI SIAMO — editorial */}
      <Section id="chi-siamo" className="py-20 sm:py-28" style={{ background: "#fff" }}>
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <motion.div initial={{ width: 0 }} whileInView={{ width: "60px" }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="h-[1px] mb-6" style={{ background: CHAMPAGNE }} />
            <p className="text-[10px] tracking-[0.3em] uppercase mb-4" style={{ color: CHAMPAGNE, fontFamily: "'Montserrat', sans-serif" }}>LA NOSTRA STORIA</p>
            <h2 className="text-3xl sm:text-4xl italic mb-6">Curatela e Passione</h2>
            <p className="text-sm leading-relaxed mb-6" style={{ color: `${ONYX}60`, fontFamily: "'Montserrat', sans-serif" }}>
              Selezioniamo con cura ogni singolo prodotto. La nostra missione è offrire un'esperienza di shopping unica, dove qualità, stile e attenzione al dettaglio si fondono.
            </p>
            <div className="grid grid-cols-2 gap-3">
              {[
                { icon: Heart, text: "Selezione Curata" },
                { icon: Award, text: "Brand Premium" },
                { icon: Users, text: "Consulenza Dedicata" },
                { icon: Package, text: "Made in Italy" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-2 text-xs" style={{ color: `${ONYX}50`, fontFamily: "'Montserrat', sans-serif" }}>
                  <Icon className="w-3.5 h-3.5" style={{ color: CHAMPAGNE }} /> {text}
                </div>
              ))}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="overflow-hidden aspect-[4/5]" style={{ border: `1px solid ${ONYX}08` }}>
              <img src={COLLECTIONS[3].img} alt="Store" className="w-full h-full object-cover" />
            </div>
          </motion.div>
        </div>
      </Section>

      {/* COLLECTIONS */}
      <Section id="collezioni" className="py-20 sm:py-28" style={{ background: IVORY }}>
        <div className="max-w-7xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] tracking-[0.3em] uppercase mb-3" style={{ color: CHAMPAGNE, fontFamily: "'Montserrat', sans-serif" }}>SHOP</p>
            <h2 className="text-3xl sm:text-4xl italic">Le Nostre Collezioni</h2>
          </div>
          <div ref={scrollRef} className="flex gap-4 overflow-x-auto scrollbar-hide snap-x snap-mandatory pb-4" style={{ scrollbarWidth: "none" }}>
            {COLLECTIONS.map((cat, i) => (
              <motion.div key={i} className="relative overflow-hidden group cursor-pointer aspect-[3/4] flex-shrink-0 w-[260px] sm:w-[300px] snap-start"
                whileHover={{ y: -5 }}>
                <img src={cat.img} alt={cat.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/50 transition-colors flex items-end p-6">
                  <div>
                    <h3 className="text-xl text-white italic">{cat.name}</h3>
                    <p className="text-white/50 text-xs mt-1" style={{ fontFamily: "'Montserrat', sans-serif" }}>{cat.count} prodotti</p>
                    {cat.sale && <Badge className="mt-2 rounded-none" style={{ background: CHAMPAGNE, color: ONYX }}>Fino al -50%</Badge>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* REVIEWS */}
      <Section id="recensioni" className="py-20 sm:py-28" style={{ background: "#fff" }}>
        <div className="max-w-5xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl italic">Cosa Dicono i Clienti</h2>
          </div>
          <div className="p-8 relative overflow-hidden" style={{ background: `${IVORY}`, border: `1px solid ${ONYX}06` }}>
            <AnimatePresence mode="wait">
              <motion.div key={reviewIndex} initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -30 }}>
                <div className="flex items-center gap-4 mb-6">
                  <img src={FALLBACK_REVIEWS[reviewIndex].photo} alt="" className="w-14 h-14 rounded-full object-cover" />
                  <div>
                    <p className="text-sm font-bold" style={{ fontFamily: "'Montserrat', sans-serif" }}>{FALLBACK_REVIEWS[reviewIndex].name}</p>
                    <div className="flex gap-0.5">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={CHAMPAGNE} style={{ color: CHAMPAGNE }} />)}</div>
                  </div>
                </div>
                <p className="text-xl italic leading-relaxed" style={{ color: `${ONYX}60` }}>"{FALLBACK_REVIEWS[reviewIndex].text}"</p>
              </motion.div>
            </AnimatePresence>
            <div className="flex gap-2 mt-8">
              {FALLBACK_REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setReviewIndex(i)} className="h-[2px] transition-all" style={{ width: i === reviewIndex ? "40px" : "16px", background: i === reviewIndex ? CHAMPAGNE : `${ONYX}15` }} />
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* FAQ */}
      <Section className="py-20" style={{ background: IVORY }}>
        <div className="max-w-3xl mx-auto px-5">
          <h2 className="text-3xl italic text-center mb-10">FAQ</h2>
          <div className="space-y-2">
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} className="overflow-hidden" style={{ borderBottom: `1px solid ${ONYX}08` }}>
                <button className="w-full text-left py-5 flex items-center justify-between gap-3" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                  <span className="text-sm" style={{ fontFamily: "'Montserrat', sans-serif" }}>{item.q}</span>
                  <ChevronDown className={`w-4 h-4 shrink-0 transition-transform ${openFaq === i ? "rotate-180" : ""}`} style={{ color: CHAMPAGNE }} />
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                      <p className="pb-5 text-sm leading-relaxed" style={{ color: `${ONYX}50`, fontFamily: "'Montserrat', sans-serif" }}>{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* NEWSLETTER + CONTACT */}
      <Section id="contatti" className="py-20" style={{ background: ONYX }}>
        <div className="max-w-3xl mx-auto px-5 text-center text-white">
          <h2 className="text-3xl italic mb-3">Resta Connesso</h2>
          <p className="text-sm mb-8" style={{ color: `rgba(255,255,255,0.4)`, fontFamily: "'Montserrat', sans-serif" }}>Iscriviti per offerte esclusive e anticipazioni</p>
          <div className="flex gap-2 max-w-md mx-auto mb-12">
            <Input value={email} onChange={e => setEmail(e.target.value)} placeholder="La tua email" className="flex-1 rounded-none bg-transparent border-white/15 text-white h-12" style={{ fontFamily: "'Montserrat', sans-serif" }} />
            <Button className="rounded-none px-8 h-12" style={{ background: CHAMPAGNE, color: ONYX, fontFamily: "'Montserrat', sans-serif" }} onClick={handleNewsletter}>Iscriviti</Button>
          </div>
          <div className="flex flex-wrap justify-center gap-8 text-xs" style={{ color: "rgba(255,255,255,0.3)", fontFamily: "'Montserrat', sans-serif" }}>
            {company.address && <span className="flex items-center gap-1.5"><MapPin className="w-3.5 h-3.5" />{company.address}</span>}
            {phone && <a href={`tel:${phone}`} className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" />{phone}</a>}
            {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" />{company.email}</a>}
            {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener" className="flex items-center gap-1.5"><Instagram className="w-3.5 h-3.5" /> Instagram</a>}
          </div>
        </div>
      </Section>

      <DemoPricingSection sector="retail" accentColor={CHAMPAGNE} darkMode={true} bgColor={ONYX} />
      <AIAgentsShowcase sector="retail" />
      <SectorValueProposition sectorKey="retail" accentColor={CHAMPAGNE} darkMode={true} sectorLabel="Negozio" />
      <AutomationShowcase accentColor={CHAMPAGNE} accentBg="bg-amber-600" sectorName="negozi e retail" darkMode={true} />

      <DemoRichFooter company={company} accentColor={CHAMPAGNE} darkMode={true} bgColor={ONYX} sectorLabel="PREMIUM RETAIL" fontFamily="'Montserrat', sans-serif" />

      {phone && (
        <motion.a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}
          whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}
          animate={{ boxShadow: ["0 0 0 0 rgba(37,211,102,0.4)", "0 0 0 15px rgba(37,211,102,0)", "0 0 0 0 rgba(37,211,102,0)"] }}
          transition={{ repeat: Infinity, duration: 2 }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </motion.a>
      )}
      <DemoAdminAccessButton sector="retail" accentColor="#B8860B" />
    </div>
  );
}
