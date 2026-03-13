import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car, Calendar, DollarSign, Clock, Users, AlertTriangle,
  ArrowUpRight, MapPin, TrendingUp, UserCheck, Navigation, CheckCircle2, XCircle,
  Plus, Route, Shield, CreditCard, Star, Settings, Briefcase, BarChart3,
  ChevronRight, Phone, FileText, Sparkles
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer
} from "recharts";

type DateFilter = "today" | "week" | "month" | "year";

const containerVariants = { hidden: {}, show: { transition: { staggerChildren: 0.04 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 12, scale: 0.98 },
  show: { opacity: 1, y: 0, scale: 1, transition: { type: "spring" as const, stiffness: 300, damping: 26 } },
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

const CHART_COLORS = ["#D4A017", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B"];
const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any; bg: string; dot: string }> = {
  pending: { label: "In Attesa", color: "text-amber-400", icon: Clock, bg: "bg-amber-500/10", dot: "bg-amber-400" },
  confirmed: { label: "Confermate", color: "text-blue-400", icon: CheckCircle2, bg: "bg-blue-500/10", dot: "bg-blue-400" },
  in_progress: { label: "In Corso", color: "text-purple-400", icon: Navigation, bg: "bg-purple-500/10", dot: "bg-purple-400" },
  completed: { label: "Completate", color: "text-emerald-400", icon: CheckCircle2, bg: "bg-emerald-500/10", dot: "bg-emerald-400" },
  cancelled: { label: "Annullate", color: "text-red-400", icon: XCircle, bg: "bg-red-500/10", dot: "bg-red-400" },
};

/* ═══ QUICK ACTIONS ═══ */
const QUICK_ACTIONS = [
  { label: "Nuova Corsa", icon: Plus, path: "/app/bookings", accent: "bg-primary/15 text-primary" },
  { label: "Flotta", icon: Car, path: "/app/fleet", accent: "bg-blue-500/10 text-blue-400" },
  { label: "Autisti", icon: Users, path: "/app/drivers", accent: "bg-emerald-500/10 text-emerald-400" },
  { label: "Tratte", icon: Route, path: "/app/routes", accent: "bg-purple-500/10 text-purple-400" },
  { label: "Prezzi", icon: CreditCard, path: "/app/pricing", accent: "bg-amber-500/10 text-amber-400" },
  { label: "Scadenze", icon: Shield, path: "/app/ncc-expiry", accent: "bg-red-500/10 text-red-400" },
  { label: "Recensioni", icon: Star, path: "/app/reviews", accent: "bg-yellow-500/10 text-yellow-400" },
  { label: "Finanza", icon: BarChart3, path: "/app/finance", accent: "bg-cyan-500/10 text-cyan-400" },
];

export default function NCCDashboardView() {
  const { companyId } = useIndustry();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");

  const { start } = getDateRange(dateFilter);
  const todayRange = getTodayRange();
  const yearStart = new Date(); yearStart.setMonth(0, 1); yearStart.setHours(0, 0, 0, 0);

  // ═══ TODAY'S RIDES ═══
  const { data: todayRides, isLoading: todayLoading } = useQuery({
    queryKey: ["ncc-today-rides", companyId],
    enabled: !!companyId,
    refetchInterval: 15000,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_bookings")
        .select("id, status, total_price, customer_name, customer_phone, pickup_datetime, pickup_address, dropoff_address, passengers, driver_id, route:ncc_routes(origin, destination), vehicle:fleet_vehicles(name), driver:drivers(first_name, last_name)")
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
      const [vehicles, routes, bookingsFiltered, bookingsWeek, driversAvail, unassigned, bookingsYear, reviews] = await Promise.all([
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("is_active", true),
        supabase.from("ncc_routes").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("is_active", true),
        supabase.from("ncc_bookings").select("total_price").eq("company_id", companyId!).gte("created_at", start),
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true }).eq("company_id", companyId!).gte("pickup_datetime", weekStart.toISOString()),
        supabase.from("drivers").select("id", { count: "exact", head: true }).eq("company_id", companyId!).eq("status", "available"),
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true }).eq("company_id", companyId!).is("driver_id", null).neq("status", "cancelled"),
        supabase.from("ncc_bookings").select("total_price").eq("company_id", companyId!).gte("created_at", yearStart.toISOString()),
        supabase.from("ncc_reviews").select("rating").eq("company_id", companyId!),
      ]);

      const revenue = (bookingsFiltered.data || []).reduce((s, b) => s + (b.total_price || 0), 0);
      const yearRevenue = (bookingsYear.data || []).reduce((s, b) => s + (b.total_price || 0), 0);
      const avgRating = (reviews.data || []).length > 0
        ? ((reviews.data || []).reduce((s, r) => s + (r.rating || 0), 0) / (reviews.data || []).length).toFixed(1)
        : "—";

      return {
        vehicles: vehicles.count || 0,
        routes: routes.count || 0,
        revenue,
        yearRevenue,
        bookingsWeek: bookingsWeek.count || 0,
        driversAvail: driversAvail.count || 0,
        unassigned: unassigned.count || 0,
        avgRating,
        totalReviews: (reviews.data || []).length,
      };
    },
  });

  // ═══ DRIVERS LIVE ═══
  const { data: drivers = [] } = useQuery({
    queryKey: ["ncc-drivers-live", companyId],
    enabled: !!companyId,
    refetchInterval: 20000,
    queryFn: async () => {
      const { data } = await supabase.from("drivers")
        .select("id, first_name, last_name, status, phone")
        .eq("company_id", companyId!)
        .order("first_name");
      return (data || []) as any[];
    },
  });

  // ═══ ALERTS ═══
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
      return { licenseExpiring: licenseExpiring.count || 0, revisionExpiring: revisionExpiring.count || 0, unassigned: unassignedBookings.count || 0 };
    },
  });

  // ═══ REVENUE CHART ═══
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

  // ═══ TOP ROUTES ═══
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
  const totalAlerts = (alerts?.licenseExpiring || 0) + (alerts?.revisionExpiring || 0) + (alerts?.unassigned || 0);

  const driverStatusColor = (status: string) => {
    switch (status) {
      case "available": return "bg-emerald-500";
      case "busy": return "bg-amber-500";
      case "off_duty": return "bg-muted-foreground/40";
      default: return "bg-muted-foreground/40";
    }
  };

  const driverStatusLabel = (status: string) => {
    switch (status) {
      case "available": return "Libero";
      case "busy": return "In servizio";
      case "off_duty": return "Non in turno";
      default: return status;
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 pb-20 md:pb-4">
      {/* ═══ HEADER ═══ */}
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg sm:text-xl font-bold font-heading">Dashboard</h1>
            <p className="text-xs text-muted-foreground">
              {new Date().toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" })}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {hasAlerts && (
              <button
                onClick={() => navigate("/app/ncc-expiry")}
                className="relative w-9 h-9 rounded-xl bg-red-500/10 flex items-center justify-center"
              >
                <AlertTriangle className="w-4 h-4 text-red-400" />
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-red-500 text-[9px] text-white font-bold flex items-center justify-center">
                  {totalAlerts}
                </span>
              </button>
            )}
            <button
              onClick={() => navigate("/app/settings")}
              className="w-9 h-9 rounded-xl bg-secondary/50 flex items-center justify-center"
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>

        {/* Date filter */}
        <div className="flex gap-1 bg-secondary/40 rounded-lg p-0.5">
          {([["today", "Oggi"], ["week", "Sett."], ["month", "Mese"], ["year", "Anno"]] as const).map(([k, l]) => (
            <button
              key={k}
              className={`flex-1 text-[11px] font-medium py-1.5 rounded-md transition-all ${
                dateFilter === k
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setDateFilter(k)}
            >{l}</button>
          ))}
        </div>
      </div>

      {/* ═══ HERO KPIs — 2x2 grid mobile ═══ */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 gap-2.5 sm:gap-3">
        {/* Revenue */}
        <motion.div variants={cardVariants}>
          <Card className="border-primary/20 bg-primary/5 backdrop-blur">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-primary/15 flex items-center justify-center">
                  <DollarSign className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-primary" />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato</span>
              </div>
              {isLoading ? <Skeleton className="h-6 w-16" /> : (
                <p className="text-lg sm:text-xl font-bold text-primary">
                  €{(stats?.revenue ?? 0).toLocaleString("it-IT")}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Today's earnings */}
        <motion.div variants={cardVariants}>
          <Card className="border-border/40 bg-card/60 backdrop-blur">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-500/10 flex items-center justify-center">
                  <TrendingUp className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-400" />
                </div>
                <span className="text-[10px] text-muted-foreground uppercase tracking-wider">Oggi</span>
              </div>
              {todayLoading ? <Skeleton className="h-6 w-16" /> : (
                <p className="text-lg sm:text-xl font-bold">
                  €{(todayRides?.dailyEarnings ?? 0).toLocaleString("it-IT")}
                </p>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Vehicles */}
        <motion.div variants={cardVariants}>
          <Card className="border-border/40 bg-card/60 backdrop-blur cursor-pointer hover:border-border/80 transition-all" onClick={() => navigate("/app/fleet")}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                  <Car className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-400" />
                </div>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground/50 ml-auto" />
              </div>
              {isLoading ? <Skeleton className="h-6 w-8" /> : (
                <>
                  <p className="text-lg sm:text-xl font-bold">{stats?.vehicles ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground">Veicoli attivi</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* Drivers */}
        <motion.div variants={cardVariants}>
          <Card className="border-border/40 bg-card/60 backdrop-blur cursor-pointer hover:border-border/80 transition-all" onClick={() => navigate("/app/drivers")}>
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2 mb-1.5">
                <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                  <UserCheck className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-400" />
                </div>
                <ArrowUpRight className="w-3 h-3 text-muted-foreground/50 ml-auto" />
              </div>
              {isLoading ? <Skeleton className="h-6 w-8" /> : (
                <>
                  <p className="text-lg sm:text-xl font-bold">{stats?.driversAvail ?? 0}</p>
                  <p className="text-[10px] text-muted-foreground">Autisti liberi</p>
                </>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ═══ QUICK ACTIONS — horizontal scroll mobile ═══ */}
      <div>
        <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Azioni rapide</h2>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
          {QUICK_ACTIONS.map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.path + a.label}
                onClick={() => navigate(a.path)}
                className="flex flex-col items-center gap-1.5 min-w-[64px] flex-shrink-0"
              >
                <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${a.accent} transition-transform active:scale-95`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-[10px] font-medium text-muted-foreground text-center leading-tight">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ ALERT BANNER ═══ */}
      {hasAlerts && (
        <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-red-500/30 bg-red-500/5">
            <CardContent className="p-3 space-y-1.5">
              {alerts!.unassigned > 0 && (
                <button onClick={() => navigate("/app/bookings")} className="flex items-center gap-2 text-xs text-amber-300 hover:text-amber-100 w-full text-left">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{alerts!.unassigned} prenotazioni senza autista</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                </button>
              )}
              {alerts!.licenseExpiring > 0 && (
                <button onClick={() => navigate("/app/ncc-expiry")} className="flex items-center gap-2 text-xs text-yellow-300 hover:text-yellow-100 w-full text-left">
                  <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{alerts!.licenseExpiring} patenti in scadenza</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                </button>
              )}
              {alerts!.revisionExpiring > 0 && (
                <button onClick={() => navigate("/app/fleet")} className="flex items-center gap-2 text-xs text-orange-300 hover:text-orange-100 w-full text-left">
                  <Car className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{alerts!.revisionExpiring} revisioni veicoli in scadenza</span>
                  <ChevronRight className="w-3.5 h-3.5 ml-auto flex-shrink-0" />
                </button>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* ═══ TODAY'S STATUS PILLS ═══ */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Corse di oggi
          </h2>
          <span className="text-xs font-bold text-foreground">
            {todayRides?.total ?? 0} totali
          </span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
          {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
            const count = todayRides?.byStatus[key] ?? 0;
            const Icon = cfg.icon;
            return (
              <button
                key={key}
                onClick={() => navigate("/app/bookings")}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl border transition-all flex-shrink-0 ${
                  count > 0 ? `${cfg.bg} border-current/10` : "bg-secondary/30 border-border/30 opacity-50"
                }`}
              >
                <div className={`w-2 h-2 rounded-full ${cfg.dot}`} />
                <span className={`text-xs font-semibold ${count > 0 ? cfg.color : "text-muted-foreground"}`}>{count}</span>
                <span className="text-[10px] text-muted-foreground">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ═══ TODAY'S RIDE TIMELINE ═══ */}
      <Card className="border-border/40 bg-card/60">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" /> Programma Oggi
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => navigate("/app/bookings")}>
              Tutte <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3">
          {todayLoading ? (
            <div className="space-y-2">
              {[1, 2, 3].map(i => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
            </div>
          ) : (todayRides?.rides.length ?? 0) === 0 ? (
            <div className="py-6 text-center">
              <Car className="w-8 h-8 mx-auto text-muted-foreground/20 mb-2" />
              <p className="text-xs text-muted-foreground">Nessuna corsa programmata</p>
              <Button size="sm" variant="outline" className="mt-3 text-xs h-8" onClick={() => navigate("/app/bookings")}>
                <Plus className="w-3 h-3 mr-1" /> Nuova Prenotazione
              </Button>
            </div>
          ) : (
            <div className="space-y-1.5 max-h-[300px] sm:max-h-[400px] overflow-y-auto">
              {todayRides!.rides.map((ride: any) => {
                const cfg = STATUS_CONFIG[ride.status] || STATUS_CONFIG.pending;
                const time = new Date(ride.pickup_datetime).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
                const origin = ride.route?.origin || ride.pickup_address?.split(",")[0] || "—";
                const dest = ride.route?.destination || ride.dropoff_address?.split(",")[0] || "—";
                return (
                  <div
                    key={ride.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-lg bg-secondary/20 hover:bg-secondary/40 transition-colors cursor-pointer"
                    onClick={() => navigate("/app/bookings")}
                  >
                    {/* Time */}
                    <div className="text-center flex-shrink-0 w-12">
                      <p className="text-sm font-bold">{time}</p>
                      <div className={`w-2 h-2 rounded-full mx-auto mt-0.5 ${cfg.dot}`} />
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold truncate">{origin} → {dest}</p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[10px] text-muted-foreground truncate">{ride.customer_name}</span>
                        {ride.passengers > 1 && (
                          <span className="text-[10px] text-muted-foreground">• {ride.passengers} pax</span>
                        )}
                      </div>
                    </div>

                    {/* Right side */}
                    <div className="flex flex-col items-end gap-0.5 flex-shrink-0">
                      {ride.total_price > 0 && (
                        <span className="text-xs font-bold text-primary">€{ride.total_price}</span>
                      )}
                      {ride.driver ? (
                        <span className="text-[9px] text-emerald-400">{ride.driver.first_name}</span>
                      ) : (
                        <span className="text-[9px] text-red-400">⚠ No autista</span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ DRIVERS LIVE ═══ */}
      <Card className="border-border/40 bg-card/60">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Autisti
              <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-normal">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> Live
              </span>
            </CardTitle>
            <Button size="sm" variant="ghost" className="text-xs h-7" onClick={() => navigate("/app/drivers")}>
              Gestisci <ChevronRight className="w-3 h-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3">
          {drivers.length === 0 ? (
            <div className="py-4 text-center">
              <Users className="w-6 h-6 mx-auto text-muted-foreground/20 mb-1" />
              <p className="text-xs text-muted-foreground">Nessun autista registrato</p>
            </div>
          ) : (
            <div className="space-y-1">
              {drivers.map((d: any) => (
                <div key={d.id} className="flex items-center gap-2.5 p-2 rounded-lg hover:bg-secondary/30 transition-colors">
                  <div className="relative">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white ${
                      d.status === "available" ? "bg-emerald-600" : d.status === "busy" ? "bg-amber-600" : "bg-muted-foreground"
                    }`}>
                      {d.first_name?.[0]}{d.last_name?.[0]}
                    </div>
                    <span className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-card ${driverStatusColor(d.status)}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium truncate">{d.first_name} {d.last_name}</p>
                  </div>
                  <Badge variant="outline" className={`text-[9px] h-5 ${
                    d.status === "available" ? "text-emerald-400 border-emerald-400/20" :
                    d.status === "busy" ? "text-amber-400 border-amber-400/20" :
                    "text-muted-foreground border-border"
                  }`}>
                    {driverStatusLabel(d.status)}
                  </Badge>
                  {d.phone && (
                    <a href={`tel:${d.phone}`} className="w-7 h-7 rounded-lg bg-secondary/50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-3 h-3 text-muted-foreground" />
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* ═══ STATS ROW ═══ */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-3 gap-2">
        <motion.div variants={cardVariants}>
          <Card className="border-border/40 bg-card/60 cursor-pointer" onClick={() => navigate("/app/routes")}>
            <CardContent className="p-3 text-center">
              <MapPin className="w-4 h-4 text-blue-400 mx-auto mb-1" />
              {isLoading ? <Skeleton className="h-5 w-6 mx-auto" /> : <p className="text-base font-bold">{stats?.routes ?? 0}</p>}
              <p className="text-[9px] text-muted-foreground">Tratte</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="border-border/40 bg-card/60 cursor-pointer" onClick={() => navigate("/app/bookings")}>
            <CardContent className="p-3 text-center">
              <Calendar className="w-4 h-4 text-purple-400 mx-auto mb-1" />
              {isLoading ? <Skeleton className="h-5 w-6 mx-auto" /> : <p className="text-base font-bold">{stats?.bookingsWeek ?? 0}</p>}
              <p className="text-[9px] text-muted-foreground">Sett.</p>
            </CardContent>
          </Card>
        </motion.div>
        <motion.div variants={cardVariants}>
          <Card className="border-border/40 bg-card/60 cursor-pointer" onClick={() => navigate("/app/reviews")}>
            <CardContent className="p-3 text-center">
              <Star className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
              {isLoading ? <Skeleton className="h-5 w-6 mx-auto" /> : (
                <p className="text-base font-bold">{stats?.avgRating ?? "—"}</p>
              )}
              <p className="text-[9px] text-muted-foreground">{stats?.totalReviews ?? 0} rec.</p>
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ═══ UNASSIGNED ALERT ═══ */}
      {(stats?.unassigned ?? 0) > 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={() => navigate("/app/bookings")}
            className="w-full flex items-center gap-3 p-3 rounded-xl bg-amber-500/10 border border-amber-500/20"
          >
            <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
            <div className="text-left flex-1">
              <p className="text-xs font-semibold text-amber-300">{stats?.unassigned} corse senza autista</p>
              <p className="text-[10px] text-muted-foreground">Assegna un autista per confermare</p>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400/60" />
          </button>
        </motion.div>
      )}

      {/* ═══ REVENUE CHART ═══ */}
      <Card className="border-border/40 bg-card/60">
        <CardHeader className="pb-1 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-primary" /> Fatturato 6 Mesi
          </CardTitle>
        </CardHeader>
        <CardContent className="px-1 sm:px-4 pb-3">
          <div className="h-[180px] sm:h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByMonth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.3} />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} width={40} />
                <Tooltip
                  formatter={(v: number) => [`€${v.toLocaleString("it-IT")}`, "Fatturato"]}
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, fontSize: 11 }}
                />
                <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* ═══ TOP ROUTES ═══ */}
      <Card className="border-border/40 bg-card/60">
        <CardHeader className="pb-2 px-3 sm:px-6 pt-3 sm:pt-4">
          <CardTitle className="text-sm flex items-center gap-2">
            <Route className="w-4 h-4 text-primary" /> Tratte Più Richieste
          </CardTitle>
        </CardHeader>
        <CardContent className="px-3 sm:px-6 pb-3">
          {topRoutes.length > 0 ? (
            <div className="space-y-2">
              {topRoutes.map((r: any, i: number) => (
                <div key={i} className="flex items-center gap-2.5">
                  <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold" style={{ background: CHART_COLORS[i % CHART_COLORS.length] + "20", color: CHART_COLORS[i % CHART_COLORS.length] }}>
                    {i + 1}
                  </div>
                  <span className="text-xs text-foreground/80 flex-1 truncate">{r.name}</span>
                  <Badge variant="secondary" className="text-[10px] h-5">{r.count} corse</Badge>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-muted-foreground text-center py-4">Nessun dato disponibile</p>
          )}
        </CardContent>
      </Card>

      {/* ═══ YEAR REVENUE SUMMARY ═══ */}
      <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-transparent">
        <CardContent className="p-3 sm:p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Fatturato Annuale {new Date().getFullYear()}</p>
              {isLoading ? <Skeleton className="h-7 w-24 mt-1" /> : (
                <p className="text-xl sm:text-2xl font-bold text-primary mt-0.5">
                  €{(stats?.yearRevenue ?? 0).toLocaleString("it-IT")}
                </p>
              )}
            </div>
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
