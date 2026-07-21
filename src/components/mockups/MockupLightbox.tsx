/**
 * MockupLightbox — fullscreen viewer for a group of mockup variants.
 *
 * - Opens on any card click (Home + Portfolio).
 * - ESC closes; ← / → cycle variants; number keys jump within the screen sequence.
 * - Renders ONE big IPhoneProMaxFrame for the active screen + a filmstrip of
 *   the coherent screen sequence (Home → Menu → Dettaglio → Prenotazione).
 * - Side panel shows brand, style, palette, features.
 */

import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import IPhoneProMaxFrame from "./IPhoneProMaxFrame";
import { getLenis } from "@/lib/lenis-singleton";


import type { SectorMockupVariant } from "@/data/sector-mockups";

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

  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    // Lock background scroll (html + body) and offset scrollbar to avoid jump
    const html = document.documentElement;
    const body = document.body;
    const scrollY = window.scrollY;
    const prev = {
      htmlOverflow: html.style.overflow,
      bodyOverflow: body.style.overflow,
      bodyPosition: body.style.position,
      bodyTop: body.style.top,
      bodyWidth: body.style.width,
    };
    html.style.overflow = "hidden";
    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";

    // Pause Lenis smooth-scroll if present
    let lenisInstance: any = null;
    try {
      lenisInstance = getLenis();
      lenisInstance?.stop?.();
    } catch {}


    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => (i + 1) % variants.length);
      if (e.key === "ArrowLeft") setIndex((i) => (i - 1 + variants.length) % variants.length);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      html.style.overflow = prev.htmlOverflow;
      body.style.overflow = prev.bodyOverflow;
      body.style.position = prev.bodyPosition;
      body.style.top = prev.bodyTop;
      body.style.width = prev.bodyWidth;
      window.scrollTo(0, scrollY);
      lenisInstance?.start?.();
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose, variants.length]);


  const current = variants[index];
  const screens = current?.screens?.length ? current.screens : (current ? [{ label: "Home", caption: "", image: current.screen }] : []);
  const activeScreen = screens[Math.min(screenIdx, screens.length - 1)];

  const [phoneWidth, setPhoneWidth] = useState(260);
  useEffect(() => {
    if (!open || typeof window === "undefined") return;
    const compute = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isMobile = vw < 768;
      const reservedV = isMobile ? 280 : 200;
      const maxH = Math.max(340, vh - reservedV);
      const wFromH = Math.floor((maxH * 9) / 19.5);
      const maxW = isMobile ? vw - 56 : Math.min(vw * 0.42, 360);
      setPhoneWidth(Math.max(200, Math.min(wFromH, maxW)));
    };
    compute();
    window.addEventListener("resize", compute);
    window.addEventListener("orientationchange", compute);
    return () => {
      window.removeEventListener("resize", compute);
      window.removeEventListener("orientationchange", compute);
    };
  }, [open]);

  if (!open || !current || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Mockup ${current.brand} — ${current.style}`}
      className="fixed inset-0 z-[9999] overflow-y-auto overscroll-contain"
      data-lenis-prevent
      ref={scrollRef}

      style={{ background: "rgba(6,7,12,0.94)", backdropFilter: "blur(18px)", WebkitOverflowScrolling: "touch" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="fixed right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
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
            className="fixed left-3 top-1/2 z-20 hidden -translate-y-1/2 md:grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % variants.length);
            }}
            aria-label="Variante successiva"
            className="fixed right-3 top-1/2 z-20 hidden -translate-y-1/2 md:grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className="relative mx-auto flex min-h-full w-full max-w-6xl flex-col items-center gap-6 px-4 pb-16 pt-20 sm:px-6 md:flex-row md:items-start md:justify-center md:gap-10 md:pt-24"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Left: big phone + filmstrip */}
        <div className="flex flex-col items-center gap-4">
          <div className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">
            {activeScreen.label} · {screenIdx + 1}/{screens.length}
          </div>
          <IPhoneProMaxFrame
            src={activeScreen.image}
            alt={`${current.brand} — ${activeScreen.label}`}
            width={phoneWidth}
            loading="eager"
          />
          {activeScreen.caption && (
            <p className="max-w-xs text-center text-xs leading-relaxed text-white/70">
              {activeScreen.caption}
            </p>
          )}

          {/* Filmstrip: coherent screen sequence */}
          {screens.length > 1 && (
            <div className="mt-2 flex flex-wrap items-end justify-center gap-3">
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
                    <div
                      className="overflow-hidden rounded-[12px] bg-black transition"
                      style={{
                        width: 68,
                        height: Math.round(68 * (19.5 / 9)),
                        boxShadow: active
                          ? "0 0 0 2px rgba(255,255,255,0.95), 0 12px 28px -12px rgba(0,0,0,0.75)"
                          : "0 0 0 1px rgba(255,255,255,0.15), 0 8px 20px -12px rgba(0,0,0,0.6)",
                      }}
                    >
                      <img
                        src={s.image}
                        alt={s.label}
                        loading="lazy"
                        decoding="async"
                        draggable={false}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
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

      {/* Auto-scroll marquee: ALL variants × ALL screens */}
      <div onClick={(e) => e.stopPropagation()} className="relative mx-auto w-full max-w-[1600px] px-2 pb-10">
        <AllStylesMarquee
          variants={variants}
          activeIndex={index}
          activeScreen={screenIdx}
          onPick={(vi, si) => {
            setIndex(vi);
            setScreenIdx(si);
          }}
        />
      </div>
    </div>,
    document.body,
  );
}
