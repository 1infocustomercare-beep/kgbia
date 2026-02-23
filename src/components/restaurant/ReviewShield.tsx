import { motion } from "framer-motion";
import { Star, Shield, ExternalLink } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface ReviewShieldProps {
  restaurantId?: string;
}

const ReviewShield = ({ restaurantId }: ReviewShieldProps) => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!restaurantId) return;
    const fetchReviews = async () => {
      const { data } = await supabase
        .from("reviews")
        .select("*")
        .eq("restaurant_id", restaurantId)
        .order("created_at", { ascending: false })
        .limit(10);
      
      if (data) setReviews(data);
      setLoading(false);
    };
    fetchReviews();
  }, [restaurantId]);

  if (!restaurantId || (reviews.length === 0 && !loading)) return null;

  const publicReviews = reviews.filter(r => r.is_public);
  const avgRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) 
    : "—";
  
  const totalReviews = reviews.length;
  const positiveReviews = reviews.filter(r => r.rating >= 4).length;
  const positivePercent = totalReviews > 0 ? Math.round((positiveReviews / totalReviews) * 100) : 0;

  return (
    <div className="space-y-4 mb-8">
      <div className="p-4 rounded-2xl bg-primary/5 border border-primary/20">
        <div className="flex items-center gap-2 mb-1">
          <Shield className="w-5 h-5 text-primary" />
          <h3 className="font-display font-bold text-foreground">Review Shield</h3>
        </div>
        <p className="text-xs text-muted-foreground">
          Recensioni verificate e filtrate.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-2">
        <div className="p-3 rounded-xl bg-card text-center border border-border/50">
          <p className="text-xl font-display font-bold text-primary">{avgRating}</p>
          <p className="text-xs text-muted-foreground">Media</p>
        </div>
        <div className="p-3 rounded-xl bg-card text-center border border-border/50">
          <p className="text-xl font-display font-bold text-foreground">{totalReviews}</p>
          <p className="text-xs text-muted-foreground">Totali</p>
        </div>
        <div className="p-3 rounded-xl bg-card text-center border border-border/50">
          <p className="text-xl font-display font-bold text-green-400">{positivePercent}%</p>
          <p className="text-xs text-muted-foreground">Positive</p>
        </div>
      </div>

      {/* Reviews List - Only Public */}
      <div className="space-y-2">
        {publicReviews.map((review, i) => (
          <motion.div
            key={review.id}
            className="p-3 rounded-xl bg-card border border-border/50"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-foreground">{review.customer_name || "Cliente"}</span>
                <span className="text-xs text-muted-foreground">
                  {new Date(review.created_at).toLocaleDateString("it-IT")}
                </span>
              </div>
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <Star key={j} className={`w-3 h-3 ${j < review.rating ? "text-primary fill-primary" : "text-muted"}`} />
                ))}
              </div>
            </div>
            {review.comment && <p className="text-xs text-muted-foreground">{review.comment}</p>}
            <div className="mt-1.5">
              <span className="inline-flex items-center gap-1 text-xs text-green-400">
                <ExternalLink className="w-3 h-3" /> Verificata
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ReviewShield;