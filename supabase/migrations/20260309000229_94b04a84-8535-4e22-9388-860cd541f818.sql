DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'business_type') THEN
    CREATE TYPE public.business_type AS ENUM ('restaurant','pizzeria','bar','bakery','sushi');
  END IF;
END$$;

ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS business_type public.business_type NOT NULL DEFAULT 'restaurant';

CREATE INDEX IF NOT EXISTS idx_restaurants_business_type ON public.restaurants (business_type);
