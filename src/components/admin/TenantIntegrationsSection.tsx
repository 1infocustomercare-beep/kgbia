import { useState, useMemo } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Building2, ChevronDown, ChevronUp, Power, PowerOff,
  Zap, ShieldAlert, ShieldCheck, Ban, CheckCircle2, AlertTriangle,
  CreditCard, Clock, DollarSign, RefreshCw, Eye
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

const INDUSTRY_COLORS: Record<string, string> = {
  food: "#C8963E", ncc: "#1E3A5F", beauty: "#E91E8C", healthcare: "#10B981",
  fitness: "#F97316", retail: "#8B5CF6", hospitality: "#0EA5E9", beach: "#06B6D4",
  plumber: "#6366F1", electrician: "#EAB308", construction: "#78716C",
  agriturismo: "#22C55E", cleaning: "#14B8A6", legal: "#64748B",
  accounting: "#6B7280", garage: "#A3A3A3", photography: "#EC4899",
  gardening: "#84CC16", veterinary: "#F59E0B", tattoo: "#DC2626",
  childcare: "#FB923C", education: "#3B82F6", events: "#A855F7",
  logistics: "#0891B2", custom: "#9CA3AF",
};

const PLAN_LABELS: Record<string, string> = {
  essential: "Essential", smart_ia: "Smart IA", empire_pro: "Empire Pro",
  digital_start: "Digital Start", growth_ai: "Growth AI", empire_domination: "Empire",
};

const PLAN_INTEGRATIONS: Record<string, string[]> = {
  essential: ["Lovable Cloud", "Lovable AI Gateway"],
  smart_ia: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Meta Business", "WhatsApp Business"],
  empire_pro: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Stripe Platform", "Meta Business", "Google My Business", "WhatsApp Business"],
  digital_start: ["Lovable Cloud", "Lovable AI Gateway"],
  growth_ai: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Stripe Platform", "WhatsApp Business"],
  empire_domination: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Stripe Platform", "Meta Business", "Google My Business", "Google Analytics", "WhatsApp Business"],
};

const SECTOR_INTEGRATIONS: Record<string, string[]> = {
  food: ["Fatturazione SDI", "Delivery API", "Stampante ESC/POS", "WhatsApp Business"],
  ncc: ["Google Maps", "WhatsApp Business", "Stripe NCC"],
  beauty: ["Google Calendar", "SMS Twilio", "WhatsApp Business"],
  healthcare: ["Telemedicina", "HL7/FHIR", "WhatsApp Business"],
  hospitality: ["Channel Manager", "PMS Integration", "WhatsApp Business"],
  retail: ["POS Integration", "Shopify/Woo", "WhatsApp Business"],
  fitness: ["WhatsApp Business"],
  plumber: ["WhatsApp Business"],
  electrician: ["WhatsApp Business"],
  construction: ["WhatsApp Business"],
  cleaning: ["WhatsApp Business"],
  legal: ["WhatsApp Business"],
  accounting: ["WhatsApp Business"],
  events: ["WhatsApp Business"],
  logistics: ["WhatsApp Business"],
  veterinary: ["WhatsApp Business"],
  education: ["WhatsApp Business"],
  custom: ["WhatsApp Business"],
};

type PaymentStatus = "ok" | "warning" | "overdue" | "blocked" | "trial" | "unknown";

interface TenantInfo {
  id: string;
  name: string;
  industry: string;
  plan: string;
  source: "company" | "restaurant";
  isBlocked: boolean;
  blockedReason: string | null;
  isActive: boolean;
  paymentStatus: PaymentStatus;
  installmentsPaid: number;
  installmentsTotal: number;
  nextDueDate: string | null;
  isOverdue: boolean;
  warningDays: number;
  subscriptionStatus: string;
  trialEnd: string | null;
}

export default function TenantIntegrationsSection() {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "ok" | "warning" | "blocked">("all");
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);
  const [overrides, setOverrides] = useState<Record<string, Record<string, boolean>>>({});
  const queryClient = useQueryClient();

  // Fetch companies
  const { data: companies = [] } = useQuery({
    queryKey: ["admin-companies-list"],
    queryFn: async () => {
      const { data } = await supabase.from("companies").select("id, name, industry, subscription_plan, is_blocked, blocked_reason, is_active");
      return data || [];
    },
  });

  // Fetch restaurants
  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants-list-tenants"],
    queryFn: async () => {
      const { data } = await supabase.from("restaurants").select("id, name, slug, is_blocked, blocked_reason, is_active");
      return data || [];
    },
  });

  // Fetch restaurant payments
  const { data: restaurantPayments = [] } = useQuery({
    queryKey: ["admin-restaurant-payments"],
    queryFn: async () => {
      const { data } = await supabase.from("restaurant_payments").select("*");
      return data || [];
    },
  });

  // Fetch restaurant subscriptions
  const { data: restaurantSubs = [] } = useQuery({
    queryKey: ["admin-restaurant-subs"],
    queryFn: async () => {
      const { data } = await supabase.from("restaurant_subscriptions").select("*");
      return data || [];
    },
  });

  // Fetch business subscriptions
  const { data: businessSubs = [] } = useQuery({
    queryKey: ["admin-business-subs"],
    queryFn: async () => {
      const { data } = await supabase.from("business_subscriptions").select("*");
      return data || [];
    },
  });

  // Block/Unblock mutations
  const blockRestaurant = useMutation({
    mutationFn: async ({ id, block }: { id: string; block: boolean }) => {
      const { error } = await supabase.from("restaurants").update({
        is_blocked: block,
        is_active: !block,
        blocked_reason: block ? "Bloccato manualmente dal Super Admin" : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { block }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants-list-tenants"] });
      toast({ title: block ? "🔴 Account Bloccato" : "🟢 Account Riattivato" });
    },
  });

  const blockCompany = useMutation({
    mutationFn: async ({ id, block }: { id: string; block: boolean }) => {
      const { error } = await supabase.from("companies").update({
        is_blocked: block,
        is_active: !block,
        blocked_reason: block ? "Bloccato manualmente dal Super Admin" : null,
      }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: (_, { block }) => {
      queryClient.invalidateQueries({ queryKey: ["admin-companies-list"] });
      toast({ title: block ? "🔴 Account Bloccato" : "🟢 Account Riattivato" });
    },
  });

  // Register payment mutation
  const registerPayment = useMutation({
    mutationFn: async ({ paymentId, restaurantId }: { paymentId: string; restaurantId: string }) => {
      // Increment installments_paid, recalculate
      const payment = restaurantPayments.find(p => p.id === paymentId);
      if (!payment) throw new Error("Payment not found");
      const newPaid = payment.installments_paid + 1;
      const newAmountPaid = payment.amount_paid + payment.installment_amount;
      const newDueDate = payment.next_due_date
        ? new Date(new Date(payment.next_due_date).getTime() + 30 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
        : null;
      const isComplete = newPaid >= payment.installments_total;

      const { error } = await supabase.from("restaurant_payments").update({
        installments_paid: newPaid,
        amount_paid: newAmountPaid,
        is_overdue: false,
        next_due_date: isComplete ? null : newDueDate,
      }).eq("id", paymentId);
      if (error) throw error;

      // Unblock restaurant if it was blocked for overdue
      await supabase.from("restaurants").update({
        is_blocked: false,
        blocked_reason: null,
        is_active: true,
      }).eq("id", restaurantId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-restaurant-payments"] });
      queryClient.invalidateQueries({ queryKey: ["admin-restaurants-list-tenants"] });
      toast({ title: "✅ Pagamento Registrato", description: "Account riattivato automaticamente" });
    },
  });

  // Build tenant list with payment info
  const tenants = useMemo<TenantInfo[]>(() => {
    const list: TenantInfo[] = [];
    const seen = new Set<string>();

    companies.forEach((c: any) => {
      const bSub = businessSubs.find((s: any) => s.company_id === c.id);
      const isTrialing = bSub?.status === "trialing";
      const trialEnd = bSub?.trial_end || null;
      const trialExpired = trialEnd ? new Date(trialEnd) < new Date() : false;

      let paymentStatus: PaymentStatus = "unknown";
      if (c.is_blocked) paymentStatus = "blocked";
      else if (isTrialing && !trialExpired) paymentStatus = "trial";
      else if (bSub?.status === "active") paymentStatus = "ok";

      list.push({
        id: c.id, name: c.name, industry: c.industry || "custom",
        plan: c.subscription_plan || "essential", source: "company",
        isBlocked: c.is_blocked || false, blockedReason: c.blocked_reason,
        isActive: c.is_active ?? true, paymentStatus,
        installmentsPaid: 0, installmentsTotal: 0, nextDueDate: null,
        isOverdue: false, warningDays: 0,
        subscriptionStatus: bSub?.status || "unknown", trialEnd,
      });
      seen.add(c.id);
    });

    restaurants.forEach((r: any) => {
      if (seen.has(r.id)) return;
      const payment = restaurantPayments.find((p: any) => p.restaurant_id === r.id);
      const rSub = restaurantSubs.find((s: any) => s.restaurant_id === r.id);
      const isTrialing = rSub?.status === "trialing";
      const trialEnd = rSub?.trial_end || null;
      const trialExpired = trialEnd ? new Date(trialEnd) < new Date() : false;

      let paymentStatus: PaymentStatus = "unknown";
      if (r.is_blocked) paymentStatus = "blocked";
      else if (payment?.is_overdue) paymentStatus = "overdue";
      else if (payment && payment.next_due_date) {
        const daysUntilDue = Math.ceil((new Date(payment.next_due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
        if (daysUntilDue <= 3 && daysUntilDue > 0) paymentStatus = "warning";
        else if (daysUntilDue <= 0) paymentStatus = "overdue";
        else paymentStatus = "ok";
      } else if (isTrialing && !trialExpired) paymentStatus = "trial";
      else if (payment && payment.installments_paid >= payment.installments_total) paymentStatus = "ok";
      else paymentStatus = rSub ? "ok" : "unknown";

      const daysUntilDue = payment?.next_due_date
        ? Math.ceil((new Date(payment.next_due_date).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
        : 999;

      list.push({
        id: r.id, name: r.name, industry: "food",
        plan: rSub?.plan || "essential", source: "restaurant",
        isBlocked: r.is_blocked || false, blockedReason: r.blocked_reason,
        isActive: r.is_active ?? true, paymentStatus,
        installmentsPaid: payment?.installments_paid || 0,
        installmentsTotal: payment?.installments_total || 0,
        nextDueDate: payment?.next_due_date || null,
        isOverdue: payment?.is_overdue || false,
        warningDays: daysUntilDue,
        subscriptionStatus: rSub?.status || "unknown",
        trialEnd,
      });
    });

    return list;
  }, [companies, restaurants, restaurantPayments, restaurantSubs, businessSubs]);

  const industries = useMemo(() => [...new Set(tenants.map(t => t.industry))].sort(), [tenants]);

  const filtered = useMemo(() => {
    return tenants.filter(t => {
      if (industryFilter !== "all" && t.industry !== industryFilter) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (statusFilter === "ok" && t.paymentStatus !== "ok" && t.paymentStatus !== "trial") return false;
      if (statusFilter === "warning" && t.paymentStatus !== "warning" && t.paymentStatus !== "overdue") return false;
      if (statusFilter === "blocked" && !t.isBlocked) return false;
      return true;
    });
  }, [tenants, industryFilter, search, statusFilter]);

  const statusCounts = useMemo(() => ({
    ok: tenants.filter(t => t.paymentStatus === "ok" || t.paymentStatus === "trial").length,
    warning: tenants.filter(t => t.paymentStatus === "warning" || t.paymentStatus === "overdue").length,
    blocked: tenants.filter(t => t.isBlocked).length,
  }), [tenants]);

  const getIntegrationsForTenant = (tenant: TenantInfo) => {
    const planInts = PLAN_INTEGRATIONS[tenant.plan] || PLAN_INTEGRATIONS.essential;
    const sectorInts = SECTOR_INTEGRATIONS[tenant.industry] || [];
    return [...new Set([...planInts, ...sectorInts])];
  };

  const toggleIntegration = (tenantId: string, intName: string, currentlyActive: boolean) => {
    setOverrides(prev => ({
      ...prev,
      [tenantId]: { ...(prev[tenantId] || {}), [intName]: !currentlyActive },
    }));
    toast({
      title: currentlyActive ? "🔴 Disattivata" : "🟢 Attivata",
      description: `${intName} ${currentlyActive ? "spenta" : "attivata"} per questo account`,
    });
  };

  const isActive = (tenantId: string, intName: string) => overrides[tenantId]?.[intName] ?? true;

  const handleToggleBlock = (tenant: TenantInfo) => {
    const block = !tenant.isBlocked;
    if (tenant.source === "restaurant") {
      blockRestaurant.mutate({ id: tenant.id, block });
    } else {
      blockCompany.mutate({ id: tenant.id, block });
    }
  };

  const handleRegisterPayment = (tenant: TenantInfo) => {
    const payment = restaurantPayments.find((p: any) => p.restaurant_id === tenant.id);
    if (payment) {
      registerPayment.mutate({ paymentId: payment.id, restaurantId: tenant.id });
    }
  };

  const statusBadge = (status: PaymentStatus, isBlocked: boolean) => {
    if (isBlocked) return (
      <span className="inline-flex items-center gap-0.5 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full bg-destructive/15 text-destructive">
        <Ban className="w-2.5 h-2.5" /> BLOCCATO
      </span>
    );
    switch (status) {
      case "ok": return (
        <span className="inline-flex items-center gap-0.5 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
          <CheckCircle2 className="w-2.5 h-2.5" /> IN REGOLA
        </span>
      );
      case "trial": return (
        <span className="inline-flex items-center gap-0.5 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full bg-blue-500/15 text-blue-400">
          <Clock className="w-2.5 h-2.5" /> TRIAL
        </span>
      );
      case "warning": return (
        <span className="inline-flex items-center gap-0.5 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full bg-amber-500/15 text-amber-400">
          <AlertTriangle className="w-2.5 h-2.5" /> SCADENZA
        </span>
      );
      case "overdue": return (
        <span className="inline-flex items-center gap-0.5 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full bg-red-500/15 text-red-400">
          <ShieldAlert className="w-2.5 h-2.5" /> SCADUTO
        </span>
      );
      default: return (
        <span className="inline-flex items-center gap-0.5 text-[0.45rem] font-bold px-1.5 py-0.5 rounded-full bg-muted/30 text-muted-foreground">
          <Eye className="w-2.5 h-2.5" /> N/D
        </span>
      );
    }
  };

  return (
    <div className="space-y-2">
      {/* ═══ Status Summary Cards ═══ */}
      <div className="grid grid-cols-3 gap-1.5">
        <button
          onClick={() => setStatusFilter(statusFilter === "ok" ? "all" : "ok")}
          className={`rounded-xl p-2 border transition-all text-center ${statusFilter === "ok" ? "border-emerald-500/40 bg-emerald-500/10" : "border-border/20 bg-secondary/20"}`}
        >
          <CheckCircle2 className="w-4 h-4 mx-auto text-emerald-400 mb-0.5" />
          <p className="text-lg font-bold text-emerald-400">{statusCounts.ok}</p>
          <p className="text-[0.45rem] text-muted-foreground">In Regola</p>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "warning" ? "all" : "warning")}
          className={`rounded-xl p-2 border transition-all text-center ${statusFilter === "warning" ? "border-amber-500/40 bg-amber-500/10" : "border-border/20 bg-secondary/20"}`}
        >
          <AlertTriangle className="w-4 h-4 mx-auto text-amber-400 mb-0.5" />
          <p className="text-lg font-bold text-amber-400">{statusCounts.warning}</p>
          <p className="text-[0.45rem] text-muted-foreground">Attenzione</p>
        </button>
        <button
          onClick={() => setStatusFilter(statusFilter === "blocked" ? "all" : "blocked")}
          className={`rounded-xl p-2 border transition-all text-center ${statusFilter === "blocked" ? "border-destructive/40 bg-destructive/10" : "border-border/20 bg-secondary/20"}`}
        >
          <Ban className="w-4 h-4 mx-auto text-destructive mb-0.5" />
          <p className="text-lg font-bold text-destructive">{statusCounts.blocked}</p>
          <p className="text-[0.45rem] text-muted-foreground">Bloccati</p>
        </button>
      </div>

      {/* ═══ Filters ═══ */}
      <div className="flex gap-1.5">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3 h-3 text-muted-foreground" />
          <Input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Cerca account..."
            className="pl-7 h-7 text-[0.6rem] bg-secondary/40 border-border/30"
          />
        </div>
        <select
          value={industryFilter}
          onChange={e => setIndustryFilter(e.target.value)}
          className="h-7 px-2 rounded-lg bg-secondary/40 border border-border/30 text-[0.55rem] text-foreground"
        >
          <option value="all">Tutti</option>
          {industries.map(ind => <option key={ind} value={ind}>{ind}</option>)}
        </select>
      </div>

      {/* ═══ Summary ═══ */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-secondary/30 border border-border/20">
        <span className="text-[0.55rem] text-muted-foreground">{filtered.length} account</span>
        <div className="flex items-center gap-2">
          {statusFilter !== "all" && (
            <button onClick={() => setStatusFilter("all")} className="text-[0.5rem] text-primary underline">
              Mostra tutti
            </button>
          )}
          <span className="text-[0.55rem] text-primary font-semibold">{tenants.length} totali</span>
        </div>
      </div>

      {/* ═══ Tenant List ═══ */}
      {filtered.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-6">Nessun account trovato</p>
      ) : (
        <div className="space-y-1">
          {filtered.map((tenant, idx) => {
            const isExpanded = expandedTenant === tenant.id;
            const integrations = getIntegrationsForTenant(tenant);
            const activeCount = integrations.filter(i => isActive(tenant.id, i)).length;
            const color = INDUSTRY_COLORS[tenant.industry] || "hsl(var(--primary))";
            const payment = restaurantPayments.find((p: any) => p.restaurant_id === tenant.id);

            return (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.015 }}
                className={`rounded-xl border overflow-hidden bg-secondary/20 ${
                  tenant.isBlocked ? "border-destructive/30" :
                  tenant.paymentStatus === "warning" ? "border-amber-500/30" :
                  tenant.paymentStatus === "overdue" ? "border-red-500/30" :
                  "border-border/30"
                }`}
              >
                <button
                  onClick={() => setExpandedTenant(isExpanded ? null : tenant.id)}
                  className="w-full flex items-center gap-2 p-2 hover:bg-secondary/40 transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-bold shrink-0 relative"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {tenant.name?.charAt(0)?.toUpperCase() || "?"}
                    {tenant.isBlocked && (
                      <div className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-destructive border border-background" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[0.65rem] font-semibold truncate ${tenant.isBlocked ? "text-destructive line-through" : "text-foreground"}`}>
                      {tenant.name}
                    </p>
                    <div className="flex gap-1 mt-0.5 flex-wrap">
                      <Badge variant="outline" className="text-[0.4rem] h-3 px-1" style={{ borderColor: color, color }}>
                        {tenant.industry}
                      </Badge>
                      {statusBadge(tenant.paymentStatus, tenant.isBlocked)}
                    </div>
                  </div>
                  <div className="text-right shrink-0 mr-1">
                    {payment ? (
                      <>
                        <span className="text-[0.55rem] font-bold text-foreground">
                          {payment.installments_paid}/{payment.installments_total}
                        </span>
                        <p className="text-[0.4rem] text-muted-foreground">rate</p>
                      </>
                    ) : (
                      <>
                        <span className="text-[0.55rem] font-bold" style={{ color }}>
                          {activeCount}/{integrations.length}
                        </span>
                        <p className="text-[0.4rem] text-muted-foreground">attive</p>
                      </>
                    )}
                  </div>
                  {isExpanded ? <ChevronUp className="w-3 h-3 text-muted-foreground shrink-0" /> : <ChevronDown className="w-3 h-3 text-muted-foreground shrink-0" />}
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-2 pb-2 space-y-2 border-t border-border/20 pt-2">

                        {/* ═══ Payment Panel ═══ */}
                        <div className={`rounded-xl p-2.5 border space-y-2 ${
                          tenant.isBlocked ? "bg-destructive/5 border-destructive/20" :
                          tenant.paymentStatus === "overdue" ? "bg-red-500/5 border-red-500/20" :
                          tenant.paymentStatus === "warning" ? "bg-amber-500/5 border-amber-500/20" :
                          "bg-emerald-500/5 border-emerald-500/20"
                        }`}>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <CreditCard className="w-3.5 h-3.5 text-foreground" />
                              <span className="text-[0.6rem] font-bold text-foreground">Stato Pagamenti</span>
                            </div>
                            {statusBadge(tenant.paymentStatus, tenant.isBlocked)}
                          </div>

                          {payment ? (
                            <div className="space-y-1.5">
                              <div className="grid grid-cols-3 gap-1">
                                <div className="rounded-lg bg-background/60 p-1.5 text-center">
                                  <p className="text-[0.5rem] text-muted-foreground">Pagato</p>
                                  <p className="text-xs font-bold text-foreground">€{payment.amount_paid?.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg bg-background/60 p-1.5 text-center">
                                  <p className="text-[0.5rem] text-muted-foreground">Totale</p>
                                  <p className="text-xs font-bold text-foreground">€{payment.total_amount?.toLocaleString()}</p>
                                </div>
                                <div className="rounded-lg bg-background/60 p-1.5 text-center">
                                  <p className="text-[0.5rem] text-muted-foreground">Rate</p>
                                  <p className="text-xs font-bold text-foreground">{payment.installments_paid}/{payment.installments_total}</p>
                                </div>
                              </div>

                              {/* Progress bar */}
                              <div className="w-full h-1.5 rounded-full bg-muted/20 overflow-hidden">
                                <div
                                  className={`h-full rounded-full transition-all ${
                                    payment.installments_paid >= payment.installments_total ? "bg-emerald-400" :
                                    payment.is_overdue ? "bg-destructive" : "bg-primary"
                                  }`}
                                  style={{ width: `${Math.min(100, (payment.installments_paid / payment.installments_total) * 100)}%` }}
                                />
                              </div>

                              {payment.next_due_date && (
                                <div className="flex items-center justify-between">
                                  <span className="text-[0.5rem] text-muted-foreground flex items-center gap-1">
                                    <Clock className="w-2.5 h-2.5" />
                                    Prossima rata: {new Date(payment.next_due_date).toLocaleDateString("it-IT")}
                                  </span>
                                  {tenant.warningDays <= 3 && tenant.warningDays > 0 && (
                                    <span className="text-[0.45rem] font-bold text-amber-400">
                                      ⚠️ Scade tra {tenant.warningDays}g
                                    </span>
                                  )}
                                </div>
                              )}

                              {/* Register payment button */}
                              {payment.installments_paid < payment.installments_total && (
                                <Button
                                  size="sm"
                                  onClick={(e) => { e.stopPropagation(); handleRegisterPayment(tenant); }}
                                  className="w-full h-7 text-[0.55rem] bg-emerald-600 hover:bg-emerald-700 text-white"
                                  disabled={registerPayment.isPending}
                                >
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  Registra Pagamento Rata {payment.installments_paid + 1}
                                </Button>
                              )}
                            </div>
                          ) : tenant.trialEnd ? (
                            <div className="text-[0.55rem] text-muted-foreground">
                              <Clock className="w-3 h-3 inline mr-1" />
                              Trial fino al {new Date(tenant.trialEnd).toLocaleDateString("it-IT")}
                              {new Date(tenant.trialEnd) < new Date() && (
                                <span className="text-destructive font-bold ml-1">— SCADUTO</span>
                              )}
                            </div>
                          ) : (
                            <p className="text-[0.5rem] text-muted-foreground">Nessun piano pagamento attivo</p>
                          )}
                        </div>

                        {/* ═══ Manual Block/Unblock ═══ */}
                        <div className="flex gap-1.5">
                          <Button
                            size="sm"
                            variant={tenant.isBlocked ? "default" : "destructive"}
                            onClick={(e) => { e.stopPropagation(); handleToggleBlock(tenant); }}
                            className="flex-1 h-7 text-[0.55rem]"
                            disabled={blockRestaurant.isPending || blockCompany.isPending}
                          >
                            {tenant.isBlocked ? (
                              <><RefreshCw className="w-3 h-3 mr-1" /> Riattiva Account</>
                            ) : (
                              <><Ban className="w-3 h-3 mr-1" /> Blocca Account</>
                            )}
                          </Button>
                        </div>

                        {tenant.blockedReason && (
                          <p className="text-[0.5rem] text-destructive bg-destructive/5 px-2 py-1 rounded-lg">
                            ⚠️ {tenant.blockedReason}
                          </p>
                        )}

                        {/* ═══ Plan & Integrations ═══ */}
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 mb-1">
                            <Zap className="w-2.5 h-2.5 text-primary" />
                            <span className="text-[0.5rem] text-muted-foreground">
                              Piano: <strong className="text-foreground">{PLAN_LABELS[tenant.plan] || tenant.plan}</strong>
                            </span>
                          </div>

                          {integrations.map(intName => {
                            const active = isActive(tenant.id, intName);
                            const isPlanIncluded = (PLAN_INTEGRATIONS[tenant.plan] || []).includes(intName);

                            return (
                              <div
                                key={intName}
                                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg transition-colors ${
                                  active ? "bg-emerald-500/5 border border-emerald-500/15" : "bg-secondary/30 border border-border/20 opacity-50"
                                }`}
                              >
                                <div className={`w-1.5 h-1.5 rounded-full shrink-0 ${active ? "bg-emerald-400" : "bg-muted-foreground/30"}`} />
                                <div className="flex-1 min-w-0">
                                  <p className={`text-[0.6rem] font-semibold truncate ${active ? "text-foreground" : "text-muted-foreground line-through"}`}>{intName}</p>
                                  <span className="text-[0.4rem] text-muted-foreground">{isPlanIncluded ? "📦 Nel pacchetto" : "🔧 Add-on settore"}</span>
                                </div>
                                <button
                                  onClick={(e) => { e.stopPropagation(); toggleIntegration(tenant.id, intName, active); }}
                                  className={`p-1 rounded-lg transition-all ${
                                    active ? "bg-emerald-500/20 text-emerald-400 hover:bg-destructive/20 hover:text-destructive" : "bg-secondary/50 text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-400"
                                  }`}
                                >
                                  {active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ═══ Kill-Switch Info ═══ */}
      <div className="flex items-start gap-2 px-3 py-2 rounded-lg border border-empire-violet/15 bg-empire-violet/[0.03]">
        <ShieldCheck className="w-3.5 h-3.5 text-empire-violet shrink-0 mt-0.5" />
        <p className="text-[0.5rem] text-muted-foreground leading-relaxed">
          <strong className="text-foreground">Kill-Switch Automatico:</strong> Gli account con rate scadute vengono bloccati automaticamente dopo il periodo di grazia. 
          Avviso inviato 3 giorni prima della scadenza. Riattivazione automatica al pagamento.
        </p>
      </div>
    </div>
  );
}
