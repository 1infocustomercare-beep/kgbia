/**
 * MockupLightbox — fullscreen viewer for a group of mockup variants.
 *
 * - Opens on any card click (Home + Portfolio).
 * - ESC closes; ← / → cycle variants; number keys jump within the screen sequence.
 * - Renders ONE big IPhoneProMaxFrame for the active screen + a filmstrip of
 *   the coherent screen sequence (Home → Menu → Dettaglio → Prenotazione).
 * - Side panel shows brand, style, palette, features.
 */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import IPhoneProMaxFrame from "./IPhoneProMaxFrame";
import LiveMockupScreen from "./LiveMockupScreen";
import type { MockupScreen, SectorMockupVariant } from "@/data/sector-mockups";

type Props = {
  open: boolean;
  onClose: () => void;
  sectorLabel: string;
  variants: SectorMockupVariant[];
  initialIndex?: number;
};

export default function MockupLightbox({
  open,
  onClose,
  sectorLabel,
  variants,
  initialIndex = 0,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [screenIdx, setScreenIdx] = useState(0);

  useEffect(() => {
    if (open) {
      setIndex(Math.min(Math.max(0, initialIndex), variants.length - 1));
      setScreenIdx(0);
    }
  }, [open, initialIndex, variants.length]);

  // Reset screen index when the variant changes
  useEffect(() => {
    setScreenIdx(0);
  }, [index]);

  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % variants.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + variants.length) % variants.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, variants.length]);

  const current = variants[index];
  const screens = current?.screens?.length ? current.screens : [];
  const activeScreen = screens[Math.min(screenIdx, screens.length - 1)];

  const phoneWidth = useMemo(() => {
    if (typeof window === "undefined") return 300;
    const maxH = window.innerHeight * (window.innerWidth < 768 ? 0.58 : 0.7);
    const wFromH = Math.floor((maxH * 9) / 19.5);
    const maxW = Math.min(window.innerWidth * (window.innerWidth < 768 ? 0.58 : 0.36), 340);
    return Math.max(window.innerWidth < 420 ? 190 : 220, Math.min(wFromH, maxW));
  }, [open, index]);
  const compactPhone = phoneWidth < 250;

  if (!open || !current || !activeScreen || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Mockup ${current.brand} — ${current.style}`}
      className="fixed inset-0 z-[9999] flex items-start justify-center overflow-y-auto overflow-x-hidden overscroll-contain md:items-center"
      style={{ background: "rgba(6,7,12,0.94)", backdropFilter: "blur(18px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="fixed right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/15"
      >
        <X size={20} />
      </button>

      {/* Prev / Next variant */}
      {variants.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + variants.length) % variants.length);
            }}
            aria-label="Variante precedente"
            className="fixed left-3 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % variants.length);
            }}
            aria-label="Variante successiva"
            className="fixed right-3 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className="relative mx-3 flex w-full max-w-6xl flex-col items-center gap-6 px-2 pb-12 pt-16 sm:mx-4 md:flex-row md:items-start md:justify-center md:gap-10 md:py-10"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: big phone + filmstrip */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
            {activeScreen.label} · {screenIdx + 1}/{screens.length}
          </div>
          <IPhoneProMaxFrame
            alt={`${current.brand} — ${activeScreen.label}`}
            width={phoneWidth}
            loading="eager"
          >
            <LiveMockupScreen variant={current} screen={activeScreen} compact={compactPhone} />
          </IPhoneProMaxFrame>
          {activeScreen.caption && (
            <p className="max-w-xs text-center text-xs leading-relaxed text-white/70">
              {activeScreen.caption}
            </p>
          )}

          {/* Filmstrip: coherent screen sequence */}
          {screens.length > 1 && (
            <div className="mt-2 grid grid-cols-4 justify-items-center gap-2 sm:flex sm:flex-wrap sm:items-end sm:justify-center sm:gap-3">
              {screens.map((s, i) => {
                const active = i === screenIdx;
                // FLAT thumbnails only — no nested iPhone frames.
                return (
                  <button
                    key={s.label + i}
                    onClick={() => setScreenIdx(i)}
                    aria-label={`Mostra ${s.label}`}
                    aria-current={active}
                    className="group flex flex-col items-center gap-1.5 transition"
                    style={{ opacity: active ? 1 : 0.6 }}
                  >
                    <MiniScreenThumb variant={current} screen={s} active={active} />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-white/80">
                      {s.label}
                    </span>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Info panel */}
        <aside className="flex w-full max-w-md flex-col gap-5 text-white md:max-w-sm md:pt-6">
          <div className="flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-white/60">
            <Sparkles size={12} />
            {sectorLabel} · {index + 1}/{variants.length}
          </div>
          <div>
            <div className="text-2xl font-semibold leading-tight md:text-3xl">
              {current.brand}
            </div>
            <div className="mt-1 text-sm text-white/70">{current.style}</div>
          </div>
          <p className="text-sm leading-relaxed text-white/80">{current.description}</p>

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Palette
            </div>
            <span className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85">
              {current.palette}
            </span>
          </div>

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Sequenza schermate
            </div>
            <ol className="grid grid-cols-1 gap-1.5 text-sm text-white/85">
              {screens.map((s, i) => (
                <li key={s.label + i} className="flex items-center gap-2">
                  <span
                    className="grid h-5 w-5 shrink-0 place-items-center rounded-full text-[10px] font-bold"
                    style={{
                      background: i === screenIdx ? "white" : "rgba(255,255,255,0.1)",
                      color: i === screenIdx ? "#0b0b12" : "rgba(255,255,255,0.85)",
                    }}
                  >
                    {i + 1}
                  </span>
                  {s.label}
                </li>
              ))}
            </ol>
          </div>

          <div>
            <div className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-white/50">
              Funzioni in schermata
            </div>
            <ul className="grid grid-cols-1 gap-1.5 text-sm text-white/85">
              {current.features.map((f) => (
                <li key={f} className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-white/70" />
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Variant thumbnails */}
          {variants.length > 1 && (
            <div className="mt-1 flex flex-wrap gap-2">
              {variants.map((v, i) => (
                <button
                  key={v.id}
                  onClick={() => setIndex(i)}
                  aria-label={`Vai a ${v.style}`}
                  aria-current={i === index}
                  className="rounded-full border px-3 py-1 text-[11px] transition"
                  style={
                    i === index
                      ? { background: "white", color: "#0b0b12", borderColor: "white" }
                      : { background: "rgba(255,255,255,0.05)", color: "rgba(255,255,255,0.75)", borderColor: "rgba(255,255,255,0.18)" }
                  }
                >
                  {v.style}
                </button>
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>,
    document.body,
  );
}

function MiniScreenThumb({ variant, screen, active }: { variant: SectorMockupVariant; screen: MockupScreen; active: boolean }) {
  const t = variant.theme;
  return (
    <div
      className="relative overflow-hidden rounded-[12px] transition"
      style={{
        width: 62,
        height: Math.round(62 * (19.5 / 9)),
        background: t.bg,
        boxShadow: active
          ? "0 0 0 2px rgba(255,255,255,0.95), 0 12px 28px -12px rgba(0,0,0,0.75)"
          : "0 0 0 1px rgba(255,255,255,0.15), 0 8px 20px -12px rgba(0,0,0,0.6)",
      }}
    >
      <div className="absolute inset-x-2 top-2 h-2 rounded-full" style={{ background: t.accent }} />
      <div className="absolute left-2 right-2 top-6 h-9 rounded-xl" style={{ background: screen.kind === "home" ? t.accent : t.surface }} />
      <div className="absolute left-2 right-2 top-[52px] grid grid-cols-2 gap-1">
        <span className="h-5 rounded-md" style={{ background: t.surface2 }} />
        <span className="h-5 rounded-md" style={{ background: t.surface }} />
        <span className="h-5 rounded-md" style={{ background: t.surface }} />
        <span className="h-5 rounded-md" style={{ background: t.accent2 }} />
      </div>
      <div className="absolute inset-x-2 bottom-2 h-3 rounded-full" style={{ background: t.line }} />
    </div>
  );
}
