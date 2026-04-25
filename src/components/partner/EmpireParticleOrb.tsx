import { useEffect, useRef, useState, memo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Bot, Zap, Target, TrendingUp, Rocket } from "lucide-react";

/**
 * Empire Particle Orb — fully interactive WOW element.
 *
 * • Trasparente: nessuno sfondo proprio, si fonde con la home page.
 * • Interattivo: drag per spostare l'orb, swipe per ruotarlo,
 *   click per morphare in costellazione, particelle reagiscono al puntatore.
 * • Pointer events passano attraverso le aree vuote (pointer-events: none sul wrap),
 *   solo l'area dell'orb cattura input.
 */

type Mode = "orb" | "constellation";

interface Particle {
  hx: number; hy: number;
  x: number; y: number;
  vx: number; vy: number;
  r: number; hue: number; alpha: number;
  // 3D coords for rotation
  sx: number; sy: number; sz: number;
}

interface Shockwave {
  x: number; y: number;
  r: number; maxR: number;
  alpha: number; hue: number;
}

interface Spark {
  x: number; y: number;
  vx: number; vy: number;
  life: number; maxLife: number;
  hue: number; size: number;
}

interface Star {
  x: number; y: number;
  r: number; baseAlpha: number;
  twinkle: number;
}

const FEATURES = [
  { icon: Bot, label: "AI Agents", angle: -90 },
  { icon: Target, label: "Lead Engine", angle: -30 },
  { icon: Rocket, label: "Demo Factory", angle: 30 },
  { icon: TrendingUp, label: "Earnings", angle: 90 },
  { icon: Zap, label: "Automations", angle: 150 },
  { icon: Sparkles, label: "Brand Studio", angle: 210 },
];

const EmpireParticleOrb = memo(() => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const shockwavesRef = useRef<Shockwave[]>([]);
  const sparksRef = useRef<Spark[]>([]);
  const starsRef = useRef<Star[]>([]);
  const energyRef = useRef(0); // 0→1, sale durante interazione
  const pointerRef = useRef({ x: -9999, y: -9999, active: false, inside: false });
  const modeRef = useRef<Mode>("orb");
  const morphRef = useRef(0);
  // Orb position offset (drag), rotation, and scale (pinch)
  const offsetRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  const rotRef = useRef({ x: 0, y: 0, vx: 0, vy: 0 });
  // Scroll-driven rotation target: vx/vy puntano allo "spin desiderato",
  // rotRef.vx/vy ci si avvicinano via lerp → fluido, senza scatti.
  const scrollTargetRef = useRef({ vx: 0, vy: 0 });
  const scaleRef = useRef(1);
  const dragRef = useRef({
    active: false,
    moved: false,
    mode: null as null | "drag" | "rotate",
    lastX: 0, lastY: 0,
    startX: 0, startY: 0,
    startTime: 0,
  });
  // Multi-touch gesture state (mobile pinch + rotate)
  const gestureRef = useRef({
    active: false,
    startDist: 0,
    startAngle: 0,
    startScale: 1,
    startRotZ: 0,
  });
  // Tracked active pointers for multi-touch
  const pointersRef = useRef<Map<number, { x: number; y: number }>>(new Map());
  const [mode, setMode] = useState<Mode>("orb");
  const [hint, setHint] = useState(true);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let w = 0, h = 0, cx = 0, cy = 0, radius = 0;
    let raf = 0;
    let t = 0;

    const isMobile = window.innerWidth < 640;
    const COUNT = isMobile ? 280 : 520;

    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      w = rect.width; h = rect.height;
      cx = w / 2; cy = h / 2;
      radius = Math.min(w, h) * 0.32;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.max(1, Math.floor(w * dpr));
      canvas.height = Math.max(1, Math.floor(h * dpr));
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);
    };

    // Init particles on a true 3D sphere (for rotation)
    const init = () => {
      const arr: Particle[] = [];
      for (let i = 0; i < COUNT; i++) {
        const phi = Math.acos(1 - (2 * (i + 0.5)) / COUNT);
        const theta = Math.PI * (1 + Math.sqrt(5)) * i;
        const sx = Math.sin(phi) * Math.cos(theta);
        const sy = Math.sin(phi) * Math.sin(theta);
        const sz = Math.cos(phi);
        arr.push({
          hx: 0.5 + sx * 0.42,
          hy: 0.5 + sy * 0.42,
          x: 0, y: 0,
          vx: 0, vy: 0,
          r: 1,
          hue: 260 + Math.random() * 30,
          alpha: 0.5,
          sx, sy, sz,
        });
      }
      particlesRef.current = arr;
    };

    // Init background "stars" — micro punti luminosi che riempiono il vuoto
    const initStars = () => {
      const stars: Star[] = [];
      const STAR_COUNT = isMobile ? 60 : 110;
      for (let i = 0; i < STAR_COUNT; i++) {
        stars.push({
          x: Math.random(), // normalizzato 0-1
          y: Math.random(),
          r: 0.4 + Math.random() * 1.2,
          baseAlpha: 0.15 + Math.random() * 0.45,
          twinkle: Math.random() * Math.PI * 2,
        });
      }
      starsRef.current = stars;
    };

    // Spawn shockwave (onda d'urto al click/tap dentro l'orb)
    const spawnShockwave = (x: number, y: number, hue = 280) => {
      shockwavesRef.current.push({
        x, y, r: 4, maxR: radius * 2.2,
        alpha: 0.7, hue,
      });
      // Mini supernova: spruzza scintille radiali
      const SPARK_COUNT = isMobile ? 18 : 28;
      for (let i = 0; i < SPARK_COUNT; i++) {
        const ang = (Math.PI * 2 * i) / SPARK_COUNT + Math.random() * 0.3;
        const speed = 2.5 + Math.random() * 4.5;
        sparksRef.current.push({
          x, y,
          vx: Math.cos(ang) * speed,
          vy: Math.sin(ang) * speed,
          life: 0,
          maxLife: 40 + Math.random() * 30,
          hue: 260 + Math.random() * 50,
          size: 1 + Math.random() * 1.8,
        });
      }
      energyRef.current = Math.min(1, energyRef.current + 0.6);
    };

    init();
    initStars();
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ─── Pointer tracking (window-level for proper hit-testing) ───
    const isInsideOrb = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      const px = clientX - rect.left - cx - offsetRef.current.x;
      const py = clientY - rect.top - cy - offsetRef.current.y;
      return Math.hypot(px, py) < radius * 1.4;
    };

    const handlePointerMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointerRef.current.x = e.clientX - rect.left;
      pointerRef.current.y = e.clientY - rect.top;
      pointerRef.current.active = true;
      const inside = isInsideOrb(e.clientX, e.clientY);
      pointerRef.current.inside = inside;

      // Toggle canvas pointer-events so the background underneath stays interactive
      // when the cursor/finger is OUTSIDE the orb hit-area. Keep events captured while dragging.
      // touchAction: solo dentro l'orb blocchiamo lo scroll nativo. Fuori → "pan-y"
      // così l'utente può scorrere la pagina anche col dito sopra il canvas.
      if (!dragRef.current.active && !gestureRef.current.active) {
        canvas.style.pointerEvents = inside ? "auto" : "none";
        canvas.style.cursor = inside ? "grab" : "default";
        canvas.style.touchAction = inside ? "none" : "pan-y";
      }

      // Update tracked pointer position
      if (pointersRef.current.has(e.pointerId)) {
        pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      }

      // ─── Multi-touch gesture (2 fingers): pinch (scale) + twist (rotate Z) ───
      if (gestureRef.current.active && pointersRef.current.size >= 2) {
        const pts = Array.from(pointersRef.current.values()).slice(0, 2);
        const dx = pts[1].x - pts[0].x;
        const dy = pts[1].y - pts[0].y;
        const dist = Math.hypot(dx, dy);
        const ang = Math.atan2(dy, dx);

        const g = gestureRef.current;
        // Pinch → scale (clamped 0.6–1.8)
        const newScale = Math.max(0.6, Math.min(1.8, g.startScale * (dist / Math.max(1, g.startDist))));
        scaleRef.current = newScale;
        // Twist → spin Y axis (in-plane rotation feels like spinning the sphere)
        const angDelta = ang - g.startAngle;
        rotRef.current.y = g.startRotZ + angDelta;
        rotRef.current.vy = 0; // hold steady while gesturing

        e.preventDefault();
        return;
      }

      // ─── Single-pointer drag/rotate ───
      const drag = dragRef.current;
      if (drag.active && pointersRef.current.size === 1) {
        const dx = e.clientX - drag.lastX;
        const dy = e.clientY - drag.lastY;
        drag.lastX = e.clientX;
        drag.lastY = e.clientY;

        const totalDx = e.clientX - drag.startX;
        const totalDy = e.clientY - drag.startY;
        const totalDist = Math.hypot(totalDx, totalDy);
        if (!drag.mode && totalDist > 6) {
          drag.moved = true;
          // Touch device: swipe = rotate (more natural). Mouse: shift = rotate, default = drag.
          const isTouch = e.pointerType === "touch" || e.pointerType === "pen";
          drag.mode = isTouch ? "rotate" : (e.shiftKey ? "rotate" : "drag");
        }

        if (drag.mode === "drag") {
          // 1:1 follow finger/mouse + build throw velocity
          offsetRef.current.x += dx;
          offsetRef.current.y += dy;
          offsetRef.current.vx = dx;
          offsetRef.current.vy = dy;
        } else if (drag.mode === "rotate") {
          // Direct rotation for snappy 1:1 response
          rotRef.current.y += dx * 0.012;
          rotRef.current.x -= dy * 0.012;
          rotRef.current.vy = dx * 0.004;
          rotRef.current.vx = -dy * 0.004;
        }
        e.preventDefault();
      }
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (!isInsideOrb(e.clientX, e.clientY)) return;
      canvas.style.cursor = "grabbing";
      // Mentre interagiamo con l'orb blocchiamo lo scroll nativo per permettere drag/rotate.
      canvas.style.touchAction = "none";
      pointersRef.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
      // Mini ripple sul touch-down (più sottile del tap)
      const rect = canvas.getBoundingClientRect();
      shockwavesRef.current.push({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        r: 2, maxR: radius * 1.1,
        alpha: 0.45, hue: 270,
      });
      energyRef.current = Math.min(1, energyRef.current + 0.25);

      // Two pointers down → start pinch/twist gesture
      if (pointersRef.current.size === 2) {
        const pts = Array.from(pointersRef.current.values()).slice(0, 2);
        const dx = pts[1].x - pts[0].x;
        const dy = pts[1].y - pts[0].y;
        gestureRef.current = {
          active: true,
          startDist: Math.hypot(dx, dy) || 1,
          startAngle: Math.atan2(dy, dx),
          startScale: scaleRef.current,
          startRotZ: rotRef.current.y,
        };
        // Cancel single-finger drag while gesturing
        dragRef.current.active = false;
        dragRef.current.moved = true; // prevent tap toggle on release
        return;
      }

      // Single pointer → drag/tap
      dragRef.current = {
        active: true,
        moved: false,
        mode: null,
        lastX: e.clientX,
        lastY: e.clientY,
        startX: e.clientX,
        startY: e.clientY,
        startTime: performance.now(),
      };
      try { (e.target as Element)?.setPointerCapture?.(e.pointerId); } catch {}
    };

    const endPointer = (e: PointerEvent, cancelled: boolean) => {
      pointersRef.current.delete(e.pointerId);

      // ─── Multi-touch transition: 2 → 1 finger ───
      // When one finger lifts during a pinch/twist, hand off cleanly to single-finger drag
      // using the REMAINING pointer instead of leaving the orb in a stale gesture state.
      if (gestureRef.current.active && pointersRef.current.size < 2) {
        gestureRef.current.active = false;
        rotRef.current.vy = 0;

        if (pointersRef.current.size === 1 && !cancelled) {
          const [remaining] = Array.from(pointersRef.current.values());
          dragRef.current = {
            active: true,
            moved: true, // never treat as tap after a multi-touch gesture
            mode: null,
            lastX: remaining.x,
            lastY: remaining.y,
            startX: remaining.x,
            startY: remaining.y,
            startTime: performance.now(),
          };
          canvas.style.cursor = "grabbing";
          canvas.style.pointerEvents = "auto";
        }
      }

      const drag = dragRef.current;
      const wasActive = drag.active;
      const moved = drag.moved;
      const dt = performance.now() - drag.startTime;

      // On cancel, never register taps and force-release drag
      if (cancelled) {
        drag.active = false;
        drag.mode = null;
        canvas.style.cursor = "default";
        if (pointersRef.current.size === 0) canvas.style.pointerEvents = "none";
        return;
      }

      // Only release single-finger drag when the LAST pointer goes up
      if (pointersRef.current.size === 0) {
        drag.active = false;
        drag.mode = null;
      }

      // Restore cursor + pointer-events based on whether we're still over the orb
      const stillInside = isInsideOrb(e.clientX, e.clientY);
      canvas.style.cursor = pointersRef.current.size > 0 ? "grabbing" : (stillInside ? "grab" : "default");
      if (pointersRef.current.size === 0) {
        canvas.style.pointerEvents = stillInside ? "auto" : "none";
        canvas.style.touchAction = stillInside ? "none" : "pan-y";
      }

      // Tap (no significant move) inside orb → toggle mode + shockwave
      if (
        wasActive &&
        !moved &&
        dt < 400 &&
        pointersRef.current.size === 0 &&
        isInsideOrb(e.clientX, e.clientY)
      ) {
        const next: Mode = modeRef.current === "orb" ? "constellation" : "orb";
        modeRef.current = next;
        setMode(next);
        setHint(false);
        // Onda d'urto + supernova nel punto del tap
        const rect = canvas.getBoundingClientRect();
        const tapX = e.clientX - rect.left;
        const tapY = e.clientY - rect.top;
        spawnShockwave(tapX, tapY, next === "constellation" ? 285 : 200);
      }
    };

    const handlePointerUp = (e: PointerEvent) => endPointer(e, false);
    const handlePointerCancel = (e: PointerEvent) => endPointer(e, true);

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
      pointerRef.current.inside = false;
      pointerRef.current.x = -9999;
      pointerRef.current.y = -9999;
    };

    // Block native gestures (pinch-zoom on iOS Safari) while interacting with the orb
    const handleTouchPrevent = (e: TouchEvent) => {
      if (e.touches.length >= 2 || gestureRef.current.active || dragRef.current.active) {
        e.preventDefault();
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: false });
    window.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("pointerup", handlePointerUp);
    window.addEventListener("pointercancel", handlePointerCancel);
    canvas.addEventListener("pointerleave", handlePointerLeave);
    canvas.addEventListener("touchmove", handleTouchPrevent, { passive: false });
    canvas.addEventListener("gesturestart", (e) => e.preventDefault() as never);
    canvas.addEventListener("gesturechange", (e) => e.preventDefault() as never);

    // ─── Scroll-driven rotation (smooth, momentum-based, no clicks needed) ───
    // Strategia: lo scroll alimenta una "velocità target". Il loop interpola
    // (lerp) la velocità reale verso il target, e il target decade lentamente
    // a 0 quando lo scroll si ferma. Questo elimina scatti e accelerazioni
    // improvvise tipiche del legare direttamente vx al delta di scroll.
    let lastScrollY = window.scrollY;
    let lastScrollTime = performance.now();
    const SCROLL_TARGET_GAIN = 0.00045;   // quanta rotazione per pixel di scroll
    const SCROLL_TARGET_MAX = 0.045;      // tetto massimo della velocità target
    const handleScroll = () => {
      const now = performance.now();
      const y = window.scrollY;
      const dy = y - lastScrollY;
      const dt = Math.max(16, now - lastScrollTime); // ms
      lastScrollY = y;
      lastScrollTime = now;
      if (dragRef.current.active || gestureRef.current.active) return;
      // Velocità in px/ms → moltiplicata per gain dà rotazione "target"
      const vy = (dy / dt) * 16; // normalizza a ~1 frame
      // Asse X: scroll verticale fa "rollare" la sfera (più naturale)
      const tx = Math.max(-SCROLL_TARGET_MAX, Math.min(SCROLL_TARGET_MAX, vy * SCROLL_TARGET_GAIN * 16));
      // Spinta laterale leggera per parallasse (1/3 dell'asse X)
      const ty = tx * 0.33;
      // Additivo ma clampato — lo scroll continuo non esplode
      scrollTargetRef.current.vx = Math.max(-SCROLL_TARGET_MAX, Math.min(SCROLL_TARGET_MAX, tx));
      scrollTargetRef.current.vy = Math.max(-SCROLL_TARGET_MAX, Math.min(SCROLL_TARGET_MAX, ty));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // ─── Animate ───
    const draw = () => {
      t += 0.008;
      ctx.clearRect(0, 0, w, h);

      const targetMorph = modeRef.current === "constellation" ? 1 : 0;
      morphRef.current += (targetMorph - morphRef.current) * 0.06;
      const m = morphRef.current;

      // ─── Rotazione fluida (no-click): auto-spin costante + lerp verso target scroll ───
      // Il target di scroll decade lentamente quando l'utente smette di scrollare,
      // così il rallentamento è naturale (ease-out), senza jerk.
      if (!dragRef.current.active && !gestureRef.current.active) {
        const AUTO_SPIN_Y = 0.0035;     // rotazione idle costante (sempre attiva)
        const AUTO_SPIN_X = 0.0008;     // micro-tilt verticale per dare vita
        const SCROLL_LERP = 0.08;       // smussa transizione verso il target (più basso = più morbido)
        const TARGET_DECAY = 0.92;      // quanto velocemente il target si azzera dopo lo scroll

        // Velocità desiderata = auto-spin + contributo scroll
        const desiredVx = AUTO_SPIN_X + scrollTargetRef.current.vx;
        const desiredVy = AUTO_SPIN_Y + scrollTargetRef.current.vy;

        // Lerp morbido (smorzamento esponenziale) → niente scatti
        rotRef.current.vx += (desiredVx - rotRef.current.vx) * SCROLL_LERP;
        rotRef.current.vy += (desiredVy - rotRef.current.vy) * SCROLL_LERP;

        // Il target di scroll decade quando lo scroll si ferma
        scrollTargetRef.current.vx *= TARGET_DECAY;
        scrollTargetRef.current.vy *= TARGET_DECAY;
      }
      rotRef.current.x += rotRef.current.vx;
      rotRef.current.y += rotRef.current.vy;

      // Throw momentum + spring offset back toward 0 when not dragging
      if (!dragRef.current.active && !gestureRef.current.active) {
        // Apply velocity (throw) then decay
        offsetRef.current.x += offsetRef.current.vx;
        offsetRef.current.y += offsetRef.current.vy;
        offsetRef.current.vx *= 0.92;
        offsetRef.current.vy *= 0.92;
        // Elastic pull back to centre
        offsetRef.current.x *= 0.93;
        offsetRef.current.y *= 0.93;
        // Scale eases back to 1 when not pinching
        scaleRef.current += (1 - scaleRef.current) * 0.08;
      } else {
        // Reset throw velocity while actively dragging
        offsetRef.current.vx = 0;
        offsetRef.current.vy = 0;
      }

      const ox = offsetRef.current.x;
      const oy = offsetRef.current.y;
      const scl = scaleRef.current;
      const effRadius = radius * scl;
      const rotX = rotRef.current.x;
      const rotY = rotRef.current.y;
      const cosX = Math.cos(rotX), sinX = Math.sin(rotX);
      const cosY = Math.cos(rotY), sinY = Math.sin(rotY);

      const px = pointerRef.current.x;
      const py = pointerRef.current.y;
      const pointerActive = pointerRef.current.active;

      // Ring radius — wider on desktop for premium feel, tighter on mobile so cards + particles
      // stay inside the orb container and the central label remains readable.
      const ringR = effRadius * (isMobile ? 1.25 : 1.5);
      const arr = particlesRef.current;

      for (let i = 0; i < arr.length; i++) {
        const p = arr[i];

        // Apply 3D rotation to sphere coords
        // Y rotation
        let x1 = p.sx * cosY + p.sz * sinY;
        let z1 = -p.sx * sinY + p.sz * cosY;
        // X rotation
        let y1 = p.sy * cosX - z1 * sinX;
        let z2 = p.sy * sinX + z1 * cosX;

        // Project to 2D (orb mode position) using effective (scaled) radius
        const orbX = cx + ox + x1 * effRadius;
        const orbY = cy + oy + y1 * effRadius;

        // Constellation target (ring around orb centre)
        const nodeIdx = i % FEATURES.length;
        const ringAng = (FEATURES[nodeIdx].angle * Math.PI) / 180 + t * 0.3;
        const jitter = ((i * 1.3) % 30) - 15;
        const ringX = cx + ox + Math.cos(ringAng) * (ringR + jitter * 0.6);
        const ringY = cy + oy + Math.sin(ringAng) * (ringR + jitter * 0.6);

        const tgtX = orbX * (1 - m) + ringX * m;
        const tgtY = orbY * (1 - m) + ringY * m;

        // Spring
        p.vx += (tgtX - p.x) * 0.05;
        p.vy += (tgtY - p.y) * 0.05;

        // Pointer repel (only when pointer is near the orb area)
        if (pointerActive) {
          const dx = p.x - px;
          const dy = p.y - py;
          const dist = Math.hypot(dx, dy);
          const reach = isMobile ? 70 : 110;
          if (dist < reach && dist > 0.01) {
            const force = (1 - dist / reach) * 1.8;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        // Depth-based render (z2 is the rotated z)
        const depth = (z2 + 1) * 0.5; // 0 (back) → 1 (front)
        const baseR = 0.5 + depth * 1.4;
        const baseAlpha = 0.25 + depth * 0.6;
        const pulse = 0.75 + Math.sin(t * 2 + i * 0.3) * 0.25;
        const alpha = baseAlpha * pulse * (1 - m * 0.2);

        ctx.beginPath();
        ctx.arc(p.x, p.y, baseR, 0, Math.PI * 2);
        ctx.fillStyle = `hsla(${p.hue}, 85%, ${55 + depth * 20}%, ${alpha})`;
        ctx.fill();

        if (depth > 0.65) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, baseR * 0.4, 0, Math.PI * 2);
          ctx.fillStyle = `hsla(0, 0%, 100%, ${alpha * 0.7})`;
          ctx.fill();
        }
      }

      // Connecting lines (orb mode only, front-facing particles)
      if (m < 0.6) {
        const maxDist = isMobile ? 28 : 36;
        const lineAlphaBase = (1 - m) * 0.18;
        ctx.lineWidth = 0.5;
        const step = isMobile ? 5 : 3;
        for (let i = 0; i < arr.length; i += step) {
          for (let j = i + step; j < Math.min(i + step * 8, arr.length); j += step) {
            const a = arr[i], b = arr[j];
            const dx = a.x - b.x, dy = a.y - b.y;
            const d = Math.hypot(dx, dy);
            if (d < maxDist) {
              const alpha = (1 - d / maxDist) * lineAlphaBase;
              ctx.strokeStyle = `hsla(265, 80%, 70%, ${alpha})`;
              ctx.beginPath();
              ctx.moveTo(a.x, a.y);
              ctx.lineTo(b.x, b.y);
              ctx.stroke();
            }
          }
        }
      }

      // Soft core glow (additive, no hard background) — uses scaled radius
      if (m < 0.85) {
        const ccx = cx + ox;
        const ccy = cy + oy;
        const coreR = effRadius * 0.8;
        const coreAlpha = (1 - m) * (0.28 + Math.sin(t * 2) * 0.06);
        const coreGrad = ctx.createRadialGradient(ccx, ccy, 0, ccx, ccy, coreR);
        coreGrad.addColorStop(0, `hsla(280, 95%, 75%, ${coreAlpha})`);
        coreGrad.addColorStop(0.45, `hsla(265, 85%, 55%, ${coreAlpha * 0.35})`);
        coreGrad.addColorStop(1, "hsla(265, 70%, 40%, 0)");
        ctx.fillStyle = coreGrad;
        ctx.beginPath();
        ctx.arc(ccx, ccy, coreR, 0, Math.PI * 2);
        ctx.fill();
      }

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerCancel);
      window.removeEventListener("scroll", handleScroll);
      canvas.removeEventListener("pointerleave", handlePointerLeave);
      canvas.removeEventListener("touchmove", handleTouchPrevent);
      pointersRef.current.clear();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className="relative w-full h-[280px] sm:h-[340px] md:h-[400px] lg:h-[440px] select-none overflow-hidden"
      style={{ pointerEvents: "none", background: "transparent" }}
      aria-label={mode === "orb" ? "Empire Core — trascina o tocca per esplorare" : "Empire Stack constellation"}
    >
      {/* Canvas: pointer events enabled, but transparent. Pointer hit-testing is done in JS to only react to orb area. */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full"
        style={{ pointerEvents: "none", cursor: "default", background: "transparent", touchAction: "pan-y" }}
      />

      {/* Centre label */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center z-10"
        style={{ pointerEvents: "none" }}
      >
        <AnimatePresence mode="wait">
          {mode === "orb" ? (
            <motion.div
              key="orb-label"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="text-center px-4"
            >
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-violet-300/80 mb-2">
                Empire Core
              </p>
              <h3
                className="text-xl sm:text-2xl md:text-3xl font-bold text-white"
                style={{ textShadow: "0 0 24px hsla(265,80%,60%,0.6)" }}
              >
                Il tuo Universo AI
              </h3>
              <AnimatePresence>
                {hint && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: [0.4, 0.9, 0.4] }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 2.2, repeat: Infinity }}
                    className="text-[10px] sm:text-xs text-violet-300/70 mt-3 font-medium"
                  >
                    Trascina · ruota · pizzica · tocca
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          ) : (
            <motion.div
              key="const-label"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.4, delay: 0.15 }}
              className="text-center px-4"
            >
              <p className="text-[10px] sm:text-[11px] font-bold uppercase tracking-[0.3em] text-violet-300/80 mb-1.5">
                Empire Stack
              </p>
              <h3 className="text-base sm:text-lg md:text-xl font-bold text-white">
                6 moduli sincronizzati
              </h3>
              <p className="text-[10px] sm:text-xs text-violet-300/60 mt-2">
                Tocca di nuovo per ricomporre
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Feature cards (constellation mode) — responsive distance: smaller on mobile to stay inside viewport */}
      <AnimatePresence>
        {mode === "constellation" &&
          FEATURES.map((f, i) => {
            const Icon = f.icon;
            const angRad = (f.angle * Math.PI) / 180;
            // Use vmin so cards scale with the smaller viewport dimension and never escape the container
            const distVmin = 22; // ~22% of the smaller side — safe on 320px screens
            const dx = Math.cos(angRad) * distVmin;
            const dy = Math.sin(angRad) * distVmin;
            return (
              <motion.div
                key={f.label}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.5 }}
                transition={{ duration: 0.4, delay: 0.3 + i * 0.05 }}
                className="absolute z-20"
                style={{
                  left: `calc(50% + ${dx}vmin)`,
                  top: `calc(50% + ${dy}vmin)`,
                  transform: "translate(-50%, -50%)",
                  pointerEvents: "none",
                  maxWidth: "40vw",
                }}
              >
                <div
                  className="flex items-center gap-1 sm:gap-2 px-2 py-1 sm:px-3 sm:py-2 rounded-full backdrop-blur-md"
                  style={{
                    background: "hsla(265,40%,15%,0.85)",
                    border: "1px solid hsla(265,80%,65%,0.4)",
                    boxShadow: "0 4px 16px hsla(265,80%,40%,0.35)",
                  }}
                >
                  <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-violet-300 shrink-0" />
                  <span className="text-[9px] sm:text-xs font-semibold text-white whitespace-nowrap">
                    {f.label}
                  </span>
                </div>
              </motion.div>
            );
          })}
      </AnimatePresence>
    </div>
  );
});

EmpireParticleOrb.displayName = "EmpireParticleOrb";
export default EmpireParticleOrb;
