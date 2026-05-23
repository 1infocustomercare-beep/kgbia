import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Save,
  RotateCcw,
  Eye,
  Smartphone,
  Tablet,
  Monitor,
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Wand2,
  Upload,
  Palette,
  Image as ImageIcon,
} from "lucide-react";
import {
  RestaurantSiteContent,
  EMPTY_SITE,
  extractSiteOverride,
} from "@/lib/restaurant-site-content";
import {
  applyBrandTheme,
  resetBrandTheme,
  extractDominantColor,
  hslToHex,
  DEFAULT_PRIMARY_HEX,
} from "@/lib/color-extract";

interface Props {
  restaurant: any;
  onSaved?: () => void;
  // Integrazione opzionale con i settings "core" del ristorante
  logoUploading?: boolean;
  handleLogoUpload?: () => void;
  settingsTagline?: string;
  setSettingsTagline?: (v: string) => void;
  settingsPrimaryColor?: string;
  setSettingsPrimaryColor?: (v: string) => void;
  handleSaveSettings?: () => void;
}

type SectionKey =
  | "identity"
  | "hero"
  | "splash"
  | "about"
  | "story"
  | "popular"
  | "reservations"
  | "reviews"
  | "contact"
  | "footer"
  | "brand"
  | "visibility";

const SECTIONS: { key: SectionKey; label: string; emoji: string; desc: string }[] = [
  { key: "identity", label: "Identità · Logo & Tagline", emoji: "🪪", desc: "Logo del locale, tagline e colore brand globale" },
  { key: "hero", label: "Hero / Copertina", emoji: "🎬", desc: "Titolo, sottotitolo, video di sfondo, pulsanti CTA" },
  { key: "splash", label: "Splash di apertura", emoji: "✨", desc: "Schermata cinematica iniziale" },
  { key: "about", label: "Chi siamo", emoji: "📖", desc: "Storia breve e presentazione" },
  { key: "story", label: "Story / Galleria", emoji: "🖼️", desc: "Galleria con 4 immagini + didascalie" },
  { key: "popular", label: "I più amati", emoji: "⭐", desc: "Sezione piatti popolari" },
  { key: "reservations", label: "Prenotazioni", emoji: "📅", desc: "Box prenotazioni e link" },
  { key: "reviews", label: "Recensioni", emoji: "💬", desc: "Titolo sezione recensioni" },
  { key: "contact", label: "Contatti social", emoji: "📞", desc: "WhatsApp, Instagram, Facebook" },
  { key: "footer", label: "Footer", emoji: "🦶", desc: "Tagline e copyright" },
  { key: "brand", label: "Brand sito · Colori specifici", emoji: "🎨", desc: "Override colori per la pagina pubblica" },
  { key: "visibility", label: "Visibilità sezioni", emoji: "👁️", desc: "Mostra o nascondi blocchi del sito" },
];

const PRESET_COLORS = ["#C8963E", "#E74C3C", "#2ECC71", "#3498DB", "#9B59B6", "#1ABC9C", "#F39C12", "#E91E63"];

type DeviceKey = "iphone16promax" | "iphone-se" | "ipad" | "desktop";
const DEVICES: Record<DeviceKey, { label: string; w: number; h: number; icon: any; radius: number }> = {
  "iphone16promax": { label: "iPhone 16 Pro Max", w: 320, h: 660, icon: Smartphone, radius: 55 },
  "iphone-se":      { label: "iPhone SE",          w: 260, h: 540, icon: Smartphone, radius: 36 },
  "ipad":           { label: "iPad",               w: 420, h: 560, icon: Tablet,     radius: 28 },
  "desktop":        { label: "Desktop",            w: 520, h: 360, icon: Monitor,    radius: 12 },
};

export default function RestaurantSiteEditor({
  restaurant,
  onSaved,
  logoUploading,
  handleLogoUpload,
  settingsTagline,
  setSettingsTagline,
  settingsPrimaryColor,
  setSettingsPrimaryColor,
  handleSaveSettings,
}: Props) {
  const initial = useMemo<RestaurantSiteContent>(() => extractSiteOverride(restaurant), [restaurant]);
  const [content, setContent] = useState<RestaurantSiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<SectionKey | null>("identity");
  const [device, setDevice] = useState<DeviceKey>("iphone16promax");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const slug = restaurant?.slug;
  const previewUrl = slug ? `/r/${slug}?preview=1` : "";
  const hasCoreSettings = Boolean(setSettingsPrimaryColor && setSettingsTagline);

  // Sync live: ogni modifica viene inviata al preview via postMessage
  useEffect(() => {
    const w = iframeRef.current?.contentWindow;
    if (!w) return;
    w.postMessage({ type: "RESTAURANT_SITE_PREVIEW_UPDATE", content }, "*");
  }, [content]);

  // Quando il preview annuncia "ready" rispingo lo stato corrente
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e?.data?.type === "RESTAURANT_SITE_PREVIEW_READY") {
        iframeRef.current?.contentWindow?.postMessage(
          { type: "RESTAURANT_SITE_PREVIEW_UPDATE", content },
          "*"
        );
      }
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, [content]);

  const update = <K extends keyof RestaurantSiteContent>(
    key: K,
    patch: Partial<NonNullable<RestaurantSiteContent[K]>>
  ) => {
    setContent((c) => ({ ...c, [key]: { ...(c[key] as any), ...patch } }));
  };

  const save = async () => {
    if (!restaurant?.id) return;
    setSaving(true);
    try {
      const themeConfig = { ...(restaurant.theme_config || {}), site: content };
      const { error } = await supabase
        .from("restaurants")
        .update({ theme_config: themeConfig })
        .eq("id", restaurant.id);
      if (error) throw error;
      toast({ title: "Sito aggiornato ✅", description: "Le modifiche sono live sulla pagina pubblica." });
      onSaved?.();
    } catch (e: any) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const reset = () => {
    if (!confirm("Ripristinare tutti i contenuti del sito ai valori predefiniti?")) return;
    setContent(EMPTY_SITE);
  };

  const Section = ({ k, children }: { k: SectionKey; children: React.ReactNode }) => {
    const meta = SECTIONS.find((s) => s.key === k)!;
    const isOpen = open === k;
    return (
      <Card className="border-border/60 bg-card/50">
        <button
          type="button"
          onClick={() => setOpen(isOpen ? null : k)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition min-h-[56px]"
        >
          <div className="flex items-center gap-3 min-w-0">
            <span className="text-xl flex-shrink-0">{meta.emoji}</span>
            <div className="min-w-0">
              <div className="font-semibold text-sm truncate">{meta.label}</div>
              <div className="text-[11px] text-muted-foreground truncate">{meta.desc}</div>
            </div>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 flex-shrink-0" />}
        </button>
        {isOpen && <CardContent className="pt-0 pb-4 space-y-3">{children}</CardContent>}
      </Card>
    );
  };

  const dev = DEVICES[device];
  const DeviceIcon = dev.icon;

  return (
    <div className="grid grid-cols-1 xl:grid-cols-[1fr_420px] gap-4">
      {/* === EDITOR === */}
      <div className="space-y-3 min-w-0">
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="w-5 h-5 text-primary" /> Editor Sito Pubblico
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>
              ✏️ Modifica ogni dettaglio della tua pagina pubblica <b>/r/{slug}</b>.
              Le anteprime appaiono <b>in diretta</b> nel mockup a destra.
            </p>
            <p>💾 <b>Pubblica</b> per salvare. 🔄 <b>Ripristina</b> rimuove le personalizzazioni del sito.</p>
          </CardContent>
        </Card>

        <div className="flex flex-wrap gap-2 sticky top-0 z-20 bg-background/95 backdrop-blur py-2 -mx-1 px-1 border-b">
          <Button onClick={save} disabled={saving} className="flex-1 min-w-[160px] bg-primary text-primary-foreground font-bold min-h-[44px]">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Pubblica modifiche
          </Button>
          <Button variant="outline" onClick={reset} title="Ripristina default" className="min-h-[44px]">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" asChild title="Apri pagina pubblica" className="min-h-[44px]">
            <a href={`/r/${slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

        {/* ===== IDENTITÀ (logo + tagline + colore brand globale) ===== */}
        <Section k="identity">
          {hasCoreSettings ? (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 items-center p-3 rounded-xl bg-muted/40 border border-border/40">
                <div className="relative w-20 h-20 rounded-2xl overflow-hidden border-2 border-border/60 bg-secondary/40 flex-shrink-0 mx-auto sm:mx-0">
                  <img
                    src={restaurant?.logo_url || "/placeholder.svg"}
                    alt="Logo ristorante"
                    className="w-full h-full object-contain p-1"
                  />
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center shadow-md">
                    <Upload className="w-3 h-3 text-primary-foreground" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Button
                    type="button"
                    onClick={handleLogoUpload}
                    disabled={logoUploading}
                    variant="secondary"
                    className="w-full min-h-[44px]"
                  >
                    {logoUploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
                    {logoUploading ? "Caricamento..." : "Carica nuovo logo"}
                  </Button>
                  <p className="text-[11px] text-muted-foreground text-center sm:text-left">
                    Il colore brand verrà estratto automaticamente.
                  </p>
                </div>
              </div>

              <Field label="Tagline globale del ristorante">
                <Input
                  value={settingsTagline ?? ""}
                  onChange={(e) => setSettingsTagline?.(e.target.value)}
                  onBlur={handleSaveSettings}
                  placeholder="Es: La vera cucina italiana dal 1985"
                  maxLength={120}
                  className="min-h-[44px]"
                />
              </Field>

              <Field label="Colore brand principale (tutta l'app)">
                <div className="flex flex-wrap items-center gap-3">
                  <input
                    type="color"
                    value={settingsPrimaryColor || "#C8963E"}
                    onChange={(e) => {
                      setSettingsPrimaryColor?.(e.target.value);
                      applyBrandTheme(e.target.value);
                    }}
                    onBlur={handleSaveSettings}
                    className="w-12 h-12 rounded-xl border-2 border-border/50 cursor-pointer bg-transparent p-0.5 flex-shrink-0"
                  />
                  <Input
                    value={settingsPrimaryColor || ""}
                    onChange={(e) => {
                      setSettingsPrimaryColor?.(e.target.value);
                      if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) applyBrandTheme(e.target.value);
                    }}
                    onBlur={handleSaveSettings}
                    placeholder="#C8963E"
                    maxLength={7}
                    className="flex-1 min-w-[120px] font-mono min-h-[44px]"
                  />
                </div>
                <div className="flex gap-1.5 flex-wrap mt-2">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => {
                        setSettingsPrimaryColor?.(c);
                        applyBrandTheme(c);
                        handleSaveSettings?.();
                      }}
                      className={`w-8 h-8 rounded-lg border-2 transition-all ${
                        settingsPrimaryColor === c
                          ? "border-foreground scale-110 shadow-md"
                          : "border-transparent hover:border-muted-foreground/30"
                      }`}
                      style={{ backgroundColor: c }}
                      title={c}
                    />
                  ))}
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setSettingsPrimaryColor?.(DEFAULT_PRIMARY_HEX);
                      resetBrandTheme();
                      handleSaveSettings?.();
                    }}
                    className="flex-1 min-h-[40px]"
                  >
                    Ripristina default
                  </Button>
                  {restaurant?.logo_url && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={async () => {
                        try {
                          const h = await extractDominantColor(restaurant.logo_url!);
                          const hex = hslToHex(h);
                          setSettingsPrimaryColor?.(hex);
                          applyBrandTheme(hex);
                          handleSaveSettings?.();
                          toast({ title: "Colore estratto dal logo!" });
                        } catch {
                          toast({ title: "Errore", variant: "destructive" });
                        }
                      }}
                      className="flex-1 min-h-[40px]"
                    >
                      <Palette className="w-3.5 h-3.5 mr-1" /> Estrai dal logo
                    </Button>
                  )}
                </div>
              </Field>

              {/* Menu PDF (download dalla pagina pubblica) */}
              <Field label="Menu PDF (scaricabile dai clienti)">
                <MenuPdfUploader restaurant={restaurant} onSaved={onSaved} />
              </Field>
            </>
          ) : (
            <p className="text-xs text-muted-foreground">
              Le impostazioni globali del ristorante non sono disponibili in questo contesto.
            </p>
          )}
        </Section>


        {/* HERO */}
        <Section k="hero">
          <Field label="Eyebrow (testo piccolo sopra il titolo)">
            <Input value={content.hero?.eyebrow || ""} onChange={(e) => update("hero", { eyebrow: e.target.value })} />
          </Field>
          <Field label="Titolo principale">
            <Input placeholder={restaurant?.name} value={content.hero?.title || ""} onChange={(e) => update("hero", { title: e.target.value })} />
          </Field>
          <Field label="Sottotitolo / tagline">
            <Textarea rows={2} placeholder={restaurant?.tagline} value={content.hero?.subtitle || ""} onChange={(e) => update("hero", { subtitle: e.target.value })} />
          </Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="CTA primario - testo">
              <Input placeholder="Ordina Ora" value={content.hero?.ctaPrimaryLabel || ""} onChange={(e) => update("hero", { ctaPrimaryLabel: e.target.value })} />
            </Field>
            <Field label="CTA primario - link">
              <Input placeholder="#menu" value={content.hero?.ctaPrimaryHref || ""} onChange={(e) => update("hero", { ctaPrimaryHref: e.target.value })} />
            </Field>
            <Field label="CTA secondario - testo">
              <Input placeholder="Prenota" value={content.hero?.ctaSecondaryLabel || ""} onChange={(e) => update("hero", { ctaSecondaryLabel: e.target.value })} />
            </Field>
            <Field label="CTA secondario - link">
              <Input placeholder="#reservations" value={content.hero?.ctaSecondaryHref || ""} onChange={(e) => update("hero", { ctaSecondaryHref: e.target.value })} />
            </Field>
          </div>
          <Field label="URL video di sfondo (mp4)">
            <Input placeholder="https://…/hero.mp4" value={content.hero?.videoUrl || ""} onChange={(e) => update("hero", { videoUrl: e.target.value })} />
          </Field>
          <Field label="URL immagine di sfondo (fallback)">
            <Input placeholder="https://…/hero.jpg" value={content.hero?.imageUrl || ""} onChange={(e) => update("hero", { imageUrl: e.target.value })} />
          </Field>
          <Field label={`Opacità overlay scuro: ${content.hero?.overlayOpacity ?? 40}%`}>
            <input
              type="range" min={0} max={90}
              value={content.hero?.overlayOpacity ?? 40}
              onChange={(e) => update("hero", { overlayOpacity: parseInt(e.target.value) })}
              className="w-full accent-primary"
            />
          </Field>
        </Section>

        <Section k="splash">
          <ToggleField label="Mostra splash all'apertura" checked={content.splash?.enabled !== false}
            onChange={(v) => update("splash", { enabled: v })} />
          <Field label="Titolo splash"><Input value={content.splash?.title || ""} onChange={(e) => update("splash", { title: e.target.value })} /></Field>
          <Field label="Sottotitolo splash"><Input value={content.splash?.subtitle || ""} onChange={(e) => update("splash", { subtitle: e.target.value })} /></Field>
        </Section>

        <Section k="about">
          <ToggleField label="Mostra sezione 'Chi siamo'" checked={content.about?.enabled !== false}
            onChange={(v) => update("about", { enabled: v })} />
          <Field label="Titolo"><Input placeholder="La nostra storia" value={content.about?.title || ""} onChange={(e) => update("about", { title: e.target.value })} /></Field>
          <Field label="Testo"><Textarea rows={4} value={content.about?.body || ""} onChange={(e) => update("about", { body: e.target.value })} /></Field>
        </Section>

        <Section k="story">
          <ToggleField label="Mostra galleria story" checked={content.story?.enabled !== false}
            onChange={(v) => update("story", { enabled: v })} />
          <Field label="Titolo galleria"><Input value={content.story?.title || ""} onChange={(e) => update("story", { title: e.target.value })} /></Field>
          <Field label="Intro"><Textarea rows={2} value={content.story?.intro || ""} onChange={(e) => update("story", { intro: e.target.value })} /></Field>
          {[0,1,2,3].map(i => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-2 rounded border border-border/40">
              <Field label={`Immagine ${i+1} (URL)`}>
                <Input value={content.story?.images?.[i] || ""} onChange={(e) => {
                  const arr = [...(content.story?.images || ["","","",""])];
                  arr[i] = e.target.value;
                  update("story", { images: arr });
                }} />
              </Field>
              <Field label={`Didascalia ${i+1}`}>
                <Input value={content.story?.captions?.[i] || ""} onChange={(e) => {
                  const arr = [...(content.story?.captions || ["","","",""])];
                  arr[i] = e.target.value;
                  update("story", { captions: arr });
                }} />
              </Field>
            </div>
          ))}
        </Section>

        <Section k="popular">
          <ToggleField label="Mostra 'I più amati'" checked={content.popular?.enabled !== false}
            onChange={(v) => update("popular", { enabled: v })} />
          <Field label="Eyebrow"><Input placeholder="⭐ I più amati" value={content.popular?.eyebrow || ""} onChange={(e) => update("popular", { eyebrow: e.target.value })} /></Field>
          <Field label="Titolo"><Input value={content.popular?.title || ""} onChange={(e) => update("popular", { title: e.target.value })} /></Field>
        </Section>

        <Section k="reservations">
          <ToggleField label="Mostra box prenotazioni" checked={content.reservations?.enabled !== false}
            onChange={(v) => update("reservations", { enabled: v })} />
          <Field label="Titolo"><Input value={content.reservations?.title || ""} onChange={(e) => update("reservations", { title: e.target.value })} /></Field>
          <Field label="Testo"><Textarea rows={2} value={content.reservations?.body || ""} onChange={(e) => update("reservations", { body: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="CTA testo"><Input value={content.reservations?.ctaLabel || ""} onChange={(e) => update("reservations", { ctaLabel: e.target.value })} /></Field>
            <Field label="CTA link"><Input value={content.reservations?.ctaHref || ""} onChange={(e) => update("reservations", { ctaHref: e.target.value })} /></Field>
          </div>
        </Section>

        <Section k="reviews">
          <ToggleField label="Mostra recensioni" checked={content.reviews?.enabled !== false}
            onChange={(v) => update("reviews", { enabled: v })} />
          <Field label="Titolo sezione"><Input value={content.reviews?.title || ""} onChange={(e) => update("reviews", { title: e.target.value })} /></Field>
        </Section>

        <Section k="contact">
          <Field label="Titolo blocco contatti"><Input value={content.contact?.title || ""} onChange={(e) => update("contact", { title: e.target.value })} /></Field>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="WhatsApp (numero)"><Input placeholder="+39 333 1234567" value={content.contact?.whatsapp || ""} onChange={(e) => update("contact", { whatsapp: e.target.value })} /></Field>
            <Field label="Instagram (@handle)"><Input placeholder="@comemai" value={content.contact?.instagram || ""} onChange={(e) => update("contact", { instagram: e.target.value })} /></Field>
            <Field label="Facebook URL"><Input value={content.contact?.facebook || ""} onChange={(e) => update("contact", { facebook: e.target.value })} /></Field>
            <Field label="Riga extra"><Input value={content.contact?.extraLine || ""} onChange={(e) => update("contact", { extraLine: e.target.value })} /></Field>
          </div>
        </Section>

        <Section k="footer">
          <Field label="Tagline footer"><Input value={content.footer?.tagline || ""} onChange={(e) => update("footer", { tagline: e.target.value })} /></Field>
          <Field label="Copyright"><Input placeholder="© 2026 Come Mai" value={content.footer?.copyright || ""} onChange={(e) => update("footer", { copyright: e.target.value })} /></Field>
        </Section>

        <Section k="brand">
          <p className="text-[11px] text-muted-foreground -mt-1 mb-2">
            Override <b>solo per il sito pubblico</b>. Per cambiare i colori dell'app, usa "Identità" in alto.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            <Field label="Colore primario sito">
              <div className="flex gap-2">
                <input type="color" value={content.brand?.primaryHex || restaurant?.primary_color || "#C8963E"}
                  onChange={(e) => update("brand", { primaryHex: e.target.value })}
                  className="h-10 w-14 rounded border" />
                <Input value={content.brand?.primaryHex || ""} placeholder="#C8963E"
                  onChange={(e) => update("brand", { primaryHex: e.target.value })} />
              </div>
            </Field>
            <Field label="Colore accento sito">
              <div className="flex gap-2">
                <input type="color" value={content.brand?.accentHex || "#1a1a1a"}
                  onChange={(e) => update("brand", { accentHex: e.target.value })}
                  className="h-10 w-14 rounded border" />
                <Input value={content.brand?.accentHex || ""} placeholder="#1a1a1a"
                  onChange={(e) => update("brand", { accentHex: e.target.value })} />
              </div>
            </Field>
          </div>
        </Section>

        <Section k="visibility">
          <p className="text-xs text-muted-foreground mb-2">
            Disattiva qui le sezioni che non vuoi vedere nella pagina pubblica.
          </p>
          {[
            { k: "splash", label: "Splash di apertura" },
            { k: "about", label: "Chi siamo" },
            { k: "story", label: "Galleria story" },
            { k: "popular", label: "I più amati" },
            { k: "reservations", label: "Prenotazioni" },
            { k: "reviews", label: "Recensioni" },
          ].map((s) => (
            <ToggleField key={s.k}
              label={s.label}
              checked={(content as any)[s.k]?.enabled !== false}
              onChange={(v) => update(s.k as any, { enabled: v })}
            />
          ))}
        </Section>

        <div className="h-8" />
      </div>

      {/* === LIVE PREVIEW (responsive: iPhone/iPad/Desktop) === */}
      <div className="xl:sticky xl:top-4 self-start">
        <Card className="bg-gradient-to-b from-zinc-900 to-black border-zinc-800 text-white overflow-hidden">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm flex-wrap">
              <DeviceIcon className="w-4 h-4" /> Anteprima Live
              <Badge variant="outline" className="ml-auto border-amber-400/40 text-amber-300 text-[10px]">
                {dev.label}
              </Badge>
            </CardTitle>
            <div className="flex flex-wrap gap-1 pt-2">
              {(Object.keys(DEVICES) as DeviceKey[]).map((k) => {
                const D = DEVICES[k];
                const Icon = D.icon;
                return (
                  <button
                    key={k}
                    type="button"
                    onClick={() => setDevice(k)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-md text-[11px] border transition min-h-[32px] ${
                      device === k
                        ? "bg-amber-500/20 border-amber-400/50 text-amber-200"
                        : "bg-zinc-800/60 border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    }`}
                    title={D.label}
                  >
                    <Icon className="w-3 h-3" />
                    <span className="hidden sm:inline">{D.label}</span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="flex justify-center pb-4 overflow-x-auto">
            <div
              className="relative bg-black shadow-[0_30px_60px_-15px_rgba(0,0,0,.6)] border-[3px] border-zinc-700"
              style={{
                width: dev.w,
                height: dev.h,
                borderRadius: dev.radius,
                padding: device === "desktop" ? 4 : 10,
              }}
            >
              {device !== "desktop" && (
                <div className="absolute top-3 left-1/2 -translate-x-1/2 w-24 h-6 bg-black rounded-full z-10 border border-zinc-800" />
              )}
              <div
                className="w-full h-full overflow-hidden bg-white"
                style={{ borderRadius: Math.max(dev.radius - 9, 6) }}
              >
                {previewUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    title="Live preview"
                    className="w-full h-full border-0"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-zinc-400 text-xs p-6 text-center">
                    Salva prima il ristorante per vedere l'anteprima.
                  </div>
                )}
              </div>
            </div>
          </CardContent>
          <div className="px-4 pb-4 text-[11px] text-zinc-400 flex items-center gap-2">
            <Eye className="w-3 h-3" />
            Aggiornamento in tempo reale mentre digiti
          </div>
        </Card>

        <div className="mt-3 p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground space-y-1">
          <div className="flex items-center gap-1 font-semibold text-foreground">
            <Sparkles className="w-3 h-3 text-primary" /> Tips
          </div>
          <p>• Cambia dispositivo per vedere il sito su iPhone, iPad o Desktop.</p>
          <p>• Le modifiche appaiono live mentre digiti.</p>
          <p>• Premi <b>Pubblica</b> per renderle visibili al pubblico.</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <Label className="text-xs text-muted-foreground">{label}</Label>
      {children}
    </div>
  );
}

function ToggleField({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between py-1.5 gap-3">
      <Label className="text-sm">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

function MenuPdfUploader({ restaurant, onSaved }: { restaurant: any; onSaved?: () => void }) {
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const url: string | null = restaurant?.menu_pdf_url || null;

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.type !== "application/pdf") {
      toast({ title: "Formato non valido", description: "Carica un file PDF", variant: "destructive" });
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      toast({ title: "File troppo grande", description: "Massimo 10 MB", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      const path = `${restaurant.id}/menu-${Date.now()}.pdf`;
      const { error: upErr } = await supabase.storage.from("homepage-media").upload(path, file, { upsert: true, contentType: "application/pdf" });
      if (upErr) throw upErr;
      const { data: pub } = supabase.storage.from("homepage-media").getPublicUrl(path);
      const { error: updErr } = await supabase.from("restaurants").update({ menu_pdf_url: pub.publicUrl } as any).eq("id", restaurant.id);
      if (updErr) throw updErr;
      toast({ title: "Menu PDF caricato", description: "Ora è scaricabile dalla pagina pubblica" });
      onSaved?.();
    } catch (err: any) {
      toast({ title: "Errore caricamento", description: err.message || "Riprova", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  const handleRemove = async () => {
    try {
      const { error } = await supabase.from("restaurants").update({ menu_pdf_url: null } as any).eq("id", restaurant.id);
      if (error) throw error;
      toast({ title: "Menu PDF rimosso" });
      onSaved?.();
    } catch (err: any) {
      toast({ title: "Errore", description: err.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-2">
      <input ref={inputRef} type="file" accept="application/pdf" className="hidden" onChange={handleFile} />
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="secondary" onClick={() => inputRef.current?.click()} disabled={uploading} className="flex-1 min-h-[44px]">
          {uploading ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />}
          {uploading ? "Caricamento..." : url ? "Sostituisci PDF" : "Carica PDF"}
        </Button>
        {url && (
          <>
            <Button type="button" variant="outline" size="sm" asChild className="min-h-[44px]">
              <a href={url} target="_blank" rel="noopener noreferrer">Apri</a>
            </Button>
            <Button type="button" variant="outline" size="sm" onClick={handleRemove} className="min-h-[44px]">
              Rimuovi
            </Button>
          </>
        )}
      </div>
      {!url && <p className="text-[11px] text-muted-foreground">Max 10 MB · Formato PDF</p>}
    </div>
  );
}
