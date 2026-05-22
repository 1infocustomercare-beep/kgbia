import { Plus, Minus, X, MapPin, Clock, CreditCard } from "lucide-react";
import { STRAPIZZAMI } from "./theme";
import { StrapizzamiHeader } from "./StrapizzamiHeader";

export interface StrapizzamiCartItem {
  id: string;
  name: string;
  description: string;
  price: number;
  qty: number;
  image: string;
}

interface Props {
  brandName: string;
  items: StrapizzamiCartItem[];
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

export function StrapizzamiCart({
  brandName,
  items,
  deliveryFee = 3,
  address,
  estimatedTime = "30-45 min",
  paymentMethod = "Mastercard",
  paymentLast4 = "5132",
  onBack, onIncrement, onDecrement, onRemove, onEditAddress, onCheckout,
}: Props) {
  const subtotal = items.reduce((s, i) => s + i.price * i.qty, 0);
  const total = subtotal + deliveryFee;
  const articlesCount = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div className="strapizzami-theme min-h-screen pb-32" style={{ background: STRAPIZZAMI.bgDeep }}>
      <StrapizzamiHeader
        brandName={brandName}
        onBack={onBack}
        rightSlot={
          <div className="text-right shrink-0">
            <p className="text-sm font-bold leading-tight" style={{ color: STRAPIZZAMI.text }}>Il tuo Carrello</p>
            <p className="text-[0.7rem]" style={{ color: STRAPIZZAMI.textMuted }}>{articlesCount} Articoli</p>
          </div>
        }
      />

      {/* Riepilogo Ordine */}
      <section className="px-4 mt-4">
        <h2 className="text-xl font-bold mb-3" style={{ color: STRAPIZZAMI.text }}>Riepilogo Ordine</h2>
        <div className="space-y-3">
          {items.map((item, idx) => (
            <article
              key={item.id}
              className="rounded-2xl p-3 flex gap-3 relative shadow-sm"
              style={{ background: STRAPIZZAMI.card }}
            >
              {/* Numero ordine */}
              <span
                className="absolute -top-1 -left-1 w-6 h-6 rounded-full flex items-center justify-center text-[0.7rem] font-bold shadow-md"
                style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card }}
              >
                {idx + 1}
              </span>
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              </div>
              <div className="flex-1 flex flex-col min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-sm font-bold leading-tight flex-1" style={{ color: STRAPIZZAMI.text }}>
                    {item.name}
                  </h3>
                  <span className="text-sm font-bold shrink-0" style={{ color: STRAPIZZAMI.text }}>
                    €{item.price.toFixed(2).replace(".", ",")}
                  </span>
                </div>
                <p className="text-[0.7rem] mt-0.5 line-clamp-1" style={{ color: STRAPIZZAMI.textMuted }}>
                  {item.description}
                </p>
                <div className="mt-auto flex items-center justify-between pt-2">
                  <button
                    onClick={() => onRemove(item.id)}
                    className="w-7 h-7 rounded-full flex items-center justify-center"
                    style={{ background: "transparent", color: STRAPIZZAMI.primary }}
                    aria-label="Rimuovi"
                  >
                    <X className="w-4 h-4" strokeWidth={2.4} />
                  </button>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onDecrement(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: STRAPIZZAMI.cardSoft, color: STRAPIZZAMI.primary }}
                    >
                      <Minus className="w-3 h-3" strokeWidth={3} />
                    </button>
                    <span className="text-sm font-bold w-4 text-center" style={{ color: STRAPIZZAMI.text }}>{item.qty}</span>
                    <button
                      onClick={() => onIncrement(item.id)}
                      className="w-7 h-7 rounded-full flex items-center justify-center"
                      style={{ background: STRAPIZZAMI.cardSoft, color: STRAPIZZAMI.primary }}
                    >
                      <Plus className="w-3 h-3" strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Totals */}
        <div
          className="mt-3 rounded-2xl px-4 py-3 text-right"
          style={{ background: STRAPIZZAMI.card, borderTop: `1px solid ${STRAPIZZAMI.divider}` }}
        >
          <p className="text-sm" style={{ color: STRAPIZZAMI.text }}>
            Subtotale: <span className="font-bold">€{subtotal.toFixed(2).replace(".", ",")}</span>
          </p>
          <p className="text-sm mb-2" style={{ color: STRAPIZZAMI.text }}>
            Consegna: <span className="font-bold">€{deliveryFee.toFixed(2).replace(".", ",")}</span>
          </p>
          <p className="text-base font-bold" style={{ color: STRAPIZZAMI.text }}>
            TOTALE: €{total.toFixed(2).replace(".", ",")}
          </p>
        </div>
      </section>

      {/* Indirizzo */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold" style={{ color: STRAPIZZAMI.text }}>Indirizzo di Consegna</h3>
          <button
            onClick={onEditAddress}
            className="text-sm underline font-bold"
            style={{ color: STRAPIZZAMI.primary }}
          >
            Modifica
          </button>
        </div>
        <div
          className="flex items-start gap-2 rounded-2xl px-4 py-3"
          style={{ background: STRAPIZZAMI.card }}
        >
          <MapPin className="w-5 h-5 shrink-0 mt-0.5" style={{ color: STRAPIZZAMI.primary }} />
          <p className="text-sm whitespace-pre-line" style={{ color: STRAPIZZAMI.text }}>{address}</p>
        </div>
        <div
          className="mt-2 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
          style={{ background: STRAPIZZAMI.card }}
        >
          <Clock className="w-4 h-4" style={{ color: STRAPIZZAMI.primary }} />
          <span style={{ color: STRAPIZZAMI.text }}>
            Consegna Stimata: <span className="font-bold">{estimatedTime}</span>
          </span>
        </div>
      </section>

      {/* Metodo di pagamento */}
      <section className="px-4 mt-5">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold" style={{ color: STRAPIZZAMI.text }}>Metodo di Pagamento</h3>
          <div className="flex items-center gap-1">
            {["VISA", "MC", "PP"].map(badge => (
              <div key={badge} className="px-2 py-1 rounded-md text-[11px] font-bold bg-white border" style={{ color: "#1a1f71", borderColor: "#ddd" }}>
                {badge}
              </div>
            ))}
          </div>
        </div>
        <div
          className="flex items-center justify-between rounded-2xl px-4 py-3"
          style={{ background: STRAPIZZAMI.card }}
        >
          <div className="flex items-center gap-3">
            <div className="w-7 h-5 rounded bg-gradient-to-r from-orange-500 to-red-600" />
            <span className="text-sm" style={{ color: STRAPIZZAMI.text }}>{paymentMethod} (**** {paymentLast4})</span>
          </div>
          <CreditCard className="w-5 h-5" style={{ color: STRAPIZZAMI.primary }} />
        </div>
      </section>

      {/* Sticky CTA */}
      <div
        className="fixed inset-x-0 bottom-0 z-40 px-4 pt-2 pb-[max(env(safe-area-inset-bottom),1rem)]"
        style={{ background: `${STRAPIZZAMI.bgDeep}f5`, borderTop: `1px solid ${STRAPIZZAMI.divider}`, backdropFilter: "blur(16px)" }}
      >
        <button
          onClick={onCheckout}
          className="w-full py-4 rounded-full text-base font-bold flex flex-col items-center justify-center shadow-lg"
          style={{ background: STRAPIZZAMI.primary, color: STRAPIZZAMI.card, fontFamily: STRAPIZZAMI.fontBody }}
        >
          ORDINA ORA
          <span className="text-[0.75rem] font-normal opacity-90">€{total.toFixed(2).replace(".", ",")}</span>
        </button>
      </div>
    </div>
  );
}
