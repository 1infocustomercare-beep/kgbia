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
  | "hospitality"
  | "beach"
  | "plumber"
  | "electrician"
  | "agriturismo"
  | "cleaning"
  | "legal"
  | "accounting"
  | "garage"
  | "photography"
  | "construction"
  | "gardening"
  | "veterinary"
  | "tattoo"
  | "childcare"
  | "education"
  | "events"
  | "logistics"
  | "custom";

export interface IndustryModule {
  id: string;
  label: string;
  icon: string; // lucide icon name
  path: string;
  enabled: boolean;
}

export interface IndustryTerminology {
  company: string;
  companies: string;
  customer: string;
  customers: string;
  order: string;
  orders: string;
  item: string;
  items: string;
  staff: string;
  // Extended terminology
  products?: string;
  clients?: string;
  dashboard?: string;
  category?: string;
  reservation?: string;
}

export interface IndustryConfig {
  id: IndustryId;
  label: string;
  emoji: string;
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
    emoji: "🍽️",
    description: "Ristoranti, pizzerie, bar, pasticcerie, sushi bar",
    icon: "ChefHat",
    color: "24 95% 53%",
    terminology: {
      company: "Ristorante", companies: "Ristoranti",
      customer: "Cliente", customers: "Clienti",
      order: "Ordine", orders: "Ordini",
      item: "Piatto", items: "Piatti",
      staff: "Staff", products: "Piatti", clients: "Clienti",
      dashboard: "Dashboard", category: "Categoria", reservation: "Prenotazione",
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
    emoji: "🚗",
    description: "Noleggio con conducente, transfer, limousine service",
    icon: "Car",
    color: "43 55% 54%",
    terminology: {
      company: "Azienda NCC", companies: "Aziende NCC",
      customer: "Passeggero", customers: "Passeggeri",
      order: "Prenotazione Corsa", orders: "Prenotazioni",
      item: "Veicolo", items: "Veicoli",
      staff: "Autisti", products: "Veicoli", clients: "Passeggeri",
      dashboard: "Dashboard", category: "Tipo", reservation: "Prenotazione",
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
    defaultPrimaryColor: "#C9A84C",
  },
  beauty: {
    id: "beauty",
    label: "Beauty & Wellness",
    emoji: "💇",
    description: "Saloni, centri estetici, SPA, barbieri",
    icon: "Scissors",
    color: "330 70% 55%",
    terminology: {
      company: "Salone", companies: "Saloni",
      customer: "Cliente", customers: "Clienti",
      order: "Appuntamento", orders: "Appuntamenti",
      item: "Trattamento", items: "Trattamenti",
      staff: "Operatori", products: "Trattamenti", clients: "Clienti",
      dashboard: "Dashboard", category: "Tipo", reservation: "Appuntamento",
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
    emoji: "🏥",
    description: "Studi medici, dentisti, fisioterapisti, cliniche",
    icon: "Heart",
    color: "160 60% 45%",
    terminology: {
      company: "Studio", companies: "Studi",
      customer: "Paziente", customers: "Pazienti",
      order: "Appuntamento", orders: "Appuntamenti",
      item: "Prestazione", items: "Prestazioni",
      staff: "Personale Medico", products: "Prestazioni", clients: "Pazienti",
      dashboard: "Dashboard", category: "Tipo Visita", reservation: "Appuntamento",
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
    emoji: "🛍️",
    description: "Negozi, boutique, e-commerce locale",
    icon: "Store",
    color: "45 90% 50%",
    terminology: {
      company: "Negozio", companies: "Negozi",
      customer: "Cliente", customers: "Clienti",
      order: "Ordine", orders: "Ordini",
      item: "Prodotto", items: "Prodotti",
      staff: "Commessi", products: "Prodotti", clients: "Clienti",
      dashboard: "Dashboard", category: "Categoria", reservation: "Prenotazione",
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
    emoji: "💪",
    description: "Palestre, centri sportivi, personal trainer",
    icon: "Dumbbell",
    color: "0 80% 55%",
    terminology: {
      company: "Palestra", companies: "Palestre",
      customer: "Membro", customers: "Membri",
      order: "Prenotazione", orders: "Prenotazioni",
      item: "Corso", items: "Corsi",
      staff: "Trainer", products: "Corsi", clients: "Membri",
      dashboard: "Dashboard", category: "Tipo", reservation: "Prenotazione",
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
    emoji: "🏨",
    description: "Hotel, B&B, resort",
    icon: "Building",
    color: "200 70% 50%",
    terminology: {
      company: "Struttura", companies: "Strutture",
      customer: "Ospite", customers: "Ospiti",
      order: "Prenotazione", orders: "Prenotazioni",
      item: "Camera", items: "Camere",
      staff: "Personale", products: "Camere", clients: "Ospiti",
      dashboard: "Dashboard", category: "Tipo", reservation: "Prenotazione",
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
  beach: {
    id: "beach",
    label: "Stabilimento Balneare",
    emoji: "🌊",
    description: "Gestione ombrelloni, lettini, prenotazioni e abbonamenti stagionali",
    icon: "Umbrella",
    color: "199 89% 48%",
    terminology: {
      company: "Stabilimento", companies: "Stabilimenti",
      customer: "Ospite", customers: "Ospiti",
      order: "Prenotazione", orders: "Prenotazioni",
      item: "Postazione", items: "Postazioni",
      staff: "Operatori", products: "Postazioni", clients: "Ospiti",
      dashboard: "Spiaggia Live", category: "Zona", reservation: "Prenotazione",
    },
    modules: [
      { id: "beach_map", label: "Spiaggia Live", icon: "LayoutGrid", path: "/beach-map", enabled: true },
      { id: "beach_bookings", label: "Prenotazioni", icon: "Calendar", path: "/beach-bookings", enabled: true },
      { id: "beach_passes", label: "Abbonamenti", icon: "CreditCard", path: "/beach-passes", enabled: true },
      { id: "clients", label: "Ospiti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["beach_map", "bookings", "seasonal_passes", "analytics"],
    defaultPrimaryColor: "#0EA5E9",
  },
  plumber: {
    id: "plumber",
    label: "Idraulico",
    emoji: "🔧",
    description: "Gestione interventi, clienti, preventivi e magazzino materiali",
    icon: "Wrench",
    color: "220 13% 30%",
    terminology: {
      company: "Ditta", companies: "Ditte",
      customer: "Cliente", customers: "Clienti",
      order: "Intervento", orders: "Interventi",
      item: "Materiale", items: "Materiali",
      staff: "Tecnici", products: "Materiali", clients: "Clienti",
      dashboard: "Cantieri", category: "Tipo Intervento", reservation: "Appuntamento",
    },
    modules: [
      { id: "interventions", label: "Interventi", icon: "Wrench", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "inventory", label: "Magazzino", icon: "Package", path: "/inventory", enabled: true },
    ],
    features: ["interventions", "crm", "inventory", "invoicing", "analytics"],
    defaultPrimaryColor: "#374151",
  },
  electrician: {
    id: "electrician",
    label: "Elettricista",
    emoji: "⚡",
    description: "Gestione lavori, certificazioni, materiali e clienti",
    icon: "Zap",
    color: "38 92% 50%",
    terminology: {
      company: "Ditta", companies: "Ditte",
      customer: "Cliente", customers: "Clienti",
      order: "Lavoro", orders: "Lavori",
      item: "Componente", items: "Componenti",
      staff: "Tecnici", products: "Materiali Elettrici", clients: "Clienti",
      dashboard: "Lavori", category: "Tipo Lavoro", reservation: "Appuntamento",
    },
    modules: [
      { id: "interventions", label: "Lavori", icon: "Zap", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "inventory", label: "Materiali", icon: "Package", path: "/inventory", enabled: true },
    ],
    features: ["interventions", "crm", "inventory", "certifications", "analytics"],
    defaultPrimaryColor: "#F59E0B",
  },
  agriturismo: {
    id: "agriturismo",
    label: "Agriturismo",
    emoji: "🌾",
    description: "Gestione camere, ristorante, attività rurali e shop prodotti propri",
    icon: "Trees",
    color: "90 55% 34%",
    terminology: {
      company: "Agriturismo", companies: "Agriturismi",
      customer: "Ospite", customers: "Ospiti",
      order: "Prenotazione", orders: "Prenotazioni",
      item: "Servizio", items: "Servizi",
      staff: "Collaboratori", products: "Prodotti Propri", clients: "Ospiti",
      dashboard: "Fattoria", category: "Tipo", reservation: "Soggiorno",
    },
    modules: [
      { id: "rooms", label: "Camere", icon: "Bed", path: "/rooms", enabled: true },
      { id: "reservations", label: "Prenotazioni", icon: "Calendar", path: "/reservations", enabled: true },
      { id: "clients", label: "Ospiti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["rooms", "restaurant", "activities", "shop", "analytics"],
    defaultPrimaryColor: "#4D7C0F",
  },
  cleaning: {
    id: "cleaning",
    label: "Impresa Pulizie",
    emoji: "🏠",
    description: "Gestione servizi di pulizia, operatori, turni e abbonamenti periodici",
    icon: "SprayCanIcon",
    color: "188 86% 36%",
    terminology: {
      company: "Impresa", companies: "Imprese",
      customer: "Cliente", customers: "Clienti",
      order: "Servizio", orders: "Servizi",
      item: "Materiale", items: "Materiali",
      staff: "Operatori", products: "Prodotti", clients: "Clienti",
      dashboard: "Servizi", category: "Tipo Servizio", reservation: "Appuntamento",
    },
    modules: [
      { id: "interventions", label: "Servizi", icon: "ClipboardCheck", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "staff_schedule", label: "Turni", icon: "Calendar", path: "/team", enabled: true },
    ],
    features: ["jobs", "crm", "scheduling", "invoicing", "analytics"],
    defaultPrimaryColor: "#0891B2",
  },
  legal: {
    id: "legal",
    label: "Studio Legale",
    emoji: "⚖️",
    description: "Gestione pratiche, scadenzario, fascicoli clienti e parcelle",
    icon: "Scale",
    color: "213 56% 24%",
    terminology: {
      company: "Studio", companies: "Studi",
      customer: "Cliente", customers: "Clienti",
      order: "Pratica", orders: "Pratiche",
      item: "Atto", items: "Atti",
      staff: "Avvocati", products: "Servizi Legali", clients: "Clienti",
      dashboard: "Studio", category: "Tipo Pratica", reservation: "Appuntamento",
    },
    modules: [
      { id: "interventions", label: "Pratiche", icon: "FileText", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "appointments", label: "Appuntamenti", icon: "Calendar", path: "/appointments", enabled: true },
    ],
    features: ["practices", "crm", "deadlines", "time_tracking", "analytics"],
    defaultPrimaryColor: "#1E3A5F",
  },
  accounting: {
    id: "accounting",
    label: "Commercialista",
    emoji: "📊",
    description: "Gestione scadenze fiscali, pratiche, clienti e dichiarazioni",
    icon: "Calculator",
    color: "221 83% 53%",
    terminology: {
      company: "Studio", companies: "Studi",
      customer: "Cliente", customers: "Clienti",
      order: "Scadenza", orders: "Scadenze",
      item: "Documento", items: "Documenti",
      staff: "Collaboratori", products: "Servizi", clients: "Clienti",
      dashboard: "Studio", category: "Tipo Scadenza", reservation: "Appuntamento",
    },
    modules: [
      { id: "interventions", label: "Scadenze", icon: "Clock", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "appointments", label: "Appuntamenti", icon: "Calendar", path: "/appointments", enabled: true },
    ],
    features: ["practices", "crm", "tax_deadlines", "invoicing", "analytics"],
    defaultPrimaryColor: "#2563EB",
  },
  garage: {
    id: "garage",
    label: "Autofficina",
    emoji: "🔩",
    description: "Gestione riparazioni, veicoli clienti, ricambi e fatturazione",
    icon: "Cog",
    color: "28 76% 18%",
    terminology: {
      company: "Officina", companies: "Officine",
      customer: "Cliente", customers: "Clienti",
      order: "Lavorazione", orders: "Lavorazioni",
      item: "Ricambio", items: "Ricambi",
      staff: "Meccanici", products: "Ricambi", clients: "Clienti",
      dashboard: "Officina", category: "Tipo Lavoro", reservation: "Appuntamento",
    },
    modules: [
      { id: "interventions", label: "Lavorazioni", icon: "Wrench", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "inventory", label: "Ricambi", icon: "Package", path: "/inventory", enabled: true },
    ],
    features: ["jobs", "vehicles", "inventory", "invoicing", "analytics"],
    defaultPrimaryColor: "#78350F",
  },
  photography: {
    id: "photography",
    label: "Fotografo / Videomaker",
    emoji: "📸",
    description: "Gestione shooting, consegne, portfolio clienti e preventivi",
    icon: "Camera",
    color: "330 64% 44%",
    terminology: {
      company: "Studio", companies: "Studi",
      customer: "Cliente", customers: "Clienti",
      order: "Shooting", orders: "Shooting",
      item: "Servizio", items: "Servizi",
      staff: "Collaboratori", products: "Servizi", clients: "Clienti",
      dashboard: "Studio", category: "Tipo Shooting", reservation: "Prenotazione",
    },
    modules: [
      { id: "appointments", label: "Shooting", icon: "Camera", path: "/appointments", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["shootings", "crm", "portfolio", "invoicing", "analytics"],
    defaultPrimaryColor: "#BE185D",
  },
  construction: {
    id: "construction",
    label: "Edilizia / Muratori",
    emoji: "🏗️",
    description: "Gestione cantieri, preventivi, materiali e squadre di lavoro",
    icon: "HardHat",
    color: "30 84% 27%",
    terminology: {
      company: "Impresa", companies: "Imprese",
      customer: "Committente", customers: "Committenti",
      order: "Cantiere", orders: "Cantieri",
      item: "Materiale", items: "Materiali",
      staff: "Operai", products: "Materiali", clients: "Committenti",
      dashboard: "Cantieri", category: "Tipo Lavoro", reservation: "Sopralluogo",
    },
    modules: [
      { id: "interventions", label: "Cantieri", icon: "HardHat", path: "/interventions", enabled: true },
      { id: "clients", label: "Committenti", icon: "Users", path: "/clients", enabled: true },
      { id: "inventory", label: "Materiali", icon: "Package", path: "/inventory", enabled: true },
    ],
    features: ["jobs", "crm", "inventory", "invoicing", "analytics"],
    defaultPrimaryColor: "#92400E",
  },
  gardening: {
    id: "gardening",
    label: "Giardiniere",
    emoji: "🌿",
    description: "Gestione lavori di giardinaggio, clienti e abbonamenti manutenzione",
    icon: "Leaf",
    color: "142 76% 36%",
    terminology: {
      company: "Ditta", companies: "Ditte",
      customer: "Cliente", customers: "Clienti",
      order: "Lavoro", orders: "Lavori",
      item: "Materiale", items: "Materiali",
      staff: "Operatori", products: "Piante / Materiali", clients: "Clienti",
      dashboard: "Lavori", category: "Tipo Lavoro", reservation: "Sopralluogo",
    },
    modules: [
      { id: "interventions", label: "Lavori", icon: "Leaf", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
      { id: "inventory", label: "Materiali", icon: "Package", path: "/inventory", enabled: true },
    ],
    features: ["jobs", "crm", "inventory", "invoicing", "analytics"],
    defaultPrimaryColor: "#16A34A",
  },
  veterinary: {
    id: "veterinary",
    label: "Veterinario",
    emoji: "🐾",
    description: "Agenda visite, schede animali, farmaci e proprietari",
    icon: "Heart",
    color: "188 86% 36%",
    terminology: {
      company: "Clinica", companies: "Cliniche",
      customer: "Proprietario", customers: "Proprietari",
      order: "Visita", orders: "Visite",
      item: "Farmaco", items: "Farmaci",
      staff: "Veterinari", products: "Farmaci", clients: "Proprietari",
      dashboard: "Clinica", category: "Tipo Visita", reservation: "Appuntamento",
    },
    modules: [
      { id: "appointments", label: "Visite", icon: "Calendar", path: "/appointments", enabled: true },
      { id: "clients", label: "Proprietari", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["appointments", "animals", "pharmacy", "invoicing", "analytics"],
    defaultPrimaryColor: "#0891B2",
  },
  tattoo: {
    id: "tattoo",
    label: "Tatuatore / Piercing",
    emoji: "🎨",
    description: "Gestione appuntamenti, portfolio lavori, clienti e cura post",
    icon: "Pen",
    color: "263 70% 50%",
    terminology: {
      company: "Studio", companies: "Studi",
      customer: "Cliente", customers: "Clienti",
      order: "Appuntamento", orders: "Appuntamenti",
      item: "Servizio", items: "Servizi",
      staff: "Artisti", products: "Servizi", clients: "Clienti",
      dashboard: "Studio", category: "Tipo", reservation: "Appuntamento",
    },
    modules: [
      { id: "appointments", label: "Appuntamenti", icon: "Calendar", path: "/appointments", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["appointments", "crm", "portfolio", "invoicing", "analytics"],
    defaultPrimaryColor: "#7C3AED",
  },
  childcare: {
    id: "childcare",
    label: "Baby-sitter / Asilo",
    emoji: "👶",
    description: "Gestione prenotazioni, bambini, famiglie e attività educative",
    icon: "Baby",
    color: "38 92% 50%",
    terminology: {
      company: "Centro", companies: "Centri",
      customer: "Famiglia", customers: "Famiglie",
      order: "Prenotazione", orders: "Prenotazioni",
      item: "Attività", items: "Attività",
      staff: "Educatori", products: "Servizi", clients: "Famiglie",
      dashboard: "Centro", category: "Fascia Età", reservation: "Prenotazione",
    },
    modules: [
      { id: "appointments", label: "Prenotazioni", icon: "Calendar", path: "/appointments", enabled: true },
      { id: "clients", label: "Famiglie", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["appointments", "crm", "registry", "invoicing", "analytics"],
    defaultPrimaryColor: "#F59E0B",
  },
  education: {
    id: "education",
    label: "Formazione / Corsi",
    emoji: "🎓",
    description: "Gestione corsi, iscrizioni studenti, materiali didattici e certificati",
    icon: "GraduationCap",
    color: "221 83% 53%",
    terminology: {
      company: "Centro", companies: "Centri",
      customer: "Studente", customers: "Studenti",
      order: "Iscrizione", orders: "Iscrizioni",
      item: "Modulo", items: "Moduli",
      staff: "Docenti", products: "Corsi", clients: "Studenti",
      dashboard: "Corsi", category: "Materia", reservation: "Iscrizione",
    },
    modules: [
      { id: "appointments", label: "Corsi", icon: "BookOpen", path: "/appointments", enabled: true },
      { id: "clients", label: "Studenti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["courses", "students", "materials", "certifications", "analytics"],
    defaultPrimaryColor: "#2563EB",
  },
  events: {
    id: "events",
    label: "Organizzazione Eventi",
    emoji: "🎉",
    description: "Gestione eventi, budget, fornitori, ospiti e logistica",
    icon: "PartyPopper",
    color: "24 95% 53%",
    terminology: {
      company: "Agenzia", companies: "Agenzie",
      customer: "Cliente", customers: "Clienti",
      order: "Evento", orders: "Eventi",
      item: "Elemento", items: "Elementi",
      staff: "Collaboratori", products: "Servizi", clients: "Clienti",
      dashboard: "Eventi", category: "Tipo Evento", reservation: "Prenotazione",
    },
    modules: [
      { id: "interventions", label: "Eventi", icon: "Calendar", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["events", "crm", "vendors", "budget", "analytics"],
    defaultPrimaryColor: "#C8963E",
  },
  logistics: {
    id: "logistics",
    label: "Trasporti / Logistica",
    emoji: "🚚",
    description: "Gestione spedizioni, tracking, flotta mezzi e autisti",
    icon: "Truck",
    color: "220 13% 30%",
    terminology: {
      company: "Azienda", companies: "Aziende",
      customer: "Cliente", customers: "Clienti",
      order: "Spedizione", orders: "Spedizioni",
      item: "Collo", items: "Colli",
      staff: "Autisti", products: "Colli / Merci", clients: "Clienti",
      dashboard: "Magazzino", category: "Tipo Spedizione", reservation: "Ritiro",
    },
    modules: [
      { id: "interventions", label: "Spedizioni", icon: "Truck", path: "/interventions", enabled: true },
      { id: "fleet", label: "Flotta", icon: "Car", path: "/fleet", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["shipments", "fleet", "tracking", "invoicing", "analytics"],
    defaultPrimaryColor: "#374151",
  },
  custom: {
    id: "custom",
    label: "Settore Personalizzato",
    emoji: "⚙️",
    description: "Configura la piattaforma per il tuo settore specifico",
    icon: "Settings",
    color: "220 9% 46%",
    terminology: {
      company: "Azienda", companies: "Aziende",
      customer: "Cliente", customers: "Clienti",
      order: "Ordine", orders: "Ordini",
      item: "Voce", items: "Voci",
      staff: "Staff", products: "Prodotti", clients: "Clienti",
      dashboard: "Dashboard", category: "Categoria", reservation: "Prenotazione",
    },
    modules: [
      { id: "interventions", label: "Ordini", icon: "ClipboardCheck", path: "/interventions", enabled: true },
      { id: "clients", label: "Clienti", icon: "Users", path: "/clients", enabled: true },
    ],
    features: ["dashboard", "orders", "crm", "invoicing", "analytics"],
    defaultPrimaryColor: "#6B7280",
  },
};

export function getIndustryConfig(id: string | undefined): IndustryConfig {
  if (id && id in INDUSTRY_CONFIGS) return INDUSTRY_CONFIGS[id as IndustryId];
  return INDUSTRY_CONFIGS.food;
}

export function isValidIndustry(id: string): id is IndustryId {
  return id in INDUSTRY_CONFIGS;
}
