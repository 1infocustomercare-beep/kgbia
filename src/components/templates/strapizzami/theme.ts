/**
 * STRAPIZZAMI THEME — Cream parchment + terracotta + serif Crimson.
 * Replica fedele delle 4 preview iPhone caricate dal cliente.
 * Usato per pizzerie tradizionali/napoletane nei demo generati da lead.
 */

export const STRAPIZZAMI = {
  // Sfondi
  bg: "#F5EDE0",         // cream parchment (Home/Menu/Detail)
  bgDeep: "#E8D9BF",     // sfondo carrello (più caldo, texture pergamena)
  bgWood: "#3E2418",     // legno scuro (sfondo Home grid consigli)
  card: "#FFF9EE",       // card prodotti
  cardSoft: "#FAF1E0",   // card secondarie
  // Brand
  primary: "#B6452D",    // terracotta scuro (button + titoli)
  primaryLight: "#D8694A",
  primaryDark: "#8E3320",
  // Testo
  text: "#2C1810",       // marrone scurissimo
  textMuted: "#6B4A35",
  textSoft: "#8B6F4F",
  // Divisori / accenti
  divider: "rgba(182,69,45,0.2)",
  badge: "#B6452D",      // badge numerati cart
  // Font
  fontHead: "'Crimson Pro', 'Playfair Display', Georgia, serif",
  fontBody: "'Inter', system-ui, sans-serif",
} as const;

export const strapizzamiCss = `
.strapizzami-theme {
  --strap-bg: ${STRAPIZZAMI.bg};
  --strap-bg-deep: ${STRAPIZZAMI.bgDeep};
  --strap-bg-wood: ${STRAPIZZAMI.bgWood};
  --strap-card: ${STRAPIZZAMI.card};
  --strap-card-soft: ${STRAPIZZAMI.cardSoft};
  --strap-primary: ${STRAPIZZAMI.primary};
  --strap-primary-light: ${STRAPIZZAMI.primaryLight};
  --strap-primary-dark: ${STRAPIZZAMI.primaryDark};
  --strap-text: ${STRAPIZZAMI.text};
  --strap-text-muted: ${STRAPIZZAMI.textMuted};
  --strap-divider: ${STRAPIZZAMI.divider};
  font-family: ${STRAPIZZAMI.fontBody};
  color: var(--strap-text);
  background: var(--strap-bg);
}
.strapizzami-theme .font-serif-strap {
  font-family: ${STRAPIZZAMI.fontHead};
  font-weight: 700;
  letter-spacing: 0.01em;
}
`;
