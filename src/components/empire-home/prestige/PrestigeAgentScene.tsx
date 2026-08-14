import { Suspense, lazy, useEffect, useRef, useState, Component, type ReactNode } from "react";
import { Sparkles, Radio } from "lucide-react";
import PrestigeAgentRobot from "./PrestigeAgentRobot";

const Spline = lazy(() => import("@splinetool/react-spline"));
import { Spotlight } from "@/components/ui/spotlight";

/** Scena robot agentico interattiva (segue mouse e touch). */
const ROBOT_SCENE = "https://prod.spline.design/kZDDjO5HuC9GJUM2/scene.splinecode";

class SceneBoundary extends Component<{ children: ReactNode; fallback: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}

const STATUS = [
  "Agenti attivi 24/7",
  "Voce · Chat · WhatsApp",
  "Addestrato sul tuo settore",
];

/**
 * PrestigeAgentScene
 * Robot agentico 3D (Spline) montato 1:1 nella sezione Agenti, con livrea
 * Empire: spotlight oro/smeraldo, cornice luxury, crest e status live.
 * Se la scena 3D non carica, resta il robot SVG interattivo interno.
 */
export default function PrestigeAgentScene() {
  const [visible, setVisible] = useState(false);
  const [ready, setReady] = useState(false);
  const [statusIdx, setStatusIdx] = useState(0);
  const hostRef = useRef<HTMLDivElement>(null);

  // Monta la scena solo quando entra in viewport (protegge lo scroll mobile).
  useEffect(() => {
    const el = hostRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "250px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const id = window.setInterval(() => setStatusIdx((i) => (i + 1) % STATUS.length), 2800);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div
      ref={hostRef}
      className="prestige-agent-scene relative overflow-hidden rounded-[28px]"
      style={{
        background:
          "linear-gradient(160deg, hsl(var(--pr-emerald-mid) / 0.62), hsl(var(--pr-emerald-deep) / 0.92))",
        border: "1px solid hsl(var(--pr-gold) / 0.25)",
        boxShadow: "0 30px 80px -40px hsl(var(--pr-gold) / 0.35)",
      }}
    >
      <Spotlight className="-top-40 left-0 md:-top-24 md:left-32" fill="hsl(var(--pr-gold-light))" />

      {/* alone Empire */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 opacity-80 blur-3xl"
        style={{
          background:
            "radial-gradient(55% 50% at 30% 35%, hsl(var(--pr-emerald) / 0.32), transparent 70%), radial-gradient(45% 45% at 78% 72%, hsl(var(--pr-gold) / 0.22), transparent 72%)",
        }}
      />

      {/* header: crest + status live */}
      <div className="relative z-20 flex items-center justify-between gap-3 px-5 pt-5">
        <div className="flex items-center gap-2">
          <span
            className="flex h-8 w-8 items-center justify-center rounded-xl text-[11px] font-black"
            style={{
              background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
              color: "hsl(var(--pr-emerald-deep))",
            }}
          >
            E
          </span>
          <span
            className="text-[10px] font-semibold uppercase tracking-[0.28em]"
            style={{ color: "hsl(var(--pr-gold-light))" }}
          >
            Empire Agentic Core
          </span>
        </div>
        <span
          className="flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] uppercase tracking-[0.2em]"
          style={{
            background: "hsl(var(--pr-emerald-deep) / 0.6)",
            border: "1px solid hsl(var(--pr-emerald) / 0.4)",
            color: "hsl(var(--pr-muted-on-dark))",
          }}
        >
          <Radio size={11} className="prestige-agent-live" style={{ color: "hsl(var(--pr-emerald))" }} />
          Live
        </span>
      </div>

      {/* scena 3D 1:1 */}
      <div className="relative z-10 h-[380px] w-full sm:h-[460px] lg:h-[520px]">
        {visible && (
          <SceneBoundary fallback={<PrestigeAgentRobot />}>
            <Suspense fallback={<PrestigeAgentRobot />}>
              <Spline
                scene={ROBOT_SCENE}
                onLoad={() => setReady(true)}
                className="!h-full !w-full"
              />
            </Suspense>
          </SceneBoundary>
        )}
        {!ready && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="text-[10px] uppercase tracking-[0.3em]"
              style={{ color: "hsl(var(--pr-muted-on-dark))" }}
            >
              Inizializzazione agente…
            </span>
          </div>
        )}
        {/* vignettatura per fondere la scena col brand */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-20"
          style={{
            background:
              "radial-gradient(120% 90% at 50% 45%, transparent 52%, hsl(var(--pr-emerald-deep) / 0.75) 100%)",
          }}
        />
      </div>

      {/* footer: hint interazione + status rotante */}
      <div className="relative z-20 flex flex-col items-center gap-1.5 px-5 pb-5">
        <div
          className="flex items-center gap-2 text-[11px] uppercase tracking-[0.26em]"
          style={{ color: "hsl(var(--pr-gold-light))" }}
        >
          <Sparkles size={12} />
          Muovi il mouse — l'agente ti segue
        </div>
        <div
          key={statusIdx}
          className="prestige-agent-status text-[11px]"
          style={{ color: "hsl(var(--pr-muted-on-dark))" }}
        >
          {STATUS[statusIdx]}
        </div>
      </div>

      <style>{`
        .prestige-agent-scene canvas { outline: none; }
        .prestige-agent-live { animation: prestige-agent-pulse 1.8s ease-in-out infinite; }
        .prestige-agent-status { animation: prestige-agent-fade .5s ease-out; }
        @keyframes prestige-agent-pulse { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        @keyframes prestige-agent-fade { from { opacity: 0; transform: translateY(4px) } to { opacity: 1; transform: none } }
        @media (prefers-reduced-motion: reduce) {
          .prestige-agent-live, .prestige-agent-status { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
