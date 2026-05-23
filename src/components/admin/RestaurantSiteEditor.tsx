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
  Sparkles,
  Loader2,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  Wand2,
} from "lucide-react";
import {
  RestaurantSiteContent,
  EMPTY_SITE,
  extractSiteOverride,
} from "@/lib/restaurant-site-content";

interface Props {
  restaurant: any;
  onSaved?: () => void;
}

type SectionKey =
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
  { key: "hero", label: "Hero / Copertina", emoji: "🎬", desc: "Titolo, sottotitolo, video di sfondo, pulsanti CTA" },
  { key: "splash", label: "Splash di apertura", emoji: "✨", desc: "Schermata cinematica iniziale" },
  { key: "about", label: "Chi siamo", emoji: "📖", desc: "Storia breve e presentazione" },
  { key: "story", label: "Story / Galleria", emoji: "🖼️", desc: "Galleria con 4 immagini + didascalie" },
  { key: "popular", label: "I più amati", emoji: "⭐", desc: "Sezione piatti popolari" },
  { key: "reservations", label: "Prenotazioni", emoji: "📅", desc: "Box prenotazioni e link" },
  { key: "reviews", label: "Recensioni", emoji: "💬", desc: "Titolo sezione recensioni" },
  { key: "contact", label: "Contatti social", emoji: "📞", desc: "WhatsApp, Instagram, Facebook" },
  { key: "footer", label: "Footer", emoji: "🦶", desc: "Tagline e copyright" },
  { key: "brand", label: "Brand & colori", emoji: "🎨", desc: "Colori primario/accento, font" },
  { key: "visibility", label: "Visibilità sezioni", emoji: "👁️", desc: "Mostra o nascondi blocchi del sito" },
];

export default function RestaurantSiteEditor({ restaurant, onSaved }: Props) {
  const initial = useMemo<RestaurantSiteContent>(() => extractSiteOverride(restaurant), [restaurant]);
  const [content, setContent] = useState<RestaurantSiteContent>(initial);
  const [saving, setSaving] = useState(false);
  const [open, setOpen] = useState<SectionKey | null>("hero");
  const [device, setDevice] = useState<"iphone16promax" | "iphone-se" | "ipad">("iphone16promax");
  const iframeRef = useRef<HTMLIFrameElement>(null);

  const slug = restaurant?.slug;
  const previewUrl = slug ? `/r/${slug}?preview=1` : "";

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
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-muted/40 transition"
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{meta.emoji}</span>
            <div>
              <div className="font-semibold text-sm">{meta.label}</div>
              <div className="text-xs text-muted-foreground">{meta.desc}</div>
            </div>
          </div>
          {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
        {isOpen && <CardContent className="pt-0 pb-4 space-y-3">{children}</CardContent>}
      </Card>
    );
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[1fr_390px] gap-4">
      {/* === EDITOR === */}
      <div className="space-y-3">
        <Card className="bg-gradient-to-br from-primary/10 via-card to-card border-primary/30">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Wand2 className="w-5 h-5 text-primary" /> Editor Sito Pubblico
            </CardTitle>
          </CardHeader>
          <CardContent className="text-xs text-muted-foreground space-y-1">
            <p>
              ✏️ Modifica ogni dettaglio della tua pagina pubblica <b>/r/{slug}</b>.
              Le anteprime appaiono <b>in diretta</b> nel mockup iPhone a destra.
            </p>
            <p>💾 Premi <b>Salva</b> per pubblicare. 🔄 <b>Ripristina</b> rimuove tutte le personalizzazioni.</p>
          </CardContent>
        </Card>

        <div className="flex gap-2 sticky top-0 z-20 bg-background/95 backdrop-blur py-2 -mx-1 px-1 border-b">
          <Button onClick={save} disabled={saving} className="flex-1 bg-primary text-primary-foreground font-bold">
            {saving ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Save className="w-4 h-4 mr-2" />}
            Pubblica modifiche
          </Button>
          <Button variant="outline" onClick={reset} title="Ripristina default">
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button variant="outline" asChild title="Apri pagina pubblica">
            <a href={`/r/${slug}`} target="_blank" rel="noreferrer">
              <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </div>

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
          <div className="grid grid-cols-2 gap-2">
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
            <div key={i} className="grid grid-cols-2 gap-2 p-2 rounded border border-border/40">
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
          <div className="grid grid-cols-2 gap-2">
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
          <div className="grid grid-cols-2 gap-2">
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
          <div className="grid grid-cols-2 gap-2">
            <Field label="Colore primario">
              <div className="flex gap-2">
                <input type="color" value={content.brand?.primaryHex || restaurant?.primary_color || "#C8963E"}
                  onChange={(e) => update("brand", { primaryHex: e.target.value })}
                  className="h-10 w-14 rounded border" />
                <Input value={content.brand?.primaryHex || ""} placeholder="#C8963E"
                  onChange={(e) => update("brand", { primaryHex: e.target.value })} />
              </div>
            </Field>
            <Field label="Colore accento">
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

      {/* === IPHONE 16 PRO MAX PREVIEW === */}
      <div className="lg:sticky lg:top-4 self-start">
        <Card className="bg-gradient-to-b from-zinc-900 to-black border-zinc-800 text-white">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-sm">
              <Smartphone className="w-4 h-4" /> Anteprima Live
              <Badge variant="outline" className="ml-auto border-amber-400/40 text-amber-300 text-[10px]">
                iPhone 16 Pro Max
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center pb-4">
            <div
              className="relative bg-black rounded-[55px] p-[10px] shadow-[0_30px_60px_-15px_rgba(0,0,0,.6)] border-[3px] border-zinc-700"
              style={{ width: 320, height: 660 }}
            >
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-10 border border-zinc-800" />
              <div className="w-full h-full overflow-hidden rounded-[46px] bg-white">
                {previewUrl ? (
                  <iframe
                    ref={iframeRef}
                    src={previewUrl}
                    title="Live preview"
                    className="w-full h-full border-0"
                    style={{
                      // Scaliamo il sito reale per simulare la viewport iPhone
                      transform: "scale(1)",
                      transformOrigin: "top left",
                    }}
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
          <p>• Le modifiche appaiono nel mockup mentre digiti.</p>
          <p>• Per pubblicarle sul sito vero premi <b>Pubblica</b>.</p>
          <p>• Lascia un campo vuoto per usare il valore predefinito.</p>
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
    <div className="flex items-center justify-between py-1.5">
      <Label className="text-sm">{label}</Label>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}
