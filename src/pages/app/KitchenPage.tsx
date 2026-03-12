import { useState, useEffect } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Clock, Play, CheckCircle, AlertTriangle } from "lucide-react";

export default function KitchenPage() {
  const { companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["kitchen-orders", companyId],
    enabled: !!companyId,
    refetchInterval: 5000,
    queryFn: async () => {
      const { data } = await supabase
        .from("orders")
        .select("*")
        .eq("restaurant_id", companyId!)
        .in("status", ["pending", "preparing", "ready"])
        .order("created_at", { ascending: true });
      return data || [];
    },
  });

  const updateStatus = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      await supabase.from("orders").update({ status }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["kitchen-orders"] }),
  });

  const pending = orders.filter(o => o.status === "pending");
  const preparing = orders.filter(o => o.status === "preparing");
  const ready = orders.filter(o => o.status === "ready");

  const getMinutes = (created: string) => Math.floor((now.getTime() - new Date(created).getTime()) / 60000);

  const OrderCard = ({ order }: { order: any }) => {
    const mins = getMinutes(order.created_at);
    const items = Array.isArray(order.items) ? order.items : [];
    const isLate = order.status === "pending" && mins > 15;

    return (
      <Card className={`border-border/50 ${isLate ? "border-red-500/50 bg-red-500/5" : ""}`}>
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-base">#{order.id.slice(-4)}</span>
            <span className={`text-xs font-mono ${isLate ? "text-red-400" : "text-muted-foreground"}`}>
              {mins}m
            </span>
          </div>
          <p className="text-xs text-muted-foreground mb-2">
            {order.table_number ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "🛵 Delivery" : "📦 Asporto"}
          </p>
          <ul className="space-y-1 mb-3">
            {items.map((item: any, i: number) => (
              <li key={i} className="text-sm flex justify-between">
                <span>{item.qty || 1}× {item.name}</span>
              </li>
            ))}
          </ul>
          {order.notes && <p className="text-xs text-yellow-400 mb-2">📝 {order.notes}</p>}
          <div className="flex gap-2">
            {order.status === "pending" && (
              <Button size="sm" className="flex-1 h-11 min-h-[44px]" onClick={() => updateStatus.mutate({ id: order.id, status: "preparing" })}>
                <Play className="w-4 h-4 mr-1" /> Inizia
              </Button>
            )}
            {order.status === "preparing" && (
              <Button size="sm" className="flex-1 h-11 min-h-[44px] bg-green-600 hover:bg-green-700" onClick={() => updateStatus.mutate({ id: order.id, status: "ready" })}>
                <CheckCircle className="w-4 h-4 mr-1" /> Pronto
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  if (isLoading) return <div className="space-y-4">{[1,2,3].map(i => <Skeleton key={i} className="h-32 w-full" />)}</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
        <h1 className="text-xl sm:text-2xl font-bold font-heading">🍳 Cucina</h1>
        <div className="flex items-center gap-3">
          <span className="font-mono text-lg">{now.toLocaleTimeString("it-IT")}</span>
          <Badge variant="outline">{orders.length} ordini aperti</Badge>
        </div>
      </div>

      {/* Mobile: tabs */}
      <div className="block lg:hidden space-y-3">
        {[
          { label: "In Attesa", items: pending, color: "text-yellow-400" },
          { label: "In Preparazione", items: preparing, color: "text-blue-400" },
          { label: "Pronti", items: ready, color: "text-green-400" },
        ].map(col => (
          <div key={col.label}>
            <h2 className={`text-sm font-bold mb-2 ${col.color}`}>
              {col.label} ({col.items.length})
            </h2>
            <div className="space-y-2">
              {col.items.map(o => <OrderCard key={o.id} order={o} />)}
              {col.items.length === 0 && <p className="text-xs text-muted-foreground text-center py-4">Nessun ordine</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Desktop: 3 columns */}
      <div className="hidden lg:grid grid-cols-3 gap-4">
        {[
          { label: "In Attesa", items: pending, color: "border-yellow-500/30", badge: "bg-yellow-500/20 text-yellow-400" },
          { label: "In Preparazione", items: preparing, color: "border-blue-500/30", badge: "bg-blue-500/20 text-blue-400" },
          { label: "Pronti", items: ready, color: "border-green-500/30", badge: "bg-green-500/20 text-green-400" },
        ].map(col => (
          <div key={col.label} className={`border-t-2 ${col.color} pt-4`}>
            <div className="flex items-center gap-2 mb-3">
              <Badge className={col.badge}>{col.items.length}</Badge>
              <h2 className="font-bold">{col.label}</h2>
            </div>
            <div className="space-y-3">
              {col.items.map(o => <OrderCard key={o.id} order={o} />)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
