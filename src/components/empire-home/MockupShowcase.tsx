import { useMemo } from "react";
import { SECTOR_MOCKUP_IMAGES } from "@/data/sector-mockup-images";
import { pickMockup } from "@/lib/mockup-rotation";
import RealisticIPhonePreview from "@/components/empire-home/RealisticIPhonePreview";
import { useEmpireScrollDirector, clamp01 } from "@/components/empire-home/ScrollDirector";

const SLIDES = [
  { sector: "Food · Strapizzami", label: "Pizzeria luxury", img: pickMockup("food", "showcase") ?? SECTOR_MOCKUP_IMAGES.food?.[1], accent: "primary" },
  { sector: "Sushi · Paperfish", label: "Sakura dark", img: pickMockup("food", "showcase", 2) ?? SECTOR_MOCKUP_IMAGES.food?.[3], accent: "accent" },
  { sector: "NCC · Asinara", label: "Charter & Yacht", img: pickMockup("ncc", "showcase") ?? SECTOR_MOCKUP_IMAGES.ncc?.[0], accent: "primary" },
  { sector: "Beauty · Neo Nails", label: "Lavender luxe", img: pickMockup("beauty", "showcase") ?? SECTOR_MOCKUP_IMAGES.beauty?.[0], accent: "empire-violet-glow" },
  { sector: "Padel · City Padel", label: "Sage luxe", img: pickMockup("fitness", "showcase") ?? SECTOR_MOCKUP_IMAGES.fitness?.[0], accent: "gold" },
].filter((s): s is typeof s & { img: string } => !!s.img);

export default function MockupShowcase() {
  const { ref, progress, step } = useEmpireScrollDirector<HTMLElement>("mockup-showcase", { steps: SLIDES.length });
  const active = Math.min(SLIDES.length - 1, step);
  const titleProgress = clamp01(progress / 0.22);
  const localProgress = progress * Math.max(1, SLIDES.length - 1);

  const stageMinHeight = useMemo(() => `${Math.max(220, SLIDES.length * 58)}svh`, []);

  return (
    <section
      ref={ref}
      id="mockups"
      className="relative overflow-visible bg-background"
      style={{ minHeight: stageMinHeight, perspective: "1400px" }}
    >
      <div className="sticky top-0 min-h-[100svh] w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-0 opacity-80">
          <div
            className="absolute left-1/2 top-1/2 h-[120vmin] w-[120vmin] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, hsl(var(--primary) / 0.18), hsl(var(--gold) / 0.10) 35%, transparent 65%)", filter: "blur(80px)" }}
          />
          <div
            className="absolute inset-x-0 bottom-0 h-1/2"
            style={{
              backgroundImage: "linear-gradient(hsl(var(--empire-violet) / 0.10) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--empire-violet) / 0.10) 1px, transparent 1px)",
              backgroundSize: "80px 80px",
              transform: "perspective(800px) rotateX(60deg)",
              transformOrigin: "top",
              maskImage: "linear-gradient(to bottom, black, transparent)",
              WebkitMaskImage: "linear-gradient(to bottom, black, transparent)",
            }}
          />
        </div>

        <div
          className="absolute left-0 right-0 top-0 z-[5] px-5 pt-20 transition-[opacity,transform] duration-300 sm:pt-28"
          style={{ opacity: titleProgress, transform: `translateY(${(1 - titleProgress) * 18}px)` }}
        >
          <div className="mx-auto max-w-[1280px]">
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-background/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-primary backdrop-blur-md">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
              Progetti reali · già consegnati
            </div>
            <h2 className="font-heading text-[clamp(2rem,5.5vw,4.5rem)] font-black uppercase leading-[0.95] tracking-normal text-foreground">
              Un design su misura
              <span className="block bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--gold)),hsl(var(--accent)))] bg-clip-text text-transparent">
                per il tuo settore.
              </span>
            </h2>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center px-4 pt-24 sm:pt-28">
          <div className="relative flex h-[min(64vh,620px)] w-full max-w-6xl items-center justify-center" style={{ transformStyle: "preserve-3d" }}>
            {SLIDES.map((slide, index) => {
              const distance = index - localProgress;
              const visible = Math.abs(distance) < 1.65;
              const isActive = index === active;
              const compact = typeof window !== "undefined" && window.innerWidth < 768;
              const x = distance * (compact ? 36 : 188);
              const y = Math.abs(distance) * (compact ? 22 : 18);
              const scale = clamp01(1 - Math.abs(distance) * 0.16);
              const opacity = visible ? clamp01(1 - Math.abs(distance) * 0.5) : 0;

              return (
                <div
                  key={`${slide.sector}-${slide.img}`}
                  className="absolute left-1/2 top-1/2 z-[3] transition-[opacity,transform,filter] duration-500 ease-out"
                  style={{
                    opacity,
                    filter: `blur(${Math.abs(distance) * 3}px)`,
                    transform: `translate3d(calc(-50% + ${x}px), calc(-50% + ${y}px), ${-Math.abs(distance) * 130}px) scale(${0.82 + scale * 0.22}) rotateY(${distance * -10}deg)`,
                    pointerEvents: isActive ? "auto" : "none",
                  }}
                >
                  <RealisticIPhonePreview
                    src={slide.img}
                    alt={slide.label}
                    size="lg"
                    className="drop-shadow-[0_44px_80px_hsl(0_0%_0%_/_0.55)]"
                  />
                </div>
              );
            })}
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 z-[5] w-[min(620px,92vw)] -translate-x-1/2 text-center">
          <div className="mb-2 font-mono text-[10px] tracking-[0.28em] text-foreground/45">
            {String(active + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
          </div>
          <div className="font-heading text-2xl font-black uppercase tracking-normal text-foreground transition-all duration-500 sm:text-3xl">
            {SLIDES[active].sector}
          </div>
          <div className="mt-1 text-xs text-foreground/60">{SLIDES[active].label}</div>
          <div className="mt-5 flex items-center justify-center gap-2">
            {SLIDES.map((slide, index) => (
              <span
                key={slide.sector}
                className={`h-1 rounded-full transition-all duration-500 ${index === active ? "w-7 bg-primary shadow-[0_0_12px_hsl(var(--primary))]" : "w-2 bg-foreground/20"}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
