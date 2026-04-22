/**
 * Demo Site Blueprints — Registry Full Power
 *
 * Mappa settori → template, agenti AI obbligatori, moduli funzionali.
 * Single source of truth client-side; sincronizzato col DB `demo_site_blueprints`.
 */

export interface TemplateVariant {
  key: string;
  name: string;
  preview?: string;
}

export interface DemoSiteBlueprint {
  slug: string;
  name: string;
  sector: string;
  subSectors: string[];
  templateVariants: TemplateVariant[];
  requiredAgents: string[];
  functionalModules: string[];
  defaultColors: { primary: string; accent: string; background: string };
  displayOrder: number;
}

export const DEMO_SITE_BLUEPRINTS: DemoSiteBlueprint[] = [
  {
    slug: "food-restaurant",
    name: "Food & Restaurant Empire",
    sector: "food",
    subSectors: ["pizzeria", "sushi", "ristorante", "trattoria", "pesce", "carne", "pane", "gelateria"],
    templateVariants: [
      { key: "strapizzami", name: "Strapizzami Cream" },
      { key: "paperfish", name: "Paperfish Sakura" },
      { key: "batey", name: "Batey Pacifico" },
      { key: "cote-miami", name: "Cote Miami Luxury" },
    ],
    requiredAgents: ["mary_fiscal", "arianna_sales", "voice_agent_reservations", "ai_reviews", "ai_menu_optimizer", "ai_upsell"],
    functionalModules: ["menu_digitale", "prenotazioni", "ordini_online", "kitchen_view", "whatsapp_orders", "loyalty_program", "reviews_management", "fiscal_compliance"],
    defaultColors: { primary: "#C8963E", accent: "#1a1a1a", background: "#0a0a0a" },
    displayOrder: 1,
  },
  {
    slug: "beauty-wellness",
    name: "Beauty & Wellness Empire",
    sector: "beauty",
    subSectors: ["parrucchiere", "estetica", "nails", "barber", "spa", "massaggi"],
    templateVariants: [
      { key: "luxury-rose", name: "Luxury Rose" },
      { key: "minimal-nude", name: "Minimal Nude" },
    ],
    requiredAgents: ["arianna_sales", "voice_agent_booking", "ai_upsell", "ai_reviews", "ai_loyalty"],
    functionalModules: ["booking_online", "calendario_staff", "crm_clienti", "servizi_pricing", "whatsapp_reminders", "gift_cards", "loyalty_program"],
    defaultColors: { primary: "#D4A5A5", accent: "#2a1a1a", background: "#FFF8F5" },
    displayOrder: 2,
  },
  {
    slug: "ncc-transport",
    name: "NCC & Transport Empire",
    sector: "ncc",
    subSectors: ["ncc", "taxi", "limousine", "yacht", "barca", "transfer"],
    templateVariants: [
      { key: "luxury-black", name: "Luxury Black" },
      { key: "yacht-azure", name: "Yacht Azure" },
    ],
    requiredAgents: ["arianna_sales", "voice_agent_dispatch", "ai_route_optimizer", "ai_upsell", "fleet_tracker"],
    functionalModules: ["fleet_management", "driver_tracking", "booking_corse", "quote_calculator", "route_optimizer", "whatsapp_dispatch", "invoicing_b2b"],
    defaultColors: { primary: "#D4AF37", accent: "#0a0a0a", background: "#0F0F0F" },
    displayOrder: 3,
  },
  {
    slug: "wellness-fitness",
    name: "Wellness & Fitness Empire",
    sector: "wellness",
    subSectors: ["palestra", "yoga", "pilates", "crossfit", "personal-trainer"],
    templateVariants: [
      { key: "energy-orange", name: "Energy Orange" },
      { key: "zen-sage", name: "Zen Sage" },
    ],
    requiredAgents: ["arianna_sales", "voice_agent_booking", "ai_class_optimizer", "ai_loyalty", "ai_reviews"],
    functionalModules: ["class_schedule", "membership_management", "booking_classes", "trainer_profiles", "crm_clienti", "whatsapp_reminders", "payment_recurring"],
    defaultColors: { primary: "#FF6B35", accent: "#1a1a1a", background: "#FAFAFA" },
    displayOrder: 4,
  },
  {
    slug: "retail-shop",
    name: "Retail & E-Commerce Empire",
    sector: "retail",
    subSectors: ["boutique", "negozio", "abbigliamento", "accessori", "gioielleria"],
    templateVariants: [
      { key: "luxury-gold", name: "Luxury Gold" },
      { key: "clean-white", name: "Clean White" },
    ],
    requiredAgents: ["arianna_sales", "ai_product_recommender", "ai_upsell", "ai_reviews", "ai_inventory"],
    functionalModules: ["catalogo_prodotti", "ecommerce", "inventory_management", "customer_crm", "whatsapp_orders", "loyalty_program", "invoicing"],
    defaultColors: { primary: "#C8963E", accent: "#1a1a1a", background: "#FFFFFF" },
    displayOrder: 5,
  },
  {
    slug: "trades-services",
    name: "Trades & Services Empire",
    sector: "trades",
    subSectors: ["idraulico", "elettricista", "meccanico", "muratore", "giardiniere"],
    templateVariants: [
      { key: "professional-blue", name: "Professional Blue" },
      { key: "industrial-orange", name: "Industrial Orange" },
    ],
    requiredAgents: ["arianna_sales", "voice_agent_quotes", "ai_dispatcher", "ai_invoicing", "ai_reviews"],
    functionalModules: ["quote_calculator", "job_scheduling", "staff_dispatch", "invoicing_b2b", "whatsapp_quotes", "customer_crm", "photo_gallery"],
    defaultColors: { primary: "#1E40AF", accent: "#0a0a0a", background: "#F8FAFC" },
    displayOrder: 6,
  },
  {
    slug: "hospitality-hotel",
    name: "Hospitality & Hotel Empire",
    sector: "hospitality",
    subSectors: ["hotel", "b&b", "agriturismo", "resort", "villa"],
    templateVariants: [
      { key: "boutique-cream", name: "Boutique Cream" },
      { key: "resort-azure", name: "Resort Azure" },
    ],
    requiredAgents: ["mary_fiscal", "arianna_sales", "voice_agent_reception", "ai_concierge", "ai_reviews", "ai_revenue_optimizer"],
    functionalModules: ["booking_engine", "calendar_rooms", "check_in_out", "concierge_service", "whatsapp_guests", "reviews_management", "fiscal_compliance"],
    defaultColors: { primary: "#5CC8D9", accent: "#08131F", background: "#E8D5A8" },
    displayOrder: 7,
  },
  {
    slug: "professional-services",
    name: "Professional Services Empire",
    sector: "professional",
    subSectors: ["avvocato", "commercialista", "consulente", "architetto", "notaio"],
    templateVariants: [
      { key: "corporate-navy", name: "Corporate Navy" },
      { key: "elegant-bordeaux", name: "Elegant Bordeaux" },
    ],
    requiredAgents: ["arianna_sales", "voice_agent_appointments", "ai_document_assistant", "ai_invoicing", "ai_compliance"],
    functionalModules: ["appointment_booking", "client_portal", "document_management", "invoicing_b2b", "whatsapp_clients", "crm_clienti", "secure_chat"],
    defaultColors: { primary: "#1E3A8A", accent: "#0a0a0a", background: "#F8FAFC" },
    displayOrder: 8,
  },
];

export const AGENT_LABELS: Record<string, { label: string; emoji: string }> = {
  mary_fiscal: { label: "Mary Fiscal", emoji: "🧾" },
  arianna_sales: { label: "Arianna Sales", emoji: "🎯" },
  voice_agent_reservations: { label: "Voice Reservations", emoji: "📞" },
  voice_agent_booking: { label: "Voice Booking", emoji: "📞" },
  voice_agent_dispatch: { label: "Voice Dispatch", emoji: "📞" },
  voice_agent_quotes: { label: "Voice Quotes", emoji: "📞" },
  voice_agent_reception: { label: "Voice Reception", emoji: "📞" },
  voice_agent_appointments: { label: "Voice Appointments", emoji: "📞" },
  ai_reviews: { label: "AI Reviews", emoji: "⭐" },
  ai_menu_optimizer: { label: "AI Menu Optimizer", emoji: "🍽️" },
  ai_upsell: { label: "AI Upsell", emoji: "💎" },
  ai_loyalty: { label: "AI Loyalty", emoji: "🏆" },
  ai_route_optimizer: { label: "AI Route Optimizer", emoji: "🗺️" },
  fleet_tracker: { label: "Fleet Tracker", emoji: "🚗" },
  ai_class_optimizer: { label: "AI Class Optimizer", emoji: "📅" },
  ai_product_recommender: { label: "AI Recommender", emoji: "🛍️" },
  ai_inventory: { label: "AI Inventory", emoji: "📦" },
  ai_dispatcher: { label: "AI Dispatcher", emoji: "📋" },
  ai_invoicing: { label: "AI Invoicing", emoji: "💼" },
  ai_concierge: { label: "AI Concierge", emoji: "🛎️" },
  ai_revenue_optimizer: { label: "Revenue Optimizer", emoji: "📈" },
  ai_document_assistant: { label: "Document AI", emoji: "📄" },
  ai_compliance: { label: "AI Compliance", emoji: "🛡️" },
};

export const MODULE_LABELS: Record<string, string> = {
  menu_digitale: "Menu Digitale",
  prenotazioni: "Prenotazioni",
  ordini_online: "Ordini Online",
  kitchen_view: "Kitchen View",
  whatsapp_orders: "WhatsApp Orders",
  loyalty_program: "Loyalty Program",
  reviews_management: "Reviews Mgmt",
  fiscal_compliance: "Fiscal Compliance",
  booking_online: "Booking Online",
  calendario_staff: "Calendario Staff",
  crm_clienti: "CRM Clienti",
  servizi_pricing: "Servizi & Prezzi",
  whatsapp_reminders: "WhatsApp Reminders",
  gift_cards: "Gift Cards",
  fleet_management: "Fleet Management",
  driver_tracking: "Driver Tracking",
  booking_corse: "Booking Corse",
  quote_calculator: "Quote Calculator",
  route_optimizer: "Route Optimizer",
  whatsapp_dispatch: "WhatsApp Dispatch",
  invoicing_b2b: "Invoicing B2B",
  class_schedule: "Class Schedule",
  membership_management: "Membership",
  booking_classes: "Booking Classes",
  trainer_profiles: "Trainer Profiles",
  payment_recurring: "Payment Recurring",
  catalogo_prodotti: "Catalogo Prodotti",
  ecommerce: "E-Commerce",
  inventory_management: "Inventory",
  customer_crm: "Customer CRM",
  invoicing: "Invoicing",
  job_scheduling: "Job Scheduling",
  staff_dispatch: "Staff Dispatch",
  whatsapp_quotes: "WhatsApp Quotes",
  photo_gallery: "Photo Gallery",
  booking_engine: "Booking Engine",
  calendar_rooms: "Calendar Rooms",
  check_in_out: "Check-in/out",
  concierge_service: "Concierge",
  whatsapp_guests: "WhatsApp Guests",
  appointment_booking: "Appointment Booking",
  client_portal: "Client Portal",
  document_management: "Document Mgmt",
  whatsapp_clients: "WhatsApp Clients",
  secure_chat: "Secure Chat",
};

export function findBlueprintBySector(sector: string): DemoSiteBlueprint | undefined {
  const normalized = sector.toLowerCase().trim();
  return DEMO_SITE_BLUEPRINTS.find(
    (b) => b.sector === normalized || b.subSectors.includes(normalized)
  );
}

export function getBlueprintBySlug(slug: string): DemoSiteBlueprint | undefined {
  return DEMO_SITE_BLUEPRINTS.find((b) => b.slug === slug);
}
