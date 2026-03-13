import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";
import {
  Lightbulb, Clock, CheckCircle2, XCircle, Rocket, Search,
  MessageSquare, Send, ChevronRight, ArrowLeft, Building2,
  DollarSign, AlertCircle, Eye
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { useNavigate } from "react-router-dom";

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
  company_id: string;
  title: string;
  description: string | null;
  status: string;
  priority: string | null;
  estimated_price: number | null;
  admin_notes: string | null;
  reply_message: string | null;
  sector: string | null;
  created_at: string;
  updated_at: string | null;
  votes: number | null;
  companies?: { name: string; industry: string; slug: string } | null;
}

interface ChatMessage {
  id: string;
  request_id: string;
  sender_type: string;
  message: string;
  created_at: string;
}

export default function FeatureRequestsAdminPage() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState<FeatureRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState<FeatureRequest | null>(null);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [adminNotes, setAdminNotes] = useState("");
  const [estimatedPrice, setEstimatedPrice] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterSector, setFilterSector] = useState("all");

  useEffect(() => { loadRequests(); }, []);

  useEffect(() => {
    const channel = supabase
      .channel('feature-requests-admin')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feature_requests' }, () => loadRequests())
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  useEffect(() => {
    if (!selectedRequest) return;
    const channel = supabase
      .channel(`fr-admin-messages-${selectedRequest.id}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'feature_request_messages', filter: `request_id=eq.${selectedRequest.id}` },
        (payload) => setChatMessages(prev => [...prev, payload.new as ChatMessage])
      )
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [selectedRequest?.id]);

  async function loadRequests() {
    const { data, error } = await supabase
      .from('feature_requests')
      .select('*, companies(name, industry, slug)')
      .order('created_at', { ascending: false });
    if (!error && data) setRequests(data as unknown as FeatureRequest[]);
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

  async function handleStatusChange(requestId: string, newStatus: string) {
    const { error } = await supabase
      .from('feature_requests')
      .update({ status: newStatus, updated_at: new Date().toISOString() })
      .eq('id', requestId);
    if (error) {
      toast({ title: "Errore", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "✅ Status aggiornato" });
      if (selectedRequest) setSelectedRequest({ ...selectedRequest, status: newStatus });
    }
  }

  async function handleSaveNotes() {
    if (!selectedRequest) return;
    const { error } = await supabase
      .from('feature_requests')
      .update({
        admin_notes: adminNotes,
        estimated_price: estimatedPrice ? parseFloat(estimatedPrice) : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', selectedRequest.id);
    if (!error) toast({ title: "✅ Note salvate" });
  }

  async function handleSendMessage() {
    if (!selectedRequest || !newMessage.trim()) return;
    const { error } = await supabase.from('feature_request_messages').insert({
      request_id: selectedRequest.id,
      sender_type: 'superadmin',
      message: newMessage.trim(),
    });
    if (!error) setNewMessage("");
  }

  function openDetail(req: FeatureRequest) {
    setSelectedRequest(req);
    setAdminNotes(req.admin_notes || "");
    setEstimatedPrice(req.estimated_price?.toString() || "");
    loadChat(req.id);
  }

  const filtered = requests
    .filter(r => filterStatus === "all" || r.status === filterStatus)
    .filter(r => filterSector === "all" || r.companies?.industry === filterSector);

  const statusCounts = requests.reduce((acc, r) => {
    acc[r.status] = (acc[r.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sectors = [...new Set(requests.map(r => r.companies?.industry).filter(Boolean))];

  if (selectedRequest) {
    const cfg = STATUS_CONFIG[selectedRequest.status] || STATUS_CONFIG.new;
    return (
      <div className="space-y-4">
        <Button variant="ghost" size="sm" onClick={() => setSelectedRequest(null)} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Torna alla lista
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Left: Details */}
          <div className="space-y-4">
            <Card>
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-bold">{selectedRequest.title}</h2>
                  <Badge className={cfg.color}>{cfg.label}</Badge>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span>{selectedRequest.companies?.name || "N/A"}</span>
                  <Badge variant="outline" className="text-[10px]">{selectedRequest.companies?.industry}</Badge>
                </div>
                <div className="bg-muted/30 rounded-lg p-3">
                  <p className="text-sm">{selectedRequest.description}</p>
                </div>
                <div className="text-xs text-muted-foreground">
                  Creata: {new Date(selectedRequest.created_at).toLocaleDateString("it-IT", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </CardContent>
            </Card>

            {/* Admin controls */}
            <Card>
              <CardContent className="p-5 space-y-4">
                <h3 className="font-semibold text-sm">Gestione</h3>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Cambia Status</label>
                  <Select value={selectedRequest.status} onValueChange={v => handleStatusChange(selectedRequest.id, v)}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      {Object.entries(STATUS_CONFIG).map(([k, v]) => (
                        <SelectItem key={k} value={k}>{v.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Prezzo stimato (€/mese)</label>
                  <Input type="number" placeholder="0.00" value={estimatedPrice} onChange={e => setEstimatedPrice(e.target.value)} />
                </div>
                <div>
                  <label className="text-xs text-muted-foreground mb-1 block">Note interne (non visibili al cliente)</label>
                  <Textarea value={adminNotes} onChange={e => setAdminNotes(e.target.value)} placeholder="Note interne..." className="min-h-[80px]" />
                </div>
                <Button onClick={handleSaveNotes} size="sm" className="w-full">Salva Note</Button>
              </CardContent>
            </Card>
          </div>

          {/* Right: Chat */}
          <Card className="flex flex-col h-[600px]">
            <CardContent className="p-4 flex flex-col flex-1 min-h-0">
              <h3 className="font-semibold text-sm flex items-center gap-2 mb-3">
                <MessageSquare className="w-4 h-4" /> Chat con Cliente
              </h3>
              <ScrollArea className="flex-1 border rounded-lg p-3 mb-3">
                {chatMessages.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-12">Nessun messaggio</p>
                )}
                <div className="space-y-3">
                  {chatMessages.map(msg => (
                    <div key={msg.id} className={`flex ${msg.sender_type === 'superadmin' ? 'justify-end' : 'justify-start'}`}>
                      <div className={`max-w-[80%] rounded-xl px-3 py-2 text-sm ${msg.sender_type === 'superadmin' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}>
                        <p className="text-[10px] font-medium mb-0.5 opacity-70">
                          {msg.sender_type === 'superadmin' ? '👑 Empire' : '🏢 Cliente'}
                        </p>
                        <p>{msg.message}</p>
                        <p className="text-[9px] opacity-60 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              <div className="flex gap-2">
                <Input
                  placeholder="Rispondi al cliente..."
                  value={newMessage}
                  onChange={e => setNewMessage(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && handleSendMessage()}
                />
                <Button size="icon" onClick={handleSendMessage} disabled={!newMessage.trim()}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Lightbulb className="w-5 h-5 text-yellow-400" /> Richieste Funzioni
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {requests.length} richieste totali da tutti i tenant
        </p>
      </div>

      {/* Status counters */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-2">
        {Object.entries(STATUS_CONFIG).map(([key, cfg]) => {
          const Icon = cfg.icon;
          return (
            <button
              key={key}
              onClick={() => setFilterStatus(filterStatus === key ? "all" : key)}
              className={`p-3 rounded-xl border text-center transition-all ${filterStatus === key ? cfg.color + " border-current" : "bg-card border-border hover:border-primary/30"}`}
            >
              <Icon className="w-4 h-4 mx-auto mb-1" />
              <div className="text-lg font-bold">{statusCounts[key] || 0}</div>
              <div className="text-[10px] opacity-70">{cfg.label}</div>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      {sectors.length > 0 && (
        <div className="flex gap-2 flex-wrap">
          <Badge
            variant={filterSector === "all" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setFilterSector("all")}
          >
            Tutti i settori
          </Badge>
          {sectors.map(s => (
            <Badge
              key={s}
              variant={filterSector === s ? "default" : "outline"}
              className="cursor-pointer capitalize"
              onClick={() => setFilterSector(filterSector === s ? "all" : (s || "all"))}
            >
              {s}
            </Badge>
          ))}
        </div>
      )}

      {/* List */}
      {loading ? (
        <div className="space-y-3">
          {[1,2,3,4].map(i => <Skeleton key={i} className="h-20" />)}
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {filtered.map((req, i) => {
              const cfg = STATUS_CONFIG[req.status] || STATUS_CONFIG.new;
              const Icon = cfg.icon;
              return (
                <motion.div
                  key={req.id}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.03 }}
                >
                  <Card className="cursor-pointer hover:border-primary/40 transition-all group" onClick={() => openDetail(req)}>
                    <CardContent className="flex items-center gap-3 p-3">
                      <div className={`p-2 rounded-lg ${cfg.color}`}>
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <h3 className="font-semibold text-sm truncate">{req.title}</h3>
                          {req.priority === "urgent" && <Badge variant="destructive" className="text-[10px]">Urgente</Badge>}
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                          <Building2 className="w-3 h-3" />
                          <span>{req.companies?.name}</span>
                          <span>•</span>
                          <span className="capitalize">{req.companies?.industry}</span>
                          <span>•</span>
                          <span>{new Date(req.created_at).toLocaleDateString("it-IT")}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className={`text-[10px] ${cfg.color}`}>{cfg.label}</Badge>
                      <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </AnimatePresence>
          {filtered.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
              <Lightbulb className="w-12 h-12 mx-auto mb-3 opacity-30" />
              <p>Nessuna richiesta trovata</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
