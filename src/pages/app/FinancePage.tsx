import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { DollarSign, TrendingUp, Receipt, CreditCard } from "lucide-react";

export default function FinancePage() {
  const { terminology } = useIndustry();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Finanza & Contabilità</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-400" /><span className="text-xs text-muted-foreground">Revenue Mese</span></div>
          <p className="text-2xl font-bold">€4.250</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><TrendingUp className="w-4 h-4 text-blue-400" /><span className="text-xs text-muted-foreground">Crescita</span></div>
          <p className="text-2xl font-bold">+15%</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Receipt className="w-4 h-4 text-purple-400" /><span className="text-xs text-muted-foreground">Fatture Emesse</span></div>
          <p className="text-2xl font-bold">12</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><CreditCard className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Fee Piattaforma</span></div>
          <p className="text-2xl font-bold">€85</p>
        </CardContent></Card>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="invoices">Fatture B2B</TabsTrigger>
          <TabsTrigger value="fees">Fee Piattaforma</TabsTrigger>
        </TabsList>
        <TabsContent value="overview">
          <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground py-12">
            Grafici di revenue, costi e margini verranno visualizzati qui.
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="invoices">
          <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground py-12">
            Lista fatture B2B generate dalla piattaforma.
          </CardContent></Card>
        </TabsContent>
        <TabsContent value="fees">
          <Card className="border-border/50"><CardContent className="p-6 text-center text-muted-foreground py-12">
            Riepilogo fee 2% sulle transazioni PWA.
          </CardContent></Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
