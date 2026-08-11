import { useEffect, useRef, useState } from "react";
import { Clock, Globe, Languages, ShieldCheck } from "lucide-react";

/**
 * PrestigeProofBar — fascia di prova onesta, ora in bento tiles (Midnight Indigo).
 * Nessun numero inventato: solo capability claims verificabili.
 *
 * Animazioni: reveal a scaglioni one-shot via IntersectionObserver
 * (nessun listener di scroll, nessun lavoro per frame) e micro-interazioni
 * hover limitate ai puntatori fini. Tutto su transform/opacity → compositing
 * GPU, quindi il costo su mobile resta trascurabile.
 */
const ITEMS = [
  { icon: Clock, big: "Setup 7 giorni", label: "Implementazione chiavi in mano" },
  { icon: Globe, big: "24/7", label: "IA sempre attiva, nessuna pausa" },
  { icon: Languages, big: "Multilingua", label: "IT · EN · FR · AR" },
  { icon: ShieldCheck, big: "Made in Italy", label: "Team & hosting in UE" },
] as const;

export default function PrestigeProofBar() {
  const gridRef = useRef<HTMLDivElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = gridRef.current;
    if (!el || revealed) return;
    if (typeof IntersectionObserver === "undefined") {
      setRevealed(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setRevealed(true);
          io.disconnect();
        }
      },
      { threshold: 0.2, rootMargin: "0px 0px -8% 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [revealed]);

  return (
    <section
      id="proof"
      data-section="prestige-proof-bar"
      className="prestige-section prestige-proofbar py-10 sm:py-14"
      style={{ background: "hsl(var(--pr-emerald-deep))" }}
    >
      <div
        ref={gridRef}
        className={`mx-auto grid max-w-7xl grid-cols-1 gap-4 px-4 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:gap-6 lg:px-10 ${
          revealed ? "is-revealed" : ""
        }`}
      >
        {ITEMS.map(({ icon: Icon, big, label }, i) => (
          <div
            key={big}
            className="prestige-bento prestige-card prestige-proof-tile flex items-center gap-4 p-5 sm:p-6"
            style={{ transitionDelay: `${i * 110}ms` }}
          >
            <span
              className="prestige-proof-icon flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border"
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

      <style>{`
        .prestige-proof-tile {
          opacity: 0;
          transform: translate3d(0, 22px, 0) scale(.985);
          transition:
            opacity .8s cubic-bezier(.16,1,.3,1),
            transform .9s cubic-bezier(.16,1,.3,1),
            border-color .45s ease;
          will-change: transform, opacity;
        }
        .is-revealed .prestige-proof-tile {
          opacity: 1;
          transform: translate3d(0, 0, 0) scale(1);
          will-change: auto;
        }
        .prestige-proof-icon {
          transition: transform .5s cubic-bezier(.16,1,.3,1), box-shadow .5s ease;
        }
        @media (hover: hover) and (pointer: fine) {
          .prestige-proof-tile { transition-property: opacity, transform, border-color, box-shadow; }
          .is-revealed .prestige-proof-tile:hover {
            transform: translate3d(0, -4px, 0);
            box-shadow: 0 30px 70px -40px hsl(var(--pr-gold) / 0.55);
          }
          .is-revealed .prestige-proof-tile:hover .prestige-proof-icon {
            transform: translate3d(0, 0, 0) scale(1.08) rotate(-4deg);
            box-shadow: 0 10px 30px -10px hsl(var(--pr-gold) / 0.6);
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .prestige-proof-tile {
            transition: none !important;
            opacity: 1 !important;
            transform: none !important;
          }
          .prestige-proof-icon { transition: none !important; }
        }
      `}</style>
    </section>
  );
}
