import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Loader2, Sparkles, Smartphone, Wand2, Crown, Zap, Eye, Copy, Download, ExternalLink } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { MockupSuiteViewer, type SuiteScreen } from "./MockupSuiteViewer";

export type MockupEngine = "react" | "nano_banana" | "nano_banana_pro";
export type ScreenType = "home" | "menu" | "booking" | "profile" | "gallery" | "checkout";

interface Props {
  businessName: string;
  businessSector?: string;
  businessCity?: string;
  primaryColor?: string;
  templateVariant?: string;
  leadId?: string;
  previewId?: string;
  onGenerated?: (suiteId: string, shareSlug: string) => void;
}

const ENGINE_OPTIONS: { key: MockupEngine; label: string; cost: number; icon: React.ElementType; desc: string; color: string }[] = [
  { key: "react",           label: "React Render",     cost: 0,  icon: Zap,    desc: "Gratis · template fedeli · veloce",          color: "from-emerald-500 to-teal-600" },
  { key: "nano_banana",     label: "Nano Banana 2",    cost: 20, icon: Wand2,  desc: "AI fotorealistico · qualità premium",        color: "from-amber-500 to-orange-600" },
  { key: "nano_banana_pro", label: "Nano Banana Pro",  cost: 40, icon: Crown,  desc: "AI cinematografico 8K · qualità massima",    color: "from-fuchsia-500 to-purple-700" },
];

const TEMPLATE_VARIANTS = [
  { key: "auto",         label: "Auto (rilevato)" },
  { key: "paperfish",    label: "Paperfish Sakura (sushi/giapponese)" },
  { key: "strapizzami",  label: "Strapizzami (pizzeria/italiano)" },
  { key: "batey",        label: "Batey Pacifico (mare/lido)" },
  { key: "luxury_gold",  label: "Luxury Gold (alta cucina)" },
  { key: "modern_dark",  label: "Modern Dark (universale)" },
  { key: "casual_warm",  label: "Casual Warm (trattoria/bistrot)" },
  { key: "minimal_zen",  label: "Minimal Zen (spa/wellness)" },
];

const SCREEN_TYPES: { key: ScreenType; label: string }[] = [
  { key: "home",     label: "Home" },
  { key: "menu",     label: "Menu / Servizi" },
  { key: "booking",  label: "Prenotazione" },
  { key: "profile",  label: "Profilo / Recensioni" },
  { key: "gallery",  label: "Galleria" },
  { key: "checkout", label: "Checkout / Pagamento" },
];

export function MockupSuiteGenerator({
  businessName,
  businessSector = "",
  businessCity = "",
  primaryColor = "#C8963E",
  templateVariant: initialTemplate,
  leadId,
  previewId,
  onGenerated,
}: Props) {
  const [engine, setEngine] = useState<MockupEngine>("react");
  const [templateVariant, setTemplateVariant] = useState<string>(initialTemplate || "auto");
  const [screens, setScreens] = useState<{ type: ScreenType; title: string }[]>([
    { type: "home",    title: "Home" },
    { type: "menu",    title: "Menu" },
    { type: "booking", title: "Prenotazione" },
    { type: "profile", title: "Profilo" },
  ]);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState<{
    suite_id: string;
    share_slug: string;
    template_variant: string;
    engine: MockupEngine;
    screens: SuiteScreen[];
  } | null>(null);

  const handleGenerate = async () => {
    if (!businessName?.trim()) {
      toast.error("Inserisci prima il nome attività");
      return;
    }
    setGenerating(true);
    setResult(null);
    try {
      const payload = {
        business_name: businessName,
        business_sector: businessSector,
        business_city: businessCity,
        primary_color: primaryColor,
        engine,
        template_variant: templateVariant === "auto" ? undefined : templateVariant,
        lead_id: leadId,
        preview_id: previewId,
        screens,
      };

      const { data, error } = await supabase.functions.invoke("lead-mockup-suite", { body: payload });
      if (error) throw error;
      const d = data as any;
      if (!d?.success) {
        if (d?.error === "insufficient_credits") {
          toast.error(`Crediti insufficienti per ${ENGINE_OPTIONS.find(e => e.key === engine)?.label}`);
        } else if (d?.error === "ai_rate_limited") {
          toast.error("AI temporaneamente sovraccarica. Riprova tra qualche secondo o usa modalità React (gratis).");
        } else {
          toast.error(`Errore: ${d?.error || "sconosciuto"}`);
        }
        return;
      }

      setResult({
        suite_id: d.suite_id,
        share_slug: d.share_slug,
        template_variant: d.template_variant,
        engine: d.engine,
        screens: d.screens,
      });
      toast.success(`Suite generata! ${d.credits_spent} crediti usati.`);
      onGenerated?.(d.suite_id, d.share_slug);
    } catch (e: any) {
      toast.error(e.message || "Errore generazione");
    } finally {
      setGenerating(false);
    }
  };

  const copyShareLink = () => {
    if (!result?.share_slug) return;
    const url = `${window.location.origin}/preview/mockup/${result.share_slug}`;
    navigator.clipboard.writeText(url);
    toast.success("Link copiato negli appunti");
  };

  const selectedEngineCfg = ENGINE_OPTIONS.find(e => e.key === engine)!;

  return (
    <Card className="border-primary/30">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="h-5 w-5 text-primary" />
          Mockup iPhone Suite — 4 schermate app del business
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Selettore motore */}
        <div>
          <Label className="mb-2 block">Motore di generazione</Label>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {ENGINE_OPTIONS.map(opt => {
              const Icon = opt.icon;
              const selected = engine === opt.key;
              return (
                <button
                  key={opt.key}
                  type="button"
                  onClick={() => setEngine(opt.key)}
                  className={`relative p-4 rounded-xl border-2 text-left transition-all overflow-hidden group ${
                    selected ? "border-primary scale-[1.02] shadow-lg" : "border-border hover:border-primary/50"
                  }`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${opt.color} opacity-${selected ? "20" : "5"} transition-opacity`} />
                  <div className="relative">
                    <div className="flex items-center justify-between mb-2">
                      <Icon className="h-5 w-5 text-foreground" />
                      <Badge variant={opt.cost === 0 ? "secondary" : "default"} className="text-xs">
                        {opt.cost === 0 ? "GRATIS" : `${opt.cost} crediti`}
                      </Badge>
                    </div>
                    <p className="font-semibold text-sm">{opt.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Template variante */}
        <div>
          <Label htmlFor="template-variant">Stile template</Label>
          <Select value={templateVariant} onValueChange={setTemplateVariant}>
            <SelectTrigger id="template-variant">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TEMPLATE_VARIANTS.map(t => (
                <SelectItem key={t.key} value={t.key}>{t.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* 4 schermate configurabili */}
        <div>
          <Label className="mb-2 block">Schermate da generare (4 mockup)</Label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {screens.map((s, i) => (
              <div key={i} className="flex gap-2 items-center p-2 rounded-lg border bg-muted/30">
                <Badge variant="outline" className="text-xs shrink-0">#{i + 1}</Badge>
                <Select
                  value={s.type}
                  onValueChange={(v) => setScreens(prev => prev.map((x, j) => j === i ? { ...x, type: v as ScreenType, title: SCREEN_TYPES.find(t => t.key === v)?.label || x.title } : x))}
                >
                  <SelectTrigger className="h-8 text-xs flex-1">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SCREEN_TYPES.map(t => (
                      <SelectItem key={t.key} value={t.key} className="text-xs">{t.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  className="h-8 text-xs w-32"
                  value={s.title}
                  onChange={e => setScreens(prev => prev.map((x, j) => j === i ? { ...x, title: e.target.value } : x))}
                  placeholder="Titolo"
                />
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <Button
          onClick={handleGenerate}
          disabled={generating || !businessName?.trim()}
          size="lg"
          className="w-full"
        >
          {generating ? (
            <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Generazione 4 mockup in corso…</>
          ) : (
            <><Sparkles className="h-4 w-4 mr-2" /> Genera Suite ({selectedEngineCfg.cost === 0 ? "GRATIS" : `${selectedEngineCfg.cost} crediti`})</>
          )}
        </Button>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-muted-foreground text-center">
          <span>✓ 4 schermate iPhone</span>
          <span>✓ Template fedele al settore</span>
          <span>✓ Link condivisibile</span>
          <span>✓ Download PNG</span>
        </div>

        {/* Risultato */}
        {result && (
          <div className="pt-4 border-t space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div>
                <h3 className="font-semibold text-sm flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" />
                  Suite generata · {result.template_variant.replace("_", " ")} · {ENGINE_OPTIONS.find(e => e.key === result.engine)?.label}
                </h3>
                <p className="text-xs text-muted-foreground mt-1">4 mockup pronti da mostrare al cliente</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={copyShareLink}><Copy className="h-3 w-3 mr-1" />Link</Button>
                <Button variant="outline" size="sm" onClick={() => window.open(`${window.location.origin}/preview/mockup/${result.share_slug}`, "_blank")}>
                  <ExternalLink className="h-3 w-3 mr-1" />Apri
                </Button>
              </div>
            </div>

            <MockupSuiteViewer
              screens={result.screens}
              templateVariant={result.template_variant}
              businessName={businessName}
              businessSector={businessSector}
              businessCity={businessCity}
              primaryColor={primaryColor}
              suiteId={result.suite_id}
            />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
