import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";

const METRICS = [
  { value: 847, suffix: "+", label: "Attività Attive" },
  { value: 25, suffix: "+", label: "Settori Coperti" },
  { value: 40, suffix: "%", prefix: "+", label: "Aumento Fatturato" },
  { value: 99.8, suffix: "%", label: "Soddisfazione" },
];

const AnimatedNumber = ({ value, prefix = "", suffix = "" }: { value: number; prefix?: string; suffix?: string }) => {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !started) setStarted(true); }, { threshold: 0.5 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const duration = 2000;
    const start = Date.now();
    const isFloat = value % 1 !== 0;
    const frame = () => {
      const elapsed = Date.now() - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(isFloat ? parseFloat((value * eased).toFixed(1)) : Math.floor(value * eased));
      if (progress < 1) requestAnimationFrame(frame);
      else setDisplay(value);
    };
    requestAnimationFrame(frame);
  }, [started, value]);

  const formatted = value % 1 !== 0
    ? display.toLocaleString("it-IT", { minimumFractionDigits: 1, maximumFractionDigits: 1 })
    : display.toLocaleString("it-IT");

  return <div ref={ref}>{prefix}{formatted}{suffix}</div>;
};

export default function LandingMetrics() {
  return (
    <section className="relative py-16 px-5 overflow-hidden" style={{ background: "hsla(230,20%,7%,1)" }}>
      <div className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(265,50%,55%,0.15), transparent)" }} />
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: "linear-gradient(90deg, transparent, hsla(38,50%,55%,0.1), transparent)" }} />

      <div className="max-w-[900px] mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8">
        {METRICS.map((m, i) => (
          <motion.div key={m.label} className="text-center" initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
            <div className="text-[clamp(1.8rem,5vw,3rem)] font-heading font-black text-white leading-none mb-1">
              <AnimatedNumber value={m.value} prefix={m.prefix} suffix={m.suffix} />
            </div>
            <p className="text-[0.6rem] sm:text-xs text-foreground/30 tracking-wider uppercase font-medium">{m.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
