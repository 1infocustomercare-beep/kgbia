/**
 * PrestigeHeroImmersive — backdrop editoriale della hero.
 *
 * Sostituisce il vecchio warp-tunnel particellare (troppo "gaming", poco
 * professionale) con un layer sobrio e cinematografico:
 *  1. due aure gradient morbide (viola/oro) in respiro lentissimo
 *  2. una griglia tecnica finissima con fade prospettico
 *  3. uno sweep di luce diagonale lento
 *  4. vignette per la leggibilità del testo
 *
 * Solo CSS: nessun canvas, nessun RAF, zero costo su mobile. Rispetta
 * prefers-reduced-motion (le animazioni si fermano, resta la composizione).
 */
export default function PrestigeHeroImmersive() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      {/* 1. aure morbide */}
      <div
        className="absolute -top-1/3 left-1/2 h-[120%] w-[120%] -translate-x-1/2 opacity-70 motion-safe:animate-[prestige-breathe_18s_ease-in-out_infinite]"
        style={{
          background:
            "radial-gradient(ellipse 45% 40% at 50% 42%, hsl(258 70% 58% / 0.22), transparent 70%)",
        }}
      />
      <div
        className="absolute bottom-[-30%] left-[-10%] h-[90%] w-[80%] opacity-60 motion-safe:animate-[prestige-breathe_24s_ease-in-out_infinite_reverse]"
        style={{
          background:
            "radial-gradient(ellipse 50% 50% at 40% 60%, hsl(44 80% 58% / 0.13), transparent 72%)",
        }}
      />

      {/* 2. griglia tecnica con fade */}
      <div
        className="absolute inset-0 opacity-[0.16]"
        style={{
          backgroundImage:
            "linear-gradient(to right, hsl(0 0% 100% / 0.14) 1px, transparent 1px), linear-gradient(to bottom, hsl(0 0% 100% / 0.14) 1px, transparent 1px)",
          backgroundSize: "72px 72px",
          maskImage:
            "radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 82%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 70% 65% at 50% 45%, black 20%, transparent 82%)",
        }}
      />

      {/* 3. sweep di luce diagonale */}
      <div
        className="absolute inset-y-0 -left-1/2 w-1/2 opacity-40 motion-safe:animate-[prestige-sweep_16s_linear_infinite]"
        style={{
          background:
            "linear-gradient(105deg, transparent, hsl(0 0% 100% / 0.05) 45%, transparent)",
        }}
      />

      {/* 4. vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse at 50% 45%, transparent 0%, hsl(250 40% 5% / 0.25) 64%, hsl(250 42% 4% / 0.7) 100%)",
        }}
      />
    </div>
  );
}
