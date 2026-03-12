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
  Car, MapPin, Star, Phone, Mail, Shield, Clock, Users,
  Calendar, ArrowRight, CheckCircle, Award, Navigation,
  Headphones, Globe, Send, ChevronDown, Anchor, Instagram,
  Luggage, Plane, Train, Ship
} from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Props { company: any; }

export default function NCCPublicSite({ company }: Props) {
  const companyId = company.id;
  const primaryColor = company.primary_color || "#2563EB";
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", route: "", pickup: "", dropoff: "", date: "", time: "", passengers: "1", luggage: "1", flight: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [activeSection, setActiveSection] = useState("");

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
      const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", companyId).eq("is_public", true).order("created_at", { ascending: false }).limit(8);
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
      route_id: bookingForm.route || null,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore nell'invio"); return; }
    toast.success("Prenotazione inviata! Ti contatteremo a breve.");
    setBookingForm({ name: "", phone: "", email: "", route: "", pickup: "", dropoff: "", date: "", time: "", passengers: "1", luggage: "1", flight: "", notes: "" });
  };

  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const socialLinks = company.social_links as Record<string, string> | null;

  const services = [
    { label: "Transfer Aeroporto", icon: "✈️" },
    { label: "Tour Costiera", icon: "🏖️" },
    { label: "Viaggi Business", icon: "💼" },
    { label: "Eventi & Cerimonie", icon: "🎉" },
    { label: "Servizio H24", icon: "🌙" },
    { label: "Tour in Barca", icon: "⛵" },
    { label: "Transfer Porto", icon: "🚢" },
    { label: "Escursioni Pompei", icon: "🏛️" },
  ];

  const whyUs = [
    { icon: Shield, title: "Sicurezza Garantita", desc: "Veicoli revisionati, assicurazione completa e autisti certificati NCC" },
    { icon: Clock, title: "Puntualità Assoluta", desc: "Monitoraggio voli in tempo reale, arrivo con 15 min di anticipo" },
    { icon: Award, title: "Flotta Premium", desc: "Solo veicoli Mercedes di ultima generazione con massimo comfort" },
    { icon: Headphones, title: "Assistenza H24", desc: "Supporto clienti 7/7, 24h — rispondiamo in meno di 5 minuti" },
    { icon: Globe, title: "Multilingue", desc: "Autisti che parlano italiano, inglese e altre lingue europee" },
    { icon: Navigation, title: "Prezzo Fisso", desc: "Nessun sovrapprezzo per traffico, pedaggi o attese fino a 30 min" },
  ];

  return (
    <div className="min-h-screen bg-[#0a0a14] text-white overflow-x-hidden">
      {/* ═══ NAVBAR ═══ */}
      <nav className="fixed top-0 w-full z-50 bg-[#0a0a14]/90 backdrop-blur-xl border-b border-white/5">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url && <img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" />}
            <span className="font-bold text-base md:text-lg truncate">{company.name}</span>
          </div>
          <div className="hidden md:flex gap-6 text-sm text-white/60">
            <a href="#servizi" className="hover:text-white transition-colors">Servizi</a>
            <a href="#flotta" className="hover:text-white transition-colors">Flotta</a>
            <a href="#tratte" className="hover:text-white transition-colors">Tratte</a>
            {destinations.length > 0 && <a href="#tour" className="hover:text-white transition-colors">Tour Barca</a>}
            <a href="#recensioni" className="hover:text-white transition-colors">Recensioni</a>
          </div>
          <div className="flex items-center gap-2">
            {company.phone && (
              <Button variant="ghost" size="sm" className="text-white/60 hover:text-white hidden sm:flex" asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4" /></a>
              </Button>
            )}
            <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold" asChild>
              <a href="#prenota">Prenota Ora</a>
            </Button>
          </div>
        </div>
      </nav>

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-[90vh] flex items-center pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-950/60 via-[#0a0a14] to-[#0a0a14]" />
          <div className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full bg-indigo-600/8 blur-[100px]" />
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }} />
        </div>

        <motion.div initial="hidden" animate="show" variants={stagger} className="relative z-10 max-w-3xl mx-auto w-full text-center">
          <motion.div variants={fadeUp} custom={0} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-300 text-sm font-medium mb-8">
            <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            {avgRating} stelle — {reviews.length > 0 ? `${reviews.length}+ recensioni verificate` : "Eccellenza nel servizio"}
          </motion.div>

          <motion.h1 variants={fadeUp} custom={1} className="text-4xl sm:text-5xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05]">
            <span className="bg-gradient-to-r from-white via-white to-blue-200 bg-clip-text text-transparent">
              {company.tagline || "Il tuo viaggio, la nostra eccellenza"}
            </span>
          </motion.h1>

          <motion.p variants={fadeUp} custom={2} className="text-lg sm:text-xl text-white/50 mb-10 max-w-2xl mx-auto leading-relaxed">
            Servizio NCC premium con <strong className="text-white/80">{company.name}</strong>.
            Transfer aeroporto, tour in Costiera Amalfitana, escursioni in barca.
            {company.city && ` Base: ${company.city}.`}
          </motion.p>

          <motion.div variants={fadeUp} custom={3} className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl px-10 h-14 text-base shadow-2xl shadow-blue-600/30" asChild>
              <a href="#prenota"><Calendar className="w-5 h-5 mr-2" /> Prenota Transfer</a>
            </Button>
            {company.phone && (
              <Button size="lg" variant="outline" className="rounded-xl px-8 h-14 text-base border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> {company.phone}</a>
              </Button>
            )}
          </motion.div>

          <motion.div variants={fadeUp} custom={4} className="flex flex-wrap justify-center gap-6 mt-12 text-sm text-white/40">
            <span className="flex items-center gap-1.5"><Shield className="w-4 h-4 text-blue-400" /> NCC Autorizzato</span>
            <span className="flex items-center gap-1.5"><Clock className="w-4 h-4 text-blue-400" /> Disponibile {settings?.hours || "06:00-23:00"}</span>
            <span className="flex items-center gap-1.5"><CheckCircle className="w-4 h-4 text-blue-400" /> Prezzo Fisso Garantito</span>
          </motion.div>
        </motion.div>

        <motion.div animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 2 }} className="absolute bottom-6 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/20" />
        </motion.div>
      </section>

      {/* ═══ SERVICES MARQUEE ═══ */}
      <section id="servizi" className="py-6 border-y border-white/5 overflow-hidden">
        <div className="flex animate-marquee gap-4">
          {[...services, ...services, ...services].map((s, i) => (
            <div key={i} className="flex items-center gap-2 whitespace-nowrap px-5 py-2.5 rounded-full bg-white/[0.03] border border-white/5 text-sm flex-shrink-0 font-medium text-white/70">
              <span className="text-lg">{s.icon}</span><span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ WHY US ═══ */}
      <section className="py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="text-center mb-12">
            <motion.h2 variants={fadeUp} custom={0} className="text-3xl sm:text-4xl font-bold mb-3">Perché Scegliere Noi</motion.h2>
            <motion.p variants={fadeUp} custom={1} className="text-white/40 max-w-lg mx-auto">Un servizio pensato per chi non accetta compromessi</motion.p>
          </motion.div>
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUs.map((item, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-white/5 bg-white/[0.02] h-full hover:bg-white/[0.04] hover:border-blue-500/20 transition-all duration-500 group">
                  <CardContent className="p-5">
                    <div className="w-11 h-11 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3 group-hover:bg-blue-500/15 transition-colors">
                      <item.icon className="w-5 h-5 text-blue-400" />
                    </div>
                    <h3 className="font-bold text-white mb-1">{item.title}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{item.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ FLEET ═══ */}
      {vehicles.length > 0 && (
        <section id="flotta" className="py-20 px-4 border-t border-white/5">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">La Nostra Flotta</h2>
              <p className="text-white/40">{vehicles.length} veicoli premium per ogni esigenza di viaggio</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {vehicles.map((v: any, i: number) => (
                <motion.div key={v.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-white/5 bg-white/[0.02] overflow-hidden h-full hover:border-blue-500/20 transition-all duration-500 group">
                    {v.image_url ? (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    ) : (
                      <div className="aspect-[16/10] bg-gradient-to-br from-blue-950/30 to-blue-900/10 flex items-center justify-center">
                        <Car className="w-12 h-12 text-blue-500/20" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="font-bold text-sm">{v.name}</h3>
                        {v.is_popular && <Badge className="bg-yellow-500/15 text-yellow-400 border-yellow-500/20 text-[10px]">⭐ Top</Badge>}
                      </div>
                      <p className="text-xs text-white/40 mb-3">{v.brand} {v.model} {v.year && `• ${v.year}`}</p>
                      <div className="flex items-center gap-3 text-xs text-white/50">
                        <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" /> {v.min_pax || 1}-{v.max_pax || v.capacity} pax</span>
                        {v.luggage_capacity > 0 && <span className="flex items-center gap-1"><Luggage className="w-3.5 h-3.5" /> {v.luggage_capacity}</span>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ ROUTES & PRICES ═══ */}
      {routes.length > 0 && (
        <section id="tratte" className="py-20 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Tratte & Tariffe</h2>
              <p className="text-white/40">Prezzi fissi e trasparenti, nessun sovrapprezzo</p>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {routes.map((r: any, i: number) => {
                const isAirport = r.origin?.toLowerCase().includes("aeroporto") || r.origin?.toLowerCase().includes("fiumicino");
                const isStation = r.origin?.toLowerCase().includes("stazione");
                const TypeIcon = isAirport ? Plane : isStation ? Train : MapPin;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -10 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.03 }}>
                    <Card className="border-white/5 bg-white/[0.02] hover:border-blue-500/15 transition-all group">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <TypeIcon className="w-4 h-4 text-blue-400" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{r.origin}</p>
                            <div className="flex items-center gap-1 my-0.5">
                              <ArrowRight className="w-3 h-3 text-white/20" />
                              <p className="text-sm text-white/70 truncate">{r.destination}</p>
                            </div>
                            <div className="flex gap-3 text-xs text-white/30 mt-1">
                              {r.distance_km && <span>{r.distance_km} km</span>}
                              {r.duration_min && <span>{Math.floor(r.duration_min / 60)}h{r.duration_min % 60 > 0 ? `${r.duration_min % 60}min` : ""}</span>}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-lg font-bold text-blue-400">€{Number(r.base_price).toFixed(0)}</p>
                            <p className="text-[10px] text-white/25">da</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ BOAT TOURS ═══ */}
      {destinations.length > 0 && (
        <section id="tour" className="py-20 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-sm mb-4">
                <Anchor className="w-4 h-4" /> Tour in Barca
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Escursioni in Barca</h2>
              <p className="text-white/40">Scopri le meraviglie della Costiera dal mare</p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {destinations.map((d: any, i: number) => {
                const price = boatPrices.find((bp: any) => bp.destination_id === d.id);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Card className="border-white/5 bg-white/[0.02] overflow-hidden h-full hover:border-cyan-500/20 transition-all group">
                      {d.image_url ? (
                        <div className="aspect-square overflow-hidden">
                          <img src={d.image_url} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                      ) : (
                        <div className="aspect-square bg-gradient-to-br from-cyan-950/30 to-blue-950/20 flex items-center justify-center">
                          <Ship className="w-12 h-12 text-cyan-500/20" />
                        </div>
                      )}
                      <CardContent className="p-4">
                        <h3 className="font-bold text-base mb-1">{d.name}</h3>
                        {d.description && <p className="text-xs text-white/40 line-clamp-2 mb-3">{d.description}</p>}
                        {price && Number(price.standard_price) > 0 && (
                          <p className="text-lg font-bold text-cyan-400">€{Number(price.standard_price).toFixed(0)} <span className="text-xs text-white/30 font-normal">/ persona</span></p>
                        )}
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ═══ REVIEWS ═══ */}
      {reviews.length > 0 && (
        <section id="recensioni" className="py-20 px-4 border-t border-white/5">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-3">Cosa Dicono i Nostri Clienti</h2>
              <div className="flex items-center justify-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= Math.round(parseFloat(avgRating)) ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`} />)}
                </div>
                <span className="text-white/60 font-semibold">{avgRating}</span>
                <span className="text-white/30 text-sm">({reviews.length} recensioni)</span>
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r: any) => (
                <Card key={r.id} className="border-white/5 bg-white/[0.02]">
                  <CardContent className="p-5">
                    <div className="flex gap-0.5 mb-3">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-yellow-400 text-yellow-400" : "text-white/10"}`} />)}
                    </div>
                    {r.comment && <p className="text-sm text-white/60 mb-3 line-clamp-4 leading-relaxed">{r.comment}</p>}
                    <p className="text-xs text-white/30 font-medium">— {r.customer_name || "Ospite"}</p>
                    {r.admin_reply && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <p className="text-xs text-blue-300/60 italic">"{r.admin_reply}"</p>
                        <p className="text-[10px] text-white/20 mt-1">— {company.name}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

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
                    <p className="text-sm text-white/50 leading-relaxed">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ BOOKING FORM ═══ */}
      <section id="prenota" className="py-20 px-4 border-t border-white/5 relative">
        <div className="absolute inset-0 bg-gradient-to-t from-blue-950/20 to-transparent pointer-events-none" />
        <div className="max-w-xl mx-auto relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold mb-2">Prenota il tuo Transfer</h2>
            <p className="text-white/40">Compila il form e ti contatteremo entro pochi minuti</p>
          </div>
          <Card className="border-white/10 bg-white/[0.03] backdrop-blur-xl">
            <CardContent className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/50 text-xs">Nome *</Label>
                  <Input value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="Mario Rossi" />
                </div>
                <div>
                  <Label className="text-white/50 text-xs">Telefono *</Label>
                  <Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="+39..." />
                </div>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Email</Label>
                <Input value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="email@esempio.it" />
              </div>
              {routes.length > 0 && (
                <div>
                  <Label className="text-white/50 text-xs">Tratta</Label>
                  <Select value={bookingForm.route} onValueChange={v => setBookingForm(p => ({ ...p, route: v }))}>
                    <SelectTrigger className="bg-white/5 border-white/10 text-white mt-1 h-11"><SelectValue placeholder="Seleziona tratta" /></SelectTrigger>
                    <SelectContent>
                      {routes.map((r: any) => (
                        <SelectItem key={r.id} value={r.id}>{r.origin} → {r.destination} (€{Number(r.base_price).toFixed(0)})</SelectItem>
                      ))}
                      <SelectItem value="custom">📍 Tratta personalizzata</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              {bookingForm.route === "custom" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/50 text-xs">Partenza</Label>
                    <Input value={bookingForm.pickup} onChange={e => setBookingForm(p => ({ ...p, pickup: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="Indirizzo partenza" />
                  </div>
                  <div>
                    <Label className="text-white/50 text-xs">Arrivo</Label>
                    <Input value={bookingForm.dropoff} onChange={e => setBookingForm(p => ({ ...p, dropoff: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="Indirizzo arrivo" />
                  </div>
                </div>
              )}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/50 text-xs">Data *</Label>
                  <Input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
                </div>
                <div>
                  <Label className="text-white/50 text-xs">Ora</Label>
                  <Input type="time" value={bookingForm.time} onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <Label className="text-white/50 text-xs">Passeggeri</Label>
                  <Input type="number" min="1" max="50" value={bookingForm.passengers} onChange={e => setBookingForm(p => ({ ...p, passengers: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
                </div>
                <div>
                  <Label className="text-white/50 text-xs">Bagagli</Label>
                  <Input type="number" min="0" max="50" value={bookingForm.luggage} onChange={e => setBookingForm(p => ({ ...p, luggage: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" />
                </div>
                <div>
                  <Label className="text-white/50 text-xs">N° Volo/Treno</Label>
                  <Input value={bookingForm.flight} onChange={e => setBookingForm(p => ({ ...p, flight: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11 text-base" placeholder="FR1234" />
                </div>
              </div>
              <div>
                <Label className="text-white/50 text-xs">Note</Label>
                <Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 min-h-[80px] text-base" placeholder="Es: Hotel sul lungomare, bambino 3 anni..." />
              </div>
              <Button onClick={handleBooking} disabled={submitting} className="w-full h-13 text-base font-bold rounded-xl bg-blue-600 hover:bg-blue-700 text-white shadow-2xl shadow-blue-600/30">
                {submitting ? "Invio in corso..." : "Invia Prenotazione"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/25 text-center">Ti risponderemo in meno di 30 minuti. Prezzo definitivo dopo conferma.</p>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-10 px-4 border-t border-white/5">
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                {company.logo_url && <img src={company.logo_url} alt="" className="h-8 w-8 rounded-lg object-cover" />}
                <span className="font-bold">{company.name}</span>
              </div>
              <p className="text-sm text-white/30 leading-relaxed">{company.tagline || "Servizio NCC premium per transfer e tour"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-white/60">Contatti</h4>
              <div className="space-y-2 text-sm text-white/40">
                {company.phone && <a href={`tel:${company.phone}`} className="flex items-center gap-2 hover:text-white/60"><Phone className="w-3.5 h-3.5" /> {company.phone}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-white/60"><Mail className="w-3.5 h-3.5" /> {company.email}</a>}
                {company.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {company.address}{company.city ? `, ${company.city}` : ""}</p>}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-3 text-white/60">Social</h4>
              <div className="flex gap-3">
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Instagram className="w-4 h-4 text-white/60" />
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${settings.whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
                    <Phone className="w-4 h-4 text-white/60" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-white/20">
            <p>© {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.</p>
            <p>Powered by Empire Platform</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
