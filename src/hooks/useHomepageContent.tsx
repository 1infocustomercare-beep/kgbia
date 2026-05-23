import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HomepageContent, EMPTY_CONTENT, mergeContent } from "@/lib/homepage-content";

type Ctx = {
  content: HomepageContent;
  isPreview: boolean;
  loading: boolean;
};

const HomepageContentContext = createContext<Ctx>({
  content: EMPTY_CONTENT,
  isPreview: false,
  loading: false,
});

export const HOMEPAGE_PREVIEW_MSG = "empire:homepage-preview";

/**
 * Provider per i contenuti modificabili della homepage.
 * - In modalità pubblica legge `published_content` dalla tabella `homepage_content`.
 * - In modalità preview (?preview=1) legge `content` (bozza) e applica overlay live via postMessage.
 */
export function HomepageContentProvider({ children }: { children: ReactNode }) {
  const isPreview = useMemo(() => {
    if (typeof window === "undefined") return false;
    return new URLSearchParams(window.location.search).get("preview") === "1";
  }, []);

  const [remote, setRemote] = useState<HomepageContent>(EMPTY_CONTENT);
  const [overlay, setOverlay] = useState<HomepageContent>(EMPTY_CONTENT);
  const [loading, setLoading] = useState(true);

  // Fetch iniziale dal DB
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data, error } = await supabase
          .from("homepage_content")
          .select("content, published_content")
          .eq("singleton", true)
          .maybeSingle();
        if (cancelled) return;
        if (!error && data) {
          const picked = isPreview ? (data.content as any) : (data.published_content as any);
          setRemote((picked ?? {}) as HomepageContent);
        }
      } catch {
        // silent: fallback ai default hardcoded
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isPreview]);

  // Live overlay via postMessage (solo in preview)
  useEffect(() => {
    if (!isPreview || typeof window === "undefined") return;
    const onMsg = (e: MessageEvent) => {
      const d = e.data;
      if (!d || typeof d !== "object" || d.type !== HOMEPAGE_PREVIEW_MSG) return;
      setOverlay((d.content as HomepageContent) ?? EMPTY_CONTENT);
    };
    window.addEventListener("message", onMsg);
    // Segnale al parent che siamo pronti
    try {
      window.parent?.postMessage({ type: "empire:homepage-preview-ready" }, "*");
    } catch {}
    return () => window.removeEventListener("message", onMsg);
  }, [isPreview]);

  const value = useMemo<Ctx>(
    () => ({ content: mergeContent(remote, isPreview ? overlay : null), isPreview, loading }),
    [remote, overlay, isPreview, loading]
  );

  return <HomepageContentContext.Provider value={value}>{children}</HomepageContentContext.Provider>;
}

export function useHomepageContent() {
  return useContext(HomepageContentContext);
}

/** Helper: ritorna il valore override oppure il default. */
export function pick<T>(value: T | undefined | null, fallback: T): T {
  if (value === undefined || value === null) return fallback;
  if (typeof value === "string" && value.trim() === "") return fallback;
  if (Array.isArray(value) && value.length === 0) return fallback;
  return value;
}
