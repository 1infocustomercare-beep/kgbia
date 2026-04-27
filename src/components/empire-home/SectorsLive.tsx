import { useEffect, useMemo, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useNavigate } from "react-router-dom";
import { DEMO_INDUSTRY_DATA, DEMO_SLUGS } from "@/data/demo-industries";
import { INDUSTRY_CONFIGS, type IndustryId } from "@/config/industry-config";

gsap.registerPlugin(ScrollTrigger);

const HEX: Partial<Record<IndustryId, string>> = {
  food: "#fbbf24",
  beauty: "#ec4899",
  ncc: "#22d3ee",
  healthcare: "#4ade80",
  retail: "#a78bfa",
  fitness: "#fb7185",
  hospitality: "#38bdf8",
  beach: "#06b6d4",
  veterinary: "#84cc16",
  childcare: "#f472b6",
  legal: "#c9a84c",
  construction: "#f97316",
  education: "#818cf8",
  logistics: "#2dd4bf",
  tattoo: "#e879f9",
};

const FEATURED: IndustryId[] = ["food", "beauty", "ncc", "healthcare", "fitness", "hospitality", "retail", "veterinary"];

const routeFor = (id: IndustryId) => id === "food" ? `/r/${DEMO_SLUGS[id]}` : `/b/${DEMO_SLUGS[id]}`;

export default function SectorsLive() {
  const root = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState<IndustryId>("food");
  const [loaded, setLoaded] = useState(false);
  const navigate = useNavigate();

  const sectors = useMemo(() => FEATURED.map((id) => ({
    id,
    label: INDUSTRY_CONFIGS[id].label,
    emoji: INDUSTRY_CONFIGS[id].emoji,
    slug: DEMO_SLUGS[id],
    color: HEX[id] ?? "#22d3ee",
    data: DEMO_INDUSTRY_DATA[id],
    route: routeFor(id),
  })), []);

  const allSectors = useMemo(() => (Object.keys(DEMO_SLUGS) as IndustryId[])
    .filter((id) => id !== "custom")
    .map((id) => ({ id, label: INDUSTRY_CONFIGS[id].label, emoji: INDUSTRY_CONFIGS[id].emoji, route: routeFor(id), color: HEX[id] ?? "#22d3ee" })), []);

  const current = sectors.find((s) => s.id === active) ?? sectors[0];

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-sl-title] .word"), {
        y: 84,
        opacity: 0,
        rotateX: -55,
        stagger: 0.055,
        duration: 1,
        ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 76%" },
      });

      gsap.from(q("[data-sl-frame]"), {
        clipPath: isMobile ? "inset(14% 0 14% 0 round 24px)" : "inset(45% 45% 45% 45% round 28px)",
        opacity: 0,
        rotateX: isMobile ? 0 : 16,
        y: isMobile ? 42 : 90,
        scale: 0.94,
        duration: 1.2,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-sl-stage]")[0], start: "top 78%" },
      });

      gsap.from(q("[data-sl-tab]"), {
        y: 26,
        opacity: 0,
        stagger: 0.04,
        duration: 0.55,
        ease: "power2.out",
        scrollTrigger: { trigger: q("[data-sl-tabs]")[0], start: "top 88%" },
      });

      gsap.from(q("[data-sector-card]"), {
        y: 50,
        opacity: 0,
        scale: 0.9,
        rotate: (i) => (i % 2 ? 2 : -2),
        stagger: 0.025,
        duration: 0.7,
        ease: "expo.out",
        scrollTrigger: { trigger: q("[data-sector-grid]")[0], start: "top 84%" },
      });
    }, root);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    setLoaded(false);
    const frame = root.current?.querySelector("[data-sl-frame]");
    if (frame) {
      gsap.fromTo(frame, { rotateY: -7, scale: 0.965, opacity: 0.48 }, { rotateY: 0, scale: 1, opacity: 1, duration: 0.65, ease: "power3.out" });
    }
  }, [active]);

  return (
    <section ref={root} id="sectors" className="relative overflow-hidden px-4 py-24 sm:px-5 sm:py-32" style={{ perspective: "1600px" }}>
      <div className="pointer-events-none absolute inset-0 transition-all duration-700" style={{ background: `radial-gradient(ellipse 78% 52% at 50% 26%, ${current.color}22, transparent 62%), linear-gradient(180deg, rgba(5,8,19,0), rgba(8,19,39,0.72), rgba(5,8,19,0))` }} />

      <div className="relative mx-auto max-w-[1320px]">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.04] px-3 py-1 text-[10px] font-bold uppercase tracking-[3px]" style={{ color: current.color }}>
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: current.color, boxShadow: `0 0 12px ${current.color}` }} />
            Siti settore live · navigabili
          </div>
          <h2 data-sl-title className="font-heading text-[clamp(2.25rem,6.4vw,5.6rem)] font-black uppercase leading-[0.9] text-white" style={{ textShadow: "0 18px 70px rgba(0,0,0,0.44)" }}>
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Apri</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">ogni</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block" style={{ background: "linear-gradient(90deg, #22d3ee, #4ade80, #a78bfa, #ec4899)", WebkitBackgroundClip: "text", color: "transparent" }}>settore.</span></span>
          </h2>
          <p className="mx-auto mt-4 max-w-[640px] text-sm leading-7 text-white/62 sm:text-base">
            Non screenshot finti: qui il prospect vede una piattaforma reale, cliccabile, già pronta per il proprio mercato.
          </p>
        </div>

        <div data-sl-tabs className="mb-8 flex snap-x items-center gap-2 overflow-x-auto pb-2 sm:flex-wrap sm:justify-center sm:overflow-visible">
          {sectors.map((s) => {
            const isActive = active === s.id;
            return (
              <button key={s.id} data-sl-tab onClick={() => setActive(s.id)} className="group relative flex shrink-0 items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 text-[11px] font-bold uppercase tracking-[1.8px] transition-all sm:text-xs" style={{ borderColor: isActive ? s.color : "rgba(255,255,255,0.15)", color: isActive ? "#06101b" : "rgba(255,255,255,0.75)", background: isActive ? s.color : "rgba(255,255,255,0.035)", boxShadow: isActive ? `0 14px 42px -12px ${s.color}` : "none" }}>
                <span className="text-base">{s.emoji}</span>
                {s.label.split(" ")[0]}
              </button>
            );
          })}
        </div>

        <div data-sl-stage className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="order-2 grid gap-3 lg:order-1">
            {[
              ["Sistema", current.data.companyName],
              ["Output", current.data.bookingLabel],
              ["Moduli", current.data.features.map((f) => f.label).slice(0, 3).join(" · ")],
              ["Route", current.route],
            ].map(([k, v]) => (
              <div key={k} className="rounded-2xl border border-white/10 bg-white/[0.035] p-4">
                <div className="text-[10px] font-bold uppercase tracking-[2.5px]" style={{ color: current.color }}>{k}</div>
                <div className="mt-1 text-sm font-semibold text-white/82">{v}</div>
              </div>
            ))}
            <button onClick={() => navigate(current.route)} className="mt-2 rounded-full px-6 py-4 text-xs font-black uppercase tracking-[2px] transition-transform hover:-translate-y-0.5" style={{ background: current.color, color: "#06101b", boxShadow: `0 20px 54px -18px ${current.color}` }}>
              Apri sito live a tutto schermo →
            </button>
          </div>

          <div className="order-1 lg:order-2">
            <div data-sl-frame className="relative overflow-hidden rounded-[24px] border border-white/15 bg-[#07101d]" style={{ boxShadow: `0 50px 130px -34px ${current.color}66, 0 0 0 1px rgba(255,255,255,0.06)`, transformStyle: "preserve-3d" }}>
              <div className="flex items-center gap-2 border-b border-white/10 bg-black/80 px-3 py-3 sm:px-4">
                <span className="h-3 w-3 rounded-full bg-[#ff5f56]" />
                <span className="h-3 w-3 rounded-full bg-[#ffbd2e]" />
                <span className="h-3 w-3 rounded-full bg-[#27c93f]" />
                <div className="ml-2 flex-1 truncate rounded-md border border-white/10 bg-white/5 px-3 py-1 text-[10px] text-white/50 sm:text-[11px]">empire.ai{current.route}</div>
                <button onClick={() => navigate(current.route)} className="hidden rounded-md border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[2px] text-white/80 transition-colors hover:bg-white/10 sm:block">Apri ↗</button>
              </div>

              <div className="relative aspect-[10/14] w-full bg-[#07101d] sm:aspect-[16/10]">
                {!loaded && (
                  <div className="absolute inset-0 z-10 flex items-center justify-center bg-[#07101d]">
                    <div className="flex flex-col items-center gap-3">
                      <div className="h-12 w-12 animate-spin rounded-full border-2 border-white/10" style={{ borderTopColor: current.color }} />
                      <div className="text-[10px] font-mono uppercase tracking-[3px] text-white/40">caricamento {current.label}…</div>
                    </div>
                  </div>
                )}
                <iframe key={current.route} src={current.route} title={`Demo ${current.label}`} className="h-full w-full bg-white" onLoad={() => setLoaded(true)} loading="lazy" sandbox="allow-scripts allow-same-origin allow-forms allow-popups" style={{ opacity: loaded ? 1 : 0, transition: "opacity 600ms ease" }} />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-16">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <div className="text-[10px] font-bold uppercase tracking-[3px] text-white/40">Demo catalog completo</div>
              <h3 className="mt-2 font-heading text-3xl font-black uppercase text-white sm:text-5xl">25 mercati pronti.</h3>
            </div>
            <div className="max-w-[430px] text-sm text-white/52">Ogni card apre un sito diverso: Food, NCC, Beauty, cliniche, retail, palestre, hotel, legal, education e altri.</div>
          </div>
          <div data-sector-grid className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
            {allSectors.map((s) => (
              <button key={s.id} data-sector-card onClick={() => navigate(s.route)} className="group rounded-2xl border border-white/10 bg-white/[0.035] p-4 text-left transition-all hover:-translate-y-1 hover:bg-white/[0.07]">
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-2xl">{s.emoji}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 14px ${s.color}` }} />
                </div>
                <div className="line-clamp-2 min-h-[36px] text-sm font-bold text-white">{s.label}</div>
                <div className="mt-2 truncate text-[10px] text-white/38">{s.route}</div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
