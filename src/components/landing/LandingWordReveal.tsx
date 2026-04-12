import { useRef, useEffect, useState } from "react";

const TEXT = "Mentre i tuoi competitor perdono clienti, noi costruiamo il tuo vantaggio competitivo. Un ecosistema di 98 agenti IA autonomi, dashboard predittive, CRM intelligente e automazioni multi-canale che lavora 24/7 — generando fatturato e fidelizzando clienti.";
const PILLS = ["98+ Agenti IA", "Dashboard Predittive", "Automazioni 24/7", "White-Label"];

export default function LandingWordReveal() {
  const ref = useRef<HTMLParagraphElement>(null);
  const [progress, setProgress] = useState(0);
  const words = TEXT.split(" ");

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const vh = window.innerHeight;
      const start = vh * 0.8;
      const end = vh * 0.2;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <section className="py-[120px] sm:py-[140px] px-5 sm:px-10" style={{ background: "#020204" }}>
      <div className="max-w-[1320px] mx-auto">
        <p ref={ref} className="text-center max-w-[880px] mx-auto leading-[1.65]" style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: "clamp(1.3rem, 2.6vw, 1.9rem)", fontWeight: 600 }}>
          {words.map((w, i) => (
            <span key={i} className="transition-opacity duration-400" style={{ opacity: progress > i / words.length ? 1 : 0.12 }}>{w} </span>
          ))}
        </p>
        <div className="flex gap-3 justify-center flex-wrap mt-8">
          {PILLS.map(p => (
            <span key={p} className="text-xs text-[rgba(240,240,245,0.55)] px-5 py-2 rounded-3xl" style={{ border: "1px solid rgba(255,255,255,0.07)" }}>{p}</span>
          ))}
        </div>
      </div>
    </section>
  );
}
