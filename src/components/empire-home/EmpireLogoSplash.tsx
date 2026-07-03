import { useEffect, useState } from "react";
import { EMPIRE_BRAND } from "@/lib/empire-brand";

/**
 * Empire AI — Splash screen premium (Glovo-style).
 * Logo originale al centro con animazione entry, pulse gold e exit fade.
 * Sfondo che matcha il colore primario del logo (deep navy → emerald).
 */
export default function EmpireLogoSplash({
  duration = 1900,
  onDone,
}: {
  duration?: number;
  onDone?: () => void;
}) {
  const [phase, setPhase] = useState<"in" | "out" | "gone">("in");

  useEffect(() => {
    // già visto in questa sessione → skip
    if (typeof window !== "undefined" && sessionStorage.getItem("empire_splash_seen") === "1") {
      setPhase("gone");
      onDone?.();
      return;
    }
    const outT = setTimeout(() => setPhase("out"), duration);
    const goneT = setTimeout(() => {
      setPhase("gone");
      sessionStorage.setItem("empire_splash_seen", "1");
      onDone?.();
    }, duration + 550);
    return () => {
      clearTimeout(outT);
      clearTimeout(goneT);
    };
  }, [duration, onDone]);

  if (phase === "gone") return null;

  return (
    <div
      aria-hidden
      className="fixed inset-0 z-[100000] flex items-center justify-center"
      style={{
        background:
          "radial-gradient(120% 90% at 50% 40%, #0F2A3A 0%, #081824 55%, #050d15 100%)",
        opacity: phase === "out" ? 0 : 1,
        transition: "opacity 520ms cubic-bezier(.4,0,.2,1)",
        pointerEvents: phase === "out" ? "none" : "auto",
      }}
    >
      {/* stelle sottili */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(1px 1px at 20% 30%, rgba(255,255,255,.6), transparent 60%)," +
            "radial-gradient(1px 1px at 80% 20%, rgba(255,255,255,.4), transparent 60%)," +
            "radial-gradient(1.5px 1.5px at 65% 75%, rgba(201,162,75,.5), transparent 60%)," +
            "radial-gradient(1px 1px at 30% 80%, rgba(255,255,255,.3), transparent 60%)",
          opacity: 0.6,
        }}
      />

      {/* gold halo pulse */}
      <div
        className="absolute"
        style={{
          width: 520,
          height: 520,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(201,162,75,0.35) 0%, rgba(201,162,75,0.08) 40%, transparent 70%)",
          filter: "blur(20px)",
          animation: "empireSplashHalo 1.9s ease-out infinite",
        }}
      />

      {/* logo */}
      <div
        className="relative"
        style={{
          animation:
            phase === "in"
              ? "empireSplashIn 900ms cubic-bezier(.2,.9,.25,1.15) both"
              : "empireSplashOut 520ms cubic-bezier(.4,0,.2,1) forwards",
        }}
      >
        <div
          className="relative overflow-hidden rounded-[28px]"
          style={{
            width: 168,
            height: 168,
            boxShadow:
              "0 30px 80px -20px rgba(201,162,75,0.55), 0 0 0 1px rgba(201,162,75,0.35), inset 0 0 0 1px rgba(255,255,255,0.06)",
          }}
        >
          <img
            src={empireLogo.url}
            alt="Empire AI"
            className="h-full w-full object-cover"
            draggable={false}
          />
          {/* shine sweep */}
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                "linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.28) 45%, transparent 60%)",
              animation: "empireSplashShine 1.9s ease-in-out 0.4s infinite",
            }}
          />
        </div>

        {/* wordmark */}
        <div
          className="mt-6 text-center"
          style={{
            fontFamily: "'DM Serif Display', Georgia, serif",
            color: "#F7F3EC",
            fontSize: 30,
            letterSpacing: "0.14em",
            textShadow: "0 2px 24px rgba(201,162,75,0.35)",
          }}
        >
          EMPIRE<span style={{ color: "#C9A24B" }}>.AI</span>
        </div>
        <div
          className="mt-2 text-center text-[10px] uppercase"
          style={{
            fontFamily: "'Fira Sans', Inter, sans-serif",
            color: "rgba(247,243,236,0.6)",
            letterSpacing: "0.42em",
          }}
        >
          Autonomous AI
        </div>

        {/* progress hairline */}
        <div className="mx-auto mt-6 h-[2px] w-[140px] overflow-hidden rounded-full bg-white/8">
          <div
            style={{
              height: "100%",
              background: "linear-gradient(90deg, transparent, #C9A24B, transparent)",
              animation: "empireSplashBar 1.4s ease-in-out infinite",
            }}
          />
        </div>
      </div>

      <style>{`
        @keyframes empireSplashIn {
          0%   { opacity: 0; transform: scale(0.72) translateY(14px); filter: blur(8px); }
          60%  { opacity: 1; filter: blur(0); }
          100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0); }
        }
        @keyframes empireSplashOut {
          0%   { opacity: 1; transform: scale(1); }
          100% { opacity: 0; transform: scale(1.06); filter: blur(4px); }
        }
        @keyframes empireSplashHalo {
          0%,100% { transform: scale(0.92); opacity: 0.55; }
          50%     { transform: scale(1.08); opacity: 0.95; }
        }
        @keyframes empireSplashShine {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(120%); }
        }
        @keyframes empireSplashBar {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
