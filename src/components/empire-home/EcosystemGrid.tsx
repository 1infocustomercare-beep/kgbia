import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { tag: "01", title: "Sincronizzazione Operativa", desc: "Ogni reparto allineato in tempo reale. Zero email, zero call inutili.", color: "#7eb7be" },
  { tag: "02", title: "Vendita Algoritmica", desc: "Lead caldi qualificati e chiusi h24 dai nostri agenti vocali e testuali.", color: "#a78bfa" },
  { tag: "03", title: "Marketing Predittivo", desc: "Contenuti, campagne e funnel ottimizzati continuamente dall'AI.", color: "#ec4899" },
  { tag: "04", title: "Customer Care Cyborg", desc: "Risposta in 8 secondi, 7/7, in 32 lingue. Mai un cliente perso.", color: "#f59e0b" },
  { tag: "05", title: "Intelligenza Decisionale", desc: "Cruscotti che predicono il futuro del tuo business con precisione chirurgica.", color: "#22d3ee" },
  { tag: "06", title: "Automazione Assoluta", desc: "Dalla fattura al post Instagram: ogni task ripetitivo eliminato per sempre.", color: "#84cc16" },
];

export default function EcosystemGrid() {
  const root = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = root.current;
    if (!el) return;
    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>("[data-svc-card]").forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          scale: 0.92,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 85%" },
          delay: (i % 3) * 0.05,
        });
      });

      // Title mask reveal
      gsap.from("[data-eco-title] .word", {
        y: 100,
        opacity: 0,
        duration: 1.1,
        stagger: 0.08,
        ease: "expo.out",
        scrollTrigger: { trigger: "[data-eco-title]", start: "top 80%" },
      });
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="ecosistema" className="relative px-5 py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-16 text-center">
          <div className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[3px] text-[#7eb7be]">Ecosistema · 06 protocolli</div>
          <h2 data-eco-title className="font-heading text-[clamp(2.4rem,6vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
            <span className="inline-block overflow-hidden"><span className="word inline-block">Domina</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="word inline-block">ogni</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="word inline-block bg-gradient-to-r from-[#7eb7be] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">vettore.</span></span>
          </h2>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.tag}
              data-svc-card
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-7 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.05]"
              style={{ boxShadow: "0 20px 60px -30px rgba(0,0,0,0.8)" }}
            >
              {/* Hover glow follows cursor */}
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), ${s.color}26, transparent 60%)` }}
                onMouseMove={(e) => {
                  const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                  (e.currentTarget as HTMLElement).style.setProperty("--mx", `${e.clientX - r.left}px`);
                  (e.currentTarget as HTMLElement).style.setProperty("--my", `${e.clientY - r.top}px`);
                }}
              />
              <div className="relative z-10">
                <div className="mb-6 flex items-center justify-between">
                  <span className="font-mono text-xs tracking-[3px] text-white/40">{s.tag}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 18px ${s.color}` }} />
                </div>
                <h3 className="font-heading text-2xl font-bold leading-tight text-white">{s.title}</h3>
                <p className="mt-3 text-[14px] leading-[1.7] text-white/60">{s.desc}</p>
                <div className="mt-8 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[2px] text-white/40 transition-colors group-hover:text-white">
                  <span>Scopri il protocollo</span>
                  <span className="transition-transform group-hover:translate-x-1">→</span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
