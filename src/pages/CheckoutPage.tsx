import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Phone, User, MessageSquare, CreditCard, Check, Smartphone } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useNavigate, useParams } from "react-router-dom";

type OrderType = "delivery" | "takeaway" | "table";
type PaymentMethod = "card" | "apple" | "google";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [orderType, setOrderType] = useState<OrderType>("delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tableNumber, setTableNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [submitted, setSubmitted] = useState(false);

  if (items.length === 0 && !submitted) {
    navigate(`/r/${slug}`, { replace: true });
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6">
        <motion.div
          className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center mb-6"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", damping: 15 }}
        >
          <Check className="w-10 h-10 text-primary" />
        </motion.div>
        <motion.h1
          className="text-2xl font-display font-bold text-foreground text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          Ordine Confermato!
        </motion.h1>
        <motion.p
          className="mt-2 text-muted-foreground text-center text-sm max-w-xs"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          Riceverai una notifica quando il tuo ordine sarà pronto. Tempo stimato: ~25 min.
        </motion.p>
        <motion.button
          onClick={() => navigate(`/r/${slug}`)}
          className="mt-8 px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-semibold gold-glow"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileTap={{ scale: 0.97 }}
        >
          Torna al menu
        </motion.button>
      </div>
    );
  }

  const deliveryFee = orderType === "delivery" ? 3.5 : 0;
  const grandTotal = total + deliveryFee;

  const handleSubmit = () => {
    clearCart();
    setSubmitted(true);
  };

  const orderTypes: { value: OrderType; label: string; icon: React.ReactNode }[] = [
    { value: "delivery", label: "Consegna", icon: <MapPin className="w-4 h-4" /> },
    { value: "takeaway", label: "Asporto", icon: <Clock className="w-4 h-4" /> },
    { value: "table", label: "Tavolo", icon: <CreditCard className="w-4 h-4" /> },
  ];

  const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: "card", label: "Carta", icon: <CreditCard className="w-4 h-4" /> },
    { value: "apple", label: "Apple Pay", icon: <Smartphone className="w-4 h-4" /> },
    { value: "google", label: "Google Pay", icon: <Smartphone className="w-4 h-4" /> },
  ];

  const isValid = name.trim() && phone.trim() && (
    orderType !== "delivery" || address.trim()
  ) && (
    orderType !== "table" || tableNumber.trim()
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 sticky top-0 z-10 glass-strong">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center"
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground">Checkout</h1>
        <span className="ml-auto text-sm text-muted-foreground">{items.length} articoli</span>
      </div>

      <div className="px-5 pb-36 space-y-6">
        {/* Order type */}
        <div>
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">Tipo ordine</p>
          <div className="grid grid-cols-3 gap-2">
            {orderTypes.map((t) => (
              <motion.button
                key={t.value}
                onClick={() => setOrderType(t.value)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-sm font-medium transition-colors ${
                  orderType === t.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {t.icon}
                {t.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Customer info */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">I tuoi dati</p>
          <div className="relative">
            <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Nome e cognome"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              placeholder="Telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <AnimatePresence>
            {orderType === "delivery" && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Indirizzo di consegna"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {orderType === "table" && (
              <motion.div
                className="relative"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <CreditCard className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  type="number"
                  placeholder="Numero tavolo"
                  value={tableNumber}
                  onChange={(e) => setTableNumber(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div className="relative">
            <MessageSquare className="absolute left-3.5 top-3.5 w-4 h-4 text-muted-foreground" />
            <textarea
              placeholder="Note aggiuntive..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-sm placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Payment method */}
        <div>
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider mb-3">Metodo di pagamento</p>
          <div className="grid grid-cols-3 gap-2">
            {paymentMethods.map((p) => (
              <motion.button
                key={p.value}
                onClick={() => setPaymentMethod(p.value)}
                className={`flex flex-col items-center gap-1.5 py-3 rounded-xl text-xs font-medium transition-colors ${
                  paymentMethod === p.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground"
                }`}
                whileTap={{ scale: 0.95 }}
              >
                {p.icon}
                {p.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Order summary */}
        <div className="space-y-3">
          <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Riepilogo</p>
          <div className="rounded-2xl bg-secondary/50 p-4 space-y-3">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-sm">
                <span className="text-foreground">
                  {item.quantity}× {item.name}
                </span>
                <span className="text-muted-foreground font-medium">
                  €{(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-3 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Subtotale</span>
                <span className="text-foreground">€{total.toFixed(2)}</span>
              </div>
              {orderType === "delivery" && (
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Consegna</span>
                  <span className="text-foreground">€{deliveryFee.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-base font-bold pt-1">
                <span className="text-foreground">Totale</span>
                <span className="text-primary font-display text-xl">€{grandTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Fixed footer */}
      <div className="fixed bottom-0 inset-x-0 p-5 bg-card/95 backdrop-blur-lg border-t border-border safe-bottom">
        <motion.button
          onClick={handleSubmit}
          disabled={!isValid}
          className="w-full py-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-lg gold-glow disabled:opacity-40 disabled:shadow-none"
          whileHover={isValid ? { scale: 1.02 } : {}}
          whileTap={isValid ? { scale: 0.97 } : {}}
        >
          {paymentMethod === "apple" ? " Pay" : 
           paymentMethod === "google" ? "Google Pay" : 
           "Conferma Ordine"} · €{grandTotal.toFixed(2)}
        </motion.button>
      </div>
    </div>
  );
};

export default CheckoutPage;
