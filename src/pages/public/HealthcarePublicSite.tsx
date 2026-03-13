import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar, ArrowRight,
  Shield, Heart, CheckCircle, Send, Stethoscope, Users,
  Award, Video, FileText, MessageCircle, Activity, ChevronDown, Quote
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function Section({ id, children, className = "", style }: { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={className} style={style}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>
    </section>
  );
}

interface Props { company: any; }

const HERO_IMG = "https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=1920";
const GALLERY = [
  "https://images.pexels.com/photos/4225880/pexels-photo-4225880.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4386464/pexels-photo-4386464.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/5215024/pexels-photo-5215024.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4225920/pexels-photo-4225920.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function HealthcarePublicSite({ company }: Props) {
  const teal = "#00B4A0";
  const blue = "#0D3159";
  const companyId = company.id;

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

  const name = company.name || "Studio Medico";
  const tagline = company.tagline || "La tua salute, la nostra missione";
  const phone = company.phone;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const services = [
    { icon: Stethoscope, title: "Visite Specialistiche", desc: "Cardiologia, dermatologia, ortopedia e oltre", img: GALLERY[0] },
    { icon: Activity, title: "Diagnostica Avanzata", desc: "Ecografie, ECG, analisi del sangue complete", img: GALLERY[1] },
    { icon: Video, title: "Teleconsulto", desc: "Visite online sicure, comodamente da casa", img: GALLERY[2] },
    { icon: FileText, title: "Referti Online", desc: "Accesso immediato ai tuoi referti con link protetto", img: GALLERY[3] },
    { icon: Heart, title: "Prevenzione", desc: "Check-up completi e programmi personalizzati" },
    { icon: Users, title: "Medicina di Famiglia", desc: "Assistenza continuativa per tutta la famiglia" },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Nunito', sans-serif", background: "#FAFBFC", color: "#1a1a2e" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/92 backdrop-blur-xl shadow-sm">
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <span className="text-lg font-bold" style={{ color: blue }}>{name}</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {["Servizi", "Chi Siamo", "Prenota", "Contatti"].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase().replace(" ", "-"))} className="text-xs tracking-widest uppercase font-medium transition-colors" style={{ color: "#888" }}>{item}</button>
            ))}
          </div>
          {phone && <a href={`tel:${phone}`} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: teal }}><Phone className="w-4 h-4" /> Chiama</a>}
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative pt-16 pb-20 sm:pt-24 sm:pb-32 overflow-hidden" style={{ background: `linear-gradient(135deg, ${blue} 0%, #0D3159 100%)` }}>
        <div className="max-w-6xl mx-auto px-5 grid md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} style={{ y: heroY }}>
            <div className="flex gap-2 mb-5 flex-wrap">
              {["Specialista", "Convenzione SSN", "Teleconsulto"].map(b => (
                <span key={b} className="text-[10px] px-3 py-1 rounded-full font-semibold uppercase tracking-wider" style={{ background: `${teal}25`, color: "#fff", border: `1px solid ${teal}40` }}>{b}</span>
              ))}
            </div>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-5">{tagline}</h1>
            <p className="text-base text-white/60 mb-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>Professionalità, tecnologia e cura del paziente al centro di ogni visita.</p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Button className="px-8 py-5 text-base font-semibold text-white" style={{ background: teal }} onClick={() => scrollTo("prenota")}>Prenota Visita <ArrowRight className="w-4 h-4 ml-2" /></Button>
              {phone && <Button variant="outline" className="px-8 py-5 text-base text-white" style={{ borderColor: "#fff3" }} asChild><a href={`tel:${phone}`}>Chiama Ora</a></Button>}
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }}>
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src={HERO_IMG} alt="Studio medico" className="w-full h-64 sm:h-96 object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVICES */}
      <Section id="servizi" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-12">
            <p className="text-[10px] uppercase tracking-[0.25em] font-bold mb-2" style={{ color: teal }}>I NOSTRI SERVIZI</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: blue }}>Assistenza Medica Completa</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group">
                <Card className="overflow-hidden h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
                  {s.img && (
                    <div className="h-40 overflow-hidden">
                      <img src={s.img} alt={s.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" loading="lazy" />
                    </div>
                  )}
                  <CardContent className="p-5">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${teal}12` }}>
                      <s.icon className="w-5 h-5" style={{ color: teal }} />
                    </div>
                    <h3 className="text-base font-bold mb-1" style={{ color: blue }}>{s.title}</h3>
                    <p className="text-sm opacity-60" style={{ fontFamily: "'Open Sans', sans-serif" }}>{s.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* WHY US */}
      <Section id="chi-siamo" className="py-16 sm:py-24" style={{ background: `${teal}06` }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-10" style={{ color: blue }}>Perché Sceglierci</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Shield, title: "GDPR Compliant", desc: "Dati protetti e cifrati" },
              { icon: Award, title: "20+ Anni", desc: "Team esperto e certificato" },
              { icon: Clock, title: "Orari Flessibili", desc: "Anche sabato e sera" },
              { icon: CheckCircle, title: "Referto in 24h", desc: "Risultati rapidi e precisi" },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }} className="text-center p-5 rounded-2xl bg-white shadow-sm">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${blue}10` }}>
                  <item.icon className="w-7 h-7" style={{ color: blue }} />
                </div>
                <h3 className="font-bold text-sm mb-1" style={{ color: blue }}>{item.title}</h3>
                <p className="text-xs opacity-60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="prenota" className="py-16 sm:py-24">
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-8">
            <Calendar className="w-7 h-7 mx-auto mb-3" style={{ color: teal }} />
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: blue }}>Prenota la Tua Visita</h2>
          </div>
          <Card className="p-6 shadow-lg border-0">
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: teal }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mario Rossi" /></div>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: teal }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." /></div>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: teal }}>Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="text-xs font-bold uppercase mb-1 block" style={{ color: teal }}>Specializzazione</label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Es: Cardiologia" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-bold uppercase mb-1 block" style={{ color: teal }}>Data e Ora *</label><Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="text-xs font-bold uppercase mb-1 block" style={{ color: teal }}>Motivo Visita</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Descrivi..." /></div>
              <div className="sm:col-span-2 flex items-start gap-2">
                <input type="checkbox" checked={form.gdpr} onChange={e => setForm({ ...form, gdpr: e.target.checked })} className="mt-1" />
                <span className="text-xs opacity-60">Acconsento al trattamento dei dati personali ai sensi del GDPR.</span>
              </div>
            </div>
            <Button onClick={handleBooking} disabled={submitting || !form.gdpr} className="w-full mt-5 py-5 text-base font-semibold text-white" style={{ background: teal }}>
              {submitting ? "Invio..." : "Conferma Prenotazione"} <Send className="w-4 h-4 ml-2" />
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section className="py-16" style={{ background: "#f5f7fa" }}>
          <div className="max-w-2xl mx-auto px-5">
            <h2 className="text-2xl font-bold text-center mb-8" style={{ color: blue }}>Domande Frequenti</h2>
            <div className="space-y-3">
              {faqs.map((f: any) => (
                <details key={f.id} className="group bg-white rounded-xl p-4 shadow-sm">
                  <summary className="font-bold text-sm cursor-pointer list-none flex justify-between" style={{ color: blue }}>
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
      <Section id="contatti" className="py-16 text-white text-center" style={{ background: blue }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl font-bold mb-8">Contattaci</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-8">
            {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-5 h-5" style={{ color: teal }} /><p className="text-sm text-white/70">{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
            {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-5 h-5" style={{ color: teal }} /><a href={`tel:${phone}`} className="text-sm text-white/70">{phone}</a></div>}
            {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-5 h-5" style={{ color: teal }} /><a href={`mailto:${company.email}`} className="text-sm text-white/70">{company.email}</a></div>}
          </div>
          <p className="text-[10px] opacity-30">© {new Date().getFullYear()} {name}. Tutti i diritti riservati. | Powered by Empire.AI</p>
        </div>
      </Section>

      {phone && (
        <a href={`https://wa.me/${phone.replace(/\D/g, "")}`} target="_blank" rel="noopener" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
