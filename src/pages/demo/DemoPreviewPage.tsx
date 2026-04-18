import { useMemo, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ChevronLeft, ChevronRight, Globe, LayoutTemplate, MapPin, Monitor, Smartphone } from "lucide-react";

import BackButton from "@/components/BackButton";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { SECTOR_PORTFOLIO, type MockupStyle } from "@/data/sector-mockup-images";

type VariantConfig = {
  sectorId: string;
  brand: string;
  style: string;
  label: string;
  accent: string;
  screenLabels: [string, string, string, string];
};

const VARIANT_MAP: Record<string, VariantConfig> = {
  "cote-obsidian": {
    sectorId: "food",
    brand: "COTE Miami",
    style: "Obsidian",
    label: "COTE Obsidian",
    accent: "43 52% 54%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "cote-ivory": {
    sectorId: "food",
    brand: "COTE Miami",
    style: "Ivory",
    label: "COTE Ivory",
    accent: "38 45% 63%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "cote-marble": {
    sectorId: "food",
    brand: "COTE Miami",
    style: "Marble",
    label: "COTE Marble",
    accent: "32 28% 44%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "paperfish-sakura": {
    sectorId: "food",
    brand: "Paperfish Sushi",
    style: "Sakura",
    label: "Paperfish Sakura",
    accent: "337 57% 71%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "paperfish-dark": {
    sectorId: "food",
    brand: "Paperfish Sushi",
    style: "Luxury Dark",
    label: "Paperfish Luxury Dark",
    accent: "43 52% 54%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "lavang-noir": {
    sectorId: "food",
    brand: "La Vang Vietnamese",
    style: "Noir Saigon",
    label: "La Vang Noir",
    accent: "43 74% 56%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "midtown-kosher": {
    sectorId: "food",
    brand: "Midtown Kosher",
    style: "Style A",
    label: "Midtown Kosher",
    accent: "33 29% 42%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "batey-pacifico": {
    sectorId: "food",
    brand: "Batey Cevicheria",
    style: "Costa Pacifico",
    label: "Batey Pacifico",
    accent: "188 62% 61%",
    screenLabels: ["Home", "Menu", "Dettaglio", "Carrello"],
  },
  "neo-nails-lavender": {
    sectorId: "beauty",
    brand: "Neo Nails Brickell",
    style: "Lavender Luxe",
    label: "Neo Nails Lavender",
    accent: "267 47% 63%",
    screenLabels: ["Home", "Servizi", "Dettaglio", "Booking"],
  },
  "neo-nails-blush": {
    sectorId: "beauty",
    brand: "Neo Nails Brickell",
    style: "Blush Rosegold",
    label: "Neo Nails Blush",
    accent: "338 48% 57%",
    screenLabels: ["Home", "Servizi", "Dettaglio", "Booking"],
  },
  "tatush-hair": {
    sectorId: "beauty",
    brand: "Tatush Hair Fragrance",
    style: "Mobile",
    label: "Tatush Hair",
    accent: "43 52% 54%",
    screenLabels: ["Home", "Shop", "Dettaglio", "Carrello"],
  },
  "asinara-azure": {
    sectorId: "ncc",
    brand: "Asinara Charter",
    style: "Sardinia Azure Luxury",
    label: "Asinara Azure",
    accent: "188 62% 61%",
    screenLabels: ["Home", "Escursioni", "Dettaglio", "Booking"],
  },
  "miami-boats": {
    sectorId: "ncc",
    brand: "Miami Boats Rental",
    style: "Style A",
    label: "Miami Boats",
    accent: "188 62% 61%",
    screenLabels: ["Home", "Fleet", "Dettaglio", "Booking"],
  },
  "city-padel-sage": {
    sectorId: "fitness",
    brand: "City Padel Milano",
    style: "Sage Luxe",
    label: "City Padel Sage",
    accent: "106 17% 54%",
    screenLabels: ["Home", "Prenota", "Maestri", "Dettaglio"],
  },
  "miami-watersports": {
    sectorId: "fitness",
    brand: "Miami Watersports",
    style: "Style A",
    label: "Miami Watersports",
    accent: "188 62% 61%",
    screenLabels: ["Home", "Attività", "Dettaglio", "Booking"],
  },
};

function resolveMockupStyle(variant?: string | null): { config: VariantConfig | null; style: MockupStyle | null } {
  const config = variant ? VARIANT_MAP[variant] ?? null : null;
  if (!config) return { config: null, style: null };

  const sector = SECTOR_PORTFOLIO.find((entry) => entry.sectorId === config.sectorId);
  const brand = sector?.brands.find((entry) => entry.name === config.brand);
  const style = brand?.styles.find((entry) => entry.name === config.style) ?? brand?.styles[0] ?? null;

  return { config, style };
}

export default function DemoPreviewPage() {
  const { slug } = useParams<{ slug: string }>();
  const [searchParams] = useSearchParams();
  const [device, setDevice] = useState<"mobile" | "desktop">("mobile");
  const [screenIndex, setScreenIndex] = useState(0);

  const { data: entity, isLoading } = useQuery({
    queryKey: ["demo-preview", slug],
    queryFn: async () => {
      if (!slug) return null;

      const { data: company } = await supabase
        .from("companies")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (company) return { ...company, entityType: "company" as const };

      const { data: restaurant } = await supabase
        .from("restaurants")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      return restaurant ? { ...restaurant, industry: "food", entityType: "restaurant" as const } : null;
    },
    enabled: !!slug,
  });

  const themeConfig = ((entity as any)?.theme_config ?? {}) as Record<string, any>;
  const variant = searchParams.get("variant") || themeConfig.template_variant || null;
  const subSector = searchParams.get("sub") || themeConfig.sub_sector || null;
  const { config, style } = useMemo(() => resolveMockupStyle(variant), [variant]);

  const screens = device === "desktop" && style?.desktopScreens?.length === 4 ? style.desktopScreens : style?.screens ?? [];
  const labels = config?.screenLabels ?? ["Screen 1", "Screen 2", "Screen 3", "Screen 4"];
  const activeIndex = Math.min(screenIndex, Math.max(screens.length - 1, 0));
  const activeScreen = screens[activeIndex];

  const adminUrl = slug && variant
    ? `${window.location.origin}/demo-admin/${slug}?variant=${encodeURIComponent(variant)}${subSector ? `&sub=${encodeURIComponent(subSector)}` : ""}`
    : null;

  if (isLoading) {
    return <div className="min-h-screen bg-background" />;
  }

  if (!entity || !config || !style || screens.length === 0) {
    return (
      <div className="min-h-screen bg-background text-foreground px-4 py-10">
        <BackButton to="/partner/leads" label="Indietro" variant="floating" theme="glass" />
        <div className="mx-auto max-w-xl rounded-3xl border border-border bg-card p-6 text-center shadow-sm">
          <p className="text-sm text-muted-foreground">Preview mockup non disponibile per questo lead.</p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-h-screen bg-background text-foreground"
      style={{
        backgroundImage: `radial-gradient(circle at top, hsl(${config.accent} / 0.18), transparent 34%)`,
      }}
    >
      <BackButton to="/partner/leads" label="Indietro" variant="floating" theme="glass" />

      <div className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 py-8 md:px-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="space-y-3">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary">Preview mockup</Badge>
              <Badge variant="outline">{config.label}</Badge>
              {subSector ? <Badge variant="outline">{subSector}</Badge> : null}
            </div>
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">{(entity as any).name}</h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Questa preview usa direttamente le schermate del mockup scelto, non il vecchio sito demo settoriale.
              </p>
            </div>
            <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
              {(entity as any).city ? <span className="inline-flex items-center gap-1.5"><MapPin className="h-4 w-4" />{(entity as any).city}</span> : null}
              {(entity as any).website ? <span className="inline-flex items-center gap-1.5"><Globe className="h-4 w-4" />{(entity as any).website}</span> : null}
              <span className="inline-flex items-center gap-1.5"><LayoutTemplate className="h-4 w-4" />{style.name}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              variant={device === "mobile" ? "default" : "outline"}
              onClick={() => setDevice("mobile")}
              className="gap-2"
            >
              <Smartphone className="h-4 w-4" /> Mobile
            </Button>
            <Button
              variant={device === "desktop" ? "default" : "outline"}
              onClick={() => setDevice("desktop")}
              className="gap-2"
              disabled={!style.desktopScreens?.length}
            >
              <Monitor className="h-4 w-4" /> Desktop
            </Button>
            {adminUrl ? (
              <Button asChild variant="outline">
                <a href={adminUrl}>Apri admin demo</a>
              </Button>
            ) : null}
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
          <Card className="overflow-hidden border-border/70 bg-card/90 backdrop-blur">
            <CardContent className="p-4 sm:p-6">
              <div className="mx-auto w-full max-w-[360px] lg:max-w-[420px]">
                <div className="relative overflow-hidden rounded-[2rem] border border-border bg-black shadow-2xl">
                  <div className="absolute left-1/2 top-0 z-10 h-5 w-32 -translate-x-1/2 rounded-b-2xl bg-black/95" />
                  <div className={`${device === "desktop" ? "aspect-[16/10]" : "aspect-[9/19.5]"} bg-muted`}>
                    <img src={activeScreen} alt={`${config.label} ${labels[activeIndex]}`} className="h-full w-full object-cover object-top" />
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setScreenIndex((prev) => (prev === 0 ? screens.length - 1 : prev - 1))}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex flex-wrap justify-center gap-2">
                    {labels.map((label, index) => (
                      <button
                        key={label}
                        onClick={() => setScreenIndex(index)}
                        className="rounded-full border px-3 py-1 text-xs font-medium transition"
                        style={{
                          borderColor: index === activeIndex ? `hsl(${config.accent} / 0.45)` : "hsl(var(--border))",
                          background: index === activeIndex ? `hsl(${config.accent} / 0.14)` : "hsl(var(--card))",
                          color: index === activeIndex ? `hsl(${config.accent})` : "hsl(var(--muted-foreground))",
                        }}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setScreenIndex((prev) => (prev + 1) % screens.length)}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/70 bg-card/90 backdrop-blur">
            <CardContent className="space-y-4 p-4">
              <div>
                <p className="text-xs uppercase tracking-[0.24em] text-muted-foreground">Schermate mockup</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Qui stai vedendo le schermate reali del mockup selezionato per il lead, nella sequenza esatta del funnel.
                </p>
              </div>

              <div className="space-y-3">
                {screens.map((screen, index) => (
                  <button
                    key={`${screen}-${index}`}
                    onClick={() => setScreenIndex(index)}
                    className="flex w-full items-center gap-3 rounded-2xl border border-border bg-background/60 p-2 text-left transition hover:bg-background"
                  >
                    <img src={screen} alt={labels[index]} className="h-16 w-12 rounded-xl object-cover object-top" />
                    <div>
                      <p className="text-sm font-medium">{labels[index]}</p>
                      <p className="text-xs text-muted-foreground">{device === "desktop" ? "Desktop" : "Mobile"} screen</p>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}