import { useState } from "react";
import { motion } from "framer-motion";
import {
  Key, HeadphonesIcon, CheckCircle2, XCircle, AlertCircle,
  LogOut, Users, Shield, Database, Cpu, Wifi, ChevronRight,
  Plus, Eye, EyeOff, Save, Search
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface FiscoConfig {
  tenantId: string;
  tenantName: string;
  provider: string;
  apiKey: string;
  configured: boolean;
}

interface Ticket {
  id: string;
  tenant: string;
  subject: string;
  status: "open" | "in_progress" | "resolved";
  priority: "high" | "medium" | "low";
  createdAt: string;
}

const demoFisco: FiscoConfig[] = [
  { tenantId: "1", tenantName: "Impero Roma", provider: "Scontrino.it", apiKey: "sk_live_abc...xyz", configured: true },
  { tenantId: "2", tenantName: "La Bella Napoli", provider: "Scontrino.it", apiKey: "", configured: false },
  { tenantId: "3", tenantName: "Trattoria Milano", provider: "FatturaPro", apiKey: "fp_key_123...890", configured: true },
];

const demoTickets: Ticket[] = [
  { id: "TK-001", tenant: "Impero Roma", subject: "Menu non si aggiorna", status: "open", priority: "high", createdAt: "22 Feb 2026" },
  { id: "TK-002", tenant: "La Bella Napoli", subject: "Problema pagamento Stripe", status: "in_progress", priority: "high", createdAt: "21 Feb 2026" },
  { id: "TK-003", tenant: "Trattoria Milano", subject: "Richiesta nuova categoria menu", status: "resolved", priority: "low", createdAt: "20 Feb 2026" },
];

type StaffTab = "fisco" | "tickets" | "status";

const StaffPanel = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<StaffTab>("fisco");
  const [fiscoConfigs, setFiscoConfigs] = useState(demoFisco);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editKey, setEditKey] = useState("");
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const systemStatus = [
    { name: "Stripe Connect", status: "online" as const, latency: "45ms" },
    { name: "Lovable AI (OCR)", status: "online" as const, latency: "120ms" },
    { name: "Database (Supabase)", status: "online" as const, latency: "12ms" },
    { name: "Storage CDN", status: "online" as const, latency: "8ms" },
    { name: "Push Notifications", status: "degraded" as const, latency: "890ms" },
  ];

  const statusIcons = {
    online: <CheckCircle2 className="w-4 h-4 text-green-400" />,
    degraded: <AlertCircle className="w-4 h-4 text-amber-400" />,
    offline: <XCircle className="w-4 h-4 text-accent" />,
  };

  const ticketStatusColors = {
    open: "bg-accent/10 text-accent",
    in_progress: "bg-amber-500/10 text-amber-400",
    resolved: "bg-green-500/10 text-green-400",
  };

  const ticketStatusLabels = {
    open: "Aperto",
    in_progress: "In corso",
    resolved: "Risolto",
  };

  const tabs: { id: StaffTab; label: string; icon: React.ReactNode }[] = [
    { id: "fisco", label: "BYOK Fisco", icon: <Key className="w-5 h-5" /> },
    { id: "tickets", label: "Ticket", icon: <HeadphonesIcon className="w-5 h-5" /> },
    { id: "status", label: "Status", icon: <Cpu className="w-5 h-5" /> },
  ];

  const handleSaveKey = (tenantId: string) => {
    setFiscoConfigs((prev) =>
      prev.map((f) =>
        f.tenantId === tenantId ? { ...f, apiKey: editKey, configured: editKey.length > 0 } : f
      )
    );
    setEditingId(null);
    setEditKey("");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-secondary flex items-center justify-center">
            <HeadphonesIcon className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h1 className="text-lg font-display font-bold text-foreground">Staff Panel</h1>
            <p className="text-xs text-muted-foreground">Mary · Supporto operativo</p>
          </div>
        </div>
        <button
          onClick={() => navigate("/admin")}
          className="p-2 rounded-full hover:bg-secondary transition-colors"
        >
          <LogOut className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 px-5 py-3 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary/50 text-muted-foreground"
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="px-5 pb-8">
        {/* BYOK FISCO */}
        {activeTab === "fisco" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
              <h3 className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Key className="w-4 h-4 text-primary" />
                BYOK — Bring Your Own Key
              </h3>
              <p className="text-xs text-muted-foreground mt-1">
                Inserisci le chiavi API fiscali per conto dei clienti. Le chiavi sono criptate e usate solo per l'invio dei corrispettivi.
              </p>
            </div>

            <div className="space-y-3">
              {fiscoConfigs.map((config) => (
                <div key={config.tenantId} className="p-4 rounded-2xl bg-card border border-border">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-medium text-foreground">{config.tenantName}</h4>
                      <p className="text-xs text-muted-foreground">Provider: {config.provider}</p>
                    </div>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      config.configured ? "bg-green-500/10 text-green-400" : "bg-accent/10 text-accent"
                    }`}>
                      {config.configured ? "Configurato" : "Da configurare"}
                    </span>
                  </div>

                  {editingId === config.tenantId ? (
                    <div className="space-y-2">
                      <input
                        type="text"
                        placeholder="Inserisci API Key fiscale..."
                        value={editKey}
                        onChange={(e) => setEditKey(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 font-mono"
                      />
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSaveKey(config.tenantId)}
                          className="flex-1 py-2 rounded-xl bg-primary text-primary-foreground text-sm font-medium flex items-center justify-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" /> Salva
                        </button>
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-4 py-2 rounded-xl bg-secondary text-secondary-foreground text-sm"
                        >
                          Annulla
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      {config.configured ? (
                        <>
                          <code className="flex-1 text-xs text-muted-foreground font-mono bg-secondary/50 px-3 py-2 rounded-lg truncate">
                            {showKeys[config.tenantId] ? config.apiKey : "••••••••••••••••"}
                          </code>
                          <button
                            onClick={() => setShowKeys((prev) => ({ ...prev, [config.tenantId]: !prev[config.tenantId] }))}
                            className="p-2 rounded-lg hover:bg-secondary transition-colors"
                          >
                            {showKeys[config.tenantId] ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                          </button>
                        </>
                      ) : null}
                      <button
                        onClick={() => {
                          setEditingId(config.tenantId);
                          setEditKey(config.apiKey);
                        }}
                        className="px-3 py-2 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium"
                      >
                        {config.configured ? "Modifica" : "Configura"}
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* TICKETS */}
        {activeTab === "tickets" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="flex justify-between items-center">
              <h3 className="text-sm font-semibold text-foreground">Ticket assistenza</h3>
              <span className="text-xs text-accent font-medium">
                {demoTickets.filter((t) => t.status === "open").length} aperti
              </span>
            </div>

            <div className="space-y-2">
              {demoTickets.map((ticket) => (
                <div key={ticket.id} className="p-4 rounded-2xl bg-card border border-border">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-muted-foreground">{ticket.id}</span>
                        <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${ticketStatusColors[ticket.status]}`}>
                          {ticketStatusLabels[ticket.status]}
                        </span>
                      </div>
                      <h4 className="font-medium text-sm text-foreground mt-1">{ticket.subject}</h4>
                      <p className="text-xs text-muted-foreground mt-0.5">{ticket.tenant} · {ticket.createdAt}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {/* SYSTEM STATUS */}
        {activeTab === "status" && (
          <motion.div className="space-y-4 mt-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <div className="p-4 rounded-2xl bg-green-500/5 border border-green-500/20">
              <div className="flex items-center gap-2">
                <Wifi className="w-5 h-5 text-green-400" />
                <div>
                  <p className="text-sm font-medium text-foreground">Tutti i sistemi operativi</p>
                  <p className="text-xs text-muted-foreground">Ultimo check: 2 min fa</p>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              {systemStatus.map((sys) => (
                <div key={sys.name} className="flex items-center justify-between p-3 rounded-xl bg-card">
                  <div className="flex items-center gap-3">
                    {statusIcons[sys.status]}
                    <span className="text-sm text-foreground">{sys.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-muted-foreground">{sys.latency}</span>
                    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      sys.status === "online" ? "bg-green-500/10 text-green-400" :
                      sys.status === "degraded" ? "bg-amber-500/10 text-amber-400" :
                      "bg-accent/10 text-accent"
                    }`}>
                      {sys.status === "online" ? "Online" : sys.status === "degraded" ? "Degradato" : "Offline"}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 rounded-2xl bg-card">
              <h4 className="text-sm font-semibold text-foreground mb-3">Risorse</h4>
              <div className="space-y-3">
                {[
                  { label: "CPU", value: 23, color: "bg-green-400" },
                  { label: "RAM", value: 45, color: "bg-primary" },
                  { label: "Storage", value: 62, color: "bg-amber-400" },
                ].map((res) => (
                  <div key={res.label}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-muted-foreground">{res.label}</span>
                      <span className="text-foreground">{res.value}%</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-secondary">
                      <motion.div
                        className={`h-full rounded-full ${res.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${res.value}%` }}
                        transition={{ duration: 0.8 }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default StaffPanel;
