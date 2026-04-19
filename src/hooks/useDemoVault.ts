import { useCallback, useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VaultDemo {
  id: string;
  owner_id: string;
  display_name: string;
  original_lead_name: string;
  sector: string;
  sector_label: string | null;
  sub_sector: string | null;
  template_variant: string;
  theme_hint: string | null;
  tenant_id: string | null;
  tenant_kind: string | null;
  tenant_slug: string | null;
  preview_url: string;
  admin_url: string;
  admin_email: string | null;
  admin_password: string | null;
  magic_link: string | null;
  lead_snapshot: any;
  brand_payload: any;
  images_payload: any;
  outreach_payload: any;
  full_result: any;
  is_favorite: boolean;
  is_archived: boolean;
  reuse_count: number;
  last_reused_at: string | null;
  last_reused_for_lead: string | null;
  tags: string[] | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface SaveDemoInput {
  displayName?: string;
  leadName: string;
  sector: string;
  sectorLabel?: string;
  subSector?: string;
  templateVariant: string;
  themeHint?: string;
  tenantId?: string | null;
  tenantKind?: "restaurant" | "company" | null;
  tenantSlug?: string | null;
  previewUrl: string;
  adminUrl: string;
  magicLink?: string | null;
  adminEmail?: string | null;
  adminPassword?: string | null;
  leadSnapshot?: Record<string, any>;
  brandPayload?: Record<string, any>;
  imagesPayload?: Record<string, any>;
  outreachPayload?: Record<string, any>;
  fullResult?: Record<string, any>;
}

export interface RemapInput {
  vaultId: string;
  newLead: {
    businessName: string;
    sector?: string;
    sectorLabel?: string;
    city?: string;
    zone?: string;
    fullAddress?: string;
    phone?: string | null;
    email?: string | null;
    website?: string | null;
    instagram?: string | null;
    facebook?: string | null;
    googleRating?: number;
    googleReviews?: number;
    googleMapsUrl?: string | null;
  };
  leadId?: string | null;
}

export function useDemoVault() {
  const [demos, setDemos] = useState<VaultDemo[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  // Auth bootstrap
  useEffect(() => {
    let mounted = true;
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setUserId(data.user?.id || null);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUserId(session?.user?.id || null);
    });
    return () => { mounted = false; sub.subscription.unsubscribe(); };
  }, []);

  const fetchAll = useCallback(async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("seller_demo_vault" as any)
        .select("*")
        .eq("owner_id", userId)
        .eq("is_archived", false)
        .order("is_favorite", { ascending: false })
        .order("updated_at", { ascending: false })
        .limit(200);
      if (error) throw error;
      setDemos((data || []) as unknown as VaultDemo[]);
    } catch (e: any) {
      console.error("[useDemoVault] fetch error", e);
      toast.error("Errore caricamento vault demo");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchAll();
  }, [userId, fetchAll]);

  /** Salva una demo nella vault (chiamato dopo runDemoFactory con successo). Idempotente per (owner, tenant_slug, template_variant). */
  const saveDemo = useCallback(async (input: SaveDemoInput): Promise<VaultDemo | null> => {
    if (!userId) return null;
    try {
      // Dedup: stesso slug + variant per stesso owner = aggiorno
      const slug = input.tenantSlug || `${input.templateVariant}-${Date.now()}`;
      const display = input.displayName?.trim() || `Demo ${input.leadName} · ${input.templateVariant}`;

      const { data: existing } = await supabase
        .from("seller_demo_vault" as any)
        .select("id")
        .eq("owner_id", userId)
        .eq("tenant_slug", slug)
        .eq("template_variant", input.templateVariant)
        .maybeSingle();
      const existingId = (existing as any)?.id as string | undefined;

      const payload: any = {
        owner_id: userId,
        display_name: display,
        original_lead_name: input.leadName,
        sector: input.sector,
        sector_label: input.sectorLabel || null,
        sub_sector: input.subSector || null,
        template_variant: input.templateVariant,
        theme_hint: input.themeHint || null,
        tenant_id: input.tenantId || null,
        tenant_kind: input.tenantKind || null,
        tenant_slug: slug,
        preview_url: input.previewUrl,
        admin_url: input.adminUrl,
        magic_link: input.magicLink || null,
        admin_email: input.adminEmail || null,
        admin_password: input.adminPassword || null,
        lead_snapshot: input.leadSnapshot || {},
        brand_payload: input.brandPayload || {},
        images_payload: input.imagesPayload || {},
        outreach_payload: input.outreachPayload || {},
        full_result: input.fullResult || {},
      };

      if (existingId) {
        const { data, error } = await supabase
          .from("seller_demo_vault" as any)
          .update(payload)
          .eq("id", existingId)
          .select()
          .single();
        if (error) throw error;
        await fetchAll();
        return data as unknown as VaultDemo;
      } else {
        const { data, error } = await supabase
          .from("seller_demo_vault" as any)
          .insert(payload)
          .select()
          .single();
        if (error) throw error;
        await fetchAll();
        return data as unknown as VaultDemo;
      }
    } catch (e: any) {
      console.error("[useDemoVault] save error", e);
      toast.error("Errore salvataggio demo nella vault", { description: e?.message });
      return null;
    }
  }, [userId, fetchAll]);

  /** Trova demo compatibile per un lead (settore + variant) — usata per suggerimento "Riusa senza spendere crediti" */
  const findCompatible = useCallback((sector: string, templateVariant?: string, subSector?: string): VaultDemo[] => {
    return demos
      .filter(d => !d.is_archived)
      .filter(d => d.sector === sector)
      .filter(d => !templateVariant || d.template_variant === templateVariant || templateVariant === "default")
      .filter(d => !subSector || !d.sub_sector || d.sub_sector === subSector)
      .sort((a, b) => {
        // Prefer favorite, then exact variant match, then most reused
        if (a.is_favorite !== b.is_favorite) return a.is_favorite ? -1 : 1;
        const aExact = templateVariant && a.template_variant === templateVariant ? 1 : 0;
        const bExact = templateVariant && b.template_variant === templateVariant ? 1 : 0;
        if (aExact !== bExact) return bExact - aExact;
        return (b.reuse_count || 0) - (a.reuse_count || 0);
      });
  }, [demos]);

  /** Riutilizza una demo: chiama edge function remap (zero crediti). */
  const reuseDemo = useCallback(async (input: RemapInput) => {
    try {
      const { data, error } = await supabase.functions.invoke("remap-demo-from-vault", {
        body: input,
      });
      if (error || !data?.success) {
        throw new Error(error?.message || data?.error || "Riutilizzo fallito");
      }
      await fetchAll();
      toast.success("✓ Demo riutilizzata · 0 crediti spesi", {
        description: `${input.newLead.businessName} ora usa lo stesso template senza ricreare nulla`,
      });
      return data;
    } catch (e: any) {
      console.error("[useDemoVault] reuse error", e);
      toast.error("Errore riutilizzo demo", { description: e?.message });
      return null;
    }
  }, [fetchAll]);

  const toggleFavorite = useCallback(async (id: string, current: boolean) => {
    try {
      await supabase.from("seller_demo_vault" as any).update({ is_favorite: !current }).eq("id", id);
      setDemos(prev => prev.map(d => d.id === id ? { ...d, is_favorite: !current } : d));
    } catch (e: any) {
      toast.error("Errore aggiornamento preferito");
    }
  }, []);

  const renameDemo = useCallback(async (id: string, newName: string) => {
    if (!newName.trim()) return;
    try {
      await supabase.from("seller_demo_vault" as any).update({ display_name: newName.trim() }).eq("id", id);
      setDemos(prev => prev.map(d => d.id === id ? { ...d, display_name: newName.trim() } : d));
      toast.success("Nome aggiornato");
    } catch (e: any) {
      toast.error("Errore rinomina");
    }
  }, []);

  const archiveDemo = useCallback(async (id: string) => {
    try {
      await supabase.from("seller_demo_vault" as any).update({ is_archived: true }).eq("id", id);
      setDemos(prev => prev.filter(d => d.id !== id));
      toast.success("Demo archiviata");
    } catch (e: any) {
      toast.error("Errore archiviazione");
    }
  }, []);

  const deleteDemo = useCallback(async (id: string) => {
    try {
      await supabase.from("seller_demo_vault" as any).delete().eq("id", id);
      setDemos(prev => prev.filter(d => d.id !== id));
      toast.success("Demo eliminata definitivamente");
    } catch (e: any) {
      toast.error("Errore eliminazione");
    }
  }, []);

  return {
    demos,
    loading,
    userId,
    fetchAll,
    saveDemo,
    findCompatible,
    reuseDemo,
    toggleFavorite,
    renameDemo,
    archiveDemo,
    deleteDemo,
  };
}
