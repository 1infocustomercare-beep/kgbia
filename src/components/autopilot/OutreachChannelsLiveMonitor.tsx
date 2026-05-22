// ══════════════════════════════════════════════════════════════
// OutreachChannelsLiveMonitor
// Card espandibile mostrata sotto i canali del cockpit Autopilot.
//
// Cosa mostra:
//  • Contatori per canale (oggi): inviati, schedulati, risposti, falliti
//  • Calendario settimanale (7 giorni × 4 fasce orarie) con count
//    di messaggi schedulati/inviati per cella
//  • Timeline live: messaggi inviati e prossimi schedulati con orario,
//    canale, destinatario, lead, stato e ANTEPRIMA testo
//  • Edit pre-invio: per messaggi ancora in stato "queued/scheduled"
//    permette di modificare subject + body prima della partenza
// ══════════════════════════════════════════════════════════════
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  MessageCircle,
  Phone,
  Send,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Reply,
  Pencil,
  ChevronDown,
  ChevronUp,
  Calendar,
  Activity,
  Loader2,
  Sparkles,
} from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";

// ── Types ──
type Touch = {
  id: string;
  lead_id: string;
  owner_id: string;
  channel: string;
  recipient: string | null;
  subject: string | null;
  body_text: string | null;
  status: string;
  scheduled_for: string | null;
  sent_at: string | null;
  opened_at: string | null;
  replied_at: string | null;
  error_message: string | null;
  created_at: string;
  touch_number: number;
  // joined
  lead_name?: string | null;
};

const CHANNEL_META: Record<
  string,
  { label: string; Icon: typeof Mail; color: string; bg: string }
> = {
  email: { label: "Email", Icon: Mail, color: "text-sky-500", bg: "bg-sky-500/10" },
  whatsapp: { label: "WhatsApp", Icon: Phone, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  whatsapp_link: { label: "WhatsApp", Icon: Phone, color: "text-emerald-500", bg: "bg-emerald-500/10" },
  chat: { label: "Chat", Icon: MessageCircle, color: "text-violet-500", bg: "bg-violet-500/10" },
  instagram: { label: "Instagram", Icon: MessageCircle, color: "text-pink-500", bg: "bg-pink-500/10" },
  sms: { label: "SMS", Icon: MessageCircle, color: "text-amber-500", bg: "bg-amber-500/10" },
};

function chMeta(ch: string) {
  return (
    CHANNEL_META[ch] || {
      label: ch,
      Icon: MessageCircle,
      color: "text-muted-foreground",
      bg: "bg-muted/40",
    }
  );
}

const STATUS_LABEL: Record<string, { label: string; cls: string; Icon: typeof Send }> = {
  queued: { label: "In coda", cls: "text-muted-foreground", Icon: Clock },
  scheduled: { label: "Schedulato", cls: "text-amber-500", Icon: Clock },
  sending: { label: "Invio…", cls: "text-sky-500", Icon: Loader2 },
  sent: { label: "Inviato", cls: "text-emerald-500", Icon: CheckCircle2 },
  delivered: { label: "Consegnato", cls: "text-emerald-500", Icon: CheckCircle2 },
  opened: { label: "Aperto", cls: "text-sky-500", Icon: Eye },
  replied: { label: "Ha risposto", cls: "text-violet-500", Icon: Reply },
  failed: { label: "Fallito", cls: "text-rose-500", Icon: XCircle },
  canceled: { label: "Annullato", cls: "text-muted-foreground", Icon: XCircle },
};

function fmtTime(iso: string | null | undefined) {
  if (!iso) return "—";
  return new Date(iso).toLocaleTimeString("it-IT", {
    timeZone: "Europe/Rome",
    hour: "2-digit",
    minute: "2-digit",
  });
}
function fmtRel(iso: string | null | undefined) {
  if (!iso) return "—";
  const diff = new Date(iso).getTime() - Date.now();
  const abs = Math.abs(diff);
  const min = Math.round(abs / 60_000);
  if (min < 1) return diff > 0 ? "tra pochi secondi" : "ora";
  if (min < 60) return diff > 0 ? `tra ${min} min` : `${min} min fa`;
  const h = Math.round(min / 60);
  if (h < 24) return diff > 0 ? `tra ${h}h` : `${h}h fa`;
  const d = Math.round(h / 24);
  return diff > 0 ? `tra ${d}g` : `${d}g fa`;
}
function dayKey(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString("it-IT", { timeZone: "Europe/Rome", weekday: "short", day: "2-digit" });
}
function slotOf(iso: string): "mattina" | "pranzo" | "pomeriggio" | "sera" {
  const h = parseInt(
    new Intl.DateTimeFormat("it-IT", {
      timeZone: "Europe/Rome",
      hour: "2-digit",
      hour12: false,
    }).format(new Date(iso)),
    10,
  );
  if (h < 12) return "mattina";
  if (h < 15) return "pranzo";
  if (h < 19) return "pomeriggio";
  return "sera";
}

const SLOT_ORDER: Array<"mattina" | "pranzo" | "pomeriggio" | "sera"> = [
  "mattina",
  "pranzo",
  "pomeriggio",
  "sera",
];

// ─────────────────────────────────────────────────────────
export function OutreachChannelsLiveMonitor() {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [expanded, setExpanded] = useState(true);
  const [editing, setEditing] = useState<Touch | null>(null);
  const [tab, setTab] = useState<"timeline" | "calendar" | "stats">("timeline");

  // Fetch touches from -3 days to +7 days schedulati
  const { data: touches = [], isLoading } = useQuery({
    queryKey: ["outreach-touches-monitor", user?.id],
    enabled: !!user?.id,
    refetchInterval: 20_000,
    queryFn: async (): Promise<Touch[]> => {
      const since = new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString();
      const until = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("lead_outreach_touches")
        .select(
          "id, lead_id, owner_id, channel, recipient, subject, body_text, status, scheduled_for, sent_at, opened_at, replied_at, error_message, created_at, touch_number",
        )
        .or(`created_at.gte.${since},scheduled_for.lte.${until}`)
        .order("created_at", { ascending: false })
        .limit(300);
      if (error) throw error;

      const list = (data || []) as Touch[];
      const ids = Array.from(new Set(list.map((t) => t.lead_id))).filter(Boolean);
      if (!ids.length) return list;

      const { data: leads } = await supabase
        .from("leads")
        .select("id, name")
        .in("id", ids);
      const map = new Map<string, string>();
      (leads || []).forEach((l: any) => map.set(l.id, l.name));
      return list.map((t) => ({ ...t, lead_name: map.get(t.lead_id) || "Lead" }));
    },
  });

  // Realtime updates
  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel("outreach-touches-monitor")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "lead_outreach_touches", filter: `owner_id=eq.${user.id}` },
        () => qc.invalidateQueries({ queryKey: ["outreach-touches-monitor", user.id] }),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id, qc]);

  // Stats per canale (oggi)
  const todayStats = useMemo(() => {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    const startISO = start.toISOString();
    const stats: Record<string, { sent: number; scheduled: number; replied: number; failed: number }> = {};
    for (const t of touches) {
      const key = (t.channel || "other").replace("whatsapp_link", "whatsapp");
      stats[key] ||= { sent: 0, scheduled: 0, replied: 0, failed: 0 };
      if (t.sent_at && t.sent_at >= startISO) stats[key].sent++;
      if ((t.status === "queued" || t.status === "scheduled") && t.scheduled_for && t.scheduled_for >= startISO)
        stats[key].scheduled++;
      if (t.replied_at && t.replied_at >= startISO) stats[key].replied++;
      if (t.status === "failed" && t.created_at >= startISO) stats[key].failed++;
    }
    return stats;
  }, [touches]);

  // Calendario settimanale (7 giorni × 4 slot)
  const calendar = useMemo(() => {
    const grid: Record<string, Record<string, number>> = {};
    const days: string[] = [];
    for (let i = 0; i < 7; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      const k = dayKey(d.toISOString());
      days.push(k);
      grid[k] = { mattina: 0, pranzo: 0, pomeriggio: 0, sera: 0 };
    }
    for (const t of touches) {
      const when = t.scheduled_for || t.sent_at;
      if (!when) continue;
      const k = dayKey(when);
      if (!grid[k]) continue;
      grid[k][slotOf(when)]++;
    }
    return { grid, days };
  }, [touches]);

  // Lista timeline ordinata: prima i prossimi schedulati, poi i recenti inviati
  const timeline = useMemo(() => {
    const upcoming = touches
      .filter((t) => (t.status === "queued" || t.status === "scheduled") && t.scheduled_for && new Date(t.scheduled_for) > new Date())
      .sort((a, b) => new Date(a.scheduled_for!).getTime() - new Date(b.scheduled_for!).getTime())
      .slice(0, 8);
    const past = touches
      .filter((t) => t.sent_at || t.status === "failed" || t.status === "replied")
      .sort((a, b) => new Date(b.sent_at || b.created_at).getTime() - new Date(a.sent_at || a.created_at).getTime())
      .slice(0, 12);
    return { upcoming, past };
  }, [touches]);

  // Edit mutation
  const updateTouch = useMutation({
    mutationFn: async (payload: { id: string; subject: string | null; body_text: string }) => {
      const { error } = await supabase
        .from("lead_outreach_touches")
        .update({ subject: payload.subject, body_text: payload.body_text })
        .eq("id", payload.id)
        .in("status", ["queued", "scheduled"]);
      if (error) throw error;
    },
    onSuccess: () => {
      toast.success("Messaggio aggiornato");
      qc.invalidateQueries({ queryKey: ["outreach-touches-monitor", user?.id] });
      setEditing(null);
    },
    onError: (e: any) =>
      toast.error("Modifica non riuscita", { description: e?.message || "Riprova" }),
  });

  return (
    <div className="rounded-xl border border-border/60 bg-card/40 backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full px-3 py-2.5 flex items-center justify-between hover:bg-muted/40 transition"
      >
        <div className="flex items-center gap-2">
          <Sparkles className="w-3.5 h-3.5 text-primary" />
          <span className="text-[11px] uppercase tracking-wider font-bold text-foreground">
            Attività live canali
          </span>
          <span className="text-[10px] text-muted-foreground">
            cosa Arianna sta inviando, a chi e quando
          </span>
        </div>
        {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-3 space-y-3 border-t border-border/60">
              {/* ── Stats per canale (oggi) ── */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {(["email", "whatsapp", "instagram", "chat"] as const).map((ch) => {
                  const m = chMeta(ch);
                  const s = todayStats[ch] || { sent: 0, scheduled: 0, replied: 0, failed: 0 };
                  return (
                    <div
                      key={ch}
                      className={`p-2.5 rounded-lg border border-border/60 ${m.bg}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <m.Icon className={`w-3.5 h-3.5 ${m.color}`} />
                          <span className="text-[11px] font-bold text-foreground">{m.label}</span>
                        </div>
                        <span className="text-[9px] uppercase text-muted-foreground">oggi</span>
                      </div>
                      <div className="mt-1.5 grid grid-cols-2 gap-1 text-[10px]">
                        <div className="flex items-center gap-1">
                          <Send className="w-2.5 h-2.5 text-emerald-500" />
                          <span className="font-bold text-foreground tabular-nums">{s.sent}</span>
                          <span className="text-muted-foreground">inviati</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-2.5 h-2.5 text-amber-500" />
                          <span className="font-bold text-foreground tabular-nums">{s.scheduled}</span>
                          <span className="text-muted-foreground">in coda</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Reply className="w-2.5 h-2.5 text-violet-500" />
                          <span className="font-bold text-foreground tabular-nums">{s.replied}</span>
                          <span className="text-muted-foreground">risp.</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <XCircle className="w-2.5 h-2.5 text-rose-500" />
                          <span className="font-bold text-foreground tabular-nums">{s.failed}</span>
                          <span className="text-muted-foreground">errori</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* ── Tabs ── */}
              <div className="flex gap-1 p-1 rounded-lg bg-muted/40 border border-border/60 w-fit">
                {[
                  { k: "timeline" as const, label: "Timeline live", Icon: Activity },
                  { k: "calendar" as const, label: "Calendario settimana", Icon: Calendar },
                  { k: "stats" as const, label: "Riepilogo", Icon: Sparkles },
                ].map((t) => (
                  <button
                    key={t.k}
                    type="button"
                    onClick={() => setTab(t.k)}
                    className={`px-2.5 py-1 rounded-md text-[10px] font-bold flex items-center gap-1 transition ${
                      tab === t.k
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <t.Icon className="w-3 h-3" />
                    {t.label}
                  </button>
                ))}
              </div>

              {/* ── TIMELINE ── */}
              {tab === "timeline" && (
                <div className="space-y-3">
                  {/* Prossimi schedulati */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-amber-500" /> Prossimi invii
                      <span className="text-muted-foreground/70 normal-case font-normal">
                        — clicca per modificare prima della partenza
                      </span>
                    </p>
                    {isLoading ? (
                      <p className="text-[11px] text-muted-foreground py-2 text-center">
                        <Loader2 className="w-3 h-3 inline animate-spin mr-1" /> Carico…
                      </p>
                    ) : timeline.upcoming.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground text-center py-3 border border-dashed border-border rounded-lg">
                        Nessun messaggio schedulato. Arianna sta cercando lead caldi a cui scrivere.
                      </p>
                    ) : (
                      <ul className="space-y-1">
                        {timeline.upcoming.map((t) => {
                          const m = chMeta(t.channel);
                          return (
                            <li key={t.id}>
                              <button
                                type="button"
                                onClick={() => setEditing(t)}
                                className="w-full text-left p-2 rounded-lg border border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition flex items-start gap-2"
                              >
                                <m.Icon className={`w-3.5 h-3.5 mt-0.5 ${m.color}`} />
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[11px] font-bold text-foreground">
                                      {fmtTime(t.scheduled_for)}
                                    </span>
                                    <span className="text-[9px] text-muted-foreground">
                                      ({fmtRel(t.scheduled_for)})
                                    </span>
                                    <Badge variant="outline" className="text-[9px] py-0 h-4 border-amber-500/40 text-amber-600">
                                      {m.label}
                                    </Badge>
                                    <span className="text-[10px] text-foreground truncate">
                                      → {t.lead_name}
                                    </span>
                                  </div>
                                  {t.subject && (
                                    <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                      <strong>Oggetto:</strong> {t.subject}
                                    </p>
                                  )}
                                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                                    {t.body_text || "(testo da generare al momento dell'invio)"}
                                  </p>
                                </div>
                                <Pencil className="w-3 h-3 text-amber-500 flex-shrink-0 mt-0.5" />
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  {/* Già inviati */}
                  <div>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-muted-foreground mb-1.5 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-500" /> Inviati di recente
                    </p>
                    {timeline.past.length === 0 ? (
                      <p className="text-[11px] text-muted-foreground text-center py-3 border border-dashed border-border rounded-lg">
                        Nessun messaggio inviato negli ultimi 3 giorni.
                      </p>
                    ) : (
                      <ul className="space-y-1 max-h-[260px] overflow-y-auto pr-1">
                        {timeline.past.map((t) => {
                          const m = chMeta(t.channel);
                          const st = STATUS_LABEL[t.status] || STATUS_LABEL.sent;
                          const StIcon = st.Icon;
                          return (
                            <li
                              key={t.id}
                              className="p-2 rounded-lg border border-border/40 bg-card flex items-start gap-2"
                            >
                              <m.Icon className={`w-3.5 h-3.5 mt-0.5 ${m.color}`} />
                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                  <span className="text-[11px] font-bold text-foreground tabular-nums">
                                    {fmtTime(t.sent_at || t.created_at)}
                                  </span>
                                  <Badge variant="outline" className="text-[9px] py-0 h-4">
                                    {m.label}
                                  </Badge>
                                  <span className="text-[10px] text-foreground truncate">
                                    → {t.lead_name}
                                  </span>
                                  <span className={`text-[10px] font-bold flex items-center gap-0.5 ml-auto ${st.cls}`}>
                                    <StIcon className="w-2.5 h-2.5" /> {st.label}
                                  </span>
                                </div>
                                {t.subject && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5 truncate">
                                    <strong>Oggetto:</strong> {t.subject}
                                  </p>
                                )}
                                {t.body_text && (
                                  <p className="text-[10px] text-muted-foreground mt-0.5 line-clamp-2">
                                    {t.body_text}
                                  </p>
                                )}
                                {t.error_message && (
                                  <p className="text-[10px] text-rose-500 mt-0.5">
                                    Errore: {t.error_message}
                                  </p>
                                )}
                                <div className="flex items-center gap-2 mt-1 text-[9px] text-muted-foreground">
                                  {t.opened_at && (
                                    <span className="flex items-center gap-0.5 text-sky-500">
                                      <Eye className="w-2.5 h-2.5" /> aperto {fmtRel(t.opened_at)}
                                    </span>
                                  )}
                                  {t.replied_at && (
                                    <span className="flex items-center gap-0.5 text-violet-500">
                                      <Reply className="w-2.5 h-2.5" /> ha risposto {fmtRel(t.replied_at)}
                                    </span>
                                  )}
                                  {t.recipient && (
                                    <span className="truncate">a: {t.recipient}</span>
                                  )}
                                </div>
                              </div>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              )}

              {/* ── CALENDARIO ── */}
              {tab === "calendar" && (
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px] border-collapse">
                    <thead>
                      <tr>
                        <th className="text-left p-1.5 text-muted-foreground font-bold uppercase tracking-wider">
                          Slot
                        </th>
                        {calendar.days.map((d) => (
                          <th
                            key={d}
                            className="p-1.5 text-center font-bold uppercase tracking-wider text-muted-foreground border-l border-border/40"
                          >
                            {d}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {SLOT_ORDER.map((slot) => (
                        <tr key={slot} className="border-t border-border/40">
                          <td className="p-1.5 font-bold text-foreground capitalize">
                            {slot === "mattina" && "🌅 Mattina"}
                            {slot === "pranzo" && "🍝 Pranzo"}
                            {slot === "pomeriggio" && "☀️ Pomeriggio"}
                            {slot === "sera" && "🌙 Sera"}
                          </td>
                          {calendar.days.map((d) => {
                            const n = calendar.grid[d]?.[slot] || 0;
                            return (
                              <td
                                key={d + slot}
                                className="p-1.5 text-center border-l border-border/40"
                              >
                                {n > 0 ? (
                                  <span
                                    className="inline-flex items-center justify-center min-w-[26px] h-6 px-1.5 rounded-md font-bold tabular-nums bg-primary/15 text-primary border border-primary/30"
                                    title={`${n} messaggi`}
                                  >
                                    {n}
                                  </span>
                                ) : (
                                  <span className="text-muted-foreground/75">·</span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    Numero messaggi schedulati o già inviati per fascia oraria. Aggiornato live.
                  </p>
                </div>
              )}

              {/* ── STATS ── */}
              {tab === "stats" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {(() => {
                    const total = touches.length;
                    const sent = touches.filter((t) => t.sent_at).length;
                    const replied = touches.filter((t) => t.replied_at).length;
                    const opened = touches.filter((t) => t.opened_at).length;
                    const failed = touches.filter((t) => t.status === "failed").length;
                    const rate = sent ? Math.round((replied / sent) * 100) : 0;
                    const openRate = sent ? Math.round((opened / sent) * 100) : 0;
                    const items = [
                      { label: "Inviati totali (10gg)", value: sent, sub: `${total} eventi tracciati` },
                      { label: "Tasso apertura", value: `${openRate}%`, sub: `${opened} aperti su ${sent}` },
                      { label: "Tasso risposta", value: `${rate}%`, sub: `${replied} risposte · ${failed} errori` },
                    ];
                    return items.map((it) => (
                      <div key={it.label} className="p-3 rounded-lg border border-border/60 bg-card">
                        <p className="text-[9px] uppercase tracking-wider text-muted-foreground">
                          {it.label}
                        </p>
                        <p className="text-xl font-bold text-foreground mt-1 tabular-nums">
                          {it.value}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{it.sub}</p>
                      </div>
                    ));
                  })()}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── EDIT DIALOG ── */}
      <Dialog open={!!editing} onOpenChange={(v) => !v && setEditing(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Pencil className="w-4 h-4 text-amber-500" />
              Modifica messaggio prima dell'invio
            </DialogTitle>
          </DialogHeader>
          {editing && (
            <EditTouchForm
              touch={editing}
              onCancel={() => setEditing(null)}
              onSave={(payload) => updateTouch.mutate(payload)}
              saving={updateTouch.isPending}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

// ── Form di modifica ──
function EditTouchForm({
  touch,
  onCancel,
  onSave,
  saving,
}: {
  touch: Touch;
  onCancel: () => void;
  onSave: (p: { id: string; subject: string | null; body_text: string }) => void;
  saving: boolean;
}) {
  const [subject, setSubject] = useState(touch.subject || "");
  const [body, setBody] = useState(touch.body_text || "");
  const m = chMeta(touch.channel);
  const isEmail = touch.channel === "email";

  return (
    <div className="space-y-3">
      <div className="p-2.5 rounded-lg bg-muted/40 border border-border/60 text-[11px]">
        <div className="flex items-center gap-2 flex-wrap">
          <m.Icon className={`w-3.5 h-3.5 ${m.color}`} />
          <span className="font-bold text-foreground">{m.label}</span>
          <span className="text-muted-foreground">→ {touch.lead_name}</span>
          {touch.recipient && (
            <span className="text-muted-foreground truncate">({touch.recipient})</span>
          )}
        </div>
        <p className="text-[10px] text-muted-foreground mt-1">
          Partirà alle <strong>{fmtTime(touch.scheduled_for)}</strong> ({fmtRel(touch.scheduled_for)}).
          Modifica e salva: la prossima esecuzione userà il testo aggiornato.
        </p>
      </div>

      {isEmail && (
        <div>
          <label className="text-[10px] uppercase font-bold text-muted-foreground">
            Oggetto email
          </label>
          <Input
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="Oggetto…"
            className="mt-1 text-sm"
          />
        </div>
      )}

      <div>
        <label className="text-[10px] uppercase font-bold text-muted-foreground">
          Testo messaggio
        </label>
        <Textarea
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={8}
          className="mt-1 text-sm font-mono"
          placeholder="Scrivi il messaggio…"
        />
        <p className="text-[10px] text-muted-foreground mt-1">
          {body.length} caratteri{" "}
          {touch.channel === "whatsapp" || touch.channel === "whatsapp_link"
            ? "· consigliato 200–500 per WhatsApp"
            : isEmail
              ? "· consigliato 600–1200 per email"
              : ""}
        </p>
      </div>

      <DialogFooter>
        <Button variant="ghost" onClick={onCancel} disabled={saving}>
          Annulla
        </Button>
        <Button
          onClick={() =>
            onSave({
              id: touch.id,
              subject: isEmail ? subject || null : null,
              body_text: body,
            })
          }
          disabled={saving || !body.trim()}
        >
          {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin mr-1" /> : null}
          Salva modifiche
        </Button>
      </DialogFooter>
    </div>
  );
}
