// ── useIndustry Hook ──────────────────────────────────────
// Exposes industry config, company data, and companyId for the current user.
// Falls back to "food" if no company is found (backward compat with restaurants).

import { useState, useEffect, useMemo } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { getIndustryConfig, type IndustryConfig, type IndustryId } from "@/config/industry-config";

export interface CompanyData {
  id: string;
  name: string;
  industry: IndustryId;
  slug: string;
  logo_url: string | null;
  primary_color: string | null;
  secondary_color: string | null;
  subscription_plan: string;
  modules_enabled: string[];
}

export function useIndustry() {
  const { user } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setCompany(null);
      setLoading(false);
      return;
    }

    const fetchCompany = async () => {
      // First try companies table
      const { data: membership } = await supabase
        .from("company_memberships" as any)
        .select("company_id")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (membership?.company_id) {
        const { data: companyData } = await supabase
          .from("companies" as any)
          .select("*")
          .eq("id", membership.company_id)
          .single();

        if (companyData) {
          setCompany({
            id: companyData.id,
            name: companyData.name,
            industry: companyData.industry || "food",
            slug: companyData.slug,
            logo_url: companyData.logo_url,
            primary_color: companyData.primary_color,
            secondary_color: companyData.secondary_color,
            subscription_plan: companyData.subscription_plan || "essential",
            modules_enabled: companyData.modules_enabled || [],
          });
          setLoading(false);
          return;
        }
      }

      // Fallback: check existing restaurants table for food businesses
      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (restaurant) {
        setCompany({
          id: restaurant.id,
          name: restaurant.name,
          industry: "food",
          slug: restaurant.slug,
          logo_url: restaurant.logo_url,
          primary_color: restaurant.primary_color,
          secondary_color: null,
          subscription_plan: "essential",
          modules_enabled: [],
        });
      }

      setLoading(false);
    };

    fetchCompany();
  }, [user]);

  const config: IndustryConfig = useMemo(
    () => getIndustryConfig(company?.industry),
    [company?.industry]
  );

  return {
    company,
    companyId: company?.id ?? null,
    industry: company?.industry ?? ("food" as IndustryId),
    config,
    loading,
    terminology: config.terminology,
    modules: config.modules,
  };
}
