import { useState, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Star, Phone, Mail, MapPin, Clock, Calendar,
  Bed, Wifi, Coffee, UtensilsCrossed, Waves, Sparkles,
  Users, Award, Heart, MessageCircle, CheckCircle, Tv, Car, ChevronDown, Quote
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

const HERO_IMG = "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920";
const GALLERY = [
  "https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/260922/pexels-photo-260922.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/189296/pexels-photo-189296.jpeg?auto=compress&cs=tinysrgb&w=800",
  "https://images.pexels.com/photos/2507010/pexels-photo-2507010.jpeg?auto=compress&cs=tinysrgb&w=800",
];

export default function HotelPublicSite({ company }: Props) {
  const bordeaux = "#6B2D3E";
  const gold = "#C8A951";
  const cream = "#FDF8F0";
  const companyId = company.id;
  const name = company.name || "Grand Hotel";
  const tagline = company.tagline || "Ospitalità d'eccellenza";
  const phone = company.phone;
  const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ["start start", "end start"] });
  const heroScale = useTransform(scrollYProgress, [0, 1], [1, 1.15]);

  const [form, setForm] = useState({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.checkin || !form.checkout) { toast.error("Compila tutti i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, email: form.email, source: "website", notes: `Check-in: ${form.checkin}, Check-out: ${form.checkout}, Ospiti: ${form.guests}, Camera: ${form.room}` });
      toast.success("Richiesta inviata!");
      setForm({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const rooms = [
    { name: "Camera Superior", price: 149, img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["32 mq", "Vista Giardino", "Balcone"], guests: 2 },
    { name: "Suite Deluxe", price: 249, img: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["55 mq", "Vista Mare", "Jacuzzi"], guests: 2, popular: true },
    { name: "Suite Presidenziale", price: 449, img: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=800", features: ["90 mq", "Panoramica", "Terrazza"], guests: 4 },
  ];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ fontFamily: "'Libre Baskerville', serif", background: cream, color: "#2a1f2d" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: `${cream}EE`, borderBottom: `1px solid ${gold}25` }}>
        <div className="max-w-6xl mx-auto px-4 flex items-center justify-between h-16">
          <button onClick={() => scrollTo("hero")} className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-9 w-9 rounded-full object-cover" />}
            <span className="text-lg font-bold" style={{ color: bordeaux }}>{name}</span>
          </button>
          <div className="hidden md:flex items-center gap-8">
            {["Camere", "Servizi", "Prenota"].map(item => (
              <button key={item} onClick={() => scrollTo(item.toLowerCase())} className="text-xs tracking-[0.15em] uppercase" style={{ color: "#888", fontFamily: "'Lato', sans-serif" }}>{item}</button>
            ))}
          </div>
          <Button className="px-5 text-sm font-semibold" style={{ background: bordeaux, color: cream, fontFamily: "'Lato', sans-serif" }} onClick={() => scrollTo("prenota")}>Prenota</Button>
        </div>
      </nav>

      {/* HERO */}
      <section id="hero" ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <motion.img src={HERO_IMG} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ scale: heroScale, filter: "brightness(0.35)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${bordeaux}44 0%, #00000088 100%)` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-5 text-center text-white pt-20">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center justify-center gap-1 mb-5">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-4 h-4" fill={gold} style={{ color: gold }} />)}
            </div>
            <p className="text-[10px] uppercase tracking-[0.35em] mb-3 opacity-60" style={{ fontFamily: "'Lato', sans-serif", color: gold }}>Benvenuti a</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold italic mb-5">{name}</h1>
            <p className="text-base sm:text-lg opacity-70 mb-8" style={{ fontFamily: "'Lato', sans-serif" }}>{tagline}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="px-8 py-5 text-base" style={{ background: `linear-gradient(135deg, ${gold}, #A88B30)`, color: "#1a1a1a", fontFamily: "'Lato', sans-serif" }} onClick={() => scrollTo("prenota")}>Prenota il Soggiorno</Button>
              <Button variant="outline" className="px-8 py-5 text-base" style={{ borderColor: gold, color: gold, fontFamily: "'Lato', sans-serif" }} onClick={() => scrollTo("camere")}>Le Nostre Camere</Button>
            </div>
          </motion.div>
        </div>
        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ROOMS */}
      <Section id="camere" className="py-16 sm:py-24">
        <div className="max-w-6xl mx-auto px-5">
          <div className="text-center mb-10">
            <p className="text-[10px] uppercase tracking-[0.25em] mb-2" style={{ color: gold, fontFamily: "'Lato', sans-serif" }}>ACCOMODATION</p>
            <h2 className="text-3xl sm:text-4xl font-bold" style={{ color: bordeaux }}>Le Nostre Camere</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="overflow-hidden group shadow-lg border-0 relative">
                  {room.popular && <Badge className="absolute top-3 right-3 z-10 text-[10px]" style={{ background: gold, color: "#1a1a1a" }}>Più Richiesta</Badge>}
                  <div className="h-52 overflow-hidden">
                    <img src={room.img} alt={room.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
                  </div>
                  <CardContent className="p-5">
                    <h3 className="text-lg font-bold mb-2" style={{ color: bordeaux }}>{room.name}</h3>
                    <div className="flex flex-wrap gap-1.5 mb-3">
                      {room.features.map(f => <Badge key={f} variant="outline" className="text-[10px]" style={{ borderColor: `${gold}35`, color: "#666", fontFamily: "'Lato', sans-serif" }}>{f}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-400" style={{ fontFamily: "'Lato', sans-serif" }}><Users className="w-3.5 h-3.5 inline mr-1" />{room.guests} ospiti</p>
                      <p className="text-xl font-bold" style={{ color: bordeaux }}>€{room.price}<span className="text-xs font-normal text-gray-400">/notte</span></p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* GALLERY */}
      <Section className="py-16">
        <div className="max-w-6xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-8" style={{ color: bordeaux }}>La Struttura</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {GALLERY.map((img, i) => (
              <motion.div key={i} className="relative overflow-hidden rounded-xl aspect-square group"
                initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }} transition={{ delay: i * 0.08, duration: 0.6 }}>
                <img src={img} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" loading="lazy" />
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* SERVICES */}
      <Section id="servizi" className="py-16" style={{ background: `${bordeaux}06` }}>
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl font-bold text-center mb-10" style={{ color: bordeaux }}>I Nostri Servizi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-5">
            {[
              { icon: Wifi, label: "Wi-Fi" },
              { icon: UtensilsCrossed, label: "Ristorante" },
              { icon: Waves, label: "Spa" },
              { icon: Car, label: "Parcheggio" },
              { icon: Coffee, label: "Colazione" },
              { icon: Tv, label: "Room Service" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }} className="text-center p-4">
                <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-2" style={{ background: `${gold}18` }}>
                  <Icon className="w-5 h-5" style={{ color: bordeaux }} />
                </div>
                <p className="text-sm font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* BOOKING */}
      <Section id="prenota" className="py-16 sm:py-24 relative">
        <img src={GALLERY[0]} alt="" className="absolute inset-0 w-full h-full object-cover" style={{ filter: "brightness(0.15)" }} />
        <div className="relative z-10 max-w-2xl mx-auto px-5">
          <div className="text-center mb-8 text-white">
            <Calendar className="w-7 h-7 mx-auto mb-3" style={{ color: gold }} />
            <h2 className="text-3xl sm:text-4xl font-bold">Prenota il Soggiorno</h2>
          </div>
          <Card className="p-6 backdrop-blur-xl border-0" style={{ background: "rgba(10,10,10,0.85)", border: `1px solid ${gold}25` }}>
            <div className="grid sm:grid-cols-2 gap-3" style={{ fontFamily: "'Lato', sans-serif" }}>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: gold }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: gold }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: gold }}>Check-in *</label><Input type="date" value={form.checkin} onChange={e => setForm({ ...form, checkin: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: gold }}>Check-out *</label><Input type="date" value={form.checkout} onChange={e => setForm({ ...form, checkout: e.target.value })} className="bg-transparent border-white/15 text-white h-10" /></div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: gold }}>Ospiti</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full h-10 px-3 rounded-md bg-transparent border border-white/15 text-white text-sm">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
                </select>
              </div>
              <div><label className="text-[10px] uppercase tracking-widest mb-1 block" style={{ color: gold }}>Camera</label><Input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="Es: Suite Deluxe" className="bg-transparent border-white/15 text-white h-10" /></div>
            </div>
            <Button onClick={handleBooking} disabled={submitting} className="w-full mt-5 py-5 text-base font-semibold" style={{ background: `linear-gradient(135deg, ${gold}, #A88B30)`, color: "#1a1a1a" }}>
              {submitting ? "Invio..." : "Richiedi Disponibilità"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-8 border-t" style={{ borderColor: `${gold}15`, background: bordeaux }}>
        <div className="max-w-6xl mx-auto px-5 text-center text-white/60 text-xs" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <p>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
            <div className="flex gap-4"><a href="/privacy" className="hover:text-white">Privacy</a><span>Powered by Empire.AI</span></div>
          </div>
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
