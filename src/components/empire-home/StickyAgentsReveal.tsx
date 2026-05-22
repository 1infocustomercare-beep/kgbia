import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const AGENTS = [
  { n: "ARIANNA", role: "Sales Closer", desc: "Chiude appuntamenti h24 con voce naturale, gestisce obiezioni in 32 lingue.", c: "#7eb7be" },
  { n: "MARCUS", role: "Operations AI", desc: "Sincronizza CRM, ordini e magazzino in tempo reale. Zero conflitti.", c: "#a78bfa" },
  { n: "NOVA", role: "Marketing Brain", desc: "Genera campagne, post e funnel ottimizzati ogni 6 ore in autonomia.", c: "#ec4899" },
  { n: "ATLAS", role: "Decision Engine", desc: "Predice churn, vendite e cash-flow con precisione del 94%.", c: "#f59e0b" },
];

export default function StickyAgentsReveal() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const panels = q("[data-agent-panel]") as HTMLElement[];
      const visuals = q("[data-agent-visual]") as HTMLElement[];
      const labels = q("[data-agent-label]") as HTMLElement[];

      if (visuals.length === 0) return;

      gsap.set(visuals, { opacity: 0, scale: 1.15, filter: "blur(20px)" });
      gsap.set(visuals[0], { opacity: 1, scale: 1, filter: "blur(0px)" });
      if (labels.length) {
        gsap.set(labels, { opacity: 0.25 });
        gsap.set(labels[0], { opacity: 1 });
      }

      const switchTo = (i: number) => {
        visuals.forEach((v, idx) => {
          gsap.to(v, {
            opacity: idx === i ? 1 : 0,
            scale: idx === i ? 1 : 1.1,
            filter: idx === i ? "blur(0px)" : "blur(16px)",
            duration: 0.7,
            ease: "power3.out",
          });
        });
        labels.forEach((l, idx) => {
          gsap.to(l, { opacity: idx === i ? 1 : 0.25, duration: 0.4 });
        });
      };

      panels.forEach((panel, i) => {
        ScrollTrigger.create({
          trigger: panel,
          start: "top 60%",
          end: "bottom 40%",
          onEnter: () => switchTo(i),
          onEnterBack: () => switchTo(i),
        });
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="agenti" className="relative px-4 py-24 sm:px-5 sm:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 max-w-[760px] sm:mb-20">
          <div className="mb-3 text-[11px] font-bold uppercase tracking-[3px] text-[#a78bfa]">04 · AGENTI NEURALI</div>
          <h2 className="font-heading text-[clamp(2.2rem,6vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
            Quattro cervelli.<br />
            <span className="bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">Un solo dominio.</span>
          </h2>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-12">
          <div className="hidden lg:block">
            <div className="sticky top-[15vh] aspect-square w-full overflow-hidden rounded-[2.5rem] border border-white/10 bg-black/40">
              {AGENTS.map((a, i) => (
                <div
                  key={a.n}
                  data-agent-visual
                  className="absolute inset-0 flex flex-col items-center justify-center p-10"
                  style={{
                    background: `radial-gradient(circle at 50% 50%, ${a.c}33 0%, transparent 70%), linear-gradient(160deg, ${a.c}14, transparent)`,
                  }}
                >
                  <div className="font-mono text-[10px] tracking-[4px] text-white/50">EMPIRE.OS · AGENT-{String(i + 1).padStart(2, "0")}</div>
                  <div className="my-6 h-32 w-32 rounded-full" style={{
                    background: `radial-gradient(circle, ${a.c} 0%, transparent 60%)`,
                    boxShadow: `0 0 80px ${a.c}, inset 0 0 40px rgba(255,255,255,0.2)`,
                    animation: "pulse 2.4s ease-in-out infinite",
                  }} />
                  <div className="font-heading text-7xl font-black tracking-tighter text-white">{a.n}</div>
                  <div className="mt-2 text-xs uppercase tracking-[3px]" style={{ color: a.c }}>{a.role}</div>
                </div>
              ))}
              <div className="absolute bottom-5 left-5 z-10 flex gap-2">
                {AGENTS.map((a, i) => (
                  <span key={i} data-agent-label className="h-1.5 w-10 rounded-full" style={{ background: a.c }} />
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-16 lg:space-y-[55vh]">
            {AGENTS.map((a, i) => (
              <div key={a.n} data-agent-panel className="lg:min-h-[40vh]">
                {/* Mobile compact visual card */}
                <div
                  className="mb-5 flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md lg:hidden"
                  style={{ background: `linear-gradient(135deg, ${a.c}14, transparent 60%)` }}
                >
                  <div
                    className="h-14 w-14 shrink-0 rounded-full"
                    style={{
                      background: `radial-gradient(circle, ${a.c} 0%, transparent 70%)`,
                      boxShadow: `0 0 40px ${a.c}88`,
                    }}
                  />
                  <div className="min-w-0">
                    <div className="font-mono text-[9px] tracking-[3px] text-white/80">AGENT-{String(i + 1).padStart(2, "0")}</div>
                    <div className="text-xs font-bold uppercase tracking-[2px]" style={{ color: a.c }}>{a.role}</div>
                  </div>
                </div>

                <div className="mb-3 flex items-center gap-3 sm:mb-4">
                  <span className="font-mono text-xs tracking-[3px] text-white/80">{String(i + 1).padStart(2, "0")} / 04</span>
                  <span className="h-px flex-1 bg-white/15" />
                  <span className="hidden text-xs uppercase tracking-[3px] sm:inline" style={{ color: a.c }}>{a.role}</span>
                </div>
                <h3 className="font-heading text-4xl font-black tracking-tight text-white sm:text-5xl lg:text-6xl">{a.n}</h3>
                <p className="mt-4 max-w-[460px] text-[14px] leading-[1.85] text-white/65 sm:mt-5 sm:text-[15px]">{a.desc}</p>
                <div className="mt-5 flex flex-wrap gap-2 sm:mt-6">
                  {["voce naturale", "h24/365", "self-learning", "no-code"].map(t => (
                    <span key={t} className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] uppercase tracking-[2px] text-white/65 sm:text-[11px]">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
