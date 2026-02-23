import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

interface SplashScreenProps {
  restaurantName: string;
  logoUrl?: string;
  onComplete: () => void;
}

const SplashScreen = ({ restaurantName, logoUrl, onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"brand" | "reveal" | "done">("brand");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("reveal"), 1800);
    const t2 = setTimeout(() => setPhase("done"), 3200);
    const t3 = setTimeout(onComplete, 3800);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background overflow-hidden"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Ambient glow */}
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-primary/10 blur-[100px]"
            animate={{ scale: [1, 1.5, 1], opacity: [0.15, 0.4, 0.15] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Restaurant Logo */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-3 rounded-2xl border-2 border-primary/30"
                animate={{ opacity: [0.3, 0.7, 0.3], scale: [1, 1.02, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={restaurantName}
                  className="w-28 h-28 rounded-2xl object-contain"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-primary/10 flex items-center justify-center">
                  <span className="text-4xl font-display font-bold text-primary">
                    {restaurantName.charAt(0)}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Name */}
          <motion.h1
            className="mt-5 text-2xl font-display font-bold text-gold-gradient relative z-10"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
          >
            {restaurantName}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-1.5 text-xs text-muted-foreground relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: phase === "reveal" ? 1 : 0.7 }}
            transition={{ duration: 0.4, delay: 0.9 }}
          >
            Powered by Empire
          </motion.p>

          {/* Progress bar */}
          <motion.div
            className="mt-8 h-1 rounded-full bg-secondary overflow-hidden relative z-10"
            initial={{ width: 0 }}
            animate={{ width: 160 }}
            transition={{ duration: 0.3, delay: 0.8 }}
          >
            <motion.div
              className="h-full rounded-full bg-primary"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 2.2, delay: 0.9, ease: [0.4, 0, 0.2, 1] }}
            />
          </motion.div>

          {/* Dots animation */}
          <motion.div
            className="mt-4 flex gap-1.5 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-1.5 h-1.5 rounded-full bg-primary/60"
                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
