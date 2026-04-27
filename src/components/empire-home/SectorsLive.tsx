import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";

gsap.registerPlugin(ScrollTrigger);

/**
 * SectorsLive — Tabs interattivi con preview live (iframe) dei demo settore.
 * Effetto: card 3D che ruota su tab change, glow morph del browser frame,
 * scroll-in con clip-path reveal.
 */

const SECTORS: { id: string; label: string; subtitle: string; slug: string; color: string; emoji: string }[] = [
  { id: "food", label: "Ristoranti", subtitle: "Menu QR · Ordini · KDS", slug: "ristorante", color: "#fbbf24", emoji: "🍽️" },
  { id: "beauty", label: "Beauty & Spa", subtitle: "Booking · CRM · Loyalty", slug: "beauty", color: "#ec4899", emoji: "💅" },
  { id: "ncc", label: "NCC & Charter", subtitle: "Fleet · GPS · Pricing", slug: "ncc", color: "#22d3ee", emoji: "🛥️" },
  { id: "healthcare", label: "Cliniche", subtitle: "Cartelle · Anamnesi · Slot", slug: "healthcare", color: "#4ade80", emoji: "🩺" },
  { id: "retail", label: "Retail", subtitle: "Inventario · Cassa · POS", slug: "retail", color: "#a78bfa", emoji: "🛍️" },
  { id: "fitness", label: "Fitness", subtitle: "Schede · Coach · Pagamenti", slug: "fitness", color: "#f97316", emoji: "💪" },
];

export default function SectorsLive() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();
  const current = SECTORS[active];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-sl-title] .word"), {
        y: 80, opacity: 0, rotateX: -55, stagger: 0.06, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 75%" },
      });

      // Browser frame entry: clip-path reveal + 3D tilt
      gsap.from(q("[data-sl-frame]"), {
        clipPath: "inset(50% 50% 50% 50%)",
        opacity: 0,
        rotateX: 18,
        y: 80,
        duration: 1.4,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 60%" },
      });

      gsap.from(q("[data-sl-tab]"), {
        y: 30, opacity: 0, stagger: 0.05, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: q("[data-sl-tabs]")[0], start: "top 85%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  // Animate frame on tab change
  useEffect(() => {
    setLoaded(false);
    const frame = root.current?.querySelector("[data-sl-frame]");
    if (frame) {
      gsap.fromTo(
        frame,
        { rotateY: -8, scale: 0.96, opacity: 0.4 },
        { rotateY: 0, scale: 1, opacity: 1, duration: 0.7, ease: "power3.out" }
      );
    }
  }, [active]);

  return (
    <section
      ref={root}
      id="sectors"
      className="relative px-4 py-24 sm:px-5 sm:py-32"
      style={{ perspective: "1600px" }}
    >
      {/* Aurora bg adapts to active sector */}
      <div
        className="pointer-events-none absolute inset-0 transition-all duration-700"
        style={{
          background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${current.color}22, transparent 60%)`,
        }}
      />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] backdrop-blur-md"
            style={{ color: current.color }}
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: current.color, boxShadow: `0 0 12px ${current.color}` }} />
            25 settori live · clicca per provare
          </div>
          <h2 data-sl-title className="font-heading text-[clamp(2.2rem,6vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Provala.</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Ora.</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block bg-gradient-to-r from-[#22d3ee] via-[#4ade80] to-[#a78bfa] bg-clip-text text-transparent">Senza registrazione.</span></span>
          </h2>
          <p className="mx-auto mt-4 max-w-[600px] text-sm text-white/60 sm:text-base">
            Le piattaforme reali che consegniamo ai clienti. Naviga dentro al sito del settore — è quello vero, non un mockup.
          </p>
        </div>

        {/* Tabs */}
        <div data-sl-tabs className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {SECTORS.map((s, i) => {
            const isActive = active === i;
            return (
              <button
                key={s.id}
                data-sl-tab
                onClick={() => setActive(i)}
                className="group relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[2px] transition-all sm:text-xs"
                style={{
                  borderColor: isActive ? s.color : "rgba(255,255,255,0.15)",
                  color: isActive ? "#0a0e1a" : "rgba(255,255,255,0.75)",
                  background: isActive ? s.color : "rgba(255,255,255,0.03)",
                  boxShadow: isActive ? `0 14px 40px -10px ${s.color}` : "none",
                }}
              >
                <span className="text-base">{s.emoji}</span>
                {s.label}
              </button>
            );
          })}
        </div>

        {/* Browser frame with iframe */}
        <div className="relative mx-auto max-w-[1100px]" style={{ transformStyle: "preserve-3d" }}>
          <div
            data-sl-frame
            className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0a0e1a]"
            style={{
              boxShadow: `0 50px 120px -30px ${current.color}40, 0 0 0 1px rgba(255,255,255,0.06)`,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Browser chrome */}
            <div className="flex items-center gap-2 border-b border-white/10 bg-[#050505]/90 px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
              <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
              <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
              <div className="ml-3 flex-1 truncate rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[11px] text-white/50">
                empire.ai/demo/{current.slug}
              </div>
              <button
                onClick={() => navigate(`/demo/${current.slug}`)}
                className="hidden rounded-md border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-white/80 transition-colors hover:bg-white/10 sm:block"
              >
                Apri ↗
              </button>
            </div>

            {/* Iframe with skeleton */}
            <div className="relative aspect-[16/10] w-full bg-[#0a0e1a]">
              {!loaded && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="flex flex-col items-center gap-3">
                    <div
                      className="h-12 w-12 animate-spin rounded-full border-2 border-white/10"
                      style={{ borderTopColor: current.color }}
                    />
                    <div className="text-[10px] font-mono uppercase tracking-[3px] text-white/40">
                      caricamento {current.label}…
                    </div>
                  </div>
                </div>
              )}
              <iframe
                key={current.slug}
                src={`/demo/${current.slug}`}
                title={`Demo ${current.label}`}
                className="h-full w-full"
                onLoad={() => setLoaded(true)}
                loading="lazy"
                sandbox="allow-scripts allow-same-origin allow-forms"
                style={{ opacity: loaded ? 1 : 0, transition: "opacity 600ms ease" }}
              />
            </div>
          </div>

          {/* Floor reflection */}
          <div
            className="pointer-events-none absolute -bottom-20 left-1/2 h-32 w-[80%] -translate-x-1/2 rounded-full opacity-50"
            style={{
              background: `radial-gradient(ellipse, ${current.color}55, transparent 70%)`,
              filter: "blur(40px)",
            }}
          />
        </div>

        {/* CTA bar */}
        <div className="mt-14 flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-5">
          <div className="text-center text-sm text-white/60 sm:text-left">
            Stai vedendo <span className="font-bold text-white">{current.label}</span> · {current.subtitle}
          </div>
          <button
            onClick={() => navigate(`/demo/${current.slug}`)}
            className="rounded-full px-6 py-3 text-xs font-bold uppercase tracking-[2px] text-[#0a0e1a] transition-transform hover:-translate-y-0.5"
            style={{ background: current.color, boxShadow: `0 18px 44px -14px ${current.color}` }}
          >
            Esplora a tutto schermo →
          </button>
        </div>
      </div>
    </section>
  );
}
