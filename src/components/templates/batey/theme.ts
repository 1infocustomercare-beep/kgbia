/**
 * BATEY PACIFICO THEME — Caribbean azure seafood.
 * Replica fedele dei mockup "Batey" (azure deep + sand+coral accents).
 * Usato per: pescherie, ristoranti di pesce, seafood luxury, yacht charter,
 * boat tour premium. Palette caraibica: profondità oceanica + sabbia tropicale.
 */

export const BATEY = {
  // Sfondi — profondità oceanica
  bg: "#08131F",          // deep ocean (notte tropicale)
  bgDeep: "#040A12",      // abisso (cart / footer)
  bgPanel: "#0F2034",     // pannelli card (acqua profonda)
  bgSoft: "#162F47",      // sotto-card / chip
  // Brand azure caraibico
  primary: "#5CC8D9",     // azure caraibico (acqua chiara)
  primaryStrong: "#2EA8BD",
  primaryGlow: "rgba(92,200,217,0.35)",
  // Accenti caldi
  coral: "#FF8966",       // corallo (CTA secondari, badge popolari)
  sand: "#E8D5A8",        // sabbia tropicale
  gold: "#E8D5A8",        // alias sand per prezzi
  // Testo
  text: "#EFF7FA",
  textMuted: "rgba(239,247,250,0.65)",
  textSoft: "rgba(239,247,250,0.42)",
  // Divisori
  divider: "rgba(92,200,217,0.20)",
  border: "rgba(255,255,255,0.06)",
  // Font — marittimo elegante
  fontHead: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontEs: "'Cormorant Garamond', serif",  // microcopy "Pesca del día"
} as const;

export const bateyCss = `
.batey-theme {
  --bt-bg: ${BATEY.bg};
  --bt-bg-deep: ${BATEY.bgDeep};
  --bt-bg-panel: ${BATEY.bgPanel};
  --bt-primary: ${BATEY.primary};
  --bt-primary-strong: ${BATEY.primaryStrong};
  --bt-coral: ${BATEY.coral};
  --bt-sand: ${BATEY.sand};
  --bt-text: ${BATEY.text};
  --bt-text-muted: ${BATEY.textMuted};
  --bt-divider: ${BATEY.divider};
  font-family: ${BATEY.fontBody};
  color: var(--bt-text);
  background: var(--bt-bg);
}
.batey-theme .font-serif-bt {
  font-family: ${BATEY.fontHead};
  font-weight: 500;
  letter-spacing: 0.02em;
}
.batey-theme .font-es-bt {
  font-family: ${BATEY.fontEs};
  font-style: italic;
  font-weight: 400;
  letter-spacing: 0.16em;
}
`;
