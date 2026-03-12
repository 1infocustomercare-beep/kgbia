import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus, Search, Filter, Phone, Mail, Calendar, MoreHorizontal,
  User, ArrowRight, TrendingUp, Target, Users
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import { useIndustry } from "@/hooks/useIndustry";
import { toast } from "sonner";

type LeadStatus = "new" | "contacted" | "qualified" | "converted" | "lost";

interface Lead {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  status: LeadStatus;
  source: string | null;
  notes: string | null;
  value: number;
  created_at: string;
  company_id: string;
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; color: string; bg: string }> = {
  new: { label: "Nuovo", color: "text-blue-400", bg: "bg-blue-400/10 border-blue-400/30" },
  contacted: { label: "Contattato", color: "text-yellow-400", bg: "bg-yellow-400/10 border-yellow-400/30" },
  qualified: { label: "Qualificato", color: "text-purple-400", bg: "bg-purple-400/10 border-purple-400/30" },
  converted: { label: "Convertito", color: "text-green-400", bg: "bg-green-400/10 border-green-400/30" },
  lost: { label: "Perso", color: "text-red-400", bg: "bg-red-400/10 border-red-400/30" },
};

const PIPELINE_ORDER: LeadStatus[] = ["new", "contacted", "qualified", "converted", "lost"];

export default function LeadsPage() {
  const { user } = useAuth();
  const { companyId, terminology } = useIndustry();
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<string>("all");
  const [showAdd, setShowAdd] = useState(false);
  const [viewMode, setViewMode] = useState<"kanban" | "list">("list");

  // Form state
  const [form, setForm] = useState({ name: "", email: "", phone: "", source: "", notes: "", value: "0" });

  const fetchLeads = async () => {
    if (!companyId) return;
    const { data, error } = await supabase
      .from("leads" as any)
      .select("*")
      .eq("company_id", companyId)
      .order("created_at", { ascending: false });

    if (!error && data) setLeads(data as Lead[]);
    setLoading(false);
  };

  useEffect(() => { fetchLeads(); }, [companyId]);

  const addLead = async () => {
    if (!form.name.trim() || !companyId) return;
    const { error } = await supabase.from("leads" as any).insert({
      name: form.name,
      email: form.email || null,
      phone: form.phone || null,
      source: form.source || null,
      notes: form.notes || null,
      value: parseFloat(form.value) || 0,
      status: "new",
      company_id: companyId,
    });
    if (error) { toast.error("Errore nel salvataggio"); return; }
    toast.success("Lead aggiunto!");
    setShowAdd(false);
    setForm({ name: "", email: "", phone: "", source: "", notes: "", value: "0" });
    fetchLeads();
  };

  const updateStatus = async (id: string, status: LeadStatus) => {
    await supabase.from("leads" as any).update({ status }).eq("id", id);
    fetchLeads();
  };

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.email || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  });

  // KPI
  const totalLeads = leads.length;
  const convertedLeads = leads.filter((l) => l.status === "converted").length;
  const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;
  const totalValue = leads.filter((l) => l.status === "converted").reduce((sum, l) => sum + (l.value || 0), 0);

  return (
    <div className="space-y-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Lead Totali", value: totalLeads, icon: Users, color: "text-blue-400" },
          { label: "Qualificati", value: leads.filter((l) => l.status === "qualified").length, icon: Target, color: "text-purple-400" },
          { label: "Convertiti", value: `${conversionRate}%`, icon: TrendingUp, color: "text-green-400" },
          { label: "Valore Totale", value: `€${totalValue.toLocaleString("it-IT")}`, icon: TrendingUp, color: "text-primary" },
        ].map((kpi, i) => (
          <Card key={i} className="glass border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <kpi.icon className={`w-4 h-4 ${kpi.color}`} />
                <span className="text-xs text-muted-foreground">{kpi.label}</span>
              </div>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div className="flex gap-2 flex-1 w-full sm:w-auto">
          <div className="relative flex-1 sm:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Cerca lead..."
              className="pl-9 bg-secondary/50"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[140px] bg-secondary/50">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tutti</SelectItem>
              {PIPELINE_ORDER.map((s) => (
                <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button className="bg-vibrant-gradient text-white">
              <Plus className="w-4 h-4 mr-2" /> Nuovo Lead
            </Button>
          </DialogTrigger>
          <DialogContent className="glass border-border/50">
            <DialogHeader>
              <DialogTitle>Aggiungi Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Nome *</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Mario Rossi" />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Email</Label>
                  <Input value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="mario@email.com" />
                </div>
                <div>
                  <Label>Telefono</Label>
                  <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="+39 333..." />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Fonte</Label>
                  <Input value={form.source} onChange={(e) => setForm({ ...form, source: e.target.value })} placeholder="Google, Referral..." />
                </div>
                <div>
                  <Label>Valore (€)</Label>
                  <Input type="number" value={form.value} onChange={(e) => setForm({ ...form, value: e.target.value })} />
                </div>
              </div>
              <div>
                <Label>Note</Label>
                <Textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} placeholder="Dettagli..." rows={3} />
              </div>
              <Button className="w-full bg-vibrant-gradient text-white" onClick={addLead}>Salva Lead</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Lead List */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.map((lead) => (
            <motion.div
              key={lead.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
            >
              <Card className="glass border-border/50 hover:border-primary/30 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <User className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-semibold truncate">{lead.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          {lead.email && <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{lead.email}</span>}
                          {lead.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{lead.phone}</span>}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 flex-shrink-0">
                      {lead.value > 0 && (
                        <span className="text-sm font-medium text-primary">€{lead.value.toLocaleString("it-IT")}</span>
                      )}
                      <Select value={lead.status} onValueChange={(v) => updateStatus(lead.id, v as LeadStatus)}>
                        <SelectTrigger className={`w-[130px] text-xs border ${STATUS_CONFIG[lead.status].bg}`}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {PIPELINE_ORDER.map((s) => (
                            <SelectItem key={s} value={s}>{STATUS_CONFIG[s].label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  {lead.notes && (
                    <p className="mt-2 text-xs text-muted-foreground pl-[52px]">{lead.notes}</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>

        {!loading && filtered.length === 0 && (
          <div className="text-center py-16 text-muted-foreground">
            <Target className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Nessun lead trovato</p>
            <p className="text-sm">Aggiungi il tuo primo lead per iniziare a gestire la pipeline.</p>
          </div>
        )}
      </div>
    </div>
  );
}
