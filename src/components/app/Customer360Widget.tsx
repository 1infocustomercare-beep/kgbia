import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Brain, Calendar, MessageCircle, FileText, UserCheck,
  TrendingUp, AlertTriangle, Clock, Phone, Mail, Award
} from "lucide-react";
import { toast } from "sonner";

interface Customer360Props {
  client: {
    first_name: string;
    last_name?: string;
    phone?: string;
    email?: string;
    total_spent?: number;
    created_at?: string;
  };
}

export function Customer360Widget({ client }: Customer360Props) {
  const ltv = Math.round((client.total_spent || 0) * 2.4);
  const churnRisk = client.total_spent && client.total_spent > 500 ? 12 : client.total_spent && client.total_spent > 100 ? 35 : 67;

  return (
    <div className="space-y-4 mt-6 pt-4 border-t border-border/30">
      <div className="flex items-center gap-2">
        <Brain className="w-4 h-4 text-primary" />
        <h4 className="font-semibold text-sm">Vista 360° AI</h4>
      </div>

      {/* AI Profile */}
      <Card className="border-border/30 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-3 space-y-3">
          <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Profilo AI</h5>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <p className="text-[11px] text-muted-foreground">Lifetime Value</p>
              <p className="text-lg font-bold text-emerald-500">€{ltv.toLocaleString("it")}</p>
            </div>
            <div>
              <p className="text-[11px] text-muted-foreground">Rischio Churn</p>
              <div className="flex items-center gap-2">
                <p className={`text-lg font-bold ${churnRisk > 50 ? "text-red-500" : churnRisk > 30 ? "text-amber-500" : "text-emerald-500"}`}>
                  {churnRisk}%
                </p>
              </div>
              <Progress value={churnRisk} className="h-1.5 mt-1" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div>
              <p className="text-muted-foreground">Canale preferito</p>
              <p className="font-medium flex items-center gap-1 mt-0.5">
                <MessageCircle className="w-3 h-3" />WhatsApp
              </p>
            </div>
            <div>
              <p className="text-muted-foreground">Miglior orario</p>
              <p className="font-medium flex items-center gap-1 mt-0.5">
                <Clock className="w-3 h-3" />10:00 - 12:00
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Timeline */}
      <div>
        <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Timeline Interazioni</h5>
        <div className="space-y-2">
          {[
            { icon: Calendar, text: "Ultimo appuntamento", date: "2 giorni fa", color: "text-blue-500" },
            { icon: MessageCircle, text: "WhatsApp inviato", date: "5 giorni fa", color: "text-emerald-500" },
            { icon: FileText, text: "Fattura emessa €120", date: "1 settimana fa", color: "text-violet-500" },
            { icon: Award, text: "Recensione 5 stelle", date: "2 settimane fa", color: "text-amber-500" },
          ].map((item, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/20 text-xs">
              <item.icon className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
              <span className="flex-1">{item.text}</span>
              <span className="text-muted-foreground">{item.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Loyalty */}
      <Card className="border-border/30">
        <CardContent className="p-3">
          <div className="flex items-center justify-between mb-2">
            <h5 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Loyalty</h5>
            <Badge variant="secondary" className="text-[10px]">Silver</Badge>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span className="text-sm font-bold">320 punti</span>
            <span className="text-xs text-muted-foreground">→ 180 per Gold</span>
          </div>
          <Progress value={64} className="h-1.5 mt-2" />
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="grid grid-cols-2 gap-2">
        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => toast.info("Invio messaggio...")}>
          <MessageCircle className="w-3 h-3 mr-1" />Messaggio
        </Button>
        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => toast.info("Creazione appuntamento...")}>
          <Calendar className="w-3 h-3 mr-1" />Appuntamento
        </Button>
        <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => toast.info("Generazione preventivo...")}>
          <FileText className="w-3 h-3 mr-1" />Preventivo
        </Button>
        <Button size="sm" variant="default" className="text-xs h-8" onClick={() => toast.info("Assegnato a Sales AI")}>
          <UserCheck className="w-3 h-3 mr-1" />Sales AI
        </Button>
      </div>
    </div>
  );
}
