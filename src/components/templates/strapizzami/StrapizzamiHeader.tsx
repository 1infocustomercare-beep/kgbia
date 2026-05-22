import { ChevronLeft, ShoppingCart, Flame } from "lucide-react";
import { STRAPIZZAMI } from "./theme";

interface Props {
  brandName: string;
  subtitle?: string;
  cartCount?: number;
  onBack?: () => void;
  onCart?: () => void;
  rightSlot?: React.ReactNode;
}

export function StrapizzamiHeader({ brandName, subtitle, cartCount, onBack, onCart, rightSlot }: Props) {
  return (
    <header
      className="sticky top-0 z-30 px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3 border-b"
      style={{ background: `${STRAPIZZAMI.bg}f8`, borderColor: STRAPIZZAMI.divider, backdropFilter: "blur(16px)" }}
    >
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card }}
            aria-label="Indietro"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.4} />
          </button>
        ) : (
          <div className="w-9 h-9 shrink-0" />
        )}

        <div className="flex-1 flex flex-col items-center min-w-0">
          <div className="flex items-center gap-2 min-w-0">
            <h1
              className="text-lg sm:text-xl font-serif-strap truncate"
              style={{
                color: STRAPIZZAMI.primary,
                fontFamily: STRAPIZZAMI.fontHead,
                letterSpacing: "0.05em",
              }}
            >
              {brandName.toUpperCase()}
            </h1>
            <Flame className="w-4 h-4 shrink-0" style={{ color: STRAPIZZAMI.primary }} />
          </div>
          {subtitle && (
            <p
              className="text-[0.7rem] mt-0.5 truncate"
              style={{ color: STRAPIZZAMI.textMuted, fontFamily: STRAPIZZAMI.fontBody }}
            >
              {subtitle}
            </p>
          )}
        </div>

        {rightSlot ? (
          rightSlot
        ) : onCart ? (
          <button
            onClick={onCart}
            className="relative w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: "transparent", color: STRAPIZZAMI.primary }}
            aria-label="Carrello"
          >
            <ShoppingCart className="w-5 h-5" strokeWidth={2.2} />
            {cartCount && cartCount > 0 ? (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card }}
              >
                {cartCount}
              </span>
            ) : null}
          </button>
        ) : (
          <div className="w-9 h-9 shrink-0" />
        )}
      </div>
    </header>
  );
}
