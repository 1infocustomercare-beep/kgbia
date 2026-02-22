import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
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
    }, 2200);
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
          {/* Ambient glow */}
          <motion.div
            className="absolute w-80 h-80 rounded-full bg-primary/10 blur-[100px]"
            animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Logo */}
          <motion.img
            src={restaurantLogo}
            alt={restaurantName}
            className="w-28 h-28 rounded-2xl object-contain relative z-10"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          />

          {/* Restaurant name */}
          <motion.h1
            className="mt-6 text-3xl font-display font-bold text-gold-gradient relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {restaurantName}
          </motion.h1>

          {/* Loading bar */}
          <motion.div
            className="mt-8 h-0.5 rounded-full bg-primary/20 overflow-hidden relative z-10"
            initial={{ width: 0 }}
            animate={{ width: 120 }}
            transition={{ duration: 0.3, delay: 0.6 }}
          >
            <motion.div
              className="h-full bg-primary rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 1.4, delay: 0.7, ease: "easeInOut" }}
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
