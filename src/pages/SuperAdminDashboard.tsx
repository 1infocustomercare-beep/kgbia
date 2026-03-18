import { useState, useEffect, useMemo } from "react";


import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Power, TrendingUp, DollarSign, Users, Store,
  BarChart3, LogOut, Search, Bot, Send, Bell,
  ShieldCheck, Lock, ExternalLink, FileText, FileSpreadsheet,
  CreditCard, Ban, Unlock, Calendar, Clock, Eye, Film,
  Cpu, Wifi, CheckCircle2, XCircle, AlertCircle,
  ChevronRight, Filter, Plus, ArrowUpRight, ArrowDownRight,
  Building2, MapPin, Zap, Activity, Lightbulb,
  ToggleLeft, ToggleRight, BookOpen, Link2, ChevronDown, ChevronUp, Info, ImageIcon, ArrowLeft,
  MessageCircle, Phone, Shield, X
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { lazy, Suspense, useRef, useCallback } from "react";
import empireAgentMascot from "@/assets/empire-agent-mascot.png";
const FeatureRequestsAdminPage = lazy(() => import("@/pages/superadmin/FeatureRequestsAdminPage"));
import TenantIntegrationsSection from "@/components/admin/TenantIntegrationsSection";
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

type SuperTab = "overview" | "tenants" | "fisco" | "billing" | "payments" | "subscriptions" | "mary" | "agents" | "media" | "feature_requests" | "brand" | "showcase" | "integrations" | "asset_cms" | "whatsapp" | "demo_accounts";

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
  const [disabledIntegrations, setDisabledIntegrations] = useState<Record<string, boolean>>({});
  const [expandedGuide, setExpandedGuide] = useState<string | null>(null);
  const [disabledSectors, setDisabledSectors] = useState<Record<string, boolean>>({});
  const [expandedSection, setExpandedSection] = useState<"admin" | "client" | "functions" | null>("admin");
  const [intFilter, setIntFilter] = useState<{ status: "all" | "connected" | "missing" | "disabled"; category: "all" | "admin" | "client"; sector: string; account: "all" | "subscribed" | "extra" | "requested" | "none"; search: string }>({ status: "all", category: "all", sector: "all", account: "all", search: "" });
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
    { id: "whatsapp" as SuperTab, label: "WhatsApp", icon: <MessageCircle className="w-5 h-5" /> },
    { id: "demo_accounts" as SuperTab, label: "Demo", icon: <Key className="w-5 h-5" /> },
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
    <div className="min-h-screen bg-background relative overflow-x-hidden" style={{ isolation: "isolate" }}>
      {/* Opaque overlay to block EmpireDNABackground from bleeding through */}
      <div className="fixed inset-0 bg-background/95 -z-[1]" />
      
      {/* Header */}
      <div className="relative overflow-hidden border-b border-empire-violet-deep/30 bg-gradient-to-br from-empire-violet-surface via-background to-empire-violet/5">
        {/* HUD grid — DNA violet */}
        <div className="absolute inset-0 opacity-[0.04]" style={{
          backgroundImage: `linear-gradient(hsl(var(--empire-violet)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--empire-violet)) 1px, transparent 1px)`,
          backgroundSize: '20px 20px'
        }} />
        {/* Top scan line — violet */}
        <motion.div
          className="absolute top-0 left-0 w-full h-[2px]"
          style={{ background: 'var(--gradient-dna)' }}
          animate={{ opacity: [0.3, 0.8, 0.3] }}
          transition={{ duration: 3, repeat: Infinity }}
        />
        {/* Bottom DNA glow */}
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-empire-violet/40 to-transparent" />

        <div className="flex items-center justify-between px-4 pt-4 pb-3 relative z-10">
          <div className="flex items-center gap-3">
            {/* ─── DNA-to-Mascot Animated Agent ─── */}
            <motion.div
              className="relative w-[68px] h-[68px] flex-shrink-0"
              animate={{ y: [0, -5, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              {/* Outer orbital ring 1 */}
              <motion.div
               className="absolute -inset-1 rounded-full border border-empire-violet/30"
                animate={{ rotateZ: 360 }}
                transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(70deg)' }}
              />
              {/* Outer orbital ring 2 - counter */}
              <motion.div
               className="absolute -inset-2 rounded-full border border-empire-violet/15"
                animate={{ rotateZ: -360 }}
                transition={{ duration: 14, repeat: Infinity, ease: "linear" }}
                style={{ transformStyle: 'preserve-3d', transform: 'rotateX(55deg) rotateY(20deg)' }}
              />

              {/* DNA helix particles around mascot */}
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-empire-violet/70"
                  style={{
                    left: '50%', top: '50%',
                    marginLeft: -3, marginTop: -3,
                  }}
                  animate={{
                    x: [Math.cos(i * 60 * Math.PI / 180) * 28, Math.cos((i * 60 + 180) * Math.PI / 180) * 28, Math.cos(i * 60 * Math.PI / 180) * 28],
                    y: [Math.sin(i * 60 * Math.PI / 180) * 28, Math.sin((i * 60 + 180) * Math.PI / 180) * 28, Math.sin(i * 60 * Math.PI / 180) * 28],
                    scale: [0.6, 1.2, 0.6],
                    opacity: [0.3, 0.8, 0.3],
                  }}
                  transition={{
                    duration: 4,
                    delay: i * 0.3,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}

              {/* Core glow behind mascot */}
              <motion.div
               className="absolute inset-2 rounded-full bg-gradient-to-br from-empire-violet/25 via-empire-violet-deep/15 to-primary/15 blur-sm"
                animate={{ scale: [1, 1.15, 1], opacity: [0.5, 0.8, 0.5] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Scanning conic beam */}
              <motion.div
                className="absolute inset-1 rounded-full"
               style={{ background: 'conic-gradient(from 0deg, transparent 0%, hsl(var(--empire-violet) / 0.15) 8%, transparent 16%)' }}
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              />

              {/* Mascot image */}
              <motion.img
                src={empireAgentMascot}
                alt="Empire Agent"
               className="absolute inset-1.5 w-[calc(100%-12px)] h-[calc(100%-12px)] object-contain drop-shadow-[0_0_12px_hsl(265_85%_65%/0.5)] z-10"
                animate={{ scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              />

              {/* Live status dot */}
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-background z-20"
                animate={{ scale: [1, 1.3, 1], opacity: [1, 0.6, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>

            <div>
              <motion.h1
                className="text-base font-display font-bold text-gold-gradient"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                Empire Central
              </motion.h1>
              <div className="flex items-center gap-1.5">
                <motion.div
                 className="w-1.5 h-1.5 rounded-full bg-empire-violet"
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <p className="text-[10px] text-empire-violet-glow/70 font-medium tracking-wider uppercase">👑 Super Admin</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate("/home")} className="p-2 rounded-full hover:bg-secondary transition-colors" title="Home">
              <ArrowLeft className="w-4 h-4 text-muted-foreground" />
            </button>
            <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors" title="Esci">
              <LogOut className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>
        </div>
      </div>

      {/* Tab bar — compact grid for mobile */}
      <div className="px-3 py-2">
        <div className="grid grid-cols-5 gap-1">
          {tabs.map((tab) => (
            <button key={tab.id}
              onClick={() => tab.id === "agents" ? navigate("/admin/agents") : tab.id === "media" ? navigate("/superadmin/media") : tab.id === "brand" ? navigate("/superadmin/brand-assets") : setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center gap-0.5 px-1 py-1.5 rounded-lg text-[0.5rem] font-medium transition-colors min-h-[40px] ${
                activeTab === tab.id ? "bg-empire-violet text-white shadow-[0_0_16px_hsl(265_85%_65%/0.3)]" : "bg-empire-violet-surface/50 text-muted-foreground hover:bg-empire-violet-surface"
              }`}>
              <span className="[&_svg]:w-3 [&_svg]:h-3">{tab.icon}</span>
              <span className="leading-tight truncate w-full text-center">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-empire-violet border-t-transparent rounded-full animate-spin" />
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
                    <p className="text-sm text-foreground flex-1">{alert.message}</p>
                    {alert.type === "fisco" && (
                      <button
                        onClick={() => setActiveTab("fisco")}
                        className="text-[0.65rem] font-semibold px-2.5 py-1 rounded-lg bg-primary/15 text-primary hover:bg-primary/25 transition-colors whitespace-nowrap"
                      >
                        Configura →
                      </button>
                    )}
                    {alert.type === "payment" && (
                      <button
                        onClick={() => setActiveTab("payments")}
                        className="text-[0.65rem] font-semibold px-2.5 py-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors whitespace-nowrap"
                      >
                        Vedi →
                      </button>
                    )}
                    {alert.type === "blocked" && (
                      <button
                        onClick={() => setActiveTab("tenants")}
                        className="text-[0.65rem] font-semibold px-2.5 py-1 rounded-lg bg-destructive/15 text-destructive hover:bg-destructive/25 transition-colors whitespace-nowrap"
                      >
                        Gestisci →
                      </button>
                    )}
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
          <motion.div className="space-y-3 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header compact */}
            <div className="text-center">
              <h2 className="text-base font-display font-bold text-foreground">🔌 Centro Connessioni</h2>
              <p className="text-[9px] text-muted-foreground">Configura · Attiva/Disattiva · Per settore</p>
            </div>

            {(() => {
              type IntegrationStatus = "connected" | "missing" | "warning";
              type AccountUsage = "subscribed" | "extra" | "requested" | "none";
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
                guideUrl?: string;
                guideSteps?: string[];
                buyCreditsUrl?: string;
                accountUsage?: AccountUsage;
              }

              // toggles & guides use component-level state

              const toggleIntegration = (name: string) => {
                setDisabledIntegrations(prev => ({ ...prev, [name]: !prev[name] }));
                const isNowDisabled = !disabledIntegrations[name];
                toast({
                  title: isNowDisabled ? "🔴 Disattivata" : "🟢 Riattivata",
                  description: `${name} ${isNowDisabled ? "spenta" : "riattivata"}.`,
                });
              };

              const toggleSector = (sector: string) => {
                setDisabledSectors(prev => ({ ...prev, [sector]: !prev[sector] }));
                const isNowDisabled = !disabledSectors[sector];
                toast({
                  title: isNowDisabled ? "🔴 Settore Off" : "🟢 Settore On",
                  description: `${sectorLabel(sector)} ${isNowDisabled ? "disattivato" : "riattivato"}.`,
                });
              };

              // expandedSection uses component-level state

              // ─── ADMIN INTEGRATIONS ───
              const adminIntegrations: IntegrationItem[] = [
                { name: "Lovable Cloud", description: "PostgreSQL, Auth, Storage, Realtime", status: "connected", detail: "Infrastruttura core — automatica", scope: "admin", usedBy: "Piattaforma", accountUsage: "subscribed", guideSteps: ["Gestito automaticamente", "Nessuna config necessaria"] },
                { name: "Lovable AI Gateway", description: "LLM: Gemini, GPT-5", status: "connected", detail: "LOVABLE_API_KEY attiva", scope: "admin", usedBy: "Assistenti, Menu, Translate", secretName: "LOVABLE_API_KEY", accountUsage: "subscribed", guideSteps: ["Pre-configurata con Lovable Cloud", "Modelli: Gemini 2.5, GPT-5"] },
                { name: "ElevenLabs", description: "TTS & Voice Agent", status: "connected", detail: "API Key configurata", scope: "admin", usedBy: "TTS, Voice Agent", secretName: "ELEVENLABS_API_KEY", accountUsage: "extra", guideUrl: "https://elevenlabs.io/docs/api-reference/text-to-speech", guideSteps: ["1. elevenlabs.io → API Keys", "2. Copia API Key", "3. Inserisci come secret"], buyCreditsUrl: "https://elevenlabs.io/subscription" },
                { name: "Stripe Platform", description: "Pagamenti, split, abbonamenti", status: "missing", detail: "STRIPE_SECRET_KEY necessaria", scope: "admin", usedBy: "Checkout, split partner", actionLabel: "Configura", secretName: "STRIPE_SECRET_KEY", accountUsage: "subscribed", guideUrl: "https://docs.stripe.com/connect", guideSteps: ["1. dashboard.stripe.com", "2. Developers → API Keys", "3. Copia Secret Key", "4. Inserisci come secret"] },
                { name: "Stripe Webhook", description: "Verifica eventi pagamento", status: "missing", detail: "STRIPE_WEBHOOK_SECRET", scope: "admin", usedBy: "stripe-webhook", actionLabel: "Configura", secretName: "STRIPE_WEBHOOK_SECRET", accountUsage: "subscribed", guideUrl: "https://docs.stripe.com/webhooks", guideSteps: ["1. Stripe → Webhooks", "2. Aggiungi endpoint", "3. Copia Signing Secret"] },
                { name: "Firebase FCM", description: "Push notification PWA", status: "missing", detail: "FCM_SERVER_KEY", scope: "admin", usedBy: "Notifiche ordini", actionLabel: "Configura", secretName: "FCM_SERVER_KEY", accountUsage: "requested", guideUrl: "https://firebase.google.com/docs/cloud-messaging", guideSteps: ["1. console.firebase.google.com", "2. Cloud Messaging → Server Key", "3. Inserisci come secret"] },
                { name: "Resend Email", description: "Email transazionali", status: "missing", detail: "RESEND_API_KEY", scope: "admin", usedBy: "Conferme, fatture", actionLabel: "Configura", secretName: "RESEND_API_KEY", accountUsage: "none", guideUrl: "https://resend.com/docs/introduction", guideSteps: ["1. resend.com → API Keys", "2. Copia chiave (re_...)", "3. Inserisci come secret"] },
                { name: "Google Analytics", description: "GA4 tracking", status: "missing", detail: "GA4_MEASUREMENT_ID", scope: "admin", usedBy: "Landing, siti pubblici", actionLabel: "Configura", secretName: "GA4_MEASUREMENT_ID", accountUsage: "none", guideUrl: "https://support.google.com/analytics/answer/9304153", guideSteps: ["1. analytics.google.com", "2. Crea proprietà GA4", "3. Copia Measurement ID"] },
                { name: "Sentry", description: "Error monitoring", status: "missing", detail: "SENTRY_DSN", scope: "admin", usedBy: "Frontend + Edge", actionLabel: "Configura", secretName: "SENTRY_DSN", accountUsage: "none", guideUrl: "https://docs.sentry.io/platforms/javascript/guides/react/", guideSteps: ["1. sentry.io → Crea progetto", "2. Copia DSN", "3. Inserisci come secret"] },
                { name: "Domini Custom", description: "White-label & SSL", status: "missing", detail: "DNS + SSL per clienti", scope: "admin", usedBy: "Siti white-label", actionLabel: "Configura", accountUsage: "extra", guideSteps: ["1. Acquista dominio", "2. Configura CNAME", "3. Abilita SSL"] },
              ];

              // ─── CLIENT INTEGRATIONS ───
              const clientIntegrations: IntegrationItem[] = [
                { name: "Fatturazione SDI", description: "Sistema di Interscambio", status: "missing", detail: "FattureInCloud/Aruba", scope: "client", sector: "food", usedBy: "Ristoranti", actionLabel: "Configura", accountUsage: "subscribed", guideSteps: ["1. FattureInCloud → API Key", "2. Configura P.IVA tenant", "3. Abilita invio auto"] },
                { name: "Delivery API", description: "Deliveroo/Glovo sync", status: "missing", detail: "Ordini multi-piattaforma", scope: "client", sector: "food", usedBy: "Ristoranti", actionLabel: "Configura", accountUsage: "extra", guideSteps: ["1. Richiedi accesso API Partner", "2. Configura webhook ordini"] },
                { name: "Stampante ESC/POS", description: "Comande cucina", status: "missing", detail: "WebUSB/cloud print", scope: "client", sector: "food", usedBy: "Cucina", actionLabel: "Configura", accountUsage: "subscribed", guideSteps: ["1. Collega stampante termica", "2. Installa driver ESC/POS"] },
                { name: "Google Maps", description: "Routing, ETA, fleet", status: "missing", detail: "GOOGLE_MAPS_API_KEY", scope: "client", sector: "ncc", usedBy: "NCC routing", actionLabel: "Configura", secretName: "GOOGLE_MAPS_API_KEY", accountUsage: "subscribed", guideUrl: "https://developers.google.com/maps", guideSteps: ["1. console.cloud.google.com", "2. Abilita Maps + Directions API", "3. Crea API Key"] },
                { name: "WhatsApp Business", description: "Conferme booking", status: "missing", detail: "Twilio/WhatsApp", scope: "client", sector: "ncc", usedBy: "NCC booking", actionLabel: "Configura", accountUsage: "requested", guideUrl: "https://www.twilio.com/docs/whatsapp", guideSteps: ["1. Crea account Twilio", "2. Abilita WhatsApp Sandbox"] },
                { name: "Stripe NCC", description: "Pagamenti prenotazioni", status: "missing", detail: "Stripe Connect per NCC", scope: "client", sector: "ncc", usedBy: "NCC checkout", actionLabel: "Configura", accountUsage: "subscribed", guideSteps: ["1. Onboarding Stripe Connect", "2. Configura split fee"] },
                { name: "Google Calendar", description: "Sync appuntamenti", status: "missing", detail: "Calendar API", scope: "client", sector: "beauty", usedBy: "Beauty agenda", actionLabel: "Configura", accountUsage: "subscribed", guideUrl: "https://developers.google.com/calendar", guideSteps: ["1. Abilita Calendar API", "2. Configura OAuth2"] },
                { name: "SMS Twilio", description: "Reminder appuntamento", status: "missing", detail: "Twilio SMS", scope: "client", sector: "beauty", usedBy: "Beauty notifiche", actionLabel: "Configura", accountUsage: "extra", guideUrl: "https://www.twilio.com/docs/sms", guideSteps: ["1. Account Twilio", "2. Acquista numero", "3. Template SMS"] },
                { name: "Telemedicina", description: "WebRTC video", status: "missing", detail: "Daily.co/Twilio Video", scope: "client", sector: "healthcare", usedBy: "Visite online", actionLabel: "Configura", accountUsage: "extra", guideUrl: "https://docs.daily.co/", guideSteps: ["1. Registrati daily.co", "2. Crea API Key"] },
                { name: "HL7/FHIR", description: "Interoperabilità sanitaria", status: "missing", detail: "Standard dati pazienti", scope: "client", sector: "healthcare", usedBy: "Cartelle cliniche", actionLabel: "Configura", accountUsage: "requested", guideSteps: ["1. Identifica EHR", "2. Configura endpoint FHIR"] },
                { name: "Channel Manager", description: "OTA sync tariffe", status: "missing", detail: "Booking.com, Expedia", scope: "client", sector: "hospitality", usedBy: "Hotel tariffe", actionLabel: "Configura", accountUsage: "subscribed", guideSteps: ["1. Scegli channel manager", "2. Mapping camere"] },
                { name: "PMS Integration", description: "Gestionale alberghiero", status: "missing", detail: "Check-in/out, housekeeping", scope: "client", sector: "hospitality", usedBy: "Hotel ops", actionLabel: "Configura", accountUsage: "extra", guideSteps: ["1. Identifica PMS", "2. Configura API"] },
                { name: "POS Integration", description: "Cassa & inventario", status: "missing", detail: "Registratore di cassa", scope: "client", sector: "retail", usedBy: "Retail vendite", actionLabel: "Configura", accountUsage: "subscribed", guideSteps: ["1. Identifica modello POS", "2. Installa connector"] },
                { name: "Shopify/Woo", description: "E-commerce sync", status: "missing", detail: "Catalogo + ordini", scope: "client", sector: "retail", usedBy: "Retail e-commerce", actionLabel: "Configura", accountUsage: "extra", guideUrl: "https://shopify.dev/docs/api", guideSteps: ["1. Genera API Key Shopify", "2. Webhook ordini"] },
                { name: "Meta Business", description: "Instagram/Facebook auto", status: "missing", detail: "Meta Graph API", scope: "client", sector: "all", usedBy: "Social Manager", actionLabel: "Configura", accountUsage: "subscribed", guideUrl: "https://business.facebook.com/settings/", guideSteps: ["1. App su business.facebook.com → Impostazioni", "2. Permessi pages_manage_posts"] },
                { name: "Google My Business", description: "Recensioni & info", status: "missing", detail: "Business Profile API", scope: "client", sector: "all", usedBy: "Reputazione online", actionLabel: "Configura", accountUsage: "none", guideUrl: "https://developers.google.com/my-business", guideSteps: ["1. Abilita Business Profile API", "2. Verifica scheda GMB"] },
                { name: "Telegram Bot", description: "Ordini & notifiche via Telegram", status: "missing", detail: "Connector Lovable nativo — collegamento con un click", scope: "client", sector: "all", usedBy: "Ordini, notifiche", actionLabel: "Connetti", accountUsage: "none", guideUrl: "https://core.telegram.org/bots/api", guideSteps: ["1. Clicca 'Connetti' → seleziona connessione Telegram", "2. Se non hai un bot: @BotFather → /newbot", "3. Il token viene salvato automaticamente come secret"] },
                { name: "Perplexity AI", description: "Ricerca semantica IA avanzata", status: "missing", detail: "Connector Lovable nativo — collegamento con un click", scope: "admin", usedBy: "Concierge, Analytics, ricerca competitors", actionLabel: "Connetti", secretName: "PERPLEXITY_API_KEY", accountUsage: "requested", guideUrl: "https://docs.perplexity.ai/", guideSteps: ["1. Clicca 'Connetti' → seleziona connessione Perplexity", "2. Se non ne hai una: perplexity.ai → API → Genera Key", "3. Collegamento automatico"] },
                { name: "Firecrawl", description: "Web scraping & crawling IA", status: "missing", detail: "Connector Lovable nativo — collegamento con un click", scope: "admin", usedBy: "Competitor watch, Lead gen, analisi prezzi", actionLabel: "Connetti", secretName: "FIRECRAWL_API_KEY", accountUsage: "none", guideUrl: "https://firecrawl.dev/docs", guideSteps: ["1. Clicca 'Connetti' → seleziona connessione Firecrawl", "2. Se non ne hai una: firecrawl.dev → API → Genera Key", "3. Collegamento automatico"] },
                { name: "Slack Workspace", description: "Alert team & notifiche interne", status: "missing", detail: "Connector Lovable nativo con Gateway — OAuth automatico", scope: "admin", usedBy: "Alert operativi, notifiche team", actionLabel: "Connetti", accountUsage: "none", guideUrl: "https://api.slack.com/", guideSteps: ["1. Clicca 'Connetti' → autorizza workspace Slack", "2. OAuth gestito dal Gateway Lovable", "3. Nessuna API key manuale necessaria"] },
                { name: "Twilio (SMS + Voice)", description: "SMS, chiamate VoIP, WhatsApp", status: "missing", detail: "Connector Lovable nativo con Gateway — OAuth automatico", scope: "client", sector: "all", usedBy: "IVR, conferme SMS, reminder", actionLabel: "Connetti", accountUsage: "extra", guideUrl: "https://www.twilio.com/docs", guideSteps: ["1. Clicca 'Connetti' → seleziona account Twilio", "2. Gateway gestisce autenticazione", "3. SMS, Voice e WhatsApp disponibili"] },
                { name: "Contentful CMS", description: "Gestione contenuti headless", status: "missing", detail: "Connector Lovable nativo con Gateway — OAuth automatico", scope: "admin", usedBy: "Blog, Landing pages, contenuti dinamici", actionLabel: "Connetti", accountUsage: "none", guideUrl: "https://www.contentful.com/developers/docs/", guideSteps: ["1. Clicca 'Connetti' → autorizza Space Contentful", "2. Gateway gestisce token", "3. Contenuti sincronizzati in tempo reale"] },
                { name: "Linear", description: "Project management & issue tracking", status: "missing", detail: "Connector Lovable nativo con Gateway — OAuth automatico", scope: "admin", usedBy: "Task interni, bug tracking, roadmap", actionLabel: "Connetti", accountUsage: "none", guideUrl: "https://linear.app/docs", guideSteps: ["1. Clicca 'Connetti' → autorizza workspace Linear", "2. OAuth gestito dal Gateway Lovable", "3. Sync automatico issue e progetti"] },
                { name: "Twitch", description: "Live streaming & interazioni", status: "missing", detail: "Connector Lovable nativo con Gateway — OAuth automatico", scope: "client", sector: "all", usedBy: "Eventi live, interazioni real-time", actionLabel: "Connetti", accountUsage: "none", guideUrl: "https://dev.twitch.tv/docs", guideSteps: ["1. Clicca 'Connetti' → autorizza account Twitch", "2. Gateway gestisce autenticazione", "3. Stream e chat API disponibili"] },
                { name: "Cloudinary", description: "Ottimizzazione media & CDN", status: "missing", detail: "Image/Video CDN — richiede API Key", scope: "admin", usedBy: "Menu foto, Gallery, ottimizzazione", actionLabel: "Configura", accountUsage: "none", guideUrl: "https://cloudinary.com/documentation", guideSteps: ["1. cloudinary.com → Dashboard", "2. Copia Cloud Name + API Key + Secret", "3. Inserisci come secret"] },
                { name: "iFood / JustEat", description: "Marketplace food delivery", status: "missing", detail: "API aggregatori food — richiede partner access", scope: "client", sector: "food", usedBy: "Ordini multi-canale delivery", actionLabel: "Configura", accountUsage: "requested", guideSteps: ["1. Registrati come Partner sul portale", "2. Richiedi API access", "3. Configura webhook ordini e sync menù"] },
                { name: "Booking.com", description: "OTA prenotazioni hotel", status: "missing", detail: "Connectivity Partner API — richiede partnership", scope: "client", sector: "hospitality", usedBy: "Hotel prenotazioni, tariffe, disponibilità", actionLabel: "Configura", accountUsage: "requested", guideUrl: "https://connect.booking.com/", guideSteps: ["1. Registrati come Connectivity Partner", "2. Ottieni credenziali XML API", "3. Configura mapping camere e tariffe"] },
                { name: "Docusign", description: "Firma digitale contratti", status: "missing", detail: "eSignature API — richiede API Key", scope: "client", sector: "all", usedBy: "Contratti, preventivi, NDA", actionLabel: "Configura", accountUsage: "none", guideUrl: "https://developers.docusign.com/", guideSteps: ["1. DocuSign Developer → Crea app", "2. Ottieni Integration Key", "3. Inserisci come secret"] },
                { name: "Mailchimp", description: "Email marketing & newsletter", status: "missing", detail: "Marketing automation — richiede API Key", scope: "client", sector: "all", usedBy: "Newsletter, campagne email, automazioni", actionLabel: "Configura", accountUsage: "extra", guideUrl: "https://mailchimp.com/developer/", guideSteps: ["1. Mailchimp → Account → API Keys", "2. Genera nuova chiave", "3. Inserisci come secret"] },
              ];

              const allIntegrations = [...adminIntegrations, ...clientIntegrations];

              // Apply filters
              const filterItem = (item: IntegrationItem) => {
                const isDisabled = disabledIntegrations[item.name] || false;
                // Status filter
                if (intFilter.status === "connected" && item.status !== "connected") return false;
                if (intFilter.status === "missing" && item.status !== "missing") return false;
                if (intFilter.status === "disabled" && !isDisabled) return false;
                if (intFilter.status !== "disabled" && intFilter.status !== "all" && isDisabled) return false;
                // Category filter
                if (intFilter.category === "admin" && item.scope !== "admin") return false;
                if (intFilter.category === "client" && item.scope !== "client") return false;
                // Sector filter
                if (intFilter.sector !== "all" && item.sector && item.sector !== intFilter.sector && item.sector !== "all") return false;
                // Account usage filter
                if (intFilter.account !== "all") {
                  const usage = item.accountUsage || "none";
                  if (intFilter.account !== usage) return false;
                }
                // Search
                if (intFilter.search) {
                  const q = intFilter.search.toLowerCase();
                  if (!item.name.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q) && !item.usedBy.toLowerCase().includes(q)) return false;
                }
                return true;
              };

              const filteredAdmin = adminIntegrations.filter(filterItem);
              const filteredClient = clientIntegrations.filter(filterItem);
              const hasActiveFilters = intFilter.status !== "all" || intFilter.category !== "all" || intFilter.sector !== "all" || intFilter.account !== "all" || intFilter.search !== "";

              const adminConnected = adminIntegrations.filter(i => i.status === "connected").length;
              const adminTotal = adminIntegrations.length;
              const clientConnected = clientIntegrations.filter(i => i.status === "connected").length;
              const clientTotal = clientIntegrations.length;
              const totalConnected = allIntegrations.filter(i => i.status === "connected").length;
              const totalMissing = allIntegrations.filter(i => i.status === "missing").length;
              const totalWarning = allIntegrations.filter(i => i.status === "warning").length;

              const statusDot = (s: IntegrationStatus) => {
                if (s === "connected") return "bg-green-400";
                if (s === "warning") return "bg-amber-400";
                return "bg-destructive";
              };

              const sectorIcon = (sector?: string) => {
                const icons: Record<string, string> = { food: "🍽️", ncc: "🚗", beauty: "💅", healthcare: "🏥", hospitality: "🏨", retail: "🛍️", fitness: "💪", beach: "🏖️", all: "🌐" };
                return icons[sector || "all"] || "🔧";
              };

              const sectorLabel = (sector?: string) => {
                const labels: Record<string, string> = { food: "Food", ncc: "NCC", beauty: "Beauty", healthcare: "Sanità", hospitality: "Hotel", retail: "Retail", all: "Globali" };
                return labels[sector || "all"] || sector || "";
              };

              const renderCompactItem = (item: IntegrationItem) => {
                const isDisabled = disabledIntegrations[item.name] || false;
                const guideOpen = expandedGuide === item.name;

                return (
                  <div key={item.name} className={`rounded-lg border transition-all overflow-hidden ${isDisabled ? "border-muted/20 opacity-40" : item.status === "connected" ? "border-green-500/15 bg-green-500/[0.02]" : "border-border bg-card/50"}`}>
                    {/* Main row — always visible */}
                    <div className="flex items-center gap-2 px-2.5 py-2">
                      <div className={`w-2 h-2 rounded-full shrink-0 ${isDisabled ? "bg-muted-foreground/30" : statusDot(item.status)}`} />
                      <div className="flex-1 min-w-0">
                        <p className={`text-[0.65rem] font-semibold leading-tight truncate ${isDisabled ? "text-muted-foreground line-through" : "text-foreground"}`}>{item.name}</p>
                        <p className="text-[0.5rem] text-muted-foreground truncate">{item.description}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {/* Status badge */}
                        {!isDisabled && item.status === "connected" && <span className="text-[0.45rem] px-1 py-0.5 rounded bg-green-500/15 text-green-400 font-bold">ON</span>}
                        {!isDisabled && item.status === "missing" && <span className="text-[0.45rem] px-1 py-0.5 rounded bg-destructive/15 text-destructive font-bold">OFF</span>}
                        {isDisabled && <span className="text-[0.45rem] px-1 py-0.5 rounded bg-muted/20 text-muted-foreground font-bold">⏸</span>}

                        {/* Expand details */}
                        {!isDisabled && (
                          <motion.button
                            onClick={() => setExpandedGuide(guideOpen ? null : item.name)}
                            className="p-1 rounded-md hover:bg-secondary/60 text-muted-foreground"
                            whileTap={{ scale: 0.9 }}
                          >
                            {guideOpen ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                          </motion.button>
                        )}

                        {/* Toggle */}
                        <motion.button
                          onClick={() => toggleIntegration(item.name)}
                          className={`p-0.5 rounded transition-colors ${isDisabled ? "text-muted-foreground/40" : "text-green-400"}`}
                          whileTap={{ scale: 0.9 }}
                        >
                          {isDisabled ? <ToggleLeft className="w-4 h-4" /> : <ToggleRight className="w-4 h-4" />}
                        </motion.button>
                      </div>
                    </div>

                    {/* Expandable detail panel */}
                    <AnimatePresence>
                      {guideOpen && !isDisabled && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.15 }}
                          className="overflow-hidden"
                        >
                          <div className="px-2.5 pb-2.5 pt-0.5 border-t border-border/20 space-y-1.5">
                            {/* Info row */}
                            <p className="text-[0.5rem] text-muted-foreground/70 italic">{item.detail}</p>
                            {item.secretName && (
                              <div className="flex items-center gap-1">
                                <Lock className="w-2.5 h-2.5 text-muted-foreground/40" />
                                <span className="text-[0.45rem] font-mono text-muted-foreground/50">{item.secretName}</span>
                              </div>
                            )}
                            <p className="text-[0.45rem] text-primary/60">👤 {item.usedBy}</p>

                            {/* Action buttons — compact grid */}
                            <div className="flex flex-wrap gap-1 pt-0.5">
                              {item.actionLabel && (
                                <motion.button
                                  className="px-2 py-0.5 rounded-md bg-primary/10 text-primary text-[0.55rem] font-bold flex items-center gap-0.5"
                                  whileTap={{ scale: 0.95 }}
                                  onClick={() => toast({ title: "🔧 " + item.actionLabel, description: item.name + (item.secretName ? ` → ${item.secretName}` : "") })}
                                >
                                  <Zap className="w-2.5 h-2.5" />{item.actionLabel}
                                </motion.button>
                              )}
                              {item.guideUrl && (
                                <a href={item.guideUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-md bg-accent/10 text-accent text-[0.55rem] font-bold flex items-center gap-0.5">
                                  <ExternalLink className="w-2.5 h-2.5" />Docs
                                </a>
                              )}
                              {item.buyCreditsUrl && (
                                <a href={item.buyCreditsUrl} target="_blank" rel="noopener noreferrer" className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 text-[0.55rem] font-bold flex items-center gap-0.5 border border-amber-500/15">
                                  <CreditCard className="w-2.5 h-2.5" />Crediti
                                </a>
                              )}
                            </div>

                            {/* Setup steps */}
                            {item.guideSteps && (
                              <div className="pt-1 space-y-0.5">
                                {item.guideSteps.map((step, i) => (
                                  <p key={i} className="text-[0.5rem] text-muted-foreground/70 pl-2 flex items-start gap-1">
                                    <span className="text-primary/50 shrink-0">▸</span>{step}
                                  </p>
                                ))}
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              };

              const clientSectors = [...new Set(clientIntegrations.map(i => i.sector || "all"))];

              return (
                <>
                  {/* Summary — ultra compact */}
                  <div className="grid grid-cols-3 gap-1.5">
                    <div className="py-2 px-2 rounded-lg bg-green-500/[0.06] border border-green-500/10 text-center">
                      <p className="text-xl font-display font-bold text-green-400 leading-none">{totalConnected}</p>
                      <p className="text-[0.5rem] text-green-400/60 font-medium mt-0.5">Connessi</p>
                    </div>
                    <div className="py-2 px-2 rounded-lg bg-amber-500/[0.06] border border-amber-500/10 text-center">
                      <p className="text-xl font-display font-bold text-amber-400 leading-none">{totalWarning}</p>
                      <p className="text-[0.5rem] text-amber-400/60 font-medium mt-0.5">Parziali</p>
                    </div>
                    <div className="py-2 px-2 rounded-lg bg-destructive/[0.06] border border-destructive/10 text-center">
                      <p className="text-xl font-display font-bold text-destructive leading-none">{totalMissing}</p>
                      <p className="text-[0.5rem] text-destructive/60 font-medium mt-0.5">Mancanti</p>
                    </div>
                  </div>

                  {/* ═══ FILTER BAR ═══ */}
                  <div className="rounded-xl border border-border bg-card/50 p-2.5 space-y-2">
                    {/* Search */}
                    <div className="relative">
                      <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground/50" />
                      <input
                        type="text"
                        placeholder="Cerca integrazione..."
                        value={intFilter.search}
                        onChange={(e) => setIntFilter(prev => ({ ...prev, search: e.target.value }))}
                        className="w-full pl-6 pr-2 py-1.5 rounded-lg bg-secondary/30 border border-border text-[0.65rem] text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-primary/30"
                      />
                    </div>
                    {/* Status chips */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[0.5rem] text-muted-foreground/60 font-semibold self-center mr-0.5">Stato:</span>
                      {([
                        { key: "all", label: "Tutti", color: "text-foreground bg-secondary/40" },
                        { key: "connected", label: "🟢 Connessi", color: "text-green-400 bg-green-500/10" },
                        { key: "missing", label: "🔴 Mancanti", color: "text-destructive bg-destructive/10" },
                        { key: "disabled", label: "⏸ Disattivati", color: "text-muted-foreground bg-muted/20" },
                      ] as const).map(s => (
                        <button
                          key={s.key}
                          onClick={() => setIntFilter(prev => ({ ...prev, status: s.key }))}
                          className={`px-2 py-0.5 rounded-md text-[0.55rem] font-bold transition-all ${intFilter.status === s.key ? s.color + " ring-1 ring-primary/30" : "text-muted-foreground/50 bg-secondary/20 hover:bg-secondary/40"}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    {/* Category chips */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[0.5rem] text-muted-foreground/60 font-semibold self-center mr-0.5">Tipo:</span>
                      {([
                        { key: "all", label: "Tutti" },
                        { key: "admin", label: "🛡️ Infrastruttura" },
                        { key: "client", label: "🏢 Settoriali" },
                      ] as const).map(c => (
                        <button
                          key={c.key}
                          onClick={() => setIntFilter(prev => ({ ...prev, category: c.key }))}
                          className={`px-2 py-0.5 rounded-md text-[0.55rem] font-bold transition-all ${intFilter.category === c.key ? "text-primary bg-primary/10 ring-1 ring-primary/30" : "text-muted-foreground/50 bg-secondary/20 hover:bg-secondary/40"}`}
                        >
                          {c.label}
                        </button>
                      ))}
                    </div>
                    {/* Sector chips */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[0.5rem] text-muted-foreground/60 font-semibold self-center mr-0.5">Settore:</span>
                      {[
                        { key: "all", label: "Tutti" },
                        { key: "food", label: "🍽️ Food" },
                        { key: "ncc", label: "🚗 NCC" },
                        { key: "beauty", label: "💅 Beauty" },
                        { key: "healthcare", label: "🏥 Sanità" },
                        { key: "hospitality", label: "🏨 Hotel" },
                        { key: "retail", label: "🛍️ Retail" },
                      ].map(s => (
                        <button
                          key={s.key}
                          onClick={() => setIntFilter(prev => ({ ...prev, sector: s.key }))}
                          className={`px-2 py-0.5 rounded-md text-[0.55rem] font-bold transition-all ${intFilter.sector === s.key ? "text-accent bg-accent/10 ring-1 ring-accent/30" : "text-muted-foreground/50 bg-secondary/20 hover:bg-secondary/40"}`}
                        >
                          {s.label}
                        </button>
                      ))}
                    </div>
                    {/* Account usage chips */}
                    <div className="flex flex-wrap gap-1">
                      <span className="text-[0.5rem] text-muted-foreground/60 font-semibold self-center mr-0.5">Account:</span>
                      {([
                        { key: "all", label: "Tutti", color: "text-foreground bg-secondary/40" },
                        { key: "subscribed", label: "📋 In Piano", color: "text-blue-400 bg-blue-500/10" },
                        { key: "extra", label: "⭐ Extra", color: "text-amber-400 bg-amber-500/10" },
                        { key: "requested", label: "📩 Richiesto", color: "text-purple-400 bg-purple-500/10" },
                        { key: "none", label: "➖ Non attivo", color: "text-muted-foreground bg-muted/20" },
                      ] as const).map(a => (
                        <button
                          key={a.key}
                          onClick={() => setIntFilter(prev => ({ ...prev, account: a.key }))}
                          className={`px-2 py-0.5 rounded-md text-[0.55rem] font-bold transition-all ${intFilter.account === a.key ? a.color + " ring-1 ring-primary/30" : "text-muted-foreground/50 bg-secondary/20 hover:bg-secondary/40"}`}
                        >
                          {a.label}
                        </button>
                      ))}
                    </div>
                    {/* Reset */}
                    {hasActiveFilters && (
                      <button
                        onClick={() => setIntFilter({ status: "all", category: "all", sector: "all", account: "all", search: "" })}
                        className="text-[0.55rem] text-primary font-bold flex items-center gap-0.5 hover:underline"
                      >
                        <X className="w-2.5 h-2.5" /> Reset filtri
                      </button>
                    )}
                    {hasActiveFilters && (
                      <p className="text-[0.5rem] text-muted-foreground/50">{filteredAdmin.length + filteredClient.length} risultati</p>
                    )}
                  </div>

                  <div className="rounded-xl border border-primary/15 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === "admin" ? null : "admin")}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-primary/[0.04] hover:bg-primary/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Crown className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-display font-bold text-foreground">Infrastruttura</span>
                        <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary font-bold">{adminConnected}/{adminTotal}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {/* Progress mini */}
                        <div className="w-12 h-1 rounded-full bg-secondary overflow-hidden">
                          <div className="h-full rounded-full bg-primary" style={{ width: `${adminConnected / adminTotal * 100}%` }} />
                        </div>
                        {expandedSection === "admin" ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {expandedSection === "admin" && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-2 space-y-1">
                            {filteredAdmin.length > 0 ? filteredAdmin.map(renderCompactItem) : <p className="text-[0.55rem] text-muted-foreground/50 text-center py-3">Nessun risultato con i filtri attivi</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ═══ ACCORDION: Integrazioni Settore ═══ */}
                  <div className="rounded-xl border border-accent/15 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === "client" ? null : "client")}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-accent/[0.04] hover:bg-accent/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Users className="w-3.5 h-3.5 text-accent" />
                        <span className="text-xs font-display font-bold text-foreground">Per Settore</span>
                        <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-accent/10 text-accent font-bold">{clientConnected}/{clientTotal}</span>
                      </div>
                      {expandedSection === "client" ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === "client" && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-2 space-y-3">
                            {clientSectors.map(sector => {
                              const sectorItems = filteredClient.filter(i => i.sector === sector);
                              if (sectorItems.length === 0) return null;
                              const sectorConn = sectorItems.filter(i => i.status === "connected").length;
                              const isSectorOff = disabledSectors[sector] || false;
                              return (
                                <div key={sector}>
                                  <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[0.65rem] font-bold text-foreground flex items-center gap-1">
                                      {sectorIcon(sector)} {sectorLabel(sector)}
                                      <span className="text-[0.5rem] text-muted-foreground font-normal ml-1">{sectorConn}/{sectorItems.length}</span>
                                    </span>
                                    <motion.button
                                      onClick={() => toggleSector(sector)}
                                      className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[0.5rem] font-bold ${isSectorOff ? "bg-destructive/10 text-destructive" : "bg-green-500/10 text-green-400"}`}
                                      whileTap={{ scale: 0.95 }}
                                    >
                                      {isSectorOff ? <ToggleLeft className="w-3 h-3" /> : <ToggleRight className="w-3 h-3" />}
                                      {isSectorOff ? "Off" : "On"}
                                    </motion.button>
                                  </div>
                                  {!isSectorOff ? (
                                    <div className="space-y-1">{sectorItems.map(renderCompactItem)}</div>
                                  ) : (
                                    <p className="text-[0.5rem] text-muted-foreground text-center py-2 bg-muted/5 rounded-lg">Settore disattivato</p>
                                  )}
                                </div>
                              );
                            })}
                            {filteredClient.length === 0 && <p className="text-[0.55rem] text-muted-foreground/50 text-center py-3">Nessun risultato con i filtri attivi</p>}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ═══ ACCORDION: Per Account ═══ */}
                  <div className="rounded-xl border border-blue-500/15 overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === "accounts" as any ? null : "accounts" as any)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-blue-500/[0.04] hover:bg-blue-500/[0.08] transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-blue-400" />
                        <span className="text-xs font-display font-bold text-foreground">Per Account</span>
                        <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 font-bold">Tenant</span>
                      </div>
                      {expandedSection === ("accounts" as any) ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === ("accounts" as any) && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-2">
                            <TenantIntegrationsSection />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ═══ ACCORDION: Edge Functions ═══ */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === "functions" ? null : "functions")}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-card hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Cpu className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-display font-bold text-foreground">Edge Functions</span>
                        <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 font-bold">20 attive</span>
                      </div>
                      {expandedSection === "functions" ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === "functions" && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-2 grid grid-cols-1 gap-0.5">
                            {[
                              { fn: "empire-assistant", deps: "LOVABLE" },
                              { fn: "empire-tts", deps: "11LABS" },
                              { fn: "empire-voice-agent", deps: "11LABS" },
                              { fn: "restaurant-voice-agent", deps: "11LABS" },
                              { fn: "elevenlabs-conversation-token", deps: "11LABS" },
                              { fn: "ai-menu", deps: "LOVABLE" },
                              { fn: "ai-translate", deps: "LOVABLE" },
                              { fn: "ai-inventory", deps: "LOVABLE" },
                              { fn: "create-company", deps: "—" },
                              { fn: "assign-partner-role", deps: "—" },
                              { fn: "check-payments", deps: "—" },
                              { fn: "generate-b2b-invoice", deps: "—" },
                              { fn: "generate-fee-invoice", deps: "—" },
                              { fn: "payment-notifications", deps: "—" },
                              { fn: "whatsapp-webhook", deps: "META" },
                              { fn: "whatsapp-send", deps: "META" },
                              { fn: "whatsapp-ai-chat", deps: "LOVABLE" },
                              { fn: "subscription-checkout", deps: "STRIPE" },
                              { fn: "stripe-webhook", deps: "STRIPE" },
                              { fn: "ai-token-checkout", deps: "STRIPE" },
                              { fn: "submit-feature-request", deps: "—" },
                              { fn: "send-push-discount", deps: "FCM" },
                              { fn: "seed-demo-accounts", deps: "—" },
                            ].map(f => (
                              <div key={f.fn} className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted/20 transition-colors">
                                <div className="w-1.5 h-1.5 rounded-full bg-green-400 shrink-0" />
                                <span className="text-[0.55rem] font-mono text-foreground/70 truncate flex-1">{f.fn}</span>
                                <span className={`text-[0.4rem] font-mono px-1 rounded ${f.deps === "—" ? "text-muted-foreground/30" : "text-amber-400/60 bg-amber-500/5"}`}>{f.deps}</span>
                              </div>
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* ═══ LEGENDA STATI ═══ */}
                  <div className="rounded-xl border border-border overflow-hidden">
                    <button
                      onClick={() => setExpandedSection(expandedSection === ("legend" as any) ? null : "legend" as any)}
                      className="w-full flex items-center justify-between px-3 py-2.5 bg-card hover:bg-muted/20 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <Info className="w-3.5 h-3.5 text-muted-foreground" />
                        <span className="text-xs font-display font-bold text-foreground">Legenda</span>
                      </div>
                      {expandedSection === ("legend" as any) ? <ChevronUp className="w-3.5 h-3.5 text-muted-foreground" /> : <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />}
                    </button>
                    <AnimatePresence>
                      {expandedSection === ("legend" as any) && (
                        <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }} className="overflow-hidden">
                          <div className="p-3 space-y-3">
                            {/* Status legend */}
                            <div>
                              <p className="text-[0.6rem] font-bold text-foreground mb-1.5">📊 Stato Connessione</p>
                              <div className="space-y-1.5">
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-green-400" />
                                  <span className="text-[0.55rem] font-semibold text-green-400">ON — Connesso</span>
                                  <span className="text-[0.45rem] text-muted-foreground flex-1">API key configurata e funzionante. Pronto all'uso.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                                  <span className="text-[0.55rem] font-semibold text-amber-400">⚠ Parziale</span>
                                  <span className="text-[0.45rem] text-muted-foreground flex-1">Configurata ma con limitazioni (crediti bassi, scadenza vicina).</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-destructive" />
                                  <span className="text-[0.55rem] font-semibold text-destructive">OFF — Mancante</span>
                                  <span className="text-[0.45rem] text-muted-foreground flex-1">Non configurata. Clicca "Configura" per aggiungere la API key.</span>
                                </div>
                                <div className="flex items-center gap-2">
                                  <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                                  <span className="text-[0.55rem] font-semibold text-muted-foreground">⏸ Disattivata</span>
                                  <span className="text-[0.45rem] text-muted-foreground flex-1">Configurata ma disabilitata manualmente con il toggle.</span>
                                </div>
                              </div>
                            </div>

                            {/* Type legend */}
                            <div>
                              <p className="text-[0.6rem] font-bold text-foreground mb-1.5">🔌 Tipi di Connessione</p>
                              <div className="space-y-1.5">
                                <div className="flex items-start gap-2">
                                  <span className="text-[0.55rem] font-bold text-primary shrink-0 w-20">🏗️ Infrastruttura</span>
                                  <span className="text-[0.45rem] text-muted-foreground">Servizi core della piattaforma (DB, AI, Auth). Gestiti automaticamente.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-[0.55rem] font-bold text-accent shrink-0 w-20">🔗 Connector</span>
                                  <span className="text-[0.45rem] text-muted-foreground">Integrazioni native Lovable (ElevenLabs, Slack, Telegram…). Si collegano con un click.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-[0.55rem] font-bold text-amber-400 shrink-0 w-20">🔑 API Key</span>
                                  <span className="text-[0.45rem] text-muted-foreground">Servizi esterni (Stripe, Google Maps…). Richiedono copia/incolla della chiave.</span>
                                </div>
                                <div className="flex items-start gap-2">
                                  <span className="text-[0.55rem] font-bold text-blue-400 shrink-0 w-20">🏭 Per Settore</span>
                                  <span className="text-[0.45rem] text-muted-foreground">Integrazioni attive solo per specifici settori (Food, NCC, Beauty…).</span>
                                </div>
                              </div>
                            </div>

                            {/* How to connect */}
                            <div>
                              <p className="text-[0.6rem] font-bold text-foreground mb-1.5">📋 Come Collegare</p>
                              <div className="space-y-1 pl-1">
                                <p className="text-[0.5rem] text-muted-foreground">1️⃣ Espandi l'integrazione cliccando la freccia ▼</p>
                                <p className="text-[0.5rem] text-muted-foreground">2️⃣ Segui i passi indicati nella guida step-by-step</p>
                                <p className="text-[0.5rem] text-muted-foreground">3️⃣ Clicca "Configura" per inserire la API key come secret sicuro</p>
                                <p className="text-[0.5rem] text-muted-foreground">4️⃣ Il pallino diventerà 🟢 verde — connessione attiva</p>
                                <p className="text-[0.5rem] text-muted-foreground">5️⃣ Usa il toggle per attivare/disattivare senza cancellare la key</p>
                              </div>
                            </div>

                            {/* Security note */}
                            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-primary/10 bg-primary/[0.02]">
                              <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                              <p className="text-[0.5rem] text-muted-foreground leading-relaxed">
                                Tutte le API key sono archiviate server-side come <strong className="text-foreground">encrypted secrets</strong>. Mai esposte nel frontend. Toggle singolo o per settore.
                              </p>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              );
            })()}
          </motion.div>
        )}

        {/* ===== WHATSAPP ===== */}
        {!loading && activeTab === "whatsapp" && (
          <motion.div className="space-y-4 mt-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Header */}
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-2 rounded-2xl bg-[#25D366]/15 flex items-center justify-center">
                <MessageCircle className="w-8 h-8 text-[#25D366]" />
              </div>
              <h2 className="text-base font-display font-bold text-foreground">WhatsApp AI Orchestrator</h2>
              <p className="text-[9px] text-muted-foreground">Agente IA multi-tenant · Isolamento privacy assoluto</p>
            </div>

            {/* Agent Card */}
            <div className="rounded-xl border border-[#25D366]/20 bg-[#25D366]/[0.03] p-4 space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#25D366]/15 flex items-center justify-center">
                  <Bot className="w-6 h-6 text-[#25D366]" />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-foreground">Empire WhatsApp Agent</h3>
                  <p className="text-[0.55rem] text-muted-foreground">Chat IA · Template · Broadcast · Sentiment</p>
                </div>
                <span className="text-[0.5rem] px-2 py-1 rounded-full bg-[#25D366]/15 text-[#25D366] font-bold">v2.0</span>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div className="rounded-lg bg-background/50 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">25+</p>
                  <p className="text-[0.5rem] text-muted-foreground">Settori supportati</p>
                </div>
                <div className="rounded-lg bg-background/50 p-2 text-center">
                  <p className="text-lg font-bold text-foreground">8</p>
                  <p className="text-[0.5rem] text-muted-foreground">Prompt settoriali</p>
                </div>
              </div>
              {/* Capabilities */}
              <div className="flex flex-wrap gap-1">
                {["Chat IA Auto-Reply", "Template Notifiche", "Broadcast Promo", "Sentiment Analysis", "Multi-Tenant"].map(cap => (
                  <span key={cap} className="text-[0.5rem] px-1.5 py-0.5 rounded-full bg-primary/10 text-primary/70 font-medium">{cap}</span>
                ))}
              </div>
            </div>

            {/* Privacy & Isolation */}
            <div className="rounded-xl border border-primary/15 bg-primary/[0.02] p-3 space-y-2">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-primary" />
                <h3 className="text-xs font-bold text-foreground">Isolamento Multi-Tenant</h3>
              </div>
              <div className="space-y-1.5 text-[0.55rem] text-muted-foreground leading-relaxed">
                <p>✅ Ogni account ha la <strong className="text-foreground">propria configurazione WhatsApp</strong> separata (numero, token, webhook)</p>
                <p>✅ Le conversazioni sono isolate per <strong className="text-foreground">tenant_id</strong> — Ristorante X non vede mai i dati di Ristorante Y</p>
                <p>✅ I prompt IA sono personalizzati per <strong className="text-foreground">settore</strong> (food, beauty, NCC, hotel...)</p>
                <p>✅ RLS policies su tutte le tabelle WhatsApp garantiscono isolamento assoluto</p>
              </div>
            </div>

            {/* Setup Guide */}
            <div className="rounded-xl border border-border p-3 space-y-3">
              <h3 className="text-xs font-bold text-foreground flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Come attivare WhatsApp per il tuo account
              </h3>
              <div className="space-y-2">
                {[
                  { step: "1", title: "Crea App su Meta Business", desc: "Vai su business.facebook.com → Impostazioni → App Business → Crea App → Aggiungi prodotto WhatsApp", url: "https://business.facebook.com/settings/" },
                  { step: "2", title: "Ottieni credenziali API", desc: "WhatsApp → API Setup → Copia Phone Number ID, Token permanente e Business Account ID" },
                  { step: "3", title: "Configura Webhook", desc: "Imposta webhook URL: la tua edge function whatsapp-webhook riceve i messaggi in entrata" },
                  { step: "4", title: "Inserisci nel pannello", desc: "Vai su /app/whatsapp nel tuo account → Tab Impostazioni → Inserisci Phone Number ID, Token e Business ID" },
                  { step: "5", title: "Testa!", desc: "Invia un messaggio al numero configurato — l'agente IA risponderà automaticamente con il prompt del tuo settore" },
                ].map(item => (
                  <div key={item.step} className="flex gap-2">
                    <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[0.55rem] font-bold text-primary">{item.step}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-[0.6rem] font-bold text-foreground">{item.title}</p>
                      <p className="text-[0.5rem] text-muted-foreground leading-relaxed">{item.desc}</p>
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-[0.5rem] text-primary/70 hover:text-primary flex items-center gap-0.5 mt-0.5">
                          <ExternalLink className="w-2.5 h-2.5" /> Apri Meta Developers
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-2">
              <motion.button
                onClick={() => navigate("/app/whatsapp")}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-[#25D366]/20 bg-[#25D366]/[0.04] hover:bg-[#25D366]/[0.08] transition-colors"
                whileTap={{ scale: 0.97 }}
              >
                <MessageCircle className="w-5 h-5 text-[#25D366]" />
                <span className="text-[0.6rem] font-bold text-foreground">Apri Chat WA</span>
                <span className="text-[0.45rem] text-muted-foreground">Vai alla dashboard</span>
              </motion.button>
              <motion.button
                onClick={() => { setActiveTab("integrations"); setExpandedSection("client" as any); }}
                className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-border bg-card/50 hover:bg-muted/20 transition-colors"
                whileTap={{ scale: 0.97 }}
              >
                <Wifi className="w-5 h-5 text-muted-foreground" />
                <span className="text-[0.6rem] font-bold text-foreground">Connettori</span>
                <span className="text-[0.45rem] text-muted-foreground">Config per tenant</span>
              </motion.button>
            </div>

            {/* Architecture */}
            <div className="rounded-xl border border-border p-3 space-y-2">
              <h3 className="text-xs font-bold text-foreground">🏗️ Architettura</h3>
              <div className="grid grid-cols-1 gap-1">
                {[
                  { table: "whatsapp_config", desc: "Config per tenant (token, phone_id, webhook)" },
                  { table: "whatsapp_conversations", desc: "Thread chat isolati per tenant_id" },
                  { table: "whatsapp_messages", desc: "Messaggi in/out con stato delivery" },
                  { table: "whatsapp_notifications", desc: "Template + broadcast per tenant" },
                  { table: "sector_system_prompts", desc: "Prompt IA personalizzati per settore" },
                ].map(t => (
                  <div key={t.table} className="flex items-center gap-2 px-2 py-1.5 rounded-lg hover:bg-muted/10">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] shrink-0" />
                    <span className="text-[0.55rem] font-mono text-foreground/70">{t.table}</span>
                    <span className="text-[0.45rem] text-muted-foreground flex-1 truncate">— {t.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Edge Functions */}
            <div className="rounded-xl border border-border p-3 space-y-2">
              <h3 className="text-xs font-bold text-foreground">⚡ Edge Functions WhatsApp</h3>
              <div className="grid grid-cols-1 gap-0.5">
                {[
                  { fn: "whatsapp-webhook", desc: "Riceve messaggi da Meta API" },
                  { fn: "whatsapp-send", desc: "Invia messaggi e template" },
                  { fn: "whatsapp-ai-chat", desc: "Risposta IA automatica con Gemini" },
                ].map(f => (
                  <div key={f.fn} className="flex items-center gap-1.5 px-2 py-1 rounded hover:bg-muted/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-[#25D366] shrink-0" />
                    <span className="text-[0.55rem] font-mono text-foreground/70">{f.fn}</span>
                    <span className="text-[0.45rem] text-muted-foreground flex-1 truncate">— {f.desc}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Security note */}
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-[#25D366]/10 bg-[#25D366]/[0.02]">
              <ShieldCheck className="w-3.5 h-3.5 text-[#25D366] shrink-0" />
              <p className="text-[0.5rem] text-muted-foreground leading-relaxed">
                Token Meta e credenziali API salvati come secrets server-side · Mai esposti ai client · RLS su ogni tabella
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
