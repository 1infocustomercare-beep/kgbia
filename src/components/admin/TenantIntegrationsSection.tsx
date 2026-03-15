import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Building2, ChevronDown, ChevronUp, Power, PowerOff, ToggleLeft, ToggleRight, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";

const INDUSTRY_COLORS: Record<string, string> = {
  food: "#C8963E", ncc: "#1E3A5F", beauty: "#E91E8C", healthcare: "#10B981",
  fitness: "#F97316", retail: "#8B5CF6", hospitality: "#0EA5E9", beach: "#06B6D4",
  plumber: "#6366F1", electrician: "#EAB308", construction: "#78716C",
};

const PLAN_LABELS: Record<string, string> = {
  essential: "Essential", smart_ia: "Smart IA", empire_pro: "Empire Pro",
  digital_start: "Digital Start", growth_ai: "Growth AI", empire_domination: "Empire",
};

// Default integrations each tenant gets based on their plan
const PLAN_INTEGRATIONS: Record<string, string[]> = {
  essential: ["Lovable Cloud", "Lovable AI Gateway"],
  smart_ia: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Meta Business"],
  empire_pro: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Stripe Platform", "Meta Business", "Google My Business"],
  digital_start: ["Lovable Cloud", "Lovable AI Gateway"],
  growth_ai: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Stripe Platform"],
  empire_domination: ["Lovable Cloud", "Lovable AI Gateway", "ElevenLabs", "Stripe Platform", "Meta Business", "Google My Business", "Google Analytics"],
};

const SECTOR_INTEGRATIONS: Record<string, string[]> = {
  food: ["Fatturazione SDI", "Delivery API", "Stampante ESC/POS"],
  ncc: ["Google Maps", "WhatsApp Business", "Stripe NCC"],
  beauty: ["Google Calendar", "SMS Twilio"],
  healthcare: ["Telemedicina", "HL7/FHIR"],
  hospitality: ["Channel Manager", "PMS Integration"],
  retail: ["POS Integration", "Shopify/Woo"],
};

interface TenantInfo {
  id: string;
  name: string;
  industry: string;
  plan: string;
}

export default function TenantIntegrationsSection() {
  const [search, setSearch] = useState("");
  const [industryFilter, setIndustryFilter] = useState("all");
  const [expandedTenant, setExpandedTenant] = useState<string | null>(null);
  // Per-tenant integration overrides: { tenantId: { integrationName: boolean } }
  const [overrides, setOverrides] = useState<Record<string, Record<string, boolean>>>({});

  const { data: companies = [] } = useQuery({
    queryKey: ["admin-companies-list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("companies").select("id, name, industry, subscription_plan");
      if (error) throw error;
      return data || [];
    },
  });

  const { data: restaurants = [] } = useQuery({
    queryKey: ["admin-restaurants-list-tenants"],
    queryFn: async () => {
      const { data, error } = await supabase.from("restaurants").select("id, name, slug");
      if (error) throw error;
      return data || [];
    },
  });

  const tenants = useMemo(() => {
    const list: TenantInfo[] = [];
    const seen = new Set<string>();
    companies.forEach((c: any) => {
      list.push({ id: c.id, name: c.name, industry: c.industry || "custom", plan: c.subscription_plan || "essential" });
      seen.add(c.id);
    });
    restaurants.forEach((r: any) => {
      if (!seen.has(r.id)) {
        list.push({ id: r.id, name: r.name, industry: "food", plan: "essential" });
      }
    });
    return list;
  }, [companies, restaurants]);

  const industries = useMemo(() => [...new Set(tenants.map(t => t.industry))].sort(), [tenants]);

  const filtered = useMemo(() => {
    return tenants.filter(t => {
      if (industryFilter !== "all" && t.industry !== industryFilter) return false;
      if (search && !t.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [tenants, industryFilter, search]);

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

  const isActive = (tenantId: string, intName: string, defaultActive: boolean) => {
    return overrides[tenantId]?.[intName] ?? defaultActive;
  };

  return (
    <div className="space-y-2">
      {/* Filters */}
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

      {/* Summary */}
      <div className="flex items-center justify-between px-2 py-1.5 rounded-lg bg-secondary/30 border border-border/20">
        <span className="text-[0.55rem] text-muted-foreground">{filtered.length} account</span>
        <span className="text-[0.55rem] text-primary font-semibold">{tenants.length} totali</span>
      </div>

      {/* Tenant list */}
      {filtered.length === 0 ? (
        <p className="text-center text-xs text-muted-foreground py-6">Nessun account trovato</p>
      ) : (
        <div className="space-y-1">
          {filtered.map((tenant, idx) => {
            const isExpanded = expandedTenant === tenant.id;
            const integrations = getIntegrationsForTenant(tenant);
            const activeCount = integrations.filter(i => isActive(tenant.id, i, true)).length;
            const color = INDUSTRY_COLORS[tenant.industry] || "hsl(var(--primary))";

            return (
              <motion.div
                key={tenant.id}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.015 }}
                className="rounded-xl border border-border/30 overflow-hidden bg-secondary/20"
              >
                <button
                  onClick={() => setExpandedTenant(isExpanded ? null : tenant.id)}
                  className="w-full flex items-center gap-2 p-2 hover:bg-secondary/40 transition-colors text-left"
                >
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-[0.6rem] font-bold shrink-0"
                    style={{ backgroundColor: `${color}20`, color }}
                  >
                    {tenant.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[0.65rem] font-semibold text-foreground truncate">{tenant.name}</p>
                    <div className="flex gap-1 mt-0.5">
                      <Badge variant="outline" className="text-[0.4rem] h-3 px-1" style={{ borderColor: color, color }}>{tenant.industry}</Badge>
                      <Badge variant="secondary" className="text-[0.4rem] h-3 px-1">{PLAN_LABELS[tenant.plan] || tenant.plan}</Badge>
                    </div>
                  </div>
                  <div className="text-right shrink-0 mr-1">
                    <span className="text-[0.55rem] font-bold" style={{ color }}>{activeCount}/{integrations.length}</span>
                    <p className="text-[0.4rem] text-muted-foreground">attive</p>
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
                      <div className="px-2 pb-2 space-y-0.5 border-t border-border/20 pt-1.5">
                        {/* Plan label */}
                        <div className="flex items-center gap-1 mb-1">
                          <Zap className="w-2.5 h-2.5 text-primary" />
                          <span className="text-[0.5rem] text-muted-foreground">
                            Piano: <strong className="text-foreground">{PLAN_LABELS[tenant.plan] || tenant.plan}</strong>
                            {tenant.plan.includes("domination") || tenant.plan === "empire_pro" ? " — Tutto incluso" : " — Base + settore"}
                          </span>
                        </div>

                        {integrations.map(intName => {
                          const active = isActive(tenant.id, intName, true);
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
                                <p className={`text-[0.6rem] font-semibold truncate ${active ? "text-foreground" : "text-muted-foreground line-through"}`}>
                                  {intName}
                                </p>
                                <span className="text-[0.4rem] text-muted-foreground">
                                  {isPlanIncluded ? "📦 Nel pacchetto" : "🔧 Add-on settore"}
                                </span>
                              </div>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleIntegration(tenant.id, intName, active);
                                }}
                                className={`p-1 rounded-lg transition-all ${
                                  active
                                    ? "bg-emerald-500/20 text-emerald-400 hover:bg-destructive/20 hover:text-destructive"
                                    : "bg-secondary/50 text-muted-foreground hover:bg-emerald-500/20 hover:text-emerald-400"
                                }`}
                              >
                                {active ? <Power className="w-3 h-3" /> : <PowerOff className="w-3 h-3" />}
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
