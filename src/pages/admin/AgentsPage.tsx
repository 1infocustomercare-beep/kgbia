import { useState, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Brain, RefreshCw, TrendingUp, DollarSign, Zap, Activity,
  Globe, Package, Camera, ScanLine, Star, BarChart3, Eye,
  Settings, Play, Download, FileSpreadsheet, AlertTriangle,
  XCircle, Info, ChevronRight, Clock, Hash, Search, Filter,
  ArrowUpRight, ArrowDownRight, Medal, ChevronDown, X, Send,
  ToggleLeft, ToggleRight, Check, Loader2, Sparkles
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { useQuery } from "@tanstack/react-query";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip,
  ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Legend, AreaChart, Area
} from "recharts";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// ─── Agent Definitions (discovered from codebase) ───
interface AgentDef {
  name: string;
  displayName: string;
  description: string;
  icon: string;
  color: string;
  model: string;
  modelBadgeColor: string;
  file: string;
  trigger: string;
  industries: string[];
  inputDesc: string;
  outputDesc: string;
  costPerCall: number;
}

const AGENTS: AgentDef[] = [
  {
    name: "empire-assistant",
    displayName: "Empire Assistant",
    description: "Chatbot IA contestuale 24/7 — supporto tecnico, analisi dati aziendali, consigli di gestione. Accede a ordini, menu, prenotazioni, clienti in tempo reale.",
    icon: "Brain",
    color: "#C8963E",
    model: "Gemini 3 Flash",
    modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/empire-assistant/index.ts",
    trigger: "On-demand (chat utente)",
    industries: ["food", "ncc", "beauty", "healthcare", "retail", "fitness", "hospitality"],
    inputDesc: "Messaggi chat + contesto ristorante (menu, ordini, prenotazioni, clienti, tavoli)",
    outputDesc: "Risposta streaming in italiano con dati reali dell'azienda",
    costPerCall: 0.003,
  },
  {
    name: "ai-menu-ocr",
    displayName: "Menu AI — OCR Scanner",
    description: "Scansiona foto di menu cartacei ed estrae automaticamente piatti, descrizioni, prezzi e categorie con vision multimodale.",
    icon: "ScanLine",
    color: "#F97316",
    model: "Gemini 2.5 Flash",
    modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/ai-menu/index.ts (action: ocr)",
    trigger: "On-demand (upload foto menu)",
    industries: ["food"],
    inputDesc: "Immagine base64 di un menu cartaceo",
    outputDesc: "JSON array di piatti con nome, descrizione, prezzo, categoria",
    costPerCall: 0.005,
  },
  {
    name: "ai-menu-image",
    displayName: "Menu AI — Foto Generator",
    description: "Genera immagini food-porn iper-realistiche per ogni piatto del menu con styling adattivo per categoria (pizza, pasta, dolci, ecc.).",
    icon: "Camera",
    color: "#EF4444",
    model: "Gemini 2.5 Flash Image",
    modelBadgeColor: "bg-emerald-500/20 text-emerald-400",
    file: "supabase/functions/ai-menu/index.ts (action: generate-image)",
    trigger: "On-demand (genera immagine piatto)",
    industries: ["food"],
    inputDesc: "Descrizione piatto + categoria per styling fotografico adattivo",
    outputDesc: "URL immagine generata (upload su Storage)",
    costPerCall: 0.008,
  },
  {
    name: "ai-translate",
    displayName: "Traduttore Menu IA",
    description: "Traduce automaticamente il menu in 10+ lingue con terminologia gastronomica naturale e appetitosa. Mantiene nomi iconici italiani.",
    icon: "Globe",
    color: "#3B82F6",
    model: "Gemini 3 Flash",
    modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/ai-translate/index.ts",
    trigger: "On-demand (traduzione menu)",
    industries: ["food"],
    inputDesc: "Array menu items (max 50) + lingue target (en, de, fr, es, zh, ja, ar, ru, pt, ko)",
    outputDesc: "JSON array di traduzioni per ogni piatto nelle lingue richieste",
    costPerCall: 0.004,
  },
  {
    name: "ai-inventory",
    displayName: "Inventario Predittivo IA",
    description: "Analizza ordini recenti e menu per prevedere scorte in esaurimento e suggerire il Piatto del Giorno con ingredienti in eccesso.",
    icon: "Package",
    color: "#8B5CF6",
    model: "Gemini 3 Flash",
    modelBadgeColor: "bg-blue-500/20 text-blue-400",
    file: "supabase/functions/ai-inventory/index.ts",
    trigger: "On-demand (analisi inventario)",
    industries: ["food"],
    inputDesc: "Restaurant ID + ultimi 50 ordini + menu attivo (nome, categoria, prezzo)",
    outputDesc: "Alert scorte con urgenza, suggerimento Piatto del Giorno, insights testuali",
    costPerCall: 0.003,
  },
];

const ICON_MAP: Record<string, any> = {
  Brain, ScanLine, Camera, Globe, Package, Star, Sparkles
};

const INDUSTRY_LABELS: Record<string, string> = {
  food: "🍽 Food", ncc: "🚗 NCC", beauty: "💇 Beauty", healthcare: "🏥 Salute",
  retail: "🛍 Retail", fitness: "💪 Fitness", hospitality: "🏨 Hotel",
};

const PIE_COLORS = ["#C8963E", "#F97316", "#EF4444", "#3B82F6", "#8B5CF6", "#10B981", "#EC4899"];

// ─── Mock data generator ───
function generateMockData() {
  const now = new Date();
  const days = Array.from({ length: 30 }, (_, i) => {
    const d = new Date(now);
    d.setDate(d.getDate() - (29 - i));
    return d.toISOString().slice(0, 10);
  });

  const dailyData = days.map(day => {
    const isWeekend = [0, 6].includes(new Date(day).getDay());
    const base = isWeekend ? 60 : 40;
    return {
      day: day.slice(5),
      "empire-assistant": Math.floor(base * (0.8 + Math.random() * 0.4)),
      "ai-menu-ocr": Math.floor(5 + Math.random() * 8),
      "ai-menu-image": Math.floor(10 + Math.random() * 15),
      "ai-translate": Math.floor(3 + Math.random() * 6),
      "ai-inventory": Math.floor(8 + Math.random() * 10),
    };
  });

  const topAccounts = [
    { name: "Ristorante Da Mario", industry: "food", calls: 1240, tokens: 1850000, cost: 18.50, trend: 12 },
    { name: "Pizzeria Vesuvio", industry: "food", calls: 890, tokens: 1200000, cost: 12.80, trend: -5 },
    { name: "NCC Executive Roma", industry: "ncc", calls: 620, tokens: 980000, cost: 9.20, trend: 23 },
    { name: "Glow Beauty Milano", industry: "beauty", calls: 450, tokens: 650000, cost: 6.10, trend: 8 },
    { name: "Trattoria Nonna Rosa", industry: "food", calls: 380, tokens: 520000, cost: 5.40, trend: -2 },
    { name: "Lido Azzurro Rimini", industry: "beach", calls: 310, tokens: 420000, cost: 4.30, trend: 45 },
    { name: "Farmacia Centrale", industry: "healthcare", calls: 280, tokens: 380000, cost: 3.80, trend: 15 },
    { name: "Palestra FitLife", industry: "fitness", calls: 220, tokens: 300000, cost: 2.90, trend: -10 },
    { name: "Hotel Belvedere", industry: "hospitality", calls: 190, tokens: 260000, cost: 2.60, trend: 7 },
    { name: "Boutique Eleganza", industry: "retail", calls: 140, tokens: 180000, cost: 1.80, trend: 30 },
  ];

  const recentLogs = Array.from({ length: 50 }, (_, i) => {
    const agent = AGENTS[Math.floor(Math.random() * AGENTS.length)];
    const account = topAccounts[Math.floor(Math.random() * topAccounts.length)];
    const d = new Date(now);
    d.setMinutes(d.getMinutes() - i * 12);
    const isError = Math.random() < 0.05;
    return {
      id: `log-${i}`,
      timestamp: d.toISOString(),
      agent: agent.name,
      account: account.name,
      industry: account.industry,
      inputTokens: Math.floor(200 + Math.random() * 2000),
      outputTokens: Math.floor(100 + Math.random() * 1500),
      cost: +(0.001 + Math.random() * 0.01).toFixed(4),
      duration: Math.floor(800 + Math.random() * 3000),
      status: isError ? "error" : "success",
    };
  });

  const alerts = [
    { id: "a1", type: "warning", agent: "empire-assistant", message: "L'account 'Ristorante Da Mario' ha superato l'80% del budget mensile AI (€18.50/€20.00)", isRead: false, createdAt: new Date(now.getTime() - 3600000).toISOString() },
    { id: "a2", type: "error", agent: "ai-menu-image", message: "L'agente 'Foto Generator' ha avuto 12 errori nell'ultima ora — possibile rate limit gateway", isRead: false, createdAt: new Date(now.getTime() - 7200000).toISOString() },
    { id: "a3", type: "info", agent: "ai-inventory", message: "L'agente 'Inventario Predittivo' non viene usato da 15 giorni dal settore NCC — considera di limitare i settori", isRead: true, createdAt: new Date(now.getTime() - 86400000).toISOString() },
  ];

  return { dailyData, topAccounts, recentLogs, alerts };
}

// ─── Agent Icon Component ───
function AgentIcon({ agent, size = 48, busy = false }: { agent: AgentDef; size?: number; busy?: boolean }) {
  const IconComponent = ICON_MAP[agent.icon] || Brain;
  return (
    <div
      className="relative rounded-xl flex items-center justify-center shrink-0"
      style={{
        width: size, height: size,
        background: `linear-gradient(135deg, ${agent.color}22, ${agent.color}44)`,
        border: `2px solid ${agent.color}66`,
      }}
    >
      {busy && (
        <div className="absolute inset-0 rounded-xl animate-pulse" style={{ border: `2px solid ${agent.color}` }} />
      )}
      <IconComponent className="w-1/2 h-1/2" style={{ color: agent.color }} />
    </div>
  );
}

// ─── Status Badge ───
function StatusBadge({ status }: { status: "active" | "standby" | "error" | "disabled" }) {
  const config = {
    active: { label: "Attivo", className: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", dot: "bg-emerald-400 animate-pulse" },
    standby: { label: "Standby", className: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", dot: "bg-yellow-400" },
    error: { label: "Errore", className: "bg-red-500/20 text-red-400 border-red-500/30", dot: "bg-red-400 animate-ping" },
    disabled: { label: "Disabilitato", className: "bg-muted text-muted-foreground border-border", dot: "bg-muted-foreground" },
  }[status];
  return (
    <Badge variant="outline" className={`${config.className} text-[10px] gap-1`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </Badge>
  );
}

// ─── Main Page ───
export default function AgentsPage() {
  const { user, roles } = useAuth();
  const navigate = useNavigate();
  const [selectedAgent, setSelectedAgent] = useState<AgentDef | null>(null);
  const [chartMode, setChartMode] = useState<"calls" | "cost">("calls");
  const [searchAccount, setSearchAccount] = useState("");
  const [testPrompt, setTestPrompt] = useState("");
  const [testResult, setTestResult] = useState("");
  const [testLoading, setTestLoading] = useState(false);

  const mock = useMemo(() => generateMockData(), []);

  // Redirect if not super_admin
  useEffect(() => {
    if (!roles.includes("super_admin")) {
      navigate("/app");
    }
  }, [roles, navigate]);

  // Query real agent configs
  const { data: agentConfigs } = useQuery({
    queryKey: ["ai-agent-configs"],
    queryFn: async () => {
      const { data } = await supabase.from("ai_agent_configs").select("*");
      return data || [];
    },
  });

  // Query real usage logs (last 24h count)
  const { data: todayLogs } = useQuery({
    queryKey: ["ai-usage-today"],
    queryFn: async () => {
      const yesterday = new Date(Date.now() - 86400000).toISOString();
      const { count } = await supabase
        .from("ai_usage_logs")
        .select("*", { count: "exact", head: true })
        .gte("created_at", yesterday);
      return count || 0;
    },
  });

  // KPI calculations from mock
  const totalCallsMonth = mock.dailyData.reduce((s, d) =>
    s + d["empire-assistant"] + d["ai-menu-ocr"] + d["ai-menu-image"] + d["ai-translate"] + d["ai-inventory"], 0
  );
  const totalCostMonth = mock.topAccounts.reduce((s, a) => s + a.cost, 0);
  const topAccount = mock.topAccounts[0];
  const callsToday = todayLogs || mock.dailyData[mock.dailyData.length - 1]
    ? Object.values(mock.dailyData[mock.dailyData.length - 1]).reduce((s: number, v) => typeof v === "number" ? s + v : s, 0)
    : 0;
  const successRate = mock.recentLogs.filter(l => l.status === "success").length / mock.recentLogs.length * 100;

  // Pie chart data
  const pieData = AGENTS.map((a, i) => ({
    name: a.displayName,
    value: mock.dailyData.reduce((s, d) => s + ((d as any)[a.name] || 0), 0),
    color: PIE_COLORS[i % PIE_COLORS.length],
  }));

  const filteredAccounts = mock.topAccounts.filter(a =>
    a.name.toLowerCase().includes(searchAccount.toLowerCase())
  );

  const unresolvedAlerts = mock.alerts.filter(a => !a.isRead);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── Header ─── */}
      <div className="sticky top-0 z-30 bg-background/80 backdrop-blur-xl border-b border-border px-4 md:px-6 py-4">
        <div className="flex items-center justify-between max-w-[1600px] mx-auto">
          <div>
            <h1 className="text-xl md:text-2xl font-bold flex items-center gap-2">
              <Brain className="w-6 h-6 text-primary" />
              Intelligence Hub — Agenti IA
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">Tutti gli agenti attivi sulla piattaforma Empire</p>
          </div>
          <div className="flex items-center gap-2">
            <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse">
              {AGENTS.length} agenti attivi
            </Badge>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => window.location.reload()}>
              <RefreshCw className="w-3.5 h-3.5" /> Aggiorna
            </Button>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => window.print()}>
              <Download className="w-3.5 h-3.5" /> Report
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-[1600px] mx-auto px-4 md:px-6 py-6 space-y-6">
        {/* ─── Demo Banner ─── */}
        <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-4 py-3 flex items-center gap-2 text-yellow-400 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>⚠ Modalità Demo — Connetti il tracking reale per dati live. I dati mostrati sono simulati.</span>
        </div>

        {/* ─── Alerts ─── */}
        {unresolvedAlerts.length > 0 && (
          <div className="space-y-2">
            {unresolvedAlerts.map(alert => (
              <motion.div
                key={alert.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`rounded-lg px-4 py-3 flex items-center gap-3 text-sm ${
                  alert.type === "error" ? "bg-red-500/10 border border-red-500/30 text-red-400" :
                  alert.type === "warning" ? "bg-yellow-500/10 border border-yellow-500/30 text-yellow-400" :
                  "bg-blue-500/10 border border-blue-500/30 text-blue-400"
                }`}
              >
                {alert.type === "error" ? <XCircle className="w-4 h-4 shrink-0" /> :
                 alert.type === "warning" ? <AlertTriangle className="w-4 h-4 shrink-0" /> :
                 <Info className="w-4 h-4 shrink-0" />}
                <span className="flex-1">{alert.message}</span>
                <span className="text-xs opacity-60">{new Date(alert.createdAt).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
                <Button variant="ghost" size="sm" className="h-6 px-2 text-xs">Dettaglio</Button>
              </motion.div>
            ))}
          </div>
        )}

        {/* ─── KPI Cards ─── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          <KPICard
            icon={<Brain className="w-5 h-5 text-primary" />}
            label="Agenti Totali"
            value={AGENTS.length.toString()}
            sub={`${AGENTS.length} attivi / 0 standby`}
            color="primary"
          />
          <KPICard
            icon={<DollarSign className="w-5 h-5 text-emerald-400" />}
            label="Costo Totale Mese"
            value={`€${totalCostMonth.toFixed(2)}`}
            sub={<span className="text-emerald-400 flex items-center gap-0.5"><ArrowDownRight className="w-3 h-3" />-8% vs mese prec.</span>}
            color="emerald"
          />
          <KPICard
            icon={<Medal className="w-5 h-5 text-yellow-400" />}
            label="Account Più Costoso"
            value={topAccount.name.split(" ").slice(0, 2).join(" ")}
            sub={`${INDUSTRY_LABELS[topAccount.industry] || topAccount.industry} — €${topAccount.cost}`}
            color="yellow"
          />
          <KPICard
            icon={<Zap className="w-5 h-5 text-accent" />}
            label="Chiamate Oggi"
            value={callsToday.toString()}
            sub={`✅ ${successRate.toFixed(0)}% successo`}
            color="accent"
          />
        </div>

        {/* ─── Charts Row ─── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Stacked Bar Chart */}
          <div className="lg:col-span-2 bg-card border border-border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-sm">📊 Uso AI per Giorno</h3>
              <div className="flex bg-muted rounded-lg p-0.5">
                <button
                  className={`px-3 py-1 text-xs rounded-md transition ${chartMode === "calls" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  onClick={() => setChartMode("calls")}
                >Chiamate</button>
                <button
                  className={`px-3 py-1 text-xs rounded-md transition ${chartMode === "cost" ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}
                  onClick={() => setChartMode("cost")}
                >Costo €</button>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={mock.dailyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 10 }} />
                <RechartsTooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                {AGENTS.map((a, i) => (
                  <Bar key={a.name} dataKey={a.name} stackId="a" fill={PIE_COLORS[i]} name={a.displayName.split(" — ")[0]} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Pie Chart */}
          <div className="bg-card border border-border rounded-xl p-4">
            <h3 className="font-semibold text-sm mb-3">🥧 Distribuzione per Agente</h3>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={2} dataKey="value">
                  {pieData.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
                <RechartsTooltip
                  contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap gap-2 mt-2">
              {pieData.map((p, i) => (
                <span key={i} className="text-[10px] flex items-center gap-1 text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
                  {p.name.split(" ")[0]}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* ─── Agent Grid ─── */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-primary" /> Agenti Attivi
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {AGENTS.map((agent, idx) => {
              const dayData = mock.dailyData[mock.dailyData.length - 1];
              const callsToday = (dayData as any)?.[agent.name] || 0;
              const callsMonth = mock.dailyData.reduce((s, d) => s + ((d as any)[agent.name] || 0), 0);
              const avgTime = (1000 + Math.random() * 2000).toFixed(0);
              return (
                <motion.div
                  key={agent.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="bg-card border border-border rounded-xl p-4 hover:border-primary/40 transition-all cursor-pointer group"
                  onClick={() => setSelectedAgent(agent)}
                >
                  {/* Header */}
                  <div className="flex items-start gap-3 mb-3">
                    <AgentIcon agent={agent} size={48} />
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-sm truncate">{agent.displayName}</h3>
                      <div className="flex items-center gap-1.5 mt-1 flex-wrap">
                        <Badge className={`${agent.modelBadgeColor} text-[9px] h-5`}>{agent.model}</Badge>
                        <StatusBadge status="active" />
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition mt-1" />
                  </div>

                  {/* Description */}
                  <p className="text-xs text-muted-foreground line-clamp-1 mb-3">{agent.description}</p>

                  {/* Industries */}
                  <div className="flex items-center gap-1 flex-wrap mb-2">
                    <span className="text-[10px] text-muted-foreground mr-1">🎯</span>
                    {agent.industries.slice(0, 4).map(ind => (
                      <Badge key={ind} variant="outline" className="text-[9px] h-4 px-1.5">
                        {INDUSTRY_LABELS[ind]?.split(" ")[0] || ind}
                      </Badge>
                    ))}
                    {agent.industries.length > 4 && (
                      <Badge variant="outline" className="text-[9px] h-4 px-1.5">+{agent.industries.length - 4}</Badge>
                    )}
                  </div>

                  {/* Trigger */}
                  <div className="text-[10px] text-muted-foreground mb-3">⚡ {agent.trigger}</div>

                  {/* Stats */}
                  <div className="border-t border-border pt-2 grid grid-cols-3 gap-2 text-center">
                    <div>
                      <div className="text-xs font-bold">€{agent.costPerCall}</div>
                      <div className="text-[9px] text-muted-foreground">per call</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold">{callsToday}</div>
                      <div className="text-[9px] text-muted-foreground">oggi</div>
                    </div>
                    <div>
                      <div className="text-xs font-bold">{callsMonth.toLocaleString()}</div>
                      <div className="text-[9px] text-muted-foreground">mese</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2 mt-3 pt-2 border-t border-border">
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={e => { e.stopPropagation(); setSelectedAgent(agent); }}>
                      <Play className="w-3 h-3" /> Test
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={e => { e.stopPropagation(); setSelectedAgent(agent); }}>
                      <BarChart3 className="w-3 h-3" /> Analytics
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 h-7 text-[10px] gap-1" onClick={e => { e.stopPropagation(); setSelectedAgent(agent); }}>
                      <Settings className="w-3 h-3" /> Config
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* ─── Account Ranking ─── */}
        <div>
          <h2 className="text-lg font-bold mb-3 flex items-center gap-2">
            🏆 Classifica Consumo AI
          </h2>
          <div className="flex items-center gap-2 mb-3">
            <div className="relative flex-1 max-w-xs">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
              <Input
                placeholder="Cerca azienda..."
                value={searchAccount}
                onChange={e => setSearchAccount(e.target.value)}
                className="pl-8 h-8 text-sm"
              />
            </div>
          </div>
          <div className="bg-card border border-border rounded-xl overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-muted-foreground text-xs">
                  <th className="text-left p-3">#</th>
                  <th className="text-left p-3">Azienda</th>
                  <th className="text-left p-3 hidden md:table-cell">Settore</th>
                  <th className="text-right p-3">Chiamate</th>
                  <th className="text-right p-3 hidden md:table-cell">Tokens</th>
                  <th className="text-right p-3">Costo €</th>
                  <th className="text-right p-3 hidden lg:table-cell">Trend</th>
                  <th className="text-right p-3">Azioni</th>
                </tr>
              </thead>
              <tbody>
                {filteredAccounts.map((acc, i) => (
                  <tr key={acc.name} className="border-b border-border/50 hover:bg-muted/30 transition">
                    <td className="p-3 font-bold text-muted-foreground">
                      {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                    </td>
                    <td className="p-3 font-medium">{acc.name}</td>
                    <td className="p-3 hidden md:table-cell">
                      <Badge variant="outline" className="text-[10px]">{INDUSTRY_LABELS[acc.industry] || acc.industry}</Badge>
                    </td>
                    <td className="p-3 text-right">{acc.calls.toLocaleString()}</td>
                    <td className="p-3 text-right hidden md:table-cell">{(acc.tokens / 1000).toFixed(0)}K</td>
                    <td className="p-3 text-right font-bold">€{acc.cost.toFixed(2)}</td>
                    <td className="p-3 text-right hidden lg:table-cell">
                      <span className={`flex items-center justify-end gap-0.5 text-xs ${acc.trend > 0 ? "text-red-400" : "text-emerald-400"}`}>
                        {acc.trend > 0 ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                        {Math.abs(acc.trend)}%
                      </span>
                    </td>
                    <td className="p-3 text-right">
                      <Button variant="ghost" size="sm" className="h-6 px-2 text-[10px]">
                        <Eye className="w-3 h-3" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ─── Agent Detail Sheet ─── */}
      <Sheet open={!!selectedAgent} onOpenChange={() => setSelectedAgent(null)}>
        <SheetContent className="w-full sm:max-w-2xl overflow-y-auto bg-background">
          {selectedAgent && (
            <>
              <SheetHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <AgentIcon agent={selectedAgent} size={64} />
                  <div>
                    <SheetTitle className="text-lg">{selectedAgent.displayName}</SheetTitle>
                    <div className="flex gap-1.5 mt-1">
                      <Badge className={selectedAgent.modelBadgeColor}>{selectedAgent.model}</Badge>
                      <StatusBadge status="active" />
                    </div>
                  </div>
                </div>
              </SheetHeader>

              <Tabs defaultValue="overview" className="mt-2">
                <TabsList className="w-full grid grid-cols-5 h-8 text-[10px]">
                  <TabsTrigger value="overview" className="text-[10px]">Panoramica</TabsTrigger>
                  <TabsTrigger value="usage" className="text-[10px]">Consumo</TabsTrigger>
                  <TabsTrigger value="logs" className="text-[10px]">Log</TabsTrigger>
                  <TabsTrigger value="test" className="text-[10px]">Test</TabsTrigger>
                  <TabsTrigger value="config" className="text-[10px]">Config</TabsTrigger>
                </TabsList>

                {/* TAB: Overview */}
                <TabsContent value="overview" className="space-y-4 mt-4">
                  <p className="text-sm text-muted-foreground">{selectedAgent.description}</p>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-16 shrink-0">📁 File:</span>
                      <code className="text-xs bg-muted px-2 py-0.5 rounded break-all">{selectedAgent.file}</code>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-16 shrink-0">📥 Input:</span>
                      <span className="text-xs">{selectedAgent.inputDesc}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-16 shrink-0">📤 Output:</span>
                      <span className="text-xs">{selectedAgent.outputDesc}</span>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-muted-foreground w-16 shrink-0">⚡ Trigger:</span>
                      <span className="text-xs">{selectedAgent.trigger}</span>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-muted-foreground">🎯 Settori:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {selectedAgent.industries.map(ind => (
                        <Badge key={ind} variant="outline" className="text-xs">{INDUSTRY_LABELS[ind] || ind}</Badge>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* TAB: Usage */}
                <TabsContent value="usage" className="space-y-4 mt-4">
                  <div className="grid grid-cols-3 gap-3">
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">{mock.dailyData.reduce((s, d) => s + ((d as any)[selectedAgent.name] || 0), 0).toLocaleString()}</div>
                      <div className="text-[10px] text-muted-foreground">Chiamate mese</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">1.2M</div>
                      <div className="text-[10px] text-muted-foreground">Tokens totali</div>
                    </div>
                    <div className="bg-muted rounded-lg p-3 text-center">
                      <div className="text-lg font-bold">€{(mock.dailyData.reduce((s, d) => s + ((d as any)[selectedAgent.name] || 0), 0) * selectedAgent.costPerCall).toFixed(2)}</div>
                      <div className="text-[10px] text-muted-foreground">Costo mese</div>
                    </div>
                  </div>
                  <div className="bg-card border border-border rounded-lg p-3">
                    <h4 className="text-xs font-semibold mb-2">Chiamate per giorno (ultimi 30gg)</h4>
                    <ResponsiveContainer width="100%" height={160}>
                      <AreaChart data={mock.dailyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                        <XAxis dataKey="day" tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                        <YAxis tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 9 }} />
                        <RechartsTooltip contentStyle={{ background: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: 8, color: "hsl(var(--foreground))" }} />
                        <Area type="monotone" dataKey={selectedAgent.name} fill={selectedAgent.color + "33"} stroke={selectedAgent.color} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                  <div>
                    <h4 className="text-xs font-semibold mb-2">Top 5 account per questo agente</h4>
                    <div className="space-y-1">
                      {mock.topAccounts.slice(0, 5).map((acc, i) => (
                        <div key={acc.name} className="flex items-center justify-between bg-muted/50 rounded-lg px-3 py-2 text-xs">
                          <span className="font-medium">{i + 1}. {acc.name}</span>
                          <span className="text-muted-foreground">{Math.floor(acc.calls * 0.3)} calls — €{(acc.cost * 0.3).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                {/* TAB: Logs */}
                <TabsContent value="logs" className="mt-4">
                  <div className="space-y-1 max-h-[400px] overflow-y-auto">
                    {mock.recentLogs.filter(l => l.agent === selectedAgent.name).slice(0, 20).map(log => (
                      <div key={log.id} className="flex items-center gap-2 bg-muted/30 rounded-lg px-3 py-2 text-[10px]">
                        <span className={`w-1.5 h-1.5 rounded-full ${log.status === "success" ? "bg-emerald-400" : "bg-red-400"}`} />
                        <span className="text-muted-foreground w-14 shrink-0">{new Date(log.timestamp).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
                        <span className="flex-1 truncate">{log.account}</span>
                        <span className="text-muted-foreground">{log.inputTokens}→{log.outputTokens}t</span>
                        <span className="font-medium">€{log.cost}</span>
                        <span className="text-muted-foreground">{log.duration}ms</span>
                      </div>
                    ))}
                    {mock.recentLogs.filter(l => l.agent === selectedAgent.name).length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">Nessun log recente per questo agente</p>
                    )}
                  </div>
                </TabsContent>

                {/* TAB: Test */}
                <TabsContent value="test" className="space-y-4 mt-4">
                  <Textarea
                    placeholder="Inserisci un prompt di test..."
                    value={testPrompt}
                    onChange={e => setTestPrompt(e.target.value)}
                    className="min-h-[80px] text-sm"
                  />
                  <Button
                    className="gap-2"
                    disabled={!testPrompt.trim() || testLoading}
                    onClick={async () => {
                      setTestLoading(true);
                      setTestResult("");
                      try {
                        // Call the actual edge function
                        if (selectedAgent.name === "empire-assistant") {
                          const resp = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/empire-assistant`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json", Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}` },
                            body: JSON.stringify({ messages: [{ role: "user", content: testPrompt }] }),
                          });
                          if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
                          const reader = resp.body?.getReader();
                          const decoder = new TextDecoder();
                          let result = "";
                          if (reader) {
                            while (true) {
                              const { done, value } = await reader.read();
                              if (done) break;
                              const chunk = decoder.decode(value, { stream: true });
                              for (const line of chunk.split("\n")) {
                                if (!line.startsWith("data: ") || line.includes("[DONE]")) continue;
                                try {
                                  const parsed = JSON.parse(line.slice(6));
                                  const c = parsed.choices?.[0]?.delta?.content;
                                  if (c) { result += c; setTestResult(result); }
                                } catch {}
                              }
                            }
                          }
                        } else {
                          setTestResult("⚠ Test live disponibile solo per Empire Assistant. Gli altri agenti richiedono input specifici (immagini, menu, ecc.).");
                        }
                      } catch (e: any) {
                        setTestResult(`❌ Errore: ${e.message}`);
                      } finally {
                        setTestLoading(false);
                      }
                    }}
                  >
                    {testLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
                    Esegui Test
                  </Button>
                  {testResult && (
                    <div className="bg-muted rounded-lg p-4 text-sm whitespace-pre-wrap max-h-[300px] overflow-y-auto">
                      {testResult}
                    </div>
                  )}
                </TabsContent>

                {/* TAB: Config */}
                <TabsContent value="config" className="space-y-4 mt-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Agente abilitato</span>
                    <Switch defaultChecked />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Max chiamate per ora (per account)</label>
                    <Input type="number" defaultValue={100} className="mt-1 h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">Budget mensile max per account (€)</label>
                    <Input type="number" defaultValue={20} className="mt-1 h-8" />
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground mb-1 block">Settori autorizzati</label>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(INDUSTRY_LABELS).map(([key, label]) => (
                        <label key={key} className="flex items-center gap-1.5 text-xs cursor-pointer">
                          <input
                            type="checkbox"
                            defaultChecked={selectedAgent.industries.includes(key)}
                            className="rounded border-border"
                          />
                          {label}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <label className="text-xs text-muted-foreground">System Prompt Override</label>
                    <Textarea className="mt-1 text-xs min-h-[80px]" placeholder="Lascia vuoto per usare il prompt di default..." />
                  </div>
                  <Button className="w-full gap-2">
                    <Check className="w-4 h-4" /> Salva Configurazione
                  </Button>
                </TabsContent>
              </Tabs>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

// ─── KPI Card ───
function KPICard({ icon, label, value, sub, color }: {
  icon: React.ReactNode;
  label: string;
  value: string;
  sub: React.ReactNode;
  color: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-xl p-4"
    >
      <div className="flex items-center gap-2 mb-2">
        {icon}
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-[10px] text-muted-foreground mt-1">{sub}</div>
    </motion.div>
  );
}
