import { lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { getIndustryConfig, type IndustryId } from "@/config/industry-config";

// Sector-specific premium sites
const NCCPublicSite = lazy(() => import("@/pages/public/NCCPublicSite"));
const BeautyPublicSite = lazy(() => import("@/pages/public/BeautyPublicSite"));
const BeachPublicSite = lazy(() => import("@/pages/public/BeachPublicSite"));
const TradesPublicSite = lazy(() => import("@/pages/public/TradesPublicSite"));
const LuxuryPublicSite = lazy(() => import("@/pages/public/LuxuryPublicSite"));

const SiteLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export default function BusinessPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading } = useQuery({
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

  if (isLoading) {
    return <SiteLoader />;
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

  const industry = (company.industry || "custom") as IndustryId;

  // Dispatch to sector-specific premium sites
  if (industry === "ncc") return <Suspense fallback={<SiteLoader />}><NCCPublicSite company={company} /></Suspense>;
  if (industry === "beauty") return <Suspense fallback={<SiteLoader />}><BeautyPublicSite company={company} /></Suspense>;
  if (industry === "beach") return <Suspense fallback={<SiteLoader />}><BeachPublicSite company={company} /></Suspense>;
  if (["plumber", "electrician", "cleaning", "garage", "construction", "gardening"].includes(industry))
    return <Suspense fallback={<SiteLoader />}><TradesPublicSite company={company} /></Suspense>;

  // Universal luxury template for ALL other sectors
  return <Suspense fallback={<SiteLoader />}><LuxuryPublicSite company={company} /></Suspense>;
}
