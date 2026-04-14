import { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: 847, suffix: "+", label: "Imprese Attive", sub: "clienti in tutta Italia", color: "#c9a84c" },
  { value: 3, suffix: ".2M", label: "Processi Automatizzati", sub: "operazioni gestite ogni mese", color: "#22c55e" },
  { value: 94, suffix: "h", label: "Ore Risparmiate", sub: "in media per azienda/mese", color: "#60a5fa" },
  { value: 40, prefix: "+", suffix: "%", label: "Fatturato in Più", sub: "incremento medio dei clienti", color: "#a78bfa" },
];

function Counter({ value, prefix = "", suffix = "", color }: { value: number; prefix?: string; suffix?: string; color: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !started.current) {
          started.current = true;
          let v = 0;
          const inc = value / 50;
          const timer = setInterval(() => {
            v += inc;
            if (v >= value) { setCount(value); clearInterval(timer); }
            else setCount(Math.floor(v));
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-heading text-[2.8rem] lg:text-[3.2rem] font-extrabold" style={{ color }}>
      {prefix}{count}{suffix}
    </div>
  );
}

export default function LandingMetrics() {
  return (
    <section className="relative py-20 lg:py-24 overflow-hidden">
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #080a18 0%, #0c1024 50%, #080a18 100%)",
      }} />
      <div className="absolute inset-0 opacity-30" style={{
        backgroundImage: "radial-gradient(ellipse 50% 50% at 25% 50%, rgba(201,168,76,0.08) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 75% 50%, rgba(96,165,250,0.06) 0%, transparent 70%)",
      }} />

      <div className="relative z-[1] max-w-[1200px] mx-auto px-5">
        <div className="text-center mb-12">
          <p className="text-[13px] text-white/50 tracking-wide">I numeri parlano da soli. Risultati aggregati dai nostri clienti attivi.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 lg:gap-8">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="text-center py-10 px-5 rounded-2xl border border-white/[0.06] transition-all hover:-translate-y-1"
              style={{ background: "linear-gradient(160deg, rgba(15,17,38,0.9), rgba(8,10,24,0.95))" }}
            >
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} color={m.color} />
              <div className="text-[15px] font-bold mt-3 text-white/95 tracking-tight">{m.label}</div>
              <div className="text-[12px] text-white/45 mt-1">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
