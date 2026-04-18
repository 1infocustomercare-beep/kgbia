import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, Copy, Check, Loader2, Zap, Crown, Users, ShoppingBag, MessageCircle, Phone, Shield, KeyRound, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

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

export default function DemoFactoryOverlay({ open, loading, progress, result, leadName, onClose, onSendWhatsApp }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [scriptIdx, setScriptIdx] = useState(0);
  const [objectionsOpen, setObjectionsOpen] = useState(false);

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
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-md"
            onClick={!loading ? onClose : undefined}
          />
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.96 }}
            transition={{ type: "spring", damping: 25 }}
            className="fixed inset-x-1 top-[max(env(safe-area-inset-top),0.5rem)] bottom-[max(env(safe-area-inset-bottom),0.5rem)] lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8 lg:bottom-8 lg:w-[680px] lg:max-w-[calc(100vw-2rem)] z-[61] rounded-2xl lg:rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-w-[calc(100vw-0.5rem)] mx-auto"
            style={{ background: "linear-gradient(160deg, #0a0a14, #0d0a1f 50%, #14091a)" }}
          >
            {/* Header */}
            <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between shrink-0"
              style={{ background: "linear-gradient(90deg, rgba(167,139,250,0.1), rgba(20,184,166,0.06))" }}>
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-teal-500 flex items-center justify-center shadow-lg shrink-0">
                  {loading ? <Loader2 className="w-5 h-5 text-white animate-spin" /> : <Sparkles className="w-5 h-5 text-white" />}
                </div>
                <div className="min-w-0">
                  <h2 className="text-sm lg:text-base font-black text-white truncate">Demo Factory · 6 Agenti AI</h2>
                  <p className="text-[0.65rem] text-white/50 truncate">{leadName}</p>
                </div>
              </div>
              {!loading && (
                <button onClick={onClose} className="w-8 h-8 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center text-white/60 hover:text-white shrink-0">
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-4 lg:p-5 space-y-4">
              {loading && !result && (
                <div className="space-y-4">
                  <div className="text-center py-6">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                      <Loader2 className="w-7 h-7 text-purple-300 animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-white mb-2">Pipeline multi-agente in corso…</p>
                    <p className="text-xs text-white/60">{progress}</p>
                  </div>
                  <div className="space-y-2">
                    {PIPELINE_STEPS.map((step, i) => (
                      <div key={i} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <span className="text-base">{step.icon}</span>
                        <span className="text-xs text-white/70 flex-1">{step.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {result && (
                <div className="space-y-4">
                  {/* Hero */}
                  <div className="rounded-2xl p-4 border" style={{ background: `linear-gradient(135deg, ${result.brand.palette.primary}15, ${result.brand.palette.accent}10)`, borderColor: `${result.brand.palette.primary}40` }}>
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 shadow-lg" style={{ background: `linear-gradient(135deg, ${result.brand.palette.primary}, ${result.brand.palette.accent})` }}>
                        <Crown className="w-6 h-6 text-white" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-[0.6rem] uppercase tracking-wider font-black text-white/60 mb-1">Demo pronta in {result.durationMs ? `${(result.durationMs / 1000).toFixed(1)}s` : '...'}</p>
                        <h3 className="text-base font-black text-white">{leadName}</h3>
                        <p className="text-xs text-white/70 mt-1 italic">"{result.brand.tagline}"</p>
                        {result.autoMatch && (
                          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                            <span className="text-[0.55rem] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-200 border border-purple-400/30">
                              {result.autoMatch.subSector}
                            </span>
                            <span className="text-[0.55rem] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full bg-teal-500/20 text-teal-200 border border-teal-400/30">
                              {result.autoMatch.templateVariant}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Live preview iframe */}
                  <div className="rounded-2xl overflow-hidden border border-white/10 bg-white/[0.02]">
                    <div className="px-3 py-2 flex items-center justify-between border-b border-white/10 bg-white/[0.03]">
                      <p className="text-[0.6rem] uppercase tracking-wider text-white/60 font-black flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Preview live · navigabile
                      </p>
                      <a href={result.previewUrl} target="_blank" rel="noreferrer" className="text-[0.6rem] font-bold text-purple-300 hover:text-white flex items-center gap-1">
                        Apri <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                    <div className="aspect-[9/16] max-h-[420px] bg-black/40">
                      <iframe
                        src={result.previewUrl}
                        title="Demo preview"
                        className="w-full h-full border-0"
                        sandbox="allow-scripts allow-same-origin"
                      />
                    </div>
                  </div>

                  {/* KPI grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: ShoppingBag, label: "Menu/Listino", value: result.brand.menuCount, color: "#a78bfa" },
                      { icon: Users, label: "Clienti CRM", value: result.brand.clientsCount, color: "#14b8a6" },
                      { icon: Zap, label: "Foto reali", value: result.images?.totalReal ?? 0, color: "#f59e0b" },
                    ].map((k, i) => (
                      <div key={i} className="rounded-xl p-3 border border-white/10 bg-white/[0.03]">
                        <k.icon className="w-3.5 h-3.5 mb-1" style={{ color: k.color }} />
                        <p className="text-[0.55rem] uppercase tracking-wider text-white/50 font-bold">{k.label}</p>
                        <p className="text-base font-black text-white">{k.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* WhatsApp message ready */}
                  {result.outreach?.whatsappMessage && (
                    <div className="rounded-2xl p-3 border border-emerald-400/30 bg-gradient-to-br from-emerald-500/10 to-teal-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[0.6rem] uppercase tracking-wider font-black text-emerald-300 flex items-center gap-1.5">
                          <MessageCircle className="w-3 h-3" /> Messaggio WhatsApp pronto
                        </p>
                        <button onClick={() => copy("WhatsApp", result.outreach!.whatsappMessage)} className="text-[0.6rem] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70">
                          {copied === "WhatsApp" ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                          {copied === "WhatsApp" ? "Copiato" : "Copia"}
                        </button>
                      </div>
                      <p className="text-xs text-white/85 whitespace-pre-wrap leading-relaxed bg-black/20 rounded-lg p-2.5 border border-white/5 max-h-32 overflow-y-auto">
                        {result.outreach.whatsappMessage}
                      </p>
                      {result.outreach.whatsappLink && (
                        <a href={result.outreach.whatsappLink} target="_blank" rel="noreferrer"
                          className="mt-2 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg shadow-emerald-500/30">
                          <MessageCircle className="w-3.5 h-3.5" /> Invia ora su WhatsApp
                        </a>
                      )}
                    </div>
                  )}

                  {/* Call script */}
                  {result.outreach?.callScript && result.outreach.callScript.length > 0 && (
                    <div className="rounded-2xl p-3 border border-amber-400/30 bg-gradient-to-br from-amber-500/10 to-orange-500/5">
                      <div className="flex items-center justify-between mb-2">
                        <p className="text-[0.6rem] uppercase tracking-wider font-black text-amber-300 flex items-center gap-1.5">
                          <Phone className="w-3 h-3" /> Script chiamata · variante {scriptIdx + 1}/{result.outreach.callScript.length}
                        </p>
                        <div className="flex gap-1">
                          {result.outreach.callScript.map((_, i) => (
                            <button key={i} onClick={() => setScriptIdx(i)}
                              className={`w-5 h-5 rounded text-[0.6rem] font-bold ${i === scriptIdx ? "bg-amber-500 text-black" : "bg-white/5 text-white/50"}`}>
                              {i + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                      {result.outreach.callScript[scriptIdx] && (
                        <div className="space-y-1.5 text-xs">
                          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                            <p className="text-[0.55rem] uppercase tracking-wider text-amber-300/70 font-bold mb-0.5">Hook</p>
                            <p className="text-white/85 leading-snug">{result.outreach.callScript[scriptIdx].hook}</p>
                          </div>
                          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                            <p className="text-[0.55rem] uppercase tracking-wider text-amber-300/70 font-bold mb-0.5">Pitch</p>
                            <p className="text-white/85 leading-snug">{result.outreach.callScript[scriptIdx].pitch}</p>
                          </div>
                          <div className="bg-black/20 rounded-lg p-2 border border-white/5">
                            <p className="text-[0.55rem] uppercase tracking-wider text-amber-300/70 font-bold mb-0.5">Close</p>
                            <p className="text-white/85 leading-snug">{result.outreach.callScript[scriptIdx].close}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Objections (collapsible) */}
                  {result.outreach?.objections && result.outreach.objections.length > 0 && (
                    <div className="rounded-2xl border border-rose-400/30 bg-gradient-to-br from-rose-500/10 to-pink-500/5 overflow-hidden">
                      <button
                        onClick={() => setObjectionsOpen(o => !o)}
                        className="w-full px-3 py-2.5 flex items-center justify-between text-left"
                      >
                        <p className="text-[0.6rem] uppercase tracking-wider font-black text-rose-300 flex items-center gap-1.5">
                          <Shield className="w-3 h-3" /> {result.outreach.objections.length} obiezioni con risposte
                        </p>
                        {objectionsOpen ? <ChevronUp className="w-3.5 h-3.5 text-rose-300" /> : <ChevronDown className="w-3.5 h-3.5 text-rose-300" />}
                      </button>
                      {objectionsOpen && (
                        <div className="px-3 pb-3 space-y-2">
                          {result.outreach.objections.map((o, i) => (
                            <div key={i} className="bg-black/20 rounded-lg p-2.5 border border-white/5">
                              <p className="text-[0.6rem] font-black text-rose-200 mb-1">❝ {o.objection}</p>
                              <p className="text-[0.7rem] text-white/80 leading-relaxed">{o.reply}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Admin credentials */}
                  {result.credentials && (
                    <div className="rounded-2xl p-3 border border-purple-400/30 bg-gradient-to-br from-purple-500/10 to-indigo-500/5">
                      <p className="text-[0.6rem] uppercase tracking-wider font-black text-purple-300 mb-2 flex items-center gap-1.5">
                        <KeyRound className="w-3 h-3" /> Credenziali admin demo
                      </p>
                      <div className="space-y-1.5">
                        <CredRow label="Email" value={result.credentials.email} copied={copied === "Email"} onCopy={() => copy("Email", result.credentials!.email)} />
                        <CredRow label="Password" value={result.credentials.password} copied={copied === "Password"} onCopy={() => copy("Password", result.credentials!.password)} mono />
                      </div>
                    </div>
                  )}

                  {/* Brand identity */}
                  {(result.images?.logo || result.images?.hero) && (
                    <div className="rounded-xl p-3 border border-white/10 bg-white/[0.02]">
                      <p className="text-[0.6rem] uppercase tracking-wider text-white/50 font-bold mb-2">Brand identity estratta</p>
                      <div className="flex gap-2 items-center">
                        {result.images?.logo && (
                          <div className="w-14 h-14 rounded-lg bg-white/10 flex items-center justify-center overflow-hidden border border-white/10 shrink-0">
                            <img src={result.images.logo} alt="Logo" className="max-w-full max-h-full object-contain" />
                          </div>
                        )}
                        {result.images?.hero && (
                          <div className="flex-1 h-14 rounded-lg overflow-hidden border border-white/10">
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
                          <div key={k} className="flex-1 text-center">
                            <div className="w-full h-6 rounded-md border border-white/10" style={{ background: v }} />
                            <p className="text-[0.5rem] text-white/40 mt-0.5 font-mono">{v.slice(0, 7)}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Links */}
                  <div className="space-y-2">
                    <LinkRow label="Sito Demo" url={result.previewUrl} copied={copied === "Sito"} onCopy={() => copy("Sito", result.previewUrl)} accent="#a78bfa" />
                    <LinkRow label="Pannello Admin" url={result.adminUrl} copied={copied === "Admin"} onCopy={() => copy("Admin", result.adminUrl)} accent="#14b8a6" />
                    {result.magicLink && (
                      <LinkRow label="Magic Link Lead (1-click login)" url={result.magicLink} copied={copied === "Magic"} onCopy={() => copy("Magic", result.magicLink!)} accent="#f59e0b" highlight />
                    )}
                  </div>

                  {/* CTAs */}
                  <div className="grid grid-cols-2 gap-2 pt-2">
                    <a href={result.previewUrl} target="_blank" rel="noreferrer"
                      className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                      <ExternalLink className="w-3.5 h-3.5" /> Apri Sito
                    </a>
                    {onSendWhatsApp && (
                      <button onClick={onSendWhatsApp}
                        className="flex items-center justify-center gap-1.5 py-3 rounded-xl text-xs font-black bg-gradient-to-r from-teal-500 to-emerald-500 text-white">
                        <Sparkles className="w-3.5 h-3.5" /> Invia al Lead
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function LinkRow({ label, url, copied, onCopy, accent, highlight }: { label: string; url: string; copied: boolean; onCopy: () => void; accent: string; highlight?: boolean }) {
  return (
    <div className="rounded-xl p-3 border" style={{ background: highlight ? `${accent}10` : "rgba(255,255,255,0.03)", borderColor: highlight ? `${accent}40` : "rgba(255,255,255,0.08)" }}>
      <div className="flex items-center justify-between mb-1.5">
        <p className="text-[0.6rem] uppercase tracking-wider font-black" style={{ color: accent }}>{label}</p>
        <button onClick={onCopy} className="text-[0.6rem] font-bold flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 text-white/70">
          {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
          {copied ? "Copiato" : "Copia"}
        </button>
      </div>
      <p className="text-[0.65rem] text-white/60 font-mono break-all">{url}</p>
    </div>
  );
}

function CredRow({ label, value, copied, onCopy, mono }: { label: string; value: string; copied: boolean; onCopy: () => void; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-2 bg-black/20 rounded-lg px-2.5 py-1.5 border border-white/5">
      <div className="min-w-0 flex-1">
        <p className="text-[0.55rem] uppercase tracking-wider text-white/40 font-bold">{label}</p>
        <p className={`text-[0.7rem] text-white/90 truncate ${mono ? "font-mono" : ""}`}>{value}</p>
      </div>
      <button onClick={onCopy} className="text-[0.6rem] font-bold flex items-center gap-1 px-2 py-1 rounded-md bg-white/5 hover:bg-white/10 text-white/70 shrink-0">
        {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
      </button>
    </div>
  );
}
