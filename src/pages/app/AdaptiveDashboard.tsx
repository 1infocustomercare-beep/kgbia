import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, ShoppingBag, Users, DollarSign, Car, Calendar,
  Package, Wrench, Umbrella, Heart, Zap, Camera, Truck,
  FileText, Clock, Scale, Leaf, GraduationCap, Baby, Star,
  ArrowUpRight, ArrowDownRight, Activity
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";
import { type IndustryId } from "@/config/industry-config";

/* ── Animation variants ─────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring", stiffness: 260, damping: 24 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] } },
};

/* ── Industry accent map (HSL) ──────────────────────────── */
const INDUSTRY_ACCENT: Record<string, string> = {
  ncc: "210 80% 50%",
  beauty: "330 70% 55%",
  healthcare: "160 60% 45%",
  retail: "45 90% 50%",
  fitness: "0 80% 55%",
  hospitality: "200 70% 50%",
  beach: "199 89% 48%",
  plumber: "220 13% 45%",
  electrician: "38 92% 50%",
  agriturismo: "90 55% 40%",
  cleaning: "188 86% 42%",
  legal: "213 56% 35%",
  accounting: "221 83% 53%",
  garage: "28 76% 35%",
  photography: "280 60% 55%",
  construction: "30 70% 45%",
  gardening: "120 50% 40%",
  veterinary: "160 60% 45%",
  tattoo: "0 0% 30%",
  childcare: "340 65% 55%",
  education: "220 70% 50%",
  events: "300 60% 50%",
  logistics: "200 60% 45%",
  custom: "263 70% 58%",
};

/* ── Industry icon map ──────────────────────────────────── */
const INDUSTRY_HERO_ICON: Record<string, any> = {
  ncc: Car, beauty: Heart, healthcare: Heart, retail: ShoppingBag,
  fitness: Activity, hospitality: Star, beach: Umbrella, plumber: Wrench,
  electrician: Zap, agriturismo: Leaf, cleaning: Star, legal: Scale,
  accounting: Clock, garage: Wrench, photography: Camera, construction: Wrench,
  gardening: Leaf, veterinary: Heart, tattoo: Star, childcare: Baby,
  education: GraduationCap, events: Calendar, logistics: Truck, custom: Star,
};

/* ── Premium KPI Card ───────────────────────────────────── */
const KPICard = ({
  label, value, icon: Icon, accentHsl, loading, trend, delay = 0,
}: {
  label: string; value: string; icon: any; accentHsl: string;
  loading?: boolean; trend?: { value: string; positive: boolean }; delay?: number;
}) => (
  <motion.div variants={cardVariants}>
    <Card className="group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl hover:border-border/80 transition-all duration-500">
      {/* Accent glow */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at top left, hsla(${accentHsl} / 0.08), transparent 70%)` }}
      />
      <CardContent className="p-4 relative z-10">
        <div className="flex items-center justify-between mb-3">
          <div
            className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background: `hsla(${accentHsl} / 0.12)` }}
          >
            <Icon className="w-4.5 h-4.5" style={{ color: `hsl(${accentHsl})` }} />
          </div>
          {trend && (
            <div className={`flex items-center gap-0.5 text-xs font-medium ${trend.positive ? 'text-green-400' : 'text-red-400'}`}>
              {trend.positive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
              {trend.value}
            </div>
          )}
        </div>
        {loading ? (
          <div className="space-y-2">
            <Skeleton className="h-7 w-16" />
            <Skeleton className="h-3 w-24" />
          </div>
        ) : (
          <>
            <p className="text-2xl font-bold font-heading tracking-tight">{value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

/* ── NCC Dashboard ──────────────────────────────────────── */
function NCCDashboard() {
  const { companyId } = useIndustry();
  const accent = INDUSTRY_ACCENT.ncc;

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
    <DashboardShell industry="ncc" title="Dashboard NCC" subtitle="Gestione flotta e prenotazioni">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Prenotazioni Oggi" value={String(stats?.bookingsToday ?? 0)} icon={Calendar} accentHsl={accent} loading={isLoading} />
        <KPICard label="Revenue Oggi" value={`€${(stats?.revenueToday ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
        <KPICard label="Veicoli Attivi" value={String(stats?.activeVehicles ?? 0)} icon={Car} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="Crescita" value="—" icon={TrendingUp} accentHsl="45 90% 50%" loading={isLoading} />
      </motion.div>
    </DashboardShell>
  );
}

/* ── Generic Industry Dashboard ─────────────────────────── */
function GenericDashboard() {
  const { config, terminology, companyId, industry } = useIndustry();
  const accent = INDUSTRY_ACCENT[industry] || INDUSTRY_ACCENT.custom;

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

  const HeroIcon = INDUSTRY_HERO_ICON[industry] || Star;

  return (
    <DashboardShell industry={industry} title={`${terminology.dashboard || "Dashboard"} ${config.emoji}`} subtitle={config.description}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label={terminology.orders} value={String(stats?.appointments ?? 0)} icon={Calendar} accentHsl={accent} loading={isLoading} />
        <KPICard label={terminology.clients || terminology.customers} value={String(stats?.clients ?? 0)} icon={Users} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="Revenue" value="—" icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
        <KPICard label="Crescita" value="—" icon={TrendingUp} accentHsl="45 90% 50%" loading={isLoading} />
      </motion.div>
    </DashboardShell>
  );
}

/* ── Dashboard Shell (shared header + ambient) ──────────── */
function DashboardShell({
  industry, title, subtitle, children,
}: {
  industry: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  const accent = INDUSTRY_ACCENT[industry] || INDUSTRY_ACCENT.custom;
  const HeroIcon = INDUSTRY_HERO_ICON[industry] || Star;

  return (
    <div className="space-y-6 relative">
      {/* Ambient glow */}
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: `hsl(${accent})` }}
      />

      {/* Header */}
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center"
            style={{ background: `hsla(${accent} / 0.15)` }}
          >
            <HeroIcon className="w-5 h-5" style={{ color: `hsl(${accent})` }} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground mt-0.5 max-w-md">{subtitle}</p>}
          </div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}

/* ── Main Router ────────────────────────────────────────── */
export default function AdaptiveDashboard() {
  const { industry } = useIndustry();

  switch (industry) {
    case "ncc": return <NCCDashboard />;
    default: return <GenericDashboard />;
  }
}
