
-- Table for storing restaurant plate photos
CREATE TABLE public.restaurant_plates (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  restaurant_id UUID NOT NULL REFERENCES public.restaurants(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT 'Piatto senza nome',
  description TEXT,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.restaurant_plates ENABLE ROW LEVEL SECURITY;

-- Policies: restaurant members can CRUD
CREATE POLICY "Restaurant members can view plates"
ON public.restaurant_plates FOR SELECT
TO authenticated
USING (public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id) OR public.is_super_admin());

CREATE POLICY "Restaurant members can insert plates"
ON public.restaurant_plates FOR INSERT
TO authenticated
WITH CHECK (public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id));

CREATE POLICY "Restaurant members can update plates"
ON public.restaurant_plates FOR UPDATE
TO authenticated
USING (public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id));

CREATE POLICY "Restaurant members can delete plates"
ON public.restaurant_plates FOR DELETE
TO authenticated
USING (public.is_restaurant_member(restaurant_id) OR public.is_restaurant_owner(restaurant_id));

-- Trigger for updated_at
CREATE TRIGGER update_restaurant_plates_updated_at
BEFORE UPDATE ON public.restaurant_plates
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
