/**
 * PrestigeGlassSkin — "Empire Liquid Glass" (skin globale, solo CSS).
 *
 * Ridisegna a 360° lo stile della web app Empire: home, sezioni verso il
 * portfolio, portfolio, case study, pagine pacchetti/vendor/legali.
 * NON tocca i siti demo (nessuna regola globale: tutto è scoped su
 * `.prestige-root` / `.pglass-scope`).
 *
 * Cosa cambia: palette (midnight teal + acqua liquida), superfici vetro con
 * blur/saturate, raggi più morbidi, bordi 1px luminosi, bottoni/chip in vetro,
 * tabelle e bento coerenti, movimento "ondeggiante" lento sui fondali.
 * Cosa NON cambia: markup, icone, scroll-driven effects, GSAP pin, framer.
 */
export default function PrestigeGlassSkin() {
  return (
    <style>{`
      /* ═══════════ 1. PALETTE — Liquid Glass Empire ═══════════
         I nomi restano storici (emerald/gold) per compatibilità: i VALORI
         passano a midnight-teal + acqua, così tutta la webapp cambia insieme. */
      .prestige-root, .pglass-scope {
        --pr-emerald-deep: 202 56% 6%;
        --pr-emerald: 201 48% 10%;
        --pr-emerald-mid: 197 38% 18%;
        --pr-emerald-glow: 177 84% 52%;
        --pr-gold: 178 74% 48%;
        --pr-gold-light: 176 82% 76%;
        --pr-gold-deep: 190 72% 30%;
        --pr-ivory: 195 34% 98%;
        --pr-ivory-warm: 194 28% 94%;
        --pr-ink: 203 42% 9%;
        --pr-text-on-dark: 190 32% 97%;
        --pr-text-on-light: 204 42% 12%;
        --pr-muted-on-dark: 193 22% 84%;
        --pr-muted-on-light: 202 18% 34%;

        --pr-aqua: 178 74% 48%;
        --pr-aqua-light: 176 82% 74%;
        --pr-aqua-deep: 190 72% 28%;
        --pr-glass: 0 0% 100%;
      }

      /* ═══════════ 2. FONDALI ONDEGGIANTI ═══════════ */
      .prestige-root .prestige-dark {
        background:
          radial-gradient(ellipse 70% 45% at 18% 8%, hsl(var(--pr-aqua) / 0.14), transparent 62%),
          radial-gradient(ellipse 55% 40% at 88% 92%, hsl(var(--pr-aqua-light) / 0.10), transparent 66%),
          linear-gradient(180deg, hsl(var(--pr-emerald-deep)), hsl(var(--pr-emerald)));
        background-size: 180% 180%, 180% 180%, 100% 100%;
        animation: pglassDrift 26s ease-in-out infinite alternate;
      }
      .prestige-root .prestige-light {
        background:
          radial-gradient(ellipse 60% 40% at 85% 0%, hsl(var(--pr-aqua) / 0.10), transparent 60%),
          radial-gradient(ellipse 50% 45% at 5% 100%, hsl(var(--pr-aqua-light) / 0.14), transparent 65%),
          linear-gradient(180deg, hsl(var(--pr-ivory)), hsl(var(--pr-ivory-warm)));
        background-size: 170% 170%, 170% 170%, 100% 100%;
        animation: pglassDrift 32s ease-in-out infinite alternate-reverse;
      }
      @keyframes pglassDrift {
        from { background-position: 0% 0%, 100% 100%, 0 0; }
        to   { background-position: 100% 60%, 0% 20%, 0 0; }
      }

      .pglass-bg {
        background:
          radial-gradient(ellipse 70% 45% at 15% 0%, hsl(var(--pr-aqua) / 0.16), transparent 62%),
          radial-gradient(ellipse 55% 45% at 90% 95%, hsl(var(--pr-aqua-light) / 0.10), transparent 66%),
          linear-gradient(180deg, hsl(var(--pr-emerald-deep)), hsl(var(--pr-emerald)));
        background-size: 180% 180%, 180% 180%, 100% 100%;
        animation: pglassDrift 28s ease-in-out infinite alternate;
      }

      /* ═══════════ 3. SUPERFICI VETRO ═══════════ */
      .prestige-root .prestige-card,
      .prestige-root .prestige-card-gilt,
      .pglass {
        position: relative;
        border-radius: 26px;
        background:
          linear-gradient(160deg, hsl(var(--pr-glass) / 0.11), hsl(var(--pr-glass) / 0.02) 55%),
          hsl(var(--pr-emerald) / 0.42);
        border: 1px solid hsl(var(--pr-glass) / 0.14);
        backdrop-filter: blur(22px) saturate(150%);
        -webkit-backdrop-filter: blur(22px) saturate(150%);
        box-shadow:
          inset 0 1px 0 hsl(var(--pr-glass) / 0.18),
          0 24px 60px -30px hsl(var(--pr-emerald-deep) / 0.9);
        transition: transform .55s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .35s ease;
      }
      @media (min-width: 640px) {
        .prestige-root .prestige-card,
        .prestige-root .prestige-card-gilt,
        .pglass { border-radius: 30px; }
      }
      .pglass::after {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: inherit;
        pointer-events: none;
        background: radial-gradient(120% 60% at 50% -10%, hsl(var(--pr-aqua) / 0.16), transparent 60%);
      }
      .prestige-root .prestige-card:hover,
      .prestige-root .prestige-card-gilt:hover,
      .pglass:hover {
        border-color: hsl(var(--pr-aqua) / 0.45);
        box-shadow:
          inset 0 1px 0 hsl(var(--pr-glass) / 0.22),
          0 28px 70px -26px hsl(var(--pr-aqua) / 0.35);
      }

      /* vetro su fondo chiaro */
      .prestige-root .prestige-light .prestige-card,
      .prestige-root .prestige-light .prestige-card-gilt,
      .pglass-soft {
        background: linear-gradient(160deg, hsl(var(--pr-glass) / 0.94), hsl(var(--pr-glass) / 0.64));
        border: 1px solid hsl(var(--pr-aqua) / 0.20);
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        box-shadow:
          inset 0 1px 0 hsl(var(--pr-glass) / 0.9),
          0 18px 48px -26px hsl(var(--pr-aqua-deep) / 0.45);
        transition: transform .55s cubic-bezier(.22,1,.36,1), border-color .3s ease, box-shadow .35s ease;
      }
      .pglass-soft { position: relative; border-radius: 26px; }
      .prestige-root .prestige-light .prestige-card:hover,
      .prestige-root .prestige-light .prestige-card-gilt:hover,
      .pglass-soft:hover {
        transform: translateY(-5px);
        border-color: hsl(var(--pr-aqua) / 0.48);
        box-shadow:
          inset 0 1px 0 hsl(var(--pr-glass) / 0.95),
          0 26px 60px -24px hsl(var(--pr-aqua) / 0.4);
      }

      /* bento / tabelle comparative coerenti */
      .prestige-root .prestige-bento {
        border-radius: 30px;
        border: 1px solid hsl(var(--pr-glass) / 0.12);
        background: linear-gradient(160deg, hsl(var(--pr-glass) / 0.08), hsl(var(--pr-glass) / 0.02));
        backdrop-filter: blur(20px) saturate(145%);
        -webkit-backdrop-filter: blur(20px) saturate(145%);
      }
      .prestige-root .prestige-compare-wrap {
        border-radius: 26px;
        border: 1px solid hsl(var(--pr-aqua) / 0.22);
        background: linear-gradient(160deg, hsl(var(--pr-glass) / 0.08), hsl(var(--pr-glass) / 0.02));
        backdrop-filter: blur(18px) saturate(140%);
        -webkit-backdrop-filter: blur(18px) saturate(140%);
        overflow: hidden;
      }
      .prestige-root .prestige-divider,
      .prestige-root .prestige-hairline,
      .prestige-root .prestige-rule-gold {
        background: linear-gradient(90deg, transparent, hsl(var(--pr-aqua) / 0.55), transparent);
      }

      /* ═══════════ 4. AZIONI ═══════════ */
      .prestige-root .prestige-cta,
      .pglass-btn {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border-radius: 999px;
        padding: .85rem 1.5rem;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: hsl(0 0% 100%);
        background: linear-gradient(135deg, hsl(var(--pr-aqua) / 0.96), hsl(var(--pr-aqua-deep)));
        border: 1px solid hsl(var(--pr-aqua-light) / 0.55);
        box-shadow: 0 18px 44px -20px hsl(var(--pr-aqua) / 0.75);
        transition: all .3s ease;
      }
      .prestige-root .prestige-cta:hover,
      .pglass-btn:hover { gap: .75rem; filter: brightness(1.07); }

      .prestige-root .prestige-cta-ghost,
      .pglass-btn-ghost {
        display: inline-flex;
        align-items: center;
        gap: .5rem;
        border-radius: 999px;
        padding: .85rem 1.5rem;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
        color: hsl(var(--pr-aqua-light));
        background: hsl(var(--pr-glass) / 0.07);
        border: 1px solid hsl(var(--pr-glass) / 0.2);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
        transition: all .3s ease;
      }
      .prestige-root .prestige-cta-ghost:hover,
      .pglass-btn-ghost:hover {
        gap: .75rem;
        background: hsl(var(--pr-aqua) / 0.14);
        border-color: hsl(var(--pr-aqua) / 0.6);
        color: hsl(var(--pr-aqua-light));
      }
      .prestige-root .prestige-light .prestige-cta-ghost,
      .prestige-light .pglass-btn-ghost {
        color: hsl(var(--pr-aqua-deep));
        background: hsl(var(--pr-glass) / 0.6);
        border-color: hsl(var(--pr-aqua) / 0.32);
      }

      /* ═══════════ 5. CHIP / FILTRI ═══════════ */
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
        background: hsl(var(--pr-glass) / 0.6);
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
        background: hsl(var(--pr-glass) / 0.07);
        border: 1px solid hsl(var(--pr-glass) / 0.16);
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
        background: hsl(var(--pr-glass) / 0.22);
        color: hsl(0 0% 100%);
      }
      .pglass-chip-dark .pglass-chip-count { color: hsl(var(--pr-aqua-light)); }

      /* ═══════════ 6. TIPOGRAFIA D'ACCENTO ═══════════ */
      .prestige-root .prestige-gold-text,
      .pglass-aqua-text {
        background: linear-gradient(120deg, hsl(var(--pr-aqua-light)), hsl(var(--pr-aqua)) 55%, hsl(var(--pr-aqua-light)));
        -webkit-background-clip: text;
        background-clip: text;
        color: transparent;
      }
      .prestige-root .prestige-eyebrow,
      .prestige-root .prestige-eyebrow-indexed { letter-spacing: 0.3em; }

      /* input coerenti (form home, brief, vendor) */
      .prestige-root input:not([type="checkbox"]):not([type="radio"]),
      .prestige-root textarea,
      .prestige-root select {
        border-radius: 16px;
      }

      /* ═══════════ 6b. NAV VETRO ═══════════ */
      .empire-glass-nav {
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.09), hsl(0 0% 100% / 0.02)), hsl(202 56% 6% / 0.72);
        border: 1px solid hsl(0 0% 100% / 0.14);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.16), 0 22px 60px -32px hsl(202 56% 4% / 0.9);
      }
      .empire-glass-nav[data-scrolled="true"] {
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.10), hsl(0 0% 100% / 0.03)), hsl(202 56% 5% / 0.93);
        border-color: hsl(178 74% 48% / 0.28);
      }
      .empire-glass-nav .landing-button-primary {
        color: #ffffff !important;
        background: linear-gradient(135deg, hsl(176 82% 62%), hsl(178 74% 44%) 55%, hsl(190 72% 30%));
        box-shadow: 0 22px 60px -28px hsl(178 74% 48% / 0.7), inset 0 1px 0 hsl(0 0% 100% / 0.35);
      }

      /* ═══════════ 7. ONDA DECORATIVA ═══════════ */
      .pglass-wave {
        position: relative;
      }
      .pglass-wave::before {
        content: "";
        position: absolute;
        inset-inline: -5%;
        top: -1px;
        height: 64px;
        pointer-events: none;
        background: radial-gradient(60% 100% at 50% 0%, hsl(var(--pr-aqua) / 0.18), transparent 70%);
        mask-image: radial-gradient(70% 100% at 50% 0%, #000, transparent 75%);
        -webkit-mask-image: radial-gradient(70% 100% at 50% 0%, #000, transparent 75%);
        animation: pglassWave 12s ease-in-out infinite alternate;
      }
      @keyframes pglassWave {
        from { transform: translateX(-3%) scaleY(1); }
        to   { transform: translateX(3%) scaleY(1.25); }
      }

      @media (prefers-reduced-motion: reduce) {
        .prestige-root .prestige-dark,
        .prestige-root .prestige-light,
        .pglass-wave::before { animation: none !important; }
        .pglass, .pglass-soft, .pglass-chip, .pglass-btn { transition: none !important; }
      }
    `}</style>
  );
}
