import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useSpring } from "framer-motion";
import { Crown } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

/* ── Haptic helper ── */
const haptic = (style: "heavy" | "rigid" | "light" = "heavy") => {
  try {
    if ("vibrate" in navigator) {
      navigator.vibrate(style === "heavy" ? 30 : style === "rigid" ? 15 : 8);
    }
  } catch {}
};

/* ── Gyroscope hook ── */
const useGyro = () => {
  const gx = useMotionValue(0);
  const gy = useMotionValue(0);
  useEffect(() => {
    const handler = (e: DeviceOrientationEvent) => {
      gx.set((e.gamma || 0) / 45); // -1 to 1
      gy.set((e.beta || 0) / 45);
    };
    window.addEventListener("deviceorientation", handler, { passive: true });
    // Fallback: mouse parallax on desktop
    const mouseHandler = (e: MouseEvent) => {
      gx.set((e.clientX / window.innerWidth - 0.5) * 2);
      gy.set((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", mouseHandler, { passive: true });
    return () => {
      window.removeEventListener("deviceorientation", handler);
      window.removeEventListener("mousemove", mouseHandler);
    };
  }, [gx, gy]);
  return { gx, gy };
};

/* ── Specular reflection overlay ── */
const SpecularPanel = ({ gx, gy, delay, children, className = "" }: {
  gx: ReturnType<typeof useMotionValue>;
  gy: ReturnType<typeof useMotionValue>;
  delay: number;
  children: React.ReactNode;
  className?: string;
}) => {
  const [anchored, setAnchored] = useState(false);
  const reflectX = useSpring(useTransform(gx, [-1, 1], [-120, 120] as number[]), { stiffness: 80, damping: 20 });
  const reflectY = useSpring(useTransform(gy, [-1, 1], [-120, 120] as number[]), { stiffness: 80, damping: 20 });
  const tiltX = useSpring(useTransform(gy, [-1, 1], [4, -4] as number[]), { stiffness: 120, damping: 25 });
  const tiltY = useSpring(useTransform(gx, [-1, 1], [-4, 4] as number[]), { stiffness: 120, damping: 25 });

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{ rotateX: tiltX, rotateY: tiltY, transformStyle: "preserve-3d" }}
      initial={{ opacity: 0, scale: 0.3, z: -300 }}
      animate={{ opacity: 1, scale: 1, z: 0 }}
      transition={{ duration: 0.8, delay, ease: smoothEase }}
      onAnimationComplete={() => { setAnchored(true); haptic("heavy"); }}
    >
      {children}
      {/* Specular reflection */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(ellipse 200px 200px at calc(50% + var(--rx)) calc(50% + var(--ry)), hsla(217,91%,75%,0.15), transparent 70%)`,
          // @ts-ignore
          "--rx": reflectX,
          "--ry": reflectY,
        } as any}
      />
      {/* Edge highlight */}
      <div className="absolute inset-0 rounded-[inherit] border border-white/[0.08] pointer-events-none" />
      {/* Anchor pulse */}
      <AnimatePresence>
        {anchored && (
          <motion.div
            className="absolute inset-0 rounded-[inherit] border-2 border-primary/40"
            initial={{ opacity: 1, scale: 1 }}
            animate={{ opacity: 0, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

/* ── Floating Orb ── */
const Orb = ({ color, size, x, y, gx, gy, parallaxFactor }: {
  color: string; size: number; x: string; y: string;
  gx: ReturnType<typeof useMotionValue>;
  gy: ReturnType<typeof useMotionValue>;
  parallaxFactor: number;
}) => {
  const px = useSpring(useTransform(gx, [-1, 1], [-30 * parallaxFactor, 30 * parallaxFactor] as number[]), { stiffness: 50, damping: 30 });
  const py = useSpring(useTransform(gy, [-1, 1], [-30 * parallaxFactor, 30 * parallaxFactor] as number[]), { stiffness: 50, damping: 30 });
  return (
    <motion.div
      className="absolute rounded-full blur-[80px]"
      style={{
        width: size, height: size, left: x, top: y,
        background: color,
        x: px, y: py,
      }}
      animate={{ scale: [1, 1.2, 1], opacity: [0.4, 0.7, 0.4] }}
      transition={{ duration: 4 + parallaxFactor, repeat: Infinity, ease: "easeInOut" }}
    />
  );
};

/* ── Main SplashScreen ── */
const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"build" | "reveal" | "exit">("build");
  const { gx, gy } = useGyro();

  // Parallax for background layers
  const bgX = useSpring(useTransform(gx, [-1, 1], [15, -15]), { stiffness: 60, damping: 25 });
  const bgY = useSpring(useTransform(gy, [-1, 1], [15, -15]), { stiffness: 60, damping: 25 });
  const gridX = useSpring(useTransform(gx, [-1, 1], [-8, 8]), { stiffness: 40, damping: 20 });
  const gridY = useSpring(useTransform(gy, [-1, 1], [-8, 8]), { stiffness: 40, damping: 20 });

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 2200);
    const t2 = setTimeout(() => { setPhase("exit"); haptic("rigid"); }, 3200);
    const t3 = setTimeout(onComplete, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ perspective: 1200, backgroundColor: "hsl(var(--background))" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6, ease: smoothEase }}
    >
      {/* ── Deep background with parallax ── */}
      <motion.div className="absolute inset-0" style={{ x: bgX, y: bgY, scale: 1.1 }}>
        {/* Orbs */}
        <Orb gx={gx} gy={gy} color="hsla(217,91%,60%,0.15)" size={500} x="20%" y="30%" parallaxFactor={1.5} />
        <Orb gx={gx} gy={gy} color="hsla(280,80%,55%,0.1)" size={400} x="65%" y="20%" parallaxFactor={2} />
        <Orb gx={gx} gy={gy} color="hsla(340,70%,55%,0.08)" size={350} x="40%" y="65%" parallaxFactor={1} />
        <Orb gx={gx} gy={gy} color="hsla(160,60%,45%,0.06)" size={300} x="75%" y="70%" parallaxFactor={2.5} />
      </motion.div>

      {/* ── Grid with parallax ── */}
      <motion.div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          x: gridX, y: gridY,
        }}
      />

      {/* ── Radial vignette ── */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_80%)]" />

      {/* ── Center content ── */}
      <div className="relative flex flex-col items-center gap-5" style={{ perspective: 800 }}>

        {/* Floating glassmorphism panels (decorative) */}
        <SpecularPanel gx={gx} gy={gy} delay={0.3}
          className="absolute -top-16 -left-28 w-32 h-20 rounded-2xl bg-white/[0.04] backdrop-blur-xl hidden sm:block"
        >
          <div className="p-3 flex flex-col gap-1.5">
            <div className="w-12 h-1.5 rounded-full bg-primary/20" />
            <div className="w-8 h-1.5 rounded-full bg-primary/10" />
            <div className="flex gap-1 mt-1">
              <div className="w-3 h-3 rounded bg-emerald-500/20" />
              <div className="w-3 h-3 rounded bg-primary/15" />
              <div className="w-3 h-3 rounded bg-amber-500/15" />
            </div>
          </div>
        </SpecularPanel>

        <SpecularPanel gx={gx} gy={gy} delay={0.5}
          className="absolute -top-10 -right-32 w-28 h-16 rounded-2xl bg-white/[0.04] backdrop-blur-xl hidden sm:block"
        >
          <div className="p-3 flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 flex items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-emerald-400/60" />
            </div>
            <div className="flex flex-col gap-1">
              <div className="w-10 h-1 rounded-full bg-foreground/10" />
              <div className="w-6 h-1 rounded-full bg-foreground/5" />
            </div>
          </div>
        </SpecularPanel>

        <SpecularPanel gx={gx} gy={gy} delay={0.7}
          className="absolute -bottom-14 -right-24 w-36 h-14 rounded-2xl bg-white/[0.04] backdrop-blur-xl hidden sm:block"
        >
          <div className="p-3 flex items-end gap-1 h-full">
            {[40, 65, 50, 80, 60, 75, 90].map((h, i) => (
              <motion.div key={i} className="flex-1 rounded-t bg-primary/20"
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                transition={{ delay: 1 + i * 0.08, duration: 0.5, ease: smoothEase }}
              />
            ))}
          </div>
        </SpecularPanel>

        <SpecularPanel gx={gx} gy={gy} delay={0.6}
          className="absolute -bottom-12 -left-20 w-24 h-24 rounded-2xl bg-white/[0.04] backdrop-blur-xl hidden sm:block"
        >
          <div className="p-3 flex flex-col items-center justify-center h-full gap-1">
            <motion.div className="text-lg font-heading font-bold text-primary/60"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
              98%
            </motion.div>
            <div className="w-full h-1 rounded-full bg-foreground/5 overflow-hidden">
              <motion.div className="h-full rounded-full bg-primary/30"
                initial={{ width: 0 }} animate={{ width: "98%" }}
                transition={{ delay: 1.2, duration: 1, ease: smoothEase }}
              />
            </div>
            <div className="text-[0.45rem] text-foreground/20 tracking-wider uppercase">Uptime</div>
          </div>
        </SpecularPanel>

        {/* ── Logo ── */}
        <SpecularPanel gx={gx} gy={gy} delay={0.1}
          className="w-20 h-20 rounded-3xl bg-white/[0.06] backdrop-blur-2xl flex items-center justify-center"
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 30px hsla(217,91%,60%,0.2), inset 0 1px 0 hsla(0,0%,100%,0.15)",
                "0 0 60px hsla(217,91%,60%,0.4), inset 0 1px 0 hsla(0,0%,100%,0.2)",
                "0 0 30px hsla(217,91%,60%,0.2), inset 0 1px 0 hsla(0,0%,100%,0.15)",
              ],
            }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
            >
              <Crown className="w-8 h-8 text-primary-foreground drop-shadow-[0_0_12px_rgba(255,255,255,0.5)]" />
            </motion.div>
          </motion.div>
        </SpecularPanel>

        {/* ── Brand ── */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 30, z: -100 }}
          animate={{ opacity: 1, y: 0, z: 0 }}
          transition={{ duration: 0.8, delay: 0.8, ease: smoothEase }}
        >
          <h1 className="font-heading font-bold text-3xl tracking-[0.2em] uppercase text-foreground">
            Empire<span className="text-shimmer">.AI</span>
          </h1>
          <motion.p
            className="text-[0.6rem] tracking-[0.4em] uppercase text-foreground/25 font-heading"
            initial={{ opacity: 0, letterSpacing: "0.6em" }}
            animate={{ opacity: 1, letterSpacing: "0.4em" }}
            transition={{ duration: 1, delay: 1.1 }}
          >
            Il Sistema Operativo del Business
          </motion.p>
        </motion.div>

        {/* ── Loading bar ── */}
        <motion.div
          className="w-48 h-[2px] rounded-full bg-foreground/[0.04] overflow-hidden mt-3"
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 1.2, duration: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsla(280,80%,65%,1), hsl(var(--primary)))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.8, ease: smoothEase }}
          />
        </motion.div>

        {/* ── Conic scanner ring ── */}
        <motion.div
          className="absolute -inset-20 rounded-full pointer-events-none"
          style={{
            background: "conic-gradient(from 0deg, transparent 0%, hsla(217,91%,60%,0.06) 10%, transparent 20%)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
        />
      </div>

      {/* ── Bottom text ── */}
      <motion.p
        className="absolute bottom-8 text-[0.5rem] tracking-[0.5em] uppercase text-foreground/10 font-heading"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        Powered by AI
      </motion.p>
    </motion.div>
  );
};

export default SplashScreen;
