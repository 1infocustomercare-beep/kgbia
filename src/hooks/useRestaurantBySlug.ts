import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { MenuItem } from "@/types/restaurant";
import { normalizeBusinessType, type BusinessType } from "@/lib/business-type";

interface RestaurantData {
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
  languages: string[] | null;
  min_order_amount: number | null;
  blocked_keywords: string[] | null;
  is_blocked: boolean;
  blocked_reason: string | null;
  business_type: BusinessType;
}

export function useRestaurantBySlug(slug: string | undefined) {
  const [restaurant, setRestaurant] = useState<RestaurantData | null>(null);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      setLoading(true);

      // Fetch restaurant
      const { data: rest, error: restErr } = await supabase
        .from("restaurants")
        .select(
          "id, name, slug, logo_url, tagline, primary_color, phone, address, city, email, opening_hours, languages, min_order_amount, blocked_keywords, is_blocked, blocked_reason, business_type",
        )
        .eq("slug", slug)
        .eq("is_active", true)
        .maybeSingle();

      if (restErr || !rest) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      setRestaurant({
        ...(rest as any),
        business_type: normalizeBusinessType((rest as any).business_type),
        opening_hours: (rest as any).opening_hours as any,
      });

      // Fetch menu items
      const { data: items } = await supabase
        .from("menu_items")
        .select("*")
        .eq("restaurant_id", rest.id)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });

      if (items && items.length > 0) {
        const mapped: MenuItem[] = items.map((i) => ({
          id: i.id,
          name: i.name,
          description: i.description || "",
          price: Number(i.price),
          image: i.image_url || "",
          category: i.category,
          allergens: i.allergens || [],
          isPopular: i.is_popular,
        }));
        setMenuItems(mapped);

        const cats = [...new Set(items.map((i) => i.category))];
        setCategories(cats);
      }

      setLoading(false);
    };

    fetchData();

    // Realtime subscription for menu, restaurant, and review updates
    const channel = supabase
      .channel(`restaurant-${slug}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "menu_items" }, () => {
        if (slug) fetchData();
      })
      .on("postgres_changes", { event: "UPDATE", schema: "public", table: "restaurants" }, (payload) => {
        if ((payload.new as any)?.slug === slug) fetchData();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [slug]);

  return { restaurant, menuItems, categories, loading, notFound };
}
