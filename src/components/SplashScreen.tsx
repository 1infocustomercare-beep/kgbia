import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Crown } from "lucide-react";

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"logo" | "expand" | "exit">("logo");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("expand"), 1600);
    const t2 = setTimeout(() => setPhase("exit"), 2400);
    const t3 = setTimeout(onComplete, 3000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-background"
        initial={{ opacity: 1 }}
        animate={phase === "exit" ? { opacity: 0, scale: 1.05 } : { opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        style={{ pointerEvents: phase === "exit" ? "none" : "auto" }}
      >
        {/* Ambient glow orbs */}
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            className="absolute top-1/2 left-1/2 w-[600px] h-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full"
            style={{ background: "radial-gradient(circle, hsla(217,91%,60%,0.12) 0%, transparent 70%)" }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute top-1/3 left-1/3 w-[300px] h-[300px] rounded-full"
            style={{ background: "radial-gradient(circle, hsla(280,80%,60%,0.08) 0%, transparent 70%)" }}
            animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>

        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)", backgroundSize: "60px 60px" }}
        />

        {/* Center content */}
        <div className="relative flex flex-col items-center gap-6">
          {/* Logo icon */}
          <motion.div
            className="relative"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
          >
            {/* Outer ring */}
            <motion.div
              className="absolute -inset-4 rounded-2xl border border-primary/20"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: [0, 1, 0.5], scale: [0.8, 1.1, 1] }}
              transition={{ duration: 1.5, delay: 0.5 }}
            />
            {/* Glow ring */}
            <motion.div
              className="absolute -inset-6 rounded-3xl"
              style={{ background: "conic-gradient(from 0deg, transparent, hsl(var(--primary)), transparent, hsl(var(--primary)), transparent)" }}
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 0.15 }}
            />
            
            <motion.div
              className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center shadow-[0_0_40px_hsla(217,91%,60%,0.35)]"
              animate={{
                boxShadow: [
                  "0 0 30px hsla(217,91%,60%,0.25)",
                  "0 0 60px hsla(217,91%,60%,0.45)",
                  "0 0 30px hsla(217,91%,60%,0.25)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="w-8 h-8 text-primary-foreground drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
            </motion.div>
          </motion.div>

          {/* Brand text */}
          <motion.div
            className="flex flex-col items-center gap-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <h1 className="font-heading font-bold text-2xl tracking-[0.2em] uppercase text-foreground">
              Empire<span className="text-shimmer">.AI</span>
            </h1>
            <motion.p
              className="text-[0.6rem] tracking-[0.35em] uppercase text-foreground/30 font-heading"
              initial={{ opacity: 0, letterSpacing: "0.5em" }}
              animate={{ opacity: 1, letterSpacing: "0.35em" }}
              transition={{ duration: 0.8, delay: 0.9 }}
            >
              Il Sistema Operativo del Business
            </motion.p>
          </motion.div>

          {/* Loading bar */}
          <motion.div
            className="w-40 h-[2px] rounded-full bg-foreground/5 overflow-hidden mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <motion.div
              className="h-full rounded-full bg-vibrant-gradient"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.8, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            />
          </motion.div>
        </div>

        {/* Bottom watermark */}
        <motion.p
          className="absolute bottom-8 text-[0.5rem] tracking-[0.4em] uppercase text-foreground/15 font-heading"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
        >
          Powered by AI
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
