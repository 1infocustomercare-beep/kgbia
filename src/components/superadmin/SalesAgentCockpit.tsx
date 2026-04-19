import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Bot, Play, Pause, Search, Sparkles, Send, Phone, Mail, MessageSquare, Linkedin, CheckCircle2, XCircle, Loader2, Activity, LayoutGrid, Zap, Brain, Target, TrendingUp } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

type AgentAction = {
  id: string;
  action_type: string;
  channel: string | null;
  status: string;
  title: string;
  description: string | null;
  payload: any;
  created_at: string;
  duration_ms: number | null;
};

type Approval = {
  id: string;
  channel: string;
  draft_subject: string | null;
  draft_body: string;
  reasoning: string | null;
  recipient: string | null;
  status: string;
  created_at: string;
  lead_id: string | null;
};

type AgentConfig = {
  is_active: boolean;
  autonomy_mode: string;
  channels_enabled: Record<string, boolean>;
  daily_limits: Record<string, number>;
  total_jobs_run: number;
  total_messages_sent: number;
  total_meetings_booked: number;
  total_conversions: number;
};

const channelIcon = (c: string | null) => {
  switch (c) {
    case "email": return <Mail className="w-3.5 h-3.5" />;
    case "whatsapp": return <MessageSquare className="w-3.5 h-3.5" />;
    case "linkedin": case "instagram": return <Linkedin className="w-3.5 h-3.5" />;
    case "voice": return <Phone className="w-3.5 h-3.5" />;
    default: return <Sparkles className="w-3.5 h-3.5" />;
  }
};

const actionIcon = (t: string) => {
  switch (t) {
    case "search": case "scrape": return <Search className="w-3.5 h-3.5" />;
    case "enrich": case "score": return <Brain className="w-3.5 h-3.5" />;
    case "draft": return <Sparkles className="w-3.5 h-3.5" />;
    case "send_email": case "send_whatsapp": case "send_linkedin": return <Send className="w-3.5 h-3.5" />;
    case "call": return <Phone className="w-3.5 h-3.5" />;
    case "book": return <Target className="w-3.5 h-3.5" />;
    default: return <Zap className="w-3.5 h-3.5" />;
  }
};

export default function SalesAgentCockpit() {
  const { toast } = useToast();
  const [config, setConfig] = useState<AgentConfig | null>(null);
  const [actions, setActions] = useState<AgentAction[]>([]);
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [view, setView] = useState<"cockpit" | "feed">("cockpit");
  const [running, setRunning] = useState(false);
  const [editingApproval, setEditingApproval] = useState<string | null>(null);
  const [editedBody, setEditedBody] = useState("");

  const load = useCallback(async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data: cfg } = await supabase
      .from("sales_agent_config" as any).select("*").eq("user_id", user.id).maybeSingle();
    if (!cfg) {
      const { data: created } = await supabase.from("sales_agent_config" as any).insert({
        user_id: user.id, is_active: false, autonomy_mode: "semi_auto",
      }).select("*").single();
      setConfig(created as any);
    } else {
      setConfig(cfg as any);
    }

    const { data: acts } = await supabase
      .from("sales_agent_actions" as any).select("*").eq("owner_id", user.id)
      .order("created_at", { ascending: false }).limit(50);
    setActions((acts ?? []) as any);

    const { data: appr } = await supabase
      .from("sales_agent_approvals" as any).select("*").eq("owner_id", user.id)
      .eq("status", "pending").order("created_at", { ascending: false });
    setApprovals((appr ?? []) as any);
  }, []);

  useEffect(() => {
    load();
    const ch = supabase.channel("sales-agent-live")
      .on("postgres_changes", { event: "*", schema: "public", table: "sales_agent_actions" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "sales_agent_approvals" }, () => load())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
  }, [load]);

  const toggleActive = async (val: boolean) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from("sales_agent_config" as any).update({ is_active: val }).eq("user_id", user.id);
    setConfig(c => c ? { ...c, is_active: val } : c);
    toast({ title: val ? "🤖 Arianna è ora attiva" : "⏸️ Arianna in pausa" });
  };

  const runNow = async () => {
    setRunning(true);
    const { data: { user } } = await supabase.auth.getUser();
    try {
      const { data, error } = await supabase.functions.invoke("sales-agent-orchestrator", {
        body: { owner_id: user?.id, trigger_source: "manual" },
      });
      if (error) throw error;
      toast({ title: "✨ Ciclo completato", description: `${data?.leads_processed ?? 0} lead analizzati · ${data?.drafts_created ?? 0} bozze pronte` });
    } catch (e: any) {
      toast({ title: "Errore", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  // Estrai link cliccabili da payload (preview/admin generati)
  const renderActionExtras = (a: AgentAction) => {
    const p = a.payload || {};
    const preview = p.preview_url;
    const admin = p.admin_url;
    if (!preview && !admin) return null;
    return (
      <div className="flex gap-2 mt-1.5 flex-wrap">
        {preview && (
          <a href={preview} target="_blank" rel="noreferrer" className="text-[11px] text-primary underline hover:no-underline">
            🌐 Apri preview
          </a>
        )}
        {admin && (
          <a href={admin} target="_blank" rel="noreferrer" className="text-[11px] text-accent-foreground underline hover:no-underline">
            🛠️ Apri admin demo
          </a>
        )}
      </div>
    );
  };

  const handleApproval = async (id: string, decision: "approve" | "reject", edited?: string) => {
    const { error } = await supabase.functions.invoke("sales-agent-send", {
      body: { approval_id: id, decision, edited_body: edited },
    });
    if (error) {
      toast({ title: "Errore invio", description: error.message, variant: "destructive" });
    } else {
      toast({ title: decision === "approve" ? "✅ Inviato" : "❌ Rifiutato" });
      setEditingApproval(null);
      load();
    }
  };

  if (!config) return <div className="p-8 text-center text-muted-foreground">Caricamento Arianna...</div>;

  return (
    <div className="space-y-4">
      {/* Header */}
      <Card className="p-4 bg-gradient-to-br from-primary/10 to-accent/5 border-primary/20">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Bot className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-bold">Arianna · Sales Agent Autonomo</h2>
              <p className="text-xs text-muted-foreground">
                {config.is_active ? "🟢 Operativa · " : "⚪ Standby · "}
                Modalità: {config.autonomy_mode === "semi_auto" ? "Semi-autonoma con approvazione" : config.autonomy_mode}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Switch checked={config.is_active} onCheckedChange={toggleActive} />
            <Button onClick={runNow} disabled={running || !config.is_active} size="sm">
              {running ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Play className="w-4 h-4 mr-2" />}
              Esegui ora
            </Button>
          </div>
        </div>

        {/* KPI */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-4">
          <KpiCard icon={<Activity className="w-4 h-4" />} label="Cicli totali" value={config.total_jobs_run} />
          <KpiCard icon={<Send className="w-4 h-4" />} label="Messaggi inviati" value={config.total_messages_sent} />
          <KpiCard icon={<Phone className="w-4 h-4" />} label="Call prenotate" value={config.total_meetings_booked} />
          <KpiCard icon={<TrendingUp className="w-4 h-4" />} label="Conversioni" value={config.total_conversions} />
        </div>
      </Card>

      {/* Approvals queue */}
      {approvals.length > 0 && (
        <Card className="p-4 border-amber-500/30 bg-amber-500/5">
          <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Bozze in attesa di approvazione ({approvals.length})
          </h3>
          <div className="space-y-2">
            {approvals.slice(0, 5).map(a => (
              <div key={a.id} className="border border-border rounded-lg p-3 bg-background">
                <div className="flex items-center gap-2 text-xs mb-2">
                  <Badge variant="outline" className="gap-1">{channelIcon(a.channel)} {a.channel}</Badge>
                  <span className="text-muted-foreground">→ {a.recipient ?? "—"}</span>
                </div>
                {a.draft_subject && <div className="font-semibold text-sm mb-1">{a.draft_subject}</div>}
                {editingApproval === a.id ? (
                  <Textarea value={editedBody} onChange={e => setEditedBody(e.target.value)} className="text-xs min-h-[120px] mb-2" />
                ) : (
                  <p className="text-xs text-foreground/80 whitespace-pre-wrap mb-2">{a.draft_body}</p>
                )}
                {a.reasoning && <p className="text-xs italic text-muted-foreground mb-2">💡 {a.reasoning}</p>}
                <div className="flex gap-2">
                  {editingApproval === a.id ? (
                    <>
                      <Button size="sm" onClick={() => handleApproval(a.id, "approve", editedBody)}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Invia modificato
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditingApproval(null)}>Annulla</Button>
                    </>
                  ) : (
                    <>
                      <Button size="sm" onClick={() => handleApproval(a.id, "approve")}>
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Approva e invia
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => { setEditingApproval(a.id); setEditedBody(a.draft_body); }}>
                        Modifica
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => handleApproval(a.id, "reject")}>
                        <XCircle className="w-3.5 h-3.5 mr-1" /> Rifiuta
                      </Button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* View toggle */}
      <Tabs value={view} onValueChange={(v) => setView(v as any)}>
        <TabsList>
          <TabsTrigger value="cockpit"><LayoutGrid className="w-4 h-4 mr-1" /> Cockpit Live</TabsTrigger>
          <TabsTrigger value="feed"><Activity className="w-4 h-4 mr-1" /> Activity Feed</TabsTrigger>
        </TabsList>

        <TabsContent value="cockpit" className="mt-3">
          <Card className="p-4 min-h-[400px] bg-gradient-to-br from-background to-muted/20">
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary animate-pulse" />
              Sala controllo · Stream live
            </h3>
            <ScrollArea className="h-[500px] pr-2">
              <div className="space-y-2">
                <AnimatePresence>
                  {actions.map((a) => (
                    <motion.div
                      key={a.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-start gap-3 p-3 rounded-lg border border-border bg-card hover:bg-accent/30 transition-colors"
                    >
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                        a.status === "success" ? "bg-emerald-500/15 text-emerald-500" :
                        a.status === "running" ? "bg-blue-500/15 text-blue-500 animate-pulse" :
                        a.status === "needs_approval" ? "bg-amber-500/15 text-amber-500" :
                        a.status === "failed" ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"
                      }`}>
                        {actionIcon(a.action_type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-medium">{a.title}</span>
                          {a.channel && a.channel !== "system" && (
                            <Badge variant="outline" className="text-[10px] gap-1 py-0 px-1.5">{channelIcon(a.channel)} {a.channel}</Badge>
                          )}
                        </div>
                        {a.description && <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>}
                        {renderActionExtras(a)}
                        <div className="flex gap-3 text-[11px] text-muted-foreground mt-1">
                          <span>{new Date(a.created_at).toLocaleTimeString("it-IT")}</span>
                          {a.duration_ms ? <span>{a.duration_ms}ms</span> : null}
                          <span className="capitalize">{a.status}</span>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {actions.length === 0 && (
                  <div className="text-center py-12 text-muted-foreground text-sm">
                    Nessuna attività ancora. Premi "Esegui ora" per avviare il primo ciclo.
                  </div>
                )}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="feed" className="mt-3">
          <Card className="p-4">
            <ScrollArea className="h-[500px]">
              <div className="space-y-1">
                {actions.map(a => (
                  <div key={a.id} className="flex items-center gap-3 py-2 border-b border-border/40 text-sm">
                    <span className="text-muted-foreground text-xs w-16 shrink-0">{new Date(a.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}</span>
                    {actionIcon(a.action_type)}
                    <span className="flex-1 truncate">{a.title}</span>
                    <Badge variant={a.status === "success" ? "default" : a.status === "failed" ? "destructive" : "secondary"} className="text-[10px]">
                      {a.status}
                    </Badge>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KpiCard({ icon, label, value }: { icon: React.ReactNode; label: string; value: number }) {
  return (
    <div className="bg-background/60 border border-border rounded-lg p-3">
      <div className="flex items-center gap-2 text-muted-foreground text-xs mb-1">{icon}<span>{label}</span></div>
      <div className="text-xl font-bold">{value.toLocaleString("it-IT")}</div>
    </div>
  );
}
