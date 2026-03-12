import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, User, MapPin, Car, Clock, Phone, Plus, Filter,
  ChevronRight, DollarSign, Luggage, Plane, Mail, LayoutGrid,
  List, Users, ArrowRight, Eye, Edit, MessageCircle
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger,
} from "@/components/ui/sheet";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

/* ── Status config ── */
const STATUSES = [
  { key: "pending", label: "In Attesa", color: "bg-amber-400/10 text-amber-400 border-amber-400/30", dotColor: "bg-amber-400" },
  { key: "confirmed", label: "Confermata", color: "bg-blue-400/10 text-blue-400 border-blue-400/30", dotColor: "bg-blue-400" },
  { key: "in_progress", label: "In Corso", color: "bg-purple-400/10 text-purple-400 border-purple-400/30", dotColor: "bg-purple-400" },
  { key: "completed", label: "Completata", color: "bg-green-400/10 text-green-400 border-green-400/30", dotColor: "bg-green-400" },
  { key: "cancelled", label: "Annullata", color: "bg-red-400/10 text-red-400 border-red-400/30", dotColor: "bg-red-400" },
];

const STATUS_MAP = Object.fromEntries(STATUSES.map(s => [s.key, s]));

/* ── Booking card (shared) ── */
function BookingCard({ booking, onStatusChange, onSelect }: { booking: any; onStatusChange: (id: string, status: string) => void; onSelect: (b: any) => void }) {
  const st = STATUS_MAP[booking.status] || STATUS_MAP.pending;
  const dt = new Date(booking.pickup_datetime);

  return (
    <motion.div layout initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.97 }}>
      <Card className="glass border-border/40 hover:border-border/70 transition-all cursor-pointer group" onClick={() => onSelect(booking)}>
        <CardContent className="p-3 sm:p-4">
          {/* Header */}
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2 min-w-0">
              <div className={`w-2 h-2 rounded-full flex-shrink-0 ${st.dotColor}`} />
              <span className="font-semibold text-sm truncate">{booking.customer_name}</span>
            </div>
            {booking.total_price > 0 && (
              <span className="text-sm font-bold text-primary">€{booking.total_price}</span>
            )}
          </div>

          {/* Route */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mb-2">
            <MapPin className="w-3 h-3 text-green-400 flex-shrink-0" />
            <span className="truncate">{booking.pickup_address}</span>
            <ArrowRight className="w-3 h-3 flex-shrink-0" />
            <span className="truncate">{booking.dropoff_address}</span>
          </div>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {dt.toLocaleDateString("it-IT", { day: "2-digit", month: "short" })}</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {dt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
            <span className="flex items-center gap-1"><Users className="w-3 h-3" /> {booking.passengers}</span>
            {booking.flight_code && <span className="flex items-center gap-1"><Plane className="w-3 h-3" /> {booking.flight_code}</span>}
          </div>

          {/* Status change */}
          <div className="mt-3 flex items-center gap-2" onClick={e => e.stopPropagation()}>
            <Select value={booking.status} onValueChange={(v) => onStatusChange(booking.id, v)}>
              <SelectTrigger className={`h-7 text-[10px] border ${st.color} w-full`}><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Kanban Column ── */
function KanbanColumn({ status, bookings, onStatusChange, onSelect }: {
  status: typeof STATUSES[0];
  bookings: any[];
  onStatusChange: (id: string, status: string) => void;
  onSelect: (b: any) => void;
}) {
  return (
    <div className="flex-1 min-w-[260px] max-w-[320px]">
      <div className="flex items-center gap-2 mb-3 px-1">
        <div className={`w-2.5 h-2.5 rounded-full ${status.dotColor}`} />
        <span className="text-sm font-semibold">{status.label}</span>
        <Badge variant="secondary" className="text-[10px] h-5 px-1.5">{bookings.length}</Badge>
      </div>
      <div className="space-y-2 min-h-[200px]">
        <AnimatePresence>
          {bookings.map(b => (
            <BookingCard key={b.id} booking={b} onStatusChange={onStatusChange} onSelect={onSelect} />
          ))}
        </AnimatePresence>
        {bookings.length === 0 && (
          <div className="text-center py-8 text-muted-foreground/40 text-xs">Nessuna</div>
        )}
      </div>
    </div>
  );
}

/* ── New Booking Form ── */
function NewBookingDialog({ companyId, vehicles, routes, onCreated }: {
  companyId: string;
  vehicles: any[];
  routes: any[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    customer_name: "", customer_phone: "", customer_email: "",
    route_id: "", vehicle_id: "", pickup_address: "", dropoff_address: "",
    pickup_date: "", pickup_time: "09:00", passengers: "1", luggage: "0",
    flight_code: "", total_price: "", deposit: "", notes: "", admin_notes: "",
    service_type: "transfer", payment_method: "", status: "pending",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleRouteChange = (routeId: string) => {
    const route = routes.find((r: any) => r.id === routeId);
    setForm(p => ({
      ...p,
      route_id: routeId,
      pickup_address: route?.origin || p.pickup_address,
      dropoff_address: route?.destination || p.dropoff_address,
      total_price: route?.base_price ? String(route.base_price) : p.total_price,
    }));
  };

  const handleSubmit = async () => {
    if (!form.customer_name || !form.pickup_date) {
      toast.error("Nome e data sono obbligatori");
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from("ncc_bookings").insert({
      company_id: companyId,
      customer_name: form.customer_name,
      customer_phone: form.customer_phone || null,
      customer_email: form.customer_email || null,
      route_id: form.route_id || null,
      vehicle_id: form.vehicle_id || null,
      pickup_address: form.pickup_address || "Da definire",
      dropoff_address: form.dropoff_address || "Da definire",
      pickup_datetime: `${form.pickup_date}T${form.pickup_time}:00`,
      passengers: parseInt(form.passengers) || 1,
      luggage: parseInt(form.luggage) || 0,
      flight_code: form.flight_code || null,
      total_price: parseFloat(form.total_price) || null,
      deposit: parseFloat(form.deposit) || null,
      notes: form.notes || null,
      admin_notes: form.admin_notes || null,
      service_type: form.service_type,
      payment_method: form.payment_method || null,
      status: form.status,
    });
    setSubmitting(false);
    if (error) { toast.error("Errore: " + error.message); return; }
    toast.success("Prenotazione creata!");
    setOpen(false);
    onCreated();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2"><Plus className="w-4 h-4" /> Nuova Prenotazione</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nuova Prenotazione</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          {/* Client */}
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-xs">Nome *</Label><Input className="mt-1 h-10" value={form.customer_name} onChange={e => setForm(p => ({...p, customer_name: e.target.value}))} placeholder="Nome Cognome" /></div>
            <div><Label className="text-xs">Telefono</Label><Input className="mt-1 h-10" value={form.customer_phone} onChange={e => setForm(p => ({...p, customer_phone: e.target.value}))} placeholder="+39..." /></div>
            <div><Label className="text-xs">Email</Label><Input className="mt-1 h-10" value={form.customer_email} onChange={e => setForm(p => ({...p, customer_email: e.target.value}))} placeholder="email@..." /></div>
          </div>

          {/* Route + Vehicle */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Tratta</Label>
              <Select value={form.route_id} onValueChange={handleRouteChange}>
                <SelectTrigger className="mt-1 h-10"><SelectValue placeholder="Seleziona tratta" /></SelectTrigger>
                <SelectContent>{routes.map((r: any) => <SelectItem key={r.id} value={r.id}>{r.origin} → {r.destination}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Veicolo</Label>
              <Select value={form.vehicle_id} onValueChange={v => setForm(p => ({...p, vehicle_id: v}))}>
                <SelectTrigger className="mt-1 h-10"><SelectValue placeholder="Seleziona veicolo" /></SelectTrigger>
                <SelectContent>{vehicles.map((v: any) => <SelectItem key={v.id} value={v.id}>{v.name} ({v.capacity} pax)</SelectItem>)}</SelectContent>
              </Select>
            </div>
          </div>

          {/* Service type */}
          <div className="grid grid-cols-3 gap-3">
            <div>
              <Label className="text-xs">Tipo Servizio</Label>
              <Select value={form.service_type} onValueChange={v => setForm(p => ({...p, service_type: v}))}>
                <SelectTrigger className="mt-1 h-10"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="transfer">Transfer NCC</SelectItem>
                  <SelectItem value="tour_boat">Tour Barca</SelectItem>
                  <SelectItem value="excursion">Escursione</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-xs">Data *</Label>
              <Input type="date" className="mt-1 h-10" value={form.pickup_date} onChange={e => setForm(p => ({...p, pickup_date: e.target.value}))} />
            </div>
            <div>
              <Label className="text-xs">Ora</Label>
              <Input type="time" className="mt-1 h-10" value={form.pickup_time} onChange={e => setForm(p => ({...p, pickup_time: e.target.value}))} />
            </div>
          </div>

          {/* Addresses */}
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Partenza</Label><Input className="mt-1 h-10" value={form.pickup_address} onChange={e => setForm(p => ({...p, pickup_address: e.target.value}))} placeholder="Indirizzo partenza" /></div>
            <div><Label className="text-xs">Arrivo</Label><Input className="mt-1 h-10" value={form.dropoff_address} onChange={e => setForm(p => ({...p, dropoff_address: e.target.value}))} placeholder="Indirizzo arrivo" /></div>
          </div>

          {/* Pax, Luggage, Flight */}
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-xs">Passeggeri</Label><Input type="number" min="1" className="mt-1 h-10" value={form.passengers} onChange={e => setForm(p => ({...p, passengers: e.target.value}))} /></div>
            <div><Label className="text-xs">Bagagli</Label><Input type="number" min="0" className="mt-1 h-10" value={form.luggage} onChange={e => setForm(p => ({...p, luggage: e.target.value}))} /></div>
            <div><Label className="text-xs">N° Volo/Treno</Label><Input className="mt-1 h-10" value={form.flight_code} onChange={e => setForm(p => ({...p, flight_code: e.target.value}))} placeholder="FR1234" /></div>
          </div>

          {/* Price */}
          <div className="grid grid-cols-3 gap-3">
            <div><Label className="text-xs">Prezzo Totale</Label><Input type="number" className="mt-1 h-10" value={form.total_price} onChange={e => setForm(p => ({...p, total_price: e.target.value}))} placeholder="€" /></div>
            <div><Label className="text-xs">Acconto</Label><Input type="number" className="mt-1 h-10" value={form.deposit} onChange={e => setForm(p => ({...p, deposit: e.target.value}))} placeholder="€" /></div>
            <div>
              <Label className="text-xs">Pagamento</Label>
              <Select value={form.payment_method} onValueChange={v => setForm(p => ({...p, payment_method: v}))}>
                <SelectTrigger className="mt-1 h-10"><SelectValue placeholder="Metodo" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Contanti</SelectItem>
                  <SelectItem value="card">Carta</SelectItem>
                  <SelectItem value="transfer">Bonifico</SelectItem>
                  <SelectItem value="paypal">PayPal</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Notes */}
          <div className="grid grid-cols-2 gap-3">
            <div><Label className="text-xs">Note Cliente</Label><Textarea className="mt-1 min-h-[60px]" value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} placeholder="Richieste speciali..." /></div>
            <div><Label className="text-xs">Note Admin</Label><Textarea className="mt-1 min-h-[60px]" value={form.admin_notes} onChange={e => setForm(p => ({...p, admin_notes: e.target.value}))} placeholder="Note interne..." /></div>
          </div>

          {/* Status */}
          <div>
            <Label className="text-xs">Stato iniziale</Label>
            <Select value={form.status} onValueChange={v => setForm(p => ({...p, status: v}))}>
              <SelectTrigger className="mt-1 h-10 w-[200px]"><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          <Button onClick={handleSubmit} disabled={submitting} className="w-full h-11">
            {submitting ? "Creazione..." : "Crea Prenotazione"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ── Booking Detail Sheet ── */
function BookingDetailSheet({ booking, open, onOpenChange, onStatusChange, company }: {
  booking: any | null;
  open: boolean;
  onOpenChange: (o: boolean) => void;
  onStatusChange: (id: string, status: string) => void;
  company: any;
}) {
  if (!booking) return null;
  const st = STATUS_MAP[booking.status] || STATUS_MAP.pending;
  const dt = new Date(booking.pickup_datetime);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-md overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-primary" />
            {booking.customer_name}
          </SheetTitle>
        </SheetHeader>

        <div className="mt-6 space-y-5">
          {/* Status */}
          <div>
            <Label className="text-xs text-muted-foreground">Stato</Label>
            <Select value={booking.status} onValueChange={v => onStatusChange(booking.id, v)}>
              <SelectTrigger className={`mt-1 h-10 border ${st.color}`}><SelectValue /></SelectTrigger>
              <SelectContent>{STATUSES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}</SelectContent>
            </Select>
          </div>

          {/* Route */}
          <div className="p-3 rounded-lg bg-secondary/30 border border-border/30">
            <div className="flex items-center gap-2 text-sm mb-1">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="font-medium">{booking.pickup_address}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <MapPin className="w-4 h-4 text-red-400" />
              <span className="font-medium">{booking.dropoff_address}</span>
            </div>
          </div>

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Data", value: dt.toLocaleDateString("it-IT"), icon: Calendar },
              { label: "Ora", value: dt.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" }), icon: Clock },
              { label: "Passeggeri", value: String(booking.passengers), icon: Users },
              { label: "Bagagli", value: String(booking.luggage || 0), icon: Luggage },
              { label: "Prezzo", value: booking.total_price ? `€${booking.total_price}` : "—", icon: DollarSign },
              { label: "Volo/Treno", value: booking.flight_code || "—", icon: Plane },
            ].map((item, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-secondary/20 border border-border/20">
                <div className="flex items-center gap-1.5 text-muted-foreground mb-0.5">
                  <item.icon className="w-3 h-3" />
                  <span className="text-[10px]">{item.label}</span>
                </div>
                <p className="text-sm font-semibold">{item.value}</p>
              </div>
            ))}
          </div>

          {/* Contact */}
          {(booking.customer_phone || booking.customer_email) && (
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">Contatti</Label>
              {booking.customer_phone && (
                <a href={`tel:${booking.customer_phone}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Phone className="w-4 h-4" /> {booking.customer_phone}
                </a>
              )}
              {booking.customer_email && (
                <a href={`mailto:${booking.customer_email}`} className="flex items-center gap-2 text-sm text-primary hover:underline">
                  <Mail className="w-4 h-4" /> {booking.customer_email}
                </a>
              )}
            </div>
          )}

          {/* Notes */}
          {booking.notes && (
            <div>
              <Label className="text-xs text-muted-foreground">Note Cliente</Label>
              <p className="text-sm mt-1 p-2.5 rounded-lg bg-secondary/20 border border-border/20">{booking.notes}</p>
            </div>
          )}
          {booking.admin_notes && (
            <div>
              <Label className="text-xs text-muted-foreground">Note Admin</Label>
              <p className="text-sm mt-1 p-2.5 rounded-lg bg-secondary/20 border border-border/20">{booking.admin_notes}</p>
            </div>
          )}

          {/* Quick actions */}
          <div className="flex gap-2 pt-2">
            {booking.customer_phone && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={`https://wa.me/${booking.customer_phone.replace(/\D/g, "")}`} target="_blank">
                  <MessageCircle className="w-4 h-4 mr-1" /> WhatsApp
                </a>
              </Button>
            )}
            {booking.customer_phone && (
              <Button variant="outline" size="sm" className="flex-1" asChild>
                <a href={`tel:${booking.customer_phone}`}>
                  <Phone className="w-4 h-4 mr-1" /> Chiama
                </a>
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

/* ═══════════════════════════════════════════════════════════
   MAIN PAGE
   ═══════════════════════════════════════════════════════════ */
export default function NCCBookingsPage() {
  const { companyId, company } = useIndustry();
  const queryClient = useQueryClient();
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selectedBooking, setSelectedBooking] = useState<any>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["ncc-bookings", companyId],
    enabled: !!companyId,
    refetchInterval: 15000,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_bookings")
        .select("*")
        .eq("company_id", companyId!)
        .order("pickup_datetime", { ascending: false })
        .limit(200);
      return (data || []) as any[];
    },
  });

  const { data: vehicles = [] } = useQuery({
    queryKey: ["ncc-vehicles-list", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("fleet_vehicles").select("*").eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
  });

  const { data: routes = [] } = useQuery({
    queryKey: ["ncc-routes-list", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_routes").select("*").eq("company_id", companyId!).eq("is_active", true);
      return data || [];
    },
  });

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("ncc_bookings").update({ status }).eq("id", id);
    queryClient.invalidateQueries({ queryKey: ["ncc-bookings", companyId] });
    if (selectedBooking?.id === id) {
      setSelectedBooking((prev: any) => prev ? { ...prev, status } : null);
    }
    toast.success(`Stato aggiornato: ${STATUS_MAP[status]?.label}`);
  };

  const handleSelect = (b: any) => {
    setSelectedBooking(b);
    setDetailOpen(true);
  };

  // Filters
  const filtered = bookings.filter(b => {
    if (filter !== "all" && b.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return b.customer_name?.toLowerCase().includes(s) ||
        b.pickup_address?.toLowerCase().includes(s) ||
        b.dropoff_address?.toLowerCase().includes(s) ||
        b.customer_phone?.includes(s);
    }
    return true;
  });

  // KPIs
  const todayStr = new Date().toISOString().split("T")[0];
  const todayBookings = bookings.filter(b => b.pickup_datetime?.startsWith(todayStr));
  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const todayRevenue = todayBookings.reduce((s, b) => s + (b.total_price || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold font-heading">Prenotazioni NCC</h1>
          <p className="text-sm text-muted-foreground">Gestisci tutte le prenotazioni transfer e tour</p>
        </div>
        {companyId && (
          <NewBookingDialog companyId={companyId} vehicles={vehicles} routes={routes} onCreated={() => queryClient.invalidateQueries({ queryKey: ["ncc-bookings", companyId] })} />
        )}
      </div>

      {/* KPI strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: "Oggi", value: String(todayBookings.length), color: "text-primary" },
          { label: "In Attesa", value: String(pendingCount), color: "text-amber-400" },
          { label: "Revenue Oggi", value: `€${todayRevenue.toLocaleString("it-IT")}`, color: "text-green-400" },
          { label: "Totale", value: String(bookings.length), color: "text-muted-foreground" },
        ].map((kpi, i) => (
          <Card key={i} className="glass border-border/30">
            <CardContent className="p-3 text-center">
              <p className={`text-xl font-bold ${kpi.color}`}>{kpi.value}</p>
              <p className="text-[10px] text-muted-foreground">{kpi.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Input
          placeholder="Cerca cliente, indirizzo..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="sm:max-w-xs bg-secondary/30 border-border/30"
        />
        <Select value={filter} onValueChange={setFilter}>
          <SelectTrigger className="w-[160px] bg-secondary/50"><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tutti gli stati</SelectItem>
            {STATUSES.map(s => <SelectItem key={s.key} value={s.key}>{s.label}</SelectItem>)}
          </SelectContent>
        </Select>

        <div className="ml-auto flex items-center gap-1 bg-secondary/30 rounded-lg p-0.5">
          <button onClick={() => setViewMode("kanban")} className={`p-2 rounded-md transition-colors ${viewMode === "kanban" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button onClick={() => setViewMode("list")} className={`p-2 rounded-md transition-colors ${viewMode === "list" ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-32 w-full" />
              <Skeleton className="h-32 w-full" />
            </div>
          ))}
        </div>
      ) : viewMode === "kanban" ? (
        /* Kanban View */
        <div className="flex gap-4 overflow-x-auto pb-4 -mx-3 px-3 sm:mx-0 sm:px-0">
          {STATUSES.filter(s => filter === "all" || s.key === filter).map(status => (
            <KanbanColumn
              key={status.key}
              status={status}
              bookings={filtered.filter(b => b.status === status.key)}
              onStatusChange={updateStatus}
              onSelect={handleSelect}
            />
          ))}
        </div>
      ) : (
        /* List View */
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map(b => (
              <BookingCard key={b.id} booking={b} onStatusChange={updateStatus} onSelect={handleSelect} />
            ))}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-16 text-muted-foreground">
              <Calendar className="w-12 h-12 mx-auto mb-4 opacity-40" />
              <p className="text-lg font-medium">Nessuna prenotazione</p>
            </div>
          )}
        </div>
      )}

      {/* Detail Sheet */}
      <BookingDetailSheet
        booking={selectedBooking}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onStatusChange={updateStatus}
        company={company}
      />
    </div>
  );
}
