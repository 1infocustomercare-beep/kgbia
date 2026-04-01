import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { DoorOpen, Check, AlertTriangle, Sparkles } from "lucide-react";
import { toast } from "sonner";

export default function HousekeepingPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();

  const { data: rooms = [], isLoading } = useQuery({
    queryKey: ["housekeeping", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("rooms").select("*").eq("company_id", companyId!).order("room_number");
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase.from("rooms").update({ status }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["housekeeping"] });
      toast.success("Stato aggiornato!");
    },
  });

  const statusIcon: Record<string, any> = {
    available: <Check className="w-5 h-5 text-green-500" />,
    cleaning: <Sparkles className="w-5 h-5 text-blue-500" />,
    maintenance: <AlertTriangle className="w-5 h-5 text-yellow-500" />,
    occupied: <DoorOpen className="w-5 h-5 text-red-500" />,
  };
  const statusLabel: Record<string, string> = { available: "Pulita", cleaning: "In pulizia", maintenance: "Manutenzione", occupied: "Occupata" };
  const statusColor: Record<string, string> = { available: "bg-green-500/10 text-green-700", cleaning: "bg-blue-500/10 text-blue-700", maintenance: "bg-yellow-500/10 text-yellow-700", occupied: "bg-red-500/10 text-red-700" };

  if (isLoading) return <div className="grid grid-cols-2 gap-3">{[1,2,3,4].map(i => <Skeleton key={i} className="h-32" />)}</div>;

  const counts = { available: rooms.filter((r: any) => r.status === 'available').length, cleaning: rooms.filter((r: any) => r.status === 'cleaning').length, maintenance: rooms.filter((r: any) => r.status === 'maintenance').length, occupied: rooms.filter((r: any) => r.status === 'occupied').length };

  return (
    <div className="space-y-4">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">🧹 Housekeeping</h1>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {Object.entries(counts).map(([k, v]) => (
          <Card key={k}><CardContent className="p-3 text-center">
            {statusIcon[k]}<p className="text-xl font-bold mt-1">{v}</p><p className="text-xs text-muted-foreground">{statusLabel[k]}</p>
          </CardContent></Card>
        ))}
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {rooms.map((r: any) => (
          <Card key={r.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4 text-center space-y-2">
              <p className="text-lg font-bold">{r.room_number}</p>
              <Badge className={statusColor[r.status] || statusColor.available}>{statusLabel[r.status] || r.status}</Badge>
              <div className="flex gap-1 justify-center flex-wrap">
                {r.status !== 'cleaning' && <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => updateStatus.mutate({ id: r.id, status: 'cleaning' })}>Pulizia</Button>}
                {r.status !== 'available' && <Button size="sm" variant="outline" className="text-xs h-8" onClick={() => updateStatus.mutate({ id: r.id, status: 'available' })}>Pronta</Button>}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {rooms.length === 0 && <Card className="border-dashed"><CardContent className="p-8 text-center text-muted-foreground">Nessuna camera configurata. Vai a "Gestione Camere" per aggiungerne.</CardContent></Card>}
    </div>
  );
}
