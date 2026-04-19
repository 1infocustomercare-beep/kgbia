/**
 * VariantSiteRenderer
 *
 * Renderizza il sito demo /b/:slug usando la shell iPhone più adatta
 * (Strapizzami / Paperfish / Batey) per il `template_variant` scelto
 * dalla Demo Factory, con la palette e i font del mockup di riferimento.
 *
 * Usato come "switch universale" da FoodPublicSite, BeautyPublicSite,
 * NCCPublicSite, FitnessPublicSite quando `theme_config.template_variant`
 * è valorizzato.
 */
import { useEffect, useMemo } from "react";
import { StrapizzamiSite, type StrapizzamiSiteData } from "@/components/templates/strapizzami/StrapizzamiSite";
import { PaperfishSite, type PaperfishSiteData } from "@/components/templates/paperfish/PaperfishSite";
import { BateySite, type BateySiteData } from "@/components/templates/batey/BateySite";
import {
  resolveVariantTheme,
  buildVariantStyleTag,
  type VariantThemeSpec,
} from "@/lib/template-variant-theme";

interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  category?: string;
  is_popular?: boolean;
  image_url?: string | null;
  jp_label?: string;
  es_label?: string;
}

interface VariantSiteRendererProps {
  variantId?: string | null;
  brandName: string;
  subtitle?: string;
  heroImageOverride?: string | null;
  heroTaglineOverride?: string | null;
  address?: string | null;
  items: ServiceItem[];
}

/* ─── Inject variant CSS overrides + Google Fonts once ─── */
function useVariantThemeInjection(spec: VariantThemeSpec) {
  useEffect(() => {
    // Google Fonts
    if (spec.googleFontsHref) {
      const fontId = `variant-fonts-${spec.shell}`;
      if (!document.getElementById(fontId)) {
        const link = document.createElement("link");
        link.id = fontId;
        link.rel = "stylesheet";
        link.href = spec.googleFontsHref;
        document.head.appendChild(link);
      }
    }
    // Palette overrides — re-injected per-render so switching variants is live
    const styleId = `variant-theme-overrides`;
    let style = document.getElementById(styleId) as HTMLStyleElement | null;
    if (!style) {
      style = document.createElement("style");
      style.id = styleId;
      document.head.appendChild(style);
    }
    style.innerHTML = buildVariantStyleTag(spec);
    return () => {
      // keep style for back-nav; harmless on next mount it's overwritten
    };
  }, [spec]);
}

/* ─── Map service → shell-specific item ─── */
function toShellItems(items: ServiceItem[], spec: VariantThemeSpec): any[] {
  if (!items.length) return [];
  const fallbackImg = spec.heroImage;
  return items.map((i) => ({
    id: String(i.id),
    name: i.name,
    description: i.description || "",
    price: Number(i.price) || 0,
    image: i.image_url || fallbackImg,
    category: i.category || (spec.defaultCategories[0] ?? "Servizi"),
    is_popular: !!i.is_popular,
    ingredients: i.description,
    ...(i.jp_label ? { jp_label: i.jp_label } : {}),
    ...(i.es_label ? { es_label: i.es_label } : {}),
  }));
}

/* ─── Default seed items (shown when DB empty for given variant) ─── */
function defaultItemsForVariant(spec: VariantThemeSpec): any[] {
  const cats = spec.defaultCategories;
  // Compose 6 plausible items per industry group
  if (spec.industryGroup === "beauty") {
    return [
      { id: "1", name: "Manicure Classica", description: "Cura cuticole, lima, smalto", price: 25, image: spec.heroImage, category: cats[0] || "Manicure", is_popular: true },
      { id: "2", name: "Gel Color Premium", description: "Gel UV resistente 3+ settimane", price: 38, image: spec.heroImage, category: cats[3] || "Gel & Semi" },
      { id: "3", name: "Pedicure Spa", description: "Scrub, massaggio, smalto", price: 45, image: spec.heroImage, category: cats[1] || "Pedicure", is_popular: true },
      { id: "4", name: "Nail Art Design", description: "Decorazione personalizzata", price: 55, image: spec.heroImage, category: cats[2] || "Nail Art" },
      { id: "5", name: "Trattamento Hand SPA", description: "Maschera idratante e massaggio", price: 30, image: spec.heroImage, category: cats[4] || "Trattamenti" },
      { id: "6", name: "Ricostruzione Unghie", description: "Acrilico o gel sculturale", price: 65, image: spec.heroImage, category: cats[3] || "Gel & Semi", is_popular: true },
    ];
  }
  if (spec.industryGroup === "ncc") {
    return [
      { id: "1", name: "Charter Privato Day", description: "Imbarcazione + skipper, 8 ore", price: 1800, image: spec.heroImage, category: cats[0] || "Charter Privati", is_popular: true },
      { id: "2", name: "Sunset Cruise", description: "2 ore al tramonto con aperitivo", price: 480, image: spec.heroImage, category: cats[3] || "Sunset Cruise", is_popular: true },
      { id: "3", name: "Tour Asinara Full Day", description: "Tour guidato con pranzo a bordo", price: 2400, image: spec.heroImage, category: cats[2] || "Tour Asinara" },
      { id: "4", name: "Mezza Giornata", description: "4 ore costa nord", price: 950, image: spec.heroImage, category: cats[1] || "Escursioni" },
      { id: "5", name: "Eventi Privati", description: "Compleanni, addii al celibato", price: 2200, image: spec.heroImage, category: cats[4] || "Eventi" },
      { id: "6", name: "Transfer Porto-Hotel", description: "Servizio andata/ritorno", price: 180, image: spec.heroImage, category: cats[1] || "Escursioni" },
    ];
  }
  if (spec.industryGroup === "fitness") {
    return [
      { id: "1", name: "Prenotazione Campo 90'", description: "Affitto campo coperto", price: 35, image: spec.heroImage, category: cats[0] || "Prenota Campo", is_popular: true },
      { id: "2", name: "Lezione Privata", description: "Maestro federale + analisi video", price: 60, image: spec.heroImage, category: cats[1] || "Lezioni", is_popular: true },
      { id: "3", name: "Pacchetto 10 Lezioni", description: "Sconto del 15%", price: 510, image: spec.heroImage, category: cats[4] || "Pacchetti" },
      { id: "4", name: "Maestro Junior Under 16", description: "Programma giovani", price: 45, image: spec.heroImage, category: cats[2] || "Maestri" },
      { id: "5", name: "Torneo Mensile", description: "Iscrizione torneo amatoriale", price: 30, image: spec.heroImage, category: cats[3] || "Tornei" },
      { id: "6", name: "Abbonamento Mensile", description: "Accesso illimitato", price: 120, image: spec.heroImage, category: cats[4] || "Pacchetti", is_popular: true },
    ];
  }
  // food default
  return [
    { id: "1", name: "Piatto del giorno", description: "Selezione dello chef", price: 18, image: spec.heroImage, category: cats[0] || "Antipasti", is_popular: true },
    { id: "2", name: "Specialità della casa", description: "Ricetta firma", price: 24, image: spec.heroImage, category: cats[1] || "Primi", is_popular: true },
    { id: "3", name: "Carne alla brace", description: "Cottura su fuoco vivo", price: 32, image: spec.heroImage, category: cats[2] || "Secondi" },
    { id: "4", name: "Dessert artigianale", description: "Pasticceria interna", price: 9, image: spec.heroImage, category: cats[3] || "Dolci" },
    { id: "5", name: "Calice di vino", description: "Selezione carta vini", price: 8, image: spec.heroImage, category: cats[4] || "Vini" },
    { id: "6", name: "Antipasto misto", description: "Selezione di stagione", price: 14, image: spec.heroImage, category: cats[0] || "Antipasti" },
  ];
}

export function VariantSiteRenderer({
  variantId,
  brandName,
  subtitle,
  heroImageOverride,
  heroTaglineOverride,
  address,
  items,
}: VariantSiteRendererProps) {
  const spec = useMemo(() => resolveVariantTheme(variantId), [variantId]);
  useVariantThemeInjection(spec);

  const heroImage = heroImageOverride || spec.heroImage;
  const heroTagline = heroTaglineOverride || spec.heroTagline;
  const finalSubtitle = subtitle || spec.subtitle;
  const finalAddress = address || "—";
  const shellItems = items.length > 0 ? toShellItems(items, spec) : defaultItemsForVariant(spec);

  if (spec.shell === "paperfish") {
    const data: PaperfishSiteData = {
      brandName,
      subtitle: finalSubtitle,
      heroImage,
      heroTagline,
      address: finalAddress,
      items: shellItems,
    };
    return <PaperfishSite data={data} />;
  }

  if (spec.shell === "batey") {
    const data: BateySiteData = {
      brandName,
      subtitle: finalSubtitle,
      heroImage,
      heroTagline,
      address: finalAddress,
      items: shellItems,
    };
    return <BateySite data={data} />;
  }

  // strapizzami (default)
  const data: StrapizzamiSiteData = {
    brandName,
    subtitle: finalSubtitle,
    heroImage,
    heroTagline,
    address: finalAddress,
    items: shellItems,
  };
  return <StrapizzamiSite data={data} />;
}
