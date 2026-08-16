/**
 * Pointer/gyro parallax condiviso per le hero cinematiche.
 * Restituisce due MotionValue normalizzate (-1 → 1) smorzate con spring,
 * così ogni settore può usarle con ampiezze e assi diversi.
 */
import { useEffect } from "react";
import { useMotionValue, useSpring, type MotionValue } from "framer-motion";

export function usePointerParallax(stiffness = 60, damping = 18): {
  px: MotionValue<number>;
  py: MotionValue<number>;
} {
  const rawX = useMotionValue(0);
  const rawY = useMotionValue(0);
  const px = useSpring(rawX, { stiffness, damping, mass: 0.6 });
  const py = useSpring(rawY, { stiffness, damping, mass: 0.6 });

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      rawX.set((e.clientX / window.innerWidth) * 2 - 1);
      rawY.set((e.clientY / window.innerHeight) * 2 - 1);
    };
    const onOrient = (e: DeviceOrientationEvent) => {
      if (e.gamma != null) rawX.set(Math.max(-1, Math.min(1, e.gamma / 35)));
      if (e.beta != null) rawY.set(Math.max(-1, Math.min(1, (e.beta - 45) / 40)));
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("deviceorientation", onOrient);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("deviceorientation", onOrient);
    };
  }, [rawX, rawY]);

  return { px, py };
}
