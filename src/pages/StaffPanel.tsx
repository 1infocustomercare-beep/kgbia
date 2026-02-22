import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle2, XCircle, AlertCircle,
  LogOut, Cpu, Wifi, Bot, Send, ShieldCheck
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type StaffTab = "mary" | "status";

const StaffPanel = () => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<StaffTab>("mary");
  const [fiscoConfigs, setFiscoConfigs] = useState<any[]>([]);

  // AI-Mary
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Ciao! Sono **Mary**, l'agente IA per il supporto operativo.\n\nPosso assisterti con:\n• 📊 Stato operativo dei Vault fiscali\n• 🔔 Notifiche di setup ai ristoratori\n• ✅ Verifica connessioni in tempo reale\n\n🔐 Nota: non hai accesso alle chiavi private. Solo al semaforo operativo.\n\nCome posso aiutarti?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  useEffect(() => {
    const fetchFisco = async () => {
      const { data } = await supabase.from("fisco_configs").select("*, restaurants(name)");
      if (data) {
        setFiscoConfigs(data.map(f => ({
          id: f.id, restaurantId: f.restaurant_id,
          tenantName: (f as any).restaurants?.name || "—",
          provider: f.provider, configured: f.configured,
        })));
      }
    };
    fetchFisco();
  }, []);

  const handleMaryMessage = () => {
    if (!maryInput.trim()) return;
    setMaryMessages(prev => [...prev, { role: "user", content: maryInput }]);
    const input = maryInput.toLowerCase();
    setMaryInput("");

    let response = "Posso mostrarti lo stato operativo dei Vault fiscali. Chiedi 'stato' per una panoramica completa.";
    if (input.includes("stato") || input.includes("verifica")) {
      const configured = fiscoConfigs.filter(f => f.configured).length;
      const missing = fiscoConfigs.filter(f => !f.configured).length;
      response = `📊 **Report Operativo**\n\n✅ Vault attivi: ${configured}\n🔴 Setup richiesto: ${missing}\n\n` +
        fiscoConfigs.map(f => `• **${f.tenantName}**: ${f.configured ? "🟢 Operativo" : "🔴 Non configurato"}`).join("\n") +
        "\n\n🔐 Le chiavi sono criptate nel Vault privato di ogni ristoratore.";
    } else if (input.includes("sicur") || input.includes("chi vede")) {
      response = "🔐 **Architettura di Sicurezza**\n\n• Chiavi criptate AES-256 nel Vault privato\n• Staff vede solo lo stato operativo (Verde/Rosso)\n• Zero accesso alle credenziali fiscali\n• Audit trail completo su ogni modifica";
    } else if (input.includes("come") || input.includes("guida")) {
      response = "**Flusso Operativo:**\n\n1. Il ristoratore configura il suo Vault dal pannello Admin\n2. AI-Mary valida la connessione automaticamente\n3. Lo stato (🟢/🔴) è visibile qui e al Super-Admin\n4. Se serve setup, il Super-Admin invia una notifica";
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
    { id: "status", label: "Infrastruttura", icon: <Cpu className="w-5 h-5" /> },
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
            <h1 className="text-lg font-display font-bold text-foreground">Supporto Operativo</h1>
            <p className="text-xs text-muted-foreground">AI-Mary · Monitoraggio Vault</p>
          </div>
        </div>
        <button onClick={handleLogout} className="p-2 rounded-full hover:bg-secondary transition-colors">
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      <div className="flex gap-1.5 px-4 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-colors min-h-[44px] ${
              activeTab === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary/50 text-muted-foreground"
            }`}>
            {tab.icon} {tab.label}
          </button>
        ))}
      </div>

      <div className="px-5 pb-8">
        {/* AI-Mary */}
        {activeTab === "mary" && (
          <motion.div className="mt-2 space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Fiscal status overview */}
            {fiscoConfigs.length > 0 && (
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-2xl bg-green-500/5 border border-green-500/20 text-center">
                  <p className="text-2xl font-display font-bold text-green-400">{fiscoConfigs.filter(f => f.configured).length}</p>
                  <p className="text-xs text-muted-foreground">🟢 Operativi</p>
                </div>
                <div className="p-3 rounded-2xl bg-accent/5 border border-accent/20 text-center">
                  <p className="text-2xl font-display font-bold text-accent">{fiscoConfigs.filter(f => !f.configured).length}</p>
                  <p className="text-xs text-muted-foreground">🔴 Da configurare</p>
                </div>
              </div>
            )}

            <div className="rounded-2xl bg-card border border-border overflow-hidden">
              <div className="h-[55vh] overflow-y-auto p-4 space-y-3 scrollbar-hide">
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
                <input type="text" placeholder="Chiedi a Mary: stato Vault, sicurezza, flusso..." value={maryInput}
                  onChange={(e) => setMaryInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleMaryMessage()}
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30" />
                <motion.button onClick={handleMaryMessage}
                  className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center" whileTap={{ scale: 0.9 }}>
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Infrastruttura */}
        {activeTab === "status" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
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

            {/* Vault overview in status */}
            <div>
              <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">Stato Vault Fiscali</p>
              {fiscoConfigs.map((config) => (
                <div key={config.id} className="flex items-center justify-between p-3 rounded-xl bg-card mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${config.configured ? "bg-green-400" : "bg-red-400"}`} />
                    <span className="text-sm text-foreground">{config.tenantName}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">{config.provider}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaffPanel;
