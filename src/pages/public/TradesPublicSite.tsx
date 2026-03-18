import { useState, useRef, useEffect, forwardRef } from "react";
import DemoAdminAccessButton from "@/components/public/DemoAdminAccessButton";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { AIAgentsShowcase } from "@/components/public/AIAgentsShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { MarqueeCarousel, AmbientGlow, FloatingOrbs, NeonDivider, ScrollIndicator, PremiumFAQ } from "@/components/public/PremiumSiteKit";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Wrench, Zap, Star, Phone, Mail, MapPin, Clock, Calendar,
  Shield, CheckCircle, Send, Award, Users, FileText,
  Hammer, Lightbulb, Droplets, Settings, AlertTriangle,
  Sparkles, ChevronDown, Menu, X
} from "lucide-react";
import { type IndustryId, getIndustryConfig } from "@/config/industry-config";
import { HeroVideoBackground } from "@/components/public/HeroVideoBackground";
import { HeroPhotoCarousel } from "@/components/public/HeroPhotoCarousel";
import fallbackHeroVideo from "@/assets/video-industries.mp4";
/* ─── DYNAMIC PALETTE PER TRADE TYPE ─── */
const PALETTES: Record<string, { accent: string; dark: string; glow: string }> = {
  electrician: { accent: "#F5B800", dark: "#0C0A06", glow: "#FFF3C4" },
  plumber: { accent: "#3B82F6", dark: "#060A10", glow: "#DBEAFE" },
  construction: { accent: "#EF6C00", dark: "#0A0704", glow: "#FFE0B2" },
  gardening: { accent: "#4CAF50", dark: "#040A04", glow: "#C8E6C9" },
  cleaning: { accent: "#00BCD4", dark: "#040A0A", glow: "#B2EBF2" },
  garage: { accent: "#E53935", dark: "#0A0404", glow: "#FFCDD2" },
  photography: { accent: "#AB47BC", dark: "#0A040A", glow: "#E1BEE7" },
  veterinary: { accent: "#66BB6A", dark: "#040A04", glow: "#C8E6C9" },
  tattoo: { accent: "#F44336", dark: "#0A0404", glow: "#FFCDD2" },
  childcare: { accent: "#FF9800", dark: "#0A0804", glow: "#FFE0B2" },
  education: { accent: "#2196F3", dark: "#04080A", glow: "#BBDEFB" },
  events: { accent: "#E91E63", dark: "#0A0408", glow: "#F8BBD0" },
  logistics: { accent: "#607D8B", dark: "#060808", glow: "#CFD8DC" },
  agriturismo: { accent: "#8BC34A", dark: "#060A04", glow: "#DCEDC8" },
  legal: { accent: "#795548", dark: "#080604", glow: "#D7CCC8" },
  accounting: { accent: "#009688", dark: "#040A08", glow: "#B2DFDB" },
  default: { accent: "#F5B800", dark: "#0C0A06", glow: "#FFF3C4" },
};

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


const HERO_VIDEOS: Record<string, string> = {
  construction: "https://videos.pexels.com/video-files/5698648/5698648-uhd_2560_1440_25fps.mp4",
  education: "https://videos.pexels.com/video-files/5198164/5198164-uhd_2560_1440_25fps.mp4",
};

/* ─── PROFESSIONAL HERO PHOTOS per sector (used when no matching video exists) ─── */
const HERO_PHOTOS: Record<string, string[]> = {
  electrician: [
    "https://images.pexels.com/photos/8005397/pexels-photo-8005397.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/8005368/pexels-photo-8005368.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/257886/pexels-photo-257886.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  plumber: [
    "https://images.pexels.com/photos/6419128/pexels-photo-6419128.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6419073/pexels-photo-6419073.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6419071/pexels-photo-6419071.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  gardening: [
    "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1105019/pexels-photo-1105019.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1072824/pexels-photo-1072824.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2132227/pexels-photo-2132227.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  cleaning: [
    "https://images.pexels.com/photos/4239091/pexels-photo-4239091.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4239035/pexels-photo-4239035.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4239036/pexels-photo-4239036.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  garage: [
    "https://images.pexels.com/photos/3807517/pexels-photo-3807517.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3642618/pexels-photo-3642618.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4489702/pexels-photo-4489702.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4116193/pexels-photo-4116193.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  photography: [
    "https://images.pexels.com/photos/1264210/pexels-photo-1264210.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3379934/pexels-photo-3379934.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3062541/pexels-photo-3062541.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1983037/pexels-photo-1983037.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  veterinary: [
    "https://images.pexels.com/photos/6234603/pexels-photo-6234603.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6235116/pexels-photo-6235116.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6234984/pexels-photo-6234984.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/7469214/pexels-photo-7469214.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  tattoo: [
    "https://images.pexels.com/photos/1304469/pexels-photo-1304469.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/955938/pexels-photo-955938.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2183131/pexels-photo-2183131.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4125659/pexels-photo-4125659.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  childcare: [
    "https://images.pexels.com/photos/3662667/pexels-photo-3662667.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3661193/pexels-photo-3661193.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/8613089/pexels-photo-8613089.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3662579/pexels-photo-3662579.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  events: [
    "https://images.pexels.com/photos/2263436/pexels-photo-2263436.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/2608517/pexels-photo-2608517.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/587741/pexels-photo-587741.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  logistics: [
    "https://images.pexels.com/photos/4481259/pexels-photo-4481259.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6169668/pexels-photo-6169668.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4246120/pexels-photo-4246120.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/4481326/pexels-photo-4481326.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  agriturismo: [
    "https://images.pexels.com/photos/2252584/pexels-photo-2252584.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5462249/pexels-photo-5462249.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/1353938/pexels-photo-1353938.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  legal: [
    "https://images.pexels.com/photos/5668858/pexels-photo-5668858.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5668882/pexels-photo-5668882.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5669619/pexels-photo-5669619.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5668473/pexels-photo-5668473.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  accounting: [
    "https://images.pexels.com/photos/6863183/pexels-photo-6863183.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/7681091/pexels-photo-7681091.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/6694543/pexels-photo-6694543.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/5483071/pexels-photo-5483071.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
  default: [
    "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1600",
    "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1600",
  ],
};

export default function TradesPublicSite({ company, afterHero }: Props) {
  const companyId = company.id;
  const industry = (company.industry || "plumber") as IndustryId;
  const config = getIndustryConfig(industry);
  const palette = PALETTES[industry] || PALETTES.default;
  const A = palette.accent;
  const D = palette.dark;
  const isElectrician = industry === "electrician";
  const isPlumber = industry === "plumber";
  const HeroIcon = isElectrician ? Zap : isPlumber ? Droplets : Wrench;
  const heroVideo = HERO_VIDEOS[industry]; // only set for verified matching videos
  const heroPhotos = HERO_PHOTOS[industry] || HERO_PHOTOS.default;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "", urgency: "normal", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: faqs = [] } = useQuery({
    queryKey: ["trades-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.type) { toast.error("Compila nome, telefono e tipo intervento"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("interventions").insert({
      company_id: companyId, client_name: form.name, client_phone: form.phone,
      intervention_type: form.type, urgency: form.urgency, address: form.address || null, notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nell'invio"); return; }
    toast.success("Richiesta inviata!");
    setForm({ name: "", phone: "", email: "", type: "", urgency: "normal", address: "", notes: "" });
  };

  const interventionTypes = isElectrician
    ? ["Impianto elettrico", "Messa a norma", "Corto circuito", "Installazione luci", "Quadro elettrico", "Domotica", "Certificazione", "Altro"]
    : isPlumber
    ? ["Perdita acqua", "Scarico intasato", "Sanitari", "Caldaia", "Riscaldamento", "Impianto idrico", "Emergenza allagamento", "Altro"]
    : ["Riparazione", "Installazione", "Manutenzione", "Emergenza", "Preventivo", "Altro"];

  const services = isElectrician ? [
    { emoji: "⚡", name: "Impianti Elettrici", desc: "Installazione e messa a norma" },
    { emoji: "💡", name: "Illuminazione", desc: "LED, faretti, lampadari" },
    { emoji: "🔌", name: "Quadri Elettrici", desc: "Progettazione e installazione" },
    { emoji: "🏠", name: "Domotica", desc: "Casa intelligente e automazioni" },
    { emoji: "📋", name: "Certificazioni", desc: "Dichiarazioni di conformità" },
    { emoji: "🚨", name: "Pronto Intervento", desc: "Emergenze 24h" },
  ] : isPlumber ? [
    { emoji: "🔧", name: "Riparazioni", desc: "Perdite, guasti e emergenze" },
    { emoji: "🚿", name: "Impianti Idrici", desc: "Bagni, cucine e lavanderie" },
    { emoji: "🔥", name: "Caldaie", desc: "Installazione e manutenzione" },
    { emoji: "❄️", name: "Riscaldamento", desc: "Termosifoni e pavimento radiante" },
    { emoji: "🏗️", name: "Ristrutturazioni", desc: "Rifacimento bagni e impianti" },
    { emoji: "🚨", name: "Pronto Intervento", desc: "Emergenze allagamenti 24h" },
  ] : [
    { emoji: "🔧", name: "Riparazioni", desc: "Interventi rapidi e risolutivi" },
    { emoji: "🏗️", name: "Installazioni", desc: "Nuovi impianti e strutture" },
    { emoji: "🔍", name: "Manutenzione", desc: "Controlli programmati" },
    { emoji: "📋", name: "Preventivi", desc: "Sopralluogo e preventivo gratuito" },
    { emoji: "🛡️", name: "Garanzia", desc: "Lavori garantiti" },
    { emoji: "🚨", name: "Emergenze", desc: "Disponibilità 24h" },
  ];

  const whyUs = [
    { icon: Shield, title: "Lavoro Garantito", desc: "Garanzia con copertura assicurativa completa" },
    { icon: Clock, title: "Intervento Rapido", desc: "Rispondiamo in meno di 1 ora" },
    { icon: FileText, title: "Preventivo Gratuito", desc: "Sopralluogo senza impegno" },
    { icon: Award, title: "Esperienza Certificata", desc: "Tecnici qualificati con anni di esperienza" },
    { icon: CheckCircle, title: "Prezzi Trasparenti", desc: "Nessuna sorpresa sul prezzo finale" },
    { icon: AlertTriangle, title: "Emergenze H24", desc: "Disponibili tutti i giorni, festivi inclusi" },
  ];

  const tickerItems = isElectrician
    ? ["IMPIANTI ELETTRICI", "DOMOTICA", "MESSA A NORMA", "QUADRI ELETTRICI", "LED", "CERTIFICAZIONI", "H24"]
    : isPlumber
    ? ["RIPARAZIONI", "CALDAIE", "IMPIANTI IDRICI", "SCARICHI", "RISCALDAMENTO", "RISTRUTTURAZIONI", "H24"]
    : ["RIPARAZIONI", "INSTALLAZIONI", "MANUTENZIONE", "EMERGENZE", "PREVENTIVI", "GARANZIA", "H24"];

  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#perche", label: "Garanzie" }, { href: "#prenota", label: "Preventivo" }];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Space Grotesk', sans-serif", background: D, color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500`} style={{ background: `${D}F0`, backdropFilter: "blur(20px)", borderBottom: `1px solid ${A}15` }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <HeroIcon className="w-6 h-6" style={{ color: A }} />}
            <div className="min-w-0">
              <span className="font-bold truncate block text-sm">{company.name}</span>
              <span className="text-[8px] tracking-[0.25em] uppercase block font-medium text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>{config.label.toUpperCase()}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-[11px] tracking-[0.15em] uppercase text-white/35" style={{ fontFamily: "'Inter', sans-serif" }}>
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className="text-white rounded-lg font-semibold hidden sm:flex" style={{ background: A, color: D }} asChild>
              <a href="#prenota">Preventivo</a>
            </Button>
            <button className="md:hidden p-2" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: D, borderTop: `1px solid ${A}10` }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/40 border-b border-white/5" style={{ fontFamily: "'Inter', sans-serif" }}>{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[100svh] flex items-center pt-16 px-4 overflow-hidden">
        {heroVideo ? (
          <HeroVideoBackground primarySrc={heroVideo} fallbackSrc={fallbackHeroVideo} className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.4) saturate(1.1)" }} />
        ) : (
          <HeroPhotoCarousel images={heroPhotos} className="absolute inset-0 w-full h-full" style={{ filter: "brightness(0.4) saturate(1.1)" }} overlay={false} />
        )}
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${D}CC 0%, ${D}88 50%, transparent 100%)` }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{ backgroundImage: `linear-gradient(${A}20 1px, transparent 1px), linear-gradient(90deg, ${A}20 1px, transparent 1px)`, backgroundSize: "50px 50px" }} />

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium mb-8" style={{ background: `${A}15`, border: `1px solid ${A}25`, color: A }}>
            <HeroIcon className="w-4 h-4" /> {config.label}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.05]">
            {company.tagline || `${config.label}: Qualità e Affidabilità`}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-base text-white/40 mb-10 max-w-2xl mx-auto" style={{ fontFamily: "'Inter', sans-serif" }}>
            <strong className="text-white/70">{company.name}</strong> — Interventi professionali, preventivi gratuiti e garanzia su ogni lavoro.
            {company.city && ` Operiamo a ${company.city} e dintorni.`}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="font-bold rounded-lg px-10 h-14 text-base shadow-2xl" style={{ background: A, color: D, boxShadow: `0 20px 60px -15px ${A}44` }} asChild>
              <a href="#prenota"><FileText className="w-5 h-5 mr-2" /> Preventivo Gratuito</a>
            </Button>
            {company.phone && (
              <Button size="lg" variant="outline" className="rounded-lg px-8 h-14 border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Emergenza? Chiama</a>
              </Button>
            )}
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-white/30" style={{ fontFamily: "'Inter', sans-serif" }}>
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4" style={{ color: A }} /> Lavoro Garantito</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" style={{ color: A }} /> Pronto Intervento</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4" style={{ color: A }} /> Preventivo Gratuito</span>
          </motion.div>
        </motion.div>
        <ScrollIndicator />
      </section>

      {afterHero}

      {/* TICKER */}
      <div className="overflow-hidden py-4 relative" style={{ background: `${A}08` }}>
        <MarqueeCarousel speed={25} pauseOnHover items={
          tickerItems.map((item, i) => (
            <span key={i} className="flex items-center gap-4 text-sm font-bold tracking-[0.2em] mx-8 whitespace-nowrap" style={{ color: `${A}20` }}>
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: `${A}30` }} /> {item}
            </span>
          ))
        } />
      </div>

      <NeonDivider color={A} />

      {/* SERVICES */}
      <section id="servizi" className="py-20 px-4" style={{ background: `${A}04` }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">I Nostri Servizi</h2>
            <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Soluzioni professionali per ogni esigenza</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-0 h-full hover:scale-[1.02] transition-all group rounded-xl overflow-hidden" style={{ background: `${A}08`, border: `1px solid ${A}12` }}>
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-4">{s.emoji}</div>
                    <h3 className="font-bold text-white mb-1">{s.name}</h3>
                    <p className="text-sm text-white/35" style={{ fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* WHY US */}
      <section id="perche" className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Le Nostre Garanzie</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="border-0 h-full hover:scale-[1.02] transition-all rounded-xl" style={{ background: `${A}06`, border: `1px solid ${A}10` }}>
                  <CardContent className="p-5">
                    <div className="w-11 h-11 rounded-lg flex items-center justify-center mb-3" style={{ background: `${A}12` }}>
                      <item.icon className="w-5 h-5" style={{ color: A }} />
                    </div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/35" style={{ fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="py-20 px-4" style={{ background: `${A}04` }}>
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Domande Frequenti</h2>
            <PremiumFAQ items={faqs.map((f: any) => ({ q: f.question, a: f.answer }))} accentColor={A} />
          </div>
        </section>
      )}

      {/* QUOTE FORM */}
      <section id="prenota" className="py-20 px-4 relative">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: `linear-gradient(${A}20 1px, transparent 1px), linear-gradient(90deg, ${A}20 1px, transparent 1px)`, backgroundSize: "40px 40px" }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Preventivo Gratuito</h2>
            <p className="text-white/30 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>Descrivi il problema e ti rispondiamo in meno di 1 ora</p>
          </div>
          <Card className="border-0 rounded-xl backdrop-blur-xl" style={{ background: `${A}06`, border: `1px solid ${A}15` }}>
            <CardContent className="p-6 space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg" placeholder="Nome" /></div>
                <div><Label className="text-white/40 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Tipo Intervento *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg"><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                  <SelectContent>{interventionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label className="text-white/40 text-xs">Urgenza</Label>
                <Select value={form.urgency} onValueChange={v => setForm(p => ({ ...p, urgency: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Bassa</SelectItem>
                    <SelectItem value="normal">🟡 Normale</SelectItem>
                    <SelectItem value="high">🔴 Urgente</SelectItem>
                    <SelectItem value="emergency">🚨 Emergenza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-white/40 text-xs">Indirizzo</Label><Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 rounded-lg" placeholder="Via, civico, città..." /></div>
              <div><Label className="text-white/40 text-xs">Descrivi il problema</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[100px] rounded-lg" placeholder="Dettagli..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-13 text-base font-bold rounded-lg shadow-2xl" style={{ background: A, color: D, boxShadow: `0 15px 40px -10px ${A}44` }}>
                {submitting ? "Invio..." : "Invia Richiesta"} <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/20 text-center">Preventivo gratuito. Rispondiamo in meno di 1 ora.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <AIAgentsShowcase sector="trades" />
      <SectorValueProposition sectorKey={industry === "electrician" || industry === "plumber" ? "trades" : (industry as string)} accentColor={A} darkMode={true} sectorLabel={config.label} />
      <AutomationShowcase accentColor={A} accentBg={`bg-[${A}]`} sectorName={config.label.toLowerCase()} darkMode={true} />

      <footer className="py-10 px-4 border-t" style={{ borderColor: `${A}08` }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Inter', sans-serif" }}>
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <HeroIcon className="w-5 h-5" style={{ color: A }} />}
            <span className="font-semibold text-white/70 text-sm">{company.name}</span>
          </div>
          <div className="flex gap-4 text-xs text-white/25">
            {company.phone && <a href={`tel:${company.phone}`}><Phone className="w-3 h-3 inline mr-1" />{company.phone}</a>}
            {company.email && <a href={`mailto:${company.email}`}><Mail className="w-3 h-3 inline mr-1" />{company.email}</a>}
            {company.address && <span><MapPin className="w-3 h-3 inline mr-1" />{company.address}</span>}
          </div>
          <p className="text-[10px] text-white/10">Powered by Empire Platform</p>
        </div>
      </footer>
    </div>
  );
}
