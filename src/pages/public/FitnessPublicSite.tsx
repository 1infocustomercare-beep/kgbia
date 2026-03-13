import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Phone, Clock, Calendar,
  Dumbbell, Flame, Heart, Zap, Users,
  Target, Timer, ArrowRight, MessageCircle, Trophy, ChevronDown, Star, MapPin, Mail
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

const HERO_IMG = "https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=1920";
const GALLERY = [
  "https://images.pexels.com/photos/841130/pexels-photo-841130.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/1954524/pexels-photo-1954524.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4164761/pexels-photo-4164761.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/4162451/pexels-photo-4162451.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2261477/pexels-photo-2261477.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/3253501/pexels-photo-3253501.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function FitnessPublicSite({ company }: Props) {
  const orange = "#FF6B00";
  const dark = "#0a0a0a";
  const companyId = company.id;
  const name = company.name || "Fitness Club";
  const tagline = company.tagline || "Trasforma il Tuo Corpo";
  const phone = company.phone;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const [form, setForm] = useState({ name: "", phone: "", email: "", interest: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleLead = async () => {
    if (!form.name || !form.phone) { toast.error("Nome e telefono obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, email: form.email, source: "website", notes: form.interest });
      toast.success("Richiesta inviata!");
      setForm({ name: "", phone: "", email: "", interest: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const classes = [
    { name: "CrossFit", icon: Flame, time: "07:00", trainer: "Marco R.", spots: 3, color: "#FF4444", img: GALLERY[0] },
    { name: "Yoga Flow", icon: Heart, time: "09:00", trainer: "Sara M.", spots: 8, color: "#9B59B6", img: GALLERY[1] },
    { name: "HIIT Extreme", icon: Zap, time: "12:00", trainer: "Luca P.", spots: 2, color: orange, img: GALLERY[2] },
    { name: "Pilates", icon: Target, time: "17:00", trainer: "Giulia B.", spots: 5, color: "#2ECC71", img: GALLERY[3] },
    { name: "Boxing", icon: Trophy, time: "18:30", trainer: "Alex V.", spots: 4, color: "#E74C3C", img: GALLERY[4] },
    { name: "Functional", icon: Dumbbell, time: "19:30", trainer: "Marco R.", spots: 6, color: "#3498DB", img: GALLERY[5] },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Oswald', sans-serif", background: dark, color: "#fff" }}>
      <link href="https://fonts.googleapis.com/css2?family=Oswald:wght@400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: `${dark}EE`, borderBottom: `2px solid ${orange}` }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <span className="text-lg font-bold uppercase tracking-wider" style={{ color: orange }}>{name}</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {["Classi", "Piani", "Iscriviti"].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-xs uppercase tracking-[0.2em] font-medium text-white/50 hover:text-white transition" style={{ fontFamily: "'Roboto', sans-serif" }}>{item}</button>
            ))}
          </div>
          <Button className="px-5 font-bold uppercase tracking-wider text-sm" style={{ background: orange, color: "#fff" }} onClick={() => scrollTo("iscriviti")}>Iscriviti</Button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" className="relative min-h-screen flex items-center overflow-hidden">
        <img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.2)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${dark}DD 0%, transparent 50%, ${orange}22 100%)` }} />

        <div className="relative z-10 max-w-5xl mx-auto px-5 pt-20">
          <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-6" style={{ background: `${orange}25`, color: orange, border: `1px solid ${orange}50`, fontFamily: "'Roboto', sans-serif" }}>
              <Flame className="w-4 h-4" /> Nuova Stagione
            </span>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-bold uppercase leading-none mb-5">
              <span className="block text-white">TRASFORMA</span>
              <span className="block" style={{ color: orange, textShadow: `0 0 40px ${orange}44` }}>IL TUO CORPO</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-lg mb-8" style={{ fontFamily: "'Roboto', sans-serif" }}>{tagline}</p>
            <div className="flex flex-col sm:flex-row gap-3 mb-14">
              <Button className="px-8 py-5 text-base font-bold uppercase tracking-wider" style={{ background: orange, color: "#fff" }} onClick={() => scrollTo("iscriviti")}>Prova Gratuita</Button>
              <Button variant="outline" className="px-8 py-5 text-base uppercase tracking-wider text-white" style={{ borderColor: "#fff2" }} onClick={() => scrollTo("classi")}>Le Nostre Classi</Button>
            </div>
            <div className="grid grid-cols-3 gap-6 max-w-sm">
              {[{ n: "500+", l: "Iscritti" }, { n: "20+", l: "Classi / Sett." }, { n: "15+", l: "Trainer" }].map((c, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 + i * 0.15 }}>
                  <p className="text-2xl sm:text-3xl font-bold" style={{ color: orange }}>{c.n}</p>
                  <p className="text-[10px] uppercase tracking-widest text-white/30" style={{ fontFamily: "'Roboto', sans-serif" }}>{c.l}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* CLASSES */}
      <Section id="classi" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl sm:text-5xl font-bold uppercase text-center mb-10">Le Nostre <span style={{ color: orange }}>Classi</span></h2>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} className="group relative rounded-2xl overflow-hidden" style={{ background: "#111" }}>
                <div className="h-40 overflow-hidden">
                  <img src={cls.img} alt={cls.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 brightness-50" loading="lazy" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111] via-transparent to-transparent" />
                </div>
                <div className="p-5 relative">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${cls.color}20` }}>
                      <cls.icon className="w-5 h-5" style={{ color: cls.color }} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold uppercase">{cls.name}</h3>
                      <p className="text-xs text-white/40" style={{ fontFamily: "'Roboto', sans-serif" }}>{cls.trainer}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    <div className="flex items-center gap-2 text-sm text-white/50"><Timer className="w-4 h-4" /> {cls.time}</div>
                    <Badge className="text-[10px]" style={{ background: cls.spots <= 3 ? "#FF444425" : "#2ECC7125", color: cls.spots <= 3 ? "#FF4444" : "#2ECC71" }}>
                      {cls.spots <= 3 ? "Quasi pieno" : `${cls.spots} posti`}
                    </Badge>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* PRICING */}
      <Section id="piani" className="py-16 sm:py-24" style={{ background: "#050505" }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl sm:text-5xl font-bold uppercase text-center mb-10">I Nostri <span style={{ color: orange }}>Piani</span></h2>
          <div className="grid sm:grid-cols-3 gap-5">
            {[
              { name: "Base", price: "39", features: ["Accesso sala pesi", "Spogliatoi", "App Empire"] },
              { name: "Pro", price: "59", features: ["Tutto Base +", "Classi illimitate", "Sauna & Spa", "1 PT/mese"], popular: true },
              { name: "Elite", price: "99", features: ["Tutto Pro +", "PT illimitato", "Nutrizione", "24/7"] },
            ].map((plan, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }}>
                <Card className={`p-6 text-center relative border-0 ${plan.popular ? "scale-[1.03]" : ""}`} style={{ background: plan.popular ? "#151515" : "#111", border: plan.popular ? `2px solid ${orange}` : "1px solid #222" }}>
                  {plan.popular && <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 text-[10px] px-4" style={{ background: orange, color: "#fff" }}>PIÙ SCELTO</Badge>}
                  <h3 className="text-lg font-bold uppercase mt-2 mb-1">{plan.name}</h3>
                  <p className="text-4xl font-bold mb-5" style={{ color: orange }}>€{plan.price}<span className="text-sm text-white/30">/mese</span></p>
                  <ul className="space-y-2 mb-6" style={{ fontFamily: "'Roboto', sans-serif" }}>
                    {plan.features.map(f => <li key={f} className="text-sm text-white/60 flex items-center gap-2"><Zap className="w-3 h-3" style={{ color: orange }} />{f}</li>)}
                  </ul>
                  <Button className="w-full py-4 font-bold uppercase tracking-wider" style={{ background: plan.popular ? orange : "#222", color: "#fff" }} onClick={() => scrollTo("iscriviti")}>Scegli {plan.name}</Button>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* JOIN FORM */}
      <Section id="iscriviti" className="py-16 sm:py-24 relative">
        <img src={GALLERY[0]} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.12)" }} />
        <div className="relative z-10 max-w-lg mx-auto px-5 text-center">
          <Dumbbell className="w-10 h-10 mx-auto mb-4" style={{ color: orange }} />
          <h2 className="text-3xl sm:text-4xl font-bold uppercase mb-3">Inizia <span style={{ color: orange }}>Oggi</span></h2>
          <p className="text-white/40 mb-6" style={{ fontFamily: "'Roboto', sans-serif" }}>Compila il form per una prova gratuita</p>
          <Card className="p-5 text-left border-0" style={{ background: `${dark}EE`, border: `1px solid ${orange}25`, backdropFilter: "blur(20px)" }}>
            <div className="space-y-3" style={{ fontFamily: "'Roboto', sans-serif" }}>
              <Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Il tuo nome *" className="bg-transparent border-white/15 text-white h-11" />
              <Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="Telefono *" className="bg-transparent border-white/15 text-white h-11" />
              <Input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="Email" className="bg-transparent border-white/15 text-white h-11" />
              <Input value={form.interest} onChange={e => setForm({ ...form, interest: e.target.value })} placeholder="Cosa ti interessa? (CrossFit, PT...)" className="bg-transparent border-white/15 text-white h-11" />
            </div>
            <Button onClick={handleLead} disabled={submitting} className="w-full mt-4 py-5 text-base font-bold uppercase tracking-wider" style={{ background: orange, color: "#fff" }}>
              {submitting ? "Invio..." : "Richiedi Prova Gratuita"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: "#1a1a1a" }}>
        <div className="max-w-6xl mx-auto px-5 flex flex-col md:flex-row items-center justify-between gap-4" style={{ fontFamily: "'Roboto', sans-serif" }}>
          <p className="text-xs text-white/25">© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
          <div className="flex gap-4 text-xs text-white/25"><a href="/privacy">Privacy</a><span>Powered by Empire.AI</span></div>
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
