/**
 * PrestigeProofBar — fascia di prova onesta.
 * Nessun numero inventato: solo capability claims verificabili.
 */
export default function PrestigeProofBar() {
  const Item = ({ big, label }: { big: string; label: string }) => (
    <div className="flex flex-col items-center gap-1 text-center min-w-0">
      <span
        className="prestige-display text-2xl sm:text-3xl md:text-4xl leading-none"
        style={{ color: "hsl(var(--pr-text-on-light))" }}
      >
        {big}
      </span>
      <span
        className="text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-semibold"
        style={{ color: "hsl(var(--pr-muted-on-light))" }}
      >
        {label}
      </span>
    </div>
  );

  return (
    <section
      id="proof"
      data-section="prestige-proof-bar"
      className="prestige-section prestige-light py-10 sm:py-14 border-y"
      style={{ borderColor: "hsl(var(--pr-gold) / 0.22)" }}
    >
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 sm:grid-cols-4 sm:gap-8 sm:px-8">
        <Item big="7 giorni" label="Setup chiavi in mano" />
        <Item big="24/7" label="IA sempre attiva" />
        <Item big="Multilingua" label="IT · EN · FR · AR" />
        <Item big="Made in Italy" label="Team & hosting UE" />
      </div>
    </section>
  );
}
