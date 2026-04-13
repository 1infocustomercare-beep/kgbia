import { useEffect, useRef, useState } from "react";

const METRICS = [
  { value: 1240, suffix: "", label: "QR Scan", sub: "scansioni/mese" },
  { value: 68, prefix: "+", suffix: "%", label: "Ordini AI", sub: "conversione" },
  { value: 24, suffix: "/24", label: "Agenti Attivi", sub: "operativi" },
  { value: 12, prefix: "+", suffix: ".4k", label: "Revenue", sub: "incremento medio" },
];

function Counter({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => {
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
    }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [value]);

  return (
    <div ref={ref} className="font-heading text-[2.2rem] font-extrabold bg-gradient-to-r from-[#7eb7be] to-[#6c3ce0] bg-clip-text text-transparent">
      {prefix}{count}{suffix}
    </div>
  );
}

export default function LandingMetrics() {
  return (
    <section className="py-12 border-y border-white/[0.07]" style={{ background: "#080810" }}>
      <div className="max-w-[1320px] mx-auto px-5">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">
          {METRICS.map((m) => (
            <div key={m.label} className="text-center py-7 px-4 rounded-2xl border border-white/[0.07] transition-all hover:-translate-y-1 hover:border-white/[0.14]" style={{ background: "#0d0d1a" }}>
              <Counter value={m.value} prefix={m.prefix} suffix={m.suffix} />
              <div className="text-[13px] font-semibold mt-1 text-white">{m.label}</div>
              <div className="text-[11px] text-white/30">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
