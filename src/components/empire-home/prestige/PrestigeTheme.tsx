/**
 * Midnight Indigo — design tokens scoped to the new homepage.
 * Tema: navy notturno + indigo elettrico, superfici vetro e bordi 1px.
 * I nomi delle variabili restano storici (emerald/gold/ivory) per compatibilità:
 * i VALORI sono ora Midnight Indigo, così tutta la home cambia in un colpo.
 */
export default function PrestigeTheme() {
  return (
    <style>{`
      .prestige-root {
        --pr-emerald-deep: 240 44% 7%;
        --pr-emerald: 240 43% 12%;
        --pr-emerald-mid: 240 45% 20%;
        --pr-emerald-glow: 244 80% 62%;
        --pr-gold: 244 76% 62%;
        --pr-gold-light: 250 92% 78%;
        --pr-gold-deep: 238 72% 48%;
        --pr-ivory: 240 20% 97%;
        --pr-ivory-warm: 240 16% 93%;
        --pr-ink: 240 32% 9%;
        --pr-text-on-dark: 240 30% 97%;
        --pr-text-on-light: 240 36% 12%;
        --pr-muted-on-dark: 240 22% 84%;
        --pr-muted-on-light: 240 20% 32%;

        background: transparent;
        color: hsl(var(--pr-text-on-dark));
        font-family: 'Manrope', 'Inter', system-ui, sans-serif;
        font-weight: 400;
        position: relative;
      }




      .prestige-root,
      .prestige-root * {
        box-sizing: border-box;
      }

      .prestige-root img,
      .prestige-root video,
      .prestige-root canvas {
        max-width: 100%;
      }

      .prestige-section {
        position: relative;
        overflow-x: clip;
        overflow-y: visible;
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
        font-family: 'Sora', 'Manrope', system-ui, sans-serif;
        font-weight: 800;
        letter-spacing: -0.035em;
        line-height: 1.04;
        text-transform: none;
        font-feature-settings: "ss01", "liga";
      }

      /* ── Bento surface (Midnight Cosmic) ─────────────────────────── */
      .prestige-bento {
        position: relative;
        background: hsl(var(--pr-emerald) / 0.45);
        border: 1px solid hsl(0 0% 100% / 0.06);
        border-radius: 2.5rem;
        backdrop-filter: blur(22px);
        -webkit-backdrop-filter: blur(22px);
        box-shadow: 0 40px 90px -50px hsl(var(--pr-gold) / 0.45), inset 0 1px 0 hsl(0 0% 100% / 0.05);
        transition: border-color .5s ease, background .5s ease;
      }
      .prestige-bento:hover { border-color: hsl(var(--pr-gold) / 0.32); }
      @media (max-width: 640px) {
        .prestige-bento { border-radius: 1.75rem; }
      }

      /* ── Anti-clipping titoli su mobile/tablet ───────────────────── */
      .prestige-root .prestige-display {
        overflow-wrap: break-word;
        word-break: normal;
        max-width: 100%;
      }
      @media (max-width: 1023px) {
        .prestige-root .prestige-display { overflow-wrap: anywhere; }
      }


      /* Nav CTA riallineata alla palette Midnight Indigo */
      .prestige-root .landing-button-primary,
      .prestige-root .landing-button-primary.\!text-black {
        color: hsl(var(--pr-ivory)) !important;
        background: linear-gradient(135deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold)) 55%, hsl(var(--pr-gold-deep)));
        box-shadow: 0 22px 60px -28px hsl(var(--pr-gold) / 0.7), inset 0 1px 0 hsl(0 0% 100% / 0.28);
      }




      .prestige-eyebrow {
        font-family: 'Manrope', 'Inter', sans-serif;
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

      /* ── Sfondo cinematico scroll-scrubbed (sotto a TUTTO) ──────── */
      html:has(.prestige-root), body:has(.prestige-root) {
        background-color: hsl(240 44% 7%);
      }
      .prestige-scrub-backdrop {
        position: fixed;
        inset: 0;
        z-index: 0;
        pointer-events: none;
        background-color: hsl(240 44% 7%);
        overflow: hidden;
      }
      .prestige-scrub-backdrop canvas {
        position: absolute;
        inset: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
        opacity: 0.5;
        filter: saturate(0.8) contrast(1.06);
      }
      .prestige-scrub-veil {
        position: absolute;
        inset: 0;
        background:
          linear-gradient(180deg, hsl(240 44% 7% / 0.72) 0%, hsl(240 44% 7% / 0.45) 45%, hsl(240 44% 7% / 0.8) 100%);
      }
      .prestige-scrub-vignette {
        position: absolute;
        inset: 0;
        background: radial-gradient(ellipse at center, transparent 45%, hsl(240 50% 4% / 0.75) 100%);
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
        font-family: 'Sora', 'Manrope', system-ui, sans-serif;
        font-style: normal;
        font-weight: 800;
        letter-spacing: -0.035em;
        background: linear-gradient(100deg, hsl(var(--pr-gold-light)), hsl(var(--pr-gold)) 55%, hsl(var(--pr-gold-deep)));
        -webkit-background-clip: text;
        background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
      }



      .prestige-eyebrow-indexed {
        display: inline-flex;
        align-items: center;
        gap: 0.6rem;
        font-family: 'Manrope', 'Inter', sans-serif;
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
      /* Light section override: gold-light is unreadable on cream — flip to gold-deep */
      .prestige-light .prestige-eyebrow-indexed,
      .prestige-light .prestige-eyebrow {
        color: hsl(var(--pr-gold-deep)) !important;
      }
      .prestige-light .prestige-eyebrow-indexed::before {
        color: hsl(var(--pr-gold-deep));
        border-color: hsl(var(--pr-gold-deep) / 0.6);
        background: hsl(var(--pr-gold) / 0.08);
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
        font-family: 'Manrope', 'Inter', sans-serif;
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

      /* ── Aurora / mesh gradient background (fixed, behind content) ── */
      .prestige-aurora {
        position: fixed;
        inset: 0;
        pointer-events: none;
        z-index: 0;
        overflow: hidden;
      }
      .prestige-aurora__layer {
        position: absolute;
        inset: -20%;
        opacity: 0.55;
        filter: blur(80px);
        will-change: transform;
        mix-blend-mode: screen;
      }
      .prestige-aurora__layer--a {
        background:
          radial-gradient(40% 35% at 22% 18%, hsl(var(--pr-emerald-glow) / 0.55), transparent 60%),
          radial-gradient(45% 30% at 78% 28%, hsl(var(--pr-gold) / 0.35), transparent 65%);
        animation: prestige-aurora-drift-a 22s ease-in-out infinite alternate;
      }
      .prestige-aurora__layer--b {
        background:
          radial-gradient(35% 32% at 70% 72%, hsl(var(--pr-emerald-glow) / 0.42), transparent 60%),
          radial-gradient(50% 32% at 18% 82%, hsl(var(--pr-gold-deep) / 0.32), transparent 65%);
        animation: prestige-aurora-drift-b 28s ease-in-out infinite alternate;
        opacity: 0.45;
      }
      .prestige-aurora__layer--c {
        background: radial-gradient(30% 22% at 50% 50%, hsl(var(--pr-gold-light) / 0.18), transparent 70%);
        animation: prestige-aurora-drift-c 36s ease-in-out infinite alternate;
        opacity: 0.4;
      }
      .prestige-aurora__beam {
        position: absolute;
        top: -10%;
        width: 22vw;
        height: 130vh;
        background: linear-gradient(180deg, transparent 0%, hsl(var(--pr-gold-light) / 0.07) 45%, transparent 100%);
        filter: blur(28px);
        transform-origin: top center;
      }
      .prestige-aurora__beam--1 { left: 18%; transform: rotate(8deg); animation: prestige-beam-sway 14s ease-in-out infinite alternate; }
      .prestige-aurora__beam--2 { right: 14%; transform: rotate(-6deg); animation: prestige-beam-sway 18s ease-in-out infinite alternate-reverse; }

      @keyframes prestige-aurora-drift-a {
        from { transform: translate3d(-4%, -2%, 0) scale(1); }
        to   { transform: translate3d(4%, 3%, 0) scale(1.08); }
      }
      @keyframes prestige-aurora-drift-b {
        from { transform: translate3d(3%, 2%, 0) scale(1.05); }
        to   { transform: translate3d(-3%, -4%, 0) scale(1); }
      }
      @keyframes prestige-aurora-drift-c {
        from { transform: translate3d(0, 0, 0) scale(1); }
        to   { transform: translate3d(2%, -3%, 0) scale(1.15); }
      }
      @keyframes prestige-beam-sway {
        from { transform: rotate(8deg) translateY(-3%); opacity: 0.7; }
        to   { transform: rotate(-4deg) translateY(2%); opacity: 1; }
      }

      /* Keep content above aurora */
      .prestige-root > *:not(.prestige-aurora):not(.prestige-noise):not(.prestige-scrub-backdrop) { position: relative; z-index: 2; }

      /* Mobile stability guardrails: no vertically clipped sections, no sticky viewport traps. */
      @media (max-width: 767px) {
        [data-section="prestige-hero"] {
          min-height: auto !important;
          align-items: flex-start !important;
          padding-top: 8.75rem !important;
          padding-bottom: 6rem !important;
        }
        .prestige-hero-phone-stage {
          margin-top: 1.5rem;
          width: min(70vw, 240px) !important;
        }
        .prestige-scroll-hint {
          display: none !important;
        }
        .prestige-section {
          overflow-x: clip;
          overflow-y: visible;
        }
        [data-section="prestige-story"] {
          height: auto !important;
          min-height: 0 !important;
        }
        [data-section="prestige-story"] > .prestige-story-sticky {
          position: relative !important;
          top: auto !important;
          height: auto !important;
          min-height: 0 !important;
          overflow: visible !important;
          padding-top: 4.5rem !important;
          padding-bottom: 4.5rem !important;
        }
        [data-section="prestige-story"] .prestige-card {
          transform: none !important;
          opacity: 1 !important;
          filter: none !important;
        }
        .prestige-cta,
        .prestige-cta-ghost {
          min-height: 44px;
          white-space: normal;
          text-align: center;
        }
        .prestige-compare-wrap {
          overflow: visible !important;
          border-radius: 18px !important;
          background: transparent !important;
        }
        .prestige-compare-table,
        .prestige-compare-table thead,
        .prestige-compare-table tbody,
        .prestige-compare-table tr,
        .prestige-compare-table th,
        .prestige-compare-table td {
          display: block;
          width: 100% !important;
          min-width: 0 !important;
        }
        .prestige-compare-table thead {
          display: none;
        }
        .prestige-compare-table tr {
          margin-bottom: 0.85rem;
          overflow: hidden;
          border: 1px solid hsl(var(--pr-gold) / 0.22) !important;
          border-radius: 16px;
          background: hsl(var(--pr-emerald-mid) / 0.48);
        }
        .prestige-compare-table td {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1rem;
          padding: 0.85rem 1rem !important;
          text-align: right !important;
          border-top: 1px solid hsl(var(--pr-gold) / 0.10);
        }
        .prestige-compare-table td:first-child {
          display: block;
          border-top: 0;
          text-align: left !important;
          background: hsl(var(--pr-emerald-deep) / 0.72);
        }
        .prestige-compare-table td:not(:first-child)::before {
          content: attr(data-label);
          flex: 1;
          text-align: left;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: hsl(var(--pr-muted-on-dark));
        }
      }

      /* Story comparison is conversion-critical: never sticky/clip/tilt this block. */
      .prestige-story-safe,
      .prestige-story-safe * {
        overflow: visible;
      }
      .prestige-story-safe .prestige-card,
      .prestige-story-safe .prestige-card:hover {
        transform: none !important;
        filter: none !important;
        opacity: 1 !important;
      }
      .prestige-story-safe .prestige-card::after {
        overflow: hidden;
      }

      /* ── Scroll reveal (auto-bound via PrestigeEffects) ───────────── */
      .prestige-reveal {
        opacity: 0.001;
        transform: translateY(20px);
        transition:
          opacity .7s cubic-bezier(.22,1,.36,1),
          transform .7s cubic-bezier(.22,1,.36,1);
        will-change: opacity, transform;
      }
      .prestige-reveal.is-revealed { opacity: 1; transform: none; }
      /* Pinned/sticky sections must always be visible — they manage their own animation */
      [data-section="prestige-story"].prestige-reveal,
      [data-section="prestige-hero"].prestige-reveal {
        opacity: 1 !important;
        transform: none !important;
      }
      @media (prefers-reduced-motion: reduce) {
        .prestige-reveal {
          opacity: 1 !important;
          transform: none !important;
          transition: none !important;
        }
        .prestige-aurora__layer,
        .prestige-aurora__beam { animation: none !important; }
      }

      /* ── Card 3D tilt + spotlight (desktop only, auto-bound) ─────── */
      .prestige-tilt {
        transform-style: preserve-3d;
        transform: perspective(900px)
          rotateX(var(--tilt-x, 0deg))
          rotateY(var(--tilt-y, 0deg))
          translateZ(0);
        transition: transform .35s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
      }
      .prestige-tilt::before {
        background:
          radial-gradient(180px circle at var(--spot-x, 50%) var(--spot-y, 50%), hsl(var(--pr-gold-light) / 0.25), transparent 70%),
          linear-gradient(135deg, hsl(var(--pr-gold-light) / 0.55), hsl(var(--pr-gold) / 0.18) 35%, transparent 55%, hsl(var(--pr-gold-deep) / 0.45) 100%);
      }

      /* ── Magnetic CTA ────────────────────────────────────────────── */
      .prestige-magnetic {
        transform: translate3d(var(--mag-x, 0), var(--mag-y, 0), 0);
        transition: transform .25s cubic-bezier(.22,1,.36,1), box-shadow .35s ease;
      }
      .prestige-cta.prestige-magnetic:hover {
        transform: translate3d(var(--mag-x, 0), calc(var(--mag-y, 0px) - 2px), 0);
      }

      /* ── Editorial broken-grid additions (v4 redesign) ─────────────── */
      .prestige-numeral {
        font-family: 'Urbanist', sans-serif;
        font-weight: 900;
        font-size: clamp(5rem, 11vw, 9.5rem);
        line-height: 0.82;
        letter-spacing: -0.06em;
        color: hsl(var(--pr-gold) / 0.16);
        user-select: none;
        pointer-events: none;
      }
      .prestige-light .prestige-numeral { color: hsl(var(--pr-emerald) / 0.10); }

      .prestige-hairline {
        display: inline-block;
        height: 1px;
        width: clamp(36px, 6vw, 72px);
        background: linear-gradient(90deg, hsl(var(--pr-gold)), transparent);
        vertical-align: middle;
      }

      .prestige-ghost-word {
        font-family: 'Urbanist', sans-serif;
        font-weight: 900;
        font-size: clamp(8rem, 28vw, 22rem);
        line-height: 0.78;
        letter-spacing: -0.08em;
        color: hsl(var(--pr-gold) / 0.04);
        text-transform: uppercase;
        pointer-events: none;
        user-select: none;
      }
      .prestige-light .prestige-ghost-word { color: hsl(var(--pr-emerald) / 0.06); }

      .prestige-rule-gold {
        height: 1px;
        background: linear-gradient(90deg, transparent, hsl(var(--pr-gold) / 0.55) 20%, hsl(var(--pr-gold) / 0.55) 80%, transparent);
      }

      .prestige-vertical-label {
        writing-mode: vertical-rl;
        transform: rotate(180deg);
        font-family: 'Urbanist', sans-serif;
        font-weight: 800;
        font-size: 11px;
        letter-spacing: 0.5em;
        text-transform: uppercase;
        color: hsl(var(--pr-gold) / 0.85);
      }

      .prestige-phone-frame {
        border-radius: 2.2rem;
        padding: 8px;
        background: linear-gradient(145deg, hsl(0 0% 18%), hsl(0 0% 6%) 38%, hsl(0 0% 14%) 65%, hsl(0 0% 4%));
        box-shadow:
          0 50px 90px -30px hsl(var(--pr-emerald-deep) / 0.95),
          0 0 0 1.2px hsl(var(--pr-gold) / 0.38),
          inset 0 1px 0 hsl(0 0% 100% / 0.08);
      }

      .prestige-display-mono {
        font-family: 'Urbanist', sans-serif;
        font-weight: 900;
        font-size: clamp(2.5rem, 4.5vw, 4rem);
        line-height: 0.9;
        letter-spacing: -0.03em;
        text-transform: uppercase;
      }
    `}</style>
  );
}

