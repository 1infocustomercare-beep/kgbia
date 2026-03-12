import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Users, Clock, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ReservationsPage() {
  const queryClient = useQueryClient();

  const { data: restaurant } = useQuery({
    queryKey: ["my-restaurant-res"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("restaurants").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
      return data;
    },
  });

  const { data: reservations = [], isLoading } = useQuery({
    queryKey: ["reservations", restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data } = await supabase.from("reservations").select("*").eq("restaurant_id", restaurant.id).order("reservation_date", { ascending: true });
      return data || [];
    },
    enabled: !!restaurant?.id,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from("reservations").update({ status }).eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      toast.success("Prenotazione aggiornata");
    },
  });

  const STATUS_COLORS: Record<string, string> = {
    pending: "bg-yellow-500/20 text-yellow-400",
    confirmed: "bg-green-500/20 text-green-400",
    cancelled: "bg-destructive/20 text-destructive",
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Prenotazioni Tavoli</h1>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Caricamento...</div>
      ) : reservations.length === 0 ? (
        <Card className="border-dashed border-border/50"><CardContent className="p-8 text-center text-muted-foreground">
          <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50" />Nessuna prenotazione.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {reservations.map((r: any) => (
            <Card key={r.id} className="border-border/50">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <p className="font-medium">{r.customer_name}</p>
                  <p className="text-sm text-muted-foreground">{r.customer_phone}</p>
                  <div className="flex gap-3 mt-1 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{r.reservation_date}</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{r.reservation_time}</span>
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{r.guests} ospiti</span>
                  </div>
                  {r.notes && <p className="text-xs text-muted-foreground mt-1 italic">{r.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={STATUS_COLORS[r.status] || ""}>{r.status === "pending" ? "In Attesa" : r.status === "confirmed" ? "Confermata" : "Annullata"}</Badge>
                  {r.status === "pending" && (
                    <>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: r.id, status: "confirmed" })}><Check className="w-4 h-4" /></Button>
                      <Button size="sm" variant="ghost" onClick={() => updateStatus.mutate({ id: r.id, status: "cancelled" })}><X className="w-4 h-4" /></Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
