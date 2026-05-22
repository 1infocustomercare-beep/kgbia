import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Eye, Check, Smartphone, Monitor, ShieldCheck, Wand2 } from "lucide-react";
import {
  TEMPLATES,
  renderTemplate,
  type EmailTemplate,
  type TemplateVariables,
} from "@/lib/email-templates/aurora-templates";

interface Props {
  variables: TemplateVariables;
  selectedId?: string;
  recommendedId?: string;
  recommendedReason?: string;
  onSelect: (id: string, rendered: { subject: string; html: string; text: string }) => void;
  /** restringe i template visibili al settore del lead */
  sectorHint?: string;
}

/**
 * Card grid + preview live di tutti i template Aurora, con AI pick visibile in cima.
 */
export default function EmailTemplatePicker({
  variables,
  selectedId,
  recommendedId,
  recommendedReason,
  onSelect,
  sectorHint,
}: Props) {
  const [activeId, setActiveId] = useState<string>(selectedId || recommendedId || TEMPLATES[0].id);
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");

  const sortedTemplates = useMemo(() => {
    const arr = [...TEMPLATES];
    arr.sort((a, b) => {
      // recommended first
      if (a.id === recommendedId) return -1;
      if (b.id === recommendedId) return 1;
      // poi per fit settoriale
      const aFit = sectorHint && a.bestFor.includes(sectorHint) ? 1 : 0;
      const bFit = sectorHint && b.bestFor.includes(sectorHint) ? 1 : 0;
      if (aFit !== bFit) return bFit - aFit;
      return b.conversionScore - a.conversionScore;
    });
    return arr;
  }, [recommendedId, sectorHint]);

  const active: EmailTemplate = useMemo(
    () => sortedTemplates.find((t) => t.id === activeId) || sortedTemplates[0],
    [activeId, sortedTemplates]
  );

  const rendered = useMemo(() => renderTemplate(active.id, variables), [active.id, variables]);

  const handlePick = (t: EmailTemplate) => {
    setActiveId(t.id);
    const r = renderTemplate(t.id, variables);
    if (r) onSelect(t.id, r);
  };

  return (
    <div className="space-y-3">
      {recommendedId && (
        <div className="rounded-xl border border-violet-400/30 bg-gradient-to-r from-violet-500/10 to-cyan-500/10 px-3 py-2 flex items-start gap-2">
          <Sparkles className="w-4 h-4 text-violet-400 mt-0.5 shrink-0" />
          <div className="min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-wider text-violet-300">AI consiglia: {TEMPLATES.find(t => t.id === recommendedId)?.name}</p>
            {recommendedReason && <p className="text-xs text-muted-foreground mt-0.5">{recommendedReason}</p>}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {sortedTemplates.map((t) => {
          const isActive = t.id === activeId;
          const isRecommended = t.id === recommendedId;
          const isFit = sectorHint && t.bestFor.includes(sectorHint);
          return (
            <motion.button
              key={t.id}
              type="button"
              whileTap={{ scale: 0.97 }}
              onClick={() => handlePick(t)}
              className={`relative text-left rounded-xl border p-2.5 transition-all overflow-hidden ${
                isActive
                  ? "border-violet-400 bg-gradient-to-br from-violet-500/20 to-cyan-500/10 shadow-lg shadow-violet-500/20"
                  : "border-white/10 bg-white/5 hover:border-violet-400/50 hover:bg-white/10"
              }`}
            >
              {isRecommended && (
                <div className="absolute top-1 right-1 px-1.5 py-0.5 rounded-md bg-gradient-to-r from-violet-500 to-cyan-500 text-[8px] font-black uppercase tracking-wider text-white">AI</div>
              )}
              {isActive && !isRecommended && (
                <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-violet-500 flex items-center justify-center"><Check className="w-2.5 h-2.5 text-white" /></div>
              )}
              <p className="text-[11px] font-bold text-zinc-100 leading-tight pr-5">{t.name.replace(" — Aurora", "")}</p>
              <p className="text-[9.5px] text-muted-foreground mt-1 line-clamp-2 leading-snug">{t.description}</p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/20 text-violet-200 font-bold">{t.conversionScore}/100</span>
                {isFit && <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold">FIT</span>}
                <span className="text-[9px] text-zinc-500">{t.estimatedReadTime}</span>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Preview */}
      <div className="rounded-xl border border-white/10 bg-zinc-950/50 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/[0.03]">
          <div className="flex items-center gap-2 min-w-0">
            <Eye className="w-3.5 h-3.5 text-violet-400 shrink-0" />
            <p className="text-[11px] font-bold text-zinc-200 truncate">Preview · {active.name}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={() => setDevice("desktop")}
              className={`p-1.5 rounded-md transition-colors ${device === "desktop" ? "bg-violet-500/30 text-violet-200" : "text-zinc-500 hover:text-muted-foreground"}`}
              aria-label="Anteprima desktop"
            >
              <Monitor className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setDevice("mobile")}
              className={`p-1.5 rounded-md transition-colors ${device === "mobile" ? "bg-violet-500/30 text-violet-200" : "text-zinc-500 hover:text-muted-foreground"}`}
              aria-label="Anteprima mobile"
            >
              <Smartphone className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="px-3 py-2 border-b border-white/5 bg-zinc-900/40">
          <p className="text-[10px] uppercase tracking-wider text-zinc-500 font-bold">Oggetto</p>
          <p className="text-sm text-zinc-100 font-medium truncate">{rendered?.subject}</p>
        </div>

        <div className="bg-[#f5f3ff] flex justify-center p-2 max-h-[420px] overflow-y-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={active.id + device}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="bg-white rounded-lg shadow-xl"
              style={{ width: device === "mobile" ? 320 : 600, maxWidth: "100%" }}
            >
              <iframe
                title="email-preview"
                srcDoc={rendered?.html}
                sandbox=""
                className="w-full"
                style={{ height: 420, border: "none", borderRadius: 8 }}
              />
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="flex items-center justify-between px-3 py-2 border-t border-white/10 bg-white/[0.03] gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            HTML inline-style · GDPR opt-out incluso
          </div>
          <button
            type="button"
            onClick={() => rendered && onSelect(active.id, rendered)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-gradient-to-r from-violet-500 to-cyan-500 text-white text-[11px] font-bold hover:opacity-90 transition-opacity"
          >
            <Wand2 className="w-3 h-3" />
            Usa questo template
          </button>
        </div>
      </div>
    </div>
  );
}
