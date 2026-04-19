import { useState, useMemo } from "react";
import { toast } from "sonner";
import { PaperfishHome, type PaperfishMenuItem } from "./PaperfishHome";
import { PaperfishMenu } from "./PaperfishMenu";
import { PaperfishDetail, type PaperfishExtra } from "./PaperfishDetail";
import { PaperfishCart, type PaperfishCartItem } from "./PaperfishCart";

export interface PaperfishSiteData {
  brandName: string;
  subtitle?: string;
  heroImage: string;
  heroTagline?: string;
  address: string;
  items: (PaperfishMenuItem & { extras?: PaperfishExtra[]; ingredients?: string })[];
}

export type PaperfishScreen = "home" | "menu" | "detail" | "cart";

const DEFAULT_EXTRAS: PaperfishExtra[] = [
  { id: "wasabi-extra", label: "Wasabi extra", price: 1 },
  { id: "salsa-soia", label: "Salsa di soia premium", price: 1.5 },
  { id: "zenzero", label: "Zenzero marinato", price: 1 },
];

export function PaperfishSite({
  data,
  controlledScreen,
  onScreenChange,
}: {
  data: PaperfishSiteData;
  controlledScreen?: PaperfishScreen;
  onScreenChange?: (s: PaperfishScreen) => void;
}) {
  const [internalScreen, setInternalScreen] = useState<PaperfishScreen>("home");
  const screen = controlledScreen ?? internalScreen;
  const setScreen = (s: PaperfishScreen) => {
    if (controlledScreen === undefined) setInternalScreen(s);
    onScreenChange?.(s);
  };
  const [selectedItem, setSelectedItem] = useState<PaperfishSiteData["items"][number] | null>(null);
  const [cart, setCart] = useState<PaperfishCartItem[]>([]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["Tutte"]);
    data.items.forEach(i => cats.add(i.category));
    return Array.from(cats);
  }, [data.items]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (item: PaperfishMenuItem, qty = 1) => {
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
      <PaperfishDetail
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
      <PaperfishCart
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
      <PaperfishMenu
        brandName={data.brandName}
        subtitle={data.subtitle}
        cartCount={cartCount}
        categories={categories.filter(c => c !== "Tutte")}
        items={data.items}
        onBack={() => setScreen("home")}
        onCart={() => setScreen("cart")}
        onAdd={(item) => addToCart(item)}
        onItemClick={(item) => { setSelectedItem(item as PaperfishSiteData["items"][number]); setScreen("detail"); }}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <PaperfishHome
      brandName={data.brandName}
      subtitle={data.subtitle}
      heroImage={data.heroImage}
      heroTagline={data.heroTagline}
      categories={categories}
      items={data.items}
      onAdd={(item) => addToCart(item)}
      onItemClick={(item) => { setSelectedItem(item as PaperfishSiteData["items"][number]); setScreen("detail"); }}
      onNavigate={handleNavigate}
    />
  );
}
