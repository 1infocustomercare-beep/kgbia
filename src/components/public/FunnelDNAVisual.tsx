import { useEffect, useRef, memo } from "react";
import { motion } from "framer-motion";

const FunnelDNAVisual = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.scale(dpr, dpr);
    };
    resize();
    window.addEventListener("resize", resize);

    const draw = () => {
      const w = canvas.getBoundingClientRect().width;
      const h = canvas.getBoundingClientRect().height;
      ctx.clearRect(0, 0, w, h);
      t += 0.008;

      const cx = w / 2;
      const cy = h / 2;
      const strands = 2;
      const points = 48;
      const amp = Math.min(w, h) * 0.28;
      const spacing = h / points;

      // Draw connecting lines between strands
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

      // Draw DNA strands
      for (let s = 0; s < strands; s++) {
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
        const py = (h * ((i * 0.618 + t * 0.1) % 1));
        const pa = 0.08 + 0.06 * Math.sin(t * 2 + i);
        ctx.beginPath();
        ctx.arc(px, py, 1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(35, 45%, 55%, ${pa})`;
        ctx.fill();
      }

      // Scanning beam
      const beamY = ((t * 40) % h);
      const beamGrad = ctx.createLinearGradient(0, beamY - 20, 0, beamY + 20);
      beamGrad.addColorStop(0, "hsla(265, 70%, 60%, 0)");
      beamGrad.addColorStop(0.5, "hsla(265, 70%, 60%, 0.06)");
      beamGrad.addColorStop(1, "hsla(265, 70%, 60%, 0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, beamY - 20, w, 40);

      animId = requestAnimationFrame(draw);
    };
    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-background/50">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-64 h-64 bg-primary/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 left-1/3 w-48 h-48 bg-accent/10 rounded-full blur-[80px]" />
      </div>

      {/* Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* HUD overlay elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Corner brackets */}
        {[["top-3 left-3", "border-t border-l"], ["top-3 right-3", "border-t border-r"], ["bottom-3 left-3", "border-b border-l"], ["bottom-3 right-3", "border-b border-r"]].map(([pos, border], i) => (
          <div key={i} className={`absolute ${pos} w-5 h-5 ${border} border-primary/20 rounded-sm`} />
        ))}

        {/* Floating stats */}
        <motion.div className="absolute top-6 right-8 text-right"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
          <div className="text-[0.55rem] font-mono text-primary/40 tracking-widest uppercase">Neural Sync</div>
          <div className="text-[0.65rem] font-mono text-primary/60 font-bold">99.7%</div>
        </motion.div>

        <motion.div className="absolute bottom-6 left-8"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
          <div className="text-[0.55rem] font-mono text-accent/40 tracking-widest uppercase">AI Agents Active</div>
          <div className="text-[0.65rem] font-mono text-accent/60 font-bold">24 / 24</div>
        </motion.div>

        <motion.div className="absolute top-1/2 left-6 -translate-y-1/2 flex flex-col gap-1"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
          {[85, 92, 78, 95, 88].map((v, i) => (
            <div key={i} className="flex items-center gap-1">
              <div className="w-8 h-[2px] rounded-full overflow-hidden bg-primary/10">
                <motion.div className="h-full bg-primary/30 rounded-full"
                  initial={{ width: 0 }} animate={{ width: `${v}%` }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.6 }} />
              </div>
            </div>
          ))}
        </motion.div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/60 via-transparent to-transparent pointer-events-none" />
    </div>
  );
});

FunnelDNAVisual.displayName = "FunnelDNAVisual";
export default FunnelDNAVisual;
