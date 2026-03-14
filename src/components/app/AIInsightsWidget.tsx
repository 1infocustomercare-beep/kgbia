import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, Flame, X, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

const INSIGHT_ICONS: Record<string, any> = { trend: TrendingUp, warning: AlertTriangle, tip: Lightbulb, urgent: Flame };

interface Insight {
  id: string;
  type: "trend" | "warning" | "tip" | "urgent";
  text: string;
  highlight: string;
  action: string;
}

const SECTOR_INSIGHTS: Record<string, Insight[]> = {
  default: [
    { id: "1", type: "trend", text: "Le vendite di martedì sono cresciute del", highlight: "23%", action: "Vedi Dettagli" },
    { id: "2", type: "warning", text: "Il cliente Mario Rossi non viene da", highlight: "45 giorni", action: "Invia Messaggio" },
    { id: "3", type: "tip", text: "I servizi premium hanno il margine più alto:", highlight: "68%", action: "Attiva Automazione" },
    { id: "4", type: "urgent", text: "Domani maltempo previsto. Prenotazioni potrebbero calare del", highlight: "15%", action: "Promozione Last-Minute" },
  ],
  food: [
    { id: "f1", type: "trend", text: "Il piatto Cacio e Pepe ha avuto un incremento ordini del", highlight: "+34%", action: "Vedi Dettagli" },
    { id: "f2", type: "warning", text: "3 clienti abituali non ordinano da oltre", highlight: "30 giorni", action: "Invia Sconto" },
    { id: "f3", type: "tip", text: "Il food cost medio è sceso al", highlight: "28%", action: "Vedi Report" },
    { id: "f4", type: "urgent", text: "Scorte mozzarella basse, previsto esaurimento in", highlight: "2 giorni", action: "Ordina Subito" },
  ],
  ncc: [
    { id: "n1", type: "trend", text: "Le prenotazioni aeroporto sono cresciute del", highlight: "+18%", action: "Vedi Trend" },
    { id: "n2", type: "warning", text: "La Mercedes Classe S ha il tagliando tra", highlight: "5 giorni", action: "Prenota Officina" },
    { id: "n3", type: "tip", text: "La tratta Napoli-Costiera ha il margine più alto:", highlight: "72%", action: "Promuovi Tratta" },
  ],
  beauty: [
    { id: "b1", type: "trend", text: "I trattamenti viso sono cresciuti del", highlight: "+27%", action: "Vedi Trend" },
    { id: "b2", type: "warning", text: "5 clienti VIP non prenotano da", highlight: "40 giorni", action: "Invia Promozione" },
    { id: "b3", type: "tip", text: "Il servizio colore ha il margine più alto:", highlight: "65%", action: "Cross-Sell AI" },
  ],
};

export function AIInsightsWidget({ sector }: { sector?: string }) {
  const insights = SECTOR_INSIGHTS[sector || ""] || SECTOR_INSIGHTS.default;
  const [dismissed, setDismissed] = useState<string[]>([]);

  const visible = insights.filter(i => !dismissed.includes(i.id));

  if (visible.length === 0) return null;

  return (
    <Card className="relative overflow-hidden border-primary/20 bg-gradient-to-br from-background via-background to-primary/5">
      <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-violet-500/5 pointer-events-none" />
      <CardContent className="p-4 space-y-3 relative">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Sparkles className="w-5 h-5 text-primary animate-pulse" />
            <div className="absolute inset-0 w-5 h-5 bg-primary/20 blur-md rounded-full" />
          </div>
          <h3 className="font-semibold text-sm">AI Insights</h3>
          <Badge variant="secondary" className="text-[10px]">{visible.length} suggerimenti</Badge>
        </div>

        <AnimatePresence>
          {visible.map(insight => {
            const Icon = INSIGHT_ICONS[insight.type] || Lightbulb;
            return (
              <motion.div
                key={insight.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="relative p-3 rounded-lg bg-card/80 backdrop-blur border border-border/30"
              >
                <button
                  onClick={() => setDismissed(p => [...p, insight.id])}
                  className="absolute top-2 right-2 text-muted-foreground hover:text-foreground"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
                <div className="flex items-start gap-3 pr-6">
                  <Icon className={`w-4 h-4 mt-0.5 shrink-0 ${
                    insight.type === "trend" ? "text-emerald-500" :
                    insight.type === "warning" ? "text-amber-500" :
                    insight.type === "urgent" ? "text-red-500" : "text-blue-500"
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">
                      {insight.text} <strong className="text-foreground">{insight.highlight}</strong>
                    </p>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-xs h-7 mt-1.5 text-primary hover:text-primary"
                      onClick={() => toast.info(`Azione: ${insight.action}`)}
                    >
                      <Zap className="w-3 h-3 mr-1" />{insight.action}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
