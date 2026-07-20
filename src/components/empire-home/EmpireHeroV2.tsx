import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { createMockupPool } from "@/lib/mockup-pool";
import OfficialEmpireHomeAlias from "@/components/empire-home/OfficialEmpireHomeAlias";

/**
 * Empire Hero V2 — primo schermo IMMEDIATO, d'impatto, senza WebGL.
 * - Typography enorme con gradient
 * - 3 mockup iPhone reali fluttuanti (parallax mouse)
 * - 2 CTA chiari (no claim falsi)
 * - Funziona perfettamente su mobile 375px
 */
const heroPool = createMockupPool();
const HERO_IMGS = heroPool.images(3);

export default function EmpireHeroV2() {
  return <OfficialEmpireHomeAlias />;

  const wrapRef = useRef<HTMLDivElement>(null);
  const phonesRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const phones = phonesRef.current;
    if (!phones) return;
    let raf = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        phones.style.transform = `translate3d(${x * -10}px, ${y * -10}px, 0)`;
      });
    };
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section
      ref={wrapRef}
      id="hero-v2"
      className="relative isolate flex min-h-[100svh] w-full flex-col items-center justify-center overflow-hidden bg-[#05070d] px-4 pt-20 pb-10 text-white sm:px-6"
    >
      {/* Aurora background — pure CSS, niente WebGL */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div
          className="absolute -left-1/4 top-0 h-[80vh] w-[80vh] rounded-full blur-[120px] opacity-60"
          style={{ background: "radial-gradient(circle, #22d3ee 0%, transparent 60%)" }}
        />
        <div
          className="absolute -right-1/4 bottom-0 h-[80vh] w-[80vh] rounded-full blur-[120px] opacity-50"
          style={{ background: "radial-gradient(circle, #a78bfa 0%, transparent 60%)" }}
        />
        <div
          className="absolute left-1/2 top-1/3 h-[40vh] w-[40vh] -translate-x-1/2 rounded-full blur-[100px] opacity-40"
          style={{ background: "radial-gradient(circle, #ec4899 0%, transparent 60%)" }}
        />
        {/* grid */}
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
            maskImage: "radial-gradient(ellipse 80% 60% at 50% 50%, black 30%, transparent 80%)",
          }}
        />
      </div>

      {/* Eyebrow */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 mb-5 flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-[11px] uppercase tracking-[0.25em] text-white/80 backdrop-blur"
      >
        <Sparkles className="h-3.5 w-3.5 text-cyan-300" />
        Empire AI · Sistema Operativo per Aziende
      </motion.div>

      {/* Headline */}
      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.1 }}
        className="relative z-10 max-w-5xl text-center text-[44px] font-black leading-[0.95] tracking-tight sm:text-7xl md:text-8xl"
      >
        <span className="block bg-gradient-to-br from-white via-white to-white/60 bg-clip-text text-transparent">
          La tua azienda
        </span>
        <span
          className="mt-1 block bg-gradient-to-r from-cyan-300 via-fuchsia-300 to-amber-200 bg-clip-text text-transparent"
          style={{ filter: "drop-shadow(0 0 30px rgba(34,211,238,0.35))" }}
        >
          su pilota automatico.
        </span>
      </motion.h1>

      {/* Sub */}
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, delay: 0.25 }}
        className="relative z-10 mt-6 max-w-2xl text-center text-base text-white/75 sm:text-lg md:text-xl"
      >
        WhatsApp, telefonate, prenotazioni e pagamenti gestiti dall'AI 24/7.
        <span className="block text-white/50">
          Per ristoranti, NCC, beauty, fitness e altri 25+ settori.
        </span>
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="relative z-10 mt-8 flex w-full max-w-md flex-col gap-3 sm:max-w-none sm:flex-row sm:justify-center"
      >
        <button
          onClick={() => navigate("/auth")}
          className="group inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-white px-7 text-sm font-bold text-black transition hover:scale-[1.02] hover:shadow-[0_20px_60px_-10px_rgba(255,255,255,0.4)] sm:text-base"
        >
          Inizia ora
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
        <button
          onClick={() => navigate("/join")}
          className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-white/20 bg-white/5 px-7 text-sm font-semibold text-white backdrop-blur transition hover:border-white/40 hover:bg-white/10 sm:text-base"
        >
          Diventa Partner
        </button>
      </motion.div>

      {/* Mockups iPhone reali */}
      <motion.div
        ref={phonesRef}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, delay: 0.55 }}
        className="relative z-10 mt-12 flex items-end justify-center gap-3 sm:gap-6 transition-transform duration-300 ease-out"
        style={{ perspective: "1200px" }}
      >
        {HERO_IMGS.map((src, i) => {
          const isCenter = i === 1;
          const rot = i === 0 ? -8 : i === 2 ? 8 : 0;
          const ty = isCenter ? -20 : 0;
          return (
            <div
              key={src + i}
              className="relative shrink-0 overflow-hidden rounded-[26px] border border-white/15 bg-black shadow-[0_30px_80px_-20px_rgba(0,0,0,0.8)]"
              style={{
                width: isCenter ? 160 : 130,
                height: isCenter ? 340 : 280,
                transform: `rotate(${rot}deg) translateY(${ty}px)`,
              }}
            >
              <img
                src={src}
                alt={`Empire mockup ${i + 1}`}
                loading="eager"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              {/* notch */}
              <div className="absolute left-1/2 top-1.5 h-1.5 w-12 -translate-x-1/2 rounded-full bg-black/80" />
            </div>
          );
        })}
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative z-10 mt-10 flex flex-col items-center gap-1 text-[10px] uppercase tracking-[0.4em] text-white/80"
      >
        <span>Scopri come</span>
        <span className="h-8 w-px animate-pulse bg-gradient-to-b from-white/40 to-transparent" />
      </motion.div>
    </section>
  );
}
