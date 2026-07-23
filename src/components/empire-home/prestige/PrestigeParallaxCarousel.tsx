import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { allMockupVariants } from "@/data/sector-mockups";
import PrestigePhone from "./PrestigePhone";

/**
 * PrestigeParallaxCarousel — carosello orizzontale premium con:
 *  - autoplay continuo (rAF, ~30px/s)
 *  - drag manuale con pointer events (mouse + touch + pen)
 *  - pausa automatica su hover, touch, focus e quando la sezione è fuori viewport
 *  - parallax leggero sulle immagini (offset relativo alla posizione dello slide)
 *  - rispetto di prefers-reduced-motion (autoplay disattivato)
 *  - loop infinito senza salti tramite duplicazione della track
 */

type Slide = {
  id: string;
  brand: string;
  sector: string;
  image: string;
  accent: string;
};

const ACCENT_BY_SECTOR: Record<string, string> = {
  food: "hsl(18 78% 55%)",
  beauty: "hsl(340 72% 68%)",
  ncc: "hsl(44 72% 58%)",
  hospitality: "hsl(190 55% 55%)",
  fitness: "hsl(160 60% 45%)",
  healthcare: "hsl(210 70% 55%)",
  veterinary: "hsl(150 45% 50%)",
  childcare: "hsl(30 80% 65%)",
  construction: "hsl(28 60% 45%)",
  retail: "hsl(280 55% 55%)",
};

const SPEED_PX_PER_SEC = 32;

export default function PrestigeParallaxCarousel() {
  const slides = useMemo<Slide[]>(() => {
    const all = allMockupVariants().filter((v) => v.tier === "primary" && v.source === "studio");
    // Only the curated studio sequences are allowed on the homepage carousel.
    const bySector = new Map<string, Slide[]>();
    for (const v of all) {
      const arr = bySector.get(v.sectorId) ?? [];
      if (arr.length < 2) {
        arr.push({
          id: `${v.sectorId}-${v.id}`,
          brand: v.brand,
          sector: v.sectorLabel,
          image: v.screens[0]?.image ?? v.screen,
          accent: ACCENT_BY_SECTOR[v.sectorId] ?? "hsl(44 72% 58%)",
        });
      }
      bySector.set(v.sectorId, arr);
    }
    return Array.from(bySector.values()).flat();
  }, []);

  const scrollerRef = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const lastTsRef = useRef<number>(0);
  const pausedRef = useRef<boolean>(false);
  const draggingRef = useRef<boolean>(false);
  const dragStartXRef = useRef<number>(0);
  const dragStartScrollRef = useRef<number>(0);
  const inViewRef = useRef<boolean>(true);
  const halfWidthRef = useRef<number>(0);

  const [reducedMotion, setReducedMotion] = useState(false);

  // Detect reduced motion
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReducedMotion(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);

  // Intersection observer to pause when off-screen
  useEffect(() => {
    const el = scrollerRef.current?.parentElement;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) inViewRef.current = e.isIntersecting;
      },
      { threshold: 0.1 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Compute half-width for infinite loop (we render slides twice)
  useEffect(() => {
    const compute = () => {
      const el = scrollerRef.current;
      if (!el) return;
      halfWidthRef.current = el.scrollWidth / 2;
    };
    compute();
    const ro = new ResizeObserver(compute);
    if (scrollerRef.current) ro.observe(scrollerRef.current);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [slides.length]);

  // Autoplay loop
  useEffect(() => {
    if (reducedMotion) return;
    const tick = (ts: number) => {
      const el = scrollerRef.current;
      if (!el) {
        rafRef.current = requestAnimationFrame(tick);
        return;
      }
      const last = lastTsRef.current || ts;
      const dt = (ts - last) / 1000;
      lastTsRef.current = ts;

      if (!pausedRef.current && !draggingRef.current && inViewRef.current) {
        el.scrollLeft += SPEED_PX_PER_SEC * dt;
      }
      // Infinite loop wrap
      const half = halfWidthRef.current;
      if (half > 0) {
        if (el.scrollLeft >= half) el.scrollLeft -= half;
        else if (el.scrollLeft < 0) el.scrollLeft += half;
      }

      // Apply parallax to each slide image based on position
      applyParallax(el);

      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      lastTsRef.current = 0;
    };
  }, [reducedMotion]);

  const applyParallax = (el: HTMLDivElement) => {
    const rect = el.getBoundingClientRect();
    const center = rect.left + rect.width / 2;
    const items = el.querySelectorAll<HTMLElement>("[data-slide-img]");
    items.forEach((img) => {
      const r = img.getBoundingClientRect();
      const dx = (r.left + r.width / 2 - center) / rect.width; // -1..1
      const parallax = dx * -14; // px
      img.style.transform = `translate3d(${parallax}px,0,0)`;
    });
  };

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = scrollerRef.current;
    if (!el) return;
    draggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragStartScrollRef.current = el.scrollLeft;
    el.setPointerCapture(e.pointerId);
    el.style.cursor = "grabbing";
  };
  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    const el = scrollerRef.current;
    if (!el) return;
    const dx = e.clientX - dragStartXRef.current;
    el.scrollLeft = dragStartScrollRef.current - dx;
  };
  const endDrag = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current) return;
    draggingRef.current = false;
    const el = scrollerRef.current;
    if (el) {
      el.releasePointerCapture?.(e.pointerId);
      el.style.cursor = "grab";
    }
  };

  const nudge = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    const step = Math.min(el.clientWidth * 0.6, 480);
    el.scrollBy({ left: dir * step, behavior: "smooth" });
  };

  if (slides.length === 0) return null;

  return (
    <section
      data-section
      className="prestige-reveal relative py-24 md:py-32"
      aria-label="Carosello progetti Empire"
    >
      <div className="mx-auto max-w-7xl px-6 mb-12 md:mb-16">
        <p className="text-xs uppercase tracking-[0.35em] text-[hsl(var(--gold))] mb-4">
          Portfolio in movimento
        </p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.05]">
          Ogni progetto è una vetrina{" "}
          <span className="italic text-[hsl(var(--gold))]">viva</span>.
        </h2>
        <p className="mt-4 max-w-2xl text-base md:text-lg opacity-80">
          Trascina, sfoglia, esplora. I brand scorrono da soli — fermati quando trovi
          quello che ti somiglia.
        </p>
      </div>

      <div
        className="relative group"
        onMouseEnter={() => (pausedRef.current = true)}
        onMouseLeave={() => (pausedRef.current = false)}
        onTouchStart={() => (pausedRef.current = true)}
        onTouchEnd={() => (pausedRef.current = false)}
        onFocusCapture={() => (pausedRef.current = true)}
        onBlurCapture={() => (pausedRef.current = false)}
      >
        {/* edge fades */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 left-0 w-24 md:w-40 z-10"
          style={{
            background:
              "linear-gradient(to right, hsl(var(--background)) 0%, transparent 100%)",
          }}
        />
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 right-0 w-24 md:w-40 z-10"
          style={{
            background:
              "linear-gradient(to left, hsl(var(--background)) 0%, transparent 100%)",
          }}
        />

        <div
          ref={scrollerRef}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          className="flex gap-6 md:gap-8 overflow-x-auto no-scrollbar cursor-grab select-none px-6 md:px-16"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {[...slides, ...slides].map((s, i) => (
            <SlideCard key={`${s.id}-${i}`} slide={s} />
          ))}
        </div>

        {/* Arrows */}
        <button
          type="button"
          onClick={() => nudge(-1)}
          aria-label="Progetto precedente"
          className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.4)] bg-black/40 backdrop-blur text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          type="button"
          onClick={() => nudge(1)}
          aria-label="Progetto successivo"
          className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 z-20 h-12 w-12 items-center justify-center rounded-full border border-[hsl(var(--gold)/0.4)] bg-black/40 backdrop-blur text-[hsl(var(--gold))] opacity-0 group-hover:opacity-100 transition"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
      `}</style>
    </section>
  );
}

function SlideCard({ slide }: { slide: Slide }) {
  return (
    <article className="relative shrink-0 flex flex-col items-center gap-4">
      <div
        data-slide-img
        className="will-change-transform"
        style={{ transform: "translate3d(0,0,0)" }}
      >
        <PrestigePhone
          src={slide.image}
          alt={`${slide.brand} — ${slide.sector}`}
          width={220}
          loading="lazy"
        />
      </div>
      <div className="text-center px-2">
        <p
          className="text-[10px] uppercase tracking-[0.3em] mb-1"
          style={{ color: slide.accent }}
        >
          {slide.sector}
        </p>
        <h3
          className="text-lg md:text-xl font-serif leading-tight"
          style={{ color: "hsl(var(--pr-text-on-dark))" }}
        >
          {slide.brand}
        </h3>
      </div>
    </article>
  );
}
