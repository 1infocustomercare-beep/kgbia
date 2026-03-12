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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import {
  Umbrella, Star, Phone, Mail, MapPin, Clock, Calendar,
  Sun, Waves, CheckCircle, Send, ChevronDown, Instagram,
  Users, CreditCard, Coffee
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Props { company: any; }

export default function BeachPublicSite({ company }: Props) {
  const companyId = company.id;
  const [form, setForm] = useState({ name: "", phone: "", date: "", period: "full_day", spotType: "umbrella", notes: "" });
  const [submitting, setSubmitting] = useState(false);

  const { data: spots = [] } = useQuery({
    queryKey: ["beach-pub-spots", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("beach_spots").select("*").eq("company_id", companyId).eq("is_active", true).order("row_letter").order("spot_number");
      return data || [];
    },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["beach-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const totalSpots = spots.length;
  const rows = new Set(spots.map((s: any) => s.row_letter)).size;
  const minPrice = spots.length > 0 ? Math.min(...spots.filter((s: any) => s.price_daily > 0).map((s: any) => s.price_daily)) : 0;
  const vipSpots = spots.filter((s: any) => s.spot_type === "vip").length;

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.date) { toast.error("Compila nome, telefono e data"); return; }
    setSubmitting(true);
    const { error } = await supabase.from("beach_bookings").insert({
      company_id: companyId,
      client_name: form.name,
      client_phone: form.phone,
      booking_date: form.date,
      period: form.period,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nella prenotazione"); return; }
    toast.success("Prenotazione inviata! Ti confermeremo a breve.");
    setForm({ name: "", phone: "", date: "", period: "full_day", spotType: "umbrella", notes: "" });
  };

  const beachServices = [
    { emoji: "🏖️", name: "Ombrelloni Premium", desc: "Prima fila fronte mare con lettini luxury" },
    { emoji: "🍹", name: "Bar & Ristorante", desc: "Servizio al posto con cucina mediterranea" },
    { emoji: "🏊", name: "Area Piscina", desc: "Piscina con acqua di mare riscaldata" },
    { emoji: "👶", name: "Area Bambini", desc: "Parco giochi e animazione per i più piccoli" },
    { emoji: "🚿", name: "Docce & Spogliatoi", desc: "Spogliatoi con docce calde gratuite" },
    { emoji: "📶", name: "WiFi Gratuito", desc: "Connessione veloce in tutta la spiaggia" },
  ];

  const whyUs = [
    { icon: Sun, title: "Posizione Privilegiata", desc: "Spiaggia privata con sabbia fine e acqua cristallina" },
    { icon: Umbrella, title: "Comfort Premium", desc: "Lettini e ombrelloni di alta qualità, distanziati per la tua privacy" },
    { icon: Coffee, title: "Servizio al Posto", desc: "Ordina cibo e bevande direttamente dal tuo ombrellone" },
    { icon: CreditCard, title: "Abbonamenti Stagionali", desc: "Tariffe agevolate per abbonamenti settimanali e mensili" },
    { icon: Calendar, title: "Prenota Online", desc: "Scegli il tuo posto e la data in pochi click" },
    { icon: CheckCircle, title: "Garanzia Posto", desc: "Il tuo ombrellone riservato ti aspetta ogni mattina" },
  ];

  return (
    <div className="min-h-screen bg-[#071018] text-white overflow-x-hidden">
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[#071018]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" /> : <Umbrella className="w-6 h-6 text-cyan-400" />}
            <span className="font-bold truncate">{company.name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-white/60">
            <a href="#servizi" className="hover:text-white transition-colors">Servizi</a>
            <a href="#spiaggia" className="hover:text-white transition-colors">La Spiaggia</a>
            <a href="#prenota" className="hover:text-white transition-colors">Prenota</a>
          </div>
          <Button size="sm" className="bg-cyan-500 hover:bg-cyan-600 text-white rounded-xl font-semibold" asChild>
            <a href="#prenota">Prenota Posto</a>
          </Button>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center pt-16 px-4">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-950/50 via-[#071018] to-[#071018]" />
          <div className="absolute top-10 right-10 w-[500px] h-[500px] rounded-full bg-cyan-500/8 blur-[120px]" />
          <div className="absolute bottom-20 left-20 w-[400px] h-[400px] rounded-full bg-blue-600/5 blur-[100px]" />
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm font-medium mb-8">
            <Waves className="w-4 h-4" /> Stabilimento Balneare Premium
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-cyan-100 to-blue-200 bg-clip-text text-transparent">
              {company.tagline || "Il tuo angolo di paradiso"}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-lg text-white/50 mb-10 max-w-2xl mx-auto">
            Benvenuto a <strong className="text-white/80">{company.name}</strong>.
            Spiaggia privata, servizio premium e relax totale per la tua estate perfetta.
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold rounded-xl px-10 h-14 text-base shadow-2xl shadow-cyan-500/30" asChild>
              <a href="#prenota"><Umbrella className="w-5 h-5 mr-2" /> Prenota il tuo Ombrellone</a>
            </Button>
          </motion.div>

          {totalSpots > 0 && (
            <motion.div variants={fadeUp} custom={4} className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-12 max-w-2xl mx-auto">
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{totalSpots}</p>
                <p className="text-xs text-white/30">Postazioni</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{rows}</p>
                <p className="text-xs text-white/30">File</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">€{minPrice || "—"}</p>
                <p className="text-xs text-white/30">Da / giorno</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">{vipSpots || "✓"}</p>
                <p className="text-xs text-white/30">{vipSpots ? "VIP" : "Premium"}</p>
              </div>
            </motion.div>
          )}
        </motion.div>
      </section>

      {/* ═══ SERVICES ═══ */}
      <section id="servizi" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">I Nostri Servizi</h2>
            <p className="text-white/40">Tutto il necessario per una giornata perfetta al mare</p>
          </div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {beachServices.map((s, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:border-cyan-500/20 transition-all group">
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
      <section id="spiaggia" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-3">Perché Scegliere Noi</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:bg-white/[0.04] transition-all group">
                  <CardContent className="p-5">
                    <div className="w-11 h-11 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-3">
                      <item.icon className="w-5 h-5 text-cyan-400" />
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
        <div className="absolute inset-0 bg-gradient-to-t from-cyan-950/15 to-transparent pointer-events-none" />
        <div className="max-w-lg mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Prenota il tuo Posto</h2>
            <p className="text-white/40">Scegli la data e ti riserviamo il posto migliore</p>
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
                <Label className="text-white/50 text-xs">Data *</Label>
                <Input type="date" value={form.date} onChange={e => setForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
              </div>
              <div>
                <Label className="text-white/50 text-xs">Periodo</Label>
                <Select value={form.period} onValueChange={v => setForm(p => ({ ...p, period: v }))}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="morning">☀️ Solo Mattina (08:00 - 13:00)</SelectItem>
                    <SelectItem value="afternoon">🌅 Solo Pomeriggio (13:00 - 19:00)</SelectItem>
                    <SelectItem value="full_day">🏖️ Giornata Intera</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Note</Label>
                <Textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px] text-base" placeholder="Es: Prima fila, con lettino extra..." />
              </div>
              <Button onClick={handleSubmit} disabled={submitting} className="w-full h-13 text-base font-bold rounded-xl bg-cyan-500 hover:bg-cyan-600 text-white shadow-2xl shadow-cyan-500/30">
                {submitting ? "Invio..." : "Prenota Posto"}
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
            {company.logo_url ? <img src={company.logo_url} alt="" className="h-7 w-7 rounded-lg object-cover" /> : <Umbrella className="w-5 h-5 text-cyan-400" />}
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
