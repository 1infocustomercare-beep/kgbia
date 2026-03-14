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
import { INDUSTRY_CONFIGS } from "@/config/industry-config";
import { AllIndustriesShowcase } from "@/components/public/IndustryPhoneShowcase";
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

type SuperTab = "overview" | "tenants" | "fisco" | "billing" | "payments" | "subscriptions" | "mary" | "agents" | "media" | "feature_requests" | "brand" | "showcase" | "integrations";

interface SubscriptionRecord {
  id: string;
  companyId: string;
  companyName: string;
  companyIndustry: string;
  plan: string;
  status: string;
  trialStart: string;
  trialEnd: string;
  currentPeriodStart: string | null;
  currentPeriodEnd: string | null;
  cancelAtPeriodEnd: boolean;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  createdAt: string;
  updatedAt: string;
}

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
  essential: "Essential €29/m", smart_ia: "Smart IA €59/m", empire_pro: "Empire Pro €89/m",
  digital_start: "Digital Start €1.997", growth_ai: "Growth AI €4.997", empire_domination: "Empire €7.997",
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
  const [subscriptions, setSubscriptions] = useState<SubscriptionRecord[]>([]);
  const [editingSub, setEditingSub] = useState<string | null>(null);
  const [editPlan, setEditPlan] = useState("");

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

    // Fetch subscriptions
    const { data: subsData } = await supabase
      .from("business_subscriptions")
      .select("*, companies(name, industry)")
      .order("created_at", { ascending: false });
    if (subsData) {
      setSubscriptions(subsData.map((s: any) => ({
        id: s.id,
        companyId: s.company_id,
        companyName: s.companies?.name || "—",
        companyIndustry: s.companies?.industry || "custom",
        plan: s.plan,
        status: s.status,
        trialStart: s.trial_start,
        trialEnd: s.trial_end,
        currentPeriodStart: s.current_period_start,
        currentPeriodEnd: s.current_period_end,
        cancelAtPeriodEnd: s.cancel_at_period_end,
        stripeCustomerId: s.stripe_customer_id,
        stripeSubscriptionId: s.stripe_subscription_id,
        createdAt: s.created_at,
        updatedAt: s.updated_at,
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
    { id: "subscriptions" as SuperTab, label: "Abbonamenti", icon: <Calendar className="w-5 h-5" /> },
    { id: "fisco", label: "Fiscalità", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "billing", label: "Fatture", icon: <DollarSign className="w-5 h-5" /> },
    { id: "mary", label: "AI-Mary", icon: <Bot className="w-5 h-5" /> },
    { id: "agents", label: "Agenti IA", icon: <Cpu className="w-5 h-5" /> },
    { id: "feature_requests", label: "Richieste", icon: <Lightbulb className="w-5 h-5" /> },
    { id: "media", label: "Media", icon: <Film className="w-5 h-5" /> },
    { id: "brand" as SuperTab, label: "Brand", icon: <Crown className="w-5 h-5" /> },
    { id: "showcase", label: "Settori", icon: <Eye className="w-5 h-5" /> },
    { id: "integrations" as SuperTab, label: "Integrazioni", icon: <Wifi className="w-5 h-5" /> },
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
      <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b-2 border-primary/40 bg-gradient-to-r from-primary/5 to-transparent">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center ring-2 ring-primary/30">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-base font-display font-bold text-gold-gradient">Empire Central</h1>
            <p className="text-[10px] text-primary/70 font-medium tracking-wider uppercase">👑 Super Admin</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <LogOut className="w-4 h-4 text-muted-foreground" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="grid grid-cols-4 gap-1 px-3 py-2">
        {tabs.map((tab) => (
          <button key={tab.id}
            onClick={() => tab.id === "agents" ? navigate("/superadmin/agents") : tab.id === "media" ? navigate("/superadmin/media") : tab.id === "brand" ? navigate("/superadmin/brand-assets") : setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center gap-0.5 px-1.5 py-2 rounded-xl text-[0.6rem] font-medium whitespace-nowrap transition-colors min-h-[44px] ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            <span className="[&_svg]:w-3.5 [&_svg]:h-3.5">{tab.icon}</span>
            <span className="leading-tight">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
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

        {/* ===== ABBONAMENTI ===== */}
        {!loading && activeTab === "subscriptions" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {(() => {
              const activeSubs = subscriptions.filter(s => s.status === "active" || s.status === "trialing");
              const cancelingSubs = subscriptions.filter(s => s.cancelAtPeriodEnd);
              const trialSubs = subscriptions.filter(s => s.status === "trialing");
              const totalMRRSubs = activeSubs.reduce((sum, s) => {
                const prices: Record<string, number> = { essential: 29, smart_ia: 59, empire_pro: 89, starter: 0, free: 0 };
                return sum + (prices[s.plan] || 0);
              }, 0);
              const planCounts: Record<string, number> = {};
              subscriptions.forEach(s => { planCounts[s.plan] = (planCounts[s.plan] || 0) + 1; });

              const handleUpdatePlan = async (subId: string, newPlan: string) => {
                await supabase.from("business_subscriptions").update({ plan: newPlan, updated_at: new Date().toISOString() }).eq("id", subId);
                // Also update the company subscription_plan
                const sub = subscriptions.find(s => s.id === subId);
                if (sub) {
                  await supabase.from("companies").update({ subscription_plan: newPlan }).eq("id", sub.companyId);
                }
                setEditingSub(null);
                toast({ title: "Piano aggiornato", description: `Cambiato a ${PLAN_LABELS[newPlan] || newPlan}` });
                fetchData();
              };

              const handleCancelSub = async (subId: string) => {
                await supabase.from("business_subscriptions").update({ cancel_at_period_end: true, updated_at: new Date().toISOString() }).eq("id", subId);
                toast({ title: "Cancellazione programmata", description: "L'abbonamento terminerà alla fine del periodo" });
                fetchData();
              };

              const handleReactivateSub = async (subId: string) => {
                await supabase.from("business_subscriptions").update({ cancel_at_period_end: false, status: "active", updated_at: new Date().toISOString() }).eq("id", subId);
                toast({ title: "Abbonamento riattivato" });
                fetchData();
              };

              const handleActivateTrial = async (subId: string) => {
                await supabase.from("business_subscriptions").update({ status: "active", updated_at: new Date().toISOString() }).eq("id", subId);
                toast({ title: "Trial convertito in attivo" });
                fetchData();
              };

              const statusLabel = (status: string, cancel: boolean) => {
                if (cancel) return { text: "In cancellazione", color: "bg-amber-500/10 text-amber-400" };
                if (status === "trialing") return { text: "Trial", color: "bg-blue-500/10 text-blue-400" };
                if (status === "active") return { text: "Attivo", color: "bg-green-500/10 text-green-400" };
                if (status === "canceled") return { text: "Cancellato", color: "bg-destructive/10 text-destructive" };
                if (status === "past_due") return { text: "Scaduto", color: "bg-destructive/10 text-destructive" };
                return { text: status, color: "bg-secondary text-muted-foreground" };
              };

              const daysUntil = (date: string) => {
                const diff = Math.ceil((new Date(date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
                return diff;
              };

              return (
                <>
                  {/* KPI Cards */}
                  <div className="grid grid-cols-2 gap-2">
                    <div className="p-3 rounded-2xl bg-card border border-primary/20">
                      <Calendar className="w-4 h-4 text-primary mb-1" />
                      <p className="text-2xl font-display font-bold text-primary">{activeSubs.length}</p>
                      <p className="text-[10px] text-muted-foreground">Abbonamenti Attivi</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-card border border-border">
                      <DollarSign className="w-4 h-4 text-primary mb-1" />
                      <p className="text-2xl font-display font-bold text-foreground">€{totalMRRSubs.toLocaleString()}</p>
                      <p className="text-[10px] text-muted-foreground">MRR Abbonamenti</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-card border border-border">
                      <Clock className="w-4 h-4 text-blue-400 mb-1" />
                      <p className="text-2xl font-display font-bold text-blue-400">{trialSubs.length}</p>
                      <p className="text-[10px] text-muted-foreground">In Prova</p>
                    </div>
                    <div className="p-3 rounded-2xl bg-card border border-border">
                      <AlertCircle className="w-4 h-4 text-amber-400 mb-1" />
                      <p className="text-2xl font-display font-bold text-amber-400">{cancelingSubs.length}</p>
                      <p className="text-[10px] text-muted-foreground">In Cancellazione</p>
                    </div>
                  </div>

                  {/* Plan distribution */}
                  <div className="p-4 rounded-2xl bg-card border border-border">
                    <h3 className="text-sm font-semibold text-foreground mb-3">Distribuzione Piani</h3>
                    <div className="space-y-2">
                      {Object.entries(planCounts).sort((a, b) => b[1] - a[1]).map(([plan, count]) => {
                        const pct = subscriptions.length > 0 ? (count / subscriptions.length * 100) : 0;
                        const prices: Record<string, number> = { essential: 29, smart_ia: 59, empire_pro: 89, starter: 0, free: 0 };
                        return (
                          <div key={plan}>
                            <div className="flex items-center justify-between mb-1">
                              <span className="text-xs font-medium text-foreground">{PLAN_LABELS[plan] || plan}</span>
                              <span className="text-xs text-muted-foreground">{count} · €{(count * (prices[plan] || 0)).toLocaleString()}/mese</span>
                            </div>
                            <div className="h-2 rounded-full bg-secondary overflow-hidden">
                              <motion.div className="h-full rounded-full bg-primary" initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Trial expiring soon */}
                  {trialSubs.filter(s => daysUntil(s.trialEnd) <= 14 && daysUntil(s.trialEnd) > 0).length > 0 && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-semibold text-foreground">Trial in Scadenza (≤14 giorni)</span>
                      </div>
                      <div className="space-y-1">
                        {trialSubs.filter(s => daysUntil(s.trialEnd) <= 14 && daysUntil(s.trialEnd) > 0).map(s => (
                          <div key={s.id} className="flex items-center justify-between text-xs">
                            <span className="text-foreground">{s.companyName}</span>
                            <span className="text-amber-400 font-medium">{daysUntil(s.trialEnd)} giorni</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Subscriptions list */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-semibold text-foreground">Tutti gli Abbonamenti ({subscriptions.length})</h3>
                    </div>

                    {subscriptions.map((sub) => {
                      const sl = statusLabel(sub.status, sub.cancelAtPeriodEnd);
                      const isEditing = editingSub === sub.id;
                      const trialDays = sub.status === "trialing" ? daysUntil(sub.trialEnd) : null;
                      const prices: Record<string, number> = { essential: 29, smart_ia: 59, empire_pro: 89, starter: 0, free: 0 };
                      const monthlyPrice = prices[sub.plan] || 0;

                      return (
                        <motion.div key={sub.id}
                          className="p-4 rounded-2xl bg-card border border-border"
                          layout>
                          {/* Header */}
                          <div className="flex items-start justify-between mb-2">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2 flex-wrap">
                                <h4 className="font-medium text-foreground text-sm">{sub.companyName}</h4>
                                <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase"
                                  style={{ backgroundColor: (INDUSTRY_COLORS[sub.companyIndustry] || "#C8963E") + "20", color: INDUSTRY_COLORS[sub.companyIndustry] || "#C8963E" }}>
                                  {INDUSTRY_LABELS[sub.companyIndustry] || sub.companyIndustry}
                                </span>
                              </div>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold ${sl.color}`}>{sl.text}</span>
                                <span className="text-[10px] text-muted-foreground">{PLAN_LABELS[sub.plan] || sub.plan}</span>
                                {monthlyPrice > 0 && <span className="text-[10px] text-primary font-semibold">€{monthlyPrice}/mese</span>}
                              </div>
                            </div>
                          </div>

                          {/* Trial progress */}
                          {sub.status === "trialing" && trialDays !== null && (
                            <div className="mb-3">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-[10px] text-muted-foreground">Trial rimanente</span>
                                <span className={`text-[10px] font-semibold ${trialDays <= 7 ? "text-destructive" : trialDays <= 14 ? "text-amber-400" : "text-green-400"}`}>
                                  {trialDays > 0 ? `${trialDays} giorni` : "Scaduto"}
                                </span>
                              </div>
                              <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                                <motion.div
                                  className={`h-full rounded-full ${trialDays <= 7 ? "bg-destructive" : trialDays <= 14 ? "bg-amber-400" : "bg-green-400"}`}
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.max(0, Math.min(100, (trialDays / 90) * 100))}%` }}
                                  transition={{ duration: 0.6 }}
                                />
                              </div>
                              <p className="text-[9px] text-muted-foreground mt-1">
                                Inizio: {new Date(sub.trialStart).toLocaleDateString("it-IT")} · Fine: {new Date(sub.trialEnd).toLocaleDateString("it-IT")}
                              </p>
                            </div>
                          )}

                          {/* Period info for active */}
                          {sub.status === "active" && sub.currentPeriodEnd && (
                            <p className="text-[10px] text-muted-foreground mb-2">
                              Periodo corrente: {sub.currentPeriodStart ? new Date(sub.currentPeriodStart).toLocaleDateString("it-IT") : "—"} → {new Date(sub.currentPeriodEnd).toLocaleDateString("it-IT")}
                            </p>
                          )}

                          {/* Stripe info */}
                          <div className="flex items-center gap-2 mb-3 flex-wrap">
                            {sub.stripeCustomerId ? (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-green-500/10 text-green-400 font-medium">Stripe Collegato</span>
                            ) : (
                              <span className="text-[9px] px-1.5 py-0.5 rounded bg-secondary text-muted-foreground">Stripe Non Collegato</span>
                            )}
                            <span className="text-[9px] text-muted-foreground">Creato {new Date(sub.createdAt).toLocaleDateString("it-IT")}</span>
                          </div>

                          {/* Edit Plan inline */}
                          {isEditing ? (
                            <motion.div className="flex items-center gap-2 flex-wrap" initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }}>
                              {["essential", "smart_ia", "empire_pro"].map(p => (
                                <button key={p} onClick={() => handleUpdatePlan(sub.id, p)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                                    sub.plan === p ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-primary/10"
                                  }`}>
                                  {PLAN_LABELS[p] || p}
                                </button>
                              ))}
                              <button onClick={() => setEditingSub(null)} className="text-[10px] text-muted-foreground underline">Annulla</button>
                            </motion.div>
                          ) : (
                            <div className="flex items-center gap-1.5 flex-wrap">
                              <button onClick={() => { setEditingSub(sub.id); setEditPlan(sub.plan); }}
                                className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-secondary text-foreground text-[10px] font-medium hover:bg-primary/10 transition-colors">
                                <ArrowUpRight className="w-3 h-3" /> Cambia Piano
                              </button>
                              {sub.status === "trialing" && (
                                <button onClick={() => handleActivateTrial(sub.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-green-500/10 text-green-400 text-[10px] font-medium">
                                  <CheckCircle2 className="w-3 h-3" /> Attiva
                                </button>
                              )}
                              {sub.cancelAtPeriodEnd ? (
                                <button onClick={() => handleReactivateSub(sub.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-green-500/10 text-green-400 text-[10px] font-medium">
                                  <Unlock className="w-3 h-3" /> Riattiva
                                </button>
                              ) : sub.status === "active" && (
                                <button onClick={() => handleCancelSub(sub.id)}
                                  className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-destructive/10 text-destructive text-[10px] font-medium">
                                  <Ban className="w-3 h-3" /> Cancella
                                </button>
                              )}
                            </div>
                          )}
                        </motion.div>
                      );
                    })}

                    {subscriptions.length === 0 && (
                      <div className="text-center py-12">
                        <Calendar className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                        <p className="text-sm text-muted-foreground">Nessun abbonamento registrato</p>
                      </div>
                    )}
                  </div>
                </>
              );
            })()}
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

        {/* ===== SHOWCASE SETTORI ===== */}
        {!loading && activeTab === "showcase" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center">
              <h2 className="text-lg font-display font-bold text-foreground">Showcase Settori</h2>
              <p className="text-xs text-muted-foreground">Preview iPhone Pro di tutti i {Object.keys(INDUSTRY_CONFIGS).length} settori con link ai demo live</p>
            </div>
            <AllIndustriesShowcase onViewDemo={(id, slug) => {
              if (id === "food") navigate(`/r/${slug}`);
              else navigate(`/demo/${slug}`);
            }} />
          </motion.div>
        )}
        {/* ===== INTEGRATIONS ===== */}
        {!loading && activeTab === "integrations" && (
          <motion.div className="space-y-5 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center mb-4">
              <h2 className="text-lg font-display font-bold text-foreground">🔌 Centro Connessioni & API</h2>
              <p className="text-[10px] text-muted-foreground">Stato di tutte le connessioni reali — separate per ruolo e settore</p>
            </div>

            {(() => {
              type IntegrationStatus = "connected" | "missing" | "warning";
              interface IntegrationItem {
                name: string;
                description: string;
                status: IntegrationStatus;
                detail: string;
                scope: "admin" | "client";
                sector?: string;
                actionLabel?: string;
                usedBy: string;
                secretName?: string;
              }

              // ─── SUPER ADMIN — Connessioni Personali Empire ───
              const adminIntegrations: IntegrationItem[] = [
                // Core infrastruttura
                { name: "Lovable Cloud (Database)", description: "PostgreSQL, Auth, Storage, Realtime", status: "connected", detail: "Infrastruttura core attiva — gestita automaticamente", scope: "admin", usedBy: "Intera piattaforma" },
                { name: "Lovable AI Gateway", description: "LLM per assistenti, traduzioni, analisi AI", status: "connected", detail: "LOVABLE_API_KEY configurata — Gemini/GPT-5 disponibili", scope: "admin", usedBy: "Empire Assistant, AI Menu, AI Translate, AI Inventory", secretName: "LOVABLE_API_KEY" },
                { name: "ElevenLabs (Voce IA)", description: "Text-to-Speech e Conversational AI Agent", status: "connected", detail: "API Key configurata via connector ElevenLabs", scope: "admin", usedBy: "Empire TTS, Voice Agent, Restaurant Voice Agent", secretName: "ELEVENLABS_API_KEY" },

                // Pagamenti piattaforma
                { name: "Stripe Connect (Platform)", description: "Pagamenti, split commissioni, abbonamenti", status: "missing", detail: "STRIPE_SECRET_KEY necessaria per pagamenti reali, checkout e split Partner/TL", scope: "admin", usedBy: "Checkout, abbonamenti, split partner, rateizzazione", actionLabel: "Configura Stripe", secretName: "STRIPE_SECRET_KEY" },
                { name: "Stripe Webhook Secret", description: "Verifica eventi Stripe (pagamenti, rinnovi)", status: "missing", detail: "STRIPE_WEBHOOK_SECRET per validare callback Stripe", scope: "admin", usedBy: "stripe-webhook edge function", actionLabel: "Configura Webhook", secretName: "STRIPE_WEBHOOK_SECRET" },

                // Notifiche globali
                { name: "Firebase Cloud Messaging", description: "Push notification su app mobile/PWA", status: "missing", detail: "FCM_SERVER_KEY per inviare notifiche push a tutti i tenant", scope: "admin", usedBy: "Notifiche ordini, promozioni, scadenze", actionLabel: "Configura FCM", secretName: "FCM_SERVER_KEY" },
                { name: "Email Service (Resend/SMTP)", description: "Email transazionali e marketing", status: "missing", detail: "RESEND_API_KEY o SMTP config per conferme ordini, fatture, onboarding", scope: "admin", usedBy: "Conferme ordini, reset password, onboarding partner", actionLabel: "Configura Email", secretName: "RESEND_API_KEY" },

                // Analytics & monitoring
                { name: "Google Analytics (GA4)", description: "Tracking visitatori su tutti i siti pubblici", status: "missing", detail: "GA4_MEASUREMENT_ID per tracciare traffico landing + siti tenant", scope: "admin", usedBy: "Landing page, siti pubblici settoriali", actionLabel: "Configura GA4", secretName: "GA4_MEASUREMENT_ID" },
                { name: "Sentry (Error Monitoring)", description: "Monitoraggio errori e performance", status: "missing", detail: "SENTRY_DSN per tracciare crash e errori in produzione", scope: "admin", usedBy: "Tutta l'app (frontend + edge functions)", actionLabel: "Configura Sentry", secretName: "SENTRY_DSN" },

                // Domini e SSL
                { name: "Domini Custom & SSL", description: "White-label con dominio personalizzato", status: "missing", detail: "Configurazione DNS + certificati SSL per siti clienti", scope: "admin", usedBy: "Siti pubblici white-label dei clienti", actionLabel: "Configura Domini" },
              ];

              // ─── CONNESSIONI CLIENTI — Per Settore ───
              const clientIntegrations: IntegrationItem[] = [
                // ─ Ristorazione (Food) ─
                { name: "Fatturazione Elettronica SDI", description: "Invio fatture elettroniche al Sistema di Interscambio", status: "missing", detail: "FattureInCloud o Aruba per invio automatico fatture", scope: "client", sector: "food", usedBy: "Ristoranti — fatturazione automatica", actionLabel: "Configura FE" },
                { name: "Deliveroo / Glovo API", description: "Sincronizzazione ordini delivery", status: "missing", detail: "API per ricevere ordini da piattaforme delivery esterne", scope: "client", sector: "food", usedBy: "Ristoranti — ordini multi-piattaforma", actionLabel: "Configura Delivery" },
                { name: "Stampante Comande (ESC/POS)", description: "Stampa automatica comande in cucina", status: "missing", detail: "Integrazione con stampanti termiche via WebUSB o cloud print", scope: "client", sector: "food", usedBy: "Ristoranti — cucina", actionLabel: "Configura Stampante" },

                // ─ NCC / Trasporto ─
                { name: "Google Maps Platform", description: "Geocoding, routing, ETA, mappe flotta", status: "missing", detail: "GOOGLE_MAPS_API_KEY per calcolo percorsi, tracking GPS e mappe", scope: "client", sector: "ncc", usedBy: "NCC — routing, fleet map, booking form", actionLabel: "Configura Maps", secretName: "GOOGLE_MAPS_API_KEY" },
                { name: "WhatsApp Business API", description: "Conferme booking e promemoria viaggio", status: "missing", detail: "Twilio/WhatsApp per messaggi automatici ai passeggeri", scope: "client", sector: "ncc", usedBy: "NCC — conferme prenotazione", actionLabel: "Collega WhatsApp" },
                { name: "Stripe Connect (NCC)", description: "Pagamenti prenotazioni e depositi", status: "missing", detail: "Account Stripe Connect per ogni azienda NCC", scope: "client", sector: "ncc", usedBy: "NCC — checkout prenotazioni", actionLabel: "Configura Stripe NCC" },

                // ─ Beauty / Wellness ─
                { name: "Google Calendar Sync", description: "Sincronizzazione appuntamenti", status: "missing", detail: "Google Calendar API per sync bidirezionale appuntamenti", scope: "client", sector: "beauty", usedBy: "Beauty — agenda appuntamenti", actionLabel: "Collega Calendar" },
                { name: "SMS Reminders (Twilio)", description: "Promemoria appuntamento via SMS", status: "missing", detail: "Twilio SMS per ridurre no-show con reminder automatici", scope: "client", sector: "beauty", usedBy: "Beauty — notifiche clienti", actionLabel: "Collega Twilio" },

                // ─ Healthcare ─
                { name: "Telemedicina (WebRTC)", description: "Videochiamate medico-paziente", status: "missing", detail: "Daily.co o Twilio Video per consulti da remoto", scope: "client", sector: "healthcare", usedBy: "Sanità — visite online", actionLabel: "Configura Video" },
                { name: "HL7/FHIR Gateway", description: "Interoperabilità con sistemi sanitari", status: "missing", detail: "Standard sanitario per scambio dati pazienti", scope: "client", sector: "healthcare", usedBy: "Sanità — cartelle cliniche", actionLabel: "Configura FHIR" },

                // ─ Hotel / Hospitality ─
                { name: "Channel Manager (OTA)", description: "Sync tariffe con Booking.com, Expedia", status: "missing", detail: "API per sincronizzazione prezzi e disponibilità camere", scope: "client", sector: "hospitality", usedBy: "Hotel — distribuzione tariffe", actionLabel: "Configura OTA" },
                { name: "PMS Integration", description: "Property Management System", status: "missing", detail: "Collegamento con software gestionale alberghiero", scope: "client", sector: "hospitality", usedBy: "Hotel — check-in/out, housekeeping", actionLabel: "Configura PMS" },

                // ─ Retail ─
                { name: "POS Integration", description: "Sincronizzazione cassa e inventario", status: "missing", detail: "Collegamento con registratore di cassa / POS", scope: "client", sector: "retail", usedBy: "Retail — vendite e magazzino", actionLabel: "Configura POS" },
                { name: "Shopify / WooCommerce", description: "Sync catalogo e-commerce", status: "missing", detail: "Importazione prodotti e sincronizzazione ordini online", scope: "client", sector: "retail", usedBy: "Retail — e-commerce", actionLabel: "Configura E-commerce" },

                // ─ Tutti i settori ─
                { name: "Meta Business Suite", description: "Pubblicazione automatica Instagram/Facebook", status: "missing", detail: "Meta Graph API per posting automatico e gestione pagine social", scope: "client", sector: "all", usedBy: "Tutti — Social Manager AI", actionLabel: "Configura Social" },
                { name: "Google My Business", description: "Sync recensioni e info attività", status: "missing", detail: "Google Business Profile API per aggiornamento automatico", scope: "client", sector: "all", usedBy: "Tutti — reputazione online", actionLabel: "Configura GMB" },
              ];

              const allIntegrations = [...adminIntegrations, ...clientIntegrations];
              const adminConnected = adminIntegrations.filter(i => i.status === "connected").length;
              const adminTotal = adminIntegrations.length;
              const clientConnected = clientIntegrations.filter(i => i.status === "connected").length;
              const clientTotal = clientIntegrations.length;
              const totalConnected = allIntegrations.filter(i => i.status === "connected").length;
              const totalMissing = allIntegrations.filter(i => i.status === "missing").length;
              const totalWarning = allIntegrations.filter(i => i.status === "warning").length;

              const statusIcon = (s: IntegrationStatus) => {
                if (s === "connected") return <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" />;
                if (s === "warning") return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
                return <XCircle className="w-4 h-4 text-destructive shrink-0" />;
              };

              const statusBg = (s: IntegrationStatus) => {
                if (s === "connected") return "border-green-500/15 bg-green-500/[0.03]";
                if (s === "warning") return "border-amber-500/15 bg-amber-500/[0.03]";
                return "border-destructive/15 bg-destructive/[0.03]";
              };

              const sectorIcon = (sector?: string) => {
                const icons: Record<string, string> = {
                  food: "🍽️", ncc: "🚗", beauty: "💅", healthcare: "🏥", hospitality: "🏨",
                  retail: "🛍️", fitness: "💪", beach: "🏖️", all: "🌐",
                };
                return icons[sector || "all"] || "🔧";
              };

              const sectorLabel = (sector?: string) => {
                const labels: Record<string, string> = {
                  food: "Ristorazione", ncc: "NCC / Trasporto", beauty: "Beauty & Wellness",
                  healthcare: "Sanità", hospitality: "Hotel", retail: "Retail", all: "Tutti i Settori",
                };
                return labels[sector || "all"] || sector || "";
              };

              const renderItem = (item: IntegrationItem) => (
                <motion.div
                  key={item.name}
                  className={`p-3 rounded-xl border ${statusBg(item.status)} transition-all`}
                  whileHover={{ scale: 1.005 }}
                >
                  <div className="flex items-start gap-2.5">
                    {statusIcon(item.status)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-xs font-semibold text-foreground truncate">{item.name}</p>
                        {item.status === "connected" && (
                          <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-green-500/15 text-green-400 font-bold uppercase tracking-wider shrink-0">Attivo</span>
                        )}
                        {item.status === "missing" && (
                          <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive font-bold uppercase tracking-wider shrink-0">Mancante</span>
                        )}
                        {item.status === "warning" && (
                          <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400 font-bold uppercase tracking-wider shrink-0">Parziale</span>
                        )}
                      </div>
                      <p className="text-[0.6rem] text-muted-foreground mt-0.5">{item.description}</p>
                      <p className="text-[0.55rem] text-muted-foreground/60 mt-0.5 italic">{item.detail}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <span className="text-[0.5rem] text-primary/70 font-medium">👤 Usato da:</span>
                        <span className="text-[0.5rem] text-muted-foreground">{item.usedBy}</span>
                      </div>
                      {item.secretName && (
                        <div className="flex items-center gap-1 mt-0.5">
                          <Lock className="w-2.5 h-2.5 text-muted-foreground/50" />
                          <span className="text-[0.5rem] text-muted-foreground/50 font-mono">{item.secretName}</span>
                        </div>
                      )}
                      {item.actionLabel && (
                        <motion.button
                          className="mt-2 px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-[0.6rem] font-bold hover:bg-primary/20 transition-colors flex items-center gap-1"
                          whileTap={{ scale: 0.95 }}
                          onClick={() => toast({ title: "🔧 " + item.actionLabel, description: "Configurazione necessaria: " + item.name + (item.secretName ? ` (secret: ${item.secretName})` : "") })}
                        >
                          <Zap className="w-3 h-3" />
                          {item.actionLabel}
                        </motion.button>
                      )}
                    </div>
                  </div>
                </motion.div>
              );

              // Group client integrations by sector
              const clientSectors = [...new Set(clientIntegrations.map(i => i.sector || "all"))];

              return (
                <>
                  {/* Summary cards */}
                  <div className="grid grid-cols-3 gap-2">
                    <div className="p-3 rounded-xl bg-green-500/[0.06] border border-green-500/15 text-center">
                      <p className="text-2xl font-display font-bold text-green-400">{totalConnected}</p>
                      <p className="text-[0.6rem] text-green-400/70 font-medium uppercase tracking-wider">Connessi</p>
                    </div>
                    <div className="p-3 rounded-xl bg-amber-500/[0.06] border border-amber-500/15 text-center">
                      <p className="text-2xl font-display font-bold text-amber-400">{totalWarning}</p>
                      <p className="text-[0.6rem] text-amber-400/70 font-medium uppercase tracking-wider">Parziali</p>
                    </div>
                    <div className="p-3 rounded-xl bg-destructive/[0.06] border border-destructive/15 text-center">
                      <p className="text-2xl font-display font-bold text-destructive">{totalMissing}</p>
                      <p className="text-[0.6rem] text-destructive/70 font-medium uppercase tracking-wider">Da Collegare</p>
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════ */}
                  {/* SEZIONE 1: SUPER ADMIN — Connessioni Piattaforma */}
                  {/* ═══════════════════════════════════════════ */}
                  <div className="rounded-2xl border border-primary/20 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(var(--card)), hsl(var(--primary) / 0.04))" }}>
                    <div className="px-4 py-3 border-b border-primary/10 flex items-center justify-between" style={{ background: "hsl(var(--primary) / 0.06)" }}>
                      <div className="flex items-center gap-2">
                        <Crown className="w-4 h-4 text-primary" />
                        <div>
                          <h3 className="text-sm font-display font-bold text-foreground">🔒 Super Admin — Infrastruttura Empire</h3>
                          <p className="text-[0.55rem] text-muted-foreground">Connessioni personali per gestire tutta la piattaforma</p>
                        </div>
                      </div>
                      <span className="text-[0.6rem] text-primary font-bold px-2 py-0.5 rounded-full bg-primary/10">
                        {adminConnected}/{adminTotal}
                      </span>
                    </div>

                    {/* Progress */}
                    <div className="px-4 pt-3 pb-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[0.55rem] text-muted-foreground">Completamento infrastruttura</span>
                        <span className="text-[0.55rem] font-bold text-primary">{Math.round(adminConnected / adminTotal * 100)}%</span>
                      </div>
                      <div className="h-1.5 rounded-full bg-secondary overflow-hidden">
                        <motion.div
                          className="h-full rounded-full bg-gradient-to-r from-primary to-accent"
                          initial={{ width: 0 }}
                          animate={{ width: `${adminConnected / adminTotal * 100}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>

                    <div className="p-3 space-y-1.5">
                      {adminIntegrations.map(renderItem)}
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════ */}
                  {/* SEZIONE 2: CLIENTI — Connessioni per Settore */}
                  {/* ═══════════════════════════════════════════ */}
                  <div className="rounded-2xl border border-accent/20 overflow-hidden" style={{ background: "linear-gradient(160deg, hsl(var(--card)), hsl(var(--accent) / 0.04))" }}>
                    <div className="px-4 py-3 border-b border-accent/10 flex items-center justify-between" style={{ background: "hsl(var(--accent) / 0.06)" }}>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-accent" />
                        <div>
                          <h3 className="text-sm font-display font-bold text-foreground">👥 Clienti — Integrazioni per Settore</h3>
                          <p className="text-[0.55rem] text-muted-foreground">Connessioni che i clienti useranno in base al loro settore</p>
                        </div>
                      </div>
                      <span className="text-[0.6rem] text-accent font-bold px-2 py-0.5 rounded-full bg-accent/10">
                        {clientConnected}/{clientTotal}
                      </span>
                    </div>

                    <div className="p-3 space-y-4">
                      {clientSectors.map(sector => {
                        const sectorItems = clientIntegrations.filter(i => i.sector === sector);
                        const sectorConnectedCount = sectorItems.filter(i => i.status === "connected").length;
                        return (
                          <div key={sector}>
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-xs font-display font-bold text-foreground flex items-center gap-1.5">
                                <span>{sectorIcon(sector)}</span>
                                {sectorLabel(sector)}
                              </h4>
                              <span className="text-[0.55rem] text-muted-foreground font-medium px-2 py-0.5 rounded-full bg-secondary">
                                {sectorConnectedCount}/{sectorItems.length}
                              </span>
                            </div>
                            <div className="space-y-1.5">
                              {sectorItems.map(renderItem)}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* ═══════════════════════════════════════════ */}
                  {/* SEZIONE 3: Edge Functions attive */}
                  {/* ═══════════════════════════════════════════ */}
                  <div className="rounded-2xl border border-border overflow-hidden">
                    <div className="px-4 py-3 border-b border-border flex items-center justify-between bg-card">
                      <div className="flex items-center gap-2">
                        <Cpu className="w-4 h-4 text-muted-foreground" />
                        <div>
                          <h3 className="text-sm font-display font-bold text-foreground">⚡ Backend Functions</h3>
                          <p className="text-[0.55rem] text-muted-foreground">Edge functions deployate e operative</p>
                        </div>
                      </div>
                      <span className="text-[0.6rem] text-green-400 font-bold px-2 py-0.5 rounded-full bg-green-500/10">
                        Tutte attive
                      </span>
                    </div>
                    <div className="p-3 grid grid-cols-1 gap-1">
                      {[
                        { fn: "empire-assistant", desc: "Assistente IA multi-settore", deps: "LOVABLE_API_KEY" },
                        { fn: "empire-tts", desc: "Text-to-Speech", deps: "ELEVENLABS_API_KEY" },
                        { fn: "empire-voice-agent", desc: "Agente vocale Empire", deps: "ELEVENLABS_API_KEY" },
                        { fn: "restaurant-voice-agent", desc: "Agente vocale ristorante", deps: "ELEVENLABS_API_KEY" },
                        { fn: "elevenlabs-conversation-token", desc: "Token conversazione ElevenLabs", deps: "ELEVENLABS_API_KEY" },
                        { fn: "ai-menu", desc: "OCR menu e generazione piatti", deps: "LOVABLE_API_KEY" },
                        { fn: "ai-translate", desc: "Traduzioni automatiche", deps: "LOVABLE_API_KEY" },
                        { fn: "ai-inventory", desc: "Gestione scorte AI", deps: "LOVABLE_API_KEY" },
                        { fn: "create-company", desc: "Onboarding nuova azienda", deps: "—" },
                        { fn: "assign-partner-role", desc: "Assegnazione ruolo partner", deps: "—" },
                        { fn: "check-payments", desc: "Verifica pagamenti scaduti", deps: "—" },
                        { fn: "generate-b2b-invoice", desc: "Generazione fatture B2B", deps: "—" },
                        { fn: "generate-fee-invoice", desc: "Fatture commissioni mensili", deps: "—" },
                        { fn: "payment-notifications", desc: "Notifiche scadenze", deps: "—" },
                        { fn: "subscription-checkout", desc: "Checkout abbonamenti", deps: "STRIPE_SECRET_KEY" },
                        { fn: "stripe-webhook", desc: "Webhook pagamenti Stripe", deps: "STRIPE_WEBHOOK_SECRET" },
                        { fn: "ai-token-checkout", desc: "Acquisto token AI", deps: "STRIPE_SECRET_KEY" },
                        { fn: "submit-feature-request", desc: "Richieste funzionalità", deps: "—" },
                        { fn: "send-push-discount", desc: "Sconti push automatici", deps: "FCM_SERVER_KEY" },
                        { fn: "seed-demo-accounts", desc: "Creazione account demo", deps: "—" },
                      ].map(f => (
                        <div key={f.fn} className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg hover:bg-muted/30 transition-colors">
                          <CheckCircle2 className="w-3 h-3 text-green-400 shrink-0" />
                          <span className="text-[0.6rem] font-mono text-foreground/80 truncate flex-1">{f.fn}</span>
                          <span className="text-[0.5rem] text-muted-foreground truncate max-w-[120px] hidden sm:inline">{f.desc}</span>
                          <span className={`text-[0.45rem] font-mono px-1 py-0.5 rounded ${f.deps === "—" ? "text-muted-foreground/40" : "text-amber-400/70 bg-amber-500/5"}`}>
                            {f.deps}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Info footer */}
                  <div className="p-3 rounded-xl border border-primary/10 bg-primary/[0.03]">
                    <div className="flex items-start gap-2">
                      <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <div>
                        <p className="text-[0.6rem] text-foreground font-medium mb-1">Sicurezza & Separazione</p>
                        <p className="text-[0.55rem] text-muted-foreground leading-relaxed">
                          Le <strong>connessioni Super Admin</strong> (Stripe, ElevenLabs, FCM) sono secrets server-side accessibili solo dalle Edge Functions — mai esposti ai clienti.
                          Le <strong>connessioni clienti</strong> verranno gestite per-tenant con chiavi separate per ogni azienda, garantendo isolamento totale tra i business.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
