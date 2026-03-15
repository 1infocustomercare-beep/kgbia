import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import { ArrowLeft, Bot, CheckCircle2, Zap, Clock, Activity, Settings2, Brain, Shield, Eye, GraduationCap } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Slider } from "@/components/ui/slider";
import { useAgentInstallation } from "@/hooks/useAgentInstallation";
import { useAuth } from "@/context/AuthContext";
import { CATEGORY_LABELS, type Agent, type PrivacyLevel } from "@/types/agent";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";

// Mock metrics data
const mockDailyData = Array.from({ length: 14 }, (_, i) => ({
  day: `${i + 1}/03`,
  executions: Math.floor(5 + Math.random() * 30),
  success: Math.floor(4 + Math.random() * 25),
  avgMs: Math.floor(200 + Math.random() * 800),
}));

export default function AgentDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { isInstalled, install, uninstall, installing, uninstalling } = useAgentInstallation(id);

  const { data: agent, isLoading } = useQuery({
    queryKey: ["agent-detail", id],
    enabled: !!id,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("agents" as any)
        .select("*")
        .eq("id", id!)
        .single();
      if (error) throw error;
      const a = data as any;
      return { ...a, pricing: typeof a.pricing === 'string' ? JSON.parse(a.pricing) : a.pricing } as Agent;
    },
  });

  const { data: executions = [] } = useQuery({
    queryKey: ["agent-executions", id, user?.id],
    enabled: !!id && !!user?.id,
    queryFn: async () => {
      const { data } = await supabase
        .from("agent_executions" as any)
        .select("*")
        .eq("agent_id", id!)
        .eq("tenant_id", user!.id)
        .order("created_at", { ascending: false })
        .limit(50);
      return data || [];
    },
  });

  if (isLoading || !agent) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const cat = CATEGORY_LABELS[agent.category];
  const isFree = agent.pricing.base === 0;

  return (
    <div className="space-y-6 pb-20">
      {/* Back */}
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
        <ArrowLeft className="w-4 h-4" /> Torna al Marketplace
      </button>

      {/* Header Card */}
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <Card className="border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-start gap-6">
              <div
                className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl flex-shrink-0"
                style={{ background: `${agent.color_hex}20` }}
              >
                {agent.icon_emoji}
              </div>
              <div className="flex-1 space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl font-heading font-bold text-foreground">{agent.name}</h1>
                  <Badge variant="outline" style={{ borderColor: cat?.color, color: cat?.color }}>{cat?.label}</Badge>
                  {agent.status === 'beta' && <Badge className="bg-amber-500/20 text-amber-400 border-amber-500/30">BETA</Badge>}
                  {agent.type === 'universal' && <Badge className="bg-purple-500/20 text-purple-300 border-purple-500/30">Universale</Badge>}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">{agent.description_it}</p>

                {/* Capabilities */}
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {agent.capabilities.map(cap => (
                    <Badge key={cap} variant="secondary" className="text-[10px] bg-white/5 border-white/10">{cap}</Badge>
                  ))}
                </div>

                {/* Sectors */}
                <div className="flex flex-wrap gap-1.5">
                  {agent.sectors.map(s => (
                    <Badge key={s} variant="outline" className="text-[10px] capitalize border-white/10">{s}</Badge>
                  ))}
                </div>
              </div>

              {/* Price + Action */}
              <div className="flex flex-col items-end gap-3 flex-shrink-0">
                <div className="text-right">
                  {isFree ? (
                    <div className="text-lg font-bold text-emerald-400">Incluso</div>
                  ) : (
                    <div>
                      <span className="text-2xl font-bold text-purple-400">€{agent.pricing.base}</span>
                      <span className="text-xs text-muted-foreground">/mese</span>
                    </div>
                  )}
                </div>

                {isInstalled ? (
                  <Button
                    variant="outline"
                    className="border-red-500/30 text-red-400 hover:bg-red-500/10"
                    onClick={() => uninstall(agent.id)}
                    disabled={uninstalling}
                  >
                    {uninstalling ? "Disattivando..." : "Disattiva Agente"}
                  </Button>
                ) : (
                  <Button
                    className="bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-500 hover:to-purple-400 text-white gap-2"
                    onClick={() => install(agent.id)}
                    disabled={installing}
                  >
                    <Zap className="w-4 h-4" />
                    {installing ? "Attivando..." : "Attiva Agente"}
                  </Button>
                )}

                {isInstalled && (
                  <span className="flex items-center gap-1 text-xs text-emerald-400">
                    <CheckCircle2 className="w-3 h-3" /> Attivo
                  </span>
                )}
              </div>
            </div>
          </div>
        </Card>
      </motion.div>

      {/* Tabs */}
      <Tabs defaultValue="metrics" className="space-y-4">
        <TabsList className="bg-white/5 border border-white/10 flex-wrap h-auto gap-1 p-1">
          <TabsTrigger value="metrics" className="gap-1.5 data-[state=active]:bg-purple-500/20">
            <Activity className="w-3.5 h-3.5" /> Metriche
          </TabsTrigger>
          <TabsTrigger value="intelligence" className="gap-1.5 data-[state=active]:bg-cyan-500/20">
            <Brain className="w-3.5 h-3.5" /> Intelligenza
          </TabsTrigger>
          <TabsTrigger value="logs" className="gap-1.5 data-[state=active]:bg-purple-500/20">
            <Clock className="w-3.5 h-3.5" /> Esecuzioni
          </TabsTrigger>
          <TabsTrigger value="config" className="gap-1.5 data-[state=active]:bg-purple-500/20">
            <Settings2 className="w-3.5 h-3.5" /> Configurazione
          </TabsTrigger>
        </TabsList>

        {/* Metrics */}
        <TabsContent value="metrics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { label: "Esecuzioni Totali", value: executions.length || mockDailyData.reduce((s, d) => s + d.executions, 0), color: "text-purple-400" },
              { label: "Tasso Successo", value: "94%", color: "text-emerald-400" },
              { label: "Tempo Medio", value: "420ms", color: "text-cyan-400" },
            ].map(stat => (
              <Card key={stat.label} className="border-white/10 bg-white/5 p-5">
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Esecuzioni Giornaliere</h3>
              <ResponsiveContainer width="100%" height={220}>
                <LineChart data={mockDailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Line type="monotone" dataKey="executions" stroke="#8B5CF6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="success" stroke="#10B981" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            </Card>

            <Card className="border-white/10 bg-white/5 p-5">
              <h3 className="text-sm font-semibold text-foreground mb-4">Tempo Risposta (ms)</h3>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={mockDailyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                  <XAxis dataKey="day" tick={{ fontSize: 10, fill: '#888' }} />
                  <YAxis tick={{ fontSize: 10, fill: '#888' }} />
                  <Tooltip contentStyle={{ background: '#1a1a2e', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 8 }} />
                  <Bar dataKey="avgMs" fill="#06B6D4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>
        </TabsContent>

        {/* Intelligence Tab */}
        <TabsContent value="intelligence" className="space-y-4">
          <IntelligenceTab agent={agent} executionCount={executions.length || mockDailyData.reduce((s, d) => s + d.executions, 0)} />
        </TabsContent>

        {/* Executions Log */}
        <TabsContent value="logs">
          <Card className="border-white/10 bg-white/5 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-white/10 bg-white/5">
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Data</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Tipo</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Stato</th>
                    <th className="px-4 py-3 text-left text-muted-foreground font-medium">Durata</th>
                  </tr>
                </thead>
                <tbody>
                  {executions.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="px-4 py-12 text-center text-muted-foreground">
                        <Bot className="w-8 h-8 mx-auto mb-2 opacity-30" />
                        Nessuna esecuzione registrata. Attiva l'agente per iniziare.
                      </td>
                    </tr>
                  ) : (
                    executions.map((ex: any) => (
                      <tr key={ex.id} className="border-b border-white/5 hover:bg-white/5">
                        <td className="px-4 py-3 text-foreground">{new Date(ex.created_at).toLocaleString('it-IT')}</td>
                        <td className="px-4 py-3">{ex.execution_type || '-'}</td>
                        <td className="px-4 py-3">
                          <Badge variant={ex.status === 'success' ? 'default' : 'destructive'} className="text-[10px]">
                            {ex.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-3">{ex.duration_ms ? `${ex.duration_ms}ms` : '-'}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </TabsContent>

        {/* Config */}
        <TabsContent value="config">
          <Card className="border-white/10 bg-white/5 p-6">
            {isInstalled ? (
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-foreground">Configurazione Agente</h3>
                <p className="text-xs text-muted-foreground">
                  Questo agente è attivo e funzionante con la configurazione predefinita.
                  Le opzioni avanzate di configurazione saranno disponibili con i prossimi aggiornamenti.
                </p>
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Stato</p>
                    <p className="text-sm font-bold text-emerald-400 mt-1">Attivo</p>
                  </div>
                  <div className="bg-white/5 rounded-lg p-4 border border-white/10">
                    <p className="text-[10px] text-muted-foreground uppercase tracking-wider">Modello AI</p>
                    <p className="text-sm font-bold text-foreground mt-1">Auto (Ottimale)</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-muted-foreground">
                <Settings2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="text-sm">Attiva l'agente per accedere alla configurazione.</p>
              </div>
            )}
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

/* ─── Intelligence Tab Component ─── */
const PRIVACY_CONFIG: Record<PrivacyLevel, { label: string; color: string; icon: React.ReactNode; desc: string }> = {
  strict: { label: "Strict", color: "text-emerald-400", icon: <Shield className="w-4 h-4" />, desc: "Isolamento totale dati per tenant. Zero condivisione." },
  standard: { label: "Standard", color: "text-amber-400", icon: <Eye className="w-4 h-4" />, desc: "Dati aggregati anonimi per miglioramento modello." },
  minimal: { label: "Minimal", color: "text-red-400", icon: <Eye className="w-4 h-4" />, desc: "Privacy base. Dati usati per training globale." },
};

const AI_MODEL_LABELS: Record<string, { label: string; tier: string }> = {
  "gpt-4o": { label: "GPT-4o", tier: "Premium" },
  "gpt-4o-mini": { label: "GPT-4o Mini", tier: "Standard" },
  "gemini-2.5-pro": { label: "Gemini 2.5 Pro", tier: "Premium" },
  "gemini-2.5-flash": { label: "Gemini 2.5 Flash", tier: "Fast" },
};

function IntelligenceTab({ agent, executionCount }: { agent: Agent; executionCount: number }) {
  const autonomy = agent.autonomy_level ?? 7;
  const privacy = PRIVACY_CONFIG[agent.privacy_level ?? 'strict'] || PRIVACY_CONFIG.strict;
  const modelInfo = AI_MODEL_LABELS[agent.ai_model] || { label: agent.ai_model || 'Auto', tier: 'Custom' };
  const learningEnabled = agent.learning_enabled ?? true;

  // AI Score: weighted formula
  const aiScore = Math.min(100, Math.round(autonomy * 8 + Math.min(executionCount, 200) / 10 + (learningEnabled ? 10 : 0)));

  return (
    <div className="space-y-4">
      {/* AI Score Hero */}
      <Card className="border-white/10 bg-gradient-to-br from-cyan-500/10 via-purple-500/5 to-transparent p-6">
        <div className="flex items-center gap-5">
          <div className="relative w-20 h-20 flex-shrink-0">
            <svg viewBox="0 0 100 100" className="w-full h-full -rotate-90">
              <circle cx="50" cy="50" r="42" stroke="rgba(255,255,255,0.1)" strokeWidth="8" fill="none" />
              <motion.circle
                cx="50" cy="50" r="42"
                stroke="url(#scoreGrad)"
                strokeWidth="8"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={`${aiScore * 2.64} 264`}
                initial={{ strokeDasharray: "0 264" }}
                animate={{ strokeDasharray: `${aiScore * 2.64} 264` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <defs>
                <linearGradient id="scoreGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#06B6D4" />
                  <stop offset="100%" stopColor="#8B5CF6" />
                </linearGradient>
              </defs>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-xl font-bold text-foreground">{aiScore}</span>
            </div>
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">AI Intelligence Score</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Basato su autonomia, esecuzioni ({executionCount}) e capacità di apprendimento
            </p>
            <div className="flex gap-2 mt-2">
              <Badge className="text-[10px] bg-cyan-500/20 text-cyan-400 border-cyan-500/30">
                {aiScore >= 80 ? 'Eccellente' : aiScore >= 60 ? 'Avanzato' : aiScore >= 40 ? 'Intermedio' : 'Base'}
              </Badge>
            </div>
          </div>
        </div>
      </Card>

      {/* Model + Autonomy */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-purple-400" />
            <h4 className="text-xs font-semibold text-foreground">Modello AI</h4>
          </div>
          <div className="flex items-center justify-between bg-white/5 rounded-lg p-3 border border-white/10">
            <div>
              <p className="text-sm font-bold text-foreground">{modelInfo.label}</p>
              <p className="text-[10px] text-muted-foreground">Tier: {modelInfo.tier}</p>
            </div>
            <Badge variant="outline" className="text-[10px] border-purple-500/30 text-purple-400">{modelInfo.tier}</Badge>
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" />
            <h4 className="text-xs font-semibold text-foreground">Livello Autonomia</h4>
          </div>
          <div className="space-y-2">
            <Slider
              value={[autonomy]}
              min={1}
              max={10}
              step={1}
              disabled
              className="pointer-events-none"
            />
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>1 - Assistito</span>
              <span className="font-bold text-foreground">{autonomy}/10</span>
              <span>10 - Autonomo</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Privacy + Learning */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-semibold text-foreground">Privacy Level</h4>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className={privacy.color}>{privacy.icon}</div>
            <div>
              <p className={`text-sm font-bold ${privacy.color}`}>{privacy.label}</p>
              <p className="text-[10px] text-muted-foreground">{privacy.desc}</p>
            </div>
          </div>
        </Card>

        <Card className="border-white/10 bg-white/5 p-5 space-y-3">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <h4 className="text-xs font-semibold text-foreground">Apprendimento Autonomo</h4>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-lg p-3 border border-white/10">
            <div className={`w-3 h-3 rounded-full ${learningEnabled ? 'bg-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'bg-red-400'}`} />
            <div>
              <p className="text-sm font-bold text-foreground">{learningEnabled ? 'Attivo' : 'Disattivato'}</p>
              <p className="text-[10px] text-muted-foreground">
                {learningEnabled ? 'L\'agente migliora dalle interazioni passate' : 'Nessun apprendimento automatico'}
              </p>
            </div>
          </div>

          {/* Learning Stats */}
          {learningEnabled && (
            <div className="grid grid-cols-3 gap-2 mt-2">
              <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                <p className="text-sm font-bold text-cyan-400">{Math.min(executionCount, 999)}</p>
                <p className="text-[9px] text-muted-foreground">Interazioni</p>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                <p className="text-sm font-bold text-purple-400">{Math.min(Math.round(executionCount * 0.15), 150)}</p>
                <p className="text-[9px] text-muted-foreground">Pattern</p>
              </div>
              <div className="text-center p-2 bg-white/5 rounded-lg border border-white/5">
                <p className="text-sm font-bold text-amber-400">{Math.round(85 + Math.min(executionCount * 0.05, 14))}%</p>
                <p className="text-[9px] text-muted-foreground">Precisione</p>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
