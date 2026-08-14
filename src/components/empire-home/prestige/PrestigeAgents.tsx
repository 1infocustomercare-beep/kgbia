import { Bot, CalendarCheck, MessageCircle, Mic, Star, LayoutDashboard, Languages, ShoppingCart } from "lucide-react";
import { SplineScene } from "@/components/ui/spline-scene";

const AGENTS = [
  { icon: Bot, name: "Sales AI", desc: "Qualifica lead, risponde ai preventivi e chiude la trattativa in chat." },
  { icon: CalendarCheck, name: "Booking AI", desc: "Prenotazioni 24/7 con conferma, reminder e recupero no-show." },
  { icon: MessageCircle, name: "WhatsApp AI", desc: "Gestisce ordini, richieste e assistenza sul canale che i clienti già usano." },
  { icon: Mic, name: "Voice AI", desc: "Risponde al telefono con voce naturale, prende note e passa in agenda." },
  { icon: Star, name: "Review Booster", desc: "Invita i clienti soddisfatti a lasciare recensioni e intercetta quelle negative." },
  { icon: LayoutDashboard, name: "Dashboard Live", desc: "Vendite, agenda e KPI in un'unica schermata leggibile su mobile." },
  { icon: Languages, name: "Multi-lingua", desc: "Assiste clienti stranieri in italiano, inglese, francese, tedesco, arabo." },
  { icon: ShoppingCart, name: "Upsell AI", desc: "Suggerisce prodotti extra al momento giusto e aumenta lo scontrino medio." },
];

// Duplicate for seamless marquee
const LOOP = [...AGENTS, ...AGENTS];

export default function PrestigeAgents() {
  return (
    <section
      id="agents"
      data-section="prestige-agents"
      className="prestige-section prestige-dark py-20 sm:py-28"
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="max-w-2xl">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Gli agenti AI
          </div>
          <h2 className="prestige-display mt-4 text-3xl sm:text-5xl lg:text-6xl">
            Otto agenti.{" "}
            <span className="prestige-italic prestige-gold-text">Un solo team che non dorme mai.</span>
          </h2>
          <p className="mt-5 text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            Non un chatbot generico: ogni agente è addestrato sul tuo settore, con il tuo tono di voce
            e i tuoi processi. Attivi solo quelli che ti servono davvero.
          </p>
        </div>

        <div className="prestige-agents-marquee mt-12">
          <div className="prestige-agents-track">
            {LOOP.map((a, i) => {
              const Icon = a.icon;
              return (
                <article key={i} className="prestige-agents-card group" aria-label={a.name}>
                  <div
                    className="flex h-11 w-11 items-center justify-center rounded-xl shrink-0"
                    style={{
                      background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
                      color: "hsl(var(--pr-emerald-deep))",
                    }}
                  >
                    <Icon size={22} />
                  </div>
                  <h3 className="prestige-display mt-4 text-xl">{a.name}</h3>
                  <p
                    className="mt-2 text-sm leading-relaxed"
                    style={{ color: "hsl(var(--pr-muted-on-dark))" }}
                  >
                    {a.desc}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </div>

      <style>{`
        .prestige-agents-marquee {
          position: relative;
          overflow: hidden;
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .prestige-agents-track {
          display: flex;
          gap: 1rem;
          width: max-content;
          animation: prestige-agents-scroll 55s linear infinite;
          will-change: transform;
        }
        .prestige-agents-marquee:hover .prestige-agents-track { animation-play-state: paused; }
        .prestige-agents-card {
          flex: 0 0 260px;
          border-radius: 20px;
          padding: 1.25rem;
          background: hsl(var(--pr-emerald-mid) / 0.55);
          border: 1px solid hsl(var(--pr-gold) / 0.2);
          transition: transform .35s cubic-bezier(.22,1,.36,1), border-color .3s, box-shadow .3s;
          transform-style: preserve-3d;
        }
        .prestige-agents-card:hover {
          transform: translateY(-4px) rotateX(4deg) rotateY(-3deg);
          border-color: hsl(var(--pr-gold) / 0.55);
          box-shadow: 0 20px 50px -18px hsl(var(--pr-gold) / 0.35);
        }
        @keyframes prestige-agents-scroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .prestige-agents-track { animation: none !important; flex-wrap: wrap; width: 100%; }
          .prestige-agents-card { flex: 1 1 260px; }
        }
      `}</style>
    </section>
  );
}
