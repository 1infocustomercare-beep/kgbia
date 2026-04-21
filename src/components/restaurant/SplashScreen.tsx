import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState, useMemo } from "react";

interface SplashScreenProps {
  restaurantName: string;
  logoUrl?: string;
  primaryColor?: string | null;
  onComplete: () => void;
}

/** Convert any hex/short-hex into a usable CSS color, fallback to brand gold */
const normalizeColor = (c?: string | null) => {
  if (!c) return "#C8963E";
  const v = c.trim();
  if (/^#([0-9a-f]{3}|[0-9a-f]{6})$/i.test(v)) return v;
  return v; // assume it's a valid CSS color (hsl/rgb/named)
};

const SplashScreen = ({ restaurantName, logoUrl, primaryColor, onComplete }: SplashScreenProps) => {
  const [visible, setVisible] = useState(true);
  const brand = useMemo(() => normalizeColor(primaryColor), [primaryColor]);

  useEffect(() => {
    const tHide = setTimeout(() => setVisible(false), 2200);
    const tDone = setTimeout(onComplete, 2800);
    return () => { clearTimeout(tHide); clearTimeout(tDone); };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden"
          style={{ backgroundColor: brand }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          {/* Soft radial highlight (Glovo-like depth) */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                "radial-gradient(circle at 50% 40%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0) 60%)",
            }}
          />

          {/* Expanding rings behind the logo */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute rounded-full border-2 border-white/30"
              initial={{ width: 120, height: 120, opacity: 0 }}
              animate={{
                width: [120, 360],
                height: [120, 360],
                opacity: [0.6, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.5,
                ease: "easeOut",
              }}
            />
          ))}

          {/* White logo bubble — Glovo signature bounce */}
          <motion.div
            className="relative z-10 flex items-center justify-center rounded-full bg-white shadow-2xl"
            style={{
              width: 132,
              height: 132,
              boxShadow: "0 25px 60px -10px rgba(0,0,0,0.35)",
            }}
            initial={{ scale: 0, rotate: -10, opacity: 0 }}
            animate={{
              scale: [0, 1.15, 0.95, 1.05, 1],
              rotate: [-10, 0, 0, 0, 0],
              opacity: 1,
            }}
            transition={{
              duration: 1,
              times: [0, 0.45, 0.65, 0.85, 1],
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={restaurantName}
                className="w-24 h-24 rounded-full object-contain"
              />
            ) : (
              <span
                className="text-5xl font-display font-bold"
                style={{ color: brand }}
              >
                {restaurantName.charAt(0).toUpperCase()}
              </span>
            )}

            {/* Subtle continuous pulse */}
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ boxShadow: `0 0 0 0 ${brand}` }}
              animate={{
                boxShadow: [
                  "0 0 0 0 rgba(255,255,255,0.45)",
                  "0 0 0 24px rgba(255,255,255,0)",
                ],
              }}
              transition={{ duration: 1.6, repeat: Infinity, ease: "easeOut", delay: 1 }}
            />
          </motion.div>

          {/* Restaurant name */}
          <motion.h1
            className="mt-8 text-2xl font-display font-bold text-white relative z-10 tracking-wide"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7, ease: [0.22, 1, 0.36, 1] }}
          >
            {restaurantName}
          </motion.h1>

          {/* Loading dots */}
          <motion.div
            className="mt-6 flex gap-2 relative z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 rounded-full bg-white"
                animate={{ y: [0, -6, 0], opacity: [0.5, 1, 0.5] }}
                transition={{
                  duration: 0.9,
                  repeat: Infinity,
                  delay: i * 0.15,
                  ease: "easeInOut",
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SplashScreen;
