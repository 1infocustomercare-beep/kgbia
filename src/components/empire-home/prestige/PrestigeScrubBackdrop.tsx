import { useEffect, useRef, useState } from "react";

/**
 * Sfondo cinematico scroll-scrubbed per la home Empire.
 * Vive SOTTO tutti gli elementi (z-index 0, pointer-events none) e non appare
 * mai dentro card/riquadri: le sezioni opache lo coprono naturalmente.
 * Nessuna dipendenza da GSAP/ScrollTrigger: rAF + scroll passivo.
 */
const FRAME_COUNT = 60;
const frameUrl = (i: number) =>
  `/frames/ncc/${String(i + 1).padStart(3, "0")}.jpg`;

export default function PrestigeScrubBackdrop() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imagesRef = useRef<HTMLImageElement[]>([]);
  const lastDrawn = useRef(-1);
  const rafRef = useRef<number | null>(null);
  const [ok, setOk] = useState(true);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener?.("change", update);
    return () => mq.removeEventListener?.("change", update);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let cancelled = false;
    let errors = 0;
    const images: HTMLImageElement[] = new Array(FRAME_COUNT);
    imagesRef.current = images;

    const sizeCanvas = (img: HTMLImageElement) => {
      const canvas = canvasRef.current;
      if (!canvas || !img.naturalWidth) return;
      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      canvas.getContext("2d")?.drawImage(img, 0, 0);
      lastDrawn.current = 0;
    };

    const loadOne = (i: number) => {
      const img = new window.Image();
      img.decoding = "async";
      img.onerror = () => {
        errors++;
        if (!cancelled && errors >= 5) setOk(false);
      };
      if (i === 0) img.onload = () => !cancelled && sizeCanvas(img);
      img.src = frameUrl(i);
      images[i] = img;
    };

    const INITIAL = Math.min(12, FRAME_COUNT);
    for (let i = 0; i < INITIAL; i++) loadOne(i);
    let cursor = INITIAL;
    let timer: ReturnType<typeof setTimeout> | null = null;
    const loadNext = () => {
      if (cancelled) return;
      const end = Math.min(FRAME_COUNT, cursor + 12);
      for (let i = cursor; i < end; i++) loadOne(i);
      cursor = end;
      if (cursor < FRAME_COUNT) timer = setTimeout(loadNext, 250);
    };
    timer = setTimeout(loadNext, 600);

    return () => {
      cancelled = true;
      if (timer) clearTimeout(timer);
    };
  }, [reduced]);

  useEffect(() => {
    if (reduced || !ok) return;

    const isLoaded = (i: number) => {
      const img = imagesRef.current[i];
      return !!img && img.complete && img.naturalWidth > 0;
    };

    const draw = (index: number) => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      let idx = index;
      if (!isLoaded(idx)) {
        let found = -1;
        for (let d = 1; d < FRAME_COUNT; d++) {
          if (idx - d >= 0 && isLoaded(idx - d)) { found = idx - d; break; }
          if (idx + d < FRAME_COUNT && isLoaded(idx + d)) { found = idx + d; break; }
        }
        if (found === -1) return;
        idx = found;
      }
      if (lastDrawn.current === idx) return;
      const img = imagesRef.current[idx];
      const ctx = canvas.getContext("2d");
      if (!ctx || !img) return;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      lastDrawn.current = idx;
    };

    const onScroll = () => {
      if (rafRef.current !== null) return;
      rafRef.current = window.requestAnimationFrame(() => {
        rafRef.current = null;
        const max = Math.max(
          1,
          document.documentElement.scrollHeight - window.innerHeight,
        );
        const p = Math.min(1, Math.max(0, window.scrollY / max));
        draw(Math.min(FRAME_COUNT - 1, Math.floor(p * FRAME_COUNT)));
      });
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [reduced, ok]);

  return (
    <div className="prestige-scrub-backdrop" aria-hidden="true">
      {ok && !reduced && <canvas ref={canvasRef} />}
      <div className="prestige-scrub-veil" />
      <div className="prestige-scrub-vignette" />
    </div>
  );
}
