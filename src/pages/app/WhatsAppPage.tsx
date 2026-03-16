// ══════════════════════════════════════════════════════════════
// Empire WhatsApp Orchestrator — Dashboard Page
// ══════════════════════════════════════════════════════════════
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  MessageCircle, Send, Bot, Settings, Bell, Archive,
  Phone, User, Clock, CheckCheck, Check, X, Sparkles,
  AlertCircle, Shield,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  useWhatsAppConfig,
  useSaveWhatsAppConfig,
  useWhatsAppConversations,
  useWhatsAppMessages,
  useSendWhatsAppMessage,
  useWhatsAppAISuggestion,
  useWhatsAppNotifications,
  useWhatsAppRealtime,
} from "@/hooks/useWhatsApp";
import type { WhatsAppConversation, WhatsAppMessage } from "@/types/whatsapp";

// ── Status icon helper ──
function MessageStatusIcon({ status }: { status: string }) {
  switch (status) {
    case "read":
      return <CheckCheck className="w-3 h-3 text-blue-500" />;
    case "delivered":
      return <CheckCheck className="w-3 h-3 text-muted-foreground" />;
    case "sent":
      return <Check className="w-3 h-3 text-muted-foreground" />;
    case "failed":
      return <X className="w-3 h-3 text-destructive" />;
    default:
      return <Clock className="w-3 h-3 text-muted-foreground" />;
  }
}

// ── Conversation list item ──
function ConversationItem({
  conv,
  isActive,
  onClick,
}: {
  conv: WhatsAppConversation;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors",
        isActive ? "bg-primary/10 border border-primary/20" : "hover:bg-muted/50",
      )}
    >
      <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center flex-shrink-0">
        <User className="w-5 h-5 text-[#25D366]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span className="font-medium text-sm truncate">
            {conv.contact_name || conv.contact_phone}
          </span>
          {conv.last_message_at && (
            <span className="text-xs text-muted-foreground flex-shrink-0">
              {new Date(conv.last_message_at).toLocaleTimeString("it-IT", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <Badge variant="outline" className="text-[10px] px-1 py-0">
            {conv.sector}
          </Badge>
          <Badge
            variant={conv.status === "active" ? "default" : "secondary"}
            className="text-[10px] px-1 py-0"
          >
            {conv.status}
          </Badge>
        </div>
      </div>
    </button>
  );
}

// ── Chat bubble ──
function ChatBubble({ msg }: { msg: WhatsAppMessage }) {
  const isOutbound = msg.direction === "outbound";
  return (
    <div className={cn("flex", isOutbound ? "justify-end" : "justify-start")}>
      <div
        className={cn(
          "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
          isOutbound
            ? "bg-[#DCF8C6] text-foreground rounded-br-sm"
            : "bg-card border rounded-bl-sm",
        )}
      >
        <p className="whitespace-pre-wrap break-words">{msg.content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-[10px] text-muted-foreground">
            {new Date(msg.created_at).toLocaleTimeString("it-IT", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {isOutbound && <MessageStatusIcon status={msg.status} />}
        </div>
      </div>
    </div>
  );
}

// ══════════════════════════════════════════════════════════════
// Main Page Component
// ══════════════════════════════════════════════════════════════
export default function WhatsAppPage() {
  const [activeTab, setActiveTab] = useState("chat");
  const [selectedConvId, setSelectedConvId] = useState<string | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [aiSuggestion, setAiSuggestion] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { data: config, isLoading: configLoading } = useWhatsAppConfig();
  const saveConfig = useSaveWhatsAppConfig();
  const { data: conversations = [], isLoading: convsLoading } = useWhatsAppConversations();
  const { data: messages = [], isLoading: msgsLoading } = useWhatsAppMessages(selectedConvId);
  const sendMessage = useSendWhatsAppMessage();
  const aiSuggest = useWhatsAppAISuggestion();
  const { data: notifications = [] } = useWhatsAppNotifications();

  // Realtime
  useWhatsAppRealtime(selectedConvId);

  const selectedConv = conversations.find((c) => c.id === selectedConvId) || null;

  // Auto-scroll
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // ── Handlers ──
  const handleSend = async () => {
    if (!messageInput.trim() || !selectedConvId) return;
    const text = messageInput.trim();
    setMessageInput("");
    try {
      await sendMessage.mutateAsync({ conversationId: selectedConvId, content: text });
    } catch {
      toast.error("Errore invio messaggio");
    }
  };

  const handleAISuggest = async () => {
    if (!selectedConvId) return;
    const lastInbound = [...messages].reverse().find((m) => m.direction === "inbound");
    if (!lastInbound) {
      toast.info("Nessun messaggio cliente a cui rispondere");
      return;
    }
    try {
      const suggestion = await aiSuggest.mutateAsync({
        conversationId: selectedConvId,
        userMessage: lastInbound.content,
      });
      setAiSuggestion(suggestion || "");
      if (suggestion) setMessageInput(suggestion);
    } catch {
      toast.error("Errore generazione suggerimento AI");
    }
  };

  // ── Config form state ──
  const [configForm, setConfigForm] = useState({
    phone_number_id: "",
    whatsapp_business_account_id: "",
    access_token: "",
    is_active: true,
  });

  useEffect(() => {
    if (config) {
      setConfigForm({
        phone_number_id: config.phone_number_id || "",
        whatsapp_business_account_id: config.whatsapp_business_account_id || "",
        access_token: config.access_token || "",
        is_active: config.is_active,
      });
    }
  }, [config]);

  const handleSaveConfig = async () => {
    try {
      await saveConfig.mutateAsync(configForm);
      toast.success("Configurazione WhatsApp salvata!");
    } catch {
      toast.error("Errore salvataggio configurazione");
    }
  };

  const isConfigured = !!config?.phone_number_id && !!config?.access_token;

  return (
    <div className="space-y-4 pb-24">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-[#25D366]/15 flex items-center justify-center">
          <MessageCircle className="w-5 h-5 text-[#25D366]" />
        </div>
        <div>
          <h1 className="text-xl font-bold">WhatsApp Business</h1>
          <p className="text-xs text-muted-foreground">
            Gestisci conversazioni, notifiche e AI auto-reply
          </p>
        </div>
        {isConfigured && (
          <Badge className="ml-auto bg-[#25D366]/15 text-[#25D366] border-[#25D366]/30">
            Connesso
          </Badge>
        )}
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="w-full">
          <TabsTrigger value="chat" className="flex-1 gap-1">
            <MessageCircle className="w-3.5 h-3.5" /> Chat
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex-1 gap-1">
            <Bell className="w-3.5 h-3.5" /> Notifiche
          </TabsTrigger>
          <TabsTrigger value="settings" className="flex-1 gap-1">
            <Settings className="w-3.5 h-3.5" /> Config
          </TabsTrigger>
        </TabsList>

        {/* ════ CHAT TAB ════ */}
        <TabsContent value="chat" className="mt-3">
          {!isConfigured ? (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <AlertCircle className="w-12 h-12 text-muted-foreground mb-3" />
                <h3 className="font-semibold text-lg">WhatsApp non configurato</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-sm">
                  Vai nella tab &quot;Config&quot; per collegare il tuo account WhatsApp Business.
                </p>
                <Button className="mt-4" onClick={() => setActiveTab("settings")}>
                  <Settings className="w-4 h-4 mr-2" /> Configura ora
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-[300px_1fr] gap-3 min-h-[60vh]">
              {/* Conversation list */}
              <Card className="overflow-hidden">
                <CardHeader className="py-3 px-3">
                  <CardTitle className="text-sm flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Conversazioni
                    <Badge variant="secondary" className="ml-auto text-xs">
                      {conversations.length}
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <ScrollArea className="h-[55vh]">
                  <div className="px-2 pb-2 space-y-1">
                    {convsLoading ? (
                      Array.from({ length: 4 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 rounded-lg" />
                      ))
                    ) : conversations.length === 0 ? (
                      <p className="text-sm text-muted-foreground text-center py-8">
                        Nessuna conversazione
                      </p>
                    ) : (
                      conversations.map((conv) => (
                        <ConversationItem
                          key={conv.id}
                          conv={conv}
                          isActive={selectedConvId === conv.id}
                          onClick={() => setSelectedConvId(conv.id)}
                        />
                      ))
                    )}
                  </div>
                </ScrollArea>
              </Card>

              {/* Chat view */}
              <Card className="flex flex-col overflow-hidden">
                {!selectedConv ? (
                  <div className="flex-1 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <MessageCircle className="w-12 h-12 mx-auto mb-2 opacity-30" />
                      <p className="text-sm">Seleziona una conversazione</p>
                    </div>
                  </div>
                ) : (
                  <>
                    {/* Chat header */}
                    <div className="flex items-center gap-3 p-3 border-b">
                      <div className="w-8 h-8 rounded-full bg-[#25D366]/15 flex items-center justify-center">
                        <User className="w-4 h-4 text-[#25D366]" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm truncate">
                          {selectedConv.contact_name || selectedConv.contact_phone}
                        </p>
                        <p className="text-xs text-muted-foreground">{selectedConv.contact_phone}</p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {selectedConv.sector}
                      </Badge>
                    </div>

                    {/* Messages */}
                    <ScrollArea className="flex-1 p-3">
                      <div className="space-y-2">
                        {msgsLoading ? (
                          Array.from({ length: 3 }).map((_, i) => (
                            <Skeleton key={i} className="h-12 rounded-lg" />
                          ))
                        ) : messages.length === 0 ? (
                          <p className="text-center text-sm text-muted-foreground py-8">
                            Nessun messaggio
                          </p>
                        ) : (
                          messages.map((msg) => <ChatBubble key={msg.id} msg={msg} />)
                        )}
                        <div ref={messagesEndRef} />
                      </div>
                    </ScrollArea>

                    {/* AI suggestion bar */}
                    {aiSuggestion && (
                      <div className="mx-3 mb-1 p-2 rounded-lg bg-primary/5 border border-primary/20 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <p className="text-xs flex-1">{aiSuggestion}</p>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="h-6 px-2 text-xs"
                          onClick={() => {
                            setMessageInput(aiSuggestion);
                            setAiSuggestion("");
                          }}
                        >
                          Usa
                        </Button>
                      </div>
                    )}

                    {/* Input */}
                    <div className="p-3 border-t flex items-center gap-2">
                      <Button
                        size="icon"
                        variant="ghost"
                        onClick={handleAISuggest}
                        disabled={aiSuggest.isPending}
                        title="Suggerimento AI"
                      >
                        <Bot className={cn("w-4 h-4", aiSuggest.isPending && "animate-spin")} />
                      </Button>
                      <Input
                        value={messageInput}
                        onChange={(e) => setMessageInput(e.target.value)}
                        placeholder="Scrivi un messaggio..."
                        className="flex-1"
                        onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
                      />
                      <Button
                        size="icon"
                        onClick={handleSend}
                        disabled={!messageInput.trim() || sendMessage.isPending}
                        className="bg-[#25D366] hover:bg-[#1da851]"
                      >
                        <Send className="w-4 h-4 text-white" />
                      </Button>
                    </div>
                  </>
                )}
              </Card>
            </div>
          )}
        </TabsContent>

        {/* ════ NOTIFICATIONS TAB ════ */}
        <TabsContent value="notifications" className="mt-3 space-y-3">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Bell className="w-4 h-4" /> Notifiche Recenti
              </CardTitle>
            </CardHeader>
            <CardContent>
              {notifications.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-6">
                  Nessuna notifica inviata
                </p>
              ) : (
                <div className="space-y-2">
                  {notifications.map((n: any) => (
                    <div key={n.id} className="flex items-center gap-3 p-2 rounded-lg border">
                      <Badge
                        variant={
                          n.status === "delivered"
                            ? "default"
                            : n.status === "failed"
                            ? "destructive"
                            : "secondary"
                        }
                        className="text-xs"
                      >
                        {n.status}
                      </Badge>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{n.recipient_phone}</p>
                        <p className="text-xs text-muted-foreground">{n.notification_type}</p>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(n.created_at).toLocaleDateString("it-IT")}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ════ SETTINGS TAB ════ */}
        <TabsContent value="settings" className="mt-3 space-y-4">
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Shield className="w-4 h-4" /> Configurazione WhatsApp Cloud API
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {configLoading ? (
                <div className="space-y-3">
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                  <Skeleton className="h-10" />
                </div>
              ) : (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone_number_id">Phone Number ID</Label>
                    <Input
                      id="phone_number_id"
                      value={configForm.phone_number_id}
                      onChange={(e) =>
                        setConfigForm((p) => ({ ...p, phone_number_id: e.target.value }))
                      }
                      placeholder="Es. 123456789012345"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="waba_id">WhatsApp Business Account ID</Label>
                    <Input
                      id="waba_id"
                      value={configForm.whatsapp_business_account_id}
                      onChange={(e) =>
                        setConfigForm((p) => ({
                          ...p,
                          whatsapp_business_account_id: e.target.value,
                        }))
                      }
                      placeholder="Es. 987654321098765"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="access_token">Access Token (permanente)</Label>
                    <Input
                      id="access_token"
                      type="password"
                      value={configForm.access_token}
                      onChange={(e) =>
                        setConfigForm((p) => ({ ...p, access_token: e.target.value }))
                      }
                      placeholder="EAAx..."
                    />
                  </div>
                  <div className="flex items-center gap-3">
                    <Switch
                      checked={configForm.is_active}
                      onCheckedChange={(v) => setConfigForm((p) => ({ ...p, is_active: v }))}
                    />
                    <Label>Attivo</Label>
                  </div>

                  {config?.webhook_verify_token && (
                    <div className="p-3 rounded-lg bg-muted/50 space-y-1">
                      <p className="text-xs font-medium">Webhook Verify Token</p>
                      <code className="text-xs break-all select-all">
                        {config.webhook_verify_token}
                      </code>
                      <p className="text-[10px] text-muted-foreground">
                        Usa questo token nella configurazione webhook di Meta
                      </p>
                    </div>
                  )}

                  <Button
                    onClick={handleSaveConfig}
                    disabled={saveConfig.isPending}
                    className="w-full"
                  >
                    {saveConfig.isPending ? "Salvataggio..." : "Salva Configurazione"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Webhook URL info */}
          <Card>
            <CardHeader className="py-3">
              <CardTitle className="text-sm">URL Webhook</CardTitle>
            </CardHeader>
            <CardContent>
              <code className="text-xs break-all select-all block p-2 rounded bg-muted">
                {`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/whatsapp-webhook`}
              </code>
              <p className="text-[10px] text-muted-foreground mt-2">
                Configura questo URL come Callback URL nel pannello Meta Developer → WhatsApp → Configurazione
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
