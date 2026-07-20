/**
 * Portfolio Lowengeld-style — progetti premium generati con AI a qualità editoriale.
 * ADDITIVO: convive con `sector-mockups.ts`. Cresce turno per turno.
 *
 * Struttura ispirata a lowengeldagency.com/portfolio: doppio phone,
 * categoria + sotto-categoria, descrizione breve, apertura fullscreen.
 */

// T1 · Food parte 1 (7 progetti)
import flameKebabHome from "@/assets/mockups/portfolio-lowengeld/flame-kebab/1-home.png.asset.json";
import otomakiHome from "@/assets/mockups/portfolio-lowengeld/otomaki-sushi/1-home.png.asset.json";
import sakuraHome from "@/assets/mockups/portfolio-lowengeld/sakura-atelier/1-home.png.asset.json";
import coteHome from "@/assets/mockups/portfolio-lowengeld/cote-milano/1-home.png.asset.json";
import pacificoHome from "@/assets/mockups/portfolio-lowengeld/pacifico-ceviche/1-home.png.asset.json";
import oryganoHome from "@/assets/mockups/portfolio-lowengeld/orygano/1-home.png.asset.json";
import strapizzamiHome from "@/assets/mockups/portfolio-lowengeld/strapizzami/1-home.png.asset.json";

export type LowengeldCategory =
  | "food"
  | "lifestyle"
  | "travel"
  | "app-design"
  | "education"
  | "web-design"
  | "e-commerce"
  | "healthcare";

export const CATEGORY_LABELS: Record<LowengeldCategory | "all", string> = {
  all: "Tutti",
  food: "Food",
  lifestyle: "Lifestyle",
  travel: "Travel",
  "app-design": "App Design",
  education: "Education",
  "web-design": "Web Design",
  "e-commerce": "E-Commerce",
  healthcare: "Healthcare",
};

export type LowengeldScreen = {
  label: string;
  image: string;
};

export type LowengeldProject = {
  slug: string;
  brand: string;
  category: LowengeldCategory;
  subCategory: string; // es. "Kebab", "Sushi", "Pizza"
  description: string;
  accent: string; // hex per l'ambient del lightbox
  screens: LowengeldScreen[]; // sequenza coerente Home/Menu/Detail/Booking
};

export const LOWENGELD_PROJECTS: LowengeldProject[] = [
  {
    slug: "flame-kebab",
    brand: "Flame Kebab",
    category: "food",
    subCategory: "Kebab",
    description:
      "Ordering app per catena kebab premium con tracking ordini live e personalizzazione ingredienti in tempo reale.",
    accent: "#FF6B35",
    screens: [{ label: "Home", image: flameKebabHome.url }],
  },
  {
    slug: "otomaki-sushi",
    brand: "Otomaki Sushi",
    category: "food",
    subCategory: "Sushi",
    description:
      "Esperienza omakase digitale: custom roll builder, chef selection, prenotazione tavolo con vista sushi bar.",
    accent: "#C9A24B",
    screens: [{ label: "Home", image: otomakiHome.url }],
  },
  {
    slug: "sakura-atelier",
    brand: "Sakura Atelier",
    category: "food",
    subCategory: "Sushi",
    description:
      "Sushi editoriale con layout magazine, chapter-index dei percorsi degustazione e sake bar dedicato.",
    accent: "#F7D6DC",
    screens: [{ label: "Home", image: sakuraHome.url }],
  },
  {
    slug: "cote-milano",
    brand: "Côte Milano",
    category: "food",
    subCategory: "Steakhouse",
    description:
      "Steakhouse dry-aged in obsidiana e oro. Wine cellar digitale, private dining, prenotazione VIP.",
    accent: "#C9A24B",
    screens: [{ label: "Home", image: coteHome.url }],
  },
  {
    slug: "pacifico-ceviche",
    brand: "Pacifico Ceviche",
    category: "food",
    subCategory: "Cevicheria",
    description:
      "Ristorante caraibico con ceviche & tiraditos, badge ingredienti (fresh/spicy/gluten-free), cocktail bar tropicale.",
    accent: "#2CB5C0",
    screens: [{ label: "Home", image: pacificoHome.url }],
  },
  {
    slug: "orygano",
    brand: "Orygano",
    category: "food",
    subCategory: "Pizza Gourmet",
    description:
      "Pizza napoletana gourmet con storia farine 100% italiane, lievitazione 72h e signature dello chef.",
    accent: "#1F3A2E",
    screens: [{ label: "Home", image: oryganoHome.url }],
  },
  {
    slug: "strapizzami",
    brand: "Strapizzami",
    category: "food",
    subCategory: "Pizza Delivery",
    description:
      "Delivery pizzeria tradizionale con codice benvenuto, grid pizze classiche e checkout ultra-rapido al carrello.",
    accent: "#B4471F",
    screens: [{ label: "Home", image: strapizzamiHome.url }],
  },
];
