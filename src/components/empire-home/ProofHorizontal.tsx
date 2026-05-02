import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const PROOF = [
  { k: "+38%", l: "Fatturato medio cliente", c: "#22d3ee" },
  { k: "7gg", l: "Setup completo", c: "#a78bfa" },
  { k: "25+", l: "Settori coperti", c: "#ec4899" },
  { k: "−70%", l: "Tempo su attività manuali", c: "#f59e0b" },
  { k: "24/7", l: "Customer care AI", c: "#22d3ee" },
  { k: "90gg", l: "Garanzia soddisfatto", c: "#84cc16" },
];

const QUOTES = [
  { q: "In 90 giorni abbiamo recuperato 30 ore a settimana e aumentato le prenotazioni del 42%.", a: "Marco D. — Ristorante, Milano" },
  { q: "Sito, CRM, WhatsApp e cassa: prima erano 6 strumenti, ora uno solo. E funziona meglio.", a: "Sofia R. — Catena Beauty, 4 sedi" },
  { q: "L'agente vocale risponde di notte e ai weekend: appuntamenti +60% senza assumere nessuno.", a: "Luca B. — Studio Medico, Roma" },
];

export default function ProofHorizontal() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current; const tr = track.current;
    if (!el || !tr) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    const ctx = gsap.context(() => {
      const getDist = () => Math.max(0, tr.scrollWidth - window.innerWidth);

      if (isMobile) {
        const cards = tr.querySelectorAll<HTMLElement>("[data-proof-card]");
        cards.forEach((card) => {
          gsap.from(card, {
            y: 44,
            opacity: 0,
            scale: 0.94,
            duration: 0.8,
            ease: "expo.out",
            scrollTrigger: { trigger: card, start: "top 88%" },
          });
        });
        return;
      }

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

      const cards = tr.querySelectorAll<HTMLElement>("[data-proof-card]");
      cards.forEach((card) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.9,
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
    }, el);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden py-24 sm:h-screen sm:py-0">
      <div className="pointer-events-none absolute inset-0 z-0" style={{
        background: "radial-gradient(ellipse 60% 100% at 100% 50%, rgba(167,139,250,0.18), transparent 70%), linear-gradient(180deg, #050505, #08081a)",
      }} />

      <div className="relative left-auto top-auto z-20 px-4 sm:absolute sm:left-10 sm:top-12 sm:px-0">
        <div className="text-[10px] font-bold uppercase tracking-[3px] text-[#22d3ee] sm:text-[11px]">07 · I numeri parlano</div>
        <div className="mt-2 font-heading text-xl font-black uppercase tracking-tight text-white sm:text-4xl">Risultati reali, clienti reali.</div>
      </div>

      <div className="absolute right-4 top-6 z-20 hidden text-right sm:block sm:right-10 sm:top-12">
        <div className="text-[9px] font-mono tracking-[3px] text-white/40 sm:text-[10px]">SCROLL →</div>
      </div>

      <div ref={track} className="relative mt-10 flex h-auto flex-col gap-4 px-4 will-change-transform sm:absolute sm:inset-0 sm:mt-0 sm:h-full sm:flex-row sm:items-center sm:gap-10 sm:pl-10 sm:pr-[10vw]">
        {PROOF.map((p, i) => (
          <div
            key={i}
            data-proof-card
            className="relative flex min-h-[220px] w-full flex-col justify-end overflow-hidden rounded-[1.5rem] border border-white/10 p-6 sm:h-[60vh] sm:min-w-[44vw] sm:rounded-[2rem] sm:p-10"
            style={{ background: `linear-gradient(160deg, ${p.c}1a 0%, transparent 60%), rgba(255,255,255,0.02)` }}
          >
            <div className="absolute right-5 top-5 h-3 w-3 rounded-full sm:right-6 sm:top-6" style={{ background: p.c, boxShadow: `0 0 24px ${p.c}` }} />
            <div className="font-mono text-[10px] tracking-[3px] text-white/30">{String(i + 1).padStart(2, "0")} / {PROOF.length}</div>
            <div className="mt-2 font-heading font-black leading-none tracking-[-0.05em] text-white" style={{ fontSize: "clamp(3.5rem, 14vw, 12rem)" }}>
              {p.k}
            </div>
            <div className="mt-3 text-[11px] font-semibold uppercase tracking-[3px] text-white/65 sm:text-sm">{p.l}</div>
          </div>
        ))}

        {QUOTES.map((q, i) => (
          <blockquote
            key={`q${i}`}
            data-proof-card
            className="relative flex min-h-[240px] w-full flex-col justify-center rounded-[1.5rem] border border-white/10 bg-gradient-to-br from-white/[0.06] to-white/[0.01] p-7 shadow-[0_26px_70px_rgba(0,0,0,0.25)] sm:h-[55vh] sm:min-w-[44vw] sm:rounded-[2rem] sm:p-12"
          >
            <div className="font-heading text-5xl text-[#22d3ee]/40 sm:text-6xl">"</div>
            <p className="font-heading text-lg leading-snug text-white sm:text-3xl">{q.q}</p>
            <footer className="mt-5 text-[10px] uppercase tracking-[3px] text-white/50 sm:mt-6 sm:text-xs">— {q.a}</footer>
          </blockquote>
        ))}

        <div className="hidden min-w-[15vw] sm:block" />
      </div>
    </section>
  );
}
