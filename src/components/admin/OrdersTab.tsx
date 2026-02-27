import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, ExternalLink, Power, CalendarDays, Move, Save, BarChart3, Key,
  Plus, Trash2, QrCode, Download, Clock, CheckCircle2, XCircle, Filter,
  Phone, Users, MessageSquare, Bell
} from "lucide-react";
import { format, isToday, isTomorrow, parseISO, isPast } from "date-fns";
import { it } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import TableMap from "@/components/restaurant/TableMap";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { generateQRDataUrl, downloadQR } from "@/lib/qr";

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
  const [reservationFilter, setReservationFilter] = useState<"all" | "pending" | "confirmed" | "cancelled">("all");

  const activeOrders = orders.filter(o => ["pending", "preparing", "ready"].includes(o.status));
  const pendingReservationCount = reservations.filter((r: any) => r.status === "pending").length;

  const filteredReservations = useMemo(() => {
    let filtered = [...reservations];
    if (reservationFilter !== "all") {
      filtered = filtered.filter((r: any) => r.status === reservationFilter);
    }
    return filtered.sort((a: any, b: any) => {
      if (a.status === "pending" && b.status !== "pending") return -1;
      if (b.status === "pending" && a.status !== "pending") return 1;
      return new Date(a.reservation_date + "T" + a.reservation_time).getTime() - new Date(b.reservation_date + "T" + b.reservation_time).getTime();
    });
  }, [reservations, reservationFilter]);

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

  const sections: { id: OrdersSection; label: string; badge?: number }[] = [
    { id: "orders", label: "Cucina" },
    { id: "tables", label: "Tavoli" },
    { id: "traffic", label: "Canali" },
    { id: "reservations", label: "Prenota", badge: pendingReservationCount },
  ];

  const formatReservationDate = (dateStr: string) => {
    try {
      const d = parseISO(dateStr);
      if (isToday(d)) return "Oggi";
      if (isTomorrow(d)) return "Domani";
      return format(d, "EEE d MMM", { locale: it });
    } catch { return dateStr; }
  };

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Section tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`relative flex items-center gap-1 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-colors min-h-[38px] ${
              section === s.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {s.label}
            {s.badge && s.badge > 0 && (
              <span className="ml-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-accent text-accent-foreground animate-pulse">
                {s.badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ORDERS / KITCHEN */}
      {section === "orders" && (
        <div className="space-y-4">
          <div className="flex justify-between items-center gap-2">
            <h3 className="text-sm font-semibold text-foreground">{activeOrders.length} ordini attivi</h3>
            <button onClick={() => window.open("/kitchen", "_blank")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px] flex-shrink-0">
              <ExternalLink className="w-3.5 h-3.5" /> Vista Cucina
            </button>
          </div>

          {/* Kitchen PIN */}
          <div className="p-3 rounded-2xl bg-secondary/50 space-y-2">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><Key className="w-3 h-3" /> PIN Staff</p>
            {existingPins.map(pin => (
              <div key={pin.id} className="flex items-center justify-between p-2.5 rounded-lg bg-card">
                <span className="text-sm font-mono text-foreground">{pin.pin_code}</span>
                <span className="text-xs text-green-400">Operativo</span>
              </div>
            ))}
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" placeholder="Nuovo PIN (4-6)" value={kitchenPin}
                onChange={e => setKitchenPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="flex-1 px-3 py-2.5 rounded-xl bg-card text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] min-w-0" />
              <button onClick={handleCreatePin} disabled={kitchenPin.length < 4}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium disabled:opacity-40 min-h-[44px] flex-shrink-0">
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
                <div className="flex justify-between items-start mb-2 gap-2">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-display font-bold text-foreground text-sm">#{order.id.slice(0, 8)}</span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${statusColors[order.status] || ""}`}>
                        {statusLabels[order.status] || order.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground mt-0.5 truncate">
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
                <label className="text-sm text-foreground flex-shrink-0">Tavoli</label>
                <input type="number" min={1} max={50} value={newTableCount} onChange={e => setNewTableCount(Number(e.target.value) || 1)}
                  className="w-16 px-2 py-2.5 rounded-lg bg-background text-foreground text-sm text-center min-h-[44px]" />
                <button onClick={handleCreateTables} className="ml-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[44px] flex-shrink-0">Crea</button>
              </div>
            </div>
          ) : (
            <>
              {/* Controls row */}
              <div className="flex gap-2">
                <button onClick={() => setTableMapEditMode(!tableMapEditMode)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-medium min-h-[40px] ${tableMapEditMode ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"}`}>
                  <Move className="w-3.5 h-3.5 inline mr-1" /> {tableMapEditMode ? "Editing..." : "Layout"}
                </button>
                {tableMapEditMode && (
                  <button onClick={handleSaveLayout} className="flex-1 py-2.5 rounded-xl bg-green-500/20 text-green-400 text-xs font-medium min-h-[40px]">
                    <Save className="w-3.5 h-3.5 inline mr-1" /> Salva
                  </button>
                )}
                <button onClick={async () => {
                  if (!restaurant) return;
                  const maxNum = Math.max(0, ...restaurantTables.map(t => t.table_number));
                  const { error } = await supabase.from("restaurant_tables").insert({
                    restaurant_id: restaurant.id, table_number: maxNum + 1, seats: 4, status: "free", pos_x: 50, pos_y: 50,
                  });
                  if (error) { toast({ title: "Errore", variant: "destructive" }); return; }
                  const { data } = await supabase.from("restaurant_tables").select("*").eq("restaurant_id", restaurant.id).order("table_number");
                  if (data) setRestaurantTables(data);
                  toast({ title: `Tavolo ${maxNum + 1} aggiunto` });
                }} className="py-2.5 px-3 rounded-xl bg-primary/10 text-primary text-xs font-medium min-h-[40px] flex-shrink-0">
                  <Plus className="w-3.5 h-3.5 inline mr-1" /> Tavolo
                </button>
              </div>

              {/* Table Map */}
              <TableMap tables={restaurantTables} editMode={tableMapEditMode}
                onStatusChange={async (id, status) => {
                  await supabase.from("restaurant_tables").update({ status }).eq("id", id);
                  setRestaurantTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                }}
                onPositionChange={(id, x, y) => setRestaurantTables(prev => prev.map(t => t.id === id ? { ...t, pos_x: x, pos_y: y } : t))} />

              {/* Table list */}
              <div className="space-y-2">
                <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Gestione Tavoli ({restaurantTables.length})</p>
                {restaurantTables.map(table => {
                  const tableUrl = `${window.location.origin}/r/${restaurant?.slug}?table=${table.table_number}`;
                  return (
                    <div key={table.id} className="flex items-center gap-3 p-3 rounded-xl bg-card border border-border/50">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-display font-bold text-primary">{table.table_number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-foreground">Tavolo {table.table_number}</p>
                        <p className="text-[11px] text-muted-foreground">{table.seats || 4} posti</p>
                      </div>
                      <button onClick={() => downloadQR(tableUrl, `qr-tavolo-${table.table_number}`)}
                        className="p-2.5 rounded-lg hover:bg-primary/10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center" title="Scarica QR">
                        <QrCode className="w-4 h-4 text-primary" />
                      </button>
                      <button onClick={async () => {
                        const { error } = await supabase.from("restaurant_tables").delete().eq("id", table.id);
                        if (error) { toast({ title: "Errore", variant: "destructive" }); return; }
                        setRestaurantTables(prev => prev.filter(t => t.id !== table.id));
                        toast({ title: `Tavolo ${table.table_number} rimosso` });
                      }}
                        className="p-2.5 rounded-lg hover:bg-accent/10 transition-colors min-w-[40px] min-h-[40px] flex items-center justify-center" title="Elimina tavolo">
                        <Trash2 className="w-4 h-4 text-accent" />
                      </button>
                    </div>
                  );
                })}
              </div>
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
            <div key={ch.key} className="flex items-center justify-between p-4 rounded-xl bg-secondary/50 min-h-[56px]">
              <div className="flex items-center gap-3">
                <div className={`w-3 h-3 rounded-full flex-shrink-0 ${ch.enabled ? "bg-green-400" : "bg-red-400"}`} />
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
              <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5"><BarChart3 className="w-3.5 h-3.5" /> Fonti</p>
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
                <div key={item.source} className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/50">
                  <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                  <span className="text-xs font-medium text-foreground flex-1 capitalize truncate">{item.source}</span>
                  <span className="text-xs text-primary font-semibold flex-shrink-0">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* RESERVATIONS */}
      {section === "reservations" && (
        <div className="space-y-3">
          {/* Stats bar */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "In attesa", count: reservations.filter((r: any) => r.status === "pending").length, icon: <Clock className="w-3.5 h-3.5 text-amber-400" />, color: "bg-amber-500/10 border-amber-500/20" },
              { label: "Confermate", count: reservations.filter((r: any) => r.status === "confirmed").length, icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />, color: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Rifiutate", count: reservations.filter((r: any) => r.status === "cancelled").length, icon: <XCircle className="w-3.5 h-3.5 text-accent" />, color: "bg-accent/10 border-accent/20" },
            ].map(stat => (
              <div key={stat.label} className={`p-2.5 rounded-xl border ${stat.color} text-center`}>
                <div className="flex justify-center mb-1">{stat.icon}</div>
                <p className="text-lg font-display font-bold text-foreground">{stat.count}</p>
                <p className="text-[9px] text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filter tabs */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide">
            {([
              { id: "all" as const, label: "Tutte" },
              { id: "pending" as const, label: "In attesa" },
              { id: "confirmed" as const, label: "Confermate" },
              { id: "cancelled" as const, label: "Rifiutate" },
            ]).map(f => (
              <button key={f.id} onClick={() => setReservationFilter(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors min-h-[32px] ${
                  reservationFilter === f.id ? "bg-foreground text-background" : "bg-secondary/50 text-muted-foreground"
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Empty state */}
          {filteredReservations.length === 0 && (
            <div className="text-center py-12">
              <CalendarDays className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">
                {reservationFilter === "all" ? "Nessuna prenotazione" : `Nessuna prenotazione ${reservationFilter === "pending" ? "in attesa" : reservationFilter === "confirmed" ? "confermata" : "rifiutata"}`}
              </p>
            </div>
          )}

          {/* Reservation cards */}
          <AnimatePresence mode="popLayout">
            {filteredReservations.map((res: any) => {
              const dateLabel = formatReservationDate(res.reservation_date);
              const isExpired = isPast(parseISO(res.reservation_date + "T23:59:59"));
              const isPending = res.status === "pending";

              return (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-4 rounded-2xl border transition-all ${
                    isPending ? "border-amber-500/30 bg-amber-500/5" :
                    res.status === "confirmed" ? "border-emerald-500/20 bg-emerald-500/5" :
                    "border-border/30 bg-secondary/30 opacity-60"
                  } ${isPending && !isExpired ? "ring-1 ring-amber-500/20" : ""}`}
                >
                  {/* Header row */}
                  <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        isPending ? "bg-amber-500/20" : res.status === "confirmed" ? "bg-emerald-500/20" : "bg-muted"
                      }`}>
                        <CalendarDays className={`w-4 h-4 ${
                          isPending ? "text-amber-400" : res.status === "confirmed" ? "text-emerald-400" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-bold text-foreground truncate">{res.customer_name}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-muted-foreground flex-shrink-0" />
                          <a href={`tel:${res.customer_phone}`} className="text-[10px] text-primary underline-offset-2 hover:underline truncate">{res.customer_phone}</a>
                        </div>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-sm font-display font-bold ${isToday(parseISO(res.reservation_date)) ? "text-primary" : "text-foreground"}`}>
                        {dateLabel}
                      </p>
                      <p className="text-[11px] text-muted-foreground">🕐 {res.reservation_time}</p>
                    </div>
                  </div>

                  {/* Details row */}
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Users className="w-3 h-3" /> {res.guests} ospiti
                    </div>
                    {isExpired && res.status !== "cancelled" && (
                      <span className="text-[9px] text-accent font-medium">⚠ Data passata</span>
                    )}
                  </div>

                  {/* Notes */}
                  {res.notes && (
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-card/50 border border-border/30 mb-3">
                      <MessageSquare className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-foreground/70 leading-relaxed">{res.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      {res.status === "confirmed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Confermata
                        </span>
                      )}
                      {res.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-accent/15 text-accent">
                          <XCircle className="w-3 h-3" /> Rifiutata
                        </span>
                      )}
                    </div>
                    {isPending && (
                      <div className="flex gap-2 flex-shrink-0">
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            await supabase.from("reservations").update({ status: "confirmed" } as any).eq("id", res.id);
                            setReservations((prev: any[]) => prev.map((r: any) => r.id === res.id ? { ...r, status: "confirmed" } : r));
                            toast({ title: "✅ Confermata", description: `${res.customer_name} — ${dateLabel}` });
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-semibold min-h-[40px]"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" /> Sì
                        </motion.button>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          onClick={async () => {
                            await supabase.from("reservations").update({ status: "cancelled" } as any).eq("id", res.id);
                            setReservations((prev: any[]) => prev.map((r: any) => r.id === res.id ? { ...r, status: "cancelled" } : r));
                            toast({ title: "✖ Rifiutata", description: `${res.customer_name}` });
                          }}
                          className="flex items-center gap-1 px-3 py-2 rounded-xl bg-accent/20 text-accent text-xs font-semibold min-h-[40px]"
                        >
                          <XCircle className="w-3.5 h-3.5" /> No
                        </motion.button>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
};

export default OrdersTab;
