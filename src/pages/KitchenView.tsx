import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, LogOut, Volume2, VolumeX } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Order } from "@/types/restaurant";

interface KitchenSession {
  restaurantId: string;
  pinId: string;
  label: string;
}

const statusColors: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/5",
  preparing: "border-blue-500/30 bg-blue-500/5",
  ready: "border-green-500/30 bg-green-500/5",
  delivered: "border-border bg-secondary/30",
};

const statusBadge: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  preparing: "bg-blue-500/20 text-blue-400",
  ready: "bg-green-500/20 text-green-400",
  delivered: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  pending: "In attesa",
  preparing: "In preparazione",
  ready: "Pronto",
  delivered: "Consegnato",
};

const KitchenView = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<KitchenSession | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const [restaurantName, setRestaurantName] = useState("");

  useEffect(() => {
    const stored = sessionStorage.getItem("kitchen_mode");
    if (!stored) {
      navigate("/admin");
      return;
    }
    const parsed = JSON.parse(stored) as KitchenSession;
    setSession(parsed);

    // Fetch restaurant name
    supabase
      .from("restaurants")
      .select("name")
      .eq("id", parsed.restaurantId)
      .single()
      .then(({ data }) => {
        if (data) setRestaurantName(data.name);
      });

    // Fetch orders
    fetchOrders(parsed.restaurantId);

    // Realtime subscription
    const channel = supabase
      .channel("kitchen-orders")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders",
          filter: `restaurant_id=eq.${parsed.restaurantId}`,
        },
        () => {
          fetchOrders(parsed.restaurantId);
          if (soundOn) playAlert();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchOrders = async (restaurantId: string) => {
    const { data } = await supabase
      .from("orders")
      .select("*")
      .eq("restaurant_id", restaurantId)
      .in("status", ["pending", "preparing", "ready"])
      .order("created_at", { ascending: false });
    if (data) setOrders(data);
  };

  const playAlert = () => {
    try {
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      osc.frequency.value = 880;
      osc.connect(ctx.destination);
      osc.start();
      setTimeout(() => osc.stop(), 200);
    } catch {}
  };

  const updateStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
    if (session) fetchOrders(session.restaurantId);
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kitchen_mode");
    navigate("/admin");
  };

  if (!session) return null;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">{restaurantName || "Cucina"}</h1>
            <p className="text-xs text-primary">{session.label}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundOn(!soundOn)}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            {soundOn ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
          </button>
          <button
            onClick={handleLogout}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Orders */}
      <div className="px-5 py-4 space-y-4">
        {orders.length === 0 && (
          <div className="text-center py-16">
            <ChefHat className="w-16 h-16 mx-auto mb-4 text-muted-foreground/20" />
            <p className="text-lg font-display font-bold text-muted-foreground">Nessun ordine attivo</p>
            <p className="text-sm text-muted-foreground/60 mt-1">I nuovi ordini appariranno qui in tempo reale</p>
          </div>
        )}

        {orders.map((order) => {
          const items = Array.isArray(order.items) ? order.items : [];
          return (
            <motion.div
              key={order.id}
              className={`p-5 rounded-2xl border ${statusColors[order.status] || ""}`}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-foreground text-lg">
                      #{order.id.slice(0, 8)}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {order.customer_name || "Cliente"} · {order.order_type === "table" ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "Consegna" : "Asporto"}
                  </p>
                </div>
                <span className="text-xs text-muted-foreground">
                  {new Date(order.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground">{item.quantity || 1}× {item.name}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <p className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg mb-3">📝 {order.notes}</p>
              )}

              <div className="flex gap-2">
                {order.status === "pending" && (
                  <motion.button
                    onClick={() => updateStatus(order.id, "preparing")}
                    className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-400 text-base font-semibold"
                    whileTap={{ scale: 0.97 }}
                  >
                    🔥 Inizia Preparazione
                  </motion.button>
                )}
                {order.status === "preparing" && (
                  <motion.button
                    onClick={() => updateStatus(order.id, "ready")}
                    className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-400 text-base font-semibold"
                    whileTap={{ scale: 0.97 }}
                  >
                    ✅ Pronto
                  </motion.button>
                )}
                {order.status === "ready" && (
                  <motion.button
                    onClick={() => updateStatus(order.id, "delivered")}
                    className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground text-base font-semibold"
                    whileTap={{ scale: 0.97 }}
                  >
                    📦 Consegnato
                  </motion.button>
                )}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default KitchenView;
