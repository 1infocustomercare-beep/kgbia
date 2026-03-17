import { useMemo, useState, useEffect, useRef, useCallback } from "react";

/**
 * Empire DNA Neural Background — scroll-reactive, section-aware.
 * Uses a single canvas for performance. Colors shift per scroll zone
 * to feel more tech / professional: muted monochrome blues & grays
 * with subtle accent changes per section.
 */

const IS_MOBILE =
  typeof window !== "undefined" &&
  (/iPhone|iPad|iPod|Android/i.test(navigator.userAgent) || window.innerWidth < 768);

// Section color palettes — muted, tech, low-saturation
const PALETTES = [
  // Hero: subtle violet + faint gold
  { line: "hsla(240,15%,45%,0.08)", node: "hsla(240,18%,55%,0.12)", pulse: "hsla(265,30%,60%,0.3)" },
  // Section 2: cool steel
  { line: "hsla(210,12%,42%,0.07)", node: "hsla(210,15%,50%,0.10)", pulse: "hsla(210,25%,58%,0.25)" },
  // Section 3: warm muted
  { line: "hsla(30,10%,40%,0.06)", node: "hsla(35,12%,48%,0.09)", pulse: "hsla(38,20%,55%,0.22)" },
  // Section 4: deep neutral
  { line: "hsla(220,10%,38%,0.06)", node: "hsla(220,12%,46%,0.08)", pulse: "hsla(220,18%,52%,0.20)" },
  // Section 5: faint cyan-grey
  { line: "hsla(195,10%,40%,0.06)", node: "hsla(195,12%,48%,0.09)", pulse: "hsla(195,20%,55%,0.22)" },
];

interface Cell {
  x: number; y: number; vx: number; vy: number;
}

const EmpireDNABackground = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const scrollRef = useRef(0);
  const [ready, setReady] = useState(false);

  const CELL_COUNT = IS_MOBILE ? 35 : 55;
  const MAX_DIST = IS_MOBILE ? 120 : 150;

  // Stable cells with slow drift velocities
  const cells = useMemo<Cell[]>(() =>
    Array.from({ length: CELL_COUNT }, () => ({
      x: Math.random(),
      y: Math.random(),
      vx: (Math.random() - 0.5) * 0.00008,
      vy: (Math.random() - 0.5) * 0.00006,
    })),
    [CELL_COUNT]
  );

  useEffect(() => {
    const t = setTimeout(() => setReady(true), 300);
    return () => clearTimeout(t);
  }, []);

  // Track scroll position
  useEffect(() => {
    const onScroll = () => { scrollRef.current = window.scrollY; };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Interpolate between two palettes
  const lerpColor = useCallback((c1: string, c2: string, t: number): string => {
    // Parse hsla values
    const parse = (s: string) => {
      const m = s.match(/hsla?\(([^)]+)\)/);
      if (!m) return [0, 0, 0, 0];
      return m[1].split(",").map(v => parseFloat(v));
    };
    const a = parse(c1), b = parse(c2);
    const h = a[0] + (b[0] - a[0]) * t;
    const s = a[1] + (b[1] - a[1]) * t;
    const l = a[2] + (b[2] - a[2]) * t;
    const al = a[3] + (b[3] - a[3]) * t;
    return `hsla(${h.toFixed(0)},${s.toFixed(0)}%,${l.toFixed(0)}%,${al.toFixed(3)})`;
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !ready) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0;
    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      w = window.innerWidth;
      h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const animate = () => {
      if (!w || !h) { animRef.current = requestAnimationFrame(animate); return; }

      ctx.clearRect(0, 0, w, h);

      // Determine current palette from scroll
      const pageH = document.documentElement.scrollHeight - h;
      const scrollNorm = pageH > 0 ? Math.min(scrollRef.current / pageH, 1) : 0;
      const sectionF = scrollNorm * (PALETTES.length - 1);
      const sIdx = Math.min(Math.floor(sectionF), PALETTES.length - 2);
      const blend = sectionF - sIdx;
      const pal = {
        line: lerpColor(PALETTES[sIdx].line, PALETTES[sIdx + 1].line, blend),
        node: lerpColor(PALETTES[sIdx].node, PALETTES[sIdx + 1].node, blend),
        pulse: lerpColor(PALETTES[sIdx].pulse, PALETTES[sIdx + 1].pulse, blend),
      };

      // Update cell positions (slow drift)
      for (const c of cells) {
        c.x += c.vx;
        c.y += c.vy;
        if (c.x < -0.05) c.x = 1.05;
        if (c.x > 1.05) c.x = -0.05;
        if (c.y < -0.05) c.y = 1.05;
        if (c.y > 1.05) c.y = -0.05;
      }

      // Project to screen
      const pts = cells.map(c => ({ x: c.x * w, y: c.y * h }));

      // Draw connections
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = pal.line;
      for (let i = 0; i < pts.length; i++) {
        for (let j = i + 1; j < pts.length; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST);
            ctx.globalAlpha = alpha * 0.5;
            ctx.beginPath();
            ctx.moveTo(pts[i].x, pts[i].y);
            ctx.lineTo(pts[j].x, pts[j].y);
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      ctx.globalAlpha = 1;
      for (let i = 0; i < pts.length; i++) {
        const r = IS_MOBILE ? 1.5 : 1.2;
        ctx.beginPath();
        ctx.arc(pts[i].x, pts[i].y, r, 0, Math.PI * 2);
        ctx.fillStyle = pal.node;
        ctx.fill();
      }

      // Subtle traveling pulses along a few connections
      const time = Date.now() * 0.001;
      ctx.globalAlpha = 1;
      let pulseCount = 0;
      const maxPulses = IS_MOBILE ? 8 : 15;
      for (let i = 0; i < pts.length && pulseCount < maxPulses; i++) {
        for (let j = i + 1; j < pts.length && pulseCount < maxPulses; j++) {
          const dx = pts[i].x - pts[j].x;
          const dy = pts[i].y - pts[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < MAX_DIST * 0.7 && (i + j) % 7 === 0) {
            const prog = ((time * 0.3 + i * 0.5) % 1);
            const px = pts[i].x + (pts[j].x - pts[i].x) * prog;
            const py = pts[i].y + (pts[j].y - pts[i].y) * prog;
            const pa = Math.sin(prog * Math.PI) * 0.6;
            ctx.beginPath();
            ctx.arc(px, py, IS_MOBILE ? 2 : 1.5, 0, Math.PI * 2);
            ctx.fillStyle = pal.pulse;
            ctx.globalAlpha = pa;
            ctx.fill();
            pulseCount++;
          }
        }
      }
      ctx.globalAlpha = 1;

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(animRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [ready, cells, MAX_DIST, lerpColor]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[1]"
      style={{ opacity: ready ? 0.4 : 0, transition: "opacity 1.5s ease" }}
    />
  );
};

export default EmpireDNABackground;
