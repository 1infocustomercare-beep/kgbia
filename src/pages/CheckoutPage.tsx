import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, Clock, Phone, User, MessageSquare, CreditCard, Check, Smartphone, Shield, AlertTriangle } from "lucide-react";
import { InfoGuide } from "@/components/ui/info-guide";
import { useCart } from "@/context/CartContext";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { useRestaurantBySlug } from "@/hooks/useRestaurantBySlug";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

type OrderType = "delivery" | "takeaway" | "table";
type PaymentMethod = "card" | "apple" | "google";

const CheckoutPage = () => {
  const { items, total, clearCart } = useCart();
  const navigate = useNavigate();
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const tableFromQR = searchParams.get("table");
  const utmSource = searchParams.get("utm_source") || document.referrer || null;
  const { user } = useAuth();
  const { restaurant: dbRestaurant } = useRestaurantBySlug(slug);
  const [orderType, setOrderType] = useState<OrderType>(tableFromQR ? "table" : "delivery");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [tableNumber, setTableNumber] = useState(tableFromQR || "");
  const [notes, setNotes] = useState("");
  const [gdprAccepted, setGdprAccepted] = useState(false);
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  if (items.length === 0 && !submitted) {
    navigate(`/r/${slug}`, { replace: true });
    return null;
  }

  if (submitted) {
    return (
      <div className="min-h-screen cote-luxury flex flex-col items-center justify-center px-6" style={{ background: "hsl(20 10% 4%)" }}>
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

  const handleSubmit = async () => {
    // Check min order amount
    const minOrder = (dbRestaurant as any)?.min_order_amount || 0;
    if (minOrder > 0 && grandTotal < minOrder) {
      toast({ title: "Ordine minimo non raggiunto", description: `L'importo minimo per un ordine è €${minOrder.toFixed(2)}.`, variant: "destructive" });
      return;
    }
    // Check blocked keywords
    const blockedKeywords: string[] = (dbRestaurant as any)?.blocked_keywords || [];
    if (blockedKeywords.length > 0 && notes.trim()) {
      const notesLower = notes.toLowerCase();
      const blocked = blockedKeywords.find(kw => notesLower.includes(kw.toLowerCase()));
      if (blocked) {
        toast({ title: "Nota non consentita", description: `L'ordine contiene contenuto non accettabile. Rimuovi la nota e riprova.`, variant: "destructive" });
        return;
      }
    }
    setLoading(true);
    try {
      // Find restaurant by slug
      const { data: restaurant, error: restError } = await supabase
        .from("restaurants")
        .select("id")
        .eq("slug", slug || "")
        .eq("is_active", true)
        .single();

      if (restError || !restaurant) {
        toast({ title: "Errore", description: "Ristorante non trovato.", variant: "destructive" });
        setLoading(false);
        return;
      }

      // Check blacklist
      if (phone.trim()) {
        const { data: blocked } = await (supabase as any)
          .from("customer_blacklist")
          .select("id")
          .eq("restaurant_id", restaurant.id)
          .eq("customer_phone", phone.trim())
          .eq("is_active", true)
          .maybeSingle();
        if (blocked) {
          toast({ title: "Ordine non consentito", description: "Non è possibile procedere con questo numero di telefono.", variant: "destructive" });
          setLoading(false);
          return;
        }
      }

      const orderItems = items.map(i => ({
        name: i.name,
        price: i.price,
        quantity: i.quantity,
        id: i.id,
      }));

      const { error: orderError } = await supabase
        .from("orders")
        .insert({
          restaurant_id: restaurant.id,
          customer_id: user?.id || null,
          customer_name: name,
          customer_phone: phone,
          customer_address: orderType === "delivery" ? address : null,
          table_number: orderType === "table" ? parseInt(tableNumber) : null,
          order_type: orderType,
          items: orderItems as any,
          total: grandTotal,
          notes: notes || null,
          status: "pending",
          utm_source: utmSource || null,
          referrer: document.referrer || null,
        } as any);

      if (orderError) {
        console.error("Order error:", orderError);
        toast({ title: "Errore", description: "Impossibile inviare l'ordine. Riprova.", variant: "destructive" });
        setLoading(false);
        return;
      }

      clearCart();
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      toast({ title: "Errore", description: "Errore di connessione.", variant: "destructive" });
    }
    setLoading(false);
  };

  const deliveryEnabled = (dbRestaurant as any)?.delivery_enabled ?? true;
  const takeawayEnabled = (dbRestaurant as any)?.takeaway_enabled ?? true;
  const tableOrdersEnabled = (dbRestaurant as any)?.table_orders_enabled ?? true;

  const orderTypes: { value: OrderType; label: string; icon: React.ReactNode }[] = [
    ...(deliveryEnabled ? [{ value: "delivery" as OrderType, label: "Consegna", icon: <MapPin className="w-4 h-4" /> }] : []),
    ...(takeawayEnabled ? [{ value: "takeaway" as OrderType, label: "Asporto", icon: <Clock className="w-4 h-4" /> }] : []),
    ...(tableOrdersEnabled ? [{ value: "table" as OrderType, label: "Tavolo", icon: <CreditCard className="w-4 h-4" /> }] : []),
  ];

  const paymentMethods: { value: PaymentMethod; label: string; icon: React.ReactNode }[] = [
    { value: "card", label: "Carta", icon: <CreditCard className="w-4 h-4" /> },
    { value: "apple", label: "Apple Pay", icon: <Smartphone className="w-4 h-4" /> },
    { value: "google", label: "Google Pay", icon: <Smartphone className="w-4 h-4" /> },
  ];

  const minOrder = (dbRestaurant as any)?.min_order_amount || 0;
  const isValid = name.trim() && phone.trim() && gdprAccepted && !loading && (
    orderType !== "delivery" || address.trim()
  ) && (
    orderType !== "table" || tableNumber.trim()
  ) && (minOrder <= 0 || grandTotal >= minOrder);

  return (
    <div className="min-h-screen cote-luxury" style={{ background: "linear-gradient(180deg, hsl(20 10% 3%), hsl(20 8% 5%))" }}>
      {/* Header */}
      <div className="flex items-center gap-3 px-5 pt-6 pb-4 sticky top-0 z-10 backdrop-blur-2xl" style={{ background: "hsl(20 10% 4% / 0.96)", borderBottom: "1px solid hsla(30, 20%, 25%, 0.2)" }}>
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: "hsl(20 8% 12%)", border: "1px solid hsla(30, 20%, 25%, 0.3)" }}
        >
          <ArrowLeft className="w-5 h-5 text-foreground" />
        </button>
        <h1 className="text-xl font-display font-bold text-foreground tracking-wide">Checkout</h1>
        <span className="ml-auto text-sm text-muted-foreground">{items.length} articoli</span>
      </div>

      <div className="px-5 pb-36 space-y-6">
        {/* Order type */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Tipo ordine</p>
            <InfoGuide
              title="Tipo di Ordine"
              description="Scegli come vuoi ricevere il tuo ordine: a domicilio, da ritirare al locale, o servito direttamente al tavolo."
              steps={[
                "Consegna: ricevi l'ordine al tuo indirizzo (costo aggiuntivo €3.50)",
                "Asporto: ritira al bancone senza costi extra",
                "Tavolo: ordina dal tavolo scansionando il QR code",
              ]}
            />
          </div>
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
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
          <div className="relative">
            <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="tel"
              placeholder="Telefono"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
                  className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
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
              className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary text-foreground text-base placeholder:text-muted-foreground resize-none h-20 focus:outline-none focus:ring-2 focus:ring-primary/30"
            />
          </div>
        </div>

        {/* Payment method */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Metodo di pagamento</p>
            <InfoGuide
              title="Pagamento Sicuro"
              description="Tutti i pagamenti sono processati in modo sicuro tramite Stripe. I tuoi dati non vengono mai memorizzati sul nostro server."
              steps={[
                "Scegli il metodo preferito: carta, Apple Pay o Google Pay",
                "Il pagamento è protetto da crittografia SSL a 256 bit",
                "Riceverai la ricevuta via email dopo il pagamento",
              ]}
            />
          </div>
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
          <div className="flex items-center gap-2">
            <p className="text-xs text-muted-foreground/70 uppercase tracking-wider">Riepilogo</p>
            <InfoGuide
              title="Riepilogo Ordine"
              description="Controlla gli articoli, le quantità e il totale prima di confermare. Il prezzo include IVA."
            />
          </div>
          <div className="rounded-2xl cote-card p-4 space-y-3">
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
            {minOrder > 0 && grandTotal < minOrder && (
              <div className="flex items-center gap-2 p-3 rounded-xl bg-accent/10 border border-accent/20 mt-2">
                <AlertTriangle className="w-4 h-4 text-accent flex-shrink-0" />
                <p className="text-xs text-accent">Ordine minimo: €{minOrder.toFixed(2)} — aggiungi altri articoli</p>
              </div>
            )}
          </div>
        </div>

        {/* GDPR Privacy */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <button
              onClick={() => setGdprAccepted(!gdprAccepted)}
              className={`mt-0.5 w-5 h-5 rounded border-2 flex-shrink-0 flex items-center justify-center transition-colors ${
                gdprAccepted ? "bg-primary border-primary" : "border-muted-foreground/40"
              }`}
            >
              {gdprAccepted && <Check className="w-3 h-3 text-primary-foreground" />}
            </button>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Accetto la{" "}
              <button onClick={() => setShowPrivacy(!showPrivacy)} className="text-primary underline">
                Privacy Policy e Cookie Policy
              </button>{" "}
              del ristorante. I miei dati saranno trattati ai sensi del GDPR (Reg. UE 2016/679) esclusivamente per 
              l'evasione dell'ordine.
            </p>
          </div>
          <AnimatePresence>
            {showPrivacy && (
              <motion.div
                className="p-4 rounded-xl bg-secondary/50 text-xs text-muted-foreground space-y-2 max-h-48 overflow-y-auto"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <p className="font-semibold text-foreground flex items-center gap-1.5">
                  <Shield className="w-3.5 h-3.5 text-primary" /> Informativa Privacy
                </p>
                <p>I dati personali forniti (nome, telefono, indirizzo) saranno utilizzati esclusivamente per la gestione 
                e consegna dell'ordine. I dati non saranno ceduti a terzi né utilizzati per finalità di marketing 
                senza il tuo consenso esplicito.</p>
                <p>Il titolare del trattamento è il ristorante. Puoi esercitare i tuoi diritti (accesso, rettifica, 
                cancellazione) contattando direttamente il locale. I dati saranno conservati per il tempo 
                strettamente necessario alle finalità indicate.</p>
                <p>Questo sito utilizza cookie tecnici essenziali per il funzionamento del servizio. 
                Non vengono utilizzati cookie di profilazione.</p>
              </motion.div>
            )}
          </AnimatePresence>
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
          {loading ? "Invio ordine..." :
           paymentMethod === "apple" ? " Pay" : 
           paymentMethod === "google" ? "Google Pay" : 
           "Conferma Ordine"} · €{grandTotal.toFixed(2)}
        </motion.button>
      </div>
    </div>
  );
};

export default CheckoutPage;
