// ══════════════════════════════════════════════════════════════
// AutopilotConfigDialog — Pannello completo di configurazione
// Soglie, cap giornaliero, autonomia AI, canali, modello, settori
// ══════════════════════════════════════════════════════════════
import { useEffect, useMemo, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  Bot,
  Shield,
  Zap,
  Clock,
  RotateCcw,
  Save,
  Mail,
  MessageCircle,
  Phone,
  Loader2,
  AlertTriangle,
  Target,
  Users,
} from "lucide-react";
import {
  useAutopilotConfig,
  useUpdateAutopilotConfig,
  useResetDailyScanCounter,
  type AutopilotConfigPatch,
  type LeadPriorityRules,
} from "@/hooks/useAutopilot";

// ── Costanti UI ──
const AI_MODELS = [
  { value: "google/gemini-2.5-pro", label: "Gemini 2.5 Pro", hint: "Top quality · Reasoning profondo" },
  { value: "google/gemini-2.5-flash", label: "Gemini 2.5 Flash", hint: "Bilanciato · Cost-efficient" },
  { value: "google/gemini-2.5-flash-lite", label: "Gemini 2.5 Flash Lite", hint: "Veloce · Volumi alti" },
  { value: "openai/gpt-5", label: "GPT-5", hint: "Premium · Multimodale" },
  { value: "openai/gpt-5-mini", label: "GPT-5 Mini", hint: "Mid-tier · Ottimo rapporto" },
];

const AUTONOMY_LEVELS: Array<{
  value: "conservative" | "balanced" | "aggressive" | "full_auto";
  label: string;
  desc: string;
  color: string;
}> = [
  {
    value: "conservative",
    label: "Conservativo",
    desc: "Arianna propone, tu approvi tutto manualmente",
    color: "text-emerald-500",
  },
  {
    value: "balanced",
    label: "Bilanciato",
    desc: "Auto-scan e ROI · Messaggi richiedono ok",
    color: "text-blue-500",
  },
  {
    value: "aggressive",
    label: "Aggressivo",
    desc: "Invio messaggi automatici · Tu supervisioni",
    color: "text-amber-500",
  },
  {
    value: "full_auto",
    label: "Full Autopilot",
    desc: "Arianna fa tutto — scan, contact, follow-up",
    color: "text-fuchsia-500",
  },
];

const CHANNELS = [
  { value: "email", label: "Email", icon: Mail },
  { value: "chat", label: "Chat / Web", icon: MessageCircle },
  { value: "whatsapp_link", label: "WhatsApp", icon: Phone },
];

const SECTORS = [
  "ristorazione",
  "beauty",
  "fitness",
  "ncc",
  "hotel",
  "balneare",
  "studi_medici",
  "studi_legali",
  "ecommerce",
  "retail",
];

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function AutopilotConfigDialog({ open, onOpenChange }: Props) {
  const { data: cfg, isLoading } = useAutopilotConfig();
  const update = useUpdateAutopilotConfig();
  const resetCounter = useResetDailyScanCounter();

  // ── Stato locale form ──
  const [isEnabled, setIsEnabled] = useState(true);
  const [aiModel, setAiModel] = useState("google/gemini-2.5-pro");
  const [autonomy, setAutonomy] =
    useState<AutopilotConfigPatch["autonomy_level"]>("balanced");
  const [dailyCap, setDailyCap] = useState(100);
  const [channels, setChannels] = useState<string[]>(["email", "chat", "whatsapp_link"]);
  const [sectors, setSectors] = useState<string[]>([]);
  const [hoursStart, setHoursStart] = useState("09:00");
  const [hoursEnd, setHoursEnd] = useState("19:00");
  const [instructions, setInstructions] = useState("");

  // Regole priorità lead + concorrenza conversazioni
  const DEFAULT_RULES: LeadPriorityRules = {
    pain_score_weight: 40,
    roi_potential_weight: 35,
    sector_match_weight: 15,
    recency_weight: 10,
    min_pain_score: 50,
    min_roi_eur_month: 0,
    preferred_sectors: [],
    excluded_sectors: [],
  };
  const [priorityRules, setPriorityRules] = useState<LeadPriorityRules>(DEFAULT_RULES);
  const [maxConcurrent, setMaxConcurrent] = useState(5);
  const [maxNewPerRun, setMaxNewPerRun] = useState(3);

  const totalWeight =
    priorityRules.pain_score_weight +
    priorityRules.roi_potential_weight +
    priorityRules.sector_match_weight +
    priorityRules.recency_weight;

  // Hydrate form quando arrivano i dati
  useEffect(() => {
    if (!cfg) return;
    const c = cfg as any;
    setIsEnabled(!!c.is_enabled);
    setAiModel(c.ai_model || "google/gemini-2.5-pro");
    setAutonomy(c.autonomy_level || "balanced");
    setDailyCap(c.daily_scan_cap ?? 100);
    setChannels(
      Array.isArray(c.enabled_channels) && c.enabled_channels.length > 0
        ? c.enabled_channels
        : ["email", "chat", "whatsapp_link"],
    );
    setSectors(Array.isArray(c.target_sectors) ? c.target_sectors : []);
    setHoursStart(c.operating_hours?.start || "09:00");
    setHoursEnd(c.operating_hours?.end || "19:00");
    setInstructions(c.custom_instructions || "");
  }, [cfg, open]);

  const used = (cfg as any)?.daily_scans_used || 0;
  const usagePct = useMemo(
    () => Math.min(100, Math.round((used / Math.max(dailyCap, 1)) * 100)),
    [used, dailyCap],
  );

  const toggleChannel = (ch: string) =>
    setChannels((prev) =>
      prev.includes(ch) ? prev.filter((c) => c !== ch) : [...prev, ch],
    );

  const toggleSector = (s: string) =>
    setSectors((prev) =>
      prev.includes(s) ? prev.filter((x) => x !== s) : [...prev, s],
    );

  const handleSave = async () => {
    if (channels.length === 0) {
      toast.error("Seleziona almeno un canale di comunicazione");
      return;
    }
    if (dailyCap < 1 || dailyCap > 5000) {
      toast.error("Il cap giornaliero deve essere tra 1 e 5000");
      return;
    }
    try {
      await update.mutateAsync({
        is_enabled: isEnabled,
        ai_model: aiModel,
        autonomy_level: autonomy,
        daily_scan_cap: dailyCap,
        enabled_channels: channels,
        target_sectors: sectors,
        custom_instructions: instructions.trim() || null,
        operating_hours: {
          start: hoursStart,
          end: hoursEnd,
          timezone: "Europe/Rome",
        },
      });
      toast.success("Configurazione Autopilot salvata", {
        description: `Modello ${aiModel.split("/")[1]} · ${autonomy} · cap ${dailyCap}/giorno`,
      });
      onOpenChange(false);
    } catch (e: any) {
      toast.error("Salvataggio fallito", { description: e?.message });
    }
  };

  const handleReset = async () => {
    try {
      await resetCounter.mutateAsync();
      toast.success("Contatore giornaliero azzerato");
    } catch (e: any) {
      toast.error("Reset fallito", { description: e?.message });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-foreground">
            <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
              <Bot className="w-5 h-5 text-primary" />
            </div>
            Configurazione Empire Autopilot
          </DialogTitle>
          <DialogDescription>
            Definisci soglie, cap giornaliero e modalità di autonomia di Arianna.
            Le modifiche hanno effetto immediato sulle prossime esecuzioni.
          </DialogDescription>
        </DialogHeader>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          <div className="space-y-6 py-2">
            {/* ── Master switch ── */}
            <section className="flex items-center justify-between p-4 rounded-xl border border-border bg-card">
              <div className="space-y-0.5">
                <Label className="text-sm font-bold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-primary" /> Autopilot attivo
                </Label>
                <p className="text-xs text-muted-foreground">
                  Quando spento, Arianna sospende ogni scan automatico e messaggio in uscita.
                </p>
              </div>
              <Switch checked={isEnabled} onCheckedChange={setIsEnabled} />
            </section>

            {/* ── Modello AI ── */}
            <section className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Modello AI cervello</Label>
              <Select value={aiModel} onValueChange={setAiModel}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      <div className="flex flex-col">
                        <span className="font-medium">{m.label}</span>
                        <span className="text-[10px] text-muted-foreground">{m.hint}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </section>

            {/* ── Autonomia ── */}
            <section className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" /> Livello di autonomia
              </Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {AUTONOMY_LEVELS.map((lvl) => {
                  const active = autonomy === lvl.value;
                  return (
                    <button
                      key={lvl.value}
                      type="button"
                      onClick={() => setAutonomy(lvl.value)}
                      className={`text-left p-3 rounded-xl border transition-all ${
                        active
                          ? "border-primary bg-primary/10 shadow-sm"
                          : "border-border bg-card hover:border-primary/40"
                      }`}
                    >
                      <p className={`text-sm font-bold ${active ? "text-primary" : lvl.color}`}>
                        {lvl.label}
                      </p>
                      <p className="text-[11px] text-muted-foreground mt-0.5">{lvl.desc}</p>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Cap giornaliero ── */}
            <section className="space-y-3 p-4 rounded-xl border border-border bg-card">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                  <Zap className="w-4 h-4 text-amber-500" /> Cap giornaliero Pain Scan
                </Label>
                <Badge variant="outline" className="font-mono">
                  {dailyCap} / giorno
                </Badge>
              </div>
              <Slider
                value={[dailyCap]}
                min={10}
                max={1000}
                step={10}
                onValueChange={(v) => setDailyCap(v[0])}
              />
              <div className="flex items-center justify-between text-[11px] text-muted-foreground">
                <span>Min 10</span>
                <span>Usati oggi: <span className="font-bold text-foreground">{used}</span> ({usagePct}%)</span>
                <span>Max 1000</span>
              </div>
              {usagePct > 85 && (
                <div className="flex items-start gap-2 p-2 rounded-lg bg-destructive/10 text-destructive text-[11px]">
                  <AlertTriangle className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                  Stai per esaurire il cap. Aumentalo o azzera il contatore per continuare oggi.
                </div>
              )}
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleReset}
                disabled={resetCounter.isPending}
                className="w-full"
              >
                <RotateCcw className="w-3.5 h-3.5 mr-2" />
                {resetCounter.isPending ? "Azzeramento..." : "Azzera contatore di oggi"}
              </Button>
            </section>

            {/* ── Canali ── */}
            <section className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">Canali di comunicazione</Label>
              <div className="grid grid-cols-3 gap-2">
                {CHANNELS.map((ch) => {
                  const active = channels.includes(ch.value);
                  const Icon = ch.icon;
                  return (
                    <button
                      key={ch.value}
                      type="button"
                      onClick={() => toggleChannel(ch.value)}
                      className={`p-3 rounded-xl border flex flex-col items-center gap-1.5 transition-all ${
                        active
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-xs font-semibold">{ch.label}</span>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Settori target ── */}
            <section className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Settori target <span className="text-muted-foreground font-normal">(vuoto = tutti)</span>
              </Label>
              <div className="flex flex-wrap gap-1.5">
                {SECTORS.map((s) => {
                  const active = sectors.includes(s);
                  return (
                    <button
                      key={s}
                      type="button"
                      onClick={() => toggleSector(s)}
                      className={`px-3 py-1.5 rounded-full text-[11px] font-semibold border transition-all ${
                        active
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border bg-card text-muted-foreground hover:border-primary/40"
                      }`}
                    >
                      {s.replace(/_/g, " ")}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* ── Operating hours ── */}
            <section className="space-y-2">
              <Label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-primary" /> Orari operativi (Europe/Rome)
              </Label>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-[11px] text-muted-foreground">Inizio</Label>
                  <Input
                    type="time"
                    value={hoursStart}
                    onChange={(e) => setHoursStart(e.target.value)}
                  />
                </div>
                <div>
                  <Label className="text-[11px] text-muted-foreground">Fine</Label>
                  <Input
                    type="time"
                    value={hoursEnd}
                    onChange={(e) => setHoursEnd(e.target.value)}
                  />
                </div>
              </div>
              <p className="text-[10px] text-muted-foreground">
                I messaggi auto vengono pianificati solo in questa finestra.
              </p>
            </section>

            {/* ── Custom instructions ── */}
            <section className="space-y-2">
              <Label className="text-sm font-semibold text-foreground">
                Istruzioni custom per Arianna <span className="text-muted-foreground font-normal">(opz.)</span>
              </Label>
              <Textarea
                rows={3}
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                placeholder="Es. Tono formale, mai promettere sconti > 20%, focus su settore ristorazione fine dining..."
                maxLength={1000}
              />
              <p className="text-[10px] text-muted-foreground text-right">
                {instructions.length}/1000
              </p>
            </section>
          </div>
        )}

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Annulla
          </Button>
          <Button onClick={handleSave} disabled={update.isPending || isLoading}>
            {update.isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Salvataggio...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" /> Salva configurazione
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
