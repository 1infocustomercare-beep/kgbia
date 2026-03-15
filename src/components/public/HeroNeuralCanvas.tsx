import { useEffect, useRef, memo } from "react";

/** Full-screen canvas neural mesh for hero background — ultra premium futuristic feel */
const HeroNeuralCanvas = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

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

    const nodes: { x: number; y: number; vx: number; vy: number; r: number; type: "v" | "g" }[] = [];
    const nodeCount = window.innerWidth < 640 ? 35 : 65;

    for (let i = 0; i < nodeCount; i++) {
      nodes.push({
        x: Math.random(),
        y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        r: 1 + Math.random() * 1.5,
        type: Math.random() > 0.75 ? "g" : "v",
      });
    }

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

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));

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
      t += 0.004;

      // Update nodes
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      // Draw connections
      const maxDist = 0.18;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.12;
            const isGold = nodes[i].type === "g" || nodes[j].type === "g";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = isGold
              ? `hsla(35, 45%, 55%, ${alpha})`
              : `hsla(265, 70%, 60%, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      for (const n of nodes) {
        const px = n.x * w;
        const py = n.y * h;
        const pulse = n.r + Math.sin(t * 3 + n.x * 10) * 0.5;
        const isGold = n.type === "g";

        // Glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, pulse * 5);
        glow.addColorStop(0, isGold ? "hsla(35, 45%, 55%, 0.15)" : "hsla(265, 70%, 60%, 0.15)");
        glow.addColorStop(1, "transparent");
        ctx.beginPath();
        ctx.arc(px, py, pulse * 5, 0, Math.PI * 2);
        ctx.fillStyle = glow;
        ctx.fill();

        // Core
        ctx.beginPath();
        ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.fillStyle = isGold
          ? `hsla(35, 45%, 60%, ${0.3 + Math.sin(t * 2 + n.y * 5) * 0.15})`
          : `hsla(265, 70%, 65%, ${0.3 + Math.sin(t * 2 + n.y * 5) * 0.15})`;
        ctx.fill();
      }

      // Travelling pulses along connections
      for (let i = 0; i < Math.min(nodes.length - 1, 12); i++) {
        const a = nodes[i];
        const b = nodes[(i + 3) % nodes.length];
        const progress = (t * 0.8 + i * 0.3) % 1;
        const px = (a.x + (b.x - a.x) * progress) * w;
        const py = (a.y + (b.y - a.y) * progress) * h;
        const alpha = Math.sin(progress * Math.PI) * 0.6;
        ctx.beginPath();
        ctx.arc(px, py, 1.5, 0, Math.PI * 2);
        ctx.fillStyle = i % 3 === 0
          ? `hsla(35, 50%, 58%, ${alpha})`
          : `hsla(265, 80%, 70%, ${alpha})`;
        ctx.fill();
      }

      // Scanning beam (horizontal)
      const beamX = (t * 60) % (w + 200) - 100;
      const beamGrad = ctx.createLinearGradient(beamX - 60, 0, beamX + 60, 0);
      beamGrad.addColorStop(0, "hsla(265, 70%, 60%, 0)");
      beamGrad.addColorStop(0.5, "hsla(265, 70%, 60%, 0.03)");
      beamGrad.addColorStop(1, "hsla(265, 70%, 60%, 0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(beamX - 60, 0, 120, h);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
});

HeroNeuralCanvas.displayName = "HeroNeuralCanvas";
export default HeroNeuralCanvas;
