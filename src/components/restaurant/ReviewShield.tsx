import { motion } from "framer-motion";
import { Star, Shield, ExternalLink } from "lucide-react";

const ReviewShield = () => {
  const reviews = [
    { name: "Giulia M.", stars: 5, text: "Pasta incredibile! Torneremo sicuramente. Il tartufo era divino.", date: "2 ore fa", public: true },
    { name: "Andrea P.", stars: 5, text: "Miglior pizza di Roma, impasto perfetto.", date: "5 ore fa", public: true },
    { name: "Paolo T.", stars: 2, text: "Servizio lento, pizza fredda.", date: "1 giorno fa", public: false },
    { name: "Francesca R.", stars: 4, text: "Ottima carne, ambiente accogliente e personale gentile.", date: "2 giorni fa", public: true },
    { name: "Luca G.", stars: 1, text: "Attesa di 50 minuti per un antipasto.", date: "3 giorni fa", public: false },
  ];

  return (
    <div className="space-y-4">
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Review Shield</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Solo le recensioni 4-5★ vengono inviate a Google. Le altre restano private per il tuo miglioramento.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-card text-center">
          <p className="text-xl font-display font-bold text-primary">4.7</p>
          <p className="text-xs text-muted-foreground">Media</p>
        </div>
        <div className="p-3 rounded-xl bg-card text-center">
          <p className="text-xl font-display font-bold text-foreground">127</p>
          <p className="text-xs text-muted-foreground">Totali</p>
        </div>
        <div className="p-3 rounded-xl bg-card text-center">
          <p className="text-xl font-display font-bold text-green-400">89%</p>
          <p className="text-xs text-muted-foreground">Positive</p>
        </div>
      </div>

      {/* Reviews */}
      <div className="space-y-2">
        {reviews.map((review, i) => (
          <motion.div
            key={i}
            className={`p-3 rounded-xl ${review.public ? "bg-card" : "bg-accent/5 border border-accent/15"}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{review.name}</span>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < review.stars ? "text-primary fill-primary" : "text-muted"}`} />
                ))}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">{review.text}</p>
            <div className="mt-1.5">
              {review.public ? (
                <span className="inline-flex items-center gap-1 text-xs text-green-400">
                  <ExternalLink className="w-3 h-3" /> Su Google
                </span>
              ) : (
                <span className="text-xs text-accent">🔒 Privata</span>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewShield;
