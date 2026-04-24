// ══════════════════════════════════════════════════════════════
// AutopilotConversations — Lista conversazioni AI in corso
// ══════════════════════════════════════════════════════════════
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, Send, Bot, User as UserIcon, Loader2, MessageCircle, Mail, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  useAutopilotConversations,
  useAutopilotMessages,
  useSendAutopilotMessage,
} from "@/hooks/useAutopilot";

const stageColor: Record<string, string> = {
  intro: "bg-blue-500/15 text-blue-500",
  discovery: "bg-purple-500/15 text-purple-500",
  pain_acknowledged: "bg-amber-500/15 text-amber-500",
  value_pitch: "bg-primary/15 text-primary",
  objection_handling: "bg-orange-500/15 text-orange-500",
  closing: "bg-emerald-500/15 text-emerald-500",
  closed_won: "bg-emerald-600/20 text-emerald-600",
  closed_lost: "bg-muted text-muted-foreground",
};

const channelIcon = (ch: string) =>
  ch === "email" ? <Mail className="w-3 h-3" /> :
  ch === "whatsapp_link" || ch === "whatsapp" ? <Smartphone className="w-3 h-3" /> :
  <MessageCircle className="w-3 h-3" />;

export default function AutopilotConversations() {
  const { data: convs = [], isLoading } = useAutopilotConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const [draft, setDraft] = useState("");
  const { data: messages = [] } = useAutopilotMessages(activeId);
  const send = useSendAutopilotMessage();

  const onSend = async () => {
    if (!activeId || !draft.trim()) return;
    try {
      await send.mutateAsync({ conversation_id: activeId, lead_message: draft.trim() });
      setDraft("");
    } catch {}
  };

  return (
    <div className="partner-card rounded-2xl p-5 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-xl bg-primary/15 flex items-center justify-center">
            <Bot className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-foreground">Conversazioni Arianna</h3>
            <p className="text-[10px] text-muted-foreground">Multi-canale · Auto-reply intelligente</p>
          </div>
        </div>
        <Badge variant="outline" className="text-[9px]">{convs.length} attive</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr] gap-3 min-h-[380px]">
        {/* ── Lista conversazioni ── */}
        <div className="space-y-1.5 max-h-[420px] overflow-y-auto">
          {isLoading ? (
            <div className="text-xs text-muted-foreground py-4 text-center">Caricamento…</div>
          ) : convs.length === 0 ? (
            <div className="text-xs text-muted-foreground py-6 text-center border border-dashed border-border rounded-xl">
              Nessuna conversazione attiva.
            </div>
          ) : (
            convs.map((c: any) => (
              <button
                key={c.id}
                onClick={() => setActiveId(c.id)}
                className={`w-full text-left p-2.5 rounded-xl border transition-all ${
                  activeId === c.id
                    ? "bg-primary/10 border-primary/40"
                    : "bg-card border-border/50 hover:border-primary/20"
                }`}
              >
                <div className="flex items-center justify-between gap-2 mb-1">
                  <span className="text-xs font-semibold text-foreground truncate">
                    {c.contact_name || c.contact_email || c.contact_phone || "Lead anonimo"}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    {channelIcon(c.channel)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${stageColor[c.funnel_stage] || "bg-muted text-muted-foreground"}`}>
                    {c.funnel_stage?.replace(/_/g, " ") || "—"}
                  </span>
                  {c.sentiment && (
                    <span className="text-[9px] text-muted-foreground">{c.sentiment}</span>
                  )}
                </div>
              </button>
            ))
          )}
        </div>

        {/* ── Pannello messaggi ── */}
        <div className="flex flex-col rounded-xl bg-card border border-border/50 min-h-[380px]">
          {!activeId ? (
            <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground p-6">
              <div className="text-center space-y-2">
                <MessageSquare className="w-8 h-8 mx-auto text-muted-foreground/40" />
                <p>Seleziona una conversazione per vedere i messaggi</p>
              </div>
            </div>
          ) : (
            <>
              <div className="flex-1 overflow-y-auto p-3 space-y-2 max-h-[340px]">
                <AnimatePresence initial={false}>
                  {messages.map((m: any) => (
                    <motion.div
                      key={m.id}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex gap-2 ${m.sender === "ai" ? "justify-start" : "justify-end"}`}
                    >
                      {m.sender === "ai" && (
                        <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                          <Bot className="w-3 h-3 text-primary" />
                        </div>
                      )}
                      <div
                        className={`max-w-[75%] rounded-2xl px-3 py-2 text-xs ${
                          m.sender === "ai"
                            ? "bg-primary/10 text-foreground"
                            : "bg-foreground/90 text-background"
                        }`}
                      >
                        {m.content}
                      </div>
                      {m.sender !== "ai" && (
                        <div className="w-6 h-6 rounded-full bg-muted flex items-center justify-center flex-shrink-0">
                          <UserIcon className="w-3 h-3" />
                        </div>
                      )}
                    </motion.div>
                  ))}
                </AnimatePresence>
                {messages.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-6">
                    Nessun messaggio. Scrivi per iniziare.
                  </div>
                )}
              </div>
              <div className="p-2 border-t border-border/40 flex gap-2">
                <Input
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && onSend()}
                  placeholder="Simula risposta lead…"
                  className="h-9 text-xs"
                />
                <Button size="sm" onClick={onSend} disabled={send.isPending || !draft.trim()} className="h-9">
                  {send.isPending ? <Loader2 className="w-3 h-3 animate-spin" /> : <Send className="w-3 h-3" />}
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
