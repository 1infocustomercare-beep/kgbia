import { Clock, Globe, Languages, ShieldCheck } from "lucide-react";

/**
 * PrestigeProofBar — fascia di prova onesta, ora in bento tiles (Midnight Indigo).
 * Nessun numero inventato: solo capability claims verificabili.
 */
const ITEMS = [
  { icon: Clock, big: "Setup 7 giorni", label: "Implementazione chiavi in mano" },
  { icon: Globe, big: "24/7", label: "IA sempre attiva, nessuna pausa" },
  { icon: Languages, big: "Multilingua", label: "IT · EN · FR · AR" },
  { icon: ShieldCheck, big: "Made in Italy", label: "Team & hosting in UE" },
] as const;

export default function PrestigeProofBar() {
  return (
    <section
      id="proof"
      data-section="prestige-proof-bar"
      className="prestige-section py-10 sm:py-14"
      style={{ background: "hsl(var(--pr-emerald-deep))" }}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:px-10">
        {ITEMS.map(({ icon: Icon, big, label }) => (
          <div
            key={big}
            className="prestige-bento prestige-card flex items-center gap-4 p-5 sm:p-6"
          >
            <span
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
              style={{
                background: "hsl(var(--pr-gold) / 0.16)",
                borderColor: "hsl(var(--pr-gold) / 0.32)",
                color: "hsl(var(--pr-gold-light))",
              }}
            >
              <Icon size={22} />
            </span>
            <span className="min-w-0">
              <span
                className="prestige-display block text-lg leading-tight sm:text-xl"
                style={{ color: "hsl(var(--pr-text-on-dark))" }}
              >
                {big}
              </span>
              <span
                className="mt-1 block text-[12px] leading-snug"
                style={{ color: "hsl(var(--pr-muted-on-dark) / 0.75)" }}
              >
                {label}
              </span>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
