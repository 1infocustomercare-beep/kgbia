import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Clock, CheckCircle, XCircle, ChefHat } from "lucide-react";
import { toast } from "sonner";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "In Attesa", color: "bg-yellow-500/20 text-yellow-400", icon: Clock },
  preparing: { label: "In Preparazione", color: "bg-blue-500/20 text-blue-400", icon: ChefHat },
  ready: { label: "Pronto", color: "bg-green-500/20 text-green-400", icon: CheckCircle },
  completed: { label: "Completato", color: "bg-muted text-muted-foreground", icon: CheckCircle },
  cancelled: { label: "Annullato", color: "bg-destructive/20 text-destructive", icon: XCircle },
};

export default function OrdersPage() {
  const queryClient = useQueryClient();
  const [tab, setTab] = useState("pending");

  const { data: restaurant } = useQuery({
    queryKey: ["my-restaurant-orders"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("restaurants").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
      return data;
    },
  });

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data } = await supabase.from("orders").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !!restaurant?.id,
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from("orders").update({ status }).eq("id", id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      toast.success("Stato aggiornato");
    },
  });

  const filteredOrders = orders.filter((o: any) => tab === "all" || o.status === tab);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold font-heading">Gestione Ordini</h1>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="pending">In Attesa</TabsTrigger>
          <TabsTrigger value="preparing">In Preparazione</TabsTrigger>
          <TabsTrigger value="ready">Pronti</TabsTrigger>
          <TabsTrigger value="completed">Completati</TabsTrigger>
          <TabsTrigger value="all">Tutti</TabsTrigger>
        </TabsList>
      </Tabs>

      {isLoading ? (
        <div className="text-center py-8 text-muted-foreground">Caricamento ordini...</div>
      ) : filteredOrders.length === 0 ? (
        <Card className="border-border/50"><CardContent className="p-8 text-center text-muted-foreground">Nessun ordine in questa sezione.</CardContent></Card>
      ) : (
        <div className="grid gap-4">
          {filteredOrders.map((order: any) => {
            const config = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = config.icon;
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <Card key={order.id} className="border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-bold">#{order.id.slice(0, 6)}</span>
                        <Badge className={config.color}><StatusIcon className="w-3 h-3 mr-1" />{config.label}</Badge>
                        <Badge variant="outline">{order.order_type}</Badge>
                        {order.table_number && <Badge variant="secondary">Tavolo {order.table_number}</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{order.customer_name || "Anonimo"} • {order.customer_phone || ""}</p>
                      <div className="mt-2 text-sm">
                        {items.map((it: any, i: number) => (
                          <span key={i} className="mr-3">{it.qty || 1}x {it.name}</span>
                        ))}
                      </div>
                      {order.notes && <p className="text-xs text-muted-foreground mt-1 italic">📝 {order.notes}</p>}
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-lg font-bold text-primary">€{Number(order.total).toFixed(2)}</p>
                      <p className="text-xs text-muted-foreground">{new Date(order.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</p>
                      <div className="flex gap-1 mt-2">
                        {order.status === "pending" && (
                          <Button size="sm" onClick={() => updateStatus.mutate({ id: order.id, status: "preparing" })}>Prepara</Button>
                        )}
                        {order.status === "preparing" && (
                          <Button size="sm" onClick={() => updateStatus.mutate({ id: order.id, status: "ready" })}>Pronto</Button>
                        )}
                        {order.status === "ready" && (
                          <Button size="sm" onClick={() => updateStatus.mutate({ id: order.id, status: "completed" })}>Completa</Button>
                        )}
                        {["pending", "preparing"].includes(order.status) && (
                          <Button size="sm" variant="destructive" onClick={() => updateStatus.mutate({ id: order.id, status: "cancelled" })}>Annulla</Button>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
