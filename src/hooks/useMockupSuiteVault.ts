import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface VaultMockupSuite {
  id: string;
  owner_id: string;
  business_name: string;
  business_sector: string | null;
  business_city: string | null;
  primary_color: string | null;
  engine: string;
  template_variant: string | null;
  status: string;
  screens: any;
  share_slug: string | null;
  view_count: number | null;
  credits_spent: number | null;
  lead_id: string | null;
  preview_id: string | null;
  generated_at: string | null;
  created_at: string;
  updated_at: string;
}

export function useMockupSuiteVault() {
  const [suites, setSuites] = useState<VaultMockupSuite[]>([]);
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

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
        .from("seller_mockup_suites")
        .select("*")
        .eq("owner_id", userId)
        .order("updated_at", { ascending: false })
        .limit(300);
      if (error) throw error;
      setSuites((data || []) as unknown as VaultMockupSuite[]);
    } catch (e: any) {
      console.error("[useMockupSuiteVault] fetch error", e);
      toast.error("Errore caricamento mockup suite");
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (userId) fetchAll();
  }, [userId, fetchAll]);

  const deleteSuite = useCallback(async (id: string) => {
    try {
      await supabase.from("seller_mockup_suites").delete().eq("id", id);
      setSuites(prev => prev.filter(s => s.id !== id));
      toast.success("Mockup suite eliminata");
    } catch (e: any) {
      toast.error("Errore eliminazione mockup");
    }
  }, []);

  const duplicateSuite = useCallback(async (id: string): Promise<VaultMockupSuite | null> => {
    if (!userId) {
      toast.error("Non autenticato");
      return null;
    }
    const original = suites.find(s => s.id === id);
    if (!original) {
      toast.error("Mockup non trovato");
      return null;
    }
    try {
      // Build a clean copy: NEW id/slug/dates, reset counters, mark as copy
      const baseName = original.business_name || "Mockup";
      const copyName = baseName.match(/\(copia( \d+)?\)$/i)
        ? baseName
        : `${baseName} (copia)`;

      const insertPayload: Record<string, any> = {
        owner_id: userId,
        business_name: copyName,
        business_sector: original.business_sector,
        business_city: original.business_city,
        primary_color: original.primary_color,
        engine: original.engine,
        template_variant: original.template_variant,
        status: original.status || "complete",
        screens: original.screens,
        view_count: 0,
        credits_spent: 0,
        // share_slug intentionally omitted -> generated fresh by DB / left null
        // lead_id / preview_id omitted -> standalone copy
      };

      const { data, error } = await supabase
        .from("seller_mockup_suites")
        .insert(insertPayload as any)
        .select()
        .single();
      if (error) throw error;

      const created = data as unknown as VaultMockupSuite;
      setSuites(prev => [created, ...prev]);
      toast.success("Mockup duplicato");
      return created;
    } catch (e: any) {
      console.error("[useMockupSuiteVault] duplicate error", e);
      toast.error(e?.message || "Errore duplicazione mockup");
      return null;
    }
  }, [userId, suites]);

  return { suites, loading, userId, fetchAll, deleteSuite, duplicateSuite };
}
