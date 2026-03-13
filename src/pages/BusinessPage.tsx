import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { type IndustryId } from "@/config/industry-config";
import BackButton from "@/components/BackButton";

// Sector-specific premium sites
const NCCPublicSite = lazy(() => import("@/pages/public/NCCPublicSite"));
const BeautyPublicSite = lazy(() => import("@/pages/public/BeautyPublicSite"));
const BeachPublicSite = lazy(() => import("@/pages/public/BeachPublicSite"));
const TradesPublicSite = lazy(() => import("@/pages/public/TradesPublicSite"));
const FoodPublicSite = lazy(() => import("@/pages/public/FoodPublicSite"));
const HealthcarePublicSite = lazy(() => import("@/pages/public/HealthcarePublicSite"));
const FitnessPublicSite = lazy(() => import("@/pages/public/FitnessPublicSite"));
const HotelPublicSite = lazy(() => import("@/pages/public/HotelPublicSite"));
const BakeryPublicSite = lazy(() => import("@/pages/public/BakeryPublicSite"));
const RetailPublicSite = lazy(() => import("@/pages/public/RetailPublicSite"));
const LuxuryPublicSite = lazy(() => import("@/pages/public/LuxuryPublicSite"));

const SiteLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

const TEMPLATE_MAP: Record<string, React.LazyExoticComponent<React.ComponentType<{ company: any }>>> = {
  ncc: NCCPublicSite,
  beauty: BeautyPublicSite,
  beach: BeachPublicSite,
  food: FoodPublicSite,
  restaurant: FoodPublicSite,
  healthcare: HealthcarePublicSite,
  fitness: FitnessPublicSite,
  hotel: HotelPublicSite,
  bakery: BakeryPublicSite,
  retail: RetailPublicSite,
};

const TRADES = ["plumber", "electrician", "cleaning", "garage", "construction", "gardening"];

export default function BusinessPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading } = useQuery({
    queryKey: ["business-page", slug],
    queryFn: async () => {
      if (!slug) return null;
      // Try companies table first
      const { data: companyData } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();
      if (companyData) return companyData as any;

      // Fallback: check restaurants table for food businesses
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

  // Trades group
  if (TRADES.includes(industry)) {
    return <Suspense fallback={<SiteLoader />}><TradesPublicSite company={company} /></Suspense>;
  }

  // Sector-specific or universal fallback
  const Template = TEMPLATE_MAP[industry] || LuxuryPublicSite;
  return (
    <Suspense fallback={<SiteLoader />}>
      <BackButton to="/home" label="Indietro" variant="floating" theme="glass" />
      <Template company={company} />
    </Suspense>
  );
}
