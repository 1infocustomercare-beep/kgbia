// ══════════════════════════════════════════════════════════════
// Empire WhatsApp Orchestrator — Super Admin Panel
// ══════════════════════════════════════════════════════════════
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import {
  MessageCircle, Crown, Shield, Bot, Settings, BarChart3,
  Plus, Pencil, Trash2, Sparkles, Zap, Users, TrendingUp,
  FileText, Globe, Activity, Eye,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { motion } from "framer-motion";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import BackButton from "@/components/BackButton";

// ── Types ──
interface AgentPrompt {
  id: string;
  tenant_id: string;
  industry_type: string;
  agent_name: string;
  prompt_text: string;
  capabilities: string[];
  blocked_capabilities: string[];
  autonomy_level: number;
  is_active: boolean;
  created_at: string;
}

interface Template {
  id: string;
  tenant_id: string;
  template_name: string;
  language: string;
  category: string;
  body_text: string;
  header_text: string | null;
  footer_text: string | null;
  buttons: any[];
  status: string;
  created_at: string;
}

// ── Mock analytics ──
const mockMsgPerDay = [
  { day: "Lun", msgs: 142 }, { day: "Mar", msgs: 198 },
  { day: "Mer", msgs: 167 }, { day: "Gio", msgs: 231 },
  { day: "Ven", msgs: 289 }, { day: "Sab", msgs: 312 },
  { day: "Dom", msgs: 178 },
];

const mockSectorDist = [
  { name: "Food", value: 45, color: "#C8963E" },
  { name: "NCC", value: 20, color: "#8B5CF6" },
  { name: "Beauty", value: 15, color: "#EC4899" },
  { name: "Healthcare", value: 10, color: "#10B981" },
  { name: "Altro", value: 10, color: "#6B7280" },
];

const INDUSTRIES = [
  "ristorazione", "ncc", "beauty", "healthcare", "retail",
  "fitness", "hospitality", "construction", "ecommerce", "corporate",
];

const CATEGORIES = ["welcome", "booking", "alert", "promo", "system", "menu_update"];

export default function AdminWhatsApp() {
  const [activeTab, setActiveTab] = useState("overview");
  const [prompts, setPrompts] = useState<AgentPrompt[]>([]);
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);

  // Prompt editor state
  const [editPrompt, setEditPrompt] = useState<Partial<AgentPrompt> | null>(null);
  const [promptDialogOpen, setPromptDialogOpen] = useState(false);

  // Template editor state
  const [editTemplate, setEditTemplate] = useState<Partial<Template> | null>(null);
  const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

  // Stats
  const [tenantCount, setTenantCount] = useState(0);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [promptsRes, templatesRes, configRes] = await Promise.all([
        supabase.from("ai_agent_prompts").select("*").order("created_at", { ascending: false }),
        supabase.from("whatsapp_templates").select("*").order("created_at", { ascending: false }),
        supabase.from("whatsapp_config").select("id", { count: "exact" }).eq("is_active", true),
      ]);

      if (promptsRes.data) setPrompts(promptsRes.data as any);
      if (templatesRes.data) setTemplates(templatesRes.data as any);
      setTenantCount(configRes.count || 0);
    } catch (e) {
      console.error("Load error:", e);
    } finally {
      setLoading(false);
    }
  };

  // ── Prompt CRUD ──
  const savePrompt = async () => {
    if (!editPrompt?.industry_type || !editPrompt?.prompt_text) {
      toast.error("Compila tutti i campi obbligatori");
      return;
    }

    const payload = {
      tenant_id: editPrompt.tenant_id || "00000000-0000-0000-0000-000000000000",
      industry_type: editPrompt.industry_type,
      agent_name: editPrompt.agent_name || "whatsapp-orchestrator",
      prompt_text: editPrompt.prompt_text,
      capabilities: editPrompt.capabilities || [],
      blocked_capabilities: editPrompt.blocked_capabilities || [],
      autonomy_level: editPrompt.autonomy_level || 8,
      is_active: editPrompt.is_active ?? true,
    };

    if (editPrompt.id) {
      const { error } = await supabase
        .from("ai_agent_prompts")
        .update({ ...payload, updated_at: new Date().toISOString() })
        .eq("id", editPrompt.id);
      if (error) { toast.error("Errore aggiornamento"); return; }
      toast.success("Prompt aggiornato");
    } else {
      const { error } = await supabase.from("ai_agent_prompts").insert(payload);
      if (error) { toast.error("Errore creazione"); return; }
      toast.success("Prompt creato");
    }

    setPromptDialogOpen(false);
    setEditPrompt(null);
    loadData();
  };

  const deletePrompt = async (id: string) => {
    await supabase.from("ai_agent_prompts").delete().eq("id", id);
    toast.success("Prompt eliminato");
    loadData();
  };

  // ── Template CRUD ──
  const saveTemplate = async () => {
    if (!editTemplate?.body_text) {
      toast.error("Il body è obbligatorio");
      return;
    }

    const payload = {
      tenant_id: editTemplate.tenant_id || "00000000-0000-0000-0000-000000000000",
      template_name: editTemplate.template_name || "template",
      language: editTemplate.language || "it",
      category: editTemplate.category || "system",
      body_text: editTemplate.body_text,
      header_text: editTemplate.header_text || null,
      footer_text: editTemplate.footer_text || null,
      buttons: editTemplate.buttons || [],
      status: "pending",
    };

    if (editTemplate.id) {
      const { error } = await supabase
        .from("whatsapp_templates")
        .update(payload)
        .eq("id", editTemplate.id);
      if (error) { toast.error("Errore aggiornamento"); return; }
      toast.success("Template aggiornato");
    } else {
      const { error } = await supabase.from("whatsapp_templates").insert(payload);
      if (error) { toast.error("Errore creazione"); return; }
      toast.success("Template creato");
    }

    setTemplateDialogOpen(false);
    setEditTemplate(null);
    loadData();
  };

  const deleteTemplate = async (id: string) => {
    await supabase.from("whatsapp_templates").delete().eq("id", id);
    toast.success("Template eliminato");
    loadData();
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Empire Branding Header */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1a0533] via-[#2d1b4e] to-[#0d0d0d]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,150,62,0.15),transparent_60%)]" />
        <div className="relative px-4 pt-4 pb-6">
          <BackButton />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-3 mt-3"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-[#C8963E] to-[#F5D680] flex items-center justify-center shadow-lg shadow-[#C8963E]/30">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-[#25D366] flex items-center justify-center animate-pulse">
                <MessageCircle className="w-3 h-3 text-white" />
              </div>
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-[#C8963E] via-[#F5D680] to-[#C8963E] bg-clip-text text-transparent">
                Empire WhatsApp Orchestrator
              </h1>
              <p className="text-xs text-white/60">
                Gestione AI Autonoma — Super Admin Panel
              </p>
            </div>
          </motion.div>

          {/* Stats row */}
          <div className="flex gap-3 mt-4">
            {[
              { icon: Users, label: "Tenant Attivi", value: tenantCount },
              { icon: MessageCircle, label: "Msg Oggi", value: "1.2K" },
              { icon: Bot, label: "AI Risposte", value: "89%" },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex-1 rounded-xl bg-white/5 border border-white/10 p-3 text-center backdrop-blur-sm">
                <Icon className="w-4 h-4 text-[#C8963E] mx-auto mb-1" />
                <p className="text-lg font-bold text-white">{value}</p>
                <p className="text-[10px] text-white/50">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-4 mt-4">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full grid grid-cols-4">
            <TabsTrigger value="overview" className="gap-1 text-xs">
              <BarChart3 className="w-3 h-3" /> Stats
            </TabsTrigger>
            <TabsTrigger value="prompts" className="gap-1 text-xs">
              <Bot className="w-3 h-3" /> Prompts
            </TabsTrigger>
            <TabsTrigger value="templates" className="gap-1 text-xs">
              <FileText className="w-3 h-3" /> Templates
            </TabsTrigger>
            <TabsTrigger value="privacy" className="gap-1 text-xs">
              <Shield className="w-3 h-3" /> Privacy
            </TabsTrigger>
          </TabsList>

          {/* ════ OVERVIEW ════ */}
          <TabsContent value="overview" className="mt-4 space-y-4">
            <Card className="border-[#C8963E]/20">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#C8963E]" /> Messaggi / Giorno
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={mockMsgPerDay}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                    <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Bar dataKey="msgs" fill="#C8963E" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="border-[#C8963E]/20">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Globe className="w-4 h-4 text-[#C8963E]" /> Distribuzione Settori
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={200}>
                  <PieChart>
                    <Pie
                      data={mockSectorDist}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {mockSectorDist.map((entry) => (
                        <Cell key={entry.name} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-r from-[#C8963E]/10 to-transparent border-[#C8963E]/20">
              <CardContent className="py-4">
                <div className="flex items-center gap-2 mb-2">
                  <Eye className="w-4 h-4 text-[#C8963E]" />
                  <span className="text-sm font-semibold">Privacy Note</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Come Super Admin vedi <strong>statistiche aggregate</strong> ma 
                  <strong> NON</strong> i contenuti delle conversazioni private dei tenant.
                  L'isolamento dati è garantito da RLS.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ════ PROMPTS ════ */}
          <TabsContent value="prompts" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">AI Agent Prompts per Settore</h3>
              <Dialog open={promptDialogOpen} onOpenChange={setPromptDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-[#C8963E] hover:bg-[#b88535]"
                    onClick={() => setEditPrompt({ autonomy_level: 8, is_active: true, capabilities: [], blocked_capabilities: [] })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Nuovo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editPrompt?.id ? "Modifica Prompt" : "Nuovo Prompt Settoriale"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label>Settore</Label>
                      <Select
                        value={editPrompt?.industry_type || ""}
                        onValueChange={(v) => setEditPrompt((p) => ({ ...p, industry_type: v }))}
                      >
                        <SelectTrigger><SelectValue placeholder="Seleziona settore" /></SelectTrigger>
                        <SelectContent>
                          {INDUSTRIES.map((ind) => (
                            <SelectItem key={ind} value={ind}>{ind}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nome Agent</Label>
                      <Input
                        value={editPrompt?.agent_name || ""}
                        onChange={(e) => setEditPrompt((p) => ({ ...p, agent_name: e.target.value }))}
                        placeholder="whatsapp-orchestrator"
                      />
                    </div>
                    <div>
                      <Label>System Prompt</Label>
                      <Textarea
                        rows={6}
                        value={editPrompt?.prompt_text || ""}
                        onChange={(e) => setEditPrompt((p) => ({ ...p, prompt_text: e.target.value }))}
                        placeholder="Sei l'AI Manager di Empire per il settore..."
                      />
                    </div>
                    <div>
                      <Label>Livello Autonomia: {editPrompt?.autonomy_level || 8}/10</Label>
                      <Slider
                        value={[editPrompt?.autonomy_level || 8]}
                        onValueChange={([v]) => setEditPrompt((p) => ({ ...p, autonomy_level: v }))}
                        min={1}
                        max={10}
                        step={1}
                        className="mt-2"
                      />
                    </div>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={editPrompt?.is_active ?? true}
                        onCheckedChange={(v) => setEditPrompt((p) => ({ ...p, is_active: v }))}
                      />
                      <Label>Attivo</Label>
                    </div>
                    <Button onClick={savePrompt} className="w-full bg-[#C8963E] hover:bg-[#b88535]">
                      {editPrompt?.id ? "Aggiorna" : "Crea"} Prompt
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {prompts.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  <Bot className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Nessun prompt configurato. Creane uno per personalizzare le risposte AI per settore.
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-2">
                  {prompts.map((p) => (
                    <Card key={p.id} className="border-[#C8963E]/10">
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <Badge variant="outline" className="text-xs">{p.industry_type}</Badge>
                              <Badge className={cn("text-xs", p.is_active ? "bg-green-500/15 text-green-600" : "bg-red-500/15 text-red-500")}>
                                {p.is_active ? "Attivo" : "Disattivo"}
                              </Badge>
                              <span className="text-xs text-muted-foreground">Autonomia: {p.autonomy_level}/10</span>
                            </div>
                            <p className="text-xs mt-2 line-clamp-2 text-muted-foreground">{p.prompt_text}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => { setEditPrompt(p); setPromptDialogOpen(true); }}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive"
                              onClick={() => deletePrompt(p.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* ════ TEMPLATES ════ */}
          <TabsContent value="templates" className="mt-4 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold">WhatsApp Templates Globali</h3>
              <Dialog open={templateDialogOpen} onOpenChange={setTemplateDialogOpen}>
                <DialogTrigger asChild>
                  <Button
                    size="sm"
                    className="bg-[#25D366] hover:bg-[#1da851]"
                    onClick={() => setEditTemplate({ language: "it", category: "system", buttons: [] })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Nuovo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>
                      {editTemplate?.id ? "Modifica Template" : "Nuovo Template"}
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4 mt-2">
                    <div>
                      <Label>Nome Template</Label>
                      <Input
                        value={editTemplate?.template_name || ""}
                        onChange={(e) => setEditTemplate((p) => ({ ...p, template_name: e.target.value }))}
                        placeholder="welcome_food"
                      />
                    </div>
                    <div>
                      <Label>Categoria</Label>
                      <Select
                        value={editTemplate?.category || "system"}
                        onValueChange={(v) => setEditTemplate((p) => ({ ...p, category: v }))}
                      >
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>{c}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Header (opzionale)</Label>
                      <Input
                        value={editTemplate?.header_text || ""}
                        onChange={(e) => setEditTemplate((p) => ({ ...p, header_text: e.target.value }))}
                        placeholder="👑 Empire AI"
                      />
                    </div>
                    <div>
                      <Label>Body *</Label>
                      <Textarea
                        rows={5}
                        value={editTemplate?.body_text || ""}
                        onChange={(e) => setEditTemplate((p) => ({ ...p, body_text: e.target.value }))}
                        placeholder="Ciao {user_name}, benvenuto in {company_name}..."
                      />
                      <p className="text-[10px] text-muted-foreground mt-1">
                        Variabili: {"{company_name}"} {"{user_name}"} {"{date}"} {"{time}"}
                      </p>
                    </div>
                    <div>
                      <Label>Footer (opzionale)</Label>
                      <Input
                        value={editTemplate?.footer_text || ""}
                        onChange={(e) => setEditTemplate((p) => ({ ...p, footer_text: e.target.value }))}
                        placeholder="Powered by Empire AI"
                      />
                    </div>

                    {/* Preview */}
                    <Card className="bg-[#ECE5DD]">
                      <CardContent className="py-3">
                        <p className="text-[10px] font-medium text-center text-muted-foreground mb-2">Preview</p>
                        <div className="bg-white rounded-lg p-3 shadow-sm max-w-[80%]">
                          {editTemplate?.header_text && (
                            <p className="font-bold text-sm mb-1">{editTemplate.header_text}</p>
                          )}
                          <p className="text-sm whitespace-pre-wrap">
                            {editTemplate?.body_text || "Il tuo messaggio..."}
                          </p>
                          {editTemplate?.footer_text && (
                            <p className="text-xs text-muted-foreground mt-2">{editTemplate.footer_text}</p>
                          )}
                        </div>
                      </CardContent>
                    </Card>

                    <Button onClick={saveTemplate} className="w-full bg-[#25D366] hover:bg-[#1da851] text-white">
                      {editTemplate?.id ? "Aggiorna" : "Crea"} Template
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            {templates.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center text-sm text-muted-foreground">
                  <FileText className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  Nessun template. Crea il primo per automatizzare i messaggi WhatsApp.
                </CardContent>
              </Card>
            ) : (
              <ScrollArea className="max-h-[50vh]">
                <div className="space-y-2">
                  {templates.map((t) => (
                    <Card key={t.id} className="border-[#25D366]/10">
                      <CardContent className="py-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <span className="font-medium text-sm">{t.template_name}</span>
                              <Badge variant="outline" className="text-xs">{t.category}</Badge>
                              <Badge className={cn(
                                "text-xs",
                                t.status === "approved" ? "bg-green-500/15 text-green-600" :
                                t.status === "rejected" ? "bg-red-500/15 text-red-500" :
                                "bg-yellow-500/15 text-yellow-600"
                              )}>
                                {t.status}
                              </Badge>
                            </div>
                            <p className="text-xs mt-1 line-clamp-2 text-muted-foreground">{t.body_text}</p>
                          </div>
                          <div className="flex gap-1 ml-2">
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7"
                              onClick={() => { setEditTemplate(t as any); setTemplateDialogOpen(true); }}
                            >
                              <Pencil className="w-3 h-3" />
                            </Button>
                            <Button
                              size="icon"
                              variant="ghost"
                              className="h-7 w-7 text-destructive"
                              onClick={() => deleteTemplate(t.id)}
                            >
                              <Trash2 className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </TabsContent>

          {/* ════ PRIVACY ════ */}
          <TabsContent value="privacy" className="mt-4 space-y-4">
            <Card className="border-[#C8963E]/20">
              <CardHeader className="py-3">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Shield className="w-4 h-4 text-[#C8963E]" /> Architettura Privacy Multi-Tenant
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { title: "Isolamento Dati", desc: "Ogni tenant ha config, conversazioni e messaggi isolati tramite tenant_id + RLS." },
                  { title: "Zero Cross-Read", desc: "Ristorante X non può leggere dati di Ristorante Y. Nessun settore vede dati di un altro." },
                  { title: "Super Admin Read-Only", desc: "Vedi statistiche aggregate ma MAI contenuti delle conversazioni private." },
                  { title: "Webhook Routing", desc: "Il phone_number_id nel webhook identifica automaticamente il tenant corretto." },
                  { title: "Prompt Isolamento", desc: "Ogni settore ha il proprio system prompt. I prompt custom sono per-tenant." },
                ].map(({ title, desc }) => (
                  <div key={title} className="flex items-start gap-3 p-3 rounded-lg bg-muted/30">
                    <div className="w-6 h-6 rounded-full bg-[#C8963E]/15 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Shield className="w-3 h-3 text-[#C8963E]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">{title}</p>
                      <p className="text-xs text-muted-foreground">{desc}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
