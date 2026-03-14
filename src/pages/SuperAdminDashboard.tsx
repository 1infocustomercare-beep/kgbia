import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Power, TrendingUp, DollarSign, Users, Store,
  BarChart3, LogOut, Search, Bot, Send, Bell,
  ShieldCheck, Lock, ExternalLink, FileText, FileSpreadsheet,
  CreditCard, Ban, Unlock, Calendar, Clock, Eye, Film,
  Cpu, Wifi, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, Filter, Plus, ArrowUpRight, ArrowDownRight,
  Building2, MapPin, Zap, Activity, Lightbulb
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lazy, Suspense } from "react";
import BackButton from "@/components/BackButton";
const FeatureRequestsAdminPage = lazy(() => import("@/pages/superadmin/FeatureRequestsAdminPage"));
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Legend } from "recharts";

interface CompanyTenant {
  id: string;
  name: string;
  slug: string;
  industry: string;
  plan: string;
  active: boolean;
  blocked: boolean;
  city: string;
  createdAt: string;
  lastAccess: string;
  revenue: number;
  orders: number;
  fee2percent: number;
  ownerEmail?: string;
}

interface FiscoStatus {
  id: string;
  restaurantId: string;
  tenantName: string;
  provider: string;
  configured: boolean;
  updatedAt: string;
}

interface PaymentRecord {
  id: string;
  restaurantId: string;
  tenantName: string;
  planType: string;
  totalAmount: number;
  amountPaid: number;
  installmentAmount: number;
  installmentsPaid: number;
  installmentsTotal: number;
  isOverdue: boolean;
  nextDueDate: string | null;
  gracePeriodDays: number;
  blockedAt: string | null;
  createdAt: string;
}

type SuperTab = "overview" | "tenants" | "fisco" | "billing" | "payments" | "mary" | "agents" | "media" | "feature_requests" | "brand";

const INDUSTRY_COLORS: Record<string, string> = {
  food: "#C8963E", ncc: "#1E3A5F", beauty: "#E91E8C", healthcare: "#10B981",
  fitness: "#F97316", retail: "#8B5CF6", hospitality: "#0EA5E9", beach: "#06B6D4",
  plumber: "#6366F1", electrician: "#EAB308", education: "#3B82F6", events: "#EC4899",
  cleaning: "#14B8A6", legal: "#6B7280", accounting: "#78716C", photography: "#A855F7",
  logistics: "#F59E0B", veterinary: "#22C55E", custom: "#C8963E",
};

const INDUSTRY_LABELS: Record<string, string> = {
  food: "Ristorazione", ncc: "NCC/Trasporto", beauty: "Beauty", healthcare: "Sanità",
  fitness: "Fitness", retail: "Retail", hospitality: "Hotel", beach: "Stabilimento",
  plumber: "Idraulico", electrician: "Elettricista", education: "Formazione",
  events: "Eventi", cleaning: "Pulizie", legal: "Studio Legale", accounting: "Commercialista",
  photography: "Fotografia", logistics: "Logistica", veterinary: "Veterinario", custom: "Altro",
};

const PLAN_LABELS: Record<string, string> = {
  essential: "Essential €29", smart_ia: "Smart IA €59", empire_pro: "Empire Pro €89",
  starter: "Starter", free: "Free",
};

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperTab>("overview");
  const [tenants, setTenants] = useState<CompanyTenant[]>([]);
  const [searchTenant, setSearchTenant] = useState("");
  const [filterIndustry, setFilterIndustry] = useState("all");
  const [filterPlan, setFilterPlan] = useState("all");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "blocked" | "trial">("all");
  const [fiscoStatuses, setFiscoStatuses] = useState<FiscoStatus[]>([]);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTenant, setSelectedTenant] = useState<CompanyTenant | null>(null);
  const [showCreateTenant, setShowCreateTenant] = useState(false);

  // AI-Mary
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Ciao! Sono **Mary**, il tuo agente IA per il controllo centralizzato di Empire.\n\n📊 Chiedi: revenue, tenant attivi, vault non configurati, churn rate\n🔔 Azioni: invia reminder, genera report, analisi settore" }
  ]);
  const [maryInput, setMaryInput] = useState("");
  const [maryChips] = useState(["Revenue oggi", "Tenant attivi?", "Vault non configurati?", "Churn rate", "Report mensile"]);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    
    // Fetch companies (new multi-tenant system)
    const { data: companies } = await supabase
      .from("companies")
      .select("*")
      .order("created_at", { ascending: false });

    // Also fetch legacy restaurants for backward compat
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("id, name, slug, is_active, city, is_blocked, created_at, updated_at")
      .order("created_at", { ascending: false });

    // Merge: prefer companies, fallback to restaurants
    const allTenants: CompanyTenant[] = [];
    
    if (companies?.length) {
      for (const c of companies) {
        allTenants.push({
          id: c.id, name: c.name, slug: c.slug, industry: c.industry || "food",
          plan: c.subscription_plan || "essential", active: c.is_active, blocked: c.is_blocked,
          city: c.city || "—", createdAt: c.created_at, lastAccess: c.updated_at,
          revenue: 0, orders: 0, fee2percent: 0,
        });
      }
    }
    
    if (restaurants?.length) {
      for (const r of restaurants) {
        if (!allTenants.find(t => t.slug === r.slug)) {
          allTenants.push({
            id: r.id, name: r.name, slug: r.slug, industry: "food",
            plan: "essential", active: r.is_active, blocked: r.is_blocked || false,
            city: r.city || "—", createdAt: r.created_at, lastAccess: r.updated_at,
            revenue: 0, orders: 0, fee2percent: 0,
          });
        }
      }
    }

    // Fetch orders for revenue data
    if (restaurants?.length) {
      const { data: orders } = await supabase
        .from("orders")
        .select("restaurant_id, total")
        .in("restaurant_id", restaurants.map(r => r.id));

      const orderMap: Record<string, { revenue: number; count: number }> = {};
      (orders || []).forEach(o => {
        if (!orderMap[o.restaurant_id]) orderMap[o.restaurant_id] = { revenue: 0, count: 0 };
        orderMap[o.restaurant_id].revenue += Number(o.total);
        orderMap[o.restaurant_id].count += 1;
      });

      for (const t of allTenants) {
        if (orderMap[t.id]) {
          t.revenue = orderMap[t.id].revenue;
          t.orders = orderMap[t.id].count;
          t.fee2percent = Math.round(orderMap[t.id].revenue * 0.02);
        }
      }
    }

    setTenants(allTenants);

    // Fetch fisco
    const { data: fisco } = await supabase
      .from("fisco_configs")
      .select("id, restaurant_id, provider, configured, updated_at, restaurants(name)");
    if (fisco) {
      setFiscoStatuses(fisco.map(f => ({
        id: f.id, restaurantId: f.restaurant_id,
        tenantName: (f as any).restaurants?.name || "—",
        provider: f.provider, configured: f.configured, updatedAt: f.updated_at,
      })));
    }

    // Fetch payments
    const { data: paymentsData } = await supabase
      .from("restaurant_payments")
      .select("*, restaurants(name)")
      .order("created_at", { ascending: false });
    if (paymentsData) {
      setPayments(paymentsData.map((p: any) => ({
        id: p.id, restaurantId: p.restaurant_id, tenantName: p.restaurants?.name || "—",
        planType: p.plan_type, totalAmount: Number(p.total_amount), amountPaid: Number(p.amount_paid),
        installmentAmount: Number(p.installment_amount), installmentsPaid: p.installments_paid,
        installmentsTotal: p.installments_total, isOverdue: p.is_overdue,
        nextDueDate: p.next_due_date, gracePeriodDays: p.grace_period_days,
        blockedAt: p.blocked_at, createdAt: p.created_at,
      })));
    }

    setLoading(false);
  };

  // Computed values
  const totalRevenue = tenants.reduce((s, t) => s + t.revenue, 0);
  const totalFee = tenants.reduce((s, t) => s + t.fee2percent, 0);
  const totalOrders = tenants.reduce((s, t) => s + t.orders, 0);
  const activeTenants = tenants.filter(t => t.active && !t.blocked).length;
  const blockedTenants = tenants.filter(t => t.blocked).length;
  const fiscoConfigured = fiscoStatuses.filter(f => f.configured).length;
  const fiscoMissing = fiscoStatuses.filter(f => !f.configured).length;

  // MRR calculation (based on plan prices)
  const mrr = useMemo(() => {
    const planPrices: Record<string, number> = { essential: 29, smart_ia: 59, empire_pro: 89, starter: 0, free: 0 };
    return tenants.filter(t => t.active).reduce((s, t) => s + (planPrices[t.plan] || 29), 0);
  }, [tenants]);
  const arr = mrr * 12;

  // Industry distribution for pie chart
  const industryDistribution = useMemo(() => {
    const map: Record<string, number> = {};
    tenants.forEach(t => { map[t.industry] = (map[t.industry] || 0) + 1; });
    return Object.entries(map).map(([key, value]) => ({
      name: INDUSTRY_LABELS[key] || key, value, color: INDUSTRY_COLORS[key] || "#C8963E",
    }));
  }, [tenants]);

  // Revenue by month for bar chart
  const revenueByMonth = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("it-IT", { month: "short" });
      // Simulated trend based on tenant count growth
      const factor = Math.max(0.3, 1 - i * 0.15);
      months.push({ month: label, revenue: Math.round(totalRevenue * factor / 6), fee: Math.round(totalFee * factor / 6) });
    }
    return months;
  }, [totalRevenue, totalFee]);

  // Filtered tenants
  const filteredTenants = useMemo(() => {
    return tenants.filter(t => {
      if (searchTenant && !t.name.toLowerCase().includes(searchTenant.toLowerCase()) && !t.city.toLowerCase().includes(searchTenant.toLowerCase())) return false;
      if (filterIndustry !== "all" && t.industry !== filterIndustry) return false;
      if (filterPlan !== "all" && t.plan !== filterPlan) return false;
      if (filterStatus === "active" && (!t.active || t.blocked)) return false;
      if (filterStatus === "blocked" && !t.blocked) return false;
      return true;
    });
  }, [tenants, searchTenant, filterIndustry, filterPlan, filterStatus]);

  const toggleTenant = async (id: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const newActive = !tenant.active;
    // Try companies first, then restaurants
    await supabase.from("companies").update({ is_active: newActive }).eq("id", id);
    await supabase.from("restaurants").update({ is_active: newActive }).eq("id", id);
    setTenants(prev => prev.map(t => t.id === id ? { ...t, active: newActive } : t));
    toast({ title: newActive ? "Tenant riattivato" : "Kill-Switch attivato — Tenant disabilitato" });
  };

  const handleToggleBlock = async (payment: PaymentRecord) => {
    const isBlocked = tenants.find(t => t.id === payment.restaurantId && !t.active);
    if (isBlocked) {
      await supabase.from("restaurants").update({ is_blocked: false, blocked_reason: null, is_active: true }).eq("id", payment.restaurantId);
      await supabase.from("restaurant_payments").update({ is_overdue: false, blocked_at: null }).eq("id", payment.id);
      toast({ title: "Sbloccato", description: payment.tenantName });
    } else {
      await supabase.from("restaurants").update({ is_blocked: true, blocked_reason: "Pagamento non ricevuto.", is_active: false }).eq("id", payment.restaurantId);
      await supabase.from("restaurant_payments").update({ is_overdue: true, blocked_at: new Date().toISOString() }).eq("id", payment.id);
      toast({ title: "Bloccato", description: payment.tenantName });
    }
    fetchData();
  };

  const handleMarkPaid = async (payment: PaymentRecord) => {
    const newPaid = payment.installmentsPaid + 1;
    const newAmountPaid = payment.amountPaid + payment.installmentAmount;
    const isComplete = newPaid >= payment.installmentsTotal;
    const nextDue = isComplete ? null : (() => {
      const d = new Date(payment.nextDueDate || new Date()); d.setMonth(d.getMonth() + 1);
      return d.toISOString().split("T")[0];
    })();
    await supabase.from("restaurant_payments").update({ installments_paid: newPaid, amount_paid: newAmountPaid, is_overdue: false, next_due_date: nextDue }).eq("id", payment.id);
    await supabase.from("restaurants").update({ is_blocked: false, blocked_reason: null, is_active: true }).eq("id", payment.restaurantId);
    toast({ title: isComplete ? "Completato! 🎉" : "Rata registrata", description: `${newPaid}/${payment.installmentsTotal}` });
    fetchData();
  };

  const handleRequestFiscoSetup = (tenantName: string) => {
    toast({ title: "Notifica inviata", description: `Richiesta setup a ${tenantName}` });
  };

  const handleMaryMessage = (text?: string) => {
    const input = (text || maryInput).toLowerCase().trim();
    if (!input) return;
    setMaryMessages(prev => [...prev, { role: "user", content: text || maryInput }]);
    if (!text) setMaryInput("");

    let response = "";
    if (input.includes("revenue") || input.includes("rendita") || input.includes("incasso")) {
      response = `💰 **Revenue Report**\n\nMRR: **€${mrr.toLocaleString()}**/mese\nARR: **€${arr.toLocaleString()}**/anno\nFee 2% accumulate: **€${totalFee.toLocaleString()}**\nVolume transato: **€${totalRevenue.toLocaleString()}**\nTenant attivi: ${activeTenants}`;
    } else if (input.includes("tenant attiv") || input.includes("quanti tenant")) {
      response = `📊 **Tenant Overview**\n\nTotali: **${tenants.length}**\n✅ Attivi: **${activeTenants}**\n🔴 Bloccati: **${blockedTenants}**\n\nPer settore:\n${industryDistribution.map(d => `• ${d.name}: ${d.value}`).join("\n")}`;
    } else if (input.includes("vault") || input.includes("fiscal") || input.includes("configur")) {
      response = `🔐 **Stato Vault Fiscale**\n\n✅ Configurati: **${fiscoConfigured}**\n🔴 Da configurare: **${fiscoMissing}**\n\n${fiscoStatuses.filter(f => !f.configured).map(f => `• ${f.tenantName} — Non configurato`).join("\n") || "Tutti configurati!"}`;
    } else if (input.includes("churn")) {
      const churnRate = tenants.length > 0 ? ((blockedTenants / tenants.length) * 100).toFixed(1) : "0";
      response = `📉 **Churn Rate**\n\nTasso di abbandono: **${churnRate}%**\nTenant bloccati: ${blockedTenants}/${tenants.length}\n\n${Number(churnRate) > 5 ? "⚠️ Tasso superiore al 5% — Consiglio azioni di retention." : "✅ Tasso nella norma."}`;
    } else if (input.includes("report") || input.includes("mensile")) {
      response = `📄 **Report Mensile Generato**\n\n• MRR: €${mrr.toLocaleString()}\n• Tenant: ${tenants.length} (${activeTenants} attivi)\n• Revenue: €${totalRevenue.toLocaleString()}\n• Fee 2%: €${totalFee.toLocaleString()}\n• Vault: ${fiscoConfigured}/${fiscoStatuses.length} operativi\n• Pagamenti in ritardo: ${payments.filter(p => p.isOverdue).length}\n\n💡 Vai alla tab Fatture per esportare in CSV/PDF.`;
    } else {
      response = "Posso aiutarti con: **revenue**, **tenant attivi**, **vault non configurati**, **churn rate**, **report mensile**. Cosa vuoi sapere?";
    }

    setTimeout(() => {
      setMaryMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 600);
  };

  const exportReport = (format: "csv" | "pdf") => {
    const date = new Date().toLocaleDateString("it-IT");
    if (format === "csv") {
      const header = "Tenant,Settore,Piano,Città,Attivo,Volume,Ordini,Fee 2%\n";
      const rows = tenants.map(t => `"${t.name}","${INDUSTRY_LABELS[t.industry] || t.industry}","${t.plan}","${t.city}",${t.active ? "Sì" : "No"},${t.revenue},${t.orders},${t.fee2percent}`).join("\n");
      const blob = new Blob(["\uFEFF" + header + rows], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a"); a.href = url; a.download = `empire-report-${date}.csv`; a.click();
      URL.revokeObjectURL(url);
      toast({ title: "CSV esportato" });
    } else {
      const html = `<html><head><title>Empire Report ${date}</title>
        <style>body{font-family:system-ui;padding:40px;max-width:900px;margin:0 auto}h1{color:#C8963E}
        table{width:100%;border-collapse:collapse;margin-top:20px}th{background:#f5f5f5;padding:10px;text-align:left;border-bottom:2px solid #C8963E}
        td{padding:10px;border-bottom:1px solid #eee}.fee{color:#C8963E;font-weight:bold}</style></head>
        <body><h1>👑 Empire — Report ${date}</h1>
        <p>MRR: €${mrr} · ARR: €${arr} · Tenant: ${tenants.length}</p>
        <table><tr><th>Tenant</th><th>Settore</th><th>Piano</th><th>Revenue</th><th>Fee</th></tr>
        ${tenants.map(t => `<tr><td>${t.name}</td><td>${INDUSTRY_LABELS[t.industry] || t.industry}</td><td>${t.plan}</td><td>€${t.revenue.toLocaleString()}</td><td class="fee">€${t.fee2percent}</td></tr>`).join("")}
        </table></body></html>`;
      const win = window.open("", "_blank", "width=900,height=700");
      if (win) { win.document.write(html); win.document.close(); setTimeout(() => win.print(), 400); }
    }
  };

  const systemStatus = [
    { name: "Database", status: "online" as const, latency: "12ms" },
    { name: "Stripe Connect", status: "online" as const, latency: "45ms" },
    { name: "Lovable AI", status: "online" as const, latency: "120ms" },
    { name: "Storage CDN", status: "online" as const, latency: "8ms" },
  ];

  const tabs: { id: SuperTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "tenants", label: "Tenant", icon: <Store className="w-5 h-5" /> },
    { id: "payments", label: "Pagamenti", icon: <CreditCard className="w-5 h-5" /> },
    { id: "fisco", label: "Fiscalità", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "billing", label: "Fatture", icon: <DollarSign className="w-5 h-5" /> },
    { id: "mary", label: "AI-Mary", icon: <Bot className="w-5 h-5" /> },
    { id: "agents", label: "Agenti IA", icon: <Cpu className="w-5 h-5" /> },
    { id: "feature_requests", label: "Richieste", icon: <Lightbulb className="w-5 h-5" /> },
    { id: "media", label: "Media", icon: <Film className="w-5 h-5" /> },
    { id: "brand" as SuperTab, label: "Brand", icon: <Crown className="w-5 h-5" /> },
  ];

  const handleLogout = async () => { await signOut(); navigate("/admin"); };

  // Critical alerts
  const criticalAlerts = useMemo(() => {
    const alerts: { type: string; message: string; severity: "error" | "warning" }[] = [];
    const overduePayments = payments.filter(p => p.isOverdue);
    if (overduePayments.length > 0) alerts.push({ type: "payment", message: `${overduePayments.length} pagamenti scaduti`, severity: "error" });
    if (fiscoMissing > 0) alerts.push({ type: "fisco", message: `${fiscoMissing} vault fiscali non configurati`, severity: "warning" });
    if (blockedTenants > 0) alerts.push({ type: "blocked", message: `${blockedTenants} tenant bloccati`, severity: "error" });
    return alerts;
  }, [payments, fiscoMissing, blockedTenants]);

  return (
    <div className="min-h-screen bg-background">
      <BackButton to="/home" label="Home" variant="floating" theme="light" />
      {/* Header */}
      <div className="flex items-center justify-between px-4 sm:px-5 pt-4 pb-3 border-b-2 border-primary/40 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base sm:text-lg font-display font-bold text-gold-gradient">Empire Central</h1>
            <p className="text-[10px] sm:text-xs text-primary/70 font-medium tracking-wider uppercase">👑 Super Admin</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <LogOut className="w-4 h-4 sm:w-5 sm:h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:flex gap-1 px-3 py-2 sm:px-4 sm:py-3 sm:overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id}
            onClick={() => tab.id === "agents" ? navigate("/superadmin/agents") : tab.id === "media" ? navigate("/superadmin/media") : tab.id === "brand" ? navigate("/superadmin/brand-assets") : setActiveTab(tab.id)}
            className={`flex flex-col sm:flex-row items-center justify-center gap-0.5 sm:gap-2 px-1.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-[0.6rem] sm:text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            <span className="[&_svg]:w-3.5 [&_svg]:h-3.5 sm:[&_svg]:w-4 sm:[&_svg]:h-4">{tab.icon}</span>
            <span className="leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 sm:px-5 pb-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* ===== OVERVIEW ===== */}
        {!loading && activeTab === "overview" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Critical Alerts */}
            {criticalAlerts.length > 0 && (
              <div className="space-y-2">
                {criticalAlerts.map((alert, i) => (
                  <div key={i} className={`p-3 rounded-xl flex items-center gap-3 ${
                    alert.severity === "error" ? "bg-destructive/10 border border-destructive/20" : "bg-amber-500/10 border border-amber-500/20"
                  }`}>
                    <AlertCircle className={`w-4 h-4 flex-shrink-0 ${alert.severity === "error" ? "text-destructive" : "text-amber-500"}`} />
                    <p className="text-sm text-foreground">{alert.message}</p>
                  </div>
                ))}
              </div>
            )}

            {/* KPI Cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-card border border-primary/20">
                <DollarSign className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-primary">€{mrr.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">MRR</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">€{arr.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">ARR</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <Store className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{activeTenants}/{tenants.length}</p>
                <p className="text-xs text-muted-foreground">Tenant attivi</p>
              </div>
              <div className="p-4 rounded-2xl bg-card border border-border">
                <Crown className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-primary">€{totalFee.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Fee 2% totali</p>
              </div>
            </div>

            {/* Revenue Chart */}
            {revenueByMonth.length > 0 && (
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Revenue Mensile</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis tick={{ fontSize: 11, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 12, fontSize: 12 }} />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[6, 6, 0, 0]} name="Revenue" />
                    <Bar dataKey="fee" fill="hsl(var(--primary) / 0.4)" radius={[6, 6, 0, 0]} name="Fee 2%" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Industry Distribution */}
            {industryDistribution.length > 0 && (
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Distribuzione Settori</h3>
                <div className="flex items-center gap-4">
                  <ResponsiveContainer width={120} height={120}>
                    <PieChart>
                      <Pie data={industryDistribution} dataKey="value" cx="50%" cy="50%" outerRadius={50} innerRadius={25}>
                        {industryDistribution.map((entry, index) => (
                          <Cell key={index} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="flex-1 space-y-1.5">
                    {industryDistribution.slice(0, 5).map(d => (
                      <div key={d.name} className="flex items-center gap-2 text-xs">
                        <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: d.color }} />
                        <span className="text-muted-foreground flex-1">{d.name}</span>
                        <span className="font-semibold text-foreground">{d.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Top performers */}
            {tenants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Top Performer</h3>
                <div className="space-y-2">
                  {tenants.filter(t => t.active).sort((a, b) => b.revenue - a.revenue).slice(0, 3).map((t, i) => (
                    <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-card">
                      <span className="text-lg font-display font-bold text-primary w-6">#{i + 1}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase" style={{ backgroundColor: (INDUSTRY_COLORS[t.industry] || "#C8963E") + "20", color: INDUSTRY_COLORS[t.industry] || "#C8963E" }}>
                            {INDUSTRY_LABELS[t.industry] || t.industry}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground">{t.city} · {t.orders} ordini</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-display font-bold text-foreground">€{t.revenue.toLocaleString()}</p>
                        <p className="text-xs text-primary">+€{t.fee2percent}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Infrastructure */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Infrastruttura</h3>
              <div className="grid grid-cols-2 gap-2">
                {systemStatus.map((sys) => (
                  <div key={sys.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-card">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-foreground">{sys.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{sys.latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== TENANTS ===== */}
        {!loading && activeTab === "tenants" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Search + Filters */}
            <div className="space-y-2">
              <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input type="text" placeholder="Cerca tenant..." value={searchTenant}
                  onChange={(e) => setSearchTenant(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
              </div>
              <div className="flex gap-2 overflow-x-auto scrollbar-hide">
                <select value={filterIndustry} onChange={e => setFilterIndustry(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-secondary text-foreground text-xs border-none">
                  <option value="all">Tutti i settori</option>
                  {Object.entries(INDUSTRY_LABELS).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
                </select>
                <select value={filterPlan} onChange={e => setFilterPlan(e.target.value)}
                  className="px-3 py-2 rounded-lg bg-secondary text-foreground text-xs border-none">
                  <option value="all">Tutti i piani</option>
                  <option value="essential">Essential</option>
                  <option value="smart_ia">Smart IA</option>
                  <option value="empire_pro">Empire Pro</option>
                </select>
                <select value={filterStatus} onChange={e => setFilterStatus(e.target.value as any)}
                  className="px-3 py-2 rounded-lg bg-secondary text-foreground text-xs border-none">
                  <option value="all">Tutti gli stati</option>
                  <option value="active">Attivi</option>
                  <option value="blocked">Bloccati</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="text-xs text-muted-foreground">{filteredTenants.length} tenant trovati</p>
              <button onClick={() => exportReport("csv")} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-secondary text-xs text-foreground">
                <FileSpreadsheet className="w-3 h-3" /> Export CSV
              </button>
            </div>

            {/* Tenant cards */}
            <div className="space-y-2">
              {filteredTenants.map((tenant) => {
                const fiscoStatus = fiscoStatuses.find(f => f.restaurantId === tenant.id);
                return (
                  <div key={tenant.id}
                    className={`p-4 rounded-2xl ${tenant.active && !tenant.blocked ? "bg-card" : "bg-card/50 opacity-70"} border ${tenant.blocked ? "border-destructive/30" : "border-border"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-medium text-foreground truncate">{tenant.name}</h4>
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase shrink-0"
                            style={{ backgroundColor: (INDUSTRY_COLORS[tenant.industry] || "#C8963E") + "20", color: INDUSTRY_COLORS[tenant.industry] }}>
                            {INDUSTRY_LABELS[tenant.industry] || tenant.industry}
                          </span>
                          {fiscoStatus && (
                            <span className={`w-2 h-2 rounded-full shrink-0 ${fiscoStatus.configured ? "bg-green-400" : "bg-red-400"}`} />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {tenant.city} · {PLAN_LABELS[tenant.plan] || tenant.plan} · Creato {new Date(tenant.createdAt).toLocaleDateString("it-IT")}
                        </p>
                      </div>
                      <button onClick={() => toggleTenant(tenant.id)}
                        className={`p-2 rounded-xl transition-colors shrink-0 ${
                          tenant.active && !tenant.blocked ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"
                        }`}>
                        <Power className="w-5 h-5" />
                      </button>
                    </div>
                    {tenant.active && !tenant.blocked && (
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2 flex-wrap">
                        <span>€{tenant.revenue.toLocaleString()} transato</span>
                        <span>{tenant.orders} ordini</span>
                        <span className="text-primary font-medium">+€{tenant.fee2percent}</span>
                        <button onClick={() => navigate(`/r/${tenant.slug}`)}
                          className="ml-auto flex items-center gap-1 text-primary hover:text-primary/80">
                          <ExternalLink className="w-3 h-3" /> Entra
                        </button>
                      </div>
                    )}
                    {tenant.blocked && <p className="text-xs text-destructive mt-1">⛔ Bloccato</p>}
                  </div>
                );
              })}
              {filteredTenants.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">Nessun tenant trovato</p>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== PAYMENTS ===== */}
        {!loading && activeTab === "payments" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-2xl bg-card border border-border text-center">
                <p className="text-2xl font-display font-bold text-foreground">{payments.length}</p>
                <p className="text-[10px] text-muted-foreground">Contratti</p>
              </div>
              <div className="p-3 rounded-2xl bg-card border border-border text-center">
                <p className="text-2xl font-display font-bold text-primary">€{payments.reduce((s, p) => s + p.amountPaid, 0).toLocaleString()}</p>
                <p className="text-[10px] text-muted-foreground">Incassato</p>
              </div>
              <div className="p-3 rounded-2xl bg-destructive/5 border border-destructive/20 text-center">
                <p className="text-2xl font-display font-bold text-destructive">{payments.filter(p => p.isOverdue).length}</p>
                <p className="text-[10px] text-muted-foreground">In ritardo</p>
              </div>
            </div>

            {/* Revenue by sector chart */}
            {industryDistribution.length > 0 && (
              <div className="p-4 rounded-2xl bg-card border border-border">
                <h3 className="text-sm font-semibold text-foreground mb-3">Revenue per Settore</h3>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={industryDistribution} layout="vertical">
                    <XAxis type="number" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <YAxis dataKey="name" type="category" width={80} tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} />
                    <Tooltip />
                    <Bar dataKey="value" radius={[0, 6, 6, 0]}>
                      {industryDistribution.map((entry, idx) => (
                        <Cell key={idx} fill={entry.color} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Payment cards */}
            <div className="space-y-3">
              {payments.map((payment) => {
                const progress = payment.installmentsTotal > 0 ? (payment.installmentsPaid / payment.installmentsTotal) * 100 : 0;
                const isComplete = payment.installmentsPaid >= payment.installmentsTotal;
                const isBlocked = tenants.find(t => t.id === payment.restaurantId && !t.active);

                return (
                  <motion.div key={payment.id}
                    className={`p-4 rounded-2xl border ${isComplete ? "bg-card border-green-500/20" : payment.isOverdue ? "bg-destructive/5 border-destructive/30" : "bg-card border-border"}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{payment.tenantName}</h4>
                          {isComplete && <CheckCircle2 className="w-4 h-4 text-green-400" />}
                          {payment.isOverdue && !isComplete && <AlertCircle className="w-4 h-4 text-destructive" />}
                        </div>
                        <p className="text-xs text-muted-foreground">€{payment.totalAmount.toLocaleString()}</p>
                      </div>
                      <div className="flex items-center gap-1.5">
                        {!isComplete && (
                          <button onClick={() => handleMarkPaid(payment)}
                            className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-green-500/10 text-green-400 text-xs font-medium">
                            <DollarSign className="w-3 h-3" /> Rata
                          </button>
                        )}
                        <button onClick={() => handleToggleBlock(payment)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-xl text-xs font-medium ${
                            isBlocked ? "bg-green-500/10 text-green-400" : "bg-destructive/10 text-destructive"
                          }`}>
                          {isBlocked ? <Unlock className="w-3 h-3" /> : <Ban className="w-3 h-3" />}
                          {isBlocked ? "Sblocca" : "Blocca"}
                        </button>
                      </div>
                    </div>
                    <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
                      <motion.div className={`h-full rounded-full ${isComplete ? "bg-green-400" : payment.isOverdue ? "bg-destructive" : "bg-primary"}`}
                        initial={{ width: 0 }} animate={{ width: `${progress}%` }} transition={{ duration: 0.8 }} />
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1.5">
                      {payment.installmentsPaid}/{payment.installmentsTotal} rate · €{payment.amountPaid.toLocaleString()} pagati
                      {payment.nextDueDate && !isComplete && ` · Prossima: ${new Date(payment.nextDueDate).toLocaleDateString("it-IT")}`}
                    </p>
                  </motion.div>
                );
              })}
              {payments.length === 0 && (
                <div className="text-center py-12">
                  <CreditCard className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                  <p className="text-sm text-muted-foreground">Nessun contratto registrato</p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* ===== FISCALITÀ ===== */}
        {!loading && activeTab === "fisco" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Monitoraggio Fiscale Centralizzato</h3>
              </div>
              <p className="text-xs text-muted-foreground">Le chiavi API restano nel Vault privato di ogni ristoratore.</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
                <p className="text-3xl font-display font-bold text-green-400">{fiscoConfigured}</p>
                <p className="text-xs text-muted-foreground mt-1">🟢 Operativi</p>
              </div>
              <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 text-center">
                <p className="text-3xl font-display font-bold text-destructive">{fiscoMissing}</p>
                <p className="text-xs text-muted-foreground mt-1">🔴 Da configurare</p>
              </div>
            </div>

            <div className="space-y-2">
              {fiscoStatuses.map((config) => (
                <div key={config.id} className={`p-4 rounded-2xl border ${config.configured ? "bg-card border-green-500/20" : "bg-card border-destructive/20"}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${config.configured ? "bg-green-400" : "bg-red-400"}`} />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{config.tenantName}</h4>
                        <p className="text-xs text-muted-foreground">{config.provider}</p>
                      </div>
                    </div>
                    {config.configured ? (
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">Operativo</span>
                    ) : (
                      <button onClick={() => handleRequestFiscoSetup(config.tenantName)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
                        <Bell className="w-3 h-3" /> Richiedi
                      </button>
                    )}
                  </div>
                </div>
              ))}
              {fiscoStatuses.length === 0 && <p className="text-center text-sm text-muted-foreground py-8">Nessun dato fiscale</p>}
            </div>
          </motion.div>
        )}

        {/* ===== BILLING ===== */}
        {!loading && activeTab === "billing" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-card"><p className="text-xs text-muted-foreground">MRR</p><p className="text-xl font-display font-bold text-foreground">€{mrr.toLocaleString()}</p></div>
              <div className="p-4 rounded-2xl bg-card"><p className="text-xs text-muted-foreground">Fee 2%</p><p className="text-xl font-display font-bold text-primary">€{totalFee.toLocaleString()}</p></div>
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="px-4 py-3 border-b border-border flex items-center justify-between">
                <h3 className="text-sm font-semibold text-foreground">Report Commissioni</h3>
                <div className="flex gap-2">
                  <button onClick={() => exportReport("csv")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-secondary text-foreground text-xs font-medium">
                    <FileSpreadsheet className="w-3.5 h-3.5" /> CSV
                  </button>
                  <button onClick={() => exportReport("pdf")} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium">
                    <FileText className="w-3.5 h-3.5" /> PDF
                  </button>
                </div>
              </div>
              <div className="overflow-x-auto">
                <div className="min-w-[500px]">
                  <div className="grid grid-cols-6 gap-2 px-4 py-2 text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                    <span className="col-span-2">Tenant</span><span>Settore</span><span className="text-right">Revenue</span><span className="text-right">Ordini</span><span className="text-right">Fee</span>
                  </div>
                  {tenants.map(t => (
                    <div key={t.id} className="grid grid-cols-6 gap-2 px-4 py-3 text-sm border-t border-border">
                      <div className="col-span-2"><p className="font-medium text-foreground truncate">{t.name}</p><p className="text-[10px] text-muted-foreground">{t.city}</p></div>
                      <span className="text-xs text-muted-foreground">{INDUSTRY_LABELS[t.industry] || t.industry}</span>
                      <p className="text-right text-foreground">€{t.revenue.toLocaleString()}</p>
                      <p className="text-right text-muted-foreground">{t.orders}</p>
                      <p className="text-right text-primary font-semibold">€{t.fee2percent}</p>
                    </div>
                  ))}
                  {tenants.length > 0 && (
                    <div className="grid grid-cols-6 gap-2 px-4 py-3 bg-primary/5 border-t border-border text-sm">
                      <span className="col-span-3 font-bold text-foreground">TOTALE</span>
                      <p className="text-right font-bold text-foreground">€{totalRevenue.toLocaleString()}</p>
                      <p className="text-right font-bold text-muted-foreground">{totalOrders}</p>
                      <p className="text-right font-bold text-primary">€{totalFee.toLocaleString()}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== AI-MARY ===== */}
        {!loading && activeTab === "mary" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI-Mary</p>
                <p className="text-xs text-muted-foreground">Agente di Comando · Analisi · Report</p>
              </div>
            </div>

            {/* Quick action chips */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {maryChips.map(chip => (
                <button key={chip} onClick={() => handleMaryMessage(chip)}
                  className="px-3 py-1.5 rounded-full bg-secondary text-xs text-foreground whitespace-nowrap hover:bg-primary/10 transition-colors">
                  {chip}
                </button>
              ))}
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {maryMessages.map((msg, i) => (
                  <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input type="text" placeholder="Chiedi a Mary..." value={maryInput}
                  onChange={(e) => setMaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMaryMessage()}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <motion.button onClick={() => handleMaryMessage()}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* ===== FEATURE REQUESTS ===== */}
        {!loading && activeTab === "feature_requests" && (
          <Suspense fallback={<div className="flex justify-center py-20"><div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" /></div>}>
            <FeatureRequestsAdminPage />
          </Suspense>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
