import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Receipt, DollarSign, Clock, Users } from "lucide-react";

export default function PayrollPage() {
  const { company } = useIndustry();
  const companyId = company?.id;

  const { data: payrolls = [], isLoading } = useQuery({
    queryKey: ["payroll", companyId],
    queryFn: async () => {
      if (!companyId) return [];
      const { data } = await supabase.from("payroll").select("*, staff(full_name, role)").eq("company_id", companyId).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!companyId,
  });

  const { data: staffCount = 0 } = useQuery({
    queryKey: ["staff-count", companyId],
    queryFn: async () => {
      if (!companyId) return 0;
      const { count } = await supabase.from("staff").select("*", { count: "exact", head: true }).eq("company_id", companyId).eq("is_active", true);
      return count || 0;
    },
    enabled: !!companyId,
  });

  const totalGross = payrolls.reduce((s: number, p: any) => s + (Number(p.gross_pay) || 0), 0);
  const totalNet = payrolls.reduce((s: number, p: any) => s + (Number(p.net_pay) || 0), 0);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Buste Paga & Payroll</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Users className="w-4 h-4 text-blue-400" /><span className="text-xs text-muted-foreground">Dipendenti</span></div>
          <p className="text-2xl font-bold">{staffCount}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><Receipt className="w-4 h-4 text-purple-400" /><span className="text-xs text-muted-foreground">Buste Paga</span></div>
          <p className="text-2xl font-bold">{payrolls.length}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-green-400" /><span className="text-xs text-muted-foreground">Lordo Totale</span></div>
          <p className="text-2xl font-bold">€{totalGross.toFixed(0)}</p>
        </CardContent></Card>
        <Card className="border-border/50"><CardContent className="p-4">
          <div className="flex items-center gap-2 mb-1"><DollarSign className="w-4 h-4 text-primary" /><span className="text-xs text-muted-foreground">Netto Totale</span></div>
          <p className="text-2xl font-bold">€{totalNet.toFixed(0)}</p>
        </CardContent></Card>
      </div>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
      ) : payrolls.length === 0 ? (
        <Card className="border-dashed border-border/50"><CardContent className="p-8 text-center text-muted-foreground">
          <Receipt className="w-8 h-8 mx-auto mb-2 opacity-50" />
          Nessuna busta paga generata. Aggiungi dipendenti nella sezione Staff per iniziare.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {payrolls.map((p: any) => (
            <Card key={p.id} className="border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{(p.staff as any)?.full_name || "—"}</p>
                  <p className="text-sm text-muted-foreground">{(p.staff as any)?.role} • Periodo: {p.period}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span><Clock className="w-3 h-3 inline mr-1" />{p.hours_worked || 0}h</span>
                    <span>Straord: {p.overtime_hours || 0}h</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary">€{Number(p.net_pay).toFixed(2)}</p>
                  <Badge variant={p.status === "paid" ? "default" : "outline"} className="mt-1">
                    {p.status === "paid" ? "Pagato" : p.status === "draft" ? "Bozza" : p.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
