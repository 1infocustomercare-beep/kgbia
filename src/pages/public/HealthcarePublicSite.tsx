import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar, ArrowRight,
  Shield, Heart, CheckCircle, Send, Stethoscope, Users,
  Award, Video, FileText, MessageCircle, Activity
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

function Section({ id, children, className = "", style }: { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={className} style={style}>
      <motion.div initial={{ opacity: 0, y: 50 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.8 }}>
        {children}
      </motion.div>
    </section>
  );
}

interface Props { company: any; }

export default function HealthcarePublicSite({ company }: Props) {
  const teal = "#00B4A0";
  const blue = "#1A4A7A";
  const companyId = company.id;

  const { data: faqs = [] } = useQuery({
    queryKey: ["hc-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const { data: contentBlocks = [] } = useQuery({
    queryKey: ["hc-pub-content", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("content_blocks").select("*").eq("company_id", companyId);
      return data || [];
    },
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", specialization: "", date: "", notes: "", gdpr: false });
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.date || !form.gdpr) { toast.error("Compila i campi obbligatori e accetta la privacy"); return; }
    setSubmitting(true);
    try {
      await supabase.from("appointments").insert({
        company_id: companyId, client_name: form.name, client_phone: form.phone,
        scheduled_at: form.date, service_name: form.specialization, notes: form.notes, status: "confirmed"
      });
      toast.success("Visita prenotata! Riceverai conferma a breve.");
      setForm({ name: "", phone: "", email: "", specialization: "", date: "", notes: "", gdpr: false });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const name = company.name || "Studio Medico";
  const tagline = company.tagline || "La tua salute, la nostra missione";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const services = [
    { icon: Stethoscope, title: "Visite Specialistiche", desc: "Cardiologia, dermatologia, ortopedia e altre specializzazioni" },
    { icon: Activity, title: "Diagnostica", desc: "Ecografie, elettrocardiogramma, analisi del sangue" },
    { icon: Video, title: "Teleconsulto", desc: "Visite online da casa in totale sicurezza e privacy" },
    { icon: FileText, title: "Referti Online", desc: "Accesso sicuro ai tuoi referti con link protetto" },
    { icon: Heart, title: "Prevenzione", desc: "Check-up completi e programmi di prevenzione personalizzati" },
    { icon: Users, title: "Medicina di Famiglia", desc: "Assistenza continuativa per tutta la famiglia" },
  ];

  return (
    <div style={{ fontFamily: "'Nunito', sans-serif", background: "#FAFBFC", color: "#1a1a2e" }}>
      <link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&family=Open+Sans:wght@300;400;500;600&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" />}
            <span className="text-lg sm:text-xl font-bold" style={{ color: blue }}>{name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Servizi", "Chi Siamo", "Prenota", "Contatti"].map(item => (
              <a key={item} href={`#${item.toLowerCase().replace(" ", "-")}`} className="text-sm font-medium transition-colors" style={{ color: "#555" }}>{item}</a>
            ))}
          </div>
          {phone && <a href={`tel:${phone}`} className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full text-sm font-semibold text-white" style={{ background: teal }}><Phone className="w-4 h-4" /> Chiama Ora</a>}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative pt-20 pb-24 sm:pt-32 sm:pb-36 overflow-hidden" style={{ background: `linear-gradient(135deg, ${blue} 0%, #0D3159 100%)` }}>
        <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <div className="flex gap-2 mb-6">
              {["Specialista", "Convenzione SSN", "Teleconsulto"].map(b => (
                <Badge key={b} className="text-xs px-3 py-1" style={{ background: `${teal}30`, color: "#fff", border: `1px solid ${teal}50` }}>{b}</Badge>
              ))}
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight mb-6">{tagline}</h1>
            <p className="text-lg text-white/70 mb-8" style={{ fontFamily: "'Open Sans', sans-serif" }}>Professionalità, tecnologia e cura del paziente al centro di ogni visita.</p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a href="#prenota"><Button className="px-8 py-6 text-lg font-semibold" style={{ background: teal, color: "#fff" }}>Prenota Visita</Button></a>
              <a href={`tel:${phone}`}><Button variant="outline" className="px-8 py-6 text-lg" style={{ borderColor: "#fff4", color: "#fff" }}>Chiama Ora</Button></a>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.3, duration: 0.8 }} className="hidden md:block">
            <div className="rounded-2xl overflow-hidden shadow-2xl">
              <img src="https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Studio medico" className="w-full h-96 object-cover" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* SERVIZI */}
      <Section id="servizi" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <Badge className="mb-4" style={{ background: `${teal}15`, color: teal }}>I NOSTRI SERVIZI</Badge>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: blue }}>Assistenza Medica Completa</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="p-6 h-full hover:shadow-lg transition-shadow border-0 shadow-sm">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: `${teal}15` }}>
                    <s.icon className="w-6 h-6" style={{ color: teal }} />
                  </div>
                  <h3 className="text-lg font-bold mb-2" style={{ color: blue }}>{s.title}</h3>
                  <p className="text-sm opacity-60" style={{ fontFamily: "'Open Sans', sans-serif" }}>{s.desc}</p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* PERCHÉ NOI */}
      <Section className="py-20" style={{ background: `${teal}08` } as any}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: blue }}>Perché Sceglierci</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Shield, title: "GDPR Compliant", desc: "Dati protetti e cifrati" },
              { icon: Award, title: "Esperienza", desc: "Team con 20+ anni" },
              { icon: Clock, title: "Orari Flessibili", desc: "Anche sabato e sera" },
              { icon: CheckCircle, title: "Referto Rapido", desc: "Risultati in 24-48h" },
            ].map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center p-6">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4" style={{ background: `${blue}15` }}>
                  <item.icon className="w-8 h-8" style={{ color: blue }} />
                </div>
                <h3 className="font-bold mb-1" style={{ color: blue }}>{item.title}</h3>
                <p className="text-sm opacity-60">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRENOTA */}
      <Section id="prenota" className="py-20 sm:py-28">
        <div className="max-w-2xl mx-auto px-6">
          <div className="text-center mb-10">
            <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: teal }} />
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: blue }}>Prenota la Tua Visita</h2>
          </div>
          <Card className="p-6 sm:p-8 shadow-lg border-0">
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "'Open Sans', sans-serif" }}>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: teal }}>Nome Completo *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Mario Rossi" /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: teal }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+39..." /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: teal }}>Email</label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
              <div><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: teal }}>Specializzazione</label><Input value={form.specialization} onChange={e => setForm({ ...form, specialization: e.target.value })} placeholder="Es: Cardiologia" /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: teal }}>Data e Ora preferita *</label><Input type="datetime-local" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} /></div>
              <div className="sm:col-span-2"><label className="text-xs font-semibold uppercase mb-1 block" style={{ color: teal }}>Motivo Visita</label><Textarea value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} rows={3} placeholder="Descrivi brevemente..." /></div>
              <div className="sm:col-span-2 flex items-start gap-2">
                <input type="checkbox" checked={form.gdpr} onChange={e => setForm({ ...form, gdpr: e.target.checked })} className="mt-1" />
                <span className="text-xs opacity-60">Acconsento al trattamento dei dati personali ai sensi del GDPR. I dati saranno trattati esclusivamente per la gestione dell'appuntamento.</span>
              </div>
            </div>
            <Button onClick={handleBooking} disabled={submitting || !form.gdpr} className="w-full mt-6 py-6 text-lg font-semibold" style={{ background: teal, color: "#fff" }}>
              {submitting ? "Invio..." : "Conferma Prenotazione"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FAQ */}
      {faqs.length > 0 && (
        <Section className="py-20" style={{ background: "#f5f7fa" } as any}>
          <div className="max-w-3xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center mb-10" style={{ color: blue }}>Domande Frequenti</h2>
            <div className="space-y-4">
              {faqs.map((f: any) => (
                <Card key={f.id} className="p-5 border-0 shadow-sm">
                  <h3 className="font-bold mb-2" style={{ color: blue }}>{f.question}</h3>
                  <p className="text-sm opacity-70">{f.answer}</p>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* CONTATTI + FOOTER */}
      <Section id="contatti" className="py-20" style={{ background: blue } as any}>
        <div className="max-w-5xl mx-auto px-6 text-center text-white">
          <h2 className="text-3xl font-bold mb-8">Contattaci</h2>
          <div className="grid sm:grid-cols-3 gap-6 mb-10">
            {company.address && <div className="flex flex-col items-center gap-2"><MapPin className="w-6 h-6" style={{ color: teal }} /><p>{company.address}{company.city ? `, ${company.city}` : ""}</p></div>}
            {phone && <div className="flex flex-col items-center gap-2"><Phone className="w-6 h-6" style={{ color: teal }} /><a href={`tel:${phone}`}>{phone}</a></div>}
            {company.email && <div className="flex flex-col items-center gap-2"><Mail className="w-6 h-6" style={{ color: teal }} /><a href={`mailto:${company.email}`}>{company.email}</a></div>}
          </div>
          <p className="text-xs opacity-40">© {new Date().getFullYear()} {name}. Tutti i diritti riservati. | <a href="/privacy">Privacy</a> | Powered by Empire</p>
        </div>
      </Section>

      {phone && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
