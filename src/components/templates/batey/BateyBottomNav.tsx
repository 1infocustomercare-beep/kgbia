import { Home, BookOpen, ShoppingBag, User, Tag } from "lucide-react";
import { BATEY } from "./theme";

interface Props {
  active: "home" | "menu" | "orders" | "profile" | "offers";
  onChange: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
  showOffers?: boolean;
}

export function BateyBottomNav({ active, onChange, showOffers = false }: Props) {
  const items = [
    { key: "home" as const, label: "Home", Icon: Home },
    { key: "menu" as const, label: "Menu", Icon: BookOpen },
    { key: "orders" as const, label: "Ordini", Icon: ShoppingBag },
    { key: "profile" as const, label: "Profilo", Icon: User },
    ...(showOffers ? [{ key: "offers" as const, label: "Offerte", Icon: Tag }] : []),
  ];
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] border-t backdrop-blur-md"
      style={{ background: `${BATEY.bgDeep}f0`, borderColor: BATEY.divider }}
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center gap-1 py-1.5 transition-colors"
              style={{ color: isActive ? BATEY.primary : BATEY.textSoft }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.6} />
              <span
                className="text-[11px] tracking-[0.18em] uppercase"
                style={{ fontFamily: BATEY.fontBody, fontWeight: isActive ? 600 : 400 }}
              >
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
