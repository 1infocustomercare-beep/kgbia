// Dialog di override manuale dei criteri lead caldi di Arianna.
// Il venditore può attivare/disattivare l'auto-tune AI e/o modificare ogni soglia.
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Sparkles, Save, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export interface QualityFiltersValue {
  require_no_website: boolean;
  require_no_social: boolean;
  min_rating: number;
  min_reviews: number;
  premium_sectors_only: boolean;
}

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  userId: string;
  initialFilters: QualityFiltersValue;
  initialAutoTune: boolean;
  onSaved: (next: { filters: QualityFiltersValue; auto_tune_enabled: boolean }) => void;
}

export default function AriannaCriteriaOverrideDialog({
  open, onOpenChange, userId, initialFilters, initialAutoTune, onSaved,
}: Props) {
  const [autoTune, setAutoTune] = useState(initialAutoTune);
  const [filters, setFilters] = useState<QualityFiltersValue>(initialFilters);
  const [saving, setSaving] = useState(false);
  const [tuning, setTuning] = useState(false);

  useEffect(() => {
    if (open) {
      setAutoTune(initialAutoTune);
      setFilters(initialFilters);
    }
  }, [open, initialAutoTune, initialFilters]);

  const save = async () => {
    setSaving(true);
    const { error } = await supabase
      .from("arianna_autopilot_state" as any)
      .update({ quality_filters: filters, auto_tune_enabled: autoTune })
      .eq("user_id", userId);
    setSaving(false);
    if (error) { toast.error("Errore salvataggio criteri"); return; }
    toast.success("Criteri aggiornati");
    onSaved({ filters, auto_tune_enabled: autoTune });
    onOpenChange(false);
  };

  const runTuneNow = async () => {
    setTuning(true);
    const { data, error } = await supabase.functions.invoke("arianna-tune-quality-filters", {
      body: { user_id: userId },
    });
    setTuning(false);
    if (error) { toast.error("Auto-tune fallito"); return; }
    if ((data as any)?.tuned) {
      setFilters((data as any).tuned);
      toast.success("Criteri ricalibrati dall'AI sui tuoi lead");
    } else if ((data as any)?.skipped === "not_enough_data") {
      toast.info("Servono almeno 10 lead per la calibrazione AI");
    } else {
      toast.info("Nessuna modifica necessaria");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            Criteri lead caldi
          </DialogTitle>
          <DialogDescription>
            Arianna calibra i criteri da sola in base ai tuoi risultati. Puoi forzarli manualmente disattivando l'auto-tune.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Auto-tune AI */}
          <div className="flex items-center justify-between rounded-lg border border-border p-3">
            <div className="space-y-0.5">
              <Label className="text-sm font-semibold">Calibrazione automatica AI</Label>
              <p className="text-xs text-muted-foreground">L'AI aggiorna le soglie ogni settimana sui tuoi vinti/persi.</p>
            </div>
            <Switch checked={autoTune} onCheckedChange={setAutoTune} />
          </div>

          {/* Bottone calibra ora */}
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="w-full"
            onClick={runTuneNow}
            disabled={tuning}
          >
            {tuning ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-2" /> : <RefreshCw className="w-3.5 h-3.5 mr-2" />}
            Calibra ora con i miei dati
          </Button>

          {/* Override manuali (sempre modificabili, ma se auto_tune=true verranno sovrascritti al prossimo ciclo) */}
          <div className="space-y-3 rounded-lg border border-border p-3">
            <div className="flex items-center justify-between">
              <Label className="text-xs">❌ Solo lead senza sito</Label>
              <Switch
                checked={filters.require_no_website}
                onCheckedChange={(v) => setFilters({ ...filters, require_no_website: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">📱 Solo lead senza social</Label>
              <Switch
                checked={filters.require_no_social}
                onCheckedChange={(v) => setFilters({ ...filters, require_no_social: v })}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-xs">💰 Solo settori premium</Label>
              <Switch
                checked={filters.premium_sectors_only}
                onCheckedChange={(v) => setFilters({ ...filters, premium_sectors_only: v })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">⭐ Rating minimo</Label>
                <span className="text-xs font-bold tabular-nums">{filters.min_rating.toFixed(1)}</span>
              </div>
              <Slider
                value={[filters.min_rating]}
                min={3}
                max={5}
                step={0.1}
                onValueChange={(v) => setFilters({ ...filters, min_rating: v[0] })}
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <Label className="text-xs">💬 Recensioni minime</Label>
                <span className="text-xs font-bold tabular-nums">{filters.min_reviews}</span>
              </div>
              <Slider
                value={[filters.min_reviews]}
                min={5}
                max={150}
                step={5}
                onValueChange={(v) => setFilters({ ...filters, min_reviews: v[0] })}
              />
            </div>
          </div>

          {autoTune && (
            <p className="text-[10px] text-muted-foreground italic">
              ⚠️ Auto-tune attivo: le soglie qui sopra possono essere sovrascritte dall'AI alla prossima calibrazione settimanale.
            </p>
          )}

          <Button onClick={save} disabled={saving} className="w-full">
            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
            Salva criteri
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
