import { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: 847, suffix: "+", label: "Imprese Attive", sub: "in tutta Italia" },
  { value: 3, suffix: ".2M", label: "Processi Automatizzati", sub: "al mese" },
  { value: 94, suffix: "h", label: "Risparmio Medio", sub: "ore/mese per azienda" },
  { value: 40, prefix: "+", suffix: "%", label: "Fatturato", sub: "incremento medio clienti" },
];

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
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
            if (v >= value) {
              setCount(value);
              clearInterval(timer);
            } else setCount(Math.floor(v));
          }, 30);
        }
      },
      { threshold: 0.3 }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-heading text-[2.4rem] font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">
      {prefix}
      {count}
      {suffix}
    </div>
  );
}

export default function LandingMetrics() {
  return (
    <section className="py-14 border-y border-white/[0.05]" style={{ background: "#080810" }}>
      <div className="max-w-[1320px] mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-5">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="text-center py-8 px-4 rounded-2xl border border-white/[0.06] transition-all hover:-translate-y-1 hover:border-white/[0.12]"
              style={{ background: "rgba(13,13,26,0.6)" }}
            >
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} />
              <div className="text-[13px] font-semibold mt-1.5 text-white">{m.label}</div>
              <div className="text-[11px] text-white/30 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
