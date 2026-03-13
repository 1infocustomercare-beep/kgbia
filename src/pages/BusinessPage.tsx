import { useState, useMemo, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
const LuxuryPublicSite = lazy(() => import("@/pages/public/LuxuryPublicSite"));
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

  // Dispatch to sector-specific premium sites
  const SiteLoader = () => <div className="min-h-screen bg-black flex items-center justify-center"><div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" /></div>;
  
  // Dedicated premium templates
  if (industry === "ncc") return <Suspense fallback={<SiteLoader />}><NCCPublicSite company={company} /></Suspense>;
  if (industry === "beauty") return <Suspense fallback={<SiteLoader />}><BeautyPublicSite company={company} /></Suspense>;
  if (industry === "beach") return <Suspense fallback={<SiteLoader />}><BeachPublicSite company={company} /></Suspense>;
  if (["plumber", "electrician", "cleaning", "garage", "construction", "gardening"].includes(industry)) return <Suspense fallback={<SiteLoader />}><TradesPublicSite company={company} /></Suspense>;
  
  // Universal luxury template for ALL other sectors
  return <Suspense fallback={<SiteLoader />}><LuxuryPublicSite company={company} /></Suspense>;
}
}