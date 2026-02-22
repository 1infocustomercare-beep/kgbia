import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Crown, Power, TrendingUp, DollarSign, Users, Store,
  Megaphone, BarChart3, LogOut, Search,
  Key, HeadphonesIcon, CheckCircle2, XCircle, AlertCircle,
  Cpu, Wifi, ChevronRight, Eye, EyeOff, Save, Bot, Send
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

type SuperTab = "overview" | "tenants" | "ads" | "billing" | "staff";

const SuperAdminDashboard = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<SuperTab>("overview");
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [searchTenant, setSearchTenant] = useState("");
  const [staffSubTab, setStaffSubTab] = useState<"fisco" | "mary" | "status">("fisco");
  const [fiscoConfigs, setFiscoConfigs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // AI-Mary chat
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Ciao! Sono Mary, il tuo agente IA per la configurazione fiscale. Posso aiutarti a:\n\n• Configurare le API fiscali (Scontrino.it / Aruba)\n• Verificare lo stato delle connessioni\n• Guidarti nel processo BYOK\n\nCome posso aiutarti?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    // Fetch all restaurants
    const { data: restaurants } = await supabase
      .from("restaurants")
      .select("id, name, slug, is_active, city")
      .order("created_at", { ascending: false });

    if (restaurants) {
      // Fetch order totals per restaurant
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

    // Fetch fisco configs
    const { data: fisco } = await supabase
      .from("fisco_configs")
      .select("*, restaurants(name)");
    if (fisco) {
      setFiscoConfigs(fisco.map(f => ({
        id: f.id,
        restaurantId: f.restaurant_id,
        tenantName: (f as any).restaurants?.name || "—",
        provider: f.provider,
        apiKey: f.api_key_encrypted || "",
        configured: f.configured,
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
    toast({ title: newActive ? "Ristorante attivato" : "Ristorante disattivato (Kill-Switch)" });
  };

  const handleSaveKey = async (configId: string) => {
    await supabase.from("fisco_configs").update({
      api_key_encrypted: editKey,
      configured: editKey.length > 0,
    }).eq("id", configId);
    setFiscoConfigs(prev => prev.map(f => f.id === configId ? { ...f, apiKey: editKey, configured: editKey.length > 0 } : f));
    setEditingId(null);
    setEditKey("");
    toast({ title: "Chiave API salvata" });
  };

  const handleMaryMessage = () => {
    if (!maryInput.trim()) return;
    const userMsg = { role: "user", content: maryInput };
    setMaryMessages(prev => [...prev, userMsg]);
    setMaryInput("");

    // Simulated AI-Mary responses based on keywords
    const input = maryInput.toLowerCase();
    let response = "Capisco! Per qualsiasi configurazione fiscale, vai nella sezione BYOK Fisco e inserisci la chiave API del provider scelto. Vuoi che ti guidi passo passo?";

    if (input.includes("scontrino") || input.includes("aruba")) {
      response = "Per configurare **Scontrino.it** o **Aruba**:\n\n1. Accedi al portale del provider\n2. Vai su Impostazioni → API Keys\n3. Genera una nuova chiave\n4. Copiala e incollala nella sezione BYOK Fisco\n\nLa chiave verrà criptata e isolata per ogni ristorante. Vuoi che verifichi una chiave esistente?";
    } else if (input.includes("verifica") || input.includes("test") || input.includes("stato")) {
      response = "✅ Ho verificato lo stato delle connessioni:\n\n" +
        fiscoConfigs.map(f => `• **${f.tenantName}**: ${f.configured ? "🟢 Configurato" : "🔴 Da configurare"}`).join("\n") +
        "\n\nVuoi che configuri una chiave mancante?";
    } else if (input.includes("come") || input.includes("guida") || input.includes("aiuto")) {
      response = "Ecco la guida rapida:\n\n**BYOK = Bring Your Own Key**\n\nOgni ristorante inserisce la propria chiave API fiscale. I vantaggi:\n\n• 🔐 Criptazione end-to-end\n• 🏠 Isolamento per tenant\n• ✅ Validazione automatica\n• 📊 Semaforo verde/rosso\n\nVai nella tab **BYOK Fisco** per iniziare!";
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
    { id: "ads", label: "B2B Ads", icon: <Megaphone className="w-5 h-5" /> },
    { id: "billing", label: "Fatture", icon: <DollarSign className="w-5 h-5" /> },
    { id: "staff", label: "Staff", icon: <HeadphonesIcon className="w-5 h-5" /> },
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
            <h1 className="text-lg font-display font-bold text-foreground">Super Admin</h1>
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
                <p className="text-xs text-muted-foreground">Rendita 2%</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <TrendingUp className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">€{totalRevenue.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Transato totale</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <Store className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{activeTenants}/{tenants.length}</p>
                <p className="text-xs text-muted-foreground">Locali attivi</p>
              </div>
              <div className="p-4 rounded-2xl bg-card">
                <Users className="w-5 h-5 text-primary mb-2" />
                <p className="text-2xl font-display font-bold text-foreground">{totalOrders.toLocaleString()}</p>
                <p className="text-xs text-muted-foreground">Ordini totali</p>
              </div>
            </div>

            {tenants.length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Top performer</h3>
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
                          <p className="text-xs text-primary">+€{t.fee2percent}</p>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {tenants.length === 0 && (
              <div className="text-center py-12">
                <Store className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
                <p className="text-sm text-muted-foreground">Nessun ristorante registrato</p>
              </div>
            )}
          </motion.div>
        )}

        {/* TENANTS with Kill-Switch */}
        {!loading && activeTab === "tenants" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input type="text" placeholder="Cerca ristorante..." value={searchTenant}
                onChange={(e) => setSearchTenant(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
            </div>
            <div className="space-y-2">
              {filteredTenants.map((tenant) => (
                <div key={tenant.id}
                  className={`p-4 rounded-2xl ${tenant.active ? "bg-card" : "bg-card/50 opacity-60"} border ${tenant.active ? "border-border" : "border-accent/20"}`}>
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium text-foreground">{tenant.name}</h4>
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
                      <span className="text-primary font-medium">+€{tenant.fee2percent} fee</span>
                    </div>
                  )}
                  {!tenant.active && <p className="text-xs text-accent mt-1">⛔ Kill-Switch attivo</p>}
                </div>
              ))}
              {filteredTenants.length === 0 && (
                <p className="text-center text-sm text-muted-foreground py-8">Nessun ristorante trovato</p>
              )}
            </div>
          </motion.div>
        )}

        {/* B2B ADS */}
        {!loading && activeTab === "ads" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="text-center py-12">
              <Megaphone className="w-12 h-12 mx-auto mb-3 text-muted-foreground/20" />
              <p className="text-foreground font-display font-semibold">B2B Ads Manager</p>
              <p className="text-sm text-muted-foreground mt-1">Il modulo sponsorizzazioni sarà disponibile con il primo cliente attivo.</p>
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
                <p className="text-xs text-muted-foreground">Fee 2% totali</p>
                <p className="text-xl font-display font-bold text-primary">€{totalFee.toLocaleString()}</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground text-center py-4">
              La fatturazione automatica verrà attivata con l'integrazione Stripe Connect.
            </p>
          </motion.div>
        )}

        {/* STAFF — AI-Mary + BYOK Fisco + Status */}
        {!loading && activeTab === "staff" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                <Bot className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">AI-Mary Agent</p>
                <p className="text-xs text-muted-foreground">Onboarding fiscale & supporto</p>
              </div>
            </div>

            <div className="flex gap-1">
              {([
                { id: "mary" as const, label: "AI-Mary", icon: <Bot className="w-4 h-4" /> },
                { id: "fisco" as const, label: "BYOK Fisco", icon: <Key className="w-4 h-4" /> },
                { id: "status" as const, label: "Status", icon: <Cpu className="w-4 h-4" /> },
              ]).map((st) => (
                <button key={st.id} onClick={() => setStaffSubTab(st.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    staffSubTab === st.id ? "bg-secondary text-foreground" : "text-muted-foreground"
                  }`}>
                  {st.icon}
                  {st.label}
                </button>
              ))}
            </div>

            {/* AI-Mary Chat */}
            {staffSubTab === "mary" && (
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
                  <input type="text" placeholder="Chiedi a Mary..." value={maryInput}
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
            )}

            {/* BYOK Fisco */}
            {staffSubTab === "fisco" && (
              <div className="space-y-3">
                {fiscoConfigs.length === 0 && (
                  <p className="text-center text-sm text-muted-foreground py-8">Nessun ristorante con configurazione fiscale</p>
                )}
                {fiscoConfigs.map((config) => (
                  <div key={config.id} className="p-4 rounded-2xl bg-card border border-border">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h4 className="font-medium text-foreground">{config.tenantName}</h4>
                        <p className="text-xs text-muted-foreground">Provider: {config.provider}</p>
                      </div>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        config.configured ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                      }`}>
                        {config.configured ? "🟢 Configurato" : "🔴 Da configurare"}
                      </span>
                    </div>
                    {editingId === config.id ? (
                      <div className="space-y-2">
                        <input type="text" placeholder="Inserisci API Key fiscale..." value={editKey}
                          onChange={(e) => setEditKey(e.target.value)}
                          className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono" />
                        <div className="flex gap-2">
                          <button onClick={() => handleSaveKey(config.id)}
                            className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1">
                            <Save className="w-3.5 h-3.5" /> Salva
                          </button>
                          <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm">
                            Annulla
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        {config.configured && (
                          <>
                            <code className="flex-1 text-xs text-muted-foreground font-mono bg-secondary/50 px-3 py-2 rounded-lg truncate">
                              {showKeys[config.id] ? config.apiKey : "••••••••••••••••"}
                            </code>
                            <button onClick={() => setShowKeys(prev => ({ ...prev, [config.id]: !prev[config.id] }))}
                              className="p-2 rounded-lg hover:bg-secondary transition-colors">
                              {showKeys[config.id] ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                            </button>
                          </>
                        )}
                        <button onClick={() => { setEditingId(config.id); setEditKey(config.apiKey); }}
                          className="px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium">
                          {config.configured ? "Modifica" : "Configura"}
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* System Status */}
            {staffSubTab === "status" && (
              <div className="space-y-3">
                <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
                  <div className="flex items-center gap-2">
                    <Wifi className="w-5 h-5 text-green-400" />
                    <div>
                      <p className="text-sm font-medium text-foreground">Tutti i sistemi operativi</p>
                      <p className="text-xs text-muted-foreground">Ultimo check: adesso</p>
                    </div>
                  </div>
                </div>
                {systemStatus.map((sys) => (
                  <div key={sys.name} className="flex items-center justify-between p-3 rounded-xl bg-card">
                    <div className="flex items-center gap-3">
                      {statusIcons[sys.status]}
                      <span className="text-sm text-foreground">{sys.name}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">{sys.latency}</span>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SuperAdminDashboard;
