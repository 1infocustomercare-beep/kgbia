import { usePrestigeLang } from "./PrestigeLang";

/**
 * Premium agency-style marquee strip. Additive: sits as a thin band between
 * sections to add editorial rhythm without duplicating any existing content.
 * Pauses on hover (desktop) and respects prefers-reduced-motion.
 */
export default function PrestigeMarquee() {
  const { lang } = usePrestigeLang();

  const items =
    lang === "it"
      ? [
          "Atelier digitale",
          "Disponibili Q1 2026",
          "Made in Italy",
          "Cinematic web · Brand systems · AI",
          "Selezione clienti",
          "Riservatezza totale",
        ]
      : [
          "Digital atelier",
          "Available Q1 2026",
          "Made in Italy",
          "Cinematic web · Brand systems · AI",
          "Selected clients",
          "Total confidentiality",
        ];

  const row = [...items, ...items];

  return (
    <div
      className="prestige-marquee prestige-dark"
      aria-hidden="true"
      role="presentation"
    >
      <div className="prestige-marquee__track">
        {row.map((t, i) => (
          <span key={i} className="prestige-marquee__item">
            <span className="prestige-marquee__dot" />
            <span className="prestige-marquee__text">{t}</span>
          </span>
        ))}
      </div>
    </div>
  );
}
