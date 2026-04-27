import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const SERVICES = [
  { tag: "01", title: "Sincronizzazione Operativa", desc: "Ogni reparto allineato in tempo reale. Zero email, zero call inutili.", color: "#22d3ee" },
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
    const ctx = gsap.context((self) => {
      const q = self.selector!;
      const cards = q("[data-svc-card]") as HTMLElement[];
      cards.forEach((card, i) => {
        gsap.from(card, {
          y: 80,
          opacity: 0,
          scale: 0.92,
          duration: 1,
          ease: "expo.out",
          scrollTrigger: { trigger: card, start: "top 88%" },
          delay: (i % 3) * 0.05,
        });
      });

      const titleEl = q("[data-eco-title]")[0];
      if (titleEl) {
        gsap.from(q("[data-eco-title] .word"), {
          y: 100,
          opacity: 0,
          duration: 1.1,
          stagger: 0.08,
          ease: "expo.out",
          scrollTrigger: { trigger: titleEl, start: "top 85%" },
        });
      }
    }, root);
    return () => ctx.revert();
  }, []);

  return (
    <section ref={root} id="ecosistema" className="relative px-4 py-24 sm:px-5 sm:py-32">
      <div className="mx-auto max-w-[1280px]">
        <div className="mb-14 text-center sm:mb-16">
          <div className="mb-4 inline-block text-[11px] font-bold uppercase tracking-[3px] text-[#22d3ee]">Ecosistema · 06 protocolli</div>
          <h2 data-eco-title className="font-heading text-[clamp(2.2rem,6vw,5rem)] font-black uppercase leading-[0.95] tracking-[-0.04em] text-white">
            <span className="inline-block overflow-hidden"><span className="word inline-block">Domina</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="word inline-block">ogni</span></span>{" "}
            <span className="inline-block overflow-hidden"><span className="word inline-block bg-gradient-to-r from-[#22d3ee] via-[#a78bfa] to-[#ec4899] bg-clip-text text-transparent">vettore.</span></span>
          </h2>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <article
              key={s.tag}
              data-svc-card
              className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:border-white/30 hover:bg-white/[0.05] sm:p-7"
              style={{ boxShadow: "0 20px 60px -30px rgba(0,0,0,0.8)" }}
              onMouseMove={(e) => {
                const r = e.currentTarget.getBoundingClientRect();
                e.currentTarget.style.setProperty("--mx", `${e.clientX - r.left}px`);
                e.currentTarget.style.setProperty("--my", `${e.clientY - r.top}px`);
              }}
            >
              <div
                className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-500 group-hover:opacity-100"
                style={{ background: `radial-gradient(400px circle at var(--mx,50%) var(--my,50%), ${s.color}26, transparent 60%)` }}
              />
              <div className="relative z-10">
                <div className="mb-5 flex items-center justify-between sm:mb-6">
                  <span className="font-mono text-xs tracking-[3px] text-white/40">{s.tag}</span>
                  <span className="h-2 w-2 rounded-full" style={{ background: s.color, boxShadow: `0 0 18px ${s.color}` }} />
                </div>
                <h3 className="font-heading text-xl font-bold leading-tight text-white sm:text-2xl">{s.title}</h3>
                <p className="mt-3 text-[13px] leading-[1.7] text-white/60 sm:text-[14px]">{s.desc}</p>
                <div className="mt-6 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[2px] text-white/40 transition-colors group-hover:text-white sm:mt-8">
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
