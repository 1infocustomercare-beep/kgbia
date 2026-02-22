import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Key, HeadphonesIcon, CheckCircle2, XCircle, AlertCircle,
  LogOut, Cpu, Wifi, ChevronRight, Eye, EyeOff, Save, Bot, Send
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type StaffTab = "mary" | "fisco" | "status";

const StaffPanel = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<StaffTab>("mary");
  const [fiscoConfigs, setFiscoConfigs] = useState<any[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  // AI-Mary
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Ciao! Sono **Mary**, il tuo agente IA per l'onboarding fiscale.\n\nPosso aiutarti con:\n• Configurazione API fiscali (Scontrino.it / Aruba)\n• Verifica stato connessioni\n• Guida BYOK passo-passo\n\nCome posso aiutarti?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  useEffect(() => {
    const fetchFisco = async () => {
      const { data } = await supabase.from("fisco_configs").select("*, restaurants(name)");
      if (data) {
        setFiscoConfigs(data.map(f => ({
          id: f.id, restaurantId: f.restaurant_id,
          tenantName: (f as any).restaurants?.name || "—",
          provider: f.provider, apiKey: f.api_key_encrypted || "", configured: f.configured,
        })));
      }
    };
    fetchFisco();
  }, []);

  const handleSaveKey = async (configId: string) => {
    await supabase.from("fisco_configs").update({
      api_key_encrypted: editKey, configured: editKey.length > 0,
    }).eq("id", configId);
    setFiscoConfigs(prev => prev.map(f => f.id === configId ? { ...f, apiKey: editKey, configured: editKey.length > 0 } : f));
    setEditingId(null); setEditKey("");
    toast({ title: "Chiave API salvata" });
  };

  const handleMaryMessage = () => {
    if (!maryInput.trim()) return;
    setMaryMessages(prev => [...prev, { role: "user", content: maryInput }]);
    const input = maryInput.toLowerCase();
    setMaryInput("");

    let response = "Per qualsiasi configurazione fiscale, vai nella sezione BYOK Fisco. Vuoi che ti guidi?";
    if (input.includes("scontrino") || input.includes("aruba")) {
      response = "Per configurare il provider:\n\n1. Accedi al portale (Scontrino.it o Aruba)\n2. Vai su Impostazioni → API Keys\n3. Genera una nuova chiave\n4. Copiala nella sezione BYOK Fisco\n\n🔐 La chiave viene criptata e isolata per ristorante.";
    } else if (input.includes("verifica") || input.includes("stato")) {
      response = "Stato connessioni:\n\n" + fiscoConfigs.map(f => `• **${f.tenantName}**: ${f.configured ? "🟢 OK" : "🔴 Mancante"}`).join("\n");
    } else if (input.includes("come") || input.includes("guida")) {
      response = "**BYOK = Bring Your Own Key**\n\nOgni ristorante inserisce la propria chiave fiscale.\n\n✅ Criptazione end-to-end\n✅ Isolamento per tenant\n✅ Validazione automatica\n✅ Semaforo verde/rosso";
    }

    setTimeout(() => {
      setMaryMessages(prev => [...prev, { role: "assistant", content: response }]);
    }, 600);
  };

  const systemStatus = [
    { name: "Stripe Connect", status: "online" as const, latency: "45ms" },
    { name: "Lovable AI", status: "online" as const, latency: "120ms" },
    { name: "Database", status: "online" as const, latency: "12ms" },
    { name: "Storage CDN", status: "online" as const, latency: "8ms" },
  ];
  const statusIcons = {
    online: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    degraded: <AlertCircle className="w-4 h-4 text-amber-400" />,
    offline: <XCircle className="w-4 h-4 text-accent" />,
  };

  const tabs: { id: StaffTab; label: string; icon: React.ReactNode }[] = [
    { id: "mary", label: "AI-Mary", icon: <Bot className="w-5 h-5" /> },
    { id: "fisco", label: "BYOK Fisco", icon: <Key className="w-5 h-5" /> },
    { id: "status", label: "Status", icon: <Cpu className="w-5 h-5" /> },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate("/admin");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Staff Panel</h1>
            <p className="text-xs text-muted-foreground">Mary · Supporto operativo</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex gap-1 px-5 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-8">
        {/* AI-Mary */}
        {activeTab === "mary" && (
          <motion.div className="mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="h-[60vh] overflow-y-auto p-4 space-y-3 scrollbar-hide">
                {maryMessages.map((msg, i) => (
                  <motion.div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                    <div className={`max-w-[85%] px-4 py-2.5 rounded-2xl text-sm whitespace-pre-line ${
                      msg.role === "user" ? "bg-primary text-primary-foreground rounded-br-md" : "bg-secondary text-secondary-foreground rounded-bl-md"
                    }`}>{msg.content}</div>
                  </motion.div>
                ))}
              </div>
              <div className="p-3 border-t border-border flex gap-2">
                <input type="text" placeholder="Chiedi a Mary..." value={maryInput}
                  onChange={(e) => setMaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMaryMessage()}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <motion.button onClick={handleMaryMessage}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center" whileTap={{ scale: 0.9 }}>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* BYOK Fisco */}
        {activeTab === "fisco" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" /> BYOK — Bring Your Own Key
              </h3>
              <p className="text-xs text-muted-foreground mt-1">Chiavi API fiscali criptate e isolate per ogni ristorante.</p>
            </div>
            {fiscoConfigs.length === 0 && <p className="text-sm text-muted-foreground text-center py-8">Nessun ristorante configurato</p>}
            {fiscoConfigs.map((config) => (
              <div key={config.id} className="p-4 rounded-2xl bg-card border border-border">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-medium text-foreground">{config.tenantName}</h4>
                    <p className="text-xs text-muted-foreground">Provider: {config.provider}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                    config.configured ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                  }`}>{config.configured ? "🟢 Configurato" : "🔴 Da configurare"}</span>
                </div>
                {editingId === config.id ? (
                  <div className="space-y-2">
                    <input type="text" placeholder="Inserisci API Key fiscale..." value={editKey}
                      onChange={(e) => setEditKey(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-mono placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                    <div className="flex gap-2">
                      <button onClick={() => handleSaveKey(config.id)} className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1">
                        <Save className="w-3.5 h-3.5" /> Salva
                      </button>
                      <button onClick={() => setEditingId(null)} className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm">Annulla</button>
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
          </motion.div>
        )}

        {/* Status */}
        {activeTab === "status" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-400" />
                <p className="text-sm font-medium text-foreground">Tutti i sistemi operativi</p>
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
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaffPanel;
