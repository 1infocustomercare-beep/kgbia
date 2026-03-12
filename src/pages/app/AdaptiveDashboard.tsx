import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, ShoppingBag, Users, DollarSign, Car, Calendar, Loader2, AlertTriangle, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

const KPICard = ({ label, value, icon: Icon, color, loading }: { label: string; value: string; icon: any; color: string; loading?: boolean }) => (
  <Card className="glass border-border/50">
    <CardContent className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      {loading ? <Skeleton className="h-8 w-20" /> : <p className="text-2xl font-bold">{value}</p>}
    </CardContent>
  </Card>
);

function FoodDashboard() {
  const { companyId } = useIndustry();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["food-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const weekAgo = new Date(Date.now() - 7 * 86400000).toISOString();

      const [ordersToday, revenueWeek, pendingRes, lowStock] = await Promise.all([
        supabase.from("orders").select("id", { count: "exact", head: true })
          .eq("restaurant_id", companyId!).gte("created_at", today),
        supabase.from("orders").select("total").eq("restaurant_id", companyId!).gte("created_at", weekAgo),
        supabase.from("reservations").select("id", { count: "exact", head: true })
          .eq("restaurant_id", companyId!).eq("status", "pending"),
        supabase.from("products").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).lt("stock", 5),
      ]);

      const weekRevenue = (revenueWeek.data || []).reduce((s, o) => s + (o.total || 0), 0);

      return {
        ordersToday: ordersToday.count || 0,
        revenueWeek: weekRevenue,
        pendingRes: pendingRes.count || 0,
        lowStock: lowStock.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">Dashboard Ristorazione</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Ordini Oggi" value={String(stats?.ordersToday ?? 0)} icon={ShoppingBag} color="text-blue-400" loading={isLoading} />
        <KPICard label="Revenue Settimana" value={`€${(stats?.revenueWeek ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} color="text-green-400" loading={isLoading} />
        <KPICard label="Prenotazioni Pending" value={String(stats?.pendingRes ?? 0)} icon={Calendar} color="text-purple-400" loading={isLoading} />
        <KPICard label="Scorte Basse" value={String(stats?.lowStock ?? 0)} icon={Package} color="text-orange-400" loading={isLoading} />
      </div>
    </div>
  );
}

function NCCDashboard() {
  const { companyId } = useIndustry();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["ncc-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const [bookingsToday, vehicles, revenue] = await Promise.all([
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).gte("created_at", today),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("is_active", true),
        supabase.from("ncc_bookings").select("total_price")
          .eq("company_id", companyId!).gte("created_at", today),
      ]);

      return {
        bookingsToday: bookingsToday.count || 0,
        activeVehicles: vehicles.count || 0,
        revenueToday: (revenue.data || []).reduce((s, b) => s + (b.total_price || 0), 0),
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">Dashboard NCC</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Prenotazioni Oggi" value={String(stats?.bookingsToday ?? 0)} icon={Calendar} color="text-blue-400" loading={isLoading} />
        <KPICard label="Revenue Oggi" value={`€${(stats?.revenueToday ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} color="text-green-400" loading={isLoading} />
        <KPICard label="Veicoli Attivi" value={String(stats?.activeVehicles ?? 0)} icon={Car} color="text-purple-400" loading={isLoading} />
        <KPICard label="Crescita" value="—" icon={TrendingUp} color="text-primary" loading={isLoading} />
      </div>
    </div>
  );
}

function GenericDashboard() {
  const { config, terminology, companyId } = useIndustry();

  const { data: stats, isLoading } = useQuery({
    queryKey: ["generic-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const [clients, appointments] = await Promise.all([
        supabase.from("crm_clients").select("id", { count: "exact", head: true }).eq("company_id", companyId!),
        supabase.from("appointments").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("status", "confirmed"),
      ]);
      return {
        clients: clients.count || 0,
        appointments: appointments.count || 0,
      };
    },
  });

  return (
    <div className="space-y-6">
      <h1 className="text-xl sm:text-2xl font-bold font-heading">
        {terminology.dashboard || "Dashboard"} {config.emoji}
      </h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label={terminology.orders} value={String(stats?.appointments ?? 0)} icon={Calendar} color="text-blue-400" loading={isLoading} />
        <KPICard label={terminology.clients || terminology.customers} value={String(stats?.clients ?? 0)} icon={Users} color="text-purple-400" loading={isLoading} />
        <KPICard label="Revenue" value="—" icon={DollarSign} color="text-green-400" loading={isLoading} />
        <KPICard label="Crescita" value="—" icon={TrendingUp} color="text-primary" loading={isLoading} />
      </div>
    </div>
  );
}

export default function AdaptiveDashboard() {
  const { industry } = useIndustry();

  // Food uses /dashboard exclusively – this shouldn't be reached, but just in case
  switch (industry) {
    case "ncc": return <NCCDashboard />;
    default: return <GenericDashboard />;
  }
}
