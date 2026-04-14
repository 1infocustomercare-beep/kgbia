import { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: 847, suffix: "+", label: "Imprese Attive", sub: "in tutta Italia", color: "#22d3ee" },
  { value: 3, suffix: ".2M", label: "Processi Automatizzati", sub: "al mese", color: "#a78bfa" },
  { value: 94, suffix: "h", label: "Risparmio Medio", sub: "ore/mese per azienda", color: "#4ade80" },
  { value: 40, prefix: "+", suffix: "%", label: "Fatturato", sub: "incremento medio clienti", color: "#f59e0b" },
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
    <div ref={ref} className="font-heading text-[2.8rem] font-extrabold" style={{ color }}>
      {prefix}{count}{suffix}
    </div>
  );
}

export default function LandingMetrics() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Warm dark background — different from hero */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #020204 0%, #0d0a14 50%, #020204 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 60% 50% at 20% 50%, rgba(245,158,11,0.04) 0%, transparent 70%), radial-gradient(ellipse 50% 50% at 80% 50%, rgba(34,211,238,0.04) 0%, transparent 70%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/15 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/10 to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="text-center py-8 px-4 rounded-2xl border border-white/[0.06] transition-all hover:-translate-y-1 hover:border-white/[0.14] hover:shadow-lg"
              style={{ background: "linear-gradient(145deg, rgba(18,14,26,0.85), rgba(8,6,14,0.95))", boxShadow: `0 0 40px ${m.color}08` }}
            >
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} color={m.color} />
              <div className="text-[14px] font-bold mt-2 text-white/90">{m.label}</div>
              <div className="text-[11px] text-white/40 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
