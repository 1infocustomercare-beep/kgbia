import { useIndustry } from "@/hooks/useIndustry";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { FileText, Euro } from "lucide-react";

export default function BillingPage() {
  const { companyId } = useIndustry();

  const { data: invoices = [], isLoading } = useQuery({
    queryKey: ["billing", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("b2b_invoices").select("*").eq("restaurant_id", companyId!).order("issued_at", { ascending: false }).limit(50);
      return data || [];
    },
  });

  const statusBadge: Record<string, string> = { paid: "bg-green-500/10 text-green-700", pending: "bg-yellow-500/10 text-yellow-700", overdue: "bg-red-500/10 text-red-700" };

  if (isLoading) return <div className="space-y-3">{[1,2,3].map(i => <Skeleton key={i} className="h-16" />)}</div>;

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">🧾 Fatturazione</h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold">{invoices.length}</p>
          <p className="text-xs text-muted-foreground">Totale Fatture</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-green-600">€{invoices.filter((i: any) => i.status === 'paid').reduce((s: number, i: any) => s + (i.total || 0), 0).toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">Incassato</p>
        </CardContent></Card>
        <Card><CardContent className="p-4 text-center">
          <p className="text-2xl font-bold text-yellow-600">€{invoices.filter((i: any) => i.status !== 'paid').reduce((s: number, i: any) => s + (i.total || 0), 0).toFixed(0)}</p>
          <p className="text-xs text-muted-foreground">In Attesa</p>
        </CardContent></Card>
      </div>

      <div className="space-y-2">
        {invoices.map((inv: any) => (
          <Card key={inv.id}><CardContent className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="w-5 h-5 text-primary" />
              <div>
                <p className="font-semibold text-sm">{inv.invoice_number}</p>
                <p className="text-xs text-muted-foreground">{inv.recipient_name || "—"} · {new Date(inv.issued_at).toLocaleDateString('it-IT')}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge className={statusBadge[inv.status] || statusBadge.pending}>{inv.status === 'paid' ? 'Pagata' : inv.status === 'overdue' ? 'Scaduta' : 'In attesa'}</Badge>
              <p className="font-bold flex items-center"><Euro className="w-3 h-3" />{Number(inv.total || 0).toFixed(2)}</p>
            </div>
          </CardContent></Card>
        ))}
      </div>

      {invoices.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessuna fattura presente.</CardContent></Card>}
    </div>
  );
}
