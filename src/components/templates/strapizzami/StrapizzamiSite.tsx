import { useState, useMemo } from "react";
import { toast } from "sonner";
import { StrapizzamiHome, type StrapizzamiMenuItem } from "./StrapizzamiHome";
import { StrapizzamiMenu } from "./StrapizzamiMenu";
import { StrapizzamiDetail, type StrapizzamiExtra } from "./StrapizzamiDetail";
import { StrapizzamiCart, type StrapizzamiCartItem } from "./StrapizzamiCart";

export interface StrapizzamiSiteData {
  brandName: string;
  subtitle?: string;
  heroImage: string;
  heroTagline?: string;
  address: string;
  items: (StrapizzamiMenuItem & { extras?: StrapizzamiExtra[]; ingredients?: string })[];
}

export type StrapizzamiScreen = "home" | "menu" | "detail" | "cart";

const DEFAULT_EXTRAS: StrapizzamiExtra[] = [
  { id: "bufala", label: "Mozzarella di Bufala", price: 2 },
  { id: "cipolla", label: "Cipolla Rossa", price: 1 },
  { id: "funghi", label: "Funghi", price: 1.5 },
];

export function StrapizzamiSite({
  data,
  controlledScreen,
  onScreenChange,
}: {
  data: StrapizzamiSiteData;
  controlledScreen?: StrapizzamiScreen;
  onScreenChange?: (s: StrapizzamiScreen) => void;
}) {
  const [internalScreen, setInternalScreen] = useState<StrapizzamiScreen>("home");
  const screen = controlledScreen ?? internalScreen;
  const setScreen = (s: StrapizzamiScreen) => {
    if (controlledScreen === undefined) setInternalScreen(s);
    onScreenChange?.(s);
  };
  const [selectedItem, setSelectedItem] = useState<StrapizzamiSiteData["items"][number] | null>(null);
  const [cart, setCart] = useState<StrapizzamiCartItem[]>([]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["Tutte"]);
    data.items.forEach(i => cats.add(i.category));
    return Array.from(cats);
  }, [data.items]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (item: StrapizzamiMenuItem, qty = 1) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, qty: c.qty + qty } : c);
      return [...prev, {
        id: item.id, name: item.name, description: item.description,
        price: item.price, qty, image: item.image,
      }];
    });
    toast.success(`${item.name} aggiunto al carrello`);
  };

  const handleNavigate = (k: "home" | "menu" | "orders" | "profile" | "offers") => {
    if (k === "home") setScreen("home");
    else if (k === "menu") setScreen("menu");
    else if (k === "orders") setScreen("cart");
    else toast.info(`${k} — disponibile nella versione completa`);
  };

  if (screen === "detail" && selectedItem) {
    return (
      <StrapizzamiDetail
        brandName={data.brandName}
        item={{
          ...selectedItem,
          extras: selectedItem.extras || DEFAULT_EXTRAS,
        }}
        onBack={() => setScreen("menu")}
        onAdd={(qty) => {
          addToCart(selectedItem, qty);
          setScreen("cart");
        }}
      />
    );
  }

  if (screen === "cart") {
    return (
      <StrapizzamiCart
        brandName={data.brandName}
        items={cart}
        address={data.address}
        onBack={() => setScreen(cart.length > 0 ? "menu" : "home")}
        onIncrement={id => setCart(p => p.map(i => i.id === id ? { ...i, qty: i.qty + 1 } : i))}
        onDecrement={id => setCart(p => p.flatMap(i => {
          if (i.id !== id) return [i];
          if (i.qty <= 1) return [];
          return [{ ...i, qty: i.qty - 1 }];
        }))}
        onRemove={id => setCart(p => p.filter(i => i.id !== id))}
        onEditAddress={() => toast.info("Indirizzo modificabile nella versione completa")}
        onCheckout={() => toast.success("Ordine inviato! Riceverai conferma su WhatsApp.")}
      />
    );
  }

  if (screen === "menu") {
    return (
      <StrapizzamiMenu
        brandName={data.brandName}
        subtitle={data.subtitle}
        cartCount={cartCount}
        categories={categories.filter(c => c !== "Tutte")}
        items={data.items}
        onBack={() => setScreen("home")}
        onCart={() => setScreen("cart")}
        onAdd={(item) => addToCart(item)}
        onItemClick={(item) => { setSelectedItem(item as StrapizzamiSiteData["items"][number]); setScreen("detail"); }}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <StrapizzamiHome
      brandName={data.brandName}
      subtitle={data.subtitle}
      heroImage={data.heroImage}
      heroTagline={data.heroTagline}
      categories={categories}
      items={data.items}
      onAdd={(item) => addToCart(item)}
      onItemClick={(item) => { setSelectedItem(item as StrapizzamiSiteData["items"][number]); setScreen("detail"); }}
      onNavigate={handleNavigate}
    />
  );
}
