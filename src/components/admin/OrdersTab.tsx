import { useState } from "react";
import { motion } from "framer-motion";
import {
  ChefHat, ExternalLink, Power, CalendarDays, Move, Save, BarChart3, Key
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import TableMap from "@/components/restaurant/TableMap";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";

type OrdersSection = "orders" | "tables" | "traffic" | "reservations";

interface OrdersTabProps {
  restaurant: any;
  orders: any[];
  reservations: any[];
  setReservations: React.Dispatch<React.SetStateAction<any[]>>;
  restaurantTables: any[];
  setRestaurantTables: React.Dispatch<React.SetStateAction<any[]>>;
  newTableCount: number;
  setNewTableCount: React.Dispatch<React.SetStateAction<number>>;
  existingPins: any[];
  setExistingPins: React.Dispatch<React.SetStateAction<any[]>>;
  kitchenPin: string;
  setKitchenPin: React.Dispatch<React.SetStateAction<string>>;
  deliveryEnabled: boolean;
  setDeliveryEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  takeawayEnabled: boolean;
  setTakeawayEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  tableOrdersEnabled: boolean;
  setTableOrdersEnabled: React.Dispatch<React.SetStateAction<boolean>>;
  orderAnalytics: { source: string; count: number }[];
}

const statusColors: Record<string, string> = {
  pending: "bg-amber-500/20 text-amber-400",
  preparing: "bg-blue-500/20 text-blue-400",
  ready: "bg-green-500/20 text-green-400",
  delivered: "bg-muted text-muted-foreground",
};
const statusLabels: Record<string, string> = {
  pending: "In attesa", preparing: "In preparazione", ready: "Pronto", delivered: "Consegnato",
};

const OrdersTab = ({
  restaurant, orders, reservations, setReservations,
  restaurantTables, setRestaurantTables, newTableCount, setNewTableCount,
  existingPins, setExistingPins, kitchenPin, setKitchenPin,
  deliveryEnabled, setDeliveryEnabled, takeawayEnabled, setTakeawayEnabled,
  tableOrdersEnabled, setTableOrdersEnabled, orderAnalytics,
}: OrdersTabProps) => {
  const [section, setSection] = useState<OrdersSection>("orders");
  const [tableMapEditMode, setTableMapEditMode] = useState(false);

  const activeOrders = orders.filter(o => ["pending", "preparing", "ready"].includes(o.status));

  const updateOrderStatus = async (orderId: string, status: string) => {
    await supabase.from("orders").update({ status }).eq("id", orderId);
  };

  const handleCreatePin = async () => {
    if (!restaurant || kitchenPin.length < 4) return;
    const { error } = await supabase.from("kitchen_access_pins").insert({ restaurant_id: restaurant.id, pin_code: kitchenPin, label: "Cucina" });
    if (error) { toast({ title: "Errore", variant: "destructive" }); return; }
    toast({ title: "PIN generato", description: `Codice: ${kitchenPin}` });
    setKitchenPin("");
    const { data } = await supabase.from("kitchen_access_pins").select("*").eq("restaurant_id", restaurant.id).eq("is_active", true);
    if (data) setExistingPins(data);
  };

  const handleCreateTables = async () => {
    if (!restaurant) return;
    const inserts = Array.from({ length: newTableCount }, (_, i) => ({
      restaurant_id: restaurant.id, table_number: i + 1, seats: 4, status: "free",
      pos_x: 0, pos_y: 0,
    }));
    const { error } = await supabase.from("restaurant_tables").insert(inserts);
    if (error) { toast({ title: "Errore", description: error.message, variant: "destructive" }); return; }
    const { data } = await supabase.from("restaurant_tables").select("*").eq("restaurant_id", restaurant.id).order("table_number");
    if (data) setRestaurantTables(data);
    toast({ title: `${newTableCount} tavoli creati` });
  };

  const handleSaveLayout = async () => {
    for (const t of restaurantTables) {
      await supabase.from("restaurant_tables").update({ pos_x: t.pos_x, pos_y: t.pos_y }).eq("id", t.id);
    }
    toast({ title: "Layout salvato" });
    setTableMapEditMode(false);
  };

  const sections: { id: OrdersSection; label: string }[] = [
    { id: "orders", label: "Cucina" },
    { id: "tables", label: "Tavoli" },
    { id: "traffic", label: "Canali" },
    { id: "reservations", label: "Prenota" },
  ];

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex gap-1 overflow-x-auto scrollbar-hide pb-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[36px] ${
              section === s.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {s.label}
          </button>
        ))}
      </div>

      {/* ORDERS / KITCHEN */}
      {section === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-semibold text-foreground">{activeOrders.length} ordini attivi</h3>
            <button onClick={() => window.open("/kitchen", "_blank")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px]">
              <ExternalLink className="w-3.5 h-3.5" /> Vista Cucina
            </button>
          </div>

          {/* Kitchen PIN */}
          <div className="p-3 rounded-2xl bg-secondary/50 space-y-2">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><Key className="w-3 h-3" /> PIN Staff</p>
            {existingPins.map(pin => (
              <div key={pin.id} className="flex items-center justify-between p-2 rounded-lg bg-card">
                <span className="text-sm font-mono text-foreground">{pin.pin_code}</span>
                <span className="text-xs text-green-400">Operativo</span>
              </div>
            ))}
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" placeholder="Nuovo PIN (4-6)" value={kitchenPin}
                onChange={e => setKitchenPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="flex-1 px-3 py-2 rounded-xl bg-card text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[40px]" />
              <button onClick={handleCreatePin} disabled={kitchenPin.length < 4}
                className="px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 min-h-[40px]">
                Genera
              </button>
            </div>
          </div>

          {activeOrders.length === 0 && (
            <div className="text-center py-12">
              <ChefHat className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessun ordine in coda</p>
            </div>
          )}
          {activeOrders.map(order => {
            const items = Array.isArray(order.items) ? order.items : [];
            return (
              <div key={order.id} className={`p-4 rounded-2xl border ${
                order.status === "pending" ? "border-amber-500/30 bg-amber-500/5" :
                order.status === "preparing" ? "border-blue-500/30 bg-blue-500/5" :
                "border-green-500/30 bg-green-500/5"
              }`}>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <span className="font-display font-bold text-foreground">#{order.id.slice(0, 8)}</span>
                    <span className={`ml-2 px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[order.status] || ""}`}>
                      {statusLabels[order.status] || order.status}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {order.customer_name || "Cliente"} · {order.order_type === "table" ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "Consegna" : "Asporto"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1 mb-3">
                  {items.map((item: any, i: number) => (
                    <div key={i} className="text-sm text-foreground">{item.quantity || 1}× {item.name}</div>
                  ))}
                </div>
                <div className="flex gap-2">
                  {order.status === "pending" && <button onClick={() => updateOrderStatus(order.id, "preparing")} className="flex-1 py-3 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-medium min-h-[48px]">🔥 Prepara</button>}
                  {order.status === "preparing" && <button onClick={() => updateOrderStatus(order.id, "ready")} className="flex-1 py-3 rounded-xl bg-green-500/20 text-green-400 text-sm font-medium min-h-[48px]">✅ Pronto</button>}
                  {order.status === "ready" && <button onClick={() => updateOrderStatus(order.id, "delivered")} className="flex-1 py-3 rounded-xl bg-muted text-muted-foreground text-sm font-medium min-h-[48px]">📦 Consegnato</button>}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* TABLES */}
      {section === "tables" && (
        <div className="space-y-4">
          {restaurantTables.length === 0 ? (
            <div className="space-y-3">
              <div className="text-center py-8">
                <Move className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Crea i tavoli per la tua sala</p>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-2xl bg-secondary/50">
                <label className="text-sm text-foreground">Numero tavoli</label>
                <input type="number" min={1} max={50} value={newTableCount} onChange={e => setNewTableCount(Number(e.target.value) || 1)}
                  className="w-16 px-2 py-2 rounded-lg bg-background text-foreground text-sm text-center min-h-[40px]" />
                <button onClick={handleCreateTables} className="ml-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[44px]">Crea</button>
              </div>
            </div>
          ) : (
            <>
              <div className="flex gap-2">
                <button onClick={() => setTableMapEditMode(!tableMapEditMode)}
                  className={`flex-1 py-2 rounded-xl text-xs font-medium min-h-[40px] ${tableMapEditMode ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <Move className="w-3.5 h-3.5 inline mr-1" /> {tableMapEditMode ? "Editing..." : "Modifica Layout"}
                </button>
                {tableMapEditMode && (
                  <button onClick={handleSaveLayout} className="flex-1 py-2 rounded-xl bg-green-500/20 text-green-400 text-xs font-medium min-h-[40px]">
                    <Save className="w-3.5 h-3.5 inline mr-1" /> Salva Layout
                  </button>
                )}
              </div>
              <TableMap tables={restaurantTables} editMode={tableMapEditMode}
                onStatusChange={async (id, status) => {
                  await supabase.from("restaurant_tables").update({ status }).eq("id", id);
                  setRestaurantTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                }}
                onPositionChange={(id, x, y) => setRestaurantTables(prev => prev.map(t => t.id === id ? { ...t, pos_x: x, pos_y: y } : t))} />
            </>
          )}
        </div>
      )}

      {/* TRAFFIC CONTROL */}
      {section === "traffic" && (
        <div className="space-y-4">
          {[
            { key: "delivery", label: "🚗 Consegna", enabled: deliveryEnabled, setter: setDeliveryEnabled },
            { key: "takeaway", label: "🥡 Asporto", enabled: takeawayEnabled, setter: setTakeawayEnabled },
            { key: "table_orders", label: "🪑 Tavolo", enabled: tableOrdersEnabled, setter: setTableOrdersEnabled },
          ].map(ch => (
            <div key={ch.key} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full ${ch.enabled ? "bg-green-400" : "bg-red-400"}`} />
                <span className="text-sm font-medium text-foreground">{ch.label}</span>
              </div>
              <Switch checked={ch.enabled} onCheckedChange={async val => {
                ch.setter(val);
                if (restaurant) {
                  await supabase.from("restaurants").update({ [`${ch.key}_enabled`]: val } as any).eq("id", restaurant.id);
                  toast({ title: val ? `${ch.label} attivato` : `${ch.label} disattivato` });
                }
              }} />
            </div>
          ))}
          {orderAnalytics.length > 0 && (
            <div className="space-y-3 mt-4">
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Fonti</p>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderAnalytics} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={70} innerRadius={35} paddingAngle={3} strokeWidth={0}>
                      {orderAnalytics.map((_, idx) => (
                        <Cell key={idx} fill={`hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)`} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: "hsl(20, 12%, 8%)", border: "1px solid hsl(20, 10%, 16%)", borderRadius: "12px", fontSize: "12px", color: "hsl(40, 20%, 92%)" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {orderAnalytics.map((item, idx) => (
                <div key={item.source} className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                  <span className="text-xs font-medium text-foreground flex-1 capitalize">{item.source}</span>
                  <span className="text-xs text-primary font-semibold">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RESERVATIONS */}
      {section === "reservations" && (
        <div className="space-y-3">
          {reservations.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessuna prenotazione</p>
            </div>
          )}
          {reservations.map((res: any) => (
            <div key={res.id} className={`p-4 rounded-2xl border ${
              res.status === "confirmed" ? "bg-green-500/5 border-green-500/20" :
              res.status === "cancelled" ? "bg-accent/5 border-accent/20 opacity-60" :
              "bg-secondary/50 border-border"
            }`}>
              <div className="flex justify-between items-start mb-2">
                <div>
                  <p className="text-sm font-medium text-foreground">{res.customer_name}</p>
                  <p className="text-xs text-muted-foreground">{res.customer_phone}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-display font-bold text-primary">{res.reservation_date}</p>
                  <p className="text-xs text-muted-foreground">ore {res.reservation_time}</p>
                </div>
              </div>
              <div className="flex items-center justify-between mt-2">
                <span className="text-xs text-muted-foreground">👥 {res.guests} ospiti</span>
                <div className="flex gap-2">
                  {res.status === "pending" && (
                    <>
                      <button onClick={async () => {
                        await supabase.from("reservations").update({ status: "confirmed" } as any).eq("id", res.id);
                        setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: "confirmed" } : r));
                        toast({ title: "Confermata" });
                      }} className="px-3 py-1.5 rounded-lg bg-green-500/20 text-green-400 text-xs font-medium min-h-[36px]">✅ Conferma</button>
                      <button onClick={async () => {
                        await supabase.from("reservations").update({ status: "cancelled" } as any).eq("id", res.id);
                        setReservations(prev => prev.map(r => r.id === res.id ? { ...r, status: "cancelled" } : r));
                        toast({ title: "Annullata" });
                      }} className="px-3 py-1.5 rounded-lg bg-accent/20 text-accent text-xs font-medium min-h-[36px]">✖ Rifiuta</button>
                    </>
                  )}
                  {res.status === "confirmed" && <span className="px-2.5 py-1 rounded-full text-xs bg-green-500/20 text-green-400">Confermata</span>}
                  {res.status === "cancelled" && <span className="px-2.5 py-1 rounded-full text-xs bg-accent/20 text-accent">Annullata</span>}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default OrdersTab;