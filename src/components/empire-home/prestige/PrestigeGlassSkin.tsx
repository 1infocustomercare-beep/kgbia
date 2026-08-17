/**
 * PrestigeGlassSkin — "Liquid Glass Empire".
 * Skin additiva (solo CSS) per home / portfolio / case study Empire.
 * NON tocca i siti demo: le utility sono scoped su .prestige-root e .pglass-scope.
 *
 * Aggiunge un accento acqua/turchese professionale sopra la palette Prestige
 * e le superfici vetro (blur + saturate + bordo 1px + shine interno).
 */
export default function PrestigeGlassSkin() {
  return (
    <style>{`
      .prestige-root, .pglass-scope {
        --pr-aqua: 178 74% 48%;
        --pr-aqua-light: 176 80% 68%;
        --pr-aqua-deep: 190 70% 28%;
      }

      /* ——— superficie vetro su fondo scuro ——— */
      .pglass {
        position: relative;
        border-radius: 26px;
        background:
          linear-gradient(160deg, hsl(0 0% 100% / 0.10), hsl(0 0% 100% / 0.02) 55%),
          hsl(var(--pr-emerald) / 0.42);
        border: 1px solid hsl(0 0% 100% / 0.14);
        backdrop-filter: blur(22px) saturate(150%);
        -webkit-backdrop-filter: blur(22px) saturate(150%);
        box-shadow:
          inset 0 1px 0 hsl(0 0% 100% / 0.18),
          0 24px 60px -30px hsl(var(--pr-emerald-deep) / 0.9);
        transition: transform .55s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .35s ease;
      }
      .pglass::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(120% 60% at 50% -10%, hsl(var(--pr-aqua) / 0.16), transparent 60%);
        opacity: .8;
      }
      .pglass:hover {
        border-color: hsl(var(--pr-aqua) / 0.42);
        box-shadow:
          inset 0 1px 0 hsl(0 0% 100% / 0.22),
          0 28px 70px -28px hsl(var(--pr-aqua) / 0.35);
      }

      /* ——— superficie vetro su fondo chiaro (sezioni prestige-light) ——— */
      .pglass-soft {
        position: relative;
        border-radius: 26px;
        background:
          linear-gradient(160deg, hsl(0 0% 100% / 0.92), hsl(0 0% 100% / 0.62));
        border: 1px solid hsl(var(--pr-aqua) / 0.20);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        box-shadow:
          inset 0 1px 0 hsl(0 0% 100% / 0.9),
          0 18px 48px -26px hsl(var(--pr-aqua-deep) / 0.45);
        transition: transform .55s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .35s ease;
      }
      .pglass-soft:hover {
        transform: translateY(-5px);
        border-color: hsl(var(--pr-aqua) / 0.45);
        box-shadow:
          inset 0 1px 0 hsl(0 0% 100% / 0.95),
          0 26px 60px -24px hsl(var(--pr-aqua) / 0.4);
      }

      /* ——— chip / filtri vetro ——— */
      .pglass-chip {
        display: inline-flex;
        align-items: center;
        gap: .4rem;
        flex-shrink: 0;
        border-radius: 999px;
        padding: .5rem .9rem;
        font-size: 12px;
        font-weight: 600;
        line-height: 1;
        cursor: pointer;
        color: hsl(var(--pr-text-on-light));
        background: hsl(0 0% 100% / 0.6);
        border: 1px solid hsl(var(--pr-aqua) / 0.22);
        backdrop-filter: blur(14px) saturate(140%);
        -webkit-backdrop-filter: blur(14px) saturate(140%);
        transition: all .28s ease;
      }
      .pglass-chip:hover { border-color: hsl(var(--pr-aqua) / 0.5); }
      .pglass-chip[aria-pressed="true"] {
        color: hsl(0 0% 100%);
        background: linear-gradient(135deg, hsl(var(--pr-aqua) / 0.95), hsl(var(--pr-aqua-deep)));
        border-color: hsl(var(--pr-aqua-light) / 0.6);
        box-shadow: 0 12px 28px -14px hsl(var(--pr-aqua) / 0.7);
      }
      .pglass-chip-dark {
        color: hsl(var(--pr-text-on-dark));
        background: hsl(0 0% 100% / 0.07);
        border: 1px solid hsl(0 0% 100% / 0.16);
      }
      .pglass-chip-dark:hover { border-color: hsl(var(--pr-aqua) / 0.55); }
      .pglass-chip-count {
        border-radius: 999px;
        padding: 0 .4rem;
        font-size: 10px;
        font-variant-numeric: tabular-nums;
        background: hsl(var(--pr-aqua) / 0.14);
        color: hsl(var(--pr-aqua-deep));
      }
      .pglass-chip[aria-pressed="true"] .pglass-chip-count {
        background: hsl(0 0% 100% / 0.22);
        color: hsl(0 0% 100%);
      }
      .pglass-chip-dark .pglass-chip-count { color: hsl(var(--pr-aqua-light)); }

      /* ——— pulsanti vetro ——— */
      .pglass-btn {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border-radius: 999px;
        padding: .8rem 1.4rem;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: hsl(0 0% 100%);
        background: linear-gradient(135deg, hsl(var(--pr-aqua) / 0.95), hsl(var(--pr-aqua-deep)));
        border: 1px solid hsl(var(--pr-aqua-light) / 0.55);
        box-shadow: 0 18px 44px -20px hsl(var(--pr-aqua) / 0.75);
        transition: all .3s ease;
      }
      .pglass-btn:hover { gap: .75rem; filter: brightness(1.06); }
      .pglass-btn-ghost {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border-radius: 999px;
        padding: .8rem 1.4rem;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: hsl(var(--pr-aqua-deep));
        background: hsl(0 0% 100% / 0.55);
        border: 1px solid hsl(var(--pr-aqua) / 0.32);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        transition: all .3s ease;
      }
      .pglass-btn-ghost:hover { gap: .75rem; border-color: hsl(var(--pr-aqua) / 0.6); }
      .pglass-scope .pglass-btn-ghost {
        color: hsl(var(--pr-aqua-light));
        background: hsl(0 0% 100% / 0.06);
        border-color: hsl(0 0% 100% / 0.18);
      }

      .pglass-aqua-text {
        background: linear-gradient(120deg, hsl(var(--pr-aqua-light)), hsl(var(--pr-aqua)));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }

      @media (prefers-reduced-motion: reduce) {
        .pglass, .pglass-soft, .pglass-chip, .pglass-btn { transition: none !important; }
      }
    `}</style>
  );
}
