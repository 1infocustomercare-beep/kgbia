/**
 * ═══ JET EXPLODED ═══
 * Vista esplosa in stile movimento d'orologio: scrollando, motore, sedile,
 * avionica e ala convergono sulla fusoliera fino a comporre il jet completo.
 * ADDITIVO — solo presentazione.
 */
import { useEffect, useRef, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import fuselage from "@/assets/aurea-jet/part-fuselage.png";
import engine from "@/assets/aurea-jet/part-engine.png";
import seat from "@/assets/aurea-jet/part-seat.png";
import avionics from "@/assets/aurea-jet/part-cockpit.png";
import wing from "@/assets/aurea-jet/part-wing.png";

export default function JetExploded() {
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();
  const [k, setK] = useState(1);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 640px)");
    const sync = () => setK(mq.matches ? 0.42 : 1);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  const pc = (v: number) => `${(v * k).toFixed(1)}%`;
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });

  const assemble = useTransform(scrollYProgress, [0.05, 0.78], [1, 0]);

  const engineX = useTransform(assemble, [0, 1], [pc(8.0), pc(-46.0)]);
  const engineY = useTransform(assemble, [0, 1], [pc(4.0), pc(-42.0)]);
  const seatX = useTransform(assemble, [0, 1], [pc(-6.0), pc(38.0)]);
  const seatY = useTransform(assemble, [0, 1], [pc(6.0), pc(46.0)]);
  const avX = useTransform(assemble, [0, 1], [pc(-14.0), pc(-54.0)]);
  const avY = useTransform(assemble, [0, 1], [pc(-2.0), pc(40.0)]);
  const wingY = useTransform(assemble, [0, 1], [pc(2.0), pc(-46.0)]);
  const wingX = useTransform(assemble, [0, 1], [pc(2.0), pc(44.0)]);
  const partOpacity = useTransform(scrollYProgress, [0.72, 0.86], [1, 0]);
  const finalOpacity = useTransform(scrollYProgress, [0.74, 0.9], [0, 1]);
  const finalScale = useTransform(scrollYProgress, [0.74, 1], [0.86, 1]);
  const fuseOpacity = useTransform(scrollYProgress, [0.7, 0.84], [1, 0]);
  const rotate = useTransform(assemble, [0, 1], [0, -6]);

  return (
    <section ref={ref} className="relative h-[340svh] bg-background">
      <div className="sticky top-0 flex h-[100svh] flex-col items-center justify-center overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_45%,hsl(var(--primary)/0.12),transparent_62%)]" />

        <div className="relative z-10 mb-6 px-6 text-center">
          <p className="text-[10px] font-semibold uppercase tracking-[0.34em] text-primary">Dettagli ingegneristici</p>
          <h2 className="jet-serif mt-4 text-3xl leading-[0.98] sm:text-5xl">
            Ogni componente, <span className="italic text-primary">come un calibro.</span>
          </h2>
        </div>

        <div className="relative z-10 h-[52svh] w-full max-w-5xl">
          {/* fusoliera base */}
          <motion.img
            src={fuselage}
            alt="Fusoliera del jet"
            loading="lazy"
            className="absolute left-1/2 top-1/2 w-[min(92vw,980px)] object-contain"
            style={{ x: "-50%", y: "-50%", ...(reduced ? {} : { opacity: fuseOpacity, rotate }) }}
          />
          {/* jet completo */}
          <motion.img
            src={wing}
            alt="Jet privato completo"
            loading="lazy"
            className="absolute left-1/2 top-1/2 w-[min(88vw,860px)] object-contain drop-shadow-[0_40px_80px_hsl(var(--primary)/0.25)]"
            style={{ x: "-50%", y: "-50%", ...(reduced ? { opacity: 1 } : { opacity: finalOpacity, scale: finalScale }) }}
          />

          <Part src={engine} alt="Motore" x={engineX} y={engineY} o={partOpacity} reduced={!!reduced} size="w-[26vw] max-w-[240px]" />
          <Part src={seat} alt="Poltrona in pelle" x={seatX} y={seatY} o={partOpacity} reduced={!!reduced} size="w-[22vw] max-w-[200px]" />
          <Part src={avionics} alt="Avionica" x={avX} y={avY} o={partOpacity} reduced={!!reduced} size="w-[28vw] max-w-[260px]" />
        </div>

        <div className="relative z-10 mt-6 grid w-full max-w-3xl grid-cols-3 gap-4 px-6 text-center">
          {[
            { k: "Propulsione", v: "2 × turbofan" },
            { k: "Cabina", v: "Pelle cucita a mano" },
            { k: "Avionica", v: "Fly-by-wire" },
          ].map((s) => (
            <div key={s.k}>
              <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{s.k}</p>
              <p className="mt-1 text-xs font-semibold text-foreground sm:text-sm">{s.v}</p>
            </div>
          ))}
        </div>
        <motion.div style={reduced ? undefined : { opacity: partOpacity }} className="pointer-events-none absolute inset-0 z-0">
          <motion.img
            src={wing}
            alt=""
            aria-hidden
            loading="lazy"
            className="absolute left-1/2 top-1/2 w-[24vw] max-w-[220px] -translate-x-1/2 -translate-y-1/2 object-contain opacity-0"
            style={{ x: wingX, y: wingY }}
          />
        </motion.div>
      </div>
    </section>
  );
}

function Part({
  src,
  alt,
  x,
  y,
  o,
  reduced,
  size,
}: {
  src: string;
  alt: string;
  x: import("framer-motion").MotionValue<string>;
  y: import("framer-motion").MotionValue<string>;
  o: import("framer-motion").MotionValue<number>;
  reduced: boolean;
  size: string;
}) {
  return (
    <motion.img
      src={src}
      alt={alt}
      loading="lazy"
      className={`absolute left-1/2 top-1/2 object-contain drop-shadow-[0_24px_60px_hsl(var(--background))] ${size}`}
      style={
        reduced
          ? { x: "-50%", y: "-50%", opacity: 0.9 }
          : { translateX: "-50%", translateY: "-50%", x, y, opacity: o }
      }
    />
  );
}
