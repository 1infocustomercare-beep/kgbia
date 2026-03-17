import { useEffect, useRef, memo } from "react";

/** Full-screen canvas neural mesh — DNA helix + data particles + HUD rings */
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
    const isMobile = window.innerWidth < 640;

    const isValid = (v: number) => Number.isFinite(v) && v > 0;

    // ─── Nodes ───
    const nodeCount = isMobile ? 40 : 75;
    type Node = { x: number; y: number; vx: number; vy: number; r: number; type: "v" | "g" | "c"; phase: number };
    const nodes: Node[] = [];
    for (let i = 0; i < nodeCount; i++) {
      const rnd = Math.random();
      nodes.push({
        x: Math.random(), y: Math.random(),
        vx: (Math.random() - 0.5) * 0.0003,
        vy: (Math.random() - 0.5) * 0.0003,
        r: 1 + Math.random() * 1.5,
        type: rnd > 0.85 ? "c" : rnd > 0.7 ? "g" : "v",
        phase: Math.random() * Math.PI * 2,
      });
    }

    // ─── Data particles travelling along edges ───
    const particleCount = isMobile ? 18 : 35;
    type Particle = { fromIdx: number; toIdx: number; progress: number; speed: number; color: "v" | "g" | "c" };
    const particles: Particle[] = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        fromIdx: Math.floor(Math.random() * nodeCount),
        toIdx: Math.floor(Math.random() * nodeCount),
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.004,
        color: ["v", "g", "c"][Math.floor(Math.random() * 3)] as "v" | "g" | "c",
      });
    }

    // ─── DNA Helix params ───
    const helixSegments = isMobile ? 20 : 35;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (!isValid(rect.width) || !isValid(rect.height)) { width = 0; height = 0; return; }
      width = rect.width; height = rect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(width * dpr));
      canvas.height = Math.max(1, Math.floor(height * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => resize()) : null;
    ro?.observe(canvas);

    const colorFor = (type: string, alpha: number) =>
      type === "g" ? `hsla(35,50%,58%,${alpha})`
        : type === "c" ? `hsla(180,70%,55%,${alpha})`
        : `hsla(265,70%,60%,${alpha})`;

    const draw = () => {
      const w = width, h = height;
      if (!isValid(w) || !isValid(h)) { animId = requestAnimationFrame(draw); return; }
      ctx.clearRect(0, 0, w, h);
      t += 0.004;

      // ─── Update nodes ───
      for (const n of nodes) {
        n.x += n.vx; n.y += n.vy;
        if (n.x < 0 || n.x > 1) n.vx *= -1;
        if (n.y < 0 || n.y > 1) n.vy *= -1;
      }

      // ─── Draw connections ───
      const maxDist = 0.16;
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < maxDist) {
            const alpha = (1 - dist / maxDist) * 0.1;
            const isGold = nodes[i].type === "g" || nodes[j].type === "g";
            const isCyan = nodes[i].type === "c" || nodes[j].type === "c";
            ctx.beginPath();
            ctx.moveTo(nodes[i].x * w, nodes[i].y * h);
            ctx.lineTo(nodes[j].x * w, nodes[j].y * h);
            ctx.strokeStyle = isCyan ? `hsla(180,70%,55%,${alpha})` : isGold ? `hsla(35,45%,55%,${alpha})` : `hsla(265,70%,60%,${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // ─── Draw nodes with HUD rings ───
      for (const n of nodes) {
        const px = n.x * w, py = n.y * h;
        const pulse = n.r + Math.sin(t * 3 + n.phase) * 0.5;

        // Outer glow
        const glow = ctx.createRadialGradient(px, py, 0, px, py, pulse * 6);
        glow.addColorStop(0, colorFor(n.type, 0.12));
        glow.addColorStop(1, "transparent");
        ctx.beginPath(); ctx.arc(px, py, pulse * 6, 0, Math.PI * 2); ctx.fillStyle = glow; ctx.fill();

        // Core dot
        ctx.beginPath(); ctx.arc(px, py, pulse, 0, Math.PI * 2);
        ctx.fillStyle = colorFor(n.type, 0.35 + Math.sin(t * 2 + n.phase) * 0.15);
        ctx.fill();

        // HUD ring on cyan nodes
        if (n.type === "c") {
          const ringR = pulse * 3.5;
          const startAngle = t * 2 + n.phase;
          ctx.beginPath();
          ctx.arc(px, py, ringR, startAngle, startAngle + Math.PI * 1.2);
          ctx.strokeStyle = `hsla(180,70%,60%,${0.15 + Math.sin(t + n.phase) * 0.08})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Second arc opposite direction
          ctx.beginPath();
          ctx.arc(px, py, ringR * 0.7, -startAngle, -startAngle + Math.PI * 0.8);
          ctx.strokeStyle = `hsla(265,60%,65%,${0.1 + Math.sin(t * 1.5 + n.phase) * 0.06})`;
          ctx.lineWidth = 0.6;
          ctx.stroke();
        }
      }

      // ─── Data particles travelling between nodes ───
      for (const p of particles) {
        p.progress += p.speed;
        if (p.progress >= 1) {
          p.fromIdx = p.toIdx;
          p.toIdx = Math.floor(Math.random() * nodeCount);
          p.progress = 0;
        }
        const a = nodes[p.fromIdx], b = nodes[p.toIdx];
        const px = (a.x + (b.x - a.x) * p.progress) * w;
        const py = (a.y + (b.y - a.y) * p.progress) * h;
        const alpha = Math.sin(p.progress * Math.PI) * 0.7;

        // Trail
        const trailLen = 0.08;
        const tp = Math.max(0, p.progress - trailLen);
        const tx = (a.x + (b.x - a.x) * tp) * w;
        const ty = (a.y + (b.y - a.y) * tp) * h;
        const tGrad = ctx.createLinearGradient(tx, ty, px, py);
        tGrad.addColorStop(0, "transparent");
        tGrad.addColorStop(1, colorFor(p.color, alpha * 0.4));
        ctx.beginPath(); ctx.moveTo(tx, ty); ctx.lineTo(px, py);
        ctx.strokeStyle = tGrad; ctx.lineWidth = 1; ctx.stroke();

        // Particle dot
        ctx.beginPath(); ctx.arc(px, py, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = colorFor(p.color, alpha);
        ctx.fill();
      }

      // ─── DNA Double Helix (subtle, right side) ───
      const helixCx = w * 0.82, helixCy = h * 0.5;
      const helixH = h * 0.6, helixW = isMobile ? 25 : 40;
      for (let s = 0; s < helixSegments; s++) {
        const frac = s / helixSegments;
        const yy = helixCy - helixH / 2 + helixH * frac;
        const angle = frac * Math.PI * 4 + t * 1.5;
        const x1 = helixCx + Math.sin(angle) * helixW;
        const x2 = helixCx + Math.sin(angle + Math.PI) * helixW;
        const depth1 = (Math.cos(angle) + 1) / 2;
        const depth2 = (Math.cos(angle + Math.PI) + 1) / 2;

        // Rungs
        if (s % 3 === 0) {
          ctx.beginPath(); ctx.moveTo(x1, yy); ctx.lineTo(x2, yy);
          ctx.strokeStyle = `hsla(265,50%,60%,${0.04 + depth1 * 0.04})`;
          ctx.lineWidth = 0.6; ctx.stroke();
        }

        // Strand 1
        if (s > 0) {
          const pFrac = (s - 1) / helixSegments;
          const pAngle = pFrac * Math.PI * 4 + t * 1.5;
          const py = helixCy - helixH / 2 + helixH * pFrac;
          ctx.beginPath();
          ctx.moveTo(helixCx + Math.sin(pAngle) * helixW, py);
          ctx.lineTo(x1, yy);
          ctx.strokeStyle = `hsla(265,70%,65%,${0.06 + depth1 * 0.06})`;
          ctx.lineWidth = 1; ctx.stroke();

          // Strand 2
          ctx.beginPath();
          ctx.moveTo(helixCx + Math.sin(pAngle + Math.PI) * helixW, py);
          ctx.lineTo(x2, yy);
          ctx.strokeStyle = `hsla(180,60%,55%,${0.06 + depth2 * 0.06})`;
          ctx.lineWidth = 1; ctx.stroke();
        }

        // Base pair dots
        ctx.beginPath(); ctx.arc(x1, yy, 1.5 + depth1, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(265,70%,65%,${0.1 + depth1 * 0.15})`;
        ctx.fill();
        ctx.beginPath(); ctx.arc(x2, yy, 1.5 + depth2, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(180,60%,55%,${0.1 + depth2 * 0.15})`;
        ctx.fill();
      }

      // ─── Floating hex data bits ───
      const hexCount = isMobile ? 4 : 8;
      for (let i = 0; i < hexCount; i++) {
        const hx = (0.1 + (i / hexCount) * 0.8) * w;
        const hy = (0.3 + Math.sin(t * 0.5 + i * 1.7) * 0.2) * h;
        const alpha = 0.06 + Math.sin(t + i * 2.1) * 0.03;
        const sz = 3 + Math.sin(t * 0.8 + i) * 1;
        ctx.save();
        ctx.translate(hx, hy);
        ctx.rotate(t * 0.3 + i);
        ctx.beginPath();
        for (let v = 0; v < 6; v++) {
          const a = (Math.PI / 3) * v - Math.PI / 6;
          const method = v === 0 ? "moveTo" : "lineTo";
          ctx[method](Math.cos(a) * sz, Math.sin(a) * sz);
        }
        ctx.closePath();
        ctx.strokeStyle = `hsla(265,60%,65%,${alpha})`;
        ctx.lineWidth = 0.6;
        ctx.stroke();
        ctx.restore();
      }

      // ─── Scanning beam ───
      const beamX = (t * 55) % (w + 200) - 100;
      const beamGrad = ctx.createLinearGradient(beamX - 80, 0, beamX + 80, 0);
      beamGrad.addColorStop(0, "hsla(265,70%,60%,0)");
      beamGrad.addColorStop(0.5, "hsla(265,70%,60%,0.025)");
      beamGrad.addColorStop(1, "hsla(265,70%,60%,0)");
      ctx.fillStyle = beamGrad;
      ctx.fillRect(beamX - 80, 0, 160, h);

      animId = requestAnimationFrame(draw);
    };

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro?.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" style={{ opacity: 0.7 }} />;
});

HeroNeuralCanvas.displayName = "HeroNeuralCanvas";
export default HeroNeuralCanvas;
