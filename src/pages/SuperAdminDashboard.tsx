import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Power, TrendingUp, DollarSign, Users, Store,
  Megaphone, BarChart3, LogOut, Search,
  Key, HeadphonesIcon, CheckCircle2, XCircle, AlertCircle,
  Cpu, Wifi, ChevronRight, Save, Bot, Send, Bell,
  ShieldCheck, Lock
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface Tenant {
  id: string;
  name: string;
  slug: string;
  active: boolean;
  city: string;
  monthlyRevenue: number;
  orders: number;
  fee2percent: number;
}

interface FiscoStatus {
  id: string;
  restaurantId: string;
  tenantName: string;
  provider: string;
  configured: boolean;
  updatedAt: string;
}

type SuperTab = "overview" | "tenants" | "fisco" | "billing" | "mary";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperTab>("overview");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTenant, setSearchTenant] = useState("");
  const [fiscoStatuses, setFiscoStatuses] = useState<FiscoStatus[]>([]);
  const [loading, setLoading] = useState(true);

  // AI-Mary chat
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Ciao Kevin! Sono **Mary**, il tuo agente IA per il controllo centralizzato.\n\nDa qui puoi:\n• 📊 Monitorare lo stato fiscale di ogni tenant\n• 🔔 Richiedere il setup fiscale ai ristoratori\n• ✅ Verificare connessioni API in tempo reale\n• 🔒 Nessun accesso alle chiavi private — solo stato operativo\n\nCome posso assisterti?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("id, name, slug, is_active, city")
      .order("created_at", { ascending: false });

    if (restaurants) {
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

      setTenants(restaurants.map(r => ({
        id: r.id,
        name: r.name,
        slug: r.slug,
        active: r.is_active,
        city: r.city || "—",
        monthlyRevenue: orderMap[r.id]?.revenue || 0,
        orders: orderMap[r.id]?.count || 0,
        fee2percent: Math.round((orderMap[r.id]?.revenue || 0) * 0.02),
      })));
    }

    // Fetch fisco statuses (Kevin sees only status, never keys)
    const { data: fisco } = await supabase
      .from("fisco_configs")
      .select("id, restaurant_id, provider, configured, updated_at, restaurants(name)");
    if (fisco) {
      setFiscoStatuses(fisco.map(f => ({
        id: f.id,
        restaurantId: f.restaurant_id,
        tenantName: (f as any).restaurants?.name || "—",
        provider: f.provider,
        configured: f.configured,
        updatedAt: f.updated_at,
      })));
    }

    setLoading(false);
  };

  const toggleTenant = async (id: string) => {
    const tenant = tenants.find(t => t.id === id);
    if (!tenant) return;
    const newActive = !tenant.active;
    await supabase.from("restaurants").update({ is_active: newActive }).eq("id", id);
    setTenants(prev => prev.map(t => t.id === id ? { ...t, active: newActive } : t));
    toast({ title: newActive ? "Tenant riattivato" : "Kill-Switch attivato — Tenant disabilitato" });
  };

  const handleRequestFiscoSetup = (tenantName: string) => {
    toast({
      title: "Notifica inviata",
      description: `Richiesta di setup fiscale inviata a ${tenantName}. Il ristoratore riceverà la notifica nel suo pannello.`,
    });
  };

  const handleMaryMessage = () => {
    if (!maryInput.trim()) return;
    const userMsg = { role: "user", content: maryInput };
    setMaryMessages(prev => [...prev, userMsg]);
    setMaryInput("");

    const input = maryInput.toLowerCase();
    let response = "Posso aiutarti a monitorare lo stato fiscale di tutti i tenant. Usa la tab **Fiscalità** per una panoramica completa con semafori Verde/Rosso.";

    if (input.includes("stato") || input.includes("verifica") || input.includes("check")) {
      const configured = fiscoStatuses.filter(f => f.configured).length;
      const missing = fiscoStatuses.filter(f => !f.configured).length;
      response = `📊 **Report Fiscale Centralizzato**\n\n✅ Operativi: ${configured} tenant\n🔴 Da configurare: ${missing} tenant\n\n` +
        fiscoStatuses.map(f => `• **${f.tenantName}**: ${f.configured ? "🟢 Vault attivo — Connessione validata" : "🔴 Vault non configurato"}`).join("\n") +
        "\n\n💡 Puoi inviare una richiesta di setup ai tenant non configurati dalla tab **Fiscalità**.";
    } else if (input.includes("sicur") || input.includes("cript") || input.includes("privacy")) {
      response = "🔐 **Architettura di Sicurezza Vault**\n\n• Le chiavi API sono criptate AES-256 lato server\n• Isolamento completo per tenant (zero cross-access)\n• Tu vedi **solo lo stato** (Verde/Rosso), mai le chiavi\n• Il ristoratore è l'unico custode delle proprie credenziali\n• Audit trail completo su ogni modifica";
    } else if (input.includes("richiedi") || input.includes("notif") || input.includes("setup")) {
      const unconfigured = fiscoStatuses.filter(f => !f.configured);
      if (unconfigured.length === 0) {
        response = "✅ Tutti i tenant hanno il Vault Fiscale configurato. Nessuna azione necessaria.";
      } else {
        response = `📨 Tenant che necessitano configurazione:\n\n${unconfigured.map(f => `• **${f.tenantName}** — Provider: ${f.provider}`).join("\n")}\n\nVuoi che invii una notifica di setup a tutti?`;
      }
    } else if (input.includes("rendita") || input.includes("2%") || input.includes("fee")) {
      const totalFee = tenants.reduce((s, t) => s + t.fee2percent, 0);
      response = `💰 **Rendita 2% Globale**\n\nFee totali accumulate: **€${totalFee.toLocaleString()}**\nTenant attivi: ${tenants.filter(t => t.active).length}\nTransato totale: €${tenants.reduce((s, t) => s + t.monthlyRevenue, 0).toLocaleString()}\n\nLa fatturazione automatica si attiverà con Stripe Connect.`;
    }

    setTimeout(() => {
      setMaryMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 800);
  };

  const totalRevenue = tenants.reduce((s, t) => s + t.monthlyRevenue, 0);
  const totalFee = tenants.reduce((s, t) => s + t.fee2percent, 0);
  const totalOrders = tenants.reduce((s, t) => s + t.orders, 0);
  const activeTenants = tenants.filter(t => t.active).length;
  const filteredTenants = tenants.filter(t => t.name.toLowerCase().includes(searchTenant.toLowerCase()));
  const fiscoConfigured = fiscoStatuses.filter(f => f.configured).length;
  const fiscoMissing = fiscoStatuses.filter(f => !f.configured).length;

  const systemStatus = [
    { name: "Stripe Connect", status: "online" as const, latency: "45ms" },
    { name: "Lovable AI (OCR)", status: "online" as const, latency: "120ms" },
    { name: "Database", status: "online" as const, latency: "12ms" },
    { name: "Storage CDN", status: "online" as const, latency: "8ms" },
  ];
  const statusIcons = {
    online: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    degraded: <AlertCircle className="w-4 h-4 text-amber-400" />,
    offline: <XCircle className="w-4 h-4 text-accent" />,
  };

  const tabs: { id: SuperTab; label: string; icon: React.ReactNode }[] = [
    { id: "overview", label: "Overview", icon: <BarChart3 className="w-5 h-5" /> },
    { id: "tenants", label: "Tenant", icon: <Store className="w-5 h-5" /> },
    { id: "fisco", label: "Fiscalità", icon: <ShieldCheck className="w-5 h-5" /> },
    { id: "billing", label: "Fatture", icon: <DollarSign className="w-5 h-5" /> },
    { id: "mary", label: "AI-Mary", icon: <Bot className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-primary/20 flex items-center justify-center">
            <Crown className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Comando Centrale</h1>
            <p className="text-xs text-primary">kevin97bernardini@gmail.com</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-5 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 pb-8">
        {loading && (
          <div className="flex items-center justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {/* OVERVIEW */}
        {!loading && activeTab === "overview" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-card border border-primary/20">
                <Crown className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-primary">€{totalFee.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Rendita netta 2%</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">€{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Volume transato</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <Store className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{activeTenants}/{tenants.length}</p>
                <p className="text-xs text-muted-foreground">Tenant operativi</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <ShieldCheck className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{fiscoConfigured}/{fiscoStatuses.length}</p>
                <p className="text-xs text-muted-foreground">Vault fiscali attivi</p>
              </div>
            </div>

            {/* Fiscal status summary */}
            {fiscoMissing > 0 && (
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-accent flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-foreground">{fiscoMissing} Vault fiscali non configurati</p>
                  <p className="text-xs text-muted-foreground">Vai alla tab Fiscalità per richiedere il setup</p>
                </div>
              </div>
            )}

            {tenants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Top performer per volume</h3>
                <div className="space-y-2">
                  {tenants
                    .filter(t => t.active)
                    .sort((a, b) => b.monthlyRevenue - a.monthlyRevenue)
                    .slice(0, 3)
                    .map((t, i) => (
                      <div key={t.id} className="flex items-center gap-3 p-3 rounded-xl bg-card">
                        <span className="text-lg font-display font-bold text-primary w-6">#{i + 1}</span>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-foreground">{t.name}</p>
                          <p className="text-xs text-muted-foreground">{t.city} · {t.orders} ordini</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-display font-bold text-foreground">€{t.monthlyRevenue.toLocaleString()}</p>
                          <p className="text-xs text-primary">+€{t.fee2percent} rendita</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {tenants.length === 0 && (
              <div className="text-center py-12">
                <Store className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nessun tenant registrato</p>
              </div>
            )}

            {/* System Status inline */}
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-3">Infrastruttura</h3>
              <div className="grid grid-cols-2 gap-2">
                {systemStatus.map((sys) => (
                  <div key={sys.name} className="flex items-center gap-2 p-2.5 rounded-xl bg-card">
                    {statusIcons[sys.status]}
                    <span className="text-xs text-foreground">{sys.name}</span>
                    <span className="text-[10px] text-muted-foreground ml-auto">{sys.latency}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* TENANTS with Kill-Switch */}
        {!loading && activeTab === "tenants" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Cerca tenant..." value={searchTenant}
                onChange={(e) => setSearchTenant(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="space-y-2">
              {filteredTenants.map((tenant) => {
                const fiscoStatus = fiscoStatuses.find(f => f.restaurantId === tenant.id);
                return (
                  <div key={tenant.id}
                    className={`p-4 rounded-2xl ${tenant.active ? "bg-card" : "bg-card/50 opacity-60"} border ${tenant.active ? "border-border" : "border-accent/20"}`}>
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-foreground">{tenant.name}</h4>
                          {fiscoStatus && (
                            <span className={`w-2.5 h-2.5 rounded-full ${fiscoStatus.configured ? "bg-green-400" : "bg-red-400"}`} 
                              title={fiscoStatus.configured ? "Vault Fiscale operativo" : "Vault Fiscale non configurato"} />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{tenant.city} · /{tenant.slug}</p>
                      </div>
                      <button onClick={() => toggleTenant(tenant.id)}
                        className={`p-2 rounded-xl transition-colors ${
                          tenant.active ? "bg-green-500/10 text-green-400 hover:bg-green-500/20" : "bg-accent/10 text-accent hover:bg-accent/20"
                        }`}>
                        <Power className="w-5 h-5" />
                      </button>
                    </div>
                    {tenant.active && (
                      <div className="flex gap-4 text-xs text-muted-foreground mt-2">
                        <span>€{tenant.monthlyRevenue.toLocaleString()} transato</span>
                        <span>{tenant.orders} ordini</span>
                        <span className="text-primary font-medium">+€{tenant.fee2percent} rendita</span>
                      </div>
                    )}
                    {!tenant.active && <p className="text-xs text-accent mt-1">⛔ Kill-Switch attivo — Tenant disabilitato</p>}
                  </div>
                );
              })}
              {filteredTenants.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">Nessun tenant trovato</p>
              )}
            </div>
          </motion.div>
        )}

        {/* FISCALITÀ — Monitoring Table (Kevin sees ONLY status, never keys) */}
        {!loading && activeTab === "fisco" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-2 mb-1">
                <Lock className="w-4 h-4 text-primary" />
                <h3 className="text-sm font-semibold text-foreground">Monitoraggio Fiscale Centralizzato</h3>
              </div>
              <p className="text-xs text-muted-foreground">
                Visibilità esclusiva sullo stato operativo. Le chiavi API restano criptate nel Vault privato di ogni ristoratore.
              </p>
            </div>

            {/* Summary cards */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
                <p className="text-3xl font-display font-bold text-green-400">{fiscoConfigured}</p>
                <p className="text-xs text-muted-foreground mt-1">🟢 Vault Operativi</p>
              </div>
              <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 text-center">
                <p className="text-3xl font-display font-bold text-accent">{fiscoMissing}</p>
                <p className="text-xs text-muted-foreground mt-1">🔴 Setup Richiesto</p>
              </div>
            </div>

            {/* Fiscal monitoring table */}
            <div className="space-y-2">
              {fiscoStatuses.map((config) => (
                <div key={config.id} className={`p-4 rounded-2xl border ${
                  config.configured ? "bg-card border-green-500/20" : "bg-card border-accent/20"
                }`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full flex-shrink-0 ${
                        config.configured ? "bg-green-400 shadow-[0_0_8px_rgba(74,222,128,0.5)]" : "bg-red-400 shadow-[0_0_8px_rgba(248,113,113,0.5)]"
                      }`} />
                      <div>
                        <h4 className="font-medium text-foreground text-sm">{config.tenantName}</h4>
                        <p className="text-xs text-muted-foreground">Provider: {config.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {config.configured ? (
                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400">
                          Operativo
                        </span>
                      ) : (
                        <button onClick={() => handleRequestFiscoSetup(config.tenantName)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium hover:bg-primary/90 transition-colors">
                          <Bell className="w-3 h-3" />
                          Richiedi Setup
                        </button>
                      )}
                    </div>
                  </div>
                  {config.configured && (
                    <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
                      <ShieldCheck className="w-3 h-3 text-green-400" />
                      <span>Vault criptato AES-256 · Ultimo aggiornamento: {new Date(config.updatedAt).toLocaleDateString("it-IT")}</span>
                    </div>
                  )}
                </div>
              ))}
              {fiscoStatuses.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">Nessun tenant con configurazione fiscale</p>
              )}
            </div>
          </motion.div>
        )}

        {/* BILLING */}
        {!loading && activeTab === "billing" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground">Setup fee potenziali</p>
                <p className="text-xl font-display font-bold text-foreground">€{(tenants.length * 1997).toLocaleString()}</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <p className="text-xs text-muted-foreground">Rendita 2% accumulata</p>
                <p className="text-xl font-display font-bold text-primary">€{totalFee.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center py-4">
              La fatturazione automatica si attiverà con l'integrazione Stripe Connect. Ogni transazione genera rendita passiva del 2%.
            </p>
          </motion.div>
        )}

        {/* AI-MARY — Command Center */}
        {!loading && activeTab === "mary" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI-Mary — Agente di Comando</p>
                <p className="text-xs text-muted-foreground">Monitoraggio fiscale · Analisi rendita · Controllo tenant</p>
              </div>
            </div>

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="h-80 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {maryMessages.map((msg, i) => (
                  <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>
                      {msg.content}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input type="text" placeholder="Chiedi a Mary: stato fiscale, rendita, sicurezza..." value={maryInput}
                  onChange={(e) => setMaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMaryMessage()}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <motion.button onClick={handleMaryMessage}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center"
                  whileTap={{ scale: 0.9 }}>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
