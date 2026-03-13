import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

// Bundled asset mapping (for items seeded with /bundled/ paths)
import videoHero from "@/assets/video-hero-empire.mp4";
import videoIndustries from "@/assets/video-industries.mp4";
import videoFeatures from "@/assets/video-features.mp4";
import videoPartner from "@/assets/video-partner-pitch.mp4";
import videoPartnerRecruit from "@/assets/video-partner-recruit.mp4";
import videoNccHero from "@/assets/video-ncc-hero.mp4";
import videoCreativeRistoro from "@/assets/creative-ristoro.mp4";
import heroRestaurant from "@/assets/hero-restaurant.mp4";
import heroLanding from "@/assets/hero-landing.jpg";
import mockupCliente from "@/assets/mockup-cliente.jpg";
import mockupAdmin from "@/assets/mockup-admin.jpg";
import mockupCucina from "@/assets/mockup-cucina.jpg";

const BUNDLED_MAP: Record<string, string> = {
  "/bundled/video-hero-empire.mp4": videoHero,
  "/bundled/video-industries.mp4": videoIndustries,
  "/bundled/video-features.mp4": videoFeatures,
  "/bundled/video-partner-pitch.mp4": videoPartner,
  "/bundled/video-partner-recruit.mp4": videoPartnerRecruit,
  "/bundled/video-ncc-hero.mp4": videoNccHero,
  "/bundled/hero-landing.jpg": heroLanding,
  "/bundled/mockup-cliente.jpg": mockupCliente,
  "/bundled/mockup-admin.jpg": mockupAdmin,
  "/bundled/mockup-cucina.jpg": mockupCucina,
};

export interface MediaItem {
  id: string;
  name: string;
  type: "video" | "image";
  url: string;
  resolvedUrl: string; // actual src for rendering
  section: string;
  description: string;
  dimensions: string;
  sort_order: number;
  is_bundled: boolean;
  created_at: string;
}

function resolveUrl(url: string): string {
  if (url.startsWith("/bundled/")) {
    return BUNDLED_MAP[url] || url;
  }
  return url;
}

export function useMediaVault() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = useCallback(async () => {
    const { data, error } = await supabase
      .from("media_vault")
      .select("*")
      .order("sort_order", { ascending: true });

    if (error) {
      console.error("media_vault fetch error", error);
      return;
    }

    setItems(
      (data || []).map((d: any) => ({
        ...d,
        resolvedUrl: resolveUrl(d.url),
      }))
    );
    setLoading(false);
  }, []);

  // Initial fetch + realtime subscription
  useEffect(() => {
    fetchItems();

    const channel = supabase
      .channel("media_vault_changes")
      .on("postgres_changes", { event: "*", schema: "public", table: "media_vault" }, () => {
        fetchItems();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchItems]);

  const addItem = async (item: { name: string; type: "video" | "image"; url: string; section?: string; description?: string; dimensions?: string }) => {
    const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.sort_order)) : 0;
    const { error } = await supabase.from("media_vault").insert({
      name: item.name,
      type: item.type,
      url: item.url,
      section: item.section || "",
      description: item.description || "",
      dimensions: item.dimensions || "",
      sort_order: maxOrder + 1,
      is_bundled: false,
    });
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Media aggiunto", description: item.name });
    }
  };

  const deleteItem = async (id: string) => {
    const item = items.find((i) => i.id === id);
    // Delete from storage if uploaded
    if (item && !item.is_bundled && item.url.includes("media-vault")) {
      const path = item.url.split("/media-vault/")[1];
      if (path) await supabase.storage.from("media-vault").remove([path]);
    }
    const { error } = await supabase.from("media_vault").delete().eq("id", id);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Media eliminato" });
    }
  };

  const updateItem = async (id: string, updates: Partial<{ name: string; section: string; description: string; dimensions: string; sort_order: number }>) => {
    const { error } = await supabase.from("media_vault").update({ ...updates, updated_at: new Date().toISOString() }).eq("id", id);
    if (error) toast({ title: "Errore", description: error.message, variant: "destructive" });
  };

  const moveItem = async (id: string, direction: "up" | "down") => {
    const idx = items.findIndex((i) => i.id === id);
    if (idx < 0) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= items.length) return;

    const a = items[idx];
    const b = items[swapIdx];

    await Promise.all([
      supabase.from("media_vault").update({ sort_order: b.sort_order }).eq("id", a.id),
      supabase.from("media_vault").update({ sort_order: a.sort_order }).eq("id", b.id),
    ]);
  };

  const uploadFile = async (file: File): Promise<string | null> => {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage.from("media-vault").upload(path, file);
    if (error) {
      toast({ title: "Upload fallito", description: error.message, variant: "destructive" });
      return null;
    }
    const { data: urlData } = supabase.storage.from("media-vault").getPublicUrl(path);
    return urlData.publicUrl;
  };

  return { items, loading, addItem, deleteItem, updateItem, moveItem, uploadFile, refetch: fetchItems };
}
