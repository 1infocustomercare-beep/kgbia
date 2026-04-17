import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CinematicCursor() {
  const [hidden, setHidden] = useState(true);
  const [hovering, setHovering] = useState(false);
  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const sx = useSpring(x, { stiffness: 500, damping: 40, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 500, damping: 40, mass: 0.4 });

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (window.matchMedia("(pointer: coarse)").matches) return; // skip on touch

    const move = (e: MouseEvent) => {
      x.set(e.clientX);
      y.set(e.clientY);
      setHidden(false);
    };
    const out = () => setHidden(true);
    const over = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      const isInteractive = !!t.closest("button, a, [role='button'], input, textarea, select");
      setHovering(isInteractive);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("mouseout", out);
    window.addEventListener("mouseover", over);
    document.documentElement.style.cursor = "none";

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseout", out);
      window.removeEventListener("mouseover", over);
      document.documentElement.style.cursor = "";
    };
  }, [x, y]);

  if (hidden) return null;

  return (
    <>
      {/* Outer ring */}
      <motion.div
        style={{ x: sx, y: sy }}
        className="fixed top-0 left-0 z-[10000] pointer-events-none"
      >
        <motion.div
          animate={{
            width: hovering ? 56 : 36,
            height: hovering ? 56 : 36,
            borderColor: hovering ? "rgba(212,175,55,0.7)" : "rgba(212,175,55,0.35)",
          }}
          transition={{ duration: 0.25 }}
          className="rounded-full border-2 -translate-x-1/2 -translate-y-1/2"
        />
      </motion.div>
      {/* Inner dot */}
      <motion.div
        style={{ x, y }}
        className="fixed top-0 left-0 z-[10001] pointer-events-none"
      >
        <motion.div
          animate={{
            width: hovering ? 6 : 8,
            height: hovering ? 6 : 8,
            backgroundColor: hovering ? "#7C3AED" : "#D4AF37",
          }}
          transition={{ duration: 0.2 }}
          className="rounded-full -translate-x-1/2 -translate-y-1/2"
          style={{ boxShadow: "0 0 12px rgba(212,175,55,0.6)" }}
        />
      </motion.div>
    </>
  );
}
