import { lazy, Suspense, useState, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type IndustryId, getIndustryConfig } from "@/config/industry-config";
import { getSectorTheme } from "@/config/sector-themes";
import BackButton from "@/components/BackButton";
import IndustryPhoneShowcase from "@/components/public/IndustryPhoneShowcase";
import EmpireTeamStory from "@/components/public/EmpireTeamStory";
import { LuxuryTicker } from "@/components/public/LuxuryTicker";
import { motion, AnimatePresence } from "framer-motion";

const DemoSalesAgent = lazy(() => import("@/components/public/DemoSalesAgent"));

/* ── Branded splash screen for business sites ── */
function BusinessSplash({ name, logoUrl, accentColor, emoji, onComplete }: {
  name: string; logoUrl?: string | null; accentColor: string; emoji: string; onComplete: () => void;
}) {
  const [phase, setPhase] = useState<"brand" | "reveal" | "done">("brand");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1600);
    const t2 = setTimeout(() => setPhase("done"), 2800);
    const t3 = setTimeout(onComplete, 3400);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ background: "#0a0a0a" }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={onComplete}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute w-72 h-72 rounded-full blur-[100px]"
            style={{ background: accentColor, opacity: 0.12 }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.08, 0.18, 0.08] }}
            transition={{ duration: 3, repeat: Infinity }}
          />

          {/* Logo or emoji */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            {logoUrl ? (
              <img src={logoUrl} alt={name} className="w-20 h-20 object-contain rounded-2xl mb-4" />
            ) : (
              <div className="w-20 h-20 rounded-2xl flex items-center justify-center mb-4 text-4xl"
                style={{ background: `${accentColor}18`, border: `2px solid ${accentColor}30` }}>
                {emoji}
              </div>
            )}
          </motion.div>

          {/* Name */}
          <motion.h1
            className="text-2xl font-bold text-white font-heading tracking-wide text-center px-6"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {name}
          </motion.h1>

          {/* Accent line */}
          <motion.div
            className="h-[2px] rounded-full mt-4"
            style={{ background: accentColor }}
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          />

          {/* Loading dots */}
          {phase === "reveal" && (
            <motion.div className="flex gap-1.5 mt-6"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              {[0, 1, 2].map(i => (
                <motion.div key={i} className="w-1.5 h-1.5 rounded-full"
                  style={{ background: accentColor }}
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.15 }}
                />
              ))}
            </motion.div>
          )}

          {/* Tap to skip */}
          <motion.p className="absolute bottom-8 text-[10px] text-white/20 tracking-widest uppercase"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
            Tap per continuare
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

const NCCPublicSite = lazy(() => import("@/pages/public/NCCPublicSite"));
const FoodPublicSite = lazy(() => import("@/pages/public/FoodPublicSite"));
const BakeryPublicSite = lazy(() => import("@/pages/public/BakeryPublicSite"));
const BeautyPublicSite = lazy(() => import("@/pages/public/BeautyPublicSite"));
const HealthcarePublicSite = lazy(() => import("@/pages/public/HealthcarePublicSite"));
const RetailPublicSite = lazy(() => import("@/pages/public/RetailPublicSite"));
const FitnessPublicSite = lazy(() => import("@/pages/public/FitnessPublicSite"));
const HotelPublicSite = lazy(() => import("@/pages/public/HotelPublicSite"));
const BeachPublicSite = lazy(() => import("@/pages/public/BeachPublicSite"));
const TradesPublicSite = lazy(() => import("@/pages/public/TradesPublicSite"));
const LuxuryPublicSite = lazy(() => import("@/pages/public/LuxuryPublicSite"));

const SiteLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const TEMPLATE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<{ company: any }>>> = {
  ncc: NCCPublicSite,
  food: FoodPublicSite,
  restaurant: FoodPublicSite,
  bakery: BakeryPublicSite,
  beauty: BeautyPublicSite,
  healthcare: HealthcarePublicSite,
  retail: RetailPublicSite,
  fitness: FitnessPublicSite,
  hospitality: HotelPublicSite,
  hotel: HotelPublicSite,
  agriturismo: HotelPublicSite,
  beach: BeachPublicSite,
  plumber: TradesPublicSite,
  electrician: TradesPublicSite,
  cleaning: TradesPublicSite,
  gardening: TradesPublicSite,
  construction: TradesPublicSite,
  garage: TradesPublicSite,
  photography: TradesPublicSite,
  veterinary: TradesPublicSite,
  tattoo: TradesPublicSite,
  childcare: TradesPublicSite,
  education: TradesPublicSite,
  events: TradesPublicSite,
  logistics: TradesPublicSite,
  legal: TradesPublicSite,
  accounting: TradesPublicSite,
};

/* ── Ticker items per sector ── */
const TICKER_ITEMS: Record<string, string[]> = {
  food: ["Menu Digitale", "Ordini Live", "QR Intelligente", "Cucina Display", "Recensioni AI", "Fidelity Card", "Delivery Integrato", "Prenotazioni Smart"],
  ncc: ["Flotta Premium", "Booking Real-Time", "Gestione Autisti", "Tratte Dinamiche", "CRM Clienti VIP", "Fatturazione Auto", "GPS Live", "Pagamenti Sicuri"],
  beauty: ["Agenda Smart", "Booking Online", "Schede Clienti", "Marketing Auto", "Prodotti & Stock", "Loyalty Program", "WhatsApp Bot", "Analytics Trend"],
  healthcare: ["Appuntamenti", "Telemedicina", "Cartelle Digitali", "Promemoria Auto", "Fatturazione", "Prescrizioni", "CRM Pazienti", "GDPR Compliant"],
  fitness: ["Abbonamenti", "Classe Booking", "Check-in QR", "Trainer Assign", "Piani Workout", "Analytics Corpo", "Loyalty Points", "Push Promo"],
  hotel: ["Room Manager", "Check-in Digital", "Concierge AI", "F&B Integration", "Revenue Mgmt", "Housekeeping", "Guest CRM", "Channel Manager"],
  retail: ["POS Cloud", "Inventario Smart", "E-commerce Sync", "Fidelity Card", "Sconti Dinamici", "Analytics Vendite", "Fornitori Mgmt", "Omnichannel"],
  beach: ["Mappa Ombrelloni", "Booking Spot", "Abbonamenti", "Bar Service", "Meteo Widget", "Pass Stagionali", "CRM Ospiti", "Cassa Veloce"],
  default: ["Dashboard Pro", "CRM Integrato", "Booking Smart", "AI Assistente", "Fatturazione", "Marketing Auto", "Analytics Live", "WhatsApp Bot"],
};

export default function BusinessPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading } = useQuery({
    queryKey: ["business-page", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (companyData) return companyData as any;

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (restaurant) {
        return { ...restaurant, industry: "food" } as any;
      }

      return null;
    },
    enabled: !!slug,
  });

  if (isLoading) return <SiteLoader />;

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

  const industry = (company.industry || "custom") as IndustryId;
  const Template = TEMPLATE_MAP[industry] || LuxuryPublicSite;
  const config = getIndustryConfig(industry);
  const theme = getSectorTheme(industry);
  const accentHex = theme.palette.accentHex;
  const tickerItems = TICKER_ITEMS[industry] || TICKER_ITEMS.default;

  const [showSplash, setShowSplash] = useState(true);
  const handleSplashDone = useCallback(() => setShowSplash(false), []);

  if (showSplash) {
    return <BusinessSplash name={company.name} logoUrl={company.logo_url} accentColor={accentHex} emoji={config.emoji} onComplete={handleSplashDone} />;
  }

  return (
    <Suspense fallback={<SiteLoader />}>
      <BackButton to="/home" label="Indietro" variant="floating" theme="glass" />
      <Template company={company} />

      {/* ═══ CONVERSION MAXIMIZER — After template content ═══ */}

      {/* Luxury Ticker — social proof ribbon */}
      <LuxuryTicker items={tickerItems} accentColor={accentHex} />

      {/* Industry Phone Showcase — 14 app screens in iPhone mockups */}
      <div className="py-16 sm:py-24" style={{ background: "#0a0a0a" }}>
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-10">
            <span className="text-[10px] tracking-[0.3em] uppercase font-semibold" style={{ color: accentHex }}>
              La Tua App Completa
            </span>
            <h2 className="text-2xl sm:text-4xl font-bold text-white mt-3" style={{ fontFamily: "'DM Serif Display', serif" }}>
              Tutto Quello Che Ti Serve, In Un'Unica Piattaforma
            </h2>
            <p className="text-sm text-white/40 mt-3 max-w-xl mx-auto">
              Gestisci ogni aspetto della tua attività {config.label.toLowerCase()} con 14+ moduli professionali integrati — dalla prenotazione alla fatturazione, dall'AI al marketing.
            </p>
          </div>
          <IndustryPhoneShowcase industryId={industry} />
        </div>
      </div>

      {/* Empire Team — credibility & trust */}
      <EmpireTeamStory />

      {/* DemoSalesAgent — AI sales consultant with voice */}
      <Suspense fallback={null}>
        <DemoSalesAgent
          industry={industry}
          companyName={company.name || config.label}
          accentColor={accentHex}
        />
      </Suspense>
    </Suspense>
  );
}
