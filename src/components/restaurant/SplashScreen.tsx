import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import restaurantLogo from "@/assets/restaurant-logo.png";

interface SplashScreenProps {
  restaurantName: string;
  onComplete: () => void;
}

const SplashScreen = ({ restaurantName, onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
      setTimeout(onComplete, 600);
    }, 2800);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: "easeInOut" }}
        >
          {/* Ambient glow rings */}
          <motion.div
            className="absolute w-96 h-96 rounded-full bg-primary/8 blur-[120px]"
            animate={{ scale: [1, 1.4, 1], opacity: [0.2, 0.5, 0.2] }}
            transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.div
            className="absolute w-60 h-60 rounded-full bg-primary/15 blur-[80px]"
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* Crown floating above logo */}
          <motion.div
            className="relative z-10 mb-2"
            initial={{ opacity: 0, y: -30, scale: 0.3 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Crown className="w-10 h-10 text-primary drop-shadow-[0_0_20px_hsla(38,75%,55%,0.5)]" />
          </motion.div>

          {/* Logo with gold ring */}
          <motion.div
            className="relative z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
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
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
          >
            {restaurantName}
          </motion.h1>

          {/* Tagline */}
          <motion.p
            className="mt-2 text-sm text-muted-foreground relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            Powered by Empire
          </motion.p>

          {/* Loading bar */}
          <motion.div
            className="mt-8 h-0.5 rounded-full bg-primary/20 overflow-hidden relative z-10"
            initial={{ width: 0 }}
            animate={{ width: 140 }}
            transition={{ duration: 0.3, delay: 0.9 }}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.6, delay: 1, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
