import { Plus, Minus, X, MapPin, Clock, CreditCard } from "lucide-react";
import { BATEY } from "./theme";
import { BateyHeader } from "./BateyHeader";

export interface BateyCartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}

interface Props {
  brandName: string;
  items: BateyCartItem[];
  deliveryFee?: number;
  address: string;
  estimatedTime?: string;
  paymentMethod?: string;
  paymentLast4?: string;
  onBack: () => void;
  onIncrement: (id: string) => void;
  onDecrement: (id: string) => void;
  onRemove: (id: string) => void;
  onEditAddress: () => void;
  onCheckout: () => void;
}

export function BateyCart({
  brandName,
  items,
  deliveryFee = 4,
  address,
  estimatedTime = "30-45 min",
  paymentMethod = "Visa",
  paymentLast4 = "4421",
  onBack, onIncrement, onDecrement, onRemove, onEditAddress, onCheckout,
}: Props) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + deliveryFee;
  const articlesCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="batey-theme min-h-screen pb-32" style={{ background: BATEY.bgDeep }}>
      <BateyHeader
        brandName={brandName}
        onBack={onBack}
        rightSlot={
          <div className="text-right shrink-0">
            <p className="text-[0.7rem] font-medium leading-tight tracking-[0.12em] uppercase" style={{ color: BATEY.text }}>
              Il Carrello
            </p>
            <p className="text-[0.62rem] italic" style={{ color: BATEY.primary, fontFamily: BATEY.fontEs, letterSpacing: "0.18em" }}>
              {articlesCount} piatti
            </p>
          </div>
        }
      />

      {/* Riepilogo Ordine */}
      <section className="px-4 mt-4">
        <div className="text-center mb-4">
          <p className="text-[11px] tracking-[0.42em] mb-1 italic" style={{ color: BATEY.primary, fontFamily: BATEY.fontEs }}>
            tu pedido
          </p>
          <h2 className="text-xl font-serif-bt" style={{ color: BATEY.text, fontFamily: BATEY.fontHead, letterSpacing: "0.18em" }}>
            ORDER SUMMARY
          </h2>
          <div className="w-8 h-px mx-auto mt-2" style={{ background: BATEY.primary }} />
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <article
              key={item.id}
              className="rounded-2xl p-3 flex gap-3 relative"
              style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
            >
              <span
                className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-serif-bt"
                style={{ background: BATEY.primary, color: BATEY.bg, fontFamily: BATEY.fontHead }}
              >
                {idx + 1}
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium leading-tight flex-1 font-serif-bt" style={{ color: BATEY.text, fontFamily: BATEY.fontHead }}>
                    {item.name}
                  </h3>
                  <span className="text-sm font-serif-bt shrink-0" style={{ color: BATEY.sand, fontFamily: BATEY.fontHead }}>
                    €{item.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-[0.7rem] mt-0.5 line-clamp-1" style={{ color: BATEY.textMuted }}>
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "transparent", color: BATEY.textSoft }}
                    aria-label="Rimuovi"
                  >
                    <X className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDecrement(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: BATEY.bgSoft, color: BATEY.primary }}
                    >
                      <Minus className="w-3 h-3" strokeWidth={2.6} />
                    </button>
                    <span className="text-sm font-serif-bt w-4 text-center" style={{ color: BATEY.text, fontFamily: BATEY.fontHead }}>{item.qty}</span>
                    <button
                      onClick={() => onIncrement(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: BATEY.bgSoft, color: BATEY.primary }}
                    >
                      <Plus className="w-3 h-3" strokeWidth={2.6} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Totals */}
        <div
          className="mt-3 rounded-2xl px-4 py-3 text-right space-y-1"
          style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
        >
          <p className="text-sm" style={{ color: BATEY.textMuted }}>
            Subtotale: <span className="font-medium" style={{ color: BATEY.text }}>€{subtotal.toFixed(2).replace(".", ",")}</span>
          </p>
          <p className="text-sm" style={{ color: BATEY.textMuted }}>
            Consegna: <span className="font-medium" style={{ color: BATEY.text }}>€{deliveryFee.toFixed(2).replace(".", ",")}</span>
          </p>
          <div className="pt-1" style={{ borderTop: `1px solid ${BATEY.divider}` }}>
            <p className="text-base font-serif-bt mt-1" style={{ color: BATEY.sand, fontFamily: BATEY.fontHead, letterSpacing: "0.08em" }}>
              TOTALE: €{total.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>
      </section>

      {/* Indirizzo */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[0.7rem] tracking-[0.2em] uppercase font-medium" style={{ color: BATEY.text }}>
            Indirizzo di Consegna
          </h3>
          <button
            onClick={onEditAddress}
            className="text-xs underline"
            style={{ color: BATEY.primary }}
          >
            Modifica
          </button>
        </div>
        <div
          className="flex items-start gap-2 rounded-2xl px-4 py-3"
          style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
        >
          <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: BATEY.primary }} />
          <p className="text-sm whitespace-pre-line" style={{ color: BATEY.text }}>{address}</p>
        </div>
        <div
          className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
        >
          <Clock className="w-4 h-4" style={{ color: BATEY.primary }} />
          <span style={{ color: BATEY.textMuted }}>
            Consegna stimata: <span className="font-medium" style={{ color: BATEY.text }}>{estimatedTime}</span>
          </span>
        </div>
      </section>

      {/* Metodo di pagamento */}
      <section className="px-4 mt-5">
        <h3 className="text-[0.7rem] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: BATEY.text }}>
          Metodo di Pagamento
        </h3>
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: BATEY.bgPanel, border: `1px solid ${BATEY.border}` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-5 rounded bg-gradient-to-r from-blue-600 to-cyan-500" />
            <span className="text-sm" style={{ color: BATEY.text }}>{paymentMethod} (**** {paymentLast4})</span>
          </div>
          <CreditCard className="w-5 h-5" style={{ color: BATEY.primary }} />
        </div>
      </section>

      {/* Sticky CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]"
        style={{ background: `${BATEY.bgDeep}f0`, borderTop: `1px solid ${BATEY.divider}`, backdropFilter: "blur(20px)" }}
      >
        <button
          onClick={onCheckout}
          className="w-full py-4 rounded-full flex flex-col items-center justify-center"
          style={{ background: BATEY.primary, color: BATEY.bg, fontFamily: BATEY.fontBody }}
        >
          <span className="text-sm font-medium uppercase tracking-[0.32em]">ORDINA ORA</span>
          <span className="text-[0.7rem] opacity-90 mt-0.5">€{total.toFixed(2).replace(".", ",")}</span>
        </button>
      </div>
    </div>
  );
}
