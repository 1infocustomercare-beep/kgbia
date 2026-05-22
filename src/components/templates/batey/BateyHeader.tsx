import { ChevronLeft, ShoppingCart } from "lucide-react";
import { BATEY } from "./theme";

interface Props {
  brandName: string;
  subtitle?: string;
  cartCount?: number;
  onBack?: () => void;
  onCart?: () => void;
  rightSlot?: React.ReactNode;
}

export function BateyHeader({ brandName, subtitle, cartCount, onBack, onCart, rightSlot }: Props) {
  return (
    <header
      className="sticky top-0 z-30 px-4 pt-[max(env(safe-area-inset-top),1rem)] pb-3 border-b"
      style={{ background: `${BATEY.bg}f0`, borderColor: BATEY.border, backdropFilter: "blur(20px)" }}
    >
      <div className="flex items-center justify-between gap-3">
        {onBack ? (
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-full flex items-center justify-center shrink-0"
            style={{ background: BATEY.bgSoft, color: BATEY.primary, border: `1px solid ${BATEY.divider}` }}
            aria-label="Indietro"
          >
            <ChevronLeft className="w-5 h-5" strokeWidth={2.2} />
          </button>
        ) : (
          <div className="w-9 h-9 shrink-0" />
        )}

        <div className="flex-1 flex flex-col items-center min-w-0">
          <h1
            className="text-base sm:text-lg font-serif-bt truncate"
            style={{ color: BATEY.text, fontFamily: BATEY.fontHead, letterSpacing: "0.20em" }}
          >
            {brandName.toUpperCase()}
          </h1>
          {subtitle && (
            <p
              className="text-[0.62rem] mt-0.5 truncate font-es-bt"
              style={{ color: BATEY.primary, fontFamily: BATEY.fontEs, letterSpacing: "0.28em" }}
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
            style={{ background: BATEY.bgSoft, color: BATEY.primary, border: `1px solid ${BATEY.divider}` }}
            aria-label="Carrello"
          >
            <ShoppingCart className="w-4 h-4" strokeWidth={2} />
            {cartCount && cartCount > 0 ? (
              <span
                className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center text-[11px] font-bold"
                style={{ background: BATEY.coral, color: BATEY.bg }}
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
