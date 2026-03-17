import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Search, Zap, CheckCircle2, ArrowRight, Crown, Users, Send, Bell, Loader2, Star, X, Wine, ChefHat, BarChart3, Shield, Megaphone, Settings2, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useAgents } from "@/hooks/useAgents";
import { useAgentInstallation } from "@/hooks/useAgentInstallation";
import { useIndustry } from "@/hooks/useIndustry";
import { CATEGORY_LABELS, type Agent } from "@/types/agent";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Professional persona images
import personaSommelier from "@/assets/agent-persona-sommelier.jpg";
import personaMaitre from "@/assets/agent-persona-maitre.jpg";
import personaAnalytics from "@/assets/agent-persona-analytics.jpg";
import personaSocial from "@/assets/agent-persona-social.jpg";
import personaChef from "@/assets/agent-persona-chef.jpg";
import personaConcierge from "@/assets/agent-persona-concierge.jpg";
import personaSales from "@/assets/agent-persona-sales.jpg";
import personaCompliance from "@/assets/agent-persona-compliance.jpg";
import personaContent from "@/assets/agent-persona-content.jpg";
import personaOperations from "@/assets/agent-persona-operations.jpg";

// Map agent names/categories to human personas
const AGENT_PERSONAS: Record<string, { humanName: string; role: string; image: string }> = {
  "Sommelier AI": { humanName: "Valentina Ferretti", role: "Sommelier Professionista", image: personaSommelier },
  "Maître AI": { humanName: "Roberto Marchetti", role: "Maître di Sala", image: personaMaitre },
  "Analytics Brain": { humanName: "Marco De Angelis", role: "Data Analyst", image: personaAnalytics },
  "Social Manager AI": { humanName: "Giulia Romano", role: "Social Media Manager", image: personaSocial },
  "Concierge AI": { humanName: "Sofia Benedetti", role: "Receptionist & Concierge", image: personaConcierge },
  "Sales Closer AI": { humanName: "Andrea Colombo", role: "Direttore Vendite", image: personaSales },
  "Food Safety AI": { humanName: "Laura Martinelli", role: "Responsabile HACCP", image: personaCompliance },
  "GDPR Guardian": { humanName: "Laura Martinelli", role: "Compliance Officer", image: personaCompliance },
  "Tax Compliance AI": { humanName: "Laura Martinelli", role: "Consulente Fiscale", image: personaCompliance },
  "License Tracker": { humanName: "Laura Martinelli", role: "Compliance Specialist", image: personaCompliance },
  "Kitchen Display AI": { humanName: "Alessandro Ricci", role: "Chef de Cuisine", image: personaChef },
  "Menu Designer AI": { humanName: "Alessandro Ricci", role: "Food Designer", image: personaChef },
  "Photo Generator AI": { humanName: "Chiara Bianchi", role: "Food Photographer", image: personaContent },
  "Blog Writer AI": { humanName: "Chiara Bianchi", role: "Content Creator", image: personaContent },
  "Email Campaign AI": { humanName: "Giulia Romano", role: "Email Marketing Specialist", image: personaSocial },
  "Translator AI": { humanName: "Chiara Bianchi", role: "Traduttrice Multilingue", image: personaContent },
  "Inventory Manager": { humanName: "Tommaso Galli", role: "Responsabile Magazzino", image: personaOperations },
  "Smart Notifier": { humanName: "Tommaso Galli", role: "Operations Coordinator", image: personaOperations },
  "Staff Scheduler": { humanName: "Tommaso Galli", role: "HR & Planning", image: personaOperations },
  "Table Manager AI": { humanName: "Tommaso Galli", role: "Floor Manager", image: personaOperations },
  "Delivery Tracker": { humanName: "Tommaso Galli", role: "Logistics Manager", image: personaOperations },
  "Cross-Sell Genius": { humanName: "Andrea Colombo", role: "Revenue Specialist", image: personaSales },
  "Upselling Engine": { humanName: "Andrea Colombo", role: "Growth Hacker", image: personaSales },
  "Cart Recovery AI": { humanName: "Andrea Colombo", role: "Recovery Specialist", image: personaSales },
  "Loyalty Program AI": { humanName: "Andrea Colombo", role: "Retention Expert", image: personaSales },
  "Revenue Optimizer": { humanName: "Marco De Angelis", role: "Revenue Manager", image: personaAnalytics },
  "Customer Insights": { humanName: "Marco De Angelis", role: "Customer Intelligence", image: personaAnalytics },
  "Review Responder": { humanName: "Sofia Benedetti", role: "Reputation Manager", image: personaConcierge },
  "Listing Optimizer": { humanName: "Giulia Romano", role: "SEO & Listing Expert", image: personaSocial },
  "HACCP Monitor": { humanName: "Laura Martinelli", role: "Quality Assurance", image: personaCompliance },
  "Waste Reducer AI": { humanName: "Alessandro Ricci", role: "Sustainability Chef", image: personaChef },
  "Voice Receptionist": { humanName: "Sofia Benedetti", role: "Assistente Vocale", image: personaConcierge },
  "WhatsApp AI Orchestrator": { humanName: "Sofia Benedetti", role: "WhatsApp Manager", image: personaConcierge },
  "WhatsApp Bot": { humanName: "Sofia Benedetti", role: "Chat Assistant", image: personaConcierge },
};

const DEFAULT_PERSONA = { humanName: "Empire AI", role: "Specialista", image: personaOperations };

function getPersona(agentName: string) {
  return AGENT_PERSONAS[agentName] || DEFAULT_PERSONA;
}

// Pricing tiers per agent category
const CATEGORY_PRICING: Record<string, { monthly: number; label: string }> = {
  concierge: { monthly: 49, label: "€49/mese" },
  analytics: { monthly: 79, label: "€79/mese" },
  content: { monthly: 39, label: "€39/mese" },
  sales: { monthly: 59, label: "€59/mese" },
  operations: { monthly: 29, label: "€29/mese" },
  compliance: { monthly: 49, label: "€49/mese" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  concierge: <Users className="w-4 h-4" />,
  analytics: <BarChart3 className="w-4 h-4" />,
  content: <Megaphone className="w-4 h-4" />,
  sales: <Sparkles className="w-4 h-4" />,
  operations: <Settings2 className="w-4 h-4" />,
  compliance: <Shield className="w-4 h-4" />,
};

const TABS = [
  { key: "team", label: "Il Mio Team" },
  { key: "marketplace", label: "Aggiungi Agenti" },
];

// ─── Installed Agent Card (persona style) ───
function InstalledAgentCard({ agent }: { agent: Agent }) {
  const persona = getPersona(agent.name);
  const cat = CATEGORY_LABELS[agent.category];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="group"
    >
      <Card className="overflow-hidden border border-border/50 bg-card hover:shadow-lg hover:shadow-primary/5 transition-all duration-300">
        {/* Top accent */}
        <div className="h-1 w-full" style={{ background: `linear-gradient(90deg, ${agent.color_hex || 'hsl(var(--primary))'}, transparent)` }} />

        <div className="p-4 space-y-3">
          {/* Avatar + Info */}
          <div className="flex items-center gap-3">
            <div className="relative">
              <img
                src={persona.image}
                alt={persona.humanName}
                className="w-14 h-14 rounded-full object-cover border-2 border-primary/20"
              />
              <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card flex items-center justify-center">
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-foreground truncate">{persona.humanName}</h3>
              <p className="text-[11px] text-primary font-medium">{persona.role}</p>
              <p className="text-[10px] text-muted-foreground truncate">{agent.name}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {agent.description_it}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-1 border-t border-border/30">
            <Badge variant="outline" className="text-[9px] h-5" style={{ borderColor: cat?.color, color: cat?.color }}>
              {CATEGORY_ICONS[agent.category]} <span className="ml-1">{cat?.label}</span>
            </Badge>
            <Badge className="bg-emerald-500/15 text-emerald-500 border-0 text-[9px] h-5">
              <CheckCircle2 className="w-2.5 h-2.5 mr-0.5" /> Attivo
            </Badge>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Available Agent Card (marketplace style) ───
function AvailableAgentCard({ agent, onRequest, requesting }: { agent: Agent; onRequest: () => void; requesting: boolean }) {
  const persona = getPersona(agent.name);
  const cat = CATEGORY_LABELS[agent.category];
  const pricing = CATEGORY_PRICING[agent.category] || { monthly: 39, label: "€39/mese" };

  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}>
      <Card className="overflow-hidden border border-border/30 bg-card/50 hover:bg-card hover:shadow-md transition-all duration-300">
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={persona.image}
              alt={persona.humanName}
              className="w-12 h-12 rounded-full object-cover border border-border/50 opacity-80 grayscale-[30%]"
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-foreground truncate">{persona.humanName}</h3>
              <p className="text-[11px] text-muted-foreground">{persona.role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-primary">{pricing.label}</p>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground leading-relaxed line-clamp-2">
            {agent.description_it}
          </p>

          <div className="flex items-center justify-between pt-1">
            <Badge variant="outline" className="text-[9px] h-5" style={{ borderColor: cat?.color, color: cat?.color }}>
              {cat?.label}
            </Badge>
            <Button
              size="sm"
              className="h-7 text-[11px] gap-1 bg-primary hover:bg-primary/90 text-primary-foreground"
              onClick={onRequest}
              disabled={requesting}
            >
              {requesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Richiedi Attivazione
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Subscription Impact Preview ───
function SubscriptionImpact({ installedCount, pendingAdd }: { installedCount: number; pendingAdd: number }) {
  const currentBase = 49;
  const perAgent = 29;
  const currentTotal = currentBase + installedCount * perAgent;
  const newTotal = currentBase + (installedCount + pendingAdd) * perAgent;

  return (
    <Card className="border border-primary/20 bg-primary/5 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Crown className="w-4 h-4 text-primary" />
        <h3 className="text-sm font-bold text-foreground">Impatto Abbonamento</h3>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Attuale</p>
          <p className="text-lg font-bold text-foreground">{installedCount} <span className="text-xs font-normal text-muted-foreground">agenti</span></p>
        </div>
        <div>
          <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Con nuovi agenti</p>
          <p className="text-lg font-bold text-primary">{installedCount + pendingAdd} <span className="text-xs font-normal text-muted-foreground">agenti</span></p>
        </div>
      </div>
      {pendingAdd > 0 && (
        <div className="mt-3 pt-3 border-t border-primary/10">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Costo aggiuntivo stimato</span>
            <span className="font-bold text-primary">+€{pendingAdd * perAgent}/mese</span>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1">
            Il team Empire ti contatterà per confermare l'attivazione e il piano tariffario personalizzato.
          </p>
        </div>
      )}
    </Card>
  );
}

export default function AgentMarketplace() {
  const navigate = useNavigate();
  const { industry } = useIndustry();
  const { universalAgents, sectorAgents, loading } = useAgents();
  const { installations, install } = useAgentInstallation();
  const [activeTab, setActiveTab] = useState("team");
  const [search, setSearch] = useState("");
  const [requesting, setRequesting] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);

  const installedIds = useMemo(() => new Set(installations.map((i: any) => i.agent_id)), [installations]);

  const allAgents = useMemo(() => [...universalAgents, ...sectorAgents], [universalAgents, sectorAgents]);

  const installedAgents = useMemo(() => {
    return allAgents.filter(a => installedIds.has(a.id));
  }, [allAgents, installedIds]);

  const availableAgents = useMemo(() => {
    let agents = allAgents
      .filter(a => !installedIds.has(a.id))
      .filter(a => a.type === "universal" || a.sectors.includes(industry));
    if (search) {
      const q = search.toLowerCase();
      agents = agents.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.description_it.toLowerCase().includes(q) ||
        getPersona(a.name).humanName.toLowerCase().includes(q)
      );
    }
    return agents;
  }, [allAgents, installedIds, industry, search]);

  const handleRequestActivation = async (agent: Agent) => {
    setRequesting(agent.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non autenticato");

      await supabase.from("agent_requests").insert({
        tenant_id: industry === "food" ? "restaurant" : "company",
        tenant_name: industry,
        agent_id: agent.id,
        requested_by: user.id,
        status: "pending",
      });

      // Also create an alert for super admin
      await supabase.from("ai_alerts").insert({
        alert_type: "agent_request",
        message: `Richiesta attivazione agente "${agent.name}" (${getPersona(agent.name).humanName}) da un account ${industry}`,
        agent_name: agent.name,
      });

      setPendingRequests(prev => [...prev, agent.id]);
      toast.success("Richiesta inviata!", {
        description: `Il team Empire attiverà "${getPersona(agent.name).humanName}" per il tuo account.`,
      });
    } catch (e) {
      console.error(e);
      toast.error("Errore nell'invio della richiesta");
    }
    setRequesting(null);
  };

  // Group installed by category
  const groupedInstalled = useMemo(() => {
    const groups: Record<string, Agent[]> = {};
    installedAgents.forEach(a => {
      const cat = a.category || "other";
      if (!groups[cat]) groups[cat] = [];
      groups[cat].push(a);
    });
    return groups;
  }, [installedAgents]);

  return (
    <div className="space-y-6 pb-24">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl border border-border/50 bg-gradient-to-br from-primary/10 via-background to-background p-6 sm:p-8"
      >
        <div className="absolute top-4 right-4 opacity-10">
          <Users className="w-28 h-28 text-primary" />
        </div>
        <div className="relative z-10 max-w-xl">
          <h1 className="text-2xl sm:text-3xl font-heading font-bold text-foreground flex items-center gap-3">
            <Bot className="w-7 h-7 text-primary" />
            Il Tuo Team AI
          </h1>
          <p className="text-muted-foreground mt-2 text-sm">
            I professionisti AI che lavorano per la tua attività, 24/7. Ogni agente è un esperto dedicato al tuo successo.
          </p>
          <div className="flex flex-wrap items-center gap-3 mt-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> {installedAgents.length} attivi</span>
            <span>•</span>
            <span>{availableAgents.length} disponibili</span>
            {pendingRequests.length > 0 && (
              <>
                <span>•</span>
                <span className="flex items-center gap-1 text-amber-400"><Bell className="w-3 h-3" /> {pendingRequests.length} in attesa</span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 h-10">
          <TabsTrigger value="team" className="text-xs sm:text-sm gap-1">
            <Users className="w-3.5 h-3.5" /> Il Mio Team ({installedAgents.length})
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-xs sm:text-sm gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Aggiungi ({availableAgents.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ═══ TAB: My Team ═══ */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="h-44 bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : installedAgents.length === 0 ? (
            <div className="text-center py-16 text-muted-foreground">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-20" />
              <p className="text-lg font-medium">Nessun agente attivo</p>
              <p className="text-sm mt-1">Esplora il marketplace per aggiungere il tuo primo agente AI.</p>
              <Button className="mt-4" onClick={() => setActiveTab("marketplace")}>
                <Sparkles className="w-4 h-4 mr-2" /> Esplora Agenti
              </Button>
            </div>
          ) : (
            Object.entries(groupedInstalled).map(([category, agents]) => {
              const catLabel = CATEGORY_LABELS[category];
              return (
                <section key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1 h-5 rounded-full" style={{ background: catLabel?.color || 'hsl(var(--primary))' }} />
                    <h2 className="text-sm font-heading font-bold text-foreground">{catLabel?.label || category}</h2>
                    <Badge variant="outline" className="text-[9px]">{agents.length}</Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agents.map((agent, i) => (
                      <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                        <InstalledAgentCard agent={agent} />
                      </motion.div>
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </div>
      )}

      {/* ═══ TAB: Marketplace ═══ */}
      {activeTab === "marketplace" && (
        <div className="space-y-6">
          {/* Search */}
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca agenti per nome, ruolo o funzione..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Subscription Impact */}
          {pendingRequests.length > 0 && (
            <SubscriptionImpact installedCount={installedAgents.length} pendingAdd={pendingRequests.length} />
          )}

          {/* Available agents */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Card key={i} className="h-36 bg-muted/30 animate-pulse" />
              ))}
            </div>
          ) : availableAgents.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 text-emerald-500 opacity-50" />
              <p className="font-medium">Hai già tutti gli agenti disponibili!</p>
              <p className="text-sm mt-1">Il tuo team AI è al completo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availableAgents.map((agent, i) => (
                <motion.div key={agent.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}>
                  <AvailableAgentCard
                    agent={agent}
                    onRequest={() => handleRequestActivation(agent)}
                    requesting={requesting === agent.id || pendingRequests.includes(agent.id)}
                  />
                </motion.div>
              ))}
            </div>
          )}

          {/* Pricing info */}
          <Card className="p-4 border-border/30 bg-muted/20">
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-foreground">Come funziona</h4>
                <ul className="text-[11px] text-muted-foreground space-y-1 mt-1.5">
                  <li>• <strong>Richiedi</strong> l'attivazione dell'agente che ti interessa</li>
                  <li>• Il team <strong>Empire</strong> riceverà una notifica immediata</li>
                  <li>• Ti contatteremo per <strong>confermare</strong> il piano e i costi</li>
                  <li>• L'agente verrà <strong>attivato</strong> nel tuo account entro 24h</li>
                  <li>• Puoi <strong>disattivare</strong> qualsiasi agente in qualsiasi momento</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
