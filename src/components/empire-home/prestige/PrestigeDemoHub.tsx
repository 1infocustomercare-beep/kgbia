import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowUpRight, Maximize2 } from "lucide-react";
import PrestigePhone from "./PrestigePhone";
import { SECTOR_MOCKUPS } from "@/data/sector-mockups";
import MockupLightbox from "@/components/portfolio/MockupLightbox";
import { useT } from "./PrestigeLang";

/**
 * PrestigeDemoHub — sezione 3D interattiva "Demo Hub".
 * - Solo mockup PRIMARY + STUDIO (i più curati, testi/foto/icone coerenti).
 * - Pinned sticky: mentre scrolli, la fila di iPhone ruota in prospettiva 3D,
 *   trasla orizzontalmente e cambia il mockup in evidenza.
 * - Click su un telefono = apre lightbox fullscreen con i 4 screen coerenti.
 */
export default function PrestigeDemoHub() {
  const t = useT();
  const navigate = useNavigate();
  const wrapRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [openId, setOpenId] = useState<string | null>(null);

  // Solo mockup di qualità studio primary — max 1 per settore per varietà.
  const cards = useMemo(() => {
    const out: {
      id: string;
      sectorLabel: string;
      brand: string;
      style: string;
      palette: string;
      image: string;
      variant: any;
    }[] = [];
    for (const g of SECTOR_MOCKUPS) {
      const v = g.variants.find((x) => x.tier === "primary" && x.source === "studio");
      if (!v) continue;
      const img = v.screens[0]?.image ?? v.screen;
      if (!img) continue;
      out.push({
        id: v.id,
        sectorLabel: g.label,
        brand: v.brand,
        style: v.style,
        palette: v.palette,
        image: img,
        variant: v,
      });
    }
    return out;
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    let raf = 0;
    const onScroll = () => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        const rect = el.getBoundingClientRect();
        const vh = window.innerHeight || 1;
        // 0 quando il top raggiunge il viewport, 1 quando il bottom lo lascia.
        const total = rect.height - vh;
        const passed = Math.min(Math.max(-rect.top, 0), total);
        setProgress(total > 0 ? passed / total : 0);
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const activeIndex = Math.min(
    cards.length - 1,
    Math.floor(progress * cards.length * 0.999)
  );
  const localProgress = progress * cards.length - activeIndex;

  const openVariant = cards.find((c) => c.id === openId)?.variant ?? null;

  // Sezione alta per creare lo scroll pinato (2 viewport per card scorreranno).
  const heightVh = Math.max(220, 140 + cards.length * 55);

  return (
    <section
      ref={wrapRef}
      className="prestige-section prestige-dark relative"
      style={{ height: `${heightVh}vh` }}
      aria-label="Demo Hub 3D"
    >
      <div className="sticky top-0 flex h-screen w-full items-center overflow-hidden">
        {/* aurora bg */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(60% 60% at 50% 50%, hsl(var(--pr-gold) / 0.10), transparent 70%), radial-gradient(80% 50% at 20% 100%, hsl(var(--pr-emerald-glow) / 0.15), transparent 70%)",
          }}
        />

        <div className="relative z-10 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-10">
          {/* header */}
          <div className="mb-8 flex flex-col items-center text-center lg:mb-12">
            <span
              className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[10px] font-bold uppercase tracking-[0.28em]"
              style={{
                color: "hsl(var(--pr-gold-light))",
                borderColor: "hsl(var(--pr-gold) / 0.4)",
                background: "hsl(var(--pr-emerald-mid) / 0.4)",
              }}
            >
              {t({ it: "Demo Hub · 3D interattivo", en: "Demo Hub · 3D interactive" })}
            </span>
            <h2
              className="prestige-display mt-4"
              style={{ fontSize: "clamp(1.9rem, 4.4vw, 3.6rem)" }}
            >
              {t({
                it: "Scorri e scopri ogni settore, in movimento.",
                en: "Scroll and discover every industry, in motion.",
              })}
            </h2>
            <p
              className="mt-3 max-w-2xl text-sm sm:text-base"
              style={{ color: "hsl(var(--pr-muted-on-dark))" }}
            >
              {t({
                it: "Solo mockup studio curati a mano. Clicca un telefono per aprirlo a tutto schermo.",
                en: "Curated studio mockups only. Tap a phone to open it fullscreen.",
              })}
            </p>
          </div>

          {/* 3D stage */}
          <div
            className="prestige-hub-stage relative mx-auto"
            style={{
              perspective: "1800px",
              height: "min(58svh, 560px)",
            }}
          >
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{ transformStyle: "preserve-3d" }}
            >
              {cards.map((c, i) => {
                const rel = i - activeIndex - localProgress;
                const abs = Math.abs(rel);
                const x = rel * 260; // px offset
                const z = -abs * 200;
                const rotY = Math.max(-35, Math.min(35, -rel * 22));
                const scale = Math.max(0.55, 1 - abs * 0.14);
                const opacity = abs > 3.2 ? 0 : Math.max(0.18, 1 - abs * 0.28);
                const isActive = i === activeIndex && localProgress < 0.75;

                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setOpenId(c.id)}
                    className="absolute focus:outline-none"
                    style={{
                      transform: `translate3d(${x}px, 0, ${z}px) rotateY(${rotY}deg) scale(${scale})`,
                      transition: "transform 500ms cubic-bezier(.22,1,.36,1), opacity 500ms",
                      opacity,
                      zIndex: 100 - Math.round(abs * 10),
                      filter: isActive ? "none" : "saturate(.85)",
                    }}
                    aria-label={`Apri mockup ${c.brand}`}
                  >
                    <PrestigePhone
                      src={c.image}
                      alt={c.brand}
                      width={230}
                      loading="lazy"
                    />
                    {isActive && (
                      <span
                        className="pointer-events-none absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.22em]"
                        style={{
                          background: "hsl(var(--pr-gold))",
                          color: "hsl(var(--pr-emerald-deep))",
                          boxShadow: "0 8px 22px -8px hsl(var(--pr-gold) / .7)",
                        }}
                      >
                        <Maximize2 size={10} className="mr-1 inline" />
                        {t({ it: "Apri", en: "Open" })}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* floor glow */}
            <div
              aria-hidden
              className="pointer-events-none absolute bottom-4 left-1/2 h-16 w-[70%] -translate-x-1/2"
              style={{
                background:
                  "radial-gradient(ellipse at center, hsl(var(--pr-gold) / 0.32), transparent 70%)",
                filter: "blur(14px)",
              }}
            />
          </div>

          {/* meta + progress */}
          <div className="mt-8 flex flex-col items-center gap-4">
            {cards[activeIndex] && (
              <div className="text-center">
                <div
                  className="text-[10px] font-bold uppercase tracking-[0.32em]"
                  style={{ color: "hsl(var(--pr-gold-light))" }}
                >
                  {cards[activeIndex].sectorLabel}
                </div>
                <div
                  className="prestige-display mt-1"
                  style={{
                    fontSize: "clamp(1.3rem, 2.6vw, 2rem)",
                    color: "hsl(var(--pr-text-on-dark))",
                  }}
                >
                  {cards[activeIndex].brand}
                </div>
                <div
                  className="mt-1 text-xs sm:text-sm"
                  style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                >
                  {cards[activeIndex].style} · {cards[activeIndex].palette}
                </div>
              </div>
            )}

            <div className="flex items-center gap-3">
              <button
                onClick={() => cards[activeIndex] && setOpenId(cards[activeIndex].id)}
                className="prestige-cta"
              >
                <span>{t({ it: "Apri fullscreen", en: "Open fullscreen" })}</span>
                <Maximize2 size={14} />
              </button>
              <button
                onClick={() => navigate("/portfolio")}
                className="prestige-cta-ghost"
              >
                <span>{t({ it: "Tutti gli stili", en: "All styles" })}</span>
                <ArrowUpRight size={14} />
              </button>
            </div>

            {/* progress bar */}
            <div
              className="mt-2 h-[3px] w-full max-w-md overflow-hidden rounded-full"
              style={{ background: "hsl(var(--pr-gold) / 0.18)" }}
            >
              <div
                className="h-full rounded-full transition-[width] duration-200"
                style={{
                  width: `${Math.min(100, progress * 100)}%`,
                  background:
                    "linear-gradient(90deg, hsl(var(--pr-gold)), hsl(var(--pr-gold-light)))",
                  boxShadow: "0 0 12px hsl(var(--pr-gold) / .6)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {openVariant && (
        <MockupLightbox
          open={!!openVariant}
          onClose={() => setOpenId(null)}
          variant={openVariant}
        />
      )}
    </section>
  );
}
