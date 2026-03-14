import { useState, useEffect } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, AlertTriangle, ChefHat, CheckCircle, Volume2 } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

const STATUS_FLOW = ["received", "preparing", "ready", "served"];
const STATUS_LABELS: Record<string, string> = { received: "Ricevuto", preparing: "In Preparazione", ready: "Pronto", served: "Servito" };
const STATUS_COLORS: Record<string, string> = { received: "border-blue-500", preparing: "border-amber-500", ready: "border-emerald-500", served: "border-muted" };

function OrderTimer({ createdAt }: { createdAt: string }) {
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const start = new Date(createdAt).getTime();
    const tick = () => setElapsed(Math.floor((Date.now() - start) / 60000));
    tick();
    const i = setInterval(tick, 10000);
    return () => clearInterval(i);
  }, [createdAt]);
  const color = elapsed < 10 ? "text-emerald-400" : elapsed < 20 ? "text-amber-400" : "text-red-400";
  return <span className={`text-2xl font-mono font-bold ${color}`}>{elapsed}'</span>;
}

export default function KitchenDisplayPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();

  // For food sector, use restaurant_id from company or restaurants table
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["kds-orders", companyId],
    enabled: !!companyId,
    refetchInterval: 5000,
    queryFn: async () => {
      // Try fetching from orders table with company's restaurant
      const { data } = await supabase.from("orders").select("*")
        .neq("status", "served")
        .order("created_at", { ascending: true })
        .limit(50);
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ orderId, newStatus }: { orderId: string; newStatus: string }) => {
      await supabase.from("orders").update({ status: newStatus }).eq("id", orderId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["kds-orders"] });
      toast.success("Stato aggiornato");
    },
  });

  const nextStatus = (current: string) => {
    const idx = STATUS_FLOW.indexOf(current);
    return idx < STATUS_FLOW.length - 1 ? STATUS_FLOW[idx + 1] : current;
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold flex items-center gap-2">
          <ChefHat className="w-6 h-6 text-primary" />
          Kitchen Display System
        </h1>
        <Badge variant="secondary">{orders.length} ordini attivi</Badge>
      </div>

      {orders.length === 0 ? (
        <Card className="border-border/50">
          <CardContent className="p-12 text-center text-muted-foreground">
            <ChefHat className="w-12 h-12 mx-auto mb-3 opacity-30" />
            <p className="text-lg">Nessun ordine in coda</p>
            <p className="text-sm">I nuovi ordini appariranno qui automaticamente</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {orders.map((order: any) => {
            const status = order.status || "received";
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <motion.div key={order.id} layout initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
                <Card className={`border-l-4 ${STATUS_COLORS[status] || "border-border"} bg-card`}>
                  <CardContent className="p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="text-lg font-bold">#{order.id.slice(-4)}</span>
                        {order.table_number && <Badge variant="secondary" className="ml-2">Tavolo {order.table_number}</Badge>}
                        {order.order_type === "delivery" && <Badge className="ml-2 bg-violet-600">Delivery</Badge>}
                      </div>
                      <OrderTimer createdAt={order.created_at} />
                    </div>

                    <div className="space-y-1">
                      {items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center justify-between text-sm">
                          <span>{item.quantity}x {item.name}</span>
                          {item.allergens?.length > 0 && (
                            <Badge variant="destructive" className="text-[10px]">
                              <AlertTriangle className="w-2.5 h-2.5 mr-0.5" />Allergeni
                            </Badge>
                          )}
                        </div>
                      ))}
                    </div>

                    {order.notes && (
                      <div className="text-xs p-2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                        📝 {order.notes}
                      </div>
                    )}

                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{STATUS_LABELS[status]}</Badge>
                      {status !== "served" && (
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => updateStatus.mutate({ orderId: order.id, newStatus: nextStatus(status) })}
                        >
                          → {STATUS_LABELS[nextStatus(status)]}
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
