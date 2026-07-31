import { useCallback, useEffect, useRef, useState } from "react";

type EffectPhase = "before" | "active" | "after";

type ScrollMetrics = {
  progress: number;
  visibleRatio: number;
  step: number;
  inView: boolean;
  phase: EffectPhase;
};

type RegisteredSection = {
  id: string;
  el: HTMLElement;
  steps: number;
  onUpdate?: (metrics: ScrollMetrics) => void;
  lastStep: number;
  lastRoundedProgress: number;
  lastPhase: EffectPhase;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));

const registry = new Map<string, RegisteredSection>();
let raf = 0;
let listening = false;

const computeMetrics = (record: RegisteredSection): ScrollMetrics => {
  const rect = record.el.getBoundingClientRect();
  const vh = window.innerHeight || 1;
  const visiblePx = Math.max(0, Math.min(rect.bottom, vh) - Math.max(rect.top, 0));
  const visibleRatio = clamp01(visiblePx / Math.min(Math.max(rect.height, 1), vh));
  const progress = clamp01((vh * 0.78 - rect.top) / (rect.height + vh * 0.28));
  const step = Math.min(record.steps - 1, Math.max(0, Math.floor(progress * record.steps)));
  const phase: EffectPhase = progress <= 0.035 ? "before" : progress >= 0.965 ? "after" : "active";

  return {
    progress,
    visibleRatio,
    step,
    inView: rect.bottom > 0 && rect.top < vh && visibleRatio > 0.02,
    phase,
  };
};

const updateAll = () => {
  raf = 0;
  registry.forEach((record) => {
    const metrics = computeMetrics(record);
    const roundedProgress = Math.round(metrics.progress * 1000) / 1000;

    record.el.style.setProperty("--empire-progress", roundedProgress.toFixed(3));
    record.el.style.setProperty("--empire-visible", metrics.visibleRatio.toFixed(3));
    record.el.style.setProperty("--empire-step", String(metrics.step));
    record.el.dataset.empireEffect = metrics.phase;

    const shouldNotify =
      metrics.step !== record.lastStep ||
      metrics.phase !== record.lastPhase ||
      Math.abs(roundedProgress - record.lastRoundedProgress) >= 0.018;

    if (shouldNotify) {
      record.lastStep = metrics.step;
      record.lastPhase = metrics.phase;
      record.lastRoundedProgress = roundedProgress;
      record.onUpdate?.(metrics);
    }
  });
};

const requestUpdate = () => {
  if (raf) return;
  raf = window.requestAnimationFrame(updateAll);
};

const ensureListeners = () => {
  if (listening || typeof window === "undefined") return;
  listening = true;
  window.addEventListener("scroll", requestUpdate, { passive: true });
  window.addEventListener("touchmove", requestUpdate, { passive: true });
  window.addEventListener("resize", requestUpdate);
  window.addEventListener("orientationchange", requestUpdate);
  requestUpdate();
};

const teardownListeners = () => {
  if (!listening || registry.size > 0 || typeof window === "undefined") return;
  listening = false;
  window.removeEventListener("scroll", requestUpdate);
  window.removeEventListener("touchmove", requestUpdate);
  window.removeEventListener("resize", requestUpdate);
  window.removeEventListener("orientationchange", requestUpdate);
  if (raf) window.cancelAnimationFrame(raf);
  raf = 0;
};

export function useEmpireScrollDirector<T extends HTMLElement>(
  id: string,
  options: { steps?: number; onUpdate?: (metrics: ScrollMetrics) => void } = {},
) {
  const optionsRef = useRef(options);
  const unregisterRef = useRef<(() => void) | null>(null);
  const stateRef = useRef<ScrollMetrics>({ progress: 0, visibleRatio: 0, step: 0, inView: false, phase: "before" });
  const [state, setState] = useState(stateRef.current);

  useEffect(() => {
    optionsRef.current = options;
  }, [options]);

  const ref = useCallback((node: T | null) => {
    unregisterRef.current?.();
    unregisterRef.current = null;

    if (!node || typeof window === "undefined") return;

    const record: RegisteredSection = {
      id,
      el: node,
      steps: Math.max(1, optionsRef.current.steps ?? 1),
      lastStep: -1,
      lastRoundedProgress: -1,
      lastPhase: "before",
      onUpdate: (metrics) => {
        stateRef.current = metrics;
        setState(metrics);
        optionsRef.current.onUpdate?.(metrics);
      },
    };

    registry.set(id, record);
    ensureListeners();
    requestUpdate();

    unregisterRef.current = () => {
      registry.delete(id);
      teardownListeners();
    };
  }, [id]);

  useEffect(() => () => unregisterRef.current?.(), []);

  return { ref, ...state } as const;
}

export { clamp01 };