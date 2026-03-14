import { useState, useRef, useEffect, forwardRef } from "react";
import { AutomationShowcase } from "@/components/public/AutomationShowcase";
import { SectorValueProposition } from "@/components/public/SectorValueProposition";
import heroMercedesImg from "@/assets/ncc-hero-mercedes-amalfi.jpg";
import heroBgImg from "@/assets/ncc-hero-bg-amalfi.jpg";
import nccPremiumInterior from "@/assets/ncc-premium-interior.jpg";
import nccPremiumHotel from "@/assets/ncc-premium-hotel.jpg";
import nccPremiumCoast from "@/assets/ncc-premium-coast.jpg";
import nccHeroVideo from "@/assets/video-ncc-hero.mp4";
import nccDestCapri from "@/assets/ncc-dest-capri.jpg";
import nccDestCostiera from "@/assets/ncc-dest-costiera.jpg";
import nccDestPompei from "@/assets/ncc-dest-pompei-new.png";
import nccDestSorrento from "@/assets/ncc-dest-sorrento.png";
import nccBoatCapri from "@/assets/ncc-boat-capri.jpg";
import nccBoatLuxury from "@/assets/ncc-boat-luxury.jpg";
import nccCostieraAerial from "@/assets/ncc-costiera-aerial.jpg";
import nccFleetEclass from "@/assets/ncc-fleet-eclass.jpg";
import nccFleetSclass from "@/assets/ncc-fleet-sclass.jpg";
import nccFleetSuv from "@/assets/ncc-fleet-suv.jpg";
import nccFleetBus from "@/assets/ncc-fleet-bus.jpg";
import nccFleetSprinter from "@/assets/ncc-fleet-sprinter.jpg";
import nccFleetShowcase from "@/assets/ncc-fleet-showcase.jpg";
import nccSuvPremium from "@/assets/ncc-suv-premium.jpg";
import { motion, useInView, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";
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

/* ── NCC Design Tokens ── */
const NCC = {
  bg: "#0a0a0a",
  bgLight: "#f5f0e8",
  bgStats: "#111111",
  ticker: "#111111",
  gold: "#C9A84C",
  white: "#ffffff",
  textDark: "#2c1810",
  textSecondary: "#9e8a6e",
  cardBorder: "rgba(201,168,76,0.2)",
  cardBorderHover: "rgba(201,168,76,0.4)",
  darkCard: "#1a1a1a",
  footer: "#050505",
};

/* ── Animation Variants ── */
const fadeUp = {
  hidden: { opacity: 0, y: 40 },
  show: (i: number) => ({ opacity: 1, y: 0, transition: { delay: i * 0.1, duration: 0.7, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] } }),
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

interface Props { company: any; }

/* ── Animated Section ── */
const Section = forwardRef<HTMLElement, { id?: string; children: React.ReactNode; className?: string; style?: React.CSSProperties }>(
  ({ id, children, className = "", style }, forwardedRef) => {
    const localRef = useRef(null);
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

/* ── Premium Badge — floating auto-rotating luxury gallery ── */
const premiumImages = [
  { src: nccPremiumInterior, label: "Interni Premium" },
  { src: nccPremiumHotel, label: "Servizio Hotel" },
  { src: nccPremiumCoast, label: "Costiera Amalfitana" },
  { src: heroMercedesImg, label: "Mercedes V-Class" },
];

function PremiumBadge() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % premiumImages.length), 3500);
    return () => clearInterval(t);
  }, []);
  const img = premiumImages[idx];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 1.4, duration: 0.5, ease: "easeOut" }}
      className="absolute -bottom-4 right-3 sm:-bottom-5 sm:right-4 lg:-bottom-6 lg:right-6 z-20"
    >
      <div
        className="flex items-center gap-2 rounded-full backdrop-blur-xl pl-0.5 pr-3 py-0.5"
        style={{
          background: "rgba(10,10,10,0.8)",
          border: `1px solid ${NCC.gold}40`,
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.03)`,
        }}
      >
        {/* Circular image thumbnail */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full overflow-hidden flex-shrink-0 relative" style={{ border: `1.5px solid ${NCC.gold}50` }}>
          <AnimatePresence mode="wait">
            <motion.img
              key={idx}
              src={img.src}
              alt={img.label}
              className="w-full h-full object-cover"
              initial={{ opacity: 0, scale: 1.2 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
            />
          </AnimatePresence>
        </div>
        {/* Text */}
        <div className="min-w-0">
          <p className="text-[8px] sm:text-[9px] uppercase tracking-[0.15em] font-bold leading-none" style={{ color: NCC.gold }}>Premium</p>
          <p className="text-[8px] sm:text-[9px] text-white/45 truncate leading-tight mt-0.5">{img.label}</p>
        </div>
      </div>
    </motion.div>
  );
}
Section.displayName = "Section";

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

/* ── Fleet Card Data (fallbacks) ── */
const FALLBACK_FLEET = [
  { id: "fb-1", name: "Mercedes E-Class o similare", category: "Berlina", capacity: 3, min_pax: 1, max_pax: 3, luggage_capacity: 3, base_price: 80, is_popular: false, features: ["Pelle", "Clima", "WiFi", "Acqua"], image_url: nccFleetEclass },
  { id: "fb-2", name: "Mercedes V-Class o similare", category: "Minivan", capacity: 7, min_pax: 1, max_pax: 7, luggage_capacity: 7, base_price: 120, is_popular: true, features: ["Pelle", "Clima", "WiFi", "TV", "Acqua"], image_url: nccFleetShowcase },
  { id: "fb-3", name: "Bus Gran Turismo", category: "Pullman", capacity: 50, min_pax: 20, max_pax: 50, luggage_capacity: 50, base_price: 350, is_popular: false, features: ["Clima", "WiFi", "TV", "WC", "Bagagliaio"], image_url: nccFleetBus },
  { id: "fb-4", name: "BMW X5 o similare", category: "SUV Premium", capacity: 4, min_pax: 1, max_pax: 4, luggage_capacity: 4, base_price: 100, is_popular: false, features: ["Pelle", "Clima", "WiFi", "4x4", "Acqua"], image_url: nccFleetSuv },
  { id: "fb-5", name: "Mercedes S-Class o similare", category: "Sedan Luxury", capacity: 3, min_pax: 1, max_pax: 3, luggage_capacity: 3, base_price: 150, is_popular: false, features: ["Pelle", "Clima", "WiFi", "Massaggio", "Champagne"], image_url: nccFleetSclass },
  { id: "fb-6", name: "Mercedes Sprinter o similare", category: "Minibus", capacity: 16, min_pax: 8, max_pax: 16, luggage_capacity: 16, base_price: 200, is_popular: false, features: ["Clima", "WiFi", "USB", "Bagagliaio", "Acqua"], image_url: nccFleetSprinter },
];

const FALLBACK_REVIEWS = [
  { id: "fr-1", rating: 5, customer_name: "Marco Rossi", comment: "Servizio eccezionale! Autista puntuale e professionale. L'auto era impeccabile. Consiglio vivamente per transfer aeroportuali.", city: "Roma", date: "Gennaio 2024", photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" },
  { id: "fr-2", rating: 5, customer_name: "Laura Bianchi", comment: "Tour della Costiera Amalfitana indimenticabile. Guida competente e molto disponibile. Esperienza di lusso a prezzi ragionevoli.", city: "Milano", date: "Dicembre 2023", photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face" },
  { id: "fr-3", rating: 5, customer_name: "Giovanni Verdi", comment: "Utilizzato per il mio matrimonio. Servizio impeccabile, auto elegantissima. Hanno reso il giorno speciale ancora più speciale.", city: "Napoli", date: "Novembre 2023", photo: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face" },
  { id: "fr-4", rating: 5, customer_name: "Anna Ferrari", comment: "Transfer da Napoli a Positano senza stress. Autista gentilissimo che ci ha anche dato consigli sui ristoranti. Top!", city: "Firenze", date: "Ottobre 2023", photo: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face" },
  { id: "fr-5", rating: 5, customer_name: "Paolo Esposito", comment: "Noleggiato un pullman per la gita aziendale. Organizzazione perfetta, autista esperto. Tutti soddisfatti!", city: "Torino", date: "Settembre 2023", photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face" },
];

const REVIEW_PHOTOS = [
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face",
];

const REVIEW_DATES = ["Gennaio 2024", "Dicembre 2023", "Novembre 2023", "Ottobre 2023", "Settembre 2023"];

/* ════════════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════════════ */
export default function NCCPublicSite({ company }: Props) {
  const companyId = company.id;
  const gold = company.primary_color || NCC.gold;
  const [bookingForm, setBookingForm] = useState({ name: "", phone: "", email: "", route: "", vehicle: "", pickup: "", dropoff: "", date: "", time: "", passengers: "1", luggage: "1", flight: "", notes: "" });
  const [submitting, setSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [navScrolled, setNavScrolled] = useState(false);
  const [reviewIndex, setReviewIndex] = useState(0);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Auto-advance review carousel
  useEffect(() => {
    const timer = setInterval(() => {
      setReviewIndex(prev => (prev + 1) % 5);
    }, 5000);
    return () => clearInterval(timer);
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

  // Use DB data or fallbacks
  const displayVehicles = vehicles.length > 0 ? vehicles : FALLBACK_FLEET;
  const displayReviews = reviews.length > 0 ? reviews : FALLBACK_REVIEWS;
  const avgRating = reviews.length > 0 ? (reviews.reduce((a: number, r: any) => a + r.rating, 0) / reviews.length).toFixed(1) : "5.0";
  const socialLinks = company.social_links as Record<string, string> | null;

  const tickerItems = ["Transfer Aeroportuali", "Transfer Stazione", "Tour Privati", "Noleggio Bus", "Eventi Speciali", "Servizio NCC", "Costiera Amalfitana", "Pompei & Vesuvio", "Capri & Ischia", "Roma & Napoli"];

  const navLinks = [
    { href: "#servizi", label: "Servizi" },
    { href: "#flotta", label: "Flotta" },
    { href: "#recensioni", label: "Recensioni" },
    { href: "#contatti", label: "Contatti" },
  ];

  const whyUsServices = [
    { icon: Plane, title: "Transfer Aeroportuali", desc: "Servizio puntuale da e per tutti gli aeroporti della Campania: Napoli, Roma Fiumicino, Roma Ciampino." },
    { icon: Train, title: "Transfer Stazione", desc: "Collegamenti con le principali stazioni ferroviarie: Napoli Centrale, Roma Termini, Alta Velocità." },
    { icon: Navigation, title: "Tour Privati", desc: "Scopri la Costiera Amalfitana, Pompei, il Vesuvio, Capri e tutte le meraviglie della Campania." },
    { icon: Car, title: "Noleggio Bus", desc: "Pullman e minibus per gruppi, gite scolastiche, viaggi organizzati e trasferimenti di gruppo." },
    { icon: Heart, title: "Eventi Speciali", desc: "Matrimoni, cerimonie, eventi aziendali e occasioni speciali con veicoli di lusso." },
    { icon: Shield, title: "Servizio NCC", desc: "Noleggio con conducente professionale per ogni esigenza di trasporto personalizzato." },
  ];

  const featuredDestinations = [
    { name: "Pompei & Napoli", image: nccDestPompei },
    { name: "Costiera Amalfitana", image: nccDestCostiera },
    { name: "Sorrento & Capri", image: nccDestCapri },
  ];

  const boatHighlights: Record<string, string[]> = {
    capri: ["Grotta Azzurra", "Faraglioni", "Marina Piccola", "Bagno in mare"],
    nerano: ["Baia di Ieranto", "Snorkeling", "Pranzo tipico", "Acque cristalline"],
    positano: ["Vista panoramica", "Spiaggia Grande", "Li Galli", "Aperitivo al tramonto"],
    amalfi: ["Duomo di Amalfi", "Grotta dello Smeraldo", "Costa Divina", "Limoncello tasting"],
    ischia: ["Terme naturali", "Castello Aragonese", "Giardini La Mortella", "Spiagge vulcaniche"],
  };
  const boatDescriptions: Record<string, string> = {
    capri: "L'isola dei sogni: Grotta Azzurra, Faraglioni e Marina Piccola in un tour esclusivo.",
    nerano: "La baia segreta della Costiera: acque cristalline, snorkeling e pranzo tipico.",
    positano: "La perla verticale della Costiera Amalfitana vista dal mare: un'esperienza unica.",
    amalfi: "Naviga lungo la Divina Costiera fino alla storica Repubblica Marinara.",
    ischia: "L'isola verde: terme naturali, giardini tropicali e spiagge incontaminate.",
  };
  const boatDurations: Record<string, string> = {
    capri: "Giornata intera",
    nerano: "Mezza giornata",
    positano: "Giornata intera",
    amalfi: "Giornata intera",
    ischia: "Giornata intera",
  };
  const getBoatHighlights = (name: string) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(boatHighlights)) {
      if (key.includes(k)) return v;
    }
    return ["Tour esclusivo", "Bagno in mare", "Guida esperta", "Pranzo incluso"];
  };
  const getBoatDescription = (name: string) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(boatDescriptions)) {
      if (key.includes(k)) return v;
    }
    return "Un'esperienza esclusiva alla scoperta delle meraviglie del mare.";
  };
  const getBoatDuration = (name: string) => {
    const key = name.toLowerCase();
    for (const [k, v] of Object.entries(boatDurations)) {
      if (key.includes(k)) return v;
    }
    return "Giornata intera";
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

  const scrollRef = useRef<HTMLDivElement>(null);
  const scrollFleet = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 360, behavior: "smooth" });
  };

  // Auto-scroll fleet carousel
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const timer = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) {
        el.scrollTo({ left: 0, behavior: "smooth" });
      } else {
        el.scrollBy({ left: 340, behavior: "smooth" });
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [displayVehicles]);

  const reviewCities = ["Roma", "Milano", "Napoli", "Firenze", "Torino"];

  return (
    <div className="min-h-screen overflow-x-hidden" style={{ background: NCC.bg, color: NCC.white }}>

      {/* ═══════════ NAVBAR ═══════════ */}
      <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${navScrolled ? "py-0" : "py-1"}`} style={{ background: NCC.bg, borderBottom: `1px solid rgba(201,168,76,0.3)` }}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            {company.logo_url && (
              <motion.img src={company.logo_url} alt="" className="h-9 w-9 rounded-xl object-cover" whileHover={{ scale: 1.1 }} />
            )}
            {!company.logo_url && (
              <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `${NCC.gold}20` }}>
                <Car className="w-5 h-5" style={{ color: NCC.gold }} />
              </div>
            )}
            <div className="min-w-0">
              <span className="font-bold text-base tracking-tight truncate block" style={{ color: NCC.gold }}>{company.name}</span>
              <span className="text-[9px] tracking-[0.2em] uppercase block font-semibold text-white/50">PREMIUM TRANSFER</span>
            </div>
          </div>

          <div className="hidden md:flex gap-8 text-[13px] text-white/50 font-medium">
            {navLinks.map(l => (
              <a key={l.href} href={l.href} className="hover:text-white transition-colors duration-300">{l.label}</a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            {company.phone && (
              <Button size="sm" variant="outline" className="hidden sm:flex gap-2 rounded-full font-bold text-xs h-10 px-5 hover:scale-105 transition-transform" style={{ borderColor: NCC.gold, color: NCC.gold, background: "transparent" }} asChild>
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
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3 }} className="md:hidden overflow-hidden" style={{ background: NCC.bg, borderTop: `1px solid rgba(201,168,76,0.2)` }}>
              <div className="px-5 py-5 space-y-1">
                {navLinks.map(l => (
                  <a key={l.href} href={l.href} onClick={() => setMobileMenuOpen(false)} className="block py-3 text-sm text-white/50 hover:text-white transition-colors border-b" style={{ borderColor: "rgba(201,168,76,0.1)" }}>{l.label}</a>
                ))}
                {company.phone && (
                  <a href={`tel:${company.phone}`} className="flex items-center gap-2 py-3 text-sm font-semibold" style={{ color: NCC.gold }}>
                    <Phone className="w-4 h-4" /> {company.phone}
                  </a>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      {/* ═══════════ HERO — 100vh, video bg + 2 columns ═══════════ */}
      <section className="relative min-h-[100svh] flex items-center pt-16 px-4 overflow-hidden">
        {/* Dark background image — Amalfi coast */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${heroBgImg})` }}
        />
        <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.7) 40%, rgba(0,0,0,0.5) 100%)" }} />

        <div className="max-w-7xl mx-auto w-full grid lg:grid-cols-2 gap-12 lg:gap-16 items-center relative z-10">
          <motion.div initial="hidden" animate="show" variants={stagger}>
            <motion.p variants={fadeUp} custom={0} className="text-[12px] uppercase tracking-[4px] font-bold mb-6" style={{ color: gold }}>
              {company.name}
            </motion.p>

            <motion.h1 variants={fadeUp} custom={1} className="font-black tracking-tight mb-7 leading-[0.95]" style={{ fontFamily: "'Playfair Display', serif", fontSize: "clamp(48px, 8vw, 96px)", fontWeight: 900 }}>
              <span className="text-white block">LUXURY</span>
              <span style={{ color: gold }} className="block">NCC TRANSPORT</span>
            </motion.h1>

            <motion.p variants={fadeUp} custom={2} className="text-lg mb-10 max-w-[480px] leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
              Servizio NCC privato nel Sud Italia. Transfer aeroportuali, tour esclusivi e noleggio con conducente.
              {company.city && ` Base: ${company.city}.`}
            </motion.p>

            <motion.div variants={fadeUp} custom={3}>
              <Button size="lg" className="rounded-full font-bold text-sm uppercase hover:scale-105 transition-transform" style={{ background: gold, color: "#000", padding: "16px 32px", fontSize: "14px", fontWeight: 700 }} asChild>
                <a href="#prenota">PRENOTA ORA</a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 40, x: 0 }} animate={{ opacity: 1, y: 0, x: 0 }} transition={{ delay: 0.5, duration: 1 }} className="relative mt-8 lg:mt-0">
            {/* Video principale */}
            <div className="relative rounded-2xl sm:rounded-[20px] overflow-hidden shadow-2xl max-w-md mx-auto lg:max-w-none" style={{ border: `3px solid ${gold}30` }}>
              <video
                src={nccHeroVideo}
                autoPlay muted loop playsInline
                className="w-full object-cover aspect-[4/3]"
                poster={heroMercedesImg}
              />
            </div>
            {/* Premium floating badge — auto-rotating luxury images */}
            <PremiumBadge />
          </motion.div>
        </div>

        {/* WhatsApp floating */}
        {settings?.whatsapp && (
          <motion.a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}?text=Ciao%20ho%20bisogno%20di%20maggiori%20informazioni`} target="_blank" rel="noopener noreferrer" className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl" style={{ background: "#25D366", boxShadow: "0 8px 30px rgba(37,211,102,0.4)" }} whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.95 }} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1, type: "spring" }}>
            <MessageCircle className="w-6 h-6 text-white" />
          </motion.a>
        )}

        <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 2.5 }} className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10">
          <ChevronDown className="w-5 h-5 text-white/15" />
        </motion.div>
      </section>

      {/* ═══════════ TICKER — infinite marquee ═══════════ */}
      <section className="py-4 overflow-hidden border-y" style={{ background: NCC.ticker, borderColor: `rgba(201,168,76,0.3)` }}>
        <div className="flex animate-ncc-marquee">
          {[...tickerItems, ...tickerItems, ...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="whitespace-nowrap text-sm font-medium mx-8 flex-shrink-0" style={{ color: "rgba(201,168,76,0.8)" }}>
              {item} <span className="mx-4 opacity-40">—</span>
            </span>
          ))}
        </div>
      </section>

      {/* ═══════════ DESTINAZIONI — light bg ═══════════ */}
      <Section className="py-16 sm:py-24 px-4" style={{ background: NCC.bgLight }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10 sm:mb-14">
            <p className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] font-semibold mb-3 sm:mb-4" style={{ color: gold }}>DESTINAZIONI POPOLARI</p>
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: NCC.textDark }}>
              LE NOSTRE <span style={{ color: gold }}>Destinazioni</span>
            </h2>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-6">
            {featuredDestinations.map((dest, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              >
                <a href="#prenota" className="group block relative rounded-xl sm:rounded-2xl overflow-hidden aspect-[2/3] sm:aspect-[3/4]">
                  <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s] ease-out" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-500" />
                  {/* Gold line accent */}
                  <motion.div
                    className="absolute top-0 left-0 right-0 h-[2px]"
                    style={{ background: `linear-gradient(90deg, transparent, ${gold}, transparent)` }}
                    initial={{ scaleX: 0 }}
                    whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + i * 0.15, duration: 0.8 }}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-6">
                    <h3 className="font-bold text-sm sm:text-xl lg:text-2xl text-white mb-0.5 sm:mb-2 leading-tight" style={{ fontFamily: "'Playfair Display', serif" }}>{dest.name}</h3>
                    <span className="hidden sm:inline-flex items-center gap-2 text-xs sm:text-sm font-semibold group-hover:gap-3 transition-all duration-300" style={{ color: gold }}>
                      PRENOTA <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <span className="sm:hidden flex items-center gap-1 text-[9px] font-bold uppercase tracking-wider" style={{ color: gold }}>
                      <ArrowRight className="w-3 h-3" />
                    </span>
                  </div>
                </a>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ STATS — dark premium ═══════════ */}
      <Section className="py-20 px-4 relative overflow-hidden" style={{ background: NCC.bgStats }}>
        <div className="absolute inset-0 opacity-20" style={{ background: `radial-gradient(ellipse at 50% 50%, ${NCC.gold}15, transparent 70%)` }} />
        <div className="max-w-5xl mx-auto relative z-10">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: 10, suffix: "+", label: "Anni di Esperienza" },
              { value: 5, suffix: ".0", label: "Valutazione Media", isStatic: true },
              { value: 50, suffix: "+", label: "Posti Disponibili" },
              { value: 24, suffix: "/7", label: "Sempre Disponibili", isStatic: true },
            ].map((s, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.1, type: "spring" }} className="text-center">
                <p className="text-4xl sm:text-5xl font-black mb-2" style={{ color: NCC.gold }}>
                  {s.isStatic ? `${s.value}${s.suffix}` : <><AnimatedNum value={s.value} />{s.suffix}</>}
                </p>
                <p className="text-xs uppercase tracking-[0.15em] font-medium text-white/50">{s.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ SERVIZI — INFINITE AUTO-SCROLL CAROUSEL ═══════════ */}
      <Section id="servizi" className="py-24 px-4" style={{ background: NCC.bgLight }}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>I Nostri Servizi</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: NCC.textDark }}>
              SOLUZIONI DI TRASPORTO <span style={{ color: gold }}>Premium</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base" style={{ color: NCC.textSecondary }}>
              Offriamo una gamma completa di servizi di trasporto di lusso, personalizzati per soddisfare ogni tua esigenza.
            </p>
          </div>
        </div>

        {/* Auto-scrolling service cards carousel */}
        <div className="overflow-hidden">
          <div className="flex animate-ncc-services-marquee">
            {[...whyUsServices, ...whyUsServices, ...whyUsServices, ...whyUsServices].map((item, i) => (
              <div key={i} className="flex-shrink-0 w-[320px] mx-3">
                <div className="bg-white rounded-2xl p-6 h-full hover:shadow-xl transition-shadow duration-500 group" style={{ borderRadius: "16px" }}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform" style={{ background: `${gold}15` }}>
                    <item.icon className="w-5 h-5" style={{ color: gold }} />
                  </div>
                  <h3 className="font-bold text-base mb-2" style={{ color: NCC.textDark }}>{item.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: NCC.textSecondary }}>{item.desc}</p>
                  <p className="mt-4 text-xs font-semibold inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: gold }}>
                    Scopri di più <ArrowRight className="w-3 h-3" />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* ═══════════ FLEET AUTO-SCROLL CAROUSEL — dark bg ═══════════ */}
      <Section id="flotta" className="py-24 px-4" style={{ background: NCC.bg }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-4">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>La Nostra Flotta</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white">VEICOLI DI </span>
              <span style={{ color: gold }}>Lusso</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-white/40">
              Scegli il veicolo più adatto alle tue esigenze. Tutti i nostri mezzi sono di ultima generazione e perfettamente mantenuti.
            </p>
          </div>

          <div className="relative mt-10">
            <button onClick={() => scrollFleet(-1)} className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center border hover:scale-110 transition-all" style={{ background: "rgba(10,10,10,0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button onClick={() => scrollFleet(1)} className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full flex items-center justify-center border hover:scale-110 transition-all" style={{ background: "rgba(10,10,10,0.85)", borderColor: "rgba(255,255,255,0.1)" }}>
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div ref={scrollRef} className="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {[...displayVehicles, ...displayVehicles].map((v: any, i: number) => {
                const features = v.features?.length > 0 ? v.features : ["Pelle", "Clima", "WiFi", "Acqua"];
                const img = v.image_url || FALLBACK_FLEET.find(f => f.category.toLowerCase() === (v.category || "").toLowerCase())?.image_url || "https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&h=400&fit=crop";
                const isPopular = v.is_popular || (v.category || "").toLowerCase().includes("minivan") || (v.category || "").toLowerCase().includes("van");

                return (
                  <motion.div key={`${v.id || i}-${i}`} className="flex-shrink-0 w-[320px] snap-start" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: (i % displayVehicles.length) * 0.05 }}>
                    <div className="rounded-2xl overflow-hidden h-full relative" style={{ background: NCC.darkCard, border: `1px solid rgba(201,168,76,0.3)` }}>
                      {isPopular && (
                        <div className="absolute top-3 right-3 z-10 px-3 py-1 rounded-full text-[10px] font-bold uppercase flex items-center gap-1" style={{ background: gold, color: "#000" }}>
                          ✦ Più Richiesto
                        </div>
                      )}
                      <div className="h-[220px] overflow-hidden relative">
                        <img src={img} alt={v.name} className="w-full h-full object-cover" />
                        <div className="absolute bottom-3 left-3 flex items-center gap-2 text-xs text-white/70">
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }}>
                            <Users className="w-3.5 h-3.5" /> {v.min_pax || 1}-{v.max_pax || v.capacity}
                          </span>
                          {(v.luggage_capacity || 0) > 0 && (
                            <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }}>
                              <Luggage className="w-3.5 h-3.5" /> {v.luggage_capacity}
                            </span>
                          )}
                          <span className="flex items-center gap-1 px-2.5 py-1 rounded-lg" style={{ background: "rgba(255,255,255,0.1)" }}>
                            <Wifi className="w-3.5 h-3.5" /> 5G
                          </span>
                        </div>
                      </div>
                      <div className="p-5">
                        <p className="text-[11px] uppercase tracking-wider mb-1" style={{ color: gold }}>{v.category || "Berlina"}</p>
                        <h3 className="font-bold text-xl text-white mb-3">{v.name}</h3>
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {(features as string[]).slice(0, 5).map((f: string, fi: number) => (
                            <span key={fi} className="px-2 py-0.5 rounded-md text-[10px] font-medium text-white/50" style={{ border: "1px solid rgba(255,255,255,0.2)", borderRadius: "8px" }}>{f}</span>
                          ))}
                        </div>
                        <div className="pt-3 border-t" style={{ borderColor: "rgba(201,168,76,0.2)" }}>
                          <p className="text-[10px] text-white/30 uppercase">A partire da</p>
                          <p className="text-2xl font-bold" style={{ color: gold }}>€{Number(v.base_price || 80).toFixed(0)}</p>
                        </div>
                        <Button className="w-full mt-4 rounded-full font-bold text-sm uppercase hover:scale-[1.02] transition-transform" style={{ background: gold, color: "#000" }} asChild>
                          <a href="#prenota">Prenota Ora</a>
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════ ROUTES & PRICES ═══════════ */}
      {routes.length > 0 && (
        <Section id="tratte" className="py-24 px-4" style={{ background: NCC.bgLight }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>TRATTE & TARIFFE</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: NCC.textDark }}>
                PREZZI FISSI <span style={{ color: gold }}>Trasparenti</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-3">
              {routes.map((r: any, i: number) => {
                const isAirport = r.origin?.toLowerCase().includes("aeroporto") || r.origin?.toLowerCase().includes("fiumicino");
                const isStation = r.origin?.toLowerCase().includes("stazione");
                const TypeIcon = isAirport ? Plane : isStation ? Train : MapPin;
                return (
                  <motion.div key={r.id} initial={{ opacity: 0, x: -15 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.04 }}>
                    <div className="bg-white rounded-2xl p-4 hover:shadow-lg transition-shadow group">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: `${gold}15` }}>
                          <TypeIcon className="w-4 h-4" style={{ color: gold }} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold truncate" style={{ color: NCC.textDark }}>{r.origin}</p>
                          <div className="flex items-center gap-1.5 my-1">
                            <ArrowRight className="w-3 h-3 flex-shrink-0" style={{ color: NCC.textSecondary }} />
                            <p className="text-sm truncate" style={{ color: NCC.textSecondary }}>{r.destination}</p>
                          </div>
                          <div className="flex gap-3 text-xs mt-1" style={{ color: NCC.textSecondary }}>
                            {r.distance_km && <span>{r.distance_km} km</span>}
                            {r.duration_min && <span>{Math.floor(r.duration_min / 60)}h{r.duration_min % 60 > 0 ? `${r.duration_min % 60}m` : ""}</span>}
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          <p className="text-xl font-black" style={{ color: gold }}>€{Number(r.base_price).toFixed(0)}</p>
                          <p className="text-[10px]" style={{ color: NCC.textSecondary }}>da</p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ BOAT TOURS — with badges & descriptions ═══════════ */}
      {destinations.length > 0 && (
        <Section id="tour" className="py-24 px-4" style={{ background: NCC.bg }}>
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>Esperienze in Mare</p>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-white">TOUR PRIVATI </span><span className="text-white/50"> in </span><span style={{ color: gold }}>Barca</span>
              </h2>
              <p className="mt-4 max-w-2xl mx-auto text-base text-white/40">
                Scopri le meraviglie del Golfo di Napoli e della Costiera Amalfitana con i nostri tour esclusivi in barca privata.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d: any, i: number) => {
                const price = boatPrices.find((bp: any) => bp.destination_id === d.id);
                const highlights = getBoatHighlights(d.name);
                const duration = getBoatDuration(d.name);
                const description = d.description || getBoatDescription(d.name);
                return (
                  <motion.div key={d.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                    <TiltCard>
                      <div className="rounded-2xl overflow-hidden h-full" style={{ background: NCC.darkCard, border: `1px solid ${NCC.cardBorder}` }}>
                        <div className="aspect-[4/3] overflow-hidden relative">
                          <img src={getBoatImage(d)} alt={d.name} className="w-full h-full object-cover hover:scale-110 transition-transform duration-1000" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                          {/* Duration badge */}
                          <div className="absolute top-3 left-3 px-3 py-1 rounded-full text-[10px] font-bold uppercase" style={{ background: `${gold}DD`, color: "#000" }}>
                            {duration}
                          </div>
                        </div>
                        <div className="p-5">
                          <p className="text-[10px] uppercase tracking-wider text-white/20 mb-1">Destinazione</p>
                          <h3 className="font-bold text-xl text-white mb-2" style={{ fontFamily: "'Playfair Display', serif" }}>{d.name}</h3>
                          <p className="text-sm text-white/40 line-clamp-2 mb-3">{description}</p>
                          <div className="flex flex-wrap gap-1.5 mb-4">
                            {highlights.map((h, hi) => (
                              <span key={hi} className="px-2 py-0.5 rounded-md text-[10px] font-medium" style={{ background: `${gold}10`, color: `${gold}BB` }}>{h}</span>
                            ))}
                          </div>
                          {price && Number(price.standard_price) > 0 ? (
                            <div className="flex items-center justify-between pt-3 border-t" style={{ borderColor: NCC.cardBorder }}>
                              <div>
                                <span className="text-xl font-black" style={{ color: gold }}>€{Number(price.standard_price).toFixed(0)}</span>
                                <span className="text-xs text-white/20 ml-1">/ persona</span>
                              </div>
                              <Button size="sm" className="rounded-full text-xs font-bold h-9 px-5" style={{ background: gold, color: "#000" }} asChild>
                                <a href="#prenota">Prenota</a>
                              </Button>
                            </div>
                          ) : (
                            <Button size="sm" className="w-full rounded-full text-xs font-bold h-9 mt-2" style={{ background: gold, color: "#000" }} asChild>
                              <a href="#prenota">Prenota Tour</a>
                            </Button>
                          )}
                        </div>
                      </div>
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
        <Section className="py-20 px-4" style={{ background: NCC.bgLight }}>
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-14">
              <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>SERVIZI AGGIUNTIVI</p>
              <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: NCC.textDark }}>
                PERSONALIZZA IL TUO <span style={{ color: gold }}>Viaggio</span>
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {crossSells.map((cs: any, i: number) => (
                <motion.div key={cs.id} initial={{ opacity: 0, y: 15 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}>
                  <div className="flex items-center gap-4 p-4 rounded-2xl bg-white hover:shadow-lg transition-shadow">
                    <span className="text-2xl">{cs.icon_emoji || "🎁"}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm" style={{ color: NCC.textDark }}>{cs.title}</p>
                      {cs.description && <p className="text-xs line-clamp-1" style={{ color: NCC.textSecondary }}>{cs.description}</p>}
                    </div>
                    {cs.is_free ? (
                      <Badge className="text-[10px] bg-emerald-500/10 text-emerald-600 border-emerald-500/20">Gratis</Badge>
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

      {/* ═══════════ REVIEWS — CAROUSEL with photos ═══════════ */}
      <Section id="recensioni" className="py-24 px-4" style={{ background: NCC.bg }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>Recensioni</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white">COSA DICONO I </span><span style={{ color: gold }}>Clienti</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-white/40">
              La soddisfazione dei nostri clienti è la nostra priorità. Ecco alcune delle loro esperienze.
            </p>
          </div>

          {/* Carousel */}
          <div className="relative">
            <button 
              onClick={() => setReviewIndex(prev => prev === 0 ? displayReviews.length - 1 : prev - 1)} 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 w-11 h-11 rounded-full flex items-center justify-center border hover:scale-110 transition-all hidden sm:flex" 
              style={{ background: "rgba(10,10,10,0.85)", borderColor: "rgba(255,255,255,0.1)" }}
              aria-label="Previous slide"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </button>
            <button 
              onClick={() => setReviewIndex(prev => (prev + 1) % displayReviews.length)} 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 w-11 h-11 rounded-full flex items-center justify-center border hover:scale-110 transition-all hidden sm:flex" 
              style={{ background: "rgba(10,10,10,0.85)", borderColor: "rgba(255,255,255,0.1)" }}
              aria-label="Next slide"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </button>

            <div className="overflow-hidden rounded-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={reviewIndex}
                  initial={{ opacity: 0, x: 80 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -80 }}
                  transition={{ duration: 0.4, ease: "easeInOut" }}
                  className="rounded-2xl p-8 sm:p-12 text-center"
                  style={{ background: NCC.darkCard, border: `1px solid ${NCC.cardBorder}` }}
                >
                  <div className="flex justify-center gap-1 mb-6">
                    {[1,2,3,4,5].map(s => <Star key={s} className={`w-5 h-5 ${s <= (displayReviews[reviewIndex % displayReviews.length] as any)?.rating ? "fill-amber-400 text-amber-400" : "text-white/10"}`} />)}
                  </div>
                  <p className="text-lg sm:text-xl text-white/70 mb-8 leading-relaxed italic max-w-2xl mx-auto">
                    "{(displayReviews[reviewIndex % displayReviews.length] as any)?.comment}"
                  </p>
                  <div className="flex items-center justify-center gap-4">
                    <img 
                      src={(displayReviews[reviewIndex % displayReviews.length] as any)?.photo || REVIEW_PHOTOS[reviewIndex % REVIEW_PHOTOS.length]} 
                      alt={(displayReviews[reviewIndex % displayReviews.length] as any)?.customer_name} 
                      className="w-14 h-14 rounded-full object-cover border-2"
                      style={{ borderColor: `${gold}40` }}
                    />
                    <div className="text-left">
                      <p className="text-base text-white font-semibold">
                        {(displayReviews[reviewIndex % displayReviews.length] as any)?.customer_name || "Ospite"}
                      </p>
                      <p className="text-sm text-white/30">
                        {(displayReviews[reviewIndex % displayReviews.length] as any)?.city || reviewCities[reviewIndex % reviewCities.length]} · {(displayReviews[reviewIndex % displayReviews.length] as any)?.date || REVIEW_DATES[reviewIndex % REVIEW_DATES.length]}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Dots */}
            <div className="flex justify-center gap-2 mt-6">
              {displayReviews.slice(0, Math.min(displayReviews.length, 5)).map((_: any, i: number) => (
                <button 
                  key={i} 
                  onClick={() => setReviewIndex(i)} 
                  className="w-2.5 h-2.5 rounded-full transition-all duration-300"
                  style={{ background: i === reviewIndex % displayReviews.length ? gold : "rgba(255,255,255,0.15)" }}
                />
              ))}
            </div>

            {/* Mobile prev/next */}
            <div className="flex sm:hidden justify-center gap-4 mt-4">
              <button onClick={() => setReviewIndex(prev => prev === 0 ? displayReviews.length - 1 : prev - 1)} className="px-4 py-2 rounded-full text-xs font-semibold border" style={{ borderColor: "rgba(255,255,255,0.1)", color: "white" }}>
                <ChevronLeft className="w-4 h-4 inline mr-1" />Previous slide
              </button>
              <button onClick={() => setReviewIndex(prev => (prev + 1) % displayReviews.length)} className="px-4 py-2 rounded-full text-xs font-semibold border" style={{ borderColor: "rgba(255,255,255,0.1)", color: "white" }}>
                Next slide<ChevronRight className="w-4 h-4 inline ml-1" />
              </button>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════ WHY CHOOSE US — light bg ═══════════ */}
      <Section className="py-24 px-4" style={{ background: NCC.bgLight }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>Perché Sceglierci</p>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight" style={{ fontFamily: "'Playfair Display', serif", color: NCC.textDark }}>
              L'Eccellenza nel <span style={{ color: gold }}>Trasporto</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base" style={{ color: NCC.textSecondary }}>
              Da oltre 10 anni offriamo servizi di trasporto di altissima qualità in tutta la Campania. La nostra missione è trasformare ogni viaggio in un'esperienza indimenticabile.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            {[
              { icon: Shield, title: "Sicurezza Garantita", desc: "Tutti i nostri veicoli sono regolarmente revisionati e assicurati. Autisti professionisti con anni di esperienza." },
              { icon: Clock, title: "Puntualità Svizzera", desc: "Monitoriamo i voli e i treni in tempo reale. Non dovrai mai aspettare, saremo sempre pronti ad accoglierti." },
              { icon: Award, title: "Qualità Premium", desc: "Flotta di veicoli di lusso di ultima generazione. Comfort e eleganza per ogni tipo di viaggio." },
              { icon: Headphones, title: "Servizio Personalizzato", desc: "Ogni cliente è unico. Personalizziamo ogni servizio in base alle tue esigenze specifiche." },
            ].map((item, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="flex gap-4 p-6 rounded-2xl bg-white hover:shadow-lg transition-shadow group">
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform" style={{ background: `${gold}15` }}>
                    <item.icon className="w-5 h-5" style={{ color: gold }} />
                  </div>
                  <div>
                    <h3 className="font-bold mb-1.5" style={{ color: NCC.textDark }}>{item.title}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: NCC.textSecondary }}>{item.desc}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, scale: 0.8 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="text-center mt-14">
            <p className="text-5xl font-black" style={{ color: gold }}>5000+</p>
            <p className="text-sm mt-2" style={{ color: NCC.textSecondary }}>Clienti Soddisfatti</p>
            <Button className="mt-6 rounded-full font-bold text-sm uppercase px-8 hover:scale-105 transition-transform" style={{ background: gold, color: "#000" }} asChild>
              <a href="#prenota">Prenota ora</a>
            </Button>
          </motion.div>
        </div>
      </Section>

      {/* ═══════════ FAQ ═══════════ */}
      {faqs.length > 0 && (
        <Section className="py-24 px-4" style={{ background: NCC.bg }}>
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
                <span className="text-white">Domande </span><span style={{ color: gold }}>Frequenti</span>
              </h2>
            </div>
            <div className="space-y-3">
              {faqs.map((faq: any, i: number) => (
                <motion.div key={faq.id} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                  <div className="rounded-2xl p-5" style={{ background: NCC.darkCard, border: `1px solid ${NCC.cardBorder}` }}>
                    <h3 className="font-bold text-white mb-2">{faq.question}</h3>
                    <p className="text-sm text-white/40 leading-relaxed">{faq.answer}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </Section>
      )}

      {/* ═══════════ BOOKING FORM — light bg ═══════════ */}
      <Section id="prenota" className="py-24 px-4" style={{ background: NCC.bgLight }}>
        <div className="max-w-xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>Prenota ora</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif", color: NCC.textDark }}>
              RICHIEDI UNA <span style={{ color: gold }}>Prenotazione</span>
            </h2>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 sm:p-10" style={{ borderRadius: "16px" }}>
            <div className="space-y-4">
              <div>
                <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Nome e Cognome *</Label>
                <Input value={bookingForm.name} onChange={e => setBookingForm(p => ({ ...p, name: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200 focus:border-gray-400" placeholder="Mario Rossi" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Email *</Label>
                  <Input value={bookingForm.email} onChange={e => setBookingForm(p => ({ ...p, email: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" placeholder="email@esempio.it" />
                </div>
                <div>
                  <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Telefono *</Label>
                  <Input value={bookingForm.phone} onChange={e => setBookingForm(p => ({ ...p, phone: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" placeholder="+39..." />
                </div>
              </div>

              {displayVehicles.length > 0 && (
                <div>
                  <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Veicolo</Label>
                  <Select value={bookingForm.vehicle} onValueChange={v => setBookingForm(p => ({ ...p, vehicle: v }))}>
                    <SelectTrigger className="mt-1.5 h-12 rounded-xl border-gray-200"><SelectValue placeholder="Seleziona veicolo" /></SelectTrigger>
                    <SelectContent>
                      {(vehicles.length > 0 ? vehicles : FALLBACK_FLEET).map((v: any) => (
                        <SelectItem key={v.id} value={v.id}>{v.name} ({v.min_pax || 1}-{v.max_pax || v.capacity} pax)</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Passeggeri</Label>
                  <Input type="number" min="1" max="50" value={bookingForm.passengers} onChange={e => setBookingForm(p => ({ ...p, passengers: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" />
                </div>
                {routes.length > 0 && (
                  <div>
                    <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Tratta</Label>
                    <Select value={bookingForm.route} onValueChange={v => setBookingForm(p => ({ ...p, route: v }))}>
                      <SelectTrigger className="mt-1.5 h-12 rounded-xl border-gray-200"><SelectValue placeholder="Seleziona tratta" /></SelectTrigger>
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
                  <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Data *</Label>
                  <Input type="date" value={bookingForm.date} onChange={e => setBookingForm(p => ({ ...p, date: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" />
                </div>
                <div>
                  <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Orario *</Label>
                  <Input type="time" value={bookingForm.time} onChange={e => setBookingForm(p => ({ ...p, time: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" />
                </div>
              </div>

              {bookingForm.route === "custom" && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Partenza</Label>
                    <Input value={bookingForm.pickup} onChange={e => setBookingForm(p => ({ ...p, pickup: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" placeholder="Indirizzo partenza" />
                  </div>
                  <div>
                    <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Arrivo</Label>
                    <Input value={bookingForm.dropoff} onChange={e => setBookingForm(p => ({ ...p, dropoff: e.target.value }))} className="mt-1.5 h-12 rounded-xl border-gray-200" placeholder="Indirizzo arrivo" />
                  </div>
                </div>
              )}


              <div>
                <Label className="text-xs font-medium" style={{ color: NCC.textSecondary }}>Note aggiuntive</Label>
                <Textarea value={bookingForm.notes} onChange={e => setBookingForm(p => ({ ...p, notes: e.target.value }))} className="mt-1.5 min-h-[80px] rounded-xl border-gray-200" placeholder="Richieste speciali, seggiolini, soste..." />
              </div>

              <Button
                onClick={handleBooking}
                disabled={submitting}
                className="w-full h-14 text-base font-bold rounded-full uppercase hover:scale-[1.02] transition-transform"
                style={{ background: gold, color: "#000" }}
              >
                {submitting ? "Invio in corso..." : "Invia Prenotazione"}
                <Send className="w-4 h-4 ml-2" />
              </Button>
              <p className="text-[11px] text-center" style={{ color: NCC.textSecondary }}>Ti risponderemo entro pochi minuti.</p>
            </div>
          </div>
        </div>
      </Section>

      {/* ═══════════ CONTACT — dark bg ═══════════ */}
      <Section id="contatti" className="py-24 px-4" style={{ background: NCC.bg }}>
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-[11px] uppercase tracking-[0.3em] font-semibold mb-4" style={{ color: gold }}>Contattaci</p>
            <h2 className="text-3xl sm:text-4xl font-black" style={{ fontFamily: "'Playfair Display', serif" }}>
              <span className="text-white">Prenota il Tuo </span><span style={{ color: gold }}>Viaggio</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-base text-white/40">
              Siamo disponibili 24 ore su 24, 7 giorni su 7. Contattaci per un preventivo gratuito o per prenotare il tuo prossimo transfer.
            </p>
          </div>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              { icon: Phone, label: "Telefono", value: company.phone, href: company.phone ? `tel:${company.phone}` : null },
              { icon: Mail, label: "Email", value: company.email, href: company.email ? `mailto:${company.email}` : null },
              { icon: MapPin, label: "Sede", value: `${company.address || ""}${company.city ? `, ${company.city}` : ""}`, href: null },
            ].map((c, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <div className="text-center p-7 rounded-2xl" style={{ background: NCC.darkCard, border: `1px solid ${NCC.cardBorder}` }}>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4" style={{ background: `${gold}15` }}>
                    <c.icon className="w-5 h-5" style={{ color: gold }} />
                  </div>
                  <p className="text-xs text-white/30 mb-2 uppercase tracking-wider">{c.label}</p>
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
              <Button size="lg" className="rounded-full font-bold px-8 hover:scale-105 transition-transform" style={{ background: gold, color: "#000" }} asChild>
                <a href={`tel:${company.phone}`}><Phone className="w-4 h-4 mr-2" /> Chiama Ora</a>
              </Button>
            )}
            {settings?.whatsapp && (
              <Button size="lg" className="rounded-full font-bold px-8 hover:scale-105 transition-transform" style={{ background: "#25D366", color: "#fff" }} asChild>
                <a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="w-4 h-4 mr-2" /> Scrivici su WhatsApp
                </a>
              </Button>
            )}
            <Button size="lg" variant="outline" className="rounded-full font-bold px-8 border-white/10 text-white hover:bg-white/5 transition-all" asChild>
              <a href="#prenota">Prenota Online</a>
            </Button>
          </div>
        </div>
      </Section>

      {/* ═══════════ FOOTER — #050505 ═══════════ */}
      <footer className="py-12 px-4" style={{ background: NCC.footer, borderTop: `1px solid ${NCC.cardBorder}` }}>
        <div className="max-w-5xl mx-auto">
          <div className="grid sm:grid-cols-3 gap-10 mb-10">
            <div>
              <div className="flex items-center gap-3 mb-4">
                {company.logo_url && <img src={company.logo_url} alt="" className="h-10 w-10 rounded-xl object-cover" />}
                <div>
                  <span className="font-bold text-base block">{company.name}</span>
                  <span className="text-[9px] tracking-[0.2em] uppercase font-semibold" style={{ color: gold }}>Premium Transfer</span>
                </div>
              </div>
              <p className="text-sm text-white/20 leading-relaxed">{company.tagline || "Servizio NCC premium nel Sud Italia"}</p>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold mb-4 text-white/40 uppercase tracking-wider">Link</h4>
              <div className="space-y-2 text-sm text-white/25">
                <a href="#servizi" className="block hover:text-white/50 transition-colors">Servizi</a>
                <a href="#flotta" className="block hover:text-white/50 transition-colors">Flotta</a>
                <a href="#recensioni" className="block hover:text-white/50 transition-colors">Recensioni</a>
                <a href="#prenota" className="block hover:text-white/50 transition-colors">Prenota</a>
              </div>
            </div>
            <div>
              <h4 className="text-[11px] font-semibold mb-4 text-white/40 uppercase tracking-wider">Contatti</h4>
              <div className="space-y-3 text-sm text-white/25">
                {company.phone && <a href={`tel:${company.phone}`} className="flex items-center gap-2 hover:text-white/50 transition-colors"><Phone className="w-3.5 h-3.5" /> {company.phone}</a>}
                {company.email && <a href={`mailto:${company.email}`} className="flex items-center gap-2 hover:text-white/50 transition-colors"><Mail className="w-3.5 h-3.5" /> {company.email}</a>}
                {company.address && <p className="flex items-center gap-2"><MapPin className="w-3.5 h-3.5" /> {company.address}{company.city ? `, ${company.city}` : ""}</p>}
              </div>
              {(socialLinks?.instagram || settings?.whatsapp) && (
                <div className="flex gap-3 mt-4">
                  {socialLinks?.instagram && (
                    <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <Instagram className="w-4 h-4 text-white/40" />
                    </a>
                  )}
                  {settings?.whatsapp && (
                    <a href={`https://wa.me/${(settings.whatsapp as string).replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all" style={{ background: "rgba(255,255,255,0.04)" }}>
                      <MessageCircle className="w-4 h-4 text-white/40" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </div>
          <div className="text-center pt-8 border-t" style={{ borderColor: NCC.cardBorder }}>
            <p className="text-xs text-white/10">© 2026 {company.name}. Tutti i diritti riservati.</p>
            <div className="flex items-center justify-center gap-4 mt-2 text-[10px] text-white/[0.08]">
              <span>Privacy</span>
              <span>Termini</span>
              <span>Cookie</span>
            </div>
          </div>
        </div>
      </footer>

      <SectorValueProposition sectorKey="ncc" accentColor={NCC.gold} darkMode={true} sectorLabel="Servizio NCC" />
      <AutomationShowcase accentColor={NCC.gold} accentBg="bg-amber-600" sectorName="il trasporto NCC" darkMode={true} />

      {/* Styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800;900&display=swap');
        @keyframes ncc-marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ncc-marquee { animation: ncc-marquee 20s linear infinite; }
        @keyframes ncc-services-scroll { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-ncc-services-marquee { animation: ncc-services-scroll 30s linear infinite; }
        .animate-ncc-services-marquee:hover { animation-play-state: paused; }
        .scrollbar-hide::-webkit-scrollbar { display: none; }
        html { scroll-behavior: smooth; }
      `}</style>
    </div>
  );
}
