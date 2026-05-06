import { useEmpireScrollDirector } from "@/components/empire-home/ScrollDirector";
import type { CSSProperties } from "react";

const chaos = ["EMAIL", "EXCEL", "WHATSAPP", "FATTURE", "STAFF", "ORDINI", "CRM", "REPORT", "CALL", "DM", "POST", "BOOKING"];
const stats = [
  { k: "1", l: "Piattaforma unica" },
  { k: "24/7", l: "AI sempre attiva" },
  { k: "+38%", l: "Fatturato medio" },
];

export default function ShiftSection() {
  const { ref, progress, step } = useEmpireScrollDirector<HTMLElement>("shift", { steps: 3 });
  const chaosOpacity = Math.max(0, 1 - progress * 2.2);
  const empireOpacity = Math.min(1, Math.max(0, (progress - 0.32) / 0.36));
  const lineScale = Math.min(1, Math.max(0, (progress - 0.18) / 0.32));

  return (
    <section
      ref={ref}
      id="shift-section"
      className="relative min-h-[185svh] overflow-visible bg-background"
      style={{ "--shift-progress": progress } as CSSProperties}
    >
      <div className="sticky top-0 flex h-[100svh] items-center justify-center overflow-hidden px-4 sm:px-5">
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, hsl(var(--deep-black)) 0%, hsl(var(--background)) 48%, hsl(var(--deep-black)) 100%)",
          }}
        />

        <div
          data-shift-chaos
          className="absolute inset-0 grid place-items-center px-4 transition-[opacity,transform,filter] duration-300 ease-out"
          style={{
            opacity: chaosOpacity,
            transform: `scale(${1 - progress * 0.16}) rotate(${-progress * 5}deg)`,
            filter: `blur(${progress * 18}px)`,
          }}
        >
          <div className="relative flex max-w-[900px] flex-wrap items-center justify-center gap-2 sm:gap-5">
            {chaos.map((word, index) => {
              const drift = progress * 54;
              return (
                <span
                  key={word}
                  className="inline-block rounded-md border border-destructive/35 bg-destructive/10 px-2.5 py-1 font-mono text-[10px] text-destructive/80 sm:px-3 sm:py-1.5 sm:text-sm"
                  style={{
                    transform: `translate(${Math.cos(index * 1.8) * drift}px, ${Math.sin(index * 1.2) * drift}px) rotate(${(index * 17) % 30 - 15}deg)`,
                  }}
                >
                  {word}
                </span>
              );
            })}
          </div>
          <div className="absolute bottom-[14%] text-center">
            <div className="font-heading text-[clamp(1.6rem,5vw,3.4rem)] font-black uppercase tracking-normal text-foreground/82">
              Prima: caos operativo
            </div>
            <div className="mt-2 text-[10px] uppercase tracking-[0.24em] text-destructive/70 sm:text-xs">
              10+ tool scollegati · ore perse · clienti che scappano
            </div>
          </div>
        </div>

        <div
          data-shift-line
          className="absolute left-1/2 top-1/2 z-20 h-[2px] w-[80%] origin-center -translate-x-1/2 -translate-y-1/2 bg-[linear-gradient(90deg,transparent,hsl(var(--primary)),transparent)]"
          style={{ transform: `translate(-50%, -50%) scaleX(${lineScale})` }}
        />

        <div
          data-shift-empire
          className="absolute inset-0 grid place-items-center px-4 transition-[opacity,transform,filter] duration-300 ease-out"
          style={{
            opacity: empireOpacity,
            transform: `scale(${1.08 - empireOpacity * 0.08}) translateY(${(1 - empireOpacity) * 18}px)`,
            filter: `blur(${(1 - empireOpacity) * 16}px)`,
          }}
        >
          <div className="text-center">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-[10px] font-bold tracking-[0.22em] text-primary">
              DOPO · CON EMPIRE
            </div>
            <h2 className="font-heading font-black uppercase tracking-normal" style={{ fontSize: "clamp(2rem, 8vw, 7rem)", lineHeight: 0.9 }}>
              <span className="inline-block bg-[linear-gradient(90deg,hsl(var(--primary)),hsl(var(--gold)),hsl(var(--accent)))] bg-clip-text text-transparent">
                Tutto sotto
              </span>{" "}
              <span className="inline-block text-foreground">controllo.</span>
            </h2>
            <div className="mx-auto mt-8 grid max-w-[820px] grid-cols-3 gap-3 sm:gap-8">
              {stats.map((stat, index) => {
                const lit = step >= index;
                return (
                  <div
                    key={stat.l}
                    data-shift-stat
                    className={`rounded-2xl border p-3 backdrop-blur-md transition-all duration-500 sm:p-6 ${lit ? "border-primary/35 bg-primary/10 opacity-100" : "border-foreground/10 bg-foreground/[0.03] opacity-70"}`}
                  >
                    <div className="font-heading text-2xl font-black text-foreground sm:text-5xl">{stat.k}</div>
                    <div className="mt-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-foreground/58 sm:text-xs">{stat.l}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
