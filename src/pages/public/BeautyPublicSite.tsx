import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Scissors, Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Sparkles, CheckCircle, Send, ChevronDown, Instagram,
  Users, Award, Quote, ArrowRight, MessageCircle
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
      <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>
        {children}
      </motion.div>
    </section>
  );
}

interface Props { company: any; }

const HERO_IMG = "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=1920";
const GALLERY = [
  "https://images.pexels.com/photos/3997391/pexels-photo-3997391.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3738355/pexels-photo-3738355.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3757952/pexels-photo-3757952.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3985329/pexels-photo-3985329.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3992874/pexels-photo-3992874.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5069432/pexels-photo-5069432.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function BeautyPublicSite({ company }: Props) {
  const companyId = company.id;
  const pink = "#D4618C";
  const dark = "#0f0812";
  const [form, setForm] = useState({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroY = useTransform(scrollYProgress, [0, 1], [0, 120]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  const { data: faqs = [] } = useQuery({
    queryKey: ["beauty-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { toast.error("Inserisci nome e telefono"); return; }
    setSubmitting(true);
    await supabase.from("appointments").insert({
      company_id: companyId, client_name: form.name, client_phone: form.phone,
      scheduled_at: form.date && form.time ? `${form.date}T${form.time}:00` : new Date(Date.now() + 86400000).toISOString(),
      service_name: form.service || null, notes: form.notes || null,
    });
    setSubmitting(false);
    toast.success("Appuntamento richiesto! Ti confermeremo a breve.");
    setForm({ name: "", phone: "", service: "", date: "", time: "", notes: "" });
  };

  const phone = company.phone;
  const socialLinks = company.social_links as Record<string, string> | null;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const services = [
    { name: "Taglio & Styling", icon: "✂️", desc: "Consulenza personalizzata e styling su misura", img: GALLERY[0] },
    { name: "Colorazione", icon: "🎨", desc: "Balayage, meches, toni naturali e vibranti", img: GALLERY[1] },
    { name: "Trattamenti Viso", icon: "✨", desc: "Pulizia profonda, peeling e anti-age", img: GALLERY[2] },
    { name: "Manicure & Pedicure", icon: "💅", desc: "Gel, semipermanente e nail art", img: GALLERY[3] },
    { name: "Massaggi & SPA", icon: "💆", desc: "Rilassanti, decontratturanti, hot stone", img: GALLERY[4] },
    { name: "Depilazione Laser", icon: "🌸", desc: "Tecnologia avanzata, risultati duraturi", img: GALLERY[5] },
  ];

  const testimonials = [
    { name: "Giulia R.", text: "Ambiente raffinato e professionalità incredibile. Non cambierei mai!", rating: 5 },
    { name: "Sara M.", text: "Il balayage più bello che abbia mai fatto. Risultato naturale e luminoso.", rating: 5 },
    { name: "Valentina P.", text: "Massaggio rilassante fantastico, mi sono sentita in un'altra dimensione.", rating: 5 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: dark, color: "#fff", fontFamily: "'Playfair Display', serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-2xl border-b" style={{ background: "rgba(15,8,18,0.88)", borderColor: "rgba(212,97,140,0.1)" }}>
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <Sparkles className="w-6 h-6" style={{ color: pink }} />}
            <span className="font-semibold text-sm tracking-wide hidden sm:block">{company.name}</span>
          </button>
          <div className="hidden md:flex gap-8 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "'Inter', sans-serif", color: "rgba(255,255,255,0.5)" }}>
            {["Servizi", "Gallery", "Recensioni", "Prenota"].map(l => (
              <button key={l} onClick={() => scrollTo(l.toLowerCase())} className="hover:text-white transition-colors">{l}</button>
            ))}
          </div>
          <Button size="sm" className="rounded-xl text-xs font-semibold text-white" style={{ background: pink }} onClick={() => scrollTo("prenota")}>
            Prenota Ora
          </Button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section id="hero" ref={heroRef} className="relative min-h-[100vh] flex items-center">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${dark}99 0%, ${dark}CC 50%, ${dark} 100%)` }} />
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `radial-gradient(circle, ${pink}80 1px, transparent 1px)`, backgroundSize: "50px 50px",
        }} />

        <motion.div className="relative z-10 max-w-3xl mx-auto px-5 text-center pt-20" style={{ y: heroY, opacity: heroOpacity }}>
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-8 text-sm font-medium" style={{ background: `${pink}15`, border: `1px solid ${pink}30`, color: pink, fontFamily: "'Inter', sans-serif" }}>
              <Sparkles className="w-4 h-4" /> Beauty & Wellness Premium
            </motion.div>
            <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-6xl lg:text-7xl font-bold leading-[1.05] mb-6">
              <span style={{ background: `linear-gradient(135deg, #fff, #f5d5e0, #e8a5c0)`, WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>
                {company.tagline || "La tua bellezza, la nostra arte"}
              </span>
            </motion.h1>
            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg mb-10 max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>
              Scopri <strong style={{ color: "rgba(255,255,255,0.8)" }}>{company.name}</strong>. Trattamenti esclusivi, prodotti premium e uno staff dedicato alla tua bellezza.
            </motion.p>
            <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="rounded-xl px-10 h-14 text-base font-semibold text-white shadow-2xl" style={{ background: pink, boxShadow: `0 20px 60px -15px ${pink}55`, fontFamily: "'Inter', sans-serif" }} onClick={() => scrollTo("prenota")}>
                <Calendar className="w-5 h-5 mr-2" /> Prenota Appuntamento
              </Button>
              {phone && (
                <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-white hover:bg-white/5" style={{ borderColor: "rgba(255,255,255,0.1)", fontFamily: "'Inter', sans-serif" }} asChild>
                  <a href={`tel:${phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama</a>
                </Button>
              )}
            </motion.div>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <Section id="servizi" className="py-16 sm:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: pink, fontFamily: "'Inter', sans-serif" }}>I Nostri Servizi</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Trattamenti Esclusivi</h2>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group relative rounded-2xl overflow-hidden cursor-pointer" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="relative h-48 overflow-hidden">
                  <img src={s.img} alt={s.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0f0812] via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 text-2xl">{s.icon}</span>
                </div>
                <div className="p-5">
                  <h3 className="font-semibold text-base mb-1">{s.name}</h3>
                  <p className="text-sm" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>{s.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ═══ GALLERY ═══ */}
      <Section id="gallery" className="py-16 sm:py-24 px-4" >
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: pink, fontFamily: "'Inter', sans-serif" }}>Il Nostro Spazio</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Gallery</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-square group"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ WHY US ═══ */}
      <Section className="py-16 sm:py-24 px-4" >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: pink, fontFamily: "'Inter', sans-serif" }}>Perché Noi</p>
            <h2 className="text-3xl sm:text-4xl font-bold">La Differenza</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Award, title: "Professionisti Certificati", desc: "Team con anni di esperienza e formazione continua" },
              { icon: Sparkles, title: "Prodotti Premium", desc: "Solo brand di alta qualità e cruelty-free" },
              { icon: Heart, title: "Cura Personalizzata", desc: "Ogni trattamento studiato per te" },
              { icon: Calendar, title: "Prenotazione Facile", desc: "Online in pochi click, conferma immediata" },
              { icon: Clock, title: "Orari Flessibili", desc: "Aperti 6 giorni su 7, anche pausa pranzo" },
              { icon: CheckCircle, title: "Soddisfazione Garantita", desc: "Non sei soddisfatta? Ti rifacciamo il trattamento" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="p-5 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${pink}15` }}>
                  <item.icon className="w-5 h-5" style={{ color: pink }} />
                </div>
                <h3 className="font-semibold text-sm mb-1">{item.title}</h3>
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ TESTIMONIALS ═══ */}
      <Section id="recensioni" className="py-16 sm:py-24 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: pink, fontFamily: "'Inter', sans-serif" }}>Recensioni</p>
            <h2 className="text-3xl sm:text-4xl font-bold">Cosa Dicono di Noi</h2>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            {testimonials.map((t, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}
                className="p-6 rounded-2xl" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <Quote className="w-6 h-6 mb-3" style={{ color: `${pink}40` }} />
                <div className="flex gap-0.5 mb-3">{Array.from({ length: 5 }).map((_, s) => <Star key={s} className="w-3.5 h-3.5" fill={s < t.rating ? pink : "transparent"} stroke={s < t.rating ? pink : "rgba(255,255,255,0.2)"} />)}</div>
                <p className="text-sm mb-4 leading-relaxed" style={{ color: "rgba(255,255,255,0.5)", fontFamily: "'Inter', sans-serif" }}>"{t.text}"</p>
                <p className="text-sm font-semibold">— {t.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══ FAQ ═══ */}
      {faqs.length > 0 && (
        <Section className="py-16 px-4">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-center mb-8">Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <details key={faq.id} className="group rounded-xl p-4" style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}>
                  <summary className="font-semibold text-sm cursor-pointer list-none flex justify-between items-center" style={{ fontFamily: "'Inter', sans-serif" }}>
                    {faq.question} <ChevronDown className="w-4 h-4 text-white/30 group-open:rotate-180 transition-transform" />
                  </summary>
                  <p className="text-sm mt-3 leading-relaxed" style={{ color: "rgba(255,255,255,0.4)", fontFamily: "'Inter', sans-serif" }}>{faq.answer}</p>
                </details>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══ BOOKING FORM ═══ */}
      <Section id="prenota" className="py-16 sm:py-24 px-4 relative">
        <div className="absolute inset-0 bg-gradient-to-t opacity-30 pointer-events-none" style={{ background: `linear-gradient(to top, ${pink}10, transparent)` }} />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <p className="text-[11px] uppercase tracking-[0.3em] font-medium mb-3" style={{ color: pink, fontFamily: "'Inter', sans-serif" }}>Appuntamento</p>
            <h2 className="text-3xl font-bold">Prenota il tuo Trattamento</h2>
          </div>
          <div className="rounded-2xl p-6 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.03)", border: `1px solid ${pink}20` }}>
            <div className="space-y-4" style={{ fontFamily: "'Inter', sans-serif" }}>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Nome *</Label><Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Il tuo nome" /></div>
                <div><Label className="text-white/40 text-xs">Telefono *</Label><Input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="+39..." /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Servizio desiderato</Label><Input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Es: Taglio e piega, colore..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-white/40 text-xs">Data</Label><Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" /></div>
                <div><Label className="text-white/40 text-xs">Orario</Label><Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" /></div>
              </div>
              <div><Label className="text-white/40 text-xs">Note</Label><Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[70px]" placeholder="Richieste..." /></div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-12 text-base font-semibold rounded-xl text-white shadow-2xl" style={{ background: pink, boxShadow: `0 15px 40px -10px ${pink}55` }}>
                {submitting ? "Invio..." : "Richiedi Appuntamento"} <Send className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══ CONTACT INFO ═══ */}
      <Section className="py-12 px-4">
        <div className="max-w-3xl mx-auto grid sm:grid-cols-3 gap-6 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
          {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-5 h-5" style={{ color: pink }} /><p className="text-sm text-white/50">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
          {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-5 h-5" style={{ color: pink }} /><a href={`tel:${phone}`} className="text-sm text-white/50 hover:text-white">{phone}</a></div>}
          {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-5 h-5" style={{ color: pink }} /><a href={`mailto:${company.email}`} className="text-sm text-white/50 hover:text-white">{company.email}</a></div>}
        </div>
      </Section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-8 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <Sparkles className="w-5 h-5" style={{ color: pink }} />}
            <span className="font-semibold text-white/80 text-sm">{company.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {socialLinks?.instagram && <a href={socialLinks.instagram} target="_blank" rel="noopener" className="text-white/30 hover:text-white/70"><Instagram className="w-5 h-5" /></a>}
          </div>
          <p className="text-[10px] text-white/15">Powered by Empire.AI</p>
        </div>
      </footer>

      {/* WhatsApp */}
      {phone && (
        <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
