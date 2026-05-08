import { useEffect, useRef, useState } from "react";
import { useEmpireScrollDirector } from "../ScrollDirector";
import { UtensilsCrossed, Car, Scissors, Dumbbell, Hotel, Briefcase, Check } from "lucide-react";

const INDUSTRIES = [
  {
    id: "food",
    icon: UtensilsCrossed,
    name: "Ristoranti & Pizzerie",
    pitch: "Il telefono squilla mentre stai impastando. WhatsApp esplode al sabato sera. Le recensioni vanno gestite. Empire fa tutto al posto tuo.",
    wins: [
      "Ordini WhatsApp gestiti dall'AI, anche durante il servizio",
      "Prenotazioni tavoli automatiche con conferma e reminder",
      "Menu sempre aggiornato su Google, social e app",
      "Recensioni a cui rispondi con un click",
    ],
  },
  {
    id: "ncc",
    icon: Car,
    name: "NCC & Trasporti Luxury",
    pitch: "Centralino che non perde mai una corsa. Preventivi istantanei, pagamenti immediati, autisti coordinati in real-time.",
    wins: [
      "Centralino AI che risponde in italiano, inglese, arabo",
      "Preventivi automatici via WhatsApp in 10 secondi",
      "App autisti con corse, pagamenti e fatture",
      "Dashboard flotta con guadagni in tempo reale",
    ],
  },
  {
    id: "beauty",
    icon: Scissors,
    name: "Beauty, Estetica & Parrucchieri",
    pitch: "Agenda sempre piena, niente più no-show. Le clienti prenotano da WhatsApp anche di notte e ricevono reminder automatici.",
    wins: [
      "Agenda online sincronizzata con Google Calendar",
      "Reminder automatici 24h prima dell'appuntamento",
      "Cataloghi trattamenti con prezzi e foto",
      "Programma fedeltà con punti e premi",
    ],
  },
  {
    id: "fitness",
    icon: Dumbbell,
    name: "Palestre & Personal Trainer",
    pitch: "Onboarding nuovi membri 100% automatico, dalla prima chat al primo allenamento. Niente più moduli da compilare a mano.",
    wins: [
      "Iscrizioni online con firma digitale e pagamento",
      "Schede allenamento personalizzate dall'AI",
      "Prenotazione corsi con lista d'attesa intelligente",
      "Rinnovi abbonamenti automatici via Stripe",
    ],
  },
  {
    id: "hotel",
    icon: Hotel,
    name: "Hotel & B&B",
    pitch: "Concierge AI multilingua che risponde 24/7, gestisce check-in, suggerisce attività e aumenta i ricavi extra del 30%.",
    wins: [
      "Concierge AI in 12 lingue, sempre disponibile",
      "Check-in digitale e card stanza via smartphone",
      "Upselling automatico (colazione, spa, transfer)",
      "Recensioni gestite su Booking, Airbnb, Google",
    ],
  },
  {
    id: "pro",
    icon: Briefcase,
    name: "Studi Professionali",
    pitch: "Avvocati, commercialisti, consulenti: l'AI filtra le richieste, prenota appuntamenti e gestisce la prima consulenza.",
    wins: [
      "Filtro intelligente delle richieste in entrata",
      "Appuntamenti con video-call e link di pagamento",
      "Documenti raccolti via portale sicuro",
      "Fatturazione elettronica integrata",
    ],
  },
];

export default function PrestigeIndustries() {
  const userTouchedRef = useRef(false);
  const { ref, step } = useEmpireScrollDirector<HTMLDivElement>("prestige-industries", {
    steps: INDUSTRIES.length,
  });
  const [active, setActive] = useState("food");

  // Auto-cycle in base allo step di scroll, finché l'utente non clicca un tab.
  useEffect(() => {
    if (userTouchedRef.current) return;
    const id = INDUSTRIES[Math.min(step, INDUSTRIES.length - 1)]?.id;
    if (id) setActive(id);
  }, [step]);

  const handleTab = (id: string) => {
    userTouchedRef.current = true;
    setActive(id);
  };

  const current = INDUSTRIES.find((i) => i.id === active)!;
  const Icon = current.icon;

  return (
    <section
      ref={ref}
      data-section="prestige-industries"
      className="prestige-section prestige-dark py-24 sm:py-32"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-10">
        <div className="text-center">
          <div className="prestige-eyebrow" style={{ color: "hsl(var(--pr-gold-light))" }}>
            ✦ Il caso tuo
          </div>
          <h2 className="prestige-display mt-4 text-4xl font-semibold sm:text-5xl md:text-6xl">
            Empire parla la lingua del{" "}
            <span className="prestige-gold-text italic">tuo settore</span>
          </h2>
          <div className="prestige-divider mx-auto mt-5" />
          <p className="mx-auto mt-5 max-w-2xl text-base sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
            Tocca il tuo settore qui sotto e ti mostriamo esattamente come Empire risolve i problemi della
            tua giornata-tipo.
          </p>
        </div>

        {/* Tabs */}
        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {INDUSTRIES.map((i) => {
            const TabIcon = i.icon;
            const isActive = i.id === active;
            return (
              <button
                key={i.id}
                onClick={() => handleTab(i.id)}
                className="flex items-center gap-2 rounded-full px-4 py-2.5 text-xs font-semibold transition-all sm:text-sm"
                style={{
                  background: isActive
                    ? "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))"
                    : "hsl(var(--pr-emerald-mid) / 0.55)",
                  color: isActive ? "hsl(var(--pr-emerald-deep))" : "hsl(var(--pr-text-on-dark))",
                  border: `1px solid ${isActive ? "transparent" : "hsl(var(--pr-gold) / 0.18)"}`,
                  boxShadow: isActive ? "0 10px 30px -8px hsl(var(--pr-gold) / 0.5)" : "none",
                }}
              >
                <TabIcon size={14} />
                {i.name}
              </button>
            );
          })}
        </div>

        {/* Active panel */}
        <div
          key={current.id}
          className="prestige-card mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[auto_1fr] lg:items-start"
          style={{ animation: "prestigeFadeIn .6s ease-out" }}
        >
          <div
            className="flex h-20 w-20 items-center justify-center rounded-2xl"
            style={{
              background: "linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)))",
              color: "hsl(var(--pr-emerald-deep))",
              boxShadow: "0 16px 40px -12px hsl(var(--pr-gold) / 0.5)",
            }}
          >
            <Icon size={36} />
          </div>
          <div>
            <h3 className="prestige-display text-2xl sm:text-3xl md:text-4xl">{current.name}</h3>
            <p className="mt-3 max-w-2xl text-base leading-relaxed sm:text-lg" style={{ color: "hsl(var(--pr-muted-on-dark))" }}>
              {current.pitch}
            </p>
            <ul className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {current.wins.map((w) => (
                <li key={w} className="flex items-start gap-3 text-sm sm:text-base">
                  <span
                    className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full"
                    style={{ background: "hsl(var(--pr-gold) / 0.2)", color: "hsl(var(--pr-gold-light))" }}
                  >
                    <Check size={13} strokeWidth={3} />
                  </span>
                  <span style={{ color: "hsl(var(--pr-text-on-dark))" }}>{w}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes prestigeFadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </section>
  );
}
