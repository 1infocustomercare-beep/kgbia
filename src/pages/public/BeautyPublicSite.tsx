import { useState } from "react";
import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Scissors, Star, Phone, Mail, MapPin, Clock, Calendar,
  Heart, Sparkles, CheckCircle, Send, ChevronDown, Instagram,
  Users, Award
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Props { company: any; }

export default function BeautyPublicSite({ company }: Props) {
  const companyId = company.id;
  const accentHsl = "330 70% 55%";
  const [form, setForm] = useState({ name: "", phone: "", email: "", service: "", date: "", time: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: appointments = [] } = useQuery({
    queryKey: ["beauty-pub-services", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("content_blocks").select("*").eq("company_id", companyId).eq("section", "services");
      return data || [];
    },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["beauty-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const { data: settings } = useQuery({
    queryKey: ["beauty-pub-settings", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("company_settings").select("*").eq("company_id", companyId).maybeSingle();
      return data;
    },
  });

  const handleSubmit = async () => {
    if (!form.name || !form.phone) { toast.error("Inserisci nome e telefono"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("appointments").insert({
      company_id: companyId,
      client_name: form.name,
      client_phone: form.phone,
      scheduled_at: form.date && form.time ? `${form.date}T${form.time}:00` : new Date(Date.now() + 86400000).toISOString(),
      service_name: form.service || null,
      notes: form.notes || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nell'invio"); return; }
    toast.success("Appuntamento richiesto! Ti confermeremo a breve.");
    setForm({ name: "", phone: "", email: "", service: "", date: "", time: "", notes: "" });
  };

  const socialLinks = company.social_links as Record<string, string> | null;

  const beautyServices = [
    { name: "Taglio & Piega", icon: "✂️", desc: "Styling personalizzato" },
    { name: "Colore & Meches", icon: "🎨", desc: "Colorazioni premium" },
    { name: "Trattamenti Viso", icon: "✨", desc: "Pulizia e idratazione" },
    { name: "Manicure & Pedicure", icon: "💅", desc: "Cura delle unghie" },
    { name: "Massaggi", icon: "💆", desc: "Relax e benessere" },
    { name: "Depilazione", icon: "🌸", desc: "Laser e cera" },
  ];

  const whyUs = [
    { icon: Award, title: "Professionisti Certificati", desc: "Team con anni di esperienza e formazione continua" },
    { icon: Sparkles, title: "Prodotti Premium", desc: "Utilizziamo solo brand di alta qualità e cruelty-free" },
    { icon: Heart, title: "Cura Personalizzata", desc: "Ogni trattamento è studiato per le tue esigenze specifiche" },
    { icon: Calendar, title: "Prenotazione Facile", desc: "Prenota online in pochi click, conferma immediata" },
    { icon: Clock, title: "Orari Flessibili", desc: "Aperti 6 giorni su 7, anche in pausa pranzo" },
    { icon: CheckCircle, title: "Soddisfazione Garantita", desc: "Se non sei soddisfatto, ti rifacciamo il trattamento gratis" },
  ];

  return (
    <div className="min-h-screen bg-[#0f0812] text-white overflow-x-hidden">
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[#0f0812]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <Scissors className="w-6 h-6 text-pink-400" />}
            <span className="font-bold text-base md:text-lg truncate">{company.name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-white/60">
            <a href="#servizi" className="hover:text-white transition-colors">Servizi</a>
            <a href="#perche" className="hover:text-white transition-colors">Perché Noi</a>
            <a href="#prenota" className="hover:text-white transition-colors">Prenota</a>
          </div>
          <Button size="sm" className="bg-pink-500 hover:bg-pink-600 text-white rounded-xl font-semibold" asChild>
            <a href="#prenota">Prenota Ora</a>
          </Button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center pt-16 px-4">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-pink-950/40 via-[#0f0812] to-[#0f0812]" />
          <div className="absolute top-20 right-10 w-[500px] h-[500px] rounded-full bg-pink-600/8 blur-[120px]" />
          <div className="absolute bottom-20 left-10 w-[300px] h-[300px] rounded-full bg-purple-600/8 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `radial-gradient(circle, rgba(236,72,153,0.3) 1px, transparent 1px)`,
            backgroundSize: "40px 40px",
          }} />
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-500/10 border border-pink-500/20 text-pink-300 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" /> Beauty & Wellness Premium
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-pink-100 to-purple-200 bg-clip-text text-transparent">
              {company.tagline || "La tua bellezza, la nostra passione"}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Scopri il mondo di <strong className="text-white/80">{company.name}</strong>.
            Trattamenti esclusivi, prodotti premium e uno staff dedicato alla tua bellezza.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl px-10 h-14 text-base shadow-2xl shadow-pink-500/30" asChild>
              <a href="#prenota"><Calendar className="w-5 h-5 mr-2" /> Prenota Appuntamento</a>
            </Button>
            {company.phone && (
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama</a>
              </Button>
            )}
          </motion.div>
        </motion.div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="servizi" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">I Nostri Servizi</h2>
            <p className="text-white/40">Trattamenti esclusivi per prenderti cura di te</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beautyServices.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:border-pink-500/20 transition-all duration-500 group">
                  <CardContent className="p-6 text-center">
                    <div className="text-4xl mb-3">{s.icon}</div>
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
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Perché Scegliere Noi</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:bg-white/[0.04] transition-all group">
                  <CardContent className="p-5">
                    <div className="w-11 h-11 rounded-xl bg-pink-500/10 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-pink-400" />
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

      {/* ═══ BOOKING FORM ═══ */}
      <section id="prenota" className="py-20 px-4 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-pink-950/15 to-transparent pointer-events-none" />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Prenota il tuo Appuntamento</h2>
            <p className="text-white/40">Ti confermiamo entro pochi minuti</p>
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
                <Label className="text-white/50 text-xs">Servizio desiderato</Label>
                <Input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="Es: Taglio e piega, colore..." />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/50 text-xs">Data preferita</Label>
                  <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
                </div>
                <div>
                  <Label className="text-white/50 text-xs">Orario preferito</Label>
                  <Input type="time" value={form.time} onChange={e => setForm(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
                </div>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Note</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px] text-base" placeholder="Richieste particolari..." />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-13 text-base font-bold rounded-xl bg-pink-500 hover:bg-pink-600 text-white shadow-2xl shadow-pink-500/30">
                {submitting ? "Invio..." : "Richiedi Appuntamento"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <Scissors className="w-5 h-5 text-pink-400" />}
            <span className="font-semibold text-white/80">{company.name}</span>
          </div>
          <div className="flex gap-4 text-xs text-white/30">
            {company.phone && <a href={`tel:${company.phone}`} className="hover:text-white/50"><Phone className="w-3 h-3 inline mr-1" />{company.phone}</a>}
            {company.email && <a href={`mailto:${company.email}`} className="hover:text-white/50"><Mail className="w-3 h-3 inline mr-1" />{company.email}</a>}
          </div>
          <p className="text-[10px] text-white/15">Powered by Empire Platform</p>
        </div>
      </footer>
    </div>
  );
}
