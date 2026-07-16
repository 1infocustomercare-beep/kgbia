/**
 * Prestige Home — real premium AI-generated mockups for the public homepage.
 * Uses the same PNGs of the /portfolio catalog so the home immediately shows
 * proprietary Empire work (no more SVG gradient placeholders).
 *
 * ADDITIVE ONLY: safe to import from any Prestige section.
 */

import foodOnyxObsidian from "@/assets/mockups/catalog/food-onyx-obsidian.png";
import foodOnyxIvory from "@/assets/mockups/catalog/food-onyx-ivory.png";
import foodSakuraLuxuryDark from "@/assets/mockups/catalog/food-sakura-luxury-dark.png";
import foodPacificoCosta from "@/assets/mockups/catalog/food-pacifico-costa.png";
import foodLevanteDeli from "@/assets/mockups/catalog/food-levante-deli.png";
import foodBraceKebab from "@/assets/mockups/catalog/food-brace-kebab.png";
import beautyAuroraLavender from "@/assets/mockups/catalog/beauty-aurora-lavender.png";
import beautyAuroraBlush from "@/assets/mockups/catalog/beauty-aurora-blush-rosegold.png";
import beautyVelluto from "@/assets/mockups/catalog/beauty-velluto-editorial.png";
import nccMarinaRiviera from "@/assets/mockups/catalog/ncc-marina-riviera.png";
import nccMarinaAmalfi from "@/assets/mockups/catalog/ncc-marina-amalfi-style-b.png";
import fitnessPadelSage from "@/assets/mockups/catalog/fitness-padel-sage.png";
import fitnessOndaAqua from "@/assets/mockups/catalog/fitness-onda-aqua.png";
import hospitalityCalaAzure from "@/assets/mockups/catalog/hospitality-cala-vento-azure.png";
import hospitalityCalaSunset from "@/assets/mockups/catalog/hospitality-cala-vento-sunset.png";
import healthcareLumen from "@/assets/mockups/catalog/healthcare-lumen-glass.png";
import veterinaryTropico from "@/assets/mockups/catalog/veterinary-tropico-resort.png";
import childcareArcobaleno from "@/assets/mockups/catalog/childcare-arcobaleno-bauhaus.png";
import childcareStelle from "@/assets/mockups/catalog/childcare-stelle-playful.png";
import constructionOcean from "@/assets/mockups/catalog/construction-domus-ocean-azure.png";
import constructionCoral from "@/assets/mockups/catalog/construction-domus-living-coral.png";
import plumberStyleA from "@/assets/mockups/catalog/plumber-idro-pronto-style-a.png";

/**
 * Best hero mockup per sector — used by Industries / Hero for a quick visual anchor.
 */
export const PRESTIGE_SECTOR_HERO: Record<string, string> = {
  food: foodOnyxObsidian,
  ncc: nccMarinaRiviera,
  beauty: beautyAuroraLavender,
  fitness: fitnessPadelSage,
  hotel: hospitalityCalaAzure,
  hospitality: hospitalityCalaAzure,
  pro: healthcareLumen,
  healthcare: healthcareLumen,
  veterinary: veterinaryTropico,
  childcare: childcareStelle,
  construction: constructionOcean,
  plumber: plumberStyleA,
};

/**
 * Curated 12 premium projects for the homepage Portfolio grid.
 * Order tuned for a strong visual rhythm (dark → light → dark → light).
 */
export const PRESTIGE_PORTFOLIO_ITEMS: Array<{
  image: string;
  tag: string;
  title: string;
  desc: string;
  year: string;
}> = [
  { image: foodOnyxObsidian, tag: "Ristorante", title: "Onyx Brace", desc: "Menù digitale, prenotazioni e ordini WhatsApp gestiti dall'AI · da €39/mese", year: "2026" },
  { image: beautyAuroraLavender, tag: "Beauty & Spa", title: "Aurora Nail Atelier", desc: "Booking 24/7, cataloghi trattamenti e reminder automatici · da €49/mese", year: "2026" },
  { image: fitnessPadelSage, tag: "Fitness", title: "Centro Padel Brera", desc: "Iscrizioni online, prenotazione campi e rinnovi automatici · da €59/mese", year: "2026" },
  { image: hospitalityCalaAzure, tag: "Hotel & Yacht", title: "Marina Cala Vento", desc: "Concierge AI multilingua e charter booking 24/7 · da €149/mese", year: "2026" },
  { image: foodSakuraLuxuryDark, tag: "Sushi & Omakase", title: "Sakura Atelier", desc: "Omakase reservation, waitlist AI e loyalty premium · da €79/mese", year: "2026" },
  { image: nccMarinaRiviera, tag: "NCC Luxury", title: "Marina Riviera", desc: "Centralino AI in 4 lingue e app autisti con corse e pagamenti · da €99/mese", year: "2026" },
  { image: beautyVelluto, tag: "Parrucchieri", title: "Velluto Editorial", desc: "Agenda smart, foto after e clienteling AI · da €49/mese", year: "2026" },
  { image: foodPacificoCosta, tag: "Cucina Latino", title: "Pacifico Ceviche", desc: "Menù stagionale, delivery diretto e dashboard vendite · da €39/mese", year: "2026" },
  { image: healthcareLumen, tag: "Studi Medici", title: "Lumen Glass Clinic", desc: "Agenda medica, promemoria trattamenti e piani di cura digitali · da €89/mese", year: "2026" },
  { image: veterinaryTropico, tag: "Pet Care", title: "Tropico Vet Resort", desc: "Visite veterinarie, toelettatura e pensione prenotate via WhatsApp · da €49/mese", year: "2026" },
  { image: constructionOcean, tag: "Real Estate", title: "Domus Living", desc: "Vetrina immobili, tour virtuali e qualifica lead in chat · da €89/mese", year: "2026" },
  { image: foodBraceKebab, tag: "Street Food", title: "Brace Kebab House", desc: "Ordini istantanei, cassa integrata e loyalty da smartphone · da €29/mese", year: "2026" },
];
