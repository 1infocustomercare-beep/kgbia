/**
 * ═══ JET CONCIERGE FAB ═══
 * Pillola concierge fissa in basso a destra (pattern del sito di riferimento),
 * con pannello di chat dimostrativo.
 *
 * ADDITIVO — solo presentazione.
 */
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { MessageCircle, Send, X } from "lucide-react";

const SCRIPT = [
  { from: "bot", text: "Buonasera. Sono Livia, concierge Aurea. Dove la porto?" },
  { from: "user", text: "Milano → Nizza, domani mattina, 4 passeggeri." },
  { from: "bot", text: "Light disponibile alle 09:20 da Linate Prime. Volo 55 minuti, transfer incluso." },
  { from: "bot", text: "Confermo l’opzione e le invio il preventivo firmato in 4 minuti?" },
];

export default function JetConciergeFab() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pointer-events-none fixed bottom-24 right-4 z-[60] flex max-w-[calc(100vw-2rem)] flex-col items-end gap-3 md:bottom-7 md:right-7">
      <AnimatePresence>
        {open && (
          <motion.div
            className="pointer-events-auto w-[min(84vw,340px)] overflow-hidden rounded-2xl border border-border/60 bg-card/90 shadow-[0_30px_80px_-30px_rgba(0,0,0,0.9)] backdrop-blur-2xl"
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.97 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
              <div>
                <p className="font-heading text-sm font-semibold">Concierge Aurea</p>
                <p className="text-[9px] uppercase tracking-[0.2em] text-primary">Assistente AI · 24/7</p>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Chiudi il concierge"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-border/60"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex max-h-[46svh] flex-col gap-2.5 overflow-y-auto px-4 py-4">
              {SCRIPT.map((m, i) => (
                <motion.p
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.12 * i, duration: 0.35 }}
                  className={`max-w-[86%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed ${
                    m.from === "bot"
                      ? "self-start border border-border/60 bg-background/70 text-foreground/85"
                      : "self-end bg-primary text-primary-foreground"
                  }`}
                >
                  {m.text}
                </motion.p>
              ))}
            </div>
            <div className="flex items-center gap-2 border-t border-border/60 px-3 py-3">
              <span className="flex-1 truncate rounded-full border border-border/60 bg-background/60 px-3.5 py-2.5 text-xs text-muted-foreground">
                Scrivi la tua rotta…
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Send className="h-4 w-4" />
              </span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Apri il concierge Aurea"
          className="pointer-events-auto group flex h-12 w-12 items-center justify-center rounded-full border border-primary/45 shadow-[0_20px_50px_-20px_rgba(0,0,0,0.9)] backdrop-blur-md transition-transform hover:-translate-y-0.5 md:h-auto md:w-auto md:gap-2.5 md:px-4 md:py-3"
          style={{ background: "hsl(30 8% 8% / 0.92)", color: "hsl(40 26% 95%)" }}
        >
          <MessageCircle className="h-5 w-5 text-primary" />
          <span className="hidden text-left md:block">
            <span className="block font-heading text-sm leading-none">Concierge</span>
            <span className="mt-1 block text-[9px] uppercase tracking-[0.16em] text-primary/85">Assistente AI</span>
          </span>
        </button>

      )}
    </div>
  );
}
