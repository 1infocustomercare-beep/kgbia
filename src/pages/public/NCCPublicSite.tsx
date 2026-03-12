import { useState, useRef, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";
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
  Wifi, Snowflake, MessageCircle, Sparkles, Heart, Menu, X,
  Tv, Coffee, Baby, Waves, UtensilsCrossed, Camera, Compass
} from "lucide-react";
import heroMercedes from "@/assets/ncc-hero-mercedes-new.png";
import destPompei from "@/assets/ncc-dest-pompei-new.png";
import destCostiera from "@/assets/ncc-costiera-aerial.jpg";
import destCapri from "@/assets/ncc-dest-sorrento.png";
import videoNccHero from "@/assets/video-ncc-hero.mp4";
import fleetShowcase from "@/assets/ncc-fleet-showcase.jpg";
import boatCapri from "@/assets/ncc-boat-capri.jpg";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

interface Props { company: any; }

/* ── Animated Section ── */
function Section({ id, children, className = "", style }: { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <section id={id} ref={ref} className={className} style={style}>
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

/* ── Animated Number ── */
function AnimatedNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  if (isInView && display === 0 && value > 0) {
    let start = 0;
    const dur = 1800;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      setDisplay(Math.floor(p * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── Fleet Carousel (infinite scroll like Telese) ── */
function FleetCarousel({ vehicles, gold }: { vehicles: any[]; gold: string }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 10);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  };

  useEffect(() => { checkScroll(); }, [vehicles]);

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({ left: dir * 380, behavior: "smooth" });
    setTimeout(checkScroll, 400);
  };

  // Fallback images by category
  const fallbackImages: Record<string, string> = {
    sedan: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&h=400&fit=crop",
    luxury: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    van: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop",
    minibus: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop",
    bus: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
    suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
  };

  const getImage = (v: any) => {
    if (v.image_url) return v.image_url;
    const cat = (v.category || "sedan").toLowerCase();
    return fallbackImages[cat] || fallbackImages.sedan;
  };

  const getFeatures = (v: any) => {
    const feats = v.features || [];
    if (feats.length > 0) return feats;
    // Default features based on category
    const cat = (v.category || "sedan").toLowerCase();
    if (cat === "luxury") return ["Pelle", "Clima", "WiFi", "Massaggio", "Champagne"];
    if (cat === "van") return ["Pelle", "Clima", "WiFi", "TV", "Acqua"];
    if (cat === "bus" || cat === "minibus") return ["Clima", "WiFi", "TV", "WC", "Bagagliaio"];
    if (cat === "suv") return ["Pelle", "Clima", "WiFi", "4x4", "Acqua"];
    return ["Pelle", "Clima", "WiFi", "Acqua"];
  };

  // Double the vehicles for infinite feel
  const displayVehicles = [...vehicles, ...vehicles];

  return (
    <div className="relative">
      {/* Navigation arrows */}
      {canScrollLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all" style={{ background: "rgba(10,10,20,0.8)" }}>
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}
      {canScrollRight && (
        <button onClick={() => scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-xl border border-white/10 hover:border-white/30 transition-all" style={{ background: "rgba(10,10,20,0.8)" }}>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {displayVehicles.map((v: any, i: number) => {
          const features = getFeatures(v);
          return (
            <div key={`${v.id}-${i}`} className="flex-shrink-0 w-[340px] snap-start">
              <Card className="border-white/5 overflow-hidden h-full hover:border-white/15 transition-all duration-500 group relative" style={{ background: "rgba(255,255,255,0.02)" }}>
                {v.is_popular && (
                  <div className="absolute top-3 right-3 z-10">
                    <Badge className="text-[10px] font-bold border" style={{ background: `${gold}20`, color: gold, borderColor: `${gold}40` }}>
                      ✦ Più Richiesto
                    </Badge>
                  </div>
                )}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img src={getImage(v)} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent opacity-60" />
                  {/* Capacity overlay */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs text-white/70">
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.5)" }}>
                      <Users className="w-3.5 h-3.5" /> {v.min_pax || 1}-{v.max_pax || v.capacity}
                    </span>
                    {v.luggage_capacity > 0 && (
                      <span className="flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.5)" }}>
                        <Luggage className="w-3.5 h-3.5" /> {v.luggage_capacity}
                      </span>
                    )}
                    <span className="flex items-center gap-1 px-2 py-1 rounded-md backdrop-blur-xl" style={{ background: "rgba(0,0,0,0.5)" }}>
                      <Wifi className="w-3.5 h-3.5" /> 5G
                    </span>
                  </div>
                </div>
                <CardContent className="p-5">
                  <p className="text-[10px] uppercase tracking-wider text-white/25 mb-0.5">{v.category || "Berlina"}</p>
                  <h3 className="font-bold text-lg text-white mb-1">{v.name}</h3>
                  {(v.brand || v.model) && (
                    <p className="text-xs text-white/35 mb-3">{v.brand} {v.model} {v.year ? `• ${v.year}` : ""}</p>
                  )}

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
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Review Carousel ── */
function ReviewCarousel({ reviews, gold, avgRating, companyName }: { reviews: any[]; gold: string; avgRating: string; companyName: string }) {
  const [current, setCurrent] = useState(0);
  const avatars = [
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=face",
  ];
  const cities = ["Roma", "Milano", "Napoli", "Firenze", "Torino", "Bologna"];
  const months = ["Gennaio 2024", "Dicembre 2023", "Novembre 2023", "Ottobre 2023", "Settembre 2023", "Agosto 2023"];

  // Auto-advance
  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

  // Show 3 at a time on desktop
  const visibleCount = 3;
  const getVisible = () => {
    const result = [];
    for (let i = 0; i < Math.min(visibleCount, reviews.length); i++) {
      result.push(reviews[(current + i) % reviews.length]);
    }
    return result;
  };

  return (
    <div>
      {/* Rating summary */}
      <div className="flex items-center justify-center gap-3 mb-10">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(s => <Star key={s} className={`w-6 h-6 ${s <= Math.round(parseFloat(avgRating)) ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
        </div>
        <span className="text-2xl font-black" style={{ color: gold }}>{avgRating}</span>
        <span className="text-white/25 text-sm">({reviews.length} recensioni)</span>
      </div>

      {/* Cards */}
      <div className="relative">
        <div className="grid sm:grid-cols-3 gap-4">
          <AnimatePresence mode="popLayout">
            {getVisible().map((r: any, i: number) => (
              <motion.div
                key={`${r.id}-${current}`}
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ delay: i * 0.05, duration: 0.4 }}
              >
                <Card className="border-white/5 h-full" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
                    </div>
                    {r.comment && <p className="text-sm text-white/50 mb-5 line-clamp-4 leading-relaxed italic">"{r.comment}"</p>}
                    <div className="flex items-center gap-3 pt-3 border-t border-white/5">
                      <img src={avatars[(current + i) % avatars.length]} alt="" className="w-10 h-10 rounded-full object-cover" />
                      <div>
                        <p className="text-sm text-white font-semibold">{r.customer_name || "Ospite"}</p>
                        <p className="text-[11px] text-white/25">{cities[(current + i) % cities.length]} · {months[(current + i) % months.length]}</p>
                      </div>
                    </div>
                    {r.admin_reply && (
                      <div className="mt-4 pt-3 border-t border-white/5">
                        <p className="text-xs text-white/30 italic">"{r.admin_reply}"</p>
                        <p className="text-[10px] text-white/15 mt-1">— {companyName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Carousel controls */}
        {reviews.length > visibleCount && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button onClick={() => setCurrent(p => (p - 1 + reviews.length) % reviews.length)} className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors">
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <div className="flex gap-1.5">
              {reviews.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition-all ${i === current ? "w-6" : ""}`} style={{ background: i === current ? gold : "rgba(255,255,255,0.15)" }} />
              ))}
            </div>
            <button onClick={() => setCurrent(p => (p + 1) % reviews.length)} className="w-9 h-9 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 transition-colors">
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>
        )}
      </div>
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
    { label: "Pompei & Vesuvio", icon: Compass },
    { label: "Capri & Ischia", icon: Waves },
    { label: "Roma & Napoli", icon: Globe },
  ];

  const whyUsServices = [
    { icon: Plane, title: "Transfer Aeroportuali", desc: "Servizio puntuale da e per tutti gli aeroporti della Campania: Napoli, Roma Fiumicino, Roma Ciampino." },
    { icon: Train, title: "Transfer Stazione", desc: "Collegamenti con le principali stazioni ferroviarie: Napoli Centrale, Roma Termini, Alta Velocità." },
    { icon: Navigation, title: "Tour Privati", desc: "Scopri la Costiera Amalfitana, Pompei, il Vesuvio, Capri e tutte le meraviglie della Campania." },
    { icon: Car, title: "Noleggio Bus", desc: "Pullman e minibus per gruppi, gite scolastiche, viaggi organizzati e trasferimenti di gruppo." },
    { icon: Heart, title: "Eventi Speciali", desc: "Matrimoni, cerimonie, eventi aziendali e occasioni speciali con veicoli di lusso." },
    { icon: Shield, title: "Servizio NCC", desc: "Noleggio con conducente professionale per ogni esigenza di trasporto personalizzato." },
  ];

  const stats = [
    { value: 10, suffix: "+", label: "Anni di Esperienza" },
    { numValue: parseFloat(avgRating), suffix: "", label: "Valutazione Media", isDecimal: true },
    { value: vehicles.reduce((max: number, v: any) => Math.max(max, v.capacity || 0), 0), suffix: "+", label: "Posti Disponibili" },
    { value: vehicles.length, suffix: "", label: "Sempre Disponibili", fraction: `${vehicles.length}/7` },
  ];

  const featuredDestinations = [
    { name: "Pompei & Napoli", image: destPompei },
    { name: "Costiera Amalfitana", image: destCostiera },
    { name: "Sorrento & Capri", image: destCapri },
  ];

  // Boat tour highlights (matching Telese reference)
  const boatHighlights: Record<string, string[]> = {
    capri: ["Grotta Azzurra", "Faraglioni", "Marina Piccola", "Bagno in mare"],
    nerano: ["Baia di Ieranto", "Snorkeling", "Pranzo tipico", "Acque cristalline"],
    positano: ["Vista panoramica", "Spiaggia Grande", "Li Galli", "Aperitivo al tramonto"],
    amalfi: ["Duomo di Amalfi", "Grotta dello Smeraldo", "Costa Divina", "Limoncello tasting"],
    ischia: ["Terme naturali", "Castello Aragonese", "Giardini La Mortella", "Spiagge vulcaniche"],
  };

  const getBoatHighlights = (name: string) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(boatHighlights)) {
      if (key.includes(k)) return v;
    }
    return ["Tour esclusivo", "Bagno in mare", "Guida esperta", "Pranzo incluso"];
  };

  const boatImages: Record<string, string> = {
    capri: "https://images.unsplash.com/photo-1515859005217-8a1f08870f59?w=600&h=400&fit=crop",
    nerano: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=400&fit=crop",
    positano: "https://images.unsplash.com/photo-1516483638261-f4dbaf036963?w=600&h=400&fit=crop",
    amalfi: "https://images.unsplash.com/photo-1612698093158-e07ac200d44e?w=600&h=400&fit=crop",
    ischia: "https://images.unsplash.com/photo-1551524559-8af4e6624178?w=600&h=400&fit=crop",
  };

  const getBoatImage = (d: any) => {
    if (d.image_url) return d.image_url;
    const key = d.name.toLowerCase();
    for (const [k, v] of Object.entries(boatImages)) {
      if (key.includes(k)) return v;
    }
    return "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop";
  };

  const navLinks = [
    { href: "#servizi", label: "Servizi" },
    { href: "#flotta", label: "Flotta" },
    ...(destinations.length > 0 ? [{ href: "#tour", label: "Tour Barca" }] : []),
    { href: "#recensioni", label: "Recensioni" },
    { href: "#contatti", label: "Contatti" },
  ];

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
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {company.phone && (
              <Button variant="ghost" size="sm" className="hidden sm:flex gap-1.5 text-white/60 hover:text-white border border-white/10 rounded-xl" asChild>
                <a href={`tel:${company.phone}`}>
                  <Phone className="w-4 h-4" />
                  <span className="text-xs font-semibold">CHIAMA ORA</span>
                </a>
              </Button>
            )}
            <button className="md:hidden p-2 rounded-lg hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden border-t"
              style={{ borderColor: "rgba(255,255,255,0.05)", background: "rgba(10,10,20,0.95)" }}
            >
              <div className="px-4 py-4 space-y-3">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-2 text-sm text-white/60 hover:text-white transition-colors">{l.label}</a>
                ))}
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-2 py-2 text-sm" style={{ color: gold }}>
                    <Phone className="w-4 h-4" /> {company.phone}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100vh] flex items-center pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <img src={heroMercedes} alt="NCC Premium Transfer" className="absolute inset-0 w-full h-full object-cover opacity-40" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a14] via-[#0a0a14]/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-[#0a0a14]/30" />
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-xs uppercase tracking-[0.3em] font-semibold mb-6" style={{ color: gold }}>
              {company.name}
            </motion.p>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.02]" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white block">LUXURY</span>
              <span style={{ color: gold }} className="block">NCC TRANSPORT</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-white/45 mb-8 max-w-md leading-relaxed">
              Servizio NCC privato nel Sud Italia. Transfer aeroportuali, tour esclusivi e noleggio con conducente.
              {company.city && ` Base: ${company.city}.`}
            </motion.p>

            <motion.div variants={fadeUp} custom={3}>
              <Button size="lg" className="rounded-xl font-bold text-sm px-10 h-14 shadow-2xl" style={{ background: gold, color: "#0a0a14", boxShadow: `0 20px 40px -10px ${gold}40` }} asChild>
                <a href="#prenota">Prenota Ora</a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="hidden lg:block"
          >
            <div className="relative rounded-2xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: `${gold}30` }}>
              <img src={heroMercedes} alt={`${company.name} Mercedes`} className="aspect-[4/3] w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14]/60 via-transparent to-transparent" />
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

      {/* ═══════════ FEATURED DESTINATIONS ═══════════ */}
      <Section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Destinazioni Popolari" title="LE NOSTRE Destinazioni" gold />
          <div className="grid sm:grid-cols-3 gap-6">
            {featuredDestinations.map((dest, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <a href="#prenota" className="group block relative rounded-2xl overflow-hidden aspect-[4/3] border border-white/5 hover:border-white/20 transition-all">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-[#0a0a14]/20 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <h3 className="font-bold text-xl text-white mb-2">{dest.name}</h3>
                    <span className="inline-flex items-center gap-1 text-sm font-semibold" style={{ color: gold }}>
                      Prenota <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <Section className="py-16 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <p className="text-3xl sm:text-4xl font-black mb-1" style={{ color: gold }}>
                  {s.fraction ? s.fraction : s.isDecimal ? avgRating : <AnimatedNum value={s.value!} suffix={s.suffix} />}
                </p>
                <p className="text-xs text-white/30 uppercase tracking-wider">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ SERVICES ═══════════ */}
      <Section id="servizi" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="I Nostri Servizi" title="SOLUZIONI DI TRASPORTO Premium" subtitle="Offriamo una gamma completa di servizi di trasporto di lusso, personalizzati per soddisfare ogni tua esigenza." gold />

          {/* Services grid - 2 rows of 3, with hover animation */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {whyUsServices.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                <Card className="border-white/5 h-full hover:border-white/10 transition-all duration-500 group" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ background: `${gold}15` }}>
                      <item.icon className="w-5 h-5" style={{ color: gold }} />
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-white/35 leading-relaxed">{item.desc}</p>
                    <p className="mt-3 text-xs font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: gold }}>
                      Scopri di più <ArrowRight className="w-3 h-3" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ FLEET CAROUSEL ═══════════ */}
      {vehicles.length > 0 && (
        <Section id="flotta" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="La Nostra Flotta" title="VEICOLI DI Lusso" subtitle="Scegli il veicolo più adatto alle tue esigenze. Tutti i nostri mezzi sono di ultima generazione e perfettamente mantenuti." gold />
            <FleetCarousel vehicles={vehicles} gold={gold} />
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
            <SectionHeader eyebrow="Esperienze in Mare" title="TOUR PRIVATI in Barca" subtitle="Scopri le meraviglie del Golfo di Napoli e della Costiera Amalfitana con i nostri tour esclusivi in barca privata." gold />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d: any, i: number) => {
                const price = boatPrices.find((bp: any) => bp.destination_id === d.id);
                const highlights = getBoatHighlights(d.name);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}>
                    <Card className="border-white/5 overflow-hidden h-full hover:border-white/15 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <div className="aspect-[4/3] overflow-hidden relative">
                        <img src={getBoatImage(d)} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute top-3 left-3">
                          <Badge className="text-[10px] bg-white/20 backdrop-blur-xl text-white border-0">
                            {d.is_featured ? "Giornata intera" : "Mezza giornata"}
                          </Badge>
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a14] via-transparent to-transparent" />
                      </div>
                      <CardContent className="p-5">
                        <p className="text-[10px] uppercase tracking-wider text-white/25 mb-1">Destinazione</p>
                        <h3 className="font-bold text-xl text-white mb-2">{d.name}</h3>
                        {d.description && <p className="text-sm text-white/35 line-clamp-2 mb-3 leading-relaxed">{d.description}</p>}
                        
                        {/* Highlights - matching Telese reference */}
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {highlights.map((h, hi) => (
                            <span key={hi} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: `${gold}10`, color: `${gold}CC` }}>
                              {h}
                            </span>
                          ))}
                        </div>
                        
                        {price && Number(price.standard_price) > 0 ? (
                          <div className="flex items-center justify-between pt-3 border-t border-white/5">
                            <div>
                              <span className="text-xl font-black" style={{ color: gold }}>€{Number(price.standard_price).toFixed(0)}</span>
                              <span className="text-xs text-white/25 ml-1">/ persona</span>
                            </div>
                            <Button size="sm" className="rounded-lg text-xs font-bold h-8 px-4" style={{ background: gold, color: "#0a0a14" }} asChild>
                              <a href="#prenota">Prenota Tour</a>
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" className="w-full rounded-lg text-xs font-bold h-9 mt-2" style={{ background: gold, color: "#0a0a14" }} asChild>
                            <a href="#prenota">Prenota Tour</a>
                          </Button>
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

      {/* ═══════════ CROSS-SELLING EXTRAS ═══════════ */}
      {crossSells.length > 0 && (
        <Section className="py-16 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader eyebrow="Servizi Aggiuntivi" title="PERSONALIZZA IL TUO Viaggio" gold />
            <div className="grid sm:grid-cols-2 gap-4">
              {crossSells.map((cs: any, i: number) => (
                <motion.div key={cs.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/5" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-2xl">{cs.icon_emoji || "🎁"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{cs.title}</p>
                      {cs.description && <p className="text-xs text-white/30 line-clamp-1">{cs.description}</p>}
                    </div>
                    {cs.is_free ? (
                      <Badge className="text-[10px] bg-green-500/10 text-green-400 border-green-500/30">Gratis</Badge>
                    ) : cs.price > 0 ? (
                      <span className="text-sm font-bold" style={{ color: gold }}>€{cs.price}</span>
                    ) : null}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ REVIEWS ═══════════ */}
      {reviews.length > 0 && (
        <Section id="recensioni" className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="Recensioni" title="COSA DICONO I Clienti" subtitle="La soddisfazione dei nostri clienti è la nostra priorità. Ecco alcune delle loro esperienze." gold />
            <ReviewCarousel reviews={reviews} gold={gold} avgRating={avgRating} companyName={company.name} />
          </div>
        </Section>
      )}

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <Section className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Perché Sceglierci" title="L'Eccellenza nel Trasporto" subtitle="Da oltre 10 anni offriamo servizi di trasporto di altissima qualità in tutta la Campania. La nostra missione è trasformare ogni viaggio in un'esperienza indimenticabile." gold />

          <div className="grid sm:grid-cols-2 gap-6">
            {[
              { icon: Shield, title: "Sicurezza Garantita", desc: "Tutti i nostri veicoli sono regolarmente revisionati e assicurati. Autisti professionisti con anni di esperienza." },
              { icon: Clock, title: "Puntualità Svizzera", desc: "Monitoriamo i voli e i treni in tempo reale. Non dovrai mai aspettare, saremo sempre pronti ad accoglierti." },
              { icon: Award, title: "Qualità Premium", desc: "Flotta di veicoli di lusso di ultima generazione. Comfort e eleganza per ogni tipo di viaggio." },
              { icon: Headphones, title: "Servizio Personalizzato", desc: "Ogni cliente è unico. Personalizziamo ogni servizio in base alle tue esigenze specifiche." },
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
              <div>
                <Label className="text-white/40 text-xs">Nome e Cognome *</Label>
                <Input value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="Mario Rossi" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/40 text-xs">Email *</Label>
                  <Input value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="email@esempio.it" />
                </div>
                <div>
                  <Label className="text-white/40 text-xs">Telefono *</Label>
                  <Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/5 border-white/10 text-white mt-1 h-11" placeholder="+39..." />
                </div>
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
                {routes.length > 0 && (
                  <div>
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
                  </div>
                )}
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

              {/* Second vehicle selector (like Telese has duplicate) */}
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
          <SectionHeader eyebrow="Contattaci" title="Prenota il Tuo Viaggio" subtitle="Siamo disponibili 24 ore su 24, 7 giorni su 7. Contattaci per un preventivo gratuito o per prenotare il tuo prossimo transfer." gold />

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

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 mt-10">
            {company.phone && (
              <Button size="lg" className="rounded-xl font-bold px-8 h-12" style={{ background: gold, color: "#0a0a14" }} asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama Ora</a>
              </Button>
            )}
            {settings?.whatsapp && (
              <Button size="lg" variant="outline" className="rounded-xl font-bold px-8 h-12 border-white/10 text-white hover:bg-white/5" asChild>
                <a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
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
                  <a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-white/10 transition-colors" style={{ background: "rgba(255,255,255,0.05)" }}>
                    <MessageCircle className="w-4 h-4 text-white/50" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-center pt-6 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <p className="text-xs text-white/15">© {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.</p>
            <p className="text-[10px] text-white/10 mt-1">Powered by Empire AI</p>
          </div>
        </div>
      </footer>

      {/* ═══════════ WHATSAPP FLOATING BUTTON ═══════════ */}
      {settings?.whatsapp && (
        <a
          href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
          style={{ background: "#25D366", boxShadow: "0 8px 24px rgba(37,211,102,0.4)" }}
          aria-label="WhatsApp"
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </a>
      )}

      {/* Marquee CSS */}
      <style>{`
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 30s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
      `}</style>
    </div>
  );
}
