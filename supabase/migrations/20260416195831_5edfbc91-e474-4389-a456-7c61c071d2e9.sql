
-- Dedup: keep newest row per (owner_id, lower(name))
DELETE FROM public.leads l
USING public.leads l2
WHERE l.owner_id IS NOT NULL
  AND l.owner_id = l2.owner_id
  AND lower(l.name) = lower(l2.name)
  AND l.created_at < l2.created_at;

-- Prevent future duplicates per seller (case-insensitive)
CREATE UNIQUE INDEX IF NOT EXISTS leads_owner_name_unique
  ON public.leads (owner_id, lower(name))
  WHERE owner_id IS NOT NULL;
