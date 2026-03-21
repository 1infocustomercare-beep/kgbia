import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import {
  TrendingUp, ShoppingBag, Users, DollarSign, Car, Calendar,
  Package, Wrench, Umbrella, Heart, Zap, Camera, Truck,
  FileText, Clock, Scale, Leaf, GraduationCap, Baby, Star,
  ArrowUpRight, ArrowDownRight, Activity, Scissors, Sparkles,
  MapPin, CheckCircle
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { type IndustryId } from "@/config/industry-config";
import { LiveSitePreview } from "@/components/app/LiveSitePreview";
import { SitePreviewOverlay } from "@/components/app/SitePreviewOverlay";
import { AIInsightsWidget } from "@/components/app/AIInsightsWidget";

/* ── Animation variants ─────────────────────────────────── */
const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  show: {
    opacity: 1, y: 0, scale: 1,
    transition: { type: "spring" as const, stiffness: 260, damping: 24 },
  },
};

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const } },
};

/* ── Industry accent map (HSL) ──────────────────────────── */
const INDUSTRY_ACCENT: Record<string, string> = {
  ncc: "210 80% 50%", beauty: "330 70% 55%", healthcare: "160 60% 45%",
  retail: "45 90% 50%", fitness: "0 80% 55%", hospitality: "200 70% 50%",
  beach: "199 89% 48%", plumber: "220 13% 45%", electrician: "38 92% 50%",
  agriturismo: "90 55% 40%", cleaning: "188 86% 42%", legal: "213 56% 35%",
  accounting: "221 83% 53%", garage: "28 76% 35%", photography: "280 60% 55%",
  construction: "30 70% 45%", gardening: "120 50% 40%", veterinary: "160 60% 45%",
  tattoo: "0 0% 30%", childcare: "340 65% 55%", education: "220 70% 50%",
  events: "300 60% 50%", logistics: "200 60% 45%", custom: "263 70% 58%",
};

/* ── Industry icon map ──────────────────────────────────── */
const INDUSTRY_HERO_ICON: Record<string, any> = {
  ncc: Car, beauty: Scissors, healthcare: Heart, retail: ShoppingBag,
  fitness: Activity, hospitality: Star, beach: Umbrella, plumber: Wrench,
  electrician: Zap, agriturismo: Leaf, cleaning: Sparkles, legal: Scale,
  accounting: Clock, garage: Wrench, photography: Camera, construction: Wrench,
  gardening: Leaf, veterinary: Heart, tattoo: Sparkles, childcare: Baby,
  education: GraduationCap, events: Calendar, logistics: Truck, custom: Star,
};

/* ── Premium KPI Card ───────────────────────────────────── */
const KPICard = ({
  label, value, icon: Icon, accentHsl, loading, trend, subtitle,
}: {
  label: string; value: string; icon: any; accentHsl: string;
  loading?: boolean; trend?: { value: string; positive: boolean }; subtitle?: string;
}) => (
  <motion.div variants={cardVariants}>
    <Card className="group relative overflow-hidden border-border/40 bg-card/60 backdrop-blur-xl hover:border-border/80 transition-all duration-500">
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
          <div className="space-y-2"><Skeleton className="h-7 w-16" /><Skeleton className="h-3 w-24" /></div>
        ) : (
          <>
            <p className="text-2xl font-bold font-heading tracking-tight text-foreground">{value}</p>
            <p className="text-xs text-muted-foreground/90 mt-0.5">{label}</p>
            {subtitle && <p className="text-[10px] text-muted-foreground/70 mt-1">{subtitle}</p>}
          </>
        )}
      </CardContent>
    </Card>
  </motion.div>
);

/* ── Quick Action Card ──────────────────────────────────── */
const QuickAction = ({ label, icon: Icon, accentHsl, onClick }: {
  label: string; icon: any; accentHsl: string; onClick?: () => void;
}) => (
  <motion.div variants={cardVariants}>
    <Card
      className="group cursor-pointer border-border/30 bg-card/40 hover:bg-card/70 hover:border-border/60 transition-all duration-300"
      onClick={onClick}
    >
      <CardContent className="p-3 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: `hsla(${accentHsl} / 0.1)` }}>
          <Icon className="w-4 h-4" style={{ color: `hsl(${accentHsl})` }} />
        </div>
        <span className="text-sm font-medium text-foreground/90">{label}</span>
      </CardContent>
    </Card>
  </motion.div>
);

/* ═══════════════════════════════════════════════════════════
   NCC Dashboard
   ═══════════════════════════════════════════════════════════ */
function NCCDashboard() {
  const { companyId } = useIndustry();
  const accent = INDUSTRY_ACCENT.ncc;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["ncc-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const [bookingsToday, vehicles, allBookings, pendingBookings] = await Promise.all([
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).gte("created_at", today),
        supabase.from("fleet_vehicles").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("is_active", true),
        supabase.from("ncc_bookings").select("total_price")
          .eq("company_id", companyId!).gte("created_at", today),
        supabase.from("ncc_bookings").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("status", "pending"),
      ]);
      return {
        bookingsToday: bookingsToday.count || 0,
        activeVehicles: vehicles.count || 0,
        revenueToday: (allBookings.data || []).reduce((s, b) => s + (b.total_price || 0), 0),
        pendingBookings: pendingBookings.count || 0,
      };
    },
  });

  return (
    <DashboardShell industry="ncc" title="Dashboard NCC" subtitle="Gestione flotta, autisti e prenotazioni transfer">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Corse Oggi" value={String(stats?.bookingsToday ?? 0)} icon={Calendar} accentHsl={accent} loading={isLoading} />
        <KPICard label="Revenue Oggi" value={`€${(stats?.revenueToday ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
        <KPICard label="Veicoli Attivi" value={String(stats?.activeVehicles ?? 0)} icon={Car} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="In Attesa" value={String(stats?.pendingBookings ?? 0)} icon={Clock} accentHsl="45 90% 50%" loading={isLoading} subtitle="Da confermare" />
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
        <QuickAction label="Nuova Prenotazione" icon={Calendar} accentHsl={accent} />
        <QuickAction label="Gestisci Flotta" icon={Car} accentHsl={accent} />
        <QuickAction label="Vedi Tratte" icon={MapPin} accentHsl={accent} />
      </motion.div>
    </DashboardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   Beauty / Wellness Dashboard
   ═══════════════════════════════════════════════════════════ */
function BeautyDashboard() {
  const { companyId, config } = useIndustry();
  const accent = INDUSTRY_ACCENT.beauty;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["beauty-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const [todayAppts, clients, products, pendingAppts] = await Promise.all([
        supabase.from("appointments").select("id, price", { count: "exact" })
          .eq("company_id", companyId!).gte("scheduled_at", today),
        supabase.from("crm_clients").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!),
        supabase.from("products").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("is_active", true),
        supabase.from("appointments").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("status", "confirmed").gte("scheduled_at", today),
      ]);
      const revenue = (todayAppts.data || []).reduce((s, a) => s + (a.price || 0), 0);
      return {
        todayAppointments: todayAppts.count || 0,
        revenue,
        clients: clients.count || 0,
        services: products.count || 0,
        pending: pendingAppts.count || 0,
      };
    },
  });

  return (
    <DashboardShell industry="beauty" title="Dashboard Salone" subtitle="Appuntamenti, clienti e trattamenti">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Appuntamenti Oggi" value={String(stats?.todayAppointments ?? 0)} icon={Calendar} accentHsl={accent} loading={isLoading} />
        <KPICard label="Revenue Oggi" value={`€${(stats?.revenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
        <KPICard label="Clienti Totali" value={String(stats?.clients ?? 0)} icon={Users} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="Trattamenti Attivi" value={String(stats?.services ?? 0)} icon={Sparkles} accentHsl="45 90% 50%" loading={isLoading} />
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
        <QuickAction label="Nuovo Appuntamento" icon={Calendar} accentHsl={accent} />
        <QuickAction label="Gestisci Servizi" icon={Sparkles} accentHsl={accent} />
        <QuickAction label="Lista Clienti" icon={Users} accentHsl={accent} />
      </motion.div>
    </DashboardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   Beach / Stabilimento Dashboard
   ═══════════════════════════════════════════════════════════ */
function BeachDashboard() {
  const { companyId } = useIndustry();
  const accent = INDUSTRY_ACCENT.beach;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["beach-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const [spots, todayBookings, passes, revenue] = await Promise.all([
        supabase.from("beach_spots").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("is_active", true),
        supabase.from("beach_bookings").select("id, total", { count: "exact" })
          .eq("company_id", companyId!).eq("booking_date", today),
        supabase.from("beach_passes").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).eq("is_active", true),
        supabase.from("beach_bookings").select("total")
          .eq("company_id", companyId!).eq("booking_date", today),
      ]);
      return {
        totalSpots: spots.count || 0,
        todayBookings: todayBookings.count || 0,
        activePasses: passes.count || 0,
        todayRevenue: (revenue.data || []).reduce((s, b) => s + (b.total || 0), 0),
      };
    },
  });

  return (
    <DashboardShell industry="beach" title="Spiaggia Live 🌊" subtitle="Gestione postazioni, prenotazioni e abbonamenti">
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label="Prenotazioni Oggi" value={String(stats?.todayBookings ?? 0)} icon={Calendar} accentHsl={accent} loading={isLoading} />
        <KPICard label="Revenue Oggi" value={`€${(stats?.todayRevenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
        <KPICard label="Postazioni Attive" value={String(stats?.totalSpots ?? 0)} icon={Umbrella} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="Abbonamenti Attivi" value={String(stats?.activePasses ?? 0)} icon={Star} accentHsl="45 90% 50%" loading={isLoading} />
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
        <QuickAction label="Mappa Spiaggia" icon={Umbrella} accentHsl={accent} />
        <QuickAction label="Nuova Prenotazione" icon={Calendar} accentHsl={accent} />
        <QuickAction label="Gestisci Abbonamenti" icon={Star} accentHsl={accent} />
      </motion.div>
    </DashboardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   Trades Dashboard (Plumber, Electrician, Cleaning, etc.)
   ═══════════════════════════════════════════════════════════ */
function TradesDashboard() {
  const { companyId, config, terminology, industry } = useIndustry();
  const accent = INDUSTRY_ACCENT[industry] || INDUSTRY_ACCENT.custom;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["trades-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const [interventions, clients, pending, products] = await Promise.all([
        supabase.from("interventions").select("id, final_price", { count: "exact" })
          .eq("company_id", companyId!),
        supabase.from("crm_clients").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!),
        supabase.from("interventions").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!).in("status", ["requested", "scheduled"]),
        supabase.from("products").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!),
      ]);
      const revenue = (interventions.data || []).reduce((s, i) => s + (i.final_price || 0), 0);
      return {
        totalInterventions: interventions.count || 0,
        clients: clients.count || 0,
        pending: pending.count || 0,
        revenue,
        materials: products.count || 0,
      };
    },
  });

  const HeroIcon = INDUSTRY_HERO_ICON[industry] || Wrench;

  return (
    <DashboardShell industry={industry} title={`${terminology.dashboard || "Dashboard"} ${config.emoji}`} subtitle={config.description}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label={terminology.orders} value={String(stats?.totalInterventions ?? 0)} icon={HeroIcon} accentHsl={accent} loading={isLoading} />
        <KPICard label="In Attesa" value={String(stats?.pending ?? 0)} icon={Clock} accentHsl="45 90% 50%" loading={isLoading} subtitle="Da gestire" />
        <KPICard label={terminology.clients || "Clienti"} value={String(stats?.clients ?? 0)} icon={Users} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="Fatturato" value={`€${(stats?.revenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
        <QuickAction label={`Nuovo ${terminology.order}`} icon={HeroIcon} accentHsl={accent} />
        <QuickAction label="Lista Clienti" icon={Users} accentHsl={accent} />
        {stats?.materials ? <QuickAction label="Magazzino" icon={Package} accentHsl={accent} /> : null}
      </motion.div>
    </DashboardShell>
  );
}

/* ═══════════════════════════════════════════════════════════
   Appointment-based Dashboard (Healthcare, Veterinary, Tattoo, etc.)
   ═══════════════════════════════════════════════════════════ */
function AppointmentDashboard() {
  const { companyId, config, terminology, industry } = useIndustry();
  const accent = INDUSTRY_ACCENT[industry] || INDUSTRY_ACCENT.custom;

  const { data: stats, isLoading } = useQuery({
    queryKey: ["appt-dashboard", companyId],
    enabled: !!companyId,
    refetchInterval: 30000,
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const [todayAppts, clients, totalAppts] = await Promise.all([
        supabase.from("appointments").select("id, price", { count: "exact" })
          .eq("company_id", companyId!).gte("scheduled_at", today),
        supabase.from("crm_clients").select("id", { count: "exact", head: true })
          .eq("company_id", companyId!),
        supabase.from("appointments").select("price")
          .eq("company_id", companyId!),
      ]);
      const revenue = (todayAppts.data || []).reduce((s, a) => s + (a.price || 0), 0);
      return {
        todayAppointments: todayAppts.count || 0,
        clients: clients.count || 0,
        revenue,
        totalRevenue: (totalAppts.data || []).reduce((s, a) => s + (a.price || 0), 0),
      };
    },
  });

  const HeroIcon = INDUSTRY_HERO_ICON[industry] || Calendar;

  return (
    <DashboardShell industry={industry} title={`${terminology.dashboard || "Dashboard"} ${config.emoji}`} subtitle={config.description}>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <KPICard label={`${terminology.orders} Oggi`} value={String(stats?.todayAppointments ?? 0)} icon={Calendar} accentHsl={accent} loading={isLoading} />
        <KPICard label="Revenue Oggi" value={`€${(stats?.revenue ?? 0).toLocaleString("it-IT")}`} icon={DollarSign} accentHsl="160 60% 45%" loading={isLoading} />
        <KPICard label={terminology.clients || terminology.customers} value={String(stats?.clients ?? 0)} icon={Users} accentHsl="263 70% 58%" loading={isLoading} />
        <KPICard label="Fatturato Totale" value={`€${(stats?.totalRevenue ?? 0).toLocaleString("it-IT")}`} icon={TrendingUp} accentHsl="45 90% 50%" loading={isLoading} />
      </motion.div>
      <motion.div variants={containerVariants} initial="hidden" animate="show" className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-6">
        <QuickAction label={`Nuovo ${terminology.order}`} icon={Calendar} accentHsl={accent} />
        <QuickAction label={`Gestisci ${terminology.clients || "Clienti"}`} icon={Users} accentHsl={accent} />
        <QuickAction label="Vedi Agenda" icon={Clock} accentHsl={accent} />
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
      return { clients: clients.count || 0, appointments: appointments.count || 0 };
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

/* ── Dashboard Shell (shared header + ambient + live preview) */
function DashboardShell({
  industry, title, subtitle, children,
}: {
  industry: string; title: string; subtitle?: string; children: React.ReactNode;
}) {
  const accent = INDUSTRY_ACCENT[industry] || INDUSTRY_ACCENT.custom;
  const HeroIcon = INDUSTRY_HERO_ICON[industry] || Star;
  const { company } = useIndustry();
  const [previewExpanded, setPreviewExpanded] = useState(false);

  return (
    <div className="space-y-6 relative">
      <div
        className="absolute -top-20 -left-20 w-72 h-72 rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: `hsl(${accent})` }}
      />
      <motion.div variants={fadeUp} initial="hidden" animate="show" className="relative z-10">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `hsla(${accent} / 0.15)` }}>
            <HeroIcon className="w-5 h-5" style={{ color: `hsl(${accent})` }} />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-bold font-heading tracking-tight text-foreground">{title}</h1>
            {subtitle && <p className="text-xs text-muted-foreground/80 mt-0.5 max-w-md">{subtitle}</p>}
          </div>
        </div>
      </motion.div>

      {/* Main content + Live Preview side by side on desktop */}
      <div className="relative z-10 flex gap-6">
        <div className="flex-1 min-w-0 space-y-4">
          {children}
          <AIInsightsWidget sector={industry} />
        </div>

        {/* Live iPhone Preview - hidden on mobile, visible on lg+ */}
        {company?.slug && (
          <div className="hidden lg:flex flex-col items-center shrink-0">
            <LiveSitePreview
              slug={company.slug}
              primaryColor={company.primary_color}
              companyName={company.name}
              onExpand={() => setPreviewExpanded(true)}
              industry={industry}
            />
          </div>
        )}
      </div>

      {/* Expanded overlay */}
      {company?.slug && (
        <SitePreviewOverlay
          slug={company.slug}
          companyName={company.name}
          open={previewExpanded}
          onClose={() => setPreviewExpanded(false)}
          industry={industry}
        />
      )}
    </div>
  );
}

/* ── Main Router ────────────────────────────────────────── */
export default function AdaptiveDashboard() {
  const { industry } = useIndustry();

  // Trade/intervention-based industries
  const tradeIndustries: IndustryId[] = ["plumber", "electrician", "cleaning", "gardening", "construction", "garage"];
  // Appointment-based industries
  const appointmentIndustries: IndustryId[] = ["healthcare", "veterinary", "tattoo", "childcare", "education", "photography", "fitness"];

  if (industry === "ncc") return <NCCDashboard />;
  if (industry === "beauty") return <BeautyDashboard />;
  if (industry === "beach") return <BeachDashboard />;
  if (tradeIndustries.includes(industry)) return <TradesDashboard />;
  if (appointmentIndustries.includes(industry)) return <AppointmentDashboard />;
  return <GenericDashboard />;
}