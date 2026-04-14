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
    <div ref={ref} className="font-heading text-[2.6rem] font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function LandingMetrics() {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Premium background */}
      <div className="absolute inset-0" style={{
        background: "linear-gradient(180deg, #060610 0%, #0c0c1e 50%, #060610 100%)",
      }} />
      <div className="absolute inset-0" style={{
        backgroundImage: "radial-gradient(ellipse 60% 40% at 30% 50%, rgba(126,183,190,0.06) 0%, transparent 70%), radial-gradient(ellipse 50% 40% at 70% 50%, rgba(108,60,224,0.05) 0%, transparent 70%)",
      }} />
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#7eb7be]/20 to-transparent" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#6c3ce0]/20 to-transparent" />

      <div className="relative z-[1] max-w-[1320px] mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {METRICS.map((m) => (
            <div
              key={m.label}
              className="text-center py-8 px-4 rounded-2xl border border-white/[0.08] transition-all hover:-translate-y-1 hover:border-[#7eb7be]/30 hover:shadow-lg hover:shadow-[#7eb7be]/5"
              style={{ background: "linear-gradient(135deg, rgba(13,13,30,0.8), rgba(10,10,20,0.9))" }}
            >
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} />
              <div className="text-[14px] font-bold mt-2 text-white/90">{m.label}</div>
              <div className="text-[11px] text-white/40 mt-0.5">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
