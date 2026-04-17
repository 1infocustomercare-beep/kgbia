/**
 * PAPERFISH SAKURA THEME — Dark luxury sushi.
 * Replica fedele dei mockup "Paperfish Sushi" (b-luxury-dark + a-sakura).
 * Usato per ristoranti sushi/giapponesi nei demo generati da lead.
 */

export const PAPERFISH = {
  // Sfondi
  bg: "#0E0B0F",          // dark obsidian con sfumatura prugna
  bgDeep: "#070506",      // nero assoluto (cart / footer)
  bgPanel: "#181216",     // pannelli card
  bgSoft: "#221A1F",      // sotto-card / chip
  // Brand sakura
  primary: "#E89BAE",     // sakura pink
  primaryStrong: "#D26F8A",
  primaryGlow: "rgba(232,155,174,0.35)",
  gold: "#C9A86A",        // accento oro caldo (badge/prezzi)
  // Testo
  text: "#F5E9EC",
  textMuted: "rgba(245,233,236,0.62)",
  textSoft: "rgba(245,233,236,0.42)",
  // Divisori
  divider: "rgba(232,155,174,0.18)",
  border: "rgba(255,255,255,0.06)",
  // Font
  fontHead: "'Cormorant Garamond', 'Playfair Display', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
  fontJp: "'Noto Serif JP', 'Cormorant Garamond', serif",
} as const;

export const paperfishCss = `
.paperfish-theme {
  --pf-bg: ${PAPERFISH.bg};
  --pf-bg-deep: ${PAPERFISH.bgDeep};
  --pf-bg-panel: ${PAPERFISH.bgPanel};
  --pf-primary: ${PAPERFISH.primary};
  --pf-primary-strong: ${PAPERFISH.primaryStrong};
  --pf-gold: ${PAPERFISH.gold};
  --pf-text: ${PAPERFISH.text};
  --pf-text-muted: ${PAPERFISH.textMuted};
  --pf-divider: ${PAPERFISH.divider};
  font-family: ${PAPERFISH.fontBody};
  color: var(--pf-text);
  background: var(--pf-bg);
}
.paperfish-theme .font-serif-pf {
  font-family: ${PAPERFISH.fontHead};
  font-weight: 500;
  letter-spacing: 0.02em;
}
.paperfish-theme .font-jp-pf {
  font-family: ${PAPERFISH.fontJp};
  font-weight: 400;
  letter-spacing: 0.18em;
}
`;
