/**
 * DemoAdminPage — Public admin demo dashboard for ANY sector
 * Accessible at /demo/:slug/admin WITHOUT authentication
 */
import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { getSectorConfig } from "@/config/sectorConfig";
import { getAllFeaturesForSector, getAllAgentsForSector } from "@/config/sectorFeatures";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard, Users, Calendar, BarChart3, Bot, MessageCircle, Settings,
  ShoppingBag, Star, Package, Bell, TrendingUp, ArrowRight, Menu as MenuIcon,
  X, Search, Moon, Sun, ChevronRight, Activity, DollarSign, Eye, Clock,
  CheckCircle, AlertTriangle, ArrowUp, ArrowDown, Filter, MoreHorizontal,
  CreditCard, Shield, Wrench, Car, Camera, FileText, Building, Heart,
  Sparkles, Smartphone, Globe, UserCog, QrCode, Truck, HardHat, Baby,
  BookOpen, GraduationCap, Scissors, ChefHat, Coffee
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from "recharts";

const ICON_MAP: Record<string, any> = {
  LayoutDashboard, Users, Calendar, BarChart3, Bot, MessageCircle, Settings,
  ShoppingBag, Star, Package, Bell, TrendingUp, Search, Activity, DollarSign,
  Eye, Clock, CheckCircle, AlertTriangle, CreditCard, Shield, Wrench, Car,
  Camera, FileText, Building, Heart, Sparkles, Smartphone, Globe, UserCog,
  QrCode, Truck, HardHat, Baby, BookOpen, GraduationCap, Scissors, ChefHat,
  Coffee, UtensilsCrossed: ChefHat, UserCheck: Users, Stethoscope: Heart,
  MapPin: Globe, Navigation: Globe, Route: Globe,
};

const resolveIcon = (name: string) => ICON_MAP[name] || Star;

// ── Mock analytics data ──
const MONTHS = ["Gen", "Feb", "Mar", "Apr", "Mag", "Giu", "Lug", "Ago", "Set", "Ott", "Nov", "Dic"];
const generateRevenueData = () => MONTHS.map((m, i) => ({
  month: m,
  revenue: 8000 + Math.round(Math.random() * 12000) + i * 800,
  clients: 40 + Math.round(Math.random() * 60) + i * 5,
}));

const PIE_COLORS = ["#6366f1", "#22c55e", "#f59e0b", "#ef4444", "#8b5cf6"];

export default function DemoAdminPage() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [activeModule, setActiveModule] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true);
  const [agentsTab, setAgentsTab] = useState<"overview" | "activity" | "detail">("overview");
  const [selectedAgent, setSelectedAgent] = useState<string | null>(null);

  const config = getSectorConfig(slug || "food");
  const allAgents = useMemo(() => getAllAgentsForSector(slug || "food"), [slug]);

  if (!config) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p className="text-muted-foreground">Settore non trovato</p>
      </div>
    );
  }

  const revenueData = useMemo(generateRevenueData, []);
  const accentColor = config.colors.accent;

  const kpis = [
    { label: "Fatturato Mese", value: "€24.850", change: "+18%", up: true, icon: DollarSign },
    { label: "Clienti Attivi", value: "342", change: "+12%", up: true, icon: Users },
    { label: "Prenotazioni", value: "156", change: "+24%", up: true, icon: Calendar },
    { label: "Tasso Crescita", value: "+18%", change: "+3%", up: true, icon: TrendingUp },
  ];

  const recentActivity = [
    { text: `Nuovo cliente: ${config.mockClients[0]?.name || "Mario Rossi"}`, time: "2 min fa", type: "success" },
    { text: `${config.mockOrders[0]?.service || "Ordine #1234"} — €${config.mockOrders[0]?.amount || 85}`, time: "15 min fa", type: "info" },
    { text: `Pagamento ricevuto da ${config.mockClients[1]?.name || "Laura B."}`, time: "1 ora fa", type: "success" },
    { text: `Reminder inviato a ${config.mockClients[2]?.name || "Marco V."}`, time: "2 ore fa", type: "info" },
    { text: "Agente AI ha qualificato 3 nuovi lead", time: "3 ore fa", type: "ai" },
    { text: "Report settimanale generato automaticamente", time: "Ieri", type: "info" },
  ];

  const topServices = config.mockOrders.map((o, i) => ({
    name: o.service.slice(0, 30),
    value: o.amount * (3 - i),
  }));

  const SidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg" style={{ background: accentColor }}>
            {config.heroEmoji}
          </div>
          <div className="min-w-0">
            <h2 className="text-sm font-bold text-white truncate">{config.name}</h2>
            <p className="text-[0.6rem] text-white/40">Empire AI Platform</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 p-2 space-y-0.5 overflow-y-auto">
        {config.adminModules.map((mod) => {
          const Icon = resolveIcon(mod.icon);
          const isActive = activeModule === mod.route;
          return (
            <button
              key={mod.route}
              onClick={() => { setActiveModule(mod.route); setSidebarOpen(false); }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? "text-white"
                  : "text-white/50 hover:text-white/80 hover:bg-white/5"
              }`}
              style={isActive ? { background: `${accentColor}20`, color: accentColor } : {}}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{mod.label}</span>
              {mod.route === "agents" && (
                <Badge className="ml-auto text-[0.5rem] px-1.5 py-0" style={{ background: `${accentColor}30`, color: accentColor }}>
                  {allAgents.length}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10">
        <Button
          onClick={() => navigate(`/demo/${slug}`)}
          variant="outline"
          size="sm"
          className="w-full text-[0.65rem] border-white/10 text-white/60 hover:text-white hover:bg-white/5"
        >
          ← Torna al Sito Demo
        </Button>
      </div>
    </div>
  );

  // ── Module Content Renderers ──
  const renderDashboard = () => (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {kpis.map((kpi, i) => (
          <motion.div
            key={kpi.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <Card className="bg-white/[0.03] border-white/[0.06] backdrop-blur-sm">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <kpi.icon className="w-4 h-4 text-white/30" />
                  <span className={`text-[0.6rem] font-bold flex items-center gap-0.5 ${kpi.up ? "text-emerald-400" : "text-red-400"}`}>
                    {kpi.up ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
                    {kpi.change}
                  </span>
                </div>
                <p className="text-lg font-bold text-white">{kpi.value}</p>
                <p className="text-[0.6rem] text-white/40 mt-0.5">{kpi.label}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2 bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Fatturato 12 Mesi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={accentColor} stopOpacity={0.3} />
                    <stop offset="95%" stopColor={accentColor} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="month" tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                <YAxis tick={{ fill: "rgba(255,255,255,0.3)", fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 11 }} />
                <Area type="monotone" dataKey="revenue" stroke={accentColor} fill="url(#colorRev)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-white/80">Top Servizi</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={topServices} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="value" paddingAngle={3}>
                  {topServices.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "#1a1a2e", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 12, fontSize: 10 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Activity Feed */}
      <Card className="bg-white/[0.03] border-white/[0.06]">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white/80">Attività Recenti</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {recentActivity.map((a, i) => (
            <div key={i} className="flex items-center gap-3 py-2 border-b border-white/[0.04] last:border-0">
              <div className={`w-2 h-2 rounded-full shrink-0 ${
                a.type === "success" ? "bg-emerald-400" : a.type === "ai" ? "bg-purple-400" : "bg-blue-400"
              }`} />
              <p className="text-xs text-white/70 flex-1">{a.text}</p>
              <span className="text-[0.6rem] text-white/30 shrink-0">{a.time}</span>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );

  const renderClients = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Clienti CRM</h2>
        <Button size="sm" style={{ background: accentColor }} className="text-white text-xs">+ Nuovo Cliente</Button>
      </div>
      <div className="flex gap-2">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
          <input className="w-full bg-white/[0.04] border border-white/[0.08] rounded-xl pl-9 pr-3 py-2.5 text-xs text-white placeholder:text-white/25 outline-none" placeholder="Cerca clienti..." />
        </div>
        <Button variant="outline" size="sm" className="border-white/10 text-white/50"><Filter className="w-3.5 h-3.5" /></Button>
      </div>
      <Card className="bg-white/[0.03] border-white/[0.06] overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="text-left text-[0.6rem] text-white/40 font-medium p-3 uppercase tracking-wider">Cliente</th>
              <th className="text-left text-[0.6rem] text-white/40 font-medium p-3 uppercase tracking-wider">Telefono</th>
              <th className="text-left text-[0.6rem] text-white/40 font-medium p-3 uppercase tracking-wider">Email</th>
              <th className="text-left text-[0.6rem] text-white/40 font-medium p-3 uppercase tracking-wider">Spesa Tot.</th>
              <th className="text-left text-[0.6rem] text-white/40 font-medium p-3 uppercase tracking-wider">Stato</th>
            </tr>
          </thead>
          <tbody>
            {[...config.mockClients, 
              { name: "Francesca Villa", phone: "+39 336 7778899", email: "f.villa@email.it" },
              { name: "Alessandro Conti", phone: "+39 337 2223344", email: "a.conti@email.it" },
              { name: "Sara Marchetti", phone: "+39 338 5556677", email: "s.marchetti@email.it" },
            ].map((c, i) => (
              <tr key={i} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                <td className="p-3">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full flex items-center justify-center text-[0.5rem] font-bold text-white" style={{ background: `${accentColor}30` }}>
                      {c.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <span className="text-xs text-white/80 font-medium">{c.name}</span>
                  </div>
                </td>
                <td className="p-3 text-xs text-white/50">{c.phone}</td>
                <td className="p-3 text-xs text-white/50">{c.email}</td>
                <td className="p-3 text-xs text-white/70 font-medium">€{(200 + i * 150).toLocaleString("it-IT")}</td>
                <td className="p-3">
                  <Badge className="text-[0.5rem]" style={{ background: i < 3 ? "#22c55e20" : "#f59e0b20", color: i < 3 ? "#22c55e" : "#f59e0b" }}>
                    {i < 3 ? "Attivo" : "Da ricontattare"}
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );

  const renderOrders = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold text-white">Ordini & Prenotazioni</h2>
        <div className="flex gap-2">
          {["Tutti", "In corso", "Completati"].map(f => (
            <Button key={f} variant="outline" size="sm" className="text-[0.6rem] border-white/10 text-white/50">{f}</Button>
          ))}
        </div>
      </div>
      <div className="space-y-2">
        {config.mockOrders.map((o, i) => (
          <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-4 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg" style={{ background: `${accentColor}15` }}>
                  {config.heroEmoji}
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{o.service}</p>
                  <p className="text-[0.6rem] text-white/40">{o.client} · {o.date}</p>
                </div>
              </div>
              <div className="text-right shrink-0 ml-3">
                <p className="text-sm font-bold text-white">€{o.amount}</p>
                <Badge className="text-[0.5rem]" style={{
                  background: o.status.includes("complet") || o.status.includes("consegn") ? "#22c55e20" : o.status.includes("corso") || o.status.includes("preparaz") ? "#3b82f620" : "#f59e0b20",
                  color: o.status.includes("complet") || o.status.includes("consegn") ? "#22c55e" : o.status.includes("corso") || o.status.includes("preparaz") ? "#3b82f6" : "#f59e0b",
                }}>
                  {o.status.replace(/_/g, " ")}
                </Badge>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );


  const renderAgents = () => {
    const totalHours = allAgents.reduce((s, a) => s + (a.hoursPerWeek || 8), 0);
    const avgAccuracy = Math.round(allAgents.reduce((s, a) => s + (a.accuracy || 90), 0) / allAgents.length);
    const totalActions = allAgents.length * 142;

    const mockActivityFeed = [
      { agent: allAgents[0]?.name || "Arianna", action: "Ha prenotato un appuntamento", time: "2 min fa", emoji: allAgents[0]?.emoji || "🎧" },
      { agent: allAgents[1]?.name || "Analytics", action: "Report settimanale generato", time: "15 min fa", emoji: allAgents[1]?.emoji || "📊" },
      { agent: allAgents[2]?.name || "Marketing", action: "Post Instagram pubblicato", time: "32 min fa", emoji: allAgents[2]?.emoji || "📣" },
      { agent: allAgents[3]?.name || "Sales", action: "Lead qualificato: score 87/100", time: "1 ora fa", emoji: allAgents[3]?.emoji || "💼" },
      { agent: allAgents[4]?.name || "Operations", action: "Turno assegnato automaticamente", time: "2 ore fa", emoji: allAgents[4]?.emoji || "⚙️" },
      { agent: allAgents[5]?.name || "Compliance", action: "GDPR audit completato", time: "3 ore fa", emoji: allAgents[5]?.emoji || "🛡️" },
      { agent: allAgents[6]?.name || "Customer", action: "Win-back inviato a cliente inattivo", time: "4 ore fa", emoji: allAgents[6]?.emoji || "❤️" },
      ...allAgents.slice(7).map((a, i) => ({ agent: a.name, action: `${a.capabilities[0] || 'Azione'} eseguita`, time: `${5 + i} ore fa`, emoji: a.emoji })),
    ];

    const detailAgent = allAgents.find(a => a.name === selectedAgent) || allAgents[0];

    return (
      <div className="space-y-5">
        <div>
          <h2 className="text-base font-bold text-white mb-1">Agenti AI Attivi</h2>
          <p className="text-xs text-white/40">{allAgents.length} agenti operativi per {config.name}</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          {([["overview", "Panoramica"], ["activity", "Attività Recente"], ["detail", "Dettaglio Agente"]] as const).map(([key, label]) => (
            <button
              key={key}
              onClick={() => setAgentsTab(key)}
              className={`flex-1 py-2 rounded-lg text-[0.6rem] font-bold transition-all ${agentsTab === key ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
              style={agentsTab === key ? { background: `${accentColor}20`, color: accentColor } : {}}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Aggregate KPIs */}
        {agentsTab === "overview" && (
          <>
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: "Azioni Totali", value: totalActions.toLocaleString("it-IT"), icon: Activity },
                { label: "Ore Risparmiate/Sett", value: `${totalHours}h`, icon: Clock },
                { label: "Accuratezza Media", value: `${avgAccuracy}%`, icon: CheckCircle },
              ].map((s, i) => (
                <Card key={i} className="bg-white/[0.03] border-white/[0.06]">
                  <CardContent className="p-3 text-center">
                    <s.icon className="w-4 h-4 mx-auto mb-1" style={{ color: accentColor }} />
                    <p className="text-sm font-bold text-white">{s.value}</p>
                    <p className="text-[0.5rem] text-white/30">{s.label}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {allAgents.map((agent, i) => (
                <motion.div key={agent.name} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}>
                  <Card
                    className="bg-white/[0.03] border-white/[0.06] hover:border-white/[0.12] transition-all cursor-pointer"
                    onClick={() => { setSelectedAgent(agent.name); setAgentsTab("detail"); }}
                  >
                    <CardContent className="p-3">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{agent.emoji}</span>
                        <div className="min-w-0 flex-1">
                          <p className="text-[0.65rem] font-bold text-white truncate">{agent.name}</p>
                          <div className="flex items-center gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span className="text-[0.45rem] text-emerald-400">ATTIVO</span>
                            {agent.isUniversal && <Badge className="text-[0.4rem] px-1 py-0 bg-purple-500/20 text-purple-300 ml-1">Universal</Badge>}
                          </div>
                        </div>
                        <MoreHorizontal className="w-3.5 h-3.5 text-white/20" />
                      </div>
                      <div className="flex items-center justify-between text-center">
                        <div><p className="text-[0.6rem] font-bold text-white">{agent.accuracy || 95}%</p><p className="text-[0.4rem] text-white/25">Accuracy</p></div>
                        <div><p className="text-[0.6rem] font-bold text-white">{agent.hoursPerWeek || 8}h</p><p className="text-[0.4rem] text-white/25">Ore/sett</p></div>
                        <div><p className="text-[0.6rem] font-bold text-white">{120 + i * 25}</p><p className="text-[0.4rem] text-white/25">Azioni</p></div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </>
        )}

        {/* Activity Feed */}
        {agentsTab === "activity" && (
          <Card className="bg-white/[0.03] border-white/[0.06]">
            <CardContent className="p-4 space-y-1">
              {mockActivityFeed.map((a, i) => (
                <motion.div
                  key={i}
                  className="flex items-center gap-3 py-2.5 border-b border-white/[0.04] last:border-0"
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <span className="text-base shrink-0">{a.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-white/80"><strong className="text-white">{a.agent}</strong> — {a.action}</p>
                  </div>
                  <span className="text-[0.55rem] text-white/25 shrink-0">{a.time}</span>
                </motion.div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Detail view */}
        {agentsTab === "detail" && detailAgent && (
          <div className="space-y-4">
            {/* Agent selector */}
            <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-hide" style={{ scrollbarWidth: "none" }}>
              {allAgents.map(a => (
                <button
                  key={a.name}
                  onClick={() => setSelectedAgent(a.name)}
                  className={`shrink-0 px-2.5 py-1.5 rounded-lg text-[0.55rem] font-medium transition-all whitespace-nowrap ${selectedAgent === a.name || (!selectedAgent && a === allAgents[0]) ? 'text-white' : 'text-white/40 hover:text-white/60'}`}
                  style={(selectedAgent === a.name || (!selectedAgent && a === allAgents[0])) ? { background: `${accentColor}20`, color: accentColor } : { background: 'rgba(255,255,255,0.03)' }}
                >
                  {a.emoji} {a.name.split(' — ')[0].split(' ').slice(0, 2).join(' ')}
                </button>
              ))}
            </div>

            <Card className="bg-white/[0.03] border-white/[0.06]">
              <CardContent className="p-5">
                <div className="flex items-center gap-3 mb-4">
                  <span className="text-3xl">{detailAgent.emoji}</span>
                  <div>
                    <p className="text-sm font-bold text-white">{detailAgent.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[0.6rem] text-emerald-400 font-medium">ATTIVO 24/7</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-white/60 mb-4">{detailAgent.desc}</p>

                {/* Metrics */}
                <div className="grid grid-cols-3 gap-3 mb-4">
                  <div className="text-center p-2.5 rounded-lg bg-white/[0.03]">
                    <p className="text-base font-bold text-white">{detailAgent.accuracy || 95}%</p>
                    <p className="text-[0.5rem] text-white/30">Accuratezza</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-white/[0.03]">
                    <p className="text-base font-bold text-white">{detailAgent.hoursPerWeek || 10}h</p>
                    <p className="text-[0.5rem] text-white/30">Risparmio/Sett</p>
                  </div>
                  <div className="text-center p-2.5 rounded-lg bg-white/[0.03]">
                    <p className="text-base font-bold" style={{ color: accentColor }}>142</p>
                    <p className="text-[0.5rem] text-white/30">Azioni eseguite</p>
                  </div>
                </div>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {detailAgent.capabilities.map(c => (
                    <Badge key={c} variant="outline" className="text-[0.55rem] border-white/10 text-white/50 px-2">{c}</Badge>
                  ))}
                </div>

                {/* Workflow */}
                {detailAgent.workflow && detailAgent.workflow.length > 0 && (
                  <div className="pt-4 border-t border-white/[0.06]">
                    <p className="text-[0.6rem] font-bold text-white/50 uppercase tracking-wider mb-3">⚡ Come Lavora</p>
                    <div className="space-y-2.5">
                      {detailAgent.workflow.map((step, i) => (
                        <div key={i} className="flex items-start gap-3 relative">
                          {i < detailAgent.workflow!.length - 1 && (
                            <div className="absolute left-[15px] top-[30px] w-[1px] h-[calc(100%+4px)]" style={{ background: `${accentColor}20` }} />
                          )}
                          <div className="w-[30px] h-[30px] rounded-lg flex items-center justify-center text-sm shrink-0 relative z-10" style={{ background: `${accentColor}15`, border: `1px solid ${accentColor}30` }}>
                            {step.icon}
                          </div>
                          <div className="pt-0.5">
                            <p className="text-[0.65rem] font-bold text-white/80">{step.label}</p>
                            <p className="text-[0.55rem] text-white/40">{step.detail}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Example */}
                {detailAgent.example && (
                  <div className="mt-4 p-3 rounded-lg bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-[0.55rem] font-bold text-white/50 mb-1">💡 Esempio Concreto</p>
                    <p className="text-[0.6rem] text-white/60 leading-relaxed italic">{detailAgent.example}</p>
                  </div>
                )}

                {detailAgent.result && (
                  <div className="mt-3 p-2.5 rounded-lg text-center" style={{ background: `${accentColor}10`, border: `1px solid ${accentColor}20` }}>
                    <p className="text-[0.6rem] font-bold" style={{ color: accentColor }}>{detailAgent.result}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    );
  };

  const renderGenericModule = () => {
    const mod = config.adminModules.find(m => m.route === activeModule);
    return (
      <div className="space-y-4">
        <h2 className="text-base font-bold text-white">{mod?.label || activeModule}</h2>
        <Card className="bg-white/[0.03] border-white/[0.06]">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: `${accentColor}15` }}>
              {(() => { const Icon = resolveIcon(mod?.icon || "Star"); return <Icon className="w-7 h-7" style={{ color: accentColor }} />; })()}
            </div>
            <p className="text-sm text-white/60 mb-2">Modulo <strong className="text-white">{mod?.label}</strong> attivo</p>
            <p className="text-xs text-white/30 max-w-sm mx-auto">Questa sezione è completamente funzionale nel tuo account Empire. Nella demo puoi esplorare l'interfaccia e scoprire tutte le funzionalità.</p>
            <Button className="mt-4 text-xs" style={{ background: accentColor }}>
              Attiva per il tuo business <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  };

  const renderModuleContent = () => {
    switch (activeModule) {
      case "": return renderDashboard();
      case "clients": case "patients": return renderClients();
      case "orders": case "bookings": case "appointments": case "reservations": return renderOrders();
      case "agents": return renderAgents();
      case "analytics": return renderDashboard();
      default: return renderGenericModule();
    }
  };

  return (
    <div className="min-h-screen flex" style={{ background: "#0a0a12" }}>
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0d0d1a] border-r border-white/[0.06] transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <SidebarContent />
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        {/* Demo Banner */}
        <div className="sticky top-0 z-30 px-4 py-2 text-center text-xs font-medium" style={{ background: `linear-gradient(90deg, ${accentColor}20, ${accentColor}10)`, borderBottom: `1px solid ${accentColor}30` }}>
          <span className="text-white/60">🔍 DEMO MODE — Stai esplorando</span>{" "}
          <strong style={{ color: accentColor }}>{config.name}</strong>{" "}
          <Button size="sm" className="ml-3 text-[0.6rem] h-6 px-3" style={{ background: accentColor }} onClick={() => navigate("/admin")}>
            Inizia Ora →
          </Button>
        </div>

        {/* Top bar */}
        <header className="sticky top-8 z-20 bg-[#0a0a12]/80 backdrop-blur-xl border-b border-white/[0.04] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden w-9 h-9 rounded-xl bg-white/[0.04] flex items-center justify-center text-white/50">
              <MenuIcon className="w-4 h-4" />
            </button>
            <h1 className="text-sm font-bold text-white">
              {config.adminModules.find(m => m.route === activeModule)?.label || "Dashboard"}
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/20" />
              <input className="bg-white/[0.04] border border-white/[0.06] rounded-lg pl-8 pr-3 py-1.5 text-[0.65rem] text-white placeholder:text-white/20 outline-none w-48" placeholder="Cerca..." />
            </div>
            <button className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center text-white/30 relative">
              <Bell className="w-4 h-4" />
              <span className="absolute -top-0.5 -right-0.5 w-3 h-3 rounded-full bg-red-500 text-[6px] text-white font-bold flex items-center justify-center">3</span>
            </button>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: `${accentColor}40` }}>
              AD
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="p-4 lg:p-6">
          {renderModuleContent()}
        </div>
      </main>

      {/* Mobile sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 lg:hidden bg-[#0d0d1a]/95 backdrop-blur-xl border-t border-white/[0.06] px-2 py-1.5 flex items-center justify-around safe-area-pb">
        {config.adminModules.slice(0, 5).map(mod => {
          const Icon = resolveIcon(mod.icon);
          const isActive = activeModule === mod.route;
          return (
            <button
              key={mod.route}
              onClick={() => setActiveModule(mod.route)}
              className={`flex flex-col items-center gap-0.5 px-2 py-1 rounded-lg transition-all ${isActive ? "" : "text-white/30"}`}
              style={isActive ? { color: accentColor } : {}}
            >
              <Icon className="w-4 h-4" />
              <span className="text-[0.5rem]">{mod.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
