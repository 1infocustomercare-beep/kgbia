import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Crown } from "lucide-react";

const smoothEase = [0.22, 1, 0.36, 1] as const;

const SplashScreen = ({ onComplete }: { onComplete: () => void }) => {
  const [phase, setPhase] = useState<"build" | "exit">("build");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("exit"), 1400);
    const t2 = setTimeout(onComplete, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [onComplete]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden"
      style={{ backgroundColor: "hsl(var(--background))" }}
      animate={phase === "exit" ? { opacity: 0 } : { opacity: 1 }}
      transition={{ duration: 0.6, ease: smoothEase }}
    >
      {/* Ambient orbs */}
      <motion.div
        className="absolute rounded-full blur-[100px]"
        style={{ width: 400, height: 400, background: "hsla(217,91%,60%,0.12)" }}
        animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute rounded-full blur-[80px]"
        style={{ width: 300, height: 300, left: "60%", top: "30%", background: "hsla(280,80%,55%,0.08)" }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.5, 0.2] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: "linear-gradient(hsl(var(--foreground)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,hsl(var(--background))_80%)]" />

      {/* Center content */}
      <div className="relative flex flex-col items-center gap-5">
        {/* Logo */}
        <motion.div
          className="w-20 h-20 rounded-3xl bg-white/[0.06] backdrop-blur-2xl flex items-center justify-center border border-white/[0.08]"
          initial={{ opacity: 0, scale: 0.3 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1, ease: smoothEase }}
        >
          <motion.div
            className="w-16 h-16 rounded-2xl bg-vibrant-gradient flex items-center justify-center"
            animate={{
              boxShadow: [
                "0 0 30px hsla(217,91%,60%,0.2)",
                "0 0 60px hsla(217,91%,60%,0.4)",
                "0 0 30px hsla(217,91%,60%,0.2)",
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
        </motion.div>

        {/* Brand */}
        <motion.div
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: smoothEase }}
        >
          <h1 className="font-heading font-bold text-3xl tracking-[0.2em] uppercase text-foreground">
            Empire<span className="text-shimmer">.AI</span>
          </h1>
          <motion.p
            className="text-[0.6rem] tracking-[0.4em] uppercase text-foreground/25 font-heading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 1 }}
          >
            Il Sistema Operativo del Business
          </motion.p>
        </motion.div>

        {/* Loading bar */}
        <motion.div
          className="w-48 h-[2px] rounded-full bg-foreground/[0.04] overflow-hidden mt-3"
          initial={{ opacity: 0, scaleX: 0.5 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
        >
          <motion.div
            className="h-full rounded-full"
            style={{ background: "linear-gradient(90deg, hsl(var(--primary)), hsla(280,80%,65%,1), hsl(var(--primary)))" }}
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, delay: 0.8, ease: smoothEase }}
          />
        </motion.div>

        {/* Scanner ring */}
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

      {/* Bottom */}
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