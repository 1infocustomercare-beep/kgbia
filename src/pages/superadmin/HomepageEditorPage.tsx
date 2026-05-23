import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trash2, Plus, Save, Rocket, RotateCcw, Smartphone, Eye, ExternalLink, ArrowLeft } from "lucide-react";
import { HomepageContent, FaqItem, PricingPlan, Stat } from "@/lib/homepage-content";
import { HOMEPAGE_PREVIEW_MSG } from "@/hooks/useHomepageContent";

const SECTION_KEYS: { key: keyof NonNullable<HomepageContent["hidden"]>; label: string }[] = [
  { key: "manifesto", label: "Manifesto" },
  { key: "storyPinned", label: "Story Pinned (Caos → Empire)" },
  { key: "sectorsCarousel", label: "Carosello settori" },
  { key: "horizontalPortfolio", label: "Portfolio orizzontale" },
  { key: "orbital3D", label: "Showcase 3D Orbital" },
  { key: "agentsBento", label: "Agenti AI · Bento" },
  { key: "agentsAlaCarte", label: "Agenti à la carte" },
  { key: "process", label: "Processo" },
  { key: "customization", label: "Personalizzazione" },
  { key: "about", label: "Chi siamo" },
  { key: "team", label: "Team" },
  { key: "pricing", label: "Pricing" },
  { key: "guarantee", label: "Garanzia" },
  { key: "testimonials", label: "Testimonials" },
  { key: "faq", label: "FAQ" },
  { key: "contactCta", label: "CTA finale" },
];

function set<T extends object>(obj: T, path: string[], value: any): T {
  if (path.length === 0) return value;
  const [head, ...rest] = path;
  return { ...obj, [head]: set((obj as any)?.[head] ?? {}, rest, value) } as T;
}

export default function HomepageEditorPage() {
  const { user, profile } = useAuth() as any;
  const { toast } = useToast();
  const [content, setContent] = useState<HomepageContent>({});
  const [published, setPublished] = useState<HomepageContent>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [publishing, setPublishing] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const [previewReady, setPreviewReady] = useState(false);

  const isSuperAdmin =
    profile?.role === "super_admin" ||
    profile?.is_super_admin === true ||
    user?.email === "kevin97bernardini@gmail.com";

  // Load
  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("homepage_content")
        .select("content, published_content")
        .eq("singleton", true)
        .maybeSingle();
      if (data) {
        setContent((data.content as any) ?? {});
        setPublished((data.published_content as any) ?? {});
      }
      setLoading(false);
    })();
  }, []);

  // Receive ready signal from preview iframe
  useEffect(() => {
    const onMsg = (e: MessageEvent) => {
      if (e.data?.type === "empire:homepage-preview-ready") setPreviewReady(true);
    };
    window.addEventListener("message", onMsg);
    return () => window.removeEventListener("message", onMsg);
  }, []);

  // Push live overlay to iframe on every change (debounced)
  useEffect(() => {
    if (!previewReady) return;
    const t = setTimeout(() => {
      iframeRef.current?.contentWindow?.postMessage({ type: HOMEPAGE_PREVIEW_MSG, content }, "*");
    }, 120);
    return () => clearTimeout(t);
  }, [content, previewReady]);

  const update = (path: string[], value: any) => setContent((c) => set(c, path, value));

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("homepage_content")
      .update({ content: content as any, updated_by: user?.id ?? null })
      .eq("singleton", true);
    setSaving(false);
    if (error) toast({ title: "Errore salvataggio", description: error.message, variant: "destructive" });
    else toast({ title: "Bozza salvata", description: "I tuoi cambiamenti sono in sicurezza. Pubblicali quando sei pronto." });
  };

  const publish = async () => {
    setPublishing(true);
    const { error } = await supabase
      .from("homepage_content")
      .update({ content: content as any, published_content: content as any, updated_by: user?.id ?? null })
      .eq("singleton", true);
    setPublishing(false);
    if (error) toast({ title: "Errore pubblicazione", description: error.message, variant: "destructive" });
    else {
      setPublished(content);
      toast({ title: "✨ Homepage pubblicata", description: "Le modifiche sono ora online." });
    }
  };

  const revertToPublished = () => {
    setContent(published);
    toast({ title: "Bozza ripristinata", description: "Hai annullato le modifiche non pubblicate." });
  };

  const hero = content.hero ?? {};
  const manifesto = content.manifesto ?? {};
  const pricing = content.pricing ?? {};
  const faq = content.faq ?? {};
  const cc = content.contactCta ?? {};
  const brand = content.brand ?? {};
  const footer = content.footer ?? {};
  const hidden = content.hidden ?? {};

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="text-sm text-muted-foreground">Carico l'editor…</div>
      </div>
    );
  }

  if (!isSuperAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background text-foreground p-6 text-center">
        <h1 className="text-2xl font-bold mb-2">Accesso riservato</h1>
        <p className="text-muted-foreground mb-4">Questa area è esclusiva del super admin.</p>
        <Link to="/dashboard"><Button variant="outline"><ArrowLeft className="mr-2 h-4 w-4" /> Torna alla dashboard</Button></Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Top bar */}
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-xl">
        <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-6">
          <div className="flex items-center gap-3">
            <Link to="/dashboard">
              <Button variant="ghost" size="sm"><ArrowLeft className="mr-1.5 h-4 w-4" /> Dashboard</Button>
            </Link>
            <div>
              <h1 className="text-base font-bold leading-none">Editor Homepage</h1>
              <p className="text-[11px] text-muted-foreground mt-0.5">Tutto modificabile · Anteprima iPhone 16 Pro Max in tempo reale</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={revertToPublished}><RotateCcw className="mr-1.5 h-4 w-4" />Annulla bozza</Button>
            <Button variant="outline" size="sm" onClick={save} disabled={saving}>
              <Save className="mr-1.5 h-4 w-4" />{saving ? "Salvo…" : "Salva bozza"}
            </Button>
            <Button size="sm" onClick={publish} disabled={publishing} className="bg-emerald-600 hover:bg-emerald-700 text-white">
              <Rocket className="mr-1.5 h-4 w-4" />{publishing ? "Pubblico…" : "Pubblica"}
            </Button>
          </div>
        </div>
      </header>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_auto] gap-0">
        {/* Editor pane */}
        <div className="p-4 lg:p-6 max-w-[860px]">
          <Card className="p-4 mb-4 bg-card/60 border-border/60">
            <p className="text-xs text-muted-foreground leading-relaxed">
              <strong className="text-foreground">Come funziona:</strong> modifica qui sotto qualsiasi elemento. L'iPhone a destra mostra le modifiche istantaneamente (modalità anteprima). Premi <Badge variant="outline">Salva bozza</Badge> per conservare, <Badge className="bg-emerald-600">Pubblica</Badge> per mandare online. Lasciando vuoto un campo viene usato il valore predefinito Empire.
            </p>
          </Card>

          <Tabs defaultValue="hero" className="w-full">
            <TabsList className="w-full justify-start overflow-x-auto flex-wrap h-auto">
              <TabsTrigger value="hero">Hero</TabsTrigger>
              <TabsTrigger value="manifesto">Manifesto</TabsTrigger>
              <TabsTrigger value="pricing">Pricing</TabsTrigger>
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="cta">CTA · Footer</TabsTrigger>
              <TabsTrigger value="brand">Brand</TabsTrigger>
              <TabsTrigger value="sections">Sezioni</TabsTrigger>
              <TabsTrigger value="json">JSON</TabsTrigger>
            </TabsList>

            {/* HERO */}
            <TabsContent value="hero" className="space-y-3 pt-4">
              <Field label="Eyebrow (pill)" v={hero.eyebrow} onChange={(v) => update(["hero", "eyebrow"], v)} placeholder="Empire AI · Webapp + 4 Agenti AI" />
              <Field label="Titolo riga 1" v={hero.titleLine1} onChange={(v) => update(["hero", "titleLine1"], v)} placeholder="Sostituisci" />
              <Field label="Titolo riga 2 (gradient)" v={hero.titleLine2} onChange={(v) => update(["hero", "titleLine2"], v)} placeholder="i dipendenti." />
              <Field label="Sottotitolo lead" v={hero.titleAccent} onChange={(v) => update(["hero", "titleAccent"], v)} placeholder="L'AI gestisce" />
              <TextField label="Paragrafo sotto-headline" v={hero.subtitle} onChange={(v) => update(["hero", "subtitle"], v)} rows={3} placeholder="Webapp su misura + agenti AI…" />
              <ListField label="Parole rotanti (animate)" items={hero.rotatingWords} onChange={(arr) => update(["hero", "rotatingWords"], arr)} placeholder="telefonate" />
              <ListField label="Trust pills" items={hero.trustPills} onChange={(arr) => update(["hero", "trustPills"], arr)} placeholder="847+ business attivi" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="CTA primaria · testo" v={hero.ctaPrimaryLabel} onChange={(v) => update(["hero", "ctaPrimaryLabel"], v)} placeholder="Prenota call gratuita" />
                <Field label="CTA primaria · link" v={hero.ctaPrimaryHref} onChange={(v) => update(["hero", "ctaPrimaryHref"], v)} placeholder="/demo" />
                <Field label="CTA secondaria · testo" v={hero.ctaSecondaryLabel} onChange={(v) => update(["hero", "ctaSecondaryLabel"], v)} placeholder="Vedi 12 progetti live" />
                <Field label="CTA secondaria · link" v={hero.ctaSecondaryHref} onChange={(v) => update(["hero", "ctaSecondaryHref"], v)} placeholder="#portfolio" />
              </div>
            </TabsContent>

            {/* MANIFESTO */}
            <TabsContent value="manifesto" className="space-y-3 pt-4">
              <Field label="Eyebrow" v={manifesto.pillLabel} onChange={(v) => update(["manifesto", "pillLabel"], v)} placeholder="Manifesto Empire" />
              <ListField label="Parole (compongono la frase)" items={manifesto.words} onChange={(arr) => update(["manifesto", "words"], arr)} placeholder="Non" />
              <ListField label="Parole evidenziate (gradient)" items={manifesto.accentWords} onChange={(arr) => update(["manifesto", "accentWords"], arr)} placeholder="Liberiamo" />
              <StatsField label="Statistiche (4 card)" items={manifesto.stats} onChange={(arr) => update(["manifesto", "stats"], arr)} />
            </TabsContent>

            {/* PRICING */}
            <TabsContent value="pricing" className="space-y-3 pt-4">
              <Field label="Eyebrow" v={pricing.eyebrow} onChange={(v) => update(["pricing", "eyebrow"], v)} placeholder="Investimento · ROI · Scala" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Titolo (parte 1)" v={pricing.titleLead} onChange={(v) => update(["pricing", "titleLead"], v)} placeholder="Smetti di pagare stipendi." />
                <Field label="Titolo (parte 2, gradient)" v={pricing.titleAccent} onChange={(v) => update(["pricing", "titleAccent"], v)} placeholder="Inizia a pagare risultati." />
              </div>
              <TextField label="Sottotitolo" v={pricing.subtitle} onChange={(v) => update(["pricing", "subtitle"], v)} rows={2} />
              <ListField label="Trust strip" items={pricing.trustStrip} onChange={(arr) => update(["pricing", "trustStrip"], arr)} placeholder="Garanzia 90 giorni" />
              <PlansField items={pricing.plans} onChange={(arr) => update(["pricing", "plans"], arr)} />
              <StatsField label="Bottom stats (3 numeri)" items={pricing.bottomStats} onChange={(arr) => update(["pricing", "bottomStats"], arr)} />
            </TabsContent>

            {/* FAQ */}
            <TabsContent value="faq" className="space-y-3 pt-4">
              <Field label="Eyebrow" v={faq.pillLabel} onChange={(v) => update(["faq", "pillLabel"], v)} placeholder="Domande frequenti" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Titolo (parte 1)" v={faq.titleLead} onChange={(v) => update(["faq", "titleLead"], v)} />
                <Field label="Titolo (parte 2, gradient)" v={faq.titleAccent} onChange={(v) => update(["faq", "titleAccent"], v)} />
              </div>
              <FaqField items={faq.items} onChange={(arr) => update(["faq", "items"], arr)} />
            </TabsContent>

            {/* CTA + Footer */}
            <TabsContent value="cta" className="space-y-3 pt-4">
              <Field label="Eyebrow" v={cc.pillLabel} onChange={(v) => update(["contactCta", "pillLabel"], v)} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Titolo (parte 1)" v={cc.titleLead} onChange={(v) => update(["contactCta", "titleLead"], v)} />
                <Field label="Titolo (parte 2, gradient)" v={cc.titleAccent} onChange={(v) => update(["contactCta", "titleAccent"], v)} />
              </div>
              <TextField label="Sottotitolo" v={cc.subtitle} onChange={(v) => update(["contactCta", "subtitle"], v)} rows={2} />
              <div className="grid grid-cols-2 gap-2">
                <Field label="CTA primaria · testo" v={cc.primaryLabel} onChange={(v) => update(["contactCta", "primaryLabel"], v)} />
                <Field label="CTA primaria · link" v={cc.primaryHref} onChange={(v) => update(["contactCta", "primaryHref"], v)} />
                <Field label="CTA secondaria · testo" v={cc.secondaryLabel} onChange={(v) => update(["contactCta", "secondaryLabel"], v)} />
                <Field label="CTA secondaria · link" v={cc.secondaryHref} onChange={(v) => update(["contactCta", "secondaryHref"], v)} />
              </div>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Field label="Footer · brand" v={footer.tagline} onChange={(v) => update(["footer", "tagline"], v)} placeholder="Empire AI Group" />
                <Field label="Footer · email" v={footer.email} onChange={(v) => update(["footer", "email"], v)} placeholder="info@empireaigroup.com" />
                <Field label="Footer · telefono" v={footer.phone} onChange={(v) => update(["footer", "phone"], v)} />
                <Field label="Footer · indirizzo" v={footer.address} onChange={(v) => update(["footer", "address"], v)} />
              </div>
            </TabsContent>

            {/* BRAND */}
            <TabsContent value="brand" className="space-y-3 pt-4">
              <Card className="p-3 bg-card/60">
                <p className="text-xs text-muted-foreground">Formato HSL: tre valori separati da spazio, senza <code>hsl()</code>. Es: <code>215 90% 62%</code></p>
              </Card>
              <Field label="Primary (HSL)" v={brand.primaryHsl} onChange={(v) => update(["brand", "primaryHsl"], v)} placeholder="215 90% 62%" />
              <Field label="Accent (HSL)" v={brand.accentHsl} onChange={(v) => update(["brand", "accentHsl"], v)} placeholder="172 80% 58%" />
              <Field label="Gold (HSL)" v={brand.goldHsl} onChange={(v) => update(["brand", "goldHsl"], v)} placeholder="38 80% 62%" />
            </TabsContent>

            {/* SEZIONI VISIBILI */}
            <TabsContent value="sections" className="pt-4">
              <Card className="p-4 space-y-2 bg-card/60">
                <p className="text-xs text-muted-foreground mb-2">Spegni qualsiasi sezione della homepage. Off = la sezione non viene renderizzata.</p>
                {SECTION_KEYS.map(({ key, label }) => (
                  <div key={key} className="flex items-center justify-between py-2 border-b border-border/40 last:border-0">
                    <Label htmlFor={`sec-${key}`} className="text-sm">{label}</Label>
                    <Switch
                      id={`sec-${key}`}
                      checked={!hidden[key]}
                      onCheckedChange={(on) => update(["hidden", key as string], !on)}
                    />
                  </div>
                ))}
              </Card>
            </TabsContent>

            {/* JSON RAW */}
            <TabsContent value="json" className="pt-4">
              <Card className="p-3 bg-card/60">
                <p className="text-xs text-muted-foreground mb-2">Editor avanzato. Modifica direttamente il JSON dei contenuti. Errori sintassi vengono ignorati finché non sono validi.</p>
                <Textarea
                  className="font-mono text-xs h-[500px]"
                  value={JSON.stringify(content, null, 2)}
                  onChange={(e) => {
                    try {
                      setContent(JSON.parse(e.target.value));
                    } catch {
                      /* ignore until valid */
                    }
                  }}
                />
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live iPhone 16 Pro Max preview */}
        <div className="hidden lg:flex sticky top-[57px] h-[calc(100vh-57px)] flex-col items-center justify-start gap-3 px-6 py-6 bg-muted/30 border-l border-border">
          <div className="flex items-center gap-2 text-xs font-semibold">
            <Smartphone className="h-4 w-4 text-primary" /> Live · iPhone 16 Pro Max
            <a href="/?preview=1" target="_blank" rel="noopener" className="ml-2 text-muted-foreground hover:text-foreground">
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          </div>
          <IPhoneFrame iframeRef={iframeRef} />
          <p className="text-[10px] text-muted-foreground text-center max-w-[280px]">
            Le modifiche appaiono in tempo reale. Solo <strong>Pubblica</strong> le rende live sul sito reale.
          </p>
        </div>
      </div>

      {/* Mobile preview button */}
      <div className="lg:hidden fixed bottom-4 right-4 z-50">
        <a href="/?preview=1" target="_blank" rel="noopener">
          <Button size="sm" className="shadow-xl"><Eye className="mr-1.5 h-4 w-4" /> Apri anteprima</Button>
        </a>
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────── */
/*                  iPhone Frame                */
/* ──────────────────────────────────────────── */
function IPhoneFrame({ iframeRef }: { iframeRef: React.RefObject<HTMLIFrameElement> }) {
  // iPhone 16 Pro Max viewport: 430 × 932 CSS px
  // We render a frame ~340 wide and scale the iframe (430 wide) accordingly
  const FRAME_W = 340;
  const SCREEN_W = 430;
  const SCREEN_H = 932;
  const scale = (FRAME_W - 18) / SCREEN_W;
  return (
    <div className="relative" style={{ width: FRAME_W, height: SCREEN_H * scale + 18 }}>
      <div
        className="absolute inset-0 rounded-[52px] border-[5px] border-foreground/15 bg-foreground/5 shadow-2xl overflow-hidden"
      >
        {/* Dynamic Island */}
        <div className="absolute top-[10px] left-1/2 -translate-x-1/2 w-[110px] h-[28px] bg-black rounded-full z-20" />
        {/* Side buttons */}
        <div className="absolute -left-[5px] top-[100px] w-[4px] h-[28px] bg-foreground/20 rounded-l-full" />
        <div className="absolute -left-[5px] top-[150px] w-[4px] h-[48px] bg-foreground/20 rounded-l-full" />
        <div className="absolute -left-[5px] top-[210px] w-[4px] h-[48px] bg-foreground/20 rounded-l-full" />
        <div className="absolute -right-[5px] top-[150px] w-[4px] h-[70px] bg-foreground/20 rounded-r-full" />
        {/* Screen */}
        <div className="absolute inset-[5px] rounded-[46px] overflow-hidden bg-background">
          <iframe
            ref={iframeRef}
            src="/?preview=1"
            title="Anteprima homepage"
            className="border-0 origin-top-left"
            style={{
              width: SCREEN_W,
              height: SCREEN_H,
              transform: `scale(${scale})`,
              transformOrigin: "top left",
            }}
          />
        </div>
        {/* Home indicator */}
        <div className="absolute bottom-[8px] left-1/2 -translate-x-1/2 w-[120px] h-[5px] bg-foreground/25 rounded-full z-20" />
      </div>
    </div>
  );
}

/* ──────────────────────────────────────────── */
/*               Field primitives               */
/* ──────────────────────────────────────────── */
function Field({ label, v, onChange, placeholder }: { label: string; v?: string; onChange: (s: string) => void; placeholder?: string }) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Input value={v ?? ""} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1" />
    </div>
  );
}
function TextField({ label, v, onChange, rows = 3, placeholder }: { label: string; v?: string; onChange: (s: string) => void; rows?: number; placeholder?: string }) {
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <Textarea value={v ?? ""} rows={rows} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-1" />
    </div>
  );
}
function ListField({ label, items, onChange, placeholder }: { label: string; items?: string[]; onChange: (a: string[]) => void; placeholder?: string }) {
  const arr = items ?? [];
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="space-y-1.5 mt-1">
        {arr.map((it, i) => (
          <div key={i} className="flex gap-1.5">
            <Input value={it} placeholder={placeholder} onChange={(e) => { const n = [...arr]; n[i] = e.target.value; onChange(n); }} />
            <Button variant="ghost" size="icon" onClick={() => onChange(arr.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...arr, ""])}><Plus className="h-3 w-3 mr-1" /> Aggiungi</Button>
      </div>
    </div>
  );
}
function StatsField({ label, items, onChange }: { label: string; items?: Stat[]; onChange: (a: Stat[]) => void }) {
  const arr = items ?? [];
  return (
    <div>
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</Label>
      <div className="space-y-2 mt-1">
        {arr.map((s, i) => (
          <div key={i} className="grid grid-cols-[1fr_2fr_auto] gap-2">
            <Input value={s.value} placeholder="847+" onChange={(e) => { const n = [...arr]; n[i] = { ...s, value: e.target.value }; onChange(n); }} />
            <Input value={s.label} placeholder="business attivati" onChange={(e) => { const n = [...arr]; n[i] = { ...s, label: e.target.value }; onChange(n); }} />
            <Button variant="ghost" size="icon" onClick={() => onChange(arr.filter((_, idx) => idx !== i))}><Trash2 className="h-4 w-4" /></Button>
          </div>
        ))}
        <Button variant="outline" size="sm" onClick={() => onChange([...arr, { value: "", label: "" }])}><Plus className="h-3 w-3 mr-1" /> Aggiungi</Button>
      </div>
    </div>
  );
}
function FaqField({ items, onChange }: { items?: FaqItem[]; onChange: (a: FaqItem[]) => void }) {
  const arr = items ?? [];
  return (
    <div className="space-y-2">
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Domande</Label>
      <Accordion type="single" collapsible className="w-full">
        {arr.map((f, i) => (
          <AccordionItem key={i} value={`f-${i}`}>
            <AccordionTrigger className="text-sm">{f.q || `Domanda ${i + 1}`}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-1">
              <Input value={f.q} placeholder="Domanda" onChange={(e) => { const n = [...arr]; n[i] = { ...f, q: e.target.value }; onChange(n); }} />
              <Textarea value={f.a} rows={3} placeholder="Risposta" onChange={(e) => { const n = [...arr]; n[i] = { ...f, a: e.target.value }; onChange(n); }} />
              <Button variant="ghost" size="sm" onClick={() => onChange(arr.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3 mr-1" /> Rimuovi</Button>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="outline" size="sm" onClick={() => onChange([...arr, { q: "", a: "" }])}><Plus className="h-3 w-3 mr-1" /> Aggiungi domanda</Button>
    </div>
  );
}
function PlansField({ items, onChange }: { items?: PricingPlan[]; onChange: (a: PricingPlan[]) => void }) {
  const arr = items ?? [];
  const setAt = (i: number, patch: Partial<PricingPlan>) => {
    const n = [...arr]; n[i] = { ...n[i], ...patch }; onChange(n);
  };
  return (
    <div className="space-y-2">
      <Label className="text-[11px] uppercase tracking-wider text-muted-foreground">Piani (lascia vuoto per usare i 3 default)</Label>
      <Accordion type="single" collapsible className="w-full">
        {arr.map((p, i) => (
          <AccordionItem key={i} value={`p-${i}`}>
            <AccordionTrigger className="text-sm">{p.name || `Piano ${i + 1}`} {p.featured ? <Badge className="ml-2">In evidenza</Badge> : null}</AccordionTrigger>
            <AccordionContent className="space-y-2 pt-1">
              <div className="grid grid-cols-2 gap-2">
                <Input placeholder="Nome (Digital Start)" value={p.name} onChange={(e) => setAt(i, { name: e.target.value })} />
                <Input placeholder="Best for" value={p.bestFor} onChange={(e) => setAt(i, { bestFor: e.target.value })} />
                <Input placeholder="Setup (€1.997)" value={p.setup} onChange={(e) => setAt(i, { setup: e.target.value })} />
                <Input placeholder="Setup rate (o 3× €697)" value={p.setupRate} onChange={(e) => setAt(i, { setupRate: e.target.value })} />
                <Input placeholder="Monthly (€49)" value={p.monthly} onChange={(e) => setAt(i, { monthly: e.target.value })} />
                <Input placeholder="CTA (Inizia con…)" value={p.cta} onChange={(e) => setAt(i, { cta: e.target.value })} />
                <Input placeholder="Value line" value={p.valueLine} onChange={(e) => setAt(i, { valueLine: e.target.value })} />
                <Input placeholder="Saved (€14.400/anno)" value={p.saved} onChange={(e) => setAt(i, { saved: e.target.value })} />
                <Input placeholder="Badge (es. Più scelto)" value={p.badge ?? ""} onChange={(e) => setAt(i, { badge: e.target.value })} />
                <select
                  className="bg-background border border-input rounded-md px-3 text-sm"
                  value={p.tone ?? "gold"}
                  onChange={(e) => setAt(i, { tone: e.target.value as any })}
                >
                  <option value="blue">Tono Blue</option>
                  <option value="gold">Tono Gold</option>
                  <option value="violet">Tono Violet</option>
                </select>
              </div>
              <Textarea placeholder="Descrizione" rows={2} value={p.desc} onChange={(e) => setAt(i, { desc: e.target.value })} />
              <ListField label="Features" items={p.features} onChange={(arr2) => setAt(i, { features: arr2 })} placeholder="Sito premium su misura" />
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm">
                  <Switch checked={!!p.featured} onCheckedChange={(on) => setAt(i, { featured: on })} /> In evidenza
                </label>
                <Button variant="ghost" size="sm" onClick={() => onChange(arr.filter((_, idx) => idx !== i))}><Trash2 className="h-3 w-3 mr-1" /> Rimuovi piano</Button>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      <Button variant="outline" size="sm" onClick={() => onChange([...arr, { name: "Nuovo piano", setup: "", setupRate: "", monthly: "", desc: "", valueLine: "", saved: "", features: [], bestFor: "", cta: "Inizia ora", tone: "gold" }])}>
        <Plus className="h-3 w-3 mr-1" /> Aggiungi piano
      </Button>
    </div>
  );
}
