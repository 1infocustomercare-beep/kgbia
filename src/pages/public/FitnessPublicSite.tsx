import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar,
  Dumbbell, Flame, Heart, Zap, Users, Award,
  Target, Timer, ArrowRight, MessageCircle, Trophy, TrendingUp
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

export default function FitnessPublicSite({ company }: Props) {
  const orange = "#FF6B00";
  const dark = "#111111";
  const companyId = company.id;

  const { data: faqs = [] } = useQuery({
    queryKey: ["fit-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleLead = async () => {
    if (!form.name || !form.phone) { toast.error("Nome e telefono obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, email: form.email, source: "website", notes: form.interest });
      toast.success("Richiesta inviata! Ti contatteremo al più presto.");
      setForm({ name: "", phone: "", email: "", interest: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const name = company.name || "Fitness Club";
  const tagline = company.tagline || "Trasforma il Tuo Corpo";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const classes = [
    { name: "CrossFit", icon: Flame, time: "07:00 - 08:00", trainer: "Marco R.", spots: 3, color: "#FF4444" },
    { name: "Yoga Flow", icon: Heart, time: "09:00 - 10:00", trainer: "Sara M.", spots: 8, color: "#9B59B6" },
    { name: "HIIT Extreme", icon: Zap, time: "12:00 - 13:00", trainer: "Luca P.", spots: 2, color: orange },
    { name: "Pilates", icon: Target, time: "17:00 - 18:00", trainer: "Giulia B.", spots: 5, color: "#2ECC71" },
    { name: "Boxing", icon: Trophy, time: "18:30 - 19:30", trainer: "Alex V.", spots: 4, color: "#E74C3C" },
    { name: "Functional Training", icon: Dumbbell, time: "19:30 - 20:30", trainer: "Marco R.", spots: 6, color: "#3498DB" },
  ];

  return (
    <div style={{ fontFamily: "'Oswald', sans-serif", background: dark, color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: "rgba(17,17,17,0.9)", borderBottom: `2px solid ${orange}` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" />}
            <span className="text-xl font-bold uppercase tracking-wider" style={{ color: orange }}>{name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Classi", "Abbonamenti", "Team", "Contatti"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm uppercase tracking-widest font-medium text-white/70 hover:text-white transition" style={{ fontFamily: "'Roboto', sans-serif" }}>{item}</a>
            ))}
          </div>
          <a href="#join"><Button className="px-6 py-2 font-bold uppercase tracking-wider" style={{ background: orange, color: "#fff" }}>Iscriviti</Button></a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920)", filter: "brightness(0.25)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${dark}CC 0%, transparent 50%, ${orange}33 100%)` }} />
        
        <div className="relative z-10 max-w-5xl mx-auto px-6 pt-20">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <Badge className="mb-6 text-sm px-4 py-2 uppercase tracking-widest" style={{ background: `${orange}30`, color: orange, border: `1px solid ${orange}60` }}>
              <Flame className="w-4 h-4 mr-2" /> Nuova Stagione
            </Badge>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-none mb-6">
              <span className="block text-white">TRASFORMA</span>
              <span className="block" style={{ color: orange, textShadow: `0 0 40px ${orange}44` }}>IL TUO CORPO</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/60 max-w-xl mb-10" style={{ fontFamily: "'Roboto', sans-serif" }}>{tagline}</p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-16">
              <a href="#join"><Button className="px-10 py-6 text-lg font-bold uppercase tracking-wider" style={{ background: orange, color: "#fff" }}>Prova Gratuita</Button></a>
              <a href="#classi"><Button variant="outline" className="px-10 py-6 text-lg uppercase tracking-wider" style={{ borderColor: "#fff3", color: "#fff" }}>Le Nostre Classi</Button></a>
            </div>

            {/* Counters */}
            <div className="grid grid-cols-3 gap-8 max-w-lg">
              {[{ n: "500+", l: "Iscritti" }, { n: "20+", l: "Classi / Settimana" }, { n: "15+", l: "Trainer Certificati" }].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.15 }}>
                  <p className="text-3xl sm:text-4xl font-bold" style={{ color: orange }}>{c.n}</p>
                  <p className="text-xs uppercase tracking-widest text-white/40" style={{ fontFamily: "'Roboto', sans-serif" }}>{c.l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLASSI */}
      <Section id="classi" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-5xl font-bold uppercase">Le Nostre <span style={{ color: orange }}>Classi</span></h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {classes.map((cls, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="p-6 group hover:scale-105 transition-all duration-300 border-0" style={{ background: "#1a1a1a", borderLeft: `4px solid ${cls.color}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: `${cls.color}20` }}>
                      <cls.icon className="w-6 h-6" style={{ color: cls.color }} />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold uppercase">{cls.name}</h3>
                      <p className="text-xs text-white/40" style={{ fontFamily: "'Roboto', sans-serif" }}>{cls.trainer}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    <div className="flex items-center gap-2 text-sm text-white/60"><Timer className="w-4 h-4" /> {cls.time}</div>
                    <Badge className="text-xs" style={{ background: cls.spots <= 3 ? "#FF444430" : "#2ECC7130", color: cls.spots <= 3 ? "#FF4444" : "#2ECC71" }}>
                      {cls.spots <= 3 ? "Quasi pieno" : `${cls.spots} posti`}
                    </Badge>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* ABBONAMENTI */}
      <Section id="abbonamenti" className="py-20 sm:py-28" style={{ background: "#0a0a0a" } as any}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-3xl sm:text-5xl font-bold uppercase text-center mb-12">I Nostri <span style={{ color: orange }}>Piani</span></h2>
          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { name: "Base", price: "39", features: ["Accesso sala pesi", "Spogliatoi", "App Empire"] },
              { name: "Pro", price: "59", features: ["Tutto Base +", "Classi illimitate", "Sauna & Spa", "1 PT/mese"], popular: true },
              { name: "Elite", price: "99", features: ["Tutto Pro +", "PT illimitato", "Nutrizione", "Accesso 24/7"] },
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Card className={`p-6 text-center relative ${plan.popular ? "scale-105" : ""}`} style={{ background: plan.popular ? "#1a1a1a" : "#111", border: plan.popular ? `2px solid ${orange}` : "1px solid #222" }}>
                  {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-xs px-4" style={{ background: orange, color: "#fff" }}>PIÙ SCELTO</Badge>}
                  <h3 className="text-xl font-bold uppercase mt-2 mb-1">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-6" style={{ color: orange }}>€{plan.price}<span className="text-sm text-white/40">/mese</span></p>
                  <ul className="space-y-2 mb-8" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    {plan.features.map(f => <li key={f} className="text-sm text-white/70 flex items-center gap-2"><Zap className="w-3 h-3" style={{ color: orange }} />{f}</li>)}
                  </ul>
                  <Button className="w-full py-5 font-bold uppercase tracking-wider" style={{ background: plan.popular ? orange : "#222", color: "#fff" }}>Scegli {plan.name}</Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* JOIN / LEAD FORM */}
      <Section id="join" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=1920)", filter: "brightness(0.15)" }} />
        <div className="relative z-10 max-w-lg mx-auto px-6 text-center">
          <Dumbbell className="w-12 h-12 mx-auto mb-4" style={{ color: orange }} />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-4">Inizia <span style={{ color: orange }}>Oggi</span></h2>
          <p className="text-white/50 mb-8" style={{ fontFamily: "'Roboto', sans-serif" }}>Compila il form per una prova gratuita</p>
          <Card className="p-6 text-left" style={{ background: "#111E", border: `1px solid ${orange}30`, backdropFilter: "blur(20px)" }}>
            <div className="space-y-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome *" className="bg-transparent border-white/20 text-white" />
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefono *" className="bg-transparent border-white/20 text-white" />
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-transparent border-white/20 text-white" />
              <Input value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} placeholder="Cosa ti interessa? (es: CrossFit, PT...)" className="bg-transparent border-white/20 text-white" />
            </div>
            <Button onClick={handleLead} disabled={submitting} className="w-full mt-6 py-6 text-lg font-bold uppercase tracking-wider" style={{ background: orange, color: "#fff" }}>
              {submitting ? "Invio..." : "Richiedi Prova Gratuita"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-10 border-t" style={{ borderColor: "#222" }}>
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
          <p className="text-xs text-white/30">© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex gap-4 text-xs text-white/30">
            <a href="/privacy">Privacy</a><a href="/cookie-policy">Cookie</a><span>Powered by Empire</span>
          </div>
        </div>
      </footer>

      {phone && (
        <a href={whatsapp} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366" }}>
          <MessageCircle className="w-7 h-7 text-white" />
        </a>
      )}
    </div>
  );
}
