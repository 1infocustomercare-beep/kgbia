export type BusinessType = "restaurant" | "pizzeria" | "bar" | "bakery" | "sushi";

export type BusinessModules = {
  reservations: boolean;
  loyalty: boolean;
  privateChat: boolean;
  waiterCall: boolean;
};

export type BusinessChannels = {
  delivery: boolean;
  takeaway: boolean;
  tableOrders: boolean;
};

export type BusinessCopy = {
  storyLabel: string;
  menuLabel: string;
  reservationLabel: string;
  reservationKicker: string;
  reservationTitle: string;
  reservationDescription: string;
  reservationCta: string;
};

export type BusinessPricing = {
  setupFee: number;
  monthlyFrom: number;
};

export type BusinessTypeConfig = {
  type: BusinessType;
  label: string;
  description: string;
  channels: BusinessChannels;
  modules: BusinessModules;
  copy: BusinessCopy;
  pricing: BusinessPricing;
};

export const BUSINESS_TYPE_OPTIONS: { value: BusinessType; label: string; description: string }[] = [
  { value: "restaurant", label: "Ristorante", description: "Sala + delivery/asporto + prenotazioni e loyalty." },
  { value: "pizzeria", label: "Pizzeria", description: "Focus su delivery e asporto, flusso ordini super rapido." },
  { value: "bar", label: "Bar / Cocktail", description: "QR al tavolo, chiamata cameriere, menu drink/snack." },
  { value: "bakery", label: "Pasticceria / Bakery", description: "Catalogo prodotti e prenotazione ritiro: semplice e pulito." },
  { value: "sushi", label: "Sushi", description: "Delivery + prenotazioni + upsell, multi-lingua pronta." },
];

export const BUSINESS_TYPE_CONFIG: Record<BusinessType, BusinessTypeConfig> = {
  restaurant: {
    type: "restaurant",
    label: "Ristorante",
    description: "Esperienza completa: sala, ordini e prenotazioni.",
    channels: { delivery: true, takeaway: true, tableOrders: true },
    modules: { reservations: true, loyalty: true, privateChat: true, waiterCall: true },
    copy: {
      storyLabel: "Chi Siamo",
      menuLabel: "Menù",
      reservationLabel: "Prenota",
      reservationKicker: "Riserva il Tuo Tavolo",
      reservationTitle: "Prenotazione",
      reservationDescription: "Prenota il tuo tavolo in pochi secondi. Compila il form e ti confermeremo via telefono.",
      reservationCta: "Prenota Ora",
    },
    pricing: { setupFee: 2997, monthlyFrom: 29 },
  },
  pizzeria: {
    type: "pizzeria",
    label: "Pizzeria",
    description: "Ordini veloci, delivery e asporto come priorità.",
    channels: { delivery: true, takeaway: true, tableOrders: true },
    modules: { reservations: false, loyalty: true, privateChat: true, waiterCall: false },
    copy: {
      storyLabel: "Chi Siamo",
      menuLabel: "Pizze",
      reservationLabel: "Prenota",
      reservationKicker: "Passa a Trovarci",
      reservationTitle: "Prenotazione",
      reservationDescription: "Se vuoi assicurarti un tavolo, inviaci una richiesta: ti richiamiamo per conferma.",
      reservationCta: "Invia richiesta",
    },
    pricing: { setupFee: 2497, monthlyFrom: 29 },
  },
  bar: {
    type: "bar",
    label: "Bar / Cocktail",
    description: "Menu drink, QR al tavolo e servizio più fluido.",
    channels: { delivery: false, takeaway: true, tableOrders: true },
    modules: { reservations: false, loyalty: true, privateChat: true, waiterCall: true },
    copy: {
      storyLabel: "Il Locale",
      menuLabel: "Drink",
      reservationLabel: "Prenota",
      reservationKicker: "Vivi l'Atmosfera",
      reservationTitle: "Prenotazione",
      reservationDescription: "Vuoi un tavolo? Invia i dettagli e ti richiamiamo per confermare.",
      reservationCta: "Invia richiesta",
    },
    pricing: { setupFee: 1997, monthlyFrom: 29 },
  },
  bakery: {
    type: "bakery",
    label: "Pasticceria / Bakery",
    description: "Catalogo prodotti con ritiro semplice e ordini rapidi.",
    channels: { delivery: false, takeaway: true, tableOrders: false },
    modules: { reservations: false, loyalty: true, privateChat: false, waiterCall: false },
    copy: {
      storyLabel: "Chi Siamo",
      menuLabel: "Prodotti",
      reservationLabel: "Prenota",
      reservationKicker: "Ordina e Ritira",
      reservationTitle: "Prenotazione",
      reservationDescription: "Vuoi prenotare un ritiro o una torta? Invia la richiesta e ti contattiamo.",
      reservationCta: "Invia richiesta",
    },
    pricing: { setupFee: 1497, monthlyFrom: 29 },
  },
  sushi: {
    type: "sushi",
    label: "Sushi",
    description: "Delivery e prenotazioni, perfetto per clientela internazionale.",
    channels: { delivery: true, takeaway: true, tableOrders: true },
    modules: { reservations: true, loyalty: true, privateChat: true, waiterCall: true },
    copy: {
      storyLabel: "Chi Siamo",
      menuLabel: "Menu",
      reservationLabel: "Prenota",
      reservationKicker: "Prenota il Tuo Tavolo",
      reservationTitle: "Prenotazione",
      reservationDescription: "Prenota in pochi secondi. Compila il form e ti confermeremo via telefono.",
      reservationCta: "Prenota Ora",
    },
    pricing: { setupFee: 2997, monthlyFrom: 59 },
  },
};

export function normalizeBusinessType(value: unknown): BusinessType {
  const v = String(value || "").toLowerCase();
  if (v === "restaurant" || v === "pizzeria" || v === "bar" || v === "bakery" || v === "sushi") return v;
  return "restaurant";
}

export function getBusinessTypeConfig(value: unknown): BusinessTypeConfig {
  return BUSINESS_TYPE_CONFIG[normalizeBusinessType(value)];
}
