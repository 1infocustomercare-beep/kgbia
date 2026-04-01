import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Users } from "lucide-react";

export default function MemberSubscriptionsPage() {
  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">💳 Abbonamenti Membri</h1>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center"><CreditCard className="w-8 h-8 mx-auto mb-2 text-primary" /><p className="font-bold text-xl">0</p><p className="text-xs text-muted-foreground">Abbonamenti Attivi</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Users className="w-8 h-8 mx-auto mb-2 text-green-500" /><p className="font-bold text-xl">0</p><p className="text-xs text-muted-foreground">Nuovi Questo Mese</p></CardContent></Card>
        <Card><CardContent className="p-4 text-center"><Badge className="mx-auto">€0</Badge><p className="text-xs text-muted-foreground mt-2">Revenue Ricorrente</p></CardContent></Card>
      </div>
      <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">
        Gestione abbonamenti in fase di attivazione. Collega i piani dal modulo Impostazioni.
      </CardContent></Card>
    </div>
  );
}
