import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus } from "lucide-react";
import { toast } from "sonner";

export default function TablesPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [newTable, setNewTable] = useState({ table_number: "", seats: "4", zone: "Sala" });

  const { data: tables = [], isLoading } = useQuery({
    queryKey: ["tables", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase
        .from("restaurant_tables")
        .select("*")
        .eq("restaurant_id", companyId!)
        .order("table_number");
      return data || [];
    },
  });

  const addTable = useMutation({
    mutationFn: async () => {
      await supabase.from("restaurant_tables").insert({
        restaurant_id: companyId!,
        table_number: parseInt(newTable.table_number),
        seats: parseInt(newTable.seats),
        label: newTable.zone,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tables"] });
      setOpen(false);
      setNewTable({ table_number: "", seats: "4", zone: "Sala" });
      toast.success("Tavolo aggiunto!");
    },
  });

  const toggleStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const next = status === "free" ? "occupied" : "free";
      await supabase.from("restaurant_tables").update({ status: next }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["tables"] }),
  });

  const statusColor: Record<string, string> = {
    free: "border-green-500/50 bg-green-500/10",
    occupied: "border-red-500/50 bg-red-500/10",
    reserved: "border-yellow-500/50 bg-yellow-500/10",
  };

  const statusLabel: Record<string, string> = {
    free: "Libero", occupied: "Occupato", reserved: "Riservato",
  };

  if (isLoading) return <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🪑 Mappa Tavoli</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="h-11 min-h-[44px]"><Plus className="w-4 h-4 mr-2" /> Aggiungi Tavolo</Button>
          </DialogTrigger>
          <DialogContent className="max-h-[90vh] overflow-y-auto">
            <DialogHeader><DialogTitle>Nuovo Tavolo</DialogTitle></DialogHeader>
            <div className="space-y-4 pt-4">
              <div><Label>Numero Tavolo</Label><Input type="number" value={newTable.table_number} onChange={e => setNewTable(p => ({ ...p, table_number: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              <div><Label>Posti</Label><Input type="number" value={newTable.seats} onChange={e => setNewTable(p => ({ ...p, seats: e.target.value }))} className="h-11 min-h-[44px]" /></div>
              <div><Label>Zona</Label>
                <Select value={newTable.zone} onValueChange={v => setNewTable(p => ({ ...p, zone: v }))}>
                  <SelectTrigger className="h-11 min-h-[44px]"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Sala">Sala</SelectItem>
                    <SelectItem value="Esterno">Esterno</SelectItem>
                    <SelectItem value="Terrazza">Terrazza</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full h-11 min-h-[44px]" onClick={() => addTable.mutate()} disabled={!newTable.table_number}>Aggiungi</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {tables.map((t: any) => (
          <Card
            key={t.id}
            className={`cursor-pointer border-2 transition-all hover:scale-[1.02] ${statusColor[t.status] || statusColor.free}`}
            onClick={() => toggleStatus.mutate({ id: t.id, status: t.status })}
          >
            <CardContent className="p-4 text-center">
              <p className="text-2xl font-bold mb-1">{t.table_number}</p>
              <p className="text-xs text-muted-foreground mb-2">{t.seats} posti · {t.label || "Sala"}</p>
              <Badge variant="outline" className="text-xs">{statusLabel[t.status] || t.status}</Badge>
            </CardContent>
          </Card>
        ))}
      </div>

      {tables.length === 0 && (
        <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">
          Nessun tavolo configurato. Clicca "Aggiungi Tavolo" per iniziare.
        </CardContent></Card>
      )}
    </div>
  );
}
