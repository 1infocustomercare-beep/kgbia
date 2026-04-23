/**
 * Demo Studio — Modalità "Pronta da Mostrare"
 *
 * Vista cinematografica fullscreen pensata per il venditore davanti al cliente.
 * Mostra SOLO le preview dei mockup approvati in un flusso guidato di 60 secondi:
 *   1. Hero (3s)  — "Ecco il TUO sito"
 *   2. Preview (45s) — swipe orizzontale tra screens del mockup
 *   3. Wow (7s)   — "Tutto questo è già pronto, oggi"
 *   4. CTA (5s)   — "Lo attiviamo insieme adesso?"
 *
 * Nasconde: dati sensibili, bottoni admin, costi, crediti, lead, URL tecnici.
 */
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Rocket,
  Pause,
  Play,
  Smartphone,
} from "lucide-react";
import type { VaultMockupSuite } from "@/hooks/useMockupSuiteVault";

interface Props {
  open: boolean;
  onClose: () => void;
  suites: VaultMockupSuite[];
  initialSuiteId?: string;
}

type Stage = "hero" | "preview" | "wow" | "cta";

const STAGE_DURATION_MS: Record<Stage, number> = {
  hero: 0,        // skip intro: apri direttamente sulla preview a tutto schermo
  preview: 60000, // 60s di preview prima del wow
  wow: 7000,
  cta: 5000,
};

// Hero rimosso dall'ordine: l'utente vuole vedere subito la preview grande
const STAGE_ORDER: Stage[] = ["preview", "wow", "cta"];

function extractScreenImages(suite: VaultMockupSuite): string[] {
  const screens = suite.screens;
  if (!screens) return [];
  if (Array.isArray(screens)) {
    return screens
      .map((s: any) => s?.image_url || s?.url || s?.src || (typeof s === "string" ? s : null))
      .filter(Boolean) as string[];
  }
  if (typeof screens === "object") {
    return Object.values(screens)
      .map((s: any) => s?.image_url || s?.url || s?.src || (typeof s === "string" ? s : null))
      .filter(Boolean) as string[];
  }
  return [];
}

export function DemoStudioPresentationMode({ open, onClose, suites, initialSuiteId }: Props) {
  const ready = useMemo(
    () => suites.filter((s) => s.status === "complete" && extractScreenImages(s).length > 0),
    [suites],
  );

  const [suiteIdx, setSuiteIdx] = useState(0);
  const [screenIdx, setScreenIdx] = useState(0);
  const [stage, setStage] = useState<Stage>("hero");
  const [paused, setPaused] = useState(false);

  // Init quando si apre — apri DIRETTAMENTE sulla preview a tutto schermo
  useEffect(() => {
    if (!open) return;
    const idx = initialSuiteId ? Math.max(0, ready.findIndex((s) => s.id === initialSuiteId)) : 0;
    setSuiteIdx(idx >= 0 ? idx : 0);
    setScreenIdx(0);
    setStage("preview");
    setPaused(false);
  }, [open, initialSuiteId, ready]);

  // ESC chiude
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") nextScreen();
      if (e.key === "ArrowLeft") prevScreen();
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const currentSuite = ready[suiteIdx];
  const screens = currentSuite ? extractScreenImages(currentSuite) : [];

  // Auto-advance stage (skip "hero" — non più nel flusso)
  useEffect(() => {
    if (!open || paused || !currentSuite) return;
    const duration = STAGE_DURATION_MS[stage];
    if (duration <= 0) return;
    const t = setTimeout(() => {
      const i = STAGE_ORDER.indexOf(stage);
      const next = STAGE_ORDER[(i + 1) % STAGE_ORDER.length];
      setStage(next);
      if (next === "preview") setScreenIdx(0);
    }, duration);
    return () => clearTimeout(t);
  }, [stage, open, paused, currentSuite]);

  // Auto-advance screen durante stage "preview"
  useEffect(() => {
    if (!open || paused || stage !== "preview" || screens.length <= 1) return;
    const perScreen = Math.max(2000, Math.floor(STAGE_DURATION_MS.preview / screens.length));
    const t = setTimeout(() => {
      setScreenIdx((i) => (i + 1) % screens.length);
    }, perScreen);
    return () => clearTimeout(t);
  }, [screenIdx, stage, open, paused, screens.length]);

  if (!open) return null;

  const nextScreen = () => {
    if (!currentSuite) return;
    if (screens.length === 0) return;
    setScreenIdx((i) => (i + 1) % screens.length);
    setStage("preview");
  };
  const prevScreen = () => {
    if (!currentSuite) return;
    if (screens.length === 0) return;
    setScreenIdx((i) => (i - 1 + screens.length) % screens.length);
    setStage("preview");
  };

  const nextSuite = () => {
    if (ready.length <= 1) return;
    setSuiteIdx((i) => (i + 1) % ready.length);
    setScreenIdx(0);
    setStage("preview");
  };
  const prevSuite = () => {
    if (ready.length <= 1) return;
    setSuiteIdx((i) => (i - 1 + ready.length) % ready.length);
    setScreenIdx(0);
    setStage("preview");
  };

  const businessName = currentSuite?.business_name || "Il tuo brand";
  const sector = currentSuite?.business_sector || "";
  const accent = currentSuite?.primary_color || "#a78bfa";

  return (
    <AnimatePresence>
      <motion.div
        key="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[200] bg-black overflow-hidden"
      >
        {/* Top bar minimal — solo per il venditore */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between p-3 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white/80 text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            Pronta da mostrare
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setPaused((p) => !p)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label={paused ? "Riprendi" : "Pausa"}
            >
              {paused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
              aria-label="Chiudi"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Stage progress dots */}
        <div className="absolute top-12 inset-x-0 z-30 flex justify-center gap-1.5 px-4">
          {STAGE_ORDER.map((s) => (
            <div
              key={s}
              className={`h-0.5 rounded-full transition-all ${
                s === stage ? "w-8 bg-white" : "w-4 bg-white/30"
              }`}
            />
          ))}
        </div>

        {/* Empty state */}
        {!currentSuite ? (
          <div className="h-full flex items-center justify-center text-center px-8">
            <div>
              <Smartphone className="w-16 h-16 mx-auto text-white/40 mb-4" />
              <p className="text-white text-lg font-display font-bold">
                Nessun mockup pronto da mostrare
              </p>
              <p className="text-white/60 text-sm mt-2">
                Genera prima un Mockup Suite per attivare la modalità presentazione.
              </p>
              <button
                onClick={onClose}
                className="mt-6 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-semibold"
              >
                Chiudi
              </button>
            </div>
          </div>
        ) : (
          <div className="relative h-full w-full flex items-center justify-center">
            {/* Background gradient cinematografico */}
            <div
              className="absolute inset-0 opacity-30"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${accent}55, transparent 70%)`,
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)]" />

            {/* Stage content */}
            <AnimatePresence mode="wait">
              {stage === "hero" && (
                <motion.div
                  key="hero"
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 text-center px-8"
                >
                  <div className="text-[10px] uppercase tracking-[0.3em] text-white/60 mb-3">
                    Anteprima esclusiva
                  </div>
                  <h1 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight">
                    Ecco il <span style={{ color: accent }}>tuo</span> nuovo sito
                  </h1>
                  <p className="text-white/70 text-base mt-3">
                    {businessName}
                    {sector && <span className="text-white/40"> · {sector}</span>}
                  </p>
                </motion.div>
              )}

              {stage === "preview" && (
                <motion.div
                  key={`preview-${screenIdx}`}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.4 }}
                  className="relative z-10 flex flex-col items-center justify-center w-full h-full px-4"
                >
                  {/* iPhone-style frame */}
                  <div className="relative" style={{ width: "min(280px, 70vw)" }}>
                    <div
                      className="relative rounded-[2.5rem] p-2 shadow-2xl"
                      style={{
                        background: "linear-gradient(135deg, #1a1a1a, #000)",
                        boxShadow: `0 30px 80px ${accent}40, 0 0 0 1px rgba(255,255,255,0.05)`,
                      }}
                    >
                      <div className="rounded-[2rem] overflow-hidden bg-black aspect-[9/19]">
                        {screens[screenIdx] ? (
                          <img
                            src={screens[screenIdx]}
                            alt={`${businessName} preview ${screenIdx + 1}`}
                            className="w-full h-full object-cover object-top"
                            loading="eager"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                            Caricamento...
                          </div>
                        )}
                      </div>
                      {/* Notch */}
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-20 h-5 bg-black rounded-b-2xl" />
                    </div>
                  </div>

                  <p className="text-white/80 text-sm mt-6 text-center font-display">
                    {businessName}
                  </p>
                  {screens.length > 1 && (
                    <div className="flex gap-1.5 mt-3">
                      {screens.map((_, i) => (
                        <div
                          key={i}
                          className={`h-1 rounded-full transition-all ${
                            i === screenIdx ? "w-6 bg-white" : "w-1.5 bg-white/30"
                          }`}
                        />
                      ))}
                    </div>
                  )}
                </motion.div>
              )}

              {stage === "wow" && (
                <motion.div
                  key="wow"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 text-center px-8 max-w-md"
                >
                  <Sparkles
                    className="w-12 h-12 mx-auto mb-4"
                    style={{ color: accent }}
                  />
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                    Tutto questo è <span style={{ color: accent }}>già pronto</span>, oggi.
                  </h2>
                  <div className="grid grid-cols-3 gap-3 mt-6">
                    {[
                      { v: "100%", l: "su misura" },
                      { v: "0", l: "template" },
                      { v: "24h", l: "attivazione" },
                    ].map((s) => (
                      <div
                        key={s.l}
                        className="p-3 rounded-xl bg-white/5 border border-white/10"
                      >
                        <div
                          className="text-xl font-bold font-display"
                          style={{ color: accent }}
                        >
                          {s.v}
                        </div>
                        <div className="text-[10px] uppercase text-white/60 mt-1">
                          {s.l}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

              {stage === "cta" && (
                <motion.div
                  key="cta"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.5 }}
                  className="relative z-10 text-center px-8 max-w-md"
                >
                  <Rocket
                    className="w-14 h-14 mx-auto mb-4"
                    style={{ color: accent }}
                  />
                  <h2 className="text-3xl md:text-4xl font-display font-bold text-white leading-tight">
                    Lo attiviamo <span style={{ color: accent }}>insieme</span> adesso?
                  </h2>
                  <p className="text-white/70 text-sm mt-3">
                    {businessName} online entro 24 ore. Zero impegni a lungo termine.
                  </p>
                  <div
                    className="mt-6 inline-block px-8 py-3 rounded-2xl font-bold text-black"
                    style={{ background: accent }}
                  >
                    Iniziamo →
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Navigation arrows (visibili solo durante preview) */}
            {stage === "preview" && screens.length > 1 && (
              <>
                <button
                  onClick={prevScreen}
                  className="absolute left-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur"
                  aria-label="Schermata precedente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={nextScreen}
                  className="absolute right-2 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur"
                  aria-label="Schermata successiva"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* Bottom: navigazione tra mockup */}
            {ready.length > 1 && (
              <div className="absolute bottom-6 inset-x-0 z-20 flex items-center justify-center gap-3">
                <button
                  onClick={prevSuite}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur"
                >
                  ← Brand
                </button>
                <span className="text-white/50 text-[11px]">
                  {suiteIdx + 1} / {ready.length}
                </span>
                <button
                  onClick={nextSuite}
                  className="px-3 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs backdrop-blur"
                >
                  Brand →
                </button>
              </div>
            )}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
