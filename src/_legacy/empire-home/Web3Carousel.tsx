import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

/**
 * WEB3 CAROUSEL — pin orizzontale con card glassmorphism iridescenti.
 * Ispirato a motionsites.ai "Web3 Carousel": le card scorrono lateralmente
 * mentre l'utente scrolla in verticale, con tilt 3D e bordi iridescenti.
 */
const SLIDES = [
  {
    n: "01",
    h: "Online in 7 giorni",
    p: "Setup, design, integrazioni e training degli agenti AI. Vai live in una settimana, non in 6 mesi.",
    grad: "from-[#22d3ee] to-[#3b82f6]",
  },
  {
    n: "02",
    h: "AI cucita su di te",
    p: "Non un chatbot generico: ogni agente impara il tuo settore, il tuo tono e i tuoi processi reali.",
    grad: "from-[#a78bfa] to-[#ec4899]",
  },
  {
    n: "03",
    h: "Risultati misurabili",
    p: "Dashboard in tempo reale: lead, prenotazioni, fatturato e ROI per ogni agente. Niente fumo.",
    grad: "from-[#4ade80] to-[#22d3ee]",
  },
  {
    n: "04",
    h: "Tutti i canali, una voce",
    p: "Sito, WhatsApp, Instagram, email, telefono: i tuoi clienti ricevono la stessa esperienza ovunque.",
    grad: "from-[#fbbf24] to-[#ec4899]",
  },
  {
    n: "05",
    h: "Conforme GDPR",
    p: "Dati ospitati in UE, crittografia end-to-end, audit log completo. Sicurezza enterprise di serie.",
    grad: "from-[#22d3ee] to-[#a78bfa]",
  },
  {
    n: "06",
    h: "Cresci senza freni",
    p: "Da una sede a cento. Stessa qualità, stesso brand, zero costi extra di gestione.",
    grad: "from-[#ec4899] to-[#a78bfa]",
  },
];

export default function Web3Carousel() {
  const root = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    const tr = track.current;
    if (!el || !tr) return;
    const isMobile = window.matchMedia("(max-width: 767px)").matches;
    const ctx = gsap.context(() => {
      // calcola la distanza in px da scorrere
      const getDistance = () => Math.max(1, tr.scrollWidth - window.innerWidth + 64);
      const cards = gsap.utils.toArray<HTMLElement>("[data-w3card]", el);

      gsap.set(cards, { opacity: 1, rotateY: 0, transformOrigin: "50% 50%" });

      gsap.from(cards, {
        y: 54,
        rotateY: 18,
        opacity: 0,
        duration: 0.85,
        ease: "power3.out",
        stagger: 0.08,
        scrollTrigger: {
          trigger: el,
          start: "top 78%",
          once: true,
        },
      });

      if (isMobile) return;

      gsap.to(cards, {
        rotateY: (i) => (i % 2 === 0 ? -8 : 8),
        z: (i) => (i % 2 === 0 ? 24 : -18),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
        },
      });

      gsap.to(tr, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: el,
          start: "top top",
          end: () => `+=${getDistance()}`,
          scrub: 1,
          pin: false,
          invalidateOnRefresh: true,
        },
      });
    }, el);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} className="relative overflow-hidden bg-[#050813] py-20 sm:h-screen sm:py-0">
      <div className="absolute inset-0 -z-10" style={{
        background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(34,211,238,0.08), transparent 60%)",
      }} />

      <div className="relative z-10 px-4 sm:px-8 sm:pt-16">
        <div className="text-[10px] font-bold uppercase tracking-[4px] text-[#22d3ee] sm:text-[11px]">
          06 · PERCHÉ EMPIRE
        </div>
        <h2 className="mt-2 font-heading font-black uppercase leading-[0.9] tracking-[-0.04em] text-white" style={{ fontSize: "clamp(1.8rem,5.5vw,4rem)" }}>
          Sei motivi, <span className="bg-gradient-to-r from-[#22d3ee] to-[#a78bfa] bg-clip-text text-transparent">zero compromessi.</span>
        </h2>
      </div>

      <div className="relative mt-8 flex items-center overflow-x-auto pb-6 [-webkit-overflow-scrolling:touch] sm:absolute sm:inset-0 sm:mt-0 sm:overflow-visible sm:pb-0" style={{ perspective: "1400px" }}>
        <div
          ref={track}
          className="flex items-center gap-4 pl-4 pr-6 sm:gap-8 sm:pl-8 sm:pr-16"
          style={{ transformStyle: "preserve-3d" }}
        >
          {SLIDES.map((s, i) => (
            <article
              key={i}
              data-w3card
              className="relative shrink-0 overflow-hidden rounded-[28px] border border-white/15 bg-white/[0.04] p-7 backdrop-blur-2xl sm:p-10"
              style={{
                width: "min(82vw, 460px)",
                aspectRatio: "3/4",
                boxShadow: "0 30px 80px -20px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.08)",
              }}
            >
              {/* bordo iridescente */}
              <div className={`pointer-events-none absolute -inset-px rounded-[28px] bg-gradient-to-br ${s.grad} opacity-30`}
                style={{ mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)", WebkitMaskComposite: "xor" as any, maskComposite: "exclude", padding: "1px" }}
              />
              <div className={`pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full bg-gradient-to-br ${s.grad} opacity-30 blur-3xl`} />

              <div className="relative flex h-full flex-col justify-between">
                <div>
                  <div className={`inline-block bg-gradient-to-r ${s.grad} bg-clip-text font-heading text-5xl font-black text-transparent sm:text-7xl`}>
                    {s.n}
                  </div>
                  <h3 className="mt-6 font-heading text-2xl font-black leading-[1.05] text-white sm:text-4xl">
                    {s.h}
                  </h3>
                  <p className="mt-4 text-[14px] leading-[1.7] text-white/70 sm:text-[16px]">
                    {s.p}
                  </p>
                </div>
                <div className="flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-[10px] uppercase tracking-[3px] text-white/45">
                    Empire · {String(i + 1).padStart(2, "0")} / {String(SLIDES.length).padStart(2, "0")}
                  </span>
                  <div className="flex gap-1">
                    {SLIDES.map((_, k) => (
                      <span key={k} className={`h-1 rounded-full transition-all ${k === i ? "w-6 bg-white" : "w-1 bg-white/30"}`} />
                    ))}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 text-[10px] uppercase tracking-[3px] text-white/45 sm:block">
        ↓ scroll per scorrere
      </div>
    </section>
  );
}
