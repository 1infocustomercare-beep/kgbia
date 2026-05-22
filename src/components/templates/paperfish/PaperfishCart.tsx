import { Plus, Minus, X, MapPin, Clock, CreditCard } from "lucide-react";
import { PAPERFISH } from "./theme";
import { PaperfishHeader } from "./PaperfishHeader";

export interface PaperfishCartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}

interface Props {
  brandName: string;
  items: PaperfishCartItem[];
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

export function PaperfishCart({
  brandName,
  items,
  deliveryFee = 4,
  address,
  estimatedTime = "35-50 min",
  paymentMethod = "Mastercard",
  paymentLast4 = "5132",
  onBack, onIncrement, onDecrement, onRemove, onEditAddress, onCheckout,
}: Props) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + deliveryFee;
  const articlesCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="paperfish-theme min-h-screen pb-32" style={{ background: PAPERFISH.bgDeep }}>
      <PaperfishHeader
        brandName={brandName}
        onBack={onBack}
        rightSlot={
          <div className="text-right shrink-0">
            <p className="text-[0.7rem] font-medium leading-tight tracking-[0.12em] uppercase" style={{ color: PAPERFISH.text }}>
              Il Carrello
            </p>
            <p className="text-[0.62rem]" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp, letterSpacing: "0.18em" }}>
              {articlesCount} 品
            </p>
          </div>
        }
      />

      {/* Riepilogo Ordine */}
      <section className="px-4 mt-4">
        <div className="text-center mb-4">
          <p className="text-[11px] tracking-[0.42em] mb-1" style={{ color: PAPERFISH.primary, fontFamily: PAPERFISH.fontJp }}>
            注文の概要
          </p>
          <h2 className="text-xl font-serif-pf" style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.18em" }}>
            ORDER SUMMARY
          </h2>
          <div className="w-8 h-px mx-auto mt-2" style={{ background: PAPERFISH.primary }} />
        </div>

        <div className="space-y-3">
          {items.map((item, idx) => (
            <article
              key={item.id}
              className="rounded-2xl p-3 flex gap-3 relative"
              style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
            >
              <span
                className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-serif-pf"
                style={{ background: PAPERFISH.primary, color: PAPERFISH.bg, fontFamily: PAPERFISH.fontHead }}
              >
                {idx + 1}
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-medium leading-tight flex-1 font-serif-pf" style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead }}>
                    {item.name}
                  </h3>
                  <span className="text-sm font-serif-pf shrink-0" style={{ color: PAPERFISH.gold, fontFamily: PAPERFISH.fontHead }}>
                    €{item.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-[0.7rem] mt-0.5 line-clamp-1" style={{ color: PAPERFISH.textMuted }}>
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "transparent", color: PAPERFISH.textSoft }}
                    aria-label="Rimuovi"
                  >
                    <X className="w-4 h-4" strokeWidth={2.2} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDecrement(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: PAPERFISH.bgSoft, color: PAPERFISH.primary }}
                    >
                      <Minus className="w-3 h-3" strokeWidth={2.6} />
                    </button>
                    <span className="text-sm font-serif-pf w-4 text-center" style={{ color: PAPERFISH.text, fontFamily: PAPERFISH.fontHead }}>{item.qty}</span>
                    <button
                      onClick={() => onIncrement(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: PAPERFISH.bgSoft, color: PAPERFISH.primary }}
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
          style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
        >
          <p className="text-sm" style={{ color: PAPERFISH.textMuted }}>
            Subtotale: <span className="font-medium" style={{ color: PAPERFISH.text }}>€{subtotal.toFixed(2).replace(".", ",")}</span>
          </p>
          <p className="text-sm" style={{ color: PAPERFISH.textMuted }}>
            Consegna: <span className="font-medium" style={{ color: PAPERFISH.text }}>€{deliveryFee.toFixed(2).replace(".", ",")}</span>
          </p>
          <div className="pt-1" style={{ borderTop: `1px solid ${PAPERFISH.divider}` }}>
            <p className="text-base font-serif-pf mt-1" style={{ color: PAPERFISH.gold, fontFamily: PAPERFISH.fontHead, letterSpacing: "0.08em" }}>
              TOTALE: €{total.toFixed(2).replace(".", ",")}
            </p>
          </div>
        </div>
      </section>

      {/* Indirizzo */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-[0.7rem] tracking-[0.2em] uppercase font-medium" style={{ color: PAPERFISH.text }}>
            Indirizzo di Consegna
          </h3>
          <button
            onClick={onEditAddress}
            className="text-xs underline"
            style={{ color: PAPERFISH.primary }}
          >
            Modifica
          </button>
        </div>
        <div
          className="flex items-start gap-2 rounded-2xl px-4 py-3"
          style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
        >
          <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: PAPERFISH.primary }} />
          <p className="text-sm whitespace-pre-line" style={{ color: PAPERFISH.text }}>{address}</p>
        </div>
        <div
          className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
        >
          <Clock className="w-4 h-4" style={{ color: PAPERFISH.primary }} />
          <span style={{ color: PAPERFISH.textMuted }}>
            Consegna stimata: <span className="font-medium" style={{ color: PAPERFISH.text }}>{estimatedTime}</span>
          </span>
        </div>
      </section>

      {/* Metodo di pagamento */}
      <section className="px-4 mt-5">
        <h3 className="text-[0.7rem] tracking-[0.2em] uppercase font-medium mb-2" style={{ color: PAPERFISH.text }}>
          Metodo di Pagamento
        </h3>
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: PAPERFISH.bgPanel, border: `1px solid ${PAPERFISH.border}` }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-5 rounded bg-gradient-to-r from-orange-500 to-red-600" />
            <span className="text-sm" style={{ color: PAPERFISH.text }}>{paymentMethod} (**** {paymentLast4})</span>
          </div>
          <CreditCard className="w-5 h-5" style={{ color: PAPERFISH.primary }} />
        </div>
      </section>

      {/* Sticky CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]"
        style={{ background: `${PAPERFISH.bgDeep}f0`, borderTop: `1px solid ${PAPERFISH.divider}`, backdropFilter: "blur(20px)" }}
      >
        <button
          onClick={onCheckout}
          className="w-full py-4 rounded-full flex flex-col items-center justify-center"
          style={{ background: PAPERFISH.primary, color: PAPERFISH.bg, fontFamily: PAPERFISH.fontBody }}
        >
          <span className="text-sm font-medium uppercase tracking-[0.32em]">ORDINA ORA</span>
          <span className="text-[0.7rem] opacity-90 mt-0.5">€{total.toFixed(2).replace(".", ",")}</span>
        </button>
      </div>
    </div>
  );
}
