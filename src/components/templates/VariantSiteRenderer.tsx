/**
 * VariantSiteRenderer
 *
 * Renderizza il sito demo /b/:slug usando la shell iPhone più adatta
 * (Strapizzami / Sakura Atelier / Pacifico Ceviche) per il `template_variant` scelto
 * dalla Demo Factory, con la palette e i font del mockup di riferimento.
 *
 * ⭐ v2 — Brand Identity Injection
 * Riceve TUTTI i dati estratti dal lead (logo, foto reali, descrizione,
 * social, indirizzo, telefono) e li inietta come "halo" sopra la shell:
 *  • logo float in alto a destra
 *  • foto reali fanno da gallery / fallback per item senza immagine
 *  • footer "Identità Brand" con address, phone, social, descrizione
 *  • hero usa la prima foto reale se non c'è hero esplicito
 */
import { useEffect, useMemo, useState } from "react";
import { Phone, MapPin, Globe, Instagram, Facebook, Home, BookOpen, Eye, ShoppingCart } from "lucide-react";
import { StrapizzamiSite, type StrapizzamiSiteData } from "@/components/templates/strapizzami/StrapizzamiSite";
import { PaperfishSite, type PaperfishSiteData } from "@/components/templates/paperfish/PaperfishSite";
import { BateySite, type BateySiteData } from "@/components/templates/batey/BateySite";
import {
  resolveVariantTheme,
  buildVariantStyleTag,
  type VariantThemeSpec,
} from "@/lib/template-variant-theme";

type ScreenKey = "home" | "menu" | "detail" | "cart";
const SCREEN_LABELS: Record<ScreenKey, { label: string; sub: string; Icon: any }> = {
  home: { label: "Home", sub: "Brand & Hero", Icon: Home },
  menu: { label: "Menu", sub: "Catalogo", Icon: BookOpen },
  detail: { label: "Dettaglio", sub: "Singolo item", Icon: Eye },
  cart: { label: "Carrello", sub: "Checkout", Icon: ShoppingCart },
};

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

interface BrandSocialLinks {
  website?: string | null;
  instagram?: string | null;
  facebook?: string | null;
}

interface VariantSiteRendererProps {
  variantId?: string | null;
  brandName: string;
  subtitle?: string;
  heroImageOverride?: string | null;
  heroTaglineOverride?: string | null;
  address?: string | null;
  items: ServiceItem[];
  /** ⭐ NEW — Brand identity dal lead (estratta dalla Demo Factory) */
  logoUrl?: string | null;
  galleryImages?: string[];
  brandDescription?: string | null;
  phone?: string | null;
  socialLinks?: BrandSocialLinks | null;
  city?: string | null;
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

/* ─── Map service → shell-specific item, with gallery fallback ─── */
function toShellItems(
  items: ServiceItem[],
  spec: VariantThemeSpec,
  gallery: string[],
): any[] {
  if (!items.length) return [];
  const fallbackImg = spec.heroImage;
  return items.map((i, idx) => {
    // ⭐ Priorità immagine: 1) image_url item, 2) foto reale dalla gallery (round-robin), 3) hero variant
    const galleryPick = gallery.length > 0 ? gallery[idx % gallery.length] : null;
    const finalImage = i.image_url || galleryPick || fallbackImg;
    return {
      id: String(i.id),
      name: i.name,
      description: i.description || "",
      price: Number(i.price) || 0,
      image: finalImage,
      category: i.category || (spec.defaultCategories[0] ?? "Servizi"),
      is_popular: !!i.is_popular,
      ingredients: i.description,
      ...(i.jp_label ? { jp_label: i.jp_label } : {}),
      ...(i.es_label ? { es_label: i.es_label } : {}),
    };
  });
}

/* ─── Default seed items (shown when DB empty for given variant) ─── */
function defaultItemsForVariant(spec: VariantThemeSpec, gallery: string[]): any[] {
  const cats = spec.defaultCategories;
  const pickImg = (i: number) => gallery[i % Math.max(gallery.length, 1)] || spec.heroImage;
  // Compose 6 plausible items per industry group
  if (spec.industryGroup === "beauty") {
    return [
      { id: "1", name: "Manicure Classica", description: "Cura cuticole, lima, smalto", price: 25, image: pickImg(0), category: cats[0] || "Manicure", is_popular: true },
      { id: "2", name: "Gel Color Premium", description: "Gel UV resistente 3+ settimane", price: 38, image: pickImg(1), category: cats[3] || "Gel & Semi" },
      { id: "3", name: "Pedicure Spa", description: "Scrub, massaggio, smalto", price: 45, image: pickImg(2), category: cats[1] || "Pedicure", is_popular: true },
      { id: "4", name: "Nail Art Design", description: "Decorazione personalizzata", price: 55, image: pickImg(3), category: cats[2] || "Nail Art" },
      { id: "5", name: "Trattamento Hand SPA", description: "Maschera idratante e massaggio", price: 30, image: pickImg(4), category: cats[4] || "Trattamenti" },
      { id: "6", name: "Ricostruzione Unghie", description: "Acrilico o gel sculturale", price: 65, image: pickImg(5), category: cats[3] || "Gel & Semi", is_popular: true },
    ];
  }
  if (spec.industryGroup === "ncc") {
    return [
      { id: "1", name: "Charter Privato Day", description: "Imbarcazione + skipper, 8 ore", price: 1800, image: pickImg(0), category: cats[0] || "Charter Privati", is_popular: true },
      { id: "2", name: "Sunset Cruise", description: "2 ore al tramonto con aperitivo", price: 480, image: pickImg(1), category: cats[3] || "Sunset Cruise", is_popular: true },
      { id: "3", name: "Tour Asinara Full Day", description: "Tour guidato con pranzo a bordo", price: 2400, image: pickImg(2), category: cats[2] || "Tour Asinara" },
      { id: "4", name: "Mezza Giornata", description: "4 ore costa nord", price: 950, image: pickImg(3), category: cats[1] || "Escursioni" },
      { id: "5", name: "Eventi Privati", description: "Compleanni, addii al celibato", price: 2200, image: pickImg(4), category: cats[4] || "Eventi" },
      { id: "6", name: "Transfer Porto-Hotel", description: "Servizio andata/ritorno", price: 180, image: pickImg(5), category: cats[1] || "Escursioni" },
    ];
  }
  if (spec.industryGroup === "fitness") {
    return [
      { id: "1", name: "Prenotazione Campo 90'", description: "Affitto campo coperto", price: 35, image: pickImg(0), category: cats[0] || "Prenota Campo", is_popular: true },
      { id: "2", name: "Lezione Privata", description: "Maestro federale + analisi video", price: 60, image: pickImg(1), category: cats[1] || "Lezioni", is_popular: true },
      { id: "3", name: "Pacchetto 10 Lezioni", description: "Sconto del 15%", price: 510, image: pickImg(2), category: cats[4] || "Pacchetti" },
      { id: "4", name: "Maestro Junior Under 16", description: "Programma giovani", price: 45, image: pickImg(3), category: cats[2] || "Maestri" },
      { id: "5", name: "Torneo Mensile", description: "Iscrizione torneo amatoriale", price: 30, image: pickImg(4), category: cats[3] || "Tornei" },
      { id: "6", name: "Abbonamento Mensile", description: "Accesso illimitato", price: 120, image: pickImg(5), category: cats[4] || "Pacchetti", is_popular: true },
    ];
  }
  // food default
  return [
    { id: "1", name: "Piatto del giorno", description: "Selezione dello chef", price: 18, image: pickImg(0), category: cats[0] || "Antipasti", is_popular: true },
    { id: "2", name: "Specialità della casa", description: "Ricetta firma", price: 24, image: pickImg(1), category: cats[1] || "Primi", is_popular: true },
    { id: "3", name: "Carne alla brace", description: "Cottura su fuoco vivo", price: 32, image: pickImg(2), category: cats[2] || "Secondi" },
    { id: "4", name: "Dessert artigianale", description: "Pasticceria interna", price: 9, image: pickImg(3), category: cats[3] || "Dolci" },
    { id: "5", name: "Calice di vino", description: "Selezione carta vini", price: 8, image: pickImg(4), category: cats[4] || "Vini" },
    { id: "6", name: "Antipasto misto", description: "Selezione di stagione", price: 14, image: pickImg(5), category: cats[0] || "Antipasti" },
  ];
}

/* ─── Brand Identity Halo — overlay non-invasivo sopra la shell iPhone ─── */
function BrandIdentityHalo({
  logoUrl,
  brandName,
  galleryImages,
  brandDescription,
  phone,
  address,
  socialLinks,
  city,
}: {
  logoUrl?: string | null;
  brandName: string;
  galleryImages: string[];
  brandDescription?: string | null;
  phone?: string | null;
  address?: string | null;
  socialLinks?: BrandSocialLinks | null;
  city?: string | null;
}) {
  const hasLogo = !!logoUrl;
  const hasSocial = !!(socialLinks?.website || socialLinks?.instagram || socialLinks?.facebook);
  const hasFooter = hasSocial || phone || address || brandDescription || galleryImages.length > 0;

  return (
    <>
      {/* Logo brand reale — float sticky in alto destra (sopra la shell) */}
      {hasLogo && (
        <div className="fixed top-3 right-3 z-[60] pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md rounded-full p-1 shadow-lg border border-black/5">
            <img
              src={logoUrl!}
              alt={`${brandName} logo`}
              className="w-10 h-10 rounded-full object-contain"
              onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }}
            />
          </div>
        </div>
      )}

      {/* Footer Brand Identity — sotto la shell iPhone, mostra dati reali estratti */}
      {hasFooter && (
        <section className="w-full bg-gradient-to-b from-background to-muted/30 border-t border-border/50 mt-0">
          <div className="max-w-2xl mx-auto px-5 py-8 space-y-6">
            <div className="text-center space-y-2">
              {hasLogo && (
                <img
                  src={logoUrl!}
                  alt={brandName}
                  className="w-16 h-16 rounded-xl object-contain mx-auto bg-white p-1 shadow-sm"
                  onError={(e) => { (e.currentTarget as HTMLElement).style.display = "none"; }}
                />
              )}
              <h3 className="text-xl font-bold tracking-tight">{brandName}</h3>
              {brandDescription && (
                <p className="text-sm text-muted-foreground leading-relaxed max-w-md mx-auto">
                  {brandDescription}
                </p>
              )}
            </div>

            {/* Gallery foto reali estratte dal sito del lead */}
            {galleryImages.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs uppercase tracking-widest text-muted-foreground text-center">
                  Galleria
                </p>
                <div className="grid grid-cols-3 gap-2">
                  {galleryImages.slice(0, 6).map((img, i) => (
                    <div
                      key={`${img}-${i}`}
                      className="aspect-square rounded-lg overflow-hidden bg-muted ring-1 ring-border/50"
                    >
                      <img
                        src={img}
                        alt={`${brandName} foto ${i + 1}`}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                        loading="lazy"
                        onError={(e) => { (e.currentTarget.parentElement as HTMLElement).style.display = "none"; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Contatti reali */}
            <div className="grid gap-2 text-sm">
              {(address || city) && (
                <a
                  href={address ? `https://maps.google.com/?q=${encodeURIComponent(address)}` : "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-start gap-2 text-foreground/80 hover:text-foreground transition-colors"
                >
                  <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                  <span className="leading-snug">{address || city}</span>
                </a>
              )}
              {phone && (
                <a href={`tel:${phone.replace(/\s/g, "")}`} className="flex items-center gap-2 text-foreground/80 hover:text-foreground transition-colors">
                  <Phone className="w-4 h-4 shrink-0 text-primary" />
                  <span>{phone}</span>
                </a>
              )}
            </div>

            {/* Social */}
            {hasSocial && (
              <div className="flex justify-center gap-3 pt-2">
                {socialLinks?.website && (
                  <a href={socialLinks.website} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                    aria-label="Sito web">
                    <Globe className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.instagram && (
                  <a href={socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                    aria-label="Instagram">
                    <Instagram className="w-4 h-4" />
                  </a>
                )}
                {socialLinks?.facebook && (
                  <a href={socialLinks.facebook} target="_blank" rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted hover:bg-primary hover:text-primary-foreground transition-all flex items-center justify-center"
                    aria-label="Facebook">
                    <Facebook className="w-4 h-4" />
                  </a>
                )}
              </div>
            )}

            <p className="text-[11px] uppercase tracking-[0.25em] text-muted-foreground/60 text-center pt-2">
              Demo personalizzata · Empire AI
            </p>
          </div>
        </section>
      )}
    </>
  );
}

export function VariantSiteRenderer({
  variantId,
  brandName,
  subtitle,
  heroImageOverride,
  heroTaglineOverride,
  address,
  items,
  logoUrl,
  galleryImages,
  brandDescription,
  phone,
  socialLinks,
  city,
}: VariantSiteRendererProps) {
  const spec = useMemo(() => resolveVariantTheme(variantId), [variantId]);
  useVariantThemeInjection(spec);

  // ⭐ Screen control — sincronizza Home/Menu/Dettaglio/Carrello con switcher floating
  const [activeScreen, setActiveScreen] = useState<ScreenKey>("home");

  const gallery = useMemo(
    () => Array.from(new Set((galleryImages || []).filter(Boolean) as string[])),
    [galleryImages],
  );

  // ⭐ Hero: override esplicito > prima foto reale > hero della variant
  const heroImage = heroImageOverride || gallery[0] || spec.heroImage;
  const heroTagline = heroTaglineOverride || spec.heroTagline;
  const finalSubtitle = subtitle || spec.subtitle;
  const finalAddress = address || "—";
  const shellItems = items.length > 0
    ? toShellItems(items, spec, gallery)
    : defaultItemsForVariant(spec, gallery);

  const sharedHalo = (
    <BrandIdentityHalo
      logoUrl={logoUrl}
      brandName={brandName}
      galleryImages={gallery}
      brandDescription={brandDescription}
      phone={phone}
      address={address}
      socialLinks={socialLinks}
      city={city}
    />
  );

  const screenSwitcher = (
    <ScreenSwitcher active={activeScreen} onChange={setActiveScreen} accent={spec.cssVars["--pf-primary"] || spec.cssVars["--strap-primary"] || spec.cssVars["--bt-primary"] || "#a78bfa"} />
  );

  if (spec.shell === "paperfish") {
    const data: PaperfishSiteData = {
      brandName,
      subtitle: finalSubtitle,
      heroImage,
      heroTagline,
      address: finalAddress,
      items: shellItems,
    };
    return (
      <>
        <PaperfishSite data={data} controlledScreen={activeScreen} onScreenChange={(s) => setActiveScreen(s as ScreenKey)} />
        {screenSwitcher}
        {sharedHalo}
      </>
    );
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
    return (
      <>
        <BateySite data={data} controlledScreen={activeScreen} onScreenChange={(s) => setActiveScreen(s as ScreenKey)} />
        {screenSwitcher}
        {sharedHalo}
      </>
    );
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
  return (
    <>
      <StrapizzamiSite data={data} controlledScreen={activeScreen} onScreenChange={(s) => setActiveScreen(s as ScreenKey)} />
      {screenSwitcher}
      {sharedHalo}
    </>
  );
}

/* ─── Floating Screen Switcher — replica le 4 preview viste dal venditore ─── */
function ScreenSwitcher({
  active,
  onChange,
  accent,
}: {
  active: ScreenKey;
  onChange: (s: ScreenKey) => void;
  accent: string;
}) {
  return (
    <div className="fixed bottom-20 left-1/2 -translate-x-1/2 z-[55] pointer-events-auto">
      <div
        className="flex items-center gap-1 px-2 py-1.5 rounded-full backdrop-blur-xl shadow-2xl"
        style={{
          background: "rgba(10,10,10,0.85)",
          border: `1px solid ${accent}40`,
          boxShadow: `0 8px 32px ${accent}30`,
        }}
      >
        {(Object.keys(SCREEN_LABELS) as ScreenKey[]).map((k) => {
          const meta = SCREEN_LABELS[k];
          const isActive = active === k;
          const Icon = meta.Icon;
          return (
            <button
              key={k}
              onClick={() => {
                onChange(k);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="flex flex-col items-center justify-center px-2.5 py-1.5 rounded-full transition-all"
              style={{
                background: isActive ? accent : "transparent",
                color: isActive ? "#fff" : "rgba(255,255,255,0.7)",
                minWidth: 56,
              }}
              aria-label={meta.label}
              title={`${meta.label} — ${meta.sub}`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span className="text-[9px] font-bold mt-0.5">{meta.label}</span>
            </button>
          );
        })}
      </div>
      <p className="text-[8px] uppercase tracking-[0.25em] text-white/80 text-center mt-1.5">
        4 schermate · come la preview
      </p>
    </div>
  );
}
