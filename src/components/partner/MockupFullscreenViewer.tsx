/**
 * MockupFullscreenViewer
 * ──────────────────────────────────────────────────────────────────────────
 * Fullscreen immersive viewer for the 4 iPhone mockup screens.
 *
 * Features:
 *  • One screen at a time at maximum on-screen size (true 9:19.5 frame)
 *  • Pinch / wheel / button zoom 1× → 4× with pan when zoomed
 *  • Swipe + arrow / keyboard navigation across the 4 screens
 *  • Live template switcher: cycle every TEMPLATE_BRANDING variant,
 *    primary color & branding kit follow automatically
 *  • Re-uses MockupReactScreen so the high-fidelity preview is always
 *    pixel-perfect with the in-page viewer
 *
 * Pure presentation layer — no business logic, no Edge Function calls.
 */

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Palette,
  Maximize2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MockupReactScreen, type ColorStyle } from "./MockupReactScreen";
import {
  TEMPLATE_BRANDING,
  getBrandingKit,
  type TemplateBrandingKit,
} from "./templateBranding";
import type { SuiteScreen } from "./MockupSuiteViewer";

interface Props {
  open: boolean;
  onClose: () => void;
  screens: SuiteScreen[];
  initialIndex?: number;
  templateVariant: string;
  businessName: string;
  businessSector?: string;
  businessCity?: string;
  primaryColor?: string;
  glassIntensity?: number;
  colorStyle?: ColorStyle;
  safeAreaPx?: number;
  typeScale?: number;
  boostContrast?: boolean;
  /** Optional callback fired when the user picks a different template
   *  variant from the in-overlay switcher. Parent may persist the choice. */
  onTemplateChange?: (variant: string, kit: TemplateBrandingKit) => void;
}

const IPHONE_RATIO = 19.5 / 9;
const ZOOM_MIN = 1;
const ZOOM_MAX = 4;
const ZOOM_STEP = 0.25;

export function MockupFullscreenViewer({
  open,
  onClose,
  screens,
  initialIndex = 0,
  templateVariant,
  businessName,
  businessSector = "",
  businessCity = "",
  primaryColor,
  glassIntensity = 60,
  colorStyle = "vivid",
  safeAreaPx = 0,
  typeScale = 1,
  boostContrast = false,
  onTemplateChange,
}: Props) {
  const [index, setIndex] = useState(initialIndex);
  const [activeVariant, setActiveVariant] = useState(templateVariant);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [showTemplatePicker, setShowTemplatePicker] = useState(false);
  const dragStart = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const touchPinch = useRef<{ dist: number; zoom: number } | null>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  // Reset state every time the overlay reopens
  useEffect(() => {
    if (open) {
      setIndex(initialIndex);
      setActiveVariant(templateVariant);
      setZoom(1);
      setPan({ x: 0, y: 0 });
      setShowTemplatePicker(false);
    }
  }, [open, initialIndex, templateVariant]);

  // Reset zoom/pan when changing screen or template
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [index, activeVariant]);

  const variantKeys = useMemo(() => Object.keys(TEMPLATE_BRANDING), []);
  const activeKit = useMemo(() => getBrandingKit(activeVariant), [activeVariant]);
  const effectivePrimary = primaryColor && activeVariant === templateVariant
    ? primaryColor
    : activeKit.primary;

  const total = screens.length;
  const screen = screens[index];

  const goPrev = useCallback(() => {
    setIndex(i => (i - 1 + total) % total);
  }, [total]);
  const goNext = useCallback(() => {
    setIndex(i => (i + 1) % total);
  }, [total]);

  const cycleTemplate = useCallback((dir: 1 | -1) => {
    const cur = variantKeys.indexOf(activeVariant);
    const next = variantKeys[(cur + dir + variantKeys.length) % variantKeys.length];
    setActiveVariant(next);
    onTemplateChange?.(next, getBrandingKit(next));
  }, [variantKeys, activeVariant, onTemplateChange]);

  const pickTemplate = useCallback((variant: string) => {
    setActiveVariant(variant);
    setShowTemplatePicker(false);
    onTemplateChange?.(variant, getBrandingKit(variant));
  }, [onTemplateChange]);

  // Keyboard
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "+" || e.key === "=") setZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP));
      else if (e.key === "-") setZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP));
      else if (e.key === "0") { setZoom(1); setPan({ x: 0, y: 0 }); }
      else if (e.key === "t" || e.key === "T") cycleTemplate(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, goNext, goPrev, cycleTemplate]);

  // Wheel zoom (desktop)
  const onWheel = (e: React.WheelEvent) => {
    if (!e.ctrlKey && !e.metaKey && Math.abs(e.deltaY) < 30) return;
    e.preventDefault();
    const delta = e.deltaY > 0 ? -ZOOM_STEP : ZOOM_STEP;
    setZoom(z => Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, z + delta)));
  };

  // Mouse drag pan when zoomed
  const onMouseDown = (e: React.MouseEvent) => {
    if (zoom <= 1) return;
    dragStart.current = { x: e.clientX, y: e.clientY, px: pan.x, py: pan.y };
  };
  const onMouseMove = (e: React.MouseEvent) => {
    if (!dragStart.current) return;
    setPan({
      x: dragStart.current.px + (e.clientX - dragStart.current.x),
      y: dragStart.current.py + (e.clientY - dragStart.current.y),
    });
  };
  const onMouseUp = () => { dragStart.current = null; };

  // Touch pinch + pan + swipe
  const touchStart = useRef<{ x: number; y: number; t: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchPinch.current = { dist: Math.hypot(dx, dy), zoom };
    } else if (e.touches.length === 1) {
      touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now() };
      if (zoom > 1) {
        dragStart.current = {
          x: e.touches[0].clientX, y: e.touches[0].clientY, px: pan.x, py: pan.y,
        };
      }
    }
  };
  const onTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 2 && touchPinch.current) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const newDist = Math.hypot(dx, dy);
      const ratio = newDist / touchPinch.current.dist;
      setZoom(Math.max(ZOOM_MIN, Math.min(ZOOM_MAX, touchPinch.current.zoom * ratio)));
    } else if (e.touches.length === 1 && dragStart.current && zoom > 1) {
      setPan({
        x: dragStart.current.px + (e.touches[0].clientX - dragStart.current.x),
        y: dragStart.current.py + (e.touches[0].clientY - dragStart.current.y),
      });
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    touchPinch.current = null;
    dragStart.current = null;
    // Swipe gesture only when not zoomed
    if (zoom <= 1 && touchStart.current && e.changedTouches.length === 1) {
      const dx = e.changedTouches[0].clientX - touchStart.current.x;
      const dy = e.changedTouches[0].clientY - touchStart.current.y;
      const dt = Date.now() - touchStart.current.t;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && dt < 600) {
        if (dx < 0) goNext(); else goPrev();
      }
    }
    touchStart.current = null;
  };

  // Frame size — fits the available stage while preserving 9:19.5 ratio
  const [stageSize, setStageSize] = useState({ w: 0, h: 0 });
  useEffect(() => {
    if (!open) return;
    const update = () => {
      const el = stageRef.current;
      if (!el) return;
      setStageSize({ w: el.clientWidth, h: el.clientHeight });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, [open]);

  const { frameWidth, frameHeight } = useMemo(() => {
    // Reserve ~92% of available stage so chrome/buttons never overlap
    const availW = stageSize.w * 0.92;
    const availH = stageSize.h * 0.92;
    if (availW <= 0 || availH <= 0) return { frameWidth: 320, frameHeight: 693 };
    let h = availH;
    let w = h / IPHONE_RATIO;
    if (w > availW) {
      w = availW;
      h = w * IPHONE_RATIO;
    }
    return { frameWidth: Math.round(w), frameHeight: Math.round(h) };
  }, [stageSize]);

  const borderThickness = 5;
  const screenWidth = frameWidth - borderThickness * 2;
  const screenHeight = frameHeight - borderThickness * 2;

  if (!open) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        className="fixed inset-0 z-[9999] flex flex-col bg-black/95 backdrop-blur-xl"
      >
        {/* Top bar */}
        <div className="shrink-0 h-14 px-4 flex items-center justify-between border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-3 min-w-0">
            <Maximize2 className="h-4 w-4 text-white/60 shrink-0" />
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">{businessName}</p>
              <p className="text-[10px] text-white/50 truncate">
                {screen?.title} · {index + 1}/{total}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className="hidden sm:flex border-white/20 text-white/80 bg-white/5 text-[10px]"
            >
              {activeKit.label}
            </Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowTemplatePicker(v => !v)}
              className="text-white hover:bg-white/10 gap-1.5"
            >
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline text-xs">Template</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="text-white hover:bg-white/10"
              aria-label="Chiudi"
            >
              <X className="h-5 w-5" />
            </Button>
          </div>
        </div>

        {/* Stage */}
        <div
          ref={stageRef}
          className="relative flex-1 flex items-center justify-center overflow-hidden select-none"
          onWheel={onWheel}
          onMouseDown={onMouseDown}
          onMouseMove={onMouseMove}
          onMouseUp={onMouseUp}
          onMouseLeave={onMouseUp}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
          style={{ cursor: zoom > 1 ? (dragStart.current ? "grabbing" : "grab") : "default" }}
        >
          {/* Prev / Next */}
          {total > 1 && (
            <>
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Schermata precedente"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-20 h-12 w-12 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/15 flex items-center justify-center text-white transition-all active:scale-95"
                aria-label="Schermata successiva"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Ambient glow */}
          <div
            className="absolute pointer-events-none rounded-full blur-3xl opacity-25 transition-colors duration-500"
            style={{
              background: effectivePrimary,
              width: frameWidth * 1.1,
              height: frameHeight * 0.9,
            }}
          />

          {/* iPhone frame — animated zoom & pan */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${activeVariant}-${index}`}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{
                opacity: 1,
                scale: zoom,
                x: pan.x,
                y: pan.y,
              }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="relative"
              style={{
                width: frameWidth,
                height: frameHeight,
                transformOrigin: "center center",
                willChange: "transform",
              }}
            >
              <div
                className="relative rounded-[44px] shadow-[0_40px_120px_rgba(0,0,0,0.6)] overflow-hidden"
                style={{
                  width: frameWidth,
                  height: frameHeight,
                  borderWidth: borderThickness,
                  borderStyle: "solid",
                  borderColor: "rgba(220, 220, 230, 0.22)",
                  background: "rgba(255,255,255,0.04)",
                  boxSizing: "border-box",
                }}
              >
                {/* Dynamic Island */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 bg-black rounded-full z-30"
                  style={{
                    top: Math.round(frameWidth * 0.035),
                    width: Math.round(frameWidth * 0.30),
                    height: Math.round(frameWidth * 0.085),
                    boxShadow: "0 0 0 1px rgba(255,255,255,0.05)",
                  }}
                />

                {/* Side titanium buttons */}
                <div className="absolute bg-white/25 rounded-l-full" style={{ left: -borderThickness, top: frameHeight * 0.14, width: borderThickness, height: 26 }} />
                <div className="absolute bg-white/25 rounded-l-full" style={{ left: -borderThickness, top: frameHeight * 0.20, width: borderThickness, height: 44 }} />
                <div className="absolute bg-white/25 rounded-l-full" style={{ left: -borderThickness, top: frameHeight * 0.28, width: borderThickness, height: 44 }} />
                <div className="absolute bg-white/25 rounded-r-full" style={{ right: -borderThickness, top: frameHeight * 0.20, width: borderThickness, height: 64 }} />

                {/* Screen */}
                <div
                  className="absolute overflow-hidden bg-background"
                  style={{
                    top: borderThickness,
                    left: borderThickness,
                    width: screenWidth,
                    height: screenHeight,
                    borderRadius: 40,
                  }}
                >
                  {screen?.render_mode === "ai" && screen.image_url ? (
                    <img
                      src={screen.image_url}
                      alt={screen.title}
                      className="w-full h-full"
                      draggable={false}
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center top",
                        display: "block",
                        imageRendering: "auto",
                      }}
                    />
                  ) : (
                    <MockupReactScreen
                      type={screen?.type || "home"}
                      templateVariant={activeVariant}
                      businessName={businessName}
                      businessSector={businessSector}
                      businessCity={businessCity}
                      primaryColor={effectivePrimary}
                      width={screenWidth}
                      height={screenHeight}
                      glassIntensity={glassIntensity}
                      colorStyle={colorStyle}
                      safeAreaPx={safeAreaPx}
                      typeScale={typeScale}
                      boostContrast={boostContrast}
                    />
                  )}
                </div>

                {/* Home indicator */}
                <div
                  className="absolute left-1/2 -translate-x-1/2 bg-white/35 rounded-full z-20"
                  style={{
                    bottom: Math.max(6, Math.round(frameWidth * 0.025)),
                    width: Math.round(frameWidth * 0.34),
                    height: 4,
                  }}
                />

                {/* Glass reflection */}
                <div
                  className="absolute inset-0 rounded-[44px] pointer-events-none"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.10) 0%, transparent 38%)" }}
                />
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Template picker drawer */}
          <AnimatePresence>
            {showTemplatePicker && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-3 right-3 z-30 w-[280px] max-h-[70vh] overflow-y-auto rounded-2xl bg-black/85 backdrop-blur-xl border border-white/15 shadow-2xl p-2"
              >
                <p className="px-2 py-1.5 text-[10px] uppercase tracking-wider text-white/50 font-semibold">
                  Switch template ({variantKeys.length})
                </p>
                <div className="grid grid-cols-1 gap-1">
                  {variantKeys.map(v => {
                    const k = TEMPLATE_BRANDING[v];
                    const active = v === activeVariant;
                    return (
                      <button
                        key={v}
                        onClick={() => pickTemplate(v)}
                        className={`flex items-center gap-2 px-2 py-2 rounded-lg text-left transition-colors ${
                          active ? "bg-white/15" : "hover:bg-white/10"
                        }`}
                      >
                        <span className="flex shrink-0 gap-0.5">
                          {k.palette.slice(0, 4).map((p, i) => (
                            <span
                              key={i}
                              className="w-2.5 h-5 rounded-sm"
                              style={{ background: p.hex }}
                            />
                          ))}
                        </span>
                        <span className="flex-1 min-w-0">
                          <span className="block text-xs font-semibold text-white truncate">
                            {k.label}
                          </span>
                          <span className="block text-[9px] text-white/50 truncate">
                            {k.typography.pairLabel}
                          </span>
                        </span>
                        {active && (
                          <span className="text-[9px] font-bold text-white/70 px-1.5 py-0.5 rounded bg-white/15">
                            ATTIVO
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom toolbar */}
        <div className="shrink-0 px-3 py-3 border-t border-white/10 bg-black/40 flex items-center justify-between gap-3">
          {/* Screen dots */}
          <div className="flex items-center gap-1.5">
            {screens.map((_, i) => (
              <button
                key={i}
                onClick={() => setIndex(i)}
                className={`h-2 rounded-full transition-all ${
                  i === index ? "w-6 bg-white" : "w-2 bg-white/30 hover:bg-white/50"
                }`}
                aria-label={`Vai a schermata ${i + 1}`}
              />
            ))}
          </div>

          {/* Zoom controls */}
          <div className="flex items-center gap-1 rounded-full bg-white/5 border border-white/10 px-1 py-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/15"
              onClick={() => setZoom(z => Math.max(ZOOM_MIN, z - ZOOM_STEP))}
              disabled={zoom <= ZOOM_MIN}
              aria-label="Zoom out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-[11px] font-mono text-white/80 w-12 text-center tabular-nums">
              {Math.round(zoom * 100)}%
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/15"
              onClick={() => setZoom(z => Math.min(ZOOM_MAX, z + ZOOM_STEP))}
              disabled={zoom >= ZOOM_MAX}
              aria-label="Zoom in"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/15"
              onClick={() => { setZoom(1); setPan({ x: 0, y: 0 }); }}
              disabled={zoom === 1 && pan.x === 0 && pan.y === 0}
              aria-label="Reset zoom"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>

          {/* Template cycle (mobile-friendly arrows) */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/15"
              onClick={() => cycleTemplate(-1)}
              aria-label="Template precedente"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-[10px] uppercase tracking-wider text-white/60 hidden sm:inline">
              Template
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white hover:bg-white/15"
              onClick={() => cycleTemplate(1)}
              aria-label="Template successivo"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Hint */}
        <p className="absolute bottom-20 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[2px] text-white/30 pointer-events-none hidden md:block">
          ← → swipe · pinch / wheel zoom · T template · Esc chiudi
        </p>
      </motion.div>
    </AnimatePresence>
  );
}
