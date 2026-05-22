/**
 * Emerald Prestige — design tokens scoped to the new homepage.
 * Tema: smeraldo profondo + oro caldo + crema avorio.
 * Sezioni alternate dark (smeraldo) / light (avorio) per ritmo agency.
 */
export default function PrestigeTheme() {
  return (
    <style>{`
      .prestige-root {
        --pr-emerald-deep: 162 65% 8%;
        --pr-emerald: 162 60% 15%;
        --pr-emerald-mid: 162 55% 22%;
        --pr-emerald-glow: 158 70% 45%;
        --pr-gold: 42 65% 58%;
        --pr-gold-light: 42 75% 72%;
        --pr-gold-deep: 38 70% 42%;
        --pr-ivory: 42 35% 96%;
        --pr-ivory-warm: 38 30% 92%;
        --pr-ink: 162 30% 10%;
        --pr-text-on-dark: 42 30% 94%;
        --pr-text-on-light: 162 35% 12%;
        --pr-muted-on-dark: 42 22% 86%;
        --pr-muted-on-light: 162 28% 22%;

        background: hsl(var(--pr-emerald-deep));
        color: hsl(var(--pr-text-on-dark));
        font-family: 'Inter', system-ui, sans-serif;
        position: relative;
      }

      .prestige-section {
        position: relative;
        overflow: hidden;
      }

      .prestige-dark {
        background:
          radial-gradient(ellipse 60% 40% at 20% 10%, hsl(var(--pr-emerald-glow) / 0.10), transparent 60%),
          radial-gradient(ellipse 50% 35% at 85% 90%, hsl(var(--pr-gold) / 0.08), transparent 65%),
          linear-gradient(180deg, hsl(var(--pr-emerald-deep)), hsl(var(--pr-emerald)));
        color: hsl(var(--pr-text-on-dark));
      }

      .prestige-light {
        background:
          radial-gradient(ellipse 70% 50% at 80% 0%, hsl(var(--pr-gold) / 0.10), transparent 60%),
          linear-gradient(180deg, hsl(var(--pr-ivory)), hsl(var(--pr-ivory-warm)));
        color: hsl(var(--pr-text-on-light));
      }

      .prestige-display {
        font-family: 'Playfair Display', 'Cormorant Garamond', Georgia, serif;
        letter-spacing: -0.02em;
        line-height: 1.02;
      }

      .prestige-eyebrow {
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        letter-spacing: 0.32em;
        text-transform: uppercase;
        font-weight: 600;
        opacity: 0.95;
      }
      @media (min-width: 768px) {
        .prestige-eyebrow { font-size: 12px; }
      }

      .prestige-gold-text {
        background: linear-gradient(120deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold)) 50%, hsl(var(--pr-gold-deep)));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .prestige-divider {
        width: 48px;
        height: 1px;
        background: linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.6), transparent);
      }

      .prestige-cta {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.95rem 1.6rem;
        border-radius: 999px;
        font-weight: 600;
        font-size: 14px;
        letter-spacing: 0.02em;
        background: linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold)) 60%, hsl(var(--pr-gold-deep)));
        color: hsl(var(--pr-emerald-deep));
        box-shadow: 0 12px 40px -12px hsl(var(--pr-gold) / 0.55), inset 0 1px 0 hsl(0 0% 100% / 0.35);
        transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
        cursor: pointer;
        border: none;
      }
      .prestige-cta:hover {
        transform: translateY(-2px);
        box-shadow: 0 18px 50px -10px hsl(var(--pr-gold) / 0.7);
      }
      .prestige-cta-ghost {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        padding: 0.95rem 1.6rem;
        border-radius: 999px;
        font-weight: 500;
        font-size: 14px;
        letter-spacing: 0.02em;
        background: transparent;
        color: currentColor;
        border: 1px solid currentColor;
        opacity: 1;
        transition: opacity .3s ease, background .3s ease;
        cursor: pointer;
      }
      .prestige-cta-ghost:hover { opacity: 1; background: currentColor; color: hsl(var(--pr-emerald-deep)); }

      .prestige-card {
        position: relative;
        border-radius: 20px;
        padding: 1.15rem;
        background: hsl(var(--pr-emerald-mid) / 0.55);
        border: 1px solid hsl(var(--pr-gold) / 0.18);
        backdrop-filter: blur(10px);
        transition: transform .5s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .3s ease;
      }
      @media (min-width: 640px) {
        .prestige-card { border-radius: 24px; padding: 1.5rem; }
      }
      .prestige-light .prestige-card {
        background: hsl(0 0% 100% / 0.85);
        border: 1px solid hsl(var(--pr-emerald) / 0.12);
        box-shadow: 0 12px 40px -20px hsl(var(--pr-emerald) / 0.25);
      }
      .prestige-card:hover {
        transform: translateY(-4px);
        border-color: hsl(var(--pr-gold) / 0.45);
        box-shadow: 0 20px 60px -20px hsl(var(--pr-gold) / 0.35);
      }
      .prestige-cta, .prestige-cta-ghost {
        max-width: 100%;
        white-space: nowrap;
      }
      @media (max-width: 380px) {
        .prestige-cta, .prestige-cta-ghost {
          padding: 0.85rem 1.1rem;
          font-size: 13px;
          gap: 0.4rem;
        }
      }

      /* Scroll-driven utilities (uses --empire-progress from ScrollDirector) */
      .prestige-fade-up {
        opacity: calc(var(--empire-progress, 0) * 1.4);
        transform: translateY(calc((1 - var(--empire-progress, 0)) * 24px));
        transition: opacity .15s linear;
      }

      @media (prefers-reduced-motion: reduce) {
        .prestige-fade-up { opacity: 1 !important; transform: none !important; }
        .prestige-cta, .prestige-card { transition: none !important; }
      }
    `}</style>
  );
}
