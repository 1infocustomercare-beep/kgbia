import { Coins, TrendingDown, Sparkles, Search, Eye, FileSearch, Wand2 } from "lucide-react";
import { useSellerCredits } from "@/hooks/useSellerCredits";

const ACTION_ICONS: Record<string, any> = {
  generate_demo_from_lead: Wand2,
  deep_lead_analysis: FileSearch,
  scan_prospect: Eye,
  enrich_lead_social: Sparkles,
  lead_search: Search,
};

/**
 * Cronologia spese AI del venditore: ogni azione consumata, crediti spesi,
 * costo reale stimato (€), data. Trasparenza totale per il partner.
 */
export default function SellerCreditsHistory() {
  const { balance, history, loading, totalSpent30d, costs } = useSellerCredits();

  if (loading) {
    return <div className="p-5 rounded-2xl bg-card border border-border/50 text-center text-xs text-muted-foreground">Caricamento…</div>;
  }

  const totalCredits30d = history
    .filter(h => Date.now() - new Date(h.created_at).getTime() < 30 * 24 * 3600 * 1000)
    .reduce((s, h) => s + (h.credits_used || 0), 0);

  return (
    <div className="space-y-4">
      {/* Header stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-gradient-to-br from-amber-500/10 to-card border border-amber-500/20">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><Coins className="w-3 h-3" /> Saldo</div>
          <div className="text-lg font-bold text-amber-400 mt-1">{balance}</div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/50">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground"><TrendingDown className="w-3 h-3" /> Spesi 30g</div>
          <div className="text-lg font-bold text-foreground mt-1">{totalCredits30d}</div>
        </div>
        <div className="p-3 rounded-xl bg-card border border-border/50">
          <div className="text-[10px] text-muted-foreground">Costo reale</div>
          <div className="text-lg font-bold text-foreground mt-1">€{totalSpent30d.toFixed(2)}</div>
        </div>
      </div>

      {/* Catalogo costi */}
      <div className="p-4 rounded-2xl bg-card border border-border/50">
        <h4 className="text-xs font-bold text-foreground mb-3">📊 Costi azioni AI</h4>
        <div className="space-y-1.5">
          {Object.values(costs).sort((a, b) => a.credit_cost - b.credit_cost).map(c => (
            <div key={c.action} className="flex items-center justify-between text-[11px] py-1.5 border-b border-border/30 last:border-0">
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-semibold text-amber-400 flex items-center gap-1">
                <Coins className="w-3 h-3" /> {c.credit_cost}
                <span className="text-[9px] text-muted-foreground font-normal">(~€{c.cost_eur_estimate.toFixed(2)})</span>
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Cronologia */}
      <div className="p-4 rounded-2xl bg-card border border-border/50">
        <h4 className="text-xs font-bold text-foreground mb-3">📜 Ultime azioni ({history.length})</h4>
        {history.length === 0 ? (
          <p className="text-[11px] text-muted-foreground text-center py-4">Nessuna spesa registrata</p>
        ) : (
          <div className="space-y-1.5 max-h-80 overflow-y-auto">
            {history.map(h => {
              const Icon = ACTION_ICONS[h.action] || Sparkles;
              const meta = h.metadata as any;
              const ctx = meta?.lead_name ? ` · ${meta.lead_name}` : "";
              return (
                <div key={h.id} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30 hover:bg-muted/50 transition">
                  <Icon className="w-3.5 h-3.5 text-amber-400 flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-foreground truncate">{h.action_label || h.action}{ctx}</p>
                    <p className="text-[9px] text-muted-foreground">{new Date(h.created_at).toLocaleString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-[11px] font-bold text-amber-400">-{h.credits_used}</div>
                    <div className="text-[9px] text-muted-foreground">€{(h.cost_eur_estimate || 0).toFixed(2)}</div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
