import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot, Search, Zap, CheckCircle2, Crown, Users, Send, Bell, Loader2,
  Star, X, BarChart3, Shield, Megaphone, Settings2, Sparkles, Dna,
  ChevronDown, ChevronUp, Power, AlertTriangle, ArrowUpRight
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
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

// ── Persona Map ──
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
function getPersona(agentName: string) { return AGENT_PERSONAS[agentName] || DEFAULT_PERSONA; }

const CATEGORY_PRICING: Record<string, { monthly: number; label: string }> = {
  concierge: { monthly: 49, label: "€49/mese" },
  analytics: { monthly: 79, label: "€79/mese" },
  content: { monthly: 39, label: "€39/mese" },
  sales: { monthly: 59, label: "€59/mese" },
  operations: { monthly: 29, label: "€29/mese" },
  compliance: { monthly: 49, label: "€49/mese" },
};

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  concierge: <Users className="w-3.5 h-3.5" />,
  analytics: <BarChart3 className="w-3.5 h-3.5" />,
  content: <Megaphone className="w-3.5 h-3.5" />,
  sales: <Sparkles className="w-3.5 h-3.5" />,
  operations: <Settings2 className="w-3.5 h-3.5" />,
  compliance: <Shield className="w-3.5 h-3.5" />,
};

// ═══════════════════════════════════════════════════════════
// INSTALLED AGENT CARD — Premium DNA style
// ═══════════════════════════════════════════════════════════
function InstalledAgentCard({ agent, onDeactivate, deactivating }: { agent: Agent; onDeactivate: () => void; deactivating: boolean }) {
  const persona = getPersona(agent.name);
  const cat = CATEGORY_LABELS[agent.category];
  const pricing = CATEGORY_PRICING[agent.category] || { monthly: 29, label: "€29/mese" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="group">
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-lg"
        style={{
          background: "linear-gradient(165deg, hsla(265,20%,14%,0.8), hsla(230,15%,10%,0.95))",
          border: "1px solid hsla(265,50%,55%,0.1)",
        }}
      >
        {/* Top DNA accent */}
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${agent.color_hex || 'hsl(265,60%,55%)'}, transparent)` }} />

        <div className="p-4 space-y-3">
          {/* Avatar + Info */}
          <div className="flex items-start gap-3">
            <div className="relative flex-shrink-0">
              <img
                src={persona.image}
                alt={persona.humanName}
                className="w-14 h-14 rounded-xl object-cover"
                style={{ border: "2px solid hsla(265,60%,55%,0.25)" }}
              />
              {/* Active pulse */}
              <motion.div
                className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: "hsl(150,60%,45%)", border: "2px solid hsla(230,15%,10%,1)" }}
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <CheckCircle2 className="w-2.5 h-2.5 text-white" />
              </motion.div>
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-sm text-white truncate">{persona.humanName}</h3>
              <p className="text-[0.6rem] font-semibold tracking-[2px] uppercase mt-0.5" style={{ color: "hsl(265,60%,65%)" }}>{persona.role}</p>
              <p className="text-[0.55rem] mt-0.5 truncate" style={{ color: "hsla(230,20%,70%,0.4)" }}>{agent.name}</p>
            </div>
          </div>

          {/* Description */}
          <p className="text-[0.65rem] leading-relaxed line-clamp-2" style={{ color: "hsla(230,20%,75%,0.5)" }}>
            {agent.description_it}
          </p>

          {/* Capabilities */}
          {agent.capabilities && agent.capabilities.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {agent.capabilities.slice(0, 3).map((cap, i) => (
                <span key={i} className="text-[0.5rem] px-1.5 py-0.5 rounded-full" style={{ background: "hsla(265,50%,55%,0.1)", color: "hsla(265,60%,70%,0.7)" }}>
                  {cap}
                </span>
              ))}
              {agent.capabilities.length > 3 && (
                <span className="text-[0.5rem] px-1.5 py-0.5 rounded-full" style={{ background: "hsla(265,50%,55%,0.05)", color: "hsla(265,60%,70%,0.4)" }}>
                  +{agent.capabilities.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Footer */}
          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid hsla(265,50%,55%,0.08)" }}>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-[0.5rem] h-5 border-0 px-2" style={{ background: `${cat?.color}15`, color: cat?.color }}>
                {CATEGORY_ICONS[agent.category]} <span className="ml-1">{cat?.label}</span>
              </Badge>
              <span className="text-[0.55rem] font-bold" style={{ color: "hsl(38,50%,55%)" }}>{pricing.label}</span>
            </div>
            <Button
              size="sm"
              variant="ghost"
              className="h-6 px-2 text-[0.55rem] gap-1 hover:bg-destructive/10 hover:text-destructive"
              onClick={onDeactivate}
              disabled={deactivating}
            >
              {deactivating ? <Loader2 className="w-3 h-3 animate-spin" /> : <Power className="w-3 h-3" />}
              Disattiva
            </Button>
          </div>
        </div>

        {/* Bottom accent */}
        <div className="absolute bottom-0 inset-x-0 h-px" style={{ background: `linear-gradient(90deg, transparent, ${agent.color_hex || 'hsla(265,50%,55%,0.2)'}, transparent)` }} />
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// AVAILABLE AGENT CARD — Marketplace style
// ═══════════════════════════════════════════════════════════
function AvailableAgentCard({ agent, onRequest, requesting }: { agent: Agent; onRequest: () => void; requesting: boolean }) {
  const persona = getPersona(agent.name);
  const cat = CATEGORY_LABELS[agent.category];
  const pricing = CATEGORY_PRICING[agent.category] || { monthly: 39, label: "€39/mese" };

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
      <div
        className="relative overflow-hidden rounded-2xl transition-all duration-500 hover:shadow-md"
        style={{
          background: "linear-gradient(165deg, hsla(230,15%,13%,0.6), hsla(230,15%,9%,0.8))",
          border: "1px solid hsla(230,20%,30%,0.2)",
        }}
      >
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={persona.image}
              alt={persona.humanName}
              className="w-12 h-12 rounded-xl object-cover grayscale-[40%] opacity-75"
              style={{ border: "1px solid hsla(230,20%,30%,0.3)" }}
            />
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm text-white/80 truncate">{persona.humanName}</h3>
              <p className="text-[0.55rem] tracking-[1px] uppercase" style={{ color: "hsla(230,20%,70%,0.4)" }}>{persona.role}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold" style={{ color: "hsl(38,50%,55%)" }}>{pricing.label}</p>
              <p className="text-[0.5rem]" style={{ color: "hsla(230,20%,70%,0.3)" }}>per agente</p>
            </div>
          </div>

          <p className="text-[0.65rem] leading-relaxed line-clamp-2" style={{ color: "hsla(230,20%,75%,0.4)" }}>
            {agent.description_it}
          </p>

          <div className="flex items-center justify-between pt-2" style={{ borderTop: "1px solid hsla(230,20%,30%,0.15)" }}>
            <Badge variant="outline" className="text-[0.5rem] h-5 border-0 px-2" style={{ background: `${cat?.color}10`, color: `${cat?.color}99` }}>
              {cat?.label}
            </Badge>
            <Button
              size="sm"
              className="h-7 text-[0.6rem] gap-1 rounded-lg"
              style={{
                background: "linear-gradient(135deg, hsl(265,60%,55%), hsl(265,50%,45%))",
                color: "white",
              }}
              onClick={onRequest}
              disabled={requesting}
            >
              {requesting ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
              Richiedi Attivazione
            </Button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ═══════════════════════════════════════════════════════════
// SUBSCRIPTION IMPACT — Always visible
// ═══════════════════════════════════════════════════════════
function SubscriptionImpact({ installedCount, pendingAdd, pendingRemove }: { installedCount: number; pendingAdd: number; pendingRemove: number }) {
  const perAgent = 29;
  const currentCost = installedCount * perAgent;
  const newCount = installedCount + pendingAdd - pendingRemove;
  const newCost = Math.max(0, newCount) * perAgent;
  const diff = newCost - currentCost;

  return (
    <div
      className="relative overflow-hidden rounded-2xl p-5"
      style={{
        background: "linear-gradient(165deg, hsla(265,25%,15%,0.8), hsla(230,15%,10%,0.9))",
        border: "1px solid hsla(265,50%,55%,0.12)",
      }}
    >
      {/* Corner glow */}
      <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full opacity-20 pointer-events-none" style={{ background: "radial-gradient(circle, hsl(265,60%,55%), transparent 70%)" }} />

      <div className="flex items-center gap-2 mb-4">
        <Crown className="w-4 h-4" style={{ color: "hsl(38,50%,55%)" }} />
        <h3 className="text-[0.65rem] font-bold tracking-[2px] uppercase" style={{ color: "hsl(38,50%,60%)" }}>Riepilogo Abbonamento</h3>
      </div>

      <div className="grid grid-cols-3 gap-3 text-center">
        <div>
          <p className="text-[0.5rem] tracking-[1px] uppercase mb-1" style={{ color: "hsla(230,20%,70%,0.4)" }}>Agenti Attivi</p>
          <p className="text-2xl font-bold text-white">{installedCount}</p>
        </div>
        <div>
          <p className="text-[0.5rem] tracking-[1px] uppercase mb-1" style={{ color: "hsla(230,20%,70%,0.4)" }}>Costo Mensile</p>
          <p className="text-2xl font-bold" style={{ color: "hsl(38,50%,55%)" }}>€{currentCost}</p>
        </div>
        <div>
          <p className="text-[0.5rem] tracking-[1px] uppercase mb-1" style={{ color: "hsla(230,20%,70%,0.4)" }}>Base + Agenti</p>
          <p className="text-2xl font-bold text-white">€{currentCost + 49}</p>
        </div>
      </div>

      {(pendingAdd > 0 || pendingRemove > 0) && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="mt-4 pt-3"
          style={{ borderTop: "1px solid hsla(265,50%,55%,0.1)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-3.5 h-3.5" style={{ color: diff > 0 ? "hsl(38,50%,55%)" : "hsl(150,60%,45%)" }} />
              <span className="text-[0.6rem]" style={{ color: "hsla(230,20%,75%,0.6)" }}>
                {pendingAdd > 0 && `+${pendingAdd} in attesa`}
                {pendingAdd > 0 && pendingRemove > 0 && " · "}
                {pendingRemove > 0 && `-${pendingRemove} da rimuovere`}
              </span>
            </div>
            <span className="text-sm font-bold" style={{ color: diff > 0 ? "hsl(38,50%,55%)" : "hsl(150,60%,45%)" }}>
              {diff > 0 ? "+" : ""}€{diff}/mese
            </span>
          </div>
          <p className="text-[0.5rem] mt-2" style={{ color: "hsla(230,20%,70%,0.35)" }}>
            Il team Empire confermerà le modifiche e aggiornerà il tuo piano.
          </p>
        </motion.div>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════
// MAIN PAGE
// ═══════════════════════════════════════════════════════════
export default function AgentMarketplace() {
  const { industry } = useIndustry();
  const { universalAgents, sectorAgents, loading } = useAgents();
  const { installations, install, uninstall } = useAgentInstallation();
  const [activeTab, setActiveTab] = useState("team");
  const [search, setSearch] = useState("");
  const [requesting, setRequesting] = useState<string | null>(null);
  const [pendingRequests, setPendingRequests] = useState<string[]>([]);
  const [deactivating, setDeactivating] = useState<string | null>(null);

  const installedIds = useMemo(() => new Set(installations.map((i: any) => i.agent_id)), [installations]);
  const allAgents = useMemo(() => [...universalAgents, ...sectorAgents], [universalAgents, sectorAgents]);
  const installedAgents = useMemo(() => allAgents.filter(a => installedIds.has(a.id)), [allAgents, installedIds]);

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

  const handleDeactivation = async (agent: Agent) => {
    setDeactivating(agent.id);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("Non autenticato");

      // Send deactivation request to super admin
      await supabase.from("agent_requests").insert({
        tenant_id: industry === "food" ? "restaurant" : "company",
        tenant_name: industry,
        agent_id: agent.id,
        requested_by: user.id,
        status: "pending",
        admin_note: "Richiesta disattivazione",
      });

      await supabase.from("ai_alerts").insert({
        alert_type: "agent_deactivation",
        message: `Richiesta DISATTIVAZIONE agente "${agent.name}" (${getPersona(agent.name).humanName}) da un account ${industry}`,
        agent_name: agent.name,
      });

      toast.success("Richiesta di disattivazione inviata", {
        description: "Il team Empire processerà la richiesta e aggiornerà il tuo abbonamento.",
      });
    } catch (e) {
      console.error(e);
      toast.error("Errore nell'invio della richiesta");
    }
    setDeactivating(null);
  };

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
      {/* ── Hero ── */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-2xl p-6 sm:p-8"
        style={{
          background: "linear-gradient(165deg, hsla(265,25%,15%,0.9), hsla(230,15%,8%,0.95))",
          border: "1px solid hsla(265,50%,55%,0.1)",
        }}
      >
        {/* Decorative DNA helix */}
        <div className="absolute top-0 right-0 bottom-0 w-1/3 opacity-5 pointer-events-none flex items-center justify-center">
          <Dna className="w-40 h-40" style={{ color: "hsl(265,60%,55%)" }} />
        </div>

        {/* Top accent */}
        <div className="absolute top-0 inset-x-0 h-[2px]" style={{ background: "linear-gradient(90deg, transparent 10%, hsl(265,60%,55%) 40%, hsl(38,50%,55%) 70%, transparent 90%)" }} />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="px-3 py-1 rounded-full" style={{ background: "hsla(265,60%,55%,0.1)", border: "1px solid hsla(265,60%,55%,0.15)" }}>
              <span className="text-[0.5rem] font-bold tracking-[3px] uppercase" style={{ color: "hsl(265,60%,60%)" }}>Team AI</span>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-white flex items-center gap-3">
            <Bot className="w-7 h-7" style={{ color: "hsl(265,60%,55%)" }} />
            I Tuoi Professionisti AI
          </h1>
          <p className="text-sm mt-2 max-w-xl" style={{ color: "hsla(230,20%,75%,0.5)" }}>
            Ogni agente è un esperto dedicato che lavora per la tua attività 24/7. Gestisci il team, aggiungi nuove competenze o richiedi modifiche al tuo piano.
          </p>

          <div className="flex flex-wrap items-center gap-4 mt-4">
            <span className="flex items-center gap-1.5 text-xs">
              <motion.div className="w-2 h-2 rounded-full" style={{ background: "hsl(150,60%,45%)" }} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
              <span style={{ color: "hsla(230,20%,75%,0.5)" }}>{installedAgents.length} attivi</span>
            </span>
            <span className="text-xs" style={{ color: "hsla(230,20%,75%,0.3)" }}>•</span>
            <span className="text-xs" style={{ color: "hsla(230,20%,75%,0.5)" }}>{availableAgents.length} disponibili</span>
            {pendingRequests.length > 0 && (
              <>
                <span className="text-xs" style={{ color: "hsla(230,20%,75%,0.3)" }}>•</span>
                <span className="flex items-center gap-1 text-xs" style={{ color: "hsl(38,50%,55%)" }}>
                  <Bell className="w-3 h-3" /> {pendingRequests.length} in attesa
                </span>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* ── Tabs ── */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full grid grid-cols-2 h-11 rounded-xl" style={{ background: "hsla(230,15%,12%,0.8)", border: "1px solid hsla(265,50%,55%,0.08)" }}>
          <TabsTrigger value="team" className="text-xs sm:text-sm gap-1.5 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-white">
            <Users className="w-3.5 h-3.5" /> Il Mio Team ({installedAgents.length})
          </TabsTrigger>
          <TabsTrigger value="marketplace" className="text-xs sm:text-sm gap-1.5 rounded-lg data-[state=active]:bg-primary/20 data-[state=active]:text-white">
            <Sparkles className="w-3.5 h-3.5" /> Aggiungi ({availableAgents.length})
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* ═══ TAB: My Team ═══ */}
      {activeTab === "team" && (
        <div className="space-y-6">
          {/* Subscription Summary — always visible */}
          <SubscriptionImpact
            installedCount={installedAgents.length}
            pendingAdd={pendingRequests.length}
            pendingRemove={0}
          />

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-52 rounded-2xl animate-pulse" style={{ background: "hsla(230,15%,12%,0.5)" }} />
              ))}
            </div>
          ) : installedAgents.length === 0 ? (
            <div className="text-center py-16">
              <Bot className="w-16 h-16 mx-auto mb-4 opacity-10" style={{ color: "hsl(265,60%,55%)" }} />
              <p className="text-lg font-medium text-white/80">Nessun agente attivo</p>
              <p className="text-sm mt-1" style={{ color: "hsla(230,20%,75%,0.4)" }}>
                Esplora il marketplace per aggiungere il tuo primo professionista AI.
              </p>
              <Button className="mt-4 gap-2" style={{ background: "hsl(265,60%,55%)" }} onClick={() => setActiveTab("marketplace")}>
                <Sparkles className="w-4 h-4" /> Esplora Agenti
              </Button>
            </div>
          ) : (
            Object.entries(groupedInstalled).map(([category, agents]) => {
              const catLabel = CATEGORY_LABELS[category];
              return (
                <section key={category} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-6 rounded-full" style={{ background: catLabel?.color || 'hsl(265,60%,55%)' }} />
                    <h2 className="text-[0.65rem] font-bold tracking-[2px] uppercase text-white/80">{catLabel?.label || category}</h2>
                    <Badge variant="outline" className="text-[0.5rem] h-5 border-0 px-2" style={{ background: `${catLabel?.color}15`, color: catLabel?.color }}>
                      {agents.length}
                    </Badge>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {agents.map((agent, i) => (
                      <motion.div key={agent.id} transition={{ delay: i * 0.04 }}>
                        <InstalledAgentCard
                          agent={agent}
                          onDeactivate={() => handleDeactivation(agent)}
                          deactivating={deactivating === agent.id}
                        />
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
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: "hsla(230,20%,70%,0.3)" }} />
            <Input
              placeholder="Cerca agenti per nome, ruolo o funzione..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 border-0 text-sm"
              style={{ background: "hsla(230,15%,12%,0.7)", color: "white" }}
            />
          </div>

          {/* Subscription Impact — always visible */}
          <SubscriptionImpact
            installedCount={installedAgents.length}
            pendingAdd={pendingRequests.length}
            pendingRemove={0}
          />

          {/* Available agents */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-40 rounded-2xl animate-pulse" style={{ background: "hsla(230,15%,12%,0.5)" }} />
              ))}
            </div>
          ) : availableAgents.length === 0 ? (
            <div className="text-center py-12">
              <CheckCircle2 className="w-12 h-12 mx-auto mb-3 opacity-40" style={{ color: "hsl(150,60%,45%)" }} />
              <p className="font-medium text-white/80">Hai già tutti gli agenti disponibili!</p>
              <p className="text-sm mt-1" style={{ color: "hsla(230,20%,75%,0.4)" }}>Il tuo team AI è al completo.</p>
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

          {/* How it works */}
          <div
            className="relative overflow-hidden rounded-2xl p-5"
            style={{
              background: "linear-gradient(165deg, hsla(230,15%,13%,0.6), hsla(230,15%,9%,0.8))",
              border: "1px solid hsla(265,50%,55%,0.08)",
            }}
          >
            <div className="flex items-start gap-3">
              <Crown className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "hsl(38,50%,55%)" }} />
              <div>
                <h4 className="text-sm font-bold text-white/90">Come funziona</h4>
                <ul className="text-[0.65rem] space-y-1.5 mt-2" style={{ color: "hsla(230,20%,75%,0.5)" }}>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.5rem] font-bold" style={{ background: "hsla(265,60%,55%,0.15)", color: "hsl(265,60%,60%)" }}>1</span>
                    <strong className="text-white/70">Richiedi</strong> l'attivazione dell'agente che ti interessa
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.5rem] font-bold" style={{ background: "hsla(265,60%,55%,0.15)", color: "hsl(265,60%,60%)" }}>2</span>
                    Il team <strong className="text-white/70">Empire</strong> riceverà una notifica immediata
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.5rem] font-bold" style={{ background: "hsla(265,60%,55%,0.15)", color: "hsl(265,60%,60%)" }}>3</span>
                    Ti contatteremo per <strong className="text-white/70">confermare</strong> il piano e i costi
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.5rem] font-bold" style={{ background: "hsla(265,60%,55%,0.15)", color: "hsl(265,60%,60%)" }}>4</span>
                    L'agente verrà <strong className="text-white/70">attivato</strong> nel tuo account entro 24h
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-[0.5rem] font-bold" style={{ background: "hsla(265,60%,55%,0.15)", color: "hsl(265,60%,60%)" }}>5</span>
                    Puoi <strong className="text-white/70">disattivare</strong> qualsiasi agente in qualsiasi momento
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
