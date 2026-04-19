import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Brain, Loader2, Sparkles, Database, Play } from "lucide-react";
import { toast } from "@/hooks/use-toast";

interface EBAgent { id: string; slug: string; name: string; category_label: string; description: string; is_orchestrator: boolean; }
interface EBRun { id: string; task_title: string; status: string; final_output: string | null; agents_used: string[] | null; created_at: string; duration_ms: number | null; }

export default function EmpireBrainPanel() {
  const [agents, setAgents] = useState<EBAgent[]>([]);
  const [runs, setRuns] = useState<EBRun[]>([]);
  const [task, setTask] = useState("");
  const [loading, setLoading] = useState(false);
  const [seeding, setSeeding] = useState(false);
  const [activeRun, setActiveRun] = useState<EBRun | null>(null);

  async function loadAll() {
    const [a, r] = await Promise.all([
      supabase.from("empire_brain_agents").select("id,slug,name,category_label,description,is_orchestrator").order("category_label").order("name"),
      supabase.from("empire_brain_runs").select("id,task_title,status,final_output,agents_used,created_at,duration_ms").order("created_at", { ascending: false }).limit(20),
    ]);
    if (a.data) setAgents(a.data as any);
    if (r.data) setRuns(r.data as any);
  }
  useEffect(() => { loadAll(); }, []);

  // Realtime: segui i run live
  useEffect(() => {
    const ch = supabase.channel("eb_runs").on("postgres_changes", { event: "*", schema: "public", table: "empire_brain_runs" }, () => loadAll()).subscribe();
    return () => { supabase.removeChannel(ch); };
  }, []);

  async function seedAgents() {
    setSeeding(true);
    const { data, error } = await supabase.functions.invoke("empire-brain-seed", { body: {} });
    setSeeding(false);
    if (error) { toast({ title: "Seed fallito", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Seed completato", description: `${data?.total_in_db ?? 0} agenti caricati` });
    loadAll();
  }

  async function runTask() {
    if (!task.trim()) return;
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("empire-brain-orchestrator", {
      body: { task_input: task, task_title: task.slice(0, 80), trigger_source: "manual" },
    });
    setLoading(false);
    if (error) { toast({ title: "Run fallito", description: error.message, variant: "destructive" }); return; }
    toast({ title: "Orchestrazione completata", description: `Agenti coinvolti: ${(data?.plan?.steps?.length ?? 0)}` });
    setTask("");
    loadAll();
  }

  const grouped = agents.reduce<Record<string, EBAgent[]>>((acc, a) => { (acc[a.category_label] ||= []).push(a); return acc; }, {});

  return (
    <div className="space-y-6 p-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 p-3"><Brain className="h-6 w-6 text-white" /></div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">Empire Brain</h2>
            <p className="text-sm text-muted-foreground">{agents.length} agenti meta in simbiosi · separati dai 98 settoriali</p>
          </div>
        </div>
        <Button onClick={seedAgents} disabled={seeding} variant="outline" size="sm">
          {seeding ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Database className="mr-2 h-4 w-4" />}
          {agents.length === 0 ? "Carica catalogo" : "Aggiorna catalogo"}
        </Button>
      </div>

      <Card className="p-4 space-y-3 border-purple-500/30 bg-gradient-to-br from-purple-500/5 to-blue-500/5">
        <div className="flex items-center gap-2"><Sparkles className="h-4 w-4 text-purple-500" /><span className="text-sm font-semibold">Lancia un task — l'orchestratore sceglie e coordina gli agenti giusti</span></div>
        <Textarea value={task} onChange={(e) => setTask(e.target.value)} placeholder="Es: Analizza la sicurezza dell'infrastruttura, identifica i bottleneck di performance e proponi un piano di hardening per il prossimo trimestre" rows={3} className="resize-none" />
        <Button onClick={runTask} disabled={loading || !task.trim() || agents.length === 0} className="w-full bg-gradient-to-r from-purple-600 to-blue-600">
          {loading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Orchestrazione in corso...</> : <><Play className="mr-2 h-4 w-4" />Esegui con Empire Brain</>}
        </Button>
      </Card>

      {runs.length > 0 && (
        <Card className="p-4">
          <h3 className="font-semibold mb-3 text-foreground">Esecuzioni recenti</h3>
          <div className="space-y-2 max-h-[400px] overflow-y-auto">
            {runs.map((r) => (
              <button key={r.id} onClick={() => setActiveRun(r)} className="w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-medium truncate">{r.task_title}</span>
                  <Badge variant={r.status === "completed" ? "default" : r.status === "failed" ? "destructive" : "secondary"}>{r.status}</Badge>
                </div>
                <div className="text-xs text-muted-foreground mt-1">{r.agents_used?.length ?? 0} agenti · {r.duration_ms ? `${(r.duration_ms / 1000).toFixed(1)}s` : "—"}</div>
              </button>
            ))}
          </div>
        </Card>
      )}

      {activeRun?.final_output && (
        <Card className="p-4 border-green-500/30 bg-green-500/5">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-foreground">Output: {activeRun.task_title}</h3>
            <Button size="sm" variant="ghost" onClick={() => setActiveRun(null)}>Chiudi</Button>
          </div>
          <div className="text-sm text-foreground whitespace-pre-wrap max-h-[500px] overflow-y-auto prose prose-sm dark:prose-invert max-w-none">{activeRun.final_output}</div>
        </Card>
      )}

      <Card className="p-4">
        <h3 className="font-semibold mb-3 text-foreground">Catalogo agenti ({agents.length})</h3>
        <div className="space-y-4 max-h-[500px] overflow-y-auto">
          {Object.entries(grouped).map(([cat, list]) => (
            <div key={cat}>
              <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">{cat} · {list.length}</div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {list.map((a) => (
                  <div key={a.id} className="p-2 rounded border border-border bg-card text-xs">
                    <div className="flex items-center gap-2"><span className="font-semibold">{a.name}</span>{a.is_orchestrator && <Badge variant="outline" className="text-[9px]">ORCH</Badge>}</div>
                    <div className="text-muted-foreground line-clamp-2 mt-0.5">{a.description}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
          {agents.length === 0 && <div className="text-sm text-muted-foreground text-center py-8">Nessun agente caricato. Premi "Carica catalogo" per importare i 140 agenti.</div>}
        </div>
      </Card>
    </div>
  );
}
