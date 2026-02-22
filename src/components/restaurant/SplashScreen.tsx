import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import restaurantLogo from "@/assets/restaurant-logo.png";
import heroVideo from "@/assets/hero-restaurant.mp4";

interface SplashScreenProps {
  restaurantName: string;
  onComplete: () => void;
}

const SplashScreen = ({ restaurantName, onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"logo" | "video" | "exit">("logo");

  useEffect(() => {
    // Phase 1: Logo branding (2s) → Phase 2: Video reveal (2s) → Exit
    const t1 = setTimeout(() => setPhase("video"), 2200);
    const t2 = setTimeout(() => setPhase("exit"), 4200);
    const t3 = setTimeout(onComplete, 5000);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {phase !== "exit" ? null : null}
      <motion.div
        className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === "exit" ? 0 : 1 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        onAnimationComplete={() => { if (phase === "exit") onComplete(); }}
      >
        {/* Video background layer — fades in during "video" phase */}
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: phase === "video" || phase === "exit" ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          <video
            src={heroVideo}
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-black/50" />
        </motion.div>

        {/* Dark base background for logo phase */}
        <motion.div
          className="absolute inset-0 bg-background"
          initial={{ opacity: 1 }}
          animate={{ opacity: phase === "logo" ? 1 : 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        />

        {/* Ambient glow rings */}
        <motion.div
          className="absolute w-96 h-96 rounded-full bg-primary/8 blur-[120px]"
          animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Crown */}
        <motion.div
          className="relative z-10 mb-2"
          initial={{ opacity: 0, y: -30, scale: 0.3 }}
          animate={{
            opacity: phase === "video" ? 0 : 1,
            y: phase === "video" ? -20 : 0,
            scale: phase === "video" ? 0.8 : 1,
          }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <Crown className="w-10 h-10 text-primary drop-shadow-[0_0_20px_hsla(38,75%,55%,0.5)]" />
        </motion.div>

        {/* Logo with gold ring */}
        <motion.div
          className="relative z-10"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{
            scale: phase === "video" ? 0.7 : 1,
            opacity: 1,
            y: phase === "video" ? -10 : 0,
          }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="relative">
            <motion.div
              className="absolute -inset-2 rounded-2xl border-2 border-primary/40"
              animate={{ opacity: [0.4, 0.8, 0.4] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            />
            <img
              src={restaurantLogo}
              alt={restaurantName}
              className="w-28 h-28 rounded-2xl object-contain"
            />
          </div>
        </motion.div>

        {/* Restaurant name */}
        <motion.h1
          className="mt-6 text-3xl font-display font-bold text-gold-gradient relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{ duration: 0.6, delay: 0.7 }}
        >
          {restaurantName}
        </motion.h1>

        {/* Tagline — changes text in video phase */}
        <motion.p
          className="mt-2 text-sm relative z-10 text-white/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1 }}
        >
          {phase === "logo" ? "Powered by Empire" : "Scopri il menu →"}
        </motion.p>

        {/* Loading bar */}
        <motion.div
          className="mt-8 h-0.5 rounded-full bg-white/20 overflow-hidden relative z-10"
          initial={{ width: 0 }}
          animate={{ width: 160 }}
          transition={{ duration: 0.3, delay: 0.9 }}
        >
          <motion.div
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 3.2, delay: 1, ease: "easeInOut" }}
          />
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default SplashScreen;
