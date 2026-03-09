import type { BusinessType } from "./business-type";

export interface MenuPresetItem {
  name: string;
  description: string;
  price: number;
  category: string;
  is_popular: boolean;
  sort_order: number;
}

const RESTAURANT_PRESET: MenuPresetItem[] = [
  { name: "Bruschetta Classica", description: "Pomodorini freschi, basilico e olio EVO su pane toscano", price: 8, category: "Antipasti", is_popular: true, sort_order: 1 },
  { name: "Tagliere Misto", description: "Selezione di salumi e formaggi stagionati", price: 16, category: "Antipasti", is_popular: false, sort_order: 2 },
  { name: "Spaghetti Carbonara", description: "Guanciale croccante, pecorino romano, tuorlo d'uovo", price: 14, category: "Primi", is_popular: true, sort_order: 3 },
  { name: "Risotto ai Funghi Porcini", description: "Riso Carnaroli mantecato con porcini freschi", price: 16, category: "Primi", is_popular: false, sort_order: 4 },
  { name: "Tagliata di Manzo", description: "Controfiletto alla griglia con rucola e grana", price: 22, category: "Secondi", is_popular: false, sort_order: 5 },
  { name: "Branzino al Forno", description: "Con patate, olive taggiasche e capperi", price: 20, category: "Secondi", is_popular: false, sort_order: 6 },
  { name: "Tiramisù", description: "Mascarpone, savoiardi, caffè espresso, cacao", price: 7, category: "Dolci", is_popular: true, sort_order: 7 },
  { name: "Acqua Minerale", description: "Naturale o frizzante 75cl", price: 3, category: "Bevande", is_popular: false, sort_order: 8 },
];

const PIZZERIA_PRESET: MenuPresetItem[] = [
  { name: "Margherita", description: "Pomodoro San Marzano, mozzarella di bufala, basilico fresco", price: 8, category: "Pizze Classiche", is_popular: true, sort_order: 1 },
  { name: "Diavola", description: "Salamino piccante, mozzarella, peperoncino calabrese", price: 10, category: "Pizze Classiche", is_popular: true, sort_order: 2 },
  { name: "Quattro Formaggi", description: "Mozzarella, gorgonzola, fontina, parmigiano", price: 11, category: "Pizze Classiche", is_popular: false, sort_order: 3 },
  { name: "Bufala e Prosciutto Crudo", description: "Mozzarella di bufala DOP, crudo di Parma, rucola", price: 13, category: "Pizze Speciali", is_popular: true, sort_order: 4 },
  { name: "Tartufo e Burrata", description: "Crema di tartufo, burrata, funghi porcini", price: 15, category: "Pizze Speciali", is_popular: false, sort_order: 5 },
  { name: "Calzone Fritto", description: "Ripieno di ricotta, salame e provola", price: 9, category: "Fritti", is_popular: false, sort_order: 6 },
  { name: "Supplì al Telefono", description: "Riso, ragù e mozzarella filante (3 pz)", price: 5, category: "Fritti", is_popular: false, sort_order: 7 },
  { name: "Tiramisù", description: "Fatto in casa ogni giorno", price: 5, category: "Dolci", is_popular: false, sort_order: 8 },
  { name: "Birra Artigianale 33cl", description: "IPA, Lager o Weiss — chiedi al banco", price: 5, category: "Bevande", is_popular: false, sort_order: 9 },
  { name: "Coca-Cola / Fanta", description: "Lattina 33cl", price: 3, category: "Bevande", is_popular: false, sort_order: 10 },
];

const BAR_PRESET: MenuPresetItem[] = [
  { name: "Aperol Spritz", description: "Aperol, prosecco, soda, fetta d'arancia", price: 8, category: "Cocktail", is_popular: true, sort_order: 1 },
  { name: "Negroni", description: "Gin, Campari, Vermouth rosso", price: 9, category: "Cocktail", is_popular: true, sort_order: 2 },
  { name: "Moscow Mule", description: "Vodka, ginger beer, lime fresco", price: 9, category: "Cocktail", is_popular: false, sort_order: 3 },
  { name: "Gin Tonic Premium", description: "Gin artigianale, tonica Fever-Tree, botaniche", price: 10, category: "Cocktail", is_popular: false, sort_order: 4 },
  { name: "Calice Prosecco", description: "Valdobbiadene DOCG", price: 6, category: "Vini & Bollicine", is_popular: false, sort_order: 5 },
  { name: "Calice Rosso della Casa", description: "Chianti Classico DOCG", price: 6, category: "Vini & Bollicine", is_popular: false, sort_order: 6 },
  { name: "Tagliere Aperitivo", description: "Salumi, formaggi, olive e focaccia", price: 14, category: "Food", is_popular: true, sort_order: 7 },
  { name: "Bruschette Miste (4 pz)", description: "Pomodoro, salmone, burrata, nduja", price: 10, category: "Food", is_popular: false, sort_order: 8 },
  { name: "Espresso", description: "Caffè 100% arabica", price: 1.5, category: "Caffetteria", is_popular: false, sort_order: 9 },
  { name: "Cappuccino", description: "Espresso e latte schiumato", price: 2, category: "Caffetteria", is_popular: false, sort_order: 10 },
];

const BAKERY_PRESET: MenuPresetItem[] = [
  { name: "Croissant Classico", description: "Sfoglia al burro francese, fragrante e dorata", price: 1.8, category: "Cornetteria", is_popular: true, sort_order: 1 },
  { name: "Pain au Chocolat", description: "Sfoglia con cuore di cioccolato fondente", price: 2.2, category: "Cornetteria", is_popular: true, sort_order: 2 },
  { name: "Brioche alla Crema", description: "Crema pasticcera artigianale", price: 2, category: "Cornetteria", is_popular: false, sort_order: 3 },
  { name: "Torta della Nonna", description: "Crema, pinoli e zucchero a velo — porzione", price: 4.5, category: "Dolci al Taglio", is_popular: true, sort_order: 4 },
  { name: "Crostata Frutta Fresca", description: "Base frolla, crema e frutta di stagione", price: 5, category: "Dolci al Taglio", is_popular: false, sort_order: 5 },
  { name: "Cannolo Siciliano", description: "Ricotta di pecora, gocce di cioccolato, granella", price: 3.5, category: "Mignon & Classici", is_popular: true, sort_order: 6 },
  { name: "Macaron (3 pz)", description: "Pistacchio, lampone, cioccolato", price: 6, category: "Mignon & Classici", is_popular: false, sort_order: 7 },
  { name: "Pane Tipo 1", description: "Pagnotta artigianale 500g", price: 3, category: "Pane & Focacce", is_popular: false, sort_order: 8 },
  { name: "Focaccia Genovese", description: "Olio EVO e sale grosso — al pezzo", price: 3, category: "Pane & Focacce", is_popular: false, sort_order: 9 },
  { name: "Espresso", description: "100% arabica", price: 1.3, category: "Bevande", is_popular: false, sort_order: 10 },
];

const SUSHI_PRESET: MenuPresetItem[] = [
  { name: "Edamame", description: "Fagioli di soia al vapore con sale marino", price: 5, category: "Antipasti", is_popular: false, sort_order: 1 },
  { name: "Gyoza (5 pz)", description: "Ravioli giapponesi alla piastra con salsa ponzu", price: 7, category: "Antipasti", is_popular: true, sort_order: 2 },
  { name: "Sashimi Misto (12 pz)", description: "Salmone, tonno, branzino — freschezza garantita", price: 18, category: "Sashimi", is_popular: true, sort_order: 3 },
  { name: "Nigiri Salmone (2 pz)", description: "Riso shari e salmone norvegese", price: 6, category: "Nigiri", is_popular: false, sort_order: 4 },
  { name: "Nigiri Tonno (2 pz)", description: "Riso shari e tonno pinna gialla", price: 7, category: "Nigiri", is_popular: false, sort_order: 5 },
  { name: "California Roll (8 pz)", description: "Surimi, avocado, cetriolo, sesamo", price: 10, category: "Uramaki", is_popular: true, sort_order: 6 },
  { name: "Dragon Roll (8 pz)", description: "Tempura di gambero, avocado, anguilla, teriyaki", price: 14, category: "Uramaki", is_popular: true, sort_order: 7 },
  { name: "Rainbow Roll (8 pz)", description: "Pesce misto, avocado, philadelphia", price: 13, category: "Uramaki", is_popular: false, sort_order: 8 },
  { name: "Ramen Tonkotsu", description: "Brodo di maiale, chashu, uovo, noodles", price: 14, category: "Piatti Caldi", is_popular: false, sort_order: 9 },
  { name: "Birra Asahi 33cl", description: "Lager giapponese premium", price: 5, category: "Bevande", is_popular: false, sort_order: 10 },
  { name: "Sake Junmai (180ml)", description: "Servito caldo o freddo", price: 8, category: "Bevande", is_popular: false, sort_order: 11 },
];

export const MENU_PRESETS: Record<BusinessType, MenuPresetItem[]> = {
  restaurant: RESTAURANT_PRESET,
  pizzeria: PIZZERIA_PRESET,
  bar: BAR_PRESET,
  bakery: BAKERY_PRESET,
  sushi: SUSHI_PRESET,
};

export function getMenuPreset(businessType: BusinessType): MenuPresetItem[] {
  return MENU_PRESETS[businessType] || RESTAURANT_PRESET;
}
