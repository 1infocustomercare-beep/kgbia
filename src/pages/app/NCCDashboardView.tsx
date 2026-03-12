import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Car, Calendar, DollarSign, Clock, Users, AlertTriangle,
  ArrowUpRight, MapPin, TrendingUp, UserCheck
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, AreaChart, Area
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

const ACCENT = "43 74% 49%"; // gold
const CHART_COLORS = ["#D4A017", "#3B82F6", "#10B981", "#EF4444", "#8B5CF6", "#F59E0B"];
const MONTHS_IT = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];

export default function NCCDashboardView() {
  const { companyId } = useIndustry();
  const navigate = useNavigate();
  const [dateFilter, setDateFilter] = useState<DateFilter>("month");

  const { start } = getDateRange(dateFilter);
  const yearStart = new Date(); yearStart.setMonth(0, 1); yearStart.setHours(0, 0, 0, 0);

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

  // Alerts
  const { data: alerts } = useQuery({
    queryKey: ["ncc-alerts", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const in60 = new Date(); in60.setDate(in60.getDate() + 60);
      const in30 = new Date(); in30.setDate(in30.getDate() + 30);
      const today = new Date().toISOString().split("T")[0];

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

  // Upcoming bookings
  const { data: upcoming = [] } = useQuery({
    queryKey: ["ncc-upcoming", companyId],
    enabled: !!companyId,
    queryFn: async () => {
      const { data } = await supabase.from("ncc_bookings")
        .select("*, route:ncc_routes(origin, destination), vehicle:fleet_vehicles(name), driver:drivers(first_name, last_name)")
        .eq("company_id", companyId!)
        .gte("pickup_datetime", new Date().toISOString())
        .in("status", ["pending", "confirmed"])
        .order("pickup_datetime", { ascending: true })
        .limit(5);
      return (data as any[]) || [];
    },
  });

  // Revenue by month (last 6 months)
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

  const KPI = ({ label, value, icon: Icon, accent = ACCENT, loading = false, subtitle }: any) => (
    <motion.div variants={cardVariants}>
      <Card className="border-border/40 bg-card/60 backdrop-blur-xl hover:border-border/80 transition-all">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: `hsla(${accent} / 0.12)` }}>
              <Icon className="w-4.5 h-4.5" style={{ color: `hsl(${accent})` }} />
            </div>
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
          <Card className="border-[#D4A017]/50 bg-red-950/30">
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

      {/* KPI Row 1 */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Veicoli Attivi" value={stats?.vehicles ?? 0} icon={Car} loading={isLoading} />
        <KPI label="Tratte Attive" value={stats?.routes ?? 0} icon={MapPin} accent="210 80% 50%" loading={isLoading} />
        <KPI label={`Fatturato ${dateFilter === "today" ? "Oggi" : dateFilter === "week" ? "Settimana" : dateFilter === "month" ? "Mese" : "Anno"}`} value={`€${(stats?.revenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accent="160 60% 45%" loading={isLoading} />
        <KPI label="Conversione" value="—" icon={TrendingUp} accent="263 70% 58%" loading={isLoading} />
      </motion.div>

      {/* KPI Row 2 */}
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <KPI label="Prenotazioni Settimana" value={stats?.bookingsWeek ?? 0} icon={Calendar} loading={isLoading} />
        <KPI label="Autisti Disponibili" value={stats?.driversAvail ?? 0} icon={UserCheck} accent="160 60% 45%" loading={isLoading} />
        <KPI label="Fatturato Annuale" value={`€${(stats?.yearRevenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accent="263 70% 58%" loading={isLoading} />
        <KPI
          label="Non Assegnate"
          value={stats?.unassigned ?? 0}
          icon={AlertTriangle}
          accent={stats?.unassigned ? "0 80% 55%" : "43 74% 49%"}
          loading={isLoading}
          subtitle={stats?.unassigned ? "Da assegnare autista" : undefined}
        />
      </motion.div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Revenue by month */}
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

        {/* Top routes pie */}
        <Card className="border-border/40 bg-card/60">
          <CardHeader className="pb-2"><CardTitle className="text-sm">Top 5 Tratte</CardTitle></CardHeader>
          <CardContent>
            <div className="h-[200px] sm:h-[250px]">
              {topRoutes.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={topRoutes} dataKey="count" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, count }: any) => `${count}`}>
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

      {/* Upcoming */}
      <Card className="border-border/40 bg-card/60">
        <CardHeader className="pb-2"><CardTitle className="text-sm">Prossimi Impegni</CardTitle></CardHeader>
        <CardContent>
          {upcoming.length === 0 ? (
            <p className="text-sm text-muted-foreground py-4 text-center">Nessuna prenotazione imminente</p>
          ) : (
            <div className="space-y-2">
              {upcoming.map((b: any) => {
                const statusColor = b.status === "confirmed" ? "text-green-400" : "text-yellow-400";
                return (
                  <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors">
                    <div className="flex items-center gap-2 text-sm flex-1 min-w-0">
                      <Clock className="w-3.5 h-3.5 text-muted-foreground flex-shrink-0" />
                      <span className="font-medium">
                        {new Date(b.pickup_datetime).toLocaleDateString("it-IT", { day: "2-digit", month: "short" })} {new Date(b.pickup_datetime).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                      </span>
                      <span className="text-muted-foreground">—</span>
                      <span className="truncate">{b.customer_name}</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      {b.route && <span className="truncate max-w-[150px]">{b.route.origin} → {b.route.destination}</span>}
                      {b.vehicle && <Badge variant="outline" className="text-[10px]">{b.vehicle.name}</Badge>}
                      {b.driver ? (
                        <Badge variant="secondary" className="text-[10px]">{b.driver.first_name} {b.driver.last_name}</Badge>
                      ) : (
                        <Badge variant="destructive" className="text-[10px]">No autista</Badge>
                      )}
                      <Badge className={`text-[10px] ${statusColor}`}>{b.status === "confirmed" ? "Confermata" : "In attesa"}</Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
