import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface RestaurantInfo {
  id: string;
  name: string;
  slug: string;
  logo_url: string | null;
  tagline: string | null;
  primary_color: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  email: string | null;
  opening_hours: { day: string; hours: string }[] | null;
}

export function useMyRestaurant() {
  const { user } = useAuth();
  const [restaurant, setRestaurant] = useState<RestaurantInfo | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetch = async () => {
      // Check if user owns a restaurant (use maybeSingle to avoid 406)
      const { data } = await supabase
        .from("restaurants")
        .select("id, name, slug, logo_url, tagline, primary_color, phone, address, city, email, opening_hours")
        .eq("owner_id", user.id)
        .limit(1)
        .maybeSingle();

      if (data) {
        setRestaurant({ ...data, opening_hours: data.opening_hours as any });
      } else {
        // Check memberships
        const { data: membership } = await supabase
          .from("restaurant_memberships")
          .select("restaurant_id")
          .eq("user_id", user.id)
          .limit(1)
          .maybeSingle();

        if (membership) {
          const { data: rest } = await supabase
            .from("restaurants")
            .select("id, name, slug, logo_url, tagline, primary_color, phone, address, city, email, opening_hours")
            .eq("id", membership.restaurant_id)
            .maybeSingle();

          if (rest) setRestaurant({ ...rest, opening_hours: rest.opening_hours as any });
        }
      }
      setLoading(false);
    };

    fetch();
  }, [user]);

  return { restaurant, loading };
}
