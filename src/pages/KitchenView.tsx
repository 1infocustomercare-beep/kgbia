import { useState, useEffect, useRef } from "react";
import BackButton from "@/components/BackButton";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ChefHat, LogOut, Volume2, VolumeX, Printer, ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface KitchenSession {
  restaurantId: string;
  pinId: string;
  label: string;
}

const statusColors: Record<string, string> = {
  pending: "border-amber-500/30 bg-amber-500/5",
  preparing: "border-blue-500/30 bg-blue-500/5",
  ready: "border-green-500/30 bg-green-500/5",
};

const statusBadge: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  preparing: "bg-blue-500/20 text-blue-400",
  ready: "bg-green-500/20 text-green-400",
};

const statusLabels: Record<string, string> = {
  pending: "⏳ In attesa",
  preparing: "🔥 In preparazione",
  ready: "✅ Pronto",
};

// Differentiated audio alerts
const playNewOrderAlert = () => {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.35;
    gain.connect(ctx.destination);
    // Double beep for new order
    [0, 200].forEach((delay) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = 880;
      osc.type = "sine";
      osc.connect(gain);
      osc.start(ctx.currentTime + delay / 1000);
      osc.stop(ctx.currentTime + delay / 1000 + 0.15);
    });
    setTimeout(() => ctx.close(), 600);
  } catch {}
};

const playUpdateAlert = () => {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.25;
    gain.connect(ctx.destination);
    const osc = ctx.createOscillator();
    osc.frequency.value = 660;
    osc.type = "triangle";
    osc.connect(gain);
    osc.start();
    osc.stop(ctx.currentTime + 0.12);
    setTimeout(() => ctx.close(), 300);
  } catch {}
};

const playPaymentAlert = () => {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.3;
    gain.connect(ctx.destination);
    // Rising three-tone for payment
    [523, 659, 784].forEach((freq, i) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq;
      osc.type = "sine";
      osc.connect(gain);
      osc.start(ctx.currentTime + i * 0.12);
      osc.stop(ctx.currentTime + i * 0.12 + 0.1);
    });
    setTimeout(() => ctx.close(), 600);
  } catch {}
};

const playWaiterCallAlert = () => {
  try {
    const ctx = new AudioContext();
    const gain = ctx.createGain();
    gain.gain.value = 0.4;
    gain.connect(ctx.destination);
    // Urgent alternating two-tone bell for waiter call
    [0, 300, 600].forEach((delay, i) => {
      const osc = ctx.createOscillator();
      osc.frequency.value = i % 2 === 0 ? 1200 : 900;
      osc.type = "square";
      osc.connect(gain);
      osc.start(ctx.currentTime + delay / 1000);
      osc.stop(ctx.currentTime + delay / 1000 + 0.18);
    });
    setTimeout(() => ctx.close(), 1200);
  } catch {}
};

const KitchenView = () => {
  const navigate = useNavigate();
  const [session, setSession] = useState<KitchenSession | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [soundOn, setSoundOn] = useState(true);
  const soundOnRef = useRef(true); // Fix closure issue

  const [restaurantName, setRestaurantName] = useState("");
  const prevOrderCountRef = useRef(0);

  useEffect(() => {
    const stored = sessionStorage.getItem("kitchen_mode");
    if (!stored) { navigate("/admin"); return; }
    const parsed = JSON.parse(stored) as KitchenSession;
    setSession(parsed);

    supabase.from("restaurants").select("name").eq("id", parsed.restaurantId).single()
      .then(({ data }) => { if (data) setRestaurantName(data.name); });

    fetchOrders(parsed.restaurantId);

    const channel = supabase
      .channel("kitchen-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "orders", filter: `restaurant_id=eq.${parsed.restaurantId}` },
        (payload) => {
          fetchOrders(parsed.restaurantId);
          const orderType = (payload.new as any)?.order_type;
          if (orderType === "waiter_call") {
            if (soundOnRef.current) playWaiterCallAlert();
            const tableNum = (payload.new as any)?.table_number;
            toast({ title: "🔔 Chiamata Cameriere!", description: `Tavolo ${tableNum} richiede assistenza!` });
          } else {
            if (soundOnRef.current) playNewOrderAlert();
            toast({ title: "🔔 Nuovo ordine!", description: "Un nuovo ordine è arrivato in cucina." });
          }
        }
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "orders", filter: `restaurant_id=eq.${parsed.restaurantId}` },
        (payload) => {
          fetchOrders(parsed.restaurantId);
          if (soundOnRef.current) {
            const newStatus = (payload.new as any)?.status;
            if (newStatus === "delivered") playPaymentAlert();
            else playUpdateAlert();
          }
        }
      )
      .on("postgres_changes", { event: "*", schema: "public", table: "restaurant_tables", filter: `restaurant_id=eq.${parsed.restaurantId}` },
        () => { fetchOrders(parsed.restaurantId); }
      )
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "restaurants", filter: `id=eq.${parsed.restaurantId}` },
        (payload) => { if ((payload.new as any)?.name) setRestaurantName((payload.new as any).name); }
      )
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, []);

  const fetchOrders = async (restaurantId: string) => {
    const stored = sessionStorage.getItem("kitchen_mode");
    if (!stored) return;
    const { pinCode } = JSON.parse(stored);
    if (!pinCode) {
      // Fallback: try direct query (works for authenticated users)
      const { data } = await supabase
        .from("orders").select("*")
        .eq("restaurant_id", restaurantId)
        .in("status", ["pending", "preparing", "ready"])
        .order("created_at", { ascending: true });
      if (data) {
        if (data.length > prevOrderCountRef.current && prevOrderCountRef.current > 0 && soundOnRef.current) {
          playNewOrderAlert();
        }
        prevOrderCountRef.current = data.length;
        setOrders(data);
      }
      return;
    }
    try {
      const { data, error } = await supabase.functions.invoke("kitchen-orders", {
        body: { pin_code: pinCode, action: "fetch" },
      });
      if (error) throw error;
      const ordersData = data?.orders || [];
      if (ordersData.length > prevOrderCountRef.current && prevOrderCountRef.current > 0 && soundOnRef.current) {
        playNewOrderAlert();
      }
      prevOrderCountRef.current = ordersData.length;
      setOrders(ordersData);
    } catch (err) {
      console.error("Kitchen fetch error:", err);
    }
  };

  const updateStatus = async (orderId: string, status: string) => {
    const stored = sessionStorage.getItem("kitchen_mode");
    if (!stored) return;
    const { pinCode } = JSON.parse(stored);
    if (!pinCode) {
      // Fallback for authenticated users
      await supabase.from("orders").update({ status }).eq("id", orderId);
    } else {
      await supabase.functions.invoke("kitchen-orders", {
        body: { pin_code: pinCode, action: "update_status", order_id: orderId, status },
      });
    }
    if (session) fetchOrders(session.restaurantId);
  };

  const printTicket = (order: any) => {
    const items = Array.isArray(order.items) ? order.items : [];
    const ticketContent = `
      <html><head><title>Ticket #${order.id.slice(0, 8)}</title>
      <style>body{font-family:monospace;font-size:14px;padding:20px;max-width:300px;margin:0 auto}
      h2{text-align:center;border-bottom:2px dashed #000;padding-bottom:8px}
      .item{display:flex;justify-content:space-between;padding:4px 0}
      .footer{border-top:2px dashed #000;padding-top:8px;margin-top:12px;text-align:center;font-size:12px}</style></head>
      <body>
        <h2>${restaurantName}</h2>
        <p><strong>Ordine #${order.id.slice(0, 8)}</strong></p>
        <p>${order.customer_name || "Cliente"} · ${order.order_type === "table" ? "Tavolo " + order.table_number : order.order_type === "delivery" ? "Consegna" : "Asporto"}</p>
        <p>${new Date(order.created_at).toLocaleString("it-IT")}</p>
        <hr/>
        ${items.map((i: any) => `<div class="item"><span>${i.quantity || 1}× ${i.name}</span><span>€${(i.price * (i.quantity || 1)).toFixed(2)}</span></div>`).join("")}
        <hr/>
        <div class="item"><strong>TOTALE</strong><strong>€${Number(order.total).toFixed(2)}</strong></div>
        ${order.notes ? `<p style="margin-top:8px;padding:4px;background:#f5f5f5">📝 ${order.notes}</p>` : ""}
        <div class="footer">Grazie per l'ordine!</div>
      </body></html>
    `;
    const win = window.open("", "_blank", "width=350,height=500");
    if (win) {
      win.document.write(ticketContent);
      win.document.close();
      setTimeout(() => { win.print(); }, 300);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("kitchen_mode");
    navigate("/admin");
  };

  if (!session) return null;

  const pendingOrders = orders.filter(o => o.status === "pending");
  const preparingOrders = orders.filter(o => o.status === "preparing");
  const readyOrders = orders.filter(o => o.status === "ready");

  return (
    <div className="min-h-screen bg-background">
      {/* Back integrated in header */}
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border sticky top-0 bg-background z-10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <ChefHat className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">{restaurantName || "Cucina"}</h1>
            <p className="text-xs text-primary">{session.label} · {orders.length} ordini attivi</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <button onClick={() => navigate("/home")} className="p-2 rounded-full hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" title="Indietro">
            <ArrowLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <button onClick={() => { setSoundOn(!soundOn); soundOnRef.current = !soundOn; }} className="p-2 rounded-full hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            {soundOn ? <Volume2 className="w-5 h-5 text-primary" /> : <VolumeX className="w-5 h-5 text-muted-foreground" />}
          </button>
          <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center">
            <LogOut className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-3 gap-2 px-5 py-3">
        <div className="p-3 rounded-xl bg-amber-500/10 text-center">
          <p className="text-2xl font-display font-bold text-amber-400">{pendingOrders.length}</p>
          <p className="text-xs text-muted-foreground">In attesa</p>
        </div>
        <div className="p-3 rounded-xl bg-blue-500/10 text-center">
          <p className="text-2xl font-display font-bold text-blue-400">{preparingOrders.length}</p>
          <p className="text-xs text-muted-foreground">In preparazione</p>
        </div>
        <div className="p-3 rounded-xl bg-green-500/10 text-center">
          <p className="text-2xl font-display font-bold text-green-400">{readyOrders.length}</p>
          <p className="text-xs text-muted-foreground">Pronti</p>
        </div>
      </div>

      {/* Orders */}
      <div className="px-5 py-2 space-y-4 pb-8">
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
            <motion.div key={order.id}
              className={`p-5 rounded-2xl border ${statusColors[order.status] || "border-border bg-card"}`}
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} layout>
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-display font-bold text-foreground text-lg">#{order.id.slice(0, 8)}</span>
                    {order.order_type === "waiter_call" ? (
                      <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">🔔 Cameriere</span>
                    ) : (
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusBadge[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {order.order_type === "waiter_call" 
                      ? `🔔 Tavolo ${order.table_number} — Richiesta assistenza`
                      : `${order.customer_name || "Cliente"} · ${order.order_type === "table" ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "Consegna" : "Asporto"}`}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => printTicket(order)} className="p-2 rounded-lg hover:bg-secondary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center" title="Stampa ticket">
                    <Printer className="w-5 h-5 text-muted-foreground" />
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {new Date(order.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                  </span>
                </div>
              </div>

              <div className="space-y-1 mb-3">
                {items.map((item: any, i: number) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-foreground font-medium">{item.quantity || 1}× {item.name}</span>
                    <span className="text-muted-foreground">€{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                ))}
              </div>

              {order.notes && (
                <p className="text-xs text-amber-400 bg-amber-500/10 px-2.5 py-1.5 rounded-lg mb-3">📝 {order.notes}</p>
              )}

              <div className="flex gap-2">
                {order.status === "pending" && (
                  <motion.button onClick={() => updateStatus(order.id, "preparing")}
                    className="flex-1 py-4 rounded-xl bg-blue-500/20 text-blue-400 text-base font-semibold min-h-[56px]"
                    whileTap={{ scale: 0.97 }}>
                    🔥 Inizia Preparazione
                  </motion.button>
                )}
                {order.status === "preparing" && (
                  <motion.button onClick={() => updateStatus(order.id, "ready")}
                    className="flex-1 py-4 rounded-xl bg-green-500/20 text-green-400 text-base font-semibold min-h-[56px]"
                    whileTap={{ scale: 0.97 }}>
                    ✅ Pronto
                  </motion.button>
                )}
                {order.status === "ready" && (
                  <motion.button onClick={() => updateStatus(order.id, "delivered")}
                    className="flex-1 py-4 rounded-xl bg-muted text-muted-foreground text-base font-semibold min-h-[56px]"
                    whileTap={{ scale: 0.97 }}>
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
