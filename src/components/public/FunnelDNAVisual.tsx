import { useEffect, useRef, memo, useState } from "react";
import { motion, AnimatePresence, useInView } from "framer-motion";

const FUNNEL_STEPS = [
  { icon: "📲", label: "QR Scan", metric: "1.240", sub: "scansioni/mese", color: "primary" },
  { icon: "🛒", label: "Ordini AI", metric: "+68%", sub: "conversione", color: "primary" },
  { icon: "🤖", label: "Agenti Attivi", metric: "24/24", sub: "operativi", color: "primary" },
  { icon: "💰", label: "Revenue", metric: "€12.4k", sub: "incremento medio", color: "accent" },
] as const;

const FunnelDNAVisual = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Rotate active funnel step
  useEffect(() => {
    const iv = setInterval(() => setActiveStep(p => (p + 1) % FUNNEL_STEPS.length), 3000);
    return () => clearInterval(iv);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId = 0;
    let t = 0;
    let width = 0;
    let height = 0;

    const isValidDimension = (value: number) => Number.isFinite(value) && value > 0;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const nextWidth = rect.width;
      const nextHeight = rect.height;

      if (!isValidDimension(nextWidth) || !isValidDimension(nextHeight)) {
        width = 0;
        height = 0;
        return;
      }

      width = nextWidth;
      height = nextHeight;

      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

      // Reset transform before re-scaling to avoid cumulative drift/overflow.
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });

    const resizeObserver = typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(() => resize())
      : null;
    resizeObserver?.observe(canvas);

    const draw = () => {
      const w = width;
      const h = height;

      if (!isValidDimension(w) || !isValidDimension(h)) {
        animId = requestAnimationFrame(draw);
        return;
      }

      ctx.clearRect(0, 0, w, h);
      t += 0.008;

      const cx = w / 2;
      const points = 48;
      const amp = Math.min(w, h) * 0.28;
      const spacing = h / points;

      // Connecting rungs between strands
      for (let i = 0; i < points; i++) {
        const y = i * spacing;
        const phase1 = Math.sin(t * 2 + i * 0.18) * amp;
        const phase2 = Math.sin(t * 2 + i * 0.18 + Math.PI) * amp;
        const x1 = cx + phase1;
        const x2 = cx + phase2;
        const alpha = 0.04 + 0.06 * Math.sin(t + i * 0.3);

        if (i % 3 === 0) {
          ctx.beginPath();
          ctx.moveTo(x1, y);
          ctx.lineTo(x2, y);
          ctx.strokeStyle = `hsla(265, 70%, 60%, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }

      // DNA strands
      for (let s = 0; s < 2; s++) {
        const phaseOffset = s * Math.PI;
        ctx.beginPath();
        for (let i = 0; i <= points; i++) {
          const y = i * spacing;
          const x = cx + Math.sin(t * 2 + i * 0.18 + phaseOffset) * amp;
          if (i === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        const grad = ctx.createLinearGradient(0, 0, 0, h);
        grad.addColorStop(0, "hsla(265, 70%, 60%, 0.02)");
        grad.addColorStop(0.3, "hsla(265, 70%, 60%, 0.25)");
        grad.addColorStop(0.5, "hsla(265, 70%, 65%, 0.4)");
        grad.addColorStop(0.7, "hsla(35, 45%, 55%, 0.25)");
        grad.addColorStop(1, "hsla(35, 45%, 50%, 0.02)");
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Nodes
        for (let i = 0; i <= points; i++) {
          if (i % 4 !== 0) continue;
          const y = i * spacing;
          const x = cx + Math.sin(t * 2 + i * 0.18 + phaseOffset) * amp;
          const pulse = 1.5 + Math.sin(t * 3 + i) * 1;
          const glow = ctx.createRadialGradient(x, y, 0, x, y, pulse * 4);
          glow.addColorStop(0, `hsla(265, 70%, 65%, ${0.5 + Math.sin(t + i) * 0.2})`);
          glow.addColorStop(1, "hsla(265, 70%, 60%, 0)");
          ctx.beginPath();
          ctx.arc(x, y, pulse * 4, 0, Math.PI * 2);
          ctx.fillStyle = glow;
          ctx.fill();
          ctx.beginPath();
          ctx.arc(x, y, pulse, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(265, 70%, 70%, ${0.7 + Math.sin(t * 2 + i) * 0.3})`;
          ctx.fill();
        }
      }

      // Floating particles
      for (let i = 0; i < 30; i++) {
        const px = cx + Math.sin(t * 0.7 + i * 2.1) * amp * 1.3;
        const py = h * ((i * 0.618 + t * 0.1) % 1);
        const pa = 0.08 + 0.06 * Math.sin(t * 2 + i);
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(35, 45%, 55%, ${pa})`;
        ctx.fill();
      }

      // Scanning beam
      const beamY = (t * 40) % h;
      const beamGrad = ctx.createLinearGradient(0, beamY - 20, 0, beamY + 20);
      beamGrad.addColorStop(0, "hsla(265, 70%, 60%, 0)");
      beamGrad.addColorStop(0.5, "hsla(265, 70%, 60%, 0.06)");
      beamGrad.addColorStop(1, "hsla(265, 70%, 60%, 0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, beamY - 20, w, 40);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  const step = FUNNEL_STEPS[activeStep];

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden" style={{
      background: `linear-gradient(145deg, hsla(150,30%,8%,1) 0%, hsla(160,25%,10%,1) 40%, hsla(140,20%,12%,1) 70%, hsla(150,30%,8%,1) 100%)`
    }}>
      {/* Green tech ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 rounded-full blur-[100px]" style={{ background: "hsla(150,60%,40%,0.12)" }} />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 rounded-full blur-[80px]" style={{ background: "hsla(160,50%,35%,0.1)" }} />
        <div className="absolute top-1/2 right-1/4 w-32 h-32 rounded-full blur-[60px]" style={{ background: "hsla(140,70%,45%,0.08)" }} />
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* HUD overlay — conversion funnel data */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"], ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 ${border} border-primary/20 rounded-sm`} />
        ))}

        {/* Funnel step indicators — left column */}
        <div className="absolute top-5 left-5 flex flex-col gap-1.5">
          {FUNNEL_STEPS.map((s, i) => (
            <motion.div
              key={i}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg backdrop-blur-sm transition-colors ${
                i === activeStep
                  ? "bg-primary/15 border border-primary/30"
                  : "bg-background/5"
              }`}
              animate={{ opacity: i === activeStep ? 1 : 0.4 }}
              transition={{ duration: 0.4 }}
            >
              <span className="text-xs">{s.icon}</span>
              <span className="text-[0.55rem] font-mono text-foreground/70 tracking-wide">{s.label}</span>
            </motion.div>
          ))}
        </div>

        {/* Active metric — right side, animated */}
        <AnimatePresence mode="sync">
          <motion.div
            key={activeStep}
            className="absolute top-5 right-5 text-right"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <div className="text-[0.5rem] font-mono text-primary/50 tracking-[0.2em] uppercase">{step.label}</div>
            <div className="text-lg font-bold font-mono text-primary/80 leading-none mt-0.5">{step.metric}</div>
            <div className="text-[0.5rem] font-mono text-muted-foreground/60 mt-0.5">{step.sub}</div>
          </motion.div>
        </AnimatePresence>

        {/* Bottom conversion bar */}
        <div className="absolute bottom-5 left-5 right-5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[0.5rem] font-mono text-primary/40 tracking-widest uppercase">Funnel Conversion</span>
            <span className="text-[0.55rem] font-mono text-accent/70 font-bold">87.3%</span>
          </div>
          <div className="h-1 rounded-full bg-primary/10 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-gradient-to-r from-primary/50 to-accent/50"
              initial={{ width: 0 }}
              animate={{ width: "87.3%" }}
              transition={{ delay: 0.5, duration: 1.2, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            {FUNNEL_STEPS.map((s, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className={`w-1.5 h-1.5 rounded-full ${i === activeStep ? "bg-primary" : "bg-primary/20"} transition-colors`} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
});

FunnelDNAVisual.displayName = "FunnelDNAVisual";
export default FunnelDNAVisual;
