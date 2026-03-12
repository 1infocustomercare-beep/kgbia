import { useIndustry } from "@/hooks/useIndustry";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

export default function ReviewsPage() {
  const { industry, company } = useIndustry();
  const queryClient = useQueryClient();

  // NCC reviews or food reviews
  const isNCC = industry === "ncc";

  const { data: restaurant } = useQuery({
    queryKey: ["my-rest-reviews"],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return null;
      const { data } = await supabase.from("restaurants").select("id").eq("owner_id", user.id).limit(1).maybeSingle();
      return data;
    },
    enabled: !isNCC,
  });

  const { data: foodReviews = [] } = useQuery({
    queryKey: ["reviews", restaurant?.id],
    queryFn: async () => {
      if (!restaurant?.id) return [];
      const { data } = await supabase.from("reviews").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: !isNCC && !!restaurant?.id,
  });

  const { data: nccReviews = [] } = useQuery({
    queryKey: ["ncc-reviews", company?.id],
    queryFn: async () => {
      if (!company?.id) return [];
      const { data } = await supabase.from("ncc_reviews").select("*").eq("company_id", company.id).order("created_at", { ascending: false });
      return data || [];
    },
    enabled: isNCC && !!company?.id,
  });

  const reviews = isNCC ? nccReviews : foodReviews;

  const avgRating = reviews.length > 0
    ? (reviews.reduce((s: number, r: any) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "—";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold font-heading">Recensioni</h1>
        <div className="flex items-center gap-2">
          <Star className="w-5 h-5 text-primary fill-primary" />
          <span className="text-xl font-bold">{avgRating}</span>
          <span className="text-sm text-muted-foreground">({reviews.length} recensioni)</span>
        </div>
      </div>

      {reviews.length === 0 ? (
        <Card className="border-dashed border-border/50"><CardContent className="p-8 text-center text-muted-foreground">
          <Star className="w-8 h-8 mx-auto mb-2 opacity-50" />Nessuna recensione ancora.
        </CardContent></Card>
      ) : (
        <div className="grid gap-3">
          {reviews.map((r: any) => (
            <Card key={r.id} className="border-border/50">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{r.customer_name || "Anonimo"}</span>
                      <div className="flex">{Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? "text-primary fill-primary" : "text-muted"}`} />
                      ))}</div>
                      <Badge variant={r.is_public ? "default" : "outline"}>
                        {r.is_public ? "Pubblica" : "Nascosta"}
                      </Badge>
                    </div>
                    {r.comment && <p className="text-sm text-muted-foreground">{r.comment}</p>}
                    <p className="text-xs text-muted-foreground mt-1">{new Date(r.created_at).toLocaleDateString("it-IT")}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
