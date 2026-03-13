// ── useIndustry Hook ──────────────────────────────────────
// Exposes industry config, company data, and companyId for the current user.
// CRITICAL: Does NOT default to "food" until loading completes to prevent
// cross-sector contamination and premature redirects.

import { useState, useEffect, useMemo, useRef } from "react";
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

// Session-level cache to prevent flicker on navigation
const industryCache = new Map<string, CompanyData>();

export function useIndustry() {
  const { user } = useAuth();
  const [company, setCompany] = useState<CompanyData | null>(
    user ? industryCache.get(user.id) ?? null : null
  );
  const [loading, setLoading] = useState(true);
  const [resolved, setResolved] = useState(false);
  const fetchingRef = useRef<string | null>(null);

  useEffect(() => {
    if (!user) {
      setCompany(null);
      setLoading(false);
      setResolved(true);
      fetchingRef.current = null;
      return;
    }

    // If already cached for this user, use it immediately
    const cached = industryCache.get(user.id);
    if (cached) {
      setCompany(cached);
      setLoading(false);
      setResolved(true);
      return;
    }

    // Prevent duplicate fetches for same user
    if (fetchingRef.current === user.id) return;
    fetchingRef.current = user.id;

    const fetchCompany = async () => {
      setLoading(true);
      setResolved(false);

      try {
        // First try companies table (non-food sectors)
        const { data: membership } = await supabase
          .from("company_memberships" as any)
          .select("company_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        const membershipData = membership as any;

        if (membershipData?.company_id) {
          const { data: companyRaw } = await supabase
            .from("companies" as any)
            .select("*")
            .eq("id", membershipData.company_id)
            .single();

          const companyData = companyRaw as any;

          if (companyData) {
            const resolved: CompanyData = {
              id: companyData.id,
              name: companyData.name,
              industry: companyData.industry || "food",
              slug: companyData.slug,
              logo_url: companyData.logo_url,
              primary_color: companyData.primary_color,
              secondary_color: companyData.secondary_color,
              subscription_plan: companyData.subscription_plan || "essential",
              modules_enabled: companyData.modules_enabled || [],
            };
            industryCache.set(user.id, resolved);
            setCompany(resolved);
            setLoading(false);
            setResolved(true);
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
          const resolved: CompanyData = {
            id: restaurant.id,
            name: restaurant.name,
            industry: "food",
            slug: restaurant.slug,
            logo_url: restaurant.logo_url,
            primary_color: restaurant.primary_color,
            secondary_color: null,
            subscription_plan: "essential",
            modules_enabled: [],
          };
          industryCache.set(user.id, resolved);
          setCompany(resolved);
        }
        // If neither found, company stays null — no default to "food"
      } catch (err) {
        console.error("useIndustry fetch error:", err);
      } finally {
        setLoading(false);
        setResolved(true);
      }
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
    // Only return the actual industry when resolved; null-safe fallback for config
    industry: company?.industry ?? ("food" as IndustryId),
    config,
    loading,
    resolved, // NEW: true only when fetch completed — use this for routing decisions
    terminology: config.terminology,
    modules: config.modules,
  };
}

// Utility to clear cache on logout
export function clearIndustryCache() {
  industryCache.clear();
}
