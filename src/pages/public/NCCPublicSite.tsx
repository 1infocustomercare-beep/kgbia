import { useState, useRef, useEffect, forwardRef } from "react";
import { motion, useInView, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion";
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
  Tv, Coffee, Baby, Waves, UtensilsCrossed, Camera, Compass, Zap
} from "lucide-react";
import heroMercedes from "@/assets/ncc-hero-mercedes-new.png";
import destPompei from "@/assets/ncc-dest-pompei-new.png";
import destCostiera from "@/assets/ncc-costiera-aerial.jpg";
import destCapri from "@/assets/ncc-dest-sorrento.png";
import videoNccHero from "@/assets/video-ncc-hero.mp4";
import fleetShowcase from "@/assets/ncc-fleet-showcase.jpg";
import boatCapri from "@/assets/ncc-boat-capri.jpg";

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  show: (i: number) => ({ opacity: 1, scale: 1, transition: { delay: i * 0.08, duration: 0.5, type: "spring", stiffness: 100 } }),
};

interface Props { company: any; }

/* ── Animated Section with Parallax ── */
const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, forwardedRef) => {
    const localRef = useRef(null);
    const ref = (forwardedRef as React.RefObject<HTMLElement>) || localRef;
    const isInView = useInView(localRef, { once: true, margin: "-60px" });
    return (
      <section id={id} ref={localRef} className={className} style={style}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
        >
          {children}
        </motion.div>
      </section>
    );
  }
);
Section.displayName = "Section";

/* ── Section Header ── */
function SectionHeader({ eyebrow, title, subtitle, gold = false }: { eyebrow?: string; title: string; subtitle?: string; gold?: boolean }) {
  return (
    <div className="text-center mb-14">
      {eyebrow && (
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4"
          style={{ color: gold ? "var(--ncc-gold)" : "rgba(255,255,255,0.25)" }}
        >
          {eyebrow}
        </motion.p>
      )}
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight mb-4"
        style={{ fontFamily: "'Playfair Display', serif" }}
      >
        <span className="text-white">{title.split(" ").slice(0, -1).join(" ")} </span>
        <span style={{ color: gold ? "var(--ncc-gold)" : "white" }}>{title.split(" ").at(-1)}</span>
      </motion.h2>
      {subtitle && (
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="text-white/35 max-w-xl mx-auto text-sm sm:text-base leading-relaxed"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  );
}

/* ── Animated Number ── */
function AnimatedNum({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    if (!isInView || value <= 0) return;
    let start = 0;
    const dur = 2000;
    const step = (ts: number) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / dur, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(Math.floor(eased * value));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [isInView, value]);
  return <span ref={ref}>{display}{suffix}</span>;
}

/* ── 3D Tilt Card ── */
function TiltCard({ children, className = "", style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useTransform(y, [-100, 100], [5, -5]), { stiffness: 300, damping: 30 });
  const rotateY = useSpring(useTransform(x, [-100, 100], [-5, 5]), { stiffness: 300, damping: 30 });

  return (
    <motion.div
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", ...style }}
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        x.set(e.clientX - rect.left - rect.width / 2);
        y.set(e.clientY - rect.top - rect.height / 2);
      }}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Fleet Carousel ── */
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

  const fallbackImages: Record<string, string> = {
    sedan: "https://images.unsplash.com/photo-1563720360172-67b8f3dce741?w=600&h=400&fit=crop",
    luxury: "https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=600&h=400&fit=crop",
    van: "https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=600&h=400&fit=crop",
    minibus: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=600&h=400&fit=crop",
    bus: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=400&fit=crop",
    suv: "https://images.unsplash.com/photo-1519641471654-76ce0107ad1b?w=600&h=400&fit=crop",
  };

  const getImage = (v: any) => v.image_url || fallbackImages[(v.category || "sedan").toLowerCase()] || fallbackImages.sedan;

  const getFeatures = (v: any) => {
    if (v.features?.length > 0) return v.features;
    const cat = (v.category || "sedan").toLowerCase();
    if (cat === "luxury") return ["Pelle", "Clima", "WiFi", "Massaggio", "Champagne"];
    if (cat === "van") return ["Pelle", "Clima", "WiFi", "TV", "Acqua"];
    if (cat === "bus" || cat === "minibus") return ["Clima", "WiFi", "TV", "WC", "Bagagliaio"];
    if (cat === "suv") return ["Pelle", "Clima", "WiFi", "4x4", "Acqua"];
    return ["Pelle", "Clima", "WiFi", "Acqua"];
  };

  const displayVehicles = [...vehicles, ...vehicles];

  return (
    <div className="relative">
      {canScrollLeft && (
        <button onClick={() => scroll(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/10 hover:border-white/30 hover:scale-110 transition-all" style={{ background: "rgba(10,10,20,0.85)" }}>
          <ChevronLeft className="w-5 h-5 text-white" />
        </button>
      )}
      {canScrollRight && (
        <button onClick={() => scroll(1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center backdrop-blur-2xl border border-white/10 hover:border-white/30 hover:scale-110 transition-all" style={{ background: "rgba(10,10,20,0.85)" }}>
          <ChevronRight className="w-5 h-5 text-white" />
        </button>
      )}

      <div ref={scrollRef} onScroll={checkScroll} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}>
        {displayVehicles.map((v: any, i: number) => {
          const features = getFeatures(v);
          return (
            <motion.div
              key={`${v.id}-${i}`}
              className="flex-shrink-0 w-[350px] snap-start"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: (i % vehicles.length) * 0.05 }}
            >
              <TiltCard>
                <Card className="border-white/[0.06] overflow-hidden h-full hover:border-white/15 transition-all duration-500 group relative" style={{ background: "rgba(255,255,255,0.02)", backdropFilter: "blur(20px)" }}>
                  {v.is_popular && (
                    <div className="absolute top-3 right-3 z-10">
                      <Badge className="text-[10px] font-bold border animate-pulse" style={{ background: `${gold}20`, color: gold, borderColor: `${gold}40` }}>
                        ✦ Più Richiesto
                      </Badge>
                    </div>
                  )}
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <img src={getImage(v)} alt={v.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-transparent to-transparent opacity-70" />
                    <div className="absolute bottom-3 left-3 flex items-center gap-2.5 text-xs text-white/70">
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-2xl" style={{ background: "rgba(0,0,0,0.6)" }}>
                        <Users className="w-3.5 h-3.5" /> {v.min_pax || 1}-{v.max_pax || v.capacity}
                      </span>
                      {v.luggage_capacity > 0 && (
                        <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-2xl" style={{ background: "rgba(0,0,0,0.6)" }}>
                          <Luggage className="w-3.5 h-3.5" /> {v.luggage_capacity}
                        </span>
                      )}
                      <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg backdrop-blur-2xl" style={{ background: "rgba(0,0,0,0.6)" }}>
                        <Wifi className="w-3.5 h-3.5" /> 5G
                      </span>
                    </div>
                  </div>
                  <CardContent className="p-5">
                    <p className="text-[10px] uppercase tracking-wider text-white/20 mb-0.5">{v.category || "Berlina"}</p>
                    <h3 className="font-bold text-lg text-white mb-1">{v.name}</h3>
                    {(v.brand || v.model) && <p className="text-xs text-white/30 mb-3">{v.brand} {v.model} {v.year ? `• ${v.year}` : ""}</p>}
                    <div className="flex flex-wrap gap-1.5 mb-4">
                      {features.slice(0, 5).map((f: string, fi: number) => (
                        <span key={fi} className="px-2 py-0.5 rounded-md text-[10px] font-medium text-white/45" style={{ background: "rgba(255,255,255,0.04)" }}>{f}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                      <div>
                        <span className="text-[10px] text-white/20">A partire da</span>
                        <span className="text-xl font-black ml-1" style={{ color: gold }}>€{Number(v.base_price || 80).toFixed(0)}</span>
                      </div>
                      <Button size="sm" className="rounded-xl text-xs font-bold h-9 px-5 hover:scale-105 transition-transform" style={{ background: gold, color: "#080812" }} asChild>
                        <a href="#prenota">Prenota</a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TiltCard>
            </motion.div>
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

  useEffect(() => {
    if (reviews.length <= 1) return;
    const timer = setInterval(() => setCurrent(p => (p + 1) % reviews.length), 5000);
    return () => clearInterval(timer);
  }, [reviews.length]);

  if (reviews.length === 0) return null;

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
      <div className="flex items-center justify-center gap-4 mb-12">
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(s => <Star key={s} className={`w-7 h-7 ${s <= Math.round(parseFloat(avgRating)) ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
        </div>
        <span className="text-3xl font-black" style={{ color: gold }}>{avgRating}</span>
        <span className="text-white/20 text-sm">({reviews.length} recensioni verificate)</span>
      </div>

      <div className="relative">
        <div className="grid sm:grid-cols-3 gap-5">
          <AnimatePresence mode="popLayout">
            {getVisible().map((r: any, i: number) => (
              <motion.div
                key={`${r.id}-${current}`}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -20, scale: 0.95 }}
                transition={{ delay: i * 0.06, duration: 0.5, type: "spring" }}
              >
                <Card className="border-white/[0.06] h-full backdrop-blur-xl" style={{ background: "rgba(255,255,255,0.025)" }}>
                  <CardContent className="p-6">
                    <div className="flex gap-0.5 mb-4">
                      {[1,2,3,4,5].map(s => <Star key={s} className={`w-4 h-4 ${s <= r.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
                    </div>
                    {r.comment && <p className="text-sm text-white/45 mb-5 line-clamp-4 leading-relaxed italic">"{r.comment}"</p>}
                    <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                      <img src={avatars[(current + i) % avatars.length]} alt="" className="w-10 h-10 rounded-full object-cover ring-2 ring-white/10" />
                      <div>
                        <p className="text-sm text-white font-semibold">{r.customer_name || "Ospite"}</p>
                        <p className="text-[11px] text-white/20">{cities[(current + i) % cities.length]} · {months[(current + i) % months.length]}</p>
                      </div>
                    </div>
                    {r.admin_reply && (
                      <div className="mt-4 pt-3 border-t border-white/[0.06]">
                        <p className="text-xs text-white/25 italic">"{r.admin_reply}"</p>
                        <p className="text-[10px] text-white/10 mt-1">— {companyName}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {reviews.length > visibleCount && (
          <div className="flex items-center justify-center gap-3 mt-8">
            <button onClick={() => setCurrent(p => (p - 1 + reviews.length) % reviews.length)} className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 hover:scale-110 transition-all">
              <ChevronLeft className="w-4 h-4 text-white/50" />
            </button>
            <div className="flex gap-2">
              {reviews.map((_: any, i: number) => (
                <button key={i} onClick={() => setCurrent(i)} className="h-2 rounded-full transition-all duration-300" style={{ width: i === current ? "28px" : "8px", background: i === current ? gold : "rgba(255,255,255,0.12)" }} />
              ))}
            </div>
            <button onClick={() => setCurrent(p => (p + 1) % reviews.length)} className="w-10 h-10 rounded-full flex items-center justify-center border border-white/10 hover:border-white/30 hover:scale-110 transition-all">
              <ChevronRight className="w-4 h-4 text-white/50" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function NCCPublicSite({ company }: Props) {
  const companyId = company.id;
  const gold = company.primary_color || "#D4A017";
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", route: "", vehicle: "", pickup: "", dropoff: "", date: "", time: "", passengers: "1", luggage: "1", flight: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    { icon: Plane, title: "Transfer Aeroportuali", desc: "Servizio puntuale da e per tutti gli aeroporti della Campania: Napoli, Roma Fiumicino, Roma Ciampino.", highlight: "24/7" },
    { icon: Train, title: "Transfer Stazione", desc: "Collegamenti con le principali stazioni ferroviarie: Napoli Centrale, Roma Termini, Alta Velocità.", highlight: "Tracking" },
    { icon: Navigation, title: "Tour Privati", desc: "Scopri la Costiera Amalfitana, Pompei, il Vesuvio, Capri e tutte le meraviglie della Campania.", highlight: "Esclusivo" },
    { icon: Car, title: "Noleggio Bus", desc: "Pullman e minibus per gruppi, gite scolastiche, viaggi organizzati e trasferimenti di gruppo.", highlight: "50+ posti" },
    { icon: Heart, title: "Eventi Speciali", desc: "Matrimoni, cerimonie, eventi aziendali e occasioni speciali con veicoli di lusso.", highlight: "Su misura" },
    { icon: Shield, title: "Servizio NCC", desc: "Noleggio con conducente professionale per ogni esigenza di trasporto personalizzato.", highlight: "Premium" },
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
    capri: boatCapri,
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
    <div className="min-h-screen text-white overflow-x-hidden" style={{ "--ncc-gold": gold, background: "#080812" } as React.CSSProperties}>

      {/* ═══════════ AMBIENT GLOW ORBS ═══════════ */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute top-[20%] -left-[20%] w-[60vw] h-[60vw] rounded-full opacity-[0.03] blur-[120px]" style={{ background: gold }} />
        <div className="absolute bottom-[10%] right-[-15%] w-[50vw] h-[50vw] rounded-full opacity-[0.025] blur-[100px]" style={{ background: gold }} />
      </div>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`} style={{ background: navScrolled ? "rgba(8,8,18,0.92)" : "rgba(8,8,18,0.6)", backdropFilter: "blur(24px) saturate(1.4)", borderBottom: `1px solid rgba(255,255,255,${navScrolled ? "0.06" : "0.02"})` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url && (
              <motion.img
                src={company.logo_url}
                alt=""
                className="h-9 w-9 rounded-xl object-cover ring-1 ring-white/10"
                whileHover={{ scale: 1.1, rotate: 3 }}
                transition={{ type: "spring", stiffness: 400 }}
              />
            )}
            <div className="min-w-0">
              <span className="font-bold text-base tracking-tight truncate block">{company.name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold" style={{ color: gold }}>PREMIUM TRANSFER</span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-[13px] text-white/40 font-medium">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors duration-300 relative group">
                {l.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] group-hover:w-full transition-all duration-300" style={{ background: gold }} />
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {company.phone && (
              <Button size="sm" className="hidden sm:flex gap-2 rounded-xl font-bold text-xs h-10 px-5 border-0 hover:scale-105 transition-transform" style={{ background: gold, color: "#080812" }} asChild>
                <a href={`tel:${company.phone}`}>
                  <Phone className="w-3.5 h-3.5" />
                  CHIAMA ORA
                </a>
              </Button>
            )}
            <button className="md:hidden p-2 rounded-xl hover:bg-white/10 transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden overflow-hidden border-t border-white/[0.04]"
              style={{ background: "rgba(8,8,18,0.97)" }}
            >
              <div className="px-5 py-5 space-y-1">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 hover:text-white transition-colors border-b border-white/[0.04]">{l.label}</a>
                ))}
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-2 py-3 text-sm font-semibold" style={{ color: gold }}>
                    <Phone className="w-4 h-4" /> {company.phone}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════ HERO ═══════════ */}
      <section className="relative min-h-[100svh] flex items-center pt-16 px-4 overflow-hidden">
        <div className="absolute inset-0">
          <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover opacity-25">
            <source src={videoNccHero} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-r from-[#080812] via-[#080812]/85 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-transparent to-[#080812]/40" />
          {/* Cinematic noise overlay */}
          <div className="absolute inset-0 opacity-[0.015]" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }} />
          {/* Grid overlay */}
          <div className="absolute inset-0 opacity-[0.02]" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }} />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-16 items-center">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-[11px] uppercase tracking-[0.35em] font-bold mb-6 flex items-center gap-2" style={{ color: gold }}>
              <span className="w-8 h-px" style={{ background: gold }} />
              {company.name}
            </motion.p>

            <motion.h1 variants={fadeUp} custom={1} className="text-5xl sm:text-6xl lg:text-[5.5rem] font-black tracking-tight mb-7 leading-[0.95]" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white block">LUXURY</span>
              <motion.span
                style={{ color: gold }}
                className="block"
                animate={{ opacity: [0.8, 1, 0.8] }}
                transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
              >
                NCC TRANSPORT
              </motion.span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-base sm:text-lg text-white/40 mb-10 max-w-md leading-relaxed">
              Servizio NCC privato nel Sud Italia. Transfer aeroportuali, tour esclusivi e noleggio con conducente.
              {company.city && ` Base: ${company.city}.`}
            </motion.p>

            <motion.div variants={fadeUp} custom={3} className="flex flex-wrap gap-4">
              <Button size="lg" className="rounded-xl font-bold text-sm px-10 h-14 hover:scale-105 transition-transform" style={{ background: gold, color: "#080812", boxShadow: `0 20px 50px -10px ${gold}40` }} asChild>
                <a href="#prenota">
                  <Sparkles className="w-4 h-4 mr-2" />
                  Prenota Ora
                </a>
              </Button>
              <Button size="lg" variant="outline" className="rounded-xl font-bold text-sm px-8 h-14 border-white/10 text-white/70 hover:bg-white/5 hover:text-white hover:border-white/20 transition-all" asChild>
                <a href="#flotta">Scopri la Flotta</a>
              </Button>
            </motion.div>

            {/* Trust badges */}
            <motion.div variants={fadeUp} custom={4} className="flex items-center gap-6 mt-12 pt-8 border-t border-white/[0.06]">
              {[
                { icon: Shield, label: "Assicurato" },
                { icon: Clock, label: "Disponibile 24/7" },
                { icon: Star, label: `${avgRating} Rating` },
              ].map((b, i) => (
                <div key={i} className="flex items-center gap-2 text-xs text-white/30">
                  <b.icon className="w-4 h-4" style={{ color: `${gold}99` }} />
                  <span>{b.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, x: 60 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="hidden lg:block"
          >
            <div className="relative">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-3xl blur-3xl opacity-20" style={{ background: gold }} />
              <div className="relative rounded-2xl overflow-hidden border-2 shadow-2xl" style={{ borderColor: `${gold}25` }}>
                <img src={heroMercedes} alt={`${company.name} Mercedes`} className="aspect-[4/3] w-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#080812]/70 via-transparent to-transparent" />
              </div>
            </div>
          </motion.div>
        </div>

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }} className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <ChevronDown className="w-5 h-5 text-white/15" />
        </motion.div>
      </section>

      {/* ═══════════ SERVICES MARQUEE ═══════════ */}
      <section className="py-5 border-y overflow-hidden relative" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-y-0 left-0 w-32 z-10" style={{ background: "linear-gradient(to right, #080812, transparent)" }} />
        <div className="absolute inset-y-0 right-0 w-32 z-10" style={{ background: "linear-gradient(to left, #080812, transparent)" }} />
        <div className="flex animate-marquee gap-4">
          {[...services, ...services, ...services, ...services].map((s, i) => (
            <div key={i} className="flex items-center gap-2.5 whitespace-nowrap px-5 py-2.5 rounded-full border text-sm flex-shrink-0 font-medium text-white/50 hover:text-white/70 hover:border-white/15 transition-colors"
              style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.04)" }}>
              <s.icon className="w-4 h-4" style={{ color: gold }} />
              <span>{s.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════════ FEATURED DESTINATIONS ═══════════ */}
      <Section className="py-24 px-4 relative">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="Destinazioni Popolari" title="LE NOSTRE Destinazioni" gold />
          <div className="grid sm:grid-cols-3 gap-6">
            {featuredDestinations.map((dest, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.12, duration: 0.6 }}>
                <a href="#prenota" className="group block relative rounded-2xl overflow-hidden aspect-[3/4] border border-white/[0.06] hover:border-white/20 transition-all duration-500">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-[#080812]/30 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-bold text-2xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{dest.name}</h3>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold group-hover:gap-3 transition-all" style={{ color: gold }}>
                      Prenota <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at bottom, ${gold}10, transparent 60%)` }} />
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ STATS BAR ═══════════ */}
      <Section className="py-20 px-4 border-y relative" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${gold}05, transparent 60%)` }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring", stiffness: 100 }} className="text-center">
                <p className="text-4xl sm:text-5xl font-black mb-2" style={{ color: gold }}>
                  {s.fraction ? s.fraction : s.isDecimal ? avgRating : <AnimatedNum value={s.value!} suffix={s.suffix} />}
                </p>
                <p className="text-xs text-white/25 uppercase tracking-[0.15em] font-medium">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ SERVICES ═══════════ */}
      <Section id="servizi" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader eyebrow="I Nostri Servizi" title="SOLUZIONI DI TRASPORTO Premium" subtitle="Offriamo una gamma completa di servizi di trasporto di lusso, personalizzati per soddisfare ogni tua esigenza." gold />

          {/* Services as horizontal scrolling cards on mobile, grid on desktop */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {whyUsServices.map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.07 }}>
                <Card className="border-white/[0.06] h-full hover:border-white/15 transition-all duration-500 group relative overflow-hidden" style={{ background: "rgba(255,255,255,0.02)" }}>
                  {/* Hover glow */}
                  <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ background: `radial-gradient(circle at top left, ${gold}08, transparent 50%)` }} />
                  <CardContent className="p-6 relative z-10">
                    <div className="flex items-center justify-between mb-4">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center transition-all group-hover:scale-110" style={{ background: `${gold}12` }}>
                        <item.icon className="w-5 h-5" style={{ color: gold }} />
                      </div>
                      <Badge variant="outline" className="text-[9px] font-bold border-white/10 text-white/30">{item.highlight}</Badge>
                    </div>
                    <h3 className="font-bold text-white text-base mb-2">{item.title}</h3>
                    <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
                    <p className="mt-4 text-xs font-semibold inline-flex items-center gap-1 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300" style={{ color: gold }}>
                      Scopri di più <ArrowRight className="w-3 h-3" />
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Infinite scrolling service cards */}
          <div className="mt-8 overflow-hidden relative">
            <div className="absolute inset-y-0 left-0 w-20 z-10" style={{ background: "linear-gradient(to right, #080812, transparent)" }} />
            <div className="absolute inset-y-0 right-0 w-20 z-10" style={{ background: "linear-gradient(to left, #080812, transparent)" }} />
            <div className="flex animate-marquee-slow gap-4">
              {[...whyUsServices, ...whyUsServices, ...whyUsServices, ...whyUsServices].map((item, i) => (
                <div key={i} className="flex items-center gap-3 whitespace-nowrap px-5 py-3 rounded-xl border text-sm flex-shrink-0 text-white/40 hover:text-white/60 transition-colors"
                  style={{ background: "rgba(255,255,255,0.015)", borderColor: "rgba(255,255,255,0.04)" }}>
                  <item.icon className="w-4 h-4 flex-shrink-0" style={{ color: gold }} />
                  <span className="font-medium">{item.title}</span>
                  <span className="text-[10px] px-2 py-0.5 rounded-md" style={{ background: `${gold}12`, color: `${gold}CC` }}>{item.highlight}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════ FLEET CAROUSEL ═══════════ */}
      {vehicles.length > 0 && (
        <Section id="flotta" className="py-24 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-7xl mx-auto">
            <SectionHeader eyebrow="La Nostra Flotta" title="VEICOLI DI Lusso" subtitle="Scegli il veicolo più adatto alle tue esigenze. Tutti i nostri mezzi sono di ultima generazione e perfettamente mantenuti." gold />
            <FleetCarousel vehicles={vehicles} gold={gold} />
          </div>
        </Section>
      )}

      {/* ═══════════ ROUTES & PRICES ═══════════ */}
      {routes.length > 0 && (
        <Section id="tratte" className="py-24 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader eyebrow="Tratte & Tariffe" title="PREZZI FISSI Trasparenti" subtitle="Nessun sovrapprezzo. Il prezzo concordato è quello finale." gold />

            <div className="grid sm:grid-cols-2 gap-3">
              {routes.map((r: any, i: number) => {
                const isAirport = r.origin?.toLowerCase().includes("aeroporto") || r.origin?.toLowerCase().includes("fiumicino");
                const isStation = r.origin?.toLowerCase().includes("stazione");
                const TypeIcon = isAirport ? Plane : isStation ? Train : MapPin;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <Card className="border-white/[0.06] hover:border-white/12 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:scale-110 transition-transform" style={{ background: `${gold}10` }}>
                            <TypeIcon className="w-4 h-4" style={{ color: gold }} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white truncate">{r.origin}</p>
                            <div className="flex items-center gap-1.5 my-1">
                              <ArrowRight className="w-3 h-3 text-white/15 flex-shrink-0" />
                              <p className="text-sm text-white/50 truncate">{r.destination}</p>
                            </div>
                            <div className="flex gap-3 text-xs text-white/20 mt-1">
                              {r.distance_km && <span>{r.distance_km} km</span>}
                              {r.duration_min && <span>{Math.floor(r.duration_min / 60)}h{r.duration_min % 60 > 0 ? `${r.duration_min % 60}m` : ""}</span>}
                              {r.transport_type && <Badge variant="outline" className="text-[9px] border-white/[0.08] text-white/25 h-4 px-1.5">{r.transport_type}</Badge>}
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                            <p className="text-xl font-black" style={{ color: gold }}>€{Number(r.base_price).toFixed(0)}</p>
                            <p className="text-[10px] text-white/15">da</p>
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
        <Section id="tour" className="py-24 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-6xl mx-auto">
            <SectionHeader eyebrow="Esperienze in Mare" title="TOUR PRIVATI in Barca" subtitle="Scopri le meraviglie del Golfo di Napoli e della Costiera Amalfitana con i nostri tour esclusivi in barca privata." gold />

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d: any, i: number) => {
                const price = boatPrices.find((bp: any) => bp.destination_id === d.id);
                const highlights = getBoatHighlights(d.name);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <TiltCard>
                      <Card className="border-white/[0.06] overflow-hidden h-full hover:border-white/15 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img src={getBoatImage(d)} alt={d.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                          <div className="absolute top-3 left-3">
                            <Badge className="text-[10px] bg-white/15 backdrop-blur-2xl text-white border-0 font-semibold">
                              {d.is_featured ? "Giornata intera" : "Mezza giornata"}
                            </Badge>
                          </div>
                          <div className="absolute inset-0 bg-gradient-to-t from-[#080812] via-transparent to-transparent" />
                        </div>
                        <CardContent className="p-5">
                          <p className="text-[10px] uppercase tracking-wider text-white/20 mb-1">Destinazione</p>
                          <h3 className="font-bold text-xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{d.name}</h3>
                          {d.description && <p className="text-sm text-white/30 line-clamp-2 mb-3 leading-relaxed">{d.description}</p>}
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {highlights.map((h, hi) => (
                              <span key={hi} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: `${gold}08`, color: `${gold}BB` }}>{h}</span>
                            ))}
                          </div>
                          {price && Number(price.standard_price) > 0 ? (
                            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
                              <div>
                                <span className="text-xl font-black" style={{ color: gold }}>€{Number(price.standard_price).toFixed(0)}</span>
                                <span className="text-xs text-white/20 ml-1">/ persona</span>
                              </div>
                              <Button size="sm" className="rounded-xl text-xs font-bold h-9 px-5 hover:scale-105 transition-transform" style={{ background: gold, color: "#080812" }} asChild>
                                <a href="#prenota">Prenota Tour</a>
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" className="w-full rounded-xl text-xs font-bold h-9 mt-2 hover:scale-[1.02] transition-transform" style={{ background: gold, color: "#080812" }} asChild>
                              <a href="#prenota">Prenota Tour</a>
                            </Button>
                          )}
                        </CardContent>
                      </Card>
                    </TiltCard>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ CROSS-SELLING EXTRAS ═══════════ */}
      {crossSells.length > 0 && (
        <Section className="py-20 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-4xl mx-auto">
            <SectionHeader eyebrow="Servizi Aggiuntivi" title="PERSONALIZZA IL TUO Viaggio" gold />
            <div className="grid sm:grid-cols-2 gap-4">
              {crossSells.map((cs: any, i: number) => (
                <motion.div key={cs.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div className="flex items-center gap-4 p-4 rounded-xl border border-white/[0.06] hover:border-white/12 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <span className="text-2xl group-hover:scale-110 transition-transform">{cs.icon_emoji || "🎁"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-white text-sm">{cs.title}</p>
                      {cs.description && <p className="text-xs text-white/25 line-clamp-1">{cs.description}</p>}
                    </div>
                    {cs.is_free ? (
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/20">Gratis</Badge>
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
        <Section id="recensioni" className="py-24 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-5xl mx-auto">
            <SectionHeader eyebrow="Recensioni" title="COSA DICONO I Clienti" subtitle="La soddisfazione dei nostri clienti è la nostra priorità. Ecco alcune delle loro esperienze." gold />
            <ReviewCarousel reviews={reviews} gold={gold} avgRating={avgRating} companyName={company.name} />
          </div>
        </Section>
      )}

      {/* ═══════════ WHY CHOOSE US ═══════════ */}
      <Section className="py-24 px-4 border-t relative" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center, ${gold}04, transparent 50%)` }} />
        <div className="max-w-4xl mx-auto relative z-10">
          <SectionHeader eyebrow="Perché Sceglierci" title="L'Eccellenza nel Trasporto" subtitle="Da oltre 10 anni offriamo servizi di trasporto di altissima qualità in tutta la Campania. La nostra missione è trasformare ogni viaggio in un'esperienza indimenticabile." gold />

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Shield, title: "Sicurezza Garantita", desc: "Tutti i nostri veicoli sono regolarmente revisionati e assicurati. Autisti professionisti con anni di esperienza." },
              { icon: Clock, title: "Puntualità Svizzera", desc: "Monitoriamo i voli e i treni in tempo reale. Non dovrai mai aspettare, saremo sempre pronti ad accoglierti." },
              { icon: Award, title: "Qualità Premium", desc: "Flotta di veicoli di lusso di ultima generazione. Comfort e eleganza per ogni tipo di viaggio." },
              { icon: Headphones, title: "Servizio Personalizzato", desc: "Ogni cliente è unico. Personalizziamo ogni servizio in base alle tue esigenze specifiche." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring" }}
                className="flex gap-4 p-6 rounded-2xl border border-white/[0.06] group hover:border-white/12 transition-all relative overflow-hidden" style={{ background: "rgba(255,255,255,0.015)" }}>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: `radial-gradient(circle at top left, ${gold}06, transparent 50%)` }} />
                <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform relative z-10" style={{ background: `${gold}10` }}>
                  <item.icon className="w-5 h-5" style={{ color: gold }} />
                </div>
                <div className="relative z-10">
                  <h3 className="font-bold text-white mb-1.5">{item.title}</h3>
                  <p className="text-sm text-white/30 leading-relaxed">{item.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="text-center mt-14"
          >
            <p className="text-5xl font-black" style={{ color: gold }}>5000+</p>
            <p className="text-sm text-white/25 mt-2 tracking-wide">Clienti Soddisfatti</p>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════ FAQ ═══════════ */}
      {faqs.length > 0 && (
        <Section className="py-24 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
          <div className="max-w-3xl mx-auto">
            <SectionHeader title="Domande Frequenti" gold />
            <div className="space-y-3">
              {faqs.map((faq: any, i: number) => (
                <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <Card className="border-white/[0.06] hover:border-white/10 transition-all" style={{ background: "rgba(255,255,255,0.02)" }}>
                    <CardContent className="p-5">
                      <h3 className="font-bold text-white mb-2">{faq.question}</h3>
                      <p className="text-sm text-white/35 leading-relaxed">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ BOOKING FORM ═══════════ */}
      <Section id="prenota" className="py-24 px-4 border-t relative" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="absolute inset-0 pointer-events-none" style={{ background: `radial-gradient(ellipse at center bottom, ${gold}08, transparent 50%)` }} />
        <div className="max-w-xl mx-auto relative z-10">
          <SectionHeader eyebrow="Prenota ora" title="RICHIEDI UNA Prenotazione" gold />

          <Card className="border-white/10 backdrop-blur-2xl overflow-hidden relative" style={{ background: "rgba(255,255,255,0.03)" }}>
            {/* Animated border glow */}
            <div className="absolute inset-0 rounded-lg pointer-events-none" style={{ boxShadow: `inset 0 0 30px ${gold}08, 0 0 40px ${gold}05` }} />
            <CardContent className="p-7 space-y-4 relative z-10">
              <div>
                <Label className="text-white/35 text-xs font-medium">Nome e Cognome *</Label>
                <Input value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl focus:border-white/20 transition-colors" placeholder="Mario Rossi" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/35 text-xs font-medium">Email *</Label>
                  <Input value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" placeholder="email@esempio.it" />
                </div>
                <div>
                  <Label className="text-white/35 text-xs font-medium">Telefono *</Label>
                  <Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" placeholder="+39..." />
                </div>
              </div>

              {vehicles.length > 0 && (
                <div>
                  <Label className="text-white/35 text-xs font-medium">Veicolo</Label>
                  <Select value={bookingForm.vehicle} onValueChange={v => setBookingForm(p => ({ ...p, vehicle: v }))}>
                    <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl"><SelectValue placeholder="Seleziona veicolo" /></SelectTrigger>
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
                  <Label className="text-white/35 text-xs font-medium">Passeggeri</Label>
                  <Input type="number" min="1" max="50" value={bookingForm.passengers} onChange={e => setBookingForm(p => ({ ...p, passengers: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" />
                </div>
                {routes.length > 0 && (
                  <div>
                    <Label className="text-white/35 text-xs font-medium">Tratta</Label>
                    <Select value={bookingForm.route} onValueChange={v => setBookingForm(p => ({ ...p, route: v }))}>
                      <SelectTrigger className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl"><SelectValue placeholder="Seleziona tratta" /></SelectTrigger>
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
                  <Label className="text-white/35 text-xs font-medium">Data *</Label>
                  <Input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" />
                </div>
                <div>
                  <Label className="text-white/35 text-xs font-medium">Orario *</Label>
                  <Input type="time" value={bookingForm.time} onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" />
                </div>
              </div>

              {bookingForm.route === "custom" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-white/35 text-xs font-medium">Partenza</Label>
                    <Input value={bookingForm.pickup} onChange={e => setBookingForm(p => ({ ...p, pickup: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" placeholder="Indirizzo partenza" />
                  </div>
                  <div>
                    <Label className="text-white/35 text-xs font-medium">Arrivo</Label>
                    <Input value={bookingForm.dropoff} onChange={e => setBookingForm(p => ({ ...p, dropoff: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 h-12 rounded-xl" placeholder="Indirizzo arrivo" />
                  </div>
                </div>
              )}

              {/* Vehicle selector duplicate removed - already above */}

              <div>
                <Label className="text-white/35 text-xs font-medium">Note aggiuntive</Label>
                <Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} className="bg-white/[0.04] border-white/[0.08] text-white mt-1.5 min-h-[80px] rounded-xl" placeholder="Richieste speciali, seggiolini, soste..." />
              </div>

              <Button
                onClick={handleBooking}
                disabled={submitting}
                className="w-full h-14 text-base font-bold rounded-xl hover:scale-[1.02] transition-transform"
                style={{ background: gold, color: "#080812", boxShadow: `0 20px 50px -10px ${gold}35` }}
              >
                {submitting ? "Invio in corso..." : "Invia Prenotazione"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-white/15 text-center">Ti risponderemo entro pochi minuti. Prezzo definitivo dopo conferma.</p>
            </CardContent>
          </Card>
        </div>
      </Section>

      {/* ═══════════ CONTACT ═══════════ */}
      <Section id="contatti" className="py-24 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-4xl mx-auto">
          <SectionHeader eyebrow="Contattaci" title="Prenota il Tuo Viaggio" subtitle="Siamo disponibili 24 ore su 24, 7 giorni su 7. Contattaci per un preventivo gratuito o per prenotare il tuo prossimo transfer." gold />

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: "Telefono", value: company.phone, href: company.phone ? `tel:${company.phone}` : null },
              { icon: Mail, label: "Email", value: company.email, href: company.email ? `mailto:${company.email}` : null },
              { icon: MapPin, label: "Sede", value: `${company.address || ""}${company.city ? `, ${company.city}` : ""}`, href: null },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-center p-7 rounded-2xl border border-white/[0.06] hover:border-white/12 transition-all group" style={{ background: "rgba(255,255,255,0.02)" }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform" style={{ background: `${gold}10` }}>
                    <c.icon className="w-5 h-5" style={{ color: gold }} />
                  </div>
                  <p className="text-xs text-white/25 mb-2 uppercase tracking-wider">{c.label}</p>
                  {c.href ? (
                    <a href={c.href} className="text-sm font-semibold text-white hover:underline">{c.value}</a>
                  ) : (
                    <p className="text-sm font-semibold text-white">{c.value || "—"}</p>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
            {company.phone && (
              <Button size="lg" className="rounded-xl font-bold px-8 h-13 hover:scale-105 transition-transform" style={{ background: gold, color: "#080812", boxShadow: `0 15px 40px -10px ${gold}30` }} asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama Ora</a>
              </Button>
            )}
            {settings?.whatsapp && (
              <Button size="lg" variant="outline" className="rounded-xl font-bold px-8 h-13 border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all" asChild>
                <a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Scrivici su WhatsApp
                </a>
              </Button>
            )}
            <Button size="lg" variant="outline" className="rounded-xl font-bold px-8 h-13 border-white/10 text-white hover:bg-white/5 hover:border-white/20 transition-all" asChild>
              <a href="#prenota">Prenota Online</a>
            </Button>
          </div>
        </div>
      </Section>

      {/* ═══════════ FOOTER ═══════════ */}
      <footer className="py-12 px-4 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {company.logo_url && <img src={company.logo_url} alt="" className="h-10 w-10 rounded-xl object-cover ring-1 ring-white/10" />}
                <div>
                  <span className="font-bold text-base block">{company.name}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: gold }}>Premium Transfer</span>
                </div>
              </div>
              <p className="text-sm text-white/20 leading-relaxed">{company.tagline || "Servizio NCC premium nel Sud Italia"}</p>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white/40 uppercase tracking-wider text-[11px]">Contatti</h4>
              <div className="space-y-3 text-sm text-white/25">
                {company.phone && <a href={`tel:${company.phone}`} className="flex items-center gap-2 hover:text-white/50 transition-colors"><Phone className="w-3.5 h-3.5" /> {company.phone}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-white/50 transition-colors"><Mail className="w-3.5 h-3.5" /> {company.email}</a>}
                {company.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {company.address}{company.city ? `, ${company.city}` : ""}</p>}
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-sm mb-4 text-white/40 uppercase tracking-wider text-[11px]">Social</h4>
              <div className="flex gap-3">
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <Instagram className="w-4 h-4 text-white/40" />
                  </a>
                )}
                {settings?.whatsapp && (
                  <a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 hover:scale-110 transition-all" style={{ background: "rgba(255,255,255,0.04)" }}>
                    <MessageCircle className="w-4 h-4 text-white/40" />
                  </a>
                )}
              </div>
            </div>
          </div>
          <div className="text-center pt-8 border-t" style={{ borderColor: "rgba(255,255,255,0.04)" }}>
            <p className="text-xs text-white/10">© {new Date().getFullYear()} {company.name}. Tutti i diritti riservati.</p>
            <p className="text-[10px] text-white/[0.06] mt-1">Powered by Empire AI</p>
          </div>
        </div>
      </footer>

      {/* ═══════════ WHATSAPP FLOATING BUTTON ═══════════ */}
      {settings?.whatsapp && (
        <motion.a
          href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`}
          target="_blank"
          rel="noopener noreferrer"
          className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
          style={{ background: "#25D366", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }}
          aria-label="WhatsApp"
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 1, type: "spring", stiffness: 200 }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </motion.a>
      )}

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');
        @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-marquee { animation: marquee 25s linear infinite; }
        .animate-marquee-slow { animation: marquee 40s linear infinite; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
