/**
 * ═══ JET SPLASH ═══
 * Splash di caricamento premium in stile web-app luxury: vetro champagne,
 * monogramma AJ inciso, hairline di progresso e uscita a tendina.
 * ADDITIVO — solo presentazione, nessun backend.
 */
import { useEffect, useRef, useState } from "react";

export default function JetSplash({ duration = 2000 }: { duration?: number }) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");
  const [pct, setPct] = useState(6);
  const raf = useRef<number>();

  useEffect(() => {
    if (typeof window !== "undefined" && sessionStorage.getItem("aurea_jet_splash") === "1") {
      setPhase("gone");
      return;
    }
    const start = performance.now();
    const tick = (t: number) => {
      const p = Math.min(1, (t - start) / duration);
      setPct(Math.round(6 + p * 94));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);

    const out = window.setTimeout(() => setPhase("out"), duration);
    const gone = window.setTimeout(() => {
      sessionStorage.setItem("aurea_jet_splash", "1");
      setPhase("gone");
    }, duration + 900);
    return () => {
      if (raf.current) cancelAnimationFrame(raf.current);
      window.clearTimeout(out);
      window.clearTimeout(gone);
    };
  }, [duration]);

  useEffect(() => {
    if (phase === "gone") return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [phase]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[99999] flex items-center justify-center"
      style={{ pointerEvents: phase === "out" ? "none" : "auto" }}
    >
      {/* tendine gemelle che si aprono */}
      <div
        className="absolute inset-x-0 top-0 h-1/2"
        style={{
          background: "linear-gradient(180deg,hsl(30 10% 4%) 0%,hsl(30 9% 6%) 100%)",
          transform: phase === "out" ? "translateY(-100%)" : "translateY(0)",
          transition: "transform 860ms cubic-bezier(.76,0,.24,1)",
        }}
      />
      <div
        className="absolute inset-x-0 bottom-0 h-1/2"
        style={{
          background: "linear-gradient(0deg,hsl(30 10% 4%) 0%,hsl(30 9% 6%) 100%)",
          transform: phase === "out" ? "translateY(100%)" : "translateY(0)",
          transition: "transform 860ms cubic-bezier(.76,0,.24,1)",
        }}
      />

      <div
        className="relative flex flex-col items-center px-8 text-center"
        style={{
          opacity: phase === "out" ? 0 : 1,
          transition: "opacity 380ms ease-out",
        }}
      >
        {/* alone champagne */}
        <div
          className="pointer-events-none absolute"
          style={{
            width: 420,
            height: 420,
            borderRadius: "50%",
            background:
              "radial-gradient(circle,hsl(40 58% 62% / 0.22) 0%,hsl(40 58% 62% / 0.05) 42%,transparent 70%)",
            filter: "blur(18px)",
            animation: "jetSplashHalo 2.6s ease-in-out infinite",
          }}
        />

        {/* monogramma inciso */}
        <div
          className="relative flex h-[104px] w-[104px] items-center justify-center rounded-full"
          style={{
            border: "1px solid hsl(40 45% 80% / 0.28)",
            background:
              "linear-gradient(160deg,hsl(40 40% 92% / 0.10) 0%,hsl(30 10% 8% / 0.6) 50%,hsl(30 10% 5% / 0.85) 100%)",
            boxShadow:
              "inset 0 1px 0 hsl(40 60% 92% / 0.18), 0 30px 70px -30px hsl(40 58% 62% / 0.35)",
            animation: "jetSplashIn 1100ms cubic-bezier(.16,1,.3,1) both",
            overflow: "hidden",
          }}
        >
          <span
            style={{
              fontFamily: "'Playfair Display',Georgia,serif",
              fontSize: 34,
              letterSpacing: "0.06em",
              color: "hsl(40 58% 72%)",
            }}
          >
            AJ
          </span>
          <span
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg,transparent 34%,hsl(40 70% 92% / 0.28) 47%,transparent 60%)",
              animation: "jetSplashSheen 2.4s cubic-bezier(.16,1,.3,1) 0.5s infinite",
            }}
          />
        </div>

        <p
          className="mt-7"
          style={{
            fontFamily: "'Playfair Display',Georgia,serif",
            fontSize: 30,
            color: "hsl(40 26% 95%)",
            letterSpacing: "0.04em",
            animation: "jetSplashRise 900ms cubic-bezier(.16,1,.3,1) 180ms both",
          }}
        >
          Aurea <span style={{ fontStyle: "italic", color: "hsl(40 58% 68%)" }}>Jet</span>
        </p>
        <p
          className="mt-3 text-[9px] uppercase"
          style={{
            fontFamily: "'Jost',Inter,sans-serif",
            letterSpacing: "0.44em",
            color: "hsl(38 12% 66%)",
            animation: "jetSplashRise 900ms cubic-bezier(.16,1,.3,1) 300ms both",
          }}
        >
          Private Aviation
        </p>

        {/* hairline di progresso */}
        <div
          className="relative mt-8 h-px w-[190px] overflow-hidden"
          style={{ background: "hsl(40 45% 80% / 0.16)" }}
        >
          <span
            className="absolute inset-y-0 left-0"
            style={{
              width: `${pct}%`,
              background: "linear-gradient(90deg,transparent,hsl(40 58% 66%))",
              transition: "width 120ms linear",
            }}
          />
        </div>
        <p
          className="mt-3 text-[9px] uppercase"
          style={{
            fontFamily: "'Jost',Inter,sans-serif",
            letterSpacing: "0.3em",
            color: "hsl(38 12% 58%)",
          }}
        >
          Flight desk · {pct}%
        </p>
      </div>

      <style>{`
        @keyframes jetSplashHalo{0%,100%{transform:scale(.94);opacity:.6}50%{transform:scale(1.06);opacity:1}}
        @keyframes jetSplashIn{0%{opacity:0;transform:scale(.82);filter:blur(6px)}100%{opacity:1;transform:scale(1);filter:blur(0)}}
        @keyframes jetSplashRise{0%{opacity:0;transform:translateY(14px)}100%{opacity:1;transform:translateY(0)}}
        @keyframes jetSplashSheen{0%{transform:translateX(-130%)}100%{transform:translateX(130%)}}
        @media (prefers-reduced-motion:reduce){
          [aria-hidden] [style*="jetSplash"]{animation:none !important}
        }
      `}</style>
    </div>
  );
}
