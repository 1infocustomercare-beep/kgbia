import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
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
  Umbrella, Star, Phone, Mail, MapPin, Clock, Calendar,
  Sun, Waves, CheckCircle, Send, ChevronDown,
  Users, CreditCard, Coffee, MessageCircle, Quote
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={className}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
    </section>
  );
}

interface Props { company: any; }

const HERO_IMG = "https://images.pexels.com/photos/1174732/pexels-photo-1174732.jpeg?auto=compress&cs=tinysrgb&w=1920";
const GALLERY = [
  "https://images.pexels.com/photos/1032650/pexels-photo-1032650.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1449791/pexels-photo-1449791.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1021073/pexels-photo-1021073.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3155666/pexels-photo-3155666.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/237272/pexels-photo-237272.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1456291/pexels-photo-1456291.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function BeachPublicSite({ company }: Props) {
  const companyId = company.id;
  const cyan = "#00BCD4";
  const dark = "#071018";
  const phone = company.phone;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);

  const [form, setForm] = useState({ name: "", phone: "", date: "", period: "full_day", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: spots = [] } = useQuery({
    queryKey: ["beach-pub-spots", companyId],
    queryFn: async () => { const { data } = await supabase.from("beach_spots").select("*").eq("company_id", companyId).eq("is_active", true); return data || []; },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["beach-pub-faq", companyId],
    queryFn: async () => { const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order"); return data || []; },
  });

  const totalSpots = spots.length;
  const rows = new Set(spots.map((s: any) => s.row_letter)).size;
  const minPrice = spots.length > 0 ? Math.min(...spots.filter((s: any) => s.price_daily > 0).map((s: any) => s.price_daily)) : 0;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date) { toast.error("Compila nome, telefono e data"); return; }
    setSubmitting(true);
    await supabase.from("beach_bookings").insert({ company_id: companyId, client_name: form.name, client_phone: form.phone, booking_date: form.date, period: form.period });
    setSubmitting(false);
    toast.success("Prenotazione inviata!");
    setForm({ name: "", phone: "", date: "", period: "full_day", notes: "" });
  };

  const services = [
    { emoji: "🏖️", name: "Ombrelloni Premium", desc: "Prima fila fronte mare con lettini luxury", img: GALLERY[0] },
    { emoji: "🍹", name: "Bar & Ristorante", desc: "Servizio al posto con cucina mediterranea", img: GALLERY[1] },
    { emoji: "🏊", name: "Area Piscina", desc: "Piscina con acqua di mare riscaldata", img: GALLERY[2] },
    { emoji: "👶", name: "Area Bambini", desc: "Parco giochi e animazione", img: GALLERY[3] },
    { emoji: "🚿", name: "Docce & Spogliatoi", desc: "Spogliatoi con docce calde gratuite", img: GALLERY[4] },
    { emoji: "📶", name: "WiFi Gratuito", desc: "Connessione veloce in tutta la spiaggia", img: GALLERY[5] },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: dark, color: "#fff" }}>
      {/* NAVBAR */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b" style={{ background: `${dark}DD`, borderColor: `${cyan}12` }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <Umbrella className="w-6 h-6" style={{ color: cyan }} />}
            <span className="font-bold text-sm truncate">{company.name}</span>
          </button>
          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase text-white/40">
            {["Servizi", "Gallery", "Prenota"].map(l => <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="hover:text-white transition">{l}</button>)}
          </div>
          <Button size="sm" className="rounded-xl text-xs font-semibold text-white" style={{ background: cyan }} onClick={() => scrollTo("prenota")}>Prenota Posto</Button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative min-h-[100vh] flex items-center">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${dark}88 0%, ${dark}CC 60%, ${dark} 100%)` }} />

        <motion.div className="relative z-10 max-w-3xl mx-auto px-5 text-center pt-20" style={{ y: heroY }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-8" style={{ background: `${cyan}12`, border: `1px solid ${cyan}25`, color: cyan }}>
              <Waves className="w-4 h-4" /> Stabilimento Balneare Premium
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-5 leading-[1.05]">
              <span style={{ background: `linear-gradient(135deg, #fff, #b2ebf2, #80deea)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {company.tagline || "Il tuo angolo di paradiso"}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base text-white/45 mb-8 max-w-xl mx-auto">
              Benvenuto a <strong className="text-white/75">{company.name}</strong>. Spiaggia privata, servizio premium e relax totale.
            </motion.p>
            <motion.div variants={fadeUp} custom={3}>
              <Button size="lg" className="rounded-xl px-10 h-14 text-base font-bold text-white shadow-2xl" style={{ background: cyan, boxShadow: `0 20px 60px -15px ${cyan}55` }} onClick={() => scrollTo("prenota")}>
                <Umbrella className="w-5 h-5 mr-2" /> Prenota Ombrellone
              </Button>
            </motion.div>
            {totalSpots > 0 && (
              <motion.div variants={fadeUp} custom={4} className="grid grid-cols-3 gap-4 mt-10 max-w-sm mx-auto">
                <div className="text-center"><p className="text-2xl font-bold" style={{ color: cyan }}>{totalSpots}</p><p className="text-[10px] text-white/25">Postazioni</p></div>
                <div className="text-center"><p className="text-2xl font-bold" style={{ color: cyan }}>{rows}</p><p className="text-[10px] text-white/25">File</p></div>
                <div className="text-center"><p className="text-2xl font-bold" style={{ color: cyan }}>€{minPrice || "—"}</p><p className="text-[10px] text-white/25">Da / giorno</p></div>
              </motion.div>
            )}
          </motion.div>
        </motion.div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </section>

      {/* SERVICES */}
      <Section id="servizi" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: cyan }}>I Nostri Servizi</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Tutto per la Giornata Perfetta</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group relative rounded-2xl overflow-hidden" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="h-40 overflow-hidden">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#071018] via-transparent to-transparent" />
                </div>
                <div className="p-5">
                  <span className="text-2xl mb-2 block">{s.emoji}</span>
                  <h3 className="font-bold text-sm mb-1">{s.name}</h3>
                  <p className="text-xs text-white/35">{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section id="gallery" className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">La Nostra Spiaggia</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-[4/3] group"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.07, duration: 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* WHY US */}
      <Section className="py-16 px-4">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-10">Perché Scegliere Noi</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Sun, title: "Posizione Privilegiata", desc: "Sabbia fine e acqua cristallina" },
              { icon: Umbrella, title: "Comfort Premium", desc: "Lettini di alta qualità, distanziati" },
              { icon: Coffee, title: "Servizio al Posto", desc: "Ordina cibo e bevande dall'ombrellone" },
              { icon: CreditCard, title: "Abbonamenti", desc: "Tariffe agevolate settimanali e mensili" },
              { icon: Calendar, title: "Prenota Online", desc: "Scegli il posto in pochi click" },
              { icon: CheckCircle, title: "Posto Garantito", desc: "Il tuo ombrellone ti aspetta ogni mattina" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${cyan}12` }}>
                  <item.icon className="w-5 h-5" style={{ color: cyan }} />
                </div>
                <h3 className="font-bold text-sm mb-1">{item.title}</h3>
                <p className="text-xs text-white/35">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <details key={faq.id} className="group rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between">
                    {faq.question} <ChevronDown className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-sm mt-3 text-white/40">{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* BOOKING */}
      <Section id="prenota" className="py-16 sm:py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t opacity-20 pointer-events-none" style={{ background: `linear-gradient(to top, ${cyan}10, transparent)` }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: cyan }}>Prenotazione</p>
            <h2 className="text-3xl font-bold">Prenota il tuo Posto</h2>
          </div>
          <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${cyan}18` }}>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Il tuo nome" /></div>
                <div><Label className="text-white/40 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Data *</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" /></div>
              <div><Label className="text-white/40 text-xs">Periodo</Label>
                <Select value={form.period} onValueChange={v => setForm(p => ({ ...p, period: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">☀️ Mattina (08-13)</SelectItem>
                    <SelectItem value="afternoon">🌅 Pomeriggio (13-19)</SelectItem>
                    <SelectItem value="full_day">🏖️ Giornata Intera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div><Label className="text-white/40 text-xs">Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[70px]" placeholder="Prima fila, lettino extra..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-bold rounded-xl text-white shadow-2xl" style={{ background: cyan, boxShadow: `0 15px 40px -10px ${cyan}55` }}>
                {submitting ? "Invio..." : "Prenota Posto"} <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <Umbrella className="w-5 h-5" style={{ color: cyan }} />}
            <span className="font-semibold text-white/70 text-sm">{company.name}</span>
          </div>
          <div className="flex gap-4 text-xs text-white/25">
            {phone && <a href={`tel:${phone}`}><Phone className="w-3 h-3 inline mr-1" />{phone}</a>}
            {company.email && <a href={`mailto:${company.email}`}><Mail className="w-3 h-3 inline mr-1" />{company.email}</a>}
          </div>
          <p className="text-[10px] text-white/10">Powered by Empire.AI</p>
        </div>
      </footer>

      {phone && (
        <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
