import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { lazy, Suspense } from "react";

const NCCPublicSite = lazy(() => import("@/pages/public/NCCPublicSite"));

const SiteLoader = () => (
  <div className="min-h-screen bg-black flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
  </div>
);

export default function NCCDemoPage() {
  const { slug } = useParams<{ slug: string }>();

  const { data: company, isLoading } = useQuery({
    queryKey: ["ncc-company", slug],
    queryFn: async () => {
      if (!slug) return null;
      const { data } = await supabase
        .from("companies")
        .select("id, name, slug, industry, owner_id, logo_url, primary_color, secondary_color, tagline, address, city, phone, email, subscription_plan, modules_enabled, is_active, is_blocked, blocked_reason, created_at, updated_at, font_family, modules_config, opening_hours, social_links, theme_config, setup_paid, selected_plan, selected_installments, setup_paid_at")
        .eq("slug", slug)
        .eq("industry", "ncc")
        .maybeSingle();
      return data as any;
    },
    enabled: !!slug,
  });

  if (isLoading) return <SiteLoader />;

  if (!company) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white text-center px-6">
        <div>
          <h1 className="text-4xl font-bold mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Servizio Non Trovato
          </h1>
          <p className="text-white/50">Il servizio NCC richiesto non è disponibile.</p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<SiteLoader />}>
      <NCCPublicSite company={company} />
    </Suspense>
  );
}
