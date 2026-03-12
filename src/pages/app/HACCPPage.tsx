import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, ClipboardCheck, Thermometer, CheckCircle, AlertTriangle, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { toast } from "sonner";

interface HACCPLog {
  id: string;
  operator_name: string;
  check_type: string;
  result: string;
  temperature: number | null;
  notes: string | null;
  checked_at: string;
}

const RESULT_CONFIG: Record<string, { label: string; icon: any; color: string }> = {
  conforme: { label: "Conforme", icon: CheckCircle, color: "text-green-400" },
  attenzione: { label: "Attenzione", icon: AlertTriangle, color: "text-yellow-400" },
  non_conforme: { label: "Non Conforme", icon: XCircle, color: "text-red-400" },
};

const CHECK_TYPES = [
  "Temperatura Frigo", "Temperatura Congelatore", "Pulizia Superfici",
  "Igiene Personale", "Ricevimento Merci", "Cottura Alimenti",
  "Stoccaggio", "Sanificazione", "Controllo Scadenze", "Altro"
];

export default function HACCPPage() {
  const { companyId } = useIndustry();
  const [logs, setLogs] = useState<HACCPLog[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ operator_name: "", check_type: "Temperatura Frigo", result: "conforme", temperature: "", notes: "" });

  const fetchLogs = async () => {
    if (!companyId) return;
    const { data } = await supabase.from("haccp_logs" as any).select("*").eq("company_id", companyId).order("checked_at", { ascending: false }).limit(50);
    if (data) setLogs(data as unknown as HACCPLog[]);
  };

  useEffect(() => { fetchLogs(); }, [companyId]);

  const addLog = async () => {
    if (!form.operator_name.trim() || !companyId) return;
    const { error } = await supabase.from("haccp_logs" as any).insert({
      company_id: companyId,
      operator_name: form.operator_name,
      check_type: form.check_type,
      result: form.result,
      temperature: form.temperature ? parseFloat(form.temperature) : null,
      notes: form.notes || null,
    });
    if (error) { toast.error("Errore"); return; }
    toast.success("Controllo registrato!");
    setShowAdd(false);
    setForm({ operator_name: "", check_type: "Temperatura Frigo", result: "conforme", temperature: "", notes: "" });
    fetchLogs();
  };

  const conformi = logs.filter((l) => l.result === "conforme").length;
  const attenzione = logs.filter((l) => l.result === "attenzione").length;
  const nonConformi = logs.filter((l) => l.result === "non_conforme").length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Registro HACCP</h1>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-gradient text-white"><Plus className="w-4 h-4 mr-2" />Nuovo Controllo</Button>
          </DialogTrigger>
          <DialogContent className="glass border-border/50">
            <DialogHeader><DialogTitle>Registra Controllo HACCP</DialogTitle></DialogHeader>
            <div className="space-y-4 mt-4">
              <div><Label>Operatore *</Label><Input value={form.operator_name} onChange={(e) => setForm({ ...form, operator_name: e.target.value })} /></div>
              <div><Label>Tipo Controllo</Label>
                <Select value={form.check_type} onValueChange={(v) => setForm({ ...form, check_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{CHECK_TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label>Risultato</Label>
                  <Select value={form.result} onValueChange={(v) => setForm({ ...form, result: v })}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="conforme">✅ Conforme</SelectItem>
                      <SelectItem value="attenzione">⚠️ Attenzione</SelectItem>
                      <SelectItem value="non_conforme">❌ Non Conforme</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div><Label>Temperatura (°C)</Label><Input type="number" value={form.temperature} onChange={(e) => setForm({ ...form, temperature: e.target.value })} placeholder="Es: 4.2" /></div>
              </div>
              <div><Label>Note</Label><Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} rows={2} /></div>
              <Button className="w-full bg-vibrant-gradient text-white" onClick={addLog}>Registra</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* KPI */}
      <div className="grid grid-cols-3 gap-4">
        <Card className="glass border-border/50"><CardContent className="p-4 text-center">
          <CheckCircle className="w-6 h-6 text-green-400 mx-auto mb-1" /><p className="text-2xl font-bold">{conformi}</p><p className="text-xs text-muted-foreground">Conformi</p>
        </CardContent></Card>
        <Card className="glass border-border/50"><CardContent className="p-4 text-center">
          <AlertTriangle className="w-6 h-6 text-yellow-400 mx-auto mb-1" /><p className="text-2xl font-bold">{attenzione}</p><p className="text-xs text-muted-foreground">Attenzione</p>
        </CardContent></Card>
        <Card className="glass border-border/50"><CardContent className="p-4 text-center">
          <XCircle className="w-6 h-6 text-red-400 mx-auto mb-1" /><p className="text-2xl font-bold">{nonConformi}</p><p className="text-xs text-muted-foreground">Non Conformi</p>
        </CardContent></Card>
      </div>

      {/* Logs */}
      <div className="space-y-3">
        <AnimatePresence>
          {logs.map((log) => {
            const rc = RESULT_CONFIG[log.result] || RESULT_CONFIG.conforme;
            const Icon = rc.icon;
            return (
              <motion.div key={log.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <Card className="glass border-border/50">
                  <CardContent className="p-4 flex items-center gap-4">
                    <Icon className={`w-5 h-5 ${rc.color} flex-shrink-0`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{log.check_type}</span>
                        <Badge variant="secondary" className="text-xs">{rc.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {log.operator_name} · {new Date(log.checked_at).toLocaleDateString("it-IT", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        {log.temperature != null && ` · ${log.temperature}°C`}
                      </p>
                      {log.notes && <p className="text-xs text-muted-foreground mt-1">{log.notes}</p>}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {logs.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <ClipboardCheck className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p>Nessun controllo registrato</p>
          </div>
        )}
      </div>
    </div>
  );
}
