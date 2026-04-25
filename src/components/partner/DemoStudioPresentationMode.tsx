/**
 * Demo Studio — Modalità "Pronta da Mostrare"
 *
 * Vista cinematografica fullscreen pensata per il venditore davanti al cliente.
 * Mostra tutte le preview disponibili (anche bozze) in fullscreen reale, con
 * switcher rapido per cambiare suite/screen al volo.
 */
import { useEffect, useMemo, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  Pause,
  Play,
  Smartphone,
  LayoutGrid,
} from "lucide-react";
import type { VaultMockupSuite } from "@/hooks/useMockupSuiteVault";

interface Props {
  open: boolean;
  onClose: () => void;
  suites: VaultMockupSuite[];
  initialSuiteId?: string;
}

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

const AUTO_ADVANCE_MS = 6000;

export function DemoStudioPresentationMode({ open, onClose, suites, initialSuiteId }: Props) {
  // Mostra TUTTE le suite con almeno uno screen (non solo "complete")
  const ready = useMemo(
    () => suites.filter((s) => extractScreenImages(s).length > 0),
    [suites],
  );

  const [suiteIdx, setSuiteIdx] = useState(0);
  const [screenIdx, setScreenIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Init quando si apre
  useEffect(() => {
    if (!open) return;
    const idx = initialSuiteId ? Math.max(0, ready.findIndex((s) => s.id === initialSuiteId)) : 0;
    setSuiteIdx(idx >= 0 ? idx : 0);
    setScreenIdx(0);
    setPaused(false);
    setSwitcherOpen(false);
  }, [open, initialSuiteId, ready]);

  // Lock scroll del body quando aperto + true fullscreen
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  const currentSuite = ready[suiteIdx];
  const screens = currentSuite ? extractScreenImages(currentSuite) : [];

  const nextScreen = useCallback(() => {
    if (!currentSuite || screens.length === 0) return;
    setScreenIdx((i) => (i + 1) % screens.length);
  }, [currentSuite, screens.length]);

  const prevScreen = useCallback(() => {
    if (!currentSuite || screens.length === 0) return;
    setScreenIdx((i) => (i - 1 + screens.length) % screens.length);
  }, [currentSuite, screens.length]);

  const nextSuite = useCallback(() => {
    if (ready.length <= 1) return;
    setSuiteIdx((i) => (i + 1) % ready.length);
    setScreenIdx(0);
  }, [ready.length]);

  const prevSuite = useCallback(() => {
    if (ready.length <= 1) return;
    setSuiteIdx((i) => (i - 1 + ready.length) % ready.length);
    setScreenIdx(0);
  }, [ready.length]);

  // Tastiera
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (switcherOpen) setSwitcherOpen(false);
        else onClose();
      }
      if (e.key === "ArrowRight") nextScreen();
      if (e.key === "ArrowLeft") prevScreen();
      if (e.key === "ArrowUp") prevSuite();
      if (e.key === "ArrowDown") nextSuite();
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, nextScreen, prevScreen, nextSuite, prevSuite, switcherOpen]);

  // Auto-advance
  useEffect(() => {
    if (!open || paused || screens.length <= 1 || switcherOpen) return;
    const t = setTimeout(nextScreen, AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [open, paused, screens.length, screenIdx, suiteIdx, nextScreen, switcherOpen]);

  if (!open) return null;

  const businessName = currentSuite?.business_name || "Il tuo brand";
  const sector = currentSuite?.business_sector || "";
  const accent = currentSuite?.primary_color || "#a78bfa";

  const content = (
    <AnimatePresence>
      <motion.div
        key="presentation"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[9999] bg-black"
        style={{
          width: "100vw",
          height: "100dvh",
          overflow: "hidden",
          padding: 0,
          margin: 0,
        }}
      >
        {/* Top bar minimal */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white/80 text-[11px] uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Pronta da mostrare</span>
            {ready.length > 0 && (
              <span className="text-white/40 normal-case tracking-normal">
                · {suiteIdx + 1}/{ready.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {ready.length > 0 && (
              <button
                onClick={() => setSwitcherOpen((v) => !v)}
                className={`p-2 rounded-full text-white transition ${
                  switcherOpen ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label="Cambia mockup"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
            )}
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

        {/* Empty state */}
        {!currentSuite ? (
          <div className="absolute inset-0 flex items-center justify-center text-center px-8">
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
          <div className="absolute inset-0 flex items-center justify-center">
            {/* Background gradient cinematografico */}
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{
                background: `radial-gradient(circle at 50% 40%, ${accent}55, transparent 70%)`,
              }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            {/* iPhone frame — DIMENSIONI MASSIME, perfettamente centrato */}
            <motion.div
              key={`${currentSuite.id}-${screenIdx}`}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.35 }}
              className="relative z-10"
              style={{
                height: "min(86dvh, calc(96vw * 19 / 9))",
                width: "min(96vw, calc(86dvh * 9 / 19))",
                maxHeight: "900px",
              }}
            >
              <div
                className="relative w-full h-full rounded-[2.5rem] sm:rounded-[3rem] p-2 sm:p-2.5 shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #1a1a1a, #000)",
                  boxShadow: `0 30px 80px ${accent}40, 0 0 0 1px rgba(255,255,255,0.05)`,
                }}
              >
                <div className="rounded-[2rem] sm:rounded-[2.5rem] overflow-hidden bg-black w-full h-full">
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
                <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-b-2xl z-10" />
              </div>
            </motion.div>

            {/* Brand label + dot indicator (overlay basso) */}
            <div className="absolute bottom-3 inset-x-0 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
              <p className="text-white/85 text-xs sm:text-sm font-display drop-shadow-lg">
                {businessName}
                {sector && <span className="text-white/40"> · {sector}</span>}
              </p>
              {screens.length > 1 && (
                <div className="flex gap-1.5">
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
            </div>

            {/* Frecce screen */}
            {screens.length > 1 && (
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
          </div>
        )}

        {/* SWITCHER RAPIDO — overlay con tutte le suite */}
        <AnimatePresence>
          {switcherOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 bg-black/85 backdrop-blur-md flex flex-col"
              onClick={() => setSwitcherOpen(false)}
            >
              <div className="flex items-center justify-between px-4 pt-4 pb-2 shrink-0">
                <div>
                  <p className="text-white text-sm font-bold">Scegli mockup</p>
                  <p className="text-white/50 text-[11px]">{ready.length} disponibili</p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSwitcherOpen(false);
                  }}
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"
                  aria-label="Chiudi switcher"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-4 pb-6">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                  {ready.map((s, i) => {
                    const imgs = extractScreenImages(s);
                    const cover = imgs[0];
                    const active = i === suiteIdx;
                    return (
                      <button
                        key={s.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setSuiteIdx(i);
                          setScreenIdx(0);
                          setSwitcherOpen(false);
                        }}
                        className={`relative rounded-xl overflow-hidden bg-black/60 border-2 transition-all text-left ${
                          active
                            ? "border-white scale-[1.02] shadow-xl"
                            : "border-white/10 hover:border-white/40"
                        }`}
                        style={{ aspectRatio: "9/19" }}
                      >
                        {cover ? (
                          <img
                            src={cover}
                            alt={s.business_name}
                            className="w-full h-full object-cover object-top"
                            loading="lazy"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                            —
                          </div>
                        )}
                        <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/95 via-black/70 to-transparent">
                          <p className="text-white text-[11px] font-semibold truncate">
                            {s.business_name}
                          </p>
                          {s.business_sector && (
                            <p className="text-white/60 text-[9px] truncate">
                              {s.business_sector}
                            </p>
                          )}
                          <p className="text-white/40 text-[9px] mt-0.5">
                            {imgs.length} screen{imgs.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        {active && (
                          <div
                            className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                            style={{ background: s.primary_color || "#a78bfa" }}
                          >
                            ✓
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );

  // Render via portal direttamente nel body per evitare padding/overflow di layout genitori
  return typeof document !== "undefined"
    ? createPortal(content, document.body)
    : content;
}
