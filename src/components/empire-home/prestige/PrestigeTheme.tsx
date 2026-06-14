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
        .prestige-shimmer::after, .prestige-noise { animation: none !important; }
      }

      /* ── Premium additive layer ─────────────────────────────────── */

      /* Subtle film grain — sits above background, below content */
      .prestige-noise {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 1;
        opacity: 0.06;
        mix-blend-mode: overlay;
        background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.6 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>");
        background-size: 160px 160px;
        animation: prestige-grain 8s steps(8) infinite;
      }
      @keyframes prestige-grain {
        0%, 100% { transform: translate(0, 0); }
        20% { transform: translate(-4%, 3%); }
        40% { transform: translate(3%, -2%); }
        60% { transform: translate(-2%, 4%); }
        80% { transform: translate(4%, -3%); }
      }

      /* Cinematic vignette — applied via background-image so it never
         creates a positioned overlay that could clip absolute children. */
      .prestige-dark {
        background-image:
          radial-gradient(ellipse 60% 40% at 20% 10%, hsl(var(--pr-emerald-glow) / 0.10), transparent 60%),
          radial-gradient(ellipse 50% 35% at 85% 90%, hsl(var(--pr-gold) / 0.08), transparent 65%),
          radial-gradient(ellipse 95% 75% at 50% 50%, transparent 55%, hsl(var(--pr-emerald-deep) / 0.55) 100%),
          linear-gradient(180deg, hsl(var(--pr-emerald-deep)), hsl(var(--pr-emerald)));
      }


      /* Gold shimmer sweep on display text */
      .prestige-gold-text {
        position: relative;
        background-size: 200% 100%;
        animation: prestige-gold-shift 9s ease-in-out infinite;
      }
      @keyframes prestige-gold-shift {
        0%, 100% { background-position: 0% 50%; }
        50% { background-position: 100% 50%; }
      }

      .prestige-shimmer {
        position: relative;
        overflow: hidden;
      }
      .prestige-shimmer::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(110deg, transparent 30%, hsl(var(--pr-gold-light) / 0.25) 50%, transparent 70%);
        transform: translateX(-100%);
        animation: prestige-shimmer-sweep 4.5s ease-in-out infinite;
        pointer-events: none;
      }
      @keyframes prestige-shimmer-sweep {
        0% { transform: translateX(-100%); }
        55%, 100% { transform: translateX(100%); }
      }

      /* Ornate divider with a centered gold diamond */
      .prestige-divider-ornate {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 0.85rem;
        opacity: 0.85;
      }
      .prestige-divider-ornate::before,
      .prestige-divider-ornate::after {
        content: "";
        height: 1px;
        width: clamp(28px, 8vw, 80px);
        background: linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.7), transparent);
      }
      .prestige-divider-ornate > span {
        display: inline-block;
        width: 8px;
        height: 8px;
        transform: rotate(45deg);
        background: linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)));
        box-shadow: 0 0 12px hsl(var(--pr-gold) / 0.55);
      }

      /* Premium gold-border card variant (additive) */
      .prestige-card-gilt {
        position: relative;
        border-radius: 20px;
        padding: 1.15rem;
        background: hsl(var(--pr-emerald-mid) / 0.55);
        backdrop-filter: blur(10px);
        transition: transform .5s cubic-bezier(.22,1,.36,1), box-shadow .3s ease;
      }
      .prestige-card-gilt::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        padding: 1px;
        background: linear-gradient(135deg, hsl(var(--pr-gold-light) / 0.55), hsl(var(--pr-gold) / 0.18) 35%, transparent 55%, hsl(var(--pr-gold-deep) / 0.45) 100%);
        -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
        -webkit-mask-composite: xor;
        mask-composite: exclude;
        pointer-events: none;
      }
      .prestige-card-gilt:hover {
        transform: translateY(-4px);
        box-shadow: 0 28px 70px -24px hsl(var(--pr-gold) / 0.4);
      }
      @media (min-width: 640px) {
        .prestige-card-gilt { border-radius: 24px; padding: 1.5rem; }
      }

      /* Refine baseline card with inner sheen */
      .prestige-card::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        background: linear-gradient(180deg, hsl(0 0% 100% / 0.06), transparent 30%);
        pointer-events: none;
      }

      /* CTA: add inner highlight + subtle rotating conic ring on hover */
      .prestige-cta { position: relative; isolation: isolate; }
      .prestige-cta::before {
        content: "";
        position: absolute;
        inset: -2px;
        border-radius: inherit;
        background: conic-gradient(from var(--ang, 0deg), hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)), hsl(var(--pr-gold-light)));
        opacity: 0;
        z-index: -1;
        transition: opacity .35s ease;
        filter: blur(8px);
      }
      .prestige-cta:hover::before { opacity: 0.55; animation: prestige-spin 6s linear infinite; }
      @keyframes prestige-spin { to { --ang: 360deg; } }
      @property --ang {
        syntax: "<angle>";
        initial-value: 0deg;
        inherits: false;
      }

      /* Hide duplicate floating language toggle if LandingNav already mounts one */
      body:has(nav .prestige-lang-toggle) .prestige-hero-lang-floating { display: none; }

      /* ── Editorial typography polish ─────────────────────────────── */
      .prestige-display em,
      .prestige-italic {
        font-family: 'Cormorant Garamond', 'Playfair Display', Georgia, serif;
        font-style: italic;
        font-weight: 400;
        letter-spacing: -0.01em;
      }
      .prestige-eyebrow-indexed {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        font-family: 'Inter', sans-serif;
        font-size: 11px;
        letter-spacing: 0.28em;
        text-transform: uppercase;
        font-weight: 600;
        opacity: 0.95;
      }
      .prestige-eyebrow-indexed::before {
        content: attr(data-index);
        font-family: 'JetBrains Mono', ui-monospace, monospace;
        font-size: 10px;
        letter-spacing: 0.05em;
        padding: 2px 6px;
        border: 1px solid hsl(var(--pr-gold) / 0.55);
        border-radius: 4px;
        color: hsl(var(--pr-gold-light));
        opacity: 0.9;
      }

      /* ── Marquee strip (additive editorial band) ─────────────────── */
      .prestige-marquee {
        position: relative;
        overflow: hidden;
        border-top: 1px solid hsl(var(--pr-gold) / 0.18);
        border-bottom: 1px solid hsl(var(--pr-gold) / 0.18);
        padding: 0.85rem 0;
        z-index: 2;
      }
      .prestige-marquee::before,
      .prestige-marquee::after {
        content: "";
        position: absolute;
        top: 0; bottom: 0;
        width: 80px;
        pointer-events: none;
        z-index: 2;
      }
      .prestige-marquee::before {
        left: 0;
        background: linear-gradient(90deg, hsl(var(--pr-emerald-deep)) 0%, transparent 100%);
      }
      .prestige-marquee::after {
        right: 0;
        background: linear-gradient(270deg, hsl(var(--pr-emerald-deep)) 0%, transparent 100%);
      }
      .prestige-marquee__track {
        display: inline-flex;
        gap: 2.5rem;
        white-space: nowrap;
        animation: prestige-marquee-scroll 38s linear infinite;
        will-change: transform;
      }
      .prestige-marquee:hover .prestige-marquee__track {
        animation-play-state: paused;
      }
      .prestige-marquee__item {
        display: inline-flex;
        align-items: center;
        gap: 1rem;
        font-family: 'Inter', sans-serif;
        font-size: 12px;
        letter-spacing: 0.24em;
        text-transform: uppercase;
        font-weight: 500;
        color: hsl(var(--pr-text-on-dark) / 0.78);
      }
      .prestige-marquee__dot {
        width: 6px;
        height: 6px;
        transform: rotate(45deg);
        background: linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold-deep)));
        box-shadow: 0 0 8px hsl(var(--pr-gold) / 0.6);
        flex-shrink: 0;
      }
      .prestige-marquee__text {
        background: linear-gradient(120deg, hsl(var(--pr-text-on-dark)) 0%, hsl(var(--pr-gold-light)) 50%, hsl(var(--pr-text-on-dark)) 100%);
        background-size: 200% 100%;
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
      }
      @keyframes prestige-marquee-scroll {
        from { transform: translateX(0); }
        to   { transform: translateX(-50%); }
      }
      @media (prefers-reduced-motion: reduce) {
        .prestige-marquee__track { animation: none !important; }
      }

      /* ── Section corner ornaments (subtle gold brackets) ─────────── */
      .prestige-corners {
        position: relative;
      }
      .prestige-corners::before,
      .prestige-corners::after {
        content: "";
        position: absolute;
        width: 24px;
        height: 24px;
        border: 1px solid hsl(var(--pr-gold) / 0.5);
        pointer-events: none;
        opacity: 0.7;
      }
      .prestige-corners::before {
        top: 12px; left: 12px;
        border-right: none;
        border-bottom: none;
      }
      .prestige-corners::after {
        bottom: 12px; right: 12px;
        border-left: none;
        border-top: none;
      }
    `}</style>
  );
}
