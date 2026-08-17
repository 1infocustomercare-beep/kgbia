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

      /* ═══════════ 1b. SOTTOPAGINE INTERNE — riquadri e bordi coerenti ═══════════ */
      .pglass-stickybar {
        background: hsl(var(--pr-emerald-deep) / 0.72);
        backdrop-filter: blur(22px) saturate(150%);
        -webkit-backdrop-filter: blur(22px) saturate(150%);
        border-top: 1px solid hsl(0 0% 100% / 0.07);
        border-bottom: 1px solid hsl(var(--pr-aqua) / 0.22);
        box-shadow: 0 18px 40px -30px hsl(var(--pr-aqua) / 0.55);
      }
      .pglass-divider {
        border-bottom: 1px solid hsl(0 0% 100% / 0.08);
        position: relative;
      }
      .pglass-divider::after {
        content: "";
        position: absolute;
        left: 0; right: 0; bottom: -1px;
        height: 1px;
        background: linear-gradient(90deg, transparent, hsl(var(--pr-aqua) / 0.4), transparent);
        opacity: .55;
      }
      .pglass-tag {
        display: inline-flex; align-items: center; gap: .4rem;
        border-radius: 999px;
        padding: .3rem .75rem;
        font-size: 10px; font-weight: 700;
        text-transform: uppercase; letter-spacing: .18em;
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02));
        border: 1px solid hsl(0 0% 100% / 0.12);
        color: hsl(var(--pr-text-on-dark) / 0.82);
        backdrop-filter: blur(14px);
        -webkit-backdrop-filter: blur(14px);
      }
      .pglass-tag-accent {
        background: linear-gradient(160deg, hsl(var(--pr-aqua) / 0.20), hsl(var(--pr-aqua-deep) / 0.10));
        border-color: hsl(var(--pr-aqua) / 0.38);
        color: hsl(var(--pr-aqua-light));
      }

      /* ═══════════ 1c. ICONE E TASTI — vetro coerente ═══════════ */
      .pglass-icon-btn {
        display: grid;
        place-items: center;
        border-radius: 999px;
        color: hsl(var(--pr-text-on-dark));
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.09), hsl(0 0% 100% / 0.02));
        border: 1px solid hsl(0 0% 100% / 0.14);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.16), 0 12px 30px -22px hsl(var(--pr-aqua) / 0.65);
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
        transition: transform .4s cubic-bezier(.22,.75,.2,1), border-color .4s ease, box-shadow .4s ease, background .4s ease;
      }
      .pglass-icon-btn:hover {
        transform: translateY(-1px) scale(1.04);
        border-color: hsl(var(--pr-aqua) / 0.5);
        background: linear-gradient(160deg, hsl(var(--pr-aqua) / 0.22), hsl(0 0% 100% / 0.04));
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.24), 0 18px 40px -20px hsl(var(--pr-aqua) / 0.75);
      }
      .pglass-icon-btn:active { transform: translateY(0) scale(0.98); }
      .pglass-icon-btn:focus-visible {
        outline: 2px solid hsl(var(--pr-aqua) / 0.75);
        outline-offset: 3px;
      }
      /* Icone dentro superfici vetro: tinta acqua coerente */
      .pglass-scope .pglass svg, .prestige-root .pglass svg { color: inherit; }
      .pglass-scope .pglass-btn svg, .pglass-scope .pglass-btn-ghost svg,
      .prestige-root .pglass-btn svg, .prestige-root .pglass-btn-ghost svg {
        flex: none;
      }
      /* Focus ring unificato su tutti i tasti della webapp Empire */
      .pglass-scope button:focus-visible, .pglass-scope a:focus-visible,
      .prestige-root button:focus-visible, .prestige-root a:focus-visible {
        outline: 2px solid hsl(var(--pr-aqua) / 0.7);
        outline-offset: 3px;
        border-radius: 999px;
      }

      /* Frecce carousel: stesso vetro dei tasti icona */
      .prestige-root .prestige-arrow, .pglass-scope .prestige-arrow {
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.09), hsl(0 0% 100% / 0.02));
        color: hsl(var(--pr-text-on-dark));
        border: 1px solid hsl(0 0% 100% / 0.14);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.16), 0 12px 30px -22px hsl(var(--pr-aqua) / 0.65);
        backdrop-filter: blur(18px) saturate(150%);
        -webkit-backdrop-filter: blur(18px) saturate(150%);
      }
      .prestige-root .prestige-arrow:hover, .pglass-scope .prestige-arrow:hover {
        background: linear-gradient(160deg, hsl(var(--pr-aqua) / 0.22), hsl(0 0% 100% / 0.04));
        border-color: hsl(var(--pr-aqua) / 0.5);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.24), 0 18px 40px -20px hsl(var(--pr-aqua) / 0.75);
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
        position: relative;
        overflow: hidden;
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.09), hsl(0 0% 100% / 0.02)), hsl(202 56% 6% / 0.62);
        border: 1px solid hsl(0 0% 100% / 0.14);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.16), 0 22px 60px -34px hsl(202 56% 4% / 0.85);
        transition: background .7s cubic-bezier(.22,.75,.2,1), border-color .7s ease,
                    box-shadow .7s ease, backdrop-filter .7s ease;
      }
      /* velo luminoso interno (bordo alto) */
      .empire-glass-nav::before {
        content: "";
        position: absolute;
        inset: 0 0 auto 0;
        height: 1px;
        background: linear-gradient(90deg, transparent, hsl(178 80% 70% / 0.55), transparent);
        opacity: 0.5;
        transition: opacity .7s ease;
        pointer-events: none;
      }
      /* riflesso liquido che scorre lentamente */
      .empire-glass-nav::after {
        content: "";
        position: absolute;
        inset: -40% -10%;
        background: radial-gradient(60% 120% at 20% 0%, hsl(178 74% 55% / 0.16), transparent 70%),
                    radial-gradient(50% 120% at 80% 100%, hsl(190 72% 52% / 0.13), transparent 72%);
        animation: empireNavSheen 16s ease-in-out infinite alternate;
        pointer-events: none;
      }
      @keyframes empireNavSheen {
        0%   { transform: translate3d(-4%, 0, 0) scale(1); opacity: .75; }
        100% { transform: translate3d(4%, 0, 0) scale(1.06); opacity: 1; }
      }
      .empire-glass-nav[data-scrolled="true"] {
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.11), hsl(0 0% 100% / 0.035)), hsl(202 56% 5% / 0.88);
        border-color: hsl(178 74% 48% / 0.30);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.20), 0 26px 70px -34px hsl(178 74% 30% / 0.55);
      }
      .empire-glass-nav[data-scrolled="true"]::before { opacity: 0.9; }
      .empire-glass-nav .landing-button-primary {
        color: #ffffff !important;
        background: linear-gradient(135deg, hsl(176 82% 62%), hsl(178 74% 44%) 55%, hsl(190 72% 30%));
        box-shadow: 0 22px 60px -28px hsl(178 74% 48% / 0.7), inset 0 1px 0 hsl(0 0% 100% / 0.35);
        transition: transform .5s cubic-bezier(.22,.75,.2,1), box-shadow .5s ease, filter .5s ease;
      }
      .empire-glass-nav .landing-button-primary:hover {
        transform: translateY(-1px);
        filter: saturate(1.08);
        box-shadow: 0 26px 70px -26px hsl(178 74% 48% / 0.85), inset 0 1px 0 hsl(0 0% 100% / 0.45);
      }

      /* Pill di navigazione: vetro classy con alone acqua all'hover */
      .empire-nav-pill {
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.07), hsl(0 0% 100% / 0.015));
        border: 1px solid hsl(0 0% 100% / 0.10);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.12);
        transition: transform .5s cubic-bezier(.22,.75,.2,1), border-color .5s ease, box-shadow .5s ease;
      }
      .empire-nav-pill:hover {
        transform: translateY(-1px);
        border-color: hsl(178 74% 55% / 0.42);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.22), 0 14px 34px -18px hsl(178 74% 45% / 0.6);
      }
      .empire-nav-pill:active { transform: translateY(0) scale(.985); }
      .empire-nav-pill-glow {
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: linear-gradient(120deg, var(--gf), var(--gt));
        opacity: 0;
        transition: opacity .5s ease;
      }
      .empire-nav-pill:hover .empire-nav-pill-glow { opacity: 0.9; }
      /* sezione attiva: pill acqua persistente con puntino */
      .empire-nav-pill[data-active="true"] {
        border-color: hsl(178 74% 55% / 0.55);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.24), 0 16px 40px -20px hsl(178 74% 45% / 0.7);
      }
      .empire-nav-pill[data-active="true"] .empire-nav-pill-glow { opacity: 0.42; }
      .empire-nav-pill[data-active="true"]::after {
        content: "";
        position: absolute;
        left: 50%;
        bottom: 3px;
        width: 14px;
        height: 2px;
        transform: translateX(-50%);
        border-radius: 999px;
        background: linear-gradient(90deg, transparent, hsl(178 85% 72%), transparent);
      }
      @media (prefers-reduced-motion: reduce) {
        .empire-glass-nav::after { animation: none; }
      }

      /* ═══════════ 6c. STATI CLASSY (hover / active / focus) ═══════════ */
      /* Focus ring unificato: visibile solo da tastiera, mai su click mouse */
      .empire-nav-pill:focus-visible,
      .empire-nav-ghost:focus-visible,
      .empire-cta-glass:focus-visible,
      .empire-nav-icon-btn:focus-visible,
      .empire-nav-mobile-link:focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px hsl(202 56% 6%), 0 0 0 4px hsl(178 80% 62% / 0.85),
                    0 18px 44px -22px hsl(178 74% 45% / 0.65);
      }

      /* Pill: sweep luminoso sottile all'hover */
      .empire-nav-pill::before {
        content: "";
        position: absolute;
        inset: 0;
        border-radius: 999px;
        background: linear-gradient(115deg, transparent 20%, hsl(0 0% 100% / 0.28) 48%, transparent 76%);
        transform: translateX(-120%);
        opacity: 0;
        transition: transform .85s cubic-bezier(.22,.75,.2,1), opacity .35s ease;
        pointer-events: none;
      }
      .empire-nav-pill:hover::before,
      .empire-nav-pill:focus-visible::before { transform: translateX(120%); opacity: 1; }

      /* Ghost link (Accedi): sottofondo vetro che emerge */
      .empire-nav-ghost {
        position: relative;
        border: 1px solid transparent;
        transition: color .45s ease, background .45s ease, border-color .45s ease,
                    transform .45s cubic-bezier(.22,.75,.2,1);
      }
      .empire-nav-ghost:hover {
        color: hsl(178 40% 97%);
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02));
        border-color: hsl(178 74% 55% / 0.32);
        transform: translateY(-1px);
      }
      .empire-nav-ghost:active { transform: translateY(0) scale(.985); }

      /* CTA vetro: alone che respira all'hover, pressione morbida */
      .empire-cta-glass {
        position: relative;
        overflow: hidden;
        transition: transform .45s cubic-bezier(.22,.75,.2,1), box-shadow .45s ease, filter .45s ease;
      }
      .empire-cta-glass::after {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(115deg, transparent 25%, hsl(0 0% 100% / 0.35) 50%, transparent 75%);
        transform: translateX(-130%);
        transition: transform .9s cubic-bezier(.22,.75,.2,1);
        pointer-events: none;
      }
      .empire-cta-glass:hover::after,
      .empire-cta-glass:focus-visible::after { transform: translateX(130%); }
      .empire-cta-glass:hover { transform: translateY(-2px); filter: saturate(1.06); }
      .empire-cta-glass:active { transform: translateY(0) scale(.982); }

      /* Icon button (hamburger): vetro con alone acqua */
      .empire-nav-icon-btn {
        border: 1px solid hsl(178 74% 60% / 0.28);
        background: linear-gradient(160deg, hsl(0 0% 100% / 0.08), hsl(0 0% 100% / 0.02)), hsl(202 56% 8% / 0.9);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.14), 0 10px 30px -14px hsl(202 60% 3% / 0.9);
        transition: transform .4s cubic-bezier(.22,.75,.2,1), border-color .4s ease, box-shadow .4s ease;
      }
      .empire-nav-icon-btn:hover {
        border-color: hsl(178 74% 60% / 0.5);
        box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.22), 0 16px 40px -18px hsl(178 74% 45% / 0.7);
        transform: translateY(-1px);
      }
      .empire-nav-icon-btn:active { transform: translateY(0) scale(.94); }

      /* Voci menu mobile: barra acqua a sinistra su hover/attivo */
      .empire-nav-mobile-link {
        position: relative;
        transition: background .35s ease, transform .35s cubic-bezier(.22,.75,.2,1);
      }
      .empire-nav-mobile-link::before {
        content: "";
        position: absolute;
        left: 0;
        top: 22%;
        bottom: 22%;
        width: 2px;
        border-radius: 999px;
        background: linear-gradient(180deg, hsl(178 85% 72%), hsl(190 72% 45%));
        opacity: 0;
        transition: opacity .35s ease;
      }
      .empire-nav-mobile-link:hover { background: hsl(0 0% 100% / 0.10); }
      .empire-nav-mobile-link:active { transform: scale(.99); }
      .empire-nav-mobile-link:hover::before,
      .empire-nav-mobile-link[data-active="true"]::before { opacity: 1; }
      .empire-nav-mobile-link[data-active="true"] { background: hsl(178 74% 55% / 0.12); }

      @media (prefers-reduced-motion: reduce) {
        .empire-nav-pill,
        .empire-nav-pill::before,
        .empire-nav-ghost,
        .empire-cta-glass,
        .empire-cta-glass::after,
        .empire-nav-icon-btn,
        .empire-nav-mobile-link { transition-duration: .01ms !important; transform: none !important; }
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

      /* ═══════════ 8. MICRO-INTERAZIONI GLOBALI ═══════════ */
      .prestige-root button,
      .prestige-root a,
      .prestige-root [role="button"],
      .prestige-root input,
      .prestige-root textarea,
      .prestige-root select {
        transition: transform .28s cubic-bezier(.22,1,.36,1),
                    box-shadow .28s ease,
                    border-color .28s ease,
                    background-color .28s ease,
                    color .28s ease, opacity .28s ease;
      }
      .prestige-root button:not(:disabled):hover,
      .prestige-root [role="button"]:not([aria-disabled="true"]):hover {
        transform: translateY(-1px);
      }
      .prestige-root button:not(:disabled):active,
      .prestige-root [role="button"]:not([aria-disabled="true"]):active {
        transform: translateY(0) scale(.985);
      }
      .prestige-root button:disabled,
      .prestige-root [aria-disabled="true"] {
        opacity: .55;
        cursor: not-allowed;
        transform: none !important;
      }
      /* focus ring unificato, solo tastiera */
      .prestige-root :focus-visible {
        outline: none;
        box-shadow: 0 0 0 2px hsl(var(--pr-bg, 200 40% 6%)),
                    0 0 0 4px hsl(var(--pr-aqua) / .55),
                    0 0 24px hsl(var(--pr-aqua) / .28);
        border-radius: inherit;
      }
      /* input glass: hover + focus */
      .prestige-root input:hover,
      .prestige-root textarea:hover { border-color: hsl(var(--pr-aqua) / .35); }
      .prestige-root input:focus,
      .prestige-root textarea:focus { border-color: hsl(var(--pr-aqua) / .6); }

      /* card lift coerente */
      .pglass-lift {
        transition: transform .38s cubic-bezier(.22,1,.36,1), box-shadow .38s ease, border-color .38s ease;
        will-change: transform;
      }
      .pglass-lift:hover {
        transform: translateY(-6px);
        border-color: hsl(var(--pr-aqua) / .38);
        box-shadow: 0 26px 60px -28px hsl(var(--pr-aqua) / .45), inset 0 1px 0 hsl(0 0% 100% / .12);
      }
      .pglass-lift:active { transform: translateY(-2px) scale(.995); }

      /* press feedback tattile (tap mobile) */
      .pglass-press { transition: transform .18s cubic-bezier(.22,1,.36,1), opacity .18s ease; }
      .pglass-press:active { transform: scale(.96); opacity: .9; }

      /* ═══════════ 8bis. GLASS FIELD (GlassInput) ═══════════ */
      .pglass-field:hover { border-color: hsl(var(--pr-aqua) / 0.4) !important; }
      .pglass-field:focus-within {
        border-color: hsl(var(--pr-aqua) / 0.65) !important;
        box-shadow: 0 0 0 3px hsl(var(--pr-aqua) / 0.16), inset 0 1px 0 hsl(0 0% 100% / 0.08) !important;
      }

      /* ═══════════ 8quater. STATI COMPLETI DEI CONTROLLI GLASS ═══════════
         hover · active · disabled · loading · focus-visible · invalid
         Validi su tutta la webapp Empire (non sui siti demo). */

      /* — focus-visible unificato su tutti i controlli glass — */
      .pglass-btn:focus-visible,
      .pglass-btn-ghost:focus-visible,
      .pglass-chip:focus-visible,
      .pglass-icon-btn:focus-visible,
      .pglass-field:focus-visible,
      .pglass-field input:focus-visible,
      .pglass-field textarea:focus-visible,
      .pglass-field select:focus-visible {
        outline: 2px solid hsl(var(--pr-aqua-light) / 0.9);
        outline-offset: 3px;
        box-shadow: 0 0 0 5px hsl(var(--pr-aqua) / 0.18);
      }
      .pglass-field input:focus-visible,
      .pglass-field textarea:focus-visible,
      .pglass-field select:focus-visible {
        outline-offset: 0;
        box-shadow: none;
      }

      /* — active / press — */
      .pglass-btn:not(:disabled):active,
      .pglass-btn-ghost:not(:disabled):active,
      .pglass-chip:not(:disabled):active,
      .pglass-icon-btn:not(:disabled):active {
        transform: translateY(1px) scale(.975);
        filter: brightness(.97);
      }

      /* — hover rifinito — */
      .pglass-btn:not(:disabled):hover {
        box-shadow: 0 22px 52px -20px hsl(var(--pr-aqua) / 0.85);
      }
      .pglass-chip:not(:disabled):hover {
        background: hsl(var(--pr-aqua) / 0.12);
      }

      /* — disabled (bottoni, chip, icone, campi) — */
      .pglass-btn:disabled,
      .pglass-btn[aria-disabled="true"],
      .pglass-btn-ghost:disabled,
      .pglass-btn-ghost[aria-disabled="true"],
      .pglass-chip:disabled,
      .pglass-chip[aria-disabled="true"],
      .pglass-icon-btn:disabled,
      .pglass-icon-btn[aria-disabled="true"] {
        cursor: not-allowed;
        opacity: .48;
        filter: saturate(.35);
        transform: none !important;
        box-shadow: none !important;
        border-color: hsl(var(--pr-glass) / 0.18) !important;
      }
      .pglass-btn:disabled,
      .pglass-btn[aria-disabled="true"] {
        background: hsl(var(--pr-glass) / 0.12) !important;
        color: hsl(var(--pr-text-on-dark) / 0.6) !important;
      }
      .pglass-field[data-disabled="true"] {
        cursor: not-allowed;
        opacity: .5;
        filter: saturate(.4);
      }
      .pglass-field[data-disabled="true"] input,
      .pglass-field[data-disabled="true"] textarea,
      .pglass-field[data-disabled="true"] select { cursor: not-allowed; }

      /* — loading — */
      .pglass-btn[data-loading="true"],
      .pglass-btn-ghost[data-loading="true"],
      .pglass-chip[data-loading="true"],
      .pglass-icon-btn[data-loading="true"] {
        cursor: progress;
        pointer-events: none;
        opacity: .82;
      }
      .pglass-spinner {
        display: inline-block;
        width: 1em;
        height: 1em;
        border-radius: 999px;
        border: 2px solid currentColor;
        border-top-color: transparent;
        border-right-color: transparent;
        animation: pglassSpin .7s linear infinite;
      }
      @keyframes pglassSpin { to { transform: rotate(360deg); } }
      .pglass-field[data-loading="true"] {
        position: relative;
        overflow: hidden;
      }
      .pglass-field[data-loading="true"]::after {
        content: "";
        position: absolute;
        inset-inline: 0;
        bottom: 0;
        height: 2px;
        background: linear-gradient(90deg, transparent, hsl(var(--pr-aqua-light) / .9), transparent);
        animation: pglassFieldLoad 1.1s ease-in-out infinite;
      }
      @keyframes pglassFieldLoad {
        0%   { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }

      /* — invalid / errore — */
      .pglass-field[data-invalid="true"] {
        border-color: hsl(0 78% 62% / .7) !important;
        box-shadow: 0 0 0 3px hsl(0 78% 62% / .16) !important;
      }
      .pglass-field[data-invalid="true"]:focus-within {
        border-color: hsl(0 78% 66% / .85) !important;
        box-shadow: 0 0 0 4px hsl(0 78% 62% / .22) !important;
      }
      .pglass-field-error {
        margin-top: .375rem;
        font-size: 12px;
        font-weight: 600;
        color: hsl(0 84% 72%);
      }
      .pglass-field-hint {
        margin-top: .375rem;
        font-size: 12px;
        color: hsl(var(--pr-text-on-dark) / .62);
      }
      .pglass-field-label {
        display: block;
        margin-bottom: .4rem;
        font-size: 12px;
        font-weight: 700;
        letter-spacing: .04em;
        text-transform: uppercase;
        color: hsl(var(--pr-text-on-dark) / .72);
      }
      .pglass-field[data-readonly="true"] { opacity: .78; }


      /* ═══════════ 8ter. APP SHELL GLOBALE (EmpireGlassShell) ═══════════
         Fondale + tipografia Empire su tutte le pagine della webapp.
         I siti demo NON ricevono queste classi. */
      body.pglass-app {
        /* Token semantici allineati alla home Empire: niente più blu/viola legacy */
        --primary: 178 74% 48%;
        --primary-foreground: 202 56% 8%;
        --accent: 176 82% 62%;
        --accent-foreground: 202 56% 8%;
        --ring: 178 74% 48%;
        --sidebar-primary: 178 74% 48%;
        --sidebar-primary-foreground: 202 56% 8%;
        --sidebar-ring: 178 74% 48%;
        --landing-accent: 178 74% 48%;
        --landing-accent-strong: 176 82% 74%;

        background:
          radial-gradient(ellipse 70% 45% at 15% 0%, hsl(var(--pr-aqua) / 0.10), transparent 62%),
          radial-gradient(ellipse 55% 40% at 88% 12%, hsl(var(--pr-aqua-deep) / 0.16), transparent 68%),
          linear-gradient(180deg, hsl(var(--pr-emerald-deep)), hsl(var(--pr-emerald)) 55%, hsl(var(--pr-emerald-deep)));
        background-attachment: fixed;
        color: hsl(var(--pr-text-on-dark));
        font-family: 'Manrope', 'Inter', system-ui, sans-serif;
      }
      /* Contesti legacy che ridichiarano i token (landing-dark / force-dark / .dark):
         li riallineo all'aqua Empire, così nessuna pagina resta blu o viola. */
      body.pglass-app .landing-dark,
      body.pglass-app .force-dark,
      body.pglass-app .dark,
      body.pglass-app [class*="landing-"] {
        --primary: 178 74% 48%;
        --primary-foreground: 202 56% 8%;
        --accent: 176 82% 62%;
        --ring: 178 74% 48%;
        --landing-accent: 178 74% 48%;
        --landing-accent-strong: 176 82% 74%;
        --empire-violet: 186 78% 54%;
        --empire-violet-deep: 190 72% 34%;
        --empire-violet-glow: 176 82% 72%;
        --neon-blue: 186 82% 56%;
        --neon-cyan: 178 84% 58%;
        --neon-emerald: 172 76% 46%;
      }
      body.pglass-app .bg-vibrant-gradient,
      body.pglass-app .bg-empire-gradient {
        background-image: linear-gradient(135deg, hsl(var(--pr-aqua-deep)), hsl(var(--pr-aqua)) 55%, hsl(var(--pr-aqua-light))) !important;
      }

      body.pglass-app h1, body.pglass-app h2, body.pglass-app h3 {
        font-family: 'Sora', 'Manrope', system-ui, sans-serif;
        letter-spacing: -0.025em;
      }
      body.pglass-app button,
      body.pglass-app a,
      body.pglass-app [role="button"],
      body.pglass-app input,
      body.pglass-app textarea,
      body.pglass-app select {
        transition: transform .28s cubic-bezier(.22,1,.36,1),
                    box-shadow .28s ease,
                    border-color .28s ease,
                    background-color .28s ease,
                    color .28s ease, opacity .28s ease;
      }
      @media (prefers-reduced-motion: reduce) {
        body.pglass-app * { animation-duration: .01ms !important; }
      }




      /* ═══════════ 9. SKELETON LOADING GLASS ═══════════ */
      .pglass-skeleton {
        position: relative;
        overflow: hidden;
        border-radius: 14px;
        background: linear-gradient(180deg, hsl(var(--pr-aqua) / .07), hsl(0 0% 100% / .04));
        border: 1px solid hsl(0 0% 100% / .07);
      }
      .pglass-skeleton::after {
        content: "";
        position: absolute;
        inset: 0;
        transform: translateX(-100%);
        background: linear-gradient(
          90deg,
          transparent 0%,
          hsl(0 0% 100% / .09) 45%,
          hsl(var(--pr-aqua) / .18) 55%,
          transparent 100%
        );
        animation: pglassShimmer 1.7s ease-in-out infinite;
      }
      @keyframes pglassShimmer {
        to { transform: translateX(100%); }
      }

      /* ═══════════ 9b. MICRO-ONDEGGIO IN SCORRIMENTO ═══════════
         Scroll-linked (CSS scroll-driven animations) dove supportato:
         zero JS, compositor-only (transform/opacity), leggibilità intatta. */
      .pglass-drift,
      .pglass-reveal {
        will-change: transform, opacity;
        backface-visibility: hidden;
      }

      @supports (animation-timeline: view()) {
        /* reveal morbido all'ingresso della sezione */
        .pglass-reveal {
          animation: pglassReveal linear both;
          animation-timeline: view();
          animation-range: entry 8% cover 32%;
        }
        /* ondeggio continuo, ampiezza minima (max 8px) legato allo scroll */
        .pglass-drift {
          animation: pglassDrift linear both;
          animation-timeline: view();
          animation-range: cover 0% cover 100%;
        }
        .pglass-drift-alt {
          animation-direction: reverse;
        }
      }

      /* Fallback senza scroll-driven animations: fade-in una volta sola */
      @supports not (animation-timeline: view()) {
        .pglass-reveal { animation: pglassReveal .7s cubic-bezier(.22,1,.36,1) both; }
      }

      @keyframes pglassReveal {
        from { opacity: 0; transform: translate3d(0, 22px, 0) scale(.985); }
        to   { opacity: 1; transform: none; }
      }
      @keyframes pglassDrift {
        0%   { transform: translate3d(0, 8px, 0); }
        50%  { transform: translate3d(0, -6px, 0); }
        100% { transform: translate3d(0, 8px, 0); }
      }

      /* ═══════════ STATI UNIFORMI SU FORM E CONTROLLI NATIVI (webapp Empire) ═══════════ */
      body.pglass-app button:not(:disabled):not([aria-disabled="true"]):hover,
      body.pglass-app [role="button"]:not([aria-disabled="true"]):hover {
        filter: brightness(1.06);
      }
      body.pglass-app button:not(:disabled):not([aria-disabled="true"]):active,
      body.pglass-app [role="button"]:not([aria-disabled="true"]):active {
        transform: translateY(1px) scale(.985);
      }
      body.pglass-app button:disabled,
      body.pglass-app [aria-disabled="true"],
      body.pglass-app input:disabled,
      body.pglass-app select:disabled,
      body.pglass-app textarea:disabled {
        cursor: not-allowed;
        opacity: .5;
        filter: saturate(.4);
        transform: none !important;
        box-shadow: none !important;
      }
      body.pglass-app [aria-busy="true"] { cursor: progress; }
      body.pglass-app input:read-only:not([type="checkbox"]):not([type="radio"]),
      body.pglass-app textarea:read-only { opacity: .8; }
      body.pglass-app input[aria-invalid="true"],
      body.pglass-app select[aria-invalid="true"],
      body.pglass-app textarea[aria-invalid="true"] {
        border-color: hsl(0 78% 62% / .7) !important;
        box-shadow: 0 0 0 3px hsl(0 78% 62% / .16) !important;
      }
      body.pglass-app input:not(:disabled):hover,
      body.pglass-app select:not(:disabled):hover,
      body.pglass-app textarea:not(:disabled):hover {
        border-color: hsl(var(--pr-aqua) / .42);
      }
      body.pglass-app :focus-visible {
        outline: 2px solid hsl(var(--pr-aqua-light) / .9);
        outline-offset: 2px;
      }
      body.pglass-app input[type="checkbox"],
      body.pglass-app input[type="radio"] {
        accent-color: hsl(var(--pr-aqua));
        min-width: 20px;
        min-height: 20px;
      }


      @media (prefers-reduced-motion: reduce) {
        .prestige-root .prestige-dark,
        .prestige-root .prestige-light,
        .pglass-wave::before,
        .pglass-drift,
        .pglass-reveal,
        .pglass-skeleton::after { animation: none !important; }
        .pglass-drift, .pglass-reveal { opacity: 1 !important; transform: none !important; }
        .pglass, .pglass-soft, .pglass-chip, .pglass-btn,
        .pglass-lift, .pglass-press {
          transition: none !important;
          transform: none !important;
        }
        .prestige-root button, .prestige-root a, .prestige-root [role="button"] {
          transition-duration: .01ms !important;
        }
      }

      /* ============================================================
         MOBILE GLASS OPTIMIZATION
         - safe area (notch / home indicator / landscape)
         - nessun overflow orizzontale dalle superfici vetro
         - blur ridotto + tinta piu' densa => leggibile, mai "piatto"
         ============================================================ */
      body.pglass-app {
        overflow-x: hidden;
        overscroll-behavior-y: none;
      }
      body.pglass-app .pglass-stickybar,
      body.pglass-app [data-glass-safe-top] {
        padding-top: max(0px, env(safe-area-inset-top));
      }
      body.pglass-app [data-glass-safe-bottom],
      body.pglass-app .pglass-dock {
        padding-bottom: max(0px, env(safe-area-inset-bottom));
      }
      body.pglass-app .pglass-safe-x {
        padding-left: max(1.25rem, env(safe-area-inset-left));
        padding-right: max(1.25rem, env(safe-area-inset-right));
      }

      @media (max-width: 640px) {
        body.pglass-app .pglass,
        body.pglass-app .pglass-soft,
        body.pglass-app .pglass-panel,
        body.pglass-app .pglass-card {
          max-width: 100%;
          /* piu' opacita' e bordo interno visibile: evita zone piatte su OLED */
          background:
            linear-gradient(180deg, hsl(0 0% 100% / .09), transparent 22%),
            linear-gradient(160deg, hsl(var(--pr-aqua) / .12), transparent 58%),
            radial-gradient(120% 80% at 50% 118%, hsl(var(--pr-aqua) / .12), transparent 70%),
            hsl(196 42% 8% / .76);
          backdrop-filter: blur(16px) saturate(160%);
          -webkit-backdrop-filter: blur(16px) saturate(160%);
          box-shadow:
            inset 0 1px 0 hsl(0 0% 100% / .12),
            0 14px 34px -20px hsl(190 90% 6% / .85);
        }
        body.pglass-app .pglass-stickybar {
          backdrop-filter: blur(18px) saturate(150%);
          -webkit-backdrop-filter: blur(18px) saturate(150%);
          background: hsl(196 44% 7% / .82);
        }
        /* i blob decorativi non devono generare scroll laterale */
        body.pglass-app .pglass-wave::before,
        body.pglass-app .pglass-glow,
        body.pglass-app [data-glass-blob] {
          max-width: 100vw;
          pointer-events: none;
        }
        body.pglass-app .pglass-scroll-x {
          padding-left: max(1.25rem, env(safe-area-inset-left));
          padding-right: max(1.25rem, env(safe-area-inset-right));
          scroll-padding-left: 1.25rem;
        }
      }

      /* schermi molto piccoli o GPU debole: blur minimo, tinta solida */
      @media (max-width: 380px) {
        body.pglass-app .pglass,
        body.pglass-app .pglass-soft,
        body.pglass-app .pglass-chip,
        body.pglass-app .pglass-btn {
          backdrop-filter: blur(12px) saturate(150%);
          -webkit-backdrop-filter: blur(12px) saturate(150%);
        }
      }

      /* fallback: nessun supporto backdrop-filter => superfici opache coerenti */
      @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
        body.pglass-app .pglass,
        body.pglass-app .pglass-soft,
        body.pglass-app .pglass-chip,
        body.pglass-app .pglass-btn,
        body.pglass-app .pglass-stickybar {
          background: hsl(196 44% 9% / .96) !important;
          border-color: hsl(var(--pr-aqua) / .28) !important;
        }
      }

      /* utenti che riducono la trasparenza: leggibilita' prima di tutto */
      @media (prefers-reduced-transparency: reduce) {
        body.pglass-app .pglass,
        body.pglass-app .pglass-soft,
        body.pglass-app .pglass-chip,
        body.pglass-app .pglass-btn,
        body.pglass-app .pglass-stickybar {
          backdrop-filter: none !important;
          -webkit-backdrop-filter: none !important;
          background: hsl(196 44% 9% / .97) !important;
        }
      }
    `}</style>
  );
}
