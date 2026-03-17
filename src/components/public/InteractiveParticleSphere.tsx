import { useRef, useEffect, useCallback, useMemo } from "react";

/**
 * Interactive 3D Particle Sphere — Empire IA DNA Neural Core v4
 * Default state: Rotating DNA triple-helix ring (from splash) with neural communication
 * On hover/touch: morphs into "EMPIRE IA GROUP"
 * Drag: orbits the structure
 */

function generateTextPoints(
  text: string, cx: number, cy: number, scale: number
): { x: number; y: number }[] {
  const pts: { x: number; y: number }[] = [];
  const font: Record<string, number[][]> = {
    E: [[0,0],[1,0],[2,0],[3,0],[0,1],[0,2],[1,2],[2,2],[0,3],[0,4],[1,4],[2,4],[3,4]],
    M: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,1],[3,0],[4,0],[4,1],[4,2],[4,3],[4,4],[1,1],[3,1],[2,2]],
    P: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2]],
    I: [[0,0],[1,0],[2,0],[1,1],[1,2],[1,3],[0,4],[1,4],[2,4]],
    R: [[0,0],[0,1],[0,2],[0,3],[0,4],[1,0],[2,0],[3,0],[3,1],[3,2],[2,2],[1,2],[2,3],[3,4]],
    G: [[1,0],[2,0],[3,0],[0,1],[0,2],[0,3],[1,4],[2,4],[3,4],[3,3],[3,2],[2,2]],
    O: [[1,0],[2,0],[0,1],[3,1],[0,2],[3,2],[0,3],[3,3],[1,4],[2,4]],
    U: [[0,0],[0,1],[0,2],[0,3],[3,0],[3,1],[3,2],[3,3],[1,4],[2,4]],
    A: [[1,0],[2,0],[0,1],[3,1],[0,2],[1,2],[2,2],[3,2],[0,3],[3,3],[0,4],[3,4]],
    " ": [],
  };
  const chars = text.split("");
  const charWidths = chars.map(c => {
    const glyph = font[c];
    if (!glyph || glyph.length === 0) return 2;
    return Math.max(...glyph.map(p => p[0])) + 2;
  });
  const totalWidth = charWidths.reduce((s, w) => s + w, 0);
  let offsetX = cx - (totalWidth * scale) / 2;
  for (let ci = 0; ci < chars.length; ci++) {
    const glyph = font[chars[ci]] || [];
    for (const [gx, gy] of glyph) {
      for (let d = 0; d < 3; d++) {
        pts.push({
          x: offsetX + gx * scale + (Math.random() - 0.5) * scale * 0.5,
          y: cy - (2 * scale) + gy * scale + (Math.random() - 0.5) * scale * 0.5,
        });
      }
    }
    offsetX += charWidths[ci] * scale;
  }
  return pts;
}

const InteractiveParticleSphere = ({ size = 280 }: { size?: number }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);
  const mouseRef = useRef({
    x: 0, y: 0,
    active: false, pressing: false,
    hoverTime: 0, releaseTime: 0,
    dragAngleX: 0, dragAngleY: 0,
    lastX: 0, lastY: 0,
  });
  const timeRef = useRef(0);
  const isMobile = typeof window !== "undefined" && window.innerWidth < 640;

  const GOLD = "hsla(38,55%,58%,";
  const VIOLET = "hsla(265,70%,65%,";
  const CYAN = "hsla(185,60%,55%,";
  const GREEN = "hsla(160,55%,48%,";

  const textPoints = useMemo(
    () => generateTextPoints("EMPIRE IA", size / 2, size * 0.42, size * 0.052),
    [size]
  );
  const subTextPoints = useMemo(
    () => generateTextPoints("GROUP", size / 2, size * 0.62, size * 0.04),
    [size]
  );
  const allTextPoints = useMemo(
    () => [...textPoints, ...subTextPoints],
    [textPoints, subTextPoints]
  );

  // DNA ring particles for the splash-style rotating helix
  const HELIX_STRANDS = 3;
  const HELIX_SEGMENTS = isMobile ? 60 : 100;
  const HELIX_FREQ = 8;
  const ORBIT_RADIUS = size * 0.34;
  const HELIX_AMP = size * 0.035;
  const RUNG_COUNT = isMobile ? 14 : 24;
  const ORBIT_DOTS = isMobile ? 20 : 36;
  const NEURAL_INNER = isMobile ? 8 : 14;
  const SCAN_ARCS = 3;

  // Neural pulse travelers
  interface NeuralPulse {
    angle: number; speed: number; radius: number; color: string; size: number;
  }
  const pulsesRef = useRef<NeuralPulse[]>([]);

  useEffect(() => {
    const pulses: NeuralPulse[] = [];
    const count = isMobile ? 12 : 24;
    for (let i = 0; i < count; i++) {
      pulses.push({
        angle: Math.random() * Math.PI * 2,
        speed: 0.008 + Math.random() * 0.015,
        radius: ORBIT_RADIUS * (0.6 + Math.random() * 0.5),
        color: i % 3 === 0 ? GOLD : i % 3 === 1 ? VIOLET : CYAN,
        size: 1 + Math.random() * 1.5,
      });
    }
    pulsesRef.current = pulses;
  }, [size, isMobile]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const cx = size / 2;
    const cy = size / 2;

    // Morph target particles (scatter from text points)
    const morphParticles = allTextPoints.map((tp, i) => ({
      x: tp.x, y: tp.y,
      color: i % 4 === 0 ? GOLD : i % 4 === 1 ? VIOLET : i % 4 === 2 ? CYAN : GREEN,
      size: 0.5 + Math.random() * 1.2,
    }));

    const animate = () => {
      timeRef.current += 1;
      const t = timeRef.current;
      const elapsed = t * 0.016;
      ctx.clearRect(0, 0, size, size);

      const mouse = mouseRef.current;
      const pulses = pulsesRef.current;

      // Morph logic
      if (mouse.active) {
        mouse.hoverTime = Math.min(mouse.hoverTime + 0.018, 1);
        mouse.releaseTime = 0;
      } else {
        mouse.releaseTime += 1;
        if (mouse.releaseTime > 120) {
          mouse.hoverTime = Math.max(mouse.hoverTime - 0.008, 0);
        }
      }
      const mf = mouse.hoverTime;
      const morphFactor = mf * mf * (3 - 2 * mf);
      const dnaFade = 1 - morphFactor;

      // Drag damping
      if (!mouse.pressing) {
        mouse.dragAngleX *= 0.97;
        mouse.dragAngleY *= 0.97;
      }
      const rotSpeed = elapsed * 0.6 + mouse.dragAngleX;

      // ═══ Background radial glow ═══
      const bgGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, ORBIT_RADIUS * 1.8);
      bgGlow.addColorStop(0, `hsla(265,60%,55%,${0.04 + morphFactor * 0.08})`);
      bgGlow.addColorStop(0.3, `hsla(38,50%,55%,${0.02 + morphFactor * 0.04})`);
      bgGlow.addColorStop(1, "transparent");
      ctx.fillStyle = bgGlow;
      ctx.fillRect(0, 0, size, size);

      // ═══ DNA TRIPLE HELIX RING (splash-style) ═══
      if (dnaFade > 0.01) {
        ctx.save();
        ctx.globalAlpha = dnaFade;

        const colors = [
          { h: 265, s: 75, l: 62 },  // violet
          { h: 38, s: 50, l: 55 },   // gold
          { h: 160, s: 55, l: 48 },  // green
        ];

        // Triple helix strands
        for (let s = 0; s < HELIX_STRANDS; s++) {
          const phaseOffset = (s / HELIX_STRANDS) * Math.PI * 2;
          const c = colors[s];
          const hslStr = `hsla(${c.h},${c.s}%,${c.l}%,`;

          // Main strand
          ctx.beginPath();
          for (let i = 0; i <= HELIX_SEGMENTS; i++) {
            const frac = i / HELIX_SEGMENTS;
            const baseAngle = frac * Math.PI * 2 + rotSpeed * (0.5 + s * 0.1);
            const waveOffset = Math.sin(frac * Math.PI * 2 * HELIX_FREQ + phaseOffset + elapsed * 2.5) * HELIX_AMP;
            const r = ORBIT_RADIUS + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hslStr + (0.45 * dnaFade).toFixed(3) + ")";
          ctx.lineWidth = 1.5;
          ctx.stroke();

          // Glow layer
          ctx.beginPath();
          for (let i = 0; i <= HELIX_SEGMENTS; i++) {
            const frac = i / HELIX_SEGMENTS;
            const baseAngle = frac * Math.PI * 2 + rotSpeed * (0.5 + s * 0.1);
            const waveOffset = Math.sin(frac * Math.PI * 2 * HELIX_FREQ + phaseOffset + elapsed * 2.5) * HELIX_AMP;
            const r = ORBIT_RADIUS + waveOffset;
            const px = cx + Math.cos(baseAngle) * r;
            const py = cy + Math.sin(baseAngle) * r;
            if (i === 0) ctx.moveTo(px, py);
            else ctx.lineTo(px, py);
          }
          ctx.strokeStyle = hslStr + (0.08 * dnaFade).toFixed(3) + ")";
          ctx.lineWidth = 6;
          ctx.stroke();
        }

        // Cross-links (base pairs / rungs)
        for (let i = 0; i < RUNG_COUNT; i++) {
          const frac = i / RUNG_COUNT;
          const baseAngle = frac * Math.PI * 2 + rotSpeed * 0.5;
          const w1 = Math.sin(frac * Math.PI * 2 * HELIX_FREQ + elapsed * 2.5) * HELIX_AMP;
          const w2 = Math.sin(frac * Math.PI * 2 * HELIX_FREQ + (2 / 3) * Math.PI * 2 + elapsed * 2.5) * HELIX_AMP;
          const r1 = ORBIT_RADIUS + w1;
          const r2 = ORBIT_RADIUS + w2;
          const px1 = cx + Math.cos(baseAngle) * r1;
          const py1 = cy + Math.sin(baseAngle) * r1;
          const px2 = cx + Math.cos(baseAngle) * r2;
          const py2 = cy + Math.sin(baseAngle) * r2;

          const rungAlpha = 0.12 * dnaFade * (0.5 + 0.5 * Math.sin(frac * Math.PI * 4 + elapsed));
          ctx.strokeStyle = `hsla(38,50%,55%,${rungAlpha.toFixed(3)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(px1, py1);
          ctx.lineTo(px2, py2);
          ctx.stroke();
        }

        // Data nodes on the ring
        for (let i = 0; i < ORBIT_DOTS; i++) {
          const angle = (i / ORBIT_DOTS) * Math.PI * 2;
          const speed = 0.6 + (i % 5) * 0.1;
          const a = angle + rotSpeed * speed;
          const strandIdx = Math.floor(angle / (Math.PI * 2 / 3)) % 3;
          const phaseOff = (strandIdx / 3) * Math.PI * 2;
          const waveOff = Math.sin(angle * HELIX_FREQ + phaseOff + elapsed * 2.5) * HELIX_AMP;
          const r = ORBIT_RADIUS + waveOff;
          const px = cx + Math.cos(a) * r;
          const py = cy + Math.sin(a) * r;
          const c = colors[i % 3];
          const pulse = 0.7 + 0.3 * Math.sin(elapsed * 3 + angle * 3);
          const dotSize = (1.5 + (i % 3) * 0.8) * pulse;

          // Glow
          const glowR = dotSize * 3.5;
          const glowGrad = ctx.createRadialGradient(px, py, 0, px, py, glowR);
          glowGrad.addColorStop(0, `hsla(${c.h},${c.s}%,${c.l}%,${(0.35 * dnaFade * pulse).toFixed(3)})`);
          glowGrad.addColorStop(0.5, `hsla(${c.h},${c.s}%,${c.l}%,${(0.08 * dnaFade).toFixed(3)})`);
          glowGrad.addColorStop(1, `hsla(${c.h},${c.s}%,${c.l}%,0)`);
          ctx.beginPath();
          ctx.arc(px, py, glowR, 0, Math.PI * 2);
          ctx.fillStyle = glowGrad;
          ctx.fill();

          // Core dot
          ctx.beginPath();
          ctx.arc(px, py, dotSize * 0.7, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${c.h},${c.s}%,${c.l}%,${(0.9 * dnaFade).toFixed(2)})`;
          ctx.fill();
        }

        // Rotating scan arcs
        for (let i = 0; i < SCAN_ARCS; i++) {
          const arcAngle = elapsed * (0.8 + i * 0.2) + (i * Math.PI * 2) / 3;
          const arcLen = Math.PI * 0.25;
          const arcR = ORBIT_RADIUS * (0.93 + i * 0.04);
          const c = colors[i];

          // Fading arc
          ctx.beginPath();
          ctx.arc(cx, cy, arcR, arcAngle - arcLen, arcAngle + arcLen);
          ctx.strokeStyle = `hsla(${c.h},${c.s}%,${c.l}%,${(0.18 * dnaFade).toFixed(3)})`;
          ctx.lineWidth = 2;
          ctx.stroke();

          // Bright head
          const headX = cx + Math.cos(arcAngle + arcLen) * arcR;
          const headY = cy + Math.sin(arcAngle + arcLen) * arcR;
          const headGrad = ctx.createRadialGradient(headX, headY, 0, headX, headY, 6);
          headGrad.addColorStop(0, `hsla(${c.h},${c.s}%,${c.l}%,${(0.5 * dnaFade).toFixed(2)})`);
          headGrad.addColorStop(1, `hsla(${c.h},${c.s}%,${c.l}%,0)`);
          ctx.beginPath();
          ctx.arc(headX, headY, 6, 0, Math.PI * 2);
          ctx.fillStyle = headGrad;
          ctx.fill();
        }

        // Inner neural network — communicating nodes
        const neuralPositions: { x: number; y: number }[] = [];
        for (let i = 0; i < NEURAL_INNER; i++) {
          const na = (i / NEURAL_INNER) * Math.PI * 2 + elapsed * 0.25;
          const nr = ORBIT_RADIUS * 0.5 * (0.3 + 0.7 * Math.abs(Math.sin(na * 2 + elapsed * 0.7)));
          const nx = cx + Math.cos(na) * nr;
          const ny = cy + Math.sin(na) * nr;
          neuralPositions.push({ x: nx, y: ny });

          // Node
          const c = colors[i % 3];
          ctx.beginPath();
          ctx.arc(nx, ny, 2, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(${c.h},${c.s}%,${c.l}%,${(0.7 * dnaFade).toFixed(2)})`;
          ctx.fill();

          // Glow
          const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, 8);
          ng.addColorStop(0, `hsla(${c.h},${c.s}%,${c.l}%,${(0.2 * dnaFade).toFixed(3)})`);
          ng.addColorStop(1, `hsla(${c.h},${c.s}%,${c.l}%,0)`);
          ctx.beginPath();
          ctx.arc(nx, ny, 8, 0, Math.PI * 2);
          ctx.fillStyle = ng;
          ctx.fill();
        }

        // Neural connections (curved bezier)
        ctx.lineWidth = 0.4;
        for (let i = 0; i < neuralPositions.length; i++) {
          const next = neuralPositions[(i + 1) % neuralPositions.length];
          const cur = neuralPositions[i];
          const dist = Math.hypot(cur.x - next.x, cur.y - next.y);
          if (dist < ORBIT_RADIUS) {
            const wave = (Math.sin(elapsed * 2 + i * 1.5) + 1) * 0.5;
            const a = 0.12 * dnaFade * (0.4 + wave * 0.6);
            ctx.strokeStyle = `hsla(185,60%,55%,${a.toFixed(3)})`;
            const midX = (cur.x + next.x) / 2 + (cur.y - next.y) * 0.2;
            const midY = (cur.y + next.y) / 2 + (next.x - cur.x) * 0.2;
            ctx.beginPath();
            ctx.moveTo(cur.x, cur.y);
            ctx.quadraticCurveTo(midX, midY, next.x, next.y);
            ctx.stroke();
          }
          // Also connect to center
          const cDist = Math.hypot(cur.x - cx, cur.y - cy);
          if (cDist > 10) {
            const a = 0.05 * dnaFade * (0.5 + Math.sin(elapsed + i) * 0.5);
            ctx.strokeStyle = `hsla(265,70%,65%,${a.toFixed(3)})`;
            ctx.beginPath();
            ctx.moveTo(cur.x, cur.y);
            ctx.lineTo(cx, cy);
            ctx.stroke();
          }
        }

        // Traveling pulses along the ring
        for (const p of pulses) {
          p.angle += p.speed;
          const px = cx + Math.cos(p.angle) * p.radius;
          const py = cy + Math.sin(p.angle) * p.radius;
          const pa = 0.6 * dnaFade;

          // Trail
          const trailAngle = p.angle - p.speed * 8;
          const tx = cx + Math.cos(trailAngle) * p.radius;
          const ty = cy + Math.sin(trailAngle) * p.radius;
          ctx.strokeStyle = p.color + (pa * 0.2).toFixed(3) + ")";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(tx, ty);
          ctx.lineTo(px, py);
          ctx.stroke();

          // Pulse dot
          ctx.beginPath();
          ctx.arc(px, py, p.size, 0, Math.PI * 2);
          ctx.fillStyle = p.color + pa.toFixed(2) + ")";
          ctx.fill();

          // Glow
          const pg = ctx.createRadialGradient(px, py, 0, px, py, p.size * 4);
          pg.addColorStop(0, p.color + (pa * 0.3).toFixed(3) + ")");
          pg.addColorStop(1, p.color + "0)");
          ctx.beginPath();
          ctx.arc(px, py, p.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = pg;
          ctx.fill();
        }

        // Central intelligence core
        const corePulse = 1 + Math.sin(elapsed * 1.8) * 0.08;
        const coreGrad = ctx.createRadialGradient(cx, cy, 0, cx, cy, ORBIT_RADIUS * 0.25 * corePulse);
        coreGrad.addColorStop(0, `hsla(265,75%,62%,${(0.25 * dnaFade).toFixed(3)})`);
        coreGrad.addColorStop(0.4, `hsla(38,50%,55%,${(0.1 * dnaFade).toFixed(3)})`);
        coreGrad.addColorStop(1, "hsla(265,75%,62%,0)");
        ctx.beginPath();
        ctx.arc(cx, cy, ORBIT_RADIUS * 0.25 * corePulse, 0, Math.PI * 2);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        // Core concentric rings
        const ringColors = [
          { h: 265, s: 75, l: 62 },
          { h: 38, s: 50, l: 55 },
          { h: 160, s: 55, l: 48 },
        ];
        for (let i = 0; i < 3; i++) {
          const rr = ORBIT_RADIUS * (0.12 + i * 0.06) * corePulse;
          const rc = ringColors[i];
          ctx.beginPath();
          ctx.arc(cx, cy, rr, 0, Math.PI * 2);
          ctx.strokeStyle = `hsla(${rc.h},${rc.s}%,${rc.l}%,${(0.25 * dnaFade * (1 - i * 0.2)).toFixed(3)})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }

        ctx.restore();
      }

      // ═══ MORPH STATE: Text particles ═══
      if (morphFactor > 0.01) {
        ctx.save();
        ctx.globalAlpha = morphFactor;

        for (const mp of morphParticles) {
          ctx.beginPath();
          ctx.arc(mp.x, mp.y, mp.size, 0, Math.PI * 2);
          ctx.fillStyle = mp.color + "0.8)";
          ctx.fill();
        }

        // Text overlay
        if (morphFactor > 0.3) {
          const labelAlpha = Math.min((morphFactor - 0.3) / 0.4, 1);

          const textGlow = ctx.createRadialGradient(cx, cy, 0, cx, cy, size * 0.4);
          textGlow.addColorStop(0, `hsla(265,70%,55%,${labelAlpha * 0.15})`);
          textGlow.addColorStop(0.5, `hsla(38,55%,55%,${labelAlpha * 0.08})`);
          textGlow.addColorStop(1, "transparent");
          ctx.fillStyle = textGlow;
          ctx.fillRect(0, 0, size, size);

          const mainSize = Math.round(size * 0.085);
          ctx.font = `900 ${mainSize}px 'Inter', system-ui, sans-serif`;
          ctx.textAlign = "center";

          ctx.globalAlpha = labelAlpha * 0.3;
          ctx.fillStyle = `hsla(265,70%,65%,1)`;
          ctx.filter = `blur(${size * 0.02}px)`;
          ctx.fillText("EMPIRE IA", cx, cy - size * 0.02);
          ctx.filter = "none";

          ctx.globalAlpha = labelAlpha * 0.9;
          ctx.fillStyle = `hsla(38,55%,72%,1)`;
          ctx.fillText("EMPIRE IA", cx, cy - size * 0.02);

          const subSize = Math.round(size * 0.04);
          ctx.font = `600 ${subSize}px 'Inter', system-ui, sans-serif`;

          ctx.globalAlpha = labelAlpha * 0.65;
          ctx.fillStyle = `hsla(38,45%,65%,0.9)`;
          ctx.fillText("G R O U P", cx, cy + size * 0.06);

          // Accent lines & diamond
          ctx.globalAlpha = labelAlpha * 0.3;
          ctx.strokeStyle = `hsla(38,50%,55%,0.5)`;
          ctx.lineWidth = 0.5;
          const lineW = size * 0.25;
          ctx.beginPath();
          ctx.moveTo(cx - lineW, cy + size * 0.1);
          ctx.lineTo(cx - size * 0.04, cy + size * 0.1);
          ctx.stroke();
          ctx.beginPath();
          ctx.moveTo(cx + size * 0.04, cy + size * 0.1);
          ctx.lineTo(cx + lineW, cy + size * 0.1);
          ctx.stroke();
          ctx.fillStyle = `hsla(38,55%,60%,${labelAlpha * 0.5})`;
          ctx.beginPath();
          ctx.moveTo(cx, cy + size * 0.1 - 2);
          ctx.lineTo(cx + 2, cy + size * 0.1);
          ctx.lineTo(cx, cy + size * 0.1 + 2);
          ctx.lineTo(cx - 2, cy + size * 0.1);
          ctx.closePath();
          ctx.fill();

          const tagSize = Math.round(size * 0.022);
          ctx.font = `500 ${tagSize}px 'Inter', system-ui, sans-serif`;
          ctx.globalAlpha = labelAlpha * 0.4;
          ctx.fillStyle = `hsla(265,40%,70%,0.7)`;
          ctx.fillText("AI-POWERED BUSINESS PLATFORM", cx, cy + size * 0.16);
        }

        ctx.restore();
      }

      // Scanning beam
      const scanY = (Math.sin(elapsed * 0.3) * 0.5 + 0.5) * size;
      ctx.fillStyle = `hsla(38,50%,55%,${0.015 + morphFactor * 0.03})`;
      ctx.fillRect(0, scanY - 1, size, 2);

      animRef.current = requestAnimationFrame(animate);
    };

    animRef.current = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animRef.current);
  }, [size, isMobile, allTextPoints]);

  const handlePointerMove = useCallback((e: React.PointerEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const mouse = mouseRef.current;
    if (mouse.pressing) {
      mouse.dragAngleX += (mx - mouse.lastX) * 0.008;
      mouse.dragAngleY += (my - mouse.lastY) * 0.005;
    }
    mouse.x = mx; mouse.y = my;
    mouse.lastX = mx; mouse.lastY = my;
    mouse.active = true;
  }, []);

  const handlePointerLeave = useCallback(() => {
    mouseRef.current.active = false;
    mouseRef.current.pressing = false;
    mouseRef.current.releaseTime = 0;
  }, []);

  return (
    <canvas
      ref={canvasRef}
      width={size}
      height={size}
      className="touch-none cursor-grab active:cursor-grabbing"
      style={{ width: size, height: size }}
      onPointerMove={handlePointerMove}
      onPointerEnter={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.x = e.clientX - rect.left;
          mouseRef.current.y = e.clientY - rect.top;
        }
        mouseRef.current.active = true;
        mouseRef.current.releaseTime = 0;
      }}
      onPointerDown={(e) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
          mouseRef.current.lastX = e.clientX - rect.left;
          mouseRef.current.lastY = e.clientY - rect.top;
        }
        mouseRef.current.pressing = true;
      }}
      onPointerUp={() => { mouseRef.current.pressing = false; }}
      onPointerLeave={handlePointerLeave}
    />
  );
};

export default InteractiveParticleSphere;
