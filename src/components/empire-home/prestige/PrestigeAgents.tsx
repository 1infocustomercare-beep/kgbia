import { Bot, CalendarCheck, MessageCircle, Mic, Star, LayoutDashboard, Languages, ShoppingCart, Workflow, Globe, Database, Code2 } from "lucide-react";
import PrestigeAgentStudio from "./PrestigeAgentStudio";

const CAPABILITIES = [
  { icon: Bot, label: "Agenti AI su misura", desc: "Voce, chat e WhatsApp addestrati sui tuoi servizi, prezzi e procedure." },
  { icon: Workflow, label: "Automazioni di processo", desc: "Preventivi, follow-up, documenti e reminder senza lavoro manuale." },
  { icon: Database, label: "Gestionali e software", desc: "Ordini, agenda, clienti e magazzino in un unico strumento su misura." },
  { icon: Code2, label: "Siti, web app e integrazioni", desc: "Interfacce che i clienti usano davvero, collegate ai sistemi già in uso." },
];


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
      className="prestige-section prestige-dark relative py-20 sm:py-28"
    >
      {/* Sfondo statico: nessuna scena 3D (instabile su mobile), solo veli CSS. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(60% 45% at 18% 12%, hsl(var(--pr-emerald) / 0.22), transparent 70%), radial-gradient(50% 40% at 82% 78%, hsl(var(--pr-gold) / 0.14), transparent 72%)",
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "linear-gradient(180deg, hsl(var(--pr-emerald-deep)) 0%, transparent 35%, transparent 65%, hsl(var(--pr-emerald-deep)) 100%)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-6xl px-4 sm:px-5 lg:px-10">
        <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-7">
            <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
              ✦ Agenti AI, automazioni e gestionali
            </div>
            <h2 className="prestige-display mt-4 text-3xl sm:text-5xl lg:text-6xl">
              Costruiamo il sistema che manda avanti la tua azienda{" "}
              <span className="prestige-italic prestige-gold-text">anche quando tu non ci sei.</span>
            </h2>
            <p className="mt-5 max-w-2xl text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
              Non vendiamo pacchetti preconfezionati. Partiamo dai processi che ti rubano tempo e ricavi, poi
              progettiamo ciò che serve al tuo caso: il team di agenti AI, le automazioni, il gestionale, il
              sito o la web app e le integrazioni con gli strumenti che usi già. Un solo partner dalla
              strategia al collaudo, con tempi e risultati dichiarati.
            </p>

            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CAPABILITIES.map((c) => {
                const Icon = c.icon;
                return (
                  <li
                    key={c.label}
                    className="flex items-start gap-3 rounded-2xl p-3.5"
                    style={{
                      background: "hsl(var(--pr-emerald-mid) / 0.5)",
                      border: "1px solid hsl(var(--pr-gold) / 0.18)",
                    }}
                  >
                    <span
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl"
                      style={{
                        background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
                        color: "hsl(var(--pr-emerald-deep))",
                      }}
                    >
                      <Icon size={18} />
                    </span>
                    <span className="min-w-0">
                      <span className="block text-sm font-semibold text-white">{c.label}</span>
                      <span className="mt-0.5 block text-xs leading-relaxed" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
                        {c.desc}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* CONFIGURATORE INTERATTIVO — sostituisce la scena 3D instabile */}
          <div className="lg:col-span-5">
            <PrestigeAgentStudio />
          </div>
        </div>


        <div className="mt-12">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Moduli combinabili — alcuni esempi
          </div>
          <p className="mt-2 max-w-2xl text-sm" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            Ogni progetto nasce combinando solo i moduli utili al tuo obiettivo: nulla di superfluo, nessun
            costo per funzioni che non useresti.
          </p>
        </div>

        <div className="prestige-agents-marquee mt-5">
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
