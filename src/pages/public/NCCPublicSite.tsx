import { useState, useRef } from "react";
import { motion, useInView } from "framer-motion";
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
  Car, MapPin, Star, Phone, Mail, Shield, Clock, Users,
  Calendar, ArrowRight, CheckCircle, Award, Navigation,
  Headphones, Globe, Send, ChevronDown, Anchor, Instagram,
  Luggage, Plane, Train, Ship, ChevronLeft, ChevronRight,
  Wifi, Snowflake, MessageCircle, Sparkles, Heart
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Props { company: any; }

/* ── Animated Section ── */
function Section({ id, children, className = "" }: { id?: string; children: React.ReactNode; className?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={className}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      >
        {children}
      </motion.div>
    </section>
  );
}

/* ── Section Header ── */
function SectionHeader({ eyebrow, title, subtitle, gold = false }: { eyebrow?: string; title: string; subtitle?: string; gold?: boolean }) {
  return (
    <div className="text-center mb-12">
      {eyebrow && (
        <p className={`text-xs uppercase tracking-[0.25em] font-semibold mb-3 ${gold ? "text-amber-400" : "text-white/30"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-3">
        <span className="text-white">{title.split(" ").slice(0, -1).join(" ")} </span>
        <span className={gold ? "text-amber-400" : "text-white"}>{title.split(" ").at(-1)}</span>
      </h2>
      {subtitle && <p className="text-white/40 max-w-lg mx-auto text-sm sm:text-base">{subtitle}</p>}
    </div>
  );
}

export default function NCCPublicSite({ company }: Props) {
  const companyId = company.id;
  const gold = company.primary_color || "#D4A017";
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", route: "", vehicle: "", pickup: "", dropoff: "", date: "", time: "", passengers: "1", luggage: "1", flight: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // ── Data Queries ──
  const { data: vehicles = [] } = useQuery({
    queryKey: ["ncc-pub-vehicles", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("company_id", companyId).eq("is_active", true).order("capacity");
      return data || [];
    },
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["ncc-pub-routes", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("*").eq("company_id", companyId).eq("is_active", true).order("base_price");
      return data || [];
    },
  });

  const { data: destinations = [] } = useQuery({
    queryKey: ["ncc-pub-dest", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_destinations").select("*").eq("company_id", companyId);
      return data || [];
    },
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["ncc-pub-reviews", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", companyId).eq("is_public", true).order("created_at", { ascending: false }).limit(10);
      return data || [];
    },
  });

  const { data: boatPrices = [] } = useQuery({
    queryKey: ["ncc-pub-boat", companyId],
    queryFn: async () => {
      const destIds = destinations.map((d: any) => d.id);
      if (!destIds.length) return [];
      const { data } = await supabase.from("boat_prices").select("*").in("destination_id", destIds);
      return data || [];
    },
    enabled: destinations.length > 0,
  });

  const { data: settings } = useQuery({
    queryKey: ["ncc-pub-settings", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("company_settings").select("*").eq("company_id", companyId).maybeSingle();
      return data;
    },
  });

  const { data: faqs = [] } = useQuery({
    queryKey: ["ncc-pub-faq", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("faq_items").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  const { data: crossSells = [] } = useQuery({
    queryKey: ["ncc-pub-extras", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("cross_sells").select("*").eq("company_id", companyId).eq("is_active", true).order("sort_order");
      return data || [];
    },
  });

  // ── Handlers ──
  const handleBooking = async () => {
    if (!bookingForm.name || !bookingForm.phone || !bookingForm.date) {
      toast.error("Compila nome, telefono e data");
      return;
    }
    setSubmitting(true);
    const selectedRoute = routes.find((r: any) => r.id === bookingForm.route);
    const { error } = await supabase.from("ncc_bookings").insert({
      company_id: companyId,
      customer_name: bookingForm.name,
      customer_phone: bookingForm.phone,
      customer_email: bookingForm.email || null,
      pickup_address: bookingForm.pickup || selectedRoute?.origin || "Da definire",
      dropoff_address: bookingForm.dropoff || selectedRoute?.destination || "Da definire",
      pickup_datetime: `${bookingForm.date}T${bookingForm.time || "09:00"}:00`,
      passengers: parseInt(bookingForm.passengers) || 1,
      luggage: parseInt(bookingForm.luggage) || 0,
      flight_code: bookingForm.flight || null,
      notes: bookingForm.notes || null,
      route_id: bookingForm.route && bookingForm.route !== "custom" ? bookingForm.route : null,
      vehicle_id: bookingForm.vehicle || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nell'invio"); return; }
    toast.success("Prenotazione inviata! Ti contatteremo a breve.");
    setBookingForm({ name: "", phone: "", email: "", route: "", vehicle: "", pickup: "", dropoff: "", date: "", time: "", passengers: "1", luggage: "1", flight: "", notes: "" });
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const socialLinks = company.social_links as Record<string, string> | null;

  const services = [
    { label: "Transfer Aeroportuali", icon: Plane },
    { label: "Transfer Stazione", icon: Train },
    { label: "Tour Privati", icon: Navigation },
    { label: "Noleggio Bus", icon: Car },
    { label: "Eventi Speciali", icon: Heart },
    { label: "Servizio NCC", icon: Shield },
    { label: "Costiera Amalfitana", icon: MapPin },
    { label: "Tour in Barca", icon: Anchor },
  ];

  const whyUs = [
    { icon: Shield, title: "Sicurezza Garantita", desc: "Veicoli revisionati, assicurazione completa e autisti certificati NCC." },
    { icon: Clock, title: "Puntualità Assoluta", desc: "Monitoraggio voli in tempo reale. Saremo sempre pronti ad accoglierti." },
    { icon: Award, title: "Flotta Premium", desc: "Solo veicoli di ultima generazione con massimo comfort e pulizia." },
    { icon: Headphones, title: "Assistenza H24", desc: "Supporto clienti 7/7, 24h — rispondiamo in meno di 5 minuti." },
    { icon: Globe, title: "Multilingue", desc: "Autisti che parlano italiano, inglese e altre lingue europee." },
    { icon: Navigation, title: "Prezzo Fisso", desc: "Nessun sovrapprezzo per traffico, pedaggi o attese." },
  ];

  const stats = [
    { value: "10+", label: "Anni di Esperienza" },
    { value: avgRating, label: "Valutazione Media" },
    { value: `${vehicles.reduce((max: number, v: any) => Math.max(max, v.capacity || 0), 0)}+`, label: "Posti Disponibili" },
    { value: `${vehicles.length}`, label: "Veicoli Attivi" },
  ];

  // Vehicle features parser
  const getVehicleFeatures = (v: any) => {
    const feats = v.features || [];
    const defaults = ["Clima", "WiFi"];
    return feats.length > 0 ? feats : defaults;
  };

  return (
    <div className="min-h-screen text-white overflow-x-hidden" style={{ background: "#0a0a14" }}>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-xl border-b" style={{ background: "rgba(10,10,20,0.88)", borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url && <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" />}
            <div className="min-w-0">
              <span className="font-bold text-base truncate block">{company.name}</span>
              {company.tagline && <span className="text-[10px] tracking-[0.15em] uppercase block" style={{ color: gold }}>PREMIUM TRANSFER</span>}
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-sm text-white/50">
            <a href="#servizi" className="hover:text-white transition-colors">Servizi</a>
            <a href="#flotta" className="hover:text-white transition-colors">Flotta</a>
            {destinations.length > 0 && <a href="#tour" className="hover:text-white transition-colors">Tour Barca</a>}
            <a href="#recensioni" className="hover:text-white transition-colors">Recensioni</a>
            <a href="#contatti" className="hover:text-white transition-colors">Contatti</a>
          </div>

          <div className="flex items-center gap-2">
            {company.phone && (
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-white/60 hover:text-white" asChild>
                <a href={`tel:${company.phone}`}>
                  <Phone className="w-4 h-4" />
                  <span className="text-xs">CHIAMA ORA</span>
                </a>
              </Button>
            )}
            <Button size="sm" className="rounded-xl font-bold text-xs px-5 h-9" style={{ background: gold, color: "#0a0a14" }} asChild>
              <a href="#prenota">PRENOTA ORA</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100vh] flex items-center pt-16 px-4 overflow-hidden">
        {/* Background elements */}
        <div className="absolute inset-0">
          <div className="absolute inset-0" style={{ background: `radial-gradient(ellipse at 70% 50%, rgba(${parseInt(gold.slice(1,3),16)}, ${parseInt(gold.slice(3,5),16)}, ${parseInt(gold.slice(5,7),16)}, 0.06) 0%, transparent 60%)` }} />
          <div className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full blur-[150px] opacity-10" style={{ background: gold }} />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full blur-[120px] opacity-5" style={{ background: gold }} />
          {/* Subtle grid */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.3em] font-semibold mb-6" style={{ color: gold }}>
              {company.name}
            </motion.p>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.02]" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white block">LUXURY</span>
              <span style={{ color: gold }} className="block">NCC TRANSPORT</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-white/45 mb-8 max-w-md leading-relaxed">
              Servizio NCC privato. Transfer aeroportuali, tour esclusivi e noleggio con conducente.
              {company.city && ` Base: ${company.city}.`}
            </motion.p>

            <motion.div variants={fadeUp} custom={3}>
              <Button size="lg" className="rounded-xl font-bold text-sm px-10 h-14 shadow-2xl" style={{ background: gold, color: "#0a0a14", boxShadow: `0 20px 40px -10px ${gold}40` }} asChild>
                <a href="#prenota">PRENOTA ORA</a>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right - Hero image placeholder with golden border */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: `${gold}30` }}>
              <div className="aspect-[4/3] bg-gradient-to-br from-amber-900/20 to-transparent flex items-center justify-center">
                <Car className="w-24 h-24 text-white/10" />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/15" />
        </motion.div>
      </section>

      {/* ═══════════ SERVICES MARQUEE ═══════════ */}
      <section className="py-5 border-y overflow-hidden" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="flex animate-marquee gap-4">
          {[...services, ...services, ...services, ...services].map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 rounded-full border text-sm flex-shrink-0 font-medium text-white/60"
              style={{ background: "rgba(255,255,255,0.02)", borderColor: "rgba(255,255,255,0.05)" }}>
              <s.icon className="w-4 h-4" style={{ color: gold }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <Section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <p className="text-3xl sm:text-4xl font-black mb-1" style={{ color: gold }}>{s.value}</p>
                <p className="text-xs text-white/30 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ SERVICES ═══════════ */}
      <Section id="servizi" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="I Nostri Servizi" title="SOLUZIONI DI TRASPORTO Premium" subtitle="Una gamma completa di servizi di trasporto di lusso, personalizzati per ogni esigenza." gold />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card className="border-white/5 h-full hover:border-white/10 transition-all duration-500 group" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: `${gold}15` }}>
                      <item.icon className="w-5 h-5" style={{ color: gold }} />
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ FLEET ═══════════ */}
      {vehicles.length > 0 && (
        <Section id="flotta" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="La Nostra Flotta" title="VEICOLI DI Lusso" subtitle="Scegli il veicolo più adatto. Tutti i nostri mezzi sono di ultima generazione." gold />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {vehicles.map((v: any, i: number) => {
                const features = getVehicleFeatures(v);
                return (
                  <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                    <Card className="border-white/5 overflow-hidden h-full hover:border-white/15 transition-all duration-500 group relative" style={{ background: "rgba(255,255,255,0.02)" }}>
                      {v.is_popular && (
                        <div className="absolute top-3 right-3 z-10">
                          <Badge className="text-[10px] font-bold border" style={{ background: `${gold}20`, color: gold, borderColor: `${gold}40` }}>
                            ✦ Più Richiesto
                          </Badge>
                        </div>
                      )}
                      {v.image_url ? (
                        <div className="aspect-[16/10] overflow-hidden">
                          <img src={v.image_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        </div>
                      ) : (
                        <div className="aspect-[16/10] flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${gold}08, transparent)` }}>
                          <Car className="w-16 h-16 text-white/8" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        {/* Capacity + Luggage + WiFi indicators */}
                        <div className="flex items-center gap-3 text-xs text-white/40 mb-3">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {v.min_pax || 1}-{v.max_pax || v.capacity}</span>
                          {v.luggage_capacity > 0 && <span className="flex items-center gap-1"><Luggage className="w-3.5 h-3.5" /> {v.luggage_capacity}</span>}
                          <span className="flex items-center gap-1"><Wifi className="w-3.5 h-3.5" /> 5G</span>
                        </div>

                        <p className="text-[10px] uppercase tracking-wider text-white/25 mb-0.5">{v.category || "Berlina"}</p>
                        <h3 className="font-bold text-lg text-white mb-1">{v.name}</h3>
                        <p className="text-xs text-white/35 mb-3">{v.brand} {v.model} {v.year ? `• ${v.year}` : ""}</p>

                        {/* Feature badges */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {features.slice(0, 5).map((f: string, fi: number) => (
                            <span key={fi} className="px-2 py-0.5 rounded-md text-[10px] font-medium text-white/50" style={{ background: "rgba(255,255,255,0.04)" }}>
                              {f}
                            </span>
                          ))}
                        </div>

                        {/* Price + CTA */}
                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                          <div>
                            <span className="text-xs text-white/25">A partire da</span>
                            <span className="text-xl font-black ml-1" style={{ color: gold }}>€{Number(v.base_price || 80).toFixed(0)}</span>
                          </div>
                          <Button size="sm" className="rounded-lg text-xs font-bold h-8 px-4" style={{ background: gold, color: "#0a0a14" }} asChild>
                            <a href="#prenota">Prenota Ora</a>
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ ROUTES & PRICES ═══════════ */}
      {routes.length > 0 && (
        <Section id="tratte" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader eyebrow="Tratte & Tariffe" title="PREZZI FISSI Trasparenti" subtitle="Nessun sovrapprezzo. Il prezzo concordato è quello finale." gold />

            <div className="grid sm:grid-cols-2 gap-3">
              {routes.map((r: any, i: number) => {
                const isAirport = r.origin?.toLowerCase().includes("aeroporto") || r.origin?.toLowerCase().includes("fiumicino");
                const isStation = r.origin?.toLowerCase().includes("stazione");
                const TypeIcon = isAirport ? Plane : isStation ? Train : MapPin;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                    <Card className="border-white/5 hover:border-white/10 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: `${gold}12` }}>
                            <TypeIcon className="w-4 h-4" style={{ color: gold }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{r.origin}</p>
                            <div className="flex items-center gap-1 my-0.5">
                              <ArrowRight className="w-3 h-3 text-white/15" />
                              <p className="text-sm text-white/60 truncate">{r.destination}</p>
                            </div>
                            <div className="flex gap-3 text-xs text-white/25 mt-1">
                              {r.distance_km && <span>{r.distance_km} km</span>}
                              {r.duration_min && <span>{Math.floor(r.duration_min / 60)}h{r.duration_min % 60 > 0 ? `${r.duration_min % 60}m` : ""}</span>}
                              {r.transport_type && (
                                <Badge variant="outline" className="text-[9px] border-white/10 text-white/30 h-4 px-1.5">{r.transport_type}</Badge>
                              )}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-black" style={{ color: gold }}>€{Number(r.base_price).toFixed(0)}</p>
                            <p className="text-[10px] text-white/20">da</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ BOAT TOURS ═══════════ */}
      {destinations.length > 0 && (
        <Section id="tour" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="Esperienze in Mare" title="TOUR PRIVATI in Barca" subtitle="Scopri le meraviglie del Golfo di Napoli e della Costiera Amalfitana." gold />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d: any, i: number) => {
                const price = boatPrices.find((bp: any) => bp.destination_id === d.id);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Card className="border-white/5 overflow-hidden h-full hover:border-white/15 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                      {d.image_url ? (
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img src={d.image_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                          <div className="absolute top-3 left-3">
                            <Badge className="text-[10px] bg-white/20 backdrop-blur-xl text-white border-0">
                              {d.is_featured ? "Giornata intera" : "Mezza giornata"}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
                        </div>
                      ) : (
                        <div className="aspect-[4/3] flex items-center justify-center" style={{ background: `linear-gradient(135deg, rgba(6,182,212,0.08), transparent)` }}>
                          <Ship className="w-16 h-16 text-cyan-500/15" />
                        </div>
                      )}
                      <CardContent className="p-5">
                        <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Destinazione</p>
                        <h3 className="font-bold text-xl text-white mb-2">{d.name}</h3>
                        {d.description && <p className="text-sm text-white/35 line-clamp-2 mb-4 leading-relaxed">{d.description}</p>}
                        
                        {price && Number(price.standard_price) > 0 && (
                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div>
                              <span className="text-xl font-black" style={{ color: gold }}>€{Number(price.standard_price).toFixed(0)}</span>
                              <span className="text-xs text-white/25 ml-1">/ persona</span>
                            </div>
                            <Button size="sm" className="rounded-lg text-xs font-bold h-8 px-4" style={{ background: gold, color: "#0a0a14" }} asChild>
                              <a href="#prenota">Prenota Tour</a>
                            </Button>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ REVIEWS ═══════════ */}
      {reviews.length > 0 && (
        <Section id="recensioni" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="Recensioni" title="COSA DICONO I Clienti" subtitle="La soddisfazione dei nostri clienti è la nostra priorità." gold />

            <div className="flex items-center justify-center gap-3 mb-10">
              <div className="flex gap-0.5">
                {[1,2,3,4,5].map(s => <Star key={s} className={`w-6 h-6 ${s <= Math.round(parseFloat(avgRating)) ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
              </div>
              <span className="text-2xl font-black" style={{ color: gold }}>{avgRating}</span>
              <span className="text-white/25 text-sm">({reviews.length} recensioni)</span>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.slice(0, 6).map((r: any) => (
                <Card key={r.id} className="border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <CardContent className="p-5">
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
                    </div>
                    {r.comment && <p className="text-sm text-white/50 mb-4 line-clamp-4 leading-relaxed italic">"{r.comment}"</p>}
                    <p className="text-xs text-white/25 font-semibold">— {r.customer_name || "Ospite"}</p>
                    {r.admin_reply && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-white/30 italic">"{r.admin_reply}"</p>
                        <p className="text-[10px] text-white/15 mt-1">— {company.name}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <Section className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Perché Sceglierci" title="L'Eccellenza nel Trasporto" subtitle="La nostra missione è trasformare ogni viaggio in un'esperienza indimenticabile." gold />

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: "Sicurezza Garantita", desc: "Tutti i nostri veicoli sono regolarmente revisionati e assicurati. Autisti professionisti con anni di esperienza." },
              { icon: Clock, title: "Puntualità Svizzera", desc: "Monitoriamo i voli e i treni in tempo reale. Non dovrai mai aspettare." },
              { icon: Award, title: "Qualità Premium", desc: "Flotta di veicoli di lusso di ultima generazione. Comfort e eleganza per ogni viaggio." },
              { icon: Headphones, title: "Servizio Personalizzato", desc: "Ogni cliente è unico. Personalizziamo ogni servizio in base alle tue esigenze." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
                className="flex gap-4 p-5 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${gold}12` }}>
                  <item.icon className="w-5 h-5" style={{ color: gold }} />
                </div>
                <div>
                  <h3 className="font-bold text-white mb-1">{item.title}</h3>
                  <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Big stat */}
          <div className="text-center mt-12">
            <p className="text-4xl font-black" style={{ color: gold }}>5000+</p>
            <p className="text-sm text-white/30 mt-1">Clienti Soddisfatti</p>
          </div>
        </div>
      </Section>

      {/* ═══════════ FAQ ═══════════ */}
      {faqs.length > 0 && (
        <Section className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-3xl mx-auto">
            <SectionHeader title="Domande Frequenti" gold />
            <div className="space-y-3">
              {faqs.map((faq: any) => (
                <Card key={faq.id} className="border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <CardContent className="p-5">
                    <h3 className="font-bold text-white mb-2">{faq.question}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ BOOKING FORM ═══════════ */}
      <Section id="prenota" className="py-20 px-4 border-t relative" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center bottom, ${gold}08, transparent 60%)` }} />
        <div className="max-w-xl mx-auto relative z-10">
          <SectionHeader eyebrow="Prenota ora" title="RICHIEDI UNA Prenotazione" gold />

          <Card className="border-white/10 backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.03)" }}>
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/40 text-xs">Nome e Cognome *</Label>
                  <Input value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Mario Rossi" />
                </div>
                <div>
                  <Label className="text-white/40 text-xs">Email *</Label>
                  <Input value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="email@esempio.it" />
                </div>
              </div>
              <div>
                <Label className="text-white/40 text-xs">Telefono *</Label>
                <Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="+39..." />
              </div>

              {/* Vehicle selector */}
              {vehicles.length > 0 && (
                <div>
                  <Label className="text-white/40 text-xs">Veicolo</Label>
                  <Select value={bookingForm.vehicle} onValueChange={v => setBookingForm(p => ({ ...p, vehicle: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue placeholder="Seleziona veicolo" /></SelectTrigger>
                    <SelectContent>
                      {vehicles.map((v: any) => (
                        <SelectItem key={v.id} value={v.id}>{v.name} ({v.min_pax || 1}-{v.max_pax || v.capacity} pax)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/40 text-xs">Passeggeri</Label>
                  <Input type="number" min="1" max="50" value={bookingForm.passengers} onChange={e => setBookingForm(p => ({ ...p, passengers: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" />
                </div>
                <div>
                  {routes.length > 0 && (
                    <>
                      <Label className="text-white/40 text-xs">Tratta</Label>
                      <Select value={bookingForm.route} onValueChange={v => setBookingForm(p => ({ ...p, route: v }))}>
                        <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue placeholder="Seleziona tratta" /></SelectTrigger>
                        <SelectContent>
                          {routes.map((r: any) => (
                            <SelectItem key={r.id} value={r.id}>{r.origin} → {r.destination}</SelectItem>
                          ))}
                          <SelectItem value="custom">📍 Tratta personalizzata</SelectItem>
                        </SelectContent>
                      </Select>
                    </>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/40 text-xs">Data *</Label>
                  <Input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" />
                </div>
                <div>
                  <Label className="text-white/40 text-xs">Orario *</Label>
                  <Input type="time" value={bookingForm.time} onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" />
                </div>
              </div>

              {bookingForm.route === "custom" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/40 text-xs">Partenza</Label>
                    <Input value={bookingForm.pickup} onChange={e => setBookingForm(p => ({ ...p, pickup: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Indirizzo partenza" />
                  </div>
                  <div>
                    <Label className="text-white/40 text-xs">Arrivo</Label>
                    <Input value={bookingForm.dropoff} onChange={e => setBookingForm(p => ({ ...p, dropoff: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Indirizzo arrivo" />
                  </div>
                </div>
              )}

              <div>
                <Label className="text-white/40 text-xs">Note aggiuntive</Label>
                <Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px]" placeholder="Richieste speciali, seggiolini, soste..." />
              </div>

              <Button onClick={handleBooking} disabled={submitting} className="w-full h-13 text-base font-bold rounded-xl shadow-2xl" style={{ background: gold, color: "#0a0a14", boxShadow: `0 20px 40px -10px ${gold}30` }}>
                {submitting ? "Invio in corso..." : "Invia Prenotazione"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/20 text-center">Ti risponderemo entro pochi minuti. Prezzo definitivo dopo conferma.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ═══════════ CONTACT ═══════════ */}
      <Section id="contatti" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Contattaci" title="Prenota il Tuo Viaggio" subtitle="Siamo disponibili 24/7. Contattaci per un preventivo gratuito." gold />

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: "Telefono", value: company.phone, href: company.phone ? `tel:${company.phone}` : null },
              { icon: Mail, label: "Email", value: company.email, href: company.email ? `mailto:${company.email}` : null },
              { icon: MapPin, label: "Sede", value: `${company.address || ""}${company.city ? `, ${company.city}` : ""}`, href: null },
            ].map((c, i) => (
              <div key={i} className="text-center p-6 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: `${gold}12` }}>
                  <c.icon className="w-5 h-5" style={{ color: gold }} />
                </div>
                <p className="text-xs text-white/30 mb-1">{c.label}</p>
                {c.href ? (
                  <a href={c.href} className="text-sm font-semibold text-white hover:underline">{c.value}</a>
                ) : (
                  <p className="text-sm font-semibold text-white">{c.value || "—"}</p>
                )}
              </div>
            ))}
          </div>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            {company.phone && (
              <Button size="lg" className="rounded-xl font-bold px-8 h-12" style={{ background: gold, color: "#0a0a14" }} asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama Ora</a>
              </Button>
            )}
            {settings?.whatsapp && (
              <Button size="lg" variant="outline" className="rounded-xl font-bold px-8 h-12 border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Scrivici su WhatsApp
                </a>
              </Button>
            )}
            <Button size="lg" variant="outline" className="rounded-xl font-bold px-8 h-12 border-white/10 text-white hover:bg-white/5" asChild>
              <a href="#prenota">Prenota Online</a>
            </Button>
          </div>
        </div>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-10 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {company.logo_url && <img src={company.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                <span className="font-bold">{company.name}</span>
              </div>
              <p className="text-sm text-white/25 leading-relaxed">{company.tagline || "Servizio NCC premium"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-white/50">Contatti</h4>
              <div className="space-y-2 text-sm text-white/30">
                {company.phone && <a href={`tel:${company.phone}`} className="flex items-center gap-2 hover:text-white/50"><Phone className="w-3.5 h-3.5" /> {company.phone}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-white/50"><Mail className="w-3.5 h-3.5" /> {company.email}</a>}
                {company.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {company.address}{company.city ? `, ${company.city}` : ""}</p>}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-white/50">Social</h4>
              <div className="flex gap-3">
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <Instagram className="w-4 h-4 text-white/50" />
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <MessageCircle className="w-4 h-4 text-white/50" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/15" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p>© {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.</p>
            <p>Powered by Empire Platform</p>
          </div>
        </div>
      </footer>

      {/* ═══════════ FLOATING WHATSAPP ═══════════ */}
      {settings?.whatsapp && (
        <a
          href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-green-500 flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-transform"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      )}
    </div>
  );
}
