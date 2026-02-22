
-- Add email and opening_hours columns to restaurants
ALTER TABLE public.restaurants
  ADD COLUMN IF NOT EXISTS email text DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS opening_hours jsonb DEFAULT '[
    {"day":"Lunedì","hours":"12:00 - 15:00 · 19:00 - 23:30"},
    {"day":"Martedì","hours":"12:00 - 15:00 · 19:00 - 23:30"},
    {"day":"Mercoledì","hours":"12:00 - 15:00 · 19:00 - 23:30"},
    {"day":"Giovedì","hours":"12:00 - 15:00 · 19:00 - 23:30"},
    {"day":"Venerdì","hours":"12:00 - 15:00 · 19:00 - 23:30"},
    {"day":"Sabato","hours":"12:00 - 15:30 · 19:00 - 24:00"},
    {"day":"Domenica","hours":"Chiuso"}
  ]'::jsonb;
