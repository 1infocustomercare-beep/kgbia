/**
 * Admin Layout Configuration — Each sector category gets a unique dashboard style
 * Defines visual layout, sidebar position, card styles, and color treatment
 */

export type AdminLayoutType = 
  | "hospitality"   // Calendar-forward, warm tones, booking timeline
  | "services"      // Appointment grid, treatment cards, portfolio
  | "operations"    // Kanban-style, interventions, field dispatch
  | "commerce"      // Product grid, inventory, orders table
  | "professional"  // Document-centric, case files, billing
  | "creative"      // Gallery-first, portfolio, mood boards
  | "care"          // Patient/child cards, compliance, timeline
  | "mobility";     // Map-centric, fleet, route tracking

export interface AdminLayoutConfig {
  type: AdminLayoutType;
  sidebarStyle: "glass" | "solid" | "minimal" | "accent-bar" | "floating";
  cardStyle: "glass" | "solid" | "gradient" | "outlined" | "elevated";
  bgGradient: string;
  bgPattern: "dots" | "grid" | "none" | "diagonal" | "mesh";
  headerStyle: "standard" | "banner" | "compact" | "split";
  dashboardGrid: "standard" | "bento" | "timeline" | "kanban" | "masonry";
  accentGlow: boolean;
  kpiStyle: "cards" | "inline" | "ring" | "pill";
  chartBg: string;
  tableStyle: "striped" | "minimal" | "cards" | "bordered";
}

export const ADMIN_LAYOUT_MAP: Record<string, AdminLayoutConfig> = {
  // ── Hospitality & Venues ──
  food: {
    type: "hospitality", sidebarStyle: "solid", cardStyle: "glass",
    bgGradient: "linear-gradient(165deg, #0a0a0f 0%, #12100a 40%, #0a0a0f 100%)",
    bgPattern: "none", headerStyle: "banner", dashboardGrid: "standard",
    accentGlow: true, kpiStyle: "cards", chartBg: "rgba(212,175,55,0.03)",
    tableStyle: "striped",
  },
  hotel: {
    type: "hospitality", sidebarStyle: "glass", cardStyle: "elevated",
    bgGradient: "linear-gradient(165deg, #0c0814 0%, #140e1a 40%, #0c0814 100%)",
    bgPattern: "mesh", headerStyle: "banner", dashboardGrid: "bento",
    accentGlow: true, kpiStyle: "ring", chartBg: "rgba(200,169,81,0.03)",
    tableStyle: "minimal",
  },
  hospitality: {
    type: "hospitality", sidebarStyle: "glass", cardStyle: "elevated",
    bgGradient: "linear-gradient(165deg, #0c0814 0%, #140e1a 40%, #0c0814 100%)",
    bgPattern: "mesh", headerStyle: "banner", dashboardGrid: "bento",
    accentGlow: true, kpiStyle: "ring", chartBg: "rgba(200,169,81,0.03)",
    tableStyle: "minimal",
  },
  agriturismo: {
    type: "hospitality", sidebarStyle: "solid", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #060a04 0%, #0a1408 40%, #060a04 100%)",
    bgPattern: "dots", headerStyle: "standard", dashboardGrid: "bento",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(139,195,74,0.03)",
    tableStyle: "striped",
  },
  beach: {
    type: "hospitality", sidebarStyle: "glass", cardStyle: "glass",
    bgGradient: "linear-gradient(165deg, #04101a 0%, #081e30 40%, #04101a 100%)",
    bgPattern: "none", headerStyle: "split", dashboardGrid: "bento",
    accentGlow: true, kpiStyle: "pill", chartBg: "rgba(14,165,233,0.03)",
    tableStyle: "minimal",
  },
  bakery: {
    type: "hospitality", sidebarStyle: "solid", cardStyle: "solid",
    bgGradient: "linear-gradient(165deg, #0f0a06 0%, #1a1208 40%, #0f0a06 100%)",
    bgPattern: "dots", headerStyle: "standard", dashboardGrid: "standard",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(194,132,60,0.03)",
    tableStyle: "striped",
  },

  // ── Services & Appointments ──
  beauty: {
    type: "services", sidebarStyle: "glass", cardStyle: "glass",
    bgGradient: "linear-gradient(165deg, #0c0810 0%, #18101a 40%, #0c0810 100%)",
    bgPattern: "mesh", headerStyle: "compact", dashboardGrid: "masonry",
    accentGlow: true, kpiStyle: "ring", chartBg: "rgba(217,70,168,0.03)",
    tableStyle: "cards",
  },
  fitness: {
    type: "services", sidebarStyle: "accent-bar", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #0a0a0a 0%, #1a1000 40%, #0a0a0a 100%)",
    bgPattern: "diagonal", headerStyle: "banner", dashboardGrid: "standard",
    accentGlow: true, kpiStyle: "inline", chartBg: "rgba(255,107,0,0.03)",
    tableStyle: "striped",
  },

  // ── Operations & Field ──
  plumber: {
    type: "operations", sidebarStyle: "solid", cardStyle: "solid",
    bgGradient: "linear-gradient(165deg, #060a12 0%, #0a1428 40%, #060a12 100%)",
    bgPattern: "grid", headerStyle: "compact", dashboardGrid: "kanban",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(37,99,235,0.03)",
    tableStyle: "bordered",
  },
  electrician: {
    type: "operations", sidebarStyle: "accent-bar", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #0a0a04 0%, #14120a 40%, #0a0a04 100%)",
    bgPattern: "grid", headerStyle: "compact", dashboardGrid: "kanban",
    accentGlow: true, kpiStyle: "inline", chartBg: "rgba(245,158,11,0.03)",
    tableStyle: "bordered",
  },
  construction: {
    type: "operations", sidebarStyle: "solid", cardStyle: "solid",
    bgGradient: "linear-gradient(165deg, #0a0704 0%, #1a1008 40%, #0a0704 100%)",
    bgPattern: "diagonal", headerStyle: "banner", dashboardGrid: "timeline",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(239,108,0,0.03)",
    tableStyle: "bordered",
  },
  cleaning: {
    type: "operations", sidebarStyle: "minimal", cardStyle: "outlined",
    bgGradient: "linear-gradient(165deg, #040a0c 0%, #081418 40%, #040a0c 100%)",
    bgPattern: "dots", headerStyle: "compact", dashboardGrid: "kanban",
    accentGlow: false, kpiStyle: "pill", chartBg: "rgba(0,188,212,0.03)",
    tableStyle: "striped",
  },
  gardening: {
    type: "operations", sidebarStyle: "solid", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #040a04 0%, #081408 40%, #040a04 100%)",
    bgPattern: "dots", headerStyle: "standard", dashboardGrid: "kanban",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(76,175,80,0.03)",
    tableStyle: "striped",
  },
  garage: {
    type: "operations", sidebarStyle: "accent-bar", cardStyle: "solid",
    bgGradient: "linear-gradient(165deg, #0a0404 0%, #180808 40%, #0a0404 100%)",
    bgPattern: "diagonal", headerStyle: "compact", dashboardGrid: "kanban",
    accentGlow: true, kpiStyle: "inline", chartBg: "rgba(229,57,53,0.03)",
    tableStyle: "bordered",
  },

  // ── Commerce ──
  retail: {
    type: "commerce", sidebarStyle: "minimal", cardStyle: "outlined",
    bgGradient: "linear-gradient(165deg, #0a0a0a 0%, #121212 40%, #0a0a0a 100%)",
    bgPattern: "none", headerStyle: "split", dashboardGrid: "bento",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(26,26,26,0.5)",
    tableStyle: "minimal",
  },
  logistics: {
    type: "commerce", sidebarStyle: "solid", cardStyle: "solid",
    bgGradient: "linear-gradient(165deg, #060808 0%, #0c1014 40%, #060808 100%)",
    bgPattern: "grid", headerStyle: "banner", dashboardGrid: "standard",
    accentGlow: false, kpiStyle: "inline", chartBg: "rgba(96,125,139,0.03)",
    tableStyle: "bordered",
  },

  // ── Professional ──
  legal: {
    type: "professional", sidebarStyle: "solid", cardStyle: "elevated",
    bgGradient: "linear-gradient(165deg, #080604 0%, #100e0a 40%, #080604 100%)",
    bgPattern: "none", headerStyle: "standard", dashboardGrid: "timeline",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(121,85,72,0.03)",
    tableStyle: "minimal",
  },
  accountant: {
    type: "professional", sidebarStyle: "minimal", cardStyle: "outlined",
    bgGradient: "linear-gradient(165deg, #040a08 0%, #081410 40%, #040a08 100%)",
    bgPattern: "grid", headerStyle: "compact", dashboardGrid: "standard",
    accentGlow: false, kpiStyle: "inline", chartBg: "rgba(0,150,136,0.03)",
    tableStyle: "striped",
  },
  education: {
    type: "professional", sidebarStyle: "glass", cardStyle: "glass",
    bgGradient: "linear-gradient(165deg, #04080a 0%, #081420 40%, #04080a 100%)",
    bgPattern: "dots", headerStyle: "banner", dashboardGrid: "bento",
    accentGlow: true, kpiStyle: "ring", chartBg: "rgba(33,150,243,0.03)",
    tableStyle: "cards",
  },

  // ── Creative ──
  photography: {
    type: "creative", sidebarStyle: "floating", cardStyle: "glass",
    bgGradient: "linear-gradient(165deg, #0a040a 0%, #140a14 40%, #0a040a 100%)",
    bgPattern: "mesh", headerStyle: "compact", dashboardGrid: "masonry",
    accentGlow: true, kpiStyle: "pill", chartBg: "rgba(171,71,188,0.03)",
    tableStyle: "cards",
  },
  tattoo: {
    type: "creative", sidebarStyle: "accent-bar", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #0a0404 0%, #180808 40%, #0a0404 100%)",
    bgPattern: "diagonal", headerStyle: "compact", dashboardGrid: "masonry",
    accentGlow: true, kpiStyle: "inline", chartBg: "rgba(244,67,54,0.03)",
    tableStyle: "cards",
  },
  events: {
    type: "creative", sidebarStyle: "glass", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #0a0408 0%, #180814 40%, #0a0408 100%)",
    bgPattern: "mesh", headerStyle: "banner", dashboardGrid: "timeline",
    accentGlow: true, kpiStyle: "ring", chartBg: "rgba(233,30,99,0.03)",
    tableStyle: "minimal",
  },

  // ── Care ──
  healthcare: {
    type: "care", sidebarStyle: "minimal", cardStyle: "outlined",
    bgGradient: "linear-gradient(165deg, #040a0c 0%, #081416 40%, #040a0c 100%)",
    bgPattern: "dots", headerStyle: "standard", dashboardGrid: "timeline",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(0,180,160,0.03)",
    tableStyle: "striped",
  },
  veterinary: {
    type: "care", sidebarStyle: "solid", cardStyle: "solid",
    bgGradient: "linear-gradient(165deg, #040a04 0%, #0a140a 40%, #040a04 100%)",
    bgPattern: "dots", headerStyle: "standard", dashboardGrid: "timeline",
    accentGlow: false, kpiStyle: "cards", chartBg: "rgba(102,187,106,0.03)",
    tableStyle: "striped",
  },
  childcare: {
    type: "care", sidebarStyle: "solid", cardStyle: "gradient",
    bgGradient: "linear-gradient(165deg, #0a0804 0%, #141008 40%, #0a0804 100%)",
    bgPattern: "none", headerStyle: "banner", dashboardGrid: "bento",
    accentGlow: false, kpiStyle: "ring", chartBg: "rgba(255,152,0,0.03)",
    tableStyle: "cards",
  },

  // ── Mobility ──
  ncc: {
    type: "mobility", sidebarStyle: "glass", cardStyle: "elevated",
    bgGradient: "linear-gradient(165deg, #08080a 0%, #10101a 40%, #08080a 100%)",
    bgPattern: "mesh", headerStyle: "split", dashboardGrid: "standard",
    accentGlow: true, kpiStyle: "pill", chartBg: "rgba(212,175,55,0.03)",
    tableStyle: "minimal",
  },
};

export const getAdminLayout = (sector: string): AdminLayoutConfig => {
  return ADMIN_LAYOUT_MAP[sector] || ADMIN_LAYOUT_MAP.food!;
};
