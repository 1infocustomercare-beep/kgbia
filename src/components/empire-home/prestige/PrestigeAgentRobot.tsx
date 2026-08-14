import { useEffect, useRef, useState } from "react";

/**
 * PrestigeAgentRobot
 * Robot agentico 3D interattivo: testa, visore e occhi seguono il puntatore
 * (mouse su desktop, touch su mobile). Nessuna dipendenza esterna — è tutto
 * SVG + transform 3D, quindi non può fallire come una scena remota.
 */
export default function PrestigeAgentRobot() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLDivElement>(null);
  const pupilsRef = useRef<SVGGElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const current = useRef({ x: 0, y: 0 });
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduced) return;
    let raf = 0;

    const setFromPoint = (cx: number, cy: number) => {
      const el = wrapRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const nx = (cx - (r.left + r.width / 2)) / (r.width / 2);
      const ny = (cy - (r.top + r.height / 2)) / (r.height / 2);
      target.current = {
        x: Math.max(-1.4, Math.min(1.4, nx)),
        y: Math.max(-1.4, Math.min(1.4, ny)),
      };
    };

    const onMove = (e: PointerEvent) => setFromPoint(e.clientX, e.clientY);
    const onTouch = (e: TouchEvent) => {
      const t = e.touches[0];
      if (t) setFromPoint(t.clientX, t.clientY);
    };

    const tick = () => {
      current.current.x += (target.current.x - current.current.x) * 0.08;
      current.current.y += (target.current.y - current.current.y) * 0.08;
      const { x, y } = current.current;
      if (headRef.current) {
        headRef.current.style.transform =
          `translate3d(${x * 14}px, ${y * 10}px, 0) rotateY(${x * 16}deg) rotateX(${-y * 12}deg)`;
      }
      if (pupilsRef.current) {
        pupilsRef.current.setAttribute(
          "transform",
          `translate(${x * 7} ${y * 5})`,
        );
      }
      if (glowRef.current) {
        glowRef.current.style.transform = `translate3d(${x * -22}px, ${y * -16}px, 0)`;
      }
      raf = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("touchmove", onTouch, { passive: true });
    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("touchmove", onTouch);
      cancelAnimationFrame(raf);
    };
  }, [reduced]);

  return (
    <div
      ref={wrapRef}
      className="agent-robot relative mx-auto aspect-square w-full max-w-[420px]"
      aria-hidden="true"
      style={{ perspective: "1000px" }}
    >
      {/* alone che si muove in controparallasse */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute inset-0 z-0 blur-3xl"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 45%, hsl(var(--pr-gold) / 0.28), transparent 70%), radial-gradient(45% 45% at 70% 70%, hsl(var(--pr-emerald) / 0.35), transparent 72%)",
        }}
      />

      {/* anelli orbitali */}
      <div className="agent-robot-orbit pointer-events-none absolute inset-[6%] z-[1] rounded-full" />
      <div className="agent-robot-orbit agent-robot-orbit--2 pointer-events-none absolute inset-[16%] z-[1] rounded-full" />

      <div
        ref={headRef}
        className="agent-robot-head relative z-10 flex h-full w-full items-center justify-center will-change-transform"
        style={{ transformStyle: "preserve-3d" }}
      >
        <svg viewBox="0 0 300 300" className="h-[78%] w-[78%] overflow-visible">
          <defs>
            <linearGradient id="agentShell" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--pr-gold-light))" />
              <stop offset="55%" stopColor="hsl(var(--pr-gold))" />
              <stop offset="100%" stopColor="hsl(var(--pr-gold-deep))" />
            </linearGradient>
            <linearGradient id="agentVisor" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="hsl(var(--pr-emerald-deep))" />
              <stop offset="100%" stopColor="hsl(var(--pr-emerald))" />
            </linearGradient>
            <filter id="agentSoft" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="6" result="b" />
              <feMerge>
                <feMergeNode in="b" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* antenna */}
          <line x1="150" y1="52" x2="150" y2="26" stroke="url(#agentShell)" strokeWidth="4" strokeLinecap="round" />
          <circle cx="150" cy="20" r="8" fill="hsl(var(--pr-gold-light))" filter="url(#agentSoft)" className="agent-robot-blink" />

          {/* corpo/collo */}
          <rect x="126" y="216" width="48" height="26" rx="12" fill="url(#agentShell)" opacity="0.9" />
          <path
            d="M56 268c14-30 50-46 94-46s80 16 94 46"
            fill="none"
            stroke="url(#agentShell)"
            strokeWidth="8"
            strokeLinecap="round"
            opacity="0.75"
          />

          {/* testa */}
          <rect x="48" y="52" width="204" height="172" rx="54" fill="url(#agentShell)" />
          <rect x="60" y="64" width="180" height="148" rx="46" fill="hsl(var(--pr-emerald-deep))" opacity="0.35" />

          {/* orecchie */}
          <rect x="24" y="118" width="20" height="48" rx="10" fill="url(#agentShell)" opacity="0.85" />
          <rect x="256" y="118" width="20" height="48" rx="10" fill="url(#agentShell)" opacity="0.85" />

          {/* visore */}
          <rect x="72" y="92" width="156" height="94" rx="40" fill="url(#agentVisor)" />
          <rect x="72" y="92" width="156" height="94" rx="40" fill="none" stroke="hsl(var(--pr-gold-light) / 0.55)" strokeWidth="2" />

          {/* occhi che seguono il puntatore */}
          <g ref={pupilsRef}>
            <ellipse cx="120" cy="139" rx="17" ry="19" fill="hsl(var(--pr-gold-light))" filter="url(#agentSoft)" />
            <ellipse cx="180" cy="139" rx="17" ry="19" fill="hsl(var(--pr-gold-light))" filter="url(#agentSoft)" />
            <circle cx="126" cy="132" r="5" fill="#fff" opacity="0.85" />
            <circle cx="186" cy="132" r="5" fill="#fff" opacity="0.85" />
          </g>

          {/* riflesso visore */}
          <path d="M84 106c26-8 60-10 92-4" stroke="#fff" strokeOpacity="0.22" strokeWidth="6" fill="none" strokeLinecap="round" />
        </svg>
      </div>

      <style>{`
        .agent-robot-orbit {
          border: 1px solid hsl(var(--pr-gold) / 0.22);
          animation: agentOrbit 18s linear infinite;
        }
        .agent-robot-orbit--2 {
          border-color: hsl(var(--pr-emerald) / 0.3);
          border-style: dashed;
          animation-duration: 26s;
          animation-direction: reverse;
        }
        .agent-robot-head { animation: agentFloat 6s ease-in-out infinite; }
        .agent-robot-blink { animation: agentBlink 2.4s ease-in-out infinite; }
        @keyframes agentOrbit { to { transform: rotate(360deg); } }
        @keyframes agentFloat { 0%,100% { margin-top: 0 } 50% { margin-top: -10px } }
        @keyframes agentBlink { 0%,100% { opacity: 1 } 50% { opacity: .35 } }
        @media (prefers-reduced-motion: reduce) {
          .agent-robot-orbit, .agent-robot-head, .agent-robot-blink { animation: none !important; }
        }
      `}</style>
    </div>
  );
}
