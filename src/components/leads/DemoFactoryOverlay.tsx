import { motion, AnimatePresence } from "framer-motion";
import { X, Sparkles, ExternalLink, Copy, Check, Loader2, Zap, Crown, Users, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export interface DemoFactoryResult {
  success: boolean;
  tenant: { id: string; slug: string };
  previewUrl: string;
  adminUrl: string;
  magicLink: string | null;
  brand: {
    tagline: string;
    description: string;
    palette: { primary: string; secondary: string; bg: string; accent: string };
    menuCount: number;
    clientsCount: number;
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

export default function DemoFactoryOverlay({ open, loading, progress, result, leadName, onClose, onSendWhatsApp }: Props) {
  const [copied, setCopied] = useState<string | null>(null);

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
            className="fixed inset-x-2 top-4 bottom-4 lg:inset-x-auto lg:left-1/2 lg:-translate-x-1/2 lg:top-8 lg:bottom-8 lg:w-[640px] z-[61] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col"
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
                  <h2 className="text-sm lg:text-base font-black text-white truncate">Demo Factory</h2>
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
                  <div className="text-center py-8">
                    <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-purple-500/20 to-teal-500/20 flex items-center justify-center mb-4">
                      <Loader2 className="w-7 h-7 text-purple-300 animate-spin" />
                    </div>
                    <p className="text-sm font-bold text-white mb-2">Sto generando la demo personalizzata…</p>
                    <p className="text-xs text-white/60">{progress}</p>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: "Scraping del sito web", icon: "🌐" },
                      { label: "Estrazione brand identity", icon: "🎨" },
                      { label: "Generazione menu/listino con AI", icon: "📋" },
                      { label: "Creazione tenant + account admin", icon: "🏗️" },
                      { label: "Seed clienti, ordini, recensioni", icon: "✨" },
                      { label: "Magic link per il lead", icon: "🔗" },
                    ].map((step, i) => (
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
                      <div className="min-w-0">
                        <p className="text-[0.6rem] uppercase tracking-wider font-black text-white/60 mb-1">Demo creata con successo</p>
                        <h3 className="text-base font-black text-white">{leadName}</h3>
                        <p className="text-xs text-white/70 mt-1 italic">"{result.brand.tagline}"</p>
                      </div>
                    </div>
                  </div>

                  {/* KPI grid */}
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { icon: ShoppingBag, label: "Menu/Listino", value: result.brand.menuCount, color: "#a78bfa" },
                      { icon: Users, label: "Clienti CRM", value: result.brand.clientsCount, color: "#14b8a6" },
                      { icon: Zap, label: "Stile", value: result.scraped.hasBranding ? "Reale" : "AI", color: "#f59e0b" },
                    ].map((k, i) => (
                      <div key={i} className="rounded-xl p-3 border border-white/10 bg-white/[0.03]">
                        <k.icon className="w-3.5 h-3.5 mb-1" style={{ color: k.color }} />
                        <p className="text-[0.55rem] uppercase tracking-wider text-white/50 font-bold">{k.label}</p>
                        <p className="text-base font-black text-white">{k.value}</p>
                      </div>
                    ))}
                  </div>

                  {/* Palette */}
                  <div className="rounded-xl p-3 border border-white/10 bg-white/[0.02]">
                    <p className="text-[0.6rem] uppercase tracking-wider text-white/50 font-bold mb-2">Palette estratta</p>
                    <div className="flex gap-1.5">
                      {Object.entries(result.brand.palette).map(([k, v]) => (
                        <div key={k} className="flex-1 text-center">
                          <div className="w-full h-8 rounded-lg border border-white/10" style={{ background: v }} />
                          <p className="text-[0.55rem] text-white/40 mt-1 font-mono">{v}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Links */}
                  <div className="space-y-2">
                    <LinkRow label="Sito Demo" url={result.previewUrl} copied={copied === "Sito"} onCopy={() => copy("Sito", result.previewUrl)} accent="#a78bfa" />
                    <LinkRow label="Pannello Admin" url={result.adminUrl} copied={copied === "Admin"} onCopy={() => copy("Admin", result.adminUrl)} accent="#14b8a6" />
                    {result.magicLink && (
                      <LinkRow label="Magic Link Lead (7gg)" url={result.magicLink} copied={copied === "Magic"} onCopy={() => copy("Magic", result.magicLink!)} accent="#f59e0b" highlight />
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
