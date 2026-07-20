/**
 * MockupLightbox — fullscreen viewer for a group of mockup variants.
 *
 * - Opens on any card click (Home + Portfolio).
 * - ESC closes, ← / → cycle variants, tap outside phone closes.
 * - Renders exactly ONE IPhoneProMaxFrame (no phone-in-phone).
 * - Side panel shows brand, style, palette, features.
 */

import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import IPhoneProMaxFrame from "./IPhoneProMaxFrame";
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

  useEffect(() => {
    if (open) setIndex(Math.min(Math.max(0, initialIndex), variants.length - 1));
  }, [open, initialIndex, variants.length]);

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
  const phoneWidth = useMemo(() => {
    if (typeof window === "undefined") return 320;
    // Fit within ~85% viewport height, using aspect 19.5/9 → maxWidth = H * 9/19.5
    const maxH = window.innerHeight * 0.85;
    const wFromH = Math.floor((maxH * 9) / 19.5);
    const maxW = Math.min(window.innerWidth * 0.42, 420);
    return Math.max(240, Math.min(wFromH, maxW));
  }, [open, index]);

  if (!open || !current || typeof document === "undefined") return null;

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`Mockup ${current.brand} — ${current.style}`}
      className="fixed inset-0 z-[9999] flex items-center justify-center"
      style={{ background: "rgba(6,7,12,0.92)", backdropFilter: "blur(18px)" }}
      onClick={onClose}
    >
      {/* Close */}
      <button
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute right-4 top-4 z-20 grid h-11 w-11 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15"
      >
        <X size={20} />
      </button>

      {/* Prev / Next */}
      {variants.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i - 1 + variants.length) % variants.length);
            }}
            aria-label="Variante precedente"
            className="absolute left-3 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:left-6"
          >
            <ChevronLeft size={22} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIndex((i) => (i + 1) % variants.length);
            }}
            aria-label="Variante successiva"
            className="absolute right-3 top-1/2 z-20 -translate-y-1/2 grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 text-white transition hover:bg-white/15 md:right-6"
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* Content */}
      <div
        className="relative mx-4 flex w-full max-w-6xl flex-col items-center gap-8 px-2 py-8 md:flex-row md:items-stretch md:justify-center md:gap-14"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Phone */}
        <div className="flex shrink-0 items-center justify-center">
          <IPhoneProMaxFrame
            src={current.screen}
            alt={`${current.brand} — ${current.style}`}
            width={phoneWidth}
            loading="eager"
          />
        </div>

        {/* Info panel */}
        <aside className="flex max-w-md flex-col justify-center gap-5 text-white md:max-w-sm">
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
            <span
              className="inline-flex items-center rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs text-white/85"
            >
              {current.palette}
            </span>
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
            <div className="mt-2 flex flex-wrap gap-2">
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
