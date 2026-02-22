import dishPasta from "@/assets/dish-pasta.jpg";
import dishPizza from "@/assets/dish-pizza.jpg";
import dishTiramisu from "@/assets/dish-tiramisu.jpg";
import dishBruschetta from "@/assets/dish-bruschetta.jpg";
import dishSteak from "@/assets/dish-steak.jpg";
import restaurantLogo from "@/assets/restaurant-logo.png";
import type { MenuItem, Restaurant } from "@/types/restaurant";

export const demoRestaurant: Restaurant = {
  slug: "impero-roma",
  name: "Impero Roma",
  logo: restaurantLogo,
  primaryColor: "#C8922A",
  tagline: "L'arte della cucina italiana dal 1987",
};

export const demoMenu: MenuItem[] = [
  {
    id: "1",
    name: "Bruschetta Classica",
    description: "Pomodoro San Marzano, basilico fresco dell'orto, olio EVO Toscano DOP su pane croccante di Altamura.",
    price: 8.5,
    image: dishBruschetta,
    category: "Antipasti",
    allergens: ["glutine"],
    isPopular: true,
  },
  {
    id: "2",
    name: "Tagliatelle al Tartufo",
    description: "Pasta fresca all'uovo, crema di Parmigiano 36 mesi, tartufo nero pregiato di Norcia, burro di montagna.",
    price: 22.0,
    image: dishPasta,
    category: "Primi",
    allergens: ["glutine", "uova", "latticini"],
    isPopular: true,
  },
  {
    id: "3",
    name: "Margherita DOP",
    description: "Impasto a 72h di lievitazione, pomodoro San Marzano, mozzarella di bufala campana DOP, basilico fresco.",
    price: 14.0,
    image: dishPizza,
    category: "Pizze",
    allergens: ["glutine", "latticini"],
  },
  {
    id: "4",
    name: "Ribeye alla Griglia",
    description: "Ribeye di Black Angus 400g, frollatura 30 giorni, rosmarino e burro all'aglio nero fermentato.",
    price: 38.0,
    image: dishSteak,
    category: "Secondi",
    allergens: ["latticini"],
    isPopular: true,
  },
  {
    id: "5",
    name: "Tiramisù della Nonna",
    description: "Mascarpone artigianale, savoiardi fatti in casa, caffè espresso, cacao amaro del Venezuela.",
    price: 10.0,
    image: dishTiramisu,
    category: "Dolci",
    allergens: ["glutine", "uova", "latticini"],
  },
];

export const menuCategories = ["Antipasti", "Primi", "Pizze", "Secondi", "Dolci"];
