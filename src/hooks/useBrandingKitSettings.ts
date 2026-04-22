/**
 * useBrandingKitSettings — Persistenza Branding Kit (Mockup Suite Generator)
 *
 * Strategia "Cloud + cache locale":
 * 1. All'avvio legge istantaneamente da localStorage (caricamento immediato, zero flicker).
 * 2. In parallelo carica dal backend (user_branding_kit_settings) — se diverge, allinea cache.
 * 3. Ogni save scrive PRIMA in cache locale (UI ottimistica) e POI in cloud (debounced).
 *
 * Cross-device: avendo cloud, l'utente trova le stesse impostazioni su qualsiasi browser.
 * Offline / pre-login: la cache locale garantisce continuità.
 */
import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

export interface BrandingKitSettings {
  brandLocked: boolean;
  primaryColor: string | null;
  fontPairKey: string;
  fontHead: string | null;
  fontBody: string | null;
  googleFontsHref: string | null;
}

export const DEFAULT_BRANDING_KIT: BrandingKitSettings = {
  brandLocked: false,
  primaryColor: null,
  fontPairKey: "template",
  fontHead: null,
  fontBody: null,
  googleFontsHref: null,
};

const LS_KEY = "empire.brandingKit.v1";
const SAVE_DEBOUNCE_MS = 600;

function readLocal(): BrandingKitSettings | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return { ...DEFAULT_BRANDING_KIT, ...parsed };
  } catch {
    return null;
  }
}

function writeLocal(s: BrandingKitSettings) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(LS_KEY, JSON.stringify(s));
  } catch {
    /* quota / private mode — ignora */
  }
}

interface UseBrandingKitResult {
  settings: BrandingKitSettings;
  loading: boolean;
  syncing: boolean;
  lastSyncedAt: Date | null;
  update: (patch: Partial<BrandingKitSettings>) => void;
  reset: () => void;
}

export function useBrandingKitSettings(): UseBrandingKitResult {
  const { user } = useAuth();
  // Inizializza subito dalla cache locale per evitare flicker
  const [settings, setSettings] = useState<BrandingKitSettings>(
    () => readLocal() || DEFAULT_BRANDING_KIT
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [syncing, setSyncing] = useState<boolean>(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null);
  const saveTimerRef = useRef<number | null>(null);
  const mountedRef = useRef(true);

  // Carica dal cloud se loggato (e sostituisce cache locale se backend è più aggiornato)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("user_branding_kit_settings")
          .select(
            "brand_locked, primary_color, font_pair_key, font_head, font_body, google_fonts_href, updated_at"
          )
          .eq("user_id", user.id)
          .maybeSingle();
        if (cancelled) return;
        if (!error && data) {
          const next: BrandingKitSettings = {
            brandLocked: !!data.brand_locked,
            primaryColor: data.primary_color,
            fontPairKey: data.font_pair_key || "template",
            fontHead: data.font_head,
            fontBody: data.font_body,
            googleFontsHref: data.google_fonts_href,
          };
          setSettings(next);
          writeLocal(next);
          setLastSyncedAt(data.updated_at ? new Date(data.updated_at) : new Date());
        }
      } catch {
        /* offline — manteniamo cache locale */
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user?.id]);

  useEffect(() => {
    return () => {
      mountedRef.current = false;
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
    };
  }, []);

  // Persiste su cloud (debounced) — la cache locale è già scritta sincrono dentro update()
  const persistCloud = useCallback(
    (next: BrandingKitSettings) => {
      if (!user?.id) return;
      if (saveTimerRef.current) window.clearTimeout(saveTimerRef.current);
      saveTimerRef.current = window.setTimeout(async () => {
        if (!mountedRef.current) return;
        setSyncing(true);
        try {
          const { error } = await supabase
            .from("user_branding_kit_settings")
            .upsert(
              {
                user_id: user.id,
                brand_locked: next.brandLocked,
                primary_color: next.primaryColor,
                font_pair_key: next.fontPairKey,
                font_head: next.fontHead,
                font_body: next.fontBody,
                google_fonts_href: next.googleFontsHref,
              },
              { onConflict: "user_id" }
            );
          if (!error && mountedRef.current) setLastSyncedAt(new Date());
        } catch {
          /* swallow — cache locale resta valida */
        } finally {
          if (mountedRef.current) setSyncing(false);
        }
      }, SAVE_DEBOUNCE_MS);
    },
    [user?.id]
  );

  const update = useCallback(
    (patch: Partial<BrandingKitSettings>) => {
      setSettings((prev) => {
        const next = { ...prev, ...patch };
        writeLocal(next); // cache locale sincrona — istantanea
        persistCloud(next); // cloud debounced
        return next;
      });
    },
    [persistCloud]
  );

  const reset = useCallback(() => {
    setSettings(DEFAULT_BRANDING_KIT);
    writeLocal(DEFAULT_BRANDING_KIT);
    persistCloud(DEFAULT_BRANDING_KIT);
  }, [persistCloud]);

  return { settings, loading, syncing, lastSyncedAt, update, reset };
}
