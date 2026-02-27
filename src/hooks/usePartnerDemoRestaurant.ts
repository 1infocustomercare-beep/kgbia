import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/context/AuthContext";

interface DemoRestaurant {
  id: string;
  name: string;
  slug: string;
  primary_color: string | null;
  logo_url: string | null;
}

export function usePartnerDemoRestaurant() {
  const { user } = useAuth();
  const [demoRestaurant, setDemoRestaurant] = useState<DemoRestaurant | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchDemo = async () => {
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from("restaurants")
      .select("id, name, slug, primary_color, logo_url")
      .eq("owner_id", user.id)
      .like("slug", "demo-partner-%")
      .limit(1)
      .maybeSingle();
    setDemoRestaurant(data);
    setLoading(false);
  };

  useEffect(() => { fetchDemo(); }, [user]);

  return { demoRestaurant, loading, refetch: fetchDemo };
}
