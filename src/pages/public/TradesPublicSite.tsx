import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import { motion, useInView, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
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
import fallbackHeroVideo from "@/assets/video-industries.mp4";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Props { company: any; }

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

const HERO_VIDEOS: Record<string, string> = {
  electrician: "https://videos.pexels.com/video-files/5532771/5532771-uhd_2560_1440_25fps.mp4",
  plumber: "https://videos.pexels.com/video-files/6538938/6538938-uhd_2560_1440_25fps.mp4",
  default: "https://videos.pexels.com/video-files/5532771/5532771-uhd_2560_1440_25fps.mp4",
};
export default function TradesPublicSite({ company }: Props) {
  const companyId = company.id;
  const industry = (company.industry || "plumber") as IndustryId;
  const config = getIndustryConfig(industry);
  const isElectrician = industry === "electrician";
  const isPlumber = industry === "plumber";
  const accentColor = isElectrician ? "amber" : isPlumber ? "slate" : "orange";
  const accentBg = isElectrician ? "bg-amber-500" : isPlumber ? "bg-slate-600" : "bg-orange-500";
  const accentText = isElectrician ? "text-amber-400" : isPlumber ? "text-blue-400" : "text-orange-400";
  const accentBgLight = isElectrician ? "bg-amber-500/10" : isPlumber ? "bg-blue-500/10" : "bg-orange-500/10";
  const HeroIcon = isElectrician ? Zap : isPlumber ? Droplets : Wrench;
  const heroVideo = HERO_VIDEOS[industry] || HERO_VIDEOS.default;
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => { const fn = () => setNavScrolled(window.scrollY > 40); window.addEventListener("scroll", fn); return () => window.removeEventListener("scroll", fn); }, []);

  const [form, setForm] = useState({ name: "", phone: "", email: "", type: "", urgency: "normal", address: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: faqs = [] } = useQuery({
    queryKey: ["trades-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.type) { toast.error("Compila nome, telefono e tipo intervento"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("interventions").insert({
      company_id: companyId,
      client_name: form.name,
      client_phone: form.phone,
      intervention_type: form.type,
      urgency: form.urgency,
      address: form.address || null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nell'invio"); return; }
    toast.success("Richiesta inviata! Ti contatteremo a breve per il preventivo.");
    setForm({ name: "", phone: "", email: "", type: "", urgency: "normal", address: "", notes: "" });
  };

  const interventionTypes = isElectrician
    ? ["Impianto elettrico nuovo", "Messa a norma", "Corto circuito", "Installazione luci", "Quadro elettrico", "Domotica", "Certificazione", "Altro"]
    : isPlumber
    ? ["Perdita acqua", "Scarico intasato", "Installazione sanitari", "Caldaia", "Riscaldamento", "Impianto idrico", "Emergenza allagamento", "Altro"]
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
    { icon: Shield, title: "Lavoro Garantito", desc: "Garanzia su tutti gli interventi con copertura assicurativa completa" },
    { icon: Clock, title: "Intervento Rapido", desc: "Rispondiamo in meno di 1 ora e interveniamo entro 24h" },
    { icon: FileText, title: "Preventivo Gratuito", desc: "Sopralluogo e preventivo dettagliato senza impegno" },
    { icon: Award, title: "Esperienza Certificata", desc: "Tecnici qualificati con anni di esperienza comprovata" },
    { icon: CheckCircle, title: "Prezzi Trasparenti", desc: "Nessuna sorpresa: il prezzo concordato è il prezzo finale" },
    { icon: AlertTriangle, title: "Emergenze H24", desc: "Disponibili per emergenze tutti i giorni, festivi inclusi" },
  ];

  const tickerItems = isElectrician
    ? ["Impianti Elettrici", "Domotica", "Messa a Norma", "Quadri Elettrici", "Illuminazione LED", "Certificazioni", "Emergenze 24h", "Impianti Fotovoltaici"]
    : isPlumber
    ? ["Riparazioni", "Caldaie", "Impianti Idrici", "Scarichi", "Riscaldamento", "Ristrutturazioni Bagno", "Emergenze Allagamento", "Manutenzione"]
    : ["Riparazioni", "Installazioni", "Manutenzione", "Emergenze", "Preventivi Gratuiti", "Garanzia Lavori", "Interventi Rapidi", "Assistenza H24"];

  const navLinks = [{ href: "#servizi", label: "Servizi" }, { href: "#perche", label: "Garanzie" }, { href: "#prenota", label: "Preventivo" }];

  return (
    <div className="min-h-screen bg-[#0c0c10] text-white overflow-x-hidden">
      {/* ═══ NAVBAR ═══ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`} style={{ background: "rgba(12,12,16,0.95)", backdropFilter: "blur(20px)", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <motion.img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" whileHover={{ scale: 1.1 }} /> : <HeroIcon className={`w-6 h-6 ${accentText}`} />}
            <div className="min-w-0">
              <span className="font-bold truncate block">{company.name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold text-white/40">{config.label.toUpperCase()}</span>
            </div>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-white/50">
            {navLinks.map(l => <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>)}
          </div>
          <div className="flex items-center gap-3">
            <Button size="sm" className={`${accentBg} hover:opacity-90 text-white rounded-xl font-semibold hidden sm:flex`} asChild>
              <a href="#prenota">Richiedi Preventivo</a>
            </Button>
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden" style={{ background: "#0c0c10", borderTop: "1px solid rgba(255,255,255,0.05)" }}>
              <div className="px-5 py-4 space-y-1">
                {navLinks.map(l => <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 border-b border-white/5">{l.label}</a>)}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══ HERO — video bg + text reveal ═══ */}
      <section className="relative min-h-[100svh] flex items-center pt-16 px-4 overflow-hidden">
        <HeroVideoBackground
          primarySrc={heroVideo}
          fallbackSrc={fallbackHeroVideo}
          className="absolute inset-0 w-full h-full object-cover"
          style={{ filter: "brightness(0.5) saturate(1.06)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#0c0c10]/60 via-[#0c0c10]/45 to-transparent" />
        <div className="absolute inset-0 opacity-[0.07]" style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)", backgroundSize: "50px 50px" }} />

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <motion.div variants={fadeUp} custom={0} className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${accentBgLight} border ${isElectrician ? "border-amber-500/20 text-amber-300" : "border-blue-500/20 text-blue-300"} text-sm font-medium mb-8`}>
            <HeroIcon className="w-4 h-4" /> {config.label}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            {(company.tagline || `${config.label}: Qualità e Affidabilità`).split("").map((char: string, i: number) => (
              <motion.span key={i} initial={{ opacity: 0, y: 30, rotateX: -90 }} animate={{ opacity: 1, y: 0, rotateX: 0 }}
                transition={{ delay: 0.5 + i * 0.03, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block" style={{ color: i % 5 === 0 ? (isElectrician ? "#fbbf24" : isPlumber ? "#60a5fa" : "#fb923c") : "white" }}>
                {char === " " ? "\u00A0" : char}
              </motion.span>
            ))}
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            <strong className="text-white/80">{company.name}</strong> — Interventi professionali, preventivi gratuiti e garanzia su ogni lavoro.
            {company.city && ` Operiamo a ${company.city} e dintorni.`}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className={`${accentBg} hover:opacity-90 text-white font-bold rounded-xl px-10 h-14 text-base shadow-2xl`} asChild>
              <a href="#prenota"><FileText className="w-5 h-5 mr-2" /> Preventivo Gratuito</a>
            </Button>
            {company.phone && (
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Emergenza? Chiama</a>
              </Button>
            )}
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-white/40">
            <span className="flex items-center gap-1.5"><Shield className={`w-4 h-4 ${accentText}`} /> Lavoro Garantito</span>
            <span className="flex items-center gap-1.5"><Clock className={`w-4 h-4 ${accentText}`} /> Pronto Intervento</span>
            <span className="flex items-center gap-1.5"><CheckCircle className={`w-4 h-4 ${accentText}`} /> Preventivo Gratuito</span>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </section>

      {/* ═══ TICKER ═══ */}
      <div className="overflow-hidden py-4" style={{ background: "#111" }}>
        <motion.div className="flex gap-8 whitespace-nowrap" animate={{ x: [0, -1000] }} transition={{ repeat: Infinity, duration: 18, ease: "linear" }}>
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="flex items-center gap-3 text-sm font-bold uppercase text-white/20">
              <HeroIcon className="w-3 h-3" style={{ opacity: 0.5 }} /> {item}
            </span>
          ))}
        </motion.div>
      </div>

      {/* ═══ SERVICES ═══ */}
      <section id="servizi" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">I Nostri Servizi</h2>
            <p className="text-white/40">Soluzioni professionali per ogni esigenza</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:border-white/10 transition-all group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{s.emoji}</div>
                    <h3 className="font-bold text-white mb-1">{s.name}</h3>
                    <p className="text-sm text-white/40">{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section id="perche" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Le Nostre Garanzie</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:bg-white/[0.04] transition-all group">
                  <CardContent className="p-5">
                    <div className={`w-11 h-11 rounded-xl ${accentBgLight} flex items-center justify-center mb-3`}>
                      <item.icon className={`w-5 h-5 ${accentText}`} />
                    </div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/40">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ FAQ ═══ */}
      {faqs.length > 0 && (
        <section className="py-20 px-4 border-t border-white/5">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-10">Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <Card key={faq.id} className="border-white/5 bg-white/[0.02]">
                  <CardContent className="p-5">
                    <h3 className="font-semibold text-white mb-2">{faq.question}</h3>
                    <p className="text-sm text-white/50">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ QUOTE FORM ═══ */}
      <section id="prenota" className="py-20 px-4 border-t border-white/5 relative">
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Richiedi un Preventivo Gratuito</h2>
            <p className="text-white/40">Descrivi il problema e ti rispondiamo in meno di 1 ora</p>
          </div>
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/50 text-xs">Nome *</Label>
                  <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="Il tuo nome" />
                </div>
                <div>
                  <Label className="text-white/50 text-xs">Telefono *</Label>
                  <Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="+39..." />
                </div>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Tipo Intervento *</Label>
                <Select value={form.type} onValueChange={v => setForm(p => ({ ...p, type: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue placeholder="Seleziona tipo" /></SelectTrigger>
                  <SelectContent>
                    {interventionTypes.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Urgenza</Label>
                <Select value={form.urgency} onValueChange={v => setForm(p => ({ ...p, urgency: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">🟢 Bassa — Entro la settimana</SelectItem>
                    <SelectItem value="normal">🟡 Normale — Entro 2-3 giorni</SelectItem>
                    <SelectItem value="high">🔴 Urgente — Entro 24 ore</SelectItem>
                    <SelectItem value="emergency">🚨 Emergenza — Subito</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Indirizzo intervento</Label>
                <Input value={form.address} onChange={e => setForm(p => ({ ...p, address: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="Via, civico, città..." />
              </div>
              <div>
                <Label className="text-white/50 text-xs">Descrivi il problema</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[100px] text-base" placeholder="Descrivi il problema nel dettaglio per un preventivo più accurato..." />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className={`w-full h-13 text-base font-bold rounded-xl ${accentBg} hover:opacity-90 text-white shadow-2xl`}>
                {submitting ? "Invio..." : "Invia Richiesta Preventivo"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/25 text-center">Preventivo gratuito e senza impegno. Ti rispondiamo in meno di 1 ora.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      <SectorValueProposition sectorKey="trades" accentColor={isElectrician ? "#F59E0B" : isPlumber ? "#3B82F6" : "#F97316"} darkMode={true} sectorLabel="Attività" />
      <AutomationShowcase accentColor={isElectrician ? "#F59E0B" : isPlumber ? "#3B82F6" : "#F97316"} accentBg={accentBg} sectorName="artigiani e professionisti" darkMode={true} />

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <HeroIcon className={`w-5 h-5 ${accentText}`} />}
            <span className="font-semibold text-white/80">{company.name}</span>
          </div>
          <div className="flex gap-4 text-xs text-white/30">
            {company.phone && <a href={`tel:${company.phone}`} className="hover:text-white/50"><Phone className="w-3 h-3 inline mr-1" />{company.phone}</a>}
            {company.email && <a href={`mailto:${company.email}`} className="hover:text-white/50"><Mail className="w-3 h-3 inline mr-1" />{company.email}</a>}
            {company.address && <span><MapPin className="w-3 h-3 inline mr-1" />{company.address}</span>}
          </div>
          <p className="text-[10px] text-white/15">Powered by Empire Platform</p>
        </div>
      </footer>
    </div>
  );
}
