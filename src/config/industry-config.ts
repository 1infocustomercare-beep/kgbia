// ── Industry Configuration System ──────────────────────────────────
// Multi-tenant industry-adaptive config. Each industry defines its own
// labels, icons, modules, features, and terminology.

export type IndustryId =
  | "food"
  | "ncc"
  | "beauty"
  | "healthcare"
  | "retail"
  | "fitness"
  | "hospitality";

export interface IndustryModule {
  id: string;
  label: string;
  icon: string; // lucide icon name
  path: string;
  enabled: boolean;
}

export interface IndustryTerminology {
  company: string;       // "Ristorante" / "Azienda NCC" / "Salone"
  companies: string;     // plural
  customer: string;      // "Cliente" / "Passeggero" / "Paziente"
  customers: string;
  order: string;         // "Ordine" / "Prenotazione Corsa" / "Appuntamento"
  orders: string;
  item: string;          // "Piatto" / "Veicolo" / "Trattamento"
  items: string;
  staff: string;         // "Staff" / "Autisti" / "Operatori"
}

export interface IndustryConfig {
  id: IndustryId;
  label: string;
  description: string;
  icon: string;
  color: string; // HSL accent
  terminology: IndustryTerminology;
  modules: IndustryModule[];
  features: string[];
  defaultPrimaryColor: string;
}

export const INDUSTRY_CONFIGS: Record<IndustryId, IndustryConfig> = {
  food: {
    id: "food",
    label: "Food & Ristorazione",
    description: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar",
    icon: "ChefHat",
    color: "24 95% 53%",
    terminology: {
      company: "Ristorante",
      companies: "Ristoranti",
      customer: "Cliente",
      customers: "Clienti",
      order: "Ordine",
      orders: "Ordini",
      item: "Piatto",
      items: "Piatti",
      staff: "Staff",
    },
    modules: [
      { id: "menu", label: "Menu Digitale", icon: "BookOpen", path: "/dashboard", enabled: true },
      { id: "orders", label: "Ordini", icon: "ShoppingBag", path: "/dashboard", enabled: true },
      { id: "kitchen", label: "Cucina", icon: "ChefHat", path: "/kitchen", enabled: true },
      { id: "tables", label: "Mappa Tavoli", icon: "LayoutGrid", path: "/dashboard", enabled: true },
      { id: "reservations", label: "Prenotazioni", icon: "Calendar", path: "/dashboard", enabled: true },
      { id: "reviews", label: "Recensioni", icon: "Star", path: "/dashboard", enabled: true },
      { id: "crm", label: "CRM Clienti", icon: "Users", path: "/dashboard", enabled: true },
      { id: "loyalty", label: "Wallet Fedeltà", icon: "Wallet", path: "/dashboard", enabled: true },
      { id: "inventory", label: "Inventario", icon: "Package", path: "/dashboard", enabled: true },
      { id: "haccp", label: "HACCP", icon: "ClipboardCheck", path: "/dashboard", enabled: true },
    ],
    features: ["qr_menu", "delivery", "takeaway", "table_orders", "kitchen_display", "allergens"],
    defaultPrimaryColor: "#C8963E",
  },
  ncc: {
    id: "ncc",
    label: "NCC & Trasporto",
    description: "Noleggio con conducente, transfer, limousine service",
    icon: "Car",
    color: "210 80% 50%",
    terminology: {
      company: "Azienda NCC",
      companies: "Aziende NCC",
      customer: "Passeggero",
      customers: "Passeggeri",
      order: "Prenotazione Corsa",
      orders: "Prenotazioni",
      item: "Veicolo",
      items: "Veicoli",
      staff: "Autisti",
    },
    modules: [
      { id: "fleet", label: "Gestione Flotta", icon: "Car", path: "/fleet", enabled: true },
      { id: "routes", label: "Tratte", icon: "Route", path: "/routes", enabled: true },
      { id: "bookings", label: "Prenotazioni", icon: "Calendar", path: "/bookings", enabled: true },
      { id: "destinations", label: "Destinazioni", icon: "MapPin", path: "/destinations", enabled: true },
      { id: "drivers", label: "Autisti", icon: "Users", path: "/drivers", enabled: true },
      { id: "reviews", label: "Recensioni", icon: "Star", path: "/reviews", enabled: true },
    ],
    features: ["fleet_management", "route_planning", "booking_system", "driver_assignment", "gps_tracking"],
    defaultPrimaryColor: "#2563EB",
  },
  beauty: {
    id: "beauty",
    label: "Beauty & Wellness",
    description: "Saloni, centri estetici, SPA, barbieri",
    icon: "Scissors",
    color: "330 70% 55%",
    terminology: {
      company: "Salone",
      companies: "Saloni",
      customer: "Cliente",
      customers: "Clienti",
      order: "Appuntamento",
      orders: "Appuntamenti",
      item: "Trattamento",
      items: "Trattamenti",
      staff: "Operatori",
    },
    modules: [
      { id: "appointments", label: "Appuntamenti", icon: "Calendar", path: "/appointments", enabled: true },
      { id: "services", label: "Servizi", icon: "Sparkles", path: "/services", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "staff", label: "Operatori", icon: "UserCog", path: "/staff", enabled: true },
      { id: "products", label: "Prodotti", icon: "Package", path: "/products", enabled: true },
    ],
    features: ["online_booking", "service_catalog", "client_history", "loyalty_program"],
    defaultPrimaryColor: "#EC4899",
  },
  healthcare: {
    id: "healthcare",
    label: "Healthcare",
    description: "Studi medici, dentisti, fisioterapisti, cliniche",
    icon: "Heart",
    color: "160 60% 45%",
    terminology: {
      company: "Studio",
      companies: "Studi",
      customer: "Paziente",
      customers: "Pazienti",
      order: "Appuntamento",
      orders: "Appuntamenti",
      item: "Prestazione",
      items: "Prestazioni",
      staff: "Personale Medico",
    },
    modules: [
      { id: "appointments", label: "Agenda", icon: "Calendar", path: "/appointments", enabled: true },
      { id: "patients", label: "Pazienti", icon: "Users", path: "/patients", enabled: true },
      { id: "treatments", label: "Prestazioni", icon: "Stethoscope", path: "/treatments", enabled: true },
      { id: "billing", label: "Fatturazione", icon: "Receipt", path: "/billing", enabled: true },
    ],
    features: ["patient_records", "appointment_booking", "prescription_management"],
    defaultPrimaryColor: "#10B981",
  },
  retail: {
    id: "retail",
    label: "Retail & Negozi",
    description: "Negozi, boutique, e-commerce locale",
    icon: "Store",
    color: "45 90% 50%",
    terminology: {
      company: "Negozio",
      companies: "Negozi",
      customer: "Cliente",
      customers: "Clienti",
      order: "Ordine",
      orders: "Ordini",
      item: "Prodotto",
      items: "Prodotti",
      staff: "Commessi",
    },
    modules: [
      { id: "catalog", label: "Catalogo", icon: "Grid", path: "/catalog", enabled: true },
      { id: "orders", label: "Ordini", icon: "ShoppingBag", path: "/orders", enabled: true },
      { id: "inventory", label: "Magazzino", icon: "Package", path: "/inventory", enabled: true },
      { id: "customers", label: "Clienti", icon: "Users", path: "/customers", enabled: true },
    ],
    features: ["product_catalog", "inventory_management", "pos_integration", "loyalty"],
    defaultPrimaryColor: "#F59E0B",
  },
  fitness: {
    id: "fitness",
    label: "Fitness & Sport",
    description: "Palestre, centri sportivi, personal trainer",
    icon: "Dumbbell",
    color: "0 80% 55%",
    terminology: {
      company: "Palestra",
      companies: "Palestre",
      customer: "Membro",
      customers: "Membri",
      order: "Prenotazione",
      orders: "Prenotazioni",
      item: "Corso",
      items: "Corsi",
      staff: "Trainer",
    },
    modules: [
      { id: "classes", label: "Corsi", icon: "Calendar", path: "/classes", enabled: true },
      { id: "members", label: "Membri", icon: "Users", path: "/members", enabled: true },
      { id: "trainers", label: "Trainer", icon: "UserCog", path: "/trainers", enabled: true },
      { id: "subscriptions", label: "Abbonamenti", icon: "CreditCard", path: "/subscriptions", enabled: true },
    ],
    features: ["class_booking", "membership_management", "workout_tracking"],
    defaultPrimaryColor: "#EF4444",
  },
  hospitality: {
    id: "hospitality",
    label: "Hospitality",
    description: "Hotel, B&B, agriturismi, resort",
    icon: "Building",
    color: "200 70% 50%",
    terminology: {
      company: "Struttura",
      companies: "Strutture",
      customer: "Ospite",
      customers: "Ospiti",
      order: "Prenotazione",
      orders: "Prenotazioni",
      item: "Camera",
      items: "Camere",
      staff: "Personale",
    },
    modules: [
      { id: "rooms", label: "Camere", icon: "Bed", path: "/rooms", enabled: true },
      { id: "reservations", label: "Prenotazioni", icon: "Calendar", path: "/reservations", enabled: true },
      { id: "guests", label: "Ospiti", icon: "Users", path: "/guests", enabled: true },
      { id: "housekeeping", label: "Housekeeping", icon: "Sparkles", path: "/housekeeping", enabled: true },
    ],
    features: ["room_management", "channel_manager", "check_in_out", "concierge"],
    defaultPrimaryColor: "#3B82F6",
  },
};

export function getIndustryConfig(id: string | undefined): IndustryConfig {
  if (id && id in INDUSTRY_CONFIGS) return INDUSTRY_CONFIGS[id as IndustryId];
  return INDUSTRY_CONFIGS.food;
}

export function isValidIndustry(id: string): id is IndustryId {
  return id in INDUSTRY_CONFIGS;
}
