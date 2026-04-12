import { useEffect, useRef, useState } from "react";
const METRICS = [
  { target: 1240, label: "QR Scan", sub: "scansioni/mese", prefix: "", suffix: "" },
  { target: 68, label: "Ordini AI", sub: "conversione", prefix: "+", suffix: "%" },
  { target: 24, label: "Agenti Attivi", sub: "operativi", prefix: "", suffix: "/24" },
  { target: 12, label: "Revenue", sub: "incremento medio", prefix: "+", suffix: ".4k" },
];
function Counter({ target, prefix, suffix, run }: { target: number; prefix: string; suffix: string; run: boolean }) {
  const [val, setVal] = useState(0);
  useEffect(() => { if (!run) return; let v = 0; const inc = target / 50; const t = setInterval(() => { v += inc; if (v >= target) { setVal(target); clearInterval(t); } else setVal(Math.floor(v)); }, 30); return () => clearInterval(t); }, [target, run]);
  return <>{prefix}{val}{suffix}</>;
}
export default function LandingMetrics() {
  const ref = useRef<HTMLDivElement>(null);
  const [vis, setVis] = useState(false);
  useEffect(() => { const el = ref.current; if (!el) return; const o = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVis(true); o.disconnect(); } }, { threshold: 0.3 }); o.observe(el); return () => o.disconnect(); }, []);
  return (
    <section className="py-16 sm:py-[100px]" style={{ background: "#08080f", borderTop: "1px solid rgba(255,255,255,0.07)", borderBottom: "1px solid rgba(255,255,255,0.07)" }}>
      <div ref={ref} className="max-w-[1320px] mx-auto px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-8">
          {METRICS.map((m, i) => (
            <div key={i} className="text-center p-7">
              <div className="text-[2.4rem] font-extrabold" style={{ fontFamily: "'Space Grotesk',sans-serif", background: "linear-gradient(135deg,#7eb7be,#6c3ce0)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}><Counter target={m.target} prefix={m.prefix} suffix={m.suffix} run={vis} /></div>
              <div className="text-sm font-semibold text-[#f0f0f5] mt-1">{m.label}</div>
              <div className="text-[11px] text-[rgba(240,240,245,0.3)]">{m.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
