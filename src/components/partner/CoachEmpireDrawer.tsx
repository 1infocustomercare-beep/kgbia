import { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { HelpCircle, Sparkles, AlertTriangle, Zap, Keyboard, MessageCircle, Send, Loader2, BookOpen } from "lucide-react";
import { getCoachForRoute } from "@/data/sellerCoach";
import { toast } from "sonner";

interface ChatMsg { role: "user" | "assistant"; content: string }

export default function CoachEmpireDrawer() {
  const location = useLocation();
  const chapter = getCoachForRoute(location.pathname);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState("guida");
  const [chatMessages, setChatMessages] = useState<ChatMsg[]>([]);
  const [input, setInput] = useState("");
  const [isStreaming, setIsStreaming] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // reset chat su cambio pagina
    setChatMessages([]);
    setInput("");
  }, [chapter.routePrefix]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [chatMessages]);

  const sendChat = async () => {
    const text = input.trim();
    if (!text || isStreaming) return;
    const userMsg: ChatMsg = { role: "user", content: text };
    setChatMessages((p) => [...p, userMsg]);
    setInput("");
    setIsStreaming(true);

    try {
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/seller-coach-chat`;
      const resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
        body: JSON.stringify({
          messages: [...chatMessages, userMsg].map((m) => ({ role: m.role, content: m.content })),
          context: {
            title: chapter.title,
            whatItDoes: chapter.whatItDoes,
            bestPractices: chapter.bestPractices,
            pitfalls: chapter.pitfalls,
            automations: chapter.automations,
          },
        }),
      });

      if (resp.status === 429) { toast.error("Troppe richieste, attendi qualche secondo"); setIsStreaming(false); return; }
      if (resp.status === 402) { toast.error("Crediti AI esauriti"); setIsStreaming(false); return; }
      if (!resp.ok || !resp.body) { toast.error("Errore Coach AI"); setIsStreaming(false); return; }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";
      let acc = "";
      setChatMessages((p) => [...p, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });
        let idx;
        while ((idx = buffer.indexOf("\n")) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith("\r")) line = line.slice(0, -1);
          if (!line.startsWith("data: ")) continue;
          const json = line.slice(6).trim();
          if (json === "[DONE]") break;
          try {
            const parsed = JSON.parse(json);
            const delta = parsed.choices?.[0]?.delta?.content;
            if (delta) {
              acc += delta;
              setChatMessages((p) => p.map((m, i) => (i === p.length - 1 ? { ...m, content: acc } : m)));
            }
          } catch {
            buffer = line + "\n" + buffer;
            break;
          }
        }
      }
    } catch (e) {
      console.error(e);
      toast.error("Errore di connessione al Coach");
    } finally {
      setIsStreaming(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <button
          aria-label="Aiuto e Coach Empire"
          className="partner-coach-button h-10 w-10 rounded-full bg-primary/15 hover:bg-primary/25 backdrop-blur-xl border border-primary/30 flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-lg shadow-primary/10"
        >
          <HelpCircle className="h-4 w-4 text-primary" />
          <span className="absolute top-0.5 right-0.5 h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        </button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:max-w-md p-0 flex flex-col">
        <SheetHeader className="px-4 py-3 border-b shrink-0">
          <SheetTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <span>Coach Empire</span>
            <Badge variant="secondary" className="ml-auto text-xs">{chapter.title}</Badge>
          </SheetTitle>
          <p className="text-xs text-muted-foreground text-left">{chapter.subtitle}</p>
        </SheetHeader>

        <Tabs value={tab} onValueChange={setTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="grid grid-cols-3 mx-3 mt-3 shrink-0">
            <TabsTrigger value="guida" className="text-xs"><BookOpen className="h-3.5 w-3.5 mr-1" />Guida</TabsTrigger>
            <TabsTrigger value="boost" className="text-xs"><Zap className="h-3.5 w-3.5 mr-1" />Boost</TabsTrigger>
            <TabsTrigger value="chat" className="text-xs"><MessageCircle className="h-3.5 w-3.5 mr-1" />Arianna</TabsTrigger>
          </TabsList>

          <TabsContent value="guida" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full px-4 py-3">
              <div className="space-y-4 pb-6">
                <section>
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-1.5">Cosa fa questa pagina</h3>
                  <p className="text-sm leading-relaxed">{chapter.whatItDoes}</p>
                </section>
                <section>
                  <h3 className="text-xs uppercase tracking-wide text-emerald-600 dark:text-emerald-400 mb-1.5 flex items-center gap-1">
                    <Sparkles className="h-3.5 w-3.5" /> Best practice
                  </h3>
                  <ul className="space-y-1.5">
                    {chapter.bestPractices.map((b, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-emerald-500 shrink-0">✓</span><span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </section>
                <section>
                  <h3 className="text-xs uppercase tracking-wide text-amber-600 dark:text-amber-400 mb-1.5 flex items-center gap-1">
                    <AlertTriangle className="h-3.5 w-3.5" /> Errori da evitare
                  </h3>
                  <ul className="space-y-1.5">
                    {chapter.pitfalls.map((p, i) => (
                      <li key={i} className="text-sm flex gap-2">
                        <span className="text-amber-500 shrink-0">✕</span><span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="boost" className="flex-1 min-h-0 m-0">
            <ScrollArea className="h-full px-4 py-3">
              <div className="space-y-4 pb-6">
                <section>
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Zap className="h-3.5 w-3.5" /> Automazioni disponibili
                  </h3>
                  <div className="space-y-2">
                    {chapter.automations.map((a, i) => (
                      <div key={i} className="rounded-lg border bg-card p-3">
                        <p className="text-sm font-medium">{a.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{a.description}</p>
                      </div>
                    ))}
                  </div>
                </section>
                <section>
                  <h3 className="text-xs uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1">
                    <Keyboard className="h-3.5 w-3.5" /> Scorciatoie
                  </h3>
                  <div className="space-y-2">
                    {chapter.shortcuts.map((s, i) => (
                      <div key={i} className="rounded-lg bg-muted/40 p-2.5">
                        <p className="text-sm font-medium">{s.label}</p>
                        <p className="text-xs text-muted-foreground mt-0.5">{s.tip}</p>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="chat" className="flex-1 min-h-0 m-0 flex flex-col">
            <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
              {chatMessages.length === 0 && (
                <div className="text-center text-sm text-muted-foreground py-8">
                  <MessageCircle className="h-8 w-8 mx-auto mb-2 opacity-30" />
                  <p>Chiedi qualsiasi cosa su <strong>{chapter.title}</strong></p>
                  <div className="flex flex-wrap gap-1.5 justify-center mt-3">
                    {["Come miglioro la conversione?", "Qual è il prossimo passo?", "Mostrami un esempio"].map((q) => (
                      <button
                        key={q}
                        onClick={() => setInput(q)}
                        className="text-xs px-2.5 py-1 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {chatMessages.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap ${
                      m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                    }`}
                  >
                    {m.content || (isStreaming && <Loader2 className="h-3.5 w-3.5 animate-spin" />)}
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t p-3 shrink-0">
              <div className="flex gap-2">
                <Input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), sendChat())}
                  placeholder="Scrivi al Coach…"
                  disabled={isStreaming}
                  className="text-sm"
                />
                <Button onClick={sendChat} disabled={isStreaming || !input.trim()} size="icon">
                  {isStreaming ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-1.5 text-center">
                Coach AI contestuale — sa cosa stai guardando
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </SheetContent>
    </Sheet>
  );
}
