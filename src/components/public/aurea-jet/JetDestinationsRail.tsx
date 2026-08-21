/**
 * ═══ JET DESTINATIONS RAIL ═══
 * Pinned horizontal gallery on desktop (Ruzza-style film rail), native
 * snap-scroll rail on touch: destinazioni con tempo di volo reale.
 */
import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import wingCoast from "@/assets/aurea-jet/wing-coast.jpg";
import cabinNight from "@/assets/aurea-jet/cabin-night.jpg";
import helicopter from "@/assets/aurea-jet/helicopter.jpg";
import tarmacLimo from "@/assets/aurea-jet/tarmac-limo.jpg";
import fboLounge from "@/assets/aurea-jet/fbo-lounge.jpg";
import { LuxeTag } from "@/components/public/luxe";

const DESTINATIONS = [
  { id: 1, city: "Saint-Tropez", note: "La Môle · 1h 05m da Milano", img: helicopter },
  { id: 2, city: "Costa Amalfitana", note: "Salerno · 1h 15m da Roma", img: wingCoast },
  { id: 3, city: "Courchevel", note: "Altiport 2000m · 1h 20m", img: cabinNight },
  { id: 4, city: "Dubai", note: "Al Maktoum · 6h 00m no-stop", img: tarmacLimo },
  { id: 5, city: "Ibiza", note: "Estate · slot garantiti", img: fboLounge },
];

export default function JetDestinationsRail() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: wrapRef, offset: ["start start", "end end"] });
  const raw = useTransform(scrollYProgress, [0, 1], ["2%", "-72%"]);
  const x = useSpring(raw, { stiffness: 240, damping: 40, mass: 0.2 });

  return (
    <>
      {/* Desktop: pinned horizontal film */}
      <div ref={wrapRef} className="relative hidden h-[320svh] lg:block">
        <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden border-y border-border/50">
          <div className="mb-8 px-16">
            <LuxeTag>Destinazioni</LuxeTag>
            <h2 className="mt-5 max-w-xl font-heading text-5xl font-semibold leading-tight">
              Dove chiedono di andare i nostri clienti.
            </h2>
          </div>
          <motion.div className="flex gap-6 px-16" style={reduced ? undefined : { x }}>
            {DESTINATIONS.map((d) => (
              <article key={d.id} className="relative h-[52svh] w-[36vw] shrink-0 overflow-hidden border border-border/60">
                <img src={d.img} alt={d.city} loading="lazy" width={1600} height={1000} className="h-full w-full object-cover transition-transform duration-700 hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
                <div className="absolute bottom-0 left-0 p-8">
                  <p className="text-[10px] uppercase tracking-[0.3em] text-primary">0{d.id}</p>
                  <h3 className="mt-2 font-heading text-3xl font-semibold">{d.city}</h3>
                  <p className="mt-1 text-sm text-foreground/70">{d.note}</p>
                </div>
              </article>
            ))}
          </motion.div>
          <div className="mt-8 px-16">
            <div className="h-px w-full bg-border/60">
              <motion.div className="h-px origin-left bg-primary" style={{ scaleX: scrollYProgress }} />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile: snap rail */}
      <section className="border-y border-border/50 py-16 lg:hidden">
        <div className="px-5">
          <LuxeTag>Destinazioni</LuxeTag>
          <h2 className="mt-5 font-heading text-3xl font-semibold leading-tight">
            Dove chiedono di andare i nostri clienti.
          </h2>
        </div>
        <div className="mt-8 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {DESTINATIONS.map((d) => (
            <article key={d.id} className="relative h-[46svh] w-[78vw] shrink-0 snap-center overflow-hidden border border-border/60">
              <img src={d.img} alt={d.city} loading="lazy" width={1600} height={1000} className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/10 to-transparent" />
              <div className="absolute bottom-0 left-0 p-6">
                <p className="text-[10px] uppercase tracking-[0.3em] text-primary">0{d.id}</p>
                <h3 className="mt-2 font-heading text-2xl font-semibold">{d.city}</h3>
                <p className="mt-1 text-xs text-foreground/70">{d.note}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </>
  );
}
