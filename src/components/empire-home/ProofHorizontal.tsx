import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROOF = [
  { k: "847+", l: "Imprese automatizzate", c: "#7eb7be" },
  { k: "98", l: "Agenti IA proprietari", c: "#a78bfa" },
  { k: "25+", l: "Settori dominati", c: "#ec4899" },
  { k: "94%", l: "Riduzione errori", c: "#f59e0b" },
  { k: "8s", l: "Risposta media AI", c: "#22d3ee" },
  { k: "∞", l: "Scalabilità infinita", c: "#84cc16" },
];

const QUOTES = [
  { q: "In 90 giorni abbiamo eliminato 4 figure operative. ROI 380%.", a: "Marco D. — CEO Logistica" },
  { q: "Empire ha sincronizzato 7 software in 1. Adesso decido, non gestisco.", a: "Sofia R. — Founder Beauty Chain" },
  { q: "L'agente vocale chiude appuntamenti mentre dormo. Letteralmente.", a: "Luca B. — Studio Medico" },
];

/**
 * PROOF & DOMINIO — pinned section con horizontal scroll cinematografico.
 */
export default function ProofHorizontal() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current; const tr = track.current;
    if (!el || !tr) return;

    const ctx = gsap.context(() => {
      const getDist = () => Math.max(0, tr.scrollWidth - window.innerWidth);

      const horizontalTween = gsap.to(tr, {
        x: () => -getDist(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${getDist() + window.innerHeight}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
          anticipatePin: 1,
        },
      });

      // Reveal cards as they enter viewport horizontally — usa il tween come container
      const cards = tr.querySelectorAll<HTMLElement>("[data-proof-card]");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          scale: 0.88,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: {
            trigger: card,
            containerAnimation: horizontalTween,
            start: "left 95%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, root);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 60% 100% at 100% 50%, rgba(167,139,250,0.18), transparent 70%), linear-gradient(180deg, #050505, #08081a)",
      }} />

      <div className="absolute left-5 top-8 z-20 sm:left-10 sm:top-12">
        <div className="text-[11px] font-bold uppercase tracking-[3px] text-[#7eb7be]">Proof · Dominio del mercato</div>
        <div className="mt-2 font-heading text-2xl font-black uppercase tracking-tight text-white sm:text-4xl">Numeri non discutibili.</div>
      </div>

      <div className="absolute right-5 top-8 z-20 hidden text-right sm:right-10 sm:top-12 sm:block">
        <div className="text-[10px] font-mono tracking-[3px] text-white/40">SCROLL →</div>
      </div>

      <div ref={track} className="absolute inset-0 flex h-full items-center gap-6 pl-5 pr-[10vw] will-change-transform sm:gap-10 sm:pl-10">
        {PROOF.map((p, i) => (
          <div
            key={i}
            data-proof-card
            className="relative flex h-[60vh] min-w-[78vw] flex-col justify-end overflow-hidden rounded-[2rem] border border-white/10 p-7 sm:min-w-[44vw] sm:p-10"
            style={{ background: `linear-gradient(160deg, ${p.c}1a 0%, transparent 60%), rgba(255,255,255,0.02)` }}
          >
            <div className="absolute right-6 top-6 h-3 w-3 rounded-full" style={{ background: p.c, boxShadow: `0 0 24px ${p.c}` }} />
            <div className="font-mono text-[10px] tracking-[3px] text-white/30">{String(i + 1).padStart(2, "0")} / {PROOF.length}</div>
            <div className="mt-2 font-heading font-black leading-none tracking-[-0.05em] text-white" style={{ fontSize: "clamp(4.5rem, 14vw, 12rem)" }}>
              {p.k}
            </div>
            <div className="mt-3 text-sm font-semibold uppercase tracking-[3px] text-white/65">{p.l}</div>
          </div>
        ))}

        {QUOTES.map((q, i) => (
          <blockquote
            key={`q${i}`}
            data-proof-card
            className="relative flex h-[55vh] min-w-[82vw] flex-col justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-8 backdrop-blur-md sm:min-w-[44vw] sm:p-12"
          >
            <div className="font-heading text-6xl text-[#7eb7be]/40">"</div>
            <p className="font-heading text-xl leading-snug text-white sm:text-3xl">{q.q}</p>
            <footer className="mt-6 text-xs uppercase tracking-[3px] text-white/50">— {q.a}</footer>
          </blockquote>
        ))}

        <div className="min-w-[15vw]" />
      </div>
    </section>
  );
}
