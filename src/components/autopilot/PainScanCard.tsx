// ══════════════════════════════════════════════════════════════
// PainScanCard — Trigger + visualizzazione Pain Detector AI
// ══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion } from "framer-motion";
import { AlertTriangle, Loader2, Search, TrendingDown, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRunPainScan, usePainScans } from "@/hooks/useAutopilot";
import { toast } from "@/hooks/use-toast";

export default function PainScanCard() {
  const [url, setUrl] = useState("");
  const [sector, setSector] = useState("");
  const runScan = useRunPainScan();
  const { data: scans = [], isLoading } = usePainScans();

  const onScan = async () => {
    if (!url.trim()) {
      toast({ title: "Inserisci un URL", description: "Es: https://ristorantemario.it", variant: "destructive" });
      return;
    }
    try {
      const res: any = await runScan.mutateAsync({ url: url.trim(), sector: sector.trim() || undefined });
      toast({
        title: res?.cached ? "📦 Risultato dalla cache" : "🔥 Pain Scan completato",
        description: `Perdita stimata: €${(res?.scan?.estimated_monthly_loss_eur || 0).toLocaleString("it-IT")}/mese`,
      });
      setUrl("");
    } catch (e: any) {
      toast({ title: "Scan fallito", description: e?.message || "Errore sconosciuto", variant: "destructive" });
    }
  };

  return (
    <div className="partner-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-destructive/15 flex items-center justify-center">
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Pain Detector AI</h3>
            <p className="text-[10px] text-muted-foreground">Scansiona un sito → fattura persa stimata</p>
          </div>
        </div>
        <span className="text-[9px] uppercase tracking-widest text-primary font-bold">Gemini 2.5 Pro</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_auto] gap-2">
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://sitodelcliente.it"
          className="h-10 text-sm"
        />
        <Input
          value={sector}
          onChange={(e) => setSector(e.target.value)}
          placeholder="Settore (es: ristorante)"
          className="h-10 text-sm"
        />
        <Button onClick={onScan} disabled={runScan.isPending} className="h-10 gap-2">
          {runScan.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
          Scan
        </Button>
      </div>

      {/* Lista scan recenti */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Scansioni recenti</h4>
        {isLoading ? (
          <div className="text-xs text-muted-foreground py-4 text-center">Caricamento…</div>
        ) : scans.length === 0 ? (
          <div className="text-xs text-muted-foreground py-4 text-center border border-dashed border-border rounded-xl">
            Nessun scan ancora. Avvia il primo per scoprire dove perde soldi il cliente.
          </div>
        ) : (
          scans.slice(0, 5).map((s: any, i: number) => (
            <motion.div
              key={s.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              className="flex items-center justify-between gap-3 p-3 rounded-xl bg-card border border-border/50"
            >
              <div className="flex items-center gap-2 min-w-0 flex-1">
                <TrendingDown className="w-4 h-4 text-destructive flex-shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-foreground truncate">{s.url || s.domain || "—"}</p>
                  <p className="text-[10px] text-muted-foreground">
                    {s.sector || "Generale"} · Severity {s.severity_score || 0}/10
                  </p>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="text-sm font-display font-bold text-destructive">
                  €{Number(s.estimated_monthly_loss_eur || 0).toLocaleString("it-IT")}
                </p>
                <p className="text-[9px] text-muted-foreground">/mese persi</p>
              </div>
            </motion.div>
          ))
        )}
      </div>

      <div className="flex items-center gap-2 text-[10px] text-muted-foreground">
        <Zap className="w-3 h-3 text-primary" />
        Cache 30 giorni per dominio · Skip duplicati automatico
      </div>
    </div>
  );
}
