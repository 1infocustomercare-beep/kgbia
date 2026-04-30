import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Bot, BrainCircuit, CalendarClock, ChartNoAxesCombined, Eye, Gem, MailCheck, MessageCircleMore, Palette, Radar, ShieldCheck, Sparkles, Star, Workflow, type LucideIcon } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/**
 * AgentsCatalog — Bento masonry interattivo con color morph.
 * Effetto scroll: cards si materializzano da angoli random con rotazione 3D
 * e il background della sezione cambia gradient in base al filtro attivo.
 */

type Cat = "vendita" | "marketing" | "operazioni" | "supporto" | "intelligence";

const CATEGORIES: { id: Cat | "all"; label: string; color: string }[] = [
  { id: "all", label: "Tutti", color: "hsl(var(--foreground))" },
  { id: "vendita", label: "Vendita", color: "hsl(var(--primary))" },
  { id: "marketing", label: "Marketing", color: "hsl(var(--neon-magenta))" },
  { id: "operazioni", label: "Operazioni", color: "hsl(var(--accent))" },
  { id: "supporto", label: "Supporto", color: "hsl(var(--empire-violet-glow))" },
  { id: "intelligence", label: "Intelligence", color: "hsl(var(--gold))" },
];

const AGENTS: { name: string; role: string; cat: Cat; icon: LucideIcon; size: "lg" | "md" | "sm" }[] = [
  { name: "Arianna", role: "Sales closer vocale H24", cat: "vendita", icon: Sparkles, size: "lg" },
  { name: "Marcus", role: "Lead hunter predittivo", cat: "vendita", icon: Radar, size: "md" },
  { name: "Sofia", role: "WhatsApp closer multilingua", cat: "vendita", icon: MessageCircleMore, size: "sm" },
  { name: "Lucia", role: "Outreach email iper-personalizzato", cat: "marketing", icon: MailCheck, size: "md" },
  { name: "Dante", role: "Social copywriter neurale", cat: "marketing", icon: Bot, size: "lg" },
  { name: "Iris", role: "Visual designer creativa", cat: "marketing", icon: Palette, size: "sm" },
  { name: "Elia", role: "Operations orchestrator", cat: "operazioni", icon: Workflow, size: "md" },
  { name: "Nora", role: "Calendar & booking sync", cat: "operazioni", icon: CalendarClock, size: "sm" },
  { name: "Bruno", role: "HACCP & compliance", cat: "operazioni", icon: ShieldCheck, size: "sm" },
  { name: "Mia", role: "Customer care 32 lingue", cat: "supporto", icon: Eye, size: "lg" },
  { name: "Teo", role: "Recensioni & reputazione", cat: "supporto", icon: Star, size: "md" },
  { name: "Aurora", role: "Forecast & analytics", cat: "intelligence", icon: ChartNoAxesCombined, size: "lg" },
  { name: "Vega", role: "Pricing dinamico AI", cat: "intelligence", icon: Gem, size: "md" },
  { name: "Atlas", role: "Brain orchestratore", cat: "intelligence", icon: BrainCircuit, size: "sm" },
];

export default function AgentsCatalog() {
  const root = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<Cat | "all">("all");

  const visible = filter === "all" ? AGENTS : AGENTS.filter((a) => a.cat === filter);
  const accent = CATEGORIES.find((c) => c.id === filter)?.color ?? "#22d3ee";

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;

      gsap.from(q("[data-cat-title] .word"), {
        y: 80, opacity: 0, rotateX: -50, stagger: 0.06, duration: 1, ease: "expo.out",
        scrollTrigger: { trigger: el, start: "top 80%" },
      });

      gsap.from(q("[data-cat-pill]"), {
        y: 24, opacity: 0, stagger: 0.04, duration: 0.6, ease: "power2.out",
        scrollTrigger: { trigger: q("[data-cat-pills]")[0], start: "top 88%" },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  // Animate cards on filter change AND on scroll-in
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const cards = q("[data-agent-card]") as HTMLElement[];
      cards.forEach((card, i) => {
        const xs = [-220, 220, 0, -120, 120][i % 5];
        const ys = [200, -180, 240, -100, 100][i % 5];
        const rot = [-18, 14, -8, 10, -6][i % 5];
        gsap.fromTo(card,
          { x: xs, y: ys, opacity: 0, scale: 0.6, rotate: rot, filter: "blur(12px)" },
          {
            x: 0, y: 0, opacity: 1, scale: 1, rotate: 0, filter: "blur(0px)",
            duration: 0.9, ease: "expo.out",
            delay: (i % 8) * 0.04,
            scrollTrigger: { trigger: card, start: "top 92%" },
          }
        );
      });
    }, el);
    return () => ctx.revert();
  }, [filter]);

  return (
    <section
      ref={root}
      id="agents"
      className="relative px-4 py-24 sm:px-5 sm:py-32"
      style={{
        background: `radial-gradient(ellipse 90% 70% at 50% 30%, color-mix(in srgb, ${accent} 12%, transparent), transparent 60%)`,
        transition: "background 600ms ease",
      }}
    >
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-10 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[10px] font-bold uppercase tracking-[3px] backdrop-blur-md"
            style={{ color: accent }}
          >
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: accent, boxShadow: `0 0 10px ${accent}` }} />
            Catalogo agenti · 14 di 38 attivi
          </div>
          <h2 data-cat-title className="font-heading text-[clamp(2.2rem,6vw,5rem)] font-black uppercase leading-[0.95] tracking-normal text-white">
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">Il tuo</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block">team</span></span>{" "}
            <span className="inline-block overflow-hidden align-bottom"><span className="word inline-block bg-[linear-gradient(110deg,hsl(var(--primary)),hsl(var(--empire-violet)),hsl(var(--gold)))] bg-clip-text text-transparent">non dorme mai.</span></span>
          </h2>
          <p className="mx-auto mt-4 max-w-[560px] text-sm text-white/60 sm:text-base">
            Agenti specializzati per ogni reparto. Si parlano fra loro, prendono decisioni, eseguono azioni reali.
          </p>
        </div>

        <div data-cat-pills className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {CATEGORIES.map((c) => {
            const active = filter === c.id;
            return (
              <button
                key={c.id}
                data-cat-pill
                onClick={() => setFilter(c.id)}
                className="group relative overflow-hidden rounded-full border px-4 py-2 text-[11px] font-bold uppercase tracking-[2px] transition-all"
                style={{
                  borderColor: active ? c.color : "rgba(255,255,255,0.15)",
                  color: active ? "hsl(var(--background))" : "hsl(var(--foreground) / 0.7)",
                  background: active ? c.color : "rgba(255,255,255,0.03)",
                  boxShadow: active ? `0 12px 40px -10px ${c.color}` : "none",
                }}
              >
                {c.label}
              </button>
            );
          })}
        </div>

        <div className="grid auto-rows-[140px] grid-cols-2 gap-3 sm:auto-rows-[160px] sm:grid-cols-4 sm:gap-4 lg:grid-cols-6">
          {visible.map((a) => {
            const span =
              a.size === "lg"
                ? "col-span-2 row-span-2"
                : a.size === "md"
                ? "col-span-2 row-span-1"
                : "col-span-1 row-span-1";
            const cat = CATEGORIES.find((c) => c.id === a.cat)!;
            const Icon = a.icon;
            return (
              <article
                key={a.name}
                data-agent-card
                className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03] p-4 backdrop-blur-md transition-all duration-500 hover:-translate-y-1 hover:border-white/30 sm:p-5 ${span}`}
                style={{ boxShadow: "0 14px 50px -25px rgba(0,0,0,0.8)" }}
                onMouseMove={(e) => {
                  const r = e.currentTarget.getBoundingClientRect();
                  e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                  e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              >
                <div
                  className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                  style={{ background: `radial-gradient(360px circle at var(--mx,50%) var(--my,50%), color-mix(in srgb, ${cat.color} 22%, transparent), transparent 60%)` }}
                />
                <div className="relative z-10 flex h-full flex-col justify-between">
                  <div className="flex items-start justify-between">
                    <div
                      className="flex h-10 w-10 items-center justify-center rounded-xl text-lg sm:h-12 sm:w-12 sm:text-xl"
                      style={{ background: `color-mix(in srgb, ${cat.color} 14%, transparent)`, border: `1px solid color-mix(in srgb, ${cat.color} 32%, transparent)` }}
                    >
                      <Icon className="h-5 w-5" style={{ color: cat.color }} />
                    </div>
                    <span
                      className="font-mono text-[9px] uppercase tracking-[2px]"
                      style={{ color: cat.color }}
                    >
                      {cat.label}
                    </span>
                  </div>
                  <div>
                    <div className="font-heading text-base font-black uppercase tracking-tight text-white sm:text-lg">{a.name}</div>
                    <div className="mt-1 line-clamp-2 text-[11px] leading-snug text-white/55 sm:text-xs">{a.role}</div>
                  </div>
                </div>
                <div
                  className="pointer-events-none absolute -bottom-12 -right-12 h-24 w-24 rounded-full opacity-30 blur-2xl transition-all duration-500 group-hover:opacity-60"
                  style={{ background: cat.color }}
                />
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
