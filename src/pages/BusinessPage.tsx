import { useState, useMemo, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIndustryConfig, type IndustryId } from "@/config/industry-config";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";

// Sector-specific premium sites
const NCCPublicSite = lazy(() => import("@/pages/public/NCCPublicSite"));
const BeautyPublicSite = lazy(() => import("@/pages/public/BeautyPublicSite"));
const BeachPublicSite = lazy(() => import("@/pages/public/BeachPublicSite"));
const TradesPublicSite = lazy(() => import("@/pages/public/TradesPublicSite"));
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import {
  Phone, Mail, MapPin, Clock, Star, ArrowRight, CheckCircle,
  Car, Calendar, Users, Scissors, Umbrella, Wrench, Zap,
  Heart, Shield, Camera, Leaf, Send, ChevronDown, Globe,
  Sparkles, Award, Navigation, Music, Wifi, Baby, GraduationCap,
  Scale, Truck, Package
} from "lucide-react";

/* ── Fade-in animation ───────────────────────────────────── */
const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  show: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ── Industry icon map ──────────────────────────────────── */
const ICONS: Record<string, any> = {
  ncc: Car, beauty: Scissors, healthcare: Heart, retail: Package,
  fitness: Users, hospitality: Star, beach: Umbrella, plumber: Wrench,
  electrician: Zap, agriturismo: Leaf, cleaning: Sparkles, legal: Scale,
  accounting: Globe, garage: Wrench, photography: Camera, construction: Package,
  gardening: Leaf, veterinary: Heart, tattoo: Sparkles, childcare: Baby,
  education: GraduationCap, events: Calendar, logistics: Truck, custom: Star,
};

/* ── Sector-specific feature lists ──────────────────────── */
const SECTOR_FEATURES: Record<string, { icon: any; label: string }[]> = {
  ncc: [
    { icon: Shield, label: "Autisti certificati" },
    { icon: Car, label: "Flotta premium" },
    { icon: Clock, label: "Disponibilità 24/7" },
    { icon: Navigation, label: "Transfer aeroporto" },
  ],
  beauty: [
    { icon: Scissors, label: "Servizi personalizzati" },
    { icon: Calendar, label: "Prenotazione online" },
    { icon: Sparkles, label: "Prodotti premium" },
    { icon: Heart, label: "Trattamenti esclusivi" },
  ],
  beach: [
    { icon: Umbrella, label: "Ombrelloni riservati" },
    { icon: Calendar, label: "Prenota il tuo posto" },
    { icon: Star, label: "Servizi premium" },
    { icon: Users, label: "Abbonamenti stagionali" },
  ],
  plumber: [
    { icon: Wrench, label: "Interventi rapidi" },
    { icon: Shield, label: "Garanzia lavori" },
    { icon: Clock, label: "Emergenze 24h" },
    { icon: CheckCircle, label: "Preventivi gratuiti" },
  ],
  electrician: [
    { icon: Zap, label: "Certificazioni impianti" },
    { icon: Shield, label: "Lavoro garantito" },
    { icon: Clock, label: "Pronto intervento" },
    { icon: CheckCircle, label: "Preventivi gratuiti" },
  ],
  healthcare: [
    { icon: Heart, label: "Personale qualificato" },
    { icon: Calendar, label: "Prenotazione facile" },
    { icon: Shield, label: "Privacy garantita" },
    { icon: Clock, label: "Orari flessibili" },
  ],
  veterinary: [
    { icon: Heart, label: "Cura e passione" },
    { icon: Calendar, label: "Appuntamenti online" },
    { icon: Shield, label: "Farmacia interna" },
    { icon: Clock, label: "Urgenze disponibili" },
  ],
  tattoo: [
    { icon: Sparkles, label: "Artisti professionisti" },
    { icon: Shield, label: "Igiene certificata" },
    { icon: Calendar, label: "Consulenze gratuite" },
    { icon: Star, label: "Stili personalizzati" },
  ],
  fitness: [
    { icon: Users, label: "Personal training" },
    { icon: Calendar, label: "Prenota lezioni" },
    { icon: Star, label: "Corsi per tutti" },
    { icon: Heart, label: "Supporto nutrizionale" },
  ],
  default: [
    { icon: Star, label: "Qualità garantita" },
    { icon: Calendar, label: "Prenota online" },
    { icon: Shield, label: "Professionalità" },
    { icon: Clock, label: "Sempre disponibili" },
  ],
};

/* ── CTA text by sector ─────────────────────────────────── */
const CTA_TEXT: Record<string, { title: string; button: string; placeholder: string }> = {
  ncc: { title: "Prenota il tuo transfer", button: "Richiedi Corsa", placeholder: "Es: Transfer aeroporto Fiumicino → Hotel Roma centro" },
  beauty: { title: "Prenota il tuo appuntamento", button: "Prenota Ora", placeholder: "Es: Taglio e piega per sabato pomeriggio" },
  beach: { title: "Prenota il tuo posto in spiaggia", button: "Prenota Posto", placeholder: "Es: Ombrellone prima fila per 2 settimane da luglio" },
  plumber: { title: "Richiedi un intervento", button: "Richiedi Preventivo", placeholder: "Es: Perdita d'acqua in bagno, urgente" },
  electrician: { title: "Richiedi un intervento", button: "Richiedi Preventivo", placeholder: "Es: Installazione impianto elettrico nuovo appartamento" },
  healthcare: { title: "Prenota una visita", button: "Prenota Visita", placeholder: "Es: Visita di controllo, mattina preferibilmente" },
  veterinary: { title: "Prenota una visita per il tuo amico", button: "Prenota Visita", placeholder: "Es: Vaccini annuali per cane taglia media" },
  tattoo: { title: "Prenota una consulenza", button: "Prenota Consulenza", placeholder: "Es: Tatuaggio braccio, stile realistico" },
  fitness: { title: "Inizia il tuo percorso", button: "Iscriviti Ora", placeholder: "Es: Interessato a corsi serali e personal training" },
  garage: { title: "Prenota un appuntamento", button: "Prenota", placeholder: "Es: Tagliando auto, cambio olio e filtri" },
  cleaning: { title: "Richiedi un preventivo", button: "Richiedi Preventivo", placeholder: "Es: Pulizia appartamento 80mq, settimanale" },
  legal: { title: "Richiedi una consulenza", button: "Consulenza", placeholder: "Es: Consulenza legale su diritto del lavoro" },
  default: { title: "Contattaci", button: "Invia Richiesta", placeholder: "Descrivi di cosa hai bisogno..." },
};

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function BusinessPage() {
  const { slug } = useParams<{ slug: string }>();
  const [contactForm, setContactForm] = useState({ name: "", phone: "", email: "", message: "" });
  const [submitting, setSubmitting] = useState(false);

  /* ── Fetch company ───────────────────────────────────── */
  const { data: company, isLoading: companyLoading } = useQuery({
    queryKey: ["business-page", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      return data as any;
    },
    enabled: !!slug,
  });

  const industry = (company?.industry || "custom") as IndustryId;
  const config = getIndustryConfig(industry);
  const primaryColor = company?.primary_color || config.defaultPrimaryColor;
  const accentHsl = config.color;
  const companyId = company?.id;
  const HeroIcon = ICONS[industry] || Star;
  const features = SECTOR_FEATURES[industry] || SECTOR_FEATURES.default;
  const cta = CTA_TEXT[industry] || CTA_TEXT.default;

  /* ── NCC-specific data ───────────────────────────────── */
  const { data: vehicles = [] } = useQuery({
    queryKey: ["bp-vehicles", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("company_id", companyId!).eq("is_active", true).order("base_price");
      return data || [];
    },
    enabled: !!companyId && industry === "ncc",
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["bp-routes", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("*").eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
    enabled: !!companyId && industry === "ncc",
  });

  /* ── Beauty/Healthcare services (products table) ───── */
  const { data: services = [] } = useQuery({
    queryKey: ["bp-services", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("products").select("*").eq("company_id", companyId!).eq("is_active", true).order("price");
      return data || [];
    },
    enabled: !!companyId && ["beauty", "healthcare", "veterinary", "tattoo", "fitness"].includes(industry),
  });

  /* ── Beach spots ──────────────────────────────────────── */
  const { data: spots = [] } = useQuery({
    queryKey: ["bp-spots", companyId],
    queryFn: async () => {
      const { data } = await supabase.from("beach_spots").select("*").eq("company_id", companyId!).eq("is_active", true).order("row_letter").order("spot_number");
      return data || [];
    },
    enabled: !!companyId && industry === "beach",
  });

  /* ── Reviews (ncc_reviews or generic) ─────────────────── */
  const { data: reviews = [] } = useQuery({
    queryKey: ["bp-reviews", companyId],
    queryFn: async () => {
      if (industry === "ncc") {
        const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", companyId!).eq("is_public", true).order("created_at", { ascending: false }).limit(6);
        return data || [];
      }
      return [];
    },
    enabled: !!companyId,
  });

  /* ── Submit contact/booking ──────────────────────────── */
  const handleSubmit = async () => {
    if (!contactForm.name || !contactForm.phone) {
      toast.error("Inserisci nome e telefono");
      return;
    }
    setSubmitting(true);
    try {
      if (industry === "ncc" && companyId) {
        await supabase.from("ncc_bookings").insert({
          company_id: companyId,
          customer_name: contactForm.name,
          customer_phone: contactForm.phone,
          customer_email: contactForm.email,
          pickup_address: contactForm.message || "Da definire",
          dropoff_address: "Da definire",
          pickup_datetime: new Date(Date.now() + 86400000).toISOString(),
          notes: contactForm.message,
        });
      } else if (["beauty", "healthcare", "veterinary", "tattoo", "fitness"].includes(industry) && companyId) {
        await supabase.from("appointments").insert({
          company_id: companyId,
          client_name: contactForm.name,
          client_phone: contactForm.phone,
          scheduled_at: new Date(Date.now() + 86400000).toISOString(),
          notes: contactForm.message,
        });
      } else if (["plumber", "electrician", "cleaning", "gardening", "construction", "garage"].includes(industry) && companyId) {
        await supabase.from("interventions").insert({
          company_id: companyId,
          client_name: contactForm.name,
          client_phone: contactForm.phone,
          intervention_type: config.terminology.order,
          notes: contactForm.message,
        });
      } else if (companyId) {
        await supabase.from("leads").insert({
          company_id: companyId,
          name: contactForm.name,
          phone: contactForm.phone,
          email: contactForm.email,
          notes: contactForm.message,
          source: "website",
        });
      }
      toast.success("Richiesta inviata con successo! Ti contatteremo presto.");
      setContactForm({ name: "", phone: "", email: "", message: "" });
    } catch {
      toast.error("Errore nell'invio. Riprova.");
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Loading state ────────────────────────────────────── */
  if (companyLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: `hsl(${accentHsl})` }} />
      </div>
    );
  }

  if (!company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Attività non trovata</h1>
          <p className="text-white/60">Controlla il link e riprova.</p>
        </div>
      </div>
    );
  }

  const openingHours = company.opening_hours as Record<string, string> | null;

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden" style={{ "--accent": accentHsl, "--brand": primaryColor } as any}>

      {/* ═══ HERO ═══════════════════════════════════════════ */}
      <section className="relative min-h-[85vh] flex items-end pb-12 px-4">
        {/* Gradient bg */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black" />
          <div
            className="absolute inset-0 opacity-30"
            style={{ background: `radial-gradient(ellipse at 30% 20%, hsl(${accentHsl} / 0.4), transparent 60%)` }}
          />
          {/* Cyber grid */}
          <div className="absolute inset-0 opacity-[0.03]" style={{
            backgroundImage: `linear-gradient(hsl(${accentHsl} / 0.5) 1px, transparent 1px), linear-gradient(90deg, hsl(${accentHsl} / 0.5) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }} />
        </div>

        <motion.div
          initial="hidden" animate="show"
          variants={stagger}
          className="relative z-10 max-w-2xl mx-auto w-full"
        >
          {/* Logo / Icon */}
          <motion.div variants={fadeUp} custom={0} className="mb-6">
            {company.logo_url ? (
              <img src={company.logo_url} alt={company.name} className="h-16 w-16 rounded-2xl object-cover shadow-2xl" />
            ) : (
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center shadow-2xl"
                style={{ background: `hsl(${accentHsl})` }}
              >
                <HeroIcon className="w-8 h-8 text-white" />
              </div>
            )}
          </motion.div>

          {/* Badge */}
          <motion.div variants={fadeUp} custom={1}>
            <Badge className="mb-4 text-xs font-medium border-white/10 bg-white/5 backdrop-blur-sm text-white/80">
              {config.emoji} {config.label}
            </Badge>
          </motion.div>

          {/* Title */}
          <motion.h1 variants={fadeUp} custom={2} className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight mb-4 leading-[1.1]">
            {company.name}
          </motion.h1>

          {/* Tagline */}
          {company.tagline && (
            <motion.p variants={fadeUp} custom={3} className="text-lg sm:text-xl text-white/60 mb-8 max-w-lg leading-relaxed">
              {company.tagline}
            </motion.p>
          )}

          {/* CTA buttons */}
          <motion.div variants={fadeUp} custom={4} className="flex flex-wrap gap-3">
            <Button
              size="lg"
              className="text-white font-semibold rounded-xl px-8 h-12 text-base shadow-xl"
              style={{ background: `hsl(${accentHsl})` }}
              onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
            >
              {cta.button} <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
            {company.phone && (
              <Button
                size="lg"
                variant="outline"
                className="rounded-xl px-8 h-12 text-base border-white/10 bg-white/5 text-white hover:bg-white/10"
                asChild
              >
                <a href={`tel:${company.phone}`}>
                  <Phone className="w-4 h-4 mr-2" /> Chiama
                </a>
              </Button>
            )}
          </motion.div>

          {/* Info chips */}
          <motion.div variants={fadeUp} custom={5} className="flex flex-wrap gap-3 mt-8">
            {company.city && (
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <MapPin className="w-3.5 h-3.5" /> {company.city}
              </div>
            )}
            {company.phone && (
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <Phone className="w-3.5 h-3.5" /> {company.phone}
              </div>
            )}
            {company.email && (
              <div className="flex items-center gap-1.5 text-sm text-white/50">
                <Mail className="w-3.5 h-3.5" /> {company.email}
              </div>
            )}
          </motion.div>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2"
        >
          <ChevronDown className="w-5 h-5 text-white/30" />
        </motion.div>
      </section>

      {/* ═══ FEATURES ═══════════════════════════════════════ */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial="hidden" whileInView="show" viewport={{ once: true }}
            variants={stagger}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4"
          >
            {features.map((f, i) => (
              <motion.div key={i} variants={fadeUp} custom={i}>
                <Card className="border-white/5 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] transition-all duration-500 group">
                  <CardContent className="p-5 text-center">
                    <div
                      className="w-12 h-12 mx-auto rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform"
                      style={{ background: `hsl(${accentHsl} / 0.12)` }}
                    >
                      <f.icon className="w-5 h-5" style={{ color: `hsl(${accentHsl})` }} />
                    </div>
                    <p className="text-sm font-medium text-white/80">{f.label}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ═══ NCC: VEHICLES & ROUTES ═════════════════════════ */}
      {industry === "ncc" && vehicles.length > 0 && (
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl sm:text-3xl font-bold mb-8">
              La Nostra Flotta
            </motion.h2>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {vehicles.map((v: any, i: number) => (
                <motion.div key={v.id} variants={fadeUp} custom={i}>
                  <Card className="border-white/5 bg-white/[0.03] overflow-hidden hover:border-white/10 transition-all group">
                    {v.image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={v.image_url} alt={v.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1">{v.name}</h3>
                      <div className="flex items-center gap-3 text-xs text-white/50 mb-3">
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {v.capacity} pax</span>
                        {v.brand && <span>{v.brand} {v.model}</span>}
                      </div>
                      {v.features?.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {v.features.slice(0, 3).map((f: string) => (
                            <Badge key={f} variant="secondary" className="text-[10px] bg-white/5 text-white/60 border-0">{f}</Badge>
                          ))}
                        </div>
                      )}
                      <div className="text-lg font-bold" style={{ color: `hsl(${accentHsl})` }}>
                        da €{v.base_price}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {industry === "ncc" && routes.length > 0 && (
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Tratte Principali</h2>
            <div className="grid sm:grid-cols-2 gap-3">
              {routes.map((r: any) => (
                <Card key={r.id} className="border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all">
                  <CardContent className="p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Navigation className="w-4 h-4 text-white/40" />
                      <div>
                        <p className="text-sm font-medium text-white">{r.origin} → {r.destination}</p>
                        <p className="text-xs text-white/40">
                          {r.distance_km && `${r.distance_km} km`}
                          {r.duration_min && ` · ~${r.duration_min} min`}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-bold" style={{ color: `hsl(${accentHsl})` }}>€{r.base_price}</span>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ BEAUTY/HEALTH: SERVICES ════════════════════════ */}
      {["beauty", "healthcare", "veterinary", "tattoo", "fitness"].includes(industry) && services.length > 0 && (
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">
              {industry === "beauty" ? "I Nostri Trattamenti" : industry === "fitness" ? "I Nostri Corsi" : "I Nostri Servizi"}
            </h2>
            <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {services.map((s: any, i: number) => (
                <motion.div key={s.id} variants={fadeUp} custom={i}>
                  <Card className="border-white/5 bg-white/[0.03] hover:bg-white/[0.06] transition-all group overflow-hidden">
                    {s.image_url && (
                      <div className="aspect-[16/10] overflow-hidden">
                        <img src={s.image_url} alt={s.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h3 className="font-semibold text-white mb-1">{s.name}</h3>
                      {s.description && <p className="text-xs text-white/50 mb-3 line-clamp-2">{s.description}</p>}
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold" style={{ color: `hsl(${accentHsl})` }}>€{s.price}</span>
                        {s.category && <Badge variant="secondary" className="text-[10px] bg-white/5 text-white/50 border-0">{s.category}</Badge>}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      )}

      {/* ═══ BEACH: SPOT INFO ═══════════════════════════════ */}
      {industry === "beach" && spots.length > 0 && (
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">La Nostra Spiaggia</h2>
            <p className="text-white/50 mb-8">
              {spots.length} postazioni disponibili · Fila {spots[0]?.row_letter} - {spots[spots.length - 1]?.row_letter}
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="border-white/5 bg-white/[0.03]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color: `hsl(${accentHsl})` }}>{spots.length}</p>
                  <p className="text-xs text-white/50">Postazioni totali</p>
                </CardContent>
              </Card>
              <Card className="border-white/5 bg-white/[0.03]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color: `hsl(${accentHsl})` }}>
                    €{Math.min(...spots.map((s: any) => s.price_daily || 0))}
                  </p>
                  <p className="text-xs text-white/50">Da / giorno</p>
                </CardContent>
              </Card>
              <Card className="border-white/5 bg-white/[0.03]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color: `hsl(${accentHsl})` }}>
                    {new Set(spots.map((s: any) => s.row_letter)).size}
                  </p>
                  <p className="text-xs text-white/50">File</p>
                </CardContent>
              </Card>
              <Card className="border-white/5 bg-white/[0.03]">
                <CardContent className="p-4 text-center">
                  <p className="text-2xl font-bold" style={{ color: `hsl(${accentHsl})` }}>
                    {spots.filter((s: any) => s.spot_type === "vip").length || "—"}
                  </p>
                  <p className="text-xs text-white/50">Postazioni VIP</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
      )}

      {/* ═══ REVIEWS ════════════════════════════════════════ */}
      {reviews.length > 0 && (
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl sm:text-3xl font-bold mb-8">Cosa dicono di noi</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {reviews.map((r: any) => (
                <Card key={r.id} className="border-white/5 bg-white/[0.03]">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-1 mb-2">
                      {Array.from({ length: r.rating }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    {r.comment && <p className="text-sm text-white/70 mb-2 line-clamp-3">{r.comment}</p>}
                    <p className="text-xs text-white/40">— {r.customer_name || "Anonimo"}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ OPENING HOURS ══════════════════════════════════ */}
      {openingHours && Object.keys(openingHours).length > 0 && (
        <section className="py-16 px-4 border-t border-white/5">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
              <Clock className="w-5 h-5" style={{ color: `hsl(${accentHsl})` }} />
              Orari
            </h2>
            <div className="grid sm:grid-cols-2 gap-2">
              {Object.entries(openingHours).map(([day, hours]) => (
                <div key={day} className="flex justify-between py-2 px-3 rounded-lg bg-white/[0.02] text-sm">
                  <span className="text-white/70">{day}</span>
                  <span className="text-white/50">{hours as string}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══ CONTACT / BOOKING FORM ═════════════════════════ */}
      <section id="contact-section" className="py-20 px-4 border-t border-white/5">
        <div className="max-w-lg mx-auto">
          <motion.div initial="hidden" whileInView="show" viewport={{ once: true }} variants={stagger} className="space-y-6">
            <motion.div variants={fadeUp} custom={0}>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">{cta.title}</h2>
              <p className="text-white/50 text-sm">Ti rispondiamo entro pochi minuti.</p>
            </motion.div>

            <motion.div variants={fadeUp} custom={1} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-white/60 text-xs">Nome *</Label>
                  <Input
                    value={contactForm.name}
                    onChange={(e) => setContactForm(p => ({ ...p, name: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 mt-1"
                    placeholder="Il tuo nome"
                  />
                </div>
                <div>
                  <Label className="text-white/60 text-xs">Telefono *</Label>
                  <Input
                    value={contactForm.phone}
                    onChange={(e) => setContactForm(p => ({ ...p, phone: e.target.value }))}
                    className="bg-white/5 border-white/10 text-white placeholder:text-white/30 mt-1"
                    placeholder="+39..."
                  />
                </div>
              </div>
              <div>
                <Label className="text-white/60 text-xs">Email</Label>
                <Input
                  value={contactForm.email}
                  onChange={(e) => setContactForm(p => ({ ...p, email: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 mt-1"
                  placeholder="email@esempio.it"
                />
              </div>
              <div>
                <Label className="text-white/60 text-xs">Messaggio</Label>
                <Textarea
                  value={contactForm.message}
                  onChange={(e) => setContactForm(p => ({ ...p, message: e.target.value }))}
                  className="bg-white/5 border-white/10 text-white placeholder:text-white/30 mt-1 min-h-[100px]"
                  placeholder={cta.placeholder}
                />
              </div>
              <Button
                onClick={handleSubmit}
                disabled={submitting}
                className="w-full h-12 text-base font-semibold rounded-xl text-white shadow-xl"
                style={{ background: `hsl(${accentHsl})` }}
              >
                {submitting ? "Invio..." : cta.button}
                <Send className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ═══ FOOTER ═════════════════════════════════════════ */}
      <footer className="py-8 px-4 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            {company.logo_url ? (
              <img src={company.logo_url} alt="" className="h-6 w-6 rounded-md object-cover" />
            ) : (
              <HeroIcon className="w-5 h-5" style={{ color: `hsl(${accentHsl})` }} />
            )}
            <span className="font-semibold text-white/80">{company.name}</span>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-white/40 mb-4">
            {company.address && (
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3" /> {company.address}, {company.city}</span>
            )}
            {company.phone && (
              <a href={`tel:${company.phone}`} className="flex items-center gap-1 hover:text-white/60"><Phone className="w-3 h-3" /> {company.phone}</a>
            )}
            {company.email && (
              <a href={`mailto:${company.email}`} className="flex items-center gap-1 hover:text-white/60"><Mail className="w-3 h-3" /> {company.email}</a>
            )}
          </div>
          <p className="text-[10px] text-white/20">Powered by Empire Platform</p>
        </div>
      </footer>
    </div>
  );
}