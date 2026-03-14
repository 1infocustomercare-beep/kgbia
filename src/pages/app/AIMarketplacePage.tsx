import { useState } from "react";
import { useIndustry } from "@/hooks/useIndustry";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Star, CheckCircle, Sparkles, Zap, Settings, Activity, BarChart3, Clock } from "lucide-react";
import { toast } from "sonner";
import { motion } from "framer-motion";

import agentConcierge from "@/assets/agent-concierge-ai.png";
import agentAnalytics from "@/assets/agent-analytics-brain.png";
import agentSocial from "@/assets/agent-social-manager.png";
import agentSales from "@/assets/agent-sales-closer.png";
import agentDocument from "@/assets/agent-document-ai.png";
import agentNotifier from "@/assets/agent-smart-notifier.png";
import agentCompliance from "@/assets/agent-compliance-guardian.png";
import agentFood from "@/assets/agent-ops-food.png";
import agentNCC from "@/assets/agent-ops-ncc.png";
import agentBeauty from "@/assets/agent-ops-beauty.png";
import agentHealthcare from "@/assets/agent-ops-healthcare.png";
import agentConstruction from "@/assets/agent-ops-construction.png";

type AgentType = "autonomous" | "analyzer" | "generator" | "monitor";

interface AgentDef {
  id: string;
  name: string;
  type: AgentType;
  description: string;
  skills: string[];
  price: string;
  rating: number;
  activations: number;
  image: string;
  sectors: string[] | "all";
  color: string;
}

const TYPE_LABELS: Record<AgentType, { label: string; class: string }> = {
  autonomous: { label: "AUTONOMO", class: "bg-emerald-500 text-white" },
  analyzer: { label: "ANALIZZATORE", class: "bg-amber-500 text-black" },
  generator: { label: "GENERATORE", class: "bg-violet-500 text-white" },
  monitor: { label: "MONITOR", class: "bg-red-500 text-white" },
};

const AGENTS: AgentDef[] = [
  { id: "concierge", name: "Empire Concierge AI", type: "autonomous", description: "Receptionist multi-canale: WhatsApp, Chat, Email. Prenota appuntamenti in autonomia, qualifica lead, gestisce reclami.", skills: ["answer_faq", "book_appointment", "qualify_lead", "handle_complaint", "upsell_suggest", "multilingual"], price: "Incluso da Professional | €99/mese", rating: 4.8, activations: 1247, image: agentConcierge, sectors: "all", color: "#3B82F6" },
  { id: "analytics", name: "Empire Analytics Brain", type: "analyzer", description: "Revenue forecast, churn prediction, peak analysis, anomaly detection, CEO weekly brief.", skills: ["revenue_forecast", "churn_predictor", "peak_analyzer", "anomaly_detector", "ceo_weekly_brief"], price: "Incluso da Enterprise | €149/mese", rating: 4.7, activations: 892, image: agentAnalytics, sectors: "all", color: "#A855F7" },
  { id: "social", name: "Empire Social Manager AI", type: "generator", description: "Piano editoriale, post automatici, risposte recensioni, competitor watch, story generator.", skills: ["content_calendar", "auto_post", "review_responder", "competitor_monitor", "story_generator"], price: "€79/mese", rating: 4.6, activations: 1089, image: agentSocial, sectors: "all", color: "#EC4899" },
  { id: "sales", name: "Empire Sales Closer AI", type: "autonomous", description: "Lead scoring, follow-up automatico, preventivi AI, referral program, pipeline reporter.", skills: ["lead_scorer", "auto_followup", "quote_generator", "referral_manager", "pipeline_reporter"], price: "€129/mese", rating: 4.5, activations: 634, image: agentSales, sectors: "all", color: "#10B981" },
  { id: "document", name: "Empire Document AI", type: "generator", description: "Fatture, preventivi, contratti, report, certificati generati in automatico.", skills: ["invoice_generator", "quote_builder", "contract_creator", "report_builder", "certificate_maker"], price: "€49/mese", rating: 4.9, activations: 2103, image: agentDocument, sectors: "all", color: "#06B6D4" },
  { id: "notifier", name: "Empire Smart Notifier", type: "monitor", description: "Scelta canale intelligente, timing optimizer, A/B test, frequency cap, escalation chain.", skills: ["channel_selector", "timing_optimizer", "ab_tester", "frequency_manager", "escalation_chain"], price: "Incluso da Professional", rating: 4.4, activations: 1876, image: agentNotifier, sectors: "all", color: "#EF4444" },
  { id: "compliance", name: "Empire Compliance Guardian", type: "monitor", description: "GDPR, scadenze fiscali, certificazioni, contratti, backup e audit trail.", skills: ["gdpr_monitor", "tax_deadline_tracker", "cert_expiry_alert", "contract_monitor", "backup_verifier"], price: "€59/mese", rating: 4.6, activations: 723, image: agentCompliance, sectors: "all", color: "#1E3A5F" },
  { id: "ops-food", name: "Operations AI — Food", type: "autonomous", description: "KDS, food cost, waste tracker, inventory AI, HACCP monitor per ristorazione.", skills: ["kds_manager", "food_cost_ai", "waste_tracker", "inventory_predictor", "haccp_monitor"], price: "€149/mese", rating: 4.7, activations: 456, image: agentFood, sectors: ["food"], color: "#F97316" },
  { id: "ops-ncc", name: "Operations AI — NCC", type: "autonomous", description: "Fleet map, dynamic pricing, driver dispatch, flight monitor per NCC.", skills: ["fleet_tracker", "dynamic_pricing", "driver_dispatch", "flight_monitor"], price: "€199/mese", rating: 4.8, activations: 312, image: agentNCC, sectors: ["ncc"], color: "#1E293B" },
  { id: "ops-beauty", name: "Operations AI — Beauty", type: "autonomous", description: "Smart booking AI, staff commission, loyalty gamification per saloni.", skills: ["smart_booking", "staff_commission", "loyalty_gamify", "virtual_tryon"], price: "€99/mese", rating: 4.5, activations: 567, image: agentBeauty, sectors: ["beauty"], color: "#EC4899" },
  { id: "ops-healthcare", name: "Operations AI — Healthcare", type: "autonomous", description: "Triage AI, prescription manager, telemedicine, lab integration.", skills: ["triage_ai", "prescription_mgr", "telemedicine", "lab_integration"], price: "€249/mese", rating: 4.9, activations: 198, image: agentHealthcare, sectors: ["healthcare"], color: "#10B981" },
  { id: "ops-construction", name: "Operations AI — Construction", type: "autonomous", description: "Gantt tracker, safety compliance, material planner, subcontractor portal.", skills: ["gantt_tracker", "safety_compliance", "material_planner", "subcontractor_portal"], price: "€199/mese", rating: 4.6, activations: 234, image: agentConstruction, sectors: ["construction"], color: "#F59E0B" },
];

export default function AIMarketplacePage() {
  const { industry, companyId } = useIndustry();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<string>("all");
  const [selected, setSelected] = useState<AgentDef | null>(null);
  const [configTab, setConfigTab] = useState("info");

  const { data: configs = [] } = useQuery({
    queryKey: ["ai-agent-configs-marketplace"],
    queryFn: async () => {
      const { data } = await supabase.from("ai_agent_configs").select("*");
      return data || [];
    },
  });

  const toggleAgent = useMutation({
    mutationFn: async ({ agentId, enabled }: { agentId: string; enabled: boolean }) => {
      const existing = configs.find((c: any) => c.agent_name === agentId);
      if (existing) {
        await supabase.from("ai_agent_configs").update({ is_enabled: enabled }).eq("id", existing.id);
      } else {
        await supabase.from("ai_agent_configs").insert({ agent_name: agentId, is_enabled: enabled });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-configs-marketplace"] });
      toast.success("Stato agent aggiornato");
    },
  });

  const isEnabled = (agentId: string) => {
    const c = configs.find((c: any) => c.agent_name === agentId);
    return c?.is_enabled ?? false;
  };

  const visibleAgents = AGENTS.filter(a => {
    if (a.sectors !== "all" && industry && !a.sectors.includes(industry)) return false;
    if (filter !== "all" && a.type !== filter) return false;
    if (search && !a.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = AGENTS.filter(a => isEnabled(a.id)).length;

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            AI Marketplace
          </h1>
          <p className="text-sm text-muted-foreground">I tuoi Agent attivi: {activeCount}/{AGENTS.length}</p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input placeholder="Cerca agent..." className="pl-10" value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <Tabs value={filter} onValueChange={setFilter}>
          <TabsList>
            <TabsTrigger value="all">Tutti</TabsTrigger>
            <TabsTrigger value="autonomous">Autonomi</TabsTrigger>
            <TabsTrigger value="analyzer">Analizzatori</TabsTrigger>
            <TabsTrigger value="generator">Generatori</TabsTrigger>
            <TabsTrigger value="monitor">Monitor</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleAgents.map((agent, i) => {
          const enabled = isEnabled(agent.id);
          return (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.05 }}
            >
              <Card
                className={`relative overflow-hidden border-border/50 hover:border-primary/40 transition-all cursor-pointer group ${!enabled ? "opacity-70 grayscale-[30%]" : ""}`}
                onClick={() => { setSelected(agent); setConfigTab("info"); }}
              >
                {/* Glow effect when active */}
                {enabled && (
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
                )}

                {/* AI Powered shimmer badge */}
                <div className="absolute top-3 right-3">
                  <Badge className="bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-[10px] animate-pulse">
                    AI POWERED
                  </Badge>
                </div>

                <CardContent className="p-4 space-y-3">
                  <div className="flex items-start gap-3">
                    <div className={`w-14 h-14 rounded-xl overflow-hidden shrink-0 ring-2 ${enabled ? "ring-primary/50" : "ring-border/30"}`}>
                      <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm leading-tight">{agent.name}</h3>
                      <Badge className={`${TYPE_LABELS[agent.type].class} text-[10px] mt-1`}>
                        {TYPE_LABELS[agent.type].label}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs text-muted-foreground line-clamp-2">{agent.description}</p>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <div className="flex items-center gap-0.5">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                      <span>{agent.rating}</span>
                    </div>
                    <span>•</span>
                    <span>{agent.activations.toLocaleString()} attivazioni</span>
                  </div>

                  <div className="grid grid-cols-2 gap-1">
                    {agent.skills.slice(0, 4).map(s => (
                      <div key={s} className="flex items-center gap-1 text-[11px] text-muted-foreground">
                        <CheckCircle className="w-3 h-3 text-emerald-500" />
                        <span className="truncate">{s.replace(/_/g, " ")}</span>
                      </div>
                    ))}
                  </div>

                  <div className="text-xs font-medium text-muted-foreground">{agent.price}</div>

                  <div className="flex items-center justify-between pt-1 border-t border-border/30">
                    <Button
                      size="sm"
                      variant={enabled ? "default" : "outline"}
                      className="text-xs h-8"
                      onClick={e => {
                        e.stopPropagation();
                        toggleAgent.mutate({ agentId: agent.id, enabled: !enabled });
                      }}
                    >
                      {enabled ? "✓ Attivo" : "Attiva"}
                    </Button>
                    <Button size="sm" variant="ghost" className="text-xs h-8" onClick={e => { e.stopPropagation(); setSelected(agent); setConfigTab("config"); }}>
                      <Settings className="w-3.5 h-3.5 mr-1" />Configura
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {/* Agent Detail Sheet */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          {selected && <AgentDetailSheet agent={selected} configs={configs} configTab={configTab} setConfigTab={setConfigTab} />}
        </SheetContent>
      </Sheet>
    </motion.div>
  );
}

function AgentDetailSheet({ agent, configs, configTab, setConfigTab }: { agent: AgentDef; configs: any[]; configTab: string; setConfigTab: (t: string) => void }) {
  const queryClient = useQueryClient();
  const config = configs.find((c: any) => c.agent_name === agent.id);
  const [toneOfVoice, setToneOfVoice] = useState("professionale");
  const [customRules, setCustomRules] = useState(config?.system_prompt_override || "");
  const [testMode, setTestMode] = useState(false);

  const saveConfig = useMutation({
    mutationFn: async () => {
      const payload = { agent_name: agent.id, system_prompt_override: customRules, is_enabled: config?.is_enabled ?? true };
      if (config) {
        await supabase.from("ai_agent_configs").update(payload).eq("id", config.id);
      } else {
        await supabase.from("ai_agent_configs").insert(payload);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ai-agent-configs-marketplace"] });
      toast.success("Configurazione salvata");
    },
  });

  return (
    <div className="space-y-6">
      <SheetHeader>
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-xl overflow-hidden ring-2 ring-primary/30">
            <img src={agent.image} alt={agent.name} className="w-full h-full object-cover" />
          </div>
          <div>
            <SheetTitle className="text-lg">{agent.name}</SheetTitle>
            <Badge className={`${TYPE_LABELS[agent.type].class} text-[10px]`}>{TYPE_LABELS[agent.type].label}</Badge>
          </div>
        </div>
      </SheetHeader>

      <Tabs value={configTab} onValueChange={setConfigTab}>
        <TabsList className="w-full">
          <TabsTrigger value="info" className="flex-1">Info</TabsTrigger>
          <TabsTrigger value="config" className="flex-1">Configura</TabsTrigger>
          <TabsTrigger value="stats" className="flex-1">Stats</TabsTrigger>
          <TabsTrigger value="log" className="flex-1">Log</TabsTrigger>
        </TabsList>
      </Tabs>

      {configTab === "info" && (
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">{agent.description}</p>
          <div>
            <h4 className="font-medium text-sm mb-2">Skills</h4>
            <div className="space-y-2">
              {agent.skills.map(s => (
                <div key={s} className="flex items-center justify-between p-2 rounded-lg bg-muted/30">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                    <span className="text-sm capitalize">{s.replace(/_/g, " ")}</span>
                  </div>
                  <Switch defaultChecked />
                </div>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-muted/30">
            <div className="flex items-center gap-2 text-sm font-medium mb-1">
              <Star className="w-4 h-4 fill-amber-400 text-amber-400" />{agent.rating}/5.0
            </div>
            <p className="text-xs text-muted-foreground">{agent.activations.toLocaleString()} attivazioni globali</p>
          </div>
          <div className="text-sm"><strong>Prezzo:</strong> {agent.price}</div>
        </div>
      )}

      {configTab === "config" && (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Canali attivi</Label>
            <div className="space-y-2">
              {["WhatsApp", "Email", "SMS", "Chat"].map(ch => (
                <div key={ch} className="flex items-center justify-between p-2 rounded bg-muted/30">
                  <span className="text-sm">{ch}</span>
                  <Switch defaultChecked={ch !== "SMS"} />
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <Label>Orari attività</Label>
            <Select defaultValue="business">
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="24_7">24/7</SelectItem>
                <SelectItem value="business">8:00 - 20:00</SelectItem>
                <SelectItem value="workdays">Lun-Ven 9-18</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Tone of voice</Label>
            <Select value={toneOfVoice} onValueChange={setToneOfVoice}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="formale">Formale</SelectItem>
                <SelectItem value="amichevole">Amichevole</SelectItem>
                <SelectItem value="professionale">Professionale</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Regole personalizzate</Label>
            <Textarea value={customRules} onChange={e => setCustomRules(e.target.value)} placeholder='Es: "Non offrire sconti sopra il 15%"' rows={4} />
          </div>
          <div className="flex items-center justify-between p-3 rounded-lg bg-muted/30">
            <div>
              <p className="text-sm font-medium">Test Mode</p>
              <p className="text-xs text-muted-foreground">Esegui ma non invia messaggi reali</p>
            </div>
            <Switch checked={testMode} onCheckedChange={setTestMode} />
          </div>
          <Button className="w-full" onClick={() => saveConfig.mutate()}>Salva Configurazione</Button>
        </div>
      )}

      {configTab === "stats" && (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Esecuzioni", value: "1,247", icon: Activity },
              { label: "Success Rate", value: "98.5%", icon: CheckCircle },
              { label: "Costo mese", value: "€23.40", icon: BarChart3 },
              { label: "Tempo medio", value: "1.2s", icon: Clock },
            ].map(s => (
              <Card key={s.label} className="border-border/30">
                <CardContent className="p-3 text-center">
                  <s.icon className="w-5 h-5 mx-auto mb-1 text-primary" />
                  <p className="text-lg font-bold">{s.value}</p>
                  <p className="text-[11px] text-muted-foreground">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="h-40 rounded-lg bg-muted/20 border border-border/30 flex items-center justify-center text-sm text-muted-foreground">
            📊 Grafico utilizzo ultimi 30gg
          </div>
        </div>
      )}

      {configTab === "log" && (
        <div className="space-y-2">
          {[
            { time: "14:32", action: "Risposta FAQ", status: "success" },
            { time: "14:28", action: "Prenotazione creata", status: "success" },
            { time: "14:15", action: "Lead qualificato → Caldo", status: "success" },
            { time: "13:55", action: "Reclamo escalato a umano", status: "warning" },
            { time: "13:42", action: "Upsell suggerito", status: "success" },
          ].map((l, i) => (
            <div key={i} className="flex items-center gap-3 p-2 rounded bg-muted/20 text-sm">
              <span className="text-xs text-muted-foreground font-mono w-12">{l.time}</span>
              <span className="flex-1">{l.action}</span>
              <Badge variant={l.status === "success" ? "default" : "secondary"} className="text-[10px]">
                {l.status === "success" ? "✓" : "⚠"}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
