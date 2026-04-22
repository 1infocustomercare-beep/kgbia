import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export type MockupGenerationEngine = "ai" | "template" | "hybrid";

export interface VaultMockupSuite {
  id: string;
  owner_id: string;
  business_name: string;
  business_sector: string | null;
  business_city: string | null;
  primary_color: string | null;
  /** Engine tecnico di rendering (es. 'react'). Distinto da generation_engine. */
  engine: string;
  /** Engine logico di generazione: ai = generato da AI con scraping, template = preset manuale, hybrid = misto */
  generation_engine: MockupGenerationEngine;
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
  is_favorite: boolean;
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

  /**
   * Marca/smarca una mockup suite come "preferita" del seller, così la
   * versione scelta è subito ritrovabile nelle prossime sessioni.
   * Update ottimistico + rollback in caso di errore.
   */
  const toggleFavorite = useCallback(async (id: string, current: boolean) => {
    const next = !current;
    setSuites(prev => prev.map(s => s.id === id ? { ...s, is_favorite: next } : s));
    const { error } = await supabase
      .from("seller_mockup_suites")
      .update({ is_favorite: next } as any)
      .eq("id", id);
    if (error) {
      setSuites(prev => prev.map(s => s.id === id ? { ...s, is_favorite: current } : s));
      toast.error("Impossibile aggiornare il preferito");
      return;
    }
    toast.success(next ? "Aggiunta ai preferiti ⭐" : "Rimossa dai preferiti");
  }, []);

  return { suites, loading, userId, fetchAll, deleteSuite, toggleFavorite };
}
