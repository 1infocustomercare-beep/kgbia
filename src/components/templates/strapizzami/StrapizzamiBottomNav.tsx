import { Home, BookOpen, ShoppingBag, User, Tag } from "lucide-react";
import { STRAPIZZAMI } from "./theme";

interface Props {
  active: "home" | "menu" | "orders" | "profile" | "offers";
  onChange: (k: "home" | "menu" | "orders" | "profile" | "offers") => void;
  showOffers?: boolean;
}

export function StrapizzamiBottomNav({ active, onChange, showOffers = false }: Props) {
  const items = [
    { key: "home" as const, label: "Home", Icon: Home },
    { key: "menu" as const, label: "Menu", Icon: BookOpen },
    { key: "orders" as const, label: "Ordini", Icon: ShoppingBag },
    { key: "profile" as const, label: "Profilo", Icon: User },
    ...(showOffers ? [{ key: "offers" as const, label: "Offers", Icon: Tag }] : []),
  ];
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-40 px-2 pt-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] border-t backdrop-blur-md"
      style={{ background: `${STRAPIZZAMI.bg}f5`, borderColor: STRAPIZZAMI.divider }}
    >
      <div className="grid" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
        {items.map(({ key, label, Icon }) => {
          const isActive = active === key;
          return (
            <button
              key={key}
              onClick={() => onChange(key)}
              className="flex flex-col items-center gap-1 py-1.5 transition-colors"
              style={{ color: isActive ? STRAPIZZAMI.primary : STRAPIZZAMI.textMuted }}
            >
              <Icon className="w-5 h-5" strokeWidth={isActive ? 2.4 : 1.8} />
              <span
                className="text-[0.65rem] font-bold tracking-wide uppercase"
                style={{ fontFamily: STRAPIZZAMI.fontBody }}
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
