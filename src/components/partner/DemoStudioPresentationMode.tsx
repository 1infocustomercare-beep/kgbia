/**
 * Demo Studio — Modalità "Pronta da Mostrare"
 *
 * Vista cinematografica fullscreen pensata per il venditore davanti al cliente.
 * Mostra TUTTI i mockup disponibili: suite generate dal partner + INTERO catalogo
 * (SECTOR_PORTFOLIO) di brand × stili. Switcher rapido con filtro per settore.
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
  Search,
} from "lucide-react";
import type { VaultMockupSuite } from "@/hooks/useMockupSuiteVault";
import { SECTOR_PORTFOLIO } from "@/data/sector-mockup-images";

interface Props {
  open: boolean;
  onClose: () => void;
  suites: VaultMockupSuite[];
  initialSuiteId?: string;
}

/** Modello unificato per tutto ciò che si può presentare */
interface Presentable {
  id: string;
  source: "suite" | "catalog";
  title: string;          // brand / business name
  subtitle: string;       // stile / settore
  sectorId: string;
  sectorLabel: string;
  accent: string;
  cover: string;
  screens: string[];
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
const ALL_SECTORS = "__all__";

export function DemoStudioPresentationMode({ open, onClose, suites, initialSuiteId }: Props) {
  // 1) Suite del partner (anche bozze) con almeno uno screen
  // 2) INTERO catalogo SECTOR_PORTFOLIO (brand × style)
  const presentables = useMemo<Presentable[]>(() => {
    const userSuites: Presentable[] = suites
      .map((s) => {
        const imgs = extractScreenImages(s);
        if (imgs.length === 0) return null;
        return {
          id: `suite-${s.id}`,
          source: "suite" as const,
          title: s.business_name,
          subtitle: s.business_sector || "Mockup personale",
          sectorId: (s.business_sector || "custom").toLowerCase(),
          sectorLabel: s.business_sector || "I tuoi mockup",
          accent: s.primary_color || "#a78bfa",
          cover: imgs[0],
          screens: imgs,
        };
      })
      .filter(Boolean) as Presentable[];

    const catalog: Presentable[] = [];
    SECTOR_PORTFOLIO.forEach((sector) => {
      sector.brands.forEach((brand) => {
        brand.styles.forEach((style) => {
          if (!style.screens?.length) return;
          catalog.push({
            id: `cat-${sector.sectorId}-${brand.name}-${style.name}`,
            source: "catalog",
            title: brand.name,
            subtitle: style.name,
            sectorId: String(sector.sectorId).toLowerCase(),
            sectorLabel: sector.sectorLabel,
            accent: "#a78bfa",
            cover: style.thumbnail || style.screens[0],
            screens: style.screens,
          });
        });
      });
    });

    return [...userSuites, ...catalog];
  }, [suites]);

  // Lista settori unica per il filtro
  const sectorOptions = useMemo(() => {
    const map = new Map<string, string>();
    presentables.forEach((p) => {
      if (!map.has(p.sectorId)) map.set(p.sectorId, p.sectorLabel);
    });
    return Array.from(map.entries()).map(([id, label]) => ({ id, label }));
  }, [presentables]);

  const [activeIdx, setActiveIdx] = useState(0);
  const [screenIdx, setScreenIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [sectorFilter, setSectorFilter] = useState<string>(ALL_SECTORS);
  const [search, setSearch] = useState("");

  // Init SOLO quando si apre (non quando presentables cambia, altrimenti resetta in loop)
  useEffect(() => {
    if (!open) return;
    setScreenIdx(0);
    setPaused(false);
    setSwitcherOpen(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  // Quando le suite caricano e c'è un initialSuiteId, salta a quella suite
  useEffect(() => {
    if (!open || !initialSuiteId) return;
    const found = presentables.findIndex((p) => p.id === `suite-${initialSuiteId}`);
    if (found >= 0) {
      setActiveIdx(found);
      setScreenIdx(0);
    }
  }, [open, initialSuiteId, presentables]);

  // Lock scroll body + true fullscreen
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const current = presentables[activeIdx];
  const screens = current?.screens || [];

  const nextScreen = useCallback(() => {
    if (!current || screens.length === 0) return;
    setScreenIdx((i) => (i + 1) % screens.length);
  }, [current, screens.length]);

  const prevScreen = useCallback(() => {
    if (!current || screens.length === 0) return;
    setScreenIdx((i) => (i - 1 + screens.length) % screens.length);
  }, [current, screens.length]);

  const nextItem = useCallback(() => {
    if (presentables.length <= 1) return;
    setActiveIdx((i) => (i + 1) % presentables.length);
    setScreenIdx(0);
  }, [presentables.length]);

  const prevItem = useCallback(() => {
    if (presentables.length <= 1) return;
    setActiveIdx((i) => (i - 1 + presentables.length) % presentables.length);
    setScreenIdx(0);
  }, [presentables.length]);

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
      if (e.key === "ArrowUp") prevItem();
      if (e.key === "ArrowDown") nextItem();
      if (e.key === " ") {
        e.preventDefault();
        setPaused((p) => !p);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, nextScreen, prevScreen, nextItem, prevItem, switcherOpen]);

  // Auto-advance screen
  useEffect(() => {
    if (!open || paused || screens.length <= 1 || switcherOpen) return;
    const t = setTimeout(nextScreen, AUTO_ADVANCE_MS);
    return () => clearTimeout(t);
  }, [open, paused, screens.length, screenIdx, activeIdx, nextScreen, switcherOpen]);

  // Filtro switcher
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return presentables.filter((p) => {
      if (sectorFilter !== ALL_SECTORS && p.sectorId !== sectorFilter) return false;
      if (q && !`${p.title} ${p.subtitle} ${p.sectorLabel}`.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [presentables, sectorFilter, search]);

  if (!open) return null;

  const accent = current?.accent || "#a78bfa";

  const content = (
    <motion.div
      key="presentation"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 z-[9999] bg-black"
        style={{ width: "100vw", height: "100dvh", overflow: "hidden", padding: 0, margin: 0 }}
      >
        {/* Top bar */}
        <div className="absolute top-0 inset-x-0 z-30 flex items-center justify-between px-3 py-2 bg-gradient-to-b from-black/80 to-transparent">
          <div className="flex items-center gap-2 text-white/80 text-[11px] uppercase tracking-wider min-w-0">
            <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
            <span className="hidden sm:inline">Pronta da mostrare</span>
            {presentables.length > 0 && (
              <span className="text-white/40 normal-case tracking-normal truncate">
                · {activeIdx + 1}/{presentables.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-1">
            {presentables.length > 0 && (
              <button
                onClick={() => setSwitcherOpen((v) => !v)}
                className={`p-2 rounded-full text-white transition flex items-center gap-1.5 ${
                  switcherOpen ? "bg-white/30" : "bg-white/10 hover:bg-white/20"
                }`}
                aria-label="Cambia mockup"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline text-[11px] font-semibold pr-1">Catalogo</span>
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

        {/* Empty */}
        {!current ? (
          <div className="absolute inset-0 flex items-center justify-center text-center px-8">
            <div>
              <Smartphone className="w-16 h-16 mx-auto text-white/40 mb-4" />
              <p className="text-white text-lg font-display font-bold">
                Nessun mockup disponibile
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
            <div
              className="absolute inset-0 opacity-30 pointer-events-none"
              style={{ background: `radial-gradient(circle at 50% 40%, ${accent}55, transparent 70%)` }}
            />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.6)_100%)] pointer-events-none" />

            <motion.div
              key={`${current.id}-${screenIdx}`}
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
                      alt={`${current.title} ${current.subtitle} ${screenIdx + 1}`}
                      className="w-full h-full object-cover object-top"
                      loading="eager"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/30 text-xs">
                      Caricamento...
                    </div>
                  )}
                </div>
                <div className="absolute top-2 sm:top-2.5 left-1/2 -translate-x-1/2 w-20 sm:w-24 h-5 sm:h-6 bg-black rounded-b-2xl z-10" />
              </div>
            </motion.div>

            {/* Brand label + dots */}
            <div className="absolute bottom-3 inset-x-0 z-10 flex flex-col items-center gap-1.5 pointer-events-none">
              <p className="text-white/85 text-xs sm:text-sm font-display drop-shadow-lg">
                {current.title}
                <span className="text-white/40"> · {current.subtitle}</span>
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

        {/* SWITCHER — catalogo completo + filtro settore + search */}
        <AnimatePresence>
          {switcherOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col"
            >
              {/* Header switcher */}
              <div className="px-4 pt-4 pb-3 shrink-0 border-b border-white/10">
                <div className="flex items-center justify-between gap-3 mb-3">
                  <div className="min-w-0">
                    <p className="text-white text-base font-bold">Catalogo mockup</p>
                    <p className="text-white/50 text-[11px]">
                      {filtered.length} di {presentables.length} mockup • brand × stile
                    </p>
                  </div>
                  <button
                    onClick={() => setSwitcherOpen(false)}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white shrink-0"
                    aria-label="Chiudi catalogo"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* Search */}
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white/40" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Cerca brand, stile o settore…"
                    className="w-full bg-white/10 border border-white/10 rounded-lg pl-9 pr-3 py-2 text-[13px] text-white placeholder:text-white/40 focus:outline-none focus:border-white/30"
                  />
                </div>

                {/* Filtro settori */}
                <div className="flex gap-1.5 overflow-x-auto pb-1 -mx-1 px-1">
                  <button
                    onClick={() => setSectorFilter(ALL_SECTORS)}
                    className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition whitespace-nowrap ${
                      sectorFilter === ALL_SECTORS
                        ? "bg-white text-black"
                        : "bg-white/10 text-white hover:bg-white/20"
                    }`}
                  >
                    Tutti ({presentables.length})
                  </button>
                  {sectorOptions.map((s) => {
                    const count = presentables.filter((p) => p.sectorId === s.id).length;
                    return (
                      <button
                        key={s.id}
                        onClick={() => setSectorFilter(s.id)}
                        className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] font-semibold transition whitespace-nowrap ${
                          sectorFilter === s.id
                            ? "bg-white text-black"
                            : "bg-white/10 text-white hover:bg-white/20"
                        }`}
                      >
                        {s.label} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Griglia */}
              <div className="flex-1 overflow-y-auto px-4 py-4">
                {filtered.length === 0 ? (
                  <p className="text-white/50 text-sm text-center py-12">
                    Nessun mockup trovato.
                  </p>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {filtered.map((p) => {
                      const active = p.id === current?.id;
                      const realIdx = presentables.findIndex((x) => x.id === p.id);
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            setActiveIdx(realIdx);
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
                          {p.cover ? (
                            <img
                              src={p.cover}
                              alt={`${p.title} ${p.subtitle}`}
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
                              {p.title}
                            </p>
                            <p className="text-white/60 text-[9px] truncate">{p.subtitle}</p>
                            <p className="text-white/40 text-[9px] mt-0.5">
                              {p.screens.length} screen{p.screens.length === 1 ? "" : "s"}
                            </p>
                          </div>
                          {/* Badge sorgente */}
                          <div
                            className={`absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded text-[8px] font-bold uppercase tracking-wider ${
                              p.source === "suite"
                                ? "bg-amber-400 text-black"
                                : "bg-white/20 text-white backdrop-blur"
                            }`}
                          >
                            {p.source === "suite" ? "Tuo" : "Catalogo"}
                          </div>
                          {active && (
                            <div
                              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-black"
                              style={{ background: p.accent }}
                            >
                              ✓
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </AnimatePresence>
  );

  return typeof document !== "undefined" ? createPortal(content, document.body) : content;
}
