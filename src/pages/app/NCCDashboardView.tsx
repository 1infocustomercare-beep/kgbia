import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car, Calendar, DollarSign, Clock, Users, AlertTriangle,
  ArrowUpRight, MapPin, TrendingUp, UserCheck, Navigation, CheckCircle2, XCircle, Loader2
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

type DateFilter = "today" | "week" | "month" | "year";

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 260, damping: 24 } },
};

function getDateRange(filter: DateFilter) {
  const now = new Date();
  const start = new Date();
  switch (filter) {
    case "today": start.setHours(0, 0, 0, 0); break;
    case "week": start.setDate(now.getDate() - now.getDay()); start.setHours(0, 0, 0, 0); break;
    case "month": start.setDate(1); start.setHours(0, 0, 0, 0); break;
    case "year": start.setMonth(0, 1); start.setHours(0, 0, 0, 0); break;
  }
  return { start: start.toISOString(), end: now.toISOString() };
}

function getTodayRange() {
  const start = new Date(); start.setHours(0, 0, 0, 0);
  const end = new Date(); end.setHours(23, 59, 59, 999);
  return { start: start.toISOString(), end: end.toISOString() };
}

const ACCENT = "43 74% 49%";
const CHART_COLORS = ["#D4A017", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B"];
const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string }> = {
  pending: { label: "Prenotate", color: "text-yellow-400", icon: Clock, bg: "bg-yellow-500/10" },
  confirmed: { label: "Confermate", color: "text-blue-400", icon: CheckCircle2, bg: "bg-blue-500/10" },
  in_progress: { label: "In Corso", color: "text-emerald-400", icon: Navigation, bg: "bg-emerald-500/10" },
  completed: { label: "Completate", color: "text-green-400", icon: CheckCircle2, bg: "bg-green-500/10" },
  cancelled: { label: "Annullate", color: "text-red-400", icon: XCircle, bg: "bg-red-500/10" },
};

export default function NCCDashboardView() {
  const { companyId } = useIndustry();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");

  const { start } = getDateRange(dateFilter);
  const todayRange = getTodayRange();
  const yearStart = new Date(); yearStart.setMonth(0, 1); yearStart.setHours(0, 0, 0, 0);

  // ═══ TODAY'S RIDES BY STATUS ═══
  const { data: todayRides, isLoading: todayLoading } = useQuery({
    queryKey: ["ncc-today-rides", companyId],
    enabled: !!companyId,
    refetchInterval: 15000,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_bookings")
        .select("id, status, total_price, customer_name, pickup_datetime, pickup_address, dropoff_address, driver_id, route:ncc_routes(origin, destination), vehicle:fleet_vehicles(name), driver:drivers(first_name, last_name)")
        .eq("company_id", companyId!)
        .gte("pickup_datetime", todayRange.start)
        .lte("pickup_datetime", todayRange.end)
        .order("pickup_datetime", { ascending: true });

      const rides = (data as any[]) || [];
      const byStatus: Record<string, number> = { pending: 0, confirmed: 0, in_progress: 0, completed: 0, cancelled: 0 };
      let dailyEarnings = 0;

      rides.forEach(r => {
        byStatus[r.status] = (byStatus[r.status] || 0) + 1;
        if (r.status === "completed") dailyEarnings += r.total_price || 0;
      });

      return { rides, byStatus, dailyEarnings, total: rides.length };
    },
  });

  // ═══ MAIN STATS ═══
  const { data: stats, isLoading } = useQuery({
    queryKey: ["ncc-dash", companyId, dateFilter],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const weekStart = new Date(); weekStart.setDate(weekStart.getDate() - weekStart.getDay()); weekStart.setHours(0, 0, 0, 0);

      const [vehicles, routes, bookingsFiltered, bookingsWeek, driversAvail, unassigned, bookingsYear] = await Promise.all([
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("is_active", true),
        supabase.from("ncc_routes").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("is_active", true),
        supabase.from("ncc_bookings").select("total_price").eq("company_id", companyId!).gte("created_at", start),
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true }).eq("company_id", companyId!).gte("pickup_datetime", weekStart.toISOString()),
        supabase.from("drivers").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("status", "available"),
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true }).eq("company_id", companyId!).is("driver_id", null).neq("status", "cancelled"),
        supabase.from("ncc_bookings").select("total_price").eq("company_id", companyId!).gte("created_at", yearStart.toISOString()),
      ]);

      const revenue = (bookingsFiltered.data || []).reduce((s, b) => s + (b.total_price || 0), 0);
      const yearRevenue = (bookingsYear.data || []).reduce((s, b) => s + (b.total_price || 0), 0);

      return {
        vehicles: vehicles.count || 0,
        routes: routes.count || 0,
        revenue,
        yearRevenue,
        bookingsWeek: bookingsWeek.count || 0,
        driversAvail: driversAvail.count || 0,
        unassigned: unassigned.count || 0,
      };
    },
  });

  // ═══ DRIVERS WITH STATUS (for live map) ═══
  const { data: drivers = [] } = useQuery({
    queryKey: ["ncc-drivers-live", companyId],
    enabled: !!companyId,
    refetchInterval: 20000,
    queryFn: async () => {
      const { data } = await supabase.from("drivers")
        .select("id, first_name, last_name, status, phone, preferred_vehicle_id, photo_url")
        .eq("company_id", companyId!)
        .order("first_name");
      return (data || []) as any[];
    },
  });

  // Alerts
  const { data: alerts } = useQuery({
    queryKey: ["ncc-alerts", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const in60 = new Date(); in60.setDate(in60.getDate() + 60);
      const in30 = new Date(); in30.setDate(in30.getDate() + 30);

      const [licenseExpiring, revisionExpiring, unassignedBookings] = await Promise.all([
        supabase.from("drivers").select("id", { count: "exact", head: true }).eq("company_id", companyId!).lte("license_expiry", in60.toISOString().split("T")[0]),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }).eq("company_id", companyId!).lte("revision_expiry", in30.toISOString().split("T")[0]),
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true }).eq("company_id", companyId!).is("driver_id", null).neq("status", "cancelled"),
      ]);

      return {
        licenseExpiring: licenseExpiring.count || 0,
        revisionExpiring: revisionExpiring.count || 0,
        unassigned: unassignedBookings.count || 0,
      };
    },
  });

  // Revenue chart
  const { data: revenueByMonth = [] } = useQuery({
    queryKey: ["ncc-rev-chart", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const sixMonthsAgo = new Date(); sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5); sixMonthsAgo.setDate(1);
      const { data } = await supabase.from("ncc_bookings")
        .select("total_price, pickup_datetime")
        .eq("company_id", companyId!)
        .gte("pickup_datetime", sixMonthsAgo.toISOString())
        .neq("status", "cancelled");

      const map: Record<string, number> = {};
      (data || []).forEach((b: any) => {
        const d = new Date(b.pickup_datetime);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        map[key] = (map[key] || 0) + (b.total_price || 0);
      });

      const result = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(); d.setMonth(d.getMonth() - i);
        const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        result.push({ name: MONTHS_IT[d.getMonth()], revenue: map[key] || 0 });
      }
      return result;
    },
  });

  // Top routes
  const { data: topRoutes = [] } = useQuery({
    queryKey: ["ncc-top-routes", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_bookings")
        .select("route_id, route:ncc_routes(origin, destination)")
        .eq("company_id", companyId!)
        .neq("status", "cancelled")
        .not("route_id", "is", null);

      const countMap: Record<string, { name: string; count: number }> = {};
      (data || []).forEach((b: any) => {
        if (b.route_id && b.route) {
          if (!countMap[b.route_id]) countMap[b.route_id] = { name: `${b.route.origin} → ${b.route.destination}`, count: 0 };
          countMap[b.route_id].count++;
        }
      });

      return Object.values(countMap).sort((a, b) => b.count - a.count).slice(0, 5);
    },
  });

  const hasAlerts = alerts && (alerts.licenseExpiring > 0 || alerts.revisionExpiring > 0 || alerts.unassigned > 0);

  const KPI = ({ label, value, icon: Icon, accent = ACCENT, loading = false, subtitle, onClick }: any) => (
    <motion.div variants={cardVariants}>
      <Card
        className={`border-border/40 bg-card/60 backdrop-blur-xl hover:border-border/80 transition-all ${onClick ? "cursor-pointer" : ""}`}
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `hsla(${accent} / 0.12)` }}>
              <Icon className="w-4.5 h-4.5" style={{ color: `hsl(${accent})` }} />
            </div>
            {onClick && <ArrowUpRight className="w-3.5 h-3.5 text-muted-foreground" />}
          </div>
          {loading ? <Skeleton className="h-7 w-16" /> : (
            <>
              <p className="text-2xl font-bold tracking-tight">{value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
              {subtitle && <p className="text-[10px] text-muted-foreground/60 mt-1">{subtitle}</p>}
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );

  const driverStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-500";
      case "busy": return "bg-yellow-500";
      case "off_duty": return "bg-muted-foreground/40";
      default: return "bg-muted-foreground/40";
    }
  };

  const driverStatusLabel = (status: string) => {
    switch (status) {
      case "available": return "Disponibile";
      case "busy": return "In servizio";
      case "off_duty": return "Non in turno";
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header + Date Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold font-heading">Dashboard NCC</h1>
          <p className="text-sm text-muted-foreground">Gestione flotta, autisti e prenotazioni</p>
        </div>
        <div className="flex gap-1 bg-secondary/50 rounded-lg p-1">
          {([["today", "Oggi"], ["week", "Settimana"], ["month", "Mese"], ["year", "Anno"]] as const).map(([k, l]) => (
            <Button
              key={k}
              size="sm"
              variant={dateFilter === k ? "default" : "ghost"}
              className={`text-xs h-8 min-h-[32px] ${dateFilter === k ? "bg-primary text-primary-foreground" : ""}`}
              onClick={() => setDateFilter(k)}
            >{l}</Button>
          ))}
        </div>
      </div>

      {/* Alert Box */}
      {hasAlerts && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-destructive/50 bg-destructive/10">
            <CardContent className="p-4 space-y-2">
              {alerts!.licenseExpiring > 0 && (
                <button onClick={() => navigate("/app/drivers")} className="flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-100 w-full text-left">
                  <AlertTriangle className="w-4 h-4" />⚠️ {alerts!.licenseExpiring} patenti in scadenza entro 60 giorni
                </button>
              )}
              {alerts!.revisionExpiring > 0 && (
                <button onClick={() => navigate("/app/fleet")} className="flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-100 w-full text-left">
                  <AlertTriangle className="w-4 h-4" />⚠️ {alerts!.revisionExpiring} revisioni veicoli in scadenza entro 30 giorni
                </button>
              )}
              {alerts!.unassigned > 0 && (
                <button onClick={() => navigate("/app/bookings")} className="flex items-center gap-2 text-sm text-yellow-300 hover:text-yellow-100 w-full text-left">
                  <AlertTriangle className="w-4 h-4" />⚠️ {alerts!.unassigned} prenotazioni senza autista assegnato
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ═══ CORSE DEL GIORNO + GUADAGNO ═══ */}
      <div>
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-3">
          📅 Corse di Oggi — {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
        </h2>
        <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {/* Daily earnings - prominent */}
          <motion.div variants={cardVariants} className="col-span-2 sm:col-span-1">
            <Card className="border-primary/30 bg-primary/5 backdrop-blur-xl">
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
                    <DollarSign className="w-5 h-5 text-primary" />
                  </div>
                </div>
                {todayLoading ? <Skeleton className="h-7 w-20" /> : (
                  <>
                    <p className="text-2xl font-bold tracking-tight text-primary">
                      €{(todayRides?.dailyEarnings ?? 0).toLocaleString("it-IT")}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">Guadagno Oggi</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-1">{todayRides?.total ?? 0} corse totali</p>
                  </>
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Status cards */}
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = todayRides?.byStatus[key] ?? 0;
            const IconComp = cfg.icon;
            return (
              <motion.div key={key} variants={cardVariants}>
                <Card
                  className={`border-border/40 bg-card/60 backdrop-blur-xl hover:border-border/80 transition-all cursor-pointer ${count > 0 ? "" : "opacity-60"}`}
                  onClick={() => navigate("/app/bookings")}
                >
                  <CardContent className="p-4">
                    <div className={`w-8 h-8 rounded-lg ${cfg.bg} flex items-center justify-center mb-2`}>
                      <IconComp className={`w-4 h-4 ${cfg.color}`} />
                    </div>
                    {todayLoading ? <Skeleton className="h-6 w-8" /> : (
                      <>
                        <p className="text-xl font-bold">{count}</p>
                        <p className="text-[11px] text-muted-foreground">{cfg.label}</p>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* ═══ TODAY'S RIDE LIST + DRIVER MAP ═══ */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Today's rides timeline */}
        <Card className="border-border/40 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Corse di Oggi
            </CardTitle>
          </CardHeader>
          <CardContent>
            {todayLoading ? (
              <div className="space-y-3">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-16 w-full rounded-lg" />)}
              </div>
            ) : (todayRides?.rides.length ?? 0) === 0 ? (
              <div className="py-8 text-center">
                <Car className="w-10 h-10 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">Nessuna corsa programmata oggi</p>
              </div>
            ) : (
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
                {todayRides!.rides.map((ride: any) => {
                  const cfg = STATUS_CONFIG[ride.status] || STATUS_CONFIG.pending;
                  const time = new Date(ride.pickup_datetime).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
                  const origin = ride.route?.origin || ride.pickup_address || "—";
                  const dest = ride.route?.destination || ride.dropoff_address || "—";
                  return (
                    <div
                      key={ride.id}
                      className="flex items-start gap-3 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors cursor-pointer"
                      onClick={() => navigate("/app/bookings")}
                    >
                      <div className={`w-10 h-10 rounded-lg ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}>
                        <cfg.icon className={`w-4 h-4 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-sm">{time}</span>
                          <Badge variant="outline" className={`text-[10px] ${cfg.color} border-current/20`}>
                            {cfg.label}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {origin} → {dest}
                        </p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-foreground/70">{ride.customer_name}</span>
                          {ride.driver ? (
                            <Badge variant="secondary" className="text-[10px]">🚗 {ride.driver.first_name}</Badge>
                          ) : (
                            <Badge variant="destructive" className="text-[10px]">⚠ No autista</Badge>
                          )}
                          {ride.total_price > 0 && (
                            <span className="text-[10px] font-semibold text-primary ml-auto">€{ride.total_price}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* ═══ LIVE DRIVER MAP ═══ */}
        <Card className="border-border/40 bg-card/60">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Navigation className="w-4 h-4 text-primary" /> Mappa Autisti Live
              <span className="ml-auto flex items-center gap-1 text-[10px] text-emerald-400 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Map placeholder */}
            <div className="relative w-full h-[180px] sm:h-[200px] rounded-xl overflow-hidden bg-secondary/50 mb-4">
              <div className="absolute inset-0 flex items-center justify-center">
                <div
                  className="absolute inset-0 opacity-[0.04]"
                  style={{
                    backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
                    backgroundSize: "40px 40px",
                  }}
                />
                {/* Simulated driver pins */}
                {drivers.slice(0, 6).map((d: any, i: number) => {
                  const positions = [
                    { top: "25%", left: "30%" }, { top: "45%", left: "60%" }, { top: "65%", left: "25%" },
                    { top: "35%", left: "75%" }, { top: "55%", left: "45%" }, { top: "20%", left: "55%" },
                  ];
                  const pos = positions[i] || positions[0];
                  return (
                    <motion.div
                      key={d.id}
                      className="absolute flex flex-col items-center"
                      style={pos}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: i * 0.1, type: "spring" }}
                    >
                      <div className="relative">
                        <div className={`w-8 h-8 rounded-full border-2 border-background flex items-center justify-center text-[10px] font-bold text-primary-foreground ${d.status === "available" ? "bg-emerald-500" : d.status === "busy" ? "bg-yellow-500" : "bg-muted-foreground"}`}>
                          {d.first_name[0]}{d.last_name[0]}
                        </div>
                        <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${driverStatusColor(d.status)}`} />
                      </div>
                      <span className="text-[9px] mt-1 text-foreground/60 bg-background/80 px-1 rounded">{d.first_name}</span>
                    </motion.div>
                  );
                })}
                {drivers.length === 0 && (
                  <p className="text-xs text-muted-foreground z-10">Nessun autista registrato</p>
                )}
              </div>
            </div>

            {/* Driver list */}
            <div className="space-y-1.5">
              {drivers.map((d: any) => (
                <div key={d.id} className="flex items-center gap-2 p-2 rounded-lg hover:bg-secondary/40 transition-colors">
                  <div className="relative">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-bold text-primary-foreground ${d.status === "available" ? "bg-emerald-600" : d.status === "busy" ? "bg-yellow-600" : "bg-muted-foreground"}`}>
                      {d.first_name[0]}{d.last_name[0]}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{d.first_name} {d.last_name}</p>
                  </div>
                  <Badge variant="outline" className={`text-[10px] ${d.status === "available" ? "text-emerald-400 border-emerald-400/30" : d.status === "busy" ? "text-yellow-400 border-yellow-400/30" : "text-muted-foreground"}`}>
                    {driverStatusLabel(d.status)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ═══ STANDARD KPIs ═══ */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Veicoli Attivi" value={stats?.vehicles ?? 0} icon={Car} loading={isLoading} onClick={() => navigate("/app/fleet")} />
        <KPI label="Tratte Attive" value={stats?.routes ?? 0} icon={MapPin} accent="210 80% 50%" loading={isLoading} onClick={() => navigate("/app/routes")} />
        <KPI label={`Fatturato ${dateFilter === "today" ? "Oggi" : dateFilter === "week" ? "Settimana" : dateFilter === "month" ? "Mese" : "Anno"}`} value={`€${(stats?.revenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accent="160 60% 45%" loading={isLoading} />
        <KPI label="Prenotazioni Settimana" value={stats?.bookingsWeek ?? 0} icon={Calendar} loading={isLoading} onClick={() => navigate("/app/bookings")} />
      </motion.div>

      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Autisti Disponibili" value={stats?.driversAvail ?? 0} icon={UserCheck} accent="160 60% 45%" loading={isLoading} onClick={() => navigate("/app/drivers")} />
        <KPI label="Fatturato Annuale" value={`€${(stats?.yearRevenue ?? 0).toLocaleString("it-IT")}`} icon={TrendingUp} accent="263 70% 58%" loading={isLoading} />
        <KPI
          label="Non Assegnate"
          value={stats?.unassigned ?? 0}
          icon={AlertTriangle}
          accent={stats?.unassigned ? "0 80% 55%" : "43 74% 49%"}
          loading={isLoading}
          subtitle={stats?.unassigned ? "Da assegnare autista" : undefined}
          onClick={() => navigate("/app/bookings")}
        />
        <KPI label="Conversione" value="—" icon={TrendingUp} accent="263 70% 58%" loading={isLoading} />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="border-border/40 bg-card/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Fatturato Ultimi 6 Mesi</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={revenueByMonth}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                  <Tooltip formatter={(v: number) => [`€${v.toLocaleString("it-IT")}`, "Fatturato"]} contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 12 }} />
                  <Bar dataKey="revenue" fill="#D4A017" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/40 bg-card/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top 5 Tratte</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px]">
              {topRoutes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topRoutes} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ count }: any) => `${count}`}>
                      {topRoutes.map((_: any, i: number) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
                    </Pie>
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">Nessun dato disponibile</div>
              )}
            </div>
            {topRoutes.length > 0 && (
              <div className="mt-2 space-y-1">
                {topRoutes.map((r: any, i: number) => (
                  <div key={i} className="flex items-center gap-2 text-xs">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: CHART_COLORS[i % CHART_COLORS.length] }} />
                    <span className="truncate text-muted-foreground">{r.name}</span>
                    <span className="ml-auto font-medium">{r.count}</span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}