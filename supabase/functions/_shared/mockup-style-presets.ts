// Empire Mockup Style Presets — Deno (edge functions) version.
// Mirror del file frontend src/lib/mockup-style-presets.ts.
// Mantenere le 2 versioni allineate quando si aggiungono preset.

export type MockupStylePreset = {
  key: string;
  label: string;
  description: string;
  category: string;
  sectorMatch: string[];
  swatch: [string, string, string, string];
  palette: {
    bg: string;
    surface: string;
    text: string;
    muted: string;
    accent: string;
    accentSoft: string;
    cardBg: string;
  };
  fonts: {
    heading: string;
    body: string;
    googleFontsQuery: string;
  };
  layout:
    | "editorial-magazine"
    | "split-luxury"
    | "glass-overlay"
    | "centered-minimal"
    | "bento-grid"
    | "magazine-stack";
  radius: number;
  shadow: "subtle" | "medium" | "dramatic";
  copyTone: string;
  heroImagePrompt: string;
};

export const MOCKUP_STYLE_PRESETS: MockupStylePreset[] = [
  {
    key: "sakura_editorial",
    label: "Sakura Editorial",
    description: "Editoriale giapponese: bianco, nero inchiostro, rosso sakura.",
    category: "Editorial Luxury",
    sectorMatch: ["sushi", "ristorante giapponese", "nikkei", "asiatico", "ramen"],
    swatch: ["#FFFFFF", "#0D0D0D", "#D7263D", "#F5E6E0"],
    palette: {
      bg: "#FAFAF7", surface: "#FFFFFF", text: "#0D0D0D",
      muted: "#6B6B6B", accent: "#D7263D", accentSoft: "#F5E6E0", cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Cormorant Garamond", body: "Inter",
      googleFontsQuery: "family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700",
    },
    layout: "editorial-magazine", radius: 4, shadow: "subtle",
    copyTone: "tono editoriale raffinato, frasi brevi e poetiche, vocabolario gastronomico colto",
    heroImagePrompt: "fotografia editoriale food premium, illuminazione naturale morbida, sfondo bianco minimal, composizione asimmetrica giapponese wabi-sabi",
  },
  {
    key: "noir_saigon",
    label: "Noir Saigon",
    description: "Vietnamita luxury: nero profondo, oro antico, accenti giada.",
    category: "Dark Premium",
    sectorMatch: ["vietnamita", "fine dining", "asiatico luxury", "pho"],
    swatch: ["#0A0807", "#C9A24C", "#1F4E3D", "#E8D9B0"],
    palette: {
      bg: "#0A0807", surface: "#15110D", text: "#F2E9D8",
      muted: "#A89274", accent: "#C9A24C", accentSoft: "#3A2E1A", cardBg: "rgba(201,162,76,0.06)",
    },
    fonts: {
      heading: "Playfair Display", body: "Manrope",
      googleFontsQuery: "family=Playfair+Display:wght@400;600;700;900&family=Manrope:wght@300;400;500;600;700",
    },
    layout: "magazine-stack", radius: 8, shadow: "dramatic",
    copyTone: "tono cinematografico evocativo, descrizioni sensoriali ricche, eleganza sussurrata",
    heroImagePrompt: "fotografia cinematografica dark moody, illuminazione laterale calda dorata, vapore, dettagli ottone, atmosfera notturna lussuosa",
  },
  {
    key: "cote_obsidian",
    label: "Côte Obsidian",
    description: "Steakhouse coreana premium: nero ossidiana, oro liquido, marmo.",
    category: "Dark Premium",
    sectorMatch: ["steakhouse", "carne", "bbq", "korean", "fine dining"],
    swatch: ["#000000", "#D4AF37", "#1A1A1A", "#8B6914"],
    palette: {
      bg: "#050505", surface: "#101010", text: "#FAFAFA",
      muted: "#9A9A9A", accent: "#D4AF37", accentSoft: "#2A2010", cardBg: "rgba(212,175,55,0.04)",
    },
    fonts: {
      heading: "Bodoni Moda", body: "Inter",
      googleFontsQuery: "family=Bodoni+Moda:wght@400;600;700;900&family=Inter:wght@300;400;500;600;700",
    },
    layout: "split-luxury", radius: 0, shadow: "dramatic",
    copyTone: "tono michelin-grade autoritario, terminologia tecnica gastronomica, esperienza esclusiva",
    heroImagePrompt: "fotografia food luxury cinematografica, bistecca wagyu su griglia smokeless, riflessi dorati, sfondo nero ossidiana",
  },
  {
    key: "sardinia_azure",
    label: "Sardinia Azure Luxury",
    description: "Yacht club mediterraneo: azure profondo, oro caldo, marmo bianco.",
    category: "Mediterranean Luxury",
    sectorMatch: ["yacht", "charter", "noleggio barche", "boat", "marina", "ncc luxury"],
    swatch: ["#0A2540", "#5CC8D9", "#E8D5A8", "#F8F4ED"],
    palette: {
      bg: "#F8F4ED", surface: "#FFFFFF", text: "#0A2540",
      muted: "#6B7A8F", accent: "#0A2540", accentSoft: "#E8D5A8", cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Italiana", body: "Jost",
      googleFontsQuery: "family=Italiana&family=Jost:wght@300;400;500;600;700",
    },
    layout: "split-luxury", radius: 16, shadow: "medium",
    copyTone: "tono yacht club Costa Smeralda, italiano elegante, riferimenti al mare e al turchese",
    heroImagePrompt: "fotografia luxury yacht in mare turchese cristallino, marmo bianco di Carrara, golden hour, atmosfera Costa Smeralda",
  },
  {
    key: "costa_pacifico",
    label: "Costa del Pacifico",
    description: "Caraibico luxury: deep ocean, azure caraibico, sabbia, corallo.",
    category: "Mediterranean Luxury",
    sectorMatch: ["pesce", "frutti di mare", "cevicheria", "peruviano", "caraibico", "beach club"],
    swatch: ["#08131F", "#5CC8D9", "#FF8966", "#E8D5A8"],
    palette: {
      bg: "#FBF7F1", surface: "#FFFFFF", text: "#08131F",
      muted: "#5C6F7E", accent: "#5CC8D9", accentSoft: "#FFE5D9", cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Fraunces", body: "DM Sans",
      googleFontsQuery: "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700;9..144,900&family=DM+Sans:wght@300;400;500;600;700",
    },
    layout: "magazine-stack", radius: 24, shadow: "medium",
    copyTone: "tono caldo latino, sabor peruano autentico, riferimenti al mare",
    heroImagePrompt: "fotografia food cevicheria su tavolo legno, lime verdi, vista oceano sfocata, luce dorata mattino",
  },
  {
    key: "eleganza_milanese",
    label: "Eleganza Milanese",
    description: "Real estate premium: beige caldo, nero grafico, accenti rame.",
    category: "Editorial Luxury",
    sectorMatch: ["immobiliare", "real estate", "agenzia", "studio", "consulenza", "avvocato", "notaio"],
    swatch: ["#1A1A1A", "#E8DFD3", "#B8956A", "#FFFFFF"],
    palette: {
      bg: "#F5F1EA", surface: "#FFFFFF", text: "#1A1A1A",
      muted: "#7A7064", accent: "#B8956A", accentSoft: "#E8DFD3", cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Instrument Serif", body: "Inter",
      googleFontsQuery: "family=Instrument+Serif:ital@0;1&family=Inter:wght@300;400;500;600;700",
    },
    layout: "editorial-magazine", radius: 4, shadow: "subtle",
    copyTone: "tono milanese sobrio e competente, italiano formale-elegante, focus su discrezione",
    heroImagePrompt: "interno appartamento milanese di pregio, parquet, luce naturale, design d'autore, soffitti alti",
  },
  {
    key: "frosted_glass",
    label: "Frosted Glass",
    description: "Apple Vision Pro: glassmorphism, lavanda-pesca-cielo, traslucido.",
    category: "Glassmorphism",
    sectorMatch: ["nails", "estetica", "beauty", "spa", "wellness", "salone", "parrucchiere"],
    swatch: ["#E8D5F2", "#FFD4C4", "#C4DFFF", "#FFFFFF"],
    palette: {
      bg: "linear-gradient(135deg,#F4E5FF 0%,#FFE5E0 50%,#D9EEFF 100%)",
      surface: "rgba(255,255,255,0.55)", text: "#2D2438",
      muted: "#6E6480", accent: "#A678D9", accentSoft: "rgba(166,120,217,0.18)",
      cardBg: "rgba(255,255,255,0.45)",
    },
    fonts: {
      heading: "Outfit", body: "Outfit",
      googleFontsQuery: "family=Outfit:wght@200;300;400;500;600;700;800",
    },
    layout: "glass-overlay", radius: 28, shadow: "dramatic",
    copyTone: "tono futuristico-soft, leggerezza, riferimenti all'auto-cura",
    heroImagePrompt: "fotografia beauty/nails cinematografica, sfondo pastello sfumato lavanda-pesca, glass morphism reflections",
  },
  {
    key: "ethereal_glass",
    label: "Ethereal Glass",
    description: "Light medical luxury: glass blu, gradient azzurro, pulizia clinica.",
    category: "Glassmorphism",
    sectorMatch: ["medico", "studio dentistico", "clinica", "ottica", "fisioterapia", "psicologo"],
    swatch: ["#F0F7FF", "#5B8DEF", "#FFFFFF", "#D9E7FA"],
    palette: {
      bg: "linear-gradient(180deg,#F0F7FF 0%,#FFFFFF 100%)",
      surface: "rgba(255,255,255,0.7)", text: "#0F2342",
      muted: "#5C6E89", accent: "#2563EB", accentSoft: "rgba(37,99,235,0.12)",
      cardBg: "rgba(255,255,255,0.65)",
    },
    fonts: {
      heading: "Sora", body: "Inter",
      googleFontsQuery: "family=Sora:wght@300;400;500;600;700;800&family=Inter:wght@300;400;500;600;700",
    },
    layout: "centered-minimal", radius: 20, shadow: "subtle",
    copyTone: "tono professionale rassicurante, terminologia medica accessibile",
    heroImagePrompt: "fotografia medical/wellness premium, luce naturale brillante, ambiente clinico minimalista, blu clinico e bianco",
  },
  {
    key: "velvet_saddle",
    label: "Velvet Saddle",
    description: "Equestre/cuoio: bordeaux profondo, cuoio, crema.",
    category: "Warm Nature",
    sectorMatch: ["ranch", "equestre", "agriturismo", "cantina", "vino", "macelleria", "salumificio"],
    swatch: ["#3D1A1A", "#8B5A2B", "#F4E8D8", "#1F1410"],
    palette: {
      bg: "#1F1410", surface: "#2A1C16", text: "#F4E8D8",
      muted: "#B89A7A", accent: "#C44949", accentSoft: "#3D1A1A",
      cardBg: "rgba(196,73,73,0.08)",
    },
    fonts: {
      heading: "DM Serif Display", body: "Work Sans",
      googleFontsQuery: "family=DM+Serif+Display:ital@0;1&family=Work+Sans:wght@300;400;500;600;700",
    },
    layout: "magazine-stack", radius: 8, shadow: "dramatic",
    copyTone: "tono americano-rustico premium, autenticità, heritage",
    heroImagePrompt: "fotografia cinematografica cuoio bordeaux, dettagli ottone antico, illuminazione warm dorata, texture legno",
  },
  {
    key: "maple_gold",
    label: "Maple & Gold",
    description: "Autunno warm: foglie d'acero, oro, crema, terracotta.",
    category: "Warm Nature",
    sectorMatch: ["asilo", "scuola", "kids", "famiglia", "panetteria", "pasticceria", "bakery"],
    swatch: ["#FFF8EE", "#D97A2C", "#8B4513", "#F5DEB3"],
    palette: {
      bg: "#FFF8EE", surface: "#FFFFFF", text: "#3D2817",
      muted: "#8B6F47", accent: "#D97A2C", accentSoft: "#FCE6CE", cardBg: "#FFFCF5",
    },
    fonts: {
      heading: "Fraunces", body: "Nunito",
      googleFontsQuery: "family=Fraunces:opsz,wght@9..144,400;9..144,600;9..144,700&family=Nunito:wght@300;400;500;600;700;800",
    },
    layout: "bento-grid", radius: 24, shadow: "medium",
    copyTone: "tono caldo accogliente familiare, ottimismo soft, riferimenti alla cura",
    heroImagePrompt: "fotografia warm lifestyle, luce dorata mattino autunno, palette terracotta-crema, atmosfera home cozy premium",
  },
  {
    key: "tropical_aloha",
    label: "Tropical Aloha",
    description: "Hawaiano fresco: verde tropicale, corallo, sole, blu lagoon.",
    category: "Warm Nature",
    sectorMatch: ["poke", "bowl", "vegano", "smoothie", "frullato", "healthy", "fit"],
    swatch: ["#0F5132", "#FF6B6B", "#FFD93D", "#5CC8D9"],
    palette: {
      bg: "#FAFFF8", surface: "#FFFFFF", text: "#0F2A1F",
      muted: "#5C7264", accent: "#0F5132", accentSoft: "#D4F0DD", cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Bricolage Grotesque", body: "DM Sans",
      googleFontsQuery: "family=Bricolage+Grotesque:opsz,wght@12..96,400;12..96,600;12..96,700;12..96,800&family=DM+Sans:wght@300;400;500;600;700",
    },
    layout: "bento-grid", radius: 24, shadow: "subtle",
    copyTone: "tono fresh energetico positivo, healthy lifestyle",
    heroImagePrompt: "fotografia food poke bowl colorata, ingredienti freschi vibranti, palme sfocate, luce solare brillante",
  },
  {
    key: "ocean_azure",
    label: "Ocean Azure",
    description: "Luxury bianco: bianco puro, ocean azure, accenti corallo.",
    category: "Light Minimal",
    sectorMatch: ["hotel", "resort", "boutique", "concierge", "property management", "luxury rental"],
    swatch: ["#FFFFFF", "#0EA5E9", "#1E3A5F", "#F1F5F9"],
    palette: {
      bg: "#FAFCFF", surface: "#FFFFFF", text: "#0F1B2D",
      muted: "#64748B", accent: "#0EA5E9", accentSoft: "#DBEAFE", cardBg: "#FFFFFF",
    },
    fonts: {
      heading: "Syne", body: "Plus Jakarta Sans",
      googleFontsQuery: "family=Syne:wght@400;500;600;700;800&family=Plus+Jakarta+Sans:wght@300;400;500;600;700",
    },
    layout: "split-luxury", radius: 16, shadow: "subtle",
    copyTone: "tono boutique hotel premium, hospitality elevata",
    heroImagePrompt: "fotografia hotel luxury vista oceano, interni bianco/azzurro, lino naturale, luce diffusa mattino",
  },
];

export function getStylePreset(key: string): MockupStylePreset {
  return MOCKUP_STYLE_PRESETS.find((p) => p.key === key) ?? MOCKUP_STYLE_PRESETS[0];
}

export function suggestPresetForSector(sector: string | null | undefined): MockupStylePreset {
  if (!sector) return MOCKUP_STYLE_PRESETS[0];
  const s = sector.toLowerCase();
  for (const preset of MOCKUP_STYLE_PRESETS) {
    if (preset.sectorMatch.some((m) => s.includes(m))) return preset;
  }
  return MOCKUP_STYLE_PRESETS[0];
}

/** Shadow tokens condivisi */
export function shadowCss(level: "subtle" | "medium" | "dramatic"): string {
  switch (level) {
    case "dramatic": return "0 30px 80px -20px rgba(0,0,0,0.45)";
    case "medium":   return "0 18px 40px -12px rgba(0,0,0,0.18)";
    default:         return "0 4px 14px -2px rgba(0,0,0,0.08)";
  }
}
