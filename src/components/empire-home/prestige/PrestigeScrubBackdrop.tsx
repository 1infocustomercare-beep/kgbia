/**
 * PrestigeScrubBackdrop — sfondo globale della home Prestige.
 *
 * Versione professionale: niente più particelle animate su canvas (effetto
 * "screensaver" giudicato poco professionale). Ora è un layer fisso, sobrio e
 * puramente CSS:
 *  - base gradient profondo (definito in PrestigeTheme)
 *  - due aure diffuse viola/oro in respiro lentissimo
 *  - griglia tecnica finissima con fade radiale
 *  - vignette per il contrasto dei contenuti
 *
 * Zero RAF, zero listener: nessun costo di runtime, nessun jank su mobile.
 */
export default function PrestigeScrubBackdrop() {
  return (
    <div className="prestige-scrub-backdrop" aria-hidden="true">
      <div className="prestige-scrub-aura prestige-scrub-aura--violet" />
      <div className="prestige-scrub-aura prestige-scrub-aura--gold" />
      <div className="prestige-scrub-grid" />
      <div className="prestige-scrub-vignette" />
    </div>
  );
}
