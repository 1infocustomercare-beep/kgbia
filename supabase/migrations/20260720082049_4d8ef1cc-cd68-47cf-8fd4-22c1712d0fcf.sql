ALTER PUBLICATION supabase_realtime DROP TABLE public.customer_blacklist;
ALTER PUBLICATION supabase_realtime DROP TABLE public.reviews;
ALTER PUBLICATION supabase_realtime DROP TABLE public.seller_demo_vault;
DROP POLICY IF EXISTS "Users can delete own media vault files" ON storage.objects;