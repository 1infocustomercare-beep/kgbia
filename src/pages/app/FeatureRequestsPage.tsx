import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useIndustry } from "@/hooks/useIndustry";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Plus, Clock, CheckCircle2, XCircle, Rocket, Search,
  MessageSquare, Send, ChevronRight, AlertCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter
} from "@/components/ui/dialog";
import {
  Sheet, SheetContent, SheetHeader, SheetTitle
} from "@/components/ui/sheet";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  new: { label: "Nuova", color: "bg-yellow-500/20 text-yellow-400 border-yellow-500/30", icon: Clock },
  in_review: { label: "In Revisione", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: Search },
  approved: { label: "Approvata", color: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30", icon: CheckCircle2 },
  in_development: { label: "In Sviluppo", color: "bg-orange-500/20 text-orange-400 border-orange-500/30", icon: Rocket },
  deployed: { label: "Rilasciata", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: CheckCircle2 },
  rejected: { label: "Rifiutata", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: XCircle },
};

interface FeatureRequest {
  id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  estimated_price: number | null;
  reply_message: string | null;
  created_at: string;
  updated_at: string | null;
  votes: number | null;
}

interface ChatMessage {
  id: string;
  request_id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

export default function FeatureRequestsPage() {
  const { company } = useIndustry();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [createOpen, setCreateOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("normal");
  const [filterStatus, setFilterStatus] = useState("all");
  const [submitting, setSubmitting] = useState(false);

  const companyId = company?.id;

  useEffect(() => {
    if (!companyId) return;
    loadRequests();
  }, [companyId]);

  // Realtime subscription for feature requests
  useEffect(() => {
    if (!companyId) return;
    const channel = supabase
      .channel('feature-requests-tenant')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feature_requests', filter: `company_id=eq.${companyId}` },
        () => loadRequests()
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [companyId]);

  // Realtime for chat messages
  useEffect(() => {
    if (!selectedRequest) return;
    const channel = supabase
      .channel(`fr-messages-${selectedRequest.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feature_request_messages', filter: `request_id=eq.${selectedRequest.id}` },
        (payload) => {
          setChatMessages(prev => [...prev, payload.new as ChatMessage]);
        }
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedRequest?.id]);

  async function loadRequests() {
    if (!companyId) return;
    const { data, error } = await supabase
      .from('feature_requests')
      .select('*')
      .eq('company_id', companyId)
      .order('created_at', { ascending: false });
    if (!error && data) setRequests(data as FeatureRequest[]);
    setLoading(false);
  }

  async function loadChat(requestId: string) {
    const { data } = await supabase
      .from('feature_request_messages')
      .select('*')
      .eq('request_id', requestId)
      .order('created_at', { ascending: true });
    if (data) setChatMessages(data as ChatMessage[]);
  }

  async function handleCreate() {
    if (!companyId || newTitle.length < 5 || newDescription.length < 10) {
      toast({ title: "Compila tutti i campi", description: "Titolo min 5 caratteri, descrizione min 10", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    const { error } = await supabase.from('feature_requests').insert({
      company_id: companyId,
      title: newTitle,
      description: newDescription,
      priority: newPriority,
      status: 'new',
      sector: company?.industry || null,
    });
    setSubmitting(false);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Richiesta inviata!", description: "Il team Empire la esaminerà presto." });
      setNewTitle(""); setNewDescription(""); setNewPriority("normal");
      setCreateOpen(false);
      loadRequests();
    }
  }

  async function handleSendMessage() {
    if (!selectedRequest || !newMessage.trim()) return;
    const { error } = await supabase.from('feature_request_messages').insert({
      request_id: selectedRequest.id,
      sender_type: 'client',
      message: newMessage.trim(),
    });
    if (!error) setNewMessage("");
  }

  function openDetail(req: FeatureRequest) {
    setSelectedRequest(req);
    loadChat(req.id);
  }

  const filtered = filterStatus === "all" ? requests : requests.filter(r => r.status === filterStatus);

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="p-4 md:p-6 space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
        {[1,2,3].map(i => <Skeleton key={i} className="h-24" />)}
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-5xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-yellow-400" />
            Richieste Funzioni
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Suggerisci nuove funzionalità per la tua attività
          </p>
        </div>
        <Dialog open={createOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="w-4 h-4" /> Nuova Richiesta
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
                Richiedi una Funzione
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Titolo</label>
                <Input placeholder="Es: Integrazione con Google Calendar" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Descrizione dettagliata</label>
                <Textarea placeholder="Descrivi cosa vorresti e perché ti sarebbe utile..." className="min-h-[120px]" value={newDescription} onChange={e => setNewDescription(e.target.value)} />
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Priorità</label>
                <Select value={newPriority} onValueChange={setNewPriority}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Bassa</SelectItem>
                    <SelectItem value="normal">Normale</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} disabled={submitting} className="w-full gap-2">
                <Send className="w-4 h-4" /> {submitting ? "Invio..." : "Invia Richiesta"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          const count = statusCounts[key] || 0;
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
              className={`p-3 rounded-xl border text-center transition-all ${filterStatus === key ? cfg.color + " border-current" : "bg-card border-border hover:border-primary/30"}`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              <div className="text-lg font-bold">{count}</div>
              <div className="text-[10px] opacity-70">{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Requests list */}
      <div className="space-y-3">
        <AnimatePresence>
          {filtered.length === 0 && (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Lightbulb className="w-12 h-12 text-muted-foreground/30 mb-3" />
                <p className="text-muted-foreground">Nessuna richiesta {filterStatus !== "all" && `con stato "${STATUS_CONFIG[filterStatus]?.label}"`}</p>
                <Button variant="outline" className="mt-4" onClick={() => setCreateOpen(true)}>
                  <Plus className="w-4 h-4 mr-2" /> Crea la prima
                </Button>
              </CardContent>
            </Card>
          )}
          {filtered.map((req, i) => {
            const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.new;
            const Icon = cfg.icon;
            return (
              <motion.div
                key={req.id}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card
                  className="cursor-pointer hover:border-primary/40 transition-all group"
                  onClick={() => openDetail(req)}
                >
                  <CardContent className="flex items-start gap-3 p-4">
                    <div className={`p-2 rounded-lg mt-0.5 ${cfg.color}`}>
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-sm truncate">{req.title}</h3>
                        <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                        {req.priority === "urgent" && <Badge variant="destructive" className="text-[10px]">Urgente</Badge>}
                        {req.priority === "high" && <Badge className="text-[10px] bg-orange-500/20 text-orange-400 border-orange-500/30">Alta</Badge>}
                      </div>
                      <p className="text-xs text-muted-foreground line-clamp-2">{req.description}</p>
                      <div className="flex items-center gap-4 mt-2 text-[10px] text-muted-foreground">
                        <span>{new Date(req.created_at).toLocaleDateString("it-IT")}</span>
                        {req.estimated_price && <span className="text-emerald-400 font-medium">€{req.estimated_price}/mese</span>}
                      </div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-primary transition-colors mt-1" />
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Detail Sheet */}
      <Sheet open={!!selectedRequest} onOpenChange={(open) => { if (!open) setSelectedRequest(null); }}>
        <SheetContent className="w-full sm:max-w-lg flex flex-col">
          {selectedRequest && (
            <>
              <SheetHeader>
                <SheetTitle className="text-left pr-8">{selectedRequest.title}</SheetTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className={STATUS_CONFIG[selectedRequest.status]?.color}>
                    {STATUS_CONFIG[selectedRequest.status]?.label}
                  </Badge>
                  {selectedRequest.estimated_price && (
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30">
                      €{selectedRequest.estimated_price}/mese
                    </Badge>
                  )}
                </div>
              </SheetHeader>

              <div className="mt-4 space-y-4 flex-1 flex flex-col min-h-0">
                {/* Description */}
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">{selectedRequest.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Inviata il {new Date(selectedRequest.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                  </p>
                </div>

                {selectedRequest.reply_message && (
                  <div className="bg-primary/5 border border-primary/20 rounded-lg p-3">
                    <p className="text-xs font-medium text-primary mb-1">Risposta Empire</p>
                    <p className="text-sm">{selectedRequest.reply_message}</p>
                  </div>
                )}

                {/* Chat */}
                <div className="flex-1 flex flex-col min-h-0">
                  <h4 className="text-sm font-semibold flex items-center gap-2 mb-2">
                    <MessageSquare className="w-4 h-4" /> Messaggi
                  </h4>
                  <ScrollArea className="flex-1 border rounded-lg p-3 min-h-[200px] max-h-[300px]">
                    {chatMessages.length === 0 && (
                      <p className="text-xs text-muted-foreground text-center py-8">Nessun messaggio ancora</p>
                    )}
                    <div className="space-y-3">
                      {chatMessages.map(msg => (
                        <div key={msg.id} className={`flex ${msg.sender_type === 'client' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.sender_type === 'client' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                            <p>{msg.message}</p>
                            <p className="text-[9px] opacity-60 mt-1">
                              {new Date(msg.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="flex gap-2 mt-2">
                    <Input
                      placeholder="Scrivi un messaggio..."
                      value={newMessage}
                      onChange={e => setNewMessage(e.target.value)}
                      onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                    />
                    <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
