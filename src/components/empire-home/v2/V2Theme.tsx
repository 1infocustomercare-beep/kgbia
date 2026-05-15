/**
 * Design tokens for the rebuilt Empire homepage (v2).
 * Emerald + gold + ivory. Self-contained scoped under .empire-v2.
 */
export default function V2Theme() {
  return (
    <style>{`
      .empire-v2 {
        --v2-emerald-deep: 162 75% 6%;
        --v2-emerald: 162 65% 12%;
        --v2-emerald-mid: 162 55% 22%;
        --v2-glow: 158 80% 50%;
        --v2-gold: 42 70% 58%;
        --v2-gold-light: 42 80% 76%;
        --v2-gold-deep: 38 75% 42%;
        --v2-ivory: 42 35% 96%;
        --v2-ivory-warm: 38 30% 92%;
        --v2-ink: 162 35% 9%;
        --v2-text: 42 30% 95%;
        --v2-text-muted: 42 20% 78%;
        --v2-text-on-light: 162 40% 12%;

        font-family: 'Inter', system-ui, sans-serif;
        color: hsl(var(--v2-text));
        background: hsl(var(--v2-emerald-deep));
        position: relative;
      }

      .empire-v2 .v2-display {
        font-family: 'Playfair Display', Georgia, serif;
        letter-spacing: -0.025em;
        line-height: 1;
      }

      .empire-v2 .v2-eyebrow {
        font-size: 11px;
        font-weight: 600;
        letter-spacing: 0.34em;
        text-transform: uppercase;
        color: hsl(var(--v2-gold-light));
      }

      .empire-v2 .v2-gold-text {
        background: linear-gradient(120deg, hsl(var(--v2-gold-light)), hsl(var(--v2-gold)) 55%, hsl(var(--v2-gold-deep)));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .empire-v2 .v2-cta {
        display: inline-flex; align-items: center; gap: .55rem;
        padding: .95rem 1.6rem;
        border-radius: 999px;
        font-size: 14px; font-weight: 600;
        background: linear-gradient(135deg, hsl(var(--v2-gold-light)), hsl(var(--v2-gold)) 55%, hsl(var(--v2-gold-deep)));
        color: hsl(var(--v2-emerald-deep));
        box-shadow: 0 14px 40px -12px hsl(var(--v2-gold) / 0.55), inset 0 1px 0 hsl(0 0% 100% / .35);
        cursor: pointer; border: none;
        transition: transform .3s ease, box-shadow .3s ease;
      }
      .empire-v2 .v2-cta:hover { transform: translateY(-2px); box-shadow: 0 22px 60px -10px hsl(var(--v2-gold) / .7); }

      .empire-v2 .v2-ghost {
        display: inline-flex; align-items: center; gap: .55rem;
        padding: .9rem 1.5rem;
        border-radius: 999px;
        font-size: 14px; font-weight: 500;
        background: transparent; color: hsl(var(--v2-text));
        border: 1px solid hsl(var(--v2-gold) / .35);
        cursor: pointer;
        transition: background .25s ease, border-color .25s ease;
      }
      .empire-v2 .v2-ghost:hover { background: hsl(var(--v2-gold) / .08); border-color: hsl(var(--v2-gold) / .7); }

      .empire-v2 .v2-card {
        position: relative;
        border-radius: 24px;
        padding: 1.5rem;
        background: hsl(var(--v2-emerald) / .55);
        border: 1px solid hsl(var(--v2-gold) / .15);
        backdrop-filter: blur(12px);
        transition: transform .5s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .3s ease;
      }
      .empire-v2 .v2-card:hover {
        transform: translateY(-4px);
        border-color: hsl(var(--v2-gold) / .5);
        box-shadow: 0 24px 60px -20px hsl(var(--v2-gold) / .35);
      }

      .empire-v2 .v2-section {
        position: relative;
        padding: clamp(60px, 10svh, 120px) 0;
      }

      .empire-v2 .v2-divider {
        width: 56px; height: 1px;
        background: linear-gradient(90deg, transparent, hsl(var(--v2-gold) / .7), transparent);
      }

      .empire-v2 .v2-fade-up {
        opacity: calc(var(--empire-progress, 0) * 1.5);
        transform: translateY(calc((1 - var(--empire-progress, 0)) * 28px));
      }

      .empire-v2 .v2-noise {
        position: absolute; inset: 0; pointer-events: none;
        opacity: .035;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence baseFrequency='.9' numOctaves='2' seed='3'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 .85  0 0 0 0 .4  0 0 0 .6 0'/></filter><rect width='100%25' height='100%25' filter='url(%23n)'/></svg>");
      }

      @media (prefers-reduced-motion: reduce) {
        .empire-v2 .v2-fade-up { opacity: 1 !important; transform: none !important; }
      }
    `}</style>
  );
}
