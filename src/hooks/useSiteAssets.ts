import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface SiteAsset {
  id: string;
  slot_key: string;
  label: string;
  section: string;
  asset_type: string;
  url: string | null;
  default_file: string | null;
  updated_at: string;
}

// Vite glob for bundled assets
const assetModules = import.meta.glob<{ default: string }>('/src/assets/**/*', { eager: true });

function resolveAssetUrl(asset: SiteAsset): string {
  // Custom URL takes priority
  if (asset.url) return asset.url;
  // Fallback to bundled
  if (asset.default_file) {
    const key = `/src/assets/${asset.default_file}`;
    return assetModules[key]?.default || '';
  }
  return '';
}

export function useSiteAssets(section?: string) {
  return useQuery({
    queryKey: ["site-assets", section],
    queryFn: async () => {
      let q = supabase.from("site_assets").select("*").order("section").order("label");
      if (section) q = q.eq("section", section);
      const { data, error } = await q;
      if (error) throw error;
      return (data as SiteAsset[]).map(a => ({ ...a, resolvedUrl: resolveAssetUrl(a) }));
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useSiteAssetByKey(slotKey: string, fallbackImport?: string) {
  const { data } = useQuery({
    queryKey: ["site-assets", "key", slotKey],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("site_assets")
        .select("*")
        .eq("slot_key", slotKey)
        .maybeSingle();
      if (error) throw error;
      return data as SiteAsset | null;
    },
    staleTime: 5 * 60 * 1000,
  });

  if (data?.url) return data.url;
  if (data?.default_file) {
    const key = `/src/assets/${data.default_file}`;
    return assetModules[key]?.default || fallbackImport || '';
  }
  return fallbackImport || '';
}

export function useUpdateSiteAsset() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string | null }) => {
      const { error } = await supabase
        .from("site_assets")
        .update({ url, updated_at: new Date().toISOString() })
        .eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["site-assets"] });
    },
  });
}
