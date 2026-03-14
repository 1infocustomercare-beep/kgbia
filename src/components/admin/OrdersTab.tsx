import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChefHat, ExternalLink, Power, CalendarDays, Move, Save, BarChart3, Key,
  Plus, Minus, Trash2, QrCode, Download, Clock, CheckCircle2, XCircle, Filter,
  Phone, Users, MessageSquare, Bell
} from "lucide-react";
import InfoGuide from "@/components/ui/info-guide";
import { format, isToday, isTomorrow, parseISO, isPast } from "date-fns";
import { it } from "date-fns/locale";
import { Switch } from "@/components/ui/switch";
import TableMap from "@/components/restaurant/TableMap";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from "recharts";
import { generateQRDataUrl, downloadQR } from "@/lib/qr";
import { Eye, EyeOff } from "lucide-react";
import cartoonOrdersKitchen from "@/assets/cartoon-orders-kitchen.png";

// Masked PIN display component
function PinDisplay({ pin }: { pin: any }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="flex items-center justify-between p-2.5 rounded-xl bg-card border border-border/30">
      <span className="text-sm font-mono font-semibold text-foreground tracking-widest">
        {visible ? pin.pin_code : "●".repeat(pin.pin_code?.length || 4)}
      </span>
      <div className="flex items-center gap-2">
        <button onClick={() => setVisible(v => !v)} className="p-1.5 rounded-lg hover:bg-muted transition-colors">
          {visible ? <EyeOff className="w-3.5 h-3.5 text-muted-foreground" /> : <Eye className="w-3.5 h-3.5 text-muted-foreground" />}
        </button>
        <span className="text-[10px] text-green-400 font-medium flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400" /> Attivo
        </span>
      </div>
    </div>
  );
}

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

  const getGridPositions = (count: number, startIndex = 0) => {
    const cols = Math.ceil(Math.sqrt(count));
    const rows = Math.ceil(count / cols);
    const marginX = 10, marginY = 10;
    const spacingX = (100 - marginX * 2) / Math.max(cols, 1);
    const spacingY = (100 - marginY * 2) / Math.max(rows, 1);
    return Array.from({ length: count }, (_, i) => ({
      x: Math.round(marginX + spacingX * ((i % cols) + 0.5)),
      y: Math.round(marginY + spacingY * (Math.floor(i / cols) + 0.5)),
    }));
  };

  const handleCreateTables = async () => {
    if (!restaurant) return;
    const positions = getGridPositions(newTableCount);
    const inserts = Array.from({ length: newTableCount }, (_, i) => ({
      restaurant_id: restaurant.id, table_number: i + 1, seats: 4, status: "free",
      pos_x: positions[i].x, pos_y: positions[i].y,
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
    <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      {/* Cartoon illustration */}
      <div className="flex items-center gap-3 mb-1">
        <img src={cartoonOrdersKitchen} alt="" className="w-14 h-14 object-contain flex-shrink-0" />
        <div>
          <h3 className="text-sm font-display font-bold text-foreground">Ordini & Cucina</h3>
          <p className="text-[10px] text-muted-foreground">Gestione ordini, tavoli e prenotazioni</p>
        </div>
      </div>
      {/* Section tabs */}
      <div className="flex items-center gap-2">
        <div className="flex-1 flex gap-1 bg-secondary/30 p-1 rounded-2xl">
        {sections.map(s => (
          <button key={s.id} onClick={() => setSection(s.id)}
            className={`relative flex-1 flex items-center justify-center gap-1 py-2.5 rounded-xl text-xs font-medium transition-all min-h-[40px] ${
              section === s.id ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground"
            }`}>
            {s.label}
            {s.badge != null && s.badge > 0 && (
              <span className="w-4 h-4 rounded-full text-[8px] font-bold bg-accent text-accent-foreground flex items-center justify-center animate-pulse">
                {s.badge}
              </span>
            )}
          </button>
        ))}
        </div>
        <InfoGuide
          title="Gestione Ordini"
          description="Centro operativo: gestisci ordini in cucina, mappa tavoli, canali di traffico e prenotazioni."
          steps={[
            "Cucina: cambia stato ordini (in attesa → in preparazione → pronto)",
            "Tavoli: crea e posiziona i tavoli con drag & drop",
            "Canali: monitora da dove arrivano gli ordini",
            "Prenota: conferma o rifiuta le prenotazioni",
          ]}
        />
      </div>

      {/* ═══════════ ORDERS / KITCHEN ═══════════ */}
      {section === "orders" && (
        <div className="space-y-3">
          {/* Header */}
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-sm font-semibold text-foreground">
              {activeOrders.length} ordini attivi
            </h3>
            <button onClick={() => window.open("/kitchen", "_blank")}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-medium min-h-[40px] flex-shrink-0 active:scale-[0.97] transition-transform">
              <ExternalLink className="w-3.5 h-3.5" /> Cucina
            </button>
          </div>

          {/* Kitchen PIN */}
          <div className="p-3 rounded-2xl bg-secondary/40 space-y-2">
            <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1.5 font-medium">
              <Key className="w-3 h-3" /> PIN Staff
            </p>
            {existingPins.map(pin => (
              <PinDisplay key={pin.id} pin={pin} />
            ))}
            <div className="flex gap-2">
              <input type="text" inputMode="numeric" placeholder="Nuovo PIN (4-6 cifre)" value={kitchenPin}
                onChange={e => setKitchenPin(e.target.value.replace(/\D/g, "").slice(0, 6))}
                className="flex-1 px-3 py-2.5 rounded-xl bg-card border border-border/30 text-foreground text-sm font-mono placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-primary/30 min-h-[44px] min-w-0" />
              <button onClick={handleCreatePin} disabled={kitchenPin.length < 4}
                className="px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold disabled:opacity-40 min-h-[44px] flex-shrink-0 active:scale-[0.97] transition-transform">
                Genera
              </button>
            </div>
          </div>

          {/* Orders list */}
          {activeOrders.length === 0 && (
            <div className="text-center py-10">
              <ChefHat className="w-10 h-10 mx-auto mb-2 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessun ordine in coda</p>
              <p className="text-[10px] text-muted-foreground/50 mt-1">I nuovi ordini appariranno qui</p>
            </div>
          )}

          <div className="space-y-2.5">
            {activeOrders.map(order => {
              const items = Array.isArray(order.items) ? order.items : [];
              return (
                <motion.div key={order.id} layout
                  className={`p-3.5 rounded-2xl border ${
                    order.status === "pending" ? "border-amber-500/30 bg-amber-500/5" :
                    order.status === "preparing" ? "border-blue-500/30 bg-blue-500/5" :
                    "border-green-500/30 bg-green-500/5"
                  }`}>
                  {/* Order header */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-display font-bold text-foreground text-sm">#{order.id.slice(0, 6)}</span>
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${statusColors[order.status] || ""}`}>
                          {statusLabels[order.status] || order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 truncate">
                        {order.customer_name || "Cliente"} · {order.order_type === "table" ? `Tavolo ${order.table_number}` : order.order_type === "delivery" ? "Consegna" : "Asporto"}
                      </p>
                    </div>
                    <span className="text-xs text-muted-foreground/60 flex-shrink-0 tabular-nums">
                      €{Number(order.total).toFixed(2)}
                    </span>
                  </div>

                  {/* Items */}
                  <div className="space-y-0.5 mb-3 pl-0.5">
                    {items.slice(0, 5).map((item: any, i: number) => (
                      <p key={i} className="text-xs text-foreground/80">{item.quantity || 1}× {item.name}</p>
                    ))}
                    {items.length > 5 && <p className="text-[10px] text-muted-foreground">+{items.length - 5} altri</p>}
                  </div>

                  {/* Action button */}
                  {order.status === "pending" && (
                    <button onClick={() => updateOrderStatus(order.id, "preparing")}
                      className="w-full py-2.5 rounded-xl bg-blue-500/20 text-blue-400 text-sm font-semibold min-h-[44px] active:scale-[0.97] transition-transform">
                      🔥 Prepara
                    </button>
                  )}
                  {order.status === "preparing" && (
                    <button onClick={() => updateOrderStatus(order.id, "ready")}
                      className="w-full py-2.5 rounded-xl bg-green-500/20 text-green-400 text-sm font-semibold min-h-[44px] active:scale-[0.97] transition-transform">
                      ✅ Pronto
                    </button>
                  )}
                  {order.status === "ready" && (
                    <button onClick={() => updateOrderStatus(order.id, "delivered")}
                      className="w-full py-2.5 rounded-xl bg-muted text-muted-foreground text-sm font-semibold min-h-[44px] active:scale-[0.97] transition-transform">
                      📦 Consegnato
                    </button>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      )}

      {/* ═══════════ TABLES ═══════════ */}
      {section === "tables" && (
        <div className="space-y-3">
          {restaurantTables.length === 0 ? (
            <div className="space-y-3">
              <div className="text-center py-8">
                <Move className="w-10 h-10 mx-auto mb-2 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Crea i tavoli per la tua sala</p>
              </div>
              <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-secondary/40">
                <label className="text-sm text-foreground flex-shrink-0">N° Tavoli</label>
                <input type="number" min={1} max={50} value={newTableCount}
                  onChange={e => setNewTableCount(Math.max(1, Math.min(50, Number(e.target.value) || 1)))}
                  className="w-14 px-2 py-2.5 rounded-xl bg-card border border-border/30 text-foreground text-sm text-center min-h-[44px]" />
                <button onClick={handleCreateTables}
                  className="ml-auto px-4 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-semibold min-h-[44px] flex-shrink-0 active:scale-[0.97] transition-transform">
                  Crea
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Controls */}
              <div className="flex gap-2">
                <button onClick={() => setTableMapEditMode(!tableMapEditMode)}
                  className={`flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl text-xs font-medium min-h-[40px] transition-colors ${
                    tableMapEditMode ? "bg-primary text-primary-foreground" : "bg-secondary/60 text-muted-foreground"
                  }`}>
                  <Move className="w-3.5 h-3.5" />
                  {tableMapEditMode ? "Editando..." : "Layout"}
                </button>
                {tableMapEditMode && (
                  <button onClick={handleSaveLayout}
                    className="flex items-center justify-center gap-1.5 flex-1 py-2.5 rounded-xl bg-green-500/20 text-green-400 text-xs font-semibold min-h-[40px] active:scale-[0.97] transition-transform">
                    <Save className="w-3.5 h-3.5" /> Salva
                  </button>
                )}
                <button onClick={async () => {
                  if (!restaurant) return;
                  const maxNum = Math.max(0, ...restaurantTables.map(t => t.table_number));
                  // Find an empty spot by checking existing positions
                  const occupied = new Set(restaurantTables.map(t => `${Math.round((t.pos_x || 0) / 10) * 10}-${Math.round((t.pos_y || 0) / 10) * 10}`));
                  let newX = 15, newY = 15;
                  for (let y = 15; y <= 85; y += 20) {
                    for (let x = 15; x <= 85; x += 20) {
                      const key = `${Math.round(x / 10) * 10}-${Math.round(y / 10) * 10}`;
                      if (!occupied.has(key)) { newX = x; newY = y; break; }
                    }
                    if (newX !== 15 || newY !== 15) break;
                  }
                  const { error } = await supabase.from("restaurant_tables").insert({
                    restaurant_id: restaurant.id, table_number: maxNum + 1, seats: 4, status: "free", pos_x: newX, pos_y: newY,
                  });
                  if (error) { toast({ title: "Errore", variant: "destructive" }); return; }
                  const { data } = await supabase.from("restaurant_tables").select("*").eq("restaurant_id", restaurant.id).order("table_number");
                  if (data) setRestaurantTables(data);
                  toast({ title: `Tavolo ${maxNum + 1} aggiunto` });
                }} className="flex items-center justify-center gap-1 py-2.5 px-3 rounded-xl bg-primary/10 text-primary text-xs font-medium min-h-[40px] flex-shrink-0 active:scale-[0.97] transition-transform">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Auto-redistribute if all tables stuck at 0,0 */}
              {restaurantTables.length > 0 && !restaurantTables.some(t => (t.pos_x || 0) > 5 || (t.pos_y || 0) > 5) && (
                <button onClick={async () => {
                  const positions = getGridPositions(restaurantTables.length);
                  const updated = restaurantTables.map((t, i) => ({ ...t, pos_x: positions[i].x, pos_y: positions[i].y }));
                  for (const t of updated) {
                    await supabase.from("restaurant_tables").update({ pos_x: t.pos_x, pos_y: t.pos_y }).eq("id", t.id);
                  }
                  setRestaurantTables(updated);
                  toast({ title: "Tavoli ridistribuiti" });
                }}
                  className="w-full py-2.5 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-semibold min-h-[44px] active:scale-[0.97] transition-transform">
                  <Move className="w-3.5 h-3.5 inline mr-1.5" />Ridistribuisci Tavoli nella Mappa
                </button>
              )}

              {/* Interactive Table Map */}
              <TableMap tables={restaurantTables} editMode={tableMapEditMode}
                onStatusChange={async (id, status) => {
                  await supabase.from("restaurant_tables").update({ status }).eq("id", id);
                  setRestaurantTables(prev => prev.map(t => t.id === id ? { ...t, status } : t));
                }}
                onPositionChange={(id, x, y) => setRestaurantTables(prev => prev.map(t => t.id === id ? { ...t, pos_x: x, pos_y: y } : t))} />

              {/* Table list */}
              <div className="space-y-1.5">
                <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium">
                  Tavoli ({restaurantTables.length})
                </p>
                {restaurantTables.map(table => {
                  const tableUrl = `${window.location.origin}/r/${restaurant?.slug}?table=${table.table_number}`;
                  return (
                    <div key={table.id} className="flex items-center gap-2.5 p-2.5 rounded-xl bg-card border border-border/30">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-display font-bold text-primary">{table.table_number}</span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium text-foreground">Tavolo {table.table_number}</p>
                        <div className="flex items-center gap-1.5 mt-0.5">
                          <button
                            onClick={async () => {
                              const newSeats = Math.max(1, (table.seats || 4) - 1);
                              await supabase.from("restaurant_tables").update({ seats: newSeats }).eq("id", table.id);
                              setRestaurantTables(prev => prev.map(t => t.id === table.id ? { ...t, seats: newSeats } : t));
                            }}
                            className="w-5 h-5 rounded bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                          >
                            <Minus className="w-3 h-3 text-muted-foreground" />
                          </button>
                          <span className="text-[10px] font-semibold text-muted-foreground min-w-[32px] text-center">{table.seats || 4} posti</span>
                          <button
                            onClick={async () => {
                              const newSeats = (table.seats || 4) + 1;
                              await supabase.from("restaurant_tables").update({ seats: newSeats }).eq("id", table.id);
                              setRestaurantTables(prev => prev.map(t => t.id === table.id ? { ...t, seats: newSeats } : t));
                            }}
                            className="w-5 h-5 rounded bg-secondary flex items-center justify-center hover:bg-accent transition-colors"
                          >
                            <Plus className="w-3 h-3 text-muted-foreground" />
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => downloadQR(tableUrl, `qr-tavolo-${table.table_number}`)}
                          className="p-2 rounded-lg hover:bg-primary/10 active:bg-primary/20 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" title="QR">
                          <QrCode className="w-3.5 h-3.5 text-primary" />
                        </button>
                        <button onClick={async () => {
                          const { error } = await supabase.from("restaurant_tables").delete().eq("id", table.id);
                          if (error) { toast({ title: "Errore", variant: "destructive" }); return; }
                          setRestaurantTables(prev => prev.filter(t => t.id !== table.id));
                          toast({ title: `Tavolo ${table.table_number} rimosso` });
                        }}
                          className="p-2 rounded-lg hover:bg-destructive/10 active:bg-destructive/20 transition-colors min-w-[36px] min-h-[36px] flex items-center justify-center" title="Elimina">
                          <Trash2 className="w-3.5 h-3.5 text-destructive/70" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      )}

      {/* ═══════════ TRAFFIC CONTROL ═══════════ */}
      {section === "traffic" && (
        <div className="space-y-3">
          <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium">Canali Ordini</p>
          {[
            { key: "delivery", label: "Consegna", emoji: "🚗", desc: "Ordini con consegna a domicilio", enabled: deliveryEnabled, setter: setDeliveryEnabled },
            { key: "takeaway", label: "Asporto", emoji: "🥡", desc: "Ordini da ritirare in loco", enabled: takeawayEnabled, setter: setTakeawayEnabled },
            { key: "table_orders", label: "Tavolo", emoji: "🪑", desc: "Ordini da tavolo con QR", enabled: tableOrdersEnabled, setter: setTableOrdersEnabled },
          ].map(ch => (
            <div key={ch.key} className="flex items-center gap-3 p-3.5 rounded-2xl bg-card border border-border/30">
              <div className="text-xl flex-shrink-0">{ch.emoji}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{ch.label}</p>
                <p className="text-[10px] text-muted-foreground truncate">{ch.desc}</p>
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

          {/* Analytics */}
          {orderAnalytics.length > 0 && (
            <div className="space-y-2.5 mt-2">
              <p className="text-[10px] text-muted-foreground/70 uppercase tracking-wider font-medium flex items-center gap-1.5">
                <BarChart3 className="w-3 h-3" /> Fonti Traffico
              </p>
              <div className="h-40 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={orderAnalytics} dataKey="count" nameKey="source" cx="50%" cy="50%" outerRadius={60} innerRadius={30} paddingAngle={3} strokeWidth={0}>
                      {orderAnalytics.map((_, idx) => (
                        <Cell key={idx} fill={`hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)`} />
                      ))}
                    </Pie>
                    <RechartsTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "12px", fontSize: "11px", color: "hsl(var(--foreground))" }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              {orderAnalytics.map((item, idx) => (
                <div key={item.source} className="flex items-center gap-2 p-2.5 rounded-xl bg-secondary/40">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: `hsl(${38 + idx * 45}, ${75 - idx * 8}%, ${55 + idx * 5}%)` }} />
                  <span className="text-xs font-medium text-foreground flex-1 capitalize truncate">{item.source}</span>
                  <span className="text-xs text-primary font-bold flex-shrink-0 tabular-nums">{item.count}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ═══════════ RESERVATIONS ═══════════ */}
      {section === "reservations" && (
        <div className="space-y-3">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: "In attesa", count: reservations.filter((r: any) => r.status === "pending").length, icon: <Clock className="w-3.5 h-3.5" />, color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/20" },
              { label: "Confermate", count: reservations.filter((r: any) => r.status === "confirmed").length, icon: <CheckCircle2 className="w-3.5 h-3.5" />, color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20" },
              { label: "Rifiutate", count: reservations.filter((r: any) => r.status === "cancelled").length, icon: <XCircle className="w-3.5 h-3.5" />, color: "text-destructive", bg: "bg-destructive/10 border-destructive/20" },
            ].map(stat => (
              <div key={stat.label} className={`p-2.5 rounded-xl border text-center ${stat.bg}`}>
                <div className={`flex justify-center mb-1 ${stat.color}`}>{stat.icon}</div>
                <p className="text-lg font-display font-bold text-foreground leading-none">{stat.count}</p>
                <p className="text-[9px] text-muted-foreground mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filter */}
          <div className="flex gap-1 bg-secondary/30 p-1 rounded-xl">
            {([
              { id: "all" as const, label: "Tutte" },
              { id: "pending" as const, label: "Attesa" },
              { id: "confirmed" as const, label: "OK" },
              { id: "cancelled" as const, label: "No" },
            ]).map(f => (
              <button key={f.id} onClick={() => setReservationFilter(f.id)}
                className={`flex-1 py-2 rounded-lg text-[11px] font-medium transition-all min-h-[34px] ${
                  reservationFilter === f.id ? "bg-foreground text-background shadow-sm" : "text-muted-foreground"
                }`}>
                {f.label}
              </button>
            ))}
          </div>

          {/* Empty */}
          {filteredReservations.length === 0 && (
            <div className="text-center py-10">
              <CalendarDays className="w-10 h-10 mx-auto mb-2 text-muted-foreground/20" />
              <p className="text-sm text-muted-foreground">Nessuna prenotazione</p>
            </div>
          )}

          {/* Cards */}
          <AnimatePresence mode="popLayout">
            {filteredReservations.map((res: any) => {
              const dateLabel = formatReservationDate(res.reservation_date);
              const isExpired = isPast(parseISO(res.reservation_date + "T23:59:59"));
              const isPending = res.status === "pending";

              return (
                <motion.div key={res.id} layout
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95 }}
                  className={`p-3.5 rounded-2xl border transition-all ${
                    isPending ? "border-amber-500/30 bg-amber-500/5" :
                    res.status === "confirmed" ? "border-emerald-500/20 bg-emerald-500/5" :
                    "border-border/30 bg-secondary/20 opacity-60"
                  }`}>
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex items-center gap-2 min-w-0 flex-1">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        isPending ? "bg-amber-500/20" : res.status === "confirmed" ? "bg-emerald-500/20" : "bg-muted"
                      }`}>
                        <CalendarDays className={`w-3.5 h-3.5 ${
                          isPending ? "text-amber-400" : res.status === "confirmed" ? "text-emerald-400" : "text-muted-foreground"
                        }`} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-foreground truncate">{res.customer_name}</p>
                        <a href={`tel:${res.customer_phone}`} className="text-[10px] text-primary flex items-center gap-1">
                          <Phone className="w-2.5 h-2.5" />
                          <span className="truncate">{res.customer_phone}</span>
                        </a>
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className={`text-xs font-display font-bold ${isToday(parseISO(res.reservation_date)) ? "text-primary" : "text-foreground"}`}>
                        {dateLabel}
                      </p>
                      <p className="text-[10px] text-muted-foreground">🕐 {res.reservation_time}</p>
                    </div>
                  </div>

                  {/* Details */}
                  <div className="flex items-center gap-3 mb-2">
                    <span className="flex items-center gap-1 text-[11px] text-muted-foreground">
                      <Users className="w-3 h-3" /> {res.guests} ospiti
                    </span>
                    {isExpired && res.status !== "cancelled" && (
                      <span className="text-[9px] text-destructive font-medium">⚠ Passata</span>
                    )}
                  </div>

                  {/* Notes */}
                  {res.notes && (
                    <div className="flex items-start gap-1.5 p-2 rounded-lg bg-card/50 border border-border/20 mb-2.5">
                      <MessageSquare className="w-3 h-3 text-muted-foreground flex-shrink-0 mt-0.5" />
                      <p className="text-[10px] text-foreground/70 leading-relaxed line-clamp-2">{res.notes}</p>
                    </div>
                  )}

                  {/* Actions */}
                  {isPending ? (
                    <div className="flex gap-2">
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          await supabase.from("reservations").update({ status: "confirmed" } as any).eq("id", res.id);
                          setReservations((prev: any[]) => prev.map((r: any) => r.id === res.id ? { ...r, status: "confirmed" } : r));
                          toast({ title: "✅ Confermata", description: `${res.customer_name} — ${dateLabel}` });
                        }}
                        className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 text-xs font-semibold min-h-[44px]">
                        <CheckCircle2 className="w-4 h-4" /> Conferma
                      </motion.button>
                      <motion.button whileTap={{ scale: 0.95 }}
                        onClick={async () => {
                          await supabase.from("reservations").update({ status: "cancelled" } as any).eq("id", res.id);
                          setReservations((prev: any[]) => prev.map((r: any) => r.id === res.id ? { ...r, status: "cancelled" } : r));
                          toast({ title: "✖ Rifiutata", description: `${res.customer_name}` });
                        }}
                        className="py-2.5 px-4 rounded-xl bg-destructive/15 text-destructive text-xs font-semibold min-h-[44px]">
                        <XCircle className="w-4 h-4" />
                      </motion.button>
                    </div>
                  ) : (
                    <div>
                      {res.status === "confirmed" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/15 text-emerald-400">
                          <CheckCircle2 className="w-3 h-3" /> Confermata
                        </span>
                      )}
                      {res.status === "cancelled" && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-medium bg-destructive/15 text-destructive">
                          <XCircle className="w-3 h-3" /> Rifiutata
                        </span>
                      )}
                    </div>
                  )}
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
