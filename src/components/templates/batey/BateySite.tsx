import { useState, useMemo, useEffect } from "react";
import { toast } from "sonner";
import { BateyHome, type BateyMenuItem } from "./BateyHome";
import { BateyMenu } from "./BateyMenu";
import { BateyDetail, type BateyExtra } from "./BateyDetail";
import { BateyCart, type BateyCartItem } from "./BateyCart";
import { bateyCss } from "./theme";

export interface BateySiteData {
  brandName: string;
  subtitle?: string;
  heroImage: string;
  heroTagline?: string;
  address: string;
  items: (BateyMenuItem & { extras?: BateyExtra[]; ingredients?: string })[];
}

type Screen = "home" | "menu" | "detail" | "cart";

const DEFAULT_EXTRAS: BateyExtra[] = [
  { id: "limone", label: "Limone biologico", price: 0.5 },
  { id: "salsa-verde", label: "Salsa verde caraibica", price: 1.5 },
  { id: "pane-cafone", label: "Pane cafone caldo", price: 1 },
];

export function BateySite({ data }: { data: BateySiteData }) {
  // Inject theme CSS once
  useEffect(() => {
    const id = "batey-theme-style";
    if (!document.getElementById(id)) {
      const style = document.createElement("style");
      style.id = id;
      style.innerHTML = bateyCss;
      document.head.appendChild(style);
    }
  }, []);

  const [screen, setScreen] = useState<Screen>("home");
  const [selectedItem, setSelectedItem] = useState<BateySiteData["items"][number] | null>(null);
  const [cart, setCart] = useState<BateyCartItem[]>([]);

  const categories = useMemo(() => {
    const cats = new Set<string>(["Tutte"]);
    data.items.forEach(i => cats.add(i.category));
    return Array.from(cats);
  }, [data.items]);

  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const addToCart = (item: BateyMenuItem, qty = 1) => {
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
      <BateyDetail
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
      <BateyCart
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
      <BateyMenu
        brandName={data.brandName}
        subtitle={data.subtitle}
        cartCount={cartCount}
        categories={categories.filter(c => c !== "Tutte")}
        items={data.items}
        onBack={() => setScreen("home")}
        onCart={() => setScreen("cart")}
        onAdd={(item) => addToCart(item)}
        onItemClick={(item) => { setSelectedItem(item as BateySiteData["items"][number]); setScreen("detail"); }}
        onNavigate={handleNavigate}
      />
    );
  }

  return (
    <BateyHome
      brandName={data.brandName}
      subtitle={data.subtitle}
      heroImage={data.heroImage}
      heroTagline={data.heroTagline}
      categories={categories}
      items={data.items}
      onAdd={(item) => addToCart(item)}
      onItemClick={(item) => { setSelectedItem(item as BateySiteData["items"][number]); setScreen("detail"); }}
      onNavigate={handleNavigate}
    />
  );
}
