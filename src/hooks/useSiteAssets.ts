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

// Lazy Vite glob: evita il preload di TUTTI gli asset al bootstrap
const assetModules = import.meta.glob<{ default: string }>("/src/assets/**/*");
const assetUrlCache = new Map<string, string>();

async function resolveBundledAsset(defaultFile: string | null): Promise<string> {
  if (!defaultFile) return "";

  const key = `/src/assets/${defaultFile}`;
  const cached = assetUrlCache.get(key);
  if (cached) return cached;

  const loader = assetModules[key];
  if (!loader) return "";

  try {
    const mod = await loader();
    const resolved = mod?.default || "";
    if (resolved) assetUrlCache.set(key, resolved);
    return resolved;
  } catch {
    return "";
  }
}

async function resolveAssetUrl(asset: SiteAsset): Promise<string> {
  if (asset.url) return asset.url;
  return resolveBundledAsset(asset.default_file);
}

export function useSiteAssets(section?: string) {
  return useQuery({
    queryKey: ["site-assets", section],
    queryFn: async () => {
      let q = supabase.from("site_assets").select("*").order("section").order("label");
      if (section) q = q.eq("section", section);
      const { data, error } = await q;
      if (error) throw error;

      const rows = (data as SiteAsset[]) || [];
      return Promise.all(rows.map(async (a) => ({ ...a, resolvedUrl: await resolveAssetUrl(a) })));
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

  const { data: bundledUrl } = useQuery({
    queryKey: ["site-assets", "bundled", data?.default_file],
    queryFn: async () => resolveBundledAsset(data?.default_file ?? null),
    enabled: !!data?.default_file && !data?.url,
    staleTime: 5 * 60 * 1000,
  });

  if (data?.url) return data.url;
  return bundledUrl || fallbackImport || "";
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
