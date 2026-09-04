/**
 * CaseScreenLightbox — visualizzatore fullscreen per le schermate dei case study
 * di settore (/portfolio/:sectorId).
 *
 * Comportamento allineato ai case study di riferimento:
 *  - click su una schermata → apertura a tutto schermo
 *  - frecce ‹ › per scorrere TUTTE le schermate della pagina (mobile + desktop)
 *  - contatore "n / totale" + "clicca in qualsiasi punto per chiudere"
 *  - tastiera: ← → per navigare, Esc per chiudere
 *
 * Additivo: nessun componente esistente viene modificato.
 */
import { useCallback, useEffect } from "react";
import { createPortal } from "react-dom";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import IPhoneProMaxFrame from "@/components/mockups/IPhoneProMaxFrame";
import DesktopBrowserFrame from "@/components/mockups/DesktopBrowserFrame";

export type CaseScreenItem = {
  image: string;
  label: string;
  brand: string;
  style: string;
  kind: "mobile" | "desktop";
};

type Props = {
  items: CaseScreenItem[];
  index: number | null;
  accent: string;
  onClose: () => void;
  onIndexChange: (next: number) => void;
};

export default function CaseScreenLightbox({ items, index, accent, onClose, onIndexChange }: Props) {
  const open = index !== null && index >= 0 && index < items.length;

  const step = useCallback(
    (delta: number) => {
      if (index === null || items.length === 0) return;
      onIndexChange((index + delta + items.length) % items.length);
    },
    [index, items.length, onIndexChange],
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, onClose, step]);

  if (!open) return null;
  const item = items[index as number];

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${item.brand} — ${item.label}`}
      onClick={onClose}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center px-4 py-6"
      style={{
        background: "radial-gradient(120% 90% at 50% 0%, hsl(var(--acc) / 0.16), transparent 60%), hsl(220 40% 4% / 0.94)",
        backdropFilter: "blur(18px)",
        ["--acc" as string]: accent,
      }}
    >
      {/* chiudi */}
      <button
        type="button"
        onClick={onClose}
        aria-label="Chiudi"
        className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full border transition hover:scale-105"
        style={{
          borderColor: "hsl(var(--acc) / 0.4)",
          background: "hsl(220 40% 8% / 0.8)",
          color: "hsl(var(--acc))",
        }}
      >
        <X size={18} />
      </button>

      {/* frecce */}
      {items.length > 1 && (
        <>
          <button
            type="button"
            aria-label="Schermata precedente"
            onClick={(e) => {
              e.stopPropagation();
              step(-1);
            }}
            className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border transition hover:scale-105 sm:left-8"
            style={{
              borderColor: "hsl(var(--acc) / 0.35)",
              background: "hsl(220 40% 8% / 0.78)",
              color: "hsl(var(--acc))",
            }}
          >
            <ChevronLeft size={22} />
          </button>
          <button
            type="button"
            aria-label="Schermata successiva"
            onClick={(e) => {
              e.stopPropagation();
              step(1);
            }}
            className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full border transition hover:scale-105 sm:right-8"
            style={{
              borderColor: "hsl(var(--acc) / 0.35)",
              background: "hsl(220 40% 8% / 0.78)",
              color: "hsl(var(--acc))",
            }}
          >
            <ChevronRight size={22} />
          </button>
        </>
      )}

      {/* contenuto */}
      <div
        className="flex min-h-0 w-full flex-1 items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.kind === "desktop" ? (
          <DesktopBrowserFrame
            src={item.image}
            alt={`${item.brand} — ${item.label}`}
            label={`${item.brand.toLowerCase().replace(/[^a-z0-9]+/g, "-")}.empire-ia.app`}
            native
            className="w-full max-w-[1100px]"
          />
        ) : (
          <IPhoneProMaxFrame
            src={item.image}
            alt={`${item.brand} — ${item.label}`}
            width={360}
            loading="eager"
            glow
            style={{
              width: "min(84vw, 34vh, 340px)",
              height: "auto",
              aspectRatio: "9 / 19.5",
            }}
          />
        )}
      </div>

      {/* didascalia */}
      <div className="mt-5 shrink-0 text-center" onClick={(e) => e.stopPropagation()}>
        <p className="text-sm font-semibold" style={{ color: "hsl(0 0% 100% / 0.94)" }}>
          {item.brand} · {item.label}
        </p>
        <p className="mt-1 text-[11px] uppercase tracking-[0.24em]" style={{ color: "hsl(var(--acc))" }}>
          {item.style} · {item.kind === "desktop" ? "Desktop" : "iPhone Pro Max"}
        </p>
        <p className="mt-2 text-[11px]" style={{ color: "hsl(0 0% 100% / 0.5)" }}>
          {(index as number) + 1} / {items.length} · clicca in qualsiasi punto per chiudere
        </p>
      </div>
    </div>,
    document.body,
  );
}
