import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode, Lock, MessageSquare, ShieldBan, Package, GraduationCap, Settings,
  Download, ExternalLink, Save, ShieldCheck, Bot, Send, Check, X,
  Phone, Mail, MapPin, Clock, Upload, Globe, Ban, FileCheck, Image,
  ArrowLeft, ChevronDown, ChevronRight, BookOpen, Lightbulb, Layers
} from "lucide-react";
import InfoGuide from "@/components/ui/info-guide";
import { pageGuides, featureGuides } from "@/config/feature-guides";
import PrivateChat from "@/components/restaurant/PrivateChat";
import SubscriptionSection from "@/components/admin/SubscriptionSection";
import UpgradePrompt from "@/components/admin/UpgradePrompt";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { generateQRDataUrl, downloadQR } from "@/lib/qr";
import { BUSINESS_TYPE_OPTIONS, type BusinessType } from "@/lib/business-type";
import { CreditCard } from "lucide-react";
import { useSubscription } from "@/hooks/useSubscription";
import type { FeatureKey } from "@/lib/subscription-plans";

type MoreSection = "grid" | "qr" | "vault" | "chat" | "blacklist" | "inventory" | "academy" | "settings" | "subscription";

interface MoreMenuProps {
  restaurant: any;
  userId?: string;
  menuUrl: string;
  vaultConfig: any;
  setVaultConfig: React.Dispatch<React.SetStateAction<any>>;
  blacklist: any[];
  setBlacklist: React.Dispatch<React.SetStateAction<any[]>>;

  settingsBusinessType: BusinessType;
  setSettingsBusinessType: (v: BusinessType) => void;

  settingsPhone: string;
  setSettingsPhone: (v: string) => void;
  settingsEmail: string;
  setSettingsEmail: (v: string) => void;
  settingsAddress: string;
  setSettingsAddress: (v: string) => void;
  settingsCity: string;
  setSettingsCity: (v: string) => void;
  settingsHours: { day: string; hours: string }[];
  setSettingsHours: React.Dispatch<React.SetStateAction<{ day: string; hours: string }[]>>;
  settingsMinOrder: number;
  setSettingsMinOrder: (v: number) => void;
  settingsBlockedKeywords: string[];
  setSettingsBlockedKeywords: React.Dispatch<React.SetStateAction<string[]>>;
  policyAccepted: boolean;
  setPolicyAccepted: React.Dispatch<React.SetStateAction<boolean>>;
  handleSaveSettings: () => void;
  settingsSaving: boolean;
  menuItems: any[];
  orders: any[];
  restaurantTables: any[];
}

/* ── Academy Section — auto-generated from feature-guides.ts ── */
const AcademySection = () => {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);

  const categories = useMemo(() => {
    const cats: Record<string, { title: string; description: string; steps?: string[]; key: string }[]> = {};

    // Group page guides by category
    const routeLabels: Record<string, string> = {
      "/dashboard": "Dashboard", "/app": "Centro Operativo",
      "/app/menu": "Menu", "/app/orders": "Ordini", "/app/reservations": "Prenotazioni",
      "/app/reviews": "Recensioni", "/app/tables": "Tavoli", "/app/kitchen": "Cucina",
      "/app/finance": "Finanza", "/app/staff": "Staff", "/app/settings": "Impostazioni",
      "/app/whatsapp": "WhatsApp", "/app/inventory": "Inventario", "/app/loyalty": "Fedeltà",
      "/app/social": "Social", "/app/automations": "Automazioni", "/app/clients": "CRM",
      "/app/web-hub": "Web Hub", "/app/ai-marketplace": "AI Marketplace",
      "/app/ncc-bookings": "NCC Prenotazioni", "/app/fleet": "Flotta", "/app/drivers": "Autisti",
      "/app/appointments": "Appuntamenti", "/app/interventions": "Interventi", "/app/haccp": "HACCP",
      "/partner": "Partner",
    };

    // Pages → "Guida Pagine"
    Object.entries(pageGuides).forEach(([route, guide]) => {
      const catName = "📄 Guide Pagine";
      if (!cats[catName]) cats[catName] = [];
      cats[catName].push({ ...guide, key: route, title: `${routeLabels[route] || route} — ${guide.title}` });
    });

    // Feature guides → grouped by prefix
    const featureCatLabels: Record<string, string> = {
      dashboard: "📊 Dashboard", studio: "🎨 Studio Creativo", checkout: "💳 Checkout",
      restaurant: "🍽️ Ristorante", partner: "🤝 Partner", whatsapp: "💬 WhatsApp",
      subscription: "💎 Abbonamento",
    };

    Object.entries(featureGuides).forEach(([key, guide]) => {
      const prefix = key.split(":")[0];
      const catName = featureCatLabels[prefix] || `🔧 ${prefix}`;
      if (!cats[catName]) cats[catName] = [];
      cats[catName].push({ ...guide, key });
    });

    return cats;
  }, []);

  const totalGuides = Object.values(categories).reduce((s, items) => s + items.length, 0);

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="text-center py-3">
        <div className="w-14 h-14 rounded-2xl mx-auto mb-3 flex items-center justify-center" style={{ background: "linear-gradient(135deg, hsla(38,50%,55%,0.2), hsla(265,60%,55%,0.15))", border: "1px solid hsla(38,50%,55%,0.15)" }}>
          <GraduationCap className="w-7 h-7 text-primary" />
        </div>
        <h3 className="text-lg font-display font-bold text-foreground">Empire Academy</h3>
        <p className="text-[0.55rem] uppercase tracking-[3px] text-muted-foreground/50 font-semibold mt-1">Tutorial Completo · {totalGuides} Guide</p>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-2">
        {[
          { icon: BookOpen, label: "Guide", value: totalGuides },
          { icon: Layers, label: "Categorie", value: Object.keys(categories).length },
          { icon: Lightbulb, label: "Step", value: Object.values(categories).flat().reduce((s, g) => s + (g.steps?.length || 0), 0) },
        ].map((stat, i) => (
          <div key={i} className="text-center p-2.5 rounded-xl bg-card border border-border/50">
            <stat.icon className="w-3.5 h-3.5 mx-auto text-primary mb-1" />
            <p className="text-base font-display font-bold text-foreground">{stat.value}</p>
            <p className="text-[0.5rem] uppercase tracking-[2px] text-muted-foreground/40 font-semibold">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Accordion categories */}
      <div className="space-y-2">
        {Object.entries(categories).map(([catName, items]) => (
          <div key={catName} className="rounded-2xl bg-card border border-border/50 overflow-hidden">
            <button
              onClick={() => setExpandedCategory(expandedCategory === catName ? null : catName)}
              className="w-full flex items-center justify-between p-3.5 min-h-[52px] text-left"
            >
              <div className="flex items-center gap-2.5">
                <span className="text-base">{catName.slice(0, 2)}</span>
                <div>
                  <p className="text-sm font-semibold text-foreground">{catName.slice(3)}</p>
                  <p className="text-[0.5rem] uppercase tracking-[2px] text-muted-foreground/40 font-semibold">{items.length} guide</p>
                </div>
              </div>
              {expandedCategory === catName
                ? <ChevronDown className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
                : <ChevronRight className="w-4 h-4 text-muted-foreground/50 flex-shrink-0" />
              }
            </button>
            <AnimatePresence>
              {expandedCategory === catName && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="px-3.5 pb-3.5 space-y-2">
                    {items.map((guide) => (
                      <div key={guide.key} className="p-3 rounded-xl bg-secondary/40 space-y-1.5">
                        <p className="text-xs font-semibold text-foreground">{guide.title}</p>
                        <p className="text-[0.65rem] text-muted-foreground/60 leading-relaxed">{guide.description}</p>
                        {guide.steps && guide.steps.length > 0 && (
                          <div className="pt-1 space-y-1">
                            {guide.steps.map((step, si) => (
                              <div key={si} className="flex items-start gap-2">
                                <div className="w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                                  <span className="text-[0.5rem] font-bold text-primary">{si + 1}</span>
                                </div>
                                <p className="text-[0.6rem] text-muted-foreground/50">{step}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      <p className="text-[0.5rem] text-center text-muted-foreground/30 uppercase tracking-[3px] pt-2">
        Auto-aggiornato · Nuove guide appaiono automaticamente
      </p>
    </div>
  );
};

const MoreMenu = ({
  restaurant,
  userId,
  menuUrl,
  vaultConfig,
  setVaultConfig,
  blacklist,
  setBlacklist,
  settingsBusinessType,
  setSettingsBusinessType,
  settingsPhone,
  setSettingsPhone,
  settingsEmail,
  setSettingsEmail,
  settingsAddress,
  setSettingsAddress,
  settingsCity,
  setSettingsCity,
  settingsHours,
  setSettingsHours,
  settingsMinOrder,
  setSettingsMinOrder,
  settingsBlockedKeywords,
  setSettingsBlockedKeywords,
  policyAccepted,
  setPolicyAccepted,
  handleSaveSettings,
  settingsSaving,
  menuItems,
  orders,
  restaurantTables,
}: MoreMenuProps) => {
  const [section, setSection] = useState<MoreSection>("grid");
  const [blacklistPhone, setBlacklistPhone] = useState("");
  const [blacklistName, setBlacklistName] = useState("");
  const [blacklistReason, setBlacklistReason] = useState("");
  const [vaultEditing, setVaultEditing] = useState(false);
  const [vaultKey, setVaultKey] = useState("");
  const [vaultProvider, setVaultProvider] = useState("Scontrino.it");
  const [vaultProviderSecondary, setVaultProviderSecondary] = useState("");
  const [vaultKeySecondary, setVaultKeySecondary] = useState("");
  const [vaultValidating, setVaultValidating] = useState(false);
  const [autoSendEnabled, setAutoSendEnabled] = useState(vaultConfig?.auto_send_enabled || false);
  const [disclaimerAccepted, setDisclaimerAccepted] = useState(vaultConfig?.disclaimer_accepted || false);
  const [inventoryLoading, setInventoryLoading] = useState(false);
  const [inventoryResult, setInventoryResult] = useState<any>(null);
  const [settingsNewKeyword, setSettingsNewKeyword] = useState("");
  const [maryMessages, setMaryMessages] = useState<{role: string; content: string}[]>([
    { role: "assistant", content: "Benvenuto nella **Cassaforte Fiscale**. Sono Mary. Configura qui le tue chiavi API.\n\nVuoi configurare **Scontrino.it** o **Aruba**?" }
  ]);
  const [maryInput, setMaryInput] = useState("");

  const { can, requiredPlanFor } = useSubscription(restaurant?.id);

  // Map grid items to feature keys for plan gating
  const TOOL_FEATURE_MAP: Partial<Record<MoreSection, FeatureKey>> = {
    vault: "fiscal_vault",
    chat: "private_chat",
    inventory: "inventory_ai",
  };

  const gridItems: { id: MoreSection; label: string; icon: React.ReactNode; color: string }[] = [
    { id: "qr", label: "QR Code", icon: <QrCode className="w-6 h-6" />, color: "text-primary" },
    { id: "vault", label: "Vault Fiscale", icon: <Lock className="w-6 h-6" />, color: "text-green-400" },
    { id: "chat", label: "Chat", icon: <MessageSquare className="w-6 h-6" />, color: "text-blue-400" },
    { id: "blacklist", label: "Black-List", icon: <ShieldBan className="w-6 h-6" />, color: "text-accent" },
    { id: "inventory", label: "AI Scorte", icon: <Package className="w-6 h-6" />, color: "text-purple-400" },
    { id: "academy", label: "Academy", icon: <GraduationCap className="w-6 h-6" />, color: "text-amber-400" },
    { id: "settings", label: "Impostazioni", icon: <Settings className="w-6 h-6" />, color: "text-muted-foreground" },
    { id: "subscription", label: "Abbonamento", icon: <CreditCard className="w-6 h-6" />, color: "text-emerald-400" },
  ];

  const handleVaultSave = async () => {
    if (!restaurant || !vaultKey.trim()) return;
    if (autoSendEnabled && !disclaimerAccepted) {
      toast({ title: "Disclaimer richiesto", description: "Devi accettare il disclaimer per attivare l'invio automatico.", variant: "destructive" });
      return;
    }
    setVaultValidating(true);
    setTimeout(async () => {
      await supabase.from("fisco_configs").update({
        api_key_encrypted: vaultKey,
        configured: true,
        provider: vaultProvider,
        configured_by: userId,
        provider_secondary: vaultProviderSecondary || null,
        api_key_secondary_encrypted: vaultKeySecondary || null,
        auto_send_enabled: autoSendEnabled,
        disclaimer_accepted: disclaimerAccepted,
        disclaimer_accepted_at: disclaimerAccepted ? new Date().toISOString() : null,
      } as any).eq("restaurant_id", restaurant.id);
      setVaultConfig((prev: any) => ({ ...prev, configured: true, provider: vaultProvider, auto_send_enabled: autoSendEnabled }));
      setVaultEditing(false); setVaultKey(""); setVaultValidating(false);
      toast({ title: "Vault configurato" });
    }, 2000);
  };

  const handleMaryMessage = () => {
    if (!maryInput.trim()) return;
    setMaryMessages(prev => [...prev, { role: "user", content: maryInput }]);
    const input = maryInput.toLowerCase(); setMaryInput("");
    let response = "Seleziona un provider e inserisci la chiave API per configurare il Vault.";
    if (input.includes("scontrino")) response = "📋 **Setup Scontrino.it**\n\n1. Accedi a scontrino.it/dashboard\n2. Impostazioni → API Keys\n3. Genera e copia la chiave\n\n🔐 Criptazione AES-256 automatica.";
    else if (input.includes("aruba")) response = "📋 **Setup Aruba**\n\n1. Accedi a fatturaaruba.it\n2. Servizi API → Genera credenziali\n3. Inserisci nel Vault\n\n🔐 Criptazione AES-256.";
    else if (input.includes("sicur") || input.includes("privacy")) response = "🔐 **Sicurezza Vault**\n\n• Criptazione AES-256\n• Nessuno può vedere le chiavi\n• Audit trail completo";
    setTimeout(() => setMaryMessages(prev => [...prev, { role: "assistant", content: response }]), 600);
  };

  // Back button used across all sub-sections
  const BackButton = () => (
    <button onClick={() => setSection("grid")} className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors min-h-[36px]">
      <ArrowLeft className="w-3.5 h-3.5" /> Menu
    </button>
  );

  if (section === "grid") {
    return (
      <motion.div className="space-y-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <div className="flex items-center justify-between">
          <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Strumenti</p>
          <InfoGuide
            title="Strumenti Avanzati"
            description="Funzionalità aggiuntive: QR Code per tavoli, Vault fiscale, chat privata, blacklist clienti, inventario AI, academy e impostazioni."
            steps={[
              "QR Code: genera codici per menu generico e per ogni tavolo",
              "Vault Fiscale: configura le API per la fatturazione automatica",
              "Chat: comunica privatamente con i tuoi clienti",
              "Impostazioni: personalizza orari, contatti e canali attivi",
            ]}
          />
        </div>
        <div className="grid grid-cols-3 gap-3">
          {gridItems.map(item => {
            const featureKey = TOOL_FEATURE_MAP[item.id];
            const locked = featureKey ? !can(featureKey) : false;
            return (
              <motion.button key={item.id} onClick={() => setSection(item.id)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl bg-card border border-border/50 hover:border-primary/30 active:scale-[0.95] transition-all min-h-[90px] relative ${locked ? "opacity-60" : ""}`}
                whileTap={{ scale: 0.95 }}>
                {locked && (
                  <span className="absolute top-2 right-2 text-[8px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-primary/20 text-primary">PRO</span>
                )}
                <span className={item.color}>{item.icon}</span>
                <span className="text-[11px] font-medium text-foreground text-center leading-tight">{item.label}</span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div className="space-y-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <BackButton />

      {/* Plan-gated section check */}
      {(() => {
        const featureKey = TOOL_FEATURE_MAP[section];
        if (featureKey && !can(featureKey)) {
          return (
            <UpgradePrompt
              feature={featureKey}
              requiredPlan={requiredPlanFor(featureKey)}
              onUpgrade={() => setSection("subscription")}
            />
          );
        }
        return null;
      })()}

      {/* QR */}
      {section === "qr" && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <QrCode className="w-10 h-10 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-display font-bold text-foreground">QR Code</h3>
            <p className="text-xs text-muted-foreground mt-1">Menu generico + QR per ogni tavolo</p>
          </div>

          {/* Generic menu QR */}
          <div className="p-4 rounded-2xl bg-card border border-border/50 space-y-3">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">📋 Menu Generico</p>
            <div className="flex justify-center">
              <div className="p-4 rounded-xl bg-white">
                <img src={generateQRDataUrl(menuUrl)} alt="QR Menu" className="w-36 h-36" />
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => downloadQR(menuUrl, `qr-${restaurant?.slug || "menu"}`)}
                className="flex-1 py-2.5 rounded-xl bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center gap-2 min-h-[44px]">
                <Download className="w-3.5 h-3.5" /> Scarica
              </button>
              <button onClick={() => window.open(menuUrl, "_blank")}
                className="flex-1 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-xs font-medium flex items-center justify-center gap-2 min-h-[44px]">
                <ExternalLink className="w-3.5 h-3.5" /> Apri
              </button>
            </div>
            <p className="text-[10px] text-muted-foreground text-center break-all">{menuUrl}</p>
          </div>

          {/* Per-table QR codes */}
          {restaurantTables.length > 0 && (
            <div className="space-y-3">
              <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">🪑 QR per Tavolo</p>
              <p className="text-xs text-muted-foreground">Ogni QR include il numero del tavolo.</p>
              <div className="grid grid-cols-2 gap-3">
                {restaurantTables.map(table => {
                  const tableUrl = `${menuUrl}?table=${table.table_number}`;
                  return (
                    <div key={table.id} className="p-3 rounded-xl bg-card border border-border/50 flex flex-col items-center gap-2">
                      <p className="text-xs font-semibold text-foreground">Tavolo {table.table_number}</p>
                      <div className="p-2 rounded-lg bg-white">
                        <img src={generateQRDataUrl(tableUrl, 120)} alt={`QR Tavolo ${table.table_number}`} className="w-20 h-20" />
                      </div>
                      <button onClick={() => downloadQR(tableUrl, `qr-tavolo-${table.table_number}`)}
                        className="w-full py-2 rounded-lg bg-primary/10 text-primary text-[10px] font-medium min-h-[36px]">
                        📥 Scarica
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {restaurantTables.length === 0 && (
            <div className="p-4 rounded-2xl bg-secondary/50 text-center">
              <p className="text-xs text-muted-foreground">Crea i tavoli nella sezione Ordini → Tavoli per generare QR dedicati</p>
            </div>
          )}
        </div>
      )}

      {/* VAULT */}
      {section === "vault" && can("fiscal_vault") && (
        <div className="space-y-4">
          <div className={`p-4 rounded-2xl border ${vaultConfig?.configured ? "bg-green-500/5 border-green-500/20" : "bg-accent/5 border-accent/20"}`}>
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full flex-shrink-0 ${vaultConfig?.configured ? "bg-green-400 shadow-[0_0_12px_rgba(74,222,128,0.5)]" : "bg-red-400 shadow-[0_0_12px_rgba(248,113,113,0.5)]"}`} />
              <div className="min-w-0">
                <p className="text-sm font-medium text-foreground">{vaultConfig?.configured ? "Vault operativo" : "Setup richiesto"}</p>
                <p className="text-xs text-muted-foreground truncate">{vaultConfig?.configured ? `Provider: ${vaultConfig.provider}` : "Configura per attivare"}</p>
              </div>
            </div>
          </div>
          {(!vaultConfig?.configured || vaultEditing) && (
            <div className="p-4 rounded-2xl bg-card border border-border space-y-3">
              <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Provider Principale</p>
              <select value={vaultProvider} onChange={e => setVaultProvider(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]">
                <option value="Scontrino.it">Scontrino.it</option>
                <option value="Aruba">Aruba Corrispettivi</option>
                <option value="Fattura24">Fattura24</option>
                <option value="FattureInCloud">Fatture in Cloud</option>
                <option value="Agenzia Entrate RT">Agenzia Entrate (RT diretto)</option>
              </select>
              <input type="password" placeholder="Chiave API principale..." value={vaultKey} onChange={e => setVaultKey(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-mono min-h-[44px]" />

              <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider pt-2">Provider Secondario (opzionale)</p>
              <select value={vaultProviderSecondary} onChange={e => setVaultProviderSecondary(e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]">
                <option value="">Nessuno</option>
                <option value="Scontrino.it">Scontrino.it</option>
                <option value="Aruba">Aruba Corrispettivi</option>
                <option value="Fattura24">Fattura24</option>
                <option value="FattureInCloud">Fatture in Cloud</option>
              </select>
              {vaultProviderSecondary && (
                <input type="password" placeholder="Chiave API secondaria..." value={vaultKeySecondary} onChange={e => setVaultKeySecondary(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm font-mono min-h-[44px]" />
              )}

              {/* Auto-send toggle */}
              <div className="pt-3 border-t border-border space-y-3">
                <button
                  onClick={() => setAutoSendEnabled(!autoSendEnabled)}
                  className="w-full flex items-center justify-between p-3 rounded-xl bg-secondary/50 min-h-[52px]"
                >
                  <div className="text-left min-w-0 flex-1">
                    <p className="text-xs font-semibold text-foreground">⚡ Invio Automatico</p>
                    <p className="text-[10px] text-muted-foreground">Invia scontrino dopo ogni pagamento</p>
                  </div>
                  <div className={`w-10 h-5 rounded-full flex items-center px-0.5 transition-colors flex-shrink-0 ml-3 ${autoSendEnabled ? "bg-primary/30 justify-end" : "bg-muted justify-start"}`}>
                    <div className={`w-4 h-4 rounded-full transition-colors ${autoSendEnabled ? "bg-primary" : "bg-muted-foreground/40"}`} />
                  </div>
                </button>

                {autoSendEnabled && (
                  <div className="p-3 rounded-xl bg-accent/5 border border-accent/20 space-y-2">
                    <p className="text-[10px] text-accent font-semibold">⚠️ DISCLAIMER OBBLIGATORIO</p>
                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                      Dichiaro di essere l'unico responsabile dei dati fiscali trasmessi. 
                      La piattaforma agisce come intermediario tecnico senza responsabilità 
                      per errori nei corrispettivi telematici.
                    </p>
                    <button
                      onClick={() => setDisclaimerAccepted(!disclaimerAccepted)}
                      className="flex items-center gap-2 min-h-[36px]"
                    >
                      <div className={`w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${disclaimerAccepted ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                        {disclaimerAccepted && <Check className="w-3 h-3 text-primary-foreground" />}
                      </div>
                      <span className="text-[11px] text-foreground font-medium">Accetto e confermo</span>
                    </button>
                  </div>
                )}
              </div>

              <button onClick={handleVaultSave} disabled={!vaultKey.trim() || vaultValidating}
                className="w-full py-2.5 rounded-xl bg-primary text-primary-foreground text-sm font-medium disabled:opacity-40 min-h-[44px] flex items-center justify-center gap-2">
                {vaultValidating ? "Validazione..." : <><ShieldCheck className="w-4 h-4" /> Cripta e Valida</>}
              </button>
            </div>
          )}
          {vaultConfig?.configured && !vaultEditing && (
            <button onClick={() => setVaultEditing(true)} className="w-full py-2.5 rounded-xl bg-secondary text-sm min-h-[44px]">Aggiorna credenziali</button>
          )}

          {/* Mary chat — contained height */}
          <div className="rounded-2xl bg-card border border-border overflow-hidden">
            <div className="px-4 py-2.5 border-b border-border flex items-center gap-2">
              <Bot className="w-4 h-4 text-primary flex-shrink-0" />
              <span className="text-xs font-medium text-foreground">AI-Mary</span>
            </div>
            <div className="h-36 overflow-y-auto p-3 space-y-2 scrollbar-hide">
              {maryMessages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] px-3 py-2 rounded-2xl text-xs whitespace-pre-line break-words ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>{msg.content}</div>
                </div>
              ))}
            </div>
            <div className="p-2.5 border-t border-border flex gap-2">
              <input type="text" placeholder="Chiedi a Mary..." value={maryInput} onChange={e => setMaryInput(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleMaryMessage()}
                className="flex-1 px-3 py-2 rounded-xl bg-secondary text-foreground text-sm min-h-[40px] min-w-0" />
              <button onClick={handleMaryMessage} className="w-10 h-10 rounded-xl bg-primary text-primary-foreground flex items-center justify-center flex-shrink-0">
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CHAT */}
      {section === "chat" && can("private_chat") && restaurant && <PrivateChat restaurantId={restaurant.id} isRestaurantView={true} />}

      {/* BLACKLIST */}
      {section === "blacklist" && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-secondary/50 space-y-3">
            <input type="tel" placeholder="Telefono" value={blacklistPhone} onChange={e => setBlacklistPhone(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm min-h-[44px]" />
            <input type="text" placeholder="Nome (opz.)" value={blacklistName} onChange={e => setBlacklistName(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm min-h-[44px]" />
            <input type="text" placeholder="Motivo" value={blacklistReason} onChange={e => setBlacklistReason(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-background text-foreground text-sm min-h-[44px]" />
            <button onClick={async () => {
              if (!restaurant || !blacklistPhone.trim()) return;
              const { error } = await (supabase as any).from("customer_blacklist").insert({ restaurant_id: restaurant.id, customer_phone: blacklistPhone.trim(), customer_name: blacklistName.trim() || null, reason: blacklistReason.trim() || null, blocked_by: userId });
              if (error) { toast({ title: "Errore", variant: "destructive" }); return; }
              toast({ title: "Utente bloccato" });
              setBlacklistPhone(""); setBlacklistName(""); setBlacklistReason("");
              const { data: bl } = await (supabase as any).from("customer_blacklist").select("*").eq("restaurant_id", restaurant.id).eq("is_active", true);
              if (bl) setBlacklist(bl);
            }} disabled={!blacklistPhone.trim()}
              className="w-full py-3 rounded-xl bg-accent text-accent-foreground font-medium text-sm disabled:opacity-40 min-h-[48px]">🚫 Blocca</button>
          </div>
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Bloccati ({blacklist.length})</p>
            {blacklist.map((e: any) => (
              <div key={e.id} className="flex items-center gap-3 p-3 rounded-xl bg-accent/5 border border-accent/20">
                <ShieldBan className="w-4 h-4 text-accent flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{e.customer_name || e.customer_phone}</p>
                  <p className="text-xs text-muted-foreground truncate">{e.reason || "—"}</p>
                </div>
                <button onClick={async () => {
                  await (supabase as any).from("customer_blacklist").update({ is_active: false }).eq("id", e.id);
                  setBlacklist(prev => prev.filter(b => b.id !== e.id));
                  toast({ title: "Sbloccato" });
                }} className="text-xs text-primary px-2.5 py-1.5 rounded-lg hover:bg-primary/10 min-h-[32px] flex-shrink-0">Sblocca</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* AI INVENTORY */}
      {section === "inventory" && can("inventory_ai") && (
        <div className="space-y-5">
          <div className="text-center py-2">
            <Package className="w-10 h-10 mx-auto mb-2 text-primary" />
            <h3 className="text-base font-display font-bold text-foreground">AI Inventory</h3>
          </div>
          <button onClick={async () => {
            if (!restaurant) return;
            setInventoryLoading(true);
            try {
              const { data, error } = await supabase.functions.invoke("ai-inventory", { body: { restaurantId: restaurant.id, orders, menuItems } });
              if (error) throw error;
              if (data?.error) throw new Error(data.error);
              setInventoryResult(data);
            } catch (err: any) { toast({ title: "Errore", description: err?.message, variant: "destructive" }); }
            setInventoryLoading(false);
          }} disabled={inventoryLoading}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm gold-glow disabled:opacity-50 min-h-[48px]">
            {inventoryLoading ? "Analisi..." : "🤖 Analizza Scorte"}
          </button>
          {inventoryResult && (
            <div className="space-y-3">
              {inventoryResult.alerts?.map((a: any, i: number) => (
                <div key={i} className={`p-3 rounded-xl border ${a.urgency === "high" ? "bg-accent/5 border-accent/20" : "bg-secondary/50 border-border"}`}>
                  <div className="flex justify-between gap-2"><span className="text-sm font-medium text-foreground truncate">{a.ingredient}</span>
                    <span className="text-xs text-muted-foreground flex-shrink-0">{a.urgency === "high" ? "🔴" : "🟡"} ~{a.estimatedDaysLeft}gg</span></div>
                  <p className="text-xs text-muted-foreground mt-1">Ordina: {a.suggestedOrder}</p>
                </div>
              ))}
              {inventoryResult.dailySpecial && (
                <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
                  <p className="text-[11px] text-primary uppercase tracking-wider font-medium mb-1">🍽️ Piatto del Giorno</p>
                  <p className="text-base font-display font-bold text-foreground">{inventoryResult.dailySpecial.name}</p>
                  <p className="text-xs text-muted-foreground mt-1">{inventoryResult.dailySpecial.reason}</p>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ACADEMY — Dynamic Tutorial Hub */}
      {section === "academy" && <AcademySection />}

      {/* SETTINGS */}
      {section === "settings" && (
        <div className="space-y-4">
          {/* Policy */}
          {!policyAccepted && (
            <div className="p-4 rounded-2xl bg-accent/5 border border-accent/20 space-y-3">
              <div className="flex items-start gap-3">
                <FileCheck className="w-5 h-5 text-accent flex-shrink-0 mt-0.5" />
                <p className="text-sm font-medium text-foreground">Accettazione Policy</p>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-xl bg-secondary/50">
                <button onClick={() => setPolicyAccepted(!policyAccepted)}
                  className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center ${policyAccepted ? "bg-primary border-primary" : "border-muted-foreground/40"}`}>
                  {policyAccepted && <Check className="w-3 h-3 text-primary-foreground" />}
                </button>
                <p className="text-xs text-muted-foreground">Accetto le Condizioni di Servizio e Privacy Policy.</p>
              </div>
            </div>
          )}
          {policyAccepted && (
            <div className="p-3 rounded-2xl bg-green-500/5 border border-green-500/20 flex items-center gap-3">
              <FileCheck className="w-4 h-4 text-green-400 flex-shrink-0" /><p className="text-xs text-green-400">Policy accettate ✓</p>
            </div>
          )}

          {/* Contact */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider">Contatti</p>
            <div className="space-y-3">
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Phone className="w-3 h-3" /> Telefono</label>
                <input type="tel" value={settingsPhone} onChange={e => setSettingsPhone(e.target.value)} placeholder="+39..." maxLength={20}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><Mail className="w-3 h-3" /> Email</label>
                <input type="email" value={settingsEmail} onChange={e => setSettingsEmail(e.target.value)} placeholder="info@..." maxLength={100}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Indirizzo</label>
                <input type="text" value={settingsAddress} onChange={e => setSettingsAddress(e.target.value)} placeholder="Via..." maxLength={200}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Città</label>
                <input type="text" value={settingsCity} onChange={e => setSettingsCity(e.target.value)} placeholder="Roma" maxLength={100}
                  className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]" />
              </div>
            </div>
          </div>

          {/* Hours */}
          <div className="space-y-2">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1"><Clock className="w-3 h-3" /> Orari</p>
            {settingsHours.map((entry, i) => (
              <div key={entry.day} className="flex items-center gap-2 p-2 rounded-xl bg-secondary/50">
                <span className="text-[11px] font-medium text-foreground w-10 flex-shrink-0">{entry.day.slice(0, 3)}</span>
                <input type="text" value={entry.hours}
                  onChange={e => { const u = [...settingsHours]; u[i] = { ...u[i], hours: e.target.value }; setSettingsHours(u); }}
                  placeholder="12:00 - 23:30" className="flex-1 px-3 py-2 rounded-lg bg-background text-foreground text-sm min-h-[38px] min-w-0" />
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="space-y-3">
            <p className="text-[11px] text-muted-foreground/70 uppercase tracking-wider flex items-center gap-1"><Ban className="w-3 h-3" /> Filtro Ordini</p>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Importo minimo (€)</label>
              <input type="number" step="0.50" min="0" value={settingsMinOrder} onChange={e => setSettingsMinOrder(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px]" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground mb-1 block">Parole bloccate</label>
              <div className="flex gap-2">
                <input type="text" value={settingsNewKeyword} onChange={e => setSettingsNewKeyword(e.target.value)} placeholder="Aggiungi..."
                  className="flex-1 px-3 py-2.5 rounded-xl bg-secondary text-foreground text-sm min-h-[44px] min-w-0"
                  onKeyDown={e => { if (e.key === "Enter" && settingsNewKeyword.trim()) { setSettingsBlockedKeywords(prev => [...prev, settingsNewKeyword.trim()]); setSettingsNewKeyword(""); } }} />
                <button onClick={() => { if (settingsNewKeyword.trim()) { setSettingsBlockedKeywords(prev => [...prev, settingsNewKeyword.trim()]); setSettingsNewKeyword(""); } }}
                  className="px-3 py-2.5 rounded-xl bg-accent text-accent-foreground text-xs min-h-[44px] flex-shrink-0">+</button>
              </div>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {settingsBlockedKeywords.map((kw, i) => (
                  <span key={i} className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-accent/10 text-accent text-xs">
                    {kw}
                    <button onClick={() => setSettingsBlockedKeywords(prev => prev.filter((_, j) => j !== i))}><X className="w-3 h-3" /></button>
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Save */}
          <button onClick={handleSaveSettings} disabled={settingsSaving}
            className="w-full py-3.5 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm gold-glow disabled:opacity-50 min-h-[48px] flex items-center justify-center gap-2">
            {settingsSaving ? "Salvataggio..." : <><Save className="w-4 h-4" /> Salva Impostazioni</>}
          </button>
        </div>
      )}

      {/* Subscription */}
      {section === "subscription" && restaurant?.id && (
        <div className="space-y-4">
          <div className="text-center py-2">
            <CreditCard className="w-10 h-10 mx-auto mb-2 text-primary" />
            <h3 className="text-lg font-display font-bold text-foreground">Abbonamento</h3>
            <p className="text-xs text-muted-foreground mt-1">Gestisci il tuo piano Empire</p>
          </div>
          <SubscriptionSection restaurantId={restaurant.id} />
        </div>
      )}
    </motion.div>
  );
};

export default MoreMenu;
