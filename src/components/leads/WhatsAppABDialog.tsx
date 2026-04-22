// WhatsAppABDialog — crea due varianti A/B di un messaggio WhatsApp per un lead.
// Genera due short link tracciabili (via edge function `wa-track`) che si possono inviare
// in canali diversi o in momenti diversi. Mostra in tempo reale clic e risposte per variante.
//
// Workflow:
//  1. Compila messaggio A e B (template default basato sul lead)
//  2. Crea test → backend genera due short_id univoci
//  3. Copia/condividi i due link → ogni clic incrementa il counter di quella variante
//  4. Quando il lead risponde, l'utente preme "Risposta A" o "Risposta B" → counter replies
//  5. Vincitore auto-assegnato quando una variante ha 2+ replies in più dell'altra
//
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  X, Copy, MessageCircle, Loader2, Trophy, MousePointerClick,
  CheckCircle2, RefreshCw, Sparkles, FlaskConical, Send, Trash2,
  Link2,
} from "lucide-react";
import { getSectorCTA, buildCTADemoUrl } from "@/lib/sector-cta";
import {
  detectWALang, localizeCTA, buildTemplateA, buildTemplateB,
  WA_LANGS, UI_LABELS, type WALang,
} from "@/lib/wa-i18n";

export interface ABLeadInput {
  id?: string;
  name: string;
  phone?: string | null;
  city?: string | null;
  sector?: string | null;
  /** Lingua preferita del lead (it/en/es/fr/de o stringa libera) */
  language?: string | null;
}

interface ABTest {
  id: string;
  lead_name: string;
  lead_phone: string | null;
  variant_a_label: string;
  variant_a_message: string;
  variant_a_short_id: string;
  variant_a_clicks: number;
  variant_a_replies: number;
  variant_a_first_clicked_at: string | null;
  variant_b_label: string;
  variant_b_message: string;
  variant_b_short_id: string;
  variant_b_clicks: number;
  variant_b_replies: number;
  variant_b_first_clicked_at: string | null;
  status: string;
  winner: string | null;
  created_at: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  lead: ABLeadInput;
  /** Link demo (opzionale) per pre-compilare i messaggi */
  demoLink?: string;
}

/* Funzione URL tracker pubblico — usa lo stesso project ref del client */
function buildTrackUrl(shortId: string): string {
  const projectRef = (import.meta as any).env?.VITE_SUPABASE_PROJECT_ID || "gypnxirzmhpapmhjguaj";
  return `https://${projectRef}.supabase.co/functions/v1/wa-track?s=${shortId}`;
}

export default function WhatsAppABDialog({ open, onClose, lead, demoLink: demoLinkProp }: Props) {
  const baseDemoLink = demoLinkProp || `${window.location.origin}/demo`;
  const sectorCTA = useMemo(() => getSectorCTA(lead.sector), [lead.sector]);
  const ctaDemoUrl = useMemo(() => buildCTADemoUrl(baseDemoLink, lead.sector), [baseDemoLink, lead.sector]);

  /* ── Auto-detect lingua del messaggio (lead → city → browser → IT) ── */
  const detected = useMemo(
    () => detectWALang({ preferredLang: lead.language, city: lead.city }),
    [lead.language, lead.city]
  );
  const [lang, setLang] = useState<WALang>(detected.lang);
  const [langSource, setLangSource] = useState<typeof detected.source>(detected.source);
  const localizedCTA = useMemo(() => localizeCTA(sectorCTA, lang), [sectorCTA, lang]);

  // Helper per costruire i template nella lingua corrente
  const buildA = (l: WALang = lang) => buildTemplateA(l, {
    name: lead.name, sector: lead.sector, ctaUrl: ctaDemoUrl,
    ctaLabel: localizeCTA(sectorCTA, l).label, emoji: sectorCTA.emoji,
  });
  const buildB = (l: WALang = lang) => buildTemplateB(l, {
    name: lead.name, sector: lead.sector, ctaUrl: ctaDemoUrl,
    ctaLabel: localizeCTA(sectorCTA, l).label, emoji: sectorCTA.emoji,
  });

  const [test, setTest] = useState<ABTest | null>(null);
  const [msgA, setMsgA] = useState(() => buildA(detected.lang));
  const [msgB, setMsgB] = useState(() => buildB(detected.lang));
  const [loading, setLoading] = useState(false);
  const [creating, setCreating] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  /* Quando l'utente cambia lingua dal selector → rigenera i template */
  const changeLang = (next: WALang) => {
    setLang(next);
    setLangSource("lead");
    setMsgA(buildA(next));
    setMsgB(buildB(next));
  };

  /* Cerca test esistente per questo lead */
  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    (async () => {
      setLoading(true);
      try {
        const { data: u } = await supabase.auth.getUser();
        if (!u?.user) return;
        let q = (supabase.from("lead_whatsapp_ab_tests" as any) as any)
          .select("*")
          .eq("owner_id", u.user.id)
          .order("created_at", { ascending: false })
          .limit(1);
        if (lead.id) q = q.eq("lead_id", lead.id);
        else q = q.ilike("lead_name", lead.name);

        const { data } = await q.maybeSingle();
        if (!cancelled && data) setTest(data as any);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [open, lead.id, lead.name]);

  const refresh = async () => {
    if (!test) return;
    setRefreshing(true);
    try {
      const { data } = await (supabase.from("lead_whatsapp_ab_tests" as any) as any)
        .select("*").eq("id", test.id).maybeSingle();
      if (data) setTest(data as any);
    } finally {
      setRefreshing(false);
    }
  };

  const createTest = async () => {
    if (!msgA.trim() || !msgB.trim()) {
      toast.error("Compila entrambe le varianti");
      return;
    }
    if (msgA.trim() === msgB.trim()) {
      toast.error("Le due varianti devono essere diverse per il test A/B");
      return;
    }
    setCreating(true);
    try {
      const { data: u } = await supabase.auth.getUser();
      if (!u?.user) { toast.error("Sessione scaduta"); return; }
      const { data, error } = await (supabase.from("lead_whatsapp_ab_tests" as any) as any).insert({
        owner_id: u.user.id,
        lead_id: lead.id || null,
        lead_name: lead.name,
        lead_phone: lead.phone || null,
        variant_a_message: msgA.trim(),
        variant_b_message: msgB.trim(),
      }).select().single();
      if (error) throw error;
      setTest(data as any);
      toast.success("Test A/B creato! Copia i due link e iniziamo");
    } catch (e: any) {
      toast.error(e.message || "Errore creazione test");
    } finally {
      setCreating(false);
    }
  };

  const deleteTest = async () => {
    if (!test) return;
    if (!confirm("Eliminare questo test A/B? I dati di tracking andranno persi.")) return;
    const { error } = await (supabase.from("lead_whatsapp_ab_tests" as any) as any)
      .delete().eq("id", test.id);
    if (error) { toast.error(error.message); return; }
    setTest(null);
    toast.success("Test eliminato");
  };

  const markReply = async (variant: "A" | "B") => {
    if (!test) return;
    const { error } = await supabase.rpc("mark_wa_ab_reply" as any, {
      p_test_id: test.id, p_variant: variant,
    });
    if (error) { toast.error(error.message); return; }
    toast.success(`Risposta variante ${variant} registrata 📬`);
    await refresh();
  };

  const copyLink = (shortId: string, label: string) => {
    const url = buildTrackUrl(shortId);
    navigator.clipboard.writeText(url);
    toast.success(`Link variante ${label} copiato ✨`);
  };

  const openWa = (shortId: string) => {
    window.open(buildTrackUrl(shortId), "_blank");
  };

  const stats = useMemo(() => {
    if (!test) return null;
    const totalClicks = test.variant_a_clicks + test.variant_b_clicks;
    const totalReplies = test.variant_a_replies + test.variant_b_replies;
    const aClickPct = totalClicks > 0 ? Math.round((test.variant_a_clicks / totalClicks) * 100) : 50;
    const bClickPct = 100 - aClickPct;
    const aReplyRate = test.variant_a_clicks > 0
      ? Math.round((test.variant_a_replies / test.variant_a_clicks) * 100) : 0;
    const bReplyRate = test.variant_b_clicks > 0
      ? Math.round((test.variant_b_replies / test.variant_b_clicks) * 100) : 0;
    return { totalClicks, totalReplies, aClickPct, bClickPct, aReplyRate, bReplyRate };
  }, [test]);

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center p-2 sm:p-4"
        style={{ background: "rgba(0,0,0,0.75)", backdropFilter: "blur(8px)" }}
        onClick={onClose}
      >
        <motion.div
          initial={{ y: 40, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 40, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="w-full max-w-2xl rounded-2xl overflow-hidden flex flex-col"
          style={{
            maxHeight: "92vh",
            background: "linear-gradient(180deg, #0d1224 0%, #11141a 100%)",
            border: "1px solid rgba(124,58,237,0.4)",
            boxShadow: "0 30px 80px rgba(0,0,0,0.6), 0 0 60px rgba(37,211,102,0.15)",
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.08)" }}>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #25D366, #7c3aed)" }}>
                <FlaskConical className="w-4 h-4 text-white" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">Test A/B WhatsApp</h2>
                <p className="text-[10px] text-white/60">{lead.name}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/10">
              <X className="w-4 h-4 text-white" />
            </button>
          </div>

          {/* Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-5 h-5 text-violet-400 animate-spin" />
              </div>
            ) : test ? (
              /* ═══ Test attivo: mostra stats + link ═══ */
              <>
                {/* Riepilogo */}
                <div className="grid grid-cols-3 gap-2">
                  <StatBox label="Click totali" value={stats!.totalClicks} icon={<MousePointerClick className="w-3 h-3" />} color="#60a5fa" />
                  <StatBox label="Risposte" value={stats!.totalReplies} icon={<MessageCircle className="w-3 h-3" />} color="#25D366" />
                  <StatBox
                    label="Vincitore"
                    value={test.winner ? `Var ${test.winner}` : "—"}
                    icon={<Trophy className="w-3 h-3" />}
                    color={test.winner ? "#fbbf24" : "#6b7280"}
                  />
                </div>

                {/* Variante A */}
                <VariantPanel
                  label="A"
                  message={test.variant_a_message}
                  clicks={test.variant_a_clicks}
                  replies={test.variant_a_replies}
                  clickPct={stats!.aClickPct}
                  replyRate={stats!.aReplyRate}
                  shortId={test.variant_a_short_id}
                  isWinner={test.winner === "A"}
                  accent="#7c3aed"
                  onCopy={() => copyLink(test.variant_a_short_id, "A")}
                  onOpen={() => openWa(test.variant_a_short_id)}
                  onMarkReply={() => markReply("A")}
                />

                {/* Variante B */}
                <VariantPanel
                  label="B"
                  message={test.variant_b_message}
                  clicks={test.variant_b_clicks}
                  replies={test.variant_b_replies}
                  clickPct={stats!.bClickPct}
                  replyRate={stats!.bReplyRate}
                  shortId={test.variant_b_short_id}
                  isWinner={test.winner === "B"}
                  accent="#ec4899"
                  onCopy={() => copyLink(test.variant_b_short_id, "B")}
                  onOpen={() => openWa(test.variant_b_short_id)}
                  onMarkReply={() => markReply("B")}
                />

                {/* Footer actions */}
                <div className="flex items-center justify-between pt-2"
                  style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
                  <button onClick={refresh} disabled={refreshing}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-white/70 hover:text-white hover:bg-white/5">
                    <RefreshCw className={`w-3 h-3 ${refreshing ? "animate-spin" : ""}`} />
                    Aggiorna stats
                  </button>
                  <button onClick={deleteTest}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-bold text-rose-300 hover:bg-rose-500/15">
                    <Trash2 className="w-3 h-3" />
                    Elimina test
                  </button>
                </div>
              </>
            ) : (
              /* ═══ Nessun test: form di creazione ═══ */
              <>
                <div className="rounded-xl p-3 text-[11px] text-white/80"
                  style={{ background: "rgba(124,58,237,0.12)", border: "1px solid rgba(124,58,237,0.3)" }}>
                  <div className="flex items-center gap-1.5 mb-1 font-bold text-violet-200">
                    <Sparkles className="w-3.5 h-3.5" />
                    Come funziona il test A/B
                  </div>
                  Scrivi due versioni del messaggio. Ricevi due link tracciati: ogni clic conta separatamente.
                  Quando il lead risponde, segnala quale variante ha funzionato. Il vincitore viene scelto automaticamente.
                </div>

                {/* CTA settoriale rilevato — link diretto alla sezione di conversione */}
                <div className="rounded-xl p-3 flex items-start gap-3"
                  style={{ background: "rgba(37,211,102,0.10)", border: "1px solid rgba(37,211,102,0.35)" }}>
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                    style={{ background: "rgba(37,211,102,0.2)" }}>
                    {sectorCTA.emoji}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Link2 className="w-3 h-3 text-emerald-300" />
                      <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200">
                        CTA settoriale rilevato
                      </span>
                    </div>
                    <div className="text-[11px] text-white font-semibold mb-1">
                      {sectorCTA.label} · sezione <code className="text-emerald-300">#{sectorCTA.anchor}</code>
                    </div>
                    <div className="text-[10px] text-white/60 truncate" title={ctaDemoUrl}>
                      {ctaDemoUrl}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard.writeText(ctaDemoUrl);
                          toast.success("Link CTA copiato ✨");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold text-emerald-100 hover:bg-emerald-500/20"
                        style={{ border: "1px solid rgba(37,211,102,0.4)" }}
                      >
                        <Copy className="w-3 h-3" /> Copia link CTA
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setMsgA(defaultMessageA(lead, ctaDemoUrl, sectorCTA.label, sectorCTA.emoji));
                          setMsgB(defaultMessageB(lead, ctaDemoUrl, sectorCTA.label, sectorCTA.emoji));
                          toast.success("Template aggiornati con il CTA");
                        }}
                        className="flex items-center gap-1 px-2.5 py-1 rounded-md text-[10px] font-bold text-white/80 hover:bg-white/10"
                        style={{ border: "1px solid rgba(255,255,255,0.15)" }}
                      >
                        <RefreshCw className="w-3 h-3" /> Reimposta template
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-violet-300 block mb-1.5">
                    Variante A — diretta
                  </label>
                  <textarea
                    value={msgA} onChange={(e) => setMsgA(e.target.value)}
                    rows={6}
                    className="w-full rounded-xl px-3 py-2.5 text-xs text-white resize-none"
                    style={{ background: "rgba(124,58,237,0.08)", border: "1px solid rgba(124,58,237,0.3)" }}
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold uppercase tracking-wider text-pink-300 block mb-1.5">
                    Variante B — storytelling
                  </label>
                  <textarea
                    value={msgB} onChange={(e) => setMsgB(e.target.value)}
                    rows={6}
                    className="w-full rounded-xl px-3 py-2.5 text-xs text-white resize-none"
                    style={{ background: "rgba(236,72,153,0.08)", border: "1px solid rgba(236,72,153,0.3)" }}
                  />
                </div>

                <button onClick={createTest} disabled={creating}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white hover:opacity-90 disabled:opacity-50"
                  style={{ background: "linear-gradient(135deg, #25D366, #7c3aed)" }}>
                  {creating ? <Loader2 className="w-4 h-4 animate-spin" /> : <FlaskConical className="w-4 h-4" />}
                  {creating ? "Creazione…" : "Crea test A/B e genera link"}
                </button>
              </>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

/* ─────────── helper components ─────────── */

function StatBox({ label, value, icon, color }: { label: string; value: number | string; icon: React.ReactNode; color: string }) {
  return (
    <div className="rounded-xl p-2.5 text-center"
      style={{ background: "rgba(255,255,255,0.04)", border: `1px solid ${color}33` }}>
      <div className="flex items-center justify-center gap-1 mb-0.5" style={{ color }}>
        {icon}
        <span className="text-[9px] font-bold uppercase tracking-wider">{label}</span>
      </div>
      <div className="text-base font-black text-white">{value}</div>
    </div>
  );
}

function VariantPanel({
  label, message, clicks, replies, clickPct, replyRate, shortId, isWinner, accent,
  onCopy, onOpen, onMarkReply,
}: {
  label: string; message: string; clicks: number; replies: number;
  clickPct: number; replyRate: number; shortId: string; isWinner: boolean; accent: string;
  onCopy: () => void; onOpen: () => void; onMarkReply: () => void;
}) {
  return (
    <div className="rounded-xl p-3 space-y-2.5"
      style={{
        background: `linear-gradient(135deg, ${accent}1a, ${accent}08)`,
        border: `1px solid ${isWinner ? "#fbbf24" : `${accent}55`}`,
        boxShadow: isWinner ? "0 0 24px rgba(251,191,36,0.25)" : "none",
      }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white"
            style={{ background: accent }}>
            {label}
          </div>
          <div>
            <div className="text-[11px] font-bold text-white">Variante {label}</div>
            <div className="text-[9px] text-white/50">ID: {shortId}</div>
          </div>
        </div>
        {isWinner && (
          <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[9px] font-black text-amber-100"
            style={{ background: "rgba(251,191,36,0.2)", border: "1px solid rgba(251,191,36,0.5)" }}>
            <Trophy className="w-3 h-3" />
            VINCITORE
          </div>
        )}
      </div>

      {/* Anteprima messaggio */}
      <div className="rounded-lg p-2 text-[10px] text-white/80 max-h-20 overflow-y-auto whitespace-pre-wrap"
        style={{ background: "rgba(0,0,0,0.3)" }}>
        {message}
      </div>

      {/* Stats inline */}
      <div className="grid grid-cols-3 gap-1.5">
        <div className="rounded-lg py-1.5 text-center" style={{ background: "rgba(0,0,0,0.25)" }}>
          <div className="text-[8px] text-white/50 uppercase">Click</div>
          <div className="text-sm font-black" style={{ color: accent }}>{clicks}</div>
          <div className="text-[8px] text-white/40">{clickPct}%</div>
        </div>
        <div className="rounded-lg py-1.5 text-center" style={{ background: "rgba(0,0,0,0.25)" }}>
          <div className="text-[8px] text-white/50 uppercase">Risposte</div>
          <div className="text-sm font-black text-emerald-300">{replies}</div>
          <div className="text-[8px] text-white/40">tot</div>
        </div>
        <div className="rounded-lg py-1.5 text-center" style={{ background: "rgba(0,0,0,0.25)" }}>
          <div className="text-[8px] text-white/50 uppercase">Reply rate</div>
          <div className="text-sm font-black text-amber-300">{replyRate}%</div>
          <div className="text-[8px] text-white/40">su click</div>
        </div>
      </div>

      {/* Actions */}
      <div className="grid grid-cols-3 gap-1.5">
        <button onClick={onCopy}
          className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-white/90 hover:bg-white/10"
          style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.1)" }}>
          <Copy className="w-3 h-3" /> Copia link
        </button>
        <button onClick={onOpen}
          className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-white"
          style={{ background: "rgba(37,211,102,0.2)", border: "1px solid rgba(37,211,102,0.4)" }}>
          <Send className="w-3 h-3" /> Apri WA
        </button>
        <button onClick={onMarkReply}
          className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold text-emerald-200"
          style={{ background: "rgba(16,185,129,0.15)", border: "1px solid rgba(16,185,129,0.4)" }}>
          <CheckCircle2 className="w-3 h-3" /> Risposta {label}
        </button>
      </div>
    </div>
  );
}
