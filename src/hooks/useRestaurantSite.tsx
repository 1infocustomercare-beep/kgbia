import { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import {
  RestaurantSiteContent,
  EMPTY_SITE,
  mergeSite,
  extractSiteOverride,
} from "@/lib/restaurant-site-content";

type Ctx = {
  content: RestaurantSiteContent;
  isPreview: boolean;
};

const RestaurantSiteContext = createContext<Ctx>({ content: EMPTY_SITE, isPreview: false });

export const useRestaurantSite = () => useContext(RestaurantSiteContext);

/**
 * Provider che:
 *  - parte dai contenuti salvati su restaurants.theme_config.site
 *  - quando la pagina è caricata in iframe con ?preview=1, ascolta postMessage
 *    "RESTAURANT_SITE_PREVIEW_UPDATE" per applicare LIVE le modifiche dell'editor.
 */
export function RestaurantSiteProvider({
  restaurant,
  children,
}: {
  restaurant: any;
  children: ReactNode;
}) {
  const persisted = useMemo(() => extractSiteOverride(restaurant), [restaurant]);
  const [draft, setDraft] = useState<RestaurantSiteContent | null>(null);

  const isPreview =
    typeof window !== "undefined" &&
    new URLSearchParams(window.location.search).get("preview") === "1";

  useEffect(() => {
    if (!isPreview) return;
    const onMsg = (e: MessageEvent) => {
      if (e?.data?.type === "RESTAURANT_SITE_PREVIEW_UPDATE" && e.data.content) {
        setDraft(e.data.content as RestaurantSiteContent);
      }
      if (e?.data?.type === "RESTAURANT_SITE_PREVIEW_RESET") {
        setDraft(null);
      }
    };
    window.addEventListener("message", onMsg);
    // Annuncia che siamo pronti
    window.parent?.postMessage({ type: "RESTAURANT_SITE_PREVIEW_READY" }, "*");
    return () => window.removeEventListener("message", onMsg);
  }, [isPreview]);

  const content = useMemo(
    () => mergeSite(persisted, draft),
    [persisted, draft]
  );

  return (
    <RestaurantSiteContext.Provider value={{ content, isPreview }}>
      {children}
    </RestaurantSiteContext.Provider>
  );
}
