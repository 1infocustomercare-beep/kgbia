import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, X, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface ReviewFormProps {
  restaurantId: string;
}

const ReviewForm = ({ restaurantId }: ReviewFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [name, setName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Check if user already reviewed
  const hasReviewed = localStorage.getItem(`reviewed-${restaurantId}`);

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: "Seleziona le stelle", variant: "destructive" });
      return;
    }
    setSubmitting(true);

    try {
      const { error } = await supabase.from("reviews").insert({
        restaurant_id: restaurantId,
        rating,
        comment: comment.trim() || null,
        customer_name: name.trim() || "Anonimo",
        is_public: rating >= 4, // Auto-shield: only 4-5 stars are public
      } as any);

      if (error) throw error;

      setSubmitted(true);
      localStorage.setItem(`reviewed-${restaurantId}`, "true");
      
      setTimeout(() => {
        setIsOpen(false);
        toast({ 
          title: "Grazie per il feedback!", 
          description: rating >= 4 ? "La tua recensione è pubblica." : "Il tuo feedback è stato inviato al titolare." 
        });
      }, 2000);
    } catch (err) {
      toast({ title: "Errore", description: "Riprova più tardi.", variant: "destructive" });
    }
    setSubmitting(false);
  };

  if (hasReviewed && !isOpen) return null;

  return (
    <>
      {/* FAB Trigger */}
      {!isOpen && !submitted && (
        <motion.button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-24 left-5 z-30 w-12 h-12 rounded-full glass border border-primary/30 text-primary flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          <Star className="w-5 h-5 fill-primary/20" />
        </motion.button>
      )}

      {/* Modal */}
      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div 
              className="fixed inset-0 z-50 bg-background/60 backdrop-blur-sm"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              className="fixed bottom-0 inset-x-0 z-50 p-6 bg-card rounded-t-3xl border-t border-primary/20 shadow-2xl safe-bottom"
              initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-display font-bold text-foreground">Lascia una recensione</h3>
                <button onClick={() => setIsOpen(false)} className="p-2 rounded-full hover:bg-secondary">
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {submitted ? (
                <div className="text-center py-8">
                  <motion.div 
                    initial={{ scale: 0 }} animate={{ scale: 1 }} 
                    className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"
                  >
                    <Star className="w-8 h-8 text-green-500 fill-green-500" />
                  </motion.div>
                  <h4 className="text-xl font-bold text-foreground">Grazie!</h4>
                  <p className="text-sm text-muted-foreground mt-2">Il tuo feedback ci aiuta a migliorare.</p>
                </div>
              ) : (
                <div className="space-y-5">
                  <div className="flex justify-center gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setRating(star)}
                        className="p-1 focus:outline-none transition-transform hover:scale-110"
                      >
                        <Star 
                          className={`w-10 h-10 ${star <= rating ? "fill-primary text-primary" : "text-muted-foreground/30"}`} 
                        />
                      </button>
                    ))}
                  </div>

                  <input
                    type="text"
                    placeholder="Il tuo nome (opzionale)"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-secondary/50 text-foreground border-none focus:ring-2 focus:ring-primary/30"
                  />

                  <div className="relative">
                    <MessageSquare className="absolute top-3 left-3 w-4 h-4 text-muted-foreground" />
                    <textarea
                      placeholder="Raccontaci la tua esperienza..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-secondary/50 text-foreground min-h-[100px] resize-none border-none focus:ring-2 focus:ring-primary/30"
                    />
                  </div>

                  <motion.button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="w-full py-3.5 rounded-xl bg-primary text-primary-foreground font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    whileTap={{ scale: 0.98 }}
                  >
                    {submitting ? "Invio..." : <>Invia Recensione <Send className="w-4 h-4" /></>}
                  </motion.button>
                  
                  <p className="text-[10px] text-center text-muted-foreground">
                    Solo le recensioni a 4 o 5 stelle verranno rese pubbliche.
                  </p>
                </div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default ReviewForm;