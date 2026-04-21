import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/hooks/use-toast";
import { AlertTriangle, CheckCircle2, RefreshCw, ShieldAlert, Activity } from "lucide-react";

type Failure = {
  id: string;
  channel: string;
  provider: string | null;
  recipient: string | null;
  error_message: string;
  source_function: string;
  deploy_version: string | null;
  http_status: number | null;
  severity: string;
  resolved: boolean;
  created_at: string;
  owner_id: string | null;
};

type Alert = {
  id: string;
  alert_level: string;
  title: string;
  message: string;
  failures_count: number;
  attempts_count: number;
  failure_rate: number;
  window_minutes: number;
  deploy_version: string | null;
  acknowledged: boolean;
  resolved: boolean;
  created_at: string;
};

const levelColor = (lvl: string) =>
  lvl === "critical"
    ? "bg-destructive/15 text-destructive border-destructive/30"
    : lvl === "warning"
      ? "bg-amber-500/15 text-amber-500 border-amber-500/30"
      : "bg-primary/15 text-primary border-primary/30";

export default function OutreachHealthPage() {
  const [failures, setFailures] = useState<Failure[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [lastCheck, setLastCheck] = useState<any>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const since = new Date(Date.now() - 24 * 60 * 60_000).toISOString();
    const [fRes, aRes] = await Promise.all([
      supabase
        .from("outreach_failures")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(200),
      supabase
        .from("outreach_health_alerts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50),
    ]);
    if (fRes.data) setFailures(fRes.data as Failure[]);
    if (aRes.data) setAlerts(aRes.data as Alert[]);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchAll();
    const ch = supabase
      .channel("outreach-health")
      .on("postgres_changes", { event: "*", schema: "public", table: "outreach_failures" }, fetchAll)
      .on("postgres_changes", { event: "*", schema: "public", table: "outreach_health_alerts" }, fetchAll)
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
  }, [fetchAll]);

  const runHealthCheck = async () => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("outreach-health-monitor", {
        body: { window_minutes: 30, min_attempts: 5 },
      });
      if (error) throw error;
      setLastCheck(data);
      toast({ title: "Health check eseguito", description: `Stato: ${data?.health?.status ?? "ok"}` });
      await fetchAll();
    } catch (e: any) {
      toast({ title: "Errore health check", description: e?.message ?? String(e), variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const acknowledgeAlert = async (id: string) => {
    const { error } = await supabase
      .from("outreach_health_alerts")
      .update({ acknowledged: true, acknowledged_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast({ title: "Errore", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const resolveAlert = async (id: string) => {
    const { error } = await supabase
      .from("outreach_health_alerts")
      .update({ resolved: true, resolved_at: new Date().toISOString() })
      .eq("id", id);
    if (error) toast({ title: "Errore", description: error.message, variant: "destructive" });
    else fetchAll();
  };

  const openAlerts = alerts.filter((a) => !a.resolved);
  const criticalOpen = openAlerts.filter((a) => a.alert_level === "critical").length;
  const recentFailures = failures.length;

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-6 space-y-6">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <Activity className="w-6 h-6 text-primary" />
            Outreach Health
          </h1>
          <p className="text-sm text-muted-foreground">
            Log centralizzato dei fallimenti di outreach + alert automatici se la messaggistica resta non operativa.
          </p>
        </div>
        <Button onClick={runHealthCheck} disabled={running} size="sm">
          <RefreshCw className={`w-4 h-4 mr-2 ${running ? "animate-spin" : ""}`} />
          Esegui health check
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <StatCard label="Fallimenti 24h" value={recentFailures} tone={recentFailures > 20 ? "danger" : "default"} />
        <StatCard label="Alert aperti" value={openAlerts.length} tone={openAlerts.length > 0 ? "warning" : "default"} />
        <StatCard label="Critici" value={criticalOpen} tone={criticalOpen > 0 ? "danger" : "default"} />
        <StatCard
          label="Ultimo stato"
          value={lastCheck?.health?.status ?? "—"}
          tone={lastCheck?.health?.status === "critical" ? "danger" : lastCheck?.health?.status === "warning" ? "warning" : "default"}
        />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-amber-500" />
            Alert automatici
          </CardTitle>
        </CardHeader>
        <CardContent>
          {openAlerts.length === 0 ? (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Nessun alert aperto. Outreach operativo.
            </p>
          ) : (
            <div className="space-y-2">
              {openAlerts.map((a) => (
                <div key={a.id} className={`border rounded-lg p-3 ${levelColor(a.alert_level)}`}>
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{a.title}</div>
                      <div className="text-xs opacity-90 mt-1">{a.message}</div>
                      <div className="text-[11px] opacity-70 mt-1">
                        Finestra {a.window_minutes}min · {a.failures_count}/{a.attempts_count} fallimenti ·
                        {a.deploy_version ? ` deploy ${a.deploy_version} · ` : " "}
                        {new Date(a.created_at).toLocaleString("it-IT")}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {!a.acknowledged && (
                        <Button variant="outline" size="sm" onClick={() => acknowledgeAlert(a.id)}>
                          Riconosci
                        </Button>
                      )}
                      <Button variant="default" size="sm" onClick={() => resolveAlert(a.id)}>
                        Risolvi
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-destructive" />
            Fallimenti recenti (24h)
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Caricamento…</p>
          ) : failures.length === 0 ? (
            <p className="text-sm text-muted-foreground">Nessun fallimento nelle ultime 24h.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead className="text-left text-muted-foreground border-b border-border">
                  <tr>
                    <th className="py-2 pr-3">Quando</th>
                    <th className="py-2 pr-3">Canale</th>
                    <th className="py-2 pr-3">Provider</th>
                    <th className="py-2 pr-3">Errore</th>
                    <th className="py-2 pr-3">Source</th>
                    <th className="py-2 pr-3">Deploy</th>
                  </tr>
                </thead>
                <tbody>
                  {failures.slice(0, 100).map((f) => (
                    <tr key={f.id} className="border-b border-border/50">
                      <td className="py-1.5 pr-3 text-muted-foreground whitespace-nowrap">
                        {new Date(f.created_at).toLocaleString("it-IT", { dateStyle: "short", timeStyle: "short" })}
                      </td>
                      <td className="py-1.5 pr-3">
                        <Badge variant="outline" className="text-[10px]">{f.channel}</Badge>
                      </td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{f.provider ?? "—"}</td>
                      <td className="py-1.5 pr-3 max-w-[400px] truncate" title={f.error_message}>
                        {f.error_message}
                      </td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{f.source_function}</td>
                      <td className="py-1.5 pr-3 text-muted-foreground">{f.deploy_version ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ label, value, tone }: { label: string; value: string | number; tone: "default" | "warning" | "danger" }) {
  const toneCls =
    tone === "danger"
      ? "text-destructive"
      : tone === "warning"
        ? "text-amber-500"
        : "text-foreground";
  return (
    <div className="rounded-xl border border-border bg-card p-4">
      <div className="text-[11px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`text-2xl font-bold mt-1 ${toneCls}`}>{value}</div>
    </div>
  );
}
