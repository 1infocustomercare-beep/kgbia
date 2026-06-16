/**
 * Empire Mockup Style Presets
 * ----------------------------
 * 12 preset premium ispirati ai mockup interni del portfolio Empire Studio
 * (Sakura Atelier, Indocina Noir, Neo Nails, Asinara, Cote Miami, Texas Horse Ranch,
 *  Dimora, MMI Resident, Pokewaii, FAR Medical, Arcobaleno Playhouse, Pacifico Ceviche).
 *
 * Ogni preset definisce:
 *  - palette colori coerente (4 stop)
 *  - coppia font Google Fonts (heading + body)
 *  - layout architetturale (hero/section style)
 *  - tono/mood per AI copy + hero image
 *  - sector hint per auto-match nel Demo Factory
 *
 * Usato sia dal frontend (selettore UI) sia dalle edge functions
 * (custom-preview-generator, lead-mockup-suite).
 */

export type MockupStylePreset = {
  /** chiave stabile usata come template_style nel DB */
  key: string;
  label: string;
  /** breve descrizione mostrata nel selettore */
  description: string;
  /** badge categoria mostrato all'utente */
  category:
    | "Editorial Luxury"
    | "Glassmorphism"
    | "Mediterranean Luxury"
    | "Dark Premium"
    | "Warm Nature"
    | "Light Minimal";
  /** sector keywords per auto-match (lowercase) */
  sectorMatch: string[];
  /** swatch UI: 4 colori chiave */
  swatch: [string, string, string, string];
  /** palette tematica completa */
  palette: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    cardBg: string;
  };
  /** Google Fonts pair */
  fonts: {
    heading: string;
    body: string;
    /** url query per fonts.googleapis.com */
    googleFontsQuery: string;
  };
  /** layout architetturale del sito generato */
  layout:
    | "editorial-magazine" // hero asimmetrico, serif gigante, sezioni a colonne
    | "split-luxury" // 50/50 hero, cards eleganti
    | "glass-overlay" // blur, panels semi-trasparenti, depth
    | "centered-minimal" // centrato, molto whitespace
    | "bento-grid" // grid modulare hero+cards
    | "magazine-stack"; // sezioni stack full-width come riviste
  /** corner radius globale (in px) */
  radius: number;
  /** intensità ombra: subtle | medium | dramatic */
  shadow: "subtle" | "medium" | "dramatic";
  /** mood per AI copy generation */
  copyTone: string;
  /** hint visuale per AI hero image */
  heroImagePrompt: string;
};

export const MOCKUP_STYLE_PRESETS: MockupStylePreset[] = [
  // ─────────── EDITORIAL LUXURY (Empire Studio signature) ───────────
  {
    key: "sakura_editorial",
    label: "Sakura Editorial",
    description:
      "Editoriale giapponese: bianco puro, nero inchiostro, rosso sakura. Ispirato a Sakura Atelier.",
    category: "Editorial Luxury",
    sectorMatch: ["sushi", "ristorante giapponese", "nikkei", "asiatico", "ramen"],
    swatch: ["#FFFFFF", "#0D0D0D", "#D7263D", "#F5E6E0"],
    palette: {
      bg: "#FAFAF7",
      surface: "#FFFFFF",
      text: "#0D0D0D",
      muted: "#6B6B6B",
      accent: "#D7263D",
      accentSoft: "#F5E6E0",
      cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Cormorant Garamond",
      body: "Inter",
      googleFontsQuery:
        "family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700",
    },
    layout: "editorial-magazine",
    radius: 4,
    shadow: "subtle",
    copyTone:
      "tono editoriale raffinato, frasi brevi e poetiche, vocabolario gastronomico colto, riferimenti alla tradizione giapponese senza essere folkloristico",
    heroImagePrompt:
      "fotografia editoriale food premium, illuminazione naturale morbida, sfondo bianco minimal, composizione asimmetrica giapponese wabi-sabi",
  },
  {
    key: "noir_saigon",
    label: "Noir Saigon",
    description:
      "Vietnamita luxury: nero profondo, oro antico, accenti giada. Ispirato a Indocina Noir Beverly Hills.",
    category: "Dark Premium",
    sectorMatch: ["vietnamita", "fine dining", "asiatico luxury", "pho"],
    swatch: ["#0A0807", "#C9A24C", "#1F4E3D", "#E8D9B0"],
    palette: {
      bg: "#0A0807",
      surface: "#15110D",
      text: "#F2E9D8",
      muted: "#A89274",
      accent: "#C9A24C",
      accentSoft: "#3A2E1A",
      cardBg: "rgba(201,162,76,0.06)",
    },
    fonts: {
      heading: "Playfair Display",
      body: "Manrope",
      googleFontsQuery:
        "family=Playfair+Display:wght@400;600;700;900&family=Manrope:wght@300;400;500;600;700",
    },
    layout: "magazine-stack",
    radius: 8,
    shadow: "dramatic",
    copyTone:
      "tono cinematografico evocativo, descrizioni sensoriali ricche, eleganza sussurrata, eredità coloniale francese",
    heroImagePrompt:
      "fotografia cinematografica dark moody, illuminazione laterale calda dorata, vapore, dettagli ottone, atmosfera notturna lussuosa",
  },
  {
    key: "cote_obsidian",
    label: "Côte Obsidian",
    description:
      "Steakhouse coreana premium: nero ossidiana, oro liquido, marmo. Ispirato a Côte Miami.",
    category: "Dark Premium",
    sectorMatch: ["steakhouse", "carne", "bbq", "korean", "fine dining"],
    swatch: ["#000000", "#D4AF37", "#1A1A1A", "#8B6914"],
    palette: {
      bg: "#050505",
      surface: "#101010",
      text: "#FAFAFA",
      muted: "#9A9A9A",
      accent: "#D4AF37",
      accentSoft: "#2A2010",
      cardBg: "rgba(212,175,55,0.04)",
    },
    fonts: {
      heading: "Bodoni Moda",
      body: "Inter",
      googleFontsQuery:
        "family=Bodoni+Moda:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700",
    },
    layout: "split-luxury",
    radius: 0,
    shadow: "dramatic",
    copyTone:
      "tono michelin-grade autoritario, terminologia tecnica gastronomica, riferimenti al taglio della carne, esperienza esclusiva",
    heroImagePrompt:
      "fotografia food luxury cinematografica, bistecca wagyu su griglia smokeless, riflessi dorati, sfondo nero ossidiana, smoke moody",
  },

  // ─────────── MEDITERRANEAN LUXURY ───────────
  {
    key: "sardinia_azure",
    label: "Sardinia Azure Luxury",
    description:
      "Yacht club mediterraneo: azure profondo, oro caldo, marmo bianco. Ispirato ad Cala Vento Charter.",
    category: "Mediterranean Luxury",
    sectorMatch: [
      "yacht",
      "charter",
      "noleggio barche",
      "boat",
      "marina",
      "ncc luxury",
    ],
    swatch: ["#0A2540", "#5CC8D9", "#E8D5A8", "#F8F4ED"],
    palette: {
      bg: "#F8F4ED",
      surface: "#FFFFFF",
      text: "#0A2540",
      muted: "#6B7A8F",
      accent: "#0A2540",
      accentSoft: "#E8D5A8",
      cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Italiana",
      body: "Jost",
      googleFontsQuery:
        "family=Italiana&family=Jost:wght@300;400;500;600;700",
    },
    layout: "split-luxury",
    radius: 16,
    shadow: "medium",
    copyTone:
      "tono yacht club Costa Smeralda, italiano elegante con gentle pacing, riferimenti al mare e al turchese, esperienza esclusiva non ostentata",
    heroImagePrompt:
      "fotografia luxury yacht in mare turchese cristallino, marmo bianco di Carrara in foreground, golden hour, atmosfera Costa Smeralda",
  },
  {
    key: "costa_pacifico",
    label: "Costa del Pacifico",
    description:
      "Caraibico luxury: deep ocean, azure caraibico, sabbia, corallo. Ispirato a Pacifico Ceviche.",
    category: "Mediterranean Luxury",
    sectorMatch: [
      "pesce",
      "frutti di mare",
      "cevicheria",
      "peruviano",
      "caraibico",
      "beach club",
    ],
    swatch: ["#08131F", "#5CC8D9", "#FF8966", "#E8D5A8"],
    palette: {
      bg: "#FBF7F1",
      surface: "#FFFFFF",
      text: "#08131F",
      muted: "#5C6F7E",
      accent: "#5CC8D9",
      accentSoft: "#FFE5D9",
      cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Fraunces",
      body: "DM Sans",
      googleFontsQuery:
        "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@300;400;500;600;700",
    },
    layout: "magazine-stack",
    radius: 24,
    shadow: "medium",
    copyTone:
      "tono caldo latino, sabor peruano autentico, riferimenti al mare e al pescato del giorno, energia solare",
    heroImagePrompt:
      "fotografia food cevicheria su tavolo legno, lime verdi, peperoncino rosso, vista oceano sfocata in background, luce dorata mattino",
  },
  {
    key: "eleganza_milanese",
    label: "Eleganza Milanese",
    description:
      "Real estate premium: beige caldo, nero grafico, accenti rame. Ispirato a Dimora Milano.",
    category: "Editorial Luxury",
    sectorMatch: [
      "immobiliare",
      "real estate",
      "agenzia",
      "studio",
      "consulenza",
      "avvocato",
      "notaio",
    ],
    swatch: ["#1A1A1A", "#E8DFD3", "#B8956A", "#FFFFFF"],
    palette: {
      bg: "#F5F1EA",
      surface: "#FFFFFF",
      text: "#1A1A1A",
      muted: "#7A7064",
      accent: "#B8956A",
      accentSoft: "#E8DFD3",
      cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Instrument Serif",
      body: "Inter",
      googleFontsQuery:
        "family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700",
    },
    layout: "editorial-magazine",
    radius: 4,
    shadow: "subtle",
    copyTone:
      "tono milanese sobrio e competente, italiano formale-elegante, focus su discrezione, qualità della vita, dettagli architettonici",
    heroImagePrompt:
      "interno di appartamento milanese di pregio, pavimento parquet, luce naturale, design d'autore, soffitti alti, atmosfera silenziosa",
  },

  // ─────────── GLASSMORPHISM ───────────
  {
    key: "frosted_glass",
    label: "Frosted Glass",
    description:
      "Apple Vision Pro: glassmorphism, lavanda-pesca-cielo, pannelli traslucidi. Ispirato a Aurora Nail Atelier.",
    category: "Glassmorphism",
    sectorMatch: [
      "nails",
      "estetica",
      "beauty",
      "spa",
      "wellness",
      "salone",
      "parrucchiere",
    ],
    swatch: ["#E8D5F2", "#FFD4C4", "#C4DFFF", "#FFFFFF"],
    palette: {
      bg: "linear-gradient(135deg,#F4E5FF 0%,#FFE5E0 50%,#D9EEFF 100%)",
      surface: "rgba(255,255,255,0.55)",
      text: "#2D2438",
      muted: "#6E6480",
      accent: "#A678D9",
      accentSoft: "rgba(166,120,217,0.18)",
      cardBg: "rgba(255,255,255,0.45)",
    },
    fonts: {
      heading: "Outfit",
      body: "Outfit",
      googleFontsQuery: "family=Outfit:wght@200;300;400;500;600;700;800",
    },
    layout: "glass-overlay",
    radius: 28,
    shadow: "dramatic",
    copyTone:
      "tono futuristico-soft, leggerezza, riferimenti al benessere e all'auto-cura, italiano contemporaneo curato",
    heroImagePrompt:
      "fotografia beauty/nails cinematografica, sfondo pastello sfumato lavanda-pesca, glass morphism reflections, luce diffusa, dettagli iridescenti",
  },
  {
    key: "ethereal_glass",
    label: "Ethereal Glass",
    description:
      "Light medical luxury: glass blu, gradient azzurro, pulizia clinica. Ispirato a FAR Medical.",
    category: "Glassmorphism",
    sectorMatch: [
      "medico",
      "studio dentistico",
      "clinica",
      "ottica",
      "fisioterapia",
      "psicologo",
    ],
    swatch: ["#F0F7FF", "#5B8DEF", "#FFFFFF", "#D9E7FA"],
    palette: {
      bg: "linear-gradient(180deg,#F0F7FF 0%,#FFFFFF 100%)",
      surface: "rgba(255,255,255,0.7)",
      text: "#0F2342",
      muted: "#5C6E89",
      accent: "#2563EB",
      accentSoft: "rgba(37,99,235,0.12)",
      cardBg: "rgba(255,255,255,0.65)",
    },
    fonts: {
      heading: "Sora",
      body: "Inter",
      googleFontsQuery:
        "family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700",
    },
    layout: "centered-minimal",
    radius: 20,
    shadow: "subtle",
    copyTone:
      "tono professionale rassicurante, terminologia medica accessibile, focus su sicurezza e competenza, italiano chiaro",
    heroImagePrompt:
      "fotografia medical/wellness premium, luce naturale brillante, ambiente clinico minimalista, blu clinico e bianco, atmosfera fiduciosa",
  },

  // ─────────── WARM NATURE ───────────
  {
    key: "velvet_saddle",
    label: "Velvet Saddle",
    description:
      "Equestre/cuoio: bordeaux profondo, cuoio, crema. Ispirato a Texas Horse Ranch.",
    category: "Warm Nature",
    sectorMatch: [
      "ranch",
      "equestre",
      "agriturismo",
      "cantina",
      "vino",
      "macelleria",
      "salumificio",
    ],
    swatch: ["#3D1A1A", "#8B5A2B", "#F4E8D8", "#1F1410"],
    palette: {
      bg: "#1F1410",
      surface: "#2A1C16",
      text: "#F4E8D8",
      muted: "#B89A7A",
      accent: "#C44949",
      accentSoft: "#3D1A1A",
      cardBg: "rgba(196,73,73,0.08)",
    },
    fonts: {
      heading: "DM Serif Display",
      body: "Work Sans",
      googleFontsQuery:
        "family=DM+Serif+Display:ital@0;1&family=Work+Sans:wght@300;400;500;600;700",
    },
    layout: "magazine-stack",
    radius: 8,
    shadow: "dramatic",
    copyTone:
      "tono americano-rustico premium, autenticità, heritage, terminologia artigianale, riferimenti alla tradizione",
    heroImagePrompt:
      "fotografia cinematografica cuoio bordeaux, dettagli ottone antico, illuminazione warm dorata, texture legno, atmosfera ranch luxury",
  },
  {
    key: "maple_gold",
    label: "Maple & Gold",
    description:
      "Autunno warm: foglie d'acero, oro, crema, terracotta. Ispirato ad Arcobaleno Playhouse.",
    category: "Warm Nature",
    sectorMatch: [
      "asilo",
      "scuola",
      "kids",
      "famiglia",
      "panetteria",
      "pasticceria",
      "bakery",
    ],
    swatch: ["#FFF8EE", "#D97A2C", "#8B4513", "#F5DEB3"],
    palette: {
      bg: "#FFF8EE",
      surface: "#FFFFFF",
      text: "#3D2817",
      muted: "#8B6F47",
      accent: "#D97A2C",
      accentSoft: "#FCE6CE",
      cardBg: "#FFFCF5",
    },
    fonts: {
      heading: "Fraunces",
      body: "Nunito",
      googleFontsQuery:
        "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Nunito:wght@300;400;500;600;700;800",
    },
    layout: "bento-grid",
    radius: 24,
    shadow: "medium",
    copyTone:
      "tono caldo accogliente familiare, ottimismo soft, riferimenti alla cura e alla casa, italiano amichevole e rassicurante",
    heroImagePrompt:
      "fotografia warm lifestyle, luce dorata mattino autunno, palette terracotta-crema, dettagli artigianali, atmosfera home cozy premium",
  },
  {
    key: "tropical_aloha",
    label: "Tropical Aloha",
    description:
      "Hawaiano fresco: verde tropicale, corallo, sole, blu lagoon. Ispirato a Pokewaii Brescia.",
    category: "Warm Nature",
    sectorMatch: [
      "poke",
      "bowl",
      "vegano",
      "smoothie",
      "frullato",
      "healthy",
      "fit",
    ],
    swatch: ["#0F5132", "#FF6B6B", "#FFD93D", "#5CC8D9"],
    palette: {
      bg: "#FAFFF8",
      surface: "#FFFFFF",
      text: "#0F2A1F",
      muted: "#5C7264",
      accent: "#0F5132",
      accentSoft: "#D4F0DD",
      cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Bricolage Grotesque",
      body: "DM Sans",
      googleFontsQuery:
        "family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600;700",
    },
    layout: "bento-grid",
    radius: 24,
    shadow: "subtle",
    copyTone:
      "tono fresh energetico positivo, healthy lifestyle, riferimenti agli ingredienti freschi, italiano contemporaneo",
    heroImagePrompt:
      "fotografia food poke bowl colorata, ingredienti freschi vibranti, palme sfocate background, luce solare brillante, palette tropicale energetica",
  },

  // ─────────── LIGHT MINIMAL ───────────
  {
    key: "ocean_azure",
    label: "Ocean Azure",
    description:
      "Luxury bianco: bianco puro, ocean azure, accenti corallo. Ispirato a Domus Living.",
    category: "Light Minimal",
    sectorMatch: [
      "hotel",
      "resort",
      "boutique",
      "concierge",
      "property management",
      "luxury rental",
    ],
    swatch: ["#FFFFFF", "#0EA5E9", "#1E3A5F", "#F1F5F9"],
    palette: {
      bg: "#FAFCFF",
      surface: "#FFFFFF",
      text: "#0F1B2D",
      muted: "#64748B",
      accent: "#0EA5E9",
      accentSoft: "#DBEAFE",
      cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Syne",
      body: "Plus Jakarta Sans",
      googleFontsQuery:
        "family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700",
    },
    layout: "split-luxury",
    radius: 16,
    shadow: "subtle",
    copyTone:
      "tono boutique hotel premium, hospitality elevata, riferimenti al comfort e all'esperienza personalizzata",
    heroImagePrompt:
      "fotografia hotel luxury vista oceano, interni bianco/azzurro, lino naturale, luce diffusa mattino, atmosfera spa-like serena",
  },
];

/** Lookup veloce per chiave */
export function getStylePreset(key: string): MockupStylePreset | undefined {
  return MOCKUP_STYLE_PRESETS.find((p) => p.key === key);
}

/** Auto-match preset basato sul settore del lead */
export function suggestPresetForSector(
  sector: string | null | undefined,
): MockupStylePreset {
  if (!sector) return MOCKUP_STYLE_PRESETS[0];
  const s = sector.toLowerCase();
  for (const preset of MOCKUP_STYLE_PRESETS) {
    if (preset.sectorMatch.some((m) => s.includes(m))) return preset;
  }
  // default editorial
  return MOCKUP_STYLE_PRESETS[0];
}

/** Categorie disponibili per filtri UI */
export const PRESET_CATEGORIES: MockupStylePreset["category"][] = [
  "Editorial Luxury",
  "Glassmorphism",
  "Mediterranean Luxury",
  "Dark Premium",
  "Warm Nature",
  "Light Minimal",
];
