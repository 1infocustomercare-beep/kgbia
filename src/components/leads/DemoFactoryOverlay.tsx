import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, Copy, Check, Loader2, Zap, Crown, Users, ShoppingBag, MessageCircle, Phone, Shield, KeyRound, ChevronDown, ChevronUp, Mail, Monitor, Smartphone, Wand2, FolderOpen, BookmarkCheck } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "sonner";
import { TEMPLATES, renderTemplate, pickRecommendedAuroraTemplate, type EmailTemplate } from "@/lib/email-templates/aurora-templates";
import { analyzeEmailDeliverability } from "@/lib/email-templates/deliverability";

export interface DemoFactoryResult {
  success: boolean;
  runId?: string | null;
  tenant: { id: string; slug: string };
  previewUrl: string;
  adminUrl: string;
  magicLink: string | null;
  credentials?: { email: string; password: string };
  outreach?: {
    whatsappMessage: string;
    whatsappLink: string | null;
    callScript: { hook: string; pitch: string; close: string }[];
    objections: { objection: string; reply: string }[];
  };
  brand: {
    tagline: string;
    description: string;
    palette: { primary: string; secondary: string; bg: string; accent: string };
    menuCount: number;
    clientsCount: number;
  };
  autoMatch?: {
    subSector: string;
    templateVariant: string;
    themeHint: string;
    heroTagline?: string;
  };
  scraped: {
    ok: boolean;
    hasBranding: boolean;
    imagesFound?: number;
    logoFound?: boolean;
    detectedSector?: string | null;
  };
  images?: {
    hero: string | null;
    gallery: string[];
    logo: string | null;
    totalReal: number;
  };
  durationMs?: number;
}

interface Props {
  open: boolean;
  loading: boolean;
  progress: string;
  result: DemoFactoryResult | null;
  leadName: string;
  leadEmail?: string;
  leadCity?: string;
  leadSector?: string;
  leadRating?: number | null;
  leadScore?: number | null;
  onClose: () => void;
  onSendWhatsApp?: () => void;
}

const PIPELINE_STEPS = [
  { key: "scout", icon: "🔍", label: "Scout — scraping sito reale" },
  { key: "analyst", icon: "🧠", label: "Analyst — sub-settore + brand kit AI" },
  { key: "curator", icon: "🎨", label: "Curator — palette, foto, template" },
  { key: "builder", icon: "🏗️", label: "Builder — sito demo + admin" },
  { key: "copywriter", icon: "✍️", label: "Copywriter — WhatsApp + script" },
  { key: "closer", icon: "🔑", label: "Closer — credenziali + magic link" },
];

export default function DemoFactoryOverlay({ open, loading, progress, result, leadName, leadEmail, leadCity, leadSector, leadRating, leadScore, onClose, onSendWhatsApp }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [objectionsOpen, setObjectionsOpen] = useState(false);
  const [emailOpen, setEmailOpen] = useState(true);
  const [emailDevice, setEmailDevice] = useState<"desktop" | "mobile">("mobile");
  const aiPick = useMemo(() => pickRecommendedAuroraTemplate({
    sector: leadSector,
    googleRating: leadRating,
    score: leadScore,
  }), [leadSector, leadRating, leadScore]);
  const [selectedTplId, setSelectedTplId] = useState<string>(aiPick.id);
  useEffect(() => {
    if (open) setSelectedTplId(aiPick.id);
  }, [open, aiPick.id, result?.runId, leadName]);
  const recipientName = useMemo(() => (leadEmail || "").split("@")[0] || leadName.split(" ")[0] || "ciao", [leadEmail, leadName]);
  const renderedEmail = useMemo(() => renderTemplate(selectedTplId, {
    recipientName,
    businessName: leadName || "la vostra attività",
    city: leadCity,
    sectorLabel: leadSector,
    previewLink: result?.previewUrl,
    senderName: "Arianna",
    senderRole: "Empire AI Group",
  }), [selectedTplId, recipientName, leadName, leadCity, leadSector, result?.previewUrl]);
  const deliverability = useMemo(() => renderedEmail ? analyzeEmailDeliverability({
    subject: renderedEmail.subject, body: renderedEmail.text, hasUnsubscribe: true,
  }) : null, [renderedEmail]);

  const copy = (label: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(label);
    toast.success(`${label} copiato`);
    setTimeout(() => setCopied(null), 1500);
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] backdrop-blur-md"
            style={{ background: "radial-gradient(ellipse at top, rgba(76,29,149,0.55), rgba(10,8,20,0.92))" }}
            onClick={!loading ? onClose : undefined}
          />

          {/* Mobile-first centering: block-level scroll, mx-auto centers without flex squeeze.
              On large screens we add vertical centering via min-h + flex (only when content fits). */}
          <div className="fixed inset-0 z-[61] overflow-y-auto overflow-x-hidden overscroll-contain">
            <div className="min-h-full w-full px-3 sm:px-4 md:px-6 py-3 sm:py-6 mx-auto max-w-[680px] flex flex-col md:justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 20, scale: 0.97 }}
                transition={{ type: "spring", damping: 25 }}
                className="w-full mx-auto rounded-2xl md:rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
                style={{ background: "linear-gradient(160deg, #0f0a1f, #15102e 45%, #1a0f2a)" }}
              >
                {/* ============ HEADER (sticky) ============ */}
                <div
                  className="px-3 sm:px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0 sticky top-0 z-10 backdrop-blur-xl"
                  style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.22), rgba(20,184,166,0.15)), rgba(15,10,31,0.95)" }}
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
                      {loading ? <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 text-white animate-spin" /> : <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 text-white" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="text-xs sm:text-sm md:text-base font-black text-white truncate">Demo Factory · 6 Agenti AI</h2>
                      <p className="text-[11px] sm:text-[11px] text-white/50 truncate">{leadName}</p>
                    </div>
                  </div>
                  {!loading && (
                    <button
                      onClick={onClose}
                      aria-label="Chiudi"
                      className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white shrink-0 ml-2"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                {/* ============ BODY ============ */}
                <div className="p-3 sm:p-4 md:p-5 space-y-3 sm:space-y-4 min-w-0">
                  {/* === LOADING STATE === */}
                  {loading && !result && (
                    <div className="space-y-4">
                      <div className="text-center py-4 sm:py-6">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center mb-3 sm:mb-4">
                          <Loader2 className="w-6 h-6 sm:w-7 sm:h-7 text-purple-300 animate-spin" />
                        </div>
                        <p className="text-sm font-bold text-white mb-2">Pipeline multi-agente in corso…</p>
                        <p className="text-xs text-white/60 px-2">{progress}</p>
                      </div>
                      <div className="space-y-1.5">
                        {PIPELINE_STEPS.map((step, i) => (
                          <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                            <span className="text-base shrink-0">{step.icon}</span>
                            <span className="text-xs text-white/70 flex-1 min-w-0 truncate">{step.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* === RESULT STATE === */}
                  {result && (
                    <div className="space-y-3 sm:space-y-4">
                      {/* 1️⃣ HERO — Brand identity card */}
                      <div
                        className="rounded-2xl p-3 sm:p-4 border"
                        style={{
                          background: `linear-gradient(135deg, ${result.brand.palette.primary}15, ${result.brand.palette.accent}10)`,
                          borderColor: `${result.brand.palette.primary}40`,
                        }}
                      >
                        <div className="flex items-start gap-3">
                          <div
                            className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg"
                            style={{ background: `linear-gradient(135deg, ${result.brand.palette.primary}, ${result.brand.palette.accent})` }}
                          >
                            <Crown className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-[10px] sm:text-[11px] uppercase tracking-wider font-black text-white/60 mb-1">
                              Demo pronta in {result.durationMs ? `${(result.durationMs / 1000).toFixed(1)}s` : '…'}
                            </p>
                            <h3 className="text-sm sm:text-base font-black text-white break-words">{leadName}</h3>
                            <p className="text-[0.7rem] sm:text-xs text-white/70 mt-1 italic break-words">"{result.brand.tagline}"</p>
                            {result.autoMatch && (
                              <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                                  {result.autoMatch.subSector}
                                </span>
                                <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30">
                                  {result.autoMatch.templateVariant}
                                </span>
                              </div>
                            )}
                            {/* 💾 Auto-save badge — informa l'utente che la demo è già nel Portfolio */}
                            <div className="mt-2 flex items-center gap-1.5 flex-wrap">
                              <span className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-black px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-200 border border-emerald-400/30">
                                <BookmarkCheck className="w-2.5 h-2.5" />
                                Salvata nel Portfolio
                              </span>
                              <span className="text-[10px] text-white/80">riusabile gratis</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* 2️⃣ LIVE PREVIEW iframe (responsive aspect) */}
                      <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02] w-full">
                        <div className="px-3 py-2 flex items-center justify-between gap-2 border-b border-white/10 bg-white/[0.03]">
                          <p className="text-[11px] uppercase tracking-wider text-white/60 font-black flex items-center gap-1.5 min-w-0">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
                            <span className="truncate">Sito demo live · navigabile</span>
                          </p>
                          <a href={result.previewUrl} target="_blank" rel="noreferrer" className="text-[11px] font-bold text-purple-300 hover:text-white flex items-center gap-1 shrink-0">
                            Apri <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <div className="relative w-full bg-black/40" style={{ height: "min(60vh, 420px)" }}>
                          <iframe
                            src={result.previewUrl}
                            title="Demo preview"
                            className="absolute inset-0 w-full h-full border-0 block"
                            sandbox="allow-scripts allow-same-origin"
                          />
                        </div>
                      </div>

                      {/* 3️⃣ KPI grid */}
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { icon: ShoppingBag, label: "Menu/Listino", value: result.brand.menuCount, color: "#a78bfa" },
                          { icon: Users, label: "Clienti CRM", value: result.brand.clientsCount, color: "#14b8a6" },
                          { icon: Zap, label: "Foto reali", value: result.images?.totalReal ?? 0, color: "#f59e0b" },
                        ].map((k, i) => (
                          <div key={i} className="rounded-xl p-2.5 sm:p-3 border border-white/10 bg-white/[0.03] min-w-0">
                            <k.icon className="w-3.5 h-3.5 mb-1" style={{ color: k.color }} />
                            <p className="text-[10px] uppercase tracking-wider text-white/50 font-bold truncate">{k.label}</p>
                            <p className="text-sm sm:text-base font-black text-white">{k.value}</p>
                          </div>
                        ))}
                      </div>

                      {/* 4️⃣ PRIMARY ACTIONS (CTAs subito visibili) */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        <a
                          href={result.previewUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/20"
                        >
                          <ExternalLink className="w-3.5 h-3.5" /> Apri Sito Demo
                        </a>
                        {onSendWhatsApp && (
                          <button
                            onClick={onSendWhatsApp}
                            className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-500/20"
                          >
                            <Sparkles className="w-3.5 h-3.5" /> Invia al Lead
                          </button>
                        )}
                      </div>

                      {/* 4b ️⃣ SECONDARY — Apri Portfolio (la demo è già salvata lì) */}
                      <Link
                        to="/partner/portfolio"
                        onClick={onClose}
                        className="flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[11px] font-bold bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 text-white/80 hover:text-white transition-colors"
                      >
                        <FolderOpen className="w-3.5 h-3.5" /> Apri Portfolio · ritrovi qui tutte le tue demo
                      </Link>

                      {/* 5b ️⃣ EMAIL AURORA — Template HTML stilizzato con preview live */}
                      {renderedEmail && (
                        <div className="rounded-2xl border border-violet-400/30 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/5 overflow-hidden">
                          <button
                            onClick={() => setEmailOpen(o => !o)}
                            className="w-full px-3 py-2.5 flex items-center justify-between text-left gap-2"
                          >
                            <p className="text-[11px] uppercase tracking-wider font-black text-violet-200 flex items-center gap-1.5 min-w-0 truncate">
                              <Mail className="w-3 h-3 shrink-0" />
                              <span className="truncate">Email Aurora · {TEMPLATES.find(t => t.id === selectedTplId)?.name.replace(" — Aurora","")}</span>
                              {deliverability && (
                                <span className={`ml-1 text-[9px] px-1.5 py-0.5 rounded-md font-black ${deliverability.score >= 85 ? "bg-emerald-500/20 text-emerald-200" : deliverability.score >= 70 ? "bg-amber-500/20 text-amber-200" : "bg-rose-500/20 text-rose-200"}`}>
                                  Inbox {deliverability.score}
                                </span>
                              )}
                            </p>
                            {emailOpen ? <ChevronUp className="w-3.5 h-3.5 text-violet-300 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-violet-300 shrink-0" />}
                          </button>
                          {emailOpen && (
                            <div className="px-3 pb-3 space-y-2.5">
                              {/* AI hint */}
                              <p className="text-[10px] text-violet-300/80 italic flex items-start gap-1">
                                <Wand2 className="w-2.5 h-2.5 mt-0.5 shrink-0" />
                                <span>AI ha scelto: {aiPick.reason}</span>
                              </p>

                              {/* Template chips */}
                              <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1 scrollbar-none">
                                {TEMPLATES.map(t => {
                                  const active = t.id === selectedTplId;
                                  const isFit = leadSector && t.bestFor.includes(leadSector);
                                  return (
                                    <button
                                      key={t.id}
                                      onClick={() => setSelectedTplId(t.id)}
                                      className={`shrink-0 px-2 py-1 rounded-md text-[9.5px] font-bold border transition-all ${active ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white border-violet-400" : "bg-white/5 text-white/70 border-white/10 hover:bg-white/10"}`}
                                    >
                                      {t.name.replace(" — Aurora","")}
                                      {isFit && !active && <span className="ml-1 text-emerald-400">★</span>}
                                    </button>
                                  );
                                })}
                              </div>

                              {/* Subject */}
                              <div className="rounded-lg border border-white/10 bg-black/30 px-2.5 py-1.5">
                                <p className="text-[8.5px] uppercase tracking-wider font-bold text-white/80">Oggetto</p>
                                <p className="text-[11px] text-white/95 font-semibold truncate">{renderedEmail.subject}</p>
                              </div>

                              {/* Device toggle + iframe HTML preview */}
                              <div className="rounded-lg border border-white/10 overflow-hidden">
                                <div className="flex items-center justify-between bg-white/[0.03] px-2 py-1 border-b border-white/10">
                                  <span className="text-[9px] uppercase font-bold text-white/50">Anteprima HTML live</span>
                                  <div className="flex gap-0.5">
                                    <button onClick={() => setEmailDevice("desktop")} className={`p-1 rounded ${emailDevice === "desktop" ? "bg-violet-500/30 text-violet-200" : "text-white/80"}`}><Monitor className="w-3 h-3" /></button>
                                    <button onClick={() => setEmailDevice("mobile")} className={`p-1 rounded ${emailDevice === "mobile" ? "bg-violet-500/30 text-violet-200" : "text-white/80"}`}><Smartphone className="w-3 h-3" /></button>
                                  </div>
                                </div>
                                <div className="bg-[#f5f3ff] flex justify-center p-2 max-h-[360px] overflow-y-auto">
                                  <div className="bg-white rounded shadow-xl" style={{ width: emailDevice === "mobile" ? 320 : "100%", maxWidth: 560 }}>
                                    <iframe
                                      title="aurora-preview"
                                      srcDoc={renderedEmail.html}
                                      sandbox=""
                                      className="w-full"
                                      style={{ height: 340, border: "none", borderRadius: 4 }}
                                    />
                                  </div>
                                </div>
                              </div>

                              {/* Deliverability hints inline */}
                              {deliverability && deliverability.issues.length > 0 && (
                                <div className="rounded-lg bg-black/30 border border-amber-400/20 px-2.5 py-1.5 space-y-0.5">
                                  <p className="text-[9px] uppercase tracking-wider font-bold text-amber-300">Hint deliverability</p>
                                  {deliverability.issues.slice(0,3).map((iss, i) => (
                                    <p key={i} className="text-[10px] text-white/70 leading-snug">
                                      <span className={iss.level === "critical" ? "text-rose-300" : iss.level === "warning" ? "text-amber-300" : "text-cyan-300"}>•</span> {iss.message}
                                    </p>
                                  ))}
                                </div>
                              )}

                              {/* Actions */}
                              <div className="grid grid-cols-2 gap-1.5">
                                <button
                                  onClick={() => copy("Email HTML", renderedEmail.html)}
                                  className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-bold bg-white/5 hover:bg-white/10 text-white/80 border border-white/10"
                                >
                                  {copied === "Email HTML" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                                  Copia HTML
                                </button>
                                <a
                                  href={leadEmail ? `mailto:${leadEmail}?subject=${encodeURIComponent(renderedEmail.subject)}&body=${encodeURIComponent(renderedEmail.text)}` : `mailto:?subject=${encodeURIComponent(renderedEmail.subject)}&body=${encodeURIComponent(renderedEmail.text)}`}
                                  className="flex items-center justify-center gap-1 py-2 rounded-lg text-[10px] font-black bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-lg shadow-violet-500/30"
                                >
                                  <Mail className="w-3 h-3" /> Apri in client mail
                                </a>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* 5️⃣ WHATSAPP message */}
                      {result.outreach?.whatsappMessage && (
                        <div className="rounded-2xl p-3 border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                          <div className="flex items-center justify-between gap-2 mb-2">
                            <p className="text-[11px] uppercase tracking-wider font-black text-emerald-300 flex items-center gap-1.5 min-w-0 truncate">
                              <MessageCircle className="w-3 h-3 shrink-0" />
                              <span className="truncate">Messaggio WhatsApp</span>
                            </p>
                            <button onClick={() => copy("WhatsApp", result.outreach!.whatsappMessage)} className="text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70 shrink-0">
                              {copied === "WhatsApp" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                              {copied === "WhatsApp" ? "Copiato" : "Copia"}
                            </button>
                          </div>
                          <p className="text-[0.7rem] sm:text-xs text-white/85 whitespace-pre-wrap leading-relaxed bg-black/20 rounded-lg p-2.5 border border-white/5 max-h-32 overflow-y-auto break-words">
                            {result.outreach.whatsappMessage}
                          </p>
                          {result.outreach.whatsappLink && (
                            <a
                              href={result.outreach.whatsappLink}
                              target="_blank"
                              rel="noreferrer"
                              className="mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30"
                            >
                              <MessageCircle className="w-3.5 h-3.5" /> Invia ora su WhatsApp
                            </a>
                          )}
                        </div>
                      )}

                      {/* 6️⃣ CALL SCRIPT */}
                      {result.outreach?.callScript && result.outreach.callScript.length > 0 && (
                        <div className="rounded-2xl p-3 border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                          <div className="flex items-center justify-between gap-2 mb-2 flex-wrap">
                            <p className="text-[11px] uppercase tracking-wider font-black text-amber-300 flex items-center gap-1.5 min-w-0">
                              <Phone className="w-3 h-3 shrink-0" />
                              <span className="truncate">Script chiamata · {scriptIdx + 1}/{result.outreach.callScript.length}</span>
                            </p>
                            <div className="flex gap-1 shrink-0">
                              {result.outreach.callScript.map((_, i) => (
                                <button
                                  key={i}
                                  onClick={() => setScriptIdx(i)}
                                  className={`w-5 h-5 rounded text-[11px] font-bold ${i === scriptIdx ? "bg-amber-500 text-black" : "bg-white/5 text-white/50"}`}
                                >
                                  {i + 1}
                                </button>
                              ))}
                            </div>
                          </div>
                          {result.outreach.callScript[scriptIdx] && (
                            <div className="space-y-1.5 text-xs">
                              {(["hook", "pitch", "close"] as const).map((k) => (
                                <div key={k} className="bg-black/20 rounded-lg p-2 border border-white/5">
                                  <p className="text-[10px] uppercase tracking-wider text-amber-300/70 font-bold mb-0.5">{k}</p>
                                  <p className="text-white/85 leading-snug text-[0.7rem] sm:text-xs break-words">
                                    {result.outreach.callScript[scriptIdx][k]}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 7️⃣ OBJECTIONS (collapsible) */}
                      {result.outreach?.objections && result.outreach.objections.length > 0 && (
                        <div className="rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-pink-500/5 overflow-hidden">
                          <button
                            onClick={() => setObjectionsOpen(o => !o)}
                            className="w-full px-3 py-2.5 flex items-center justify-between text-left gap-2"
                          >
                            <p className="text-[11px] uppercase tracking-wider font-black text-rose-300 flex items-center gap-1.5 min-w-0 truncate">
                              <Shield className="w-3 h-3 shrink-0" />
                              <span className="truncate">{result.outreach.objections.length} obiezioni con risposte</span>
                            </p>
                            {objectionsOpen ? <ChevronUp className="w-3.5 h-3.5 text-rose-300 shrink-0" /> : <ChevronDown className="w-3.5 h-3.5 text-rose-300 shrink-0" />}
                          </button>
                          {objectionsOpen && (
                            <div className="px-3 pb-3 space-y-2">
                              {result.outreach.objections.map((o, i) => (
                                <div key={i} className="bg-black/20 rounded-lg p-2.5 border border-white/5">
                                  <p className="text-[11px] font-black text-rose-200 mb-1 break-words">❝ {o.objection}</p>
                                  <p className="text-[0.7rem] text-white/80 leading-relaxed break-words">{o.reply}</p>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}

                      {/* 8️⃣ ADMIN CREDENTIALS */}
                      {result.credentials && (
                        <div className="rounded-2xl p-3 border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
                          <p className="text-[11px] uppercase tracking-wider font-black text-purple-300 mb-2 flex items-center gap-1.5">
                            <KeyRound className="w-3 h-3" /> Credenziali admin demo
                          </p>
                          <div className="space-y-1.5">
                            <CredRow label="Email" value={result.credentials.email} copied={copied === "Email"} onCopy={() => copy("Email", result.credentials!.email)} />
                            <CredRow label="Password" value={result.credentials.password} copied={copied === "Password"} onCopy={() => copy("Password", result.credentials!.password)} mono />
                          </div>
                        </div>
                      )}

                      {/* 9️⃣ BRAND IDENTITY (logo, hero, gallery, palette) */}
                      {(result.images?.logo || result.images?.hero) && (
                        <div className="rounded-xl p-3 border border-white/10 bg-white/[0.02]">
                          <p className="text-[11px] uppercase tracking-wider text-white/50 font-bold mb-2">Brand identity estratta</p>
                          <div className="flex gap-2 items-center">
                            {result.images?.logo && (
                              <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                                <img src={result.images.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                              </div>
                            )}
                            {result.images?.hero && (
                              <div className="flex-1 h-14 rounded-lg overflow-hidden border border-white/10 min-w-0">
                                <img src={result.images.hero} alt="Hero" className="w-full h-full object-cover" />
                              </div>
                            )}
                          </div>
                          {result.images?.gallery && result.images.gallery.length > 0 && (
                            <div className="grid grid-cols-6 gap-1 mt-2">
                              {result.images.gallery.slice(0, 6).map((url, i) => (
                                <div key={i} className="aspect-square rounded-md overflow-hidden border border-white/10">
                                  <img src={url} alt={`Gallery ${i}`} className="w-full h-full object-cover" />
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex gap-1.5 mt-2">
                            {Object.entries(result.brand.palette).map(([k, v]) => (
                              <div key={k} className="flex-1 text-center min-w-0">
                                <div className="w-full h-6 rounded-md border border-white/10" style={{ background: v }} />
                                <p className="text-[10px] text-white/80 mt-0.5 font-mono truncate">{v.slice(0, 7)}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 🔟 LINKS (in fondo, raggruppati) */}
                      <div className="space-y-2">
                        <LinkRow label="Sito Demo Reale" url={result.previewUrl} copied={copied === "Sito"} onCopy={() => copy("Sito", result.previewUrl)} accent="#a78bfa" />
                        <LinkRow label="Pannello Admin" url={result.adminUrl} copied={copied === "Admin"} onCopy={() => copy("Admin", result.adminUrl)} accent="#14b8a6" />
                        {result.magicLink && (
                          <LinkRow label="Magic Link Lead (1-click login)" url={result.magicLink} copied={copied === "Magic"} onCopy={() => copy("Magic", result.magicLink!)} accent="#f59e0b" highlight />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

function LinkRow({ label, url, copied, onCopy, accent, highlight }: { label: string; url: string; copied: boolean; onCopy: () => void; accent: string; highlight?: boolean }) {
  return (
    <div
      className="rounded-xl p-3 border min-w-0"
      style={{
        background: highlight ? `${accent}10` : "rgba(255,255,255,0.03)",
        borderColor: highlight ? `${accent}40` : "rgba(255,255,255,0.08)",
      }}
    >
      <div className="flex items-center justify-between gap-2 mb-1.5">
        <p className="text-[11px] uppercase tracking-wider font-black truncate" style={{ color: accent }}>{label}</p>
        <button onClick={onCopy} className="text-[11px] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70 shrink-0">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copiato" : "Copia"}
        </button>
      </div>
      <p className="text-[11px] text-white/60 font-mono break-all">{url}</p>
    </div>
  );
}

function CredRow({ label, value, copied, onCopy, mono }: { label: string; value: string; copied: boolean; onCopy: () => void; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 bg-black/20 rounded-lg px-2.5 py-1.5 border border-white/5 min-w-0">
      <div className="min-w-0 flex-1">
        <p className="text-[10px] uppercase tracking-wider text-white/80 font-bold">{label}</p>
        <p className={`text-[0.7rem] text-white/90 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      <button onClick={onCopy} className="text-[11px] font-bold flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 shrink-0">
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}
