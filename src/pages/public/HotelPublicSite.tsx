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
  Bed, Wifi, Coffee, UtensilsCrossed, Waves, Sparkles,
  Users, Award, Heart, MessageCircle, CheckCircle, Tv, Car
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

export default function HotelPublicSite({ company }: Props) {
  const bordeaux = "#6B2D3E";
  const gold = "#C8A951";
  const cream = "#FDF8F0";
  const companyId = company.id;

  const [form, setForm] = useState({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
  const [submitting, setSubmitting] = useState(false);

  const handleBooking = async () => {
    if (!form.name || !form.phone || !form.checkin || !form.checkout) { toast.error("Compila tutti i campi obbligatori"); return; }
    setSubmitting(true);
    try {
      await supabase.from("leads").insert({ company_id: companyId, name: form.name, phone: form.phone, email: form.email, source: "website", notes: `Check-in: ${form.checkin}, Check-out: ${form.checkout}, Ospiti: ${form.guests}, Camera: ${form.room}` });
      toast.success("Richiesta inviata! Riceverai conferma a breve.");
      setForm({ name: "", email: "", phone: "", checkin: "", checkout: "", guests: "2", room: "" });
    } catch { toast.error("Errore, riprova."); }
    setSubmitting(false);
  };

  const name = company.name || "Grand Hotel";
  const tagline = company.tagline || "Ospitalità d'eccellenza";
  const phone = company.phone;
  const whatsapp = phone ? `https://wa.me/${phone.replace(/\D/g, "")}` : "#";

  const rooms = [
    { name: "Camera Superior", price: 149, img: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600", features: ["32 mq", "Vista Giardino", "Balcone"], guests: 2 },
    { name: "Suite Deluxe", price: 249, img: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600", features: ["55 mq", "Vista Mare", "Jacuzzi"], guests: 2, popular: true },
    { name: "Suite Presidenziale", price: 449, img: "https://images.pexels.com/photos/262048/pexels-photo-262048.jpeg?auto=compress&cs=tinysrgb&w=600", features: ["90 mq", "Panoramica", "Terrazza privata"], guests: 4 },
  ];

  return (
    <div style={{ fontFamily: "'Libre Baskerville', serif", background: cream, color: "#2a1f2d" }}>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&family=Lato:wght@300;400;700&display=swap" rel="stylesheet" />

      {/* NAVBAR */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl" style={{ background: `${cream}EE`, borderBottom: `1px solid ${gold}30` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
          <div className="flex items-center gap-3">
            {company.logo_url && <img src={company.logo_url} alt={name} className="h-10 w-10 rounded-full object-cover" />}
            <span className="text-lg sm:text-xl font-bold" style={{ color: bordeaux }}>{name}</span>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {["Camere", "Servizi", "Prenota", "Contatti"].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="text-sm tracking-wider" style={{ color: "#666", fontFamily: "'Lato', sans-serif" }}>{item}</a>
            ))}
          </div>
          <a href="#prenota"><Button className="px-6 py-2 text-sm font-semibold" style={{ background: bordeaux, color: cream, fontFamily: "'Lato', sans-serif" }}>Prenota</Button></a>
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-screen flex items-center">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920)", filter: "brightness(0.35)" }} />
        <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, ${bordeaux}44 0%, #00000088 100%)` }} />
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <div className="flex items-center justify-center gap-1 mb-6">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} className="w-5 h-5" fill={gold} style={{ color: gold }} />)}
            </div>
            <p className="text-sm uppercase tracking-[0.3em] mb-4 opacity-70" style={{ fontFamily: "'Lato', sans-serif", color: gold }}>Benvenuti a</p>
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-bold italic mb-6">{name}</h1>
            <p className="text-lg sm:text-xl opacity-80 mb-10" style={{ fontFamily: "'Lato', sans-serif" }}>{tagline}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="#prenota"><Button className="px-10 py-6 text-lg" style={{ background: `linear-gradient(135deg, ${gold}, #A88B30)`, color: "#1a1a1a", fontFamily: "'Lato', sans-serif" }}>Prenota il Soggiorno</Button></a>
              <a href="#camere"><Button variant="outline" className="px-10 py-6 text-lg" style={{ borderColor: gold, color: gold, fontFamily: "'Lato', sans-serif" }}>Le Nostre Camere</Button></a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CAMERE */}
      <Section id="camere" className="py-20 sm:py-28">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <p className="text-sm uppercase tracking-[0.2em] mb-2" style={{ color: gold, fontFamily: "'Lato', sans-serif" }}>ACCOMODATION</p>
            <h2 className="text-3xl sm:text-5xl font-bold" style={{ color: bordeaux }}>Le Nostre Camere</h2>
          </div>
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {rooms.map((room, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="overflow-hidden group shadow-lg border-0 relative">
                  {room.popular && <Badge className="absolute top-4 right-4 z-10 text-xs" style={{ background: gold, color: "#1a1a1a" }}>Più Richiesta</Badge>}
                  <div className="h-56 overflow-hidden">
                    <img src={room.img} alt={room.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-bold mb-2" style={{ color: bordeaux }}>{room.name}</h3>
                    <div className="flex flex-wrap gap-2 mb-4">
                      {room.features.map(f => <Badge key={f} variant="outline" className="text-xs" style={{ borderColor: `${gold}40`, color: "#666", fontFamily: "'Lato', sans-serif" }}>{f}</Badge>)}
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-500" style={{ fontFamily: "'Lato', sans-serif" }}><Users className="w-4 h-4 inline mr-1" />{room.guests} ospiti</p>
                      <p className="text-2xl font-bold" style={{ color: bordeaux }}>€{room.price}<span className="text-sm font-normal text-gray-400">/notte</span></p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* SERVIZI */}
      <Section id="servizi" className="py-20" style={{ background: `${bordeaux}08` } as any}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-12" style={{ color: bordeaux }}>I Nostri Servizi</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6">
            {[
              { icon: Wifi, label: "Wi-Fi Gratuito" },
              { icon: UtensilsCrossed, label: "Ristorante" },
              { icon: Waves, label: "Spa & Wellness" },
              { icon: Car, label: "Parcheggio" },
              { icon: Coffee, label: "Colazione" },
              { icon: Tv, label: "Room Service" },
            ].map(({ icon: Icon, label }, i) => (
              <motion.div key={i} variants={fadeUp} custom={i} initial="hidden" whileInView="show" viewport={{ once: true }} className="text-center p-4">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: `${gold}20` }}>
                  <Icon className="w-6 h-6" style={{ color: bordeaux }} />
                </div>
                <p className="text-sm font-medium" style={{ fontFamily: "'Lato', sans-serif" }}>{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* PRENOTA */}
      <Section id="prenota" className="py-20 sm:py-28 relative">
        <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url(https://images.pexels.com/photos/1134176/pexels-photo-1134176.jpeg?auto=compress&cs=tinysrgb&w=1920)", filter: "brightness(0.2)" }} />
        <div className="relative z-10 max-w-2xl mx-auto px-6">
          <div className="text-center mb-10 text-white">
            <Calendar className="w-8 h-8 mx-auto mb-4" style={{ color: gold }} />
            <h2 className="text-3xl sm:text-5xl font-bold">Prenota il Soggiorno</h2>
          </div>
          <Card className="p-6 sm:p-8 backdrop-blur-xl" style={{ background: "rgba(10,10,10,0.85)", border: `1px solid ${gold}30` }}>
            <div className="grid sm:grid-cols-2 gap-4" style={{ fontFamily: "'Lato', sans-serif" }}>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Nome *</label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="bg-transparent border-white/20 text-white" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Telefono *</label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="bg-transparent border-white/20 text-white" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Check-in *</label><Input type="date" value={form.checkin} onChange={e => setForm({ ...form, checkin: e.target.value })} className="bg-transparent border-white/20 text-white" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Check-out *</label><Input type="date" value={form.checkout} onChange={e => setForm({ ...form, checkout: e.target.value })} className="bg-transparent border-white/20 text-white" /></div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Ospiti</label>
                <select value={form.guests} onChange={e => setForm({ ...form, guests: e.target.value })} className="w-full h-10 px-3 rounded-md bg-transparent border border-white/20 text-white text-sm">
                  {[1,2,3,4,5,6].map(n => <option key={n} value={n} className="bg-black">{n}</option>)}
                </select>
              </div>
              <div><label className="text-xs uppercase tracking-widest mb-1 block" style={{ color: gold }}>Camera</label><Input value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} placeholder="Es: Suite Deluxe" className="bg-transparent border-white/20 text-white" /></div>
            </div>
            <Button onClick={handleBooking} disabled={submitting} className="w-full mt-6 py-6 text-lg font-semibold" style={{ background: `linear-gradient(135deg, ${gold}, #A88B30)`, color: "#1a1a1a" }}>
              {submitting ? "Invio..." : "Richiedi Disponibilità"}
            </Button>
          </Card>
        </div>
      </Section>

      {/* FOOTER */}
      <footer className="py-10 border-t" style={{ borderColor: `${gold}20`, background: bordeaux }}>
        <div className="max-w-6xl mx-auto px-6 text-center" style={{ fontFamily: "'Lato', sans-serif" }}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-white/60 text-xs">
            <p>© {new Date().getFullYear()} {name}. Tutti i diritti riservati.</p>
            <div className="flex gap-4"><a href="/privacy">Privacy</a><a href="/cookie-policy">Cookie</a><span>Powered by Empire</span></div>
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
