/**
 * Empire — STYLE MATRIX (regole forti per identità)
 * -------------------------------------------------
 * Ogni identità mockup riceve un RULE SET vincolante su:
 *   tipografia (scala + tracking + case), spaziatura (unità + gutter + ritmo),
 *   linee/bordi, riquadri/card, componenti UI (che widget usare e come),
 *   micro-animazioni, palette d'uso (dove va l'accento), chrome di sistema.
 *
 * Regola ferrea: le combinazioni sono ASSEGNATE IN MODO UNIVOCO — nessuna
 * identità condivide lo stesso set di assi (validato da `assertStyleVariance`).
 * Questo evita i "mockup uguali con piccole modifiche".
 */
import { FULL_IDENTITIES } from "./mockup-identity-registry";
import type { MockupIdentity } from "./mockup-identity-matrix";

/* ------------------------------------------------------------------ ASSI */

/** Scale tipografiche: display/section/body/micro in px + case + tracking. */
export const TYPE_SCALES = [
  { key: "editorial-giant", scale: "58/22/16/10", case: "Title Case + micro-caps", tracking: "display -0.03em · micro 0.16em", leading: "0.92 / 1.5" },
  { key: "swiss-tight", scale: "26/17/14/11", case: "Sentence case", tracking: "0em · micro 0.06em", leading: "1.1 / 1.45" },
  { key: "brutal-slab", scale: "44/20/13/12", case: "ALL CAPS aggressivo", tracking: "-0.02em · micro 0.02em", leading: "0.88 / 1.3" },
  { key: "couture-didone", scale: "42/19/14/10", case: "Title Case elegante", tracking: "0.02em · micro 0.24em", leading: "1.0 / 1.6" },
  { key: "geometric-compact", scale: "30/18/15/11", case: "Sentence case", tracking: "-0.01em · micro 0.12em", leading: "1.05 / 1.5" },
  { key: "mono-technical", scale: "24/16/13/11", case: "lowercase tecnico", tracking: "0.04em monospazio", leading: "1.2 / 1.55" },
  { key: "humanist-soft", scale: "34/20/16/12", case: "Title Case morbido", tracking: "0em · micro 0.08em", leading: "1.15 / 1.6" },
  { key: "poster-condensed", scale: "52/24/15/11", case: "CAPS condensato", tracking: "-0.04em", leading: "0.9 / 1.4" },
  { key: "numeric-first", scale: "36/18/14/10", case: "numerali tabulari protagonisti", tracking: "0.01em", leading: "1.0 / 1.45" },
  { key: "airy-serif", scale: "38/21/17/12", case: "Title Case arioso", tracking: "0.01em · micro 0.18em", leading: "1.25 / 1.7" },
] as const;

/** Sistemi di spaziatura: unità base, gutter, ritmo verticale, densità. */
export const SPACING_SYSTEMS = [
  { key: "grid-4-dense", unit: "4pt", gutter: "10px", rhythm: "sezioni 16px, card 8px", padding: "14px" },
  { key: "grid-8-balanced", unit: "8pt", gutter: "16px", rhythm: "sezioni 32px, card 16px", padding: "20px" },
  { key: "grid-10-airy", unit: "10pt", gutter: "24px", rhythm: "sezioni 56px, card 24px", padding: "28px" },
  { key: "grid-6-editorial", unit: "6pt", gutter: "18px", rhythm: "sezioni 48px asimmetriche", padding: "22px" },
  { key: "grid-12-columnar", unit: "8pt su 12 colonne visibili", gutter: "12px", rhythm: "righe 24px costanti", padding: "16px" },
  { key: "grid-edge-to-edge", unit: "8pt", gutter: "0px (full-bleed)", rhythm: "blocchi a contatto, divisori 1px", padding: "0/16px" },
] as const;

/** Linguaggio di linee e bordi. */
export const LINE_LANGUAGES = [
  { key: "hairline-rule", desc: "filetti 1px pieni tra ogni riga, nessuna ombra" },
  { key: "hard-2px-outline", desc: "outline 2px nero su ogni blocco, offset shadow solido 4px" },
  { key: "no-border-soft-shadow", desc: "zero bordi, ombre diffuse 24px basse opacità" },
  { key: "inner-glow-hairline", desc: "bordo rgba 8% + inner glow 1px, superfici scure" },
  { key: "dashed-technical", desc: "tratteggi tecnici 1px + tick marks come su strumenti" },
  { key: "double-rule-classic", desc: "doppio filetto classico, cornici tipografiche" },
  { key: "gradient-edge", desc: "bordi a gradiente che sfumano, nessun divisorio pieno" },
  { key: "frosted-stroke", desc: "vetro con stroke 1px luminoso in alto, blur 20px" },
] as const;

/** Riquadri/card. */
export const BOX_STYLES = [
  { key: "square-flat", desc: "radius 0, superfici piatte, nessuna elevazione" },
  { key: "pill-soft", desc: "radius 28px, card morbide con elevazione bassa" },
  { key: "chamfer-tech", desc: "radius 4px con angoli smussati e badge d'angolo" },
  { key: "glass-panel", desc: "pannelli vetro traslucidi sovrapposti alla foto" },
  { key: "ticket-notch", desc: "card con tacche laterali stile biglietto/coupon" },
  { key: "framed-plate", desc: "card con cornice interna e passepartout (galleria)" },
  { key: "stacked-paper", desc: "fogli sovrapposti con leggero offset e ombra dura" },
  { key: "bento-mosaic", desc: "mosaico bento a moduli disuguali" },
] as const;

/** Kit componenti dominante della schermata. */
export const COMPONENT_KITS = [
  { key: "list-rows-pricing", desc: "righe listino con prezzi tabulari a destra e filetti" },
  { key: "carousel-cards", desc: "carosello orizzontale con card a bordo tagliato" },
  { key: "segmented-tabs-tables", desc: "segmented control + tabelle dati compatte" },
  { key: "chips-grid-cards", desc: "chip filtro sticky + griglia 2 colonne" },
  { key: "timeline-steps", desc: "timeline verticale con stati e ETA" },
  { key: "big-metric-blocks", desc: "blocchi metrica enormi + sparkline sottili" },
  { key: "map-floating-sheet", desc: "mappa full-bleed con bottom sheet flottante" },
  { key: "calendar-slots", desc: "date strip + griglia slot con stati esauriti" },
  { key: "media-first-editorial", desc: "foto full-bleed + didascalie tipografiche" },
  { key: "form-stepper", desc: "wizard a step con indicatore e campi larghi" },
] as const;

/** Micro-animazioni (dichiarate nel prompt come stato "in movimento congelato"). */
export const MICRO_MOTIONS = [
  { key: "ink-reveal", desc: "titoli che entrano con maschera verticale, mostrato a metà rivelazione" },
  { key: "spring-press", desc: "CTA in stato premuto con scala 0.96 e alone di pressione" },
  { key: "shimmer-load", desc: "una card in skeleton shimmer accanto a card caricate" },
  { key: "count-up", desc: "numeri in count-up con cifra parzialmente ruotata" },
  { key: "sheet-drag", desc: "bottom sheet trascinato a metà con handle evidenziato" },
  { key: "parallax-scroll", desc: "hero in parallasse con header già compresso" },
  { key: "pulse-live", desc: "badge live con anello pulsante e stato in aggiornamento" },
  { key: "swipe-peek", desc: "carosello con card successiva già visibile in peek" },
  { key: "morph-tab", desc: "indicatore tab in transizione tra due voci" },
  { key: "progress-fill", desc: "barra di avanzamento a riempimento con tacca animata" },
] as const;

/** Uso dell'accento colore. */
export const ACCENT_USAGES = [
  { key: "cta-only", desc: "accento solo su CTA e stati attivi, resto neutro" },
  { key: "full-flood", desc: "accento come fondo di intere sezioni" },
  { key: "hairline-details", desc: "accento solo su filetti, tick e micro-label" },
  { key: "type-highlight", desc: "accento sulla tipografia (parole chiave evidenziate)" },
  { key: "badge-system", desc: "accento su badge e pill di stato" },
  { key: "gradient-wash", desc: "accento in gradiente morbido su superfici" },
  { key: "duotone-photo", desc: "accento come duotone sulle fotografie, UI monocroma" },
  { key: "accent-underlay", desc: "accento solo dietro i blocchi come sottofondo pieno, testo neutro sopra" },
] as const;

/** Chrome di sistema iOS + navigazione. */
export const CHROME_MODES = [
  { key: "floating-frosted-tabbar", desc: "tab bar flottante frosted con 4 icone" },
  { key: "flat-tabbar-topline", desc: "tab bar piatta con indicatore 2px superiore" },
  { key: "no-tabbar-bottom-cta", desc: "nessuna tab bar, CTA sticky a piena larghezza" },
  { key: "top-segmented-only", desc: "solo segmented control in testa, navigazione a scroll" },
  { key: "large-title-collapsing", desc: "large title iOS in stato compresso con back" },
  { key: "sidebar-drawer-hint", desc: "hamburger + drawer aperto al 20% sul bordo" },
  { key: "capsule-dock-3", desc: "dock capsula centrata con 3 voci e pill attiva" },
  { key: "rail-left-icons", desc: "rail verticale di icone a sinistra, contenuto a destra" },
] as const;

/**
 * MATERIALE della superficie UI: dà a ogni identità una "pelle" diversa,
 * non solo colori differenti.
 */
export const SURFACE_MATERIALS = [
  { key: "matte-paper", desc: "superfici carta opaca con grana finissima, nessun riflesso" },
  { key: "polished-lacquer", desc: "lacca lucida profonda con riflessi speculari morbidi" },
  { key: "brushed-metal", desc: "metallo satinato con micro-striature direzionali" },
  { key: "frosted-glass", desc: "vetro satinato con blur reale e bordi luminosi" },
  { key: "linen-textile", desc: "tessuto lino con trama visibile sulle sezioni" },
  { key: "concrete-mineral", desc: "cemento minerale con macchie tonali sottili" },
  { key: "warm-parchment", desc: "pergamena calda con bordi leggermente più scuri" },
  { key: "obsidian-oled", desc: "nero OLED assoluto con superfici che emergono per luce" },
] as const;

/** Trattamento delle immagini/fotografie dentro la UI. */
export const IMAGE_TREATMENTS = [
  { key: "full-bleed-cinema", desc: "foto a pieno campo con gradiente di leggibilità in basso" },
  { key: "framed-passepartout", desc: "foto in cornice con ampio passepartout e didascalia" },
  { key: "circular-crop", desc: "ritagli circolari o a arco, mai rettangoli semplici" },
  { key: "collage-overlap", desc: "due foto sovrapposte con offset e ombra dura" },
  { key: "grain-film", desc: "foto con grana pellicola e leggera vignettatura" },
  { key: "high-key-clean", desc: "foto luminosissime su fondo chiaro, ombre quasi assenti" },
  { key: "macro-detail", desc: "solo macro dettaglio materico, mai inquadrature larghe" },
  { key: "editorial-diptych", desc: "dittico verticale con due foto separate da un filetto" },
] as const;

/** Iconografia + dataviz: cambia il "carattere" degli elementi funzionali. */
export const ICON_SYSTEMS = [
  { key: "thin-line-1px", desc: "icone lineari 1px, geometriche, nessun riempimento" },
  { key: "solid-glyph", desc: "glifi pieni compatti dentro pastiglie" },
  { key: "duotone-icons", desc: "icone duotone con accento sul livello secondario" },
  { key: "hand-etched", desc: "icone incise stile etichetta artigianale" },
  { key: "rounded-bubble", desc: "icone molto arrotondate dentro cerchi morbidi" },
  { key: "technical-tick", desc: "icone tecniche con tacche, mirini e quadranti" },
] as const;


export type StyleRules = {
  identityId: string;
  type: (typeof TYPE_SCALES)[number];
  spacing: (typeof SPACING_SYSTEMS)[number];
  line: (typeof LINE_LANGUAGES)[number];
  box: (typeof BOX_STYLES)[number];
  kit: (typeof COMPONENT_KITS)[number];
  motion: (typeof MICRO_MOTIONS)[number];
  accent: (typeof ACCENT_USAGES)[number];
  chrome: (typeof CHROME_MODES)[number];
  material: (typeof SURFACE_MATERIALS)[number];
  imagery: (typeof IMAGE_TREATMENTS)[number];
  icons: (typeof ICON_SYSTEMS)[number];
  /** firma testuale univoca del set di regole */
  signature: string;
};

/* --------------------------------------------------- assegnazione univoca */

/**
 * Assegnazione deterministica e SENZA COLLISIONI: passo coprimo su ogni asse,
 * poi perturbazione greedy fino a firma univoca (nessuna identità può
 * condividere l'intero set di regole con un'altra).
 */
const AXES = [TYPE_SCALES, SPACING_SYSTEMS, LINE_LANGUAGES, BOX_STYLES, COMPONENT_KITS, MICRO_MOTIONS, ACCENT_USAGES, CHROME_MODES, SURFACE_MATERIALS, IMAGE_TREATMENTS, ICON_SYSTEMS] as const;

const STRIDES = [1, 5, 5, 7, 11, 13, 17, 19, 23, 29, 31];


function buildRules(): Record<string, StyleRules> {
  const out: Record<string, StyleRules> = {};
  const used = new Set<string>();
  const ordered = [...FULL_IDENTITIES].sort((a, b) => a.id.localeCompare(b.id));

  ordered.forEach((identity, i) => {
    const idx = AXES.map((axis, a) => (i * STRIDES[a] + a * 2) % axis.length);
    const sigOf = () => idx.map((v, a) => AXES[a][v].key).join("/");

    // perturbazione greedy: ruota un asse alla volta finché la firma è unica
    let guard = 0;
    while (used.has(sigOf()) && guard < 512) {
      const a = guard % AXES.length;
      idx[a] = (idx[a] + 1) % AXES[a].length;
      guard++;
    }
    const signature = sigOf();
    used.add(signature);

    out[identity.id] = {
      identityId: identity.id,
      type: TYPE_SCALES[idx[0]],
      spacing: SPACING_SYSTEMS[idx[1]],
      line: LINE_LANGUAGES[idx[2]],
      box: BOX_STYLES[idx[3]],
      kit: COMPONENT_KITS[idx[4]],
      motion: MICRO_MOTIONS[idx[5]],
      accent: ACCENT_USAGES[idx[6]],
      chrome: CHROME_MODES[idx[7]],
      material: SURFACE_MATERIALS[idx[8]],
      imagery: IMAGE_TREATMENTS[idx[9]],
      icons: ICON_SYSTEMS[idx[10]],
      signature,
    };
  });
  return out;
}


export const STYLE_RULES: Record<string, StyleRules> = buildRules();

export function getStyleRules(identityId: string): StyleRules | undefined {
  return STYLE_RULES[identityId];
}

/** Nessuna identità condivide la stessa firma di regole. */
export function assertStyleVariance() {
  const bag = new Map<string, string[]>();
  Object.values(STYLE_RULES).forEach((r) => bag.set(r.signature, [...(bag.get(r.signature) ?? []), r.identityId]));
  const duplicates: string[] = [];
  bag.forEach((ids, sig) => { if (ids.length > 1) duplicates.push(`${sig} → ${ids.join(", ")}`); });
  return { ok: duplicates.length === 0, duplicates, total: Object.keys(STYLE_RULES).length };
}

/* ------------------------------------------------------------- prompting */

/** Regole di inquadratura NON negoziabili (verificate da scripts/mockup-frame-qa.py). */
export const FRAMING_CONTRACT = [
  "un solo iPhone 17 Pro Max, perfettamente frontale, verticale, zero rotazione o prospettiva",
  "telefono interamente dentro l'inquadratura con margine libero su tutti i lati",
  "TUTTA la UI dentro il display: nessun riquadro, testo, badge o cornice fuori dallo schermo",
  "nessun testo tagliato o troncato, nessuna ellissi, nessun secondo telefono o cornice nel telefono",
  "nessun watermark, nessuna didascalia sovrapposta alla scena",
  "display nitido, pixel-perfect, resa realistica del vetro senza riflessi che coprano la UI",
].join("; ");

/**
 * Regole di CONTENUTO non negoziabili: il modello deve scrivere copy reale
 * italiano, non ripetere le istruzioni di stile come testo dentro lo schermo.
 */
export const CONTENT_CONTRACT = [
  "tutti i testi visibili sono copy reale in italiano coerente col brand (nomi di piatti/servizi/persone plausibili, prezzi in €, orari, date)",
  "VIETATO scrivere nello schermo termini descrittivi del brief: mai 'giant headline', 'display serif', 'price pill', 'two-line titles', 'accent rule', 'lorem', 'placeholder', 'card', 'component'",
  "nessuna parola inventata o storpiata: solo italiano corretto e leggibile",
  "l'ultima riga o card visibile deve essere completa: nessun elemento tagliato dal bordo inferiore del display",
  "immagine finale VERTICALE, formato ritratto 3:4, il telefono occupa la maggior parte dell'altezza",
].join("; ");

/**
 * Regole di RIFINITURA: alzano la qualità percepita (gerarchia, profondità,
 * densità informativa, cura dei dettagli) senza appiattire le identità.
 */
export const CRAFT_CONTRACT = [
  "gerarchia visiva a 3 livelli chiari: un solo elemento dominante, un livello di supporto, un livello di dettaglio micro",
  "allineamento ottico impeccabile: baseline coerenti, numeri tabulari allineati a destra, icone centrate nel loro box",
  "profondità reale coerente col materiale: ombre con una sola direzione di luce, mai ombre contraddittorie",
  "densità informativa alta ma respirata: ogni schermata mostra dati veri (prezzi, orari, percentuali, nomi) e almeno uno stato (attivo, esaurito, in corso)",
  "raggi, spessori e spaziature costanti dentro la stessa schermata: nessun mix casuale di radius o bordi",
  "riquadri con contenuto bilanciato: nessuna card mezza vuota, nessun blocco che sfora il proprio bordo",
  "colori dalla palette dichiarata, massimo un accento dominante per schermata, contrasto testo/fondo sempre leggibile",
  "finitura da portfolio d'agenzia: livello di dettaglio superiore ai reference, mai piatta o generica",
].join("; ");

export function buildScreenPrompt(identity: MockupIdentity, screenKey: string): string {
  const rules = STYLE_RULES[identity.id];
  const screen = identity.screens.find((s) => s.key === screenKey) ?? identity.screens[0];
  const p = identity.palette;
  return [
    `Mockup fotorealistico di app iOS in italiano — identità "${identity.label}" per ${identity.brand} (${identity.tagline}).`,
    `Schermata: ${screen.title} — ${screen.purpose}. Funzioni da rappresentare (rendile con contenuti reali, NON scrivere queste parole): ${screen.elements.join(", ")}.`,
    `Palette: fondo ${p.bg}, superfici ${p.surface}, testo ${p.text}, muted ${p.muted}, accento ${p.accent}, secondario ${p.accent2}.`,
    `Tipografia: ${identity.typography.display} / ${identity.typography.body} / ${identity.typography.treatment}. Scala ${rules?.type.scale} (${rules?.type.key}), ${rules?.type.case}, tracking ${rules?.type.tracking}, leading ${rules?.type.leading}.`,
    `Spaziatura: ${rules?.spacing.key} — unità ${rules?.spacing.unit}, gutter ${rules?.spacing.gutter}, ritmo ${rules?.spacing.rhythm}, padding ${rules?.spacing.padding}.`,
    `Linee: ${rules?.line.desc}. Riquadri: ${rules?.box.desc}.`,
    `Materiale delle superfici: ${rules?.material.desc}. Trattamento immagini: ${rules?.imagery.desc}. Iconografia: ${rules?.icons.desc}.`,
    `Componenti dominanti (adattali allo scopo della schermata, senza tradirne il linguaggio): ${rules?.kit.desc}. Uso accento: ${rules?.accent.desc}. Chrome: ${rules?.chrome.desc}.`,
    `Micro-animazione congelata nel frame: ${rules?.motion.desc}.`,
    `Fotografia della scena: ${identity.photography}. Composizione UI: ${identity.composition}.`,
    `Vincoli di inquadratura: ${FRAMING_CONTRACT}.`,
    `Vincoli di contenuto: ${CONTENT_CONTRACT}.`,
    `Vincoli di rifinitura: ${CRAFT_CONTRACT}.`,
  ].join("\n");
}


